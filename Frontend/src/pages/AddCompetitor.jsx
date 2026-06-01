import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCreateCompetitor } from '../hooks/useCompetitors';

const INITIAL = {
  name: '',
  websiteUrl: '',
  linkedinUrl: '',
  indeedTerm: '',
  g2Url: '',
  frequency: 'daily',
  notes: '',
};

const FIELDS = [
  { key: 'name',        label: 'Competitor Name',       type: 'text',     required: true,  placeholder: 'e.g. Acme Corp' },
  { key: 'websiteUrl',  label: 'Website URL',            type: 'url',      required: true,  placeholder: 'https://acmecorp.com' },
  { key: 'linkedinUrl', label: 'LinkedIn Company URL',   type: 'text',     required: false, placeholder: 'https://linkedin.com/company/acme' },
  { key: 'indeedTerm',  label: 'Indeed Search Term',     type: 'text',     required: false, placeholder: 'e.g. Acme Corp' },
  { key: 'g2Url',       label: 'G2 Profile URL',         type: 'text',     required: false, placeholder: 'https://g2.com/products/acme' },
];

function validate(form) {
  const errors = {};
  if (!form.name.trim())       errors.name = 'Competitor name is required.';
  if (!form.websiteUrl.trim()) errors.websiteUrl = 'Website URL is required.';
  else if (!/^https?:\/\/.+/.test(form.websiteUrl))
    errors.websiteUrl = 'Enter a valid URL starting with http:// or https://';
  return errors;
}

export default function AddCompetitor() {
  const navigate = useNavigate();
  const { createCompetitor, isCreating } = useCreateCompetitor();
  const [form,   setForm]   = useState(INITIAL);
  const [errors, setErrors] = useState({});

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    try {
      await createCompetitor(form);
      navigate('/dashboard');
    } catch {
      // error toast fired by mutation onError
    }
  };

  return (
    <>
      <div className="mx-auto max-w-2xl">
        {/* Page header */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white">Add Competitor</h2>
          <p className="text-sm text-slate-400 mt-0.5">Track a new competitor across all monitoring channels.</p>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-slate-700 bg-slate-800">
          <form onSubmit={handleSubmit} noValidate>
            <div className="p-6 space-y-5">

              {/* Text / URL fields */}
              {FIELDS.map(({ key, label, type, required, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    {label}
                    {required && <span className="text-red-400 ml-0.5">*</span>}
                  </label>
                  <input
                    type={type}
                    value={form[key]}
                    onChange={set(key)}
                    placeholder={placeholder}
                    className={`w-full rounded-lg border bg-slate-900 px-3 py-2.5 text-sm text-white placeholder-slate-500
                      outline-none transition-colors
                      focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                      ${errors[key] ? 'border-red-500' : 'border-slate-600 hover:border-slate-500'}`}
                  />
                  {errors[key] && (
                    <p className="mt-1 text-xs text-red-400">{errors[key]}</p>
                  )}
                </div>
              ))}

              {/* Monitoring Frequency */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Monitoring Frequency <span className="text-red-400">*</span>
                </label>
                <select
                  value={form.frequency}
                  onChange={set('frequency')}
                  className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2.5 text-sm text-white
                    outline-none hover:border-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={set('notes')}
                  rows={3}
                  placeholder="Any additional context about this competitor..."
                  className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2.5 text-sm text-white
                    placeholder-slate-500 outline-none resize-none hover:border-slate-500
                    focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>

            {/* Footer actions */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-700 px-6 py-4">
              <button
                type="button"
                onClick={() => navigate('/competitors')}
                className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-slate-300
                  hover:bg-slate-700 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white
                  hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {isCreating && <Loader2 size={15} className="animate-spin" />}
                {isCreating ? 'Saving…' : 'Add Competitor'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
