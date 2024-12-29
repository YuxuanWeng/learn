import { useState } from 'react';
import { Button } from '@fepkg/components/Button';
import { Dialog } from '@fepkg/components/Dialog';
import { PasswordInput } from '@fepkg/components/Input/PasswordInput';
import { message } from '@fepkg/components/Message';
import { ModalUtils } from '@fepkg/components/Modal';
import { IconAttentionFilled, IconClose } from '@fepkg/icon-park-react';
import { checkLogin } from '@fepkg/services/api/auth/check-login-get';
import { updateUserPassword } from '@fepkg/services/api/auth/password-update';
import { LoginEventEnum } from 'app/types/IPCEvents';
import sha1 from 'crypto-js/sha1';
import { getLoginRequestParamsForMainProcess, login } from '@/common/services/api/auth/login';
import { setIsResettingPassword } from '@/common/utils/login';
import { miscStorage, upsertSavedLoginFormList } from '@/localdb/miscStorage';

type EditPasswordParams = {
  editForReset?: boolean;
  onClose?: VoidFunction;
};

const useEditPassword = ({ onClose }: EditPasswordParams) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const onUpdatePassword = async () => {
    if (oldPassword === newPassword) {
      message.error('新密码与原密码一致！请重新输入');
      return;
    }

    if (newPassword !== confirmPassword) {
      message.error('两次密码输入不一致！请重新输入');
      return;
    }

    let typeCount = 0;

    const regExp = [/\d/g, /[a-z]/g, /[A-Z]/g];

    let password = newPassword;
    for (const reg of regExp) {
      if (reg.test(password)) {
        typeCount += 1;
        password = password.replace(reg, '');
      }
    }

    if (password.length !== 0) {
      typeCount += 1;
    }

    if (typeCount < 3 || newPassword.length < 8) {
      message.error('密码不符合要求，请重新设置！');
      return;
    }

    setIsResettingPassword(true);

    try {
      await updateUserPassword({
        password: sha1(oldPassword).toString(),
        new_password: sha1(newPassword).toString()
      });

      const isReset = miscStorage.userInfo?.is_password_reset;

      if (isReset) {
        const loginRes = await login({
          user_name: miscStorage?.userInfo?.account ?? '',
          password: sha1(newPassword).toString()
        });

        miscStorage.token = loginRes?.token;

        const userInfoRes = await checkLogin();

        miscStorage.userInfo = userInfoRes.user;

        const requestParams = getLoginRequestParamsForMainProcess(true);

        window.Main.invoke(LoginEventEnum.AfterLogin, { ...requestParams });
      }

      // 修改密码后清空记录的密码
      upsertSavedLoginFormList({
        userId: miscStorage.userInfo!.user_id,
        username: miscStorage.userInfo?.account,
        password: '',
        shouldRememberPassword: false
      });

      if (!isReset) {
        setIsResettingPassword(false);
        window.Main.invoke(LoginEventEnum.BeforeLogout, '成功修改密码！当前登录状态已失效，请重新登录！');
      }

      onClose?.();
    } finally {
      setIsResettingPassword(false);
    }
  };

  return {
    onUpdatePassword,

    oldPassword,
    setOldPassword,

    newPassword,
    setNewPassword,

    confirmPassword,
    setConfirmPassword
  };
};

const EditPassword = ({ onClose, editForReset }: EditPasswordParams) => {
  const {
    onUpdatePassword,

    oldPassword,
    setOldPassword,

    newPassword,
    setNewPassword,

    confirmPassword,
    setConfirmPassword
  } = useEditPassword({ onClose });

  return (
    <div className="w-[280px] ml-6 mt-6">
      <PasswordInput
        placeholder="请输入原密码"
        value={oldPassword}
        onChange={setOldPassword}
      />
      <PasswordInput
        placeholder="请输入新密码"
        value={newPassword}
        onChange={setNewPassword}
      />
      <PasswordInput
        placeholder="请确认新密码"
        value={confirmPassword}
        onChange={setConfirmPassword}
      />

      <footer className="flex items-center justify-start flex-shrink-0">
        <div className="flex gap-3">
          {!editForReset && (
            <Button
              type="gray"
              className="h-7"
              ghost
              onClick={onClose}
            >
              取消
            </Button>
          )}
          <Button
            type="primary"
            className="h-7"
            onClick={onUpdatePassword}
            disabled={oldPassword === '' || newPassword === '' || confirmPassword === ''}
          >
            保存
          </Button>
        </div>
      </footer>
    </div>
  );
};

const EditPasswordDialog = ({ onClose, editForReset }: EditPasswordParams) => {
  const {
    onUpdatePassword,

    oldPassword,
    setOldPassword,

    newPassword,
    setNewPassword,

    confirmPassword,
    setConfirmPassword
  } = useEditPassword({ onClose });

  return (
    <>
      <div className="flex items-center justify-between px-4 h-12 bg-gray-800">
        <span className="text-md font-bold text-gray-000 select-none">修改密码</span>
        {!editForReset && (
          <Button.Icon
            text
            icon={<IconClose />}
            onClick={onClose}
          />
        )}
      </div>

      <Dialog.Body size="xs">
        <div className="flex justify-center items-center mt-3 text-sm gap-x-2 select-none">
          <IconAttentionFilled />
          <span>您的密码存在安全风险，请修改！</span>
        </div>
        <div className="mx-2 mt-3">
          <PasswordInput
            className="mb-3 h-7"
            placeholder="请输入原密码"
            value={oldPassword}
            onChange={setOldPassword}
          />
          <PasswordInput
            className="mb-3 h-7"
            placeholder="请输入新密码"
            value={newPassword}
            onChange={setNewPassword}
          />
          <PasswordInput
            className="mb-3 h-7"
            placeholder="请确认新密码"
            value={confirmPassword}
            onChange={setConfirmPassword}
          />
        </div>
        <div className="text-gray-300 text-xs font-normal w-[224px] text-center mx-auto mb-1 select-none">
          至少8位包含大写字母、小写字母、数字、特殊字符中的任意三类组合
        </div>
      </Dialog.Body>

      <Dialog.Footer
        centered
        confirmBtnProps={{
          label: '保存',
          disabled: oldPassword === '' || newPassword === '' || confirmPassword === ''
        }}
        cancelBtnProps={{ className: editForReset ? '!hidden' : '' }}
        onConfirm={onUpdatePassword}
        onCancel={onClose}
      />
    </>
  );
};

export const showEditPassword = (editForReset = false) => {
  const modal = ModalUtils.show({
    width: 320,
    keyboard: false,
    className: '[&_.ant-modal-body]:!p-0 [&_.ant-modal-confirm-title]:!h-0',
    content: (
      <EditPasswordDialog
        editForReset={editForReset}
        onClose={() => {
          modal?.destroy();
        }}
      />
    )
  });
};

export default EditPassword;
