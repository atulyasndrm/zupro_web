import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { RiMenuLine, RiCloseLine } from 'react-icons/ri'
import { AnimatePresence, motion } from 'framer-motion'
import { useLanguage } from '../i18n/language'

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { t, toggleLanguage } = useLanguage()

  return (
    <nav className="px-5 hover:bg-white transition-all duration-300 hover:cursor-pointer md:px-8 flex items-center justify-between h-14 md:h-16 bg-transparent relative z-50">
      {/* Logo */}
      <span
        className="text-[#3F51B5] text-2xl md:text-4xl font-extrabold tracking-tight select-none"
        style={{ fontFamily: '"Trebuchet MS", "Gill Sans", sans-serif' }}
      >
        Zupro
      </span>

      {/* Desktop center links */}
      <div className="hidden sora-bold md:flex items-center absolute top-5 left-1/2 -translate-x-1/2 gap-8">
        <Link to="/" className="text-slate-700 text-md font-semibold hover:text-[#3F51B5] transition-colors">{t.navbar.faqs}</Link>
        <Link to="/" className="text-slate-700 text-md font-semibold hover:text-[#3F51B5] transition-colors">{t.navbar.contactUs}</Link>
        <Link to="/" className="text-slate-700 text-md font-semibold hover:text-[#3F51B5] transition-colors">{t.navbar.aboutUs}</Link>
      </div>

      {/* Desktop right actions */}
      <div className="hidden md:flex items-center gap-4">
        <button
          type="button"
          className="cascadia-mono-bold text-xs text-slate-700 border border-slate-300 px-2.5 py-1 rounded-md"
          onClick={toggleLanguage}
          aria-label={t.navbar.toggleLanguageAria}
        >
          {t.navbar.languageButton}
        </button>
        <Link to="/auth" className="hover:cursor-pointer cascadia-mono-bold opacity-95 hover:opacity-100 font-bold text-slate-700">
          {t.navbar.signIn}
        </Link>
        <Link to="/auth" className="flex cascadia-mono-bold hover:opacity-100 opacity-95 hover:cursor-pointer items-center gap-2 text-sm text-white bg-[#3F51B5] px-6 py-2  transition-all">
          {t.navbar.signUp}
        </Link>
      </div>

      {/* Mobile hamburger */}
      <button
        type="button"
        className="md:hidden text-slate-700 p-1"
        onClick={() => setMenuOpen((o) => !o)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <RiCloseLine size={24} /> : <RiMenuLine size={24} />}
      </button>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute top-14 sora-bold left-0 right-0 bg-white shadow-lg border-t border-slate-100 px-6 py-5 flex flex-col gap-4 md:hidden"
          >
            <button
              type="button"
              onClick={toggleLanguage}
              aria-label={t.navbar.toggleLanguageAria}
              className="w-fit text-xs text-slate-700 border border-slate-300 px-2.5 py-1 rounded-md"
            >
              {t.navbar.languageButton}
            </button>
            <Link to="/" onClick={() => setMenuOpen(false)} className="text-slate-700 font-semibold hover:text-[#3F51B5] transition-colors">{t.navbar.faqs}</Link>
            <Link to="/" onClick={() => setMenuOpen(false)} className="text-slate-700 font-semibold hover:text-[#3F51B5] transition-colors">{t.navbar.contactUs}</Link>
            <Link to="/" onClick={() => setMenuOpen(false)} className="text-slate-700 font-semibold hover:text-[#3F51B5] transition-colors">{t.navbar.aboutUs}</Link>
            <div className="flex gap-3 pt-2 border-t border-slate-100">
              <Link to="/auth" className="flex-1 text-center py-2.5 rounded-xl border-2 border-[#3F51B5] text-[#3F51B5] font-bold text-sm">{t.navbar.signIn}</Link>
              <Link to="/auth" className="flex-1 text-center py-2.5 rounded-xl bg-[#3F51B5] text-white font-bold text-sm">{t.navbar.signUp}</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}