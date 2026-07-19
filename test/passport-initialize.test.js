const app = require("../app");

describe("Initialize Passport", () => {
  it("registers passport's initialize middleware on the app", () => {
    const initializeLayer = app.router.stack.find(
      (layer) => layer.name === "initialize"
    );

    expect(initializeLayer).toBeDefined();
  });

  it("registers passport's session middleware on the app", () => {
    const sessionLayer = app.router.stack.find(
      (layer) => layer.name === "authenticate"
    );

    expect(sessionLayer).toBeDefined();
  });
});
