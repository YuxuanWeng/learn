import { ReactNode, useState } from 'react';
import { KeyboardKeys } from '@fepkg/common/utils/keyboard';
import { Button } from '@fepkg/components/Button';
import { Caption } from '@fepkg/components/Caption';
import { Checkbox } from '@fepkg/components/Checkbox';
import { Input } from '@fepkg/components/Input';
import { loginInputCls } from '@fepkg/components/Input/constants';
import { Search } from '@fepkg/components/Search';
import {
  IconClose,
  IconCloseCircleFilled,
  IconDown,
  IconPreviewCloseFilled,
  IconPreviewFilled,
  IconUp
} from '@fepkg/icon-park-react';
import { isProd } from '@/common/utils';
import { deleteSavedLoginFormList, getCurrentSavedLoginFormList } from '@/localdb/miscStorage';
import { PasswordPlaceholder } from '@/pages/Base/Login/constants';
import { useLoginEnv } from '@/pages/Base/Login/providers/EnvProvider';
import { UserLoginForm } from '@/pages/Base/Login/types';
import { useLoginForm } from '../../providers/FormProvider';
import { useLogin } from '../../providers/LoginProvider';
import { Carousel } from '../Carousel';

export const LoginForm = () => {
  const { formState, updateFormState, loginDisabled, clearSelectAccount, handleSelectedAccountChange } = useLoginForm();
  const { setStep } = useLoginEnv();
  const {
    userId,
    username,
    password,
    showPassword,
    recovered,
    remember,
    loading,
    errorMessage,
    passwordEditable,
    hintMessage
  } = formState;
  const { handleLogin } = useLogin();
  const [options, setOptions] = useState(
    getCurrentSavedLoginFormList()?.map(f => ({ label: f.username, value: f.userId, original: f })) ?? []
  );
  const [searchVisible, setSearchVisible] = useState(false);

  let passwordIptSuffixIcon: ReactNode = <IconPreviewFilled />;
  if (recovered || loading) passwordIptSuffixIcon = null;
  else if (!showPassword) passwordIptSuffixIcon = <IconPreviewCloseFilled />;

  return (
    <div className="w-[590px] flex justify-between mx-auto">
      <Carousel />

      <div
        className="w-[280px] h-full pt-[42px] flex-col items-center justify-center relative"
        onKeyDown={evt => {
          if (evt.key === KeyboardKeys.Enter) handleLogin();
        }}
      >
        <p className="mb-6 text-sm font-semibold leading-5 select-none">
          Hello!
          <br />
          Welcome To{' '}
          <span
            className="text-primary-100 hover:cursor-pointer"
            onClick={() => {
              if (loading || isProd()) return;
              setStep('env');
            }}
          >
            OMS
          </span>
        </p>

        <div className="mb-1 text-sm text-gray-100 select-none">账户</div>

        <Search<UserLoginForm>
          className={loginInputCls}
          placeholder="请输入账户"
          optionRender={original => (
            <div className="flex justify-between items-center w-full h-8 group text-gray-100">
              {original.username}
              <IconClose
                className="hidden group-hover:inline hover:text-primary-100"
                onMouseDown={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOptions(
                    deleteSavedLoginFormList(original.userId).map(f => ({
                      label: f.username,
                      value: f.userId,
                      original: f
                    }))
                  );
                  clearSelectAccount();
                }}
              />
            </div>
          )}
          padding={[8, 12]}
          disabled={loading}
          autoClear={false}
          inputValue={username}
          suffixIcon={searchVisible ? <IconUp /> : <IconDown />}
          onOptionsVisibleChange={visible => setSearchVisible(!!visible)}
          clearIcon={!userId && !username ? null : void 0}
          value={options.find(f => f.value === userId) ?? null}
          onInputChange={val => {
            updateFormState(draft => {
              draft.username = val;
              draft.errorMessage = '';
            });
          }}
          onKeyDown={evt => {
            if (evt.key === KeyboardKeys.Enter && searchVisible) {
              evt.stopPropagation();
            }
          }}
          options={userId ? options : options.filter(f => f.label?.includes(username))}
          onChange={handleSelectedAccountChange}
        />

        <div className="mt-3 mb-1 text-sm text-gray-100 select-none">密码</div>

        <Input
          className={loginInputCls}
          placeholder="请输入密码"
          type={showPassword && passwordEditable ? undefined : 'password'}
          padding={[8, 12]}
          disabled={loading}
          suffixIcon={passwordEditable ? passwordIptSuffixIcon : null}
          clearIcon={null}
          value={passwordEditable ? password : PasswordPlaceholder}
          onChange={val => {
            if (passwordEditable) {
              updateFormState(draft => {
                draft.recovered = false;
                draft.password = val;
                draft.errorMessage = '';
              });
            }
          }}
          onKeyDown={evt => {
            if (recovered) {
              if (![KeyboardKeys.ArrowLeft, KeyboardKeys.ArrowRight].includes(evt.key)) {
                evt.preventDefault();
              }

              if (evt.key === KeyboardKeys.Backspace) {
                updateFormState(draft => {
                  draft.password = '';
                  draft.recovered = false;
                  draft.showPassword = false;
                  draft.passwordEditable = true;
                });
              }
            }
            // 不能编辑的密码，检测到输入框变化后，清空输入框
            if (!passwordEditable) {
              updateFormState(draft => {
                draft.password = '';
                draft.recovered = false;
                draft.showPassword = false;
                draft.passwordEditable = true;
              });
            }
          }}
          onSuffixClick={() =>
            updateFormState(draft => {
              draft.showPassword = !draft.showPassword;
            })
          }
        />

        <Checkbox
          checked={remember}
          onChange={val =>
            updateFormState(draft => {
              draft.remember = val;
            })
          }
          className="mt-3"
          disabled={loading}
        >
          记住密码
        </Checkbox>

        <Button
          onClick={handleLogin}
          type="primary"
          className="mt-3 text-sm h-9"
          block
          loading={loading}
          disabled={loginDisabled}
        >
          {loading ? '登录中...' : '登录'}
        </Button>

        <div
          className="items-center justify-center py-2 mt-4 text-center text-gray-200 bg-white rounded-lg bg-opacity-4"
          style={{
            display: errorMessage ? 'flex' : 'none'
          }}
        >
          <IconCloseCircleFilled className="text-xs/0 text-danger-300" />
          <span className="ml-2 leading-4 text-gray-200">{errorMessage}</span>
        </div>
      </div>
      {loading ? (
        <div className="absolute bottom-0 right-0 p-4 text-xs font-normal text-gray-300">
          <Caption>{hintMessage}</Caption>
        </div>
      ) : null}
    </div>
  );
};
