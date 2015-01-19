/**
 * @license RequireJS text 2.0.13 Copyright (c) 2010-2014, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/requirejs/text for details
 */

/** @license
 * RequireJS plugin for loading JSON files
 * - depends on Text plugin and it was HEAVILY "inspired" by it as well.
 * Author: Miller Medeiros
 * Version: 0.4.0 (2014/04/10)
 * Released under the MIT license
 */

/*
 * @license requirejs - plugin - bower 0.0.1
 * Copyright(c) 2014, Rodney Robert Ebanks foss@rodneyebanks.com All Rights Reserved.
 * Available via the MIT or new BSD license.
 */

define("text",["module"],function(module){var text,fs,Cc,Ci,xpcIsWindows,progIds=["Msxml2.XMLHTTP","Microsoft.XMLHTTP","Msxml2.XMLHTTP.4.0"],xmlRegExp=/^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,bodyRegExp=/<body[^>]*>\s*([\s\S]+)\s*<\/body>/im,hasLocation=typeof location!="undefined"&&location.href,defaultProtocol=hasLocation&&location.protocol&&location.protocol.replace(/\:/,""),defaultHostName=hasLocation&&location.hostname,defaultPort=hasLocation&&(location.port||undefined),buildMap={},masterConfig=module.config&&module.config()||{};text={version:"2.0.13",strip:function(content){if(content){content=content.replace(xmlRegExp,"");var matches=content.match(bodyRegExp);matches&&(content=matches[1])}else content="";return content},jsEscape:function(content){return content.replace(/(['\\])/g,"\\$1").replace(/[\f]/g,"\\f").replace(/[\b]/g,"\\b").replace(/[\n]/g,"\\n").replace(/[\t]/g,"\\t").replace(/[\r]/g,"\\r").replace(/[\u2028]/g,"\\u2028").replace(/[\u2029]/g,"\\u2029")}
,createXhr:masterConfig.createXhr||function(){var xhr,i,progId;if(typeof XMLHttpRequest!="undefined")return new XMLHttpRequest;if(typeof ActiveXObject!="undefined")for(i=0;i<3;i+=1){progId=progIds[i];try{xhr=new ActiveXObject(progId)}catch(e){}if(xhr){progIds=[progId];break}}return xhr},parseName:function(name){var modName,ext,temp,strip=!1,index=name.lastIndexOf("."),isRelative=name.indexOf("./")===0||name.indexOf("../")===0;return index!==-1&&(!isRelative||index>1)?(modName=name.substring(0,index),ext=name.substring(index+1)):modName=name,temp=ext||modName,index=temp.indexOf("!"),index!==-1&&(strip=temp.substring(index+1)==="strip",temp=temp.substring(0,index),ext?ext=temp:modName=temp),{moduleName:modName,ext:ext,strip:strip}},xdRegExp:/^((\w+)\:)?\/\/([^\/\\]+)/,useXhr:function(url,protocol,hostname,port){var uProtocol,uHostName,uPort,match=text.xdRegExp.exec(url);return match?(uProtocol=match[2],uHostName=match[3],uHostName=uHostName.split(":"),uPort=uHostName[1],uHostName=uHostName
[0],(!uProtocol||uProtocol===protocol)&&(!uHostName||uHostName.toLowerCase()===hostname.toLowerCase())&&(!uPort&&!uHostName||uPort===port)):!0},finishLoad:function(name,strip,content,onLoad){content=strip?text.strip(content):content,masterConfig.isBuild&&(buildMap[name]=content),onLoad(content)},load:function(name,req,onLoad,config){if(config&&config.isBuild&&!config.inlineText){onLoad();return}masterConfig.isBuild=config&&config.isBuild;var parsed=text.parseName(name),nonStripName=parsed.moduleName+(parsed.ext?"."+parsed.ext:""),url=req.toUrl(nonStripName),useXhr=masterConfig.useXhr||text.useXhr;if(url.indexOf("empty:")===0){onLoad();return}!hasLocation||useXhr(url,defaultProtocol,defaultHostName,defaultPort)?text.get(url,function(content){text.finishLoad(name,parsed.strip,content,onLoad)},function(err){onLoad.error&&onLoad.error(err)}):req([nonStripName],function(content){text.finishLoad(parsed.moduleName+"."+parsed.ext,parsed.strip,content,onLoad)})},write:function(pluginName,moduleName
,write,config){if(buildMap.hasOwnProperty(moduleName)){var content=text.jsEscape(buildMap[moduleName]);write.asModule(pluginName+"!"+moduleName,"define(function () { return '"+content+"';});\n")}},writeFile:function(pluginName,moduleName,req,write,config){var parsed=text.parseName(moduleName),extPart=parsed.ext?"."+parsed.ext:"",nonStripName=parsed.moduleName+extPart,fileName=req.toUrl(parsed.moduleName+extPart)+".js";text.load(nonStripName,req,function(value){var textWrite=function(contents){return write(fileName,contents)};textWrite.asModule=function(moduleName,contents){return write.asModule(moduleName,fileName,contents)},text.write(pluginName,nonStripName,textWrite,config)},config)}};if(masterConfig.env==="node"||!masterConfig.env&&typeof process!="undefined"&&process.versions&&!!process.versions.node&&!process.versions["node-webkit"])fs=require.nodeRequire("fs"),text.get=function(url,callback,errback){try{var file=fs.readFileSync(url,"utf8");file[0]==="\ufeff"&&(file=file.substring
(1)),callback(file)}catch(e){errback&&errback(e)}};else if(masterConfig.env==="xhr"||!masterConfig.env&&text.createXhr())text.get=function(url,callback,errback,headers){var xhr=text.createXhr(),header;xhr.open("GET",url,!0);if(headers)for(header in headers)headers.hasOwnProperty(header)&&xhr.setRequestHeader(header.toLowerCase(),headers[header]);masterConfig.onXhr&&masterConfig.onXhr(xhr,url),xhr.onreadystatechange=function(evt){var status,err;xhr.readyState===4&&(status=xhr.status||0,status>399&&status<600?(err=new Error(url+" HTTP status: "+status),err.xhr=xhr,errback&&errback(err)):callback(xhr.responseText),masterConfig.onXhrComplete&&masterConfig.onXhrComplete(xhr,url))},xhr.send(null)};else if(masterConfig.env==="rhino"||!masterConfig.env&&typeof Packages!="undefined"&&typeof java!="undefined")text.get=function(url,callback){var stringBuffer,line,encoding="utf-8",file=new java.io.File(url),lineSeparator=java.lang.System.getProperty("line.separator"),input=new java.io.BufferedReader
(new java.io.InputStreamReader(new java.io.FileInputStream(file),encoding)),content="";try{stringBuffer=new java.lang.StringBuffer,line=input.readLine(),line&&line.length()&&line.charAt(0)===65279&&(line=line.substring(1)),line!==null&&stringBuffer.append(line);while((line=input.readLine())!==null)stringBuffer.append(lineSeparator),stringBuffer.append(line);content=String(stringBuffer.toString())}finally{input.close()}callback(content)};else if(masterConfig.env==="xpconnect"||!masterConfig.env&&typeof Components!="undefined"&&Components.classes&&Components.interfaces)Cc=Components.classes,Ci=Components.interfaces,Components.utils["import"]("resource://gre/modules/FileUtils.jsm"),xpcIsWindows="@mozilla.org/windows-registry-key;1"in Cc,text.get=function(url,callback){var inStream,convertStream,fileObj,readData={};xpcIsWindows&&(url=url.replace(/\//g,"\\")),fileObj=new FileUtils.File(url);try{inStream=Cc["@mozilla.org/network/file-input-stream;1"].createInstance(Ci.nsIFileInputStream),inStream
.init(fileObj,1,0,!1),convertStream=Cc["@mozilla.org/intl/converter-input-stream;1"].createInstance(Ci.nsIConverterInputStream),convertStream.init(inStream,"utf-8",inStream.available(),Ci.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER),convertStream.readString(inStream.available(),readData),convertStream.close(),inStream.close(),callback(readData.value)}catch(e){throw new Error((fileObj&&fileObj.path||"")+": "+e)}};return text}),define("json",["text"],function(text){var CACHE_BUST_QUERY_PARAM="bust",CACHE_BUST_FLAG="!bust",jsonParse=typeof JSON!="undefined"&&typeof JSON.parse=="function"?JSON.parse:function(val){return eval("("+val+")")},buildMap={};function cacheBust(url){return url=url.replace(CACHE_BUST_FLAG,""),url+=url.indexOf("?")<0?"?":"&",url+CACHE_BUST_QUERY_PARAM+"="+Math.round(2147483647*Math.random())}return{load:function(name,req,onLoad,config){config.isBuild&&(config.inlineJSON===!1||name.indexOf(CACHE_BUST_QUERY_PARAM+"=")!==-1)||req.toUrl(name).indexOf("empty:")===0?
onLoad(null):text.get(req.toUrl(name),function(data){config.isBuild?(buildMap[name]=data,onLoad(data)):onLoad(jsonParse(data))},onLoad.error,{accept:"application/json"})},normalize:function(name,normalize){return name.indexOf(CACHE_BUST_FLAG)!==-1&&(name=cacheBust(name)),normalize(name)},write:function(pluginName,moduleName,write){if(moduleName in buildMap){var content=buildMap[moduleName];write('define("'+pluginName+"!"+moduleName+'", function(){ return '+content+";});\n")}}}}),function(){define("bower",["module","json"],function(module,json){var defaults={file:"/bower.json",baseUrl:"../bower_components",extensions:"js|css",ignore:"requirejs|requirejs-domready|requirejs-text",auto:!0,deps:["dependencies"],optimistic:!0,rjsConfig:{paths:{},shim:{}}},request={parent:null,config:{}},bower={settings:{},json:{},config:{paths:{},shim:{}},processed:{}},bowerCounter=0,done,REGEX_PATH_RELATIVE=/^([^a-z|0-9]*)/,REGEX_PATH_SPLIT=/^(.*?)([^/\\]*?)(?:\.([^ :\\/.]*))?$/,REGEX_PATH_BOWER=/^(.*?bower.json)+(.*)$/
,requirejs=requirejs||require;function objectExtend(destination,source){return typeof source=="object"&&Object.keys(source).forEach(function(value){destination[value]=source[value]}),destination}function formatBowerFilePath(name){return name=bower.settings.baseUrl+"/"+name+"/bower.json",name}function processBowerFile(name,req,onProcess,config,root){var jsonFileName;req=req||request.parent,config=config||request.config,onProcess=onProcess||function(){},bowerCounter+=1,root&&(done=onProcess);function finished(bowerConfig){bowerCounter-=1,bowerCounter<1&&done&&done(bowerConfig)}request.config.isBuild?jsonFileName=name.replace(REGEX_PATH_RELATIVE,request.config.appDir):jsonFileName=name,bower.processed[name]!==!0?(bower.processed[name]=!0,json.load(jsonFileName,req,function(jsonFile){jsonFile?parseBowerFile(name,jsonFile,finished,root):onProcess(bower.config)},config)):finished(bower.config)}function parseBowerFile(bowerFilePath,bowerJson,onParse,root){var baseUrl,baseName,parseFilePath=new
RegExp(REGEX_PATH_SPLIT),parseRelativePath=new RegExp(REGEX_PATH_RELATIVE),validExt=new RegExp("^("+bower.settings.extensions+")$"),ignoreFile=new RegExp("^("+bower.settings.ignore+")$");bowerJson&&typeof bowerJson!="object"?bowerJson=JSON.parse(bowerJson):onParse(bower.config),bowerJson.main=[].concat(bowerJson.main||bowerFilePath),bower.settings.deps.forEach(function(depsPath){bowerJson[depsPath]=Object.keys(bowerJson[depsPath]||{})}),baseUrl=parseFilePath.exec(bowerFilePath)[1],baseName=bowerJson.name,bowerJson.main.forEach(function(moduleName){var name,file,path,ext,filePath=parseFilePath.exec(moduleName);name=bowerJson.name,path=filePath[1].replace(parseRelativePath,""),file=filePath[2],ext=filePath[3],validExt.test(ext)&&!ignoreFile.test(baseName)&&(file===name&&ext!=="js"?name=name+"-"+ext:file!==name&&bowerJson.main.length>1?name=file:name=name,bower.config.paths[name]=baseUrl+path+file,bower.config.shim[name]={},bower.config.shim[name].exports=name,bowerJson.dependencies.length>0&&
(bower.config.shim[name].deps=bowerJson.dependencies))}),bower.settings.deps.forEach(function(bowerDependencies){bowerJson[bowerDependencies]&&bowerJson[bowerDependencies].length>0&&bowerJson[bowerDependencies].forEach(function(dependency){ignoreFile.test(dependency)||processBowerFile(formatBowerFilePath(dependency))})}),onParse(bower.config)}function pluginLoad(name,req,onLoad,config){request.parent=req,request.config=config,bower.settings=defaults,bower.settings=objectExtend(bower.settings,request.config.bower||{}),bower.settings.file=name,processBowerFile(bower.settings.file,req,function(){bower.settings.auto&&!request.config.isBuild&&requirejs.config(bower.config),onLoad(bower.config)},config,!0),config&&config.isBuild&&onLoad(bower.config)}function pluginNormalize(name,normalize){var bowerPath=new RegExp(REGEX_PATH_BOWER),bowerFile=bowerPath.exec(name||bower.settings.file||defaults.file);return name=normalize(bowerFile[1]),name}function pluginWrite(pluginName,moduleName,write){var content=
JSON.stringify(bower.config);bower.settings.auto?content='define("'+pluginName+"!"+moduleName+'", function(){var bowerConfig='+content+";\nrequirejs.config(bowerConfig);\nreturn bowerConfig;\n});\n":content='define("'+pluginName+"!"+moduleName+'", function(){\nreturn '+content+";\n});\n",write(content)}return{load:pluginLoad,normalize:pluginNormalize,write:pluginWrite}})}(),define("bower!../bower.json",function(){var bowerConfig={paths:{bower:"../bower_components/requirejs-plugin-bower/dist/bower","bower-bundle":"../bower_components/requirejs-plugin-bower/dist/bower-bundle",async:"../bower_components/requirejs-plugins/src/async",depend:"../bower_components/requirejs-plugins/src/depend",font:"../bower_components/requirejs-plugins/src/font",goog:"../bower_components/requirejs-plugins/src/goog",image:"../bower_components/requirejs-plugins/src/image",json:"../bower_components/requirejs-plugins/src/json",mdown:"../bower_components/requirejs-plugins/src/mdown",noext:"../bower_components/requirejs-plugins/src/noext"
,propertyParser:"../bower_components/requirejs-plugins/src/propertyParser","Markdown.Converter":"../bower_components/requirejs-plugins/lib/Markdown.Converter",text:"../bower_components/requirejs-plugins/lib/text"},shim:{bower:{exports:"bower",deps:["requirejs-text","requirejs-plugins"]},"bower-bundle":{exports:"bower-bundle",deps:["requirejs-text","requirejs-plugins"]},async:{exports:"async"},depend:{exports:"depend"},font:{exports:"font"},goog:{exports:"goog"},image:{exports:"image"},json:{exports:"json"},mdown:{exports:"mdown"},noext:{exports:"noext"},propertyParser:{exports:"propertyParser"},"Markdown.Converter":{exports:"Markdown.Converter"},text:{exports:"text"}}};return requirejs.config(bowerConfig),bowerConfig}),define("auto",["bower!../bower.json"],function(bowerConfig){requirejs(["bootstrap"])});
