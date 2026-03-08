import { createFileRoute } from '@tanstack/react-router'
import { FeatureCards } from '../features/home/components/FeatureCards'
import { HeroCarousel } from '../features/home/components/HeroCarousel'
import { Navbar } from '../features/General/Navbar'
import { OnboardingModal } from '../features/home/components/OnboardingModal'
import { useLanguage } from '../features/i18n/language'
import {
  FEATURES,
  HOME_SLIDES,
} from '../features/home/constants'

export const Route = createFileRoute(`/`)({
  component: Index,
})

function Index() {
  const { t } = useLanguage()

  const localizedFeatures = FEATURES.map((feature, index) => ({
    ...feature,
    title: t.home.features[index]?.title ?? feature.title,
    subtitle: t.home.features[index]?.subtitle ?? feature.subtitle,
  }))

  return (
    <div className="fixed inset-0 overflow-hidden overscroll-none bg-[#f0f2f8] flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center pt-6 px-4 overflow-hidden">
        <HeroCarousel slides={HOME_SLIDES} />
        <FeatureCards features={localizedFeatures} />
      </main>
      <OnboardingModal seekerPerks={t.home.seekerPerks} hirerPerks={t.home.hirerPerks} />
    </div>
  )
}
