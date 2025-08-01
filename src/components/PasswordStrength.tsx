
'use client';

import { cn } from "@/lib/utils";

interface PasswordStrengthProps {
  password?: string;
}

const getPasswordStrength = (password: string) => {
  let score = 0;
  if (!password) return score;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  
  return score;
};

export function PasswordStrength({ password = '' }: PasswordStrengthProps) {
  const strength = getPasswordStrength(password);

  const levelClasses = [
    { text: 'Weak', color: 'bg-red-500', width: 'w-1/4' },
    { text: 'Fair', color: 'bg-yellow-500', width: 'w-2/4' },
    { text: 'Good', color: 'bg-blue-500', width: 'w-3/4' },
    { text: 'Strong', color: 'bg-green-500', width: 'w-full' },
  ];
  
  const currentLevel = strength > 0 ? levelClasses[strength - 1] : null;

  return (
    <div className="space-y-2">
      <div className="w-full bg-muted rounded-full h-2">
        {currentLevel && (
            <div className={cn("h-2 rounded-full transition-all", currentLevel.color, currentLevel.width)}></div>
        )}
      </div>
      {currentLevel && <p className="text-xs font-medium">{`Password strength: ${currentLevel.text}`}</p>}
    </div>
  );
}
