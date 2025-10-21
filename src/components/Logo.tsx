import { useState } from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Logo = ({ size = "md", className = "" }: LogoProps) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16"
  };

  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  // If favicon fails to load, show a simple text logo
  if (imageError) {
    return (
      <div className={`${sizeClasses[size]} ${className} flex items-center justify-center font-bold text-primary`}>
        V
      </div>
    );
  }

  return (
    <img 
      src="/favicon.ico" 
      alt="Verolabz" 
      className={`${sizeClasses[size]} ${className} object-contain`} 
      onError={handleImageError}
    />
  );
};

export default Logo;