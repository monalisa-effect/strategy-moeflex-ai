
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Lightbulb, LogOut, UserRound, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserProfile } from "@/hooks/useUserProfile";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { profile, loading: profileLoading } = useUserProfile(user);
  
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);
  
  const handleSignIn = () => {
    navigate("/auth");
  };
  
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast("Signed out successfully");
      navigate("/");
    } catch (error) {
      toast("Error signing out", {
        description: error.message,
      });
    }
  };
  
  const handleGetStarted = () => {
    navigate("/generator");
  };

  // Get initials for avatar fallback
  const getUserInitials = () => {
    if (!user) return "?";
    
    const email = user.email || "";
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    
    return "U";
  };

  const isAdmin = profile?.role === 'admin';
  
  return (
    <nav className="border-b py-4 px-6 bg-white/90 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-full gradient-bg flex items-center justify-center">
            <Lightbulb className="text-white h-5 w-5" />
          </div>
          <span className="text-2xl font-bold gradient-text">Moeflex</span>
        </Link>
        <div className="hidden md:flex gap-6">
          <Link 
            to="/" 
            className={`${location.pathname === '/' ? 'text-foreground' : 'text-muted-foreground'} hover:text-foreground transition-colors`}
          >
            Home
          </Link>
          <Link 
            to="/generator" 
            className={`${location.pathname === '/generator' ? 'text-foreground' : 'text-muted-foreground'} hover:text-foreground transition-colors`}
          >
            Strategy Generator
          </Link>
          <Link 
            to="/marketplace" 
            className={`${location.pathname === '/marketplace' ? 'text-foreground' : 'text-muted-foreground'} hover:text-foreground transition-colors`}
          >
            Marketplace
          </Link>
          <Link 
            to="/trends" 
            className={`${location.pathname === '/trends' ? 'text-foreground' : 'text-muted-foreground'} hover:text-foreground transition-colors`}
          >
            Trends
          </Link>
        </div>
        <div className="flex items-center gap-3">
          {loading || profileLoading ? (
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
          ) : user ? (
            <div className="flex items-center gap-3">
              {!isAdmin && (
                <Link
                  to="/dashboard"
                  className={`${location.pathname === '/dashboard' ? 'text-foreground' : 'text-muted-foreground'} hover:text-foreground transition-colors hidden md:block`}
                >
                  Dashboard
                </Link>
              )}
              {isAdmin && (
                <Link
                  to="/admin-dashboard"
                  className={`${location.pathname === '/admin-dashboard' ? 'text-foreground' : 'text-muted-foreground'} hover:text-foreground transition-colors hidden md:block`}
                >
                  Admin
                </Link>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-0 h-8 w-8 rounded-full">
                    <Avatar>
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel className="flex items-center gap-2">
                    {user.email}
                    {isAdmin && <Shield className="h-3 w-3 text-red-500" />}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isAdmin ? (
                    <DropdownMenuItem asChild>
                      <Link to="/admin-dashboard" className="cursor-pointer w-full">
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="cursor-pointer w-full">
                        <UserRound className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <>
              <Button variant="outline" className="hidden md:inline-flex" onClick={handleSignIn}>
                Sign In
              </Button>
              <Button variant="ghost" className="hidden md:inline-flex" onClick={() => navigate('/admin-auth')}>
                <Shield className="mr-2 h-4 w-4" />
                Admin
              </Button>
            </>
          )}
          <Button className="gradient-bg" onClick={handleGetStarted}>Get Started</Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
