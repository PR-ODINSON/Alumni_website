import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-12 sm:py-16 border-t border-white/10 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 mb-10 sm:mb-12">
          <div className="sm:col-span-2">
            <Link to="/" className="inline-flex items-center gap-3 mb-4 group">
              <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-xl shadow-xs">
                <img
                  src="/new/iitram cdr logo.png"
                  alt="IITRAM Logo"
                  className="w-8 h-8 object-contain"
                />
                <div className="w-px h-5 bg-slate-200" />
                <img
                  src="/new/alumani.jpeg"
                  alt="IITRAM Alumni Relations Logo"
                  className="w-8 h-8 object-contain rounded-full"
                />
              </div>
              <div>
                <span className="font-bold text-white text-sm sm:text-base font-display tracking-tight block">
                  IITRAM Alumni Network
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7dd3dc] block mt-0.5">
                  Alumni Relations · IITRAM
                </span>
              </div>
            </Link>
            <p className="text-xs leading-relaxed max-w-sm text-slate-400 font-medium">
              The official alumni platform of IITRAM — Institute of Infrastructure, Technology, Research and Management, Ahmedabad.
            </p>
          </div>
          {[
            { 
              title: 'Platform', 
              links: [
                { label: 'People Directory', href: '/directory' }, 
                { label: 'Jobs & Careers', href: '/jobs' }, 
                { label: 'Events & Meets', href: '/events' }, 
                { label: 'Mentorship Hub', href: '/mentorship' }
              ] 
            },
            { 
              title: 'IITRAM', 
              links: [
                { label: 'About IITRAM', href: '/institute/about' },
                { label: 'Academics', href: '/institute/academics' },
                { label: 'Departments', href: '/institute/departments' },
                { label: 'Research', href: '/institute/research' },
                { label: 'Alumni Relations', href: '/institute/alumni-relations' },
              ] 
            },
            { 
              title: 'Explore', 
              links: [
                { label: 'Stories & Legacy', href: '/stories' }, 
                { label: 'Research Hub', href: '/research' }, 
                { label: 'Startup Ecosystem', href: '/startups' }, 
                { label: 'Community Feed', href: '/feed' }
              ] 
            },
          ].map(({ title, links }) => (
            <div key={title}>
              <h4 className="text-white font-bold font-display text-xs sm:text-sm mb-3.5 uppercase tracking-wider">
                {title}
              </h4>
              <ul className="space-y-2">
                {links.map(({ label, href }) => (
                  <li key={href}>
                    <Link to={href} className="text-xs text-slate-400 hover:text-white transition-colors font-medium">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-6 sm:pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} IITRAM Alumni Platform. All rights reserved.</p>
          <p>Institute of Infrastructure, Technology, Research and Management · Ahmedabad, Gujarat</p>
        </div>
      </div>
    </footer>
  );
}
