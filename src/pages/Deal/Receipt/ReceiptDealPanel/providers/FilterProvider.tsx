import { useEffect, useRef } from 'react';
import { UserHotkeyFunction } from '@fepkg/services/types/enum';
import { useAtom, useSetAtom } from 'jotai';
import moment from 'moment';
import { createContainer } from 'unstated-next';
import { usePrevWorkingDate } from '@/common/services/hooks/usePrevWorkingDate';
import { userHotkeyManager } from '@/common/utils/hotkey';
import {
  receiptDealTableDealInputFilterValueAtom,
  receiptDealTableDealRelatedFilterValueAtom,
  receiptDealTablePageAtom
} from '@/pages/Deal/Receipt/ReceiptDealPanel/atoms/table';
import { DEFAULT_RECEIPT_DEAL_RELATED_FILTER_VALUE } from '@/pages/Deal/Receipt/ReceiptDealPanel/constants/filter';
import { ReceiptDealInputFilter, ReceiptDealRelatedFilter } from '@/pages/Deal/Receipt/ReceiptDealPanel/types';

export const ReceiptDealFilterContainer = createContainer(() => {
  const [prev5WorkingDate] = usePrevWorkingDate(5);
  const showAllRef = useRef<HTMLButtonElement>(null);
  const [relatedFilterValue, setRelatedFilterValue] = useAtom(receiptDealTableDealRelatedFilterValueAtom);
  const [inputFilterValue, setInputFilterValue] = useAtom(receiptDealTableDealInputFilterValueAtom);
  const setPage = useSetAtom(receiptDealTablePageAtom);

  useEffect(() => {
    userHotkeyManager.register(UserHotkeyFunction.UserHotkeyShowAll, () => {
      showAllRef.current?.click();
    });
  }, [showAllRef]);

  const updateRelatedFilterValue = (param: Partial<ReceiptDealRelatedFilter>) => {
    setPage(1);
    const newValue = { ...relatedFilterValue, ...param };
    setRelatedFilterValue(newValue);
  };

  const updateInputFilterValue = (param: Partial<ReceiptDealInputFilter>, clearOtherParams?: boolean) => {
    setPage(1);
    let newValue;
    if (clearOtherParams) {
      newValue = { order_no: null, bridge_code: null, seq_number: null, internal_code: null, ...param };
    } else {
      newValue = { ...inputFilterValue, ...param };
    }
    setInputFilterValue(newValue);
  };

  const onShowAll = () => {
    const newValue = {
      ...DEFAULT_RECEIPT_DEAL_RELATED_FILTER_VALUE,
      date_range: {
        start_time: prev5WorkingDate.valueOf().toString(),
        end_time: moment().endOf('day').valueOf().toString()
      }
    };
    updateRelatedFilterValue(newValue);
  };

  return {
    showAllRef,
    relatedFilterValue,
    updateRelatedFilterValue,
    inputFilterValue,
    updateInputFilterValue,
    onShowAll
  };
});

export const ReceiptDealFilterProvider = ReceiptDealFilterContainer.Provider;
export const useReceiptDealFilter = ReceiptDealFilterContainer.useContainer;
