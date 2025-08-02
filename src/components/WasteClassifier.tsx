import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, Camera, Loader2, CheckCircle, XCircle, Info } from 'lucide-react';
import { toast } from 'sonner';
import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = true;

interface ClassificationResult {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  label: string;
  isBiodegradable: boolean;
}

const WasteClassifier = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ClassificationResult[]>([]);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Biodegradable categories
  const biodegradableItems = [
    'apple', 'banana', 'orange', 'carrot', 'broccoli', 'lettuce', 'tomato',
    'food', 'fruit', 'vegetable', 'bread', 'paper', 'cardboard', 'wood',
    'leaves', 'flowers', 'plant', 'organic'
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processImage(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      processImage(file);
    } else {
      toast.error('Please drop an image file');
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const processImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setSelectedImage(imageUrl);
      setResults([]);
      setProcessedImage(null);
    };
    reader.readAsDataURL(file);
  };

  const classifyWaste = async () => {
    if (!selectedImage) {
      toast.error('Please select an image first');
      return;
    }

    setProcessing(true);
    setProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      toast.info('Loading AI model...');
      
      // Load object detection model
      const detector = await pipeline(
        'object-detection',
        'Xenova/detr-resnet-50',
        { device: 'webgpu' }
      );

      setProgress(50);
      clearInterval(progressInterval);

      toast.info('Analyzing image...');

      // Perform object detection
      const detections = await detector(selectedImage);
      
      // Process results and classify as biodegradable or not
      const classifiedResults: ClassificationResult[] = detections.map((detection: any) => {
        const label = detection.label.toLowerCase();
        const isBiodegradable = biodegradableItems.some(item => 
          label.includes(item) || item.includes(label)
        );

        return {
          x: detection.box.xmin,
          y: detection.box.ymin,
          width: detection.box.xmax - detection.box.xmin,
          height: detection.box.ymax - detection.box.ymin,
          confidence: detection.score,
          label: detection.label,
          isBiodegradable
        };
      });

      setResults(classifiedResults);
      drawResults(classifiedResults);
      setProgress(100);

      const biodegradableCount = classifiedResults.filter(r => r.isBiodegradable).length;
      const nonBiodegradableCount = classifiedResults.length - biodegradableCount;

      toast.success(
        `Analysis complete! Found ${biodegradableCount} biodegradable and ${nonBiodegradableCount} non-biodegradable items`
      );

    } catch (error) {
      console.error('Classification error:', error);
      toast.error('Failed to analyze image. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const drawResults = (results: ClassificationResult[]) => {
    if (!canvasRef.current || !selectedImage) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw the original image
      ctx.drawImage(img, 0, 0);

      // Draw bounding boxes and labels
      results.forEach((result) => {
        const color = result.isBiodegradable ? '#22c55e' : '#ef4444';
        
        // Draw bounding box
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.strokeRect(result.x, result.y, result.width, result.height);

        // Draw label background
        const labelText = `${result.label} (${Math.round(result.confidence * 100)}%)`;
        ctx.font = '16px Arial';
        const textWidth = ctx.measureText(labelText).width;
        
        ctx.fillStyle = color;
        ctx.fillRect(result.x, result.y - 25, textWidth + 10, 25);

        // Draw label text
        ctx.fillStyle = 'white';
        ctx.fillText(labelText, result.x + 5, result.y - 8);

        // Draw biodegradable/non-biodegradable indicator
        const indicator = result.isBiodegradable ? '♻️' : '🚫';
        ctx.font = '20px Arial';
        ctx.fillText(indicator, result.x + result.width - 30, result.y + 25);
      });

      // Convert canvas to image
      setProcessedImage(canvas.toDataURL());
    };
    img.src = selectedImage;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Upload Section */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Camera className="w-6 h-6 text-eco-green" />
            Upload Waste Image
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="border-2 border-dashed border-eco-green rounded-lg p-8 text-center hover:bg-eco-green-light transition-all duration-300 cursor-pointer"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-12 h-12 text-eco-green mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">Drop your waste image here</p>
            <p className="text-muted-foreground">or click to browse files</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Analysis Section */}
      {selectedImage && (
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5 text-eco-green" />
              Image Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Original Image</h3>
                <img
                  src={selectedImage}
                  alt="Selected waste"
                  className="w-full rounded-lg shadow-soft"
                />
              </div>
              {processedImage && (
                <div>
                  <h3 className="font-semibold mb-2">Analysis Results</h3>
                  <img
                    src={processedImage}
                    alt="Processed waste analysis"
                    className="w-full rounded-lg shadow-soft"
                  />
                </div>
              )}
            </div>

            {processing && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-eco-green" />
                  <span className="text-sm font-medium">Processing image...</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}

            <Button
              onClick={classifyWaste}
              disabled={processing}
              variant="eco"
              size="lg"
              className="w-full"
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze Waste'
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Results Section */}
      {results.length > 0 && (
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-eco-green" />
              Classification Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="font-semibold text-eco-green flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Biodegradable Items
                </h3>
                {results
                  .filter(r => r.isBiodegradable)
                  .map((result, index) => (
                    <div key={index} className="p-3 bg-eco-green-light rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{result.label}</span>
                        <span className="text-sm text-eco-green">
                          {Math.round(result.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-eco-red flex items-center gap-2">
                  <XCircle className="w-4 h-4" />
                  Non-Biodegradable Items
                </h3>
                {results
                  .filter(r => !r.isBiodegradable)
                  .map((result, index) => (
                    <div key={index} className="p-3 bg-eco-red-light rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{result.label}</span>
                        <span className="text-sm text-eco-red">
                          {Math.round(result.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default WasteClassifier;