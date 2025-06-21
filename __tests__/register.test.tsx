import { render, screen, fireEvent } from "@testing-library/react";
import RegisterPage from "../src/app/auth/register";

describe("RegisterPage", () => {
  it("renders registration form and handles input", () => {
    render(<RegisterPage />);
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
    const emailInput = screen.getByPlaceholderText(/email/i);
    fireEvent.change(emailInput, { target: { value: "new@email.com" } });
    expect(emailInput).toHaveValue("new@email.com");
  });
});
