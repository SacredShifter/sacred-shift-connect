import React from 'react';
import { motion } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Edit3 } from 'lucide-react';

interface ReflectionInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const ReflectionInput: React.FC<ReflectionInputProps> = ({
  value,
  onChange,
  placeholder = "What did you notice? How do you feel?"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="bg-gradient-to-br from-background/80 to-muted/30 border-border/50">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Edit3 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-foreground">
                  Sacred Reflection
                </h4>
                <p className="text-sm text-muted-foreground">
                  Capture your insights from this practice
                </p>
              </div>
            </div>
            
            <Textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="min-h-[120px] resize-none border-primary/20 focus:border-primary/40 bg-background/60 backdrop-blur-sm"
              rows={5}
            />
            
            {value.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-muted-foreground text-right"
              >
                {value.length} characters
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};