import os

base_dir = "src"

files = {
    "index.css": """@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-slate-50 text-slate-900 font-sans;
  }
}

.glass-panel {
  @apply bg-white/70 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl;
}
""",
    "App.tsx": """import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/candidate" element={<JobSeekerDashboard />} />
            <Route path="/recruiter" element={<RecruiterDashboard />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
""",
    "components/Navbar.tsx": """import { Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="glass-panel sticky top-0 z-50 rounded-none border-b border-white/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 text-primary font-bold text-2xl">
            <Briefcase size={28} />
            <span>AIJobPortal</span>
          </Link>
          <div className="flex gap-4">
            <Link to="/candidate" className="text-slate-600 hover:text-primary transition font-medium">For Candidates</Link>
            <Link to="/recruiter" className="text-slate-600 hover:text-primary transition font-medium">For Recruiters</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
""",
    "pages/Dashboard.tsx": """import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8 animate-fade-in">
      <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
        The Future of Hiring is Here
      </h1>
      <p className="text-lg md:text-2xl text-slate-600 max-w-3xl leading-relaxed">
        AI-powered Job Portal that perfectly matches top talent with world-class companies using deep skills analysis and smart compatibility scoring.
      </p>
      <div className="flex gap-4">
        <Link to="/candidate" className="px-8 py-4 bg-primary text-white rounded-full font-bold shadow-lg hover:shadow-primary/50 transition transform hover:-translate-y-1">
          I am a Job Seeker
        </Link>
        <Link to="/recruiter" className="px-8 py-4 bg-white text-primary border border-primary/20 rounded-full font-bold shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
          I am a Recruiter
        </Link>
      </div>
    </div>
  );
}
""",
    "pages/JobSeekerDashboard.tsx": """import { Briefcase, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export default function JobSeekerDashboard() {
  return (
    <div className="space-y-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Welcome back, Alex!</h1>
        <p className="text-slate-500">Here is your application health and job matches.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 flex flex-col items-center text-center gap-4">
          <div className="w-20 h-20 rounded-full border-4 border-secondary flex items-center justify-center text-2xl font-bold text-secondary">
            85%
          </div>
          <div>
            <h3 className="font-bold text-lg">Application Health Score</h3>
            <p className="text-sm text-slate-500">Your profile is looking great! Add 1 more project to reach 90%.</p>
          </div>
        </div>
        
        <div className="glass-panel p-6 md:col-span-2">
           <h3 className="font-bold text-xl mb-4 flex items-center gap-2"><Briefcase className="text-primary"/> Top Job Match</h3>
           <div className="border border-slate-100 bg-slate-50 rounded-xl p-4">
             <div className="flex justify-between items-start">
               <div>
                 <h4 className="font-bold text-lg text-slate-800">Senior Java Backend Developer</h4>
                 <p className="text-slate-500">TechCorp Inc. • San Francisco, CA</p>
               </div>
               <span className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-sm">92% Match</span>
             </div>
             
             <div className="mt-4">
                <h5 className="font-semibold text-sm mb-2">Skill Gap Analysis (Explainable AI)</h5>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="text-green-500" size={16}/> Matched: Java, Spring Boot, MySQL, REST APIs
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <AlertCircle className="text-amber-500" size={16}/> Missing Critical: Docker
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <AlertCircle className="text-slate-400" size={16}/> Missing Optional: Kubernetes
                  </div>
                </div>
             </div>
             <button className="mt-6 w-full py-2 bg-primary/10 text-primary font-bold rounded-lg hover:bg-primary hover:text-white transition">
               Apply Now
             </button>
           </div>
        </div>
      </div>
      
      <div className="glass-panel p-6">
        <h3 className="font-bold text-xl mb-4">Application Journey Tracker</h3>
        <div className="relative">
           <div className="absolute top-4 left-4 h-full w-0.5 bg-slate-200"></div>
           
           <div className="flex items-start gap-4 mb-6 relative">
             <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center z-10"><CheckCircle2 size={16} /></div>
             <div>
               <h4 className="font-bold text-slate-800">Applied for Software Engineer at InnovateTech</h4>
               <p className="text-sm text-slate-500">2 days ago</p>
             </div>
           </div>
           
           <div className="flex items-start gap-4 mb-6 relative">
             <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center z-10"><FileText size={16} /></div>
             <div>
               <h4 className="font-bold text-slate-800">Resume Viewed</h4>
               <p className="text-sm text-slate-500">1 day ago • Recruiter has seen your profile.</p>
             </div>
           </div>
           
           <div className="flex items-start gap-4 relative">
             <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center z-10"><Briefcase size={16} /></div>
             <div>
               <h4 className="font-bold text-slate-800 text-slate-400">Interview</h4>
               <p className="text-sm text-slate-400">Pending...</p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
""",
    "pages/RecruiterDashboard.tsx": """import { Users, TrendingUp, Search, Briefcase } from 'lucide-react';

export default function RecruiterDashboard() {
  return (
    <div className="space-y-8">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Recruiter Hub</h1>
          <p className="text-slate-500">Manage jobs and review top AI-ranked candidates.</p>
        </div>
        <button className="bg-primary text-white px-6 py-2 rounded-lg font-bold shadow-md hover:bg-blue-700 transition">
          Post New Job
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center"><Briefcase size={24}/></div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Active Jobs</p>
            <h3 className="text-2xl font-bold text-slate-800">12</h3>
          </div>
        </div>
        <div className="glass-panel p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-green-100 text-green-600 flex items-center justify-center"><Users size={24}/></div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Total Applications</p>
            <h3 className="text-2xl font-bold text-slate-800">348</h3>
          </div>
        </div>
        <div className="glass-panel p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center"><TrendingUp size={24}/></div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Time-to-Hire</p>
            <h3 className="text-2xl font-bold text-slate-800">14 Days</h3>
          </div>
        </div>
      </div>

      <div className="glass-panel p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-xl">Explainable Candidate Ranking</h3>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input type="text" placeholder="Search candidates..." className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="border border-slate-100 rounded-xl p-4 bg-white hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-lg">Alex Johnson</h4>
                <p className="text-sm text-slate-500">Applied for Java Backend Developer</p>
              </div>
              <span className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-sm">94% AI Match</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div>
                <span className="text-green-600 font-bold flex items-center gap-1">+ Strong Java experience</span>
                <span className="text-green-600 font-bold flex items-center gap-1">+ 4/5 required technical skills</span>
              </div>
              <div>
                <span className="text-green-600 font-bold flex items-center gap-1">+ Immediate availability</span>
                <span className="text-slate-500 font-medium flex items-center gap-1">- Missing Docker</span>
              </div>
            </div>
          </div>
          
          <div className="border border-slate-100 rounded-xl p-4 bg-white hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-lg">Sarah Williams</h4>
                <p className="text-sm text-slate-500">Applied for Java Backend Developer</p>
              </div>
              <span className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full text-sm">88% AI Match</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div>
                <span className="text-green-600 font-bold flex items-center gap-1">+ Excellent technical match</span>
              </div>
              <div>
                <span className="text-red-500 font-medium flex items-center gap-1">- 60-day notice period</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
"""
}

for filepath, content in files.items():
    full_path = os.path.join(base_dir, filepath)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Frontend files generated with UTF-8 encoding.")
