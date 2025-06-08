import React, { useState } from 'react';
import { Plus, Search, Filter, Truck } from 'lucide-react';
import Table from '../components/Common/Table';
import StatusBadge from '../components/Common/StatusBadge';
import { useApp } from '../context/AppContext';
import { PurchaseOrder, Supplier } from '../types';

const Purchase: React.FC = () => {
  const { purchaseOrders, suppliers } = useApp();
  const [activeTab, setActiveTab] = useState<'orders' | 'suppliers'>('orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Purchase Orders Management
  const filteredOrders = purchaseOrders.filter((order) => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.supplierName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (!sortKey) return 0;
    
    const aValue = a[sortKey as keyof PurchaseOrder];
    const bValue = b[sortKey as keyof PurchaseOrder];
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Suppliers Management
  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || supplier.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const sortedSuppliers = [...filteredSuppliers].sort((a, b) => {
    if (!sortKey) return 0;
    
    const aValue = a[sortKey as keyof Supplier];
    const bValue = b[sortKey as keyof Supplier];
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const orderColumns = [
    { key: 'id', label: 'PO Number', sortable: true },
    { key: 'supplierName', label: 'Supplier', sortable: true },
    { 
      key: 'items', 
      label: 'Items',
      render: (value: any[]) => (
        <span className="text-gray-600">{value.length} item(s)</span>
      )
    },
    { 
      key: 'total', 
      label: 'Total', 
      sortable: true,
      render: (value: number) => (
        <span className="font-medium text-gray-900">${value.toFixed(2)}</span>
      )
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (value: string) => <StatusBadge status={value} />
    },
    { key: 'createdAt', label: 'Date', sortable: true },
    { key: 'expectedDelivery', label: 'Expected Delivery', sortable: true },
  ];

  const supplierColumns = [
    { 
      key: 'name', 
      label: 'Supplier', 
      sortable: true,
      render: (value: string, row: Supplier) => (
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center">
            <Truck className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{value}</p>
            <p className="text-sm text-gray-600">{row.email}</p>
          </div>
        </div>
      )
    },
    { key: 'phone', label: 'Phone', sortable: true },
    { 
      key: 'rating', 
      label: 'Rating', 
      sortable: true,
      render: (value: number) => (
        <div className="flex items-center">
          <span className="text-yellow-500 mr-1">★</span>
          <span>{value.toFixed(1)}</span>
        </div>
      )
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (value: string) => <StatusBadge status={value} />
    },
    { key: 'totalOrders', label: 'Orders', sortable: true },
    { key: 'lastOrder', label: 'Last Order', sortable: true },
  ];

  const orderStatuses = ['draft', 'sent', 'received', 'cancelled'];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Purchase Management</h1>
          <p className="text-gray-600">Manage purchase orders and supplier relationships</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>{activeTab === 'orders' ? 'Create PO' : 'Add Supplier'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'orders'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Purchase Orders
          </button>
          <button
            onClick={() => setActiveTab('suppliers')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'suppliers'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Suppliers
          </button>
        </nav>
      </div>

      {/* Stats Overview */}
      {activeTab === 'orders' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {orderStatuses.map((status) => {
            const statusOrders = purchaseOrders.filter(o => o.status === status);
            const statusValue = statusOrders.reduce((sum, o) => sum + o.total, 0);
            return (
              <div key={status} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">
                  {status}
                </h3>
                <p className="text-lg font-bold text-gray-900">{statusOrders.length}</p>
                <p className="text-sm text-green-600 font-medium">${statusValue.toFixed(2)}</p>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'suppliers' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Suppliers</h3>
            <p className="text-2xl font-bold text-gray-900">{suppliers.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Active Suppliers</h3>
            <p className="text-2xl font-bold text-green-600">
              {suppliers.filter(s => s.status === 'active').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Average Rating</h3>
            <p className="text-2xl font-bold text-yellow-600">
              {(suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length).toFixed(1)}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-600" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              {activeTab === 'orders' ? (
                orderStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))
              ) : (
                <>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </>
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {activeTab === 'orders' 
              ? `Purchase Orders (${sortedOrders.length})`
              : `Suppliers (${sortedSuppliers.length})`
            }
          </h2>
        </div>
        <div className="overflow-hidden">
          <Table
            columns={activeTab === 'orders' ? orderColumns : supplierColumns}
            data={activeTab === 'orders' ? sortedOrders : sortedSuppliers}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
        </div>
      </div>
    </div>
  );
};

export default Purchase;