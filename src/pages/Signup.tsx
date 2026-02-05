import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/hooks/authHook';

const Signup = () => {
  const navigate = useNavigate();
  const { user ,register } = useAuth();
  console.log(user)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSignup = async(e: React.FormEvent) => {
   try {
     e.preventDefault();
     await register(formData.email, formData.password);
     // Static signup - just navigate to dashboard
     navigate('/');
   } catch (error) {
    console.error('Signup failed:', error);
   }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary" />
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 text-primary-foreground">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center backdrop-blur-sm">
                <Calendar className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-display font-bold">AppointFlow</h1>
            </div>
            <h2 className="text-4xl xl:text-5xl font-display font-bold leading-tight mb-6">
              Start Managing Smarter Today
            </h2>
            <p className="text-lg opacity-90 max-w-md">
              Join thousands of businesses using AppointFlow to optimize their appointment scheduling.
            </p>
          </div>

          <div className="space-y-4 mt-8">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-success" />
              <span>Free to get started</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-success" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-success" />
              <span>Set up in under 5 minutes</span>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-primary-foreground/10" />
        <div className="absolute top-20 -right-10 w-40 h-40 rounded-full bg-primary-foreground/5" />
      </div>

      {/* Right Panel - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-display font-bold text-foreground">AppointFlow</h1>
            </div>
          </div>

          <Card className="border-border/50 shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-display">Create an account</CardTitle>
              <CardDescription>Enter your details to get started</CardDescription>
            </CardHeader>
            <form onSubmit={handleSignup}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="h-11"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="h-11"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="h-11"
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full h-11 gradient-primary text-primary-foreground font-medium">
                  Create Account
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary font-medium hover:underline">
                    Sign in
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>

          <p className="text-xs text-muted-foreground text-center mt-6">
            By creating an account, you agree to our{' '}
            <button className="underline hover:text-foreground">Terms of Service</button> and{' '}
            <button className="underline hover:text-foreground">Privacy Policy</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
