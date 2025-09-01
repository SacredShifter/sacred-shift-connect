-- Add privacy-first discoverable setting to profiles
ALTER TABLE public.profiles ADD COLUMN is_discoverable boolean DEFAULT false;

-- Add email visibility setting for circle members
ALTER TABLE public.profiles ADD COLUMN show_email_to_circle_members boolean DEFAULT false;

-- Create index for performance on discoverable users
CREATE INDEX idx_profiles_is_discoverable ON public.profiles(is_discoverable) WHERE is_discoverable = true;

-- Create function to get discoverable users with circle context
CREATE OR REPLACE FUNCTION public.get_discoverable_users(requesting_user_id uuid)
RETURNS TABLE(
    id uuid,
    display_name text,
    avatar_url text,
    email text,
    is_circle_member boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.display_name,
        p.avatar_url,
        CASE 
            WHEN p.show_email_to_circle_members AND shared_circles.circle_count > 0 THEN au.email
            WHEN p.is_discoverable THEN au.email
            ELSE NULL
        END as email,
        COALESCE(shared_circles.circle_count > 0, false) as is_circle_member
    FROM public.profiles p
    LEFT JOIN auth.users au ON p.id = au.id
    LEFT JOIN (
        -- Find users who share circles with the requesting user
        SELECT 
            cgm2.user_id,
            COUNT(DISTINCT cgm2.group_id) as circle_count
        FROM circle_group_members cgm1
        JOIN circle_group_members cgm2 ON cgm1.group_id = cgm2.group_id
        WHERE cgm1.user_id = requesting_user_id 
        AND cgm2.user_id != requesting_user_id
        AND cgm1.status = 'active'
        AND cgm2.status = 'active'
        GROUP BY cgm2.user_id
    ) shared_circles ON p.id = shared_circles.user_id
    WHERE 
        p.id != requesting_user_id
        AND (
            p.is_discoverable = true 
            OR shared_circles.circle_count > 0
        );
END;
$$;