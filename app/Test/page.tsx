import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Users, Globe, TrendingUp, Database, Shield, Zap } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-teal-600 text-white py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <span className="text-teal-600 font-bold text-sm"></span>
            </div>
            <span className="font-semibold">Kagof</span>
          </div>
          
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-teal-600 text-white py-20 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl font-bold mb-6">
            Unlock the Power of Your Enterprise Data
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Build smart AI solutions that transform your business with our comprehensive data services. 
            From data collection to AI model deployment, we help you harness the full potential of your data assets.
          </p>
          <Button size="lg" className="bg-teal-500 hover:bg-teal-400 text-white px-8 py-3">
            Get Started
          </Button>
        </div>
      </section>

    
      

      {/* Conference Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Button className="bg-teal-100 text-teal-800 mb-4">KSA Conference 2024</Button>
              <h3 className="text-3xl font-bold mb-4">KSA Conference 2024 - Thank You for Joining Us</h3>
              <p className="text-gray-600 mb-6">
                We had an incredible time at the KSA Conference 2024, connecting with industry leaders 
                and showcasing our latest AI and data solutions. Thank you to everyone who visited our booth 
                and engaged with our team.
              </p>
              <Button className="bg-teal-600 hover:bg-teal-700">
                View Conference Highlights
              </Button>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80" 
                alt="Conference attendees at KSA Conference 2024" 
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* AI Trap Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1518877593221-1f28583780b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80" 
                alt="AI technology visualization" 
                className="rounded-lg shadow-lg w-full"
              />
            </div>
            <div>
              <div className="bg-blue-100 text-blue-800 mb-4">AI Insights</div>
              <h3 className="text-3xl font-bold mb-4">Join us at C3AI AI Trap</h3>
              <p className="text-gray-600 mb-6">
                Discover the latest in AI technology and enterprise solutions at our exclusive C3AI AI Trap event. 
                Network with industry experts and learn about cutting-edge artificial intelligence applications.
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Register Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CxO Conference Section */}
      <section className="py-16 px-6 bg-teal-700 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-teal-500 text-white mb-4">Executive Summit</div>
              <h3 className="text-3xl font-bold mb-4">CxO Conference 2024</h3>
              <p className="opacity-90 mb-6">
                Join C-level executives and industry leaders at our annual CxO Conference. 
                Explore strategic insights, digital transformation trends, and the future of enterprise technology.
              </p>
              <Button className="bg-white text-teal-700 hover:bg-gray-100">
                Learn More
              </Button>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80" 
                alt="CxO Conference attendees" 
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* LEAP Program Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80" 
                alt="LEAP Program team collaboration" 
                className="rounded-lg shadow-lg w-full"
              />
            </div>
            <div>
              <div className="bg-green-100 text-green-800 mb-4">LEAP Program</div>
              <h3 className="text-3xl font-bold mb-4">LEAP Program</h3>
              <p className="text-gray-600 mb-6">
                Accelerate your digital transformation journey with our comprehensive LEAP Program. 
                Designed for enterprises ready to embrace AI and advanced analytics solutions.
              </p>
              <Button className="bg-green-600 hover:bg-green-700">
                Apply Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Certified Gold Enterprise Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Certified Gold Enterprise</h2>
          <p className="text-gray-600 mb-12 max-w-3xl mx-auto">
            Recognized as a Certified Gold Enterprise partner, we deliver world-class solutions 
            with proven expertise in enterprise data management and AI implementation.
          </p>
          
          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-teal-600" />
              </div>
              <h4 className="font-semibold text-2xl">500+</h4>
              <p className="text-gray-600">Clients Served</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-2xl">1M+</h4>
              <p className="text-gray-600">Data Points Processed</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-2xl">99%</h4>
              <p className="text-gray-600">Uptime Guarantee</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-2xl">24/7</h4>
              <p className="text-gray-600">Support Available</p>
            </div>
          </div>
          
          <Button className="bg-teal-600 hover:bg-teal-700 mt-8">
            View Certification
          </Button>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive data and AI solutions tailored to your enterprise needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <Database className="w-6 h-6 text-teal-600" />
                </div>
                <CardTitle>Data Pipeline Creation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Build robust, scalable data pipelines that seamlessly integrate with your existing infrastructure 
                  and ensure reliable data flow across your organization.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Design Validation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Validate your data architecture and AI models with comprehensive testing frameworks 
                  to ensure optimal performance and reliability.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Predictive Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Leverage advanced machine learning algorithms to predict trends, identify opportunities, 
                  and make data-driven decisions for your business.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Data Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Seamlessly integrate data from multiple sources and formats to create a unified, 
                  comprehensive view of your business operations.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Scada & Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Implement advanced SCADA systems and industrial controls for real-time monitoring 
                  and automated decision-making in industrial environments.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle>Project Services</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  End-to-end project management for complex data initiatives, ensuring timely delivery 
                  and successful implementation of your data strategy.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Softwairs Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80" 
                alt="Why choose Softwairs team meeting" 
                className="rounded-lg shadow-lg w-full"
              />
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-6">Why Choose Softwairs.ai</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-lg mb-2">Technical Excellence</h4>
                  <p className="text-gray-600">
                    Our team of certified experts brings deep technical knowledge and proven experience 
                    in enterprise data solutions and AI implementation.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-lg mb-2">End-to-End Solutions</h4>
                  <p className="text-gray-600">
                    From initial consultation to deployment and ongoing support, we provide comprehensive 
                    services that cover every aspect of your data journey.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-lg mb-2">Proven Methodology</h4>
                  <p className="text-gray-600">
                    Our battle-tested methodologies ensure successful project delivery while minimizing 
                    risks and maximizing return on investment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Presence Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Global Presence</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-xl mb-2">Middle East</h4>
              <p className="text-gray-600">
                Riyadh, Saudi Arabia<br />
                Dubai, UAE<br />
                Doha, Qatar
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-xl mb-2">North America</h4>
              <p className="text-gray-600">
                New York, USA<br />
                Toronto, Canada<br />
                San Francisco, USA
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-xl mb-2">Asia-Pacific</h4>
              <p className="text-gray-600">
                Singapore<br />
                Mumbai, India<br />
                Sydney, Australia
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gray-900 text-white">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Optimize Your Data Infrastructure?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Transform your business with our comprehensive data and AI solutions. 
            Let's discuss how we can help you unlock the full potential of your data assets.
          </p>
          <Button size="lg" className="bg-teal-600 hover:bg-teal-500 text-white px-8 py-3">
            Schedule Consultation
          </Button>
        </div>
      </section>

      {/* Footer */}
       <footer className="bg-gray-800 text-white py-12 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-teal-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="font-semibold">SOFTWAIRS</span>
              </div>
              <p className="text-gray-400">
                Transforming enterprises through intelligent data solutions and AI innovation.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Data Pipeline Creation</li>
                <li>AI & Machine Learning</li>
                <li>Predictive Analytics</li>
                <li>Data Integration</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Careers</li>
                <li>Contact</li>
                <li>Blog</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-gray-400">
                <p>+966 11 123 4567</p>
                <p>info@softwairs.ai</p>
                <p>Riyadh, Saudi Arabia</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Softwairs.ai. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
