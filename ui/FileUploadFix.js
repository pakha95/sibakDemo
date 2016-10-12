/*
	Android File Upload Fix ver. 1.2.0  (Agate Java Script Plugin)
	(Fixes the issue that <input type="file"> does not work on Android 4.4.2. )

	Last modified on 2015.06.30

	Created by ApplusForm.com on 2014.10.30
	Permission is granted to copy, distribute, modify under the terms of ApplusForm License.
	Copyright (C) 2014 ApplusForm.com. All rights reserved.
*/
//상황에 따른 메세지 변경할것
var fixAFU_buttonInnerHTML = "사진 추가";
var fixAFU_fileNameInnerHTML = "선택한 사진 없음";
var fixAFU_uploadStartMessage = "사진 업로드 중...";
var fixAFU_chooseFileForUploadMessage = "업로드할 사진 위치";

// 4. 기본 submit함수를 교체하는 부분. 업로드 방식이 다를경우 수정할것.
function fixAFU_replaceFormSubmit(form) {
    if (form.submit != fixAFU_submit) {
        form.submit = fixAFU_submit;

        if (form.onsubmit == null) {// javascript 없이 순수 HTML로만 이루어진 경우
            form.onsubmit = function (e) {
                //alert("submit");
                this.submit();
                e.preventDefault();
                return false;
            };
        } else if (form.onsubmit != null) {// onsubmit 을 핸들링하여 form.submit을 호출하거나 return true 한 경우 << 이거사용중
            form.__oldOnsubmit = form.onsubmit;
            form.onsubmit = function (e) {
                //alert("onsubmit");
                var ret = form.__oldOnsubmit(e);
                if (ret != false && !e.defaultPrevented) {

                    this.submit();
                }
                e.preventDefault();
                return false;
            };
        }
    }
}


