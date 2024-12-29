import cx from 'classnames';
import { ForceOpenDevTools } from '@/components/ForceOpenDevTools';
import { EnvSelect } from './components/EnvSelect';
import { LoginForm } from './components/Form';
import { Header } from './components/Header';
import { useInit } from './hooks/useInit';
import { LoginEnvProvider, useLoginEnv } from './providers/EnvProvider';
import { LoginFormProvider } from './providers/FormProvider';
import { LoginProvider } from './providers/LoginProvider';
import styles from './style.module.less';

const Inner = () => {
  const { step } = useLoginEnv();
  useInit();

  return (
    <div className={cx('relative h-full', styles.login_wrap)}>
      <ForceOpenDevTools className="absolute top-0 right-0 z-20 w-4 h-10" />

      <Header />

      {step === 'login' ? (
        <LoginFormProvider>
          <LoginProvider>
            <LoginForm />
          </LoginProvider>
        </LoginFormProvider>
      ) : (
        <EnvSelect />
      )}
    </div>
  );
};

const Login = () => {
  return (
    <LoginEnvProvider>
      <Inner />
    </LoginEnvProvider>
  );
};

export default Login;
