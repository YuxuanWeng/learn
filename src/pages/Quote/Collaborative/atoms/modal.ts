import { FiccBondBasic } from '@fepkg/services/types/common';
import { atom } from 'jotai';
import { LocalQuoteDraftDetail, LocalQuoteDraftMessage } from '@/common/services/hooks/local-server/quote-draft/types';
import { QuoteFocusInputType } from '@/pages/Quote/SingleQuote/types';

export const quoteMdlOpenAtom = atom(false);
export const quoteMdlSelectedAtom = atom<
  { message: LocalQuoteDraftMessage; details: LocalQuoteDraftDetail[] } | undefined
>(undefined);
export const quoteMdlFocusInputAtom = atom(QuoteFocusInputType.BOND);

export const settingMdlOpenAtom = atom(false);

export const repeatQuoteMdlOpenAtom = atom(false);
export const repeatQuoteMdlSelectedMessageKeyAtom = atom<string | undefined>(void 0);
export const repeatQuoteMdlSelectedBondAtom = atom<Partial<FiccBondBasic>>({});

export const originalTextMdlOpenAtom = atom(false, (_, set, val: boolean) => {
  if (val) document.body.classList.add('oms-original-text-modal-effect');
  else document.body.classList.remove('oms-original-text-modal-effect');

  set(originalTextMdlOpenAtom, val);
});
export const originalTextMdlTargetMessageAtom = atom<LocalQuoteDraftMessage | null>(null);
