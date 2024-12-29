import { ReactElement } from 'react';

export type BadgeColor = 'red' | 'green';

export type BadgeStatusProps = {
  count?: number;
  dot?: boolean;
  offset?: [string, string];
  color?: BadgeColor;
  blink?: boolean;
  children?: ReactElement;
};
