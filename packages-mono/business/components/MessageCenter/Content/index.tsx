import { List } from '../List';
import { Footer } from './Footer';

export const Content = () => {
  return (
    <div
      className="flex flex-col pt-3 bg-gray-700 rounded-lg"
      style={{ width: 480, height: 560 }}
    >
      <List />

      <div className="component-dashed-x h-px mx-3" />

      <Footer />
    </div>
  );
};
