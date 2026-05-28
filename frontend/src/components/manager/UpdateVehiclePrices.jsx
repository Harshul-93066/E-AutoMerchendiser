import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

const UpdateVehiclePrices = () => {
  const [vehicleModels, setVehicleModels] = useState([]);
  const [newPrices, setNewPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchVehicleModels();
  }, []);

  const fetchVehicleModels = async () => {
    try {
      const response = await api.get('/manager/vehicle-models');
      setVehicleModels(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch vehicle models');
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (id, value) => {
    setNewPrices((prev) => ({ ...prev, [id]: value }));
  };

  const handleUpdate = async (id) => {
    const price = newPrices[id];
    if (!price || isNaN(price) || Number(price) <= 0) {
      setError('Please enter a valid price');
      return;
    }

    setError('');
    setSuccess('');
    try {
      await api.put(`/manager/vehicle-models/${id}/price`, { price: Number(price) });
      setSuccess(`Price updated successfully for model ID: ${id}`);
      setNewPrices((prev) => ({ ...prev, [id]: '' }));
      fetchVehicleModels();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update price');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Loading vehicle models...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Update Vehicle Prices</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{error}</div>
      )}

      {success && (
        <div className="bg-green-100 text-green-700 p-4 rounded mb-6">{success}</div>
      )}

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Model Name</th>
                <th className="p-3 text-left">Make</th>
                <th className="p-3 text-left">Variant</th>
                <th className="p-3 text-left">Current Price</th>
                <th className="p-3 text-left">New Price</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {vehicleModels.map((model) => (
                <tr key={model.id} className="border-b">
                  <td className="p-3">{model.id}</td>
                  <td className="p-3">{model.modelName}</td>
                  <td className="p-3">{model.make}</td>
                  <td className="p-3">{model.variant}</td>
                  <td className="p-3">{'\u20B9'}{model.price?.toLocaleString('en-IN')}</td>
                  <td className="p-3">
                    <input
                      type="number"
                      value={newPrices[model.id] || ''}
                      onChange={(e) => handlePriceChange(model.id, e.target.value)}
                      placeholder="Enter new price"
                      className="border border-gray-300 rounded px-3 py-1 w-36"
                    />
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleUpdate(model.id)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UpdateVehiclePrices;
