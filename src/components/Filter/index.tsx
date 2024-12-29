import { Fragment } from 'react';
import cx from 'classnames';
import { RadioIndeterminateGroup } from '@fepkg/components/Radio';
import { FilterProps } from './types';

const rendererCls = 'flex items-center gap-3';

const FilterRenderer = ({ configs, value, className, onChange }: FilterProps) => {
  const changeValues = (key: string, v: unknown[]) => {
    requestIdleCallback(() => {
      onChange?.({ key, currentState: { ...value, [key]: v } });
    });
  };

  return (
    <div className={rendererCls}>
      {configs.map(config => {
        const target = (
          <RadioIndeterminateGroup
            key={config.key}
            clearInnerPadding={config.clearInnerPadding}
            indeterminateProps={{ ...config.indeterminateProps, checked: config.checkedAll }}
            className={cx('flex-shrink-0 bg-gray-700 rounded-lg', className)}
            label={config.showTitle ? <label className="text-gray-200 text-sm ml-3">{config.title}</label> : void 0}
            options={config.options}
            otherCancel
            value={value[config.key]}
            onChange={val => changeValues(config.key, val)}
          />
        );

        const render = config.prefix?.render ? (
          <div
            className="flex gap-1 bg-gray-700 rounded-lg"
            key={config.key}
          >
            {config.prefix.render}
            {target}
          </div>
        ) : (
          target
        );

        if (config.suffix?.render) {
          return (
            <Fragment key={config.key}>
              {render}
              {config.suffix.render}
            </Fragment>
          );
        }

        return render;
      })}
    </div>
  );
};

export const Filter = ({ configs, value, productType, onChange, ...rest }: FilterProps) => {
  const firstRowConfigs = configs.filter(config => config.row[productType] === 1);
  const secondRowConfigs = configs.filter(config => config.row[productType] === 2);
  const thirdRowConfigs = configs.filter(config => config.row[productType] === 3);
  const fourthRowConfigs = configs.filter(config => config.row[productType] === 4);
  const fifthRowConfigs = configs.filter(config => config.row[productType] === 5);
  const sixthRowConfigs = configs.filter(config => config.row[productType] === 6);
  const seventhRowConfigs = configs.filter(config => config.row[productType] === 7);
  const eighthRowConfigs = configs.filter(config => config.row[productType] === 8);
  const ninthRowConfigs = configs.filter(config => config.row[productType] === 9);

  const render = [
    firstRowConfigs,
    secondRowConfigs,
    thirdRowConfigs,
    fourthRowConfigs,
    fifthRowConfigs,
    sixthRowConfigs,
    seventhRowConfigs,
    eighthRowConfigs,
    ninthRowConfigs
  ]
    .filter(v => v.length)
    .map(v => (
      <FilterRenderer
        key={JSON.stringify(v.values)}
        productType={productType}
        configs={v}
        value={value}
        onChange={onChange}
        {...rest}
      />
    ));

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{render}</>;
};
