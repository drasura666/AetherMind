import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  BookOpen, 
  Clock, 
  CheckCircle, 
  Target,
  TrendingUp,
  RefreshCw,
  Download,
  Play,
  Pause
} from 'lucide-react';

export function ExamPrep() {
  const [examType, setExamType] = useState('sat');
  const [studyMaterial, setStudyMaterial] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [timeLimit, setTimeLimit] = useState(30);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes

  const examTypes = [
    { value: 'sat', label: 'SAT' },
    { value: 'act', label: 'ACT' },
    { value: 'gre', label: 'GRE' },
    { value: 'gmat', label: 'GMAT' },
    { value: 'ap', label: 'AP Exams' },
    { value: 'custom', label: 'Custom Subject' },
  ];

  const difficultyLevels = [
    { value: 'easy', label: 'Easy', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'hard', label: 'Hard', color: 'bg-red-100 text-red-800' },
  ];

  const studyTools = [
    { icon: BookOpen, label: 'Flashcards', action: 'flashcards' },
    { icon: Target, label: 'Practice Tests', action: 'tests' },
    { icon: TrendingUp, label: 'Progress Tracker', action: 'progress' },
    { icon: RefreshCw, label: 'Spaced Repetition', action: 'repetition' },
  ];

  const mockQuestions = [
    {
      id: 1,
      type: 'multiple-choice',
      question: 'What is the derivative of f(x) = x³ + 2x² - 5x + 7?',
      options: ['3x² + 4x - 5', '3x² + 4x + 5', 'x⁴ + 2x³ - 5x² + 7x', '3x² - 4x - 5'],
      correct: 0,
      explanation: 'Using the power rule: d/dx[xⁿ] = nx^(n-1), we get 3x² + 4x - 5.',
    },
    {
      id: 2,
      type: 'multiple-choice', 
      question: 'Which of the following is NOT a characteristic of living organisms?',
      options: ['Metabolism', 'Growth', 'Reproduction', 'Crystallization'],
      correct: 3,
      explanation: 'Crystallization is a physical process, not a characteristic of living organisms.',
    }
  ];

  const studyStats = {
    totalStudyTime: '24 hours',
    questionsAnswered: 342,
    accuracy: 87,
    streak: 12,
    weakAreas: ['Organic Chemistry', 'Statistics'],
    strongAreas: ['Algebra', 'Biology'],
  };

  const handleGenerateQuestions = async () => {
    if (!studyMaterial.trim()) return;
    
    setIsGenerating(true);
    // Simulate AI question generation
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  const handleStartTest = () => {
    setIsTesting(true);
    setCurrentQuestionIndex(0);
    setTimeRemaining(timeLimit * 60);
  };

  const handleEndTest = () => {
    setIsTesting(false);
    // TODO: Show results
  };

  const handleToolAction = (action: string) => {
    console.log(`Executing study tool: ${action}`);
    // TODO: Implement study tools
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 flex flex-col" data-testid="exam-prep">
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Exam Preparation</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Adaptive quizzes, mock tests, and intelligent study assistance
        </p>
      </div>

      <div className="flex-1 p-6">
        {!isTesting ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Study Material Upload */}
              <Card>
                <CardHeader>
                  <CardTitle>Upload Study Material</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center mb-4">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      Upload textbooks, notes, or study materials
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                      Supports PDF, DOCX, TXT files up to 10MB
                    </p>
                    <Button variant="outline" data-testid="button-upload-material">
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Files
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Exam Type
                      </label>
                      <Select value={examType} onValueChange={setExamType}>
                        <SelectTrigger data-testid="select-exam-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {examTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Difficulty
                      </label>
                      <Select value={difficulty} onValueChange={setDifficulty}>
                        <SelectTrigger data-testid="select-difficulty">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {difficultyLevels.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Time Limit (min)
                      </label>
                      <Input
                        type="number"
                        value={timeLimit}
                        onChange={(e) => setTimeLimit(Number(e.target.value))}
                        min="5"
                        max="180"
                        data-testid="input-time-limit"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Topics to Focus On
                    </label>
                    <Textarea
                      value={studyMaterial}
                      onChange={(e) => setStudyMaterial(e.target.value)}
                      placeholder="Enter specific topics, chapters, or areas you want to focus on..."
                      className="h-20"
                      data-testid="textarea-study-topics"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      onClick={handleGenerateQuestions}
                      disabled={isGenerating}
                      className="flex-1"
                      data-testid="button-generate-questions"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      {isGenerating ? 'Generating...' : 'Generate Practice Questions'}
                    </Button>
                    <Button
                      onClick={handleStartTest}
                      className="flex-1 bg-success hover:bg-success/90"
                      data-testid="button-start-mock-test"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Mock Test
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Generated Questions Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Practice Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockQuestions.map((question, index) => (
                      <div key={question.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            Question {index + 1}
                          </h4>
                          <Badge className={difficultyLevels.find(l => l.value === difficulty)?.color}>
                            {difficulty}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-800 dark:text-gray-200 mb-3">
                          {question.question}
                        </p>
                        
                        <div className="space-y-2 mb-3">
                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center space-x-2">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium
                                ${optionIndex === question.correct 
                                  ? 'bg-success text-white' 
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                }`}>
                                {String.fromCharCode(65 + optionIndex)}
                              </div>
                              <span className="text-gray-700 dark:text-gray-300">{option}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                          <strong>Explanation:</strong> {question.explanation}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Study Tools */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Study Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {studyTools.map((tool, index) => {
                      const Icon = tool.icon;
                      return (
                        <Button
                          key={index}
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => handleToolAction(tool.action)}
                          data-testid={`button-study-tool-${tool.action}`}
                        >
                          <Icon className="h-4 w-4 mr-3" />
                          {tool.label}
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Study Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Your Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{studyStats.totalStudyTime}</div>
                      <div className="text-gray-600 dark:text-gray-400">Study Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-success">{studyStats.accuracy}%</div>
                      <div className="text-gray-600 dark:text-gray-400">Accuracy</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-900 dark:text-white">{studyStats.questionsAnswered}</div>
                      <div className="text-gray-600 dark:text-gray-400">Questions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-warning">{studyStats.streak}</div>
                      <div className="text-gray-600 dark:text-gray-400">Day Streak</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Weak Areas</h4>
                    <div className="flex flex-wrap gap-1">
                      {studyStats.weakAreas.map((area, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Strong Areas</h4>
                    <div className="flex flex-wrap gap-1">
                      {studyStats.strongAreas.map((area, index) => (
                        <Badge key={index} className="text-xs bg-success">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* Mock Test Interface */
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Mock Test - {examType.toUpperCase()}</CardTitle>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-warning" />
                      <span className="text-lg font-mono text-warning" data-testid="text-time-remaining">
                        {formatTime(timeRemaining)}
                      </span>
                    </div>
                    <Button 
                      onClick={handleEndTest}
                      variant="outline"
                      data-testid="button-end-test"
                    >
                      End Test
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {mockQuestions[currentQuestionIndex] && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Question {currentQuestionIndex + 1} of {mockQuestions.length}
                      </span>
                      <div className="w-32 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-2 bg-primary rounded-full transition-all duration-300"
                          style={{ width: `${((currentQuestionIndex + 1) / mockQuestions.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        {mockQuestions[currentQuestionIndex].question}
                      </h3>

                      <div className="space-y-3">
                        {mockQuestions[currentQuestionIndex].options.map((option, index) => (
                          <label key={index} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-3 rounded">
                            <input 
                              type="radio" 
                              name="answer" 
                              value={index}
                              className="text-primary focus:ring-primary"
                              data-testid={`radio-option-${index}`}
                            />
                            <span className="text-gray-700 dark:text-gray-300">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button 
                        variant="outline" 
                        disabled={currentQuestionIndex === 0}
                        onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                        data-testid="button-previous-question"
                      >
                        Previous
                      </Button>
                      <Button 
                        onClick={() => {
                          if (currentQuestionIndex < mockQuestions.length - 1) {
                            setCurrentQuestionIndex(prev => prev + 1);
                          } else {
                            handleEndTest();
                          }
                        }}
                        data-testid="button-next-question"
                      >
                        {currentQuestionIndex < mockQuestions.length - 1 ? 'Next' : 'Finish Test'}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
