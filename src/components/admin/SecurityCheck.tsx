import { useEffect, useState } from "react";
import { ShieldCheck, Loader2 } from "lucide-react";

interface Props {
  onVerified: () => void;
}

/**
 * Cloudflare-style "Verifying you are human" interstitial.
 * Purely client-side UX gate — real security is enforced on the backend.
 */
const SecurityCheck = ({ onVerified }: Props) => {
  const [checked, setChecked] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [done, setDone] = useState(false);
  const [ray] = useState(() =>
    Array.from({ length: 16 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("")
  );

  const handleCheck = () => {
    if (verifying || done) return;
    setChecked(true);
    setVerifying(true);
    // Simulate a challenge round-trip
    setTimeout(() => {
      setVerifying(false);
      setDone(true);
      setTimeout(onVerified, 600);
    }, 1600 + Math.random() * 800);
  };

  useEffect(() => {
    // Auto-run after a brief pause for that "checking your browser" feel
    const t = setTimeout(handleCheck, 900);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#f5f5f0] text-slate-800">
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-xl">
          <h1 className="text-2xl md:text-3xl font-normal text-slate-900 mb-2">
            admin.flowentra.io
          </h1>
          <p className="text-slate-600 text-sm md:text-base mb-8">
            Verifying you are human. This may take a few seconds.
          </p>

          <div className="bg-white border border-slate-200 rounded-md shadow-sm p-5 flex items-center gap-4">
            <button
              type="button"
              onClick={handleCheck}
              disabled={verifying || done}
              className="relative w-7 h-7 rounded border border-slate-400 bg-white flex items-center justify-center shrink-0 hover:border-slate-500 transition-colors disabled:cursor-default"
              aria-label="Verify"
            >
              {verifying && (
                <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
              )}
              {done && (
                <svg
                  className="w-5 h-5 text-emerald-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
              {!verifying && !done && checked && (
                <div className="w-3 h-3 rounded-sm bg-slate-300" />
              )}
            </button>

            <div className="flex-1">
              <div className="text-sm font-medium text-slate-800">
                {done
                  ? "Success!"
                  : verifying
                  ? "Verifying..."
                  : "Verify you are human"}
              </div>
              <div className="text-xs text-slate-500">
                by performing an action
              </div>
            </div>

            <div className="flex flex-col items-end text-[10px] text-slate-400 leading-tight">
              <ShieldCheck className="w-6 h-6 text-orange-500 mb-0.5" />
              <span className="font-semibold text-slate-500">FLOWENTRA</span>
              <span>Security</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-6 leading-relaxed">
            admin.flowentra.io needs to review the security of your connection
            before proceeding.
          </p>
        </div>
      </div>

      <footer className="px-4 py-4 border-t border-slate-200 text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-2">
        <span>Ray ID: {ray}</span>
        <span>
          Performance &amp; security by{" "}
          <span className="font-semibold text-slate-600">Flowentra Shield</span>
        </span>
      </footer>
    </div>
  );
};

export default SecurityCheck;
