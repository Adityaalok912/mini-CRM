import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateTaskStatus, updateTask, deleteTask } from "./tasksSlice";

const TaskDetail = ({ task, onClose }) => {
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...task });
    
  const handleStatusChange = (newStatus) => {
    dispatch(updateTaskStatus({ id: task._id, status: newStatus }));
  };

  const handleSave = () => {
    dispatch(updateTask({ id: task._id, taskData: formData }));
    setEditMode(false);
  };

  const handleDelete = () => {
    dispatch(deleteTask(task._id));
    if (onClose) onClose();
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      {editMode ? (
        <>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full p-2 border rounded mb-2"
          />
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full p-2 border rounded mb-2"
          />
          <button
            onClick={handleSave}
            className="bg-indigo-600 text-white px-4 py-2 rounded mr-2"
          >
            Save
          </button>
          <button
            onClick={() => setEditMode(false)}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-2">{task.title}</h2>
          <p className="mb-2">{task.description}</p>
          <p className="text-sm text-gray-500 mb-4">Status: {task.status}</p>

          <div className="space-x-2 mb-4">
            <button
              onClick={() => handleStatusChange("Open")}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Open
            </button>
            <button
              onClick={() => handleStatusChange("In Progress")}
              className="bg-yellow-500 text-white px-3 py-1 rounded"
            >
              In Progress
            </button>
            <button
              onClick={() => handleStatusChange("Done")}
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              Done
            </button>
          </div>

          <div className="space-x-2">
            <button
              onClick={() => setEditMode(true)}
              className="bg-indigo-600 text-white px-3 py-1 rounded"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="bg-gray-400 text-white px-3 py-1 rounded"
              >
                Close
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TaskDetail;
