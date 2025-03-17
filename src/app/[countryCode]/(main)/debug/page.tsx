import { Metadata } from "next"
import { getRegion, listRegions } from "@lib/data/regions"
import { listProducts } from "@lib/data/products"

export const metadata: Metadata = {
  title: "Debug Page",
  description: "Debug page to troubleshoot issues",
}

export default async function Debug(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params
  
  let regionInfo = "No region info";
  let regionsInfo = "No regions info";
  let productsInfo = "No products info";
  
  try {
    const region = await getRegion(countryCode);
    regionInfo = region ? JSON.stringify({
      id: region.id,
      name: region.name,
      currency_code: region.currency_code,
      countries: region.countries?.map(c => c.iso_2)
    }, null, 2) : "Region not found";
  } catch (error) {
    regionInfo = `Error getting region: ${error instanceof Error ? error.message : String(error)}`;
  }
  
  try {
    const regions = await listRegions();
    regionsInfo = regions ? JSON.stringify(regions.map(r => ({
      id: r.id,
      name: r.name,
      currency_code: r.currency_code,
      countries: r.countries?.map(c => c.iso_2)
    })), null, 2) : "No regions found";
  } catch (error) {
    regionsInfo = `Error listing regions: ${error instanceof Error ? error.message : String(error)}`;
  }
  
  try {
    if (countryCode) {
      const products = await listProducts({ countryCode });
      productsInfo = JSON.stringify({
        count: products.response.count,
        products: products.response.products.map(p => ({
          id: p.id,
          title: p.title,
          handle: p.handle
        }))
      }, null, 2);
    }
  } catch (error) {
    productsInfo = `Error listing products: ${error instanceof Error ? error.message : String(error)}`;
  }

  return (
    <div className="py-10 px-8">
      <h1 className="text-2xl font-bold mb-8">Debug Information</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Current Region</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">{regionInfo}</pre>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">All Regions</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">{regionsInfo}</pre>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Products</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">{productsInfo}</pre>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">{`
NEXT_PUBLIC_FORCE_SINGLE_REGION: ${process.env.NEXT_PUBLIC_FORCE_SINGLE_REGION}
NEXT_PUBLIC_DEFAULT_REGION: ${process.env.NEXT_PUBLIC_DEFAULT_REGION}
MEDUSA_BACKEND_URL is set: ${Boolean(process.env.MEDUSA_BACKEND_URL)}
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY is set: ${Boolean(process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY)}
        `}</pre>
      </div>
    </div>
  )
} 