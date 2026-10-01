import { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Upload, Download, UserPlus, CheckCircle, AlertCircle,
  FileText, Trash2, RefreshCw, Eye, EyeOff, XCircle,
} from 'lucide-react';
import api from '../../lib/api';
import { convocationPhotoCandidates } from '../../lib/convocationPhoto';
import toast from 'react-hot-toast';

interface UserRow {
  fullName?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: 'student' | 'alumni' | 'faculty';
  enrollmentNumber?: string;
  department?: string;
  batch?: string;
  passingYear?: string;
  degreeType?: string;
  currentYear?: string;
  phone?: string;
  address?: string;
  dateOfIssue?: string;
}

interface ResultRow {
  fullName: string;
  email: string;
  enrollmentNumber: string;
  role: string;
  department: string;
  degreeType: string;
  batch: string | number;
  passingYear: string | number;
  temporaryPassword: string;
  photoUrl?: string;
  status: 'created' | 'updated' | 'pending';
  reason?: string;
}

function parseCSVRows(csvText: string): string[][] {
  const rows: string[][] = [];
  let curRow: string[] = [];
  let curVal = '';
  let inQuotes = false;
  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];
    if (char === '"') {
      if (inQuotes && nextChar === '"') { curVal += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      curRow.push(curVal.trim());
      curVal = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      curRow.push(curVal.trim());
      if (curRow.some(c => c.length > 0)) rows.push(curRow);
      curRow = [];
      curVal = '';
    } else {
      curVal += char;
    }
  }
  if (curVal || curRow.length > 0) {
    curRow.push(curVal.trim());
    if (curRow.some(c => c.length > 0)) rows.push(curRow);
  }
  return rows;
}

function parseCSV(text: string): UserRow[] {
  const allRows = parseCSVRows(text);
  if (allRows.length < 2) return [];
  const headers = allRows[0].map(h => h.toLowerCase().replace(/[\s_-]/g, '').replace(/[^a-z0-9]/g, ''));
  const findCol = (...keys: string[]) => {
    for (const k of keys) {
      const idx = headers.findIndex(h => h.includes(k));
      if (idx !== -1) return idx;
    }
    return -1;
  };
  const cols = {
    fullName: findCol('fullname', 'name', 'studentname'),
    firstName: findCol('firstname', 'first'),
    lastName: findCol('lastname', 'last'),
    email: findCol('email', 'emailid', 'mail'),
    role: findCol('role'),
    enrollmentNumber: findCol('enrollmentnumber', 'enrollment', 'enrol', 'roll'),
    department: findCol('department', 'dept', 'branch'),
    batch: findCol('batch', 'cohort', 'startyear'),
    passingYear: findCol('passingyear', 'graduationyear', 'passing'),
    degreeType: findCol('degreetype', 'degree', 'programme', 'program'),
    currentYear: findCol('currentyear'),
    phone: findCol('phone', 'mobile', 'contact'),
    address: findCol('permanentaddress', 'address', 'addr'),
    dateOfIssue: findCol('dateofissue', 'date', 'issue'),
  };
  const g = (cells: string[], idx: number) => (idx >= 0 ? cells[idx] || '' : '');

  return allRows.slice(1).map(cells => {
    const email = g(cells, cols.email);
    const roleRaw = g(cells, cols.role).toLowerCase();
    const role = (['student', 'alumni', 'faculty'].includes(roleRaw) ? roleRaw : 'alumni') as UserRow['role'];
    return {
      fullName: g(cells, cols.fullName) || undefined,
      firstName: g(cells, cols.firstName) || undefined,
      lastName: g(cells, cols.lastName) || undefined,
      email,
      role,
      enrollmentNumber: g(cells, cols.enrollmentNumber) || undefined,
      department: g(cells, cols.department) || undefined,
      batch: g(cells, cols.batch) || undefined,
      passingYear: g(cells, cols.passingYear) || undefined,
      degreeType: g(cells, cols.degreeType) || undefined,
      currentYear: g(cells, cols.currentYear) || undefined,
      phone: g(cells, cols.phone) || undefined,
      address: g(cells, cols.address) || undefined,
      dateOfIssue: g(cells, cols.dateOfIssue) || undefined,
    };
  }).filter(r => r.email || r.enrollmentNumber || r.fullName || r.firstName);
}

