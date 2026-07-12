import React, { createContext, useState, useContext, ReactNode } from "react";
import { message } from "antd";
import { User, UserRole, AuthContextType } from "../types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Mock users database
const mockUsers: Record<string, User> = {
  consumer: {
    id: 1,
    name: "Иван Петров",
    email: "consumer@mail.com",
    role: "consumer",
  },
  seller: {
    id: 2,
    name: "Мария Смирнова",
    email: "seller@mail.com",
    role: "seller",
  },
  admin: {
    id: 3,
    name: "Алексей Иванов",
    email: "admin@mail.com",
    role: "admin",
  },
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = (email: string, password: string, role: UserRole) => {
    setIsLoading(true);

    console.log("Был произведен вход с параметрами: ");
    console.log("Логин - " + email);
    console.log("Пароль - " + password);

    // Имитация API запроса
    setTimeout(() => {
      const userData = mockUsers[role];
      if (userData) {
        setUser(userData);
        message.success(`Добро пожаловать, ${userData.name}!`);
      } else {
        message.error("Пользователь не найден");
      }
      setIsLoading(false);
    }, 1000);
  };

  const logout = () => {
    setUser(null);
    message.info("Вы вышли из системы");
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
