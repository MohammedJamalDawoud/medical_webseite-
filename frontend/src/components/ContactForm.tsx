import { useState } from 'react';
import axios from 'axios';
import { Send } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const ContactForm = () => {
    const { addToast } = useToast();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await axios.post('http://localhost:8000/api/contact/', formData);
            addToast('Message sent successfully!', 'success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            addToast('Failed to send message. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="glass-card max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">Contact Us</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-muted mb-1">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 rounded bg-surface border border-border focus:border-primary outline-none transition-colors text-main"
                        style={{ backgroundColor: 'var(--surface-light)', color: 'var(--text-main)', border: '1px solid var(--border)' }}
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-muted mb-1">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 rounded bg-surface border border-border focus:border-primary outline-none transition-colors text-main"
                        style={{ backgroundColor: 'var(--surface-light)', color: 'var(--text-main)', border: '1px solid var(--border)' }}
                    />
                </div>
                <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-muted mb-1">Subject</label>
                    <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 rounded bg-surface border border-border focus:border-primary outline-none transition-colors text-main"
                        style={{ backgroundColor: 'var(--surface-light)', color: 'var(--text-main)', border: '1px solid var(--border)' }}
                    />
                </div>
                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-muted mb-1">Message</label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={4}
                        className="w-full px-4 py-2 rounded bg-surface border border-border focus:border-primary outline-none transition-colors text-main"
                        style={{ backgroundColor: 'var(--surface-light)', color: 'var(--text-main)', border: '1px solid var(--border)' }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary w-full mt-2"
                >
                    {isSubmitting ? (
                        'Sending...'
                    ) : (
                        <>
                            <Send className="w-4 h-4 mr-2" /> Send Message
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default ContactForm;
