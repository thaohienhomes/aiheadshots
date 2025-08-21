# RunPod Integration Setup Guide

This guide explains how to set up RunPod serverless endpoints for scaling AI headshot generation jobs.

## Overview

The RunPod integration provides:
- **Serverless Scaling**: Automatically scale based on demand
- **Cost Optimization**: Pay only for compute time used
- **Load Balancing**: Distribute jobs between Replicate and RunPod
- **Fallback Support**: Automatic failover between providers

## RunPod Serverless Setup

### 1. Create RunPod Account
1. Sign up at [RunPod.io](https://runpod.io)
2. Navigate to "Serverless" section
3. Create a new endpoint

### 2. Configure Serverless Endpoint

**Template Configuration:**
```json
{
  "name": "ai-headshot-generator",
  "image": "runpod/pytorch:2.0.1-py3.10-cuda11.8.0-devel-ubuntu22.04",
  "env": {
    "REPLICATE_API_TOKEN": "your_replicate_token"
  },
  "gpu_types": ["NVIDIA RTX A4000", "NVIDIA RTX A5000"],
  "min_workers": 0,
  "max_workers": 10,
  "idle_timeout": 5,
  "execution_timeout": 300
}
```

### 3. Deploy Handler Code

Create a `handler.py` file for your RunPod endpoint:

```python
import runpod
import replicate
import os
import requests
from typing import Dict, Any

# Initialize Replicate client
replicate_client = replicate.Client(api_token=os.environ["REPLICATE_API_TOKEN"])

def generate_headshot(job_input: Dict[str, Any]) -> Dict[str, Any]:
    """
    Process headshot generation job
    """
    try:
        # Extract input parameters
        image_url = job_input.get("image_url")
        prompt = job_input.get("prompt")
        negative_prompt = job_input.get("negative_prompt", "")
        
        # Replicate model parameters
        model_params = {
            "image": image_url,
            "prompt": prompt,
            "negative_prompt": negative_prompt,
            "width": job_input.get("width", 1024),
            "height": job_input.get("height", 1024),
            "guidance_scale": job_input.get("guidance_scale", 7.5),
            "num_inference_steps": job_input.get("num_inference_steps", 50),
            "scheduler": job_input.get("scheduler", "K_EULER"),
            "num_outputs": job_input.get("num_outputs", 1),
            "quality": job_input.get("quality", 100),
            "lora_scale": job_input.get("lora_scale", 0.6),
        }
        
        # Run Replicate prediction
        prediction = replicate_client.predictions.create(
            version="stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
            input=model_params
        )
        
        # Wait for completion
        prediction.wait()
        
        if prediction.status == "succeeded":
            result_url = prediction.output[0] if isinstance(prediction.output, list) else prediction.output
            return {
                "result_url": result_url,
                "replicate_job_id": prediction.id,
                "status": "completed"
            }
        else:
            return {
                "error": f"Replicate job failed: {prediction.error}",
                "status": "failed"
            }
            
    except Exception as e:
        return {
            "error": str(e),
            "status": "failed"
        }

# Set up RunPod handler
runpod.serverless.start({"handler": generate_headshot})
```

### 4. Environment Variables

Set these in your RunPod endpoint configuration:

```bash
REPLICATE_API_TOKEN=your_replicate_api_token
```

## Application Configuration

### 1. Environment Variables

Add to your `.env` file:

```bash
VITE_RUNPOD_API_KEY=your_runpod_api_key
VITE_RUNPOD_ENDPOINT_ID=your_runpod_endpoint_id
```

### 2. Webhook Setup

Configure webhook URL in RunPod dashboard:
- **Webhook URL**: `https://your-app.vercel.app/api/runpod-webhook`
- **Events**: Job completion, failure

### 3. Usage Examples

```typescript
import { createAIGeneration } from '../lib/aiOrchestrator';

// Automatic provider selection with load balancing
const result = await createAIGeneration({
  uploadId: 'uuid',
  model: 'sdxl',
  style: 'professional',
  personalInfo: {
    age: 30,
    gender: 'male',
    ethnicity: 'caucasian'
  },
  uploadUrl: 'https://example.com/image.jpg',
  webhookUrl: 'https://your-app.vercel.app/api/runpod-webhook'
});

// Force specific provider
import { createGenerationWithRunPod } from '../lib/runpod';

const runpodResult = await createGenerationWithRunPod(
  uploadId, model, style, personalInfo, uploadUrl, webhookUrl
);
```

## Load Balancing Configuration

```typescript
import { aiOrchestrator } from '../lib/aiOrchestrator';

// Configure load balancing
aiOrchestrator.updateConfig({
  preferredProvider: 'runpod',
  fallbackProvider: 'replicate',
  enableLoadBalancing: true,
  maxReplicateJobs: 5
});

// Monitor job statistics
const stats = aiOrchestrator.getJobStats();
console.log(`Active jobs - RunPod: ${stats.runpod}, Replicate: ${stats.replicate}`);
```

## Cost Optimization

### RunPod Pricing Benefits:
- **Pay-per-second**: Only pay for actual compute time
- **Auto-scaling**: Scale to zero when idle
- **GPU Selection**: Choose optimal GPU for your workload
- **Batch Processing**: Process multiple jobs efficiently

### Recommended Configuration:
- **Min Workers**: 0 (scale to zero)
- **Max Workers**: 5-10 (based on expected load)
- **Idle Timeout**: 5 minutes
- **GPU Type**: RTX A4000 for cost-effectiveness

## Monitoring and Debugging

### 1. Job Status Monitoring

```typescript
import { getJobStatus } from '../lib/runpod';

const status = await getJobStatus(jobId);
console.log('Job status:', status.job?.status);
console.log('Execution time:', status.job?.executionTime);
```

### 2. Webhook Debugging

Check webhook logs in your deployment platform:
- **Vercel**: Function logs in dashboard
- **Netlify**: Function logs in site dashboard
- **Express**: Server console logs

### 3. Error Handling

Common issues and solutions:
- **Endpoint not found**: Check RUNPOD_ENDPOINT_ID
- **Authentication failed**: Verify RUNPOD_API_KEY
- **Job timeout**: Increase execution_timeout in endpoint config
- **GPU unavailable**: Add more GPU types to endpoint config

## Production Deployment

### 1. Scaling Configuration
```json
{
  "min_workers": 1,
  "max_workers": 20,
  "idle_timeout": 10,
  "execution_timeout": 600
}
```

### 2. Monitoring Setup
- Set up alerts for failed jobs
- Monitor execution times and costs
- Track success rates by provider

### 3. Backup Strategy
- Always configure fallback provider
- Monitor provider health
- Implement retry logic for failed jobs

## Security Considerations

- Store API keys securely in environment variables
- Use HTTPS for all webhook URLs
- Validate webhook payloads
- Implement rate limiting on webhook endpoints
- Monitor for unusual usage patterns
