import React from 'react'

export default function AuroraBackground({ children }: { children?: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden bg-background">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-accent-warm blur-[120px] animate-drift-slow" />
        <div className="absolute top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-amber-500 blur-[130px] animate-drift-slower" />
        <div className="absolute -bottom-[20%] left-[20%] w-[55%] h-[55%] rounded-full bg-[#EADBC8] blur-[140px] animate-drift-slow" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  )
}
