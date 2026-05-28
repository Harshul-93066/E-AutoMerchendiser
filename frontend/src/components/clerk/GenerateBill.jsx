import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

const GenerateBill = () => {
  const [serviceRecords, setServiceRecords] = useState([]);
  const [billData, setBillData] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchServiceRecords();
  }, []);

  const fetchServiceRecords = async () => {
    try {
      const response = await api.get('/clerk/service-records');
      setServiceRecords(response.data);
    } catch (error) {
      console.error('Error fetching service records:', error);
      setMessage({ text: 'Failed to load service records.', type: 'error' });
    }
  };

  const handleGenerateBill = async (id) => {
    setLoading(true);
    setMessage({ text: '', type: '' });
    setBillData(null);

    try {
      const response = await api.get(`/clerk/service-records/${id}/bill`);
      setBillData(response.data);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to generate bill.';
      setMessage({ text: errorMsg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const closeBill = () => {
    setBillData(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Generate Bill</h2>

      {message.text && (
        <div
          className={`mb-4 p-3 rounded ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Service Records Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">ID</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Vehicle Number</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Model</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Make</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Status</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {serviceRecords.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center px-4 py-6 text-gray-500">
                  No service records found.
                </td>
              </tr>
            ) : (
              serviceRecords.map((record) => (
                <tr key={record.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{record.id}</td>
                  <td className="px-4 py-3 text-sm">{record.vehicleNumber}</td>
                  <td className="px-4 py-3 text-sm">{record.modelName}</td>
                  <td className="px-4 py-3 text-sm">{record.make}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        record.status === 'COMPLETED'
                          ? 'bg-green-100 text-green-700'
                          : record.status === 'IN_PROGRESS'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => handleGenerateBill(record.id)}
                      disabled={loading}
                      className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50 text-sm"
                    >
                      Generate Bill
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Bill Display Modal/Card */}
      {billData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Bill Details</h3>
              <button
                onClick={closeBill}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Vehicle Number:</span>
                <span className="text-gray-800">{billData.vehicleNumber}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Model Name:</span>
                <span className="text-gray-800">{billData.modelName}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Make:</span>
                <span className="text-gray-800">{billData.make}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Category:</span>
                <span className="text-gray-800">{billData.category}</span>
              </div>
              <div className="border-b pb-2">
                <span className="font-medium text-gray-600">Defects:</span>
                <p className="text-gray-800 mt-1">{billData.defects}</p>
              </div>
              <div className="border-b pb-2">
                <span className="font-medium text-gray-600">Work Description:</span>
                <p className="text-gray-800 mt-1">{billData.workDescription}</p>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Date of Submission:</span>
                <span className="text-gray-800">{billData.dateOfSubmission}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Status:</span>
                <span className="text-gray-800">{billData.status}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="font-bold text-gray-700 text-lg">Bill Amount:</span>
                <span className="font-bold text-indigo-600 text-lg">
                  Rs. {billData.billAmount}
                </span>
              </div>
            </div>

            <button
              onClick={closeBill}
              className="mt-6 w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateBill;
