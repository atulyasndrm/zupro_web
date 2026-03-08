import { useEffect, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useLanguage } from '../../i18n/language'

type HeroCarouselProps = {
  slides: string[]
}

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [activeSlide, setActiveSlide] = useState(0)
  const [prevSlide, setPrevSlide] = useState<number | null>(null)
  const [transitioning, setTransitioning] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const goToSlide = (index: number) => {
    if (index === activeSlide || transitioning) return
    setPrevSlide(activeSlide)
    setTransitioning(true)
    setActiveSlide(index)
    setTimeout(() => {
      setPrevSlide(null)
      setTransitioning(false)
    }, 700)
  }

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setActiveSlide((prev) => {
        const next = (prev + 1) % slides.length
        setPrevSlide(prev)
        setTransitioning(true)
        setTimeout(() => {
          setPrevSlide(null)
          setTransitioning(false)
        }, 700)
        return next
      })
    }, 3500)
  }

  useEffect(() => {
    startTimer()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [slides.length])

  return (
    <>
      {/* Mobile carousel (<768px) */}
      <div className="relative w-full h-[300px] rounded-2xl overflow-hidden shadow-xl md:hidden">
        {slides.map((slide, index) => (
          <img
            key={`mobile-${slide}`}
            src={slide}
            alt={`Slide ${index + 1}`}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              opacity: activeSlide === index ? 1 : 0,
              transition: 'opacity 700ms cubic-bezier(0.4, 0, 0.2, 1)',
              zIndex: activeSlide === index ? 2 : prevSlide === index ? 1 : 0,
            }}
          />
        ))}

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
          {slides.map((_, index) => (
            <button
              key={`mobile-dot-${index}`}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => {
                goToSlide(index)
                startTimer()
              }}
              style={{
                width: activeSlide === index ? '20px' : '8px',
                height: '8px',
                borderRadius: activeSlide === index ? '4px' : '50%',
                backgroundColor: activeSlide === index ? '#fff' : 'rgba(255,255,255,0.5)',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                transition: 'all 300ms ease',
              }}
            />
          ))}
        </div>
      </div>

      {/* Desktop carousel (>=768px) */}
      <div className="relative hidden md:block md:-mt-4 w-full max-w-[680px] h-[400px] rounded-2xl overflow-hidden">
        {slides.map((slide, index) => (
          <img
            key={`desktop-${slide}`}
            src={slide}
            alt={`Slide ${index + 1}`}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              opacity: activeSlide === index ? 1 : 0,
              transition: 'opacity 700ms cubic-bezier(0.4, 0, 0.2, 1)',
              zIndex: activeSlide === index ? 2 : prevSlide === index ? 1 : 0,
            }}
          />
        ))}

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
          {slides.map((_, index) => (
            <button
              key={`desktop-dot-${index}`}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => {
                goToSlide(index)
                startTimer()
              }}
              style={{
                width: activeSlide === index ? '24px' : '10px',
                height: '10px',
                borderRadius: activeSlide === index ? '5px' : '50%',
                backgroundColor: activeSlide === index ? '#fff' : 'rgba(255,255,255,0.5)',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                transition: 'all 300ms ease',
              }}
            />
          ))}
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="mt-4 md:mt-6 flex gap-3 md:gap-4 w-full max-w-[560px] px-1">
        <button
          type="button"
          onClick={() => navigate({ to: '/onboarding/seeker' })}
          className="cascadia-mono-light flex-1 hover:cursor-pointer rounded-xl bg-[#3F51B5] px-4 md:px-6 py-3 md:py-3.5 text-sm md:text-base font-bold text-white shadow-md transition-all duration-200 hover:bg-[#3647a3] hover:shadow-lg active:scale-[0.98]"
        >
          {t.home.ctaFindJobs}
        </button>
        <button
          type="button"
          onClick={() => navigate({ to: '/onboarding/employer' })}
          className="cascadia-mono-light flex-1 hover:cursor-pointer rounded-xl border-2 border-[#3F51B5] bg-white px-4 md:px-6 py-3 md:py-3.5 text-sm md:text-base font-bold text-[#3F51B5] shadow-sm transition-all duration-200 hover:bg-[#eef1ff] hover:shadow-md active:scale-[0.98]"
        >
          {t.home.ctaHireNow}
        </button>
      </div>
    </>
  )
}
