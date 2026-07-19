const request = require("supertest");
const bcrypt = require("bcrypt");
const helper = require("../helpers/helper");

jest.mock("../helpers/helper");

const app = require("../app");

describe("Bcrypt", () => {
  beforeEach(() => {
    helper.userExists.mockResolvedValue(undefined);
    helper.getNewId.mockReturnValue(1);
    helper.writeJSONFile.mockImplementation(() => {});
  });

  it("generates a bcrypt salt for the incoming password", async () => {
    const genSaltSpy = jest.spyOn(bcrypt, "genSalt");

    await request(app)
      .post("/users/register")
      .send({ username: "newuser", password: "plaintext" });

    expect(genSaltSpy).toHaveBeenCalled();
  });

  it("stores the hashed password instead of the plaintext password", async () => {
    await request(app)
      .post("/users/register")
      .send({ username: "newuser", password: "plaintext" });

    const [, storedUsers] = helper.writeJSONFile.mock.calls[0];
    const storedUser = storedUsers.find((u) => u.username === "newuser");

    expect(storedUser.password).not.toBe("plaintext");
  });
});
