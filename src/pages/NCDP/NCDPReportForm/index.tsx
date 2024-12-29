import cx from 'classnames';
import { MaturityDateTypeMap, RatingMap } from '@fepkg/business/constants/map';
import { fixFloatDecimal } from '@fepkg/common/utils';
import { IconDownArrow, IconFullInquiryText, IconUpArrow } from '@fepkg/icon-park-react';
import logo from '@/assets/image/logo-xintang.png';
import { useAtomValue } from 'jotai';
import { ReportFormProvider, useReportForm } from './ReportFormProvider';
import { openTimeAtom } from './atom';
import { REPORT_FORM_ID } from './constants';
import { useDateInfo } from './useDateInfo';

const borderStyle = 'border-solid border-gray-500';

/** 报表头部，这里大多为写死的数据 */
const Header = () => {
  const openDate = useAtomValue(openTimeAtom);

  return (
    <div className="p-2 pb-0">
      <div className="flex justify-between pb-2">
        <div className="flex-center">
          <img
            className="w-6 h-6"
            src={logo}
            alt="xintang-logo"
          />
          <span className="flex items-end">
            <span className="text-md font-bold pl-1 pr-2.5">信唐货币</span>
            <span className="text-xs font-semibold pb-1">一级存单报价</span>
          </span>
        </div>
        <div className="flex-center gap-4">
          <span className="text-gray-400 text-xs">打开报表时间</span>
          <span className="font-semibold">{openDate}</span>
        </div>
      </div>
      <div className="component-dashed-x-100 h-px px-2 -mt-px" />
    </div>
  );
};

