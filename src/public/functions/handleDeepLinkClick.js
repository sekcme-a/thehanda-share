// exp://172.30.1.11:19000/--/post/miraero/YUROmFV3sOatJeHloYt9/program`,
// com.zzsoft.thehanda://post/miraero/YUROmFV3sOatJeHloYt9/program`,

export const DEEPLINK = {

  push: (deeplink, playstoreUrl, appstoreUrl) => {

    var userAgent = navigator.userAgent;
    var visitedAt = (new Date()).getTime();

    if(userAgent.match(/iPhone|iPad|iPod/)){

      try{
        location.href = deeplink
      }catch(e){
        alert(e)
      }

      setTimeout(()=> {
        if(location.href!==deeplink) location.href = appstoreUrl
      },500)



    } else {
      exeDeepLink();
      checkInstallApp();
    }
  
    function checkInstallApp() {
      function clearTimers() {
        clearInterval(check);
        clearTimeout(timer);
      }
  
      function isHideWeb() {
        if (document.webkitHidden || document.hidden) {
          clearTimers();
        }
      }
      const check = setInterval(isHideWeb, 200);
  
      const timer = setTimeout(function () {
        redirectStore();
      }, 1000);
    }
  
    const redirectStore = () => {
      const ua = navigator.userAgent.toLowerCase();

      location.href =
        ua.indexOf("android") > -1
          ? playstoreUrl
          : appstoreUrl;


    };
  
    function exeDeepLink() {
      const url = deeplink;
      location.href = url;
    }
  }

}