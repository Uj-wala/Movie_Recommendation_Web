import Logo from "../../components/Logo";

const categoryLinks: string[] = [
  "Creative Writing",
  "Marketing",
  "Business Analytics",
  "UI/UX Design",
  "Graphic Design",
  "Film & Video",
];

const quickLinks: string[] = [
  "Privacy Policy",
  "Read More",
  "Terms & Conditions",
  "Customer Support",
  "Course FAQ's",
];

const footerStyles = `
.landing-footer {
  background: #e1f6e9;
  color: #424242;
  font-family: Arial, Helvetica, sans-serif;
  padding: clamp(64px, 7vw, 109px) clamp(24px, 4.15vw, 64px) clamp(34px, 3vw, 43px);
}

.landing-footer-container {
  display: grid;
  column-gap: clamp(38px, 4.5vw, 70px);
  grid-template-columns:
    minmax(210px, 266px)
    minmax(190px, 313px)
    minmax(190px, 281px)
    minmax(280px, 335px);
  margin: 0 auto;
  max-width: min(1416px, 100%);
  width: 100%;
}

.footer-logo-row {
  align-items: flex-start;
  display: flex;
  gap: 18px;
  width: fit-content;
  transition: transform 220ms ease;
}

.footer-logo-row:hover {
  transform: translateY(-3px);
}

.footer-logo {
  flex: 0 0 auto;
  margin: 1px 0 0;
}

.footer-logo-image {
  display: block;
  height: 58px;
  object-fit: contain;
  transition: box-shadow 220ms ease, transform 220ms ease;
  width: 58px;
}

.footer-logo-row:hover .footer-logo-image {
  box-shadow: 0 10px 20px rgba(23, 135, 59, 0.18);
  transform: scale(1.03);
}

.footer-brand-name {
  color: #17873b;
  font-size: clamp(24px, 1.75vw, 27px);
  font-weight: 800;
  line-height: 1;
  margin: 1px 0 10px;
  transition: color 220ms ease;
}

.footer-logo-row:hover .footer-brand-name {
  color: #0f7430;
}

.footer-brand-subtitle {
  color: #252c34;
  font-size: clamp(18px, 1.3vw, 20px);
  font-weight: 400;
  line-height: 1;
  margin: 0;
}

.footer-address {
  font-style: normal;
  margin-top: clamp(42px, 4.25vw, 65px);
}

.footer-address strong {
  color: #3f3f3f;
  display: block;
  font-size: clamp(28px, 2.2vw, 34px);
  font-weight: 400;
  line-height: 1;
  margin-bottom: 8px;
}

.footer-address span {
  color: #62c786;
  display: block;
  font-size: clamp(18px, 1.45vw, 22px);
  font-weight: 400;
  line-height: 1.1;
}

.footer-contact {
  color: #3f3f3f;
  font-size: clamp(18px, 1.5vw, 23px);
  font-weight: 400;
  line-height: 1;
  margin: clamp(34px, 3.3vw, 50px) 0 0 19px;
}

.footer-contact p {
  margin: 0 0 clamp(22px, 2.1vw, 32px);
}

.footer-column,
.footer-subscribe {
  padding-top: 13px;
}

.footer-column h2,
.footer-subscribe h2 {
  color: #424242;
  font-size: clamp(29px, 2.3vw, 35px);
  font-weight: 400;
  line-height: 1;
  margin: 0 0 clamp(34px, 3.25vw, 50px);
}

.footer-column a {
  color: #424242;
  display: block;
  font-size: clamp(18px, 1.5vw, 23px);
  font-weight: 400;
  line-height: 1;
  margin-bottom: clamp(22px, 2vw, 31px);
  position: relative;
  text-decoration: none;
  transition: color 180ms ease, transform 180ms ease;
  width: fit-content;
}

.footer-column a::after {
  background: #62c786;
  border-radius: 999px;
  bottom: -6px;
  content: "";
  height: 2px;
  left: 0;
  position: absolute;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 180ms ease;
  width: 100%;
}

.footer-column a:hover {
  color: #17873b;
  transform: translateX(6px);
}

.footer-column a:hover::after {
  transform: scaleX(1);
}

.footer-subscribe p {
  color: #424242;
  font-size: clamp(18px, 1.5vw, 23px);
  font-weight: 400;
  line-height: 1.04;
  margin: 0 0 clamp(32px, 3.1vw, 48px);
  max-width: 335px;
}

.footer-subscribe input {
  background: #ffffff;
  border: 0;
  border-radius: 13px;
  box-shadow: 0 5px 7px rgba(0, 0, 0, 0.22);
  color: #424242;
  display: block;
  font-family: inherit;
  font-size: clamp(18px, 1.5vw, 23px);
  font-weight: 400;
  height: clamp(58px, 4.5vw, 69px);
  margin-bottom: clamp(32px, 3.05vw, 47px);
  outline: 0;
  padding: 0 31px;
  transition: box-shadow 180ms ease, transform 180ms ease;
  width: min(335px, 100%);
}

.footer-subscribe input::placeholder {
  color: #424242;
  opacity: 1;
}

.footer-subscribe input:hover,
.footer-subscribe input:focus {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2), 0 0 0 3px rgba(98, 199, 134, 0.16);
  transform: translateY(-2px);
}

.footer-subscribe button {
  background: #62c786;
  border: 0;
  border-radius: 7px;
  box-shadow: 0 0 0 rgba(23, 135, 59, 0);
  color: #ffffff;
  cursor: pointer;
  font-family: inherit;
  font-size: clamp(21px, 1.62vw, 25px);
  font-weight: 700;
  height: clamp(52px, 3.75vw, 58px);
  line-height: 1;
  padding: 0 27px;
  position: relative;
  transition: background-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
  width: min(255px, 100%);
}

.footer-subscribe button:hover {
  background: #55ba79;
  box-shadow: 0 12px 24px rgba(23, 135, 59, 0.25);
  transform: translateY(-4px);
}

.footer-subscribe button:active {
  transform: translateY(-1px);
}

.footer-column a:focus-visible,
.footer-subscribe input:focus-visible,
.footer-subscribe button:focus-visible {
  outline: 3px solid rgba(98, 199, 134, 0.38);
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  .footer-logo-row,
  .footer-logo-image,
  .footer-brand-name,
  .footer-column a,
  .footer-column a::after,
  .footer-subscribe input,
  .footer-subscribe button {
    transition: none;
  }

  .footer-logo-row:hover,
  .footer-logo-row:hover .footer-logo-image,
  .footer-column a:hover,
  .footer-subscribe input:hover,
  .footer-subscribe input:focus,
  .footer-subscribe button:hover,
  .footer-subscribe button:active {
    transform: none;
  }
}

@media (max-width: 1240px) {
  .landing-footer-container {
    grid-template-columns:
      minmax(200px, 1fr)
      minmax(170px, 0.85fr)
      minmax(170px, 0.85fr)
      minmax(260px, 1fr);
  }
}

@media (max-width: 1100px) {
  .landing-footer-container {
    gap: 56px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .landing-footer {
    padding: 64px 28px 36px;
  }

  .landing-footer-container {
    gap: 40px;
    grid-template-columns: 1fr;
  }

  .footer-column,
  .footer-subscribe {
    padding-top: 0;
  }

  .footer-address {
    margin-top: 42px;
  }

  .footer-column h2,
  .footer-subscribe h2 {
    font-size: 32px;
    margin-bottom: 34px;
  }

  .footer-subscribe input {
    max-width: 100%;
    width: 100%;
  }
}
`;

