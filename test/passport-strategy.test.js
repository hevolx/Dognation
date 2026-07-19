jest.mock("../helpers/helper", () => ({
  findByUsername: jest.fn(),
  findById: jest.fn(),
}));

const passport = require("passport");
const bcrypt = require("bcrypt");
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

  it("calls done with no error and false when the password is invalid", async () => {
    const strategy = passport._strategies.local;
    const done = jest.fn();
    jest.spyOn(bcrypt, "compare").mockResolvedValue(false);

    helper.findByUsername.mockImplementationOnce((username, cb) => {
      cb(null, { username: "myuser", password: "correctpassword" });
    });

    await new Promise((resolve) => {
      strategy._verify("myuser", "wrongpassword", (...args) => {
        done(...args);
        resolve();
      });
    });

    expect(done).toHaveBeenCalledWith(null, false);
  });

  it("passes an asynchronous callback to helper.findByUsername", () => {
    const strategy = passport._strategies.local;
    const done = jest.fn();

    strategy._verify("myuser", "mypassword", done);

    const [, callback] = helper.findByUsername.mock.calls[0];
    expect(callback.constructor.name).toBe("AsyncFunction");
  });

  it("compares the provided password with the user's hashed password using bcrypt", () => {
    const strategy = passport._strategies.local;
    const done = jest.fn();
    const matchedUser = { username: "myuser", password: "hashedpassword" };
    const compareSpy = jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

    helper.findByUsername.mockImplementationOnce((username, cb) => {
      cb(null, matchedUser);
    });

    strategy._verify("myuser", "plaintextpassword", done);

    expect(compareSpy).toHaveBeenCalledWith("plaintextpassword", "hashedpassword");
  });

  it("calls done with no error and the user when credentials are valid", async () => {
    const strategy = passport._strategies.local;
    const done = jest.fn();
    const matchedUser = { username: "myuser", password: "correctpassword" };
    jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

    helper.findByUsername.mockImplementationOnce((username, cb) => {
      cb(null, matchedUser);
    });

    await new Promise((resolve) => {
      strategy._verify("myuser", "correctpassword", (...args) => {
        done(...args);
        resolve();
      });
    });

    expect(done).toHaveBeenCalledWith(null, matchedUser);
  });

  it("calls done with an error when bcrypt.compare throws", async () => {
    const strategy = passport._strategies.local;
    const done = jest.fn();
    const compareError = new Error("compare failed");
    jest.spyOn(bcrypt, "compare").mockRejectedValue(compareError);

    helper.findByUsername.mockImplementationOnce((username, cb) => {
      cb(null, { username: "myuser", password: "hashedpassword" });
    });

    await new Promise((resolve) => {
      strategy._verify("myuser", "mypassword", (...args) => {
        done(...args);
        resolve();
      });
    });

    expect(done).toHaveBeenCalledWith(compareError);
  });
});
