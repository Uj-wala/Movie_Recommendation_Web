import { useEffect, useRef, useState, type KeyboardEvent, type ReactElement } from "react";
import { Link } from "react-router-dom";
import {
  BadgeCheck,
  Check,
  ChevronDown,
  Clock3,
  Globe,
  LogIn,
  Search,
  Star,
} from "lucide-react";
import Logo from "../../components/Logo";

import FirstPage from "./FirstPage";
import Footer from "./Footer";
import profile from "../../assets/profile-1.jpeg";
import card1MainImage from "../../assets/card_1_main_image.jpeg";
import card2MainImage from "../../assets/card_2_main_image.jpeg";
import card3MainImage from "../../assets/card_3_main_image.jpeg";
import card4MainImage from "../../assets/card_4_main_image.jpeg";
import card5MainImage from "../../assets/card_5_main_image.jpg";
import card6MainImage from "../../assets/card_6_main_image.jpeg";
import card2Image from "../../assets/card_2_image.jpeg";
import card3Image from "../../assets/card_3_image.jpeg";
import card4Image from "../../assets/card_4_image.jpeg";
import card5Image from "../../assets/card_5_image.jpeg";
import card6Image from "../../assets/card_6_image.jpeg";
import educationalTipsCard1Image from "../../assets/Educational Tips_card_1_image.jpeg";
import educationalTipsCard2Image from "../../assets/Educational Tips_card_2_image.jpeg";
import educationalTipsCard3Image from "../../assets/Educational Tips_card_3_image.jpeg";
import educationalTipsProfile1Image from "../../assets/Educational Tips_profile_1_image.jpeg.jpeg";
import educationalTipsProfile2Image from "../../assets/Educational Tips_profile_2_image.jpeg.jpeg";
import educationalTipsProfile4Image from "../../assets/Educational Tips_profile_4_image.jpeg.jpeg";
import videoIcon from "../../assets/video_icon.png";
import studentFeedbackImage1 from "../../assets/student feedback form image 1.jpeg";
import studentFeedbackImage2 from "../../assets/student feedback form image 2.jpeg";
import studentFeedbackImage3 from "../../assets/student feedback form image 3.jpeg";
import studentFeedbackImage4 from "../../assets/student feedback form image 4.jpeg";
import studentFeedbackImage5 from "../../assets/student feedback form image 5.jpeg";

import certificateIcon from "../../assets/icons/certificate icon.png";
import fileIcon from "../../assets/icons/file icon.png";
import searchIcon from "../../assets/icons/search icon.png";
import beatSupporterDecks from "../../assets/Beat Supporter of decks.png";
import arrow2 from "../../assets/arrows/arrow2.png";
import arrow3 from "../../assets/arrows/arrow3.png";
import arrow4 from "../../assets/arrows/arrow4.png";
import arrowFive from "../../assets/arrows/arrow5.png";



const secondPageCourses = [
  {
    image: card1MainImage,
    authorImage: profile,
    author: "janson Willams",
    category: "Science",
  },
  {
    image: card2MainImage,
    authorImage: card2Image,
    author: "janson Willams",
    category: "UI/UX",
  },
  {
    image: card3MainImage,
    authorImage: card3Image,
    author: "janson Willams",
    category: "Java",
  },
  {
    image: card4MainImage,
    authorImage: card4Image,
    author: "janson Willams",
    category: "Finance",
  },
  {
    image: card5MainImage,
    authorImage: card5Image,
    author: "janson Willams",
    category: "Marketing",
  },
  {
    image: card6MainImage,
    authorImage: card6Image,
    author: "janson Willams",
    category: "Design",
  },
];

