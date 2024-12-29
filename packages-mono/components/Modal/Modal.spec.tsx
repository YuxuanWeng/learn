import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Modal } from './Modal';

const _queryInputs = (ctn: Element | null, extraSelector: string = '') => ctn?.querySelectorAll(`${extraSelector}`);

describe('test DraggableModal', () => {
  const testModalConWrap = 'test-modal-con-wrap';

  it.only('should render draggable modal', async () => {
    render(
      <Modal
        className="abc"
        visible={true}
        title="设置"
        forceRender={true}
        onCancel={() => {}}
        onConfirm={() => {}}
      >
        <p>内容</p>
        <p className={testModalConWrap}>是否有内容</p>
        <p>内容</p>
      </Modal>
    );
    const oModal = global.document.querySelector('.ant-modal');
    await waitFor(() => {
      const elems = _queryInputs(oModal, `.${testModalConWrap}`);
      expect(oModal).toHaveClass('abc');
      expect(elems).toHaveLength(1);
      screen.queryByText('是否有内容');
      vi.useRealTimers();
    });
  });

  it('should render default values', async () => {
    const { container: ctn } = render(
      <Modal
        visible={true}
        title="自定义title"
        forceRender={true}
        onConfirm={() => {}}
        onCancel={() => {}}
      >
        <p className={testModalConWrap}>内容</p>
        <p className={testModalConWrap}>内容</p>
        <p className={testModalConWrap}>内容</p>
      </Modal>
    );
    // const allIpt = screen.getByLabelText('全部');
    // expect(allIpt).toBeInTheDocument();
    // expect((allIpt.parentNode as HTMLSpanElement).className).not.toContain('checked');
    const oModal = global.document.querySelector('.ant-modal');
    await waitFor(() => {
      const elems = _queryInputs(oModal, `.${testModalConWrap}`);
      expect(elems).toHaveLength(3);
      const customTitle = screen.getByText('自定义title');
      expect(customTitle).toBeInTheDocument();
      vi.useRealTimers();
    });
  });
});
