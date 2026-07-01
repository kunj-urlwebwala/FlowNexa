export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  rating: number;
  reviewCount: number;
  colors?: string[]; // Hex codes or names
  sizes?: string[]; // S, M, L, XL etc.
  inStock: boolean;
  featured?: boolean;
  trending?: boolean;
  description: string;
  specifications: Record<string, string>;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  title?: string;
}
