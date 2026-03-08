import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { HiOutlineSparkles } from 'react-icons/hi2'
import {
  RiBriefcase4Line,
  RiSearchLine,
  RiArrowRightLine,
  RiCloseLine,
} from 'react-icons/ri'
import { useLanguage } from '../../i18n/language'

type OnboardingModalProps = {
  seekerPerks: readonly string[]
  hirerPerks: readonly string[]
}

export function OnboardingModal({ seekerPerks, hirerPerks }: OnboardingModalProps) {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [isModalOpen, setIsModalOpen] = useState(true)
  const [hoveredCard, setHoveredCard] = useState<'seeker' | 'hirer' | null>(null)
  const closeModal = () => setIsModalOpen(false)

  useEffect(() => {
    if (!isModalOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isModalOpen])

  const handleRoleSelect = (to: '/onboarding/seeker' | '/onboarding/employer') => {
    setIsModalOpen(false)
    navigate({ to })
  } 

  return (
    <AnimatePresence>
      {isModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            onClick={closeModal}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4 pointer-events-none overflow-hidden overscroll-none"
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="pointer-events-auto relative w-full sm:max-w-[760px] rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-5 md:px-8 pt-6 md:pt-8 pb-4 md:pb-5 border-b border-slate-100">
                <div className="flex items-center gap-2 mb-1">
                  <HiOutlineSparkles className="text-[#3F51B5]" size={18} />
                  <p className="text-sm font-semibold text-[#3F51B5] tracking-widest uppercase">
                    {t.home.modal.welcome}
                  </p>
                </div>
                <h2 className="text-[15px] dosis-semibold sm:text-md sm:text-xl md:text-2xl font-extrabold text-slate-800 leading-snug">
                  {t.home.modal.heading}
                </h2>
              </div>

              {/* Cards — stacked on mobile, side-by-side on sm+ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">

                {/* Seeker card */}
                <motion.div
                  className="relative p-5 md:p-7 md:pt-3 flex flex-col cursor-pointer"
                  onHoverStart={() => setHoveredCard('seeker')}
                  onHoverEnd={() => setHoveredCard(null)}
                >
                  <div className="flex flex-row gap-1 items-center mb-1">
                    <h3 className="text-base sora-bold md:text-lg font-extrabold text-slate-800">{t.home.modal.seekerTitle}</h3>
                    <motion.div
                      className="w-8 h-8 flex items-center justify-center"
                      whileHover={{ scale: 1.08, rotate: -4 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    >
                      <RiSearchLine className="text-[#3F51B5] mt-0" size={22} />
                    </motion.div>
                  </div>

                  <p className="text-slate-500 sora-semibold text-sm leading-relaxed mb-4">
                    {t.home.modal.seekerSubtitle}
                  </p>

                  {/* Perks — desktop */}
                  <ul className="hidden sm:flex flex-col gap-2 mb-5">
                    {seekerPerks.map((perk) => (
                      <motion.li
                        key={perk}
                        className="flex items-center gap-2 text-sm text-slate-600"
                        initial={{ x: 0 }}
                        whileHover={{ x: 3 }}
                        transition={{ duration: 0.15 }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#3F51B5] dosis-semibold flex-shrink-0" />
                        {perk}
                      </motion.li>
                    ))}
                  </ul>

                  {/* Mobile perks — compact chips */}
                  <div className="flex sm:hidden flex-wrap gap-2 mb-4">
                    {seekerPerks.map((perk) => (
                      <span key={perk} className="text-xs dosis-semibold bg-indigo-50 text-[#3F51B5] font-medium px-2.5 py-1 rounded-full">
                        {perk}
                      </span>
                    ))}
                  </div>

                  <motion.button
                    type="button"
                    className="mt-auto sora-bold hover:cursor-pointer w-full rounded-xl bg-[#3F51B5] py-2.5 md:py-3 text-sm font-bold text-white flex items-center justify-center gap-2 shadow-md"
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleRoleSelect('/onboarding/seeker')}
                  >
                    {t.home.modal.seekerButton}
                    <motion.span
                      animate={hoveredCard === 'seeker' ? { x: 4 } : { x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <RiArrowRightLine size={16} />
                    </motion.span>
                  </motion.button>
                </motion.div>

                {/* Hirer card */}
                <motion.div
                  className="relative p-5 md:p-7 md:pt-3 flex flex-col cursor-pointer"
                  onHoverStart={() => setHoveredCard('hirer')}
                  onHoverEnd={() => setHoveredCard(null)}
                >
                  <div className="flex flex-row gap-1 items-center mb-1">
                    <h3 className="text-base sora-bold md:text-lg font-extrabold text-slate-800">{t.home.modal.hirerTitle}</h3>
                    <motion.div
                      className="w-8 h-8 flex items-center justify-center"
                      whileHover={{ scale: 1.08, rotate: -4 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    >
                      <RiBriefcase4Line className="text-amber-500 mt-0" size={22} />
                    </motion.div>
                  </div>

                  <p className="text-slate-500 sora-semibold text-sm leading-relaxed mb-4">
                    {t.home.modal.hirerSubtitle}
                  </p>

                  {/* Perks — desktop */}
                  <ul className="hidden sm:flex flex-col gap-2 mb-5">
                    {hirerPerks.map((perk) => (
                      <motion.li
                        key={perk}
                        className="flex items-center gap-2 text-sm text-slate-600"
                        initial={{ x: 0 }}
                        whileHover={{ x: 3 }}
                        transition={{ duration: 0.15 }}
                      >
                        <span className="w-1.5 h-1.5 dosis-semibold rounded-full bg-amber-400 flex-shrink-0" />
                        {perk}
                      </motion.li>
                    ))}
                  </ul>

                  {/* Mobile perks — compact chips */}
                  <div className="flex sm:hidden flex-wrap gap-2 mb-4">
                    {hirerPerks.map((perk) => (
                      <span key={perk} className="text-xs dosis-semibold bg-amber-50 text-amber-600 font-extrabold px-2.5 py-1 rounded-full">
                        {perk}
                      </span>
                    ))}
                  </div>

                  <motion.button
                    type="button"
                    className="mt-auto w-full sora-bold hover:cursor-pointer rounded-xl border-2 border-amber-400 bg-white py-2.5 md:py-3 text-sm font-bold text-amber-600 flex items-center justify-center gap-2"
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleRoleSelect('/onboarding/employer')}
                  >
                    {t.home.modal.hirerButton}
                    <motion.span
                      animate={hoveredCard === 'hirer' ? { x: 4 } : { x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <RiArrowRightLine size={16} />
                    </motion.span>
                  </motion.button>
                </motion.div>
              </div>

              <motion.button
                  type="button"
                  aria-label="Close modal"
                  onClick={closeModal}
                  className="flex absolute top-5 right-5 hover:cursor-pointer items-center gap-2 text-slate-400 text-sm font-medium px-3 py-1 sm:px-5 sm:py-2 rounded-full border border-[#3F51B5] bg-white hover:border-slate-300 hover:text-slate-600 transition-colors"
                  whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.96, transition: { duration: 0.15 } }}
                >
                  <RiCloseLine size={20} />
                </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
