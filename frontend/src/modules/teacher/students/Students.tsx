import React from "react";

const attendanceRecords = [
  { id: 1, student: "Riya Sharma", status: "Present" },
  { id: 2, student: "Aman Patel", status: "Absent" },
  { id: 3, student: "Sanya Mehta", status: "Present" },
];

const Students: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Attendance</h1>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="mb-4 text-slate-600">Manage student attendance for today.</p>
        <div className="space-y-3">
          {attendanceRecords.map((record) => (
            <div key={record.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <span className="font-medium text-slate-800">{record.student}</span>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${record.status === "Present" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {record.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Students;
