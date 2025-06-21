import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "../src/app/auth/login";

describe("LoginPage", () => {
  it("renders login form and handles input", () => {
    render(<LoginPage />);
    expect(screen.getByText(/login/i)).toBeInTheDocument();
    const emailInput = screen.getByPlaceholderText(/email/i);
    fireEvent.change(emailInput, { target: { value: "test@email.com" } });
    expect(emailInput).toHaveValue("test@email.com");
  });
});
