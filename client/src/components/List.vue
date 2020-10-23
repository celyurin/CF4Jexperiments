<template>
  <div class="contenedor">
    <p style="text-align: left;
    padding-left: 2rem;">
      <span style="font-size:20px">※</span> Introduce los valores de regularización y los parámetros de los recomendadores separados por comas
    </p>
    <!--<button v-on:click="checkLists()">(Temp) Chequear lista de nodos y links</button>-->
    <img v-if="loading" class="loader" src="../assets/loader.gif" />
    <button class="up-button" v-on:click="clearAll()">CLEAR</button>
    <button class="up-button" v-on:click="checkLinks()">RUN</button>
    <span style="margin-left:15px">Introduce reg. values:</span>
    <input class="reg-input" v-model="reg_input" type="text" placeholder="Reg. values" />
    <div class="side-menu">
      <!--datasets-->
      <button class="dropdown-btn">DATASETS</button>
      <div class="dropdown-content">
        <div id="movielens100k" v-on:click="addNode('MovieLens', '100k', 1)" class="mock-node">
          <div class="mock-node-type">DataSet</div>MovieLens
          <br />100k
        </div>
      </div>
      <!--recommenders-->
      <button class="dropdown-btn">ALGORITHMS</button>
      <div class="dropdown-content">
        <div id="pmf" v-on:click="getValue('PMF', 2)" class="mock-node">
          <div class="mock-node-type">Recom.</div>PMF
          <input
            class="number-input"
            v-on:click.stop
            v-model="pmf_input"
            type="text"
            placeholder="Param."
          />
        </div>
        <div id="nmf" v-on:click="getValue('NMF', 2)" class="mock-node">
          <div class="mock-node-type">Recom.</div>NMF
          <input
            class="number-input"
            v-on:click.stop
            v-model="nmf_input"
            type="text"
            placeholder="Param."
          />
        </div>
        <div id="hpf" v-on:click="getValue('HPF', 2)" class="mock-node">
          <div class="mock-node-type">Recom.</div>HPF
          <input
            class="number-input"
            v-on:click.stop
            v-model="hpf_input"
            type="text"
            placeholder="Param."
          />
        </div>
        <div id="bnmf" v-on:click="getValue('BNMF', 2)" class="mock-node">
          <div class="mock-node-type">Recom.</div>BNMF
          <input
            class="number-input"
            v-on:click.stop
            v-model="bnmf_input"
            type="text"
            placeholder="Param."
          />
        </div>
      </div>
      <!--qmeasures-->
      <button class="dropdown-btn">QUALITY MEASURES</button>
      <div class="dropdown-content">
        <div id="mae" v-on:click="checkQMeasures('MAE', '', 3)" class="mock-node">
          <div class="mock-node-type">Q.Measure</div>MAE
        </div>
        <div id="mse" v-on:click="checkQMeasures('MSE', '', 3)" class="mock-node">
          <div class="mock-node-type">Q.Measure</div>MSE
        </div>
        <div id="mse" v-on:click="checkQMeasures('RMSE', '', 3)" class="mock-node">
          <div class="mock-node-type">Q.Measure</div>RMSE
        </div>
        <div id="mse" v-on:click="checkQMeasures('MSLE', '', 3)" class="mock-node">
          <div class="mock-node-type">Q.Measure</div>MSLE
        </div>
      </div>
    </div>
    <div class="editor-container">
      <simple-flowchart :scene.sync="nodeData"></simple-flowchart>
    </div>
    <!--modal para mostrarl el resultado-->
    <div v-if="grafica">
      <transition name="modal">
        <div class="modal-mask" v-on:click="closeModal()">
          <div class="modal-wrapper">
            <div
              id="modal"
              class="modal-contents"
              v-on:click.stop
              @input="fakeVmodel"
              v-html="imagen"
              contenteditable="true"
            >
              <!--<h1 class="closing-cross" v-on:click="closeModal()">×</h1>
              <img :src="imageSRC" />-->
            </div>
          </div>
        </div>
      </transition>
    </div>
    <div v-if="loading" class="loader-mask"></div>
  </div>
</template>

