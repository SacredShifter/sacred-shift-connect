import React from 'react';
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

      await addChannel(values);
      toast({
        title: "Channel added",
        description: "The channel has been added to your library and will be synced shortly.",
      });
      onOpenChange(false);
      form.reset();
    } catch (error: any) {
      toast({
        title: "Error adding channel",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                      {PLATFORM_OPTIONS.map(platform => (
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
                  <FormLabel>YouTube URL or @handle</FormLabel>
                  <FormControl>
                    <Input placeholder={PLATFORM_OPTIONS.find(p => p.value === selectedPlatform)?.examples[0] || ''} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="My Favorite Creator" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Channel'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};