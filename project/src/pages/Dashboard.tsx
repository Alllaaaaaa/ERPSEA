import React from 'react';
import { 
  TrendingUp, 
  Package, 
  Users, 
  DollarSign, 
  ShoppingCart,
  AlertTriangle 
} from 'lucide-react';
import StatsCard from '../components/Common/StatsCard';
import Table from '../components/Common/Table';
import StatusBadge from '../components/Common/StatusBadge';
import { useApp } from '../context/AppContext';

const Dashboard: React.FC = () => {
  const { products, customers, orders, leads, invoices } = useApp();
  
  // Calculate stats
  const lowStockProducts = products.filter(p => p.quantity <= p.minStock);
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalLeadValue = leads.reduce((sum, lead) => sum + lead.value, 0);
  
  // Recent orders for table
  const recentOrders = orders.slice(0, 5);
  
  const orderColumns = [
    { key: 'id', label: 'Order ID', sortable: true },
    { key: 'customerName', label: 'Customer', sortable: true },
    { 
      key: 'total', 
      label: 'Total', 
      sortable: true,
      render: (value: number) => `$${value.toFixed(2)}`
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (value: string) => <StatusBadge status={value} />
    },
    { key: 'createdAt', label: 'Date', sortable: true },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your business today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          change={{ value: 12.5, type: 'increase' }}
          icon={DollarSign}
          color="green"
        />
        <StatsCard
          title="Total Orders"
          value={orders.length}
          change={{ value: 8.2, type: 'increase' }}
          icon={ShoppingCart}
          color="blue"
        />
        <StatsCard
          title="Active Customers"
          value={customers.filter(c => c.status === 'active').length}
          change={{ value: 3.1, type: 'increase' }}
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="Products in Stock"
          value={products.reduce((sum, p) => sum + p.quantity, 0)}
          change={{ value: 2.4, type: 'decrease' }}
          icon={Package}
          color="yellow"
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          </div>
          <div className="p-6">
            <Table
              columns={orderColumns}
              data={recentOrders}
            />
          </div>
        </div>

        {/* Alerts & Quick Actions */}
        <div className="space-y-6">
          {/* Low Stock Alert */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                Low Stock Alert
              </h2>
            </div>
            <div className="p-6">
              {lowStockProducts.length > 0 ? (
                <div className="space-y-3">
                  {lowStockProducts.map((product) => (
                    <div key={product.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-600">Only {product.quantity} left</p>
                      </div>
                      <StatusBadge status="Low Stock" variant="error" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">All products are well stocked!</p>
              )}
            </div>
          </div>

          {/* Sales Pipeline */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Sales Pipeline</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Lead Value</span>
                  <span className="text-xl font-bold text-green-600">${totalLeadValue.toLocaleString()}</span>
                </div>
                <div className="space-y-2">
                  {['new', 'qualified', 'proposal'].map((status) => {
                    const statusLeads = leads.filter(l => l.status === status);
                    const statusValue = statusLeads.reduce((sum, l) => sum + l.value, 0);
                    return (
                      <div key={status} className="flex justify-between items-center text-sm">
                        <span className="capitalize text-gray-600">{status}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-900">{statusLeads.length} leads</span>
                          <span className="text-green-600 font-medium">${statusValue.toLocaleString()}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;