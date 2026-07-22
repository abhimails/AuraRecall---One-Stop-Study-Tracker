/**
 * Utility functions for date formatting, ISO conversion, and day offsets
 */

export function getTodayISOString(simulatedDate?: string): string {
  if (simulatedDate) return simulatedDate;
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function addDaysToDate(dateStr: string, days: number): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatDateFriendly(dateStr: string, todayStr?: string): string {
  if (!dateStr) return '';
  const currentToday = todayStr || getTodayISOString();
  if (dateStr === currentToday) return 'Today';
  
  const tomorrow = addDaysToDate(currentToday, 1);
  if (dateStr === tomorrow) return 'Tomorrow';
  
  const yesterday = addDaysToDate(currentToday, -1);
  if (dateStr === yesterday) return 'Yesterday';

  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: year !== new Date().getFullYear() ? 'numeric' : undefined
  });
}

export function getDaysDifference(dateStr1: string, dateStr2: string): number {
  const [y1, m1, d1] = dateStr1.split('-').map(Number);
  const [y2, m2, d2] = dateStr2.split('-').map(Number);
  
  const date1 = new Date(y1, m1 - 1, d1);
  const date2 = new Date(y2, m2 - 1, d2);
  
  const diffTime = date1.getTime() - date2.getTime();
  return Math.round(diffTime / (1000 * 3600 * 24));
}
