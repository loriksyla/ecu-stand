export interface OrderFormData {
  firstName: string;
  lastName: string;
  country: string;
  city: string;
  address: string;
  phoneNumber: string;
  email: string;
  quantity: number;
}

export interface Order extends OrderFormData {
  id: string;
  date: string;
  status: 'Pending' | 'Packed' | 'Shipped' | 'Delivered' | 'Canceled';
}

export interface FeatureItem {
  title: string;
  description: string;
  icon: any;
}

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
}