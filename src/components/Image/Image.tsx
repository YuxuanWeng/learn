import RcImage from 'rc-image';
import type { ImageProps } from 'rc-image';
import './style.less';

export interface CompositionImage<P> extends React.FC<P> {
  PreviewGroup: typeof RcImage.PreviewGroup;
}

const Wrapper: CompositionImage<ImageProps> = props => {
  return <RcImage {...props} />;
};

Wrapper.PreviewGroup = RcImage.PreviewGroup;

export const Image = Wrapper;

export { type ImageProps } from 'rc-image';
