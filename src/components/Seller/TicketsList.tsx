import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Select,
  Tag,
  Space,
  Button,
  DatePicker,
  Statistic,
  Row,
  Col,
  Input,
  Modal,
  Form,
  message,
  Skeleton,
} from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  TicketOutlined
} from "../../components/Icons";
import { apiService } from "../../services/api";
import { Ticket } from "../../types";

const { RangePicker } = DatePicker;
const { Option } = Select;

interface TicketFormData {
  userName: string;
  resource: string;
  expiryDate: string;
  quantity: number;
}

const TicketsList: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchText, setSearchText] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm<TicketFormData>();

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const data = await apiService.getTickets();
      setTickets(data);
    } catch (error) {
      message.error("Ошибка загрузки талонов");
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (status: Ticket["status"]) => {
    const map = {
      active: {
        color: "green",
        text: "Активен",
        icon: <CheckCircleOutlined />,
      },
      pending: {
        color: "orange",
        text: "Ожидает",
        icon: <ClockCircleOutlined />,
      },
      expired: {
        color: "red",
        text: "Просрочен",
        icon: <ExclamationCircleOutlined />,
      },
    };
    return map[status] || map.pending;
  };

  const handleConfirmTicket = async (id: number) => {
    try {
      await apiService.updateTicketStatus(id, "active");
      message.success(`Талон #${id} подтвержден`);
      loadTickets();
    } catch (error) {
      message.error("Ошибка подтверждения талона");
    }
  };

  const handleCreateTicket = async (values: TicketFormData) => {
    try {
      await apiService.createTicket({
        ...values,
        userName: values.userName,
        provider: "Текущий продавец",
        issueDate: new Date().toISOString().split("T")[0],
        status: "pending",
      });
      message.success("Талон успешно создан!");
      setModalVisible(false);
      form.resetFields();
      loadTickets();
    } catch (error) {
      message.error("Ошибка создания талона");
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    const statusMatch =
      filterStatus === "all" || ticket.status === filterStatus;
    const searchMatch =
      ticket.userName.toLowerCase().includes(searchText.toLowerCase()) ||
      ticket.resource.toLowerCase().includes(searchText.toLowerCase());
    return statusMatch && searchMatch;
  });

  const columns = [
    {
      title: "№ талона",
      dataIndex: "id",
      key: "id",
      render: (id: number) => <Tag color="blue">#{id}</Tag>,
    },
    {
      title: "Покупатель",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Ресурс",
      dataIndex: "resource",
      key: "resource",
      render: (resource: string) => <Tag color="cyan">{resource}</Tag>,
    },
    {
      title: "Кол-во",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity?: number) => quantity || 1,
    },
    {
      title: "Статус",
      dataIndex: "status",
      key: "status",
      render: (status: Ticket["status"]) => {
        const { color, text, icon } = getStatusTag(status);
        return (
          <Tag icon={icon} color={color}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: "Дата выдачи",
      dataIndex: "issueDate",
      key: "issueDate",
    },
    {
      title: "Срок действия",
      dataIndex: "expiryDate",
      key: "expiryDate",
    },
    {
      title: "Действия",
      key: "action",
      render: (_: any, record: Ticket) => (
        <Space>
          {record.status === "pending" && (
            <Button
              type="primary"
              size="small"
              onClick={() => handleConfirmTicket(record.id)}
            >
              Подтвердить
            </Button>
          )}
          <Button
            size="small"
            onClick={() => {
              message.info(`Информация по талону #${record.id}`);
            }}
          >
            Детали
          </Button>
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
              title="Всего талонов"
              value={tickets.length}
              prefix={<TicketOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Активные"
              value={tickets.filter((t) => t.status === "active").length}
              valueStyle={{ color: "#3f8600" }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Ожидают"
              value={tickets.filter((t) => t.status === "pending").length}
              valueStyle={{ color: "#faad14" }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Просрочено"
              value={tickets.filter((t) => t.status === "expired").length}
              valueStyle={{ color: "#cf1322" }}
              prefix={<ExclamationCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <Space
          style={{ marginBottom: 16, display: "flex", flexWrap: "wrap" }}
          size="middle"
        >
          <Select
            style={{ width: 150 }}
            value={filterStatus}
            onChange={setFilterStatus}
          >
            <Option value="all">Все статусы</Option>
            <Option value="active">Активные</Option>
            <Option value="pending">Ожидают</Option>
            <Option value="expired">Просроченные</Option>
          </Select>

          <Input
            placeholder="Поиск по покупателю или ресурсу"
            prefix={<SearchOutlined />}
            style={{ width: 250 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />

          <RangePicker />

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
          >
            Выдать талон
          </Button>
        </Space>

        <Table
          columns={columns}
          dataSource={filteredTickets}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Card>

      <Modal
        title="Выдача нового талона"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateTicket}>
          <Form.Item
            label="Покупатель"
            name="userName"
            rules={[{ required: true, message: "Выберите покупателя" }]}
          >
            <Select placeholder="Выберите покупателя">
              <Option value="Иван Петров">Иван Петров</Option>
              <Option value="Сергей Иванов">Сергей Иванов</Option>
              <Option value="Анна Сидорова">Анна Сидорова</Option>
              <Option value="Петр Смирнов">Петр Смирнов</Option>
            </Select>
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
            label="Срок действия"
            name="expiryDate"
            rules={[{ required: true, message: "Выберите дату" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Количество" name="quantity" initialValue={1}>
            <Select>
              <Option value={1}>1</Option>
              <Option value={2}>2</Option>
              <Option value={3}>3</Option>
              <Option value={5}>5</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Выдать талон
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TicketsList;
