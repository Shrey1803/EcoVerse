import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent, 
  ChartLegend, 
  ChartLegendContent 
} from '@/components/ui/chart';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { 
  Recycle, 
  Leaf, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  ArrowLeft, 
  TrendingUp,
  TreePine,
  Trash2,
  MapPin,
  Clock,
  Award,
  Camera
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface DetectionResult {
  name: string;
  type: 'biodegradable' | 'non-biodegradable';
  confidence: number;
  box: number[];
}

interface ResultsData {
  detections: DetectionResult[];
  imageUrl?: string;
  analysisTime?: number;
}

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Mock data for demonstration - in real app, this would come from props/state/API
  const resultsData: ResultsData = location.state?.resultsData || {
    detections: [
      { name: 'apple', type: 'biodegradable', confidence: 0.92, box: [10, 15, 30, 35] },
      { name: 'bottle', type: 'non-biodegradable', confidence: 0.88, box: [45, 20, 25, 40] },
      { name: 'banana', type: 'biodegradable', confidence: 0.95, box: [20, 50, 35, 30] },
      { name: 'plastic bag', type: 'non-biodegradable', confidence: 0.83, box: [60, 10, 25, 45] },
      { name: 'orange peel', type: 'biodegradable', confidence: 0.89, box: [15, 70, 20, 25] },
    ],
    analysisTime: 2.3
  };

  const biodegradableItems = resultsData.detections.filter(item => item.type === 'biodegradable');
  const nonBiodegradableItems = resultsData.detections.filter(item => item.type === 'non-biodegradable');
  const totalItems = resultsData.detections.length;
  const biodegradablePercentage = (biodegradableItems.length / totalItems) * 100;

  // Chart data
  const pieChartData = [
    { 
      name: 'Biodegradable', 
      value: biodegradableItems.length, 
      fill: 'hsl(var(--eco-green))',
      percentage: biodegradablePercentage 
    },
    { 
      name: 'Non-Biodegradable', 
      value: nonBiodegradableItems.length, 
      fill: 'hsl(var(--eco-red))',
      percentage: 100 - biodegradablePercentage 
    },
  ];

  const confidenceData = resultsData.detections.map(item => ({
    name: item.name,
    confidence: Math.round(item.confidence * 100),
    type: item.type
  }));

  const disposalMethods = {
    biodegradable: [
      'Compost bin or backyard composting',
      'Municipal organic waste collection',
      'Food waste recycling programs',
      'Worm composting (vermicomposting)'
    ],
    'non-biodegradable': [
      'Clean and place in recycling bin',
      'Check local recycling guidelines',
      'Take to specialized recycling centers',
      'Reduce usage and reuse when possible'
    ]
  };

  const ecoTips = [
    'Consider using reusable alternatives to reduce non-biodegradable waste',
    'Start a home compost for organic materials',
    'Check your local recycling guidelines for proper sorting',
    'Reduce single-use items to minimize environmental impact'
  ];

  const chartConfig = {
    biodegradable: {
      label: "Biodegradable",
      color: "hsl(var(--eco-green))",
    },
    'non-biodegradable': {
      label: "Non-Biodegradable", 
      color: "hsl(var(--eco-red))",
    },
  };

  return (
    <div className="min-h-screen bg-gradient-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Upload
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Analysis Results</h1>
            <p className="text-muted-foreground">
              AI waste classification completed in {resultsData.analysisTime}s
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Trash2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalItems}</div>
              <p className="text-xs text-muted-foreground">detected objects</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Biodegradable</CardTitle>
              <Leaf className="h-4 w-4 text-eco-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-eco-green">{biodegradableItems.length}</div>
              <p className="text-xs text-muted-foreground">
                {biodegradablePercentage.toFixed(1)}% of total
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Non-Biodegradable</CardTitle>
              <Recycle className="h-4 w-4 text-eco-red" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-eco-red">{nonBiodegradableItems.length}</div>
              <p className="text-xs text-muted-foreground">
                {(100 - biodegradablePercentage).toFixed(1)}% of total
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Eco Score</CardTitle>
              <Award className="h-4 w-4 text-nature-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-nature-blue">
                {biodegradablePercentage > 60 ? 'A' : biodegradablePercentage > 40 ? 'B' : 'C'}
              </div>
              <p className="text-xs text-muted-foreground">environmental rating</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Pie Chart */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Waste Distribution
                </CardTitle>
                <CardDescription>
                  Breakdown of biodegradable vs non-biodegradable items
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-card p-3 border rounded-lg shadow-lg">
                              <p className="font-medium">{data.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {data.value} items ({data.percentage.toFixed(1)}%)
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <ChartLegend content={<ChartLegendContent />} />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Confidence Chart */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Detection Confidence</CardTitle>
                <CardDescription>
                  AI confidence levels for each detected item
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <BarChart data={confidenceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      fontSize={12}
                    />
                    <YAxis domain={[0, 100]} />
                    <ChartTooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-card p-3 border rounded-lg shadow-lg">
                              <p className="font-medium">{label}</p>
                              <p className="text-sm text-muted-foreground">
                                Confidence: {data.confidence}%
                              </p>
                              <p className="text-sm">
                                Type: {data.type === 'biodegradable' ? '🌱 Biodegradable' : '♻️ Non-Biodegradable'}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar 
                      dataKey="confidence" 
                      fill="hsl(var(--nature-blue))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Detected Items */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Detected Items
                </CardTitle>
                <CardDescription>
                  Detailed breakdown of all identified objects
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Biodegradable Items */}
                <div>
                  <h4 className="font-medium text-eco-green mb-3 flex items-center gap-2">
                    <TreePine className="w-4 h-4" />
                    Biodegradable ({biodegradableItems.length})
                  </h4>
                  <div className="space-y-2">
                    {biodegradableItems.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-eco-green-light rounded-lg">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-eco-green" />
                          <span className="font-medium capitalize">{item.name}</span>
                        </div>
                        <Badge variant="secondary" className="bg-eco-green text-white">
                          {Math.round(item.confidence * 100)}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Non-Biodegradable Items */}
                <div>
                  <h4 className="font-medium text-eco-red mb-3 flex items-center gap-2">
                    <Recycle className="w-4 h-4" />
                    Non-Biodegradable ({nonBiodegradableItems.length})
                  </h4>
                  <div className="space-y-2">
                    {nonBiodegradableItems.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-eco-red-light rounded-lg">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="w-4 h-4 text-eco-red" />
                          <span className="font-medium capitalize">{item.name}</span>
                        </div>
                        <Badge variant="secondary" className="bg-eco-red text-white">
                          {Math.round(item.confidence * 100)}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Disposal Methods */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Disposal Guidelines
                </CardTitle>
                <CardDescription>
                  Recommended disposal methods for detected items
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {biodegradableItems.length > 0 && (
                  <div>
                    <h4 className="font-medium text-eco-green mb-3 flex items-center gap-2">
                      <Leaf className="w-4 h-4" />
                      Biodegradable Items
                    </h4>
                    <ul className="space-y-2">
                      {disposalMethods.biodegradable.map((method, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-eco-green mt-0.5 flex-shrink-0" />
                          {method}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {nonBiodegradableItems.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium text-eco-red mb-3 flex items-center gap-2">
                        <Recycle className="w-4 h-4" />
                        Non-Biodegradable Items
                      </h4>
                      <ul className="space-y-2">
                        {disposalMethods['non-biodegradable'].map((method, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <AlertTriangle className="w-4 h-4 text-eco-red mt-0.5 flex-shrink-0" />
                            {method}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Eco Tips */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TreePine className="w-5 h-5 text-nature-blue" />
                  Eco-Friendly Tips
                </CardTitle>
                <CardDescription>
                  Ways to improve your environmental impact
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {ecoTips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-2 h-2 bg-nature-blue rounded-full mt-2 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          <Button 
            variant="eco" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <Camera className="w-4 h-4" />
            Analyze Another Image
          </Button>
          <Button 
            variant="outline"
            onClick={() => window.print()}
            className="flex items-center gap-2"
          >
            <Info className="w-4 h-4" />
            Save Results
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Results;