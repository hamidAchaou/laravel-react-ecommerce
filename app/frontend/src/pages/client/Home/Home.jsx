import React from 'react'
import HeroSection from '../../../components/frontend/home/HeroSection'
import FeaturedProducts from '../../../components/frontend/home/FeaturedProducts'
import Newsletter from '../../../components/frontend/home/Newsletter'
import CategoriesSection from '../../../components/frontend/home/CategoriesSection'

const Home = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturedProducts />
      <CategoriesSection />
      <Newsletter />
    </div>
  )
}

export default Home