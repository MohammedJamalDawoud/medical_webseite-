import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    addToast: (message: string, type: ToastType) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            removeToast(id);
        }, 5000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <div className="fixed bottom-8 left-8 z-50 flex flex-col gap-2">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`flex items-center p-4 rounded-lg shadow-lg text-white min-w-[300px] animate-fade-in-up transition-all duration-300 ${toast.type === 'success' ? 'bg-green-600' :
                            toast.type === 'error' ? 'bg-red-600' :
                                toast.type === 'warning' ? 'bg-yellow-600' :
                                    'bg-blue-600'
                            }`}
                        role="alert"
                    >
                        <div className="mr-3">
                            {toast.type === 'success' && <CheckCircle className="h-5 w-5" />}
                            {toast.type === 'error' && <AlertCircle className="h-5 w-5" />}
                            {toast.type === 'warning' && <AlertTriangle className="h-5 w-5" />}
                            {toast.type === 'info' && <Info className="h-5 w-5" />}
                        </div>
                        <div className="flex-grow font-medium">{toast.message}</div>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="ml-4 text-white hover:text-gray-200 focus:outline-none"
                            aria-label="Close"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
