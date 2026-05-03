// 🔹 Utility: clean & format goal
function formatGoal(goal: string) {
    return goal
        .replace(/learn|study|master/gi, "")
        .trim()
        .replace(/\s+/g, " ")
        .replace(/^./, (c) => c.toUpperCase());
}

// 🔹 Detect category
function detectCategory(goal: string) {
    const g = goal.toLowerCase();

    // 💻 Programming / Tech
    if (
        g.includes("react") ||
        g.includes("javascript") ||
        g.includes("python") ||
        g.includes("java") ||
        g.includes("coding") ||
        g.includes("programming") ||
        g.includes("dsa") ||
        g.includes("backend") ||
        g.includes("frontend")
    ) {
        return "programming";
    }

    // 🌍 Natural Language
    if (
        g.includes("english") ||
        g.includes("spanish") ||
        g.includes("french") ||
        g.includes("german") ||
        g.includes("language")
    ) {
        return "language";
    }

    // 🎨 Creative
    if (
        g.includes("design") ||
        g.includes("ui") ||
        g.includes("ux") ||
        g.includes("drawing") ||
        g.includes("music") ||
        g.includes("photography")
    ) {
        return "creative";
    }

    // 🧠 Academic
    if (
        g.includes("math") ||
        g.includes("physics") ||
        g.includes("chemistry") ||
        g.includes("economics") ||
        g.includes("history")
    ) {
        return "academic";
    }

    // 🧩 Default → Life Skill
    return "life";
}

// 🔹 Get roadmap based on category
function getRoadmap(category: string, goal: string) {
    const g = formatGoal(goal);

    switch (category) {
        case "programming":
            return [
                `${g} Fundamentals`,
                `${g} Core Concepts`,
                `${g} Hands-on Practice`,
                `${g} Problem Solving`,
                `${g} Build Projects`,
                `${g} Advanced Patterns`,
                `${g} Final Project`,
            ];

        case "language":
            return [
                `${g} Vocabulary`,
                `${g} Grammar Basics`,
                `${g} Reading Practice`,
                `${g} Writing Practice`,
                `${g} Listening Skills`,
                `${g} Speaking Practice`,
                `${g} Real Conversations`,
            ];

        case "creative":
            return [
                `${g} Basics`,
                `${g} Tools & Setup`,
                `${g} Techniques`,
                `${g} Guided Practice`,
                `${g} Creative Projects`,
                `${g} Portfolio Work`,
                `${g} Showcase Project`,
            ];

        case "academic":
            return [
                `${g} Core Concepts`,
                `${g} Theory Understanding`,
                `${g} Examples`,
                `${g} Problem Solving`,
                `${g} Practice Tests`,
                `${g} Weak Areas Revision`,
                `${g} Final Revision`,
            ];

        case "life":
        default:
            return [
                `${g} Basics`,
                `${g} Fundamentals`,
                `${g} Daily Practice`,
                `${g} Real-life Application`,
                `${g} Improvement Techniques`,
                `${g} Consistency Building`,
                `${g} Mastery Practice`,
            ];
    }
}

// 🔹 Apply level adjustments
function applyLevel(roadmap: string[], level: string) {
    if (level === "advanced") {
        return roadmap.map((r) => `Advanced ${r}`);
    }

    if (level === "intermediate") {
        return roadmap.map((r) => `Intermediate ${r}`);
    }

    return roadmap; // beginner = no prefix
}

// 🔹 MAIN FUNCTION
export function generateTasks(goal: string, level: string, days: number) {
    const category = detectCategory(goal);

    let roadmap = getRoadmap(category, goal);

    roadmap = applyLevel(roadmap, level);

    const tasks = [];

    for (let i = 0; i < days; i++) {
        tasks.push({
            day: i + 1,
            title: roadmap[i % roadmap.length],
            completed: false,
        });
    }

    return tasks;
}