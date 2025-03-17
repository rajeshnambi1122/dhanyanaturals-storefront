import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { listCategories } from "@lib/data/categories"
import { Text } from "@medusajs/ui"

export const metadata: Metadata = {
  title: "Dhanya Naturals | Natural & Herbal Products",
  description:
    "Discover Dhanya Naturals' handcrafted soaps, organic shampoos, natural cosmetics, and pure herbal powders. Made with love for your body and the environment.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params
  
  console.log("Home page rendering with countryCode:", countryCode);
  
  let region;
  let collections;
  let categories;
  
  try {
    region = await getRegion(countryCode);
    console.log("Region fetched:", region ? 
      { id: region.id, name: region.name, currency_code: region.currency_code } : 
      "No region found");
  } catch (error) {
    console.error("Error fetching region:", error);
    return (
      <div className="p-4 md:p-8">
        <h1 className="text-xl md:text-2xl font-bold mb-4">Error loading region</h1>
        <p className="mb-4">There was an error loading the region information. Please try clearing your browser cache or refreshing the page.</p>
        <Link href="/clearCache.js" className="text-blue-500 underline">Clear Cache</Link>
      </div>
    );
  }
  
  try {
    const collectionsResult = await listCollections({
      fields: "id, handle, title",
    });
    collections = collectionsResult.collections;
    console.log("Collections fetched:", collections ? 
      collections.map(c => ({ id: c.id, title: c.title })) : 
      "No collections found");
  } catch (error) {
    console.error("Error fetching collections:", error);
    return (
      <div className="p-4 md:p-8">
        <h1 className="text-xl md:text-2xl font-bold mb-4">Error loading collections</h1>
        <p className="mb-4">There was an error loading the collections. Please try clearing your browser cache or refreshing the page.</p>
        <Link href="/clearCache.js" className="text-blue-500 underline">Clear Cache</Link>
      </div>
    );
  }
  
  try {
    categories = await listCategories();
    console.log("Categories fetched:", categories ? "Categories found" : "No categories found");
  } catch (error) {
    console.error("Error fetching categories:", error);
    // Continue rendering even if categories fail to load
  }

  if (!collections || !region) {
    console.error("Missing required data:", { 
      collectionsAvailable: !!collections, 
      regionAvailable: !!region 
    });
    return (
      <div className="p-4 md:p-8">
        <h1 className="text-xl md:text-2xl font-bold mb-4">Missing required data</h1>
        <p className="mb-4">Some required data is missing. Please try clearing your browser cache or refreshing the page.</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/clearCache.js" className="text-blue-500 underline">Clear Cache</Link>
          <Link href="/in/debug" className="text-blue-500 underline">View Debug Info</Link>
        </div>
      </div>
    );
  }

  // Featured categories
  const featuredCategories = [
    {
      title: "Natural Soaps",
      image: "/dhanyanaturalslogopng.png",
      slug: "/categories/natural-soaps"
    },
    {
      title: "Organic Shampoos",
      image: "/dhanyanaturalslogopng.png",
      slug: "/categories/shampoos"
    },
    {
      title: "Natural Cosmetics",
      image: "/dhanyanaturalslogopng.png",
      slug: "/categories/natural-cosmetics"
    },
    {
      title: "Herbal Powders",
      image: "/dhanyanaturalslogopng.png",
      slug: "/categories/herbal-powders"
    }
  ];

  return (
    <>
      <Hero />
      
      {/* Featured Categories Section */}
      <div className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8 max-w-[1440px] mx-auto">
        <div className="mb-6 md:mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#2c5530] mb-2">Shop By Categories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">Explore our range of natural and herbal products</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {featuredCategories.map((category, index) => (
            <Link href={category.slug} key={index} className="group">
              <div className="relative rounded-lg overflow-hidden h-48 sm:h-56 md:h-64 shadow-md transition-all duration-300 group-hover:shadow-lg">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300 z-10"></div>
                <Image 
                  src={category.image} 
                  alt={category.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 bg-gradient-to-t from-black/70 to-transparent z-20">
                  <h3 className="text-white text-lg md:text-xl font-medium">{category.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Benefits Banner */}
      <div className="bg-[#f5f1eb] py-8 sm:py-12 md:py-16">
        <div className="px-4 sm:px-6 md:px-8 max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            <div className="flex flex-col items-center text-center p-4 md:p-6 bg-white/50 rounded-lg shadow-sm">
              <div className="bg-[#2c5530] rounded-full p-3 mb-3 md:mb-4 w-10 md:w-12 h-10 md:h-12 flex items-center justify-center">
                <span className="text-white text-lg md:text-xl">✓</span>
              </div>
              <h3 className="text-lg md:text-xl font-medium mb-1 md:mb-2">100% Natural</h3>
              <p className="text-gray-600 text-sm md:text-base">All our products are made with natural ingredients, free from harmful chemicals.</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 md:p-6 bg-white/50 rounded-lg shadow-sm">
              <div className="bg-[#2c5530] rounded-full p-3 mb-3 md:mb-4 w-10 md:w-12 h-10 md:h-12 flex items-center justify-center">
                <span className="text-white text-lg md:text-xl">✓</span>
              </div>
              <h3 className="text-lg md:text-xl font-medium mb-1 md:mb-2">Traditional Formulas</h3>
              <p className="text-gray-600 text-sm md:text-base">Crafted with traditional recipes passed down through generations.</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 md:p-6 bg-white/50 rounded-lg shadow-sm sm:col-span-2 md:col-span-1">
              <div className="bg-[#2c5530] rounded-full p-3 mb-3 md:mb-4 w-10 md:w-12 h-10 md:h-12 flex items-center justify-center">
                <span className="text-white text-lg md:text-xl">✓</span>
              </div>
              <h3 className="text-lg md:text-xl font-medium mb-1 md:mb-2">Eco-Friendly</h3>
              <p className="text-gray-600 text-sm md:text-base">Sustainable packaging and environmentally conscious production methods.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Featured Products */}
      <div className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8 max-w-[1440px] mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#2c5530] mb-2">Featured Products</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">Discover our most popular natural and herbal products</p>
        </div>
        <div className="w-full overflow-x-auto pb-4">
          <ul className="flex flex-col gap-y-8 md:gap-y-12 min-w-full">
            <FeaturedProducts collections={collections} region={region} />
          </ul>
        </div>
      </div>
      
      {/* Newsletter Signup */}
      {/* <div className="bg-[#2c5530] text-white py-8 sm:py-12 md:py-16">
        <div className="px-4 sm:px-6 md:px-8 max-w-[1440px] mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-3 md:mb-4">Join Our Community</h2>
          <p className="mb-6 md:mb-8 max-w-2xl mx-auto text-sm md:text-base">Subscribe to our newsletter for exclusive offers, recipes, and tips on natural living.</p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-2 sm:gap-0">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow p-3 rounded-md sm:rounded-r-none focus:outline-none text-gray-800 w-full"
            />
            <button className="bg-[#f5f1eb] text-[#2c5530] px-6 py-3 rounded-md sm:rounded-l-none font-medium hover:bg-white transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div> */}
    </>
  )
} 