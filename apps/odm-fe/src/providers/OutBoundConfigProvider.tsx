import { useState } from 'react';
import { ModalUtils } from '@fepkg/components/Modal';
import { fetchConfig } from '@fepkg/services/api/config/get';
import { setConfig } from '@fepkg/services/api/config/set';
import { APIs } from '@fepkg/services/apis';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { queryClient } from '@/utils/query-client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { isEqual } from 'lodash-es';
import { createContainer } from 'unstated-next';
import { useImmer } from 'use-immer';
import { OutBoundConfValue } from '@/common/types';
import { DEFAULT_CONF } from '@/pages/Home/OutBoundConfig/constants';
import { useHomeLayout } from './LayoutProvider';

const container = createContainer(() => {
  // 当前配置页的业务产品
  const [productType, setProductType] = useState(ProductType.BNC);
  const [configState, setConfigState] = useImmer<OutBoundConfValue>(DEFAULT_CONF);
  const { current, confOpen, setConfOpen } = useHomeLayout();
  const configQueryKey = [APIs.config.get, current];

  // 请求配置和修改配置的基础入参
  const configParams = {
    type: 'object',
    namespace: 'bds_client',
    // key: `out_bound_conf_${current}`
    // 避免联调时 value 格式与 dev 格式不一致 导致 dev 环境报错
    key: `out_bound_conf_${current}_v2`
  } as const;

  // 请求行情推送配置的配置内容
  const configStateQuery = useQuery({
    queryKey: configQueryKey,
    queryFn: async ({ signal }) => {
      const result = await fetchConfig<OutBoundConfValue>(configParams, { signal });
      const resultState = { ...DEFAULT_CONF, ...result };
      setConfigState(resultState);
      return resultState;
    },
    refetchOnWindowFocus: false
  });

  /** 处理路由跳转、取消编辑系列 需要判断用户是否编辑了字段的动作 */
  const handleAction = (cb: () => void) => {
    const contentChanged =
      // 处于编辑模式下且数据发生了改变
      confOpen && !isEqual(configState[productType]?.fieldList, configStateQuery.data?.[productType]?.fieldList);

    if (!contentChanged) {
      cb();
      setConfOpen(false);
    } else {
      ModalUtils.warn({
        title: '退出编辑',
        content: '您本次更改的内容将不会保存，确定退出编辑吗？',
        cancelText: '继续编辑',
        onOk: () => {
          // 确认取消编辑
          setConfigState(draft => {
            // 避免服务端返回的数据中不存在字段fieldList而报错
            draft[productType] = configStateQuery.data?.[productType] || DEFAULT_CONF[ProductType.BNC];
          });
          cb();
          setConfOpen(false);
        }
      });
    }
  };

  /** 请求修改行情推送配置 */
  const { mutate: mutateConfig } = useMutation({
    mutationFn: (params: Partial<OutBoundConfValue>) => {
      return setConfig({ ...configParams, value: { ...configState, ...params } });
    },
    onMutate(settingItem) {
      // 当前 query 缓存
      const cache = queryClient.getQueryData<OutBoundConfValue>(configQueryKey, { exact: true });
      // 乐观更新时没有传入的参数需要聪cache中解构获得，否则会清空已经配置的字段
      queryClient.setQueryData(configQueryKey, { ...cache, ...settingItem });
      // 乐观更新失败的回滚函数
      return () => {
        queryClient.setQueryData(configQueryKey, cache);
      };
    }
  });

  return {
    configParams,
    configStateQuery,
    mutateConfig,
    configState,
    setConfigState,
    handleAction,
    productType,
    setProductType
  };
});

export const OutBoundConfigProvider = container.Provider;
export const useBondConfig = container.useContainer;
