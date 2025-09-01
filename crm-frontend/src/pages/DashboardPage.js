import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLatestActivity } from "../features/activity/activitySlice";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import {
  getLeadStats,
  getLeadsStatusCount,
} from "../features/leads/leadsSlice";
import { getCustomersCount } from "../features/customers/customersSlice";
import {
  getOpenTasksCount,
  getOverdueTasks,
} from "../features/tasks/tasksSlice";

const Card = ({ title, count }) => (
  <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between">
    <div>
      <div className="text-sm font-semibold text-gray-500">{title}</div>
      <div className="text-3xl font-bold text-gray-900 mt-1">{count}</div>
    </div>
  </div>
);

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { activities, status } = useSelector((state) => state.activity);
  const {
    stats,
    status: leadsStatus,
    statusCount: leadsStatusCount,
  } = useSelector((state) => state.leads);
  const { count: customerCount } = useSelector((state) => state.customers);
  const { openCount: openTasks, overdue } = useSelector((state) => state.tasks);
  // TODO: replace with real slices later
  const leads = []; // from leadsSlice
  const customers = []; // from customersSlice
  const tasks = []; // from tasksSlice

  useEffect(() => {
    dispatch(getLatestActivity());
    dispatch(getLeadStats());
    dispatch(getCustomersCount());
    dispatch(getLeadsStatusCount());
    dispatch(getOpenTasksCount());
    dispatch(getOverdueTasks());
  }, [dispatch]);

  // === Analytics Counts ===
  const totalCustomers = customers.length;
  const myOpenTasks = tasks.filter(
    (t) => t.status !== "Done" // adjust if you have "Open"
  ).length;

  // Count leads by status
  const leadsByStatus = leads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {});

  // === Activity Feed ===
  const recentActivity = activities.slice(0, 10);

  return (
    <div className="p-8 space-y-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Dashboard Overview
      </h2>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Total Customers" count={customerCount} />
        <Card title="My Open Tasks" count={openTasks} />
        {Object.entries(leadsStatusCount).map(([status, count]) => (
          <Card key={status} title={`Leads: ${status}`} count={count} />
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl shadow-md p-6 mt-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Leads Created (last 14 days)
        </h3>
        {leadsStatus === "loading" ? (
          <p>Loading chart...</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats}>
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="leads" stroke="#6366f1" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-md p-6 mt-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Recent Activity
        </h3>
        {status === "loading" ? (
          <p>Loading activity...</p>
        ) : recentActivity.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {recentActivity.map((a) => (
              <li key={a._id} className="py-2">
                <span className="font-medium">
                  {typeof a.user === "object" ? a.user.name : a.user}
                </span>
                {" : "}
                <span className="text-gray-600">{a.action}</span>
                {"  -  "}
                <span className="font-medium">{a.entity}</span>
                {"  "}
                <span className="text-sm text-gray-400">
                  {new Date(a.timestamp).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No recent activity.</p>
        )}
      </div>
      {/* Overdue Tasks */}
      <div className="bg-white rounded-xl shadow-md p-6 mt-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Overdue Tasks
        </h3>
        {overdue.length === 0 ? (
          <p>No overdue tasks </p>
        ) : (
          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Due Date</th>
                <th className="px-4 py-2 text-left">Owner</th>
              </tr>
            </thead>
            <tbody>
              {overdue.map((task) => (
                <tr key={task._id} className="border-t">
                  <td className="px-4 py-2">{task.title}</td>
                  <td className="px-4 py-2 text-red-600">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">{task.owner?.name || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
