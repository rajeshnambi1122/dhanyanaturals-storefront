import { listRegions } from "@lib/data/regions"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Get all regions
    const regions = await listRegions()
    
    // Return regions data
    return NextResponse.json(regions)
  } catch (error) {
    console.error("Error fetching regions:", error)
    return NextResponse.json({ error: "Failed to fetch regions" }, { status: 500 })
  }
} 