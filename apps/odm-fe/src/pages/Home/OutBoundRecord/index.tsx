import { NotifyProvider } from '@/providers/NotifyProvider';
import { NotifyTable } from './components/NotifyTable';
import { SearchFilter } from './components/SearchFilter';

export const OutBoundRecord = () => {
  return (
    <NotifyProvider>
      <SearchFilter />
      <NotifyTable />
    </NotifyProvider>
  );
};
