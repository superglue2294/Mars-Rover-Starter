class Rover {
   // Write code here!
   constructor(position) {
      this.position = position;
      this.mode = 'NORMAL';
      this.generatorWatts = 110;
   }

   receiveMessage(message) {
      let messageToReturn = new Object;
      let results = new Array;

      for (let command of message.commands) {
         // this.mode = command.commandType;
         let commandType = command.commandType;
         let result = new Object;
         if (commandType === 'STATUS_CHECK') {
            result.completed = true;
            let status = new Object;
            status.mode = this.mode;
            status.generatorWatts = this.generatorWatts;
            status.position = this.position;
            result.roverStatus = status;
         } 
         
         if (commandType === 'MODE_CHANGE') {
            this.mode = command.value;
            result.completed = false;
            if (command.value === 'NORMAL' || command.value === 'LOW_POWER') {
               result.completed = true;
            }
         }

         if (commandType === 'MOVE') {
            if (this.mode === 'LOW_POWER') {
               result.completed = false;
            }

            if (this.mode === 'NORMAL') {
               result.completed = true;
               this.position = command.value;
            }
         }

         results.push(result);
      }

      messageToReturn["message"] = message.name;
      messageToReturn["results"] = results;

      return messageToReturn;
   }
}

module.exports = Rover;