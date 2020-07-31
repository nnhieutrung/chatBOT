const fs = require("fs");
const login = require("facebook-chat-api");
const readline = require("readline");
const config = require("./config.json");

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const obj = {email: config.email, password: config.password};
login(obj, (err, api) => {
    if(err) {
        switch (err.error) {
            case 'login-approval':
                console.log('Enter code > ');
                rl.on('line', (line) => {
                    err.continue(line);
                    rl.close();
                });
                break;
            default:
                console.error(err);
        }
        return;
    }

	// Logged in!
	fs.writeFileSync('appstate.json', JSON.stringify(api.getAppState()));
});