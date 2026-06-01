import homeLogo from '../assets/images/Home_Logo.jpeg'

function EducationLogo() {
  return (
    <a
      href="#home"
      aria-label="E-Learning AI-Powered home"
      className="group flex items-start gap-[10px] focus-visible:rounded-[4px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      <span className="relative h-[37px] w-[34px] shrink-0 overflow-hidden rounded-[2px] bg-brand">
        <img
          src={homeLogo}
          width="1260"
          height="1257"
          alt="AIcademy"
          className="absolute left-1/2 top-1/2 h-[38px] w-[38px] max-w-none -translate-x-1/2 -translate-y-1/2 object-cover"
        />
      </span>

      <span className="mt-[-1px] flex flex-col items-start">
        <span className="text-[15px] font-[700] leading-[20px] text-brand">E-Learning</span>
        <span className="text-[12px] font-[400] leading-[17px] text-black">AI-Powered</span>
      </span>
    </a>
  )
}

export default EducationLogo
