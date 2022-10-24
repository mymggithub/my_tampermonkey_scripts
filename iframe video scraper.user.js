// ==UserScript==
// @name         iframe video scraper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  if
// @author       You
// @match        *://www.watchcartoononline.io/*
// @grant        none
// @require http://code.jquery.com/jquery-3.3.1.min.js
// ==/UserScript==

function myFunction() {
  var copyText = document.getElementById("myInput");
  copyText.select();
  document.execCommand("copy");
  // alert("Copied the text: " + copyText.value);
}
(function() {
    'use strict';

    if (sessionStorage.getItem("stop")==undefined) {
		if (window.top === window.self) {
		    setInterval(function(){
		    	if (sessionStorage.getItem("change")==1) {

		    		sessionStorage.setItem("change",0)
		    		if (undefined!=$("a[rel='next']")[0]){
			    		$("a[rel='next']")[0].click()
		    		}else{
		    			sessionStorage.setItem("stop",1)
		    		}
		    	}
		    }, 3000);
		}
		else {
			if (undefined!=sessionStorage.getItem("src")) {
				sessionStorage.setItem("src", sessionStorage.getItem("src")+"\n"+$("video source")[0].src);
			}else{
				sessionStorage.setItem("src", $("video source")[0].src);
			}
			sessionStorage.setItem("change",1)
		}
    }else{

		$("body").append('<textarea rows="4" cols="50" id="myInput"></textarea>')
		$("body").append('<button onclick="myFunction()">Copy text</button>')
		$("textarea#myInput").text(sessionStorage.getItem("src"))
		$("textarea#myInput").next()[0].click()
		// $("textarea#myInput").next().remove()
		// $("textarea#myInput").remove()

    }
})();



