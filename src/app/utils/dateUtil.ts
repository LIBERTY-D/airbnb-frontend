export function parseDateRange( range: string): { start: string; end: string } {
  if (range &&!range.includes('to'))'';
   
  const [start, end] = range?range.split('to').map((date) => date.trim()):['',''];

  return { start, end };
}
