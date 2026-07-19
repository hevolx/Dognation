const request = require("supertest");
const helper = require("../helpers/helper");

jest.mock("../helpers/helper");

const app = require("../app");

describe("Log In User", () => {
  it("redirects to the login page when authentication fails", async () => {
    helper.findByUsername.mockImplementationOnce((username, cb) => {
      cb(null, null);
    });

    const response = await request(app)
      .post("/users/login")
      .send({ username: "nouser", password: "wrongpassword" });

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe("login");
  });
});
