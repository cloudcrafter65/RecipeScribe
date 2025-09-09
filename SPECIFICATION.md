# RecipeScribe - Project Specification

## 1. Overview & Vision

### Problem Statement
Sharing recipes verbally is common, but manually transcribing, formatting, and translating them into clear instructions is a time-consuming and tedious process. This is a particular barrier for non-technical individuals who wish to preserve and share culinary knowledge across language barriers.

### Vision
RecipeScribe will be a simple, voice-first web application that empowers users to effortlessly convert spoken English recipes into beautifully formatted, step-by-step instructions in both English and Sinhalese.

### Tone of Voice
The application's tone will be casual, friendly, and encouraging, making technology accessible and easy to use.

## 2. Target Audience

**Primary Users:** Home cooks, especially those who are less comfortable with typing or technology. They need a straightforward way to digitise family recipes for personal use or to share with family members who speak Sinhalese.

**User Characteristics:**
- May have limited technical expertise
- Prefer voice interaction over typing
- Need to preserve family recipes
- Want to share recipes across language barriers
- Value simplicity and ease of use

## 3. Goals & Objectives

1. **Frictionless Voice Experience:** Provide a seamless voice-to-text experience for recipe dictation
2. **Intelligent Rephrasing:** Accurately rephrase unstructured, dictated text into logical, numbered cooking instructions
3. **Quality Translation:** Deliver high-quality, contextually appropriate translation from English to Sinhalese
4. **Zero Technical Expertise:** Ensure the entire user journey requires no technical knowledge
5. **Intuitive Interface:** Create an interface that guides users naturally through the process

## 4. Core Features & User Flow

### Three-Step Process: Transcribe → Rephrase → Translate

#### User Flow:
1. **Start:** User navigates to the application and sees a clean interface with a prominent "Start Recording" button
2. **Record:** User clicks the button, grants microphone permissions, and dictates their recipe in English
3. **Process:** User clicks "Finish" and the application processes the audio via Groq API
4. **Display:** Interface updates to show four distinct sections:
   - **Raw Transcription:** Original, unedited text transcribed from audio
   - **English Recipe:** Structured format with generated recipe name, separate ingredients list and numbered step-by-step instructions (editable)
   - **Sinhalese Recipe:** Same structured format translated into Sinhalese with recipe name, ingredients and instructions
   - **Quick Actions:** Copy and share functionality for each section
5. **Edit (Optional):** User can edit the English recipe name, ingredients, or instructions and re-translate to Sinhalese

### Key Features:
- **Voice Recording:** Browser-based audio capture with visual feedback
- **Real-time Processing:** Immediate feedback during recording
- **Structured Recipe Format:** Automatic separation of ingredients from cooking instructions
- **Multi-language Output:** Simultaneous English and Sinhalese results with consistent formatting
- **Clean Results Display:** Well-organized sections for ingredients, instructions, and actions
- **Copy/Share Functionality:** Easy sharing of complete recipes or individual sections, with options to copy both languages together
- **Intelligent Recipe Naming:** Automatic generation of descriptive recipe names based on ingredients and cooking method
- **Recipe Editing:** Interactive editing of English recipe components with automatic re-translation to Sinhalese
- **Error Correction:** Users can fix transcription errors, adjust ingredients, or modify cooking steps before finalizing

## 5. Technical Specifications

### Frontend Architecture
- **Framework:** Vue.js 3 with Composition API
- **Styling:** Tailwind CSS for responsive, modern design
- **Build Tool:** Vite for fast development and optimized builds
- **State Management:** Pinia for application state

### Hosting & Deployment
- **Platform:** Vercel for seamless deployment and hosting
- **Domain:** Custom domain with HTTPS
- **Performance:** Optimized for fast loading and responsive interaction

### External API Integration
- **Transcription:** Groq API with whisper-large-v3 model
- **Processing:** Compound LLM for rephrasing and translation
- **Security:** Secure API key management with environment variables

### Browser Requirements
- **Audio Support:** Web Audio API compatibility
- **Microphone Access:** getUserMedia API support
- **Modern Browsers:** Chrome, Firefox, Safari, Edge (latest versions)

## 6. User Interface Design

### Design Principles
- **Simplicity First:** Minimal cognitive load for users
- **Visual Hierarchy:** Clear progression through the three-step process
- **Accessibility:** WCAG 2.1 AA compliance
- **Mobile-First:** Responsive design for all device sizes

### Key UI Components
1. **Landing Interface:**
   - Large, prominent "Start Recording" button
   - Brief, friendly instructions
   - Clean, uncluttered layout

2. **Recording Interface:**
   - Visual recording indicator
   - Audio level visualization
   - Clear "Finish Recording" button
   - Recording timer

3. **Results Interface:**
   - Three clearly separated sections
   - Copy buttons for each section
   - Option to start new recording
   - Share functionality

### Color Scheme & Typography
- **Primary Colors:** Warm, inviting tones (oranges, warm grays)
- **Typography:** Clean, readable fonts optimized for multilingual content
- **Iconography:** Simple, universally understood icons

