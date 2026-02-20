"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    BarChart3,
    FileText,
    Package,
    Settings,
    Users,
    ShoppingBag,
    Sprout,
    Wrench,
    Truck,
    MessageSquare,
    Globe,
    Plus,
    Search,
    LayoutDashboard,
    Loader2
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState("dashboard")
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                toast.error("Please login to access admin panel")
                router.push("/login")
                return
            }

            if (session.user.email !== 'admin@agro.com') {
                toast.error("Access Denied: You do not have admin privileges")
                router.push("/")
                return
            }

            setUser(session.user)
            setLoading(false)
        }
        checkAuth()
    }, [])

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
                        <SidebarItem icon={<FileText className="h-5 w-5" />} label="Schemes" active={activeTab === "schemes"} onClick={() => setActiveTab("schemes")} />
                        <SidebarItem icon={<Sprout className="h-5 w-5" />} label="Seeds" active={activeTab === "seeds"} onClick={() => setActiveTab("seeds")} />
                        <SidebarItem icon={<Wrench className="h-5 w-5" />} label="Tools" active={activeTab === "tools"} onClick={() => setActiveTab("tools")} />
                        <SidebarItem icon={<Truck className="h-5 w-5" />} label="Equipment" active={activeTab === "equipment"} onClick={() => setActiveTab("equipment")} />
                        <SidebarItem icon={<MessageSquare className="h-5 w-5" />} label="Community" active={activeTab === "community"} onClick={() => setActiveTab("community")} />
                        <SidebarItem icon={<Globe className="h-5 w-5" />} label="Export Hub" active={activeTab === "export"} onClick={() => setActiveTab("export")} />
                        <SidebarItem icon={<Users className="h-5 w-5" />} label="Profiles" active={activeTab === "profiles"} onClick={() => setActiveTab("profiles")} />
                    </nav>
                </aside>

                <main className="flex-1 overflow-y-auto p-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 min-h-full">
                        {activeTab === "dashboard" && <AdminDashboard />}
                        {activeTab === "schemes" && <AdminPanel title="Government Schemes" />}
                        {activeTab === "seeds" && <AdminPanel title="Seeds & Tissue Culture" />}
                        {activeTab === "tools" && <AdminPanel title="Tools & Machines" />}
                        {activeTab === "equipment" && <AdminPanel title="Used Equipment" />}
                        {activeTab === "community" && <AdminPanel title="Community Forum" />}
                        {activeTab === "export" && <AdminPanel title="Export Hub" />}
                        {activeTab === "profiles" && <AdminPanel title="User Profiles" />}
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
    const [stats, setStats] = useState({ users: "0", schemes: "0", tools: "0", ads: "0" })

    useEffect(() => {
        const fetchStats = async () => {
            const { count: u } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
            const { count: s } = await supabase.from('schemes').select('*', { count: 'exact', head: true })
            const { count: t } = await supabase.from('tools').select('*', { count: 'exact', head: true })
            const { count: e } = await supabase.from('equipment').select('*', { count: 'exact', head: true })

            setStats({
                users: (u || 0).toString(),
                schemes: (s || 0).toString(),
                tools: (t || 0).toString(),
                ads: (e || 0).toString()
            })
        }
        fetchStats()
    }, [])

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Users" value={stats.users} icon={<Users />} color="bg-blue-500" />
                <StatCard title="Schemes" value={stats.schemes} icon={<FileText />} color="bg-emerald-500" />
                <StatCard title="Tools" value={stats.tools} icon={<Wrench />} color="bg-orange-500" />
                <StatCard title="Equipment" value={stats.ads} icon={<Truck />} color="bg-purple-500" />
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

function AdminPanel({ title }: { title: string }) {
    const [items, setItems] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isAdding, setIsAdding] = useState(false)
    const [editingItem, setEditingItem] = useState<any>(null)
    const [formData, setFormData] = useState<any>({})

    const getTableName = () => {
        const t = title.toLowerCase()
        if (t.includes("schemes")) return "schemes"
        if (t.includes("seeds")) return "seeds"
        if (t.includes("tools")) return "tools"
        if (t.includes("equipment")) return "equipment"
        if (t.includes("community")) return "forum_posts"
        if (t.includes("export")) return "export_crops"
        if (t.includes("user")) return "profiles"
        return t
    }

    const fetchData = async () => {
        setLoading(true)
        const { data } = await supabase.from(getTableName()).select('*').order('created_at', { ascending: false })
        setItems(data || [])
        setLoading(false)
    }

    useEffect(() => { fetchData() }, [title])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        const table = getTableName()
        const { error } = editingItem
            ? await supabase.from(table).update(formData).eq('id', editingItem.id)
            : await supabase.from(table).insert([formData])

        if (error) toast.error(error.message)
        else {
            toast.success("Success!")
            setIsAdding(false)
            setEditingItem(null)
            fetchData()
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return
        const { error } = await supabase.from(getTableName()).delete().eq('id', id)
        if (error) toast.error(error.message)
        else {
            toast.success("Deleted")
            fetchData()
        }
    }

    const nameKey = getTableName() === 'export_crops' ? 'cropname' : (getTableName() === 'forum_posts' ? 'title' : 'name')

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">{title}</h2>
                <Button onClick={() => { setIsAdding(!isAdding); setEditingItem(null); setFormData({}) }}>
                    {isAdding ? "Cancel" : "Add New"}
                </Button>
            </div>

            {isAdding && (
                <form onSubmit={handleSave} className="space-y-4 p-4 border rounded-lg">
                    <Input placeholder="Name/Title" value={formData[nameKey] || ""} onChange={e => setFormData({ ...formData, [nameKey]: e.target.value })} required />
                    <Textarea placeholder="Description" value={formData.description || formData.content || ""} onChange={e => setFormData({ ...formData, [getTableName() === 'forum_posts' ? 'content' : 'description']: e.target.value })} />
                    <Button type="submit">Save</Button>
                </form>
            )}

            {loading ? <Loader2 className="animate-spin mx-auto" /> : (
                <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 border-b">
                            <tr>
                                <th className="px-6 py-4">Name/Title</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item.id} className="border-b last:border-0">
                                    <td className="px-6 py-4 font-medium">{item[nameKey]}</td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <Button variant="ghost" size="sm" onClick={() => { setEditingItem(item); setFormData(item); setIsAdding(true) }}>Edit</Button>
                                        <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDelete(item.id)}>Delete</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
