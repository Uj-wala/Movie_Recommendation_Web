import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { RefreshCw, Volume2, HelpCircle, Check, X } from 'lucide-react';

type CaptchaStatus = 'default' | 'error' | 'success';

export interface CaptchaHandle {
  validate: () => boolean;
}

interface CaptchaProps {
  onPrivacyClick?: () => void;
  onTermsClick?: () => void;
}

const CAPTCHA_LENGTH = 8;
const CAPTCHA_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const REQUIRED_CAPTCHA_CHAR = 'l';

const generateCaptcha = (currentCaptcha?: string) => {
  let nextCaptcha = '';

  do {
    const captchaChars = Array.from({ length: CAPTCHA_LENGTH }, () =>
      CAPTCHA_CHARS[Math.floor(Math.random() * CAPTCHA_CHARS.length)]
    );
    const requiredCharIndex = Math.floor(Math.random() * CAPTCHA_LENGTH);
    captchaChars[requiredCharIndex] = REQUIRED_CAPTCHA_CHAR;
    nextCaptcha = captchaChars.join('');
  } while (nextCaptcha === currentCaptcha);

  return nextCaptcha;
};

const normalizeCaptchaValue = (text: string) =>
  text
    .split('')
    .map((char) => (['1', 'I', 'i', 'L'].includes(char) ? REQUIRED_CAPTCHA_CHAR : char.toUpperCase()))
    .join('');

