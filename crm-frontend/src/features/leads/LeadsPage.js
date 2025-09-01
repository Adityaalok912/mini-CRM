import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLeads } from "./leadsSlice";
import { Link } from "react-router-dom";
import Table from "../../components/Table";
import Pagination from "../../components/Pagination";
import Badge from "../../components/Badge";
import LeadForm from "./LeadForm";

const LeadsPage = () => {
  const dispatch = useDispatch();
  const { leads, status, error, pagination } = useSelector(
    (state) => state.leads
  );
  const [page, setPage] = useState(1);
   const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    dispatch(fetchLeads({ page: page, status: statusFilter, search }));
  }, [dispatch, page,statusFilter, search]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const leadColumns = [
    {
      header: "Name",
      cell: (lead) => (
        <Link
          to={`/leads/${lead._id}`}
          className="text-blue-600 hover:underline"
        >
          {lead.name}
        </Link>
      ),
    },
    { header: "Email", cell: (lead) => lead.email },
    {
      header: "Status",
      cell: (lead) => <Badge status={lead.status}>{lead.status}</Badge>,
    },
    {
      header: "Assigned Agent",
      cell: (lead) => lead.assignedAgent?.name || "Unassigned",
    },
  ];

  if (status === "loading" && leads.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">Loading leads...</div>
    );
  }

  if (status === "failed") {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Leads Management
      </h1>
      <LeadForm />
      <div className="flex space-x-4 mb-4">
        {/* Search bar */}
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-64"
        />

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Status</option>
          <option value="New">New</option>
          <option value="In Progress">In Progress</option>
          <option value="Closed Won">Closed Won</option>
          <option value="Closed Lost">Closed Lost</option>
        </select>

        <button
          onClick={() =>
            dispatch(fetchLeads({ page: 1, status: statusFilter, search }))
          }
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Apply
        </button>
      </div>

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
