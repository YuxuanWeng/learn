import cx from 'classnames';
import { useProductParams } from '@/layouts/Home/hooks';
import { miscStorage } from '@/localdb/miscStorage';
import { Item } from '../Item';
import { useGroupSetting } from '../providers';
import { getUserInvalid } from '../utils';

const BASE_CLS = 'flex flex-col w-[50%] gap-2';

export const Body = () => {
  const { brokers = [], handleDeleteBroker, groups } = useGroupSetting();
  const { productType } = useProductParams();

  if (!groups.length) return null;

  const mid = Math.ceil(brokers.length / 2);
  const left = brokers.slice(0, mid);
  const right = brokers.slice(mid);
  const lintHeight = left.length * 40 - 8;

  const myUserId = miscStorage.userInfo?.user_id;

  return (
    <div className="flex flex-1 overflow-overlay w-full -mr-3 pr-2 pb-2">
      <div className={cx(BASE_CLS, 'items-start')}>
        {left.map(v => (
          <Item
            className="!w-50"
            key={v.user_id}
            id={v.user_id}
            value={v.name_cn}
            needPop={false}
            invalid={getUserInvalid(v, productType)}
            canDelete={v.user_id !== myUserId}
            onDelete={handleDeleteBroker}
          />
        ))}
      </div>

      <div
        className="component-dashed-y-600"
        style={{ height: lintHeight }}
      />

      <div className={cx(BASE_CLS, 'items-end')}>
        {right.map(v => (
          <Item
            className="!w-50"
            key={v.user_id}
            id={v.user_id}
            value={v.name_cn}
            needPop={false}
            invalid={getUserInvalid(v, productType)}
            canDelete={v.user_id !== myUserId}
            onDelete={handleDeleteBroker}
          />
        ))}
      </div>
    </div>
  );
};
