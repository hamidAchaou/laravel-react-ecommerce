function App() {
  return (
    <section className="relative bg-gradient-to-r from-brand-primary to-brand-secondary text-brand-light py-20">
      <div className="container mx-auto px-6 lg:px-24 flex items-center justify-between">
        <div className="w-full lg:w-1/2 space-y-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
            Discover Your Perfect Pair
          </h1>
          <p className="text-lg sm:text-xl max-w-lg">
            Step into comfort and style with our latest collection of sneakers.
          </p>
          <div className="flex gap-4">
            <button className="bg-brand-accent text-brand-dark px-6 py-3 rounded-lg shadow-md hover:bg-brand-accentHover transition duration-300">
              Shop Now
            </button>
            <button className="bg-transparent border-2 border-brand-light text-brand-light px-6 py-3 rounded-lg shadow-md hover:bg-brand-light hover:text-brand-dark transition duration-300">
              Learn More
            </button>
          </div>
        </div>
        <div className="w-full lg:w-1/2 mt-12 lg:mt-0">
          <img
            src="https://images.unsplash.com/photo-1561948952-6b8a9e7c0b3e"
            alt="Sneakers"
            className="w-full h-auto rounded-lg shadow-xl"
          />
        </div>
      </div>
    </section>
  );
}

export default App;
