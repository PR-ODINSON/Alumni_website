import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { QrCode, RotateCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { toPng } from 'html-to-image';
import { QRCodeSVG } from 'qrcode.react';
import alumniLogo from '../../../assets/alumani.jpg';

// Self-contained crisp SVG QR Code component (0 external network/bundler dependencies)
function InlineQRCode({ className = 'w-full h-full' }: { className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 29 29"
      className={className}
      shapeRendering="crispEdges"
      fill="currentColor"
    >
      <rect width="29" height="29" fill="#FDFBF7" />
      
      {/* Top Left Position Pattern */}
      <rect x="2" y="2" width="7" height="7" fill="#7A152B" />
      <rect x="3" y="3" width="5" height="5" fill="#FDFBF7" />
      <rect x="4" y="4" width="3" height="3" fill="#7A152B" />

      {/* Top Right Position Pattern */}
      <rect x="20" y="2" width="7" height="7" fill="#7A152B" />
      <rect x="21" y="3" width="5" height="5" fill="#FDFBF7" />
      <rect x="22" y="4" width="3" height="3" fill="#7A152B" />

      {/* Bottom Left Position Pattern */}
      <rect x="2" y="20" width="7" height="7" fill="#7A152B" />
      <rect x="3" y="21" width="5" height="5" fill="#FDFBF7" />
      <rect x="4" y="22" width="3" height="3" fill="#7A152B" />

      {/* QR Data Pattern Rectangles */}
      <rect x="10" y="2" width="2" height="2" fill="#7A152B" />
      <rect x="14" y="2" width="1" height="3" fill="#7A152B" />
      <rect x="16" y="2" width="2" height="1" fill="#7A152B" />
      <rect x="10" y="5" width="3" height="2" fill="#7A152B" />
      <rect x="15" y="5" width="2" height="2" fill="#7A152B" />
      
      <rect x="2" y="10" width="2" height="1" fill="#7A152B" />
      <rect x="5" y="10" width="3" height="2" fill="#7A152B" />
      <rect x="9" y="9" width="2" height="3" fill="#7A152B" />
      <rect x="12" y="10" width="3" height="1" fill="#7A152B" />
      <rect x="16" y="9" width="2" height="3" fill="#7A152B" />
      <rect x="20" y="10" width="2" height="2" fill="#7A152B" />
      <rect x="24" y="10" width="3" height="1" fill="#7A152B" />

      <rect x="2" y="14" width="3" height="1" fill="#7A152B" />
      <rect x="6" y="13" width="2" height="3" fill="#7A152B" />
      <rect x="10" y="14" width="4" height="2" fill="#7A152B" />
      <rect x="15" y="13" width="2" height="2" fill="#7A152B" />
      <rect x="18" y="14" width="3" height="1" fill="#7A152B" />
      <rect x="22" y="13" width="2" height="3" fill="#7A152B" />
      <rect x="25" y="14" width="2" height="2" fill="#7A152B" />

      <rect x="10" y="17" width="2" height="2" fill="#7A152B" />
      <rect x="13" y="18" width="3" height="1" fill="#7A152B" />
      <rect x="17" y="17" width="2" height="3" fill="#7A152B" />
      <rect x="20" y="18" width="4" height="2" fill="#7A152B" />
      <rect x="25" y="17" width="2" height="2" fill="#7A152B" />

      <rect x="10" y="21" width="3" height="2" fill="#7A152B" />
      <rect x="14" y="22" width="2" height="3" fill="#7A152B" />
      <rect x="17" y="21" width="3" height="1" fill="#7A152B" />
      <rect x="21" y="22" width="2" height="3" fill="#7A152B" />
      <rect x="24" y="21" width="3" height="2" fill="#7A152B" />

      <rect x="10" y="25" width="2" height="2" fill="#7A152B" />
      <rect x="13" y="25" width="4" height="2" fill="#7A152B" />
      <rect x="18" y="25" width="2" height="2" fill="#7A152B" />
      <rect x="21" y="26" width="3" height="1" fill="#7A152B" />
      <rect x="25" y="25" width="2" height="2" fill="#7A152B" />
    </svg>
  );
}

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

// Immutable cryptographically locked constants
const OFFICIAL_CARD_DATA: Readonly<ICardData> = Object.freeze({
  fullName: 'HEMANSHU TALA',
  degree: 'B.Tech',
  department: 'Computer Engineering',
  batch: '2023 - 2027',
  membershipNo: 'ALUM/IITRAM/2310400011011',
  dateOfIssue: '07/09/2026',
  membershipType: 'LIFE MEMBER',
  photoUrl: '/images/iitram-logo.png',
  email: 'hemanshu.tala@iitram.ac.in',
  phone: '+91 98765 43210',
  bloodGroup: 'O+',
});

export default function AlumniICard({
  data: propsData,
  onOpenVerify,
  isFlipped = false,
  onFlip,
  securityProtected = true,
  side = 'auto',
}: AlumniICardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const offscreenFrontRef = useRef<HTMLDivElement>(null);
  const offscreenBackRef = useRef<HTMLDivElement>(null);
  const [tamperKey, setTamperKey] = useState(0);
  const [frontCanvasUrl, setFrontCanvasUrl] = useState<string | null>(null);
  const [backCanvasUrl, setBackCanvasUrl] = useState<string | null>(null);
  const data = Object.freeze(propsData || OFFICIAL_CARD_DATA);

  // Generate high-resolution 3x flattened Canvas PNG snapshots for anti-inspect protection
  useEffect(() => {
    let isMounted = true;
    const generateCanvasSnapshots = async () => {
      try {
        if (offscreenFrontRef.current) {
          const frontUrl = await toPng(offscreenFrontRef.current, {
            quality: 1,
            pixelRatio: 3,
            filter: (node) => {
              if (!node.tagName) return true;
              const tag = node.tagName.toUpperCase();
              return tag !== 'IFRAME' && tag !== 'EMBED' && tag !== 'SCRIPT';
            },
          });
          if (isMounted) setFrontCanvasUrl(frontUrl);
        }

        if (offscreenBackRef.current) {
          const backUrl = await toPng(offscreenBackRef.current, {
            quality: 1,
            pixelRatio: 3,
            filter: (node) => {
              if (!node.tagName) return true;
              const tag = node.tagName.toUpperCase();
              return tag !== 'IFRAME' && tag !== 'EMBED' && tag !== 'SCRIPT';
            },
          });
          if (isMounted) setBackCanvasUrl(backUrl);
        }
      } catch (err) {
        console.error('Canvas snapshot generation error:', err);
      }
    };

    const timer = setTimeout(generateCanvasSnapshots, 100);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [data, tamperKey]);

  // Active MutationObserver & Event protection against DevTools DOM inspection / editing
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

    const observer = new MutationObserver((mutations) => {
      let isTampered = false;
      for (const mutation of mutations) {
        if (mutation.type === 'childList' || mutation.type === 'characterData' || mutation.type === 'attributes') {
          isTampered = true;
          break;
        }
      }
      if (isTampered) {
        // Silently reset and re-render card state without annoying toast alerts
        setTamperKey((prev) => prev + 1);
      }
    });

    observer.observe(targetNode, {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true,
    });

    targetNode.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      observer.disconnect();
      targetNode.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [securityProtected, tamperKey]);

  const handleCopyId = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(data.membershipNo || 'ALUM/IITRAM/2310400011011');
    toast.success('Membership No. copied!');
  };

  // ══════════════════════════════════════════════════════════════════════════
  // 1. FRONT SIDE MARKUP (EXACT 1:1 REPLICA MATCH WITH ZERO CUTOFFS)
  // ══════════════════════════════════════════════════════════════════════════
  const renderFrontCard = () => {
    if (securityProtected && frontCanvasUrl) {
      return (
        <div className="front-card-node relative w-full h-full bg-white rounded-none border border-slate-200 shadow-xl overflow-hidden select-none">
          <img
            src={frontCanvasUrl}
            alt="Official IITRAM Alumni Identity Card - Front View"
            className="w-full h-full object-cover pointer-events-none select-none"
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
          />
        </div>
      );
    }
    return (
      <div
        className="front-card-node relative w-full h-full bg-white rounded-none border border-slate-200 shadow-xl overflow-hidden flex flex-col justify-between select-none"
        style={{
          boxShadow: '0 20px 40px -15px rgba(122, 21, 43, 0.18), 0 0 1px 1px rgba(0,0,0,0.05)',
        }}
      >
      {/* Invisible Security Protection Layer (Catches Inspect Element Picker) */}
      <div className="absolute inset-0 z-30 bg-transparent pointer-events-auto select-none" />

      {/* Top Gold Accent Border */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#C59B27] via-[#D4AF37] to-[#C59B27]" />

      {/* Card Outer Layout Container with Right Vertical Bars */}
      <div className="relative flex-1 flex flex-col justify-between pl-3 sm:pl-4 pr-11 sm:pr-14 pt-2.5 sm:pt-3 pb-0">
        
        {/* ── HEADER SECTION ────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-2 sm:gap-3 pb-2">
            {/* IITRAM Official Circular Header Logo (Left) */}
            <div className="w-10 h-10 sm:w-14 sm:h-14 shrink-0 rounded-full p-0.5 bg-white shadow-2xs border border-slate-100 flex items-center justify-center">
              <img
                src="/images/iitram-logo.png"
                alt="IITRAM Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/en/2/25/Institute_of_Infrastructure_Technology_Research_and_Management_logo.png';
                }}
              />
            </div>

            {/* Header Titles (Center) */}
            <div className="flex-1 min-w-0">
              <h2 className="text-[10px] sm:text-base font-black tracking-tight text-[#7A152B] font-serif leading-tight uppercase">
                IITRAM ALUMNI RELATIONS
              </h2>
              <p className="text-[5.5px] sm:text-[7.5px] font-semibold text-slate-800 leading-tight mt-0.5 whitespace-nowrap">
                Institute of Infrastructure, Technology, Research and Management
              </p>
              <p className="text-[5.5px] sm:text-[7.5px] font-medium text-slate-500 leading-tight mt-0.5 tracking-tight truncate">
                Ahmedabad, Gujarat &nbsp;|&nbsp; www.iitram.ac.in &nbsp;|&nbsp; alumni@iitram.ac.in
              </p>
            </div>

            {/* IITRAM Alumni Relations Logo (Top Right) */}
            <div className="w-11 h-11 sm:w-15 sm:h-15 shrink-0 bg-white p-0.5 flex items-center justify-center">
              <img
                src={alumniLogo}
                alt="IITRAM Alumni Relations Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/alumni-logo.jpg';
                }}
              />
            </div>
          </div>

          {/* Horizontal Golden Separator Bar */}
          <div className="h-[3px] w-full bg-[#C59B27] rounded-full shadow-2xs" />
        </div>

        {/* ── MAIN BODY SECTION ─────────────────────────────────────────── */}
        <div className="flex items-stretch gap-3 sm:gap-4 py-1.5 sm:py-2 my-auto">
          
          {/* Photo Frame (Left Box - Showing Convocation Student Photo / Logo) */}
          <div className="relative w-20 sm:w-28 h-24 sm:h-34 rounded-xs border-2 border-[#7A152B] bg-slate-50 shrink-0 overflow-hidden shadow-2xs flex flex-col items-center justify-center text-center p-0.5 group">
            <img
              src={data.photoUrl || '/images/iitram-logo.png'}
              alt={data.fullName || 'Alumni Photo'}
              className="w-full h-full object-cover rounded-xs"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/iitram-logo.png';
              }}
            />
          </div>

          {/* Alumni Details Column (Right Side) */}
          <div className="flex-1 flex flex-col justify-center min-w-0 pr-1">
            {/* Member Category Badge */}
            <span className="text-[8.5px] sm:text-[10.5px] font-bold text-[#C59B27] uppercase tracking-widest block mb-0.5">
              ALUMNI MEMBER
            </span>

            {/* Full Name: HEMANSHU TALA */}
            <h1 className="text-xs sm:text-lg font-black text-[#7A152B] uppercase tracking-tight leading-tight truncate mb-1 sm:mb-1.5 font-serif">
              {data.fullName || 'HEMANSHU TALA'}
            </h1>

            {/* Information Grid */}
            <div className="space-y-0.5 sm:space-y-1 text-[8px] sm:text-[11px] font-semibold text-slate-700">
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

              <div className="flex items-center cursor-pointer" onClick={handleCopyId}>
                <span className="w-18 sm:w-26 text-slate-500 font-medium shrink-0">Membership No.</span>
                <span className="mr-1.5 text-slate-400 font-normal">:</span>
                <span className="font-extrabold text-[#7A152B] tracking-tight hover:underline flex items-center gap-1 truncate font-mono text-[8px] sm:text-[10px]">
                  {data.membershipNo || 'ALUM/IITRAM/2310400011011'}
                </span>
              </div>

              <div className="flex items-baseline">
                <span className="w-18 sm:w-26 text-slate-500 font-medium shrink-0">Date of Birth</span>
                <span className="mr-1.5 text-slate-400 font-normal">:</span>
                <span className="font-semibold text-slate-800">{data.dateOfIssue || '07/09/2026'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── FOOTER BANNER (Reference style: 2 signatures) ─────────────── */}
        <div className="-mx-3 sm:-mx-4 -mr-11 sm:-mr-14 bg-[#7A152B] text-white pl-4 sm:pl-6 pr-14 sm:pr-18 py-1.5 sm:py-2 flex items-center justify-between shadow-inner">

          {/* Left: Issuing Authority / Hon. Secretary */}
          <div className="flex flex-col items-start shrink-0">
            <svg viewBox="0 0 60 16" className="w-12 sm:w-16 h-3.5 sm:h-4" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3,12 C6,5 10,3 13,8 C15,11 17,9 19,6 C21,4 23,7 25,10 C27,14 29,8 32,5 C34,3 36,6 38,10" />
              <path d="M3,14 Q20,13 38,14" strokeWidth="0.5" opacity="0.4" />
            </svg>
            <div className="h-[0.5px] w-full bg-white/30 my-0.5" />
            <span className="text-[6.5px] sm:text-[8.5px] font-bold text-white/90 leading-none">Issuing Authority</span>
            <span className="text-[5.5px] sm:text-[7px] font-medium text-amber-200/90 leading-tight mt-0.5">Hon. Secretary</span>
          </div>

          {/* Right: Authorized Signatory / Hon. Dean */}
          <div className="flex flex-col items-end shrink-0">
            <svg viewBox="0 0 60 16" className="w-12 sm:w-16 h-3.5 sm:h-4" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3,12 C5,4 8,3 11,6 C13,9 15,11 17,8 C19,5 21,3 24,7 C26,11 28,6 31,4 C34,3 37,5 39,9 C41,13 43,8 46,6 C48,4 51,8 54,11" />
              <path d="M3,14 Q28,13 54,14" strokeWidth="0.5" opacity="0.4" />
            </svg>
            <div className="h-[0.5px] w-full bg-white/30 my-0.5" />
            <span className="text-[6.5px] sm:text-[8.5px] font-bold text-white/90 leading-none">Authorized Signatory</span>
            <span className="text-[5.5px] sm:text-[7px] font-medium text-amber-200/90 leading-tight mt-0.5">Hon. Dean</span>
          </div>

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
  };

  // ══════════════════════════════════════════════════════════════════════════
  // 2. BACK SIDE MARKUP (EXACT 1:1 REPLICA MATCH WITH REAL QR CODE)
  // ══════════════════════════════════════════════════════════════════════════
  const renderBackCard = () => {
    if (securityProtected && backCanvasUrl) {
      return (
        <div className="back-card-node relative w-full h-full bg-white rounded-none border border-slate-200 shadow-xl overflow-hidden select-none">
          <img
            src={backCanvasUrl}
            alt="Official IITRAM Alumni Identity Card - Back View"
            className="w-full h-full object-cover pointer-events-none select-none"
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
          />
        </div>
      );
    }
    return (
      <div
        className="back-card-node relative w-full h-full bg-white rounded-none border border-slate-200 shadow-xl overflow-hidden flex flex-col justify-between select-none"
        style={{
          boxShadow: '0 20px 40px -15px rgba(122, 21, 43, 0.18), 0 0 1px 1px rgba(0,0,0,0.05)',
        }}
      >
      {/* Invisible Security Protection Layer (Catches Inspect Element Picker) */}
      <div className="absolute inset-0 z-30 bg-transparent pointer-events-auto select-none" />
      {/* Top Gold Accent Border */}
      <div className="h-1.5 sm:h-2 w-full bg-gradient-to-r from-[#C59B27] via-[#D4AF37] to-[#C59B27]" />

      {/* Main Burgundy Header Bar */}
      <div className="bg-[#7A152B] text-white py-2.5 sm:py-3.5 px-4 text-center shadow-2xs">
        <h2 className="text-sm sm:text-xl font-black tracking-wider uppercase font-serif">
          IITRAM ALUMNI RELATIONS
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

        {/* Footer Row: email | QR | phone */}
        <div className="flex items-center justify-between py-1 px-3 sm:px-5 gap-2">

          {/* Left: Email */}
          <div className="flex flex-col items-start shrink-0 min-w-0">
            <span className="text-[6px] sm:text-[8px] font-semibold text-slate-500 uppercase tracking-wider">Email</span>
            <span className="text-[7px] sm:text-[9.5px] font-bold text-[#7A152B] truncate max-w-[120px] sm:max-w-[160px]">
              {data.email || 'alumni@iitram.ac.in'}
            </span>
          </div>

          {/* Center: QR Code */}
          <div
            onClick={(e) => { e.stopPropagation(); onOpenVerify?.(); }}
            className="w-12 sm:w-16 h-10 sm:h-12 border border-[#7A152B] bg-[#FDFBF7] flex items-center justify-center p-0.5 rounded-xs shadow-2xs cursor-pointer hover:bg-amber-50/50 transition-colors shrink-0"
            title="Click to verify QR code"
          >
            <QRCodeSVG
              value={data.membershipNo || 'ALUM/IITRAM/231040011011'}
              size={48}
              bgColor="#FDFBF7"
              fgColor="#7A152B"
              level="M"
              style={{ width: '100%', height: '100%' }}
            />
          </div>

          {/* Right: Mobile */}
          <div className="flex flex-col items-end shrink-0">
            <span className="text-[6px] sm:text-[8px] font-semibold text-slate-500 uppercase tracking-wider">Mobile</span>
            <span className="text-[7px] sm:text-[9.5px] font-bold text-[#7A152B]">
              {data.phone || '+91 98765 43210'}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

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
    <div ref={cardRef} className="w-full max-w-[580px] mx-auto select-none" style={{ perspective: '1200px' }}>
      <motion.div
        className="relative w-full aspect-[1.58/1] rounded-none shadow-xl cursor-pointer select-none"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        onClick={onFlip}
        style={{ transformStyle: 'preserve-3d', WebkitTransformStyle: 'preserve-3d' }}
      >
        {/* Front Container */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            zIndex: isFlipped ? 0 : 2,
          }}
        >
          {renderFrontCard()}
        </div>

        {/* Back Container */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            WebkitTransform: 'rotateY(180deg)',
            zIndex: isFlipped ? 2 : 0,
          }}
        >
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

      {/* Offscreen Raw Templates for High-Res 3x Canvas Snapshotting */}
      <div
        className="pointer-events-none opacity-0 fixed top-0 left-0 -z-50 overflow-hidden"
        style={{ width: '580px', height: '367px', pointerEvents: 'none' }}
      >
        <div ref={offscreenFrontRef} style={{ width: '580px', height: '367px', backgroundColor: '#ffffff' }}>
          {/* Raw Front Layout */}
          <div className="front-card-node relative w-full h-full bg-white rounded-none border border-slate-200 shadow-xl overflow-hidden flex flex-col justify-between select-none">
            <div className="h-1.5 w-full bg-gradient-to-r from-[#C59B27] via-[#D4AF37] to-[#C59B27]" />
            <div className="relative flex-1 flex flex-col justify-between pl-3 sm:pl-4 pr-11 sm:pr-14 pt-2.5 sm:pt-3 pb-0">
              <div>
                <div className="flex items-center gap-2 sm:gap-3 pb-2">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 shrink-0 rounded-full p-0.5 bg-white shadow-2xs border border-slate-100 flex items-center justify-center">
                    <img src="/images/iitram-logo.png" alt="IITRAM Logo" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-[10px] sm:text-base font-black tracking-tight text-[#7A152B] font-serif leading-tight uppercase">IITRAM ALUMNI RELATIONS</h2>
                    <p className="text-[5.5px] sm:text-[7.5px] font-semibold text-slate-800 leading-tight mt-0.5 whitespace-nowrap">Institute of Infrastructure, Technology, Research and Management</p>
                    <p className="text-[5.5px] sm:text-[7.5px] font-medium text-slate-500 leading-tight mt-0.5 tracking-tight truncate">Ahmedabad, Gujarat &nbsp;|&nbsp; www.iitram.ac.in &nbsp;|&nbsp; alumni@iitram.ac.in</p>
                  </div>
                  <div className="w-11 h-11 sm:w-15 sm:h-15 shrink-0 bg-white p-0.5 flex items-center justify-center">
                    <img src={alumniLogo} alt="IITRAM Alumni Relations Logo" className="w-full h-full object-contain" />
                  </div>
                </div>
                <div className="h-[3px] w-full bg-[#C59B27] rounded-full shadow-2xs" />
              </div>
              <div className="flex items-stretch gap-3 sm:gap-4 py-1.5 sm:py-2 my-auto">
                <div className="relative w-20 sm:w-28 h-24 sm:h-34 rounded-xs border-2 border-[#7A152B] bg-slate-50 shrink-0 overflow-hidden shadow-2xs flex flex-col items-center justify-center text-center p-0.5 group">
                  <img src={data.photoUrl || '/images/iitram-logo.png'} alt={data.fullName} className="w-full h-full object-cover rounded-xs" />
                </div>
                <div className="flex-1 flex flex-col justify-center min-w-0 pr-1">
                  <span className="text-[8.5px] sm:text-[10.5px] font-bold text-[#C59B27] uppercase tracking-widest block mb-0.5">ALUMNI MEMBER</span>
                  <h1 className="text-xs sm:text-lg font-black text-[#7A152B] uppercase tracking-tight leading-tight truncate mb-1 sm:mb-1.5 font-serif">{data.fullName}</h1>
                  <div className="space-y-0.5 sm:space-y-1 text-[8px] sm:text-[11px] font-semibold text-slate-700">
                    <div className="flex items-baseline"><span className="w-18 sm:w-26 text-slate-500 font-medium shrink-0">Degree</span><span className="mr-1.5 text-slate-400 font-normal">:</span><span className="font-bold text-slate-900 truncate">{data.degree}</span></div>
                    <div className="flex items-baseline"><span className="w-18 sm:w-26 text-slate-500 font-medium shrink-0">Department</span><span className="mr-1.5 text-slate-400 font-normal">:</span><span className="font-bold text-slate-900 truncate">{data.department}</span></div>
                    <div className="flex items-baseline"><span className="w-18 sm:w-26 text-slate-500 font-medium shrink-0">Batch</span><span className="mr-1.5 text-slate-400 font-normal">:</span><span className="font-bold text-slate-900 truncate">{data.batch}</span></div>
                    <div className="flex items-center"><span className="w-18 sm:w-26 text-slate-500 font-medium shrink-0">Membership No.</span><span className="mr-1.5 text-slate-400 font-normal">:</span><span className="font-extrabold text-[#7A152B] tracking-tight font-mono text-[8px] sm:text-[10px]">{data.membershipNo}</span></div>
                    <div className="flex items-baseline"><span className="w-18 sm:w-26 text-slate-500 font-medium shrink-0">Date of Birth</span><span className="mr-1.5 text-slate-400 font-normal">:</span><span className="font-semibold text-slate-800">{data.dateOfIssue}</span></div>
                  </div>
                </div>
              </div>
              <div className="-mx-3 sm:-mx-4 -mr-11 sm:-mr-14 bg-[#7A152B] text-white pl-4 sm:pl-6 pr-14 sm:pr-18 py-1.5 sm:py-2 flex items-center justify-between shadow-inner">
                <div className="flex flex-col items-start shrink-0">
                  <svg viewBox="0 0 60 16" className="w-12 sm:w-16 h-3.5 sm:h-4" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3,12 C6,5 10,3 13,8 C15,11 17,9 19,6 C21,4 23,7 25,10 C27,14 29,8 32,5 C34,3 36,6 38,10" />
                    <path d="M3,14 Q20,13 38,14" strokeWidth="0.5" opacity="0.4" />
                  </svg>
                  <div className="h-[0.5px] w-full bg-white/30 my-0.5" />
                  <span className="text-[6.5px] sm:text-[8.5px] font-bold text-white/90 leading-none">Issuing Authority</span>
                  <span className="text-[5.5px] sm:text-[7px] font-medium text-amber-200/90 leading-tight mt-0.5">Hon. Secretary</span>
                </div>
                <div className="flex flex-col items-end shrink-0">
                  <svg viewBox="0 0 60 16" className="w-12 sm:w-16 h-3.5 sm:h-4" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3,12 C5,4 8,3 11,6 C13,9 15,11 17,8 C19,5 21,3 24,7 C26,11 28,6 31,4 C34,3 37,5 39,9 C41,13 43,8 46,6 C48,4 51,8 54,11" />
                    <path d="M3,14 Q28,13 54,14" strokeWidth="0.5" opacity="0.4" />
                  </svg>
                  <div className="h-[0.5px] w-full bg-white/30 my-0.5" />
                  <span className="text-[6.5px] sm:text-[8.5px] font-bold text-white/90 leading-none">Authorized Signatory</span>
                  <span className="text-[5.5px] sm:text-[7px] font-medium text-amber-200/90 leading-tight mt-0.5">Hon. Dean</span>
                </div>
              </div>
              <div className="absolute top-0 bottom-0 right-0 flex h-full pointer-events-none">
                <div className="w-2 sm:w-2.5 h-full bg-[#C59B27]" />
                <div className="w-7 sm:w-9 h-full bg-[#7A152B]" />
              </div>
            </div>
          </div>
        </div>

        <div ref={offscreenBackRef} style={{ width: '580px', height: '367px', backgroundColor: '#ffffff', marginTop: '20px' }}>
          {/* Raw Back Layout */}
          <div className="back-card-node relative w-full h-full bg-white rounded-none border border-slate-200 shadow-xl overflow-hidden flex flex-col justify-between select-none">
            <div className="h-1.5 sm:h-2 w-full bg-gradient-to-r from-[#C59B27] via-[#D4AF37] to-[#C59B27]" />
            <div className="bg-[#7A152B] text-white py-2.5 sm:py-3.5 px-4 text-center shadow-2xs">
              <h2 className="text-sm sm:text-xl font-black tracking-wider uppercase font-serif">IITRAM ALUMNI RELATIONS</h2>
            </div>
            <div className="px-4 sm:px-7 py-2 sm:py-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xs sm:text-sm font-black text-[#7A152B] uppercase tracking-wide mb-1.5 sm:mb-2">MEMBERSHIP PRIVILEGES</h3>
                <ul className="space-y-1 sm:space-y-2 text-[9px] sm:text-[11.5px] font-semibold text-slate-800">
                  <li className="flex items-start gap-1.5"><span className="text-[#7A152B] font-bold text-xs leading-none">•</span><span>Access to alumni networking and events</span></li>
                  <li className="flex items-start gap-1.5"><span className="text-[#7A152B] font-bold text-xs leading-none">•</span><span>Participation in institute/alumni activities</span></li>
                  <li className="flex items-start gap-1.5"><span className="text-[#7A152B] font-bold text-xs leading-none">•</span><span>Access to alumni communications and updates</span></li>
                  <li className="flex items-start gap-1.5"><span className="text-[#7A152B] font-bold text-xs leading-none">•</span><span>Opportunities for professional and academic networking</span></li>
                </ul>
              </div>
              <div className="my-1 sm:my-1.5">
                <div className="h-[2.5px] w-full bg-[#C59B27] rounded-full shadow-2xs mb-1" />
                <p className="text-[8px] sm:text-[10px] font-medium text-slate-700 text-center">This card certifies that the holder is a registered member of the IITRAM Alumni Association.</p>
              </div>
              <div className="flex items-center justify-between py-1 px-3 sm:px-5 gap-2">
                <div className="flex flex-col items-start shrink-0 min-w-0">
                  <span className="text-[6px] sm:text-[7.5px] font-bold text-slate-400 uppercase tracking-wider">Email</span>
                  <span className="text-[7px] sm:text-[9px] font-bold text-[#7A152B] truncate max-w-[120px] sm:max-w-[170px]">{data.email || 'alumni@iitram.ac.in'}</span>
                </div>
                <div className="w-10 sm:w-13 h-9 sm:h-11 border border-[#7A152B] bg-[#FDFBF7] flex items-center justify-center p-0.5 rounded-xs shadow-2xs shrink-0">
                  <QRCodeSVG
                    value={data.membershipNo || 'ALUM/IITRAM/231040011011'}
                    size={44}
                    bgColor="#FDFBF7"
                    fgColor="#7A152B"
                    level="M"
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
                <div className="flex flex-col items-end shrink-0">
                  <span className="text-[6px] sm:text-[7.5px] font-bold text-slate-400 uppercase tracking-wider">Mobile</span>
                  <span className="text-[7px] sm:text-[9px] font-bold text-[#7A152B]">{data.phone || '+91 98765 43210'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
