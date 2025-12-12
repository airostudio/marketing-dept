# AI Provider Integration Guide

## Overview

This marketing department system now supports **hybrid AI provider integration**, allowing you to choose between general-purpose LLMs (OpenAI, DeepSeek) and specialized marketing tools (Jasper AI, Copy.ai) for content generation tasks.

## Supported AI Providers

### General-Purpose LLMs

#### 1. OpenAI (ChatGPT)
- **Models**: GPT-4o, GPT-4 Turbo, GPT-3.5 Turbo
- **Pricing**: $2.50-$10 per 1M tokens
- **Best For**: High-quality content, complex tasks, versatile use cases
- **API Documentation**: https://platform.openai.com/docs

**Setup:**
```bash
# Add to .env file
OPENAI_API_KEY=sk-proj-your-key-here
```

#### 2. DeepSeek
- **Models**: deepseek-chat, deepseek-reasoner
- **Pricing**: $0.14-$0.28 per 1M tokens (90% cheaper than GPT-4)
- **Best For**: Cost-effective content generation, high volume tasks
- **API Documentation**: https://platform.deepseek.com/docs

**Setup:**
```bash
# Add to .env file
DEEPSEEK_API_KEY=sk-your-key-here
```

### Specialized Marketing Tools

#### 3. Jasper AI
- **Pricing**: $40-$80 per month (subscription)
- **Best For**: Premium content with built-in templates, brand voice training
- **Features**: SEO optimization, plagiarism checking, pre-built templates

#### 4. Copy.ai / Rytr
- **Pricing**: Freemium (free tier available)
- **Best For**: Quick copywriting, social media content, ad copy
- **Features**: Multiple languages, tone adjustment, templates

## Quick Start

### 1. Configure API Keys

Run the setup wizard when you first access the application:

```bash
npm run dev
```

Navigate through the setup wizard and enter your API keys for the providers you want to use.

### 2. Select Your Preferred Provider

Use the **Provider Selector** component in the dashboard to choose which AI powers your content generation:

- Click on the current provider dropdown
- Select from available providers
- Provider must be configured (API key added) to be selectable

### 3. Create Content Tasks

When you create content generation tasks, they will automatically use your selected AI provider:

```typescript
// Example: Creating a task
addTask({
  title: 'Write blog post about AI marketing',
  description: 'Create a 1500-word blog post...',
  department: 'Content Creation',
  workerId: 'jasper', // or 'casey'
  status: 'pending',
  priority: 'high',
  progress: 0
})
```

## Cost Comparison

| Provider | Pricing Model | Cost per 1M tokens | Monthly (est. 10M tokens) |
|----------|---------------|-------------------|---------------------------|
| **DeepSeek** | Pay-per-use | $0.14-$0.28 | $1.40-$2.80 |
| **OpenAI GPT-3.5** | Pay-per-use | $0.50-$1.50 | $5.00-$15.00 |
| **OpenAI GPT-4o** | Pay-per-use | $2.50-$10.00 | $25.00-$100.00 |
| **Jasper AI** | Subscription | N/A | $40-$80 |
| **Copy.ai** | Freemium | N/A | $0-$49 |

**Recommendation**: For most use cases, **DeepSeek** offers the best cost-to-quality ratio. Use **OpenAI GPT-4o** for premium content that requires the highest quality.

## Provider Selection Strategy

### Use OpenAI (GPT-4o) when:
- ✅ Quality is paramount
- ✅ Complex reasoning required
- ✅ Brand reputation is critical
- ✅ Budget allows for premium pricing

### Use DeepSeek when:
- ✅ High volume content needed
- ✅ Cost optimization is important
- ✅ Quality requirements are good (not necessarily best)
- ✅ Experimental or testing scenarios

### Use Jasper AI when:
- ✅ Need built-in SEO optimization
- ✅ Want pre-built templates
- ✅ Require plagiarism checking
- ✅ Brand voice training is important

### Use Copy.ai when:
- ✅ Quick copywriting needed
- ✅ Budget is very limited (use free tier)
- ✅ Social media focused content
- ✅ Multiple language support required

## Architecture

### Service Layer

**OpenAI Service** (`app/src/services/openai.ts`):
```typescript
import { openAIService } from './services/openai'

const result = await openAIService.generateContent(
  {
    prompt: 'Write a blog post about...',
    format: 'blog-post',
    tone: 'professional',
    length: 'medium'
  },
  {
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4o'
  }
)
```

**DeepSeek Service** (`app/src/services/deepseek.ts`):
```typescript
import { deepSeekService } from './services/deepseek'

const result = await deepSeekService.generateContent(
  {
    prompt: 'Create marketing copy for...',
    format: 'ad-copy',
    tone: 'persuasive',
    length: 'short'
  },
  {
    apiKey: process.env.DEEPSEEK_API_KEY,
    model: 'deepseek-chat'
  }
)
```

