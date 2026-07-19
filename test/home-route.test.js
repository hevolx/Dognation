const request = require("supertest");
const bcrypt = require("bcrypt");
const helper = require("../helpers/helper");

jest.mock("../helpers/helper");

const app = require("../app");

describe("Home Route", () => {
  it("renders the logged-in user instead of Guest", async () => {
    const hashedPassword = await bcrypt.hash("mypassword", 10);
    const user = { id: 1, username: "myuser", password: hashedPassword };

    helper.findByUsername.mockImplementation((username, cb) => {
      cb(null, user);
    });
    helper.findById.mockImplementation((id, cb) => {
      cb(null, user);
    });

    const loginResponse = await request(app)
      .post("/users/login")
      .set("X-Forwarded-Proto", "https")
      .send({ username: "myuser", password: "mypassword" });
    const sessionCookie = loginResponse.headers["set-cookie"][0].split(";")[0];

    const response = await request(app).get("/").set("Cookie", sessionCookie);

    expect(response.text).toContain("myuser");
  });
});
