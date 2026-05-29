import { cn } from '../../lib/utils';

interface AvatarProps {
  src?: string;
  name?: string;
  initials?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  verified?: boolean;
}

const sizes = {
  xs: 'w-6 h-6 text-2xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
  '2xl': 'w-24 h-24 text-2xl',
};

export default function Avatar({ src, name, initials: initailsProp, size = 'md', className, verified }: AvatarProps) {
  const initials = initailsProp ||
    (name ? name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : '?');

  return (
    <div className={cn('relative flex-shrink-0', className)}>
      {src ? (
        <img
          src={src}
          alt={name || 'Avatar'}
          className={cn('rounded-full object-cover', sizes[size])}
        />
      ) : (
        <div
          className={cn(
            'rounded-full bg-gradient-to-br from-iitram-700 to-iitram-500 flex items-center justify-center font-semibold text-white',
            sizes[size]
          )}
        >
          {initials}
        </div>
      )}
      {verified && (
        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-iitram-500 rounded-full border-2 border-white flex items-center justify-center">
          <svg viewBox="0 0 12 12" className="w-2 h-2 text-white fill-current">
            <path d="M10 3L5 8.5 2 5.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}
    </div>
  );
}
