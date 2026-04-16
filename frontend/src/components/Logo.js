import React from 'react';

export default function Logo({ size = 'medium', variant = 'fiber-flow', theme = 'dark' }) {
  const sizeClasses = {
    small: 'w-10 h-10',
    medium: 'w-16 h-16',
    large: 'w-24 h-24',
  };

  return (
    <div className={`${sizeClasses[size]} flex items-center justify-center`}>
      {variant === 'fiber-flow' && <FiberFlowLogo size={size} theme={theme} />}
      {variant === 'connected-nodes' && <ConnectedNodesLogo size={size} theme={theme} />}
      {variant === 'speed-pulse' && <SpeedPulseLogo size={size} theme={theme} />}
    </div>
  );
}

// Fiber Flow Arrow Logo
function FiberFlowLogo({ size, theme = 'dark' }) {
  const viewBox = size === 'small' ? '0 0 40 50' : size === 'large' ? '0 0 120 150' : '0 0 80 100';

  return (
    <svg viewBox={viewBox} className="w-full h-full drop-shadow-lg">
      <defs>
        <linearGradient id="fiberGradient" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#02287F" />
          <stop offset="100%" stopColor="#77CD0C" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <style>
          {`
            @keyframes fiberPulse {
              0%, 100% { opacity: 1; stroke-width: 2; }
              50% { opacity: 0.6; stroke-width: 3; }
            }
            @keyframes arrowMove {
              0%, 100% { transform: translateY(4px); }
              50% { transform: translateY(-4px); }
            }
            .fiber-line { animation: fiberPulse 2s ease-in-out infinite; }
            .arrow-group { animation: arrowMove 2s ease-in-out infinite; }
          `}
        </style>
      </defs>

      {/* Background Circle */}
      <circle cx={viewBox.split(' ')[2] / 2} cy={viewBox.split(' ')[3] / 2 - 10} r={viewBox.split(' ')[2] / 2.5} 
              fill="rgba(2, 40, 127, 0.05)" />

      {/* Arrow Group with Animation */}
      <g className="arrow-group" filter="url(#glow)">
        {/* Left Fiber Line */}
        <path
          d={size === 'small' ? `M 10 35 Q 15 25 20 10` : size === 'large' ? `M 30 105 Q 45 75 60 30` : `M 20 70 Q 30 50 40 20`}
          stroke="url(#fiberGradient)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          className="fiber-line"
        />

        {/* Right Fiber Line */}
        <path
          d={size === 'small' ? `M 30 35 Q 25 25 20 10` : size === 'large' ? `M 90 105 Q 75 75 60 30` : `M 60 70 Q 50 50 40 20`}
          stroke="url(#fiberGradient)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          className="fiber-line"
        />

        {/* Center Fiber Line */}
        <path
          d={size === 'small' ? `M 20 40 L 20 8` : size === 'large' ? `M 60 110 L 60 25` : `M 40 75 L 40 15`}
          stroke="url(#fiberGradient)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          className="fiber-line"
          style={{ animationDelay: '0.3s' }}
        />

        {/* Arrow Head - Triangle */}
        <polygon
          points={size === 'small' ? `20,5 15,12 25,12` : size === 'large' ? `60,20 50,40 70,40` : `40,10 32,24 48,24`}
          fill="#77CD0C"
          filter="url(#glow)"
        />

        {/* Glow Circle at Arrow Tip */}
        <circle cx={size === 'small' ? '20' : size === 'large' ? '60' : '40'} 
                cy={size === 'small' ? '5' : size === 'large' ? '20' : '10'}
                r={size === 'small' ? '2' : size === 'large' ? '6' : '4'}
                fill="#77CD0C"
                opacity="0.8"
        />
      </g>
    </svg>
  );
}

