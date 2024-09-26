import './App.css';
import { ChatProvider } from './ChatContext';
import Layout from './components/Layout';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <>
      <ChatProvider>
        <Layout>
          <Outlet />
        </Layout>
      </ChatProvider>
    </>
  );
}

export default App;
