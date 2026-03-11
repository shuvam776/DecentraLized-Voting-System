import React from 'react';
import Navbar from '@/components/SemanticComponents/Navbar';
import Footer from '@/components/SemanticComponents/Footer';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
        <p className="text-gray-600">This section is restricted to election administrators.</p>
      </main>
      <Footer />
    </div>
  );
}
