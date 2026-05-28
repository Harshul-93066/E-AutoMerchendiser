import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

const AllocatedVehicles = () => {
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAllocatedVehicles();
  }, []);

  const fetchAllocatedVehicles = async () => {
    try {
      const response = await api.get('/mechanic/allocated');
      setAllocations(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch allocated vehicles');
      setLoading(false);
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
      <h2 className="text-2xl font-bold mb-6">Allocated Vehicles</h2>
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
                <th className="bg-gray-200 p-3 text-left">Make</th>
                <th className="bg-gray-200 p-3 text-left">Defects</th>
                <th className="bg-gray-200 p-3 text-left">Status</th>
                <th className="bg-gray-200 p-3 text-left">Allocated Date</th>
              </tr>
            </thead>
            <tbody>
              {allocations.map((item) => (
                <tr key={item.serviceRecord.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-3">{item.serviceRecord.id}</td>
                  <td className="p-3">{item.serviceRecord.vehicleNumber}</td>
                  <td className="p-3">{item.serviceRecord.modelName}</td>
                  <td className="p-3">{item.serviceRecord.make}</td>
                  <td className="p-3">{item.serviceRecord.defects}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 rounded text-sm bg-blue-100 text-blue-800">
                      {item.serviceRecord.status}
                    </span>
                  </td>
                  <td className="p-3">{new Date(item.allocatedDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllocatedVehicles;
