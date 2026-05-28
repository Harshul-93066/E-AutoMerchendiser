import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

const ServiceStatus = () => {
  const [serviceRecords, setServiceRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'RECEIVED':
        return 'bg-red-100 text-red-800';
      case 'ALLOCATED':
        return 'bg-blue-100 text-blue-800';
      case 'UNDER_SERVICING':
        return 'bg-yellow-100 text-yellow-800';
      case 'SERVICED':
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const fetchServiceStatus = async () => {
    setLoading(true);
    try {
      const response = await api.get('/supervisor/service-status');
      setServiceRecords(response.data);
    } catch (error) {
      console.error('Error fetching service status:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceStatus();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Service Status</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2 text-left">ID</th>
              <th className="border p-2 text-left">Vehicle No</th>
              <th className="border p-2 text-left">Model</th>
              <th className="border p-2 text-left">Status</th>
              <th className="border p-2 text-left">Customer</th>
            </tr>
          </thead>
          <tbody>
            {serviceRecords.length === 0 ? (
              <tr>
                <td colSpan="5" className="border p-2 text-center text-gray-500">
                  No records found.
                </td>
              </tr>
            ) : (
              serviceRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="border p-2">{record.id}</td>
                  <td className="border p-2">{record.vehicleNumber}</td>
                  <td className="border p-2">{record.modelName}</td>
                  <td className="border p-2">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getStatusColor(
                        record.status
                      )}`}
                    >
                      {record.status?.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="border p-2">{record.customer?.fullName || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ServiceStatus;
