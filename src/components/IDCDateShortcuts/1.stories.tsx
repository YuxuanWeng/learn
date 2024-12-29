import { useRef } from 'react';
import { DealType, LiquidationSpeedTag } from '@fepkg/services/types/enum';
import { within } from '@storybook/testing-library';
import { SettlementMethod } from '@/common/types/liq-speed';
import DateShortcuts, { DShortcutsCheckOption, DShortcutsType } from '.';

export default {
  title: 'IDC业务组件/结算方式',
  parameters: {
    docs: {
      description: {
        component: ``
      }
    }
  },
  decorators: []
};

export const Shortcut1 = () => {
  const debugRef = useRef(null);
  const debugRef2 = useRef(null);
  const debugRef3 = useRef(null);

  function print(idx: number, str: string) {
    let ref = debugRef;
    if (idx === 2) ref = debugRef2;
    if (idx === 3) ref = debugRef3;

    if (!ref.current) return;
    (ref.current as HTMLParagraphElement).innerHTML = str;
  }

  return (
    <>
      <p ref={debugRef} />
      <br />
      <p ref={debugRef2} />
      <br />
      <p ref={debugRef3} />
      <DateShortcuts
        value={[
          {
            tag: LiquidationSpeedTag.Today,
            offset: 0
          },
          {
            tag: LiquidationSpeedTag.Today,
            offset: 1
          },
          {
            tag: LiquidationSpeedTag.Tomorrow,
            offset: 0
          }
        ]}
        defaultLiqSpeedList={[
          {
            offset: 1,
            tag: LiquidationSpeedTag.Today
          }
        ]}
        onChange={(methods: SettlementMethod[]) => {
          print(
            1,
            `[onChange]:
                ${JSON.stringify(methods)}`
          );
        }}
        onLabelCheck={(item: (SettlementMethod | DShortcutsType)[], option?: DShortcutsCheckOption) => {
          print(
            2,
            `[onLabelCheck]:
            ${option?.ctrlKey ? 'ctrl多选' : '普通点击'}
                ${JSON.stringify(item)}`
          );
        }}
        onDefaultCheck={(item?: SettlementMethod | DShortcutsType, option?: DShortcutsCheckOption) => {
          print(
            3,
            `[onDefaultCheck]:
            ${option?.ctrlKey ? 'ctrl多选' : '普通点击'}
                ${JSON.stringify(item)}`
          );
        }}
      />
    </>
  );
};
Shortcut1.storyName = '多选';
Shortcut1.play = ({ canvasElement }) => {
  const canvas = within(canvasElement);

  const getBtn = (str: string) => canvas.queryByText(str)?.parentNode as HTMLButtonElement;
  const isCurrent = (str: string) => getBtn(str)?.className?.includes('current');

  // expect(getBtn('不限')).toBeTruthy();
  // expect(getBtn('+0')).toBeTruthy();
  // expect(getBtn('+1')).toBeTruthy();
  // expect(isCurrent('+1')).toBeTruthy();
  // expect(getBtn('明天+0')).toBeTruthy();

  // await userEvent.click(getBtn('明天+0'));
  // expect(isCurrent('明天+0')).toBeTruthy();

  // await userEvent.click(getBtn('+1'), { ctrlKey: true });
  // expect(isCurrent('+1')).toBeTruthy();
  // expect(isCurrent('明天+0')).toBeTruthy();

  // await userEvent.click(getBtn('不限'), { ctrlKey: true });
  // expect(isCurrent('不限')).toBeTruthy();
  // expect(isCurrent('+1')).toBeFalsy();
  // expect(isCurrent('明天+0')).toBeFalsy();

  // await userEvent.click(getBtn('+1'), { ctrlKey: true });
  // await userEvent.click(getBtn('明天+0'), { ctrlKey: true });
  // expect(isCurrent('不限')).toBeFalsy();
  // expect(isCurrent('+1')).toBeTruthy();
  // expect(isCurrent('明天+0')).toBeTruthy();
};

export const Shortcut2 = () => {
  return (
    <DateShortcuts
      type={DealType.GVN}
      value={[
        {
          tag: LiquidationSpeedTag.Today,
          offset: 0
        },
        {
          tag: LiquidationSpeedTag.Today,
          offset: 1
        },
        {
          tag: LiquidationSpeedTag.Tomorrow,
          offset: 0
        }
      ]}
      defaultLiqSpeedList={[
        {
          offset: 1,
          tag: LiquidationSpeedTag.Today
        },
        {
          tag: LiquidationSpeedTag.Tomorrow,
          offset: 0
        }
      ]}
      onChange={(methods: SettlementMethod[]) => {
        console.log(methods);
      }}
    />
  );
};
Shortcut2.storyName = 'Gvn样式';

export const Shortcut3 = () => {
  return (
    <DateShortcuts
      type={DealType.TKN}
      allowMultipleCheck={false}
      defaultLabel="冇limit"
      value={[
        {
          tag: LiquidationSpeedTag.Today,
          offset: 0
        },
        {
          tag: LiquidationSpeedTag.Today,
          offset: 1
        },
        {
          tag: LiquidationSpeedTag.Tomorrow,
          offset: 0
        }
      ]}
      onChange={(methods: SettlementMethod[]) => {
        console.log(methods);
      }}
    />
  );
};
Shortcut3.storyName = '单选、Tkn样式';

export const Shortcut4 = () => {
  return (
    <DateShortcuts
      disabled
      size="middle"
      minWidth={100}
      type={DealType.TKN}
      value={[
        {
          tag: LiquidationSpeedTag.Today,
          offset: 0
        },
        {
          tag: LiquidationSpeedTag.Today,
          offset: 1
        },
        {
          tag: LiquidationSpeedTag.Tomorrow,
          offset: 0
        }
      ]}
      onChange={(methods: SettlementMethod[]) => {
        console.log(methods);
      }}
    />
  );
};
Shortcut4.storyName = '禁用+普通尺寸(OMS样式)';

export const Shortcut5 = () => {
  return (
    <DateShortcuts
      type={DealType.GVN}
      asStaticText
      prefix="远期："
      value={[
        {
          tag: LiquidationSpeedTag.Tomorrow,
          offset: 1
        }
      ]}
    />
  );
};
Shortcut5.storyName = '文本样式';
