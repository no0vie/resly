import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  Avatar,
  Statistic,
  Row,
  Col,
  Skeleton,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  UserOutlined,
  ShopOutlined,
  EyeOutlined,
  TeamOutlined,
  StopOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { apiService } from "../../services/api";
import { Seller, SellerFormData } from "../../types";

const { Option } = Select;

const SellersManagement: React.FC = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingSeller, setEditingSeller] = useState<Seller | null>(null);
  const [form] = Form.useForm<SellerFormData>();

  useEffect(() => {
    loadSellers();
  }, []);

  const loadSellers = async () => {
    setLoading(true);
    try {
      const data = await apiService.getSellers();
      setSellers(data);
    } catch (error) {
      message.error("Ошибка загрузки продавцов");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSeller = async (values: SellerFormData) => {
    try {
      const newSeller = await apiService.createSeller(values);
      setSellers([...sellers, newSeller]);
      message.success("Продавец успешно добавлен!");
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error("Ошибка добавления продавца");
    }
  };

  const handleDeleteSeller = async (id: number) => {
    try {
      await apiService.deleteSeller(id);
      setSellers(sellers.filter((s) => s.id !== id));
      message.success("Продавец удален");
    } catch (error) {
      message.error("Ошибка удаления продавца");
    }
  };

  const handleToggleBlock = async (id: number) => {
    try {
      const updated = await apiService.toggleSellerStatus(id);
      setSellers(sellers.map((s) => (s.id === id ? updated : s)));
      message.success(
        `Продавец ${updated.status === "active" ? "разблокирован" : "заблокирован"}`,
      );
    } catch (error) {
      message.error("Ошибка изменения статуса");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (id: number) => <Tag color="blue">#{id}</Tag>,
    },
    {
      title: "Продавец",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: Seller) => (
        <Space>
          <Avatar
            icon={<UserOutlined />}
            style={{ backgroundColor: "#1890ff" }}
          />
          <div>
            <div>{name}</div>
            <div style={{ fontSize: 12, color: "#999" }}>{record.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: "Ресурс",
      dataIndex: "resource",
      key: "resource",
      render: (resource: string) => <Tag color="cyan">{resource}</Tag>,
    },
    {
      title: "Статус",
      dataIndex: "status",
      key: "status",
      render: (status: Seller["status"]) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status === "active" ? "Активен" : "Заблокирован"}
        </Tag>
      ),
    },
    {
      title: "Рейтинг",
      dataIndex: "rating",
      key: "rating",
      render: (rating: number) => `${rating} ⭐`,
    },
    {
      title: "Выдано талонов",
      dataIndex: "ticketsIssued",
      key: "ticketsIssued",
    },
    {
      title: "Действия",
      key: "actions",
      render: (_: any, record: Seller) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => message.info(`Информация о продавце ${record.name}`)}
          >
            Просмотр
          </Button>
          <Popconfirm
            title={
              record.status === "active"
                ? "Заблокировать продавца?"
                : "Разблокировать продавца?"
            }
            onConfirm={() => handleToggleBlock(record.id)}
            okText="Да"
            cancelText="Нет"
          >
            <Button
              danger={record.status === "active"}
              size="small"
              icon={
                record.status === "active" ? (
                  <StopOutlined />
                ) : (
                  <CheckOutlined />
                )
              }
            >
              {record.status === "active" ? "Заблокировать" : "Разблокировать"}
            </Button>
          </Popconfirm>
          <Popconfirm
            title="Удалить продавца?"
            description="Это действие нельзя отменить"
            onConfirm={() => handleDeleteSeller(record.id)}
            okText="Да"
            cancelText="Нет"
          >
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (loading) {
    return <Skeleton active paragraph={{ rows: 8 }} />;
  }

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Всего продавцов"
              value={sellers.length}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Активных"
              value={sellers.filter((s) => s.status === "active").length}
              valueStyle={{ color: "#3f8600" }}
              prefix={<ShopOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Заблокированных"
              value={sellers.filter((s) => s.status === "blocked").length}
              valueStyle={{ color: "#cf1322" }}
              prefix={<StopOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Средний рейтинг"
              value={
                sellers.reduce((acc, s) => acc + s.rating, 0) /
                  sellers.length || 0
              }
              precision={1}
              suffix="⭐"
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <div
          style={{
            marginBottom: 16,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <Space>
            <Input.Search
              placeholder="Поиск по имени"
              style={{ width: 250 }}
              onSearch={(value) => {
                console.log("Выполняется поиск по имени: " + value);
              }}
            />
            <Select placeholder="Фильтр по статусу" style={{ width: 150 }}>
              <Option value="all">Все</Option>
              <Option value="active">Активные</Option>
              <Option value="blocked">Заблокированные</Option>
            </Select>
          </Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingSeller(null);
              form.resetFields();
              setModalVisible(true);
            }}
          >
            Добавить продавца
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={sellers}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Card>

      <Modal
        title={
          editingSeller ? "Редактировать продавца" : "Добавить нового продавца"
        }
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleAddSeller}>
          <Form.Item
            label="Имя продавца"
            name="name"
            rules={[{ required: true, message: "Введите имя" }]}
          >
            <Input placeholder="Иванов Иван" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Введите email" },
              { type: "email", message: "Некорректный email" },
            ]}
          >
            <Input placeholder="seller@mail.com" />
          </Form.Item>

          <Form.Item
            label="Ресурс"
            name="resource"
            rules={[{ required: true, message: "Выберите ресурс" }]}
          >
            <Select placeholder="Выберите ресурс">
              <Option value="Вода">Вода</Option>
              <Option value="Электричество">Электричество</Option>
              <Option value="Газ">Газ</Option>
              <Option value="Тепло">Тепло</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Адрес"
            name="address"
            rules={[{ required: true, message: "Введите адрес" }]}
          >
            <Input placeholder="ул. Примерная, д. 1" />
          </Form.Item>

          <Form.Item label="Телефон" name="phone">
            <Input placeholder="+7 (999) 123-45-67" />
          </Form.Item>

          <Form.Item>
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button
                onClick={() => {
                  setModalVisible(false);
                  form.resetFields();
                }}
              >
                Отмена
              </Button>
              <Button type="primary" htmlType="submit">
                {editingSeller ? "Сохранить" : "Добавить"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SellersManagement;
