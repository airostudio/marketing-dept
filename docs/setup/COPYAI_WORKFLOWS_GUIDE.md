# Copy.ai Workflows Setup Guide for Casey

## What Are Copy.ai Workflows?

Workflows in Copy.ai allow you to chain together AI actions to automate content creation tasks. Instead of using individual tools, you create a workflow once and reuse it via the API.

**Think of it like this:**
- **Tools** = Single actions (write a headline)
- **Workflows** = Multiple actions chained together (research → outline → write → optimize)

## How to Access Workflows

1. **Log into Copy.ai**: https://app.copy.ai
2. **Look for "Workflows" in the left sidebar**
3. **Or go directly to**: https://app.copy.ai/workflows

## Option 1: Use Pre-Built Templates (EASIEST!)

Copy.ai has a Workflow Library with ready-made templates:

### Step-by-Step:

1. **Go to Workflows** in the left sidebar
2. **Click "Browse Templates"** or "Workflow Library"
3. **Popular templates for marketing**:
   - Product Description Generator
   - Blog Post Writer
   - Social Media Content Creator
   - Email Campaign Writer
   - Ad Copy Generator
   - SEO Meta Description Writer

4. **Select a template** that fits your needs
5. **Click "Try this" or "Use Template"**
6. The workflow is now in your account!
7. **Click on the workflow** to open it
8. **Look for the Workflow ID** (usually in the URL or workflow settings)
   - URL format: `https://app.copy.ai/workflow/{WORKFLOW_ID}`
   - Save this ID - you'll need it for API calls!

## Option 2: Create Custom Workflow

If you want to build your own workflow:

### Step-by-Step:

1. **Navigate to Workflows**
2. **Click "Create Workflow"** or "+ New Workflow"

3. **Set Up Your Trigger**:
   - Click "Add a Trigger"
   - Select **"Manual"** (for API/manual input)
   - Define your input fields:
     - Example: "productName", "targetAudience", "tone"

4. **Add Actions**:
   - Click "+ Add Step" or "Add Action"
   - **Popular actions**:
     - **AI Writer**: Generate text based on prompt
     - **Content Improver**: Enhance existing copy
     - **Tone Changer**: Adjust writing style
     - **SEO Optimizer**: Add keywords

5. **Configure Each Action**:
   - Write your prompt
   - Use variables from trigger: `{productName}`, `{targetAudience}`
   - Example prompt:
     ```
     Write a compelling product description for {productName}
     targeting {targetAudience} in a {tone} tone.
     Make it 150 words and include benefits.
     ```

6. **Test Your Workflow**:
   - Click **"Test Workflow"** (purple button)
   - Fill in sample inputs
   - Click **"Run Workflow Test"**
   - Review the output

7. **Save & Publish**:
   - Click **"Save"** or **"Publish"**
   - Your workflow is now ready!

8. **Get Workflow ID**:
   - Look at the URL: `https://app.copy.ai/workflow/abc123`
   - `abc123` is your **WORKFLOW_ID**
   - Or find it in workflow settings

## Recommended Workflows for Casey

Here are the best workflows to set up for your AI copywriter:

### 1. **Product Description Generator**
**Inputs**: Product name, features, target audience
**Output**: Compelling product description with benefits
**Use for**: E-commerce, landing pages

### 2. **Social Media Post Creator**
**Inputs**: Topic, platform (Instagram/Twitter/LinkedIn), tone
**Output**: Platform-optimized posts with hashtags
**Use for**: Social media management

### 3. **Email Subject Line Generator**
**Inputs**: Email content summary, goal (click/open/buy)
**Output**: 5-10 subject line variations
**Use for**: Email campaigns

### 4. **Ad Copy Generator**
**Inputs**: Product, platform (Google/Facebook), CTA
**Output**: Headlines, descriptions, CTAs
**Use for**: Paid advertising

### 5. **Blog Outline Creator**
**Inputs**: Topic, keywords, target length
**Output**: Structured outline with H2/H3 headings
**Use for**: Content planning

## How to Use Workflows via API

Once you have your workflow set up:

### 1. Get Your Workflow ID

From the workflow URL or settings:
```
https://app.copy.ai/workflow/wf_abc123xyz
                              ^^^^^^^^^^^^
                              This is your ID
```

### 2. Make API Call

