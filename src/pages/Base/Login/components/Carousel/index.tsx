import { Carousel as AntCarousel } from 'antd';
import { carousels } from '../../constants';

export const Carousel = () => {
  return (
    <div
      className="-ml-3 relative"
      style={{ width: 242, paddingTop: 88 }}
    >
      <AntCarousel
        className="pb-[23px]"
        dots={{ className: 'dots-panel' }}
        autoplay
      >
        {carousels.map(item => (
          <div
            key={item.title}
            className="flex justify-center select-none"
          >
            <img
              className="mx-auto my-0 w-[136px] h-[102px]"
              src={item.src}
              alt={item.title}
            />
            <h3 className="flex justify-center mt-4 mb-2 text-sm text-gray-000">{item.title}</h3>
            <p className="flex justify-center font-normal text-xs text-gray-300">
              {item.content[0]}；
              <br />
              {item.content[1]}。
            </p>
          </div>
        ))}
      </AntCarousel>
    </div>
  );
};