/** 报表日期信息 */
const Date = () => {
  const { dateInfoList, maturityDateList } = useDateInfo();

  return (
    <div className="w-full">
      <div className={cx('flex items-center justify-around gap-4 p-2 text-xs border-0 border-b', borderStyle)}>
        {dateInfoList.map(item => (
          <div
            className="flex-1 h-6 flex items-center gap-4"
            key={item.label}
          >
            <span className="text-gray-400">{item.label}</span>
            <span className="font-semibold">{item.value}</span>
          </div>
        ))}
      </div>
      <div className={cx('grid grid-cols-6 bg-[#EE994B33] border-0 border-b', borderStyle)}>
        {maturityDateList.map((item, k) => {
          return (
            <div key={k}>
              {item.map(i => {
                return (
                  <div
                    key={`${k}${i}`}
                    className={cx(
                      k === 0 ? 'text-gray-400 text-xs p-2 ' : 'text-sm font-semibold px-2 py-[5px]',
                      'h-8 border-0 border-b last-of-type:border-b-0 border-dashed border-gray-200',
                      // 去掉最右侧的边框
                      k === maturityDateList.length - 1 ? '' : 'border-r'
                    )}
                  >
                    {i}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** 报价信息 */
const Table = () => {
  const { newData } = useReportForm();

  const cellCls = 'flex items-center break-all p-2 border-0 border-r border-solid';
  // 主体评级
  const issuingCls = `${cellCls} w-[92px] border-gray-200`;
  // 报价
  const priceCls = `${cellCls} w-[64px] border-gray-200`;
  // 量
  const volumeCls = `${cellCls} w-[64px] border-gray-500`;

  // 纵向首列
  const firstColumnCls =
    'w-[100px] flex-shrink-0 border-0 border-r border-solid border-gray-500 flex items-center pl-2';
  // 大行样式
  const rowCls = 'flex border-0 border-b border-solid';
  // 小行样式
  const subRowCls = 'flex min-h-8 items-stretch border-0 border-solid border-gray-200';
  // 首行表头单元格样式
  const headerCls = 'w-[220px] h-12 flex items-center border-0 border-r border-solid last-of-type:border-r-0 pl-2';

  return (
    <div>
      <div className={rowCls}>
        <div
          className="pl-2 w-[100px] flex-shrink-0 h-12 text-gray-400 font-normal text-xs flex items-center border-0 border-r border-solid relative"
          style={{
            background: 'linear-gradient(26deg, transparent 49%, #43454F 50%, #43454F 49%, transparent 51%)'
          }}
        >
          <div className="absolute top-2 right-4">期限</div>

          <div className="absolute bottom-2 left-4">评级</div>
        </div>

        <div className={`${subRowCls}`}>
          <div className={`${headerCls} h-full`}>1M</div>
          <div className={`${headerCls} h-full`}>3M</div>
          <div className={`${headerCls} h-full`}>6M</div>
          <div className={`${headerCls} h-full`}>9M</div>
          <div className={`${headerCls} h-full`}>1Y</div>
        </div>
      </div>

      {newData.map((item, itemIdx) => {
        // children长度为0时就渲染两个空白行
        const listLength = item.children.length >= 2 ? item.children.length : 2;
        const childList = new Array(listLength).fill('');

        return (
          <div
            key={`${item.title}${itemIdx}`}
            className={rowCls}
          >
            <div className={firstColumnCls}>{item.title}</div>
            {/* 基础表头 */}
            <div>
              <div className={`${subRowCls} text-gray-400 font-normal border-b h-7 bg-[#4E95FF33]`}>
                <div className={issuingCls}>发行主体</div>
                <div className={priceCls}>报价</div>
                <div className={volumeCls}>量</div>
                <div className={issuingCls}>发行主体</div>
                <div className={priceCls}>报价</div>
                <div className={volumeCls}>量</div>
                <div className={issuingCls}>发行主体</div>
                <div className={priceCls}>报价</div>
                <div className={volumeCls}>量</div>
                <div className={issuingCls}>发行主体</div>
                <div className={priceCls}>报价</div>
                <div className={volumeCls}>量</div>
                <div className={issuingCls}>发行主体</div>
                <div className={priceCls}>报价</div>
                <div className={`${volumeCls} !border-r-0`}>量</div>
              </div>

              {childList.map((_, idx) => {
                const rowItem = item.children[idx];
                // 为什么要new一个arr，目的是让每一行都能完整的渲染出5个单元格
                const itemList = new Array(5).fill('');

                return (
                  <div
                    className={`${subRowCls} border-b items-stretch last-of-type:border-b-0`}
                    key={`${itemIdx}-${idx}`}
                  >
                    {itemList.map((__, index) => {
                      const s = rowItem?.[index];

                      // 分割价格和价格是否变动
                      const [_price, priceChanged = ''] = (s?.price ?? '').split('_');
                      // 仅仅展示大于0的价格
                      const price = +_price > 0 ? (+_price).toFixed(2) : '';
                      // 价格变动标识
                      const flagPlus = +priceChanged > 0;
                      const flagMinus = +priceChanged < 0;

                      return (
                        <div
                          key={`${itemIdx}-${idx}-${index}`}
                          className="flex"
                        >
                          <div className={`${issuingCls} ${s?.name ? '' : '!py-4'}`}>{s?.name ?? ''}</div>
                          <div className={priceCls}>
                            {price ?? ''}
                            {flagPlus && (
                              <IconUpArrow
                                className="text-danger-100 ml-1"
                                size={12}
                              />
                            )}
                            {flagMinus && (
                              <IconDownArrow
                                className="text-secondary-100 ml-1"
                                size={12}
                              />
                            )}
                          </div>
                          <div
                            // 最后一项的「量」不需要右边框
                            className={`${volumeCls} ${index === itemList.length - 1 ? 'last-of-type:border-r-0' : ''}`}
                          >
                            {+(s?.volume ?? 0) > 0 && s.volume}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/** 浮息 */
const FRTable = () => {
  const { shiBorList } = useReportForm();
  if (shiBorList.length === 0) return null;
  const borderCls = 'border border-dashed border-gray-200 border-0';
  const rowCls = cx(borderCls, 'flex justify-around border-b last-of-type:border-b-0', 'h-8');
  const baseCellCls = 'border-r last-of-type:border-r-0 px-2 flex items-center overflow-hidden';
  const headerCls = cx(borderCls, baseCellCls, 'flex-1 text-xs text-gray-400');
  const cellCls = cx(borderCls, baseCellCls, 'flex-1 text-sm font-semibold');

  return (
    <div className="flex text-gray-800 bg-[#EE994B33]">
      <div className="w-[100px] text-xs pl-2 flex items-center border-0 border-r border-solid border-gray-500">
        浮息
      </div>
      <div className="flex-1">
        <div className={rowCls}>
          <div className={headerCls}>期限</div>
          <div className={headerCls}>发行机构</div>
          <div className={headerCls}>价格</div>
          <div className={headerCls}>评级</div>
        </div>
        {shiBorList.map(item => {
          return (
            <div
              key={item.ncdp_id}
              className={rowCls}
            >
              <div className={cellCls}>{MaturityDateTypeMap[item.maturity_date]}</div>
              <div className={cellCls}>{item.inst_name}</div>
              <div className={cx(cellCls, 'justify-start gap-2')}>
                <span className="truncate-clip">
                  {/* 浮息的价格需要乘以100 */}
                  {`3M${item.price > 0 ? '+' : ''}${fixFloatDecimal(Number(item.price) * 100, 0)}`}
                </span>
                {item.flag_full && <IconFullInquiryText className="bg-green-100 rounded text-gray-000" />}
              </div>
              <div className={cellCls}>{RatingMap[item.issuer_rating_current]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 一定要找个地方渲染出来，不然没法儿生成图片
export const NCDPReportForm = ({ className }: { className?: string }) => {
  return (
    // 宽高必须得预留得足够的多，否则图片生成不完整
    <div
      className={className}
      style={{ width: 1300, height: 10000000 }}
    >
      <ReportFormProvider>
        <div
          id={REPORT_FORM_ID}
          className={cx('w-[1200px] h-auto overflow-hidden border bg-white text-gray-800', borderStyle)}
        >
          <Header />
          <Date />
          <Table />
          <FRTable />
        </div>
      </ReportFormProvider>
    </div>
  );
};
