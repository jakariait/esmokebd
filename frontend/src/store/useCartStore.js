import { create } from "zustand";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

const loadCart = () => {
  const savedCart = localStorage.getItem("cart");
  return savedCart ? JSON.parse(savedCart) : [];
};

const saveCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

const useCartStore = create((set, get) => ({
  cart: loadCart(),

  loadCartFromBackend: async (token) => {
    try {
      const res = await axios.get(`${apiUrl}/getCart`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const serverCartItems = res.data.cart.items.map((item) => ({
        productId: item.productId,
        contentId: item.contentId,
        name: item.name,
        originalPrice: item.originalPrice,
        discountPrice: item.discountPrice,
        variant: item.variant || "Default",
        quantity: item.quantity,
        thumbnail: item.thumbnail,
        slug: item.slug,
        variantId: item.variantId || "Default",
      }));

      saveCart(serverCartItems);
      set({ cart: serverCartItems });
    } catch (error) {
      console.error("Error loading cart from backend:", error);
    }
  },

  addToCart: async (product, quantity, selectedVariant) => {
    const variant = selectedVariant?.size?.name || "Default";
    const variantId = selectedVariant?._id || "Default";
    const token = localStorage.getItem("user_token");

    set((state) => {
      const existingIndex = state.cart.findIndex(
        (item) => item.productId === product.id && item.variant === variant
      );

      let updatedCart = [...state.cart];

      const finalDiscount =
        selectedVariant?.discount > 0
          ? selectedVariant.discount
          : product?.finalDiscount > 0
            ? product.finalDiscount
            : 0;

      if (existingIndex !== -1) {
        updatedCart[existingIndex].quantity += quantity;
        if (updatedCart[existingIndex].quantity > 5) {
          updatedCart[existingIndex].quantity = 5;
        }
      } else {
        updatedCart.push({
          productId: product.id,
          contentId: product.productId, // ✅ added here
          name: product.name,
          originalPrice: selectedVariant?.price ?? product.finalPrice,
          discountPrice: finalDiscount,
          variant,
          quantity,
          thumbnail: product.thumbnailImage,
          variantId,
          slug: product.slug,
        });
      }

      saveCart(updatedCart);
      return { cart: updatedCart };
    });

    if (token) {
      try {
        const finalDiscount =
          selectedVariant?.discount > 0
            ? selectedVariant.discount
            : product?.finalDiscount > 0
              ? product.finalDiscount
              : 0;

        await axios.post(
          `${apiUrl}/addToCart`,
          {
            productId: product.id,
            contentId: product.productId, // ✅ added here
            name: product.name,
            originalPrice: selectedVariant?.price ?? product.finalPrice,
            discountPrice: finalDiscount,
            variant,
            quantity,
            thumbnail: product.thumbnailImage,
            slug: product.slug,
            variantId,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.error("Error adding item to DB cart:", error);
      }
    }
  },

  updateQuantity: async (productId, variant, quantity) => {
    const newQuantity = Math.min(quantity, 5);
    const token = localStorage.getItem("user_token");

    set((state) => {
      const updatedCart = state.cart.map((item) =>
        item.productId === productId && item.variant === variant
          ? { ...item, quantity: newQuantity }
          : item
      );
      saveCart(updatedCart);
      return { cart: updatedCart };
    });

    if (!token) return;

    try {
      await axios.patch(
        `${apiUrl}/updateCartItem`,
        { productId, variant, quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Error updating quantity in DB:", error);
    }
  },

  removeFromCart: async (productId, variant) => {
    set((state) => {
      const updatedCart = state.cart.filter(
        (item) => !(item.productId === productId && item.variant === variant)
      );
      saveCart(updatedCart);
      return { cart: updatedCart };
    });

    const token = localStorage.getItem("user_token");
    if (token) {
      try {
        await axios.delete(`${apiUrl}/removeCartItem`, {
          headers: { Authorization: `Bearer ${token}` },
          data: { productId, variant },
        });
      } catch (error) {
        console.error("Error removing cart item from DB:", error);
      }
    }
  },

  clearCart: async () => {
    set(() => {
      saveCart([]);
      return { cart: [] };
    });

    const token = localStorage.getItem("user_token");
    if (token) {
      try {
        await axios.delete(`${apiUrl}/clearCart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        console.error("Error clearing cart in DB:", error);
      }
    }
  },

  syncCartToDB: async (token) => {
    const localCart = get().cart;

    try {
      for (const item of localCart) {
        await axios.post(
          `/api/addToCart`,
          {
            productId: item.productId,
            contentId: item.contentId, // ✅ added here
            name: item.name,
            originalPrice: item.originalPrice,
            discountPrice: item.discountPrice,
            variant: item.variant,
            quantity: item.quantity,
            thumbnail: item.thumbnail,
            slug: item.slug,
            variantId: item.variantId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      const res = await axios.get(`/api/getCart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const serverCartItems = res.data.cart.items.map((item) => ({
        productId: item.product._id,
        contentId: item.contentId, // ✅ added here
        name: item.name,
        originalPrice: item.originalPrice,
        discountPrice: item.discountPrice,
        variant: item.variant,
        quantity: item.quantity,
        thumbnail: item.thumbnail,
        slug: item.product?.slug,
        variantId: item.variantId,
      }));

      saveCart(serverCartItems);
      set({ cart: serverCartItems });
    } catch (error) {
      console.error("Error syncing entire cart to DB:", error);
    }
  },
}));

export default useCartStore;