function fixAFU_escapeFunctionScript(text) {
    text = text.replace(/\\/gm, "\\\\");
    text = text.replace(/\n/gm, "\\n");
    text = text.replace(/\r/gm, "\\r");
    text = text.replace(/'/gm, "\\'");

    return text;
}

function fixAFU_onCompleteFileUpload(args) {
    if (args.responseCode == 200) {
        //6. 파일 전송이 끝나면 결과를 웹뷰에 표시함. 상황에 따라 다른 페이지로 이동하도록 할 수 있음.
        //document.getElementsByTagName("html")[0].innerHTML = args.responseValue;
        document.location.reload();
        //agate.runScript("caller.setHtml('" + fixAFU_escapeFunctionScript(args.responseValue) + "', '" + fixAFU_lastAction + "')");

    } else {
        alert("error: " + args.responseCode + "\n" + args.errorMessage + "\n" + args.responseValue);
    }
}
//5. 다른 <INPUT 의 name 과 value 도 파일과 함께 전송
function fixAFU_submit() {
    try {

        var formTags = new Array();
        var i;

        {
            var inputTags = this.getElementsByTagName("input");
            //var selectTags = this.getElementsByTagName("select");
            //var textAreaTags = this.getElementsByTagName("textarea");
            for (i = 0; i < inputTags.length; ++i)
                formTags.push(inputTags[i]);
            //for (i = 0; i < selectTags.length; ++i)
            //    formTags.push(selectTags[i]);
            //for (i = 0; i < textAreaTags.length; ++i)
            //    formTags.push(textAreaTags[i]);

        }

        agate.http.addEventListener('onComplete', 'fixAFU_onCompleteFileUpload')
        var uploadRequestId = agate.http.createRequestId();
        agate.http.clearPostFileInfo(uploadRequestId);

        var param = "";
        var count = 0;
        for (i = 0; i < formTags.length; ++i) {
            var inputTag = formTags[i];
            if (inputTag.hasAttribute("inputInfoIndex")) {
                var infoIndex = inputTag.getAttribute("inputInfoIndex");
                if (typeof (infoIndex) == "undefined")
                    continue;
                var inputInfo = window.fixAFU_inputInfos[infoIndex];

                if (typeof (inputInfo.choosenFilePath) == "undefined")
                    inputInfo.choosenFilePath = "";
                agate.http.addPostFileInfo(uploadRequestId, inputInfo.inputTag.name, inputInfo.choosenFilePath);
                count++;
            } else {
                param = param + inputTag.name + "=" + inputTag.value + "|";
            }
        }
        param = param + "_charset_=UTF-8" + "|";

        //alert("file count : " + count);
        window.fixAFU_lastAction = this.action;
        agate.device.toastPopup(fixAFU_uploadStartMessage);
        agate.device.toastPopup(fixAFU_uploadStartMessage);
        agate.device.toastPopup(fixAFU_uploadStartMessage);
        agate.http.post(uploadRequestId, this.action, param);

    } catch (e) {
        alert(e);
    }
}

function getDataUrlFromAgatePath(path) {
    var ext = path.split('.').pop();
    var dataUrl = "data:";
    if (ext.lastIndexOf('/') < 0) {
        ext = ext.toLowerCase();

        if (ext == "png" || ext == "jpg") {
            dataUrl += "image/" + ext;
        }
    }
    dataUrl += ";base64," + agate.base64.read(path);

    return dataUrl;
}

// map <INPUT type="file" id="file1"   <IMG id="img1" 
function getImgElementForInputTag(inputTag) {
    // imgRecipe -> imgRecipeIMG
    if (inputTag.id == "user_file")
        return document.getElementById("img1");
    //if (inputTag.id == "file2")
    //    return document.getElementById("img2");

    return null;
}


function fixAFU_onFileChoose(args) {
    try {
        if (typeof (args.path) == "undefined" || args.path == null || args.path == "")
            return;

        agate.appLauncher.removeEventListener("onComplete", "fixAFU_onFileChoose");
        //agate.runScript("")
        //var choosenFilePath = agate.file.pathToUrl(args.path);
        var choosenFilePath = args.path;
        //agate.runScript("userVariable.picPath = " + choosenFilePath);
        var inputInfo = window.fixAFU_inputInfos[window.fixAFU_lastInputInfo];
        //3. 파일 이름만 표시함.
        var fileName = choosenFilePath.substring(choosenFilePath.lastIndexOf('/') + 1);
        inputInfo.patchedTitle.innerHTML = fileName;
        inputInfo.choosenFilePath = choosenFilePath;
		inputInfo.inputTag.value = choosenFilePath;

        // image preview 
        var img = getImgElementForInputTag(inputInfo.inputTag);
        if (img != null) {
            img.setAttribute("src", getDataUrlFromAgatePath(choosenFilePath));

            //var btnSubmit = document.getElementById("btnSubmit");
            //btnSubmit.style.display="block";
            //document.getElementById('Frm1').submit();
            //var btnBG = document.getElementById("footerBG");
            //btnBG.style.display="inline-block";

            }
        //document.getElementById('Frm1').submit();
        fixAFU_replaceFormSubmit(inputInfo.inputTag.form);
        $('#user_file').trigger('change');
        //agate.http.addEventListener("onComplete", function() { consolo.log("change");document.getElementById('Frm1').submit();} );

    } catch (e) {
        alert(e);
    }
};

function fixAndroidFileUpload() {
 // 1. 버전 검사
    //var version = agate.device.os.version();

    //if (version != "4.4" && version != "4.4.1" && version != "4.4.2")
    //    return;
    //if (agate.device.os.platform() != "Android")
    //    return;

    if (typeof(window.fixAFU_inputInfos) == "undefined")
        window.fixAFU_inputInfos = new Array();


    //var inputTags = document.getElementById('FFrm').contentWindow.document.getElementsByTagName("input");
    var inputTags = document.getElementsByTagName("input");

    var i;
    for (i = 0; i < inputTags.length; ++i) {
        var inputTag = inputTags[i];
        if (inputTag.type == "file" && inputTag.style.display != "none") {
            if (inputTag.hasAttribute("inputInfoIndex"))
                continue;

            var infoIndex = window.fixAFU_inputInfos.length;
            inputTag.setAttribute("inputInfoIndex", infoIndex);

            // 2. 기존 버튼을 없애고 파일 선택 버튼과 파일 이름 텍스트를 추가함.
            inputTag.style.display = "none";
			inputTag.type = "hidden";

            var patchedButton = document.createElement("button");
            patchedButton.setAttribute("inputInfoIndex", infoIndex);
            patchedButton.type = "button";
            patchedButton.innerHTML = fixAFU_buttonInnerHTML;
            inputTag.parentNode.insertBefore(patchedButton, inputTag);
            patchedButton.form = inputTag.form;
            patchedButton.className = "btn_white_round_photo";
            patchedButton.style.margin = "2.5em 0 0 .4em";



            var patchedTitle = document.createElement("span");
            patchedTitle.setAttribute("inputInfoIndex", infoIndex);
            patchedTitle.style.display = "none";
            patchedTitle.innerHTML = fixAFU_fileNameInnerHTML;
            inputTag.parentNode.insertBefore(patchedTitle, inputTag);
            //onchange 추가
            //patchedTitle.onchange = function (e) {
            //    document.getElementById('Frm1').submit();
            //};

            patchedButton.onclick = function (e) {
                window.fixAFU_lastInputInfo = e.target.getAttribute("inputInfoIndex");

                //agate.appLauncher.setSaveForImageCapture(true);
                //agate.appLauncher.setSaveDirForImageCapture('storage:Photo/');
                agate.appLauncher.addEventListener("onComplete", "fixAFU_onFileChoose");

                //agate.runScript("device.systemPopup('', '" + fixAFU_chooseFileForUploadMessage + "','Camera:appLauncher.exec(\\'imageCapture\\')','Gallery:appLauncher.exec(\\'albums\\')','Cancel')");

                 agate.runScript("function.picturePopupCall");
            };


            var inputInfo = new Object();
            window.fixAFU_inputInfos.push(inputInfo);
            inputInfo.inputTag = inputTag;
            inputInfo.patchedTitle = patchedTitle;
            inputInfo.patchedButton = patchedButton;

        }
    }

}

try {
    fixAndroidFileUpload()
} catch(e)
{
	alert(e);
}
