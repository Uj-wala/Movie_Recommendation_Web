import React from "react"; 
import {ChevronLeft, ChevronRight,  } from "lucide-react";
import heroImage from "../../assets/Frame 5211.png";
import brushLineUnderline from "../../assets/Vector 135.png";
import greenCurveHead from "../../assets/Vector 136.png";
import greenCurveHead2 from "../../assets/Vector 133.png";
import yellowCurveArm from "../../assets/Mark.png";
import radialGradientBg from "../../assets/Ellipse 87.png";
import bookopen from "../../assets/Vector.png";
import GreenLineUnderline from "../../assets/Vector 133.png";
import users from "../../assets/Frame 159.png";

const FirstPage: React.FC = () => {

const categories = [
    "UI UX Design",
    "Development",
    "Data Science",
    "Business",
    "Financial",
  ];
    return (
      <div> 
      <section className="w-full px-12 xl:px-20 py-16">
        <div className="grid lg:grid-cols-[46%_54%] items-center">
          
          {/* Left Content */}
          <div className="relative z-10">
            <p className="w-[330px] h-[23px] text-[#65C18E] text-[20px] font-bold font-Roboto Flex mb-6">
              Start Your Favourite Course
            </p>

            <div className="relative inline-block">
            <h1 className="text-[64px] leading-[1.15] font-bold font-Roboto Flex text-[#535353]">
              Now learning from
                anywhere, and build
              your{' '}
              <span className="relative inline-block text-[#67C189]">
                bright career.
              </span>
            </h1>
              
    {/* MARKED UNDERLINE: Hand-drawn brush line replaced flat bar */}
      <div className="mt-2 mb-10 pl-4" >
        <img 
          src={brushLineUnderline} 
          alt="Decorative underline" 
          className="w-[3800px] h-[85px] top-[240px] left-[255px] object-contain"
        />
      </div>
  </div>
      <p className="max-w-[408px] h-[50px] text-[20px]top-[300px] font-Instrument Sans font-bold leading-9 text-[#8B8B8B]">
        It has survived not five centuries but also
        <p></p>
        the leap into electronic type setting
        </p>

    {/* CTA Elements */}
      <div className="flex items-center gap-8 mt-12">
        <button className="bg-[#239247] text-white font-semibold px-10 py-4 rounded-xl">
          Start a Course
        </button>

      <div className="flex items-center">
        <img src={users} alt="" className="w-[120px]" />
          <div className="ml-4">
          <p className="text-[#535353] font-semibold">
          Get off in every course
          </p>

          <p>
          <span className="text-[#67C18D] font-bold font-Instrument Sans">
          2.8M
          </span>{" "}
          users
          </p>

          <div className="text-yellow-400 text-xl">
            ★★★★☆
          </div>
          </div>
        </div>
      </div>
  </div>

    {/* Right Graphical Side */}
      <div className="relative flex justify-end items-center"> 
        <img 
        src={radialGradientBg} 
        alt="Background Gradient Effect" 
        className="absolute right-[-240px] top-[-50px] left-[180px] w-[750px] h-[710px] object-contain z-0 pointer-events-none"
        />

    {/* MARKED DECORATIVE ASSET: Green arcs vector above the girl's head */}
        <img 
        src={greenCurveHead} 
        alt="Green Curve Ornament" 
        className="absolute right-[280px] top-[-10px] w-[90px] h-auto z-20 pointer-events-none"
        />

    {/* MARKED DECORATIVE ASSET: Yellow accent loop line near the arm/laptop */}
        <img 
        src={yellowCurveArm} 
        alt="Yellow Curve Ornament" 
        className="top-[97.56px] left-[204px] right-[360px] w-[146.99px] h-93.54px z-20 pointer-events-none rotation-[5.45deg] absolute"
        />

    {/* MARKED METRIC BADGE: Pill/Circle dynamic layout placement */}
      <div className="absolute left-[96px] top-[8.56px] w-[122px] h-[122px] bg-[#63C98A] rounded-full flex flex-col justify-center items-center shadow-[0_10px_25px_rgba(99,201,138,0.4)] z-30">
        <img 
        src={bookopen} 
        alt="book icon" 
        className="w-6 h-6 mb-1" 
        />
        <h3 className="text-[34px] font-bold text-white leading-none">
          1,235
        </h3>
        <p className="text-white/90 text-sm font-medium mt-0.5">
          courses
        </p>
      </div>

    {/* Main Interactive Character Illustration */}
        <img
        src={heroImage}
        alt="hero graphic illustration"
        className="relative z-10 w-[850px] max-w-none mix-blend-normal left-[80px] "
        />
        </div>
      </div>
    </section>

  {/* ================= CATEGORIES SECTION ================= */}
      {/* Section Container */}
<section className="px-[36px] pt-[20px] pb-[40px]">
  {/* Header with Decorative Underline */}
  <h2 className="text-[40px] font-bold text-[#535353] font-[Roboto_Flex]">
  All{" "}
  <span className="relative inline-block text-[#67C18D]">
    Courses
   {/* Small line */}
    <img
      src={GreenLineUnderline}
      alt=""
      className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-[70px]"
    />

    {/* Curved brush */}
    <img
      src={greenCurveHead2}
      alt=""
      className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-[110px]"
    />
  </span>{" "}
  of decks
</h2>
<br></br><br />
  {/* Slider Controls & Categories */}
  <div className="flex items-center w-full t-20px" >
    
    {/* Left Navigation Arrow */}
    <button className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors border border-gray-100">
      <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
    </button>
    <div className="flex-1 flex justify-between mx-8">
      {categories.map((item, index) => (
    <button
    key={item}
    className={`w-[203px] h-[56px] rounded-[16px] border-[1.62px] text-[14px] font-Poppins font-bold transition-all duration-200 transform
    ${
      index === 0
        ? "border-[#63C98A] text-[#63C98A] bg-white hover:scale-[1.03] hover:shadow-md"
        : "border-[#D9D9D9] bg-white text-[#8E8E8E] hover:border-[#63C98A] hover:text-[#63C98A] hover:shadow-sm"
    }`}
>
  {item}
</button>
))}
    </div>
    {/* Right Navigation Arrow */}
    <button className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors border border-gray-100">
      <ChevronRight className="w-4 h-4 stroke-[2.5]" />
    </button>
  </div>
</section>
</div>
);

}
export default FirstPage;
