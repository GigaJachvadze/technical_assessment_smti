export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();

  const diffInSeconds = Math.floor(
    (now.getTime() - date.getTime()) / 1000
  );

  const rtf = new Intl.RelativeTimeFormat("en", {
    numeric: "auto",
  });

  const divisions = [
    { amount: 60, name: "second" },
    { amount: 60, name: "minute" },
    { amount: 24, name: "hour" },
    { amount: 7, name: "day" },
    { amount: 4.34524, name: "week" },
    { amount: 12, name: "month" },
    { amount: Infinity, name: "year" },
  ] as const;

  let duration = diffInSeconds;

  for (const division of divisions) {
    if (Math.abs(duration) < division.amount) {
      return rtf.format(
        Math.round(-duration),
        division.name
      );
    }
    duration /= division.amount;
  }

  return "";
}
