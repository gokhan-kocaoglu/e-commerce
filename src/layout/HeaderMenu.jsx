import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectAuth, logoutThunk } from "../store/authSlice";

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
  const history = useHistory();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  // DEĞİŞİKLİK: ref’i ikiye ayırdık; tek ref iki farklı yerde kullanılıyordu.
  const accountRefAuth = useRef(null);
  const accountRefGuest = useRef(null);
  const [openMobileSub, setOpenMobileSub] = useState(null);

  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(selectAuth) ?? {};

  const handleLogout = async () => {
    try {
      await dispatch(logoutThunk()).unwrap();
    } finally {
      setAccountOpen(false);
      history.replace("/"); // logout sonrası Home'a
    }
  };

  const getNavLinkProps = (item) => {
    if (item.path === "/") {
      return { exact: true, isActive: (_m, loc) => loc.pathname === "/" };
    }
    if (Array.isArray(item.children) && item.children.length > 0) {
      return { isActive: (_m, loc) => loc.pathname.startsWith(item.path) };
    }
    return { isActive: (_m, loc) => loc.pathname === item.path };
  };

  useEffect(() => {
    function handleClickOutside(e) {
      // DEĞİŞİKLİK: iki ref’in de dışına tıklamayı kapat
      const inAuth = accountRefAuth.current?.contains(e.target);
      const inGuest = accountRefGuest.current?.contains(e.target);
      if (!inAuth && !inGuest) setAccountOpen(false);
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

                {/* Hover dropdown (2 sütun) */}
                {hasChildren && (
                  <div className="invisible absolute left-0 top-full z-20 translate-y-2 rounded-xl border border-zinc-100 bg-white p-2 opacity-0 shadow-lg transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 w-[480px]">
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
          {/* ACCOUNT */}
          {isAuthenticated ? (
            <div
              className="relative pt-1.5 md:pt-1 lg:pt-1"
              ref={accountRefAuth}
            >
              <button
                type="button"
                onClick={() => setAccountOpen((s) => !s)}
                aria-haspopup="menu"
                aria-expanded={accountOpen}
                aria-label="Account menu"
                className="inline-flex items-center gap-2"
              >
                {/* DEĞİŞİKLİK: ikon mavi eşiği min-[920px] */}
                <User className="h-6 w-6 md:h-4 md:w-4 shrink-0 block text-black min-[920px]:text-[#23A6F0]" />
                <span className="hidden min-[920px]:inline whitespace-nowrap font-['Montserrat'] font-bold text-[14px] leading-[24px] tracking-[0.2px] text-[#23A6F0]">
                  {user?.firstName ? `Hi, ${user.firstName}` : "Account"}
                </span>
              </button>

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
                    to={auth.account?.profilePath || "/account/profile"}
                    onClick={() => setAccountOpen(false)}
                    role="menuitem"
                    className="rounded-xl px-5 py-3 md:py-2.5 hover:bg-[#23A6F0]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#23A6F0]/60"
                  >
                    <span className="inline-flex items-center gap-3 whitespace-nowrap text-sm font-medium text-[#737373]">
                      <User className="h-4 w-4 text-[#23A6F0]" />
                      <span>Profile Settings</span>
                    </span>
                  </Link>

                  <Link
                    to={auth.account?.ordersPath || "/account/orders"}
                    onClick={() => setAccountOpen(false)}
                    role="menuitem"
                    className="rounded-xl px-5 py-3 md:py-2.5 hover:bg-[#23A6F0]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#23A6F0]/60"
                  >
                    <span className="inline-flex items-center gap-3 whitespace-nowrap text-sm font-medium text-[#737373]">
                      <ShoppingCart className="h-4 w-4 text-[#23A6F0]" />
                      <span>My Orders</span>
                    </span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    role="menuitem"
                    className="text-left rounded-xl px-5 py-3 md:py-2.5 hover:bg-[#23A6F0]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#23A6F0]/60 w-full"
                  >
                    <span className="inline-flex items-center gap-3 whitespace-nowrap text-sm font-medium text-[#737373]">
                      <LogIn className="h-4 w-4 rotate-180 text-[#23A6F0]" />
                      <span>Logout</span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <Link
                to={auth.login.path}
                aria-label="Account"
                className="hidden min-[920px]:inline-flex items-center gap-2 font-['Montserrat'] font-bold text-[14px] leading-[24px] tracking-[0.2px] text-[#23A6F0]"
              >
                <User className="h-4 w-4" />
                <span>{auth.combinedLabel}</span>
              </Link>

              <div
                className="relative hidden max-[919px]:block"
                ref={accountRefGuest}
              >
                <button
                  type="button"
                  onClick={() => setAccountOpen((s) => !s)}
                  aria-haspopup="menu"
                  aria-expanded={accountOpen}
                  aria-label="Account menu"
                  className="icon-wrap"
                >
                  <User className="h-6 w-6 md:h-4 md:w-4 block md:text-[#23A6F0] text-black" />
                </button>

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
            </>
          )}

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

      {/* Mobile Menu (header altı açılır) */}
      <div
        className={`md:hidden transition-[max-height] duration-300 ease-in-out overflow-hidden ${
          mobileOpen ? "h-auto" : "max-h-0"
        }`}
      >
        <div className="mx-auto w-full max-w-7xl px-6 pb-6">
          <div className="flex flex-col items-center gap-4">
            <nav className="flex w-full flex-col gap-3 pt-2">
              {nav.map((item) => {
                const hasChildren =
                  Array.isArray(item.children) && item.children.length > 0;
                const isOpen = openMobileSub === item.id;

                return (
                  <div key={item.id} className="w-full">
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
                                setMobileOpen(false);
                                setOpenMobileSub(null);
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
