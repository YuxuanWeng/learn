/**
 * 该 Search 组件为 V3 版本，相较于 V2 版本，整体组件架构没有大的变动，仅针对部分编码细节进行优化：
 * 1. 使用 @floating-ui/react 最新版本代替较早版本 @floating-ui 系列库
 * 2. 使用 usePropValue 代替 useEffect 同步组件内外状态
 * 3. 使用 Input 组件作为内部底层输入组件
 * 4. TODO 接入 undoStack
 */
export * from './Search';
export * from './types';
