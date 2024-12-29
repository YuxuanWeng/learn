import { useEffect, useRef, useState } from 'react';
import cx from 'classnames';
import { ModalUtils } from '@fepkg/components/Modal';
import { AccessCode } from '@fepkg/services/access-code';
import { useAuth } from '@/providers/AuthProvider';
import { isEqual } from 'lodash-es';
import { useOverlayScrollbars } from 'overlayscrollbars-react';
import { Header } from '../Header';
import { RuleListItem } from './RuleListItem';
import { list, switchColWidth, titleColWidth } from './constants';
import { useSubmit } from './hooks/useSubmit';
import { RuleProvider, useRule } from './providers/RuleProvider';

const RuleSettingInner = () => {
  const { access } = useAuth();
  const { isEdit, setIsEdit, ruleSettingList, updateList, onEdit, refetch, isLoading } = useRule();
  const [loading, setLoading] = useState(false);
  const { handleSubmit } = useSubmit();

  const editable = access?.has(AccessCode?.CodeDTMSettingRuleEdit) && !isLoading;

  const scrollRef = useRef<HTMLDivElement>(null);
  const [initialize] = useOverlayScrollbars({
    options: { scrollbars: { autoHide: 'leave', autoHideDelay: 0 } }
  });
  useEffect(() => {
    if (scrollRef.current) {
      initialize(scrollRef.current);
    }
  }, [initialize]);

  const handleCancelEdit = () => {
    if (isEqual(ruleSettingList, updateList)) {
      setIsEdit(false);
    } else {
      ModalUtils.warning({
        title: '退出编辑',
        content: '您本次更改的内容将不会保存，确定退出编辑吗？',
        okText: '确定',
        onOk: () => {
          setIsEdit(false);
        }
      });
    }
  };

  const handleEdit = () => {
    ModalUtils.warning({
      title: '编辑',
      content: '该操作将影响成交单审核状态重置，请谨慎操作！',
      okText: '我知道了',
      onOk: onEdit
    });
  };

  return (
    <div className="flex flex-col flex-1 m-4 mt-0 overflow-hidden">
      <Header
        title="规则列表"
        captionType="secondary"
        isEdit={isEdit}
        editable={editable}
        onCancel={handleCancelEdit}
        onEdit={handleEdit}
        onSave={async () => {
          setLoading(true);
          handleSubmit().finally(() => {
            setLoading(false);
            refetch();
          });
        }}
        saveLoading={loading}
      />
      <div className="h-12 rounded-t-lg border-0 border-b border-dashed border-gray-600">
        <div className="h-full flex rounded-t-lg items-center bg-gray-800 text-gray-200">
          <div className={cx('pl-4', titleColWidth)}>触发规则</div>
          <div className={cx('flex justify-center', switchColWidth)}>开关</div>
          <div className="flex ml-4 flex-1">高级审核角色</div>
          <div className="flex ml-4 flex-1">普通审核角色</div>
        </div>
      </div>
      <div
        className="flex-1"
        ref={scrollRef}
      >
        <div className="flex flex-col flex-1">
          {list.map((i, index) => (
            <RuleListItem
              {...i}
              key={i.ruleType}
              isLastItem={index === list.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const RuleSetting = () => {
  return (
    <RuleProvider>
      <RuleSettingInner />
    </RuleProvider>
  );
};

export default RuleSetting;
