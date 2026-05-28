import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

const GenerateSalesBill = () => {
  const [sales, setSales] = useState([]);
  const [billData, setBillData] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await api.get('/clerk/sales/all');
      setSales(response.data);
    } catch (error) {
      console.error('Error fetching sales:', error);
      setMessage({ text: 'Failed to load sales records.', type: 'error' });
    }
  };

  const handleGenerateBill = async (id) => {
    setLoading(true);
    setMessage({ text: '', type: '' });
    setBillData(null);

    try {
      const response = await api.get(`/clerk/sales/${id}/bill`);
      setBillData(response.data);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to generate bill.';
      setMessage({ text: errorMsg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const closeBill = () => {
    setBillData(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Generate Sales Bill</h2>

      {message.text && (
        <div
          className={`mb-4 p-3 rounded ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">ID</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Customer</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Model</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Make</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Vehicle No</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Sale Date</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {sales.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center px-4 py-6 text-gray-500">
                  No sales records found.
                </td>
              </tr>
            ) : (
              sales.map((sale) => (
                <tr key={sale.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{sale.id}</td>
                  <td className="px-4 py-3 text-sm">{sale.customerName}</td>
                  <td className="px-4 py-3 text-sm">{sale.vehicleModel?.modelName}</td>
                  <td className="px-4 py-3 text-sm">{sale.vehicleModel?.make}</td>
                  <td className="px-4 py-3 text-sm">{sale.vehicleNumber || '-'}</td>
                  <td className="px-4 py-3 text-sm">{sale.saleDate}</td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => handleGenerateBill(sale.id)}
                      disabled={loading}
                      className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50 text-sm"
                    >
                      Generate Bill
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {billData && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Sales Bill</h3>
              <button
                onClick={closeBill}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Sale ID:</span>
                <span className="text-gray-800">#{billData.saleId}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Customer Name:</span>
                <span className="text-gray-800">{billData.customerName}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Customer Phone:</span>
                <span className="text-gray-800">{billData.customerPhone || '-'}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Vehicle Number:</span>
                <span className="text-gray-800">{billData.vehicleNumber || '-'}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Model:</span>
                <span className="text-gray-800">{billData.modelName}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Make:</span>
                <span className="text-gray-800">{billData.make}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Variant:</span>
                <span className="text-gray-800">{billData.variant}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Sale Date:</span>
                <span className="text-gray-800">{billData.saleDate}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Recorded By:</span>
                <span className="text-gray-800">{billData.recordedBy}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="font-bold text-gray-700 text-lg">Total Amount:</span>
                <span className="font-bold text-indigo-600 text-lg">
                  ₹{billData.salePrice != null ? Number(billData.salePrice).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                </span>
              </div>
            </div>

            <button
              onClick={closeBill}
              className="mt-6 w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateSalesBill;
