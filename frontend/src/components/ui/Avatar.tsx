import Image from 'next/image';
import { clsx } from 'clsx';

interface AvatarProps {
  src?: string | null;
  username: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizes = { xs: 24, sm: 32, md: 40, lg: 56, xl: 80 };
const textSizes = {
  xs: 'text-xs', sm: 'text-sm', md: 'text-base', lg: 'text-lg', xl: 'text-2xl',
};

export default function Avatar({ src, username, size = 'md', className }: AvatarProps) {
  const px = sizes[size];
  const initials = username.slice(0, 2).toUpperCase();

  if (src) {
    return (
      <Image
        src={src}
        alt={username}
        width={px}
        height={px}
        className={clsx('rounded-full object-cover flex-shrink-0', className)}
        style={{ width: px, height: px }}
      />
    );
  }

  return (
    <div
      className={clsx(
        'rounded-full flex items-center justify-center flex-shrink-0 font-semibold',
        'bg-gradient-to-br from-accent to-accent-pink text-white',
        textSizes[size],
        className
      )}
      style={{ width: px, height: px }}
    >
      {initials}
    </div>
  );
}