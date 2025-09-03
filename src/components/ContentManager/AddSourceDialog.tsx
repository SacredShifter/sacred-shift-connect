import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { AddChannelSchema, AddChannelInput } from '@/lib/schemas';
import { addChannel } from '@/actions/addChannel';
import { ContentPlatform } from '@/components/PetalLotus';
import { parseYouTubeExternalId } from '@/lib/youtube';
import { Loader2, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { 
  detectPlatformFromUrl, 
  getPlatformConfig, 
  validateSourceUrl,
  getSourceIcon,
  getSourceColor,
  getSupportedFeatures,
  getOptimalSyncFrequency,
  PLATFORM_CONFIGS,
  type ContentPlatform 
} from '@/lib/content-sources';

interface AddSourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultPlatform?: ContentPlatform;
}

const PLATFORM_OPTIONS: { value: ContentPlatform; label: string; examples: string[] }[] = [
  { 
    value: 'youtube', 
    label: 'YouTube', 
    examples: [
      'https://www.youtube.com/channel/UCxxxxxx',
      '@username',
      'https://www.youtube.com/@username',
      'https://www.youtube.com/c/customname'
    ]
  },
  // Other platforms can be added back as their actions are supported
];

export const AddSourceDialog: React.FC<AddSourceDialogProps> = ({
  open,
  onOpenChange,
  defaultPlatform
}) => {
  const { toast } = useToast();
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    message: string;
    channelId?: string;
    handle?: string;
  } | null>(null);

  const form = useForm<AddChannelInput>({
    resolver: zodResolver(AddChannelSchema),
    defaultValues: {
      platform: defaultPlatform || 'youtube',
      urlOrHandle: '',
      title: '',
    },
  });

  const { formState: { isSubmitting } } = form;
  const selectedPlatform = form.watch('platform');
  const urlOrHandle = form.watch('urlOrHandle');

  const validateUrl = async () => {
    if (!urlOrHandle.trim()) return;

    setIsValidating(true);
    setValidationResult(null);

    try {
      const parsed = parseYouTubeExternalId(urlOrHandle);
      
      if (parsed.channelId || parsed.handle) {
        setValidationResult({
          isValid: true,
          message: 'Valid YouTube channel detected!',
          channelId: parsed.channelId,
          handle: parsed.handle
        });
      } else {
        setValidationResult({
          isValid: false,
          message: 'Invalid YouTube URL or handle format'
        });
      }
    } catch (error) {
      setValidationResult({
        isValid: false,
        message: 'Error validating URL'
      });
    } finally {
      setIsValidating(false);
    }
  };

  const onSubmit = async (values: AddChannelInput) => {
    try {
      // For now, the action only supports YouTube.
      // This check can be removed once other platforms are supported.
      if (values.platform !== 'youtube') {
        toast({
          title: "Platform not supported yet",
          description: "Only YouTube channels can be added at this time.",
          variant: "destructive"
        });
        return;
      }

      const result = await addChannel(values);
      
      toast({
        title: "Channel added successfully",
        description: result.message || "The channel has been added to your library and will be synced shortly.",
      });
      
      onOpenChange(false);
      form.reset();
      setValidationResult(null);
    } catch (error: any) {
      toast({
        title: "Error adding channel",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setValidationResult(null);
      form.reset();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Channel</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="platform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Platform</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PLATFORM_OPTIONS.map((platform) => (
                        <SelectItem key={platform.value} value={platform.value}>
                          {platform.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="urlOrHandle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Channel URL or Handle</FormLabel>
                  <div className="space-y-2">
                    <FormControl>
                      <div className="flex gap-2">
                        <Input
                          placeholder="https://www.youtube.com/@username or @username"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            setValidationResult(null);
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={validateUrl}
                          disabled={!urlOrHandle.trim() || isValidating}
                        >
                          {isValidating ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            'Validate'
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    
                    {/* Validation Result */}
                    {validationResult && (
                      <div className={`flex items-center gap-2 p-2 rounded-md text-sm ${
                        validationResult.isValid 
                          ? 'bg-green-50 text-green-700 border border-green-200' 
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {validationResult.isValid ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <AlertCircle className="w-4 h-4" />
                        )}
                        {validationResult.message}
                      </div>
                    )}

                    {/* Examples */}
                    <div className="text-xs text-muted-foreground">
                      <p className="font-medium mb-1">Examples:</p>
                      <ul className="space-y-1">
                        {PLATFORM_OPTIONS.find(p => p.value === selectedPlatform)?.examples.map((example, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <ExternalLink className="w-3 h-3" />
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custom Title (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Leave empty to use channel's default name"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !validationResult?.isValid}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  'Add Channel'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};