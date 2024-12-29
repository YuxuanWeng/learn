import { useOutletContext } from 'react-router-dom';
import { DialogLayoutContext } from '../types';

/**
 * 子路由的上下文对象，通过传递，实现：
 * 在母子路由数据共享、子路由中修改上级路由的数据
 */
export const useDialogLayout = () => useOutletContext<DialogLayoutContext>();
