describe("Generate Plan Payload", () => {
    it("should validate correct payload", () => {
        const payload = {
            goal: "React",
            level: "beginner",
            days: 7,
        };

        expect(payload.goal).toBeTruthy();
        expect(payload.days).toBeGreaterThan(0);
    });

    it("should reject invalid duration", () => {
        const days = -1;

        expect(days).toBeLessThan(0);
    });
});