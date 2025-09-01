import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getCustomers, createCustomer, resetCustomersStatus } from './customersSlice';
import { FaUserCircle } from 'react-icons/fa';
import Pagination from '../../components/Pagination';

const Table = ({ data = [], columns = [], title }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 mt-6">
    <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length > 0 ? (
            data.map((row) => (
              <tr key={row._id}>
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {column.cell(row)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="p-4 text-center text-gray-500">No customers found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

const Modal = ({ title, message, onClose }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-700 mb-6">{message}</p>
      <div className="flex justify-end">
        <button onClick={onClose} className="bg-indigo-600 text-white py-2 px-4 rounded-lg">Close</button>
      </div>
    </div>
  </div>
);

const CustomersPage = () => {
  const dispatch = useDispatch();
  const { customers, status, error, pagination } = useSelector((state) => state.customers);

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '' });
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });
   const [page, setPage] = useState(1);


// useEffect(() => {
//   dispatch(getCustomers({ page: currentPage }));
// }, [dispatch, currentPage]);
useEffect(() => {
  dispatch(getCustomers({ page }));
}, [dispatch, page])

const handlePageChange = (newPage) => {
    setPage(newPage);
  };


  // useEffect(() => {
  //   if (status === 'idle') dispatch(getCustomers());
  //   // return () => dispatch(resetCustomersStatus());
  // }, [dispatch, status]);

  // useEffect(() => {
  //     dispatch(getCustomers(page));
  //   }, [dispatch, page]);

  const columns = [
    {
      header: 'Name',
      cell: (row) => (
        <Link to={`/customers/${row._id}`} className="text-indigo-600 hover:text-indigo-900 font-medium flex items-center gap-2">
          <FaUserCircle className="text-gray-400" /> {row.name}
        </Link>
      ),
    },
    { header: 'Email', cell: (row) => row.email },
    { header: 'Company', cell: (row) => row.company },
    { header: 'Date Created', cell: (row) => new Date(row.createdAt).toLocaleDateString() },
  ];

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setModalContent({ title: 'Validation Error', message: 'Name and email are required.' });
      setShowModal(true);
      return;
    }
    const result = await dispatch(createCustomer(formData));
    if (createCustomer.fulfilled.match(result)) {
      setModalContent({ title: 'Success', message: 'Customer created successfully.' });
      setFormData({ name: '', email: '', phone: '', company: '' });
    } else {
      setModalContent({ title: 'Error', message: result.payload || 'Failed to create customer.' });
    }
    setShowModal(true);
  };

  return (
    <div className="space-y-8 p-6 bg-gray-50 rounded-xl shadow-lg">
      {showModal && <Modal {...modalContent} onClose={() => setShowModal(false)} />}
      <h1 className="text-3xl font-bold text-gray-900">Customers</h1>

      {/* Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">Create New Customer</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          {['name', 'email', 'phone', 'company'].map((field) => (
            <input
              key={field}
              type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={formData[field]}
              onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required={field === 'name' || field === 'email'}
            />
          ))}
          <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg">Create Customer</button>
        </form>
      </div>

      {/* Table */}
      {status === 'loading' ? (
        <div className="text-center py-4">Loading customers...</div>
      ) : status === 'failed' ? (
        <div className="text-center py-4 text-red-500">Error: {error}</div>
      ) : (
        <Table data={customers || []} columns={columns} title="Customers" />

      )}
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default CustomersPage;
