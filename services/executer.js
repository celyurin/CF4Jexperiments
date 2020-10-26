var exec = require('child_process').exec, child;

const executer = {
    runFile: () => {
        return new Promise((resolve, reject) => {
            exec("java -cp cf4j/cf4j-2.1.0.jar cf4j/CF4JExecutable.java", function (error, stdout, stderr) {
                if(stdout) {
                    //console.log('stdout: ' + stdout);
                }
                if (!stderr) {
                    //
                }
                if(error !== null){
                  console.log('exec error: ' + error);
                  
                }
                resolve(stdout? stdout : stderr);
            });
            console.log(resolve);
        });
    }
}

module.exports = executer;


