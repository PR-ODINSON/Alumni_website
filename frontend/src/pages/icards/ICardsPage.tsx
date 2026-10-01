import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck, Lock, CheckCircle2, LayoutGrid, Layers, Sparkles,
  FileText, AlertCircle, LogIn, Users2, Image, Download
} from "lucide-react";
import toast from "react-hot-toast";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import AlumniICard, { type ICardData } from "./components/AlumniICard";
import ICardVerifierModal from "./components/ICardVerifierModal";
import { convocationPhotoCandidates } from '../../lib/convocationPhoto';
import { useAuthStore } from "../../stores/authStore";

interface ICardsPageProps {
  mode?: string;
}

export default function ICardsPage({ mode }: ICardsPageProps) {
  const { user, isAuthenticated } = useAuthStore();
  const [viewMode, setViewMode] = useState<"side-by-side" | "flip">("side-by-side");
  const [isFlipped, setIsFlipped] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [localPhoto, setLocalPhoto] = useState<string | null>(null);

  const cardData: ICardData = React.useMemo(() => {
    if (user) {
      const uAny = user as any;
      const fullName = (user.fullName || `${user.firstName} ${user.lastName}`).toUpperCase();
      const enr = user.enrollmentNumber || "";
      const convPhotos = convocationPhotoCandidates(enr, user.avatar);
      const photoUrl = localPhoto || convPhotos[0];

      return {
        fullName,
        degree: uAny.degreeType || "B.Tech",
        department: uAny.branch || uAny.department || "Mechanical Engineering",
        batch: uAny.batch && uAny.graduationYear ? `${uAny.batch} - ${uAny.graduationYear}` : "",
        completionYear: uAny.graduationYear ? String(uAny.graduationYear) : undefined,
        membershipNo: `ALUM/IITRAM/${enr}`,
        dateOfIssue: user.donationDate ? new Date(user.donationDate).toLocaleDateString("en-GB") : "07/09/2026",
        membershipType: "LIFE MEMBER",
        photoUrl,
        convPhotoFallback: `/convocation_photos/${enr}.jpeg`,
        email: user.email,
        phone: user.phone || "",
        bloodGroup: "O+",
        enrollmentNumber: enr,
        address: uAny.permanentAddress || uAny.address || [uAny.location?.city, uAny.location?.state].filter(Boolean).join(', ') || "",
      };
    }
    return {
      fullName: "HEMANSHU TALA",
      degree: "B.Tech",
      department: "Computer Engineering",
      batch: "2023 - 2027",
      completionYear: "2027",
      membershipNo: "ALUM/IITRAM/2310400011011",
      dateOfIssue: "07/09/2026",
      membershipType: "LIFE MEMBER",
      photoUrl: "/convocation_photos/2310400011011.jpeg",
      email: "hemanshu.tala@iitram.ac.in",
      phone: "+91 98765 43210",
      bloodGroup: "O+",
      enrollmentNumber: "2310400011011",
      address: "Ahmedabad, Gujarat - 380026",
    };
  }, [user, localPhoto]);

  const effectiveCardData: ICardData = React.useMemo(() => ({
    ...cardData,
    photoUrl: localPhoto || cardData.photoUrl,
  }), [cardData, localPhoto]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setLocalPhoto(ev.target?.result as string);
    reader.readAsDataURL(file);
    toast.success("Photo updated for this session");
  };

  const frontPdfRef = useRef<HTMLDivElement>(null);
  const backPdfRef = useRef<HTMLDivElement>(null);

  const captureFilter = (node: HTMLElement) => {
    if (!node.tagName) return true;
    const tag = node.tagName.toUpperCase();
    if (["IFRAME", "EMBED", "OBJECT", "SCRIPT", "NOSCRIPT"].includes(tag)) return false;
    const src = node.getAttribute?.("src") || "";
    if (src.includes("chrome-extension:") || src.includes("moz-extension:")) return false;
    return true;
  };

  const handleDownloadPDF = async () => {
    if (!frontPdfRef.current || !backPdfRef.current) {
      toast.error("PDF generation elements not ready.");
      return;
    }
    toast.loading("Generating high-resolution PDF...", { id: "pdf-gen" });
    try {
      const [frontImg, backImg] = await Promise.all([
        toPng(frontPdfRef.current, { quality: 1, pixelRatio: 3, filter: captureFilter, cacheBust: true }),
        toPng(backPdfRef.current, { quality: 1, pixelRatio: 3, filter: captureFilter, cacheBust: true }),
      ]);
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth(); // 297 mm
      const pageH = pdf.internal.pageSize.getHeight(); // 210 mm
      const cardW = 280; // mm
      const cardH = 160; // mm (1050 / 600 = 1.75 ratio)
      const margin = (pageW - cardW) / 2; // 8.5 mm
      const topY = (pageH - cardH) / 2; // 25 mm
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

  const handleDownloadPNG = async () => {
    if (!frontPdfRef.current || !backPdfRef.current) {
      toast.error("PNG generation elements not ready.");
      return;
    }
    toast.loading("Generating PNG images...", { id: "png-gen" });
    try {
      const [frontImg, backImg] = await Promise.all([
        toPng(frontPdfRef.current, { quality: 1, pixelRatio: 3, filter: captureFilter, cacheBust: true }),
        toPng(backPdfRef.current, { quality: 1, pixelRatio: 3, filter: captureFilter, cacheBust: true }),
      ]);
      const name = (cardData.fullName || "ALUMNI").replace(/\s+/g, "_");
      const triggerDownload = (dataUrl: string, filename: string) => {
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      };
      triggerDownload(frontImg, `IITRAM_AlumniCard_Front_${name}.png`);
      await new Promise(r => setTimeout(r, 300));
      triggerDownload(backImg, `IITRAM_AlumniCard_Back_${name}.png`);
      toast.success("PNG images downloaded!", { id: "png-gen" });
    } catch (err) {
      toast.error(`Failed: ${err instanceof Error ? err.message : String(err)}`, { id: "png-gen" });
    }
  };

  // Access control: alumni, faculty, and admin can view ICard — students cannot
  const canAccessICard = isAuthenticated && (
    user?.role === 'alumni' || user?.role === 'admin' || user?.role === 'faculty'
  );

  if (user?.role === 'student') {
    return (
      <div className="py-16 max-w-2xl mx-auto px-4 text-center font-sans">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-8 sm:p-12 shadow-xs">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100 text-[#0169FC]">
            <Lock size={28} />
          </div>
          <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[#001f54] text-xs font-bold mb-3 border border-blue-100">
            Alumni Exclusive Privilege
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 mb-2">
            Institutional Alumni I-Card
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mb-6 leading-relaxed max-w-md mx-auto font-medium">
            Digital Life Member Identity Cards are issued exclusively to graduated alumni of IITRAM. Current students can access student mentorship, research hubs, directory, and placement resources.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/directory" className="btn btn-primary btn-sm text-xs font-bold w-full sm:w-auto">
              Explore Directory
            </Link>
            <Link to="/mentorship" className="btn btn-outline btn-sm text-xs font-bold w-full sm:w-auto">
              Find Alumni Mentors
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 bg-amber-50 rounded-3xl mx-auto flex items-center justify-center border border-amber-200 shadow-inner">
            <Lock size={38} className="text-[#7A152B]" />
          </div>
          <div>
            <span className="px-3 py-1 bg-[#7A152B]/10 text-[#7A152B] rounded-full text-xs font-extrabold uppercase tracking-wider inline-flex items-center gap-1.5 mb-3">
              <ShieldCheck size={14} className="text-[#7A152B]" /> Sign In Required
            </span>
            <h2 className="text-2xl font-black text-slate-900 font-display tracking-tight">Alumni ID Card</h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed font-medium">
              Please sign in with your IITRAM alumni account to access your Digital ID Card.
            </p>
          </div>
          <Link to="/login" className="inline-flex items-center justify-center gap-2 py-3 px-6 bg-[#7A152B] hover:bg-[#600f21] text-white font-bold rounded-xl text-sm transition-all shadow-md">
            <LogIn size={16} /> Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (!canAccessICard) {
    // Logged in but not an alumni/admin/faculty (i.e. student)
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 bg-amber-50 rounded-3xl mx-auto flex items-center justify-center border border-amber-200 shadow-inner">
            <ShieldCheck size={38} className="text-amber-600" />
          </div>
          <div>
            <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-extrabold uppercase tracking-wider inline-flex items-center gap-1.5 mb-3">
              <AlertCircle size={14} /> Alumni Only Feature
            </span>
            <h2 className="text-2xl font-black text-slate-900 font-display tracking-tight">Alumni ID Cards</h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed font-medium">
              Digital Alumni ID Cards are exclusively available to <strong>IITRAM Alumni</strong>. Students will receive access after graduation.
            </p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-left text-xs text-slate-600">
            <p className="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
              <AlertCircle size={13} className="text-amber-600" /> Signed in as: {user?.firstName} {user?.lastName}
            </p>
            <p className="text-slate-500">Account type: <strong className="capitalize">{user?.role}</strong></p>
            <p className="text-slate-400 mt-1">This feature becomes available once your alumni status is confirmed.</p>
          </div>
          <Link to="/feed" className="inline-flex items-center justify-center gap-2 py-3 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-all shadow-md">
            Return to Community Feed
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16 pt-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-5">

        {/* Header bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 bg-amber-50 border border-amber-200 text-[#7A152B] rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck size={13} className="text-[#C59B27]" /> IITRAM Official Alumni Card
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-display tracking-tight">Digital Identity Card</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
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
            <Link to="/icards/bulk" className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5">
              <Users2 size={15} className="text-amber-300" /> Bulk Generator
            </Link>
            <button type="button" onClick={handleDownloadPNG}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer">
              <Image size={15} /> Download PNG
            </button>
            <button type="button" onClick={handleDownloadPDF}
              className="px-4 py-2 bg-[#7A152B] hover:bg-[#600f21] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer">
              <FileText size={15} className="text-amber-300" /> Download PDF
            </button>
          </div>
        </div>

        {/* Photo Upload panel — for when no profile photo is in DB */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Download size={13} /> Customise Card Photo
          </p>
          <div className="flex items-center gap-4">
            {/* Photo upload */}
            <label className="flex items-center gap-3 p-3 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-[#7A152B]/40 hover:bg-slate-50 transition-colors flex-1 max-w-sm">
              {localPhoto ? (
                <img src={localPhoto} alt="Photo preview" className="w-12 h-14 object-cover rounded-lg border border-slate-200" />
              ) : user?.avatar ? (
                <img src={user.avatar} alt="Current photo" className="w-12 h-14 object-cover rounded-lg border border-slate-200" />
              ) : (
                <div className="w-12 h-14 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Image size={20} className="text-slate-400" />
                </div>
              )}
              <div>
                <p className="text-xs font-semibold text-slate-700">
                  {localPhoto ? "Photo updated ✓" : user?.avatar ? "Change photo" : "Upload photo"}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">JPG, PNG · Used on card front</p>
              </div>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
            <p className="text-[10px] text-slate-400 flex-1">Photo is used for this session only. To permanently update, change your profile avatar in <strong>Edit Profile</strong>.</p>
          </div>
        </div>

        {/* Card Display */}
        {viewMode === "side-by-side" ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 items-start">
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-[#7A152B] uppercase tracking-wider flex items-center gap-1.5 font-serif">
                  <Sparkles size={14} /> Front View
                </span>
                <span className="text-[11px] font-bold text-slate-400">Official Replica</span>
              </div>
              {/* Card fills full panel width and scales internally */}
              <AlumniICard data={effectiveCardData} side="front" onOpenVerify={() => setShowVerifyModal(true)} securityProtected={false} />
            </div>
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-[#1a5a7a] uppercase tracking-wider flex items-center gap-1.5 font-serif">
                  <Sparkles size={14} /> Back View
                </span>
                <span className="text-[11px] font-bold text-slate-400">Contact &amp; Details</span>
              </div>
              <div className="py-3">
                <AlumniICard data={effectiveCardData} side="back" onOpenVerify={() => setShowVerifyModal(true)} securityProtected={false} />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#7A152B]" />
                <h3 className="text-sm font-bold text-slate-900 font-serif uppercase tracking-wide">Interactive 3D Alumni I-Card</h3>
              </div>
              <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 size={13} /> Active Verified Record
              </span>
            </div>
            <AlumniICard data={effectiveCardData} isFlipped={isFlipped} onFlip={() => setIsFlipped(!isFlipped)} onOpenVerify={() => setShowVerifyModal(true)} securityProtected={true} />
          </div>
        )}

        {/* Hidden off-screen capture targets for pristine 1050x600 PDF/PNG generation */}
        <div
          className="pointer-events-none fixed overflow-hidden bg-white"
          style={{ width: "1050px", height: "1220px", opacity: 1, top: 0, left: "-9999px" }}
          aria-hidden="true"
        >
          <div ref={frontPdfRef} style={{ width: "1050px", height: "600px" }}>
            <AlumniICard data={effectiveCardData} side="front" securityProtected={false} />
          </div>
          <div ref={backPdfRef} style={{ width: "1050px", height: "600px", marginTop: "20px" }}>
            <AlumniICard data={effectiveCardData} side="back" securityProtected={false} />
          </div>
        </div>

      </div>
      <ICardVerifierModal isOpen={showVerifyModal} onClose={() => setShowVerifyModal(false)} data={effectiveCardData} />
    </div>
  );
}
