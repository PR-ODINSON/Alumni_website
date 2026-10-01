const PHOTO_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'] as const;

const DEFAULT_PLACEHOLDER = '/images/alumni-logo.jpg';

/**
 * Ordered image URLs to try for a student's convocation / ID photo.
 * Used with onError to advance through candidates when a file is missing.
 */
export function convocationPhotoCandidates(
  enrollmentNumber?: string,
  avatar?: string,
): string[] {
  const enr = (enrollmentNumber || '').trim();
  const candidates: string[] = [];

  if (avatar?.trim()) {
    candidates.push(avatar.trim());
  }

  if (enr) {
    for (const ext of PHOTO_EXTENSIONS) {
      candidates.push(`/convocation_photos/${enr}${ext}`);
    }
  }

  if (candidates.length === 0) {
    candidates.push(DEFAULT_PLACEHOLDER);
  }

  return candidates;
}

export function resolveConvocationPhotoUrl(enrollmentNumber?: string): string | undefined {
  const enr = (enrollmentNumber || '').trim();
  if (!enr) return undefined;
  return `/convocation_photos/${enr}.jpg`;
}
