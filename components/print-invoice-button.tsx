"use client"

import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"

export function PrintInvoiceButton() {
    return (
        <Button onClick={() => window.print()} className="bg-green-600 hover:bg-green-700">
            <Printer className="mr-2 h-4 w-4" /> Print Invoice
        </Button>
    )
}
