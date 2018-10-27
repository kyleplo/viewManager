var viewManager = {};
viewManager.views = {};
viewManager.currentView = "";
viewManager.defaultTitle = "";
viewManager.addViews = function (views){
 for(var i = 0;i < views.length;i++){
  viewManager.views[views[i].name] = views[i];
 }
}
viewManager.errorView = {};
viewManager.homeView = {};
viewManager.getData = function (url, real){
 var data = {};
 var dataList = [];
 var currentDataName = "";
 var scanning = false;
 var miscList = [];
 var currentMisc = "";
 for(var i = 0;i < url.length;i++){
  if(scanning && url[i].charCodeAt(0) > 96 && url[i].charCodeAt(0) < 123){
   currentDataName += url[i];
  }else if(url[i].charCodeAt(0) > 96 && url[i].charCodeAt(0) < 123){
   currentMisc += url[i];
  };
  if(url[i] === ":"){
   scanning = true;
   miscList.push(currentMisc);
   currentMisc = "";
  }
  if(url[i] === "/" && scanning && currentDataName.length > 0){
   scanning = false;
   dataList.push(currentDataName);
   currentDataName = "";
  }
 };
 if(currentDataName.length > 0){
  dataList.push(currentDataName);
 };
 if(currentMisc.length > 0){
  miscList.push(currentMisc);
 };
 var sections = real.split("/");
 var num = 0;
 for(var i = 0;i < sections.length;i++){
  if(sections[i].length > 1){
   if(miscList.indexOf(sections[i]) < 0){
    data[dataList[num]] = sections[i];
    num++;
   }
  }
 };
 return data;
}
viewManager.findViewForUrl = function (url){
 var viewList = Object.keys(viewManager.views);
 for(var i = 0;i < viewList.length;i++){
  var static = [];
  var urlStatic = [];
  var split = viewManager.views[viewList[i]].pattern.split("/");
  var urlSplit = url.split("/");
  for(var x = 0;x < split.length;x++){
   if(!split[x].startsWith(":")){
    static.push(split[x]);
    urlStatic.push(urlSplit[x]);
   };
  };
  if(static.join('') === urlStatic.join('')){
   return viewList[i];
  }
 };
 return "";
}
viewManager.loadView = function (path){
 var viewList = Object.keys(viewManager.views);
 for(var i = 0;i < viewList.length;i++){
  document.getElementById(viewManager.views[viewList[i]].element).setAttribute("hidden","hidden");
 }
 document.getElementById(viewManager.errorView.element).setAttribute("hidden","hidden");
 document.getElementById(viewManager.homeView.element).setAttribute("hidden","hidden");
 var view = viewManager.findViewForUrl(path);
 var thisView = {};
 if(viewManager.views[view]){
  thisView = viewManager.views[view];
 }else if(path === "" || path === "/"){
  thisView = viewManager.homeView;
 }else{
  thisView = viewManager.errorView;
 };
 var data = viewManager.getData(thisView.pattern, path);
 history.pushState(data, thisView.title, path);
 if(thisView.onViewLoad){
  thisView.onViewLoad(data);
 };
 document.title = thisView.name + " | " + viewManager.defaultTitle;
 viewManager.currentView = thisView.name;
 document.getElementById(thisView.element).removeAttribute("hidden");
}
viewManager.init = function (){
 viewManager.defaultTitle = document.title;
 var links = document.getElementsByTagName("a");
 for(var i = 0;i < links.length;i++){
  if(links[i].href.startsWith(location.protocol + "//" + location.hostname)){
   links[i].addEventListener("click",function (e){
    e.preventDefault();
    var link = new URL(e.target.href);
    viewManager.loadView(link.pathname);
   })
  }
 };
 viewManager.loadView("/");
}
window.addEventListener("popstate",function (e){
 viewManager.loadView(document.location);
})