import { 
  User, Product, Customer, Lead, Order, Supplier, RFQ, SupplierOffer, 
  PriceComparison, Invoice, ExchangeRate 
} from '../types';

export const mockUsers: User[] = [
  { id: '1', name: 'Ahmed Benali', email: 'ahmed@chemimport.dz', role: 'admin', department: 'management' },
  { id: '2', name: 'Fatima Khelil', email: 'fatima@chemimport.dz', role: 'manager', department: 'purchase' },
  { id: '3', name: 'Omar Meziane', email: 'omar@chemimport.dz', role: 'employee', department: 'sales' },
  { id: '4', name: 'Amina Boudjema', email: 'amina@chemimport.dz', role: 'employee', department: 'logistics' },
  { id: '5', name: 'Karim Hadj', email: 'karim@chemimport.dz', role: 'employee', department: 'finance' },
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Titanium Dioxide',
    casNumber: '13463-67-7',
    category: 'Pigments',
    description: 'White pigment for paints and coatings',
    hsCode: '2823.00.10',
    unit: 'ton',
    status: 'active',
    lastUpdated: '2024-01-15'
  },
  {
    id: '2',
    name: 'Polyethylene Glycol',
    casNumber: '25322-68-3',
    category: 'Polymers',
    description: 'Industrial grade polymer',
    hsCode: '3907.20.00',
    unit: 'kg',
    status: 'active',
    lastUpdated: '2024-01-14'
  },
  {
    id: '3',
    name: 'Sodium Hydroxide',
    casNumber: '1310-73-2',
    category: 'Alkalis',
    description: 'Caustic soda flakes 99%',
    hsCode: '2815.11.00',
    unit: 'ton',
    status: 'active',
    lastUpdated: '2024-01-13'
  },
];

export const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'ChemEurope GmbH',
    email: 'sales@chemeurope.de',
    phone: '+49-40-123456',
    address: 'Hamburg, Germany',
    country: 'Germany',
    status: 'active',
    rating: 4.8,
    totalOrders: 25,
    lastOrder: '2024-01-05',
    preferredCurrency: 'EUR',
    paymentTerms: 'LC at sight',
    specialties: ['Pigments', 'Polymers']
  },
  {
    id: '2',
    name: 'Global Chemicals Ltd',
    email: 'export@globalchem.com',
    phone: '+44-20-987654',
    address: 'London, UK',
    country: 'United Kingdom',
    status: 'active',
    rating: 4.6,
    totalOrders: 18,
    lastOrder: '2024-01-03',
    preferredCurrency: 'EUR',
    paymentTerms: 'TT 30 days',
    specialties: ['Alkalis', 'Acids']
  },
  {
    id: '3',
    name: 'American Chemical Corp',
    email: 'international@amchem.com',
    phone: '+1-713-555-0123',
    address: 'Houston, TX, USA',
    country: 'United States',
    status: 'active',
    rating: 4.7,
    totalOrders: 22,
    lastOrder: '2023-12-28',
    preferredCurrency: 'USD',
    paymentTerms: 'LC 90 days',
    specialties: ['Polymers', 'Specialty Chemicals']
  },
];

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Algerian Paints Industries',
    email: 'procurement@api.dz',
    phone: '+213-21-123456',
    company: 'Algerian Paints Industries',
    address: 'Algiers, Algeria',
    status: 'active',
    totalOrders: 15,
    totalValue: 2500000,
    lastOrder: '2024-01-10'
  },
  {
    id: '2',
    name: 'Sonatrach Petrochemicals',
    email: 'supply@sonatrach.dz',
    phone: '+213-21-654321',
    company: 'Sonatrach Petrochemicals',
    address: 'Arzew, Algeria',
    status: 'active',
    totalOrders: 8,
    totalValue: 5200000,
    lastOrder: '2024-01-08'
  },
];

export const mockRFQs: RFQ[] = [
  {
    id: 'RFQ-2024-001',
    title: 'Titanium Dioxide for Q1 Production',
    type: 'client-order',
    customerId: '1',
    customerName: 'Algerian Paints Industries',
    items: [
      {
        id: '1',
        productId: '1',
        productName: 'Titanium Dioxide',
        quantity: 50,
        unit: 'ton',
        originCountry: 'Germany',
        packaging: '25kg bags',
        specifications: 'Rutile grade, 94% min purity'
      }
    ],
    targetSuppliers: ['1', '2'],
    status: 'responses-received',
    createdAt: '2024-01-10',
    deadline: '2024-01-20',
    createdBy: 'Fatima Khelil'
  },
  {
    id: 'RFQ-2024-002',
    title: 'Mixed Chemicals Order',
    type: 'commercial-request',
    items: [
      {
        id: '1',
        productId: '2',
        productName: 'Polyethylene Glycol',
        quantity: 5000,
        unit: 'kg',
        packaging: 'IBC tanks'
      },
      {
        id: '2',
        productId: '3',
        productName: 'Sodium Hydroxide',
        quantity: 20,
        unit: 'ton',
        packaging: '25kg bags'
      }
    ],
    targetSuppliers: ['1', '3'],
    status: 'sent',
    createdAt: '2024-01-12',
    deadline: '2024-01-25',
    createdBy: 'Omar Meziane'
  }
];

