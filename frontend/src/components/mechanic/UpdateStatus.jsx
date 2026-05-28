import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

const UpdateStatus = () => {
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusValues, setStatusValues] = useState({});
  const [workDescriptions, setWorkDescriptions] = useState({});
  const [messages, setMessages] = useState({});

  useEffect(() => {
    fetchAllocatedVehicles();
  }, []);

  const fetchAllocatedVehicles = async () => {
    try {
      const response = await api.get('/mechanic/allocated');
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

  const updateStatus = async (serviceRecordId) => {
    try {
      await api.put(`/mechanic/service-records/${serviceRecordId}/status`, {
        status: statusValues[serviceRecordId],
      });
      setMessages((prev) => ({
        ...prev,
        [serviceRecordId]: { type: 'success', text: 'Status updated successfully!' },
      }));
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
        [serviceRecordId]: { type: 'error', text: 'Failed to update status.' },
      }));
    }
  };

  const updateWorkInfo = async (serviceRecordId) => {
    try {
      await api.put(`/mechanic/service-records/${serviceRecordId}/work-info`, {
        workDescription: workDescriptions[serviceRecordId],
      });
      setMessages((prev) => ({
        ...prev,
        [serviceRecordId]: { type: 'success', text: 'Work description updated successfully!' },
      }));
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
        [serviceRecordId]: { type: 'error', text: 'Failed to update work description.' },
      }));
    }
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
              {allocations.map((item) => (
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
                    >
                      <option value="NOT_ATTENDED">NOT_ATTENDED</option>
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
                    />
                  </td>
                  <td className="p-3">
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => updateStatus(item.serviceRecord.id)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                      >
                        Update Status
                      </button>
                      <button
                        onClick={() => updateWorkInfo(item.serviceRecord.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                      >
                        Update Work Info
                      </button>
                    </div>
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
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UpdateStatus;
