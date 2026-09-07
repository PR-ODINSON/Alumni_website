import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Printer, Download, Share2, Copy, CheckCircle2, ShieldCheck,
  Edit3, RotateCcw, Search, Sparkles, User, FileText, QrCode, Lock, KeyRound, ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../stores/authStore';
import AlumniICard, { type ICardData } from './components/AlumniICard';
import ICardVerifierModal from './components/ICardVerifierModal';
import CardLoginPage from './CardLoginPage';
import { alumniApi } from '../../lib/api';

interface ICardsPageProps {
  mode?: 'view' | 'login';
}

export default function ICardsPage({ mode }: ICardsPageProps) {
  const { user, isAuthenticated } = useAuthStore();
  const [searchParams] = useSearchParams();

  // If user visits /card/login explicitly or is not authenticated, check login state
  const isExplicitLoginMode = mode === 'login' || searchParams.get('login') === 'true';

  const [cardData, setCardData] = useState<ICardData>({
    fullName: 'PARTH SHAH',
    degree: 'B.Tech Electrical Eng.',
    department: 'Electrical Engineering',
    batch: '2016-2020',
    membershipNo: 'ALUM/IITRAM/2024/0842',
    dateOfIssue: new Date().toLocaleDateString('en-GB'),
    membershipType: 'LIFE MEMBER',
    photoUrl: '',
    email: 'alumni@iitram.ac.in',
    bloodGroup: 'O+',
  });

  const [isFlipped, setIsFlipped] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [directoryResults, setDirectoryResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  // Populate card details from logged in user if available
  useEffect(() => {
    if (user) {
      const full = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'PARTH SHAH';
      const year = user.role === 'alumni' ? '2018-2022' : '2020-2024';
      
      setCardData({
        fullName: full.toUpperCase(),
        degree: user.role === 'faculty' ? 'Ph.D. Professor' : 'B.Tech / M.Tech',
        department: (user as any).department || 'Electrical Engineering',
        batch: (user as any).graduationYear || '2018-2022',
        membershipNo: `ALUM/IITRAM/${new Date().getFullYear()}/${user._id.slice(-4).toUpperCase() || '0842'}`,
        dateOfIssue: new Date().toLocaleDateString('en-GB'),
        membershipType: 'LIFE MEMBER',
        photoUrl: user.avatar || '',
        email: user.email || 'alumni@iitram.ac.in',
        phone: user.phone || '',
        bloodGroup: 'B+',
      });
    }
  }, [user]);

  // Handle directory search for cards
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await alumniApi.getAll({ search: searchQuery, limit: 5 });
      setDirectoryResults(res.data.data?.alumni || res.data.data || []);
    } catch {
      toast.error('Could not fetch directory cards');
    } finally {
      setSearching(false);
    }
  };

  const loadAlumniCard = (member: any) => {
    const full = `${member.user?.firstName || member.firstName || ''} ${member.user?.lastName || member.lastName || ''}`.trim() || 'ALUMNI MEMBER';
    setCardData({
      fullName: full.toUpperCase(),
      degree: member.degree || member.user?.degree || 'B.Tech',
      department: member.department || member.user?.department || 'Civil Engineering',
      batch: member.graduationYear ? `${member.graduationYear}` : '2019-2023',
      membershipNo: `ALUM/IITRAM/2024/${(member._id || member.id || '999').slice(-4).toUpperCase()}`,
      dateOfIssue: new Date().toLocaleDateString('en-GB'),
      membershipType: 'LIFE MEMBER',
      photoUrl: member.user?.avatar || member.avatar || '',
      email: member.user?.email || member.email || 'alumni@iitram.ac.in',
      bloodGroup: 'A+',
    });
    toast.success(`Loaded I-Card for ${full}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadArtwork = () => {
    toast.success('Preparing high-resolution print artwork download...');
    setTimeout(() => {
      window.print();
    }, 500);
  };

  // If user is not authenticated or explicitly visiting /card/login while logged out
  if (!isAuthenticated && isExplicitLoginMode) {
    return <CardLoginPage />;
  }

  // If not logged in at all when visiting /icards, show login portal
  if (!isAuthenticated) {
    return <CardLoginPage />;
  }

  return (
    <div className="min-h-screen bg-slate-50/70 pb-16 pt-4">
      {/* ── PRINT-ONLY STYLING ────────────────────────────────────────────── */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* ── TOP HERO HEADER ──────────────────────────────────────────────── */}
        <div className="no-print bg-gradient-to-r from-[#7A152B] via-[#630f21] to-[#450916] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C59B27]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-[#C59B27]/20 border border-[#C59B27]/40 rounded-full text-amber-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck size={14} /> IITRAM Official Identity
                </span>
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-[11px] font-bold">
                  Verified Member
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black font-serif tracking-tight text-white uppercase">
                Digital Alumni I-Card
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 max-w-xl leading-relaxed">
                Official Digital Identity Card issued by the IITRAM Alumni Association. Use this for alumni events, campus entry access, and verification.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2.5 bg-white text-[#7A152B] hover:bg-slate-100 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Printer size={15} />
                <span>Print Card</span>
              </button>

              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2.5 bg-[#C59B27] hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Edit3 size={15} />
                <span>{isEditing ? 'Close Editor' : 'Customize Details'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowVerifyModal(true)}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
              >
                <QrCode size={15} className="text-amber-300" />
                <span>QR Verification</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── CARD DISPLAY & CUSTOMIZER GRID ───────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Card View Box */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm print-area">
              <div className="flex items-center justify-between mb-4 no-print">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles size={16} className="text-[#7A152B]" /> Live Identity Card Preview
                </h3>
                <span className="text-xs text-slate-400 font-medium">Standard CR80 ID Card Specs</span>
              </div>

              {/* Exact Replica Alumni I-Card */}
              <AlumniICard
                data={cardData}
                isFlipped={isFlipped}
                onFlip={() => setIsFlipped(!isFlipped)}
                onOpenVerify={() => setShowVerifyModal(true)}
              />
            </div>

            {/* Toolbar under card */}
            <div className="no-print flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs text-xs font-medium text-slate-600">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-800 font-bold transition-colors cursor-pointer"
                >
                  Flip Card ({isFlipped ? 'Back' : 'Front'})
                </button>
                <button
                  type="button"
                  onClick={handleDownloadArtwork}
                  className="flex items-center gap-1.5 text-brand-600 hover:text-brand-700 font-bold cursor-pointer"
                >
                  <Download size={14} /> Download Image
                </button>
              </div>

              <span className="text-slate-400 text-[11px]">
                Membership ID: <strong className="text-slate-800 font-mono">{cardData.membershipNo}</strong>
              </span>
            </div>
          </div>

          {/* Right Column: Customizer & Directory Lookup */}
          <div className="no-print lg:col-span-5 space-y-6">
            
            {/* Customizer Panel */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-display">Card Details Editor</h3>
                  <p className="text-xs text-slate-500">Update fields for preview or custom printing</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (user) {
                      setCardData({
                        fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim().toUpperCase(),
                        degree: 'B.Tech Electrical Eng.',
                        department: (user as any).department || 'Electrical Engineering',
                        batch: (user as any).graduationYear || '2018-2022',
                        membershipNo: `ALUM/IITRAM/2024/${user._id.slice(-4).toUpperCase()}`,
                        dateOfIssue: new Date().toLocaleDateString('en-GB'),
                        membershipType: 'LIFE MEMBER',
                        photoUrl: user.avatar || '',
                        email: user.email || 'alumni@iitram.ac.in',
                        bloodGroup: 'B+',
                      });
                      toast.success('Reset to account default profile');
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                  title="Reset to default profile"
                >
                  <RotateCcw size={16} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[#7A152B] font-bold uppercase tracking-wider mb-1">Full Name</label>
                  <input
                    type="text"
                    value={cardData.fullName}
                    onChange={(e) => setCardData({ ...cardData, fullName: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold uppercase focus:bg-white focus:border-[#7A152B] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 font-bold uppercase tracking-wider mb-1">Degree</label>
                    <input
                      type="text"
                      value={cardData.degree}
                      onChange={(e) => setCardData({ ...cardData, degree: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:bg-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-bold uppercase tracking-wider mb-1">Batch</label>
                    <input
                      type="text"
                      value={cardData.batch}
                      onChange={(e) => setCardData({ ...cardData, batch: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:bg-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-bold uppercase tracking-wider mb-1">Department</label>
                  <select
                    value={cardData.department}
                    onChange={(e) => setCardData({ ...cardData, department: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:bg-white outline-none"
                  >
                    <option value="Electrical Engineering">Electrical Engineering</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 font-bold uppercase tracking-wider mb-1">Membership No.</label>
                    <input
                      type="text"
                      value={cardData.membershipNo}
                      onChange={(e) => setCardData({ ...cardData, membershipNo: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] font-bold focus:bg-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-bold uppercase tracking-wider mb-1">Membership Type</label>
                    <select
                      value={cardData.membershipType}
                      onChange={(e) => setCardData({ ...cardData, membershipType: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-[#7A152B] focus:bg-white outline-none"
                    >
                      <option value="LIFE MEMBER">LIFE MEMBER</option>
                      <option value="ANNUAL MEMBER">ANNUAL MEMBER</option>
                      <option value="HONORARY MEMBER">HONORARY MEMBER</option>
                      <option value="PATRON MEMBER">PATRON MEMBER</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-bold uppercase tracking-wider mb-1">Photo URL (Optional)</label>
                  <input
                    type="url"
                    value={cardData.photoUrl}
                    onChange={(e) => setCardData({ ...cardData, photoUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px] focus:bg-white outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Generate Card for Alumni Directory Search */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                  <Search size={16} className="text-[#7A152B]" /> Directory Cards Lookup
                </h3>
                <p className="text-xs text-slate-500">Generate digital I-Card for any alumni member</p>
              </div>

              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search alumni name or dept..."
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white outline-none"
                />
                <button
                  type="submit"
                  disabled={searching}
                  className="px-4 py-2 bg-[#7A152B] hover:bg-[#600f21] text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  {searching ? '...' : 'Search'}
                </button>
              </form>

              {directoryResults.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100 max-h-48 overflow-y-auto">
                  {directoryResults.map((item, idx) => {
                    const name = `${item.user?.firstName || item.firstName || ''} ${item.user?.lastName || item.lastName || ''}`;
                    return (
                      <div
                        key={idx}
                        onClick={() => loadAlumniCard(item)}
                        className="p-2.5 bg-slate-50 hover:bg-amber-50/70 border border-slate-200 hover:border-amber-300 rounded-xl flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div className="truncate">
                          <span className="text-xs font-bold text-slate-900 block truncate">{name}</span>
                          <span className="text-[10px] text-slate-500 block truncate">
                            {item.degree || 'B.Tech'} • {item.department || 'Engineering'}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-[#7A152B] shrink-0 bg-white px-2 py-1 rounded-md border border-slate-200">
                          Load Card
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Verification Modal */}
      <ICardVerifierModal
        isOpen={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
        data={cardData}
      />
    </div>
  );
}
