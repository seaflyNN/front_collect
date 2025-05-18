import { Layout, Typography } from 'antd';
import MarkdownEditor from './components/MarkdownEditor';
// import MarkdownEditor from './components/OptimizedMarkdownEditor';
import './App.css';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

function App() {
  return (
    <Layout className="min-h-screen w-full bg-white">
      <Header style={{ backgroundColor: '#ffffff', padding: 0 }} className="flex items-center justify-center h-16 border-b border-gray-200 shadow-sm">
        <Title level={3} className="text-gray-800 m-0 font-normal">Markdown 编辑器</Title>
      </Header>
      <Content className="p-6 bg-white">
        <MarkdownEditor />
      </Content>
      <Footer className="text-center bg-white">Markdown 编辑器 ©{new Date().getFullYear()}</Footer>
    </Layout>
  );
}

export default App;
