var fs = require('fs');
var executer = require('../services/executer')

const writer = {

    createFile: async (body) => {
        //var regValues = body.regValues.split(',').map(Number);
        var regValues = body.regValues;
        //var dataset = body.diagrams[0].dataset;
        var qmeasure = body.diagrams[0].qmeasure;
        var imports = "";
        var addSeries = "";
        var defRecommenders = "";
        var defQMeasures = "";
        var setVal = "";
        let i;
        for (i = 0; i < body.diagrams.length; i++) {
            let recName = body.diagrams[i].recommender;

            imports += "import es.upm.etsisi.cf4j.recommender.matrixFactorization." + recName + ";\n";

            addSeries += "plot.addSeries(" + "\"" + recName + "\"" + ");\n";

            defRecommenders += recName + " " + recName.toLowerCase() + " = new " + recName + "(datamodel,"
                + body.diagrams[i].params + ");\n"
                + recName.toLowerCase() + ".fit();\n\n";

            defQMeasures += "QualityMeasure " + qmeasure.toLowerCase() + i + " = new " + qmeasure + "(" + recName.toLowerCase() +");\n"
                + "double mseScore" + i + " = " + qmeasure.toLowerCase() + i + ".getScore();\n\n";
            
            setVal += "plot.setValue(" + "\"" + recName + "\"" + ", rango, mseScore" + i + ");\n" 
        }

        fs.readFile('./cf4j/Skeleton.txt', { encoding: "utf-8" }, function (err, data) {
            if (err) {
                throw err;
            }

            var mapObj = {
                importQualityMeasure: "import es.upm.etsisi.cf4j.qualityMeasure.prediction." + qmeasure + ";",
                importRecommenders: imports,
                RangeValues: regValues,
                QuMeasure: qmeasure,
                addSeriesRecommenders: addSeries,
                definitionRecommenderModels: defRecommenders,
                definitionQMeasures: defQMeasures,
                setValues: setVal
            };
            data = data.replace(/importQualityMeasure|importRecommenders|RangeValues|QuMeasure|addSeriesRecommenders|definitionRecommenderModels|definitionQMeasures|setValues/gi, function (matched) {
                return mapObj[matched];
            });

            writer.writeFile(data);
            
        });
        let respuesta = await executer.runFile();
        console.log("respuesta executer.js");
        console.log(respuesta);
        return respuesta;
    },

    writeFile: (data) => {

        fs.writeFile('./cf4j/CF4JExecutable.java', data, function (err) {
            if (err) {
                throw err;
            }
            console.log("File created successfully");
        });
    }

}

module.exports = writer;