const SecondPage = () => {
  return (
    <div>
      <section className="overflow-x-hidden bg-[#F8F8F8] py-[70px]">
        <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-[49px]">
        <h2 className="mb-10 font-poppins text-[36px] font-semibold leading-none tracking-[0] text-[#000000] align-middle">
          What to learn next
        </h2>

        <div className="grid grid-cols-1 justify-items-center gap-[20px] md:grid-cols-2 xl:grid-cols-3">
          {secondPageCourses.map((course, index) => (
            <div
              key={index}
              className="h-[569.49px] w-full max-w-[424.9px] rounded-[24.59px] border-[0.98px] border-[#67C18D] bg-white p-4 transition-all hover:shadow-lg"
            >
              <img
                src={course.image}
                alt={course.category}
                className="h-[232.12px] w-full max-w-[383.59px] rounded-[19.67px] object-cover object-center"
              />

              <div className="mt-[27.54px] w-full max-w-[383.59px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-[23px]">
                    <img
                      src={course.authorImage}
                      alt="Instructor"
                      className="h-[65px] w-[65px] rounded-full object-cover"
                    />
                    <span className="inline-flex h-[22px] w-[131.8px] items-center font-instrument-sans text-[18.36px] font-semibold leading-none tracking-[0] text-[#8B8B8B]">
                      {course.author}
                    </span>
                  </div>

                  <span className="flex h-[36.39px] w-[121.96px] items-center justify-center gap-[3.65px] rounded-[5.93px] bg-[#E1F3E7] px-[8.21px] py-[6.84px]">
                    <span className="inline-flex h-[19px] w-[60.98px] items-center justify-center font-instrument-sans text-[15.74px] font-semibold leading-none tracking-[0] text-[#1DBE82]">
                    {course.category}
                    </span>
                  </span>
                </div>

              <h3 className="mt-[26px] h-[44px] w-[336.38px] font-instrument-sans text-[18.36px] font-semibold leading-[1.18] tracking-[0] text-[#5F5F5F]">
                Data Science and Machine Learning with Python: Hands-On
              </h3>

              <div className="mt-[29.56px] flex h-[23.61px] w-full max-w-[383.59px] items-center justify-between font-instrument-sans text-[18.36px] font-semibold leading-none tracking-[0] text-[#9A9897]">
                <div className="flex items-center gap-[11px]">
                  <Clock3 className="h-[23.61px] w-[23.61px] text-[#1DBE82]" strokeWidth={2.2} />
                  <span className="inline-flex h-[22px] w-[119.01px] items-center">
                    08 hr 15 mins
                  </span>
                </div>

                <div className="flex items-center gap-[11px]">
                  <img
                    src={videoIcon}
                    alt=""
                    className="h-[23.61px] w-[23.61px] object-contain"
                  />
                  <span className="inline-flex h-[22px] w-[119.01px] items-center">
                    29 Lectures
                  </span>
                </div>
              </div>

              <div className="mt-[29px] flex h-[37.8px] w-full max-w-[383.28px] items-center justify-between rounded-[6.2px] bg-[#E1F3E7] px-[17.7px] py-[5.9px]">
                <div className="flex items-center gap-[20px]">
                  <span className="inline-flex h-[26px] w-[89.5px] items-center font-instrument-sans text-[21.64px] font-semibold leading-none tracking-[0] text-[#16A66A]">
                    $385.00
                  </span>
                  <span className="inline-flex h-[16px] w-[89.5px] items-center font-instrument-sans text-[12.79px] font-semibold leading-none tracking-[0] text-[#9A9897] line-through">
                    $440.00
                  </span>
                </div>
                <div className="flex items-center gap-[10px]">
                  <span className="inline-flex h-[22px] w-[29.51px] items-center font-instrument-sans text-[18.36px] font-semibold leading-none tracking-[0] text-[#9A9897]">
                    4.5
                  </span>
                  <div className="flex items-center gap-[6px]" aria-label="4.5 out of 5 stars">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <Star
                        key={starIndex}
                        className="h-[16px] w-[16px] text-[#F6B51E]"
                        fill={starIndex === 4 ? "none" : "currentColor"}
                        strokeWidth={1.8}
                      />
                    ))}
                  </div>
                  <div className="hidden">
                    ★★★★☆
                  </div>
                </div>
              </div>
              </div>
            </div>
          ))}
        </div>
        </div>
      </section>

      <BecomeInstructor />
    </div>
  );
};

