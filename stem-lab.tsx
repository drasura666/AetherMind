import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Calculator, 
  ArrowsUpFromLine, 
  TrendingUp, 
  BookOpen,
  Zap
} from 'lucide-react';

export function STEMLab() {
  const [subject, setSubject] = useState('mathematics');
  const [problem, setProblem] = useState('');
  const [showSteps, setShowSteps] = useState(true);
  const [includeGraphs, setIncludeGraphs] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const subjects = [
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'physics', label: 'Physics' },
    { value: 'chemistry', label: 'Chemistry' },
    { value: 'biology', label: 'Biology' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'computer-science', label: 'Computer Science' },
  ];

  const tools = [
    { icon: Calculator, label: 'Scientific Calculator', action: 'calculator' },
    { icon: ArrowsUpFromLine, label: 'Unit Converter', action: 'converter' },
    { icon: TrendingUp, label: 'Function Grapher', action: 'grapher' },
    { icon: BookOpen, label: 'Formula Reference', action: 'formulas' },
  ];

  const recentProblems = [
    'Projectile Motion Analysis',
    'Calculus Integration',
    'Circuit Analysis'
  ];

  const handleSolveProblem = async () => {
    if (!problem.trim()) return;
    
    setIsLoading(true);
    
    // Simulate AI problem solving
    setTimeout(() => {
      setIsLoading(false);
      // In real implementation, this would call the AI with specialized STEM prompts
    }, 2000);
  };

  const handleToolClick = (action: string) => {
    console.log(`Opening ${action} tool`);
    // TODO: Implement specialized STEM tools
  };

  return (
    <div className="flex-1 flex flex-col" data-testid="stem-lab">
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">STEM Laboratory</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Advanced problem solving for Mathematics, Physics, Engineering, and Sciences
        </p>
      </div>

      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Problem Input */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Problem Statement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Subject Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subject Area
                  </label>
                  <Select value={subject} onValueChange={setSubject}>
                    <SelectTrigger data-testid="select-stem-subject">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subj) => (
                        <SelectItem key={subj.value} value={subj.value}>
                          {subj.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Problem Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Describe Your Problem
                  </label>
                  <Textarea
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    placeholder="Example: A projectile is launched at 45° with initial velocity 20 m/s. Find the maximum height and range..."
                    className="h-32"
                    data-testid="textarea-problem-statement"
                  />
                </div>

                {/* Options */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="showSteps"
                      checked={showSteps}
                      onCheckedChange={(checked) => setShowSteps(checked as boolean)}
                      data-testid="checkbox-show-steps"
                    />
                    <label htmlFor="showSteps" className="text-sm text-gray-700 dark:text-gray-300">
                      Show step-by-step solution
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeGraphs"
                      checked={includeGraphs}
                      onCheckedChange={(checked) => setIncludeGraphs(checked as boolean)}
                      data-testid="checkbox-include-graphs"
                    />
                    <label htmlFor="includeGraphs" className="text-sm text-gray-700 dark:text-gray-300">
                      Include graphs/diagrams
                    </label>
                  </div>
                </div>

                <Button
                  onClick={handleSolveProblem}
                  disabled={!problem.trim() || isLoading}
                  className="w-full"
                  data-testid="button-solve-problem"
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  {isLoading ? 'Solving Problem...' : 'Solve Problem'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Tools Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>STEM Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tools.map((tool, index) => {
                    const Icon = tool.icon;
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => handleToolClick(tool.action)}
                        data-testid={`button-tool-${tool.action}`}
                      >
                        <Icon className="h-4 w-4 mr-3" />
                        {tool.label}
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Problems */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Problems</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recentProblems.map((problemTitle, index) => (
                    <div
                      key={index}
                      className="p-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded cursor-pointer"
                      data-testid={`text-recent-problem-${index}`}
                    >
                      {problemTitle}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
