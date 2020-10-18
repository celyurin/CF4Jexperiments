var exec = require('child_process').exec, child;

const executer = {
    runFile: () => {
        exec("java -cp cf4j/cf4j-2.1.0.jar cf4j/CF4JExecutable.java", function (error, stdout, stderr) {
            if(stdout) {
                console.log('stdout: ' + stdout);
                resp = stdout
            }
            console.log('stderr: ' + stderr);
            //send trigger to hide the loading page
            if (!stderr) {
                const resp = "ok"
                return resp
            }
            if(error !== null){
              console.log('exec error: ' + error);
            }
        });
         
    }
}

module.exports = executer;
