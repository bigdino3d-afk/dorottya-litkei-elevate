import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Check } from "lucide-react";
import { submitWorkshopInquiry } from "@/lib/workshops.functions";
import type { UIStrings } from "@/lib/workshop-i18n";

type Values = {
  studioName: string;
  contactName: string;
  email: string;
  phone: string;
  workshopType: "" | "acrobatic" | "spinning" | "both" | "unsure";
  participants: string;
  preferredDates: string;
  message: string;
  website: string;
};

const EMPTY: Values = { studioName: "", contactName: "", email: "", phone: "", workshopType: "", participants: "", preferredDates: "", message: "", website: "" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function InquiryForm({
  t,
  pageSlug,
  preset,
  disabled,
  workshopNames,
}: {
  t: UIStrings;
  pageSlug: string;
  preset?: { type: Values["workshopType"]; n: number };
  disabled?: boolean;
  workshopNames: { acrobatic: string; spinning: string };
}) {
  const submit = useServerFn(submitWorkshopInquiry);
  const [v, setV] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);

  useEffect(() => {
    if (preset?.type) setV((cur) => ({ ...cur, workshopType: preset.type }));
  }, [preset?.type, preset?.n]);

  function set<K extends keyof Values>(k: K, val: Values[K]) {
    setV((cur) => ({ ...cur, [k]: val }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  }

  function validate() {
    const e: Partial<Record<keyof Values, string>> = {};
    if (v.studioName.trim().length < 2) e.studioName = t.required;
    if (v.contactName.trim().length < 2) e.contactName = t.required;
    if (!v.email.trim()) e.email = t.required;
    else if (!EMAIL_RE.test(v.email.trim())) e.email = t.invalidEmail;
    if (!v.workshopType) e.workshopType = t.required;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setFailure(null);
    if (!validate() || disabled) return;
    setBusy(true);
    try {
      const res = await submit({ data: { ...v, workshopType: v.workshopType as Exclude<Values["workshopType"], "">, pageSlug } });
      if (!res?.ok) throw new Error("Not sent");
      setSentTo(v.email.trim());
      setV(EMPTY);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      setFailure(msg && !msg.startsWith("[") && msg.length < 200 ? msg : "Your inquiry could not be sent. Please try again or email us directly.");
    } finally {
      setBusy(false);
    }
  }

  if (sentTo) {
    return (
      <div role="status" className="border border-gold/50 bg-background p-8 md:p-10">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-gold text-ink"><Check className="h-5 w-5" /></span>
        <h3 className="mt-6 font-serif text-3xl">{t.successTitle}</h3>
        <p className="mt-3 text-muted-foreground">{t.successBody} <span className="text-foreground">{sentTo}</span>.</p>
        <button type="button" onClick={() => setSentTo(null)} className="mt-8 eyebrow text-gold hover:underline">{t.sendAnother}</button>
      </div>
    );
  }

  const input = "mt-2 w-full bg-transparent border-b border-border py-3 focus:border-gold outline-none";
  const err = (k: keyof Values) =>
    errors[k] ? <p id={`${k}-err`} className="mt-2 text-xs text-destructive">{errors[k]}</p> : null;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-7" aria-label="Workshop hosting inquiry">
      <div className="grid gap-7 md:grid-cols-2">
        <label className="block">
          <span className="eyebrow">{t.studioName} *</span>
          <input value={v.studioName} onChange={(e) => set("studioName", e.target.value)} className={input} autoComplete="organization" aria-invalid={!!errors.studioName} aria-describedby={errors.studioName ? "studioName-err" : undefined} />
          {err("studioName")}
        </label>
        <label className="block">
          <span className="eyebrow">{t.contactName} *</span>
          <input value={v.contactName} onChange={(e) => set("contactName", e.target.value)} className={input} autoComplete="name" aria-invalid={!!errors.contactName} aria-describedby={errors.contactName ? "contactName-err" : undefined} />
          {err("contactName")}
        </label>
        <label className="block">
          <span className="eyebrow">{t.email} *</span>
          <input type="email" value={v.email} onChange={(e) => set("email", e.target.value)} className={input} autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-err" : undefined} />
          {err("email")}
        </label>
        <label className="block">
          <span className="eyebrow">{t.phone}</span>
          <input type="tel" value={v.phone} onChange={(e) => set("phone", e.target.value)} className={input} autoComplete="tel" />
        </label>
        <label className="block">
          <span className="eyebrow">{t.workshopType} *</span>
          <select value={v.workshopType} onChange={(e) => set("workshopType", e.target.value as Values["workshopType"])} className={input} aria-invalid={!!errors.workshopType} aria-describedby={errors.workshopType ? "workshopType-err" : undefined}>
            <option value="">{t.choose}</option>
            <option value="acrobatic">{workshopNames.acrobatic}</option>
            <option value="spinning">{workshopNames.spinning}</option>
            <option value="both">{t.typeBoth}</option>
            <option value="unsure">{t.typeUnsure}</option>
          </select>
          {err("workshopType")}
        </label>
        <label className="block">
          <span className="eyebrow">{t.participants}</span>
          <input value={v.participants} onChange={(e) => set("participants", e.target.value)} className={input} inputMode="numeric" />
        </label>
      </div>
      <label className="block">
        <span className="eyebrow">{t.preferredDates}</span>
        <input value={v.preferredDates} onChange={(e) => set("preferredDates", e.target.value)} className={input} />
      </label>
      <label className="block">
        <span className="eyebrow">{t.questions}</span>
        <textarea value={v.message} onChange={(e) => set("message", e.target.value)} rows={4} className="mt-2 w-full bg-transparent border border-border p-4 focus:border-gold outline-none resize-y" />
      </label>
      <input type="text" tabIndex={-1} autoComplete="off" value={v.website} onChange={(e) => set("website", e.target.value)} className="hidden" aria-hidden="true" />
      {failure && <p role="alert" className="text-sm text-destructive">{failure}</p>}
      <button type="submit" disabled={busy || disabled} className="btn-luxe btn-luxe-hover disabled:opacity-50">
        {busy ? t.sending : t.submit}
      </button>
      {disabled && <p className="text-xs text-muted-foreground">Preview mode — the form is disabled.</p>}
    </form>
  );
}
