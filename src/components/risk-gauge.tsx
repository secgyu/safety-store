"use client";

import { cn } from "@/lib/utils";

type AlertLevel = "GREEN" | "YELLOW" | "ORANGE" | "RED";

interface RiskGaugeProps {
  value: number; // 0-100
  alert: AlertLevel;
  size?: "small" | "medium" | "large";
}

export function RiskGauge({ value, alert, size = "medium" }: RiskGaugeProps) {
  const getColor = (alert: AlertLevel) => {
    switch (alert) {
      case "GREEN":
        return "#10b981";
      case "YELLOW":
        return "#f59e0b";
      case "ORANGE":
        return "#f97316";
      case "RED":
        return "#ef4444";
    }
  };

  const getSize = () => {
    switch (size) {
      case "small":
        return { width: 120, radius: 48, strokeWidth: 12 };
      case "medium":
        return { width: 180, radius: 72, strokeWidth: 16 };
      case "large":
        return { width: 240, radius: 96, strokeWidth: 20 };
    }
  };

  const { width, radius, strokeWidth } = getSize();
  const center = width / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / 100) * circumference;

  const textSize = size === "small" ? "text-2xl" : size === "medium" ? "text-4xl" : "text-5xl";
  const labelSize = size === "small" ? "text-xs" : size === "medium" ? "text-sm" : "text-base";

  return (
    <div className="relative" style={{ width, height: width }}>
      <svg className="transform -rotate-90" width={width} height={width}>
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
          className="opacity-30"
        />
        {/* Progress circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={getColor(alert)}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className={cn("font-bold text-foreground", textSize)}>{value}%</div>
          <div className={cn("text-muted-foreground mt-1", labelSize)}>위험도</div>
        </div>
      </div>
    </div>
  );
}
