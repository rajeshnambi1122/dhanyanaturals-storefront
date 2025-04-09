import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  icons: {
    icon: [
      {
        url: "/icons/icon.png",
        type: "image/png",
        sizes: "any"
      }
    ],
    shortcut: "/icons/icon.png",
    apple: [
      {
        url: "/icons/icon.png",
        sizes: "180x180",
        type: "image/png"
      }
    ]
  }
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light" suppressHydrationWarning>
      <body suppressHydrationWarning className="bg-gray-50">
        <div className="flex flex-col min-h-screen">
          {props.children}
        </div>
      </body>
    </html>
  )
}
