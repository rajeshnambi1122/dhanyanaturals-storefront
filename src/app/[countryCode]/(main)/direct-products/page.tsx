import { Metadata } from "next"
import { getRegion } from "@lib/data/regions"
import Image from "next/image"
import Link from "next/link"
import { sdk } from "@lib/config"
import { getAuthHeaders } from "@lib/data/cookies"
import { HttpTypes } from "@medusajs/types"

export const metadata: Metadata = {
  title: "Direct Products | Dhanya Naturals",
  description: "Direct products display page",
}

// Simple product card component
const ProductCard = ({ product }: { product: any }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {product.thumbnail && (
        <div className="relative h-48">
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="font-medium text-lg mb-2">{product.title}</h3>
        <p className="text-gray-600 text-sm mb-3">
          {product.description?.substring(0, 100)}...
        </p>
        {product.variants?.[0]?.calculated_price && (
          <p className="font-bold text-[#2c5530]">
            ₹{product.variants[0].calculated_price.calculated_amount}
          </p>
        )}
        <Link
          href={`/products/${product.handle}`}
          className="mt-3 inline-block bg-[#2c5530] text-white px-4 py-2 rounded"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}

export default async function DirectProductsPage(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params
  
  let region: HttpTypes.StoreRegion | null = null
  let products: any[] = []
  let errorMessage = ""
  
  try {
    // Get region
    const fetchedRegion = await getRegion(countryCode)
    
    if (!fetchedRegion) {
      throw new Error("Region not found")
    }
    
    // Now we know fetchedRegion is not null or undefined
    region = fetchedRegion
    
    console.log("Using region:", region.id)
    
    // Fetch products directly using SDK
    const headers = {
      ...(await getAuthHeaders()),
    }
    
    const result = await sdk.client.fetch<{ products: any[]; count: number }>(
      `/store/products`,
      {
        method: "GET",
        query: {
          region_id: region.id,
          limit: 10,
          fields: "*,variants.calculated_price",
        },
        headers,
        cache: 'no-store',
      }
    )
    
    products = result.products
    console.log(`Successfully fetched ${products.length} products directly`)
    
  } catch (error) {
    console.error("Error fetching products:", error)
    errorMessage = error instanceof Error ? error.message : "Unknown error"
  }
  
  return (
    <div className="py-10 px-6">
      <h1 className="text-3xl font-bold text-[#2c5530] mb-6">Our Products</h1>
      
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p><strong>Error:</strong> {errorMessage}</p>
          <p className="mt-2">Try clearing your cache: <Link href="/clearCache.js" className="underline">Clear Cache</Link></p>
        </div>
      )}
      
      {products.length === 0 && !errorMessage && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
          <p><strong>No products found.</strong> Please check that:</p>
          <ul className="list-disc pl-5 mt-2">
            <li>Products have been added in your Medusa admin</li>
            <li>Products are published and visible</li>
            <li>Your region is properly configured</li>
          </ul>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      <div className="mt-10">
        <Link href="/in/debug" className="text-blue-500 underline">
          View Debug Information
        </Link>
      </div>
    </div>
  )
} 