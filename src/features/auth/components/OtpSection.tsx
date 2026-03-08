import { useCallback, useEffect, useRef, useState, type ChangeEvent, type ClipboardEvent, type KeyboardEvent } from 'react'
import { useLanguage } from '../../i18n/language'

type OtpSectionProps = {
  phone: string
  onBack: () => void
  onVerified: () => void
}

const OTP_LENGTH = 6

function OtpCell({
  value,
  index,
  isFocused,
  isError,
  inputRef,
  onChange,
  onKeyDown,
  onPaste,
  onFocus,
  ariaLabel,
}: {
  value: string
  index: number
  isFocused: boolean
  isError: boolean
  inputRef: (el: HTMLInputElement | null) => void
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void
  onPaste: (e: ClipboardEvent<HTMLInputElement>) => void
  onFocus: (index: number) => void
  ariaLabel: string
}) {
  const base =
    'w-full h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all duration-200 bg-slate-50 caret-transparent otp-font'

  const state = isFocused && !isError
    ? 'otp-cell--focused'
    : isError
      ? 'otp-cell--error animate-shake'
      : value
        ? 'otp-cell--filled'
        : 'otp-cell--empty'

  return (
    <div className="relative flex-1">
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        maxLength={1}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
        onFocus={() => onFocus(index)}
        aria-label={ariaLabel}
        className={`${base} ${state}`}
      />
      {value && !isFocused && (
        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary opacity-70" />
      )}
    </div>
  )
}

function OtpProgress({ filled }: { filled: number }) {
  return (
    <div className="flex justify-center gap-1 mt-3">
      {Array.from({ length: OTP_LENGTH }).map((_, i) => (
        <div
          key={i}
          className={`h-1 rounded-full transition-all duration-300 ${i < filled ? 'w-[18px] bg-primary' : 'w-1.5 bg-slate-200'}`}
        />
      ))}
    </div>
  )
}

function ResendTimer({
  seconds,
  onResend,
  resendInPrefix,
  resendOtp,
}: {
  seconds: number
  onResend: () => void
  resendInPrefix: string
  resendOtp: string
}) {
  if (seconds > 0) {
    return (
      <p className="text-sm text-slate-500 text-center">
        {resendInPrefix} <span className="font-semibold text-primary">{seconds}s</span>
      </p>
    )
  }

  return (
    <button
      onClick={onResend}
      className="w-full text-sm text-center text-primary font-semibold hover:underline underline-offset-2"
    >
      {resendOtp}
    </button>
  )
}

