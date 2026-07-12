import React from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  Typography,
  Space,
  Divider,
  Alert,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  LoginOutlined,
} from "../../components/Icons";
import { useAuth } from "../../contexts/AuthContext";
import { UserRole } from "../../types";

const { Title, Text } = Typography;
const { Option } = Select;

interface LoginFormValues {
  email: string;
  password: string;
  role: UserRole;
}

const Login: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [form] = Form.useForm<LoginFormValues>();

  const onFinish = (values: LoginFormValues) => {
    login(values.email, values.password, values.role);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f0f2f5",
      }}
    >
      <Card style={{ width: 400, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div style={{ textAlign: "center" }}>
            <LoginOutlined
              // style={{ fontSize: 48, color: "#1890ff" }}
            />
            <Title level={2}>Resly</Title>
            <Text type="secondary">Управление ресурсами</Text>
          </div>

          <Divider />

          <Alert
            message="Демо-доступ"
            description="Введите любой пароль и выберите роль"
            type="info"
            showIcon
          />

          <Form
            form={form}
            name="login"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            initialValues={{ role: "consumer" }}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Введите email" },
                { type: "email", message: "Введите корректный email" },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="example@mail.com" />
            </Form.Item>

            <Form.Item
              label="Пароль"
              name="password"
              rules={[{ required: true, message: "Введите пароль" }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="******" />
            </Form.Item>

            <Form.Item
              label="Роль"
              name="role"
              rules={[{ required: true, message: "Выберите роль" }]}
            >
              <Select>
                <Option value="consumer">Покупатель</Option>
                <Option value="seller">Продавец</Option>
                <Option value="admin">Администратор</Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                block
                size="large"
              >
                Войти
              </Button>
            </Form.Item>
          </Form>
        </Space>
      </Card>
    </div>
  );
};

export default Login;
