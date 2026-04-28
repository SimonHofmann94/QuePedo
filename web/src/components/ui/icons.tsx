// ¡Qué Pedo! stroke-based icon set (24×24, currentColor).
// Lightweight inline SVGs — no extra deps. Use lucide-react for anything not here.
import * as React from "react"

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number }

const base = (size: number = 24): React.SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
})

export const HomeIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}><path d="M3 11l9-8 9 8v10a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2V11z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>
)
export const BookIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}><path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2V5z M4 19a2 2 0 0 0 2 2h12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>
)
export const MicIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}><rect x="9" y="3" width="6" height="12" rx="3" stroke="currentColor" strokeWidth="2"/><path d="M5 11a7 7 0 0 0 14 0 M12 18v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
)
export const GlobeIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/><path d="M3 12h18 M12 3c3 3 3 15 0 18 M12 3c-3 3-3 15 0 18" stroke="currentColor" strokeWidth="2"/></svg>
)
export const TrophyIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}><path d="M7 4h10v5a5 5 0 0 1-10 0V4z M7 6H4v2a3 3 0 0 0 3 3 M17 6h3v2a3 3 0 0 1-3 3 M10 14h4v4h3v2H7v-2h3v-4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>
)
export const FireIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}><path d="M12 2c0 4-4 6-4 10a4 4 0 0 0 8 0c0-2-1-3-2-4 3 0 6 3 6 7a8 8 0 0 1-16 0c0-6 5-9 8-13z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>
)
export const ChartIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}><path d="M3 20V10 M9 20V4 M15 20v-7 M21 20v-11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
)
export const DumbbellIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}><path d="M6 6v12 M2 9v6 M18 6v12 M22 9v6 M6 12h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
)
export const UserIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/><path d="M4 21a8 8 0 0 1 16 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
)
export const PlusIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}><path d="M12 5v14 M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
)
export const CheckIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}><path d="M4 12l6 6L20 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
)
export const XIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}><path d="M6 6l12 12 M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
)
export const ArrowIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}><path d="M5 12h14 M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
)
export const SparkleIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}><path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z M19 14l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>
)
export const SearchIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/><path d="M20 20l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
)
export const LockIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}><rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2"/></svg>
)
export const PlayIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}><path d="M6 4l14 8-14 8V4z" fill="currentColor"/></svg>
)
export const HeartIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}><path d="M12 20S3 13 3 8a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5-9 12-9 12z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>
)
export const BellIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}><path d="M6 8a6 6 0 0 1 12 0c0 6 2 8 2 8H4s2-2 2-8z M10 21a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>
)
export const GearIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/><path d="M12 2v3 M12 19v3 M22 12h-3 M5 12H2 M19 5l-2 2 M7 17l-2 2 M19 19l-2-2 M7 7L5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
)