function ConvocationPhoto({ enrollmentNumber }: { enrollmentNumber?: string }) {
  const candidates = convocationPhotoCandidates(enrollmentNumber);
  const [candidateIndex, setCandidateIndex] = useState(0);

  return (
    <img
      src={candidates[Math.min(candidateIndex, candidates.length - 1)]}
      alt=""
      className="w-8 h-9 object-cover rounded border border-slate-200 bg-slate-100"
      onError={() => setCandidateIndex(index => Math.min(index + 1, candidates.length - 1))}
    />
  );
}

const CSV_TEMPLATE = `Full Name,Enrollment Number,Email,Department,Degree,Batch,Passing Year,Phone,Address,Date of Issue,Role
Priya Shah,231040011001,priya.shah@iitram.ac.in,Computer Engineering,B.Tech,2022,2026,+91 98765 43210,"Ahmedabad, Gujarat - 380026",07/09/2026,alumni
Rahul Patel,231040011002,rahul.patel@iitram.ac.in,Mechanical Engineering,B.Tech,2022,2026,+91 98765 43211,"Ahmedabad, Gujarat - 380026",07/09/2026,alumni
Anjali Mehta,221040011003,anjali.mehta@alumni.iitram.ac.in,Civil Engineering,B.Tech,2022,2026,+91 98765 43212,"Ahmedabad, Gujarat - 380026",07/09/2026,alumni`;

