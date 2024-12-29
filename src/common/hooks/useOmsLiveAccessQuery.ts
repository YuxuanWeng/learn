import { useRef } from 'react';
import { useLiveAccessQuery } from '@fepkg/business/hooks/useLiveAccessQuery';
import { AccessCodeSystemPrefix } from '@fepkg/business/types/access';
import { AccessCode } from '@fepkg/services/access-code';
import { User } from '@fepkg/services/types/bdm-common';
import { AccountStatus, JobStatus, ProductType } from '@fepkg/services/types/bdm-enum';
import { useMemoizedFn } from 'ahooks';
import { LoginEventEnum } from 'app/types/IPCEvents';
import { BroadcastChannelEnum } from 'app/types/broad-cast';
import { useAtom } from 'jotai';
import { isEqual } from 'lodash-es';
import { GLOBAL_SCOPE, isUserQueryError } from '@/common/atoms';
import { AccessProductTypeList, ProductType2AccessCodeMap } from '@/common/constants/auth';
import { useAccess } from '@/common/providers/AccessProvider';
import { miscStorage } from '@/localdb/miscStorage';

const OMSSystemAccessCodeList = [
  AccessCode.CodeOmsBNC,
  AccessCode.CodeOmsBCO,
  AccessCode.CodeOmsNCD,
  AccessCode.CodeOmsNCDP
];

export const useOmsLiveAccessQuery = () => {
  const [hasError, setHasError] = useAtom(isUserQueryError, GLOBAL_SCOPE);
  const { access, setAccessCodeList } = useAccess();
  const preProductTypeList = useRef<ProductType[]>();

  const enable = !!miscStorage.token && !hasError;

  const onSuccess = useMemoizedFn((data?: User) => {
    if (data) {
      miscStorage.userInfo = data;
    }
    const tmpCurAccessSet = new Set(data?.access_code_list ?? []);

    if (OMSSystemAccessCodeList.every(code => !tmpCurAccessSet.has(code))) {
      window.Main.invoke(LoginEventEnum.BeforeLogout, '您没有当前系统权限', '账号登出');
      return;
    }
    if (!isEqual(access, tmpCurAccessSet)) {
      // 用户功能权限变更
      setAccessCodeList(data?.access_code_list ?? []);
      // 发个广播，监听权限变动用
      window.Broadcast.emit(BroadcastChannelEnum.BROADCAST_ACCESS_CHANGE, tmpCurAccessSet);
      // 特殊处理，OMS此处还返回了CRM、DTM的系统权限
      const tmpPrvAccessSet = new Set(access);

      for (const code of new Array(...tmpPrvAccessSet)) {
        if (!AccessCode[code].startsWith(AccessCodeSystemPrefix.OMS)) tmpPrvAccessSet.delete(code);
      }
      for (const code of new Array(...tmpCurAccessSet)) {
        if (!AccessCode[code].startsWith(AccessCodeSystemPrefix.OMS)) tmpCurAccessSet.delete(code);
      }
      if (!isEqual(tmpPrvAccessSet, tmpCurAccessSet)) {
        setHasError(true);
        window.Main.invoke(LoginEventEnum.BeforeLogout, '系统权限发生变化，请重新登录！', '权限变更', '重新登录');
        return;
      }
    }

    const availableProductTypeList = data?.product_list
      ?.map(p => p.product_type)
      .filter(p => AccessProductTypeList.includes(p) && tmpCurAccessSet.has(ProductType2AccessCodeMap[p]))
      .sort((a, b) => a - b);

    // 用户可用产品变更
    if (!preProductTypeList.current) {
      preProductTypeList.current = availableProductTypeList;
    } else if (!availableProductTypeList?.length) {
      setHasError(true);
      window.Main.invoke(
        LoginEventEnum.BeforeLogout,
        '没有业务产品权限，请联系管理员处理',
        '没有业务产品权限',
        '我知道了'
      );
      return;
    } else if (!isEqual(availableProductTypeList, preProductTypeList.current)) {
      setHasError(true);
      window.Main.invoke(LoginEventEnum.BeforeLogout, '业务产品权限变更，请重新登录！', '业务产品权限变更', '重新登录');
      return;
    }
    // 用户在职状态与账号状态异常
    if (
      !!data?.job_status &&
      !!data?.account_status &&
      (data.job_status !== JobStatus.OnJob || data.account_status !== AccountStatus.Enable)
    ) {
      setHasError(true);
      window.Main.invoke(LoginEventEnum.BeforeLogout, '您的账号不可用，请联系管理员!', '账号不可用');
    }
  });

  const query = useLiveAccessQuery({ userId: miscStorage.userInfo?.user_id, enable, onSuccess });

  return { ...query };
};
