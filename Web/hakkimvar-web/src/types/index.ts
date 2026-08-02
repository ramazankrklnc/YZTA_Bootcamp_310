export interface User {
  id: string;
  fullName: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user?: User;
}

export interface RiskItem {
  type: string;
  description: string;
}

export interface ContractResponse {
  success?: boolean;
  riskScore: number;
  summary: string;
  risks: RiskItem[];
  recommendations: string[];
}

export interface Message {
  id: number;
  sessionId: number;
  isUser: boolean;
  content: string;
  createdAt: string;
}

export interface ChatSession {
  id: number;
  title: string;
  createdAt: string;
}

export interface PetitionResponse {
  petition: string;
  missingFields: string[];
}