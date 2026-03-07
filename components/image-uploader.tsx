"use client"

import { useState, useRef } from "react"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { storage } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { ImagePlus, X, Loader2 } from "lucide-react"

interface ImageUploaderProps {
    images: string[]
    onImagesChange: (urls: string[]) => void
    folder: string
    maxImages?: number
}

export function ImageUploader({ images, onImagesChange, folder, maxImages = 5 }: ImageUploaderProps) {
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        const remaining = maxImages - images.length
        if (remaining <= 0) return

        const filesToUpload = Array.from(files).slice(0, remaining)

        try {
            setUploading(true)
            const uploadPromises = filesToUpload.map(async (file) => {
                const timestamp = Date.now()
                const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
                const storageRef = ref(storage, `${folder}/${timestamp}_${safeName}`)
                await uploadBytes(storageRef, file)
                return getDownloadURL(storageRef)
            })

            const newUrls = await Promise.all(uploadPromises)
            onImagesChange([...images, ...newUrls])
        } catch (err) {
            console.error("Image upload failed:", err)
        } finally {
            setUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ""
        }
    }

    const removeImage = (index: number) => {
        onImagesChange(images.filter((_, i) => i !== index))
    }

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap gap-3">
                {images.map((url, i) => (
                    <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border group">
                        <img src={url} alt={`Upload ${i + 1}`} className="w-full h-full object-cover" />
                        <button
                            type="button"
                            onClick={() => removeImage(i)}
                            className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </div>
                ))}

                {images.length < maxImages && (
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="w-24 h-24 rounded-lg border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer disabled:opacity-50"
                    >
                        {uploading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <>
                                <ImagePlus className="h-5 w-5" />
                                <span className="text-[10px] font-medium">Add Photo</span>
                            </>
                        )}
                    </button>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
            />

            <p className="text-xs text-muted-foreground">
                {images.length}/{maxImages} images uploaded. Click to add photos.
            </p>
        </div>
    )
}
