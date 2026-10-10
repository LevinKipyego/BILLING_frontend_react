export const toLocalISO = (isoStr: string) => {
  if (!isoStr) return "";
  const date = new Date(isoStr);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset();
  const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
  return adjustedDate.toISOString().substring(0, 16);
};

export const formatDateTime = (dateStr: string) => {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return { date: "—", time: "—" };

  return {
    date: d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
};
