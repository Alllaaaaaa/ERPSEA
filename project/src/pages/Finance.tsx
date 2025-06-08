import React, { useState } from 'react';
import { Plus, Search, Filter, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import Table from '../components/Common/Table';
import StatusBadge from '../components/Common/StatusBadge';
import StatsCard from '../components/Common/StatsCard';
import { useApp } from '../context/AppContext';
import { Invoice } from '../types';

const Finance: React.FC = () => {
  const { invoices, orders } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Filter and search invoices
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch = invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || invoice.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Sort invoices
  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    if (!sortKey) return 0;
    
    const aValue = a[sortKey as keyof Invoice];
    const bValue = b[sortKey as keyof Invoice];
    
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
    { key: 'id', label: 'Invoice ID', sortable: true },
    { key: 'customerName', label: 'Customer', sortable: true },
    { 
      key: 'amount', 
      label: 'Amount', 
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
    { key: 'createdAt', label: 'Invoice Date', sortable: true },
    { key: 'dueDate', label: 'Due Date', sortable: true },
  ];

  const statuses = ['draft', 'sent', 'paid', 'overdue'];

  // Calculate financial metrics
  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
  const pendingAmount = invoices.filter(i => i.status === 'sent').reduce((sum, i) => sum + i.amount, 0);
  const overdueAmount = invoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Financial Management</h1>
          <p className="text-gray-600">Track invoices, payments, and financial metrics</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Create Invoice</span>
        </button>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          change={{ value: 15.3, type: 'increase' }}
          icon={DollarSign}
          color="green"
        />
        <StatsCard
          title="Pending Payments"
          value={`$${pendingAmount.toLocaleString()}`}
          icon={TrendingUp}
          color="yellow"
        />
        <StatsCard
          title="Overdue Amount"
          value={`$${overdueAmount.toLocaleString()}`}
          icon={TrendingDown}
          color="red"
        />
        <StatsCard
          title="Total Invoices"
          value={invoices.length}
          change={{ value: 8.7, type: 'increase' }}
          icon={DollarSign}
          color="blue"
        />
      </div>

      {/* Invoice Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statuses.map((status) => {
          const statusInvoices = invoices.filter(i => i.status === status);
          const statusValue = statusInvoices.reduce((sum, i) => sum + i.amount, 0);
          return (
            <div key={status} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">
                {status}
              </h3>
              <p className="text-lg font-bold text-gray-900">{statusInvoices.length}</p>
              <p className="text-sm text-green-600 font-medium">${statusValue.toFixed(2)}</p>
            </div>
          );
        })}
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
                placeholder="Search invoices..."
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
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Invoices ({sortedInvoices.length})
          </h2>
        </div>
        <div className="overflow-hidden">
          <Table
            columns={columns}
            data={sortedInvoices}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
        </div>
      </div>
    </div>
  );
};

export default Finance;