"use client"

import { useRef, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

interface TextZoomRevealProps {
  className?: string
}

export default function TextZoomReveal({ className }: TextZoomRevealProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const textContainerRef = useRef<HTMLDivElement>(null)

  // Set up scroll animations
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  // Transform values based on scroll
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.1, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.3, 0.5, 0.7, 0.9], [0, 0.2, 0.6, 1, 0.8, 0])
  const textOpacity = useTransform(scrollYProgress, [0.6, 0.8], [1, 0])
  const blur = useTransform(scrollYProgress, [0, 0.4], [10, 0])

  // Background effects
  const bgBlur = useTransform(scrollYProgress, [0.7, 0.9], [0, 15])
  const bgScale = useTransform(scrollYProgress, [0.7, 0.9], [1, 1.1])

  // Speed lines effect
  const speedLinesOpacity = useTransform(scrollYProgress, [0.2, 0.4, 0.6], [0, 1, 0])
  const speedLinesScale = useTransform(scrollYProgress, [0.2, 0.6], [0.8, 1.2])

  // Text reveal animation
  const textY = useTransform(scrollYProgress, [0.3, 0.5], [50, 0])

  // Parallax effect for depth
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])

  // Add a subtle rotation effect
  const rotate = useTransform(scrollYProgress, [0, 0.5], [-2, 0])

  // Car silhouette animations
  const carOpacity1 = useTransform(scrollYProgress, [0.25, 0.35, 0.7, 0.8], [0, 1, 1, 0])
  const carOpacity2 = useTransform(scrollYProgress, [0.3, 0.4, 0.65, 0.75], [0, 1, 1, 0])
  const carOpacity3 = useTransform(scrollYProgress, [0.35, 0.45, 0.6, 0.7], [0, 1, 1, 0])
  const carOpacity4 = useTransform(scrollYProgress, [0.4, 0.5, 0.55, 0.65], [0, 1, 1, 0])

  const carX1 = useTransform(scrollYProgress, [0.25, 0.4], ["-100%", "0%"])
  const carX2 = useTransform(scrollYProgress, [0.3, 0.45], ["100%", "0%"])
  const carX3 = useTransform(scrollYProgress, [0.35, 0.5], ["-100%", "0%"])
  const carX4 = useTransform(scrollYProgress, [0.4, 0.55], ["100%", "0%"])

  // Ensure the section is tall enough for a good scroll experience
  useEffect(() => {
    if (sectionRef.current) {
      const viewportHeight = window.innerHeight
      sectionRef.current.style.height = `${viewportHeight * 2}px`
    }
  }, [])

  return (
    <section ref={sectionRef} className={cn("relative overflow-hidden bg-black", className)}>
      {/* Background with parallax effect */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          y: bgY,
          filter: `blur(${bgBlur.get()}px)`,
          scale: bgScale,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#1a0d00] to-black opacity-90 z-10" />
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center" />
      </motion.div>

      {/* Speed lines effect */}
      <motion.div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          opacity: speedLinesOpacity,
          scale: speedLinesScale,
        }}
      >
        {/* Horizontal speed lines */}
        <div className="absolute inset-0 flex flex-col justify-center items-center">
          {[...Array(20)].map((_, i) => (
            <div
              key={`h-line-${i}`}
              className="w-full h-[1px] bg-[#ff6b00]/30 my-8"
              style={{
                transform: `translateY(${(i - 10) * 30}px) scaleY(${Math.random() * 0.5 + 0.5})`,
                opacity: Math.random() * 0.5 + 0.2,
              }}
            />
          ))}
        </div>

        {/* Radial speed lines */}
        <div className="absolute inset-0 flex justify-center items-center">
          {[...Array(24)].map((_, i) => {
            const angle = (i / 24) * 360
            const length = Math.random() * 30 + 70
            return (
              <div
                key={`r-line-${i}`}
                className="absolute h-[1px] bg-gradient-to-r from-[#ff6b00]/80 to-transparent"
                style={{
                  width: `${length}%`,
                  transform: `rotate(${angle}deg)`,
                  opacity: Math.random() * 0.4 + 0.1,
                }}
              />
            )
          })}
        </div>
      </motion.div>

      {/* Car Silhouettes */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {/* Dodge Charger Silhouette - Top Left */}
        <motion.div
          className="absolute top-[15%] left-0 w-[40%] md:w-[30%] h-auto"
          style={{
            opacity: carOpacity1,
            x: carX1,
          }}
        >
          <div className="relative w-full aspect-[2.5/1]">
            <svg viewBox="0 0 250 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path
                d="M240 65H230L225 55H200L190 45H130L120 55H80L70 65H20L10 75V85H240V75L240 65Z"
                fill="black"
                stroke="#ff6b00"
                strokeWidth="1"
                strokeOpacity="0.6"
              />
              <circle cx="50" cy="85" r="10" fill="black" stroke="#ff6b00" strokeWidth="1" strokeOpacity="0.6" />
              <circle cx="200" cy="85" r="10" fill="black" stroke="#ff6b00" strokeWidth="1" strokeOpacity="0.6" />
              <path
                d="M130 45V25L150 25L160 35L170 35L180 45H130Z"
                fill="black"
                stroke="#ff6b00"
                strokeWidth="1"
                strokeOpacity="0.6"
              />
            </svg>
            <div className="absolute inset-0 blur-[5px] opacity-50 bg-[#ff6b00]/20"></div>
          </div>
        </motion.div>

        {/* Skyline GTR Silhouette - Top Right */}
        <motion.div
          className="absolute top-[25%] right-0 w-[40%] md:w-[30%] h-auto"
          style={{
            opacity: carOpacity2,
            x: carX2,
          }}
        >
          <div className="relative w-full aspect-[2.5/1]">
            <svg viewBox="0 0 250 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path
                d="M10 65H20L25 55H50L60 45H120L130 55H170L180 65H230L240 75V85H10V75L10 65Z"
                fill="black"
                stroke="#ff6b00"
                strokeWidth="1"
                strokeOpacity="0.6"
              />
              <circle cx="50" cy="85" r="10" fill="black" stroke="#ff6b00" strokeWidth="1" strokeOpacity="0.6" />
              <circle cx="200" cy="85" r="10" fill="black" stroke="#ff6b00" strokeWidth="1" strokeOpacity="0.6" />
              <path
                d="M120 45V30H100L90 40H80L70 45H120Z"
                fill="black"
                stroke="#ff6b00"
                strokeWidth="1"
                strokeOpacity="0.6"
              />
            </svg>
            <div className="absolute inset-0 blur-[5px] opacity-50 bg-[#ff6b00]/20"></div>
          </div>
        </motion.div>

        {/* Supra Silhouette - Bottom Left */}
        <motion.div
          className="absolute bottom-[25%] left-0 w-[40%] md:w-[30%] h-auto"
          style={{
            opacity: carOpacity3,
            x: carX3,
          }}
        >
          <div className="relative w-full aspect-[2.5/1]">
            <svg viewBox="0 0 250 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path
                d="M240 65H230L220 55H190L180 45H130L120 55H80L70 65H20L10 75V85H240V75L240 65Z"
                fill="black"
                stroke="#ff6b00"
                strokeWidth="1"
                strokeOpacity="0.6"
              />
              <circle cx="50" cy="85" r="10" fill="black" stroke="#ff6b00" strokeWidth="1" strokeOpacity="0.6" />
              <circle cx="200" cy="85" r="10" fill="black" stroke="#ff6b00" strokeWidth="1" strokeOpacity="0.6" />
              <path
                d="M130 45V30H150L160 40H170L180 45H130Z"
                fill="black"
                stroke="#ff6b00"
                strokeWidth="1"
                strokeOpacity="0.6"
              />
            </svg>
            <div className="absolute inset-0 blur-[5px] opacity-50 bg-[#ff6b00]/20"></div>
          </div>
        </motion.div>

        {/* Muscle Car Silhouette - Bottom Right */}
        <motion.div
          className="absolute bottom-[15%] right-0 w-[40%] md:w-[30%] h-auto"
          style={{
            opacity: carOpacity4,
            x: carX4,
          }}
        >
          <div className="relative w-full aspect-[2.5/1]">
            <svg viewBox="0 0 250 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path
                d="M10 65H30L40 55H70L80 45H170L180 55H210L220 65H230L240 75V85H10V75L10 65Z"
                fill="black"
                stroke="#ff6b00"
                strokeWidth="1"
                strokeOpacity="0.6"
              />
              <circle cx="50" cy="85" r="10" fill="black" stroke="#ff6b00" strokeWidth="1" strokeOpacity="0.6" />
              <circle cx="200" cy="85" r="10" fill="black" stroke="#ff6b00" strokeWidth="1" strokeOpacity="0.6" />
              <path d="M80 45V25H160V45H80Z" fill="black" stroke="#ff6b00" strokeWidth="1" strokeOpacity="0.6" />
            </svg>
            <div className="absolute inset-0 blur-[5px] opacity-50 bg-[#ff6b00]/20"></div>
          </div>
        </motion.div>

        {/* Tire tracks */}
        <div className="absolute bottom-[5%] left-0 right-0 h-[20px] overflow-hidden">
          <motion.div
            className="w-full h-full"
            style={{
              x: useTransform(scrollYProgress, [0.3, 0.7], ["-100%", "100%"]),
              opacity: useTransform(scrollYProgress, [0.3, 0.4, 0.6, 0.7], [0, 1, 1, 0]),
            }}
          >
            <svg viewBox="0 0 1000 20" className="w-full h-full">
              <path d="M0 10 H1000" stroke="#ff6b00" strokeWidth="1" strokeDasharray="5 15" strokeOpacity="0.3" />
              <path d="M0 15 H1000" stroke="#ff6b00" strokeWidth="1" strokeDasharray="5 15" strokeOpacity="0.3" />
            </svg>
          </motion.div>
        </div>
      </div>

      {/* Main text container */}
      <motion.div
        ref={textContainerRef}
        className="sticky top-0 h-screen flex flex-col items-center justify-center z-30 px-4"
        style={{
          scale,
          opacity,
          filter: `blur(${blur.get()}px)`,
          rotate,
        }}
      >
        <div className="relative flex flex-col items-center">
          {/* Main text */}
          <motion.h2
            className="text-[15vw] md:text-[12vw] font-bold text-white leading-none text-center font-['Anton',_sans-serif] tracking-tighter"
            style={{ opacity: textOpacity, y: textY }}
          >
            <span className="block">FAMILY</span>
            <span className="block text-[#ff6b00] drop-shadow-[0_0_10px_rgba(255,107,0,0.7)]">FOREVER</span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            className="mt-4 text-xl md:text-2xl text-white/80 text-center max-w-2xl"
            style={{ opacity: textOpacity, y: textY }}
          >
            "The most important thing in life will always be family."
          </motion.p>
        </div>
      </motion.div>

      {/* Car silhouette inside text (clipping mask effect) */}
      <div className="absolute inset-0 z-25 pointer-events-none overflow-hidden">
        <motion.div
          className="w-full h-full flex items-center justify-center"
          style={{
            opacity: useTransform(scrollYProgress, [0.4, 0.5, 0.6], [0, 0.15, 0]),
          }}
        >
          <div className="relative w-[80%] max-w-4xl aspect-[3/1]">
            <svg viewBox="0 0 300 100" className="w-full h-full">
              <defs>
                <mask id="textMask">
                  <rect width="100%" height="100%" fill="black" />
                  <text
                    x="150"
                    y="50"
                    fontSize="40"
                    fontFamily="Anton, sans-serif"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                  >
                    FAMILY FOREVER
                  </text>
                </mask>
              </defs>

              {/* Dodge Charger silhouette clipped by text */}
              <g mask="url(#textMask)">
                <path
                  d="M10 65H30L40 55H70L80 45H170L180 55H210L220 65H230L240 75V85H10V75L10 65Z"
                  fill="#ff6b00"
                  opacity="0.8"
                />
                <circle cx="50" cy="85" r="10" fill="#ff6b00" opacity="0.8" />
                <circle cx="200" cy="85" r="10" fill="#ff6b00" opacity="0.8" />
                <path d="M80 45V25H160V45H80Z" fill="#ff6b00" opacity="0.8" />
              </g>
            </svg>
          </div>
        </motion.div>
      </div>

      {/* Grain overlay for cinematic effect */}
      <div className="absolute inset-0 z-40 pointer-events-none opacity-20 mix-blend-overlay">
        <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]" />
      </div>
    </section>
  )
}
