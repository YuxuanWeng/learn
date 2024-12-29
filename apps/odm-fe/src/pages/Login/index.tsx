import { Button } from '@fepkg/components/Button';
import { toSSOLogin } from '@fepkg/services/api/auth/to-sso-login';
import loginNameSvg from '@/assets/icons/OutBoundDataManagement.svg';
import loginWelcomeSvg from '@/assets/icons/login-welcome.svg';
import loginBgPng from '@/assets/images/login-bg.png';
import loginIllustrationPng from '@/assets/images/login-illustration.png';
import { useToken } from '@/hooks/useToken';

export const Login = () => {
  const { token } = useToken();

  return (
    <div
      className="flex-center flex-col w-full h-full overflow-hidden"
      style={{
        backgroundImage: `url(${loginBgPng})`,
        backgroundRepeat: 'round'
      }}
    >
      <div
        className="w-[274px] h-6"
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
        className="w-[753px] h-12 mt-40 mb-10"
        style={{
          backgroundImage: `url(${loginNameSvg})`,
          backgroundSize: '100% 100%'
        }}
      />
      <Button
        className="w-80 h-11"
        loading={Boolean(token)}
        disabled={Boolean(token)}
        onClick={toSSOLogin}
      >
        {token ? '登录中...' : '登录'}
      </Button>
    </div>
  );
};
