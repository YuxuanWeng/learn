import { Button } from '@fepkg/components/Button';
import { toSSOLogin } from '@fepkg/services/api/auth/to-sso-login';
import { useToken } from '@/hooks/useToken';
import { useAuth } from '@/providers/AuthProvider';
import loginBgPng from '~/images/login-bg.png';
import loginIllustrationPng from '~/images/login-illustration.svg';
import loginNameSvg from '~/images/login-name.svg';
import loginWelcomeSvg from '~/images/login-welcome.svg';

const Login = () => {
  const { token } = useToken();
  const { productTypeList } = useAuth();

  const disable = Boolean(token && productTypeList?.length);

  return (
    <div
      className="flex-center flex-col w-full h-full overflow-hidden"
      style={{
        backgroundImage: `url(${loginBgPng})`
      }}
    >
      <div
        className="w-[263px] h-6"
        style={{
          backgroundImage: `url(${loginWelcomeSvg})`,
          backgroundSize: '100% 100%'
        }}
      />
      <div
        className="w-[450px] h-[184px] mt-10"
        style={{
          backgroundImage: `url(${loginIllustrationPng})`,
          backgroundSize: '100% 100%'
        }}
      />
      <div
        className="w-[632px] h-12 mt-40 mb-10"
        style={{
          backgroundImage: `url(${loginNameSvg})`,
          backgroundSize: '100% 100%'
        }}
      />
      <Button
        className="w-80 h-11"
        loading={disable}
        disabled={disable}
        onClick={toSSOLogin}
      >
        {disable ? '登录中...' : '登录'}
      </Button>
    </div>
  );
};

export default Login;
