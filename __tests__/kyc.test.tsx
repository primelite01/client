import { render, screen, fireEvent } from "@testing-library/react";
import KycPage from "../src/app/auth/kyc";

describe("KycPage", () => {
  it("renders KYC form and handles input", () => {
    render(<KycPage />);
    expect(screen.getByText(/kyc verification/i)).toBeInTheDocument();
    const ninInput = screen.getByPlaceholderText(/nin/i);
    fireEvent.change(ninInput, { target: { value: "12345678901" } });
    expect(ninInput).toHaveValue("12345678901");
  });
});
