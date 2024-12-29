import { useMemo, useState } from 'react';
import cx from 'classnames';
import { Button } from '@fepkg/components/Button';
import { Caption } from '@fepkg/components/Caption';
import { Combination } from '@fepkg/components/Combination';
import { Input } from '@fepkg/components/Input';
import { Placeholder } from '@fepkg/components/Placeholder';
import { IconAdd, IconCloseCircleFilled, IconDelete, IconEdit } from '@fepkg/icon-park-react';
import { isNumber } from 'lodash-es';
import { FeeType, useAgency } from './provider';

const Header = () => {
  const { selectId, costIsEditing, costs, setCostIsEditing, save, setErrorIdx, setErrorType } = useAgency();
  return (
    <div className="h-10 flex items-center justify-between text-gray-000 text-sm">
      <Caption type="orange">费率设置</Caption>
      {costIsEditing ? (
        <div className="flex items-center gap-2">
          <Button
            plain
            type="gray"
            className="w-16 h-6 px-0"
            onClick={() => {
              costs.refetch();
              setCostIsEditing(false);
              setErrorIdx(void 0);
              setErrorType(void 0);
            }}
          >
            取消
          </Button>
          <Button
            plain
            className="w-16 h-6 px-0"
            onClick={save}
          >
            保存
          </Button>
        </div>
      ) : (
        <Button
          icon={<IconEdit />}
          plain
          disabled={!selectId}
          className="w-18 h-6 px-0"
          onClick={() => {
            setCostIsEditing(true);
          }}
        >
          编辑
        </Button>
      )}
    </div>
  );
};

const REGEX = /^((\d)|([1-9]\d)|(1\d{2})|(2\d{2})|(3[0-5]\d)|(36[0-5]))((\.)?|(\.\d{0,2}))[DYdy]?$/;

const Item = ({ idx, value }: { value: FeeType; idx: number }) => {
  const { update, del, errorIdx, errorType, costIsEditing } = useAgency();
  const [inputFocus, setInputFocus] = useState(false);
  const [inputHover, setInputHover] = useState(false);

  const disabled = !costIsEditing;
  const timeError = errorIdx === idx && errorType === 'term';

  // input的焦点事件
  const inputBaseProps = {
    onFocus: () => setInputFocus(true),
    onBlur: () => setInputFocus(false)
  };

  return (
    <div className="flex flex-row gap-2">
      <div
        className={cx(
          'w-60 flex items-center h-7 rounded-lg border border-transparent border-solid focus-within:border-primary-100',
          inputFocus &&
            (timeError
              ? '!bg-danger-700 [&_.s-input-container]:!bg-danger-700'
              : 'bg-primary-700 border-primary-000 [&_.s-input-container]:!bg-primary-700'),
          // 错误状态时边框一直为danger
          timeError && '!border-danger-100',
          disabled ? 'bg-gray-600' : 'bg-gray-800 [&_.s-input-container]:bg-gray-800 hover:border-primary-100'
        )}
        onMouseEnter={() => setInputHover(true)}
        onMouseLeave={() => setInputHover(false)}
      >
        <Input
          disabled={disabled}
          placeholder="请输入"
          className="h-[26px] !border-0 text-gray-000"
          error={timeError}
          value={value.start}
          onChange={val => {
            if (val && !REGEX.test(val)) return;
            update(idx, 'start', val);
          }}
          clearIcon={null}
          {...inputBaseProps}
        />

        <span className={cx('min-w-[60px] h-[26px] text-gray-200 flex items-center', disabled && '!bg-gray-600')}>
          {'< 期限 ≤'}
        </span>

        <Input
          disabled={disabled}
          placeholder="请输入"
          className="h-[26px] !border-0 text-gray-000"
          error={timeError}
          value={value.end}
          onChange={val => {
            if (val && !REGEX.test(val)) return;
            update(idx, 'end', val);
          }}
          clearIcon={null}
          // 用suffixIcon代替clearIcon
          suffixIcon={
            <IconCloseCircleFilled
              className={cx(
                timeError ? 'text-danger-300 hover:text-danger-000' : 'text-primary-300 hover:text-primary-000',
                !disabled && (inputFocus || inputHover) && (value.start || value.end) ? '' : 'hidden'
              )}
              onClick={() => {
                update(idx, 'start', '');
                update(idx, 'end', '');
              }}
            />
          }
          {...inputBaseProps}
        />
      </div>

      {/* new */}
      <Combination
        size="sm"
        containerCls="w-[200px]"
        disabled={disabled}
        prefixNode={
          <Input
            disabled={disabled}
            placeholder="请输入"
            label="费用"
            error={errorIdx === idx && errorType === 'rate'}
            className="w-[166px] text-gray-000"
            value={isNumber(value.fee) ? String(value.fee) : value.fee}
            onChange={val => {
              const rg = /^\d{0,2}((\.)?|(\.\d{0,2}))?$/;
              if (val && !rg.test(val)) return;
              update(idx, 'fee', val);
            }}
          />
        }
        suffixNode="厘"
      />

      {!disabled && (
        <Button.Icon
          text
          className="w-7 h-7"
          icon={<IconDelete />}
          onClick={() => {
            del(idx);
          }}
        />
      )}
    </div>
  );
};

export const RateSetting = () => {
  const { costList, costIsEditing, add } = useAgency();

  return (
    <div className="w-[504px] px-3 relative">
      <Header />
      <div className="component-dashed-x" />

      <div className="flex flex-col gap-2 mt-2 h-[278px] overflow-y-overlay">
        {costList?.length ? (
          costList?.map((v, i) => {
            return (
              <Item
                key={v.key}
                value={v}
                idx={i}
              />
            );
          })
        ) : (
          <div className="mt-[90px]">
            <Placeholder
              size="xs"
              type="no-setting"
              label="暂未配置费率"
            />
          </div>
        )}
      </div>

      {costIsEditing && (
        <>
          <div className="component-dashed-x" />
          <div className="absolute bottom-0 w-[504px] h-10 flex items-center">
            <Button
              icon={<IconAdd />}
              plain
              type="gray"
              onClick={add}
            >
              添加费率
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
