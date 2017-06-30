global.XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
module.exports = function(RED) {
  "use strict";
  const Rx = require('rxjs'),
        request = require('request'),
        cassandra = require('cassandra-driver'),
        http = require("http"),
        fs = require("fs");

    function saveOpenData(config) {
        RED.nodes.createNode(this, config);
        this.url = config.url;
        var node = this;

        node.on('input', function(msg) {

          const apiUrl = node.url + "&apikey=9d71b33b2911dba619c3eb5fd07c811ac452da6a29a7bab2a296ae71";

          Rx.Observable
            .ajax(node.url)
            .map(e => e.response.records)
            .subscribe(records => {

              records.forEach(function(record) {
                msg.payload = record;
                // data type
                msg.dataType = "";
                if(record.fields.coordonnees)
                  msg.dataType = "OPEN_DATA_WITH_LOCATION";
                else
                  msg.dataType = "OPEN_DATA_WITHOUT_LOCATION";

                node.send(msg);
              })
            });

        });
    }
    RED.nodes.registerType("opendata-realtime", saveOpenData);
}
