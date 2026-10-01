import React, { useState, useRef, useCallback } from 'react';
import {
  Upload, FileText, Users, Download, CheckCircle2, AlertCircle,
  Loader2, Trash2, Eye, Image, ChevronDown, ChevronUp, X,
  PackageOpen, Sparkles, FileSpreadsheet, FolderOpen, PlayCircle, RotateCcw
} from 'lucide-react';
import toast from 'react-hot-toast';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import AlumniICard, { type ICardData } from './components/AlumniICard';

if (typeof window !== 'undefined') {
  (window as any).htmlToImage = { toPng };
  (window as any).jspdf = { jsPDF };
}

/* ─── Types ────────────────────────────────────────────────────────────────── */

interface AlumniRow {
  id: string;
  fullName: string;
  degree: string;
  department: string;
  batch: string;
  enrollmentNo: string;
  dateOfIssue: string;
  membershipType: string;
  email: string;
  phone: string;
  bloodGroup?: string;
  address?: string;
  photoFile?: File;
  photoUrl?: string;
  status: 'pending' | 'processing' | 'done' | 'error';
  errorMsg?: string;
  pdfBlob?: Blob;
  pdfName?: string;
}

/* ─── CSV Parser ───────────────────────────────────────────────────────────── */

function parseCSV(text: string): AlumniRow[] {
  const parseCSVRows = (csvText: string): string[][] => {
    const rows: string[][] = [];
    let curRow: string[] = [];
    let curVal = '';
    let inQuotes = false;

    for (let i = 0; i < csvText.length; i++) {
      const char = csvText[i];
      const nextChar = csvText[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          curVal += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        curRow.push(curVal.trim());
        curVal = '';
      } else if ((char === '\r' || char === '\n') && !inQuotes) {
        if (char === '\r' && nextChar === '\n') i++;
        curRow.push(curVal.trim());
        if (curRow.some(c => c.length > 0)) {
          rows.push(curRow);
        }
        curRow = [];
        curVal = '';
      } else {
        curVal += char;
      }
    }
    if (curVal || curRow.length > 0) {
      curRow.push(curVal.trim());
      if (curRow.some(c => c.length > 0)) {
        rows.push(curRow);
      }
    }
    return rows;
  };

  const allRows = parseCSVRows(text);
  if (allRows.length < 2) return [];

  const headers = allRows[0].map(h => h.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''));

  const findCol = (...keys: string[]) => {
    for (const k of keys) {
      const idx = headers.findIndex(h => h.includes(k));
      if (idx !== -1) return idx;
    }
    return -1;
  };

  const cols = {
    fullName: findCol('full_name', 'name', 'student_name', 'alumnus'),
    degree: findCol('degree', 'programme', 'program'),
    department: findCol('department', 'branch', 'dept'),
    batch: findCol('batch', 'year', 'graduation'),
    enrollmentNo: findCol('enrollment', 'enrol', 'roll', 'id'),
    dateOfIssue: findCol('date', 'dob', 'issue'),
    membershipType: findCol('membership', 'type', 'member_type'),
    email: findCol('email', 'mail'),
    phone: findCol('phone', 'mobile', 'contact', 'tel'),
    bloodGroup: findCol('blood', 'bg'),
    address: findCol('address', 'addr', 'permanent_address'),
    photoUrl: findCol('photo_url', 'photo', 'image', 'picture'),
  };

  return allRows.slice(1).map((cells, i) => {
    const g = (idx: number) => (idx >= 0 ? cells[idx] || '' : '');
    const enr = g(cols.enrollmentNo) || `ENR${String(i + 1).padStart(5, '0')}`;
    const rawPhoto = g(cols.photoUrl);
    const photoUrl = rawPhoto || `/convocation_photos/${enr}.jpg`;

    return {
      id: `row_${i}_${Date.now()}`,
      fullName: (g(cols.fullName) || `Alumni ${i + 1}`).toUpperCase(),
      degree: g(cols.degree) || 'B.Tech',
      department: g(cols.department) || 'Engineering',
      batch: g(cols.batch) || '2023 - 2027',
      enrollmentNo: enr,
      dateOfIssue: g(cols.dateOfIssue) || new Date().toLocaleDateString('en-GB'),
      membershipType: g(cols.membershipType) || 'LIFE MEMBER',
      email: g(cols.email) || 'alumni@iitram.ac.in',
      phone: g(cols.phone) || '+91 98765 43210',
      bloodGroup: g(cols.bloodGroup) || undefined,
      address: g(cols.address) || undefined,
      photoFile: undefined,
      photoUrl: photoUrl,
      status: 'pending',
    };
  });
}

