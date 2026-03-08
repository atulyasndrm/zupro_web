import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { translations, type Language } from './translations'

type LanguageContextValue = {
  language: Language
  setLanguage: (language: Language) => void
  toggleLanguage: () => void
  t: (typeof translations)[Language]
}

const LANGUAGE_STORAGE_KEY = 'zupro_language'

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY)
    return storedLanguage === 'hi' ? 'hi' : 'en'
  })

  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
  }, [language])

  const value = useMemo<LanguageContextValue>(() => {
    const toggleLanguage = () => {
      setLanguage((prev) => (prev === 'en' ? 'hi' : 'en'))
    }

    return {
      language,
      setLanguage,
      toggleLanguage,
      t: translations[language],
    }
  }, [language])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)

  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }

  return context
}
