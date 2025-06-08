import React, { useState } from 'react';
import { Plus, Search, Filter, Eye, Truck, MapPin, Calendar, FileText } from 'lucide-react';
import Table from '../components/Common/Table';
import StatusBadge from '../components/Common/StatusBadge';
import { useApp } from '../context/AppContext';
import { Order } from '../types';

const Orders: React.FC = () => {
  const { orders } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Filter and search orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.supplierName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (!sortKey) return 0;
    
    const aValue = a[sortKey as keyof Order];
    const bValue = b[sortKey as keyof Order];
    
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

  const columns = [
    { key: 'id', label: 'Order ID', sortable: true },
    { 
      key: 'customerName', 
      label: 'Customer',
      render: (value: string) => value || 'Internal Order'
    },
    { key: 'supplierName', label: 'Supplier', sortable: true },
    { 
      key: 'items', 
      label: 'Products',
      render: (value: any[]) => (
        <span className="text-gray-600">{value.length} product(s)</span>
      )
    },
    { 
      key: 'total', 
      label: 'Total', 
      sortable: true,
      render: (value: number, row: Order) => (
        <span className="font-medium text-gray-900">
          {value.toLocaleString()} {row.currency}
        </span>
      )
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (value: string) => <StatusBadge status={value} />
    },
    { key: 'createdAt', label: 'Date', sortable: true },
    { key: 'expectedDelivery', label: 'Expected Delivery', sortable: true },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: any, row: Order) => (
        <button 
          onClick={() => setSelectedOrder(row)}
          className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
        >
          <Eye className="h-4 w-4" />
          <span>View</span>
        </button>
      )
    },
  ];

  const statuses = ['preparation', 'booked-transport', 'in-transport', 'at-port', 'in-transit', 'received', 'cancelled'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparation': return 'bg-yellow-100 text-yellow-800';
      case 'booked-transport': return 'bg-blue-100 text-blue-800';
      case 'in-transport': return 'bg-purple-100 text-purple-800';
      case 'at-port': return 'bg-orange-100 text-orange-800';
      case 'in-transit': return 'bg-indigo-100 text-indigo-800';
      case 'received': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Management</h1>
          <p className="text-gray-600">Track import orders from confirmation to delivery</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Create Order</span>
        </button>
      </div>

      {/* Order Status Pipeline */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status Pipeline</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {statuses.map((status) => {
            const statusOrders = orders.filter(o => o.status === status);
            const statusValue = statusOrders.reduce((sum, o) => sum + o.total, 0);
            return (
              <div key={status} className="text-center">
                <div className={`rounded-lg p-4 ${getStatusColor(status)}`}>
                  <h4 className="text-xs font-medium uppercase tracking-wide mb-2">
                    {status.replace('-', ' ')}
                  </h4>
                  <p className="text-lg font-bold">{statusOrders.length}</p>
                  <p className="text-xs font-medium mt-1">
                    {statusValue.toLocaleString()} EUR
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
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
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status.replace('-', ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Orders ({sortedOrders.length})
          </h2>
        </div>
        <div className="overflow-hidden">
          <Table
            columns={columns}
            data={sortedOrders}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Order Details - {selectedOrder.id}</h3>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Order Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-medium">{selectedOrder.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Customer:</span>
                      <span className="font-medium">{selectedOrder.customerName || 'Internal'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Supplier:</span>
                      <span className="font-medium">{selectedOrder.supplierName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total:</span>
                      <span className="font-medium">{selectedOrder.total.toLocaleString()} {selectedOrder.currency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <StatusBadge status={selectedOrder.status} />
                    </div>
                  </div>
                </div>

                {/* Tracking Info */}
                {selectedOrder.trackingInfo && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Truck className="h-4 w-4 mr-2" />
                      Shipping Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Booking Ref:</span>
                        <span className="font-medium">{selectedOrder.trackingInfo.bookingReference}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Vessel:</span>
                        <span className="font-medium">{selectedOrder.trackingInfo.vesselName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Route:</span>
                        <span className="font-medium">
                          {selectedOrder.trackingInfo.departurePort} → {selectedOrder.trackingInfo.arrivalPort}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Est. Arrival:</span>
                        <span className="font-medium">{selectedOrder.trackingInfo.estimatedArrival}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Products */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Products</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 text-sm font-medium text-gray-900">{item.productName}</td>
                          <td className="px-4 py-2 text-sm text-gray-600">{item.quantity}</td>
                          <td className="px-4 py-2 text-sm text-gray-600">{item.price.toLocaleString()}</td>
                          <td className="px-4 py-2 text-sm font-medium text-gray-900">{item.total.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Documents */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Documents
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedOrder.documents.map((doc) => (
                    <div key={doc.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{doc.name}</p>
                          <p className="text-sm text-gray-600 capitalize">{doc.type.replace('-', ' ')}</p>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 text-sm">
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;