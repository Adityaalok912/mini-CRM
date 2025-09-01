import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeads } from './leadsSlice';
import { Link } from 'react-router-dom';
import Table from '../../components/Table';
import Pagination from '../../components/Pagination';
import Badge from '../../components/Badge';
import LeadForm from './LeadForm';

const LeadsPage = () => {
  const dispatch = useDispatch();
  const { leads, status, error, pagination } = useSelector((state) => state.leads);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchLeads(page));
  }, [dispatch, page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const leadColumns = [
    { header: 'Name', cell: (lead) => <Link to={`/leads/${lead._id}`} className="text-blue-600 hover:underline">{lead.name}</Link> },
    { header: 'Email', cell: (lead) => lead.email },
    { header: 'Status', cell: (lead) => <Badge status={lead.status}>{lead.status}</Badge> },
    { header: 'Assigned Agent', cell: (lead) => lead.assignedAgent?.name || 'Unassigned' },
  ];

  if (status === 'loading' && leads.length === 0) {
    return <div className="p-8 text-center text-gray-500">Loading leads...</div>;
  }

  if (status === 'failed') {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Leads Management</h1>
      <LeadForm />
      <Table data={leads} columns={leadColumns} />
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default LeadsPage;