const Footer = () => {
  return (
    <>
      <style>{footerStyles}</style>
      <footer className="landing-footer">
        <div className="landing-footer-container">
          <div className="footer-brand-column">
            <div className="footer-logo-row">
              <Logo className="footer-logo" imgClassName="footer-logo-image" />
              <div>
                <p className="footer-brand-name">E-Learning</p>
                <p className="footer-brand-subtitle">AI-Powered</p>
              </div>
            </div>

            <address className="footer-address">
              <strong>Caribbean Ct</strong>
              <span>Haymarket, Virginia(VA)</span>
            </address>

            <div className="footer-contact">
              <p>Mail Id</p>
              <p>Phone Number</p>
            </div>
          </div>

          <nav className="footer-column" aria-label="Category">
            <h2>Category</h2>
            {categoryLinks.map((item) => (
              <a href="/" key={item}>
                {item}
              </a>
            ))}
          </nav>

          <nav className="footer-column" aria-label="Quick Links">
            <h2>Quick Links</h2>
            {quickLinks.map((item) => (
              <a href="/" key={item}>
                {item}
              </a>
            ))}
          </nav>

          <form className="footer-subscribe">
            <h2>Subscribe</h2>
            <p>
              Lorem Ipsum has been them an industry printer took a galley make
              book
            </p>
            <input
              aria-label="Email address"
              autoComplete="email"
              inputMode="email"
              maxLength={254}
              name="email"
              pattern="^[^\s@]+@[^\s@]+\.[^\s@]{2,}$"
              placeholder="Enter your email"
              required
              title="Enter a valid email address, for example name@example.com"
              type="email"
            />
            <button type="submit">Subscribe Now</button>
          </form>
        </div>
      </footer>
    </>
  );
};

export default Footer;
