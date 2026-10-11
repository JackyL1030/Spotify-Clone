import { cn } from '@/lib/utils';
import { SignedOut, UserButton } from '@clerk/clerk-react';
import { LayoutDashboardIcon } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import SignInOAuthButtons from './SignIOAuthButtons';
import { buttonVariants } from './ui/button';

const Topbar = () => {
  const { isAdmin, checkAdminStatus } = useAuthStore();

  useEffect(() => {
    checkAdminStatus();
  }, [checkAdminStatus]);

  return (
    <div className="sticky top-0 z-10 flex items-center justify-between bg-zinc-900/75 p-4 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <img src="/spotify.png" className="size-8" alt="Spotify logo" />
        <span>Spotify</span>
      </div>

      <div className="flex items-center gap-4">
        {isAdmin && (
          <Link
            to="/admin"
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'border-white/20 bg-zinc-800 text-white hover:bg-zinc-700 hover:text-white',
            )}
          >
            <LayoutDashboardIcon className="mr-2 size-4" />
            Admin Dashboard
          </Link>
        )}

        <SignedOut>
          <SignInOAuthButtons />
        </SignedOut>

        <UserButton />
      </div>
    </div>
  );
};

export default Topbar;
