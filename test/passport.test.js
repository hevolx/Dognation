const passport = require("passport");
require("../config/passport");

describe("passport local strategy", () => {
  it("registers a local strategy with passport", () => {
    expect(passport._strategies.local).toBeDefined();
  });
});
