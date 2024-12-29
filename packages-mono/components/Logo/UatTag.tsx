import cx from 'classnames';

export const UatTag = ({ className }: { className?: string }) => {
  return (
    <div
      className={cx(
        'w-10 h-5 bg-gradient-to-l from-[#4E96FE]/10 to-[#20D4A1]/10 rounded-tl rounded-tr rounded-br justify-center flex',
        className
      )}
    >
      <div className="!text-sm text-primary-100 font-bold leading-5">UAT</div>
    </div>
  );
};
