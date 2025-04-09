import { Text } from "@medusajs/ui"
import { listProducts } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default async function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  // const pricedProduct = await listProducts({
  //   regionId: region.id,
  //   queryParams: { id: [product.id!] },
  // }).then(({ response }) => response.products[0])

  // if (!pricedProduct) {
  //   return null
  // }

  const { cheapestPrice } = getProductPrice({
    product,
  })

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group">
      <div data-testid="product-wrapper">
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          size="full"
          isFeatured={isFeatured}
        />
        <div className={`flex flex-col ${isFeatured ? 'px-3 py-3' : 'px-2 py-2'} mt-2 justify-between`}>
          <Text className={`${isFeatured ? 'text-base sm:text-lg font-medium' : 'text-sm sm:text-base'} text-ui-fg-subtle mb-1 sm:mb-0 truncate`} data-testid="product-title">
            {product.title}
          </Text>
          {isFeatured && product.description && (
            <Text className="text-xs sm:text-sm text-gray-500 line-clamp-2 mt-1 mb-2 hidden sm:block">
              {product.description.substring(0, 80)}{product.description.length > 80 ? '...' : ''}
            </Text>
          )}
          <div className={`flex items-center ${isFeatured ? 'mt-2' : ''}`}>
            {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
