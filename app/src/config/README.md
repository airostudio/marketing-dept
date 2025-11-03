# Platform Configuration

This directory contains configuration files for all AI platforms integrated into the marketing department.

## Files

- `platforms.js` - Main configuration for all AI platforms

## Current Configuration

### ✅ Rytr AI (Configured)
- **Platform**: Rytr AI
- **URL**: https://app.rytr.me
- **Tier**: Unlimited
- **Status**: Active and ready to use
- **Available Tools**: 8 copywriting tools

### Pending Configuration
- Hunter.io (Lead Generation)
- Mailchimp (Email Marketing)
- Google Analytics (Analytics)
- Hotjar (UX Analytics)

## Usage

### Import Platform Config

```javascript
import { aiPlatforms, getPlatform, isPlatformConfigured } from './config/platforms';

// Get specific platform
const rytr = getPlatform('rytr');
console.log(rytr.name); // "Rytr AI"

// Check if platform is configured
if (isPlatformConfigured('rytr')) {
  console.log('Rytr is ready to use!');
}

// Get all configured platforms
import { getConfiguredPlatforms } from './config/platforms';
const active = getConfiguredPlatforms();
console.log(active); // Array of configured platforms
```

### Check Platform Status

```javascript
import { getAllPlatformStatus } from './config/platforms';

const status = getAllPlatformStatus();
console.log(status);
// {
//   rytr: { name: "Rytr AI", configured: true, tier: "unlimited" },
//   hunterIo: { name: "Hunter.io", configured: false, tier: "free" },
//   ...
// }
```

## Environment Variables

All API keys and secrets should be stored in the `.env` file in the `app/` directory:

```bash
# Required for Vite projects: Use VITE_ prefix
VITE_RYTR_API_KEY=your_api_key_here
VITE_HUNTERIO_API_KEY=your_api_key_here
VITE_MAILCHIMP_API_KEY=your_api_key_here
VITE_GA_TRACKING_ID=your_tracking_id_here
VITE_HOTJAR_SITE_ID=your_site_id_here
```

**Important**: The `VITE_` prefix is required for environment variables to be exposed to the client-side code in Vite projects.

## Adding New Platforms

To add a new platform:

1. Add platform configuration to `platforms.js`:
```javascript
export const aiPlatforms = {
  // ... existing platforms

  newPlatform: {
    name: "New Platform",
    url: "https://newplatform.com",
    apiKey: import.meta.env.VITE_NEWPLATFORM_API_KEY || '',
    tier: "free",
    features: {
      // List features here
    },
    limits: {
      // List limits here
    },
    documentation: "https://docs.newplatform.com",
  },
};
```

2. Add the API key to `.env`:
```bash
VITE_NEWPLATFORM_API_KEY=your_key_here
```

3. Add to `.env.example` for documentation

4. The platform will automatically be available through the helper functions

## Security

- Never commit the `.env` file (it's in `.gitignore`)
- Never hardcode API keys in source code
- Use environment variables for all sensitive data
- The `VITE_` prefix exposes variables to the client, so only use it for keys that need to be accessed from the browser
- For server-side only keys (if added), don't use the `VITE_` prefix

## Current API Keys

### Rytr AI
- **Key**: `90ECPFOACTFO2KE2LPHZR`
- **Tier**: Unlimited
- **Access**: Full API access to all features
- **Status**: ✅ Active

See individual platform setup guides in `/docs/setup/` for more details.
