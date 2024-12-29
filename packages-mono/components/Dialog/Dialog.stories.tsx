import cx from 'classnames';
import { Dialog } from '.';

export default {
  title: '通用组件/Dialog',
  component: Dialog
};

const dialogContainerCls = 'border-[3px] border-solid border-gray-400 rounded-lg overflow-hidden';
const partBorderCls = 'border border-dashed border-auxiliary-300';

const parts = ['Part1', 'Part2', 'Part3'];

const handleConfirm = () => {
  console.log('confirm');
};

const handleCancel = () => {
  console.log('cancel');
};

export const Basic = () => {
  return (
    <div
      className={dialogContainerCls}
      style={{ width: 960 + 3 * 2 }}
    >
      <div className="py-3 px-6 bg-gray-800">
        <Dialog.Header subtitle="弹窗副标题">弹窗主标题</Dialog.Header>
      </div>

      <Dialog.Body className="flex flex-col gap-4">
        {parts.map(label => (
          <div
            key={label}
            className={cx('flex-center h-[148px] text-3xl font-medium bg-gray-500 rounded', partBorderCls)}
          >
            {label}
          </div>
        ))}
      </Dialog.Body>

      <Dialog.Footer
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      >
        内部报价
      </Dialog.Footer>
    </div>
  );
};

Basic.storyName = '基本使用';

export const SM = () => {
  return (
    <div
      className={dialogContainerCls}
      style={{ width: 478 + 3 * 2 }}
    >
      <div className="flex items-center h-12 pl-3 text-md bg-auxiliary-300">点价-GVN</div>

      <Dialog.Body background="bg-auxiliary-700">
        <div className="flex-center h-12 text-xl font-semibold">债券信息</div>
        <div className="flex flex-col gap-3">
          {parts.slice(0, 2).map(label => (
            <div
              key={label}
              className={cx('flex-center h-[140px] text-2xl font-medium bg-auxiliary-600 rounded', partBorderCls)}
            >
              {label}
            </div>
          ))}
        </div>
      </Dialog.Body>

      <Dialog.Footer
        background="bg-auxiliary-700"
        btnMirrored
        confirmBtnProps={{ label: 'GVN' }}
        cancelBtnProps={{}}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      >
        不报市场
      </Dialog.Footer>
    </div>
  );
};

SM.storyName = '点价窗口（点价方）';

export const XS = () => {
  return (
    <div
      className={dialogContainerCls}
      style={{ width: 478 + 3 * 2 }}
    >
      <div className="flex items-center h-8 pl-3 text-md bg-auxiliary-300">我的客户发来意向</div>

      <Dialog.Body
        size="xs"
        background="bg-auxiliary-700"
      >
        <div className="flex items-center h-8 text-lg font-medium">200202.IB</div>

        <div className={cx('flex flex-col h-[280px] text-2xl font-medium bg-auxiliary-600 rounded', partBorderCls)}>
          <div className="flex-1" />
          <Dialog.Footer
            size="xs"
            background="bg-auxiliary-600"
            centered
            btnMirrored
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          />
        </div>
      </Dialog.Body>
    </div>
  );
};

XS.storyName = '点价提示窗口（被点价方）';
