import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import ConfirmDialog from '../common/ConfirmDialog';

const AddServiceCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [form, setForm] = useState({
    categoryName: '',
    description: '',
    charges: '',
  });

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.categoryName || !form.charges) {
      setError('Category Name and Charges are required.');
      return;
    }

    try {
      await api.post('/manager/service-categories', {
        categoryName: form.categoryName,
        description: form.description,
        charges: Number(form.charges),
      });
      setSuccess('Service category added successfully!');
      setForm({ categoryName: '', description: '', charges: '' });
      fetchCategories();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add service category');
    }
  };

  const handleDelete = async (id) => {
    setError('');
    setSuccess('');
    setDeletingId(id);
    try {
      await api.delete(`/manager/service-categories/${id}`);
      setSuccess('Service category deleted successfully!');
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete service category');
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Service Category</h1>

      {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-4 rounded mb-6">{success}</div>}

      {/* Add Service Category Form */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">New Service Category</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category Name *</label>
            <input
              type="text"
              name="categoryName"
              value={form.categoryName}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Charges (₹) *</label>
            <input
              type="number"
              name="charges"
              value={form.charges}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 w-full"
              required
              min="1"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 w-full"
              rows="3"
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
            >
              Add Service Category
            </button>
          </div>
        </form>
      </div>

      {/* Existing Categories List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Existing Service Categories</h2>
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Category Name</th>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-left">Charges</th>
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
                      <button
                        onClick={() => setConfirmDeleteId(category.id)}
                        disabled={deletingId === category.id}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50"
                      >
                        {deletingId === category.id ? 'Deleting...' : 'Delete'}
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
        title="Delete Service Category"
        message="Are you sure you want to delete this service category? This action cannot be undone."
        onCancel={() => setConfirmDeleteId(null)}
        onConfirm={() => handleDelete(confirmDeleteId)}
        confirmText="Delete"
        loading={deletingId !== null}
      />
    </div>
  );
};

export default AddServiceCategory;
