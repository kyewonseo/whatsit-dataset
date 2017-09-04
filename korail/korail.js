
var C_DEBUG = '';
function kLog(cont) {
    if (typeof console != 'undefined' && typeof console.log == 'function' && C_DEBUG && C_DEBUG === "Y") {
        try {
            console.log.apply(console, arguments);
        } catch (e) {}
    }
}

// 공백없애기 : 글자중간의 공백도 없앤다
function removeChar(obj, ch) {
    var newStr = '';
    var oldStr = obj.value;
    for (var ii=0; ii<oldStr.length; ii++) {
        if (oldStr.charAt(ii) != ch)
            newStr = newStr+oldStr.charAt(ii);
    }
    return newStr;
}

function chgSeatAttCd_4() {

    // 2층석
    if (document.form1.txtSeatAttCd_4.value == "018") {
        if (document.form1.selGoTrain.value != "05"
        &&  document.form1.selGoTrain.value != "09" ) {
            alert("2층석은 ITX-청춘 열차만 예약이 가능합니다.\n"
                 +"\n"
                 +"열차종별은 전체로 변경됩니다.");

            for (var i=0;i< document.form1.selGoTrain.length;i++) {
                if (document.form1.selGoTrain[i].value == "05") {
                    document.form1.selGoTrain[i].selected = true;
                    return;
                }
            }
        }
    }

    $('input[name=oldSeatAttCd4]').val($('select[name=txtSeatAttCd_4]').val());
}

function chgSeatAttCd_3() {
}

function chgSeatAttCd_2() {
}

function chgGoTrain() {
    // 2층석
    if (document.form1.txtSeatAttCd_4.value == "018") {
        if (document.form1.selGoTrain.value != "05"
        &&  document.form1.selGoTrain.value != "09" ) {
            alert("2층석 좌석속성은 ITX-청춘 열차만 예약이 가능합니다.\n"
                 +"\n"
                 +"2층석은 기본으로 변경됩니다.");
            document.form1.txtSeatAttCd_4[0].selected=true;
            return;
        }
    }

    $('input[name=oldTrnClsfCd]').val($('select[name=selGoTrain]').val());
}

function chgJobId(step) {
    step = step==null?'':step;

    var oldJobId = $('input[name=oldJobId]').val();
    var oldTrnClsfCd = $('input[name=oldTrnClsfCd]').val();
    var oldSeatAttCd4 = $('input[name=oldSeatAttCd4]').val();

    var jobId = $(':radio[name=radJobId]:checked').val();
    //var trnClsfCd = $('select[name=selGoTrain]').val();
    //var seatAttCd4 = $('select[name=txtSeatAttCd_4]').val();
    //kLog('chgJobId:'+oldJobId+'/'+jobId);

    if (oldTrnClsfCd == '') oldTrnClsfCd = tSelGoTrain;
    if (oldSeatAttCd4 == '') oldSeatAttCd4 = tTxtSeatAttCd_4;

    // 열차종별 setting
    setTrain(jobId);
    // 좌석속성 setting
    setSeatAttCd(jobId);
    // 인원정보 setting
    setPsInfo(jobId);

    // 기본값 선택
    setOption('selGoTrain','oldTrnClsfCd',oldTrnClsfCd);
    setOption('txtSeatAttCd_4','oldSeatAttCd4',oldSeatAttCd4);

    if (step != 'ready' && oldJobId != '' && oldJobId != jobId) hideResult();
    $('input[name=oldJobId]').val(jobId);

    // 자동완성 위치보정
    fn_atc_start();
}

function setOption(objName,objName2,cd) {
    var o = $('select[name='+objName+']');
    var v = o.val(cd);

    //kLog('v.val()='+v.val());
    if (v.val() == null) {
        kLog(objName+':0번째');
        var cd0 = o.children('option:first').val();
        v = o.val(cd0);
    }

    v.prop('selected', 'selected');
    $('input[name='+objName2+']').val(o.val());
}

