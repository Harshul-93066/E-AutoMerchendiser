import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

const AllocateVehicle = () => {
  const [unallocatedRecords, setUnallocatedRecords] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [mechanicId, setMechanicId] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchUnallocated = async () => {
    setLoading(true);
    try {
      const response = await api.get('/supervisor/service-records?status=RECEIVED');
      setUnallocatedRecords(response.data);
    } catch (error) {
      console.error('Error fetching unallocated vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMechanics = async () => {
    try {
      const response = await api.get('/supervisor/mechanics');
      setMechanics(response.data);
    } catch (error) {
      console.error('Error fetching mechanics:', error);
    }
  };

  useEffect(() => {
    fetchUnallocated();
    fetchMechanics();
  }, []);

  const handleAllocate = async (e) => {
    e.preventDefault();
    if (!selectedRecord || !mechanicId) return;

    try {
      await api.post('/supervisor/allocate', {
        serviceRecordId: selectedRecord.id,
        mechanicId: parseInt(mechanicId),
        notes,
      });
      setMessage('Vehicle allocated successfully!');
      setSelectedRecord(null);
      setMechanicId('');
      setNotes('');
      fetchUnallocated();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error allocating vehicle:', error);
      setMessage('Failed to allocate vehicle.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Allocate Vehicle</h2>

      {message && (
        <div className="mb-4 p-3 rounded bg-green-100 text-green-800 font-medium">
          {message}
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border-collapse mb-6">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2 text-left">ID</th>
              <th className="border p-2 text-left">Vehicle No</th>
              <th className="border p-2 text-left">Model</th>
              <th className="border p-2 text-left">Make</th>
              <th className="border p-2 text-left">Customer</th>
              <th className="border p-2 text-left">Defects</th>
              <th className="border p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {unallocatedRecords.length === 0 ? (
              <tr>
                <td colSpan="7" className="border p-2 text-center text-gray-500">
                  No unallocated vehicles found.
                </td>
              </tr>
            ) : (
              unallocatedRecords.map((record) => (
                <tr
                  key={record.id}
                  className={`hover:bg-gray-50 ${
                    selectedRecord?.id === record.id ? 'bg-indigo-50' : ''
                  }`}
                >
                  <td className="border p-2">{record.id}</td>
                  <td className="border p-2">{record.vehicleNumber}</td>
                  <td className="border p-2">{record.modelName}</td>
                  <td className="border p-2">{record.make}</td>
                  <td className="border p-2">{record.customer?.fullName || '-'}</td>
                  <td className="border p-2">{record.defects}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => setSelectedRecord(record)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    >
                      Select
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {selectedRecord && (
        <div className="border rounded p-4 bg-gray-50">
          <h3 className="text-lg font-semibold mb-3">
            Allocate Vehicle: {selectedRecord.vehicleNumber} ({selectedRecord.modelName})
          </h3>
          <form onSubmit={handleAllocate} className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Mechanic</label>
              <select
                value={mechanicId}
                onChange={(e) => setMechanicId(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-full"
                required
              >
                <option value="">Select a mechanic</option>
                {mechanics.map((mechanic) => (
                  <option key={mechanic.id} value={mechanic.id}>
                    {mechanic.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-full"
                rows="3"
                placeholder="Enter any notes for the mechanic..."
              />
            </div>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Allocate
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AllocateVehicle;
