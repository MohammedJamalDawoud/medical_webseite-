#!/usr/bin/env python3
"""
MRI Organoids API - Batch Processing Example

This script demonstrates how to use the MRI Organoids Segmentation API
for batch processing of multiple scans.

Usage:
    python batch_process_scans.py --config CONFIG_ID --model MODEL_ID

Requirements:
    pip install requests
"""

import argparse
import requests
import time
from typing import List, Dict, Optional
import sys


class MRIOrganoidAPI:
    """Client for interacting with the MRI Organoids API."""
    
    def __init__(self, base_url: str = "http://localhost:8000/api"):
        self.base_url = base_url
        self.session = requests.Session()
    
    def get_scans(self, role: Optional[str] = None, data_type: Optional[str] = None) -> List[Dict]:
        """Get list of MRI scans with optional filtering."""
        params = {}
        if role:
            params['role'] = role
        if data_type:
            params['data_type'] = data_type
        
        response = self.session.get(f"{self.base_url}/scans/", params=params)
        response.raise_for_status()
        data = response.json()
        return data.get('results', data)
    
    def create_pipeline_run(self, scan_id: str, config_id: str, model_id: str, 
                           stage: str = "FULL_PIPELINE") -> Dict:
        """Create a new pipeline run for a scan."""
        payload = {
            "mri_scan": scan_id,
            "stage": stage,
            "experiment_config": config_id,
            "model_version": model_id
        }
        
        response = self.session.post(f"{self.base_url}/pipeline-runs/", json=payload)
        response.raise_for_status()
        return response.json()
    
    def get_pipeline_run(self, run_id: str) -> Dict:
        """Get pipeline run status."""
        response = self.session.get(f"{self.base_url}/pipeline-runs/{run_id}/")
        response.raise_for_status()
        return response.json()
    
    def get_segmentation_results(self, run_id: str) -> List[Dict]:
        """Get segmentation results for a pipeline run."""
        response = self.session.get(
            f"{self.base_url}/segmentation-results/",
            params={"pipeline_run": run_id}
        )
        response.raise_for_status()
        data = response.json()
        return data.get('results', data)
    
    def update_qc_status(self, run_id: str, qc_status: str, qc_notes: str = "") -> Dict:
        """Update QC status for a pipeline run."""
        payload = {
            "qc_status": qc_status,
            "qc_notes": qc_notes
        }
        
        response = self.session.patch(
            f"{self.base_url}/pipeline-runs/{run_id}/",
            json=payload
        )
        response.raise_for_status()
        return response.json()


def wait_for_completion(api: MRIOrganoidAPI, run_id: str, timeout: int = 300) -> Dict:
    """
    Wait for a pipeline run to complete.
    
    Args:
        api: API client instance
        run_id: Pipeline run UUID
        timeout: Maximum wait time in seconds
    
    Returns:
        Final run status
    """
    start_time = time.time()
    
    while time.time() - start_time < timeout:
        run = api.get_pipeline_run(run_id)
        status = run['status']
        
        if status in ['SUCCESS', 'FAILED']:
            return run
        
        print(f"  Status: {status}... waiting")
        time.sleep(5)
    
    raise TimeoutError(f"Pipeline run {run_id} did not complete within {timeout}s")


