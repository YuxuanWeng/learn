import { Button } from '@fepkg/components/Button';
import { Caption, CaptionProps } from '@fepkg/components/Caption';
import { IconEdit, IconSave } from '@fepkg/icon-park-react';

type IHeader = {
  title: string;
  isEdit: boolean;
  saveLoading?: boolean;
  editable?: boolean;
  captionType?: CaptionProps['type'];
  onEdit?: React.MouseEventHandler<HTMLButtonElement>;
  onCancel?: React.MouseEventHandler<HTMLButtonElement>;
  onSave?: () => Promise<void>;
};
export const Header = ({ title, captionType, isEdit, onEdit, onCancel, onSave, saveLoading, editable }: IHeader) => {
  return (
    <div className="py-4 leading-8">
      <div className="flex justify-between">
        <Caption type={captionType}>{title}</Caption>
        <div className="h-8">
          {isEdit && editable && (
            <>
              <Button
                type="gray"
                className="w-22"
                ghost
                onClick={onCancel}
              >
                取消
              </Button>
              <Button
                className="w-22 ml-3"
                icon={<IconSave />}
                loading={saveLoading}
                disabled={saveLoading}
                onClick={onSave}
              >
                保存
              </Button>
            </>
          )}
          {!isEdit && editable && (
            <Button
              className="w-22"
              icon={<IconEdit />}
              onClick={onEdit}
            >
              编辑
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
