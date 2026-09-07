import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, CheckCircle2, QrCode, Building2, Calendar, User, ExternalLink, Download } from 'lucide-react';
import type { ICardData } from './AlumniICard';

interface ICardVerifierModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ICardData;
}

export default function ICardVerifierModal({ isOpen, onClose, data }: ICardVerifierModalProps) {
  if (!isOpen) return null;

  const verifyUrl = `${window.location.origin}/directory?search=${encodeURIComponent(data.fullName)}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#7A152B] to-[#5a0f1f] text-white p-5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-6 h-6 text-amber-300" />
              <div>
                <h3 className="font-bold text-base leading-tight font-serif uppercase tracking-wide">
                  IITRAM Alumni Verification
                </h3>
                <p className="text-xs text-amber-200/90 font-medium">Official Digital Record</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 text-center space-y-5">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 text-xs font-bold shadow-2xs">
              <CheckCircle2 size={14} className="text-emerald-600" />
              Verified Active Alumni Member
            </div>

            {/* Generated QR Graphic */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl inline-block shadow-inner">
              <div className="w-36 h-36 bg-white border border-slate-200 p-2 rounded-lg flex items-center justify-center mx-auto relative group">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verifyUrl)}`}
                  alt="QR Verification Code"
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-[10px] text-slate-400 font-mono mt-2 uppercase tracking-wider">
                ID: {data.membershipNo || 'ALUM/IITRAM/2024/001'}
              </p>
            </div>

            {/* Member Summary */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-left text-xs space-y-2">
              <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                <span className="text-slate-500 font-medium">Full Name</span>
                <span className="font-bold text-slate-900">{data.fullName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                <span className="text-slate-500 font-medium">Degree & Dept</span>
                <span className="font-bold text-slate-800">{data.degree} ({data.department})</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                <span className="text-slate-500 font-medium">Batch</span>
                <span className="font-bold text-slate-800">{data.batch}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Membership Status</span>
                <span className="font-bold text-[#7A152B]">{data.membershipType || 'LIFE MEMBER'}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary flex-1 text-xs font-bold py-2.5"
              >
                Close Window
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
