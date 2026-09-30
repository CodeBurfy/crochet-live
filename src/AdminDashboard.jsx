import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { Upload, X, Plus, Trash2 } from "lucide-react";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("content");
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [galleries, setGalleries] = useState([]);

  useEffect(() => {
    loadContent();
    loadGalleries();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("site_content")
        .select("*")
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        throw fetchError;
      }

      setContent(data || {
        hero_title: "Sip, stitch & learn crochet in one cozy afternoon.",
        hero_subtitle: "A 2-hour beginner-friendly workshop with all materials included.",
        price: 30,
        duration: "2 hours",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadGalleries = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from("galleries")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setGalleries(data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleContentChange = (field, value) => {
    setContent((prev) => ({ ...prev, [field]: value }));
  };

  const saveContent = async () => {
    try {
      setLoading(true);
      const { error: upsertError } = await supabase
        .from("site_content")
        .upsert([{ id: 1, ...content }], { onConflict: "id" });

      if (upsertError) throw upsertError;
      setSuccess("Content saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    setError("");

    try {
      for (const file of files) {
        const fileName = `${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("gallery-images")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: publicData } = supabase.storage
          .from("gallery-images")
          .getPublicUrl(fileName);

        const { error: insertError } = await supabase
          .from("galleries")
          .insert([{ image_url: publicData.publicUrl, title: file.name }]);

        if (insertError) throw insertError;
      }

      setSuccess("Images uploaded successfully!");
      loadGalleries();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const deleteGalleryImage = async (id, imagePath) => {
    try {
      const fileName = imagePath.split("/").pop();
      await supabase.storage.from("gallery-images").remove([fileName]);

      const { error: deleteError } = await supabase
        .from("galleries")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      setSuccess("Image deleted!");
      loadGalleries();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex gap-2 border-b border-ink/10">
        <button
          onClick={() => setActiveTab("content")}
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === "content"
              ? "border-b-2 border-clay text-ink"
              : "text-ink-soft hover:text-ink"
          }`}
        >
          Text Content
        </button>
        <button
          onClick={() => setActiveTab("gallery")}
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === "gallery"
              ? "border-b-2 border-clay text-ink"
              : "text-ink-soft hover:text-ink"
          }`}
        >
          Gallery Images
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-4 flex items-start justify-between">
          <p className="text-red-700">{error}</p>
          <button onClick={() => setError("")} className="text-red-700">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-lg bg-green-50 border border-green-200 p-4 flex items-start justify-between">
          <p className="text-green-700">{success}</p>
          <button onClick={() => setSuccess("")} className="text-green-700">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {activeTab === "content" && (
        <div className="space-y-6">
          {content ? (
            <>
              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  Hero Title
                </label>
                <input
                  type="text"
                  value={content.hero_title || ""}
                  onChange={(e) => handleContentChange("hero_title", e.target.value)}
                  className="w-full rounded-lg border border-ink/20 px-4 py-2 focus:outline-none focus:border-clay"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  Hero Subtitle
                </label>
                <textarea
                  value={content.hero_subtitle || ""}
                  onChange={(e) => handleContentChange("hero_subtitle", e.target.value)}
                  className="w-full rounded-lg border border-ink/20 px-4 py-2 focus:outline-none focus:border-clay"
                  rows="3"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    value={content.price || 0}
                    onChange={(e) => handleContentChange("price", parseInt(e.target.value))}
                    className="w-full rounded-lg border border-ink/20 px-4 py-2 focus:outline-none focus:border-clay"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={content.duration || ""}
                    onChange={(e) => handleContentChange("duration", e.target.value)}
                    placeholder="e.g., 2 hours"
                    className="w-full rounded-lg border border-ink/20 px-4 py-2 focus:outline-none focus:border-clay"
                  />
                </div>
              </div>

              <button
                onClick={saveContent}
                disabled={loading}
                className="rounded-lg bg-clay px-6 py-2 text-sm font-semibold text-cream hover:bg-clay-dark disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </>
          ) : (
            <p className="text-ink-soft">Loading content...</p>
          )}
        </div>
      )}

      {activeTab === "gallery" && (
        <div className="space-y-6">
          <div className="rounded-lg border-2 border-dashed border-ink/20 p-8 text-center">
            <label className="cursor-pointer flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-clay" />
              <span className="font-medium text-ink">Upload images</span>
              <span className="text-sm text-ink-soft">
                {uploading ? "Uploading..." : "Click to select or drag and drop"}
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>

          {galleries.length > 0 && (
            <div>
              <h3 className="font-medium text-ink mb-4">Gallery ({galleries.length})</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {galleries.map((img) => (
                  <div key={img.id} className="relative group rounded-lg overflow-hidden">
                    <img
                      src={img.image_url}
                      alt={img.title}
                      className="w-full h-40 object-cover"
                    />
                    <button
                      onClick={() => deleteGalleryImage(img.id, img.image_url)}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 className="h-6 w-6 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
