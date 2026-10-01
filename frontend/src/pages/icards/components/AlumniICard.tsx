import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { RotateCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { toPng } from 'html-to-image';

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
  enrollmentNumber?: string;
  address?: string;
  completionYear?: string;
}

const CARD_WIDTH = 1050;
const CARD_HEIGHT = 600;
/** Inset so scaled cards are not clipped on the left/right by subpixel overflow. */
const VIEWPORT_INSET_X = 3;

/** Fits a fixed 1050×600 card design into any responsive container without overflow. */
function CardScaleViewport({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const update = () => {
      const w = node.getBoundingClientRect().width;
      const innerW = Math.max(0, w - VIEWPORT_INSET_X * 2);
      setScale(innerW > 0 ? innerW / CARD_WIDTH : 1);
    };
    update();
    const obs = new ResizeObserver(update);
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        aspectRatio: `${CARD_WIDTH} / ${CARD_HEIGHT}`,
        position: 'relative',
        overflow: 'hidden',
        background: '#FFFFFF',
        isolation: 'isolate',
        boxSizing: 'border-box',
        padding: `0 ${VIEWPORT_INSET_X}px`,
      }}
    >
      <div
        style={{
          width: `${CARD_WIDTH}px`,
          height: `${CARD_HEIGHT}px`,
          position: 'absolute',
          top: 0,
          left: VIEWPORT_INSET_X,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          boxSizing: 'border-box',
        }}
      >
        {children}
      </div>
    </div>
  );
}

interface AlumniICardProps {
  data: ICardData;
  onOpenVerify?: () => void;
  isFlipped?: boolean;
  onFlip?: () => void;
  securityProtected?: boolean;
  side?: 'front' | 'back' | 'auto';
}

const OFFICIAL_CARD_DATA: Readonly<ICardData> = Object.freeze({
  fullName: 'HEMANSHU TALA',
  degree: 'B.Tech',
  department: 'Computer Engineering',
  batch: '2023 - 2027',
  membershipNo: 'ALUM/IITRAM/2310400011011',
  dateOfIssue: '07/09/2026',
  membershipType: 'LIFE MEMBER',
  photoUrl: '/convocation_photos/2310400011011.jpeg',
  email: 'hemanshu.tala@iitram.ac.in',
  phone: '+91 98765 43210',
  bloodGroup: 'O+',
  enrollmentNumber: '2310400011011',
  address: 'Ahmedabad, Gujarat - 380026',
});

function AlumniBanner({
  width = 685,
  height = 74,
  style,
  text = 'ALUMNI RELATIONS, IITRAM',
}: {
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  text?: string;
}) {
  return (
    <div style={{ position: 'absolute', zIndex: 4, width: `${width}px`, height: `${height}px`, ...style }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 685 79"
        preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0 }}
      >
        <path
          d="M 0 14 Q 171.25 7 342.5 0 Q 513.75 7 685 14 L 685 65 Q 513.75 72 342.5 79 Q 171.25 72 0 65 Z"
          fill="#D6DF8E"
        />
        <text
          x="342.5"
          y="49"
          textAnchor="middle"
          fill="#000000"
          fontFamily="'Arial', 'Helvetica', sans-serif"
          fontSize="26px"
          fontWeight="bold"
          letterSpacing="1.5px"
        >
          {text}
        </text>
      </svg>
    </div>
  );
}

