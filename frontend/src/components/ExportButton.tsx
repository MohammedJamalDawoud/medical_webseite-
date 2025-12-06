import { Download, FileJson, FileText, Copy } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { downloadCSV, downloadJSON, generateMarkdownTable, generateLatexTable, copyToClipboard } from '../utils/exportUtils';

interface ExportButtonProps {
    data: any[];
    filename: string;
    label?: string;
}

export default function ExportButton({ data, filename, label = 'Export' }: ExportButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleExportCSV = () => {
        downloadCSV(data, `${filename}.csv`);
        toast.success('CSV file downloaded');
        setIsOpen(false);
    };

    const handleExportJSON = () => {
        downloadJSON(data, `${filename}.json`);
        toast.success('JSON file downloaded');
        setIsOpen(false);
    };

    const handleCopyMarkdown = async () => {
        const markdown = generateMarkdownTable(data);
        const success = await copyToClipboard(markdown);
        if (success) {
            toast.success('Markdown table copied to clipboard');
        } else {
            toast.error('Failed to copy to clipboard');
        }
        setIsOpen(false);
    };

    const handleCopyLatex = async () => {
        const latex = generateLatexTable(data);
        const success = await copyToClipboard(latex);
        if (success) {
            toast.success('LaTeX table copied to clipboard');
        } else {
            toast.error('Failed to copy to clipboard');
        }
        setIsOpen(false);
    };

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <button
                className="btn btn-secondary"
                onClick={() => setIsOpen(!isOpen)}
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
            >
                <Download size={16} />
                {label}
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        style={{
                            position: 'fixed',
                            inset: 0,
                            zIndex: 40
                        }}
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown Menu */}
                    <div
                        style={{
                            position: 'absolute',
                            right: 0,
                            marginTop: 'var(--space-2)',
                            width: '200px',
                            background: 'var(--bg-elevated)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-md)',
                            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
                            overflow: 'hidden',
                            zIndex: 50
                        }}
                    >
                        <button
                            onClick={handleExportCSV}
                            style={{
                                width: '100%',
                                padding: 'var(--space-3)',
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-main)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-2)',
                                fontSize: 'var(--text-sm)',
                                transition: 'background 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            <FileText size={16} />
                            Export as CSV
                        </button>

                        <button
                            onClick={handleExportJSON}
                            style={{
                                width: '100%',
                                padding: 'var(--space-3)',
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-main)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-2)',
                                fontSize: 'var(--text-sm)',
                                transition: 'background 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            <FileJson size={16} />
                            Export as JSON
                        </button>

                        <div style={{
                            height: '1px',
                            background: 'var(--border)',
                            margin: 'var(--space-2) 0'
                        }} />

                        <button
                            onClick={handleCopyMarkdown}
                            style={{
                                width: '100%',
                                padding: 'var(--space-3)',
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-main)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-2)',
                                fontSize: 'var(--text-sm)',
                                transition: 'background 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            <Copy size={16} />
                            Copy as Markdown
                        </button>

                        <button
                            onClick={handleCopyLatex}
                            style={{
                                width: '100%',
                                padding: 'var(--space-3)',
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-main)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-2)',
                                fontSize: 'var(--text-sm)',
                                transition: 'background 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            <Copy size={16} />
                            Copy as LaTeX
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
