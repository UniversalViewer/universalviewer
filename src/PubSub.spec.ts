import { PubSub } from './PubSub';

describe('PubSub', () => {
	it('subscribes to an event', () => {

        const pubsub = new PubSub();

        const eventName = "test-event";
        let eventArgs;

        let handled = false;        

		pubsub.subscribe(eventName, (e) => {
            handled = true;
            eventArgs = e;
        });

        pubsub.publish(eventName, "test");

        expect(handled).toEqual(true);
        expect(eventArgs).toEqual("test");
	});
});
