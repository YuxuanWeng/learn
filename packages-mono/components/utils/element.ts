export const hasDropdownEl = () => {
  let nodes = document.querySelectorAll<HTMLElement>('.s-search-dropdown');
  let els = [...nodes];

  const searchOpen = els?.some(el => !el?.className?.includes('s-search-dropdown-hidden'));
  if (searchOpen) return true;

  nodes = document.querySelectorAll<HTMLElement>('.s-select-dropdown');
  els = [...nodes];

  const selectOpen = els?.some(
    el =>
      !(el?.className?.includes('ant-select-dropdown-hidden') || el?.className?.includes('s-select-dropdown-hidden'))
  );
  if (selectOpen) return true;

  nodes = document.querySelectorAll<HTMLElement>('.ant-picker-dropdown');
  els = [...nodes];

  const pickerOpen = els?.some(el => !el?.className?.includes('ant-picker-dropdown-hidden'));
  if (pickerOpen) return true;

  return false;
};
