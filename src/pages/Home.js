import React from 'react';

function HomePage() {
  return (
    <div className="min-h-screen flex flex-col font-serif">
      {/* Navbar */}
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-white text-3xl font-bold">ShopX.</h1>
          <ul className="flex space-x-4  font-semibold">
            <li><a href="/" className="text-white hover:text-gray-300">Home</a></li>
            <li><a href="#about" className="text-white hover:text-gray-300">About</a></li>
            <li><a href="#collection" className="text-white hover:text-gray-300">My Collection</a></li>
          </ul>
        </div>
      </nav>

      {/* Body */}
      <div className="container mx-auto mt-8 p-4 flex-grow">
        <div className="mb-10">
          <button className="bg-gradient-to-r from-blue-400 to-blue-600 text-white py-3 px-6 rounded text-lg font-semibold shadow-lg hover:from-blue-500 hover:to-blue-700">
            Top Selling
          </button>
        </div>

        {/* About Section */}
        <section id="about" className="mt-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to ShopX</h2>
          <p className="text-lg text-gray-700 mb-6">
            Discover a world of knowledge with our vast collection of ebooks. Whether you're looking to sharpen your technical skills or lose yourself in a gripping non-technical read, we've got you covered.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mb-3">Our Categories:</h3>
          <ul className="list-disc pl-6 text-gray-700 mb-6">
            <li className="mb-2">
              <strong>Technical Books:</strong> From coding to engineering, dive deep into subjects that power the future.
            </li>
            <li>
              <strong>Non-Technical Books:</strong> Explore literature, self-help, and more to nourish your mind and soul.
            </li>
          </ul>

          <h3 className="text-2xl font-semibold text-gray-800 mb-3">Why Choose Us?</h3>
          <ul className="list-disc pl-6 text-gray-700">
            <li className="mb-2"><strong>Curated Selection:</strong> Handpicked titles that cater to both the tech-savvy and the avid reader.</li>
            <li><strong>Instant Access:</strong> Download your favorite ebooks anytime, anywhere.</li>
          </ul>

          <p className="mt-6 text-lg text-gray-700">
            Start your reading journey with us today!
          </p>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 p-4 mt-10">
        <div className="container mx-auto text-center text-white">
          <h4 className="text-xl font-bold mb-4">Contact Us</h4>
          <div className="flex justify-center space-x-6">
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
              Instagram
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
