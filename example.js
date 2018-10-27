viewManager.addViews([
 {name: "Page 1",element: "page1",pattern: "/page1",onViewLoad: function (){
  var d = new Date();
  document.getElementById("seconds").innerHTML = d.getSeconds();
 }},
 {name: "Page 2",element: "page2",pattern: "/page2"},
 {name: "User",element: "user",pattern: "/users/:user",onViewLoad: function (data){
  document.getElementById("username").innerHTML = data.user;
  document.title = data.user;
 }}
]);
viewManager.errorView = {name: "Error 404",element: "error", pattern: "/error"}
viewManager.homeView = {name: "Home",element: "home", pattern: "/"}

viewManager.init();