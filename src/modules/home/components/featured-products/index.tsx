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
    return <div>No featured collections available</div>;
  }
  
  try {
    return collections.map((collection) => (
      <li key={collection.id}>
        <ProductRail collection={collection} region={region} />
      </li>
    ));
  } catch (error) {
    console.error("Error rendering collections:", error);
    return <div>Error displaying featured products</div>;
  }
}