export const mockSupplierOffers: SupplierOffer[] = [
  {
    id: 'OFF-001',
    rfqId: 'RFQ-2024-001',
    supplierId: '1',
    supplierName: 'ChemEurope GmbH',
    currency: 'EUR',
    items: [
      {
        productId: '1',
        productName: 'Titanium Dioxide',
        quantity: 50,
        exwPrice: 2800,
        cfrPrice: 2950,
        packaging: '25kg bags on pallets',
        originCountry: 'Germany'
      }
    ],
    containerInfo: {
      numberOfContainers: 2,
      containerType: '20ft',
      totalWeight: 50000
    },
    freightPrice: 7500,
    validUntil: '2024-02-10',
    paymentTerms: 'LC at sight',
    deliveryTerms: 'CFR Algiers',
    status: 'received',
    submittedAt: '2024-01-15',
    negotiationRounds: []
  },
  {
    id: 'OFF-002',
    rfqId: 'RFQ-2024-001',
    supplierId: '2',
    supplierName: 'Global Chemicals Ltd',
    currency: 'EUR',
    items: [
      {
        productId: '1',
        productName: 'Titanium Dioxide',
        quantity: 50,
        exwPrice: 2750,
        cfrPrice: 2900,
        packaging: '25kg bags on pallets',
        originCountry: 'Belgium'
      }
    ],
    containerInfo: {
      numberOfContainers: 2,
      containerType: '20ft',
      totalWeight: 50000
    },
    freightPrice: 7200,
    validUntil: '2024-02-08',
    paymentTerms: 'TT 30 days',
    deliveryTerms: 'CFR Algiers',
    status: 'received',
    submittedAt: '2024-01-16',
    negotiationRounds: [
      {
        id: 'NEG-001',
        round: 1,
        requestedPrice: 2650,
        supplierResponse: 2700,
        status: 'counter-offered',
        notes: 'Supplier offered 2700 EUR/ton as best price',
        createdAt: '2024-01-17'
      }
    ]
  }
];

export const mockExchangeRates: ExchangeRate[] = [
  { currency: 'EUR', rate: 145.50, lastUpdated: '2024-01-15' },
  { currency: 'USD', rate: 134.20, lastUpdated: '2024-01-15' }
];

export const mockOrders: Order[] = [
  {
    id: 'ORD-2024-001',
    rfqId: 'RFQ-2023-045',
    customerId: '1',
    customerName: 'Algerian Paints Industries',
    supplierId: '2',
    supplierName: 'Global Chemicals Ltd',
    items: [
      {
        productId: '1',
        productName: 'Titanium Dioxide',
        quantity: 30,
        price: 2700,
        total: 81000
      }
    ],
    total: 81000,
    currency: 'EUR',
    status: 'in-transport',
    createdAt: '2023-12-15',
    expectedDelivery: '2024-01-25',
    trackingInfo: {
      bookingReference: 'MSC123456789',
      vesselName: 'MSC MEDITERRANEAN',
      departurePort: 'Antwerp',
      arrivalPort: 'Algiers',
      estimatedDeparture: '2024-01-05',
      estimatedArrival: '2024-01-25',
      actualDeparture: '2024-01-06'
    },
    documents: [
      {
        id: 'DOC-001',
        name: 'Commercial Invoice',
        type: 'invoice',
        uploadedAt: '2023-12-20',
        uploadedBy: 'Fatima Khelil'
      },
      {
        id: 'DOC-002',
        name: 'Packing List',
        type: 'packing-list',
        uploadedAt: '2023-12-20',
        uploadedBy: 'Fatima Khelil'
      }
    ]
  }
];

export const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'Mehdi Benaissa',
    email: 'mehdi@newchem.dz',
    phone: '+213-31-789456',
    company: 'New Chemical Solutions',
    source: 'Trade Fair',
    status: 'qualified',
    value: 800000,
    assignedTo: 'Omar Meziane',
    createdAt: '2024-01-12',
    notes: 'Interested in specialty polymers for automotive industry'
  }
];

export const mockInvoices: Invoice[] = [
  {
    id: 'INV-2024-001',
    customerId: '1',
    customerName: 'Algerian Paints Industries',
    orderId: 'ORD-2024-001',
    amount: 11785500,
    currency: 'DZD',
    status: 'sent',
    dueDate: '2024-02-10',
    createdAt: '2024-01-10'
  }
];