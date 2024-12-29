import cx from 'classnames';
import { Cascader, getBothDepthData } from '@fepkg/components/Cascader';
import { useIssuerInstConfigQuery } from '@/common/services/hooks/useIssuerInstQuery';

type IssuerInstFilterProps = {
  disabled?: boolean;
  value?: string[];
  className?: string;
  onChange?: (val: Set<string>) => void;
};

export const IssuerInstFilter = (props: IssuerInstFilterProps) => {
  const { disabled, value = [], onChange, className = '' } = props;
  const { data } = useIssuerInstConfigQuery();

  return (
    <Cascader
      label="发行人"
      disabled={disabled}
      className={cx('flex-shrink-0 w-[262px] h-7', className)}
      floatShift={false}
      options={data?.nodes ?? []}
      value={value}
      onChange={(_, val = []) => {
        const [issuer_id_list, sub_issuer_id_list] = getBothDepthData(val);
        onChange?.(new Set([...issuer_id_list, ...sub_issuer_id_list]));
      }}
    />
  );
};
