import { LegalPage } from "@/components/legal-page";

export default function ShippingPage() {
  return (
    <LegalPage
      title="Livrare și retur"
      intro="Mai jos găsești clarificările de bază despre producție, livrare, ambalare și situațiile în care o comandă poate fi analizată pentru remediere sau înlocuire."
      sections={[
        {
          title: "Producție",
          bullets: [
            "Majoritatea comenzilor intră în producție în 2–5 zile lucrătoare.",
            "Pentru piese personalizate, produse cu ajustări speciale sau perioade mai aglomerate, termenul poate varia ușor.",
            "Dacă există o schimbare relevantă de termen, revenim cu o actualizare înainte de finalizare.",
          ],
        },
        {
          title: "Livrare",
          bullets: [
            "Livrarea este disponibilă în România.",
            "Costul de transport este afișat clar în coș și în checkout, iar pentru comenzile peste pragul activ se aplică livrare gratuită.",
            "Fiecare comandă este pregătită atent pentru transport și livrare în siguranță.",
          ],
        },
        {
          title: "Ambalare premium",
          body:
            "Ambalarea premium este o opțiune separată care poate fi adăugată în fluxul de comandă. Este potrivită pentru cadouri sau pentru o prezentare mai atentă, dar nu înlocuiește grija standard pentru protejarea produsului în transport.",
        },
        {
          title: "Retur și retragere",
          body:
            "Produsele realizate la comandă sau personalizate în mod clar pentru client nu sunt, în general, eligibile pentru retragere standard. Dacă însă produsul ajunge deteriorat, greșit sau neconform cu ceea ce a fost confirmat, analizăm situația și putem propune o soluție de remediere sau înlocuire.",
        },
        {
          title: "Cum ne contactezi",
          body:
            "Pentru orice situație legată de livrare, produs greșit, daună sau clarificări înainte și după expediere, ne poți scrie la contact@arteforma.ro.",
        },
      ]}
    />
  );
}
