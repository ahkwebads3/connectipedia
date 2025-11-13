import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowRight, ArrowLeft, MessageCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface Answer {
  questionId: number;
  value: string;
}

const QUESTIONS = [
  {
    id: 1,
    emoji: "📝",
    ar: "صف منتجك أو خدمتك في جملة واحدة",
    en: "Describe your product or service in one sentence",
    type: "text",
    placeholder: "مثال: تطبيق لإدارة المشاريع الصغيرة",
  },
  {
    id: 2,
    emoji: "🎯",
    ar: "ما أهم مشكلة يحلها المنتج؟",
    en: "What is the main problem your product solves?",
    type: "text",
    placeholder: "مثال: يساعد الشركات الصغيرة على تنظيم مشاريعها بسهولة",
  },
  {
    id: 3,
    emoji: "👥",
    ar: "من هو عميلك الحالي أو المتوقع؟",
    en: "Who is your current or expected customer?",
    type: "textarea",
    placeholder: "مثال: رجال ومرأة من سن 25-45 سنة، أصحاب شركات صغيرة ومتوسطة",
  },
  {
    id: 4,
    emoji: "💰",
    ar: "ما الذي يجعل العميل يشتري منك؟",
    en: "What makes customers buy from you?",
    type: "textarea",
    placeholder: "مثال: السعر المناسب، سهولة الاستخدام، الدعم الفني الممتاز",
  },
  {
    id: 5,
    emoji: "📱",
    ar: "ما المنصات التي يتواجد عليها عملاؤك؟",
    en: "What platforms are your customers on?",
    type: "textarea",
    placeholder: "مثال: فيسبوك، إنستجرام، لينكدإن، جوجل",
  },
  {
    id: 6,
    emoji: "💬",
    ar: "ما نوع الرسائل التي تجذبهم أكثر؟",
    en: "What type of messages attract them most?",
    type: "textarea",
    placeholder: "مثال: رسائل تركز على توفير الوقت والمال، قصص نجاح العملاء",
  },
  {
    id: 7,
    emoji: "🚀",
    ar: "ما هدفك من التحليل؟",
    en: "What is your goal from this analysis?",
    type: "textarea",
    placeholder: "مثال: زيادة المبيعات، تحديد المحتوى المناسب، اختيار قنوات الإعلان",
  },
];

export default function Analyzer() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const createAnalysisMutation = trpc.analysis.create.useMutation();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 max-w-md">
          <h2 className="text-2xl font-bold mb-4">يرجى تسجيل الدخول</h2>
          <p className="text-muted-foreground mb-6">
            تحتاج إلى تسجيل الدخول للوصول إلى أداة التحليل
          </p>
          <Button className="w-full" onClick={() => navigate("/")}>
            العودة إلى الصفحة الرئيسية
          </Button>
        </Card>
      </div>
    );
  }

  const question = QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;
  const currentAnswer = answers.find((a) => a.questionId === question.id)?.value || "";

  const handleAnswerChange = (value: string) => {
    const existingIndex = answers.findIndex((a) => a.questionId === question.id);
    if (existingIndex >= 0) {
      const newAnswers = [...answers];
      newAnswers[existingIndex].value = value;
      setAnswers(newAnswers);
    } else {
      setAnswers([...answers, { questionId: question.id, value }]);
    }
  };

  const handleNext = () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const analysisData = {
        productDescription: answers.find((a) => a.questionId === 1)?.value || "",
        mainProblem: answers.find((a) => a.questionId === 2)?.value || "",
        targetAudience: answers.find((a) => a.questionId === 3)?.value || "",
        buyingFactors: answers.find((a) => a.questionId === 4)?.value || "",
        platforms: answers.find((a) => a.questionId === 5)?.value || "",
        messageTypes: answers.find((a) => a.questionId === 6)?.value || "",
        analysisGoal: answers.find((a) => a.questionId === 7)?.value || "",
      };

      const result = await createAnalysisMutation.mutateAsync(analysisData);
      navigate(`/results`);
    } catch (error) {
      console.error("Error submitting analysis:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-background py-8 md:py-12">
      <div className="container max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl md:text-4xl font-bold">محلل الجمهور المستهدف</h1>
            <div className="text-sm text-muted-foreground">
              {currentQuestion + 1} من {QUESTIONS.length}
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="p-8 md:p-12 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="text-4xl">{question.emoji}</div>
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">{question.ar}</h2>
              <p className="text-sm text-muted-foreground">{question.en}</p>
            </div>
          </div>

          {/* Input Field */}
          <div className="mb-8">
            {question.type === "text" ? (
              <Input
                placeholder={question.placeholder}
                value={currentAnswer}
                onChange={(e) => handleAnswerChange(e.target.value)}
                className="text-lg p-4 h-auto"
                disabled={isLoading}
              />
            ) : (
              <Textarea
                placeholder={question.placeholder}
                value={currentAnswer}
                onChange={(e) => handleAnswerChange(e.target.value)}
                className="text-lg p-4 min-h-32 resize-none"
                disabled={isLoading}
              />
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0 || isLoading}
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              السابق
            </Button>
            <Button
              onClick={handleNext}
              disabled={!currentAnswer.trim() || isLoading}
              className="flex-1"
            >
              {currentQuestion === QUESTIONS.length - 1 ? (
                <>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {isLoading ? "جاري التحليل..." : "احصل على التحليل"}
                </>
              ) : (
                <>
                  التالي
                  <ArrowRight className="w-4 h-4 mr-2" />
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Progress Info */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            أنت في السؤال <strong>{currentQuestion + 1}</strong> من <strong>{QUESTIONS.length}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
