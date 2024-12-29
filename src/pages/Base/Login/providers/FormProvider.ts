import { SearchOption } from '@fepkg/components/Search';
import { createContainer } from 'unstated-next';
import { useImmer } from 'use-immer';
import { decryptPassword } from '@packages/utils/crypto';
import { getCurrentSavedLoginFormList, miscStorage } from '@/localdb/miscStorage';
import { UserLoginForm } from '@/pages/Base/Login/types';

type LoginFormState = {
  /** 用户id */
  userId: string;
  /** 账号 */
  username: string;
  /** 密码 */
  password: string;
  /** 是否展示密码 */
  showPassword: boolean;
  /** 登录表单信息是否由已保存的信息中恢复，
   * 需求：若密码为保存后的密码，则不允许 backspace 外的操作，backspace 则会直接删除，同时没有「显示密码」按钮
   */
  recovered: boolean;
  /** 是否记住密码 */
  remember: boolean;
  /** 是否正在登录 */
  loading: boolean;
  /** 登录中提示文案 */
  hintMessage: string;
  /** 错误信息 */
  errorMessage: string;
  /** 是否可编辑密码 */
  passwordEditable: boolean;
};

const LoginFormContainer = createContainer(() => {
  const [formState, updateFormState] = useImmer<LoginFormState>(() => {
    const form = getCurrentSavedLoginFormList()?.at(0);
    const userId = miscStorage.userInfo?.user_id || form?.userId || '';
    const username = miscStorage.userInfo?.account || form?.username || '';
    const tmpPassword = form?.userId && form?.password ? decryptPassword(form.password, form.userId) : '';

    const password = tmpPassword;
    const passwordViewable = !tmpPassword;
    const recovered = !!password;
    const remember = form?.shouldRememberPassword ?? false;
    return {
      userId,
      username,
      password,
      showPassword: false,
      recovered,
      remember,
      loading: false,
      hintMessage: '',
      errorMessage: '',
      passwordEditable: passwordViewable
    };
  });

  const clearSelectAccount = () => {
    updateFormState(draft => {
      draft.userId = '';
      // clear 不需要在这重置 username，onInputChange 会设置 username
      // draft.username = '';
      draft.password = '';
      draft.recovered = false;
      draft.remember = false;
      draft.errorMessage = '';
      draft.showPassword = false;
      draft.passwordEditable = true;
    });
  };

  const handleSelectedAccountChange = (opt: SearchOption<UserLoginForm> | null) => {
    if (opt) {
      const tmpPassword =
        opt.original?.userId && opt.original?.password
          ? decryptPassword(opt.original.password, opt.original.userId)
          : '';
      updateFormState(draft => {
        draft.userId = opt.original.userId ?? '';
        draft.username = opt.original.username ?? '';
        draft.password = tmpPassword;
        draft.recovered = false;
        draft.remember = opt.original?.shouldRememberPassword;
        draft.errorMessage = '';
        draft.showPassword = false;
        draft.passwordEditable = !tmpPassword;
      });
    } else {
      clearSelectAccount();
    }
  };

  return {
    formState,
    updateFormState,
    clearSelectAccount,
    handleSelectedAccountChange,
    loginDisabled: !formState.password || !formState.username || formState.loading
  };
});

export const LoginFormProvider = LoginFormContainer.Provider;
export const useLoginForm = LoginFormContainer.useContainer;
