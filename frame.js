$(function () {
    var datepicker = function () {
        var today,//默认为今天的日期
            y,//当前的年份
            m,//当前的月份
            da,//当月的天
            oldDate,//上个月的日期
            oldMd,//上个月最后一天
            oldWd,//上个月最后一天是星期几
            nowDate, //当前月份日期
            nowMd,//当前月份最后一天
            cddays = [];//日历数据
        this.init = function () {//选择完日期后需要完成回调
            today = new Date();
            y = today.getFullYear();
            m = today.getMonth();
            da = today.getDate();
            $(".datetimepicker").remove();
            setBase();
            //$(".datetimepicker").css("display","block");
            setDateDt(y, m);
            show(afterPick);
        }
        var bind=function(callback){
            $(".datetimepicker-days table tbody td").click(function(){//选择某一天
                var $this=$(this);
                var date=$this.text();
                var year=y;
                var month=$this.hasClass("old") ? m:($this.hasClass("new")?m+2:m+1);
                var dateStr=year+"-"+month+"-"+date;
                //$(".datetimepicker").css("display","none");
                $(".datetimepicker").remove();
                callback(dateStr);
            });
            $(".datetimepicker-days table .today").click(function(){//选择当天
                var $this=$(this);
                var date=da;
                var year=y;
                var month=m+1;
                var dateStr=year+"-"+month+"-"+date;
                //$(".datetimepicker").css("display","none");
                $(".datetimepicker").remove();
                callback(dateStr);
            });
            $(".datetimepicker-days table .prev").click(function(){//上一个月
                var $this=$(this);
                if(m-1<0){
                    m=11;
                    y--;
                }else{
                    m--;
                }
                setDateDt(y, m);
                show(callback);
            });
            $(".datetimepicker-days table .next").click(function(){//下一个月
                var $this=$(this);
                if(m+1>11){
                    m=0;
                    y++;
                }else{
                    m++;
                }
                setDateDt(y, m);
                show(callback);
            });
        };
        var setDateDt = function (y, m) {//生成日历数据
            cddays=[];
            oldDate = new Date(y, m, 0);
            oldMd = oldDate.getDate();
            oldWd = oldDate.getDay()==0?7:oldDate.getDay();
            nowDate = new Date(y, m + 1, 0);
            nowMd = nowDate.getDate();
            for (var i = 0; i < 42; i++) {
                var date;
                var cdd = {};//{year:"",month:"",date:"",day:""};
                if (i < oldWd) {
                    date = oldMd - oldWd + i + 1;
                    cdd.year = y;
                    cdd.month = m;
                    cdd.date = date;
                    cdd.day = (i + 1) % 7 == 0 ? 7 : (i + 1) % 7;
                } else if (i < (oldWd + nowMd)) {
                    date = i - oldWd + 1;
                    cdd.year = y;
                    cdd.month = m + 1;
                    cdd.date = date;
                    cdd.day = (i + 1) % 7 == 0 ? 7 : (i + 1) % 7;
                } else {
                    date = i - oldWd - nowMd + 1;
                    cdd.year = y;
                    cdd.month = m + 2;
                    cdd.date = date;
                    cdd.day = (i + 1) % 7 == 0 ? 7 : (i + 1) % 7;
                }
                cddays.push(cdd);
            }
        };
        var show = function (callback) {//展示日历数据,生成一个table
             $(".datetimepicker-days ").empty();
            var tbHtml="<table class=\" table-condensed\">";
            var tHeadHtml=setTbhead();
            var tBodyHtml=setTbbody();
            var tFootHtml=setTbfoot();
            tbHtml+=tHeadHtml+tBodyHtml+tFootHtml+"</table>";

            $(".datetimepicker-days ").append(tbHtml);
            bind(callback);
        };
        var setTbhead = function () { //table的head部分
            var theadHtml="<thead>";
            theadHtml+="<tr>";
            theadHtml+="<th class=\"prev\"><i class=\"glyphicon icon-arrow-left\"></i></th>";
            var yStr=y;
            var mStr=['一','二','三','四','五','六','七','八','九','十','十一','十二'][m]+'月';
            theadHtml+="<th colspan=\"5\" class=\"switch\">"+mStr+' '+yStr+"</th>";
            theadHtml+="<th class=\"next\"><i class=\"glyphicon  icon-arrow-right\"></th>";
            theadHtml+="</tr>";
            theadHtml+=`<tr>
                        <th class="dow">一</th>
                        <th class="dow">二</th>
                        <th class="dow">三</th>
                        <th class="dow">四</th>
                        <th class="dow">五</th>
                        <th class="dow">六</th>
                        <th class="dow">七</th>
                    </tr>`;
            return theadHtml;
        };
        var setTbbody = function () {//table 的body部分
            var tbodyHtml = "<tbody>";
            $.each(cddays, function (i, n) {
                var trHtml = "";
                var tdHtml = "";

                if (n.year==today.getFullYear() && n.month == today.getMonth() + 1 && n.date == da) {
                    tdHtml = "<td class=\"day active\">" + n.date + "</td>";
                } else if (n.month < m + 1) {
                    tdHtml = "<td class=\"day old\">" + n.date + "</td>";
                } else if (n.month > m + 1) {
                    tdHtml = "<td class=\"day new\">" + n.date + "</td>";
                }else {
                    tdHtml = "<td class=\"day \">" + n.date + "</td>";
                } 
                if ((i + 1) % 7 == 1) {
                    tbodyHtml += "<tr>" + tdHtml;
                } else if ((i + 1) % 7 == 0) {
                    tbodyHtml += tdHtml + "</tr>";
                } else {
                    tbodyHtml += tdHtml;
                }
            });
            tbodyHtml+="</tbody>";
            return tbodyHtml;
        };
        var setTbfoot = function () {//table 的foot部分
            var tfootHtml=`<tfoot>
                    <tr>
                        <th colspan="7" class="today">今天</th>
                    </tr>
                </tfoot>`;
            return tfootHtml;
         };
        var setBase=function(){
            var htmlStr=`<div class="datetimepicker dropdown-menu">
                            <div class="datetimepicker-days">
                            </div>
                        </div>`;
            $(".zz-datetime").parent().append(htmlStr);
            
            console.log($(".zz-datetime").html());
        };
        var afterPick=function(date){
            $(".zz-datetime").val(date);
        };
    };
    window.datepicker=datepicker;
    $(".datetimeBtn").click(function(){
        var dp = new datepicker();
        dp.init();
    });
});
