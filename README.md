# RecipeScribe 🎤👨‍🍳

A voice-first web application that transforms spoken English recipes into beautifully formatted, step-by-step instructions in both English and Sinhalese.

## ✨ Features

- **Voice Recording**: Simple one-click recording with visual feedback
- **AI Transcription**: Powered by Groq's Whisper-large-v3 for accurate speech-to-text
- **Smart Formatting**: Converts natural speech into clear, numbered cooking instructions
- **Dual Language**: Automatic translation to Sinhalese for broader accessibility
- **Modern UI**: Clean, responsive design optimized for all devices
- **Privacy First**: No data storage - everything processed in real-time

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- A Groq API key ([Get one here](https://console.groq.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd RecipeScribe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Groq API key:
   ```env
   VITE_GROQ_API_KEY=your_groq_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎯 How to Use

1. **Click "Start Recording"** - Grant microphone permissions when prompted
2. **Speak your recipe** - Describe your cooking process naturally
3. **Click "Stop Recording"** - Wait for AI processing (usually 5-10 seconds)
4. **View results** - Get your recipe in three formats:
   - Raw transcription
   - Formatted English instructions
   - Sinhalese translation

## 🛠️ Development

### Project Structure

```
src/
├── components/
│   ├── recording/          # Recording interface components
│   ├── results/           # Results display components
│   └── ui/               # Reusable UI components
├── composables/          # Vue composables for logic
├── stores/              # Pinia state management
├── types/               # TypeScript type definitions
├── views/               # Vue router views
└── assets/             # Static assets and styles
```

### Key Technologies

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **Pinia** - State management
- **Groq API** - AI transcription and processing

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run type-check   # Run TypeScript checks

# Testing
npm run test:unit    # Run unit tests
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GROQ_API_KEY` | Your Groq API key | Yes |
| `VITE_GROQ_API_BASE_URL` | Groq API base URL | No (defaults to official API) |
| `VITE_APP_TITLE` | Application title | No |
| `VITE_DEV_MODE` | Enable development features | No |

## 🌐 Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Set environment variables** in Vercel dashboard

### Other Platforms

The app can be deployed to any static hosting service:
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting

Just run `npm run build` and deploy the `dist` folder.

## 🔧 Configuration

### Audio Settings

The app uses optimized audio settings for best transcription quality:

```javascript
{
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
  sampleRate: 16000,
  channelCount: 1
}
```

### API Configuration

Groq API settings can be customized in `src/composables/useGroqAPI.ts`:

- **Transcription Model**: `whisper-large-v3`
- **Chat Model**: `llama-3.1-70b-versatile`
- **Temperature**: `0.3` (for consistent formatting)

## 🎨 Customization

### Styling

The app uses a custom Tailwind configuration with a warm, cooking-inspired color palette:

- **Primary**: Orange tones for warmth and appetite appeal
- **Secondary**: Neutral grays for readability
- **Accent**: Soft reds for highlights and actions

### Fonts

- **Body Text**: Inter (clean, readable)
- **Headings**: Poppins (friendly, approachable)

## 🔒 Privacy & Security

- **No Data Storage**: Audio and text are processed in real-time and not stored
- **Secure API**: All API calls use HTTPS with proper authentication
- **Client-Side Processing**: Audio recording happens entirely in the browser
- **Permission-Based**: Microphone access requires explicit user consent

## 🌍 Browser Support

- **Chrome**: 60+ (recommended)
- **Firefox**: 55+
- **Safari**: 11+
- **Edge**: 79+

**Note**: Requires browsers with Web Audio API and MediaRecorder support.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style (ESLint + Prettier)
- Add TypeScript types for new features
- Write unit tests for composables
- Update documentation for API changes

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Groq** - For providing excellent AI transcription and chat APIs
- **Vue.js Team** - For the amazing framework
- **Tailwind CSS** - For the utility-first CSS framework
- **OpenAI** - For Whisper speech recognition technology

## 📞 Support

If you encounter any issues:

1. Check the [Issues](../../issues) page for existing solutions
2. Verify your Groq API key is correctly configured
3. Ensure your browser supports Web Audio API
4. Check browser console for error messages

For feature requests or bug reports, please [open an issue](../../issues/new).

---

**Made with ❤️ for home cooks everywhere**
