import { range } from 'lodash-es';
import Layout from '.';

export default {
  title: 'IDC业务组件/点价提示浮窗/布局',
  component: Layout,
  parameters: {
    docs: {
      description: {
        component: `
        `
      }
    }
  },
  decorators: []
};

function TestBox({ index }: { index: number }) {
  const height = 100 + Math.random() * 100;
  return (
    <div
      style={{
        height,
        border: '1px solid #fff',
        backgroundColor: ['red', 'blue', 'pink', 'gray', 'orange'][Math.ceil(Math.random() * 5)]
      }}
    >
      {`${index}:: ${height}`}
    </div>
  );
}

export const Layout1 = () => {
  return (
    <Layout
      colWidth={200}
      items={range(7).map((n, idx) => (
        <TestBox
          key={String(`${n}-${idx}`)}
          index={idx}
        />
      ))}
    />
  );
};
