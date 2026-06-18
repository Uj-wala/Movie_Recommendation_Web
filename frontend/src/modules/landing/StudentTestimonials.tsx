import React from "react";
import decksLogo from "../../assets/logos/decks.png";
import arrowOne from "../../assets/arrows/arrow1.png";
import arrowFive from "../../assets/arrows/arrow5.png";

import LatestNews from "./LatestNews";
import Footer from "./Footer";

interface Testimonial {
  name: string;
  role: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Sara Alexander",
    role: "Product Designer, USA",
    image: "https://randomuser.me/api/portraits/women/32.jpg",
  },
  {
    name: "Melissa Roberts",
    role: "Product Designer, USA",
    image: "https://randomuser.me/api/portraits/women/75.jpg",
  },
];

const StudentTestimonials: React.FC = () => {
  return (
    <>
      <section className="w-full bg-white">
        <div className="mx-auto max-w-6xl px-6 py-8">
          {/* Header */}
          <div className="text-center">
            <p className="text-sm font-semibold text-green-500">
              Student Testimonial
            </p>

            <h2 className="mt-3 text-3xl font-medium text-[#102d52]">
              Feedback Form{" "}
              <span className="relative inline-block text-green-400">
                Student
                <img
                  src={arrowOne}
                  alt="Arrow Decoration"
                  className="absolute -bottom-5 left-1/2 h-4 w-20 -translate-x-1/2 object-contain"
                />
              </span>
            </h2>
          </div>

          {/* Testimonial Cards */}
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
            {testimonials.map((student) => (
              <div
                key={student.name}
                className="rounded-2xl border border-green-400 px-8 py-10 text-center shadow-sm transition-all duration-300 hover:shadow-md"
              >
                <div className="relative mx-auto h-20 w-20">
                  <img
                    src={student.image}
                    alt={student.name}
                    className="h-20 w-20 rounded-full border border-gray-200 object-cover p-1"
                  />

                  <span className="absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-400 text-xs font-bold text-white">
                    "
                  </span>
                </div>

                <div className="mt-7 text-sm text-yellow-400">
                  ★ ★ ★ ★ <span className="text-gray-300">★</span>
                </div>

                <p className="mx-auto mt-5 max-w-[390px] text-center text-[13px] leading-6 text-gray-500">
                  This platform changed the way I learn. The bite-sized modules
                  and interactive quizzes made complex topics incredibly easy to
                  understand. Thanks to the structured learning path, I
                  successfully mastered new skills and boosted my career!
                </p>

                <h3 className="mt-7 text-sm font-bold text-[#1e8a7a]">
                  {student.name}
                </h3>

                <p className="text-xs font-semibold text-green-500">
                  {student.role}
                </p>
              </div>
            ))}
          </div>

          {/* Slider Dots */}
          <div className="mt-12 flex justify-center gap-5">
            <span className="h-3 w-3 rounded-full bg-green-400"></span>
            <span className="h-3 w-3 rounded-full bg-gray-300"></span>
            <span className="h-3 w-3 rounded-full bg-gray-300"></span>
          </div>
        </div>

        {/* Supporters Section */}
        <div className="relative mt-6 overflow-hidden bg-[#e4f7ec] px-6 py-6">
          <img
            src={arrowFive}
            alt="Arrow Decoration"
            className="absolute right-10 top-5 h-10 w-10 object-contain"
          />

          <div className="mx-auto max-w-6xl">
            <h2 className="text-left text-[28px] font-medium text-[#102d52]">
              Beat Supporter of{" "}
              <span className="relative inline-block text-green-400">
                decks
                <img
                  src={arrowOne}
                  alt="Arrow Decoration"
                  className="absolute -bottom-4 left-1/2 h-4 w-20 -translate-x-1/2 object-contain"
                />
              </span>
            </h2>

            {/* Logos */}
            <div className="mt-6 flex justify-center overflow-hidden">
              <img
                src={decksLogo}
                alt="Deck Supporter Logos"
                className="w-full max-w-[900px] object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Next Sections */}
      <LatestNews />
      <Footer />
    </>
  );
};

export default StudentTestimonials;