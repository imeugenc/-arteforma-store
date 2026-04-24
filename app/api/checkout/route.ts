import Stripe from "stripe";
import { NextResponse } from "next/server";
import { checkoutSchema } from "@/lib/schemas";
import { env, isProduction } from "@/lib/env";
import { getCatalogProductBySlug } from "@/lib/admin-catalog";
import { getShippingQuote } from "@/lib/checkout";
import { siteConfig } from "@/lib/site";

function isLocalOrigin(origin: string) {
  return origin.includes("localhost") || origin.includes("127.0.0.1");
}

function buildVariantSummary(item: {
  size?: string;
  color?: string;
  material?: string;
  personalizationSelected?: boolean;
  personalization?: string;
}) {
  return [
    item.size,
    item.color,
    item.material,
    item.personalizationSelected ? `Personalizare${item.personalization ? `: ${item.personalization}` : ""}` : "",
  ]
    .filter(Boolean)
    .join(" · ");
}

async function getValidatedCartItems(items: ReturnType<typeof checkoutSchema.parse>["items"]) {
  return Promise.all(
    items.map(async (item) => {
      const product = await getCatalogProductBySlug(item.slug);

      if (!product) {
        throw new Error(`Produs necunoscut: ${item.slug}`);
      }

      if (item.size && !product.sizes.includes(item.size)) {
        throw new Error(`Ai selectat o dimensiune invalidă pentru ${product.name}.`);
      }

      if (item.color && !product.colors.includes(item.color)) {
        throw new Error(`Ai selectat o culoare invalidă pentru ${product.name}.`);
      }

      if (item.material && !product.materials.includes(item.material)) {
        throw new Error(`Ai selectat un material invalid pentru ${product.name}.`);
      }

      return {
        slug: product.slug,
        name: product.name,
        unitPrice: product.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        material: item.material,
        personalizationSelected: item.personalizationSelected ?? false,
        personalization: item.personalization,
        variantSummary: buildVariantSummary(item),
        shippingSettings: product.shippingSettings,
        shippingNote: product.shippingNote,
      };
    }),
  );
}

export async function POST(request: Request) {
  try {
    const parsed = checkoutSchema.parse(await request.json());
    const validatedItems = await getValidatedCartItems(parsed.items);
    const giftPackaging = parsed.giftPackaging ?? false;
    const origin = request.headers.get("origin") ?? env.NEXT_PUBLIC_SITE_URL ?? siteConfig.url;

    if (!validatedItems.length) {
      throw new Error("Coșul este gol.");
    }

    if (!env.STRIPE_SECRET_KEY) {
      if (isProduction || !isLocalOrigin(origin)) {
        return NextResponse.json(
          {
            ok: false,
            message: "Plata nu este configurată complet încă. Activează cheile Stripe în producție înainte de a accepta comenzi reale.",
          },
          { status: 503 },
        );
      }

      return NextResponse.json({
        ok: true,
        url: `${origin}/success?demo=1`,
        mode: "development-fallback",
      });
    }

    const stripe = new Stripe(env.STRIPE_SECRET_KEY);
    const itemsTotal = validatedItems.reduce(
      (sum, item) =>
        sum +
        (item.unitPrice +
          (item.personalizationSelected ? siteConfig.personalizationPrice : 0)) *
          item.quantity,
      0,
    );
    const cartItemsForShipping = validatedItems.map((item) => ({
      id: item.slug,
      slug: item.slug,
      name: item.name,
      price: item.unitPrice,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      material: item.material,
      personalizationSelected: item.personalizationSelected,
      personalization: item.personalization,
      accent: "#d7a12a",
      shippingSettings: item.shippingSettings,
      shippingNote: item.shippingNote,
    }));
    const shippingQuote = getShippingQuote(cartItemsForShipping);
    const shippingCost = shippingQuote.cost;

    const lineItems = [
      ...validatedItems.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: "ron",
          unit_amount:
            (item.unitPrice +
              (item.personalizationSelected ? siteConfig.personalizationPrice : 0)) *
            100,
          product_data: {
            name: item.name,
            description:
              item.variantSummary || "Realizat la comandă în România · Timp de producție: 2–5 zile lucrătoare",
            metadata: {
              product_slug: item.slug,
              product_name: item.name,
              variant_summary: item.variantSummary,
            },
          },
        },
      })),
      ...(giftPackaging
        ? [
            {
              quantity: 1,
              price_data: {
                currency: "ron",
                unit_amount: siteConfig.giftPackagingPrice * 100,
                product_data: {
                  name: "Ambalare premium",
                  description: "Opțiune suplimentară pentru prezentare de cadou",
                  metadata: {
                    product_slug: "gift-packaging",
                    product_name: "Ambalare premium",
                    variant_summary: "Extra opțional",
                  },
                },
              },
            },
          ]
        : []),
      ...(shippingCost
        ? [
            {
              quantity: 1,
              price_data: {
                currency: "ron",
                unit_amount: shippingCost * 100,
                product_data: {
                  name: "Livrare",
                  description: "Livrare în România",
                  metadata: {
                    product_slug: "shipping",
                    product_name: "Livrare",
                    variant_summary: "Livrare în România",
                  },
                },
              },
            },
          ]
        : []),
    ];

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      phone_number_collection: {
        enabled: true,
      },
      shipping_address_collection: {
        allowed_countries: ["RO"],
      },
      currency: "ron",
      line_items: lineItems,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
      metadata: {
        channel: "arteforma-web",
        source: "website",
        shipping_method: shippingQuote.method,
        shipping_cost: String(shippingCost),
        shipping_notes: shippingQuote.notes.join(" | "),
        special_shipping: shippingQuote.hasSpecialShipping || shippingQuote.hasPickupOnly ? "true" : "false",
        gift_packaging: giftPackaging ? "true" : "false",
        items_total: String(itemsTotal),
      },
      custom_text: {
        submit: {
          message: "Fiecare obiect ArteForma este realizat la comandă în România.",
        },
      },
    });

    if (!session.url) {
      throw new Error("Stripe nu a returnat un URL de checkout.");
    }

    return NextResponse.json({ ok: true, url: session.url });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Nu am putut crea sesiunea de checkout acum.";

    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}
