"use client"

import { useEffect, useState } from "react"
import CartDropdown from "../cart-dropdown"
import { HttpTypes } from "@medusajs/types"

export default function CartButton({ isScrolled = false }: { isScrolled?: boolean }) {
  const [cart, setCart] = useState<HttpTypes.StoreCart | null>(null)
  
  useEffect(() => {
    // Function to get cart data using promises instead of async/await
    const fetchCart = () => {
      fetch("/api/cart")
        .then(response => {
          if (response.ok) {
            return response.json()
          }
          return null
        })
        .then(data => {
          if (data) {
            setCart(data)
          }
        })
        .catch(error => {
          console.error("Error fetching cart:", error)
        })
    }
    
    // Initial fetch
    fetchCart()
    
    // Set up interval to refresh cart data periodically
    const interval = setInterval(fetchCart, 5000)
    
    // Clean up on unmount
    return () => clearInterval(interval)
  }, [])
  
  return <CartDropdown cart={cart} isScrolled={isScrolled} />
}
