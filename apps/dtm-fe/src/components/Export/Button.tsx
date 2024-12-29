import { useRef, useState } from 'react';
import { formatDate } from '@fepkg/common/utils/date';
import { Button } from '@fepkg/components/Button';
import { message } from '@fepkg/components/Message';
import { ModalUtils } from '@fepkg/components/Modal';
import { IconExportFilled } from '@fepkg/icon-park-react';
import { fetchCurrentTimestamp } from '@fepkg/services/api/base/current-timestamp';
import { ReceiptDealApprovalHistoryCheckUpdate } from '@fepkg/services/types/receipt-deal/approval-history-check-update';
import { ReceiptDealApprovalHistoryExport } from '@fepkg/services/types/receipt-deal/approval-history-export';
import { DTMTrackEventDashBoardEnum } from '@/hooks/useLog';
import { captureMessage } from '@sentry/react';
import { useMutation } from '@tanstack/react-query';
import { WorkSheet, read, writeFile } from 'xlsx-js-style';
import { trackPoint } from '@/common/logger';
import { fetchApprovalHistoryCheckUpdate } from '@/common/services/api/approval/history-check-update';
import { exportHistory } from '@/common/services/api/approval/history-export';
import { DEFAULT_EXPORT_TEMPLATE_CONFIG } from './constants';
import { ExportProps, ExportTemplateIdxCache } from './types';
import { useExportTemplate } from './useExportTemplate';

const SHEET_NAME = 'Sheet1';

const STYLE = { alignment: { horizontal: 'center' }, font: { name: '宋体' } };

/** 每次导出的行数 */
const EXPORT_COUNT = 2000;

