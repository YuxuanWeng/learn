import { useConfigRedis } from '@fepkg/business/hooks/useConfigRedis';
import { useAuth } from '@/providers/AuthProvider';
import { useMemoizedFn } from 'ahooks';
import {
  DEFAULT_EXPORT_TEMPLATE_CONFIG,
  EXPORT_TEMPLATE_CONFIG_PARAMS,
  getExportTemplateSelectedIdParams
} from './constants';
import { ExportTemplateIdxCache } from './types';

export const useExportTemplate = () => {
  const { user } = useAuth();
  const exportTemplateSelectedIdParams = getExportTemplateSelectedIdParams(user?.user_id);

  const { query: templatesQuery, mutation: templatesMutation } = useConfigRedis(EXPORT_TEMPLATE_CONFIG_PARAMS);
  const { query: templateSelectedIdQuery, mutation: templateSelectedIdMutation } =
    useConfigRedis(exportTemplateSelectedIdParams);

  const { data: templates = [] } = templatesQuery;
  const { data: templateSelectedId } = templateSelectedIdQuery;

  const getTemplateIdxCache = useMemoizedFn(() => {
    const cache: ExportTemplateIdxCache = {};

    /** 已选中的模板 */
    const selectedTemplate = templates.find(item => item.id === templateSelectedId);

    for (let i = 0, len = DEFAULT_EXPORT_TEMPLATE_CONFIG.length; i < len; i++) {
      const item = DEFAULT_EXPORT_TEMPLATE_CONFIG[i];
      cache[i] = !!selectedTemplate?.value?.[item.key];
    }

    return cache;
  });

  return {
    templatesQuery,
    templatesMutation,
    templateSelectedIdQuery,
    templateSelectedIdMutation,

    exportTemplateSelectedIdParams,
    getTemplateIdxCache
  };
};
