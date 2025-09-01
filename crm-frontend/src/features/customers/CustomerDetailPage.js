import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCustomerById, updateCustomer, addNoteToCustomer, resetCurrentCustomer,  deleteCustomer } from './customersSlice';
import { FaUserCircle, FaEnvelope, FaBuilding, FaPhone, FaTags, FaStickyNote, FaPaperclip } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Modal from "../../components/Modal"
// Reusable Badge component for tags
const Badge = ({ children, color }) => {
  const baseClasses = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full';
  const colorClasses = {
    'VIP': 'bg-yellow-100 text-yellow-800',
    'Enterprise': 'bg-purple-100 text-purple-800',
    'Follow-up': 'bg-blue-100 text-blue-800',
    'Customer': 'bg-teal-100 text-teal-800',
    'Done': 'bg-green-100 text-green-800',
    'In Progress': 'bg-yellow-100 text-yellow-800',
    'Open': 'bg-blue-100 text-blue-800',
    'High': 'bg-red-100 text-red-800',
    'Medium': 'bg-yellow-100 text-yellow-800',
    'Low': 'bg-gray-100 text-gray-800',
  };
  return (
    <span className={`${baseClasses} ${colorClasses[color]}`.trim()}>
      {children}
    </span>
  );
};

// Reusable Table component from previous code
const Table = ({ data, columns, title }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 mt-6">
    <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th key={index} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row) => (
            <tr key={row._id}>
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const CustomerDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentCustomer: customer, status, error } = useSelector((state) => state.customers);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [newNote, setNewNote] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });

  useEffect(() => {
    dispatch(getCustomerById(id));
    return () => {
      dispatch(resetCurrentCustomer());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        company: customer.company,
        email: customer.email,
        phone: customer.phone,
        tags: customer.tags.join(', ')
      });
    }
  }, [customer]);

  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;

    const result = await dispatch(deleteCustomer(id));

    if (deleteCustomer.fulfilled.match(result)) {
      setModalContent({ title: 'Deleted', message: 'Customer deleted successfully.' });
      setShowModal(true);
      setTimeout(() => navigate('/customers'), 1500);
    } else {
      setModalContent({ title: 'Error', message: result.payload || 'Failed to delete customer.' });
      setShowModal(true);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updatedTags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    const updatedData = { ...formData, tags: updatedTags };

    const result = await dispatch(updateCustomer({ id, customerData: updatedData }));
    
    if (updateCustomer.fulfilled.match(result)) {
      setModalContent({ title: 'Success', message: 'Customer updated successfully.' });
      setShowModal(true);
      setIsEditing(false);
    } else {
      setModalContent({ title: 'Error', message: result.payload || 'Failed to update customer.' });
      setShowModal(true);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (newNote.trim() === '') {
      setModalContent({ title: 'Validation Error', message: 'Note cannot be empty.' });
      setShowModal(true);
      return;
    }
    const result = await dispatch(addNoteToCustomer({ id, note: newNote }));
    
    if (addNoteToCustomer.fulfilled.match(result)) {
      setNewNote('');
      setModalContent({ title: 'Success', message: 'Note added successfully.' });
      setShowModal(true);
    } else {
      setModalContent({ title: 'Error', message: result.payload || 'Failed to add note.' });
      setShowModal(true);
    }
  };

  if (status === 'loading') {
    return <div className="p-6 text-center text-gray-500">Loading customer details...</div>;
  }

  if (status === 'failed' || !customer) {
    return <div className="p-6 text-center text-red-500">Error: {error || 'Customer not found.'}</div>;
  }

  return (
    <div className="space-y-8 p-6 bg-gray-50 rounded-xl shadow-lg">
      <script src="https://cdn.tailwindcss.com"></script>
      {showModal && <Modal {...modalContent} onClose={() => setShowModal(false)} />}

      {/* Customer Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <FaUserCircle className="text-5xl text-indigo-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{customer.name}</h1>
            <p className="text-sm text-gray-500">Last updated: {new Date(customer.updatedAt).toLocaleString()}</p>
          </div>
        </div>
        <div className="flex gap-2">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-600 transition-colors"
        >
          {isEditing ? 'Cancel' : 'Edit Customer'}
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-red-600 transition-colors"
        >
          Delete Customer
        </button>
      </div>
      </div>

      {/* Customer Details */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Customer Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <FaEnvelope className="text-indigo-500 text-xl" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              ) : (
                <p className="font-medium text-gray-900">{customer.email}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FaBuilding className="text-indigo-500 text-xl" />
            <div>
              <p className="text-sm text-gray-500">Company</p>
              {isEditing ? (
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              ) : (
                <p className="font-medium text-gray-900">{customer.company || 'N/A'}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FaPhone className="text-indigo-500 text-xl" />
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              ) : (
                <p className="font-medium text-gray-900">{customer.phone || 'N/A'}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FaTags className="text-indigo-500 text-xl" />
            <div>
              <p className="text-sm text-gray-500">Tags</p>
              {isEditing ? (
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="Enter tags, separated by commas"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {customer.tags.length > 0 ? (
                    customer.tags.map((tag, index) => <Badge key={index} color={tag}>{tag}</Badge>)
                  ) : (
                    <p className="font-medium text-gray-900">N/A</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        {isEditing && (
          <button
            onClick={handleUpdate}
            className="mt-6 bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-green-700 transition-colors"
          >
            Save Changes
          </button>
        )}
      </div>

      {/* Notes Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2"><FaStickyNote /> Notes</h2>
        <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
          {customer.notes.length > 0 ? (
            customer.notes.map((note, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">{new Date(note.createdAt).toLocaleString()}</p>
                <p className="text-gray-800">{note.body}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No notes yet.</p>
          )}
        </div>
        <form onSubmit={handleAddNote} className="flex gap-2">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a new note..."
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
          >
            Add Note
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerDetailPage;
