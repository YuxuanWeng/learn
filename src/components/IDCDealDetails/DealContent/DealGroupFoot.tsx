import { TypeDealContentSum } from '../type';

type Props = {
  sumData: TypeDealContentSum[];
  className?: string;
};

export const DealGroupFoot = ({ sumData, className }: Props) => {
  return (
    // 汇总区一定是小组中的最后一项，这里需要一个下圆角来与下一个分组区分开
    <div className={`flex-col bg-gray-800 ${className}`}>
      <div className="h-px mb-2 mx-2 component-dashed-x" />

      <div className="flex pb-1">
        <div className="flex items-center justify-center bg-primary-600 w-20 h-6 text-primary-100 rounded-lg !ml-[90px] text-sm">
          汇总
        </div>
        <div className="font-semibold whitespace-nowrap ml-1 text-sm">
          {sumData.map(item => {
            return (
              <div
                key={item.sumId}
                className="h-7 flex items-center gap-2"
              >
                <span>【</span>
                <span>{item.key_market}</span>
                <span>{item.short_name}</span>
                <span>total</span>
                {item.gvnNum !== '0' ? <span className={item.tknNum ? 'mr-1' : 'mr-2'}>买入{item.gvnNum}</span> : ''}
                {item.gvnNum !== '0' && item.tknNum !== '0' ? <span className="mr-1">/</span> : ''}
                {item.tknNum !== '0' ? <span className="mr-2">卖出{item.tknNum}</span> : ''}
                <span>】</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
