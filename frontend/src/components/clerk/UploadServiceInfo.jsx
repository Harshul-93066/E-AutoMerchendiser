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
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ fullName: '', email: '', phone: '', password: '' });
  const [addingCustomer, setAddingCustomer] = useState(false);

  const fetchCustomers = () => {
    api.get('/clerk/customers').then(res => setCustomers(res.data)).catch(() => {});
  };

  useEffect(() => {
    fetchCustomers();
    api.get('/clerk/service-categories').then(res => setCategories(res.data)).catch(() => {});
    api.get('/clerk/sales/all').then(res => setPurchases(res.data)).catch(() => {});
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

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    if (!newCustomer.fullName || !newCustomer.email || !newCustomer.password) {
      setMessage({ text: 'Name, email and password are required.', type: 'error' });
      return;
    }
    setAddingCustomer(true);
    try {
      await api.post('/auth/register', { ...newCustomer, role: 'CUSTOMER' });
      setMessage({ text: 'Customer added successfully!', type: 'success' });
      setNewCustomer({ fullName: '', email: '', phone: '', password: '' });
      setShowAddCustomer(false);
      fetchCustomers();
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'Failed to add customer.', type: 'error' });
    } finally {
      setAddingCustomer(false);
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
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">Customer</label>
            <button type="button" onClick={() => setShowAddCustomer(!showAddCustomer)}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
              {showAddCustomer ? '✕ Cancel' : '+ Add New Customer'}
            </button>
          </div>

          {showAddCustomer && (
            <div className="mb-3 p-3 border border-indigo-200 rounded bg-indigo-50">
              <p className="text-sm font-medium text-indigo-700 mb-2">Quick Add Customer</p>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input type="text" placeholder="Full Name *" value={newCustomer.fullName}
                  onChange={e => setNewCustomer(prev => ({ ...prev, fullName: e.target.value }))}
                  className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                <input type="email" placeholder="Email *" value={newCustomer.email}
                  onChange={e => setNewCustomer(prev => ({ ...prev, email: e.target.value }))}
                  className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                <input type="text" placeholder="Phone" value={newCustomer.phone}
                  onChange={e => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
                  className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                <input type="password" placeholder="Password *" value={newCustomer.password}
                  onChange={e => setNewCustomer(prev => ({ ...prev, password: e.target.value }))}
                  className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
              </div>
              <button type="button" onClick={handleAddCustomer} disabled={addingCustomer || !newCustomer.fullName || !newCustomer.email || !newCustomer.password}
                className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700 disabled:opacity-50">
                {addingCustomer ? 'Adding...' : 'Add Customer'}
              </button>
            </div>
          )}

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
