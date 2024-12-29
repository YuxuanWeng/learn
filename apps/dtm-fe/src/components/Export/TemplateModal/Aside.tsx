import { useState } from 'react';
import { BaseOption } from '@fepkg/components/BaseOptionsRender/BaseOption';
import { Button } from '@fepkg/components/Button';
import { Popconfirm } from '@fepkg/components/Popconfirm';
import { SettingLayout } from '@fepkg/components/SettingLayout';
import { Tooltip } from '@fepkg/components/Tooltip';
import { IconAdd, IconDelete } from '@fepkg/icon-park-react';
import { DEFAULT_EXPORT_TEMPLATE, MAX_TEMPLATE_COUNT } from '../constants';
import { ExportTemplate } from '../types';
import { useTemplateModal } from './TemplateModalProvider';

const Option = ({ item }: { item: ExportTemplate }) => {
  const { templates, mdlState, updateMdlState, handleDelete } = useTemplateModal();
  const [delConfirm, setDelConfirm] = useState(false);
  const selected = mdlState.selectedId === item.id;

  const handleSelect = (id: string) => {
    updateMdlState(draft => {
      draft.editing = false;
      draft.selectedId = id;
      draft.updated = templates.find(i => i.id === id)?.value;
    });
  };

  return (
    <BaseOption
      className="mb-2"
      hoverActive
      onClick={() => handleSelect(item.id)}
      selected={selected}
      hoverShowSuffix={!delConfirm}
      suffixNode={
        item.id !== DEFAULT_EXPORT_TEMPLATE.id && (
          <Popconfirm
            type="danger"
            placement="right"
            content="确认删除此模板？"
            floatingProps={{ className: 'w-[240px]' }}
            confirmBtnProps={{ label: '删除' }}
            onConfirm={() => handleDelete(item.id)}
            onOpenChange={setDelConfirm}
          >
            <IconDelete
              className="text-gray-100 hover:text-primary-100"
              onClick={evt => evt.stopPropagation()}
            />
          </Popconfirm>
        )
      }
    >
      <Tooltip
        content={item.label}
        truncate
      >
        <span className="truncate">{item.label}</span>
      </Tooltip>
    </BaseOption>
  );
};

export const Aside = () => {
  const { templates, updateAddMdlState } = useTemplateModal();

  const isEqualMax = templates.length === MAX_TEMPLATE_COUNT;

  return (
    <SettingLayout.Aside
      label="模板列表"
      className="gap-2"
      suffix={
        <Button.Icon
          type="primary"
          plain
          icon={<IconAdd />}
          disabled={isEqualMax}
          tooltip={isEqualMax ? { content: '模板数量已达上限', visible: true } : undefined}
          onClick={() => updateAddMdlState({ open: true, keyword: '', error: false })}
        />
      }
    >
      {templates.map(item => {
        return (
          <Option
            key={item.id}
            item={item}
          />
        );
      })}
    </SettingLayout.Aside>
  );
};
