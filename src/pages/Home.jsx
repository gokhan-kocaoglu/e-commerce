import Header from "../components/Header";

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-[60vh]">
        <section className="mx-auto max-w-7xl px-4 py-10">
          <h1 className="text-2xl font-semibold">Home</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-300">
            Ana sayfa içerikleri burada yer alacak.
          </p>
        </section>
      </main>
    </>
  );
}
