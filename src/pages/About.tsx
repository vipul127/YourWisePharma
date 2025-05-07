import { motion } from 'framer-motion';
import { Shield, Users, Heart, Globe, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  // Team members data
 

  // Core values
  const values = [
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: 'Accuracy',
      description: 'We ensure that all medication information is up-to-date and scientifically accurate.',
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: 'Accessibility',
      description: 'Healthcare information should be accessible to everyone, regardless of background.',
    },
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: 'Patient-Centered',
      description: 'We put patients first in everything we do, from design to functionality.',
    },
    {
      icon: <Globe className="h-8 w-8 text-primary" />,
      title: 'Transparency',
      description: 'We are open about our data sources and how we compare medications.',
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              About YourWisePharma
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're on a mission to make medication comparison simple, transparent, and accessible for everyone.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {[
              {
                title: "Transparency",
                description: "We provide clear, unbiased information about medications and their alternatives."
              },
              {
                title: "Accessibility",
                description: "Making medication information accessible and understandable for everyone."
              },
              {
                title: "Empowerment",
                description: "Helping you make informed decisions about your healthcare options."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card p-6 rounded-lg shadow-sm"
              >
                <h3 className="text-xl font-semibold mb-4 text-foreground">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-6 text-foreground">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  YourWisePharma began with a simple observation: finding affordable medication alternatives shouldn't be complicated. 
                  Our founders experienced a societial problem of finding the right medication at the right price.
                </p>
                <p>
                  Started as a mini project is now a comprehensive platform that helps thousands of people 
                  compare medications, understand their options, and make informed healthcare decisions.
                </p>
                <p>
                  YourWisePharma is for the patients and healthcare providers alike for its accurate, 
                  up-to-date information and user-friendly interface.
                </p>
              </div>
              <Button 
                className="mt-8 rounded-full"
                onClick={() => navigate('/medications')}
              >
                Start Comparing
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-card rounded-lg p-8"
            >
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Our Vision</h3>
                  <p className="text-muted-foreground">
                    To create a world where everyone has access to affordable medication options through 
                    transparent information and easy-to-use comparison tools.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Our Values</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Transparency in all our operations</li>
                    <li>• User privacy and data security</li>
                    <li>• Continuous improvement and innovation</li>
                    <li>• Commitment to accuracy and reliability</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { number: "25 Lakh+", label: "Medications" },
              { number: "1000+", label: "Pharma Companies" },
              { number: "Indian", label: "Region" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold mb-2 text-primary">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-primary">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary-foreground">
              Ready to Find the Best Medication Options?
            </h2>
            <p className="text-primary-foreground/80 mb-8">
              Start comparing medications today and make informed healthcare decisions.
            </p>
            <Button 
              size="lg"
              variant="secondary"
              onClick={() => navigate('/medications')}
              className="rounded-full px-8"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
