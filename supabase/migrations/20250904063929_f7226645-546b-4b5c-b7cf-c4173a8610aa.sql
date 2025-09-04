-- Create pulse_fi_notifications table for Pulse-Fi launch notifications
CREATE TABLE public.pulse_fi_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id),
  subscription_type TEXT NOT NULL DEFAULT 'launch_notification',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.pulse_fi_notifications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own notification preferences"
ON public.pulse_fi_notifications
FOR ALL
USING (auth.uid() = user_id OR user_id IS NULL)
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Create trigger for updated_at
CREATE TRIGGER update_pulse_fi_notifications_updated_at
  BEFORE UPDATE ON public.pulse_fi_notifications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();