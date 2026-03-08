import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { OtpSection } from '../../features/auth/components/OtpSection'
import { PhoneStep } from '../../features/auth/components/PhoneStep'
import { RiShieldCheckLine } from 'react-icons/ri'
import { useLanguage } from '../../features/i18n/language'

export const Route = createFileRoute('/auth/')({
  component: RouteComponent,
})

// ─── Mobile top banner stats ──────────────────────────────────────────────────
function MobileStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-white text-base font-bold leading-tight">{value}</p>
      <p className="text-indigo-300 text-[11px] mt-0.5 leading-tight">{label}</p>
    </div>
  )
}

function RouteComponent() {
  const { t } = useLanguage()
  const [phone, setPhone] = useState('')
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [isSending, setIsSending] = useState(false)
  const [isVerified, setIsVerified] = useState(false)

  const phoneRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    phoneRef.current?.focus()
  }, [])

  const handleSendOtp = async () => {
    if (phone.length < 10) return
    setIsSending(true)
    await new Promise((r) => setTimeout(r, 1000))
    setIsSending(false)
    setStep('otp')
  }

  const isPhoneValid = phone.length === 10

  return (
    <div className="h-screen flex flex-col md:flex-row font-sans">

      {/* ── Desktop left image panel (md+) ─────────────────────────────────── */}
      <div className="hidden md:block md:w-[55%] relative overflow-hidden">
        <img
          src="/images/auth/left_asset.webp"
          alt="Zupro banner"
          className="w-full h-full object-cover"
        />
      </div>

      {/* ── Mobile top banner (< md only) ──────────────────────────────────── */}
      <div className="md:hidden relative bg-[#1e1b4b] px-6 pt-8 pb-8 overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />

        {/* Logo */}
        <div className="mb-5">
          <span
            className="text-white text-2xl font-extrabold tracking-tight select-none"
            style={{ fontFamily: '"Trebuchet MS", "Gill Sans", sans-serif' }}
          >
            Zupro
          </span>
          <div className="mt-0.5 w-8 h-1 rounded-full bg-amber-400" />
        </div>

        {/* Headline + badge */}
        <div className="inline-flex items-center gap-1.5 bg-white/10 text-indigo-200 text-[11px] font-medium px-2.5 py-1 rounded-full mb-2">
          <RiShieldCheckLine size={11} />
          {t.auth.mobileBadge}
        </div>
        <h2 className="text-white text-xl font-bold leading-snug mb-1">
          {t.auth.mobileHeadline}
        </h2>
        <p className="text-indigo-300 text-xs leading-relaxed mb-5">
          {t.auth.mobileSubtitle}
        </p>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-2 border-t border-white/10 pt-4">
          <MobileStat value="1000+" label={t.auth.stats.activeJobs} />
          <MobileStat value="12h" label={t.auth.stats.avgMatch} />
          <MobileStat value="Free" label={t.auth.stats.toApply} />
          <MobileStat value="Trusted" label={t.auth.stats.trusted} />
        </div>
      </div>

      {/* ── Right / bottom form panel ───────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-8 sm:px-8 sm:py-12 bg-white overflow-y-auto">
        <div className="w-full max-w-sm">

          {isVerified ? (
            <div className="scale-in flex flex-col items-center gap-4 py-12 text-center">
              <div className="check-pop w-20 h-20 rounded-full bg-primary flex items-center justify-center">
                <svg
                  width="38"
                  height="38"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">{t.auth.verifiedTitle}</h2>
              <p className="text-sm text-slate-500">{t.auth.verifiedSubtitle}</p>
            </div>

          ) : (
            <>
              {/* Brand — hidden on mobile since the banner above shows it */}
              <div className="mb-8 fade-up hidden md:block">
                <div className="flex items-baseline gap-0.5 mb-1">
                  <span className="text-3xl font-extrabold tracking-tight text-primary">Zu</span>
                  <span className="text-3xl font-extrabold tracking-tight text-slate-800">pro</span>
                  <span className="ml-1 mb-0.5 inline-block w-2 h-2 rounded-full bg-primary" />
                </div>
                <p className="text-sm font-medium text-slate-500">
                  {step === 'phone' ? t.auth.loginSignup : t.auth.enterVerificationCode}
                </p>
              </div>

              {/* Mobile step label (brand already in banner) */}
              <p className="md:hidden text-xl font-semibold text-slate-500 mb-6 fade-up">
                {step === 'phone' ? t.auth.loginSignup : t.auth.enterVerificationCode}
              </p>

              {step === 'phone' && (
                <PhoneStep
                  phone={phone}
                  isPhoneValid={isPhoneValid}
                  isSending={isSending}
                  phoneInputRef={phoneRef}
                  onPhoneChange={setPhone}
                  onSendOtp={handleSendOtp}
                />
              )}

              {step === 'otp' && (
                <OtpSection
                  phone={phone}
                  onBack={() => setStep('phone')}
                  onVerified={() => setIsVerified(true)}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}