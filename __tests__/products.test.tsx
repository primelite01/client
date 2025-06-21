import { render, screen } from "@testing-library/react";
import ProductListPage from "../src/app/products/page";

describe("ProductListPage", () => {
  it("renders product listing", () => {
    render(<ProductListPage />);
    expect(screen.getByText(/browse listings/i)).toBeInTheDocument();
  });
});
