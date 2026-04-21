import { Product, ProductCategory, Category } from "@/lib/types";

export const categories: Category[] = [
  {
    slug: "auto-moto",
    name: "Auto / Moto",
    description:
      "Piese de display pentru oamenii care recunosc o siluetă într-o secundă și vor ca spațiul lor să vorbească despre ce conduc.",
    hook: "Pentru cei a căror identitate începe cu ce conduc.",
  },
  {
    slug: "crypto-trading",
    name: "Crypto / Trading",
    description:
      "Obiecte puternice pentru birou, create pentru setup-uri în care fiecare detaliu transmite claritate, focus și convingere.",
    hook: "Obiecte cu prezență pentru spații construite pe focus.",
  },
  {
    slug: "desk-setup",
    name: "Desk Setup",
    description:
      "Obiecte minimaliste și premium care fac un setup să pară construit, nu doar asamblat din piese.",
    hook: "Pentru setup-uri care trebuie să pară curate, coerente și asumate.",
  },
  {
    slug: "gifts",
    name: "Cadouri",
    description:
      "Piese personalizate cu impact emoțional, finisaj premium și suficientă prezență încât să rămână la vedere.",
    hook: "Genul de cadou care chiar ajunge să facă parte din spațiul lor.",
  },
  {
    slug: "funny-viral",
    name: "Funny / Viral",
    description:
      "Idei născute din internet, transformate în obiecte mai curate, mai premium și mai bune de expus.",
    hook: "Obiecte cu personalitate, fără energia de produs ieftin.",
  },
];

