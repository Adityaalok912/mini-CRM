import React from 'react';

const Badge = ({ children, status }) => {
  let colorClass = 'bg-gray-200 text-gray-800';
  if (status === 'New' || status === 'Open') colorClass = 'bg-blue-100 text-blue-800';
  if (status === 'In Progress') colorClass = 'bg-yellow-100 text-yellow-800';
  if (status === 'Closed Won' || status === 'Done') colorClass = 'bg-green-100 text-green-800';
  if (status === 'Closed Lost') colorClass = 'bg-red-100 text-red-800';
  if (status === 'High') colorClass = 'bg-red-100 text-red-800';
  if (status === 'Medium') colorClass = 'bg-yellow-100 text-yellow-800';
  if (status === 'Low') colorClass = 'bg-green-100 text-green-800';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {children}
    </span>
  );
};

export default Badge;