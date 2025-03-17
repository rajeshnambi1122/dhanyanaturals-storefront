"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

export const listRegions = async () => {
  const next = {
    ...(await getCacheOptions("regions")),
  }

  return sdk.client
    .fetch<{ regions: HttpTypes.StoreRegion[] }>(`/store/regions`, {
      method: "GET",
      next,
      cache: "force-cache",
    })
    .then(({ regions }) => regions)
    .catch(medusaError)
}

export const retrieveRegion = async (id: string) => {
  const next = {
    ...(await getCacheOptions(["regions", id].join("-"))),
  }

  return sdk.client
    .fetch<{ region: HttpTypes.StoreRegion }>(`/store/regions/${id}`, {
      method: "GET",
      next,
      cache: "force-cache",
    })
    .then(({ region }) => region)
    .catch(medusaError)
}

const regionMap = new Map<string, HttpTypes.StoreRegion>()

export const getRegion = async (countryCode: string) => {
  try {
    // Get all available regions
    const regions = await listRegions()
    
    if (!regions || regions.length === 0) {
      console.error("No regions available in the database");
      return null;
    }
    
    console.log("Available regions:", regions.map(r => ({
      id: r.id,
      name: r.name,
      currency_code: r.currency_code
    })));
    
    // Force to use a single region if configured
    if (process.env.NEXT_PUBLIC_FORCE_SINGLE_REGION === "true") {
      console.log("Forcing single region mode for India");
      
      // First look for a region that has India or uses INR
      const indiaRegion = regions.find(r => 
        r.countries?.some(c => c.iso_2 === "in") || 
        r.currency_code?.toLowerCase() === "inr"
      );
      
      if (indiaRegion) {
        console.log("Found India region:", indiaRegion.name);
        return indiaRegion;
      }
      
      // If India region wasn't found, use the first available region
      console.log("India region not found, using first available region:", regions[0].name);
      return regions[0];
    }
    
    // Standard region selection based on country code
    // Original logic as fallback
    if (regionMap.has(countryCode)) {
      return regionMap.get(countryCode)
    }

    // Populate the region map with all regions
    regions.forEach((region) => {
      region.countries?.forEach((c) => {
        regionMap.set(c?.iso_2 ?? "", region)
      })
    })

    // Try to get the region for the provided country code
    const region = countryCode ? regionMap.get(countryCode) : null;
    
    // If not found, use the default region from env or the first region
    if (!region) {
      const defaultCountry = process.env.NEXT_PUBLIC_DEFAULT_REGION || "in";
      return regionMap.get(defaultCountry) || regions[0];
    }

    return region;
  } catch (e: any) {
    console.error("Error in getRegion:", e);
    return null;
  }
}
