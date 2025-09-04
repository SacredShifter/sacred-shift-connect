-- Grant early portal access to kentburchard@sacredshifter.com and kentburchard@gmail.com
UPDATE public.profiles 
SET pre_release_access = true 
WHERE user_id IN ('69718f08-3f37-46ed-b0c2-f1528e762bb9', 'b7e7732a-476c-43bc-99c9-0ebe5b76fe5c');