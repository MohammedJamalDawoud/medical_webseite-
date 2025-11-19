from django.core.management.base import BaseCommand
from experiments.models import OrganoidSample, MRIScan, ProcessingStep, SegmentationResult, PublicationOrPoster
from datetime import date, datetime


class Command(BaseCommand):
    help = 'Load sample data for MRI organoid segmentation project'

    def handle(self, *args, **options):
        self.stdout.write('Loading sample data...')

        # Clear existing data
        PublicationOrPoster.objects.all().delete()
        SegmentationResult.objects.all().delete()
        ProcessingStep.objects.all().delete()
        MRIScan.objects.all().delete()
        OrganoidSample.objects.all().delete()

        # Create Organoid Samples
        organoid1 = OrganoidSample.objects.create(
            name="Marmoset Organoid MO-001",
            species="MARMOSET",
            description="Primary marmoset brain organoid cultured for 90 days. Used for longitudinal MRI study.",
            date_created=date(2024, 1, 15),
            notes="Healthy development, suitable for multi-modal imaging"
        )

        organoid2 = OrganoidSample.objects.create(
            name="Human Organoid HO-002",
            species="HUMAN",
            description="Human iPSC-derived cerebral organoid, day 120. Model for cortical development.",
            date_created=date(2024, 2, 20),
            notes="Shows clear cortical layering in MRI"
        )

        # Create MRI Scans
        scan1 = MRIScan.objects.create(
            organoid=organoid1,
            modality="T2W",
            sequence_name="RARE T2-weighted",
            acquisition_date=date(2024, 3, 1),
            resolution="100 μm isotropic",
            field_strength="9.4 T",
            notes="High SNR, excellent tissue contrast"
        )

        scan2 = MRIScan.objects.create(
            organoid=organoid1,
            modality="DWI",
            sequence_name="Diffusion-weighted imaging",
            acquisition_date=date(2024, 3, 1),
            resolution="150 μm isotropic",
            field_strength="9.4 T",
            notes="b-values: 0, 500, 1000 s/mm²"
        )

        scan3 = MRIScan.objects.create(
            organoid=organoid2,
            modality="MGE",
            sequence_name="Multi-Gradient Echo",
            acquisition_date=date(2024, 3, 15),
            resolution="80 μm isotropic",
            field_strength="9.4 T",
            notes="Multiple echo times for T2* mapping"
        )

        # Create Processing Steps
        step1 = ProcessingStep.objects.create(
            scan=scan1,
            step_type="N4_BIAS",
            status="COMPLETED",
            parameters_json={"shrink_factor": 4, "iterations": [50, 50, 50, 50]},
            output_path="/data/processed/MO-001_T2W_n4corrected.nii.gz",
            log_excerpt="N4 bias field correction completed successfully"
        )

        step2 = ProcessingStep.objects.create(
            scan=scan1,
            step_type="NORMALIZATION",
            status="COMPLETED",
            parameters_json={"method": "z-score", "mask_threshold": 0.1},
            output_path="/data/processed/MO-001_T2W_normalized.nii.gz",
            log_excerpt="Intensity normalization: mean=0, std=1"
        )

        step3 = ProcessingStep.objects.create(
            scan=scan1,
            step_type="DENOISING",
            status="COMPLETED",
            parameters_json={"method": "non-local means", "patch_size": 3},
            output_path="/data/processed/MO-001_T2W_denoised.nii.gz",
            log_excerpt="Denoising completed, SNR improved by 2.3x"
        )

        step4 = ProcessingStep.objects.create(
            scan=scan1,
            step_type="GMM_SEG",
            status="COMPLETED",
            parameters_json={"n_components": 3, "tissue_classes": ["CSF", "Gray Matter", "White Matter"]},
            output_path="/data/segmentation/MO-001_GMM_probmaps.nii.gz",
            log_excerpt="GMM segmentation: 3 tissue classes identified"
        )

        step5 = ProcessingStep.objects.create(
            scan=scan1,
            step_type="UNET_SEG",
            status="COMPLETED",
            parameters_json={"model": "UNet3D", "epochs": 100, "learning_rate": 0.001},
            output_path="/data/segmentation/MO-001_UNet_seg.nii.gz",
            log_excerpt="U-Net training completed, validation Dice: 0.89"
        )

        ProcessingStep.objects.create(
            scan=scan3,
            step_type="N4_BIAS",
            status="RUNNING",
            parameters_json={"shrink_factor": 4},
            output_path="",
            log_excerpt="Processing echo 3 of 8..."
        )

        # Create Segmentation Results
        SegmentationResult.objects.create(
            processing_step=step4,
            method="GMM",
            description="Gaussian Mixture Model segmentation with 3 tissue probability maps",
            dice_score=0.82,
            jaccard_index=0.69,
            notes="Good initial segmentation, used as prior for U-Net"
        )

        SegmentationResult.objects.create(
            processing_step=step5,
            method="UNET",
            description="U-Net refinement using GMM probability maps as additional input channels",
            dice_score=0.91,
            jaccard_index=0.84,
            notes="Significant improvement over GMM alone, especially at tissue boundaries"
        )

        # Create Publications
        PublicationOrPoster.objects.create(
            title="Automated Tissue Segmentation of In Vitro MRI Data Using Combined GMM and U-Net Approaches",
            pub_type="THESIS",
            year=2025,
            authors="Your Name",
            venue="HAWK Hochschule für angewandte Wissenschaft und Kunst, Göttingen",
            link="",
            abstract="This master thesis presents a novel pipeline combining Gaussian Mixture Models and deep learning for automated tissue segmentation of brain organoid MRI data acquired at ultra-high field (9.4T). The method achieves state-of-the-art performance on multimodal in vitro datasets."
        )

        PublicationOrPoster.objects.create(
            title="Multimodal MRI of Brain Organoids: From Acquisition to Automated Segmentation",
            pub_type="POSTER",
            year=2024,
            authors="Your Name, Prof. Dr. Roman Grothausmann, Prof. Dr. Susann Boretius",
            venue="German Neuroscience Society Meeting, Göttingen",
            link="",
            abstract="Poster presenting preliminary results on automated segmentation of marmoset and human brain organoids using MRI at 9.4T."
        )

        PublicationOrPoster.objects.create(
            title="Deep Learning for Organoid Image Analysis: Challenges and Opportunities",
            pub_type="TALK",
            year=2024,
            authors="Your Name",
            venue="DPZ Seminar Series, Deutsches Primatenzentrum",
            link="",
            abstract="Invited talk on the application of deep learning methods for analyzing 3D MRI data of brain organoids."
        )

        self.stdout.write(self.style.SUCCESS('Successfully loaded sample data'))
        self.stdout.write(f'Created {OrganoidSample.objects.count()} organoids')
        self.stdout.write(f'Created {MRIScan.objects.count()} scans')
        self.stdout.write(f'Created {ProcessingStep.objects.count()} processing steps')
        self.stdout.write(f'Created {SegmentationResult.objects.count()} segmentation results')
        self.stdout.write(f'Created {PublicationOrPoster.objects.count()} publications')
