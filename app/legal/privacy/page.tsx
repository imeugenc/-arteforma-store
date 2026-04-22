import { LegalPage } from "@/components/legal-page";

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Politica de confidențialitate"
      intro="ArteForma folosește datele primite prin formulare, comenzi și checkout doar în măsura necesară pentru procesarea solicitărilor, livrarea comenzilor și comunicarea legată de acestea."
      sections={[
        {
          title: "Ce date colectăm",
          bullets: [
            "Date de contact precum nume, email și telefon, atunci când trimiți o cerere custom sau finalizezi o comandă.",
            "Date despre comandă, produse, opțiuni alese și statusul plății.",
            "Fișiere de referință încărcate în formularul de comandă personalizată, dacă alegi să le trimiți.",
          ],
        },
        {
          title: "Cum folosim datele",
          bullets: [
            "Pentru a răspunde la solicitări și pentru a analiza comenzile custom.",
            "Pentru a procesa comenzile și a gestiona livrarea.",
            "Pentru a oferi clarificări sau actualizări legate de comandă, atunci când este necesar.",
          ],
        },
        {
          title: "Stocare și furnizori tehnici",
          body:
            "Datele pot fi procesate și stocate prin servicii tehnice folosite pentru operarea magazinului, inclusiv Stripe pentru checkout și Supabase pentru stocarea comenzilor și a solicitărilor custom.",
        },
        {
          title: "Solicitări legate de date",
          body:
            "Dacă vrei actualizarea sau ștergerea datelor tale, ne poți scrie la contact@arteforma.ro. Analizăm fiecare solicitare în funcție de obligațiile legale și de datele necesare pentru operarea comenzilor deja plasate.",
        },
      ]}
    />
  );
}
