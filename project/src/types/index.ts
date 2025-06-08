export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  department: 'purchase' | 'sales' | 'logistics' | 'finance' | 'management';
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  casNumber?: string;
  category: string;
  description?: string;
  hsCode?: string;
  unit: 'kg' | 'ton' | 'liter' | 'piece';
  status: 'active' | 'inactive';
  lastUpdated: string;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  status: 'active' | 'inactive';
  rating: number;
  totalOrders: number;
  lastOrder?: string;
  preferredCurrency: 'EUR' | 'USD';
  paymentTerms: string;
  specialties: string[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  status: 'active' | 'inactive';
  totalOrders: number;
  totalValue: number;
  lastOrder?: string;
}

export interface RFQItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  originCountry?: string;
  packaging?: string;
  specifications?: string;
}

export interface RFQ {
  id: string;
  title: string;
  type: 'client-order' | 'commercial-request' | 'quote-request';
  customerId?: string;
  customerName?: string;
  items: RFQItem[];
  targetSuppliers: string[];
  status: 'draft' | 'sent' | 'responses-received' | 'under-negotiation' | 'completed' | 'cancelled';
  createdAt: string;
  deadline?: string;
  notes?: string;
  createdBy: string;
}

export interface SupplierOffer {
  id: string;
  rfqId: string;
  supplierId: string;
  supplierName: string;
  currency: 'EUR' | 'USD';
  items: OfferItem[];
  containerInfo: {
    numberOfContainers: number;
    containerType: '20ft' | '40ft';
    totalWeight?: number;
  };
  freightPrice: number;
  validUntil: string;
  paymentTerms: string;
  deliveryTerms: string;
  status: 'pending' | 'received' | 'under-review' | 'negotiating' | 'accepted' | 'rejected';
  submittedAt?: string;
  notes?: string;
  negotiationRounds: NegotiationRound[];
}

export interface OfferItem {
  productId: string;
  productName: string;
  quantity: number;
  exwPrice: number;
  cfrPrice: number;
  packaging: string;
  originCountry: string;
}

export interface NegotiationRound {
  id: string;
  round: number;
  requestedPrice: number;
  supplierResponse?: number;
  status: 'pending' | 'accepted' | 'rejected' | 'counter-offered';
  notes?: string;
  createdAt: string;
}

export interface PriceComparison {
  rfqId: string;
  offers: ComparativeOffer[];
  exchangeRates: {
    EUR: number;
    USD: number;
  };
  customsDuties: number;
  taxes: number;
  additionalFees: number;
  createdAt: string;
}

export interface ComparativeOffer {
  offerId: string;
  supplierId: string;
  supplierName: string;
  currency: 'EUR' | 'USD';
  totalOriginalPrice: number;
  totalDzdPrice: number;
  pricePerUnit: number;
  ranking: number;
  selected: boolean;
}

export interface Order {
  id: string;
  rfqId: string;
  customerId?: string;
  customerName?: string;
  supplierId: string;
  supplierName: string;
  items: OrderItem[];
  total: number;
  currency: 'EUR' | 'USD' | 'DZD';
  status: 'preparation' | 'booked-transport' | 'in-transport' | 'at-port' | 'in-transit' | 'received' | 'cancelled';
  createdAt: string;
  expectedDelivery?: string;
  trackingInfo?: TrackingInfo;
  documents: OrderDocument[];
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface TrackingInfo {
  bookingReference?: string;
  vesselName?: string;
  departurePort?: string;
  arrivalPort?: string;
  estimatedDeparture?: string;
  estimatedArrival?: string;
  actualDeparture?: string;
  actualArrival?: string;
}

export interface OrderDocument {
  id: string;
  name: string;
  type: 'invoice' | 'packing-list' | 'certificate' | 'bill-of-lading' | 'customs' | 'other';
  url?: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface ExchangeRate {
  currency: 'EUR' | 'USD';
  rate: number;
  lastUpdated: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  value: number;
  assignedTo: string;
  createdAt: string;
  notes?: string;
}

export interface Invoice {
  id: string;
  customerId: string;
  customerName: string;
  orderId: string;
  amount: number;
  currency: 'DZD';
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  dueDate: string;
  createdAt: string;
}