import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { Text, clx } from "@medusajs/ui"
import Image from "next/image"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import MedusaCTA from "@modules/layout/components/medusa-cta"

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "*products",
  })
  const productCategories = await listCategories()

  return (
    <footer className="border-t border-ui-border-base w-full bg-[#f5f1eb]">
      <div className="content-container flex flex-col w-full">
        <div className="flex flex-col gap-y-12 py-12 md:py-40">
          <div className="flex flex-col md:flex-row gap-y-12 md:gap-y-0 items-start justify-between">
            <div className="flex flex-col gap-y-4">
              <LocalizedClientLink
                href="/"
                className="txt-compact-xlarge-plus text-[#2c5530] hover:text-[#1e3d21] uppercase font-medium"
              >
                Dhanya Naturals
              </LocalizedClientLink>
              <Text className="max-w-[250px] text-ui-fg-subtle">
                Natural and herbal products for your well-being. Handcrafted with love and care.
              </Text>
            </div>
            <div className="text-small-regular gap-10 md:gap-x-16 grid grid-cols-2 sm:grid-cols-4">
              {productCategories && productCategories?.length > 0 && (
                <div className="flex flex-col gap-y-2">
                  <span className="txt-small-plus text-[#2c5530] font-medium">
                    Categories
                  </span>
                  <ul className="grid grid-cols-1 gap-2" data-testid="footer-categories">
                    {productCategories?.slice(0, 6).map((c) => (
                      <li key={c.id}>
                        <LocalizedClientLink
                          className="hover:text-[#2c5530] text-ui-fg-subtle"
                          href={`/categories/${c.handle}`}
                          data-testid="category-link"
                        >
                          {c.name}
                        </LocalizedClientLink>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {collections && collections.length > 0 && (
                <div className="flex flex-col gap-y-2">
                  <span className="txt-small-plus text-[#2c5530] font-medium">
                    Collections
                  </span>
                  <ul className="grid grid-cols-1 gap-2 text-ui-fg-subtle">
                    {collections?.slice(0, 6).map((c) => (
                      <li key={c.id}>
                        <LocalizedClientLink
                          className="hover:text-[#2c5530]"
                          href={`/collections/${c.handle}`}
                        >
                          {c.title}
                        </LocalizedClientLink>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex flex-col gap-y-2">
                <span className="txt-small-plus text-[#2c5530] font-medium">Quick Links</span>
                <ul className="grid grid-cols-1 gap-y-2 text-ui-fg-subtle">
                  <li>
                    <LocalizedClientLink href="/about" className="hover:text-[#2c5530]">
                      About Us
                    </LocalizedClientLink>
                  </li>
                  <li>
                    <LocalizedClientLink href="/contact" className="hover:text-[#2c5530]">
                      Contact
                    </LocalizedClientLink>
                  </li>
                  <li>
                    <LocalizedClientLink href="/shipping" className="hover:text-[#2c5530]">
                      Shipping
                    </LocalizedClientLink>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col gap-y-2">
                <span className="txt-small-plus text-[#2c5530] font-medium">Contact</span>
                <ul className="grid grid-cols-1 gap-y-2 text-ui-fg-subtle">
                  <li>Email: info@dhyanaturals.com</li>
                  <li>Phone: +91 XXX XXX XXXX</li>
                  <li className="max-w-[200px]">
                    Address: [Your Store Address], India
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Logo centered in footer */}
        <div className="w-full flex justify-center items-center my-8 md:my-12">
          <LocalizedClientLink href="/" className="flex items-center justify-center">
            <div className="relative w-[120px] h-[50px] md:w-[140px] md:h-[60px]">
              <Image
                src="/dhanyanaturalslogopng.png"
                alt="Dhanya Naturals"
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
          </LocalizedClientLink>
        </div>
        
        <div className="flex w-full mb-8 md:mb-16 justify-center text-ui-fg-muted">
          <Text className="txt-compact-small text-center">
            © {new Date().getFullYear()} Dhanya Naturals. All rights reserved.
          </Text>
        </div>
      </div>
    </footer>
  )
}
