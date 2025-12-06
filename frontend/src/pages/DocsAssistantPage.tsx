import { useState } from 'react';
import { Sparkles, FileText, Loader, AlertCircle } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

interface DocChunk {
    text: string;
    filename: string;
    heading: string;
    line_start: number;
    line_end: number;
    score: number;
}

interface AskDocsResponse {
    answer: string | null;
    chunks: DocChunk[];
    note?: string;
}

export default function DocsAssistantPage() {
    const [question, setQuestion] = useState('');
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<AskDocsResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!question.trim()) {
            toast.error('Please enter a question');
            return;
        }

        setLoading(true);
        setError(null);
        setResponse(null);

        try {
            const res = await api.post('/ai/ask-docs/', { question });
            setResponse(res.data);
        } catch (err: any) {
            console.error('Failed to ask question:', err);
            const errorMsg = err.response?.data?.error || 'Failed to process question';
            const note = err.response?.data?.note;
            setError(note ? `${errorMsg}\n${note}` : errorMsg);
            toast.error('Failed to get answer');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                        <Sparkles className="text-blue-400" />
                        Documentation Assistant
                    </h1>
                    <p className="text-gray-400">
                        Ask questions about the project documentation
                    </p>

                    {/* Disclaimer */}
                    <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                        <p className="text-sm text-yellow-200 flex items-start gap-2">
                            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                            <span>
                                <strong>Research Tool Only:</strong> This assistant is for documentation and research workflow support.
                                NOT for clinical diagnosis or patient treatment decisions.
                            </span>
                        </p>
                    </div>
                </div>

                {/* Question Form */}
                <form onSubmit={handleSubmit} className="mb-8">
                    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                        <label htmlFor="question" className="block text-sm font-medium text-gray-300 mb-2">
                            Ask a question about the documentation:
                        </label>
                        <textarea
                            id="question"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="e.g., How does the GMM preprocessing work?"
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader className="animate-spin" size={18} />
                                    Searching...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={18} />
                                    Ask Question
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Error Display */}
                {error && (
                    <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <p className="text-red-200 whitespace-pre-line">{error}</p>
                    </div>
                )}

                {/* Response Display */}
                {response && (
                    <div className="space-y-4">
                        {/* Note if no LLM */}
                        {response.note && (
                            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                <p className="text-sm text-blue-200">{response.note}</p>
                            </div>
                        )}

                        {/* Answer (if available) */}
                        {response.answer && (
                            <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
                                <h3 className="text-lg font-semibold mb-3 text-blue-400">Answer</h3>
                                <p className="text-gray-200 leading-relaxed">{response.answer}</p>
                            </div>
                        )}

                        {/* Relevant Snippets */}
                        {response.chunks && response.chunks.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-gray-300">
                                    Relevant Documentation ({response.chunks.length} snippets)
                                </h3>
                                <div className="space-y-4">
                                    {response.chunks.map((chunk, index) => (
                                        <div
                                            key={index}
                                            className="p-5 bg-gray-800 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors"
                                        >
                                            {/* Source Info */}
                                            <div className="flex items-center gap-2 mb-3 text-sm">
                                                <FileText size={16} className="text-gray-400" />
                                                <span className="text-blue-400 font-medium">{chunk.filename}</span>
                                                <span className="text-gray-500">›</span>
                                                <span className="text-gray-400">{chunk.heading}</span>
                                                <span className="text-gray-500 ml-auto">
                                                    Lines {chunk.line_start}-{chunk.line_end}
                                                </span>
                                            </div>

                                            {/* Score Badge */}
                                            <div className="mb-3">
                                                <span className="inline-block px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded">
                                                    Relevance: {(chunk.score * 100).toFixed(1)}%
                                                </span>
                                            </div>

                                            {/* Chunk Text */}
                                            <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap bg-gray-900 p-4 rounded border border-gray-700">
                                                {chunk.text}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* No results */}
                        {response.chunks && response.chunks.length === 0 && (
                            <div className="p-6 bg-gray-800 rounded-xl border border-gray-700 text-center">
                                <p className="text-gray-400">No relevant documentation found for your question.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
