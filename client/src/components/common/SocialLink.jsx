import React from 'react';
import { FaXTwitter, FaLinkedinIn, FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa6';

export const SocialLink = ({ name, url, iconType, isPlaceholder = false }) => {
  const renderIcon = () => {
    switch (iconType) {
      case 'x':
        return <FaXTwitter className="w-4 h-4" />;
      case 'linkedin':
        return <FaLinkedinIn className="w-4 h-4" />;
      case 'facebook':
        return <FaFacebookF className="w-4 h-4" />;
      case 'instagram':
        return <FaInstagram className="w-4 h-4" />;
      case 'youtube':
        return <FaYoutube className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={name}
      title={`${name}${isPlaceholder ? ' (Coming Soon)' : ''}`}
      className="w-9 h-9 rounded-xl bg-gray-800/80 hover:bg-agri-primary text-gray-300 hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-105 border border-gray-700/60 shadow-xs focus:outline-none focus:ring-2 focus:ring-agri-primary/50"
    >
      {renderIcon()}
    </a>
  );
};
