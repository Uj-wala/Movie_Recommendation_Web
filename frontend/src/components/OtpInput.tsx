import { useRef } from "react";

export default function OtpInput({
  value,
  onChange,
  length = 6,
}: {
  value: string;
  onChange: (v: string) => void;
  length?: number;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const setDigit = (i: number, d: string) => {
    const digit = d.replace(/\D/g, "").slice(-1);
    const chars = Array.from({ length }, (_, k) => value[k] || "");
    chars[i] = digit;
    onChange(chars.join("").slice(0, length));
    if (digit && i < length - 1) refs.current[i + 1]?.focus();
  };

  return (
    <div className="flex gap-2">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => setDigit(i, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !value[i] && i > 0) refs.current[i - 1]?.focus();
          }}
          onPaste={(e) => {
            e.preventDefault();
            const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
            onChange(pasted);
            refs.current[Math.min(pasted.length, length - 1)]?.focus();
          }}
          className="h-12 w-full rounded-lg border border-border bg-surface text-center text-lg font-bold outline-none focus:border-primary"
        />
      ))}
    </div>
  );
}