function FrontCard({ data }: { data: ICardData }) {
  const enr = data.enrollmentNumber || (data.membershipNo || '').replace('ALUM/IITRAM/', '');
  const yearOfCompletion = data.completionYear || data.batch?.split('-').pop()?.trim() || '2026';

  return (
    <CardScaleViewport>
      <div
        style={{
          position: 'relative',
          width: `${CARD_WIDTH}px`,
          height: `${CARD_HEIGHT}px`,
          margin: 0,
          padding: 0,
          background: '#FFFFFF',
          fontFamily: "'Arial', 'Helvetica', sans-serif",
          boxSizing: 'border-box',
        }}
      >
        {/* 1. TOP HEADER CONTAINER - WITH 25PX TOP MARGIN */}
        <div style={{
          position: 'absolute',
          left: '30px',
          top: '25px',
          width: '990px',
          height: '138px',
          borderRadius: '24px',
          background: '#DFF3F5',
          overflow: 'hidden',
        }} />

        {/* 2. IITRAM LOGO IN HEADER */}
        <div style={{
          position: 'absolute',
          left: '35px',
          top: '32px',
          width: '124px',
          height: '124px',
          borderRadius: '50%',
          overflow: 'hidden',
          zIndex: 2,
          background: '#FFFFFF',
        }}>
          <img
            src="/new/iitram cdr logo.png"
            alt="IITRAM Logo"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            onError={e => {
              (e.target as HTMLImageElement).src = '/images/iitram-logo.png';
            }}
          />
        </div>

        {/* 3 & 4. HEADER TITLE & SUBTITLE */}
        <div style={{
          position: 'absolute',
          left: '170px',
          top: '34px',
          width: '830px',
          textAlign: 'center',
          zIndex: 2,
        }}>
          <div style={{
            fontSize: '34px',
            fontWeight: 700,
            color: '#073F7C',
            lineHeight: '1.15',
            whiteSpace: 'nowrap',
          }}>
            INSTITUTE OF INFRASTRUCTURE, TECHNOLOGY,
          </div>
          <div style={{
            fontSize: '34px',
            fontWeight: 700,
            color: '#073F7C',
            lineHeight: '1.15',
            whiteSpace: 'nowrap',
          }}>
            RESEARCH AND MANAGEMENT
          </div>
          <div style={{
            fontSize: '20px',
            fontStyle: 'italic',
            fontWeight: 600,
            color: '#073F7C',
            marginTop: '4px',
            whiteSpace: 'nowrap',
          }}>
            (An Autonomous University Established by Government of Gujarat)
          </div>
        </div>

        {/* 5. ALUMNUS VERTICAL TEXT */}
        <div style={{
          position: 'absolute',
          left: '48px',
          top: '205px',
          width: '50px',
          height: '215px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
        }}>
          <span style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            fontSize: '36px',
            fontWeight: 700,
            color: '#1597A2',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            userSelect: 'none',
          }}>
            ALUMNUS
          </span>
        </div>

        {/* 6. STUDENT PHOTO */}
        <div style={{
          position: 'absolute',
          left: '116px',
          top: '199px',
          width: '176px',
          height: '210px',
          background: '#EEF5F8',
          overflow: 'hidden',
          zIndex: 2,
        }}>
          <img
            src={data.photoUrl || '/images/iitram-logo.png'}
            alt={data.fullName}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { (e.target as HTMLImageElement).src = '/images/iitram-logo.png'; }}
          />
        </div>

        {/* 7. MAIN INFORMATION AREA */}
        <div style={{
          position: 'absolute',
          left: '307px',
          top: '212px',
          width: '430px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          zIndex: 3,
        }}>
          <div style={{ fontSize: '26px', color: '#000000', lineHeight: '1.2' }}>
            <span style={{ fontWeight: 700 }}>ID Number:</span>{' '}
            <span style={{ fontWeight: 500 }}>{enr}</span>
          </div>
          <div style={{ fontSize: '26px', color: '#000000', lineHeight: '1.2' }}>
            <span style={{ fontWeight: 700 }}>Name :</span>{' '}
            <span style={{ fontWeight: 500 }}>{data.fullName}</span>
          </div>
          <div style={{ fontSize: '26px', color: '#000000', lineHeight: '1.25' }}>
            <span style={{ fontWeight: 700 }}>Academic Program:</span>{' '}
            <span style={{ fontWeight: 500 }}>{data.degree} –</span>
            <br />
            <span style={{ fontWeight: 500 }}>{data.department}</span>
          </div>
          <div style={{ fontSize: '26px', color: '#000000', lineHeight: '1.2' }}>
            <span style={{ fontWeight: 700 }}>Year of Completion:</span>{' '}
            <span style={{ fontWeight: 500 }}>{yearOfCompletion}</span>
          </div>
        </div>

        {/* 8 & 9. RIGHT WATERMARK LOGO & RIBBON */}
        <div style={{
          position: 'absolute',
          left: '715px',
          top: '155px',
          width: '295px',
          height: '330px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0.22,
          zIndex: 1,
          pointerEvents: 'none',
        }}>
          <img
            src="/new/alumani.jpeg"
            alt="Alumni Relations IITRAM"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* 10. SIGNATURE */}
        <div style={{
          position: 'absolute',
          left: '143px',
          top: '430px',
          width: '120px',
          height: '45px',
          zIndex: 3,
        }}>
          <img
            src="/PRAMOD sign jpg.jpg.jpeg"
            alt="Signature"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* 11. AUTHORIZED SIGNATORY */}
        <div style={{
          position: 'absolute',
          left: '95px',
          top: '478px',
          width: '210px',
          borderTop: '2px solid #000000',
          zIndex: 3,
        }} />

        <div style={{
          position: 'absolute',
          left: '95px',
          top: '484px',
          width: '210px',
          textAlign: 'center',
          fontSize: '21px',
          fontWeight: 700,
          color: '#000000',
          whiteSpace: 'nowrap',
          zIndex: 3,
        }}>
          Authorized Signatory
        </div>

        {/* 12 & 13. BOTTOM PALE YELLOW-GREEN BANNER & TEXT */}
        <AlumniBanner
          width={685}
          height={92}
          style={{ left: '335px', top: '475px' }}
        />

      </div>
    </CardScaleViewport>
  );
}

