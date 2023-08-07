/* STUDY WITH MIKU
    CORE FUNCTION
   V1.0.3 2023.08.07 */

   $(function() {
	if (window.localStorage) {
		util.init();
	} else {
		$(".ok").fadeOut(300, "linear");
		$("#ng").fadeIn(300, "linear")
	}
});


var util = {
	init: function() {
		$(window).resize(util.videoresize);
		$("#bt_fs").fadeIn(300, "linear");
		$("#scene_top").fadeIn(300, "linear");
		$(".aplayer-icon-lrc").trigger('click');
		util.initTips("hitokoto");
		util.initTips("studytime");
		util.initTips("worldtime");
		util.initClickEvent();
		util.initStrictMode();
		util.initWorldTimer();
		util.readstoragetime()
	},
	initClickEvent: function() {
		$("#bt_fs").on('click', function() {
			util.fullscreen()
		});
		$("#btt_strict").on('click', function() {
			util.switchStrictMode()
		});
		$("#btt_start").on('click', function() {
			if (util.checkStrictMode()) {
				util.addVisibilityListener();
			}
			util.study()
		});
		$("#btt_setting").on('click', function() {
			util.menuopen("menu")
		});
		$("#btt_about").on('click', function() {
			util.menuopen("about")
		});
		$("#bt_rest").on('click', function() {
			util.timerecord.pause();
			util.menuopen("rest");
			$('.aplayer-pause').trigger('click');
			$('#bt_restclose').on('click', function() {
				$('.aplayer-play').trigger('click');
				util.timerecord.start()
			});
			$("#bt_musicswitch").on('click', function() {
				$(".aplayer-button").trigger("click")
			})
		});
		$("#about_cover").on('click', function() {
			$("#about").fadeOut(300, "linear");
			$("#about_cover").fadeOut(300, "linear");
			$("#scene_top").fadeIn(300, "linear")
		});
	},
	menuopen: function(e) {
		$("#" + e).fadeIn(300, "linear");
		$("#" + e + "_cover").fadeIn(300, "linear");
		$("#bt_" + e + "close").on('click', function() {
			$("#" + e).fadeOut(300, "linear");
			$("#" + e + "_cover").fadeOut(300, "linear")
		})
	},
	study: function() {
		$('.aplayer-play').trigger('click');
		$("#scene_top").fadeOut(300, "linear");
		$("#scene_learning").fadeIn(300, "linear");
		$("#bt_rest").fadeIn(300, "linear");
		$("video").trigger("play");
		util.videoresize();
		util.Tips.init();
		util.timerecord.start();
		$("#bt_stop").on('click', function() {
			util.timerecord.stop();
			util.Tips.stop();
			$('.aplayer-pause').trigger('click');
			$("#scene_top").fadeIn(300, "linear");
			$("#scene_learning").fadeOut(300, "linear");
			$("#bt_rest").fadeOut(300, "linear");
			$("#rest").fadeOut(300, "linear");
			$("#rest_cover").fadeOut(300, "linear")
		})
	},
	//Timer BEGIN
	timerecord: {
		start: function() {
			clearInterval(time);
			if (!recorded) {
				hour = minutes = seconds = 0;
				recorded = 1
			}
			util.timer()
		},
		stop: function() {
			clearInterval(time);
			if (recorded) {
				var m = h = 0;
				sumseconds = sumseconds + seconds;
				while (sumseconds >= 60) {
					m++;
					sumseconds = sumseconds - 60
				}
				summinutes = summinutes + minutes + m;
				while (summinutes >= 60) {
					h++;
					summinutes = summinutes - 60
				}
				sumhour = sumhour + hour + h;
				recorded = 0;
				util.writestoragetime()
			}
		},
		pause: function() {
			clearInterval(time)
		}
	},
	initWorldTimer: function() {
		wtime = setInterval(function() {
			var myDate = new Date,
				s = m = h = 0;
			h = myDate.getHours();
			m = myDate.getMinutes();
			s = myDate.getSeconds();
			if (myDate.getHours() < 10) {
				h = '0' + myDate.getHours()
			}
			if (myDate.getMinutes() < 10) {
				m = '0' + myDate.getMinutes()
			}
			if (myDate.getSeconds() < 10) {
				s = '0' + myDate.getSeconds()
			}
			$("#worldtime").text(h + "时" + m + "分" + s + "秒");
			$("video").trigger("play")
		}, 1000);
	},
	timer: function() {
		var pastsDate = sDate = pastmDate = mDate = pasthDate = hDate = 0;
		time = setInterval(function() {
			var studytime = $("#time"),
				tipstime = $("#studytime"),
				myDate = new Date;
			sDate = myDate.getSeconds();
			mDate = myDate.getMinutes();
			hDate = myDate.getHours();
			if (sDate - pastsDate >= 1 || mDate - pastmDate >= 1 || hDate - pasthDate >= 1) {
				seconds++
			}
			if (seconds == 60) {
				minutes++;
				seconds = 0
			}
			if (minutes == 60) {
				hour++;
				minutes = 0
			}
			if (minutes == '0' && hour == '0') {
				studytime.text(seconds + "秒钟啦！继续加油吧！")
			} else if (hour != '0') {
				studytime.text(hour + "小时" + minutes + "分钟" + seconds + "秒啦！好厉害！！！")
			} else {
				studytime.text(minutes + "分钟" + seconds + "秒啦！超棒！")
			} if (minutes == '0' && hour == '0') {
				tipstime.text(seconds + "秒钟")
			} else if (hour != '0') {
				tipstime.text(hour + "小时" + minutes + "分钟" + seconds + "秒")
			} else {
				tipstime.text(minutes + "分钟" + seconds + "秒")
			}
			pastsDate = sDate;
			pastmDate = mDate;
			pasthDate = hDate;
		}, 1000)
	},
	readstoragetime: function() {
		if (localStorage.getItem("study") == "GetDAZE") {
			sumhour = parseInt("0x" + localStorage.getItem("studyh"));
			summinutes = parseInt("0x" + localStorage.getItem("studym"));
			sumseconds = parseInt("0x" + localStorage.getItem("studys"));
			if (summinutes == '0' && sumhour == '0') {
				$("#sumtime").text(sumseconds + "秒钟了")
			} else if (sumhour != '0') {
				$("#sumtime").text(sumhour + "小时" + summinutes + "分钟" + sumseconds + "秒了")
			} else {
				$("#sumtime").text(summinutes + "分钟" + sumseconds + "秒了")
			}
		}
	},
	writestoragetime: function() {
		localStorage.setItem("study", "GetDAZE");
		localStorage.setItem("studyh", sumhour.toString(16));
		localStorage.setItem("studym", summinutes.toString(16));
		localStorage.setItem("studys", sumseconds.toString(16));
		util.readstoragetime()
	},
	//Timer END
	//StrictMode BEGIN
	addVisibilityListener: function() {
		document.addEventListener('visibilitychange', function() {
			//fix wrong event's action
			if (util.checkStrictMode() && recorded) {
				if (document.visibilityState === 'hidden') {
					$('#bt_rest').trigger('click');
					document.title = '摸鱼中...'
				}
				if (document.visibilityState === 'visible') {
					document.title = 'STUDY WITH MIKU'
				}
			}
		});
	},
	checkStrictMode: function() {
		let stat = localStorage.getItem("conf_strict") - '0';
		//useful!
		return stat
	},
	initStrictMode: function() {
		if (util.checkStrictMode() == null) {
			localStorage.setItem("conf_strict", 0)
		} else if (util.checkStrictMode()) {
			$("#btt_strict")[0].innerText = '严格模式(离开页面自动停止): 开'
		}
	},
	switchStrictMode: function() {
		if (util.checkStrictMode()) {
			$("#btt_strict")[0].innerText = '严格模式(离开页面自动停止): 关';
			localStorage.setItem("conf_strict", 0)
		} else {
			$("#btt_strict")[0].innerText = '严格模式(离开页面自动停止): 开';
			localStorage.setItem("conf_strict", 1);
		}
	},
	//StrictMode END
	//Tips BEGIN

	//0:no display 1:roll display 2:always display
	initTips: function(n) {
		if (util.readTipsconf(n) == 1) {
			localStorage.setItem("conf_tips_" + n, 1)
		} else if (util.readTipsconf(n) == 2) {
			localStorage.setItem("conf_tips_" + n, 2);
			$("#" + n + "_mode").text("常驻")
		} else if (util.readTipsconf(n) == 0) {
			localStorage.setItem("conf_tips_" + n, 0);
			$("#" + n + "_mode").text("隐藏")
		} else {
			localStorage.setItem("conf_tips_" + n, 1)
		}
		$("#btt_mode_" + n).on('click', function() {
			util.switchTipsconf(n)
		})
	},
	readTipsconf: function(n) {
		let stat = localStorage.getItem("conf_tips_" + n) - '0';
		return stat
	},
	//hitokoto,worldtime,studytime
	switchTipsconf: function(n) {
		if (util.readTipsconf(n) == null || util.readTipsconf(n) == 0) {
			localStorage.setItem("conf_tips_" + n, 1);
			$("#" + n + "_mode").text("轮换")
		} else if (util.readTipsconf(n) == 1 && n != "hitokoto") {
			localStorage.setItem("conf_tips_" + n, 2);
			$("#" + n + "_mode").text("常驻")
		} else {
			localStorage.setItem("conf_tips_" + n, 0);
			$("#" + n + "_mode").text("隐藏")
		}
	},
	Tips: {
		init: function() {
			$(".tips").html('').prepend('<p class="attention">开始认真学习/工作吧！</p>').append('<p class="hitokoto" style="display: none;">"<hitokoto id="hitokoto">获取一言中...(*/ω＼*)</hitokoto>"</p>');
			if (util.readTipsconf("worldtime") == 2) {
				$(".attention").after('<p class="worldtime" style="display: none;">现在时间是:<text id="worldtime">0分钟</text>...</p>');
				if (util.readTipsconf("studytime") == 2) {
					$(".worldtime").after('<p class="studytime" style="display: none;">已经学习<text id="studytime">0分钟</text>了呢...</p>')
				} else {
					$(".tips").append('<p class="studytime" style="display: none;">已经学习<text id="studytime">0分钟</text>了呢...</p>')
				}
			} else {
				if (util.readTipsconf("studytime") == 2) {
					$(".attention").after('<p class="studytime" style="display: none;">已经学习<text id="studytime">0分钟</text>了呢...</p>')
				} else {
					$(".tips").append('<p class="studytime" style="display: none;">已经学习<text id="studytime">0分钟</text>了呢...</p>')
				}
				$(".tips").append('<p class="worldtime" style="display: none;">现在时间是:<text id="worldtime">0分钟</text>...</p>')
			}
			util.Tips.start()
		},
		start: function() {
			attentionout = setTimeout(function() {
				$(".attention").fadeOut(200, "linear");
				if (util.readTipsconf("hitokoto") == 1) {
					tipsrollnow = "hitokoto"
				} else if (util.readTipsconf("worldtime") == 1) {
					tipsrollnow = "worldtime"
				} else if (util.readTipsconf("studytime") == 1) {
					tipsrollnow = "studytime"
				}
				if (util.readTipsconf("worldtime") == 2) {
					$(".worldtime").fadeIn(300, "linear")
				}
				if (util.readTipsconf("studytime") == 2) {
					$(".studytime").fadeIn(300, "linear")
				}
				util.Tips.roll();
			}, 6000)
		},
		roll: function() {
			if (util.readTipsconf(tipsrollnow) == 1) {
				if (tipsrollnow == "hitokoto") {
					if (util.readTipsconf("worldtime") == 1) {
						tipsrollnow = "worldtime"
					} else if (util.readTipsconf("studytime") == 1) {
						tipsrollnow = "studytime"
					}
					async function fetchHitokoto() {
						const hitokoto = document.querySelector('#hitokoto');
						hitokoto.innerText = "获取一言中...(*/ω＼*)";
						const response = await fetch('https://v1.hitokoto.cn/?c=d&c=i&c=k&max_length=10');
						const {
							uuid, hitokoto: hitokotoText
						} = await response.json();
						hitokoto.innerText = hitokotoText
					}
					fetchHitokoto();
					hitokotoin = setTimeout(function() {
						$(".hitokoto").fadeIn(300, "linear")
					}, 1300);
					hitokotoout = setTimeout(function() {
						$(".hitokoto").fadeOut(300, "linear")
					}, 8600)
				} else if (tipsrollnow == "worldtime") {
					if (util.readTipsconf("studytime") == 1) {
						tipsrollnow = "studytime"
					} else if (util.readTipsconf("hitokoto") == 1) {
						tipsrollnow = "hitokoto"
					}
					worldtimein = setTimeout(function() {
						$(".worldtime").fadeIn(300, "linear")
					}, 1300);
					worldtimeout = setTimeout(function() {
						$(".worldtime").fadeOut(300, "linear")
					}, 8600)
				} else {
					if (util.readTipsconf("hitokoto") == 1) {
						tipsrollnow = "hitokoto"
					} else if (util.readTipsconf("worldtime") == 1) {
						tipsrollnow = "worldtime"
					}
					studytimein = setTimeout(function() {
						$(".studytime").fadeIn(300, "linear")
					}, 1300);
					studytimeout = setTimeout(function() {
						$(".studytime").fadeOut(300, "linear")
					}, 8600)
				}
				rolltimeout = setTimeout(function() {
					util.Tips.roll()
				}, 10900)
			}
		},
		stop: function() {
			clearTimeout(rolltimeout);
			clearTimeout(hitokotoin);
			clearTimeout(hitokotoout);
			clearTimeout(worldtimein);
			clearTimeout(worldtimeout);
			clearTimeout(studytimein);
			clearTimeout(studytimeout);
			clearInterval(attentionout);
			$(".studytime").fadeOut(300, "linear");
			$(".hitokoto").fadeOut(300, "linear");
			$(".worldtime").fadeOut(300, "linear");
			setTimeout(function() {
				$(".attention").fadeIn(300, "linear")
			}, 300)
		}
	},

	//Tips END
	videoresize: function() {
		var ww = $(window).width(),
			wh = $(window).height(),
			vw = $("video").width(),
			vh = $("video").height();
		if (ww * 0.5625 >= wh) {
			$("video").css("height", "auto").css("width", ww).css("top", wh / 2 - $("video").height() / 2).css("left", "0")
		} else {
			$("video").css("height", wh).css("width", "auto").css("left", ww / 2 - $("video").width() / 2).css("top", "0")
		}
	},
	fullscreen: function(e) {
		util.checkFullscreen() ? document.webkitCancelFullScreen ? document.webkitCancelFullScreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.msExitFullscreen ? document.msExitFullscreen() : document.cancelFullScreen ? document.cancelFullScreen() : document.exitFullscreen && document.exitFullscreen() : (e ? "string" == typeof e && (e = document.getElementById(e)) : e = document.body, e.webkitRequestFullscreen ? e.webkitRequestFullscreen() : e.mozRequestFullScreen ? e.mozRequestFullScreen() : e.msRequestFullscreen ? e.msRequestFullscreen() : e.requestFullscreen && e.requestFullscreen())
	},
	checkFullscreen: function() {
		return !!(document.webkitFullscreenElement || document.mozFullScreenElement || document.mozFullScreenElement || document.msFullscreenElement || document.fullscreenElement)
	}
}, hour = minutes = seconds = recorded = sumhour = summinutes = sumseconds = tipstype = rolltimeout = worldtimein = worldtimeout = studytimein = studytimeout = hitokotoin = hitokotoout = attentionout = tipsrollnow = 0;
console.log("\n %c Study With Miku V1.0.3 %c 在干什么呢(・∀・(・∀・(・∀・*) \n", "color: #fadfa3; background: #030307; padding:5px 0;", "background: #fadfa3; padding:5px 0; color: #000")