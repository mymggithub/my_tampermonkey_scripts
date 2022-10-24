// ==UserScript==
// @name         Binance
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  none
// @match        https://www.binance.com/trade.html*
// @grant        none
// ==/UserScript==

(function() {
	'use strict';
	var ws;
	var jsonArr = {};
	var myVar;
	if ("WebSocket" in window){
		ws = new WebSocket("wss://echo.websocket.org");
			ws.onopen = function(){
				myVar = setInterval(function(){ myTimer() }, 1000);
				ws.send("Message to send");
			};

			ws.onmessage = function (evt){
				var received_msg = evt.data;
				console.log(received_msg);
			};

			ws.onclose = function(){
			};

			window.onbeforeunload = function(event) {
				stopTimer();
				socket.close();
		   };
	}

	function myTimer() {
		jsonArr["name"] = jQuery(".productSymbol").text().trim().replace(/\r?\n|\r/g, "|").split("|")[0].replace(/\s/g,"").replace("/","_")
		jsonArr["timestamp"] = unixtimestamp();
		var rows=jQuery("h4.ng-binding");
		rows.each(function(index, el) {
			switch($(this).text()){
				case "Last Price":
					jsonArr["lastPrice"] = $(this).next().text();
					break;
				case "24h Change":
					jsonArr["change"] = $(this).next().text();
					break;
				case "24h High":
					jsonArr["high"] = $(this).next().text();
					break;
				case "24h Low":
					jsonArr["low"] = $(this).next().text();
					break;
				case "24h Volume":
					jsonArr["volume"] = $(this).next().text();
					break;
			}
		});
		var askArr = [];
		jQuery("tr[sly-repeat*='ask']").each(function(index, el) {
			var tmp = $(this).text().trim().replace(/\r?\n|\r/g, "|").split("|");
			var tmp2 = {};
			tmp2["price"] = tmp[0].trim();
			tmp2["amount"] = tmp[3].trim();
			tmp2["total"] = tmp[4].trim();
			askArr.push(tmp2);
		});
		jsonArr["ask"] = askArr;
		var bidArr = [];
		jQuery("tr[sly-repeat*='bid']").each(function(index, el) {
			var tmp = $(this).text().trim().replace(/\r?\n|\r/g, "|").split("|");
			var tmp2 = {};
			tmp2["price"] = tmp[0].trim();
			tmp2["amount"] = tmp[3].trim();
			tmp2["total"] = tmp[4].trim();
			bidArr.push(tmp2);
		});
		jsonArr["bid"] = bidArr;
		// console.log(jsonArr);
		// console.log(JSON.stringify(jsonArr));
		ws.send("Hi");
	}
	function stopTimer() {
		clearInterval(myVar);
	}
	function unixtimestamp() {
		return window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now();
	}
})();