"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Volume2,
  VolumeX,
  Paintbrush,
  RotateCcw,
  Gauge,
  ArrowLeftRight,
  Play,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Car data with placeholder images
const cars = [
  {
    id: "dodge-charger",
    name: "1970 Dodge Charger R/T",
    driver: "Dominic Toretto",
    description: "Dom's iconic muscle car. Modified with a supercharger and reinforced chassis.",
    specs: {
      engine: "426 HEMI V8",
      horsepower: "900+ HP",
      topSpeed: "140+ MPH",
      acceleration: "0-60 in 3.4s",
    },
    features: [
      {
        id: "engine",
        name: "Supercharged Engine",
        position: { x: 30, y: 40 },
        description: "Custom-built 900+ HP supercharged HEMI engine with reinforced internals",
      },
      {
        id: "wheels",
        name: "Custom Wheels",
        position: { x: 70, y: 70 },
        description: "Specialized racing wheels with high-performance tires for maximum grip",
      },
      {
        id: "nitrous",
        name: "NOS System",
        position: { x: 60, y: 30 },
        description: "Multi-stage nitrous oxide system for extreme acceleration bursts",
      },
    ],
    colors: [
      { name: "Black", value: "#111111" },
      { name: "Matte Gray", value: "#444444" },
      { name: "Glossy Red", value: "#990000" },
    ],
    images: {
      main: "/placeholder.svg?height=600&width=1000",
      angle1: "/placeholder.svg?height=500&width=800",
      angle2: "/placeholder.svg?height=500&width=800",
      angle3: "/placeholder.svg?height=500&width=800",
    },
    color: "#ff6b00",
    engineSound: "/engine-sound.mp3", // This would be a real audio file in production
    performanceRating: {
      speed: 85,
      acceleration: 90,
      handling: 70,
      durability: 95,
    },
  },
  {
    id: "skyline-gtr",
    name: "Nissan Skyline GT-R (R34)",
    driver: "Brian O'Conner",
    description: "Brian's legendary JDM icon. Tuned for maximum performance with custom blue graphics.",
    specs: {
      engine: "Twin-Turbo RB26DETT",
      horsepower: "750+ HP",
      topSpeed: "180+ MPH",
      acceleration: "0-60 in 3.1s",
    },
    features: [
      {
        id: "turbo",
        name: "Twin Turbo System",
        position: { x: 25, y: 45 },
        description: "High-performance twin turbochargers with custom intercooler setup",
      },
      {
        id: "suspension",
        name: "Racing Suspension",
        position: { x: 65, y: 75 },
        description: "Adjustable coilover suspension tuned for both street and track performance",
      },
      {
        id: "computer",
        name: "ECU Upgrade",
        position: { x: 55, y: 35 },
        description: "Custom engine management system with multiple driving modes",
      },
    ],
    colors: [
      { name: "Bayside Blue", value: "#0066cc" },
      { name: "Silver", value: "#cccccc" },
      { name: "Midnight Purple", value: "#330066" },
    ],
    images: {
      main: "/placeholder.svg?height=600&width=1000",
      angle1: "/placeholder.svg?height=500&width=800",
      angle2: "/placeholder.svg?height=500&width=800",
      angle3: "/placeholder.svg?height=500&width=800",
    },
    color: "#0088ff",
    engineSound: "/engine-sound-skyline.mp3", // This would be a real audio file in production
    performanceRating: {
      speed: 90,
      acceleration: 95,
      handling: 85,
      durability: 75,
    },
  },
  {
    id: "supra",
    name: "Toyota Supra MK IV",
    driver: "Brian O'Conner",
    description: "The iconic orange Supra. Heavily modified with a 2JZ engine pushing extreme power.",
    specs: {
      engine: "2JZ-GTE Inline-6",
      horsepower: "800+ HP",
      topSpeed: "175+ MPH",
      acceleration: "0-60 in 3.8s",
    },
    features: [
      {
        id: "engine",
        name: "2JZ Engine",
        position: { x: 28, y: 42 },
        description: "Legendary 2JZ engine with upgraded internals and custom tuning",
      },
      {
        id: "bodykit",
        name: "Custom Body Kit",
        position: { x: 72, y: 68 },
        description: "Aerodynamic body kit that improves downforce and cooling",
      },
      {
        id: "nitrous",
        name: "NOS System",
        position: { x: 58, y: 32 },
        description: "Direct-port nitrous system for maximum power delivery",
      },
    ],
    colors: [
      { name: "Orange", value: "#ff4500" },
      { name: "White", value: "#ffffff" },
      { name: "Yellow", value: "#ffcc00" },
    ],
    images: {
      main: "/placeholder.svg?height=600&width=1000",
      angle1: "/placeholder.svg?height=500&width=800",
      angle2: "/placeholder.svg?height=500&width=800",
      angle3: "/placeholder.svg?height=500&width=800",
    },
    color: "#ff4500",
    engineSound: "/engine-sound-supra.mp3", // This would be a real audio file in production
    performanceRating: {
      speed: 88,
      acceleration: 92,
      handling: 80,
      durability: 78,
    },
  },
]

