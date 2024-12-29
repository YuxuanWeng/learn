import { IconUrgentFilled } from '@fepkg/icon-park-react';
import { Button } from '.';
import { ButtonPlainType, ButtonType } from './types';

export default {
  title: '通用组件/Button/Button',
  component: Button
};

const renderButtons = (title: string, type: ButtonType, plain?: ButtonPlainType, text?: boolean) => {
  return (
    <div className="flex flex-col gap-4">
      <div>{title}</div>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <div
            className="grid gap-8 font-medium"
            style={{ gridTemplateColumns: '126px 146px 146px' }}
          >
            <Button type={type}>Button Name</Button>
            <Button
              type={type}
              icon={<IconUrgentFilled />}
            >
              Button Name
            </Button>
            <Button
              type={type}
              loading
            >
              Button Name
            </Button>
          </div>

          <div
            className="grid gap-8 font-medium"
            style={{ gridTemplateColumns: '126px 146px 146px' }}
          >
            <Button
              type={type}
              disabled
            >
              Button Name
            </Button>
            <Button
              type={type}
              icon={<IconUrgentFilled />}
              disabled
            >
              Button Name
            </Button>
            <Button
              type={type}
              loading
              disabled
            >
              Button Name
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div
            className="grid gap-8 font-medium"
            style={{ gridTemplateColumns: '126px 146px 146px' }}
          >
            <Button
              type={type}
              ghost
            >
              Button Name
            </Button>
            <Button
              type={type}
              icon={<IconUrgentFilled />}
              ghost
            >
              Button Name
            </Button>
            <Button
              type={type}
              ghost
              loading
            >
              Button Name
            </Button>
          </div>

          <div
            className="grid gap-8 font-medium"
            style={{ gridTemplateColumns: '126px 146px 146px' }}
          >
            <Button
              type={type}
              ghost
              disabled
            >
              Button Name
            </Button>
            <Button
              type={type}
              icon={<IconUrgentFilled />}
              ghost
              disabled
            >
              Button Name
            </Button>
            <Button
              type={type}
              ghost
              loading
              disabled
            >
              Button Name
            </Button>
          </div>
        </div>

        {plain && (
          <div className="flex flex-col gap-4">
            <div
              className="grid gap-8 font-medium"
              style={{ gridTemplateColumns: '126px 146px 146px' }}
            >
              <Button
                type={type}
                plain={plain}
              >
                Button Name
              </Button>
              <Button
                type={type}
                icon={<IconUrgentFilled />}
                plain={plain}
              >
                Button Name
              </Button>
              <Button
                type={type}
                plain={plain}
                loading
              >
                Button Name
              </Button>
            </div>

            <div
              className="grid gap-8 font-medium"
              style={{ gridTemplateColumns: '126px 146px 146px' }}
            >
              <Button
                type={type}
                plain={plain}
                disabled
              >
                Button Name
              </Button>
              <Button
                type={type}
                icon={<IconUrgentFilled />}
                plain={plain}
                disabled
              >
                Button Name
              </Button>
              <Button
                type={type}
                plain={plain}
                loading
                disabled
              >
                Button Name
              </Button>
            </div>
          </div>
        )}

        {text && (
          <div className="flex flex-col gap-4">
            <div
              className="grid gap-8 font-medium"
              style={{ gridTemplateColumns: '126px 146px 146px' }}
            >
              <Button
                type={type}
                text
              >
                Button Name
              </Button>
              <Button
                type={type}
                icon={<IconUrgentFilled />}
                text
              >
                Button Name
              </Button>
              <Button
                type={type}
                text
                loading
              >
                Button Name
              </Button>
            </div>

            <div
              className="grid gap-8 font-medium"
              style={{ gridTemplateColumns: '126px 146px 146px' }}
            >
              <Button
                type={type}
                text
                disabled
              >
                Button Name
              </Button>
              <Button
                type={type}
                icon={<IconUrgentFilled />}
                text
                disabled
              >
                Button Name
              </Button>
              <Button
                type={type}
                text
                loading
                disabled
              >
                Button Name
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const Basic = () => {
  return (
    <div className="flex flex-col gap-8">
      {renderButtons('主按钮', 'primary', true, true)}
      {renderButtons('辅助按钮', 'secondary')}
      {renderButtons('橙色按钮', 'orange')}
      {renderButtons('绿色按钮', 'green')}
      {renderButtons('黄色按钮', 'yellow')}
      {renderButtons('灰色按钮', 'gray', 'primary', true)}
      {renderButtons('灰色按钮', 'gray', 'orange')}
      {renderButtons('危险按钮', 'danger', true)}
    </div>
  );
};
