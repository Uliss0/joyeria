"use client";

import dynamic from 'next/dynamic';

const Header = dynamic(() => import('@/shared/components/Header'), { ssr: false });

export function ClientHeader() {
  return <Header />;
}