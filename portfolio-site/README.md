# Joshua Greco Portfolio Site

A modern, interactive personal portfolio site built with React and Tailwind CSS.

## Features

- Full-screen vertical sections with scroll animations
- Futuristic holographic design elements
- Interactive elements powered by Framer Motion
- Responsive layout for all devices
- Smooth scrolling between sections

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or newer)
- npm (comes with Node.js) or [uv package manager](https://github.com/astral-sh/uv)

## Getting Started

Follow these steps to run the project locally:

### Installation with npm

1. Clone or download this repository
2. Navigate to the project directory:
   ```
   cd portfolio-site
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm start
   ```
5. Open your browser and visit:
   ```
   http://localhost:3000
   ```

### Installation with uv (alternative)

If you prefer using uv package manager:

1. Install uv (if not already installed):
   ```
   pip install uv
   ```
2. Navigate to the project directory:
   ```
   cd portfolio-site
   ```
3. Create and activate a virtual environment:
   ```
   uv venv
   ```
4. Install dependencies:
   ```
   uv pip install -r requirements.txt
   ```
5. Start the development server:
   ```
   npm start
   ```

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- Framer Motion
- React Scroll
- React Icons

## Project Structure

- `src/components/` - Individual section components
- `src/App.tsx` - Main application component
- `src/index.css` - Global styles and Tailwind directives
- `tailwind.config.js` - Tailwind configuration

## Customization

Feel free to customize the content, colors, and styles to fit your personal brand:

- Update personal information in each component
- Modify colors in tailwind.config.js
- Add or remove sections in App.tsx

## Build for Production

To create an optimized production build:

```
npm run build
```

The build files will be located in the `build` directory.

## License

This project is open source and available under the [MIT License](LICENSE).
