"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    FileText,
    Settings,
    Users,
    Sprout,
    Wrench,
    Truck,
    MessageSquare,
    Globe,
    LayoutDashboard,
    Loader2,
    Eye,
    Pencil,
    Trash2,
    ShoppingCart,
} from "lucide-react"
import { db, auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { collection, query, getCountFromServer, onSnapshot, doc, updateDoc, addDoc, deleteDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState("dashboard")
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                toast.error("Please login to access admin panel")
                router.push("/login")
                return
            }

            if (currentUser.email !== 'admin@agro.com') {
                toast.error("Access Denied: You do not have admin privileges")
                router.push("/")
                return
            }

            setUser(currentUser)
            setLoading(false)
        })
        return () => unsubscribe()
    }, [router])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navigation />

            <div className="flex-1 flex overflow-hidden">
                <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Settings className="h-5 w-5 text-primary" />
                            Admin Panel
                        </h2>
                    </div>
                    <nav className="flex-1 p-4 space-y-1">
                        <SidebarItem icon={<LayoutDashboard className="h-5 w-5" />} label="Dashboard" active={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")} />
                        <SidebarItem icon={<Sprout className="h-5 w-5" />} label="Seeds" active={activeTab === "seeds"} onClick={() => setActiveTab("seeds")} />
                        <SidebarItem icon={<Wrench className="h-5 w-5" />} label="Rentals" active={activeTab === "rentals"} onClick={() => setActiveTab("rentals")} />
                        <SidebarItem icon={<Truck className="h-5 w-5" />} label="Equipment" active={activeTab === "equipment"} onClick={() => setActiveTab("equipment")} />
                        <SidebarItem icon={<MessageSquare className="h-5 w-5" />} label="Community" active={activeTab === "community"} onClick={() => setActiveTab("community")} />
                        <SidebarItem icon={<ShoppingCart className="h-5 w-5" />} label="Orders" active={activeTab === "orders"} onClick={() => setActiveTab("orders")} />
                        <SidebarItem icon={<Users className="h-5 w-5" />} label="Users" active={activeTab === "users"} onClick={() => setActiveTab("users")} />
                    </nav>
                </aside>

                <main className="flex-1 overflow-y-auto p-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 min-h-full">
                        {activeTab === "dashboard" && <AdminDashboard />}
                        {activeTab === "seeds" && <AdminCollectionPanel collectionName="seeds" title="Seeds & Tissue Culture" />}
                        {activeTab === "rentals" && <AdminCollectionPanel collectionName="tool_rentals" title="Equipment Rentals" />}
                        {activeTab === "equipment" && <AdminCollectionPanel collectionName="equipment" title="Used Equipment" />}
                        {activeTab === "community" && <AdminCollectionPanel collectionName="forum_posts" title="Community Posts" />}
                        {activeTab === "orders" && <AdminCollectionPanel collectionName="orders" title="Orders" />}
                        {activeTab === "users" && <AdminCollectionPanel collectionName="users" title="Users" />}
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    )
}

function SidebarItem({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
    return (
        <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${active ? "bg-primary/10 text-primary" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}>
            {icon}
            {label}
        </button>
    )
}

function AdminDashboard() {
    const [stats, setStats] = useState({ users: "0", seeds: "0", rentals: "0", equipment: "0", orders: "0", posts: "0" })

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [u, s, r, e, o, p] = await Promise.all([
                    getCountFromServer(collection(db, 'users')),
                    getCountFromServer(collection(db, 'seeds')),
                    getCountFromServer(collection(db, 'tool_rentals')),
                    getCountFromServer(collection(db, 'equipment')),
                    getCountFromServer(collection(db, 'orders')),
                    getCountFromServer(collection(db, 'forum_posts')),
                ])
                setStats({
                    users: u.data().count.toString(),
                    seeds: s.data().count.toString(),
                    rentals: r.data().count.toString(),
                    equipment: e.data().count.toString(),
                    orders: o.data().count.toString(),
                    posts: p.data().count.toString(),
                })
            } catch (err) {
                console.error(err)
            }
        }
        fetchStats()
    }, [])

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Users" value={stats.users} icon={<Users />} color="bg-blue-500" />
                <StatCard title="Seeds" value={stats.seeds} icon={<Sprout />} color="bg-emerald-500" />
                <StatCard title="Rentals" value={stats.rentals} icon={<Wrench />} color="bg-orange-500" />
                <StatCard title="Equipment" value={stats.equipment} icon={<Truck />} color="bg-purple-500" />
                <StatCard title="Orders" value={stats.orders} icon={<ShoppingCart />} color="bg-pink-500" />
                <StatCard title="Forum Posts" value={stats.posts} icon={<MessageSquare />} color="bg-cyan-500" />
            </div>
        </div>
    )
}

