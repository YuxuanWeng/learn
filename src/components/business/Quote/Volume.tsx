import { ReactNode, forwardRef, useLayoutEffect, useMemo, useState } from 'react';
import { Input } from '@fepkg/components/Input';
import { Side } from '@fepkg/services/types/enum';
import { useAtomValue } from 'jotai';
import { forEachRight, includes, min } from 'lodash-es';
import { DataInputType } from './constants';
import { unitAtom } from './constants/atoms';
import { useQuoteComponentRef } from './hooks/useQuoteComponentRef';
import { QuoteComponentProps, QuoteComponentRef, VolumeUnit } from './types';
import { VOLUME_TEN_MILLION_REGEX, VOLUME_TEN_THOUSAND_REGEX, replacePriceChiPeriod } from './utils';

export const Volume = forwardRef<QuoteComponentRef, QuoteComponentProps.Volume>(
  ({ label, side, defaultUnit, value, onChange, onBlur, ...restProps }, ref) => {
    let mergedLabel: ReactNode;
    if (label) {
      mergedLabel = label;
    } else {
      mergedLabel = side == Side.SideBid ? 'Vol.bid' : 'Vol.ofr';
      if (label === null) mergedLabel = null;
    }

    const unit = useAtomValue(unitAtom);
    const mergedUnit = defaultUnit ?? unit;

    const [lastInputIsDot, setLastInputIsDot] = useState(false);
    const [nonSenseZeroNum, setNonSenseZeroNum] = useState(0);

    const maxZeroNum = mergedUnit === VolumeUnit.TenMillion ? 5 : 2;

    const formatValue = useMemo(() => {
      if (value === undefined) return '';
      if (value === '') return '';
      if (value === '.') return value;
      let valueWithUnit = Number(value);
      if (mergedUnit === VolumeUnit.TenMillion) {
        valueWithUnit = Number((Number(value) / 1000).toFixed(maxZeroNum));
      }
      if (nonSenseZeroNum) {
        if (Number.isInteger(valueWithUnit)) {
          const padZeroNum = min([nonSenseZeroNum, maxZeroNum]) || 0;
          let endZeroStr = '.';
          for (let i = 0; i < padZeroNum; i++) {
            endZeroStr += '0';
          }
          return `${valueWithUnit}${endZeroStr}`;
        }
        const digitNumber = valueWithUnit.toString().split('.').pop()?.length || 0;
        const padZeroNum = min([nonSenseZeroNum, maxZeroNum - digitNumber]) || 0;
        let endZeroStr = '';
        for (let i = 0; i < padZeroNum; i++) {
          endZeroStr += '0';
        }
        return `${valueWithUnit}${endZeroStr}`;
      }
      if (lastInputIsDot) {
        return `${valueWithUnit}.`;
      }
      return `${valueWithUnit}`;
    }, [lastInputIsDot, maxZeroNum, mergedUnit, nonSenseZeroNum, value]);

    useLayoutEffect(() => {
      setNonSenseZeroNum(0);
      setLastInputIsDot(false);
    }, [mergedUnit]);

    let regex = VOLUME_TEN_THOUSAND_REGEX;
    if (mergedUnit === VolumeUnit.TenMillion) regex = VOLUME_TEN_MILLION_REGEX;

    const { inputRef } = useQuoteComponentRef(ref);

    return (
      <Input
        data-input-type={DataInputType}
        label={mergedLabel}
        value={formatValue}
        onChange={val => {
          val = replacePriceChiPeriod(val);

          if (val === '') {
            onChange?.(side, undefined);
            return;
          }
          setLastInputIsDot(val.endsWith('.'));
          let zeroNum = 0;
          if (includes(val, '.')) {
            forEachRight(val, letter => {
              if (letter === '0') {
                zeroNum += 1;
                return true;
              }
              return false;
            });
          }
          setNonSenseZeroNum(zeroNum);
          if (!regex.test(val)) return;
          if (val === '.') {
            onChange?.(side, String(val));
            return;
          }
          let returnValue = Number(val);

          if (mergedUnit === VolumeUnit.TenMillion) {
            returnValue = Number((returnValue * 1000).toFixed(maxZeroNum));
          }

          onChange?.(side, String(returnValue));
        }}
        onBlur={e => {
          setLastInputIsDot(false);
          onBlur?.(e);
        }}
        {...restProps}
        ref={inputRef}
      />
    );
  }
);
