# Nebius AI Studio Setup

This project has been migrated from Prodia to Nebius AI Studio for image generation.

## Setup Instructions

1. **Get Nebius API Keys**:
   - Go to https://studio.nebius.com/
   - Sign up or log in to your account
   - Navigate to API settings and generate API keys

2. **Update API Keys**:
   - Edit `src/lib/api-keys.ts`
   - Replace the placeholder API keys with your actual Nebius API keys:
   ```typescript
   const apiKeys: string[] = [
     "your-actual-nebius-api-key-1",
     "your-actual-nebius-api-key-2", 
     "your-actual-nebius-api-key-3",
   ];
   ```

3. **Available Models**:
   The following models are currently configured:
   - `black-forest-labs/flux-schnell` (Default - Fast generation)
   - `black-forest-labs/flux-dev` (High quality)
   - `stabilityai/stable-diffusion-xl-base-1.0`
   - `runwayml/stable-diffusion-v1-5`

## API Changes

### Nebius vs Prodia Differences:
- **Authentication**: Uses Bearer tokens instead of X-Prodia-Key
- **Endpoint**: `/v1/images/generations` instead of separate SDXL/SD endpoints
- **Response**: Direct image URL response instead of job-based polling
- **Parameters**: Uses `num_inference_steps` instead of `steps`, `guidance_scale` instead of `cfg_scale`

### Benefits:
- ✅ No job polling required (faster response)
- ✅ Direct image URL response
- ✅ Better model selection
- ✅ OpenAI-compatible API format
- ✅ More reliable service

## Environment Variables (Optional)

You can also use environment variables for API keys by modifying `src/lib/api-keys.ts`:

```typescript
const apiKeys: string[] = [
  process.env.NEBIUS_API_KEY_1!,
  process.env.NEBIUS_API_KEY_2!,
  process.env.NEBIUS_API_KEY_3!,
].filter(Boolean);
```

Then set in your `.env.local`:
```
NEBIUS_API_KEY_1=your-key-1
NEBIUS_API_KEY_2=your-key-2
NEBIUS_API_KEY_3=your-key-3
```

## Testing

After setting up your API keys, test the integration by:
1. Running the development server: `npm run dev`
2. Navigating to the image generation page
3. Entering a prompt and generating an image
4. Verify the image generates successfully

## Troubleshooting

- **401 Unauthorized**: Check your API keys are valid and active
- **Model not found**: Verify the model ID is available in your Nebius account
- **Rate limits**: Nebius has rate limits, consider adding multiple API keys
