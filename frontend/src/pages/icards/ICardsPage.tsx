import React, { useState } from 'react';
import {
  Download, ShieldCheck, QrCode, Lock, CheckCircle2, LayoutGrid, Layers, Sparkles, FileText
} from 'lucide-react';
import toast from 'react-hot-toast';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
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

  // Helper to find valid capture element
  const getCaptureElement = (id: string, selectorClass: string): HTMLElement | null => {
    const offscreenEl = document.getElementById(id);
    if (offscreenEl && offscreenEl.offsetWidth > 0) {
      return offscreenEl;
    }
    const visibleEls = document.querySelectorAll(selectorClass);
    for (let i = 0; i < visibleEls.length; i++) {
      const el = visibleEls[i] as HTMLElement;
      if (el.offsetWidth > 0 && el.offsetHeight > 0) {
        return el;
      }
    }
    return offscreenEl || (document.querySelector(selectorClass) as HTMLElement);
  };

  // Filter function for html-to-image to skip extension-injected nodes
  const captureFilter = (node: HTMLElement) => {
    if (!node.tagName) return true;
    const tag = node.tagName.toUpperCase();
    if (tag === 'IFRAME' || tag === 'EMBED' || tag === 'OBJECT' || tag === 'SCRIPT' || tag === 'NOSCRIPT') {
      return false;
    }
    const src = (node.getAttribute?.('src') || '').toLowerCase();
    const href = (node.getAttribute?.('href') || '').toLowerCase();
    if (src.includes('chrome-extension:') || src.includes('moz-extension:') || src.includes('invalid') || src.includes('jobright')) {
      return false;
    }
    if (href.includes('chrome-extension:') || href.includes('moz-extension:') || href.includes('invalid') || href.includes('jobright')) {
      return false;
    }
    return true;
  };

  // ══════════════════════════════════════════════════════════════════════════
  // DIRECT HIGH-RES PDF DOWNLOAD (JSPDF + HTML-TO-IMAGE)
  // ══════════════════════════════════════════════════════════════════════════
  const handleDownloadPDF = async () => {
    toast.loading('Generating Official Both-Sides PDF Document...', { id: 'pdf-gen' });

    try {
      const frontEl = getCaptureElement('capture-front-node', '.front-card-node');
      const backEl = getCaptureElement('capture-back-node', '.back-card-node');

      if (!frontEl || !backEl) {
        toast.error('Card artwork nodes not ready for capture.', { id: 'pdf-gen' });
        return;
      }

      // Convert DOM nodes natively using SVG foreignObject (0 oklch parser bugs)
      const frontImgData = await toPng(frontEl, { quality: 1, pixelRatio: 3, filter: captureFilter });
      const backImgData = await toPng(backEl, { quality: 1, pixelRatio: 3, filter: captureFilter });

      // Create PDF Document (A4 Portrait)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth(); // 210mm
      const margin = 15; // 15mm
      const cardWidth = pageWidth - margin * 2; // 180mm
      const cardHeight = Math.round((cardWidth * 1) / 1.58); // ~114mm

      // ── PDF HEADER ───────────────────────────────────────────────────────
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(13);
      pdf.setTextColor(122, 21, 43); // Maroon #7A152B
      pdf.text('INSTITUTE OF INFRASTRUCTURE, TECHNOLOGY, RESEARCH AND MANAGEMENT', pageWidth / 2, 18, { align: 'center' });

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8.5);
      pdf.setTextColor(100, 116, 139);
      pdf.text('OFFICIAL ALUMNI ASSOCIATION DIGITAL IDENTITY CARD DOCUMENT | ID: 2310400011011', pageWidth / 2, 24, { align: 'center' });

      pdf.setLineWidth(0.5);
      pdf.setDrawColor(197, 155, 39); // Gold #C59B27
      pdf.line(margin, 27, pageWidth - margin, 27);

      // ── FRONT CARD SECTION ───────────────────────────────────────────────
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8.5);
      pdf.setTextColor(122, 21, 43);
      pdf.text('FRONT VIEW (OFFICIAL IDENTITY ARTWORK)', margin, 34);
      pdf.setFontSize(8);
      pdf.setTextColor(100, 116, 139);
      pdf.text('Holder: HEMANSHU TALA', pageWidth - margin, 34, { align: 'right' });

      pdf.addImage(frontImgData, 'PNG', margin, 37, cardWidth, cardHeight);

      // ── BACK CARD SECTION ────────────────────────────────────────────────
      const backSectionY = 37 + cardHeight + 10;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8.5);
      pdf.setTextColor(122, 21, 43);
      pdf.text('BACK VIEW (MEMBERSHIP PRIVILEGES & VERIFICATION)', margin, backSectionY);
      pdf.setFontSize(8);
      pdf.setTextColor(16, 185, 129); // Emerald
      pdf.text('Status: Active Verified Member', pageWidth - margin, backSectionY, { align: 'right' });

      pdf.addImage(backImgData, 'PNG', margin, backSectionY + 3, cardWidth, cardHeight);

      // ── PDF FOOTER ───────────────────────────────────────────────────────
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7.5);
      pdf.setTextColor(148, 163, 184);
      pdf.text('Cryptographically Verified Document. Issued by IITRAM Alumni Association, Ahmedabad, Gujarat.', pageWidth / 2, 285, { align: 'center' });

      // Save PDF file directly to downloads
      pdf.save('IITRAM_Alumni_ICard_HEMANSHU_TALA_2310400011011.pdf');
      toast.success('Downloaded Official PDF Document!', { id: 'pdf-gen' });
    } catch (err) {
      console.error('PDF Export Error:', err);
      toast.error(`PDF generation failed: ${err instanceof Error ? err.message : String(err)}`, { id: 'pdf-gen' });
    }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // EXACT DOM FRONT PNG DOWNLOAD (HTML-TO-IMAGE)
  // ══════════════════════════════════════════════════════════════════════════
  const handleDownloadFrontPNG = async () => {
    toast.loading('Downloading Exact Front I-Card Image...', { id: 'dl-front' });
    try {
      const frontEl = getCaptureElement('capture-front-node', '.front-card-node');
      if (!frontEl) {
        toast.error('Front card not visible for download.', { id: 'dl-front' });
        return;
      }
      const dataUrl = await toPng(frontEl, { quality: 1, pixelRatio: 3, filter: captureFilter });
      const link = document.createElement('a');
      link.download = `IITRAM_Alumni_ICard_Front_HEMANSHU_TALA.png`;
      link.href = dataUrl;
      link.click();
      toast.success('Downloaded Front I-Card Image!', { id: 'dl-front' });
    } catch (err) {
      console.error('Front PNG Download Error:', err);
      toast.error(`Failed to download Front image: ${err instanceof Error ? err.message : String(err)}`, { id: 'dl-front' });
    }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // EXACT DOM BACK PNG DOWNLOAD (HTML-TO-IMAGE)
  // ══════════════════════════════════════════════════════════════════════════
  const handleDownloadBackPNG = async () => {
    toast.loading('Downloading Exact Back I-Card Image...', { id: 'dl-back' });
    try {
      const backEl = getCaptureElement('capture-back-node', '.back-card-node');
      if (!backEl) {
        toast.error('Back card not visible for download.', { id: 'dl-back' });
        return;
      }
      const dataUrl = await toPng(backEl, { quality: 1, pixelRatio: 3, filter: captureFilter });
      const link = document.createElement('a');
      link.download = `IITRAM_Alumni_ICard_Back_HEMANSHU_TALA.png`;
      link.href = dataUrl;
      link.click();
      toast.success('Downloaded Back I-Card Image!', { id: 'dl-back' });
    } catch (err) {
      console.error('Back PNG Download Error:', err);
      toast.error(`Failed to download Back image: ${err instanceof Error ? err.message : String(err)}`, { id: 'dl-back' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16 pt-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* ── CLEAN TOP BAR ────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 bg-amber-50 border border-amber-200 text-[#7A152B] rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck size={13} className="text-[#C59B27]" /> IITRAM Official Alumni Card
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: 2310400011011</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-display tracking-tight">
              Digital Identity Card Document
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
              onClick={handleDownloadPDF}
              className="px-4 py-2 bg-[#7A152B] hover:bg-[#600f21] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <FileText size={15} className="text-amber-300" />
              <span>Download PDF</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadFrontPNG}
              className="px-3.5 py-2 bg-[#C59B27] hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={14} />
              <span>Front PNG</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadBackPNG}
              className="px-3.5 py-2 bg-[#C59B27] hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={14} />
              <span>Back PNG</span>
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
                <div className="bg-white p-5 sm:p-7 rounded-none border border-slate-200 shadow-xs space-y-3">
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
                <div className="bg-white p-5 sm:p-7 rounded-none border border-slate-200 shadow-xs space-y-3">
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
            <div className="bg-white p-6 sm:p-8 rounded-none border border-slate-200 shadow-xs">
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

      {/* Off-screen clean nodes reserved for 100% reliable 3x capture */}
      <div
        className="no-print pointer-events-none"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '580px',
          opacity: 0.01,
          zIndex: -9999,
          pointerEvents: 'none',
          overflow: 'hidden',
          height: '1px',
        }}
      >
        <div id="capture-front-node" style={{ width: '580px', height: '367px', backgroundColor: '#ffffff' }}>
          <AlumniICard data={cardData} side="front" securityProtected={false} />
        </div>
        <div id="capture-back-node" style={{ width: '580px', height: '367px', backgroundColor: '#ffffff', marginTop: '20px' }}>
          <AlumniICard data={cardData} side="back" securityProtected={false} />
        </div>
      </div>
    </div>
  );
}
