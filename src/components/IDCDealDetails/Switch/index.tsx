import { Switch as OldSwitch, SwitchProps } from 'antd';
import styles from './style.module.less';

export default function Switch({ ...rest }: SwitchProps) {
  return (
    <div className={styles.whiteSwitch}>
      <OldSwitch {...rest} />
    </div>
  );
}