<script>
import axios from "axios";
//flowchart
import SimpleFlowchart from "vue-simple-flowchart";
import "vue-simple-flowchart/dist/vue-flowchart.css";

export default {
  data() {
    return {
      todos: [],
      id: "",
      taskname: "",
      isEdit: false,
      pmf_input: "",
      nmf_input: "",
      hpf_input: "",
      bnmf_input: "",
      reg_input: "",
      cont: 0,
      nodeData: {
        centerX: 1024,
        centerY: 140,
        scale: 1,
        nodes: [],
        links: []
      },
      diagramas: [],
      medidaExists: false,
      grafica: false,
      //imageSRC: require('../../../diagrama.png'),
      imageSRC: "",
      loading: false,
      imagen: "",
      fakeVmodel: ''
    };
  },
  components: {
    SimpleFlowchart
  },
  mounted() {},
  methods: {
    clearAll() {
      this.nodeData.nodes = [];
      this.nodeData.links = [];
      this.cont = 0;
      this.diagramas = [];
    },
    closeModal() {
      this.grafica = false;
      /*axios
        .get("/api/image")
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });*/
    },
    checkLists() {
      console.log(this.nodeData.nodes);
      console.log(this.nodeData.links);
      console.log(this.nodeData.nodes.length);
    },
    checkLinks() {
      this.diagramas = [];
      console.log("links!");
      //si el 'to' es un nodo de dataset, block
      let i;
      for (i = 0; i < this.nodeData.links.length; i++) {
        let too = this.nodeData.links[i].to;
        let indice1 = too.toString()[0];
        console.log(indice1);
        if (indice1 == "1") {
          alert("Un dataset no puede ser tener input");
        }
      }

      //si el 'from' es un nodo de medida de calidad, block
      let j;
      for (j = 0; j < this.nodeData.links.length; j++) {
        let fromm = this.nodeData.links[j].from;
        let indice2 = fromm.toString()[0];
        console.log(indice2);
        if (indice2 == "3") {
          alert("Una medida de calidad no puede tener output");
        }
      }

      //si el 'from' es un dataset y el 'to' es medida de calidad, blocl
      let k;
      for (k = 0; k < this.nodeData.links.length; k++) {
        let desde = this.nodeData.links[k].from;
        let indiceF = desde.toString()[0];
        let hasta = this.nodeData.links[k].to;
        let indiceT = hasta.toString()[0];
        if (indiceF == "1" && indiceT == "3") {
          alert("Es necesario añadir un recomendador entre el dataset y la medida de calidad");
        }
      }

      this.createWorkFlows();
      console.log("diagramas");
      console.log(this.diagramas);
      this.runDiagram();
    },
    createWorkFlows() {
      let i;
      for (i = 0; i < this.nodeData.links.length; i++) {
        let hasta = this.nodeData.links[i].to;
        let indiceT = hasta.toString()[0];
        //cogemos el último nodo del diagrama y recorremos "hacia arriba" para ver a qué algoritmos está enganchado
        if (indiceT == "3") {
          let desde = this.nodeData.links[i].from;
          //buscar ambos nodos en la lista de nodos y recuperar su type
          let recommenderType = this.search(desde)[0];
          let recommenderParams = this.search(desde)[1];
          let qmeasureType = this.search(hasta)[0];
          this.diagramas.push({
            id: i,
            dataset: "movielens100k",
            recommender: recommenderType,
            params: recommenderParams,
            qmeasure: qmeasureType
          });
        }
      }
    },
    search(nodeId) {
      //buscamos por el identificador entre la lista de nodos para sacar el type
      let j;
      for (j = 0; j < this.nodeData.nodes.length; j++) {
        if (this.nodeData.nodes[j].id == nodeId) {
          return [this.nodeData.nodes[j].type, this.nodeData.nodes[j].label];
        }
      }
    },
    checkQMeasures(name, numb, ide) {
      this.medidaExists = false;
      if (this.nodeData.nodes.length != 0) {
        let i;
        for (i = 0; i < this.nodeData.nodes.length; i++) {
          let ident = this.nodeData.nodes[i].id;
          let idt = ident.toString()[0];
          //si ya existe una medida de calidad, no se pueden añadir más
          if (idt == "3") {
            this.medidaExists = true;
          }
        }
        if (this.medidaExists) {
          alert("Sólo puedes incluir una medida de calidad");
        } else {
          this.addNode(name, numb, ide);
        }
      } else {
        this.addNode(name, numb, ide);
      }
    },
    addNode(name, numb, id) {
      this.cont++;
      let ident = parseInt("" + id + this.cont);
      this.nodeData.nodes.push({
        id: ident,
        x: -900,
        y: -69,
        type: name,
        label: numb
      });
      this.medidaExists = false;
    },
    getValue(type, id) {
      //mira si se han introducido valores en el input y si no, saca un alert
      let number = this.pmf_input || this.nmf_input || this.hpf_input || this.bnmf_input;
      if (number == "") {
        alert(
          "Tienes que introducir los valores de los parámetros antes de incluir este nodo"
        );
      } else {
        this.addNode(type, number, id);
        this.pmf_input = "";
        this.nmf_input = "";
        this.hpf_input = "";
        this.bnmf_input = "";
      }
    },
    async runDiagram() {
      if (this.reg_input == "") {
        alert("Tienes que introducir los valores de regularización");
      } else {
        let reqBody = {
          regValues: this.reg_input,
          diagrams: this.diagramas
        };
        console.log(reqBody);
        this.loading = true;
        //await
        await axios
          .post("/api/task", reqBody)
          .then(res => {
            console.log(res);
          })
          .catch(err => {
            console.log(err);
          });
        //mostramos un modal con la gráfica resultado
        this.showPlot();
      }
    },
    showPlot() {
      this.loading = false;
      this.grafica = true;
      this.imagen += '<h1 class="closing-cross" v-on:click="closeModal()">×</h1><img src="static/diagrama.png">';
    }
 
  }
};
</script>

