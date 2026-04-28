export type ProductCategory =
  | "auto-moto"
  | "crypto-trading"
  | "desk-setup"
  | "gifts"
  | "funny-viral";

export type ProductOptionGroup = {
  name: string;
  values: string[];
};

export type ProductUseCase =
  | "Birou / setup"
  | "Raft de birou"
  | "Perete de garaj"
  | "Cadou cu impact"
  | "Studio de creator"
  | "Fundal de streaming"
  | "Birou de fondator";

export type Product = {
  id?: string;
  slug: string;
  name: string;
  category: ProductCategory;
  price: number;
  enabled?: boolean;
  shortDescription: string;
  longDescription: string;
  story: string;
  sizes: string[];
  sizePrices?: Record<string, number>;
  colors: string[];
  materials: string[];
  sizeLabel?: string;
  colorLabel?: string;
  materialLabel?: string;
  personalizationLabel?: string;
  leadTime: string;
  idealFor: ProductUseCase[];
  customization: string[];
  shippingNote: string;
  shippingSettings?: ProductShippingSettings;
  packagingNote: string;
  seoTitle: string;
  seoDescription: string;
  badge?: string;
  featured?: boolean;
  visual: {
    accent: string;
    glow: string;
    motif: string;
  };
  media?: ProductMediaRecord[];
};

export type Category = {
  slug: ProductCategory;
  name: string;
  description: string;
  hook: string;
};

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  material?: string;
  personalizationSelected?: boolean;
  personalization?: string;
  accent: string;
  shippingSettings?: ProductShippingSettings;
  shippingNote?: string;
};

export type CartStorage = {
  items: CartItem[];
  giftPackaging: boolean;
  orderNotes?: string;
};

export type CustomOrderRecord = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone?: string;
  type: string;
  description: string;
  desiredSize?: string;
  colors?: string;
  budget?: string;
  deadline?: string;
  fileName?: string;
  fileUrl?: string;
};

export type OrderStatus =
  | "paid"
  | "in_production"
  | "shipped"
  | "completed"
  | "cancelled";

export type OrderRecord = {
  id: string;
  created_at: string;
  public_order_ref?: string | null;
  email?: string | null;
  total?: number | null;
  customer_name: string;
  customer_email: string;
  customer_phone?: string | null;
  total_amount: number;
  currency: string;
  status: OrderStatus;
  payment_status?: string | null;
  gift_packaging?: boolean | null;
  personalization?: boolean | null;
  stripe_session_id?: string | null;
  stripe_payment_intent_id?: string | null;
  shipping_method: string;
  shipping_cost: number;
  notes?: string | null;
  source?: string | null;
  metadata?: Record<string, unknown> | null;
};

export type OrderShippingAddress = {
  name?: string | null;
  phone?: string | null;
  line1?: string | null;
  line2?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
};

export type OrderItemRecord = {
  id: string;
  created_at?: string;
  order_id: string;
  product_slug: string;
  product_name: string;
  variant_summary?: string | null;
  unit_price: number;
  quantity: number;
  line_total: number;
  metadata?: Record<string, unknown> | null;
};

export type OrderStatusEventRecord = {
  id: string;
  order_id: string;
  status: OrderStatus;
  note?: string | null;
  visible_to_customer?: boolean;
  created_at: string;
};

export type ProductMediaRecord = {
  id: string;
  product_id: string;
  storage_path: string;
  alt_text?: string | null;
  sort_order: number;
  kind: string;
  created_at?: string;
  public_url?: string;
};

export type ProductAdminRecord = {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  short_description: string;
  long_description: string;
  price: number;
  badge?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  featured: boolean;
  enabled: boolean;
  sizes: string[];
  sizePrices?: Record<string, number>;
  colors: string[];
  materials: string[];
  customization: string[];
  ideal_for: string[];
  visual?: Product["visual"];
  standard_shipping_enabled?: boolean;
  free_shipping_eligible?: boolean;
  pickup_only?: boolean;
  oversized_or_special_shipping?: boolean;
  shipping_note?: string | null;
  created_at: string;
  updated_at: string;
  media?: ProductMediaRecord[];
};

export type ProductShippingSettings = {
  standardShippingEnabled: boolean;
  freeShippingEligible: boolean;
  pickupOnly: boolean;
  oversizedOrSpecialShipping: boolean;
  shippingNote?: string | null;
};

export type ReviewRecord = {
  id: string;
  created_at: string;
  customer_name: string;
  rating: number;
  review_text: string;
  category_slug?: string | null;
  category_label?: string | null;
  legacy_reference?: string | null;
  visible: boolean;
  featured?: boolean;
  review_date?: string | null;
};
