import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { SpotModalFlow } from '@fepkg/business/constants/log-map';
import { Button } from '@fepkg/components/Button';
import { Dialog } from '@fepkg/components/Dialog';
import { IconRightArrow } from '@fepkg/icon-park-react';
import { DealType, Side } from '@fepkg/services/types/enum';
import { useMemoizedFn } from 'ahooks';
import { DialogEvent } from 'app/types/IPCEvents';
import { cloneDeep, isEqual } from 'lodash-es';
import { isUseLocalServer } from '@/common/ab-rules';
import { useEnterDown } from '@/common/hooks/useEnterDown';
import { transformToLiqSpeedList } from '@/common/utils/liq-speed';
import { trackPoint } from '@/common/utils/logger/point';
import { AlwaysOpenToolView } from '@/components/AlwaysOpenToolView';
import { SpotPrice } from '@/components/IDCBoard/Price';
import { renderBondNodes } from '@/components/IDCBoard/utils';
import IDCDateShortcuts from '@/components/IDCDateShortcuts';
import QuoteTable from '@/components/IDCSpot/QuoteTable';
import SpotVol from '@/components/IDCSpot/SpotVol';
import { SpotDate, SpotModalProps } from '@/components/IDCSpot/types';
import { calcSpotDialogHeight, calcTotalVolume, getSpotId, isSameQuote } from '@/components/IDCSpot/utils';
import { DialogLayout } from '@/layouts/Dialog';
import { DialogContext } from '@/layouts/Dialog/Layout';
import { LocalDataProvider } from '@/layouts/LocalDataProvider';
import { LocalServerLoadingProvider } from '@/layouts/LocalDataProvider/LocalServer';
import useSpotInner from '@/pages/Spot/Panel/BondPanel/useSpotInner';
import { SpotFooter } from '../components/SpotFooter';
import { ISpotDialog } from '../utils/openDialog';
import useRealtimePrice from './useRealtimePrice';
import useSettlements, { getFilteredQuoteList } from './useSettlements';
import useSubmit from './useSubmit';
import './style.less';

type IProps = {
  props: SpotModalProps;
};

