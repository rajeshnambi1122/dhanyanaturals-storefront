import { Container, clx } from "@medusajs/ui"
import Image from "next/image"
import React from "react"

import PlaceholderImage from "@modules/common/icons/placeholder-image"

type ThumbnailProps = {
  thumbnail?: string | null
  // TODO: Fix image typings
  images?: any[] | null
  size?: "small" | "medium" | "large" | "full" | "square"
  isFeatured?: boolean
  className?: string
  "data-testid"?: string
}

const Thumbnail: React.FC<ThumbnailProps> = ({
  thumbnail,
  images,
  size = "small",
  isFeatured,
  className,
  "data-testid": dataTestid,
}) => {
  const initialImage = thumbnail || images?.[0]?.url

  return (
    <Container
      className={clx(
        "relative w-full overflow-hidden bg-ui-bg-subtle shadow-elevation-card-rest rounded-lg md:rounded-large group-hover:shadow-elevation-card-hover transition-shadow ease-in-out duration-150",
        className,
        {
          "aspect-[4/5] p-0": isFeatured,
          "aspect-[1/1] sm:aspect-[9/16] p-3 md:p-4": !isFeatured && size !== "square",
          "aspect-[1/1] p-3 md:p-4": size === "square",
          "w-[140px] sm:w-[180px]": size === "small",
          "w-[200px] sm:w-[290px]": size === "medium",
          "w-[300px] sm:w-[440px]": size === "large",
          "w-full": size === "full",
        }
      )}
      data-testid={dataTestid}
    >
      <ImageOrPlaceholder image={initialImage} size={size} isFeatured={isFeatured} />
    </Container>
  )
}

const ImageOrPlaceholder = ({
  image,
  size,
  isFeatured,
}: Pick<ThumbnailProps, "size" | "isFeatured"> & { image?: string }) => {
  return image ? (
    <Image
      src={image}
      alt="Thumbnail"
      className={clx(
        "absolute inset-0 object-cover",
        {
          "object-center": !isFeatured,
          "object-top": isFeatured,
        }
      )}
      draggable={false}
      quality={isFeatured ? 80 : 50}
      sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 992px) 33vw, 25vw"
      fill
      priority={isFeatured}
    />
  ) : (
    <div className="w-full h-full absolute inset-0 flex items-center justify-center">
      <PlaceholderImage size={size === "small" ? 16 : 24} />
    </div>
  )
}

export default Thumbnail
