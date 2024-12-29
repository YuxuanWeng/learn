import { Button } from '@fepkg/components/Button';
import { IconMenuUnfold } from '@fepkg/icon-park-react';
import { ProductType } from '@fepkg/services/types/enum';
import { useProductParams } from '@/layouts/Home/hooks';
import { useProductPanel } from '../../providers/PanelProvider';

export const SIDEBAR_CONTENT_ID = 'sidebar-content';

const DEFAULT_SIDEBAR_WIDTH = 160;

const getSidebarWidth = (productType: ProductType) => {
  switch (productType) {
    case ProductType.NCDP:
      return 80;
    default:
      return DEFAULT_SIDEBAR_WIDTH;
  }
};

export const Sidebar = () => {
  const { productType } = useProductParams();
  const { accessCache, sidebarRef, sidebarOpen, toggleSidebarOpen } = useProductPanel();

  // 若报价和成交权限均无，则不展示右侧操作栏
  if (productType !== ProductType.NCDP && !accessCache.quote && !accessCache.deal) return null;
  // NCDP：若报价和报表权限均无，则不展示右侧操作栏
  if (productType === ProductType.NCDP && !accessCache.quote && !accessCache.report) return null;

  const width = getSidebarWidth(productType);
  const shorter = width < DEFAULT_SIDEBAR_WIDTH;

  return (
    <div
      className="relative border-0 border-t border-l border-solid border-gray-600 overflow-hidden transition-width duration-200 ease-linear"
      // 加 1 是因为设计稿为 160px，但左边框也会占据 1 px，计算后元素内内容才为设计稿的 160px 宽
      style={{ width: sidebarOpen ? width + 1 : 0 }}
    >
      <div style={{ width }}>
        <div className="flex justify-between items-center h-7 px-2 pt-4">
          <span className="text-sm font-bold select-none">操作</span>
          {!shorter && (
            <Button.Icon
              text
              icon={<IconMenuUnfold />}
              tooltip={{ content: '收起右边栏', delay: { open: 600 } }}
              onClick={toggleSidebarOpen}
            />
          )}
        </div>

        <div
          ref={sidebarRef}
          id={SIDEBAR_CONTENT_ID}
          className="absolute top-10 bottom-0 flex flex-col flex-1 gap-3 my-3 mx-2 rounded-b-lg"
        />
      </div>
    </div>
  );
};
