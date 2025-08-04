
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Lightbulb, LogOut, UserRound, Shield, Menu } from "lucide-react";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useUserProfile } from "@/hooks/useUserProfile";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
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
    setIsSheetOpen(false);
  };

  const handleMobileAuth = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
    setIsSheetOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsSheetOpen(false);
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
    <nav className="border-b py-4 px-4 md:px-6 bg-white/90 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between max-w-full">
        <Link to="/" className="flex items-center gap-2 min-w-0">
          <div className="h-9 w-9 rounded-full gradient-bg flex items-center justify-center shrink-0">
            <Lightbulb className="text-white h-5 w-5" />
          </div>
          <span className="text-xl md:text-2xl font-bold gradient-text truncate">Moeflex</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-6">
          <Link 
            to="/" 
            className={`${location.pathname === '/' ? 'text-foreground' : 'text-muted-foreground'} hover:text-foreground transition-colors`}
          >
            Home
          </Link>
          <Link 
            to="/marketplace" 
            className={`${location.pathname === '/marketplace' ? 'text-foreground' : 'text-muted-foreground'} hover:text-foreground transition-colors`}
          >
            SkillSwap
          </Link>
          <Link 
            to="/trends" 
            className={`${location.pathname === '/trends' ? 'text-foreground' : 'text-muted-foreground'} hover:text-foreground transition-colors`}
          >
            Trends
          </Link>
          <Link 
            to="/about" 
            className={`${location.pathname === '/about' ? 'text-foreground' : 'text-muted-foreground'} hover:text-foreground transition-colors`}
          >
            About
          </Link>
          <Link 
            to="/help" 
            className={`${location.pathname === '/help' ? 'text-foreground' : 'text-muted-foreground'} hover:text-foreground transition-colors`}
          >
            Help
          </Link>
        </div>

        {/* Desktop Right Side */}
        <div className="hidden md:flex items-center gap-3">
          {loading || profileLoading ? (
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
          ) : user ? (
            <div className="flex items-center gap-3">
              {!isAdmin && (
                <Link
                  to="/dashboard"
                  className={`${location.pathname === '/dashboard' ? 'text-foreground' : 'text-muted-foreground'} hover:text-foreground transition-colors`}
                >
                  Dashboard
                </Link>
              )}
              {isAdmin && (
                <Link
                  to="/admin-dashboard"
                  className={`${location.pathname === '/admin-dashboard' ? 'text-foreground' : 'text-muted-foreground'} hover:text-foreground transition-colors`}
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
                <DropdownMenuContent align="end" className="bg-background border z-50">
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
              <Button variant="outline" onClick={handleSignIn}>
                Sign In
              </Button>
              <Button variant="ghost" onClick={() => navigate('/admin-auth')}>
                <Shield className="mr-2 h-4 w-4" />
                Admin
              </Button>
            </>
          )}
          <Button className="gradient-bg" onClick={handleGetStarted}>Get Started</Button>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center gap-2">
          {user ? (
            <Button className="gradient-bg text-sm px-3 py-2" onClick={handleMobileAuth}>
              Dashboard
            </Button>
          ) : (
            <Button className="gradient-bg text-sm px-3 py-2" onClick={handleMobileAuth}>
              Sign In
            </Button>
          )}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 bg-background border-r">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-left">
                  <div className="h-8 w-8 rounded-full gradient-bg flex items-center justify-center">
                    <Lightbulb className="text-white h-4 w-4" />
                  </div>
                  <span className="text-xl font-bold gradient-text">Moeflex</span>
                </SheetTitle>
              </SheetHeader>
              
              <div className="mt-6 space-y-4">
                <Link 
                  to="/" 
                  onClick={() => handleNavigation('/')}
                  className={`block py-3 px-4 rounded-lg ${location.pathname === '/' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/50'} transition-colors`}
                >
                  Home
                </Link>
                <Link 
                  to="/marketplace" 
                  onClick={() => handleNavigation('/marketplace')}
                  className={`block py-3 px-4 rounded-lg ${location.pathname === '/marketplace' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/50'} transition-colors`}
                >
                  SkillSwap
                </Link>
                <Link 
                  to="/trends" 
                  onClick={() => handleNavigation('/trends')}
                  className={`block py-3 px-4 rounded-lg ${location.pathname === '/trends' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/50'} transition-colors`}
                >
                  Trends
                </Link>
                <Link 
                  to="/about" 
                  onClick={() => handleNavigation('/about')}
                  className={`block py-3 px-4 rounded-lg ${location.pathname === '/about' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/50'} transition-colors`}
                >
                  About
                </Link>
                <Link 
                  to="/help" 
                  onClick={() => handleNavigation('/help')}
                  className={`block py-3 px-4 rounded-lg ${location.pathname === '/help' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/50'} transition-colors`}
                >
                  Help
                </Link>

                {loading || profileLoading ? (
                  <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse mx-4"></div>
                ) : user ? (
                  <div className="space-y-2 pt-4 border-t">
                    {isAdmin ? (
                      <Link 
                        to="/admin-dashboard" 
                        onClick={() => handleNavigation('/admin-dashboard')}
                        className={`flex items-center gap-3 py-3 px-4 rounded-lg ${location.pathname === '/admin-dashboard' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/50'} transition-colors`}
                      >
                        <Shield className="h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    ) : (
                      <Link 
                        to="/dashboard" 
                        onClick={() => handleNavigation('/dashboard')}
                        className={`flex items-center gap-3 py-3 px-4 rounded-lg ${location.pathname === '/dashboard' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/50'} transition-colors`}
                      >
                        <UserRound className="h-4 w-4" />
                        Dashboard
                      </Link>
                    )}
                    <div className="flex items-center gap-3 py-3 px-4">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
                        <AvatarFallback>{getUserInitials()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate">{user.email}</p>
                        {isAdmin && <p className="text-xs text-red-500">Admin</p>}
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={handleSignOut}
                      className="w-full justify-start gap-3"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2 pt-4 border-t">
                    <Button 
                      variant="outline" 
                      onClick={handleSignIn}
                      className="w-full"
                    >
                      Sign In
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={() => handleNavigation('/admin-auth')}
                      className="w-full justify-start gap-3"
                    >
                      <Shield className="h-4 w-4" />
                      Admin
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
