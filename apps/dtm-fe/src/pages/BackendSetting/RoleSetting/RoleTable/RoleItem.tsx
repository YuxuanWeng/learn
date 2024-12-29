import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import cx from 'classnames';
import { Button } from '@fepkg/components/Button';
import { Input } from '@fepkg/components/Input';
import { message } from '@fepkg/components/Message';
import { ModalUtils } from '@fepkg/components/Modal';
import { Tooltip } from '@fepkg/components/Tooltip';
import { IconDelete, IconDrag } from '@fepkg/icon-park-react';
import { ReceiptDealApprovalRole, ReceiptDealRoleMember } from '@fepkg/services/types/bds-common';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMemoizedFn } from 'ahooks';
import { mulDeleteRole } from '@/common/services/api/approval/role';
import { isFETempId } from '../../utils';
import { useSubmit } from '../hooks/useSubmit';
import { useRole } from '../providers/RoleProvider';
import { getAllRoleIdFromRule } from '../utils.ts';
import { AvatarList } from './AvatarList';
import { RoleMemberSelect } from './RoleMemberSelect';
import { ROLE_ITEM_PLACEHOLDER_ID, always } from './constants';

export type IRoleItemRef = {
  /** 聚焦 */
  focusRole?: VoidFunction;
};

type IRoleItem = ReceiptDealApprovalRole & {
  /** 当前正在hover的option的value */
  currentHoverOption: string | null;
  /** 删除键是否禁用 */
  deleteDisabled?: boolean;
  /** 该条是否被拖拽中 */
  isDragOverlay?: boolean;
  /** 被拖拽的id */
  activeId?: string | null;
};

