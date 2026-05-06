import React, { useState, useEffect, useRef } from "react";
import { collection, query, orderBy, onSnapshot, doc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { format } from "date-fns";
import { Plus, Edit2, Trash2, CheckSquare, Square, Upload, X, Image as ImageIcon } from "lucide-react";
import MDEditor from '@uiw/react-md-editor';
import { handleFirestoreError, OperationType } from "../../lib/firebase-errors";

interface LabApp {
  id: string;
  title: string;
  slug: string;
  description: string;
  fullDescription: string;
  icon: string;
  coverImage: string;
  category: string;
  status: string;
  link: string;
  screenshots: string[];
  tags: string[];
  createdAt: any;
  updatedAt: any;
}

export default function LabAppAdmin() {
  const [apps, setApps] = useState<LabApp[]>([]);
  const [editingApp, setEditingApp] = useState<LabApp | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "lab_apps"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setApps(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LabApp)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "lab_apps");
    });
    return () => unsubscribe();
  }, []);

  const handleCreateNew = () => {
    setEditingApp(null);
    setEditorContent("");
    setTags([]);
    setScreenshots([]);
    setIsCreating(true);
  };

  const handleEditClick = (app: LabApp) => {
    setEditingApp(app);
    setEditorContent(app.fullDescription || "");
    setTags(app.tags || []);
    setScreenshots(app.screenshots || []);
    setIsCreating(true);
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const fileUploadHelper = async (file: File, slug: string): Promise<string> => {
    const { uploadCoverImage } = await import("../../lib/storage");
    return uploadCoverImage(file, slug + '-' + Date.now());
  };

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const slug = (document.querySelector('input[name="slug"]') as HTMLInputElement)?.value || 'untitled';
    try {
      const newUrls = [];
      for (let i = 0; i < files.length; i++) {
        const url = await fileUploadHelper(files[i], slug);
        newUrls.push(url);
      }
      setScreenshots(prev => [...prev, ...newUrls]);
    } catch (e) {
      console.error(e);
      setErrorMessage("Failed to upload screenshots.");
    }
  };

  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const slug = (document.querySelector('input[name="slug"]') as HTMLInputElement)?.value || 'untitled';
    try {
      const url = await fileUploadHelper(file, slug + '-icon');
      (document.querySelector('input[name="icon"]') as HTMLInputElement).value = url;
    } catch (e) {
      console.error(e);
      setErrorMessage("Failed to upload icon.");
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const slug = (document.querySelector('input[name="slug"]') as HTMLInputElement)?.value || 'untitled';
    try {
      const url = await fileUploadHelper(file, slug + '-cover');
      (document.querySelector('input[name="coverImage"]') as HTMLInputElement).value = url;
    } catch (e) {
      console.error(e);
      setErrorMessage("Failed to upload cover.");
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      description: formData.get("description") as string,
      fullDescription: editorContent,
      icon: formData.get("icon") as string,
      coverImage: formData.get("coverImage") as string,
      category: formData.get("category") as string,
      status: formData.get("status") as string,
      link: formData.get("link") as string,
      tags,
      screenshots,
      updatedAt: serverTimestamp(),
    };

    try {
      if (editingApp) {
        await setDoc(doc(db, "lab_apps", editingApp.id), data, { merge: true });
      } else {
        await setDoc(doc(collection(db, "lab_apps")), {
          ...data,
          createdAt: serverTimestamp(),
        });
      }
      setIsCreating(false);
      setEditingApp(null);
    } catch (error) {
      handleFirestoreError(error, editingApp ? OperationType.UPDATE : OperationType.CREATE, "lab_apps");
    }
  };

  if (isCreating || editingApp) {
    return (
      <div className="bg-brand-dark p-6 rounded-2xl border border-white/10">
        <h2 className="text-2xl font-bold mb-6">{editingApp ? "Edit App" : "Create App"}</h2>
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-mono text-white/60 mb-2">Title *</label>
              <input required name="title" defaultValue={editingApp?.title} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-brand-orange outline-none" />
            </div>
            <div>
              <label className="block text-sm font-mono text-white/60 mb-2">Slug *</label>
              <input required name="slug" defaultValue={editingApp?.slug} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-brand-orange outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-mono text-white/60 mb-2">Category (e.g. Game, Tool)</label>
              <input name="category" defaultValue={editingApp?.category} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-brand-orange outline-none" />
            </div>
            <div>
              <label className="block text-sm font-mono text-white/60 mb-2">External/Internal Link</label>
              <input name="link" defaultValue={editingApp?.link} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-brand-orange outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-mono text-white/60 mb-2">Short Description *</label>
            <textarea required name="description" defaultValue={editingApp?.description} rows={2} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-brand-orange outline-none" />
          </div>
          <div>
            <label className="block text-sm font-mono text-white/60 mb-2">Full Description (Markdown)</label>
            <div data-color-mode="dark">
              <MDEditor value={editorContent} onChange={(v) => setEditorContent(v || "")} height={300} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center justify-between text-sm font-mono text-white/60 mb-2">
                <span>Icon URL</span>
                <label className="cursor-pointer text-brand-orange hover:text-white flex items-center gap-1">
                  <Upload size={14}/> Upload <input type="file" className="hidden" accept="image/*" onChange={handleIconUpload} />
                </label>
              </label>
              <input name="icon" defaultValue={editingApp?.icon} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-brand-orange outline-none" />
            </div>
            <div>
              <label className="flex items-center justify-between text-sm font-mono text-white/60 mb-2">
                <span>Cover Image URL</span>
                <label className="cursor-pointer text-brand-orange hover:text-white flex items-center gap-1">
                  <Upload size={14}/> Upload <input type="file" className="hidden" accept="image/*" onChange={handleCoverUpload} />
                </label>
              </label>
              <input name="coverImage" defaultValue={editingApp?.coverImage} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-brand-orange outline-none" />
            </div>
          </div>
          <div>
            <label className="flex items-center justify-between text-sm font-mono text-white/60 mb-2">
              <span>Screenshots (Drag & Drop to upload via browser or click)</span>
              <label className="cursor-pointer text-brand-orange hover:text-white flex items-center gap-1">
                <Upload size={14}/> Add Screenshots <input type="file" multiple className="hidden" accept="image/*" onChange={handleScreenshotUpload} />
              </label>
            </label>
            <div className="flex flex-wrap gap-4 mt-2">
              {screenshots.map((url, i) => (
                <div key={i} className="relative group w-32 h-32 bg-black/50 rounded-lg border border-white/10 overflow-hidden">
                  <img src={url} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setScreenshots(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-red-500 rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-mono text-white/60 mb-2">Tags</label>
            <div className="w-full bg-black/50 border border-white/10 rounded-lg p-3 flex flex-wrap gap-2">
              {tags.map(tag => (
                <span key={tag} className="bg-white/10 px-2 py-1 rounded text-sm font-mono flex items-center gap-1">
                  {tag} <button type="button" onClick={() => setTags(t => t.filter(x => x !== tag))}><X size={14} /></button>
                </span>
              ))}
              <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={handleAddTag} placeholder="Type and Enter" className="bg-transparent outline-none flex-1" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-mono text-white/60 mb-2">Status</label>
            <select name="status" defaultValue={editingApp?.status || 'draft'} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white outline-none">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div className="flex justify-end gap-4">
            <button type="button" onClick={() => setIsCreating(false)} className="px-6 py-2 border border-white/20 hover:bg-white/10 rounded-full transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-brand-orange text-black font-bold hover:bg-white rounded-full transition-colors">Save App</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-mono text-white/60">Lab Apps (Playstore style)</h2>
        <button onClick={handleCreateNew} className="flex items-center gap-2 px-4 py-2 bg-brand-orange text-black rounded-full hover:bg-white transition-colors text-sm font-mono uppercase tracking-widest font-bold">
          <Plus size={16} /> Publish App
        </button>
      </div>
      <div className="bg-brand-dark rounded-2xl border border-white/10 overflow-hidden">
        <table className="w-full min-w-[800px] text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-black/20">
              <th className="p-4 font-mono text-xs uppercase tracking-widest text-white/40">App</th>
              <th className="p-4 font-mono text-xs uppercase tracking-widest text-white/40">Status</th>
              <th className="p-4 font-mono text-xs uppercase tracking-widest text-white/40">Category</th>
              <th className="p-4 font-mono text-xs uppercase tracking-widest text-white/40">Date</th>
              <th className="p-4 font-mono text-xs uppercase tracking-widest text-white/40 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {apps.map(app => (
              <tr key={app.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-black rounded-lg overflow-hidden border border-white/10">
                    {app.icon && <img src={app.icon} className="w-full h-full object-cover" />}
                  </div>
                  <div>
                    <div className="font-bold">{app.title}</div>
                    <div className="text-xs text-white/40 font-mono">/{app.slug}</div>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-mono ${app.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {app.status}
                  </span>
                </td>
                <td className="p-4 text-sm text-white/60">{app.category || '-'}</td>
                <td className="p-4 text-sm text-white/60">{app.createdAt?.toDate ? format(app.createdAt.toDate(), "MMM dd, yyyy") : '-'}</td>
                <td className="p-4 flex justify-end gap-2">
                  <button onClick={() => handleEditClick(app)} className="p-2 bg-white/10 rounded-lg hover:bg-brand-orange transition-colors"><Edit2 size={16} /></button>
                  <button onClick={() => deleteDoc(doc(db, "lab_apps", app.id))} className="p-2 bg-white/10 rounded-lg hover:bg-red-500 transition-colors"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {apps.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-white/40 font-mono text-sm">No apps published yet!</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
