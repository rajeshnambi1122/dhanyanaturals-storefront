"use client"

import { Suspense, useEffect, useState } from "react"
import Image from "next/image"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import User from "@modules/common/icons/user"

// Add new icons for Shop and About
const ShopIcon = ({ size = "20", color = "currentColor", ...attributes }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...attributes}
    >
      <path
        d="M20 2H4C3 2 2 2.9 2 4V7C2 7.26522 2.10536 7.51957 2.29289 7.70711C2.48043 7.89464 2.73478 8 3 8H21C21.2652 8 21.5196 7.89464 21.7071 7.70711C21.8946 7.51957 22 7.26522 22 7V4C22 2.9 21 2 20 2Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 8L19 22H5L3 8"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 13H15"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const AboutIcon = ({ size = "20", color = "currentColor", ...attributes }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...attributes}
    >
      <path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 16V12"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 8H12.01"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// Cart icon for fallback
const CartIconFallback = () => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [regions, setRegions] = useState<StoreRegion[]>([]);
  
  // Fetch regions from the client side
  useEffect(() => {
    fetch('/api/regions')
      .then(response => response.json())
      .then(data => {
        setRegions(data);
      })
      .catch(error => {
        console.error('Error fetching regions:', error);
        setRegions([]);
      });
  }, []);

  useEffect(() => {
    // Function to handle scroll events
    const handleScroll = () => {
      // Change to scrolled state after scrolling past the hero section (100vh)
      if (window.scrollY > window.innerHeight * 0.9) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Initial check
    handleScroll();
    
    // Clean up the event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Dynamically set text color and background based on scroll position
  const navTextColor = scrolled ? 'text-gray-900' : 'text-white';
  const navHoverColor = scrolled ? 'hover:text-[#2c5530]' : 'hover:text-[#bde6c2]';
  const navBackground = scrolled ? 'bg-white shadow-sm' : 'bg-black/80 backdrop-blur-md';
  const navBorder = scrolled ? 'border-gray-100' : 'border-white/10';

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <header className={`relative h-16 md:h-20 w-full ${navBackground} border-b ${navBorder} transition-all duration-300`}>
        <nav className={`px-4 md:px-8 lg:px-12 xl:px-16 ${navTextColor} flex items-center justify-between w-full h-full text-small-regular relative transition-colors duration-300`}>
          {/* Left section - Menu */}
          <div className="flex items-center h-full w-[60px] sm:w-[80px] lg:w-[100px] z-10">
            <SideMenu regions={regions} isScrolled={scrolled} />
          </div>

          {/* Middle section - Logo (Centered) */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center h-full justify-center z-0">
            <LocalizedClientLink
              href="/"
              className="flex items-center"
              data-testid="nav-store-link"
            >
              <div className="relative w-[100px] sm:w-[120px] md:w-[150px] lg:w-[180px] h-[50px] sm:h-[60px] md:h-[70px] lg:h-[80px]">
                <Image
                  src="/dhanyanaturalslogopng.png"
                  alt="Dhanya Naturals"
                  fill
                  style={{ objectFit: "contain" }}
                  priority
                />
              </div>
            </LocalizedClientLink>
          </div>

          {/* Right section - Navigation and Cart */}
          <div className="flex items-center gap-x-4 md:gap-x-6">
            {/* Navigation links with icons - showing on all screens with adjusted spacing */}
            <div className="hidden sm:flex items-center gap-x-2 md:gap-x-4 lg:gap-x-6 h-full">
              <LocalizedClientLink
                className={`${navHoverColor} flex flex-col items-center px-1 transition-colors duration-300`}
                href="/store"
                title="Shop"
              >
                <ShopIcon size="20" />
                <span className="text-xs mt-1">Shop</span>
              </LocalizedClientLink>
           
              <LocalizedClientLink
                className={`${navHoverColor} flex flex-col items-center px-1 transition-colors duration-300`}
                href="/about"
                title="About"
              >
                <AboutIcon size="20" />
                <span className="text-xs mt-1">About</span>
              </LocalizedClientLink>
              
              <LocalizedClientLink
                className={`${navHoverColor} flex flex-col items-center px-1 transition-colors duration-300`}
                href="/account"
                data-testid="nav-account-link"
                title="Account"
              >
                <User size="20" />
                <span className="text-xs mt-1">Account</span>
              </LocalizedClientLink>
            </div>
            
            {/* Cart button */}
            <div className="ml-auto sm:ml-4">
              <CartButton isScrolled={scrolled} />
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}
