import './App.css';
import { ChatProvider } from './ChatContext';
import Layout from './components/Layout';
import { Outlet } from 'react-router-dom';
import { SocketProvider } from './SocketContext';

function App() {
  return (
    <>
      <SocketProvider>
        <ChatProvider>
          <Layout>
            <Outlet />
          </Layout>
        </ChatProvider>
      </SocketProvider>
    </>
  );
}

export default App;
