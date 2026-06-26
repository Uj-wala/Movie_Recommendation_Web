import certificateIcon from "../../assets/icons/certificate icon.png";
import fileIcon from "../../assets/icons/file icon.png";
import searchIcon from "../../assets/icons/search icon.png";

import arrow1 from "../../assets/arrows/arrow1.png";
import arrow2 from "../../assets/arrows/arrow2.png";
import arrow3 from "../../assets/arrows/arrow3.png";
import arrow4 from "../../assets/arrows/arrow4.png";

import StudentTestimonials from "./StudentTestimonials";

type StepCardProps = {
  icon: string;
  title: string;
  arrow: string;
  arrowClassName: string;
};

function StepCard({
  icon,
  title,
  arrow,
  arrowClassName,
}: StepCardProps) {
  return (
    <div className="relative h-[280px] w-[320px] overflow-hidden rounded-[15px] bg-[#E2F4EA]">
      <img
        src={arrow}
        alt=""
        className={`pointer-events-none absolute object-contain ${arrowClassName}`}
      />

      <div className="flex h-full flex-col px-[28px] pt-[35px]">
        <div className="mb-[32px] flex justify-center">
          <img
            src={icon}
            alt={title}
            className="h-[48px] w-[48px] object-contain"
          />
        </div>

        <h3 className="text-[18px] font-medium text-[#14345A]">
          {title}
        </h3>

        <p className="mt-3 text-[13px] leading-[20px] text-[#7C8985]">
          It Has Survived Not Only Centuries
          <br />
          But Also Leaped Into Electronic
          <br />
          Learning Successfully.
        </p>
      </div>
    </div>
  );
}

export default function BecomeInstructor() {
  return (
    <>
      <section className="w-full bg-white">
        {/* Hero Section */}
        <div className="bg-[#E2F4EA] py-[40px]">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between px-[80px]">
            <div>
              <p className="text-[14px] font-semibold text-[#55B779]">
                Become An Instructor
              </p>

              <h1 className="mt-4 text-[32px] font-medium leading-[40px] text-[#14345A]">
                You can join with
                <br />
                decks as{" "}
                <span className="relative inline-block text-[#61C184]">
                  an instructor
                  <img
                    src={arrow1}
                    alt=""
                    className="pointer-events-none absolute left-[10px] top-[38px] w-[120px] object-contain"
                  />
                </span>
              </h1>
            </div>

            <button className="h-[62px] w-[302px] rounded-[8px] bg-[#61C184] text-[15px] font-semibold text-white transition hover:bg-[#4fad71]">
              Drop Information
            </button>
          </div>
        </div>

        {/* Steps Section */}
        <div className="mx-auto max-w-[1440px] py-16">
          <div className="text-center">
            <p className="text-[14px] font-semibold text-[#55B779]">
              Over 1,235+ Courses
            </p>

            <h2 className="mt-4 text-[32px] font-medium text-[#14345A]">
              How it{" "}
              <span className="relative inline-block text-[#61C184]">
                Works?
                <img
                  src={arrow1}
                  alt=""
                  className="absolute left-0 top-[42px] w-[85px] object-contain"
                />
              </span>
            </h2>
          </div>

          <div className="mx-auto mt-20 flex flex-wrap justify-center gap-6">
            <StepCard
              icon={searchIcon}
              title="Find Your Course"
              arrow={arrow2}
              arrowClassName="-left-[1px] -top-[1px] h-[40px] w-[55px]"
            />

            <StepCard
              icon={fileIcon}
              title="Book A Seat"
              arrow={arrow3}
              arrowClassName="-right-[1px] -top-[1px] h-[40px] w-[40px]"
            />

            <StepCard
              icon={certificateIcon}
              title="Get Certificate"
              arrow={arrow4}
              arrowClassName="-right-[1px] -bottom-[1px] h-[40px] w-[40px]"
            />
          </div>
        </div>
      </section>

      <StudentTestimonials />
    </>
  );
}