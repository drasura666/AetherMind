import { useEffect, useMemo, useRef, useState } from 'react'; import { Button } from '@/components/ui/button'; import { Input } from '@/components/ui/input'; import { Textarea } from '@/components/ui/textarea'; import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; import { Badge } from '@/components/ui/badge'; import { Upload, BookOpen, Clock, Target, TrendingUp, RefreshCw, Download, Play, Pause, RotateCcw, } from 'lucide-react';

// -------------------- Types -------------------- export type Question = { id: number; type: 'multiple-choice'; question: string; options: string[]; correct: number; // index of correct answer explanation?: string; topic?: string; // optional topic tag };

export type ExamResult = { score: number; total: number; accuracy: number; // 0-100 incorrectIndices: number[]; timeTakenSec: number; };

// Fallback questions in case backend is unavailable const seedQuestions: Question[] = [ { id: 1, type: 'multiple-choice', question: 'What is the derivative of f(x) = x^3 + 2x^2 - 5x + 7?', options: ['3x^2 + 4x - 5', '3x^2 + 4x + 5', 'x^4 + 2x^3 - 5x^2 + 7x', '3x^2 - 4x - 5'], correct: 0, explanation: 'Power rule: d/dx[x^n] = n x^(n-1).', topic: 'calculus', }, { id: 2, type: 'multiple-choice', question: 'Which of the following is NOT a characteristic of living organisms?', options: ['Metabolism', 'Growth', 'Reproduction', 'Crystallization'], correct: 3, explanation: 'Crystallization is a physical process, not a life process.', topic: 'biology', }, ];

// -------------------- Component -------------------- export function ExamPrep() { const [examType, setExamType] = useState('sat'); const [studyMaterial, setStudyMaterial] = useState(''); const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium'); const [timeLimit, setTimeLimit] = useState(30); // minutes

const [questions, setQuestions] = useState<Question[]>(seedQuestions); const [isGenerating, setIsGenerating] = useState(false); const [isTesting, setIsTesting] = useState(false); const [isPaused, setIsPaused] = useState(false); const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); const [answers, setAnswers] = useState<number[]>(Array(seedQuestions.length).fill(-1)); const [timeRemaining, setTimeRemaining] = useState(1800); // seconds const [result, setResult] = useState<ExamResult | null>(null);

const uploadInputRef = useRef<HTMLInputElement | null>(null);

const examTypes = [ { value: 'sat', label: 'SAT' }, { value: 'act', label: 'ACT' }, { value: 'gre', label: 'GRE' }, { value: 'gmat', label: 'GMAT' }, { value: 'ap', label: 'AP Exams' }, { value: 'custom', label: 'Custom Subject' }, ];

