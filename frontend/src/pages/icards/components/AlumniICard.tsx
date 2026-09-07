import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { QrCode, RotateCw } from 'lucide-react';
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
  securityProtected?: boolean;
  side?: 'front' | 'back' | 'auto';
}

export default function AlumniICard({
  data,
  onOpenVerify,
  isFlipped = false,
  onFlip,
  securityProtected = true,
  side = 'auto',
}: AlumniICardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Silent ContextMenu & Shortcut protection without toast spam
  useEffect(() => {
    if (!securityProtected || !cardRef.current) return;
    const targetNode = cardRef.current;

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) ||
        (e.ctrlKey && (e.key === 'U' || e.key === 'u'))
      ) {
        e.preventDefault();
      }
    };

    targetNode.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      targetNode.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [securityProtected]);

  const handleCopyId = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(data.membershipNo || 'ALUM/IITRAM/2310400011011');
    toast.success('Membership No. copied!');
  };

  // ══════════════════════════════════════════════════════════════════════════
  // 1. FRONT SIDE MARKUP (EXACT 1:1 REPLICA MATCH WITH ZERO CUTOFFS)
  // ══════════════════════════════════════════════════════════════════════════
  const renderFrontCard = () => (
    <div
      className="relative w-full h-full bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col justify-between select-none"
      style={{
        boxShadow: '0 20px 40px -15px rgba(122, 21, 43, 0.18), 0 0 1px 1px rgba(0,0,0,0.05)',
      }}
    >
      {/* Top Gold Accent Border */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#C59B27] via-[#D4AF37] to-[#C59B27]" />

      {/* Card Outer Layout Container with Right Vertical Bars */}
      <div className="relative flex-1 flex flex-col justify-between pl-3 sm:pl-4 pr-11 sm:pr-14 pt-2.5 sm:pt-3 pb-0">
        
        {/* ── HEADER SECTION ────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-2.5 sm:gap-3.5 pb-2">
            {/* IITRAM Official Circular Header Logo */}
            <div className="w-11 h-11 sm:w-15 sm:h-15 shrink-0 rounded-full p-0.5 bg-white shadow-2xs border border-slate-100 flex items-center justify-center">
              <img
                src="/images/iitram-logo.png"
                alt="IITRAM Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/en/2/25/Institute_of_Infrastructure_Technology_Research_and_Management_logo.png';
                }}
              />
            </div>

            {/* Header Titles */}
            <div className="flex-1 min-w-0">
              <h2 className="text-sm sm:text-xl font-black tracking-tight text-[#7A152B] font-serif leading-tight uppercase">
                IITRAM ALUMNI ASSOCIATION
              </h2>
              <p className="text-[9px] sm:text-xs font-semibold text-slate-800 leading-tight mt-0.5">
                Institute of Infrastructure, Technology, Research and Management
              </p>
              <p className="text-[8px] sm:text-[10px] font-medium text-slate-500 leading-tight mt-0.5 tracking-tight truncate">
                Ahmedabad, Gujarat &nbsp;|&nbsp; www.iitram.ac.in &nbsp;|&nbsp; alumni@iitram.ac.in
              </p>
            </div>
          </div>

          {/* Horizontal Golden Separator Bar */}
          <div className="h-[3px] w-full bg-[#C59B27] rounded-full shadow-2xs" />
        </div>

        {/* ── MAIN BODY SECTION ─────────────────────────────────────────── */}
        <div className="flex items-stretch gap-3 sm:gap-4 py-2 sm:py-3 my-auto">
          
          {/* Photo Frame (Left Box - SHOWING OFFICIAL IITRAM LOGO AS REQUESTED) */}
          <div className="relative w-22 sm:w-32 h-26 sm:h-36 rounded-xs border-2 border-[#7A152B] bg-slate-50 shrink-0 overflow-hidden shadow-2xs flex flex-col items-center justify-center text-center p-1 group">
            <img
              src="/images/iitram-logo.png"
              alt="IITRAM Official Logo"
              className="w-full h-full object-contain p-1"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/en/2/25/Institute_of_Infrastructure_Technology_Research_and_Management_logo.png';
              }}
            />
          </div>

          {/* Alumni Details Column (Right Side) */}
          <div className="flex-1 flex flex-col justify-center min-w-0 pr-1">
            {/* Member Category Badge */}
            <span className="text-[9px] sm:text-[11px] font-bold text-[#C59B27] uppercase tracking-widest block mb-0.5">
              ALUMNI MEMBER
            </span>

            {/* Full Name: HEMANSHU TALA */}
            <h1 className="text-sm sm:text-xl font-black text-[#7A152B] uppercase tracking-tight leading-tight truncate mb-1.5 sm:mb-2 font-serif">
              {data.fullName || 'HEMANSHU TALA'}
            </h1>

            {/* Information Grid */}
            <div className="space-y-0.5 sm:space-y-1 text-[8.5px] sm:text-[11.5px] font-semibold text-slate-700">
              <div className="flex items-baseline">
                <span className="w-18 sm:w-26 text-slate-500 font-medium shrink-0">Degree</span>
                <span className="mr-1.5 text-slate-400 font-normal">:</span>
                <span className="font-bold text-slate-900 truncate">{data.degree || 'B.Tech'}</span>
              </div>

              <div className="flex items-baseline">
                <span className="w-18 sm:w-26 text-slate-500 font-medium shrink-0">Department</span>
                <span className="mr-1.5 text-slate-400 font-normal">:</span>
                <span className="font-bold text-slate-900 truncate">
                  {data.department || 'Computer Engineering'}
                </span>
              </div>

              <div className="flex items-baseline">
                <span className="w-18 sm:w-26 text-slate-500 font-medium shrink-0">Batch</span>
                <span className="mr-1.5 text-slate-400 font-normal">:</span>
                <span className="font-bold text-slate-900 truncate">
                  {data.batch || '2023 - 2027'}
                </span>
              </div>

              <div className="flex items-center" onClick={handleCopyId}>
                <span className="w-18 sm:w-26 text-slate-500 font-medium shrink-0">Membership No.</span>
                <span className="mr-1.5 text-slate-400 font-normal">:</span>
                <span className="font-extrabold text-[#7A152B] tracking-tight hover:underline cursor-pointer flex items-center gap-1 truncate font-mono text-[8.5px] sm:text-[10.5px]">
                  {data.membershipNo || 'ALUM/IITRAM/2310400011011'}
                </span>
              </div>

              <div className="flex items-baseline">
                <span className="w-18 sm:w-26 text-slate-500 font-medium shrink-0">Date of Issue</span>
                <span className="mr-1.5 text-slate-400 font-normal">:</span>
                <span className="font-semibold text-slate-800">{data.dateOfIssue || '07/09/2026'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── FOOTER BANNER ────────────────────────────────────────────── */}
        <div className="-mx-3 sm:-mx-4 -mr-11 sm:-mr-14 bg-[#7A152B] text-white px-3 sm:px-4 py-1 sm:py-1.5 flex items-center justify-between shadow-inner">
          <span className="text-[8.5px] sm:text-xs font-black uppercase tracking-wider text-white shrink-0">
            {data.membershipType || 'LIFE MEMBER'}
          </span>

          {/* Barcode / QR Section */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenVerify?.();
            }}
            className="flex items-center gap-1 bg-white/10 hover:bg-white/20 px-1.5 py-0.5 rounded text-[8px] sm:text-[10px] font-bold tracking-wider text-white uppercase transition-colors cursor-pointer shrink-0"
            title="Click to verify card authenticity"
          >
            <QrCode className="w-3 h-3 text-amber-300" />
            <span>BARCODE / QR</span>
          </button>

          <span className="text-[8px] sm:text-[10.5px] font-semibold text-amber-200/90 tracking-tight shrink-0">
            Issuing Authority
          </span>
        </div>

        {/* ── RIGHT VERTICAL STRIPES ACCENT ────────────────────────────── */}
        <div className="absolute top-0 bottom-0 right-0 flex h-full pointer-events-none">
          {/* Inner Gold Stripe */}
          <div className="w-2 sm:w-2.5 h-full bg-[#C59B27]" />
          {/* Outer Burgundy Column */}
          <div className="w-7 sm:w-9 h-full bg-[#7A152B]" />
        </div>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // 2. BACK SIDE MARKUP (EXACT 1:1 REPLICA MATCH WITH REAL QR CODE)
  // ══════════════════════════════════════════════════════════════════════════
  const renderBackCard = () => (
    <div
      className="relative w-full h-full bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col justify-between select-none"
      style={{
        boxShadow: '0 20px 40px -15px rgba(122, 21, 43, 0.18), 0 0 1px 1px rgba(0,0,0,0.05)',
      }}
    >
      {/* Top Gold Accent Border */}
      <div className="h-1.5 sm:h-2 w-full bg-gradient-to-r from-[#C59B27] via-[#D4AF37] to-[#C59B27]" />

      {/* Main Burgundy Header Bar */}
      <div className="bg-[#7A152B] text-white py-2.5 sm:py-3.5 px-4 text-center shadow-2xs">
        <h2 className="text-sm sm:text-xl font-black tracking-wider uppercase font-serif">
          IITRAM ALUMNI ASSOCIATION
        </h2>
      </div>

      {/* Body Section: Membership Privileges */}
      <div className="px-4 sm:px-7 py-2 sm:py-3 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xs sm:text-sm font-black text-[#7A152B] uppercase tracking-wide mb-1.5 sm:mb-2">
            MEMBERSHIP PRIVILEGES
          </h3>

          <ul className="space-y-1 sm:space-y-2 text-[9px] sm:text-[11.5px] font-semibold text-slate-800">
            <li className="flex items-start gap-1.5">
              <span className="text-[#7A152B] font-bold text-xs leading-none">•</span>
              <span>Access to alumni networking and events</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-[#7A152B] font-bold text-xs leading-none">•</span>
              <span>Participation in institute/alumni activities</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-[#7A152B] font-bold text-xs leading-none">•</span>
              <span>Access to alumni communications and updates</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-[#7A152B] font-bold text-xs leading-none">•</span>
              <span>Opportunities for professional and academic networking</span>
            </li>
          </ul>
        </div>

        {/* Horizontal Gold Line Separator */}
        <div className="my-1 sm:my-1.5">
          <div className="h-[2.5px] w-full bg-[#C59B27] rounded-full shadow-2xs mb-1" />
          <p className="text-[8px] sm:text-[10px] font-medium text-slate-700 text-center">
            This card certifies that the holder is a registered member of the IITRAM Alumni Association.
          </p>
        </div>

        {/* Footer Row */}
        <div className="flex items-center justify-between pt-0.5 pb-0.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenVerify?.();
            }}
            className="text-[9px] sm:text-[11px] font-bold text-[#7A152B] hover:underline cursor-pointer"
          >
            Verify membership
          </button>

          {/* QR Box showing REAL QR CODE graphic as requested */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              onOpenVerify?.();
            }}
            className="w-11 sm:w-15 h-9 sm:h-11 border border-[#7A152B] bg-[#FDFBF7] flex items-center justify-center p-0.5 rounded-xs shadow-2xs cursor-pointer hover:bg-amber-50/50 transition-colors"
            title="Click to verify QR code"
          >
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent('https://alumni.iitram.ac.in/verify/2310400011011')}`}
              alt="Verification QR Code"
              className="w-full h-full object-contain"
            />
          </div>

          <a
            href="https://www.iitram.ac.in"
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-[9px] sm:text-[11px] font-bold text-[#7A152B] hover:underline"
          >
            www.iitram.ac.in
          </a>
        </div>
      </div>
    </div>
  );

  // If explicit side is requested (e.g. side-by-side mode)
  if (side === 'front') {
    return (
      <div ref={cardRef} className="w-full max-w-[560px] mx-auto aspect-[1.58/1] select-none">
        {renderFrontCard()}
      </div>
    );
  }

  if (side === 'back') {
    return (
      <div ref={cardRef} className="w-full max-w-[560px] mx-auto aspect-[1.58/1] select-none">
        {renderBackCard()}
      </div>
    );
  }

  // Auto 3D flip card view
  return (
    <div ref={cardRef} className="perspective-1000 w-full max-w-[580px] mx-auto select-none">
      <motion.div
        className="relative w-full aspect-[1.58/1] rounded-2xl shadow-xl transition-all duration-700 transform-style-3d cursor-pointer select-none"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        onClick={onFlip}
      >
        {/* Front Container */}
        <div className={`absolute inset-0 w-full h-full backface-hidden ${isFlipped ? 'pointer-events-none' : ''}`}>
          {renderFrontCard()}
        </div>

        {/* Back Container */}
        <div className={`absolute inset-0 w-full h-full backface-hidden [transform:rotateY(180deg)] ${!isFlipped ? 'pointer-events-none' : ''}`}>
          {renderBackCard()}
        </div>
      </motion.div>

      {/* Helper text below card */}
      <div className="mt-3 flex items-center justify-between text-xs text-slate-500 px-1">
        <span className="flex items-center gap-1.5 text-slate-600 font-medium">
          <RotateCw size={13} className="text-[#7A152B]" />
          Click card to flip
        </span>
        <button
          type="button"
          onClick={onFlip}
          className="text-[#7A152B] hover:text-[#5a0f1f] font-bold hover:underline cursor-pointer"
        >
          {isFlipped ? 'View Front Side' : 'View Back Side'}
        </button>
      </div>
    </div>
  );
}