const Inner = ({ props }: IProps) => {
  const { dealType, bond, optimal, spotDate, quoteList = [], disabled }: SpotModalProps = props;

  useEffect(() => {
    trackPoint(SpotModalFlow.FlowEnter);
  }, []);

  const spotVolRef = useRef<HTMLInputElement>(null);

  const isTkn = dealType === DealType.TKN;

  const { filteredList, shownSettlements, defaultSettlements, settlementsForSubmit, onDateShortcutsChange } =
    useSettlements({
      quoteList,
      spotDate,
      optimal
    });

  const [total, setTotal] = useState(() => calcTotalVolume(filteredList));
  const [spotVol, setSpotVol] = useState(() => 0.001 * total);
  // 暗盘成交
  const [flagInternal, setFlagInternal] = useState(false);
  const { prevValidList, submitLabel, updatedIds } = useRealtimePrice({
    optimal,
    quoteList: filteredList,
    spotVolRef,
    spotVol,
    dealType,
    disabled,
    setTotal
  });

  const onSpotVolChange = useMemoizedFn((vol: number) => {
    setSpotVol(vol);
    trackPoint('change-spot-vol');
  });

  const onTotalRestoreClick = useMemoizedFn(() => {
    setSpotVol(0.001 * total);
    trackPoint('restore-total');
  });

  const { handleSubmit, onCancel, submitLock } = useSubmit({
    dealType,
    bond,
    spotVol,
    optimal,
    settlementsForSubmit,
    disabled,
    flagInternal
  });

  useEnterDown(handleSubmit);

  // 改变高度（切换交割、外部更新相关报价等）
  useLayoutEffect(() => {
    const newWindowHeight = calcSpotDialogHeight(prevValidList?.length || 0);
    window.Main.invoke(DialogEvent.SetWindowSize, null, newWindowHeight);
  }, [prevValidList]);

  return (
    <>
      <AlwaysOpenToolView />

      <DialogLayout.Header
        background={isTkn ? 'bg-secondary-500' : 'bg-orange-500'}
        controllers={['close']}
      >
        <Dialog.Header>
          <div className="text-white">{renderBondNodes(bond, false, false)}</div>
        </Dialog.Header>
      </DialogLayout.Header>

      <Dialog.Body>
        <section className="flex-center flex gap-2 mb-3 text-center rounded-lg border border-solid border-gray-600">
          <div className="flex-col w-[220px]">
            <span className="flex justify-start text-gray-300 ml-4 mb-1">Price</span>
            <SpotPrice
              className="ml-4 flex"
              quote={{ ...optimal, side: isTkn ? Side.SideOfr : Side.SideBid }}
            />

            <div className="component-dashed-x h-px my-3" />
            <span className="flex justify-start text-gray-300 ml-4 mb-1">Total</span>
            <div className="flex justify-between text-md font-bold text-gray-100 ml-4 mr-2">
              <span>{total}</span>
              <Button.Icon
                icon={<IconRightArrow />}
                disabled={disabled}
                onClick={onTotalRestoreClick}
              />
            </div>
          </div>
          <div className="bg-gray-800 flex-1 rounded-lg flex-col px-4 py-6">
            {shownSettlements ? (
              <IDCDateShortcuts
                type={isTkn ? DealType.TKN : DealType.GVN}
                disabled={disabled}
                autoInsertDefault={spotDate === undefined}
                asStaticText={spotDate === SpotDate.FRA}
                prefix={spotDate === SpotDate.FRA ? '远期：' : void 0}
                value={shownSettlements}
                defaultLiqSpeedList={defaultSettlements}
                onChange={data => {
                  onDateShortcutsChange(data);
                  // 当结算方式按钮变更时重新计算点价量
                  const nowFilteredList = getFilteredQuoteList(quoteList, transformToLiqSpeedList(data));
                  const volNum = calcTotalVolume(nowFilteredList);
                  setSpotVol(0.001 * volNum);
                }}
              />
            ) : null}
            <SpotVol
              className="mt-6"
              inputRef={spotVolRef}
              value={spotVol}
              onChange={onSpotVolChange}
              onSubmit={handleSubmit}
              disabled={disabled}
              min={prevValidList.length ? 1 : 0}
              autoFocus
            />
          </div>
        </section>

        <section>
          {prevValidList?.length ? (
            <div className="overflow-x-hidden overflow-y-overlay max-h-[340px] rounded-lg">
              <QuoteTable
                optimal={optimal}
                validQuoteList={prevValidList}
                updatedIds={updatedIds}
              />
            </div>
          ) : (
            <div className="h-5" />
          )}
        </section>
      </Dialog.Body>

      <SpotFooter
        containerCls={isTkn ? 'tkn' : 'gvn'}
        confirmBtnProps={{
          label: submitLabel,
          disabled: !!disabled || submitLock,
          type: isTkn ? 'secondary' : 'orange',
          loading: submitLock
        }}
        checkboxDisabled={!!disabled}
        flagInternal={flagInternal}
        onInternalChange={setFlagInternal}
        onConfirm={handleSubmit}
        onCancel={onCancel}
      />
    </>
  );
};

const SpotModal = ({ props }: IProps) => {
  const [spotProps, setSpotProps] = useState(props);
  const prevCtx = useRef<ISpotDialog | undefined>(undefined);
  const invalidateTag = useRef(false); // 是否已失效，失效后停止页面刷新

  const updateContext = useMemoizedFn((ctx: ISpotDialog) => {
    if (!isEqual(prevCtx.current, ctx) && !invalidateTag.current) {
      // 判断最优价是否发生改变
      const optimalChanged =
        !!ctx?.optimal && !!prevCtx.current && !isSameQuote(prevCtx.current?.optimal, ctx?.optimal);
      const newCtx = cloneDeep(ctx);
      if (optimalChanged) {
        newCtx.disabled = true;
        if (prevCtx.current?.optimal) {
          newCtx.optimal = cloneDeep(prevCtx.current?.optimal);
        }
        invalidateTag.current = true;
      }
      setSpotProps(newCtx);
      prevCtx.current = newCtx;
    }
  });

  const invalidateContext = useMemoizedFn(() => {
    console.log('触发invalidate');
    invalidateTag.current = true;
    console.log({ ...prevCtx.current, disabled: true });
    if (prevCtx.current) {
      setSpotProps({ ...prevCtx.current, disabled: true });
    }
  });

  useSpotInner(props, updateContext, invalidateContext);

  return <Inner props={spotProps} />;
};

export default () => {
  const context = useContext<ISpotDialog>(DialogContext);
  const spotKey = getSpotId(context);
  const spotNode = spotKey ? (
    <SpotModal
      props={context}
      key={`${spotKey}_${context.forceUpdateTime}`}
    />
  ) : null;

  if (isUseLocalServer()) {
    return <LocalServerLoadingProvider>{spotNode}</LocalServerLoadingProvider>;
  }

  return <LocalDataProvider>{spotNode}</LocalDataProvider>;
};
