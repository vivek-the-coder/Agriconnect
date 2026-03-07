"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { db, auth } from "@/lib/firebase"
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"

export interface CartItem {
    id: string
    product_id: string
    product_type: "seed" | "tool" | "equipment" | "rental"
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
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUserId(user?.uid ?? null)
        })
        return () => unsubscribe()
    }, [])

    // Load cart on mount / auth change
    useEffect(() => {
        async function loadCart() {
            if (userId) {
                // Load from Firestore
                const q = query(collection(db, "cart_items"), where("user_id", "==", userId))
                const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout fetching data")), 5000))
                const snapshot = await Promise.race([getDocs(q), timeoutPromise]) as any

                if (!snapshot.empty) {
                    const data = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
                    data.sort((a: any, b: any) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime())
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
                    // Merge local cart into Firestore if any
                    const localItems = getLocalCart()
                    if (localItems.length > 0) {
                        const newFirestoreItems: CartItem[] = []
                        for (const item of localItems) {
                            const newDoc = {
                                user_id: userId,
                                product_id: item.product_id,
                                product_type: item.product_type,
                                product_name: item.product_name,
                                product_image: item.product_image,
                                price: item.price,
                                quantity: item.quantity,
                                created_at: new Date().toISOString()
                            }
                            const docRef = await addDoc(collection(db, "cart_items"), newDoc)
                            newFirestoreItems.push({ ...item, id: docRef.id })
                        }
                        setItems(newFirestoreItems)
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
                // Sync to Firestore
                if (userId && existing.id) {
                    updateDoc(doc(db, "cart_items", existing.id), { quantity: existing.quantity + 1 }).catch(console.error)
                }
                return updated
            } else {
                const tempId = crypto.randomUUID()
                const cartItem: CartItem = { ...newItem, id: tempId, quantity: 1 }
                // Sync to Firestore
                if (userId) {
                    addDoc(collection(db, "cart_items"), {
                        user_id: userId,
                        product_id: newItem.product_id,
                        product_type: newItem.product_type,
                        product_name: newItem.product_name,
                        product_image: newItem.product_image,
                        price: newItem.price,
                        quantity: 1,
                        created_at: new Date().toISOString()
                    }).then((docRef) => {
                        setItems((current) =>
                            current.map((item) =>
                                item.id === tempId ? { ...item, id: docRef.id } : item
                            )
                        )
                    }).catch(console.error)
                }
                return [...prev, cartItem]
            }
        })
    }, [userId])

    const removeItem = useCallback((cartItemId: string) => {
        setItems((prev) => {
            const item = prev.find((i) => i.id === cartItemId)
            if (item && userId) {
                deleteDoc(doc(db, "cart_items", item.id)).catch(console.error)
            }
            return prev.filter((i) => i.id !== cartItemId)
        })
    }, [userId])

    const updateQuantity = useCallback((cartItemId: string, quantity: number) => {
        if (quantity < 1) return
        setItems((prev) => {
            const item = prev.find((i) => i.id === cartItemId)
            if (item && userId && item.id) {
                updateDoc(doc(db, "cart_items", item.id), { quantity }).catch(console.error)
            }
            return prev.map((i) =>
                i.id === cartItemId ? { ...i, quantity } : i
            )
        })
    }, [userId])

    const clearCart = useCallback(() => {
        if (userId) {
            const q = query(collection(db, "cart_items"), where("user_id", "==", userId))
            getDocs(q).then(snapshot => {
                snapshot.forEach(docSnap => deleteDoc(docSnap.ref))
            }).catch(console.error)
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
