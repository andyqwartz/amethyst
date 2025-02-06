-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.image_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reference_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_views ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = true
));

CREATE POLICY "Admins can update all profiles"
ON public.profiles FOR UPDATE
TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = true
));

-- Images policies
CREATE POLICY "Public read access for images"
ON public.images FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can insert images"
ON public.images FOR INSERT
TO authenticated
WITH CHECK (true);

-- Generated images policies
CREATE POLICY "Users can view their own generated images"
ON public.generated_images FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own generated images"
ON public.generated_images FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all generated images"
ON public.generated_images FOR SELECT
TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = true
));

-- Reference images policies
CREATE POLICY "Users can view their own reference images"
ON public.reference_images FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own reference images"
ON public.reference_images FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Credit transactions policies
CREATE POLICY "Users can view their own transactions"
ON public.credit_transactions FOR SELECT
TO authenticated
USING (profile_id = auth.uid());

CREATE POLICY "System can insert transactions"
ON public.credit_transactions FOR INSERT
TO authenticated
WITH CHECK (true);

-- Ad views policies
CREATE POLICY "Users can view their own ad views"
ON public.ad_views FOR SELECT
TO authenticated
USING (profile_id = auth.uid());

CREATE POLICY "Users can insert their own ad views"
ON public.ad_views FOR INSERT
TO authenticated
WITH CHECK (profile_id = auth.uid());

-- Image metadata policies
CREATE POLICY "Users can view image metadata"
ON public.image_metadata FOR SELECT
TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.images i
    LEFT JOIN public.generated_images gi ON i.id = gi.image_id
    LEFT JOIN public.reference_images ri ON i.id = ri.image_id
    WHERE image_metadata.image_id = i.id
    AND (gi.user_id = auth.uid() OR ri.user_id = auth.uid())
));

CREATE POLICY "System can insert image metadata"
ON public.image_metadata FOR INSERT
TO authenticated
WITH CHECK (true);

-- Add admin bypass policies for all tables
CREATE POLICY "Admins have full access to all tables"
ON public.images FOR ALL
TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = true
));

CREATE POLICY "Admins have full access to image metadata"
ON public.image_metadata FOR ALL
TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = true
));

CREATE POLICY "Admins have full access to credit transactions"
ON public.credit_transactions FOR ALL
TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = true
));

CREATE POLICY "Admins have full access to ad views"
ON public.ad_views FOR ALL
TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = true
));
