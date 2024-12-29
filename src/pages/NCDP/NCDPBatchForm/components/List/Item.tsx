import { memo, useRef, useState } from 'react';
import { InstSearch, InstSearchProvider, useInstSearch } from '@fepkg/business/components/Search/InstSearch';
import {
  FRTypeOptions,
  IssuerDateTypeOptions,
  MaturityDateTypeOptions,
  RatingOptions
} from '@fepkg/business/constants/options';
import { Combination } from '@fepkg/components/Combination';
import { Input } from '@fepkg/components/Input';
import { Select } from '@fepkg/components/Select';
import { Tooltip } from '@fepkg/components/Tooltip';
import { APIs } from '@fepkg/services/apis';
import { InstitutionLite } from '@fepkg/services/types/common';
import { InstList } from '@fepkg/services/types/crm/inst-list';
import { FRType, InstStatus, Rating, UsageStatus } from '@fepkg/services/types/enum';
import { v4 } from 'uuid';
import { checkVolumeValid } from '@/components/business/Quote/utils';
import { NCDPBatchFormListItem, NCDPBatchFormListProps } from '../../types';
import { getDefaultInst } from '../../utils';
import { Action } from './Action';

/** 数量校验正则（亿）,0-9_9999.99 */
const VOLUME_REGEX = /^$|^(0|[1-9](\d?){1,4})(\.\d{0,2})?$/;
/** 固息价格校验正则，0-99.99 */
const FRD_PRICE_REGEX = /^$|^(0|[1-9](\d?))(\.\d{0,2})?$/;
/** 浮息价格校验正则，-9999-9999 */
const SHIBOR_PRICE_REGEX = /^(-?)$|^(-?)(0|[1-9](\d?){1,3})?$/;

const FRTypeFilteredOptions = FRTypeOptions.filter(opt => [FRType.FRD, FRType.Shibor].includes(opt.value)).reverse();

const RatingFilteredOptions = RatingOptions.filter(opt => ![Rating.AAAPlus, Rating.AAAMinus].includes(opt.value));

const selectProps = {
  className: 'w-[92px]',
  size: 'sm',
  clearIcon: null,
  firstActive: true,
  changeByTab: true,
  destroyOnClose: true,
  ancestorScroll: true
} as const;

const instSearchParams: InstList.Request = {
  product_list: ['NCDP'],
  usage_status_list: [UsageStatus.Using],
  inst_status: [InstStatus.StartBiz],
  flag_issuer: true
};

