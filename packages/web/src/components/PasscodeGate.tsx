import { useState, useRef, useEffect, type KeyboardEvent } from "react";

const PASSCODE = "856";
const SESSION_KEY = "beigne-unlocked";
const DIGIT_COUNT = PASSCODE.length;

export function PasscodeGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === "true",
  );
  const [digits, setDigits] = useState<string[]>(Array(DIGIT_COUNT).fill(""));
  const [error, setError] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!unlocked) inputsRef.current[0]?.focus();
  }, [unlocked]);

  function handleChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;

    const next = [...digits];
    next[index] = value.slice(-1);
    setDigits(next);
    setError(false);

    if (value && index < DIGIT_COUNT - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    if (next.every((d) => d !== "") && next.join("") !== "") {
      const code = next.join("");
      if (code.length === DIGIT_COUNT) {
        if (code === PASSCODE) {
          sessionStorage.setItem(SESSION_KEY, "true");
          setUnlocked(true);
        } else {
          setError(true);
          setDigits(Array(DIGIT_COUNT).fill(""));
          setTimeout(() => inputsRef.current[0]?.focus(), 150);
        }
      }
    }
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  if (unlocked) return <>{children}</>;

  return (
    <div className="min-h-screen bg-fun flex items-center justify-center relative overflow-hidden">
      <div className="relative z-10 text-center">
        <h1 className="text-5xl font-bold mb-2">
          🍩 <span className="text-gradient">Beigne</span>
        </h1>
        <p className="text-gray-400 text-sm mb-8">
          Entrez le code pour accéder à l'app
        </p>

        <div className="flex gap-3 justify-center mb-4">
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputsRef.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`w-14 h-16 text-center text-2xl font-bold rounded-xl bg-slate-800/60 border-2 text-white outline-none transition-all focus:ring-2 focus:ring-purple-500/50 ${
                error
                  ? "border-red-500 animate-[shake_0.4s_ease-in-out]"
                  : "border-slate-700 focus:border-purple-500"
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-red-400 text-sm animate-fade-in-up">
            Code incorrect, réessayez
          </p>
        )}
      </div>
    </div>
  );
}
