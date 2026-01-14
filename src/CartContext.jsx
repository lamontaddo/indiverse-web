// src/CartContext.jsx ✅ FULL DROP-IN (Web)
// Variant-safe, per-profile clearing, backwards compatible
// ✅ Persists to localStorage (survives refresh)
// ✅ Products with size/color no longer collapse into one line
// ✅ addItem(source, delta, meta) supports meta.selectedSize/meta.selectedColor + meta.itemType
// ✅ removeItem accepts: lineKey string OR item object OR legacy id string
// ✅ clearCartForProfile(profileKey, options) clears ONLY that profile (optionally only a type)

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'indiverse:cart:v1';

function safeParse(json, fallback) {
  try {
    const v = JSON.parse(json);
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

function getSourceId(source) {
  return source?._id || source?.id || null;
}

function toNumber(n, fallback = 0) {
  const x = Number(n);
  return Number.isFinite(x) ? x : fallback;
}

function normStr(v) {
  const s = String(v || '').trim();
  return s || '';
}

function normLower(v) {
  return normStr(v).toLowerCase();
}

// Build a stable "line key" for cart items.
// If meta provides itemType/productId/selectedSize/selectedColor, we include them.
// This makes variants separate (M/Black vs L/Cream).
function buildLineKey({ profileKey, itemType, sourceId, productId, selectedSize, selectedColor }) {
  const pk = normLower(profileKey);
  const type = normLower(itemType || '');
  const sid = normStr(sourceId);
  const pid = normStr(productId || '');

  const size = normLower(selectedSize);
  const color = normLower(selectedColor);

  // If this is a product variant, key by productId + variant
  if (type === 'product' || pid || size || color) {
    return `pk:${pk}|type:product|pid:${pid || sid}|size:${size}|color:${color}`;
  }

  // Otherwise, behave like legacy: just unique by profile + sourceId
  return `pk:${pk}|type:${type || 'item'}|id:${sid}`;
}

function normalizeItemType(v) {
  const t = normLower(v);
  if (!t) return '';
  if (t === 'products') return 'product';
  if (t === 'flowers') return 'flower';
  return t;
}

function loadInitialItems() {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  const parsed = safeParse(raw, []);
  return Array.isArray(parsed) ? parsed : [];
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => loadInitialItems());

  // persist to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.log('[CartContext] localStorage write failed', e);
    }
  }, [items]);

  /**
   * addItem(source, quantityDelta, meta?)
   * - quantityDelta can be positive or negative
   * - meta can include:
   *    profileKey
   *    itemType: 'product' | 'arrangement' | ...
   *    productId
   *    selectedSize
   *    selectedColor
   */
  const addItem = (source, quantityDelta = 1, meta = {}) => {
    if (!source) return;

    const sourceId = getSourceId(source);
    if (!sourceId) return;

    const delta = toNumber(quantityDelta, 0);
    if (delta === 0) return;

    const profileKey = meta?.profileKey || source?.profileKey || null;

    const inferredProduct = !!(meta?.productId || meta?.selectedSize || meta?.selectedColor);
    const itemTypeRaw =
      meta?.itemType ||
      source?.itemType ||
      source?.type ||
      (inferredProduct ? 'product' : 'item');

    const itemType = normalizeItemType(itemTypeRaw) || 'item';

    const productId = meta?.productId || (itemType === 'product' ? String(sourceId) : null);

    const selectedSize = meta?.selectedSize || source?.selectedSize || null;
    const selectedColor = meta?.selectedColor || source?.selectedColor || null;

    const lineKey = buildLineKey({
      profileKey,
      itemType,
      sourceId,
      productId,
      selectedSize,
      selectedColor,
    });

    setItems((prev) => {
      const idx = prev.findIndex((i) => i.lineKey === lineKey);

      // already in cart -> adjust qty
      if (idx !== -1) {
        const copy = [...prev];
        const existing = copy[idx];
        const nextQty = toNumber(existing.quantity, 0) + delta;

        // remove if goes <= 0
        if (nextQty <= 0) {
          copy.splice(idx, 1);
          return copy;
        }

        copy[idx] = {
          ...existing,

          name: source.name ?? existing.name,
          priceCents: toNumber(source.priceCents, existing.priceCents || 0),
          imageUrl: source.imageUrl ?? existing.imageUrl ?? null,
          category: source.category ?? existing.category ?? null,
          inStock: source.inStock ?? existing.inStock ?? true,

          itemType: itemType ?? existing.itemType ?? 'item',
          productId: productId ?? existing.productId ?? null,
          selectedSize: selectedSize ?? existing.selectedSize ?? null,
          selectedColor: selectedColor ?? existing.selectedColor ?? null,

          // legacy fields (keep for UI compatibility)
          size: existing.size ?? null,
          type: existing.type ?? null,

          profileKey: profileKey ?? existing.profileKey ?? null,
          quantity: nextQty,
          lineKey,
        };

        return copy;
      }

      // new line item: don't add if delta <= 0
      if (delta <= 0) return prev;

      return [
        ...prev,
        {
          // legacy id field retained for old code paths
          id: String(sourceId),

          // ✅ canonical identity for a cart row
          lineKey,

          name: source.name || 'Item',
          priceCents: toNumber(source.priceCents, 0),
          quantity: delta,
          imageUrl: source.imageUrl || null,
          category: source.category || null,
          inStock: source.inStock ?? true,

          // ✅ new fields for products checkout
          itemType,
          productId: productId ? String(productId) : null,
          selectedSize: selectedSize ? String(selectedSize) : null,
          selectedColor: selectedColor ? String(selectedColor) : null,

          // legacy fields
          size: source.size || null,
          type: source.type || null,

          profileKey,
        },
      ];
    });
  };

  // Remove an item completely from the cart
  // Accepts:
  // - lineKey string (preferred)
  // - legacy id string
  // - item object (with lineKey or id/_id)
  const removeItem = (idOrItem) => {
    if (!idOrItem) return;

    if (typeof idOrItem === 'string') {
      const key = idOrItem;
      setItems((prev) => prev.filter((i) => i.lineKey !== key && i.id !== key));
      return;
    }

    const key = idOrItem?.lineKey || null;
    const legacyId = idOrItem?.id || idOrItem?._id || null;

    setItems((prev) =>
      prev.filter((i) => {
        if (key && i.lineKey === key) return false;
        if (legacyId && i.id === String(legacyId)) return false;
        return true;
      })
    );
  };

  // ✅ Clears ONLY a single profile's cart rows.
  // options:
  //  - onlyItemType: 'product' | 'arrangement' | 'flower' | etc (optional)
  const clearCartForProfile = (profileKey, options = {}) => {
    const pk = normLower(profileKey);
    if (!pk) return;

    const onlyItemType = normalizeItemType(options?.onlyItemType || '');
    setItems((prev) =>
      prev.filter((it) => {
        const itPk = normLower(it?.profileKey);
        if (itPk !== pk) return true;

        if (!onlyItemType) return false; // remove all for this profile

        const itType = normalizeItemType(it?.itemType || it?.type || '');
        return itType !== onlyItemType; // keep rows not matching requested type
      })
    );
  };

  // Legacy global clear
  const clearCart = () => setItems([]);

  const cartCount = useMemo(
    () => items.reduce((sum, item) => sum + toNumber(item.quantity, 0), 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      cartCount,
      addItem,
      removeItem,

      // ✅ new
      clearCartForProfile,

      // legacy
      clearCart,
    }),
    [items, cartCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
