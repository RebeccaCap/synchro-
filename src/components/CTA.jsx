import { useState } from "react";

export default function CTA() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    company: "",
    email: "",
    attendance: "yes",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [declined, setDeclined] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const body = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        body.append(key, value);
      });

      const response = await fetch(
        "https://synchroforum.eu/rsvp.php",
        {
          method: "POST",
          body,
        }
      );

      const data = await response.json();

      if (!data.success) {
        setError(data.message || "Something went wrong.");
        setLoading(false);
        return;
      }

      if (form.attendance === "yes") {
        setSuccess(true);

        const link = document.createElement("a");
        link.href =
          "https://synchroforum.eu/synchro-october-2026.ics";
        link.download = "synchro-october-2026.ics";
        link.click();
      } else {
        setDeclined(true);
      }
    } catch (err) {
      setError(
        "Unable to submit RSVP. Please contact info@synchroforum.eu."
      );
    }

    setLoading(false);
  };

  if (success) {
    return (
      <section id="register" className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="border border-white/10 bg-white/[0.06] p-12 text-center">
            <div className="w-14 h-14 mx-auto flex items-center justify-center border-2 border-green-500 rounded-full text-green-500 text-xl">
              ✓
            </div>

            <h2 className="mt-6 text-4xl font-bold tracking-tight">
              You're confirmed
            </h2>

            <p className="mt-4 text-white/70 max-w-lg mx-auto">
              Thank you. We look forward to welcoming you to
              SYNCHRO on October 15, 2026.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (declined) {
    return (
      <section id="register" className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="border border-white/10 bg-white/[0.06] p-12 text-center">
            <h2 className="text-4xl font-bold tracking-tight">
              Thank you for letting us know
            </h2>

            <p className="mt-4 text-white/70">
              We're sorry you can't join us this time.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="register" className="py-17">
      <div
        className="
          relative
          max-w-6xl
          mx-auto
          px-6
          py-12
          border
          border-white/10
          bg-white/[0.06]
          overflow-hidden
        "
      >
        <div className="absolute right-[-10%] bottom-[-20%] w-[320px] h-[320px] rounded-full bg-[radial-gradient(circle,rgba(207,97,2,.20),transparent_70%)]" />

        <div className="grid md:grid-cols-[1fr_1fr] gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span
                className="w-[14px] h-[14px] bg-[#da410f]"
                style={{
                  clipPath:
                    "polygon(14% 0, 100% 0, 86% 100%, 0 100%)",
                }}
              />

              <span className="uppercase text-xs tracking-[0.2em] text-white/60">
                RSVP
              </span>
            </div>

            <h2
              className="
                text-[clamp(2.2rem,1.7rem+2.8vw,4.8rem)]
                leading-[0.93]
                tracking-[-0.065em]
                font-bold
                max-w-[10ch]
                text-[#fefaf5]
              "
            >
              15 October, 2026
            </h2>

            <p className="mt-4 text-white/70 max-w-md leading-relaxed">
              The forum will be held at Capgemini Offices in Paris,
              France. Full venue details to follow.
            </p>

            <p className="mt-8 text-[#fefaf5]/70">
              Questions?{" "}
              <a
                href="mailto:info@synchroforum.eu"
                className="text-[#da410f] hover:underline"
              >
                info@synchroforum.eu
              </a>
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <input
                name="first_name"
                placeholder="First name"
                required
                value={form.first_name}
                onChange={handleChange}
                className="h-14 px-4 bg-black/20 border border-white/10 text-white"
              />

              <input
                name="last_name"
                placeholder="Last name"
                required
                value={form.last_name}
                onChange={handleChange}
                className="h-14 px-4 bg-black/20 border border-white/10 text-white"
              />
            </div>

            <input
              name="company"
              placeholder="Organisation"
              required
              value={form.company}
              onChange={handleChange}
              className="h-14 px-4 bg-black/20 border border-white/10 text-white"
            />

            <input
              type="email"
              name="email"
              placeholder="Work email"
              required
              value={form.email}
              onChange={handleChange}
              className="h-14 px-4 bg-black/20 border border-white/10 text-white"
            />

            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-white/80">
                <input
                  type="radio"
                  name="attendance"
                  value="yes"
                  checked={form.attendance === "yes"}
                  onChange={handleChange}
                />
                Yes, I'll be there
              </label>

              <label className="flex items-center gap-2 text-white/80">
                <input
                  type="radio"
                  name="attendance"
                  value="no"
                  checked={form.attendance === "no"}
                  onChange={handleChange}
                />
                Unable to attend
              </label>
            </div>

            {error && (
              <p className="text-red-400 text-sm">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="
                h-[56px]
                px-8
                rounded-md
                bg-orange-600
                text-white
                font-medium
                text-lg
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-[0_16px_50px_rgba(207,97,2,0.35)]
              "
            >
              {loading
                ? "Submitting..."
                : "Confirm Attendance"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}