import { describe, expect, it } from 'vitest';
import { formatPriceContent } from './price';

describe('@fepkg/business/utils/price', () => {
  it('formatPriceContent', () => {
    expect(formatPriceContent(123)).toBe('123.0000');
    expect(formatPriceContent(123, 2)).toBe('123.00');
    expect(formatPriceContent(-456, 3, { negative: true })).toBe('-456.000');
    expect(formatPriceContent(-456)).toBe('--');
    expect(formatPriceContent(12.5, 2)).toBe('12.50');
    expect(formatPriceContent(-34.67, 3, { negative: true })).toBe('-34.670');
    expect(formatPriceContent(89.123)).toBe('89.1230');
    expect(formatPriceContent(-56.7894, 2, { negative: true })).toBe('-56.78');
    expect(formatPriceContent(123.45678, 2)).toBe('123.45');
    expect(formatPriceContent(-789.012345, undefined, { negative: true })).toBe('-789.0123');

    expect(formatPriceContent(undefined, 2, { placeholder: '-' })).toBe('-');
    expect(formatPriceContent(NaN, 2, { placeholder: '-' })).toBe('-');

    expect(formatPriceContent(0, 2, { zero: true })).toBe('0.00');
    expect(formatPriceContent(0, 3, { zero: true })).toBe('0.000');
    expect(formatPriceContent(0, 4, { zero: true })).toBe('0.0000');
    expect(formatPriceContent(0, 4)).toBe('--');

    expect(formatPriceContent(3.0000_1234)).toBe('3.0000');
    expect(formatPriceContent(3.0000_5678)).toBe('3.0000');

    expect(formatPriceContent(2.9999_1234)).toBe('2.9999');
    expect(formatPriceContent(2.9999_5678)).toBe('2.9999');

    expect(formatPriceContent(-3.0000_5678, 4, { negative: true })).toBe('-3.0000');
    expect(formatPriceContent(-3.0000_5678, 4, { negative: true })).toBe('-3.0000');

    expect(formatPriceContent(-2.9999_1234, 4, { negative: true })).toBe('-2.9999');
    expect(formatPriceContent(-2.9999_5678, 4, { negative: true })).toBe('-2.9999');
  });
});
