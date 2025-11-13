import { protectedProcedure, router } from "../_core/trpc";
import { createAnalysis, getAnalysisByUserId, getAnalysisById } from "../db";
import { invokeLLM } from "../_core/llm";

interface AnalysisInput {
  productDescription: string;
  mainProblem: string;
  targetAudience: string;
  buyingFactors: string;
  platforms: string;
  messageTypes: string;
  analysisGoal: string;
}

interface BuyerPersona {
  name: string;
  description: string;
  goals: string[];
  painPoints: string[];
  preferredPlatforms: string[];
  messageType: string;
  advertisingApproach: string;
}

interface AnalysisResult {
  summary: string;
  buyerPersonas: BuyerPersona[];
  channels: string[];
  toneOfVoice: string;
  contentTypes: string[];
  recommendations: string[];
}

export const analysisRouter = router({
  create: protectedProcedure
    .input((val: any) => val as AnalysisInput)
    .mutation(async ({ ctx, input }) => {
      try {
        // Generate AI analysis
        const aiAnalysis = await generateAnalysis(input);

        // Store in database
        const result = await createAnalysis({
          userId: ctx.user.id,
          productDescription: input.productDescription,
          mainProblem: input.mainProblem,
          targetAudience: input.targetAudience,
          buyingFactors: input.buyingFactors,
          platforms: input.platforms,
          messageTypes: input.messageTypes,
          analysisGoal: input.analysisGoal,
          aiAnalysis: JSON.stringify(aiAnalysis),
        });

        return {
          success: true,
          analysisId: (result as any).insertId || 1,
          analysis: aiAnalysis,
        };
      } catch (error) {
        console.error("Error creating analysis:", error);
        throw error;
      }
    }),

  getByUser: protectedProcedure.query(async ({ ctx }) => {
    return await getAnalysisByUserId(ctx.user.id);
  }),

  getById: protectedProcedure
    .input((val: any) => val as { id: number })
    .query(async ({ input }) => {
      const analysis = await getAnalysisById(input.id);
      if (!analysis) {
        throw new Error("Analysis not found");
      }
      return {
        ...analysis,
        aiAnalysis: analysis.aiAnalysis ? JSON.parse(analysis.aiAnalysis) : null,
      };
    }),
});

async function generateAnalysis(input: AnalysisInput): Promise<AnalysisResult> {
  const prompt = `أنت خبير تسويق متخصص في تحليل الجمهور المستهدف. قم بتحليل المعلومات التالية وأنتج تقرير احترافي:

منتج/خدمة: ${input.productDescription}
المشكلة الرئيسية: ${input.mainProblem}
الجمهور المستهدف: ${input.targetAudience}
عوامل الشراء: ${input.buyingFactors}
المنصات: ${input.platforms}
نوع الرسائل: ${input.messageTypes}
الهدف من التحليل: ${input.analysisGoal}

يرجى إنتاج تحليل شامل يتضمن:
1. ملخص سريع عن الجمهور المستهدف
2. 2-3 شخصيات مشتري مفصلة (اسم، وصف نفسي واجتماعي، أهداف، نقاط ألم، منصات مفضلة، نوع الرسائل، أسلوب الإعلان)
3. قنوات إعلانية موصى بها
4. نبرة صوت مناسبة
5. أنواع محتوى مقترحة
6. توصيات استراتيجية قابلة للتطبيق

الرد يجب أن يكون بصيغة JSON صحيحة بالعربية.`;

  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system" as const,
          content:
            "أنت خبير تسويق متخصص في تحليل الجمهور المستهدف. قدم تحليلات احترافية ومفصلة بصيغة JSON صحيحة.",
        },
        {
          role: "user" as const,
          content: prompt,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "audience_analysis",
          strict: true,
          schema: {
            type: "object",
            properties: {
              summary: {
                type: "string",
                description: "ملخص سريع عن الجمهور المستهدف",
              },
              buyerPersonas: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string", description: "اسم الشخصية" },
                    description: {
                      type: "string",
                      description: "وصف نفسي واجتماعي",
                    },
                    goals: {
                      type: "array",
                      items: { type: "string" },
                      description: "الأهداف والدوافع",
                    },
                    painPoints: {
                      type: "array",
                      items: { type: "string" },
                      description: "نقاط الألم",
                    },
                    preferredPlatforms: {
                      type: "array",
                      items: { type: "string" },
                      description: "المنصات المفضلة",
                    },
                    messageType: {
                      type: "string",
                      description: "نوع الرسائل المناسبة",
                    },
                    advertisingApproach: {
                      type: "string",
                      description: "أسلوب الإعلان المناسب",
                    },
                  },
                  required: [
                    "name",
                    "description",
                    "goals",
                    "painPoints",
                    "preferredPlatforms",
                    "messageType",
                    "advertisingApproach",
                  ],
                  additionalProperties: false,
                },
                description: "شخصيات المشتري",
              },
              channels: {
                type: "array",
                items: { type: "string" },
                description: "القنوات الإعلانية الموصى بها",
              },
              toneOfVoice: {
                type: "string",
                description: "نبرة الصوت المناسبة",
              },
              contentTypes: {
                type: "array",
                items: { type: "string" },
                description: "أنواع المحتوى المقترحة",
              },
              recommendations: {
                type: "array",
                items: { type: "string" },
                description: "التوصيات الاستراتيجية",
              },
            },
            required: [
              "summary",
              "buyerPersonas",
              "channels",
              "toneOfVoice",
              "contentTypes",
              "recommendations",
            ],
            additionalProperties: false,
          },
        },
      },
    });

    // Parse the response
    const content = response.choices[0]?.message?.content;
    if (!content || typeof content !== 'string') {
      throw new Error("No content in LLM response");
    }

    const analysis = JSON.parse(content) as AnalysisResult;
    return analysis;
  } catch (error) {
    console.error("Error generating analysis:", error);
    throw new Error("Failed to generate analysis");
  }
}
