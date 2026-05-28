import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

const VehiclesForService = () => {
  const [serviceRecords, setServiceRecords] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  const statuses = [
    'all',
    'RECEIVED',
    'ALLOCATED',
    'UNDER_SERVICING',
    'SERVICED',
    'APPROVED_FOR_DELIVERY',
    'DELIVERED',
  ];

  const fetchRecords = async (status) => {
    setLoading(true);
    try {
      const url =
        status === 'all'
          ? '/supervisor/service-records'
          : `/supervisor/service-records?status=${status}`;
      const response = await api.get(url);
      setServiceRecords(response.data);
    } catch (error) {
      console.error('Error fetching service records:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords(statusFilter);
  }, [statusFilter]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Vehicles For Service</h2>

      <div className="mb-4">
        <label className="mr-2 font-medium">Filter by Status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status === 'all' ? 'All' : status.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2 text-left">ID</th>
              <th className="border p-2 text-left">Vehicle No</th>
              <th className="border p-2 text-left">Model</th>
              <th className="border p-2 text-left">Make</th>
              <th className="border p-2 text-left">Customer</th>
              <th className="border p-2 text-left">Date Submitted</th>
              <th className="border p-2 text-left">Deadline</th>
              <th className="border p-2 text-left">Defects</th>
              <th className="border p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {serviceRecords.length === 0 ? (
              <tr>
                <td colSpan="9" className="border p-2 text-center text-gray-500">
                  No records found.
                </td>
              </tr>
            ) : (
              serviceRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="border p-2">{record.id}</td>
                  <td className="border p-2">{record.vehicleNumber}</td>
                  <td className="border p-2">{record.modelName}</td>
                  <td className="border p-2">{record.make}</td>
                  <td className="border p-2">{record.customer?.fullName || '-'}</td>
                  <td className="border p-2">{record.dateOfSubmission}</td>
                  <td className="border p-2">{record.expectedDeliveryDate}</td>
                  <td className="border p-2">{record.defects}</td>
                  <td className="border p-2">
                    <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-gray-100">
                      {record.status?.replace(/_/g, ' ')}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default VehiclesForService;
