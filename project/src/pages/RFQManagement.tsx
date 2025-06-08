import React, { useState } from 'react';
import { Plus, Search, Filter, Eye, Edit, Send, MessageSquare } from 'lucide-react';
import Table from '../components/Common/Table';
import StatusBadge from '../components/Common/StatusBadge';
import { useApp } from '../context/AppContext';
import { RFQ } from '../types';

const RFQManagement: React.FC = () => {
  const { rfqs } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Filter and search RFQs
  const filteredRFQs = rfqs.filter((rfq) => {
    const matchesSearch = rfq.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rfq.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (rfq.customerName && rfq.customerName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || rfq.status === filterStatus;
    const matchesType = filterType === 'all' || rfq.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Sort RFQs
  const sortedRFQs = [...filteredRFQs].sort((a, b) => {
    if (!sortKey) return 0;
    
    const aValue = a[sortKey as keyof RFQ];
    const bValue = b[sortKey as keyof RFQ];
    
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
    { key: 'id', label: 'RFQ ID', sortable: true },
    { key: 'title', label: 'Title', sortable: true },
    { 
      key: 'type', 
      label: 'Type',
      render: (value: string) => (
        <span className="capitalize text-sm font-medium text-gray-600">
          {value.replace('-', ' ')}
        </span>
      )
    },
    { 
      key: 'customerName', 
      label: 'Customer',
      render: (value: string) => value || 'Internal Request'
    },
    { 
      key: 'items', 
      label: 'Products',
      render: (value: any[]) => (
        <span className="text-gray-600">{value.length} product(s)</span>
      )
    },
    { 
      key: 'targetSuppliers', 
      label: 'Suppliers',
      render: (value: string[]) => (
        <span className="text-gray-600">{value.length} supplier(s)</span>
      )
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (value: string) => <StatusBadge status={value} />
    },
    { key: 'createdAt', label: 'Created', sortable: true },
    { key: 'deadline', label: 'Deadline', sortable: true },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: any, row: RFQ) => (
        <div className="flex items-center space-x-2">
          <button className="text-blue-600 hover:text-blue-700 p-1">
            <Eye className="h-4 w-4" />
          </button>
          <button className="text-green-600 hover:text-green-700 p-1">
            <Edit className="h-4 w-4" />
          </button>
          {row.status === 'draft' && (
            <button className="text-purple-600 hover:text-purple-700 p-1">
              <Send className="h-4 w-4" />
            </button>
          )}
        </div>
      )
    },
  ];

  const statuses = ['draft', 'sent', 'responses-received', 'under-negotiation', 'completed', 'cancelled'];
  const types = ['client-order', 'commercial-request', 'quote-request'];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">RFQ Management</h1>
          <p className="text-gray-600">Manage Request for Quotations and supplier responses</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Create RFQ</span>
        </button>
      </div>

      {/* RFQ Stats */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {statuses.map((status) => {
          const statusRFQs = rfqs.filter(r => r.status === status);
          return (
            <div key={status} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">
                {status.replace('-', ' ')}
              </h3>
              <p className="text-lg font-bold text-gray-900">{statusRFQs.length}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center space-x-3">
            <MessageSquare className="h-8 w-8" />
            <div>
              <h3 className="text-lg font-semibold">Client Order RFQ</h3>
              <p className="text-blue-100">Create RFQ from customer order</p>
            </div>
          </div>
          <button className="mt-4 bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
            Create Now
          </button>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center space-x-3">
            <MessageSquare className="h-8 w-8" />
            <div>
              <h3 className="text-lg font-semibold">Commercial Request</h3>
              <p className="text-green-100">Internal sales team request</p>
            </div>
          </div>
          <button className="mt-4 bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors">
            Create Now
          </button>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center space-x-3">
            <MessageSquare className="h-8 w-8" />
            <div>
              <h3 className="text-lg font-semibold">Quote Request</h3>
              <p className="text-purple-100">General price inquiry</p>
            </div>
          </div>
          <button className="mt-4 bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors">
            Create Now
          </button>
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
                placeholder="Search RFQs..."
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

          {/* Type Filter */}
          <div className="flex items-center space-x-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {type.replace('-', ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* RFQs Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            RFQs ({sortedRFQs.length})
          </h2>
        </div>
        <div className="overflow-hidden">
          <Table
            columns={columns}
            data={sortedRFQs}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
        </div>
      </div>
    </div>
  );
};

export default RFQManagement;