/* ─── Hidden card renderer for PDF capture ────────────────────────────────── */

function HiddenCardPair({
  data,
  frontRef,
  backRef,
}: {
  data: ICardData;
  frontRef: React.RefObject<HTMLDivElement | null>;
  backRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      className="pointer-events-none fixed -left-[9999px] top-0 overflow-hidden bg-white"
      style={{ width: '1050px', height: '600px', opacity: 1, backgroundColor: '#ffffff' }}
      aria-hidden="true"
    >
      <div ref={frontRef} style={{ width: '1050px', height: '600px' }}>
        <AlumniICard data={data} side="front" securityProtected={false} />
      </div>
      <div ref={backRef} style={{ width: '1050px', height: '600px', marginTop: '20px' }}>
        <AlumniICard data={data} side="back" securityProtected={false} />
      </div>
    </div>
  );
}

/* ─── Status badge ─────────────────────────────────────────────────────────── */

function StatusBadge({ status, errorMsg }: { status: AlumniRow['status']; errorMsg?: string }) {
  const map = {
    pending:    { cls: 'bg-slate-100 text-slate-600 border-slate-200', label: 'Pending' },
    processing: { cls: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Processing' },
    done:       { cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Done' },
    error:      { cls: 'bg-red-50 text-red-600 border-red-200', label: 'Error' },
  };
  const { cls, label } = map[status];
  return (
    <span
      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${cls}`}
      title={errorMsg}
    >
      {status === 'processing' && <Loader2 size={10} className="animate-spin" />}
      {status === 'done' && <CheckCircle2 size={10} />}
      {status === 'error' && <AlertCircle size={10} />}
      {label}
    </span>
  );
}

/* ─── Preview Modal ────────────────────────────────────────────────────────── */

function PreviewModal({ row, onClose }: { row: AlumniRow; onClose: () => void }) {
  const icard: ICardData = {
    fullName: row.fullName,
    degree: row.degree,
    department: row.department,
    batch: row.batch,
    membershipNo: `ALUM/IITRAM/${row.enrollmentNo}`,
    dateOfIssue: row.dateOfIssue,
    membershipType: row.membershipType,
    photoUrl: row.photoUrl,
    email: row.email,
    phone: row.phone,
    bloodGroup: row.bloodGroup,
    enrollmentNumber: row.enrollmentNo,
    address: (row as any).address || '',
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl p-6 max-w-3xl w-full space-y-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-black text-slate-900 text-lg font-serif">{row.fullName}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-[#7A152B] uppercase tracking-wider">Front</p>
            <AlumniICard data={icard} side="front" securityProtected={false} />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-[#7A152B] uppercase tracking-wider">Back</p>
            <AlumniICard data={icard} side="back" securityProtected={false} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ───────────────────────────────────────────────────────── */

export default function BulkICardGenerator() {
  const [rows, setRows] = useState<AlumniRow[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [previewRow, setPreviewRow] = useState<AlumniRow | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPdfs, setGeneratedPdfs] = useState<{ name: string; blob: Blob }[]>([]);
  const [dragOver, setDragOver] = useState<'csv' | 'photos' | null>(null);

  const csvInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const frontRefs = useRef<Record<string, React.RefObject<HTMLDivElement | null>>>({});
  const backRefs  = useRef<Record<string, React.RefObject<HTMLDivElement | null>>>({});

  const getRef = (map: typeof frontRefs, id: string) => {
    if (!map.current[id]) map.current[id] = React.createRef<HTMLDivElement>();
    return map.current[id];
  };

  /* ── CSV Upload ── */
  const handleLoadPreprocessedCSV = async () => {
    try {
      toast.loading("Loading 129 Graduated Alumni CSV...", { id: "load-csv" });
      const res = await fetch("/alumni_data_bulk.csv");
      if (!res.ok) throw new Error("CSV file not found");
      const text = await res.text();
      const parsed = parseCSV(text);
      if (!parsed.length) {
        toast.error("No valid records found.", { id: "load-csv" });
        return;
      }
      parsed.forEach(r => {
        if (!frontRefs.current[r.id]) frontRefs.current[r.id] = React.createRef<HTMLDivElement>();
        if (!backRefs.current[r.id])  backRefs.current[r.id]  = React.createRef<HTMLDivElement>();
      });
      setRows(parsed);
      setGeneratedPdfs([]);
      toast.success(`Loaded ${parsed.length} graduated alumni records!`, { id: "load-csv" });
    } catch (err) {
      toast.error(`Failed to load CSV: ${err instanceof Error ? err.message : String(err)}`, { id: "load-csv" });
    }
  };

  const handleCSVFile = (file: File) => {
    if (!file.name.match(/\.(csv|txt)$/i)) {
      toast.error('Please upload a CSV file (.csv or .txt)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsed = parseCSV(text);
      if (!parsed.length) {
        toast.error('No valid rows found in CSV. Check your headers.');
        return;
      }
      parsed.forEach(r => {
        if (!frontRefs.current[r.id]) frontRefs.current[r.id] = React.createRef<HTMLDivElement>();
        if (!backRefs.current[r.id])  backRefs.current[r.id]  = React.createRef<HTMLDivElement>();
      });
      setRows(parsed);
      setGeneratedPdfs([]);
      toast.success(`Loaded ${parsed.length} alumni records`);
    };
    reader.readAsText(file);
  };

  const handleCSVDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(null);
    const file = e.dataTransfer.files[0];
    if (file) handleCSVFile(file);
  };

  /* ── Photo Upload ── */
  const handlePhotos = (files: FileList) => {
    const photoMap: Record<string, File> = {};
    Array.from(files).forEach(f => {
      const stem = f.name.replace(/\.[^.]+$/, '').toLowerCase().replace(/\s+/g, '_');
      photoMap[stem] = f;
    });

    setRows(prev => prev.map(row => {
      const enrKey = row.enrollmentNo.toLowerCase().replace(/\s+/g, '_');
      const nameKey = row.fullName.toLowerCase().replace(/\s+/g, '_');
      const matched = photoMap[enrKey] || photoMap[nameKey] ||
        Object.entries(photoMap).find(([k]) => k.includes(enrKey) || enrKey.includes(k))?.[1];
      if (matched) {
        const url = URL.createObjectURL(matched);
        return { ...row, photoFile: matched, photoUrl: url };
      }
      return row;
    }));

    toast.success(`${Array.from(files).length} photos loaded`);
  };

  const handlePhotoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(null);
    const files = e.dataTransfer.files;
    if (files.length) handlePhotos(files);
  };

  /* ── Generate PDFs ── */
  const captureFilter = (node: HTMLElement) => {
    if (!node.tagName) return true;
    const tag = node.tagName.toUpperCase();
    if (['IFRAME', 'EMBED', 'OBJECT', 'SCRIPT', 'NOSCRIPT'].includes(tag)) return false;
    return true;
  };

  const generateSinglePdf = async (row: AlumniRow, frontEl: HTMLDivElement, backEl: HTMLDivElement): Promise<Blob> => {
    const [frontImg, backImg] = await Promise.all([
      toPng(frontEl, { quality: 1, pixelRatio: 3, filter: captureFilter, cacheBust: true }),
      toPng(backEl,  { quality: 1, pixelRatio: 3, filter: captureFilter, cacheBust: true }),
    ]);
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const pageW = pdf.internal.pageSize.getWidth(); // 297 mm
    const pageH = pdf.internal.pageSize.getHeight(); // 210 mm
    const cardW = 280; // mm
    const cardH = 160; // mm (1050 / 600 = 1.75 ratio)
    const margin = (pageW - cardW) / 2; // 8.5 mm
    const topY = (pageH - cardH) / 2; // 25 mm
    pdf.addImage(frontImg, 'PNG', margin, topY, cardW, cardH);
    pdf.addPage();
    pdf.addImage(backImg, 'PNG', margin, topY, cardW, cardH);
    return pdf.output('blob');
  };

  const handleGenerate = async () => {
    if (!rows.length) {
      toast.error('Upload a CSV first!');
      return;
    }
    setIsGenerating(true);
    setGeneratedPdfs([]);
    const results: { name: string; blob: Blob }[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      setRows(prev => prev.map(r => r.id === row.id ? { ...r, status: 'processing' } : r));
      await new Promise(res => setTimeout(res, 300));

      const frontEl = frontRefs.current[row.id]?.current;
      const backEl  = backRefs.current[row.id]?.current;

      if (!frontEl || !backEl) {
        setRows(prev => prev.map(r => r.id === row.id ? { ...r, status: 'error', errorMsg: 'Card element not mounted' } : r));
        continue;
      }

      try {
        const blob = await generateSinglePdf(row, frontEl, backEl);
        const pdfName = `IITRAM_ICard_${row.fullName.replace(/\s+/g, '_')}_${row.enrollmentNo}.pdf`;
        results.push({ name: pdfName, blob });
        setRows(prev => prev.map(r => r.id === row.id ? { ...r, status: 'done', pdfName } : r));
        setGeneratedPdfs([...results]);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        setRows(prev => prev.map(r => r.id === row.id ? { ...r, status: 'error', errorMsg: msg } : r));
      }
    }

    setIsGenerating(false);
    const done = results.length;
    const failed = rows.length - done;
    toast.success(`Generated ${done} PDFs${failed ? ` (${failed} failed)` : ''}`, { duration: 5000 });
  };

  /* ── Download All ── */
  const handleDownloadAll = async () => {
    if (!generatedPdfs.length) return;
    toast.loading('Preparing downloads...', { id: 'dl-all' });
    for (const { name, blob } of generatedPdfs) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      await new Promise(res => setTimeout(res, 200));
    }
    toast.success(`Downloaded ${generatedPdfs.length} PDFs!`, { id: 'dl-all' });
  };

  const handleDownloadSingle = (name: string, blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setRows([]);
    setGeneratedPdfs([]);
    setExpandedId(null);
    setPreviewRow(null);
    frontRefs.current = {};
    backRefs.current  = {};
  };

  const doneCount  = rows.filter(r => r.status === 'done').length;
  const errorCount = rows.filter(r => r.status === 'error').length;
  const photoCount = rows.filter(r => r.photoUrl).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 pb-20 pt-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">

        {/* ── Header ── */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 bg-amber-50 border border-amber-200 text-[#7A152B] rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles size={12} className="text-[#C59B27]" /> Bulk Generator
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Bulk Alumni I-Card Generator
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Upload a CSV + photos → generate & download all cards as PDF.
            </p>
          </div>
          {rows.length > 0 && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all cursor-pointer"
            >
              <RotateCcw size={14} /> Reset All
            </button>
          )}
        </div>

        {/* ── Step 1: Upload CSV ── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-[#7A152B] text-white text-xs font-black flex items-center justify-center">1</div>
            <h2 className="text-base font-black text-slate-800">Upload Alumni CSV</h2>
            {rows.length > 0 && (
              <span className="ml-auto text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 size={11} /> {rows.length} records loaded
              </span>
            )}
          </div>
          <div className="p-5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 leading-relaxed">
              <div>
                <strong>Flexible CSV columns (any order):</strong>{' '}
                <code className="font-mono">Full Name, Degree, Department, Batch, Enrollment No, Date of Issue, Email, Phone, Address</code>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLoadPreprocessedCSV();
                }}
                className="shrink-0 px-3.5 py-1.5 bg-[#7A152B] hover:bg-[#600f21] text-white font-bold rounded-lg transition-all shadow-xs flex items-center gap-1.5 cursor-pointer text-xs"
              >
                <Sparkles size={13} className="text-amber-300" /> Auto-Load 129 Alumni Records
              </button>
            </div>
            <div
              onDragOver={e => { e.preventDefault(); setDragOver('csv'); }}
              onDragLeave={() => setDragOver(null)}
              onDrop={handleCSVDrop}
              onClick={() => csvInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all
                ${dragOver === 'csv' ? 'border-[#7A152B] bg-red-50/40' : 'border-slate-200 hover:border-[#C59B27] hover:bg-amber-50/30'}`}
            >
              <FileSpreadsheet size={40} className="text-[#7A152B]" />
              <div className="text-center">
                <p className="font-bold text-slate-700 text-sm">Drag & drop your CSV here</p>
                <p className="text-slate-400 text-sm mt-0.5">or click to browse files</p>
              </div>
              <input ref={csvInputRef} type="file" accept=".csv,.txt" className="hidden"
                onChange={e => e.target.files?.[0] && handleCSVFile(e.target.files[0])} />
            </div>
          </div>
        </div>

        {/* ── Step 2: Upload Photos ── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-[#7A152B] text-white text-xs font-black flex items-center justify-center">2</div>
            <h2 className="text-base font-black text-slate-800">Upload Photos <span className="font-normal text-slate-400 text-sm">(optional)</span></h2>
            {photoCount > 0 && (
              <span className="ml-auto text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                {photoCount} matched
              </span>
            )}
          </div>
          <div className="p-5">
            <div className="mb-4 bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-800">
              <strong>Name photos as:</strong> <code className="font-mono">2310400011011.jpg</code> (enrollment no.) or <code className="font-mono">HEMANSHU_TALA.jpg</code> (full name) for auto-matching.
            </div>
            <div
              onDragOver={e => { e.preventDefault(); setDragOver('photos'); }}
              onDragLeave={() => setDragOver(null)}
              onDrop={handlePhotoDrop}
              onClick={() => photoInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all
                ${dragOver === 'photos' ? 'border-[#7A152B] bg-red-50/40' : 'border-slate-200 hover:border-[#C59B27] hover:bg-amber-50/30'}`}
            >
              <Image size={40} className="text-[#C59B27]" />
              <div className="text-center">
                <p className="font-bold text-slate-700 text-sm">Drag & drop all student photos</p>
                <p className="text-slate-400 text-sm mt-0.5">JPG, PNG — select multiple at once</p>
              </div>
              <input ref={photoInputRef} type="file" accept="image/*" multiple className="hidden"
                onChange={e => e.target.files && handlePhotos(e.target.files)} />
            </div>
            {photoCount > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {rows.filter(r => r.photoUrl).slice(0, 15).map(r => (
                  <div key={r.id} className="relative w-12 h-12 rounded-lg overflow-hidden border-2 border-emerald-300 shadow-sm" title={r.fullName}>
                    <img src={r.photoUrl} alt={r.fullName} className="w-full h-full object-cover" />
                  </div>
                ))}
                {photoCount > 15 && (
                  <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                    +{photoCount - 15}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Step 3: Review Records ── */}
        {rows.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-[#7A152B] text-white text-xs font-black flex items-center justify-center">3</div>
                <h2 className="text-base font-black text-slate-800">Review Records</h2>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{rows.length} total</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold">
                {doneCount > 0 && <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">{doneCount} done</span>}
                {errorCount > 0 && <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">{errorCount} failed</span>}
                {rows.length - doneCount - errorCount > 0 && <span className="text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">{rows.length - doneCount - errorCount} pending</span>}
              </div>
            </div>
            <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
              {rows.map((row, idx) => (
                <div key={row.id} className={`hover:bg-slate-50/50 transition-colors ${row.status === 'done' ? 'bg-emerald-50/20' : row.status === 'error' ? 'bg-red-50/20' : ''}`}>
                  <div className="flex items-center gap-3 px-5 py-3">
                    <span className="text-xs font-bold text-slate-400 w-5 shrink-0 text-right">{idx + 1}</span>
                    <div className="w-10 h-10 shrink-0 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
                      {row.photoUrl
                        ? <img src={row.photoUrl} alt={row.fullName} className="w-full h-full object-cover" />
                        : <Users size={16} className="text-slate-300" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{row.fullName}</p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {row.department} · {row.degree} · {row.batch} ·{' '}
                        <span className="font-mono text-[10px] text-slate-400">{row.enrollmentNo}</span>
                      </p>
                    </div>
                    <StatusBadge status={row.status} errorMsg={row.errorMsg} />
                    <div className="flex items-center gap-0.5 shrink-0">
                      <button onClick={() => setPreviewRow(row)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-[#7A152B] hover:bg-red-50 transition-all cursor-pointer" title="Preview">
                        <Eye size={13} />
                      </button>
                      {row.status === 'done' && row.pdfName && (
                        <button
                          onClick={() => {
                            const pdf = generatedPdfs.find(p => p.name === row.pdfName);
                            if (pdf) handleDownloadSingle(pdf.name, pdf.blob);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-all cursor-pointer" title="Download PDF">
                          <Download size={13} />
                        </button>
                      )}
                      <button onClick={() => setExpandedId(expandedId === row.id ? null : row.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition-all cursor-pointer">
                        {expandedId === row.id ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                      </button>
                      <button onClick={() => setRows(prev => prev.filter(r => r.id !== row.id))}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer" title="Remove">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                  {expandedId === row.id && (
                    <div className="px-14 pb-4 pt-2 grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50/70 border-t border-slate-100">
                      {[
                        ['Full Name', 'fullName'],
                        ['Degree', 'degree'],
                        ['Department', 'department'],
                        ['Batch', 'batch'],
                        ['Enrollment No.', 'enrollmentNo'],
                        ['Date of Issue', 'dateOfIssue'],
                        ['Membership Type', 'membershipType'],
                        ['Email', 'email'],
                        ['Phone', 'phone'],
                        ['Blood Group', 'bloodGroup'],
                      ].map(([label, field]) => (
                        <div key={field} className="flex flex-col gap-0.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{label}</label>
                          <input
                            className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium bg-white focus:outline-none focus:border-[#7A152B] focus:ring-1 focus:ring-[#7A152B]/20"
                            value={(row as any)[field] || ''}
                            onChange={e => {
                              const val = e.target.value;
                              setRows(prev => prev.map(r => r.id === row.id ? { ...r, [field]: val } : r));
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 4: Generate ── */}
        {rows.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-7 h-7 rounded-full bg-[#7A152B] text-white text-xs font-black flex items-center justify-center">4</div>
                  <h2 className="text-base font-black text-slate-800">Generate & Download PDFs</h2>
                </div>
                <p className="text-xs text-slate-500 pl-10">
                  {isGenerating
                    ? `Generating card ${doneCount + errorCount + 1} of ${rows.length}…`
                    : generatedPdfs.length > 0
                    ? `${generatedPdfs.length} PDFs ready to download`
                    : `Ready to generate ${rows.length} I-Cards as PDF`}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {generatedPdfs.length > 0 && (
                  <button onClick={handleDownloadAll}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-all shadow-md cursor-pointer">
                    <FolderOpen size={16} /> Download All ({generatedPdfs.length})
                  </button>
                )}
                <button onClick={handleGenerate} disabled={isGenerating}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#7A152B] hover:bg-[#600f21] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm transition-all shadow-md cursor-pointer">
                  {isGenerating
                    ? <><Loader2 size={16} className="animate-spin" /> Generating…</>
                    : <><PlayCircle size={16} /> Generate {rows.length} Cards</>}
                </button>
              </div>
            </div>
            {(isGenerating || doneCount > 0 || errorCount > 0) && (
              <div className="mt-5">
                <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2">
                  <span>{doneCount} done · {errorCount} errors · {rows.length - doneCount - errorCount} pending</span>
                  <span>{Math.round(((doneCount + errorCount) / rows.length) * 100)}%</span>
                </div>
                <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${((doneCount + errorCount) / rows.length) * 100}%`,
                      background: errorCount > 0
                        ? 'linear-gradient(to right, #7A152B, #C59B27, #ef4444)'
                        : 'linear-gradient(to right, #7A152B, #C59B27)',
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Empty state ── */}
        {!rows.length && (
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-20 flex flex-col items-center justify-center text-center gap-4">
            <PackageOpen size={56} className="text-slate-200" />
            <div>
              <h3 className="font-black text-slate-400 text-lg">No records yet</h3>
              <p className="text-slate-400 text-sm mt-1">Upload a CSV file above to get started</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Hidden off-screen card renderers ── */}
      {rows.map(row => {
        const icard: ICardData = {
          fullName: row.fullName,
          degree: row.degree,
          department: row.department,
          batch: row.batch,
          membershipNo: `ALUM/IITRAM/${row.enrollmentNo}`,
          dateOfIssue: row.dateOfIssue,
          membershipType: row.membershipType,
          photoUrl: row.photoUrl,
          email: row.email,
          phone: row.phone,
          bloodGroup: row.bloodGroup,
          enrollmentNumber: row.enrollmentNo,
          address: row.address,
        };
        return (
          <HiddenCardPair
            key={row.id}
            data={icard}
            frontRef={getRef(frontRefs, row.id)}
            backRef={getRef(backRefs, row.id)}
          />
        );
      })}

      {/* ── Preview Modal ── */}
      {previewRow && <PreviewModal row={previewRow} onClose={() => setPreviewRow(null)} />}
    </div>
  );
}
