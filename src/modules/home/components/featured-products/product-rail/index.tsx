import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

import InteractiveLink from "@modules/common/components/interactive-link"
import ProductPreview from "@modules/products/components/product-preview"

export default async function ProductRail({
  collection,
  region,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}) {
  console.log(`ProductRail: Rendering for collection "${collection.title}" with region id ${region.id}`);
  
  let pricedProducts: HttpTypes.StoreProduct[] = [];
  let errorMessage = "";
  
  try {
    console.log(`ProductRail: Fetching products for collection "${collection.title}"...`);
    
    const result = await listProducts({
      regionId: region.id,
      queryParams: {
        limit: 4,
        collection_id: collection.id,
        fields: "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags",
      },
    });
    
    pricedProducts = result.response.products;
    
    console.log(`ProductRail: Fetched ${pricedProducts.length} products for collection "${collection.title}"`);
  } catch (error) {
    console.error(`ProductRail: Error fetching products for collection "${collection.title}":`, error);
    errorMessage = error instanceof Error ? error.message : "Unknown error";
  }

  // If no products and error occurred, show error
  if (pricedProducts.length === 0 && errorMessage) {
    return (
      <div className="py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Text className="text-2xl font-medium text-[#2c5530]">{collection.title}</Text>
            <div className="h-1 w-20 bg-[#2c5530] rounded mt-2"></div>
          </div>
        </div>
        <div className="bg-red-50 p-4 rounded">
          <p className="text-red-600">Error loading products: {errorMessage}</p>
        </div>
      </div>
    );
  }

  // If no products but no error, show empty message
  if (pricedProducts.length === 0) {
    return (
      <div className="py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Text className="text-2xl font-medium text-[#2c5530]">{collection.title}</Text>
            <div className="h-1 w-20 bg-[#2c5530] rounded mt-2"></div>
          </div>
          <InteractiveLink href={`/collections/${collection.handle}`}>
            <span className="text-[#2c5530] font-medium">View all</span>
          </InteractiveLink>
        </div>
        <div className="bg-gray-50 p-4 rounded text-center">
          <p className="text-gray-600">No products available in this collection</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Text className="text-2xl font-medium text-[#2c5530]">{collection.title}</Text>
          <div className="h-1 w-20 bg-[#2c5530] rounded mt-2"></div>
        </div>
        <InteractiveLink href={`/collections/${collection.handle}`}>
          <span className="text-[#2c5530] font-medium">View all</span>
        </InteractiveLink>
      </div>
      <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8">
        {pricedProducts.slice(0, 4).map((product) => (
          <li key={product.id} className="group transform transition-transform duration-300 hover:-translate-y-1">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
              <ProductPreview product={product} region={region} isFeatured />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
