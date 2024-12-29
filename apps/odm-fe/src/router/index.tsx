import { createBrowserRouter } from 'react-router-dom';
import { Root } from '@/layouts/Root';
import { Home } from '@/pages/Home';
import { OutBoundConfig } from '@/pages/Home/OutBoundConfig';
import { OutBoundRecord } from '@/pages/Home/OutBoundRecord';
import { Login } from '@/pages/Login';
import { rootLoader } from './rootLoader';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    loader: rootLoader,
    children: [
      {
        path: '/home',
        element: <Home />,
        children: [
          { index: true, element: <OutBoundRecord /> },
          { path: '/home/:id', element: <OutBoundConfig /> }
        ]
      },
      { path: '/login', element: <Login /> },
      { path: '*', element: <div>no Page</div> }
    ]
  }
]);
