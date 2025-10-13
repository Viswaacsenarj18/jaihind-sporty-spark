import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
import { Upload, Camera, Sparkles } from "lucide-react";
import virtualRoomImage from "../assets/virtual-room.jpg"; // make sure image exists

const VirtualRoom = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Virtual Trial</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Virtual Trial Room
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Try on clothes virtually using cutting-edge AI technology. See how items
            look on you before making a purchase.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Upload Section */}
          <div className="space-y-6">
            <div className="bg-card p-8 rounded-2xl shadow-card">
              <h2 className="text-2xl font-bold mb-6">Get Started</h2>

              {/* Upload Photo */}
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center mb-6 hover:border-primary transition-smooth cursor-pointer">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Upload Your Photo</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Choose a clear, front-facing photo
                </p>
                <Button variant="outline">Choose File</Button>
              </div>

              {/* Or Camera */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <Button variant="outline" className="w-full mt-6 gap-2">
                <Camera className="h-5 w-5" />
                Use Camera
              </Button>
            </div>

            {/* Instructions */}
            <div className="bg-muted/50 p-6 rounded-xl">
              <h3 className="font-semibold mb-3">Tips for Best Results</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Use a well-lit, clear photo</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Stand in front of a plain background</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Face the camera directly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Wear form-fitting clothes for accurate fitting</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            <div className="bg-card rounded-2xl shadow-card overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-2xl font-bold">Virtual Preview</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  See how items look on you
                </p>
              </div>

              <div className="aspect-[3/4] relative bg-muted">
                <img
                  src={virtualRoomImage}
                  alt="Virtual Trial Preview"
                  className="w-full h-full object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-secondary/80 backdrop-blur-sm">
                  <div className="text-center text-white p-8">
                    <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-semibold mb-2">
                      Upload a photo to get started
                    </h3>
                    <p className="text-white/80">
                      Your virtual try-on will appear here
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button size="lg" className="flex-1 btn-hero">
                Start Virtual Try-On
              </Button>
              <Button variant="outline" size="lg">
                Browse Products
              </Button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-xl shadow-card text-center">
            <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2">AI-Powered</h3>
            <p className="text-sm text-muted-foreground">
              Advanced AI technology for realistic try-on experience
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl shadow-card text-center">
            <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2">Real-Time Preview</h3>
            <p className="text-sm text-muted-foreground">
              See instant results with adjustable fit and size options
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl shadow-card text-center">
            <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2">Easy to Use</h3>
            <p className="text-sm text-muted-foreground">
              Simple upload process with step-by-step guidance
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VirtualRoom;
