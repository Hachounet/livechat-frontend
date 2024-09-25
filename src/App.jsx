import './App.css';
import { ChatProvider } from './ChatContext';
import HomeModal from './components/AuthenticationTitle';
import Layout from './components/Layout';
import { Outlet } from 'react-router-dom';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
function App() {
  return (
    <>
      <MantineProvider>
        <ChatProvider>
          <Layout>
            <Outlet />
          </Layout>
        </ChatProvider>
      </MantineProvider>
    </>
  );
}

export default App;
