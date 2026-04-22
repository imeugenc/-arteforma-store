import { LegalPage } from "@/components/legal-page";

export default function TermsPage() {
  return (
    <LegalPage
      title="Termeni și condiții"
      intro="Aceste informații explică pe scurt cum lucrăm la ArteForma, cum sunt procesate comenzile și ce se întâmplă în situațiile care țin de produse realizate la comandă, personalizare, livrare și eventuale neconformități."
      sections={[
        {
          title: "Despre comenzi",
          body:
            "ArteForma vinde produse din colecție și piese realizate la comandă. Multe produse sunt fabricate după plasarea comenzii, iar unele pot include opțiuni de personalizare, finisaje sau dimensiuni alese de client.",
        },
        {
          title: "Acceptarea comenzii",
          body:
            "O comandă este considerată acceptată după confirmarea plății și după verificarea internă a datelor relevante pentru producție. În cazul comenzilor personalizate, putem reveni cu întrebări sau clarificări înainte de a merge mai departe.",
        },
        {
          title: "Produse realizate la comandă",
          bullets: [
            "Produsele realizate la comandă pot avea mici variații de aspect sau finisaj față de randări, mockup-uri sau imagini de prezentare, din cauza specificului producției 3D și a materialelor folosite.",
            "Comenzile custom sunt analizate individual și sunt acceptate doar dacă pot fi realizate realist, într-o formă coerentă și potrivită pentru produsul final.",
            "Pentru piese dintr-o singură bucată, dimensiunea maximă de printare este 20 × 20 × 24 cm. Pentru obiecte mai mari, unele proiecte pot necesita construcție modulară.",
          ],
        },
        {
          title: "Personalizare și dreptul de retragere",
          body:
            "Produsele realizate la comandă sau personalizate clar pentru un anumit client nu intră, în mod obișnuit, în categoria produselor care pot fi returnate prin retragere standard, tocmai pentru că sunt fabricate special după alegerile și cerințele transmise.",
        },
        {
          title: "Dacă apare o problemă",
          bullets: [
            "Dacă produsul ajunge deteriorat în transport, diferă clar față de comanda confirmată sau există o neconformitate evidentă, te rugăm să ne scrii la contact@arteforma.ro.",
            "Analizăm fiecare situație în mod concret și, după caz, putem propune remediere, înlocuire sau altă soluție rezonabilă.",
            "Pentru o verificare rapidă, este util să ne trimiți fotografii clare și descrierea situației imediat după recepție.",
          ],
        },
        {
          title: "Timp de producție și livrare",
          bullets: [
            "Termenul uzual de producție este 2–5 zile lucrătoare, dar poate varia în funcție de complexitate, volum și finisaj.",
            "Livrarea este disponibilă în România.",
            "Fiecare comandă este pregătită atent pentru transport și livrare în siguranță.",
          ],
        },
        {
          title: "Comunicare și clarificări",
          body:
            "În cazul comenzilor custom sau al proiectelor care au nevoie de confirmări suplimentare, este important ca informațiile transmise de client să fie clare și complete. Dacă lipsesc detalii esențiale, este posibil să revenim cu întrebări înainte de producție.",
        },
        {
          title: "Date de contact",
          body:
            "Pentru întrebări legate de comandă, produse, neconformități sau proiecte personalizate, ne poți scrie la contact@arteforma.ro. Comunicarea se face în principal prin email și canalele sociale oficiale ArteForma.",
        },
      ]}
    />
  );
}
