import { Product, ProductCategory, Category } from "@/lib/types";

export const categories: Category[] = [
  {
    slug: "auto-moto",
    name: "Auto / Moto",
    description:
      "Siluete și obiecte pentru birou, perete sau garaj, inspirate din modele auto și moto ușor de identificat.",
    hook: "Pentru pasionați care vor o piesă clară și ușor de integrat în spațiul lor.",
  },
  {
    slug: "crypto-trading",
    name: "Crypto / Trading",
    description:
      "Obiecte pentru birou și setup, construite pentru spații curate și bine controlate vizual.",
    hook: "Pentru desk setup-uri și birouri unde fiecare obiect trebuie să aibă locul lui.",
  },
  {
    slug: "desk-setup",
    name: "Birou / Setup",
    description:
      "Accente pentru birou, gaming sau studio, gândite să completeze vizual spațiul fără să îl încarce.",
    hook: "Pentru setup-uri curate, practice și coerente.",
  },
  {
    slug: "gifts",
    name: "Cadouri",
    description:
      "Piese personalizate și obiecte cu prezență bună pentru cadouri care merită să fie păstrate la vedere.",
    hook: "Pentru comenzi care merg direct spre un cadou sau o ocazie specială.",
  },
  {
    slug: "funny-viral",
    name: "Funny / Viral",
    description:
      "Idei inspirate din internet, transformate în obiecte mai curate și mai bune de expus.",
    hook: "Pentru piese cu personalitate, dar cu o prezentare mai atentă.",
  },
];

