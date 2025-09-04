-- Add pre_release_access flag to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS pre_release_access boolean DEFAULT false;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_pre_release_access ON public.profiles(pre_release_access);

-- Optionally set some initial users to have pre-release access (replace with actual admin emails)
-- UPDATE public.profiles 
-- SET pre_release_access = true 
-- WHERE email IN ('admin@sacredshifter.com', 'kentburchard@sacredshifter.com');