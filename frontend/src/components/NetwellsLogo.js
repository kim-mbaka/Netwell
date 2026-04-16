import React from 'react';

export default function NetwellsLogo({ size = 'medium', variant = 'full', theme = 'dark', imageSrc = null }) {
  const sizeMaps = {
    small: {
      logoHeight: 40,
      fontSize: 20,
      taglineSize: 8,
      gap: 4,
    },
    medium: {
      logoHeight: 80,
      fontSize: 36,
      taglineSize: 14,
      gap: 6,
    },
    large: {
      logoHeight: 120,
      fontSize: 64,
      taglineSize: 24,
      gap: 10,
    },
  };

  const config = sizeMaps[size];

  // Colors (from design spec)
  const RED = '#991D35';
  const GREEN = '#2E7D32';
  const WHITE = '#FFFFFF';
  const LIME = '#77CD0C';
  const textColor = theme === 'dark' ? LIME : '#02287F';
  const taglineColor = theme === 'dark' ? WHITE : 'rgba(2, 40, 127, 0.6)';

  // Icon proportions
  const globeRadius = config.logoHeight / 2.4;
  const outerArcRadius = globeRadius * 1.2;
  const innerArcRadius = globeRadius * 0.9;
  const arcGap = globeRadius * 0.2; // 10% of diameter
  const arcThickness = globeRadius * 0.15;
  const crossThickness = globeRadius * 0.12;

  const iconSize = config.logoHeight;
  const viewBoxSize = iconSize * 1.2;

  return (
    <>
      {variant === 'full' && (
        <div className="flex items-center" style={{ gap: `${config.gap}px` }}>
          {imageSrc ? (
            <img 
              src={imageSrc} 
              alt="Netwells Logo" 
              style={{ 
                height: `${iconSize}px`, 
                width: `${iconSize}px`, 
                objectFit: 'contain' 
              }}
            />
          ) : (
            <NetwellsIcon
              globeRadius={globeRadius}
              outerArcRadius={outerArcRadius}
              innerArcRadius={innerArcRadius}
              arcThickness={arcThickness}
              crossThickness={crossThickness}
              iconSize={iconSize}
              viewBoxSize={viewBoxSize}
            />
          )}
          <div className="flex flex-col" style={{ lineHeight: 1 }}>
            <span
              style={{
                fontSize: `${config.fontSize}px`,
                fontWeight: 700,
                color: textColor,
                letterSpacing: '-0.5px',
              }}
            >
              Netwells
            </span>
          </div>
        </div>
      )}

      {variant === 'icon-only' && (
        imageSrc ? (
          <img 
            src={imageSrc} 
            alt="Netwells Logo" 
            style={{ 
              height: `${iconSize}px`, 
              width: `${iconSize}px`, 
              objectFit: 'contain' 
            }}
          />
        ) : (
          <NetwellsIcon
            globeRadius={globeRadius}
            outerArcRadius={outerArcRadius}
            innerArcRadius={innerArcRadius}
            arcThickness={arcThickness}
            crossThickness={crossThickness}
            iconSize={iconSize}
            viewBoxSize={viewBoxSize}
          />
        )
      )}

      {variant === 'stacked' && (
        <div className="flex flex-col items-center" style={{ gap: `${config.gap}px` }}>
          {imageSrc ? (
            <img 
              src={imageSrc} 
              alt="Netwells Logo" 
              style={{ 
                height: `${iconSize}px`, 
                width: `${iconSize}px`, 
                objectFit: 'contain' 
              }}
            />
          ) : (
            <NetwellsIcon
              globeRadius={globeRadius}
              outerArcRadius={outerArcRadius}
              innerArcRadius={innerArcRadius}
              arcThickness={arcThickness}
              crossThickness={crossThickness}
              iconSize={iconSize}
              viewBoxSize={viewBoxSize}
            />
          )}
          <div className="flex flex-col items-center" style={{ lineHeight: 1 }}>
            <span
              style={{
                fontSize: `${config.fontSize}px`,
                fontWeight: 'bold',
                color: textColor,
                letterSpacing: '-0.5px',
              }}
            >
              Netwells
            </span>
            <span
              style={{
                fontSize: `${config.taglineSize}px`,
                fontWeight: '300',
                color: taglineColor,
                marginTop: '2px',
                letterSpacing: '0.5px',
              }}
            >
              SOLUTIONS
            </span>
          </div>
        </div>
      )}
    </>
  );
}

