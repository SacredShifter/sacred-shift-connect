/**
 * Living Advertisement Navigation
 * Simple navigation for the advertisement experience
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Home, 
  Play, 
  LogIn, 
  Sparkles, 
  Brain, 
  Volume2, 
  Users, 
  Crown,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AdNavigationProps {
  currentPage?: 'landing' | 'showcase';
  className?: string;
}

export const AdNavigation: React.FC<AdNavigationProps> = ({ 
  currentPage = 'landing',
  className 
}) => {
  const navItems = [
    { 
      label: 'Home', 
      path: '/', 
      icon: Home,
      active: currentPage === 'landing'
    },
    { 
      label: 'Live Demo', 
      path: '/showcase', 
      icon: Play,
      active: currentPage === 'showcase'
    }
  ];

  const features = [
    { icon: Brain, label: 'Consciousness' },
    { icon: Volume2, label: 'Audio' },
    { icon: Users, label: 'Collective' },
    { icon: Crown, label: 'Sacred' },
    { icon: Heart, label: 'Biofeedback' }
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Sacred Shifter
              </div>
              <div className="text-xs text-gray-400">Connect</div>
            </div>
          </Link>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={item.active ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "text-sm",
                      item.active 
                        ? "bg-gradient-to-r from-purple-600 to-pink-600" 
                        : "text-gray-300 hover:text-white hover:bg-slate-700"
                    )}
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Feature Indicators */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="text-sm text-gray-400">Live Features:</div>
            <div className="flex space-x-2">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <motion.div
                    key={feature.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    className="flex items-center space-x-1 px-2 py-1 bg-slate-800/50 rounded-lg"
                  >
                    <IconComponent className="w-3 h-3 text-purple-400" />
                    <span className="text-xs text-gray-300">{feature.label}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              className="border-purple-300 text-purple-300 hover:bg-purple-300 hover:text-slate-900"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
            
            <Button
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Start Journey
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default AdNavigation;
