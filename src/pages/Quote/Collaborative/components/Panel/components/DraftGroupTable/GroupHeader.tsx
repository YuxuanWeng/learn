import { useMemo, useRef, useState } from 'react';
import cx from 'classnames';
import { SERVER_NIL } from '@fepkg/common/constants';
import { BadgeV2 } from '@fepkg/components/BadgeV2';
import { Button } from '@fepkg/components/Button';
import { Checkbox } from '@fepkg/components/Checkbox';
import { GroupRowData } from '@fepkg/components/Table';
import { Tooltip } from '@fepkg/components/Tooltip';
import {
  IconCoordinatedQuotation,
  IconDelete,
  IconGroupChat,
  IconIQuote,
  IconLoading,
  IconRightDouble,
  IconSubmit
} from '@fepkg/icon-park-react';
import { BondQuoteType, OperationSource, QuoteDraftIgnoreType, UserSettingFunction } from '@fepkg/services/types/enum';
import { QuoteDraftDetail, QuoteDraftMessage } from 'app/types/DataLocalization/local-common';
import { DialogChannelAction } from 'app/types/dialog-v2';
import { useSetAtom } from 'jotai';
import { useParentPort } from '@/common/atoms';
import { mulUpdateBondQuoteDraftDetail } from '@/common/services/api/bond-quote-draft/detail-mul-update';
import { mulUpdateBondQuoteDraftDetailById } from '@/common/services/api/bond-quote-draft/detail-mul-update-by-id';
import { updateBondQuoteDraftMessage } from '@/common/services/api/bond-quote-draft/message-update';
import { mulIgnoreBondQuoteDraft } from '@/common/services/api/bond-quote-draft/mul-ignore';
import { LocalQuoteDraftDetail } from '@/common/services/hooks/local-server/quote-draft/types';
import { useUserSetting } from '@/common/services/hooks/useSettings/useUserSetting';
import { BrokerSearch, BrokerSearchProvider, useBrokerSearch } from '@/components/business/Search/BrokerSearch';
import {
  InstTraderSearch,
  InstTraderSearchProvider,
  useInstTraderSearch
} from '@/components/business/Search/InstTraderSearch';
import { TraderPreferenceProvider } from '@/components/business/Search/TraderSearch';
import {
  CPBSearchConnectorProvider,
  useCPBSearchConnector
} from '@/components/business/Search/providers/CPBSearchConnectorProvider';
import { useProductParams } from '@/layouts/Home/hooks';
import { miscStorage } from '@/localdb/miscStorage';
import { CoQuoteVolumeSetting } from '@/pages/Base/SystemSetting/components/QuoteSettings/types';
import { originalTextMdlOpenAtom, originalTextMdlTargetMessageAtom } from '@/pages/Quote/Collaborative/atoms/modal';
import { useDraftAction } from '@/pages/Quote/Collaborative/hooks/useDraftAction';
import { useOriginalTextReadStatusCache } from '@/pages/Quote/Collaborative/hooks/useOriginalTextReadStatusCache';
import { useTableState } from '@/pages/Quote/Collaborative/providers/TableStateProvider';
import { DraftGroupTableMessageData } from '@/pages/Quote/Collaborative/types/table';
import { isOtherProcessing, isPendingStatus, updateMessageDetails } from '@/pages/Quote/Collaborative/utils';
import { checkUtils } from '@/pages/Quote/Collaborative/utils/check';
import { transform2TraderLite, transform2TraderWithTag } from '@/pages/Quote/SingleQuote/utils';

const defaultSearchProps = { label: '', padding: [2, 12], updateByOpen: true, ancestorScroll: true };

type GroupHeaderProps = {
  rowData: GroupRowData & DraftGroupTableMessageData;
};

const sourceIconMap = {
  [OperationSource.OperationSourceQuickChat]: <IconIQuote />,
  [OperationSource.OperationSourceQuoteDraft]: <IconCoordinatedQuotation />,
  [OperationSource.OperationSourceQQGroup]: <IconGroupChat />
};

