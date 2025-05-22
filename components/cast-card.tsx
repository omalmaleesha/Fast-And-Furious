"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"

interface CastCardProps {
  name: string
  actor: string
  image: string
}

export default function CastCard({ name, actor, image }: CastCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="relative group overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
    >
      <div className="aspect-[3/4] relative overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        <motion.h3
          className="text-xl font-bold text-white font-['Anton',_sans-serif]"
          animate={{ y: isHovered ? -10 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {name}
        </motion.h3>

        <motion.p
          className="text-[#ff6b00]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
          transition={{ duration: 0.3 }}
        >
          {actor}
        </motion.p>
      </div>

      <motion.div
        className="absolute inset-0 border-2 border-transparent"
        animate={{ borderColor: isHovered ? "#ff6b00" : "transparent" }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}
