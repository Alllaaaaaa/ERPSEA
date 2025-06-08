import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  User, Product, Customer, Lead, Order, Supplier, RFQ, SupplierOffer, 
  PriceComparison, Invoice, ExchangeRate 
} from '../types';
import { 
  mockUsers, mockProducts, mockCustomers, mockLeads, mockOrders, 
  mockSuppliers, mockRFQs, mockSupplierOffers, mockInvoices, mockExchangeRates 
} from '../data/mockData';

interface AppContextType {
  currentUser: User;
  users: User[];
  products: Product[];
  customers: Customer[];
  leads: Lead[];
  orders: Order[];
  suppliers: Supplier[];
  rfqs: RFQ[];
  supplierOffers: SupplierOffer[];
  invoices: Invoice[];
  exchangeRates: ExchangeRate[];
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  addLead: (lead: Omit<Lead, 'id'>) => void;
  updateLead: (id: string, lead: Partial<Lead>) => void;
  addRFQ: (rfq: Omit<RFQ, 'id'>) => void;
  updateRFQ: (id: string, rfq: Partial<RFQ>) => void;
  addSupplierOffer: (offer: Omit<SupplierOffer, 'id'>) => void;
  updateSupplierOffer: (id: string, offer: Partial<SupplierOffer>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [currentUser] = useState<User>(mockUsers[0]);
  const [users] = useState<User[]>(mockUsers);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [orders] = useState<Order[]>(mockOrders);
  const [suppliers] = useState<Supplier[]>(mockSuppliers);
  const [rfqs, setRFQs] = useState<RFQ[]>(mockRFQs);
  const [supplierOffers, setSupplierOffers] = useState<SupplierOffer[]>(mockSupplierOffers);
  const [invoices] = useState<Invoice[]>(mockInvoices);
  const [exchangeRates] = useState<ExchangeRate[]>(mockExchangeRates);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updatedProduct: Partial<Product>) => {
    setProducts(prev => prev.map(product => 
      product.id === id ? { ...product, ...updatedProduct } : product
    ));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const addCustomer = (customer: Omit<Customer, 'id'>) => {
    const newCustomer: Customer = {
      ...customer,
      id: Date.now().toString(),
    };
    setCustomers(prev => [...prev, newCustomer]);
  };

  const updateCustomer = (id: string, updatedCustomer: Partial<Customer>) => {
    setCustomers(prev => prev.map(customer => 
      customer.id === id ? { ...customer, ...updatedCustomer } : customer
    ));
  };

  const addLead = (lead: Omit<Lead, 'id'>) => {
    const newLead: Lead = {
      ...lead,
      id: Date.now().toString(),
    };
    setLeads(prev => [...prev, newLead]);
  };

  const updateLead = (id: string, updatedLead: Partial<Lead>) => {
    setLeads(prev => prev.map(lead => 
      lead.id === id ? { ...lead, ...updatedLead } : lead
    ));
  };

  const addRFQ = (rfq: Omit<RFQ, 'id'>) => {
    const newRFQ: RFQ = {
      ...rfq,
      id: `RFQ-${Date.now()}`,
    };
    setRFQs(prev => [...prev, newRFQ]);
  };

  const updateRFQ = (id: string, updatedRFQ: Partial<RFQ>) => {
    setRFQs(prev => prev.map(rfq => 
      rfq.id === id ? { ...rfq, ...updatedRFQ } : rfq
    ));
  };

  const addSupplierOffer = (offer: Omit<SupplierOffer, 'id'>) => {
    const newOffer: SupplierOffer = {
      ...offer,
      id: `OFF-${Date.now()}`,
    };
    setSupplierOffers(prev => [...prev, newOffer]);
  };

  const updateSupplierOffer = (id: string, updatedOffer: Partial<SupplierOffer>) => {
    setSupplierOffers(prev => prev.map(offer => 
      offer.id === id ? { ...offer, ...updatedOffer } : offer
    ));
  };

  const value: AppContextType = {
    currentUser,
    users,
    products,
    customers,
    leads,
    orders,
    suppliers,
    rfqs,
    supplierOffers,
    invoices,
    exchangeRates,
    sidebarCollapsed,
    setSidebarCollapsed,
    addProduct,
    updateProduct,
    deleteProduct,
    addCustomer,
    updateCustomer,
    addLead,
    updateLead,
    addRFQ,
    updateRFQ,
    addSupplierOffer,
    updateSupplierOffer,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};