function setPsInfo(jobId) {
    if (jobId == '1' || jobId == '2') {
        $('#dPsInfo').show();
        $('#dPsInfo2').hide();
    } else if (jobId == 'F' || jobId == 'B') {
        $('#dPsInfo').hide();
        $('#dPsInfo2').show();
    }
}

function setTrain(jobId) {
    // 가족석 ITX-청춘삭제 2016.08.10 ljy 김윤석
    var trainValueC = ['00','09','08','01','04','02','05'];
    var trainValueF = ['00','02','05'];
    var trainValueB = ['07'];
    var trainTextC = ['KTX','ITX-청춘','ITX-새마을','새마을호','누리로','무궁화호','전체'];
    var trainTextF = ['KTX','무궁화호','전체'];
    var trainTextB = ['KTX'];

    var aValue = trainValueC;
    var aText = trainTextC;
    if (jobId == '1' || jobId == '2') {
        aValue = trainValueC;
        aText = trainTextC;
    } else if (jobId == 'F') {
        aValue = trainValueF;
        aText = trainTextF;
    } else if (jobId == 'B') {
        aValue = trainValueB;
        aText = trainTextB;
    }

    clearOption('selGoTrain');
    addOption('selGoTrain',aValue,aText);
}

function setSeatAttCd(jobId) {
    var SeatValueC = ['015','021','028','018'];
    var SeatValueF = ['027'];
    var SeatValueB = ['038'];
    var SeatTextC  = ['기본','휠체어','전동휠체어','2층석'];
    var SeatTextFB = ['기본'];

    var aValue = SeatValueC;
    var aText = SeatTextC;
    if (jobId == '1' || jobId == '2') {
        aValue = SeatValueC;
        aText = SeatTextC;
    } else if (jobId == 'F') {
        aValue = SeatValueF;
        aText = SeatTextFB;
    } else if (jobId == 'B') {
        aValue = SeatValueB;
        aText = SeatTextFB;
    }

    clearOption('txtSeatAttCd_4');
    addOption('txtSeatAttCd_4',aValue,aText);
}

function clearOption(objName) {
    //kLog('clearOption');
    $('select[name='+objName+'] option').remove();
}
function addOption(objName,aValue,aText) {
    //kLog('addOption');
    var o = $('select[name='+objName+']');
    for (var i=0; i<aValue.length; i++) {
        o.append('<option value="'+aValue[i]+'">'+aText[i]+'</option>');
    }
}

// 요일
function isValidDateSetting(objYear, objMMDD, objHour, objYoil) {
    if (objMMDD.length < 4) return;

    //objHour.options[0].selected = true;

    ////////////////////////////////////////////////////////////////////////////
    //계산되어진 결과를 가지고 월과 요일을 설정 정확한 요일이 나오게 한다. 2004.08.08 김진호 수정
    var x = objYear.value;
    var y = objMMDD.value.substring(0,2);
    var z = objMMDD.value.substring(2,4);

    ////////////////////////////////////////////////////////////////////////////
    if(y=='01') anydays = new Date(monName[0]+z+','+x);
    if(y=='02') anydays = new Date(monName[1]+z+','+x);
    if(y=='03') anydays = new Date(monName[2]+z+','+x);
    if(y=='04') anydays = new Date(monName[3]+z+','+x);
    if(y=='05') anydays = new Date(monName[4]+z+','+x);
    if(y=='06') anydays = new Date(monName[5]+z+','+x);
    if(y=='07') anydays = new Date(monName[6]+z+','+x);
    if(y=='08') anydays = new Date(monName[7]+z+','+x);
    if(y=='09') anydays = new Date(monName[8]+z+','+x);
    if(y=='10') anydays = new Date(monName[9]+z+','+x);
    if(y=='11') anydays = new Date(monName[10]+z+','+x);
    if(y=='12') anydays = new Date(monName[11]+z+','+x);
    var dw = anydays.getDay();

    objYoil.value=objects[dw];
    ////////////////////////////////////////////////////////////////////////////

    return;
}

