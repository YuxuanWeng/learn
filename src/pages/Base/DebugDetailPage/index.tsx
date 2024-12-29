import { ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import cx from 'classnames';
import { TimePicker } from 'antd';
import { Button } from '@fepkg/components/Button';
import { Dialog } from '@fepkg/components/Dialog';
import { message } from '@fepkg/components/Message';
import '@fepkg/components/assets/styles/antd-reset/index.less';
import '@fepkg/icon-park-react/dist/index.less';
import type { DataLocalizationStatus } from '@fepkg/services/types/data-localization-manual/data-localization-status';
import { DataLocalizationEvent } from 'app/types/DataLocalization';
import IPCEventEnum, { LogEventEnum, UtilEventEnum } from 'app/types/IPCEvents';
import moment, { Moment } from 'moment';
import 'moment/dist/locale/zh-cn';
import { useImmer } from 'use-immer';
import { DialogLayout } from '@/layouts/Dialog';
import { DialogContext } from '@/layouts/Dialog/Layout';
import { useDialogLayout } from '@/layouts/Dialog/hooks';
import '@/assets/styles/global.less';

type ResetTime = {
  hour: number;
  minute: number;
  second: number;
};

type Bounds = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
};

type WindowBounds = {
  name: string;
  bounds: Bounds;
  isMax?: boolean;
};

const titleStyle = 'text-white text-lg';

const printLog = res => {
  if (!res?.length) return;
  /** 迭代打印 */
  for (const item of res) {
    console.log(`-- 主进程日志 --, 时间戳：${item.timestamp}, 消息：`, ...item.msg);
  }
};

type CenterDivProps = {
  children: ReactNode;
};

const CenterDiv = ({ children }: CenterDivProps) => {
  return <div className="flex justify-center">{children}</div>;
};

const generateWindowMessage = (windowsBounds: WindowBounds[]) => {
  return (
    <div className="flex flex-col bg-gray-600 px-4">
      <div className="grid grid-cols-6 text-white py-2">
        <div>名称</div>
        <CenterDiv>X</CenterDiv>
        <CenterDiv>Y</CenterDiv>
        <CenterDiv>宽</CenterDiv>
        <CenterDiv>高</CenterDiv>
        <CenterDiv>最大化</CenterDiv>
      </div>
      {windowsBounds?.map(value => {
        return (
          <div
            key={value.name}
            className="grid grid-cols-6"
          >
            <div>{value.name}</div>
            <CenterDiv>{value.bounds.x}</CenterDiv>
            <CenterDiv>{value.bounds.y}</CenterDiv>
            <CenterDiv>{value.bounds.width}</CenterDiv>
            <CenterDiv>{value.bounds.height}</CenterDiv>
            <CenterDiv>{value.isMax === true ? '是' : '否'}</CenterDiv>
          </div>
        );
      })}
    </div>
  );
};

const LocalDataMessage = () => {
  const [info, setInfo] = useState<DataLocalizationStatus.Response>({});
  const tableInfo = info.table_info ?? {};

  const fetchInfo = () => {
    window.Main.invoke(DataLocalizationEvent.CheckStatus).then(res => {
      setInfo(res);
    });
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  return (
    <>
      <div className={cx(titleStyle, 'mt-4 p-2')}>
        本地化数据信息
        <Button
          className="ml-2"
          onClick={fetchInfo}
        >
          刷新
        </Button>
      </div>
      <div className="flex items-center mb-4">
        <div className="flex-1">
          <div className="p-2">本地化pid：{info.pid || '-'}</div>

          <div className="p-2">表信息</div>
          <div className="flex flex-col bg-gray-600 px-4">
            <div className="grid grid-cols-2 text-white py-2">
              <div>名称</div>
              <CenterDiv>数量</CenterDiv>
            </div>
            {Object.entries(tableInfo)?.map(([tableName, tableCount]) => {
              return (
                <div
                  key={tableName}
                  className="grid grid-cols-2"
                >
                  <div>{tableName}</div>
                  <CenterDiv>{tableCount}</CenterDiv>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex-1" />
        <div className="flex-1" />
      </div>
    </>
  );
};

const Inner = () => {
  const [resetTime, updateResetTime] = useImmer<ResetTime | undefined>(undefined);
  const [windowsBounds, setWindowsBounds] = useState<WindowBounds[]>([]);
  const [cachedWindowsBounds, setCachedWindowsBounds] = useState<WindowBounds[]>([]);
  const { cancel } = useDialogLayout();

  const getWindows = async () => {
    const windows = await window.Main.invoke<WindowBounds[]>(UtilEventEnum.GetAllWindows);
    setWindowsBounds(windows);
    const cachedWindows = await window.Main.invoke<WindowBounds[]>(UtilEventEnum.GetCachedWindows);
    setCachedWindowsBounds(cachedWindows);
  };

  const onChange = (time: Moment | null) => {
    if (!time) return;
    updateResetTime({ hour: time.hours(), minute: time.minutes(), second: time.seconds() });
  };

  const onTimeRestartSumbit = useCallback(() => {
    if (!resetTime) return;
    message.success('自动登出设置成功，登出时间会有30s左右的误差');
    const checkSpan = 30 * 1000;
    window.Main.invoke(
      IPCEventEnum.ResetAutoLogoutTimer,
      resetTime.hour,
      resetTime.minute,
      resetTime.second,
      checkSpan
    );
  }, [resetTime]);

  useEffect(() => {
    const off = window.Main.on?.(LogEventEnum.PrintMainLog, printLog);
    // 主动告知主进程当前已就绪，如有队列日志立即发送；
    window.Main.invoke(LogEventEnum.PrintWindowReady)?.then(printLog);
    getWindows();
    // -- 主进程日志 end --
    return () => {
      off?.();
    };
  }, []);

  return (
    <>
      <DialogLayout.Header onCancel={cancel}>
        <Dialog.Header>详细信息</Dialog.Header>
      </DialogLayout.Header>
      <div className="bg-gray-800 w-full h-full flex flex-col px-4 overflow-auto">
        <div className={cx(titleStyle, 'mt-[50px] p-2')}>重置自动退登</div>
        <div className="flex items-center">
          <TimePicker
            className="w-[200px]"
            onChange={onChange}
          />
          <Button
            className="ml-2"
            onClick={onTimeRestartSumbit}
          >
            提交
          </Button>
        </div>
        <div className="flex justify-between mt-[50px] p-2">
          <div className={titleStyle}>窗口信息</div>
          <Button
            className="ml-2"
            onClick={getWindows}
          >
            刷新
          </Button>
        </div>
        <span className="p-2">活跃窗口</span>
        {generateWindowMessage(windowsBounds)}
        <span className="p-2">缓存窗口</span>
        {generateWindowMessage(cachedWindowsBounds)}
        <LocalDataMessage />
      </div>
    </>
  );
};

export const DebugDetailPage = () => {
  const context = useContext(DialogContext);
  if (!context) {
    console.log('没拿到context', moment().valueOf());
    return null;
  }
  console.log('成功拿到context', context, moment().valueOf());
  return <Inner />;
};
