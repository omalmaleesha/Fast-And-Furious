"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform, type PanInfo, useDragControls } from "framer-motion"
import { ChevronDown, ChevronLeft, ChevronRight, Play, Pause, SkipForward, SkipBack } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ScrollVideoProps {
  className?: string
}

export default function ScrollVideo({ className }: ScrollVideoProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const scrubberRef = useRef<HTMLDivElement>(null)
  const dragControls = useDragControls()

  const [isLoaded, setIsLoaded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentChapter, setCurrentChapter] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [touchProgress, setTouchProgress] = useState(0)
  const [showControls, setShowControls] = useState(true)

  // Timeline chapters for the video
  const chapters = [
    { id: 0, time: 0, title: "The Beginning", year: "2001" },
    { id: 1, time: 0.2, title: "Tokyo Drift", year: "2006" },
    { id: 2, time: 0.4, title: "The Crew Assembles", year: "2011" },
    { id: 3, time: 0.6, title: "Going Global", year: "2015" },
    { id: 4, time: 0.8, title: "Legacy", year: "2023" },
  ]

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Set up scroll animations for desktop
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  })

  // Transform values based on scroll (for desktop)
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0.8, 1, 1, 0.8])
  const titleOpacity = useTransform(scrollYProgress, [0, 0.1, 0.3], [1, 1, 0])
  const instructionOpacity = useTransform(scrollYProgress, [0, 0.1, 0.2], [1, 1, 0])

  useEffect(() => {
    if (!videoRef.current || !sectionRef.current) return

    const video = videoRef.current

    // When video metadata is loaded, we can access duration
    const handleVideoLoaded = () => {
      setIsLoaded(true)
    }

    // If video is already loaded
    if (video.readyState >= 2) {
      setIsLoaded(true)
    } else {
      video.addEventListener("loadeddata", handleVideoLoaded)
    }

    // For desktop: Update video time based on scroll position
    if (!isMobile) {
      const unsubscribe = scrollYProgress.onChange((value) => {
        if (video.duration) {
          // Set video time based on scroll progress
          video.currentTime = video.duration * value
          setProgress(value * 100)

          // Update current chapter based on progress
          updateCurrentChapter(value)
        }
      })

      return () => {
        video.removeEventListener("loadeddata", handleVideoLoaded)
        unsubscribe()
      }
    }

    return () => {
      video.removeEventListener("loadeddata", handleVideoLoaded)
    }
  }, [scrollYProgress, isMobile])

  // Update current chapter based on progress
  const updateCurrentChapter = (value: number) => {
    for (let i = chapters.length - 1; i >= 0; i--) {
      if (value >= chapters[i].time) {
        setCurrentChapter(i)
        break
      }
    }
  }

  // Handle mobile video playback
  useEffect(() => {
    if (!isMobile || !videoRef.current) return

    const video = videoRef.current

    // Auto-hide controls after 3 seconds of inactivity
    let timeout: NodeJS.Timeout
    const resetControlsTimeout = () => {
      clearTimeout(timeout)
      setShowControls(true)
      timeout = setTimeout(() => {
        if (!isDragging && isPlaying) {
          setShowControls(false)
        }
      }, 3000)
    }

    // Set up event listeners for mobile
    const handleTouchStart = () => {
      resetControlsTimeout()
    }

    // Play/pause on video tap
    const handleVideoTap = (e: MouseEvent) => {
      // Don't trigger if tapping on a control
      if ((e.target as HTMLElement).closest(".video-controls")) return

      if (isPlaying) {
        video.pause()
        setIsPlaying(false)
      } else {
        video.play()
        setIsPlaying(true)
        resetControlsTimeout()
      }
    }

    // Update progress during playback
    const handleTimeUpdate = () => {
      if (video.duration) {
        const newProgress = (video.currentTime / video.duration) * 100
        setProgress(newProgress)
        setTouchProgress(newProgress / 100)
        updateCurrentChapter(video.currentTime / video.duration)
      }
    }

    // Handle video end
    const handleVideoEnd = () => {
      setIsPlaying(false)
      setShowControls(true)
    }

    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("ended", handleVideoEnd)
    document.addEventListener("touchstart", handleTouchStart)
    video.addEventListener("click", handleVideoTap)

    resetControlsTimeout()

    return () => {
      clearTimeout(timeout)
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("ended", handleVideoEnd)
      document.removeEventListener("touchstart", handleTouchStart)
      video.removeEventListener("click", handleVideoTap)
    }
  }, [isMobile, isPlaying, isDragging])

  // Handle scrubber drag on mobile
  const handleDragStart = () => {
    setIsDragging(true)
    if (videoRef.current && isPlaying) {
      videoRef.current.pause()
    }
  }

  const handleDrag = (_: any, info: PanInfo) => {
    if (!scrubberRef.current || !videoRef.current) return

    const scrubberWidth = scrubberRef.current.clientWidth
    const newX = info.point.x
    const scrubberRect = scrubberRef.current.getBoundingClientRect()
    const scrubberStart = scrubberRect.left

    // Calculate progress (0-1)
    let newProgress = (newX - scrubberStart) / scrubberWidth
    newProgress = Math.max(0, Math.min(1, newProgress))

    setTouchProgress(newProgress)
    setProgress(newProgress * 100)

    // Update video time
    if (videoRef.current.duration) {
      videoRef.current.currentTime = videoRef.current.duration * newProgress
      updateCurrentChapter(newProgress)
    }
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    if (videoRef.current && isPlaying) {
      videoRef.current.play()
    }
  }

  // Play/pause for mobile
  const togglePlayPause = () => {
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  // Skip to chapter
  const skipToChapter = (chapterId: number) => {
    if (!videoRef.current) return

    const chapter = chapters.find((c) => c.id === chapterId)
    if (chapter && videoRef.current.duration) {
      const newTime = videoRef.current.duration * chapter.time
      videoRef.current.currentTime = newTime
      setProgress(chapter.time * 100)
      setTouchProgress(chapter.time)
      setCurrentChapter(chapterId)
    }
  }

  // Skip forward/backward 10 seconds
  const skipTime = (seconds: number) => {
    if (!videoRef.current) return

    const newTime = videoRef.current.currentTime + seconds
    const clampedTime = Math.max(0, Math.min(newTime, videoRef.current.duration))
    videoRef.current.currentTime = clampedTime

    if (videoRef.current.duration) {
      const newProgress = (clampedTime / videoRef.current.duration) * 100
      setProgress(newProgress)
      setTouchProgress(newProgress / 100)
      updateCurrentChapter(clampedTime / videoRef.current.duration)
    }
  }

  // Ensure the section is tall enough for a good scroll experience on desktop
  useEffect(() => {
    if (sectionRef.current && !isMobile) {
      const viewportHeight = window.innerHeight
      sectionRef.current.style.height = `${viewportHeight * 3}px` // 3x viewport height for smooth scrolling
    }
  }, [isMobile])

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative bg-black overflow-hidden",
        isMobile ? "h-screen" : "", // Fixed height on mobile
        className,
      )}
      aria-label="Video timeline of Fast & Furious franchise"
    >
      {/* Fixed video container */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Video background with scaling effect */}
        <motion.div
          className="relative w-full h-full"
          style={{
            opacity: isMobile ? 1 : opacity,
            scale: isMobile ? 1 : scale,
          }}
        >
          {/* Video element */}
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            src="/placeholder.mp4" // This would be your actual video file
            muted={!isMobile} // Only muted on desktop (scroll version)
            playsInline
            preload="auto"
            poster="/placeholder.svg?height=1080&width=1920" // Placeholder image while loading
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/50" />

          {/* Loading indicator */}
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-[#ff6b00] border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-white text-lg">Loading video...</p>
              </div>
            </div>
          )}

          {/* Desktop title overlay */}
          {!isMobile && (
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4"
              style={{ opacity: titleOpacity }}
            >
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 text-center font-['Anton',_sans-serif] tracking-tight">
                A DECADE OF <span className="text-[#ff6b00]">SPEED</span>
              </h2>
              <p className="text-xl text-white/80 max-w-2xl text-center">
                Scroll to experience the evolution of the Fast Saga through the years
              </p>

              {/* Scroll instruction */}
              <motion.div
                className="absolute bottom-20 flex flex-col items-center"
                style={{ opacity: instructionOpacity }}
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
              >
                <p className="text-white/70 mb-2 text-sm">Scroll to control</p>
                <ChevronDown className="h-6 w-6 text-[#ff6b00]" />
              </motion.div>
            </motion.div>
          )}

          {/* Mobile title overlay (shown when not playing) */}
          {isMobile && !isPlaying && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4 bg-black/60">
              <h2 className="text-3xl font-bold text-white mb-4 text-center font-['Anton',_sans-serif] tracking-tight">
                A DECADE OF <span className="text-[#ff6b00]">SPEED</span>
              </h2>
              <p className="text-lg text-white/80 max-w-2xl text-center mb-8">
                Experience the evolution of the Fast Saga through the years
              </p>

              <Button
                onClick={togglePlayPause}
                className="bg-[#ff6b00] hover:bg-[#ff8c00] text-black font-bold rounded-full px-8 py-6"
              >
                <Play className="mr-2 h-5 w-5" /> PLAY
              </Button>
            </div>
          )}

          {/* Mobile video controls */}
          {isMobile && isLoaded && (
            <div
              className={cn(
                "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pt-16 pb-6 px-4 transition-opacity duration-300 video-controls z-20",
                showControls ? "opacity-100" : "opacity-0",
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Chapter title */}
              <div className="mb-4">
                <h3 className="text-[#ff6b00] font-bold text-lg">{chapters[currentChapter].title}</h3>
                <p className="text-white/90 text-sm">{chapters[currentChapter].year}</p>
              </div>

              {/* Progress bar/scrubber */}
              <div
                ref={scrubberRef}
                className="relative h-8 mb-4 touch-none"
                onTouchStart={(e) => {
                  e.stopPropagation()
                  dragControls.start(e, { snapToCursor: true })
                }}
              >
                {/* Background track */}
                <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-white/20 rounded-full">
                  {/* Filled track */}
                  <div className="h-full bg-[#ff6b00] rounded-full" style={{ width: `${progress}%` }} />

                  {/* Chapter markers */}
                  {chapters.map((chapter) => (
                    <div
                      key={chapter.id}
                      className={cn(
                        "absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full transform -translate-x-1/2",
                        currentChapter >= chapter.id ? "bg-[#ff6b00]" : "bg-white/50",
                      )}
                      style={{ left: `${chapter.time * 100}%` }}
                    />
                  ))}
                </div>

                {/* Draggable thumb */}
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-[#ff6b00] rounded-full shadow-lg transform -translate-x-1/2 touch-none"
                  style={{ left: `${progress}%` }}
                  drag="x"
                  dragControls={dragControls}
                  dragConstraints={scrubberRef}
                  dragElastic={0}
                  dragMomentum={false}
                  onDragStart={handleDragStart}
                  onDrag={handleDrag}
                  onDragEnd={handleDragEnd}
                />
              </div>

              {/* Control buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:text-[#ff6b00] hover:bg-transparent"
                    onClick={() => skipToChapter(Math.max(0, currentChapter - 1))}
                  >
                    <SkipBack className="h-6 w-6" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:text-[#ff6b00] hover:bg-transparent"
                    onClick={() => skipTime(-10)}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 rounded-full bg-[#ff6b00]/20 text-white hover:bg-[#ff6b00]/30 hover:text-white"
                    onClick={togglePlayPause}
                  >
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:text-[#ff6b00] hover:bg-transparent"
                    onClick={() => skipTime(10)}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:text-[#ff6b00] hover:bg-transparent"
                    onClick={() => skipToChapter(Math.min(chapters.length - 1, currentChapter + 1))}
                  >
                    <SkipForward className="h-6 w-6" />
                  </Button>
                </div>

                {/* Time indicator */}
                <div className="text-white/80 text-sm">{chapters[currentChapter].year}</div>
              </div>
            </div>
          )}

          {/* Desktop scene descriptions that appear at specific scroll points */}
          {!isMobile && (
            <div className="absolute inset-0 pointer-events-none">
              {/* Scene 1 */}
              <motion.div
                className="absolute top-1/4 left-8 max-w-xs bg-black/70 backdrop-blur-sm p-3 rounded border-l-2 border-[#ff6b00]"
                style={{ opacity: [0, 1, 0] }}
              >
                <h3 className="text-[#ff6b00] font-bold">The Beginning</h3>
                <p className="text-white/90 text-sm">Street racing in Los Angeles where it all started</p>
              </motion.div>

              {/* Scene 2 */}
              <motion.div
                className="absolute top-1/3 right-8 max-w-xs bg-black/70 backdrop-blur-sm p-3 rounded border-l-2 border-[#ff6b00]"
                style={{ opacity: [0, 1, 0] }}
              >
                <h3 className="text-[#ff6b00] font-bold">Tokyo Drift</h3>
                <p className="text-white/90 text-sm">The art of drifting changes everything</p>
              </motion.div>

              {/* Scene 3 */}
              <motion.div
                className="absolute top-1/2 left-8 max-w-xs bg-black/70 backdrop-blur-sm p-3 rounded border-l-2 border-[#ff6b00]"
                style={{ opacity: [0, 1, 0] }}
              >
                <h3 className="text-[#ff6b00] font-bold">The Crew Assembles</h3>
                <p className="text-white/90 text-sm">From street racers to a family of elite drivers</p>
              </motion.div>

              {/* Scene 4 */}
              <motion.div
                className="absolute bottom-1/3 right-8 max-w-xs bg-black/70 backdrop-blur-sm p-3 rounded border-l-2 border-[#ff6b00]"
                style={{ opacity: [0, 1, 0] }}
              >
                <h3 className="text-[#ff6b00] font-bold">Going Global</h3>
                <p className="text-white/90 text-sm">
                  The stakes get higher as the family takes on international missions
                </p>
              </motion.div>

              {/* Scene 5 */}
              <motion.div
                className="absolute bottom-1/4 left-8 max-w-xs bg-black/70 backdrop-blur-sm p-3 rounded border-l-2 border-[#ff6b00]"
                style={{ opacity: [0, 1, 0] }}
              >
                <h3 className="text-[#ff6b00] font-bold">Legacy</h3>
                <p className="text-white/90 text-sm">The saga continues with the next generation</p>
              </motion.div>
            </div>
          )}

          {/* Mobile chapter selection (when not playing) */}
          {isMobile && !isPlaying && isLoaded && (
            <div className="absolute bottom-8 left-0 right-0 px-4 z-20">
              <div className="flex overflow-x-auto pb-4 gap-2 snap-x">
                {chapters.map((chapter) => (
                  <button
                    key={chapter.id}
                    onClick={() => {
                      skipToChapter(chapter.id)
                      togglePlayPause()
                    }}
                    className={cn(
                      "flex-shrink-0 snap-start bg-black/60 backdrop-blur-sm p-3 rounded border-l-2 min-w-[150px]",
                      currentChapter === chapter.id ? "border-[#ff6b00]" : "border-white/30",
                    )}
                  >
                    <h3 className={cn("font-bold", currentChapter === chapter.id ? "text-[#ff6b00]" : "text-white")}>
                      {chapter.title}
                    </h3>
                    <p className="text-white/70 text-sm">{chapter.year}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Cinematic letterbox bars for extra effect (desktop only) */}
      {!isMobile && (
        <>
          <div className="fixed top-0 left-0 right-0 h-[5vh] bg-black z-20 pointer-events-none" />
          <div className="fixed bottom-0 left-0 right-0 h-[5vh] bg-black z-20 pointer-events-none" />
        </>
      )}
    </section>
  )
}
