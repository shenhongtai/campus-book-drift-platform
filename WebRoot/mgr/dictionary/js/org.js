$(function () {	
	//列表加载通用方法	
	function load(rel, parent) {
		//列表主体
		var data = eval(rel);
		var str = "";
		$("#dctlist").html("");
		for (var i = 0; i < data.length; i++) {
			str = "<tr><td>" + data[i].ORG_ID + "</td><td>" + data[i].ORG_NAME + "</td><td>"; 
			if (data[i].ORG_NOTE == null) {
				str += "未填写";
			} else {
				str += data[i].ORG_NOTE;
			}
			str += "</td><td class='col-control'><button id='" + data[i].ORG_ID + "' class='btn btn-success dct-spread' ";
				var id = data[i].ORG_ID + "";
				if (id.length == 6) {
					str += "disabled='disabled'";
				}
			str += ">展开</button><a href='../../DctCommon.do?act=editjump&dct=org&orgid=" + data[i].ORG_ID + 
				"' class='btn btn-info'>编辑</a></td></tr>";
			$("#dctlist").append(str);
		}	
		
		//绑定展开按钮
		$(".dct-spread").click(function () {
			loadlevb($(this).attr("id"));		
		});	
		
		//绑定向上按钮
		if (parent == 0) {
			$("#dct-uppon").attr("disabled", "disabled");
		} else {
			$("#dct-uppon").removeAttr("disabled");	
		}
		$("#dct-uppon").click(function () {
			if (parent.length == 2) {	
				loadleva();
			} else if (parent.length == 4) {
				parent = parent.substr(0, 2);
				loadlevb(parent);
			}
		});
		
		//更新面包屑
		if (parent == 0) {
			$(".breadcrumb").html("<li class='active'>当前位置：</li><li class='active'>中华人民共和国</li>");	
		} else if (parent.length == 2) {
			$.ajax({
				url: "../../DctCommon.do",
				data: "act=breadcrumb&dct=org&level=b&parent=" + parent,
				type: "post",
				success: function (rel) {
					var data = eval(rel);
					var str = "<li class='active'>当前位置：</li><li>中华人民共和国</li>" +
							"<li class='active'>" + data[0].ORG_NAME + "</li>";
					$(".breadcrumb").html(str);	
				}
			});
		} else if (parent.length == 4) {
			$.ajax({
				url: "../../DctCommon.do",
				data: "act=breadcrumb&dct=org&level=c&parent=" + parent,
				type: "post",
				success: function (rel) {
					var data = eval(rel);
					var str = "<li class='active'>当前位置：</li><li>中华人民共和国</li>" +
							"<li>" + data[0].ORG_NAME + "</li>"+
							"<li class='active'>" + data[1].ORG_NAME + "</li>";
					$(".breadcrumb").html(str);						
				}
			});	
		}
	}
	
	//加载A级列表
	function loadleva () {
		$.ajax({
			url: "../../DctCommon.do",
			type: "post",
			data: "act=load&dct=org&level=a",
			success: function (rel) {
				load(rel, 0);
			}
		});		
	}
	
	//加载BC级列表
	var loadlevb = function (parent) {
		$.ajax({
			url: "../../DctCommon.do",
			type: "post",
			data: "act=load&dct=org&level=b&parent=" + parent,
			success: function (rel) {
				load(rel, parent);
			}
		});		
	};
	
	//默认加载A级列表
	loadleva();
	
	//执行搜索
	$("#search").click(function () {
		var lev = $("#slevel").val();
		var par = $("#sparent").val();
		if (lev == "a") {
			loadleva();
		} else {
			loadlevb(par);
		} 
	});
	
	//搜索框改变事件
	$("#slevel").change(function () {
		var lev = $("#slevel").val();
		if (lev == "a") {
			$("#sparent").html("<option value='0'>中华人民共和国</option>");
		} else if (lev == "b") {
			$.ajax({
				url: "../../DctCommon.do",
				type: "post",
				data: "act=loadselect&dct=org&level=b",
				success: function (rel) {
					$("#sparent").html("");
					var data = eval(rel);
					var str = "";
					for (var i = 0; i < data.length; i++) {
						str = "<option value='" + data[i].ORG_ID + "'>" + data[i].ORG_NAME + "</option>";
						$("#sparent").append(str);
					}
				}
			});			
		} else if (lev == "c") {
			$.ajax({
				url: "../../DctCommon.do",
				type: "post",
				data: "act=loadselect&dct=org&level=c",
				success: function (rel) {
					$("#sparent").html("");
					var data = eval(rel);
					var str = "";
					for (var i = 0; i < data.length; i++) {
						var orgid = data[i].ORG_ID + "";
						if (orgid.length == 2 && i == 0) {
							str += "<optgroup label='" + data[i].ORG_NAME + "'>"
						} else if (orgid.length == 2) {
							str += "</optgroup><optgroup label='" + data[i].ORG_NAME + "'>"
						} else {
							str += "<option value='" + data[i].ORG_ID + "'>" + data[i].ORG_NAME + "</option>";	
						}
					}
					str += "</optgroup>";
					$("#sparent").html(str);
				}
			});			
		}
	});
	
	//新增节点 - 提交
	$("#save").click(function () {
		if ($.trim($("#orgname").val()).length > 0) {	//str.trim()的写法貌似不支持IE？
			$("#form-dctadd").submit();		
			$("#save").attr("data-content", "表单填写正确");
			$("#save").popover("hide");	
		} else {
			$("#save").attr("data-content", "表单填写不完整，请检查");
			$("#save").popover("show");
            return false;
		}
	});
	
	//新增节点模态框 - 父节点改变自动生成编号
	$("#parent").change(function () {
		appendNewOrgId();
	});
	function appendNewOrgId() {
		$.ajax({
			url: "../../DctCommon.do",
			type: "post",
			data: "act=newnodeid&dct=org&parent=" + $("#parent").val(),
			success: function (rel) {
				$("#orgid").val(rel);
			}
		});
	}
	
	//新增节点模态框 - 节点级别改变自动加载父节点列表
	$("#level").change(function () {
		var lev = $("#level").val();
		if (lev == "a") {
			$("#parent").removeAttr("disabled");
			$("#parent").html("<option value='0'>中华人民共和国</option>");
			$("#orgname").removeAttr("readonly");
			$("#note").removeAttr("readonly");
			appendNewOrgId();
		} else if (lev == "b") {
			$("#parent").removeAttr("disabled");
			$("#orgname").removeAttr("readonly");
			$("#note").removeAttr("readonly");
			$.ajax({
				url: "../../DctCommon.do",
				type: "post",
				data: "act=loadselect&dct=org&level=b",
				success: function (rel) {
					$("#parent").html("");
					var data = eval(rel);
					var str = "";
					for (var i = 0; i < data.length; i++) {
						str = "<option value='" + data[i].ORG_ID + "'>" + data[i].ORG_NAME + "</option>";
						$("#parent").append(str);
					}
					appendNewOrgId();
				}
			});
		} else if (lev == "c") {			
			$("#parent").removeAttr("disabled");
			$("#orgname").removeAttr("readonly");
			$("#note").removeAttr("readonly");	
			$.ajax({
				url: "../../DctCommon.do",
				type: "post",
				data: "act=loadselect&dct=org&level=c",
				success: function (rel) {
					$("#parent").html("");
					var data = eval(rel);
					var str = "";
					for (var i = 0; i < data.length; i++) {
						var orgid = data[i].ORG_ID + "";
						if (orgid.length == 2 && i == 0) {
							str += "<optgroup label='" + data[i].ORG_NAME + "'>"
						} else if (orgid.length == 2) {
							str += "</optgroup><optgroup label='" + data[i].ORG_NAME + "'>"
						} else {
							str += "<option value='" + data[i].ORG_ID + "'>" + data[i].ORG_NAME + "</option>";	
						}
					}
					str += "</optgroup>";
					$("#parent").html(str);
					appendNewOrgId();					
				}
			});
			
		} else {
			$("#parent").html("<option>请先选择节点级别</option>");
			$("#parent").attr("disabled", "disabled");
			$("#orgid").attr("readonly", "readonly");
			$("#orgname").attr("readonly", "readonly");
			$("#note").attr("readonly", "readonly");
			$("#orgid").val("");
			$("#orgname").val("");
			$("#note").val("");
		}
	});
	
});
