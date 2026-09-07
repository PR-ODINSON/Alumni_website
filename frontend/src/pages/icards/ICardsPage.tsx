import React, { useState } from 'react';
import {
  Printer, Download, ShieldCheck, QrCode, Lock, CheckCircle2, LayoutGrid, Layers, Sparkles
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

  const [viewMode, setViewMode] = useState<'side-by-side' | 'flip'>('side-by-side');
  const [isFlipped, setIsFlipped] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  // ══════════════════════════════════════════════════════════════════════════
  // HD CANVAS PNG DOWNLOAD - FRONT SIDE
  // ══════════════════════════════════════════════════════════════════════════
  const handleDownloadFrontPNG = () => {
    toast.loading('Generating Official Front I-Card PNG...', { id: 'dl-front' });

    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 1012;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // White Card Background
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(0, 0, 1600, 1012, 32);
    ctx.fill();

    // Top Gold Accent Strip
    const goldGrad = ctx.createLinearGradient(0, 0, 1600, 0);
    goldGrad.addColorStop(0, '#C59B27');
    goldGrad.addColorStop(0.5, '#D4AF37');
    goldGrad.addColorStop(1, '#C59B27');
    ctx.fillStyle = goldGrad;
    ctx.fillRect(0, 0, 1600, 20);

    // Right Vertical Stripes
    ctx.fillStyle = '#C59B27';
    ctx.fillRect(1460, 0, 30, 1012);
    ctx.fillStyle = '#7A152B';
    ctx.fillRect(1490, 0, 110, 1012);

    // Header Titles
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

    // Main Details
    ctx.fillStyle = '#C59B27';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText('ALUMNI MEMBER', 480, 310);

    ctx.fillStyle = '#7A152B';
    ctx.font = 'bold 64px serif';
    ctx.fillText(cardData.fullName, 480, 390);

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

    // Footer Banner
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

    // Draw IITRAM Logo
    const logoImg = new Image();
    logoImg.crossOrigin = 'anonymous';
    logoImg.onload = () => {
      ctx.drawImage(logoImg, 50, 50, 140, 140);

      // Photo frame box
      ctx.strokeStyle = '#7A152B';
      ctx.lineWidth = 6;
      ctx.strokeRect(50, 270, 360, 480);
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(53, 273, 354, 474);
      ctx.drawImage(logoImg, 80, 320, 300, 380);

      const link = document.createElement('a');
      link.download = `IITRAM_Alumni_ICard_Front_HEMANSHU_TALA.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success('Front I-Card PNG downloaded!', { id: 'dl-front' });
    };

    logoImg.onerror = () => {
      const link = document.createElement('a');
      link.download = `IITRAM_Alumni_ICard_Front_HEMANSHU_TALA.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success('Front I-Card PNG downloaded!', { id: 'dl-front' });
    };

    logoImg.src = '/images/iitram-logo.png';
  };

  // ══════════════════════════════════════════════════════════════════════════
  // HD CANVAS PNG DOWNLOAD - BACK SIDE (EXACT MATCH TO BACK IMAGE SPEC)
  // ══════════════════════════════════════════════════════════════════════════
  const handleDownloadBackPNG = () => {
    toast.loading('Generating Official Back I-Card PNG...', { id: 'dl-back' });

    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 1012;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // White Card Background
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(0, 0, 1600, 1012, 32);
    ctx.fill();

    // Top Gold Accent Strip
    const goldGrad = ctx.createLinearGradient(0, 0, 1600, 0);
    goldGrad.addColorStop(0, '#C59B27');
    goldGrad.addColorStop(0.5, '#D4AF37');
    goldGrad.addColorStop(1, '#C59B27');
    ctx.fillStyle = goldGrad;
    ctx.fillRect(0, 0, 1600, 24);

    // Top Full-width Burgundy Banner
    ctx.fillStyle = '#7A152B';
    ctx.fillRect(0, 24, 1600, 180);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 54px serif';
    ctx.textAlign = 'center';
    ctx.fillText('IITRAM ALUMNI ASSOCIATION', 800, 130);

    // Body: Membership Privileges
    ctx.textAlign = 'left';
    ctx.fillStyle = '#7A152B';
    ctx.font = 'bold 40px sans-serif';
    ctx.fillText('MEMBERSHIP PRIVILEGES', 100, 280);

    const privileges = [
      'Access to alumni networking and events',
      'Participation in institute/alumni activities',
      'Access to alumni communications and updates',
      'Opportunities for professional and academic networking',
    ];

    let bulletY = 360;
    privileges.forEach((text) => {
      ctx.fillStyle = '#7A152B';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText('•', 110, bulletY);

      ctx.fillStyle = '#1E293B';
      ctx.font = '500 32px sans-serif';
      ctx.fillText(text, 150, bulletY);
      bulletY += 75;
    });

    // Gold Separator Line
    ctx.fillStyle = '#C59B27';
    ctx.fillRect(100, 710, 1400, 8);

    // Disclaimer
    ctx.fillStyle = '#334155';
    ctx.font = '500 28px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('This card certifies that the holder is a registered member of the IITRAM Alumni Association.', 800, 770);

    // Footer Row
    ctx.textAlign = 'left';
    ctx.fillStyle = '#7A152B';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText('Verify membership', 100, 880);

    // QR Box in center
    ctx.strokeStyle = '#7A152B';
    ctx.lineWidth = 4;
    ctx.strokeRect(710, 800, 180, 150);
    ctx.fillStyle = '#FDFBF7';
    ctx.fillRect(712, 802, 176, 146);

    // Right Website Link
    ctx.textAlign = 'right';
    ctx.fillStyle = '#7A152B';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText('www.iitram.ac.in', 1500, 885);

    // Draw QR Code Image inside Box
    const qrImg = new Image();
    qrImg.crossOrigin = 'anonymous';
    qrImg.onload = () => {
      ctx.drawImage(qrImg, 722, 807, 156, 136);
      const link = document.createElement('a');
      link.download = `IITRAM_Alumni_ICard_Back_HEMANSHU_TALA.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success('Back I-Card PNG downloaded!', { id: 'dl-back' });
    };
    qrImg.onerror = () => {
      const link = document.createElement('a');
      link.download = `IITRAM_Alumni_ICard_Back_HEMANSHU_TALA.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success('Back I-Card PNG downloaded!', { id: 'dl-back' });
    };
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent('https://alumni.iitram.ac.in/verify/2310400011011')}`;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16 pt-6">
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* ── CLEAN & ELEGANT TOP BAR ────────────────────────────────────── */}
        <div className="no-print bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 bg-amber-50 border border-amber-200 text-[#7A152B] rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck size={13} className="text-[#C59B27]" /> IITRAM Verified Alumni Card
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: 2310400011011</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-display tracking-tight">
              Official Digital Identity Card
            </h1>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* View Mode Switcher */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200/80">
              <button
                type="button"
                onClick={() => setViewMode('side-by-side')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'side-by-side' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutGrid size={14} /> Side-by-Side
              </button>
              <button
                type="button"
                onClick={() => setViewMode('flip')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'flip' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers size={14} /> 3D Flip
              </button>
            </div>

            <button
              type="button"
              onClick={handleDownloadFrontPNG}
              className="px-3.5 py-2 bg-[#7A152B] hover:bg-[#600f21] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={14} className="text-amber-300" />
              <span>Front PNG</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadBackPNG}
              className="px-3.5 py-2 bg-[#7A152B] hover:bg-[#600f21] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={14} className="text-amber-300" />
              <span>Back PNG</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all border border-slate-200 flex items-center gap-1.5 cursor-pointer"
            >
              <Printer size={14} />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* ── CARD DISPLAY AREA ───────────────────────────────────────────── */}
        <div className="print-area">
          {viewMode === 'side-by-side' ? (
            /* DUAL SIDE-BY-SIDE VIEW (FRONT CARD & BACK CARD) */
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* FRONT SIDE */}
                <div className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between no-print border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-[#7A152B] uppercase tracking-wider flex items-center gap-1.5 font-serif">
                      <Sparkles size={14} /> Front View
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">Official Replica</span>
                  </div>
                  <AlumniICard
                    data={cardData}
                    side="front"
                    onOpenVerify={() => setShowVerifyModal(true)}
                    securityProtected={true}
                  />
                </div>

                {/* BACK SIDE */}
                <div className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between no-print border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-[#7A152B] uppercase tracking-wider flex items-center gap-1.5 font-serif">
                      <Sparkles size={14} /> Back View
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">Membership Privileges</span>
                  </div>
                  <AlumniICard
                    data={cardData}
                    side="back"
                    onOpenVerify={() => setShowVerifyModal(true)}
                    securityProtected={true}
                  />
                </div>
              </div>
            </div>
          ) : (
            /* SINGLE INTERACTIVE 3D FLIP CARD VIEW */
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4 no-print border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-[#7A152B]" />
                  <h3 className="text-sm font-bold text-slate-900 font-serif uppercase tracking-wide">
                    Interactive 3D Alumni I-Card
                  </h3>
                </div>
                <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 size={13} /> Active Verified Record
                </span>
              </div>

              <AlumniICard
                data={cardData}
                isFlipped={isFlipped}
                onFlip={() => setIsFlipped(!isFlipped)}
                onOpenVerify={() => setShowVerifyModal(true)}
                securityProtected={true}
              />
            </div>
          )}
        </div>

        {/* ── SECURITY NOTICE FOOTER ─────────────────────────────────────── */}
        <div className="no-print bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#7A152B] flex items-center justify-center shrink-0 border border-amber-200">
              <Lock size={16} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Cryptographically Verified Record</h4>
              <p className="text-[11px] text-slate-500">
                Holder: <strong>HEMANSHU TALA</strong> &nbsp;|&nbsp; ID: <strong className="font-mono text-[#7A152B]">2310400011011</strong> &nbsp;|&nbsp; IITRAM Alumni Association
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowVerifyModal(true)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <QrCode size={14} className="text-[#7A152B]" />
            <span>Verify QR Code</span>
          </button>
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
