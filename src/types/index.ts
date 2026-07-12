// types/index.ts

export type UserRole = "consumer" | "seller" | "admin";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface Provider {
  id: number;
  name: string;
  address: string;
  resource: string;
  available: number;
  price: number;
  rating: number;
  status: "active" | "blocked";
  workTime: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  phone?: string;
  email?: string;
}

export interface Ticket {
  id: number;
  userName: string;
  resource: string;
  status: "active" | "pending" | "expired";
  issueDate: string;
  expiryDate: string;
  provider: string;
  quantity?: number;
}

export interface Seller {
  id: number;
  name: string;
  email: string;
  resource: string;
  status: "active" | "blocked";
  address: string;
  phone: string;
  rating: number;
  ticketsIssued: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role: UserRole;
}

export interface TicketFormData {
  duration: number;
  quantity: number;
}

export interface SellerFormData {
  name: string;
  email: string;
  resource: string;
  address: string;
  phone?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => void;
  logout: () => void;
  isLoading: boolean;
}
