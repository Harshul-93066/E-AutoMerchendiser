import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

const ApproveDelivery = () => {
  const [servicedRecords, setServicedRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchServicedRecords = async () => {
    setLoading(true);
    try {
      const response = await api.get('/supervisor/service-records?status=SERVICED');
      setServicedRecords(response.data);
    } catch (error) {
      console.error('Error fetching serviced records:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServicedRecords();
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.put(`/supervisor/approve/${id}`);
      setMessage('Delivery approved successfully!');
      fetchServicedRecords();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error approving delivery:', error);
      setMessage('Failed to approve delivery.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Approve Delivery</h2>

      {message && (
        <div className="mb-4 p-3 rounded bg-green-100 text-green-800 font-medium">
          {message}
        </div>
      )}

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
              <th className="border p-2 text-left">Work Description</th>
              <th className="border p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {servicedRecords.length === 0 ? (
              <tr>
                <td colSpan="6" className="border p-2 text-center text-gray-500">
                  No vehicles pending approval.
                </td>
              </tr>
            ) : (
              servicedRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="border p-2">{record.id}</td>
                  <td className="border p-2">{record.vehicleNumber}</td>
                  <td className="border p-2">{record.modelName}</td>
                  <td className="border p-2">{record.make}</td>
                  <td className="border p-2">{record.workDescription || '-'}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleApprove(record.id)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    >
                      Approve
                    </button>
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

export default ApproveDelivery;