### Task Executor

The task executor (`app/src/services/taskExecutor.ts`) automatically routes tasks to the selected provider:

```typescript
export async function executeTask(
  taskId: string,
  workerId: string,
  provider?: AIProvider,
  apiCredentials?: Record<string, string>,
  taskDetails?: TaskDetails
): Promise<TaskResult>
```

### State Management

Provider preferences are stored in Zustand state:

```typescript
interface ProviderPreferences {
  contentGeneration: AIProvider // 'openai' | 'deepseek' | 'jasper' | 'copyai'
}

// Change provider
setProviderPreference('contentGeneration', 'deepseek')
```

## Agent Configuration

Each content generation agent (Jasper, Casey) now supports multiple providers:

```json
{
  "supportedProviders": [
    {
      "id": "openai",
      "name": "OpenAI (ChatGPT)",
      "recommended": true,
      "costEfficiency": "high"
    },
    {
      "id": "deepseek",
      "name": "DeepSeek",
      "recommended": true,
      "costEfficiency": "very-high"
    }
  ]
}
```

## Hybrid System Benefits

### 1. **Cost Optimization**
- Use cheaper providers (DeepSeek) for high-volume tasks
- Reserve premium providers (GPT-4) for critical content
- Switch providers based on budget constraints

### 2. **Flexibility**
- Not locked into a single vendor
- Can A/B test different providers
- Fallback options if one provider has downtime

### 3. **Independence**
- Reduce reliance on specialized SaaS tools
- Own your prompts and workflows
- Easier to customize and extend

### 4. **Keep Specialized Tools**
- Maintain access to domain-specific features
- Use built-in integrations when beneficial
- Leverage specialized capabilities (SEO scoring, brand voice)

## Specialized Marketing Tools (Non-AI Content)

The following tools remain unchanged and continue to provide specialized functionality:

- **Hunter.io**: Email finding & verification
- **ZoomInfo**: B2B lead intelligence
- **Mailchimp**: Email marketing & automation
- **Smartly.io**: Social media ad optimization
- **Google Analytics**: Web analytics
- **Hotjar**: User behavior analytics
- **Surfer SEO**: SEO optimization
- **Intercom**: Customer support

## Environment Variables Reference

```bash
# General-Purpose AI Providers (for content generation)
OPENAI_API_KEY=your_openai_api_key_here
DEEPSEEK_API_KEY=your_deepseek_api_key_here

# Specialized Marketing Tools
JASPER_API_KEY=your_jasper_api_key_here
RYTR_API_KEY=your_rytr_api_key_here
INTERCOM_API_KEY=your_intercom_api_key_here
ZOOMINFO_API_KEY=your_zoominfo_api_key_here
MAILCHIMP_API_KEY=your_mailchimp_api_key_here
SMARTLY_API_KEY=your_smartly_api_key_here
DYNAMIC_YIELD_API_KEY=your_dynamic_yield_api_key_here
SURFER_SEO_API_KEY=your_surfer_seo_api_key_here
HOTJAR_API_KEY=your_hotjar_api_key_here
HUNTER_API_KEY=your_hunter_api_key_here
```

## Testing the Integration

### 1. Verify API Keys
The setup wizard includes verification for each provider.

### 2. Create Test Task
Create a simple content generation task to test your provider:

```typescript
addTask({
  title: 'Test: Generate welcome email',
  description: 'Write a friendly welcome email for new customers',
  department: 'Content Creation',
  workerId: 'jasper',
  status: 'pending',
  priority: 'low',
  progress: 0
})
```

### 3. Check Results
Task results will include:
- Generated content
- Model used
- Tokens consumed
- Estimated cost
- Provider name

## Troubleshooting

### "Provider not available"
**Solution**: Configure the provider's API key in the Setup Wizard first.

### "API key invalid"
**Solution**: Verify your API key is correct and has sufficient credits/quota.

### "Failed to generate content"
**Solution**: Check:
- API key is valid
- Provider service is online
- Network connectivity
- Check browser console for detailed error messages

## Future Enhancements

Potential features for future development:
- [ ] Support for Claude (Anthropic)
- [ ] Support for local LLMs (Ollama, LM Studio)
- [ ] Provider performance analytics
- [ ] Automatic provider selection based on task type
- [ ] Cost tracking dashboard
- [ ] Provider A/B testing framework

## Support

For issues or questions:
- Check the setup wizard documentation
- Review API provider documentation
- Inspect browser console for errors
- Verify .env configuration

---

**Last Updated**: 2025-12-12
**Version**: 2.0.0 (Hybrid AI Provider Support)
