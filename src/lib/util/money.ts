import { isEmpty } from "./isEmpty"

type ConvertToLocaleParams = {
  amount: number
  currency_code: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  locale?: string
}

export const convertToLocale = ({
  amount,
  currency_code,
  minimumFractionDigits,
  maximumFractionDigits,
  locale = "en-US",
}: ConvertToLocaleParams) => {
  // Force INR currency when the environment variable is set
  const forcedCurrency = process.env.NEXT_PUBLIC_FORCE_SINGLE_REGION === "true" ? "inr" : currency_code

  return forcedCurrency && !isEmpty(forcedCurrency)
    ? new Intl.NumberFormat(locale, {
        style: "currency",
        currency: forcedCurrency,
        minimumFractionDigits,
        maximumFractionDigits,
      }).format(amount)
    : amount.toString()
}
