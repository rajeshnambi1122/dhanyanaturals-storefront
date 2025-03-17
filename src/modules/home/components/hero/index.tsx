import { Heading } from "@medusajs/ui"
import Image from "next/image"

const Hero = () => {
  return (
    <div className="relative w-full h-[90vh] overflow-hidden border-b border-ui-border-base">
      {/* Background image with overlay */}
      <div className="absolute inset-0 w-full h-full">
        <Image 
          src="/hero1.jpg" 
          alt="Natural products background"
          fill
          priority
          style={{ objectFit: "cover" }}
          className="brightness-[0.85]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
      </div>
      
      {/* Hero content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-6 lg:px-16">
        <div className="max-w-xl text-left">
          <Heading
            level="h1"
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
          >
            Natural Products for a Better Life
          </Heading>
          <Heading
            level="h2"
            className="text-xl md:text-2xl text-white/90 font-normal mb-6"
          >
            Crafted with Care, Inspired by Nature
          </Heading>
          <p className="text-lg text-white/80 mb-8 max-w-[500px]">
            Discover our handcrafted soaps, organic shampoos, natural cosmetics, and pure herbal powders — 
            made with traditional recipes and modern expertise.
          </p>
          <div className="flex gap-4 mt-6">
            <a href="/store" className="inline-block bg-[#2c5530] text-white px-8 py-3 rounded-md hover:bg-[#1e3d21] transition-colors">
              Shop Now
            </a>
            <a href="/collections" className="inline-block bg-white/10 backdrop-blur-sm border border-white/30 text-white px-8 py-3 rounded-md hover:bg-white/20 transition-colors">
              Explore Collections
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
