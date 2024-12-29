import { NoConfirmationTag } from '@/components/ApprovalDetail/Renderer/NoConfirmationTag';
import { PayforTag } from '@/components/ApprovalDetail/Renderer/PayforTag';
import { SmallestText } from './SmallestText';
import { ApprovalDetailRendererProps } from './types';

export const InstText = ({ nc, pf, children }: ApprovalDetailRendererProps.InstText) => {
  return (
    <>
      <SmallestText className="flex-1 w-0">{children}</SmallestText>
      {/* 此处必须使用svg/img，不可换为Icon组件，windows打印时会出现不兼容问题 */}
      {nc && <NoConfirmationTag />}
      {pf && <PayforTag />}
    </>
  );
};
