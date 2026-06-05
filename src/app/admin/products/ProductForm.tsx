"use client";

import { useState, useTransition, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Upload, Loader2, ImagePlus, Star } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { createProduct, updateProduct } from "@/app/actions/products";
import { generateSlug } from "@/lib/utils";

interface ProductFormProps {
  categories: { id: string; name: string }[];
  collections: { id: string; name: string }[];
  product?: {
    id: string; name: string; slug: string; price: number;
    comparePrice: number | null; description: string;
    categoryId: string; collectionId: string | null;
    sizes: string[]; colors: { name: string; hex: string }[];
    stock: number; mainImage: string; images: string[];
    featured: boolean; newArrival: boolean; onSale: boolean;
  };
}

const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];

export function ProductForm({ categories, collections, product }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const [name, setName] = useState(product?.name || "");
  const [slug, setSlug] = useState(product?.slug || "");
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [comparePrice, setComparePrice] = useState(product?.comparePrice?.toString() || "");
  const [description, setDescription] = useState(product?.description || "");
  const [categoryId, setCategoryId] = useState(product?.categoryId || "");
  const [collectionId, setCollectionId] = useState(product?.collectionId || "");
  const [sizes, setSizes] = useState<string[]>(product?.sizes || []);
  const [colors, setColors] = useState<{ name: string; hex: string }[]>(
    (product?.colors as { name: string; hex: string }[]) || []
  );
  const [stock, setStock] = useState(product?.stock?.toString() || "0");
  const [mainImage, setMainImage] = useState(product?.mainImage || "");
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [featured, setFeatured] = useState(product?.featured || false);
  const [newArrival, setNewArrival] = useState(product?.newArrival || false);
  const [onSale, setOnSale] = useState(product?.onSale || false);
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#000000");

  const handleNameChange = (v: string) => {
    setName(v);
    if (!product) setSlug(generateSlug(v));
  };

  // ── Real upload to Cloudinary via /api/upload ──────────────
  const uploadFiles = useCallback(async (files: FileList | File[]) => {
    const arr = Array.from(files);
    if (arr.length === 0) return;

    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/avif"];
    const invalid = arr.filter((f) => !allowed.includes(f.type));
    if (invalid.length > 0) {
      toast.error("Vetëm imazhe jpg, png, webp, avif lejohen.");
      return;
    }
    const tooBig = arr.filter((f) => f.size > 5 * 1024 * 1024);
    if (tooBig.length > 0) {
      toast.error("Imazhet duhet të jenë nën 5MB.");
      return;
    }

    setUploading(true);
    let uploaded = 0;

    for (const file of arr) {
      try {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Upload dështoi");

        const url: string = data.url;
        if (!mainImage) {
          setMainImage(url);
        } else {
          setImages((prev) => [...prev, url]);
        }
        uploaded++;
      } catch (err: unknown) {
        toast.error(`Gabim: ${err instanceof Error ? err.message : "Upload dështoi"}`);
      }
    }

    if (uploaded > 0) toast.success(`${uploaded} imazh u ngarkua me sukses!`);
    setUploading(false);
  }, [mainImage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) uploadFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) uploadFiles(e.dataTransfer.files);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mainImage) { toast.error("Ngarko të paktën një imazh kryesor!"); return; }
    startTransition(async () => {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("slug", slug);
      fd.append("price", price);
      fd.append("comparePrice", comparePrice);
      fd.append("description", description);
      fd.append("categoryId", categoryId);
      fd.append("collectionId", collectionId);
      fd.append("sizes", JSON.stringify(sizes));
      fd.append("colors", JSON.stringify(colors));
      fd.append("stock", stock);
      fd.append("mainImage", mainImage);
      fd.append("images", JSON.stringify(images));
      fd.append("featured", String(featured));
      fd.append("newArrival", String(newArrival));
      fd.append("onSale", String(onSale));

      const result = product ? await updateProduct(product.id, fd) : await createProduct(fd);
      if (result.success) {
        toast.success(product ? "Produkti u përditësua!" : "Produkti u krijua!");
        router.push("/admin/products");
      } else {
        toast.error(result.error || "Ndodhi një gabim.");
      }
    });
  };

  const toggleSize = (size: string) =>
    setSizes((prev) => prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]);

  const addColor = () => {
    if (!newColorName.trim()) return;
    setColors((prev) => [...prev, { name: newColorName.trim(), hex: newColorHex }]);
    setNewColorName(""); setNewColorHex("#000000");
  };

  const inp = "w-full border border-neutral-200 px-3 py-2.5 text-sm focus:outline-none focus:border-black bg-white";
  const lbl = "block text-xs font-semibold tracking-widest mb-1.5 text-neutral-700";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-20 lg:pb-6">

      {/* ── Basic info ─────────────────────────────── */}
      <div className="bg-white border border-neutral-100 p-4 sm:p-6 space-y-4">
        <h2 className="text-xs font-bold tracking-widest text-neutral-500">INFORMACIONI BAZË</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={lbl}>EMRI *</label>
            <input className={inp} value={name} onChange={(e) => handleNameChange(e.target.value)} required />
          </div>
          <div className="sm:col-span-2">
            <label className={lbl}>SLUG *</label>
            <input className={inp} value={slug} onChange={(e) => setSlug(e.target.value)} required />
          </div>
          <div>
            <label className={lbl}>ÇMIMI (Lek) *</label>
            <input className={inp} type="number" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" />
          </div>
          <div>
            <label className={lbl}>ÇMIMI KRAHASUES (Lek)</label>
            <input className={inp} type="number" value={comparePrice} onChange={(e) => setComparePrice(e.target.value)} min="0" placeholder="Fakultativ" />
          </div>
          <div>
            <label className={lbl}>KATEGORIA *</label>
            <select className={inp} value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
              <option value="">Zgjidhni kategorinë...</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className={lbl}>STOKU *</label>
            <input className={inp} type="number" value={stock} onChange={(e) => setStock(e.target.value)} required min="0" />
          </div>
          <div className="sm:col-span-2">
            <label className={lbl}>KOLEKSIONI</label>
            <select className={inp} value={collectionId} onChange={(e) => setCollectionId(e.target.value)}>
              <option value="">Asnjë</option>
              {collections.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className={lbl}>PËRSHKRIMI *</label>
            <textarea className={`${inp} resize-none`} rows={4} value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>
        </div>
      </div>

      {/* ── Images ─────────────────────────────────── */}
      <div className="bg-white border border-neutral-100 p-4 sm:p-6 space-y-4">
        <h2 className="text-xs font-bold tracking-widest text-neutral-500">IMAZHET E PRODUKTIT</h2>

        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded cursor-pointer transition-colors flex flex-col items-center justify-center py-8 px-4 text-center ${
            dragOver ? "border-black bg-neutral-50" : "border-neutral-300 hover:border-neutral-400"
          }`}
        >
          {uploading ? (
            <><Loader2 className="h-8 w-8 animate-spin text-neutral-400 mb-2" /><p className="text-sm text-neutral-500">Duke ngarkuar...</p></>
          ) : (
            <>
              <ImagePlus className="h-8 w-8 text-neutral-300 mb-2" />
              <p className="text-sm font-medium text-neutral-600">Tërhiq imazhet këtu ose <span className="text-black underline">kliko për të zgjedhur</span></p>
              <p className="text-xs text-neutral-400 mt-1">JPG, PNG, WebP, AVIF • Max 5MB • Shumë imazhe njëkohësisht</p>
            </>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/avif"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Preview grid */}
        {(mainImage || images.length > 0) && (
          <div>
            <p className="text-xs text-neutral-500 mb-3">
              <Star className="inline h-3 w-3 mr-1 text-[#C9A84C]" />
              Imazhi i parë është kryesori. Kliko X për ta hequr.
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {/* Main image */}
              {mainImage && (
                <div className="relative aspect-square group border-2 border-[#C9A84C]">
                  <Image src={mainImage} alt="Kryesor" fill className="object-cover" sizes="120px" />
                  <div className="absolute top-1 left-1 bg-[#C9A84C] text-white text-[8px] font-bold px-1">KRYESOR</div>
                  <button
                    type="button"
                    onClick={() => {
                      if (images.length > 0) {
                        setMainImage(images[0]);
                        setImages(images.slice(1));
                      } else {
                        setMainImage("");
                      }
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              {/* Gallery images */}
              {images.map((img, i) => (
                <div key={i} className="relative aspect-square group border border-neutral-200">
                  <Image src={img} alt={`Imazh ${i + 2}`} fill className="object-cover" sizes="120px" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <button
                      type="button"
                      title="Bëje kryesor"
                      onClick={() => {
                        const newImages = images.filter((_, j) => j !== i);
                        newImages.unshift(mainImage);
                        setMainImage(img);
                        setImages(newImages);
                      }}
                      className="bg-[#C9A84C] text-white rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      <Star className="h-2.5 w-2.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setImages(images.filter((_, j) => j !== i))}
                      className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Add more */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square border-2 border-dashed border-neutral-200 hover:border-neutral-400 flex items-center justify-center transition-colors"
              >
                <Upload className="h-5 w-5 text-neutral-300" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Sizes ──────────────────────────────────── */}
      <div className="bg-white border border-neutral-100 p-4 sm:p-6">
        <h2 className="text-xs font-bold tracking-widest text-neutral-500 mb-4">MASAT *</h2>
        <div className="flex gap-2 flex-wrap">
          {ALL_SIZES.map((s) => (
            <button
              key={s} type="button" onClick={() => toggleSize(s)}
              className={`w-11 h-11 border text-xs font-semibold transition-all ${
                sizes.includes(s) ? "border-black bg-black text-white" : "border-neutral-200 hover:border-black"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── Colors ─────────────────────────────────── */}
      <div className="bg-white border border-neutral-100 p-4 sm:p-6">
        <h2 className="text-xs font-bold tracking-widest text-neutral-500 mb-4">NGJYRAT *</h2>
        <div className="flex gap-2 mb-4 flex-wrap">
          {colors.map((c, i) => (
            <div key={i} className="flex items-center gap-1.5 border border-neutral-200 px-2 py-1.5 rounded">
              <div className="w-4 h-4 rounded-full border border-neutral-300" style={{ backgroundColor: c.hex }} />
              <span className="text-xs font-medium">{c.name}</span>
              <button type="button" onClick={() => setColors(colors.filter((_, j) => j !== i))}>
                <X className="h-3 w-3 text-neutral-400 hover:text-red-500" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input className={`${inp} flex-1`} placeholder="Emri ngjyrës (p.sh. E zezë)" value={newColorName} onChange={(e) => setNewColorName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addColor(); }}} />
          <div className="flex gap-2">
            <input type="color" className="h-10 w-14 border border-neutral-200 cursor-pointer p-0.5" value={newColorHex} onChange={(e) => setNewColorHex(e.target.value)} />
            <button type="button" onClick={addColor} className="flex items-center gap-1 bg-neutral-100 px-4 text-xs font-semibold hover:bg-neutral-200 h-10 whitespace-nowrap">
              <Plus className="h-3.5 w-3.5" /> Shto ngjyrën
            </button>
          </div>
        </div>
      </div>

      {/* ── Flags ──────────────────────────────────── */}
      <div className="bg-white border border-neutral-100 p-4 sm:p-6">
        <h2 className="text-xs font-bold tracking-widest text-neutral-500 mb-4">STATUSI</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "I veçuar (Featured)", value: featured, set: setFeatured },
            { label: "Arritje e re (New)", value: newArrival, set: setNewArrival },
            { label: "Në ulje (Sale)", value: onSale, set: setOnSale },
          ].map((flag) => (
            <label key={flag.label} className="flex items-center gap-3 border border-neutral-200 px-4 py-3 cursor-pointer hover:bg-neutral-50">
              <input type="checkbox" checked={flag.value} onChange={(e) => flag.set(e.target.checked)} className="w-4 h-4 accent-black" />
              <span className="text-sm font-medium">{flag.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* ── Submit ─────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 lg:static bg-white border-t border-neutral-100 p-4 flex gap-3 z-30">
        <button type="submit" disabled={isPending || uploading}
          className="flex-1 lg:flex-none bg-black text-white text-xs font-bold tracking-widest px-8 py-3.5 hover:bg-neutral-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
          {isPending ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Duke ruajtur...</> : product ? "PËRDITËSO PRODUKTIN" : "KRIJO PRODUKTIN"}
        </button>
        <button type="button" onClick={() => router.push("/admin/products")}
          className="border border-neutral-200 text-xs font-bold tracking-widest px-6 py-3.5 hover:bg-neutral-50">
          ANULO
        </button>
      </div>
    </form>
  );
}
