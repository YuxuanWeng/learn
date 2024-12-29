import { copy } from '../utils';
import { SmallestText } from './SmallestText';
import { ApprovalDetailRendererProps } from './types';

export const CityText = ({ mode, diff }: ApprovalDetailRendererProps.CityText) => {
  return (
    <>
      <SmallestText className="flex-1">City</SmallestText>
      {mode && (
        <SmallestText
          className="flex-1 font-medium text-gray-800"
          diff={diff}
          onClick={() => copy(mode)}
        >
          {mode}
        </SmallestText>
      )}
    </>
  );
};
