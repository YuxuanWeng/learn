import { IconAttentionFilled } from '@fepkg/icon-park-react';
import { useAtomValue } from 'jotai';
import { ViewOriginalImage } from '@/components/Image';
import { originalTextMdlTargetMessageAtom } from '@/pages/Quote/Collaborative/atoms/modal';

export const OriginalImage = () => {
  const message = useAtomValue(originalTextMdlTargetMessageAtom);

  if (!message?.img_url) return null;

  const noParsed = !message?.detail_order_list?.length;

  return (
    <div className="flex justify-between items-center pt-3 px-4 select-none">
      <div className="flex items-center gap-2">
        <span className="py-0.5 px-2 text-xs text-gray-200 bg-gray-500 rounded">原图</span>
        <ViewOriginalImage
          triggerWithText={{ text: message?.img_name }}
          imageProps={{ src: message.img_url }}
        />
      </div>

      {noParsed && (
        <span className="flex items-center gap-3 h-6 px-3 bg-orange-700/80 rounded-lg">
          <IconAttentionFilled className="text-orange-100" />
          <span className="text-sm text-gray-000">未识别到文本信息</span>
        </span>
      )}
    </div>
  );
};
