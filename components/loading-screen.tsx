"use client"

import React, { useState, useEffect } from 'react';
import { Sprout, Leaf, Wind, Cloud } from 'lucide-react';

interface LoadingScreenProps {
    onComplete?: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
    const [progress, setProgress] = useState(0);
    const [statusIndex, setStatusIndex] = useState(0);
    const [isExiting, setIsExiting] = useState(false);

    const loadingStatuses = [
        "Preparing the soil...",
        "Planting digital seeds...",
        "Cultivating connections...",
        "Nurturing your dashboard...",
        "Harvesting data..."
    ];

    // Simulated loading progress
    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(() => {
                        setIsExiting(true);
                        setTimeout(() => {
                            if (onComplete) onComplete();
                        }, 800); // Duration of fade-out animation
                    }, 300);
                    return 100;
                }
                return prev + 1;
            });
        }, 30); // Slightly faster for smoother feel

        const statusTimer = setInterval(() => {
            setStatusIndex((prev) => (prev + 1) % loadingStatuses.length);
        }, 1200);

        return () => {
            clearInterval(timer);
            clearInterval(statusTimer);
        };
    }, [onComplete]);

    return (
        <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-stone-50 overflow-hidden transition-all duration-700 ease-in-out ${isExiting ? 'opacity-0 transform scale-110 pointer-events-none' : 'opacity-100'}`}>
            {/* CSS Animations */}
            <style>
                {`
          @keyframes custom-translate-y {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          .animate-text-slide {
            animation: custom-translate-y 0.5s ease-out forwards;
          }
        `}
            </style>

            {/* Background Decorative Elements */}
            <div className="absolute top-10 sm:top-20 left-5 sm:left-10 text-emerald-100 opacity-40 animate-bounce">
                <Cloud className="h-12 w-12 sm:h-16 sm:w-16" />
            </div>
            <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 text-emerald-100 opacity-40 animate-pulse">
                <Wind className="h-16 w-16 sm:h-20 sm:w-20" />
            </div>

            {/* Central Animation Container */}
            <div className="relative flex items-center justify-center mb-12">
                {/* Connection Rings */}
                <div className="absolute w-40 h-40 sm:w-48 sm:h-48 border-4 border-emerald-200 border-dashed rounded-full animate-[spin_8s_linear_infinite]"></div>
                <div className="absolute w-32 h-32 sm:w-40 sm:h-40 border-2 border-emerald-400 border-dotted rounded-full animate-[spin_12s_linear_infinite_reverse]"></div>

                {/* Main Growing Sprout */}
                <div className="relative z-10 bg-white p-6 sm:p-8 rounded-full shadow-2xl shadow-emerald-200/50 flex items-center justify-center border-b-8 border-emerald-600">
                    <div className="animate-pulse">
                        <Sprout
                            className="h-12 w-12 sm:h-16 sm:w-16 text-emerald-600 transition-transform duration-500"
                            style={{ transform: `scale(${0.8 + (progress / 500)})` }}
                        />
                    </div>

                    {/* Floating Leaves */}
                    <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 text-emerald-400 animate-bounce delay-75">
                        <Leaf className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" />
                    </div>
                    <div className="absolute top-1/2 -left-6 sm:-left-8 text-emerald-300 animate-bounce delay-150">
                        <Leaf className="h-4 w-4 sm:h-5 sm:w-5 rotate-45" fill="currentColor" />
                    </div>
                </div>
            </div>

            {/* Brand & Progress Section */}
            <div className="text-center max-w-sm px-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-emerald-900 mb-2 tracking-tight">
                    Agri<span className="text-emerald-500">Connect</span>
                </h1>

                <div className="h-1.5 w-48 sm:w-64 bg-emerald-100 rounded-full overflow-hidden mx-auto mb-4 relative">
                    <div
                        className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                <div className="h-6 overflow-hidden">
                    <p
                        key={statusIndex}
                        className="text-stone-500 font-medium text-xs sm:text-sm animate-text-slide"
                    >
                        {loadingStatuses[statusIndex]}
                    </p>
                </div>

                <p className="mt-6 sm:mt-8 text-[10px] sm:text-xs text-stone-400 uppercase tracking-[0.2em]">
                    Empowering Farmers Through Technology
                </p>
            </div>

            {/* Footer Soil Line */}
            <div className="absolute bottom-0 w-full h-3 sm:h-4 bg-gradient-to-r from-emerald-800 to-stone-800"></div>
        </div>
    );
}
