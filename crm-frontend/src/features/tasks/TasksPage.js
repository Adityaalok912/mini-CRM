import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTasks, updateTaskStatus, createTask } from "./tasksSlice";
import Pagination from "../../components/Pagination";
import TaskDetail from "./TaskDetail";
// import { format } from "date-fns";

const Table = ({ data = [], columns = [], title }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 mt-6">
    <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Array.isArray(data) && data.length > 0 ? (
            data.map((row) => (
              <tr key={row._id}>
                {columns.map((col, i) => (
                  <td
                    key={i}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {col.cell(row)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="p-4 text-center text-gray-500"
              >
                No tasks found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

const TasksPage = () => {
  const [selectedTask, setSelectedTask] = useState(null);

  const dispatch = useDispatch();
  const { tasks, status, error, pagination } = useSelector(
    (state) => state.tasks
  );
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(getTasks({ page }));
  }, [dispatch, page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // const handleStatusChange = (taskId, newStatus) => {
  //   dispatch(updateTaskStatus({ id: taskId, status: newStatus })).then(() =>
  //     dispatch(getTasks({ page }))
  //   ); // Refresh list after update
  // };

  const [formData, setFormData] = useState({
    title: "",
    relatedTo: "Lead",
    description: "",
    dueDate: "",
    priority: "Medium",
  });
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "" });

  const columns = [
    {
      header: "Title",
      cell: (row) => (
        <button
          onClick={() => setSelectedTask(row)}
          className="text-blue-600 underline"
        >
          {row.title}
        </button>
      ),
    },
    { header: "related To", cell: (row) => row.relatedTo || "N/A" },
    { header: "Status", cell: (row) => row.status },
    { header: "Priority", cell: (row) => row.priority },
    { header: "owner", cell: (row) => row.owner.name },
    { header: "description", cell: (row) => row.description },
    {
      header: "Due date",
      cell: (row) =>
        row.dueDate
          ? new Date(row.dueDate).toLocaleString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "N/A",
    },
    // { header: "owner", cell: (row) => row.d },
  ];

  return (
    <div className="space-y-8 p-6 bg-gray-50 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">Create New Task</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const result = await dispatch(createTask(formData));
            if (createTask.fulfilled.match(result)) {
              setModalContent({
                title: "Success",
                message: "Task created successfully.",
              });
              setFormData({
                title: "",
                relatedTo: "Lead",
                description: "",
                dueDate: "",
                priority: "Medium",
              });
            } else {
              setModalContent({
                title: "Error",
                message: result.payload || "Failed to create task.",
              });
            }
            setShowModal(true);
          }}
          className="space-y-4"
        >
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
          <select
            name="status"
            value={formData.relatedTo}
            onChange={(e) =>
              setFormData({ ...formData, relatedTo: e.target.value })
            }
            className="w-full p-3 border rounded-lg"
          >
            <option value="Lead">Lead</option>
            <option value="Customer">Customer</option>
          </select>
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) =>
              setFormData({ ...formData, dueDate: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
          <select
            value={formData.priority}
            onChange={(e) =>
              setFormData({ ...formData, priority: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg"
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg"
          >
            Create Task
          </button>
        </form>
      </div>

      {status === "loading" ? (
        <div className="text-center py-4">Loading tasks...</div>
      ) : status === "failed" ? (
        <div className="text-center py-4 text-red-500">Error: {error}</div>
      ) : (
        <Table data={tasks || []} columns={columns} title="Task List" />
      )}
      {selectedTask && (
        <TaskDetail task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default TasksPage;
