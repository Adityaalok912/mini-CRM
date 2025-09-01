import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLeadById,
  convertLead,
  deleteLead,
  updateLead,
} from "./leadsSlice";
import Modal from "../../components/Modal";
import Badge from "../../components/Badge";

const LeadDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { lead, status, error } = useSelector((state) => state.leads);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const handleDelete = () => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    setIsDeleting(true);
    dispatch(deleteLead(id))
      .unwrap()
      .then(() => navigate("/leads"))
      .catch((err) => {
        console.error(err);
        setIsDeleting(false);
      });
  };

  useEffect(() => {
    dispatch(fetchLeadById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name || "",
        email: lead.email || "",
        phone: lead.phone || "",
        status: lead.status || "New",
        source: lead.source || "",
        assignedAgent: lead.assignedAgent || "",
        agentEmail: lead.assignedAgent.email,
      });
    }
  }, [lead]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateLead({ id, leadData: formData })).unwrap();
      setIsEditing(false);
      alert("Lead updated successfully");
    } catch (err) {
      alert(err.message || "Update failed");
    }
  };

  const handleConvert = () => {
    dispatch(convertLead(id)).then(() => {
      setIsModalOpen(false);
      navigate("/leads");
    });
  };

  if (status === "loading" && !lead) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading lead details...
      </div>
    );
  }

  if (status === "failed" || !lead) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p className="text-red-500">{error || "Lead not found."}</p>
        <button
          onClick={() => navigate("/leads")}
          className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
        >
          Back to list
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{lead.name}</h1>
        <button
          onClick={() => navigate("/leads")}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow-sm hover:bg-gray-300 transition-colors"
        >
          Back to Leads
        </button>
      </div>
      <div className="mt-6 flex gap-2">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700"
        >
          {isEditing ? "Cancel Edit" : "Edit Lead"}
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700"
        >
          Convert to Customer
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700"
        >
          {isDeleting ? "Deleting..." : "Delete Lead"}
        </button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {isEditing ? (
          <form onSubmit={handleUpdate} className="space-y-4">
            <input
              name="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full p-2 border rounded-lg"
              placeholder="Name"
              required
            />
            <input
              name="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full p-2 border rounded-lg"
              placeholder="Email"
              type="email"
              required
            />
            <input
              name="phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full p-2 border rounded-lg"
              placeholder="Phone"
            />
            <input
              name="source"
              value={formData.source}
              onChange={(e) =>
                setFormData({ ...formData, source: e.target.value })
              }
              className="w-full p-2 border rounded-lg"
              placeholder="Source"
            />
            <input
              type="email"
              name="agentEmail"
              value={formData.agentEmail || ""}
              onChange={(e) =>
                setFormData({ ...formData, agentEmail: e.target.value })
              }
              className="w-full border px-3 py-2 rounded"
              placeholder="Enter agent's email"
            />
            <select
              name="status"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full p-2 border rounded-lg"
            >
              <option value="New">New</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed Won">Closed Won</option>
              <option value="Closed Won">Closed Won</option>
            </select>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <p className="text-gray-600 mb-2">
              <strong>Email:</strong> {lead.email}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Phone:</strong> {lead.phone}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Status:</strong>{" "}
              <Badge status={lead.status}>{lead.status}</Badge>
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Source:</strong> {lead.source}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Assigned Agent:</strong>{" "}
              {lead.assignedAgent?.name || "Unassigned"}
            </p>
          </>
        )}
      </div>

      {/* <div className="mt-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors"
        >
          Convert to Customer
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700"
        >
          {isDeleting ? "Deleting..." : "Delete Lead"}
        </button>
      </div> */}

      <Modal
        show={isModalOpen}
        title="Confirm Conversion"
        onClose={() => setIsModalOpen(false)}
      >
        <p>Are you sure you want to convert this lead to a customer?</p>
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleConvert}
            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
          >
            Confirm
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default LeadDetailPage;
