import { Briefcase, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

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
