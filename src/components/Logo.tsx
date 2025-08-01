
import { cn } from "@/lib/utils";

export const Logo = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 300 100"
    className={cn("text-primary", className)}
    style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.5))' }}
  >
    <defs>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&display=swap');`}
      </style>
    </defs>
    <g fill="hsl(var(--accent))">
      {/* Upper left wing */}
      <path d="M90,35 C70,30 50,30 30,40 C50,45 70,45 90,42 Z" />
      <path d="M85,38 C65,35 45,35 25,45 C45,50 65,50 85,46 Z" />
      <path d="M80,41 C60,40 40,40 20,50 C40,55 60,55 80,50 Z" />

      {/* Lower left wing */}
      <path d="M90,65 C70,70 50,70 30,60 C50,55 70,55 90,58 Z" />
      <path d="M85,62 C65,65 45,65 25,55 C45,50 65,50 85,54 Z" />
      <path d="M80,59 C60,60 40,60 20,50 C40,45 60,45 80,50 Z" />

      {/* Upper right wing */}
      <path d="M210,35 C230,30 250,30 270,40 C250,45 230,45 210,42 Z" />
      <path d="M215,38 C235,35 255,35 275,45 C255,50 235,50 215,46 Z" />
      <path d="M220,41 C240,40 260,40 280,50 C260,55 240,55 220,50 Z" />

      {/* Lower right wing */}
      <path d="M210,65 C230,70 250,70 270,60 C250,55 230,55 210,58 Z" />
      <path d="M215,62 C235,65 255,65 275,55 C255,50 235,50 215,54 Z" />
      <path d="M220,59 C240,60 260,60 280,50 C260,45 240,45 220,50 Z" />
    </g>

    <text
      x="150"
      y="55"
      dominantBaseline="middle"
      textAnchor="middle"
      fill="currentColor"
      fontSize="36"
      fontFamily="Cinzel, serif"
      fontWeight="700"
      letterSpacing="4"
    >
      KALA
    </text>
  </svg>
);
