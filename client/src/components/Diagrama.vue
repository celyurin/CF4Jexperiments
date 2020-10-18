<template>
  <div>
    <h1>this bitch</h1>
    <div class="tool-wrapper">
      <select class="selector" v-model="select1" id="select1" ref="select1" @change="addNode(1)">
        <option disabled value>Choose a dataset</option>
        <option>MovieLens100K</option>
      </select>
      <select class="selector" v-model="select2" id="select2" ref="select2" @change="addNode(2)">
        <option disabled value>Choose a recommender</option>
        <option>PMF</option>
        <option>HPF</option>
      </select>
      <select class="selector" v-model="select3" id="select3" ref="select3" @change="addNode(3)">
        <option disabled value>Choose a quality measure</option>
        <option>MSE</option>
        <option>MAE</option>
      </select>

      <button class="button" v-on:click="checkLinks()">RUN</button>
      <!--<button class="button" v-on:click="clear()">CLEAR</button>-->
    </div>
    <simple-flowchart :scene.sync="nodeData"></simple-flowchart>
  </div>
</template>

<script>
import axios from "axios";
import SimpleFlowchart from "vue-simple-flowchart";
import "vue-simple-flowchart/dist/vue-flowchart.css";

export default {
  data() {
    return {
      nodeData: {
        centerX: 1024,
        centerY: 140,
        scale: 1,
        nodes: [
          {
            id: 2,
            x: -700,
            y: -69,
            type: "Action",
            label: "test1"
          },
          {
            id: 4,
            x: -357,
            y: 80,
            type: "Script",
            label: "test2"
          },
          {
            id: 6,
            x: -557,
            y: 80,
            type: "Rule",
            label: "test3"
          }
        ],
        links: [
          {
            id: 3,
            from: 2, // node id the link start
            to: 4 // node id the link end
          }
        ]
      }
    };
  },
  components: {
    SimpleFlowchart
  },
  methods: {
    addNode(selectNumber) {
      //to redo
      var selNum = selectNumber;
      var selLabel;
      this.cont++;
      switch (selNum) {
        case 1:
          this.selNum = "DataSet";
          this.selLabel = this.$refs.select1.value;
          break;
        case 2:
          this.selNum = "Recommender";
          this.selLabel = this.$refs.select2.value;
          break;
        case 3:
          this.selNum = "Quality Measure";
          this.selLabel = this.$refs.select3.value;
          break;
      }
      this.nodeData.nodes.push({
        id: this.cont,
        x: -777,
        y: 90,
        type: this.selNum,
        label: this.selLabel
      });
    },
    checkLinks() {
      var diagramInfo = {
        info: "info"
      };
      //mandar algo al back
      axios
        .post("/api/task", diagramInfo)
        .then(res => {
          console.log(res);
          //this.loading = true;
          //alert("Successfully run!")
        })
        .catch(err => {
          console.log(err);
          alert("Wrong data, dear!");
        });
    }
  }
};
</script>

<style>
.button {
  border-radius: 3px;
  border: none;
  background-color: #f38d53;
  color: white;
  padding: 6px;
  font-weight: bold;
  transition: 0.3s;
  margin: 3px;
}

.button:hover {
  background-color: #cc703d;
}

.selector {
  border-radius: 5px;
  padding: 5px;
  border-color: #e2cabf;
  border-width: medium;
  margin: 3px;
}

.tool-wrapper {
  box-shadow: 0 8px 8px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.loader {
  opacity: 0.7;
  background: #fffcfc;
  width: 100%;
  height: 100%;
  z-index: 10;
  top: 0;
  left: 0;
  position: fixed;
}
</style>