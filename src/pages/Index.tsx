import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  ShieldCheck, 
  Wallet, 
  HeartPulse, 
  Pill, 
  ArrowRight,
  CheckCircle,
  DollarSign
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import Hero from '@/components/hero/Hero';

const features = [
  {
    icon: <Search className="h-8 w-8 text-primary" />,
    title: 'Easy Search',
    description: 'Find medications quickly with our intuitive search functionality.'
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: 'Risk Assessment',
    description: 'Understand potential side effects and risks before making a decision.'
  },
  {
    icon: <Wallet className="h-8 w-8 text-primary" />,
    title: 'Cost Comparison',
    description: 'Compare prices across different medications to find the most affordable option.'
  },
  {
    icon: <HeartPulse className="h-8 w-8 text-primary" />,
    title: 'Health Insights',
    description: 'Get detailed information about each medication and its effects on your health.'
  }
];

const howItWorks = [
  {
    icon: <Search className="h-8 w-8 text-white" />,
    title: 'Search',
    description: 'Enter the name of your medication to find alternatives.'
  },
  {
    icon: <Pill className="h-8 w-8 text-white" />,
    title: 'Compare',
    description: 'View side-by-side comparisons of different medications.'
  },
  {
    icon: <CheckCircle className="h-8 w-8 text-white" />,
    title: 'Choose',
    description: 'Select the best alternative based on price, risk, and availability.'
  },
  {
    icon: <DollarSign className="h-8 w-8 text-white" />,
    title: 'Save',
    description: 'Save money by finding the most cost-effective option.'
  }
];

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
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

  const handleGetStarted = () => {
    navigate('/medications');
  };

  return (
    <Layout>
      {/* Hero Section */}
      <Hero />
      
      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-4 font-sans"
            >
              Why Choose YourWisePharma?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-muted-foreground max-w-2xl mx-auto font-sans"
            >
              We provide a comprehensive platform for comparing medications, 
              helping you make informed decisions about your healthcare.
            </motion.p>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="bg-card rounded-2xl p-8 shadow-card card-hover border border-border"
              >
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 font-sans text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground font-sans">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20 px-6 bg-primary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-4 text-white font-sans"
            >
              How It Works
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-white/80 max-w-2xl mx-auto font-sans"
            >
              Finding the right medication alternative is easy with YourWisePharma.
            </motion.p>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {howItWorks.map((step, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
              >
                <div className="mb-6 flex items-center">
                  <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center">
                    {step.icon}
                  </div>
                  <div className="ml-4 text-white text-5xl font-bold">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white font-sans">{step.title}</h3>
                <p className="text-white/70 font-sans">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-6 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-primary to-blue-600 rounded-3xl p-8 md:p-12 text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-4 text-white font-sans"
            >
              Start Comparing Medications Today
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-white/80 max-w-2xl mx-auto mb-8 font-sans"
            >
              Find the best alternatives for your medications and make informed decisions.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button 
                size="lg" 
                variant="secondary" 
                className="rounded-full px-8 bg-white text-primary hover:bg-white/90 font-sans"
                onClick={handleGetStarted}
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
