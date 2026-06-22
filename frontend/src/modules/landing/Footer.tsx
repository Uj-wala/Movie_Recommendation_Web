import Logo from "../../components/Logo";
import { Link } from "react-router-dom";

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
  background: #e1f3e7;
  color: #212832;
  font-family: Roboto, Arial, Helvetica, sans-serif;
  height: 512px;
  overflow: hidden;
  position: relative;
  width: 100%;
}

.landing-footer-container {
  height: 100%;
  margin: 0 auto;
  max-width: 1308px;
  position: relative;
  width: 100%;
}

.footer-brand-column {
  left: 0;
  position: absolute;
  top: 102px;
  width: 238px;
}

.landing-footer-container > .footer-column:nth-child(2) {
  left: 311px;
  position: absolute;
  top: 114px;
  width: 168px;
}

.landing-footer-container > .footer-column:nth-child(3) {
  left: 665px;
  position: absolute;
  top: 114px;
  width: 175px;
}

.footer-subscribe {
  left: 990px;
  position: absolute;
  top: 114px;
  width: 310px;
}

.footer-logo-row {
  align-items: center;
  display: flex;
  gap: 16px;
  height: 54px;
  width: 204px;
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
  height: 54px;
  object-fit: contain;
  transition: box-shadow 220ms ease, transform 220ms ease;
  width: 54px;
}

.footer-logo-row:hover .footer-logo-image {
  box-shadow: 0 10px 20px rgba(23, 135, 59, 0.18);
  transform: scale(1.03);
}

.footer-brand-link {
  display: block;
  text-decoration: none;
}

.footer-brand-name {
  color: #238b45;
  font-family: Poppins, sans-serif;
  font-size: 24px;
  font-weight: 600;
  height: 24px;
  line-height: 1;
  margin: 0 0 8px;
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
  margin-top: 57px;
}

.footer-address strong {
  color: #212832;
  display: block;
  font-family: Roboto, sans-serif;
  font-size: 32px;
  font-weight: 400;
  height: 35px;
  line-height: 1.11;
  margin: 0 0 6px;
}

.footer-address span {
  color: #51a06f;
  display: block;
  font-family: Roboto, sans-serif;
  font-size: 20px;
  font-weight: 400;
  height: 22px;
  line-height: 1.11;
}

.footer-contact {
  color: #212832;
  font-family: Roboto, sans-serif;
  font-size: 20px;
  font-weight: 400;
  line-height: 2.5;
  margin: 30px 0 0 23px;
}

.footer-contact p {
  height: 50px;
  margin: 0;
}

.footer-column,
.footer-subscribe {
  padding-top: 0;
}

.footer-column h2,
.footer-subscribe h2 {
  color: #212832;
  font-family: Roboto, sans-serif;
  font-size: 32px;
  font-weight: 400;
  height: 35px;
  line-height: 1.11;
  margin: 0 0 33px;
}

.footer-column a {
  color: #212832;
  display: block;
  font-family: Roboto, sans-serif;
  font-size: 20px;
  font-weight: 400;
  line-height: 2.5;
  margin: 0;
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
  color: #212832;
  font-family: Roboto, sans-serif;
  font-size: 20px;
  font-weight: 400;
  height: 66px;
  line-height: 1.11;
  margin: 48px 0 44px;
  width: 306px;
}

.footer-subscribe input {
  background: #ffffff;
  border: 0;
  border-radius: 15px;
  box-shadow: 0 4px 7px rgba(0, 0, 0, 0.24);
  color: #424242;
  display: block;
  font-family: Roboto, sans-serif;
  font-size: 20px;
  font-weight: 400;
  height: 59px;
  margin-bottom: 40px;
  outline: 0;
  padding: 0 28px;
  transition: box-shadow 180ms ease, transform 180ms ease;
  width: 289px;
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
  border-radius: 6px;
  box-shadow: 0 0 0 rgba(23, 135, 59, 0);
  color: #ffffff;
  cursor: pointer;
  font-family: "Instrument Sans", sans-serif;
  font-size: 23px;
  font-weight: 600;
  height: 51px;
  line-height: 1;
  padding: 0 27px;
  position: relative;
  transition: background-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
  width: 220px;
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
  .landing-footer {
    height: auto;
    min-height: 512px;
    overflow: visible;
  }

  .landing-footer-container {
    display: grid;
    gap: 56px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    height: auto;
    max-width: calc(100% - 48px);
    padding-bottom: 64px;
    padding-top: 72px;
  }

  .footer-brand-column,
  .landing-footer-container > .footer-column:nth-child(2),
  .landing-footer-container > .footer-column:nth-child(3),
  .footer-subscribe {
    position: static;
  }
}

@media (max-width: 1100px) {
  .landing-footer-container {
    gap: 56px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .landing-footer-container {
    gap: 40px;
    grid-template-columns: 1fr;
    max-width: calc(100% - 56px);
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
      <footer id="footer" className="landing-footer">
        <div className="landing-footer-container">
          <div className="footer-brand-column">
            <div className="footer-logo-row">
              <Logo className="footer-logo" imgClassName="footer-logo-image" />
              <Link to="/" className="footer-brand-link" aria-label="Go to Home Page">
                <p className="footer-brand-name">E-Learning</p>
                <p className="footer-brand-subtitle">AI-Powered</p>
              </Link>
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