// 역조회
function btnPopWin(name) {
    var pop  = window.open('','popWin1',"width=530,height=570,scrollbars=yes");
    pop.location.href = '/classes/bt/pr11100/sw_pr11111_f1Svt.do?hidOpener=' + name;
}

//  출발역 도착역 이름 교환
function sta_chg(formname) {
    var frm=eval("document."+formname);
    var sta_tmp = "";

    sta_tmp = frm.txtGoEnd.value;
    frm.txtGoEnd  .value = frm.txtGoStart.value;
    frm.txtGoStart.value = sta_tmp;

    hideResult();
}

function reserve2() {
    try {
        popReserve.f_close();
    } catch (e) {}

    sta_chg('form1');
    setTimeout(function() {alert('출ㆍ도착역이 변경되었습니다.\n출발일자를 확인하고 예약하시기 바랍니다.');},1000);
}

// 스케줄체크 공통
function fn_chkSchedule(formname) {
    // 역명 체크 2011.08.01 ljy
    if (fn_chkStnName(formname) == 'stop') return 'stop';

    // 호남선 추천경로
    fn_RecPath(formname);
}

function fn_chkRsv(formname) {
    return;

    var frm=eval("document."+formname);
    var abrddate = parseInt(frm.txtGoAbrdDt.value,10);
}

function fn_RecPath(formname) {
    var frm=eval("document."+formname);

    if (frm.txtMenuId.value != "11" && //일반
        frm.txtMenuId.value != "41" ) { //파격가
        return;
    }


    var radJobId = '';
    var oRadJobId = document.getElementsByName('radJobId');
    for (var i=0;i<oRadJobId.length;i++) {
        if (oRadJobId[i].checked) {
            radJobId = oRadJobId[i].value;
            break;
        }
    }

    // 직통에 대해서만 2013.02.19 ljy
    //if(radJobId != '1') return;

    var abrddate = parseInt(frm.txtGoAbrdDt.value,10);

    //////////////////////////////////////// 서울 용산 표출 추가 20060112 박주오
    var GoStart = removeChar(frm.txtGoStart," ");
    var GoEnd   = removeChar(frm.txtGoEnd," ");

    frm.txtGoStart.value=GoStart;
    frm.txtGoEnd.value=GoEnd;
}

function fn_chkStnName(formname) {
    var frm=eval("document."+formname);
    //var abrddate = parseInt(frm.txtGoAbrdDt.value,10);

    if (frm.txtGoStart.value == "공항서울") {
        alert("공항서울역이 서울역으로 통합되었습니다.\n\n"
             +"확인을 누르시면 서울역으로 조회됩니다.");
        frm.txtGoStart.value = "서울";
    }

    if (frm.txtGoEnd.value == "공항서울") {
        alert("공항서울역이 서울역으로 통합되었습니다.\n\n"
             +"확인을 누르시면 서울역으로 조회됩니다.");
        frm.txtGoEnd.value = "서울";
    }

    if (frm.txtGoStart.value == "판대") {
        alert("판대역이 삼산역으로 역명 변경되었습니다.\n\n"
             +"확인을 누르시면 삼산역으로 조회됩니다.");
        frm.txtGoStart.value = "삼산";
    }

    if (frm.txtGoEnd.value == "판대") {
        alert("판대역이 삼산역으로 역명 변경되었습니다.\n\n"
             +"확인을 누르시면 삼산역으로 조회됩니다.");
        frm.txtGoEnd.value = "삼산";
    }

    if (frm.txtGoStart.value == "구둔") {
        alert("구둔역이 일신역으로 역명 변경되었습니다.\n\n"
             +"확인을 누르시면 일신역으로 조회됩니다.");
        frm.txtGoStart.value = "일신";
    }

    if (frm.txtGoEnd.value == "구둔") {
        alert("구둔역이 일신역으로 역명 변경되었습니다.\n\n"
             +"확인을 누르시면 일신역으로 조회됩니다.");
        frm.txtGoEnd.value = "일신";
    }
}

