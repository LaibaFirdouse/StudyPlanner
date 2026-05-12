import { generateTasks } from "@/lib/ruleEngine";

describe("generateTasks", () => {
    it("should generate requested number of tasks", () => {
        const tasks = generateTasks("React", "beginner", 7);

        expect(tasks.length).toBe(7);
    });

    it("should generate programming-related roadmap", () => {
        const tasks = generateTasks("React", "beginner", 3);

        expect(tasks[0].title.toLowerCase()).toContain("react");
    });

    it("should apply advanced level prefix", () => {
        const tasks = generateTasks("React", "advanced", 3);

        expect(tasks[0].title.toLowerCase()).toContain("advanced");
    });

    it("should mark tasks incomplete by default", () => {
        const tasks = generateTasks("Python", "beginner", 2);

        expect(tasks[0].completed).toBe(false);
    });
});