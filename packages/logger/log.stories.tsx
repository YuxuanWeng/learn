// eslint-disable-next-line import/no-unresolved
import readme from './README.md?raw';

export const Log = () => {};

export default {
  title: '文档/日志工具使用和 OMS 告警相关使用说明',
  component: Log,
  parameters: {
    docs: {
      description: {
        component: readme
      }
    },
    previewTabs: {
      canvas: {
        hidden: true
      }
    }
  }
};
