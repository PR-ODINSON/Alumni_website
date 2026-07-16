import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useAuthorization } from '../../contexts/AuthorizationContext';
import api from '../../lib/api';

// 1. Refactored ProtectedRoute with Permission and Verification checking
interface ProtectedRouteProps {
  children: React.ReactElement;
  permission?: string;
  requireVerifiedAccount?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  permission,
  requireVerifiedAccount = false,
}) => {
  const { isAuthenticated, user } = useAuthStore();
  const { can, isVerifiedUser } = useAuthorization();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Permission Guard
  if (permission && !can(permission)) {
    return <Navigate to="/" replace />;
  }

  // Verification status Guard
  if (requireVerifiedAccount && !isVerifiedUser) {
    return <Navigate to="/verification-required" replace />;
  }

  return children;
};

// 2. PermissionGuard for component level conditionally rendered UI elements
interface PermissionGuardProps {
  permission: string;
  resource?: any;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  resource,
  fallback = null,
  children,
}) => {
  const { can } = useAuthorization();
  if (!can(permission, resource)) {
    return <>{fallback}</>;
  }
  return <>{children}</>;
};

// 3. VerificationGuard component and user interface
export const VerificationRequiredPage: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const [docUrl, setDocUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const status = user?.verificationStatus || (user?.isVerified ? 'verified' : 'pending');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docUrl.trim()) return setError('Please enter a valid document link or file path.');
    
    setSubmitting(true);
    setError('');
    try {
      const response = await api.post('/verification/submit', {
        documents: [docUrl],
      });
      if (response.data?.success) {
        setSuccess(true);
        if (user) {
          updateUser({ verificationStatus: 'under_review' });
        }
      } else {
        setError(response.data?.message || 'Submission failed.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during submission.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-slate-100">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 mb-6 mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-center text-slate-50 mb-2">Account Verification Required</h2>
        
        <p className="text-slate-400 text-center text-sm mb-6">
          To maintain portal security, posting jobs, events, research papers, and list startups requires college verification.
        </p>

        <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800/80 mb-6 text-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-400">Current Status:</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              status === 'under_review' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
              status === 'rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
              status === 'suspended' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
              'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}>
              {status.toUpperCase().replace('_', ' ')}
            </span>
          </div>
          <p className="text-slate-500 text-xs">
            {status === 'under_review' && 'Your documents are being reviewed by administrators. This usually takes 24-48 hours.'}
            {status === 'pending' && 'Please submit graduation proof, registration details, or student ID below.'}
            {status === 'rejected' && 'Previous submission was rejected. Please upload correct documentation to retry.'}
          </p>
        </div>

        {status !== 'under_review' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {success ? (
              <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl p-4 text-center text-sm">
                Verification request submitted successfully! Your account status is now Under Review.
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Document URL or File Link (e.g. ID card image, Degree Certificate)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="https://drive.google.com/file/d/..."
                    value={docUrl}
                    onChange={(e) => setDocUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                {error && <p className="text-red-500 text-xs">{error}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-slate-50 font-semibold py-3 rounded-xl transition-all shadow-lg hover:shadow-indigo-500/20 text-sm"
                >
                  {submitting ? 'Submitting...' : 'Submit Verification Docs'}
                </button>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
