export type SizePriceMap = Record<string, number>;

const SIZE_PRICE_SEPARATOR = /\s*(?:=|\||:)\s*/;

export function parseSizeOption(raw: string) {
  const value = raw.trim();

  if (!value) {
    return null;
  }

  const [labelPart, pricePart] = value.split(SIZE_PRICE_SEPARATOR);
  const label = labelPart?.trim();

  if (!label) {
    return null;
  }

  const price = pricePart
    ? Number.parseInt(pricePart.replace(/[^\d]/g, ""), 10)
    : Number.NaN;

  return {
    label,
    price: Number.isFinite(price) && price > 0 ? price : undefined,
  };
}

export function normalizeSizeOptions(values: string[]) {
  const labels: string[] = [];
  const priceMap: SizePriceMap = {};

  for (const value of values) {
    const option = parseSizeOption(value);

    if (!option) {
      continue;
    }

    labels.push(option.label);

    if (option.price) {
      priceMap[option.label] = option.price;
    }
  }

  return { labels, priceMap };
}

export function formatSizeOptionsForAdmin(values: string[], priceMap?: SizePriceMap) {
  return values
    .map((label) => {
      const price = priceMap?.[label];
      return price ? `${label} = ${price}` : label;
    })
    .join("\n");
}

export function getSizeAdjustedPrice({
  basePrice,
  selectedSize,
  sizePrices,
}: {
  basePrice: number;
  selectedSize?: string;
  sizePrices?: SizePriceMap;
}) {
  if (!selectedSize || !sizePrices?.[selectedSize]) {
    return basePrice;
  }

  return sizePrices[selectedSize];
}
