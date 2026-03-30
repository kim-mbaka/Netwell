import React from 'react';

export default function CTA() {
  return (
    <section className="bg-white py-0">
      <div className="flex flex-col lg:flex-row min-h-96">
        {/* Left - Navy Section */}
        <div className="flex-1 bg-navy text-white px-8 py-16 flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Join the <span className="text-lime">Netwell</span> family today
          </h2>
          <p className="text-lg text-gray-200 mb-0">
            Elevate your network with ultra-fast fiber connections. Experience the future of internet today.
          </p>
        </div>

        {/* Right - Green Section */}
        <div className="flex-1 bg-lime px-8 py-16 flex flex-col justify-center items-center lg:items-start">
          <h3 className="text-2xl font-bold text-navy mb-6">Contact Us</h3>
          <div className="space-y-4 text-navy">
            <div>
              <p className="font-semibold">Phone</p>
              <p className="text-lg">(346) 385-1226</p>
            </div>
            <div>
              <p className="font-semibold">Email</p>
              <p className="text-lg">support@netwell.com</p>
            </div>
            <div>
              <p className="font-semibold">Address</p>
              <p className="text-lg">123 Fiber Lane, Houston, TX</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
