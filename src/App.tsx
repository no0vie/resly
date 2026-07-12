// App.tsx

import React, { useState } from "react";
import { ConfigProvider, Layout, Menu, Avatar, Dropdown, Space } from "antd";
import {
  UserOutlined,
  ShopOutlined,
  EnvironmentOutlined,
  TicketOutlined,
  SettingOutlined,
  LogoutOutlined,
  DashboardOutlined,
} from "./components/Icons";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./components/Auth/Login";
import ProvidersList from "./components/Consumer/ProvidersList";
import ProvidersMap from "./components/Consumer/ProvidersMap";
import TicketsList from "./components/Seller/TicketsList";
import SellersManagement from "./components/Admin/SellersManagement";
import { UserRole } from "./types";
import "antd/dist/reset.css";
import type { MenuProps } from "antd";

const { Header, Content, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

type MenuKey = "providers" | "map" | "tickets" | "sellers";

const AppContent: React.FC = () => {
  const { user, logout } = useAuth();
  const [selectedMenu, setSelectedMenu] = useState<MenuKey>("providers");

  if (!user) {
    return <Login />;
  }

  const getMenuItems = (role: UserRole): MenuItem[] => {
    const items: Record<UserRole, MenuItem[]> = {
      consumer: [
        { key: "providers", icon: <ShopOutlined />, label: "Поставщики" },
        { key: "map", icon: <EnvironmentOutlined />, label: "Карта" },
      ],
      seller: [
        { key: "tickets", icon: <TicketOutlined />, label: "Мои талоны" },
      ],
      admin: [
        { key: "providers", icon: <ShopOutlined />, label: "Поставщики" },
        { key: "map", icon: <EnvironmentOutlined />, label: "Карта" },
        {
          key: "sellers",
          icon: <SettingOutlined />,
          label: "Управление продавцами",
        },
      ],
    };
    return items[role] || items.consumer;
  };

  const renderContent = (): React.ReactNode => {
    switch (selectedMenu) {
      case "providers":
        return <ProvidersList />;
      case "map":
        return <ProvidersMap />;
      case "tickets":
        return <TicketsList />;
      case "sellers":
        return <SellersManagement />;
      default:
        return <ProvidersList />;
    }
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    setSelectedMenu(key as MenuKey);
  };

  const userMenuItems = [
    { key: "profile", label: "Профиль", icon: <UserOutlined /> },
    {
      key: "logout",
      label: "Выйти",
      icon: <LogoutOutlined />,
      onClick: logout,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          background: "#fff",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <DashboardOutlined
          // style={{ fontSize: 24, color: "#1890ff", marginRight: 8 }}
          />
          <span style={{ fontSize: 18, fontWeight: "bold" }}>Resly</span>
        </div>
        <Space>
          <span>{user?.name}</span>
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Avatar style={{ backgroundColor: "#1890ff" }}>
              {user?.name?.[0] || "U"}
            </Avatar>
          </Dropdown>
        </Space>
      </Header>
      <Layout>
        <Sider
          width={200}
          style={{ background: "#fff", borderRight: "1px solid #f0f0f0" }}
        >
          <Menu
            mode="inline"
            selectedKeys={[selectedMenu]}
            style={{ height: "100%", borderRight: 0 }}
            items={getMenuItems(user!.role)}
            onClick={handleMenuClick}
          />
        </Sider>
        <Layout style={{ padding: "24px" }}>
          <Content
            style={{
              background: "#fff",
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            {renderContent()}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#1890ff" } }}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ConfigProvider>
  );
};

export default App;
