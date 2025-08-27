import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Play, 
  Download, 
  FileText, 
  Bug, 
  Zap,
  BookOpen,
  TestTube,
  RefreshCw,
  MessageSquare
} from 'lucide-react';

export function CodeLab() {
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(`# Write your code here...
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Test the function
for i in range(10):
    print(f'F({i}) = {fibonacci(i)}')`);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');

  const languages = [
    { value: 'python', label: 'Python' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'cpp', label: 'C++' },
    { value: 'java', label: 'Java' },
    { value: 'rust', label: 'Rust' },
    { value: 'go', label: 'Go' },
  ];

  const quickActions = [
    { icon: FileText, label: 'Explain this code', action: 'explain' },
    { icon: TestTube, label: 'Generate test cases', action: 'tests' },
    { icon: BookOpen, label: 'Add documentation', action: 'docs' },
    { icon: RefreshCw, label: 'Convert to JavaScript', action: 'convert' },
  ];

  const handleRunCode = async () => {
    setIsRunning(true);
    
    // Simulated execution
    setTimeout(() => {
      const mockOutput = `F(0) = 0
F(1) = 1
F(2) = 1
F(3) = 2
F(4) = 3
F(5) = 5
F(6) = 8
F(7) = 13
F(8) = 21
F(9) = 34
Execution completed in 0.023s`;
      
      setOutput(mockOutput);
      setIsRunning(false);
    }, 2000);
  };

  const handleQuickAction = (action: string) => {
    console.log(`Performing action: ${action}`);
    // TODO: Implement AI-powered code actions
  };

  const handleAskQuestion = () => {
    if (!aiQuestion.trim()) return;
    console.log(`AI question: ${aiQuestion}`);
    setAiQuestion('');
    // TODO: Implement AI code assistance
  };

  const handleFormatCode = () => {
    console.log('Formatting code...');
    // TODO: Implement code formatting
  };

  const handleDebugCode = () => {
    console.log('Debugging code...');
    // TODO: Implement AI debugging
  };

  return (
    <div className="flex-1 flex flex-col" data-testid="code-lab">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Code Laboratory</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            AI-powered coding assistant with real-time debugging
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-40" data-testid="select-code-language">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleRunCode}
            disabled={isRunning}
            className="bg-success hover:bg-success/90"
            data-testid="button-run-code"
          >
            <Play className="h-4 w-4 mr-2" />
            {isRunning ? 'Running...' : 'Run'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {}} // TODO: Implement export
            title="Export Code"
            data-testid="button-export-code"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          {/* Editor Header */}
          <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                main.{language === 'cpp' ? 'cpp' : language === 'java' ? 'java' : 'py'}
              </span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-warning rounded-full"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">Modified</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleFormatCode}
                data-testid="button-format-code"
              >
                Format
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDebugCode}
                data-testid="button-debug-code"
              >
                Debug
              </Button>
            </div>
          </div>

          {/* Editor Area */}
          <div className="flex-1 bg-gray-900 text-gray-100 relative">
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full bg-transparent text-gray-100 resize-none border-0 focus:ring-0 font-mono text-sm p-4"
              style={{ fontFamily: 'Monaco, Consolas, "Courier New", monospace' }}
              data-testid="textarea-code-content"
            />
          </div>

          {/* Console */}
          <div className="h-48 bg-black text-green-400 p-4 font-mono text-sm overflow-y-auto">
            <div className="text-gray-500 text-xs mb-2">Console Output:</div>
            <pre className="whitespace-pre-wrap" data-testid="text-console-output">
              {output || 'Click "Run" to execute your code...'}
            </pre>
          </div>
        </div>

        {/* AI Assistant */}
        <div className="w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-3">
            <h3 className="font-medium text-gray-900 dark:text-white">AI Code Assistant</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Get help with debugging and optimization
            </p>
          </div>

          <div className="flex-1 p-4 space-y-4">
            {/* Suggestion */}
            <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <CardContent className="p-3">
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                  💡 Optimization Suggestion
                </h4>
                <p className="text-xs text-blue-800 dark:text-blue-300 mb-2">
                  Your fibonacci function uses recursion which can be slow for large numbers. 
                  Consider using memoization or an iterative approach.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs"
                  onClick={() => handleQuickAction('optimize')}
                  data-testid="button-apply-optimization"
                >
                  Apply Fix
                </Button>
              </CardContent>
            </Card>

            {/* Analysis */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Code Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Lines of code:</span>
                  <span className="font-medium">9</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Complexity:</span>
                  <span className="font-medium text-warning">O(2^n)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Style score:</span>
                  <span className="font-medium text-success">95/100</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Quick Actions</h4>
              <div className="space-y-2">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-xs"
                      onClick={() => handleQuickAction(action.action)}
                      data-testid={`button-quick-action-${action.action}`}
                    >
                      <Icon className="h-3 w-3 mr-2" />
                      {action.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Chat */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex space-x-2">
              <Input
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                placeholder="Ask about this code..."
                className="text-xs"
                data-testid="input-code-question"
              />
              <Button
                size="sm"
                onClick={handleAskQuestion}
                disabled={!aiQuestion.trim()}
                data-testid="button-ask-code-question"
              >
                <MessageSquare className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
               }
