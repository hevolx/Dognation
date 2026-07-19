const request = require("supertest");
const bcrypt = require("bcrypt");
const helper = require("../helpers/helper");

jest.mock("../helpers/helper");

const app = require("../app");

describe("POST /register", () => {
  it("generates a bcrypt salt for the incoming password", async () => {
    helper.userExists.mockResolvedValue(undefined);
    helper.getNewId.mockReturnValue(1);
    helper.writeJSONFile.mockImplementation(() => {});
    const genSaltSpy = jest.spyOn(bcrypt, "genSalt");

    await request(app)
      .post("/users/register")
      .send({ username: "newuser", password: "plaintext" });

    expect(genSaltSpy).toHaveBeenCalled();
  });
});
