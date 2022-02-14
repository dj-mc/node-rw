import assert from 'assert';
import EventEmitter from 'events';
import { beforeEach, describe, it } from 'mocha';
import LDJClient from '../lib/ldj_client.mjs';

describe('LDJClient', () => {
  let stream = null;
  let client = null;

  beforeEach(() => {
    stream = new EventEmitter();
    client = new LDJClient(stream);
  });

  it('should emit a message event from a single data event', (done) => {
    client.on('message', (message) => {
      assert.deepEqual(message, { foo: 'bar' });
      done();
    });
    stream.emit('data', '{"foo":"bar"}\n');
  });

  it('should emit a message event from two split data events', (done) => {
    client.on('message', (message) => {
      assert.deepEqual(message, { foo: 'bar' });
      done();
    });
    stream.emit('data', '{"foo":');
    process.nextTick(() => stream.emit('data', '"bar"}\n'));
  });

  it('should emit a message event from two or more split data events', (done) => {
    client.on('message', (message) => {
      assert.deepEqual(message, { foo: 'bar' });
      done();
    });
    for (let char of '{"foo":"bar"}\n') {
      process.nextTick(() => stream.emit('data', char));
    }
  });

  it('should throw an error when null is passed to its constructor', (done) => {
    client.on('error', (err) => {
      assert.deepEqual(err, 'null value passed into LDJClient');
      done();
    });
    stream.emit('data', null);
  });

  it('should handle potentially non-json formatted data', (done) => {
    client.on('error', (err) => {
      assert.deepEqual(err, 'non-json formatted data passed into LDJClient');
      done();
    });
    stream.emit('data', '"foo":"bar"\n');
  });

  it('should finish within 20 ms', (done) => {
    setTimeout(done, 0);
  }).timeout(20);
});

// The LDJClient already handles the case in which a properly formatted JSON
// string is split over multiple lines. What happens if the incoming data is
// not a properly formatted JSON string?

// Write a test case that sends a data event that is not JSON. What do you
// think should happen in this case?

// What happens if the last data event completes a JSON message, but without
// the trailing newline?

// Write a case where the stream object sends a data event containing JSON
// but no newline, followed by a close event. A real Stream instance will emit
// a close event when going offline—update LDJClient to listen for close and
// process the remainder of the buffer.

// Should LDJClient emit a close event for its listeners? Under what
// circumstances?