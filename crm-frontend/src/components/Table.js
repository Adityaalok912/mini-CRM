import React from 'react';

const Table = ({ data, columns }) => (
  <div className="overflow-x-auto bg-white rounded-lg shadow-md">
    <table className="w-full text-left table-auto border-collapse">
      <thead className="bg-gray-100 border-b border-gray-200">
        <tr>
          {columns.map((col, index) => (
            <th key={index} className="px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider text-sm">
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {data.length > 0 ? (
          data.map((item, rowIndex) => (
            <tr
              key={rowIndex}
              className="hover:bg-gray-50 transition-colors duration-150"
            >
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {col.cell(item)}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500">
              No data available.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default Table;
