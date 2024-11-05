import { PubSub } from "./PubSub";

describe("PubSub", () => {
  it("subscribes to an event", () => {
    const pubsub = new PubSub();

    const eventName = "test-event";
    let eventArgs = undefined;
    let handled = false;

    const handler = (e) => {
      handled = true;
      eventArgs = e;
    };

    pubsub.subscribe(eventName, handler);

    pubsub.publish(eventName, "test");

    expect(handled).toEqual(true);
    expect(eventArgs).toEqual("test");

    // test unsubscribe

    // eventArgs = undefined;
    // handled = false;

    // pubsub.unsubscribe(eventName, handler);

    // pubsub.publish(eventName, "test");

    // expect(handled).toEqual(false);
    // expect(eventArgs).toEqual(undefined);
  });
});
