/*\

title: $:/plugins/felixhayashi/tiddlymap/startup/listener.js
type: application/javascript
module-type: startup

@module TiddlyMap
@preserve

\*/
(function(){"use strict";exports.name="tmap.listener";exports.platforms=["browser"];exports.after=["rootwidget","tmap.caretaker"];exports.before=["story"];exports.synchronous=true;var e=require("$:/plugins/felixhayashi/tiddlymap/utils.js").utils;var t=require("$:/plugins/felixhayashi/tiddlymap/edgetype.js").EdgeType;var a=function(){this.adapter=$tw.tmap.adapter;this.wiki=$tw.wiki;this.logger=$tw.tmap.logger;this.opt=$tw.tmap.opt;e.addListeners({"tmap:tm-remove-edge":this.handleRemoveEdge,"tmap:tm-fill-edge-type-form":this.handleFillEdgeTypeForm,"tmap:tm-save-edge-type-form":this.handleSaveEdgeTypeForm,"tmap:tm-create-edge-type":this.handleCreateEdgeType,"tmap:tm-create-edge":this.handleCreateEdge,"tmap:tm-suppress-dialog":this.handleSuppressDialog,"tmap:tm-generate-widget":this.handleGenerateWidget,"tmap:tm-download-graph":this.handleDownloadGraph,"tmap:tm-manage-edge-types":this.handleManageEdgeTypes,"tmap:tm-cancel-dialog":this.handleCancelDialog,"tmap:tm-confirm-dialog":this.handleConfirmDialog},$tw.rootWidget,this)};a.prototype.handleCancelDialog=function(t){e.setField(t.param,"text","")};a.prototype.handleConfirmDialog=function(t){e.setField(t.param,"text","1")};a.prototype.handleManageEdgeTypes=function(e){if(!e.paramObject)e.paramObject={};var t={param:{filter:this.opt.selector.allEdgeTypesByLabel+" +[search:title{$:/temp/tmap/edgeTypeSearch}]"+" +[sort[title]]"},dialog:{buttons:"edge_type_manager"}};var a=$tw.tmap.dialogManager.open("edgeTypeManager",t);var p=e.paramObject.type;if(p){this.handleFillEdgeTypeForm({paramObject:{id:p,output:a.fields["output"]}})}};a.prototype.handleSuppressDialog=function(t){if(e.isTrue(t.paramObject.suppress,false)){e.setEntry(this.opt.ref.sysUserConf,"suppressedDialogs."+t.paramObject.dialog,true)}};a.prototype.handleDownloadGraph=function(t){var a=this.adapter.getGraph({view:t.paramObject.view});a.nodes=e.convert(a.nodes,"array");a.edges=e.convert(a.edges,"array");e.setField("$:/temp/tmap/export","text",JSON.stringify(a,null,2));$tw.rootWidget.dispatchEvent({type:"tm-download-file",param:"$:/temp/tmap/export",paramObject:{filename:t.paramObject.view+".json"}})};a.prototype.handleGenerateWidget=function(e){if(!e.paramObject)e.paramObject={};var t={dialog:{buttons:"ok",preselects:{view:e.paramObject.view||"Default"}}};$tw.tmap.dialogManager.open("getWidgetCode",t)};a.prototype.handleRemoveEdge=function(e){this.adapter.deleteEdge(e.paramObject)};a.prototype.handleCreateEdge=function(e){var t={from:this.adapter.makeNode(e.paramObject.from).id,to:this.adapter.makeNode(e.paramObject.to).id,type:e.paramObject.label};this.adapter.insertEdge(t);$tw.tmap.notify("Edge inserted")};a.prototype.handleSaveEdgeTypeForm=function(a){var p=e.getTiddler(a.paramObject.output);var r=new t(p.fields.id);if(e.isTrue(p.fields["temp.deleteType"],false)){this.logger("debug","Deleting type",r);this.adapter._processEdgesWithType(r,{action:"delete"});this.wiki.addTiddler(new $tw.Tiddler({title:a.paramObject.output}));$tw.tmap.notify("Deleted type")}else{r.loadDataFromTiddler(p);r.persist();if(!p.fields["temp.newId"]){e.setField(p,"temp.newId",p.fields["id"])}else if(p.fields["temp.newId"]!==p.fields["id"]){this.adapter._processEdgesWithType(r,{action:"rename",newName:p.fields["temp.newId"]});e.setField(p,"id",p.fields["temp.newId"])}$tw.tmap.notify("Saved type data")}};a.prototype.handleFillEdgeTypeForm=function(a){var p=new t(a.paramObject.id);var r=a.paramObject.output;var i=this.adapter.selectEdgesByType(p);p.persist(r,true);var d=e.startsWith(p.getId(),"tmap:")?"true":"";e.setField(r,"temp.idImmutable",d);e.setField(r,"temp.newId",p.getId());e.setField(r,"temp.usageCount",Object.keys(i).length);e.deleteByPrefix("$:/state/tabs/edgeTypeManager")};a.prototype.handleCreateEdgeType=function(a){var p=this.wiki.generateNewTitle(this.opt.path.edgeTypes+"/New Type");var r=new t(e.getBasename(p));r.persist();this.handleFillEdgeTypeForm({paramObject:{id:r.getId(),output:a.paramObject.output}})};exports.startup=function(){new a}})();