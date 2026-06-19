import { useEffect, useRef } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import confetti from "canvas-confetti";
import thumbsup from "./thumbsup2.json";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVisitProfile: () => void;
}

export default function SuccessModal({ isOpen, onClose, onVisitProfile }: SuccessModalProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      const end = Date.now() + 2200;

      const colors = ["#1a7a4a", "#4ade80", "#fbbf24", "#f472b6", "#818cf8"];

      const frame = () => {
        confetti({
          particleCount: 6,
          angle: 60,
          spread: 70,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: 6,
          angle: 120,
          spread: 70,
          origin: { x: 1 },
          colors,
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      };

      frame();
    }, 400);

    return () => clearTimeout(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-[380px] px-8 py-8 flex flex-col items-center gap-2 animate-[popIn_0.35s_cubic-bezier(0.34,1.56,0.64,1)]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors"
        >
          <button className="text-red-600">x</button>
        </button>

        {/* Title */}
        <div className="text-center animate-[slideDown_0.4s_ease_0.1s_both]">
          <h2 className="text-2xl font-bold text-gray-900">Congratulations!</h2>
          <p className="text-sm text-gray-500 mt-1">Your Profile has been Updated successfully.</p>
        </div>

        {/* Lottie thumbs up */}
        <div className="-mt-8 -mb-8  animate-[scaleIn_0.5s_cubic-bezier(0.34,1.56,0.64,1)_0.2s_both]">
          <Player
            ref={playerRef}
            autoplay
            keepLastFrame
            src={thumbsup}
            style={{ width: 350, height: 350 }}
          />
        </div>

        {/* Button */}
        <button
          onClick={onVisitProfile}
          className="w-full bg-[#1a7a4a] hover:bg-[#155f39] text-white font-semibold text-sm py-3 rounded-xl transition-colors animate-[slideUp_0.4s_ease_0.3s_both]"
        >
          Visit My Profile Screen
        </button>
      </div>
    </div>
  );
}