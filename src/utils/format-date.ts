export function formateDateDay(
  dateISO: string,
  options?: { lang?: string; short?: boolean }
) {
  const { short = false, lang = "en" } = options || {};

  const weekDaysEN = short
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

  const weekDaysPT = short
    ? ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
    : [
        "Domingo",
        "Segunda-feira",
        "Terça-feira",
        "Quarta-feira",
        "Quinta-feira",
        "Sexta-feira",
        "Sábado",
      ];

  let weekDays;
  if (lang === "pt") {
    weekDays = weekDaysPT;
  } else {
    weekDays = weekDaysEN;
  }

  const dateObj = new Date(dateISO);
  return weekDays[dateObj.getDay()];
}

export function formatDate(dateISO: string, options?: { lang?: string }) {
  const date = new Date(dateISO);
  const { lang } = options || {};

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2);

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  const datePart =
    lang === "pt" ? `${day}/${month}/${year}` : `${month}/${day}/${year}`;

  return `${datePart} ${hours}:${minutes}`;
}
