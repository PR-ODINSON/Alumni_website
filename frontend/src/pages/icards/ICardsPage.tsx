import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck, QrCode, Lock, CheckCircle2, LayoutGrid, Layers, Sparkles, FileText, AlertCircle, LogIn
} from "lucide-react";
import toast from "react-hot-toast";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import AlumniICard, { type ICardData } from "./components/AlumniICard";
import ICardVerifierModal from "./components/ICardVerifierModal";
import { useAuthStore } from "../../stores/authStore";

interface ICardsPageProps {
  mode?: string;
}

export default function ICardsPage({ mode }: ICardsPageProps) {
  const { user, isAuthenticated } = useAuthStore();

  const cardData: ICardData = React.useMemo(() => {
    if (user) {
      const uAny = user as any;
      const fullName = (user.fullName || `${user.firstName} ${user.lastName}`).toUpperCase();
      const enr = user.enrollmentNumber || "2310400011011";
      return {
        fullName,
        degree: uAny.degreeType || "B.Tech",
        department: uAny.branch || uAny.department || "Mechanical Engineering",
        batch: uAny.graduationYear ? `${uAny.graduationYear - 4} - ${uAny.graduationYear}` : "2023 - 2027",
        membershipNo: `ALUM/IITRAM/${enr}`,
        dateOfIssue: user.donationDate ? new Date(user.donationDate).toLocaleDateString("en-GB") : "07/09/2026",
        membershipType: "LIFE MEMBER",
        photoUrl: user.avatar || "/images/iitram-logo.png",
        email: user.email,
        phone: user.phone || "+91 98765 43210",
        bloodGroup: "O+",
      };
    }
    return {
      fullName: "HEMANSHU TALA",
      degree: "B.Tech",
      department: "Computer Engineering",
      batch: "2023 - 2027",
      membershipNo: "ALUM/IITRAM/2310400011011",
      dateOfIssue: "07/09/2026",
      membershipType: "LIFE MEMBER",
      photoUrl: "/images/iitram-logo.png",
      email: "hemanshu.tala@iitram.ac.in",
      phone: "+91 98765 43210",
      bloodGroup: "O+",
    };
  }, [user]);

  const [viewMode, setViewMode] = useState<"side-by-side" | "flip">("side-by-side");
  const [isFlipped, setIsFlipped] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const frontCaptureRef = useRef<HTMLDivElement>(null);
  const backCaptureRef = useRef<HTMLDivElement>(null);

  const captureFilter = (node: HTMLElement) => {
    if (!node.tagName) return true;
    const tag = node.tagName.toUpperCase();
    if (["IFRAME", "EMBED", "OBJECT", "SCRIPT", "NOSCRIPT"].includes(tag)) return false;
    const src = node.getAttribute?.("src") || "";
    if (src.includes("chrome-extension:") || src.includes("moz-extension:")) return false;
    return true;
  };

  const handleDownloadPDF = async () => {
    if (!frontCaptureRef.current || !backCaptureRef.current) {
      toast.error("Switch to Side-by-Side view first, then download.");
      return;
    }
    toast.loading("Generating PDF...", { id: "pdf-gen" });
    try {
      const [frontImg, backImg] = await Promise.all([
        toPng(frontCaptureRef.current, { quality: 1, pixelRatio: 3, filter: captureFilter }),
        toPng(backCaptureRef.current, { quality: 1, pixelRatio: 3, filter: captureFilter }),
      ]);
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = 12;
      const cardW = pageW - margin * 2;
      const cardH = Math.round(cardW / 1.58);
      const topY = (pageH - cardH) / 2;
      pdf.addImage(frontImg, "PNG", margin, topY, cardW, cardH);
      pdf.addPage();
      pdf.addImage(backImg, "PNG", margin, topY, cardW, cardH);
      const name = (cardData.fullName || "ALUMNI").replace(/\s+/g, "_");
      pdf.save(`IITRAM_Alumni_ICard_${name}.pdf`);
      toast.success("PDF downloaded!", { id: "pdf-gen" });
    } catch (err) {
      toast.error(`Failed: ${err instanceof Error ? err.message : String(err)}`, { id: "pdf-gen" });
    }
  };

  if (!isAuthenticated || !user?.hasDonated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 bg-amber-50 rounded-3xl mx-auto flex items-center justify-center border border-amber-200 shadow-inner">
            <Lock size={38} className="text-[#7A152B]" />
          </div>
          <div>
            <span className="px-3 py-1 bg-[#7A152B]/10 text-[#7A152B] rounded-full text-xs font-extrabold uppercase tracking-wider inline-flex items-center gap-1.5 mb-3">
              <ShieldCheck size={14} className="text-[#C59B27]" /> Donor Restricted Feature
            </span>
            <h2 className="text-2xl font-black text-slate-900 font-display tracking-tight">Alumni ID Card Access Restricted</h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed font-medium">
              Official Digital Alumni Identity Cards are exclusively reserved for verified <strong>Alumni Donors</strong>.
            </p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-left text-xs text-slate-600 space-y-1">
            {isAuthenticated ? (
              <>
                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                  <AlertCircle size={14} className="text-amber-600" /> Account: {user?.fullName} ({user?.email})
                </p>
                <p className="text-slate-500">No donation record found. Sign in with your donor Enrollment Number.</p>
              </>
            ) : (
              <p className="text-slate-600 text-center font-medium">
                Please log in with your <strong>Enrollment Number</strong> to unlock your Alumni ID Card.
              </p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {!isAuthenticated ? (
              <Link to="/login" className="flex-1 py-3 px-4 bg-[#7A152B] hover:bg-[#600f21] text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2">
                <LogIn size={16} /> Sign In with Enrollment No.
              </Link>
            ) : (
              <Link to="/feed" className="flex-1 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2">
                Return to Community Feed
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16 pt-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">

        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 bg-amber-50 border border-amber-200 text-[#7A152B] rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck size={13} className="text-[#C59B27]" /> IITRAM Official Alumni Card
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-display tracking-tight">Digital Identity Card</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200/80">
              <button type="button" onClick={() => setViewMode("side-by-side")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${viewMode === "side-by-side" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"}`}>
                <LayoutGrid size={14} /> Side-by-Side
              </button>
              <button type="button" onClick={() => setViewMode("flip")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${viewMode === "flip" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"}`}>
                <Layers size={14} /> 3D Flip
              </button>
            </div>
            <button type="button" onClick={handleDownloadPDF}
              className="px-4 py-2 bg-[#7A152B] hover:bg-[#600f21] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer">
              <FileText size={15} className="text-amber-300" /> Download PDF
            </button>
          </div>
        </div>

        {viewMode === "side-by-side" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <div className="bg-white p-5 sm:p-7 rounded-none border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-[#7A152B] uppercase tracking-wider flex items-center gap-1.5 font-serif">
                  <Sparkles size={14} /> Front View
                </span>
                <span className="text-[11px] font-bold text-slate-400">Official Replica</span>
              </div>
              <div ref={frontCaptureRef}>
                <AlumniICard data={cardData} side="front" onOpenVerify={() => setShowVerifyModal(true)} securityProtected={false} />
              </div>
            </div>
            <div className="bg-white p-5 sm:p-7 rounded-none border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-[#7A152B] uppercase tracking-wider flex items-center gap-1.5 font-serif">
                  <Sparkles size={14} /> Back View
                </span>
                <span className="text-[11px] font-bold text-slate-400">Membership Privileges</span>
              </div>
              <div ref={backCaptureRef}>
                <AlumniICard data={cardData} side="back" onOpenVerify={() => setShowVerifyModal(true)} securityProtected={false} />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 sm:p-8 rounded-none border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#7A152B]" />
                <h3 className="text-sm font-bold text-slate-900 font-serif uppercase tracking-wide">Interactive 3D Alumni I-Card</h3>
              </div>
              <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 size={13} /> Active Verified Record
              </span>
            </div>
            <AlumniICard data={cardData} isFlipped={isFlipped} onFlip={() => setIsFlipped(!isFlipped)} onOpenVerify={() => setShowVerifyModal(true)} securityProtected={true} />
          </div>
        )}

      </div>
      <ICardVerifierModal isOpen={showVerifyModal} onClose={() => setShowVerifyModal(false)} data={cardData} />
    </div>
  );
}
