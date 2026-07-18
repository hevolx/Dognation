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

  it("calls done with the error when helper.findByUsername fails", () => {
    const strategy = passport._strategies.local;
    const done = jest.fn();
    const lookupError = new Error("lookup failed");

    helper.findByUsername.mockImplementationOnce((username, cb) => {
      cb(lookupError);
    });

    strategy._verify("myuser", "mypassword", done);

    expect(done).toHaveBeenCalledWith(lookupError);
  });

  it("calls done with no error and false when no user is found", () => {
    const strategy = passport._strategies.local;
    const done = jest.fn();

    helper.findByUsername.mockImplementationOnce((username, cb) => {
      cb(null, null);
    });

    strategy._verify("myuser", "mypassword", done);

    expect(done).toHaveBeenCalledWith(null, false);
  });
});
