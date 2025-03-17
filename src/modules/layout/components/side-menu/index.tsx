"use client"

import { Popover, PopoverPanel, Transition } from "@headlessui/react"
import { ArrowRightMini, XMark } from "@medusajs/icons"
import { Text, clx, useToggleState } from "@medusajs/ui"
import { Fragment } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"
import { HttpTypes } from "@medusajs/types"

// Add a hamburger menu icon
const MenuIcon = ({ size = "24", color = "currentColor", ...attributes }) => {
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
  About: "/about",
  Account: "/account",
  Cart: "/cart",
}

const SideMenu = ({ regions }: { regions: HttpTypes.StoreRegion[] | null }) => {
  const toggleState = useToggleState()

  return (
    <div className="h-full">
      <Popover className="h-full">
        {({ open, close }) => (
          <>
            <Popover.Button
              data-testid="nav-menu-button"
              className="h-full flex flex-col items-center justify-center transition-all ease-out duration-200 focus:outline-none hover:text-[#2c5530]"
              title="Menu"
            >
              <MenuIcon size="24" />
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
              <PopoverPanel className="flex flex-col absolute w-full pr-4 sm:pr-0 sm:w-1/3 2xl:w-1/4 sm:min-w-min h-[calc(100vh-1rem)] z-30 inset-x-0 text-sm text-ui-fg-on-color m-2 backdrop-blur-2xl">
                <div
                  data-testid="nav-menu-popup"
                  className="flex flex-col h-full bg-[rgba(3,7,18,0.5)] rounded-rounded justify-between p-6"
                >
                  <div className="flex justify-end" id="xmark">
                    <button data-testid="close-menu-button" onClick={close}>
                      <XMark />
                    </button>
                  </div>
                  <ul className="flex flex-col gap-6 items-start justify-start">
                    {Object.entries(SideMenuItems).map(([name, href]) => {
                      return (
                        <li key={name}>
                          <LocalizedClientLink
                            href={href}
                            className="text-3xl leading-10 hover:text-ui-fg-disabled"
                            onClick={close}
                            data-testid={`${name.toLowerCase()}-link`}
                          >
                            {name}
                          </LocalizedClientLink>
                        </li>
                      )
                    })}
                  </ul>
                  <div className="flex flex-col gap-y-6">
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
                          "transition-transform duration-150",
                          toggleState.state ? "-rotate-90" : ""
                        )}
                      />
                    </div>
                    <Text className="flex justify-between txt-compact-small">
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
