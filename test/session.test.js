const app = require("../app");

describe("session middleware", () => {
  it("attaches a session with a positive maxAge and sameSite=none, secure cookies", (done) => {
    const sessionLayer = app.router.stack.find(
      (layer) => layer.name === "session"
    );

    const req = { headers: {}, connection: {}, url: "/", originalUrl: "/" };
    const res = {
      getHeader: () => {},
      setHeader: () => {},
      end: () => {},
    };

    sessionLayer.handle(req, res, () => {
      expect(req.session).toBeDefined();
      expect(req.session.cookie.maxAge).toBeGreaterThan(0);
      expect(req.session.cookie.sameSite).toBe("none");
      expect(req.session.cookie.secure).toBe(true);
      done();
    });
  });
});