<style>
.contenedor {
  overflow: hidden;
  margin-top: 2.2rem;
}

.side-menu {
  border-color: #ececec;
  width: 14rem;
  float: left;
  border-right: 1px solid #dcdcdc8a;
  height: 100%;
  overflow-y: hidden;
  overflow-x: hidden;
  /*box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.1);*/
}

.editor-container {
  border-color: beige;
  overflow: hidden;
}

.mock-node {
  background: #ece2cf;
  box-shadow: 0 0 0 2px #f85;
  border: none;
  border-radius: 5px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  height: 80px;
  margin-left: auto;
  margin-right: auto;
  opacity: 0.9;
  position: relative;
  -webkit-transform-origin: top left;
  transform-origin: top left;
  width: 80px;
  z-index: 1;
  margin-bottom: 1rem;
  cursor: pointer;
  font-size: 13px;
}

.mock-node-type {
  background: #f85;
  color: #fff;
  font-size: 13px;
  padding: 6px;
}

.dropdown-content {
  margin: 0 10px 30px 10px;
  padding-top: 1rem;
  border-top: 1px solid #eeeeee;
}

.dropdown-btn {
  width: inherit;
  border: none;
  padding: 0.3rem;
  text-align: center;
  font-family: revert;
  font-weight: 600;
  background-color: #ffffff00;
  color: #545353;
  font-size: 0.9rem;
}

.number-input {
  width: 4rem;
  border-color: #8080807a;
  border-style: solid;
  border-width: 1px;
  border-radius: 3px;
}

.reg-input {
  border-color: #8080807a;
  border-style: solid;
  border-width: 1px;
  border-radius: 3px;
  margin-left: 15px;
}

.up-button {
  font-family: revert;
  border: none;
  padding: 5px 30px;
  color: #545353;
  background-color: white;
  font-weight: 600;
  transition: 0.3s;
  border-right: 1px solid gainsboro;
}

.up-button:hover {
  color: #f85;
}

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-contents {
  background-color: #f9f4eb;
  width: fit-content;
  margin: auto;
  padding: 2rem;
  border-radius: 10px;
}

.closing-cross {
  color: #545353;
  text-align: right;
  cursor: pointer;
}

.loader {
  height: 50px;
  width: auto;
}

.loader-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(255 255 255 / 53%);
  display: table;
  -webkit-transition: opacity 0.3s ease;
  transition: opacity 0.3s ease;
}
</style>






