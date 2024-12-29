import { useRef } from 'react';
import cx from 'classnames';
import { Button } from '@fepkg/components/Button';
import { Input } from '@fepkg/components/Input';
import { IconAdd, IconMinus } from '@fepkg/icon-park-react';
import { useSpotAppoint } from '../provider';
import useSubmit from '@/pages/Spot/SpotAppointModal/useSubmit';

const InputRegExp = /^\d{0,3}$/;

export const Volume = () => {
  const { volume, disabled, MAX_VOLUME, setVolume } = useSpotAppoint();
  const { handleSubmit } = useSubmit();

  const initSuccessRef = useRef(false);

  const handleMinus = () => {
    if (disabled) return;
    if (Number(volume) <= 1) return;
    const newVol = (Number(volume) - 1).toString();
    setVolume(newVol);
  };

  const handleAdd = () => {
    if (disabled) return;
    if (Number(volume) >= MAX_VOLUME) return;
    const newVol = (Number(volume) + 1).toString();
    setVolume(newVol);
  };

  return (
    <div className="flex items-center justify-center border-0 border-l-[1px] border-solid border-gray-600 bg-gray-800 w-full rounded-lg">
      <div className="flex gap-3">
        <div className="flex items-center h-8 bg-gray-700 rounded-lg gap-[2px]">
          <Input
            ref={node => {
              if (initSuccessRef.current) return;
              requestIdleCallback(() => {
                initSuccessRef.current = true;
                node?.focus();
                node?.select();
              });
            }}
            error={!volume && !disabled}
            disabled={disabled}
            className="w-[130px] rounded-r-none h-[30px]"
            value={volume ?? ''}
            clearIcon={null}
            onChange={val => {
              if (!InputRegExp.test(val)) return;
              if (val && Number(val) > MAX_VOLUME) return;
              setVolume(val);
            }}
            onEnterPress={(val, evt) => {
              evt.stopPropagation();
              handleSubmit();
            }}
          />

          <div
            className={cx(
              'h-[30px] w-[46px] flex flex-center rounded-r-lg',
              disabled ? 'bg-gray-700 text-gray-300' : 'bg-gray-600 text-gray-100'
            )}
          >
            kw
          </div>
        </div>

        <Button.Icon
          disabled={Number(volume) <= 1 || disabled}
          className="!w-8 !h-8"
          icon={<IconMinus />}
          onClick={handleMinus}
        />

        <Button.Icon
          disabled={Number(volume) >= MAX_VOLUME || disabled}
          className="!w-8 !h-8"
          icon={<IconAdd />}
          onClick={handleAdd}
        />
      </div>
    </div>
  );
};
