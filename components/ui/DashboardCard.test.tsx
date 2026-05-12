import { render, screen } from "@testing-library/react";
import DashboardCard from "./DashboardCard";

describe("DashboardCard", () => {
    it("renders analytics title", () => {
        render(
            <DashboardCard
                title="Active Plans"
                value="3"
            />
        );

        expect(screen.getByText("Active Plans")).toBeInTheDocument();
    });
});