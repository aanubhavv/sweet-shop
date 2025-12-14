"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getToken } from "@/lib/auth";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check token after component mounts to avoid hydration issues
    const checkAuth = () => {
      const token = getToken();
      setIsLoggedIn(!!token);
      setMounted(true);
    };
    
    checkAuth();
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-primary/20 rounded-2xl"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-secondary/5"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
              <span className="mr-2">🍬</span> Welcome to Sweet Shop
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-linear-to-r from-primary via-purple-500 to-secondary bg-clip-text text-transparent">
                Delicious Treats
              </span>
              <br />
              <span className="text-foreground">Await You</span>
            </h1>
            <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10">
              Discover our handcrafted collection of premium sweets, chocolates, and confectioneries.
              Made with love, delivered with care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-white font-semibold text-lg hover:bg-primary-hover transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/25 transform hover:-translate-y-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Browse Sweets
              </Link>
              {!isLoggedIn && (
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-primary text-primary font-semibold text-lg hover:bg-primary hover:text-white transition-all duration-300"
                >
                  Create Account
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              )}
              {isLoggedIn && (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-secondary text-secondary font-semibold text-lg hover:bg-secondary hover:text-white transition-all duration-300"
                >
                  Go to Dashboard
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card-bg/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Us?</h2>
            <p className="text-muted max-w-xl mx-auto">
              We take pride in delivering the finest quality sweets with exceptional service.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card p-8 text-center group hover:border-primary">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:from-primary group-hover:to-primary-hover group-hover:text-white transition-all duration-300">
                <svg className="w-8 h-8 text-primary group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Premium Quality</h3>
              <p className="text-muted">
                Only the finest ingredients go into our handcrafted sweets.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card p-8 text-center group hover:border-secondary">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-linear-to-br from-secondary/20 to-secondary/5 flex items-center justify-center group-hover:from-secondary group-hover:to-secondary-hover group-hover:text-white transition-all duration-300">
                <svg className="w-8 h-8 text-secondary group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Fresh Daily</h3>
              <p className="text-muted">
                Our sweets are prepared fresh every day for maximum flavor.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card p-8 text-center group hover:border-accent">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-linear-to-br from-accent/20 to-accent/5 flex items-center justify-center group-hover:from-accent group-hover:to-accent-hover group-hover:text-white transition-all duration-300">
                <svg className="w-8 h-8 text-accent group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Easy Ordering</h3>
              <p className="text-muted">
                Simple and seamless ordering experience at your fingertips.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative card p-10 md:p-16 text-center overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-primary via-purple-600 to-secondary"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Ccircle%20cx%3D%222%22%20cy%3D%222%22%20r%3D%221%22%20fill%3D%22white%22%20fill-opacity%3D%220.1%22%2F%3E%3C%2Fsvg%3E')]"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Satisfy Your Sweet Tooth?
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of happy customers who have made Sweet Shop their go-to destination for premium confectioneries.
              </p>
              <Link
                href={isLoggedIn ? "/dashboard" : "/register"}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-primary font-semibold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {isLoggedIn ? "Browse Sweets" : "Get Started Now"}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-border bg-card-bg/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍬</span>
              <span className="font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">Sweet Shop</span>
            </div>
            <p className="text-muted text-sm">
              © {new Date().getFullYear()} Sweet Shop. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
