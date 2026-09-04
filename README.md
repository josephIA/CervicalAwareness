# Cervical Cancer Awareness System

## Description
A comprehensive web-based platform for cervical cancer education, awareness, and support. The system provides evidence-based information about prevention, screening, HPV vaccination, symptoms, diagnosis, and treatment options.

## Features

### Public Features
- **Educational Content**: Comprehensive information organized by categories
- **Interactive Quizzes**: Knowledge assessment and learning tools
- **Search Functionality**: Easy content discovery
- **Responsive Design**: Works on all devices
- **Support Resources**: Links to support groups and organizations
- **FAQ Section**: Answers to common questions
- **About Page**: Information about the organization

### Admin Features (Future)
- Content Management System (CMS)
- User Management
- Analytics Dashboard
- Feedback Management
- Content Moderation

## Project Structure

```
Awareness System/
├── index.html           # Homepage
├── quiz.html           # Quiz page
├── about.html          # About page
├── faq.html            # FAQ page
├── disclaimer.html     # Disclaimer page
├── server.js           # Main Express server
├── server-simple.js    # Simple Node.js HTTP server
├── package.json        # Project dependencies
├── .env.example        # Environment variables template
│
├── config/             # Configuration files
│   └── database.js     # Database connection
│
├── middleware/         # Express middleware
│   ├── errorMiddleware.js
│   └── authMiddleware.js
│
├── models/             # Data models
│   ├── UserModel.js
│   ├── ContentModel.js
│   └── QuizModel.js
│
├── controllers/        # Business logic
│   ├── AuthController.js
│   ├── ContentController.js
│   ├── SearchController.js
│   └── QuizController.js
│
├── routes/             # API routes
│   ├── authRoutes.js
│   ├── categoryRoutes.js
│   ├── contentRoutes.js
│   ├── searchRoutes.js
│   ├── quizRoutes.js
│   └── reportRoutes.js
│
├── public/             # Frontend assets
│   ├── index.html
│   ├── quiz.html
│   ├── css/
│   └── js/
│
├── admin/              # Admin panel (future)
│
└── database/           # Database files
    ├── schema.sql      # Database schema
    └── seed.sql        # Sample data
```

## Technology Stack

### Frontend
- HTML5
- CSS3
- JavaScript (Vanilla)
- Responsive Design

### Backend
- Node.js
- Express.js
- MySQL/MySQL2
- Session Management
- Rate Limiting
- Security (Helmet, bcrypt)

### Database
- MySQL
- Tables: Users, Categories, Content, Quizzes, Questions, Answers, Responses, Admin, Feedback

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm
- MySQL Server
- Git

### Setup Steps

1. **Clone the repository**
```bash
cd "Awareness System"
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file**
```bash
cp .env.example .env
```

4. **Configure environment variables**
Edit `.env` with your settings:
```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=cervical_cancer_awareness
SESSION_SECRET=your_secret_key
```

5. **Create database**
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

6. **Start the server**
```bash
npm start
# or for development with auto-reload:
npm run dev
```

7. **Access the application**
Open your browser and navigate to `http://localhost:3000`

## Usage

### For Users
1. Visit the homepage to explore categories
2. Navigate through educational content
3. Take quizzes to test knowledge
4. Register for a personalized experience
5. Access support resources

### For Administrators
1. Login to admin dashboard (future feature)
2. Manage categories and content
3. Create and manage quizzes
4. View user statistics
5. Moderate feedback

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Content
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category details
- `GET /api/content/:id` - Get specific content

### Search
- `GET /api/search?query=` - Search content

### Quiz
- `GET /api/quiz/quizzes` - Get all quizzes
- `GET /api/quiz/:id` - Get specific quiz
- `POST /api/quiz/submit` - Submit quiz responses
- `GET /api/quiz/scores/user` - Get user's quiz scores

## Database Schema

### Users Table
- id, email, password_hash, name, created_at, updated_at

### Categories Table
- id, name, description, icon, color, created_at, updated_at

### Content Table
- id, category_id, title, description, content, author, image_url, views, created_at, updated_at

### Quizzes Table
- id, title, description, category_id, difficulty_level, passing_score, created_at, updated_at

### Quiz Questions & Answers
- Question and answer relationship for quiz structure

## Security Features
- Password hashing with bcryptjs
- Session management with express-session
- Rate limiting on API endpoints
- Security headers with Helmet
- Input validation and sanitization
- SQL injection prevention

## Browser Compatibility
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Responsive Design
- Mobile-first approach
- Breakpoints at 768px, 1024px, 1200px
- Touch-friendly interface

## Future Enhancements
- User profiles and personalization
- Email notifications
- Video content support
- Mobile application
- Multi-language support
- Advanced analytics
- AI-powered chatbot
- Integration with healthcare providers

## Contributing
Contributions are welcome! Please follow standard Git workflow and submit pull requests.

## Support
For support, email: info@cervicalcancerawareness.com

## License
This project is licensed under the MIT License - see LICENSE file for details.

## Disclaimer
This website provides educational information only and is not a substitute for professional medical advice. Always consult with healthcare providers for medical decisions.

## Authors
- **Development Team**: Copilot
- **Medical Advisors**: Healthcare professionals
- **Contributors**: Community reviewers

## Last Updated
September 1, 2024

---

For more information, visit the project's About page or contact us through the website.
