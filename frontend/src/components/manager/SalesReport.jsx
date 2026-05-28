import React, { useState } from 'react';
import api from '../../api/axiosConfig';

const SalesReport = () => {
  const [period, setPeriod] = useState('MONTHLY');
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [summary, setSummary] = useState(null);
  const [modelWise, setModelWise] = useState([]);
  const [makeWise, setMakeWise] = useState([]);
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

      const [summaryRes, modelRes, makeRes] = await Promise.all([
        api.get('/reports/sales', { params }),
        api.get('/reports/sales/model-wise', { params }),
        api.get('/reports/sales/make-wise', { params }),
      ]);

      setSummary(summaryRes.data);
      setModelWise(modelRes.data);
      setMakeWise(makeRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate sales report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Sales Report</h1>

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

      {summary && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">Total Sales Count</p>
              <p className="text-2xl font-bold">{summary.totalSales}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">Period</p>
              <p className="text-2xl font-bold">{summary.period}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">Date Range</p>
              <p className="text-lg font-bold">{summary.startDate} - {summary.endDate}</p>
            </div>
          </div>
        </div>
      )}

      {modelWise.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Model-wise Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-3 text-left">Model Name</th>
                  <th className="p-3 text-left">Count</th>
                  <th className="p-3 text-left">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {modelWise.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-3">{item.modelName}</td>
                    <td className="p-3">{item.count}</td>
                    <td className="p-3">{'\u20B9'}{item.revenue?.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {makeWise.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Make-wise Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-3 text-left">Make</th>
                  <th className="p-3 text-left">Count</th>
                  <th className="p-3 text-left">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {makeWise.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-3">{item.make}</td>
                    <td className="p-3">{item.count}</td>
                    <td className="p-3">{'\u20B9'}{item.revenue?.toLocaleString('en-IN')}</td>
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

export default SalesReport;
