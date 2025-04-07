# Tab Finder Chrome Extension

A powerful Chrome extension that helps you find tabs using natural language descriptions with AI assistance.

## Features

- 🔍 Natural language search for tabs
- 🤖 AI-powered search assistance
- ⚡ Fast and efficient tab switching
- 🎨 Beautiful and intuitive interface
- 🌙 Dark mode support
- 📱 Responsive design

## Installation

### From Chrome Web Store
1. Visit the [Chrome Web Store](https://chrome.google.com/webstore/detail/tab-finder/your-extension-id)
2. Click "Add to Chrome"
3. Confirm the installation

### Development Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/tab-finder.git
   cd tab-finder
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Create a `.env.local` file in the root directory
   - Add the following variables:
     ```
     # Hugging Face API
     HUGGING_FACE_API_KEY=your_api_key_here
     HUGGING_FACE_ENDPOINT=https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2
     
     # Public variables (accessible in the browser)
     NEXT_PUBLIC_API_BASE_URL=https://your-vercel-app.vercel.app
     ```
   - Replace `your_api_key_here` with your actual Hugging Face API key
   - Replace `your-vercel-app.vercel.app` with your actual Vercel app URL
4. Build the extension:
   ```bash
   npm run build
   ```
5. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` directory

## Development

### Prerequisites
- Node.js 16+
- npm or pnpm
- Chrome browser
- Hugging Face API key

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

### Project Structure

```
src/
├── components/     # React components
├── config/        # Configuration files
├── services/      # Business logic services
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
└── hooks/         # Custom React hooks
```

## Deployment

### Backend (Vercel)

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Set up environment variables in Vercel:
   - `HUGGING_FACE_API_KEY`: Your Hugging Face API key
   - `HUGGING_FACE_ENDPOINT`: Hugging Face API endpoint
4. Deploy the Next.js app to Vercel
5. Update the `proxyUrl` in your popup.js file with your Vercel app URL

### Chrome Web Store

1. Create a Chrome Web Store Developer account
2. Prepare your extension for submission:
   - Update the version number in manifest.json
   - Create high-quality screenshots
   - Write a compelling description
3. Submit your extension for review

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please:
1. Check the [documentation](https://your-website.com/docs)
2. Open an issue in the GitHub repository
3. Contact us at support@your-website.com

## Acknowledgments

- Thanks to all contributors
- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Styling with [Tailwind CSS](https://tailwindcss.com/) 