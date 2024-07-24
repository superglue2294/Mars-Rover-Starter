const Rover = require('../rover.js');
const Message = require('../message.js');
const Command = require('../command.js');

// NOTE: If at any time, you want to focus on the output from a single test, feel free to comment out all the others.
//       However, do NOT edit the grading tests for any reason and make sure to un-comment out your code to get the autograder to pass.


describe("Rover class", function () {

  // 7 tests here!

  // Test 7
  it("constructor sets position and default values for mode and generatorWatts.", () => {
    let rover = new Rover(98382);
    expect(rover.position).toBe(98382);
    expect(rover.mode).toBe('NORMAL');

    expect(rover.generatorWatts).toEqual(110);
  })

  // Test 8
  it("response returned by receiveMessage contains the name of the message", () => {
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
    let messageName = 'Test message with two commands';
    let message = new Message('Test message with two commands', commands);
    let rover = new Rover(98382);
    let response = rover.receiveMessage(message);

    expect(response).toHaveProperty("message", messageName);
  })

  // Test 9
  it("response returned by receiveMessage includes two results if two commands are sent in the message", () => {
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
    let message = new Message('Test message with two commands', commands);
    let rover = new Rover(98382);
    let response = rover.receiveMessage(message);

    expect(response.results).toHaveLength(2);
  })

  // Test 10
  it("responds correctly to the status check command", () => {
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
    let message = new Message('Test message with two commands', commands);
    let rover = new Rover(98382);
    let response = rover.receiveMessage(message);

    let expectedResults = {
      'mode': 'LOW_POWER',
      'generatorWatts': 110,
      'position': 98382
    }

    expect(response.results[1].roverStatus).toEqual(expectedResults);
  })

  // Test 11
  it("responds correctly to the mode change command", () => {
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('MODE_CHANGE', 'NORMAL'), new Command('MODE_CHANGE', 'HIGH_POWER'), new Command('STATUS_CHECK')];
    let message = new Message('Test message with two commands', commands);
    let rover = new Rover(98382);
    let response = rover.receiveMessage(message);

    expect(response.results[0].completed).toBeTruthy();
    expect(response.results[1].completed).toBeTruthy();
    expect(response.results[2].completed).toBeFalsy();
  })

  // Test 12
  it("responds with a false completed value when attempting to move in LOW_POWER mode", () => {
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('MOVE', 98385), new Command('STATUS_CHECK')];
    let message = new Message('Test message with two commands', commands);
    let rover = new Rover(98382);
    let response = rover.receiveMessage(message);

    expect(response.results[1].completed).toBeFalsy();
    expect(response.results[2].roverStatus.position).toEqual(98382);
  })

  // Test 13
  it("responds with the position for the move command", () => {
    let commands = [new Command('MODE_CHANGE', 'NORMAL'), new Command('MOVE', 98385), new Command('STATUS_CHECK')];
    let message = new Message('Test message with two commands', commands);
    let rover = new Rover(98382);
    let response = rover.receiveMessage(message);

    expect(response.results[1].completed).toBeTruthy();
    expect(response.results[2].roverStatus.position).toEqual(98385);
  })

});
