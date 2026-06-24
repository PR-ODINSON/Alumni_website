import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-950/95 backdrop-blur-md text-slate-400 py-16 border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-600 to-brand-500 flex items-center justify-center">
                <span className="text-white font-bold text-xs">IA</span>
              </div>
              <span className="font-bold text-white text-base font-display tracking-wide">IITRAM Alumni Network</span>
            </div>
            <p className="text-xs leading-relaxed max-w-xs text-slate-400">
              The official alumni platform of IITRAM — Institute of Infrastructure, Technology, Research and Management, Ahmedabad.
            </p>
          </div>
          {[
            { 
              title: 'Platform', 
              links: [
                { label: 'Alumni Directory', href: '/alumni' }, 
                { label: 'Jobs & Careers', href: '/jobs' }, 
                { label: 'Events', href: '/events' }, 
                { label: 'Mentorship', href: '/mentorship' }
              ] 
            },
            { 
              title: 'Explore', 
              links: [
                { label: 'Success Stories', href: '/success-stories' }, 
                { label: 'Research Hub', href: '/research' }, 
                { label: 'Analytics', href: '/analytics' }, 
                { label: 'Community Feed', href: '/feed' }
              ] 
            },
          ].map(({ title, links }) => (
            <div key={title}>
              <h4 className="text-white font-bold font-display text-sm mb-4 tracking-wide">{title}</h4>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={href}>
                    <Link to={href} className="text-xs hover:text-white transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px]">
          <p>© {new Date().getFullYear()} IITRAM Alumni Platform. All rights reserved.</p>
          <p>Institute of Infrastructure, Technology, Research and Management · Ahmedabad, Gujarat, India</p>
        </div>
      </div>
    </footer>
  );
}