type StepCardProps = {
  icon: string;
  title: string;
  arrow: string;
  arrowClassName: string;
  cardClassName?: string;
};

function StepCard({
  icon,
  title,
  arrow,
  arrowClassName,
  cardClassName = "h-[325px] w-[368px]",
}: StepCardProps) {
  return (
    <div className={`relative overflow-hidden rounded-[15px] bg-[#E1F3E7] ${cardClassName}`}>
      <img
        src={arrow}
        alt=""
        className={`pointer-events-none absolute object-contain ${arrowClassName}`}
      />

      <div className="flex h-full flex-col px-[38px] pt-[50px]">
        <div className="mb-[73px] flex justify-center">
          <div className="relative h-[60px] w-[60px]">
          <img
            src={icon}
            alt={title}
            className={`absolute left-0 h-[60px] w-[60px] object-contain ${
              title === "Find Your Course" ? "top-[2px]" : "top-0"
            }`}
          />
          </div>
        </div>

        <div className={title === "Find Your Course" ? "relative -top-[4px]" : ""}>
          <h3 className="h-[33px] font-roboto text-[30px] font-normal leading-[1.11] tracking-[0] text-[#14345A]">
            {title}
          </h3>

          <p className="mt-[21px] h-[46px] w-[306px] text-center font-roboto-flex text-[20px] font-normal capitalize leading-none tracking-[0] text-[#7C8985]">
            It Has Survived Not Only Centurie
            <br />
            Also Leap Into Electronic
          </p>
        </div>
      </div>
    </div>
  );
}

