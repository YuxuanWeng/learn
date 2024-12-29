import { Outlet } from 'react-router-dom';
import { HooksRender } from '../HooksRender';

export const Root = () => {
  return (
    <>
      <Outlet />
      <HooksRender />
    </>
  );
};
