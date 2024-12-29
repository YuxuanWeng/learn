import { Dispatch, SetStateAction, memo } from 'react';
import { Checkbox } from '@fepkg/components/Checkbox';
import { ModalProps } from '@fepkg/components/Modal';

export type ParsingListProps<T> = Omit<ModalProps, 'onConfirm'> & {
  getItemID: (item: T) => string;
  getItemName: (item: T) => string;
  parsedList: T[];
  checkedList: T[];
  setCheckedList: Dispatch<SetStateAction<T[]>>;
};

function ParsingList<T>({ getItemID, getItemName, parsedList, checkedList, setCheckedList }: ParsingListProps<T>) {
  return (
    <>
      {parsedList.map(i => {
        const checked = checkedList.some(c => getItemID(c) === getItemID(i));
        return (
          <div
            className="h-8 flex items-center"
            key={getItemID(i)}
          >
            <Checkbox
              className="mx-3"
              checked={checked}
              onChange={() => {
                if (checked) {
                  setCheckedList(checkedList.filter(cur => getItemID(cur) !== getItemID(i)));
                } else {
                  setCheckedList(checkedList.concat(i));
                }
              }}
            >
              {getItemName(i)}
            </Checkbox>
          </div>
        );
      })}
    </>
  );
}

export default memo(ParsingList, (prev, next) => {
  // console.log(prev.checkedList === next.checkedList);
  return prev.parsedList === next.parsedList && prev.checkedList === next.checkedList;
});
