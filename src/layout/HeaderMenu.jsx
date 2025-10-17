import { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  User,
  Search,
  ShoppingCart,
  Heart,
  Menu,
  ChevronDown,
  LogIn,
  UserPlus,
} from "lucide-react";
import {
  getBrand,
  getPrimaryNav,
  getAuthConfig,
  getHeaderActions,
} from "../data/siteConfig";

export default function Header({ className = "" }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef(null);
  const [openMobileSub, setOpenMobileSub] = useState(null);

  const getNavLinkProps = (item) => {
    // Root: "/" her yerde eşleşmesin → exact
    if (item.path === "/") {
      return { exact: true, isActive: (_m, loc) => loc.pathname === "/" };
    }

    // Çocuklu menüler: alt rotalarda da aktif kalsın → startsWith
    if (Array.isArray(item.children) && item.children.length > 0) {
      return { isActive: (_m, loc) => loc.pathname.startsWith(item.path) };
    }

    // Diğerleri: tam eşleşme
    return { isActive: (_m, loc) => loc.pathname === item.path };
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const brand = getBrand();
  const nav = getPrimaryNav();
  const auth = getAuthConfig();
  const actions = getHeaderActions();

  return (
    <header className={`w-full border-b border-zinc-100 ${className}`}>
      {/* Top Bar */}
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:py-6">
        {/* Brand */}
        <Link to="/" className="h3 text-zinc-800">
          {brand.name}
        </Link>

        {/* Desktop NAV */}
        <nav className="hidden md:flex md:items-center md:gap-8">
          {nav.map((item) => {
            const hasChildren =
              Array.isArray(item.children) && item.children.length > 0;
            return (
              <div key={item.id} className="relative group">
                <NavLink
                  to={item.path}
                  {...getNavLinkProps(item)}
                  className="h6 text-[#737373] text-center"
                  activeClassName="text-zinc-900"
                >
                  <span className="inline-flex items-center gap-1">
                    {item.label}
                    {hasChildren && <ChevronDown className="h-4 w-4" />}
                  </span>
                </NavLink>

                {/* Basit dropdown (hover) */}
                {hasChildren && (
                  <div className="invisible absolute left-0 top-full z-20 translate-y-2 rounded-xl border border-zinc-100 bg-white p-2 opacity-0 shadow-lg transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 w-[480px]">
                    {/* 2 sütun grid */}
                    <div className="grid grid-cols-2 gap-2">
                      {item.children.map((sub) => (
                        <NavLink
                          key={sub.id}
                          to={sub.path}
                          {...getNavLinkProps(sub)}
                          className="block rounded-md px-3 py-2 h6 text-[#737373] hover:bg-zinc-300 text-left"
                          activeClassName="bg-zinc-50 text-zinc-900"
                        >
                          {sub.label}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="relative flex items-center gap-4">
          {/* Account */}
          {/* Desktop (md+): metinli */}
          <Link
            to={auth.login.path}
            aria-label="Account"
            className="hidden min-[920px]:inline-flex items-center gap-2 font-['Montserrat'] font-bold text-[14px] leading-[24px] tracking-[0.2px] text-[#23A6F0]"
          >
            <User className="h-4 w-4" />
            <span>{auth.combinedLabel}</span>
          </Link>

          {/* Tablet/Mobil (md-): sadece ikon + açılır menü */}
          <div className="relative hidden max-[919px]:block" ref={accountRef}>
            <button
              type="button"
              onClick={() => setAccountOpen((s) => !s)}
              aria-haspopup="menu"
              aria-expanded={accountOpen}
              aria-label="Account menu"
              className="icon-wrap" // <-- aynı kılıf
            >
              <User className="h-6 w-6 md:h-4 md:w-4 block md:text-[#23A6F0] text-black" />{" "}
              {/* <-- block */}
            </button>

            {/* Açılır menü */}
            <div
              className={`absolute right-0 mt-2 w-auto max-w-[calc(100vw-2rem)]
              rounded-2xl surface-popover elev-3 z-30
              px-2 py-3 origin-top-right
              transition duration-150 ease-out
              ${
                accountOpen
                  ? "opacity-100 visible translate-y-0 scale-100"
                  : "opacity-0 invisible -translate-y-1 scale-95"
              }`}
              role="menu"
            >
              <div className="px-3 pb-2 text-center text-[11px] font-semibold tracking-wide text-zinc-500">
                Account
              </div>

              <div className="flex flex-col gap-1">
                <Link
                  to={auth.login.path}
                  onClick={() => setAccountOpen(false)}
                  role="menuitem"
                  className="rounded-xl px-5 py-3 md:py-2.5 hover:bg-[#23A6F0]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#23A6F0]/60"
                >
                  <span className="inline-flex items-center gap-3 whitespace-nowrap text-sm font-medium text-[#737373]">
                    <LogIn className="h-4 w-4 text-[#23A6F0]" />
                    <span>Login</span>
                  </span>
                </Link>

                <Link
                  to={auth.register.path}
                  onClick={() => setAccountOpen(false)}
                  role="menuitem"
                  className="rounded-xl px-5 py-3 md:py-2.5 hover:bg-[#23A6F0]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#23A6F0]/60"
                >
                  <span className="inline-flex items-center gap-3 whitespace-nowrap text-sm font-medium text-[#737373]">
                    <UserPlus className="h-4 w-4 text-[#23A6F0]" />
                    <span>Register</span>
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Search */}
          <Link
            to={actions.routes.search}
            aria-label="Search"
            className="icon-wrap"
          >
            <Search className="h-6 w-6 md:h-4 md:w-4 block text-black md:text-[#23A6F0]" />
          </Link>

          {/* Cart */}
          <Link
            to={actions.routes.cart}
            aria-label="Cart"
            className="relative icon-wrap"
          >
            <ShoppingCart className="h-6 w-6 md:h-4 md:w-4 block text-black md:text-[#23A6F0]" />
            {actions.cartCount > 0 && (
              <span className="absolute -right-4 top-2 px-1 md:top-2 md:px-3 small">
                {actions.cartCount}
              </span>
            )}
          </Link>

          {/* Wishlist */}
          <Link
            to={actions.routes.wishlist}
            aria-label="Wishlist"
            className="relative icon-wrap"
          >
            <Heart className="h-6 w-6 md:h-4 md:w-4 block text-black md:text-[#23A6F0]" />
            {actions.wishlistCount > 0 && (
              <span className="absolute -right-4 top-2 px-1 md:top-2 md:px-3 small">
                {actions.wishlistCount}
              </span>
            )}
          </Link>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((s) => !s)}
            className="md:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile Menu (tam ekran değil, header altı açılır) */}
      <div
        className={`md:hidden transition-[max-height] duration-300 ease-in-out overflow-hidden ${
          mobileOpen ? "h-auto" : "max-h-0"
        }`}
      >
        <div className="mx-auto w-full max-w-7xl px-6 pb-6">
          {/* Menü tamamı ortalansın */}
          <div className="flex flex-col items-center gap-4">
            <nav className="flex w-full flex-col gap-3 pt-2">
              {nav.map((item) => {
                const hasChildren =
                  Array.isArray(item.children) && item.children.length > 0;
                const isOpen = openMobileSub === item.id;

                return (
                  <div key={item.id} className="w-full">
                    {/* Parent satır */}
                    {hasChildren ? (
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMobileSub((prev) =>
                            prev === item.id ? null : item.id
                          )
                        }
                        className="block w-full mobile-menu-link py-1 flex items-center justify-center gap-2"
                        aria-expanded={isOpen}
                        aria-controls={`sub-${item.id}`}
                      >
                        <span>{item.label}</span>
                        {/* ok/chevron */}
                        <ChevronDown
                          className={`h-5 w-5 transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    ) : (
                      <NavLink
                        to={item.path}
                        {...getNavLinkProps(item)}
                        className="block w-full mobile-menu-link py-1"
                        activeClassName="text-zinc-900"
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.label}
                      </NavLink>
                    )}

                    {/* Alt menü: sadece parent açıkken göster */}
                    {hasChildren && (
                      <div
                        id={`sub-${item.id}`}
                        className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
                          isOpen ? "max-h-96" : "max-h-0"
                        }`}
                      >
                        <div className="mt-1 flex flex-col items-center gap-2 pb-2">
                          {item.children.map((sub) => (
                            <NavLink
                              key={sub.id}
                              to={sub.path}
                              {...getNavLinkProps(sub)}
                              className="block w-full font-['Montserrat'] font-normal text-[20px] leading-[30px] tracking-[0.2px] text-center text-[#737373]"
                              activeClassName="text-zinc-900"
                              onClick={() => {
                                setMobileOpen(false); // tüm mobil menüyü kapa
                                setOpenMobileSub(null); // accordion’u sıfırla
                              }}
                            >
                              {sub.label}
                            </NavLink>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
