import React, { useState, useEffect } from "react";
import {
  Card,
  Select,
  Space,
  Tag,
  Avatar,
  Rate,
  Button,
  message,
  Skeleton,
  Badge,
} from "antd";
import {
  EnvironmentOutlined,
  ShopOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { apiService } from "../../services/api";
import { Provider } from "../../types";

const { Option } = Select;

const ProvidersMap: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>("all");
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null,
  );

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

  const resources = [...new Set(providers.map((p) => p.resource))];

  const filteredProviders =
    filter === "all"
      ? providers
      : providers.filter((p) => p.resource === filter);

  const handleSelectProvider = (provider: Provider) => {
    setSelectedProvider(provider);
    message.success(`Вы выбрали поставщика "${provider.name}"`);
  };

  if (loading) {
    return <Skeleton active paragraph={{ rows: 8 }} />;
  }

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Space size="middle" wrap>
          <span>
            <EnvironmentOutlined /> Фильтр по ресурсу:
          </span>
          <Select style={{ width: 200 }} value={filter} onChange={setFilter}>
            <Option value="all">Все ресурсы</Option>
            {resources.map((r) => (
              <Option key={r} value={r}>
                {r}
              </Option>
            ))}
          </Select>
          <Tag color="blue">Найдено: {filteredProviders.length}</Tag>
          <Tag color="green">
            Активных:{" "}
            {filteredProviders.filter((p) => p.status === "active").length}
          </Tag>
        </Space>
      </Card>

      {/* Имитация карты */}
      <div
        style={{
          background: "#f0f2f5",
          padding: 20,
          borderRadius: 8,
          minHeight: 500,
          position: "relative",
          border: "1px solid #d9d9d9",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 16,
          }}
        >
          {filteredProviders.map((provider, index) => (
            <Card
              key={provider.id}
              hoverable
              style={{
                margin: index % 2 === 0 ? "0 20px 20px 0" : "20px 0 20px 20px",
                cursor: "pointer",
                border:
                  selectedProvider?.id === provider.id
                    ? "2px solid #1890ff"
                    : undefined,
              }}
              onClick={() => handleSelectProvider(provider)}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <Avatar
                  icon={<ShopOutlined />}
                  style={{ backgroundColor: "#1890ff", marginRight: 12 }}
                />
                <div>
                  <div style={{ fontWeight: "bold" }}>{provider.name}</div>
                  <Badge
                    status={provider.status === "active" ? "success" : "error"}
                    text={provider.status === "active" ? "Работает" : "Закрыт"}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 8 }}>
                <EnvironmentOutlined /> {provider.address}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Space>
                  <Rate
                    disabled
                    defaultValue={provider.rating}
                    style={{ fontSize: 14 }}
                  />
                  <span>({provider.rating})</span>
                </Space>
                <Tag color="blue">{provider.resource}</Tag>
              </div>

              <div
                style={{
                  marginTop: 8,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>
                  <ClockCircleOutlined /> {provider.workTime}
                </span>
                <span style={{ fontWeight: "bold", color: "#1890ff" }}>
                  {provider.price}₽
                </span>
              </div>

              {provider.phone && (
                <div style={{ marginTop: 4, fontSize: 12, color: "#999" }}>
                  📞 {provider.phone}
                </div>
              )}
            </Card>
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 20,
            right: 20,
            background: "white",
            padding: "8px 16px",
            borderRadius: 4,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          <Space>
            <EnvironmentOutlined style={{ color: "#1890ff" }} />
            <span>{filteredProviders.length} поставщиков</span>
          </Space>
        </div>
      </div>

      {selectedProvider && (
        <Card style={{ marginTop: 16 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div>
              <h3>{selectedProvider.name}</h3>
              <p>
                <EnvironmentOutlined /> {selectedProvider.address}
              </p>
              <p>
                Ресурс: <Tag color="blue">{selectedProvider.resource}</Tag>
              </p>
              <p>
                Цена: <strong>{selectedProvider.price}₽</strong>
              </p>
            </div>
            <Button
              type="primary"
              size="large"
              onClick={() => {
                message.success(`Талон от ${selectedProvider.name} получен!`);
                setSelectedProvider(null);
              }}
              disabled={selectedProvider.status === "blocked"}
            >
              Получить талон
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ProvidersMap;
