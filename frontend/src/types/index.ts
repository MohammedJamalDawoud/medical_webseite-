export interface OrganoidSample {
    id: number;
    name: string;
    species: 'MARMOSET' | 'HUMAN' | 'OTHER';
    description: string;
    date_created: string;
    notes: string;
    scans_count: number;
}

export interface MRIScan {
    id: number;
    organoid: number;
    organoid_name: string;
    modality: 'T1W' | 'T2W' | 'PDW' | 'MGE' | 'DWI' | 'FLAIR' | 'OTHER';
    sequence_name: string;
    acquisition_date: string;
    resolution: string;
    field_strength: string;
    notes: string;
    processing_steps_count: number;
}

export interface ProcessingStep {
    id: number;
    scan: number;
    scan_info: {
        id: number;
        organoid_name: string;
        modality: string;
    };
    step_type: 'N4_BIAS' | 'NORMALIZATION' | 'DENOISING' | 'GMM_SEG' | 'UNET_SEG' | 'PRIMUNET_SEG' | 'OTHER';
    status: 'PLANNED' | 'RUNNING' | 'COMPLETED' | 'FAILED';
    created_at: string;
    updated_at: string;
    parameters_json: any;
    output_path: string;
    log_excerpt: string;
    has_segmentation: boolean;
}

export interface SegmentationResult {
    id: number;
    processing_step: number;
    processing_step_info: {
        id: number;
        step_type: string;
        organoid_name: string;
        scan_modality: string;
    };
    method: 'GMM' | 'UNET' | 'PRIMUNET' | 'GMM_UNET' | 'OTHER';
    description: string;
    created_at: string;
    dice_score: number | null;
    jaccard_index: number | null;
    notes: string;
}

export interface PublicationOrPoster {
    id: number;
    title: string;
    pub_type: 'POSTER' | 'THESIS' | 'PAPER' | 'TALK' | 'OTHER';
    year: number;
    authors: string;
    venue: string;
    link: string;
    abstract: string;
}
