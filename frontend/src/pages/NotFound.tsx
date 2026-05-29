import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-slate-200 mb-4">404</div>
        <h1 className="text-2xl font-bold text-slate-900 mb-3">Page not found</h1>
        <p className="text-slate-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => history.back()} className="btn btn-outline">
            <ArrowLeft size={16} /> Go Back
          </button>
          <Link to="/" className="btn btn-primary">
            <Home size={16} /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
