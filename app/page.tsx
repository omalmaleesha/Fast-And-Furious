"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import Lenis from "@studio-freight/lenis"
import { Play, ChevronDown, Instagram, Twitter, Facebook, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import CastCard from "@/components/cast-card"
import EpisodeTimeline from "@/components/episode-timeline"
import VideoPlayer from "@/components/video-player"
import CarShowcase from "@/components/car-showcase"
import TextZoomReveal from "@/components/text-zoom-reveal"
import ScrollVideo from "@/components/scroll-video"

export default function Home() {
  // Initialize smooth scrolling with Lenis
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      smoothTouch: false, // Disable on touch devices for better performance
    })

    // Make lenis globally available for other components
    // @ts-ignore
    window.lenis = lenis

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  const textRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      if (textRef.current) {
        const fadeOutPoint = 400 // start fading after 400px scroll
        const opacity = Math.max(0, 1 - scrollY / fadeOutPoint)
        textRef.current.style.opacity = opacity
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Refs for scroll animations
  const heroRef = useRef(null)
  const synopsisRef = useRef(null)
  const castRef = useRef(null)
  const trailerRef = useRef(null)
  const timelineRef = useRef(null)

  // InView hooks for animations
  const synopsisInView = useInView(synopsisRef, { once: true, amount: 0.3 })
  const castInView = useInView(castRef, { once: true, amount: 0.2 })
  const trailerInView = useInView(trailerRef, { once: true, amount: 0.3 })
  const timelineInView = useInView(timelineRef, { once: true, amount: 0.1 })

  // Scroll animations for hero section
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 1.2]);
  const heroY = useTransform(scrollY, [0, 300], [0, 100]);
  // Cast data
  const castMembers = [
    { name: "Dominic Toretto", actor: "Vin Diesel", image: "/placeholder.svg?height=400&width=300" },
    { name: "Letty Ortiz", actor: "Michelle Rodriguez", image: "/placeholder.svg?height=400&width=300" },
    { name: "Roman Pearce", actor: "Tyrese Gibson", image: "/placeholder.svg?height=400&width=300" },
    { name: "Tej Parker", actor: "Ludacris", image: "/placeholder.svg?height=400&width=300" },
    { name: "Mia Toretto", actor: "Jordana Brewster", image: "/placeholder.svg?height=400&width=300" },
    { name: "Han Lue", actor: "Sung Kang", image: "/placeholder.svg?height=400&width=300" },
  ]

  // Episode data
  const episodes = [
    { number: 1, title: "Origins", description: "The beginning of the street racing legacy." },
    { number: 2, title: "Family Bonds", description: "Dominic's crew faces their first major challenge." },
    { number: 3, title: "Tokyo Drift", description: "The crew takes their skills to the streets of Tokyo." },
    { number: 4, title: "High Stakes", description: "A dangerous heist puts everyone at risk." },
    { number: 5, title: "Redemption", description: "Old enemies become allies in an unexpected turn of events." },
    { number: 6, title: "Final Race", description: "The season finale brings everything to a dramatic conclusion." },
  ]

  return (
    <main className="relative bg-black text-white overflow-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className="relative pb-10 pt-10 flex items-center justify-center overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
      {/* Background Image */}
      <motion.div className="absolute inset-0 z-0" style={{ opacity: heroOpacity, scale: heroScale, y: heroY, z: -100 }}>
        <div className="absolute inset-0 bg-black/50 z-10" />
        <Image
          src="/images/back.jpeg?height=1080&width=1920"
          alt="Fast & Furious"
          fill
          className="object-cover"
          priority
        />
      </motion.div>

      {/* Parallax Layer */}
      <motion.div
        className="absolute inset-0 z-5"
        style={{ opacity: heroOpacity * 0.5, y: heroY * 0.5, z: -50 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
      </motion.div>

      {/* Speed Lines */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-transparent via-[#ff6b00] to-transparent z-5"
          style={{ width: '100vw', top: `${30 + i * 20}%` }}
          initial={{ x: '-100vw' }}
          animate={{ x: '100vw' }}
          transition={{ duration: 1 + i * 0.5, repeat: Infinity, repeatDelay: 3 + i * 1, delay: 2 }}
        />
      ))}

      <div className="container relative z-10 px-4 mx-auto text-center" style={{ transform: 'translateZ(50px)' }}>
        {/* Logo and Title */}
        <motion.div
          initial={{ opacity: 0, rotateY: 90 }}
          animate={{ opacity: 1, rotateY: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ transformStyle: 'preserve-3d' }}
          className="mb-6 relative"
        >
          <Image
            src="/images/image1.jpeg?height=50&width=600"
            alt="Fast & Furious Logo"
            width={600}
            height={50}
            className="mx-auto"
          />
          <motion.h1
            ref={textRef}
            style={{
              opacity: heroOpacity, // Dynamically fades out on scroll
              zIndex: 1, // Ensures it appears behind other elements
              transform: `translateY(${heroY}px)`, // Moves with scroll
            }}
            className="absolute top-8 left-1/2 text-6xl font-bold text-black font-['Anton',_sans-serif] -translate-x-1/2 pointer-events-none"
          >
            FAST & FURIOUS
          </motion.h1>
        </motion.div>

        {/* Staggered Subtitle */}
        <motion.h2
          className="text-2xl md:text-4xl font-bold mb-8 text-[#ff6b00] font-['Anton',_sans-serif] text-center"
          style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
        >
          {["RIDE", "OR", "DIE.", "THE", "SAGA", "CONTINUES."].map((word, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
            >
              {word}{" "}
            </motion.span>
          ))}
        </motion.h2>

        {/* Button with Pulsing Effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex justify-center items-center"
          >
            <Button
              size="lg"
              className="bg-[#ff6b00] hover:bg-[#ff8c00] text-black font-bold rounded-none px-8 py-6 text-lg shadow-md"
            >
              <Play className="mr-2 h-5 w-5" /> WATCH NOW
            </Button>
          </motion.div>
        </motion.div>

        {/* Bobbing Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, -10, 0] }}
          transition={{ duration: 1, delay: 1.5, repeat: Infinity, repeatType: "loop" }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex justify-center items-center"
        >
          <ChevronDown className="h-10 w-10 text-[#ff6b00]" />
        </motion.div>
      </div>
    </section>

      {/* Text Zoom Reveal Section */}
      <TextZoomReveal />

      {/* Scroll-Controlled Video Section */}
      <ScrollVideo />

      {/* Synopsis Section */}
      <section ref={synopsisRef} className="py-20 bg-gradient-to-b from-black to-[#0a0a0a]">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={synopsisInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-8 text-[#ff6b00] font-['Orbitron',_sans-serif]">
              THE STORY
            </h2>
            <div className="space-y-6 text-lg md:text-xl text-gray-300">
              <p>
                For the first time, the high-octane world of Fast & Furious comes to television in this groundbreaking
                series that explores the origins of the street racing family we've come to love.
              </p>
              <p>
                Set in the gritty streets of Los Angeles, this series follows Dominic Toretto and his crew as they
                navigate the dangerous world of street racing, heists, and family loyalty. With each episode pushing the
                boundaries of speed and action, this is the untold story that started it all.
              </p>
              <p>
                When a mysterious new player enters the scene with connections to Dom's past, the crew must come
                together like never before. In this world, it's not just about how fast you are—it's about who you're
                willing to ride or die for.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cast Section */}
      <section ref={castRef} className="py-20 bg-[#0a0a0a]">
        <div className="container px-4 mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={castInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold mb-12 text-center text-[#ff6b00] font-['Orbitron',_sans-serif]"
          >
            THE CREW
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {castMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                animate={castInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <CastCard name={member.name} actor={member.actor} image={member.image} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trailer Section */}
      <section ref={trailerRef} className="py-20 bg-gradient-to-b from-[#0a0a0a] to-black">
        <div className="container px-4 mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={trailerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold mb-12 text-center text-[#ff6b00] font-['Orbitron',_sans-serif]"
          >
            OFFICIAL TRAILER
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={trailerInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto relative aspect-video overflow-hidden rounded-lg border-2 border-[#ff6b00]"
          >
            <VideoPlayer />
          </motion.div>
        </div>
      </section>

      {/* Episode Timeline */}
      <section ref={timelineRef} className="py-20 bg-black">
        <div className="container px-4 mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={timelineInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold mb-12 text-center text-[#ff6b00] font-['Orbitron',_sans-serif]"
          >
            EPISODES
          </motion.h2>

          <div className="max-w-4xl mx-auto">
            <EpisodeTimeline episodes={episodes} inView={timelineInView} />
          </div>
        </div>
      </section>

      {/* Car Showcase Section */}
      <CarShowcase />

      {/* CTA Footer */}
      <section className="py-20 bg-gradient-to-b from-black to-[#120700]">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#ff6b00] font-['Anton',_sans-serif]">
              JOIN THE FAMILY
            </h2>
            <p className="text-lg mb-8 text-gray-300">
              Sign up for exclusive content, behind-the-scenes footage, and updates on the Fast & Furious TV series.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-12">
              <Input type="email" placeholder="Your email" className="bg-[#1a1a1a] border-[#ff6b00] text-white" />
              <Button className="bg-[#ff6b00] hover:bg-[#ff8c00] text-black font-bold">SUBSCRIBE</Button>
            </div>

            <div className="flex justify-center space-x-6 mb-8">
              <Link href="#" className="text-gray-400 hover:text-[#ff6b00] transition-colors">
                <Instagram className="h-6 w-6" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-[#ff6b00] transition-colors">
                <Twitter className="h-6 w-6" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-[#ff6b00] transition-colors">
                <Facebook className="h-6 w-6" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-[#ff6b00] transition-colors">
                <Youtube className="h-6 w-6" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>

            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Fast & Furious TV Series. All rights reserved.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
