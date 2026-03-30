import React, { useState } from 'react';

export default function FAQ({ faqs = [] }) {
  const [openIdx, setOpenIdx] = useState(null);

  const defaultFAQs = [
    {
      question: 'What is Netwell Fiber?',
      answer: 'Netwell Fiber is a high-speed internet service provider offering fiber-optic connections with speeds up to 100 Mbps. Netwell brings ultra-fast, reliable internet to homes and businesses.'
    },
    {
      question: 'How fast is the internet?',
      answer: 'Netwell Fiber offers multiple plans ranging from 6 Mbps to 100 Mbps, depending on your needs. All plans deliver fast, stable connections suitable for streaming, gaming, and working from home.'
    },
    {
      question: 'Is there a contract?',
      answer: 'Netwell Fiber offers flexible plans with and without long-term contracts. You can choose the option that best fits your needs.'
    },
    {
      question: 'How do I get started?',
      answer: 'Getting started with Netwell is easy! Choose your plan from our pricing page and contact our support team. We\'ll handle the installation and get you connected quickly.'
    },
    {
      question: 'What if I experience issues?',
      answer: 'Our 24/7 support team is ready to help. Contact us anytime via phone or email, and we\'ll resolve your issue promptly.'
    }
  ];

  const faqList = faqs && faqs.length > 0 ? faqs : defaultFAQs;

  return (
    <section className="bg-gray-100 py-16 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-navy text-center mb-16">
          Have questions? We've got answers.
        </h2>

        <div className="space-y-4">
          {faqList.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              {/* Question - Accordion Header */}
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full px-6 py-5 flex justify-between items-center bg-white hover:bg-gray-50 transition font-semibold text-navy text-left"
              >
                <span className="text-lg">{item.question}</span>
                <span
                  className={`text-lime text-2xl ml-4 transition-transform duration-300 ${
                    openIdx === idx ? 'rotate-180' : ''
                  }`}
                >
                  +
                </span>
              </button>

              {/* Answer - Accordion Content */}
              {openIdx === idx && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-gray-700 leading-relaxed">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
