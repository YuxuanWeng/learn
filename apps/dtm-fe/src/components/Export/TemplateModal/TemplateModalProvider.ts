import { message } from '@fepkg/components/Message';
import { ModalUtils } from '@fepkg/components/Modal';
import { createContainer } from 'unstated-next';
import { useImmer } from 'use-immer';
import { DEFAULT_EXPORT_TEMPLATE, EXPORT_TEMPLATE_CONFIG_PARAMS } from '../constants';
import { ExportTemplate, TemplateModalState } from '../types';
import { useExportTemplate } from '../useExportTemplate';

const TemplateModalContainer = createContainer(() => {
  const {
    templatesQuery,
    templatesMutation,
    templateSelectedIdQuery,
    templateSelectedIdMutation,
    exportTemplateSelectedIdParams
  } = useExportTemplate();

  const { data: templates = [], refetch } = templatesQuery;
  const { data: templateSelectedId } = templateSelectedIdQuery;

  const [mdlState, updateMdlState] = useImmer<TemplateModalState>({
    editing: false,
    loading: false,
    selectedId: templateSelectedId,
    updated: templates.find(item => item.id === templateSelectedId)?.value
  });

  const [addMdlState, updateAddMdlState] = useImmer({
    open: false,
    keyword: '',
    error: false
  });

  /** 是否选中默认模板 */
  const isDefaultSelected = mdlState.selectedId === DEFAULT_EXPORT_TEMPLATE.id;

  /** 已选中的模板 */
  const selectedTemplate = templates.find(item => item.id === mdlState.selectedId);

  const update = async (target: ExportTemplate[]) => {
    return templatesMutation.mutateAsync({ ...EXPORT_TEMPLATE_CONFIG_PARAMS, type: 'array', value: target });
  };

  /** 选择后备模板（需要选中上一个选项，如果找不到就使用默认的模板） */
  const selectFallbackTemplate = (data?: ExportTemplate[], id?: string) => {
    const selectedIdx = data?.findIndex(item => item.id === id) ?? -1;

    /** 下一个需要选中的模板，如果找不到就使用默认的模板 */
    const nextSelectedTemplate = !data || selectedIdx === -1 ? DEFAULT_EXPORT_TEMPLATE : data[selectedIdx - 1];
    updateMdlState(draft => {
      draft.editing = false;
      draft.selectedId = nextSelectedTemplate.id;
      draft.updated = nextSelectedTemplate.value;
    });

    return templateSelectedIdMutation.mutateAsync({
      ...exportTemplateSelectedIdParams,
      value: nextSelectedTemplate.id
    });
  };

  /** 检查模板是否存在 */
  const checkExists = async (id?: string, toast = true) => {
    let exist = true;

    const { data = [] } = (await refetch()) ?? {};
    exist = !!data?.some(item => item.id === id);

    if (!exist) {
      // 如果不存在了，需要选中后备模板
      selectFallbackTemplate(data, id);

      if (toast) {
        ModalUtils.warning({
          title: '模板已被删除',
          content: '当前模板已被删除，操作无效！',
          okText: '我知道了',
          showCancel: false
        });
      }
    }

    return { exist, data };
  };

  /** 检测模板是否重名 */
  const checkRename = async (data?: ExportTemplate[], id?: string, label?: string) => {
    data = data ?? (await refetch())?.data;

    const rename = !!data?.filter(item => item.id !== id)?.some(item => item.label === label);

    if (rename) message.error('当前模板名称已存在!');

    return { rename, data };
  };

  const handleEdit = () => {
    updateMdlState(draft => {
      draft.editing = true;
    });
  };

  const handleEditCancel = () => {
    updateMdlState(draft => {
      draft.editing = false;
      draft.updated = templates.find(item => item.id === draft.selectedId)?.value;
    });
  };

  const handleSave = async () => {
    updateMdlState(draft => {
      draft.loading = true;
    });

    const id = mdlState.selectedId;

    try {
      const { exist } = await checkExists(id);
      if (!exist) return;

      const selectedIdx = templates.findIndex(item => item.id === id);
      if (mdlState.updated) templates[selectedIdx].value = mdlState.updated;

      update([...templates]);
    } finally {
      updateMdlState(draft => {
        draft.editing = false;
        draft.loading = false;
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (id === DEFAULT_EXPORT_TEMPLATE.id) return;

    const { exist, data } = await checkExists(id);
    if (!exist) return;

    const target = [...data];
    const idx = target.findIndex(item => item.id === id);
    target.splice(idx, 1);

    const promises = [update(target)];

    // 如果删除已选中项，需要选择后备模板
    if (id === selectedTemplate?.id) promises.push(selectFallbackTemplate(data, id));

    Promise.all(promises);
  };

  return {
    templates,
    templatesQuery,
    templatesMutation,

    selectedTemplate,
    isDefaultSelected,

    mdlState,
    updateMdlState,
    addMdlState,
    updateAddMdlState,

    checkExists,
    checkRename,

    handleEdit,
    handleEditCancel,
    handleSave,
    handleDelete,

    update
  };
});

export const TemplateModalProvider = TemplateModalContainer.Provider;
export const useTemplateModal = TemplateModalContainer.useContainer;
