import React from 'react';
import 'antd/dist/antd.css';
import { Layout, Menu } from 'antd';
import SignalVertical from './SignalVertical/SignalVertical';
import SignalHorizontal from './SignalHorizontal/SignalHorizontal';
import MultiVertical from './MultiVertical/MultiVertical';
import MultiHorizontal from './MultiHorizontal/MultiHorizontal';
import VirtualVertical from './VirtualVertical/VirtualVertical';

const { Sider, Content } = Layout;

const App = () =>  {
  const [currentKey, setCurrentKey] = React.useState('1')
  const handleSelectMenu = ({ item, key, keyPath, selectedKeys, domEvent }) => {
    setCurrentKey(key)
  }
  return (
    <div className="App">
      <Layout style={{width: window.innerWidth, height: window.innerHeight}}>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={broken => {
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
        >
          <div className="logo" />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} onSelect={handleSelectMenu}>
            <Menu.Item key="1">
              <span className="nav-text">单行垂直列表</span>
            </Menu.Item>
            <Menu.Item key="2">
              <span className="nav-text">单行水平列表</span>
            </Menu.Item>
            <Menu.Item key="3">
              <span className="nav-text">多行垂直列表拖拽</span>
            </Menu.Item>
            <Menu.Item key="4">
              <span className="nav-text">多行水平列表拖拽</span>
            </Menu.Item>
            <Menu.Item key="5">
              <span className="nav-text">大数据量垂直列表</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Content style={{ margin: '24px 16px 0' }}>
            {currentKey === '1' ? <SignalVertical/> : null}
            {currentKey === '2' ? <SignalHorizontal/> : null}
            {currentKey === '3' ? <MultiVertical/> : null}
            {currentKey === '4' ? <MultiHorizontal/> : null}
            {currentKey === '5' ? <VirtualVertical/> : null}
          </Content>
        </Layout>
      </Layout>
      
      
    </div>
  );
};

export default App;
