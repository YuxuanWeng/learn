import TextWithTooltip from '.';

export default {
  title: '业务组件/超出宽度才提示的文本',
  component: TextWithTooltip,
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

export const Text1 = () => {
  return (
    <TextWithTooltip
      text="你好世界"
      maxWidth={200}
    />
  );
};
Text1.storyName = '未超出宽度';

export const Text2 = () => {
  return (
    <TextWithTooltip
      text="hello world"
      maxWidth={55}
    />
  );
};
Text2.storyName = '超出宽度';

export const Text3 = () => {
  return (
    <TextWithTooltip
      className=""
      text="hello world"
      maxWidth={200}
      alwaysTooltip
    />
  );
};
Text3.storyName = '总是显示Tooltip';
