import { useMemo } from 'react';
import { Button } from '@fepkg/components/Button';
import {
  IconDelete,
  IconEdit,
  IconFullInquiry,
  IconProvider,
  IconToExternal,
  IconToInternal
} from '@fepkg/icon-park-react';
import { NCDPOperationType } from '@fepkg/services/types/bds-enum';
import { NCDPInfo } from '@fepkg/services/types/common';
import { useSetAtom } from 'jotai';
import { useDialogWindow } from '@/common/hooks/useDialog';
import { mulDeleteNCDP } from '@/common/services/api/bond-quote/ncdp-delete';
import { mulUpdateNCDP } from '@/common/services/api/bond-quote/ncdp-update';
import { copyNCDPByID } from '@/common/utils/copy/ncdp-info';
import { getNCDPBatchFormConfig } from '@/pages/NCDP/NCDPBatchForm/utils';
import { toastNCDPSidebarError } from '@/pages/NCDP/NCDPBatchForm/utils/check';
import { NCDPReportForm } from '@/pages/NCDP/NCDPReportForm';
import { useGenerateReport } from '@/pages/NCDP/NCDPReportForm/useGenerateReport';
import { editMdlOpenAtom } from '@/pages/ProductPanel/components/NCDPTable/EditModal';
import { IssueMaturityCache } from '@/pages/ProductPanel/components/NCDPTable/types';
import { useProductPanel } from '@/pages/ProductPanel/providers/PanelProvider';
import { preventEnterDefault } from '@/pages/ProductPanel/utils';
import { NCDP_BTN_COMMON_PROPS } from './constants';
import { InternalEnum } from './types';
import { useNCDPHotkeyRefs } from './useNCDPHotkeyRefs';

type NCDPShortcutSidebarProps = {
  /** 是否为已删除页签的操作栏 */
  referred: boolean;
  /** 已选择的 ncdp 列表 */
  selectedNCDPList: NCDPInfo[];
  /** 复制相关的日期数据 */
  issueMaturityCache?: IssueMaturityCache;
};

export const NCDPShortcutSidebar = ({ referred, selectedNCDPList, issueMaturityCache }: NCDPShortcutSidebarProps) => {
  const { openDialog } = useDialogWindow();
  const { handleGenerate, generating } = useGenerateReport();
  const { accessCache } = useProductPanel();

  const setEditMdlOpen = useSetAtom(editMdlOpenAtom);

  const hasSelectedNCDP = !!selectedNCDPList?.length;

  const { quoteRef, internalRef, externalRef } = useNCDPHotkeyRefs({ selectedNCDPList, hasSelectedNCDP });

  const disabled = useMemo(() => {
    // if (!accessCache.quote) return true;

    // 无选择报价或作废区时则禁用
    return !hasSelectedNCDP || referred;
  }, [hasSelectedNCDP, referred]);

  const getExtVisible = useMemo(() => {
    const status = selectedNCDPList?.map(quote => quote.flag_internal);
    const counts = status?.filter(Boolean);
    // 选中的全是暗盘
    if (!counts?.length) return InternalEnum.External;
    // 选中的全是明盘
    if (counts.length === status?.length) return InternalEnum.Internal;
    // 选中的有明盘有暗盘
    return undefined;
  }, [selectedNCDPList]);

  const handleDelete = async () => {
    const ncdpIdList = selectedNCDPList.map(i => i.ncdp_id);
    await mulDeleteNCDP(ncdpIdList);

    copyNCDPByID(ncdpIdList, issueMaturityCache);
  };

  const handleFullInquiry = async () => {
    const ncdpInfoList = selectedNCDPList?.map((i, idx) => ({
      ncdp_id: i.ncdp_id,
      flag_full: !i.flag_full,
      line: idx + 1
    }));

    const { err_list = [] } = await mulUpdateNCDP(ncdpInfoList, NCDPOperationType.NcdPQuickModify);
    toastNCDPSidebarError(err_list, selectedNCDPList.length);

    const quoteIdList = selectedNCDPList.map(i => i.ncdp_id);
    copyNCDPByID(quoteIdList, issueMaturityCache);
  };

  /** 内部报价则toInternal传true */
  const handleToExternalOrInternal = async (toInternal: boolean) => {
    const ncdpInfoList =
      selectedNCDPList
        ?.filter(v => (toInternal ? !v.flag_internal : !!v.flag_internal))
        ?.map((i, idx) => ({ ncdp_id: i.ncdp_id, flag_internal: toInternal, line: idx + 1 })) ?? [];

    const { err_list = [] } = await mulUpdateNCDP(ncdpInfoList, NCDPOperationType.NcdPQuickModify);
    toastNCDPSidebarError(err_list, selectedNCDPList.length);

    const quoteIdList = selectedNCDPList.map(i => i.ncdp_id);
    copyNCDPByID(quoteIdList, issueMaturityCache);
  };

  return (
    <>
      {/* 找个没人的地方把自己藏起来，免得影响到别人 */}
      <NCDPReportForm className="absolute left-[170px]" />

      <Button
        tabIndex={-1}
        type="secondary"
        className="!font-heavy w-full"
        ghost
        ref={quoteRef}
        onKeyDown={preventEnterDefault}
        disabled={!accessCache.quote}
        onClick={() => {
          openDialog(getNCDPBatchFormConfig());
        }}
      >
        录入
      </Button>
      <Button
        tabIndex={-1}
        type="green"
        // 边距要小一点，不然loading状态文本会换行
        className="!font-heavy w-full px-2"
        onKeyDown={preventEnterDefault}
        disabled={generating || !accessCache.report}
        loading={generating}
        onClick={() => {
          // 打开报表
          handleGenerate();
        }}
      >
        报表
      </Button>
      <div className="w-16 h-0 border-0 border-t border-gray-500 border-dashed my-1" />
      <div className="flex flex-col gap-3 overflow-y-overlay">
        <IconProvider value={{ size: 24 }}>
          <Button
            {...NCDP_BTN_COMMON_PROPS}
            icon={<IconEdit />}
            disabled={disabled || !accessCache.quote}
            onClick={() => setEditMdlOpen(true)}
          >
            编辑
          </Button>

          <Button
            {...NCDP_BTN_COMMON_PROPS}
            icon={<IconFullInquiry />}
            disabled={disabled || !accessCache.quote}
            onClick={handleFullInquiry}
          >
            询满
          </Button>

          <Button
            {...NCDP_BTN_COMMON_PROPS}
            ref={internalRef}
            icon={<IconToExternal />}
            disabled={disabled || getExtVisible === InternalEnum.External || !accessCache.quote}
            onClick={() => handleToExternalOrInternal(false)}
          >
            外部报价
          </Button>

          <Button
            {...NCDP_BTN_COMMON_PROPS}
            ref={externalRef}
            icon={<IconToInternal />}
            disabled={disabled || getExtVisible === InternalEnum.Internal || !accessCache.quote}
            onClick={() => handleToExternalOrInternal(true)}
          >
            内部报价
          </Button>

          <Button
            {...NCDP_BTN_COMMON_PROPS}
            icon={<IconDelete />}
            disabled={disabled || !accessCache.quote}
            onClick={handleDelete}
          >
            删除
          </Button>
        </IconProvider>
      </div>
    </>
  );
};
