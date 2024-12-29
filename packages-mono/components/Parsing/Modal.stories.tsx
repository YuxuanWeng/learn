import { useState } from 'react';
import { ParsingModal } from '@/components/ParsingModal';
import { Button } from '../Button';

export default {
  title: '通用组件/Parsing/Modal'
};

export const Basic = () => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button onClick={() => setVisible(true)}>show</Button>
      <ParsingModal<string>
        visible={visible}
        onParse={async text => {
          await new Promise(res => {
            setTimeout(res, 1000);
          });

          return text.split('');
        }}
        getItemID={i => i}
        getItemName={i => i}
        onConfirm={async val => {
          await new Promise(res => {
            setTimeout(res, 1000);
          });

          console.log(val);
        }}
        onClose={() => setVisible(false)}
      />
    </>
  );
};

Basic.storyName = '弹窗';
