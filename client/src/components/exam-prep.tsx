import { useEffect, useMemo, useRef, useState } from 'react';
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

/**
 * -------------------- Types --------------------
 */
type Question = {
  id: number;
  type: 'multiple-choice';
  question: string;
  options: string[];
  correct: number;       // index of correct option
  explanation?: string;
  topic?: string;
};

type GenerationPayload = {
  examType: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topics: string;
};

/**
 * A small, deterministic, offline fallback generator so your app
 * always works even if /api/exam-prep isn’t set up yet.
 */
function makeFallbackQuestions(topics: string, dif: 'easy' | 'medium' | 'hard'): Question[] {
  const topicList = topics
    .split(/[,\n;]+/)
    .map(s => s.trim())
    .filter(Boolean);

  const pool = topicList.length ? topicList : ['general', 'algebra', 'biology'];
  const count = Math.min(10, Math.max(6, pool.length + 4));

  const qs: Question[] = [];
  for (let i = 0; i < count; i++) {
    const t = pool[i % pool.length];
    // vary numbers a bit by difficulty
    const a = dif === 'easy' ? i + 2 : dif === 'medium' ? i * 2 + 3 : i * 3 + 5;
    const b = dif === 'easy' ? i + 3 : dif === 'medium' ? i * 2 + 5 : i * 3 + 7;
    const correct = a + b;

    const distractors = [
      correct + (dif === 'hard' ? 2 : 1),
      correct - (dif !== 'easy' ? 2 : 1),
      correct + (dif === 'hard' ? 5 : 3),
    ];

    const options = [correct, ...distractors].map(String);
    // shuffle a bit but keep deterministic feel
    const idx = i % 4;
    const rotated = [...options.slice(idx), ...options.slice(0, idx)];

    qs.push({
      id: i + 1,
      type: 'multiple-choice',
      question: `(${dif.toUpperCase()}) If a = ${a} and b = ${b}, what is a + b? [Topic: ${t}]`,
      options: rotated,
      correct: rotated.indexOf(String(correct)),
      explanation: 'Add the two integers: a + b.',
      topic: t,
    });
  }
  return qs;
}

/**
 * -------------------- Component --------------------
 */