// Connected Nodes Logo (Modern Networking Style)
function ConnectedNodesLogo({ size, theme = 'dark' }) {
  const viewBox = size === 'small' ? '0 0 40 40' : size === 'large' ? '0 0 120 120' : '0 0 80 80';
  const primaryColor = theme === 'light' ? '#FFFFFF' : '#77CD0C';
  const secondaryColor = theme === 'light' ? '#E5E7EB' : '#02287F';

  return (
    <svg viewBox={viewBox} className="w-full h-full drop-shadow-lg">
      <defs>
        <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#77CD0C" />
          <stop offset="100%" stopColor="#02287F" />
        </linearGradient>
        <style>
          {`
            @keyframes nodePulse {
              0%, 100% { r: 3px; opacity: 1; }
              50% { r: 4.5px; opacity: 0.7; }
            }
            .node { animation: nodePulse 2s ease-in-out infinite; }
            .node:nth-child(2) { animation-delay: 0.2s; }
            .node:nth-child(3) { animation-delay: 0.4s; }
            .node:nth-child(4) { animation-delay: 0.6s; }
            .node:nth-child(5) { animation-delay: 0.8s; }
          `}
        </style>
      </defs>

      {/* Connection Lines */}
      {size === 'small' ? (
        <>
          <line x1="20" y1="10" x2="30" y2="20" stroke={primaryColor} strokeWidth="1.5" opacity="0.6" />
          <line x1="20" y1="10" x2="10" y2="20" stroke={secondaryColor} strokeWidth="1.5" opacity="0.6" />
          <line x1="30" y1="20" x2="20" y2="30" stroke={primaryColor} strokeWidth="1.5" opacity="0.6" />
          <line x1="10" y1="20" x2="20" y2="30" stroke={secondaryColor} strokeWidth="1.5" opacity="0.6" />
        </>
      ) : size === 'large' ? (
        <>
          <line x1="60" y1="30" x2="90" y2="60" stroke={primaryColor} strokeWidth="4" opacity="0.6" />
          <line x1="60" y1="30" x2="30" y2="60" stroke={secondaryColor} strokeWidth="4" opacity="0.6" />
          <line x1="90" y1="60" x2="60" y2="90" stroke={primaryColor} strokeWidth="4" opacity="0.6" />
          <line x1="30" y1="60" x2="60" y2="90" stroke={secondaryColor} strokeWidth="4" opacity="0.6" />
        </>
      ) : (
        <>
          <line x1="40" y1="20" x2="60" y2="40" stroke={primaryColor} strokeWidth="2.5" opacity="0.6" />
          <line x1="40" y1="20" x2="20" y2="40" stroke={secondaryColor} strokeWidth="2.5" opacity="0.6" />
          <line x1="60" y1="40" x2="40" y2="60" stroke={primaryColor} strokeWidth="2.5" opacity="0.6" />
          <line x1="20" y1="40" x2="40" y2="60" stroke={secondaryColor} strokeWidth="2.5" opacity="0.6" />
        </>
      )}

      {/* Nodes */}
      <circle cx={size === 'small' ? '20' : size === 'large' ? '60' : '40'} 
              cy={size === 'small' ? '10' : size === 'large' ? '30' : '20'}
              r={size === 'small' ? '3' : size === 'large' ? '9' : '6'}
              fill={primaryColor} className="node" />
      <circle cx={size === 'small' ? '30' : size === 'large' ? '90' : '60'} 
              cy={size === 'small' ? '20' : size === 'large' ? '60' : '40'}
              r={size === 'small' ? '3' : size === 'large' ? '9' : '6'}
              fill={primaryColor} className="node" />
      <circle cx={size === 'small' ? '10' : size === 'large' ? '30' : '20'} 
              cy={size === 'small' ? '20' : size === 'large' ? '60' : '40'}
              r={size === 'small' ? '3' : size === 'large' ? '9' : '6'}
              fill={secondaryColor} className="node" />
      <circle cx={size === 'small' ? '20' : size === 'large' ? '60' : '40'} 
              cy={size === 'small' ? '30' : size === 'large' ? '90' : '60'}
              r={size === 'small' ? '3' : size === 'large' ? '9' : '6'}
              fill={secondaryColor} className="node" />
    </svg>
  );
}

// Speed Pulse Logo (Concentric Rings)
function SpeedPulseLogo({ size, theme = 'dark' }) {
  const viewBox = size === 'small' ? '0 0 40 40' : size === 'large' ? '0 0 120 120' : '0 0 80 80';
  const center = parseInt(viewBox.split(' ')[2]) / 2;

  return (
    <svg viewBox={viewBox} className="w-full h-full drop-shadow-lg">
      <defs>
        <style>
          {`
            @keyframes pulse1 {
              0% { r: 5px; opacity: 1; stroke-width: 1.5; }
              100% { r: 15px; opacity: 0; stroke-width: 0.5; }
            }
            @keyframes pulse2 {
              0% { r: 5px; opacity: 1; stroke-width: 1.5; }
              100% { r: 15px; opacity: 0; stroke-width: 0.5; }
            }
            @keyframes pulse3 {
              0% { r: 5px; opacity: 1; stroke-width: 1.5; }
              100% { r: 15px; opacity: 0; stroke-width: 0.5; }
            }
            .pulse-ring-1 { animation: pulse1 2s ease-out infinite; }
            .pulse-ring-2 { animation: pulse2 2s ease-out infinite 0.6s; }
            .pulse-ring-3 { animation: pulse3 2s ease-out infinite 1.2s; }
          `}
        </style>
      </defs>

      {/* Center Circle */}
      <circle cx={center} cy={center} r={size === 'small' ? '5' : size === 'large' ? '15' : '10'} 
              fill="#77CD0C" />

      {/* Pulsing Rings */}
      <circle cx={center} cy={center} r={size === 'small' ? '5' : size === 'large' ? '15' : '10'} 
              stroke="#02287F" strokeWidth="1.5" fill="none" className="pulse-ring-1" />
      <circle cx={center} cy={center} r={size === 'small' ? '5' : size === 'large' ? '15' : '10'} 
              stroke="#77CD0C" strokeWidth="1.5" fill="none" className="pulse-ring-2" />
      <circle cx={center} cy={center} r={size === 'small' ? '5' : size === 'large' ? '15' : '10'} 
              stroke="#02287F" strokeWidth="1.5" fill="none" className="pulse-ring-3" />

      {/* Static Circles */}
      {size === 'small' ? (
        <>
          <circle cx={center} cy={center} r="8" stroke="#77CD0C" strokeWidth="1" fill="none" opacity="0.5" />
          <circle cx={center} cy={center} r="11" stroke="#02287F" strokeWidth="1" fill="none" opacity="0.3" />
        </>
      ) : size === 'large' ? (
        <>
          <circle cx={center} cy={center} r="24" stroke="#77CD0C" strokeWidth="3" fill="none" opacity="0.5" />
          <circle cx={center} cy={center} r="33" stroke="#02287F" strokeWidth="3" fill="none" opacity="0.3" />
        </>
      ) : (
        <>
          <circle cx={center} cy={center} r="16" stroke="#77CD0C" strokeWidth="2" fill="none" opacity="0.5" />
          <circle cx={center} cy={center} r="22" stroke="#02287F" strokeWidth="2" fill="none" opacity="0.3" />
        </>
      )}
    </svg>
  );
}
