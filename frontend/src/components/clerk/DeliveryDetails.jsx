import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

const DeliveryDetails = () => {
  const [formData, setFormData] = useState({
    type: '',
    serviceRecordId: '',
    salesTransactionId: '',
    deliveryDate: '',
    deliveredTo: '',
    remarks: '',
  });

  const [serviceRecords, setServiceRecords] = useState([]);
  const [salesTransactions, setSalesTransactions] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (formData.type === 'SERVICED_VEHICLE') {
      api.get('/clerk/service-records')
        .then(res => {
          const approvedRecords = res.data.filter(r => r.status === 'APPROVED_FOR_DELIVERY');
          setServiceRecords(approvedRecords);
        })
        .catch(err => setMessage({ text: 'Failed to load service records: ' + (err.response?.data?.message || err.message), type: 'error' }));
    } else if (formData.type === 'NEW_VEHICLE') {
      api.get('/clerk/sales')
        .then(res => setSalesTransactions(res.data))
        .catch(err => setMessage({ text: 'Failed to load sales: ' + (err.response?.data?.message || err.message), type: 'error' }));
    }
  }, [formData.type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    const payload = {
      type: formData.type,
      deliveryDate: formData.deliveryDate,
      deliveredTo: formData.deliveredTo,
      remarks: formData.remarks,
    };

    if (formData.type === 'SERVICED_VEHICLE') {
      payload.serviceRecordId = formData.serviceRecordId;
    } else if (formData.type === 'NEW_VEHICLE') {
      payload.salesTransactionId = formData.salesTransactionId;
    }

    try {
      await api.post('/clerk/deliveries', payload);
      setMessage({ text: 'Delivery request submitted successfully! It has been sent to the supervisor for approval.', type: 'success' });
      setFormData({
        type: '',
        serviceRecordId: '',
        salesTransactionId: '',
        deliveryDate: '',
        deliveredTo: '',
        remarks: '',
      });
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to record delivery.';
      setMessage({ text: errorMsg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Record Delivery Details</h2>

      {message.text && (
        <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select delivery type</option>
            <option value="NEW_VEHICLE">New Vehicle</option>
            <option value="SERVICED_VEHICLE">Serviced Vehicle</option>
          </select>
        </div>

        {formData.type === 'NEW_VEHICLE' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sale Record</label>
            <select
              name="salesTransactionId"
              value={formData.salesTransactionId}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select a sale</option>
              {salesTransactions.map((sale) => (
                <option key={sale.id} value={sale.id}>
                  Sale #{sale.id} — {sale.customerName} — {sale.vehicleModel?.modelName} ({sale.vehicleModel?.make}){sale.vehicleNumber ? ` — ${sale.vehicleNumber}` : ''} | {sale.saleDate}
                </option>
              ))}
            </select>
          </div>
        )}

        {formData.type === 'SERVICED_VEHICLE' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Record</label>
            <select
              name="serviceRecordId"
              value={formData.serviceRecordId}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select a service record</option>
              {serviceRecords.map((record) => (
                <option key={record.id} value={record.id}>
                  #{record.id} — {record.vehicleNumber} | {record.modelName} ({record.status})
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Date</label>
          <input
            type="date"
            name="deliveryDate"
            value={formData.deliveryDate}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Delivered To</label>
          <input
            type="text"
            name="deliveredTo"
            value={formData.deliveredTo}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Record Delivery'}
        </button>
      </form>
    </div>
  );
};

export default DeliveryDetails;
