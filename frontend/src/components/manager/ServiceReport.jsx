import React, { useState } from 'react';
import api from '../../api/axiosConfig';

const ServiceReport = () => {
  const [period, setPeriod] = useState('MONTHLY');
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [report, setReport] = useState(null);
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

      const response = await api.get('/reports/services', { params });
      setReport(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate service report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Service Report</h1>

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

      {report && (
        <>
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">Total Vehicles Serviced</p>
                <p className="text-2xl font-bold">{report.totalServiced}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">Date Range</p>
                <p className="text-lg font-bold">{report.startDate} - {report.endDate}</p>
              </div>
            </div>
          </div>

          {report.records && report.records.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Service Records</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-3 text-left">Service ID</th>
                      <th className="p-3 text-left">Vehicle</th>
                      <th className="p-3 text-left">Category</th>
                      <th className="p-3 text-left">Date</th>
                      <th className="p-3 text-left">Status</th>
                      <th className="p-3 text-left">Charges</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.records.map((record, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-3">{record.id}</td>
                        <td className="p-3">{record.vehicleNumber} ({record.modelName})</td>
                        <td className="p-3">{record.category?.categoryName || '-'}</td>
                        <td className="p-3">{record.dateOfSubmission}</td>
                        <td className="p-3">{record.status}</td>
                        <td className="p-3">{'\u20B9'}{record.billAmount?.toLocaleString('en-IN') || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ServiceReport;
