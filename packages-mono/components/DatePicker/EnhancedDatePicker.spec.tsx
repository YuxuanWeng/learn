import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EnhancedDatePicker } from './EnhancedDatePicker';

describe('test EnhancedDatePicker', () => {
  it('should add year className', async () => {
    vi.setSystemTime(new Date(2000, 1, 1));

    const { container } = render(<EnhancedDatePicker picker="year" />);
    const $ipt = container.querySelector('.ant-picker-input > input');
    userEvent.click($ipt!);
    await waitFor(() => {
      const $dropdown = global.document.querySelector('.ant-picker-dropdown');
      expect($dropdown).toHaveClass('year-2000');
      vi.useRealTimers();
    });
  });
  it('should render month cell', async () => {
    vi.setSystemTime(new Date(2000, 8, 1));

    const { container } = render(<EnhancedDatePicker picker="month" />);
    const $ipt = container.querySelector('.ant-picker-input > input');
    userEvent.click($ipt!);
    await waitFor(() => {
      const $cell = screen.getByText('9月');
      expect($cell).toHaveClass('current-month');
      vi.useRealTimers();
    });
  });
});
