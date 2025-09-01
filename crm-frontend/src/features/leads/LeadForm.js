import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createLead, fetchLeads } from './leadsSlice';

const LeadForm = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    source: '',
    status: 'New',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(createLead(formData)).unwrap();
      await dispatch(fetchLeads(1)); // refresh list
      setFormData({ name: '', email: '', phone: '', source: '', status: 'New' });
      alert('Lead created successfully!');
    } catch (err) {
      alert(err.message || 'Error creating lead');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-2xl font-semibold mb-4">Add New Lead</h2>
      <input
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full p-3 border rounded-lg"
        required
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="w-full p-3 border rounded-lg"
        required
      />
      <input
        name="phone"
        placeholder="Phone"
        value={formData.phone}
        onChange={handleChange}
        className="w-full p-3 border rounded-lg"
      />
      <input
        name="source"
        placeholder="Source"
        value={formData.source}
        onChange={handleChange}
        className="w-full p-3 border rounded-lg"
      />
      {/* <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        className="w-full p-3 border rounded-lg"
      >
        <option value="New">New</option>
        <option value="In Progress">In Progress</option>
        <option value="Closed Won">Closed Won</option>
        <option value="Closed Won">Closed Won</option>
      </select> */}
      <button
        type="submit"
        disabled={loading}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
      >
        {loading ? 'Creating...' : 'Create Lead'}
      </button>
    </form>
  );
};

export default LeadForm;
