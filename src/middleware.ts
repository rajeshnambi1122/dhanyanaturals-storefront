import { HttpTypes } from "@medusajs/types"
import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
const DEFAULT_REGION = "in" // Use India as the default region

const regionMapCache = {
  regionMap: new Map<string, HttpTypes.StoreRegion>(),
  regionMapUpdated: Date.now(),
}

async function getRegionMap(cacheId: string) {
  const { regionMap, regionMapUpdated } = regionMapCache

  if (!BACKEND_URL) {
    throw new Error(
      "Middleware.ts: Error fetching regions. Did you set up regions in your Medusa Admin and define a MEDUSA_BACKEND_URL environment variable? Note that the variable is no longer named NEXT_PUBLIC_MEDUSA_BACKEND_URL."
    )
  }

  try {
    // Always fetch fresh regions if single region mode or if cache is empty/old
    if (
      process.env.NEXT_PUBLIC_FORCE_SINGLE_REGION === "true" ||
      !regionMap.keys().next().value ||
      regionMapUpdated < Date.now() - 3600 * 1000
    ) {
      // Clear previous region map
      regionMapCache.regionMap.clear();
      
      // Fetch regions from Medusa
      const { regions } = await fetch(`${BACKEND_URL}/store/regions`, {
        headers: {
          "x-publishable-api-key": PUBLISHABLE_API_KEY!,
        },
        cache: "no-store", // Don't cache since we're forcing single region
      }).then(async (response) => {
        const json = await response.json()

        if (!response.ok) {
          throw new Error(json.message)
        }

        return json
      })

      if (!regions?.length) {
        throw new Error(
          "No regions found. Please set up regions in your Medusa Admin."
        )
      }

      // Create a map of country codes to regions.
      regions.forEach((region: HttpTypes.StoreRegion) => {
        region.countries?.forEach((c) => {
          regionMapCache.regionMap.set(c.iso_2 ?? "", region)
        })
      })

      regionMapCache.regionMapUpdated = Date.now()
    }

    return regionMapCache.regionMap
  } catch (error) {
    console.error("Error getting region map:", error);
    // Initialize an empty map if fetch fails
    return new Map();
  }
}

/**
 * Gets the country code from the req.
 * @param req
 * @returns
 */
function getCountryCode(
  req: NextRequest,
  regionMap: Map<string, HttpTypes.StoreRegion>
): string {
  try {
    // If we're in single region mode, return in (India) as that's what the client wants
    if (process.env.NEXT_PUBLIC_FORCE_SINGLE_REGION === "true") {
      console.log("Single region mode, using in as default country (India)");
      return "in"; // Use in for India region
    }
    
    // If we have no regions, default to in
    if (regionMap.size === 0) {
      console.log("No regions in map, using in as fallback");
      return "in";
    }

    // Check if we have the country code in the URL
    const path = req.nextUrl.pathname
    const countryCodeInPath = path.split("/")[1]?.toLowerCase()

    // If the country code exists in the path, use it
    const regionMapValues = Array.from(regionMap.values())
    if (
      countryCodeInPath &&
      regionMapValues.some((r) =>
        r.countries?.map((c) => c.iso_2).includes(countryCodeInPath)
      )
    ) {
      return countryCodeInPath
    }

    // Check if we have the country from the request headers
    const vercelCountry = req.headers.get("x-vercel-country")?.toLowerCase()
    if (
      vercelCountry &&
      regionMapValues.some((r) =>
        r.countries?.map((c) => c.iso_2).includes(vercelCountry)
      )
    ) {
      return vercelCountry
    }

    // Default to DEFAULT_REGION from env or "in" if not specified
    const defaultRegion = process.env.NEXT_PUBLIC_DEFAULT_REGION || "in"
    return defaultRegion
  } catch (error) {
    console.error("Error in getCountryCode:", error);
    return "in"; // Default to in if there's an error
  }
}

/**
 * Middleware to handle region selection and onboarding status.
 */
export async function middleware(request: NextRequest) {
  // Check if the url is a static asset or clearCache
  if (request.nextUrl.pathname.includes(".") || 
      request.nextUrl.pathname === "/clearCache.js") {
    return NextResponse.next()
  }

  let cacheIdCookie = request.cookies.get("_medusa_cache_id")
  let cacheId = cacheIdCookie?.value || crypto.randomUUID()
  const regionMap = await getRegionMap(cacheId)
  const countryCode = regionMap && (await getCountryCode(request, regionMap))
  
  // Get path parts
  const pathParts = request.nextUrl.pathname.split("/").filter(Boolean);
  
  // Check if the first part is a valid country code
  const firstPartIsCountryCode = pathParts[0] && regionMap.has(pathParts[0].toLowerCase());
  
  // Check if the URL has the correct country code as the first part
  if (firstPartIsCountryCode && pathParts[0].toLowerCase() === countryCode) {
    // URL already has correct country code, no need to redirect
    if (!cacheIdCookie) {
      // Set the cache ID cookie if not already set
      const response = NextResponse.next();
      response.cookies.set("_medusa_cache_id", cacheId, {
        maxAge: 60 * 60 * 24,
      });
      return response;
    }
    return NextResponse.next();
  }
  
  // Fix double country code issue - remove any existing country codes
  let correctedPath = "";
  if (firstPartIsCountryCode) {
    // Remove the first part (country code) and reconstruct the path
    correctedPath = "/" + pathParts.slice(1).join("/");
  } else {
    correctedPath = request.nextUrl.pathname;
  }
  
  // Now add the correct country code
  const queryString = request.nextUrl.search || "";
  const redirectUrl = `${request.nextUrl.origin}/${countryCode}${correctedPath === "/" ? "" : correctedPath}${queryString}`;
  
  const response = NextResponse.redirect(redirectUrl, 307);
  
  // Set the cache ID cookie if not already set
  if (!cacheIdCookie) {
    response.cookies.set("_medusa_cache_id", cacheId, {
      maxAge: 60 * 60 * 24,
    });
  }
  
  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|assets|png|svg|jpg|jpeg|gif|webp).*)",
  ],
}
