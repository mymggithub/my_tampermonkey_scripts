// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.w3schools.com/howto/*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant        none
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
	style="\
	body { \
		font-family: sans-serif; \
	} \
	#confirmBox{ \
		display: none; \
		background-color: #eee; \
		border-radius: 5px; \
		border: 1px solid #aaa; \
		position: fixed; \
		width: 300px; \
		left: 50%; \
		margin-left: -150px; \
		padding: 6px 8px 8px; \
		box-sizing: border-box; \
		text-align: center; \
	} \
	#confirmBox button { \
		background-color: #ccc; \
		display: inline-block; \
		border-radius: 3px; \
		border: 1px solid #aaa; \
		padding: 2px; \
		text-align: center; \
		width: 80px; \
		cursor: pointer; \
	} \
	#confirmBox button:hover { \
		background-color: #ddd; \
	} \
	#confirmBox .message { \
		text-align: left; \
		margin-bottom: 8px; \
	}";
(function() {
    'use strict';
    $("style").append(style);
})();
    $(".w3-code").on('click', function(event) {
        event.preventDefault();

		// doConfirm("Are you sure?", function yes(){alert("hi");}, function no(){});
        var filename = location.pathname.split("/");
        filename = filename[filename.length-1].replace("howto_","").replace(".asp","");
        var type = "";
        var addjs = "";
        var addcss = "";
        var htmlContent = $(this).html().replace(new RegExp('(<span class="[a-zA-Z]*" style="[a-zA-Z:]*">)|(</span>)|(&nbsp;)|(\n)|(\t)', 'g'), "").replace(new RegExp('<br>', 'g'), "\n").replace(new RegExp('&lt;', 'g'), "<").replace(new RegExp('&gt;', 'g'), ">").replace(new RegExp('&amp;', 'g'), "&").trim(" ");
        if ($(this).hasClass("jsHigh")) {type = "application/javascript";}
        if ($(this).hasClass("cssHigh")) {type = "text/css";}
        if ($(this).hasClass("htmlHigh")) {
        	type = "text/html";
        	if(!$(htmlContent).find("body").length){
        		if ($(".w3-code.jsHigh").length) {addjs="<script type='text/javascript' src='"+filename+".js'></script>";}
        		if ($(".w3-code.cssHigh").length) {addcss="<link rel='stylesheet' type='text/css' href='"+filename+".css'>";}
				html = "<!DOCTYPE html>\n<html lang='en'>\n<head>\n\t<meta charset='UTF-8'>\n\t<title>"+filename+"</title>\n\t"+addcss+"\n</head>\n<body>\n\t"+htmlContent+"\n\t"+addjs+"\n</body>\n</html>";
				htmlContent = html;
        	}
    	}
        download(htmlContent,filename,type);
        if(type == "text/html"){
	        $(".w3-code.cssHigh")[0].click();
	        $(".w3-code.jsHigh")[0].click();
        }
    });
function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}
function doConfirm(msg, yesFn, noFn){
	console.log($("#confirmBox").length);
    if(!$("#confirmBox").length){
		$("body").append("\
		<div id='confirmBox'> \
			<div class='message'></div> \
			<span class='yes'>Yes</span> \
			<span class='no'>No</span> \
		</div>");
    }
    var confirmBox = $("#confirmBox");
    confirmBox.find(".message").text(msg);
    confirmBox.find(".yes,.no").unbind().click(function()
    {
        confirmBox.hide();
    });
    confirmBox.find(".yes").click(yesFn);
    confirmBox.find(".no").click(noFn);
    confirmBox.show();
}