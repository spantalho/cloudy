export function formateDateDay(
  dateInput: string | number,
  options?: { lang?: string, short?: boolean, timezone?: string }
) {
  const { short = false, lang = "en", timezone } = options || {};

  // fallback when Intl/timeZone is not used
  const weekDays = short
    ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    : [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];


  function buildDate(input: string | number) {
    if (typeof input === "number") {
      return new Date(input * 1000);
    }

    if (typeof input === "string") {
      const isoDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(input);
      if (isoDateOnly) {
        const [y, m, d] = input.split("-").map((v) => Number(v));
        return new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
      }

      return new Date(input);
    }

    return new Date(input as any);
  }

  const dt = buildDate(dateInput);

  if (timezone && typeof timezone === "string") {
    try {
      const formatted = new Intl.DateTimeFormat(lang, {
        weekday: short ? "short" : "long",
        timeZone: timezone,
      }).format(dt);
      return formatted;
    } catch (e) {
    }
  }

  return weekDays[dt.getDay()];
}
export function formatDate(dateInput: string | number, options?: { lang?: string, timezone: string }) {
  const { lang = "en", timezone } = options || {};
  function buildDate(input: string | number) {
    if (typeof input === "number") {
      return new Date(input * 1000);
    }

    if (typeof input === "string") {
      const isoDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(input);
      if (isoDateOnly) {
        const [y, m, d] = input.split("-").map((v) => Number(v));
        return new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
      }
      return new Date(input);
    }

    return new Date(input as any);
  }

  const dt = buildDate(dateInput);

  if (timezone && typeof timezone === "string") {
    try {
      const parts = new Intl.DateTimeFormat(lang, {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: timezone,
      }).formatToParts(dt);

      const m: Record<string, string> = {};
      for (const p of parts) {
        if (p.type !== "literal") m[p.type] = p.value;
      }

      const day = m.day ?? "00";
      const month = m.month ?? "00";
      const year = (m.year ?? "00").slice(-2);
      const hours = m.hour ?? "00";
      const minutes = m.minute ?? "00";

      const datePart = lang && lang.startsWith("pt") ? `${day}/${month}/${year}` : `${month}/${day}/${year}`;

      return `${datePart} ${hours}:${minutes}`;
    } catch (e) {
    }
  }

  // fallback: local machine timezone
  const date = dt;

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2);

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  const datePart = lang === "pt" ? `${day}/${month}/${year}` : `${month}/${day}/${year}`;

  return `${datePart} ${hours}:${minutes}`;
}
