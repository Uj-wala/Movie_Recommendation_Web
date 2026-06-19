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

const generateCaptcha = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const Captcha = forwardRef<CaptchaHandle, CaptchaProps>(({ onPrivacyClick, onTermsClick }, ref) => {
  const [value, setValue] = useState('');
  const [status, setStatus] = useState<CaptchaStatus>('default');
  const [captchaText, setCaptchaText] = useState(() => generateCaptcha());

  const isCaptchaValid = (input: string) => input === captchaText;

  useImperativeHandle(ref, () => ({
    validate: () => {
      const isValid = isCaptchaValid(value);
      setStatus(isValid ? 'success' : 'error');
      return isValid;
    },
  }), [captchaText, value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue(val);

    if (val.length === 0) {
      setStatus('default');
    } else if (val.length >= captchaText.length) {
      if (isCaptchaValid(val)) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } else {
      // While typing, stay in default state until full length is reached
      setStatus('default');
    }
  };

  const handleRefresh = () => {
    setCaptchaText(generateCaptcha());
    setValue('');
    setStatus('default');
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
          <div className={`w-full bg-white rounded-md h-[68px] flex items-center justify-center text-[34px] tracking-[0.2em] font-mono text-gray-800 border ${status === 'default' ? 'border-gray-200' :
              status === 'error' ? 'border-[#ff4d4d]' :
                'border-[#33cc66]'
            }`}>
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
            className="w-[34px] h-[34px] flex items-center justify-center rounded bg-[#c5d8fe] text-gray-800 hover:bg-[#b0c8ff] transition-colors"
          >
            <RefreshCw className="w-[18px] h-[18px]" strokeWidth={2} />
          </button>
          <button type="button" className="w-[34px] h-[34px] flex items-center justify-center rounded bg-[#c5d8fe] text-gray-800 hover:bg-[#b0c8ff] transition-colors">
            <Volume2 className="w-[18px] h-[18px]" strokeWidth={2} />
          </button>
          <button type="button" className="w-[34px] h-[34px] flex items-center justify-center rounded bg-[#c5d8fe] text-gray-800 hover:bg-[#b0c8ff] transition-colors">
            <HelpCircle className="w-[18px] h-[18px]" strokeWidth={2} />
          </button>
        </div>
      </div>

      {status === 'error' && (
        <div className="mt-4 text-[13px] text-gray-500 font-bold">
          <span className="text-[#ff4d4d]">Incorrect CAPTCHA.</span>
        </div>
      )}

      {status === 'success' && (
        <div className="mt-4 text-[13px] text-gray-600 font-bold">
          <span className="text-[#33cc66]">CAPTCHA</span> verified Successfully..
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
