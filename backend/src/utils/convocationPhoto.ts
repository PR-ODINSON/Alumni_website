const PHOTO_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'] as const;

export function convocationPhotoCandidates(enrollmentNumber?: string): string[] {
  const enr = (enrollmentNumber || '').trim();
  if (!enr) return [];

  return PHOTO_EXTENSIONS.map((ext) => `/convocation_photos/${enr}${ext}`);
}

/** Primary convocation photo path for an enrollment number (jpg convention). */
export function resolveConvocationPhotoUrl(enrollmentNumber?: string): string | undefined {
  const enr = (enrollmentNumber || '').trim();
  if (!enr) return undefined;
  return `/convocation_photos/${enr}.jpg`;
}