function BecomeInstructor() {
  return (
    <>
      <section className="w-full bg-white">
        <div className="flex h-[291px] w-full items-center bg-[#E2F4EA]">
          <div className="mx-auto flex h-[185px] w-full max-w-[1314px] items-center justify-between px-[125px]">
            <div>
              <p className="h-[29px] w-[260px] whitespace-nowrap font-roboto-flex text-[25px] font-bold capitalize leading-none tracking-[0] text-[#55B779]">
                Become an Instructor
              </p>

              <h1 className="mt-[18px] h-[110px] w-[677px] font-roboto text-[50px] font-normal leading-[1.11] tracking-[0] text-[#14345A]">
                You can join with
                <br />
                decks as{" "}
                <span className="relative inline-block text-[#61C184]">
                  an instructor?
                  <svg
                    aria-hidden="true"
                    className="pointer-events-none absolute left-[10px] top-[61px] h-[22px] w-[190px]"
                    viewBox="0 0 190 22"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M1 8 C54 5 126 1 189 13"
                      stroke="#61C184"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M1 20 C55 8 126 2 189 13"
                      stroke="#61C184"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>
            </div>

            <button className="flex h-[71px] w-[314px] items-center justify-center gap-[8px] rounded-[13px] bg-[#67C189] px-[18px] py-[15px] text-[15px] font-semibold text-white transition hover:bg-[#4fad71]">
              Drop Information
            </button>
          </div>
        </div>

        <div className="mx-auto max-w-[1440px] py-16">
          <div className="mx-auto h-[133px] w-[298px] text-center">
            <p className="ml-[30px] h-[29px] w-[239px] font-roboto-flex text-[25px] font-semibold capitalize leading-none tracking-[0] text-[#55B779]">
              Over 1,235+ Courses
            </p>

            <h2 className="mt-[49px] h-[55px] w-[298px] font-roboto text-[50px] font-normal leading-[1.11] tracking-[0] text-[#14345A]">
              How it{" "}
              <span className="relative inline-block text-[#61C184]">
                Work?
                <svg
                  aria-hidden="true"
                  className="pointer-events-none absolute left-0 top-[58px] h-[16px] w-[114px]"
                  viewBox="0 0 114 16"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M1 5 C33 2 72 0 113 8"
                    stroke="#61C184"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M1 14 C34 7 73 1 113 8"
                    stroke="#61C184"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h2>
          </div>

          <div className="mx-auto mt-20 flex max-w-[1317px] flex-wrap justify-between gap-y-6">
            <StepCard
              icon={searchIcon}
              title="Find Your Course"
              arrow={arrow2}
              arrowClassName="-left-[1px] -top-[1px] h-[40px] w-[55px]"
              cardClassName="h-[320px] w-[357px]"
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

const StudentTestimonials = () => {
  const testimonialSlides = [...testimonials, ...testimonials];
  const [activeTestimonialDot, setActiveTestimonialDot] = useState(0);
  const [isTestimonialTransitionEnabled, setIsTestimonialTransitionEnabled] = useState(true);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveTestimonialDot((current) => current + 1);
    }, 4200);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
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
          <div className="mx-auto h-[132px] w-[529px] text-center">
            <p className="ml-[150px] h-[29px] w-[224px] whitespace-nowrap font-roboto-flex text-[25px] font-semibold capitalize leading-none tracking-[0] text-[#51A06F]">
              Student Testimonial
            </p>

            <h2 className="mt-[25px] h-[55px] w-[529px] font-roboto text-[50px] font-normal leading-[1.11] tracking-[0] text-[#122E51]">
              Feedback From{" "}
              <span className="relative inline-block text-[#23BF84]">
                Student
                <svg
                  aria-hidden="true"
                  className="pointer-events-none absolute left-[6px] top-[58px] h-[16px] w-[132px]"
                  viewBox="0 0 132 16"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M1 5 C38 2 84 0 131 8"
                    stroke="#23BF84"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M1 14 C39 7 85 1 131 8"
                    stroke="#23BF84"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h2>
          </div>

          <div className="mx-auto mt-[40px] h-[510px] w-full max-w-[1372px] overflow-hidden">
            <div
              className={`flex w-max gap-[16px] ${
                isTestimonialTransitionEnabled
                  ? "transition-transform duration-500 ease-in-out"
                  : "transition-none"
              }`}
              style={{
                transform: `translateX(-${activeTestimonialDot * 694}px)`,
              }}
            >
            {testimonialSlides.map((student, index) => (
              <div
                key={`${student.name}-${index}`}
                className="h-[510px] w-[678px] shrink-0 rounded-[25px] border border-green-400 bg-white px-[81px] py-[54px] text-center shadow-sm transition-all duration-300 hover:shadow-md"
              >
                <div className="mx-auto h-[403px] w-[515px]">
                  <div className="relative mx-auto h-[116.48px] w-[103px]">
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

                  <div className="mt-[40px] flex justify-center gap-[12px]" aria-label="4 out of 5 stars">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <Star
                        key={starIndex}
                        className="h-[18px] w-[18px] text-[#E5AE18]"
                        fill={starIndex === 4 ? "none" : "currentColor"}
                        strokeWidth={1.8}
                      />
                    ))}
                  </div>

                  <p className="mt-[34px] h-[125px] w-[515px] text-center font-roboto text-[20px] font-normal leading-[1.23] tracking-[0.03em] text-[#9A9897]">
                    This platform changed the way I learn. The bite-sized modules
                    and interactive quizzes made complex topics incredibly easy to
                    understand. Thanks to the structured learning path, I
                    successfully mastered new skills and boosted my career!
                  </p>

                  <h3
                    className={`mx-auto mt-[28px] h-[28px] font-roboto text-[25px] font-normal leading-[1.11] tracking-[0] ${
                      student.name === "Jason Miller" ? "text-[#122E51]" : "text-[#1e8a7a]"
                    }`}
                  >
                    {student.name}
                  </h3>

                  <p className="mx-auto mt-[2px] h-[22px] w-[196px] font-roboto-flex text-[19px] font-semibold capitalize leading-none tracking-[0] text-[#51A06F]">
                    Product Designer, Usa
                  </p>
                </div>
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

        <div className="relative mt-16 h-[369px] w-full overflow-hidden bg-[#e4f7ec]">
          <img
            src={arrowFive}
            alt="Arrow Decoration"
            className="absolute left-[1290px] top-[32px] h-[69px] w-[74.5px] object-contain"
          />

          <div className="mx-auto h-full max-w-[1440px]">
            <h2 className="ml-[101px] pt-[56px] h-[55px] w-[571px] font-roboto text-[50px] font-normal leading-[1.11] tracking-[0] text-[#122E51]">
              Beat Supporter of{" "}
              <span className="relative inline-block text-[#23BF84]">
                decks
                <svg
                  aria-hidden="true"
                  className="pointer-events-none absolute left-[1px] top-[58px] h-[16px] w-[121px]"
                  viewBox="0 0 121 16"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M1 5 C33 2 78 0 120 8"
                    stroke="#23BF84"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M1 15 C34 8 80 2 120 8"
                    stroke="#23BF84"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h2>

            <div className="mt-[135px] flex justify-center overflow-hidden">
              <img
                src={beatSupporterDecks}
                alt="Deck Supporter Logos"
                className="w-full max-w-[1150px] object-contain"
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

type Course = {
  image: string;
  authorImage: string;
  author: string;
  category: string;
};

const latestNewsCourses: Course[] = [
  {
    image: educationalTipsCard1Image,
    authorImage: educationalTipsProfile1Image,
    author: "Janson Williams",
    category: "Finance",
  },
  {
    image: educationalTipsCard2Image,
    authorImage: educationalTipsProfile2Image,
    author: "Janson Williams",
    category: "Marketing",
  },
  {
    image: educationalTipsCard3Image,
    authorImage: educationalTipsProfile4Image,
    author: "Janson Williams",
    category: "Design",
  },
];

const renderStars = (): ReactElement[] =>
  Array.from({ length: 5 }, (_, index) => (
    <Star
      key={index}
      aria-hidden="true"
      className="h-[10px] w-[10px] text-[#f6bd16]"
      fill={index === 4 ? "none" : "currentColor"}
      strokeWidth={1.7}
    />
  ));

const LatestNews = () => {
  return (
    <section
      className="bg-white px-5 py-12 text-[#111111] md:px-8 md:py-16"
      aria-labelledby="latest-news-title"
    >
      <div className="mx-auto max-w-[1308px]">
        <div className="mx-auto h-[132px] w-[562px]">
        <p className="ml-[192px] h-[29px] w-[145px] whitespace-nowrap font-roboto-flex text-[25px] font-semibold capitalize leading-none tracking-[0] text-[#51A06F]">
          Latest News
        </p>

        <h2
          id="latest-news-title"
          className="mt-[25px] h-[55px] w-[562px] text-center font-roboto text-[50px] font-normal leading-[1.11] tracking-[0] text-[#000000]"
        >
          Educational Tips &amp;{" "}
          <span className="relative inline-block text-[#67C18D]">
            Tricks
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-[58px] h-[12px] w-[121px] drop-shadow-[0_4px_15px_rgba(0,0,0,0.15)]"
              viewBox="0 0 121 12"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M1 4 C33 1 78 0 120 8"
                stroke="#67C18D"
                strokeWidth="3.83"
                strokeLinecap="round"
              />
              <path
                d="M1 11 C34 7 80 2 120 8"
                stroke="#67C18D"
                strokeWidth="3.83"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h2>
        </div>

        <div className="mx-auto mt-[83px] grid h-[570px] w-full max-w-[1308px] grid-cols-1 justify-items-center gap-[16px] md:grid-cols-2 xl:grid-cols-3">
          {latestNewsCourses.map((course) => (
            <article
              key={course.category}
              className="group h-[569.49px] w-full max-w-[424.9px] overflow-hidden rounded-[24.59px] border-[0.98px] border-[#67C18D] bg-white p-4 shadow-[0_8px_22px_rgba(66,166,101,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(32,191,114,0.18)]"
            >
              <img
                src={course.image}
                alt={course.category}
                loading="lazy"
                className="h-[232.12px] w-full max-w-[383.59px] rounded-[19.67px] object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />

              <div className="mt-[27.54px] h-[230.16px] w-full max-w-[383.59px]">
              <div className="flex h-[60.98px] items-center justify-between">
                <div className="flex items-center gap-[17.67px] font-instrument-sans text-[18.36px] font-semibold leading-none tracking-[0] text-[#9A9897]">
                  <img
                    src={course.authorImage}
                    alt={course.author}
                    loading="lazy"
                    className="h-[62px] w-[62px] rounded-full object-cover"
                  />
                  <span className="h-[22px] w-[131.8px] whitespace-nowrap">
                    {course.author}
                  </span>
                </div>

                <span className="flex h-[26px] min-w-[86px] items-center justify-center rounded bg-[#def6e9] px-3 text-[11px] font-bold text-[#20bf72]">
                  {course.category}
                </span>
              </div>

              <h3 className="mt-[16.72px] h-[44px] w-[336.38px] font-instrument-sans text-[18.36px] font-semibold leading-none tracking-[0] text-[#686868]">
                Data Science and Machine Learning with Python: Hands-On
              </h3>

              <div className="mt-[23.86px] flex h-[23.61px] w-full max-w-[383.59px] items-center justify-between font-instrument-sans text-[18.36px] font-semibold leading-none tracking-[0] text-[#9A9897]">
                <span className="flex items-center gap-[11px]">
                  <Clock3
                    className="h-[23.61px] w-[23.61px] text-[#0cc783]"
                    strokeWidth={2.2}
                  />
                  <span className="h-[22px] w-[119.01px]">
                    08 hr 15 mins
                  </span>
                </span>

                <span className="flex items-center gap-[11px]">
                  <BadgeCheck
                    className="h-[23.61px] w-[23.61px] text-[#0cc783]"
                    strokeWidth={2.2}
                  />
                  <span className="h-[22px] w-[119.01px]">
                    29 Lectures
                  </span>
                </span>
              </div>

              <div className="mt-[22.64px] grid h-[37.8px] w-full max-w-[383.28px] grid-cols-[auto_auto_1fr_auto] items-center justify-between gap-2 rounded-[6.2px] bg-[#def6e9] px-[17.7px] py-[5.9px]">
                <span className="h-[26px] w-[89.5px] font-instrument-sans text-[21.64px] font-semibold leading-none tracking-[0] text-[#19A471]">
                  $385.00
                </span>

                <span className="h-[16px] w-[89.5px] font-instrument-sans text-[12.79px] font-semibold leading-none tracking-[0] text-[#9A9897] line-through">
                  $440.00
                </span>

                <span className="justify-self-end text-[12px] font-bold text-[#8a8a8a]">
                  4.5
                </span>

                <span
                  className="flex items-center gap-[3px]"
                  aria-label="4.5 out of 5 stars"
                >
                  {renderStars()}
                </span>
              </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

const Home = () => {
  const [isLangOpen, setIsLangOpen] = useState(false); // default open to match design
  const [isCoursesOpen, setIsCoursesOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const coursesDropdownRef = useRef<HTMLDivElement>(null);
  const coursesButtonRef = useRef<HTMLButtonElement>(null);
  const courseItemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const languageButtonRef = useRef<HTMLButtonElement>(null);
  const languageItemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const courseMenuItems = [
    "React.js",
    "Python",
    "Data Science",
    "Data Analytics",
    "JavaScript",
    "UI/UX Design",
  ];

  const languages = [
    "English",
    "Deutch",
    "Nederland",
    "Portuguese",
    "Indonesia",
    "Turkey",
    "Spanish",
    "French",
    "Italian",
    "Hindi",
    "Arabic",
    "Chinese",
    "Japanese",
    "Korean",
    "Russian",
  ];

  const getLanguageCode = (lang: string) => {
    switch (lang) {
      case "English": return "EN";
      case "Deutch": return "DE";
      case "Nederland": return "NL";
      case "Portuguese": return "PT";
      case "Indonesia": return "ID";
      case "Turkey": return "TR";
      case "Spanish": return "ES";
      case "French": return "FR";
      case "Italian": return "IT";
      case "Hindi": return "HI";
      case "Arabic": return "AR";
      case "Chinese": return "ZH";
      case "Japanese": return "JA";
      case "Korean": return "KO";
      case "Russian": return "RU";
      default: return "EN";
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        coursesDropdownRef.current &&
        !coursesDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCoursesOpen(false);
      }
      if (
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLangOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCoursesKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setIsCoursesOpen(false);
      coursesButtonRef.current?.focus();
      return;
    }

    if ((event.key === "Enter" || event.key === " ") && document.activeElement === coursesButtonRef.current) {
      event.preventDefault();
      setIsCoursesOpen(true);
      window.setTimeout(() => courseItemRefs.current[0]?.focus(), 0);
      return;
    }

    if (!isCoursesOpen) return;

    const currentIndex = courseItemRefs.current.findIndex(
      (item) => item === document.activeElement
    );

    if (event.key === "ArrowDown") {
      event.preventDefault();
      const nextIndex = currentIndex < courseMenuItems.length - 1 ? currentIndex + 1 : 0;
      courseItemRefs.current[nextIndex]?.focus();
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      const previousIndex = currentIndex > 0 ? currentIndex - 1 : courseMenuItems.length - 1;
      courseItemRefs.current[previousIndex]?.focus();
    }
  };

  const handleLanguageKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setIsLangOpen(false);
      languageButtonRef.current?.focus();
      return;
    }

    if ((event.key === "Enter" || event.key === " ") && document.activeElement === languageButtonRef.current) {
      event.preventDefault();
      setIsLangOpen(true);
      setIsCoursesOpen(false);
      window.setTimeout(() => languageItemRefs.current[0]?.focus(), 0);
      return;
    }

    if (!isLangOpen) return;

    const currentIndex = languageItemRefs.current.findIndex(
      (item) => item === document.activeElement
    );

    if (event.key === "ArrowDown") {
      event.preventDefault();
      const nextIndex = currentIndex < languages.length - 1 ? currentIndex + 1 : 0;
      languageItemRefs.current[nextIndex]?.focus();
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      const previousIndex = currentIndex > 0 ? currentIndex - 1 : languages.length - 1;
      languageItemRefs.current[previousIndex]?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] font-sans relative">
      {/* Header */}
      <header className="relative z-50 flex min-h-[61px] w-full flex-wrap items-center gap-x-7 gap-y-3 bg-[#aaf5bf] px-4 py-2 text-[#031b12] shadow-[inset_0_-1px_0_rgba(35,139,69,0.12)] sm:px-[38px] xl:flex-nowrap">
        <div className="flex shrink-0 items-center gap-[13px]">
          <Logo destination="/" className="flex items-center" imgClassName="h-[45px] w-[45px] object-contain" />
          <Link to="/" className="leading-none no-underline" aria-label="Go to Home Page">
            <h1 className="text-[21px] font-bold leading-[1.05] text-[#238b45]">
              E-Learning
            </h1>
            <p className="mt-[9px] text-[14px] font-semibold leading-none text-[#031b12]">
              AI-Powered
            </p>
          </Link>
        </div>

        <nav className="flex shrink-0 items-center gap-[38px] text-[18px] font-bold">
          <div
            ref={coursesDropdownRef}
            onKeyDown={handleCoursesKeyDown}
            className="relative lg:ml-[30px]"
          >
            <button
              ref={coursesButtonRef}
              type="button"
              onClick={() => {
                setIsCoursesOpen(!isCoursesOpen);
                setIsLangOpen(false);
              }}
              className="group flex items-center gap-[2px] font-semibold transition-colors hover:text-[#238b45]"
              aria-expanded={isCoursesOpen}
              aria-haspopup="menu"
            >
              Courses
              <span className="mt-[6.2px] flex h-[22px] w-[22px] items-center justify-center">
                <span
                  className={`h-0 w-0 border-x-[8px] border-t-[9px] border-x-transparent border-t-[#1f2937] transition-transform duration-200 group-hover:border-t-[#238b45] ${
                    isCoursesOpen ? "rotate-180" : ""
                  }`}
                />
              </span>
            </button>

            {isCoursesOpen && (
              <div
                className="absolute left-0 top-full z-[9999] mt-2 w-[180px] rounded-[7px] border border-[#b6edc7] bg-[#E1F3E7] py-1.5 shadow-[0_14px_32px_rgba(3,27,18,0.14)]"
                role="menu"
                onMouseLeave={() => setIsCoursesOpen(false)}
              >
                {courseMenuItems.map((course, index) => (
                  <Link
                    key={course}
                    ref={(element) => {
                      courseItemRefs.current[index] = element;
                    }}
                    to="/second-page"
                    onClick={() => setIsCoursesOpen(false)}
                    className="block px-3.5 py-[8px] text-[14px] font-semibold text-[#031b12] transition-colors hover:bg-[#e6fbea] hover:text-[#238b45] focus:bg-[#e6fbea] focus:text-[#238b45] focus:outline-none"
                    role="menuitem"
                  >
                    {course}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <a href="#footer" className="font-semibold hover:text-[#238b45] lg:ml-[20px]">
            Contact Us
          </a>
        </nav>

        <div className="relative order-3 mx-auto w-full min-w-[260px] max-w-[610px] grow basis-[470px] lg:order-none lg:flex-1 xl:grow-0">
          <Search className="pointer-events-none absolute left-[17px] top-1/2 h-[21px] w-[21px] -translate-y-1/2 text-[#238b45]" />
          <input
            type="search"
            aria-label="Search your course"
            placeholder="Search Your Course"
            className="h-[43px] w-full rounded-[13px] border border-[#238b45] bg-[#f8f8f8] pl-[41px] pr-4 text-[14px] font-medium text-[#238b45] outline-none placeholder:text-[#238b45] focus:ring-2 focus:ring-[#238b45]/20"
          />
        </div>

        <div className="ml-auto flex shrink-0 flex-wrap items-center justify-center gap-[13px]">
          <Link
            to="/login"
            className="flex h-[45px] w-[148px] items-center justify-center gap-[9px] rounded-[6px] border border-[#238b45] bg-transparent text-[16px] font-bold text-[#238b45] transition-colors hover:bg-[#dffbe8]"
          >
            <LogIn className="h-[18px] w-[18px] stroke-[2.4]" />
            Login
          </Link>
          <Link
            to="/register"
            className="flex h-[45px] w-[119px] items-center justify-center rounded-[6px] bg-[#238b45] text-[16px] font-bold text-white transition-colors hover:bg-[#1d6e35]"
          >
            Sign Up
          </Link>

          <div className="relative" ref={languageDropdownRef} onKeyDown={handleLanguageKeyDown}>
            <button
              ref={languageButtonRef}
              type="button"
              onClick={() => {
                setIsLangOpen(!isLangOpen);
                setIsCoursesOpen(false);
              }}
              className="flex h-[45px] items-center gap-[5px] text-[16px] font-medium text-[#031b12] hover:text-[#238b45]"
              aria-expanded={isLangOpen}
              aria-haspopup="menu"
            >
              <Globe className="h-[16px] w-[16px] stroke-[2.5]" />
              {getLanguageCode(selectedLanguage)}
              <ChevronDown className="h-[17px] w-[17px] stroke-[2.5]" />
            </button>

            {isLangOpen && (
              <div
                className="absolute right-0 z-[9999] mt-2 max-h-[300px] w-48 overflow-y-auto rounded-md bg-[#defaeb] py-2 shadow-lg"
                role="menu"
                onMouseLeave={() => setIsLangOpen(false)}
              >
                {languages.map((lang, index) => (
                  <button
                    key={lang}
                    ref={(element) => {
                      languageItemRefs.current[index] = element;
                    }}
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setSelectedLanguage(lang);
                      setIsLangOpen(false);
                    }}
                    className="flex w-full items-center justify-between px-4 py-3 text-left text-base text-gray-700 hover:bg-green-100 focus:bg-green-100 focus:outline-none"
                  >
                    {lang}
                    {lang === selectedLanguage && (
                      <Check className="w-4 h-4 text-gray-700" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content â€” Landing Sections */}
      <main>
        <FirstPage />
        <SecondPage />
      </main>
    </div>
  );
};

export default Home;
