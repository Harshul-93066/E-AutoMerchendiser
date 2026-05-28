import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

const PendingDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const fetchPendingDeliveries = async () => {
    setLoading(true);
    try {
      const response = await api.get('/supervisor/pending-deliveries');
      setDeliveries(response.data);
    } catch (error) {
      console.error('Error fetching pending deliveries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingDeliveries();
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.put(`/supervisor/approve-delivery/${id}`);
      setMessage({ text: 'Delivery approved successfully!', type: 'success' });
      fetchPendingDeliveries();
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      setMessage({ text: 'Failed to approve delivery.', type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/supervisor/reject-delivery/${id}`);
      setMessage({ text: 'Delivery rejected.', type: 'success' });
      fetchPendingDeliveries();
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      setMessage({ text: 'Failed to reject delivery.', type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Pending Delivery Approvals</h2>
      <p className="text-gray-600 mb-4">
        Delivery requests raised by clerks that need your approval before being finalized.
      </p>

      {message.text && (
        <div className={`mb-4 p-3 rounded font-medium ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2 text-left">ID</th>
              <th className="border p-2 text-left">Type</th>
              <th className="border p-2 text-left">Vehicle No</th>
              <th className="border p-2 text-left">Delivered To</th>
              <th className="border p-2 text-left">Delivery Date</th>
              <th className="border p-2 text-left">Remarks</th>
              <th className="border p-2 text-left">Raised By</th>
              <th className="border p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.length === 0 ? (
              <tr>
                <td colSpan="8" className="border p-2 text-center text-gray-500">
                  No pending delivery requests.
                </td>
              </tr>
            ) : (
              deliveries.map((delivery) => (
                <tr key={delivery.id} className="hover:bg-gray-50">
                  <td className="border p-2">{delivery.id}</td>
                  <td className="border p-2">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${delivery.type === 'NEW_VEHICLE' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                      {delivery.type === 'NEW_VEHICLE' ? 'New Vehicle' : 'Serviced Vehicle'}
                    </span>
                  </td>
                  <td className="border p-2">
                    {delivery.serviceRecord?.vehicleNumber || delivery.salesTransaction?.vehicleNumber || '-'}
                  </td>
                  <td className="border p-2">{delivery.deliveredTo}</td>
                  <td className="border p-2">{delivery.deliveryDate}</td>
                  <td className="border p-2">{delivery.remarks || '-'}</td>
                  <td className="border p-2">{delivery.recordedBy?.fullName || '-'}</td>
                  <td className="border p-2 space-x-2">
                    <button
                      onClick={() => handleApprove(delivery.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(delivery.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                    >
                      Reject
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

export default PendingDeliveries;
