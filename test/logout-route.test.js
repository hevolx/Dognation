const request = require("supertest");
const app = require("../app");

describe("Log Out User", () => {
  it("redirects to the home page after logging out", async () => {
    const response = await request(app).get("/users/logout");

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe("../");
  });
});
