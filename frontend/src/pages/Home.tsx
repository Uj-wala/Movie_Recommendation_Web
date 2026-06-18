import { useState } from "react";
import { Link } from "react-router-dom";
import { Globe, ChevronDown, Check } from "lucide-react";
import Logo from "../components/Logo";
import FirstPage from "../modules/landing/FirstPage";
import SecondPage from "../modules/landing/SecondPage";
import BecomeInstructor from "../modules/landing/BecomeInstructor";

const Home = () => {
  const [isLangOpen, setIsLangOpen] = useState(false); // default open to match design
  const [selectedLanguage, setSelectedLanguage] = useState("English");

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

  return (
    <div className="min-h-screen bg-[#fafaf9] font-sans relative">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-8 py-4 gap-4 sm:gap-0 bg-[#defaeb]">
        <div className="flex items-center gap-3">
          <Logo
            className="flex items-center"
            imgClassName="h-10 object-contain"
          />
          <div>
            <h1 className="text-xl font-bold text-brand-green leading-tight">
              E-Learning
            </h1>
            <p className="text-xs text-gray-600">AI-Powered</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4">
          <Link
            to="/login"
            className="flex items-center gap-2 px-5 py-2 border border-brand-green text-brand-green rounded-md font-semibold hover:bg-green-50 transition-colors"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            Login
          </Link>
          <Link
            to="/register"
            className="px-5 py-2 bg-brand-green text-white rounded-md font-semibold hover:bg-brand-green-hover transition-colors"
          >
            Sign Up
          </Link>

          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1 text-gray-700 hover:text-gray-900 font-medium ml-2"
            >
              <Globe className="w-4 h-4" />
              {getLanguageCode(selectedLanguage)}
              <ChevronDown className="w-4 h-4" />
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-4 w-48 max-h-[300px] overflow-y-auto bg-[#defaeb] rounded-md shadow-lg py-2 z-10">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setSelectedLanguage(lang);
                      setIsLangOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-base text-gray-700 hover:bg-green-100 flex items-center justify-between"
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

      {/* Main Content — Landing Sections */}
      <main>
        <FirstPage />
        <SecondPage />
        {/* BecomeInstructor chains into StudentTestimonials → LatestNews → Footer */}
        <BecomeInstructor />
      </main>
    </div>
  );
};

export default Home;
