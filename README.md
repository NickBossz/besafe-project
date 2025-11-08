# 🛡️ BE SAFE - Digital Security Platform

[![React](https://img.shields.io/badge/React-18.0.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16.0.0-green.svg)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.8+-yellow.svg)](https://python.org/)
[![License](https://img.shields.io/badge/License-MIT-red.svg)](LICENSE)

A complete digital security platform with a hacker theme, offering URL verification, file analysis, discussion forum, and security tips.

## 🚀 Features

### 🔍 **Checker App**
- **URL Verification**: Security analysis using VirusTotal and AI
- **File Verification**: Malware detection with intelligent scoring system
- **Modern Interface**: Drag & drop for file uploads
- **Detailed Results**: Complete reports with explanations

### 💬 **Security Forum**
- **Site Reviews**: Category system (Positive, Negative, Warning)
- **Advanced Filters**: Search by site, category, and sorting
- **Voting System**: Like/Dislike on posts
- **Responsive Interface**: Works perfectly on mobile

### 💡 **Security Tips**
- **Educational Content**: Practical digital security tips
- **Interactive Interface**: Modern and intuitive design
- **Categorization**: Organization by security themes

### 👤 **User System**
- **Registration and Login**: Complete authentication system
- **Custom Profiles**: Profile picture upload
- **Activity History**: User posts and interactions

## 🛠️ Technologies Used

### **Frontend**
- **React 18** - Main framework
- **Framer Motion** - Smooth animations
- **React Router** - Navigation
- **React Hot Toast** - Notifications
- **Lucide React** - Modern icons
- **CSS Modules** - Modular styling

### **Backend**
- **Node.js** - JavaScript server
- **Express.js** - Web framework
- **Supabase (PostgreSQL)** - Cloud database
- **Supabase JS Client** - Database client
- **Python** - Analysis scripts
- **VirusTotal API** - Security verification

### **External APIs**
- **VirusTotal** - URL and file analysis
- **Machine Learning** - Risk prediction

## 📦 Installation

### Prerequisites
- Node.js 16+
- Python 3.8+
- npm or yarn
- A Supabase account ([sign up here](https://supabase.com))

### 1. Clone the repository
```bash
git clone https://github.com/your-username/be-safe.git
cd be-safe
```

### 2. Install all dependencies
```bash
npm run install:all
```

Or install manually:

```bash
# Root dependencies
npm install

# Frontend dependencies
cd frontend
npm install

# Backend dependencies
cd ../backend
npm install
```

### 3. Set up Supabase

Follow the detailed guide in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) to:
1. Create a Supabase project
2. Run the database schema
3. Get your API keys

### 4. Configure environment variables

**Backend** (`.env` in `backend` folder):
```env
# VirusTotal API
VIRUSTOTAL_API_KEY=your_virustotal_api_key_here

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_supabase_service_role_key_here

# Server
PORT=8080
```

**Frontend** (`.env` in `frontend` folder):
```env
VIRUSTOTAL_API_KEY=your_virustotal_api_key_here
REACT_APP_API_URL=http://localhost:8080
```

### 5. Run the project

**Development mode (both frontend and backend):**
```bash
npm run dev
```

**Or run separately:**

**Terminal 1 - Backend:**
```bash
npm run dev:backend
```

**Terminal 2 - Frontend:**
```bash
npm run dev:frontend
```

The project will be available at `http://localhost:3000`

## 🎨 Design Features

### **Hacker Theme**
- **Neon Colors**: Green (#00ff00), Cyan (#00ffff), Magenta (#ff00ff)
- **Typography**: Courier New for terminal effect
- **Visual Effects**: Scanlines, particles, gradients
- **Animations**: Smooth and responsive transitions

### **Responsive Interface**
- **Desktop**: Full layout with sidebar
- **Tablet**: Automatic adaptation
- **Mobile**: Hamburger menu and optimized layout

## 🔧 Project Structure

```
be-safe-monorepo/
├── frontend/                     # React Frontend
│   ├── src/
│   │   ├── pages/                # Page components
│   │   │   ├── checkerapp/       # URL/File checker
│   │   │   ├── forum/            # Discussion forum
│   │   │   ├── dicas/            # Security tips
│   │   │   ├── perfil/           # User profile
│   │   │   ├── login/            # Login system
│   │   │   └── menu/             # Navigation menu
│   │   ├── App.js                # Main component
│   │   └── UserTypeContext.js    # User context
│   ├── public/                   # Static files
│   └── package.json
├── backend/                      # Node.js Backend
│   ├── CRUDS/                    # Database operations
│   │   ├── CrudPosts.js          # Posts CRUD
│   │   └── CrudUsuarios.js       # Users CRUD
│   ├── servidor.js               # Main server
│   ├── SiteChecker.py            # Python script
│   └── package.json
├── package.json                  # Root package.json (monorepo)
├── vercel.json                   # Vercel configuration
└── README.md                     # This file
```

## 🚀 How to Use

### **URL Verification**
1. Access "Checker App"
2. Select "Verify URL"
3. Paste the suspicious URL
4. Wait for analysis
5. View detailed report

### **File Verification**
1. Access "Checker App"
2. Select "Verify File"
3. Drag and drop the file (max. 50MB)
4. Wait for VirusTotal analysis
5. View security score

### **Forum**
1. Access "Forum"
2. Use filters to find posts
3. Create a new post
4. Vote on other users' posts

## 🔒 Security

- **Input Validation**: All data is validated
- **Sanitization**: XSS and injection protection
- **Rate Limiting**: Spam protection
- **HTTPS**: Recommended for production

## 🌐 Deployment on Vercel

### Quick Deploy

1. **Set up Supabase** (if not done already):
   - Follow [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
   - Make sure your database schema is created

2. **Push your code to GitHub**

3. **Import the project on Vercel**:
   - Vercel will automatically detect the monorepo structure

4. **Add environment variables** in Vercel dashboard:

   **Backend Environment Variables:**
   - `VIRUSTOTAL_API_KEY`: Your VirusTotal API key
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_SERVICE_KEY`: Your Supabase service role key

   **Frontend Environment Variables:**
   - `VIRUSTOTAL_API_KEY`: Your VirusTotal API key
   - `REACT_APP_API_URL`: Your backend API URL (e.g., `https://your-project.vercel.app/api`)

5. **Deploy!**

### Manual Configuration

If needed, ensure `vercel.json` is properly configured (already included).

### Important Notes for Production

- Make sure your Supabase project is active and not paused
- Enable Row Level Security (RLS) policies in production
- Consider implementing password hashing (bcrypt) before deployment
- Set up proper CORS origins instead of allowing all (`*`)

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is under the MIT license. See the [LICENSE](LICENSE) file for more details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@your-username](https://github.com/your-username)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/your-profile)

## 🙏 Acknowledgments

- **VirusTotal** for the security analysis API
- **React Team** for the amazing framework
- **Open Source Community** for all the libraries used

## 📊 Project Status

![GitHub last commit](https://img.shields.io/github/last-commit/your-username/be-safe)
![GitHub issues](https://img.shields.io/github/issues/your-username/be-safe)
![GitHub pull requests](https://img.shields.io/github/issues-pr/your-username/be-safe)
![GitHub stars](https://img.shields.io/github/stars/your-username/be-safe)

---

⭐ **If this project helped you, consider giving it a star!**
