import { averageRating, validateReviewFields } from "../reviewUtils";

describe("averageRating", () => {
  it("should return 0 if no reviews are provided", () => {
    expect(averageRating([])).toBe(0);
  });

  it("should calculate the average rating correctly", () => {
    const reviews = [{ rating: 4 }, { rating: 5 }, { rating: 3 }] as any; // Mocking Review type
    expect(averageRating(reviews)).toBe(4);
  });

  it("should handle non-integer ratings", () => {
    const reviews = [{ rating: 4.5 }, { rating: 3.5 }] as any;
    expect(averageRating(reviews)).toBe(4);
  });
});

describe("validateReviewFields", () => {
  it("should return an error if review or rating is missing", () => {
    expect(validateReviewFields({ review: "", rating: 5 })).toEqual({
      message: "All fields are required",
      error: 400,
    });
    expect(validateReviewFields({ review: "Great book!", rating: 0 })).toEqual({
      message: "All fields are required",
      error: 400,
    });
  });

  it("should return an error if rating is out of range", () => {
    expect(validateReviewFields({ review: "Great book!", rating: -1 })).toEqual(
      {
        message: "Rating must be between 1 and 5",
        error: 400,
      }
    );
    expect(validateReviewFields({ review: "Great book!", rating: 6 })).toEqual({
      message: "Rating must be between 1 and 5",
      error: 400,
    });
  });

  it("should return an error if review is too short", () => {
    expect(validateReviewFields({ review: "Bad", rating: 3 })).toEqual({
      message: "Review must be at least 5 characters",
      error: 400,
    });
  });

  it("should return null if all fields are valid", () => {
    expect(
      validateReviewFields({ review: "Great book!", rating: 5 })
    ).toBeNull();
  });
});
