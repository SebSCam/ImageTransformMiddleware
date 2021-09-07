const express = require("express");
const app = express();
const path = require('path');
const exec = require('child-process-async').exec;
const fs = require('fs');
const cors = require('cors');
const mail = require('./lib/mail');
const axios = require('axios');

//Queue
const Queue = require('./lib/queue');
const serviceQueue = new Queue();

//Server List
const server_list = [];
let ip_host_id = 140;
let serving_index = 0;

//Set App
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.set("port", process.env.PORT || 3000);

app.get("/create_instance", (req, res) => {
  generateInstanceNetwork();
});

function generateInstanceNetwork() {
  let ip = "192.168.100.";
  ip += ip_host_id;
  ip_host_id++;
  server_list.push(ip);
  createVM(ip, server_list.indexOf(ip));
}

function createVM(ip, id) {
        fs.mkdir('./src/resources/vm/' + id, err => { 
            if (err && err.code != 'EEXIST') throw 'up'
            fs.writeFile(
              './src/resources/vm/' + id + '/Vagrantfile',
              'Vagrant.configure("2") do |config|\n'+
              'config.vm.box = "matjung/nodejs14"\n'+
              'config.vm.network "public_network", ip: "'+ ip +'"'+
              '\nconfig.vm.provision "shell", inline: <<-SHELL'+
              '\n apt-get update\n apt-get upgrades'+
              '\n git clone '+
              '\n cd Repositiorio'+
              '\n sudo npm i'+
              '\n sudo npm i -g pm2'+
              '\n pm2 start index.js'+
              '\nSHELL'+
              '\nend',
              function (err) {
                if (err) {
                  return console.log(err);
                }
                console.log('el archivo fue creado correctamente');
              }
              );
            })
        exec('cd src/resources/vm/'+ ip +'&& vagrant up --provision');
}

app.post('/image',(req, res)=>{
  assignServer(req, res);
})

function assignServer(req, res){
  if (serving_index > 3) {
    serving_index = 0
  }else{
    axios.post('http://'+ server_list[serving_index++] + ':3002', req)
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      mail.serverFailed(server_list[i]);
    });
  }
}

app.set("resources", path.join(__dirname, "resources"));

//Launch App
app.listen(app.get("port"), () => {
  console.log("Middleware running on http://localhost:3000");
});