function NetwellsIcon({
  globeRadius,
  outerArcRadius,
  innerArcRadius,
  arcThickness,
  crossThickness,
  iconSize,
  viewBoxSize,
}) {
  const RED = '#991D35';
  const GREEN = '#2E7D32';
  const WHITE = '#FFFFFF';

  const centerX = viewBoxSize / 2;
  const centerY = viewBoxSize / 2;

  // Arc path generator for semi-circles
  const createArcPath = (radius, thickness) => {
    const innerR = radius - thickness / 2;
    const outerR = radius + thickness / 2;
    const x1 = centerX - outerR;
    const y1 = centerY - 60; // Above the globe
    const x2 = centerX + outerR;
    const y2 = centerY - 60;

    return `M ${x1} ${y1} A ${outerR} ${outerR} 0 0 1 ${x2} ${y2} L ${centerX + innerR} ${centerY - 60 + thickness} A ${innerR} ${innerR} 0 1 0 ${centerX - innerR} ${centerY - 60 + thickness} Z`;
  };

  return (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      className="drop-shadow-lg"
      style={{ display: 'flex' }}
    >
      <defs>
        <filter id="softGlow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" />
        </filter>
      </defs>

      {/* Outer Arc (Top, Larger) */}
      <path
        d={createArcPath(outerArcRadius, arcThickness)}
        fill={RED}
        filter="url(#softGlow)"
      />

      {/* Inner Arc (Bottom, Smaller) */}
      <path
        d={createArcPath(innerArcRadius, arcThickness)}
        fill={RED}
        filter="url(#softGlow)"
        style={{ transform: `translateY(${arcThickness * 1.5}px)` }}
      />

      {/* Globe Circle (Green) */}
      <circle
        cx={centerX}
        cy={centerY}
        r={globeRadius}
        fill={GREEN}
        filter="url(#softGlow)"
      />

      {/* Vertical Cross Line (White) */}
      <line
        x1={centerX}
        y1={centerY - globeRadius}
        x2={centerX}
        y2={centerY + globeRadius}
        stroke={WHITE}
        strokeWidth={crossThickness}
        strokeLinecap="round"
      />

      {/* Horizontal Cross Line (White) */}
      <line
        x1={centerX - globeRadius}
        y1={centerY}
        x2={centerX + globeRadius}
        y2={centerY}
        stroke={WHITE}
        strokeWidth={crossThickness}
        strokeLinecap="round"
      />

      {/* Vertical Grid Lines (White, subtle) */}
      <line
        x1={centerX - globeRadius * 0.5}
        y1={centerY - globeRadius}
        x2={centerX - globeRadius * 0.5}
        y2={centerY + globeRadius}
        stroke={WHITE}
        strokeWidth={crossThickness * 0.7}
        strokeLinecap="round"
        opacity="0.7"
      />
      <line
        x1={centerX + globeRadius * 0.5}
        y1={centerY - globeRadius}
        x2={centerX + globeRadius * 0.5}
        y2={centerY + globeRadius}
        stroke={WHITE}
        strokeWidth={crossThickness * 0.7}
        strokeLinecap="round"
        opacity="0.7"
      />

      {/* Horizontal Grid Lines (White, subtle) */}
      <line
        x1={centerX - globeRadius}
        y1={centerY - globeRadius * 0.5}
        x2={centerX + globeRadius}
        y2={centerY - globeRadius * 0.5}
        stroke={WHITE}
        strokeWidth={crossThickness * 0.7}
        strokeLinecap="round"
        opacity="0.7"
      />
      <line
        x1={centerX - globeRadius}
        y1={centerY + globeRadius * 0.5}
        x2={centerX + globeRadius}
        y2={centerY + globeRadius * 0.5}
        stroke={WHITE}
        strokeWidth={crossThickness * 0.7}
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}
