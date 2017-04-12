/**
 * Created by mgram on 2017-04-12.
 */
function getScript(files, callback) {
    files = (files.constructor == Array) ? files : [files];
    for (var i=0, len=files.length; i<len; i++) {
        var fileref = document.createElement("script");
        fileref.setAttribute("type", "text/javascript");
        fileref.setAttribute("src", files[i]);
        document.getElementsByTagName("head")[0].appendChild(fileref);
        if(callback){
            fileref.addEventListener("load", callback);
        }
        //document.writeln('<scri' + 'pt src="' + files[i] + '" type="text/javascript"></sc' + 'ript>');
    }
}