export function OtpSection({ phone, onBack, onVerified }: OtpSectionProps) {
  const { t } = useLanguage()
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''))
  const [focusedIndex, setFocusedIndex] = useState(0)
  const [isOtpError, setIsOtpError] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [resendSeconds, setResendSeconds] = useState(30)

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    setResendSeconds(30)
    timerRef.current = setInterval(() => {
      setResendSeconds((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current!)
          return 0
        }
        return s - 1
      })
    }, 1000)

    setTimeout(() => inputRefs.current[0]?.focus(), 80)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const focusCell = useCallback((index: number) => {
    inputRefs.current[Math.max(0, Math.min(OTP_LENGTH - 1, index))]?.focus()
  }, [])

  const handleOtpChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>, index: number) => {
      const digit = e.target.value.replace(/\D/g, '').slice(-1)
      if (!digit) return
      setOtp((prev) => {
        const next = [...prev]
        next[index] = digit
        return next
      })
      setIsOtpError(false)
      if (index < OTP_LENGTH - 1) focusCell(index + 1)
    },
    [focusCell],
  )

  const handleVerify = useCallback(async () => {
    const code = otp.join('')
    if (code.length < OTP_LENGTH) {
      setIsOtpError(true)
      focusCell(otp.findIndex((d) => !d))
      return
    }

    setIsVerifying(true)
    await new Promise((r) => setTimeout(r, 1200))

    if (code === '000000') {
      setIsOtpError(true)
      setIsVerifying(false)
      setOtp(Array(OTP_LENGTH).fill(''))
      setTimeout(() => focusCell(0), 50)
      return
    }

    setIsVerifying(false)
    onVerified()
  }, [otp, focusCell, onVerified])

  const handleOtpKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>, index: number) => {
      if (e.key === 'Backspace') {
        e.preventDefault()
        if (otp[index]) {
          setOtp((prev) => {
            const next = [...prev]
            next[index] = ''
            return next
          })
        } else if (index > 0) {
          setOtp((prev) => {
            const next = [...prev]
            next[index - 1] = ''
            return next
          })
          focusCell(index - 1)
        }
        setIsOtpError(false)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        focusCell(index - 1)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        focusCell(index + 1)
      } else if (e.key === 'Enter') {
        handleVerify()
      }
    },
    [otp, focusCell, handleVerify],
  )

  const handlePaste = useCallback(
    (e: ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault()
      const pasted = e.clipboardData
        .getData('text')
        .replace(/\D/g, '')
        .slice(0, OTP_LENGTH)

      if (!pasted) return

      const next = Array(OTP_LENGTH).fill('')
      pasted.split('').forEach((ch, i) => {
        next[i] = ch
      })
      setOtp(next)
      setIsOtpError(false)
      setTimeout(() => focusCell(Math.min(pasted.length, OTP_LENGTH - 1)), 20)
    },
    [focusCell],
  )

  const handleResend = () => {
    setOtp(Array(OTP_LENGTH).fill(''))
    setIsOtpError(false)
    clearInterval(timerRef.current!)
    setResendSeconds(30)

    timerRef.current = setInterval(() => {
      setResendSeconds((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current!)
          return 0
        }
        return s - 1
      })
    }, 1000)

    setTimeout(() => focusCell(0), 50)
  }

  const filledCount = otp.filter(Boolean).length

  return (
    <div className="fade-up">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="back-btn flex items-center gap-1.5 text-sm text-slate-400 font-medium"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          {t.auth.otp.back}
        </button>
        <div className="flex-1 h-px bg-slate-100" />
        <span className="text-xs text-slate-400 font-medium">+91 {phone}</span>
      </div>

      <p className="text-sm text-slate-500 mb-5 leading-relaxed">
        {t.auth.otp.sentMessagePrefix}{' '}
        <span className="font-semibold text-slate-700">{t.auth.otp.sentMessageExpiry}</span>.
      </p>

      <div className="flex gap-2 mb-1">
        {otp.map((val, i) => (
          <OtpCell
            key={i}
            value={val}
            index={i}
            isFocused={focusedIndex === i}
            isError={isOtpError}
            ariaLabel={`${t.auth.otp.otpDigitAriaPrefix} ${i + 1}`}
            inputRef={(el) => {
              inputRefs.current[i] = el
            }}
            onChange={(e) => handleOtpChange(e, i)}
            onKeyDown={(e) => handleOtpKeyDown(e, i)}
            onPaste={handlePaste}
            onFocus={setFocusedIndex}
          />
        ))}
      </div>

      <OtpProgress filled={filledCount} />

      {isOtpError && (
        <p className="text-xs text-red-500 font-medium mt-3 text-center">
          {t.auth.otp.invalidOtp}
        </p>
      )}

      <button
        onClick={handleVerify}
        disabled={filledCount < OTP_LENGTH || isVerifying}
        className={`btn-primary hover:cursor-pointer w-full py-4 rounded-xl text-white font-bold text-[15px] flex items-center justify-center gap-2 mt-5 ${filledCount === OTP_LENGTH ? 'bg-primary' : 'bg-slate-300 cursor-not-allowed'}`}
      >
        {isVerifying ? (
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
            {t.auth.otp.verifying}
          </>
        ) : (
          <>
            {t.auth.otp.verifyAndContinue}
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
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </>
        )}
      </button>

      <div className="mt-4">
        <ResendTimer
          seconds={resendSeconds}
          onResend={handleResend}
          resendInPrefix={t.auth.otp.resendInPrefix}
          resendOtp={t.auth.otp.resendOtp}
        />
      </div>
    </div>
  )
}
