import { useOutletContext } from 'react-router-dom'
import Hero from '../../components/home/Hero'
import CategoryQuickAccess from '../../components/home/CategoryQuickAccess'
import WhyChooseUs from '../../components/home/WhyChooseUs'
import StatsCounter from '../../components/home/StatsCounter'
import FeaturedServices from '../../components/home/FeaturedServices'
import FeaturedGallery from '../../components/home/FeaturedGallery'
import FeaturedVideos from '../../components/home/FeaturedVideos'
import CTASection from '../../components/home/CTASection'

export default function Home() {
  const { settings } = useOutletContext()

  return (
    <>
      <Hero settings={settings} />
      <CategoryQuickAccess />
      <WhyChooseUs />
      <StatsCounter settings={settings} />
      <FeaturedServices />
      <FeaturedGallery />
      <FeaturedVideos />
      <CTASection />
    </>
  )
}
