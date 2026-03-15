# 🎓 American University of Yangon - Student Portal

A stunning, world-class student portal built with React, TypeScript, Tailwind CSS, and Framer Motion. Features an ultra-modern, Apple-inspired UI with advanced glassmorphism, smooth animations, and pixel-perfect polish.

![Student Portal Preview](https://via.placeholder.com/1200x600/3B82F6/FFFFFF?text=Student+Portal)

## ✨ Features

- **Beautiful Glassmorphic UI** - Modern Apple-inspired design with blur effects, gradients, and smooth animations
- **Real-time Data** - Connects to Google Sheets via SheetDB for live data updates
- **Secure Login** - Simple authentication system using email and password
- **Personalized Dashboard** - Shows only data relevant to the logged-in student
- **5 Main Sections**:
  - 📊 **Dashboard** - GPA, credits, attendance stats, today's schedule, upcoming deadlines
  - 📚 **Courses** - Enrolled courses with grades, attendance, and details
  - 📄 **Materials** - Course materials with search and filter
  - 📅 **Schedule** - Weekly calendar view of classes
  - 📢 **Announcements** - Notifications with read/unread tracking
- **Fully Responsive** - Works beautifully on desktop, tablet, and mobile
- **Offline Support** - Works with mock data when API is not configured

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd student-portal

# Install dependencies
npm install

# Start development server
npm run dev
```

### 2. Try the Demo

The app works immediately with built-in mock data. Use these credentials:

- **Email:** `aung.khant.phyo@student.au.edu.mm`
- **Password:** `student123`

Or try other demo accounts:
- `su.myat.mon@student.au.edu.mm` / `student456`
- `thant.zin.oo@student.au.edu.mm` / `student789`

## 📊 Google Sheets Setup (Optional)

To connect your own Google Sheets backend:

### Step 1: Create Google Sheets

Create a Google Spreadsheet with these sheets (tabs):

#### Users Sheet
| id | email | password | role | createdAt |
|----|-------|----------|------|-----------|
| U001 | student@example.com | password123 | student | 2024-01-15 |

#### Students Sheet
| studentId | email | firstName | lastName | dateOfBirth | gender | phone | address | city | country | major | minor | enrollmentDate | expectedGraduation | gpa | totalCredits | academicStanding | advisorName | advisorEmail | profileImage |
|-----------|-------|-----------|----------|-------------|--------|-------|---------|------|---------|-------|-------|----------------|-------------------|-----|--------------|------------------|-------------|--------------|--------------|

#### Courses Sheet
| courseId | courseCode | courseName | description | credits | department | instructor | instructorEmail | semester | year | schedule | room | building | maxEnrollment | currentEnrollment | googleClassroomLink | syllabusLink | status |
|----------|------------|------------|-------------|---------|------------|------------|-----------------|----------|------|----------|------|----------|---------------|-------------------|---------------------|--------------|--------|

#### Enrollments Sheet
| enrollmentId | studentId | courseId | enrollmentDate | status | grade | gradePoints | midtermGrade | finalGrade | assignmentScore | quizScore | participationScore |
|--------------|-----------|----------|----------------|--------|-------|-------------|--------------|------------|-----------------|-----------|-------------------|

#### AttendanceSummary Sheet
| attendanceId | studentId | courseId | totalClasses | classesAttended | classesAbsent | classesExcused | attendancePercentage | lastUpdated |
|--------------|-----------|----------|--------------|-----------------|---------------|----------------|---------------------|-------------|

#### Materials Sheet
| materialId | courseId | title | description | type | fileLink | fileSize | uploadedBy | uploadDate | weekNumber | tags | isRequired | dueDate |
|------------|----------|-------|-------------|------|----------|----------|------------|------------|------------|------|------------|---------|

#### Schedule Sheet
| scheduleId | courseId | dayOfWeek | startTime | endTime | room | building | type | instructor | isRecurring | notes |
|------------|----------|-----------|-----------|---------|------|----------|------|------------|-------------|-------|

#### Deadlines Sheet
| deadlineId | courseId | title | description | dueDate | dueTime | type | weight | status | submissionLink | maxScore |
|------------|----------|-------|-------------|---------|---------|------|--------|--------|----------------|----------|

#### Announcements Sheet
| announcementId | courseId | title | content | author | authorRole | publishDate | priority | targetAudience | expiryDate | attachmentLink | category |
|----------------|----------|-------|---------|--------|------------|-------------|----------|----------------|------------|----------------|----------|

#### StudentNotifications Sheet
| notificationId | studentId | announcementId | isRead | readAt | isArchived |
|----------------|-----------|----------------|--------|--------|------------|

### Step 2: Set up SheetDB

1. Go to [SheetDB.io](https://sheetdb.io/)
2. Create a free account
3. Click "Create new API"
4. Paste your Google Sheets URL
5. Copy the API URL (e.g., `https://sheetdb.io/api/v1/xxxxx`)

### Step 3: Configure Environment Variables

Create a `.env` file in the project root:

```env
VITE_SHEETDB_URL=https://sheetdb.io/api/v1/your-api-id
VITE_POLL_INTERVAL=30000
```

### Step 4: Make Sheet Public

In Google Sheets:
1. Click "Share"
2. Change to "Anyone with the link can view"
3. Copy the link

## 🔐 Security Notes

### Current Implementation (Demo/Development)

- Passwords are stored in plain text in the Users sheet
- Authentication is client-side only
- Data is transmitted over HTTPS (encrypted in transit)

### For Production Use

1. **Hash Passwords**: Use bcrypt or similar before storing
2. **Use Server-Side Auth**: Implement proper backend authentication
3. **Add Rate Limiting**: Prevent brute force attacks
4. **Use Environment Variables**: Never commit API keys

Example password hashing (for reference):
```javascript
// Don't use plain text passwords in production!
// Use bcrypt or similar:
const bcrypt = require('bcryptjs');
const hashedPassword = bcrypt.hashSync('password', 10);
```

## 🎨 Design System

### Color Palette
- **Primary:** Blue (#3B82F6) to Indigo (#6366F1)
- **Success:** Emerald (#10B981)
- **Warning:** Amber (#F59E0B)
- **Error:** Rose (#F43F5E)
- **Neutral:** Slate (#64748B)

### Typography
- **Font:** Inter (with SF Pro Display as fallback)
- **Weights:** 300, 400, 500, 600, 700, 800

### Glassmorphism
- **Background:** rgba(255, 255, 255, 0.7)
- **Blur:** backdrop-blur-xl (24px)
- **Border:** rgba(255, 255, 255, 0.3)

## 📁 Project Structure

```
src/
├── App.tsx                 # Main app component
├── index.css              # Global styles and Tailwind
├── vite-env.d.ts          # TypeScript environment types
├── components/
│   ├── Login.tsx          # Login page
│   ├── Layout.tsx         # Main layout with navigation
│   ├── Dashboard.tsx      # Dashboard page
│   ├── Courses.tsx        # Courses page
│   ├── Materials.tsx      # Materials page
│   ├── Schedule.tsx       # Schedule page
│   ├── Announcements.tsx  # Announcements page
│   └── LoadingSkeleton.tsx # Loading states
├── contexts/
│   ├── AuthContext.tsx    # Authentication state
│   └── DataContext.tsx    # Data fetching and state
├── hooks/
│   ├── useLocalStorage.ts # Local storage hook
│   └── usePolling.ts      # Polling hook
├── services/
│   └── api.ts             # API service
├── data/
│   └── mockData.ts        # Mock data for demo
├── types/
│   └── index.ts           # TypeScript interfaces
└── utils/
    └── helpers.ts         # Utility functions
```

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run type-check

# Lint
npm run lint
```

### Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Icons** - Icons
- **date-fns** - Date formatting

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

```bash
# Or use Vercel CLI
npm i -g vercel
vercel
```

### Netlify

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Add environment variables in Netlify dashboard

### Environment Variables for Deployment

Set these in your deployment platform:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SHEETDB_URL` | SheetDB API URL | `https://sheetdb.io/api/v1/xxx` |
| `VITE_POLL_INTERVAL` | Polling interval (ms) | `30000` |

## 📝 License

MIT License - feel free to use this project for your own university or organization!

## 🙏 Credits

- Design inspired by Apple's Human Interface Guidelines
- Icons from [React Icons](https://react-icons.github.io/react-icons/)
- Avatar generation from [DiceBear](https://www.dicebear.com/)

---

Made with ❤️ for American University of Yangon
