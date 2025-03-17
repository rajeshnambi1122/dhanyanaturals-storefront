"use server"

import { sdk } from "@lib/config"
import { sortProducts } from "@lib/util/sort-products"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { getRegion, listRegions, retrieveRegion } from "./regions"

export const listProducts = async ({
  pageParam = 1,
  queryParams,
  countryCode,
  regionId,
}: {
  pageParam?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  countryCode?: string
  regionId?: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> => {
  if (!countryCode && !regionId) {
    console.error("listProducts: Country code or region ID is required");
    throw new Error("Country code or region ID is required")
  }

  console.log("listProducts called with:", { countryCode, regionId, queryParams });

  const limit = queryParams?.limit || 12
  const _pageParam = Math.max(pageParam, 1)
  const offset = (_pageParam === 1) ? 0 : (_pageParam - 1) * limit;

  let region: HttpTypes.StoreRegion | undefined | null = null;

  // Get all available regions
  try {
    console.log("Fetching regions...");
    const allRegions = await listRegions();
    console.log("Available regions:", allRegions.map((r: HttpTypes.StoreRegion) => ({
      id: r.id,
      name: r.name,
      countries: r.countries?.map(c => c.iso_2),
      currency_code: r.currency_code
    })));
    
    // In single region mode, look for India region first
    if (process.env.NEXT_PUBLIC_FORCE_SINGLE_REGION === "true" && allRegions.length > 0) {
      // Look for a region with India (in) country code or INR currency
      const indiaRegion = allRegions.find((r: HttpTypes.StoreRegion) => 
        r.countries?.some((c: any) => c.iso_2 === "in") || 
        r.currency_code?.toLowerCase() === "inr"
      );
      
      if (indiaRegion) {
        region = indiaRegion;
        console.log("Found India region for products:", region.id);
      } else {
        // Fallback to first region if no India region exists
        region = allRegions[0];
        console.log("No India region found, using first available region:", region.id);
      }
    }
    // Otherwise try to find region by country code or region ID
    else if (countryCode) {
      // Prefer "in" country code if that's what's requested
      if (countryCode === "in") {
        const indiaRegion = allRegions.find(r => 
          r.countries?.some(c => c.iso_2 === "in") || 
          r.currency_code?.toLowerCase() === "inr"
        );
        if (indiaRegion) {
          region = indiaRegion;
          console.log("Found India region by direct match:", region.id);
        } else {
          // Fall back to getRegion utility
          region = await getRegion(countryCode);
          console.log("Using getRegion utility for India:", region?.id || "none");
        }
      } else {
        // For other country codes, use the utility function
        region = await getRegion(countryCode);
        console.log("Found region by country code:", region?.id || "none");
      }
    } 
    else if (regionId) {
      // Try to find by ID directly
      region = allRegions.find(r => r.id === regionId);
      console.log("Found region by ID:", region?.id || "none");
    }
    
    // Final fallback: use the first region
    if (!region && allRegions.length > 0) {
      region = allRegions[0];
      console.log("Using fallback region:", region.id);
    }
  } catch (error) {
    console.error("Error retrieving regions:", error);
  }

  if (!region) {
    console.error("No region available, returning empty response");
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    }
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  console.log(`Fetching products with region_id: ${region.id}...`);

  try {
    const result = await sdk.client
      .fetch<{ products: HttpTypes.StoreProduct[]; count: number }>(
        `/store/products`,
        {
          method: "GET",
          query: {
            limit,
            offset,
            region_id: region.id,
            fields:
              "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags",
            ...queryParams,
          },
          headers,
          cache: 'no-store',
          next: {
            revalidate: 0
          }
        }
      );
      
    console.log(`Successfully fetched ${result.products?.length} products, total count: ${result.count}`);
    
    const nextPage = result.count > offset + limit ? pageParam + 1 : null;

    return {
      response: result,
      nextPage: nextPage,
      queryParams,
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    }
  }
}

/**
 * This will fetch 100 products to the Next.js cache and sort them based on the sortBy parameter.
 * It will then return the paginated products based on the page and limit parameters.
 */
export const listProductsWithSort = async ({
  page = 0,
  queryParams,
  sortBy = "created_at",
  countryCode,
}: {
  page?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  sortBy?: SortOptions
  countryCode: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> => {
  const limit = queryParams?.limit || 12

  const {
    response: { products, count },
  } = await listProducts({
    pageParam: 0,
    queryParams: {
      ...queryParams,
      limit: 100,
    },
    countryCode,
  })

  const sortedProducts = sortProducts(products, sortBy)

  const pageParam = (page - 1) * limit

  const nextPage = count > pageParam + limit ? pageParam + limit : null

  const paginatedProducts = sortedProducts.slice(pageParam, pageParam + limit)

  return {
    response: {
      products: paginatedProducts,
      count,
    },
    nextPage,
    queryParams,
  }
}
