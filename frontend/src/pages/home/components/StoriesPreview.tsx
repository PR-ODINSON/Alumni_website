import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { formatDate } from '../../../lib/utils';

interface StoriesPreviewProps {
  stories: any[];
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.6 },
  },
};

export default function StoriesPreview({ stories }: StoriesPreviewProps) {
  if (stories.length === 0) return null;

  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4"
        >
          <div>
            <span className="badge badge-gold mb-3 bg-amber-50 border-amber-200 text-amber-800 text-[10px] font-bold">Alumni Stories</span>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-slate-900 tracking-tight">
              Journeys That<br />Inspire
            </h2>
          </div>
          <Link to="/success-stories" className="btn btn-outline group shrink-0">
            View All Stories
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story: any, i: number) => (
            <motion.div
              key={story._id}
              variants={fadeUp}
              custom={i * 0.1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-200"
            >
              <Link to={`/success-stories/${story._id}`} className="flex flex-col h-full">
                <div className="relative h-44 overflow-hidden border-b border-slate-100">
                  {story.coverImage ? (
                    <img
                      src={story.coverImage}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#001f54] flex items-center justify-center">
                      <Star size={28} className="text-white/40 animate-pulse" />
                    </div>
                  )}
                  <div className="absolute bottom-2.5 left-2.5">
                    <span className="badge bg-white border border-slate-200 text-slate-700 capitalize text-[9px] font-bold shadow-sm">{story.category}</span>
                  </div>
                </div>
                
                <div className="p-5 flex flex-col flex-1 justify-between gap-4 bg-white">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <img
                        src={story.alumni?.avatar || `https://ui-avatars.com/api/?name=${story.alumni?.firstName}&background=001f54&color=fff`}
                        className="w-6 h-6 rounded-full object-cover border border-slate-200"
                        alt=""
                      />
                      <div>
                        <p className="text-[11px] font-bold text-slate-800 leading-tight">{story.alumni?.firstName} {story.alumni?.lastName}</p>
                        <p className="text-[9px] text-slate-400 font-semibold">{formatDate(story.publishedAt || story.createdAt)}</p>
                      </div>
                    </div>
                    
                    <h3 className="font-bold font-display text-slate-900 text-sm leading-snug group-hover:text-brand-600 transition-colors mb-1.5 line-clamp-2">
                      {story.title}
                    </h3>
                  </div>
                  
                  <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed font-medium">{story.subtitle}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
