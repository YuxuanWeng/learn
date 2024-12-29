import { ColumnDef } from '@tanstack/react-table';
import {
  bidBrokerCol,
  bidCpCol,
  firstMaturityDateCol,
  ofrBrokerCol,
  ofrCpCol,
  pxCol,
  shortNameCol,
  volCol
} from '@/pages/ProductPanel/components/DealTable/columns';
import { DealTableColumn } from '@/pages/ProductPanel/components/DealTable/types';

export const marketRecommendColumns: ColumnDef<DealTableColumn>[] = [
  firstMaturityDateCol,
  shortNameCol,
  pxCol,
  volCol,
  bidCpCol,
  bidBrokerCol,
  ofrCpCol,
  ofrBrokerCol
];