export default function AccountGeneratorTab() {
  const fileRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const [rows, setRows] = useState<UserRow[]>([]);
  const [results, setResults] = useState<ResultRow[] | null>(null);
  const [showPasswords, setShowPasswords] = useState(false);

  // Manual add state
  const [m, setM] = useState({
    fullName: '', email: '', enr: '', dept: '', batch: '', passingYear: '', degree: 'B.Tech',
    phone: '', address: '', role: 'alumni' as UserRow['role'],
  });

  const mutation = useMutation({
    mutationFn: (users: UserRow[]) => api.post('/admin/bulk-create-users', { users }),
    onSuccess: async (res: any) => {
      const d = res.data.data;
      setResults(d.results);
      setRows([]);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] }),
        queryClient.invalidateQueries({ queryKey: ['admin-academic-stats'] }),
        queryClient.invalidateQueries({ queryKey: ['admin-academic-records'] }),
        queryClient.invalidateQueries({ queryKey: ['admin-all-users'] }),
      ]);
      toast.success(res.data.message);
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const parsed = parseCSV(ev.target?.result as string);
      if (!parsed.length) { toast.error('No valid rows found. Check CSV format.'); return; }
      setRows(parsed);
      setResults(null);
      const incompleteRows = parsed.filter(user => !user.email.trim() || !user.enrollmentNumber?.trim()).length;
      toast.success(`Loaded ${parsed.length} rows${incompleteRows ? `; ${incompleteRows} will be marked pending` : ''}`);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const addManual = () => {
    if (!m.email || !m.fullName || !m.enr.trim()) { toast.error('Name, email, and enrollment number are required'); return; }
    setRows(p => [...p, {
      fullName: m.fullName,
      email: m.email,
      enrollmentNumber: m.enr || undefined,
      department: m.dept || undefined,
      batch: m.batch || undefined,
      passingYear: m.passingYear || undefined,
      degreeType: m.degree || undefined,
      phone: m.phone || undefined,
      address: m.address || undefined,
      role: m.role,
    }]);
    setM({ fullName: '', email: '', enr: '', dept: '', batch: '', passingYear: '', degree: 'B.Tech', phone: '', address: '', role: 'alumni' });
  };

  const downloadTemplate = () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([CSV_TEMPLATE], { type: 'text/csv' }));
    a.download = 'iitram_users_template.csv';
    a.click();
  };

  const downloadSampleFromServer = async () => {
    try {
      const res = await api.get('/admin/sample-student-csv', { responseType: 'blob' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(res.data as Blob);
      a.download = 'iitram_student_template.csv';
      a.click();
    } catch { toast.error('Failed to download template'); }
  };

  const downloadResults = () => {
    if (!results?.length) return;
    const headers = ['Name', 'Email', 'Enrollment', 'Department', 'Degree', 'Batch', 'Passing Year', 'Role', 'Temporary Password', 'Photo URL', 'Status', 'Reason'];
    const escapeCell = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const csv = [
      headers,
      ...results.map(r => [
        r.fullName, r.email, r.enrollmentNumber, r.department, r.degreeType,
        r.batch, r.passingYear, r.role, r.temporaryPassword, r.photoUrl, r.status, r.reason,
      ]),
    ].map(row => row.map(escapeCell).join(',')).join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    a.download = `iitram_accounts_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const created = results?.filter(r => r.status === 'created') || [];
  const updated = results?.filter(r => r.status === 'updated') || [];
  const pending = results?.filter(r => r.status === 'pending') || [];

  return (
    <div className="space-y-5 max-w-5xl">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Bulk Account Generator</h2>
          <p className="text-sm text-slate-500 mt-0.5 max-w-xl">
            Create portal logins (email + temporary password). Photos are taken from <code className="text-[11px]">/convocation_photos/&lt;enrollment&gt;.jpg</code>. After first login, users reset the password using their enrollment number.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button type="button" onClick={downloadSampleFromServer} className="btn btn-outline btn-sm flex items-center gap-1.5">
            <Download size={13} /> Server Template
          </button>
          <button type="button" onClick={downloadTemplate} className="btn btn-outline btn-sm flex items-center gap-1.5">
            <Download size={13} /> Basic Template
          </button>
        </div>
      </div>

      {/* Info box */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-800">
        <AlertCircle size={15} className="text-blue-500 mt-0.5 shrink-0" />
        <div>
          <p className="font-bold mb-1">Password format: <code className="bg-blue-100 px-1 rounded">FirstName@Last4OfEnrollment</code></p>
          <p>Example: Enrollment <strong>231040011001</strong> → Password <strong>Priya@1001</strong></p>
          <p className="mt-1 text-blue-600">Users sign in with email + this temp password, then reset by entering enrollment number. Photos auto-match <code>convocation_photos/&lt;enrollment&gt;.jpg</code> or .jpeg.</p>
          <p className="mt-1">CSV fields: Full Name, Enrollment Number, Email, Department, Degree, Batch, Passing Year, Phone, Address, Date of Issue, Role</p>
        </div>
      </div>

      {/* Upload + Manual row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* CSV upload */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2"><Upload size={14} /> Upload CSV</h3>
          <label className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-brand-400 hover:bg-blue-50/30 transition-all">
            <FileText size={22} className="text-slate-400" />
            <span className="text-sm font-semibold text-slate-600">Click to upload .csv</span>
            <span className="text-xs text-slate-400 text-center">Required: name, email, enrollment number<br/>Fields: department, degree, batch, phone, address, role</span>
            <input ref={fileRef} type="file" accept=".csv,.txt" onChange={handleFile} className="hidden" />
          </label>
        </div>

        {/* Manual single add */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2"><UserPlus size={14} /> Add Single User</h3>
          <div className="space-y-2">
            <input value={m.fullName} onChange={e => setM(p => ({ ...p, fullName: e.target.value }))} placeholder="Full Name *" className="input h-9 text-xs" />
            <input value={m.email} onChange={e => setM(p => ({ ...p, email: e.target.value }))} placeholder="Email address *" className="input h-9 text-xs" type="email" />
            <div className="grid grid-cols-2 gap-2">
              <input value={m.enr} onChange={e => setM(p => ({ ...p, enr: e.target.value }))} placeholder="Enrollment No. *" className="input h-9 text-xs" required />
              <input value={m.dept} onChange={e => setM(p => ({ ...p, dept: e.target.value }))} placeholder="Department" className="input h-9 text-xs" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input value={m.degree} onChange={e => setM(p => ({ ...p, degree: e.target.value }))} placeholder="Degree (B.Tech)" className="input h-9 text-xs" />
              <input value={m.passingYear} onChange={e => setM(p => ({ ...p, passingYear: e.target.value }))} placeholder="Passing year" className="input h-9 text-xs" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input value={m.phone} onChange={e => setM(p => ({ ...p, phone: e.target.value }))} placeholder="Phone" className="input h-9 text-xs" />
              <select value={m.role} onChange={e => setM(p => ({ ...p, role: e.target.value as any }))} className="input h-9 text-xs">
                <option value="alumni">Alumni</option>
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
              </select>
            </div>
            <input value={m.address} onChange={e => setM(p => ({ ...p, address: e.target.value }))} placeholder="Permanent address" className="input h-9 text-xs" />
            <button type="button" onClick={addManual} className="btn btn-primary btn-sm w-full justify-center">
              <UserPlus size={13} /> Add to Queue
            </button>
          </div>
        </div>
      </div>

      {/* Queue preview */}
      {rows.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <p className="text-sm font-bold text-slate-800">{rows.length} users queued</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => setRows([])} className="btn btn-sm text-xs border border-red-200 text-red-600 bg-white hover:bg-red-50">
                <Trash2 size={12} /> Clear
              </button>
              <button type="button" disabled={mutation.isPending} onClick={() => mutation.mutate(rows)} className="btn btn-primary btn-sm">
                {mutation.isPending
                  ? <><RefreshCw size={12} className="animate-spin" /> Creating…</>
                  : <><UserPlus size={12} /> Create {rows.length} Accounts</>}
              </button>
            </div>
          </div>
          <div className="overflow-x-auto max-h-56 overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-100">
                <tr>
                  {['Photo', 'Name', 'Email', 'Enrollment', 'Dept', 'Degree', 'Phone', 'Role', ''].map(h => (
                    <th key={h} className="text-left px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {rows.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-3 py-2">
                      {r.enrollmentNumber ? (
                        <ConvocationPhoto enrollmentNumber={r.enrollmentNumber} />
                      ) : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-3 py-2 font-medium text-slate-900 whitespace-nowrap">{r.fullName || `${r.firstName} ${r.lastName}`}</td>
                    <td className="px-3 py-2 text-slate-500">{r.email}</td>
                    <td className="px-3 py-2 text-slate-400">{r.enrollmentNumber || '—'}</td>
                    <td className="px-3 py-2 text-slate-400 max-w-[100px] truncate">{r.department || '—'}</td>
                    <td className="px-3 py-2 text-slate-400">{r.degreeType || '—'}</td>
                    <td className="px-3 py-2 text-slate-400">{r.phone || '—'}</td>
                    <td className="px-3 py-2">
                      <span className={`badge ${r.role === 'alumni' ? 'badge-success' : r.role === 'faculty' ? 'badge-primary' : 'badge-slate'} capitalize`}>{r.role}</span>
                    </td>
                    <td className="px-3 py-2">
                      <button type="button" onClick={() => setRows(p => p.filter((_, j) => j !== i))} className="text-slate-300 hover:text-red-500 transition-colors">
                        <XCircle size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Results */}
      {results && results.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 flex-wrap gap-3">
            <div className="flex items-center gap-4 flex-wrap">
              {created.length > 0 && <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-700"><CheckCircle size={14} /> {created.length} created</span>}
              {updated.length > 0 && <span className="flex items-center gap-1.5 text-sm font-bold text-blue-700"><CheckCircle size={14} /> {updated.length} updated</span>}
              {pending.length > 0 && <span className="flex items-center gap-1.5 text-sm font-bold text-amber-700"><AlertCircle size={14} /> {pending.length} pending</span>}
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setShowPasswords(!showPasswords)} className="btn btn-outline btn-sm flex items-center gap-1.5">
                {showPasswords ? <EyeOff size={13} /> : <Eye size={13} />} {showPasswords ? 'Hide' : 'Show'} Passwords
              </button>
              <button type="button" onClick={downloadResults} className="btn btn-primary btn-sm flex items-center gap-1.5">
                <Download size={13} /> Download Credentials CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto max-h-80 overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-100">
                <tr>
                  {['Name', 'Email', 'Enrollment', 'Dept', 'Role', 'Password', 'Photo', 'Status'].map(h => (
                    <th key={h} className="text-left px-3 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {results.map((r, i) => (
                  <tr key={i} className={`hover:bg-slate-50 ${r.status === 'pending' ? 'bg-amber-50/40' : ''}`}>
                    <td className="px-3 py-2 font-medium text-slate-900 whitespace-nowrap">{r.fullName}</td>
                    <td className="px-3 py-2 text-slate-600">{r.email}</td>
                    <td className="px-3 py-2 text-slate-400">{r.enrollmentNumber}</td>
                    <td className="px-3 py-2 text-slate-400 max-w-[100px] truncate">{r.department}</td>
                    <td className="px-3 py-2 capitalize text-slate-500">{r.role}</td>
                    <td className="px-3 py-2 font-mono font-bold text-emerald-700">
                      {r.status === 'pending' ? <span className="text-amber-700 text-[10px]">{r.reason}</span> : showPasswords ? r.temporaryPassword : '••••••••'}
                    </td>
                    <td className="px-3 py-2">
                      {r.photoUrl ? <a href={r.photoUrl} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline">View photo</a> : '—'}
                    </td>
                    <td className="px-3 py-2">
                      <span className={`badge capitalize ${r.status === 'created' ? 'badge-success' : r.status === 'updated' ? 'badge-primary' : 'badge-warning'}`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