export default function CarShowcase() {
  const [activeCar, setActiveCar] = useState(0)
  const [activeAngle, setActiveAngle] = useState("main")
  const [activeFeature, setActiveFeature] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedColor, setSelectedColor] = useState(0)
  const [rotationAngle, setRotationAngle] = useState(0)
  const [showComparison, setShowComparison] = useState(false)
  const [compareWithCar, setCompareWithCar] = useState(1)
  const [isRevving, setIsRevving] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const constraintsRef = useRef(null)

  const x = useMotionValue(0)
  const rotateY = useTransform(x, [-200, 200], [10, -10])

  const car = cars[activeCar]
  const comparisonCar = cars[compareWithCar]

  useEffect(() => {
    // Reset states when active car changes
    setActiveFeature(null)
    setActiveAngle("main")
    setIsPlaying(false)
    setSelectedColor(0)
    setRotationAngle(0)
    setIsRevving(false)

    // Stop audio if it's playing
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }, [activeCar])

  const handlePrev = () => {
    setActiveCar((prev) => (prev === 0 ? cars.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setActiveCar((prev) => (prev === cars.length - 1 ? 0 : prev + 1))
  }

  const handleFeatureClick = (featureId: string) => {
    setActiveFeature(activeFeature === featureId ? null : featureId)
  }

  const toggleSound = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleRevEngine = () => {
    if (!audioRef.current) return

    setIsRevving(true)

    // Play audio with higher volume for rev effect
    audioRef.current.volume = 1.0
    audioRef.current.currentTime = 0
    audioRef.current.play()

    // Simulate engine rev with volume changes
    setTimeout(() => {
      if (audioRef.current) audioRef.current.volume = 0.7
    }, 1000)

    setTimeout(() => {
      if (audioRef.current) audioRef.current.volume = 0.5
      setIsRevving(false)
    }, 2000)
  }

  const handleCompareToggle = () => {
    setShowComparison(!showComparison)
    if (!showComparison) {
      // Set comparison car to next car in the list
      setCompareWithCar((activeCar + 1) % cars.length)
    }
  }

  const handleCompareCarChange = () => {
    // Cycle through cars excluding the active car
    let nextCar = (compareWithCar + 1) % cars.length
    if (nextCar === activeCar) nextCar = (nextCar + 1) % cars.length
    setCompareWithCar(nextCar)
  }

  // Get the feature being hovered for tooltip
  const getFeatureById = (id: string) => {
    return car.features.find((feature) => feature.id === id)
  }

  // Apply color overlay to car image
  const getColorizedImageStyle = () => {
    const colorValue = car.colors[selectedColor].value
    return {
      filter: `drop-shadow(0 0 10px ${colorValue}40)`,
      // We use a subtle color overlay to simulate the car color
      // In a real implementation, you would have different images for each color
    }
  }

  return (
    <section className="py-20 bg-gradient-to-b from-black to-[#0a0a0a] overflow-hidden">
      <div className="container px-4 mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-3xl md:text-5xl font-bold mb-12 text-center text-[#ff6b00] font-['Orbitron',_sans-serif]"
        >
          LEGENDARY VEHICLES
        </motion.h2>

        <div className="relative">
          {/* Car Showcase */}
          <div className="relative mb-8 overflow-hidden rounded-lg bg-[#0a0a0a] border border-gray-800">
            <div ref={constraintsRef} className="aspect-[16/9] md:aspect-[21/9] relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${car.id}-${activeAngle}-${selectedColor}`}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    rotateY: isDragging ? rotateY : rotationAngle,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.1}
                  onDragStart={() => setIsDragging(true)}
                  onDragEnd={() => setIsDragging(false)}
                  onDrag={(_, info) => {
                    x.set(info.offset.x)
                  }}
                  className="w-full h-full relative cursor-grab active:cursor-grabbing"
                  style={{
                    perspective: "1200px",
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Main car image */}
                  <div className="relative w-full h-full" style={getColorizedImageStyle()}>
                    <Image
                      src={car.images[activeAngle as keyof typeof car.images] || car.images.main}
                      alt={car.name}
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>

                  {/* Comparison car (if enabled) */}
                  {showComparison && (
                    <div className="absolute top-0 left-0 w-1/2 h-full overflow-hidden border-r-2 border-[#ff6b00]">
                      <div className="relative w-[200%] h-full" style={{ left: "-50%" }}>
                        <Image
                          src={comparisonCar.images.main || "/placeholder.svg"}
                          alt={comparisonCar.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-md px-3 py-2 text-sm font-medium text-white border border-[#ff6b00]/50">
                        {comparisonCar.name}
                      </div>
                    </div>
                  )}

                  {/* Rev animation effect */}
                  {isRevving && (
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.3, 0] }}
                      transition={{ duration: 2, times: [0, 0.2, 1] }}
                    >
                      <div className="absolute inset-0 bg-[#ff6b00]/10"></div>

                      {/* Shake effect */}
                      <motion.div
                        className="absolute inset-0"
                        animate={{ x: [-2, 2, -2, 1, -1, 0] }}
                        transition={{ duration: 0.5, repeat: 3, repeatType: "reverse" }}
                      />

                      {/* Exhaust flames */}
                      <div className="absolute bottom-[40%] left-[10%] w-8 h-8">
                        <motion.div
                          className="w-full h-full bg-gradient-to-t from-[#ff6b00] to-transparent rounded-full blur-md"
                          animate={{ scale: [1, 1.5, 0.8], opacity: [0.7, 0.9, 0] }}
                          transition={{ duration: 0.5, repeat: 4, repeatType: "reverse" }}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Interactive hotspots */}
                  {activeAngle === "main" &&
                    car.features.map((feature) => (
                      <TooltipProvider key={feature.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.5, duration: 0.3 }}
                              className="absolute"
                              style={{
                                left: `${feature.position.x}%`,
                                top: `${feature.position.y}%`,
                              }}
                            >
                              <Button
                                variant="outline"
                                size="icon"
                                className={cn(
                                  "h-8 w-8 rounded-full border-2 bg-black/50 backdrop-blur-sm transition-all duration-300",
                                  activeFeature === feature.id
                                    ? `border-[${car.color}] text-[${car.color}]`
                                    : "border-white/50 text-white/70 hover:border-white hover:text-white",
                                )}
                                onClick={() => handleFeatureClick(feature.id)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>

                              {activeFeature === feature.id && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm border border-[#ff6b00]/50 rounded-md px-3 py-2 w-max max-w-[200px] z-10"
                                >
                                  <p className="text-sm font-medium text-white">{feature.name}</p>
                                  <p className="text-xs text-gray-300 mt-1">{feature.description}</p>
                                </motion.div>
                              )}
                            </motion.div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="bg-black/90 border-[#ff6b00]/50 text-white">
                            <p>{feature.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}

                  {/* Drag instruction */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-white/70 flex items-center gap-2 pointer-events-none">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M8 10L12 14L16 10"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Drag to rotate
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Interactive controls */}
            <div className="border-t border-gray-800 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left controls */}
                <div className="space-y-4">
                  {/* Angle selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">View:</span>
                    <div className="flex gap-2">
                      {Object.entries(car.images).map(([angle, _]) => (
                        <button
                          key={angle}
                          onClick={() => setActiveAngle(angle)}
                          className={cn(
                            "w-16 h-12 rounded overflow-hidden border-2 transition-all",
                            activeAngle === angle
                              ? `border-[${car.color}]`
                              : "border-transparent hover:border-white/30",
                          )}
                        >
                          <div className="w-full h-full relative">
                            <Image
                              src={car.images[angle as keyof typeof car.images] || "/placeholder.svg"}
                              alt={`${car.name} - ${angle} view`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 360° rotation control */}
                  <div className="flex items-center gap-2">
                    <RotateCcw className="h-4 w-4 text-gray-400" />
                    <div className="flex-1">
                      <Slider
                        value={[rotationAngle]}
                        min={-30}
                        max={30}
                        step={1}
                        onValueChange={(value) => setRotationAngle(value[0])}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Right controls */}
                <div className="flex flex-wrap gap-2 items-center justify-end">
                  {/* Color selector */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="relative">
                          <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full border-gray-700 bg-black/50 hover:bg-black/70 hover:border-gray-600"
                          >
                            <Paintbrush className="h-4 w-4 text-gray-300" />
                          </Button>
                          <div className="absolute top-full mt-2 right-0 bg-black/80 backdrop-blur-sm border border-gray-800 rounded-md p-2 flex gap-1">
                            {car.colors.map((color, index) => (
                              <button
                                key={color.name}
                                onClick={() => setSelectedColor(index)}
                                className={cn(
                                  "w-6 h-6 rounded-full transition-all",
                                  selectedColor === index ? "ring-2 ring-white ring-offset-2 ring-offset-black" : "",
                                )}
                                style={{ backgroundColor: color.value }}
                                title={color.name}
                              />
                            ))}
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-black/90 border-[#ff6b00]/50 text-white">
                        <p>Change Color</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* Sound toggle */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full border-gray-700 bg-black/50 hover:bg-black/70 hover:border-gray-600"
                          onClick={toggleSound}
                        >
                          {isPlaying ? (
                            <VolumeX className="h-4 w-4 text-gray-300" />
                          ) : (
                            <Volume2 className="h-4 w-4 text-gray-300" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-black/90 border-[#ff6b00]/50 text-white">
                        <p>{isPlaying ? "Mute Engine" : "Play Engine Sound"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* Rev engine button */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className={cn(
                            "rounded-full border-[#ff6b00] bg-black/50 text-[#ff6b00] hover:bg-[#ff6b00]/20",
                            isRevving && "animate-pulse",
                          )}
                          onClick={handleRevEngine}
                          disabled={isRevving}
                        >
                          <Gauge className="h-4 w-4 mr-2" />
                          Rev Engine
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-black/90 border-[#ff6b00]/50 text-white">
                        <p>Rev the Engine</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* Compare button */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className={cn(
                            "rounded-full",
                            showComparison
                              ? "border-[#ff6b00] bg-[#ff6b00]/20 text-[#ff6b00]"
                              : "border-gray-700 bg-black/50 text-gray-300 hover:bg-black/70 hover:border-gray-600",
                          )}
                          onClick={handleCompareToggle}
                        >
                          <ArrowLeftRight className="h-4 w-4 mr-2" />
                          Compare
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-black/90 border-[#ff6b00]/50 text-white">
                        <p>Compare Vehicles</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* Change comparison car */}
                  {showComparison && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full border-gray-700 bg-black/50 text-gray-300 hover:bg-black/70 hover:border-gray-600"
                            onClick={handleCompareCarChange}
                          >
                            Switch Car
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-black/90 border-[#ff6b00]/50 text-white">
                          <p>Change Comparison Vehicle</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Car Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white font-['Anton',_sans-serif]">{car.name}</h3>
                    <p className="text-[#ff6b00]">Driver: {car.driver}</p>
                  </div>
                  <Badge className="bg-[#ff6b00] hover:bg-[#ff6b00] text-black">Featured</Badge>
                </div>
                <p className="text-gray-300 mb-6">{car.description}</p>

                <Tabs defaultValue="specs">
                  <TabsList className="bg-[#1a1a1a] border-b border-gray-800">
                    <TabsTrigger value="specs">Specifications</TabsTrigger>
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                  </TabsList>
                  <TabsContent value="specs" className="pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(car.specs).map(([key, value]) => (
                        <div key={key} className="bg-[#1a1a1a] p-3 rounded">
                          <p className="text-sm text-gray-400 capitalize">{key}</p>
                          <p className="text-white font-medium">{value}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="performance" className="pt-4">
                    <div className="space-y-4">
                      {Object.entries(car.performanceRating).map(([key, value]) => (
                        <div key={key} className="space-y-1">
                          <div className="flex justify-between">
                            <p className="text-sm text-gray-400 capitalize">{key}</p>
                            <p className="text-sm text-white">{value}/100</p>
                          </div>
                          <div className="w-full h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                            <div className="h-full bg-[#ff6b00]" style={{ width: `${value}%` }} />
                          </div>
                        </div>
                      ))}

                      {showComparison && (
                        <div className="mt-6 pt-4 border-t border-gray-800">
                          <h4 className="text-sm font-medium text-white mb-4">Comparison with {comparisonCar.name}</h4>
                          {Object.entries(car.performanceRating).map(([key, value]) => {
                            const comparisonValue =
                              comparisonCar.performanceRating[key as keyof typeof comparisonCar.performanceRating]
                            const difference = value - comparisonValue
                            return (
                              <div key={`compare-${key}`} className="flex items-center justify-between mb-2">
                                <p className="text-sm text-gray-400 capitalize">{key}</p>
                                <div className="flex items-center gap-2">
                                  <span
                                    className={cn(
                                      "text-sm font-medium",
                                      difference > 0
                                        ? "text-green-500"
                                        : difference < 0
                                          ? "text-red-500"
                                          : "text-gray-400",
                                    )}
                                  >
                                    {difference > 0 ? "+" : ""}
                                    {difference}
                                  </span>
                                  <div className="w-24 h-2 bg-[#1a1a1a] rounded-full overflow-hidden relative">
                                    <div className="absolute inset-y-0 left-1/2 w-[1px] bg-white/30" />
                                    <div
                                      className={cn(
                                        "h-full absolute top-0",
                                        difference >= 0 ? "bg-green-500 left-1/2" : "bg-red-500 right-1/2",
                                      )}
                                      style={{ width: `${Math.abs(difference)}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="history" className="pt-4">
                    <p className="text-gray-300">
                      This legendary vehicle has been featured in multiple Fast & Furious films, becoming an icon of the
                      franchise. It has survived impossible stunts, high-speed chases, and has become synonymous with
                      its driver.
                    </p>
                  </TabsContent>
                </Tabs>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-6 flex flex-col"
            >
              <h4 className="text-lg font-bold mb-4 text-white">Featured Scenes</h4>
              <div className="space-y-4 flex-grow">
                <div className="relative aspect-video rounded-md overflow-hidden group cursor-pointer">
                  <Image
                    src="/placeholder.svg?height=200&width=350"
                    alt="Car scene"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                    <p className="p-3 text-sm text-white">Race against time</p>
                  </div>
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[#ff6b00]/80 flex items-center justify-center">
                      <Play className="h-6 w-6 text-white fill-white" />
                    </div>
                  </div>
                </div>
                <div className="relative aspect-video rounded-md overflow-hidden group cursor-pointer">
                  <Image
                    src="/placeholder.svg?height=200&width=350"
                    alt="Car scene"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                    <p className="p-3 text-sm text-white">Epic stunt jump</p>
                  </div>
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[#ff6b00]/80 flex items-center justify-center">
                      <Play className="h-6 w-6 text-white fill-white" />
                    </div>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="mt-4 border-[#ff6b00] text-[#ff6b00] hover:bg-[#ff6b00]/10">
                View All Scenes
              </Button>
            </motion.div>
          </div>

          {/* Car Selector */}
          <div className="flex justify-center items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrev}
              className="h-10 w-10 rounded-full border-[#ff6b00] text-[#ff6b00] hover:bg-[#ff6b00]/10"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <div className="flex gap-2">
              {cars.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveCar(index)}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all",
                    index === activeCar ? "bg-[#ff6b00]" : "bg-gray-600 hover:bg-gray-400",
                  )}
                  aria-label={`View car ${index + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              className="h-10 w-10 rounded-full border-[#ff6b00] text-[#ff6b00] hover:bg-[#ff6b00]/10"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Hidden audio element for engine sounds */}
      <audio ref={audioRef} src={car.engineSound} loop={!isRevving} preload="none" className="hidden" />
    </section>
  )
}
