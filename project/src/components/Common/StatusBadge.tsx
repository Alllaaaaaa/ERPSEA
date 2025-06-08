import React from 'react';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, variant = 'default' }) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusVariant = (status: string) => {
    const lowerStatus = status.toLowerCase();
    if (['active', 'delivered', 'paid', 'received', 'closed-won'].includes(lowerStatus)) {
      return 'success';
    }
    if (['pending', 'processing', 'sent', 'draft', 'qualified'].includes(lowerStatus)) {
      return 'warning';
    }
    if (['cancelled', 'overdue', 'closed-lost', 'inactive'].includes(lowerStatus)) {
      return 'error';
    }
    if (['new', 'contacted', 'shipped'].includes(lowerStatus)) {
      return 'info';
    }
    return 'default';
  };

  const finalVariant = variant === 'default' ? getStatusVariant(status) : variant;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getVariantClasses()}`}>
      {status.replace('-', ' ')}
    </span>
  );
};

export default StatusBadge;