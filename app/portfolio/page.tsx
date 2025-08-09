// app/portfolio/page.tsx
import React from 'react';
import PortfolioPage from '@/components/portfolio/PortfolioPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio - Crypto Tracker',
  description: 'Track your cryptocurrency portfolio performance, profits and losses.',
};

export default function Portfolio() {
  return <PortfolioPage />;
}