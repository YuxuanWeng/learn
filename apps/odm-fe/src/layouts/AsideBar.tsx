import { useNavigate } from 'react-router-dom';
import cx from 'classnames';
import { AccessCode } from '@fepkg/services/access-code';
import { useAuth } from '@/providers/AuthProvider';
import { useHomeLayout } from '@/providers/LayoutProvider';
import { useBondConfig } from '@/providers/OutBoundConfigProvider';
import { TabEnum } from '@/pages/Home/type';
import { ASIDE_BAR_WIDTH, OutBoundMap, outBoundList } from './constant';

export const AsideBar = () => {
  const { current, setCurrent, setParams, setActiveTab } = useHomeLayout();
  const { access } = useAuth();
  const { handleAction } = useBondConfig();
  // 能进到odm的，一定会有记录或配置中的任意一个
  const target = access?.has(AccessCode.CodeOdmMsgLog) ? '/home' : 'conf';
  const navTo = useNavigate();
  return (
    <ul
      className="flex flex-col gap-3 p-4"
      style={{ width: ASIDE_BAR_WIDTH }}
    >
      {outBoundList.map(i => {
        const item = OutBoundMap[i];
        const selected = current === i;
        return (
          <li
            key={i}
            className={cx(
              'w-44 h-14 flex items-center gap-3 p-4 cursor-pointer',
              'rounded-lg border border-solid',
              'text-gray-000 font-medium text-md',
              selected
                ? 'aside-selected bg-gray-700 border-gray-700'
                : 'bg-transparent border-transparent hover:border-gray-500'
            )}
            onClick={() =>
              handleAction(() => {
                setCurrent(i);
                // 重置当前页签
                setActiveTab(TabEnum.Record);
                // 重置筛选条件
                setParams({});
                navTo({ pathname: target, search: `inst=${i}` });
              })
            }
          >
            <img
              className="h-6 w-6 rounded"
              src={item.imgSrc}
              alt={item.imgAlt}
            />
            {item.name}
          </li>
        );
      })}
    </ul>
  );
};
