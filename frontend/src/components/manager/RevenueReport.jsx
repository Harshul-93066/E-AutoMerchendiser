import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

const RevenueReport = () => {
  const [period, setPeriod] = useState('MONTHLY');
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [salesRevenue, setSalesRevenue] = useState(null);
  const [serviceRevenue, setServiceRevenue] = useState(null);
  const [mechanicWise, setMechanicWise] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateReport = async () => {
    setLoading(true);
    setError('');
    try {
      const params = { period, year };
      if (period === 'MONTHLY') {
        params.month = month;
      }

      const [salesRes, serviceRes, mechanicRes] = await Promise.all([
        api.get('/reports/revenue/sales', { params }),
        api.get('/reports/revenue/services', { params }),
        api.get('/reports/mechanic-wise'),
      ]);

      setSalesRevenue(salesRes.data);
      setServiceRevenue(serviceRes.data);
      setMechanicWise(mechanicRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate revenue report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Revenue Report</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            >
              <option value="MONTHLY">Monthly</option>
              <option value="HALF_YEARLY">Half Yearly</option>
              <option value="ANNUALLY">Annually</option>
            </select>
          </div>

          {period === 'MONTHLY' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="border border-gray-300 rounded px-3 py-2"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="border border-gray-300 rounded px-3 py-2 w-24"
            />
          </div>

          <button
            onClick={generateReport}
            disabled={loading}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{error}</div>
      )}

      {(salesRevenue !== null || serviceRevenue !== null) && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-600 mb-2">Sales Revenue</h2>
              <p className="text-3xl font-bold text-indigo-600">
                {'\u20B9'}{(salesRevenue?.revenue || 0).toLocaleString('en-IN')}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-600 mb-2">Service Revenue</h2>
              <p className="text-3xl font-bold text-green-600">
                {'\u20B9'}{(serviceRevenue?.revenue || 0).toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-lg font-semibold text-gray-600 mb-2">Combined Total Revenue</h2>
            <p className="text-3xl font-bold text-gray-800">
              {'\u20B9'}{((salesRevenue?.revenue || 0) + (serviceRevenue?.revenue || 0)).toLocaleString('en-IN')}
            </p>
          </div>
        </>
      )}

      {mechanicWise.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Mechanic-wise Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-3 text-left">Mechanic Name</th>
                  <th className="p-3 text-left">Service Count</th>
                </tr>
              </thead>
              <tbody>
                {mechanicWise.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-3">{item.mechanicName}</td>
                    <td className="p-3">{item.serviceCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default RevenueReport;
