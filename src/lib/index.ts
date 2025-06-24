// place files you want to import through the `$lib` alias in this folder.
/**
 * 
 * @param date - The date to format, if null or undefined, current date is used
 * @example formatDate(new Date()) // "Sep 30, 2023, 17:34"
 * @returns Formatted date string in "MMM DD, YYYY, HH:mm" format
 */
export function formatDate(date: Date | string | null | undefined): string {
    if (typeof date === 'string') {
        date = new Date(date);
    } else if (!(date instanceof Date)) {
        date = new Date();
    }
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }).replace(',', '');
}