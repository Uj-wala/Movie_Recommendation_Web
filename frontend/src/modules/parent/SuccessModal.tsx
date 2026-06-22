interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVisitProfile: () => void;
}

export default function SuccessModal({
  isOpen,
  onClose,
  onVisitProfile,
}: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-[460px] rounded-[24px] bg-white p-10 text-center shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close success message"
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-2xl leading-none text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#299555]/40"
        >
          &times;
        </button>

        <h2 className="mb-2 font-sans text-[34px] font-bold tracking-tight text-[#333333]">
          Congratulations!
        </h2>
        <p className="mb-10 text-[15px] text-[#666666]">
          Your Profile has been Updated successfully.
        </p>

        <div className="relative mb-10 flex h-[180px] w-full items-center justify-center">
          <img
            src="/Group%201000002268.png"
            alt="Success Thumbs Up"
            className="h-[180px] w-[180px] object-contain"
          />
        </div>

        <button
          type="button"
          onClick={onVisitProfile}
          className="w-full rounded-xl bg-[#299555] px-4 py-4 text-[16px] font-bold text-white shadow-sm transition-colors hover:bg-[#238148]"
        >
          Visit My Profile Screen
        </button>
      </div>
    </div>
  );
}
