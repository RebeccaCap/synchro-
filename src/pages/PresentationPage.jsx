import { useEffect, useState } from "react";
import { api, downloadUrl } from "../api";
import {
  Eyebrow,
  ErrorMessage,
  FileBadge,
  GradientLine,
  PageShell,
  cardClass,
  formatBytes,
  formatDateTime,
  inputClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "./shared";

function LoginForm({ onLogin, notice }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      onLogin(await api("viewer.php?action=login", { method: "POST", body: { code } }));
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className={`${cardClass} max-w-xl mx-auto p-8 md:p-12 overflow-hidden`}>
      <GradientLine />
      <div className="absolute right-[-20%] bottom-[-30%] w-[320px] h-[320px] rounded-full bg-[radial-gradient(circle,rgba(218,65,15,.18),transparent_70%)] dark:bg-[radial-gradient(circle,rgba(225,103,49,.18),transparent_70%)] pointer-events-none" />

      <div className="relative">
        <Eyebrow>Presentation materials</Eyebrow>
        <h1 className="text-[clamp(2rem,1.5rem+2vw,3.2rem)] leading-[0.95] tracking-[-0.05em] font-bold text-ink dark:text-paper">
          Enter your access password
        </h1>
        <p className="mt-4 text-ink/70 dark:text-paper/70 leading-relaxed">
          Use the password you have been provided to access the material.
        </p>

        {notice && (
          <p className="mt-6 px-4 py-3 border border-orangeLight/40 dark:border-orangeDark/40 text-sm text-ink/80 dark:text-paper/80">
            {notice}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <label htmlFor="access-code" className="sr-only">
            Access password
          </label>
          <input
            id="access-code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="XXXX-XXXX-XXXX"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            required
            className={`${inputClass} h-14 text-lg font-mono tracking-[0.2em]`}
          />
          <ErrorMessage>{error}</ErrorMessage>
          <button type="submit" disabled={loading} className={`${primaryButtonClass} h-14 text-lg`}>
            {loading ? "Checking…" : "View materials"}
          </button>
        </form>

        <p className="mt-8 text-sm text-ink/60 dark:text-paper/60">
          Problems accessing the materials?{" "}
          <a href="mailto:info@synchroforum.eu" className="text-orangeLight dark:text-orangeDark hover:underline">
            info@synchroforum.eu
          </a>
        </p>
      </div>
    </div>
  );
}

function Materials({ data }) {
  return (
    <div>
      <Eyebrow>Presentation materials</Eyebrow>
      <h1 className="text-[clamp(2.2rem,1.6rem+2vw,4rem)] leading-[0.93] tracking-[-0.055em] font-bold text-ink dark:text-paper max-w-[22ch]">
        {data.presentation.title}
      </h1>
      <p className="mt-4 text-sm text-ink/60 dark:text-paper/60">
        Your access is valid until {formatDateTime(data.expires_at)}.
      </p>

      <div className="mt-10">
        {data.files.length === 0 ? (
          <div className={`${cardClass} p-8 text-ink/70 dark:text-paper/70`}>
            No materials have been added yet. Please check back later.
          </div>
        ) : (
          <ul className="grid gap-3">
            {data.files.map((file) => (
              <li key={file.id} className={`${cardClass} flex items-center gap-4 p-4 sm:p-5`}>
                <FileBadge name={file.name} />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-ink dark:text-paper truncate" title={file.name}>
                    {file.name}
                  </p>
                  <p className="mt-1 text-sm text-ink/55 dark:text-paper/55">{formatBytes(file.size)}</p>
                </div>
                <a
                  href={downloadUrl(file.id)}
                  className={`${primaryButtonClass} h-11 px-4 sm:px-5 text-sm shrink-0`}
                  aria-label={`Download ${file.name}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-5-5m5 5l5-5M5 20h14" />
                  </svg>
                  <span className="hidden sm:inline">Download</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function PresentationPage() {
  const [status, setStatus] = useState("loading");
  const [data, setData] = useState(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("expired")) {
      setNotice("Your access has expired or that file is no longer available. Please enter a valid password.");
      window.history.replaceState(null, "", window.location.pathname);
    }

    api("viewer.php?action=session")
      .then((result) => {
        if (result.authenticated) {
          setData(result);
          setStatus("open");
        } else {
          setStatus("locked");
        }
      })
      .catch(() => setStatus("locked"));
  }, []);

  const handleLogin = (result) => {
    setNotice("");
    setData(result);
    setStatus("open");
  };

  const handleLogout = async () => {
    try {
      await api("viewer.php?action=logout", { method: "POST" });
    } finally {
      setData(null);
      setStatus("locked");
    }
  };

  return (
    <PageShell
      actions={
        status === "open" && (
          <button type="button" onClick={handleLogout} className={secondaryButtonClass}>
            Log out
          </button>
        )
      }
    >
      {status === "loading" && <p className="text-ink/60 dark:text-paper/60">Loading…</p>}
      {status === "locked" && <LoginForm onLogin={handleLogin} notice={notice} />}
      {status === "open" && data && <Materials data={data} />}
    </PageShell>
  );
}
