const PATHS = {
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
  brain: 'M12 3v18M8 6a3 3 0 0 0-3 3 3 3 0 0 0 0 6 3 3 0 0 0 3 3M16 6a3 3 0 0 1 3 3 3 3 0 0 1 0 6 3 3 0 0 1-3 3',
  tool: 'M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z',
  doc: 'M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6',
  shield: 'M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7zM9 12l2 2 4-4',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-3.5-3.5',
  database: 'M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3',
  code: 'M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16',
  chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  layers: 'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5M3 17.5l9 5 9-5',
  sparkle: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z',
  check: 'M5 12l5 5L20 7',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  arrowLeft: 'M19 12H5M11 6l-6 6 6 6',
  chevLeft: 'M15 6l-6 6 6 6',
  chevRight: 'M9 6l6 6-6 6',
  chevDown: 'M6 9l6 6 6-6',
  calendar: 'M3 5h18v16H3zM3 10h18M8 3v4M16 3v4',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
  refresh: 'M3 12a9 9 0 0 1 15.5-6.3L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.3L3 16M3 21v-5h5',
  bolt: 'M13 2L4 14h7l-1 8 9-12h-7z',
  bulb: 'M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z',
  warn: 'M12 3l10 18H2zM12 10v4M12 17.5v.5',
  copy: 'M9 9h11v11H9zM5 15V5a2 2 0 0 1 2-2h10',
  play: 'M7 5l12 7-12 7z',
  pause: 'M7 5h3v14H7zM14 5h3v14h-3z',
  close: 'M6 6l12 12M18 6L6 18',
  download: 'M12 3v12M7 10l5 5 5-5M4 21h16',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  expand: 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5',
  map: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM4 3.5a2 2 0 1 0 0 4M20 3.5a2 2 0 1 1 0 4M4 16.5a2 2 0 1 0 0 4M20 16.5a2 2 0 1 1 0 4M6 6.5l3.5 3.5M18 6.5L14.5 10M6 17.5l3.5-3.5M18 17.5L14.5 14',
  book: 'M4 4h6a3 3 0 0 1 3 3v14a2 2 0 0 0-2-2H4zM20 4h-6a3 3 0 0 0-3 3v14a2 2 0 0 1 2-2h7z',
  quote: 'M4 18v-5a6 6 0 0 1 6-6v3a3 3 0 0 0-3 3h3v5zm10 0v-5a6 6 0 0 1 6-6v3a3 3 0 0 0-3 3h3v5z',
  external: 'M14 4h6v6M20 4l-9 9M18 14v6H4V6h6',
  trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
  edit: 'M4 20h4L19 9l-4-4L4 16zM14 6l4 4',
} as const;

export type IconName = keyof typeof PATHS;

interface Props {
  name: IconName;
  size?: number;
  stroke?: number;
  className?: string;
  fill?: boolean;
}

export function Icon({ name, size = 20, stroke = 2, className, fill = false }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill ? 'currentColor' : 'none'}
      stroke={fill ? 'none' : 'currentColor'}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
