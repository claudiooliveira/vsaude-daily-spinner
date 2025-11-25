import { useEffect, useRef } from "react";

interface WheelSpinnerProps {
  names: string[];
  isSpinning: boolean;
  selectedName: string | null;
  selectedIndex: number;
}

export const WheelSpinner = ({ names, isSpinning, selectedName, selectedIndex }: WheelSpinnerProps) => {
  const wheelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSpinning && wheelRef.current && selectedIndex >= 0) {
      const segmentAngle = 360 / names.length;
      const targetSegmentCenter = selectedIndex * segmentAngle + segmentAngle / 2;
      const targetRotation = 90 - targetSegmentCenter;
      const fullRotations = 360 * 5;
      const finalRotation = fullRotations + targetRotation;
      
      wheelRef.current.style.transition = "none";
      wheelRef.current.style.transform = "rotate(0deg)";
      
      setTimeout(() => {
        if (wheelRef.current) {
          wheelRef.current.style.transition = "transform 2s cubic-bezier(0.17, 0.67, 0.12, 0.99)";
          wheelRef.current.style.transform = `rotate(${finalRotation}deg)`;
        }
      }, 10);
    }
  }, [isSpinning, selectedIndex, names.length]);

  const segmentAngle = names.length > 0 ? 360 / names.length : 0;

  const getColorForSegment = (index: number) => {
    if (names.length === 2) {
      const twoColorColors = [
        "174 61% 40%",
        "209 39% 25%",
      ];
      return `hsl(${twoColorColors[index % 2]})`;
    }
    
    const colors = [
      "174 61% 40%",
      "174 61% 50%",
      "174 61% 30%",
      "209 39% 25%",
      "209 39% 35%",
      "209 39% 20%",
      "174 61% 45%",
      "209 39% 30%",
    ];
    return `hsl(${colors[index % colors.length]})`;
  };

  const getRadius = () => {

    const baseSize = 350;
    const radius = baseSize / 2;

    if (names.length === 2) {
      return radius * 0.65;
    } else if (names.length <= 3) {
      return radius * 0.60;
    } else if (names.length <= 6) {
      return radius * 0.55;
    } else if (names.length <= 10) {
      return radius * 0.50;
    } else {
      return radius * 0.45;
    }
  };

  const radius = getRadius();

  return (
    <div className="relative w-80 h-80 md:w-96 md:h-96">
      <div
        ref={wheelRef}
        className="absolute inset-0 rounded-full overflow-hidden shadow-2xl"
        style={{
          background: `conic-gradient(${names
            .map(
              (_, i) =>
                `${getColorForSegment(i)} ${i * segmentAngle}deg ${
                  (i + 1) * segmentAngle
                }deg`
            )
            .join(", ")})`
        }}
      >
        {names.map((name, index) => {
          const centerAngleDeg = index * segmentAngle + segmentAngle / 2;

          const centerAngleRad = (centerAngleDeg - 90) * (Math.PI / 180);
          
          const x = Math.cos(centerAngleRad) * radius;
          const y = Math.sin(centerAngleRad) * radius;

          let textRotation;
          if (names.length === 2) {
            textRotation = index === 0 ? 180 : 0;
          } else {
            textRotation = centerAngleDeg + 90;
          }

          return (
            <div
              key={index}
              className="absolute text-white font-bold text-sm md:text-base pointer-events-none"
              style={{
                left: "50%",
                top: "50%",
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${textRotation}deg)`,
                transformOrigin: "center center",
                whiteSpace: "nowrap",
                textAlign: "center",
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5), -1px -1px 2px rgba(0, 0, 0, 0.3)",
                zIndex: 10 + index
              }}
            >
              {name}
            </div>
          );
        })}
      </div>
      
      {/* Seta indicadora */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 z-20">
        <div className="relative">
          <div className="w-0 h-0 border-t-[20px] border-b-[20px] border-r-[30px] border-t-transparent border-b-transparent border-r-secondary drop-shadow-lg" />
          <div className="absolute right-1 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[16px] border-b-[16px] border-r-[24px] border-t-transparent border-b-transparent border-r-primary" />
        </div>
      </div>
      
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-16 h-16 rounded-full bg-background shadow-lg flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-secondary" />
        </div>
      </div>
    </div>
  );
};
