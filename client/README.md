# TaskMind AI - Frontend

React-based frontend application for TaskMind AI with Tailwind CSS styling.

## Features

- ✅ Task input form with validation
- 📋 Task list with status management
- 🧠 AI-powered daily plan generation
- 📊 Real-time stress level analysis
- ⏰ Task delay simulation
- 🎨 Clean, responsive UI with Tailwind CSS

## Prerequisites

- Node.js 16+ and npm
- Backend server running on port 3001

## Installation

1. Install dependencies:
```bash
cd client
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Configure API URL in `.env` (optional):
```
REACT_APP_API_URL=http://localhost:3001/api
```

## Running the Application

### Development Mode

```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## Project Structure

```
client/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── components/         # React components
│   │   ├── TaskForm.jsx    # Task input form
│   │   ├── TaskList.jsx    # Task list display
│   │   ├── DailyPlan.jsx   # Daily plan viewer
│   │   └── StressIndicator.jsx  # Stress level display
│   ├── services/
│   │   └── api.js          # API integration with axios
│   ├── App.jsx             # Main application component
│   ├── index.js            # Application entry point
│   └── index.css           # Global styles with Tailwind
├── package.json
├── tailwind.config.js      # Tailwind configuration
└── postcss.config.js       # PostCSS configuration
```

## Components

### TaskForm
- Add new tasks with title, description, priority, duration, and deadline
- Form validation and error handling
- Real-time feedback

### TaskList
- Display all tasks with status badges
- Update task status (pending, in progress, completed, delayed)
- Delete tasks
- Simulate delays
- Color-coded priority indicators

### DailyPlan
- Generate AI-powered daily schedule
- View tasks organized by time slots (morning, afternoon, evening)
- See AI recommendations
- Plan summary and statistics

### StressIndicator
- Real-time stress level visualization
- Color-coded stress levels (low, medium, high, critical)
- Stress factors breakdown
- Task statistics
- Personalized recommendations

## API Integration

The frontend communicates with the backend API using axios:

- `GET /api/tasks` - Fetch all tasks
- `POST /api/tasks` - Create new task
- `PATCH /api/tasks/:id/status` - Update task status
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/generate-plan` - Generate daily plan
- `POST /api/tasks/:id/simulate-delay` - Simulate task delay
- `GET /api/tasks/stress-analysis` - Get stress analysis

## Styling

The application uses Tailwind CSS for styling:

- Responsive design (mobile-first)
- Custom color palette
- Smooth transitions and animations
- Accessible UI components

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Tips

1. **Hot Reload**: Changes are automatically reflected in the browser
2. **Console Logs**: Check browser console for API errors
3. **Network Tab**: Monitor API requests in browser DevTools
4. **React DevTools**: Install React DevTools extension for debugging

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000
```

### API Connection Issues
- Ensure backend server is running on port 3001
- Check CORS configuration in backend
- Verify API URL in `.env` file

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## License

MIT License - Built for IBM Hackathon 2026