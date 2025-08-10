import React from "react";

export default function AllWorkers({ allWorkers }) {
  return (
    <div>
      <h2 className="admin-title">🗑️ All Workers</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {allWorkers.map((worker) => (
            <tr key={worker.id}>
              <td>{worker.id}</td>
              <td>{worker.username}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
