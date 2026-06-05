export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  description: string;
  categoryId: string;
  collectionId: string | null;
  sizes: string[];
  colors: ProductColor[];
  stock: number;
  mainImage: string;
  images: string[];
  featured: boolean;
  newArrival: boolean;
  onSale: boolean;
  views: number;
  category: Category;
  collection: Collection | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  size: string;
  color: string;
  image: string;
  quantity: number;
  slug: string;
}

export interface Order {
  id: string;
  customerName: string | null;
  phone: string | null;
  total: number;
  status: OrderStatus;
  whatsappMsg: string | null;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  product: Product;
}

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface AdminStats {
  productCount: number;
  orderCount: number;
  revenue: number;
  userCount: number;
}
