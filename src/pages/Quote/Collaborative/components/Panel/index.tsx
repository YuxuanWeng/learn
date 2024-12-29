import { DraftGroupTable } from './components/DraftGroupTable';
import { DraftGroupTableContextMenu } from './components/DraftGroupTable/ContextMenu';
import { Header } from './components/Header';
import { ParsingArea } from './components/ParsingArea';

export const CollaborativeQuotePanel = () => {
  return (
    <>
      <Header />
      <ParsingArea />

      <DraftGroupTable />
      <DraftGroupTableContextMenu />
    </>
  );
};
