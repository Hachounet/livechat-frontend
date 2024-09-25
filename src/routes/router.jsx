import { createBrowserRouter } from 'react-router-dom';
import AuthenticationTitle from '../components/AuthenticationTitle';
import App from '../App';
import ErrorPage from '../components/ErrorPage';
import SignUp from '../components/SignUp';
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
    ],
  },
]);

export default router;
