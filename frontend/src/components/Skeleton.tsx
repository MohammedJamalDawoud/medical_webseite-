interface SkeletonProps {
    className?: string;
    width?: string | number;
    height?: string | number;
    variant?: 'text' | 'circular' | 'rectangular';
}

const Skeleton = ({ className = '', width, height, variant = 'rectangular' }: SkeletonProps) => {
    const baseClasses = "animate-pulse bg-gray-200 rounded";
    const variantClasses = {
        text: "h-4 w-full",
        circular: "rounded-full",
        rectangular: "h-full w-full",
    };

    const style = {
        width: width,
        height: height,
    };

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={style}
            aria-hidden="true"
        />
    );
};

export default Skeleton;
