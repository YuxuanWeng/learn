import { useEffect, useMemo, useState } from 'react';
import { message } from '@fepkg/components/Message';
import { User, UserLite } from '@fepkg/services/types/bdm-common';
import { UserAccessGrant } from '@fepkg/services/types/bds-common';
import { UserAccessGrantType } from '@fepkg/services/types/bds-enum';
import { useMemoizedFn } from 'ahooks';
import { useImmer } from 'use-immer';
import { getUserAccessGrant } from '@/common/services/api/user/user-access-grant-get';
import { mulCreateGrantee } from '@/common/services/api/user/user-access-grantee-mul-create';
import { mulDeleteGrantee } from '@/common/services/api/user/user-access-grantee-mul-delete';
import { updateGrantee } from '@/common/services/api/user/user-access-grantee-update';
import { NavigatorItemId } from '@/components/Navigator';
import { useNavigatorCheckedIdValue } from '@/layouts/Home/atoms';
import { useSystemSettingPanel } from '../../providers/PanelProvider';

export enum AddModalType {
  Grantee,
  Granter,
  None
}

export const useGrant = (disabled?: boolean) => {
  const [accessGrants, setAccessGrants] = useState<UserAccessGrant[]>([]); // 授权信息列表
  const [selectedGrantee, setSelectedGrantee] = useState<UserLite>(); // 当前选中的被授权人
  const [modalType, setModalType] = useState(AddModalType.None); // 添加弹窗
  const [searchUsers, setSearchUsers] = useImmer<User[]>([]); // 当前搜索到的用户
  const [selectedUsers, setSelectedUsers] = useImmer<UserLite[]>([]); // 当前选中的用户

  const { productType } = useSystemSettingPanel();

  const init = useMemoizedFn(async () => {
    const result = await getUserAccessGrant({
      product_type: productType
    });

    setSelectedGrantee(prev => {
      if (prev) return prev;
      // 当前没有选中的被授权人，就默认选中第一项
      return result.access_grant_list?.at(0)?.grantee;
    });
    setAccessGrants(result.access_grant_list ?? []);
  });

  const checkedId = useNavigatorCheckedIdValue();
  const isChecked = checkedId === NavigatorItemId.Setting;
  useEffect(() => {
    if (isChecked && !disabled) {
      init();
    }
  }, [isChecked, disabled, init]);

  const grantees = useMemo(() => {
    return accessGrants.map(g => g.grantee);
  }, [accessGrants]);

  const [granters, selectedValid] = useMemo(() => {
    const res = accessGrants.find(a => a.grantee.user_id === selectedGrantee?.user_id);
    return [res?.granter_access_list ?? [], res?.flag_valid_grantee] as const;
  }, [accessGrants, selectedGrantee?.user_id]);

  /** 删除单个被授权人 */
  const deleteGrantee = async (userId: string) => {
    if (userId === selectedGrantee?.user_id) {
      setSelectedGrantee(undefined);
    }
    await mulDeleteGrantee({
      grantee_id_list: [userId],
      product_type: productType
    });
    init();
  };

  /** 更新授权人 */
  const updateGranter = async (userId: string, grantType: UserAccessGrantType, value: boolean) => {
    if (selectedGrantee == null) return;

    const granterAccessList = granters.map(i => {
      if (i.granter.user_id !== userId) {
        return {
          granter_id: i.granter.user_id,
          access_grant_list: i.access_grant_list
        };
      }
      const accessGrantList = value
        ? [...(i.access_grant_list ?? []), grantType]
        : i.access_grant_list?.filter(grantItem => grantItem !== grantType);

      return {
        granter_id: i.granter.user_id,
        access_grant_list: accessGrantList
      };
    });

    await updateGrantee({
      product_type: productType,
      grantee_id: selectedGrantee.user_id,
      granter_access_list: granterAccessList
    });

    await init();
  };

  /** 删除授权人 */
  const deleteGranter = async (userId: string) => {
    if (selectedGrantee == null) return;

    const granterAccessList = granters
      .filter(v => v.granter.user_id !== userId)
      .map(i => ({
        granter_id: i.granter.user_id,
        access_grant_list: i.access_grant_list
      }));

    await updateGrantee({
      product_type: productType,
      grantee_id: selectedGrantee.user_id,
      granter_access_list: granterAccessList
    });

    await init();
  };

  /** 添加被授权人 */
  const openAddGranteeModal = () => {
    setModalType(AddModalType.Grantee);
    setSelectedUsers(grantees);
  };

  /** 添加指定人 */
  const openAddGranterModal = () => {
    if (!selectedGrantee) return;
    setModalType(AddModalType.Granter);
    setSelectedUsers(granters.map(i => i.granter));
  };

  /** 关闭添加Modal */
  const closeAddModal = () => {
    setModalType(AddModalType.None);
    setSelectedUsers([]);
    setSearchUsers([]);
  };

  /** 更新当前搜索结果 */
  const updateSearchUsers = (val: User[]) => {
    if (modalType === AddModalType.None) return;
    setSearchUsers(val);
  };

  /** 选中某个用户 */
  const selectUser = (userId: string, val: boolean) => {
    if (modalType === AddModalType.None) return;

    if (val) {
      if (selectedUsers.length >= 20 && modalType === AddModalType.Granter) {
        message.error('授权人数量上限为二十个');
        return;
      }
      const target = searchUsers.find(u => u.user_id === userId);

      if (target != null) {
        setSelectedUsers([...selectedUsers, target]);
      }
    } else {
      setSelectedUsers(selectedUsers.filter(u => u.user_id !== userId));
    }
  };

  const currentSelected = useMemo(
    () => selectedUsers.filter(u => searchUsers.some(search => search.user_id === u.user_id)),
    [selectedUsers, searchUsers]
  );

  const isSelectAll = useMemo(() => {
    return currentSelected.length !== 0 && currentSelected.length === searchUsers.length;
  }, [currentSelected, searchUsers]);

  /** 全选 */
  const selectAll = () => {
    if (modalType === AddModalType.None) return;

    if (isSelectAll) {
      // 取消全选
      setSelectedUsers([]);
    } else {
      if (searchUsers.length > 20 && modalType === AddModalType.Granter) {
        message.error('授权人数量上限为二十个');
        return;
      }
      // 全选
      setSelectedUsers([...searchUsers]);
    }
  };

  /** 删除某个用户 */
  const deleteUser = (userId: string) => {
    if (modalType === AddModalType.None) return;
    setSelectedUsers(users => users.filter(u => u.user_id !== userId));
  };

  /** 是否半选 */
  const isIndeterminate = useMemo(() => {
    return currentSelected.length !== searchUsers.length && currentSelected.length !== 0 && searchUsers.length !== 0;
  }, [currentSelected, searchUsers]);

  /** 保存 */
  const save = async () => {
    const selectedUserIds = selectedUsers?.map(v => v.user_id) || [];

    if (modalType === AddModalType.Grantee) {
      /**
       * 被授权人，请求分为两种情况
       * 1. 新增
       * 2. 删除
       */
      // 删除：判断是否存在删除的<被授权人>
      const deleteUsers = accessGrants?.filter(v => !selectedUserIds.includes(v.grantee.user_id));
      const deleteUserIds = deleteUsers?.map(v => v.grantee.user_id);
      if (deleteUserIds?.length) {
        await mulDeleteGrantee({
          product_type: productType,
          grantee_id_list: deleteUserIds
        });

        if (selectedGrantee != null && deleteUserIds.includes(selectedGrantee.user_id)) {
          setSelectedGrantee(undefined);
        }
      }

      if (selectedUserIds.length === 0) {
        init();
        closeAddModal();
        return;
      }
      /*
       * 新增：判断是否存在新增的<被授权人>
       */
      const createUserIds = selectedUserIds?.filter(userId => !accessGrants.some(v => v.grantee.user_id === userId));
      if (createUserIds?.length) {
        await mulCreateGrantee({
          grantee_id_list: createUserIds,
          product_type: productType
        });
      }
    } else if (modalType === AddModalType.Granter) {
      /* 若当前未选中<被授权人>，则不更新 */
      if (selectedGrantee == null) return;

      const granterAccessList = selectedUsers.map(i => {
        const accessGrantList = granters.find(granter => granter.granter.user_id === i.user_id)?.access_grant_list ?? [
          UserAccessGrantType.UserAccessGrantTypeDealDetailBridge
        ]; // 默认明细/过桥;

        return {
          granter_id: i.user_id,
          access_grant_list: accessGrantList
        };
      });

      await updateGrantee({
        product_type: productType,
        grantee_id: selectedGrantee.user_id,
        granter_access_list: granterAccessList
      });
    }

    await init();
    closeAddModal();
  };

  return {
    modalType,
    accessGrants,
    grantees,
    granters,
    selectedValid,
    searchUsers,
    selectedGrantee,
    isIndeterminate,
    selectedUsers,
    save,
    deleteUser,
    selectAll,
    selectUser,
    updateSearchUsers,
    closeAddModal,
    openAddGranteeModal,
    openAddGranterModal,
    updateGranter,
    deleteGranter,
    deleteGrantee,
    setSelectedGrantee,
    isSelectAll
  };
};
