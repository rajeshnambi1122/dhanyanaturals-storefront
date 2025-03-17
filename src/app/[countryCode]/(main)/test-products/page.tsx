import { Metadata } from "next"
import { getRegion } from "@lib/data/regions"
import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Test Products Page",
  description: "Testing product display",
}

// Simple component to display a product
const ProductCard = ({ product }: { product: HttpTypes.StoreProduct }) => {
  return (
    <div className="bg-white rounded shadow p-4">
      <div className="relative h-48 mb-4">
        {product.thumbnail && (
          <Image 
            src={product.thumbnail}
            alt={product.title || "Product image"}
            fill
            className="object-contain"
          />
        )}
      </div>
      <h3 className="font-medium text-lg mb-2">{product.title}</h3>
      <p className="text-sm text-gray-600 mb-4">{product.description?.substring(0, 100)}...</p>
      <Link 
        href={`/products/${product.handle}`}
        className="bg-[#2c5530] text-white px-4 py-2 rounded inline-block"
      >
        View Product
      </Link>
    </div>
  );
};

export default async function TestProducts(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params
  
  console.log("Test Products page rendering with countryCode:", countryCode);
  
  let region;
  let products: HttpTypes.StoreProduct[] = [];
  let errorMessage = "";
  
  try {
    region = await getRegion(countryCode);
    console.log("Region fetched:", region ? 
      { id: region.id, name: region.name, currency_code: region.currency_code } : 
      "No region found");
      
    if (region) {
      const productsResult = await listProducts({ 
        regionId: region.id,
        queryParams: {
          limit: 10
        }
      });
      
      products = productsResult.response.products;
      console.log(`Fetched ${products.length} products`);
    } else {
      errorMessage = "No region available";
    }
  } catch (error) {
    console.error("Error in test products page:", error);
    errorMessage = error instanceof Error ? error.message : "Unknown error";
  }

  return (
    <div className="py-10 px-8">
      <h1 className="text-2xl font-bold mb-8">Test Products Page</h1>
      
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>Error: {errorMessage}</p>
          <p>Try clearing your cache: <Link href="/clearCache.js" className="underline">Clear Cache</Link></p>
        </div>
      )}
      
      {products.length === 0 && !errorMessage && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
          <p>No products found. This could be due to:</p>
          <ul className="list-disc pl-5 mt-2">
            <li>No products added in Medusa admin</li>
            <li>Connection issues with backend</li>
            <li>Region configuration problems</li>
          </ul>
          <p className="mt-2">Try clearing your cache: <Link href="/clearCache.js" className="underline">Clear Cache</Link></p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      <div className="mt-8">
        <Link href="/in/debug" className="text-blue-500 underline">View Debug Info</Link>
      </div>
    </div>
  )
} 