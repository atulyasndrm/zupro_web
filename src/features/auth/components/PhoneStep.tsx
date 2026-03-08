import { Link } from '@tanstack/react-router'
import type { RefObject } from 'react'
import { useLanguage } from '../../i18n/language'

type PhoneStepProps = {
  phone: string
  isPhoneValid: boolean
  isSending: boolean
  phoneInputRef: RefObject<HTMLInputElement | null>
  onPhoneChange: (value: string) => void
  onSendOtp: () => void
}

export function PhoneStep({
  phone,
  isPhoneValid,
  isSending,
  phoneInputRef,
  onPhoneChange,
  onSendOtp,
}: PhoneStepProps) {
  const { t } = useLanguage()

  return (
    <div className="fade-up">
      <div className="phone-field mb-4">
        <div className="flex items-center gap-2 pl-4 pr-3 py-4 border-r border-slate-200 shrink-0 select-none">
          <span className="text-md leading-none">IN</span>
          <span className="text-sm  font-semibold text-slate-600">+91</span>
        </div>

        <input
          ref={phoneInputRef}
          type="tel"
          inputMode="numeric"
          placeholder={t.auth.phone.placeholder}
          value={phone}
          maxLength={10}
          onChange={(e) => onPhoneChange(e.target.value.replace(/\D/g, '').slice(0, 10))}
          onKeyDown={(e) => e.key === 'Enter' && onSendOtp()}
          className="flex-1 py-4 px-4 bg-transparent text-[15px] font-medium text-slate-800 placeholder-slate-400 outline-none"
        />

        {isPhoneValid && (
          <div className="pr-4">
            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={onSendOtp}
        disabled={!isPhoneValid || isSending}
        className={`btn-primary hover:cursor-pointer w-full py-4 rounded-xl text-white font-bold text-[15px] flex items-center justify-center gap-2 ${isPhoneValid ? 'bg-primary' : 'bg-slate-300 cursor-not-allowed'}`}
      >
        {isSending ? (
          <>
            <svg
              className="spinner"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M12 2a10 10 0 0 1 10 10" />
            </svg>
            {t.auth.phone.sendingOtp}
          </>
        ) : (
          <>
            {t.auth.phone.getOtp}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </>
        )}
      </button>

      <p className="text-xs text-slate-400 text-center mt-5 leading-relaxed">
        {t.auth.phone.termsPrefix}{' '}
        <Link to="/" className="text-primary font-medium hover:underline">
          {t.auth.phone.terms}
        </Link>
        {' '}&{' '}
        <Link to="/" className="text-primary font-medium hover:underline">
          {t.auth.phone.privacy}
        </Link>
      </p>
    </div>
  )
}
