import { render, screen } from "@testing-library/react";
import AdminDashboardPage from "../src/app/admin/page";

describe("AdminDashboardPage", () => {
  it("renders admin dashboard sections", () => {
    render(<AdminDashboardPage />);
    expect(screen.getByText(/pending kyc/i)).toBeInTheDocument();
    expect(screen.getByText(/disputes/i)).toBeInTheDocument();
    expect(screen.getByText(/flagged messages/i)).toBeInTheDocument();
    expect(screen.getByText(/transactions/i)).toBeInTheDocument();
  });
});
