import {
  Baby,
  Brain,
  Droplets,
  Ear,
  Eye,
  HeartPulse,
  MessageCircleHeart,
  Scissors,
  Stethoscope,
} from 'lucide-react';

interface IconProps {
  icon: string;
  size?: number;
  className?: string;
}

const svgBase = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

/** آیکون خطی مینیمال برای هر تخصص (چند تای سفارشی، بقیه از ست مینیمال) */
export function SpecialtyIcon({ icon, size = 20, className }: IconProps) {
  const common = { size, className, strokeWidth: 1.7 };

  switch (icon) {
    case 'heart':
      return <HeartPulse {...common} />;
    case 'skin':
      return <Droplets {...common} />;
    case 'brain':
      return <Brain {...common} />;
    case 'eye':
      return <Eye {...common} />;
    case 'baby':
      return <Baby {...common} />;
    case 'stethoscope':
      return <Stethoscope {...common} />;
    case 'mind':
      return <MessageCircleHeart {...common} />;
    case 'ear':
      return <Ear {...common} />;
    case 'scalpel':
      return <Scissors {...common} />;
    case 'tooth':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" {...svgBase} className={className} aria-hidden>
          <path d="M12 5.5C10.5 4 8.8 3.5 7.2 4 5 4.7 4 6.8 4 8.8c0 1.7.8 3 1.4 4.4.6 1.5.6 3.8 1.1 5.8.3 1.3.9 2 1.8 2 1.3 0 1.4-2.5 1.7-4 .3-1.1 1-1.8 2-1.8s1.7.7 2 1.8c.3 1.5.4 4 1.7 4 .9 0 1.5-.7 1.8-2 .5-2 .5-4.3 1.1-5.8.6-1.4 1.4-2.7 1.4-4.4 0-2-1-4.1-3.2-4.8-1.6-.5-3.3 0-4.8 1.5Z" />
        </svg>
      );
    case 'bone':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" {...svgBase} className={className} aria-hidden>
          <path d="M6.6 3.9c-1.9 0-3.4 1.5-3.4 3.4 0 .9.3 1.6.9 2.1-.6.5-.9 1.3-.9 2.2 0 1.9 1.5 3.4 3.4 3.4.9 0 1.7-.3 2.2-.9l5.8 5.8c-.6.5-.9 1.3-.9 2.2 0 1.9 1.5 3.4 3.4 3.4s3.4-1.5 3.4-3.4c0-.9-.3-1.7-.9-2.2.6-.5.9-1.3.9-2.2 0-1.9-1.5-3.4-3.4-3.4-.9 0-1.7.3-2.2.9l-5.8-5.8c.6-.5.9-1.3.9-2.2 0-1.9-1.5-3.4-3.4-3.4Z" transform="translate(-1.5 -1.5) scale(0.92)" />
        </svg>
      );
    case 'child':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" {...svgBase} className={className} aria-hidden>
          <circle cx="11.5" cy="6.8" r="2.6" />
          <path d="M11.5 9.4v6.4" />
          <path d="M11.5 15.8l-2.6 4.4M11.5 15.8l2.6 4.4" />
          <path d="M8.4 12.4l3.1-1.7 3.1 1.7" />
          <circle cx="18.4" cy="18.6" r="1.7" />
        </svg>
      );
    default:
      return <HeartPulse {...common} />;
  }
}
