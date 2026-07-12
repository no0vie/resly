import React, { useState, useEffect } from "react";
import {
  Card,
  List,
  Button,
  Tag,
  Space,
  Rate,
  Badge,
  Typography,
  Avatar,
  Row,
  Col,
  Statistic,
  Modal,
  Form,
  Select,
  message,
  Skeleton,
} from "antd";
import {
  ShopOutlined,
  EnvironmentOutlined,
  StarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { apiService } from "../../services/api";
import { Provider, TicketFormData } from "../../types";

const { Text } = Typography;
const { Option } = Select;

const ProvidersList: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null,
  );
  const [form] = Form.useForm<TicketFormData>();

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    setLoading(true);
    try {
      const data = await apiService.getProviders();
      setProviders(data);
    } catch (error) {
      message.error("Ошибка загрузки поставщиков");
    } finally {
      setLoading(false);
    }
  };

  const handleGetTicket = (provider: Provider) => {
    setSelectedProvider(provider);
    setModalVisible(true);
    form.resetFields();
  };

  const handleConfirmTicket = async (values: TicketFormData) => {
    try {
      await apiService.createTicket({
        ...values,
        provider: selectedProvider?.name,
        resource: selectedProvider?.resource,
        userName: "Текущий пользователь",
      });
      message.success(
        `Талон на ресурс "${selectedProvider?.resource}" успешно получен!`,
      );
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error("Ошибка при получении талона");
    }
  };

  const getStatusColor = (status: Provider["status"]) => {
    return status === "active" ? "success" : "error";
  };

  if (loading) {
    return <Skeleton active paragraph={{ rows: 8 }} />;
  }

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Доступные поставщики"
              value={providers.length}
              prefix={<ShopOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Средний рейтинг"
              value={
                providers.reduce((acc, p) => acc + p.rating, 0) /
                  providers.length || 0
              }
              precision={1}
              prefix={<StarOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Доступно ресурсов"
              value={providers.reduce((acc, p) => acc + p.available, 0)}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Активных продавцов"
              value={providers.filter((p) => p.status === "active").length}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={providers}
        renderItem={(provider) => (
          <List.Item>
            <Card
              hoverable
              actions={[
                <Button
                  type="primary"
                  onClick={() => handleGetTicket(provider)}
                  disabled={provider.status === "blocked"}
                >
                  Получить талон
                </Button>,
              ]}
            >
              <Card.Meta
                avatar={
                  <Avatar
                    size={64}
                    icon={<ShopOutlined />}
                    style={{ backgroundColor: "#1890ff" }}
                  />
                }
                title={
                  <Space>
                    <span>{provider.name}</span>
                    <Badge status={getStatusColor(provider.status)} />
                  </Space>
                }
                description={
                  <Space
                    direction="vertical"
                    size="small"
                    style={{ width: "100%" }}
                  >
                    <div>
                      <EnvironmentOutlined /> {provider.address}
                    </div>
                    <div>
                      <Text strong>Ресурс:</Text> {provider.resource}
                    </div>
                    <Space>
                      <Rate
                        disabled
                        defaultValue={provider.rating}
                        style={{ fontSize: 14 }}
                      />
                      <Text type="secondary">({provider.rating})</Text>
                    </Space>
                    <div>
                      <Tag color="green">Доступно: {provider.available}</Tag>
                      <Tag color="blue">Цена: {provider.price}₽</Tag>
                    </div>
                    <div>
                      <ClockCircleOutlined /> {provider.workTime}
                    </div>
                    {provider.phone && (
                      <div>
                        <Text type="secondary">📞 {provider.phone}</Text>
                      </div>
                    )}
                  </Space>
                }
              />
            </Card>
          </List.Item>
        )}
      />

      <Modal
        title={`Получение талона - ${selectedProvider?.name}`}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form form={form} onFinish={handleConfirmTicket} layout="vertical">
          <Form.Item label="Ресурс">
            <Text strong>{selectedProvider?.resource}</Text>
          </Form.Item>

          <Form.Item label="Доступно">
            <Text>{selectedProvider?.available}</Text>
          </Form.Item>

          <Form.Item
            label="Срок действия (дней)"
            name="duration"
            rules={[{ required: true, message: "Выберите срок" }]}
          >
            <Select placeholder="Выберите срок действия">
              <Option value={1}>1 день</Option>
              <Option value={7}>7 дней</Option>
              <Option value={30}>30 дней</Option>
              <Option value={90}>90 дней</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Количество"
            name="quantity"
            rules={[{ required: true, message: "Укажите количество" }]}
          >
            <Select placeholder="Выберите количество">
              <Option value={1}>1</Option>
              <Option value={2}>2</Option>
              <Option value={3}>3</Option>
              <Option value={5}>5</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Получить талон
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProvidersList;
