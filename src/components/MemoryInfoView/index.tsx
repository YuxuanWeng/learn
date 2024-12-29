import { useCallback, useRef, useState } from 'react';
import { Statistic } from 'antd';
import { IconDownArrow, IconUpArrow } from '@fepkg/icon-park-react';
import memoOpen from '@/assets/image/memo-open.svg';
import { useEffectOnce } from 'usehooks-ts';

type HeapMessage = {
  totalHeapSize: number;
  totalHeapSizeExecutable: number;
  totalPhysicalSize: number;
  totalAvailableSize: number;
  usedHeapSize: number;
  heapSizeLimit: number;
  mallocedMemory: number;
  peakMallocedMemory: number;
  doesZapGarbage: boolean;
};

type MemoryMessage = {
  memoInfo?: {
    private: number;
    residentSet: number;
    shared: number;
  };
  heap?: HeapMessage;
  eventMap?: Map<string, number>;
};

// 内存过线变颜色
const WARN_LINE = 20;

const getColor = (value: number) => {
  if (value > WARN_LINE) {
    return 'red';
  }
  return 'green';
};

const getHeapMap = (isMain: boolean, opt?: HeapMessage) => {
  let key: keyof HeapMessage;
  const keyMap = new Array<{ nowKey: string; nowValue: string }>();
  // eslint-disable-next-line guard-for-in
  for (key in opt) {
    keyMap.push({ nowKey: key, nowValue: opt?.[key]?.toString() || '' });
  }
  const keyPrefix = isMain ? 'main-' : 'render-';
  return keyMap.map(item => {
    return (
      <div key={keyPrefix + item.nowKey}>
        <span>{item.nowKey}</span>
        <span className="ml-1">{item.nowValue}</span>
      </div>
    );
  });
};

const isDev = import.meta.env.DEV;

export const MemoryInfoView = () => {
  const [mainMessage, setMainMessage] = useState<MemoryMessage>();
  const [renderMessage, setRenderMessage] = useState<MemoryMessage>();
  const [isOpen, setIsOpen] = useState(false);
  const initMainMessage = useRef<MemoryMessage>();
  const initRenderMessage = useRef<MemoryMessage>();
  const [mainRate, setMainRate] = useState(0);
  const [renderRate, setRenderRate] = useState(0);
  const [channelTotalCount, setChanelTotalCount] = useState(0);
  const [maxChannel, setMaxChannel] = useState<{ name: string; count: number }>({ name: '', count: 0 });

  const openRef = useRef<boolean>(false);

  const getMemoMessage = useCallback(async () => {
    if (!openRef.current) return;
    const mainInfo = await window.Main.invoke('getMainMemoInfo');
    setMainMessage(mainInfo);
    const nowMainValue = mainInfo?.memoInfo.private || 0;
    const oriMainValue = initMainMessage.current?.memoInfo?.private || 0;
    if (oriMainValue) {
      const rate = Math.round(((nowMainValue - oriMainValue) / oriMainValue) * 100);
      setMainRate(rate);
    }

    const renderInfo = await window.Main.getMemoInfo();
    setRenderMessage(renderInfo);
    console.log('eventMap', renderInfo.eventMap);
    let totalCount = 0;
    let maxListenerChannel = { name: '', count: 0 };
    renderInfo.eventMap.forEach((value, key) => {
      totalCount += value;
      if (value > maxListenerChannel.count) {
        maxListenerChannel = { name: key, count: value };
      }
    });
    setChanelTotalCount(totalCount);
    setMaxChannel(maxListenerChannel);
    const nowRenderValue = renderInfo?.memoInfo.private || 0;
    const oriRenderValue = initRenderMessage.current?.memoInfo?.private || 0;
    if (oriRenderValue) {
      const rate = Math.round(((nowRenderValue - oriRenderValue) / oriRenderValue) * 100);
      setRenderRate(rate);
    }
  }, []);

  // 获取标准值
  useEffectOnce(() => {
    // 这里是想等页面稳定后再去取标准值
    setTimeout(async () => {
      if (!initMainMessage.current) {
        initMainMessage.current = await window.Main.invoke('getMainMemoInfo');
      }
      if (!initRenderMessage.current) {
        initRenderMessage.current = await window.Main.getMemoInfo();
      }
    }, 5000);
  });

  useEffectOnce(() => {
    const timer = setInterval(getMemoMessage, 1000);
    return () => {
      clearInterval(timer);
    };
  });

  if (!isDev) return null;

  return (
    <div className="select-none">
      {isOpen ? (
        <div className="flex flex-col align-middle absolute top-[60px] right-0 bg-gray-500 rounded w-[250px] p-2.5 z-modal">
          <div>
            <Statistic
              title="主进程内存占用:"
              value={`${mainMessage?.memoInfo?.private}KB`}
              valueStyle={{ color: getColor(mainRate) }}
              suffix={
                <div>
                  {mainRate > 0 ? <IconUpArrow /> : <IconDownArrow />}
                  <span>{mainRate}%</span>
                </div>
              }
            />
            <div>{getHeapMap(true, mainMessage?.heap)}</div>
          </div>
          <div>
            <Statistic
              className="mt-2"
              title="当前渲染进程内存占用:"
              value={`${renderMessage?.memoInfo?.private}KB`}
              valueStyle={{ color: getColor(renderRate) }}
              suffix={
                <div>
                  {renderRate > 0 ? <IconUpArrow /> : <IconDownArrow />}
                  <span>{renderRate}%</span>
                </div>
              }
            />
            <div className="text-primary-200 font-bold">{`当前渲染进程信道总数：${channelTotalCount}`}</div>
            <div className="text-primary-200 font-bold">{`listener最多的信道：${maxChannel.name} ${maxChannel.count}个`}</div>
            <div>{getHeapMap(false, renderMessage?.heap)}</div>
          </div>
        </div>
      ) : null}
      <img
        src={memoOpen}
        onClick={() => {
          setIsOpen(open => {
            openRef.current = !open;
            return !open;
          });
        }}
        className="cursor-pointer absolute top-10 right-5 w-[30px] h-[30px] z-modal"
        alt="打开/关闭"
      />
    </div>
  );
};
