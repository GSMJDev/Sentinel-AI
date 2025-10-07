
import React from 'react';

export const ScanIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 7V5a2 2 0 0 1 2-2h2"></path>
    <path d="M17 3h2a2 2 0 0 1 2 2v2"></path>
    <path d="M21 17v2a2 2 0 0 1-2 2h-2"></path>
    <path d="M7 21H5a2 2 0 0 1-2-2v-2"></path>
    <circle cx="12" cy="12" r="3"></circle>
    <line x1="12" y1="8" x2="12" y2="8"></line>
    <line x1="12" y1="16" x2="12" y2="16"></line>
    <line x1="8" y1="12" x2="8" y2="12"></line>
    <line x1="16" y1="12" x2="16" y2="12"></line>
  </svg>
);
