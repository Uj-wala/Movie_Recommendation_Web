import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import HeroSection from "./HeroSection";

const FirstPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("UI UX Design");
  const categoryScrollerRef = useRef<HTMLDivElement>(null);

  const categories = [
    "UI UX Design",
    "Development",
    "Data Science",
    "Business",
    "Financial",
    "Creative Writing",
    "Marketing",
    "Business Analytics",
    "Graphic Design",
    "Film & Video",
    "Photography",
    "Cyber Security",
  ];

  const scrollCategories = (direction: "left" | "right") => {
    categoryScrollerRef.current?.scrollBy({
      left: direction === "left" ? -260 : 260,
      behavior: "smooth",
    });
  };

  return (
    <div className="overflow-x-hidden bg-[#e3f4e8] font-sans">
      <HeroSection />

      {/* Categories section */}
      <section className="px-[49px] pt-[62px] pb-[50px] max-w-[1440px] mx-auto">
        <h2 className="font-roboto-flex text-[36px] font-semibold leading-none tracking-[0] text-[#4a4a4a]">
          All{" "}
          <span className="relative inline-block text-[#55B779]">
            Courses
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-[112%] h-[22px] w-[132px] -translate-x-1/2 select-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.15)]"
              viewBox="0 0 132 22"
              fill="none"
              preserveAspectRatio="xMidYMid meet"
            >
              <path
                d="M38 4 C62 0 92 1 128 6"
                stroke="#67C18D"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
              <path
                d="M2 21 C34 8 82 1 130 15"
                stroke="#1DBE82"
                strokeWidth="3.4"
                strokeLinecap="round"
              />
            </svg>
          </span>{" "}
          of decks
        </h2>

        <div className="h-[66px]" />

        <div className="flex w-full items-center gap-[28px]">
          {/* Slide left button */}
          <button
            type="button"
            onClick={() => scrollCategories("left")}
            aria-label="Scroll categories left"
            className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full border border-white bg-white text-[#202124] transition-all hover:bg-[#55B779] hover:border-[#55B779] hover:text-white hover:shadow-md cursor-pointer"
          >
            <ChevronLeft className="h-[20px] w-[20px] stroke-[2.6]" />
          </button>

          {/* Categories Pill Slider */}
          <div
            ref={categoryScrollerRef}
            className="flex flex-1 items-center gap-[48px] overflow-x-auto no-scrollbar scroll-smooth py-2"
          >
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={(event) => {
                  setActiveCategory(item);
                  event.currentTarget.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                    inline: "center",
                  });
                }}
                className={`h-[56px] w-[203px] shrink-0 rounded-[16px] border-[1.63px] px-[16px] py-[12px] text-[14px] font-bold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  activeCategory === item
                    ? "border-[#55B779] bg-white text-[#55B779] shadow-sm hover:shadow-md"
                    : "border-[#9f9f9f] bg-white text-[#969696] hover:border-[#55B779] hover:text-[#55B779] hover:shadow-sm"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Slide right button */}
          <button
            type="button"
            onClick={() => scrollCategories("right")}
            aria-label="Scroll categories right"
            className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full border border-white bg-white text-[#202124] transition-all hover:bg-[#55B779] hover:border-[#55B779] hover:text-white hover:shadow-md cursor-pointer"
          >
            <ChevronRight className="h-[20px] w-[20px] stroke-[2.6]" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default FirstPage;
