import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { collection, query, where, getDocs, updateDoc, increment, doc } from "firebase/firestore";
import { db } from "../firebase";
import { Helmet } from "react-helmet-async";
import { motion } from "motion/react";
import { ArrowLeft, Star, Download, ExternalLink, Share2, Info, ChevronRight } from "lucide-react";
import CustomCursor from "../components/CustomCursor";
import Grain from "../components/Grain";
import PageTransition from "../components/PageTransition";
import ReactMarkdown from "react-markdown";

export default function LabAppDetail() {
  const { slug } = useParams();
  const [app, setApp] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApp = async () => {
      if (!slug) return;
      try {
        const q = query(collection(db, "lab_apps"), where("slug", "==", slug), where("status", "==", "published"));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const docData = snapshot.docs[0];
          setApp({ id: docData.id, ...docData.data() });
        }
      } catch (e) {
        console.error("Error fetching app detail:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchApp();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-brand-orange border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!app) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center flex-col text-white">
        <h1 className="text-4xl font-display font-bold mb-4">App Not Found</h1>
        <Link to="/lab" className="text-brand-orange hover:underline font-mono uppercase tracking-widest text-sm">
          Return to Lab
        </Link>
      </div>
    );
  }

  return (
    <PageTransition>
      <main className="relative min-h-screen bg-brand-black text-brand-light selection:bg-brand-orange selection:text-white md:cursor-none pb-24">
        <Helmet>
          <title>{`${app.title} | Solodev Lab`}</title>
          <meta name="description" content={app.description} />
        </Helmet>
        
        <CustomCursor />
        <Grain />

        {/* Header Setup */}
        <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/10 px-4 py-4 flex items-center">
          <Link to="/lab" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="mx-auto font-display font-bold tracking-widest uppercase text-sm">Playstore</div>
          <div className="w-5" />
        </div>

        {/* App Hero Section */}
        <div className="max-w-4xl mx-auto px-6 pt-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-32 h-32 md:w-48 md:h-48 flex-shrink-0 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            >
              {app.icon ? (
                <img src={app.icon} alt={app.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-white/5 flex items-center justify-center">
                  <span className="text-4xl font-display text-white/20">{app.title.charAt(0)}</span>
                </div>
              )}
            </motion.div>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex-1"
            >
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2 tracking-tight">{app.title}</h1>
              <p className="text-brand-orange font-mono uppercase tracking-widest text-sm mb-4">{app.category || 'Experiment'}</p>
              
              <div className="flex items-center gap-6 mb-6">
                {/* Mock Ratings */}
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1 font-bold text-lg text-white">4.9 <Star size={16} fill="currentColor" /></div>
                  <div className="text-xs text-white/50 font-mono">1.2K Reviews</div>
                </div>
                <div className="w-px h-8 bg-white/20" />
                <div className="flex flex-col items-center">
                  <div className="font-bold text-lg text-white">10K+</div>
                  <div className="text-xs text-white/50 font-mono">Downloads</div>
                </div>
                <div className="w-px h-8 bg-white/20" />
                <div className="flex flex-col items-center">
                  <div className="font-bold text-lg text-white pt-1">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/PEGI_3.svg/1024px-PEGI_3.svg.png" className="h-5 brightness-0 invert opacity-80" alt="Everyone" />
                  </div>
                  <div className="text-xs text-white/50 font-mono mt-1">Everyone</div>
                </div>
              </div>

              {app.link && (
                <a 
                  href={app.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full md:w-auto flex items-center justify-center gap-2 bg-brand-orange text-black font-bold font-sans px-8 py-3 rounded-full hover:bg-white transition-colors"
                >
                  <Download size={20} /> Install / Launch
                </a>
              )}
            </motion.div>
          </div>
          
          {/* Screenshots */}
          {app.screenshots && app.screenshots.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-12 overflow-x-auto pb-4 snap-x flex gap-4 no-scrollbar"
            >
              {app.screenshots.map((img: string, idx: number) => (
                <div key={idx} className="flex-shrink-0 w-64 h-auto md:w-80 snap-center rounded-xl overflow-hidden border border-white/10">
                  <img src={img} className="w-full h-full object-cover" alt={`Screenshot ${idx+1}`} />
                </div>
              ))}
            </motion.div>
          )}

          {/* About Section */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-12"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold font-display text-white">About this app</h2>
              <ChevronRight size={20} className="text-white/40" />
            </div>
            
            <p className="text-white/80 font-sans leading-relaxed mb-6">
              {app.description}
            </p>

            {app.fullDescription && (
              <div className="markdown-body prose prose-invert prose-orange max-w-none prose-headings:font-display prose-headings:font-bold prose-a:text-brand-orange prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10 prose-img:rounded-xl">
                <ReactMarkdown remarkPlugins={[/* import may be needed if we want strict markdown rendering, but omitting works. */]}>
                  {app.fullDescription}
                </ReactMarkdown>
              </div>
            )}

            {app.tags && app.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {app.tags.map((tag: string) => (
                  <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-brand-orange uppercase tracking-widest">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </PageTransition>
  );
}
