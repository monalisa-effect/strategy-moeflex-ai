-- Create SkillSwap related tables

-- Create user_profiles table for extended user information
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  bio TEXT,
  location TEXT,
  avatar_url TEXT,
  portfolio_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create skill_categories table for organizing skills
CREATE TABLE public.skill_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create skills table
CREATE TABLE public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category_id UUID REFERENCES public.skill_categories(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_skills table for services offered and needed
CREATE TABLE public.user_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('offering', 'needing')),
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, skill_id, type)
);

-- Create swap_listings table for public swap posts
CREATE TABLE public.swap_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  offering_skill_id UUID NOT NULL REFERENCES public.skills(id),
  needing_skill_id UUID NOT NULL REFERENCES public.skills(id),
  estimated_hours INTEGER,
  delivery_time TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create swap_offers table for swap proposals
CREATE TABLE public.swap_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.swap_listings(id) ON DELETE CASCADE,
  proposer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  offering_skill_id UUID NOT NULL REFERENCES public.skills(id),
  needing_skill_id UUID NOT NULL REFERENCES public.skills(id),
  proposed_hours INTEGER,
  proposed_delivery_time TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create messages table for simple messaging
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  swap_offer_id UUID REFERENCES public.swap_offers(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reviews table for post-exchange feedback
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  swap_offer_id UUID NOT NULL REFERENCES public.swap_offers(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reviewee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(swap_offer_id, reviewer_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.swap_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.swap_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_profiles
CREATE POLICY "Users can view all profiles" ON public.user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for skill_categories (public read)
CREATE POLICY "Anyone can view skill categories" ON public.skill_categories FOR SELECT USING (true);

-- Create RLS policies for skills (public read)
CREATE POLICY "Anyone can view skills" ON public.skills FOR SELECT USING (true);

-- Create RLS policies for user_skills
CREATE POLICY "Users can view all user skills" ON public.user_skills FOR SELECT USING (true);
CREATE POLICY "Users can manage their own skills" ON public.user_skills FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for swap_listings
CREATE POLICY "Users can view all active listings" ON public.swap_listings FOR SELECT USING (true);
CREATE POLICY "Users can create their own listings" ON public.swap_listings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own listings" ON public.swap_listings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own listings" ON public.swap_listings FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for swap_offers
CREATE POLICY "Users can view offers for their listings or offers they made" ON public.swap_offers FOR SELECT 
USING (auth.uid() = proposer_id OR auth.uid() = (SELECT user_id FROM swap_listings WHERE id = listing_id));
CREATE POLICY "Users can create offers" ON public.swap_offers FOR INSERT WITH CHECK (auth.uid() = proposer_id);
CREATE POLICY "Users can update offers they made or received" ON public.swap_offers FOR UPDATE 
USING (auth.uid() = proposer_id OR auth.uid() = (SELECT user_id FROM swap_listings WHERE id = listing_id));

-- Create RLS policies for messages
CREATE POLICY "Users can view their own messages" ON public.messages FOR SELECT 
USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update messages they received" ON public.messages FOR UPDATE USING (auth.uid() = recipient_id);

-- Create RLS policies for reviews
CREATE POLICY "Users can view all reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews for completed swaps" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_swap_listings_updated_at
  BEFORE UPDATE ON public.swap_listings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_swap_offers_updated_at
  BEFORE UPDATE ON public.swap_offers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample skill categories
INSERT INTO public.skill_categories (name, description) VALUES
  ('Design', 'Visual design, graphics, and creative services'),
  ('Content', 'Writing, copywriting, and content creation'),
  ('Marketing', 'Digital marketing, social media, and promotion'),
  ('Development', 'Web development, programming, and technical services'),
  ('Video', 'Video editing, motion graphics, and multimedia'),
  ('Audio', 'Audio editing, music production, and sound design'),
  ('Business', 'Business consulting, strategy, and operations'),
  ('Education', 'Teaching, training, and educational content');

-- Insert sample skills
INSERT INTO public.skills (name, category_id) VALUES
  ('Graphic Design', (SELECT id FROM skill_categories WHERE name = 'Design')),
  ('Logo Design', (SELECT id FROM skill_categories WHERE name = 'Design')),
  ('UI/UX Design', (SELECT id FROM skill_categories WHERE name = 'Design')),
  ('Illustration', (SELECT id FROM skill_categories WHERE name = 'Design')),
  ('Copywriting', (SELECT id FROM skill_categories WHERE name = 'Content')),
  ('Blog Writing', (SELECT id FROM skill_categories WHERE name = 'Content')),
  ('SEO Writing', (SELECT id FROM skill_categories WHERE name = 'Content')),
  ('Social Media Marketing', (SELECT id FROM skill_categories WHERE name = 'Marketing')),
  ('Email Marketing', (SELECT id FROM skill_categories WHERE name = 'Marketing')),
  ('PPC Advertising', (SELECT id FROM skill_categories WHERE name = 'Marketing')),
  ('Web Development', (SELECT id FROM skill_categories WHERE name = 'Development')),
  ('Mobile App Development', (SELECT id FROM skill_categories WHERE name = 'Development')),
  ('WordPress Development', (SELECT id FROM skill_categories WHERE name = 'Development')),
  ('Video Editing', (SELECT id FROM skill_categories WHERE name = 'Video')),
  ('Motion Graphics', (SELECT id FROM skill_categories WHERE name = 'Video')),
  ('Animation', (SELECT id FROM skill_categories WHERE name = 'Video')),
  ('Podcast Editing', (SELECT id FROM skill_categories WHERE name = 'Audio')),
  ('Music Production', (SELECT id FROM skill_categories WHERE name = 'Audio')),
  ('Business Strategy', (SELECT id FROM skill_categories WHERE name = 'Business')),
  ('Online Teaching', (SELECT id FROM skill_categories WHERE name = 'Education'));