
import es.upm.etsisi.cf4j.data.BenchmarkDataModels;
import es.upm.etsisi.cf4j.util.plot.LinePlot;
import es.upm.etsisi.cf4j.qualityMeasure.QualityMeasure;
import es.upm.etsisi.cf4j.qualityMeasure.prediction.MSE;
import es.upm.etsisi.cf4j.recommender.matrixFactorization.NMF;

import es.upm.etsisi.cf4j.data.DataModel;

import java.io.IOException;


public class CF4JExecutable {
  public static void main(String[] args) throws IOException {

    DataModel datamodel = BenchmarkDataModels.MovieLens100K();

    double[] regValues = { 0.000, 0.025, 0.05, 0.075, 0.100, 0.125, 0.150, 0.175, 0.200, 0.225, 0.250 };
    LinePlot plot = new LinePlot(regValues, "regularization", "MSE");

    plot.addSeries("NMF");


    for (double reg : regValues) {
      NMF nmf = new NMF(datamodel,6,50);
nmf.fit();



      QualityMeasure mse0 = new MSE(nmf);
double mseScore0 = mse0.getScore();



      plot.setValue("NMF", reg, mseScore0);

    }

    //plot.draw();
    //plot.printData("0.000");
    plot.exportPlot("client/static/diagrama.png");
  }
}