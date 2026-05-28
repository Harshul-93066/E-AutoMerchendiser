import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

const statusColors = {
  RECEIVED: 'bg-gray-200 text-gray-800',
  ALLOCATED: 'bg-blue-200 text-blue-800',
  UNDER_SERVICING: 'bg-yellow-200 text-yellow-800',
  SERVICED: 'bg-green-200 text-green-800',
  APPROVED_FOR_DELIVERY: 'bg-purple-200 text-purple-800',
  DELIVERED: 'bg-emerald-200 text-emerald-800',
};

const VehicleStatus = () => {
  const [serviceRecords, setServiceRecords] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      api.get('/customer/vehicle-status'),
      api.get('/customer/purchases'),
    ])
      .then(([serviceRes, purchaseRes]) => {
        setServiceRecords(serviceRes.data);
        setPurchases(purchaseRes.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch data. Please try again.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-8 text-gray-500">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

  return (
    <div className="p-6 space-y-10">

      {/* My Purchases */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">My Purchases</h2>
        {purchases.length === 0 ? (
          <p className="text-gray-500">No vehicle purchases found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {purchases.map(sale => (
              <div key={sale.id} className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-500">
                <h3 className="text-lg font-bold text-indigo-700 mb-1">
                  {sale.vehicleModel?.modelName}
                </h3>
                <p className="text-gray-500 text-sm mb-3">{sale.vehicleModel?.make} — {sale.vehicleModel?.variant}</p>
                <div className="space-y-1 text-sm">
                  <div><span className="font-semibold text-gray-700">Sale Price: </span>
                    <span className="text-green-700 font-semibold">₹{sale.salePrice?.toLocaleString('en-IN')}</span>
                  </div>
                  <div><span className="font-semibold text-gray-700">Date of Purchase: </span>
                    <span className="text-gray-600">{sale.saleDate ? new Date(sale.saleDate).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div><span className="font-semibold text-gray-700">Purchased By: </span>
                    <span className="text-gray-600">{sale.customerName}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Service History */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Service History</h2>
        {serviceRecords.length === 0 ? (
          <p className="text-gray-500">No vehicles currently in service.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceRecords.map(v => (
              <div key={v.id} className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-400">
                <h3 className="text-xl font-bold mb-1">{v.vehicleNumber}</h3>
                <p className="text-gray-600 text-sm mb-3">{v.modelName} — {v.make}</p>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[v.status] || 'bg-gray-200 text-gray-800'}`}>
                  {v.status}
                </span>
                <div className="mt-3 space-y-1 text-sm">
                  {v.defects && (
                    <div><span className="font-semibold text-gray-700">Defects: </span>
                      <span className="text-gray-600">{v.defects}</span></div>
                  )}
                  {v.workDescription && (
                    <div><span className="font-semibold text-gray-700">Work Done: </span>
                      <span className="text-gray-600">{v.workDescription}</span></div>
                  )}
                  <div><span className="font-semibold text-gray-700">Submitted: </span>
                    <span className="text-gray-600">{v.dateOfSubmission ? new Date(v.dateOfSubmission).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div><span className="font-semibold text-gray-700">Expected Delivery: </span>
                    <span className="text-gray-600">{v.expectedDeliveryDate ? new Date(v.expectedDeliveryDate).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
};

export default VehicleStatus;