const Inner = ({ rowData }: GroupHeaderProps) => {
  const { post } = useParentPort();
  const { instTraderSearchState } = useInstTraderSearch();
  const { brokerSearchState } = useBrokerSearch();
  const { handleInstTraderChange, handleBrokerChange } = useCPBSearchConnector();

  const { getSetting } = useUserSetting([UserSettingFunction.UserSettingCoQuoteVolume]);
  const coQuoteVolumeSetting = useMemo(() => {
    const res = getSetting<CoQuoteVolumeSetting>(UserSettingFunction.UserSettingCoQuoteVolume);
    return { limit: +(res?.limit?.value ?? 0), target: +(res?.target?.value ?? 0) };
  }, [getSetting]);
  const { panelId, productType } = useProductParams();
  const { followingBrokerIds, operable, updateKeepingTimestamp } = useTableState();
  const { confirmMessage } = useDraftAction();
  const {
    initialized: readStatusCacheInitialized,
    readMessageIds,
    updateReadMessageIds
  } = useOriginalTextReadStatusCache();
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const setOriginalTextMdlOpen = useSetAtom(originalTextMdlOpenAtom);
  const setOriginalTextMdlTargetMessage = useSetAtom(originalTextMdlTargetMessageAtom);

  const message = rowData.original;
  const { message_id, inst_info, trader_info, operator_info, modified_status, detail_order_list, img_url } = message;
  const { inst_id } = inst_info ?? {};
  const { trader_id, name_zh } = trader_info ?? {};

  const showPost = inst_id && trader_id && name_zh;

  /** 是否能够确认 */
  const showConfirm = operable && !!rowData.original.detail_list?.length;

  /** 展示查看原文按钮红点提醒 */
  const showOriginalTextDot = useMemo(() => {
    if (!readStatusCacheInitialized) return false;
    if (!detail_order_list?.length && !img_url) return false;
    return (
      !readMessageIds?.has(message_id) &&
      // 如果 detail_order_list 中有未识别的
      !!(
        detail_order_list?.some(item => !item?.detail_id_list?.length && !item?.with_trader_info) ||
        // 或者没有 detail_order_list，但有 img_url，说明图片没有识别出数据，也需要展示红点信息
        (!detail_order_list?.length && img_url)
      )
    );
  }, [readStatusCacheInitialized, detail_order_list, img_url, message_id, readMessageIds]);

  const otherProcessing = isOtherProcessing(operator_info?.user_id, modified_status);

  const changeMessage = (updated: Partial<QuoteDraftMessage>) => {
    checkUtils.checkOtherProcessing({ otherProcessing });

    updateKeepingTimestamp();

    updated = { ...message, ...updated };

    updateBondQuoteDraftMessage({
      message: {
        message_id,
        inst_id: updated?.inst_info?.inst_id ?? '',
        trader_id: updated?.trader_info?.trader_id ?? '',
        trader_tag: updated?.trader_info?.trader_tag,
        broker_id: updated?.broker_info?.user_id ?? ''
      }
    });
  };

  const handlePost = () => {
    if (!(inst_id && trader_id && name_zh)) return;

    post({
      action: DialogChannelAction.UpdateGlobalSearch,
      panelId,
      user_input: `TJ:${name_zh}`,
      trader_id_list: [trader_id]
    });
  };

  const handleVolumeChange = () => {
    checkUtils.checkOtherProcessing({ otherProcessing });

    updateKeepingTimestamp();

    const detail_id_list: string[] = [];
    const update_info = { volume: coQuoteVolumeSetting.target };

    updateMessageDetails({
      message,
      changer: detail => {
        if ((detail?.volume ?? 0) >= coQuoteVolumeSetting.limit) {
          detail_id_list.push(detail.detail_id);
          return { ...detail, ...update_info };
        }
        return detail;
      }
    });

    if (!detail_id_list.length) return;

    mulUpdateBondQuoteDraftDetailById({ detail_id_list, update_info });
  };

  const handleIntentionChange = () => {
    checkUtils.checkOtherProcessing({ otherProcessing });

    updateKeepingTimestamp();

    const updated = updateMessageDetails({
      message,
      changer: detail => {
        return {
          ...detail,
          quote_type: BondQuoteType.Yield,
          price: SERVER_NIL,
          return_point: SERVER_NIL,
          flag_intention: true,
          flag_rebate: false
        };
      }
    });

    const detail_list = updated?.detail_list?.filter(detail => isPendingStatus(detail?.status));
    if (!detail_list?.length) return;

    mulUpdateBondQuoteDraftDetail({ detail_list });
  };

  const toggleFieldValue = (field: keyof LocalQuoteDraftDetail, value: boolean) => {
    checkUtils.checkOtherProcessing({ otherProcessing });

    updateKeepingTimestamp();

    const updated = updateMessageDetails({ message, field, value });

    const detail_id_list = updated.detail_list?.map(d => d.detail_id);
    const update_info = { [field]: value };

    if (!detail_id_list?.length) return;

    mulUpdateBondQuoteDraftDetailById({ detail_id_list, update_info });
  };

  const ignoreMessage = async () => {
    updateKeepingTimestamp();

    await mulIgnoreBondQuoteDraft({
      ignore_type: QuoteDraftIgnoreType.QuoteDraftIgnoreTypeMessage,
      creator_id_list: followingBrokerIds,
      message_id_list: [message_id],
      request_time: Date.now().toString()
    });
  };

  const handleOriginalTextMdlShow = () => {
    updateKeepingTimestamp();

    setOriginalTextMdlOpen(true);
    setOriginalTextMdlTargetMessage(message);

    updateReadMessageIds(message_id);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <InstTraderSearch
          className="!w-45 text-gray-000 font-medium bg-gray-800 aria-disabled:!border-gray-500"
          placeholder="机构(交易员)"
          searchParams={{ with_broker: true }}
          preferenceHighlight
          disabled={!showConfirm}
          {...defaultSearchProps}
          onChange={opt => {
            handleInstTraderChange(opt, (inst, trader, broker) => {
              changeMessage({
                inst_info: inst,
                trader_info: transform2TraderLite(productType, trader),
                broker_info: broker
              });
            });
          }}
        />

        <IconRightDouble
          size={24}
          className={cx(
            showPost ? 'text-primary-200 hover:text-primary-100 cursor-pointer' : 'text-primary-400 cursor-not-allowed'
          )}
          onClick={handlePost}
        />

        <BrokerSearch
          className="w-30 text-gray-000 font-medium bg-gray-800 aria-disabled:!border-gray-500"
          {...defaultSearchProps}
          placeholder="经纪人"
          disabled={!showConfirm}
          onChange={opt => {
            handleBrokerChange(opt);
            changeMessage({ broker_info: opt?.original });
          }}
        />

        {showConfirm ? (
          <>
            <div className="flex-center h-7 px-3 gap-3 bg-gray-700 rounded-lg">
              <Checkbox onChange={val => toggleFieldValue('flag_internal', val)}>内部</Checkbox>
              <Checkbox onChange={val => toggleFieldValue('flag_sustained_volume', val)}>续量</Checkbox>
            </div>
            <Button.Icon
              className="w-[58px] h-7 !px-0 !border-gray-500"
              onClick={handleIntentionChange}
            >
              意向价
            </Button.Icon>

            {/* 改量 */}
            <Button.Icon
              className="h-7 !border-gray-500"
              disabled={coQuoteVolumeSetting.limit === 0 || coQuoteVolumeSetting.target === 0}
              tooltip={{
                content: `报价量≥${coQuoteVolumeSetting.limit}万时，改为${coQuoteVolumeSetting.target}万`,
                placement: 'bottom',
                offset: 4
              }}
              onClick={handleVolumeChange}
            >
              改量
            </Button.Icon>
          </>
        ) : null}

        <Button
          className="h-7 border-gray-500 font-medium"
          text
          onClick={handleOriginalTextMdlShow}
        >
          <BadgeV2
            dot={showOriginalTextDot}
            style={{ right: -6, top: 6 }}
          >
            查看原文
          </BadgeV2>
        </Button>
        {otherProcessing && (
          <div className="flex-center gap-1 text-xs text-gray-200">
            <IconLoading className="animate-spin text-primary-100" />
            他人处理中
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 text-gray-200 font-normal">
        {message?.source && (
          <div className="flex-center gap-2 h-7 px-1 border border-solid border-gray-500 rounded-lg">
            <span className="flex items-center font-medium gap-1">
              {sourceIconMap[message.source]}
              <Tooltip
                truncate
                content={message.creator_info?.name_cn}
              >
                {/* 最大宽度设置为52px，刚好展示四个字 */}
                <span className="truncate max-w-[52px]">{message.creator_info?.name_cn}</span>
              </Tooltip>
              <span className="text-gray-300">{rowData.createTime}</span>
            </span>
          </div>
        )}

        {operable ? (
          <>
            <Tooltip content="忽略卡片">
              <Button
                className="w-7 h-7 px-0"
                type="danger"
                plain
                icon={<IconDelete />}
                loading={deleting}
                onClick={() => {
                  setDeleting(true);
                  ignoreMessage().finally(() => {
                    setDeleting(false);
                  });
                }}
              />
            </Tooltip>

            {showConfirm ? (
              <Tooltip content="提交卡片">
                <Button
                  className="w-7 h-7 px-0"
                  plain
                  icon={<IconSubmit />}
                  loading={submitting}
                  onClick={() => {
                    setSubmitting(true);

                    confirmMessage({
                      ...rowData,
                      original: {
                        ...rowData?.original,
                        inst_info: instTraderSearchState.selected?.original.inst_info,
                        trader_info: transform2TraderLite(productType, instTraderSearchState.selected?.original),
                        broker_info: brokerSearchState.selected?.original
                      }
                    }).finally(() => {
                      setSubmitting(false);
                    });
                  }}
                />
              </Tooltip>
            ) : null}
          </>
        ) : null}
      </div>
    </>
  );
};

export const GroupHeader = ({ rowData }: GroupHeaderProps) => {
  const { inst_info, trader_info, broker_info, operator_info, update_time } = rowData.original;

  const { productType } = useProductParams();

  const key = useRef(`${update_time}`);

  if (operator_info?.user_id !== miscStorage?.userInfo?.user_id) key.current = `${update_time}`;

  return (
    <InstTraderSearchProvider
      key={key.current}
      initialState={{
        productType,
        defaultValue: transform2TraderWithTag(trader_info, inst_info)
      }}
    >
      <TraderPreferenceProvider>
        <BrokerSearchProvider initialState={{ productType, defaultValue: broker_info }}>
          <CPBSearchConnectorProvider initialState={{ productType }}>
            <Inner rowData={rowData} />
          </CPBSearchConnectorProvider>
        </BrokerSearchProvider>
      </TraderPreferenceProvider>
    </InstTraderSearchProvider>
  );
};
