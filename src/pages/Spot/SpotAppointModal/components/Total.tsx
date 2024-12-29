import { Button } from '@fepkg/components/Button';
import { IconRightArrow } from '@fepkg/icon-park-react';
import { useSpotAppoint } from '../provider';
import SubTitle from './SubTitle';

export const Total = () => {
  const { quoteState, disabled, setVolume } = useSpotAppoint();
  const { quoteVolume } = quoteState;

  const handleClick = () => {
    if (quoteVolume === undefined) return;
    if (quoteVolume % 1000 !== 0) return;
    setVolume((quoteVolume / 1000).toString());
  };

  return (
    <div className="flex flex-col px-4 py-3">
      <SubTitle.Title title="Total" />
      <div className="flex justify-between text-md font-bold text-gray-100 gap-1">
        <span>{quoteVolume}</span>
        <Button.Icon
          icon={<IconRightArrow />}
          disabled={disabled}
          onClick={handleClick}
        />
      </div>
    </div>
  );
};
