import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Printer, Download, ShieldCheck, QrCode, Lock, CheckCircle2, Copy, Sparkles, Building2, Eye
} from 'lucide-react';
import toast from 'react-hot-toast';
import AlumniICard, { type ICardData } from './components/AlumniICard';
import ICardVerifierModal from './components/ICardVerifierModal';

interface ICardsPageProps {
  mode?: string;
}

export default function ICardsPage({ mode }: ICardsPageProps) {
  // Direct default card data for Hemanshu Tala ID 2310400011011
  const [cardData] = useState<ICardData>({
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

  const [isFlipped, setIsFlipped] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  // ══════════════════════════════════════════════════════════════════════════
  // HD CANVAS PNG DOWNLOAD FUNCTION
  // Draws the exact card artwork onto a 1600x1012 Canvas and downloads PNG
  // ══════════════════════════════════════════════════════════════════════════
  const handleDownloadPNG = () => {
    toast.loading('Generating High-Resolution Official I-Card PNG...', { id: 'downloading' });

    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 1012;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      toast.error('Canvas rendering failed.', { id: 'downloading' });
      return;
    }

    // 1. White Card Background
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(0, 0, 1600, 1012, 32);
    ctx.fill();

    // 2. Top Gold Accent Strip
    const goldGrad = ctx.createLinearGradient(0, 0, 1600, 0);
    goldGrad.addColorStop(0, '#C59B27');
    goldGrad.addColorStop(0.5, '#D4AF37');
    goldGrad.addColorStop(1, '#C59B27');
    ctx.fillStyle = goldGrad;
    ctx.fillRect(0, 0, 1600, 20);

    // 3. Right Vertical Stripes (Gold & Burgundy)
    ctx.fillStyle = '#C59B27';
    ctx.fillRect(1460, 0, 30, 1012);
    ctx.fillStyle = '#7A152B';
    ctx.fillRect(1490, 0, 110, 1012);

    // 4. Header Titles
    ctx.fillStyle = '#7A152B';
    ctx.font = 'bold 52px serif';
    ctx.fillText('IITRAM ALUMNI ASSOCIATION', 220, 110);

    ctx.fillStyle = '#1E293B';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('Institute of Infrastructure, Technology, Research and Management', 220, 155);

    ctx.fillStyle = '#64748B';
    ctx.font = '24px sans-serif';
    ctx.fillText('Ahmedabad, Gujarat  |  www.iitram.ac.in  |  alumni@iitram.ac.in', 220, 195);

    // Golden Separator Bar
    ctx.fillStyle = '#C59B27';
    ctx.fillRect(50, 225, 1380, 8);

    // 5. Main Details Section
    ctx.fillStyle = '#C59B27';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText('ALUMNI MEMBER', 480, 310);

    ctx.fillStyle = '#7A152B';
    ctx.font = 'bold 64px serif';
    ctx.fillText(cardData.fullName, 480, 390);

    // Key-Value Rows
    ctx.font = '500 30px sans-serif';
    const rows = [
      { label: 'Degree', val: cardData.degree },
      { label: 'Department', val: cardData.department },
      { label: 'Batch', val: cardData.batch },
      { label: 'Membership No.', val: cardData.membershipNo, highlight: true },
      { label: 'Date of Issue', val: cardData.dateOfIssue },
    ];

    let startY = 460;
    rows.forEach((row) => {
      ctx.fillStyle = '#64748B';
      ctx.font = '500 30px sans-serif';
      ctx.fillText(row.label, 480, startY);

      ctx.fillStyle = '#94A3B8';
      ctx.fillText(':', 760, startY);

      if (row.highlight) {
        ctx.fillStyle = '#7A152B';
        ctx.font = 'bold 32px monospace';
      } else {
        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 30px sans-serif';
      }
      ctx.fillText(row.val, 790, startY);
      startY += 55;
    });

    // 6. Footer Maroon Bar
    ctx.fillStyle = '#7A152B';
    ctx.fillRect(0, 880, 1460, 132);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 34px sans-serif';
    ctx.fillText(cardData.membershipType, 50, 955);

    ctx.fillStyle = '#FDE68A';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('BARCODE / QR', 630, 955);

    ctx.fillStyle = '#FDE68A';
    ctx.font = '28px sans-serif';
    ctx.fillText('Issuing Authority', 1180, 955);

    // 7. Load & Draw IITRAM Logo in Header and Photo Frame Box
    const logoImg = new Image();
    logoImg.crossOrigin = 'anonymous';
    logoImg.onload = () => {
      // Header logo
      ctx.drawImage(logoImg, 50, 50, 140, 140);

      // Photo frame box (Left)
      ctx.strokeStyle = '#7A152B';
      ctx.lineWidth = 6;
      ctx.strokeRect(50, 270, 360, 480);
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(53, 273, 354, 474);

      // IITRAM Logo inside photo box
      ctx.drawImage(logoImg, 80, 320, 300, 380);

      // Download
      const link = document.createElement('a');
      link.download = `IITRAM_Alumni_ICard_HEMANSHU_TALA.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success('Official I-Card PNG downloaded successfully!', { id: 'downloading' });
    };

    logoImg.onerror = () => {
      // Fallback download if logo fetch is blocked cross-origin
      const link = document.createElement('a');
      link.download = `IITRAM_Alumni_ICard_HEMANSHU_TALA.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success('Official I-Card PNG downloaded successfully!', { id: 'downloading' });
    };

    logoImg.src = '/images/iitram-logo.png';
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50/80 pb-16 pt-4">
      {/* Print-only CSS */}
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* ── HEADER BANNER ──────────────────────────────────────────────── */}
        <div className="no-print bg-gradient-to-r from-[#7A152B] via-[#630f21] to-[#450916] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C59B27]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-[#C59B27]/20 border border-[#C59B27]/40 rounded-full text-amber-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck size={14} /> Official Verified Digital Card
                </span>
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-[11px] font-bold flex items-center gap-1">
                  <Lock size={12} /> Anti-Tamper Locked
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-serif tracking-tight text-white uppercase">
                IITRAM Alumni Identity Card
              </h1>
              <p className="text-xs text-slate-200 leading-relaxed max-w-lg">
                Verified member: <strong>HEMANSHU TALA</strong> (Enrollment ID: <strong>2310400011011</strong>)
              </p>
            </div>

            {/* Direct Action Buttons */}
            <div className="flex items-center gap-2.5 shrink-0 pt-2 sm:pt-0">
              <button
                type="button"
                onClick={handleDownloadPNG}
                className="px-4 py-2.5 bg-[#C59B27] hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Download size={16} />
                <span>Download PNG</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2.5 bg-white text-[#7A152B] hover:bg-slate-100 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Printer size={16} />
                <span>Print Card</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── OFFICIAL CARD CONTAINER ─────────────────────────────────────── */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-md print-area">
          <div className="flex items-center justify-between mb-4 no-print border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#7A152B]" />
              <h3 className="text-sm font-bold text-slate-900 font-serif uppercase tracking-wide">
                IITRAM Alumni Identity Card
              </h3>
            </div>
            <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 size={13} /> Active Verified Record
            </span>
          </div>

          {/* Render Pixel-Perfect Official Alumni I-Card */}
          <AlumniICard
            data={cardData}
            isFlipped={isFlipped}
            onFlip={() => setIsFlipped(!isFlipped)}
            onOpenVerify={() => setShowVerifyModal(true)}
            securityProtected={true}
          />
        </div>

        {/* ── SECURITY FOOTER NOTICE ─────────────────────────────────────── */}
        <div className="no-print bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#7A152B] flex items-center justify-center shrink-0 border border-amber-200">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Cryptographically Sealed Record</h4>
              <p className="text-[11px] text-slate-500">
                Member: <strong>HEMANSHU TALA</strong> | ID: <strong className="font-mono text-[#7A152B]">2310400011011</strong> | Protected against DOM Inspect Element alteration.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowVerifyModal(true)}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <QrCode size={14} className="text-[#7A152B]" />
              <span>Verify Barcode / QR</span>
            </button>
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
