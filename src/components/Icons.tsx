import type { SVGProps } from 'react'

const base = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true } as const

export const InstagramIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...props}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" />
  </svg>
)

export const FacebookIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...props}>
    <path d="M14 8.5h2.5V5H14a3.5 3.5 0 0 0-3.5 3.5V11H8v3.5h2.5V21H14v-6.5h2.5L17 11h-3V8.5a.5.5 0 0 1 .5-.5Z" />
  </svg>
)

export const FoodpandaIcon = ({ size = 18, className, ...props }: SVGProps<SVGSVGElement> & { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className} {...props}>
    <circle cx="12" cy="12" r="11" fill="#D70F64" />
    <circle cx="7.2" cy="7.8" r="2.4" fill="#FFFFFF" />
    <circle cx="16.8" cy="7.8" r="2.4" fill="#FFFFFF" />
    <ellipse cx="12" cy="13.2" rx="6.8" ry="5.8" fill="#FFFFFF" />
    <ellipse cx="9.4" cy="12.6" rx="1.6" ry="1.3" transform="rotate(-15 9.4 12.6)" fill="#D70F64" />
    <ellipse cx="14.6" cy="12.6" rx="1.6" ry="1.3" transform="rotate(15 14.6 12.6)" fill="#D70F64" />
    <circle cx="9.6" cy="12.4" r="0.5" fill="#FFFFFF" />
    <circle cx="14.4" cy="12.4" r="0.5" fill="#FFFFFF" />
    <path d="M11.4 14.5 C11.5 14.2 12.5 14.2 12.6 14.5 C12.5 14.9 11.5 14.9 11.4 14.5 Z" fill="#D70F64" />
    <path d="M11 15.6 Q12 16.5 13 15.6" stroke="#D70F64" strokeWidth="0.8" strokeLinecap="round" fill="none" />
  </svg>
)

export const GrabFoodIcon = ({ size = 18, className, ...props }: SVGProps<SVGSVGElement> & { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className} {...props}>
    <circle cx="12" cy="12" r="11" fill="#00B14F" />
    <path
      d="M7.8 15.2C6.3 15.2 5.1 14 5.1 12.5C5.1 11 6.3 9.8 7.8 9.8H15.8C17.1 9.8 18.2 10.9 18.2 12.2C18.2 13.5 17.1 14.6 15.8 14.6H9C8.3 14.6 7.7 14 7.7 13.3C7.7 12.6 8.3 12 9 12H15.2"
      stroke="#FFFFFF"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.6 16.6H15.8C18.1 16.6 20 14.7 20 12.4C20 10.1 18.1 8.2 15.8 8.2H7.8C5.5 8.2 3.6 10.1 3.6 12.4C3.6 14.7 5.5 16.6 7.8 16.6"
      stroke="#FFFFFF"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
