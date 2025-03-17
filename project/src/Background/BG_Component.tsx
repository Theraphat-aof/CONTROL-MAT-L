// VideoBackground.tsx
import React from "react";
import "../Background/BG.css"

interface BackgroundProps {
  imageSrc: string;
  children: React.ReactNode;
}

const Background: React.FC<BackgroundProps> = ({ imageSrc, children }) => {
  return (
    <div
      className="image-background"
      style={{ backgroundImage: `url(${imageSrc})` }}
    >
      <div className="content">
        {children}
      </div>
    </div>
  );
};

export default Background;
