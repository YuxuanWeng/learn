import cx from 'classnames';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { Provider as JotaiProvider } from 'jotai';
import { useOmsLiveAccessQuery } from '@/common/hooks/useOmsLiveAccessQuery';
import { useAccess } from '@/common/providers/AccessProvider';
import { LocalWebSocketProvider } from '@/common/providers/LocalWebSocket';
import { OmsAccessCodeSuffix } from '@/common/types/access';
import { getOmsAccessCodeEnum } from '@/common/utils/access';
import { NavigatorItemId } from '@/components/Navigator/types';
import { useNavigatorCheckedIdValue } from '@/layouts/Home/atoms';
import { usePageInitialed } from '@/layouts/Home/atoms/page-initialed';
import { useActiveProductType } from '@/layouts/Home/hooks/useActiveProductType';
import { Content } from './components/Content';
import { FilterArea } from './components/FilterArea';
import { Menu } from './components/Menu';
import { NCDPContent } from './components/NCDPContent';
import { Sidebar } from './components/Sidebar';
import { useParamsCacheInitialValues } from './hooks/useParamsCacheInitialValues';
import { useSyncUndoSnapshots } from './hooks/useSyncUndoSnapshots';
import { MainGroupProvider } from './providers/MainGroupProvider';
import { ProductPanelProvider, useProductPanel } from './providers/PanelProvider';

type ProductPanelProps = {
  /** 是否展示菜单 */
  showMenu?: boolean;
};

/** ProductPanel 页全局预加载 hooks 放置处，目的是为了该类 hooks 在获取时的状态变更导致页面非必要的重新渲染 */
const HooksRenderer = () => {
  useSyncUndoSnapshots();

  return null;
};

/** 作为首页的 ProductPanel 页全局预加载 hooks 放置处，目的是为了该类 hooks 在获取时的状态变更导致页面非必要的重新渲染 */
const HomeHooksRenderer = () => {
  useOmsLiveAccessQuery();

  return null;
};

const Inner = ({ showMenu = true }: ProductPanelProps) => {
  const { isNCDP } = useProductPanel();

  const checkedId = useNavigatorCheckedIdValue();
  const displayCls = checkedId === NavigatorItemId.Setting ? 'hidden' : '';

  return (
    <section className={cx('flex home-panel', displayCls)}>
      {showMenu && <Menu />}

      <div className="flex flex-col flex-1 w-0">
        <FilterArea.Header showMenu={showMenu} />
        <FilterArea.Body showMenu={showMenu} />

        {isNCDP ? <NCDPContent showMenu={showMenu} /> : <Content showMenu={showMenu} />}
      </div>

      <Sidebar />
    </section>
  );
};

const ProductPanel = ({ showMenu = true }: ProductPanelProps) => {
  const { activeProductType } = useActiveProductType() ?? {};
  const { access } = useAccess();
  const [jotaiInitialValues] = useParamsCacheInitialValues();
  usePageInitialed();

  return (
    <LocalWebSocketProvider initialState={{ isMain: true }}>
      <JotaiProvider initialValues={jotaiInitialValues}>
        <ProductPanelProvider>
          <MainGroupProvider>
            {/* activeProductType 变了之后直接将以下组件树重新初始化速度会更快 */}
            {access?.has(getOmsAccessCodeEnum(activeProductType ?? ProductType.BNC, OmsAccessCodeSuffix.MktPage)) && (
              <Inner
                key={activeProductType}
                showMenu={showMenu}
              />
            )}
            <HooksRenderer />
            {showMenu && <HomeHooksRenderer />}
          </MainGroupProvider>
        </ProductPanelProvider>
      </JotaiProvider>
    </LocalWebSocketProvider>
  );
};

export default ProductPanel;
