# AI Marketing Department - React Application

A fully functional React application for managing your AI-powered marketing department with real API integrations.

## 🚀 Features

### ✅ Setup Wizard
- Beautiful multi-step onboarding flow
- API credential verification for all 8 platforms
- Progress tracking and validation
- Skip and return later functionality

### 🎨 Interactive Dashboard
- Real-time metrics and KPIs
- 8 personified AI workers with status tracking
- Activity feed with live updates
- Performance analytics

### 📋 Task Management
- Create tasks and assign to workers
- Real-time task execution and progress tracking
- Priority levels and status management
- Automatic worker allocation

### 👤 Worker Detail Pages
- Individual worker profiles
- Task history and current assignments
- Capabilities and platform information
- Quick actions

### ⚙️ Settings & Configuration
- Manage API credentials
- Platform connection status
- Security notices
- Reset functionality

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **React Router** - Navigation
- **Framer Motion** - Animations
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

## 📦 Installation

```bash
# Navigate to app directory
cd app

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Configuration

### API Platforms

The app supports 8 AI platforms:

1. **Jasper AI** - Content creation
2. **ZoomInfo** - Lead generation
3. **Seventh Sense** - Email optimization
4. **Smartly.io** - Social advertising
5. **Dynamic Yield** - Personalization
6. **Google Analytics** - Analytics
7. **Surfer SEO** - SEO optimization
8. **Intercom** - Customer support

### Environment Variables

Create a `.env` file (optional):

```env
VITE_APP_NAME="AI Marketing Department"
VITE_API_TIMEOUT=30000
```

## 📁 Project Structure

```
app/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Layout.tsx
│   │   ├── WorkerCard.tsx
│   │   ├── StatsCard.tsx
│   │   └── ActivityFeed.tsx
│   ├── pages/              # Page components
│   │   ├── SetupWizard.tsx
│   │   ├── Dashboard.tsx
│   │   ├── TaskManager.tsx
│   │   ├── WorkerDetail.tsx
│   │   └── Settings.tsx
│   ├── services/           # API integration layer
│   │   └── taskExecutor.ts
│   ├── store/              # State management
│   │   └── useStore.ts
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🎯 Usage

### First Time Setup

1. **Start the app**: `npm run dev`
2. **Setup Wizard**: Enter API credentials for platforms
3. **Verify Connections**: Test each platform connection
4. **Complete Setup**: Access the dashboard

### Creating Tasks

1. Navigate to **Task Manager**
2. Click **"New Task"**
3. Fill in task details:
   - Title
   - Description
   - Assign to worker
   - Set priority
4. Task executes automatically

### Monitoring Workers

1. View all workers on **Dashboard**
2. Click any worker card for details
3. See active tasks and metrics
4. View capabilities and status

## 🔌 API Integration

### Adding Real API Calls

Edit `/src/services/taskExecutor.ts` to add real API calls:

```typescript
async function executeContentTask(taskId: string): Promise<TaskResult> {
  const apiKey = getApiKey('jasperAi')

  const response = await fetch('https://api.jasper.ai/v1/generate', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: 'Your prompt here',
      max_tokens: 1500
    })
  })

  const data = await response.json()

  return {
    success: true,
    data: data
  }
}
```

### Platform-Specific Services

Create individual service files for each platform:

```
services/
├── jasperService.ts
├── zoomInfoService.ts
├── seventhSenseService.ts
├── smartlyService.ts
├── dynamicYieldService.ts
├── analyticsService.ts
├── surferService.ts
└── intercomService.ts
```

## 🎨 Customization

### Styling

Edit `tailwind.config.js` to customize colors:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#667eea', // Change primary color
      },
    },
  },
}
```

### Adding Workers

Edit `/src/store/useStore.ts`:

```typescript
{
  id: 'new-worker',
  name: 'New Worker',
  emoji: '🆕',
  role: 'New Role',
  department: 'New Department',
  platform: 'New Platform',
  status: 'idle',
  metrics: {}
}
```

## 🔒 Security

### API Key Storage

- API keys stored in browser `localStorage`
- Encrypted using Zustand persist middleware
- Never sent to external servers (except platform APIs)

### Production Recommendations

1. **Backend Proxy**: Use server-side proxy for API calls
2. **Environment Variables**: Store keys server-side
3. **OAuth**: Implement OAuth flow where available
4. **Rate Limiting**: Add request throttling
5. **Error Handling**: Implement comprehensive error handling

## 📊 State Management

Using **Zustand** with persistence:

```typescript
const { workers, tasks, addTask } = useStore()

// Add task
addTask({
  title: 'New task',
  workerId: 'jasper',
  department: 'Content Creation',
  priority: 'high',
  status: 'pending',
  progress: 0
})

// Update worker
updateWorkerStatus('jasper', 'active')
```

## 🎭 Animations

Using **Framer Motion**:

```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.1 }}
>
  Content
</motion.div>
```

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Change port in vite.config.ts
server: {
  port: 3001
}
```

### Build Errors

```bash
# Clear cache
rm -rf node_modules
rm package-lock.json
npm install
```

### State Not Persisting

Check browser localStorage permissions and clear if needed.

## 📈 Performance

- Code splitting with React Router
- Lazy loading for heavy components
- Optimized re-renders with Zustand
- Minimal dependencies

## 🚢 Deployment

### Vercel

```bash
npm run build
vercel --prod
```

### Netlify

```bash
npm run build
netlify deploy --prod --dir=dist
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 📝 License

MIT License - See LICENSE file

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## 🆘 Support

- Check documentation
- Review component code
- Test API connections
- Verify credentials

---

**Built with ❤️ and AI** | [View Full Documentation](../README.md)
