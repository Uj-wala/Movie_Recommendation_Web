import React from "react";

const courses = [
  { id: 1, title: "Mathematics", students: 28 },
  { id: 2, title: "Physics", students: 24 },
  { id: 3, title: "English", students: 30 },
];

const MyCourses: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">My Courses</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <div key={course.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold">{course.title}</h2>
            <p className="mt-2 text-sm text-slate-600">Students enrolled: {course.students}</p>
            <button className="mt-4 rounded-full bg-green-600 px-4 py-2 text-white transition hover:bg-green-700">
              View course
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCourses;
