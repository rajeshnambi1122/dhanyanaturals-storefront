import React from "react"

import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"

const Layout: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Nav />
      <div className="flex-1 w-full mt-16 md:mt-20">
        <main className="relative">
          <div className="content-container">
            {children}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default Layout
