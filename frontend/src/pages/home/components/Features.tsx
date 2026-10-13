import { motion, type Variants } from 'framer-motion';
import {
  TrendingUp, BookOpen, Globe, Lightbulb, Network, Rocket,
} from 'lucide-react';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.6 },
  },
};

export default function Features() {
  const featuresList = [
    {
      icon: Network,
      title: 'Professional Network',
      desc: 'Build meaningful connections with alumni across industries. Send connection requests, exchange messages, and grow your professional circle.',
      tag: 'Connect',
    },
    {
      icon: TrendingUp,
      title: 'Career Timeline',
      desc: 'Interactive career journey visualization. Showcase your professional milestones and inspire the next generation of IITRAM graduates.',
      tag: 'Showcase',
    },
    {
      icon: Lightbulb,
      title: 'Mentorship System',
      desc: 'Structured mentorship matching, session scheduling, milestone tracking, and feedback. Transform careers through knowledge sharing.',
      tag: 'Mentor',
    },
    {
      icon: Rocket,
      title: 'Startup Ecosystem',
      desc: 'Celebrate entrepreneur alumni. Explore startups founded by IITRAM graduates across sectors from deep tech to social impact.',
      tag: 'Innovate',
    },
    {
      icon: BookOpen,
      title: 'Research Collaboration',
      desc: 'Bridge academia and industry. Faculty, students, and alumni collaborate on cutting-edge research projects.',
      tag: 'Research',
    },
    {
      icon: Globe,
      title: 'Global Alumni Map',
      desc: 'Visualize the worldwide IITRAM footprint. See where graduates are working across 30+ countries.',
      tag: 'Global',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-[#bce7ec]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <span
            className="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 bg-[#DFF3F5] text-[#1597A2] border border-[#bce7ec]"
          >
            Institutional Pillars
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display mb-3 tracking-tight text-slate-900">
            Connecting Academia, Industry<br />and Alumni Success
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto font-medium">
            Fostering lifelong professional connections, infrastructure research collaborations, student career mentorship, and technical innovation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {featuresList.map(({ icon: Icon, title, desc, tag }, i) => (
            <motion.div
              key={title}
              variants={fadeUp}
              custom={i * 0.05}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="group p-6 sm:p-7 bg-white border border-slate-200/80 shadow-xs hover:border-[#1597A2] hover:shadow-md rounded-2xl transition-all duration-200"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 group-hover:scale-105 transition-all duration-200 bg-[#DFF3F5] border border-[#bce7ec]"
              >
                <Icon size={18} className="text-[#1597A2]" />
              </div>
              <div
                className="inline-block px-2.5 py-0.5 rounded-full mb-2.5 text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600"
              >
                {tag}
              </div>
              <h3 className="text-sm sm:text-base font-bold font-display mb-2" style={{ color: '#073F7C' }}>{title}</h3>
              <p className="text-slate-600 text-xs leading-relaxed font-medium">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
