import { Outlet } from 'react-router-dom';
import { InstituteNav } from '../../components/institute/InstitutePageHeader';

export default function InstituteLayout() {
  return (
    <div className="py-4 bg-transparent font-sans text-slate-800 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <InstituteNav />
      <Outlet />
    </div>
  );
}
