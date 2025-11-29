import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon } from 'lucide-react';
import axios from 'axios';
import SEO from '../components/SEO';
import PageHeader from '../components/PageHeader';
import Section from '../components/Section';
import FileUpload from '../components/FileUpload';
import { useToast } from '../context/ToastContext';

export default function UploadScanPage() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadError, setUploadError] = useState('');

    const [formData, setFormData] = useState({
        organoid: '',
        sequence_type: 'T1W',
        data_type: 'IN_VITRO',
        role: 'UNASSIGNED',
        acquisition_date: '',
        resolution: '',
        notes: '',
    });

    const navigate = useNavigate();
    const { showToast } = useToast();

    const handleFileSelect = (file: File) => {
        setSelectedFile(file);
        setUploadError('');
        setUploadProgress(0);
    };

    const handleFileRemove = () => {
        setSelectedFile(null);
        setUploadError('');
        setUploadProgress(0);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedFile) {
            setUploadError('Please select a file to upload');
            return;
        }

        if (!formData.organoid) {
            setUploadError('Please select an organoid');
            return;
        }

        setUploading(true);
        setUploadError('');
        setUploadProgress(0);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('file', selectedFile);
            formDataToSend.append('organoid', formData.organoid);
            formDataToSend.append('sequence_type', formData.sequence_type);
            formDataToSend.append('data_type', formData.data_type);
            formDataToSend.append('role', formData.role);

            if (formData.acquisition_date) {
                formDataToSend.append('acquisition_date', formData.acquisition_date);
            }
            if (formData.resolution) {
                formDataToSend.append('resolution', formData.resolution);
            }
            if (formData.notes) {
                formDataToSend.append('notes', formData.notes);
            }

            const response = await axios.post(
                'http://localhost:8000/api/scans/upload/',
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    onUploadProgress: (progressEvent) => {
                        const progress = progressEvent.total
                            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
                            : 0;
                        setUploadProgress(progress);
                    },
                }
            );

            showToast('File uploaded successfully!', 'success');
            navigate(`/organoids/${formData.organoid}`);
        } catch (error: any) {
            console.error('Upload error:', error);
            const errorMessage = error.response?.data?.error ||
                error.response?.data?.file_path?.[0] ||
                'Upload failed. Please try again.';
            setUploadError(errorMessage);
            showToast(errorMessage, 'error');
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            <SEO title="Upload MRI Scan" description="Upload a new NIfTI MRI scan file" />
            <div className="page-container">
                <PageHeader
                    title="Upload MRI Scan"
                    subtitle="Upload a NIfTI file (.nii or .nii.gz) for analysis"
                />

                <Section>
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <form onSubmit={handleSubmit}>
                            {/* File Upload */}
                            <div style={{ marginBottom: 'var(--space-6)' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: 'var(--text-sm)',
                                    fontWeight: 'var(--font-semibold)',
                                    color: 'var(--text-main)',
                                    marginBottom: 'var(--space-3)',
                                }}>
                                    NIfTI File *
                                </label>
                                <FileUpload
                                    onFileSelect={handleFileSelect}
                                    onFileRemove={handleFileRemove}
                                    selectedFile={selectedFile}
                                    uploading={uploading}
                                    uploadProgress={uploadProgress}
                                    uploadError={uploadError}
                                />
                            </div>

                            {/* Scan Information */}
                            <div className="glass-card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
                                <h3 style={{
                                    fontSize: 'var(--text-lg)',
                                    fontWeight: 'var(--font-semibold)',
                                    color: 'var(--text-main)',
                                    marginBottom: 'var(--space-4)',
                                }}>
                                    Scan Information
                                </h3>

                                <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                                    {/* Organoid Selection - Placeholder */}
                                    <div>
                                        <label style={{
                                            display: 'block',
                                            fontSize: 'var(--text-sm)',
                                            fontWeight: 'var(--font-medium)',
                                            color: 'var(--text-main)',
                                            marginBottom: 'var(--space-2)',
                                        }}>
                                            Organoid * <span style={{ color: 'var(--text-muted)', fontWeight: 'normal' }}>(Enter Organoid ID)</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="organoid"
                                            value={formData.organoid}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Enter organoid UUID"
                                            style={{
                                                width: '100%',
                                                padding: 'var(--space-3)',
                                                background: 'var(--bg-elevated)',
                                                border: '1px solid var(--border)',
                                                borderRadius: 'var(--radius-md)',
                                                color: 'var(--text-main)',
                                                fontSize: 'var(--text-base)',
                                            }}
                                        />
                                    </div>

                                    {/* Sequence Type */}
                                    <div>
                                        <label style={{
                                            display: 'block',
                                            fontSize: 'var(--text-sm)',
                                            fontWeight: 'var(--font-medium)',
                                            color: 'var(--text-main)',
                                            marginBottom: 'var(--space-2)',
                                        }}>
                                            Sequence Type *
                                        </label>
                                        <select
                                            name="sequence_type"
                                            value={formData.sequence_type}
                                            onChange={handleInputChange}
                                            required
                                            style={{
                                                width: '100%',
                                                padding: 'var(--space-3)',
                                                background: 'var(--bg-elevated)',
                                                border: '1px solid var(--border)',
                                                borderRadius: 'var(--radius-md)',
                                                color: 'var(--text-main)',
                                                fontSize: 'var(--text-base)',
                                            }}
                                        >
                                            <option value="T1W">T1-weighted</option>
                                            <option value="T2W">T2-weighted</option>
                                            <option value="PDW">Proton Density-weighted</option>
                                            <option value="MGE">Multi-Gradient Echo</option>
                                            <option value="DWI">Diffusion-Weighted Imaging</option>
                                            <option value="FLAIR">FLAIR</option>
                                            <option value="OTHER">Other</option>
                                        </select>
                                    </div>

                                    {/* Data Type & Role */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                                        <div>
                                            <label style={{
                                                display: 'block',
                                                fontSize: 'var(--text-sm)',
                                                fontWeight: 'var(--font-medium)',
                                                color: 'var(--text-main)',
                                                marginBottom: 'var(--space-2)',
                                            }}>
                                                Data Type
                                            </label>
                                            <select
                                                name="data_type"
                                                value={formData.data_type}
                                                onChange={handleInputChange}
                                                style={{
                                                    width: '100%',
                                                    padding: 'var(--space-3)',
                                                    background: 'var(--bg-elevated)',
                                                    border: '1px solid var(--border)',
                                                    borderRadius: 'var(--radius-md)',
                                                    color: 'var(--text-main)',
                                                    fontSize: 'var(--text-base)',
                                                }}
                                            >
                                                <option value="IN_VITRO">In Vitro</option>
                                                <option value="EX_VIVO">Ex Vivo</option>
                                                <option value="IN_VIVO">In Vivo</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label style={{
                                                display: 'block',
                                                fontSize: 'var(--text-sm)',
                                                fontWeight: 'var(--font-medium)',
                                                color: 'var(--text-main)',
                                                marginBottom: 'var(--space-2)',
                                            }}>
                                                Dataset Role
                                            </label>
                                            <select
                                                name="role"
                                                value={formData.role}
                                                onChange={handleInputChange}
                                                style={{
                                                    width: '100%',
                                                    padding: 'var(--space-3)',
                                                    background: 'var(--bg-elevated)',
                                                    border: '1px solid var(--border)',
                                                    borderRadius: 'var(--radius-md)',
                                                    color: 'var(--text-main)',
                                                    fontSize: 'var(--text-base)',
                                                }}
                                            >
                                                <option value="UNASSIGNED">Unassigned</option>
                                                <option value="TRAIN">Training</option>
                                                <option value="VAL">Validation</option>
                                                <option value="TEST">Testing</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Acquisition Date & Resolution */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                                        <div>
                                            <label style={{
                                                display: 'block',
                                                fontSize: 'var(--text-sm)',
                                                fontWeight: 'var(--font-medium)',
                                                color: 'var(--text-main)',
                                                marginBottom: 'var(--space-2)',
                                            }}>
                                                Acquisition Date
                                            </label>
                                            <input
                                                type="date"
                                                name="acquisition_date"
                                                value={formData.acquisition_date}
                                                onChange={handleInputChange}
                                                style={{
                                                    width: '100%',
                                                    padding: 'var(--space-3)',
                                                    background: 'var(--bg-elevated)',
                                                    border: '1px solid var(--border)',
                                                    borderRadius: 'var(--radius-md)',
                                                    color: 'var(--text-main)',
                                                    fontSize: 'var(--text-base)',
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <label style={{
                                                display: 'block',
                                                fontSize: 'var(--text-sm)',
                                                fontWeight: 'var(--font-medium)',
                                                color: 'var(--text-main)',
                                                marginBottom: 'var(--space-2)',
                                            }}>
                                                Resolution
                                            </label>
                                            <input
                                                type="text"
                                                name="resolution"
                                                value={formData.resolution}
                                                onChange={handleInputChange}
                                                placeholder="e.g., 100 μm isotropic"
                                                style={{
                                                    width: '100%',
                                                    padding: 'var(--space-3)',
                                                    background: 'var(--bg-elevated)',
                                                    border: '1px solid var(--border)',
                                                    borderRadius: 'var(--radius-md)',
                                                    color: 'var(--text-main)',
                                                    fontSize: 'var(--text-base)',
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    <div>
                                        <label style={{
                                            display: 'block',
                                            fontSize: 'var(--text-sm)',
                                            fontWeight: 'var(--font-medium)',
                                            color: 'var(--text-main)',
                                            marginBottom: 'var(--space-2)',
                                        }}>
                                            Notes
                                        </label>
                                        <textarea
                                            name="notes"
                                            value={formData.notes}
                                            onChange={handleInputChange}
                                            rows={3}
                                            placeholder="Additional notes about this scan..."
                                            style={{
                                                width: '100%',
                                                padding: 'var(--space-3)',
                                                background: 'var(--bg-elevated)',
                                                border: '1px solid var(--border)',
                                                borderRadius: 'var(--radius-md)',
                                                color: 'var(--text-main)',
                                                fontSize: 'var(--text-base)',
                                                resize: 'vertical',
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="btn btn-secondary"
                                    disabled={uploading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={!selectedFile || uploading}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--space-2)',
                                    }}
                                >
                                    <UploadIcon size={18} />
                                    {uploading ? 'Uploading...' : 'Upload Scan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </Section>
            </div>
        </>
    );
}
