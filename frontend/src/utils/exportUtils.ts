/**
 * Export utilities for frontend data export functionality
 */

/**
 * Download data as CSV file
 */
export const downloadCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) {
        console.warn('No data to export');
        return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row =>
            headers.map(header => {
                const value = row[header];
                // Escape values containing commas or quotes
                if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            }).join(',')
        )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

/**
 * Download data as JSON file
 */
export const downloadJSON = (data: any, filename: string) => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

/**
 * Generate Markdown table from data
 */
export const generateMarkdownTable = (data: any[]): string => {
    if (!data || data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const headerRow = `| ${headers.join(' | ')} |`;
    const separatorRow = `| ${headers.map(() => '---').join(' | ')} |`;
    const dataRows = data.map(row =>
        `| ${headers.map(header => row[header] || '').join(' | ')} |`
    ).join('\n');

    return `${headerRow}\n${separatorRow}\n${dataRows}`;
};

/**
 * Generate LaTeX table from data
 */
export const generateLatexTable = (data: any[]): string => {
    if (!data || data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const columnSpec = headers.map(() => 'l').join('');

    const headerRow = headers.join(' & ') + ' \\\\';
    const dataRows = data.map(row =>
        headers.map(header => String(row[header] || '').replace(/[&%$#_{}]/g, '\\$&')).join(' & ') + ' \\\\'
    ).join('\n');

    return `\\begin{tabular}{${columnSpec}}
\\hline
${headerRow}
\\hline
${dataRows}
\\hline
\\end{tabular}`;
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            const success = document.execCommand('copy');
            document.body.removeChild(textArea);
            return success;
        }
    } catch (err) {
        console.error('Failed to copy to clipboard:', err);
        return false;
    }
};

/**
 * Format data for export (convert dates, handle nulls, etc.)
 */
export const formatDataForExport = (data: any[]): any[] => {
    return data.map(item => {
        const formatted: any = {};
        Object.keys(item).forEach(key => {
            const value = item[key];
            if (value instanceof Date) {
                formatted[key] = value.toISOString();
            } else if (value === null || value === undefined) {
                formatted[key] = '';
            } else if (typeof value === 'object') {
                formatted[key] = JSON.stringify(value);
            } else {
                formatted[key] = value;
            }
        });
        return formatted;
    });
};
