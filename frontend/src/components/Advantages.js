import React from 'react';

const advantages = [
  {
    title: 'Lightning-Fast Speeds',
    description: 'Experience downloads up to 100 Mbps with fiber-optic technology. Perfect for streaming, gaming, and working from home.',
    image: '/assets/advantage1.png', // Upload square image to /public/assets/advantage-1.png
    position: 'right'
  },
  {
    title: 'Reliable Connection',
    description: 'Netwells Fiber provides 99.9% uptime. No more buffering, no more dropped calls—just consistent, dependable service.',
    image: '/assets/advantage2.png', // Upload square image to /public/assets/advantage-2.png
    position: 'left'
  },
  {
    title: 'Expert Support',
    description: 'Our dedicated support team is ready to help 24/7. Get technical assistance whenever you need it.',
    image: '/assets/advantage4.avif', // Upload square image to /public/assets/advantage-3.png
    position: 'right'
  },
  {
    title: 'Affordable Plans',
    description: 'High-quality fiber internet at prices that fit your budget. No hidden fees. Simple, transparent pricing.',
    image: '/assets/advantage5.png', // Upload square image to /public/assets/advantage-4.png
    position: 'left'
  }
];

export default function Advantages() {
  return (
    <section className="bg-gray-50 py-12 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-navy text-center mb-12">
          Why Choose <span className="text-lime">Netwells</span> Fiber?
        </h2>

        <div className="space-y-10">
          {advantages.map((item, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${
                item.position === 'left' ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } gap-6 lg:gap-8 items-start lg:items-center`}
            >
              {/* Circular Image with Lime Ring */}
              <div className="flex-shrink-0 flex justify-center w-full lg:w-auto">
                <div className="relative w-40 h-40 lg:w-56 lg:h-56">
                  {/* Outer lime ring */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-lime to-green-500 shadow-lg"></div>
                  
                  {/* Image Container (Perfect Circle) */}
                  <div className="absolute inset-1 rounded-full overflow-hidden bg-gray-100">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover object-center"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-gray-400 text-2xl">📷</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Text - Properly Aligned */}
              <div className="flex-1 min-w-0">
                <h3 className="text-xl lg:text-2xl font-bold text-navy mb-2 lg:mb-3">{item.title}</h3>
                <p className="text-gray-700 leading-relaxed text-base lg:text-lg">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
