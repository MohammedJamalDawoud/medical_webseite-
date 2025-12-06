import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: number;
        label: string;
        positive?: boolean;
    };
    color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, color = 'blue' }) => {
    const colorClasses = {
        blue: 'bg-blue-500/10 text-blue-500',
        green: 'bg-green-500/10 text-green-500',
        purple: 'bg-purple-500/10 text-purple-500',
        orange: 'bg-orange-500/10 text-orange-500',
        red: 'bg-red-500/10 text-red-500',
    };

    return (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
                <div className={`p-2 rounded-lg ${colorClasses[color as keyof typeof colorClasses] || colorClasses.blue}`}>
                    <Icon size={20} />
                </div>
            </div>

            <div className="flex items-end justify-between">
                <div>
                    <p className="text-2xl font-bold text-white">{value}</p>
                </div>

                {trend && (
                    <div className={`flex items-center text-sm ${trend.positive ? 'text-green-400' : 'text-red-400'}`}>
                        <span>{trend.positive ? '+' : ''}{trend.value}%</span>
                        <span className="ml-1 text-gray-500">{trend.label}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatCard;
