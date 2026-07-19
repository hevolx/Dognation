jest.mock("../helpers/helper", () => ({
  findByUsername: jest.fn(),
  findById: jest.fn(),
}));

const passport = require("passport");
const helper = require("../helpers/helper");
require("../config/passport");

describe("Authenticating Users with Passport.js", () => {
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

  it("calls done with no error and false when the password is invalid", () => {
    const strategy = passport._strategies.local;
    const done = jest.fn();

    helper.findByUsername.mockImplementationOnce((username, cb) => {
      cb(null, { username: "myuser", password: "correctpassword" });
    });

    strategy._verify("myuser", "wrongpassword", done);

    expect(done).toHaveBeenCalledWith(null, false);
  });

  it("passes an asynchronous callback to helper.findByUsername", () => {
    const strategy = passport._strategies.local;
    const done = jest.fn();

    strategy._verify("myuser", "mypassword", done);

    const [, callback] = helper.findByUsername.mock.calls[0];
    expect(callback.constructor.name).toBe("AsyncFunction");
  });

  it("calls done with no error and the user when credentials are valid", () => {
    const strategy = passport._strategies.local;
    const done = jest.fn();
    const matchedUser = { username: "myuser", password: "correctpassword" };

    helper.findByUsername.mockImplementationOnce((username, cb) => {
      cb(null, matchedUser);
    });

    strategy._verify("myuser", "correctpassword", done);

    expect(done).toHaveBeenCalledWith(null, matchedUser);
  });
});
