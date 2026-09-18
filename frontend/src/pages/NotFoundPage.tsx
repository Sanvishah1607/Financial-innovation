import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 bg-white text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#F8E9EE] text-[#8B1E3F] flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <h1 className="text-3xl font-black font-mono text-[#242424]">404</h1>
        <h2 className="text-base font-bold text-[#242424]">Page Not Found</h2>
        <p className="text-xs text-[#6B6B6B] leading-relaxed">
          The requested path could not be located in FinShield. It may have been moved or does not exist.
        </p>

        <div className="pt-4 flex items-center justify-center gap-3">
          <Link to="/dashboard">
            <Button icon={<Home className="w-4 h-4" />}>
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default NotFoundPage;
