import { PropsWithChildren } from 'react';
import { PopoverOptions } from '@fepkg/components/Popover/types';

export type TooltipProps = PropsWithChildren<
  Omit<PopoverOptions, 'trigger'> & {
    /** 触发行为（默认为 hover） */
    trigger?: 'hover' | 'click';
    /** 显示/关闭延迟，默认为 open: 200 */
    delay?: number | { open?: number; close?: number };
    /** 仅当文本超出才展示tooltip，默认为false */
    truncate?: boolean;
    /** 仅对非自适应情况使用，滚动宽度等于容器宽度亦视为超出 */
    strictTruncate?: boolean;
    /** 是否总是可见的，在 target 处于 disabled 时也仍可见，默认为 false */
    visible?: boolean;
  }
>;
