import { retrieveCart } from "@lib/data/cart"
import { getCartId } from "@lib/data/cookies"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Get the cart id from cookies
    const cartId = await getCartId()
    
    // Retrieve the cart
    const cart = await retrieveCart(cartId)
    
    // Return cart data
    return NextResponse.json(cart)
  } catch (error) {
    console.error("Error fetching cart:", error)
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 })
  }
} 