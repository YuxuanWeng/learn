import { useEffect } from 'react';
import { LogoMetaMap } from './constants';
import { LogoProps } from './types';

export const useLogoLog = (version?: string, hash?: string, system: LogoProps['system'] = 'oms') => {
  const meta = LogoMetaMap[system];

  useEffect(() => {
    console.info(
      `%c %cv${version}%c %c${hash}`,
      `padding-left: 40px; background-image: url('${meta.src}'); background-size: 36px; background-repeat: no-repeat; background-position: 0 2px`,
      'background: #1FD59E; border-radius:0.5em; padding:0.2em 0.5em 0.2em 0.5em; color: #FDFDFD;',
      '',
      'background: #4E95FF; border-radius:0.5em; padding:0.2em 0.5em 0.2em 0.5em; color: #FDFDFD;'
    );
  }, [hash, meta.src, version]);
};
