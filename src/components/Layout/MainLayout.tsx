import React from 'react';
import { Layout as AntLayout } from 'antd';

const { Header, Content, Footer } = AntLayout;

const MainLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AntLayout style={{ minHeight: '100vh' }}>
    <Header style={{ color: '#fff', fontSize: '20px' }}>My App</Header>
    <Content style={{ padding: '24px' }}>{children}</Content>
    <Footer style={{ textAlign: 'center' }}>©2026 Resly</Footer>
  </AntLayout>
);

export default MainLayout;
