import { useState, useRef, type DragEvent, type ChangeEvent } from 'react';
import { Upload, X, CheckCircle, AlertCircle, FileIcon } from 'lucide-react';

interface FileUploadProps {
    onFileSelect: (file: File) => void;
    onFileRemove: () => void;
    selectedFile: File | null;
    accept?: string;
    maxSize?: number; // in MB
    uploading?: boolean;
    uploadProgress?: number;
    uploadError?: string;
}

export default function FileUpload({
    onFileSelect,
    onFileRemove,
    selectedFile,
    accept = '.nii,.nii.gz',
    maxSize = 500,
    uploading = false,
    uploadProgress = 0,
    uploadError = '',
}: FileUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    };

    const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFile(files[0]);
        }
    };

    const handleFile = (file: File) => {
        // Validate file extension
        const validExtensions = accept.split(',').map(ext => ext.trim());
        const fileName = file.name.toLowerCase();
        const isValidExtension = validExtensions.some(ext => fileName.endsWith(ext.replace('.', '')));

        if (!isValidExtension) {
            alert(`Invalid file type. Please upload ${accept} files only.`);
            return;
        }

        // Validate file size
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > maxSize) {
            alert(`File too large. Maximum size is ${maxSize}MB.`);
            return;
        }

        onFileSelect(file);
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <div>
            <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                onChange={handleFileInput}
                style={{ display: 'none' }}
            />

            {!selectedFile ? (
                <div
                    onClick={handleClick}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    style={{
                        border: `2px dashed ${isDragging ? 'var(--primary)' : 'var(--border)'}`,
                        borderRadius: 'var(--radius-lg)',
                        padding: 'var(--space-8)',
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: isDragging ? 'rgba(59, 130, 246, 0.05)' : 'var(--bg-elevated)',
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                        if (!isDragging) {
                            e.currentTarget.style.borderColor = 'var(--primary)';
                            e.currentTarget.style.background = 'rgba(59, 130, 246, 0.03)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!isDragging) {
                            e.currentTarget.style.borderColor = 'var(--border)';
                            e.currentTarget.style.background = 'var(--bg-elevated)';
                        }
                    }}
                >
                    <Upload
                        size={48}
                        style={{
                            color: isDragging ? 'var(--primary)' : 'var(--text-muted)',
                            margin: '0 auto var(--space-4)',
                        }}
                    />
                    <h3 style={{
                        fontSize: 'var(--text-lg)',
                        fontWeight: 'var(--font-semibold)',
                        color: 'var(--text-main)',
                        marginBottom: 'var(--space-2)',
                    }}>
                        {isDragging ? 'Drop file here' : 'Upload NIfTI File'}
                    </h3>
                    <p style={{
                        fontSize: 'var(--text-sm)',
                        color: 'var(--text-muted)',
                        marginBottom: 'var(--space-2)',
                    }}>
                        Drag and drop or click to browse
                    </p>
                    <p style={{
                        fontSize: 'var(--text-xs)',
                        color: 'var(--text-muted)',
                    }}>
                        Supported formats: {accept} • Max size: {maxSize}MB
                    </p>
                </div>
            ) : (
                <div
                    style={{
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-lg)',
                        padding: 'var(--space-4)',
                        background: 'var(--bg-elevated)',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <FileIcon size={40} style={{ color: 'var(--primary)', flexShrink: 0 }} />

                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                                fontSize: 'var(--text-sm)',
                                fontWeight: 'var(--font-medium)',
                                color: 'var(--text-main)',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}>
                                {selectedFile.name}
                            </div>
                            <div style={{
                                fontSize: 'var(--text-xs)',
                                color: 'var(--text-muted)',
                                marginTop: 'var(--space-1)',
                            }}>
                                {formatFileSize(selectedFile.size)}
                            </div>
                        </div>

                        {!uploading && !uploadError && (
                            <button
                                onClick={onFileRemove}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: 'var(--space-2)',
                                    color: 'var(--text-muted)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 'var(--radius-md)',
                                    transition: 'all 0.2s',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'var(--bg-hover)';
                                    e.currentTarget.style.color = 'var(--text-main)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = 'var(--text-muted)';
                                }}
                            >
                                <X size={20} />
                            </button>
                        )}

                        {uploading && (
                            <div style={{ color: 'var(--primary)' }}>
                                <div className="spinner" style={{ width: '20px', height: '20px' }} />
                            </div>
                        )}

                        {!uploading && !uploadError && uploadProgress === 100 && (
                            <CheckCircle size={24} style={{ color: 'var(--success)', flexShrink: 0 }} />
                        )}

                        {uploadError && (
                            <AlertCircle size={24} style={{ color: 'var(--error)', flexShrink: 0 }} />
                        )}
                    </div>

                    {/* Progress Bar */}
                    {uploading && (
                        <div style={{ marginTop: 'var(--space-3)' }}>
                            <div style={{
                                width: '100%',
                                height: '4px',
                                background: 'var(--bg-base)',
                                borderRadius: 'var(--radius-full)',
                                overflow: 'hidden',
                            }}>
                                <div style={{
                                    width: `${uploadProgress}%`,
                                    height: '100%',
                                    background: 'var(--primary)',
                                    transition: 'width 0.3s',
                                }} />
                            </div>
                            <div style={{
                                fontSize: 'var(--text-xs)',
                                color: 'var(--text-muted)',
                                marginTop: 'var(--space-1)',
                                textAlign: 'center',
                            }}>
                                Uploading... {uploadProgress}%
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {uploadError && (
                        <div style={{
                            marginTop: 'var(--space-3)',
                            padding: 'var(--space-3)',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: 'var(--text-sm)',
                            color: '#ef4444',
                        }}>
                            {uploadError}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
