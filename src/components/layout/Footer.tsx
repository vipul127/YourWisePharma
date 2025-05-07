import { Link } from 'react-router-dom';
import { Pill, Mail, Twitter, Instagram, Linkedin, ChevronRight, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  return (
    <footer className="w-full border-t bg-card/50">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0 px-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Stethoscope className="h-6 w-6 text-primary" />
          <p className="text-center text-sm leading-loose md:text-left">
            Choose Responsibly by YourWisePharma
          </p>
        </div>
        <p className="text-center text-sm text-muted-foreground md:text-left">
          © 2025 YourWisePharma. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
