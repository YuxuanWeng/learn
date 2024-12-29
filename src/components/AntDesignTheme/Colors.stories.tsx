import React from 'react';
import { colorsConfig } from './readColors';

export default {
  title: '基础组件/全局颜色'
};

const Box: React.FC<{ color: string; name: string }> = ({ color, name }) => {
  return (
    <div
      className="text-gray-200"
      style={{
        background: color,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        textShadow: '1px 1px #333',
        width: '500px',
        lineHeight: '50px'
      }}
    >
      <span>{name}</span>
      {color}
    </div>
  );
};

export const Colors = () => {
  return colorsConfig.map(([name, hex]) => (
    <Box
      color={hex}
      name={name}
      key={name}
    />
  ));
};
Colors.storyName = '全局颜色';
