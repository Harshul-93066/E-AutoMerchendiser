import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import ConfirmDialog from '../common/ConfirmDialog';

const AddVehicle = () => {
  const [vehicleModels, setVehicleModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [form, setForm] = useState({
    modelName: '',
    make: '',
    variant: '',
    price: '',
    stockQuantity: '',
    year: new Date().getFullYear(),
  });

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.modelName || !form.make || !form.price) {
      setError('Model Name, Make, and Price are required.');
      return;
    }

    try {
      await api.post('/manager/vehicle-models', {
        modelName: form.modelName,
        make: form.make,
        variant: form.variant,
        price: Number(form.price),
        stockQuantity: Number(form.stockQuantity) || 0,
        year: Number(form.year),
      });
      setSuccess('Vehicle model added successfully!');
      setForm({ modelName: '', make: '', variant: '', price: '', stockQuantity: '', year: new Date().getFullYear() });
      fetchVehicleModels();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add vehicle model');
    }
  };

  const handleDelete = async (id) => {
    setError('');
    setSuccess('');
    setDeletingId(id);
    try {
      await api.delete(`/manager/vehicle-models/${id}`);
      setSuccess('Vehicle model deleted successfully!');
      fetchVehicleModels();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete vehicle model');
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Vehicle</h1>

      {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-4 rounded mb-6">{success}</div>}

      {/* Add Vehicle Form */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">New Vehicle Model</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Model Name *</label>
            <input
              type="text"
              name="modelName"
              value={form.modelName}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Make *</label>
            <input
              type="text"
              name="make"
              value={form.make}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Variant</label>
            <input
              type="text"
              name="variant"
              value={form.variant}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 w-full"
              required
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
            <input
              type="number"
              name="stockQuantity"
              value={form.stockQuantity}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 w-full"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <input
              type="number"
              name="year"
              value={form.year}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 w-full"
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
            >
              Add Vehicle
            </button>
          </div>
        </form>
      </div>

      {/* Existing Vehicles List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Existing Vehicle Models</h2>
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Model Name</th>
                  <th className="p-3 text-left">Make</th>
                  <th className="p-3 text-left">Variant</th>
                  <th className="p-3 text-left">Price</th>
                  <th className="p-3 text-left">Stock</th>
                  <th className="p-3 text-left">Year</th>
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
                    <td className="p-3">{model.stockQuantity}</td>
                    <td className="p-3">{model.year}</td>
                    <td className="p-3">
                      <button
                        onClick={() => setConfirmDeleteId(model.id)}
                        disabled={deletingId === model.id}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50"
                      >
                        {deletingId === model.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmDeleteId !== null}
        title="Delete Vehicle Model"
        message="Are you sure you want to delete this vehicle model? This action cannot be undone."
        onCancel={() => setConfirmDeleteId(null)}
        onConfirm={() => handleDelete(confirmDeleteId)}
        confirmText="Delete"
        loading={deletingId !== null}
      />
    </div>
  );
};

export default AddVehicle;
