import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

const RecordSale = () => {
  const [formData, setFormData] = useState({
    vehicleModelId: '',
    vehicleNumber: '',
    customerId: '',
    customerName: '',
    customerPhone: '',
    salePrice: '',
    saleDate: '',
  });

  const [vehicleModels, setVehicleModels] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [savedSale, setSavedSale] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ fullName: '', email: '', phone: '', password: '' });
  const [addingCustomer, setAddingCustomer] = useState(false);

  const fetchCustomers = () => {
    api.get('/clerk/customers').then(res => setCustomers(res.data)).catch(() => {});
  };

  useEffect(() => {
    api.get('/clerk/vehicle-models').then(res => setVehicleModels(res.data)).catch(() => {});
    fetchCustomers();
  }, []);

  const handleAddCustomer = async (e) => {
    e.preventDefault();
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'vehicleModelId') {
      const selected = vehicleModels.find(m => m.id === parseInt(value));
      setFormData(prev => ({ ...prev, vehicleModelId: value, salePrice: selected ? selected.price : '' }));
    } else if (name === 'customerId') {
      const selected = customers.find(c => c.id === parseInt(value));
      setFormData(prev => ({
        ...prev,
        customerId: value,
        customerName: selected ? selected.fullName : '',
        customerPhone: selected ? (selected.phone || '') : '',
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    setSavedSale(null);
    try {
      const res = await api.post('/clerk/sales', formData);
      setSavedSale(res.data);
      setMessage({ text: 'Sale recorded successfully!', type: 'success' });
      setFormData({ vehicleModelId: '', vehicleNumber: '', customerId: '', customerName: '', customerPhone: '', salePrice: '', saleDate: '' });
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'Failed to record sale.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Record Vehicle Sale</h2>

      {message.text && (
        <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {savedSale && (
        <div className="mb-6 p-4 bg-indigo-50 border border-indigo-300 rounded-lg">
          <p className="text-indigo-800 font-semibold text-lg">Sale ID: <span className="text-indigo-600">#{savedSale.id}</span></p>
          <p className="text-sm text-indigo-700 mt-1">
            Vehicle: <strong>{savedSale.vehicleModel?.modelName} ({savedSale.vehicleModel?.make})</strong> &nbsp;|&nbsp;
            Vehicle No: <strong>{savedSale.vehicleNumber || 'N/A'}</strong> &nbsp;|&nbsp;
            Customer: <strong>{savedSale.customerName}</strong>
          </p>
          <p className="text-xs text-indigo-500 mt-1">Note this Sale ID — it is used for delivery and service requests.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Model</label>
          <select name="vehicleModelId" value={formData.vehicleModelId} onChange={handleChange} required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">Select a vehicle model</option>
            {vehicleModels.map(m => (
              <option key={m.id} value={m.id}>
                {m.modelName} — {m.make} (₹{m.price?.toLocaleString('en-IN')})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Number (Chassis / Reg. No.)</label>
          <input type="text" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange}
            placeholder="e.g. KA01AB1234"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">Customer Account</label>
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
            <option value="">Select a registered customer</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>
                {c.fullName} — {c.email} {c.phone ? `| ${c.phone}` : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
            <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input type="text" name="customerPhone" value={formData.customerPhone} onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price (₹)</label>
            <input type="number" name="salePrice" value={formData.salePrice} onChange={handleChange} required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sale Date</label>
            <input type="date" name="saleDate" value={formData.saleDate} onChange={handleChange} required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50">
          {loading ? 'Recording...' : 'Record Sale'}
        </button>
      </form>
    </div>
  );
};

export default RecordSale;