def batch_process_scans(config_id: str, model_id: str, role: str = "TRAIN", 
                       auto_qc: bool = False):
    """
    Process multiple scans in batch.
    
    Args:
        config_id: Experiment configuration UUID
        model_id: Model version UUID
        role: Scan role to filter (TRAIN, VAL, TEST)
        auto_qc: Automatically mark successful runs as ACCEPTED
    """
    api = MRIOrganoidAPI()
    
    print(f"Fetching scans with role={role}...")
    scans = api.get_scans(role=role)
    print(f"Found {len(scans)} scans to process\n")
    
    if not scans:
        print("No scans found. Exiting.")
        return
    
    results = []
    
    for i, scan in enumerate(scans, 1):
        scan_id = scan['id']
        scan_name = f"{scan['organoid_name']} - {scan['sequence_type']}"
        
        print(f"[{i}/{len(scans)}] Processing: {scan_name}")
        print(f"  Scan ID: {scan_id}")
        
        try:
            # Create pipeline run
            run = api.create_pipeline_run(scan_id, config_id, model_id)
            run_id = run['id']
            print(f"  Pipeline run created: {run_id}")
            
            # Wait for completion
            final_run = wait_for_completion(api, run_id)
            status = final_run['status']
            print(f"  Completed with status: {status}")
            
            # Get results if successful
            if status == 'SUCCESS':
                seg_results = api.get_segmentation_results(run_id)
                if seg_results:
                    result = seg_results[0]
                    print(f"  Dice Score: {result.get('dice_score', 'N/A')}")
                    print(f"  IoU: {result.get('iou', 'N/A')}")
                    print(f"  Volume: {result.get('volume_ml', 'N/A')} ml")
                    
                    # Auto QC if enabled
                    if auto_qc:
                        api.update_qc_status(
                            run_id, 
                            "ACCEPTED",
                            "Automatically accepted by batch processing script"
                        )
                        print(f"  QC Status: ACCEPTED (auto)")
                
                results.append({
                    'scan': scan_name,
                    'run_id': run_id,
                    'status': 'SUCCESS',
                    'metrics': seg_results[0] if seg_results else None
                })
            else:
                results.append({
                    'scan': scan_name,
                    'run_id': run_id,
                    'status': 'FAILED',
                    'error': final_run.get('log_excerpt', 'Unknown error')
                })
                print(f"  Error: {final_run.get('log_excerpt', 'Unknown')}")
        
        except Exception as e:
            print(f"  ERROR: {str(e)}")
            results.append({
                'scan': scan_name,
                'status': 'ERROR',
                'error': str(e)
            })
        
        print()
    
    # Summary
    print("=" * 60)
    print("BATCH PROCESSING SUMMARY")
    print("=" * 60)
    
    successful = sum(1 for r in results if r['status'] == 'SUCCESS')
    failed = sum(1 for r in results if r['status'] in ['FAILED', 'ERROR'])
    
    print(f"Total scans: {len(results)}")
    print(f"Successful: {successful}")
    print(f"Failed: {failed}")
    print()
    
    if successful > 0:
        print("Successful runs:")
        for r in results:
            if r['status'] == 'SUCCESS' and r.get('metrics'):
                metrics = r['metrics']
                print(f"  {r['scan']}: Dice={metrics.get('dice_score', 'N/A'):.3f}")
    
    if failed > 0:
        print("\nFailed runs:")
        for r in results:
            if r['status'] in ['FAILED', 'ERROR']:
                print(f"  {r['scan']}: {r.get('error', 'Unknown error')}")


def main():
    parser = argparse.ArgumentParser(
        description="Batch process MRI scans using the Organoids API"
    )
    parser.add_argument(
        '--config',
        required=True,
        help='Experiment configuration UUID'
    )
    parser.add_argument(
        '--model',
        required=True,
        help='Model version UUID'
    )
    parser.add_argument(
        '--role',
        default='TRAIN',
        choices=['TRAIN', 'VAL', 'TEST', 'UNASSIGNED'],
        help='Scan role to filter (default: TRAIN)'
    )
    parser.add_argument(
        '--auto-qc',
        action='store_true',
        help='Automatically mark successful runs as ACCEPTED'
    )
    
    args = parser.parse_args()
    
    try:
        batch_process_scans(
            config_id=args.config,
            model_id=args.model,
            role=args.role,
            auto_qc=args.auto_qc
        )
    except KeyboardInterrupt:
        print("\n\nBatch processing interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n\nFATAL ERROR: {str(e)}")
        sys.exit(1)


if __name__ == "__main__":
    main()
