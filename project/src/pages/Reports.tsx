import React, { useState } from 'react';
import { BarChart3, TrendingUp, Download, Calendar, DollarSign, Package, Users, Truck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import StatsCard from '../components/Common/StatsCard';

const Reports: React.FC = () => {
  const { orders, suppliers, customers, rfqs, supplierOffers, exchangeRates } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Calculate key metrics
  const totalOrderValue = orders.reduce((sum, order) => {
    const eurRate = exchangeRates.find(r => r.currency === 'EUR')?.rate || 145.50;
    const usdRate = exchangeRates.find(r => r.currency === 'USD')?.rate || 134.20;
    const rate = order.currency === 'EUR' ? eurRate : order.currency === 'USD' ? usdRate : 1;
    return sum + (order.total * rate);
  }, 0);

  const avgOrderValue = totalOrderValue / orders.length;
  const activeSuppliers = suppliers.filter(s => s.status === 'active').length;
  const avgSupplierRating = suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length;

  // RFQ Performance
  const completedRFQs = rfqs.filter(r => r.status === 'completed').length;
  const rfqSuccessRate = (completedRFQs / rfqs.length) * 100;

  // Supplier Performance
  const supplierPerformance = suppliers.map(supplier => {
    const supplierOrders = orders.filter(o => o.supplierId === supplier.id);
    const onTimeDeliveries = supplierOrders.filter(o => o.status === 'received').length;
    const onTimeRate = supplierOrders.length > 0 ? (onTimeDeliveries / supplierOrders.length) * 100 : 0;
    
    return {
      ...supplier,
      orderCount: supplierOrders.length,
      onTimeRate,
      totalValue: supplierOrders.reduce((sum, o) => sum + o.total, 0)
    };
  }).sort((a, b) => b.totalValue - a.totalValue);

  // Monthly trends (mock data for demonstration)
  const monthlyData = [
    { month: 'Jan', orders: 12, value: 1250000 },
    { month: 'Feb', orders: 15, value: 1580000 },
    { month: 'Mar', orders: 18, value: 1920000 },
    { month: 'Apr', orders: 14, value: 1450000 },
    { month: 'May', orders: 20, value: 2100000 },
    { month: 'Jun', orders: 16, value: 1680000 },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
          <p className="text-gray-600">Business intelligence and performance metrics</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Order Value"
          value={`${(totalOrderValue / 1000000).toFixed(1)}M DZD`}
          change={{ value: 15.3, type: 'increase' }}
          icon={DollarSign}
          color="green"
        />
        <StatsCard
          title="Average Order Value"
          value={`${(avgOrderValue / 1000).toFixed(0)}K DZD`}
          change={{ value: 8.7, type: 'increase' }}
          icon={TrendingUp}
          color="blue"
        />
        <StatsCard
          title="Active Suppliers"
          value={activeSuppliers}
          change={{ value: 12.5, type: 'increase' }}
          icon={Truck}
          color="purple"
        />
        <StatsCard
          title="Avg Supplier Rating"
          value={avgSupplierRating.toFixed(1)}
          change={{ value: 2.1, type: 'increase' }}
          icon={Users}
          color="yellow"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Order Trends</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {monthlyData.map((data, index) => (
              <div key={data.month} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-600 w-8">{data.month}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 w-32">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(data.orders / 20) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{data.orders} orders</p>
                  <p className="text-xs text-gray-600">{(data.value / 1000000).toFixed(1)}M DZD</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RFQ Performance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">RFQ Performance</h3>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-6">
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center w-24 h-24">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-gray-200"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - rfqSuccessRate / 100)}`}
                    className="text-green-500"
                  />
                </svg>
                <span className="absolute text-xl font-bold text-gray-900">
                  {rfqSuccessRate.toFixed(0)}%
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">Success Rate</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">{rfqs.length}</p>
                <p className="text-sm text-gray-600">Total RFQs</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{completedRFQs}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Supplier Performance Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Top Supplier Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supplier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  On-Time Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Country
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {supplierPerformance.slice(0, 10).map((supplier, index) => (
                <tr key={supplier.id} className={index < 3 ? 'bg-green-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {index < 3 && (
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full mr-3">
                          {index + 1}
                        </span>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{supplier.name}</p>
                        <p className="text-sm text-gray-600">{supplier.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {supplier.orderCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {supplier.totalValue.toLocaleString()} EUR
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-1">★</span>
                      <span className="text-sm font-medium">{supplier.rating.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 w-16 mr-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${supplier.onTimeRate}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{supplier.onTimeRate.toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {supplier.country}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Order Status Distribution</h4>
          <div className="space-y-3">
            {['preparation', 'in-transport', 'received'].map((status) => {
              const statusOrders = orders.filter(o => o.status === status);
              const percentage = (statusOrders.length / orders.length) * 100;
              return (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 capitalize">{status.replace('-', ' ')}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-8">{percentage.toFixed(0)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Currency Distribution</h4>
          <div className="space-y-3">
            {['EUR', 'USD'].map((currency) => {
              const currencyOrders = orders.filter(o => o.currency === currency);
              const percentage = (currencyOrders.length / orders.length) * 100;
              return (
                <div key={currency} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{currency}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-8">{percentage.toFixed(0)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Exchange Rate Trends</h4>
          <div className="space-y-4">
            {exchangeRates.map((rate) => (
              <div key={rate.currency} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{rate.currency}/DZD</p>
                  <p className="text-xs text-gray-600">Last updated: {rate.lastUpdated}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{rate.rate.toFixed(2)}</p>
                  <p className="text-xs text-green-600">+2.3%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;