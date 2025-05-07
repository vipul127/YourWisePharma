import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import ComparisonView from '@/components/comparison/ComparisonView';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Compare = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Layout>
      <motion.section 
        className="pt-32 pb-20 px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            className="mb-8"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <motion.div 
            className="text-center mb-12"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Compare Alternatives
            </h1>
            
            <p className="text-muted-foreground max-w-2xl mx-auto mb-10">
              Compare medication alternatives to make informed healthcare decisions.
            </p>
          </motion.div>
          
          <div>
            <ComparisonView />
          </div>
        </div>
      </motion.section>
    </Layout>
  );
};

export default Compare;
