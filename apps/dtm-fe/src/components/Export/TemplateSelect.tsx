import { useEffect, useMemo, useState } from 'react';
import { Button } from '@fepkg/components/Button';
import { Combination } from '@fepkg/components/Combination';
import { Select } from '@fepkg/components/Select';
import { IconEdit } from '@fepkg/icon-park-react';
import { useMemoizedFn } from 'ahooks';
import { TemplateModal } from './TemplateModal/Modal';
import { DEFAULT_EXPORT_TEMPLATE } from './constants';
import { useExportTemplate } from './useExportTemplate';

const defaultSelectedId = DEFAULT_EXPORT_TEMPLATE.id;

export const TemplateSelect = () => {
  const { templatesQuery, templateSelectedIdQuery, templateSelectedIdMutation, exportTemplateSelectedIdParams } =
    useExportTemplate();

  const { data: templates = [], isFetching, refetch, dataUpdatedAt } = templatesQuery;
  const { data: templateSelectedId } = templateSelectedIdQuery;

  const [open, setOpen] = useState(false);

  const options = useMemo(
    () => templates.map(item => ({ label: item.label, value: item.id })),
    // templates 内每项发生变化，但 templates 不一定在变化，因此需要加上 dataUpdateAt 判断
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [templates, dataUpdatedAt]
  );

  const handleChange = useMemoizedFn((id: string) => {
    const { mutate } = templateSelectedIdMutation;

    mutate({ ...exportTemplateSelectedIdParams, value: id });
  });

  useEffect(() => {
    if (templateSelectedId === defaultSelectedId) return;

    // 如果模板里不存在已保存的选中模板 id，需要置为默认
    if (!isFetching && !options.some(item => item.value === templateSelectedId)) {
      handleChange(defaultSelectedId);
    }
  }, [handleChange, isFetching, options, templateSelectedId]);

  return (
    <>
      <Combination
        containerCls="mr-4"
        background="prefix700-suffix600"
        suffixButton
        prefixNode={
          <Select
            className="w-[252px]"
            label="导出模板"
            clearIcon={null}
            defaultValue={defaultSelectedId}
            value={templateSelectedId ?? defaultSelectedId}
            options={options}
            onChange={handleChange}
          />
        }
        suffixNode={
          <Button.Icon
            className="w-[30px] h-[30px] rounded-l-none"
            icon={<IconEdit />}
            onClick={() => {
              refetch();
              setOpen(true);
            }}
          />
        }
      />

      <TemplateModal
        visible={open}
        onCancel={() => setOpen(false)}
      />
    </>
  );
};
