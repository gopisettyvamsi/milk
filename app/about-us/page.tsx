import React from 'react';
import { Users, BookOpen, Award, Heart, Globe, Star, Calendar, Building, Target, Microscope, Hospital, Stethoscope } from 'lucide-react';
import Footer from '@/components/Footer';
import NavigationMenu from '@/components/NavigationMenu';
import TopContactStrip from '@/components/TopContactStrip';

const AboutPage = () => {
  return (
    <>
      <TopContactStrip />
      <NavigationMenu />
      <section id="about">
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
          {/* Hero Section */}
          <section className="relative pt-20">
            <div className="container mx-auto px-4 text-center">
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

          {/* Foundation Philosophy */}
          <section className="py-16">
            <div className="container mx-auto px-4 text-center">
              <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-3xl p-12 text-white mb-16">
                <div className="max-w-4xl mx-auto text-center">
                  <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Star className="w-10 h-10" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Philosophy</h2>
                  <p className="text-lg text-purple-100 leading-relaxed">
                    "Approach to Obstetrics & Gynaecology in Ayurveda truly mirrors the cycles of nature & a woman's life journey.
                    It is fascinating how our practice evolves & rejuvenates, much like the natural world around us."
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {/* Card 1 */}
                <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                    <Microscope className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Evidence-Based Practice</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Integrating evidence-based practices into modern Ayurveda to ensure effectiveness
                    and credibility in obstetrics and gynecology.
                  </p>
                </div>

                {/* Card 2 */}
                <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                    <Stethoscope className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Integrated Care</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Incorporating advanced surgical techniques while maintaining core Ayurvedic
                    principles for comprehensive, individualized care.
                  </p>
                </div>

                {/* Card 3 */}
                <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Future-Forward Approach</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Shaping the future of Ayurvedic obstetrics and gynecology through innovative
                    practices and continuous professional development.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Conference Excellence */}
          {/* <section className="py-20 px-6 bg-gradient-to-r from-purple-100 to-blue-100">
            <div className="container mx-auto px-4 ">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-white text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Calendar className="w-4 h-4" />
                  Premier Conference
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  <span className="text-purple-600">Janani</span> International Conference
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed max-w-3xl mx-auto">
                  Our flagship annual conference that addresses and expands horizons beyond routine
                  practice, designed based on present-day needs with skill-oriented deliberations.
                </p>
              </div>

              <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-purple-600 font-semibold">Janani-2024 Highlights</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-6">International Excellence</h3>
                    <div className="space-y-4 mb-8">
                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900">October 24-26, 2024</p>
                          <p className="text-gray-600">KLE Centenary Convention Centre, Belagavi</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Building className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900">Hosted by KAHER</p>
                          <p className="text-gray-600">Shri B.M.Kankanawadi Ayurveda Mahavidyalaya</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Globe className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900">Karnataka Chapter</p>
                          <p className="text-gray-600">Kashyapi Ayurveda Foundation</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8">
                    <h4 className="text-2xl font-bold text-gray-900 mb-6">Conference Focus Areas</h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-gray-700">Evidence-based Ayurvedic practices</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-700">Modern surgical integration</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-700">Skill-oriented training</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-gray-700">Professional development</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section> */}

          {/* Regional Chapters */}
          <section className="py-20 px-6">
            <div className="container mx-auto px-4 ">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Building className="w-4 h-4" />
                  Our Chapters
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Regional Excellence <span className="text-green-600">Network</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Building a strong network of Ayurvedic practitioners across India, fostering
                  local expertise while maintaining national standards of excellence.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-orange-500">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <Building className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Karnataka Chapter</h3>
                  <p className="text-gray-600 mb-4">
                    Leading chapter hosting international conferences and setting benchmarks
                    for academic and clinical excellence.
                  </p>
                  <div className="text-sm text-orange-600 font-medium">
                    Host: Janani International Conference
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-pink-500">
                  <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                    <Building className="w-6 h-6 text-pink-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Rajasthan Chapter</h3>
                  <p className="text-gray-600 mb-4">
                    Active regional chapter promoting traditional Ayurvedic gynecology
                    practices with modern applications.
                  </p>
                  <div className="text-sm text-pink-600 font-medium">
                    Focus: Traditional Practices
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-purple-500">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Globe className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">National Network</h3>
                  <p className="text-gray-600 mb-4">
                    Expanding presence across India with plans for more regional
                    chapters and collaborative programs.
                  </p>
                  <div className="text-sm text-purple-600 font-medium">
                    Status: Growing Network
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Partner Institution Highlight */}
          {/* <section className="py-20 px-6 bg-gray-50">
            <div className="container mx-auto px-4 ">
              <div className="bg-white rounded-3xl p-12 shadow-xl">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                    <Hospital className="w-4 h-4" />
                    Partner Institution
                  </div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-6">
                    Excellence in <span className="text-blue-600">Ayurvedic Education</span>
                  </h2>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                      KAHER's Shri B.M.Kankanawadi Ayurveda Mahavidyalaya
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      Established in 1933 by Late Shri B M Kankanawadi with the objective of
                      revitalizing the science of Ayurveda, its utilization by society and entrepreneurship
                      in Ayurveda for youths.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Award className="w-5 h-5 text-blue-500" />
                        <span className="text-gray-700">First NABH accredited Ayurveda Hospital in Karnataka</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Award className="w-5 h-5 text-blue-500" />
                        <span className="text-gray-700">Both NAAC and NABH accredited institution</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Award className="w-5 h-5 text-blue-500" />
                        <span className="text-gray-700">GMP certified Ayurveda Pharmacy</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">281</div>
                      <div className="text-sm text-gray-600">Bed Hospital</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">1933</div>
                      <div className="text-sm text-gray-600">Established</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">A+</div>
                      <div className="text-sm text-gray-600">NAAC Grade</div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 text-center">
                      <div className="text-3xl font-bold text-orange-600 mb-2">57th</div>
                      <div className="text-sm text-gray-600">NIRF Ranking</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section> */}

          {/* Vision & Mission */}
          <section className="py-20 px-6">
            <div className="container mx-auto px-4 ">
              <div className="grid lg:grid-cols-2 gap-12">
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

          {/* Call to Action */}
          <section className="py-20 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <div className=" px-4 text-center">
              <h2 className="text-4xl font-bold mb-6">Join Our Growing Community</h2>
              <p className="text-xl text-purple-100 mb-8 leading-relaxed">
                "Based on the very need of present day this conference is being thoughtfully planned
                and will set a bench mark for the professional, academic and clinical growth, thus expanding
                knowledge & perspectives beyond the traditional boundaries of our practice."
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/membership">
                  <button className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                    Become a Member
                  </button>
                </a>
                <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-purple-600 transition-colors">
                  Join Next Conference
                </button>
              </div>
            </div>
          </section>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default AboutPage;