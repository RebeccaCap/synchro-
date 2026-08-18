import { useState } from "react";

export default function CTA() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    title: "",
    company: "",
    email: "",
    phone: "",
    dietary: "",
    attendance: "yes",
    privacy_policy: false,
    share_contact_details: false,
    dietary_consent: false,
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

  const handleCheckboxChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.checked,
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
          <div className="border border-ink/10 dark:border-white/10 bg-white/60 dark:bg-white/[0.06] p-12 text-center">
            <div className="w-14 h-14 mx-auto flex items-center justify-center border-2 border-ink dark:border-paper rounded-full text-ink dark:text-paper text-xl">
              ✓
            </div>

            <h2 className="mt-6 text-4xl font-bold tracking-tight text-ink dark:text-paper">
              You're confirmed
            </h2>

            <p className="mt-4 text-ink/70 dark:text-paper/70 max-w-lg mx-auto">
             You can expect to receive a calendar invitation within 2 days.
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
          <div className="border border-ink/10 dark:border-white/10 bg-white/60 dark:bg-white/[0.06] p-12 text-center">
            <h2 className="text-4xl font-bold tracking-tight text-ink dark:text-paper">
              Thank you for letting us know
            </h2>

            <p className="mt-4 text-ink/70 dark:text-paper/70">
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
          border-ink/10
          dark:border-white/10
          bg-white/60
          dark:bg-white/[0.06]
          overflow-hidden
        "
      >
        <div className="absolute right-[-10%] bottom-[-20%] w-[320px] h-[320px] rounded-full bg-[radial-gradient(circle,rgba(218,65,15,.20),transparent_70%)] dark:bg-[radial-gradient(circle,rgba(225,103,49,.20),transparent_70%)]" />

        <div className="grid md:grid-cols-[1fr_1fr] gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span
                className="w-[14px] h-[14px] bg-orangeLight dark:bg-orangeDark"
                style={{
                  clipPath:
                    "polygon(14% 0, 100% 0, 86% 100%, 0 100%)",
                }}
              />

              <span className="uppercase text-xs tracking-[0.2em] text-ink/60 dark:text-paper/60">
                Join the forum
              </span>
            </div>

            <h2
              className="
                text-[clamp(2.2rem,1.7rem+2.8vw,4.8rem)]
                leading-[0.93]
                tracking-[-0.065em]
                font-bold
                max-w-[10ch]
                text-ink
                dark:text-paper
              "
            >
              15 October, 2026
            </h2>

            <p className="mt-4 text-ink/70 dark:text-paper/70 max-w-md leading-relaxed">
              The forum will meet in Paris, France. Full venue details to
              follow.
            </p>

            <p className="mt-8 text-ink/70 dark:text-paper/70">
              Questions?{" "}
              <a
                href="mailto:info@synchroforum.eu"
                className="text-orangeLight dark:text-orangeDark hover:underline"
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
                className="
                  h-14
                  px-4
                  bg-white
                  dark:bg-black/20
                  border
                  border-ink/10
                  dark:border-white/10
                  text-ink
                  dark:text-paper
                  placeholder:text-ink/40
                  dark:placeholder:text-paper/40
                "
              />

              <input
                name="last_name"
                placeholder="Last name"
                required
                value={form.last_name}
                onChange={handleChange}
                className="
                  h-14
                  px-4
                  bg-white
                  dark:bg-black/20
                  border
                  border-ink/10
                  dark:border-white/10
                  text-ink
                  dark:text-paper
                  placeholder:text-ink/40
                  dark:placeholder:text-paper/40
                "
              />
            </div>
            <input
            name="title"
            placeholder="Job title"
            required
            value={form.title}
            onChange={handleChange}
            className="
              h-14
              px-4
              bg-white
              dark:bg-black/20
              border
              border-ink/10
              dark:border-white/10
              text-ink
              dark:text-paper
              placeholder:text-ink/40
              dark:placeholder:text-paper/40
            "
          />

            <input
              name="company"
              placeholder="Company"
              required
              value={form.company}
              onChange={handleChange}
              className="
                h-14
                px-4
                bg-white
                dark:bg-black/20
                border
                border-ink/10
                dark:border-white/10
                text-ink
                dark:text-paper
                placeholder:text-ink/40
                dark:placeholder:text-paper/40
              "
            />

            <input
              type="email"
              name="email"
              placeholder="Work email"
              required
              value={form.email}
              onChange={handleChange}
              className="
                h-14
                px-4
                bg-white
                dark:bg-black/20
                border
                border-ink/10
                dark:border-white/10
                text-ink
                dark:text-paper
                placeholder:text-ink/40
                dark:placeholder:text-paper/40
              "
            />
            <input
            type="tel"
            name="phone"
            required
            placeholder="Phone number (e.g. +46 70 123 45 67)"
            value={form.phone}
            onChange={handleChange}
            className="
              h-14
              px-4
              bg-white
              dark:bg-black/20
              border
              border-ink/10
              dark:border-white/10
              text-ink
              dark:text-paper
              placeholder:text-ink/40
              dark:placeholder:text-paper/40
            "
          />
          <textarea
            name="dietary"
            placeholder="Dietary requirements (optional)"
            value={form.dietary}
            onChange={handleChange}
            rows={3}
            className="
              px-4
              py-3
              bg-white
              dark:bg-black/20
              border
              border-ink/10
              dark:border-white/10
              text-ink
              dark:text-paper
              placeholder:text-ink/40
              dark:placeholder:text-paper/40
              resize-none
            "
          />

            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-ink/80 dark:text-paper/80">
                <input
                  type="radio"
                  name="attendance"
                  value="yes"
                  checked={form.attendance === "yes"}
                  onChange={handleChange}
                />
                Yes, I'll be there
              </label>

              <label className="flex items-center gap-2 text-ink/80 dark:text-paper/80">
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
                        
            <div className="flex items-start gap-2 text-sm text-ink/80 dark:text-paper/80">
              <input
                type="checkbox"
                name="privacy_policy"
                checked={form.privacy_policy}
                onChange={handleCheckboxChange}
                required
                className="mt-1 cursor-pointer"
              />

              <label htmlFor="privacy_policy">
                I have read the{" "}
                <a
                  href="/privacy-policy.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    text-orangeLight
                    dark:text-orangeDark
                    font-medium
                    border-b
                    border-orangeLight/50
                    dark:border-orangeDark/50
                    hover:border-orangeLight
                    dark:hover:border-orangeDark
                    transition-all
                  "
                >
                  Privacy Notice
                </a>
              </label>
            </div>

            <div className="flex items-start gap-2 text-sm text-ink/80 dark:text-paper/80">
            <input
              type="checkbox"
              name="share_contact_details"
              checked={form.share_contact_details}
              onChange={handleCheckboxChange}
              className="mt-1 cursor-pointer"
            />

              <label>
                I consent to my contact details being shared with other forum members
                for networking and follow-up purposes.
              </label>
            </div>

            <div className="flex items-start gap-2 text-sm text-ink/80 dark:text-paper/80">
              <input
                type="checkbox"
                name="dietary_consent"
                checked={form.dietary_consent}
                onChange={handleCheckboxChange}
                className="mt-1 cursor-pointer"
              />

              <label>
                I consent to the processing of my dietary requirements for catering
                purposes.
              </label>
            </div>

            <p className="italic text-xs text-ink/60 dark:text-paper/60">
              You may withdraw your consent at any time. For more information about how
              we process your personal data and your rights, please see our{" "}
              <a
                href="/privacy-policy.html"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-orangeLight dark:hover:text-orangeDark"
              >
                Privacy Notice
              </a>.
            </p>
            
            {error && (
              <p className="text-red-500 text-sm">
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
                  bg-orangeLight
                  dark:bg-orangeDark
                  text-white
                  font-medium
                  text-lg
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-[0_16px_50px_rgba(225,103,49,0.35)]
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