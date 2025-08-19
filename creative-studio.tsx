import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Lightbulb, 
  Wand2, 
  Globe, 
  Rocket,
  BookOpen,
  Users,
  Zap,
  Target,
  TreePine,
  Building,
  Palette,
  Play,
  Download,
  RefreshCw,
  Sparkles
} from 'lucide-react';

export function CreativeStudio() {
  const [projectType, setProjectType] = useState('worldbuilding');
  const [genre, setGenre] = useState('sci-fi');
  const [creativity, setCreativity] = useState([75]);
  const [prompt, setPrompt] = useState('');
  const [timeline, setTimeline] = useState('near-future');
  const [isGenerating, setIsGenerating] = useState(false);

  const projectTypes = [
    { value: 'worldbuilding', label: '🌍 Worldbuilding', icon: Globe },
    { value: 'character', label: '👤 Character Creation', icon: Users },
    { value: 'story', label: '📖 Story Writing', icon: BookOpen },
    { value: 'scenario', label: '🔮 Future Scenarios', icon: Rocket },
    { value: 'innovation', label: '💡 Innovation Lab', icon: Lightbulb },
    { value: 'startup', label: '🚀 Startup Planning', icon: Target },
  ];

  const genres = [
    { value: 'sci-fi', label: 'Science Fiction' },
    { value: 'fantasy', label: 'Fantasy' },
    { value: 'dystopian', label: 'Dystopian' },
    { value: 'utopian', label: 'Utopian' },
    { value: 'cyberpunk', label: 'Cyberpunk' },
    { value: 'steampunk', label: 'Steampunk' },
    { value: 'realistic', label: 'Realistic Fiction' },
    { value: 'historical', label: 'Historical' },
  ];

  const timelines = [
    { value: 'past', label: 'Historical Past' },
    { value: 'present', label: 'Present Day' },
    { value: 'near-future', label: 'Near Future (2030-2050)' },
    { value: 'far-future', label: 'Far Future (2100+)' },
    { value: 'post-apocalyptic', label: 'Post-Apocalyptic' },
    { value: 'alternate', label: 'Alternate Timeline' },
  ];

  const creativeTools = [
    { icon: Wand2, label: 'Idea Generator', action: 'generate' },
    { icon: Palette, label: 'Mood Board', action: 'moodboard' },
    { icon: TreePine, label: 'Map Creator', action: 'map' },
    { icon: Building, label: 'Society Builder', action: 'society' },
  ];

  const templates = [
    {
      type: 'Mars Colony 2075',
      description: 'Design a sustainable colony on Mars with unique challenges',
      tags: ['Sci-Fi', 'Future', 'Space'],
    },
    {
      type: 'Medieval Fantasy Realm',
      description: 'Create a magical kingdom with complex political systems',
      tags: ['Fantasy', 'Medieval', 'Magic'],
    },
    {
      type: 'AI-Governed Society',
      description: 'Explore a world where AI makes all governmental decisions',
      tags: ['Sci-Fi', 'AI', 'Politics'],
    },
  ];

  const generatedContent = {
    worldbuilding: {
      title: 'Neo-Singapore 2045: The Floating Metropolis',
      description: 'A climate-adapted city-state built on artificial floating platforms in Southeast Asia.',
      elements: {
        environment: 'Rising sea levels have transformed Singapore into a multi-tiered floating city connected by underwater tunnels and aerial bridges.',
        society: 'A post-scarcity society where resource allocation is managed by quantum AI, citizens work in creative and exploratory roles.',
        technology: 'Fusion-powered atmospheric processors, neural-link communication, bio-integrated architecture that grows and adapts.',
        conflict: 'Tension between traditional ground-dwellers and the new floating population, resource disputes with mainland nations.',
        culture: 'Blend of Southeast Asian traditions with futuristic customs, water-based festivals, vertical farming communities.',
      },
    },
  };

  const scenarioPrompts = [
    'What if AI achieved consciousness in 2030?',
    'How would society change if teleportation was invented?',
    'What would happen if we discovered alien life?',
    'How would education evolve in virtual reality?',
    'What if genetic engineering eliminated all diseases?',
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
  };

  const handleToolAction = (action: string) => {
    console.log(`Executing creative tool: ${action}`);
    // TODO: Implement creative tools
  };

  const handleTemplateSelect = (template: any) => {
    setPrompt(`Create a detailed world based on: ${template.type} - ${template.description}`);
  };

  return (
    <div className="flex-1 flex flex-col" data-testid="creative-studio">
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white px-6 py-6">
        <h2 className="text-2xl font-bold mb-2">Creative Studio</h2>
        <p className="text-purple-100">
          AI-powered worldbuilding, storytelling, and innovation laboratory
        </p>
      </div>

      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Project Configuration */}
            <Card className="border-2 border-purple-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  <span>Create New Project</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Project Type
                    </label>
                    <Select value={projectType} onValueChange={setProjectType}>
                      <SelectTrigger data-testid="select-project-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {projectTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Genre/Style
                    </label>
                    <Select value={genre} onValueChange={setGenre}>
                      <SelectTrigger data-testid="select-genre">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {genres.map((g) => (
                          <SelectItem key={g.value} value={g.value}>
                            {g.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Timeline/Era
                    </label>
                    <Select value={timeline} onValueChange={setTimeline}>
                      <SelectTrigger data-testid="select-timeline">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timelines.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Creativity Level: {creativity[0]}%
                  </label>
                  <Slider
                    value={creativity}
                    onValueChange={setCreativity}
                    max={100}
                    min={1}
                    step={1}
                    className="mb-2"
                    data-testid="slider-creativity"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Realistic</span>
                    <span>Balanced</span>
                    <span>Imaginative</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Creative Brief
                  </label>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your creative vision... What world, story, or concept do you want to explore?"
                    className="h-32 border-purple-200 focus:border-purple-500"
                    data-testid="textarea-creative-brief"
                  />
                </div>

                {/* Inspiration Prompts */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">💭 Need inspiration? Try these:</h4>
                  <div className="flex flex-wrap gap-2">
                    {scenarioPrompts.map((scenarioPrompt, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => setPrompt(scenarioPrompt)}
                        className="text-xs hover:bg-purple-100 dark:hover:bg-purple-900"
                        data-testid={`button-inspiration-${index}`}
                      >
                        {scenarioPrompt}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  data-testid="button-generate-content"
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  {isGenerating ? 'Creating Magic...' : 'Generate Creative Content'}
                </Button>
              </CardContent>
            </Card>

            {/* Generated Content Display */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Generated World</CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" data-testid="button-regenerate">
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Regenerate
                    </Button>
                    <Button variant="outline" size="sm" data-testid="button-export-world">
                      <Download className="h-3 w-3 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {generatedContent.worldbuilding.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {generatedContent.worldbuilding.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(generatedContent.worldbuilding.elements).map(([key, value]) => (
                      <Card key={key} className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2 capitalize flex items-center">
                            {key === 'environment' && <TreePine className="h-4 w-4 mr-2 text-green-600" />}
                            {key === 'society' && <Users className="h-4 w-4 mr-2 text-blue-600" />}
                            {key === 'technology' && <Zap className="h-4 w-4 mr-2 text-purple-600" />}
                            {key === 'conflict' && <Target className="h-4 w-4 mr-2 text-red-600" />}
                            {key === 'culture' && <Palette className="h-4 w-4 mr-2 text-orange-600" />}
                            {key}
                          </h4>
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            {value}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Interactive Elements */}
                  <div className="border-t pt-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Explore Further</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <Button variant="outline" className="justify-start" data-testid="button-create-characters">
                        <Users className="h-4 w-4 mr-2" />
                        Create Characters
                      </Button>
                      <Button variant="outline" className="justify-start" data-testid="button-design-map">
                        <Globe className="h-4 w-4 mr-2" />
                        Design Map
                      </Button>
                      <Button variant="outline" className="justify-start" data-testid="button-write-story">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Write Story
                      </Button>
                      <Button variant="outline" className="justify-start" data-testid="button-simulate-scenario">
                        <Play className="h-4 w-4 mr-2" />
                        Simulate Scenario
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Creative Tools */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Creative Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {creativeTools.map((tool, index) => {
                    const Icon = tool.icon;
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => handleToolAction(tool.action)}
                        data-testid={`button-creative-tool-${tool.action}`}
                      >
                        <Icon className="h-4 w-4 mr-3" />
                        {tool.label}
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Templates */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {templates.map((template, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => handleTemplateSelect(template)}
                      data-testid={`button-template-${index}`}
                    >
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                        {template.type}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        {template.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {template.tags.map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Innovation Lab */}
            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950">
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <Rocket className="h-4 w-4 mr-2 text-orange-600" />
                  Innovation Lab
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  Explore breakthrough ideas and future technologies
                </p>
                <Button 
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  data-testid="button-innovation-lab"
                >
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Start Innovation Session
                </Button>
              </CardContent>
            </Card>

            {/* What-if Simulator */}
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <Globe className="h-4 w-4 mr-2 text-blue-600" />
                  What-If Simulator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  Simulate future scenarios and their implications
                </p>
                <Button 
                  variant="outline" 
                  className="w-full border-blue-200 hover:bg-blue-100 dark:border-blue-800 dark:hover:bg-blue-900"
                  data-testid="button-what-if-simulator"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Run Simulation
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}