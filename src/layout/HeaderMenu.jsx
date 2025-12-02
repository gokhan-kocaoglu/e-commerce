import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectAuth, logoutThunk } from "../store/authSlice";
import { clearCart } from "../store/cartSlice";
import { http } from "../lib/http";
import {
  selectWishlistItems,
  toggleWishlistItem,
} from "../store/wishlistSlice";

import {
  selectCartItems,
  selectCartCount,
  removeItem as removeCartItem,
} from "../store/cartSlice";

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

const formatMoney = (m) =>
  !m || m.amount == null ? "" : `${m.amount.toFixed(2)} ${m.currency || "USD"}`;

const toCssColor = (token) => {
  if (!token) return null;
  const t = String(token).trim();
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(t)) return t; // #fff, #ffffff
  if (/^rgba?\(/i.test(t) || /^hsla?\(/i.test(t)) return t; // rgb(), rgba(), hsl()
  return t; // "red", "blue" vs.
};

const getProductUrlFromItem = (item) => {
  if (!item) return "/shop";

  // slug kandidatları: önce item.slug, yoksa sku (ileride lazımsa)
  const slug = item.slug || item.sku;
  // productId kandidatları: önce productId, yoksa id (wishlist'ten gelen)
  const productId = item.productId || item.id;

  if (!slug || !productId) return "/shop";

  const [categorySlug, productSlug] = String(slug).split("/");
  if (!categorySlug || !productSlug) return "/shop";

  return `/product/${categorySlug}/${productSlug}?id=${productId}`;
};

export default function Header({ className = "" }) {
  const history = useHistory();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  // DEĞİŞİKLİK: ref’i ikiye ayırdık; tek ref iki farklı yerde kullanılıyordu.
  const accountRefAuth = useRef(null);
  const accountRefGuest = useRef(null);
  const [openMobileSub, setOpenMobileSub] = useState(null);
  const [wishlistOpen, setWishlistOpen] = useState(false); // Açılır menü
  const wishlistRef = useRef(null); // Açılır menü referansı

  const cartRef = useRef(null);
  const [cartOpen, setCartOpen] = useState(false);

  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(selectAuth) ?? {};

  const wishlistItems = useSelector(selectWishlistItems);
  const wishlistCount = wishlistItems.length;

  const cartItems = useSelector(selectCartItems);
  const cartCount = useSelector(selectCartCount);

  const handleLogout = async () => {
    try {
      await dispatch(logoutThunk()).unwrap();
    } finally {
      // 🔹 Guest'e döndüğü an localStorage cart'ı sıfırla
      dispatch(clearCart());
      setAccountOpen(false);
      history.replace("/");
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
      const inWishlist = wishlistRef.current?.contains(e.target);
      const inCart = cartRef.current?.contains(e.target);
      if (!inAuth && !inGuest) {
        setAccountOpen(false);
      }
      if (!inWishlist) {
        setWishlistOpen(false);
      }
      if (!inCart) setCartOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const brand = getBrand();
  const nav = getPrimaryNav();
  const auth = getAuthConfig();
  const actions = getHeaderActions();
  const cartRoute = actions.routes.cart || "/cart";
  const checkoutRoute = actions.routes.checkout || "/checkout";

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
          <div className="relative" ref={cartRef}>
            <button
              type="button"
              aria-label="Cart"
              onClick={() => setCartOpen((s) => !s)}
              className="relative icon-wrap"
            >
              <ShoppingCart className="h-6 w-6 md:h-4 md:w-4 block text-black md:text-[#23A6F0]" />
              {cartCount > 0 && (
                <span className="absolute -right-4 top-2 px-1 md:top-2 md:px-3 small">
                  {cartCount}
                </span>
              )}
            </button>

            <div
              className={`absolute right-0 mt-2 w-[340px] max-w-[calc(100vw-2rem)]
      rounded-2xl surface-popover elev-3 z-30
      px-3 py-3 origin-top-right
      transition duration-150 ease-out
      ${
        cartOpen
          ? "opacity-100 visible translate-y-0 scale-100"
          : "opacity-0 invisible -translate-y-1 scale-95"
      }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">
                  My Cart
                </span>
                {cartCount > 0 && (
                  <span className="text-xs text-zinc-400">
                    ({cartCount} item{cartCount !== 1 ? "s" : ""})
                  </span>
                )}
              </div>

              {/* BOŞ STATE */}
              {cartCount === 0 && (
                <div className="py-6 text-center">
                  <p className="font-['Montserrat'] text-[13px] leading-[20px] tracking-[0.2px] text-[#737373]">
                    Your cart is currently empty.
                  </p>
                </div>
              )}

              {/* LİSTE */}
              {cartCount > 0 && (
                <>
                  <ul className="max-h-96 overflow-y-auto">
                    {cartItems.map((item, idx) => {
                      const href = getProductUrlFromItem(item);
                      const qty = item.quantity || 1;

                      const handleRemove = async () => {
                        try {
                          // Kullanıcı login ise BE tarafında da sil
                          if (isAuthenticated) {
                            await http.delete(
                              `/api/cart/items/${item.variantId}`
                            );
                          }

                          // Her durumda local state / redux sepetini güncelle
                          dispatch(removeCartItem(item.variantId));
                          // İstersen küçük bir info toast da atabilirsin:
                          // toast.info("Item removed from cart");
                        } catch (err) {
                          // Hata durumunda interceptor zaten toast basıyor.
                          // Eğer istersen burada da loglayabilirsin:
                          // console.error("Cart item delete failed", err);
                        }
                      };

                      return (
                        <li key={item.variantId} className="py-3">
                          <div className="flex gap-3">
                            {/* Thumbnail */}
                            {item.thumbnailUrl ? (
                              <Link
                                to={href}
                                className="block h-16 w-16 shrink-0 overflow-hidden rounded bg-zinc-100"
                              >
                                <img
                                  src={item.thumbnailUrl}
                                  alt={item.title}
                                  className="h-full w-full object-cover object-center"
                                />
                              </Link>
                            ) : (
                              <Link
                                to={href}
                                className="block h-16 w-16 shrink-0 rounded bg-zinc-100"
                              />
                            )}

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <Link
                                  to={href}
                                  className="line-clamp-2 text-sm font-semibold text-[#252B42]"
                                >
                                  {item.title}
                                </Link>
                                <button
                                  type="button"
                                  onClick={handleRemove}
                                  className="ml-1 text-xs text-zinc-400 hover:text-zinc-600"
                                  aria-label="Remove from cart"
                                >
                                  ✕
                                </button>
                              </div>

                              {/* Variant bilgisi */}
                              <p className="mt-1 text-[11px] text-[#737373]">
                                {item.size && (
                                  <>
                                    Size:{" "}
                                    <span className="font-medium">
                                      {item.size}
                                    </span>
                                  </>
                                )}
                                {item.color && (
                                  <>
                                    {" "}
                                    &nbsp; Color:{" "}
                                    <span className="inline-flex items-center gap-1 mt-[-2px] align-middle">
                                      {/* Renk dairesi */}
                                      <span
                                        className="inline-block h-3 w-3 rounded-full border border-black/10"
                                        style={{
                                          backgroundColor: toCssColor(
                                            item.color
                                          ),
                                        }}
                                      />

                                      {/* <span className="font-medium">{item.color}</span> */}
                                    </span>
                                  </>
                                )}
                                {"  "}
                                <span className="ml-2">
                                  Qty:{" "}
                                  <span className="font-medium">{qty}</span>
                                </span>
                              </p>

                              <div className="mt-1 text-sm font-semibold text-[#23A6F0]">
                                {formatMoney(item.price)}
                              </div>
                            </div>
                          </div>

                          {idx < cartItems.length - 1 && (
                            <hr className="mt-3 border-t border-[#E4E4E4]" />
                          )}
                        </li>
                      );
                    })}
                  </ul>

                  {/* Footer butonları */}
                  <div className="mt-3 border-t border-[#E4E4E4] pt-3 flex gap-2">
                    <Link
                      to={cartRoute}
                      onClick={() => setCartOpen(false)}
                      className="flex-1 h-9 inline-flex items-center justify-center rounded-[4px] border border-[#23A6F0] bg-white text-[12px] font-['Montserrat'] font-semibold leading-[18px] tracking-[0.2px] text-[#23A6F0] hover:bg-[#23A6F0]/5"
                    >
                      Go to cart
                    </Link>
                    <Link
                      to={checkoutRoute}
                      onClick={() => setCartOpen(false)}
                      className="flex-1 h-9 inline-flex items-center justify-center rounded-[4px] bg-[#23A6F0] text-[12px] font-['Montserrat'] font-bold leading-[18px] tracking-[0.2px] text-white hover:bg-[#031c49]"
                    >
                      Checkout
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Wishlist */}
          <div className="relative" ref={wishlistRef}>
            <button
              type="button"
              aria-label="Wishlist"
              onClick={() => setWishlistOpen((s) => !s)}
              className="relative icon-wrap"
            >
              <Heart className="h-6 w-6 md:h-4 md:w-4 block text-black md:text-[#23A6F0]" />
              {wishlistCount > 0 && (
                <span className="absolute -right-4 top-2 px-1 md:top-2 md:px-3 small">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Panel */}
            <div
              className={`absolute right-0 mt-2 w-[320px] max-w-[calc(100vw-2rem)]
      rounded-2xl surface-popover elev-3 z-30
      px-3 py-3 origin-top-right
      transition duration-150 ease-out
      ${
        wishlistOpen
          ? "opacity-100 visible translate-y-0 scale-100"
          : "opacity-0 invisible -translate-y-1 scale-95"
      }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">
                  Favorites
                </span>
                {wishlistCount > 0 && (
                  <span className="text-xs text-zinc-400">
                    {wishlistCount} item{wishlistCount > 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {/* BOŞ STATE */}
              {wishlistCount === 0 && (
                <div className="py-6 text-center">
                  <p className="font-['Montserrat'] text-[13px] leading-[20px] tracking-[0.2px] text-[#737373]">
                    There are currently no products in your favorites.
                  </p>
                </div>
              )}

              {/* LİSTE */}
              {wishlistCount > 0 && (
                <ul className="max-h-96 overflow-y-auto">
                  {wishlistItems.map((item, idx) => {
                    const href = getProductUrlFromItem(item);

                    const handleRemove = () => {
                      // item shape’i wishlistSlice'a push ettiğin ile aynı
                      dispatch(toggleWishlistItem(item));
                    };

                    const handleAddToCart = () => {
                      // 🔹 Burayı kendi cartSlice’ına göre uyarlayacaksın
                      // örn: dispatch(addToCart({ productId: item.id, quantity: 1 }))
                      console.log("Sepete ekle:", item);
                    };

                    return (
                      <li key={item.id} className="py-3">
                        <div className="flex gap-3">
                          {/* Thumbnail */}
                          {item.thumbnailUrl ? (
                            <Link
                              to={href}
                              className="block h-16 w-16 shrink-0 overflow-hidden rounded bg-zinc-100"
                            >
                              <img
                                src={item.thumbnailUrl}
                                alt={item.title}
                                className="h-full w-full object-cover object-center"
                              />
                            </Link>
                          ) : (
                            <Link
                              to={href}
                              className="block h-16 w-16 shrink-0 rounded bg-zinc-100"
                            />
                          )}

                          {/* Info + actions */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <Link
                                to={href}
                                className="line-clamp-2 text-sm font-semibold text-[#252B42]"
                              >
                                {item.title}
                              </Link>

                              <button
                                type="button"
                                onClick={handleRemove}
                                className="ml-1 text-xs text-zinc-400 hover:text-zinc-600"
                                aria-label="Remove from wishlist"
                              >
                                ✕
                              </button>
                            </div>

                            <div className="mt-1 text-xs font-medium text-[#23A6F0]">
                              {formatMoney(item.price)}
                              {item.compareAtPrice?.amount != null &&
                                item.compareAtPrice.amount >
                                  item.price?.amount && (
                                  <span className="ml-1 text-[11px] text-[#BDBDBD] line-through">
                                    {formatMoney(item.compareAtPrice)}
                                  </span>
                                )}
                            </div>

                            <button
                              type="button"
                              onClick={handleAddToCart}
                              className="mt-2 inline-flex h-8 items-center justify-center rounded-[4px] bg-[#23A6F0] px-3 text-[11px] font-['Montserrat'] font-bold leading-[16px] tracking-[0.2px] text-white hover:bg-[#1b87cc]"
                            >
                              Add to cart
                            </button>
                          </div>
                        </div>

                        {/* Alt çizgi (son eleman hariç) */}
                        {idx < wishlistItems.length - 1 && (
                          <hr className="mt-3 border-t border-[#E4E4E4]" />
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

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
