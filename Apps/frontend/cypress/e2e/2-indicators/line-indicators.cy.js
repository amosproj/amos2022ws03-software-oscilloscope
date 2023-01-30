import { Server, WebSocket } from "mock-socket";

const mockServer = new Server("ws://localhost:9000", {});
const mockSocket = new WebSocket("ws://localhost:9000/");
mockSocket.binaryType = "arraybuffer";
let mockConnection;
mockServer.on("connection", (socket) => {
  console.log("connected");
  mockConnection = socket;
});

describe("indicators", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/", {
      onBeforeLoad(window) {
        cy.stub(window, "WebSocket").returns(mockSocket);
      },
    });
  });

  it("is visible", () => {
    cy.get('[data-cy="line-indicators"]').should("be.visible");
  });

  it("updates min value", () => {
    cy.get('[data-cy="on-off-button"]').click();
    cy.get('[data-cy="startStopSwitch-0"] button').click();

    const samples = new Float64Array([
      1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
    ]);
    mockConnection.send(samples);
  });
});
