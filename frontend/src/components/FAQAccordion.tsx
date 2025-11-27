import { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQ {
    id: number;
    question: string;
    answer: string;
}

const FAQAccordion = () => {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [openId, setOpenId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFAQs = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/faqs/');
                setFaqs(response.data);
            } catch (error) {
                console.error('Error fetching FAQs:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchFAQs();
    }, []);

    const toggleFAQ = (id: number) => {
        setOpenId(openId === id ? null : id);
    };

    if (loading) {
        return <div className="text-center text-muted">Loading FAQs...</div>;
    }

    return (
        <div className="max-w-3xl mx-auto space-y-4">
            <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
            {faqs.map((faq) => (
                <div key={faq.id} className="glass-card p-0 overflow-hidden">
                    <button
                        className="w-full px-6 py-4 flex justify-between items-center text-left focus:outline-none"
                        onClick={() => toggleFAQ(faq.id)}
                    >
                        <span className="font-medium text-lg">{faq.question}</span>
                        {openId === faq.id ? (
                            <ChevronUp className="w-5 h-5 text-primary" />
                        ) : (
                            <ChevronDown className="w-5 h-5 text-muted" />
                        )}
                    </button>
                    <div
                        className={`px-6 transition-all duration-300 ease-in-out ${openId === faq.id ? 'max-h-96 py-4 opacity-100' : 'max-h-0 py-0 opacity-0'
                            }`}
                        style={{ borderTop: openId === faq.id ? '1px solid var(--border)' : 'none' }}
                    >
                        <p className="text-muted">{faq.answer}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FAQAccordion;
