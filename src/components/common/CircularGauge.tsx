import React from 'react';

interface CircularGaugeProps {
  value: number; // Current value or percentage
  max?: number;
  label?: string;
  sublabel?: string;
  size?: number;
  strokeWidth?: number;
  variant?: 'semi' | 'full';
  color?: string;
  trackColor?: string;
}

export const CircularGauge: React.FC<CircularGaugeProps> = ({
  value,
  max = 100,
  label,
  sublabel,
  size = 160,
  strokeWidth = 14,
  variant = 'semi',
  color = '#2563EB',
  trackColor = 'var(--border-color)',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  if (variant === 'semi') {
    const radius = (size - strokeWidth) / 2;
    const center = size / 2;
    // Semi-circle arc from 180 deg to 0 deg (or PI to 2PI)
    const circumference = Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="flex flex-col items-center justify-center">
        <svg
          width={size}
          height={size / 2 + strokeWidth}
          className="overflow-visible"
        >
          {/* Background Track */}
          <path
            d={`M ${strokeWidth / 2} ${center} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${center}`}
            fill="none"
            stroke={trackColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Progress Arc */}
          <path
            d={`M ${strokeWidth / 2} ${center} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${center}`}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
          />
        </svg>

        <div className="-mt-12 text-center">
          <div className="text-2xl font-black text-brand-dark tracking-tight">
            {label ?? `${Math.round(value)}%`}
          </div>
          {sublabel && (
            <div className="text-xs font-semibold text-brand-muted mt-0.5">
              {sublabel}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Full Circle Mode
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-xl font-bold text-brand-dark">
          {label ?? `${Math.round(percentage)}%`}
        </span>
        {sublabel && (
          <span className="text-[10px] uppercase font-semibold text-brand-muted tracking-wider">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
};
