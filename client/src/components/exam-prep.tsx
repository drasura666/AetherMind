import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Question = {
  question: string;
  answer: string;
};

export default function ExamPrep() {
  const [examType, setExamType] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [results, setResults] = useState<any | null>(null);

  // Timer logic
  useEffect(() => {
    let interval: any;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Format time
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  // Fallback generator for questions
  const makeFallbackQuestions = (
    exam: string,
    dif: string,
    t: string
  ): Question[] => {
    const base: Question[] = [];
    for (let i = 1; i <= 5; i++) {
      const a = Math.floor(Math.random() * 10);
      const b = Math.floor(Math.random() * 10);
      base.push({
        question: `(${dif.toUpperCase()}) If a = ${a} and b = ${b}, what is a + b? [Topic: ${t}]`,
        answer: `${a + b}`,
      });
    }
    return base;
  };

  const generateQuestions = () => {
    const qs = makeFallbackQuestions(examType, difficulty, topic);
    setQuestions(qs);
    setAnswers(Array(qs.length).fill(""));
    setTimer(0);
    setIsRunning(true);
    setResults(null);
  };

  const calculateResults = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (q.answer.trim().toLowerCase() === answers[idx].trim().toLowerCase()) {
        score++;
      }
    });
    const result = {
      examType,
      difficulty,
      topic,
      score,
      total: questions.length,
      timeTaken: formatTime(timer),
    };
    setResults(result);
    setIsRunning(false);
    setHistory((prev) => [...prev, result]);
  };

  const downloadResults = () => {
    if (!results) return;
    const dataStr = JSON.stringify(results, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `exam-results-${examType}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">Exam Preparation Lab</h1>

      {/* Exam Settings */}
      <div className="space-y-4">
        <Select onValueChange={setExamType}>
          <SelectTrigger>
            <SelectValue placeholder="Select Exam Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="jee">JEE</SelectItem>
            <SelectItem value="neet">NEET</SelectItem>
            <SelectItem value="upsc">UPSC</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>

        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger>
            <SelectValue placeholder="Select Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Enter Topic (e.g. Algebra, Physics, Polity)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        <Button onClick={generateQuestions}>Start Practice</Button>
      </div>

      {/* Timer */}
      {isRunning && (
        <div className="text-lg font-semibold">Time: {formatTime(timer)}</div>
      )}

      {/* Questions */}
      {questions.length > 0 && (
        <div className="space-y-6">
          {questions.map((q, idx) => (
            <div key={idx} className="p-4 border rounded-lg">
              <p className="font-medium">{q.question}</p>
              <Textarea
                placeholder="Your Answer"
                value={answers[idx]}
                onChange={(e) => {
                  const newAns = [...answers];
                  newAns[idx] = e.target.value;
                  setAnswers(newAns);
                }}
              />
            </div>
          ))}

          <Button onClick={calculateResults}>Submit Answers</Button>
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="p-4 border rounded-lg bg-gray-50 space-y-2">
          <h2 className="font-bold">Results</h2>
          <p>
            Score: {results.score}/{results.total}
          </p>
          <p>Time Taken: {results.timeTaken}</p>
          <Button onClick={downloadResults}>Download Results</Button>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="p-4 border rounded-lg bg-gray-50 space-y-2">
          <h2 className="font-bold">Past Attempts</h2>
          {history.map((h, idx) => (
            <div key={idx} className="text-sm border-b pb-2">
              {h.examType} | {h.difficulty} | {h.topic} → {h.score}/{h.total} in{" "}
              {h.timeTaken}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
