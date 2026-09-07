import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { QrCode, CheckCircle2, ShieldCheck, Download, Printer, Copy, RotateCw, Sparkles, Building2, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export interface ICardData {
  fullName: string;
  degree: string;
  department: string;
  batch: string;
  membershipNo: string;
  dateOfIssue: string;
  membershipType: string;
  photoUrl?: string;
  email?: string;
  phone?: string;
  bloodGroup?: string;
}

interface AlumniICardProps {
  data: ICardData;
  onOpenVerify?: () => void;
  isFlipped?: boolean;
  onFlip?: () => void;
}

export default function AlumniICard({ data, onOpenVerify, isFlipped = false, onFlip }: AlumniICardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyId = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(data.membershipNo || 'ALUM/IITRAM/2024/001');
    setCopied(true);
    toast.success('Membership No. copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="perspective-1000 w-full max-w-[640px] mx-auto select-none">
      <motion.div
        className="relative w-full aspect-[1.58/1] rounded-2xl shadow-2xl transition-all duration-700 transform-style-3d cursor-pointer"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        onClick={onFlip}
      >
        {/* ════════════════════════════════════════════════════════════════════
            FRONT OF I-CARD (EXACT MATCH TO USER-PROVIDED SPEC)
           ════════════════════════════════════════════════════════════════════ */}
        <div
          className={`absolute inset-0 w-full h-full bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col justify-between backface-hidden ${
            isFlipped ? 'pointer-events-none' : ''
          }`}
          style={{
            boxShadow: '0 20px 40px -15px rgba(122, 21, 43, 0.18), 0 0 1px 1px rgba(0,0,0,0.05)',
          }}
        >
          {/* Top Gold Accent Border */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#C59B27] via-[#D4AF37] to-[#C59B27]" />

          {/* Card Outer Layout Container with Right Vertical Bars */}
          <div className="relative flex-1 flex flex-col justify-between pl-3 sm:pl-4 pr-10 sm:pr-12 pt-2.5 sm:pt-3 pb-0">
            
            {/* ── HEADER SECTION ────────────────────────────────────────────── */}
            <div>
              <div className="flex items-center gap-2.5 sm:gap-3.5 pb-2">
                {/* IITRAM Official Logo */}
                <div className="w-12 h-12 sm:w-16 sm:h-16 shrink-0 rounded-full p-0.5 bg-white shadow-xs border border-slate-100 flex items-center justify-center">
                  <img
                    src="/images/iitram-logo.png"
                    alt="IITRAM Logo"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      // Fallback to wikipedia URL if local image is unavailable
                      (e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/en/2/25/Institute_of_Infrastructure_Technology_Research_and_Management_logo.png';
                    }}
                  />
                </div>

                {/* Header Titles */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-base sm:text-2xl font-black tracking-tight text-[#7A152B] font-serif leading-tight uppercase">
                    IITRAM ALUMNI ASSOCIATION
                  </h2>
                  <p className="text-[10px] sm:text-xs font-semibold text-slate-800 leading-tight mt-0.5">
                    Institute of Infrastructure, Technology, Research and Management
                  </p>
                  <p className="text-[9px] sm:text-[11px] font-medium text-slate-500 leading-tight mt-0.5 tracking-tight">
                    Ahmedabad, Gujarat &nbsp;|&nbsp; www.iitram.ac.in &nbsp;|&nbsp; alumni@iitram.ac.in
                  </p>
                </div>
              </div>

              {/* Horizontal Golden Separator Bar */}
              <div className="h-[3px] w-full bg-[#C59B27] rounded-full shadow-2xs" />
            </div>

            {/* ── MAIN BODY SECTION ─────────────────────────────────────────── */}
            <div className="flex items-stretch gap-3 sm:gap-5 py-2 sm:py-3 my-auto">
              
              {/* Photo Frame (Left Box) */}
              <div className="relative w-24 sm:w-36 h-28 sm:h-40 rounded-sm border-2 border-[#7A152B] bg-slate-50 shrink-0 overflow-hidden shadow-xs flex flex-col items-center justify-center text-center p-1 group">
                {data.photoUrl ? (
                  <img
                    src={data.photoUrl}
                    alt={data.fullName}
                    className="w-full h-full object-cover rounded-xs"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100/80 text-slate-400">
                    <UserCheck className="w-8 h-8 sm:w-10 sm:h-10 text-slate-300 mb-1" />
                    <span className="text-[11px] sm:text-sm font-black tracking-widest text-slate-500 uppercase">
                      PHOTO
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-[#7A152B]/0 group-hover:bg-[#7A152B]/10 transition-colors pointer-events-none" />
              </div>

              {/* Alumni Details Column (Right Side) */}
              <div className="flex-1 flex flex-col justify-center min-w-0 pr-1">
                {/* Member Category Badge */}
                <span className="text-[10px] sm:text-xs font-bold text-[#C59B27] uppercase tracking-widest block mb-0.5">
                  ALUMNI MEMBER
                </span>

                {/* Full Name */}
                <h1 className="text-base sm:text-2xl font-black text-[#7A152B] uppercase tracking-tight leading-tight truncate mb-2 sm:mb-3">
                  {data.fullName || 'FULL NAME'}
                </h1>

                {/* Information Grid */}
                <div className="space-y-1 sm:space-y-1.5 text-[10px] sm:text-[13px] font-semibold text-slate-700">
                  <div className="flex items-baseline">
                    <span className="w-24 sm:w-32 text-slate-500 font-medium shrink-0">Degree</span>
                    <span className="mr-1.5 text-slate-400 font-normal">:</span>
                    <span className="font-bold text-slate-900 truncate">{data.degree || 'B.Tech / M.Tech / Ph.D.'}</span>
                  </div>

                  <div className="flex items-baseline">
                    <span className="w-24 sm:w-32 text-slate-500 font-medium shrink-0">Department</span>
                    <span className="mr-1.5 text-slate-400 font-normal">:</span>
                    <span className="font-bold text-slate-900 truncate">
                      {data.department || '_______________________'}
                    </span>
                  </div>

                  <div className="flex items-baseline">
                    <span className="w-24 sm:w-32 text-slate-500 font-medium shrink-0">Batch</span>
                    <span className="mr-1.5 text-slate-400 font-normal">:</span>
                    <span className="font-bold text-slate-900 truncate">
                      {data.batch ? `20${data.batch.replace(/^20/, '')}` : '20__'}
                    </span>
                  </div>

                  <div className="flex items-center" onClick={handleCopyId}>
                    <span className="w-24 sm:w-32 text-slate-500 font-medium shrink-0">Membership No.</span>
                    <span className="mr-1.5 text-slate-400 font-normal">:</span>
                    <span className="font-extrabold text-[#7A152B] tracking-tight hover:underline cursor-pointer flex items-center gap-1 truncate">
                      {data.membershipNo || 'ALUM/IITRAM/_______'}
                    </span>
                  </div>

                  <div className="flex items-baseline">
                    <span className="w-24 sm:w-32 text-slate-500 font-medium shrink-0">Date of Issue</span>
                    <span className="mr-1.5 text-slate-400 font-normal">:</span>
                    <span className="font-semibold text-slate-800">{data.dateOfIssue || '__/__/____'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── FOOTER BANNER ────────────────────────────────────────────── */}
            <div className="-mx-3 sm:-mx-4 -mr-10 sm:-mr-12 bg-[#7A152B] text-white px-3 sm:px-4 py-1.5 sm:py-2 flex items-center justify-between shadow-inner">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-white">
                {data.membershipType || 'LIFE MEMBER'}
              </span>

              {/* Barcode / QR Section */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenVerify?.();
                }}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded text-[9px] sm:text-xs font-bold tracking-wider text-white uppercase transition-colors cursor-pointer"
                title="Click to verify card details"
              >
                <QrCode className="w-3.5 h-3.5 text-amber-300" />
                <span>BARCODE / QR</span>
              </button>

              <span className="text-[9px] sm:text-xs font-semibold text-amber-200/90 tracking-tight">
                Issuing Authority
              </span>
            </div>

            {/* ── RIGHT VERTICAL STRIPES ACCENT ────────────────────────────── */}
            <div className="absolute top-0 bottom-0 right-0 flex h-full pointer-events-none">
              {/* Inner Gold Stripe */}
              <div className="w-2.5 sm:w-3 h-full bg-[#C59B27]" />
              {/* Outer Burgundy Column */}
              <div className="w-7 sm:w-9 h-full bg-[#7A152B]" />
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            BACK OF I-CARD (OFFICIAL DISCLAIMS, VERIFICATION & EMERGENCY CONTACT)
           ════════════════════════════════════════════════════════════════════ */}
        <div
          className={`absolute inset-0 w-full h-full bg-slate-900 rounded-2xl border border-slate-700 shadow-xl overflow-hidden flex flex-col justify-between p-4 sm:p-5 text-white backface-hidden [transform:rotateY(180deg)] ${
            !isFlipped ? 'pointer-events-none' : ''
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span className="text-xs sm:text-sm font-bold text-amber-400 uppercase tracking-wider">
                Official Digital Identity Verification
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">IITRAM-ALUM-VERIFIED</span>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-3 text-xs py-2">
            <div>
              <span className="text-slate-400 block text-[10px] font-semibold uppercase">Email</span>
              <span className="font-medium text-slate-200 truncate block">{data.email || 'alumni@iitram.ac.in'}</span>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] font-semibold uppercase">Blood Group</span>
              <span className="font-bold text-amber-400 block">{data.bloodGroup || 'O+'}</span>
            </div>

            <div className="col-span-2">
              <span className="text-slate-400 block text-[10px] font-semibold uppercase">Campus Address</span>
              <span className="font-normal text-slate-300 block text-[11px] leading-relaxed">
                Near Khokhra Circle, Maninagar East, Ahmedabad, Gujarat 380026
              </span>
            </div>

            <div className="col-span-2 bg-slate-800/80 p-2 rounded-lg border border-slate-700">
              <p className="text-[10px] text-slate-300 leading-tight">
                This digital card certifies active membership in the IITRAM Alumni Association.
                For verification, scan QR code or visit <span className="text-amber-400 font-mono">alumni.iitram.ac.in/verify</span>.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <CheckCircle2 size={12} /> Status: Active Member
            </span>
            <span className="text-slate-500">Click anywhere to flip back</span>
          </div>
        </div>
      </motion.div>

      {/* Helper text below card */}
      <div className="mt-3 flex items-center justify-between text-xs text-slate-500 px-1">
        <span className="flex items-center gap-1.5">
          <RotateCw size={13} className="text-brand-500 animate-spin-slow" />
          Click on card to flip between Front & Back
        </span>
        <button
          type="button"
          onClick={onFlip}
          className="text-brand-600 hover:text-brand-700 font-bold hover:underline cursor-pointer"
        >
          {isFlipped ? 'View Front Side' : 'View Back Side'}
        </button>
      </div>
    </div>
  );
}
