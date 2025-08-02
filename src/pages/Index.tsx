import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Recycle, Leaf, Camera, Sparkles } from 'lucide-react';
import WasteClassifier from '@/components/WasteClassifier';
import heroImage from '@/assets/hero-waste-sorting.jpg';

const Index = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-bg">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-eco-green-light rounded-full text-eco-green font-medium">
                <Sparkles className="w-4 h-4" />
                AI-Powered Waste Sorting
              </div>
              
              <h1 className="text-5xl font-bold text-foreground leading-tight">
                <span className="text-2xl font-semibold bg-gradient-eco bg-clip-text text-transparent block mb-2">
                  EcoVerse
                </span>
                Sort Your Trash
                <span className="block bg-gradient-eco bg-clip-text text-transparent">
                  Intelligently
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                Upload an image of your waste and our AI will instantly identify which items are biodegradable and which need special disposal. Make recycling easier and more accurate.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="eco" size="xl" className="group" onClick={() => scrollToSection('waste-classifier')}>
                  <Camera className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Start Sorting
                </Button>
                <Button variant="outline" size="xl" onClick={() => scrollToSection('how-it-works')}>
                  Learn More
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <img
                src={heroImage}
                alt="Various waste items for sorting"
                className="rounded-2xl shadow-eco"
              />
              <div className="absolute inset-0 bg-gradient-eco opacity-10 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="how-it-works" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our advanced AI technology makes waste sorting simple and accurate
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="shadow-soft hover:shadow-eco transition-all duration-300">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gradient-eco rounded-lg flex items-center justify-center mx-auto mb-4">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Upload Image</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center">
                Take a photo or upload an image of your waste items
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-eco transition-all duration-300">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gradient-eco rounded-lg flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <CardTitle>AI Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center">
                Our AI identifies and classifies each item in your image
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-eco transition-all duration-300">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gradient-eco rounded-lg flex items-center justify-center mx-auto mb-4">
                <Recycle className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Get Results</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center">
                See which items are biodegradable and which need special disposal
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Waste Classifier Component */}
        <div id="waste-classifier">
          <WasteClassifier />
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-eco-green-light/20 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Use AI Waste Sorting?</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-eco-green rounded-full flex items-center justify-center mx-auto">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold">Eco-Friendly</h3>
              <p className="text-sm text-muted-foreground">
                Reduce environmental impact through proper waste sorting
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-nature-blue rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold">Accurate</h3>
              <p className="text-sm text-muted-foreground">
                AI-powered classification ensures high accuracy
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-earth-brown rounded-full flex items-center justify-center mx-auto">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold">Easy to Use</h3>
              <p className="text-sm text-muted-foreground">
                Simply upload an image and get instant results
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-eco-green rounded-full flex items-center justify-center mx-auto">
                <Recycle className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold">Educational</h3>
              <p className="text-sm text-muted-foreground">
                Learn about proper waste disposal methods
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
