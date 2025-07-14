import React from 'react';

interface AnimatedBlobProps {
  isProcessing?: boolean;
  className?: string;
}

const AnimatedBlob: React.FC<AnimatedBlobProps> = ({ isProcessing = false, className = "" }) => {
  // CSS animations as a style object
  const blobStyles = `
    <style>
      @keyframes gentle-float {
        0%, 100% { 
          transform: translateY(0px) rotate(0deg) scale(1);
        }
        25% { 
          transform: translateY(-8px) rotate(90deg) scale(1.01);
        }
        50% { 
          transform: translateY(-12px) rotate(180deg) scale(1.02);
        }
        75% { 
          transform: translateY(-6px) rotate(270deg) scale(1.01);
        }
      }

      @keyframes intense-morph {
        0%, 100% { 
          transform: scale(1) rotate(0deg) skew(0deg);
          border-radius: 50%;
        }
        25% { 
          transform: scale(1.15) rotate(90deg) skew(2deg);
          border-radius: 60% 40% 30% 70%;
        }
        50% { 
          transform: scale(0.95) rotate(180deg) skew(-1deg);
          border-radius: 30% 60% 70% 40%;
        }
        75% { 
          transform: scale(1.1) rotate(270deg) skew(1deg);
          border-radius: 40% 30% 60% 70%;
        }
      }

      @keyframes mesh-subtle {
        0% { 
          transform: translateX(-2px) translateY(-2px) rotate(0deg) scale(1); 
          opacity: 0.6;
        }
        25% { 
          transform: translateX(1px) translateY(-1px) rotate(90deg) scale(1.01); 
          opacity: 0.7;
        }
        50% { 
          transform: translateX(2px) translateY(2px) rotate(180deg) scale(1.02); 
          opacity: 0.8;
        }
        75% { 
          transform: translateX(-1px) translateY(1px) rotate(270deg) scale(1.01); 
          opacity: 0.7;
        }
        100% { 
          transform: translateX(-2px) translateY(-2px) rotate(360deg) scale(1); 
          opacity: 0.6;
        }
      }

      @keyframes mesh-flow {
        0% { 
          transform: translateX(-8px) translateY(-8px) rotate(0deg) scale(1); 
          opacity: 0.4;
        }
        25% { 
          transform: translateX(6px) translateY(-4px) rotate(90deg) scale(1.05); 
          opacity: 0.7;
        }
        50% { 
          transform: translateX(8px) translateY(8px) rotate(180deg) scale(1.1); 
          opacity: 0.9;
        }
        75% { 
          transform: translateX(-6px) translateY(4px) rotate(270deg) scale(1.05); 
          opacity: 0.7;
        }
        100% { 
          transform: translateX(-8px) translateY(-8px) rotate(360deg) scale(1); 
          opacity: 0.4;
        }
      }

      @keyframes flow-lines {
        0%, 100% { 
          transform: translateX(-20px) scaleX(0.8) rotate(0deg);
          opacity: 0.4;
        }
        25% { 
          transform: translateX(-10px) scaleX(1.0) rotate(90deg);
          opacity: 0.6;
        }
        50% { 
          transform: translateX(20px) scaleX(1.2) rotate(180deg);
          opacity: 0.8;
        }
        75% { 
          transform: translateX(10px) scaleX(1.0) rotate(270deg);
          opacity: 0.6;
        }
      }

      @keyframes core-breathe {
        0%, 100% { 
          transform: scale(1) rotate(0deg);
          opacity: 0.9;
          filter: brightness(1);
        }
        25% { 
          transform: scale(1.02) rotate(90deg);
          opacity: 0.95;
          filter: brightness(1.1);
        }
        50% { 
          transform: scale(1.05) rotate(180deg);
          opacity: 1;
          filter: brightness(1.2);
        }
        75% { 
          transform: scale(1.02) rotate(270deg);
          opacity: 0.95;
          filter: brightness(1.1);
        }
      }

      @keyframes core-pulse {
        0%, 100% { 
          transform: scale(1) rotate(0deg);
          opacity: 0.9;
          filter: brightness(1) hue-rotate(0deg);
        }
        25% { 
          transform: scale(1.1) rotate(90deg);
          opacity: 1;
          filter: brightness(1.2) hue-rotate(90deg);
        }
        50% { 
          transform: scale(1.2) rotate(180deg);
          opacity: 1;
          filter: brightness(1.3) hue-rotate(180deg);
        }
        75% { 
          transform: scale(1.1) rotate(270deg);
          opacity: 1;
          filter: brightness(1.2) hue-rotate(270deg);
        }
      }

      @keyframes particle-float-1 {
        0%, 100% { 
          transform: translate(0, 0) scale(1) rotate(0deg); 
          opacity: 0.6; 
        }
        25% { 
          transform: translate(8px, -10px) scale(1.2) rotate(90deg); 
          opacity: 0.8; 
        }
        50% { 
          transform: translate(15px, -20px) scale(1.5) rotate(180deg); 
          opacity: 1; 
        }
        75% { 
          transform: translate(8px, -10px) scale(1.2) rotate(270deg); 
          opacity: 0.8; 
        }
      }

      @keyframes particle-float-2 {
        0%, 100% { 
          transform: translate(0, 0) scale(1) rotate(0deg); 
          opacity: 0.7; 
        }
        25% { 
          transform: translate(-9px, 8px) scale(1.1) rotate(90deg); 
          opacity: 0.9; 
        }
        50% { 
          transform: translate(-18px, 15px) scale(1.2) rotate(180deg); 
          opacity: 1; 
        }
        75% { 
          transform: translate(-9px, 8px) scale(1.1) rotate(270deg); 
          opacity: 0.9; 
        }
      }

      @keyframes particle-float-3 {
        0%, 100% { 
          transform: translate(0, 0) scale(1) rotate(0deg); 
          opacity: 0.5; 
        }
        25% { 
          transform: translate(6px, 9px) scale(1.4) rotate(90deg); 
          opacity: 0.7; 
        }
        50% { 
          transform: translate(12px, 18px) scale(1.8) rotate(180deg); 
          opacity: 1; 
        }
        75% { 
          transform: translate(6px, 9px) scale(1.4) rotate(270deg); 
          opacity: 0.7; 
        }
      }

      @keyframes particle-float-4 {
        0%, 100% { 
          transform: translate(0, 0) scale(1) rotate(0deg); 
          opacity: 0.8; 
        }
        25% { 
          transform: translate(-8px, -6px) scale(1.15) rotate(90deg); 
          opacity: 0.9; 
        }
        50% { 
          transform: translate(-15px, -12px) scale(1.3) rotate(180deg); 
          opacity: 1; 
        }
        75% { 
          transform: translate(-8px, -6px) scale(1.15) rotate(270deg); 
          opacity: 0.9; 
        }
      }

      @keyframes particle-float-5 {
        0%, 100% { 
          transform: translate(0, 0) scale(1) rotate(0deg); 
          opacity: 0.6; 
        }
        25% { 
          transform: translate(10px, 4px) scale(1.2) rotate(90deg); 
          opacity: 0.8; 
        }
        50% { 
          transform: translate(20px, 8px) scale(1.4) rotate(180deg); 
          opacity: 1; 
        }
        75% { 
          transform: translate(10px, 4px) scale(1.2) rotate(270deg); 
          opacity: 0.8; 
        }
      }

      @keyframes ripple-expand {
        0% { 
          transform: scale(0.8);
          opacity: 0.8;
        }
        50% { 
          transform: scale(1.1);
          opacity: 0.4;
        }
        100% { 
          transform: scale(1.4);
          opacity: 0;
        }
      }

      .blob-gentle-float {
        animation: gentle-float 4s ease-in-out infinite;
      }
      
      .blob-intense-morph {
        animation: intense-morph 1.5s ease-in-out infinite;
      }
      
      .blob-mesh-subtle {
        animation: mesh-subtle 6s linear infinite;
      }
      
      .blob-mesh-flow {
        animation: mesh-flow 3s ease-in-out infinite;
      }
      
      .blob-flow-lines {
        animation: flow-lines 3s ease-in-out infinite;
      }
      
      .blob-core-breathe {
        animation: core-breathe 3s ease-in-out infinite;
      }
      
      .blob-core-pulse {
        animation: core-pulse 1s ease-in-out infinite;
      }
      
      .blob-particle-1 {
        animation: particle-float-1 2s ease-in-out infinite;
      }
      
      .blob-particle-2 {
        animation: particle-float-2 2.5s ease-in-out infinite;
      }
      
      .blob-particle-3 {
        animation: particle-float-3 1.8s ease-in-out infinite;
      }
      
      .blob-particle-4 {
        animation: particle-float-4 2.2s ease-in-out infinite;
      }
      
      .blob-particle-5 {
        animation: particle-float-5 1.9s ease-in-out infinite;
      }
      
      .blob-ripple-1 {
        animation: ripple-expand 2s ease-out infinite;
      }
      
      .blob-ripple-2 {
        animation: ripple-expand 2s ease-out infinite 0.5s;
      }
      
      .blob-ripple-3 {
        animation: ripple-expand 2s ease-out infinite 1s;
      }
    </style>
  `;

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: blobStyles }} />
      <div className={`relative w-64 h-64 ${className}`}>
       
        
        {/* Main blob container */}
        <div className="absolute inset-6 flex items-center justify-center">
          <div className={`relative w-full h-full ${isProcessing ? 'blob-intense-morph' : 'blob-gentle-float'}`}>
            
            {/* Base blob shape with gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-blue-600 rounded-full opacity-90 blur-sm transform-gpu"></div>
            
            {/* 3D Mesh grid overlay */}
            <div className="absolute inset-2 rounded-full overflow-hidden">
              <div className={`absolute inset-0 ${isProcessing ? 'blob-mesh-flow' : 'blob-mesh-subtle'}`}>
                {/* Horizontal mesh lines */}
                {[...Array(12)].map((_, i) => (
                  <div
                    key={`h-${i}`}
                    className="absolute w-full h-px bg-gradient-to-r from-transparent via-cyan-300/90 to-transparent"
                    style={{
                      top: `${(i + 1) * 8}%`,
                      transform: `perspective(200px) rotateX(${i * 3}deg)`,
                      opacity: 0.8 + (i % 3) * 0.2
                    }}
                  />
                ))}
                
                {/* Vertical mesh lines */}
                {[...Array(12)].map((_, i) => (
                  <div
                    key={`v-${i}`}
                    className="absolute h-full w-px bg-gradient-to-b from-transparent via-blue-300/90 to-transparent"
                    style={{
                      left: `${(i + 1) * 8}%`,
                      transform: `perspective(200px) rotateY(${i * 3}deg)`,
                      opacity: 0.8 + (i % 3) * 0.2
                    }}
                  />
                ))}
                
                {/* Diagonal mesh lines for 3D effect */}
                {[...Array(8)].map((_, i) => (
                  <div
                    key={`d-${i}`}
                    className="absolute w-full h-px bg-gradient-to-r from-transparent via-purple-300/40 to-transparent"
                    style={{
                      top: `${10 + i * 10}%`,
                      transform: `perspective(300px) rotateX(45deg) rotateZ(${i * 15}deg)`,
                      opacity: 0.3
                    }}
                  />
                ))}
              </div>
              
              {/* Flowing wave lines - always animated */}
              <div className="absolute inset-0 blob-flow-lines">
                <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent opacity-70"></div>
                <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-300/80 to-transparent opacity-50"></div>
                <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-300/80 to-transparent opacity-60"></div>
              </div>
            </div>
            
            {/* Inner core with dynamic glow - always animated */}
            <div className={`absolute inset-8 bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 rounded-full ${isProcessing ? 'blob-core-pulse' : 'blob-core-breathe'}`}></div>
            
            {/* Floating particles - only during processing */}
            {isProcessing && (
              <>
                <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-cyan-300 rounded-full blob-particle-1"></div>
                <div className="absolute top-2/3 right-1/4 w-1.5 h-1.5 bg-blue-300 rounded-full blob-particle-2"></div>
                <div className="absolute bottom-1/3 left-1/4 w-1 h-1 bg-purple-300 rounded-full blob-particle-3"></div>
                <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-white rounded-full blob-particle-4"></div>
                <div className="absolute bottom-1/4 right-2/3 w-1 h-1 bg-cyan-200 rounded-full blob-particle-5"></div>
              </>
            )}
            
            {/* Surface ripples - only during processing */}
            {isProcessing && (
              <>
                <div className="absolute inset-8 border border-white/20 rounded-full blob-ripple-1"></div>
                <div className="absolute inset-12 border border-blue-300/30 rounded-full blob-ripple-2"></div>
                <div className="absolute inset-16 border border-purple-300/20 rounded-full blob-ripple-3"></div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AnimatedBlob;