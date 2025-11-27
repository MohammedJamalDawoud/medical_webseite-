import { Loader } from 'lucide-react';

const LoadingSpinner = () => {
    return (
        <div className="flex justify-center items-center h-64">
            <Loader className="h-8 w-8 text-primary animate-spin" />
        </div>
    );
};

export default LoadingSpinner;