const generateExcel = (idxCache: ExportTemplateIdxCache, data: string) => {
  const cols: WorkSheet['!cols'] = [];
  const headers: string[] = [];

  for (let i = 0, len = DEFAULT_EXPORT_TEMPLATE_CONFIG.length; i < len; i++) {
    // 如果模板中有该列，需要把该列数据丢入数组中，重新拼接每行数据
    if (idxCache[i]) {
      const item = DEFAULT_EXPORT_TEMPLATE_CONFIG[i];
      cols.push({ wpx: item.wpx });
      headers.push(item.header);
    }
  }

  const headerData = `${headers.join(',')}\n`;

  const wb = read(headerData + data, { type: 'string', raw: true });
  const ws = wb.Sheets[SHEET_NAME];

  if (!ws) throw new Error('The wb has not sheet.');

  ws['!cols'] = cols;

  for (const key of Object.keys(ws)) {
    // key[0] 的速度会更快
    // https://perf.link/#eyJpZCI6InFmNmVhMmwzMTNnIiwidGl0bGUiOiJGaW5kaW5nIG51bWJlcnMgaW4gYW4gYXJyYXkgb2YgMTAwMCIsImJlZm9yZSI6ImNvbnN0IGRhdGEgPSAnYWFhJyIsInRlc3RzIjpbeyJuYW1lIjoiVGVzdCBDYXNlIiwiY29kZSI6ImRhdGEuc3RhcnRzV2l0aCgnYicpIiwicnVucyI6WzYzMjUwMDAsNTIyMTAwMCwzNjM4MDAwLDE4ODEwMDAsMTA0NTAwMDAsNzU1MjAwMCwxNTY1MDAwLDc2ODYwMDAsNjU4MDAwLDc4NTYwMDAsNDIzMzAwMCw0MDU0MDAwLDQ1OTAwMCw1MzQ1MDAwLDIzNzQwMDAsNDU5NzAwMCwxMDYwMDAsMTE3NTYwMDAsMzIzMTAwMCwzMzYyMDAwLDgxNDIwMDAsODAzMTAwMCw5MTQyMDAwLDg0NjAwMCw1MDQ2MDAwLDUzMzIwMDAsMTExNTEwMDAsMTE0OTAwMCwyNzIwMDAwLDM3ODYwMDAsMTE1NTQwMDAsMTE2MjMwMDAsMTIwNTMwMDAsMTEyNjcwMDAsMTI5OTgwMDAsMTU4OTUwMDAsMzI1NDAwMCwxNTI2MDAwLDMzNjUwMDAsMTI1NTEwMDAsNDI5ODAwMCw0MDg0MDAwLDEzODEzMDAwLDExNDQ1MDAwLDI5NzgwMDAsNDcwMzAwMCwxNzIyMDAwLDExMTMxMDAwLDkwNTIwMDAsODE0MjAwMCwzNDg5MDAwLDExNzI1MDAwLDkwMzAwMCw4MTQyMDAwLDYxMjkwMDAsMTEzNTQwMDAsMjMyOTAwMCw4MTQyMDAwLDY1MTIwMDAsOTAzNjAwMCwyNzk0MDAwLDIwNzgwMDAsOTYxNTAwMCw3MzQwMDAwLDU0NjAwMDAsNTI0MDAwLDcyNTgwMDAsODEyNjAwMCw4MTQyMDAwLDU2OTYwMDAsNDI3MDAwMCwyMDAwMCw3NzAxMDAwLDU3MjIwMDAsNzE4NjAwMCw2MTcyMDAwLDExNzI3MDAwLDYwNDcwMDAsODg5NDAwMCw4NjUxMDAwLDI5NTUwMDAsMzAwNzAwMCw1MjIyMDAwLDEzMjE2MDAwLDUyMDIwMDAsNzAwNzAwMCwyMzY3MDAwLDE1OTc4MDAwLDU3OTgwMDAsODE0MjAwMCwxNTIxNzAwMCwxNTA4MDAwLDcwODIwMDAsODE0MjAwMCw4MTQyMDAwLDEzNTQwMDAwLDgxNDgwMDAsOTU3NzAwMCwxMDQ3OTAwMCwxMzIxMDAwXSwib3BzIjo2NTgzODIwfSx7Im5hbWUiOiJUZXN0IENhc2UiLCJjb2RlIjoiZGF0YVswXSA9PT0gJ2InIiwicnVucyI6WzU3OTUwMDAsMjk1MDAwMCwxMzQxMDAwLDI2NTEwMDAsOTgwNDAwMCw2MjUzMDAwLDEwNzQxMDAwLDgwODEwMDAsOTYyNjAwMCw3MDk3MDAwLDExOTQwMDAsODgzMDAwLDE1MTQwMDAwLDUzNDEwMDAsMTY3OTMwMDAsMjIxMDAwMCwxNDQ1NzAwMCwxMTg2MjAwMCw0ODIwMDAsMTU2NjUwMDAsNjg1NjAwMCw4NDM3MDAwLDg1NzAwMDAsMTQ0MjUwMDAsMzQ5MDAwMCwyMzMxMDAwLDkwNTMwMDAsMTUyMTkwMDAsNDY3MDAwLDEyMTIwMDAsODcxMzAwMCwxMTIyNjAwMCw5MjA0MDAwLDEwNTA0MDAwLDE0MTAxMDAwLDEzMTQ5MDAwLDE0MTUxMDAwLDE2NTY2MDAwLDE0NjIyMDAwLDk3NjcwMDAsMTMyNDIwMDAsMTU3NjAwMDAsMTU0NDcwMDAsOTI2NjAwMCwxNjM2MDAwMCwxNjQyMDAwMCwzNjA0MDAwLDExNzgzMDAwLDU4ODkwMDAsNTA3NzAwMCwxMTQ4ODAwMCwxMjIzNjAwMCwxMjk3MTAwMCw1OTIxMDAwLDEzMjIwMDAsMTMzNjMwMDAsMTYzMTAwMDAsNTQxMDAwMCwxMDg5MDAwLDcyOTgwMDAsMTU5OTUwMDAsNzA2MDAwLDUxNDgwMDAsMzE4NDAwMCw4NjEwMDAsMTM0ODAwMDAsNTQxMjAwMCw2MDcwMDAwLDIxMTcwMDAsMjA2NTAwMCw2Nzc5MDAwLDEzMTU5MDAwLDQ1MzUwMDAsMTI2MzAwMCw1MTk0MDAwLDE1NTkwMDAsODkzNzAwMCwxMzc0NTAwMCw3MzQ0MDAwLDQ2MzYwMDAsMTQ2NTMwMDAsMTY1NDUwMDAsNzk3MDAwLDEzOTA4MDAwLDc1OTgwMDAsMzgyMjAwMCwxMDA2MTAwMCw4NTAyMDAwLDEwNzIwMDAsMzIyMDAwMCwxNTk3OTAwMCwxMjkwNDAwMCw0MTgwMDAsMzg1NTAwMCw3MDQ1MDAwLDEwOTE3MDAwLDQ5NTcwMDAsNjA5NjAwMCw2MDYwMDAwLDEzMTkwMDBdLCJvcHMiOjgxMjYwMjB9XSwidXBkYXRlZCI6IjIwMjMtMDktMTVUMDk6MzM6MzcuNTg2WiJ9
    if (key[0] !== '!') {
      ws[key].s = STYLE;
    }
  }

  const date = formatDate(Date.now(), 'YYYYMMDD');

  return [wb, date] as const;
};

const handleData = (csv: string, idxCache: ExportTemplateIdxCache, data?: string[]) => {
  // 如果有数据，需要拼接 csv
  if (data?.length) {
    for (const rowData of data) {
      // 服务端会按顺序把拼接好的内容放在一行中，然后使用「,」分割出内容
      // 这里使用「,」分割就能获得每列的数据
      const colData = rowData.split(',');
      /** 过滤后的行数据 */
      const filteredRowData: string[] = [];

      for (let i = 0, len = colData.length; i < len; i++) {
        // 如果模板中有该列，需要把该列数据丢入数组中，重新拼接每行数据
        if (idxCache[i]) filteredRowData.push(colData[i]);
      }

      // 如果最后一项不是换行符，把换行符塞进去
      if (filteredRowData.at(-1) !== '\n') filteredRowData.push('\n');

      // 重新「,」拼接到 csv 内
      csv += filteredRowData.join(',');
    }
  }

  return csv;
};

