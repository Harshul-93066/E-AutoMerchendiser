import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

const UploadServiceInfo = () => {
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    modelName: '',
    make: '',
    customerId: '',
    categoryId: '',
    dateOfSubmission: '',
    expectedDeliveryDate: '',
    defects: '',
  });

  const [customers, setCustomers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/clerk/customers').then(res => setCustomers(res.data)).catch(() => {});
    api.get('/clerk/service-categories').then(res => setCategories(res.data)).catch(() => {});
    api.get('/clerk/sales').then(res => setPurchases(res.data)).catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // When a purchase record is selected, auto-fill vehicle details
  const handlePurchaseSelect = (e) => {
    const saleId = parseInt(e.target.value);
    if (!saleId) return;
    const sale = purchases.find(p => p.id === saleId);
    if (sale) {
      setFormData(prev => ({
        ...prev,
        vehicleNumber: sale.vehicleNumber || '',
        modelName: sale.vehicleModel?.modelName || '',
        make: sale.vehicleModel?.make || '',
        customerId: sale.customer?.id ? String(sale.customer.id) : prev.customerId,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      await api.post('/clerk/service-records', formData);
      setMessage({ text: 'Service record created successfully!', type: 'success' });
      setFormData({ vehicleNumber: '', modelName: '', make: '', customerId: '', categoryId: '', dateOfSubmission: '', expectedDeliveryDate: '', defects: '' });
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'Failed to create service record.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Upload Service Information</h2>

      {message.text && (
        <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {/* Optional: pre-fill from a purchase record */}
      <div className="mb-5 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <label className="block text-sm font-semibold text-blue-800 mb-1">
          Auto-fill from Purchase Record (optional)
        </label>
        <select onChange={handlePurchaseSelect} defaultValue=""
          className="w-full border border-blue-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
          <option value="">— Select a sale to auto-fill vehicle details —</option>
          {purchases.map(p => (
            <option key={p.id} value={p.id}>
              Sale #{p.id} — {p.customerName} — {p.vehicleModel?.modelName} ({p.vehicleModel?.make})
              {p.vehicleNumber ? ` — ${p.vehicleNumber}` : ''}
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Number</label>
          <input type="text" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} required
            placeholder="e.g. KA01AB1234"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Model Name</label>
            <input type="text" name="modelName" value={formData.modelName} onChange={handleChange} required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
            <input type="text" name="make" value={formData.make} onChange={handleChange} required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
          <select name="customerId" value={formData.customerId} onChange={handleChange} required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">Select a customer</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>
                {c.fullName} — {c.email} {c.phone ? `| ${c.phone}` : ''}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Service Category</label>
          <select name="categoryId" value={formData.categoryId} onChange={handleChange} required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.categoryName} — ₹{cat.charges?.toLocaleString('en-IN')}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Submission</label>
            <input type="date" name="dateOfSubmission" value={formData.dateOfSubmission} onChange={handleChange} required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expected Delivery Date</label>
            <input type="date" name="expectedDeliveryDate" value={formData.expectedDeliveryDate} onChange={handleChange} required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Defects</label>
          <textarea name="defects" value={formData.defects} onChange={handleChange} required rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>

        <button type="submit" disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50">
          {loading ? 'Submitting...' : 'Submit Service Record'}
        </button>
      </form>
    </div>
  );
};

export default UploadServiceInfo;
