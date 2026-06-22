import React from "react";
import { Star } from "lucide-react";
import heroImage from "../../assets/Frame 5211.png";
import yellowCurveArm from "../../assets/Mark.png";
import radialGradientBg from "../../assets/Ellipse 87.png";
import bookopen from "../../assets/Vector.png";
import jog1 from "../../assets/jog-1.png";
import jog2 from "../../assets/jog-2.png";
import jog3 from "../../assets/jog-3.png";

const HeroSection: React.FC = () => {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-[35px] pb-[20px] pt-[35px]">
      <div className="grid min-h-[400px] items-center gap-[40px] lg:grid-cols-[48%_52%]">
        <div className="relative z-10 -translate-y-[20px]">
          <p className="mb-[8px] font-roboto-flex text-[20px] font-bold capitalize leading-none tracking-[0] text-[#63c58c]">
            Start Your Favourite Course
          </p>

          <div className="relative inline-block">
            <h1 className="max-w-[720px] font-roboto-flex text-[44px] font-semibold leading-[1.11] tracking-[0] text-[#2D312E] sm:text-[56px] xl:text-[68px]">
              Now learning from
              <br />
              anywhere, and build
              <br />
              your{" "}
              <span className="relative inline-block pb-[38px] text-[#55B779]">
                bright career.
                <svg
                  aria-hidden="true"
                  className="pointer-events-none absolute left-[18%] top-[82%] h-[36px] w-[68%]"
                  viewBox="0 0 252 38"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient
                      id="bright-career-underline-fade"
                      x1="0"
                      x2="1"
                      y1="0"
                      y2="0"
                    >
                      <stop offset="0" stopColor="white" stopOpacity="0.35" />
                      <stop offset="0.16" stopColor="white" stopOpacity="1" />
                      <stop offset="1" stopColor="white" stopOpacity="1" />
                    </linearGradient>
                    <mask id="bright-career-underline-mask">
                      <rect
                        width="252"
                        height="38"
                        fill="url(#bright-career-underline-fade)"
                      />
                    </mask>
                  </defs>
                  <g mask="url(#bright-career-underline-mask)">
                    <path
                      d="M1 16 C72 8 151 4 251 15"
                      stroke="#55B779"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <path
                      d="M1 30 C73 18 152 8 251 15"
                      stroke="#55B779"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </g>
                </svg>
              </span>
            </h1>
          </div>

          <p className="mt-[28px] max-w-[520px] font-instrument-sans text-[20px] font-semibold leading-none tracking-[0] text-[#9A9897]">
            It has survived not five centuries but also
            <br />
            the leap into electronic type setting
          </p>

          <div className="mt-[42px] flex flex-wrap items-center gap-[24px]">
            <button className="flex h-[48px] cursor-pointer items-center justify-center rounded-[6px] bg-[#239247] px-[28px] align-middle font-poppins text-[20px] font-semibold leading-none tracking-[0] text-white shadow-[0_4px_12px_rgba(35,146,71,0.15)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1d7a3c] hover:shadow-[0_6px_16px_rgba(35,146,71,0.25)]">
              Start a Course
            </button>

            <div className="flex items-center gap-[16px]">
              <div className="flex -space-x-[12px]">
                {[jog1, jog2, jog3].map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt=""
                    className="pointer-events-none h-[42px] w-[42px] select-none rounded-full border-2 border-white object-cover shadow-sm"
                  />
                ))}
              </div>

              <div className="flex flex-col justify-center">
                <p className="font-instrument-sans text-[13.29px] font-semibold leading-none tracking-[0] text-[#707070]">
                  Get off in every course
                </p>

                <p className="mt-[2px] text-[13px] leading-[1.3] text-[#707070]">
                  <span className="font-extrabold text-[#55B779]">2.8M</span>{" "}
                  users
                </p>

                <div className="mt-[4px] flex items-center gap-[3px]">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Star
                      key={index}
                      className="h-[14px] w-[14px] fill-[#f7b500] text-[#f7b500]"
                    />
                  ))}
                  <div className="relative h-[14px] w-[14px]">
                    <Star className="absolute inset-0 h-[14px] w-[14px] fill-[#e0e0e0] text-[#e0e0e0]" />
                    <div className="absolute inset-0 w-[50%] overflow-hidden">
                      <Star className="h-[14px] w-[14px] max-w-none fill-[#f7b500] text-[#f7b500]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-[50px] aspect-[1.1] w-full max-w-[575px] overflow-visible lg:ml-auto">
          <img
            src={radialGradientBg}
            alt=""
            className="pointer-events-none absolute left-[26%] top-[-4%] z-0 h-[104%] w-[86%] select-none object-contain opacity-95"
          />

          <div className="absolute left-[7%] top-[21%] z-30 flex h-[90px] w-[90px] flex-col items-center justify-center rounded-full bg-[#55B779] shadow-[0_10px_25px_rgba(85,183,121,0.35)] transition-transform duration-300 hover:scale-105">
            <img
              src={bookopen}
              alt=""
              className="pointer-events-none mb-[4px] h-[20px] w-[20px] select-none object-contain brightness-200 invert"
            />
            <h3 className="text-[24px] font-extrabold leading-none tracking-tight text-white">
              1,235
            </h3>
            <p className="mt-[1px] text-[10px] font-semibold leading-none text-white/90">
              courses
            </p>
          </div>

          <img
            src={yellowCurveArm}
            alt=""
            className="pointer-events-none absolute left-[19%] top-[30%] z-20 w-[152px] select-none object-contain"
          />

          <svg
            aria-hidden="true"
            className="pointer-events-none absolute left-[280px] top-[118px] z-20 h-[24px] w-[84px] select-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.15)]"
            viewBox="0 0 84 24"
            fill="none"
          >
            <path
              d="M25 5 C43 -1 65 1 82 11"
              stroke="#67C18D"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M2 23 C24 4 57 2 82 18"
              stroke="#1DBE82"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </svg>

          <img
            src={heroImage}
            alt="Student learning on beanbag"
            className="relative z-10 ml-[-1%] h-auto w-[105%] select-none object-contain"
            style={{ marginTop: "138px" }}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
