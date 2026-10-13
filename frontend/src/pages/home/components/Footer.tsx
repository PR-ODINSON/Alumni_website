import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer
      className="py-12 sm:py-16 relative z-10"
      style={{
        background: 'linear-gradient(135deg, #042226 0%, #073F7C 55%, #0B6169 100%)',
        borderTop: '4px solid #D6DF8E',
        color: '#DFF3F5',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-10 sm:mb-12">
          <div className="sm:col-span-2">
            <Link to="/" className="inline-flex items-center gap-3 mb-4 group">
              <div
                className="flex items-center gap-2 p-1.5 rounded-2xl shadow-sm"
                style={{ background: '#DFF3F5', border: '2px solid #D6DF8E' }}
              >
                <img
                  src="/new/iitram cdr logo.png"
                  alt="IITRAM Logo"
                  className="w-9 h-9 object-contain bg-white rounded-full p-0.5"
                />
                <div className="w-[1px] h-6 bg-[#1597A2]/30" />
                <img
                  src="/new/alumani.jpeg"
                  alt="IITRAM Alumni Relations Logo"
                  className="w-9 h-9 object-contain bg-white rounded-full p-0.5"
                />
              </div>
              <div>
                <span className="font-bold text-white text-sm sm:text-base font-display tracking-tight block">IITRAM Alumni Network</span>
                <span
                  className="text-[10px] font-extrabold uppercase tracking-wider inline-block mt-1 px-2 py-0.5 rounded"
                  style={{ background: '#D6DF8E', color: '#000000' }}
                >
                  ALUMNI RELATIONS, IITRAM
                </span>
              </div>
            </Link>
            <p className="text-xs leading-relaxed max-w-sm font-medium" style={{ color: '#DFF3F5' }}>
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
              <h4 className="font-extrabold font-display text-xs sm:text-sm mb-3.5 uppercase tracking-wider" style={{ color: '#D6DF8E' }}>
                {title}
              </h4>
              <ul className="space-y-2">
                {links.map(({ label, href }) => (
                  <li key={href}>
                    <Link to={href} className="text-xs text-[#DFF3F5]/85 hover:text-[#D6DF8E] transition-colors font-medium">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div
          className="pt-6 sm:pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-semibold"
          style={{ borderColor: 'rgba(214, 223, 142, 0.25)', color: '#DFF3F5' }}
        >
          <div className="flex items-center gap-2">
            <img src="/new/iitram cdr logo.png" alt="IITRAM" className="w-6 h-6 object-contain bg-white rounded-full p-0.5" />
            <img src="/new/alumani.jpeg" alt="Alumni Relations" className="w-6 h-6 object-contain bg-white rounded-full p-0.5" />
            <p>© {new Date().getFullYear()} IITRAM Alumni Platform. All rights reserved.</p>
          </div>
          <p style={{ color: '#D6DF8E' }}>Institute of Infrastructure, Technology, Research and Management · Ahmedabad, Gujarat</p>
        </div>
      </div>
    </footer>
  );
}
