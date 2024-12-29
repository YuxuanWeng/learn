import cx from 'classnames';

type ValuationCellProps = {
  first?: number;
  last?: number;
  lineCls?: string;
};

export const ValuationCell = ({ first = 0, last = 0, lineCls = '' }: ValuationCellProps) => (
  <>
    {first > 0 ? <span>{first}</span> : null}
    {first > 0 && last > 0 ? <span className={cx('valuation-cell shrink-0 w-px h-2.5 bg-gray-300', lineCls)} /> : null}
    {last && last > 0 ? <span>{last}</span> : null}
  </>
);