export const products: Product[] = [
  {
    slug: "porsche-911-silhouette-plaque",
    name: "Placă siluetă Porsche 911",
    category: "auto-moto",
    price: 189,
    shortDescription:
      "O piesă de perete curată și premium, construită în jurul uneia dintre cele mai recognoscibile siluete auto create vreodată.",
    longDescription:
      "Placa siluetă Porsche 911 este gândită pentru birouri, garaje și setup-uri dark în care contează rafinamentul, nu zgomotul vizual. Forma este recognoscibilă instant pentru omul potrivit, iar finisajul o păstrează suficient de premium încât să stea natural într-un birou de fondator sau într-un colț de colecționar.",
    story:
      "Pentru cei care nu au nevoie de un logo ca să recunoască forma. Piesa asta vorbește despre statut discret și gust auto transformat în obiect.",
    sizes: ["18 cm compact", "28 cm signature", "40 cm piesă statement"],
    colors: ["Negru Obsidian", "Gri Graphite", "Auriu Champagne"],
    materials: ["PLA Premium", "PLA Silk", "PETG"],
    sizeLabel: "Dimensiune display",
    colorLabel: "Finisaj",
    materialLabel: "Material",
    personalizationLabel: "Text opțional pe plăcuță",
    leadTime: "3–7 zile lucrătoare",
    idealFor: ["Perete de garaj", "Raft de birou", "Birou de fondator"],
    customization: [
      "Text personalizat opțional pe plăcuță",
      "Poate fi redimensionată pentru un perete sau raft anume",
      "Disponibilă și în finisaje mai închise sau metalice",
    ],
    shippingNote: "Livrare în România cu tarif fix.",
    packagingNote: "Ambalată într-o cutie rigidă, potrivită pentru cadou sau livrare în siguranță.",
    seoTitle: "Placă siluetă Porsche 911 | ArteForma",
    seoDescription:
      "Placă premium Porsche 911 printată 3D, realizată la comandă în România. Perfectă pentru garaj, birou sau spații de colecționar.",
    badge: "Best seller",
    featured: true,
    visual: { accent: "#d5a23a", glow: "#f6d57a", motif: "911" },
  },
  {
    slug: "bmw-e46-desk-totem",
    name: "Totem de birou BMW E46",
    category: "auto-moto",
    price: 159,
    shortDescription:
      "Un obiect vertical pentru birou, inspirat de una dintre cele mai iubite forme din cultura auto modernă.",
    longDescription:
      "Piesa aceasta transformă nostalgia E46 într-un statement premium pentru birou. Este compactă, arhitecturală și suficient de curată ca să citească bine de la distanță, ceea ce o face ideală pentru rafturi, setup-uri și birouri care au nevoie de un singur obiect cu personalitate clară.",
    story:
      "Nu orice mașină merită să devină obiect. E46 merită, pentru că încă spune ceva oamenilor care știu.",
    sizes: ["16 cm compact", "24 cm piesă de birou"],
    colors: ["Negru Obsidian", "Gunmetal", "Auriu Sand"],
    materials: ["PLA Premium", "PETG"],
    sizeLabel: "Dimensiune totem",
    colorLabel: "Finisaj principal",
    materialLabel: "Material",
    personalizationLabel: "Notă opțională model/an",
    leadTime: "3–7 zile lucrătoare",
    idealFor: ["Desk setup", "Raft de birou", "Studio de creator"],
    customization: [
      "Text personalizat opțional pe bază",
      "Poate fi adaptat pentru altă generație BMW",
      "Versiuni scalate disponibile la cerere",
    ],
    shippingNote: "Livrare doar în România în v1.",
    packagingNote: "Livrat în ambalaj premium negru, cu protecție internă.",
    seoTitle: "Obiect de birou BMW E46 | ArteForma",
    seoDescription:
      "Obiect premium de birou inspirat de BMW E46, printat 3D și realizat la comandă în România pentru setup-uri, rafturi și birouri.",
    visual: { accent: "#b98a27", glow: "#ffe09a", motif: "E46" },
  },
  {
    slug: "moto-line-wall-art",
    name: "Moto Line Wall Art",
    category: "auto-moto",
    price: 209,
    shortDescription:
      "Un obiect de perete cu linii ascuțite, care păstrează agresivitatea unei motociclete sport fără să încarce vizual.",
    longDescription:
      "Moto Line Wall Art este făcut pentru riderii care vor ca spațiul lor să poarte aceeași energie ca motocicleta. Geometria rămâne curată, profilul rămâne clar, iar rezultatul se simte mai aproape de design de obiect decât de decor de hobby.",
    story:
      "Pentru cei care merg tare, dar vor ca spațiul lor să arate controlat și premium.",
    sizes: ["30 cm gallery", "45 cm statement"],
    colors: ["Negru Mat", "Titanium Grey", "Auriu Metalic"],
    materials: ["PLA Premium", "PLA Silk"],
    sizeLabel: "Dimensiune perete",
    colorLabel: "Finisaj",
    materialLabel: "Material",
    personalizationLabel: "Nume rider opțional",
    leadTime: "3–7 zile lucrătoare",
    idealFor: ["Perete de garaj", "Raft de birou", "Studio de creator"],
    customization: [
      "Poate fi adaptat la profilul unei motociclete anume",
      "Se poate adăuga nume sau detaliu de plăcuță",
      "Disponibil și în scală mai mare pentru pereți mai lați",
    ],
    shippingNote: "Livrare cu tarif fix în România.",
    packagingNote: "Ambalată pentru transport sigur, cu protecție pe muchii.",
    seoTitle: "Artă de perete moto, realizată la comandă | ArteForma",
    seoDescription:
      "Artă de perete premium inspirată din moto, realizată la comandă în România. Geometrie curată, finisaj premium și adaptare custom.",
    visual: { accent: "#d2a141", glow: "#ffd56c", motif: "MOTO" },
  },
  {
    slug: "bitcoin-crest-desk-art",
    name: "Bitcoin Crest Desk Art",
    category: "crypto-trading",
    price: 129,
    shortDescription:
      "O piesă de birou pentru cei care vor ca această convingere să fie prezentă în spațiu, nu ascunsă într-un wallpaper.",
    longDescription:
      "Bitcoin Crest Desk Art este gândit pentru setup-uri curate, birouri de trading și rafturi moderne. Obiectul rămâne intenționat simplu și vizual puternic, ca să se simtă ca un collectible premium, nu ca merch crypto generic.",
    story:
      "Creat pentru oamenii care nu simt nevoia să explice de ce simbolul contează. Ei știu deja.",
    sizes: ["15 cm accent de birou", "22 cm piesă de display"],
    colors: ["Negru Mat", "Gold Accent", "Ice White"],
    materials: ["PLA Premium", "PLA Silk"],
    sizeLabel: "Dimensiune display",
    colorLabel: "Finisaj",
    materialLabel: "Material",
    leadTime: "3–7 zile lucrătoare",
    idealFor: ["Desk setup", "Studio de creator", "Birou de fondator"],
    customization: [
      "Combinații de culori disponibile la cerere",
      "Poate fi adaptat la paleta setup-ului",
      "Alte simboluri crypto sunt disponibile ca proiect custom",
    ],
    shippingNote: "Realizat la comandă în România și livrat la nivel național.",
    packagingNote: "Ambalaj premium negru, pregătit și pentru cadou.",
    seoTitle: "Bitcoin desk art premium | ArteForma",
    seoDescription:
      "Obiect de birou premium inspirat de Bitcoin, realizat la comandă în România pentru camere de trading, setup-uri și birouri moderne.",
    featured: true,
    visual: { accent: "#f2b52d", glow: "#ffe08d", motif: "BTC" },
  },
  {
    slug: "ethereum-monolith",
    name: "Ethereum Monolith",
    category: "crypto-trading",
    price: 149,
    shortDescription:
      "Un obiect mai rece și mai arhitectural, construit pentru setup-uri bazate pe linii curate și convingere pe termen lung.",
    longDescription:
      "Ethereum Monolith păstrează geometria clară și reduce zgomotul vizual la minimum. Este gândit pentru birouri și rafturi care merg spre modern, minimal și high-focus și funcționează foarte bine în interioare grayscale cu un singur accent premium.",
    story:
      "Aici nu e despre hype, ci despre gust, disciplină și convingere pe termen lung.",
    sizes: ["20 cm standard", "28 cm statement"],
    colors: ["Graphite", "Bone White", "Gold"],
    materials: ["PLA Premium", "PETG"],
    sizeLabel: "Dimensiune monolit",
    colorLabel: "Colorway",
    materialLabel: "Material",
    leadTime: "3–7 zile lucrătoare",
    idealFor: ["Desk setup", "Raft de birou", "Birou de fondator"],
    customization: [
      "Scalare custom disponibilă",
      "Forme alternative pentru bază la cerere",
      "Poate fi adaptat și pentru altă familie de simboluri",
    ],
    shippingNote: "Livrare în România cu tarif fix.",
    packagingNote: "Protejat în ambalaj rigid negru, pregătit pentru display.",
    seoTitle: "Monolit Ethereum pentru birou | ArteForma",
    seoDescription:
      "Obiect de birou premium inspirat de Ethereum, realizat la comandă în România, cu un finisaj arhitectural și minimal.",
    visual: { accent: "#cda75d", glow: "#f7e5ba", motif: "ETH" },
  },
  {
    slug: "bull-bear-market-sculpture",
    name: "Bull & Bear Market Sculpture",
    category: "crypto-trading",
    price: 229,
    shortDescription:
      "O piesă de conversație pentru traderii care vor ca spațiul lor să poarte aceeași tensiune pe care o trăiesc zilnic.",
    longDescription:
      "Această sculptură echilibrează tensiunea și simetria dintre cele două arhetipuri de piață. Este construită să aibă greutate vizuală pe raft sau pe birou fără să devină teatrală, exact de aceea funcționează bine în spații premium.",
    story:
      "Pentru birourile în care risc, disciplină și convingere fac parte din ritualul zilnic.",
    sizes: ["24 cm standard", "34 cm collector"],
    colors: ["Negru / Gold", "Graphite / White"],
    materials: ["PLA Premium", "PLA Silk", "PETG"],
    sizeLabel: "Dimensiune collector",
    colorLabel: "Paletă",
    materialLabel: "Material",
    leadTime: "3–7 zile lucrătoare",
    idealFor: ["Desk setup", "Studio de creator", "Birou de fondator"],
    customization: [
      "Perechi alternative de finisaj disponibile",
      "Poate include o bază gravată custom",
      "Versiuni mai mari pentru rafturi late sunt disponibile la cerere",
    ],
    shippingNote: "Livrare doar în România, în v1.",
    packagingNote: "Ambalaj în stil collector, cu suport intern de protecție.",
    seoTitle: "Sculptură Bull & Bear | ArteForma",
    seoDescription:
      "Sculptură premium Bull & Bear, realizată la comandă în România pentru birouri de trading, studiouri și spații executive.",
    visual: { accent: "#e0b85b", glow: "#fff0bc", motif: "BULL" },
  },
  {
    slug: "cable-dock-signature",
    name: "Cable Dock Signature",
    category: "desk-setup",
    price: 69,
    shortDescription:
      "Un cable dock care se simte ca parte dintr-un setup premium, nu ca un accesoriu ascuns în spate.",
    longDescription:
      "Cable Dock Signature este făcut pentru birouri curate, unde disciplina vizuală contează. Organizează cablurile de lucru și încărcare într-un format care se simte intenționat, rafinat și compatibil cu un setup mai high-end.",
    story:
      "Detaliile decid dacă un setup se simte terminat. Ăsta este unul dintre ele.",
    sizes: ["Single line", "Triple line"],
    colors: ["Negru", "Smoke Grey", "Stone"],
    materials: ["PLA Premium", "PETG"],
    sizeLabel: "Format dock",
    colorLabel: "Finisaj",
    materialLabel: "Material",
    personalizationLabel: "Inițiale opționale",
    leadTime: "3–7 zile lucrătoare",
    idealFor: ["Desk setup", "Studio de creator"],
    customization: [
      "Inițialele pot fi adăugate discret",
      "Numărul de sloturi poate fi adaptat",
      "Culori potrivite setup-ului disponibile la cerere",
    ],
    shippingNote: "Realizat la comandă în România.",
    packagingNote: "Ambalaj premium, sigur și potrivit pentru cadou.",
    seoTitle: "Cable dock premium pentru desk setup | ArteForma",
    seoDescription:
      "Cable dock minimalist premium, realizat la comandă în România pentru birouri, setup-uri de gaming și spații de lucru curate.",
    visual: { accent: "#a98535", glow: "#ecd18a", motif: "DOCK" },
  },
  {
    slug: "controller-display-stand",
    name: "Stand de display pentru controller",
    category: "desk-setup",
    price: 99,
    shortDescription:
      "Un stand curat pentru setup-uri în care până și accesoriile trebuie să arate intenționat.",
    longDescription:
      "Făcut pentru camere de gaming, setup-uri de streaming și stații de lucru premium, acest stand ține controllerul într-un mod care pare integrat în spațiu, nu doar lăsat temporar pe birou.",
    story:
      "Pentru oamenii care țin la cum se simte setup-ul, nu doar la ce poate face.",
    sizes: ["Standard fit", "Wide fit"],
    colors: ["Negru Mat", "Graphite", "Neon Smoke"],
    materials: ["PLA Premium", "PETG"],
    sizeLabel: "Dimensiune stand",
    colorLabel: "Finisaj",
    materialLabel: "Material",
    leadTime: "3–7 zile lucrătoare",
    idealFor: ["Desk setup", "Fundal de streaming", "Studio de creator"],
    customization: [
      "Poate include inițiale sau gamer tag scurt",
      "Culori accent alternative disponibile",
      "Poate fi adaptat pentru mai multe tipuri de controller",
    ],
    shippingNote: "Livrare în România cu tarif fix.",
    packagingNote: "Ambalare curată, în cutie neagră premium.",
    seoTitle: "Stand premium pentru controller | ArteForma",
    seoDescription:
      "Stand premium printat 3D pentru controller, realizat la comandă în România pentru setup-uri de gaming și streaming.",
    visual: { accent: "#d6a03c", glow: "#fce8a7", motif: "CTRL" },
  },
  {
    slug: "personalized-name-light-base",
    name: "Personalized Name Light Base",
    category: "gifts",
    price: 179,
    shortDescription:
      "O piesă personalizată cu impact emoțional și cu un feel premium încă din momentul în care este oferită.",
    longDescription:
      "Construită în jurul unui nume sau al unui mesaj scurt, această bază iluminată transformă un detaliu personal într-un obiect vizibil și memorabil. Funcționează foarte bine ca piesă de cadou pentru zi de naștere, aniversare sau upgrade de birou.",
    story:
      "Un cadou nu ar trebui să pară generic în secunda în care se deschide cutia. Piesa asta face exact opusul.",
    sizes: ["Small glow", "Medium signature"],
    colors: ["Negru / Warm White", "Alb / Warm White"],
    materials: ["PLA Premium", "PETG"],
    sizeLabel: "Dimensiune light",
    colorLabel: "Corp și lumină",
    materialLabel: "Material",
    personalizationLabel: "Nume / mesaj scurt",
    leadTime: "3–7 zile lucrătoare",
    idealFor: ["Cadou cu impact", "Desk setup", "Raft de birou"],
    customization: [
      "Nume sau mesaj personalizat",
      "Culori adaptate la interiorul dorit",
      "Geometrii alternative pentru bază",
    ],
    shippingNote: "Realizat la comandă în România și livrat local.",
    packagingNote: "Ambalare premium, potrivită pentru unboxing de cadou.",
    seoTitle: "Cadou personalizat cu lumină | ArteForma",
    seoDescription:
      "Bază iluminată personalizată, realizată la comandă în România. Ideală pentru cadouri, decor de birou și momente memorabile.",
    featured: true,
    visual: { accent: "#f0bc53", glow: "#fff2be", motif: "GLOW" },
  },
  {
    slug: "custom-couple-silhouette",
    name: "Custom Couple Silhouette",
    category: "gifts",
    price: 199,
    shortDescription:
      "O siluetă realizată la comandă după o fotografie reală, transformată într-un obiect personal și suficient de frumos pentru a rămâne la vedere.",
    longDescription:
      "Tu trimiți fotografia. Noi o traducem într-o siluetă mai curată, sculpturală, care păstrează emoția fără să devină încărcată vizual. Este făcută pentru aniversări, cadouri și spații personale care merită mai mult decât decor generic.",
    story:
      "Unele obiecte înseamnă mai mult tocmai pentru că pornesc dintr-un moment real. Acesta este unul dintre ele.",
    sizes: ["20 cm intim", "30 cm signature", "40 cm display"],
    colors: ["Negru", "Ivory", "Gold Accent"],
    materials: ["PLA Premium", "PLA Silk"],
    sizeLabel: "Dimensiune siluetă",
    colorLabel: "Finisaj",
    materialLabel: "Material",
    personalizationLabel: "Nume / dată",
    leadTime: "3–7 zile lucrătoare",
    idealFor: ["Cadou cu impact", "Raft de birou", "Desk setup"],
    customization: [
      "Realizat după o fotografie reală",
      "Se pot adăuga nume sau dată",
      "Scara și compoziția pot fi ajustate",
    ],
    shippingNote: "Livrare doar în România, în v1.",
    packagingNote: "Cutie premium de protecție, potrivită pentru cadou.",
    seoTitle: "Siluetă de cuplu personalizată | ArteForma",
    seoDescription:
      "Siluetă personalizată de cuplu, realizată la comandă în România după fotografia ta. Cadou premium, cu impact emoțional real.",
    visual: { accent: "#e5bd69", glow: "#fff0ca", motif: "LOVE" },
  },
  {
    slug: "viral-dragon-flex-art",
    name: "Viral Dragon Flex Art",
    category: "funny-viral",
    price: 59,
    shortDescription:
      "O versiune mai curată și mai bună de expus a dragonului articulat viral pe care oamenii chiar vor să îl țină la vedere.",
    longDescription:
      "Versiunea asta păstrează mișcarea și recognoscibilitatea pe care lumea le iubește, dar ridică finisajul, silueta și prezența culorii astfel încât să funcționeze ca obiect într-un setup premium, nu ca piesă disposable.",
    story:
      "Ce devine viral poate arăta în continuare curat și bine dacă execuția e corectă.",
    sizes: ["Small", "Medium", "XL"],
    colors: ["Black Gold", "Ice Flame", "Electric Purple"],
    materials: ["PLA Silk", "PLA Premium"],
    sizeLabel: "Dimensiune dragon",
    colorLabel: "Colorway",
    materialLabel: "Material",
    leadTime: "3–7 zile lucrătoare",
    idealFor: ["Desk setup", "Cadou cu impact", "Fundal de streaming"],
    customization: [
      "Colorway-uri alternative disponibile",
      "Versiuni mai mari pentru display la cerere",
      "Stiluri diferite de creaturi disponibile prin comandă custom",
    ],
    shippingNote: "Livrare în toată România cu tarif fix.",
    packagingNote: "Ambalat atent pentru a proteja articulațiile și mișcarea piesei.",
    seoTitle: "Dragon articulat premium | ArteForma",
    seoDescription:
      "Dragon articulat premium, realizat la comandă în România, cu colorway-uri mai bune și un finisaj mai curat pentru display.",
    featured: true,
    visual: { accent: "#d6a43f", glow: "#fee4a0", motif: "DRGN" },
  },
  {
    slug: "meme-desk-totem",
    name: "Meme Desk Totem",
    category: "funny-viral",
    price: 49,
    shortDescription:
      "Un obiect cu inside-joke pentru setup-uri care au nevoie de personalitate fără să arate ca un colț de produse ieftine.",
    longDescription:
      "Meme Desk Totem traduce umorul din internet într-un obiect de birou mai curat, cu suficient control vizual încât să stea bine într-un workspace premium sau într-un setup de content.",
    story:
      "Un obiect mic, dar cu suficientă atitudine încât să schimbe energia camerei.",
    sizes: ["Mini", "Standard"],
    colors: ["Negru", "Silver", "Acid Gold"],
    materials: ["PLA Premium"],
    sizeLabel: "Dimensiune totem",
    colorLabel: "Finisaj",
    materialLabel: "Material",
    personalizationLabel: "Text opțional",
    leadTime: "3–7 zile lucrătoare",
    idealFor: ["Desk setup", "Fundal de streaming", "Cadou cu impact"],
    customization: [
      "Mesaj scurt personalizat disponibil",
      "Culori alternative la cerere",
      "Poate fi adaptat la altă temă de inside-joke",
    ],
    shippingNote: "Livrare doar în România, în v1.",
    packagingNote: "Ambalat sigur, în packaging negru de brand.",
    seoTitle: "Obiect premium meme pentru birou | ArteForma",
    seoDescription:
      "Obiect premium inspirat din cultura meme, realizat la comandă în România, cu o execuție mai curată și opțiuni de personalizare.",
    visual: { accent: "#c8932b", glow: "#fce7a6", motif: "LOL" },
  },
  {
    slug: "custom-logo-desk-piece",
    name: "Custom Logo Desk Piece",
    category: "desk-setup",
    price: 299,
    shortDescription:
      "Un obiect premium de brand pentru fondatori, creatori și echipe care vor ca identitatea lor să fie vizibilă în spațiu.",
    longDescription:
      "Transformăm logo-ul tău într-un obiect premium de display, cu proporții echilibrate, prezență clară pe raft și finisaj potrivit pentru birouri moderne, studiouri și cadouri de brand. Este una dintre cele mai clare expresii ale ideii ArteForma: custom-first, nu ecommerce generic.",
    story:
      "Brandul tău nu ar trebui să existe doar pe ecrane. Ar trebui să ocupe și spațiul fizic.",
    sizes: ["25 cm display", "35 cm hero", "50 cm statement"],
    colors: ["Negru / Gold", "Graphite", "Alb / Gold"],
    materials: ["PLA Premium", "PETG"],
    sizeLabel: "Dimensiune logo",
    colorLabel: "Finisaj de brand",
    materialLabel: "Material",
    personalizationLabel: "Brand / slogan",
    leadTime: "3–7 zile lucrătoare",
    idealFor: ["Birou de fondator", "Raft de birou", "Studio de creator"],
    customization: [
      "Realizat pornind de la fișierele logo-ului tău",
      "Poate include slogan sau dată",
      "Gândit pentru birou, raft sau perete",
    ],
    shippingNote: "Realizat la comandă în România.",
    packagingNote: "Livrat în ambalaj rigid premium, potrivit și pentru gifting sau office reveal.",
    seoTitle: "Logo custom pentru birou | ArteForma",
    seoDescription:
      "Obiect premium de birou realizat după logo-ul tău, printat 3D și construit la comandă în România pentru birouri, studiouri și branding fizic.",
    badge: "Favorit pentru custom",
    featured: true,
    visual: { accent: "#f2c96a", glow: "#fff0c9", motif: "LOGO" },
  },
];

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getProductsByCategory(category: ProductCategory) {
  return products.filter((product) => product.category === category);
}

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getFeaturedProducts() {
  return products.filter((product) => product.featured).slice(0, 6);
}
