import Stripe from "stripe";
import { NextResponse } from "next/server";
import { checkoutSchema } from "@/lib/schemas";
import { env, isProduction } from "@/lib/env";
import { getProductBySlug } from "@/lib/catalog";
import { siteConfig } from "@/lib/site";

function buildVariantSummary(item: {
  size?: string;
  color?: string;
  material?: string;
  personalization?: string;
}) {
  return [item.size, item.color, item.material, item.personalization]
    .filter(Boolean)
    .join(" · ");
}

function getValidatedCartItems(items: ReturnType<typeof checkoutSchema.parse>["items"]) {
  return items.map((item) => {
    const product = getProductBySlug(item.slug);

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
      personalization: item.personalization,
      variantSummary: buildVariantSummary(item),
    };
  });
}

export async function POST(request: Request) {
  try {
    const parsed = checkoutSchema.parse(await request.json());
    const validatedItems = getValidatedCartItems(parsed.items);
    const origin = request.headers.get("origin") ?? env.NEXT_PUBLIC_SITE_URL ?? siteConfig.url;

    if (!env.STRIPE_SECRET_KEY) {
      if (isProduction) {
        return NextResponse.json(
          {
            ok: false,
            message: "Stripe nu este configurat. Adaugă STRIPE_SECRET_KEY înainte de lansare.",
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
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );

    const lineItems = [
      ...validatedItems.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: "ron",
          unit_amount: item.unitPrice * 100,
          product_data: {
            name: item.name,
            description:
              item.variantSummary || "Realizat la comandă în România · Timp de producție: 3–7 zile lucrătoare",
            metadata: {
              product_slug: item.slug,
              product_name: item.name,
              variant_summary: item.variantSummary,
            },
          },
        },
      })),
      {
        quantity: 1,
        price_data: {
          currency: "ron",
          unit_amount: siteConfig.flatShipping * 100,
          product_data: {
            name: "Livrare cu tarif fix",
            description: "Doar în România · Realizat la comandă în România",
            metadata: {
              product_slug: "shipping",
              product_name: "Livrare cu tarif fix",
              variant_summary: "Livrare în România",
            },
          },
        },
      },
    ];

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
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
        shipping_method: "Tarif fix România",
        shipping_cost: String(siteConfig.flatShipping),
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
