import { useEffect, useState } from 'react';
import { MarketTrackOperateEnum } from '@fepkg/business/constants/log-map';
import { Button } from '@fepkg/components/Button';
import { Checkbox } from '@fepkg/components/Checkbox';
import { Radio, RadioGroup } from '@fepkg/components/Radio';
import { IconDownDouble, IconSearch, IconUpDouble } from '@fepkg/icon-park-react';
import { useMemoizedFn } from 'ahooks';
import { useWindowSize } from 'usehooks-ts';
import { mulDeleteOppositePriceNotification } from '@/common/services/api/opposite-price-notification/mul-delete';
import { trackPoint } from '@/common/utils/logger/point';
import { BondSearch } from '@/components/business/Search/BondSearch';
import { TraderSearch } from '@/components/business/Search/TraderSearch';
import { useRemind } from '../../providers/RemindProvider';
import { SortEnum } from '../../type';
import { clearInvalidErrorMsgKey } from '../../util';
import { useSendMsg } from '../hooks/useSendMsg';

const optionsRadioGroup = [
  { label: '时间', value: SortEnum.Time },
  { label: '券码', value: SortEnum.KeyMarket },
  { label: '期限', value: SortEnum.DeadLine }
];

const Inner = () => {
  const {
    keyMarketList,
    traderIdList,
    intelligenceSort,
    setIntelligenceSort,
    checkedKeyMarketList,
    showRemindInfo,
    onChangeShowRemindInfo,
    notificationIdMap,
    notificationList,
    setNotificationList,
    setCheckedKeyMarketList,
    sendErrorMap,
    setSendErrorMap
  } = useRemind();

  const { onBatchSendMsg } = useSendMsg();

  const [checkedAll, setCheckedAll] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);

  const { width } = useWindowSize();

  useEffect(() => {
    const keyMarketLength = keyMarketList.length;
    const sameKeyMarketList = keyMarketList.filter(k => checkedKeyMarketList.includes(k));
    const checkedLength = sameKeyMarketList.length;
    if (checkedLength === 0) {
      setCheckedAll(false);
      setIndeterminate(false);
    } else if (checkedLength < keyMarketLength) {
      setCheckedAll(false);
      setIndeterminate(true);
    } else {
      setCheckedAll(true);
      setIndeterminate(false);
    }
  }, [keyMarketList, checkedKeyMarketList, setCheckedKeyMarketList]);

  const onBatchDelete = useMemoizedFn(() => {
    if (checkedKeyMarketList.length === 0) {
      return;
    }
    trackPoint(MarketTrackOperateEnum.BatchDelete);
    let notificationIdList: string[] = [];
    for (const item of checkedKeyMarketList) {
      notificationIdList = [...notificationIdList, ...(notificationIdMap.get(item) ?? [])];
    }
    const validNotificationList = notificationList.filter(
      item => !notificationIdList.includes(item.opposite_price_notification_id)
    );
    const inValidNotificationList = notificationList.filter(item =>
      notificationIdList.includes(item.opposite_price_notification_id)
    );
    const errorMsgMap = new Map(sendErrorMap);
    clearInvalidErrorMsgKey(inValidNotificationList, errorMsgMap);
    setSendErrorMap(errorMsgMap);
    mulDeleteOppositePriceNotification({ notification_id_list: notificationIdList });
    setNotificationList(validNotificationList);
    setCheckedKeyMarketList([]);
  });

  const onChangeCheckAll = useMemoizedFn(val => {
    setCheckedAll(val);
    if (val) {
      setCheckedKeyMarketList(keyMarketList);
    } else {
      setCheckedKeyMarketList([]);
    }
  });

  return (
    <div className="flex justify-between items-center mb-3 gap-x-3 px-3">
      <div className="flex gap-x-3 w-full">
        <div className="bg-gray-800 rounded-lg w-[80px] flex justify-center items-center">
          <Checkbox
            indeterminate={indeterminate}
            checked={checkedAll}
            onChange={onChangeCheckAll}
            disabled={keyMarketList.length === 0}
          >
            全选
          </Checkbox>
        </div>
        <BondSearch
          placeholder="搜索债券"
          suffixIcon={<IconSearch />}
          searchParams={{ offset: '0', count: '20', key_market_list: keyMarketList.length ? keyMarketList : void 0 }}
          label=""
          className="h-7  bg-gray-800  max-w-[198px]"
          style={{ width: (width * 1) / 12 }}
        />
        <TraderSearch
          placeholder="搜索交易员"
          suffixIcon={<IconSearch />}
          label=""
          searchParams={{ trader_id_list: traderIdList }}
          className="h-7  bg-gray-800  max-w-[198px]"
          style={{ width: (width * 1) / 12 }}
        />
        <div className="flex items-center !w-[280px] h-7  px-3 gap-x-3 border-[1px] border-solid border-gray-600 rounded-lg">
          <div className="w-[70px] text-sm font-normal text-gray-200">快速排序:</div>
          <RadioGroup
            value={[intelligenceSort]}
            onChange={val => {
              setIntelligenceSort(val[0] as SortEnum);
            }}
            className="!gap-3 "
          >
            {optionsRadioGroup.map(item => (
              <Radio
                value={item.value}
                key={item.value}
              >
                {item.label}
              </Radio>
            ))}
          </RadioGroup>
        </div>
      </div>
      <div className="flex gap-x-3">
        <Button.Icon
          icon={showRemindInfo ? <IconUpDouble /> : <IconDownDouble />}
          onClick={() => {
            onChangeShowRemindInfo(!showRemindInfo);
          }}
          className="w-7 h-7 rounded-lg text-gray-100"
          disabled={keyMarketList.length < 1}
        />
        <Button
          className="h-7 w-[88px]"
          disabled={checkedKeyMarketList.length === 0}
          onClick={onBatchDelete}
          ghost
          type="danger"
        >
          删除
        </Button>
        <Button
          className="h-7 w-[88px]"
          disabled={checkedKeyMarketList.length === 0}
          onClick={onBatchSendMsg}
          ghost
        >
          发送
        </Button>
      </div>
    </div>
  );
};

export const SearchFilter = () => {
  return <Inner />;
};
