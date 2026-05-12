function isTaskLocked(
    currentDay: number,
    completedDays: number[]
) {
    if (currentDay === 1) return false;

    return !completedDays.includes(currentDay - 1);
}

describe("Task Lock Logic", () => {
    it("should unlock day 1", () => {
        expect(isTaskLocked(1, [])).toBe(false);
    });

    it("should lock day 2 if day 1 incomplete", () => {
        expect(isTaskLocked(2, [])).toBe(true);
    });

    it("should unlock day 2 if day 1 complete", () => {
        expect(isTaskLocked(2, [1])).toBe(false);
    });

    it("should lock day 5 if day 4 incomplete", () => {
        expect(isTaskLocked(5, [1, 2, 3])).toBe(true);
    });
});