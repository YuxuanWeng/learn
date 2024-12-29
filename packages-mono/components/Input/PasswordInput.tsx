import { useState } from 'react';
import cx from 'classnames';
import { IconPreviewCloseFilled, IconPreviewFilled } from '@fepkg/icon-park-react';
import { Input } from './Input';
import { loginInputCls } from './constants';
import { InputProps } from './types';

export const PasswordInput = (props: InputProps) => {
  const [type, setType] = useState('password');

  return (
    <Input
      {...props}
      className={cx(loginInputCls, props.className ?? 'mb-4 h-7')}
      padding={[8, 12]}
      type={type}
      suffixIcon={type === 'password' ? <IconPreviewCloseFilled /> : <IconPreviewFilled />}
      clearIcon={null}
      onSuffixClick={() => setType(type === 'password' ? 'text' : 'password')}
    />
  );
};
