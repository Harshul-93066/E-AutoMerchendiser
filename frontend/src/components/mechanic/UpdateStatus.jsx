import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

const UpdateStatus = () => {
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusValues, setStatusValues] = useState({});
  const [workDescriptions, setWorkDescriptions] = useState({});
  const [messages, setMessages] = useState({});
  const [confirmDialog, setConfirmDialog] = useState({ open: false, serviceRecordId: null });

  useEffect(() => {
    fetchAllocatedVehicles();
  }, []);

  const fetchAllocatedVehicles = async () => {
    try {
      const response = await api.get('/mechanic/active');
      setAllocations(response.data);
      const initialStatus = {};
      const initialWork = {};
      response.data.forEach((item) => {
        initialStatus[item.serviceRecord.id] = item.serviceRecord.status || 'NOT_ATTENDED';
        initialWork[item.serviceRecord.id] = item.serviceRecord.workDescription || '';
      });
      setStatusValues(initialStatus);
      setWorkDescriptions(initialWork);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch allocated vehicles');
      setLoading(false);
    }
  };

  const handleStatusChange = (serviceRecordId, value) => {
    setStatusValues((prev) => ({ ...prev, [serviceRecordId]: value }));
  };

  const handleWorkDescriptionChange = (serviceRecordId, value) => {
    setWorkDescriptions((prev) => ({ ...prev, [serviceRecordId]: value }));
  };

  const handleUpdate = async (serviceRecordId) => {
    if (statusValues[serviceRecordId] === 'SERVICED' && !workDescriptions[serviceRecordId]?.trim()) {
      setMessages((prev) => ({
        ...prev,
        [serviceRecordId]: { type: 'error', text: 'Work description is mandatory when marking as SERVICED.' },
      }));
      return;
    }
    if (statusValues[serviceRecordId] === 'SERVICED') {
      setConfirmDialog({ open: true, serviceRecordId });
      return;
    }
    await performUpdate(serviceRecordId);
  };

  const performUpdate = async (serviceRecordId) => {
    try {
      await api.put(`/mechanic/service-records/${serviceRecordId}/status`, {
        status: statusValues[serviceRecordId],
      });
      await api.put(`/mechanic/service-records/${serviceRecordId}/work-info`, {
        workDescription: workDescriptions[serviceRecordId],
      });
      setMessages((prev) => ({
        ...prev,
        [serviceRecordId]: { type: 'success', text: 'Updated successfully!' },
      }));
      fetchAllocatedVehicles();
      setTimeout(() => {
        setMessages((prev) => {
          const updated = { ...prev };
          delete updated[serviceRecordId];
          return updated;
        });
      }, 3000);
    } catch (err) {
      setMessages((prev) => ({
        ...prev,
        [serviceRecordId]: { type: 'error', text: 'Failed to update.' },
      }));
    }
  };

  const handleConfirmOk = async () => {
    const { serviceRecordId } = confirmDialog;
    setConfirmDialog({ open: false, serviceRecordId: null });
    await performUpdate(serviceRecordId);
  };

  const handleConfirmCancel = () => {
    setConfirmDialog({ open: false, serviceRecordId: null });
  };

  if (loading) {
    return <div className="text-center py-8">Loading allocated vehicles...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Update Service Status</h2>
      {allocations.length === 0 ? (
        <p className="text-gray-500">No vehicles currently allocated.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="bg-gray-200 p-3 text-left">Service Record ID</th>
                <th className="bg-gray-200 p-3 text-left">Vehicle No</th>
                <th className="bg-gray-200 p-3 text-left">Model Name</th>
                <th className="bg-gray-200 p-3 text-left">Defects</th>
                <th className="bg-gray-200 p-3 text-left">Status</th>
                <th className="bg-gray-200 p-3 text-left">Work Description</th>
                <th className="bg-gray-200 p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allocations.map((item) => {
                const isServiced = item.serviceRecord.status === 'SERVICED';
                return (
                <tr key={item.serviceRecord.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-3">{item.serviceRecord.id}</td>
                  <td className="p-3">{item.serviceRecord.vehicleNumber}</td>
                  <td className="p-3">{item.serviceRecord.modelName}</td>
                  <td className="p-3">{item.serviceRecord.defects}</td>
                  <td className="p-3">
                    <select
                      className="border border-gray-300 rounded px-2 py-1 w-full"
                      value={statusValues[item.serviceRecord.id] || ''}
                      onChange={(e) => handleStatusChange(item.serviceRecord.id, e.target.value)}
                      disabled={isServiced}
                    >
                      <option value="ALLOCATED">ALLOCATED</option>
                      <option value="UNDER_SERVICING">UNDER_SERVICING</option>
                      <option value="SERVICED">SERVICED</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <textarea
                      className="border border-gray-300 rounded px-2 py-1 w-full"
                      rows="2"
                      value={workDescriptions[item.serviceRecord.id] || ''}
                      onChange={(e) => handleWorkDescriptionChange(item.serviceRecord.id, e.target.value)}
                      placeholder="Enter work description..."
                      disabled={isServiced}
                    />
                  </td>
                  <td className="p-3">
                    {isServiced ? (
                      <span className="text-green-600 font-medium text-sm">Completed</span>
                    ) : (
                      <button
                        onClick={() => handleUpdate(item.serviceRecord.id)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm"
                      >
                        Update
                      </button>
                    )}
                    {messages[item.serviceRecord.id] && (
                      <p
                        className={`mt-2 text-sm ${
                          messages[item.serviceRecord.id].type === 'success'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {messages[item.serviceRecord.id].text}
                      </p>
                    )}
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmDialog.open && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Confirm Status Change</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to mark this vehicle as <span className="font-semibold text-indigo-600">SERVICED</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmOk}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
              >
                OK, Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateStatus;
