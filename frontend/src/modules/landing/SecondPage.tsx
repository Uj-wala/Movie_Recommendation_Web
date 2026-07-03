import React from "react";
import { Clock3 } from "lucide-react";

import profile from "../../assets/profile-1.jpeg";

import uiUx1 from "../../assets/ui-ux-1.png";
import uiUx2 from "../../assets/ui-ux-2.png";
import uiUx3 from "../../assets/ui-ux-3.png";
import uiUx4 from "../../assets/ui-ux-4.png";
import uiUx5 from "../../assets/ui-ux-5.png";
import uiUx6 from "../../assets/ui-ux-6.png";
import lectureLogo from "../../assets/video-logo.png";

const SecondPage: React.FC = () => {
  const courses = [
    {
      image: uiUx1,
      author: "janson Willams",
      category: "Science",
    },
    {
      image: uiUx2,
      author: "janson Willams",
      category: "UI/UX",
    },
    {
      image: uiUx3,
      author: "janson Willams",
      category: "Java",
    },
    {
      image: uiUx4,
      author: "janson Willams",
      category: "Finance",
    },
    {
      image: uiUx5,
      author: "janson Willams",
      category: "Marketing",
    },
    {
      image: uiUx6,
      author: "janson Willams",
      category: "Design",
    },
  ];

  return (
    <div>
      {/* Courses Grid */}
      <section className="bg-[#F8F8F8] py-[70px]">
        <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-[49px]">
        <h2 className="text-[36px] font-bold text-[#000000] text-Poppins mb-10">
          What to learn next
        </h2>

        <div className="grid grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <div
              key={index}
              className="bg-white border border-[#67C18D] rounded-[20px] p-4 hover:shadow-lg transition-all"
            >
              {/* Course Image */}
              <img
                src={course.image}
                alt={course.category}
                className="w-full h-[232px] object-cover rounded-[16px]"
              />

              {/* Author */}
              <div className="flex items-center justify-between mt-5">
                <div className="flex items-center gap-3">
                  <img
                    src={profile}
                    alt="Instructor"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="text-sm text-[#8B8B8B]">
                    {course.author}
                  </span>
                </div>

                <span className="bg-[#E8F6ED] text-[#2DBE60] text-xs px-4 py-1 rounded-md font-medium">
                  {course.category}
                </span>
              </div>

              {/* Title */}
              <h3 className="mt-4 text-[18px] leading-7 font-medium text-[#4A4A4A]">
                Data Science and Machine Learning
                <br />
                With Python Hands On
              </h3>

              {/* Details */}
              <div className="flex justify-between mt-4 text-[#8D8D8D] text-sm">
                <div className="flex items-center gap-2 text-[#31C27C]">
                  <Clock3 size={16} />
                  <span className="text-sm text-gray-500">
                    08 hr 15 mins
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <img
                  src={lectureLogo}
                  alt="Lecture Logo"
                  className="w-10 h-10   object-contain"
                />

                  <span className="text-[18.36px] font-semibold text-gray-400">
                    29 Lectures
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="mt-5 bg-[#E1F3E7] rounded-lg px-4 py-3 flex items-center justify-between h-[37.8px]">
                <div>
                  <span className="text-[#18B56B] font-bold text-xl">
                    $385.00
                  </span>
                  <span className="text-xs text-gray-400 line-through ml-2">
                    $440.00
                  </span>
                </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#9A9897] text-xl font-medium">
                  4.5
                  </span>
                  <div className="text-yellow-400 text-2xl text-[#9A9897]">
                    ★★★★☆
                </div>
              </div>  
              </div>
            </div>
          ))}
        </div>  
        </div>
      </section>

    </div>
  );
};

export default SecondPage;
