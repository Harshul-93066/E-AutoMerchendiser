import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

const UpdateServiceCharges = () => {
  const [categories, setCategories] = useState([]);
  const [newCharges, setNewCharges] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/manager/service-categories');
      setCategories(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch service categories');
    } finally {
      setLoading(false);
    }
  };

  const handleChargesChange = (id, value) => {
    setNewCharges((prev) => ({ ...prev, [id]: value }));
  };

  const handleUpdate = async (id) => {
    const charges = newCharges[id];
    if (!charges || isNaN(charges) || Number(charges) <= 0) {
      setError('Please enter valid charges');
      return;
    }

    setError('');
    setSuccess('');
    try {
      await api.put(`/manager/service-categories/${id}/charges`, { charges: Number(charges) });
      setSuccess(`Charges updated successfully for category ID: ${id}`);
      setNewCharges((prev) => ({ ...prev, [id]: '' }));
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update charges');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Loading service categories...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Update Service Charges</h1>

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
                <th className="p-3 text-left">Category Name</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Current Charges</th>
                <th className="p-3 text-left">New Charges</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-b">
                  <td className="p-3">{category.id}</td>
                  <td className="p-3">{category.categoryName}</td>
                  <td className="p-3">{category.description}</td>
                  <td className="p-3">{'\u20B9'}{category.charges?.toLocaleString('en-IN')}</td>
                  <td className="p-3">
                    <input
                      type="number"
                      value={newCharges[category.id] || ''}
                      onChange={(e) => handleChargesChange(category.id, e.target.value)}
                      placeholder="Enter new charges"
                      className="border border-gray-300 rounded px-3 py-1 w-36"
                    />
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleUpdate(category.id)}
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

export default UpdateServiceCharges;