export const ExportButton = ({ filterParams }: ExportProps.Button) => {
  const { getTemplateIdxCache } = useExportTemplate();

  const [loading, setLoading] = useState(false);
  /** csv 格式导出格式字符串 */
  const csv = useRef('');
  /** 点击导出按钮时，拿到当前服务器的时间，用于检查历史记录是否需要更新 */
  const latestVersion = useRef('');
  /** 点击导出按钮时，用该筛选项第一次导出时检查的 total */
  const firstTotal = useRef(0);
  /** 导出模版顺序索引缓存 */
  const templateIdxCache = useRef(getTemplateIdxCache());
  const warningMdlRef = useRef<{ destroy: () => void } | undefined>();

  const checkUpdate = (params: ReceiptDealApprovalHistoryCheckUpdate.Request, onReexport?: () => void) => {
    return new Promise((resolve, reject) => {
      const toastWarning = () => {
        // 先销毁，再弹窗，避免重复弹窗
        warningMdlRef.current?.destroy();
        warningMdlRef.current = ModalUtils.warning({
          title: '导出中断',
          content: '数据发生变化，导出中断，是否重新导出？',
          onOk: () => {
            onReexport?.();
            reject();
          },
          onCancel: reject
        });
      };

      fetchApprovalHistoryCheckUpdate({ params })
        .then(({ need_update, filter_total }) => {
          // 如果没有已缓存 total，设置 total
          if (!firstTotal.current) {
            firstTotal.current = filter_total;
          } else if (firstTotal.current !== filter_total) {
            // 如果有已缓存的 total，比较 total，不一致则说明数据有变更
            toastWarning();
            return reject();
          }

          if (need_update) {
            toastWarning();
            return reject();
          }

          return resolve(undefined);
        })
        .catch(reject);
    });
  };

  const handleExport = async (mutate: (vars: ReceiptDealApprovalHistoryExport.Request) => void) => {
    setLoading(true);
    latestVersion.current = '';
    firstTotal.current = 0;
    csv.current = '';
    templateIdxCache.current = getTemplateIdxCache();

    try {
      const { current_timestamp } = await fetchCurrentTimestamp();
      latestVersion.current = current_timestamp;

      await checkUpdate({ ...filterParams, start_timestamp: current_timestamp }, () => handleExport(mutate));

      mutate({ ...filterParams, count: EXPORT_COUNT });
    } catch (err) {
      // 如果 err 没有内容，说明为 checkUpdate 内 reject 的错误，此时不需要 toast 提醒
      if (err) message.error('导出失败！请重新导出！');
      captureMessage('DTM export error.', { extra: { err } });

      setLoading(false);
    }
  };

  const { mutate, variables } = useMutation({
    mutationFn: exportHistory,
    retry: 3,
    onSuccess: async res => {
      if (!variables) return;

      const params = { ...variables, start_timestamp: latestVersion.current };
      const reexport = () => handleExport(mutate);

      // TODO 如果有性能优化问题，这里可以考虑先把数据拉完，然后再本地拼接

      try {
        // 处理数据，拼接 csv
        csv.current += handleData(csv.current, templateIdxCache.current, res?.data);

        // check 数据更新
        await checkUpdate(params, reexport);

        // 如果没有返回的 export_after，说明已经数据拉完了，可以导出了
        if (!res?.export_after) {
          const [wb, date] = generateExcel(templateIdxCache.current, csv.current);
          // 这里再 check 一遍是因为生成 excel 的时间不确定，若时间较长，有可能中途会有变更，因此生成完后再重新 check
          await checkUpdate(params, reexport);

          writeFile(wb, `${date}_成交单.xlsx`);

          setLoading(false);
          return;
        }
      } catch (err) {
        captureMessage('DTM export error.', { extra: { err } });
        // 如果 err 没有内容，说明为 checkUpdate 内 reject 的错误，此时不需要 toast 提醒
        if (err) message.error('导出失败！请重新导出！');
        setLoading(false);
        return;
      }

      mutate({ ...variables, export_after: res.export_after });
    },
    onError() {
      setLoading(false);
    }
  });

  return (
    <Button
      type="primary"
      className="w-[88px] px-0"
      icon={<IconExportFilled />}
      loading={loading}
      disabled={loading}
      onClick={() => {
        handleExport(mutate);
        trackPoint(DTMTrackEventDashBoardEnum.ClickHistoryExportButton);
      }}
    >
      {loading ? '导出中' : '导出'}
    </Button>
  );
};
