import React from 'react'

interface StatusBadgeProps {
  status: string
  className?: string
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const getStatusColor = (s: string) => {
    switch (s) {
      case 'Submitted':
        return 'bg-neutral-500/10 text-neutral-600 dark:text-neutral-300 border-neutral-400/30'
      case 'Matched':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-400/30'
      case 'In progress':
        return 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-400/30'
      case 'Ready':
        return 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-400/30'
      case 'Delivered':
        return 'bg-green-500/10 text-green-700 dark:text-green-300 border-green-400/30'
      default:
        return 'bg-neutral-500/10 text-neutral-600 dark:text-neutral-300 border-neutral-400/30'
    }
  }

  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 border rounded-full ${getStatusColor(status)} ${className}`}>
      {status}
    </span>
  )
}
