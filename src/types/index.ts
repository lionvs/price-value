export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  categorySlug: string;
  subcategory: string;
  price: number;
  salePrice: number | null;
  rating: number;
  reviewCount: number;
  description: string;
  features: string[];
  specs: Record<string, string>;
  images: string[];
  inStock: boolean;
  sku: string;
  tags: string[];
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  image: string;
  subcategories: string[];
  icon: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  avatar: string;
}

export interface CartItem {
  productId: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  image: string;
  slug: string;
  categorySlug: string;
}

export interface Cart {
  items: CartItem[];
  updatedAt: string;
}

export interface Order {
  orderId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: User["address"];
  paymentLast4: string;
  placedAt: string;
}

export interface AuthSession {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  loggedInAt: string;
}
