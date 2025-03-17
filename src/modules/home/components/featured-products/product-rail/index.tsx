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
    
    // Fetch all products and filter them later
    const result = await listProducts({
      regionId: region.id,
      queryParams: {
        limit: 10, // Fetch more products to ensure we have enough after filtering
        fields: "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags",
      },
    });
    
    // Filter products to only include those in the collection
    const allProducts = result.response.products;
    pricedProducts = allProducts.filter(product => 
      product.collection_id === collection.id
    ).slice(0, 4); // Get at most 4 products
    
    console.log(`ProductRail: Fetched ${pricedProducts.length} products for collection "${collection.title}"`);
  } catch (error) {
    console.error(`ProductRail: Error fetching products for collection "${collection.title}":`, error);
    errorMessage = error instanceof Error ? error.message : "Unknown error";
  }

  // If no products and error occurred, show error
  if (pricedProducts.length === 0 && errorMessage) {
    return (
      <div className="py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-8">
          <div>
            <Text className="text-xl sm:text-2xl font-medium text-[#2c5530]">{collection.title}</Text>
            <div className="h-1 w-16 sm:w-20 bg-[#2c5530] rounded mt-1 sm:mt-2"></div>
          </div>
        </div>
        <div className="bg-red-50 p-3 sm:p-4 rounded text-sm sm:text-base">
          <p className="text-red-600">Error loading products: {errorMessage}</p>
        </div>
      </div>
    );
  }

  // If no products but no error, show empty message
  if (pricedProducts.length === 0) {
    return (
      <div className="py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-8">
          <div>
            <Text className="text-xl sm:text-2xl font-medium text-[#2c5530]">{collection.title}</Text>
            <div className="h-1 w-16 sm:w-20 bg-[#2c5530] rounded mt-1 sm:mt-2"></div>
          </div>
          <InteractiveLink href={`/collections/${collection.handle}`}>
            <span className="text-[#2c5530] font-medium text-sm sm:text-base mt-2 sm:mt-0 inline-block">View all</span>
          </InteractiveLink>
        </div>
        <div className="bg-gray-50 p-3 sm:p-4 rounded text-center text-sm sm:text-base">
          <p className="text-gray-600">No products available in this collection</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 sm:py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-8">
        <div>
          <Text className="text-xl sm:text-2xl font-medium text-[#2c5530]">{collection.title}</Text>
          <div className="h-1 w-16 sm:w-20 bg-[#2c5530] rounded mt-1 sm:mt-2"></div>
        </div>
        <InteractiveLink href={`/collections/${collection.handle}`}>
          <span className="text-[#2c5530] font-medium text-sm sm:text-base mt-2 sm:mt-0 inline-block">View all</span>
        </InteractiveLink>
      </div>
      <div className="overflow-x-auto -mx-4 px-4 pb-4 sm:overflow-visible sm:mx-0 sm:px-0 sm:pb-0">
        <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 w-[calc(100%+1rem)] sm:w-full sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {pricedProducts.map((product) => (
            <li key={product.id} className="group transform transition-transform duration-300 hover:-translate-y-1 min-w-[160px]">
              <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                <ProductPreview product={product} region={region} isFeatured />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
