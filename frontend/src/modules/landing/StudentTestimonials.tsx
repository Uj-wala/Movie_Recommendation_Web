import React from "react";
import { Star } from "lucide-react";
import decksLogo from "../../assets/Beat Supporter of decks.png";
import arrowOne from "../../assets/arrows/arrow1.png";
import arrowFive from "../../assets/arrows/arrow5.png";
import studentFeedbackImage1 from "../../assets/student feedback form image 1.jpeg";
import studentFeedbackImage2 from "../../assets/student feedback form image 2.jpeg";
import studentFeedbackImage3 from "../../assets/student feedback form image 3.jpeg";
import studentFeedbackImage4 from "../../assets/student feedback form image 4.jpeg";
import studentFeedbackImage5 from "../../assets/student feedback form image 5.jpeg";

import LatestNews from "./LatestNews";
import Footer from "./Footer";

interface Testimonial {
  name: string;
  role: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Jason Miller",
    role: "Product Designer, USA",
    image: studentFeedbackImage1,
  },
  {
    name: "Olivia Martin",
    role: "Product Designer, USA",
    image: studentFeedbackImage2,
  },
  {
    name: "Sara Alexander",
    role: "Product Designer, USA",
    image: studentFeedbackImage3,
  },
  {
    name: "Olivia Martin",
    role: "Product Designer, USA",
    image: studentFeedbackImage4,
  },
  {
    name: "Daniel Foster",
    role: "Product Designer, USA",
    image: studentFeedbackImage5,
  },
];

const StudentTestimonials: React.FC = () => {
  const testimonialSlides = [...testimonials, ...testimonials];
  const [activeTestimonialDot, setActiveTestimonialDot] = React.useState(0);
  const [isTestimonialTransitionEnabled, setIsTestimonialTransitionEnabled] = React.useState(true);

  React.useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveTestimonialDot((current) => current + 1);
    }, 4200);

    return () => window.clearInterval(timer);
  }, []);

  React.useEffect(() => {
    if (activeTestimonialDot < testimonials.length) return;

    const resetTimer = window.setTimeout(() => {
      setIsTestimonialTransitionEnabled(false);
      setActiveTestimonialDot((current) => current - testimonials.length);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setIsTestimonialTransitionEnabled(true));
      });
    }, 500);

    return () => window.clearTimeout(resetTimer);
  }, [activeTestimonialDot]);

  return (
    <>
      <section className="w-full overflow-x-hidden bg-white">
        <div className="mx-auto max-w-[1440px] px-6 py-4">
          <div className="text-center">
            <p className="text-sm font-semibold text-green-500">
              Student Testimonial
            </p>

            <h2 className="mt-3 text-3xl font-medium text-[#102d52]">
              Feedback From{" "}
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

          <div className="mx-auto mt-10 h-[510px] w-full max-w-[1270px] overflow-hidden">
            <div
              className={`flex w-max gap-6 ${
                isTestimonialTransitionEnabled
                  ? "transition-transform duration-500 ease-in-out"
                  : "transition-none"
              }`}
              style={{ transform: `translateX(-${activeTestimonialDot * 647}px)` }}
            >
              {testimonialSlides.map((student, index) => (
                <div
                  key={`${student.name}-${index}`}
                  className="h-[510px] w-[623px] shrink-0 rounded-[25px] border border-green-400 bg-white px-[54px] py-[54px] text-center shadow-sm transition-all duration-300 hover:shadow-md"
                >
                  <div className="relative mx-auto h-[116px] w-[103px]">
                    <img
                      src={student.image}
                      alt={student.name}
                      className="h-[103px] w-[103px] rounded-full border border-gray-200 object-cover p-1"
                    />

                    <span className="absolute left-[36px] top-[83px] flex h-[32.48px] w-[32.48px] items-center justify-center rounded-full bg-[#23C889]">
                      <svg
                        aria-hidden="true"
                        className="h-[15px] w-[18px]"
                        viewBox="0 0 24 20"
                        fill="none"
                      >
                        <path
                          d="M8.2 4.2C5.4 5.5 4 7.6 4 10.5C4 12.7 5.3 14.2 7.2 14.2C8.8 14.2 10 13 10 11.5C10 10.1 9.1 9.1 7.8 8.9C8.1 7.8 9 6.9 10.4 6.1L8.2 4.2Z"
                          fill="white"
                        />
                        <path
                          d="M17.2 4.2C14.4 5.5 13 7.6 13 10.5C13 12.7 14.3 14.2 16.2 14.2C17.8 14.2 19 13 19 11.5C19 10.1 18.1 9.1 16.8 8.9C17.1 7.8 18 6.9 19.4 6.1L17.2 4.2Z"
                          fill="white"
                        />
                      </svg>
                    </span>
                  </div>

                  <div
                    className="mt-[40px] flex justify-center gap-[12px]"
                    aria-label="4 out of 5 stars"
                  >
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <Star
                        key={starIndex}
                        className="h-[18px] w-[18px] text-[#E5AE18]"
                        fill={starIndex === 4 ? "none" : "currentColor"}
                        strokeWidth={1.8}
                      />
                    ))}
                  </div>

                  <p className="mx-auto mt-[34px] h-[125px] w-[515px] text-center font-roboto text-[20px] font-normal leading-[1.23] tracking-[0.03em] text-[#9A9897]">
                    This platform changed the way I learn. The bite-sized
                    modules and interactive quizzes made complex topics
                    incredibly easy to understand. Thanks to the structured
                    learning path, I successfully mastered new skills and
                    boosted my career!
                  </p>

                  <h3
                    className={`mx-auto mt-[28px] h-[28px] font-roboto text-[25px] font-normal leading-[1.11] tracking-[0] ${
                      student.name === "Jason Miller" ? "text-[#122E51]" : "text-[#1e8a7a]"
                    }`}
                  >
                    {student.name}
                  </h3>

                  <p className="mx-auto mt-[2px] h-[22px] w-[196px] font-roboto-flex text-[19px] font-semibold capitalize leading-none tracking-[0] text-[#51A06F]">
                    {student.role}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mx-auto mt-6 flex h-[15px] w-[220px] items-center justify-between">
            {testimonials.map((testimonial, dot) => (
              <button
                key={`${testimonial.name}-${dot}`}
                type="button"
                aria-label={`Show testimonial slide ${dot + 1}`}
                aria-current={activeTestimonialDot % testimonials.length === dot ? "true" : undefined}
                onClick={() => {
                  const currentDot = activeTestimonialDot % testimonials.length;
                  const forwardSteps = (dot - currentDot + testimonials.length) % testimonials.length;
                  setActiveTestimonialDot((current) => current + forwardSteps);
                }}
                className={`h-[15px] w-[15px] rounded-full transition-colors ${
                  activeTestimonialDot % testimonials.length === dot ? "bg-[#0DD37D]" : "bg-[#D1D5DB]"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="relative mt-16 overflow-hidden bg-[#e4f7ec] px-6 py-6">
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

      <LatestNews />
      <Footer />
    </>
  );
};

export default StudentTestimonials;