export function ExamPrep() {
  // ---------- UI state (kept as your original) ----------
  const [examType, setExamType] = useState('sat');
  const [studyMaterial, setStudyMaterial] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [timeLimit, setTimeLimit] = useState(30);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes

  // ---------- “functional” additions (invisible in UI) ----------
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      type: 'multiple-choice',
      question: 'What is the derivative of f(x) = x³ + 2x² - 5x + 7?',
      options: ['3x² + 4x - 5', '3x² + 4x + 5', 'x⁴ + 2x³ - 5x² + 7x', '3x² - 4x - 5'],
      correct: 0,
      explanation: 'Using the power rule: d/dx[xⁿ] = n·x^(n-1), we get 3x² + 4x - 5.',
      topic: 'calculus',
    },
    {
      id: 2,
      type: 'multiple-choice',
      question: 'Which of the following is NOT a characteristic of living organisms?',
      options: ['Metabolism', 'Growth', 'Reproduction', 'Crystallization'],
      correct: 3,
      explanation: 'Crystallization is a physical process, not a characteristic of living organisms.',
      topic: 'biology',
    },
  ]);
  const [answers, setAnswers] = useState<number[]>(Array(2).fill(-1));

  // hidden file input for “Choose Files” button (visuals unchanged)
  const uploadInputRef = useRef<HTMLInputElement | null>(null);

  // ---------- constants (kept as original options) ----------
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

  /**
   * -------------------- Persistence --------------------
   * We keep a light localStorage state so users don’t lose a session.
   * Does not change your visuals.
   */
  const persistKey = 'exam_prep_minimal_v1';

  // Load
  useEffect(() => {
    try {
      const raw = localStorage.getItem(persistKey);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (typeof data.examType === 'string') setExamType(data.examType);
      if (typeof data.studyMaterial === 'string') setStudyMaterial(data.studyMaterial);
      if (data.difficulty === 'easy' || data.difficulty === 'medium' || data.difficulty === 'hard') {
        setDifficulty(data.difficulty);
      }
      if (typeof data.timeLimit === 'number') setTimeLimit(data.timeLimit);
      if (Array.isArray(data.questions) && data.questions.length) setQuestions(data.questions);
      if (Array.isArray(data.answers) && data.answers.length) setAnswers(data.answers);
    } catch {}
  }, []);

  // Save
  useEffect(() => {
    try {
      const payload = {
        examType,
        studyMaterial,
        difficulty,
        timeLimit,
        questions,
        answers,
      };
      localStorage.setItem(persistKey, JSON.stringify(payload));
    } catch {}
  }, [examType, studyMaterial, difficulty, timeLimit, questions, answers]);

  /**
   * -------------------- Timer --------------------
   */
  useEffect(() => {
    if (!isTesting) return;
    if (timeRemaining <= 0) {
      handleEndTest(); // auto-submit
      return;
    }
    const id = setInterval(() => setTimeRemaining((s) => s - 1), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTesting, timeRemaining]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  /**
   * -------------------- File Upload (no UI changes) --------------------
   * - .txt is read client-side
   * - other doc types are posted to /api/upload-study-material (optional)
   */
  const onChooseFiles = () => uploadInputRef.current?.click();

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    // .txt → read locally
    if (file.type === 'text/plain') {
      const text = await file.text();
      setStudyMaterial((prev) => (prev ? prev + '\n' : '') + text.slice(0, 10000));
      return;
    }

    // Otherwise post to an optional backend for extraction
    try {
      const form = new FormData();
      form.append('file', file);

      const res = await fetch('/api/upload-study-material', {
        method: 'POST',
        body: form,
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.text) {
          setStudyMaterial((prev) => (prev ? prev + '\n' : '') + String(data.text).slice(0, 20000));
        }
      }
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  /**
   * -------------------- AI Generation --------------------
   * Tries /api/exam-prep. If missing/fails → fallback generator.
   * Keeps your existing UI completely intact.
   */
  const handleGenerateQuestions = async () => {
  if (!studyMaterial.trim()) return;

  setIsGenerating(true);

  // Split topics by comma, semicolon, or newline
  const topicArray = studyMaterial
    .split(/[\n,;]+/)
    .map((t) => t.trim())
    .filter(Boolean);

  const payload: GenerationPayload = {
    examType,
    difficulty,
    topics: topicArray,
  };

  try {
    const res = await fetch('/api/exam-prep', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log('AI generation response:', data); // debug log

    let incoming: Question[] = [];
    if (Array.isArray(data?.questions) && data.questions.length) {
      incoming = data.questions.map((q: any, i: number) => ({
        id: Number(q.id ?? i + 1),
        type: 'multiple-choice',
        question: String(q.question ?? ''),
        options: Array.isArray(q.options) ? q.options.map(String) : [],
        correct: typeof q.correct === 'number' ? q.correct : 0,
        explanation: q.explanation ? String(q.explanation) : undefined,
        topic: q.topic ? String(q.topic) : undefined,
      }));
    }

    if (incoming.length) {
      // Use AI questions if available
      setQuestions(incoming);
      setAnswers(Array(incoming.length).fill(-1));
    } else {
      // Fallback if API returned nothing
      console.warn('AI returned no questions, using fallback.');
      const fb = makeFallbackQuestions(studyMaterial, difficulty);
      setQuestions(fb);
      setAnswers(Array(fb.length).fill(-1));
    }
  } catch (err) {
    console.error('AI generation failed:', err);
    const fb = makeFallbackQuestions(studyMaterial, difficulty);
    setQuestions(fb);
    setAnswers(Array(fb.length).fill(-1));
  } finally {
    setIsGenerating(false);
  }
};

      // fall back if bad response
      const fb = makeFallbackQuestions(payload.topics, difficulty);
      setQuestions(fb);
      setAnswers(Array(fb.length).fill(-1));
    } catch (err) {
      console.error('AI generation failed:', err);
      const fb = makeFallbackQuestions(payload.topics, difficulty);
      setQuestions(fb);
      setAnswers(Array(fb.length).fill(-1));
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * -------------------- Test Flow --------------------
   */
  const handleStartTest = () => {
    if (!questions.length) return;
    setIsTesting(true);
    setCurrentQuestionIndex(0);
    setTimeRemaining(Math.max(5, timeLimit) * 60);
    if (answers.length !== questions.length) {
      setAnswers(Array(questions.length).fill(-1));
    }
  };

  const grade = (qs: Question[], ans: number[]) => {
    let score = 0;
    const incorrect: number[] = [];
    qs.forEach((q, i) => {
      if (ans[i] === q.correct) score++;
      else incorrect.push(i);
    });
    return { score, incorrect };
  };

  const handleEndTest = () => {
    setIsTesting(false);
    const { score } = grade(questions, answers);
    const total = questions.length;
    const accuracy = Math.round((score / Math.max(1, total)) * 100);
    // keep UI unchanged; show a simple summary via alert
    try {
      window.alert(`Test finished!\nScore: ${score}/${total}\nAccuracy: ${accuracy}%`);
    } catch {}
  };

  const handleToolAction = (action: string) => {
    // Hook up to your real tool actions if desired; keeping console only to avoid UI changes
    console.log(`Executing study tool: ${action}`);
  };

  // Selecting answers (binds radio buttons)
  const selectAnswer = (qIndex: number, choiceIndex: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[qIndex] = choiceIndex;
      return next;
    });
  };

  /**
   * -------------------- Render (UI unchanged) --------------------
   */
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
                  {/* hidden input; button triggers this (visuals unchanged) */}
                  <input
                    ref={uploadInputRef}
                    type="file"
                    accept=".txt,.pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                  />
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center mb-4">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      Upload textbooks, notes, or study materials
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                      Supports PDF, DOCX, TXT files up to 10MB
                    </p>
                    <Button
                      variant="outline"
                      data-testid="button-upload-material"
                      onClick={onChooseFiles}
                    >
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
                      <Select
                        value={difficulty}
                        onValueChange={(v) => setDifficulty(v as 'easy' | 'medium' | 'hard')}
                      >
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
                      disabled={isGenerating || !studyMaterial.trim()}
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
                    {questions.map((question, index) => (
                      <div
                        key={question.id}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            Question {index + 1}
                          </h4>
                          <Badge
                            className={
                              difficultyLevels.find((l) => l.value === difficulty)?.color
                            }
                          >
                            {difficulty}
                          </Badge>
                        </div>

                        <p className="text-gray-800 dark:text-gray-200 mb-3">
                          {question.question}
                        </p>

                        <div className="space-y-2 mb-3">
                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center space-x-2">
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium
                                ${
                                  optionIndex === question.correct
                                    ? 'bg-success text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                }`}
                              >
                                {String.fromCharCode(65 + optionIndex)}
                              </div>
                              <span className="text-gray-700 dark:text-gray-300">{option}</span>
                            </div>
                          ))}
                        </div>

                        {question.explanation && (
                          <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                            <strong>Explanation:</strong> {question.explanation}
                          </div>
                        )}
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

              {/* Study Statistics (static as your original) */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Your Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">24 hours</div>
                      <div className="text-gray-600 dark:text-gray-400">Study Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-success">87%</div>
                      <div className="text-gray-600 dark:text-gray-400">Accuracy</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-900 dark:text-white">342</div>
                      <div className="text-gray-600 dark:text-gray-400">Questions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-warning">12</div>
                      <div className="text-gray-600 dark:text-gray-400">Day Streak</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Weak Areas
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-xs">
                        Organic Chemistry
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Statistics
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Strong Areas
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      <Badge className="text-xs bg-success">Algebra</Badge>
                      <Badge className="text-xs bg-success">Biology</Badge>
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
                      <span
                        className="text-lg font-mono text-warning"
                        data-testid="text-time-remaining"
                      >
                        {formatTime(timeRemaining)}
                      </span>
                    </div>
                    <Button onClick={handleEndTest} variant="outline" data-testid="button-end-test">
                      End Test
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {questions[currentQuestionIndex] && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Question {currentQuestionIndex + 1} of {questions.length}
                      </span>
                      <div className="w-32 h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-2 bg-primary rounded-full transition-all duration-300"
                          style={{
                            width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        {questions[currentQuestionIndex].question}
                      </h3>

                      <div className="space-y-3">
                        {questions[currentQuestionIndex].options.map((option, index) => {
                          const checked = answers[currentQuestionIndex] === index;
                          return (
                            <label
                              key={index}
                              className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-3 rounded"
                            >
                              <input
                                type="radio"
                                name="answer"
                                value={index}
                                checked={checked}
                                onChange={() => selectAnswer(currentQuestionIndex, index)}
                                className="text-primary focus:ring-primary"
                                data-testid={`radio-option-${index}`}
                              />
                              <span className="text-gray-700 dark:text-gray-300">{option}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        disabled={currentQuestionIndex === 0}
                        onClick={() =>
                          setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
                        }
                        data-testid="button-previous-question"
                      >
                        Previous
                      </Button>
                      <Button
                        onClick={() => {
                          if (currentQuestionIndex < questions.length - 1) {
                            setCurrentQuestionIndex((prev) => prev + 1);
                          } else {
                            handleEndTest();
                          }
                        }}
                        data-testid="button-next-question"
                      >
                        {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish Test'}
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
