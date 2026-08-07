import { Link } from 'react-router-dom';

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