const Captcha = forwardRef<CaptchaHandle, CaptchaProps>(({ onPrivacyClick, onTermsClick }, ref) => {
  const [value, setValue] = useState('');
  const [status, setStatus] = useState<CaptchaStatus>('default');
  const [errorMessage, setErrorMessage] = useState('');
  const [captchaText, setCaptchaText] = useState(() => generateCaptcha());
  const [showHelp, setShowHelp] = useState(false);

  const isCaptchaValid = (input: string) =>
    normalizeCaptchaValue(input) === normalizeCaptchaValue(captchaText);

  useImperativeHandle(ref, () => ({
    validate: () => {
      const isValid = isCaptchaValid(value);
      setStatus(isValid ? 'success' : 'error');
      setErrorMessage(isValid ? '' : value ? 'Incorrect CAPTCHA.' : 'CAPTCHA is required.');
      return isValid;
    },
  }), [captchaText, value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue(val);

    if (val.length === 0) {
      setStatus('default');
      setErrorMessage('');
    } else if (val.length >= captchaText.length) {
      if (isCaptchaValid(val)) {
        setStatus('success');
        setErrorMessage('');
      } else {
        setStatus('error');
        setErrorMessage('Incorrect CAPTCHA.');
      }
    } else {
      // While typing, stay in default state until full length is reached
      setStatus('default');
    }
  };

  const handleRefresh = () => {
    window.speechSynthesis?.cancel();
    setCaptchaText(generateCaptcha(captchaText));
    setValue('');
    setStatus('default');
    setErrorMessage('');
  };

  const handlePlayAudio = () => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      captchaText.split('').join(', '),
    );
    utterance.rate = 0.7;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  const getScribbleClass = (index: number) => {
    const variations = [
      'italic transform -rotate-6 translate-y-[2px]',
      'transform rotate-3 -translate-y-[2px]',
      'transform rotate-6',
      'italic transform -rotate-3 translate-y-[1px]',
      'transform -rotate-6 -translate-y-[1px]',
      'italic transform rotate-6 translate-y-[2px]',
      'transform -rotate-3 -translate-y-[2px]',
      'italic transform rotate-2'
    ];
    return variations[index % variations.length];
  };

  return (
    <div
      className={`rounded-xl border-[2px] p-5 mb-6 relative transition-colors ${status === 'default' ? 'bg-[#dae8fc] border-[#7aa0ff]' :
          status === 'error' ? 'bg-[#fff5f5] border-[#ff4d4d]' :
            'bg-[#e2ffe7] border-[#33cc66]'
        }`}
    >
      <div className="flex gap-4">
        {/* Left Column: Image Box and Input */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Captcha Image */}
          <div className={`w-full bg-white rounded-md h-[68px] flex items-center justify-center text-[34px] tracking-[0.2em] font-black text-gray-800 border ${status === 'default' ? 'border-gray-200' :
              status === 'error' ? 'border-[#ff4d4d]' :
                'border-[#33cc66]'
            }`}
            style={{ fontFamily: 'Verdana, Arial, sans-serif' }}
          >
            {captchaText.split('').map((char, index) => (
              <span
                key={index}
                className={`inline-block mx-[3px] ${getScribbleClass(index)}`}
              >
                {char}
              </span>
            ))}
          </div>

          {/* Input */}
          <input
            type="text"
            value={value}
            onChange={handleChange}
            placeholder="Enter the Captcha"
            className={`w-full py-2.5 px-4 rounded-md text-[15px] bg-white outline-none transition-colors border ${status === 'default' ? 'border-transparent text-gray-700' :
                status === 'error' ? 'border-[#ff4d4d] text-[#ff4d4d]' :
                  'border-[#33cc66] text-[#33cc66]'
              }`}
          />
        </div>

        {/* Right Column: Buttons */}
        <div className="flex flex-col justify-between">
          <button
            type="button"
            onClick={handleRefresh}
            aria-label="Generate a new CAPTCHA"
            className="w-[34px] h-[34px] flex items-center justify-center rounded bg-[#c5d8fe] text-gray-800 hover:bg-[#b0c8ff] transition-colors"
          >
            <RefreshCw className="w-[18px] h-[18px]" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={handlePlayAudio}
            aria-label="Play audio CAPTCHA"
            className="w-[34px] h-[34px] flex items-center justify-center rounded bg-[#c5d8fe] text-gray-800 hover:bg-[#b0c8ff] transition-colors"
          >
            <Volume2 className="w-[18px] h-[18px]" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={() => setShowHelp((isVisible) => !isVisible)}
            aria-label={showHelp ? 'Hide CAPTCHA help' : 'Show CAPTCHA help'}
            aria-expanded={showHelp}
            aria-controls="captcha-help"
            className="w-[34px] h-[34px] flex items-center justify-center rounded bg-[#c5d8fe] text-gray-800 hover:bg-[#b0c8ff] transition-colors"
          >
            <HelpCircle className="w-[18px] h-[18px]" strokeWidth={2} />
          </button>
        </div>
      </div>

      {showHelp && (
        <div
          id="captcha-help"
          role="status"
          className="mt-4 rounded-md bg-white/80 px-3 py-2 text-[12px] leading-5 text-gray-700"
        >
          Enter the characters shown in the image. Use the refresh button for a
          new CAPTCHA or the audio button to hear the characters.
        </div>
      )}

      {status === 'error' && (
        <div className="mt-4 text-[13px] text-gray-500 font-bold">
          <span className="text-[#ff4d4d]">{errorMessage}</span>
        </div>
      )}

      {status === 'success' && (
        <div className="mt-4 text-[13px] text-gray-600 font-bold">
          <span className="text-[#33cc66]">CAPTCHA</span> verified successfully.
        </div>
      )}

      <div className={`flex justify-between items-center ${status === 'default' ? 'mt-8' : 'mt-4'} text-[11px]`}>
        <span className="text-blue-500">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onPrivacyClick?.();
            }}
            className="hover:underline"
          >
            Privacy
          </a>{" "}
          &{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onTermsClick?.();
            }}
            className="hover:underline"
          >
            Terms
          </a>
        </span>
        <div className={`flex items-center font-bold tracking-wide ${status === 'default' ? 'text-gray-500' :
            status === 'error' ? 'text-[#ff4d4d]' :
              'text-[#33cc66]'
          }`}>
          {status === 'error' ? (
            <X className="w-[14px] h-[14px] mr-1" strokeWidth={3} />
          ) : (
            <Check className="w-[14px] h-[14px] mr-1" strokeWidth={3} />
          )}
          ReCAPTCHA
        </div>
      </div>
    </div>
  );
});

Captcha.displayName = 'Captcha';

export default Captcha;
