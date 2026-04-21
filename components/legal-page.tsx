export function LegalPage({ title, body }: { title: string; body: string }) {
  return (
    <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
      <h1 className="font-serif-display text-4xl text-white">{title}</h1>
      <p className="mt-6 text-lg leading-8 text-white/68">{body}</p>
    </div>
  );
}
