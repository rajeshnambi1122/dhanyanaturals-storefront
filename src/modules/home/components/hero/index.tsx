import { Heading } from "@medusajs/ui"
import Image from "next/image"
import Link from "next/link"

const Hero = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 w-full h-full">
        <Image 
          src="/hero1.jpg" 
          alt="Natural products background"
          fill
          priority
          style={{ objectFit: "cover" }}
          className="brightness-[0.80]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20"></div>
      </div>
      
      {/* Hero content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-10 lg:px-20 max-w-screen-xl mx-auto">
        <div className="max-w-[90%] sm:max-w-[70%] md:max-w-xl text-left">
          <div className="mb-2 sm:mb-4 md:mb-6">
            <Heading
              level="h1"
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
            >
              Natural Products for a Better Life
            </Heading>
          </div>
          
          <Heading
            level="h2"
            className="text-base sm:text-xl md:text-2xl text-white/90 font-normal mb-3 sm:mb-5"
          >
            Crafted with Care, Inspired by Nature
          </Heading>
          
          <p className="text-sm sm:text-base md:text-lg text-white/80 mb-6 sm:mb-8 md:mb-10 max-w-[500px] line-clamp-3 sm:line-clamp-none">
            Discover our handcrafted soaps, organic shampoos, natural cosmetics, and pure herbal powders — 
            made with traditional recipes and modern expertise.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link 
              href="/store" 
              className="inline-block bg-[#2c5530] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-md hover:bg-[#1e3d21] transition-colors text-center sm:text-left text-sm sm:text-base font-medium tracking-wide"
            >
              Shop Now
            </Link>
            <Link 
              href="/collections" 
              className="inline-block bg-white/10 backdrop-blur-sm border border-white/30 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-md hover:bg-white/20 transition-colors text-center sm:text-left mt-2 sm:mt-0 text-sm sm:text-base font-medium tracking-wide"
            >
              Explore Collections
            </Link>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce hidden md:flex">
        <span className="text-white text-xs mb-2">Scroll Down</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5V19M12 19L19 12M12 19L5 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  )
}

export default Hero
