import { useRef, useState } from 'react';
import { formatDate } from '@fepkg/common/utils/date';
import { message } from '@fepkg/components/Message';
import { ModalUtils } from '@fepkg/components/Modal';
import { fetchPreSign } from '@fepkg/services/api/upload/pre-sign-put';
import { UploadFileScene } from '@fepkg/services/types/enum';
import { useMemoizedFn } from 'ahooks';
import { UtilEventEnum } from 'app/types/IPCEvents';
import html2canvas from 'html2canvas';
import { useSetAtom } from 'jotai';
import { transformMinioUploadUrl } from '@packages/utils/file';
import { miscStorage } from '@/localdb/miscStorage';
import { NCDPTableColumn } from '@/pages/ProductPanel/components/NCDPTable/types';
import { openTimeAtom } from './atom';
import { REPORT_FORM_ID } from './constants';
import { useFullNCDPInfoQuery } from './useFullNCDPInfoQuery';

export const useGenerateReport = () => {
  const [generating, setGenerating] = useState(false);
  const setOpenTime = useSetAtom(openTimeAtom);

  const { data, refetch } = useFullNCDPInfoQuery();

  const previousData = useRef<{ item?: NCDPTableColumn; total?: number } | null>(null);

  /** 获取图片链接，并将图片上传到该链接 */
  const upload = useMemoizedFn(async (file?: Blob | null, scene = UploadFileScene.UploadFileSceneImage) => {
    if (!file) return undefined;

    const { upload_url, file_url } = await fetchPreSign({ scene, extension: 'png' });

    if (!upload_url) {
      message.error('获取上传链接失败，请重试');
    } else {
      const url = transformMinioUploadUrl(upload_url, miscStorage?.apiEnv);
      // 上传文件，这里用 fetch 比内置的 request 更方便，因为不需要鉴权
      const { ok } = await fetch(url, { mode: 'cors', method: 'PUT', body: file });
      return ok ? file_url : undefined;
    }
    return undefined;
  });

  /** canvas转文件后上传并打开 */
  const toBlobUpload = (canvas: HTMLCanvasElement) =>
    new Promise<string>((resolve, reject) => {
      canvas.toBlob(async blob => {
        try {
          const url = await upload(blob);
          if (url) resolve(url);
          else reject(new Error('生成url失败'));
        } catch {
          reject(new Error('上传失败'));
        }
      });
    });

  /** 从页面上获取需要转图片的dom */
  const getDom = (cb: (node: HTMLElement) => void) => {
    // 拿到表单的dom
    const node = document.getElementById(REPORT_FORM_ID);
    if (!node) {
      console.error('报表UI没找到，快去检查检查');
      setGenerating(false);
      return;
    }
    // 获取到dom之后的操作
    cb(node);
  };

  /** dom转换为图片并上传打开 */
  const transformer = (node: HTMLElement) => {
    // 开始转化图片
    html2canvas(node)
      .then(async canvas => {
        const url = await toBlobUpload(canvas);
        // 图片转换完成后，重新获取数据，检查是否有新的数据存在
        const newData = await refetch();

        if (
          // total没有发生变化，并且列表第一位的updateTime也没有更新，说明数据没有更新
          newData.data?.total === previousData.current?.total &&
          newData.data?.list.at(0)?.updateTime === previousData?.current?.item?.updateTime
        ) {
          if (url) window.Main.invoke(UtilEventEnum.OpenExternal, url);
          else console.error('没有url，那肯定打不开');
        } else {
          // 否则提醒用户
          ModalUtils.warning({
            title: '发现新数据',
            content: '有新数据，是否重新打开？',
            // 重新获取dom生成图片；
            onOk: () => {
              console.log('previous url', url);
              setGenerating(true);
              // 重新获取dom的时候需要记录一下当前的数据
              previousData.current = { item: newData.data?.list.at(0), total: newData.data?.total };
              getDom(transformer);
            },
            // 打开旧数据的图片
            onCancel: () => {
              if (url) window.Main.invoke(UtilEventEnum.OpenExternal, url);
              else console.error('没有url，那肯定打不开');
            }
          });
        }
      })
      .catch(e => console.error('生成图片失败', e))
      .finally(() => {
        setGenerating(false);
        // 完成后清空
        previousData.current = null;
      });
  };

  /** 生成报表图片，并跳转到默认浏览器中打开该图片 */
  const handleGenerate = useMemoizedFn(async () => {
    // 点击按钮的第一时间更新报表的打开时间
    setOpenTime(formatDate(Date.now(), 'YYYY-MM-DD HH:mm:ss'));
    // 获取最新的数据
    await refetch();
    // 保存当前的total，用于对比数据变化
    previousData.current = { item: data?.list.at(0), total: data?.total };
    setGenerating(true);

    // 临时方案——给dom一点重新渲染的时间
    setTimeout(() => getDom(transformer), 300);
  });

  return { generating, handleGenerate };
};
