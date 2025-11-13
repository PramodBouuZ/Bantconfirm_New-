import React from 'react';

interface HeroProps {
    onPrimaryAction: () => void;
    onSecondaryAction: () => void;
}

const Hero: React.FC<HeroProps> = ({ onPrimaryAction, onSecondaryAction }) => {
    return (
        <section className="relative bg-gray-900 text-white flex flex-col justify-center text-center overflow-hidden">
            <div
                className="absolute inset-0 bg-cover bg-center opacity-40"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop')" }}
            ></div>
            <div className="relative z-10 p-4 flex-grow flex flex-col items-center justify-center min-h-[calc(70vh-80px)]">
                <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
                    The Intelligent Marketplace for Business Tech
                </h1>
                <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                    Describe your need, and our AI will find the perfect tools, services, and vendors for you. Or, post a requirement and let the solutions come to you.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                     <button
                        onClick={onPrimaryAction}
                        className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg w-full sm:w-auto"
                    >
                        Find My Solution
                    </button>
                     <button
                        onClick={onSecondaryAction}
                        className="bg-gray-700 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-600 transition-all duration-300 transform hover:scale-105 shadow-lg w-full sm:w-auto"
                    >
                        Post a Requirement
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Hero;