import { Suspense } from "react"
import Image from "next/image"
import { listRegions } from "@lib/data/regions"
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

export default async function Nav() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-16 md:h-20 mx-auto border-b duration-200 bg-white border-ui-border-base">
        <nav className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-full text-small-regular relative">
          {/* Left section - Menu */}
          <div className="flex items-center h-full w-1/4 z-10">
            <SideMenu regions={regions} />
          </div>

          {/* Middle section - Logo (Centered absolutely) */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center h-full justify-center z-0">
            <LocalizedClientLink
              href="/"
              className="flex items-center"
              data-testid="nav-store-link"
            >
              <div className="relative w-[120px] md:w-[180px] h-[60px] md:h-[80px]">
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
          <div className="flex items-center gap-x-2 md:gap-x-6 h-full justify-end w-1/4 z-10">
            {/* Navigation links with icons - showing on all screens with adjusted spacing */}
            <div className="flex items-center gap-x-3 md:gap-x-8 h-full">
              <LocalizedClientLink
                className="hover:text-[#2c5530] flex flex-col items-center"
                href="/store"
                title="Shop"
              >
                <ShopIcon size="24" />
                <span className="text-xs mt-1">Shop</span>
              </LocalizedClientLink>
           
              <LocalizedClientLink
                className="hover:text-[#2c5530] flex flex-col items-center"
                href="/about"
                title="About"
              >
                <AboutIcon size="24" />
                <span className="text-xs mt-1">About</span>
              </LocalizedClientLink>
              
              <LocalizedClientLink
                className="hover:text-[#2c5530] flex flex-col items-center"
                href="/account"
                data-testid="nav-account-link"
                title="Account"
              >
                <User size="24" />
                <span className="text-xs mt-1">Account</span>
              </LocalizedClientLink>
            </div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-[#2c5530] flex flex-col items-center"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  <div className="relative">
                    <CartIconFallback />
                  </div>
                  <span className="text-xs mt-1">Cart (0)</span>
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
