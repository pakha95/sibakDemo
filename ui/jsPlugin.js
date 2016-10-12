
function hideElement(id)
{
 var element = document.getElementById(id);
 if (element)
    element.style.display='none';
}// id 속성으로 찾아서 숨기기
 function hideElement(id)
 {
  var element = document.getElementById(id);
  if (element)
     element.style.display='none';
 }

 // class 속성으로 찾아서 숨기기
 function hideElementByClass(className)
 {
    var tags=document.getElementsByClassName(className);

  for (var i = 0; i < tags.length; ++i) {
     var element = tags[i];
     element.style.display='none';
    }
 }
 // TAG 이름으로 찾아서 숨기기
 function hideElementByTag(tagName)
 {
    var tags=document.getElementsByTagName(tagName);

  for (var i = 0; i < tags.length; ++i) {
     var element = tags[i];
     element.style.display='none';
    }
 }

 function titleChange(className){
   //var element = document.getElementsByClassName(className);
    //element.setAttribute("onclick", "agate.runAction('function.root.main.billCancel()')");
    //element.setAttribute("onclick", "location.replace('http://m.timemuseum.net/mtime_my_cubic_charge.php");

   // var metaTag=document.createElement('meta');
   // metaTag.http-equiv = "Content-Type";
   // metaTag.content = "text/html; charset=utf-8"
   // document.getElementsByTagName('head')[0].appendChild(metaTag);
    var tags=document.getElementsByClassName(className);
        for (var i = 0; i < tags.length; ++i) {
        var element = tags[i];
        element.innerHTML = "<strong>큐빅결제</strong>";
       }
 }

function linkChange(className)
{
   var tags=document.getElementsByClassName(className);
    //for (var i = 0; i < tags.length; ++i) {
    if(tags[0] ||tags[0] != null) {
            var element = tags[0];
            element.setAttribute("href", "");
            element.setAttribute("onclick", "agate.runAction('function.menuWindowPopup')");
    //var img = imgs[i];
    }



}

//billCancel();
//titleChange('pname');
//titleChange('chbData');
try {
    hideElementByClass('btn_cancel_grey');
    hideElementByClass('btn_grey_s');
    linkChange('btnLeftMenu');
} catch(e) {
	alert(e);
}
//$('.btn_cancel_grey').attr("style","display:none");
//$("meta[http-equiv='Content-Type']").attr("content", "text/html; charset=utf-8");

//hideElement('pc_ver');
//document.charset='utf-8';