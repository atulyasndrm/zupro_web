import { useNavigate } from '@tanstack/react-router'
import { useState, useMemo, useRef, useEffect } from 'react'
import {
  FiUser, FiCalendar, FiChevronDown, FiSearch,
  FiMapPin, FiBookOpen, FiArrowRight,
} from 'react-icons/fi'
import { PiGenderIntersexBold } from 'react-icons/pi'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../i18n/language'


// ─── Types ────────────────────────────────────────────────────────────────────
interface FormData {
  name: string
  age: string
  gender: string
  profession: string
  location: string
  education: string
}

const FIELDS: (keyof FormData)[] = ['name', 'age', 'gender', 'profession', 'location', 'education']

// ─── Progress Dots ────────────────────────────────────────────────────────────
function ProgressDots({ progress }: { progress: number }) {
  // progress: 0–1
  const dots = 3
  // dot 0 active when progress >= 0, dot 1 at >= 0.5, dot 2 at >= 1
  const thresholds = [0, 0.5, 1]

  return (
    <div className="flex items-center gap-0">
      {Array.from({ length: dots }).map((_, i) => {
        const active = progress >= thresholds[i]
        const isLast = i === dots - 1

        return (
          <div key={i} className="flex items-center">
            {/* Dot */}
            <div className="relative w-5 h-5 flex items-center justify-center">
              {/* outer ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-2"
                animate={{ borderColor: active ? '#3F51B5' : '#d1d5db' }}
                transition={{ duration: 0.4 }}
              />
              {/* filled inner */}
              <motion.div
                className="rounded-full bg-[#3F51B5]"
                animate={{ width: active ? 8 : 0, height: active ? 8 : 0, opacity: active ? 1 : 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              />
            </div>

            {/* Connector line */}
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

// ─── Field Wrapper ────────────────────────────────────────────────────────────
function FieldBox({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="relative flex items-start border border-gray-200 rounded-xl bg-white hover:border-[#3F51B5]/40 focus-within:border-[#3F51B5] focus-within:shadow-[0_0_0_3px_rgba(63,81,181,0.1)] transition-all duration-200">
      {icon && (
        <div className="flex items-center justify-center pl-4 pt-[14px] text-[#3F51B5] shrink-0">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  )
}

// ─── Searchable Dropdown ──────────────────────────────────────────────────────
function SearchDropdown({
  options,
  value,
  onChange,
  placeholder,
  icon,
  subLabel,
  searchPlaceholder,
  noResultsText,
}: {
  options: string[]
  value: string
  onChange: (v: string) => void
  placeholder: string
  icon: React.ReactNode
  subLabel?: string
  searchPlaceholder: string
  noResultsText: string
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  const filtered = useMemo(
    () => options.filter((o) => o.toLowerCase().includes(query.toLowerCase())),
    [options, query]
  )

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <div
        className="relative flex items-center border border-gray-200 rounded-xl bg-white hover:border-[#3F51B5]/40 focus-within:border-[#3F51B5] focus-within:shadow-[0_0_0_3px_rgba(63,81,181,0.1)] transition-all duration-200 cursor-pointer"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex items-center justify-center pl-4 text-[#3F51B5] shrink-0">
          {icon}
        </div>
        <div className="flex-1 px-3 py-3.5">
          <div className="text-sm font-semibold text-slate-700">{placeholder}</div>
          {value && <div className="text-[13px] text-slate-500 mt-0.5">{value}</div>}
          {!value && subLabel && <div className="text-[13px] text-slate-400 mt-0.5 flex items-center gap-1">{subLabel}</div>}
        </div>
        <FiChevronDown
          size={16}
          className={`mr-4 text-slate-400 transition-transform duration-200 ${open ? `rotate-180` : ``}`}
        />
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
            {/* Search bar inside dropdown */}
            <div className="flex items-center gap-2 px-3 py-2.5 border-b border-gray-100">
              <FiSearch size={14} className="text-slate-400 shrink-0" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="flex-1 text-sm outline-none bg-transparent placeholder-slate-400 text-slate-700"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="max-h-48 overflow-y-auto zupro-scroll">
              {filtered.length === 0 ? (
                <div className="px-4 py-3 text-sm text-slate-400">{noResultsText}</div>
              ) : (
                filtered.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => { onChange(opt); setOpen(false); setQuery('') }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-100 ${value === opt ? `bg-[#3F51B5]/8 text-[#3F51B5] font-semibold` : `text-slate-700 hover:bg-slate-50`}`}
                  >
                    {opt}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Simple Dropdown ──────────────────────────────────────────────────────────
function SimpleDropdown({
  options,
  value,
  onChange,
  placeholder,
  icon,
}: {
  options: string[]
  value: string
  onChange: (v: string) => void
  placeholder: string
  icon: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <div
        className="flex items-center border border-gray-200 rounded-xl bg-white hover:border-[#3F51B5]/40 transition-all duration-200 cursor-pointer px-4 py-3.5 gap-3"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="text-[#3F51B5] shrink-0">{icon}</span>
        <span className={`flex-1 text-sm font-medium ${value ? `text-slate-800` : `text-slate-400`}`}>
          {value || placeholder}
        </span>
        <FiChevronDown
          size={16}
          className={`text-slate-400 transition-transform duration-200 ${open ? `rotate-180` : ``}`}
        />
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
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-100 ${value === opt ? `text-[#3F51B5] font-semibold bg-indigo-50` : `text-slate-700 hover:bg-slate-50`}`}
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

// ─── Main Page ────────────────────────────────────────────────────────────────
export function SeekerOnboardingForm() {
  const navigate = useNavigate()
  const { t } = useLanguage()

  const [form, setForm] = useState<FormData>({
    name: '', age: '', gender: '', profession: '', location: '', education: '',
  })

  const set = (key: keyof FormData) => (val: string) =>
    setForm((prev) => ({ ...prev, [key]: val }))

  // Progress: count filled fields / total, clamp 0–1
  const filledCount = FIELDS.filter((f) => form[f].trim() !== '').length
  const progress = filledCount / FIELDS.length  // 0 → 1

  const allFilled = filledCount === FIELDS.length

  const handleNext = () => {
    if (!allFilled) return
    navigate({ to: '/auth' })
  }

  return (
    <div
      className="min-h-screen bg-[#f0f0f5] flex items-center justify-center p-4"
      style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
    >
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex min-h-[600px]">

        {/* ── Left Panel ─────────────────────────────────────────────────────── */}
        <div className="hidden md:flex flex-col justify-between w-[42%] bg-[#1e1b4b] p-9">
          {/* Logo */}
          <div>
            <div className="mb-1">
              <span
                className="text-white text-3xl font-extrabold tracking-tight select-none"
                style={{ fontFamily: '"Trebuchet MS", "Gill Sans", sans-serif' }}
              >
                Zupro
              </span>
              <div className="mt-0.5 w-10 h-1 rounded-full bg-amber-400" />
            </div>
          </div>

          {/* Hero text */}
          <div>
            <h2 className="text-white text-3xl font-bold leading-snug mb-4">
              {t.onboarding.seeker.title}
            </h2>
            <p className="text-indigo-200 text-sm leading-relaxed">
              {t.onboarding.seeker.subtitle}
            </p>
            <p className="mt-6 text-indigo-300 text-sm">
              {t.onboarding.seeker.alreadyWithUs}{' '}
              <a href="/auth" className="text-white underline underline-offset-2 font-medium hover:text-amber-300 transition-colors">
                {t.onboarding.seeker.signIn}
              </a>
            </p>
          </div>

          {/* Footer */}
          <div>
            <p className="text-indigo-300 text-xs">{t.onboarding.seeker.needHelp}</p>
            <p className="text-amber-400 text-sm font-semibold mt-0.5">help@zupro.in</p>
          </div>
        </div>

        {/* ── Right Panel ────────────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col px-8 pt-8 pb-12 overflow-y-auto zupro-scroll">

          {/* Progress dots */}
          <div className="flex justify-end mb-6">
            <ProgressDots progress={progress} />
          </div>

          <h3 className="text-xl font-bold text-slate-800 mb-5">{t.onboarding.seeker.sectionTitle}</h3>

          <div className="flex flex-col gap-3 flex-1">

            {/* Name */}
            <FieldBox icon={<FiUser size={16} />}>
              <input
                type="text"
                value={form.name}
                onChange={(e) => set('name')(e.target.value)}
                placeholder={t.onboarding.seeker.placeholders.name}
                className="w-full px-3 py-3.5 text-sm text-slate-800 placeholder-slate-400 bg-transparent outline-none"
              />
            </FieldBox>

            {/* Age */}
            <FieldBox icon={<FiCalendar size={16} />}>
              <input
                type="number"
                min={16}
                max={65}
                value={form.age}
                onChange={(e) => set('age')(e.target.value)}
                placeholder={t.onboarding.seeker.placeholders.age}
                className="w-full px-3 py-3.5 text-sm text-slate-800 placeholder-slate-400 bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </FieldBox>

            {/* Gender */}
            <SimpleDropdown
              options={[...t.onboarding.seeker.options.genders]}
              value={form.gender}
              onChange={set('gender')}
              placeholder={t.onboarding.seeker.placeholders.gender}
              icon={<PiGenderIntersexBold size={16} />}
            />

            {/* Profession */}
            <SearchDropdown
              options={[...t.onboarding.seeker.options.professions]}
              value={form.profession}
              onChange={set('profession')}
              placeholder={t.onboarding.seeker.placeholders.profession}
              subLabel={t.onboarding.seeker.placeholders.professionSubLabel}
              searchPlaceholder={t.onboarding.seeker.placeholders.search}
              noResultsText={t.onboarding.seeker.placeholders.noResults}
              icon={<FiSearch size={16} />}
            />

            {/* Location */}
            <FieldBox icon={<FiMapPin size={16} />}>
              <input
                type="text"
                value={form.location}
                onChange={(e) => set('location')(e.target.value)}
                placeholder={t.onboarding.seeker.placeholders.location}
                className="w-full px-3 py-3.5 text-sm text-slate-800 placeholder-slate-400 placeholder:text-[13px] bg-transparent outline-none"
              />
            </FieldBox>

            {/* Education */}
            <SearchDropdown
              options={[...t.onboarding.seeker.options.education]}
              value={form.education}
              onChange={set('education')}
              placeholder={t.onboarding.seeker.placeholders.education}
              subLabel={t.onboarding.seeker.placeholders.educationSubLabel}
              searchPlaceholder={t.onboarding.seeker.placeholders.search}
              noResultsText={t.onboarding.seeker.placeholders.noResults}
              icon={<FiBookOpen size={16} />}
            />

          </div>

          {/* Continue button */}
          <motion.button
            onClick={handleNext}
            disabled={!allFilled}
            whileHover={allFilled ? { scale: 1.015 } : {}}
            whileTap={allFilled ? { scale: 0.985 } : {}}
            className={`mt-6 w-full py-4 rounded-xl text-white font-bold text-[15px] flex items-center justify-center gap-2 transition-all duration-300 ${
              allFilled
                ? 'bg-[#3F51B5] shadow-[0_4px_20px_rgba(63,81,181,0.35)] cursor-pointer'
                : 'bg-slate-300 cursor-not-allowed'
            }`}
          >
            {t.onboarding.seeker.continue}
            <FiArrowRight size={18} />
          </motion.button>

        </div>
      </div>
    </div>
  )
}
