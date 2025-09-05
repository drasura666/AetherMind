import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAPIKeys } from "@/hooks/useAPIKeys";

interface Question {
  question: string;
  options: string[];
  answer: string;
}

export default function ExamPrep() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  const { selectedProvider, getDecryptedKey } = useAPIKeys();

  const generateQuestions = async () => {
    setLoading(true);

    try {
      const apiKey = getDecryptedKey(selectedProvider);

      if (!apiKey) {
        alert("Please set a valid API key first.");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: selectedProvider,
          model: "llama-3.1-70b-versatile",
          apiKey,
          messages: [
            {
              role: "system",
              content:
                "You are an exam question generator. Return exactly a JSON array of objects in the format: [{\"question\": \"...\", \"options\": [\"...\", \"...\", \"...\", \"...\"], \"answer\": \"...\"}]",
            },
            {
              role: "user",
              content: "Generate 5 multiple choice questions about photosynthesis.",
            },
          ],
        }),
      });

      const data = await res.json();

      let parsed: Question[] = [];

      try {
        parsed = JSON.parse(data.response); // ✅ backend sends "response"
      } catch (err) {
        console.error("AI did not return valid JSON, using fallback.");
        parsed = [
          {
            question: "Fallback: What is 2 + 2?",
            options: ["1", "2", "3", "4"],
            answer: "4",
          },
        ];
      }

      setQuestions(parsed);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div className="p-4 space-y-4">
      <Button onClick={generateQuestions} disabled={loading}>
        {loading ? "Generating..." : "Generate Questions"}
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {questions.map((q, idx) => (
          <Card key={idx}>
            <CardContent className="p-4">
              <h2 className="font-bold mb-2">
                Q{idx + 1}: {q.question}
              </h2>
              <ul className="space-y-1">
                {q.options.map((opt, i) => (
                  <li key={i}>- {opt}</li>
                ))}
              </ul>
              <p className="mt-2 text-green-600">Answer: {q.answer}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
