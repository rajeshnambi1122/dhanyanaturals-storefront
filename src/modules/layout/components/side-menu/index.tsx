"use client"

import { Fragment, useEffect, useState } from "react"
import { Popover, PopoverPanel, Transition } from "@headlessui/react"
import { ArrowRightMini, XMark } from "@medusajs/icons"
import { Text, clx, useToggleState } from "@medusajs/ui"
import { usePathname } from "next/navigation"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"
import { HttpTypes } from "@medusajs/types"

// Custom hamburger menu icon
const MenuIcon = ({ size = "20", color = "currentColor", ...attributes }) => {
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
        d="M3 12H21"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 6H21"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 18H21"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const SideMenuItems = {
  Home: "/",
  Store: "/store",
  Collections: "/collections",
  Account: "/account",
  About: "/about"
}

const SideMenu = ({ 
  regions, 
  isScrolled = false 
}: { 
  regions: HttpTypes.StoreRegion[] | null,
  isScrolled?: boolean
}) => {
  const toggleState = useToggleState()
  const pathname = usePathname()
  
  // If the component is mounted client-side and we don't receive isScrolled prop,
  // we'll track scroll position ourselves
  const [localScrolled, setLocalScrolled] = useState(false);
  
  useEffect(() => {
    // Only set up scroll listener if isScrolled prop isn't provided
    if (isScrolled === undefined) {
      const handleScroll = () => {
        if (window.scrollY > window.innerHeight * 0.9) {
          setLocalScrolled(true);
        } else {
          setLocalScrolled(false);
        }
      };
      
      window.addEventListener('scroll', handleScroll);
      handleScroll(); // Check initial position
      
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [isScrolled]);
  
  // Use either the prop value or the local state
  const scrolledState = isScrolled !== undefined ? isScrolled : localScrolled;
  
  // Dynamically set text and hover colors based on scroll position
  const textColor = scrolledState ? 'text-black' : 'text-white';
  const hoverColor = scrolledState ? 'hover:text-[#2c5530]' : 'hover:text-[#bde6c2]';

  return (
    <div className="h-full">
      <Popover className="h-full">
        {({ open, close }) => (
          <>
            <Popover.Button
              data-testid="nav-menu-button"
              className={`h-full flex flex-col items-center justify-center transition-all ease-out duration-200 focus:outline-none ${hoverColor} ${textColor}`}
              title="Menu"
            >
              <MenuIcon size="20" />
              <span className="text-xs mt-1">Menu</span>
            </Popover.Button>

            <Transition
              show={open}
              as={Fragment}
              enter="transition ease-out duration-150"
              enterFrom="opacity-0"
              enterTo="opacity-100 backdrop-blur-2xl"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 backdrop-blur-2xl"
              leaveTo="opacity-0"
            >
              <PopoverPanel className="flex flex-col absolute w-full pr-4 sm:pr-0 sm:w-80 md:w-96 lg:w-[400px] h-[calc(100vh-1rem)] z-30 inset-x-0 text-sm text-white m-2 backdrop-blur-2xl">
                <div
                  data-testid="nav-menu-popup"
                  className="flex flex-col h-full bg-[rgba(0,0,0,0.85)] rounded-lg md:rounded-xl justify-between p-4 md:p-6"
                >
                  <div className="flex justify-end" id="xmark">
                    <button data-testid="close-menu-button" onClick={close} className="text-white hover:text-[#bde6c2]">
                      <XMark />
                    </button>
                  </div>
                  <ul className="flex flex-col gap-4 md:gap-6 items-start justify-start">
                    {Object.entries(SideMenuItems).map(([name, href]) => {
                      return (
                        <li key={name}>
                          <LocalizedClientLink
                            href={href}
                            className="text-xl sm:text-2xl md:text-3xl leading-10 text-white hover:text-[#bde6c2]"
                            onClick={close}
                            data-testid={`${name.toLowerCase()}-link`}
                          >
                            {name}
                          </LocalizedClientLink>
                        </li>
                      )
                    })}
                  </ul>
                  <div className="flex flex-col gap-y-4 md:gap-y-6">
                    <div
                      className="flex justify-between"
                      onMouseEnter={toggleState.open}
                      onMouseLeave={toggleState.close}
                    >
                      {regions && (
                        <CountrySelect
                          toggleState={toggleState}
                          regions={regions}
                        />
                      )}
                      <ArrowRightMini
                        className={clx(
                          "transition-transform duration-150 text-white",
                          toggleState.state ? "-rotate-90" : ""
                        )}
                      />
                    </div>
                    <Text className="flex justify-between txt-compact-small text-white/80">
                      © {new Date().getFullYear()} Dhanya Naturals. All rights
                      reserved.
                    </Text>
                  </div>
                </div>
              </PopoverPanel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  )
}

export default SideMenu
