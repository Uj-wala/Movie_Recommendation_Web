import React from "react";

const assignments = [
  { id: 1, title: "Algebra Homework", due: "May 22", status: "Open" },
  { id: 2, title: "Physics Lab Report", due: "May 26", status: "Submitted" },
  { id: 3, title: "English Essay", due: "May 29", status: "Open" },
];

const Assignments: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Assignments</h1>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Assignment</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Due date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {assignments.map((assignment) => (
              <tr key={assignment.id}>
                <td className="px-6 py-4 text-sm text-slate-700">{assignment.title}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{assignment.due}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${assignment.status === "Submitted" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"}`}>
                    {assignment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Assignments;
