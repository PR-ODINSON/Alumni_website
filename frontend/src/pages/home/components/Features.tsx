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
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="badge badge-primary mb-4">Platform Capabilities</span>
          <h2 className="text-3xl md:text-4xl font-bold font-display text-slate-900 mb-4 tracking-tight">
            Everything an Institutional<br />Alumni Platform Should Be
          </h2>
          <p className="text-slate-500 text-sm max-w-xl mx-auto font-medium">
            A purpose-built ecosystem for IITRAM — far beyond a simple alumni directory.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuresList.map(({ icon: Icon, title, desc, tag }, i) => (
            <motion.div
              key={title}
              variants={fadeUp}
              custom={i * 0.05}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="group p-8 bg-white border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 rounded-2xl transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 group-hover:bg-[#001f54] group-hover:text-white transition-colors duration-200">
                <Icon size={18} className="text-[#001f54] group-hover:text-white transition-colors" />
              </div>
              <div className="badge badge-primary mb-3 bg-slate-50 border-slate-200 text-slate-700 text-[10px] font-bold">{tag}</div>
              <h3 className="text-base font-bold font-display text-slate-900 mb-2">{title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed font-medium">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
