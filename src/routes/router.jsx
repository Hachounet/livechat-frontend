import { createBrowserRouter } from 'react-router-dom';
import AuthenticationTitle from '../components/AuthenticationTitle';
import App from '../App';
import ErrorPage from '../components/ErrorPage';
import SignUp from '../components/SignUp';
import Home from '../components/Home';
import FriendsList from '../components/FriendsList';
const router = createBrowserRouter([
  {
    path: '/',
    element: <App></App>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        index: true,
        element: <AuthenticationTitle />,
      },
      {
        path: '/signup',
        element: <SignUp />,
      },
      {
        path: '/home',
        element: <Home />,
        children: [
          {
            path: '/home',
            element: <FriendsList />,
          },
        ],
      },
    ],
  },
]);

export default router;
