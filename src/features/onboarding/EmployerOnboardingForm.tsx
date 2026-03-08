import { useNavigate } from '@tanstack/react-router'
import { useState, useMemo, useRef, useEffect } from 'react'
import {
  FiUser, FiChevronDown, FiSearch, FiMapPin,
  FiArrowRight, FiFileText, FiBookOpen,
  FiBriefcase,
} from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../i18n/language'

// ─── Types ────────────────────────────────────────────────────────────────────
interface FormData {
  employerName: string
  jobTitle: string
  jobDescription: string
  jobLocation: string
  payAmount: string
  payType: 'monthly' | 'yearly'
  educationLevel: string
}

const REQUIRED_FIELDS: (keyof FormData)[] = [
  'employerName', 'jobTitle', 'jobDescription', 'jobLocation', 'educationLevel',
]

// ─── Progress Dots ────────────────────────────────────────────────────────────
function ProgressDots({ progress }: { progress: number }) {
  const thresholds = [0, 0.5, 1]
  return (
    <div className="flex items-center">
      {thresholds.map((threshold, i) => {
        const active = progress >= threshold
        const isLast = i === thresholds.length - 1
        return (
          <div key={i} className="flex items-center">
            <div className="relative w-5 h-5 flex items-center justify-center">
              <motion.div
                className="absolute inset-0 rounded-full border-2"
                animate={{ borderColor: active ? '#3F51B5' : '#d1d5db' }}
                transition={{ duration: 0.4 }}
              />
              <motion.div
                className="rounded-full bg-[#3F51B5]"
                animate={{ width: active ? 8 : 0, height: active ? 8 : 0, opacity: active ? 1 : 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              />
            </div>
            {!isLast && (
              <div className="relative w-12 h-0.5 bg-gray-200 overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-[#3F51B5]"
                  animate={{ width: progress >= thresholds[i + 1] ? '100%' : '0%' }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Field Box ────────────────────────────────────────────────────────────────
function FieldBox({ children, icon, noPadIcon }: {
  children: React.ReactNode; icon?: React.ReactNode; noPadIcon?: boolean
}) {
  return (
    <div className="flex items-start border border-gray-200 rounded-xl bg-white hover:border-[#3F51B5]/40 focus-within:border-[#3F51B5] focus-within:shadow-[0_0_0_3px_rgba(63,81,181,0.1)] transition-all duration-200">
      {icon && (
        <div className={`flex items-center justify-center pl-4 text-[#3F51B5] shrink-0 ${noPadIcon ? 'pt-3' : 'pt-[13px]'}`}>
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  )
}

// ─── Searchable Dropdown ──────────────────────────────────────────────────────
function SearchDropdown({ options, value, onChange, placeholder, icon, subLabel, searchPlaceholder, noResultsText }: {
  options: string[]; value: string; onChange: (v: string) => void
  placeholder: string; icon: React.ReactNode; subLabel?: string
  searchPlaceholder: string; noResultsText: string
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  const filtered = useMemo(
    () => options.filter((o) => o.toLowerCase().includes(query.toLowerCase())),
    [options, query]
  )

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <div
        onClick={() => setOpen((o) => !o)}
        className="flex items-center border border-gray-200 rounded-xl bg-white hover:border-[#3F51B5]/40 transition-all duration-200 cursor-pointer"
      >
        <div className="flex items-center justify-center pl-4 text-[#3F51B5] shrink-0">{icon}</div>
        <div className="flex-1 px-3 py-3">
          <div className="text-sm font-semibold text-slate-700">{placeholder}</div>
          {value
            ? <div className="text-[12px] text-slate-500 mt-0.5">{value}</div>
            : subLabel && <div className="text-[12px] text-slate-400 mt-0.5">{subLabel}</div>
          }
        </div>
        <FiChevronDown size={16} className={`mr-4 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden"
          >
            <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
              <FiSearch size={14} className="text-slate-400 shrink-0" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                placeholder={searchPlaceholder}
                className="flex-1 text-sm outline-none bg-transparent placeholder-slate-400 text-slate-700"
              />
            </div>
            <div className="max-h-36 overflow-y-auto zupro-scroll">
              {filtered.length === 0
                ? <div className="px-4 py-3 text-sm text-slate-400">{noResultsText}</div>
                : filtered.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => { onChange(opt); setOpen(false); setQuery('') }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors duration-100 ${value === opt ? 'bg-indigo-50 text-[#3F51B5] font-semibold' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    {opt}
                  </button>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Simple Dropdown ──────────────────────────────────────────────────────────
function SimpleDropdown({ options, value, onChange, placeholder, icon }: {
  options: string[]; value: string; onChange: (v: string) => void
  placeholder: string; icon: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <div
        onClick={() => setOpen((o) => !o)}
        className="flex items-center border border-gray-200 rounded-xl bg-white hover:border-[#3F51B5]/40 transition-all duration-200 cursor-pointer px-4 py-3 gap-3"
      >
        <span className="text-[#3F51B5] shrink-0">{icon}</span>
        <span className={`flex-1 text-sm font-medium ${value ? 'text-slate-800' : 'text-slate-400'}`}>
          {value || placeholder}
        </span>
        <FiChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden"
          >
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => { onChange(opt); setOpen(false) }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-100 ${value === opt ? 'bg-indigo-50 text-[#3F51B5] font-semibold' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                {opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Pay Input ────────────────────────────────────────────────────────────────
function PayInput({
  amount,
  payType,
  onAmountChange,
  onTypeChange,
  payPlaceholder,
  payDayWise,
  payPerShift,
}: {
  amount: string; payType: 'monthly' | 'yearly'
  onAmountChange: (v: string) => void; onTypeChange: (v: 'monthly' | 'yearly') => void
  payPlaceholder: string; payDayWise: string; payPerShift: string
}) {
  return (
    <div className="flex items-center border border-gray-200 rounded-xl bg-white hover:border-[#3F51B5]/40 focus-within:border-[#3F51B5] focus-within:shadow-[0_0_0_3px_rgba(63,81,181,0.1)] transition-all duration-200 overflow-hidden">
      <div className="flex items-center gap-1.5 pl-4 text-[#3F51B5] shrink-0">
        <span className="text-sm font-semibold text-slate-500">₹</span>
      </div>
      <input
        type="number"
        min={0}
        value={amount}
        onChange={(e) => onAmountChange(e.target.value)}
        placeholder={payPlaceholder}
        className="flex-1 px-3 py-3 text-sm text-slate-800 placeholder-slate-400 bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <div className="flex items-center gap-1 mr-3 bg-slate-100 rounded-lg p-1">
        {(['monthly', 'yearly'] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onTypeChange(type)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all duration-200 ${payType === type ? 'bg-[#3F51B5] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {type === 'monthly' ? payDayWise : payPerShift}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Stat ─────────────────────────────────────────────────────────────────────
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-white text-lg font-bold">{value}</p>
      <p className="text-indigo-300 text-xs mt-0.5">{label}</p>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function EmployerOnboardingForm() {
  const navigate = useNavigate()
  const { t } = useLanguage()

  const [form, setForm] = useState<FormData>({
    employerName: '', jobTitle: '', jobDescription: '',
    jobLocation: '', payAmount: '', payType: 'monthly', educationLevel: '',
  })

  const set = (key: keyof FormData) => (val: string) =>
    setForm((prev) => ({ ...prev, [key]: val }))

  const filledCount = REQUIRED_FIELDS.filter((f) => form[f].trim() !== '').length
  const progress = filledCount / REQUIRED_FIELDS.length
  const allFilled = filledCount === REQUIRED_FIELDS.length

  const handleNext = () => {
    if (!allFilled) return
    navigate({ to: '/auth' })
  }

  return (
    // Outer shell: full viewport, no overflow whatsoever
    <div
      className="h-screen w-screen overflow-hidden bg-[#f0f0f5] flex items-center justify-center p-4"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* Card: fixed height, never grows beyond viewport */}
      <div
        className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex"
        style={{ height: 'min(700px, calc(100vh - 2rem))' }}
      >

        {/* ── Left Panel (static, no scroll) ── */}
        <div className="hidden md:flex flex-col justify-between w-[42%] bg-[#1e1b4b] p-8 relative overflow-hidden shrink-0">
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />

          {/* Logo */}
          <div>
            <span
              className="text-white text-3xl font-extrabold tracking-tight select-none"
              style={{ fontFamily: '"Trebuchet MS", "Gill Sans", sans-serif' }}
            >
              Zupro
            </span>
            <div className="mt-0.5 w-10 h-1 rounded-full bg-amber-400" />
          </div>

          {/* Hero */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 text-indigo-200 text-xs font-medium px-3 py-1.5 rounded-full mb-3">
              <FiBriefcase size={12} />
              {t.onboarding.employer.portalBadge}
            </div>
            <h2 className="text-white text-2xl font-bold leading-snug mb-3">
              {t.onboarding.employer.title}
            </h2>
            <p className="text-indigo-200 text-sm leading-relaxed">
              {t.onboarding.employer.subtitle}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <Stat value="1000+" label={t.onboarding.employer.stats.activeSeekers} />
              <Stat value="12h" label={t.onboarding.employer.stats.avgFirstMatch} />
              <Stat value="Free" label={t.onboarding.employer.stats.freeToPost} />
              <Stat value="Build Trust" label={t.onboarding.employer.stats.trust} />
            </div>
          </div>

          {/* Footer */}
          <div>
            <p className="text-indigo-300 text-xs">{t.onboarding.employer.needHelp}</p>
            <p className="text-amber-400 text-sm font-semibold mt-0.5">help@zupro.in</p>
          </div>
        </div>

        {/* ── Right Panel: three-row flex column ── */}
        {/*   Row 1 (shrink-0): heading + progress — never scrolls               */}
        {/*   Row 2 (flex-1, overflow-y-auto): form fields — scrolls internally  */}
        {/*   Row 3 (shrink-0): CTA button — always visible at bottom            */}
        <div className="flex-1 flex flex-col min-h-0 px-7 pt-6 pb-5 overflow-hidden">

          {/* Row 1 — fixed header */}
          <div className="shrink-0 mb-3">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-slate-400 font-medium">
                {t.onboarding.employer.step} <span className="text-[#3F51B5] font-bold">1</span> {t.onboarding.employer.of} 2
              </p>
              <ProgressDots progress={progress} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 leading-tight">{t.onboarding.employer.jobDetails}</h3>
            <p className="text-sm text-slate-400 mt-0.5">{t.onboarding.employer.jobDetailsSubtitle}</p>
          </div>

          {/* Row 2 — scrollable fields */}
          <div className="flex-1 overflow-y-auto zupro-scroll min-h-0">
            <div className="flex flex-col gap-2.5 py-1 pr-1">

              <FieldBox icon={<FiUser size={15} />}>
                <input
                  type="text"
                  value={form.employerName}
                  onChange={(e) => set('employerName')(e.target.value)}
                  placeholder={t.onboarding.employer.placeholders.employerName}
                  className="w-full px-3 py-3 text-sm text-slate-800 placeholder-slate-400 bg-transparent outline-none"
                />
              </FieldBox>

              <SearchDropdown
                options={[...t.onboarding.employer.options.jobTitles]}
                value={form.jobTitle}
                onChange={set('jobTitle')}
                placeholder={t.onboarding.employer.placeholders.jobTitle}
                subLabel={t.onboarding.employer.placeholders.jobTitleSubLabel}
                searchPlaceholder={t.onboarding.employer.placeholders.search}
                noResultsText={t.onboarding.employer.placeholders.noResults}
                icon={<FiBriefcase size={15} />}
              />

              <FieldBox icon={<FiFileText size={15} />} noPadIcon>
                <textarea
                  value={form.jobDescription}
                  onChange={(e) => set('jobDescription')(e.target.value)}
                  placeholder={t.onboarding.employer.placeholders.jobDescription}
                  rows={2}
                  className="w-full px-3 py-3 text-sm text-slate-800 placeholder-slate-400 bg-transparent outline-none resize-none"
                />
              </FieldBox>

              <FieldBox icon={<FiMapPin size={15} />}>
                <input
                  type="text"
                  value={form.jobLocation}
                  onChange={(e) => set('jobLocation')(e.target.value)}
                  placeholder={t.onboarding.employer.placeholders.jobLocation}
                  className="w-full px-3 py-3 text-sm text-slate-800 placeholder-slate-400 bg-transparent outline-none"
                />
              </FieldBox>

              <div>
                <PayInput
                  amount={form.payAmount}
                  payType={form.payType}
                  onAmountChange={set('payAmount')}
                  onTypeChange={(v) => setForm((p) => ({ ...p, payType: v }))}
                  payPlaceholder={t.onboarding.employer.placeholders.pay}
                  payDayWise={t.onboarding.employer.placeholders.payDayWise}
                  payPerShift={t.onboarding.employer.placeholders.payPerShift}
                />
                <p className="text-[11px] text-slate-400 mt-1 ml-1">{t.onboarding.employer.placeholders.payHint}</p>
              </div>

              <SimpleDropdown
                options={[...t.onboarding.employer.options.education]}
                value={form.educationLevel}
                onChange={set('educationLevel')}
                placeholder={t.onboarding.employer.placeholders.education}
                icon={<FiBookOpen size={15} />}
              />

            </div>
          </div>

          {/* Row 3 — fixed CTA */}
          <div className="shrink-0 pt-4">
            <motion.button
              onClick={handleNext}
              disabled={!allFilled}
              whileHover={allFilled ? { scale: 1.015 } : {}}
              whileTap={allFilled ? { scale: 0.985 } : {}}
              className={`w-full py-3.5 rounded-xl text-white font-bold text-[15px] flex items-center justify-center gap-2 transition-all duration-300 ${
                allFilled
                  ? 'bg-[#3F51B5] shadow-[0_4px_20px_rgba(63,81,181,0.35)] cursor-pointer'
                  : 'bg-slate-300 cursor-not-allowed'
              }`}
            >
              {t.onboarding.employer.continue}
              <FiArrowRight size={18} />
            </motion.button>
          </div>

        </div>
      </div>
    </div>
  )
}
