# Hugging Face Space Deployment Guide

**Space URL:** [https://huggingface.co/spaces/ndwdgda/flateerthdome](https://huggingface.co/spaces/ndwdgda/flateerthdome)
**Live API Endpoint:** `https://ndwdgda-flateerthdome.hf.space/api/master.json`

## Credentials

- **Username:** `ndwdgda`
- **Write Token:** `(Ask User for HuggingFace Write Token)`
- **Git Remote:** `https://ndwdgda:<TOKEN>@huggingface.co/spaces/ndwdgda/flateerthdome`

_(The git remote is currently configured locally as `space` inside the `predictions` repository)._

## Architecture Note

We migrated from Cloudflare Workers to Hugging Face Spaces (Docker + FastAPI) to permanently bypass Cloudflare's aggressive static asset edge caching (`Content-Addressed Storage`), which ignored identical file paths without artificial version bumping.

The FastAPI app (`app.py`) dynamically serves the JSON API paths from the local filesystem on every request and forces `Cache-Control: no-store` headers.

## Deployment Workflow

To update the API in future sessions, you no longer need `wrangler`. Rebuild your JSON files natively and push to the `space` git remote.

```bash
cd /Users/nicholashughes/.gemini/antigravity/scratch/astro_observations/predictions

# Generate your updated JSONs as usual...

# Stage and commit your changes
git add -A
git commit -m "Update API: Version X"

# Push to Hugging Face
git push space main
```

_Note: After pushing, it takes ~2 minutes for the Hugging Face Space Docker container to build and restart._

To verify the live endpoint has updated natively:

```bash
curl -s https://ndwdgda-flateerthdome.hf.space/api/master.json | python3 -c "import json,sys; d=json.load(sys.stdin); print(f\"Version: {d.get('index', {}).get('current_version', 'N/A')} | Overall Confirmed: {d.get('scorecard', {}).get('overall', {}).get('confirmed', 'N/A')}\")"
```
