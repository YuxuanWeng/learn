type SideVolCellProps = {
  /** 暗盘显示最优 */
  intShowOptimal: boolean;
  /** 暗盘优于明盘 */
  intBatter: boolean;
  /** 暗盘劣于明盘 */
  extBatter: boolean;
  /** 暗盘等于明盘 */
  bothEqual: boolean;
  /** 暗盘报价量 */
  intVolume?: number[];
  /** 明盘报价量 */
  extVolume?: number[];
};

export const SideVolCell = ({
  intShowOptimal,
  intBatter,
  extBatter,
  bothEqual,
  intVolume,
  extVolume
}: SideVolCellProps) => {
  const intVolContent = intVolume?.map(vol => (vol <= 0 ? '--' : vol))?.join(' + ');
  const extVolContent = extVolume?.length !== 0 ? extVolume?.map(vol => (vol <= 0 ? '--' : vol))?.join(' + ') : '--';

  // 如果仅有暗盘，无明盘
  if (intVolume?.length && !extVolume?.length) {
    return <span className="text-primary-100">{intVolContent}</span>;
  }

  // 如果暗盘劣于明盘，则不显示暗盘
  if (extBatter) {
    return <span>{extVolContent}</span>;
  }

  // 如果暗盘显示最优 -> 信用
  if (intShowOptimal) {
    // 如果暗盘等于明盘
    if (bothEqual) {
      // 看该方向上最优的报价，是暗盘，还是明盘，如果是暗盘，就显示暗盘 + 明盘的信息
      if (intBatter) {
        return (
          <>
            <span className="text-primary-100">{intVolContent}</span>
            {intVolume?.length && extVolume?.length ? <span> + </span> : ''}
            <span>{extVolContent}</span>
          </>
        );
      }

      // 反之，不显示暗盘信息，只显示明盘信息
      return <span>{extVolContent}</span>;
    }

    // 如果暗盘优于明盘
    if (intBatter) {
      return <span className="text-primary-100">{intVolContent}</span>;
    }

    return <span>{extVolContent}</span>;
  }

  // -> 利率
  // 如果暗盘有报价，明盘无报价，则显示暗盘的价格，不显示明盘的价格
  if (extVolume?.length === 0 && (intVolume?.length ?? 0) > 0) {
    return <span className="text-primary-100">{intVolContent}</span>;
  }

  return <span>{extVolContent}</span>;
};
