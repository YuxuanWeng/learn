import { Button } from '@fepkg/components/Button';
import { Select } from '@fepkg/components/Select';
import { IconLeftArrow } from '@fepkg/icon-park-react';
import { envs } from '../../constants';
import { useLoginEnv } from '../../providers/EnvProvider';

export const EnvSelect = () => {
  const { env, toggleEnv, setStep } = useLoginEnv();

  return (
    <div className="absolute-full flex-center">
      <Select
        className="w-[318px]"
        label="环境选择"
        labelWidth={96}
        clearIcon={null}
        options={envs}
        value={env}
        onChange={toggleEnv}
      />
      <Button
        className="absolute h-6 left-8 bottom-6 font-normal"
        type="gray"
        ghost
        icon={<IconLeftArrow />}
        onClick={() => setStep('login')}
      >
        登录
      </Button>
    </div>
  );
};
