import cx from 'classnames';
import { UatTag } from './UatTag';
import { Version } from './Version';
import { LogoMetaMap, LogoSizeMap } from './constants';
import { LogoProps } from './types';

export const Logo = ({ className, size = 'md', system = 'oms', uat = false, version, ...restProps }: LogoProps) => {
  const logoMeta = LogoMetaMap[system];
  const logoAlt = `${system.toLocaleUpperCase()} Logo`;
  const logoSize = LogoSizeMap[size];

  return (
    <span
      className={cx('flex items-center', logoSize, className)}
      {...restProps}
    >
      <img
        className={logoSize}
        style={{ width: logoMeta.width }}
        src={logoMeta.src}
        alt={logoAlt}
      />

      {uat && <UatTag className="ml-1" />}

      {version && <Version>{version}</Version>}
    </span>
  );
};
