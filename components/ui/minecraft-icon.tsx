import React from 'react'
import { cn } from '@/lib/utils'

interface MinecraftIconProps {
  itemId: string
  className?: string
  size?: number
  fallback?: React.ReactNode
}

/**
 * Component to display Minecraft item icons from jacobsjo/mcicons repository
 * Uses the format: https://raw.githubusercontent.com/jacobsjo/mcicons/refs/heads/icons/itone.em/${itemId}.png
 */
export function MinecraftIcon({ 
  itemId, 
  className, 
  size = 24, 
  fallback 
}: MinecraftIconProps) {
  // Convert material name to lowercase and replace underscores with nothing for the icon URL
  // Examples: STONE -> stone, DIAMOND_SWORD -> diamond_sword, etc.
  const trimmedID = itemId.toLowerCase()
  const iconUrl = `https://raw.githubusercontent.com/jacobsjo/mcicons/refs/heads/icons/item/${trimmedID}.png`
  
  const [imageError, setImageError] = React.useState(false)
  const [imageLoaded, setImageLoaded] = React.useState(false)

  const handleImageError = () => {
    setImageError(true)
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
    setImageError(false)
  }

  // Reset error state when itemId changes
  React.useEffect(() => {
    setImageError(false)
    setImageLoaded(false)
  }, [itemId])

  if (imageError) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center bg-slate-600 rounded text-xs font-bold text-slate-300",
          className
        )}
        style={{ width: size, height: size }}
      >
        {fallback || itemId.charAt(0).toUpperCase()}
      </div>
    )
  }

  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      {!imageLoaded && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-slate-600 rounded text-xs font-bold text-slate-300 animate-pulse"
        >
          {itemId.charAt(0).toUpperCase()}
        </div>
      )}
      <img
        src={iconUrl}
        alt={`${itemId} icon`}
        className={cn(
          "w-full h-full object-contain transition-opacity",
          imageLoaded ? "opacity-100" : "opacity-0"
        )}
        onError={handleImageError}
        onLoad={handleImageLoad}
        style={{ 
          imageRendering: 'pixelated'
        }}
      />
    </div>
  )
}