function StatCard({ title, value, icon, color }: any) {
    return (
        <div className="bg-white p-6 rounded-2xl border flex items-center gap-4">
            <div className={`p-4 rounded-xl text-white ${color}`}>{icon}</div>
            <div>
                <p className="text-sm text-slate-500">{title}</p>
                <p className="text-2xl font-bold">{value}</p>
            </div>
        </div>
    )
}

/* ========================================================================
   REAL-TIME ADMIN COLLECTION PANEL — onSnapshot + View/Edit/Delete
   ======================================================================== */

function AdminCollectionPanel({ collectionName, title }: { collectionName: string, title: string }) {
    const [items, setItems] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    // Dialog state
    const [viewItem, setViewItem] = useState<any>(null)
    const [editItem, setEditItem] = useState<any>(null)
    const [editFormData, setEditFormData] = useState<any>({})

    // Real-time listener
    useEffect(() => {
        setLoading(true)
        const q = query(collection(db, collectionName))
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
            data.sort((a: any, b: any) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
            setItems(data)
            setLoading(false)
        }, (err) => {
            console.error("Realtime error:", err)
            setLoading(false)
        })
        return () => unsubscribe()
    }, [collectionName])

    // Get columns based on collection type
    const getColumns = () => {
        switch (collectionName) {
            case "seeds":
                return ["name", "category", "price", "unit"]
            case "tool_rentals":
                return ["name", "category", "rentalPrice", "location", "availability"]
            case "equipment":
                return ["name", "category", "price", "location", "condition"]
            case "forum_posts":
                return ["title", "author_name", "created_at"]
            case "orders":
                return ["user_email", "total", "status", "created_at"]
            case "users":
                return ["email", "displayName", "created_at"]
            default:
                return ["name"]
        }
    }

    const getDisplayLabel = (key: string) => {
        const map: any = {
            name: "Name", category: "Category", price: "Price (₹)", unit: "Unit",
            rentalPrice: "Rent (₹)", location: "Location", availability: "Status",
            condition: "Condition", title: "Title", author_name: "Author",
            created_at: "Created", user_email: "Email", total: "Total (₹)",
            status: "Status", email: "Email", displayName: "Name",
        }
        return map[key] || key
    }

    const formatCellValue = (item: any, key: string) => {
        const val = item[key]
        if (val === undefined || val === null) return "—"
        if (key === "created_at") {
            try { return new Date(val).toLocaleDateString("en-IN") } catch { return val }
        }
        if (key === "price" || key === "rentalPrice" || key === "total") {
            return `₹${Number(val).toLocaleString("en-IN")}`
        }
        if (key === "availability" || key === "status" || key === "condition") {
            return <Badge variant="outline" className="text-xs">{val}</Badge>
        }
        return String(val).length > 40 ? String(val).slice(0, 40) + "…" : String(val)
    }

    const getNameKey = () => {
        if (collectionName === "forum_posts") return "title"
        if (collectionName === "orders") return "user_email"
        if (collectionName === "users") return "email"
        return "name"
    }

    // Filter
    const nameKey = getNameKey()
    const filteredItems = items.filter((item) => {
        const nm = (item[nameKey] || "").toLowerCase()
        const cat = (item.category || "").toLowerCase()
        const loc = (item.location || "").toLowerCase()
        const s = searchTerm.toLowerCase()
        return nm.includes(s) || cat.includes(s) || loc.includes(s)
    })

    // Edit handlers
    const handleEditOpen = (item: any) => {
        setEditItem(item)
        setEditFormData({ ...item })
    }

    const handleEditSave = async () => {
        if (!editItem) return
        try {
            const { id, ...rest } = editFormData
            await updateDoc(doc(db, collectionName, editItem.id), rest)
            toast.success("Updated successfully!")
            setEditItem(null)
        } catch (err: any) {
            toast.error(err.message || "Update failed")
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this item? This cannot be undone.")) return
        try {
            await deleteDoc(doc(db, collectionName, id))
            toast.success("Deleted successfully!")
        } catch (err: any) {
            toast.error(err.message || "Delete failed")
        }
    }

    const columns = getColumns()

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold">{title}</h2>
                    <p className="text-sm text-muted-foreground">{filteredItems.length} items • Real-time synced</p>
                </div>
                <Input
                    placeholder="Search by name, category, location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-xs"
                />
            </div>

            {loading ? (
                <div className="py-20 flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : filteredItems.length === 0 ? (
                <div className="py-20 text-center text-muted-foreground">
                    No items found in this collection.
                </div>
            ) : (
                <div className="border rounded-lg overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 border-b">
                            <tr>
                                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">#</th>
                                {columns.map((col) => (
                                    <th key={col} className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                                        {getDisplayLabel(col)}
                                    </th>
                                ))}
                                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.map((item, idx) => (
                                <tr key={item.id} className="border-b last:border-0 hover:bg-slate-50/50 transition-colors">
                                    <td className="px-4 py-3 text-muted-foreground">{idx + 1}</td>
                                    {columns.map((col) => (
                                        <td key={col} className="px-4 py-3 max-w-[200px] truncate">
                                            {formatCellValue(item, col)}
                                        </td>
                                    ))}
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600" onClick={() => setViewItem(item)} title="View">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-600" onClick={() => handleEditOpen(item)} title="Edit">
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={() => handleDelete(item.id)} title="Delete">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ============ VIEW DIALOG ============ */}
            <Dialog open={!!viewItem} onOpenChange={(o) => !o && setViewItem(null)}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{viewItem?.[nameKey] || "Details"}</DialogTitle>
                        <DialogDescription>Full record details</DialogDescription>
                    </DialogHeader>
                    {viewItem && (
                        <div className="space-y-4">
                            {viewItem.image && viewItem.image !== "/placeholder.svg" && (
                                <img src={viewItem.image} alt="" className="w-full h-48 object-cover rounded-lg" />
                            )}
                            {viewItem.images && viewItem.images.length > 0 && (
                                <div className="flex gap-2 flex-wrap">
                                    {viewItem.images.map((img: string, i: number) => (
                                        <img key={i} src={img} alt={`Photo ${i + 1}`} className="w-24 h-24 object-cover rounded-lg border" />
                                    ))}
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                {Object.entries(viewItem).filter(([k]) => !["id", "image", "images", "user_id"].includes(k)).map(([key, value]) => (
                                    <div key={key} className="space-y-0.5">
                                        <p className="text-xs text-muted-foreground font-medium uppercase">{key.replace(/_/g, " ")}</p>
                                        <p className="font-medium break-words">
                                            {typeof value === "object" ? JSON.stringify(value) : String(value || "—")}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* ============ EDIT DIALOG ============ */}
            <Dialog open={!!editItem} onOpenChange={(o) => !o && setEditItem(null)}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit: {editItem?.[nameKey]}</DialogTitle>
                        <DialogDescription>Modify the fields below and save</DialogDescription>
                    </DialogHeader>
                    {editItem && (
                        <div className="space-y-4">
                            {Object.entries(editFormData)
                                .filter(([k]) => !["id", "user_id", "images", "image", "created_at", "likes", "features"].includes(k))
                                .map(([key, value]) => (
                                    <div key={key} className="space-y-1.5">
                                        <Label className="text-xs uppercase text-muted-foreground">{key.replace(/_/g, " ")}</Label>
                                        {String(value || "").length > 60 ? (
                                            <Textarea
                                                value={String(editFormData[key] || "")}
                                                onChange={(e) => setEditFormData({ ...editFormData, [key]: e.target.value })}
                                                rows={3}
                                            />
                                        ) : (
                                            <Input
                                                value={String(editFormData[key] || "")}
                                                onChange={(e) => setEditFormData({ ...editFormData, [key]: e.target.value })}
                                            />
                                        )}
                                    </div>
                                ))}
                            <div className="flex justify-end gap-2 pt-4">
                                <Button variant="outline" onClick={() => setEditItem(null)}>Cancel</Button>
                                <Button onClick={handleEditSave}>Save Changes</Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
