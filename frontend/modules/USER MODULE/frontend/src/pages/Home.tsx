import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  Globe,
  Search, 
  Check, 
  Triangle,
  LogOut, 

} from "lucide-react";
import Logo from "../components/Logo";
import FirstPage from "./Landing pages/FirstPage";
import SecondPage from "./Landing pages/SecondPage";
const Home: React.FC = () => {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  const languages = [
    "English",
    "Deutch",
    "Nederland",
    "Portuguese",
    "Indonesia",
    "Turkey",
  ];

  

  const getLanguageCode = (lang: string) => {
    switch (lang) {
      case "English": return "EN";
      case "Deutch": return "DE";
      case "Nederland": return "NL";
      case "Portuguese": return "PT";
      case "Indonesia": return "ID";
      case "Turkey": return "TR";
      default: return "EN";
    }
  };

   

  return (
    <div className="min-h-screen bg-[#E1F3E7] overflow-hidden font-sans">
      
      {/* ================= NAVBAR ================= */}
      <header className="bg-[#A6E8B8] h-[72px] flex items-center px-12 xl:px-20">
        <div className="w-full flex items-center justify-between gap-6">
          
          {/* Logo Group */}
          <div className="flex items-center gap-4 shrink-0">
            <Logo
              className="flex items-center"
              imgClassName="h-10 object-contain"
            />
            <div>
              <h2 className="text-[22px] font-bold text-[#0A7A36] leading-tight">
                E-Learning
              </h2>
              <p className="text-sm text-[#3f4a4d]">AI-Powered</p>
            </div>
          </div>

          {/* Navigation Menu Links */}
          <div className="hidden lg:flex items-center gap-14 shrink-0">
            <button className=" flex items-center gap-2 text-lg font-medium text-[#212832] hover:text-[#0A7A36] transition-colors">
              Courses 
              <Triangle size={10} className="fill-current rotate-180" />
            </button>
            <button className=" text-lg font-medium text-[#22313F] hover:text-[#0A7A36] transition-colors">
              Contact Us
              
            </button>
          </div>

          {/* Search Input Bar */}
          <div className="relative max-w-[321px] w-full hidden md:block">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-[#2E8B45]"
              size={16}
            />
            <input
              type="text"
              placeholder="Search Your Course"
              className="w-full h-[48px] rounded-2xl border border-[#2E8B45] bg-[#F7F7F7] pl-14 pr-5 text-lg outline-none placeholder:text-[#2E8B45] focus:bg-white/20 transition-all "
            />
          </div>

          {/* Actions & Language Dropdown */}
          <div className="flex items-center gap-5 shrink-0">
            <Link
              to="/login"
              className="w-[174px] h-[52px] rounded-xl border border-[#2E8B45] flex items-center justify-center gap-2 text-[#0A7A36] font-semibold text-lg hover:bg-white/20 transition-colors"
            >
             <LogOut size={20} className="text-[#2E8B45]" />
              Login
            </Link>

            <Link
              to="/register"
              className="w-[150px] h-[56px] rounded-xl bg-[#008A36] text-white flex items-center justify-center font-semibold text-lg hover:bg-[#00722c] transition-colors"
            >
              Sign Up
            </Link>

            {/* Custom Interactive Language Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-2 text-lg font-medium text-[#22313F] hover:text-[#0A7A36] transition-colors"
              >
                <Globe size={20} />
                {getLanguageCode(selectedLanguage)}
                <ChevronDown size={18} className={`transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-4 w-48 bg-[#defaeb] rounded-md shadow-lg py-2 z-50 border border-green-200">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setSelectedLanguage(lang);
                        setIsLangOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-green-100 flex items-center justify-between transition-colors"
                    >
                      {lang}
                      {lang === selectedLanguage && (
                        <Check className="w-4 h-4 text-[#0A7A36]" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      <FirstPage/>
      <SecondPage/>


    </div>
  );
};

export default Home;