//  KTX001열차 안내 2011.12.19 ljy
function chkDtourFlg(h_dtour_flg) {
    var sDtourTxt = "선택하신 열차는 다른 열차에 비해 정차역 수가 적어 가격이 최대 0.6% 높습니다.\n"
                  + "\n"
                  + "계속 진행하시겠습니까?";

    if (h_dtour_flg == "S") {
        if (confirm(sDtourTxt)) {
            return true;
        } else {
            return false;
        }
    }

    return true;
}

// 운임요금
function view_fare(ch) {
    //////////////////////////////////////////
    var t_time = "/classes/bt/pr11200/sw_pr11241_i1Svt.do?";
    t_time += "&txtRtnDvCd=N";
    t_time += "&txtChtrDvCd1="+train[ch].h_chg_trn_dv_cd;
    t_time += "&txtTrnClsfCd1="+train[ch].h_trn_clsf_cd;
    t_time += "&txtTrnGpCd1="+train[ch].h_trn_gp_cd;
    t_time += "&txtDptRsStnCd1="+train[ch].h_dpt_rs_stn_cd;
    t_time += "&txtArvRsStnCd1="+train[ch].h_arv_rs_stn_cd;
    t_time += "&txtRunDt1="+train[ch].h_run_dt;
    t_time += "&txtDptDt1="+train[ch].h_dpt_dt;
    t_time += "&txtTrnNo1="+train[ch].h_trn_no;

    // 환승인 경우
    if (train[ch].h_chg_trn_dv_cd == 2) {
        t_time += "&txtChtrDvCd1_1="+train[eval(ch)+1].h_chg_trn_dv_cd;
        t_time += "&txtTrnClsfCd1_1="+train[eval(ch)+1].h_trn_clsf_cd;
        t_time += "&txtTrnGpCd1_1="+train[eval(ch)+1].h_trn_gp_cd;
        t_time += "&txtDptRsStnCd1_1="+train[eval(ch)+1].h_dpt_rs_stn_cd;
        t_time += "&txtArvRsStnCd1_1="+train[eval(ch)+1].h_arv_rs_stn_cd;
        t_time += "&txtRunDt1_1="+train[eval(ch)+1].h_run_dt;
        t_time += "&txtDptDt1_1="+train[eval(ch)+1].h_dpt_dt;
        t_time += "&txtTrnNo1_1="+train[eval(ch)+1].h_trn_no;
    }

    window.open(t_time, '', 'width=600,height=440,resizable=no,scrollbars=no,center=yes');
}

// 시각표
function btnTimeInfo(str) {
    window.open(str, 'helpwin', 'width=450,height=420,resizable=no,scrollbars=yes,center=yes,statur=no');
}

function viewSaveMsg(msg) {
	$('#saveMsg').hide();
	$('#saveMsg').html('<font color=red>'+msg+'</font>');
	$('#saveMsg').slideDown('slow');

	setTimeout(function(){
		$('#saveMsg').hide();
		$('#saveMsg').html('입력하신 여정정보를 기본값으로 셋팅할 수 있습니다.');
		$('#saveMsg').slideDown('slow');
	}, 2000);
}

function clear1() {
    try {
        var data = {};
        localStorage.setItem('btJrnyData1', JSON.stringify(data));

        viewSaveMsg('삭제하기를 성공했습니다.');
    } catch (e) {
        kLog('e=', e);
        alert('삭제하기를 실패했습니다.');
    }
}

