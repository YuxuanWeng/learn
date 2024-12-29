import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveAccessQuery } from '@fepkg/business/hooks/useLiveAccessQuery';
import { AccessCodeSystemPrefix } from '@fepkg/business/types/access';
import { ModalUtils } from '@fepkg/components/Modal';
import { AccessCode } from '@fepkg/services/access-code';
import { AccountStatus, JobStatus, ProductType } from '@fepkg/services/types/bdm-enum';
import { User } from '@fepkg/services/types/common';
import { useAccessQuery } from '@/hooks/useAccessQuery';
import { useToken } from '@/hooks/useToken';
import { useUserQuery } from '@/hooks/useUserQuery';
import { clearAuthInfo } from '@/utils/auth';
import { getIsDisplayLogoutModal, setIsDisplayLogoutModal } from '@/utils/modal';
import { getUserProductList } from '@/utils/product';
import { useMemoizedFn } from 'ahooks';
import { isEqual } from 'lodash-es';
import { logout } from '@/common/services/api/auth/logout';
import { RouteUrl } from '@/router/constants';

export const useDtmLiveAccessQuery = () => {
  const { token } = useToken();
  const [queryEnable, setQueryEnable] = useState(true);
  const navigate = useNavigate();
  const preProductList = useRef<ProductType[]>();
  const userQuery = useUserQuery();
  const accessQuery = useAccessQuery();
  const enable = !!token && queryEnable;

  const [accessCodeList, setAccessCodeList] = useState<AccessCode[]>(() => [...(accessQuery.data ?? [])]);
  const access = useMemo(() => new Set(accessCodeList), [accessCodeList]);

  const onSuccess = useMemoizedFn((data?: User) => {
    const tmpCurAccessSet = new Set<AccessCode>(data?.access_code_list ?? []);
    if (!tmpCurAccessSet.has(AccessCode.CodeDTM)) {
      setQueryEnable(false);
      setIsDisplayLogoutModal(true);
      ModalUtils.warning({
        title: '账号登出',
        content: '您没有当前系统权限',
        keyboard: false,
        onOk: () => {
          setIsDisplayLogoutModal(false);
          clearAuthInfo();
          navigate(RouteUrl.Login);
        },
        showCancel: false,
        blockAll: true
      });
      return;
    }
    if (!isEqual(access, tmpCurAccessSet)) {
      setAccessCodeList(data?.access_code_list ?? []);
      const tmpPrvAccessSet = new Set(access);

      for (const code of new Array(...tmpPrvAccessSet)) {
        if (!AccessCode[code].startsWith(AccessCodeSystemPrefix.DTM)) tmpPrvAccessSet.delete(code);
      }
      for (const code of new Array(...tmpCurAccessSet)) {
        if (!AccessCode[code].startsWith(AccessCodeSystemPrefix.DTM)) tmpCurAccessSet.delete(code);
      }

      if (!isEqual(tmpPrvAccessSet, tmpCurAccessSet)) {
        // 避免重复打开
        if (getIsDisplayLogoutModal()) {
          return;
        }
        setQueryEnable(false);
        setIsDisplayLogoutModal(true);
        ModalUtils.warning({
          title: '权限变更',
          content: '系统权限发生变化，请刷新页面！',
          keyboard: false,
          okText: '刷新页面',
          onOk: () => {
            setIsDisplayLogoutModal(false);
            window.location.reload();
          },
          showCancel: false,
          blockAll: true
        });
        return;
      }
    }

    const productTypeList = getUserProductList(data);
    if (!preProductList.current) {
      preProductList.current = productTypeList;
    }
    if (data && !productTypeList?.length) {
      setQueryEnable(false);
      ModalUtils.warning({
        title: '没有业务产品权限',
        content: '没有业务产品权限，请联系管理员处理',
        showCancel: false,
        okText: '我知道了',
        onOk: () => {
          clearAuthInfo();
          navigate(RouteUrl.Login);
        },
        blockAll: true
      });
    } else if (
      data &&
      productTypeList?.length &&
      preProductList.current?.length &&
      !isEqual(productTypeList, preProductList.current)
    ) {
      setQueryEnable(false);
      ModalUtils.warning({
        title: '业务产品权限变更',
        content: '业务产品权限发生变更，请刷新页面',
        showCancel: false,
        okText: '刷新页面',
        onOk: () => {
          window.location.reload();
        },
        blockAll: true
      });
    } else if (
      data &&
      !!data.job_status &&
      !!data.account_status &&
      (data.job_status !== JobStatus.OnJob || data.account_status !== AccountStatus.Enable)
    ) {
      setQueryEnable(false);
      ModalUtils.warning({
        title: '账号不可用',
        content: '您的账号不可用，请联系管理员!',
        showCancel: false,
        onOk: () => {
          logout().finally(() => {
            clearAuthInfo();
            navigate(RouteUrl.Login);
          });
        },
        blockAll: true
      });
    }
  });

  const query = useLiveAccessQuery({ userId: userQuery.user?.user_id, enable, onSuccess });

  return { access, user: query.data ?? userQuery.user };
};
