import React, { useEffect, useState } from "react";

import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  ListItemButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";

import {
  AccountCircle,
  AddShoppingCart,
  FavoriteBorder,
  Storefront,
  Close,
  PersonOutlineOutlined,
  ReceiptLongOutlined,
  LocationOnOutlined,
  LogoutOutlined,
  HomeOutlined,
} from "@mui/icons-material";

import axios from "axios";

import CategorySheet from "./CategorySheet";
import { mainCategory } from "../../../data/category/mainCategory";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:5454";

const Navbar = () => {
  const theme = useTheme();

  const isLarge = useMediaQuery(
    theme.breakpoints.up("lg")
  );

  const navigate = useNavigate();

  const [showCategorySheet, setShowCategorySheet] =
    useState(false);

  const [selectedCategory, setSelectedCategory] =
    useState("men");

  const [mobileMenu, setMobileMenu] =
    useState(false);

  const [search, setSearch] = useState("");

  const [profileAnchor, setProfileAnchor] =
    useState<HTMLElement | null>(null);

  const [cartCount, setCartCount] = useState(0);

  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("jwt"))
  );

  /* =====================================================
     USER AVATAR
  ===================================================== */

  const getUserName = () => {
    try {
      const user = localStorage.getItem("user");

      if (!user) {
        return "A";
      }

      const parsedUser = JSON.parse(user);

      const name =
        parsedUser?.fullName ||
        parsedUser?.name ||
        parsedUser?.firstName ||
        "A";

      return String(name)
        .trim()
        .charAt(0)
        .toUpperCase();
    } catch {
      return "A";
    }
  };

  /* =====================================================
     CART COUNT
  ===================================================== */

  const fetchCartCount = async () => {
    const jwt = localStorage.getItem("jwt");

    if (!jwt) {
      setCartCount(0);
      return;
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/cart`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      const cart = response.data;

      const items = Array.isArray(
        cart?.cartItems
      )
        ? cart.cartItems
        : [];

      const count = items.reduce(
        (total: number, item: any) =>
          total + Number(item?.quantity || 0),
        0
      );

      setCartCount(count);
    } catch (error) {
      console.error(
        "Unable to fetch cart count:",
        error
      );

      setCartCount(0);
    }
  };

  /* =====================================================
     LOGIN STATE
  ===================================================== */

  useEffect(() => {
    const updateState = () => {
      setIsLoggedIn(
        Boolean(localStorage.getItem("jwt"))
      );

      fetchCartCount();
    };

    updateState();

    window.addEventListener(
      "storage",
      updateState
    );

    window.addEventListener(
      "cart-updated",
      fetchCartCount
    );

    return () => {
      window.removeEventListener(
        "storage",
        updateState
      );

      window.removeEventListener(
        "cart-updated",
        fetchCartCount
      );
    };
  }, []);

  /* =====================================================
     SEARCH
  ===================================================== */

  const handleSearch = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const value = search.trim();

    if (!value) {
      return;
    }

    navigate(
      `/search?query=${encodeURIComponent(value)}`
    );

    setMobileMenu(false);
  };

  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    setIsLoggedIn(false);
    setProfileAnchor(null);
    setMobileMenu(false);
    setCartCount(0);

    navigate("/");
  };

  /* =====================================================
     ACCOUNT MENU
  ===================================================== */

  const handleAccountClick = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setProfileAnchor(event.currentTarget);
  };

  const closeAccountMenu = () => {
    setProfileAnchor(null);
  };

  /* =====================================================
     CATEGORY
  ===================================================== */

  const handleCategoryClick = (
    categoryId: string
  ) => {
    setSelectedCategory(categoryId);
    setShowCategorySheet(false);
    setMobileMenu(false);

    navigate(`/products/${categoryId}`);
  };

  /* =====================================================
     HOME
  ===================================================== */

  const goHome = () => {
    setMobileMenu(false);
    setShowCategorySheet(false);
    navigate("/");
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  };

  /* =====================================================
     ALL PRODUCTS
  ===================================================== */

  const handleAllProductsClick = () => {
    setMobileMenu(false);
    setShowCategorySheet(false);
    setSelectedCategory("all");

    navigate("/products");

    // Always open All Products from the top of the page.
    window.setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });
    }, 0);
  };

  return (
    <>
      {/* =================================================
          MAIN NAVBAR
      ================================================= */}

      <Box
        className="sticky top-0 left-0 right-0 bg-white"
        sx={{
          zIndex: 1200,
          boxShadow:
            "0 1px 10px rgba(16,24,40,0.08)",
        }}
      >
        {/* Festive offer ticker */}
        <style>{`
          @keyframes amarBazaarMarquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .amar-bazaar-marquee {
            animation: amarBazaarMarquee 28s linear infinite;
          }
          .amar-bazaar-marquee:hover {
            animation-play-state: paused;
          }
          @media (prefers-reduced-motion: reduce) {
            .amar-bazaar-marquee { animation: none; }
          }
        `}</style>
        {/* Diwali lights + festive offer ticker */}
        <div className="relative overflow-hidden border-b border-amber-300/30 bg-gradient-to-r from-[#301047] via-[#641b36] to-[#8b2c20] text-white">
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 flex justify-around text-[12px] leading-none opacity-90">
            {["✨","🪔","💡","✨","🏮","💡","🪔","✨","💡","🏮","✨","🪔"].map((light, i) => (
              <span key={i} className="amar-bazaar-light inline-block">{light}</span>
            ))}
          </div>
          <div className="amar-bazaar-marquee flex w-max items-center py-3 pt-4 text-[11px] font-bold tracking-[.09em] sm:text-xs">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 items-center uppercase">
                <span className="px-5 text-amber-200">🪔 Diwali Dhamaka 2026</span>
                <span className="text-amber-200/60">✦</span>
                <span className="px-5">🎆 Celebrate the Festival of Lights</span>
                <span className="text-amber-200/60">✦</span>
                <span className="px-5">🏮 Akash Kandil · Diyas · Festive Finds</span>
                <span className="text-amber-200/60">✦</span>
                <span className="px-5">🎇 Discover gifts, fashion & home essentials</span>
                <span className="text-amber-200/60">✦</span>
                <span className="px-5">✨ Shop Amar Bazaar</span>
              </div>
            ))}
          </div>
          <style>{`
            @keyframes amarBazaarTwinkle {
              0%, 100% { opacity: .55; transform: translateY(0); }
              50% { opacity: 1; transform: translateY(2px); }
            }
            .amar-bazaar-light { animation: amarBazaarTwinkle 1.8s ease-in-out infinite; }
            .amar-bazaar-light:nth-child(3n) { animation-delay: .4s; }
            .amar-bazaar-light:nth-child(3n + 1) { animation-delay: .8s; }
            @media (prefers-reduced-motion: reduce) {
              .amar-bazaar-light { animation: none; }
            }
          `}</style>
        </div>

        {/* =================================================
            TOP NAV
        ================================================= */}

        <div
          className="
            flex
            items-center
            justify-between
            px-3
            sm:px-4
            md:px-8
            lg:px-12
            xl:px-16
            h-[64px]
            lg:h-[72px]
            gap-2
            lg:gap-4
          "
        >
          {/* =================================================
              LOGO
          ================================================= */}

          <div
            className="
              flex
              items-center
              gap-1
              sm:gap-2
              flex-shrink-0
            "
          >
            {!isLarge && (
              <IconButton
                onClick={() =>
                  setMobileMenu(
                    (prev) => !prev
                  )
                }
                size="small"
                aria-label="Menu"
              >
                {mobileMenu ? (
                  <Close />
                ) : (
                  <MenuIcon />
                )}
              </IconButton>
            )}

            <div
              onClick={goHome}
              className="
                cursor-pointer
                select-none
              "
            >
              <h1
                className="
                  m-0
                  text-[18px]
                  sm:text-xl
                  md:text-2xl
                  font-black
                  tracking-tight
                  bg-gradient-to-r
                  from-blue-600
                  via-indigo-600
                  to-purple-600
                  bg-clip-text
                  text-transparent
                  whitespace-nowrap
                "
              >
                Amar Bazaar
              </h1>
            </div>
          </div>

          {/* =================================================
              DESKTOP SEARCH
          ================================================= */}

          {isLarge ? (
            <form
              onSubmit={handleSearch}
              className="
                flex
                items-center
                flex-1
                max-w-[560px]
                mx-3
                xl:mx-8
                h-[44px]
                rounded-xl
                border
                border-gray-200
                bg-gray-50
                overflow-hidden
                transition-all
                focus-within:border-blue-400
                focus-within:bg-white
                focus-within:shadow-sm
              "
            >
              <SearchIcon
                sx={{
                  ml: 1.8,
                  color: "#667085",
                  fontSize: 21,
                }}
              />

              <InputBase
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search products, brands and more..."
                className="flex-1 px-3"
                sx={{
                  fontSize: "14px",
                }}
              />

              {search && (
                <IconButton
                  type="button"
                  size="small"
                  onClick={() =>
                    setSearch("")
                  }
                  sx={{
                    mr: 0.5,
                    color: "#98A2B3",
                  }}
                >
                  <Close
                    sx={{
                      fontSize: 18,
                    }}
                  />
                </IconButton>
              )}

              <Button
                type="submit"
                variant="contained"
                sx={{
                  height: "100%",
                  minWidth: 82,
                  borderRadius: 0,
                  textTransform: "none",
                  fontWeight: 700,
                  boxShadow: "none",
                }}
              >
                Search
              </Button>
            </form>
          ) : (
            <IconButton
              onClick={() =>
                setMobileMenu(true)
              }
              aria-label="Search"
            >
              <SearchIcon />
            </IconButton>
          )}

          {/* =================================================
              RIGHT ACTIONS
          ================================================= */}

          <div
            className={`
              ${isLarge ? "flex" : "hidden"}
              items-center
              gap-0
              sm:gap-1
              md:gap-2
            `}
          >
            {/* =================================================
                ACCOUNT
            ================================================= */}

            {isLoggedIn ? (
              <>
                <Button
                  onClick={
                    handleAccountClick
                  }
                  sx={{
                    minWidth: "auto",
                    padding: "4px 6px",
                    borderRadius: 2,
                  }}
                >
                  <Avatar
                    sx={{
                      width: {
                        xs: 31,
                        md: 34,
                      },
                      height: {
                        xs: 31,
                        md: 34,
                      },
                      bgcolor: "#1769ff",
                      fontSize: 14,
                      fontWeight: 800,
                    }}
                  >
                    {getUserName()}
                  </Avatar>

                  {isLarge && (
                    <span
                      className="
                        ml-2
                        text-sm
                        font-bold
                        text-gray-800
                      "
                    >
                      Account
                    </span>
                  )}
                </Button>

                {/* =================================================
                    ACCOUNT MENU
                ================================================= */}

                <Menu
                  anchorEl={profileAnchor}
                  open={Boolean(
                    profileAnchor
                  )}
                  onClose={
                    closeAccountMenu
                  }
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  slotProps={{
                    paper: {
                      sx: {
                        mt: 1,
                        minWidth: 230,
                        borderRadius: 3,
                        border:
                          "1px solid #eef0f4",
                        boxShadow:
                          "0 14px 40px rgba(16,24,40,0.14)",
                        overflow: "hidden",
                      },
                    },
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      closeAccountMenu();

                      navigate(
                        "/account/profile"
                      );
                    }}
                    sx={{
                      py: 1.4,
                      px: 2,
                      fontSize: 14,
                    }}
                  >
                    <PersonOutlineOutlined
                      sx={{
                        mr: 1.5,
                        fontSize: 20,
                        color: "#667085",
                      }}
                    />

                    My Profile
                  </MenuItem>

                  <MenuItem
                    onClick={() => {
                      closeAccountMenu();

                      navigate(
                        "/account/orders"
                      );
                    }}
                    sx={{
                      py: 1.4,
                      px: 2,
                      fontSize: 14,
                    }}
                  >
                    <ReceiptLongOutlined
                      sx={{
                        mr: 1.5,
                        fontSize: 20,
                        color: "#667085",
                      }}
                    />

                    My Orders
                  </MenuItem>

                  <MenuItem
                    onClick={() => {
                      closeAccountMenu();

                      navigate(
                        "/account/addresses"
                      );
                    }}
                    sx={{
                      py: 1.4,
                      px: 2,
                      fontSize: 14,
                    }}
                  >
                    <LocationOnOutlined
                      sx={{
                        mr: 1.5,
                        fontSize: 20,
                        color: "#667085",
                      }}
                    />

                    My Addresses
                  </MenuItem>

                  <Divider />

                  <MenuItem
                    onClick={handleLogout}
                    sx={{
                      py: 1.4,
                      px: 2,
                      fontSize: 14,
                      color: "#d92d20",
                    }}
                  >
                    <LogoutOutlined
                      sx={{
                        mr: 1.5,
                        fontSize: 20,
                      }}
                    />

                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                variant="contained"
                startIcon={
                  <AccountCircle />
                }
                onClick={() =>
                  navigate("/login")
                }
                sx={{
                  display: {
                    xs: "none",
                    sm: "flex",
                  },
                  textTransform: "none",
                  borderRadius: 2,
                  px: 2,
                  fontWeight: 700,
                  boxShadow: "none",
                }}
              >
                Login
              </Button>
            )}

            {/* =================================================
                WISHLIST
            ================================================= */}

            <IconButton
              onClick={() =>
                navigate("/wishlist")
              }
              aria-label="Wishlist"
              sx={{
                width: 42,
                height: 42,
              }}
            >
              <Badge
                color="error"
                invisible
                badgeContent={0}
              >
                <FavoriteBorder
                  sx={{
                    fontSize: {
                      xs: 23,
                      md: 26,
                    },
                    color: "#344054",
                  }}
                />
              </Badge>
            </IconButton>

            {/* =================================================
                CART
            ================================================= */}

            <IconButton
              onClick={() =>
                navigate("/cart")
              }
              aria-label="Cart"
              sx={{
                width: 42,
                height: 42,
              }}
            >
              <Badge
                badgeContent={cartCount}
                color="error"
                invisible={
                  cartCount === 0
                }
              >
                <AddShoppingCart
                  sx={{
                    fontSize: {
                      xs: 23,
                      md: 26,
                    },
                    color: "#344054",
                  }}
                />
              </Badge>
            </IconButton>

            {/* =================================================
                SELLER
            ================================================= */}

            {isLarge && (
              <Button
                onClick={() =>
                  navigate(
                    "/become-seller"
                  )
                }
                startIcon={
                  <Storefront />
                }
                variant="outlined"
                sx={{
                  ml: 1,
                  textTransform: "none",
                  borderRadius: 2,
                  fontWeight: 700,
                  px: 1.8,
                }}
              >
                Become a Seller
              </Button>
            )}
          </div>
        </div>

        {/* =====================================================
            DESKTOP CATEGORY BAR
        ===================================================== */}

        {isLarge && (
          <div
            className="
              border-t
              border-gray-100
              bg-white
            "
          >
            <ul
              className="
                flex
                justify-center
                items-center
                h-[54px]
                gap-1
                m-0
                p-0
                list-none
              "
            >
              <li
                onClick={goHome}
                className="
                  cursor-pointer
                  px-5
                  h-full
                  flex
                  items-center
                  gap-1.5
                  text-[14px]
                  font-bold
                  tracking-[0.01em]
                  text-slate-700
                  hover:text-blue-600
                  hover:bg-blue-50
                  transition
                  rounded-lg
                "
              >
                <HomeOutlined
                  sx={{
                    fontSize: 18,
                  }}
                />

                Home
              </li>

              {mainCategory.map(
                (item) => (
                  <li
                    key={
                      item.categoryId
                    }
                    onMouseEnter={() => {
                      setShowCategorySheet(
                        true
                      );

                      setSelectedCategory(
                        item.categoryId
                      );
                    }}
                    onClick={() =>
                      handleCategoryClick(
                        item.categoryId
                      )
                    }
                    className="
                      cursor-pointer
                      px-5
                      h-full
                      flex
                      items-center
                      text-[14px]
                      font-bold
                      tracking-[0.01em]
                      text-slate-700
                      hover:text-amber-800
                      hover:bg-amber-50
                      transition
                      rounded-lg
                    "
                  >
                    {item.name}
                  </li>
                )
              )}

              <li
                onClick={handleAllProductsClick}
                className="
                  cursor-pointer
                  px-5
                  h-full
                  flex
                  items-center
                  text-sm
                  font-semibold
                  text-gray-700
                  hover:text-blue-600
                  hover:bg-blue-50
                  transition
                  rounded-lg
                "
              >
                All Products
              </li>
            </ul>
          </div>
        )}

        {/* =====================================================
            CATEGORY SHEET
        ===================================================== */}

        {isLarge &&
          showCategorySheet && (
            <div
              onMouseLeave={() =>
                setShowCategorySheet(
                  false
                )
              }
              className="
                absolute
                top-[120px]
                left-8
                right-8
                lg:left-10
                lg:right-10
                bg-white
                border
                border-gray-100
                rounded-b-2xl
                shadow-2xl
                overflow-hidden
              "
            >
              <CategorySheet
                selectedCategory={
                  selectedCategory
                }
              />
            </div>
          )}

        {/* =====================================================
            MOBILE MENU
        ===================================================== */}

        {!isLarge &&
          mobileMenu && (
            <div
              className="
                border-t
                border-gray-100
                bg-white
                shadow-lg
                max-h-[calc(100vh-64px)]
                overflow-y-auto
              "
            >
              {/* MOBILE SEARCH */}

              <div className="p-4">
                <form
                  onSubmit={
                    handleSearch
                  }
                  className="
                    flex
                    items-center
                    h-[46px]
                    rounded-xl
                    border
                    border-gray-200
                    bg-gray-50
                    overflow-hidden
                  "
                >
                  <SearchIcon
                    sx={{
                      ml: 1.5,
                      color: "#667085",
                    }}
                  />

                  <InputBase
                    value={search}
                    onChange={(event) =>
                      setSearch(
                        event.target.value
                      )
                    }
                    placeholder="Search products..."
                    className="flex-1 px-3"
                  />

                  <IconButton
                    type="submit"
                    sx={{
                      mr: 0.5,
                    }}
                  >
                    <SearchIcon />
                  </IconButton>
                </form>
              </div>

              <Divider />

              {/* HOME */}

              <ListItemButton
                onClick={goHome}
                sx={{
                  py: 1.5,
                  px: 2.5,
                  fontWeight: 600,
                }}
              >
                <HomeOutlined
                  sx={{
                    mr: 1.5,
                    color: "#667085",
                  }}
                />

                Home
              </ListItemButton>

              {/* CATEGORIES */}

              {mainCategory.map(
                (item) => (
                  <ListItemButton
                    key={
                      item.categoryId
                    }
                    onClick={() =>
                      handleCategoryClick(
                        item.categoryId
                      )
                    }
                    sx={{
                      py: 1.5,
                      px: 2.5,
                      fontWeight: 600,
                    }}
                  >
                    {item.name}
                  </ListItemButton>
                )
              )}

              <Divider />

              {/* ALL PRODUCTS */}

              <ListItemButton
                onClick={handleAllProductsClick}
                sx={{
                  py: 1.5,
                  px: 2.5,
                  fontWeight: 600,
                }}
              >
                All Products
              </ListItemButton>

              <Divider />

              {/* ACCOUNT */}

              {isLoggedIn ? (
                <>
                  <ListItemButton
                    onClick={() => {
                      setMobileMenu(false);

                      navigate(
                        "/account/profile"
                      );
                    }}
                    sx={{
                      py: 1.5,
                      px: 2.5,
                    }}
                  >
                    <PersonOutlineOutlined
                      sx={{
                        mr: 1.5,
                        color: "#667085",
                      }}
                    />

                    My Profile
                  </ListItemButton>

                  <ListItemButton
                    onClick={() => {
                      setMobileMenu(false);

                      navigate(
                        "/account/orders"
                      );
                    }}
                    sx={{
                      py: 1.5,
                      px: 2.5,
                    }}
                  >
                    <ReceiptLongOutlined
                      sx={{
                        mr: 1.5,
                        color: "#667085",
                      }}
                    />

                    My Orders
                  </ListItemButton>

                  <ListItemButton
                    onClick={() => {
                      setMobileMenu(false);

                      navigate(
                        "/account/addresses"
                      );
                    }}
                    sx={{
                      py: 1.5,
                      px: 2.5,
                    }}
                  >
                    <LocationOnOutlined
                      sx={{
                        mr: 1.5,
                        color: "#667085",
                      }}
                    />

                    My Addresses
                  </ListItemButton>

                  <ListItemButton
                    onClick={
                      handleLogout
                    }
                    sx={{
                      py: 1.5,
                      px: 2.5,
                      color: "#d92d20",
                    }}
                  >
                    <LogoutOutlined
                      sx={{
                        mr: 1.5,
                      }}
                    />

                    Logout
                  </ListItemButton>
                </>
              ) : (
                <ListItemButton
                  onClick={() => {
                    setMobileMenu(false);

                    navigate("/login");
                  }}
                  sx={{
                    py: 1.5,
                    px: 2.5,
                    fontWeight: 700,
                    color: "#1769ff",
                  }}
                >
                  <AccountCircle
                    sx={{
                      mr: 1.5,
                    }}
                  />

                  Login
                </ListItemButton>
              )}

              <Divider />

              {/* WISHLIST */}

              <ListItemButton
                onClick={() => {
                  setMobileMenu(false);

                  navigate("/wishlist");
                }}
                sx={{
                  py: 1.5,
                  px: 2.5,
                }}
              >
                <FavoriteBorder
                  sx={{
                    mr: 1.5,
                    color: "#667085",
                  }}
                />

                Wishlist
              </ListItemButton>

              {/* CART */}

              <ListItemButton
                onClick={() => {
                  setMobileMenu(false);

                  navigate("/cart");
                }}
                sx={{
                  py: 1.5,
                  px: 2.5,
                }}
              >
                <AddShoppingCart
                  sx={{
                    mr: 1.5,
                    color: "#667085",
                  }}
                />

                Cart

                {cartCount > 0 && (
                  <span
                    className="
                      ml-2
                      rounded-full
                      bg-red-500
                      px-2
                      py-0.5
                      text-[10px]
                      font-bold
                      text-white
                    "
                  >
                    {cartCount}
                  </span>
                )}
              </ListItemButton>

              <Divider />

              {/* SELLER */}

              <ListItemButton
                onClick={() => {
                  setMobileMenu(false);

                  navigate(
                    "/become-seller"
                  );
                }}
                sx={{
                  py: 1.5,
                  px: 2.5,
                  fontWeight: 700,
                  color: "#1769ff",
                }}
              >
                <Storefront
                  sx={{
                    mr: 1.5,
                  }}
                />

                Become a Seller
              </ListItemButton>
            </div>
          )}
      </Box>

      {/* =====================================================
          MOBILE BOTTOM NAVIGATION
          Visible on phones and tablets; desktop keeps the top nav.
      ===================================================== */}
      {!isLarge && (
        <Box
          component="nav"
          aria-label="Mobile bottom navigation"
          sx={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1300,
            display: "grid",
            gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
            alignItems: "center",
            minHeight: 68,
            pb: "env(safe-area-inset-bottom)",
            bgcolor: "rgba(255,255,255,0.97)",
            backdropFilter: "blur(14px)",
            borderTop: "1px solid #e8edf5",
            boxShadow: "0 -6px 22px rgba(15,23,42,0.09)",
          }}
        >
          {[
            { label: "Home", icon: <HomeOutlined />, action: goHome },
            { label: "Shop", icon: <Storefront />, action: handleAllProductsClick },
            { label: "Wishlist", icon: <FavoriteBorder />, action: () => navigate("/wishlist") },
            { label: "Cart", icon: <AddShoppingCart />, action: () => navigate("/cart"), count: cartCount },
            {
              label: "Account",
              icon: isLoggedIn ? <PersonOutlineOutlined /> : <AccountCircle />,
              action: (event: React.MouseEvent<HTMLElement>) => {
                if (isLoggedIn) handleAccountClick(event);
                else navigate("/login");
              },
            },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={item.action as React.MouseEventHandler<HTMLButtonElement>}
              aria-label={item.label}
              className="relative flex min-w-0 flex-col items-center justify-center gap-1 py-2 text-[10px] font-semibold text-slate-600 transition-colors hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500"
            >
              <span className="relative flex h-6 items-center justify-center">
                {React.cloneElement(item.icon as React.ReactElement<any>, {
                  sx: { fontSize: 23 },
                })}
                {item.label === "Cart" && cartCount > 0 && (
                  <span className="absolute -right-3 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold leading-none text-white">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </span>
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </Box>
      )}
    </>
  );
};

export default Navbar;