import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../../services/api';

interface DiscountCode {
  code: string;
  discountPercent: number;
  isUsed: boolean;
  createdAt: string;
  usedAt?: string;
}

interface AdminStats {
  totalItemsPurchased: number;
  totalPurchaseAmount: number;
  discountCodes: DiscountCode[];
  totalDiscountAmount: number;
}

export const AdminPanel: React.FC = () => {
  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery<AdminStats>({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const response = await apiService.getAdminStats();
      return response.data;
    },
  });

  const { data: discountCodes, isLoading: codesLoading, error: codesError } = useQuery<DiscountCode[]>({
    queryKey: ['discount-codes'],
    queryFn: async () => {
      const response = await apiService.getDiscountCodes();
      return response.data;
    },
  });

  if (statsLoading || codesLoading) return <div className="text-center py-8">Loading admin data...</div>;
  
  if (statsError || codesError) return (
    <div className="text-center py-8 text-red-600">
      Error loading admin data. Please try again.
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h2>
      
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900">Total Items Sold</h3>
          <p className="text-2xl font-bold">{stats?.totalItemsPurchased || 0}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900">Total Revenue</h3>
          <p className="text-2xl font-bold">${stats?.totalPurchaseAmount?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-900">Total Discounts</h3>
          <p className="text-2xl font-bold">${stats?.totalDiscountAmount?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-900">Discount Codes</h3>
          <p className="text-2xl font-bold">{discountCodes?.length || 0}</p>
        </div>
      </div>

      {/* Discount Codes Table */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">Discount Codes</h3>
        {discountCodes && discountCodes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 text-left border-b">Code</th>
                  <th className="py-3 px-4 text-left border-b">Discount %</th>
                  <th className="py-3 px-4 text-left border-b">Status</th>
                  <th className="py-3 px-4 text-left border-b">Created</th>
                  <th className="py-3 px-4 text-left border-b">Used</th>
                </tr>
              </thead>
              <tbody>
                {discountCodes.map((code) => (
                  <tr key={code.code} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono">{code.code}</td>
                    <td className="py-3 px-4">{code.discountPercent}%</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        code.isUsed 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {code.isUsed ? 'Used' : 'Available'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {new Date(code.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      {code.usedAt ? new Date(code.usedAt).toLocaleDateString() : 'Not used'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No discount codes generated yet.</p>
        )}
      </div>
    </div>
  );
};