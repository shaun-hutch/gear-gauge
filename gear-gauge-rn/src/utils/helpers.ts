const MILLISECONDS_PER_DAY = 86_400_000;
const RELATIVE_DATE_DAYS = 6;

/**
 * Formats a date string based on the current date
 * @param date The date to format
 * @returns The formatted date string
 */
export const formatDateString = (date: string): string => {
  if (!date) {
    return '';
  }

  const parsedDate = new Date(date);
  const now = new Date();

  const dayDiff = Math.round(
    (startOfDay(now) - startOfDay(parsedDate)) / MILLISECONDS_PER_DAY
  );

  // within the last week, return a relative string
  if (dayDiff >= 0 && dayDiff <= RELATIVE_DATE_DAYS) {
    return dayDiff === 0
      ? 'Today'
      : dayDiff === 1
        ? '1 day ago'
        : `${dayDiff} days ago`;
  }

  // else return the date in "MMM DD, YYYY" format, using the device locale
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(parsedDate);
}

// Compare calendar days (ignoring time of day)
const startOfDay = (d: Date): number =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();