export const products: Product[] = [
  {
    slug: "porsche-911-silhouette-plaque",
    name: "Placă siluetă Porsche 911",
    category: "auto-moto",
    price: 189,
    shortDescription:
      "O piesă de perete curată, construită în jurul uneia dintre cele mai ușor de recunoscut siluete auto create vreodată.",
    longDescription:
      "Placa siluetă Porsche 911 este gândită pentru birouri, garaje și spații în care contează forma și proporția. Este ușor de recunoscut pentru omul potrivit și suficient de curată ca să stea firesc într-un birou sau într-un colț de colecționar.",
    story:
      "Pentru cei care nu au nevoie de un logo ca să recunoască forma. Piesa asta vorbește despre statut discret și gust auto transformat în obiect.",
    sizes: ["18 cm compact", "28 cm semnătură", "40 cm piesă mare"],
    colors: ["Negru Grafit", "Gri Urban", "Auriu Silk"],
    materials: ["PLA", "PLA Silk", "PETG", "ABS"],
    sizeLabel: "Dimensiune piesă",
    colorLabel: "Finisaj",
    materialLabel: "Material",
    personalizationLabel: "Text opțional pe plăcuță",
    leadTime: "2–5 zile lucrătoare",
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
      "Piesa aceasta transformă nostalgia E46 într-un obiect de birou curat și ușor de integrat. Este compactă, arhitecturală și citește bine de la distanță, ceea ce o face potrivită pentru rafturi, birouri și spații care au nevoie de un accent clar.",
    story:
      "Nu orice mașină merită să devină obiect. E46 merită, pentru că încă spune ceva oamenilor care știu.",
    sizes: ["16 cm compact", "24 cm piesă de birou"],
    colors: ["Negru Grafit", "Gri Urban", "Auriu Silk"],
    materials: ["PLA", "PETG", "ABS"],
    sizeLabel: "Dimensiune totem",
    colorLabel: "Finisaj principal",
    materialLabel: "Material",
    personalizationLabel: "Notă opțională model/an",
    leadTime: "2–5 zile lucrătoare",
    idealFor: ["Birou / setup", "Raft de birou", "Studio de creator"],
    customization: [
      "Text personalizat opțional pe bază",
      "Poate fi adaptat pentru altă generație BMW",
      "Versiuni scalate disponibile la cerere",
    ],
    shippingNote: "Livrare doar în România în v1.",
    packagingNote: "Livrat în ambalaj premium negru, cu protecție internă.",
    seoTitle: "Obiect de birou BMW E46 | ArteForma",
    seoDescription:
      "Obiect premium de birou inspirat de BMW E46, printat 3D și realizat la comandă în România pentru birouri, rafturi și setup-uri curate.",
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
      "Pentru cei care vor să păstreze energia unei motociclete sport într-un obiect curat și bine integrat.",
    sizes: ["30 cm perete", "45 cm piesă mare"],
    colors: ["Negru Grafit", "Gri Urban", "Auriu Silk"],
    materials: ["PLA", "PLA Silk", "PETG"],
    sizeLabel: "Dimensiune perete",
    colorLabel: "Finisaj",
    materialLabel: "Material",
    personalizationLabel: "Nume rider opțional",
    leadTime: "2–5 zile lucrătoare",
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
      "O piesă de birou pentru cei care vor ca simbolul să fie prezent în spațiu, nu ascuns într-un wallpaper.",
    longDescription:
      "Bitcoin Crest Desk Art este gândit pentru setup-uri curate, birouri de trading și rafturi moderne. Obiectul rămâne simplu și vizual puternic, ca să arate bine la vedere și să evite senzația de produs generic.",
    story:
      "Creat pentru oamenii care nu simt nevoia să explice de ce simbolul contează. Ei știu deja.",
    sizes: ["15 cm accent de birou", "22 cm piesă de expus"],
    colors: ["Negru Grafit", "Auriu Silk", "Alb Satinat", "Transparent Cristal"],
    materials: ["PLA", "PLA Silk", "PETG", "Transparent / translucid"],
    sizeLabel: "Dimensiune piesă",
    colorLabel: "Finisaj",
    materialLabel: "Material",
    leadTime: "2–5 zile lucrătoare",
    idealFor: ["Birou / setup", "Studio de creator", "Birou de fondator"],
    customization: [
      "Combinații de culori disponibile la cerere",
      "Poate fi adaptat la paleta setup-ului",
      "Alte simboluri crypto sunt disponibile ca proiect custom",
    ],
    shippingNote: "Realizat la comandă în România și livrat la nivel național.",
    packagingNote: "Ambalaj premium negru, pregătit și pentru cadou.",
    seoTitle: "Bitcoin desk art premium | ArteForma",
    seoDescription:
      "Obiect de birou premium inspirat de Bitcoin, realizat la comandă în România pentru camere de trading, birouri moderne și setup-uri curate.",
    featured: true,
    visual: { accent: "#f2b52d", glow: "#ffe08d", motif: "BTC" },
  },
  {
    slug: "ethereum-monolith",
    name: "Ethereum Monolith",
    category: "crypto-trading",
    price: 149,
    shortDescription:
      "Un obiect mai rece și mai arhitectural, construit pentru birouri și setup-uri bazate pe linii curate.",
    longDescription:
      "Ethereum Monolith păstrează geometria clară și reduce zgomotul vizual la minimum. Este gândit pentru birouri și rafturi care merg spre modern și minimal și funcționează bine în interioare cu un singur accent vizual clar.",
    story:
      "O piesă care funcționează bine în setup-uri moderne, curate și foarte controlate vizual.",
    sizes: ["20 cm standard", "28 cm piesă mare"],
    colors: ["Gri Urban", "Alb Satinat", "Auriu Silk"],
    materials: ["PLA", "PETG", "ABS"],
    sizeLabel: "Dimensiune monolit",
    colorLabel: "Finisaj",
    materialLabel: "Material",
    leadTime: "2–5 zile lucrătoare",
    idealFor: ["Birou / setup", "Raft de birou", "Birou de fondator"],
    customization: [
      "Scalare custom disponibilă",
      "Forme alternative pentru bază la cerere",
      "Poate fi adaptat și pentru altă familie de simboluri",
    ],
    shippingNote: "Livrare în România cu tarif fix.",
    packagingNote: "Protejat în ambalaj rigid negru, pregătit pentru expunere.",
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
      "O piesă care are sens în birouri în care dinamica pieței face deja parte din rutina zilnică.",
    sizes: ["24 cm standard", "34 cm colecționar"],
    colors: ["Negru Grafit", "Gri Urban", "Alb Satinat", "Auriu Silk"],
    materials: ["PLA", "PLA Silk", "PETG", "ABS"],
    sizeLabel: "Dimensiune colecționar",
    colorLabel: "Paletă",
    materialLabel: "Material",
    leadTime: "2–5 zile lucrătoare",
    idealFor: ["Birou / setup", "Studio de creator", "Birou de fondator"],
    customization: [
      "Perechi alternative de finisaj disponibile",
      "Poate include o bază gravată custom",
      "Versiuni mai mari pentru rafturi late sunt disponibile la cerere",
    ],
    shippingNote: "Livrare doar în România, în v1.",
    packagingNote: "Ambalaj în stil colecționar, cu suport intern de protecție.",
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
      "Un cable dock care se simte ca parte dintr-un setup bine pus la punct, nu ca un accesoriu ascuns în spate.",
    longDescription:
      "Cable Dock Signature este făcut pentru birouri curate, unde disciplina vizuală contează. Organizează cablurile de lucru și încărcare într-un format care se simte intenționat, rafinat și compatibil cu un setup mai high-end.",
    story:
      "Detaliile decid dacă un setup se simte terminat. Ăsta este unul dintre ele.",
    sizes: ["1 canal", "3 canale"],
    colors: ["Negru Grafit", "Gri Urban", "Alb Satinat"],
    materials: ["PLA", "PETG", "TPU"],
    sizeLabel: "Format dock",
    colorLabel: "Finisaj",
    materialLabel: "Material",
    personalizationLabel: "Inițiale opționale",
    leadTime: "2–5 zile lucrătoare",
    idealFor: ["Birou / setup", "Studio de creator"],
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
      "Făcut pentru camere de gaming, setup-uri de streaming și stații de lucru, acest stand ține controllerul într-un mod care pare integrat în spațiu, nu doar lăsat temporar pe birou.",
    story:
      "Pentru oamenii care țin la cum se simte setup-ul, nu doar la ce poate face.",
    sizes: ["Standard", "Lat"],
    colors: ["Negru Grafit", "Gri Urban", "Roșu Intens"],
    materials: ["PLA", "PETG", "ABS"],
    sizeLabel: "Dimensiune stand",
    colorLabel: "Finisaj",
    materialLabel: "Material",
    leadTime: "2–5 zile lucrătoare",
    idealFor: ["Birou / setup", "Fundal de streaming", "Studio de creator"],
    customization: [
      "Poate include inițiale sau un nume scurt",
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
      "O piesă personalizată cu impact emoțional, gândită să arate bine chiar din momentul în care este oferită.",
    longDescription:
      "Construită în jurul unui nume sau al unui mesaj scurt, această bază iluminată transformă un detaliu personal într-un obiect vizibil și memorabil. Funcționează foarte bine ca piesă de cadou pentru zi de naștere, aniversare sau upgrade de birou.",
    story:
      "Un cadou nu ar trebui să pară generic în secunda în care se deschide cutia. Piesa asta face exact opusul.",
    sizes: ["Mic", "Mediu"],
    colors: ["Negru Grafit", "Alb Satinat", "Transparent Cristal"],
    materials: ["PLA", "PETG", "Transparent / translucid"],
    sizeLabel: "Dimensiune light",
    colorLabel: "Corp și lumină",
    materialLabel: "Material",
    personalizationLabel: "Nume / mesaj scurt",
    leadTime: "2–5 zile lucrătoare",
    idealFor: ["Cadou cu impact", "Birou / setup", "Raft de birou"],
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
    sizes: ["20 cm intim", "30 cm semnătură", "40 cm de expus"],
    colors: ["Negru Grafit", "Alb Satinat", "Auriu Silk"],
    materials: ["PLA", "PLA Silk", "PETG"],
    sizeLabel: "Dimensiune siluetă",
    colorLabel: "Finisaj",
    materialLabel: "Material",
    personalizationLabel: "Nume / dată",
    leadTime: "2–5 zile lucrătoare",
    idealFor: ["Cadou cu impact", "Raft de birou", "Birou / setup"],
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
      "Versiunea asta păstrează mișcarea și forma pe care lumea le iubește, dar pune mai mult accent pe finisaj, siluetă și felul în care piesa arată la vedere.",
    story:
      "Ce devine viral poate arăta în continuare curat și bine dacă execuția e corectă.",
    sizes: ["Mic", "Mediu", "XL"],
    colors: ["Negru Grafit", "Auriu Silk", "Roșu Intens", "Transparent Cristal"],
    materials: ["PLA", "PLA Silk", "PETG"],
    sizeLabel: "Dimensiune dragon",
    colorLabel: "Finisaj",
    materialLabel: "Material",
    leadTime: "2–5 zile lucrătoare",
    idealFor: ["Birou / setup", "Cadou cu impact", "Fundal de streaming"],
    customization: [
      "Finisaje alternative disponibile",
      "Versiuni mai mari pentru expunere la cerere",
      "Stiluri diferite de creaturi disponibile prin comandă custom",
    ],
    shippingNote: "Livrare în toată România cu tarif fix.",
    packagingNote: "Ambalat atent pentru a proteja articulațiile și mișcarea piesei.",
    seoTitle: "Dragon articulat premium | ArteForma",
    seoDescription:
      "Dragon articulat premium, realizat la comandă în România, cu finisaje mai bine alese și un aspect mai curat pentru expunere.",
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
      "Meme Desk Totem traduce umorul din internet într-un obiect de birou mai curat, suficient de controlat vizual încât să stea bine într-un workspace sau într-un setup de content.",
    story:
      "Un obiect mic, dar cu suficientă atitudine încât să schimbe energia camerei.",
    sizes: ["Mini", "Standard"],
    colors: ["Negru Grafit", "Gri Urban", "Auriu Silk"],
    materials: ["PLA", "PETG"],
    sizeLabel: "Dimensiune totem",
    colorLabel: "Finisaj",
    materialLabel: "Material",
    personalizationLabel: "Text opțional",
    leadTime: "2–5 zile lucrătoare",
    idealFor: ["Birou / setup", "Fundal de streaming", "Cadou cu impact"],
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
      "Un obiect de brand pentru fondatori, creatori și echipe care vor ca identitatea lor să fie vizibilă în spațiu.",
    longDescription:
      "Transformăm logo-ul tău într-un obiect de expus, cu proporții echilibrate, prezență clară pe raft și finisaj potrivit pentru birouri, studiouri și cadouri de brand.",
    story:
      "Brandul tău nu ar trebui să existe doar pe ecrane. Ar trebui să ocupe și spațiul fizic.",
    sizes: ["25 cm de expus", "35 cm principal", "50 cm piesă mare"],
    colors: ["Negru Grafit", "Gri Urban", "Alb Satinat", "Auriu Silk"],
    materials: ["PLA", "PETG", "ABS"],
    sizeLabel: "Dimensiune logo",
    colorLabel: "Finisaj de brand",
    materialLabel: "Material",
    personalizationLabel: "Brand / slogan",
    leadTime: "2–5 zile lucrătoare",
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
  return products.filter((product) => product.category === category && product.enabled !== false);
}

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug && product.enabled !== false);
}

export function getFeaturedProducts() {
  return products.filter((product) => product.featured && product.enabled !== false).slice(0, 6);
}
