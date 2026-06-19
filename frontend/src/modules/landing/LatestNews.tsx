
import { BadgeCheck, Clock3, Star } from "lucide-react";
import type { ReactElement } from "react";

type Course = {
  image: string;
  authorImage: string;
  author: string;
  category: string;
};

const courses: Course[] = [
  {
    image: "/news-finance.png",
    authorImage: "/author-finance.png",
    author: "Janson Williams",
    category: "Finance",
  },
  {
    image: "/news-marketing.png",
    authorImage: "/author-marketing.png",
    author: "Janson Williams",
    category: "Marketing",
  },
  {
    image: "/news-design.png",
    authorImage: "/author-design.png",
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
      <div className="mx-auto max-w-[920px]">
        <p className="mb-4 text-center text-base font-bold text-[#42a665]">
          Latest News
        </p>

        <h2
          id="latest-news-title"
          className="text-center text-[28px] font-normal leading-tight md:text-[34px]"
        >
          Educational Tips &amp;{" "}
          <span className="relative inline-block text-[#62c786]">
            Tricks
            <span className="absolute bottom-[-7px] left-[2px] h-[1.5px] w-[86px] rotate-[-4deg] rounded-full bg-[#62c786]" />
            <span className="absolute bottom-[-12px] left-[2px] h-[1.5px] w-[86px] rotate-[3deg] rounded-full bg-[#62c786]" />
          </span>
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <article
              key={course.category}
              className="group overflow-hidden rounded-[17px] border border-[#39d493] bg-white p-3 pt-6 shadow-[0_8px_22px_rgba(66,166,101,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#21c77c] hover:shadow-[0_18px_38px_rgba(32,191,114,0.18)]"
            >
              <img
                src={course.image}
                alt={course.category}
                loading="lazy"
                className="aspect-[274/166] w-full rounded-[9px] object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />

              <div className="mt-5 flex items-center justify-between">
                <div className="flex items-center gap-3 text-[13px] font-semibold text-[#858585]">
                  <img
                    src={course.authorImage}
                    alt={course.author}
                    loading="lazy"
                    className="h-[43px] w-[43px] rounded-full object-cover"
                  />
                  <span>{course.author}</span>
                </div>

                <span className="flex h-[26px] min-w-[86px] items-center justify-center rounded bg-[#def6e9] px-3 text-[11px] font-bold text-[#20bf72]">
                  {course.category}
                </span>
              </div>

              <h3 className="mt-5 mb-4 text-[13px] font-bold leading-tight text-[#696969]">
                Data Science and Machine Learning With Python Hands On
              </h3>

              <div className="flex items-center justify-between text-[13px] font-semibold text-[#828282]">
                <span className="flex items-center gap-1.5">
                  <Clock3
                    className="h-[14px] w-[14px] text-[#0cc783]"
                    strokeWidth={2.2}
                  />
                  08 hr 15 mins
                </span>

                <span className="flex items-center gap-1.5">
                  <BadgeCheck
                    className="h-[14px] w-[14px] text-[#0cc783]"
                    strokeWidth={2.2}
                  />
                  29 Lectures
                </span>
              </div>

              <div className="mt-5 grid h-[27px] grid-cols-[auto_auto_1fr_auto] items-center gap-2 rounded bg-[#def6e9] px-3">
                <span className="text-[16px] font-extrabold text-[#08b873]">
                  $385.00
                </span>

                <span className="text-[8px] text-[#8a8a8a] line-through">
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
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestNews;
