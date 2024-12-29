import { noop } from 'lodash-es';

export const ShLogPerformanceType = {};

export const ShLogLevel = {};

export class Logger {
  constructor() {}

  i = noop;

  w = noop;

  e = noop;

  d = noop;
}
