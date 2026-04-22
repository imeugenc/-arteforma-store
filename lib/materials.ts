export const materialGuide = {
  PLA: {
    title: "PLA",
    aspect: "Curat, mat sau satinat, cu un aspect foarte bun pentru obiecte de expus.",
    resistance: "Bun pentru utilizare normală în interior.",
    use: "Ideal pentru decor, piese de birou și obiecte care trebuie să arate bine la vedere.",
  },
  "PLA Silk": {
    title: "PLA Silk",
    aspect: "Mai lucios, cu efect apropiat de satin sau metal fin.",
    resistance: "Potrivit pentru obiecte decorative și piese cadou.",
    use: "Foarte bun când vrei un finisaj mai elegant și mai vizibil.",
  },
  PETG: {
    title: "PETG",
    aspect: "Curat și ușor mai tehnic ca look, dar tot potrivit pentru obiecte expuse.",
    resistance: "Mai rezistent decât PLA pentru utilizare frecventă.",
    use: "Bun pentru obiecte de birou, piese funcționale și zone unde contează durabilitatea.",
  },
  TPU: {
    title: "TPU",
    aspect: "Moale și flexibil, diferit față de materialele rigide clasice.",
    resistance: "Foarte bun când ai nevoie de flexibilitate și absorbție la contact.",
    use: "Potrivit pentru accente flexibile, protecții sau elemente care nu trebuie să fie rigide.",
  },
  ABS: {
    title: "ABS",
    aspect: "Mai sobru și mai tehnic, bun pentru piese care trebuie să pară solide.",
    resistance: "Rezistent și potrivit pentru utilizări mai solicitante.",
    use: "Bun pentru obiecte care cer mai multă rezistență și un feel mai robust.",
  },
  "Transparent / translucid": {
    title: "Transparent / translucid",
    aspect: "Ușor aerisit, cu joc de lumină și un look mai special în funcție de produs.",
    resistance: "Depinde de materialul ales la bază și de forma piesei.",
    use: "Potrivit pentru accente luminoase, piese de cadou, obiecte cu iluminare sau detalii decorative.",
  },
} as const;

export function getMaterialDetails(materials: string[]) {
  const normalized = materials.map((material) =>
    material
      .replace(" Premium", "")
      .replace(" principal", "")
      .trim(),
  );

  return normalized
    .map((material) => materialGuide[material as keyof typeof materialGuide])
    .filter(Boolean);
}
