import React from 'react';
// Import icons (assuming you're using react-icons for this example)
import { FaBullseye as Target, FaHeart as Heart } from 'react-icons/fa';

const KashyapiAyurvedaPage: React.FC = () => {
  return (
    <div>
      {/* First Section */}
      <section className="relative pt-20">
        <div className="container mx-auto px-2 sm:px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
              KASHYAPI AYURVEDA
            </span>
            <span className="block text-gray-800 text-3xl md:text-5xl mt-2">
              GYNAECOLOGISTS & OBSTETRICIANS
            </span>
            <span className="block text-2xl md:text-4xl text-purple-600 mt-2 font-semibold">
              FOUNDATION
            </span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-5xl mx-auto">
            A pioneering organization dedicated to integrating traditional Ayurvedic wisdom with modern
            obstetric and gynecological practices, fostering excellence in women's healthcare through
            evidence-based Ayurveda.
          </p>
        </div>
      </section>

      {/* Second Section */}
      <section className="py-20 px-2 sm:px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Vision Section */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-10 text-white">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold mb-6">Our Vision</h3>
              <p className="text-purple-100 leading-relaxed">
                To build a Centre of global excellence in Ayurveda education by preserving,
                propagating and developing Indian systems of medicine through quality teaching,
                training, patient care and research in obstetrics and gynecology.
              </p>
            </div>

            {/* Mission Section */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-10 text-white">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mb-6">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold mb-6">Our Mission</h3>
              <p className="text-blue-100 leading-relaxed">
                To advance the integration of traditional Ayurvedic wisdom with modern
                obstetric and gynecological practices, ensuring comprehensive care that
                respects both ancient knowledge and contemporary medical standards.
              </p>
            </div>
          </div>
        </div>
      </section>

            <section className="py-20 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className=" px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Join Our Growing Community</h2>
          <p className="text-xl text-purple-100 mb-8 leading-relaxed">
            "Based on the very need of present day this conference is being thoughtfully planned 
            and will set a bench mark for the professional, academic and clinical growth, thus expanding 
            knowledge & perspectives beyond the traditional boundaries of our practice."
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => (window.location.href = "/membership")}
              className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Become a Member
            </button>
            <button
              onClick={() => (window.location.href = "/events")}
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-purple-600 transition-colors"
            >
              Join Next Conference
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default KashyapiAyurvedaPage;
