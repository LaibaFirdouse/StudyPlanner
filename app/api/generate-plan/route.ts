import { connectDB } from "@/lib/db";
import Plan from "@/lib/models/Plan";
import Task from "@/lib/models/Task";
import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { ai } from "@/lib/ai";
import { generateTasks } from "@/lib/ruleEngine";

export async function POST(req: Request) {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { goal, level, days } = await req.json();

        // CLEAN GOAL
        const cleanedGoal = goal.trim();

        // PREVENT DUPLICATES
        const existing = await Plan.findOne({
            goal: cleanedGoal.toLowerCase(),
            userId: session.user.email,
        });

        if (existing) {
            return NextResponse.json(
                { error: "Plan already exists" },
                { status: 400 }
            );
        }

        // CREATE PLAN
        const plan = await Plan.create({
            goal: cleanedGoal,
            level,
            duration: days,
            userId: session.user.email,
        });

        let tasksData: any[] = [];

        try {

            // REAL AI PROMPT
            const prompt = `
You are an expert mentor and curriculum designer.

Create a highly personalized ${days}-day roadmap for:
"${cleanedGoal}"

User level:
${level}

IMPORTANT RULES:

- Generate a REAL learning path
- Every day must feel different
- Avoid generic filler like:
  "Basics"
  "Fundamentals"
  "Practice"
  "Core Concepts"

- DO NOT repeat the user's input awkwardly
  BAD: "I want to maths basics"
  BAD: "Psychology fundamentals"

- Make the roadmap feel intelligently designed
- Progress naturally from beginner to advanced
- Include practical exercises, implementation, reflection, projects, analysis, or experimentation where relevant
- Tailor the roadmap specifically to the topic
- For every task include:
  - a clear explanation
  - learning objective
  - - Include 2 useful resources per task
- One should usually be a YouTube/tutorial resource
- One should usually be documentation/article based

For every resource provide:
- title
- query
- type

Type must be either:
- "youtube"
- "docs"

DO NOT generate direct URLs

VERY IMPORTANT:
- Titles must sound natural and professional
- Keep titles concise
- Descriptions should explain what the user will actually do

Return ONLY valid JSON.
No markdown.
No explanations.
No code block.


Format:
[
  {
    "day": 1,
    "title": "",
    "description": "",
    "resources": [
      {
        "title": "",
        "query": "",
        "type":""
      }
    ]
  }
]
`;

            // AI CALL
            const completion = await ai.chat.completions.create({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
                temperature: 0.9,
            });

            // RAW RESPONSE
            const raw =
                completion.choices[0].message.content
                    ?.replace(/```json/g, "")
                    .replace(/```/g, "")
                    .trim();

            console.log("AI RAW RESPONSE:", raw);

            if (!raw) {
                throw new Error("Empty AI response");
            }

            // PARSE AI JSON
            const parsed = JSON.parse(raw);

            // HANDLE ARRAY RESPONSE
            if (!Array.isArray(parsed)) {
                throw new Error("AI response is not an array");
            }

            tasksData = parsed.map((task: any, index: number) => ({
                day: task.day || index + 1,
                title: task.title || `Day ${index + 1}`,
                description: task.description || "",
                resources: (task.resources || []).map((resource: any) => ({
                    title: resource.title,
                    type: resource.type,

                    url: resource.type === "docs"
                        ? `https://www.google.com/search?q=${encodeURIComponent(
                            resource.query
                        )}`
                        : `https://www.youtube.com/results?search_query=${encodeURIComponent(
                            resource.query
                        )}`,
                })),
                completed: false,
            }));

        } catch (aiError) {

            console.error("AI FAILED → USING FALLBACK:", aiError);

            // FALLBACK
            tasksData = generateTasks(cleanedGoal, level, days);
        }

        // SAVE TASKS
        const tasks = tasksData.map((task: any) => ({
            ...task,
            planId: plan._id,
        }));

        await Task.insertMany(tasks);

        return NextResponse.json({
            success: true,
            planId: plan._id,
        });

    } catch (error) {

        console.error("GENERATE PLAN ERROR:", error);

        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}