function BackCard({ data }: { data: ICardData }) {
  const enr = data.enrollmentNumber || (data.membershipNo || '').replace('ALUM/IITRAM/', '');
  const buildingClipId = `buildingClip-${React.useId().replace(/:/g, '')}`;

  return (
    <CardScaleViewport>
      <div
        style={{
          position: 'relative',
          width: `${CARD_WIDTH}px`,
          height: `${CARD_HEIGHT}px`,
          background: '#FFFFFF',
          fontFamily: "'Arial', 'Helvetica', sans-serif",
          boxSizing: 'border-box',
          overflow: 'visible',
        }}
      >
        {/* 1. TOP-LEFT ALUMNI RELATIONS BANNER */}
        <AlumniBanner
          width={540}
          height={90}
          style={{ left: '0px', top: '0px' }}
        />

        {/* 2. LEFT VERTICAL LIGHT-BLUE PILL (2-LINE TEXT) */}
        <div style={{
          position: 'absolute',
          left: '0px',
          top: '90px',
          width: '72px',
          height: '510px',
          borderRadius: '0 32px 0 0',
          background: '#E0F2F5',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2px',
          padding: '8px 6px',
          boxSizing: 'border-box',
          zIndex: 2,
        }}>
          <span style={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            fontSize: '12px',
            fontWeight: 800,
            color: '#073F7C',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            userSelect: 'none',
            lineHeight: 1.1,
          }}>
            INSTITUTE OF INFRASTRUCTURE, TECHNOLOGY,
          </span>
          <span style={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            fontSize: '12px',
            fontWeight: 800,
            color: '#073F7C',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            userSelect: 'none',
            lineHeight: 1.1,
          }}>
            RESEARCH AND MANAGEMENT
          </span>
        </div>

        {/* 3. FADED IITRAM WATERMARK LOGO */}
        <div style={{
          position: 'absolute',
          left: '88px',
          top: '130px',
          width: '390px',
          height: '390px',
          opacity: 0.16,
          pointerEvents: 'none',
          zIndex: 1,
        }}>
          <img
            src="/new/iitram cdr logo.png"
            alt="IITRAM Watermark"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* 4. STUDENT INFORMATION FIELDS */}
        <div style={{
          position: 'absolute',
          left: '88px',
          top: '135px',
          fontSize: '24px',
          color: '#000000',
          lineHeight: '1.2',
          zIndex: 3,
        }}>
          <span style={{ fontWeight: 800 }}>Enrollment Number :</span>{' '}
          <span style={{ fontWeight: 500 }}>{enr}</span>
        </div>

        <div style={{
          position: 'absolute',
          left: '88px',
          top: '220px',
          width: '430px',
          maxWidth: '430px',
          fontSize: (data.email || '').length > 32 ? '18px' : (data.email || '').length > 25 ? '20px' : '24px',
          color: '#000000',
          lineHeight: '1.25',
          wordBreak: 'break-word',
          zIndex: 3,
        }}>
          <span style={{ fontWeight: 800 }}>Email Id :</span>{' '}
          <span style={{ fontWeight: 500 }}>{data.email || `${enr}@iitram.ac.in`}</span>
        </div>

        <div style={{
          position: 'absolute',
          left: '88px',
          top: '305px',
          fontSize: '24px',
          color: '#000000',
          lineHeight: '1.2',
          zIndex: 3,
        }}>
          <span style={{ fontWeight: 800 }}>Contact No :</span>{' '}
          <span style={{ fontWeight: 500 }}>{data.phone || '+91 98765 43210'}</span>
        </div>

        <div style={{
          position: 'absolute',
          left: '88px',
          top: '382px',
          width: '420px',
          fontSize: '21px',
          color: '#000000',
          lineHeight: '1.2',
          zIndex: 3,
        }}>
          <span style={{ fontWeight: 800 }}>Permanent Address:</span>{' '}
          <span style={{ fontWeight: 500, whiteSpace: 'pre-line' }}>
            {data.address ? data.address : <>Ahmedabad,<br />Gujarat - 380026</>}
          </span>
        </div>

        {/* 5. DISCLAIMER TEXT */}
        <div style={{
          position: 'absolute',
          left: '88px',
          bottom: '12px',
          width: '430px',
          fontSize: '13px',
          color: '#333333',
          fontStyle: 'italic',
          lineHeight: '1.4',
          fontWeight: 600,
          zIndex: 3,
        }}>
          *Report the loss of this card to Security Office, IITRAM<br />
          *This Card is not transferable
        </div>

        {/* 6. RIGHT BUILDING IMAGE WITH EXACT SVG CLIP-PATH BOUNDARY */}
        <div style={{
          position: 'absolute',
          left: '542px',
          top: '23px',
          width: '472px',
          height: '537px',
          overflow: 'hidden',
          zIndex: 1,
        }}>
          <svg width="0" height="0" style={{ position: 'absolute' }}>
            <defs>
              <clipPath id={buildingClipId} clipPathUnits="userSpaceOnUse">
                <path d="M 35 0 C 15 45, 5 100, 12 155 C 20 215, 45 270, 75 325 C 98 375, 138 420, 148 470 C 155 495, 155 520, 154 537 L 472 537 L 472 0 Z" />
              </clipPath>
            </defs>
          </svg>
          <img
            src="/iitram-bg.jpg"
            alt="IITRAM Campus Building"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center top',
              clipPath: `url(#${buildingClipId})`,
              WebkitClipPath: `url(#${buildingClipId})`,
              display: 'block',
            }}
            onError={e => { (e.target as HTMLImageElement).style.background = '#b0c8d8'; }}
          />
        </div>

      </div>
    </CardScaleViewport>
  );
}

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

  useEffect(() => {
    let alive = true;
    const run = async () => {
      const opts = {
        quality: 1, pixelRatio: 3,
        filter: (n: HTMLElement) => {
          if (!n.tagName) return true;
          return !['IFRAME', 'EMBED', 'SCRIPT'].includes(n.tagName.toUpperCase());
        },
      };
      try {
        if (offscreenFrontRef.current) {
          const url = await toPng(offscreenFrontRef.current, opts);
          if (alive) setFrontCanvasUrl(url);
        }
        if (offscreenBackRef.current) {
          const url = await toPng(offscreenBackRef.current, opts);
          if (alive) setBackCanvasUrl(url);
        }
      } catch (e) { console.error(e); }
    };
    const t = setTimeout(run, 150);
    return () => { alive = false; clearTimeout(t); };
  }, [data, tamperKey]);

  useEffect(() => {
    if (!securityProtected || !cardRef.current) return;
    const node = cardRef.current;
    const onCtx = (e: MouseEvent) => e.preventDefault();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && 'IJCijc'.includes(e.key)) || (e.ctrlKey && 'Uu'.includes(e.key)))
        e.preventDefault();
    };
    const obs = new MutationObserver(() => setTamperKey(p => p + 1));
    obs.observe(node, { attributes: true, childList: true, characterData: true, subtree: true });
    node.addEventListener('contextmenu', onCtx);
    window.addEventListener('keydown', onKey);
    return () => {
      obs.disconnect();
      node.removeEventListener('contextmenu', onCtx);
      window.removeEventListener('keydown', onKey);
    };
  }, [securityProtected, tamperKey]);

  const renderFront = () => {
    if (securityProtected && frontCanvasUrl)
      return (
        <div style={{ width: '100%', height: '100%', overflow: 'hidden', userSelect: 'none' }}>
          <img src={frontCanvasUrl} alt="IITRAM Alumni Card Front"
            style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none', userSelect: 'none' }}
            onContextMenu={e => e.preventDefault()}
            onDragStart={e => e.preventDefault()} />
        </div>
      );
    return <FrontCard data={data} />;
  };

  const renderBack = () => {
    if (securityProtected && backCanvasUrl)
      return (
        <div style={{ width: '100%', height: '100%', overflow: 'hidden', userSelect: 'none' }}>
          <img src={backCanvasUrl} alt="IITRAM Alumni Card Back"
            style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none', userSelect: 'none' }}
            onContextMenu={e => e.preventDefault()}
            onDragStart={e => e.preventDefault()} />
        </div>
      );
    return <BackCard data={data} />;
  };

  if (side === 'front')
    return (
      <div ref={cardRef} style={{ width: '100%', maxWidth: '700px', margin: '0 auto', userSelect: 'none', overflow: 'hidden' }}>
        {renderFront()}
      </div>
    );
  if (side === 'back')
    return (
      <div ref={cardRef} style={{ width: '100%', maxWidth: '700px', margin: '0 auto', userSelect: 'none', overflow: 'hidden' }}>
        {renderBack()}
      </div>
    );

  return (
    <div ref={cardRef} style={{ width: '100%', maxWidth: '700px', margin: '0 auto', perspective: '1200px', userSelect: 'none' }}>
      <motion.div
        style={{ position: 'relative', width: '100%', aspectRatio: '1050 / 600', transformStyle: 'preserve-3d', cursor: 'pointer' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        onClick={onFlip}
      >
        <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', zIndex: isFlipped ? 0 : 2 }}>
          {renderFront()}
        </div>
        <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', zIndex: isFlipped ? 2 : 0 }}>
          {renderBack()}
        </div>
      </motion.div>

      <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: '#666', padding: '0 4px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', color: '#444' }}>
          <RotateCw size={13} color="#0b9baa" /> Click card to flip
        </span>
        <button type="button" onClick={onFlip}
          style={{ color: '#0b4c6e', fontWeight: '700', cursor: 'pointer', background: 'none', border: 'none', fontSize: '12px', textDecoration: 'underline' }}>
          {isFlipped ? 'View Front Side' : 'View Back Side'}
        </button>
      </div>

      <div style={{ position: 'fixed', top: 0, left: 0, zIndex: -9999, opacity: 0, pointerEvents: 'none', overflow: 'hidden', width: '1050px', height: '600px' }}>
        <div ref={offscreenFrontRef} style={{ width: '1050px', height: '600px' }}>
          <FrontCard data={data} />
        </div>
        <div ref={offscreenBackRef} style={{ width: '1050px', height: '600px', marginTop: '20px' }}>
          <BackCard data={data} />
        </div>
      </div>
    </div>
  );
}
