
import es.upm.etsisi.cf4j.data.BenchmarkDataModels;
import es.upm.etsisi.cf4j.util.plot.LinePlot;
import es.upm.etsisi.cf4j.qualityMeasure.QualityMeasure;
import es.upm.etsisi.cf4j.qualityMeasure.prediction.MSE;
import es.upm.etsisi.cf4j.recommender.matrixFactorization.PMF;

import es.upm.etsisi.cf4j.data.DataModel;

import java.io.IOException;


public class CF4JExecutable {
  public static void main(String[] args) throws IOException {

    DataModel datamodel = BenchmarkDataModels.MovieLens100K();

    int[] values = { 1,2,3,4,5,6,7 };
    LinePlot plot = new LinePlot(values, "", "MSE");

    plot.addSeries("PMF");


    for (int rango : values) {
      PMF pmf = new PMF(datamodel,rango, 50, 0.01);
pmf.fit();



      QualityMeasure mse0 = new MSE(pmf);
double score0 = mse0.getScore();



      plot.setValue("PMF", rango, score0);

    }

    //plot.draw();
    //plot.printData("0.000");
    plot.exportPlot("client/static/diagrama.png");
  }
}