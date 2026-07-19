const app = require("../app");

describe("passport session middleware", () => {
  it("registers passport's session middleware on the app", () => {
    const authenticateLayer = app.router.stack.find(
      (layer) => layer.name === "authenticate"
    );

    expect(authenticateLayer).toBeDefined();
  });
});
