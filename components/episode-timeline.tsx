"use client"

import { motion } from "framer-motion"

interface Episode {
  number: number
  title: string
  description: string
}

interface EpisodeTimelineProps {
  episodes: Episode[]
  inView: boolean
}

export default function EpisodeTimeline({ episodes, inView }: EpisodeTimelineProps) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <motion.div
        className="absolute left-[15px] md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#ff6b00] to-[#ff6b00]/30"
        initial={{ scaleY: 0 }}
        animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        style={{ transformOrigin: "top" }}
      />

      <div className="space-y-16">
        {episodes.map((episode, index) => (
          <div key={episode.number} className="relative">
            <motion.div
              className={`flex items-start ${index % 2 === 0 ? "md:flex-row-reverse" : "md:flex-row"}`}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {/* Episode number circle */}
              <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-8 h-8 rounded-full bg-[#ff6b00] border-4 border-black flex items-center justify-center z-10">
                <span className="text-xs font-bold text-black">{episode.number}</span>
              </div>

              {/* Content */}
              <div
                className={`pl-12 md:pl-0 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"} w-full md:w-1/2`}
              >
                <div className="bg-[#0f0f0f] p-6 border-l-4 border-[#ff6b00] hover:bg-[#1a1a1a] transition-colors duration-300">
                  <h3 className="text-xl font-bold mb-2 text-[#ff6b00] font-['Orbitron',_sans-serif]">
                    {episode.title}
                  </h3>
                  <p className="text-gray-300">{episode.description}</p>
                </div>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  )
}