const difficultyLevels = [ { value: 'easy', label: 'Easy', color: 'bg-green-100 text-green-800' }, { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' }, { value: 'hard', label: 'Hard', color: 'bg-red-100 text-red-800' }, ] as const;

// -------------------- Persistence -------------------- const persistKey = 'exam_prep_state_v1'; useEffect(() => { // Load previous session try { const raw = localStorage.getItem(persistKey); if (raw) { const data = JSON.parse(raw); setExamType(data.examType ?? 'sat'); setStudyMaterial(data.studyMaterial ?? ''); setDifficulty(data.difficulty ?? 'medium'); setTimeLimit(data.timeLimit ?? 30); if (Array.isArray(data.questions) && data.questions.length) setQuestions(data.questions); if (Array.isArray(data.answers)) setAnswers(data.answers); setIsTesting(!!data.isTesting); setCurrentQuestionIndex(data.currentQuestionIndex ?? 0); setTimeRemaining(data.timeRemaining ?? 1800); } } catch (_) {} }, []);

useEffect(() => { // Save session const payload = { examType, studyMaterial, difficulty, timeLimit, questions, answers, isTesting, currentQuestionIndex, timeRemaining, }; try { localStorage.setItem(persistKey, JSON.stringify(payload)); } catch (_) {} }, [examType, studyMaterial, difficulty, timeLimit, questions, answers, isTesting, currentQuestionIndex, timeRemaining]);

// -------------------- Timer -------------------- const secondsPlanned = useMemo(() => timeLimit * 60, [timeLimit]); const secondsUsed = useMemo(() => (isTesting ? secondsPlanned - timeRemaining : 0), [isTesting, secondsPlanned, timeRemaining]);

useEffect(() => { if (!isTesting || isPaused) return; if (timeRemaining <= 0) { handleEndTest(); return; } const t = setInterval(() => setTimeRemaining((s) => s - 1), 1000); return () => clearInterval(t); }, [isTesting, isPaused, timeRemaining]);

const formatTime = (seconds: number) => { const minutes = Math.floor(seconds / 60); const secs = seconds % 60; return ${minutes}:${secs.toString().padStart(2, '0')}; };

// -------------------- Upload Handling -------------------- const onChooseFiles = () => uploadInputRef.current?.click();

const handleFiles = async (files: FileList | null) => { if (!files || files.length === 0) return; const file = files[0];

// If TXT file, read client-side; otherwise post to backend endpoint for extraction
if (file.type === 'text/plain') {
  const text = await file.text();
  setStudyMaterial((prev) => (prev ? prev + '\n' : '') + text.slice(0, 8000));
  return;
}

try {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch('/api/upload-study-material', {
    method: 'POST',
    body: form,
  });
  const data = await res.json();
  if (data?.text) setStudyMaterial((prev) => (prev ? prev + '\n' : '') + String(data.text).slice(0, 12000));
} catch (err) {
  console.error('Upload failed', err);
}

};

// -------------------- AI Generation -------------------- const handleGenerateQuestions = async () => { const topics = studyMaterial.trim(); setIsGenerating(true); try { const res = await fetch('/api/exam-prep', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ examType, difficulty, topics }), });

if (res.ok) {
    const data = await res.json();
    if (Array.isArray(data?.questions) && data.questions.length) {
      const normalized: Question[] = data.questions.map((q: any, i: number) => ({
        id: q.id ?? i + 1,
        type: 'multiple-choice',
        question: String(q.question ?? ''),
        options: Array.isArray(q.options) ? q.options.map(String) : [],
        correct: typeof q.correct === 'number' ? q.correct : 0,
        explanation: q.explanation ? String(q.explanation) : undefined,
        topic: q.topic ? String(q.topic) : undefined,
      }));
      setQuestions(normalized);
      setAnswers(Array(normalized.length).fill(-1));
      setResult(null);
      return;
    }
  }

  // Fallback client-side question maker (simple & deterministic)
  const fallback = makeFallbackQuestions(topics || 'algebra, biology', difficulty);
  setQuestions(fallback);
  setAnswers(Array(fallback.length).fill(-1));
  setResult(null);
} catch (err) {
  console.error('Generation failed', err);
  const fallback = makeFallbackQuestions(studyMaterial || 'algebra, biology', difficulty);
  setQuestions(fallback);
  setAnswers(Array(fallback.length).fill(-1));
  setResult(null);
} finally {
  setIsGenerating(false);
}

};

// -------------------- Test Flow -------------------- const handleStartTest = () => { if (!questions.length) return; setIsTesting(true); setIsPaused(false); setCurrentQuestionIndex(0); setTimeRemaining(timeLimit * 60); if (answers.length !== questions.length) setAnswers(Array(questions.length).fill(-1)); setResult(null); };

const handleEndTest = () => { setIsTesting(false); setIsPaused(false); const { score, incorrectIndices } = grade(questions, answers); const res: ExamResult = { score, total: questions.length, accuracy: Math.round((score / Math.max(1, questions.length)) * 100), incorrectIndices, timeTakenSec: Math.max(0, timeLimit * 60 - timeRemaining), }; setResult(res); };

const handleSelectAnswer = (choiceIndex: number) => { setAnswers((prev) => { const next = [...prev]; next[currentQuestionIndex] = choiceIndex; return next; }); };

const goPrev = () => setCurrentQuestionIndex((i) => Math.max(0, i - 1)); const goNext = () => setCurrentQuestionIndex((i) => Math.min(questions.length - 1, i + 1));

// -------------------- Study Tools (very light demos) -------------------- const [activeTool, setActiveTool] = useState<'none' | 'flashcards' | 'progress' | 'repetition' | 'tests'>('none');

const weakAreas = useMemo(() => { if (!result) return [] as string[]; const topics: string[] = []; result.incorrectIndices.forEach((idx) => { const t = questions[idx]?.topic?.trim(); if (t && !topics.includes(t)) topics.push(t); }); return topics; }, [result, questions]);

// -------------------- Helpers -------------------- function grade(qs: Question[], ans: number[]) { let score = 0; const incorrectIndices: number[] = []; qs.forEach((q, i) => { if (ans[i] === q.correct) score += 1; else incorrectIndices.push(i); }); return { score, incorrectIndices }; }

function makeFallbackQuestions(topics: string, dif: 'easy' | 'medium' | 'hard'): Question[] { const base: Question[] = []; const pool = topics.split(/[;,\n]/).map((s) => s.trim()).filter(Boolean); const n = Math.min(8, Math.max(4, pool.length + 2)); for (let i = 0; i < n; i++) { const t = pool[i % pool.length] || 'general'; const a = i + 2; const b = i + 3; const correct = (a + b); const opts = [correct, correct + 1, correct - 1, correct + 2]; base.push({ id: i + 1, type: 'multiple-choice', question: (${dif.toUpperCase()}) If a = ${a} and b = ${b}, what is a + b? [Topic: ${t}], options: opts.map(String), correct: 0, explanation: 'Add the two integers: a + b.', topic: t.toLowerCase(), }); } return base; }

function downloadResults() { if (!result) return; const blob = new Blob([ JSON.stringify({ examType, difficulty, timeLimit, questions, answers, result }, null, 2), ], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = exam-results-${examType}-${Date.now()}.json; a.click(); URL.revokeObjectURL(url); }

// -------------------- Render -------------------- return ( <div className="flex-1 flex flex-col" data-testid="exam-prep"> {/* Header */} <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between"> <div> <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Exam Preparation</h2> <p className="text-sm text-gray-600 dark:text-gray-400">Adaptive quizzes, mock tests, and intelligent study assistance</p> </div> <div className="flex items-center gap-2"> {isTesting ? ( <> <Button variant="outline" onClick={() => setIsPaused((p) => !p)}> {isPaused ? (<><Play className="h-4 w-4 mr-2"/>Resume</>) : (<><Pause className="h-4 w-4 mr-2"/>Pause</>)} </Button> <Button variant="outline" onClick={() => { setIsTesting(false); setResult(null); }}> <RotateCcw className="h-4 w-4 mr-2"/>Reset </Button> </> ) : ( <Button variant="outline" onClick={downloadResults} disabled={!result} title="Download last results"> <Download className="h-4 w-4 mr-2"/>Export Results </Button> )} </div> </div>

<div className="flex-1 p-6">
    {/* SETUP / DASHBOARD */}
    {!isTesting && !result && (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Study Material Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Study Material</CardTitle>
            </CardHeader>
            <CardContent>
              <input ref={uploadInputRef} type="file" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center mb-4">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-2">Upload textbooks, notes, or study materials</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">Supports PDF, DOCX, TXT files up to 10MB</p>
                <Button variant="outline" data-testid="button-upload-material" onClick={onChooseFiles}>
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Files
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Exam Type</label>
                  <Select value={examType} onValueChange={setExamType}>
                    <SelectTrigger data-testid="select-exam-type"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {examTypes.map((t) => (<SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Difficulty</label>
                  <Select value={difficulty} onValueChange={(v) => setDifficulty(v as any)}>
                    <SelectTrigger data-testid="select-difficulty"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {difficultyLevels.map((l) => (<SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Time Limit (min)</label>
                  <Input type="number" value={timeLimit} onChange={(e) => setTimeLimit(Math.min(180, Math.max(5, Number(e.target.value))))} min={5} max={180} data-testid="input-time-limit"/>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Topics to Focus On</label>
                <Textarea value={studyMaterial} onChange={(e) => setStudyMaterial(e.target.value)} placeholder="Enter specific topics, chapters, or areas you want to focus on..." className="h-24" data-testid="textarea-study-topics"/>
              </div>

              <div className="flex space-x-3">
                <Button onClick={handleGenerateQuestions} disabled={isGenerating} className="flex-1" data-testid="button-generate-questions">
                  <BookOpen className="h-4 w-4 mr-2" />{isGenerating ? 'Generating...' : 'Generate Practice Questions'}
                </Button>
                <Button onClick={handleStartTest} className="flex-1 bg-success hover:bg-success/90" data-testid="button-start-mock-test">
                  <Play className="h-4 w-4 mr-2" />Start Mock Test
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
                {questions.map((q, idx) => (
                  <div key={q.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium text-gray-900 dark:text-white">Question {idx + 1}</h4>
                      <Badge className={difficultyLevels.find((l) => l.value === difficulty)?.color}>{difficulty}</Badge>
                    </div>
                    <p className="text-gray-800 dark:text-gray-200 mb-3">{q.question}</p>
                    <div className="space-y-2 mb-3">
                      {q.options.map((opt, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${i === q.correct ? 'bg-success text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                            {String.fromCharCode(65 + i)}
                          </div>
                          <span className="text-gray-700 dark:text-gray-300">{opt}</span>
                        </div>
                      ))}
                    </div>
                    {q.explanation && (
                      <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded"><strong>Explanation:</strong> {q.explanation}</div>
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
            <CardContent className="space-y-3">
              <Button variant={activeTool === 'flashcards' ? 'default' : 'outline'} className="w-full justify-start" onClick={() => setActiveTool('flashcards')}>
                <Target className="h-4 w-4 mr-3"/> Flashcards
              </Button>
              <Button variant={activeTool === 'tests' ? 'default' : 'outline'} className="w-full justify-start" onClick={() => setActiveTool('tests')}>
                <BookOpen className="h-4 w-4 mr-3"/> Practice Tests
              </Button>
              <Button variant={activeTool === 'progress' ? 'default' : 'outline'} className="w-full justify-start" onClick={() => setActiveTool('progress')}>
                <TrendingUp className="h-4 w-4 mr-3"/> Progress Tracker
              </Button>
              <Button variant={activeTool === 'repetition' ? 'default' : 'outline'} className="w-full justify-start" onClick={() => setActiveTool('repetition')}>
                <RefreshCw className="h-4 w-4 mr-3"/> Spaced Repetition
              </Button>
            </CardContent>
          </Card>

          {/* Very lightweight tool panels */}
          {activeTool !== 'none' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{activeTool === 'flashcards' ? 'Flashcards' : activeTool === 'progress' ? 'Progress Tracker' : activeTool === 'repetition' ? 'Spaced Repetition' : 'Practice Tests'}</CardTitle>
              </CardHeader>
              <CardContent>
                {activeTool === 'flashcards' && (
                  <div className="space-y-2">
                    {questions.slice(0, 6).map((q) => (
                      <details key={q.id} className="border rounded p-2">
                        <summary className="cursor-pointer">{q.question}</summary>
                        <div className="mt-2 text-sm">Correct: {q.options[q.correct]}</div>
                        {q.explanation && <div className="text-xs text-gray-500 mt-1">{q.explanation}</div>}
                      </details>
                    ))}
                  </div>
                )}
                {activeTool === 'progress' && (
                  <div className="text-sm text-gray-600 dark:text-gray-300">Answer questions in a mock test to see detailed progress here.</div>
                )}
                {activeTool === 'repetition' && (
                  <div className="text-sm text-gray-600 dark:text-gray-300">We’ll prioritize topics you miss during tests. After a test, use “Retake Weak Areas”.</div>
                )}
                {activeTool === 'tests' && (
                  <div className="text-sm text-gray-600 dark:text-gray-300">Use “Start Mock Test” on the left to begin a timed session.</div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    )}

    {/* TEST MODE */}
    {isTesting && (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Mock Test - {examType.toUpperCase()}</CardTitle>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-warning" />
                  <span className="text-lg font-mono text-warning" data-testid="text-time-remaining">{formatTime(timeRemaining)}</span>
                </div>
                <Button onClick={handleEndTest} variant="outline" data-testid="button-end-test">End Test</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {questions[currentQuestionIndex] && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Question {currentQuestionIndex + 1} of {questions.length}</span>
                  <div className="w-32 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-primary rounded-full transition-all duration-300" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{questions[currentQuestionIndex].question}</h3>
                  <div className="space-y-3">
                    {questions[currentQuestionIndex].options.map((option, idx) => {
                      const selected = answers[currentQuestionIndex] === idx;
                      return (
                        <label key={idx} className={`flex items-center space-x-3 cursor-pointer p-3 rounded border ${selected ? 'bg-primary/5 border-primary' : 'hover:bg-gray-100 dark:hover:bg-gray-700 border-transparent'}`}>
                          <input type="radio" name={`answer-${currentQuestionIndex}`} value={idx} checked={selected} onChange={() => handleSelectAnswer(idx)} className="text-primary focus:ring-primary" data-testid={`radio-option-${idx}`} />
                          <span className="text-gray-700 dark:text-gray-300">{option}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" disabled={currentQuestionIndex === 0} onClick={goPrev} data-testid="button-previous-question">Previous</Button>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => setIsPaused((p) => !p)}>{isPaused ? (<><Play className="h-4 w-4 mr-2"/>Resume</>) : (<><Pause className="h-4 w-4 mr-2"/>Pause</>)}</Button>
                    <Button onClick={() => { if (currentQuestionIndex < questions.length - 1) goNext(); else handleEndTest(); }} data-testid="button-next-question">{currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish Test'}</Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )}

    {/* RESULTS */}
    {!isTesting && result && (
      <div className="max-w-5xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Results Summary</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-success">{result.score}/{result.total}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{result.accuracy}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{formatTime(result.timeTakenSec)}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Time Taken</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-warning">{weakAreas.length || 0}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Weak Topics</div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button onClick={handleStartTest} className="bg-success hover:bg-success/90"><Play className="h-4 w-4 mr-2"/>Retake Full Test</Button>
          <Button variant="outline" onClick={() => {
            // Filter questions to only weak topics
            if (!weakAreas.length) return handleStartTest();
            const filtered = questions.filter((q) => q.topic && weakAreas.includes(q.topic));
            if (filtered.length) {
              setQuestions(filtered);
              setAnswers(Array(filtered.length).fill(-1));
            }
            handleStartTest();
          }}>Retake Weak Areas</Button>
          <Button variant="outline" onClick={downloadResults}><Download className="h-4 w-4 mr-2"/>Export JSON</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {questions.map((q, idx) => {
              const chosen = answers[idx];
              const correct = q.correct;
              const isCorrect = chosen === correct;
              return (
                <div key={q.id} className={`rounded border p-4 ${isCorrect ? 'border-success/60' : 'border-red-400/60'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">Q{idx + 1}. {q.question}</div>
                    <Badge variant={isCorrect ? 'default' : 'destructive'}>{isCorrect ? 'Correct' : 'Incorrect'}</Badge>
                  </div>
                  <div className="text-sm">Your answer: {chosen >= 0 ? q.options[chosen] : 'Not answered'}</div>
                  <div className="text-sm">Correct answer: {q.options[correct]}</div>
                  {q.explanation && <div className="text-xs text-gray-500 mt-2">{q.explanation}</div>}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    )}
  </div>
</div>

); }

