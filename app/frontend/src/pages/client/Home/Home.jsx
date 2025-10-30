import React from 'react'
import HeroSection from '../../../components/frontend/home/HeroSection'
import FeaturedProducts from '../../../components/frontend/home/FeaturedProducts'
import Newsletter from '../../../components/frontend/home/Newsletter'

const Home = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      {/* You can add more sections here later */}
      <FeaturedProducts />
      <Newsletter />
    </div>
  )
}

export default Home