const Inner = ({
  index,
  showIndex,
  showDelete,
  defaultIssuerDateType,
  value,
  onUpdate
}: NCDPBatchFormListProps.Item) => {
  const { updateInstSearchState } = useInstSearch<InstitutionLite>();

  const ratingRef = useRef<HTMLInputElement>(null);
  const maturityDateRef = useRef<HTMLInputElement>(null);
  const frTypeRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const commentRef = useRef<HTMLInputElement>(null);

  const [isCommentFocus, setIsCommentFocus] = useState(false);

  const isShibor = value?.fr_type === FRType.Shibor;
  const unit = isShibor ? 'bp' : '%';
  const priceRegex = isShibor ? SHIBOR_PRICE_REGEX : FRD_PRICE_REGEX;

  const update = <T extends keyof NCDPBatchFormListItem>(field: T, val: NCDPBatchFormListItem[T]) => {
    onUpdate(draft => {
      draft[index][field] = val;
    });
  };

  return (
    <div className="flex items-center gap-1 px-2.5 text-gray-000">
      {showIndex && <div className="flex-center w-10">{index + 1}</div>}

      {/* 发行机构 */}
      <InstSearch<InstitutionLite, InstList.Request>
        api={APIs.crm.instList}
        className="w-[140px] h-7"
        label=""
        placeholder=""
        searchParams={instSearchParams}
        destroyOnClose
        ancestorScroll={false}
        onlyRemoteQuery
        onChange={opt => {
          updateInstSearchState(draft => {
            draft.selected = opt ?? null;
          });

          onUpdate(draft => {
            draft[index].inst_id = opt?.original?.inst_id;
            if (opt?.original?.issuer_rating) draft[index].issuer_rating_current = opt?.original?.issuer_rating;
          });

          if (opt) ratingRef?.current?.focus();
        }}
      />

      {/* 评级 */}
      <Select
        {...selectProps}
        ref={ratingRef}
        className="w-[88px]"
        options={RatingFilteredOptions}
        value={value?.issuer_rating_current}
        onChange={val => {
          update('issuer_rating_current', val);
          maturityDateRef.current?.focus();
        }}
      />

      {/* 期限 */}
      <Select
        {...selectProps}
        ref={maturityDateRef}
        options={MaturityDateTypeOptions}
        value={value?.maturity_date}
        onChange={val => {
          update('maturity_date', val);
          frTypeRef.current?.focus();
        }}
      />

      {/* 价格 */}
      <Combination
        containerCls="w-[192px]"
        size="sm"
        prefixNode={
          <Select<FRType>
            {...selectProps}
            ref={frTypeRef}
            className="w-[92px] bg-gray-600"
            clearIcon={null}
            defaultValue={FRType.FRD}
            options={FRTypeFilteredOptions}
            value={value?.fr_type}
            onChange={val => {
              onUpdate(draft => {
                draft[index].fr_type = val;
                draft[index].price = '' as unknown as number;

                priceRef?.current?.select();
              });
            }}
          />
        }
        suffixNode={
          <Combination
            containerCls="[&_.s-combination-suffix]:text-gray-100"
            size="sm"
            background="prefix700-suffix600"
            prefixNode={
              <Input
                ref={priceRef}
                className="w-[68px] !rounded-none"
                clearIcon={null}
                value={(value?.price as unknown as string) ?? ''}
                onChange={val => {
                  const [valid, price] = checkVolumeValid(val, priceRegex);
                  if (valid) update('price', price as unknown as number);
                }}
              />
            }
            suffixNode={unit}
          />
        }
      />

      {/* 数量(亿) */}
      <Input
        className="w-[112px] h-7"
        value={(value?.volume as unknown as string) ?? ''}
        onChange={val => {
          const [valid, volume] = checkVolumeValid(val, VOLUME_REGEX);
          if (valid) update('volume', volume as unknown as number);
        }}
      />

      {/* 发行日期 */}
      <Select
        {...selectProps}
        clearIcon={null}
        options={IssuerDateTypeOptions}
        defaultValue={defaultIssuerDateType}
        value={value?.issuer_type}
        onChange={val => {
          update('issuer_type', val);
          commentRef.current?.select();
        }}
      />

      {/* 备注 */}
      <Tooltip
        open={isCommentFocus ? false : undefined}
        placement="top-start"
        truncate
        content={value?.comment}
        destroyOnClose
      >
        <Input
          ref={commentRef}
          className="w-30 h-7 [&_.s-input]:px-[11px] [&_.s-input]:truncate"
          padding={0}
          maxLength={30}
          value={value?.comment}
          onChange={val => update('comment', val)}
          onFocus={() => setIsCommentFocus(true)}
          onBlur={() => setIsCommentFocus(false)}
        />
      </Tooltip>

      <Action
        brokerage={value?.flag_brokerage}
        internal={value?.flag_internal}
        showDelete={showDelete}
        onBrokerage={() => update('flag_brokerage', !value?.flag_brokerage)}
        onInternal={() => update('flag_internal', !value?.flag_internal)}
        onDelete={() => {
          onUpdate(draft => {
            draft[index] = { key: v4() };
          });
        }}
      />
    </div>
  );
};

const checkFields = [
  'inst_id',
  'issuer_rating_current',
  'maturity_date',
  'fr_type',
  'price',
  'volume',
  'issuer_date',
  'issuer_type',
  'comment',
  'flag_internal',
  'flag_brokerage'
];

export const Item = memo(
  (props: NCDPBatchFormListProps.Item) => {
    return (
      <InstSearchProvider<InstitutionLite>
        initialState={{ defaultValue: props?.value?.inst_id ? getDefaultInst(props?.value) : undefined }}
      >
        <Inner {...props} />
      </InstSearchProvider>
    );
  },
  (prev, next) => {
    for (const key of checkFields) {
      if (prev.value[key] !== next.value[key]) return false;
    }
    return true;
  }
);
