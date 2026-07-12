// services/api.ts

import { Provider, Ticket, Seller, SellerFormData } from "../types";
import { mockProviders, mockTickets, mockSellers } from "../utils/mockData";

// Имитация API запросов
class ApiService {
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getProviders(): Promise<Provider[]> {
    await this.delay(500);
    return mockProviders;
  }

  async getProviderById(id: number): Promise<Provider | undefined> {
    await this.delay(300);
    return mockProviders.find((p) => p.id === id);
  }

  async getTickets(): Promise<Ticket[]> {
    await this.delay(500);
    return mockTickets;
  }

  async getTicketsByStatus(status: Ticket["status"]): Promise<Ticket[]> {
    await this.delay(300);
    return mockTickets.filter((t) => t.status === status);
  }

  async getSellers(): Promise<Seller[]> {
    await this.delay(500);
    return mockSellers;
  }

  async createSeller(data: SellerFormData): Promise<Seller> {
    await this.delay(800);
    const newSeller: Seller = {
      id: mockSellers.length + 1,
      ...data,
      status: "active",
      rating: 0,
      ticketsIssued: 0,
      phone: data.phone || "",
    };
    mockSellers.push(newSeller);
    return newSeller;
  }

  async updateSeller(id: number, data: Partial<Seller>): Promise<Seller> {
    await this.delay(600);
    const index = mockSellers.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error("Seller not found");
    }
    mockSellers[index] = { ...mockSellers[index], ...data };
    return mockSellers[index];
  }

  async deleteSeller(id: number): Promise<void> {
    await this.delay(500);
    const index = mockSellers.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error("Seller not found");
    }
    mockSellers.splice(index, 1);
  }

  async toggleSellerStatus(id: number): Promise<Seller> {
    await this.delay(400);
    const seller = mockSellers.find((s) => s.id === id);
    if (!seller) {
      throw new Error("Seller not found");
    }
    seller.status = seller.status === "active" ? "blocked" : "active";
    return seller;
  }

  async createTicket(data: any): Promise<Ticket> {
    await this.delay(600);
    const newTicket: Ticket = {
      id: mockTickets.length + 100,
      ...data,
      status: "pending",
      issueDate: new Date().toISOString().split("T")[0],
    };
    mockTickets.push(newTicket);
    return newTicket;
  }

  async updateTicketStatus(
    id: number,
    status: Ticket["status"],
  ): Promise<Ticket> {
    await this.delay(400);
    const ticket = mockTickets.find((t) => t.id === id);
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    ticket.status = status;
    return ticket;
  }
}

export const apiService = new ApiService();
