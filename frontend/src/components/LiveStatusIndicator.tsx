import { Activity, CheckCircle, XCircle, Clock, Loader } from 'lucide-react';

interface LiveStatusIndicatorProps {
    status: 'queued' | 'running' | 'completed' | 'failed';
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
}

export default function LiveStatusIndicator({ status, size = 'md', showLabel = true }: LiveStatusIndicatorProps) {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
    };

    const iconSize = sizeClasses[size];

    const statusConfig = {
        queued: {
            icon: <Clock className={iconSize} />,
            label: 'Queued',
            color: 'text-gray-400',
            bgColor: 'bg-gray-400/10',
            borderColor: 'border-gray-400/20',
        },
        running: {
            icon: <Loader className={`${iconSize} animate-spin`} />,
            label: 'Running',
            color: 'text-blue-400',
            bgColor: 'bg-blue-400/10',
            borderColor: 'border-blue-400/20',
        },
        completed: {
            icon: <CheckCircle className={iconSize} />,
            label: 'Completed',
            color: 'text-green-400',
            bgColor: 'bg-green-400/10',
            borderColor: 'border-green-400/20',
        },
        failed: {
            icon: <XCircle className={iconSize} />,
            label: 'Failed',
            color: 'text-red-400',
            bgColor: 'bg-red-400/10',
            borderColor: 'border-red-400/20',
        },
    };

    const config = statusConfig[status];

    return (
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.bgColor} ${config.borderColor}`}>
            <span className={config.color}>
                {config.icon}
            </span>
            {showLabel && (
                <span className={`text-sm font-medium ${config.color}`}>
                    {config.label}
                </span>
            )}
            {status === 'running' && (
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400"></span>
                </span>
            )}
        </div>
    );
}
