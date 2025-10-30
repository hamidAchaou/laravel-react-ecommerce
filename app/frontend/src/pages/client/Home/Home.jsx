import React from 'react'
import HeroSection from '../../../components/frontend/home/HeroSection'
import FeaturedProducts from '../../../components/frontend/home/FeaturedProducts'

const Home = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      {/* You can add more sections here later */}
      <FeaturedProducts />
      {/* <Newsletter /> */}
      {/* <Footer /> */}
    </div>
  )
}

export default Home