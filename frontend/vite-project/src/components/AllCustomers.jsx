import React from "react";

export default function AllCustomers({ allCustomers }) {
  return (
    <div>
      <h2 className="admin-title">🗑️ All Customers</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {allCustomers.map((worker) => (
            <tr key={worker.id}>
              <td>{worker.id}</td>
              <td>{worker.name}</td>
              <td>{worker.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
