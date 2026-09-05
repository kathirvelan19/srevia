declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  badge?: string;
  description: string;
  stockQuantity: number;
  image: string;
  benefits: string[];
  ingredients: IngredientItem[];
  active: boolean;
}

export interface IngredientItem {
  name: string;
  shortDesc: string;
  traditionalSignificance: string;
  skincareRole: string;
  image?: string;
}

export * from './order';

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
  createdAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  adminEmail: string | null;
}