```javascript
const generateCopy = async (inputs) => {
  const response = await fetch('https://api.copy.ai/api/workflow/wf_abc123xyz', {
    method: 'POST',
    headers: {
      'x-copy-ai-api-key': 'YOUR_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      startVariables: {
        productName: inputs.productName,
        targetAudience: inputs.targetAudience,
        tone: inputs.tone || 'professional'
      }
    })
  });

  const data = await response.json();
  return data.output;
};

// Example usage
const result = await generateCopy({
  productName: 'Smart Watch Pro',
  targetAudience: 'fitness enthusiasts',
  tone: 'energetic'
});

console.log(result);
```

### 3. Handle Response

```javascript
// Typical response structure
{
  "id": "run_xyz123",
  "workflowId": "wf_abc123xyz",
  "status": "completed",
  "output": {
    "generatedCopy": "Introducing the Smart Watch Pro...",
    "wordCount": 145,
    "suggestions": [...]
  }
}
```

## I Cannot Set It Up For You (But Here's Why)

I cannot directly log into your Copy.ai account to set up workflows because:

1. **Security**: I don't have access to your account credentials
2. **Privacy**: I shouldn't access your personal accounts
3. **Authentication**: Each account requires separate login

**BUT I CAN:**
- ✅ Provide these detailed instructions
- ✅ Recommend the best workflows for your needs
- ✅ Help you troubleshoot any issues
- ✅ Write the API integration code
- ✅ Guide you step-by-step

## Quick Start Checklist

Follow these steps in your Copy.ai account:

- [ ] Log into https://app.copy.ai
- [ ] Navigate to "Workflows" in left sidebar
- [ ] Browse the Workflow Library
- [ ] Select "Product Description Generator" template
- [ ] Click "Try this" to install it
- [ ] Open the workflow and find the Workflow ID in the URL
- [ ] Copy the Workflow ID
- [ ] Test the workflow with sample inputs
- [ ] Save the Workflow ID to your notes

**Your Workflow ID will look like**: `wf_abc123xyz456` or similar

## Example: Setting Up Product Description Workflow

Let me walk you through ONE specific workflow:

### 1. **Find the Template**
- Go to Workflows
- Search for "Product Description"
- Click on "Product Description Generator"

### 2. **Install It**
- Click "Use Template" or "Try This"
- It appears in your workflows list

### 3. **Customize (Optional)**
- Click on the workflow to open it
- You can edit the prompt if needed
- Add more fields like "price" or "features"

### 4. **Test It**
- Click "Test Workflow"
- Enter test data:
  - Product: "Wireless Headphones"
  - Target: "commuters"
  - Tone: "professional"
- Click "Run"
- Review the output

### 5. **Get the ID**
- Look at the URL bar
- Copy the workflow ID
- Save it somewhere safe

### 6. **Use in Your App**
```javascript
// Now you can call it from Casey!
const description = await fetch('https://api.copy.ai/api/workflow/YOUR_WORKFLOW_ID', {
  method: 'POST',
  headers: {
    'x-copy-ai-api-key': process.env.COPYAI_API_KEY,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    startVariables: {
      productName: 'Wireless Headphones',
      targetAudience: 'commuters',
      tone: 'professional'
    }
  })
});
```

## Common Issues & Solutions

### Issue: "Can't find Workflows"
**Solution**:
- Make sure you're on a plan that includes workflows
- Free plans may have limited workflow access
- Check if you need to upgrade

### Issue: "Workflow ID not working in API"
**Solution**:
- Double-check the ID format
- Ensure the workflow is published (not draft)
- Verify your API key has workflow access

### Issue: "Workflow runs but no output"
**Solution**:
- Check that all required input variables are provided
- Test the workflow manually first
- Review workflow logs for errors

## Need More Help?

**Copy.ai Resources**:
- Help Center: https://support.copy.ai
- Workflows Guide: https://www.copy.ai/blog/workflows-101
- Community: https://community.copy.ai
- Email: support@copy.ai

**What I Can Do**:
- Answer questions about the setup process
- Help you write the API integration code
- Troubleshoot errors you encounter
- Suggest workflow improvements

## Next Steps

1. **Right now**: Log into Copy.ai and navigate to Workflows
2. **Install**: Choose 2-3 workflow templates from the library
3. **Test**: Run them manually to see outputs
4. **Document**: Save all Workflow IDs
5. **Integrate**: Use the API code I provided above

Once you have your Workflow IDs, I can help you integrate them into Casey! Just share the IDs and I'll write the integration code.

---

**Need me to walk through this with you step-by-step? Just let me know what you see on your screen!** 🚀
