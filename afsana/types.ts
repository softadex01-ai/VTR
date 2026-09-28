
export interface NavItem {
  label: string;
  href: string;
}

export interface HeroContent {
  headline: string;
  subheadline: string;
}

export interface Product {
  id: string;
  title: string;
  price: string;
  category: string;
  description: string;
  images: string[];
  colors: string[];
  sizes: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
}

export interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
  };
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  timestamp: string;
}
