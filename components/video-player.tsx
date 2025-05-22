"use client"

import { useState } from "react"
import Image from "next/image"
import { Play } from "lucide-react"

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlay = () => {
    setIsPlaying(true)
  }

  if (isPlaying) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center">
        <p className="text-white text-lg">Video would play here</p>
        {/* In a real implementation, this would be a video element */}
        {/* <video 
          src="/trailer.mp4" 
          controls 
          autoPlay 
          className="w-full h-full object-cover"
        /> */}
      </div>
    )
  }

  return (
    <div className="relative w-full h-full group cursor-pointer" onClick={handlePlay}>
      <Image src="/placeholder.svg?height=720&width=1280" alt="Trailer thumbnail" fill className="object-cover" />
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-[#ff6b00]/80 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Play className="h-10 w-10 text-white fill-white" />
        </div>
      </div>
    </div>
  )
}
