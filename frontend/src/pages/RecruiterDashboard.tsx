import { Users, TrendingUp, Search, Briefcase } from 'lucide-react';

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
