import "./App.css";

function App() {
  return (
    <>
      <main className="min-h-screen w-full bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-black text-zinc-900 dark:text-zinc-100 flex items-center justify-center p-6">
        <section className="w-full max-w-3xl">
          <div className="rounded-3xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white/70 dark:bg-zinc-900/60 backdrop-blur shadow-xl">
            <div className="p-8 sm:p-12">
              <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/40 px-3 py-1 text-xs font-medium tracking-wide">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                Vite + React + Tailwind
              </p>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
                <span className="bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 bg-clip-text text-transparent">
                  E‑Commerce projesine hoş geldiniz
                </span>
              </h1>

              <p className="mt-4 max-w-prose text-zinc-600 dark:text-zinc-300">
                Bu tek sayfalık demo, Tailwind CSS yardımcı sınıflarını
                kullanır: grid, flex, spacing, border, shadow ve gradient.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button className="rounded-full px-5 py-2.5 text-sm font-medium bg-zinc-900 text-white hover:bg-zinc-800 active:scale-[.98] transition dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white">
                  Mağazayı keşfet
                </button>
                <button className="rounded-full px-5 py-2.5 text-sm font-medium border border-zinc-300 hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-600">
                  Sepetim (0)
                </button>
              </div>

              <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { k: "Hızlı", v: "Vite" },
                  { k: "Stil", v: "Tailwind" },
                  { k: "UI", v: "Tek Sayfa" },
                ].map((item) => (
                  <div
                    key={item.k}
                    className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 text-center shadow-sm bg-white/60 dark:bg-zinc-900/50"
                  >
                    <div className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      {item.k}
                    </div>
                    <div className="mt-1 text-lg font-semibold">{item.v}</div>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                  <div className="h-full w-2/3 animate-[progress_2s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500" />
                </div>
                <style>{`@keyframes progress { 0% { transform: translateX(-66%);} 50% { transform: translateX(-10%);} 100% { transform: translateX(100%);} }`}</style>
              </div>

              <footer className="mt-8 text-xs text-zinc-500 dark:text-zinc-400">
                © {new Date().getFullYear()} E‑Commerce Demo — tek sayfalık
                karşılama.
              </footer>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default App;
