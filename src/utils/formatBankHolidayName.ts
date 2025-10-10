export default function formatBankHolidayName(id: string) {
  return id
    .replaceAll('-', ' ')
    .split(' ')
    .map((word) => word[0].toUpperCase().concat(word.slice(1)))
    .join(' ');
}
