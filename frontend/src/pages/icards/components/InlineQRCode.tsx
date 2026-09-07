import React from 'react';

interface InlineQRCodeProps {
  className?: string;
  size?: number;
}

// Crisp, self-contained SVG QR Code graphic for IITRAM verification (0 external network dependencies)
export default function InlineQRCode({ className = 'w-full h-full', size = 29 }: InlineQRCodeProps) {
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
