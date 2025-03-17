import { HttpTypes } from "@medusajs/types"
import ProductRail from "@modules/home/components/featured-products/product-rail"

export default async function FeaturedProducts({
  collections,
  region,
}: {
  collections: HttpTypes.StoreCollection[]
  region: HttpTypes.StoreRegion
}) {
  console.log("FeaturedProducts component received:");
  console.log("- Collections:", collections.map(c => ({ id: c.id, title: c.title })));
  console.log("- Region:", { id: region.id, name: region.name, currency_code: region.currency_code });
  
  if (!collections || collections.length === 0) {
    console.error("No collections found for featured products");
    return (
      <div className="w-full p-4 bg-gray-50 rounded-lg text-center">
        <p className="text-gray-600 text-sm sm:text-base">No featured collections available</p>
      </div>
    );
  }
  
  try {
    return collections.map((collection) => (
      <li key={collection.id} className="w-full mb-6 sm:mb-0">
        <ProductRail collection={collection} region={region} />
      </li>
    ));
  } catch (error) {
    console.error("Error rendering collections:", error);
    return (
      <div className="w-full p-4 bg-red-50 rounded-lg text-center">
        <p className="text-red-600 text-sm sm:text-base">Error displaying featured products</p>
      </div>
    );
  }
}
