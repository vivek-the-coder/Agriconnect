"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"

export interface CartItem {
    id: string
    product_id: string
    product_type: "seed" | "tool" | "equipment"
    product_name: string
    product_image?: string
    price: number
    quantity: number
}

interface CartContextType {
    items: CartItem[]
    addItem: (item: Omit<CartItem, "id" | "quantity">) => void
    removeItem: (cartItemId: string) => void
    updateQuantity: (cartItemId: string, quantity: number) => void
    clearCart: () => void
    itemCount: number
    total: number
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const LOCAL_STORAGE_KEY = "agriconnect_cart"

function getLocalCart(): CartItem[] {
    if (typeof window === "undefined") return []
    try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
        return stored ? JSON.parse(stored) : []
    } catch {
        return []
    }
}

function setLocalCart(items: CartItem[]) {
    if (typeof window === "undefined") return
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items))
}

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [userId, setUserId] = useState<string | null>(null)
    const [isOpen, setIsOpen] = useState(false)
    const [initialized, setInitialized] = useState(false)

    // Listen for auth changes
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUserId(session?.user?.id ?? null)
        })
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUserId(session?.user?.id ?? null)
        })
        return () => subscription.unsubscribe()
    }, [])

    // Load cart on mount / auth change
    useEffect(() => {
        async function loadCart() {
            if (userId) {
                // Load from Supabase
                const { data } = await supabase
                    .from("cart_items")
                    .select("*")
                    .eq("user_id", userId)
                    .order("created_at", { ascending: true })

                if (data && data.length > 0) {
                    setItems(data.map((item: any) => ({
                        id: item.id,
                        product_id: item.product_id,
                        product_type: item.product_type,
                        product_name: item.product_name,
                        product_image: item.product_image,
                        price: Number(item.price),
                        quantity: item.quantity,
                    })))
                } else {
                    // Merge local cart into Supabase if any
                    const localItems = getLocalCart()
                    if (localItems.length > 0) {
                        const inserts = localItems.map((item) => ({
                            user_id: userId,
                            product_id: item.product_id,
                            product_type: item.product_type,
                            product_name: item.product_name,
                            product_image: item.product_image,
                            price: item.price,
                            quantity: item.quantity,
                        }))
                        const { data: inserted } = await supabase
                            .from("cart_items")
                            .insert(inserts)
                            .select()
                        if (inserted) {
                            setItems(inserted.map((item: any) => ({
                                id: item.id,
                                product_id: item.product_id,
                                product_type: item.product_type,
                                product_name: item.product_name,
                                product_image: item.product_image,
                                price: Number(item.price),
                                quantity: item.quantity,
                            })))
                        }
                        localStorage.removeItem(LOCAL_STORAGE_KEY)
                    } else {
                        setItems([])
                    }
                }
            } else {
                // Load from localStorage
                setItems(getLocalCart())
            }
            setInitialized(true)
        }
        loadCart()
    }, [userId])

    // Sync to localStorage when items change (for guests)
    useEffect(() => {
        if (initialized && !userId) {
            setLocalCart(items)
        }
    }, [items, userId, initialized])

    const addItem = useCallback((newItem: Omit<CartItem, "id" | "quantity">) => {
        setItems((prev) => {
            const existing = prev.find(
                (item) => item.product_id === newItem.product_id && item.product_type === newItem.product_type
            )
            if (existing) {
                const updated = prev.map((item) =>
                    item.product_id === newItem.product_id && item.product_type === newItem.product_type
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
                // Sync to Supabase
                if (userId && existing.id) {
                    supabase
                        .from("cart_items")
                        .update({ quantity: existing.quantity + 1 })
                        .eq("id", existing.id)
                        .then()
                }
                return updated
            } else {
                const tempId = crypto.randomUUID()
                const cartItem: CartItem = { ...newItem, id: tempId, quantity: 1 }
                // Sync to Supabase
                if (userId) {
                    supabase
                        .from("cart_items")
                        .insert({
                            user_id: userId,
                            product_id: newItem.product_id,
                            product_type: newItem.product_type,
                            product_name: newItem.product_name,
                            product_image: newItem.product_image,
                            price: newItem.price,
                            quantity: 1,
                        })
                        .select()
                        .single()
                        .then(({ data }) => {
                            if (data) {
                                setItems((current) =>
                                    current.map((item) =>
                                        item.id === tempId ? { ...item, id: data.id } : item
                                    )
                                )
                            }
                        })
                }
                return [...prev, cartItem]
            }
        })
    }, [userId])

    const removeItem = useCallback((cartItemId: string) => {
        setItems((prev) => {
            const item = prev.find((i) => i.id === cartItemId)
            if (item && userId) {
                supabase.from("cart_items").delete().eq("id", item.id).then()
            }
            return prev.filter((i) => i.id !== cartItemId)
        })
    }, [userId])

    const updateQuantity = useCallback((cartItemId: string, quantity: number) => {
        if (quantity < 1) return
        setItems((prev) => {
            const item = prev.find((i) => i.id === cartItemId)
            if (item && userId && item.id) {
                supabase
                    .from("cart_items")
                    .update({ quantity })
                    .eq("id", item.id)
                    .then()
            }
            return prev.map((i) =>
                i.id === cartItemId ? { ...i, quantity } : i
            )
        })
    }, [userId])

    const clearCart = useCallback(() => {
        if (userId) {
            supabase.from("cart_items").delete().eq("user_id", userId).then()
        }
        setItems([])
        localStorage.removeItem(LOCAL_STORAGE_KEY)
    }, [userId])

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                itemCount,
                total,
                isOpen,
                setIsOpen,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error("useCart must be used within a CartProvider")
    }
    return context
}
