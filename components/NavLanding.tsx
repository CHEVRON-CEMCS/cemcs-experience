import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuthStore } from '../store/authStore';

const navLinks = [
  { name: 'Ecommerce Store', url: '/shop' },
  { name: 'Travels', url: '/reservations' },
  { name: 'Retiree Platform', url: 'https://portal.chevroncemcs.com/#login' },
  { name: 'Member Platform', url: 'https://member.chevroncemcs.com/login' },
  { name: 'Blog', url: '/blog' }
];

const topLinks = [
  { name: 'Locations', url: '#' },
  { name: 'Contact Us', url: '#' },
  { name: 'Help Center', url: '#' }
];

export const NavLanding: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, isAuthenticated } = useAuthStore();
  console.log('is Authenticated:', isAuthenticated)
  const { memberDetails } = useAuthStore();
  console.log('User Details:', memberDetails)

  const handleExternalLink = (url: string) => {
    if (url.startsWith('http')) {
      window.open(url, '_blank');
    } else {
      window.location.href = url;
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-10 flex items-center justify-end border-b text-sm">
          <div className="flex gap-4">
            {topLinks.map((link) => (
              <a key={link.name} href={link.url} className="text-gray-600 hover:text-blue-600">
                {link.name}
              </a>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link href='/'>
              <span className="text-2xl font-bold text-blue-600">CEMCS</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <div key={link.name} className="relative group">
                <button
                  onClick={() => handleExternalLink(link.url)}
                  className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
                >
                  <span>{link.name}</span>
                </button>
              </div>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <Button 
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Sign Out
              </Button>
            ) : (
              <Link href="/signin">
                <Button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-blue-600"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleExternalLink(link.url)}
                  className="text-gray-600 hover:text-blue-600 text-left"
                >
                  {link.name}
                </button>
              ))}
              {isAuthenticated ? (
                <button 
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 w-full"
                >
                  Sign Out
                </button>
              ) : (
                <Link href="/signin">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full">
                    Sign In
                  </button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};