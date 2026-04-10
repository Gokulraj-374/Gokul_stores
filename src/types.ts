export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category_id: string;
  category_name: string;
  image_url: string;
  quantity?: number; // Used for shopping cart
  stock: number;    // Used for inventory
  in_stock: boolean;
  reviews?: Review[];
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  photos: string[];
  date: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'placed' | 'processing' | 'out_for_delivery' | 'delivered';
}
export interface StoreSettings {
  storeName: string;
  storeTagline: string;
  mainPhone: string;
  secondaryPhone: string;
  address: string;
  mapsUrl: string;
  hoursMondaySunday: string;
}
