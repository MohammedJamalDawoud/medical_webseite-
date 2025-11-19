import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Activity, Layers, ArrowRight } from 'lucide-react';

const HomePage = () => {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative bg-gray-900 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-900 to-gray-900 opacity-90" />
                </div>
                <div className="relative max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                        Multimodal MRI-Based Tissue Segmentation
                    </h1>
                    <p className="mt-6 text-xl text-gray-300 max-w-3xl">
                        A comprehensive pipeline combining Gaussian Mixture Models and U-Net deep learning architectures for precise tissue segmentation of in vitro brain organoid MRI data.
                    </p>
                    <div className="mt-10 flex space-x-4">
                        <Link
                            to="/experiments"
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-teal-700"
                        >
                            View Experiments <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                        <Link
                            to="/pipeline"
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-teal-100 bg-teal-900 bg-opacity-60 hover:bg-opacity-70"
                        >
                            Explore Pipeline
                        </Link>
                    </div>
                </div>
            </div>

            {/* Feature Highlights */}
            <div className="py-16 bg-gray-50 overflow-hidden lg:py-24">
                <div className="relative max-w-xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
                    <div className="relative">
                        <h2 className="text-center text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            Project Highlights
                        </h2>
                        <p className="mt-4 max-w-3xl mx-auto text-center text-xl text-gray-500">
                            Bridging the gap between high-resolution MRI acquisition and automated analysis.
                        </p>
                    </div>

                    <div className="relative mt-12 lg:mt-24 lg:grid lg:grid-cols-3 lg:gap-8">
                        <div className="mt-10 lg:mt-0">
                            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mx-auto">
                                <Brain className="h-6 w-6" />
                            </div>
                            <div className="mt-5 text-center">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">Brain Organoids</h3>
                                <p className="mt-2 text-base text-gray-500">
                                    Analysis of human and marmoset brain organoids as models for cortical development and disease.
                                </p>
                            </div>
                        </div>

                        <div className="mt-10 lg:mt-0">
                            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mx-auto">
                                <Activity className="h-6 w-6" />
                            </div>
                            <div className="mt-5 text-center">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">Multimodal MRI</h3>
                                <p className="mt-2 text-base text-gray-500">
                                    Processing of T1w, T2w, DWI, and MGE sequences acquired at 9.4T ultra-high field strength.
                                </p>
                            </div>
                        </div>

                        <div className="mt-10 lg:mt-0">
                            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mx-auto">
                                <Layers className="h-6 w-6" />
                            </div>
                            <div className="mt-5 text-center">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">Hybrid Segmentation</h3>
                                <p className="mt-2 text-base text-gray-500">
                                    Novel workflow using GMM probability maps as priors for U-Net training to improve accuracy.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
