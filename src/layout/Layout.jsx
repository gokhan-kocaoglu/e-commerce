import Header from "../layout/Header";
import HeaderMenu from "../layout/HeaderMenu";
import Footer from "../layout/Footer";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Header />
      <HeaderMenu />
      {/* Global container: max-w-6xl */}
      <main id="main" className="mx-auto w-full max-w-7xl">
        {children}
      </main>
      <Footer className="py-12" />
    </div>
  );
}
