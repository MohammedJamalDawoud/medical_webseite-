interface ProgressTrackerProps {
    progress: number; // 0-100
    stage?: string;
    message?: string;
    estimatedTimeRemaining?: string;
}

export default function ProgressTracker({ progress, stage, message, estimatedTimeRemaining }: ProgressTrackerProps) {
    const clampedProgress = Math.min(Math.max(progress, 0), 100);

    const stages = ['Preprocessing', 'Segmentation', 'Metrics'];
    const currentStageIndex = stage ? stages.findIndex(s => s.toLowerCase() === stage.toLowerCase()) : -1;

    return (
        <div className="space-y-4">
            {/* Progress Bar */}
            <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-300 font-medium">
                        {stage ? `${stage} in progress...` : 'Processing...'}
                    </span>
                    <span className="text-blue-400 font-semibold">
                        {clampedProgress}%
                    </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                        style={{ width: `${clampedProgress}%` }}
                    >
                        {/* Animated shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                    </div>
                </div>
            </div>

            {/* Stage Indicators */}
            {currentStageIndex >= 0 && (
                <div className="flex items-center justify-between">
                    {stages.map((stageName, index) => (
                        <div key={stageName} className="flex items-center flex-1">
                            <div className="flex flex-col items-center flex-1">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${index < currentStageIndex
                                            ? 'bg-green-500 text-white'
                                            : index === currentStageIndex
                                                ? 'bg-blue-500 text-white ring-4 ring-blue-500/30'
                                                : 'bg-gray-700 text-gray-400'
                                        }`}
                                >
                                    {index < currentStageIndex ? '✓' : index + 1}
                                </div>
                                <span
                                    className={`mt-1 text-xs ${index === currentStageIndex ? 'text-blue-400 font-medium' : 'text-gray-500'
                                        }`}
                                >
                                    {stageName}
                                </span>
                            </div>
                            {index < stages.length - 1 && (
                                <div
                                    className={`flex-1 h-1 mx-2 rounded ${index < currentStageIndex ? 'bg-green-500' : 'bg-gray-700'
                                        }`}
                                ></div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Status Message */}
            {message && (
                <div className="text-sm text-gray-400 bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-700">
                    {message}
                </div>
            )}

            {/* Estimated Time */}
            {estimatedTimeRemaining && (
                <div className="text-xs text-gray-500 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Estimated time remaining: {estimatedTimeRemaining}
                </div>
            )}
        </div>
    );
}
