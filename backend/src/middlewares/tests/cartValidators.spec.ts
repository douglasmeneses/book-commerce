import { cartValidates, removeBookToCartValidates } from "../cartValidators";

describe("cartValidates", () => {
  it("should return an error if user_uuid is invalid", () => {
    expect(cartValidates("", "book123", 2)).toEqual({
      error: "Invalid user id",
    });
    expect(cartValidates(123 as any, "book123", 2)).toEqual({
      error: "Invalid user id",
    });
  });

  it("should return an error if book_uuid is invalid", () => {
    expect(cartValidates("user123", "", 2)).toEqual({
      error: "Invalid book id",
    });
    expect(cartValidates("user123", 123 as any, 2)).toEqual({
      error: "Invalid book id",
    });
  });

  it("should return an error if quantity is invalid", () => {
    expect(cartValidates("user123", "book123", 0)).toEqual({
      error: "Invalid quantity",
    });
    expect(cartValidates("user123", "book123", -1)).toEqual({
      error: "Invalid quantity",
    });
    expect(cartValidates("user123", "book123", "2" as any)).toEqual({
      error: "Invalid quantity",
    });
  });

  it("should return null if all fields are valid", () => {
    expect(cartValidates("user123", "book123", 2)).toBeNull();
  });
});

describe("removeBookToCartValidates", () => {
  it("should return an error if cartItem_id is invalid", () => {
    expect(removeBookToCartValidates(0, 2)).toEqual({
      error: "Invalid cart item id",
    });
    expect(removeBookToCartValidates("123" as any, 2)).toEqual({
      error: "Invalid cart item id",
    });
  });

  it("should return an error if quantity is invalid", () => {
    expect(removeBookToCartValidates(1, 0)).toEqual({
      error: "Invalid quantity",
    });
    expect(removeBookToCartValidates(1, -1)).toEqual({
      error: "Invalid quantity",
    });
    expect(removeBookToCartValidates(1, "2" as any)).toEqual({
      error: "Invalid quantity",
    });
  });

  it("should return null if all fields are valid", () => {
    expect(removeBookToCartValidates(1, 2)).toBeNull();
  });
});
