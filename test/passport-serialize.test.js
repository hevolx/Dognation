jest.mock("../helpers/helper", () => ({
  findByUsername: jest.fn(),
  findById: jest.fn(),
}));

const passport = require("passport");
const helper = require("../helpers/helper");
require("../config/passport");

describe("Serialize and Deserialize Users", () => {
  it("serializes a user by calling done with the user's id", () => {
    const done = jest.fn();
    const user = { id: 42, username: "myuser" };

    passport._serializers[0](user, done);

    expect(done).toHaveBeenCalledWith(null, user.id);
  });

  it("registers a deserializer function", () => {
    expect(passport._deserializers[0]).toBeInstanceOf(Function);
  });

  it("looks up the user via helper.findById with the given id", () => {
    const done = jest.fn();

    passport._deserializers[0](42, done);

    expect(helper.findById).toHaveBeenCalledWith(42, expect.any(Function));
  });

  it("calls done with the error when helper.findById fails", () => {
    const done = jest.fn();
    const lookupError = new Error("lookup failed");

    helper.findById.mockImplementationOnce((id, cb) => {
      cb(lookupError);
    });

    passport._deserializers[0](42, done);

    expect(done).toHaveBeenCalledWith(lookupError);
  });

  it("calls done with no error and the user when helper.findById succeeds", () => {
    const done = jest.fn();
    const foundUser = { id: 42, username: "myuser" };

    helper.findById.mockImplementationOnce((id, cb) => {
      cb(null, foundUser);
    });

    passport._deserializers[0](42, done);

    expect(done).toHaveBeenCalledWith(null, foundUser);
  });
});
