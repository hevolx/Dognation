const app = require("../app");

describe("passport initialize middleware", () => {
  it("registers passport's initialize middleware on the app", () => {
    const initializeLayer = app.router.stack.find(
      (layer) => layer.name === "initialize"
    );

    expect(initializeLayer).toBeDefined();
  });
});
