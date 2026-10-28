/**
 * Impact UI's conversation mapper reads `timeStamp` (not `timestamp`) and
 * parses it with moment as `DD-MM-YYYY HH:mm:ss`. ISO strings produce
 * "Invalid date" / NaN in the chip and clock.
 */
export function formatChatTimeStamp(date: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export function chatMessageTimeFields(date: Date = new Date()): {
  timeStamp: string;
  timestamp: string;
} {
  const timeStamp = formatChatTimeStamp(date);
  return { timeStamp, timestamp: timeStamp };
}
