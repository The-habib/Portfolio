import { motion } from "motion/react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { FlaskConical, ArrowLeft, Star, Download, Search } from "lucide-react";
import CustomCursor from "../components/CustomCursor";
import Grain from "../components/Grain";
import PageTransition from "../components/PageTransition";
import { collection, query, orderBy, onSnapshot, where } from "firebase/firestore";
import { db } from "../firebase";
import { useState, useEffect } from "react";

export default function Lab() {
  const isLabSubdomain = window.location.hostname.startsWith('lab.');
  const canonicalUrl = "https://lab.solodev_.com";

  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "lab_apps"), where("status", "==", "published"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setApps(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <PageTransition>
      <main className="relative min-h-screen bg-brand-black text-brand-light selection:bg-brand-orange selection:text-white md:cursor-none">
        <Helmet>
          <title>Lab Store | Solodev</title>
          <meta name="description" content="Discover experimental apps, creative coding projects, and games published by Solodev." />
          <meta name="robots" content="index, follow" />
          <link rel="canonical" href={canonicalUrl} />
          
          <meta property="og:type" content="website" />
          <meta property="og:url" content={canonicalUrl} />
          <meta property="og:title" content="Lab Store | Solodev" />
          <meta property="og:description" content="Discover experimental apps, creative coding projects, and games by Solodev." />
        </Helmet>
        
        <CustomCursor />
        <Grain />

        {/* Global Toolbar like Playstore */}
        <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-orange flex items-center justify-center rounded-lg text-black">
              <FlaskConical size={18} fill="currentColor" />
            </div>
            <span className="font-display font-bold text-lg hidden sm:block tracking-wide">Lab Store</span>
          </div>
          <div className="flex-1 max-w-md mx-6">
            <div className="relative bg-white/5 rounded-full px-4 py-2 flex items-center border border-white/10">
              <Search size={16} className="text-white/40 absolute left-4" />
              <input 
                type="text" 
                disabled 
                placeholder="Search apps & games (coming soon)..." 
                className="w-full bg-transparent outline-none pl-8 text-sm font-sans text-white/80 placeholder:text-white/40" 
              />
            </div>
          </div>
          <div>
            {!isLabSubdomain && (
               <Link to="/" className="text-white/60 hover:text-white flex items-center gap-2 font-mono text-sm uppercase tracking-widest"><ArrowLeft size={16}/> Home</Link>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12">
          
          <h2 className="text-2xl font-display font-bold text-white mb-6">Recommended for you</h2>

          {loading ? (
             <div className="flex justify-center py-20"><div className="w-8 h-8 rounded-full border-2 border-brand-orange border-t-transparent animate-spin"/></div>
          ) : (
            <>
              {apps.length === 0 ? (
                <div className="py-20 text-center flex flex-col items-center">
                   <FlaskConical size={48} className="text-white/10 mb-4" />
                   <p className="text-white/40 font-mono text-sm uppercase tracking-widest">No apps published yet. Check back soon.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                  {apps.map((app, idx) => (
                    <motion.div 
                      key={app.id} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Link to={`/lab/${app.slug}`} className="group block focus:outline-none">
                        <div className="w-full aspect-square rounded-2xl md:rounded-3xl overflow-hidden bg-white/5 border border-white/10 shadow-lg mb-3 flex items-center justify-center transition-transform group-hover:scale-[1.02] active:scale-95 duration-200">
                          {app.icon ? (
                            <img src={app.icon} alt={app.title} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-4xl text-white/20 font-display font-bold">{app.title.charAt(0)}</span>
                          )}
                        </div>
                        <h3 className="font-sans text-sm text-white/90 font-medium truncate mb-1">{app.title}</h3>
                        <div className="flex items-center gap-2 mb-1">
                           <span className="text-xs text-white/50 font-mono truncate max-w-full">{app.category || 'App'}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-white/80">
                           4.9 <Star size={10} fill="currentColor" />
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </PageTransition>
  );
}
