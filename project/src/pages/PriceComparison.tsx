import React, { useState } from 'react';
import { Calculator, TrendingUp, TrendingDown, Award, DollarSign } from 'lucide-react';
import { useApp } from '../context/AppContext';
import StatusBadge from '../components/Common/StatusBadge';

const PriceComparison: React.FC = () => {
  const { supplierOffers, exchangeRates } = useApp();
  const [selectedRFQ, setSelectedRFQ] = useState('RFQ-2024-001');
  const [customsDuties] = useState(15); // 15%
  const [taxes] = useState(19); // 19% VAT
  const [additionalFees] = useState(50000); // 50,000 DZD fixed fees

  // Get offers for selected RFQ
  const rfqOffers = supplierOffers.filter(offer => offer.rfqId === selectedRFQ);

  // Calculate final prices in DZD
  const calculateFinalPrice = (offer: any) => {
    const eurRate = exchangeRates.find(r => r.currency === 'EUR')?.rate || 145.50;
    const usdRate = exchangeRates.find(r => r.currency === 'USD')?.rate || 134.20;
    
    const rate = offer.currency === 'EUR' ? eurRate : usdRate;
    const totalOriginalPrice = offer.items.reduce((sum: number, item: any) => 
      sum + (item.cfrPrice * item.quantity), 0
    ) + offer.freightPrice;
    
    const priceInDZD = totalOriginalPrice * rate;
    const withCustoms = priceInDZD * (1 + customsDuties / 100);
    const withTaxes = withCustoms * (1 + taxes / 100);
    const finalPrice = withTaxes + additionalFees;
    
    return {
      originalPrice: totalOriginalPrice,
      priceInDZD,
      withCustoms,
      withTaxes,
      finalPrice,
      pricePerUnit: finalPrice / offer.items.reduce((sum: number, item: any) => sum + item.quantity, 0)
    };
  };

  // Calculate comparison data
  const comparisonData = rfqOffers.map(offer => {
    const calculation = calculateFinalPrice(offer);
    return {
      ...offer,
      ...calculation
    };
  }).sort((a, b) => a.finalPrice - b.finalPrice);

  // Add ranking
  comparisonData.forEach((offer, index) => {
    offer.ranking = index + 1;
  });

  const bestOffer = comparisonData[0];
  const savings = comparisonData.length > 1 ? 
    comparisonData[1].finalPrice - bestOffer.finalPrice : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Price Comparison Board</h1>
          <p className="text-gray-600">Compare supplier offers and calculate final costs in DZD</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedRFQ}
            onChange={(e) => setSelectedRFQ(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="RFQ-2024-001">RFQ-2024-001 - Titanium Dioxide</option>
            <option value="RFQ-2024-002">RFQ-2024-002 - Mixed Chemicals</option>
          </select>
        </div>
      </div>

      {/* Exchange Rates & Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-600 mb-2">EUR Rate</h3>
          <p className="text-lg font-bold text-green-600">
            {exchangeRates.find(r => r.currency === 'EUR')?.rate.toFixed(2)} DZD
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-600 mb-2">USD Rate</h3>
          <p className="text-lg font-bold text-green-600">
            {exchangeRates.find(r => r.currency === 'USD')?.rate.toFixed(2)} DZD
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Customs Duties</h3>
          <p className="text-lg font-bold text-orange-600">{customsDuties}%</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Taxes (VAT)</h3>
          <p className="text-lg font-bold text-orange-600">{taxes}%</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Additional Fees</h3>
          <p className="text-lg font-bold text-red-600">{additionalFees.toLocaleString()} DZD</p>
        </div>
      </div>

      {/* Best Offer Summary */}
      {bestOffer && (
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Award className="h-8 w-8" />
              <div>
                <h3 className="text-xl font-bold">Best Offer: {bestOffer.supplierName}</h3>
                <p className="text-green-100">
                  Final Price: {bestOffer.finalPrice.toLocaleString()} DZD
                </p>
              </div>
            </div>
            {savings > 0 && (
              <div className="text-right">
                <p className="text-sm text-green-100">Savings vs 2nd best</p>
                <p className="text-xl font-bold">{savings.toLocaleString()} DZD</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Detailed Comparison */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Detailed Price Comparison</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supplier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Original Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price in DZD
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  With Customs
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  With Taxes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Final Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price/Unit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {comparisonData.map((offer) => (
                <tr key={offer.id} className={offer.ranking === 1 ? 'bg-green-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {offer.ranking === 1 && <Award className="h-4 w-4 text-yellow-500 mr-2" />}
                      <span className={`font-bold ${offer.ranking === 1 ? 'text-green-600' : 'text-gray-900'}`}>
                        #{offer.ranking}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="font-medium text-gray-900">{offer.supplierName}</p>
                      <p className="text-sm text-gray-600">{offer.currency}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {offer.originalPrice.toLocaleString()} {offer.currency}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {offer.priceInDZD.toLocaleString()} DZD
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {offer.withCustoms.toLocaleString()} DZD
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {offer.withTaxes.toLocaleString()} DZD
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`font-bold ${offer.ranking === 1 ? 'text-green-600' : 'text-gray-900'}`}>
                      {offer.finalPrice.toLocaleString()} DZD
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {offer.pricePerUnit.toLocaleString()} DZD
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={offer.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-700 font-medium">
                        Negotiate
                      </button>
                      {offer.ranking <= 3 && (
                        <button className="text-green-600 hover:text-green-700 font-medium">
                          Select
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Price Breakdown Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Breakdown - Best Offer</h3>
          {bestOffer && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Base Price ({bestOffer.currency})</span>
                <span className="font-medium">{bestOffer.originalPrice.toLocaleString()} {bestOffer.currency}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Converted to DZD</span>
                <span className="font-medium">{bestOffer.priceInDZD.toLocaleString()} DZD</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Customs Duties ({customsDuties}%)</span>
                <span className="font-medium text-orange-600">
                  +{(bestOffer.withCustoms - bestOffer.priceInDZD).toLocaleString()} DZD
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Taxes ({taxes}%)</span>
                <span className="font-medium text-orange-600">
                  +{(bestOffer.withTaxes - bestOffer.withCustoms).toLocaleString()} DZD
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Additional Fees</span>
                <span className="font-medium text-red-600">+{additionalFees.toLocaleString()} DZD</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Final Price</span>
                  <span className="text-lg font-bold text-green-600">
                    {bestOffer.finalPrice.toLocaleString()} DZD
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Negotiation History</h3>
          <div className="space-y-4">
            {comparisonData.slice(0, 3).map((offer, index) => (
              <div key={offer.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{offer.supplierName}</span>
                  <span className={`text-sm px-2 py-1 rounded ${
                    index === 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    Rank #{offer.ranking}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Negotiation Rounds: {offer.negotiationRounds?.length || 0}</p>
                  <p>Current Price: {offer.finalPrice.toLocaleString()} DZD</p>
                </div>
                {index < 2 && (
                  <button className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Start Negotiation
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceComparison;