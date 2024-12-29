import React, { MouseEventHandler, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import cx from 'classnames';
import { Tag } from 'antd';
import { BrokerageCommentMap } from '@fepkg/business/constants/map';
import { HighlightOption } from '@fepkg/components/BaseOptionsRender/HighlightOption';
import { Button } from '@fepkg/components/Button';
import { ContextMenu, MenuItem } from '@fepkg/components/ContextMenu';
import { Popconfirm } from '@fepkg/components/Popconfirm';
import { Search, SearchOption } from '@fepkg/components/Search';
import { Tooltip } from '@fepkg/components/Tooltip';
import { IconDown } from '@fepkg/icon-park-react';
import { APIs } from '@fepkg/services/apis';
import { Counterparty } from '@fepkg/services/types/common';
import { Post, ReceiptDealTradeInstBrokerageComment } from '@fepkg/services/types/enum';
import type { UserList } from '@fepkg/services/types/user/list';
import { useDoubleClick } from '@/common/hooks/useDoubleClick';
import { useFuzzySearchQuery } from '@/common/services/hooks/useFuzzySearchQuery';
import { useProductParams } from '@/layouts/Home/hooks';
import { getBrokersName } from '@/pages/Spot/Panel/DealRecord/utils';
import { brokerageCommentOpts } from './constants';
import { useComposition } from './utils/useComposition';

type Broker = Pick<
  Counterparty,
  'broker' | 'broker_b' | 'broker_c' | 'broker_d' | 'flag_modify_brokerage' | 'brokerage_comment'
>;

type BrokerProps = {
  /** 是否已经移交 */
  isHandOver?: boolean;
  /** 是否可编辑 */
  editable?: boolean;
  /** 经纪人信息 */
  broker?: Broker;
  /** 修改调佣 */
  onTransferChange?: (transfer: boolean, comment: keyof typeof BrokerageCommentMap, onError: VoidFunction) => void;
  /** 修改经纪人 */
  onBrokerChange?: (val: string, onError: VoidFunction) => void;
  /** icon展示 */
  IconRender?: ReactNode;
  needHighLightBeSpotName?: boolean;
};

type BrokerNameProps = { name: ReactNode; onDoubleClick: MouseEventHandler; needHighBeSpotLightName?: boolean };

/** 经纪人姓名  */
const BrokerName = ({ name, onDoubleClick, needHighBeSpotLightName }: BrokerNameProps) => {
  return (
    <Tag
      onDoubleClick={onDoubleClick}
      className={cx(
        // 加一个最小宽度，避免没有经纪人的时候无法触发双击操作
        // color一定会有值，所以这里不用添加默认透明背景
        'font-semibold text-sm min-w-[24px] h-4 bg-transparent',
        needHighBeSpotLightName && 'text-danger-100'
      )}
    >
      <Tooltip
        truncate
        content={name}
      >
        <div className="truncate">{name}</div>
      </Tooltip>
    </Tag>
  );
};

const transform2Opt = (item?: Broker): SearchOption<Broker> | null => {
  if (!item) return null;
  return { label: `${item.broker?.name_cn}`, value: item.broker?.user_id, original: item };
};

/** 经纪人状态 */
const Inner = (props: BrokerProps) => {
  const {
    editable,
    broker,
    onTransferChange,
    onBrokerChange,
    IconRender,
    needHighLightBeSpotName: needHighBeSpotLightName,
    isHandOver
  } = props;

  const isTransfer = !!broker?.flag_modify_brokerage;
  const transferComment =
    broker?.brokerage_comment || ReceiptDealTradeInstBrokerageComment.RDTradeInstBrokerageCommentNoSignOrObjection;

  const { productType } = useProductParams();
  // 调佣下拉菜单是否可见
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState<SearchOption<Broker> | null>(() => transform2Opt(broker));
  const [keyword, setKeyword] = useState('');

  const reset = () => {
    setSelected(transform2Opt(broker));
  };

  const brokerList = getBrokersName([broker?.broker, broker?.broker_b, broker?.broker_c, broker?.broker_d]);

  // 是否调佣
  const [transfer, setTransfer] = useState(isTransfer ?? false);
  // 调佣理由
  const [brokerageComment, setBrokerageComment] = useState(transferComment);

  // 是否编辑状态
  const [isModify, setIsModify] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [popconfirmOpen, setPopconfirmOpen] = useState(false);
  const nextConfirmReason = useRef<keyof typeof BrokerageCommentMap>();

  useEffect(() => {
    if (!popconfirmOpen) {
      nextConfirmReason.current = undefined;
    }
  }, [popconfirmOpen]);

  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const { data } = useFuzzySearchQuery<UserList.Response, UserList.Request>({
    api: APIs.user.list,
    keyword,
    searchParams: {
      product_type: productType,
      offset: 0,
      count: 20,
      // 经纪人搜索框仅支持岗位为经纪人的数据，非经纪人岗位不支持检索（DI/后台）
      post_list: [Post.Post_Broker, Post.Post_BrokerAssistant, Post.Post_BrokerTrainee]
    }
  });

  const options = useMemo(() => {
    return data?.list?.map<SearchOption<Broker>>(i => {
      return {
        label: i.name_cn,
        value: i.user_id,
        original: { broker: i }
      };
    });
  }, [data?.list]);

  /**
   * 修改调佣状态或调佣信息
   * @param brokerage 调佣标志
   * @param comment 调佣备注
   * @param needConfirm 需要二次确认
   */
  function onTransferModify(brokerage = false, comment = transferComment, needConfirm = true) {
    // 点亮需要判断是否需要二次确认
    if (brokerage && needConfirm) {
      setPopconfirmOpen(true);
      nextConfirmReason.current = comment;
      // 熄灭和切换调佣原因不需要二次确认
    } else {
      setTransfer(brokerage);
      setBrokerageComment(comment);
      onTransferChange?.(brokerage, comment, reset);
    }
  }

  const { hasCompostionRef, elementProps } = useComposition();

  const onChangeToTransfer = () => {
    setTransfer(true);
    onTransferChange?.(
      true,
      nextConfirmReason.current || ReceiptDealTradeInstBrokerageComment.RDTradeInstBrokerageCommentNoSignOrObjection,
      reset
    );
  };

  // 点击调佣按钮
  const onTransfer = () => {
    if (visible) return;
    onTransferModify(!transfer, ReceiptDealTradeInstBrokerageComment.RDTradeInstBrokerageCommentNoSignOrObjection);
  };
  // 双击调佣按钮
  const onChangeReason = (evt: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setVisible(true);

    setMenuPosition({ x: evt.pageX, y: evt.pageY });
    evt.stopPropagation();
    evt.preventDefault();
  };

  // 认为250ms内连续两次click算双击
  const { handleClick } = useDoubleClick({ onClick: onTransfer, onDoubleClick: onChangeReason });

  /** 经纪人搜索框中选择经纪人触发 */
  const handleBrokerChange = (opt?: SearchOption<Broker> | null) => {
    setSelected(opt ?? null);
    // 选中选项后，只要不是清空就请求修改
    if (opt) {
      onBrokerChange?.(opt?.value as string, reset);
      requestIdleCallback(() => inputRef.current?.blur());
    }
  };
  const handleReset = () => {
    if (!selected) {
      setKeyword('');
      setSelected(transform2Opt(broker));
    }
    setIsModify(false);
  };

  useEffect(() => {
    if (!editable) {
      setIsModify(false);
    }
  }, [editable]);

  if (isModify)
    return (
      <Search<Broker>
        {...elementProps}
        strategy="fixed"
        limitWidth
        className="!w-32"
        ref={inputRef}
        options={options}
        optionRender={(original, k) => (
          <HighlightOption
            keyword={k}
            label={original.broker?.name_cn ?? ''}
          />
        )}
        placeholder=""
        suffixIcon={<IconDown />}
        autoFocus
        focusAfterClearing
        inputValue={keyword}
        value={selected}
        onChange={handleBrokerChange}
        onInputChange={setKeyword}
        onBlur={() => handleReset()}
        onEnterPress={() => {
          if (hasCompostionRef.current) return;
          handleReset();
        }}
      />
    );

  // https://github.com/floating-ui/floating-ui/issues/1841
  // floating ui内包含disabled元素时会使floating失效
  const transferButton = (
    <div>
      <Button
        className="w-6 h-6 px-0"
        type={transfer ? 'green' : 'gray'}
        plain
        disabled={!editable}
        onClick={evt => editable && handleClick(evt)}
        // throttle 会导致自定义双击无法触发
        enableThrottle={false}
      >
        佣
      </Button>
    </div>
  );
  // 认为不可编辑时，是在线下成交单中，此时仅展示文本
  return (
    <div className="flex items-center gap-0.5 w-32">
      <ContextMenu
        open={visible}
        position={menuPosition}
        onOpenChange={setVisible}
      >
        {brokerageCommentOpts.map(i => (
          <MenuItem
            key={i.key}
            onClick={() => onTransferModify(true, i.key as number, !transfer)}
          >
            {i.label}
          </MenuItem>
        ))}
      </ContextMenu>
      {transfer ? (
        <Tooltip content={transfer ? BrokerageCommentMap[brokerageComment] : undefined}>{transferButton}</Tooltip>
      ) : (
        <Popconfirm
          type="warning"
          trigger="manual"
          content="确认调佣？"
          placement="bottom"
          floatingProps={{ className: '!w-[240px]' }}
          onConfirm={onChangeToTransfer}
          open={popconfirmOpen}
          onOpenChange={setPopconfirmOpen}
        >
          {transferButton}
        </Popconfirm>
      )}

      <BrokerName
        name={isHandOver ? brokerList : selected?.label}
        onDoubleClick={() =>
          editable &&
          setIsModify(() => {
            requestIdleCallback(() => {
              inputRef.current?.focus();
              inputRef.current?.select();
            });
            return true;
          })
        }
        needHighBeSpotLightName={needHighBeSpotLightName}
      />
      {IconRender}
    </div>
  );
};

export const BrokerStatus = (props: BrokerProps) => {
  const key = JSON.stringify(props.broker);
  return (
    <div className="flex-1 flex items-center overflow-hidden">
      <Inner
        key={key}
        {...props}
      />
    </div>
  );
};
