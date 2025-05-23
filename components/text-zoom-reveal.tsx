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

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.1, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.3, 0.5, 0.7, 0.9], [0, 0.2, 0.6, 1, 0.8, 0])
  const textOpacity = useTransform(scrollYProgress, [0.6, 0.8], [1, 0])
  const blur = useTransform(scrollYProgress, [0, 0.4], [10, 0])
  const bgBlur = useTransform(scrollYProgress, [0.7, 0.9], [0, 15])
  const bgScale = useTransform(scrollYProgress, [0.7, 0.9], [1, 1.1])
  const speedLinesOpacity = useTransform(scrollYProgress, [0.2, 0.4, 0.6], [0, 1, 0])
  const speedLinesScale = useTransform(scrollYProgress, [0.2, 0.6], [0.8, 1.2])
  const textY = useTransform(scrollYProgress, [0.3, 0.5], [50, 0])
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const rotate = useTransform(scrollYProgress, [0, 0.5], [-2, 0])

  useEffect(() => {
    if (sectionRef.current && textContainerRef.current) {
      const viewportHeight = window.innerHeight
      const contentHeight = textContainerRef.current.offsetHeight
      const requiredHeight = Math.max(viewportHeight * 1.5, contentHeight * 2)
      sectionRef.current.style.height = `${requiredHeight}px`
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className={cn("relative overflow-hidden bg-black m-0 p-0", className)} // Ensure no margin or padding
    >
      {/* Background with parallax effect */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          y: bgY,
          filter: `blur(${bgBlur.get()}px)`,
          scale: bgScale,
        }}
      >
      </motion.div>

      {/* Speed lines effect */}
      <motion.div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          opacity: speedLinesOpacity,
          scale: speedLinesScale,
        }}
      >
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

      {/* Main text container */}
      <motion.div
        ref={textContainerRef}
        className="sticky top-0 h-screen flex flex-col items-center justify-center z-30 px-4"
        style={{
          scale,
          opacity,
          rotate,
        }}
      >
        <div className="relative flex flex-col items-center">
          <motion.h2
            className="text-[20vw] md:text-[12vw] font-bold text-white leading-none text-center font-['Anton',_sans-serif] tracking-tighter"
            style={{ opacity: textOpacity, y: textY }}
          >
            <span className="block">FAMILY</span>
            <span className="block text-[#ff6b00] drop-shadow-[0_0_10px_rgba(255,107,0,0.7)]">FOREVER</span>
          </motion.h2>

          <motion.p
            className="mt-4 mb-0 text-xl md:text-2xl text-white/80 text-center max-w-2xl"
            style={{ opacity: textOpacity, y: textY }}
          >
            "The most important thing in life will always be family."
          </motion.p>
        </div>
      </motion.div>
    </section>
  )
}