function save1() {
    try {
        var data = {};
        //var data = $('#form1').serializeArray();

        var form1 = document.form1;
        data.txtPsgFlg_1    = form1.txtPsgFlg_1   .value;
        data.txtPsgFlg_2    = form1.txtPsgFlg_2   .value;
        data.txtPsgFlg_3    = form1.txtPsgFlg_3   .value;
        data.txtPsgFlg_7    = form1.txtPsgFlg_7   .value;
        data.txtPsgFlg_5    = form1.txtPsgFlg_5   .value;
        data.chkEnableCome  = form1.chkEnableCome .checked;
        data.radJobId1      = $('input:radio[name=radJobId1]:checked').val();
        data.txtGoStart1_1  = form1.txtGoStart1_1 .value;
        data.txtGoEnd1_1    = form1.txtGoEnd1_1   .value;
        data.selGoMMDD1_1   = form1.selGoMMDD1_1  .value;
        data.txtGoYoil1_1   = form1.txtGoYoil1_1  .value;
        data.radTrainNo1_1  = $('input:radio[name=radTrainNo1_1]:checked').val();
        data.selGoHour1_1   = form1.selGoHour1_1  .value;
        data.selGoMinute1_1 = form1.selGoMinute1_1.value;
        data.txtTrainNo1_1  = form1.txtTrainNo1_1 .value;
        data.selGoTrain1_1  = form1.selGoTrain1_1 .value;
        data.selGoRoom1_1   = form1.selGoRoom1_1  .value;
        data.radJobId2      = $('input:radio[name=radJobId2]:checked').val();
        data.txtGoStart2_1  = form1.txtGoStart2_1 .value;
        data.txtGoEnd2_1    = form1.txtGoEnd2_1   .value;
        data.selGoMMDD2_1   = form1.selGoMMDD2_1  .value;
        data.txtGoYoil2_1   = form1.txtGoYoil2_1  .value;
        data.radTrainNo2_1  = $('input:radio[name=radTrainNo2_1]:checked').val();
        data.selGoHour2_1   = form1.selGoHour2_1  .value;
        data.selGoMinute2_1 = form1.selGoMinute2_1.value;
        data.txtTrainNo2_1  = form1.txtTrainNo2_1 .value;
        data.selGoTrain2_1  = form1.selGoTrain2_1 .value;
        data.selGoRoom2_1   = form1.selGoRoom2_1  .value;
        kLog('data=', data);

        //$.cookie('btJrnyData', JSON.stringify(data), {expires: 100, path:'/'});
        localStorage.setItem('btJrnyData1', JSON.stringify(data));

        viewSaveMsg('저장하기를 성공했습니다.');
    } catch (e) {
        kLog('e=', e);
        alert('저장하기를 실패했습니다.\n브라우저설정을 확인하시거나 다른 웹브라우저를 이용하여 주십시오.');
    }
}

