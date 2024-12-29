import { atom } from 'jotai';
import moment from 'moment';

export const openTimeAtom = atom<string>(moment().format('YYYY-MM-DD hh:mm:ss'));