export const RoleItem = forwardRef<IRoleItemRef, IRoleItem>(
  (
    {
      approval_role_id,
      approval_role_name,
      approval_role_level,
      role_member_list,
      deleteDisabled,
      currentHoverOption,
      isDragOverlay,
      activeId
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const focusRole = () => {
      inputRef.current?.focus();
    };
    useImperativeHandle(ref, () => ({
      focusRole
    }));

    const { isEdit, error, setError, disableOptions, setUpdateList, refetchRole, deleteRoleItem, ruleSettingList } =
      useRole();

    const [deleteLoading, setDeleteLoading] = useState(false);
    const deleteDisabledStatus = deleteDisabled || getAllRoleIdFromRule(ruleSettingList).includes(approval_role_id);

    const showLine = currentHoverOption === approval_role_id;
    const errorState = error[approval_role_id ?? ''] ?? {};

    const { changeWithCheckData } = useSubmit();
    const { attributes, listeners, isDragging, isSorting, setNodeRef, transform, transition } = useSortable({
      id: approval_role_id || '',
      animateLayoutChanges: always,
      data: { id: approval_role_id || '' }
    });

    const onRoleNameChange = val => {
      setUpdateList(draft => {
        const item = draft.find(i => i.approval_role_id === approval_role_id);
        if (item) {
          item.approval_role_name = val;
        }
      });
    };

    const onRoleListChange = useMemoizedFn((val?: ReceiptDealRoleMember[]) => {
      setUpdateList(draft => {
        const item = draft.find(i => i.approval_role_id === approval_role_id);
        if (item) {
          item.role_member_list = val;
        }
      });
      setError(draft => {
        draft[approval_role_id] = {
          ...draft[approval_role_id],
          roleListError: false
        };
      });
    });

    const onDelete = async () => {
      setDeleteLoading(true);
      if (isFETempId(approval_role_id)) {
        setUpdateList(draft => {
          return draft
            .filter(i => i.approval_role_id !== approval_role_id)
            .map((item, index) => ({ ...item, approval_role_level: index + 1 }));
        });
        setDeleteLoading(false);
        return;
      }
      await changeWithCheckData(
        allRule => {
          return new Promise((resolve, reject) => {
            if (!allRule) {
              message.error('规则查询失败！');
              setDeleteLoading(false);
              reject(new Error('search rule error!'));
              return;
            }
            const allActiveRoleIdList = getAllRoleIdFromRule(allRule);

            if (allActiveRoleIdList.includes(approval_role_id)) {
              message.error('已配置在规则中，删除失败！');
              setDeleteLoading(false);
              reject(new Error(' already in rule!'));
              return;
            }

            ModalUtils.error({
              title: '删除',
              content: '审核角色删除后不可恢复，是否确认删除？',
              okText: '删除',
              onOk: () => {
                return mulDeleteRole({
                  role_id_list: [approval_role_id]
                })
                  .then(() => {
                    message.success('删除成功！');
                    setUpdateList(draft => {
                      return draft
                        .filter(i => i.approval_role_id !== approval_role_id)
                        .map((item, index) => ({ ...item, approval_role_level: index + 1 }));
                    });
                    deleteRoleItem(approval_role_id);
                    refetchRole();
                    resolve('success');
                  })
                  .catch(() => {
                    message.error('删除失败！');
                    reject(new Error('delete error!'));
                  })
                  .finally(() => {
                    setDeleteLoading(false);
                  });
              },
              onCancel: () => {
                setDeleteLoading(false);
              }
            });
          });
        },
        async () => {
          setDeleteLoading(false);
          return false;
        }
      );
    };

    if (approval_role_id === ROLE_ITEM_PLACEHOLDER_ID) {
      return activeId ? (
        <div
          ref={setNodeRef}
          className={cx('border border-solid border-transparent h-10', showLine && 'border-t-primary-200')}
        />
      ) : null;
    }

    return (
      <div
        className={cx(
          'flex text-gray-200 h-12 items-center border-b border-solid border-gray-700',
          isEdit && 'select-none',
          showLine ? '!border-t-primary-200' : 'border-0',
          isDragging && 'bg-gray-500 opacity-40',
          isDragOverlay && '!bg-gray-800/80 backdrop-blur-xs rounded-lg !cursor-move'
        )}
        ref={setNodeRef}
        style={{
          transition,
          transform: isSorting ? undefined : CSS.Translate.toString(transform)
        }}
      >
        {isEdit && (
          <div
            className="flex-center w-12 h-12 cursor-pointer shrink-0"
            {...listeners}
            {...attributes}
          >
            <IconDrag />
          </div>
        )}

        {/* 第一列 */}
        <div className={cx('flex w-80 justify-center text-orange-50 font-bold shrink-0', !isEdit && 'ml-12')}>
          {approval_role_level}
        </div>

        {/* 第二列 */}
        <div className="flex pl-4 flex-1">
          {isEdit ? (
            <div className="w-full min-w-[240px] max-w-[320px]">
              <Input
                ref={inputRef}
                error={errorState.roleNameError}
                // 角色名称不超过10个字
                maxLength={10}
                className="text-gray-000"
                value={approval_role_name ?? null}
                onChange={onRoleNameChange}
              />
            </div>
          ) : (
            <div className="text-orange-50 font-bold">{approval_role_name}</div>
          )}
        </div>

        {/* 第三列 */}
        <div className="flex pl-4 flex-1 relative h-8">
          <div className={cx('w-80 absolute', !isEdit && 'opacity-0 pointer-events-none')}>
            <RoleMemberSelect
              error={errorState.roleListError}
              value={role_member_list ?? []}
              disableOptions={disableOptions}
              onChange={onRoleListChange}
              options={isDragOverlay ? [] : undefined} // 拖拽时不需要options，非拖拽时使用内部默认options
            />
          </div>
          <AvatarList
            className={cx('absolute', isEdit && 'opacity-0 pointer-events-none')}
            list={role_member_list}
          />
        </div>

        {/* 第四列 */}
        <div className="flex pl-4 w-40 justify-center shrink-0">
          {isEdit && (
            <Tooltip
              content={deleteDisabledStatus ? '该审核角色已应用至审核流程中，不可删除' : undefined}
              visible
            >
              <Button
                type="danger"
                text
                icon={<IconDelete />}
                loading={deleteLoading}
                disabled={deleteDisabledStatus}
                onClick={onDelete}
              >
                删除
              </Button>
            </Tooltip>
          )}
        </div>
      </div>
    );
  }
);