## 7. Technical Implementation Details

### Audio Processing
```javascript
// Web Audio API implementation
- MediaRecorder for audio capture
- Real-time audio visualization
- Automatic audio format optimization
- Error handling for microphone permissions
```

### API Integration
```javascript
// Groq API Integration
- Secure authentication with API keys
- Audio file upload and processing
- Error handling and retry logic
- Response parsing and validation
```

### State Management
```javascript
// Application States
- idle: Initial state, ready to record
- recording: Active audio capture
- processing: API calls in progress
- results: Displaying transcription and translation
- error: Error state with user-friendly messages
```

## 8. Recipe Output Format

### Structured Recipe Display
Each processed recipe will be formatted into clearly separated sections:

#### English Recipe Format:
```
[Generated Recipe Name]

Ingredients:
• [Ingredient 1 with quantity]
• [Ingredient 2 with quantity]
• [Additional ingredients...]

Instructions:
1. [First cooking step]
2. [Second cooking step]
3. [Additional steps...]
```

#### Sinhalese Recipe Format:
```
[ජනනය කළ වට්ටෝරුවේ නම]

අමුද්‍රව්‍ය:
• [අමුද්‍රව්‍ය 1 ප්‍රමාණය සමඟ]
• [අමුද්‍රව්‍ය 2 ප්‍රමාණය සමඟ]
• [අමුද්‍රව්‍ය අමතර...]

උපදෙස්:
1. [පළමු පිසීමේ පියවර]
2. [දෙවන පිසීමේ පියවර]
3. [අමතර පියවර...]
```

#### Copy Options:
- **Individual Sections:** Copy raw transcription, English recipe, or Sinhalese recipe separately
- **Combined Recipe:** Copy both English and Sinhalese versions together in a single formatted text
- **Share Functionality:** Native browser sharing with fallback to clipboard

#### Recipe Editing Workflow:
1. **Edit Mode Activation:** User clicks "Edit Recipe" button on English recipe section
2. **Interactive Editing:** Recipe name, ingredients, and instructions become editable text fields/areas
3. **Real-time Validation:** Basic validation ensures proper formatting (non-empty fields, reasonable lengths)
4. **Re-translation Trigger:** User clicks "Update Translation" to re-process the edited English recipe
5. **Automatic Translation:** System translates only the modified English content to Sinhalese
6. **Save Changes:** Updated recipe replaces the original with new Sinhalese translation

## 9. Performance Requirements

### Loading Performance
- **Initial Load:** < 3 seconds on 3G connection
- **API Response:** < 10 seconds for transcription and translation
- **UI Responsiveness:** < 100ms for user interactions

### Audio Quality
- **Sample Rate:** 16kHz minimum for good transcription quality
- **Format:** WebM or MP3 depending on browser support
- **File Size:** Automatic compression for efficient upload

## 9. Security & Privacy

### Data Protection
- **Audio Data:** Temporary storage only, deleted after processing
- **API Keys:** Secure environment variable storage
- **User Privacy:** No persistent storage of personal data
- **HTTPS:** Secure transmission of all data

### Error Handling
- **Microphone Access:** Clear instructions for permission granting
- **Network Issues:** Graceful degradation with retry options
- **API Failures:** User-friendly error messages with suggested actions

## 10. Future Enhancements

### Phase 2 Features
- **Multiple Languages:** Support for additional source languages
- **Recipe Categories:** Automatic categorization of recipes
- **User Accounts:** Save and organize personal recipe collections
- **Social Features:** Share recipes with community
- **Export Options:** PDF, print-friendly formats

### Technical Improvements
- **Offline Support:** Progressive Web App capabilities
- **Advanced Audio:** Noise reduction and audio enhancement
- **Smart Parsing:** Better understanding of cooking terminology
- **Batch Processing:** Multiple recipe processing

## 11. Success Metrics

### User Experience Metrics
- **Task Completion Rate:** > 90% successful recipe transcriptions
- **User Satisfaction:** > 4.5/5 rating for ease of use
- **Time to Complete:** < 2 minutes from start to final recipe
- **Error Rate:** < 5% transcription errors requiring manual correction

### Technical Metrics
- **API Response Time:** < 10 seconds average
- **Uptime:** > 99.5% availability
- **Mobile Usage:** > 60% of traffic from mobile devices
- **Browser Compatibility:** Support for > 95% of target browsers

## 12. Development Timeline

### Phase 1: Core Development (4-6 weeks)
- Week 1-2: Project setup, basic UI, audio recording
- Week 3-4: API integration, transcription functionality
- Week 5-6: Translation, testing, deployment

### Phase 2: Enhancement (2-3 weeks)
- Polish UI/UX based on user feedback
- Performance optimization
- Additional error handling and edge cases

This specification serves as the foundation for building RecipeScribe, ensuring all stakeholders have a clear understanding of the project's scope, requirements, and expected outcomes.
