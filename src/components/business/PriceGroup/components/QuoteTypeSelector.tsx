import cx from 'classnames';
import { Select } from '@fepkg/components/Select';
import { BondQuoteTypes } from '../constants';
import { QuoteTypeSelectProps } from '../types';
import styles from './index.module.less';

const sizeMap = {
  large: 'h-8 w-24 text-sm',
  middle: 'h-7 w-24 text-sm',
  small: 'h-6 w-24 text-xs'
};

const classNameMap = {
  true: {
    large: 'quote-type-select-disabled-large',
    middle: 'quote-type-select-disabled-middle',
    small: 'quote-type-select-disabled-small'
  },
  false: {
    large: 'quote-type-select-large',
    middle: 'quote-type-select-middle',
    small: 'quote-type-select-small'
  }
};

export const QuoteTypeSelector = (props: QuoteTypeSelectProps) => {
  const { value, onChange, disabled = false, defaultValue, size = 'middle', className = '' } = props;

  return (
    <div className={styles[classNameMap[disabled.toString()][size]]}>
      <Select
        disabled={disabled}
        // size={size}
        className={cx(sizeMap[size], className)}
        clearIcon={null}
        destroyOnClose
        value={value}
        options={BondQuoteTypes}
        defaultValue={defaultValue}
        onChange={onChange}
        tabIndex={-1}
      />
    </div>
  );
};
