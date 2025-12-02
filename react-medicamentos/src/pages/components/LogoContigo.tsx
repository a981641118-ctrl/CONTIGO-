import React from 'react';

const LogoContigo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 80" {...props}>
        <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#3e93b2', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#115675', stopOpacity: 1 }} />
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.2" />
            </filter>
        </defs>

        {/* Text "Contigo" */}
        <text x="20" y="58" fontFamily="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" fontWeight="800" fontSize="52" fill="#115675" style={{ letterSpacing: '-1px' }}>
            Contigo
        </text>

        {/* Stylized Plus Sign */}
        <g transform="translate(215, 15)">
            <path d="M20 0 L20 20 L40 20 A 5 5 0 0 1 40 30 L20 30 L20 50 A 5 5 0 0 1 10 50 L10 30 L-10 30 A 5 5 0 0 1 -10 20 L10 20 L10 0 A 5 5 0 0 1 20 0 Z" fill="url(#grad1)" filter="url(#shadow)" />
        </g>
    </svg>
);

export default LogoContigo;