function load1() {
    try {
        //var dataString = $.cookie('btJrnyData');
        //var data = JSON.parse(dataString);
        var dataString = localStorage.getItem('btJrnyData1')||'{}';
        if (dataString == '{}') {
            //viewSaveMsg('저장된 정보가 없습니다.');
            return;
        }

        var data = JSON.parse(dataString);
        kLog('data=', data);

        var form1 = document.form1;
        data.txtPsgFlg_1    && $('select[name=txtPsgFlg_1]').val(data.txtPsgFlg_1);
        data.txtPsgFlg_2    && $('select[name=txtPsgFlg_2]').val(data.txtPsgFlg_2);
        data.txtPsgFlg_3    && $('select[name=txtPsgFlg_3]').val(data.txtPsgFlg_3);
        data.txtPsgFlg_7    && $('select[name=txtPsgFlg_7]').val(data.txtPsgFlg_7);
        data.txtPsgFlg_5    && $('select[name=txtPsgFlg_5]').val(data.txtPsgFlg_5);
        data.chkEnableCome  && $('#chkEnableCome').prop('checked', data.chkEnableCome); enableComeTrain();

        data.radJobId1      && $('input:radio[name=radJobId1]:input[value='+data.radJobId1+']').prop('checked', true);
        data.txtGoStart1_1  && (form1.txtGoStart1_1 .value = data.txtGoStart1_1);
        data.txtGoEnd1_1    && (form1.txtGoEnd1_1   .value = data.txtGoEnd1_1  );
        data.selGoMMDD1_1   && $('select[name=selGoMMDD1_1]').val(data.selGoMMDD1_1);
        data.txtGoYoil1_1   && (form1.txtGoYoil1_1  .value = data.txtGoYoil1_1 );
        data.radTrainNo1_1  && $('input:radio[name=radTrainNo1_1]:input[value='+data.radTrainNo1_1+']').prop('checked', true); enableTrainNo();
        data.selGoHour1_1   && $('select[name=selGoHour1_1]').val(data.selGoHour1_1);
        data.selGoMinute1_1 && $('select[name=selGoMinute1_1]').val(data.selGoMinute1_1);
        data.txtTrainNo1_1  && (form1.txtTrainNo1_1 .value = data.txtTrainNo1_1);
        data.selGoTrain1_1  && $('select[name=selGoTrain1_1]').val(data.selGoTrain1_1);
        data.selGoRoom1_1   && $('select[name=selGoRoom1_1]').val(data.selGoRoom1_1);

        //if (data.chkEnableCome) {
        data.radJobId2      && $('input:radio[name=radJobId2]:input[value='+data.radJobId2+']').prop('checked', true);
        data.txtGoStart2_1  && (form1.txtGoStart2_1 .value = data.txtGoStart2_1);
        data.txtGoEnd2_1    && (form1.txtGoEnd2_1   .value = data.txtGoEnd2_1  );
        data.selGoMMDD2_1   && $('select[name=selGoMMDD2_1]').val(data.selGoMMDD2_1);
        data.txtGoYoil2_1   && (form1.txtGoYoil2_1  .value = data.txtGoYoil2_1 );
        data.radTrainNo2_1  && $('input:radio[name=radTrainNo2_1]:input[value='+data.radTrainNo2_1+']').prop('checked', true); enableTrainNo2();
        data.selGoHour2_1   && $('select[name=selGoHour2_1]').val(data.selGoHour2_1);
        data.selGoMinute2_1 && $('select[name=selGoMinute2_1]').val(data.selGoMinute2_1);
        data.txtTrainNo2_1  && (form1.txtTrainNo2_1 .value = data.txtTrainNo2_1);
        data.selGoTrain2_1  && $('select[name=selGoTrain2_1]').val(data.selGoTrain2_1);
        data.selGoRoom2_1   && $('select[name=selGoRoom2_1]').val(data.selGoRoom2_1);
        //}

        viewSaveMsg('불러오기를 성공했습니다.');
    } catch (e) {
        kLog('e=', e);
        alert('불러오기를 실패했습니다.');
    }
}

function clear2() {
    try {
        var data = {};
        localStorage.setItem('btJrnyData2', JSON.stringify(data));

        viewSaveMsg('삭제하기를 성공했습니다.');
    } catch (e) {
        kLog('e=', e);
        alert('삭제하기를 실패했습니다.');
    }
}

function save2() {
    try {
        var data = {};
        //var data = $('#form1').serializeArray();

        var form1 = document.form1;
        data.radJobId       = $('input:radio[name=radJobId]:checked').val();
        data.txtPsgFlg_1    = form1.txtPsgFlg_1   .value;
        data.txtPsgFlg_2    = form1.txtPsgFlg_2   .value;
        data.txtPsgFlg_3    = form1.txtPsgFlg_3   .value;
        data.txtPsgFlg_4    = form1.txtPsgFlg_4   .value;
        data.txtPsgFlg_5    = form1.txtPsgFlg_5   .value;
        data.txtSetFlg_1    = form1.txtSetFlg_1   .value;
        data.selGoMMDD      = form1.selGoMMDD     .value;
        data.selGoHour      = form1.selGoHour     .value;
        data.txtGoYoil      = form1.txtGoYoil     .value;
        data.txtGoStart     = form1.txtGoStart    .value;
        data.txtGoEnd       = form1.txtGoEnd      .value;
        data.selGoTrain     = form1.selGoTrain    .value;
        data.txtSeatAttCd_4 = form1.txtSeatAttCd_4.value;
        kLog('data=', data);

        //$.cookie('btJrnyData', JSON.stringify(data), {expires: 100, path:'/'});
        localStorage.setItem('btJrnyData2', JSON.stringify(data));

        viewSaveMsg('저장하기를 성공했습니다.');
    } catch (e) {
        kLog('e=', e);
        alert('저장하기를 실패했습니다.\n브라우저설정을 확인하시거나 다른 웹브라우저를 이용하여 주십시오.');
    }
}

