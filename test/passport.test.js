jest.mock("../helpers/helper", () => ({
  findByUsername: jest.fn(),
}));

const passport = require("passport");
const helper = require("../helpers/helper");
require("../config/passport");

describe("passport local strategy", () => {
  it("registers a local strategy with passport", () => {
    expect(passport._strategies.local).toBeDefined();
  });

  it("looks up the user via helper.findByUsername with the given username", () => {
    const strategy = passport._strategies.local;
    const done = jest.fn();

    strategy._verify("myuser", "mypassword", done);

    expect(helper.findByUsername).toHaveBeenCalledWith(
      "myuser",
      expect.any(Function)
    );
  });
});
