import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  UserCheck,
  ShoppingCart,
  Truck,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Building2,
  MessageSquare,
  BarChart3,
  Calculator
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const menuItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/rfq', icon: MessageSquare, label: 'RFQ Management' },
  { path: '/price-comparison', icon: Calculator, label: 'Price Comparison' },
  { path: '/orders', icon: ShoppingCart, label: 'Orders' },
  { path: '/suppliers', icon: Truck, label: 'Suppliers' },
  { path: '/products', icon: Package, label: 'Products' },
  { path: '/customers', icon: UserCheck, label: 'Customers' },
  { path: '/sales', icon: Users, label: 'Sales' },
  { path: '/reports', icon: BarChart3, label: 'Reports' },
  { path: '/finance', icon: FileText, label: 'Finance' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { sidebarCollapsed, setSidebarCollapsed } = useApp();

  return (
    <div className={`bg-slate-900 text-white h-screen flex flex-col transition-all duration-300 ${
      sidebarCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        {!sidebarCollapsed && (
          <div className="flex items-center space-x-2">
            <Building2 className="h-6 w-6 text-blue-400" />
            <span className="font-bold text-lg">ChemImport ERP</span>
          </div>
        )}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-1 rounded-lg hover:bg-slate-700 transition-colors"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;