function load2() {
    try {
        //var dataString = $.cookie('btJrnyData');
        //var data = JSON.parse(dataString);
        var dataString = localStorage.getItem('btJrnyData2')||'{}';
        if (dataString == '{}') {
            //viewSaveMsg('저장된 정보가 없습니다.');
            return;
        }

        var data = JSON.parse(dataString);
        kLog('data=', data);

        var form1 = document.form1;
        data.radJobId       && $('input:radio[name=radJobId]:input[value='+data.radJobId+']').prop('checked', true); chgJobId();
        data.txtPsgFlg_1    && $('select[name=txtPsgFlg_1   ]').val(data.txtPsgFlg_1   );
        data.txtPsgFlg_2    && $('select[name=txtPsgFlg_2   ]').val(data.txtPsgFlg_2   );
        data.txtPsgFlg_3    && $('select[name=txtPsgFlg_3   ]').val(data.txtPsgFlg_3   );
        data.txtPsgFlg_4    && $('select[name=txtPsgFlg_4   ]').val(data.txtPsgFlg_4   );
        data.txtPsgFlg_5    && $('select[name=txtPsgFlg_5   ]').val(data.txtPsgFlg_5   );
        data.txtSetFlg_1    && $('select[name=txtSetFlg_1   ]').val(data.txtSetFlg_1   );
        data.selGoTrain     && $('select[name=selGoTrain    ]').val(data.selGoTrain    );
        data.selGoMMDD      && $('select[name=selGoMMDD     ]').val(data.selGoMMDD     );
        data.selGoHour      && $('select[name=selGoHour     ]').val(data.selGoHour     );
        data.txtGoYoil      && (form1.txtGoYoil  .value = data.txtGoYoil );
        data.txtGoStart     && (form1.txtGoStart .value = data.txtGoStart);
        data.txtGoEnd       && (form1.txtGoEnd   .value = data.txtGoEnd  );
        data.selGoTrain     && $('select[name=selGoTrain    ]').val(data.selGoTrain    ); chgGoTrain();
        data.txtSeatAttCd_4 && $('select[name=txtSeatAttCd_4]').val(data.txtSeatAttCd_4); chgSeatAttCd_4();

        viewSaveMsg('불러오기를 성공했습니다.');
    } catch (e) {
        kLog('e=', e);
        alert('불러오기를 실패했습니다.');
    }
}


var loaded = false;
function fn_onload() {
    if (loaded) return;

    loaded = true;

    // 자동완성
    fn_atc_start();

    // show and scroll
    fn_show();
}

function hideResult() {
    closeMessage();

    //kLog('hideResult');
    var oHidden = document.getElementsByName("hidHidden")[0];
    var oResult = document.getElementById("divResult");
    if (oHidden == null || oResult == null) return;

    if (oResult.style.display != 'none') {
        oResult.innerHTML = '';
        oResult.style.display = 'none';
    }

    if (oHidden != null)
        oHidden.value = 'true';
}

function fn_show() {
    var oHidden = document.getElementsByName("hidHidden")[0];
    var oResult = document.getElementById("divResult");
    if (oHidden == null || oResult == null) return;

    var hidHidden = oHidden.value;
    kLog('hidHidden='+hidHidden);
    if (hidHidden != 'true') {
        oResult.style.display = 'block';
        //fn_scroll();
    }
}

function fn_scroll() {
    window.scrollTo(0,220);
}

setTimeout(fn_show, 1000);
