import { InputFilter } from '@fepkg/services/types/bds-common';
import { BondIssueInfoFilterValue, GeneralFilterValue, RemainDaysType } from '@/components/BondFilter/types';
import { RangeInputValue } from '@/components/RangeInput';

export type NCDFiltersParsingCallBack = (
  generalFilterValue?: GeneralFilterValue,
  bondIssueInfoFilterValue?: BondIssueInfoFilterValue,
  inputFilter?: InputFilter
) => void;

export type NCDFiltersParsingProps = {
  onChange?: NCDFiltersParsingCallBack;
};

export type TransformParsingDateResult = {
  remain_days_options_type: RemainDaysType;
  remain_days_type: 'date' | 'string';
  remain_days_list: string[];
  remain_days_range: RangeInputValue;
};
