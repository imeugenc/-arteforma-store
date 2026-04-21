"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";

const orderTypes = [
  "Artă de perete",
  "Decor de birou",
  "Logo",
  "Cadou",
  "Lampă",
  "Moto / Auto",
  "Altceva",
];

export function CustomOrderForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(formData: FormData) {
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/custom-orders", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as {
        ok: boolean;
        message?: string;
      };

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Solicitarea nu a putut fi trimisă.");
      }

      setStatus("success");
      setMessage(
        data.message ||
          "Solicitarea ta a fost trimisă. O analizăm manual și revenim cu următorul pas.",
      );
      void trackEvent("custom_order_submit", {
        type: formData.get("type"),
      });
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "A apărut o problemă. Încearcă din nou sau contactează-ne direct.",
      );
    }
  }

  return (
    <form
      action={onSubmit}
      className="surface-panel grid gap-5 rounded-[2rem] p-6 sm:grid-cols-2 sm:p-8"
    >
      <Field label="Nume" name="name" required />
      <Field label="Email" name="email" type="email" required />
      <Field label="Telefon (opțional)" name="phone" />
      <SelectField label="Ce vrei să realizăm?" name="type" options={orderTypes} required />
      <Field
        label="Dimensiune dorită"
        name="desiredSize"
        placeholder="Exemplu: piesă de birou de 30 cm sau obiect de perete de 50 cm"
      />
      <Field
        label="Culori / finisaj"
        name="colors"
        placeholder="Negru + auriu, grafit, negru mat etc."
      />
      <Field
        label="Buget (opțional)"
        name="budget"
        placeholder="Util dacă vrei să te ghidăm spre direcția potrivită"
      />
      <Field
        label="Termen limită (opțional)"
        name="deadline"
        placeholder="Dacă timpul contează, spune-ne aici"
      />
      <label className="sm:col-span-2">
        <span className="mb-2 block text-sm font-medium text-white">Descrie obiectul</span>
        <textarea
          name="description"
          required
          rows={6}
          className="w-full rounded-[1.5rem] border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-[#d7a12a]/40"
          placeholder="Cum ar trebui să arate? Unde va sta? Ce prezență sau emoție ar trebui să transmită? Cu cât brief-ul este mai clar, cu atât rezultatul va fi mai bun."
        />
      </label>
      <label className="sm:col-span-2">
        <span className="mb-2 block text-sm font-medium text-white">Fișier de referință</span>
        <input
          type="file"
          name="file"
          className="w-full rounded-[1.5rem] border border-dashed border-white/15 bg-black/20 px-4 py-4 text-sm text-white/70 file:mr-4 file:rounded-full file:border-0 file:bg-[#d7a12a] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black"
        />
        <p className="mt-2 text-xs leading-6 text-white/38">
          Logo-urile, screenshot-urile, schițele sau imaginile de inspirație ne ajută să revenim mai repede cu o estimare clară.
        </p>
      </label>
      <div className="sm:col-span-2 rounded-[1.5rem] border border-[#d7a12a]/14 bg-[#d7a12a]/6 p-4 text-sm leading-7 text-white/65">
        <p>Fiecare solicitare este analizată manual înainte să revenim cu un răspuns.</p>
        <p>Realizat la comandă în România. Finisaj premium. Pași clari mai departe.</p>
      </div>
      <div className="sm:col-span-2 flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-white/55">
          Livrare doar în România în v1. Răspundem cu direcție clară, nu cu mesaje automate fără sens.
        </p>
        <Button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Trimitem solicitarea..." : "Trimite brief-ul custom"}
        </Button>
      </div>
      {message ? (
        <p
          className={`sm:col-span-2 text-sm ${status === "success" ? "text-[#e8d08b]" : "text-red-300"}`}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label>
      <span className="mb-2 block text-sm font-medium text-white">{label}</span>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-[1.5rem] border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-[#d7a12a]/40"
      />
    </label>
  );
}

function SelectField({
  label,
  name,
  options,
  required,
}: {
  label: string;
  name: string;
  options: string[];
  required?: boolean;
}) {
  return (
    <label>
      <span className="mb-2 block text-sm font-medium text-white">{label}</span>
      <select
        name={name}
        required={required}
        className="w-full rounded-[1.5rem] border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-[#d7a12a]/40"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
