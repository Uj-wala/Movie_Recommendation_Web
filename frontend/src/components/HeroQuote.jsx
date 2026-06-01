function HeroQuote() {
  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      className="motion-scroll-reveal relative flex min-h-0 flex-1 items-start justify-center bg-[#fdfdfd] px-6 pt-[37.2vh]"
      data-aos="zoom-in"
      data-aos-duration="800"
    >
      <h1
        id="hero-heading"
        className="motion-reveal max-w-[560px] text-center text-[29px] font-[500] italic leading-[1.48] text-black"
        data-aos="fade-up"
        data-aos-delay="120"
      >
        The More that&nbsp; you read, the
        <br className="hidden sm:block" />
        more things you will know...
      </h1>
    </section>
  )
}

export default HeroQuote
