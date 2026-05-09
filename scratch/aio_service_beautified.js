/*! For license information please see service.js.LICENSE.txt */
(() => {
  var e = {
      8616: (e, t, n) => {
        var i = {
          "./Czech.xml": 4959,
          "./Danish.xml": 1102,
          "./Dutch.xml": 2118,
          "./English.xml": 7190,
          "./Finnish.xml": 1324,
          "./French.xml": 8319,
          "./German.xml": 5669,
          "./Indonesia.xml": 5142,
          "./Italian.xml": 9362,
          "./Japanese.xml": 8690,
          "./Korean.xml": 1879,
          "./Norwegian.xml": 70,
          "./Polish.xml": 8204,
          "./Portuguese.xml": 6444,
          "./Romanian.xml": 9064,
          "./Russian.xml": 5140,
          "./Simplified Chinese.xml": 6065,
          "./Slovakian.xml": 5068,
          "./Spanish.xml": 737,
          "./Swedish.xml": 8141,
          "./Thai.xml": 7943,
          "./Traditional Chinese.xml": 29,
          "./Turkish.xml": 7111,
          "./Ukrainian.xml": 6761
        };

        function o(e) {
          var t = r(e);
          return n(t)
        }

        function r(e) {
          if (!n.o(i, e)) {
            var t = new Error("Cannot find module '" + e + "'");
            throw t.code = "MODULE_NOT_FOUND", t
          }
          return i[e]
        }
        o.keys = function() {
          return Object.keys(i)
        }, o.resolve = r, e.exports = o, o.id = 8616
      },
      9118: (e, t, n) => {
        e.exports = {
          parallel: n(9162),
          serial: n(1357),
          serialOrdered: n(9087)
        }
      },
      7651: e => {
        function t(e) {
          "function" == typeof this.jobs[e] && this.jobs[e]()
        }
        e.exports = function(e) {
          Object.keys(e.jobs).forEach(t.bind(e)), e.jobs = {}
        }
      },
      5912: (e, t, n) => {
        var i = n(9265);
        e.exports = function(e) {
          var t = !1;
          return i((function() {
              t = !0
            })),
            function(n, o) {
              t ? e(n, o) : i((function() {
                e(n, o)
              }))
            }
        }
      },
      9265: e => {
        e.exports = function(e) {
          var t = "function" == typeof setImmediate ? setImmediate : "object" == typeof process && "function" == typeof process.nextTick ? process.nextTick : null;
          t ? t(e) : setTimeout(e, 0)
        }
      },
      7594: (e, t, n) => {
        var i = n(5912),
          o = n(7651);
        e.exports = function(e, t, n, r) {
          var a = n.keyedList ? n.keyedList[n.index] : n.index;
          n.jobs[a] = function(e, t, n, o) {
            return 2 == e.length ? e(n, i(o)) : e(n, t, i(o))
          }(t, a, e[a], (function(e, t) {
            a in n.jobs && (delete n.jobs[a], e ? o(n) : n.results[a] = t, r(e, n.results))
          }))
        }
      },
      4528: e => {
        e.exports = function(e, t) {
          var n = !Array.isArray(e),
            i = {
              index: 0,
              keyedList: n || t ? Object.keys(e) : null,
              jobs: {},
              results: n ? {} : [],
              size: n ? Object.keys(e).length : e.length
            };
          return t && i.keyedList.sort(n ? t : function(n, i) {
            return t(e[n], e[i])
          }), i
        }
      },
      5353: (e, t, n) => {
        var i = n(7651),
          o = n(5912);
        e.exports = function(e) {
          Object.keys(this.jobs).length && (this.index = this.size, i(this), o(e)(null, this.results))
        }
      },
      9162: (e, t, n) => {
        var i = n(7594),
          o = n(4528),
          r = n(5353);
        e.exports = function(e, t, n) {
          for (var a = o(e); a.index < (a.keyedList || e).length;) i(e, t, a, (function(e, t) {
            e ? n(e, t) : 0 !== Object.keys(a.jobs).length || n(null, a.results)
          })), a.index++;
          return r.bind(a, n)
        }
      },
      1357: (e, t, n) => {
        var i = n(9087);
        e.exports = function(e, t, n) {
          return i(e, t, null, n)
        }
      },
      9087: (e, t, n) => {
        var i = n(7594),
          o = n(4528),
          r = n(5353);

        function a(e, t) {
          return e < t ? -1 : e > t ? 1 : 0
        }
        e.exports = function(e, t, n, a) {
          var s = o(e, n);
          return i(e, t, s, (function n(o, r) {
            o ? a(o, r) : (s.index++, s.index < (s.keyedList || e).length ? i(e, t, s, n) : a(null, s.results))
          })), r.bind(s, a)
        }, e.exports.ascending = a, e.exports.descending = function(e, t) {
          return -1 * a(e, t)
        }
      },
      1505: (e, t, n) => {
        "use strict";
        n.d(t, {
          Z: () => d
        });
        var i = n(8416),
          o = n.n(i),
          r = n(215);

        function a(e, t) {
          var n = Object.keys(e);
          if (Object.getOwnPropertySymbols) {
            var i = Object.getOwnPropertySymbols(e);
            t && (i = i.filter((function(t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable
            }))), n.push.apply(n, i)
          }
          return n
        }

        function s(e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = null != arguments[t] ? arguments[t] : {};
            t % 2 ? a(Object(n), !0).forEach((function(t) {
              o()(e, t, n[t])
            })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : a(Object(n)).forEach((function(t) {
              Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
            }))
          }
          return e
        }
        var c = {
            settings: {
              deviceRole: "deviceService",
              caps: {
                device: "ROG FAN XPERT 4",
                guid: "2dfe216d-3481-4684-ad4d-2566bd7cfe4f",
                productName: "fanXpert",
                deviceType: "50",
                theme: "rog",
                multiCompilerList: [{
                  theme: "rog"
                }, {
                  theme: "tuf"
                }, {
                  theme: "asus"
                }, {
                  theme: "proart"
                }],
                profileCount: 1,
                disableAlertPage: !1,
                deviceProps: {
                  isForceLoading: !0
                },
                functionList: [{
                  id: "FanControl",
                  text: "Fan Control",
                  langRef: "row_517"
                }],
                capsFunctionList: {
                  hasFanControl: !0
                },
                fanControl: {
                  hasMasterSwitch: !0,
                  hasFanTuning: !0,
                  hasApplyTo: !1,
                  enableSelectTemp: !0,
                  hasDefaultBtn: !1,
                  hasResetBtn: !1,
                  hasFanSpinUp: !0,
                  hasPowerLimit: !0,
                  hasDoNotShow: !1,
                  rpmTooltip: null,
                  fanProfileDefaultBtn: !1,
                  isStopFanInfoByRpmMode: !0,
                  isSetGetFanInfoEvent: !0,
                  fanInfoEventTimer: 3,
                  spinLevel: {
                    maxVal: 0,
                    minVal: 3,
                    step: 1
                  },
                  settingList: [{
                    id: "3",
                    name: "row_519",
                    iconType: "fanProfileSilent"
                  }, {
                    id: "2",
                    name: "row_520",
                    iconType: "fanProfileStandard"
                  }, {
                    id: "1",
                    name: "row_521",
                    iconType: "fanProfileTurbo"
                  }, {
                    id: "0",
                    name: "row_522",
                    iconType: "fanProfileFullSpeed"
                  }],
                  fanType: {
                    NORMAL: "0",
                    PLC: "1"
                  },
                  skipPumpName: ["Water Pump", "W_PUMP+", "PUMP"]
                }
              },
              defaultSettings: {
                fanControl: {
                  isAsusHydranode: !1,
                  defaultModes: [{
                    id: "3",
                    settings: [{
                      mode: "1",
                      nodes: [{
                        index: 0,
                        temperature: "50",
                        percentage: "20"
                      }, {
                        index: 1,
                        temperature: "70",
                        percentage: "60"
                      }, {
                        index: 2,
                        temperature: "75",
                        percentage: "100"
                      }],
                      spinUpLevel: "2",
                      spinDownLevel: "2"
                    }, {
                      mode: "0",
                      rpmPercentage: 40,
                      rpm: null
                    }]
                  }, {
                    id: "2",
                    settings: [{
                      mode: "1",
                      nodes: [{
                        index: 0,
                        temperature: "30",
                        percentage: "30"
                      }, {
                        index: 1,
                        temperature: "60",
                        percentage: "60"
                      }, {
                        index: 2,
                        temperature: "75",
                        percentage: "100"
                      }],
                      spinUpLevel: "2",
                      spinDownLevel: "2"
                    }, {
                      mode: "0",
                      rpmPercentage: 60,
                      rpm: null
                    }]
                  }, {
                    id: "1",
                    settings: [{
                      mode: "1",
                      nodes: [{
                        index: 0,
                        temperature: "40",
                        percentage: "40"
                      }, {
                        index: 1,
                        temperature: "60",
                        percentage: "70"
                      }, {
                        index: 2,
                        temperature: "75",
                        percentage: "100"
                      }],
                      spinUpLevel: "2",
                      spinDownLevel: "2"
                    }, {
                      mode: "0",
                      rpmPercentage: 80,
                      rpm: null
                    }]
                  }, {
                    id: "0",
                    default: !0,
                    settings: [{
                      mode: "1",
                      nodes: [{
                        index: 0,
                        temperature: "30",
                        percentage: "100"
                      }, {
                        index: 1,
                        temperature: "60",
                        percentage: "100"
                      }, {
                        index: 2,
                        temperature: "75",
                        percentage: "100"
                      }],
                      spinUpLevel: "2",
                      spinDownLevel: "2"
                    }, {
                      mode: "0",
                      rpmPercentage: 100,
                      rpm: null
                    }]
                  }]
                }
              },
              version: "4.02.08",
              modelNumber: "2dfe216d-3481-4684-ad4d-2566bd7cfe4f",
              deviceType: "50",
              alertSocketServer: "ws://127.0.0.1:9013",
              logSocketServer: "ws://127.0.0.1:9014",
              libVersion: "1",
              apiVersion: "1",
              url: "type/50/model/2dfe216d-3481-4684-ad4d-2566bd7cfe4f"
            }
          },
          p = c.settings,
          u = n.n(r)()(c, ["settings"]),
          l = s(s({}, p), function() {
            var e, t, n, i, r, a = null;
            a = void 0 !== (null === (e = globalThis) || void 0 === e ? void 0 : e.location) ? null === (t = globalThis) || void 0 === t || null === (n = t.location) || void 0 === n ? void 0 : n.host : null !== (i = null === (r = process.argv.find((function(e) {
              return /host=/gm.test(e)
            }))) || void 0 === r ? void 0 : r.split("=")[1]) && void 0 !== i ? i : "127.0.0.1:1042";
            var c = p.url,
              u = p.apiVersion,
              l = p.libVersion,
              d = "http://".concat(a),
              f = function(e, t, n, i) {
                if (void 0 === n) return o()({}, e, "".concat(d, "/").concat(i));
                var r = Array.isArray(n) ? n : [n],
                  a = {};
                return r.forEach((function(n, o) {
                  var r = "".concat(e).concat(0 === o ? "" : o);
                  a[r] = "".concat(d, "/").concat(t, "/").concat(n, "/").concat(i)
                })), a
              },
              m = f("url", "api", u, c),
              h = f("libUrl", "lib", l, c),
              v = f("dataCollectUrl", "lib", l, "".concat(c, "/collect"));
            return s(s(s({
              baseUrl: d,
              ws: "ws://".concat(a)
            }, m), h), v)
          }());
        const d = s({
          settings: l
        }, u)
      },
      2849: (e, t, n) => {
        var i;
        t.formatArgs = function(t) {
          if (t[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + t[0] + (this.useColors ? "%c " : " ") + "+" + e.exports.humanize(this.diff), this.useColors) {
            var n = "color: " + this.color;
            t.splice(1, 0, n, "color: inherit");
            var i = 0,
              o = 0;
            t[0].replace(/%[a-zA-Z%]/g, (function(e) {
              "%%" !== e && (i++, "%c" === e && (o = i))
            })), t.splice(o, 0, n)
          }
        }, t.save = function(e) {
          try {
            e ? t.storage.setItem("debug", e) : t.storage.removeItem("debug")
          } catch (e) {}
        }, t.load = function() {
          var e;
          try {
            e = t.storage.getItem("debug")
          } catch (e) {}
          return !e && "undefined" != typeof process && "env" in process && (e = process.env.DEBUG), e
        }, t.useColors = function() {
          return !("undefined" == typeof globalThis || !globalThis.process || "renderer" !== globalThis.process.type && !globalThis.process.__nwjs) || ("undefined" == typeof navigator || !navigator.userAgent || !navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) && ("undefined" != typeof document && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || "undefined" != typeof globalThis && globalThis.console && (globalThis.console.firebug || globalThis.console.exception && globalThis.console.table) || "undefined" != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || "undefined" != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/))
        }, t.storage = function() {
          try {
            return localStorage
          } catch (e) {}
        }(), t.destroy = (i = !1, function() {
          i || (i = !0, console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."))
        }), t.colors = ["#0000CC", "#0000FF", "#0033CC", "#0033FF", "#0066CC", "#0066FF", "#0099CC", "#0099FF", "#00CC00", "#00CC33", "#00CC66", "#00CC99", "#00CCCC", "#00CCFF", "#3300CC", "#3300FF", "#3333CC", "#3333FF", "#3366CC", "#3366FF", "#3399CC", "#3399FF", "#33CC00", "#33CC33", "#33CC66", "#33CC99", "#33CCCC", "#33CCFF", "#6600CC", "#6600FF", "#6633CC", "#6633FF", "#66CC00", "#66CC33", "#9900CC", "#9900FF", "#9933CC", "#9933FF", "#99CC00", "#99CC33", "#CC0000", "#CC0033", "#CC0066", "#CC0099", "#CC00CC", "#CC00FF", "#CC3300", "#CC3333", "#CC3366", "#CC3399", "#CC33CC", "#CC33FF", "#CC6600", "#CC6633", "#CC9900", "#CC9933", "#CCCC00", "#CCCC33", "#FF0000", "#FF0033", "#FF0066", "#FF0099", "#FF00CC", "#FF00FF", "#FF3300", "#FF3333", "#FF3366", "#FF3399", "#FF33CC", "#FF33FF", "#FF6600", "#FF6633", "#FF9900", "#FF9933", "#FFCC00", "#FFCC33"], t.log = console.debug || console.log || function() {}, e.exports = n(6180)(t), e.exports.formatters.j = function(e) {
          try {
            return JSON.stringify(e)
          } catch (e) {
            return "[UnexpectedJSONParseError]: " + e.message
          }
        }
      },
      6180: (e, t, n) => {
        "use strict";
        n.r(t);
        var i = n(861),
          o = n.n(i);
        (e = n.hmd(e)).exports = function(e) {
          function t(e) {
            var n, o, r, a = null;

            function s() {
              for (var e = arguments.length, i = new Array(e), o = 0; o < e; o++) i[o] = arguments[o];
              if (s.enabled) {
                var r = s,
                  a = Number(new Date),
                  c = a - (n || a);
                r.diff = c, r.prev = n, r.curr = a, n = a, i[0] = t.coerce(i[0]), "string" != typeof i[0] && i.unshift("%O");
                var p = 0;
                i[0] = i[0].replace(/%([a-zA-Z%])/g, (function(e, n) {
                  if ("%%" === e) return "%";
                  p++;
                  var o = t.formatters[n];
                  if ("function" == typeof o) {
                    var a = i[p];
                    e = o.call(r, a), i.splice(p, 1), p--
                  }
                  return e
                })), t.formatArgs.call(r, i), (r.log || t.log).apply(r, i)
              }
            }
            return s.namespace = e, s.useColors = t.useColors(), s.color = t.selectColor(e), s.extend = i, s.destroy = t.destroy, Object.defineProperty(s, "enabled", {
              enumerable: !0,
              configurable: !1,
              get: function() {
                return null !== a ? a : (o !== t.namespaces && (o = t.namespaces, r = t.enabled(e)), r)
              },
              set: function(e) {
                a = e
              }
            }), "function" == typeof t.init && t.init(s), s
          }

          function i(e, n) {
            var i = t(this.namespace + (void 0 === n ? ":" : n) + e);
            return i.log = this.log, i
          }

          function r(e) {
            return e.toString().substring(2, e.toString().length - 2).replace(/\.\*\?$/, "*")
          }
          return t.debug = t, t.default = t, t.coerce = function(e) {
            return e instanceof Error ? e.stack || e.message : e
          }, t.disable = function() {
            var e = [].concat(o()(t.names.map(r)), o()(t.skips.map(r).map((function(e) {
              return "-" + e
            })))).join(",");
            return t.enable(""), e
          }, t.enable = function(e) {
            var n;
            t.save(e), t.namespaces = e, t.names = [], t.skips = [];
            var i = ("string" == typeof e ? e : "").split(/[\s,]+/),
              o = i.length;
            for (n = 0; n < o; n++) i[n] && ("-" === (e = i[n].replace(/\*/g, ".*?"))[0] ? t.skips.push(new RegExp("^" + e.slice(1) + "$")) : t.names.push(new RegExp("^" + e + "$")))
          }, t.enabled = function(e) {
            if ("*" === e[e.length - 1]) return !0;
            var n, i;
            for (n = 0, i = t.skips.length; n < i; n++)
              if (t.skips[n].test(e)) return !1;
            for (n = 0, i = t.names.length; n < i; n++)
              if (t.names[n].test(e)) return !0;
            return !1
          }, t.humanize = n(7824), t.destroy = function() {
            console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.")
          }, Object.keys(e).forEach((function(n) {
            t[n] = e[n]
          })), t.names = [], t.skips = [], t.formatters = {}, t.selectColor = function(e) {
            for (var n = 0, i = 0; i < e.length; i++) n = (n << 5) - n + e.charCodeAt(i), n |= 0;
            return t.colors[Math.abs(n) % t.colors.length]
          }, t.enable(t.load()), t
        }
      },
      9075: (e, t, n) => {
        "undefined" == typeof process || "renderer" === process.type || !0 === process.browser || process.__nwjs ? e.exports = n(2849) : e.exports = n(8145)
      },
      8145: (e, t, n) => {
        var i = n(6224),
          o = n(3837);
        t.init = function(e) {
          e.inspectOpts = {};
          for (var n = Object.keys(t.inspectOpts), i = 0; i < n.length; i++) e.inspectOpts[n[i]] = t.inspectOpts[n[i]]
        }, t.log = function() {
          return process.stderr.write(o.format.apply(o, arguments) + "\n")
        }, t.formatArgs = function(n) {
          var i = this.namespace;
          if (this.useColors) {
            var o = this.color,
              r = "[3" + (o < 8 ? o : "8;5;" + o),
              a = "  ".concat(r, ";1m").concat(i, " [0m");
            n[0] = a + n[0].split("\n").join("\n" + a), n.push(r + "m+" + e.exports.humanize(this.diff) + "[0m")
          } else n[0] = (t.inspectOpts.hideDate ? "" : (new Date).toISOString() + " ") + i + " " + n[0]
        }, t.save = function(e) {
          e ? process.env.DEBUG = e : delete process.env.DEBUG
        }, t.load = function() {
          return process.env.DEBUG
        }, t.useColors = function() {
          return "colors" in t.inspectOpts ? Boolean(t.inspectOpts.colors) : i.isatty(process.stderr.fd)
        }, t.destroy = o.deprecate((function() {}), "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."), t.colors = [6, 2, 3, 4, 5, 1];
        try {
          var r = n(2130);
          r && (r.stderr || r).level >= 2 && (t.colors = [20, 21, 26, 27, 32, 33, 38, 39, 40, 41, 42, 43, 44, 45, 56, 57, 62, 63, 68, 69, 74, 75, 76, 77, 78, 79, 80, 81, 92, 93, 98, 99, 112, 113, 128, 129, 134, 135, 148, 149, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 178, 179, 184, 185, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 214, 215, 220, 221])
        } catch (e) {}
        t.inspectOpts = Object.keys(process.env).filter((function(e) {
          return /^debug_/i.test(e)
        })).reduce((function(e, t) {
          var n = t.substring(6).toLowerCase().replace(/_([a-z])/g, (function(e, t) {
              return t.toUpperCase()
            })),
            i = process.env[t];
          return i = !!/^(yes|on|true|enabled)$/i.test(i) || !/^(no|off|false|disabled)$/i.test(i) && ("null" === i ? null : Number(i)), e[n] = i, e
        }), {}), e.exports = n(6180)(t);
        var a = e.exports.formatters;
        a.o = function(e) {
          return this.inspectOpts.colors = this.useColors, o.inspect(e, this.inspectOpts).split("\n").map((function(e) {
            return e.trim()
          })).join(" ")
        }, a.O = function(e) {
          return this.inspectOpts.colors = this.useColors, o.inspect(e, this.inspectOpts)
        }
      },
      9779: (e, t, n) => {
        var i = n(3837),
          o = n(2781).Stream,
          r = n(3463);

        function a() {
          this.writable = !1, this.readable = !0, this.dataSize = 0, this.maxDataSize = 2097152, this.pauseStreams = !0, this._released = !1, this._streams = [], this._currentStream = null, this._insideLoop = !1, this._pendingNext = !1
        }
        e.exports = a, i.inherits(a, o), a.create = function(e) {
          var t = new this;
          for (var n in e = e || {}) t[n] = e[n];
          return t
        }, a.isStreamLike = function(e) {
          return "function" != typeof e && "string" != typeof e && "boolean" != typeof e && "number" != typeof e && !Buffer.isBuffer(e)
        }, a.prototype.append = function(e) {
          if (a.isStreamLike(e)) {
            if (!(e instanceof r)) {
              var t = r.create(e, {
                maxDataSize: 1 / 0,
                pauseStream: this.pauseStreams
              });
              e.on("data", this._checkDataSize.bind(this)), e = t
            }
            this._handleErrors(e), this.pauseStreams && e.pause()
          }
          return this._streams.push(e), this
        }, a.prototype.pipe = function(e, t) {
          return o.prototype.pipe.call(this, e, t), this.resume(), e
        }, a.prototype._getNext = function() {
          if (this._currentStream = null, this._insideLoop) this._pendingNext = !0;
          else {
            this._insideLoop = !0;
            try {
              do {
                this._pendingNext = !1, this._realGetNext()
              } while (this._pendingNext)
            } finally {
              this._insideLoop = !1
            }
          }
        }, a.prototype._realGetNext = function() {
          var e = this._streams.shift();
          void 0 !== e ? "function" == typeof e ? e(function(e) {
            a.isStreamLike(e) && (e.on("data", this._checkDataSize.bind(this)), this._handleErrors(e)), this._pipeNext(e)
          }.bind(this)) : this._pipeNext(e) : this.end()
        }, a.prototype._pipeNext = function(e) {
          if (this._currentStream = e, a.isStreamLike(e)) return e.on("end", this._getNext.bind(this)), void e.pipe(this, {
            end: !1
          });
          var t = e;
          this.write(t), this._getNext()
        }, a.prototype._handleErrors = function(e) {
          var t = this;
          e.on("error", (function(e) {
            t._emitError(e)
          }))
        }, a.prototype.write = function(e) {
          this.emit("data", e)
        }, a.prototype.pause = function() {
          this.pauseStreams && (this.pauseStreams && this._currentStream && "function" == typeof this._currentStream.pause && this._currentStream.pause(), this.emit("pause"))
        }, a.prototype.resume = function() {
          this._released || (this._released = !0, this.writable = !0, this._getNext()), this.pauseStreams && this._currentStream && "function" == typeof this._currentStream.resume && this._currentStream.resume(), this.emit("resume")
        }, a.prototype.end = function() {
          this._reset(), this.emit("end")
        }, a.prototype.destroy = function() {
          this._reset(), this.emit("close")
        }, a.prototype._reset = function() {
          this.writable = !1, this._streams = [], this._currentStream = null
        }, a.prototype._checkDataSize = function() {
          if (this._updateDataSize(), !(this.dataSize <= this.maxDataSize)) {
            var e = "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.";
            this._emitError(new Error(e))
          }
        }, a.prototype._updateDataSize = function() {
          this.dataSize = 0;
          var e = this;
          this._streams.forEach((function(t) {
            t.dataSize && (e.dataSize += t.dataSize)
          })), this._currentStream && this._currentStream.dataSize && (this.dataSize += this._currentStream.dataSize)
        }, a.prototype._emitError = function(e) {
          this._reset(), this.emit("error", e)
        }
      },
      3463: (e, t, n) => {
        var i = n(2781).Stream,
          o = n(3837);

        function r() {
          this.source = null, this.dataSize = 0, this.maxDataSize = 1048576, this.pauseStream = !0, this._maxDataSizeExceeded = !1, this._released = !1, this._bufferedEvents = []
        }
        e.exports = r, o.inherits(r, i), r.create = function(e, t) {
          var n = new this;
          for (var i in t = t || {}) n[i] = t[i];
          n.source = e;
          var o = e.emit;
          return e.emit = function() {
            return n._handleEmit(arguments), o.apply(e, arguments)
          }, e.on("error", (function() {})), n.pauseStream && e.pause(), n
        }, Object.defineProperty(r.prototype, "readable", {
          configurable: !0,
          enumerable: !0,
          get: function() {
            return this.source.readable
          }
        }), r.prototype.setEncoding = function() {
          return this.source.setEncoding.apply(this.source, arguments)
        }, r.prototype.resume = function() {
          this._released || this.release(), this.source.resume()
        }, r.prototype.pause = function() {
          this.source.pause()
        }, r.prototype.release = function() {
          this._released = !0, this._bufferedEvents.forEach(function(e) {
            this.emit.apply(this, e)
          }.bind(this)), this._bufferedEvents = []
        }, r.prototype.pipe = function() {
          var e = i.prototype.pipe.apply(this, arguments);
          return this.resume(), e
        }, r.prototype._handleEmit = function(e) {
          this._released ? this.emit.apply(this, e) : ("data" === e[0] && (this.dataSize += e[1].length, this._checkIfMaxDataSizeExceeded()), this._bufferedEvents.push(e))
        }, r.prototype._checkIfMaxDataSizeExceeded = function() {
          if (!(this._maxDataSizeExceeded || this.dataSize <= this.maxDataSize)) {
            this._maxDataSizeExceeded = !0;
            var e = "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.";
            this.emit("error", new Error(e))
          }
        }
      },
      2261: (e, t, n) => {
        var i;
        e.exports = function() {
          if (!i) {
            try {
              i = n(9075)("follow-redirects")
            } catch (e) {}
            "function" != typeof i && (i = function() {})
          }
          i.apply(null, arguments)
        }
      },
      938: (e, t, n) => {
        var i = n(7310),
          o = i.URL,
          r = n(3685),
          a = n(5687),
          s = n(2781).Writable,
          c = n(9491),
          p = n(2261),
          u = ["abort", "aborted", "connect", "error", "socket", "timeout"],
          l = Object.create(null);
        u.forEach((function(e) {
          l[e] = function(t, n, i) {
            this._redirectable.emit(e, t, n, i)
          }
        }));
        var d = _("ERR_INVALID_URL", "Invalid URL", TypeError),
          f = _("ERR_FR_REDIRECTION_FAILURE", "Redirected request failed"),
          m = _("ERR_FR_TOO_MANY_REDIRECTS", "Maximum number of redirects exceeded"),
          h = _("ERR_FR_MAX_BODY_LENGTH_EXCEEDED", "Request body larger than maxBodyLength limit"),
          v = _("ERR_STREAM_WRITE_AFTER_END", "write after end");

        function g(e, t) {
          s.call(this), this._sanitizeOptions(e), this._options = e, this._ended = !1, this._ending = !1, this._redirectCount = 0, this._redirects = [], this._requestBodyLength = 0, this._requestBodyBuffers = [], t && this.on("response", t);
          var n = this;
          this._onNativeResponse = function(e) {
            n._processResponse(e)
          }, this._performRequest()
        }

        function x(e) {
          var t = {
              maxRedirects: 21,
              maxBodyLength: 10485760
            },
            n = {};
          return Object.keys(e).forEach((function(r) {
            var a = r + ":",
              s = n[a] = e[r],
              u = t[r] = Object.create(s);
            Object.defineProperties(u, {
              request: {
                value: function(e, r, s) {
                  if (S(e)) {
                    var u;
                    try {
                      u = y(new o(e))
                    } catch (t) {
                      u = i.parse(e)
                    }
                    if (!S(u.protocol)) throw new d({
                      input: e
                    });
                    e = u
                  } else o && e instanceof o ? e = y(e) : (s = r, r = e, e = {
                    protocol: a
                  });
                  return O(r) && (s = r, r = null), (r = Object.assign({
                    maxRedirects: t.maxRedirects,
                    maxBodyLength: t.maxBodyLength
                  }, e, r)).nativeProtocols = n, S(r.host) || S(r.hostname) || (r.hostname = "::1"), c.equal(r.protocol, a, "protocol mismatch"), p("options", r), new g(r, s)
                },
                configurable: !0,
                enumerable: !0,
                writable: !0
              },
              get: {
                value: function(e, t, n) {
                  var i = u.request(e, t, n);
                  return i.end(), i
                },
                configurable: !0,
                enumerable: !0,
                writable: !0
              }
            })
          })), t
        }

        function b() {}

        function y(e) {
          var t = {
            protocol: e.protocol,
            hostname: e.hostname.startsWith("[") ? e.hostname.slice(1, -1) : e.hostname,
            hash: e.hash,
            search: e.search,
            pathname: e.pathname,
            path: e.pathname + e.search,
            href: e.href
          };
          return "" !== e.port && (t.port = Number(e.port)), t
        }

        function w(e, t) {
          var n;
          for (var i in t) e.test(i) && (n = t[i], delete t[i]);
          return null == n ? void 0 : String(n).trim()
        }

        function _(e, t, n) {
          function i(n) {
            Error.captureStackTrace(this, this.constructor), Object.assign(this, n || {}), this.code = e, this.message = this.cause ? t + ": " + this.cause.message : t
          }
          return i.prototype = new(n || Error), i.prototype.constructor = i, i.prototype.name = "Error [" + e + "]", i
        }

        function E(e) {
          for (var t of u) e.removeListener(t, l[t]);
          e.on("error", b), e.abort()
        }

        function S(e) {
          return "string" == typeof e || e instanceof String
        }

        function O(e) {
          return "function" == typeof e
        }
        g.prototype = Object.create(s.prototype), g.prototype.abort = function() {
          E(this._currentRequest), this.emit("abort")
        }, g.prototype.write = function(e, t, n) {
          if (this._ending) throw new v;
          if (!(S(e) || "object" == typeof(i = e) && "length" in i)) throw new TypeError("data should be a string, Buffer or Uint8Array");
          var i;
          O(t) && (n = t, t = null), 0 !== e.length ? this._requestBodyLength + e.length <= this._options.maxBodyLength ? (this._requestBodyLength += e.length, this._requestBodyBuffers.push({
            data: e,
            encoding: t
          }), this._currentRequest.write(e, t, n)) : (this.emit("error", new h), this.abort()) : n && n()
        }, g.prototype.end = function(e, t, n) {
          if (O(e) ? (n = e, e = t = null) : O(t) && (n = t, t = null), e) {
            var i = this,
              o = this._currentRequest;
            this.write(e, t, (function() {
              i._ended = !0, o.end(null, null, n)
            })), this._ending = !0
          } else this._ended = this._ending = !0, this._currentRequest.end(null, null, n)
        }, g.prototype.setHeader = function(e, t) {
          this._options.headers[e] = t, this._currentRequest.setHeader(e, t)
        }, g.prototype.removeHeader = function(e) {
          delete this._options.headers[e], this._currentRequest.removeHeader(e)
        }, g.prototype.setTimeout = function(e, t) {
          var n = this;

          function i(t) {
            t.setTimeout(e), t.removeListener("timeout", t.destroy), t.addListener("timeout", t.destroy)
          }

          function o(t) {
            n._timeout && clearTimeout(n._timeout), n._timeout = setTimeout((function() {
              n.emit("timeout"), r()
            }), e), i(t)
          }

          function r() {
            n._timeout && (clearTimeout(n._timeout), n._timeout = null), n.removeListener("abort", r), n.removeListener("error", r), n.removeListener("response", r), t && n.removeListener("timeout", t), n.socket || n._currentRequest.removeListener("socket", o)
          }
          return t && this.on("timeout", t), this.socket ? o(this.socket) : this._currentRequest.once("socket", o), this.on("socket", i), this.on("abort", r), this.on("error", r), this.on("response", r), this
        }, ["flushHeaders", "getHeader", "setNoDelay", "setSocketKeepAlive"].forEach((function(e) {
          g.prototype[e] = function(t, n) {
            return this._currentRequest[e](t, n)
          }
        })), ["aborted", "connection", "socket"].forEach((function(e) {
          Object.defineProperty(g.prototype, e, {
            get: function() {
              return this._currentRequest[e]
            }
          })
        })), g.prototype._sanitizeOptions = function(e) {
          if (e.headers || (e.headers = {}), e.host && (e.hostname || (e.hostname = e.host), delete e.host), !e.pathname && e.path) {
            var t = e.path.indexOf("?");
            t < 0 ? e.pathname = e.path : (e.pathname = e.path.substring(0, t), e.search = e.path.substring(t))
          }
        }, g.prototype._performRequest = function() {
          var e = this._options.protocol,
            t = this._options.nativeProtocols[e];
          if (t) {
            if (this._options.agents) {
              var n = e.slice(0, -1);
              this._options.agent = this._options.agents[n]
            }
            var o = this._currentRequest = t.request(this._options, this._onNativeResponse);
            for (var r of (o._redirectable = this, u)) o.on(r, l[r]);
            if (this._currentUrl = /^\//.test(this._options.path) ? i.format(this._options) : this._options.path, this._isRedirect) {
              var a = 0,
                s = this,
                c = this._requestBodyBuffers;
              ! function e(t) {
                if (o === s._currentRequest)
                  if (t) s.emit("error", t);
                  else if (a < c.length) {
                  var n = c[a++];
                  o.finished || o.write(n.data, n.encoding, e)
                } else s._ended && o.end()
              }()
            }
          } else this.emit("error", new TypeError("Unsupported protocol " + e))
        }, g.prototype._processResponse = function(e) {
          var t = e.statusCode;
          this._options.trackRedirects && this._redirects.push({
            url: this._currentUrl,
            headers: e.headers,
            statusCode: t
          });
          var n = e.headers.location;
          if (!n || !1 === this._options.followRedirects || t < 300 || t >= 400) return e.responseUrl = this._currentUrl, e.redirects = this._redirects, this.emit("response", e), void(this._requestBodyBuffers = []);
          if (E(this._currentRequest), e.destroy(), ++this._redirectCount > this._options.maxRedirects) this.emit("error", new m);
          else {
            var o, r = this._options.beforeRedirect;
            r && (o = Object.assign({
              Host: e.req.getHeader("host")
            }, this._options.headers));
            var a = this._options.method;
            ((301 === t || 302 === t) && "POST" === this._options.method || 303 === t && !/^(?:GET|HEAD)$/.test(this._options.method)) && (this._options.method = "GET", this._requestBodyBuffers = [], w(/^content-/i, this._options.headers));
            var s, u = w(/^host$/i, this._options.headers),
              l = i.parse(this._currentUrl),
              d = u || l.host,
              h = /^\w+:/.test(n) ? this._currentUrl : i.format(Object.assign(l, {
                host: d
              }));
            try {
              s = i.resolve(h, n)
            } catch (e) {
              return void this.emit("error", new f({
                cause: e
              }))
            }
            p("redirecting to", s), this._isRedirect = !0;
            var v = i.parse(s);
            if (Object.assign(this._options, v), (v.protocol !== l.protocol && "https:" !== v.protocol || v.host !== d && ! function(e, t) {
                c(S(e) && S(t));
                var n = e.length - t.length - 1;
                return n > 0 && "." === e[n] && e.endsWith(t)
              }(v.host, d)) && w(/^(?:authorization|cookie)$/i, this._options.headers), O(r)) {
              var g = {
                  headers: e.headers,
                  statusCode: t
                },
                x = {
                  url: h,
                  method: a,
                  headers: o
                };
              try {
                r(this._options, g, x)
              } catch (e) {
                return void this.emit("error", e)
              }
              this._sanitizeOptions(this._options)
            }
            try {
              this._performRequest()
            } catch (e) {
              this.emit("error", new f({
                cause: e
              }))
            }
          }
        }, e.exports = x({
          http: r,
          https: a
        }), e.exports.wrap = x
      },
      6882: (e, t, n) => {
        var i = n(9779),
          o = n(3837),
          r = n(1017),
          a = n(3685),
          s = n(5687),
          c = n(7310).parse,
          p = n(7147),
          u = n(2781).Stream,
          l = n(983),
          d = n(9118),
          f = n(2275);

        function m(e) {
          if (!(this instanceof m)) return new m(e);
          for (var t in this._overheadLength = 0, this._valueLength = 0, this._valuesToMeasure = [], i.call(this), e = e || {}) this[t] = e[t]
        }
        e.exports = m, o.inherits(m, i), m.LINE_BREAK = "\r\n", m.DEFAULT_CONTENT_TYPE = "application/octet-stream", m.prototype.append = function(e, t, n) {
          "string" == typeof(n = n || {}) && (n = {
            filename: n
          });
          var r = i.prototype.append.bind(this);
          if ("number" == typeof t && (t = "" + t), o.isArray(t)) this._error(new Error("Arrays are not supported."));
          else {
            var a = this._multiPartHeader(e, t, n),
              s = this._multiPartFooter();
            r(a), r(t), r(s), this._trackLength(a, t, n)
          }
        }, m.prototype._trackLength = function(e, t, n) {
          var i = 0;
          null != n.knownLength ? i += +n.knownLength : Buffer.isBuffer(t) ? i = t.length : "string" == typeof t && (i = Buffer.byteLength(t)), this._valueLength += i, this._overheadLength += Buffer.byteLength(e) + m.LINE_BREAK.length, t && (t.path || t.readable && t.hasOwnProperty("httpVersion") || t instanceof u) && (n.knownLength || this._valuesToMeasure.push(t))
        }, m.prototype._lengthRetriever = function(e, t) {
          e.hasOwnProperty("fd") ? null != e.end && e.end != 1 / 0 && null != e.start ? t(null, e.end + 1 - (e.start ? e.start : 0)) : p.stat(e.path, (function(n, i) {
            var o;
            n ? t(n) : (o = i.size - (e.start ? e.start : 0), t(null, o))
          })) : e.hasOwnProperty("httpVersion") ? t(null, +e.headers["content-length"]) : e.hasOwnProperty("httpModule") ? (e.on("response", (function(n) {
            e.pause(), t(null, +n.headers["content-length"])
          })), e.resume()) : t("Unknown stream")
        }, m.prototype._multiPartHeader = function(e, t, n) {
          if ("string" == typeof n.header) return n.header;
          var i, o = this._getContentDisposition(t, n),
            r = this._getContentType(t, n),
            a = "",
            s = {
              "Content-Disposition": ["form-data", 'name="' + e + '"'].concat(o || []),
              "Content-Type": [].concat(r || [])
            };
          for (var c in "object" == typeof n.header && f(s, n.header), s) s.hasOwnProperty(c) && null != (i = s[c]) && (Array.isArray(i) || (i = [i]), i.length && (a += c + ": " + i.join("; ") + m.LINE_BREAK));
          return "--" + this.getBoundary() + m.LINE_BREAK + a + m.LINE_BREAK
        }, m.prototype._getContentDisposition = function(e, t) {
          var n, i;
          return "string" == typeof t.filepath ? n = r.normalize(t.filepath).replace(/\\/g, "/") : t.filename || e.name || e.path ? n = r.basename(t.filename || e.name || e.path) : e.readable && e.hasOwnProperty("httpVersion") && (n = r.basename(e.client._httpMessage.path || "")), n && (i = 'filename="' + n + '"'), i
        }, m.prototype._getContentType = function(e, t) {
          var n = t.contentType;
          return !n && e.name && (n = l.lookup(e.name)), !n && e.path && (n = l.lookup(e.path)), !n && e.readable && e.hasOwnProperty("httpVersion") && (n = e.headers["content-type"]), n || !t.filepath && !t.filename || (n = l.lookup(t.filepath || t.filename)), n || "object" != typeof e || (n = m.DEFAULT_CONTENT_TYPE), n
        }, m.prototype._multiPartFooter = function() {
          return function(e) {
            var t = m.LINE_BREAK;
            0 === this._streams.length && (t += this._lastBoundary()), e(t)
          }.bind(this)
        }, m.prototype._lastBoundary = function() {
          return "--" + this.getBoundary() + "--" + m.LINE_BREAK
        }, m.prototype.getHeaders = function(e) {
          var t, n = {
            "content-type": "multipart/form-data; boundary=" + this.getBoundary()
          };
          for (t in e) e.hasOwnProperty(t) && (n[t.toLowerCase()] = e[t]);
          return n
        }, m.prototype.setBoundary = function(e) {
          this._boundary = e
        }, m.prototype.getBoundary = function() {
          return this._boundary || this._generateBoundary(), this._boundary
        }, m.prototype.getBuffer = function() {
          for (var e = new Buffer.alloc(0), t = this.getBoundary(), n = 0, i = this._streams.length; n < i; n++) "function" != typeof this._streams[n] && (e = Buffer.isBuffer(this._streams[n]) ? Buffer.concat([e, this._streams[n]]) : Buffer.concat([e, Buffer.from(this._streams[n])]), "string" == typeof this._streams[n] && this._streams[n].substring(2, t.length + 2) === t || (e = Buffer.concat([e, Buffer.from(m.LINE_BREAK)])));
          return Buffer.concat([e, Buffer.from(this._lastBoundary())])
        }, m.prototype._generateBoundary = function() {
          for (var e = "--------------------------", t = 0; t < 24; t++) e += Math.floor(10 * Math.random()).toString(16);
          this._boundary = e
        }, m.prototype.getLengthSync = function() {
          var e = this._overheadLength + this._valueLength;
          return this._streams.length && (e += this._lastBoundary().length), this.hasKnownLength() || this._error(new Error("Cannot calculate proper length in synchronous way.")), e
        }, m.prototype.hasKnownLength = function() {
          var e = !0;
          return this._valuesToMeasure.length && (e = !1), e
        }, m.prototype.getLength = function(e) {
          var t = this._overheadLength + this._valueLength;
          this._streams.length && (t += this._lastBoundary().length), this._valuesToMeasure.length ? d.parallel(this._valuesToMeasure, this._lengthRetriever, (function(n, i) {
            n ? e(n) : (i.forEach((function(e) {
              t += e
            })), e(null, t))
          })) : process.nextTick(e.bind(this, null, t))
        }, m.prototype.submit = function(e, t) {
          var n, i, o = {
            method: "post"
          };
          return "string" == typeof e ? (e = c(e), i = f({
            port: e.port,
            path: e.pathname,
            host: e.hostname,
            protocol: e.protocol
          }, o)) : (i = f(e, o)).port || (i.port = "https:" == i.protocol ? 443 : 80), i.headers = this.getHeaders(e.headers), n = "https:" == i.protocol ? s.request(i) : a.request(i), this.getLength(function(e, i) {
            if (e && "Unknown stream" !== e) this._error(e);
            else if (i && n.setHeader("Content-Length", i), this.pipe(n), t) {
              var o, r = function(e, i) {
                return n.removeListener("error", r), n.removeListener("response", o), t.call(this, e, i)
              };
              o = r.bind(this, null), n.on("error", r), n.on("response", o)
            }
          }.bind(this)), n
        }, m.prototype._error = function(e) {
          this.error || (this.error = e, this.pause(), this.emit("error", e))
        }, m.prototype.toString = function() {
          return "[object FormData]"
        }
      },
      2275: e => {
        e.exports = function(e, t) {
          return Object.keys(t).forEach((function(n) {
            e[n] = e[n] || t[n]
          })), e
        }
      },
      6560: e => {
        "use strict";
        e.exports = (e, t) => {
          t = t || process.argv;
          const n = e.startsWith("-") ? "" : 1 === e.length ? "-" : "--",
            i = t.indexOf(n + e),
            o = t.indexOf("--");
          return -1 !== i && (-1 === o || i < o)
        }
      },
      5234: (e, t, n) => {
        e.exports = n(3765)
      },
      983: (e, t, n) => {
        "use strict";
        var i, o, r, a = n(5234),
          s = n(1017).extname,
          c = /^\s*([^;\s]*)(?:;|\s|$)/,
          p = /^text\//i;

        function u(e) {
          if (!e || "string" != typeof e) return !1;
          var t = c.exec(e),
            n = t && a[t[1].toLowerCase()];
          return n && n.charset ? n.charset : !(!t || !p.test(t[1])) && "UTF-8"
        }
        t.charset = u, t.charsets = {
          lookup: u
        }, t.contentType = function(e) {
          if (!e || "string" != typeof e) return !1;
          var n = -1 === e.indexOf("/") ? t.lookup(e) : e;
          if (!n) return !1;
          if (-1 === n.indexOf("charset")) {
            var i = t.charset(n);
            i && (n += "; charset=" + i.toLowerCase())
          }
          return n
        }, t.extension = function(e) {
          if (!e || "string" != typeof e) return !1;
          var n = c.exec(e),
            i = n && t.extensions[n[1].toLowerCase()];
          return !(!i || !i.length) && i[0]
        }, t.extensions = Object.create(null), t.lookup = function(e) {
          if (!e || "string" != typeof e) return !1;
          var n = s("x." + e).toLowerCase().substr(1);
          return n && t.types[n] || !1
        }, t.types = Object.create(null), i = t.extensions, o = t.types, r = ["nginx", "apache", void 0, "iana"], Object.keys(a).forEach((function(e) {
          var t = a[e],
            n = t.extensions;
          if (n && n.length) {
            i[e] = n;
            for (var s = 0; s < n.length; s++) {
              var c = n[s];
              if (o[c]) {
                var p = r.indexOf(a[o[c]].source),
                  u = r.indexOf(t.source);
                if ("application/octet-stream" !== o[c] && (p > u || p === u && "application/" === o[c].substr(0, 12))) continue
              }
              o[c] = e
            }
          }
        }))
      },
      7824: e => {
        var t = 1e3,
          n = 60 * t,
          i = 60 * n,
          o = 24 * i;

        function r(e, t, n, i) {
          var o = t >= 1.5 * n;
          return Math.round(e / n) + " " + i + (o ? "s" : "")
        }
        e.exports = function(e, a) {
          a = a || {};
          var s, c, p = typeof e;
          if ("string" === p && e.length > 0) return function(e) {
            if (!((e = String(e)).length > 100)) {
              var r = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(e);
              if (r) {
                var a = parseFloat(r[1]);
                switch ((r[2] || "ms").toLowerCase()) {
                  case "years":
                  case "year":
                  case "yrs":
                  case "yr":
                  case "y":
                    return 315576e5 * a;
                  case "weeks":
                  case "week":
                  case "w":
                    return 6048e5 * a;
                  case "days":
                  case "day":
                  case "d":
                    return a * o;
                  case "hours":
                  case "hour":
                  case "hrs":
                  case "hr":
                  case "h":
                    return a * i;
                  case "minutes":
                  case "minute":
                  case "mins":
                  case "min":
                  case "m":
                    return a * n;
                  case "seconds":
                  case "second":
                  case "secs":
                  case "sec":
                  case "s":
                    return a * t;
                  case "milliseconds":
                  case "millisecond":
                  case "msecs":
                  case "msec":
                  case "ms":
                    return a;
                  default:
                    return
                }
              }
            }
          }(e);
          if ("number" === p && isFinite(e)) return a.long ? (s = e, (c = Math.abs(s)) >= o ? r(s, c, o, "day") : c >= i ? r(s, c, i, "hour") : c >= n ? r(s, c, n, "minute") : c >= t ? r(s, c, t, "second") : s + " ms") : function(e) {
            var r = Math.abs(e);
            return r >= o ? Math.round(e / o) + "d" : r >= i ? Math.round(e / i) + "h" : r >= n ? Math.round(e / n) + "m" : r >= t ? Math.round(e / t) + "s" : e + "ms"
          }(e);
          throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(e))
        }
      },
      1394: (e, t, n) => {
        "use strict";
        var i = n(7310).parse,
          o = {
            ftp: 21,
            gopher: 70,
            http: 80,
            https: 443,
            ws: 80,
            wss: 443
          },
          r = String.prototype.endsWith || function(e) {
            return e.length <= this.length && -1 !== this.indexOf(e, this.length - e.length)
          };

        function a(e) {
          return process.env[e.toLowerCase()] || process.env[e.toUpperCase()] || ""
        }
        t.j = function(e) {
          var t = "string" == typeof e ? i(e) : e || {},
            n = t.protocol,
            s = t.host,
            c = t.port;
          if ("string" != typeof s || !s || "string" != typeof n) return "";
          if (n = n.split(":", 1)[0], ! function(e, t) {
              var n = (a("npm_config_no_proxy") || a("no_proxy")).toLowerCase();
              return !n || "*" !== n && n.split(/[,\s]/).every((function(n) {
                if (!n) return !0;
                var i = n.match(/^(.+):(\d+)$/),
                  o = i ? i[1] : n,
                  a = i ? parseInt(i[2]) : 0;
                return !(!a || a === t) || (/^[.*]/.test(o) ? ("*" === o.charAt(0) && (o = o.slice(1)), !r.call(e, o)) : e !== o)
              }))
            }(s = s.replace(/:\d*$/, ""), c = parseInt(c) || o[n] || 0)) return "";
          var p = a("npm_config_" + n + "_proxy") || a(n + "_proxy") || a("npm_config_proxy") || a("all_proxy");
          return p && -1 === p.indexOf("://") && (p = n + "://" + p), p
        }
      },
      6099: (e, t, n) => {
        ! function(e) {
          e.parser = function(e, t) {
            return new o(e, t)
          }, e.SAXParser = o, e.SAXStream = a, e.createStream = function(e, t) {
            return new a(e, t)
          }, e.MAX_BUFFER_LENGTH = 65536;
          var t, i = ["comment", "sgmlDecl", "textNode", "tagName", "doctype", "procInstName", "procInstBody", "entity", "attribName", "attribValue", "cdata", "script"];

          function o(t, n) {
            if (!(this instanceof o)) return new o(t, n);
            var r = this;
            ! function(e) {
              for (var t = 0, n = i.length; t < n; t++) e[i[t]] = ""
            }(r), r.q = r.c = "", r.bufferCheckPosition = e.MAX_BUFFER_LENGTH, r.opt = n || {}, r.opt.lowercase = r.opt.lowercase || r.opt.lowercasetags, r.looseCase = r.opt.lowercase ? "toLowerCase" : "toUpperCase", r.tags = [], r.closed = r.closedRoot = r.sawRoot = !1, r.tag = r.error = null, r.strict = !!t, r.noscript = !(!t && !r.opt.noscript), r.state = S.BEGIN, r.strictEntities = r.opt.strictEntities, r.ENTITIES = r.strictEntities ? Object.create(e.XML_ENTITIES) : Object.create(e.ENTITIES), r.attribList = [], r.opt.xmlns && (r.ns = Object.create(l)), r.trackPosition = !1 !== r.opt.position, r.trackPosition && (r.position = r.line = r.column = 0), T(r, "onready")
          }
          e.EVENTS = ["text", "processinginstruction", "sgmldeclaration", "doctype", "comment", "opentagstart", "attribute", "opentag", "closetag", "opencdata", "cdata", "closecdata", "error", "end", "ready", "script", "opennamespace", "closenamespace"], Object.create || (Object.create = function(e) {
            function t() {}
            return t.prototype = e, new t
          }), Object.keys || (Object.keys = function(e) {
            var t = [];
            for (var n in e) e.hasOwnProperty(n) && t.push(n);
            return t
          }), o.prototype = {
            end: function() {
              k(this)
            },
            write: function(t) {
              var n = this;
              if (this.error) throw this.error;
              if (n.closed) return P(n, "Cannot write after close. Assign an onready handler.");
              if (null === t) return k(n);
              "object" == typeof t && (t = t.toString());
              for (var o = 0, r = ""; r = B(t, o++), n.c = r, r;) switch (n.trackPosition && (n.position++, "\n" === r ? (n.line++, n.column = 0) : n.column++), n.state) {
                case S.BEGIN:
                  if (n.state = S.BEGIN_WHITESPACE, "\ufeff" === r) continue;
                  U(n, r);
                  continue;
                case S.BEGIN_WHITESPACE:
                  U(n, r);
                  continue;
                case S.TEXT:
                  if (n.sawRoot && !n.closedRoot) {
                    for (var a = o - 1; r && "<" !== r && "&" !== r;)(r = B(t, o++)) && n.trackPosition && (n.position++, "\n" === r ? (n.line++, n.column = 0) : n.column++);
                    n.textNode += t.substring(a, o - 1)
                  }
                  "<" !== r || n.sawRoot && n.closedRoot && !n.strict ? (v(r) || n.sawRoot && !n.closedRoot || D(n, "Text data outside of root node."), "&" === r ? n.state = S.TEXT_ENTITY : n.textNode += r) : (n.state = S.OPEN_WAKA, n.startTagPosition = n.position);
                  continue;
                case S.SCRIPT:
                  "<" === r ? n.state = S.SCRIPT_ENDING : n.script += r;
                  continue;
                case S.SCRIPT_ENDING:
                  "/" === r ? n.state = S.CLOSE_TAG : (n.script += "<" + r, n.state = S.SCRIPT);
                  continue;
                case S.OPEN_WAKA:
                  if ("!" === r) n.state = S.SGML_DECL, n.sgmlDecl = "";
                  else if (v(r));
                  else if (b(d, r)) n.state = S.OPEN_TAG, n.tagName = r;
                  else if ("/" === r) n.state = S.CLOSE_TAG, n.tagName = "";
                  else if ("?" === r) n.state = S.PROC_INST, n.procInstName = n.procInstBody = "";
                  else {
                    if (D(n, "Unencoded <"), n.startTagPosition + 1 < n.position) {
                      var p = n.position - n.startTagPosition;
                      r = new Array(p).join(" ") + r
                    }
                    n.textNode += "<" + r, n.state = S.TEXT
                  }
                  continue;
                case S.SGML_DECL:
                  (n.sgmlDecl + r).toUpperCase() === s ? (C(n, "onopencdata"), n.state = S.CDATA, n.sgmlDecl = "", n.cdata = "") : n.sgmlDecl + r === "--" ? (n.state = S.COMMENT, n.comment = "", n.sgmlDecl = "") : (n.sgmlDecl + r).toUpperCase() === c ? (n.state = S.DOCTYPE, (n.doctype || n.sawRoot) && D(n, "Inappropriately located doctype declaration"), n.doctype = "", n.sgmlDecl = "") : ">" === r ? (C(n, "onsgmldeclaration", n.sgmlDecl), n.sgmlDecl = "", n.state = S.TEXT) : g(r) ? (n.state = S.SGML_DECL_QUOTED, n.sgmlDecl += r) : n.sgmlDecl += r;
                  continue;
                case S.SGML_DECL_QUOTED:
                  r === n.q && (n.state = S.SGML_DECL, n.q = ""), n.sgmlDecl += r;
                  continue;
                case S.DOCTYPE:
                  ">" === r ? (n.state = S.TEXT, C(n, "ondoctype", n.doctype), n.doctype = !0) : (n.doctype += r, "[" === r ? n.state = S.DOCTYPE_DTD : g(r) && (n.state = S.DOCTYPE_QUOTED, n.q = r));
                  continue;
                case S.DOCTYPE_QUOTED:
                  n.doctype += r, r === n.q && (n.q = "", n.state = S.DOCTYPE);
                  continue;
                case S.DOCTYPE_DTD:
                  n.doctype += r, "]" === r ? n.state = S.DOCTYPE : g(r) && (n.state = S.DOCTYPE_DTD_QUOTED, n.q = r);
                  continue;
                case S.DOCTYPE_DTD_QUOTED:
                  n.doctype += r, r === n.q && (n.state = S.DOCTYPE_DTD, n.q = "");
                  continue;
                case S.COMMENT:
                  "-" === r ? n.state = S.COMMENT_ENDING : n.comment += r;
                  continue;
                case S.COMMENT_ENDING:
                  "-" === r ? (n.state = S.COMMENT_ENDED, n.comment = N(n.opt, n.comment), n.comment && C(n, "oncomment", n.comment), n.comment = "") : (n.comment += "-" + r, n.state = S.COMMENT);
                  continue;
                case S.COMMENT_ENDED:
                  ">" !== r ? (D(n, "Malformed comment"), n.comment += "--" + r, n.state = S.COMMENT) : n.state = S.TEXT;
                  continue;
                case S.CDATA:
                  "]" === r ? n.state = S.CDATA_ENDING : n.cdata += r;
                  continue;
                case S.CDATA_ENDING:
                  "]" === r ? n.state = S.CDATA_ENDING_2 : (n.cdata += "]" + r, n.state = S.CDATA);
                  continue;
                case S.CDATA_ENDING_2:
                  ">" === r ? (n.cdata && C(n, "oncdata", n.cdata), C(n, "onclosecdata"), n.cdata = "", n.state = S.TEXT) : "]" === r ? n.cdata += "]" : (n.cdata += "]]" + r, n.state = S.CDATA);
                  continue;
                case S.PROC_INST:
                  "?" === r ? n.state = S.PROC_INST_ENDING : v(r) ? n.state = S.PROC_INST_BODY : n.procInstName += r;
                  continue;
                case S.PROC_INST_BODY:
                  if (!n.procInstBody && v(r)) continue;
                  "?" === r ? n.state = S.PROC_INST_ENDING : n.procInstBody += r;
                  continue;
                case S.PROC_INST_ENDING:
                  ">" === r ? (C(n, "onprocessinginstruction", {
                    name: n.procInstName,
                    body: n.procInstBody
                  }), n.procInstName = n.procInstBody = "", n.state = S.TEXT) : (n.procInstBody += "?" + r, n.state = S.PROC_INST_BODY);
                  continue;
                case S.OPEN_TAG:
                  b(f, r) ? n.tagName += r : (A(n), ">" === r ? L(n) : "/" === r ? n.state = S.OPEN_TAG_SLASH : (v(r) || D(n, "Invalid character in tag name"), n.state = S.ATTRIB));
                  continue;
                case S.OPEN_TAG_SLASH:
                  ">" === r ? (L(n, !0), F(n)) : (D(n, "Forward-slash in opening tag not followed by >"), n.state = S.ATTRIB);
                  continue;
                case S.ATTRIB:
                  if (v(r)) continue;
                  ">" === r ? L(n) : "/" === r ? n.state = S.OPEN_TAG_SLASH : b(d, r) ? (n.attribName = r, n.attribValue = "", n.state = S.ATTRIB_NAME) : D(n, "Invalid attribute name");
                  continue;
                case S.ATTRIB_NAME:
                  "=" === r ? n.state = S.ATTRIB_VALUE : ">" === r ? (D(n, "Attribute without value"), n.attribValue = n.attribName, R(n), L(n)) : v(r) ? n.state = S.ATTRIB_NAME_SAW_WHITE : b(f, r) ? n.attribName += r : D(n, "Invalid attribute name");
                  continue;
                case S.ATTRIB_NAME_SAW_WHITE:
                  if ("=" === r) n.state = S.ATTRIB_VALUE;
                  else {
                    if (v(r)) continue;
                    D(n, "Attribute without value"), n.tag.attributes[n.attribName] = "", n.attribValue = "", C(n, "onattribute", {
                      name: n.attribName,
                      value: ""
                    }), n.attribName = "", ">" === r ? L(n) : b(d, r) ? (n.attribName = r, n.state = S.ATTRIB_NAME) : (D(n, "Invalid attribute name"), n.state = S.ATTRIB)
                  }
                  continue;
                case S.ATTRIB_VALUE:
                  if (v(r)) continue;
                  g(r) ? (n.q = r, n.state = S.ATTRIB_VALUE_QUOTED) : (D(n, "Unquoted attribute value"), n.state = S.ATTRIB_VALUE_UNQUOTED, n.attribValue = r);
                  continue;
                case S.ATTRIB_VALUE_QUOTED:
                  if (r !== n.q) {
                    "&" === r ? n.state = S.ATTRIB_VALUE_ENTITY_Q : n.attribValue += r;
                    continue
                  }
                  R(n), n.q = "", n.state = S.ATTRIB_VALUE_CLOSED;
                  continue;
                case S.ATTRIB_VALUE_CLOSED:
                  v(r) ? n.state = S.ATTRIB : ">" === r ? L(n) : "/" === r ? n.state = S.OPEN_TAG_SLASH : b(d, r) ? (D(n, "No whitespace between attributes"), n.attribName = r, n.attribValue = "", n.state = S.ATTRIB_NAME) : D(n, "Invalid attribute name");
                  continue;
                case S.ATTRIB_VALUE_UNQUOTED:
                  if (!x(r)) {
                    "&" === r ? n.state = S.ATTRIB_VALUE_ENTITY_U : n.attribValue += r;
                    continue
                  }
                  R(n), ">" === r ? L(n) : n.state = S.ATTRIB;
                  continue;
                case S.CLOSE_TAG:
                  if (n.tagName) ">" === r ? F(n) : b(f, r) ? n.tagName += r : n.script ? (n.script += "</" + n.tagName, n.tagName = "", n.state = S.SCRIPT) : (v(r) || D(n, "Invalid tagname in closing tag"), n.state = S.CLOSE_TAG_SAW_WHITE);
                  else {
                    if (v(r)) continue;
                    y(d, r) ? n.script ? (n.script += "</" + r, n.state = S.SCRIPT) : D(n, "Invalid tagname in closing tag.") : n.tagName = r
                  }
                  continue;
                case S.CLOSE_TAG_SAW_WHITE:
                  if (v(r)) continue;
                  ">" === r ? F(n) : D(n, "Invalid characters in closing tag");
                  continue;
                case S.TEXT_ENTITY:
                case S.ATTRIB_VALUE_ENTITY_Q:
                case S.ATTRIB_VALUE_ENTITY_U:
                  var u, l;
                  switch (n.state) {
                    case S.TEXT_ENTITY:
                      u = S.TEXT, l = "textNode";
                      break;
                    case S.ATTRIB_VALUE_ENTITY_Q:
                      u = S.ATTRIB_VALUE_QUOTED, l = "attribValue";
                      break;
                    case S.ATTRIB_VALUE_ENTITY_U:
                      u = S.ATTRIB_VALUE_UNQUOTED, l = "attribValue"
                  }
                  ";" === r ? (n[l] += M(n), n.entity = "", n.state = u) : b(n.entity.length ? h : m, r) ? n.entity += r : (D(n, "Invalid character in entity name"), n[l] += "&" + n.entity + r, n.entity = "", n.state = u);
                  continue;
                default:
                  throw new Error(n, "Unknown state: " + n.state)
              }
              return n.position >= n.bufferCheckPosition && function(t) {
                for (var n = Math.max(e.MAX_BUFFER_LENGTH, 10), o = 0, r = 0, a = i.length; r < a; r++) {
                  var s = t[i[r]].length;
                  if (s > n) switch (i[r]) {
                    case "textNode":
                      I(t);
                      break;
                    case "cdata":
                      C(t, "oncdata", t.cdata), t.cdata = "";
                      break;
                    case "script":
                      C(t, "onscript", t.script), t.script = "";
                      break;
                    default:
                      P(t, "Max buffer length exceeded: " + i[r])
                  }
                  o = Math.max(o, s)
                }
                var c = e.MAX_BUFFER_LENGTH - o;
                t.bufferCheckPosition = c + t.position
              }(n), n
            },
            resume: function() {
              return this.error = null, this
            },
            close: function() {
              return this.write(null)
            },
            flush: function() {
              var e;
              I(e = this), "" !== e.cdata && (C(e, "oncdata", e.cdata), e.cdata = ""), "" !== e.script && (C(e, "onscript", e.script), e.script = "")
            }
          };
          try {
            t = n(2781).Stream
          } catch (e) {
            t = function() {}
          }
          var r = e.EVENTS.filter((function(e) {
            return "error" !== e && "end" !== e
          }));

          function a(e, n) {
            if (!(this instanceof a)) return new a(e, n);
            t.apply(this), this._parser = new o(e, n), this.writable = !0, this.readable = !0;
            var i = this;
            this._parser.onend = function() {
              i.emit("end")
            }, this._parser.onerror = function(e) {
              i.emit("error", e), i._parser.error = null
            }, this._decoder = null, r.forEach((function(e) {
              Object.defineProperty(i, "on" + e, {
                get: function() {
                  return i._parser["on" + e]
                },
                set: function(t) {
                  if (!t) return i.removeAllListeners(e), i._parser["on" + e] = t, t;
                  i.on(e, t)
                },
                enumerable: !0,
                configurable: !1
              })
            }))
          }
          a.prototype = Object.create(t.prototype, {
            constructor: {
              value: a
            }
          }), a.prototype.write = function(e) {
            if ("function" == typeof Buffer && "function" == typeof Buffer.isBuffer && Buffer.isBuffer(e)) {
              if (!this._decoder) {
                var t = n(1576).StringDecoder;
                this._decoder = new t("utf8")
              }
              e = this._decoder.write(e)
            }
            return this._parser.write(e.toString()), this.emit("data", e), !0
          }, a.prototype.end = function(e) {
            return e && e.length && this.write(e), this._parser.end(), !0
          }, a.prototype.on = function(e, n) {
            var i = this;
            return i._parser["on" + e] || -1 === r.indexOf(e) || (i._parser["on" + e] = function() {
              var t = 1 === arguments.length ? [arguments[0]] : Array.apply(null, arguments);
              t.splice(0, 0, e), i.emit.apply(i, t)
            }), t.prototype.on.call(i, e, n)
          };
          var s = "[CDATA[",
            c = "DOCTYPE",
            p = "http://www.w3.org/XML/1998/namespace",
            u = "http://www.w3.org/2000/xmlns/",
            l = {
              xml: p,
              xmlns: u
            },
            d = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/,
            f = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/,
            m = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/,
            h = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;

          function v(e) {
            return " " === e || "\n" === e || "\r" === e || "\t" === e
          }

          function g(e) {
            return '"' === e || "'" === e
          }

          function x(e) {
            return ">" === e || v(e)
          }

          function b(e, t) {
            return e.test(t)
          }

          function y(e, t) {
            return !b(e, t)
          }
          var w, _, E, S = 0;
          for (var O in e.STATE = {
              BEGIN: S++,
              BEGIN_WHITESPACE: S++,
              TEXT: S++,
              TEXT_ENTITY: S++,
              OPEN_WAKA: S++,
              SGML_DECL: S++,
              SGML_DECL_QUOTED: S++,
              DOCTYPE: S++,
              DOCTYPE_QUOTED: S++,
              DOCTYPE_DTD: S++,
              DOCTYPE_DTD_QUOTED: S++,
              COMMENT_STARTING: S++,
              COMMENT: S++,
              COMMENT_ENDING: S++,
              COMMENT_ENDED: S++,
              CDATA: S++,
              CDATA_ENDING: S++,
              CDATA_ENDING_2: S++,
              PROC_INST: S++,
              PROC_INST_BODY: S++,
              PROC_INST_ENDING: S++,
              OPEN_TAG: S++,
              OPEN_TAG_SLASH: S++,
              ATTRIB: S++,
              ATTRIB_NAME: S++,
              ATTRIB_NAME_SAW_WHITE: S++,
              ATTRIB_VALUE: S++,
              ATTRIB_VALUE_QUOTED: S++,
              ATTRIB_VALUE_CLOSED: S++,
              ATTRIB_VALUE_UNQUOTED: S++,
              ATTRIB_VALUE_ENTITY_Q: S++,
              ATTRIB_VALUE_ENTITY_U: S++,
              CLOSE_TAG: S++,
              CLOSE_TAG_SAW_WHITE: S++,
              SCRIPT: S++,
              SCRIPT_ENDING: S++
            }, e.XML_ENTITIES = {
              amp: "&",
              gt: ">",
              lt: "<",
              quot: '"',
              apos: "'"
            }, e.ENTITIES = {
              amp: "&",
              gt: ">",
              lt: "<",
              quot: '"',
              apos: "'",
              AElig: 198,
              Aacute: 193,
              Acirc: 194,
              Agrave: 192,
              Aring: 197,
              Atilde: 195,
              Auml: 196,
              Ccedil: 199,
              ETH: 208,
              Eacute: 201,
              Ecirc: 202,
              Egrave: 200,
              Euml: 203,
              Iacute: 205,
              Icirc: 206,
              Igrave: 204,
              Iuml: 207,
              Ntilde: 209,
              Oacute: 211,
              Ocirc: 212,
              Ograve: 210,
              Oslash: 216,
              Otilde: 213,
              Ouml: 214,
              THORN: 222,
              Uacute: 218,
              Ucirc: 219,
              Ugrave: 217,
              Uuml: 220,
              Yacute: 221,
              aacute: 225,
              acirc: 226,
              aelig: 230,
              agrave: 224,
              aring: 229,
              atilde: 227,
              auml: 228,
              ccedil: 231,
              eacute: 233,
              ecirc: 234,
              egrave: 232,
              eth: 240,
              euml: 235,
              iacute: 237,
              icirc: 238,
              igrave: 236,
              iuml: 239,
              ntilde: 241,
              oacute: 243,
              ocirc: 244,
              ograve: 242,
              oslash: 248,
              otilde: 245,
              ouml: 246,
              szlig: 223,
              thorn: 254,
              uacute: 250,
              ucirc: 251,
              ugrave: 249,
              uuml: 252,
              yacute: 253,
              yuml: 255,
              copy: 169,
              reg: 174,
              nbsp: 160,
              iexcl: 161,
              cent: 162,
              pound: 163,
              curren: 164,
              yen: 165,
              brvbar: 166,
              sect: 167,
              uml: 168,
              ordf: 170,
              laquo: 171,
              not: 172,
              shy: 173,
              macr: 175,
              deg: 176,
              plusmn: 177,
              sup1: 185,
              sup2: 178,
              sup3: 179,
              acute: 180,
              micro: 181,
              para: 182,
              middot: 183,
              cedil: 184,
              ordm: 186,
              raquo: 187,
              frac14: 188,
              frac12: 189,
              frac34: 190,
              iquest: 191,
              times: 215,
              divide: 247,
              OElig: 338,
              oelig: 339,
              Scaron: 352,
              scaron: 353,
              Yuml: 376,
              fnof: 402,
              circ: 710,
              tilde: 732,
              Alpha: 913,
              Beta: 914,
              Gamma: 915,
              Delta: 916,
              Epsilon: 917,
              Zeta: 918,
              Eta: 919,
              Theta: 920,
              Iota: 921,
              Kappa: 922,
              Lambda: 923,
              Mu: 924,
              Nu: 925,
              Xi: 926,
              Omicron: 927,
              Pi: 928,
              Rho: 929,
              Sigma: 931,
              Tau: 932,
              Upsilon: 933,
              Phi: 934,
              Chi: 935,
              Psi: 936,
              Omega: 937,
              alpha: 945,
              beta: 946,
              gamma: 947,
              delta: 948,
              epsilon: 949,
              zeta: 950,
              eta: 951,
              theta: 952,
              iota: 953,
              kappa: 954,
              lambda: 955,
              mu: 956,
              nu: 957,
              xi: 958,
              omicron: 959,
              pi: 960,
              rho: 961,
              sigmaf: 962,
              sigma: 963,
              tau: 964,
              upsilon: 965,
              phi: 966,
              chi: 967,
              psi: 968,
              omega: 969,
              thetasym: 977,
              upsih: 978,
              piv: 982,
              ensp: 8194,
              emsp: 8195,
              thinsp: 8201,
              zwnj: 8204,
              zwj: 8205,
              lrm: 8206,
              rlm: 8207,
              ndash: 8211,
              mdash: 8212,
              lsquo: 8216,
              rsquo: 8217,
              sbquo: 8218,
              ldquo: 8220,
              rdquo: 8221,
              bdquo: 8222,
              dagger: 8224,
              Dagger: 8225,
              bull: 8226,
              hellip: 8230,
              permil: 8240,
              prime: 8242,
              Prime: 8243,
              lsaquo: 8249,
              rsaquo: 8250,
              oline: 8254,
              frasl: 8260,
              euro: 8364,
              image: 8465,
              weierp: 8472,
              real: 8476,
              trade: 8482,
              alefsym: 8501,
              larr: 8592,
              uarr: 8593,
              rarr: 8594,
              darr: 8595,
              harr: 8596,
              crarr: 8629,
              lArr: 8656,
              uArr: 8657,
              rArr: 8658,
              dArr: 8659,
              hArr: 8660,
              forall: 8704,
              part: 8706,
              exist: 8707,
              empty: 8709,
              nabla: 8711,
              isin: 8712,
              notin: 8713,
              ni: 8715,
              prod: 8719,
              sum: 8721,
              minus: 8722,
              lowast: 8727,
              radic: 8730,
              prop: 8733,
              infin: 8734,
              ang: 8736,
              and: 8743,
              or: 8744,
              cap: 8745,
              cup: 8746,
              int: 8747,
              there4: 8756,
              sim: 8764,
              cong: 8773,
              asymp: 8776,
              ne: 8800,
              equiv: 8801,
              le: 8804,
              ge: 8805,
              sub: 8834,
              sup: 8835,
              nsub: 8836,
              sube: 8838,
              supe: 8839,
              oplus: 8853,
              otimes: 8855,
              perp: 8869,
              sdot: 8901,
              lceil: 8968,
              rceil: 8969,
              lfloor: 8970,
              rfloor: 8971,
              lang: 9001,
              rang: 9002,
              loz: 9674,
              spades: 9824,
              clubs: 9827,
              hearts: 9829,
              diams: 9830
            }, Object.keys(e.ENTITIES).forEach((function(t) {
              var n = e.ENTITIES[t],
                i = "number" == typeof n ? String.fromCharCode(n) : n;
              e.ENTITIES[t] = i
            })), e.STATE) e.STATE[e.STATE[O]] = O;

          function T(e, t, n) {
            e[t] && e[t](n)
          }

          function C(e, t, n) {
            e.textNode && I(e), T(e, t, n)
          }

          function I(e) {
            e.textNode = N(e.opt, e.textNode), e.textNode && T(e, "ontext", e.textNode), e.textNode = ""
          }

          function N(e, t) {
            return e.trim && (t = t.trim()), e.normalize && (t = t.replace(/\s+/g, " ")), t
          }

          function P(e, t) {
            return I(e), e.trackPosition && (t += "\nLine: " + e.line + "\nColumn: " + e.column + "\nChar: " + e.c), t = new Error(t), e.error = t, T(e, "onerror", t), e
          }

          function k(e) {
            return e.sawRoot && !e.closedRoot && D(e, "Unclosed root tag"), e.state !== S.BEGIN && e.state !== S.BEGIN_WHITESPACE && e.state !== S.TEXT && P(e, "Unexpected end"), I(e), e.c = "", e.closed = !0, T(e, "onend"), o.call(e, e.strict, e.opt), e
          }

          function D(e, t) {
            if ("object" != typeof e || !(e instanceof o)) throw new Error("bad call to strictFail");
            e.strict && P(e, t)
          }

          function A(e) {
            e.strict || (e.tagName = e.tagName[e.looseCase]());
            var t = e.tags[e.tags.length - 1] || e,
              n = e.tag = {
                name: e.tagName,
                attributes: {}
              };
            e.opt.xmlns && (n.ns = t.ns), e.attribList.length = 0, C(e, "onopentagstart", n)
          }

          function j(e, t) {
            var n = e.indexOf(":") < 0 ? ["", e] : e.split(":"),
              i = n[0],
              o = n[1];
            return t && "xmlns" === e && (i = "xmlns", o = ""), {
              prefix: i,
              local: o
            }
          }

          function R(e) {
            if (e.strict || (e.attribName = e.attribName[e.looseCase]()), -1 !== e.attribList.indexOf(e.attribName) || e.tag.attributes.hasOwnProperty(e.attribName)) e.attribName = e.attribValue = "";
            else {
              if (e.opt.xmlns) {
                var t = j(e.attribName, !0),
                  n = t.prefix,
                  i = t.local;
                if ("xmlns" === n)
                  if ("xml" === i && e.attribValue !== p) D(e, "xml: prefix must be bound to " + p + "\nActual: " + e.attribValue);
                  else if ("xmlns" === i && e.attribValue !== u) D(e, "xmlns: prefix must be bound to " + u + "\nActual: " + e.attribValue);
                else {
                  var o = e.tag,
                    r = e.tags[e.tags.length - 1] || e;
                  o.ns === r.ns && (o.ns = Object.create(r.ns)), o.ns[i] = e.attribValue
                }
                e.attribList.push([e.attribName, e.attribValue])
              } else e.tag.attributes[e.attribName] = e.attribValue, C(e, "onattribute", {
                name: e.attribName,
                value: e.attribValue
              });
              e.attribName = e.attribValue = ""
            }
          }

          function L(e, t) {
            if (e.opt.xmlns) {
              var n = e.tag,
                i = j(e.tagName);
              n.prefix = i.prefix, n.local = i.local, n.uri = n.ns[i.prefix] || "", n.prefix && !n.uri && (D(e, "Unbound namespace prefix: " + JSON.stringify(e.tagName)), n.uri = i.prefix);
              var o = e.tags[e.tags.length - 1] || e;
              n.ns && o.ns !== n.ns && Object.keys(n.ns).forEach((function(t) {
                C(e, "onopennamespace", {
                  prefix: t,
                  uri: n.ns[t]
                })
              }));
              for (var r = 0, a = e.attribList.length; r < a; r++) {
                var s = e.attribList[r],
                  c = s[0],
                  p = s[1],
                  u = j(c, !0),
                  l = u.prefix,
                  d = u.local,
                  f = "" === l ? "" : n.ns[l] || "",
                  m = {
                    name: c,
                    value: p,
                    prefix: l,
                    local: d,
                    uri: f
                  };
                l && "xmlns" !== l && !f && (D(e, "Unbound namespace prefix: " + JSON.stringify(l)), m.uri = l), e.tag.attributes[c] = m, C(e, "onattribute", m)
              }
              e.attribList.length = 0
            }
            e.tag.isSelfClosing = !!t, e.sawRoot = !0, e.tags.push(e.tag), C(e, "onopentag", e.tag), t || (e.noscript || "script" !== e.tagName.toLowerCase() ? e.state = S.TEXT : e.state = S.SCRIPT, e.tag = null, e.tagName = ""), e.attribName = e.attribValue = "", e.attribList.length = 0
          }

          function F(e) {
            if (!e.tagName) return D(e, "Weird empty close tag."), e.textNode += "</>", void(e.state = S.TEXT);
            if (e.script) {
              if ("script" !== e.tagName) return e.script += "</" + e.tagName + ">", e.tagName = "", void(e.state = S.SCRIPT);
              C(e, "onscript", e.script), e.script = ""
            }
            var t = e.tags.length,
              n = e.tagName;
            e.strict || (n = n[e.looseCase]());
            for (var i = n; t-- && e.tags[t].name !== i;) D(e, "Unexpected close tag");
            if (t < 0) return D(e, "Unmatched closing tag: " + e.tagName), e.textNode += "</" + e.tagName + ">", void(e.state = S.TEXT);
            e.tagName = n;
            for (var o = e.tags.length; o-- > t;) {
              var r = e.tag = e.tags.pop();
              e.tagName = e.tag.name, C(e, "onclosetag", e.tagName);
              var a = {};
              for (var s in r.ns) a[s] = r.ns[s];
              var c = e.tags[e.tags.length - 1] || e;
              e.opt.xmlns && r.ns !== c.ns && Object.keys(r.ns).forEach((function(t) {
                var n = r.ns[t];
                C(e, "onclosenamespace", {
                  prefix: t,
                  uri: n
                })
              }))
            }
            0 === t && (e.closedRoot = !0), e.tagName = e.attribValue = e.attribName = "", e.attribList.length = 0, e.state = S.TEXT
          }

          function M(e) {
            var t, n = e.entity,
              i = n.toLowerCase(),
              o = "";
            return e.ENTITIES[n] ? e.ENTITIES[n] : e.ENTITIES[i] ? e.ENTITIES[i] : ("#" === (n = i).charAt(0) && ("x" === n.charAt(1) ? (n = n.slice(2), o = (t = parseInt(n, 16)).toString(16)) : (n = n.slice(1), o = (t = parseInt(n, 10)).toString(10))), n = n.replace(/^0+/, ""), isNaN(t) || o.toLowerCase() !== n ? (D(e, "Invalid character entity"), "&" + e.entity + ";") : String.fromCodePoint(t))
          }

          function U(e, t) {
            "<" === t ? (e.state = S.OPEN_WAKA, e.startTagPosition = e.position) : v(t) || (D(e, "Non-whitespace before first tag."), e.textNode = t, e.state = S.TEXT)
          }

          function B(e, t) {
            var n = "";
            return t < e.length && (n = e.charAt(t)), n
          }
          S = e.STATE, String.fromCodePoint || (w = String.fromCharCode, _ = Math.floor, E = function() {
            var e, t, n = [],
              i = -1,
              o = arguments.length;
            if (!o) return "";
            for (var r = ""; ++i < o;) {
              var a = Number(arguments[i]);
              if (!isFinite(a) || a < 0 || a > 1114111 || _(a) !== a) throw RangeError("Invalid code point: " + a);
              a <= 65535 ? n.push(a) : (e = 55296 + ((a -= 65536) >> 10), t = a % 1024 + 56320, n.push(e, t)), (i + 1 === o || n.length > 16384) && (r += w.apply(null, n), n.length = 0)
            }
            return r
          }, Object.defineProperty ? Object.defineProperty(String, "fromCodePoint", {
            value: E,
            configurable: !0,
            writable: !0
          }) : String.fromCodePoint = E)
        }(t)
      },
      2130: (e, t, n) => {
        "use strict";
        const i = n(2037),
          o = n(6560),
          r = process.env;
        let a;

        function s(e) {
          const t = function(e) {
            if (!1 === a) return 0;
            if (o("color=16m") || o("color=full") || o("color=truecolor")) return 3;
            if (o("color=256")) return 2;
            if (e && !e.isTTY && !0 !== a) return 0;
            const t = a ? 1 : 0;
            if ("win32" === process.platform) {
              const e = i.release().split(".");
              return Number(process.versions.node.split(".")[0]) >= 8 && Number(e[0]) >= 10 && Number(e[2]) >= 10586 ? Number(e[2]) >= 14931 ? 3 : 2 : 1
            }
            if ("CI" in r) return ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI"].some((e => e in r)) || "codeship" === r.CI_NAME ? 1 : t;
            if ("TEAMCITY_VERSION" in r) return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(r.TEAMCITY_VERSION) ? 1 : 0;
            if ("truecolor" === r.COLORTERM) return 3;
            if ("TERM_PROGRAM" in r) {
              const e = parseInt((r.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
              switch (r.TERM_PROGRAM) {
                case "iTerm.app":
                  return e >= 3 ? 3 : 2;
                case "Apple_Terminal":
                  return 2
              }
            }
            return /-256(color)?$/i.test(r.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(r.TERM) || "COLORTERM" in r ? 1 : (r.TERM, t)
          }(e);
          return function(e) {
            return 0 !== e && {
              level: e,
              hasBasic: !0,
              has256: e >= 2,
              has16m: e >= 3
            }
          }(t)
        }
        o("no-color") || o("no-colors") || o("color=false") ? a = !1 : (o("color") || o("colors") || o("color=true") || o("color=always")) && (a = !0), "FORCE_COLOR" in r && (a = 0 === r.FORCE_COLOR.length || 0 !== parseInt(r.FORCE_COLOR, 10)), e.exports = {
          supportsColor: s,
          stdout: s(process.stdout),
          stderr: s(process.stderr)
        }
      },
      977: (e, t, n) => {
        "use strict";
        const {
          EMPTY_BUFFER: i
        } = n(1872), o = Buffer[Symbol.species];

        function r(e, t, n, i, o) {
          for (let r = 0; r < o; r++) n[i + r] = e[r] ^ t[3 & r]
        }

        function a(e, t) {
          for (let n = 0; n < e.length; n++) e[n] ^= t[3 & n]
        }
        if (e.exports = {
            concat: function(e, t) {
              if (0 === e.length) return i;
              if (1 === e.length) return e[0];
              const n = Buffer.allocUnsafe(t);
              let r = 0;
              for (let t = 0; t < e.length; t++) {
                const i = e[t];
                n.set(i, r), r += i.length
              }
              return r < t ? new o(n.buffer, n.byteOffset, r) : n
            },
            mask: r,
            toArrayBuffer: function(e) {
              return e.length === e.buffer.byteLength ? e.buffer : e.buffer.slice(e.byteOffset, e.byteOffset + e.length)
            },
            toBuffer: function e(t) {
              if (e.readOnly = !0, Buffer.isBuffer(t)) return t;
              let n;
              return t instanceof ArrayBuffer ? n = new o(t) : ArrayBuffer.isView(t) ? n = new o(t.buffer, t.byteOffset, t.byteLength) : (n = Buffer.from(t), e.readOnly = !1), n
            },
            unmask: a
          }, !process.env.WS_NO_BUFFER_UTIL) try {
          const t = n(2864);
          e.exports.mask = function(e, n, i, o, a) {
            a < 48 ? r(e, n, i, o, a) : t.mask(e, n, i, o, a)
          }, e.exports.unmask = function(e, n) {
            e.length < 32 ? a(e, n) : t.unmask(e, n)
          }
        } catch (e) {}
      },
      1872: e => {
        "use strict";
        e.exports = {
          BINARY_TYPES: ["nodebuffer", "arraybuffer", "fragments"],
          EMPTY_BUFFER: Buffer.alloc(0),
          GUID: "258EAFA5-E914-47DA-95CA-C5AB0DC85B11",
          kForOnEventAttribute: Symbol("kIsForOnEventAttribute"),
          kListener: Symbol("kListener"),
          kStatusCode: Symbol("status-code"),
          kWebSocket: Symbol("websocket"),
          NOOP: () => {}
        }
      },
      62: (e, t, n) => {
        "use strict";
        const {
          kForOnEventAttribute: i,
          kListener: o
        } = n(1872), r = Symbol("kCode"), a = Symbol("kData"), s = Symbol("kError"), c = Symbol("kMessage"), p = Symbol("kReason"), u = Symbol("kTarget"), l = Symbol("kType"), d = Symbol("kWasClean");
        class f {
          constructor(e) {
            this[u] = null, this[l] = e
          }
          get target() {
            return this[u]
          }
          get type() {
            return this[l]
          }
        }
        Object.defineProperty(f.prototype, "target", {
          enumerable: !0
        }), Object.defineProperty(f.prototype, "type", {
          enumerable: !0
        });
        class m extends f {
          constructor(e, t = {}) {
            super(e), this[r] = void 0 === t.code ? 0 : t.code, this[p] = void 0 === t.reason ? "" : t.reason, this[d] = void 0 !== t.wasClean && t.wasClean
          }
          get code() {
            return this[r]
          }
          get reason() {
            return this[p]
          }
          get wasClean() {
            return this[d]
          }
        }
        Object.defineProperty(m.prototype, "code", {
          enumerable: !0
        }), Object.defineProperty(m.prototype, "reason", {
          enumerable: !0
        }), Object.defineProperty(m.prototype, "wasClean", {
          enumerable: !0
        });
        class h extends f {
          constructor(e, t = {}) {
            super(e), this[s] = void 0 === t.error ? null : t.error, this[c] = void 0 === t.message ? "" : t.message
          }
          get error() {
            return this[s]
          }
          get message() {
            return this[c]
          }
        }
        Object.defineProperty(h.prototype, "error", {
          enumerable: !0
        }), Object.defineProperty(h.prototype, "message", {
          enumerable: !0
        });
        class v extends f {
          constructor(e, t = {}) {
            super(e), this[a] = void 0 === t.data ? null : t.data
          }
          get data() {
            return this[a]
          }
        }
        Object.defineProperty(v.prototype, "data", {
          enumerable: !0
        });
        const g = {
          addEventListener(e, t, n = {}) {
            for (const r of this.listeners(e))
              if (!n[i] && r[o] === t && !r[i]) return;
            let r;
            if ("message" === e) r = function(e, n) {
              const i = new v("message", {
                data: n ? e : e.toString()
              });
              i[u] = this, x(t, this, i)
            };
            else if ("close" === e) r = function(e, n) {
              const i = new m("close", {
                code: e,
                reason: n.toString(),
                wasClean: this._closeFrameReceived && this._closeFrameSent
              });
              i[u] = this, x(t, this, i)
            };
            else if ("error" === e) r = function(e) {
              const n = new h("error", {
                error: e,
                message: e.message
              });
              n[u] = this, x(t, this, n)
            };
            else {
              if ("open" !== e) return;
              r = function() {
                const e = new f("open");
                e[u] = this, x(t, this, e)
              }
            }
            r[i] = !!n[i], r[o] = t, n.once ? this.once(e, r) : this.on(e, r)
          },
          removeEventListener(e, t) {
            for (const n of this.listeners(e))
              if (n[o] === t && !n[i]) {
                this.removeListener(e, n);
                break
              }
          }
        };

        function x(e, t, n) {
          "object" == typeof e && e.handleEvent ? e.handleEvent.call(e, n) : e.call(t, n)
        }
        e.exports = {
          CloseEvent: m,
          ErrorEvent: h,
          Event: f,
          EventTarget: g,
          MessageEvent: v
        }
      },
      1503: (e, t, n) => {
        "use strict";
        const {
          tokenChars: i
        } = n(6746);

        function o(e, t, n) {
          void 0 === e[t] ? e[t] = [n] : e[t].push(n)
        }
        e.exports = {
          format: function(e) {
            return Object.keys(e).map((t => {
              let n = e[t];
              return Array.isArray(n) || (n = [n]), n.map((e => [t].concat(Object.keys(e).map((t => {
                let n = e[t];
                return Array.isArray(n) || (n = [n]), n.map((e => !0 === e ? t : `${t}=${e}`)).join("; ")
              }))).join("; "))).join(", ")
            })).join(", ")
          },
          parse: function(e) {
            const t = Object.create(null);
            let n, r, a = Object.create(null),
              s = !1,
              c = !1,
              p = !1,
              u = -1,
              l = -1,
              d = -1,
              f = 0;
            for (; f < e.length; f++)
              if (l = e.charCodeAt(f), void 0 === n)
                if (-1 === d && 1 === i[l]) - 1 === u && (u = f);
                else if (0 === f || 32 !== l && 9 !== l) {
              if (59 !== l && 44 !== l) throw new SyntaxError(`Unexpected character at index ${f}`);
              {
                if (-1 === u) throw new SyntaxError(`Unexpected character at index ${f}`); - 1 === d && (d = f);
                const i = e.slice(u, d);
                44 === l ? (o(t, i, a), a = Object.create(null)) : n = i, u = d = -1
              }
            } else - 1 === d && -1 !== u && (d = f);
            else if (void 0 === r)
              if (-1 === d && 1 === i[l]) - 1 === u && (u = f);
              else if (32 === l || 9 === l) - 1 === d && -1 !== u && (d = f);
            else if (59 === l || 44 === l) {
              if (-1 === u) throw new SyntaxError(`Unexpected character at index ${f}`); - 1 === d && (d = f), o(a, e.slice(u, d), !0), 44 === l && (o(t, n, a), a = Object.create(null), n = void 0), u = d = -1
            } else {
              if (61 !== l || -1 === u || -1 !== d) throw new SyntaxError(`Unexpected character at index ${f}`);
              r = e.slice(u, f), u = d = -1
            } else if (c) {
              if (1 !== i[l]) throw new SyntaxError(`Unexpected character at index ${f}`); - 1 === u ? u = f : s || (s = !0), c = !1
            } else if (p)
              if (1 === i[l]) - 1 === u && (u = f);
              else if (34 === l && -1 !== u) p = !1, d = f;
            else {
              if (92 !== l) throw new SyntaxError(`Unexpected character at index ${f}`);
              c = !0
            } else if (34 === l && 61 === e.charCodeAt(f - 1)) p = !0;
            else if (-1 === d && 1 === i[l]) - 1 === u && (u = f);
            else if (-1 === u || 32 !== l && 9 !== l) {
              if (59 !== l && 44 !== l) throw new SyntaxError(`Unexpected character at index ${f}`);
              {
                if (-1 === u) throw new SyntaxError(`Unexpected character at index ${f}`); - 1 === d && (d = f);
                let i = e.slice(u, d);
                s && (i = i.replace(/\\/g, ""), s = !1), o(a, r, i), 44 === l && (o(t, n, a), a = Object.create(null), n = void 0), r = void 0, u = d = -1
              }
            } else - 1 === d && (d = f);
            if (-1 === u || p || 32 === l || 9 === l) throw new SyntaxError("Unexpected end of input"); - 1 === d && (d = f);
            const m = e.slice(u, d);
            return void 0 === n ? o(t, m, a) : (void 0 === r ? o(a, m, !0) : o(a, r, s ? m.replace(/\\/g, "") : m), o(t, n, a)), t
          }
        }
      },
      305: e => {
        "use strict";
        const t = Symbol("kDone"),
          n = Symbol("kRun");
        e.exports = class {
          constructor(e) {
            this[t] = () => {
              this.pending--, this[n]()
            }, this.concurrency = e || 1 / 0, this.jobs = [], this.pending = 0
          }
          add(e) {
            this.jobs.push(e), this[n]()
          } [n]() {
            if (this.pending !== this.concurrency && this.jobs.length) {
              const e = this.jobs.shift();
              this.pending++, e(this[t])
            }
          }
        }
      },
      5196: (e, t, n) => {
        "use strict";
        const i = n(9796),
          o = n(977),
          r = n(305),
          {
            kStatusCode: a
          } = n(1872),
          s = Buffer[Symbol.species],
          c = Buffer.from([0, 0, 255, 255]),
          p = Symbol("permessage-deflate"),
          u = Symbol("total-length"),
          l = Symbol("callback"),
          d = Symbol("buffers"),
          f = Symbol("error");
        let m;

        function h(e) {
          this[d].push(e), this[u] += e.length
        }

        function v(e) {
          this[u] += e.length, this[p]._maxPayload < 1 || this[u] <= this[p]._maxPayload ? this[d].push(e) : (this[f] = new RangeError("Max payload size exceeded"), this[f].code = "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH", this[f][a] = 1009, this.removeListener("data", v), this.reset())
        }

        function g(e) {
          this[p]._inflate = null, e[a] = 1007, this[l](e)
        }
        e.exports = class {
          constructor(e, t, n) {
            if (this._maxPayload = 0 | n, this._options = e || {}, this._threshold = void 0 !== this._options.threshold ? this._options.threshold : 1024, this._isServer = !!t, this._deflate = null, this._inflate = null, this.params = null, !m) {
              const e = void 0 !== this._options.concurrencyLimit ? this._options.concurrencyLimit : 10;
              m = new r(e)
            }
          }
          static get extensionName() {
            return "permessage-deflate"
          }
          offer() {
            const e = {};
            return this._options.serverNoContextTakeover && (e.server_no_context_takeover = !0), this._options.clientNoContextTakeover && (e.client_no_context_takeover = !0), this._options.serverMaxWindowBits && (e.server_max_window_bits = this._options.serverMaxWindowBits), this._options.clientMaxWindowBits ? e.client_max_window_bits = this._options.clientMaxWindowBits : null == this._options.clientMaxWindowBits && (e.client_max_window_bits = !0), e
          }
          accept(e) {
            return e = this.normalizeParams(e), this.params = this._isServer ? this.acceptAsServer(e) : this.acceptAsClient(e), this.params
          }
          cleanup() {
            if (this._inflate && (this._inflate.close(), this._inflate = null), this._deflate) {
              const e = this._deflate[l];
              this._deflate.close(), this._deflate = null, e && e(new Error("The deflate stream was closed while data was being processed"))
            }
          }
          acceptAsServer(e) {
            const t = this._options,
              n = e.find((e => !(!1 === t.serverNoContextTakeover && e.server_no_context_takeover || e.server_max_window_bits && (!1 === t.serverMaxWindowBits || "number" == typeof t.serverMaxWindowBits && t.serverMaxWindowBits > e.server_max_window_bits) || "number" == typeof t.clientMaxWindowBits && !e.client_max_window_bits)));
            if (!n) throw new Error("None of the extension offers can be accepted");
            return t.serverNoContextTakeover && (n.server_no_context_takeover = !0), t.clientNoContextTakeover && (n.client_no_context_takeover = !0), "number" == typeof t.serverMaxWindowBits && (n.server_max_window_bits = t.serverMaxWindowBits), "number" == typeof t.clientMaxWindowBits ? n.client_max_window_bits = t.clientMaxWindowBits : !0 !== n.client_max_window_bits && !1 !== t.clientMaxWindowBits || delete n.client_max_window_bits, n
          }
          acceptAsClient(e) {
            const t = e[0];
            if (!1 === this._options.clientNoContextTakeover && t.client_no_context_takeover) throw new Error('Unexpected parameter "client_no_context_takeover"');
            if (t.client_max_window_bits) {
              if (!1 === this._options.clientMaxWindowBits || "number" == typeof this._options.clientMaxWindowBits && t.client_max_window_bits > this._options.clientMaxWindowBits) throw new Error('Unexpected or invalid parameter "client_max_window_bits"')
            } else "number" == typeof this._options.clientMaxWindowBits && (t.client_max_window_bits = this._options.clientMaxWindowBits);
            return t
          }
          normalizeParams(e) {
            return e.forEach((e => {
              Object.keys(e).forEach((t => {
                let n = e[t];
                if (n.length > 1) throw new Error(`Parameter "${t}" must have only a single value`);
                if (n = n[0], "client_max_window_bits" === t) {
                  if (!0 !== n) {
                    const e = +n;
                    if (!Number.isInteger(e) || e < 8 || e > 15) throw new TypeError(`Invalid value for parameter "${t}": ${n}`);
                    n = e
                  } else if (!this._isServer) throw new TypeError(`Invalid value for parameter "${t}": ${n}`)
                } else if ("server_max_window_bits" === t) {
                  const e = +n;
                  if (!Number.isInteger(e) || e < 8 || e > 15) throw new TypeError(`Invalid value for parameter "${t}": ${n}`);
                  n = e
                } else {
                  if ("client_no_context_takeover" !== t && "server_no_context_takeover" !== t) throw new Error(`Unknown parameter "${t}"`);
                  if (!0 !== n) throw new TypeError(`Invalid value for parameter "${t}": ${n}`)
                }
                e[t] = n
              }))
            })), e
          }
          decompress(e, t, n) {
            m.add((i => {
              this._decompress(e, t, ((e, t) => {
                i(), n(e, t)
              }))
            }))
          }
          compress(e, t, n) {
            m.add((i => {
              this._compress(e, t, ((e, t) => {
                i(), n(e, t)
              }))
            }))
          }
          _decompress(e, t, n) {
            const r = this._isServer ? "client" : "server";
            if (!this._inflate) {
              const e = `${r}_max_window_bits`,
                t = "number" != typeof this.params[e] ? i.Z_DEFAULT_WINDOWBITS : this.params[e];
              this._inflate = i.createInflateRaw({
                ...this._options.zlibInflateOptions,
                windowBits: t
              }), this._inflate[p] = this, this._inflate[u] = 0, this._inflate[d] = [], this._inflate.on("error", g), this._inflate.on("data", v)
            }
            this._inflate[l] = n, this._inflate.write(e), t && this._inflate.write(c), this._inflate.flush((() => {
              const e = this._inflate[f];
              if (e) return this._inflate.close(), this._inflate = null, void n(e);
              const i = o.concat(this._inflate[d], this._inflate[u]);
              this._inflate._readableState.endEmitted ? (this._inflate.close(), this._inflate = null) : (this._inflate[u] = 0, this._inflate[d] = [], t && this.params[`${r}_no_context_takeover`] && this._inflate.reset()), n(null, i)
            }))
          }
          _compress(e, t, n) {
            const r = this._isServer ? "server" : "client";
            if (!this._deflate) {
              const e = `${r}_max_window_bits`,
                t = "number" != typeof this.params[e] ? i.Z_DEFAULT_WINDOWBITS : this.params[e];
              this._deflate = i.createDeflateRaw({
                ...this._options.zlibDeflateOptions,
                windowBits: t
              }), this._deflate[u] = 0, this._deflate[d] = [], this._deflate.on("data", h)
            }
            this._deflate[l] = n, this._deflate.write(e), this._deflate.flush(i.Z_SYNC_FLUSH, (() => {
              if (!this._deflate) return;
              let e = o.concat(this._deflate[d], this._deflate[u]);
              t && (e = new s(e.buffer, e.byteOffset, e.length - 4)), this._deflate[l] = null, this._deflate[u] = 0, this._deflate[d] = [], t && this.params[`${r}_no_context_takeover`] && this._deflate.reset(), n(null, e)
            }))
          }
        }
      },
      2957: (e, t, n) => {
        "use strict";
        const {
          Writable: i
        } = n(2781), o = n(5196), {
          BINARY_TYPES: r,
          EMPTY_BUFFER: a,
          kStatusCode: s,
          kWebSocket: c
        } = n(1872), {
          concat: p,
          toArrayBuffer: u,
          unmask: l
        } = n(977), {
          isValidStatusCode: d,
          isValidUTF8: f
        } = n(6746), m = Buffer[Symbol.species];

        function h(e, t, n, i, o) {
          const r = new e(n ? `Invalid WebSocket frame: ${t}` : t);
          return Error.captureStackTrace(r, h), r.code = o, r[s] = i, r
        }
        e.exports = class extends i {
          constructor(e = {}) {
            super(), this._binaryType = e.binaryType || r[0], this._extensions = e.extensions || {}, this._isServer = !!e.isServer, this._maxPayload = 0 | e.maxPayload, this._skipUTF8Validation = !!e.skipUTF8Validation, this[c] = void 0, this._bufferedBytes = 0, this._buffers = [], this._compressed = !1, this._payloadLength = 0, this._mask = void 0, this._fragmented = 0, this._masked = !1, this._fin = !1, this._opcode = 0, this._totalPayloadLength = 0, this._messageLength = 0, this._fragments = [], this._state = 0, this._loop = !1
          }
          _write(e, t, n) {
            if (8 === this._opcode && 0 == this._state) return n();
            this._bufferedBytes += e.length, this._buffers.push(e), this.startLoop(n)
          }
          consume(e) {
            if (this._bufferedBytes -= e, e === this._buffers[0].length) return this._buffers.shift();
            if (e < this._buffers[0].length) {
              const t = this._buffers[0];
              return this._buffers[0] = new m(t.buffer, t.byteOffset + e, t.length - e), new m(t.buffer, t.byteOffset, e)
            }
            const t = Buffer.allocUnsafe(e);
            do {
              const n = this._buffers[0],
                i = t.length - e;
              e >= n.length ? t.set(this._buffers.shift(), i) : (t.set(new Uint8Array(n.buffer, n.byteOffset, e), i), this._buffers[0] = new m(n.buffer, n.byteOffset + e, n.length - e)), e -= n.length
            } while (e > 0);
            return t
          }
          startLoop(e) {
            let t;
            this._loop = !0;
            do {
              switch (this._state) {
                case 0:
                  t = this.getInfo();
                  break;
                case 1:
                  t = this.getPayloadLength16();
                  break;
                case 2:
                  t = this.getPayloadLength64();
                  break;
                case 3:
                  this.getMask();
                  break;
                case 4:
                  t = this.getData(e);
                  break;
                default:
                  return void(this._loop = !1)
              }
            } while (this._loop);
            e(t)
          }
          getInfo() {
            if (this._bufferedBytes < 2) return void(this._loop = !1);
            const e = this.consume(2);
            if (0 != (48 & e[0])) return this._loop = !1, h(RangeError, "RSV2 and RSV3 must be clear", !0, 1002, "WS_ERR_UNEXPECTED_RSV_2_3");
            const t = 64 == (64 & e[0]);
            if (t && !this._extensions[o.extensionName]) return this._loop = !1, h(RangeError, "RSV1 must be clear", !0, 1002, "WS_ERR_UNEXPECTED_RSV_1");
            if (this._fin = 128 == (128 & e[0]), this._opcode = 15 & e[0], this._payloadLength = 127 & e[1], 0 === this._opcode) {
              if (t) return this._loop = !1, h(RangeError, "RSV1 must be clear", !0, 1002, "WS_ERR_UNEXPECTED_RSV_1");
              if (!this._fragmented) return this._loop = !1, h(RangeError, "invalid opcode 0", !0, 1002, "WS_ERR_INVALID_OPCODE");
              this._opcode = this._fragmented
            } else if (1 === this._opcode || 2 === this._opcode) {
              if (this._fragmented) return this._loop = !1, h(RangeError, `invalid opcode ${this._opcode}`, !0, 1002, "WS_ERR_INVALID_OPCODE");
              this._compressed = t
            } else {
              if (!(this._opcode > 7 && this._opcode < 11)) return this._loop = !1, h(RangeError, `invalid opcode ${this._opcode}`, !0, 1002, "WS_ERR_INVALID_OPCODE");
              if (!this._fin) return this._loop = !1, h(RangeError, "FIN must be set", !0, 1002, "WS_ERR_EXPECTED_FIN");
              if (t) return this._loop = !1, h(RangeError, "RSV1 must be clear", !0, 1002, "WS_ERR_UNEXPECTED_RSV_1");
              if (this._payloadLength > 125 || 8 === this._opcode && 1 === this._payloadLength) return this._loop = !1, h(RangeError, `invalid payload length ${this._payloadLength}`, !0, 1002, "WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH")
            }
            if (this._fin || this._fragmented || (this._fragmented = this._opcode), this._masked = 128 == (128 & e[1]), this._isServer) {
              if (!this._masked) return this._loop = !1, h(RangeError, "MASK must be set", !0, 1002, "WS_ERR_EXPECTED_MASK")
            } else if (this._masked) return this._loop = !1, h(RangeError, "MASK must be clear", !0, 1002, "WS_ERR_UNEXPECTED_MASK");
            if (126 === this._payloadLength) this._state = 1;
            else {
              if (127 !== this._payloadLength) return this.haveLength();
              this._state = 2
            }
          }
          getPayloadLength16() {
            if (!(this._bufferedBytes < 2)) return this._payloadLength = this.consume(2).readUInt16BE(0), this.haveLength();
            this._loop = !1
          }
          getPayloadLength64() {
            if (this._bufferedBytes < 8) return void(this._loop = !1);
            const e = this.consume(8),
              t = e.readUInt32BE(0);
            return t > Math.pow(2, 21) - 1 ? (this._loop = !1, h(RangeError, "Unsupported WebSocket frame: payload length > 2^53 - 1", !1, 1009, "WS_ERR_UNSUPPORTED_DATA_PAYLOAD_LENGTH")) : (this._payloadLength = t * Math.pow(2, 32) + e.readUInt32BE(4), this.haveLength())
          }
          haveLength() {
            if (this._payloadLength && this._opcode < 8 && (this._totalPayloadLength += this._payloadLength, this._totalPayloadLength > this._maxPayload && this._maxPayload > 0)) return this._loop = !1, h(RangeError, "Max payload size exceeded", !1, 1009, "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH");
            this._masked ? this._state = 3 : this._state = 4
          }
          getMask() {
            this._bufferedBytes < 4 ? this._loop = !1 : (this._mask = this.consume(4), this._state = 4)
          }
          getData(e) {
            let t = a;
            if (this._payloadLength) {
              if (this._bufferedBytes < this._payloadLength) return void(this._loop = !1);
              t = this.consume(this._payloadLength), this._masked && 0 != (this._mask[0] | this._mask[1] | this._mask[2] | this._mask[3]) && l(t, this._mask)
            }
            return this._opcode > 7 ? this.controlMessage(t) : this._compressed ? (this._state = 5, void this.decompress(t, e)) : (t.length && (this._messageLength = this._totalPayloadLength, this._fragments.push(t)), this.dataMessage())
          }
          decompress(e, t) {
            this._extensions[o.extensionName].decompress(e, this._fin, ((e, n) => {
              if (e) return t(e);
              if (n.length) {
                if (this._messageLength += n.length, this._messageLength > this._maxPayload && this._maxPayload > 0) return t(h(RangeError, "Max payload size exceeded", !1, 1009, "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"));
                this._fragments.push(n)
              }
              const i = this.dataMessage();
              if (i) return t(i);
              this.startLoop(t)
            }))
          }
          dataMessage() {
            if (this._fin) {
              const e = this._messageLength,
                t = this._fragments;
              if (this._totalPayloadLength = 0, this._messageLength = 0, this._fragmented = 0, this._fragments = [], 2 === this._opcode) {
                let n;
                n = "nodebuffer" === this._binaryType ? p(t, e) : "arraybuffer" === this._binaryType ? u(p(t, e)) : t, this.emit("message", n, !0)
              } else {
                const n = p(t, e);
                if (!this._skipUTF8Validation && !f(n)) return this._loop = !1, h(Error, "invalid UTF-8 sequence", !0, 1007, "WS_ERR_INVALID_UTF8");
                this.emit("message", n, !1)
              }
            }
            this._state = 0
          }
          controlMessage(e) {
            if (8 === this._opcode)
              if (this._loop = !1, 0 === e.length) this.emit("conclude", 1005, a), this.end();
              else {
                const t = e.readUInt16BE(0);
                if (!d(t)) return h(RangeError, `invalid status code ${t}`, !0, 1002, "WS_ERR_INVALID_CLOSE_CODE");
                const n = new m(e.buffer, e.byteOffset + 2, e.length - 2);
                if (!this._skipUTF8Validation && !f(n)) return h(Error, "invalid UTF-8 sequence", !0, 1007, "WS_ERR_INVALID_UTF8");
                this.emit("conclude", t, n), this.end()
              }
            else 9 === this._opcode ? this.emit("ping", e) : this.emit("pong", e);
            this._state = 0
          }
        }
      },
      7330: (e, t, n) => {
        "use strict";
        n(1808), n(4404);
        const {
          randomFillSync: i
        } = n(6113), o = n(5196), {
          EMPTY_BUFFER: r
        } = n(1872), {
          isValidStatusCode: a
        } = n(6746), {
          mask: s,
          toBuffer: c
        } = n(977), p = Symbol("kByteLength"), u = Buffer.alloc(4);
        class l {
          constructor(e, t, n) {
            this._extensions = t || {}, n && (this._generateMask = n, this._maskBuffer = Buffer.alloc(4)), this._socket = e, this._firstFragment = !0, this._compress = !1, this._bufferedBytes = 0, this._deflating = !1, this._queue = []
          }
          static frame(e, t) {
            let n, o, r = !1,
              a = 2,
              c = !1;
            t.mask && (n = t.maskBuffer || u, t.generateMask ? t.generateMask(n) : i(n, 0, 4), c = 0 == (n[0] | n[1] | n[2] | n[3]), a = 6), "string" == typeof e ? o = t.mask && !c || void 0 === t[p] ? (e = Buffer.from(e)).length : t[p] : (o = e.length, r = t.mask && t.readOnly && !c);
            let l = o;
            o >= 65536 ? (a += 8, l = 127) : o > 125 && (a += 2, l = 126);
            const d = Buffer.allocUnsafe(r ? o + a : a);
            return d[0] = t.fin ? 128 | t.opcode : t.opcode, t.rsv1 && (d[0] |= 64), d[1] = l, 126 === l ? d.writeUInt16BE(o, 2) : 127 === l && (d[2] = d[3] = 0, d.writeUIntBE(o, 4, 6)), t.mask ? (d[1] |= 128, d[a - 4] = n[0], d[a - 3] = n[1], d[a - 2] = n[2], d[a - 1] = n[3], c ? [d, e] : r ? (s(e, n, d, a, o), [d]) : (s(e, n, e, 0, o), [d, e])) : [d, e]
          }
          close(e, t, n, i) {
            let o;
            if (void 0 === e) o = r;
            else {
              if ("number" != typeof e || !a(e)) throw new TypeError("First argument must be a valid error code number");
              if (void 0 !== t && t.length) {
                const n = Buffer.byteLength(t);
                if (n > 123) throw new RangeError("The message must not be greater than 123 bytes");
                o = Buffer.allocUnsafe(2 + n), o.writeUInt16BE(e, 0), "string" == typeof t ? o.write(t, 2) : o.set(t, 2)
              } else o = Buffer.allocUnsafe(2), o.writeUInt16BE(e, 0)
            }
            const s = {
              [p]: o.length,
              fin: !0,
              generateMask: this._generateMask,
              mask: n,
              maskBuffer: this._maskBuffer,
              opcode: 8,
              readOnly: !1,
              rsv1: !1
            };
            this._deflating ? this.enqueue([this.dispatch, o, !1, s, i]) : this.sendFrame(l.frame(o, s), i)
          }
          ping(e, t, n) {
            let i, o;
            if ("string" == typeof e ? (i = Buffer.byteLength(e), o = !1) : (i = (e = c(e)).length, o = c.readOnly), i > 125) throw new RangeError("The data size must not be greater than 125 bytes");
            const r = {
              [p]: i,
              fin: !0,
              generateMask: this._generateMask,
              mask: t,
              maskBuffer: this._maskBuffer,
              opcode: 9,
              readOnly: o,
              rsv1: !1
            };
            this._deflating ? this.enqueue([this.dispatch, e, !1, r, n]) : this.sendFrame(l.frame(e, r), n)
          }
          pong(e, t, n) {
            let i, o;
            if ("string" == typeof e ? (i = Buffer.byteLength(e), o = !1) : (i = (e = c(e)).length, o = c.readOnly), i > 125) throw new RangeError("The data size must not be greater than 125 bytes");
            const r = {
              [p]: i,
              fin: !0,
              generateMask: this._generateMask,
              mask: t,
              maskBuffer: this._maskBuffer,
              opcode: 10,
              readOnly: o,
              rsv1: !1
            };
            this._deflating ? this.enqueue([this.dispatch, e, !1, r, n]) : this.sendFrame(l.frame(e, r), n)
          }
          send(e, t, n) {
            const i = this._extensions[o.extensionName];
            let r, a, s = t.binary ? 2 : 1,
              u = t.compress;
            if ("string" == typeof e ? (r = Buffer.byteLength(e), a = !1) : (r = (e = c(e)).length, a = c.readOnly), this._firstFragment ? (this._firstFragment = !1, u && i && i.params[i._isServer ? "server_no_context_takeover" : "client_no_context_takeover"] && (u = r >= i._threshold), this._compress = u) : (u = !1, s = 0), t.fin && (this._firstFragment = !0), i) {
              const i = {
                [p]: r,
                fin: t.fin,
                generateMask: this._generateMask,
                mask: t.mask,
                maskBuffer: this._maskBuffer,
                opcode: s,
                readOnly: a,
                rsv1: u
              };
              this._deflating ? this.enqueue([this.dispatch, e, this._compress, i, n]) : this.dispatch(e, this._compress, i, n)
            } else this.sendFrame(l.frame(e, {
              [p]: r,
              fin: t.fin,
              generateMask: this._generateMask,
              mask: t.mask,
              maskBuffer: this._maskBuffer,
              opcode: s,
              readOnly: a,
              rsv1: !1
            }), n)
          }
          dispatch(e, t, n, i) {
            if (!t) return void this.sendFrame(l.frame(e, n), i);
            const r = this._extensions[o.extensionName];
            this._bufferedBytes += n[p], this._deflating = !0, r.compress(e, n.fin, ((e, t) => {
              if (this._socket.destroyed) {
                const e = new Error("The socket was closed while data was being compressed");
                "function" == typeof i && i(e);
                for (let t = 0; t < this._queue.length; t++) {
                  const n = this._queue[t],
                    i = n[n.length - 1];
                  "function" == typeof i && i(e)
                }
              } else this._bufferedBytes -= n[p], this._deflating = !1, n.readOnly = !1, this.sendFrame(l.frame(t, n), i), this.dequeue()
            }))
          }
          dequeue() {
            for (; !this._deflating && this._queue.length;) {
              const e = this._queue.shift();
              this._bufferedBytes -= e[3][p], Reflect.apply(e[0], this, e.slice(1))
            }
          }
          enqueue(e) {
            this._bufferedBytes += e[3][p], this._queue.push(e)
          }
          sendFrame(e, t) {
            2 === e.length ? (this._socket.cork(), this._socket.write(e[0]), this._socket.write(e[1], t), this._socket.uncork()) : this._socket.write(e[0], t)
          }
        }
        e.exports = l
      },
      404: (e, t, n) => {
        "use strict";
        const {
          Duplex: i
        } = n(2781);

        function o(e) {
          e.emit("close")
        }

        function r() {
          !this.destroyed && this._writableState.finished && this.destroy()
        }

        function a(e) {
          this.removeListener("error", a), this.destroy(), 0 === this.listenerCount("error") && this.emit("error", e)
        }
        e.exports = function(e, t) {
          let n = !0;
          const s = new i({
            ...t,
            autoDestroy: !1,
            emitClose: !1,
            objectMode: !1,
            writableObjectMode: !1
          });
          return e.on("message", (function(t, n) {
            const i = !n && s._readableState.objectMode ? t.toString() : t;
            s.push(i) || e.pause()
          })), e.once("error", (function(e) {
            s.destroyed || (n = !1, s.destroy(e))
          })), e.once("close", (function() {
            s.destroyed || s.push(null)
          })), s._destroy = function(t, i) {
            if (e.readyState === e.CLOSED) return i(t), void process.nextTick(o, s);
            let r = !1;
            e.once("error", (function(e) {
              r = !0, i(e)
            })), e.once("close", (function() {
              r || i(t), process.nextTick(o, s)
            })), n && e.terminate()
          }, s._final = function(t) {
            e.readyState !== e.CONNECTING ? null !== e._socket && (e._socket._writableState.finished ? (t(), s._readableState.endEmitted && s.destroy()) : (e._socket.once("finish", (function() {
              t()
            })), e.close())) : e.once("open", (function() {
              s._final(t)
            }))
          }, s._read = function() {
            e.isPaused && e.resume()
          }, s._write = function(t, n, i) {
            e.readyState !== e.CONNECTING ? e.send(t, i) : e.once("open", (function() {
              s._write(t, n, i)
            }))
          }, s.on("end", r), s.on("error", a), s
        }
      },
      640: (e, t, n) => {
        "use strict";
        const {
          tokenChars: i
        } = n(6746);
        e.exports = {
          parse: function(e) {
            const t = new Set;
            let n = -1,
              o = -1,
              r = 0;
            for (; r < e.length; r++) {
              const a = e.charCodeAt(r);
              if (-1 === o && 1 === i[a]) - 1 === n && (n = r);
              else if (0 === r || 32 !== a && 9 !== a) {
                if (44 !== a) throw new SyntaxError(`Unexpected character at index ${r}`);
                {
                  if (-1 === n) throw new SyntaxError(`Unexpected character at index ${r}`); - 1 === o && (o = r);
                  const i = e.slice(n, o);
                  if (t.has(i)) throw new SyntaxError(`The "${i}" subprotocol is duplicated`);
                  t.add(i), n = o = -1
                }
              } else - 1 === o && -1 !== n && (o = r)
            }
            if (-1 === n || -1 !== o) throw new SyntaxError("Unexpected end of input");
            const a = e.slice(n, r);
            if (t.has(a)) throw new SyntaxError(`The "${a}" subprotocol is duplicated`);
            return t.add(a), t
          }
        }
      },
      6746: (e, t, n) => {
        "use strict";
        const {
          isUtf8: i
        } = n(4300);

        function o(e) {
          const t = e.length;
          let n = 0;
          for (; n < t;)
            if (0 == (128 & e[n])) n++;
            else if (192 == (224 & e[n])) {
            if (n + 1 === t || 128 != (192 & e[n + 1]) || 192 == (254 & e[n])) return !1;
            n += 2
          } else if (224 == (240 & e[n])) {
            if (n + 2 >= t || 128 != (192 & e[n + 1]) || 128 != (192 & e[n + 2]) || 224 === e[n] && 128 == (224 & e[n + 1]) || 237 === e[n] && 160 == (224 & e[n + 1])) return !1;
            n += 3
          } else {
            if (240 != (248 & e[n])) return !1;
            if (n + 3 >= t || 128 != (192 & e[n + 1]) || 128 != (192 & e[n + 2]) || 128 != (192 & e[n + 3]) || 240 === e[n] && 128 == (240 & e[n + 1]) || 244 === e[n] && e[n + 1] > 143 || e[n] > 244) return !1;
            n += 4
          }
          return !0
        }
        if (e.exports = {
            isValidStatusCode: function(e) {
              return e >= 1e3 && e <= 1014 && 1004 !== e && 1005 !== e && 1006 !== e || e >= 3e3 && e <= 4999
            },
            isValidUTF8: o,
            tokenChars: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0]
          }, i) e.exports.isValidUTF8 = function(e) {
          return e.length < 24 ? o(e) : i(e)
        };
        else if (!process.env.WS_NO_UTF_8_VALIDATE) try {
          const t = n(2239);
          e.exports.isValidUTF8 = function(e) {
            return e.length < 32 ? o(e) : t(e)
          }
        } catch (e) {}
      },
      9284: (e, t, n) => {
        "use strict";
        const i = n(2361),
          o = n(3685),
          {
            createHash: r
          } = (n(5687), n(1808), n(4404), n(6113)),
          a = n(1503),
          s = n(5196),
          c = n(640),
          p = n(8762),
          {
            GUID: u,
            kWebSocket: l
          } = n(1872),
          d = /^[+/0-9A-Za-z]{22}==$/;

        function f(e) {
          e._state = 2, e.emit("close")
        }

        function m() {
          this.destroy()
        }

        function h(e, t, n, i) {
          n = n || o.STATUS_CODES[t], i = {
            Connection: "close",
            "Content-Type": "text/html",
            "Content-Length": Buffer.byteLength(n),
            ...i
          }, e.once("finish", e.destroy), e.end(`HTTP/1.1 ${t} ${o.STATUS_CODES[t]}\r\n` + Object.keys(i).map((e => `${e}: ${i[e]}`)).join("\r\n") + "\r\n\r\n" + n)
        }

        function v(e, t, n, i, o) {
          if (e.listenerCount("wsClientError")) {
            const i = new Error(o);
            Error.captureStackTrace(i, v), e.emit("wsClientError", i, n, t)
          } else h(n, i, o)
        }
        e.exports = class extends i {
          constructor(e, t) {
            if (super(), null == (e = {
                maxPayload: 104857600,
                skipUTF8Validation: !1,
                perMessageDeflate: !1,
                handleProtocols: null,
                clientTracking: !0,
                verifyClient: null,
                noServer: !1,
                backlog: null,
                server: null,
                host: null,
                path: null,
                port: null,
                WebSocket: p,
                ...e
              }).port && !e.server && !e.noServer || null != e.port && (e.server || e.noServer) || e.server && e.noServer) throw new TypeError('One and only one of the "port", "server", or "noServer" options must be specified');
            if (null != e.port ? (this._server = o.createServer(((e, t) => {
                const n = o.STATUS_CODES[426];
                t.writeHead(426, {
                  "Content-Length": n.length,
                  "Content-Type": "text/plain"
                }), t.end(n)
              })), this._server.listen(e.port, e.host, e.backlog, t)) : e.server && (this._server = e.server), this._server) {
              const e = this.emit.bind(this, "connection");
              this._removeListeners = function(e, t) {
                for (const n of Object.keys(t)) e.on(n, t[n]);
                return function() {
                  for (const n of Object.keys(t)) e.removeListener(n, t[n])
                }
              }(this._server, {
                listening: this.emit.bind(this, "listening"),
                error: this.emit.bind(this, "error"),
                upgrade: (t, n, i) => {
                  this.handleUpgrade(t, n, i, e)
                }
              })
            }!0 === e.perMessageDeflate && (e.perMessageDeflate = {}), e.clientTracking && (this.clients = new Set, this._shouldEmitClose = !1), this.options = e, this._state = 0
          }
          address() {
            if (this.options.noServer) throw new Error('The server is operating in "noServer" mode');
            return this._server ? this._server.address() : null
          }
          close(e) {
            if (2 === this._state) return e && this.once("close", (() => {
              e(new Error("The server is not running"))
            })), void process.nextTick(f, this);
            if (e && this.once("close", e), 1 !== this._state)
              if (this._state = 1, this.options.noServer || this.options.server) this._server && (this._removeListeners(), this._removeListeners = this._server = null), this.clients && this.clients.size ? this._shouldEmitClose = !0 : process.nextTick(f, this);
              else {
                const e = this._server;
                this._removeListeners(), this._removeListeners = this._server = null, e.close((() => {
                  f(this)
                }))
              }
          }
          shouldHandle(e) {
            if (this.options.path) {
              const t = e.url.indexOf("?");
              if ((-1 !== t ? e.url.slice(0, t) : e.url) !== this.options.path) return !1
            }
            return !0
          }
          handleUpgrade(e, t, n, i) {
            t.on("error", m);
            const o = e.headers["sec-websocket-key"],
              r = +e.headers["sec-websocket-version"];
            if ("GET" !== e.method) return void v(this, e, t, 405, "Invalid HTTP method");
            if ("websocket" !== e.headers.upgrade.toLowerCase()) return void v(this, e, t, 400, "Invalid Upgrade header");
            if (!o || !d.test(o)) return void v(this, e, t, 400, "Missing or invalid Sec-WebSocket-Key header");
            if (8 !== r && 13 !== r) return void v(this, e, t, 400, "Missing or invalid Sec-WebSocket-Version header");
            if (!this.shouldHandle(e)) return void h(t, 400);
            const p = e.headers["sec-websocket-protocol"];
            let u = new Set;
            if (void 0 !== p) try {
              u = c.parse(p)
            } catch (n) {
              return void v(this, e, t, 400, "Invalid Sec-WebSocket-Protocol header")
            }
            const l = e.headers["sec-websocket-extensions"],
              f = {};
            if (this.options.perMessageDeflate && void 0 !== l) {
              const n = new s(this.options.perMessageDeflate, !0, this.options.maxPayload);
              try {
                const e = a.parse(l);
                e[s.extensionName] && (n.accept(e[s.extensionName]), f[s.extensionName] = n)
              } catch (n) {
                return void v(this, e, t, 400, "Invalid or unacceptable Sec-WebSocket-Extensions header")
              }
            }
            if (this.options.verifyClient) {
              const a = {
                origin: e.headers[8 === r ? "sec-websocket-origin" : "origin"],
                secure: !(!e.socket.authorized && !e.socket.encrypted),
                req: e
              };
              if (2 === this.options.verifyClient.length) return void this.options.verifyClient(a, ((r, a, s, c) => {
                if (!r) return h(t, a || 401, s, c);
                this.completeUpgrade(f, o, u, e, t, n, i)
              }));
              if (!this.options.verifyClient(a)) return h(t, 401)
            }
            this.completeUpgrade(f, o, u, e, t, n, i)
          }
          completeUpgrade(e, t, n, i, o, c, p) {
            if (!o.readable || !o.writable) return o.destroy();
            if (o[l]) throw new Error("server.handleUpgrade() was called more than once with the same socket, possibly due to a misconfiguration");
            if (this._state > 0) return h(o, 503);
            const d = ["HTTP/1.1 101 Switching Protocols", "Upgrade: websocket", "Connection: Upgrade", `Sec-WebSocket-Accept: ${r("sha1").update(t+u).digest("base64")}`],
              v = new this.options.WebSocket(null);
            if (n.size) {
              const e = this.options.handleProtocols ? this.options.handleProtocols(n, i) : n.values().next().value;
              e && (d.push(`Sec-WebSocket-Protocol: ${e}`), v._protocol = e)
            }
            if (e[s.extensionName]) {
              const t = e[s.extensionName].params,
                n = a.format({
                  [s.extensionName]: [t]
                });
              d.push(`Sec-WebSocket-Extensions: ${n}`), v._extensions = e
            }
            this.emit("headers", d, i), o.write(d.concat("\r\n").join("\r\n")), o.removeListener("error", m), v.setSocket(o, c, {
              maxPayload: this.options.maxPayload,
              skipUTF8Validation: this.options.skipUTF8Validation
            }), this.clients && (this.clients.add(v), v.on("close", (() => {
              this.clients.delete(v), this._shouldEmitClose && !this.clients.size && process.nextTick(f, this)
            }))), p(v, i)
          }
        }
      },
      8762: (e, t, n) => {
        "use strict";
        const i = n(2361),
          o = n(5687),
          r = n(3685),
          a = n(1808),
          s = n(4404),
          {
            randomBytes: c,
            createHash: p
          } = n(6113),
          {
            Readable: u
          } = n(2781),
          {
            URL: l
          } = n(7310),
          d = n(5196),
          f = n(2957),
          m = n(7330),
          {
            BINARY_TYPES: h,
            EMPTY_BUFFER: v,
            GUID: g,
            kForOnEventAttribute: x,
            kListener: b,
            kStatusCode: y,
            kWebSocket: w,
            NOOP: _
          } = n(1872),
          {
            EventTarget: {
              addEventListener: E,
              removeEventListener: S
            }
          } = n(62),
          {
            format: O,
            parse: T
          } = n(1503),
          {
            toBuffer: C
          } = n(977),
          I = Symbol("kAborted"),
          N = [8, 13],
          P = ["CONNECTING", "OPEN", "CLOSING", "CLOSED"],
          k = /^[!#$%&'*+\-.0-9A-Z^_`|a-z~]+$/;
        class D extends i {
          constructor(e, t, n) {
            super(), this._binaryType = h[0], this._closeCode = 1006, this._closeFrameReceived = !1, this._closeFrameSent = !1, this._closeMessage = v, this._closeTimer = null, this._extensions = {}, this._paused = !1, this._protocol = "", this._readyState = D.CONNECTING, this._receiver = null, this._sender = null, this._socket = null, null !== e ? (this._bufferedAmount = 0, this._isServer = !1, this._redirects = 0, void 0 === t ? t = [] : Array.isArray(t) || ("object" == typeof t && null !== t ? (n = t, t = []) : t = [t]), A(this, e, t, n)) : this._isServer = !0
          }
          get binaryType() {
            return this._binaryType
          }
          set binaryType(e) {
            h.includes(e) && (this._binaryType = e, this._receiver && (this._receiver._binaryType = e))
          }
          get bufferedAmount() {
            return this._socket ? this._socket._writableState.length + this._sender._bufferedBytes : this._bufferedAmount
          }
          get extensions() {
            return Object.keys(this._extensions).join()
          }
          get isPaused() {
            return this._paused
          }
          get onclose() {
            return null
          }
          get onerror() {
            return null
          }
          get onopen() {
            return null
          }
          get onmessage() {
            return null
          }
          get protocol() {
            return this._protocol
          }
          get readyState() {
            return this._readyState
          }
          get url() {
            return this._url
          }
          setSocket(e, t, n) {
            const i = new f({
              binaryType: this.binaryType,
              extensions: this._extensions,
              isServer: this._isServer,
              maxPayload: n.maxPayload,
              skipUTF8Validation: n.skipUTF8Validation
            });
            this._sender = new m(e, this._extensions, n.generateMask), this._receiver = i, this._socket = e, i[w] = this, e[w] = this, i.on("conclude", U), i.on("drain", B), i.on("error", z), i.on("message", V), i.on("ping", G), i.on("pong", H), e.setTimeout(0), e.setNoDelay(), t.length > 0 && e.unshift(t), e.on("close", K), e.on("data", $), e.on("end", Y), e.on("error", X), this._readyState = D.OPEN, this.emit("open")
          }
          emitClose() {
            if (!this._socket) return this._readyState = D.CLOSED, void this.emit("close", this._closeCode, this._closeMessage);
            this._extensions[d.extensionName] && this._extensions[d.extensionName].cleanup(), this._receiver.removeAllListeners(), this._readyState = D.CLOSED, this.emit("close", this._closeCode, this._closeMessage)
          }
          close(e, t) {
            if (this.readyState !== D.CLOSED)
              if (this.readyState !== D.CONNECTING) this.readyState !== D.CLOSING ? (this._readyState = D.CLOSING, this._sender.close(e, t, !this._isServer, (e => {
                e || (this._closeFrameSent = !0, (this._closeFrameReceived || this._receiver._writableState.errorEmitted) && this._socket.end())
              })), this._closeTimer = setTimeout(this._socket.destroy.bind(this._socket), 3e4)) : this._closeFrameSent && (this._closeFrameReceived || this._receiver._writableState.errorEmitted) && this._socket.end();
              else {
                const e = "WebSocket was closed before the connection was established";
                F(this, this._req, e)
              }
          }
          pause() {
            this.readyState !== D.CONNECTING && this.readyState !== D.CLOSED && (this._paused = !0, this._socket.pause())
          }
          ping(e, t, n) {
            if (this.readyState === D.CONNECTING) throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
            "function" == typeof e ? (n = e, e = t = void 0) : "function" == typeof t && (n = t, t = void 0), "number" == typeof e && (e = e.toString()), this.readyState === D.OPEN ? (void 0 === t && (t = !this._isServer), this._sender.ping(e || v, t, n)) : M(this, e, n)
          }
          pong(e, t, n) {
            if (this.readyState === D.CONNECTING) throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
            "function" == typeof e ? (n = e, e = t = void 0) : "function" == typeof t && (n = t, t = void 0), "number" == typeof e && (e = e.toString()), this.readyState === D.OPEN ? (void 0 === t && (t = !this._isServer), this._sender.pong(e || v, t, n)) : M(this, e, n)
          }
          resume() {
            this.readyState !== D.CONNECTING && this.readyState !== D.CLOSED && (this._paused = !1, this._receiver._writableState.needDrain || this._socket.resume())
          }
          send(e, t, n) {
            if (this.readyState === D.CONNECTING) throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
            if ("function" == typeof t && (n = t, t = {}), "number" == typeof e && (e = e.toString()), this.readyState !== D.OPEN) return void M(this, e, n);
            const i = {
              binary: "string" != typeof e,
              mask: !this._isServer,
              compress: !0,
              fin: !0,
              ...t
            };
            this._extensions[d.extensionName] || (i.compress = !1), this._sender.send(e || v, i, n)
          }
          terminate() {
            if (this.readyState !== D.CLOSED)
              if (this.readyState !== D.CONNECTING) this._socket && (this._readyState = D.CLOSING, this._socket.destroy());
              else {
                const e = "WebSocket was closed before the connection was established";
                F(this, this._req, e)
              }
          }
        }

        function A(e, t, n, i) {
          const a = {
            protocolVersion: N[1],
            maxPayload: 104857600,
            skipUTF8Validation: !1,
            perMessageDeflate: !0,
            followRedirects: !1,
            maxRedirects: 10,
            ...i,
            createConnection: void 0,
            socketPath: void 0,
            hostname: void 0,
            protocol: void 0,
            timeout: void 0,
            method: "GET",
            host: void 0,
            path: void 0,
            port: void 0
          };
          if (!N.includes(a.protocolVersion)) throw new RangeError(`Unsupported protocol version: ${a.protocolVersion} (supported versions: ${N.join(", ")})`);
          let s;
          if (t instanceof l) s = t, e._url = t.href;
          else {
            try {
              s = new l(t)
            } catch (e) {
              throw new SyntaxError(`Invalid URL: ${t}`)
            }
            e._url = t
          }
          const u = "wss:" === s.protocol,
            f = "ws+unix:" === s.protocol;
          let m;
          if ("ws:" === s.protocol || u || f ? f && !s.pathname ? m = "The URL's pathname is empty" : s.hash && (m = "The URL contains a fragment identifier") : m = 'The URL\'s protocol must be one of "ws:", "wss:", or "ws+unix:"', m) {
            const t = new SyntaxError(m);
            if (0 === e._redirects) throw t;
            return void j(e, t)
          }
          const h = u ? 443 : 80,
            v = c(16).toString("base64"),
            x = u ? o.request : r.request,
            b = new Set;
          let y, w;
          if (a.createConnection = u ? L : R, a.defaultPort = a.defaultPort || h, a.port = s.port || h, a.host = s.hostname.startsWith("[") ? s.hostname.slice(1, -1) : s.hostname, a.headers = {
              ...a.headers,
              "Sec-WebSocket-Version": a.protocolVersion,
              "Sec-WebSocket-Key": v,
              Connection: "Upgrade",
              Upgrade: "websocket"
            }, a.path = s.pathname + s.search, a.timeout = a.handshakeTimeout, a.perMessageDeflate && (y = new d(!0 !== a.perMessageDeflate ? a.perMessageDeflate : {}, !1, a.maxPayload), a.headers["Sec-WebSocket-Extensions"] = O({
              [d.extensionName]: y.offer()
            })), n.length) {
            for (const e of n) {
              if ("string" != typeof e || !k.test(e) || b.has(e)) throw new SyntaxError("An invalid or duplicated subprotocol was specified");
              b.add(e)
            }
            a.headers["Sec-WebSocket-Protocol"] = n.join(",")
          }
          if (a.origin && (a.protocolVersion < 13 ? a.headers["Sec-WebSocket-Origin"] = a.origin : a.headers.Origin = a.origin), (s.username || s.password) && (a.auth = `${s.username}:${s.password}`), f) {
            const e = a.path.split(":");
            a.socketPath = e[0], a.path = e[1]
          }
          if (a.followRedirects) {
            if (0 === e._redirects) {
              e._originalIpc = f, e._originalSecure = u, e._originalHostOrSocketPath = f ? a.socketPath : s.host;
              const t = i && i.headers;
              if (i = {
                  ...i,
                  headers: {}
                }, t)
                for (const [e, n] of Object.entries(t)) i.headers[e.toLowerCase()] = n
            } else if (0 === e.listenerCount("redirect")) {
              const t = f ? !!e._originalIpc && a.socketPath === e._originalHostOrSocketPath : !e._originalIpc && s.host === e._originalHostOrSocketPath;
              (!t || e._originalSecure && !u) && (delete a.headers.authorization, delete a.headers.cookie, t || delete a.headers.host, a.auth = void 0)
            }
            a.auth && !i.headers.authorization && (i.headers.authorization = "Basic " + Buffer.from(a.auth).toString("base64")), w = e._req = x(a), e._redirects && e.emit("redirect", e.url, w)
          } else w = e._req = x(a);
          a.timeout && w.on("timeout", (() => {
            F(e, w, "Opening handshake has timed out")
          })), w.on("error", (t => {
            null === w || w[I] || (w = e._req = null, j(e, t))
          })), w.on("response", (o => {
            const r = o.headers.location,
              s = o.statusCode;
            if (r && a.followRedirects && s >= 300 && s < 400) {
              if (++e._redirects > a.maxRedirects) return void F(e, w, "Maximum redirects exceeded");
              let o;
              w.abort();
              try {
                o = new l(r, t)
              } catch (t) {
                const n = new SyntaxError(`Invalid URL: ${r}`);
                return void j(e, n)
              }
              A(e, o, n, i)
            } else e.emit("unexpected-response", w, o) || F(e, w, `Unexpected server response: ${o.statusCode}`)
          })), w.on("upgrade", ((t, n, i) => {
            if (e.emit("upgrade", t), e.readyState !== D.CONNECTING) return;
            if (w = e._req = null, "websocket" !== t.headers.upgrade.toLowerCase()) return void F(e, n, "Invalid Upgrade header");
            const o = p("sha1").update(v + g).digest("base64");
            if (t.headers["sec-websocket-accept"] !== o) return void F(e, n, "Invalid Sec-WebSocket-Accept header");
            const r = t.headers["sec-websocket-protocol"];
            let s;
            if (void 0 !== r ? b.size ? b.has(r) || (s = "Server sent an invalid subprotocol") : s = "Server sent a subprotocol but none was requested" : b.size && (s = "Server sent no subprotocol"), s) return void F(e, n, s);
            r && (e._protocol = r);
            const c = t.headers["sec-websocket-extensions"];
            if (void 0 !== c) {
              if (!y) return void F(e, n, "Server sent a Sec-WebSocket-Extensions header but no extension was requested");
              let t;
              try {
                t = T(c)
              } catch (t) {
                return void F(e, n, "Invalid Sec-WebSocket-Extensions header")
              }
              const i = Object.keys(t);
              if (1 !== i.length || i[0] !== d.extensionName) return void F(e, n, "Server indicated an extension that was not requested");
              try {
                y.accept(t[d.extensionName])
              } catch (t) {
                return void F(e, n, "Invalid Sec-WebSocket-Extensions header")
              }
              e._extensions[d.extensionName] = y
            }
            e.setSocket(n, i, {
              generateMask: a.generateMask,
              maxPayload: a.maxPayload,
              skipUTF8Validation: a.skipUTF8Validation
            })
          })), a.finishRequest ? a.finishRequest(w, e) : w.end()
        }

        function j(e, t) {
          e._readyState = D.CLOSING, e.emit("error", t), e.emitClose()
        }

        function R(e) {
          return e.path = e.socketPath, a.connect(e)
        }

        function L(e) {
          return e.path = void 0, e.servername || "" === e.servername || (e.servername = a.isIP(e.host) ? "" : e.host), s.connect(e)
        }

        function F(e, t, n) {
          e._readyState = D.CLOSING;
          const i = new Error(n);
          Error.captureStackTrace(i, F), t.setHeader ? (t[I] = !0, t.abort(), t.socket && !t.socket.destroyed && t.socket.destroy(), process.nextTick(j, e, i)) : (t.destroy(i), t.once("error", e.emit.bind(e, "error")), t.once("close", e.emitClose.bind(e)))
        }

        function M(e, t, n) {
          if (t) {
            const n = C(t).length;
            e._socket ? e._sender._bufferedBytes += n : e._bufferedAmount += n
          }
          if (n) {
            const t = new Error(`WebSocket is not open: readyState ${e.readyState} (${P[e.readyState]})`);
            process.nextTick(n, t)
          }
        }

        function U(e, t) {
          const n = this[w];
          n._closeFrameReceived = !0, n._closeMessage = t, n._closeCode = e, void 0 !== n._socket[w] && (n._socket.removeListener("data", $), process.nextTick(W, n._socket), 1005 === e ? n.close() : n.close(e, t))
        }

        function B() {
          const e = this[w];
          e.isPaused || e._socket.resume()
        }

        function z(e) {
          const t = this[w];
          void 0 !== t._socket[w] && (t._socket.removeListener("data", $), process.nextTick(W, t._socket), t.close(e[y])), t.emit("error", e)
        }

        function q() {
          this[w].emitClose()
        }

        function V(e, t) {
          this[w].emit("message", e, t)
        }

        function G(e) {
          const t = this[w];
          t.pong(e, !t._isServer, _), t.emit("ping", e)
        }

        function H(e) {
          this[w].emit("pong", e)
        }

        function W(e) {
          e.resume()
        }

        function K() {
          const e = this[w];
          let t;
          this.removeListener("close", K), this.removeListener("data", $), this.removeListener("end", Y), e._readyState = D.CLOSING, this._readableState.endEmitted || e._closeFrameReceived || e._receiver._writableState.errorEmitted || null === (t = e._socket.read()) || e._receiver.write(t), e._receiver.end(), this[w] = void 0, clearTimeout(e._closeTimer), e._receiver._writableState.finished || e._receiver._writableState.errorEmitted ? e.emitClose() : (e._receiver.on("error", q), e._receiver.on("finish", q))
        }

        function $(e) {
          this[w]._receiver.write(e) || this.pause()
        }

        function Y() {
          const e = this[w];
          e._readyState = D.CLOSING, e._receiver.end(), this.end()
        }

        function X() {
          const e = this[w];
          this.removeListener("error", X), this.on("error", _), e && (e._readyState = D.CLOSING, this.destroy())
        }
        Object.defineProperty(D, "CONNECTING", {
          enumerable: !0,
          value: P.indexOf("CONNECTING")
        }), Object.defineProperty(D.prototype, "CONNECTING", {
          enumerable: !0,
          value: P.indexOf("CONNECTING")
        }), Object.defineProperty(D, "OPEN", {
          enumerable: !0,
          value: P.indexOf("OPEN")
        }), Object.defineProperty(D.prototype, "OPEN", {
          enumerable: !0,
          value: P.indexOf("OPEN")
        }), Object.defineProperty(D, "CLOSING", {
          enumerable: !0,
          value: P.indexOf("CLOSING")
        }), Object.defineProperty(D.prototype, "CLOSING", {
          enumerable: !0,
          value: P.indexOf("CLOSING")
        }), Object.defineProperty(D, "CLOSED", {
          enumerable: !0,
          value: P.indexOf("CLOSED")
        }), Object.defineProperty(D.prototype, "CLOSED", {
          enumerable: !0,
          value: P.indexOf("CLOSED")
        }), ["binaryType", "bufferedAmount", "extensions", "isPaused", "protocol", "readyState", "url"].forEach((e => {
          Object.defineProperty(D.prototype, e, {
            enumerable: !0
          })
        })), ["open", "error", "close", "message"].forEach((e => {
          Object.defineProperty(D.prototype, `on${e}`, {
            enumerable: !0,
            get() {
              for (const t of this.listeners(e))
                if (t[x]) return t[b];
              return null
            },
            set(t) {
              for (const t of this.listeners(e))
                if (t[x]) {
                  this.removeListener(e, t);
                  break
                }
              "function" == typeof t && this.addEventListener(e, t, {
                [x]: !0
              })
            }
          })
        })), D.prototype.addEventListener = E, D.prototype.removeEventListener = S, e.exports = D
      },
      306: function(e, t) {
        (function() {
          "use strict";
          t.stripBOM = function(e) {
            return "\ufeff" === e[0] ? e.substring(1) : e
          }
        }).call(this)
      },
      4096: function(e, t, n) {
        (function() {
          "use strict";
          var e, i, o, r, a, s = {}.hasOwnProperty;
          e = n(5532), i = n(8381).defaults, r = function(e) {
            return "string" == typeof e && (e.indexOf("&") >= 0 || e.indexOf(">") >= 0 || e.indexOf("<") >= 0)
          }, a = function(e) {
            return "<![CDATA[" + o(e) + "]]>"
          }, o = function(e) {
            return e.replace("]]>", "]]]]><![CDATA[>")
          }, t.Builder = function() {
            function t(e) {
              var t, n, o;
              for (t in this.options = {}, n = i[.2]) s.call(n, t) && (o = n[t], this.options[t] = o);
              for (t in e) s.call(e, t) && (o = e[t], this.options[t] = o)
            }
            return t.prototype.buildObject = function(t) {
              var n, o, c, p, u, l;
              return n = this.options.attrkey, o = this.options.charkey, 1 === Object.keys(t).length && this.options.rootName === i[.2].rootName ? t = t[u = Object.keys(t)[0]] : u = this.options.rootName, l = this, c = function(e, t) {
                var i, p, u, d, f, m;
                if ("object" != typeof t) l.options.cdata && r(t) ? e.raw(a(t)) : e.txt(t);
                else if (Array.isArray(t)) {
                  for (d in t)
                    if (s.call(t, d))
                      for (f in p = t[d]) u = p[f], e = c(e.ele(f), u).up()
                } else
                  for (f in t)
                    if (s.call(t, f))
                      if (p = t[f], f === n) {
                        if ("object" == typeof p)
                          for (i in p) m = p[i], e = e.att(i, m)
                      } else if (f === o) e = l.options.cdata && r(p) ? e.raw(a(p)) : e.txt(p);
                else if (Array.isArray(p))
                  for (d in p) s.call(p, d) && (e = "string" == typeof(u = p[d]) ? l.options.cdata && r(u) ? e.ele(f).raw(a(u)).up() : e.ele(f, u).up() : c(e.ele(f), u).up());
                else "object" == typeof p ? e = c(e.ele(f), p).up() : "string" == typeof p && l.options.cdata && r(p) ? e = e.ele(f).raw(a(p)).up() : (null == p && (p = ""), e = e.ele(f, p.toString()).up());
                return e
              }, p = e.create(u, this.options.xmldec, this.options.doctype, {
                headless: this.options.headless,
                allowSurrogateChars: this.options.allowSurrogateChars
              }), c(p, t).end(this.options.renderOpts)
            }, t
          }()
        }).call(this)
      },
      8381: function(e, t) {
        (function() {
          t.defaults = {
            .1: {
              explicitCharkey: !1,
              trim: !0,
              normalize: !0,
              normalizeTags: !1,
              attrkey: "@",
              charkey: "#",
              explicitArray: !1,
              ignoreAttrs: !1,
              mergeAttrs: !1,
              explicitRoot: !1,
              validator: null,
              xmlns: !1,
              explicitChildren: !1,
              childkey: "@@",
              charsAsChildren: !1,
              includeWhiteChars: !1,
              async: !1,
              strict: !0,
              attrNameProcessors: null,
              attrValueProcessors: null,
              tagNameProcessors: null,
              valueProcessors: null,
              emptyTag: ""
            },
            .2: {
              explicitCharkey: !1,
              trim: !1,
              normalize: !1,
              normalizeTags: !1,
              attrkey: "$",
              charkey: "_",
              explicitArray: !0,
              ignoreAttrs: !1,
              mergeAttrs: !1,
              explicitRoot: !0,
              validator: null,
              xmlns: !1,
              explicitChildren: !1,
              preserveChildrenOrder: !1,
              childkey: "$$",
              charsAsChildren: !1,
              includeWhiteChars: !1,
              async: !1,
              strict: !0,
              attrNameProcessors: null,
              attrValueProcessors: null,
              tagNameProcessors: null,
              valueProcessors: null,
              rootName: "root",
              xmldec: {
                version: "1.0",
                encoding: "UTF-8",
                standalone: !0
              },
              doctype: null,
              renderOpts: {
                pretty: !0,
                indent: "  ",
                newline: "\n"
              },
              headless: !1,
              chunkSize: 1e4,
              emptyTag: "",
              cdata: !1
            }
          }
        }).call(this)
      },
      9082: function(e, t, n) {
        (function() {
          "use strict";
          var e, i, o, r, a, s, c, p, u = function(e, t) {
              return function() {
                return e.apply(t, arguments)
              }
            },
            l = {}.hasOwnProperty;
          c = n(6099), o = n(2361), e = n(306), s = n(7526), p = n(9512).setImmediate, i = n(8381).defaults, r = function(e) {
            return "object" == typeof e && null != e && 0 === Object.keys(e).length
          }, a = function(e, t, n) {
            var i, o;
            for (i = 0, o = e.length; i < o; i++) t = (0, e[i])(t, n);
            return t
          }, t.Parser = function(n) {
            function o(e) {
              var n, o, r;
              if (this.parseStringPromise = u(this.parseStringPromise, this), this.parseString = u(this.parseString, this), this.reset = u(this.reset, this), this.assignOrPush = u(this.assignOrPush, this), this.processAsync = u(this.processAsync, this), !(this instanceof t.Parser)) return new t.Parser(e);
              for (n in this.options = {}, o = i[.2]) l.call(o, n) && (r = o[n], this.options[n] = r);
              for (n in e) l.call(e, n) && (r = e[n], this.options[n] = r);
              this.options.xmlns && (this.options.xmlnskey = this.options.attrkey + "ns"), this.options.normalizeTags && (this.options.tagNameProcessors || (this.options.tagNameProcessors = []), this.options.tagNameProcessors.unshift(s.normalize)), this.reset()
            }
            return function(e, t) {
              for (var n in t) l.call(t, n) && (e[n] = t[n]);

              function i() {
                this.constructor = e
              }
              i.prototype = t.prototype, e.prototype = new i, e.__super__ = t.prototype
            }(o, n), o.prototype.processAsync = function() {
              var e, t;
              try {
                return this.remaining.length <= this.options.chunkSize ? (e = this.remaining, this.remaining = "", this.saxParser = this.saxParser.write(e), this.saxParser.close()) : (e = this.remaining.substr(0, this.options.chunkSize), this.remaining = this.remaining.substr(this.options.chunkSize, this.remaining.length), this.saxParser = this.saxParser.write(e), p(this.processAsync))
              } catch (e) {
                if (t = e, !this.saxParser.errThrown) return this.saxParser.errThrown = !0, this.emit(t)
              }
            }, o.prototype.assignOrPush = function(e, t, n) {
              return t in e ? (e[t] instanceof Array || (e[t] = [e[t]]), e[t].push(n)) : this.options.explicitArray ? e[t] = [n] : e[t] = n
            }, o.prototype.reset = function() {
              var e, t, n, i, o;
              return this.removeAllListeners(), this.saxParser = c.parser(this.options.strict, {
                trim: !1,
                normalize: !1,
                xmlns: this.options.xmlns
              }), this.saxParser.errThrown = !1, this.saxParser.onerror = (o = this, function(e) {
                if (o.saxParser.resume(), !o.saxParser.errThrown) return o.saxParser.errThrown = !0, o.emit("error", e)
              }), this.saxParser.onend = function(e) {
                return function() {
                  if (!e.saxParser.ended) return e.saxParser.ended = !0, e.emit("end", e.resultObject)
                }
              }(this), this.saxParser.ended = !1, this.EXPLICIT_CHARKEY = this.options.explicitCharkey, this.resultObject = null, i = [], e = this.options.attrkey, t = this.options.charkey, this.saxParser.onopentag = function(n) {
                return function(o) {
                  var r, s, c, p, u;
                  if ((c = Object.create(null))[t] = "", !n.options.ignoreAttrs)
                    for (r in u = o.attributes) l.call(u, r) && (e in c || n.options.mergeAttrs || (c[e] = Object.create(null)), s = n.options.attrValueProcessors ? a(n.options.attrValueProcessors, o.attributes[r], r) : o.attributes[r], p = n.options.attrNameProcessors ? a(n.options.attrNameProcessors, r) : r, n.options.mergeAttrs ? n.assignOrPush(c, p, s) : c[e][p] = s);
                  return c["#name"] = n.options.tagNameProcessors ? a(n.options.tagNameProcessors, o.name) : o.name, n.options.xmlns && (c[n.options.xmlnskey] = {
                    uri: o.uri,
                    local: o.local
                  }), i.push(c)
                }
              }(this), this.saxParser.onclosetag = function(e) {
                return function() {
                  var n, o, s, c, p, u, d, f, m, h;
                  if (u = i.pop(), p = u["#name"], e.options.explicitChildren && e.options.preserveChildrenOrder || delete u["#name"], !0 === u.cdata && (n = u.cdata, delete u.cdata), m = i[i.length - 1], u[t].match(/^\s*$/) && !n ? (o = u[t], delete u[t]) : (e.options.trim && (u[t] = u[t].trim()), e.options.normalize && (u[t] = u[t].replace(/\s{2,}/g, " ").trim()), u[t] = e.options.valueProcessors ? a(e.options.valueProcessors, u[t], p) : u[t], 1 === Object.keys(u).length && t in u && !e.EXPLICIT_CHARKEY && (u = u[t])), r(u) && (u = "function" == typeof e.options.emptyTag ? e.options.emptyTag() : "" !== e.options.emptyTag ? e.options.emptyTag : o), null != e.options.validator && (h = "/" + function() {
                      var e, t, n;
                      for (n = [], e = 0, t = i.length; e < t; e++) c = i[e], n.push(c["#name"]);
                      return n
                    }().concat(p).join("/"), function() {
                      var t;
                      try {
                        return u = e.options.validator(h, m && m[p], u)
                      } catch (n) {
                        return t = n, e.emit("error", t)
                      }
                    }()), e.options.explicitChildren && !e.options.mergeAttrs && "object" == typeof u)
                    if (e.options.preserveChildrenOrder) {
                      if (m) {
                        for (s in m[e.options.childkey] = m[e.options.childkey] || [], d = Object.create(null), u) l.call(u, s) && (d[s] = u[s]);
                        m[e.options.childkey].push(d), delete u["#name"], 1 === Object.keys(u).length && t in u && !e.EXPLICIT_CHARKEY && (u = u[t])
                      }
                    } else c = Object.create(null), e.options.attrkey in u && (c[e.options.attrkey] = u[e.options.attrkey], delete u[e.options.attrkey]), !e.options.charsAsChildren && e.options.charkey in u && (c[e.options.charkey] = u[e.options.charkey], delete u[e.options.charkey]), Object.getOwnPropertyNames(u).length > 0 && (c[e.options.childkey] = u), u = c;
                  return i.length > 0 ? e.assignOrPush(m, p, u) : (e.options.explicitRoot && (f = u, (u = Object.create(null))[p] = f), e.resultObject = u, e.saxParser.ended = !0, e.emit("end", e.resultObject))
                }
              }(this), n = function(e) {
                return function(n) {
                  var o, r;
                  if (r = i[i.length - 1]) return r[t] += n, e.options.explicitChildren && e.options.preserveChildrenOrder && e.options.charsAsChildren && (e.options.includeWhiteChars || "" !== n.replace(/\\n/g, "").trim()) && (r[e.options.childkey] = r[e.options.childkey] || [], (o = {
                    "#name": "__text__"
                  })[t] = n, e.options.normalize && (o[t] = o[t].replace(/\s{2,}/g, " ").trim()), r[e.options.childkey].push(o)), r
                }
              }(this), this.saxParser.ontext = n, this.saxParser.oncdata = function(e) {
                var t;
                if (t = n(e)) return t.cdata = !0
              }
            }, o.prototype.parseString = function(t, n) {
              var i;
              null != n && "function" == typeof n && (this.on("end", (function(e) {
                return this.reset(), n(null, e)
              })), this.on("error", (function(e) {
                return this.reset(), n(e)
              })));
              try {
                return "" === (t = t.toString()).trim() ? (this.emit("end", null), !0) : (t = e.stripBOM(t), this.options.async ? (this.remaining = t, p(this.processAsync), this.saxParser) : this.saxParser.write(t).close())
              } catch (e) {
                if (i = e, !this.saxParser.errThrown && !this.saxParser.ended) return this.emit("error", i), this.saxParser.errThrown = !0;
                if (this.saxParser.ended) throw i
              }
            }, o.prototype.parseStringPromise = function(e) {
              return new Promise((t = this, function(n, i) {
                return t.parseString(e, (function(e, t) {
                  return e ? i(e) : n(t)
                }))
              }));
              var t
            }, o
          }(o), t.parseString = function(e, n, i) {
            var o, r;
            return null != i ? ("function" == typeof i && (o = i), "object" == typeof n && (r = n)) : ("function" == typeof n && (o = n), r = {}), new t.Parser(r).parseString(e, o)
          }, t.parseStringPromise = function(e, n) {
            var i;
            return "object" == typeof n && (i = n), new t.Parser(i).parseStringPromise(e)
          }
        }).call(this)
      },
      7526: function(e, t) {
        (function() {
          "use strict";
          var e;
          e = new RegExp(/(?!xmlns)^.*:/), t.normalize = function(e) {
            return e.toLowerCase()
          }, t.firstCharLowerCase = function(e) {
            return e.charAt(0).toLowerCase() + e.slice(1)
          }, t.stripPrefix = function(t) {
            return t.replace(e, "")
          }, t.parseNumbers = function(e) {
            return isNaN(e) || (e = e % 1 == 0 ? parseInt(e, 10) : parseFloat(e)), e
          }, t.parseBooleans = function(e) {
            return /^(?:true|false)$/i.test(e) && (e = "true" === e.toLowerCase()), e
          }
        }).call(this)
      },
      5055: function(e, t, n) {
        (function() {
          "use strict";
          var e, i, o, r, a = {}.hasOwnProperty;
          i = n(8381), e = n(4096), o = n(9082), r = n(7526), t.defaults = i.defaults, t.processors = r, t.ValidationError = function(e) {
            function t(e) {
              this.message = e
            }
            return function(e, t) {
              for (var n in t) a.call(t, n) && (e[n] = t[n]);

              function i() {
                this.constructor = e
              }
              i.prototype = t.prototype, e.prototype = new i, e.__super__ = t.prototype
            }(t, Error), t
          }(), t.Builder = e.Builder, t.Parser = o.Parser, t.parseString = o.parseString, t.parseStringPromise = o.parseStringPromise
        }).call(this)
      },
      7557: function(e) {
        (function() {
          e.exports = {
            Disconnected: 1,
            Preceding: 2,
            Following: 4,
            Contains: 8,
            ContainedBy: 16,
            ImplementationSpecific: 32
          }
        }).call(this)
      },
      9335: function(e) {
        (function() {
          e.exports = {
            Element: 1,
            Attribute: 2,
            Text: 3,
            CData: 4,
            EntityReference: 5,
            EntityDeclaration: 6,
            ProcessingInstruction: 7,
            Comment: 8,
            Document: 9,
            DocType: 10,
            DocumentFragment: 11,
            NotationDeclaration: 12,
            Declaration: 201,
            Raw: 202,
            AttributeDeclaration: 203,
            ElementDeclaration: 204,
            Dummy: 205
          }
        }).call(this)
      },
      8369: function(e) {
        (function() {
          var t, n, i, o, r, a, s, c = [].slice,
            p = {}.hasOwnProperty;
          t = function() {
            var e, t, n, i, o, a;
            if (a = arguments[0], o = 2 <= arguments.length ? c.call(arguments, 1) : [], r(Object.assign)) Object.assign.apply(null, arguments);
            else
              for (e = 0, n = o.length; e < n; e++)
                if (null != (i = o[e]))
                  for (t in i) p.call(i, t) && (a[t] = i[t]);
            return a
          }, r = function(e) {
            return !!e && "[object Function]" === Object.prototype.toString.call(e)
          }, a = function(e) {
            var t;
            return !!e && ("function" == (t = typeof e) || "object" === t)
          }, i = function(e) {
            return r(Array.isArray) ? Array.isArray(e) : "[object Array]" === Object.prototype.toString.call(e)
          }, o = function(e) {
            var t;
            if (i(e)) return !e.length;
            for (t in e)
              if (p.call(e, t)) return !1;
            return !0
          }, s = function(e) {
            var t, n;
            return a(e) && (n = Object.getPrototypeOf(e)) && (t = n.constructor) && "function" == typeof t && t instanceof t && Function.prototype.toString.call(t) === Function.prototype.toString.call(Object)
          }, n = function(e) {
            return r(e.valueOf) ? e.valueOf() : e
          }, e.exports.assign = t, e.exports.isFunction = r, e.exports.isObject = a, e.exports.isArray = i, e.exports.isEmpty = o, e.exports.isPlainObject = s, e.exports.getValue = n
        }).call(this)
      },
      594: function(e) {
        (function() {
          e.exports = {
            None: 0,
            OpenTag: 1,
            InsideTag: 2,
            CloseTag: 3
          }
        }).call(this)
      },
      2750: function(e, t, n) {
        (function() {
          var t;
          t = n(9335), n(2026), e.exports = function() {
            function e(e, n, i) {
              if (this.parent = e, this.parent && (this.options = this.parent.options, this.stringify = this.parent.stringify), null == n) throw new Error("Missing attribute name. " + this.debugInfo(n));
              this.name = this.stringify.name(n), this.value = this.stringify.attValue(i), this.type = t.Attribute, this.isId = !1, this.schemaTypeInfo = null
            }
            return Object.defineProperty(e.prototype, "nodeType", {
              get: function() {
                return this.type
              }
            }), Object.defineProperty(e.prototype, "ownerElement", {
              get: function() {
                return this.parent
              }
            }), Object.defineProperty(e.prototype, "textContent", {
              get: function() {
                return this.value
              },
              set: function(e) {
                return this.value = e || ""
              }
            }), Object.defineProperty(e.prototype, "namespaceURI", {
              get: function() {
                return ""
              }
            }), Object.defineProperty(e.prototype, "prefix", {
              get: function() {
                return ""
              }
            }), Object.defineProperty(e.prototype, "localName", {
              get: function() {
                return this.name
              }
            }), Object.defineProperty(e.prototype, "specified", {
              get: function() {
                return !0
              }
            }), e.prototype.clone = function() {
              return Object.create(this)
            }, e.prototype.toString = function(e) {
              return this.options.writer.attribute(this, this.options.writer.filterOptions(e))
            }, e.prototype.debugInfo = function(e) {
              return null == (e = e || this.name) ? "parent: <" + this.parent.name + ">" : "attribute: {" + e + "}, parent: <" + this.parent.name + ">"
            }, e.prototype.isEqualNode = function(e) {
              return e.namespaceURI === this.namespaceURI && e.prefix === this.prefix && e.localName === this.localName && e.value === this.value
            }, e
          }()
        }).call(this)
      },
      6170: function(e, t, n) {
        (function() {
          var t, i, o = {}.hasOwnProperty;
          t = n(9335), i = n(6488), e.exports = function(e) {
            function n(e, i) {
              if (n.__super__.constructor.call(this, e), null == i) throw new Error("Missing CDATA text. " + this.debugInfo());
              this.name = "#cdata-section", this.type = t.CData, this.value = this.stringify.cdata(i)
            }
            return function(e, t) {
              for (var n in t) o.call(t, n) && (e[n] = t[n]);

              function i() {
                this.constructor = e
              }
              i.prototype = t.prototype, e.prototype = new i, e.__super__ = t.prototype
            }(n, e), n.prototype.clone = function() {
              return Object.create(this)
            }, n.prototype.toString = function(e) {
              return this.options.writer.cdata(this, this.options.writer.filterOptions(e))
            }, n
          }(i)
        }).call(this)
      },
      6488: function(e, t, n) {
        (function() {
          var t, i = {}.hasOwnProperty;
          t = n(2026), e.exports = function(e) {
            function t(e) {
              t.__super__.constructor.call(this, e), this.value = ""
            }
            return function(e, t) {
              for (var n in t) i.call(t, n) && (e[n] = t[n]);

              function o() {
                this.constructor = e
              }
              o.prototype = t.prototype, e.prototype = new o, e.__super__ = t.prototype
            }(t, e), Object.defineProperty(t.prototype, "data", {
              get: function() {
                return this.value
              },
              set: function(e) {
                return this.value = e || ""
              }
            }), Object.defineProperty(t.prototype, "length", {
              get: function() {
                return this.value.length
              }
            }), Object.defineProperty(t.prototype, "textContent", {
              get: function() {
                return this.value
              },
              set: function(e) {
                return this.value = e || ""
              }
            }), t.prototype.clone = function() {
              return Object.create(this)
            }, t.prototype.substringData = function(e, t) {
              throw new Error("This DOM method is not implemented." + this.debugInfo())
            }, t.prototype.appendData = function(e) {
              throw new Error("This DOM method is not implemented." + this.debugInfo())
            }, t.prototype.insertData = function(e, t) {
              throw new Error("This DOM method is not implemented." + this.debugInfo())
            }, t.prototype.deleteData = function(e, t) {
              throw new Error("This DOM method is not implemented." + this.debugInfo())
            }, t.prototype.replaceData = function(e, t, n) {
              throw new Error("This DOM method is not implemented." + this.debugInfo())
            }, t.prototype.isEqualNode = function(e) {
              return !!t.__super__.isEqualNode.apply(this, arguments).isEqualNode(e) && e.data === this.data
            }, t
          }(t)
        }).call(this)
      },
      2096: function(e, t, n) {
        (function() {
          var t, i, o = {}.hasOwnProperty;
          t = n(9335), i = n(6488), e.exports = function(e) {
            function n(e, i) {
              if (n.__super__.constructor.call(this, e), null == i) throw new Error("Missing comment text. " + this.debugInfo());
              this.name = "#comment", this.type = t.Comment, this.value = this.stringify.comment(i)
            }
            return function(e, t) {
              for (var n in t) o.call(t, n) && (e[n] = t[n]);

              function i() {
                this.constructor = e
              }
              i.prototype = t.prototype, e.prototype = new i, e.__super__ = t.prototype
            }(n, e), n.prototype.clone = function() {
              return Object.create(this)
            }, n.prototype.toString = function(e) {
              return this.options.writer.comment(this, this.options.writer.filterOptions(e))
            }, n
          }(i)
        }).call(this)
      },
      383: function(e, t, n) {
        (function() {
          var t, i;
          t = n(3933), i = n(6210), e.exports = function() {
            function e() {
              this.defaultParams = {
                "canonical-form": !1,
                "cdata-sections": !1,
                comments: !1,
                "datatype-normalization": !1,
                "element-content-whitespace": !0,
                entities: !0,
                "error-handler": new t,
                infoset: !0,
                "validate-if-schema": !1,
                namespaces: !0,
                "namespace-declarations": !0,
                "normalize-characters": !1,
                "schema-location": "",
                "schema-type": "",
                "split-cdata-sections": !0,
                validate: !1,
                "well-formed": !0
              }, this.params = Object.create(this.defaultParams)
            }
            return Object.defineProperty(e.prototype, "parameterNames", {
              get: function() {
                return new i(Object.keys(this.defaultParams))
              }
            }), e.prototype.getParameter = function(e) {
              return this.params.hasOwnProperty(e) ? this.params[e] : null
            }, e.prototype.canSetParameter = function(e, t) {
              return !0
            }, e.prototype.setParameter = function(e, t) {
              return null != t ? this.params[e] = t : delete this.params[e]
            }, e
          }()
        }).call(this)
      },
      3933: function(e) {
        (function() {
          e.exports = function() {
            function e() {}
            return e.prototype.handleError = function(e) {
              throw new Error(e)
            }, e
          }()
        }).call(this)
      },
      1770: function(e) {
        (function() {
          e.exports = function() {
            function e() {}
            return e.prototype.hasFeature = function(e, t) {
              return !0
            }, e.prototype.createDocumentType = function(e, t, n) {
              throw new Error("This DOM method is not implemented.")
            }, e.prototype.createDocument = function(e, t, n) {
              throw new Error("This DOM method is not implemented.")
            }, e.prototype.createHTMLDocument = function(e) {
              throw new Error("This DOM method is not implemented.")
            }, e.prototype.getFeature = function(e, t) {
              throw new Error("This DOM method is not implemented.")
            }, e
          }()
        }).call(this)
      },
      6210: function(e) {
        (function() {
          e.exports = function() {
            function e(e) {
              this.arr = e || []
            }
            return Object.defineProperty(e.prototype, "length", {
              get: function() {
                return this.arr.length
              }
            }), e.prototype.item = function(e) {
              return this.arr[e] || null
            }, e.prototype.contains = function(e) {
              return -1 !== this.arr.indexOf(e)
            }, e
          }()
        }).call(this)
      },
      1179: function(e, t, n) {
        (function() {
          var t, i, o = {}.hasOwnProperty;
          i = n(2026), t = n(9335), e.exports = function(e) {
            function n(e, i, o, r, a, s) {
              if (n.__super__.constructor.call(this, e), null == i) throw new Error("Missing DTD element name. " + this.debugInfo());
              if (null == o) throw new Error("Missing DTD attribute name. " + this.debugInfo(i));
              if (!r) throw new Error("Missing DTD attribute type. " + this.debugInfo(i));
              if (!a) throw new Error("Missing DTD attribute default. " + this.debugInfo(i));
              if (0 !== a.indexOf("#") && (a = "#" + a), !a.match(/^(#REQUIRED|#IMPLIED|#FIXED|#DEFAULT)$/)) throw new Error("Invalid default value type; expected: #REQUIRED, #IMPLIED, #FIXED or #DEFAULT. " + this.debugInfo(i));
              if (s && !a.match(/^(#FIXED|#DEFAULT)$/)) throw new Error("Default value only applies to #FIXED or #DEFAULT. " + this.debugInfo(i));
              this.elementName = this.stringify.name(i), this.type = t.AttributeDeclaration, this.attributeName = this.stringify.name(o), this.attributeType = this.stringify.dtdAttType(r), s && (this.defaultValue = this.stringify.dtdAttDefault(s)), this.defaultValueType = a
            }
            return function(e, t) {
              for (var n in t) o.call(t, n) && (e[n] = t[n]);

              function i() {
                this.constructor = e
              }
              i.prototype = t.prototype, e.prototype = new i, e.__super__ = t.prototype
            }(n, e), n.prototype.toString = function(e) {
              return this.options.writer.dtdAttList(this, this.options.writer.filterOptions(e))
            }, n
          }(i)
        }).call(this)
      },
      6347: function(e, t, n) {
        (function() {
          var t, i, o = {}.hasOwnProperty;
          i = n(2026), t = n(9335), e.exports = function(e) {
            function n(e, i, o) {
              if (n.__super__.constructor.call(this, e), null == i) throw new Error("Missing DTD element name. " + this.debugInfo());
              o || (o = "(#PCDATA)"), Array.isArray(o) && (o = "(" + o.join(",") + ")"), this.name = this.stringify.name(i), this.type = t.ElementDeclaration, this.value = this.stringify.dtdElementValue(o)
            }
            return function(e, t) {
              for (var n in t) o.call(t, n) && (e[n] = t[n]);

              function i() {
                this.constructor = e
              }
              i.prototype = t.prototype, e.prototype = new i, e.__super__ = t.prototype
            }(n, e), n.prototype.toString = function(e) {
              return this.options.writer.dtdElement(this, this.options.writer.filterOptions(e))
            }, n
          }(i)
        }).call(this)
      },
      9078: function(e, t, n) {
        (function() {
          var t, i, o, r = {}.hasOwnProperty;
          o = n(8369).isObject, i = n(2026), t = n(9335), e.exports = function(e) {
            function n(e, i, r, a) {
              if (n.__super__.constructor.call(this, e), null == r) throw new Error("Missing DTD entity name. " + this.debugInfo(r));
              if (null == a) throw new Error("Missing DTD entity value. " + this.debugInfo(r));
              if (this.pe = !!i, this.name = this.stringify.name(r), this.type = t.EntityDeclaration, o(a)) {
                if (!a.pubID && !a.sysID) throw new Error("Public and/or system identifiers are required for an external entity. " + this.debugInfo(r));
                if (a.pubID && !a.sysID) throw new Error("System identifier is required for a public external entity. " + this.debugInfo(r));
                if (this.internal = !1, null != a.pubID && (this.pubID = this.stringify.dtdPubID(a.pubID)), null != a.sysID && (this.sysID = this.stringify.dtdSysID(a.sysID)), null != a.nData && (this.nData = this.stringify.dtdNData(a.nData)), this.pe && this.nData) throw new Error("Notation declaration is not allowed in a parameter entity. " + this.debugInfo(r))
              } else this.value = this.stringify.dtdEntityValue(a), this.internal = !0
            }
            return function(e, t) {
              for (var n in t) r.call(t, n) && (e[n] = t[n]);

              function i() {
                this.constructor = e
              }
              i.prototype = t.prototype, e.prototype = new i, e.__super__ = t.prototype
            }(n, e), Object.defineProperty(n.prototype, "publicId", {
              get: function() {
                return this.pubID
              }
            }), Object.defineProperty(n.prototype, "systemId", {
              get: function() {
                return this.sysID
              }
            }), Object.defineProperty(n.prototype, "notationName", {
              get: function() {
                return this.nData || null
              }
            }), Object.defineProperty(n.prototype, "inputEncoding", {
              get: function() {
                return null
              }
            }), Object.defineProperty(n.prototype, "xmlEncoding", {
              get: function() {
                return null
              }
            }), Object.defineProperty(n.prototype, "xmlVersion", {
              get: function() {
                return null
              }
            }), n.prototype.toString = function(e) {
              return this.options.writer.dtdEntity(this, this.options.writer.filterOptions(e))
            }, n
          }(i)
        }).call(this)
      },
      4777: function(e, t, n) {
        (function() {
          var t, i, o = {}.hasOwnProperty;
          i = n(2026), t = n(9335), e.exports = function(e) {
            function n(e, i, o) {
              if (n.__super__.constructor.call(this, e), null == i) throw new Error("Missing DTD notation name. " + this.debugInfo(i));
              if (!o.pubID && !o.sysID) throw new Error("Public or system identifiers are required for an external entity. " + this.debugInfo(i));
              this.name = this.stringify.name(i), this.type = t.NotationDeclaration, null != o.pubID && (this.pubID = this.stringify.dtdPubID(o.pubID)), null != o.sysID && (this.sysID = this.stringify.dtdSysID(o.sysID))
            }
            return function(e, t) {
              for (var n in t) o.call(t, n) && (e[n] = t[n]);

              function i() {
                this.constructor = e
              }
              i.prototype = t.prototype, e.prototype = new i, e.__super__ = t.prototype
            }(n, e), Object.defineProperty(n.prototype, "publicId", {
              get: function() {
                return this.pubID
              }
            }), Object.defineProperty(n.prototype, "systemId", {
              get: function() {
                return this.sysID
              }
            }), n.prototype.toString = function(e) {
              return this.options.writer.dtdNotation(this, this.options.writer.filterOptions(e))
            }, n
          }(i)
        }).call(this)
      },
      9077: function(e, t, n) {
        (function() {
          var t, i, o, r = {}.hasOwnProperty;
          o = n(8369).isObject, i = n(2026), t = n(9335), e.exports = function(e) {
            function n(e, i, r, a) {
              var s;
              n.__super__.constructor.call(this, e), o(i) && (i = (s = i).version, r = s.encoding, a = s.standalone), i || (i = "1.0"), this.type = t.Declaration, this.version = this.stringify.xmlVersion(i), null != r && (this.encoding = this.stringify.xmlEncoding(r)), null != a && (this.standalone = this.stringify.xmlStandalone(a))
            }
            return function(e, t) {
              for (var n in t) r.call(t, n) && (e[n] = t[n]);

              function i() {
                this.constructor = e
              }
              i.prototype = t.prototype, e.prototype = new i, e.__super__ = t.prototype
            }(n, e), n.prototype.toString = function(e) {
              return this.options.writer.declaration(this, this.options.writer.filterOptions(e))
            }, n
          }(i)
        }).call(this)
      },
      6544: function(e, t, n) {
        (function() {
          var t, i, o, r, a, s, c, p, u = {}.hasOwnProperty;
          p = n(8369).isObject, c = n(2026), t = n(9335), i = n(1179), r = n(9078), o = n(6347), a = n(4777), s = n(663), e.exports = function(e) {
            function n(e, i, o) {
              var r, a, s, c, u, l;
              if (n.__super__.constructor.call(this, e), this.type = t.DocType, e.children)
                for (a = 0, s = (c = e.children).length; a < s; a++)
                  if ((r = c[a]).type === t.Element) {
                    this.name = r.name;
                    break
                  } this.documentObject = e, p(i) && (i = (u = i).pubID, o = u.sysID), null == o && (o = (l = [i, o])[0], i = l[1]), null != i && (this.pubID = this.stringify.dtdPubID(i)), null != o && (this.sysID = this.stringify.dtdSysID(o))
            }
            return function(e, t) {
              for (var n in t) u.call(t, n) && (e[n] = t[n]);

              function i() {
                this.constructor = e
              }
              i.prototype = t.prototype, e.prototype = new i, e.__super__ = t.prototype
            }(n, e), Object.defineProperty(n.prototype, "entities", {
              get: function() {
                var e, n, i, o, r;
                for (o = {}, n = 0, i = (r = this.children).length; n < i; n++)(e = r[n]).type !== t.EntityDeclaration || e.pe || (o[e.name] = e);
                return new s(o)
              }
            }), Object.defineProperty(n.prototype, "notations", {
              get: function() {
                var e, n, i, o, r;
                for (o = {}, n = 0, i = (r = this.children).length; n < i; n++)(e = r[n]).type === t.NotationDeclaration && (o[e.name] = e);
                return new s(o)
              }
            }), Object.defineProperty(n.prototype, "publicId", {
              get: function() {
                return this.pubID
              }
            }), Object.defineProperty(n.prototype, "systemId", {
              get: function() {
                return this.sysID
              }
            }), Object.defineProperty(n.prototype, "internalSubset", {
              get: function() {
                throw new Error("This DOM method is not implemented." + this.debugInfo())
              }
            }), n.prototype.element = function(e, t) {
              var n;
              return n = new o(this, e, t), this.children.push(n), this
            }, n.prototype.attList = function(e, t, n, o, r) {
              var a;
              return a = new i(this, e, t, n, o, r), this.children.push(a), this
            }, n.prototype.entity = function(e, t) {
              var n;
              return n = new r(this, !1, e, t), this.children.push(n), this
            }, n.prototype.pEntity = function(e, t) {
              var n;
              return n = new r(this, !0, e, t), this.children.push(n), this
            }, n.prototype.notation = function(e, t) {
              var n;
              return n = new a(this, e, t), this.children.push(n), this
            }, n.prototype.toString = function(e) {
              return this.options.writer.docType(this, this.options.writer.filterOptions(e))
            }, n.prototype.ele = function(e, t) {
              return this.element(e, t)
            }, n.prototype.att = function(e, t, n, i, o) {
              return this.attList(e, t, n, i, o)
            }, n.prototype.ent = function(e, t) {
              return this.entity(e, t)
            }, n.prototype.pent = function(e, t) {
              return this.pEntity(e, t)
            }, n.prototype.not = function(e, t) {
              return this.notation(e, t)
            }, n.prototype.up = function() {
              return this.root() || this.documentObject
            }, n.prototype.isEqualNode = function(e) {
              return !!n.__super__.isEqualNode.apply(this, arguments).isEqualNode(e) && e.name === this.name && e.publicId === this.publicId && e.systemId === this.systemId
            }, n
          }(c)
        }).call(this)
      },
      6934: function(e, t, n) {
        (function() {
          var t, i, o, r, a, s, c, p = {}.hasOwnProperty;
          c = n(8369).isPlainObject, o = n(1770), i = n(383), r = n(2026), t = n(9335), s = n(5549), a = n(6434), e.exports = function(e) {
            function n(e) {
              n.__super__.constructor.call(this, null), this.name = "#document", this.type = t.Document, this.documentURI = null, this.domConfig = new i, e || (e = {}), e.writer || (e.writer = new a), this.options = e, this.stringify = new s(e)
            }
            return function(e, t) {
              for (var n in t) p.call(t, n) && (e[n] = t[n]);

              function i() {
                this.constructor = e
              }
              i.prototype = t.prototype, e.prototype = new i, e.__super__ = t.prototype
            }(n, e), Object.defineProperty(n.prototype, "implementation", {
              value: new o
            }), Object.defineProperty(n.prototype, "doctype", {
              get: function() {
                var e, n, i, o;
                for (n = 0, i = (o = this.children).length; n < i; n++)
                  if ((e = o[n]).type === t.DocType) return e;
                return null
              }
            }), Object.defineProperty(n.prototype, "documentElement", {
              get: function() {
                return this.rootObject || null
              }
            }), Object.defineProperty(n.prototype, "inputEncoding", {
              get: function() {
                return null
              }
            }), Object.defineProperty(n.prototype, "strictErrorChecking", {
              get: function() {
                return !1
              }
            }), Object.defineProperty(n.prototype, "xmlEncoding", {
              get: function() {
                return 0 !== this.children.length && this.children[0].type === t.Declaration ? this.children[0].encoding : null
              }
            }), Object.defineProperty(n.prototype, "xmlStandalone", {
              get: function() {
                return 0 !== this.children.length && this.children[0].type === t.Declaration && "yes" === this.children[0].standalone
              }
            }), Object.defineProperty(n.prototype, "xmlVersion", {
              get: function() {
                return 0 !== this.children.length && this.children[0].type === t.Declaration ? this.children[0].version : "1.0"
              }
            }), Object.defineProperty(n.prototype, "URL", {
              get: function() {
                return this.documentURI
              }
            }), Object.defineProperty(n.prototype, "origin", {
              get: function() {
                return null
              }
            }), Object.defineProperty(n.prototype, "compatMode", {
              get: function() {
                return null
              }
            }), Object.defineProperty(n.prototype, "characterSet", {
              get: function() {
                return null
              }
            }), Object.defineProperty(n.prototype, "contentType", {
              get: function() {
                return null
              }
            }), n.prototype.end = function(e) {
              var t;
              return t = {}, e ? c(e) && (t = e, e = this.options.writer) : e = this.options.writer, e.document(this, e.filterOptions(t))
            }, n.prototype.toString = function(e) {
              return this.options.writer.document(this, this.options.writer.filterOptions(e))
            }, n.prototype.createElement = function(e) {
              throw new Error("This DOM method is not implemented." + this.debugInfo())
            }, n.prototype.createDocumentFragment = function() {
              throw new Error("This DOM method is not implemented." + this.debugInfo())
            }, n.prototype.createTextNode = function(e) {
              throw new Error("This DOM method is not implemented." + this.debugInfo())
            }, n.prototype.createComment = function(e) {
              throw new Error("This DOM method is not implemented." + this.debugInfo())
            }, n.prototype.createCDATASection = function(e) {
              throw new Error("This DOM method is not implemented." + this.debugInfo())
            }, n.prototype.createProcessingInstruction = function(e, t) {
              throw new Error("This DOM method is not implemented." + this.debugInfo())
            }, n.prototype.createAttribute = function(e) {
              throw new Error("This DOM method is not implemented." + this.debugInfo())
            }, n.prototype.createEntityReference = function(e) {
              throw new Error("This DOM method is not implemented." + this.debugInfo())
            }, n.prototype.getElementsByTagName = function(e) {
              throw new Error("This DOM method is not implemented." + this.debugInfo())
            }, n.prototype.importNode = function(e, t) {
              throw new Error("This DOM method is not implemented." + this.debugInfo())
            }, n.prototype.createElementNS = function(e, t) {
              throw new Error("This DOM method is not implemented." + this.debugInfo())
            }, n.prototype.createAttributeNS = function(e, t) {
              throw new Error("This DOM method is not implemented." + this.debugInfo())
            }, n.prototype.getElementsByTagNameNS = function(e, t) {
              throw new Error("This DOM method is not implemented." + this.debugInfo())
            }, n.prototype.getElementById = function(e) {
              throw new Error("This DOM method is not implemented." + this.debugInfo())
            }, n.prototype.adoptNode = function(e) {
              throw new Error("This DOM method is not implemented." + this.debugInfo())
            }, n.prototype.normalizeDocument = function() {
              throw new Error("This DOM method is not implemented." + this.debugInfo())
            }, n.prototype.renameNode = function(e, t, n) {
              throw new Error("This DOM method is not implemented." + this.debugInfo())
            }, n.prototype.getElementsByClassName = function(e) {
              throw new Error("This DOM method is not implemented." + this.debugInfo())
            }, n.prototype.createEvent = function(e) {
              throw new Error("This DOM method is not implemented." + this.debugInfo())
            }, n.prototype.createRange = function() {
              throw new Error("This DOM method is not implemented." + this.debugInfo())
            }, n.prototype.createNodeIterator = function(e, t, n) {
              throw new Error("This DOM method is not implemented." + this.debugInfo())
            }, n.prototype.createTreeWalker = function(e, t, n) {
              throw new Error("This DOM method is not implemented." + this.debugInfo())
            }, n
          }(r)
        }).call(this)
      },
      9227: function(e, t, n) {
        (function() {
          var t, i, o, r, a, s, c, p, u, l, d, f, m, h, v, g, x, b, y, w, _, E, S, O = {}.hasOwnProperty;
          S = n(8369), _ = S.isObject, w = S.isFunction, E = S.isPlainObject, y = S.getValue, t = n(9335), f = n(6934), m = n(2161), r = n(6170), a = n(2096), v = n(9406), b = n(3595), h = n(9181), l = n(9077), d = n(6544), s = n(1179), p = n(9078), c = n(6347), u = n(4777), o = n(2750), x = n(5549), g = n(6434), i = n(594), e.exports = function() {
            function e(e, n, i) {
              var o;
              this.name = "?xml", this.type = t.Document, e || (e = {}), o = {}, e.writer ? E(e.writer) && (o = e.writer, e.writer = new g) : e.writer = new g, this.options = e, this.writer = e.writer, this.writerOptions = this.writer.filterOptions(o), this.stringify = new x(e), this.onDataCallback = n || function() {}, this.onEndCallback = i || function() {}, this.currentNode = null, this.currentLevel = -1, this.openTags = {}, this.documentStarted = !1, this.documentCompleted = !1, this.root = null
            }
            return e.prototype.createChildNode = function(e) {
              var n, i, o, r, a, s, c, p;
              switch (e.type) {
                case t.CData:
                  this.cdata(e.value);
                  break;
                case t.Comment:
                  this.comment(e.value);
                  break;
                case t.Element:
                  for (i in o = {}, c = e.attribs) O.call(c, i) && (n = c[i], o[i] = n.value);
                  this.node(e.name, o);
                  break;
                case t.Dummy:
                  this.dummy();
                  break;
                case t.Raw:
                  this.raw(e.value);
                  break;
                case t.Text:
                  this.text(e.value);
                  break;
                case t.ProcessingInstruction:
                  this.instruction(e.target, e.value);
                  break;
                default:
                  throw new Error("This XML node type is not supported in a JS object: " + e.constructor.name)
              }
              for (a = 0, s = (p = e.children).length; a < s; a++) r = p[a], this.createChildNode(r), r.type === t.Element && this.up();
              return this
            }, e.prototype.dummy = function() {
              return this
            }, e.prototype.node = function(e, t, n) {
              var i;
              if (null == e) throw new Error("Missing node name.");
              if (this.root && -1 === this.currentLevel) throw new Error("Document can only have one root node. " + this.debugInfo(e));
              return this.openCurrent(), e = y(e), null == t && (t = {}), t = y(t), _(t) || (n = (i = [t, n])[0], t = i[1]), this.currentNode = new m(this, e, t), this.currentNode.children = !1, this.currentLevel++, this.openTags[this.currentLevel] = this.currentNode, null != n && this.text(n), this
            }, e.prototype.element = function(e, n, i) {
              var o, r, a, s, c, p;
              if (this.currentNode && this.currentNode.type === t.DocType) this.dtdElement.apply(this, arguments);
              else if (Array.isArray(e) || _(e) || w(e))
                for (s = this.options.noValidation, this.options.noValidation = !0, (p = new f(this.options).element("TEMP_ROOT")).element(e), this.options.noValidation = s, r = 0, a = (c = p.children).length; r < a; r++) o = c[r], this.createChildNode(o), o.type === t.Element && this.up();
              else this.node(e, n, i);
              return this
            }, e.prototype.attribute = function(e, t) {
              var n, i;
              if (!this.currentNode || this.currentNode.children) throw new Error("att() can only be used immediately after an ele() call in callback mode. " + this.debugInfo(e));
              if (null != e && (e = y(e)), _(e))
                for (n in e) O.call(e, n) && (i = e[n], this.attribute(n, i));
              else w(t) && (t = t.apply()), this.options.keepNullAttributes && null == t ? this.currentNode.attribs[e] = new o(this, e, "") : null != t && (this.currentNode.attribs[e] = new o(this, e, t));
              return this
            }, e.prototype.text = function(e) {
              var t;
              return this.openCurrent(), t = new b(this, e), this.onData(this.writer.text(t, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
            }, e.prototype.cdata = function(e) {
              var t;
              return this.openCurrent(), t = new r(this, e), this.onData(this.writer.cdata(t, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
            }, e.prototype.comment = function(e) {
              var t;
              return this.openCurrent(), t = new a(this, e), this.onData(this.writer.comment(t, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
            }, e.prototype.raw = function(e) {
              var t;
              return this.openCurrent(), t = new v(this, e), this.onData(this.writer.raw(t, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
            }, e.prototype.instruction = function(e, t) {
              var n, i, o, r, a;
              if (this.openCurrent(), null != e && (e = y(e)), null != t && (t = y(t)), Array.isArray(e))
                for (n = 0, r = e.length; n < r; n++) i = e[n], this.instruction(i);
              else if (_(e))
                for (i in e) O.call(e, i) && (o = e[i], this.instruction(i, o));
              else w(t) && (t = t.apply()), a = new h(this, e, t), this.onData(this.writer.processingInstruction(a, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
              return this
            }, e.prototype.declaration = function(e, t, n) {
              var i;
              if (this.openCurrent(), this.documentStarted) throw new Error("declaration() must be the first node.");
              return i = new l(this, e, t, n), this.onData(this.writer.declaration(i, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
            }, e.prototype.doctype = function(e, t, n) {
              if (this.openCurrent(), null == e) throw new Error("Missing root node name.");
              if (this.root) throw new Error("dtd() must come before the root node.");
              return this.currentNode = new d(this, t, n), this.currentNode.rootNodeName = e, this.currentNode.children = !1, this.currentLevel++, this.openTags[this.currentLevel] = this.currentNode, this
            }, e.prototype.dtdElement = function(e, t) {
              var n;
              return this.openCurrent(), n = new c(this, e, t), this.onData(this.writer.dtdElement(n, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
            }, e.prototype.attList = function(e, t, n, i, o) {
              var r;
              return this.openCurrent(), r = new s(this, e, t, n, i, o), this.onData(this.writer.dtdAttList(r, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
            }, e.prototype.entity = function(e, t) {
              var n;
              return this.openCurrent(), n = new p(this, !1, e, t), this.onData(this.writer.dtdEntity(n, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
            }, e.prototype.pEntity = function(e, t) {
              var n;
              return this.openCurrent(), n = new p(this, !0, e, t), this.onData(this.writer.dtdEntity(n, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
            }, e.prototype.notation = function(e, t) {
              var n;
              return this.openCurrent(), n = new u(this, e, t), this.onData(this.writer.dtdNotation(n, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this
            }, e.prototype.up = function() {
              if (this.currentLevel < 0) throw new Error("The document node has no parent.");
              return this.currentNode ? (this.currentNode.children ? this.closeNode(this.currentNode) : this.openNode(this.currentNode), this.currentNode = null) : this.closeNode(this.openTags[this.currentLevel]), delete this.openTags[this.currentLevel], this.currentLevel--, this
            }, e.prototype.end = function() {
              for (; this.currentLevel >= 0;) this.up();
              return this.onEnd()
            }, e.prototype.openCurrent = function() {
              if (this.currentNode) return this.currentNode.children = !0, this.openNode(this.currentNode)
            }, e.prototype.openNode = function(e) {
              var n, o, r, a;
              if (!e.isOpen) {
                if (this.root || 0 !== this.currentLevel || e.type !== t.Element || (this.root = e), o = "", e.type === t.Element) {
                  for (r in this.writerOptions.state = i.OpenTag, o = this.writer.indent(e, this.writerOptions, this.currentLevel) + "<" + e.name, a = e.attribs) O.call(a, r) && (n = a[r], o += this.writer.attribute(n, this.writerOptions, this.currentLevel));
                  o += (e.children ? ">" : "/>") + this.writer.endline(e, this.writerOptions, this.currentLevel), this.writerOptions.state = i.InsideTag
                } else this.writerOptions.state = i.OpenTag, o = this.writer.indent(e, this.writerOptions, this.currentLevel) + "<!DOCTYPE " + e.rootNodeName, e.pubID && e.sysID ? o += ' PUBLIC "' + e.pubID + '" "' + e.sysID + '"' : e.sysID && (o += ' SYSTEM "' + e.sysID + '"'), e.children ? (o += " [", this.writerOptions.state = i.InsideTag) : (this.writerOptions.state = i.CloseTag, o += ">"), o += this.writer.endline(e, this.writerOptions, this.currentLevel);
                return this.onData(o, this.currentLevel), e.isOpen = !0
              }
            }, e.prototype.closeNode = function(e) {
              var n;
              if (!e.isClosed) return "", this.writerOptions.state = i.CloseTag, n = e.type === t.Element ? this.writer.indent(e, this.writerOptions, this.currentLevel) + "</" + e.name + ">" + this.writer.endline(e, this.writerOptions, this.currentLevel) : this.writer.indent(e, this.writerOptions, this.currentLevel) + "]>" + this.writer.endline(e, this.writerOptions, this.currentLevel), this.writerOptions.state = i.None, this.onData(n, this.currentLevel), e.isClosed = !0
            }, e.prototype.onData = function(e, t) {
              return this.documentStarted = !0, this.onDataCallback(e, t + 1)
            }, e.prototype.onEnd = function() {
              return this.documentCompleted = !0, this.onEndCallback()
            }, e.prototype.debugInfo = function(e) {
              return null == e ? "" : "node: <" + e + ">"
            }, e.prototype.ele = function() {
              return this.element.apply(this, arguments)
            }, e.prototype.nod = function(e, t, n) {
              return this.node(e, t, n)
            }, e.prototype.txt = function(e) {
              return this.text(e)
            }, e.prototype.dat = function(e) {
              return this.cdata(e)
            }, e.prototype.com = function(e) {
              return this.comment(e)
            }, e.prototype.ins = function(e, t) {
              return this.instruction(e, t)
            }, e.prototype.dec = function(e, t, n) {
              return this.declaration(e, t, n)
            }, e.prototype.dtd = function(e, t, n) {
              return this.doctype(e, t, n)
            }, e.prototype.e = function(e, t, n) {
              return this.element(e, t, n)
            }, e.prototype.n = function(e, t, n) {
              return this.node(e, t, n)
            }, e.prototype.t = function(e) {
              return this.text(e)
            }, e.prototype.d = function(e) {
              return this.cdata(e)
            }, e.prototype.c = function(e) {
              return this.comment(e)
            }, e.prototype.r = function(e) {
              return this.raw(e)
            }, e.prototype.i = function(e, t) {
              return this.instruction(e, t)
            }, e.prototype.att = function() {
              return this.currentNode && this.currentNode.type === t.DocType ? this.attList.apply(this, arguments) : this.attribute.apply(this, arguments)
            }, e.prototype.a = function() {
              return this.currentNode && this.currentNode.type === t.DocType ? this.attList.apply(this, arguments) : this.attribute.apply(this, arguments)
            }, e.prototype.ent = function(e, t) {
              return this.entity(e, t)
            }, e.prototype.pent = function(e, t) {
              return this.pEntity(e, t)
            }, e.prototype.not = function(e, t) {
              return this.notation(e, t)
            }, e
          }()
        }).call(this)
      },
      8833: function(e, t, n) {
        (function() {
          var t, i, o = {}.hasOwnProperty;
          i = n(2026), t = n(9335), e.exports = function(e) {
            function n(e) {
              n.__super__.constructor.call(this, e), this.type = t.Dummy
            }
            return function(e, t) {
              for (var n in t) o.call(t, n) && (e[n] = t[n]);

              function i() {
                this.constructor = e
              }
              i.prototype = t.prototype, e.prototype = new i, e.__super__ = t.prototype
            }(n, e), n.prototype.clone = function() {
              return Object.create(this)
            }, n.prototype.toString = function(e) {
              return ""
            }, n
          }(i)
        }).call(this)
      },
      2161: function(e, t, n) {
        (function() {
          var t, i, o, r, a, s, c, p, u = {}.hasOwnProperty;
          p = n(8369), c = p.isObject, s = p.isFunction, a = p.getValue, r = n(2026), t = n(9335), i = n(2750), o = n(663), e.exports = function(e) {
            function n(e, i, o) {
              var r, a, s, c;
              if (n.__super__.constructor.call(this, e), null == i) throw new Error("Missing element name. " + this.debugInfo());
              if (this.name = this.stringify.name(i), this.type = t.Element, this.attribs = {}, this.schemaTypeInfo = null, null != o && this.attribute(o), e.type === t.Document && (this.isRoot = !0, this.documentObject = e, e.rootObject = this, e.children))
                for (a = 0, s = (c = e.children).length; a < s; a++)
                  if ((r = c[a]).type === t.DocType) {
                    r.name = this.name;
                    break
                  }
            }
            return function(e, t) {
              for (var n in t) u.call(t, n) && (e[n] = t[n]);

              function i() {
                this.constructor = e
              }
              i.prototype = t.prototype, e.prototype = new i, e.__super__ = t.prototype
            }(n, e), Object.defineProperty(n.prototype, "tagName", {
              get: function() {
                return this.name
              }
            }), Object.defineProperty(n.prototype, "namespaceURI", {
              get: function() {
                return ""
              }
            }), Object.defineProperty(n.prototype, "prefix", {
              get: function() {
                return ""
              }
            }), Object.defineProperty(n.prototype, "localName", {
              get: function() {
                return this.name
              }
            }), Object.defineProperty(n.prototype, "id", {
              get: function() {
                throw new Error("This DOM method is not implemented." + this.debugInfo())
              }
            }), Object.defineProperty(n.prototype, "className", {
              get: function() {
                throw new Error("This DOM method is not implemented." + this.debugInfo())
              }
            }), Object.defineProperty(n.prototype, "classList", {
              get: function() {
                throw new Error("This DOM method is not implemented." + this.debugInfo())
              }
            }), Object.defineProperty(n.prototype, "attributes", {
              get: function() {
                return this.attributeMap && this.attributeMap.nodes || (this.attributeMap = new o(this.attribs)), this.attributeMap
              }
            }), n.prototype.clone = function() {
              var e, t, n, i;
              for (t in (n = Object.create(this)).isRoot && (n.documentObject = null), n.attribs = {}, i = this.attribs) u.call(i, t) && (e = i[t], n.attribs[t] = e.clone());
              return n.children = [], this.children.forEach((function(e) {
                var t;
                return (t = e.clone()).parent = n, n.children.push(t)
              })), n
            }, n.prototype.attribute = function(e, t) {
              var n, o;
              if (null != e && (e = a(e)), c(e))
                for (n in e) u.call(e, n) && (o = e[n], this.attribute(n, o));
              else s(t) && (t = t.apply()), this.options.keepNullAttributes && null == t ? this.attribs[e] = new i(this, e, "") : null != t && (this.attribs[e] = new i(this, e, t));
              return this
            }, n.prototype.removeAttribute = function(e) {
              var t, n, i;
              if (null == e) throw new Error("Missing attribute name. " + this.debugInfo());
              if (e = a(e), Array.isArray(e))
                for (n = 0, i = e.length; n < i; n++) t = e[n], delete this.attribs[t];
              else delete this.attribs[e];
              return this
            }, n.prototype.toString = function(e) {
              return this.options.writer.element(this, this.options.writer.filterOptions(e))
            }, n.prototype.att = function(e, t) {
              return this.attribute(e, t)
            }, n.prototype.a = function(e, t) {
              return this.attribute(e, t)
            }, n.prototype.getAttribute = function(e) {
              return this.attribs.hasOwnProperty(e) ? this.attribs[e].value : null
            }, n.prototype.setAttribute = function(e, t) {
              throw new Error("This DOM method is not implemented." + this.debugInfo())
            }, n.prototype.getAttributeNode = function(e) {
              return this.attribs.hasOwnProperty(e) ? this.attribs[e] : null
            }, n.prototype.setAttributeNode = function(e) {
              throw new Error("This DOM method is not implemented." + this.debugInfo())
            }, n.prototype.removeAttributeNode = function(e) {
              throw new Error("This DOM method is not implemented." + this.debugInfo())
            }, n.prototype.getElementsByTagName = function(e) {
              throw new Error("This DOM method is not implemented." + this.debugInfo())
            }, n.prototype.getAttributeNS = function(e, t) {
              throw new Error("This DOM method is not implemented." + this.debugInfo())
            }, n.prototype.setAttributeNS = function(e, t, n) {
              throw new Error("This DOM method is not implemented." + this.debugInfo())
            }, n.prototype.removeAttributeNS = function(e, t) {
              throw new Error("This DOM method is not implemented." + this.debugInfo())
            }, n.prototype.getAttributeNodeNS = function(e, t) {
              throw new Error("This DOM method is not implemented." + this.debugInfo())
            }, n.prototype.setAttributeNodeNS = function(e) {
              throw new Error("This DOM method is not implemented." + this.debugInfo())
            }, n.prototype.getElementsByTagNameNS = function(e, t) {
              throw new Error("This DOM method is not implemented." + this.debugInfo())
            }, n.prototype.hasAttribute = function(e) {
              return this.attribs.hasOwnProperty(e)
            }, n.prototype.hasAttributeNS = function(e, t) {
              throw new Error("This DOM method is not implemented." + this.debugInfo())
            }, n.prototype.setIdAttribute = function(e, t) {
              return this.attribs.hasOwnProperty(e) ? this.attribs[e].isId : t
            }, n.prototype.setIdAttributeNS = function(e, t, n) {
              throw new Error("This DOM method is not implemented." + this.debugInfo())
            }, n.prototype.setIdAttributeNode = function(e, t) {
              throw new Error("This DOM method is not implemented." + this.debugInfo())
            }, n.prototype.getElementsByTagName = function(e) {
              throw new Error("This DOM method is not implemented." + this.debugInfo())
            }, n.prototype.getElementsByTagNameNS = function(e, t) {
              throw new Error("This DOM method is not implemented." + this.debugInfo())
            }, n.prototype.getElementsByClassName = function(e) {
              throw new Error("This DOM method is not implemented." + this.debugInfo())
            }, n.prototype.isEqualNode = function(e) {
              var t, i, o;
              if (!n.__super__.isEqualNode.apply(this, arguments).isEqualNode(e)) return !1;
              if (e.namespaceURI !== this.namespaceURI) return !1;
              if (e.prefix !== this.prefix) return !1;
              if (e.localName !== this.localName) return !1;
              if (e.attribs.length !== this.attribs.length) return !1;
              for (t = i = 0, o = this.attribs.length - 1; 0 <= o ? i <= o : i >= o; t = 0 <= o ? ++i : --i)
                if (!this.attribs[t].isEqualNode(e.attribs[t])) return !1;
              return !0
            }, n
          }(r)
        }).call(this)
      },
      663: function(e) {
        (function() {
          e.exports = function() {
            function e(e) {
              this.nodes = e
            }
            return Object.defineProperty(e.prototype, "length", {
              get: function() {
                return Object.keys(this.nodes).length || 0
              }
            }), e.prototype.clone = function() {
              return this.nodes = null
            }, e.prototype.getNamedItem = function(e) {
              return this.nodes[e]
            }, e.prototype.setNamedItem = function(e) {
              var t;
              return t = this.nodes[e.nodeName], this.nodes[e.nodeName] = e, t || null
            }, e.prototype.removeNamedItem = function(e) {
              var t;
              return t = this.nodes[e], delete this.nodes[e], t || null
            }, e.prototype.item = function(e) {
              return this.nodes[Object.keys(this.nodes)[e]] || null
            }, e.prototype.getNamedItemNS = function(e, t) {
              throw new Error("This DOM method is not implemented.")
            }, e.prototype.setNamedItemNS = function(e) {
              throw new Error("This DOM method is not implemented.")
            }, e.prototype.removeNamedItemNS = function(e, t) {
              throw new Error("This DOM method is not implemented.")
            }, e
          }()
        }).call(this)
      },
      2026: function(e, t, n) {
        (function() {
          var t, i, o, r, a, s, c, p, u, l, d, f, m, h, v, g, x, b = {}.hasOwnProperty;
          x = n(8369), g = x.isObject, v = x.isFunction, h = x.isEmpty, m = x.getValue, p = null, o = null, r = null, a = null, s = null, d = null, f = null, l = null, c = null, i = null, u = null, t = null, e.exports = function() {
            function e(e) {
              this.parent = e, this.parent && (this.options = this.parent.options, this.stringify = this.parent.stringify), this.value = null, this.children = [], this.baseURI = null, p || (p = n(2161), o = n(6170), r = n(2096), a = n(9077), s = n(6544), d = n(9406), f = n(3595), l = n(9181), c = n(8833), i = n(9335), u = n(2390), n(663), t = n(7557))
            }
            return Object.defineProperty(e.prototype, "nodeName", {
              get: function() {
                return this.name
              }
            }), Object.defineProperty(e.prototype, "nodeType", {
              get: function() {
                return this.type
              }
            }), Object.defineProperty(e.prototype, "nodeValue", {
              get: function() {
                return this.value
              }
            }), Object.defineProperty(e.prototype, "parentNode", {
              get: function() {
                return this.parent
              }
            }), Object.defineProperty(e.prototype, "childNodes", {
              get: function() {
                return this.childNodeList && this.childNodeList.nodes || (this.childNodeList = new u(this.children)), this.childNodeList
              }
            }), Object.defineProperty(e.prototype, "firstChild", {
              get: function() {
                return this.children[0] || null
              }
            }), Object.defineProperty(e.prototype, "lastChild", {
              get: function() {
                return this.children[this.children.length - 1] || null
              }
            }), Object.defineProperty(e.prototype, "previousSibling", {
              get: function() {
                var e;
                return e = this.parent.children.indexOf(this), this.parent.children[e - 1] || null
              }
            }), Object.defineProperty(e.prototype, "nextSibling", {
              get: function() {
                var e;
                return e = this.parent.children.indexOf(this), this.parent.children[e + 1] || null
              }
            }), Object.defineProperty(e.prototype, "ownerDocument", {
              get: function() {
                return this.document() || null
              }
            }), Object.defineProperty(e.prototype, "textContent", {
              get: function() {
                var e, t, n, o, r;
                if (this.nodeType === i.Element || this.nodeType === i.DocumentFragment) {
                  for (r = "", t = 0, n = (o = this.children).length; t < n; t++)(e = o[t]).textContent && (r += e.textContent);
                  return r
                }
                return null
              },
              set: function(e) {
                throw new Error("This DOM method is not implemented." + this.debugInfo())
              }
            }), e.prototype.setParent = function(e) {
              var t, n, i, o, r;
              for (this.parent = e, e && (this.options = e.options, this.stringify = e.stringify), r = [], n = 0, i = (o = this.children).length; n < i; n++) t = o[n], r.push(t.setParent(this));
              return r
            }, e.prototype.element = function(e, t, n) {
              var i, o, r, a, s, c, p, u, l, d, f;
              if (c = null, null === t && null == n && (t = (l = [{}, null])[0], n = l[1]), null == t && (t = {}), t = m(t), g(t) || (n = (d = [t, n])[0], t = d[1]), null != e && (e = m(e)), Array.isArray(e))
                for (r = 0, p = e.length; r < p; r++) o = e[r], c = this.element(o);
              else if (v(e)) c = this.element(e.apply());
              else if (g(e)) {
                for (s in e)
                  if (b.call(e, s))
                    if (f = e[s], v(f) && (f = f.apply()), !this.options.ignoreDecorators && this.stringify.convertAttKey && 0 === s.indexOf(this.stringify.convertAttKey)) c = this.attribute(s.substr(this.stringify.convertAttKey.length), f);
                    else if (!this.options.separateArrayItems && Array.isArray(f) && h(f)) c = this.dummy();
                else if (g(f) && h(f)) c = this.element(s);
                else if (this.options.keepNullNodes || null != f)
                  if (!this.options.separateArrayItems && Array.isArray(f))
                    for (a = 0, u = f.length; a < u; a++) o = f[a], (i = {})[s] = o, c = this.element(i);
                  else g(f) ? !this.options.ignoreDecorators && this.stringify.convertTextKey && 0 === s.indexOf(this.stringify.convertTextKey) ? c = this.element(f) : (c = this.element(s)).element(f) : c = this.element(s, f);
                else c = this.dummy()
              } else c = this.options.keepNullNodes || null !== n ? !this.options.ignoreDecorators && this.stringify.convertTextKey && 0 === e.indexOf(this.stringify.convertTextKey) ? this.text(n) : !this.options.ignoreDecorators && this.stringify.convertCDataKey && 0 === e.indexOf(this.stringify.convertCDataKey) ? this.cdata(n) : !this.options.ignoreDecorators && this.stringify.convertCommentKey && 0 === e.indexOf(this.stringify.convertCommentKey) ? this.comment(n) : !this.options.ignoreDecorators && this.stringify.convertRawKey && 0 === e.indexOf(this.stringify.convertRawKey) ? this.raw(n) : !this.options.ignoreDecorators && this.stringify.convertPIKey && 0 === e.indexOf(this.stringify.convertPIKey) ? this.instruction(e.substr(this.stringify.convertPIKey.length), n) : this.node(e, t, n) : this.dummy();
              if (null == c) throw new Error("Could not create any elements with: " + e + ". " + this.debugInfo());
              return c
            }, e.prototype.insertBefore = function(e, t, n) {
              var i, o, r, a, s;
              if (null != e ? e.type : void 0) return a = t, (r = e).setParent(this), a ? (o = children.indexOf(a), s = children.splice(o), children.push(r), Array.prototype.push.apply(children, s)) : children.push(r), r;
              if (this.isRoot) throw new Error("Cannot insert elements at root level. " + this.debugInfo(e));
              return o = this.parent.children.indexOf(this), s = this.parent.children.splice(o), i = this.parent.element(e, t, n), Array.prototype.push.apply(this.parent.children, s), i
            }, e.prototype.insertAfter = function(e, t, n) {
              var i, o, r;
              if (this.isRoot) throw new Error("Cannot insert elements at root level. " + this.debugInfo(e));
              return o = this.parent.children.indexOf(this), r = this.parent.children.splice(o + 1), i = this.parent.element(e, t, n), Array.prototype.push.apply(this.parent.children, r), i
            }, e.prototype.remove = function() {
              var e;
              if (this.isRoot) throw new Error("Cannot remove the root element. " + this.debugInfo());
              return e = this.parent.children.indexOf(this), [].splice.apply(this.parent.children, [e, e - e + 1].concat([])), this.parent
            }, e.prototype.node = function(e, t, n) {
              var i, o;
              return null != e && (e = m(e)), t || (t = {}), t = m(t), g(t) || (n = (o = [t, n])[0], t = o[1]), i = new p(this, e, t), null != n && i.text(n), this.children.push(i), i
            }, e.prototype.text = function(e) {
              var t;
              return g(e) && this.element(e), t = new f(this, e), this.children.push(t), this
            }, e.prototype.cdata = function(e) {
              var t;
              return t = new o(this, e), this.children.push(t), this
            }, e.prototype.comment = function(e) {
              var t;
              return t = new r(this, e), this.children.push(t), this
            }, e.prototype.commentBefore = function(e) {
              var t, n;
              return t = this.parent.children.indexOf(this), n = this.parent.children.splice(t), this.parent.comment(e), Array.prototype.push.apply(this.parent.children, n), this
            }, e.prototype.commentAfter = function(e) {
              var t, n;
              return t = this.parent.children.indexOf(this), n = this.parent.children.splice(t + 1), this.parent.comment(e), Array.prototype.push.apply(this.parent.children, n), this
            }, e.prototype.raw = function(e) {
              var t;
              return t = new d(this, e), this.children.push(t), this
            }, e.prototype.dummy = function() {
              return new c(this)
            }, e.prototype.instruction = function(e, t) {
              var n, i, o, r, a;
              if (null != e && (e = m(e)), null != t && (t = m(t)), Array.isArray(e))
                for (r = 0, a = e.length; r < a; r++) n = e[r], this.instruction(n);
              else if (g(e))
                for (n in e) b.call(e, n) && (i = e[n], this.instruction(n, i));
              else v(t) && (t = t.apply()), o = new l(this, e, t), this.children.push(o);
              return this
            }, e.prototype.instructionBefore = function(e, t) {
              var n, i;
              return n = this.parent.children.indexOf(this), i = this.parent.children.splice(n), this.parent.instruction(e, t), Array.prototype.push.apply(this.parent.children, i), this
            }, e.prototype.instructionAfter = function(e, t) {
              var n, i;
              return n = this.parent.children.indexOf(this), i = this.parent.children.splice(n + 1), this.parent.instruction(e, t), Array.prototype.push.apply(this.parent.children, i), this
            }, e.prototype.declaration = function(e, t, n) {
              var o, r;
              return o = this.document(), r = new a(o, e, t, n), 0 === o.children.length ? o.children.unshift(r) : o.children[0].type === i.Declaration ? o.children[0] = r : o.children.unshift(r), o.root() || o
            }, e.prototype.dtd = function(e, t) {
              var n, o, r, a, c, p, u, l, d;
              for (n = this.document(), o = new s(n, e, t), r = a = 0, p = (l = n.children).length; a < p; r = ++a)
                if (l[r].type === i.DocType) return n.children[r] = o, o;
              for (r = c = 0, u = (d = n.children).length; c < u; r = ++c)
                if (d[r].isRoot) return n.children.splice(r, 0, o), o;
              return n.children.push(o), o
            }, e.prototype.up = function() {
              if (this.isRoot) throw new Error("The root node has no parent. Use doc() if you need to get the document object.");
              return this.parent
            }, e.prototype.root = function() {
              var e;
              for (e = this; e;) {
                if (e.type === i.Document) return e.rootObject;
                if (e.isRoot) return e;
                e = e.parent
              }
            }, e.prototype.document = function() {
              var e;
              for (e = this; e;) {
                if (e.type === i.Document) return e;
                e = e.parent
              }
            }, e.prototype.end = function(e) {
              return this.document().end(e)
            }, e.prototype.prev = function() {
              var e;
              if ((e = this.parent.children.indexOf(this)) < 1) throw new Error("Already at the first node. " + this.debugInfo());
              return this.parent.children[e - 1]
            }, e.prototype.next = function() {
              var e;
              if (-1 === (e = this.parent.children.indexOf(this)) || e === this.parent.children.length - 1) throw new Error("Already at the last node. " + this.debugInfo());
              return this.parent.children[e + 1]
            }, e.prototype.importDocument = function(e) {
              var t;
              return (t = e.root().clone()).parent = this, t.isRoot = !1, this.children.push(t), this
            }, e.prototype.debugInfo = function(e) {
              var t, n;
              return null != (e = e || this.name) || (null != (t = this.parent) ? t.name : void 0) ? null == e ? "parent: <" + this.parent.name + ">" : (null != (n = this.parent) ? n.name : void 0) ? "node: <" + e + ">, parent: <" + this.parent.name + ">" : "node: <" + e + ">" : ""
            }, e.prototype.ele = function(e, t, n) {
              return this.element(e, t, n)
            }, e.prototype.nod = function(e, t, n) {
              return this.node(e, t, n)
            }, e.prototype.txt = function(e) {
              return this.text(e)
            }, e.prototype.dat = function(e) {
              return this.cdata(e)
            }, e.prototype.com = function(e) {
              return this.comment(e)
            }, e.prototype.ins = function(e, t) {
              return this.instruction(e, t)
            }, e.prototype.doc = function() {
              return this.document()
            }, e.prototype.dec = function(e, t, n) {
              return this.declaration(e, t, n)
            }, e.prototype.e = function(e, t, n) {
              return this.element(e, t, n)
            }, e.prototype.n = function(e, t, n) {
              return this.node(e, t, n)
            }, e.prototype.t = function(e) {
              return this.text(e)
            }, e.prototype.d = function(e) {
              return this.cdata(e)
            }, e.prototype.c = function(e) {
              return this.comment(e)
            }, e.prototype.r = function(e) {
              return this.raw(e)
            }, e.prototype.i = function(e, t) {
              return this.instruction(e, t)
            }, e.prototype.u = function() {
              return this.up()
            }, e.prototype.importXMLBuilder = function(e) {
              return this.importDocument(e)
            }, e.prototype.replaceChild = function(e, t) {
              throw new Error("This DOM method is not implemented." + this.debugInfo())
            }, e.prototype.removeChild = function(e) {
              throw new Error("This DOM method is not implemented." + this.debugInfo())
            }, e.prototype.appendChild = function(e) {
              throw new Error("This DOM method is not implemented." + this.debugInfo())
            }, e.prototype.hasChildNodes = function() {
              return 0 !== this.children.length
            }, e.prototype.cloneNode = function(e) {
              throw new Error("This DOM method is not implemented." + this.debugInfo())
            }, e.prototype.normalize = function() {
              throw new Error("This DOM method is not implemented." + this.debugInfo())
            }, e.prototype.isSupported = function(e, t) {
              return !0
            }, e.prototype.hasAttributes = function() {
              return 0 !== this.attribs.length
            }, e.prototype.compareDocumentPosition = function(e) {
              var n, i;
              return (n = this) === e ? 0 : this.document() !== e.document() ? (i = t.Disconnected | t.ImplementationSpecific, Math.random() < .5 ? i |= t.Preceding : i |= t.Following, i) : n.isAncestor(e) ? t.Contains | t.Preceding : n.isDescendant(e) ? t.Contains | t.Following : n.isPreceding(e) ? t.Preceding : t.Following
            }, e.prototype.isSameNode = function(e) {
              throw new Error("This DOM method is not implemented." + this.debugInfo())
            }, e.prototype.lookupPrefix = function(e) {
              throw new Error("This DOM method is not implemented." + this.debugInfo())
            }, e.prototype.isDefaultNamespace = function(e) {
              throw new Error("This DOM method is not implemented." + this.debugInfo())
            }, e.prototype.lookupNamespaceURI = function(e) {
              throw new Error("This DOM method is not implemented." + this.debugInfo())
            }, e.prototype.isEqualNode = function(e) {
              var t, n, i;
              if (e.nodeType !== this.nodeType) return !1;
              if (e.children.length !== this.children.length) return !1;
              for (t = n = 0, i = this.children.length - 1; 0 <= i ? n <= i : n >= i; t = 0 <= i ? ++n : --n)
                if (!this.children[t].isEqualNode(e.children[t])) return !1;
              return !0
            }, e.prototype.getFeature = function(e, t) {
              throw new Error("This DOM method is not implemented." + this.debugInfo())
            }, e.prototype.setUserData = function(e, t, n) {
              throw new Error("This DOM method is not implemented." + this.debugInfo())
            }, e.prototype.getUserData = function(e) {
              throw new Error("This DOM method is not implemented." + this.debugInfo())
            }, e.prototype.contains = function(e) {
              return !!e && (e === this || this.isDescendant(e))
            }, e.prototype.isDescendant = function(e) {
              var t, n, i, o;
              for (n = 0, i = (o = this.children).length; n < i; n++) {
                if (e === (t = o[n])) return !0;
                if (t.isDescendant(e)) return !0
              }
              return !1
            }, e.prototype.isAncestor = function(e) {
              return e.isDescendant(this)
            }, e.prototype.isPreceding = function(e) {
              var t, n;
              return t = this.treePosition(e), n = this.treePosition(this), -1 !== t && -1 !== n && t < n
            }, e.prototype.isFollowing = function(e) {
              var t, n;
              return t = this.treePosition(e), n = this.treePosition(this), -1 !== t && -1 !== n && t > n
            }, e.prototype.treePosition = function(e) {
              var t, n;
              return n = 0, t = !1, this.foreachTreeNode(this.document(), (function(i) {
                if (n++, !t && i === e) return t = !0
              })), t ? n : -1
            }, e.prototype.foreachTreeNode = function(e, t) {
              var n, i, o, r, a;
              for (e || (e = this.document()), i = 0, o = (r = e.children).length; i < o; i++) {
                if (a = t(n = r[i])) return a;
                if (a = this.foreachTreeNode(n, t)) return a
              }
            }, e
          }()
        }).call(this)
      },
      2390: function(e) {
        (function() {
          e.exports = function() {
            function e(e) {
              this.nodes = e
            }
            return Object.defineProperty(e.prototype, "length", {
              get: function() {
                return this.nodes.length || 0
              }
            }), e.prototype.clone = function() {
              return this.nodes = null
            }, e.prototype.item = function(e) {
              return this.nodes[e] || null
            }, e
          }()
        }).call(this)
      },
      9181: function(e, t, n) {
        (function() {
          var t, i, o = {}.hasOwnProperty;
          t = n(9335), i = n(6488), e.exports = function(e) {
            function n(e, i, o) {
              if (n.__super__.constructor.call(this, e), null == i) throw new Error("Missing instruction target. " + this.debugInfo());
              this.type = t.ProcessingInstruction, this.target = this.stringify.insTarget(i), this.name = this.target, o && (this.value = this.stringify.insValue(o))
            }
            return function(e, t) {
              for (var n in t) o.call(t, n) && (e[n] = t[n]);

              function i() {
                this.constructor = e
              }
              i.prototype = t.prototype, e.prototype = new i, e.__super__ = t.prototype
            }(n, e), n.prototype.clone = function() {
              return Object.create(this)
            }, n.prototype.toString = function(e) {
              return this.options.writer.processingInstruction(this, this.options.writer.filterOptions(e))
            }, n.prototype.isEqualNode = function(e) {
              return !!n.__super__.isEqualNode.apply(this, arguments).isEqualNode(e) && e.target === this.target
            }, n
          }(i)
        }).call(this)
      },
      9406: function(e, t, n) {
        (function() {
          var t, i, o = {}.hasOwnProperty;
          t = n(9335), i = n(2026), e.exports = function(e) {
            function n(e, i) {
              if (n.__super__.constructor.call(this, e), null == i) throw new Error("Missing raw text. " + this.debugInfo());
              this.type = t.Raw, this.value = this.stringify.raw(i)
            }
            return function(e, t) {
              for (var n in t) o.call(t, n) && (e[n] = t[n]);

              function i() {
                this.constructor = e
              }
              i.prototype = t.prototype, e.prototype = new i, e.__super__ = t.prototype
            }(n, e), n.prototype.clone = function() {
              return Object.create(this)
            }, n.prototype.toString = function(e) {
              return this.options.writer.raw(this, this.options.writer.filterOptions(e))
            }, n
          }(i)
        }).call(this)
      },
      1996: function(e, t, n) {
        (function() {
          var t, i, o, r = {}.hasOwnProperty;
          t = n(9335), o = n(751), i = n(594), e.exports = function(e) {
            function n(e, t) {
              this.stream = e, n.__super__.constructor.call(this, t)
            }
            return function(e, t) {
              for (var n in t) r.call(t, n) && (e[n] = t[n]);

              function i() {
                this.constructor = e
              }
              i.prototype = t.prototype, e.prototype = new i, e.__super__ = t.prototype
            }(n, e), n.prototype.endline = function(e, t, o) {
              return e.isLastRootNode && t.state === i.CloseTag ? "" : n.__super__.endline.call(this, e, t, o)
            }, n.prototype.document = function(e, t) {
              var n, i, o, r, a, s, c, p, u;
              for (i = o = 0, a = (c = e.children).length; o < a; i = ++o)(n = c[i]).isLastRootNode = i === e.children.length - 1;
              for (t = this.filterOptions(t), u = [], r = 0, s = (p = e.children).length; r < s; r++) n = p[r], u.push(this.writeChildNode(n, t, 0));
              return u
            }, n.prototype.attribute = function(e, t, i) {
              return this.stream.write(n.__super__.attribute.call(this, e, t, i))
            }, n.prototype.cdata = function(e, t, i) {
              return this.stream.write(n.__super__.cdata.call(this, e, t, i))
            }, n.prototype.comment = function(e, t, i) {
              return this.stream.write(n.__super__.comment.call(this, e, t, i))
            }, n.prototype.declaration = function(e, t, i) {
              return this.stream.write(n.__super__.declaration.call(this, e, t, i))
            }, n.prototype.docType = function(e, t, n) {
              var o, r, a, s;
              if (n || (n = 0), this.openNode(e, t, n), t.state = i.OpenTag, this.stream.write(this.indent(e, t, n)), this.stream.write("<!DOCTYPE " + e.root().name), e.pubID && e.sysID ? this.stream.write(' PUBLIC "' + e.pubID + '" "' + e.sysID + '"') : e.sysID && this.stream.write(' SYSTEM "' + e.sysID + '"'), e.children.length > 0) {
                for (this.stream.write(" ["), this.stream.write(this.endline(e, t, n)), t.state = i.InsideTag, r = 0, a = (s = e.children).length; r < a; r++) o = s[r], this.writeChildNode(o, t, n + 1);
                t.state = i.CloseTag, this.stream.write("]")
              }
              return t.state = i.CloseTag, this.stream.write(t.spaceBeforeSlash + ">"), this.stream.write(this.endline(e, t, n)), t.state = i.None, this.closeNode(e, t, n)
            }, n.prototype.element = function(e, n, o) {
              var a, s, c, p, u, l, d, f, m;
              for (d in o || (o = 0), this.openNode(e, n, o), n.state = i.OpenTag, this.stream.write(this.indent(e, n, o) + "<" + e.name), f = e.attribs) r.call(f, d) && (a = f[d], this.attribute(a, n, o));
              if (p = 0 === (c = e.children.length) ? null : e.children[0], 0 === c || e.children.every((function(e) {
                  return (e.type === t.Text || e.type === t.Raw) && "" === e.value
                }))) n.allowEmpty ? (this.stream.write(">"), n.state = i.CloseTag, this.stream.write("</" + e.name + ">")) : (n.state = i.CloseTag, this.stream.write(n.spaceBeforeSlash + "/>"));
              else if (!n.pretty || 1 !== c || p.type !== t.Text && p.type !== t.Raw || null == p.value) {
                for (this.stream.write(">" + this.endline(e, n, o)), n.state = i.InsideTag, u = 0, l = (m = e.children).length; u < l; u++) s = m[u], this.writeChildNode(s, n, o + 1);
                n.state = i.CloseTag, this.stream.write(this.indent(e, n, o) + "</" + e.name + ">")
              } else this.stream.write(">"), n.state = i.InsideTag, n.suppressPrettyCount++, this.writeChildNode(p, n, o + 1), n.suppressPrettyCount--, n.state = i.CloseTag, this.stream.write("</" + e.name + ">");
              return this.stream.write(this.endline(e, n, o)), n.state = i.None, this.closeNode(e, n, o)
            }, n.prototype.processingInstruction = function(e, t, i) {
              return this.stream.write(n.__super__.processingInstruction.call(this, e, t, i))
            }, n.prototype.raw = function(e, t, i) {
              return this.stream.write(n.__super__.raw.call(this, e, t, i))
            }, n.prototype.text = function(e, t, i) {
              return this.stream.write(n.__super__.text.call(this, e, t, i))
            }, n.prototype.dtdAttList = function(e, t, i) {
              return this.stream.write(n.__super__.dtdAttList.call(this, e, t, i))
            }, n.prototype.dtdElement = function(e, t, i) {
              return this.stream.write(n.__super__.dtdElement.call(this, e, t, i))
            }, n.prototype.dtdEntity = function(e, t, i) {
              return this.stream.write(n.__super__.dtdEntity.call(this, e, t, i))
            }, n.prototype.dtdNotation = function(e, t, i) {
              return this.stream.write(n.__super__.dtdNotation.call(this, e, t, i))
            }, n
          }(o)
        }).call(this)
      },
      6434: function(e, t, n) {
        (function() {
          var t, i = {}.hasOwnProperty;
          t = n(751), e.exports = function(e) {
            function t(e) {
              t.__super__.constructor.call(this, e)
            }
            return function(e, t) {
              for (var n in t) i.call(t, n) && (e[n] = t[n]);

              function o() {
                this.constructor = e
              }
              o.prototype = t.prototype, e.prototype = new o, e.__super__ = t.prototype
            }(t, e), t.prototype.document = function(e, t) {
              var n, i, o, r, a;
              for (t = this.filterOptions(t), r = "", i = 0, o = (a = e.children).length; i < o; i++) n = a[i], r += this.writeChildNode(n, t, 0);
              return t.pretty && r.slice(-t.newline.length) === t.newline && (r = r.slice(0, -t.newline.length)), r
            }, t
          }(t)
        }).call(this)
      },
      5549: function(e) {
        (function() {
          var t = function(e, t) {
              return function() {
                return e.apply(t, arguments)
              }
            },
            n = {}.hasOwnProperty;
          e.exports = function() {
            function e(e) {
              var i, o, r;
              for (i in this.assertLegalName = t(this.assertLegalName, this), this.assertLegalChar = t(this.assertLegalChar, this), e || (e = {}), this.options = e, this.options.version || (this.options.version = "1.0"), o = e.stringify || {}) n.call(o, i) && (r = o[i], this[i] = r)
            }
            return e.prototype.name = function(e) {
              return this.options.noValidation ? e : this.assertLegalName("" + e || "")
            }, e.prototype.text = function(e) {
              return this.options.noValidation ? e : this.assertLegalChar(this.textEscape("" + e || ""))
            }, e.prototype.cdata = function(e) {
              return this.options.noValidation ? e : (e = (e = "" + e || "").replace("]]>", "]]]]><![CDATA[>"), this.assertLegalChar(e))
            }, e.prototype.comment = function(e) {
              if (this.options.noValidation) return e;
              if ((e = "" + e || "").match(/--/)) throw new Error("Comment text cannot contain double-hypen: " + e);
              return this.assertLegalChar(e)
            }, e.prototype.raw = function(e) {
              return this.options.noValidation ? e : "" + e || ""
            }, e.prototype.attValue = function(e) {
              return this.options.noValidation ? e : this.assertLegalChar(this.attEscape(e = "" + e || ""))
            }, e.prototype.insTarget = function(e) {
              return this.options.noValidation ? e : this.assertLegalChar("" + e || "")
            }, e.prototype.insValue = function(e) {
              if (this.options.noValidation) return e;
              if ((e = "" + e || "").match(/\?>/)) throw new Error("Invalid processing instruction value: " + e);
              return this.assertLegalChar(e)
            }, e.prototype.xmlVersion = function(e) {
              if (this.options.noValidation) return e;
              if (!(e = "" + e || "").match(/1\.[0-9]+/)) throw new Error("Invalid version number: " + e);
              return e
            }, e.prototype.xmlEncoding = function(e) {
              if (this.options.noValidation) return e;
              if (!(e = "" + e || "").match(/^[A-Za-z](?:[A-Za-z0-9._-])*$/)) throw new Error("Invalid encoding: " + e);
              return this.assertLegalChar(e)
            }, e.prototype.xmlStandalone = function(e) {
              return this.options.noValidation ? e : e ? "yes" : "no"
            }, e.prototype.dtdPubID = function(e) {
              return this.options.noValidation ? e : this.assertLegalChar("" + e || "")
            }, e.prototype.dtdSysID = function(e) {
              return this.options.noValidation ? e : this.assertLegalChar("" + e || "")
            }, e.prototype.dtdElementValue = function(e) {
              return this.options.noValidation ? e : this.assertLegalChar("" + e || "")
            }, e.prototype.dtdAttType = function(e) {
              return this.options.noValidation ? e : this.assertLegalChar("" + e || "")
            }, e.prototype.dtdAttDefault = function(e) {
              return this.options.noValidation ? e : this.assertLegalChar("" + e || "")
            }, e.prototype.dtdEntityValue = function(e) {
              return this.options.noValidation ? e : this.assertLegalChar("" + e || "")
            }, e.prototype.dtdNData = function(e) {
              return this.options.noValidation ? e : this.assertLegalChar("" + e || "")
            }, e.prototype.convertAttKey = "@", e.prototype.convertPIKey = "?", e.prototype.convertTextKey = "#text", e.prototype.convertCDataKey = "#cdata", e.prototype.convertCommentKey = "#comment", e.prototype.convertRawKey = "#raw", e.prototype.assertLegalChar = function(e) {
              var t, n;
              if (this.options.noValidation) return e;
              if (t = "", "1.0" === this.options.version) {
                if (t = /[\0-\x08\x0B\f\x0E-\x1F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, n = e.match(t)) throw new Error("Invalid character in string: " + e + " at index " + n.index)
              } else if ("1.1" === this.options.version && (t = /[\0\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, n = e.match(t))) throw new Error("Invalid character in string: " + e + " at index " + n.index);
              return e
            }, e.prototype.assertLegalName = function(e) {
              var t;
              if (this.options.noValidation) return e;
              if (this.assertLegalChar(e), t = /^([:A-Z_a-z\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])([\x2D\.0-:A-Z_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*$/, !e.match(t)) throw new Error("Invalid character in name");
              return e
            }, e.prototype.textEscape = function(e) {
              var t;
              return this.options.noValidation ? e : (t = this.options.noDoubleEncoding ? /(?!&\S+;)&/g : /&/g, e.replace(t, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\r/g, "&#xD;"))
            }, e.prototype.attEscape = function(e) {
              var t;
              return this.options.noValidation ? e : (t = this.options.noDoubleEncoding ? /(?!&\S+;)&/g : /&/g, e.replace(t, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;").replace(/\t/g, "&#x9;").replace(/\n/g, "&#xA;").replace(/\r/g, "&#xD;"))
            }, e
          }()
        }).call(this)
      },
      3595: function(e, t, n) {
        (function() {
          var t, i, o = {}.hasOwnProperty;
          t = n(9335), i = n(6488), e.exports = function(e) {
            function n(e, i) {
              if (n.__super__.constructor.call(this, e), null == i) throw new Error("Missing element text. " + this.debugInfo());
              this.name = "#text", this.type = t.Text, this.value = this.stringify.text(i)
            }
            return function(e, t) {
              for (var n in t) o.call(t, n) && (e[n] = t[n]);

              function i() {
                this.constructor = e
              }
              i.prototype = t.prototype, e.prototype = new i, e.__super__ = t.prototype
            }(n, e), Object.defineProperty(n.prototype, "isElementContentWhitespace", {
              get: function() {
                throw new Error("This DOM method is not implemented." + this.debugInfo())
              }
            }), Object.defineProperty(n.prototype, "wholeText", {
              get: function() {
                var e, t, n;
                for (n = "", t = this.previousSibling; t;) n = t.data + n, t = t.previousSibling;
                for (n += this.data, e = this.nextSibling; e;) n += e.data, e = e.nextSibling;
                return n
              }
            }), n.prototype.clone = function() {
              return Object.create(this)
            }, n.prototype.toString = function(e) {
              return this.options.writer.text(this, this.options.writer.filterOptions(e))
            }, n.prototype.splitText = function(e) {
              throw new Error("This DOM method is not implemented." + this.debugInfo())
            }, n.prototype.replaceWholeText = function(e) {
              throw new Error("This DOM method is not implemented." + this.debugInfo())
            }, n
          }(i)
        }).call(this)
      },
      751: function(e, t, n) {
        (function() {
          var t, i, o, r = {}.hasOwnProperty;
          o = n(8369).assign, t = n(9335), n(9077), n(6544), n(6170), n(2096), n(2161), n(9406), n(3595), n(9181), n(8833), n(1179), n(6347), n(9078), n(4777), i = n(594), e.exports = function() {
            function e(e) {
              var t, n, i;
              for (t in e || (e = {}), this.options = e, n = e.writer || {}) r.call(n, t) && (i = n[t], this["_" + t] = this[t], this[t] = i)
            }
            return e.prototype.filterOptions = function(e) {
              var t, n, r, a, s, c, p, u;
              return e || (e = {}), e = o({}, this.options, e), (t = {
                writer: this
              }).pretty = e.pretty || !1, t.allowEmpty = e.allowEmpty || !1, t.indent = null != (n = e.indent) ? n : "  ", t.newline = null != (r = e.newline) ? r : "\n", t.offset = null != (a = e.offset) ? a : 0, t.dontPrettyTextNodes = null != (s = null != (c = e.dontPrettyTextNodes) ? c : e.dontprettytextnodes) ? s : 0, t.spaceBeforeSlash = null != (p = null != (u = e.spaceBeforeSlash) ? u : e.spacebeforeslash) ? p : "", !0 === t.spaceBeforeSlash && (t.spaceBeforeSlash = " "), t.suppressPrettyCount = 0, t.user = {}, t.state = i.None, t
            }, e.prototype.indent = function(e, t, n) {
              var i;
              return !t.pretty || t.suppressPrettyCount ? "" : t.pretty && (i = (n || 0) + t.offset + 1) > 0 ? new Array(i).join(t.indent) : ""
            }, e.prototype.endline = function(e, t, n) {
              return !t.pretty || t.suppressPrettyCount ? "" : t.newline
            }, e.prototype.attribute = function(e, t, n) {
              var i;
              return this.openAttribute(e, t, n), i = " " + e.name + '="' + e.value + '"', this.closeAttribute(e, t, n), i
            }, e.prototype.cdata = function(e, t, n) {
              var o;
              return this.openNode(e, t, n), t.state = i.OpenTag, o = this.indent(e, t, n) + "<![CDATA[", t.state = i.InsideTag, o += e.value, t.state = i.CloseTag, o += "]]>" + this.endline(e, t, n), t.state = i.None, this.closeNode(e, t, n), o
            }, e.prototype.comment = function(e, t, n) {
              var o;
              return this.openNode(e, t, n), t.state = i.OpenTag, o = this.indent(e, t, n) + "\x3c!-- ", t.state = i.InsideTag, o += e.value, t.state = i.CloseTag, o += " --\x3e" + this.endline(e, t, n), t.state = i.None, this.closeNode(e, t, n), o
            }, e.prototype.declaration = function(e, t, n) {
              var o;
              return this.openNode(e, t, n), t.state = i.OpenTag, o = this.indent(e, t, n) + "<?xml", t.state = i.InsideTag, o += ' version="' + e.version + '"', null != e.encoding && (o += ' encoding="' + e.encoding + '"'), null != e.standalone && (o += ' standalone="' + e.standalone + '"'), t.state = i.CloseTag, o += t.spaceBeforeSlash + "?>", o += this.endline(e, t, n), t.state = i.None, this.closeNode(e, t, n), o
            }, e.prototype.docType = function(e, t, n) {
              var o, r, a, s, c;
              if (n || (n = 0), this.openNode(e, t, n), t.state = i.OpenTag, s = this.indent(e, t, n), s += "<!DOCTYPE " + e.root().name, e.pubID && e.sysID ? s += ' PUBLIC "' + e.pubID + '" "' + e.sysID + '"' : e.sysID && (s += ' SYSTEM "' + e.sysID + '"'), e.children.length > 0) {
                for (s += " [", s += this.endline(e, t, n), t.state = i.InsideTag, r = 0, a = (c = e.children).length; r < a; r++) o = c[r], s += this.writeChildNode(o, t, n + 1);
                t.state = i.CloseTag, s += "]"
              }
              return t.state = i.CloseTag, s += t.spaceBeforeSlash + ">", s += this.endline(e, t, n), t.state = i.None, this.closeNode(e, t, n), s
            }, e.prototype.element = function(e, n, o) {
              var a, s, c, p, u, l, d, f, m, h, v, g, x, b;
              for (m in o || (o = 0), h = !1, v = "", this.openNode(e, n, o), n.state = i.OpenTag, v += this.indent(e, n, o) + "<" + e.name, g = e.attribs) r.call(g, m) && (a = g[m], v += this.attribute(a, n, o));
              if (p = 0 === (c = e.children.length) ? null : e.children[0], 0 === c || e.children.every((function(e) {
                  return (e.type === t.Text || e.type === t.Raw) && "" === e.value
                }))) n.allowEmpty ? (v += ">", n.state = i.CloseTag, v += "</" + e.name + ">" + this.endline(e, n, o)) : (n.state = i.CloseTag, v += n.spaceBeforeSlash + "/>" + this.endline(e, n, o));
              else if (!n.pretty || 1 !== c || p.type !== t.Text && p.type !== t.Raw || null == p.value) {
                if (n.dontPrettyTextNodes)
                  for (u = 0, d = (x = e.children).length; u < d; u++)
                    if (((s = x[u]).type === t.Text || s.type === t.Raw) && null != s.value) {
                      n.suppressPrettyCount++, h = !0;
                      break
                    } for (v += ">" + this.endline(e, n, o), n.state = i.InsideTag, l = 0, f = (b = e.children).length; l < f; l++) s = b[l], v += this.writeChildNode(s, n, o + 1);
                n.state = i.CloseTag, v += this.indent(e, n, o) + "</" + e.name + ">", h && n.suppressPrettyCount--, v += this.endline(e, n, o), n.state = i.None
              } else v += ">", n.state = i.InsideTag, n.suppressPrettyCount++, h = !0, v += this.writeChildNode(p, n, o + 1), n.suppressPrettyCount--, h = !1, n.state = i.CloseTag, v += "</" + e.name + ">" + this.endline(e, n, o);
              return this.closeNode(e, n, o), v
            }, e.prototype.writeChildNode = function(e, n, i) {
              switch (e.type) {
                case t.CData:
                  return this.cdata(e, n, i);
                case t.Comment:
                  return this.comment(e, n, i);
                case t.Element:
                  return this.element(e, n, i);
                case t.Raw:
                  return this.raw(e, n, i);
                case t.Text:
                  return this.text(e, n, i);
                case t.ProcessingInstruction:
                  return this.processingInstruction(e, n, i);
                case t.Dummy:
                  return "";
                case t.Declaration:
                  return this.declaration(e, n, i);
                case t.DocType:
                  return this.docType(e, n, i);
                case t.AttributeDeclaration:
                  return this.dtdAttList(e, n, i);
                case t.ElementDeclaration:
                  return this.dtdElement(e, n, i);
                case t.EntityDeclaration:
                  return this.dtdEntity(e, n, i);
                case t.NotationDeclaration:
                  return this.dtdNotation(e, n, i);
                default:
                  throw new Error("Unknown XML node type: " + e.constructor.name)
              }
            }, e.prototype.processingInstruction = function(e, t, n) {
              var o;
              return this.openNode(e, t, n), t.state = i.OpenTag, o = this.indent(e, t, n) + "<?", t.state = i.InsideTag, o += e.target, e.value && (o += " " + e.value), t.state = i.CloseTag, o += t.spaceBeforeSlash + "?>", o += this.endline(e, t, n), t.state = i.None, this.closeNode(e, t, n), o
            }, e.prototype.raw = function(e, t, n) {
              var o;
              return this.openNode(e, t, n), t.state = i.OpenTag, o = this.indent(e, t, n), t.state = i.InsideTag, o += e.value, t.state = i.CloseTag, o += this.endline(e, t, n), t.state = i.None, this.closeNode(e, t, n), o
            }, e.prototype.text = function(e, t, n) {
              var o;
              return this.openNode(e, t, n), t.state = i.OpenTag, o = this.indent(e, t, n), t.state = i.InsideTag, o += e.value, t.state = i.CloseTag, o += this.endline(e, t, n), t.state = i.None, this.closeNode(e, t, n), o
            }, e.prototype.dtdAttList = function(e, t, n) {
              var o;
              return this.openNode(e, t, n), t.state = i.OpenTag, o = this.indent(e, t, n) + "<!ATTLIST", t.state = i.InsideTag, o += " " + e.elementName + " " + e.attributeName + " " + e.attributeType, "#DEFAULT" !== e.defaultValueType && (o += " " + e.defaultValueType), e.defaultValue && (o += ' "' + e.defaultValue + '"'), t.state = i.CloseTag, o += t.spaceBeforeSlash + ">" + this.endline(e, t, n), t.state = i.None, this.closeNode(e, t, n), o
            }, e.prototype.dtdElement = function(e, t, n) {
              var o;
              return this.openNode(e, t, n), t.state = i.OpenTag, o = this.indent(e, t, n) + "<!ELEMENT", t.state = i.InsideTag, o += " " + e.name + " " + e.value, t.state = i.CloseTag, o += t.spaceBeforeSlash + ">" + this.endline(e, t, n), t.state = i.None, this.closeNode(e, t, n), o
            }, e.prototype.dtdEntity = function(e, t, n) {
              var o;
              return this.openNode(e, t, n), t.state = i.OpenTag, o = this.indent(e, t, n) + "<!ENTITY", t.state = i.InsideTag, e.pe && (o += " %"), o += " " + e.name, e.value ? o += ' "' + e.value + '"' : (e.pubID && e.sysID ? o += ' PUBLIC "' + e.pubID + '" "' + e.sysID + '"' : e.sysID && (o += ' SYSTEM "' + e.sysID + '"'), e.nData && (o += " NDATA " + e.nData)), t.state = i.CloseTag, o += t.spaceBeforeSlash + ">" + this.endline(e, t, n), t.state = i.None, this.closeNode(e, t, n), o
            }, e.prototype.dtdNotation = function(e, t, n) {
              var o;
              return this.openNode(e, t, n), t.state = i.OpenTag, o = this.indent(e, t, n) + "<!NOTATION", t.state = i.InsideTag, o += " " + e.name, e.pubID && e.sysID ? o += ' PUBLIC "' + e.pubID + '" "' + e.sysID + '"' : e.pubID ? o += ' PUBLIC "' + e.pubID + '"' : e.sysID && (o += ' SYSTEM "' + e.sysID + '"'), t.state = i.CloseTag, o += t.spaceBeforeSlash + ">" + this.endline(e, t, n), t.state = i.None, this.closeNode(e, t, n), o
            }, e.prototype.openNode = function(e, t, n) {}, e.prototype.closeNode = function(e, t, n) {}, e.prototype.openAttribute = function(e, t, n) {}, e.prototype.closeAttribute = function(e, t, n) {}, e
          }()
        }).call(this)
      },
      5532: function(e, t, n) {
        (function() {
          var t, i, o, r, a, s, c, p, u, l;
          l = n(8369), p = l.assign, u = l.isFunction, o = n(1770), r = n(6934), a = n(9227), c = n(6434), s = n(1996), t = n(9335), i = n(594), e.exports.create = function(e, t, n, i) {
            var o, a;
            if (null == e) throw new Error("Root element needs a name.");
            return i = p({}, t, n, i), a = (o = new r(i)).element(e), i.headless || (o.declaration(i), null == i.pubID && null == i.sysID || o.dtd(i)), a
          }, e.exports.begin = function(e, t, n) {
            var i;
            return u(e) && (t = (i = [e, t])[0], n = i[1], e = {}), t ? new a(e, t, n) : new r(e)
          }, e.exports.stringWriter = function(e) {
            return new c(e)
          }, e.exports.streamWriter = function(e, t) {
            return new s(e, t)
          }, e.exports.implementation = new o, e.exports.nodeType = t, e.exports.writerState = i
        }).call(this)
      },
      4959: (e, t, n) => {
        "use strict";
        e.exports = n.p + "resources/node_modules/ac-components/src/_ref/language/Czech.xml"
      },
      1102: (e, t, n) => {
        "use strict";
        e.exports = n.p + "resources/node_modules/ac-components/src/_ref/language/Danish.xml"
      },
      2118: (e, t, n) => {
        "use strict";
        e.exports = n.p + "resources/node_modules/ac-components/src/_ref/language/Dutch.xml"
      },
      7190: (e, t, n) => {
        "use strict";
        e.exports = n.p + "resources/node_modules/ac-components/src/_ref/language/English.xml"
      },
      1324: (e, t, n) => {
        "use strict";
        e.exports = n.p + "resources/node_modules/ac-components/src/_ref/language/Finnish.xml"
      },
      8319: (e, t, n) => {
        "use strict";
        e.exports = n.p + "resources/node_modules/ac-components/src/_ref/language/French.xml"
      },
      5669: (e, t, n) => {
        "use strict";
        e.exports = n.p + "resources/node_modules/ac-components/src/_ref/language/German.xml"
      },
      5142: (e, t, n) => {
        "use strict";
        e.exports = n.p + "resources/node_modules/ac-components/src/_ref/language/Indonesia.xml"
      },
      9362: (e, t, n) => {
        "use strict";
        e.exports = n.p + "resources/node_modules/ac-components/src/_ref/language/Italian.xml"
      },
      8690: (e, t, n) => {
        "use strict";
        e.exports = n.p + "resources/node_modules/ac-components/src/_ref/language/Japanese.xml"
      },
      1879: (e, t, n) => {
        "use strict";
        e.exports = n.p + "resources/node_modules/ac-components/src/_ref/language/Korean.xml"
      },
      70: (e, t, n) => {
        "use strict";
        e.exports = n.p + "resources/node_modules/ac-components/src/_ref/language/Norwegian.xml"
      },
      8204: (e, t, n) => {
        "use strict";
        e.exports = n.p + "resources/node_modules/ac-components/src/_ref/language/Polish.xml"
      },
      6444: (e, t, n) => {
        "use strict";
        e.exports = n.p + "resources/node_modules/ac-components/src/_ref/language/Portuguese.xml"
      },
      9064: (e, t, n) => {
        "use strict";
        e.exports = n.p + "resources/node_modules/ac-components/src/_ref/language/Romanian.xml"
      },
      5140: (e, t, n) => {
        "use strict";
        e.exports = n.p + "resources/node_modules/ac-components/src/_ref/language/Russian.xml"
      },
      6065: (e, t, n) => {
        "use strict";
        e.exports = n.p + "resources/node_modules/ac-components/src/_ref/language/Simplified Chinese.xml"
      },
      5068: (e, t, n) => {
        "use strict";
        e.exports = n.p + "resources/node_modules/ac-components/src/_ref/language/Slovakian.xml"
      },
      737: (e, t, n) => {
        "use strict";
        e.exports = n.p + "resources/node_modules/ac-components/src/_ref/language/Spanish.xml"
      },
      8141: (e, t, n) => {
        "use strict";
        e.exports = n.p + "resources/node_modules/ac-components/src/_ref/language/Swedish.xml"
      },
      7943: (e, t, n) => {
        "use strict";
        e.exports = n.p + "resources/node_modules/ac-components/src/_ref/language/Thai.xml"
      },
      29: (e, t, n) => {
        "use strict";
        e.exports = n.p + "resources/node_modules/ac-components/src/_ref/language/Traditional Chinese.xml"
      },
      7111: (e, t, n) => {
        "use strict";
        e.exports = n.p + "resources/node_modules/ac-components/src/_ref/language/Turkish.xml"
      },
      6761: (e, t, n) => {
        "use strict";
        e.exports = n.p + "resources/node_modules/ac-components/src/_ref/language/Ukrainian.xml"
      },
      2864: e => {
        "use strict";
        e.exports = require("bufferutil")
      },
      2239: e => {
        "use strict";
        e.exports = require("utf-8-validate")
      },
      9491: e => {
        "use strict";
        e.exports = require("assert")
      },
      4300: e => {
        "use strict";
        e.exports = require("buffer")
      },
      6113: e => {
        "use strict";
        e.exports = require("crypto")
      },
      2361: e => {
        "use strict";
        e.exports = require("events")
      },
      7147: e => {
        "use strict";
        e.exports = require("fs")
      },
      3685: e => {
        "use strict";
        e.exports = require("http")
      },
      5687: e => {
        "use strict";
        e.exports = require("https")
      },
      1808: e => {
        "use strict";
        e.exports = require("net")
      },
      2037: e => {
        "use strict";
        e.exports = require("os")
      },
      1017: e => {
        "use strict";
        e.exports = require("path")
      },
      2781: e => {
        "use strict";
        e.exports = require("stream")
      },
      1576: e => {
        "use strict";
        e.exports = require("string_decoder")
      },
      9512: e => {
        "use strict";
        e.exports = require("timers")
      },
      4404: e => {
        "use strict";
        e.exports = require("tls")
      },
      6224: e => {
        "use strict";
        e.exports = require("tty")
      },
      7310: e => {
        "use strict";
        e.exports = require("url")
      },
      3837: e => {
        "use strict";
        e.exports = require("util")
      },
      9796: e => {
        "use strict";
        e.exports = require("zlib")
      },
      3897: e => {
        e.exports = function(e, t) {
          (null == t || t > e.length) && (t = e.length);
          for (var n = 0, i = new Array(t); n < t; n++) i[n] = e[n];
          return i
        }, e.exports.__esModule = !0, e.exports.default = e.exports
      },
      5372: e => {
        e.exports = function(e) {
          if (Array.isArray(e)) return e
        }, e.exports.__esModule = !0, e.exports.default = e.exports
      },
      3405: (e, t, n) => {
        var i = n(3897);
        e.exports = function(e) {
          if (Array.isArray(e)) return i(e)
        }, e.exports.__esModule = !0, e.exports.default = e.exports
      },
      6115: e => {
        e.exports = function(e) {
          if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
          return e
        }, e.exports.__esModule = !0, e.exports.default = e.exports
      },
      7156: e => {
        function t(e, t, n, i, o, r, a) {
          try {
            var s = e[r](a),
              c = s.value
          } catch (e) {
            return void n(e)
          }
          s.done ? t(c) : Promise.resolve(c).then(i, o)
        }
        e.exports = function(e) {
          return function() {
            var n = this,
              i = arguments;
            return new Promise((function(o, r) {
              var a = e.apply(n, i);

              function s(e) {
                t(a, o, r, s, c, "next", e)
              }

              function c(e) {
                t(a, o, r, s, c, "throw", e)
              }
              s(void 0)
            }))
          }
        }, e.exports.__esModule = !0, e.exports.default = e.exports
      },
      6690: e => {
        e.exports = function(e, t) {
          if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }, e.exports.__esModule = !0, e.exports.default = e.exports
      },
      9728: (e, t, n) => {
        var i = n(4062);

        function o(e, t) {
          for (var n = 0; n < t.length; n++) {
            var o = t[n];
            o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, i(o.key), o)
          }
        }
        e.exports = function(e, t, n) {
          return t && o(e.prototype, t), n && o(e, n), Object.defineProperty(e, "prototype", {
            writable: !1
          }), e
        }, e.exports.__esModule = !0, e.exports.default = e.exports
      },
      8416: (e, t, n) => {
        var i = n(4062);
        e.exports = function(e, t, n) {
          return (t = i(t)) in e ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0
          }) : e[t] = n, e
        }, e.exports.__esModule = !0, e.exports.default = e.exports
      },
      1588: (e, t, n) => {
        var i = n(1753);

        function o() {
          return "undefined" != typeof Reflect && Reflect.get ? (e.exports = o = Reflect.get.bind(), e.exports.__esModule = !0, e.exports.default = e.exports) : (e.exports = o = function(e, t, n) {
            var o = i(e, t);
            if (o) {
              var r = Object.getOwnPropertyDescriptor(o, t);
              return r.get ? r.get.call(arguments.length < 3 ? e : n) : r.value
            }
          }, e.exports.__esModule = !0, e.exports.default = e.exports), o.apply(this, arguments)
        }
        e.exports = o, e.exports.__esModule = !0, e.exports.default = e.exports
      },
      3808: e => {
        function t(n) {
          return e.exports = t = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(e) {
            return e.__proto__ || Object.getPrototypeOf(e)
          }, e.exports.__esModule = !0, e.exports.default = e.exports, t(n)
        }
        e.exports = t, e.exports.__esModule = !0, e.exports.default = e.exports
      },
      1655: (e, t, n) => {
        var i = n(6015);
        e.exports = function(e, t) {
          if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
          e.prototype = Object.create(t && t.prototype, {
            constructor: {
              value: e,
              writable: !0,
              configurable: !0
            }
          }), Object.defineProperty(e, "prototype", {
            writable: !1
          }), t && i(e, t)
        }, e.exports.__esModule = !0, e.exports.default = e.exports
      },
      9498: e => {
        e.exports = function(e) {
          if ("undefined" != typeof Symbol && null != e[Symbol.iterator] || null != e["@@iterator"]) return Array.from(e)
        }, e.exports.__esModule = !0, e.exports.default = e.exports
      },
      8872: e => {
        e.exports = function(e, t) {
          var n = null == e ? null : "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
          if (null != n) {
            var i, o, r, a, s = [],
              c = !0,
              p = !1;
            try {
              if (r = (n = n.call(e)).next, 0 === t) {
                if (Object(n) !== n) return;
                c = !1
              } else
                for (; !(c = (i = r.call(n)).done) && (s.push(i.value), s.length !== t); c = !0);
            } catch (e) {
              p = !0, o = e
            } finally {
              try {
                if (!c && null != n.return && (a = n.return(), Object(a) !== a)) return
              } finally {
                if (p) throw o
              }
            }
            return s
          }
        }, e.exports.__esModule = !0, e.exports.default = e.exports
      },
      2218: e => {
        e.exports = function() {
          throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }, e.exports.__esModule = !0, e.exports.default = e.exports
      },
      2281: e => {
        e.exports = function() {
          throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }, e.exports.__esModule = !0, e.exports.default = e.exports
      },
      215: (e, t, n) => {
        var i = n(7071);
        e.exports = function(e, t) {
          if (null == e) return {};
          var n, o, r = i(e, t);
          if (Object.getOwnPropertySymbols) {
            var a = Object.getOwnPropertySymbols(e);
            for (o = 0; o < a.length; o++) n = a[o], t.indexOf(n) >= 0 || Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n])
          }
          return r
        }, e.exports.__esModule = !0, e.exports.default = e.exports
      },
      7071: e => {
        e.exports = function(e, t) {
          if (null == e) return {};
          var n, i, o = {},
            r = Object.keys(e);
          for (i = 0; i < r.length; i++) n = r[i], t.indexOf(n) >= 0 || (o[n] = e[n]);
          return o
        }, e.exports.__esModule = !0, e.exports.default = e.exports
      },
      4993: (e, t, n) => {
        var i = n(8698).default,
          o = n(6115);
        e.exports = function(e, t) {
          if (t && ("object" === i(t) || "function" == typeof t)) return t;
          if (void 0 !== t) throw new TypeError("Derived constructors may only return object or undefined");
          return o(e)
        }, e.exports.__esModule = !0, e.exports.default = e.exports
      },
      7061: (e, t, n) => {
        var i = n(8698).default;

        function o() {
          "use strict";
          e.exports = o = function() {
            return t
          }, e.exports.__esModule = !0, e.exports.default = e.exports;
          var t = {},
            n = Object.prototype,
            r = n.hasOwnProperty,
            a = Object.defineProperty || function(e, t, n) {
              e[t] = n.value
            },
            s = "function" == typeof Symbol ? Symbol : {},
            c = s.iterator || "@@iterator",
            p = s.asyncIterator || "@@asyncIterator",
            u = s.toStringTag || "@@toStringTag";

          function l(e, t, n) {
            return Object.defineProperty(e, t, {
              value: n,
              enumerable: !0,
              configurable: !0,
              writable: !0
            }), e[t]
          }
          try {
            l({}, "")
          } catch (e) {
            l = function(e, t, n) {
              return e[t] = n
            }
          }

          function d(e, t, n, i) {
            var o = t && t.prototype instanceof h ? t : h,
              r = Object.create(o.prototype),
              s = new I(i || []);
            return a(r, "_invoke", {
              value: S(e, n, s)
            }), r
          }

          function f(e, t, n) {
            try {
              return {
                type: "normal",
                arg: e.call(t, n)
              }
            } catch (e) {
              return {
                type: "throw",
                arg: e
              }
            }
          }
          t.wrap = d;
          var m = {};

          function h() {}

          function v() {}

          function g() {}
          var x = {};
          l(x, c, (function() {
            return this
          }));
          var b = Object.getPrototypeOf,
            y = b && b(b(N([])));
          y && y !== n && r.call(y, c) && (x = y);
          var w = g.prototype = h.prototype = Object.create(x);

          function _(e) {
            ["next", "throw", "return"].forEach((function(t) {
              l(e, t, (function(e) {
                return this._invoke(t, e)
              }))
            }))
          }

          function E(e, t) {
            function n(o, a, s, c) {
              var p = f(e[o], e, a);
              if ("throw" !== p.type) {
                var u = p.arg,
                  l = u.value;
                return l && "object" == i(l) && r.call(l, "__await") ? t.resolve(l.__await).then((function(e) {
                  n("next", e, s, c)
                }), (function(e) {
                  n("throw", e, s, c)
                })) : t.resolve(l).then((function(e) {
                  u.value = e, s(u)
                }), (function(e) {
                  return n("throw", e, s, c)
                }))
              }
              c(p.arg)
            }
            var o;
            a(this, "_invoke", {
              value: function(e, i) {
                function r() {
                  return new t((function(t, o) {
                    n(e, i, t, o)
                  }))
                }
                return o = o ? o.then(r, r) : r()
              }
            })
          }

          function S(e, t, n) {
            var i = "suspendedStart";
            return function(o, r) {
              if ("executing" === i) throw new Error("Generator is already running");
              if ("completed" === i) {
                if ("throw" === o) throw r;
                return {
                  value: void 0,
                  done: !0
                }
              }
              for (n.method = o, n.arg = r;;) {
                var a = n.delegate;
                if (a) {
                  var s = O(a, n);
                  if (s) {
                    if (s === m) continue;
                    return s
                  }
                }
                if ("next" === n.method) n.sent = n._sent = n.arg;
                else if ("throw" === n.method) {
                  if ("suspendedStart" === i) throw i = "completed", n.arg;
                  n.dispatchException(n.arg)
                } else "return" === n.method && n.abrupt("return", n.arg);
                i = "executing";
                var c = f(e, t, n);
                if ("normal" === c.type) {
                  if (i = n.done ? "completed" : "suspendedYield", c.arg === m) continue;
                  return {
                    value: c.arg,
                    done: n.done
                  }
                }
                "throw" === c.type && (i = "completed", n.method = "throw", n.arg = c.arg)
              }
            }
          }

          function O(e, t) {
            var n = t.method,
              i = e.iterator[n];
            if (void 0 === i) return t.delegate = null, "throw" === n && e.iterator.return && (t.method = "return", t.arg = void 0, O(e, t), "throw" === t.method) || "return" !== n && (t.method = "throw", t.arg = new TypeError("The iterator does not provide a '" + n + "' method")), m;
            var o = f(i, e.iterator, t.arg);
            if ("throw" === o.type) return t.method = "throw", t.arg = o.arg, t.delegate = null, m;
            var r = o.arg;
            return r ? r.done ? (t[e.resultName] = r.value, t.next = e.nextLoc, "return" !== t.method && (t.method = "next", t.arg = void 0), t.delegate = null, m) : r : (t.method = "throw", t.arg = new TypeError("iterator result is not an object"), t.delegate = null, m)
          }

          function T(e) {
            var t = {
              tryLoc: e[0]
            };
            1 in e && (t.catchLoc = e[1]), 2 in e && (t.finallyLoc = e[2], t.afterLoc = e[3]), this.tryEntries.push(t)
          }

          function C(e) {
            var t = e.completion || {};
            t.type = "normal", delete t.arg, e.completion = t
          }

          function I(e) {
            this.tryEntries = [{
              tryLoc: "root"
            }], e.forEach(T, this), this.reset(!0)
          }

          function N(e) {
            if (e) {
              var t = e[c];
              if (t) return t.call(e);
              if ("function" == typeof e.next) return e;
              if (!isNaN(e.length)) {
                var n = -1,
                  i = function t() {
                    for (; ++n < e.length;)
                      if (r.call(e, n)) return t.value = e[n], t.done = !1, t;
                    return t.value = void 0, t.done = !0, t
                  };
                return i.next = i
              }
            }
            return {
              next: P
            }
          }

          function P() {
            return {
              value: void 0,
              done: !0
            }
          }
          return v.prototype = g, a(w, "constructor", {
            value: g,
            configurable: !0
          }), a(g, "constructor", {
            value: v,
            configurable: !0
          }), v.displayName = l(g, u, "GeneratorFunction"), t.isGeneratorFunction = function(e) {
            var t = "function" == typeof e && e.constructor;
            return !!t && (t === v || "GeneratorFunction" === (t.displayName || t.name))
          }, t.mark = function(e) {
            return Object.setPrototypeOf ? Object.setPrototypeOf(e, g) : (e.__proto__ = g, l(e, u, "GeneratorFunction")), e.prototype = Object.create(w), e
          }, t.awrap = function(e) {
            return {
              __await: e
            }
          }, _(E.prototype), l(E.prototype, p, (function() {
            return this
          })), t.AsyncIterator = E, t.async = function(e, n, i, o, r) {
            void 0 === r && (r = Promise);
            var a = new E(d(e, n, i, o), r);
            return t.isGeneratorFunction(n) ? a : a.next().then((function(e) {
              return e.done ? e.value : a.next()
            }))
          }, _(w), l(w, u, "Generator"), l(w, c, (function() {
            return this
          })), l(w, "toString", (function() {
            return "[object Generator]"
          })), t.keys = function(e) {
            var t = Object(e),
              n = [];
            for (var i in t) n.push(i);
            return n.reverse(),
              function e() {
                for (; n.length;) {
                  var i = n.pop();
                  if (i in t) return e.value = i, e.done = !1, e
                }
                return e.done = !0, e
              }
          }, t.values = N, I.prototype = {
            constructor: I,
            reset: function(e) {
              if (this.prev = 0, this.next = 0, this.sent = this._sent = void 0, this.done = !1, this.delegate = null, this.method = "next", this.arg = void 0, this.tryEntries.forEach(C), !e)
                for (var t in this) "t" === t.charAt(0) && r.call(this, t) && !isNaN(+t.slice(1)) && (this[t] = void 0)
            },
            stop: function() {
              this.done = !0;
              var e = this.tryEntries[0].completion;
              if ("throw" === e.type) throw e.arg;
              return this.rval
            },
            dispatchException: function(e) {
              if (this.done) throw e;
              var t = this;

              function n(n, i) {
                return a.type = "throw", a.arg = e, t.next = n, i && (t.method = "next", t.arg = void 0), !!i
              }
              for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                var o = this.tryEntries[i],
                  a = o.completion;
                if ("root" === o.tryLoc) return n("end");
                if (o.tryLoc <= this.prev) {
                  var s = r.call(o, "catchLoc"),
                    c = r.call(o, "finallyLoc");
                  if (s && c) {
                    if (this.prev < o.catchLoc) return n(o.catchLoc, !0);
                    if (this.prev < o.finallyLoc) return n(o.finallyLoc)
                  } else if (s) {
                    if (this.prev < o.catchLoc) return n(o.catchLoc, !0)
                  } else {
                    if (!c) throw new Error("try statement without catch or finally");
                    if (this.prev < o.finallyLoc) return n(o.finallyLoc)
                  }
                }
              }
            },
            abrupt: function(e, t) {
              for (var n = this.tryEntries.length - 1; n >= 0; --n) {
                var i = this.tryEntries[n];
                if (i.tryLoc <= this.prev && r.call(i, "finallyLoc") && this.prev < i.finallyLoc) {
                  var o = i;
                  break
                }
              }
              o && ("break" === e || "continue" === e) && o.tryLoc <= t && t <= o.finallyLoc && (o = null);
              var a = o ? o.completion : {};
              return a.type = e, a.arg = t, o ? (this.method = "next", this.next = o.finallyLoc, m) : this.complete(a)
            },
            complete: function(e, t) {
              if ("throw" === e.type) throw e.arg;
              return "break" === e.type || "continue" === e.type ? this.next = e.arg : "return" === e.type ? (this.rval = this.arg = e.arg, this.method = "return", this.next = "end") : "normal" === e.type && t && (this.next = t), m
            },
            finish: function(e) {
              for (var t = this.tryEntries.length - 1; t >= 0; --t) {
                var n = this.tryEntries[t];
                if (n.finallyLoc === e) return this.complete(n.completion, n.afterLoc), C(n), m
              }
            },
            catch: function(e) {
              for (var t = this.tryEntries.length - 1; t >= 0; --t) {
                var n = this.tryEntries[t];
                if (n.tryLoc === e) {
                  var i = n.completion;
                  if ("throw" === i.type) {
                    var o = i.arg;
                    C(n)
                  }
                  return o
                }
              }
              throw new Error("illegal catch attempt")
            },
            delegateYield: function(e, t, n) {
              return this.delegate = {
                iterator: N(e),
                resultName: t,
                nextLoc: n
              }, "next" === this.method && (this.arg = void 0), m
            }
          }, t
        }
        e.exports = o, e.exports.__esModule = !0, e.exports.default = e.exports
      },
      6015: e => {
        function t(n, i) {
          return e.exports = t = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(e, t) {
            return e.__proto__ = t, e
          }, e.exports.__esModule = !0, e.exports.default = e.exports, t(n, i)
        }
        e.exports = t, e.exports.__esModule = !0, e.exports.default = e.exports
      },
      7424: (e, t, n) => {
        var i = n(5372),
          o = n(8872),
          r = n(6116),
          a = n(2218);
        e.exports = function(e, t) {
          return i(e) || o(e, t) || r(e, t) || a()
        }, e.exports.__esModule = !0, e.exports.default = e.exports
      },
      1753: (e, t, n) => {
        var i = n(3808);
        e.exports = function(e, t) {
          for (; !Object.prototype.hasOwnProperty.call(e, t) && null !== (e = i(e)););
          return e
        }, e.exports.__esModule = !0, e.exports.default = e.exports
      },
      861: (e, t, n) => {
        var i = n(3405),
          o = n(9498),
          r = n(6116),
          a = n(2281);
        e.exports = function(e) {
          return i(e) || o(e) || r(e) || a()
        }, e.exports.__esModule = !0, e.exports.default = e.exports
      },
      5036: (e, t, n) => {
        var i = n(8698).default;
        e.exports = function(e, t) {
          if ("object" !== i(e) || null === e) return e;
          var n = e[Symbol.toPrimitive];
          if (void 0 !== n) {
            var o = n.call(e, t || "default");
            if ("object" !== i(o)) return o;
            throw new TypeError("@@toPrimitive must return a primitive value.")
          }
          return ("string" === t ? String : Number)(e)
        }, e.exports.__esModule = !0, e.exports.default = e.exports
      },
      4062: (e, t, n) => {
        var i = n(8698).default,
          o = n(5036);
        e.exports = function(e) {
          var t = o(e, "string");
          return "symbol" === i(t) ? t : String(t)
        }, e.exports.__esModule = !0, e.exports.default = e.exports
      },
      8698: e => {
        function t(n) {
          return e.exports = t = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
            return typeof e
          } : function(e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
          }, e.exports.__esModule = !0, e.exports.default = e.exports, t(n)
        }
        e.exports = t, e.exports.__esModule = !0, e.exports.default = e.exports
      },
      6116: (e, t, n) => {
        var i = n(3897);
        e.exports = function(e, t) {
          if (e) {
            if ("string" == typeof e) return i(e, t);
            var n = Object.prototype.toString.call(e).slice(8, -1);
            return "Object" === n && e.constructor && (n = e.constructor.name), "Map" === n || "Set" === n ? Array.from(e) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? i(e, t) : void 0
          }
        }, e.exports.__esModule = !0, e.exports.default = e.exports
      },
      4687: (e, t, n) => {
        var i = n(7061)();
        e.exports = i;
        try {
          regeneratorRuntime = i
        } catch (e) {
          "object" == typeof globalThis ? globalThis.regeneratorRuntime = i : Function("r", "regeneratorRuntime = r")(i)
        }
      },
      3765: e => {
        "use strict";
        e.exports = JSON.parse('{"application/1d-interleaved-parityfec":{"source":"iana"},"application/3gpdash-qoe-report+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/3gpp-ims+xml":{"source":"iana","compressible":true},"application/3gpphal+json":{"source":"iana","compressible":true},"application/3gpphalforms+json":{"source":"iana","compressible":true},"application/a2l":{"source":"iana"},"application/ace+cbor":{"source":"iana"},"application/activemessage":{"source":"iana"},"application/activity+json":{"source":"iana","compressible":true},"application/alto-costmap+json":{"source":"iana","compressible":true},"application/alto-costmapfilter+json":{"source":"iana","compressible":true},"application/alto-directory+json":{"source":"iana","compressible":true},"application/alto-endpointcost+json":{"source":"iana","compressible":true},"application/alto-endpointcostparams+json":{"source":"iana","compressible":true},"application/alto-endpointprop+json":{"source":"iana","compressible":true},"application/alto-endpointpropparams+json":{"source":"iana","compressible":true},"application/alto-error+json":{"source":"iana","compressible":true},"application/alto-networkmap+json":{"source":"iana","compressible":true},"application/alto-networkmapfilter+json":{"source":"iana","compressible":true},"application/alto-updatestreamcontrol+json":{"source":"iana","compressible":true},"application/alto-updatestreamparams+json":{"source":"iana","compressible":true},"application/aml":{"source":"iana"},"application/andrew-inset":{"source":"iana","extensions":["ez"]},"application/applefile":{"source":"iana"},"application/applixware":{"source":"apache","extensions":["aw"]},"application/at+jwt":{"source":"iana"},"application/atf":{"source":"iana"},"application/atfx":{"source":"iana"},"application/atom+xml":{"source":"iana","compressible":true,"extensions":["atom"]},"application/atomcat+xml":{"source":"iana","compressible":true,"extensions":["atomcat"]},"application/atomdeleted+xml":{"source":"iana","compressible":true,"extensions":["atomdeleted"]},"application/atomicmail":{"source":"iana"},"application/atomsvc+xml":{"source":"iana","compressible":true,"extensions":["atomsvc"]},"application/atsc-dwd+xml":{"source":"iana","compressible":true,"extensions":["dwd"]},"application/atsc-dynamic-event-message":{"source":"iana"},"application/atsc-held+xml":{"source":"iana","compressible":true,"extensions":["held"]},"application/atsc-rdt+json":{"source":"iana","compressible":true},"application/atsc-rsat+xml":{"source":"iana","compressible":true,"extensions":["rsat"]},"application/atxml":{"source":"iana"},"application/auth-policy+xml":{"source":"iana","compressible":true},"application/bacnet-xdd+zip":{"source":"iana","compressible":false},"application/batch-smtp":{"source":"iana"},"application/bdoc":{"compressible":false,"extensions":["bdoc"]},"application/beep+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/calendar+json":{"source":"iana","compressible":true},"application/calendar+xml":{"source":"iana","compressible":true,"extensions":["xcs"]},"application/call-completion":{"source":"iana"},"application/cals-1840":{"source":"iana"},"application/captive+json":{"source":"iana","compressible":true},"application/cbor":{"source":"iana"},"application/cbor-seq":{"source":"iana"},"application/cccex":{"source":"iana"},"application/ccmp+xml":{"source":"iana","compressible":true},"application/ccxml+xml":{"source":"iana","compressible":true,"extensions":["ccxml"]},"application/cdfx+xml":{"source":"iana","compressible":true,"extensions":["cdfx"]},"application/cdmi-capability":{"source":"iana","extensions":["cdmia"]},"application/cdmi-container":{"source":"iana","extensions":["cdmic"]},"application/cdmi-domain":{"source":"iana","extensions":["cdmid"]},"application/cdmi-object":{"source":"iana","extensions":["cdmio"]},"application/cdmi-queue":{"source":"iana","extensions":["cdmiq"]},"application/cdni":{"source":"iana"},"application/cea":{"source":"iana"},"application/cea-2018+xml":{"source":"iana","compressible":true},"application/cellml+xml":{"source":"iana","compressible":true},"application/cfw":{"source":"iana"},"application/city+json":{"source":"iana","compressible":true},"application/clr":{"source":"iana"},"application/clue+xml":{"source":"iana","compressible":true},"application/clue_info+xml":{"source":"iana","compressible":true},"application/cms":{"source":"iana"},"application/cnrp+xml":{"source":"iana","compressible":true},"application/coap-group+json":{"source":"iana","compressible":true},"application/coap-payload":{"source":"iana"},"application/commonground":{"source":"iana"},"application/conference-info+xml":{"source":"iana","compressible":true},"application/cose":{"source":"iana"},"application/cose-key":{"source":"iana"},"application/cose-key-set":{"source":"iana"},"application/cpl+xml":{"source":"iana","compressible":true,"extensions":["cpl"]},"application/csrattrs":{"source":"iana"},"application/csta+xml":{"source":"iana","compressible":true},"application/cstadata+xml":{"source":"iana","compressible":true},"application/csvm+json":{"source":"iana","compressible":true},"application/cu-seeme":{"source":"apache","extensions":["cu"]},"application/cwt":{"source":"iana"},"application/cybercash":{"source":"iana"},"application/dart":{"compressible":true},"application/dash+xml":{"source":"iana","compressible":true,"extensions":["mpd"]},"application/dash-patch+xml":{"source":"iana","compressible":true,"extensions":["mpp"]},"application/dashdelta":{"source":"iana"},"application/davmount+xml":{"source":"iana","compressible":true,"extensions":["davmount"]},"application/dca-rft":{"source":"iana"},"application/dcd":{"source":"iana"},"application/dec-dx":{"source":"iana"},"application/dialog-info+xml":{"source":"iana","compressible":true},"application/dicom":{"source":"iana"},"application/dicom+json":{"source":"iana","compressible":true},"application/dicom+xml":{"source":"iana","compressible":true},"application/dii":{"source":"iana"},"application/dit":{"source":"iana"},"application/dns":{"source":"iana"},"application/dns+json":{"source":"iana","compressible":true},"application/dns-message":{"source":"iana"},"application/docbook+xml":{"source":"apache","compressible":true,"extensions":["dbk"]},"application/dots+cbor":{"source":"iana"},"application/dskpp+xml":{"source":"iana","compressible":true},"application/dssc+der":{"source":"iana","extensions":["dssc"]},"application/dssc+xml":{"source":"iana","compressible":true,"extensions":["xdssc"]},"application/dvcs":{"source":"iana"},"application/ecmascript":{"source":"iana","compressible":true,"extensions":["es","ecma"]},"application/edi-consent":{"source":"iana"},"application/edi-x12":{"source":"iana","compressible":false},"application/edifact":{"source":"iana","compressible":false},"application/efi":{"source":"iana"},"application/elm+json":{"source":"iana","charset":"UTF-8","compressible":true},"application/elm+xml":{"source":"iana","compressible":true},"application/emergencycalldata.cap+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/emergencycalldata.comment+xml":{"source":"iana","compressible":true},"application/emergencycalldata.control+xml":{"source":"iana","compressible":true},"application/emergencycalldata.deviceinfo+xml":{"source":"iana","compressible":true},"application/emergencycalldata.ecall.msd":{"source":"iana"},"application/emergencycalldata.providerinfo+xml":{"source":"iana","compressible":true},"application/emergencycalldata.serviceinfo+xml":{"source":"iana","compressible":true},"application/emergencycalldata.subscriberinfo+xml":{"source":"iana","compressible":true},"application/emergencycalldata.veds+xml":{"source":"iana","compressible":true},"application/emma+xml":{"source":"iana","compressible":true,"extensions":["emma"]},"application/emotionml+xml":{"source":"iana","compressible":true,"extensions":["emotionml"]},"application/encaprtp":{"source":"iana"},"application/epp+xml":{"source":"iana","compressible":true},"application/epub+zip":{"source":"iana","compressible":false,"extensions":["epub"]},"application/eshop":{"source":"iana"},"application/exi":{"source":"iana","extensions":["exi"]},"application/expect-ct-report+json":{"source":"iana","compressible":true},"application/express":{"source":"iana","extensions":["exp"]},"application/fastinfoset":{"source":"iana"},"application/fastsoap":{"source":"iana"},"application/fdt+xml":{"source":"iana","compressible":true,"extensions":["fdt"]},"application/fhir+json":{"source":"iana","charset":"UTF-8","compressible":true},"application/fhir+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/fido.trusted-apps+json":{"compressible":true},"application/fits":{"source":"iana"},"application/flexfec":{"source":"iana"},"application/font-sfnt":{"source":"iana"},"application/font-tdpfr":{"source":"iana","extensions":["pfr"]},"application/font-woff":{"source":"iana","compressible":false},"application/framework-attributes+xml":{"source":"iana","compressible":true},"application/geo+json":{"source":"iana","compressible":true,"extensions":["geojson"]},"application/geo+json-seq":{"source":"iana"},"application/geopackage+sqlite3":{"source":"iana"},"application/geoxacml+xml":{"source":"iana","compressible":true},"application/gltf-buffer":{"source":"iana"},"application/gml+xml":{"source":"iana","compressible":true,"extensions":["gml"]},"application/gpx+xml":{"source":"apache","compressible":true,"extensions":["gpx"]},"application/gxf":{"source":"apache","extensions":["gxf"]},"application/gzip":{"source":"iana","compressible":false,"extensions":["gz"]},"application/h224":{"source":"iana"},"application/held+xml":{"source":"iana","compressible":true},"application/hjson":{"extensions":["hjson"]},"application/http":{"source":"iana"},"application/hyperstudio":{"source":"iana","extensions":["stk"]},"application/ibe-key-request+xml":{"source":"iana","compressible":true},"application/ibe-pkg-reply+xml":{"source":"iana","compressible":true},"application/ibe-pp-data":{"source":"iana"},"application/iges":{"source":"iana"},"application/im-iscomposing+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/index":{"source":"iana"},"application/index.cmd":{"source":"iana"},"application/index.obj":{"source":"iana"},"application/index.response":{"source":"iana"},"application/index.vnd":{"source":"iana"},"application/inkml+xml":{"source":"iana","compressible":true,"extensions":["ink","inkml"]},"application/iotp":{"source":"iana"},"application/ipfix":{"source":"iana","extensions":["ipfix"]},"application/ipp":{"source":"iana"},"application/isup":{"source":"iana"},"application/its+xml":{"source":"iana","compressible":true,"extensions":["its"]},"application/java-archive":{"source":"apache","compressible":false,"extensions":["jar","war","ear"]},"application/java-serialized-object":{"source":"apache","compressible":false,"extensions":["ser"]},"application/java-vm":{"source":"apache","compressible":false,"extensions":["class"]},"application/javascript":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["js","mjs"]},"application/jf2feed+json":{"source":"iana","compressible":true},"application/jose":{"source":"iana"},"application/jose+json":{"source":"iana","compressible":true},"application/jrd+json":{"source":"iana","compressible":true},"application/jscalendar+json":{"source":"iana","compressible":true},"application/json":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["json","map"]},"application/json-patch+json":{"source":"iana","compressible":true},"application/json-seq":{"source":"iana"},"application/json5":{"extensions":["json5"]},"application/jsonml+json":{"source":"apache","compressible":true,"extensions":["jsonml"]},"application/jwk+json":{"source":"iana","compressible":true},"application/jwk-set+json":{"source":"iana","compressible":true},"application/jwt":{"source":"iana"},"application/kpml-request+xml":{"source":"iana","compressible":true},"application/kpml-response+xml":{"source":"iana","compressible":true},"application/ld+json":{"source":"iana","compressible":true,"extensions":["jsonld"]},"application/lgr+xml":{"source":"iana","compressible":true,"extensions":["lgr"]},"application/link-format":{"source":"iana"},"application/load-control+xml":{"source":"iana","compressible":true},"application/lost+xml":{"source":"iana","compressible":true,"extensions":["lostxml"]},"application/lostsync+xml":{"source":"iana","compressible":true},"application/lpf+zip":{"source":"iana","compressible":false},"application/lxf":{"source":"iana"},"application/mac-binhex40":{"source":"iana","extensions":["hqx"]},"application/mac-compactpro":{"source":"apache","extensions":["cpt"]},"application/macwriteii":{"source":"iana"},"application/mads+xml":{"source":"iana","compressible":true,"extensions":["mads"]},"application/manifest+json":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["webmanifest"]},"application/marc":{"source":"iana","extensions":["mrc"]},"application/marcxml+xml":{"source":"iana","compressible":true,"extensions":["mrcx"]},"application/mathematica":{"source":"iana","extensions":["ma","nb","mb"]},"application/mathml+xml":{"source":"iana","compressible":true,"extensions":["mathml"]},"application/mathml-content+xml":{"source":"iana","compressible":true},"application/mathml-presentation+xml":{"source":"iana","compressible":true},"application/mbms-associated-procedure-description+xml":{"source":"iana","compressible":true},"application/mbms-deregister+xml":{"source":"iana","compressible":true},"application/mbms-envelope+xml":{"source":"iana","compressible":true},"application/mbms-msk+xml":{"source":"iana","compressible":true},"application/mbms-msk-response+xml":{"source":"iana","compressible":true},"application/mbms-protection-description+xml":{"source":"iana","compressible":true},"application/mbms-reception-report+xml":{"source":"iana","compressible":true},"application/mbms-register+xml":{"source":"iana","compressible":true},"application/mbms-register-response+xml":{"source":"iana","compressible":true},"application/mbms-schedule+xml":{"source":"iana","compressible":true},"application/mbms-user-service-description+xml":{"source":"iana","compressible":true},"application/mbox":{"source":"iana","extensions":["mbox"]},"application/media-policy-dataset+xml":{"source":"iana","compressible":true,"extensions":["mpf"]},"application/media_control+xml":{"source":"iana","compressible":true},"application/mediaservercontrol+xml":{"source":"iana","compressible":true,"extensions":["mscml"]},"application/merge-patch+json":{"source":"iana","compressible":true},"application/metalink+xml":{"source":"apache","compressible":true,"extensions":["metalink"]},"application/metalink4+xml":{"source":"iana","compressible":true,"extensions":["meta4"]},"application/mets+xml":{"source":"iana","compressible":true,"extensions":["mets"]},"application/mf4":{"source":"iana"},"application/mikey":{"source":"iana"},"application/mipc":{"source":"iana"},"application/missing-blocks+cbor-seq":{"source":"iana"},"application/mmt-aei+xml":{"source":"iana","compressible":true,"extensions":["maei"]},"application/mmt-usd+xml":{"source":"iana","compressible":true,"extensions":["musd"]},"application/mods+xml":{"source":"iana","compressible":true,"extensions":["mods"]},"application/moss-keys":{"source":"iana"},"application/moss-signature":{"source":"iana"},"application/mosskey-data":{"source":"iana"},"application/mosskey-request":{"source":"iana"},"application/mp21":{"source":"iana","extensions":["m21","mp21"]},"application/mp4":{"source":"iana","extensions":["mp4s","m4p"]},"application/mpeg4-generic":{"source":"iana"},"application/mpeg4-iod":{"source":"iana"},"application/mpeg4-iod-xmt":{"source":"iana"},"application/mrb-consumer+xml":{"source":"iana","compressible":true},"application/mrb-publish+xml":{"source":"iana","compressible":true},"application/msc-ivr+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/msc-mixer+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/msword":{"source":"iana","compressible":false,"extensions":["doc","dot"]},"application/mud+json":{"source":"iana","compressible":true},"application/multipart-core":{"source":"iana"},"application/mxf":{"source":"iana","extensions":["mxf"]},"application/n-quads":{"source":"iana","extensions":["nq"]},"application/n-triples":{"source":"iana","extensions":["nt"]},"application/nasdata":{"source":"iana"},"application/news-checkgroups":{"source":"iana","charset":"US-ASCII"},"application/news-groupinfo":{"source":"iana","charset":"US-ASCII"},"application/news-transmission":{"source":"iana"},"application/nlsml+xml":{"source":"iana","compressible":true},"application/node":{"source":"iana","extensions":["cjs"]},"application/nss":{"source":"iana"},"application/oauth-authz-req+jwt":{"source":"iana"},"application/oblivious-dns-message":{"source":"iana"},"application/ocsp-request":{"source":"iana"},"application/ocsp-response":{"source":"iana"},"application/octet-stream":{"source":"iana","compressible":false,"extensions":["bin","dms","lrf","mar","so","dist","distz","pkg","bpk","dump","elc","deploy","exe","dll","deb","dmg","iso","img","msi","msp","msm","buffer"]},"application/oda":{"source":"iana","extensions":["oda"]},"application/odm+xml":{"source":"iana","compressible":true},"application/odx":{"source":"iana"},"application/oebps-package+xml":{"source":"iana","compressible":true,"extensions":["opf"]},"application/ogg":{"source":"iana","compressible":false,"extensions":["ogx"]},"application/omdoc+xml":{"source":"apache","compressible":true,"extensions":["omdoc"]},"application/onenote":{"source":"apache","extensions":["onetoc","onetoc2","onetmp","onepkg"]},"application/opc-nodeset+xml":{"source":"iana","compressible":true},"application/oscore":{"source":"iana"},"application/oxps":{"source":"iana","extensions":["oxps"]},"application/p21":{"source":"iana"},"application/p21+zip":{"source":"iana","compressible":false},"application/p2p-overlay+xml":{"source":"iana","compressible":true,"extensions":["relo"]},"application/parityfec":{"source":"iana"},"application/passport":{"source":"iana"},"application/patch-ops-error+xml":{"source":"iana","compressible":true,"extensions":["xer"]},"application/pdf":{"source":"iana","compressible":false,"extensions":["pdf"]},"application/pdx":{"source":"iana"},"application/pem-certificate-chain":{"source":"iana"},"application/pgp-encrypted":{"source":"iana","compressible":false,"extensions":["pgp"]},"application/pgp-keys":{"source":"iana","extensions":["asc"]},"application/pgp-signature":{"source":"iana","extensions":["asc","sig"]},"application/pics-rules":{"source":"apache","extensions":["prf"]},"application/pidf+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/pidf-diff+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/pkcs10":{"source":"iana","extensions":["p10"]},"application/pkcs12":{"source":"iana"},"application/pkcs7-mime":{"source":"iana","extensions":["p7m","p7c"]},"application/pkcs7-signature":{"source":"iana","extensions":["p7s"]},"application/pkcs8":{"source":"iana","extensions":["p8"]},"application/pkcs8-encrypted":{"source":"iana"},"application/pkix-attr-cert":{"source":"iana","extensions":["ac"]},"application/pkix-cert":{"source":"iana","extensions":["cer"]},"application/pkix-crl":{"source":"iana","extensions":["crl"]},"application/pkix-pkipath":{"source":"iana","extensions":["pkipath"]},"application/pkixcmp":{"source":"iana","extensions":["pki"]},"application/pls+xml":{"source":"iana","compressible":true,"extensions":["pls"]},"application/poc-settings+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/postscript":{"source":"iana","compressible":true,"extensions":["ai","eps","ps"]},"application/ppsp-tracker+json":{"source":"iana","compressible":true},"application/problem+json":{"source":"iana","compressible":true},"application/problem+xml":{"source":"iana","compressible":true},"application/provenance+xml":{"source":"iana","compressible":true,"extensions":["provx"]},"application/prs.alvestrand.titrax-sheet":{"source":"iana"},"application/prs.cww":{"source":"iana","extensions":["cww"]},"application/prs.cyn":{"source":"iana","charset":"7-BIT"},"application/prs.hpub+zip":{"source":"iana","compressible":false},"application/prs.nprend":{"source":"iana"},"application/prs.plucker":{"source":"iana"},"application/prs.rdf-xml-crypt":{"source":"iana"},"application/prs.xsf+xml":{"source":"iana","compressible":true},"application/pskc+xml":{"source":"iana","compressible":true,"extensions":["pskcxml"]},"application/pvd+json":{"source":"iana","compressible":true},"application/qsig":{"source":"iana"},"application/raml+yaml":{"compressible":true,"extensions":["raml"]},"application/raptorfec":{"source":"iana"},"application/rdap+json":{"source":"iana","compressible":true},"application/rdf+xml":{"source":"iana","compressible":true,"extensions":["rdf","owl"]},"application/reginfo+xml":{"source":"iana","compressible":true,"extensions":["rif"]},"application/relax-ng-compact-syntax":{"source":"iana","extensions":["rnc"]},"application/remote-printing":{"source":"iana"},"application/reputon+json":{"source":"iana","compressible":true},"application/resource-lists+xml":{"source":"iana","compressible":true,"extensions":["rl"]},"application/resource-lists-diff+xml":{"source":"iana","compressible":true,"extensions":["rld"]},"application/rfc+xml":{"source":"iana","compressible":true},"application/riscos":{"source":"iana"},"application/rlmi+xml":{"source":"iana","compressible":true},"application/rls-services+xml":{"source":"iana","compressible":true,"extensions":["rs"]},"application/route-apd+xml":{"source":"iana","compressible":true,"extensions":["rapd"]},"application/route-s-tsid+xml":{"source":"iana","compressible":true,"extensions":["sls"]},"application/route-usd+xml":{"source":"iana","compressible":true,"extensions":["rusd"]},"application/rpki-ghostbusters":{"source":"iana","extensions":["gbr"]},"application/rpki-manifest":{"source":"iana","extensions":["mft"]},"application/rpki-publication":{"source":"iana"},"application/rpki-roa":{"source":"iana","extensions":["roa"]},"application/rpki-updown":{"source":"iana"},"application/rsd+xml":{"source":"apache","compressible":true,"extensions":["rsd"]},"application/rss+xml":{"source":"apache","compressible":true,"extensions":["rss"]},"application/rtf":{"source":"iana","compressible":true,"extensions":["rtf"]},"application/rtploopback":{"source":"iana"},"application/rtx":{"source":"iana"},"application/samlassertion+xml":{"source":"iana","compressible":true},"application/samlmetadata+xml":{"source":"iana","compressible":true},"application/sarif+json":{"source":"iana","compressible":true},"application/sarif-external-properties+json":{"source":"iana","compressible":true},"application/sbe":{"source":"iana"},"application/sbml+xml":{"source":"iana","compressible":true,"extensions":["sbml"]},"application/scaip+xml":{"source":"iana","compressible":true},"application/scim+json":{"source":"iana","compressible":true},"application/scvp-cv-request":{"source":"iana","extensions":["scq"]},"application/scvp-cv-response":{"source":"iana","extensions":["scs"]},"application/scvp-vp-request":{"source":"iana","extensions":["spq"]},"application/scvp-vp-response":{"source":"iana","extensions":["spp"]},"application/sdp":{"source":"iana","extensions":["sdp"]},"application/secevent+jwt":{"source":"iana"},"application/senml+cbor":{"source":"iana"},"application/senml+json":{"source":"iana","compressible":true},"application/senml+xml":{"source":"iana","compressible":true,"extensions":["senmlx"]},"application/senml-etch+cbor":{"source":"iana"},"application/senml-etch+json":{"source":"iana","compressible":true},"application/senml-exi":{"source":"iana"},"application/sensml+cbor":{"source":"iana"},"application/sensml+json":{"source":"iana","compressible":true},"application/sensml+xml":{"source":"iana","compressible":true,"extensions":["sensmlx"]},"application/sensml-exi":{"source":"iana"},"application/sep+xml":{"source":"iana","compressible":true},"application/sep-exi":{"source":"iana"},"application/session-info":{"source":"iana"},"application/set-payment":{"source":"iana"},"application/set-payment-initiation":{"source":"iana","extensions":["setpay"]},"application/set-registration":{"source":"iana"},"application/set-registration-initiation":{"source":"iana","extensions":["setreg"]},"application/sgml":{"source":"iana"},"application/sgml-open-catalog":{"source":"iana"},"application/shf+xml":{"source":"iana","compressible":true,"extensions":["shf"]},"application/sieve":{"source":"iana","extensions":["siv","sieve"]},"application/simple-filter+xml":{"source":"iana","compressible":true},"application/simple-message-summary":{"source":"iana"},"application/simplesymbolcontainer":{"source":"iana"},"application/sipc":{"source":"iana"},"application/slate":{"source":"iana"},"application/smil":{"source":"iana"},"application/smil+xml":{"source":"iana","compressible":true,"extensions":["smi","smil"]},"application/smpte336m":{"source":"iana"},"application/soap+fastinfoset":{"source":"iana"},"application/soap+xml":{"source":"iana","compressible":true},"application/sparql-query":{"source":"iana","extensions":["rq"]},"application/sparql-results+xml":{"source":"iana","compressible":true,"extensions":["srx"]},"application/spdx+json":{"source":"iana","compressible":true},"application/spirits-event+xml":{"source":"iana","compressible":true},"application/sql":{"source":"iana"},"application/srgs":{"source":"iana","extensions":["gram"]},"application/srgs+xml":{"source":"iana","compressible":true,"extensions":["grxml"]},"application/sru+xml":{"source":"iana","compressible":true,"extensions":["sru"]},"application/ssdl+xml":{"source":"apache","compressible":true,"extensions":["ssdl"]},"application/ssml+xml":{"source":"iana","compressible":true,"extensions":["ssml"]},"application/stix+json":{"source":"iana","compressible":true},"application/swid+xml":{"source":"iana","compressible":true,"extensions":["swidtag"]},"application/tamp-apex-update":{"source":"iana"},"application/tamp-apex-update-confirm":{"source":"iana"},"application/tamp-community-update":{"source":"iana"},"application/tamp-community-update-confirm":{"source":"iana"},"application/tamp-error":{"source":"iana"},"application/tamp-sequence-adjust":{"source":"iana"},"application/tamp-sequence-adjust-confirm":{"source":"iana"},"application/tamp-status-query":{"source":"iana"},"application/tamp-status-response":{"source":"iana"},"application/tamp-update":{"source":"iana"},"application/tamp-update-confirm":{"source":"iana"},"application/tar":{"compressible":true},"application/taxii+json":{"source":"iana","compressible":true},"application/td+json":{"source":"iana","compressible":true},"application/tei+xml":{"source":"iana","compressible":true,"extensions":["tei","teicorpus"]},"application/tetra_isi":{"source":"iana"},"application/thraud+xml":{"source":"iana","compressible":true,"extensions":["tfi"]},"application/timestamp-query":{"source":"iana"},"application/timestamp-reply":{"source":"iana"},"application/timestamped-data":{"source":"iana","extensions":["tsd"]},"application/tlsrpt+gzip":{"source":"iana"},"application/tlsrpt+json":{"source":"iana","compressible":true},"application/tnauthlist":{"source":"iana"},"application/token-introspection+jwt":{"source":"iana"},"application/toml":{"compressible":true,"extensions":["toml"]},"application/trickle-ice-sdpfrag":{"source":"iana"},"application/trig":{"source":"iana","extensions":["trig"]},"application/ttml+xml":{"source":"iana","compressible":true,"extensions":["ttml"]},"application/tve-trigger":{"source":"iana"},"application/tzif":{"source":"iana"},"application/tzif-leap":{"source":"iana"},"application/ubjson":{"compressible":false,"extensions":["ubj"]},"application/ulpfec":{"source":"iana"},"application/urc-grpsheet+xml":{"source":"iana","compressible":true},"application/urc-ressheet+xml":{"source":"iana","compressible":true,"extensions":["rsheet"]},"application/urc-targetdesc+xml":{"source":"iana","compressible":true,"extensions":["td"]},"application/urc-uisocketdesc+xml":{"source":"iana","compressible":true},"application/vcard+json":{"source":"iana","compressible":true},"application/vcard+xml":{"source":"iana","compressible":true},"application/vemmi":{"source":"iana"},"application/vividence.scriptfile":{"source":"apache"},"application/vnd.1000minds.decision-model+xml":{"source":"iana","compressible":true,"extensions":["1km"]},"application/vnd.3gpp-prose+xml":{"source":"iana","compressible":true},"application/vnd.3gpp-prose-pc3ch+xml":{"source":"iana","compressible":true},"application/vnd.3gpp-v2x-local-service-information":{"source":"iana"},"application/vnd.3gpp.5gnas":{"source":"iana"},"application/vnd.3gpp.access-transfer-events+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.bsf+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.gmop+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.gtpc":{"source":"iana"},"application/vnd.3gpp.interworking-data":{"source":"iana"},"application/vnd.3gpp.lpp":{"source":"iana"},"application/vnd.3gpp.mc-signalling-ear":{"source":"iana"},"application/vnd.3gpp.mcdata-affiliation-command+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcdata-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcdata-payload":{"source":"iana"},"application/vnd.3gpp.mcdata-service-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcdata-signalling":{"source":"iana"},"application/vnd.3gpp.mcdata-ue-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcdata-user-profile+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-affiliation-command+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-floor-request+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-location-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-mbms-usage-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-service-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-signed+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-ue-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-ue-init-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-user-profile+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-affiliation-command+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-affiliation-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-location-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-mbms-usage-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-service-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-transmission-request+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-ue-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-user-profile+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mid-call+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.ngap":{"source":"iana"},"application/vnd.3gpp.pfcp":{"source":"iana"},"application/vnd.3gpp.pic-bw-large":{"source":"iana","extensions":["plb"]},"application/vnd.3gpp.pic-bw-small":{"source":"iana","extensions":["psb"]},"application/vnd.3gpp.pic-bw-var":{"source":"iana","extensions":["pvb"]},"application/vnd.3gpp.s1ap":{"source":"iana"},"application/vnd.3gpp.sms":{"source":"iana"},"application/vnd.3gpp.sms+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.srvcc-ext+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.srvcc-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.state-and-event-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.ussd+xml":{"source":"iana","compressible":true},"application/vnd.3gpp2.bcmcsinfo+xml":{"source":"iana","compressible":true},"application/vnd.3gpp2.sms":{"source":"iana"},"application/vnd.3gpp2.tcap":{"source":"iana","extensions":["tcap"]},"application/vnd.3lightssoftware.imagescal":{"source":"iana"},"application/vnd.3m.post-it-notes":{"source":"iana","extensions":["pwn"]},"application/vnd.accpac.simply.aso":{"source":"iana","extensions":["aso"]},"application/vnd.accpac.simply.imp":{"source":"iana","extensions":["imp"]},"application/vnd.acucobol":{"source":"iana","extensions":["acu"]},"application/vnd.acucorp":{"source":"iana","extensions":["atc","acutc"]},"application/vnd.adobe.air-application-installer-package+zip":{"source":"apache","compressible":false,"extensions":["air"]},"application/vnd.adobe.flash.movie":{"source":"iana"},"application/vnd.adobe.formscentral.fcdt":{"source":"iana","extensions":["fcdt"]},"application/vnd.adobe.fxp":{"source":"iana","extensions":["fxp","fxpl"]},"application/vnd.adobe.partial-upload":{"source":"iana"},"application/vnd.adobe.xdp+xml":{"source":"iana","compressible":true,"extensions":["xdp"]},"application/vnd.adobe.xfdf":{"source":"iana","extensions":["xfdf"]},"application/vnd.aether.imp":{"source":"iana"},"application/vnd.afpc.afplinedata":{"source":"iana"},"application/vnd.afpc.afplinedata-pagedef":{"source":"iana"},"application/vnd.afpc.cmoca-cmresource":{"source":"iana"},"application/vnd.afpc.foca-charset":{"source":"iana"},"application/vnd.afpc.foca-codedfont":{"source":"iana"},"application/vnd.afpc.foca-codepage":{"source":"iana"},"application/vnd.afpc.modca":{"source":"iana"},"application/vnd.afpc.modca-cmtable":{"source":"iana"},"application/vnd.afpc.modca-formdef":{"source":"iana"},"application/vnd.afpc.modca-mediummap":{"source":"iana"},"application/vnd.afpc.modca-objectcontainer":{"source":"iana"},"application/vnd.afpc.modca-overlay":{"source":"iana"},"application/vnd.afpc.modca-pagesegment":{"source":"iana"},"application/vnd.age":{"source":"iana","extensions":["age"]},"application/vnd.ah-barcode":{"source":"iana"},"application/vnd.ahead.space":{"source":"iana","extensions":["ahead"]},"application/vnd.airzip.filesecure.azf":{"source":"iana","extensions":["azf"]},"application/vnd.airzip.filesecure.azs":{"source":"iana","extensions":["azs"]},"application/vnd.amadeus+json":{"source":"iana","compressible":true},"application/vnd.amazon.ebook":{"source":"apache","extensions":["azw"]},"application/vnd.amazon.mobi8-ebook":{"source":"iana"},"application/vnd.americandynamics.acc":{"source":"iana","extensions":["acc"]},"application/vnd.amiga.ami":{"source":"iana","extensions":["ami"]},"application/vnd.amundsen.maze+xml":{"source":"iana","compressible":true},"application/vnd.android.ota":{"source":"iana"},"application/vnd.android.package-archive":{"source":"apache","compressible":false,"extensions":["apk"]},"application/vnd.anki":{"source":"iana"},"application/vnd.anser-web-certificate-issue-initiation":{"source":"iana","extensions":["cii"]},"application/vnd.anser-web-funds-transfer-initiation":{"source":"apache","extensions":["fti"]},"application/vnd.antix.game-component":{"source":"iana","extensions":["atx"]},"application/vnd.apache.arrow.file":{"source":"iana"},"application/vnd.apache.arrow.stream":{"source":"iana"},"application/vnd.apache.thrift.binary":{"source":"iana"},"application/vnd.apache.thrift.compact":{"source":"iana"},"application/vnd.apache.thrift.json":{"source":"iana"},"application/vnd.api+json":{"source":"iana","compressible":true},"application/vnd.aplextor.warrp+json":{"source":"iana","compressible":true},"application/vnd.apothekende.reservation+json":{"source":"iana","compressible":true},"application/vnd.apple.installer+xml":{"source":"iana","compressible":true,"extensions":["mpkg"]},"application/vnd.apple.keynote":{"source":"iana","extensions":["key"]},"application/vnd.apple.mpegurl":{"source":"iana","extensions":["m3u8"]},"application/vnd.apple.numbers":{"source":"iana","extensions":["numbers"]},"application/vnd.apple.pages":{"source":"iana","extensions":["pages"]},"application/vnd.apple.pkpass":{"compressible":false,"extensions":["pkpass"]},"application/vnd.arastra.swi":{"source":"iana"},"application/vnd.aristanetworks.swi":{"source":"iana","extensions":["swi"]},"application/vnd.artisan+json":{"source":"iana","compressible":true},"application/vnd.artsquare":{"source":"iana"},"application/vnd.astraea-software.iota":{"source":"iana","extensions":["iota"]},"application/vnd.audiograph":{"source":"iana","extensions":["aep"]},"application/vnd.autopackage":{"source":"iana"},"application/vnd.avalon+json":{"source":"iana","compressible":true},"application/vnd.avistar+xml":{"source":"iana","compressible":true},"application/vnd.balsamiq.bmml+xml":{"source":"iana","compressible":true,"extensions":["bmml"]},"application/vnd.balsamiq.bmpr":{"source":"iana"},"application/vnd.banana-accounting":{"source":"iana"},"application/vnd.bbf.usp.error":{"source":"iana"},"application/vnd.bbf.usp.msg":{"source":"iana"},"application/vnd.bbf.usp.msg+json":{"source":"iana","compressible":true},"application/vnd.bekitzur-stech+json":{"source":"iana","compressible":true},"application/vnd.bint.med-content":{"source":"iana"},"application/vnd.biopax.rdf+xml":{"source":"iana","compressible":true},"application/vnd.blink-idb-value-wrapper":{"source":"iana"},"application/vnd.blueice.multipass":{"source":"iana","extensions":["mpm"]},"application/vnd.bluetooth.ep.oob":{"source":"iana"},"application/vnd.bluetooth.le.oob":{"source":"iana"},"application/vnd.bmi":{"source":"iana","extensions":["bmi"]},"application/vnd.bpf":{"source":"iana"},"application/vnd.bpf3":{"source":"iana"},"application/vnd.businessobjects":{"source":"iana","extensions":["rep"]},"application/vnd.byu.uapi+json":{"source":"iana","compressible":true},"application/vnd.cab-jscript":{"source":"iana"},"application/vnd.canon-cpdl":{"source":"iana"},"application/vnd.canon-lips":{"source":"iana"},"application/vnd.capasystems-pg+json":{"source":"iana","compressible":true},"application/vnd.cendio.thinlinc.clientconf":{"source":"iana"},"application/vnd.century-systems.tcp_stream":{"source":"iana"},"application/vnd.chemdraw+xml":{"source":"iana","compressible":true,"extensions":["cdxml"]},"application/vnd.chess-pgn":{"source":"iana"},"application/vnd.chipnuts.karaoke-mmd":{"source":"iana","extensions":["mmd"]},"application/vnd.ciedi":{"source":"iana"},"application/vnd.cinderella":{"source":"iana","extensions":["cdy"]},"application/vnd.cirpack.isdn-ext":{"source":"iana"},"application/vnd.citationstyles.style+xml":{"source":"iana","compressible":true,"extensions":["csl"]},"application/vnd.claymore":{"source":"iana","extensions":["cla"]},"application/vnd.cloanto.rp9":{"source":"iana","extensions":["rp9"]},"application/vnd.clonk.c4group":{"source":"iana","extensions":["c4g","c4d","c4f","c4p","c4u"]},"application/vnd.cluetrust.cartomobile-config":{"source":"iana","extensions":["c11amc"]},"application/vnd.cluetrust.cartomobile-config-pkg":{"source":"iana","extensions":["c11amz"]},"application/vnd.coffeescript":{"source":"iana"},"application/vnd.collabio.xodocuments.document":{"source":"iana"},"application/vnd.collabio.xodocuments.document-template":{"source":"iana"},"application/vnd.collabio.xodocuments.presentation":{"source":"iana"},"application/vnd.collabio.xodocuments.presentation-template":{"source":"iana"},"application/vnd.collabio.xodocuments.spreadsheet":{"source":"iana"},"application/vnd.collabio.xodocuments.spreadsheet-template":{"source":"iana"},"application/vnd.collection+json":{"source":"iana","compressible":true},"application/vnd.collection.doc+json":{"source":"iana","compressible":true},"application/vnd.collection.next+json":{"source":"iana","compressible":true},"application/vnd.comicbook+zip":{"source":"iana","compressible":false},"application/vnd.comicbook-rar":{"source":"iana"},"application/vnd.commerce-battelle":{"source":"iana"},"application/vnd.commonspace":{"source":"iana","extensions":["csp"]},"application/vnd.contact.cmsg":{"source":"iana","extensions":["cdbcmsg"]},"application/vnd.coreos.ignition+json":{"source":"iana","compressible":true},"application/vnd.cosmocaller":{"source":"iana","extensions":["cmc"]},"application/vnd.crick.clicker":{"source":"iana","extensions":["clkx"]},"application/vnd.crick.clicker.keyboard":{"source":"iana","extensions":["clkk"]},"application/vnd.crick.clicker.palette":{"source":"iana","extensions":["clkp"]},"application/vnd.crick.clicker.template":{"source":"iana","extensions":["clkt"]},"application/vnd.crick.clicker.wordbank":{"source":"iana","extensions":["clkw"]},"application/vnd.criticaltools.wbs+xml":{"source":"iana","compressible":true,"extensions":["wbs"]},"application/vnd.cryptii.pipe+json":{"source":"iana","compressible":true},"application/vnd.crypto-shade-file":{"source":"iana"},"application/vnd.cryptomator.encrypted":{"source":"iana"},"application/vnd.cryptomator.vault":{"source":"iana"},"application/vnd.ctc-posml":{"source":"iana","extensions":["pml"]},"application/vnd.ctct.ws+xml":{"source":"iana","compressible":true},"application/vnd.cups-pdf":{"source":"iana"},"application/vnd.cups-postscript":{"source":"iana"},"application/vnd.cups-ppd":{"source":"iana","extensions":["ppd"]},"application/vnd.cups-raster":{"source":"iana"},"application/vnd.cups-raw":{"source":"iana"},"application/vnd.curl":{"source":"iana"},"application/vnd.curl.car":{"source":"apache","extensions":["car"]},"application/vnd.curl.pcurl":{"source":"apache","extensions":["pcurl"]},"application/vnd.cyan.dean.root+xml":{"source":"iana","compressible":true},"application/vnd.cybank":{"source":"iana"},"application/vnd.cyclonedx+json":{"source":"iana","compressible":true},"application/vnd.cyclonedx+xml":{"source":"iana","compressible":true},"application/vnd.d2l.coursepackage1p0+zip":{"source":"iana","compressible":false},"application/vnd.d3m-dataset":{"source":"iana"},"application/vnd.d3m-problem":{"source":"iana"},"application/vnd.dart":{"source":"iana","compressible":true,"extensions":["dart"]},"application/vnd.data-vision.rdz":{"source":"iana","extensions":["rdz"]},"application/vnd.datapackage+json":{"source":"iana","compressible":true},"application/vnd.dataresource+json":{"source":"iana","compressible":true},"application/vnd.dbf":{"source":"iana","extensions":["dbf"]},"application/vnd.debian.binary-package":{"source":"iana"},"application/vnd.dece.data":{"source":"iana","extensions":["uvf","uvvf","uvd","uvvd"]},"application/vnd.dece.ttml+xml":{"source":"iana","compressible":true,"extensions":["uvt","uvvt"]},"application/vnd.dece.unspecified":{"source":"iana","extensions":["uvx","uvvx"]},"application/vnd.dece.zip":{"source":"iana","extensions":["uvz","uvvz"]},"application/vnd.denovo.fcselayout-link":{"source":"iana","extensions":["fe_launch"]},"application/vnd.desmume.movie":{"source":"iana"},"application/vnd.dir-bi.plate-dl-nosuffix":{"source":"iana"},"application/vnd.dm.delegation+xml":{"source":"iana","compressible":true},"application/vnd.dna":{"source":"iana","extensions":["dna"]},"application/vnd.document+json":{"source":"iana","compressible":true},"application/vnd.dolby.mlp":{"source":"apache","extensions":["mlp"]},"application/vnd.dolby.mobile.1":{"source":"iana"},"application/vnd.dolby.mobile.2":{"source":"iana"},"application/vnd.doremir.scorecloud-binary-document":{"source":"iana"},"application/vnd.dpgraph":{"source":"iana","extensions":["dpg"]},"application/vnd.dreamfactory":{"source":"iana","extensions":["dfac"]},"application/vnd.drive+json":{"source":"iana","compressible":true},"application/vnd.ds-keypoint":{"source":"apache","extensions":["kpxx"]},"application/vnd.dtg.local":{"source":"iana"},"application/vnd.dtg.local.flash":{"source":"iana"},"application/vnd.dtg.local.html":{"source":"iana"},"application/vnd.dvb.ait":{"source":"iana","extensions":["ait"]},"application/vnd.dvb.dvbisl+xml":{"source":"iana","compressible":true},"application/vnd.dvb.dvbj":{"source":"iana"},"application/vnd.dvb.esgcontainer":{"source":"iana"},"application/vnd.dvb.ipdcdftnotifaccess":{"source":"iana"},"application/vnd.dvb.ipdcesgaccess":{"source":"iana"},"application/vnd.dvb.ipdcesgaccess2":{"source":"iana"},"application/vnd.dvb.ipdcesgpdd":{"source":"iana"},"application/vnd.dvb.ipdcroaming":{"source":"iana"},"application/vnd.dvb.iptv.alfec-base":{"source":"iana"},"application/vnd.dvb.iptv.alfec-enhancement":{"source":"iana"},"application/vnd.dvb.notif-aggregate-root+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-container+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-generic+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-ia-msglist+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-ia-registration-request+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-ia-registration-response+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-init+xml":{"source":"iana","compressible":true},"application/vnd.dvb.pfr":{"source":"iana"},"application/vnd.dvb.service":{"source":"iana","extensions":["svc"]},"application/vnd.dxr":{"source":"iana"},"application/vnd.dynageo":{"source":"iana","extensions":["geo"]},"application/vnd.dzr":{"source":"iana"},"application/vnd.easykaraoke.cdgdownload":{"source":"iana"},"application/vnd.ecdis-update":{"source":"iana"},"application/vnd.ecip.rlp":{"source":"iana"},"application/vnd.eclipse.ditto+json":{"source":"iana","compressible":true},"application/vnd.ecowin.chart":{"source":"iana","extensions":["mag"]},"application/vnd.ecowin.filerequest":{"source":"iana"},"application/vnd.ecowin.fileupdate":{"source":"iana"},"application/vnd.ecowin.series":{"source":"iana"},"application/vnd.ecowin.seriesrequest":{"source":"iana"},"application/vnd.ecowin.seriesupdate":{"source":"iana"},"application/vnd.efi.img":{"source":"iana"},"application/vnd.efi.iso":{"source":"iana"},"application/vnd.emclient.accessrequest+xml":{"source":"iana","compressible":true},"application/vnd.enliven":{"source":"iana","extensions":["nml"]},"application/vnd.enphase.envoy":{"source":"iana"},"application/vnd.eprints.data+xml":{"source":"iana","compressible":true},"application/vnd.epson.esf":{"source":"iana","extensions":["esf"]},"application/vnd.epson.msf":{"source":"iana","extensions":["msf"]},"application/vnd.epson.quickanime":{"source":"iana","extensions":["qam"]},"application/vnd.epson.salt":{"source":"iana","extensions":["slt"]},"application/vnd.epson.ssf":{"source":"iana","extensions":["ssf"]},"application/vnd.ericsson.quickcall":{"source":"iana"},"application/vnd.espass-espass+zip":{"source":"iana","compressible":false},"application/vnd.eszigno3+xml":{"source":"iana","compressible":true,"extensions":["es3","et3"]},"application/vnd.etsi.aoc+xml":{"source":"iana","compressible":true},"application/vnd.etsi.asic-e+zip":{"source":"iana","compressible":false},"application/vnd.etsi.asic-s+zip":{"source":"iana","compressible":false},"application/vnd.etsi.cug+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvcommand+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvdiscovery+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvprofile+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvsad-bc+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvsad-cod+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvsad-npvr+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvservice+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvsync+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvueprofile+xml":{"source":"iana","compressible":true},"application/vnd.etsi.mcid+xml":{"source":"iana","compressible":true},"application/vnd.etsi.mheg5":{"source":"iana"},"application/vnd.etsi.overload-control-policy-dataset+xml":{"source":"iana","compressible":true},"application/vnd.etsi.pstn+xml":{"source":"iana","compressible":true},"application/vnd.etsi.sci+xml":{"source":"iana","compressible":true},"application/vnd.etsi.simservs+xml":{"source":"iana","compressible":true},"application/vnd.etsi.timestamp-token":{"source":"iana"},"application/vnd.etsi.tsl+xml":{"source":"iana","compressible":true},"application/vnd.etsi.tsl.der":{"source":"iana"},"application/vnd.eu.kasparian.car+json":{"source":"iana","compressible":true},"application/vnd.eudora.data":{"source":"iana"},"application/vnd.evolv.ecig.profile":{"source":"iana"},"application/vnd.evolv.ecig.settings":{"source":"iana"},"application/vnd.evolv.ecig.theme":{"source":"iana"},"application/vnd.exstream-empower+zip":{"source":"iana","compressible":false},"application/vnd.exstream-package":{"source":"iana"},"application/vnd.ezpix-album":{"source":"iana","extensions":["ez2"]},"application/vnd.ezpix-package":{"source":"iana","extensions":["ez3"]},"application/vnd.f-secure.mobile":{"source":"iana"},"application/vnd.familysearch.gedcom+zip":{"source":"iana","compressible":false},"application/vnd.fastcopy-disk-image":{"source":"iana"},"application/vnd.fdf":{"source":"iana","extensions":["fdf"]},"application/vnd.fdsn.mseed":{"source":"iana","extensions":["mseed"]},"application/vnd.fdsn.seed":{"source":"iana","extensions":["seed","dataless"]},"application/vnd.ffsns":{"source":"iana"},"application/vnd.ficlab.flb+zip":{"source":"iana","compressible":false},"application/vnd.filmit.zfc":{"source":"iana"},"application/vnd.fints":{"source":"iana"},"application/vnd.firemonkeys.cloudcell":{"source":"iana"},"application/vnd.flographit":{"source":"iana","extensions":["gph"]},"application/vnd.fluxtime.clip":{"source":"iana","extensions":["ftc"]},"application/vnd.font-fontforge-sfd":{"source":"iana"},"application/vnd.framemaker":{"source":"iana","extensions":["fm","frame","maker","book"]},"application/vnd.frogans.fnc":{"source":"iana","extensions":["fnc"]},"application/vnd.frogans.ltf":{"source":"iana","extensions":["ltf"]},"application/vnd.fsc.weblaunch":{"source":"iana","extensions":["fsc"]},"application/vnd.fujifilm.fb.docuworks":{"source":"iana"},"application/vnd.fujifilm.fb.docuworks.binder":{"source":"iana"},"application/vnd.fujifilm.fb.docuworks.container":{"source":"iana"},"application/vnd.fujifilm.fb.jfi+xml":{"source":"iana","compressible":true},"application/vnd.fujitsu.oasys":{"source":"iana","extensions":["oas"]},"application/vnd.fujitsu.oasys2":{"source":"iana","extensions":["oa2"]},"application/vnd.fujitsu.oasys3":{"source":"iana","extensions":["oa3"]},"application/vnd.fujitsu.oasysgp":{"source":"iana","extensions":["fg5"]},"application/vnd.fujitsu.oasysprs":{"source":"iana","extensions":["bh2"]},"application/vnd.fujixerox.art-ex":{"source":"iana"},"application/vnd.fujixerox.art4":{"source":"iana"},"application/vnd.fujixerox.ddd":{"source":"iana","extensions":["ddd"]},"application/vnd.fujixerox.docuworks":{"source":"iana","extensions":["xdw"]},"application/vnd.fujixerox.docuworks.binder":{"source":"iana","extensions":["xbd"]},"application/vnd.fujixerox.docuworks.container":{"source":"iana"},"application/vnd.fujixerox.hbpl":{"source":"iana"},"application/vnd.fut-misnet":{"source":"iana"},"application/vnd.futoin+cbor":{"source":"iana"},"application/vnd.futoin+json":{"source":"iana","compressible":true},"application/vnd.fuzzysheet":{"source":"iana","extensions":["fzs"]},"application/vnd.genomatix.tuxedo":{"source":"iana","extensions":["txd"]},"application/vnd.gentics.grd+json":{"source":"iana","compressible":true},"application/vnd.geo+json":{"source":"iana","compressible":true},"application/vnd.geocube+xml":{"source":"iana","compressible":true},"application/vnd.geogebra.file":{"source":"iana","extensions":["ggb"]},"application/vnd.geogebra.slides":{"source":"iana"},"application/vnd.geogebra.tool":{"source":"iana","extensions":["ggt"]},"application/vnd.geometry-explorer":{"source":"iana","extensions":["gex","gre"]},"application/vnd.geonext":{"source":"iana","extensions":["gxt"]},"application/vnd.geoplan":{"source":"iana","extensions":["g2w"]},"application/vnd.geospace":{"source":"iana","extensions":["g3w"]},"application/vnd.gerber":{"source":"iana"},"application/vnd.globalplatform.card-content-mgt":{"source":"iana"},"application/vnd.globalplatform.card-content-mgt-response":{"source":"iana"},"application/vnd.gmx":{"source":"iana","extensions":["gmx"]},"application/vnd.google-apps.document":{"compressible":false,"extensions":["gdoc"]},"application/vnd.google-apps.presentation":{"compressible":false,"extensions":["gslides"]},"application/vnd.google-apps.spreadsheet":{"compressible":false,"extensions":["gsheet"]},"application/vnd.google-earth.kml+xml":{"source":"iana","compressible":true,"extensions":["kml"]},"application/vnd.google-earth.kmz":{"source":"iana","compressible":false,"extensions":["kmz"]},"application/vnd.gov.sk.e-form+xml":{"source":"iana","compressible":true},"application/vnd.gov.sk.e-form+zip":{"source":"iana","compressible":false},"application/vnd.gov.sk.xmldatacontainer+xml":{"source":"iana","compressible":true},"application/vnd.grafeq":{"source":"iana","extensions":["gqf","gqs"]},"application/vnd.gridmp":{"source":"iana"},"application/vnd.groove-account":{"source":"iana","extensions":["gac"]},"application/vnd.groove-help":{"source":"iana","extensions":["ghf"]},"application/vnd.groove-identity-message":{"source":"iana","extensions":["gim"]},"application/vnd.groove-injector":{"source":"iana","extensions":["grv"]},"application/vnd.groove-tool-message":{"source":"iana","extensions":["gtm"]},"application/vnd.groove-tool-template":{"source":"iana","extensions":["tpl"]},"application/vnd.groove-vcard":{"source":"iana","extensions":["vcg"]},"application/vnd.hal+json":{"source":"iana","compressible":true},"application/vnd.hal+xml":{"source":"iana","compressible":true,"extensions":["hal"]},"application/vnd.handheld-entertainment+xml":{"source":"iana","compressible":true,"extensions":["zmm"]},"application/vnd.hbci":{"source":"iana","extensions":["hbci"]},"application/vnd.hc+json":{"source":"iana","compressible":true},"application/vnd.hcl-bireports":{"source":"iana"},"application/vnd.hdt":{"source":"iana"},"application/vnd.heroku+json":{"source":"iana","compressible":true},"application/vnd.hhe.lesson-player":{"source":"iana","extensions":["les"]},"application/vnd.hl7cda+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/vnd.hl7v2+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/vnd.hp-hpgl":{"source":"iana","extensions":["hpgl"]},"application/vnd.hp-hpid":{"source":"iana","extensions":["hpid"]},"application/vnd.hp-hps":{"source":"iana","extensions":["hps"]},"application/vnd.hp-jlyt":{"source":"iana","extensions":["jlt"]},"application/vnd.hp-pcl":{"source":"iana","extensions":["pcl"]},"application/vnd.hp-pclxl":{"source":"iana","extensions":["pclxl"]},"application/vnd.httphone":{"source":"iana"},"application/vnd.hydrostatix.sof-data":{"source":"iana","extensions":["sfd-hdstx"]},"application/vnd.hyper+json":{"source":"iana","compressible":true},"application/vnd.hyper-item+json":{"source":"iana","compressible":true},"application/vnd.hyperdrive+json":{"source":"iana","compressible":true},"application/vnd.hzn-3d-crossword":{"source":"iana"},"application/vnd.ibm.afplinedata":{"source":"iana"},"application/vnd.ibm.electronic-media":{"source":"iana"},"application/vnd.ibm.minipay":{"source":"iana","extensions":["mpy"]},"application/vnd.ibm.modcap":{"source":"iana","extensions":["afp","listafp","list3820"]},"application/vnd.ibm.rights-management":{"source":"iana","extensions":["irm"]},"application/vnd.ibm.secure-container":{"source":"iana","extensions":["sc"]},"application/vnd.iccprofile":{"source":"iana","extensions":["icc","icm"]},"application/vnd.ieee.1905":{"source":"iana"},"application/vnd.igloader":{"source":"iana","extensions":["igl"]},"application/vnd.imagemeter.folder+zip":{"source":"iana","compressible":false},"application/vnd.imagemeter.image+zip":{"source":"iana","compressible":false},"application/vnd.immervision-ivp":{"source":"iana","extensions":["ivp"]},"application/vnd.immervision-ivu":{"source":"iana","extensions":["ivu"]},"application/vnd.ims.imsccv1p1":{"source":"iana"},"application/vnd.ims.imsccv1p2":{"source":"iana"},"application/vnd.ims.imsccv1p3":{"source":"iana"},"application/vnd.ims.lis.v2.result+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolconsumerprofile+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolproxy+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolproxy.id+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolsettings+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolsettings.simple+json":{"source":"iana","compressible":true},"application/vnd.informedcontrol.rms+xml":{"source":"iana","compressible":true},"application/vnd.informix-visionary":{"source":"iana"},"application/vnd.infotech.project":{"source":"iana"},"application/vnd.infotech.project+xml":{"source":"iana","compressible":true},"application/vnd.innopath.wamp.notification":{"source":"iana"},"application/vnd.insors.igm":{"source":"iana","extensions":["igm"]},"application/vnd.intercon.formnet":{"source":"iana","extensions":["xpw","xpx"]},"application/vnd.intergeo":{"source":"iana","extensions":["i2g"]},"application/vnd.intertrust.digibox":{"source":"iana"},"application/vnd.intertrust.nncp":{"source":"iana"},"application/vnd.intu.qbo":{"source":"iana","extensions":["qbo"]},"application/vnd.intu.qfx":{"source":"iana","extensions":["qfx"]},"application/vnd.iptc.g2.catalogitem+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.conceptitem+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.knowledgeitem+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.newsitem+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.newsmessage+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.packageitem+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.planningitem+xml":{"source":"iana","compressible":true},"application/vnd.ipunplugged.rcprofile":{"source":"iana","extensions":["rcprofile"]},"application/vnd.irepository.package+xml":{"source":"iana","compressible":true,"extensions":["irp"]},"application/vnd.is-xpr":{"source":"iana","extensions":["xpr"]},"application/vnd.isac.fcs":{"source":"iana","extensions":["fcs"]},"application/vnd.iso11783-10+zip":{"source":"iana","compressible":false},"application/vnd.jam":{"source":"iana","extensions":["jam"]},"application/vnd.japannet-directory-service":{"source":"iana"},"application/vnd.japannet-jpnstore-wakeup":{"source":"iana"},"application/vnd.japannet-payment-wakeup":{"source":"iana"},"application/vnd.japannet-registration":{"source":"iana"},"application/vnd.japannet-registration-wakeup":{"source":"iana"},"application/vnd.japannet-setstore-wakeup":{"source":"iana"},"application/vnd.japannet-verification":{"source":"iana"},"application/vnd.japannet-verification-wakeup":{"source":"iana"},"application/vnd.jcp.javame.midlet-rms":{"source":"iana","extensions":["rms"]},"application/vnd.jisp":{"source":"iana","extensions":["jisp"]},"application/vnd.joost.joda-archive":{"source":"iana","extensions":["joda"]},"application/vnd.jsk.isdn-ngn":{"source":"iana"},"application/vnd.kahootz":{"source":"iana","extensions":["ktz","ktr"]},"application/vnd.kde.karbon":{"source":"iana","extensions":["karbon"]},"application/vnd.kde.kchart":{"source":"iana","extensions":["chrt"]},"application/vnd.kde.kformula":{"source":"iana","extensions":["kfo"]},"application/vnd.kde.kivio":{"source":"iana","extensions":["flw"]},"application/vnd.kde.kontour":{"source":"iana","extensions":["kon"]},"application/vnd.kde.kpresenter":{"source":"iana","extensions":["kpr","kpt"]},"application/vnd.kde.kspread":{"source":"iana","extensions":["ksp"]},"application/vnd.kde.kword":{"source":"iana","extensions":["kwd","kwt"]},"application/vnd.kenameaapp":{"source":"iana","extensions":["htke"]},"application/vnd.kidspiration":{"source":"iana","extensions":["kia"]},"application/vnd.kinar":{"source":"iana","extensions":["kne","knp"]},"application/vnd.koan":{"source":"iana","extensions":["skp","skd","skt","skm"]},"application/vnd.kodak-descriptor":{"source":"iana","extensions":["sse"]},"application/vnd.las":{"source":"iana"},"application/vnd.las.las+json":{"source":"iana","compressible":true},"application/vnd.las.las+xml":{"source":"iana","compressible":true,"extensions":["lasxml"]},"application/vnd.laszip":{"source":"iana"},"application/vnd.leap+json":{"source":"iana","compressible":true},"application/vnd.liberty-request+xml":{"source":"iana","compressible":true},"application/vnd.llamagraphics.life-balance.desktop":{"source":"iana","extensions":["lbd"]},"application/vnd.llamagraphics.life-balance.exchange+xml":{"source":"iana","compressible":true,"extensions":["lbe"]},"application/vnd.logipipe.circuit+zip":{"source":"iana","compressible":false},"application/vnd.loom":{"source":"iana"},"application/vnd.lotus-1-2-3":{"source":"iana","extensions":["123"]},"application/vnd.lotus-approach":{"source":"iana","extensions":["apr"]},"application/vnd.lotus-freelance":{"source":"iana","extensions":["pre"]},"application/vnd.lotus-notes":{"source":"iana","extensions":["nsf"]},"application/vnd.lotus-organizer":{"source":"iana","extensions":["org"]},"application/vnd.lotus-screencam":{"source":"iana","extensions":["scm"]},"application/vnd.lotus-wordpro":{"source":"iana","extensions":["lwp"]},"application/vnd.macports.portpkg":{"source":"iana","extensions":["portpkg"]},"application/vnd.mapbox-vector-tile":{"source":"iana","extensions":["mvt"]},"application/vnd.marlin.drm.actiontoken+xml":{"source":"iana","compressible":true},"application/vnd.marlin.drm.conftoken+xml":{"source":"iana","compressible":true},"application/vnd.marlin.drm.license+xml":{"source":"iana","compressible":true},"application/vnd.marlin.drm.mdcf":{"source":"iana"},"application/vnd.mason+json":{"source":"iana","compressible":true},"application/vnd.maxar.archive.3tz+zip":{"source":"iana","compressible":false},"application/vnd.maxmind.maxmind-db":{"source":"iana"},"application/vnd.mcd":{"source":"iana","extensions":["mcd"]},"application/vnd.medcalcdata":{"source":"iana","extensions":["mc1"]},"application/vnd.mediastation.cdkey":{"source":"iana","extensions":["cdkey"]},"application/vnd.meridian-slingshot":{"source":"iana"},"application/vnd.mfer":{"source":"iana","extensions":["mwf"]},"application/vnd.mfmp":{"source":"iana","extensions":["mfm"]},"application/vnd.micro+json":{"source":"iana","compressible":true},"application/vnd.micrografx.flo":{"source":"iana","extensions":["flo"]},"application/vnd.micrografx.igx":{"source":"iana","extensions":["igx"]},"application/vnd.microsoft.portable-executable":{"source":"iana"},"application/vnd.microsoft.windows.thumbnail-cache":{"source":"iana"},"application/vnd.miele+json":{"source":"iana","compressible":true},"application/vnd.mif":{"source":"iana","extensions":["mif"]},"application/vnd.minisoft-hp3000-save":{"source":"iana"},"application/vnd.mitsubishi.misty-guard.trustweb":{"source":"iana"},"application/vnd.mobius.daf":{"source":"iana","extensions":["daf"]},"application/vnd.mobius.dis":{"source":"iana","extensions":["dis"]},"application/vnd.mobius.mbk":{"source":"iana","extensions":["mbk"]},"application/vnd.mobius.mqy":{"source":"iana","extensions":["mqy"]},"application/vnd.mobius.msl":{"source":"iana","extensions":["msl"]},"application/vnd.mobius.plc":{"source":"iana","extensions":["plc"]},"application/vnd.mobius.txf":{"source":"iana","extensions":["txf"]},"application/vnd.mophun.application":{"source":"iana","extensions":["mpn"]},"application/vnd.mophun.certificate":{"source":"iana","extensions":["mpc"]},"application/vnd.motorola.flexsuite":{"source":"iana"},"application/vnd.motorola.flexsuite.adsi":{"source":"iana"},"application/vnd.motorola.flexsuite.fis":{"source":"iana"},"application/vnd.motorola.flexsuite.gotap":{"source":"iana"},"application/vnd.motorola.flexsuite.kmr":{"source":"iana"},"application/vnd.motorola.flexsuite.ttc":{"source":"iana"},"application/vnd.motorola.flexsuite.wem":{"source":"iana"},"application/vnd.motorola.iprm":{"source":"iana"},"application/vnd.mozilla.xul+xml":{"source":"iana","compressible":true,"extensions":["xul"]},"application/vnd.ms-3mfdocument":{"source":"iana"},"application/vnd.ms-artgalry":{"source":"iana","extensions":["cil"]},"application/vnd.ms-asf":{"source":"iana"},"application/vnd.ms-cab-compressed":{"source":"iana","extensions":["cab"]},"application/vnd.ms-color.iccprofile":{"source":"apache"},"application/vnd.ms-excel":{"source":"iana","compressible":false,"extensions":["xls","xlm","xla","xlc","xlt","xlw"]},"application/vnd.ms-excel.addin.macroenabled.12":{"source":"iana","extensions":["xlam"]},"application/vnd.ms-excel.sheet.binary.macroenabled.12":{"source":"iana","extensions":["xlsb"]},"application/vnd.ms-excel.sheet.macroenabled.12":{"source":"iana","extensions":["xlsm"]},"application/vnd.ms-excel.template.macroenabled.12":{"source":"iana","extensions":["xltm"]},"application/vnd.ms-fontobject":{"source":"iana","compressible":true,"extensions":["eot"]},"application/vnd.ms-htmlhelp":{"source":"iana","extensions":["chm"]},"application/vnd.ms-ims":{"source":"iana","extensions":["ims"]},"application/vnd.ms-lrm":{"source":"iana","extensions":["lrm"]},"application/vnd.ms-office.activex+xml":{"source":"iana","compressible":true},"application/vnd.ms-officetheme":{"source":"iana","extensions":["thmx"]},"application/vnd.ms-opentype":{"source":"apache","compressible":true},"application/vnd.ms-outlook":{"compressible":false,"extensions":["msg"]},"application/vnd.ms-package.obfuscated-opentype":{"source":"apache"},"application/vnd.ms-pki.seccat":{"source":"apache","extensions":["cat"]},"application/vnd.ms-pki.stl":{"source":"apache","extensions":["stl"]},"application/vnd.ms-playready.initiator+xml":{"source":"iana","compressible":true},"application/vnd.ms-powerpoint":{"source":"iana","compressible":false,"extensions":["ppt","pps","pot"]},"application/vnd.ms-powerpoint.addin.macroenabled.12":{"source":"iana","extensions":["ppam"]},"application/vnd.ms-powerpoint.presentation.macroenabled.12":{"source":"iana","extensions":["pptm"]},"application/vnd.ms-powerpoint.slide.macroenabled.12":{"source":"iana","extensions":["sldm"]},"application/vnd.ms-powerpoint.slideshow.macroenabled.12":{"source":"iana","extensions":["ppsm"]},"application/vnd.ms-powerpoint.template.macroenabled.12":{"source":"iana","extensions":["potm"]},"application/vnd.ms-printdevicecapabilities+xml":{"source":"iana","compressible":true},"application/vnd.ms-printing.printticket+xml":{"source":"apache","compressible":true},"application/vnd.ms-printschematicket+xml":{"source":"iana","compressible":true},"application/vnd.ms-project":{"source":"iana","extensions":["mpp","mpt"]},"application/vnd.ms-tnef":{"source":"iana"},"application/vnd.ms-windows.devicepairing":{"source":"iana"},"application/vnd.ms-windows.nwprinting.oob":{"source":"iana"},"application/vnd.ms-windows.printerpairing":{"source":"iana"},"application/vnd.ms-windows.wsd.oob":{"source":"iana"},"application/vnd.ms-wmdrm.lic-chlg-req":{"source":"iana"},"application/vnd.ms-wmdrm.lic-resp":{"source":"iana"},"application/vnd.ms-wmdrm.meter-chlg-req":{"source":"iana"},"application/vnd.ms-wmdrm.meter-resp":{"source":"iana"},"application/vnd.ms-word.document.macroenabled.12":{"source":"iana","extensions":["docm"]},"application/vnd.ms-word.template.macroenabled.12":{"source":"iana","extensions":["dotm"]},"application/vnd.ms-works":{"source":"iana","extensions":["wps","wks","wcm","wdb"]},"application/vnd.ms-wpl":{"source":"iana","extensions":["wpl"]},"application/vnd.ms-xpsdocument":{"source":"iana","compressible":false,"extensions":["xps"]},"application/vnd.msa-disk-image":{"source":"iana"},"application/vnd.mseq":{"source":"iana","extensions":["mseq"]},"application/vnd.msign":{"source":"iana"},"application/vnd.multiad.creator":{"source":"iana"},"application/vnd.multiad.creator.cif":{"source":"iana"},"application/vnd.music-niff":{"source":"iana"},"application/vnd.musician":{"source":"iana","extensions":["mus"]},"application/vnd.muvee.style":{"source":"iana","extensions":["msty"]},"application/vnd.mynfc":{"source":"iana","extensions":["taglet"]},"application/vnd.nacamar.ybrid+json":{"source":"iana","compressible":true},"application/vnd.ncd.control":{"source":"iana"},"application/vnd.ncd.reference":{"source":"iana"},"application/vnd.nearst.inv+json":{"source":"iana","compressible":true},"application/vnd.nebumind.line":{"source":"iana"},"application/vnd.nervana":{"source":"iana"},"application/vnd.netfpx":{"source":"iana"},"application/vnd.neurolanguage.nlu":{"source":"iana","extensions":["nlu"]},"application/vnd.nimn":{"source":"iana"},"application/vnd.nintendo.nitro.rom":{"source":"iana"},"application/vnd.nintendo.snes.rom":{"source":"iana"},"application/vnd.nitf":{"source":"iana","extensions":["ntf","nitf"]},"application/vnd.noblenet-directory":{"source":"iana","extensions":["nnd"]},"application/vnd.noblenet-sealer":{"source":"iana","extensions":["nns"]},"application/vnd.noblenet-web":{"source":"iana","extensions":["nnw"]},"application/vnd.nokia.catalogs":{"source":"iana"},"application/vnd.nokia.conml+wbxml":{"source":"iana"},"application/vnd.nokia.conml+xml":{"source":"iana","compressible":true},"application/vnd.nokia.iptv.config+xml":{"source":"iana","compressible":true},"application/vnd.nokia.isds-radio-presets":{"source":"iana"},"application/vnd.nokia.landmark+wbxml":{"source":"iana"},"application/vnd.nokia.landmark+xml":{"source":"iana","compressible":true},"application/vnd.nokia.landmarkcollection+xml":{"source":"iana","compressible":true},"application/vnd.nokia.n-gage.ac+xml":{"source":"iana","compressible":true,"extensions":["ac"]},"application/vnd.nokia.n-gage.data":{"source":"iana","extensions":["ngdat"]},"application/vnd.nokia.n-gage.symbian.install":{"source":"iana","extensions":["n-gage"]},"application/vnd.nokia.ncd":{"source":"iana"},"application/vnd.nokia.pcd+wbxml":{"source":"iana"},"application/vnd.nokia.pcd+xml":{"source":"iana","compressible":true},"application/vnd.nokia.radio-preset":{"source":"iana","extensions":["rpst"]},"application/vnd.nokia.radio-presets":{"source":"iana","extensions":["rpss"]},"application/vnd.novadigm.edm":{"source":"iana","extensions":["edm"]},"application/vnd.novadigm.edx":{"source":"iana","extensions":["edx"]},"application/vnd.novadigm.ext":{"source":"iana","extensions":["ext"]},"application/vnd.ntt-local.content-share":{"source":"iana"},"application/vnd.ntt-local.file-transfer":{"source":"iana"},"application/vnd.ntt-local.ogw_remote-access":{"source":"iana"},"application/vnd.ntt-local.sip-ta_remote":{"source":"iana"},"application/vnd.ntt-local.sip-ta_tcp_stream":{"source":"iana"},"application/vnd.oasis.opendocument.chart":{"source":"iana","extensions":["odc"]},"application/vnd.oasis.opendocument.chart-template":{"source":"iana","extensions":["otc"]},"application/vnd.oasis.opendocument.database":{"source":"iana","extensions":["odb"]},"application/vnd.oasis.opendocument.formula":{"source":"iana","extensions":["odf"]},"application/vnd.oasis.opendocument.formula-template":{"source":"iana","extensions":["odft"]},"application/vnd.oasis.opendocument.graphics":{"source":"iana","compressible":false,"extensions":["odg"]},"application/vnd.oasis.opendocument.graphics-template":{"source":"iana","extensions":["otg"]},"application/vnd.oasis.opendocument.image":{"source":"iana","extensions":["odi"]},"application/vnd.oasis.opendocument.image-template":{"source":"iana","extensions":["oti"]},"application/vnd.oasis.opendocument.presentation":{"source":"iana","compressible":false,"extensions":["odp"]},"application/vnd.oasis.opendocument.presentation-template":{"source":"iana","extensions":["otp"]},"application/vnd.oasis.opendocument.spreadsheet":{"source":"iana","compressible":false,"extensions":["ods"]},"application/vnd.oasis.opendocument.spreadsheet-template":{"source":"iana","extensions":["ots"]},"application/vnd.oasis.opendocument.text":{"source":"iana","compressible":false,"extensions":["odt"]},"application/vnd.oasis.opendocument.text-master":{"source":"iana","extensions":["odm"]},"application/vnd.oasis.opendocument.text-template":{"source":"iana","extensions":["ott"]},"application/vnd.oasis.opendocument.text-web":{"source":"iana","extensions":["oth"]},"application/vnd.obn":{"source":"iana"},"application/vnd.ocf+cbor":{"source":"iana"},"application/vnd.oci.image.manifest.v1+json":{"source":"iana","compressible":true},"application/vnd.oftn.l10n+json":{"source":"iana","compressible":true},"application/vnd.oipf.contentaccessdownload+xml":{"source":"iana","compressible":true},"application/vnd.oipf.contentaccessstreaming+xml":{"source":"iana","compressible":true},"application/vnd.oipf.cspg-hexbinary":{"source":"iana"},"application/vnd.oipf.dae.svg+xml":{"source":"iana","compressible":true},"application/vnd.oipf.dae.xhtml+xml":{"source":"iana","compressible":true},"application/vnd.oipf.mippvcontrolmessage+xml":{"source":"iana","compressible":true},"application/vnd.oipf.pae.gem":{"source":"iana"},"application/vnd.oipf.spdiscovery+xml":{"source":"iana","compressible":true},"application/vnd.oipf.spdlist+xml":{"source":"iana","compressible":true},"application/vnd.oipf.ueprofile+xml":{"source":"iana","compressible":true},"application/vnd.oipf.userprofile+xml":{"source":"iana","compressible":true},"application/vnd.olpc-sugar":{"source":"iana","extensions":["xo"]},"application/vnd.oma-scws-config":{"source":"iana"},"application/vnd.oma-scws-http-request":{"source":"iana"},"application/vnd.oma-scws-http-response":{"source":"iana"},"application/vnd.oma.bcast.associated-procedure-parameter+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.drm-trigger+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.imd+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.ltkm":{"source":"iana"},"application/vnd.oma.bcast.notification+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.provisioningtrigger":{"source":"iana"},"application/vnd.oma.bcast.sgboot":{"source":"iana"},"application/vnd.oma.bcast.sgdd+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.sgdu":{"source":"iana"},"application/vnd.oma.bcast.simple-symbol-container":{"source":"iana"},"application/vnd.oma.bcast.smartcard-trigger+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.sprov+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.stkm":{"source":"iana"},"application/vnd.oma.cab-address-book+xml":{"source":"iana","compressible":true},"application/vnd.oma.cab-feature-handler+xml":{"source":"iana","compressible":true},"application/vnd.oma.cab-pcc+xml":{"source":"iana","compressible":true},"application/vnd.oma.cab-subs-invite+xml":{"source":"iana","compressible":true},"application/vnd.oma.cab-user-prefs+xml":{"source":"iana","compressible":true},"application/vnd.oma.dcd":{"source":"iana"},"application/vnd.oma.dcdc":{"source":"iana"},"application/vnd.oma.dd2+xml":{"source":"iana","compressible":true,"extensions":["dd2"]},"application/vnd.oma.drm.risd+xml":{"source":"iana","compressible":true},"application/vnd.oma.group-usage-list+xml":{"source":"iana","compressible":true},"application/vnd.oma.lwm2m+cbor":{"source":"iana"},"application/vnd.oma.lwm2m+json":{"source":"iana","compressible":true},"application/vnd.oma.lwm2m+tlv":{"source":"iana"},"application/vnd.oma.pal+xml":{"source":"iana","compressible":true},"application/vnd.oma.poc.detailed-progress-report+xml":{"source":"iana","compressible":true},"application/vnd.oma.poc.final-report+xml":{"source":"iana","compressible":true},"application/vnd.oma.poc.groups+xml":{"source":"iana","compressible":true},"application/vnd.oma.poc.invocation-descriptor+xml":{"source":"iana","compressible":true},"application/vnd.oma.poc.optimized-progress-report+xml":{"source":"iana","compressible":true},"application/vnd.oma.push":{"source":"iana"},"application/vnd.oma.scidm.messages+xml":{"source":"iana","compressible":true},"application/vnd.oma.xcap-directory+xml":{"source":"iana","compressible":true},"application/vnd.omads-email+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/vnd.omads-file+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/vnd.omads-folder+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/vnd.omaloc-supl-init":{"source":"iana"},"application/vnd.onepager":{"source":"iana"},"application/vnd.onepagertamp":{"source":"iana"},"application/vnd.onepagertamx":{"source":"iana"},"application/vnd.onepagertat":{"source":"iana"},"application/vnd.onepagertatp":{"source":"iana"},"application/vnd.onepagertatx":{"source":"iana"},"application/vnd.openblox.game+xml":{"source":"iana","compressible":true,"extensions":["obgx"]},"application/vnd.openblox.game-binary":{"source":"iana"},"application/vnd.openeye.oeb":{"source":"iana"},"application/vnd.openofficeorg.extension":{"source":"apache","extensions":["oxt"]},"application/vnd.openstreetmap.data+xml":{"source":"iana","compressible":true,"extensions":["osm"]},"application/vnd.opentimestamps.ots":{"source":"iana"},"application/vnd.openxmlformats-officedocument.custom-properties+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.customxmlproperties+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawing+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.chart+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.diagramcolors+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.diagramdata+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.diagramlayout+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.diagramstyle+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.extended-properties+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.commentauthors+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.comments+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.handoutmaster+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.notesmaster+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.notesslide+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.presentation":{"source":"iana","compressible":false,"extensions":["pptx"]},"application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.presprops+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.slide":{"source":"iana","extensions":["sldx"]},"application/vnd.openxmlformats-officedocument.presentationml.slide+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.slidelayout+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.slidemaster+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.slideshow":{"source":"iana","extensions":["ppsx"]},"application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.slideupdateinfo+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.tablestyles+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.tags+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.template":{"source":"iana","extensions":["potx"]},"application/vnd.openxmlformats-officedocument.presentationml.template.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.viewprops+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.calcchain+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.externallink+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcachedefinition+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcacherecords+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.pivottable+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.querytable+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.revisionheaders+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.revisionlog+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.sharedstrings+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":{"source":"iana","compressible":false,"extensions":["xlsx"]},"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.sheetmetadata+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.tablesinglecells+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.template":{"source":"iana","extensions":["xltx"]},"application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.usernames+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.volatiledependencies+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.theme+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.themeoverride+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.vmldrawing":{"source":"iana"},"application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.document":{"source":"iana","compressible":false,"extensions":["docx"]},"application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.fonttable+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.template":{"source":"iana","extensions":["dotx"]},"application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.websettings+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-package.core-properties+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-package.digital-signature-xmlsignature+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-package.relationships+xml":{"source":"iana","compressible":true},"application/vnd.oracle.resource+json":{"source":"iana","compressible":true},"application/vnd.orange.indata":{"source":"iana"},"application/vnd.osa.netdeploy":{"source":"iana"},"application/vnd.osgeo.mapguide.package":{"source":"iana","extensions":["mgp"]},"application/vnd.osgi.bundle":{"source":"iana"},"application/vnd.osgi.dp":{"source":"iana","extensions":["dp"]},"application/vnd.osgi.subsystem":{"source":"iana","extensions":["esa"]},"application/vnd.otps.ct-kip+xml":{"source":"iana","compressible":true},"application/vnd.oxli.countgraph":{"source":"iana"},"application/vnd.pagerduty+json":{"source":"iana","compressible":true},"application/vnd.palm":{"source":"iana","extensions":["pdb","pqa","oprc"]},"application/vnd.panoply":{"source":"iana"},"application/vnd.paos.xml":{"source":"iana"},"application/vnd.patentdive":{"source":"iana"},"application/vnd.patientecommsdoc":{"source":"iana"},"application/vnd.pawaafile":{"source":"iana","extensions":["paw"]},"application/vnd.pcos":{"source":"iana"},"application/vnd.pg.format":{"source":"iana","extensions":["str"]},"application/vnd.pg.osasli":{"source":"iana","extensions":["ei6"]},"application/vnd.piaccess.application-licence":{"source":"iana"},"application/vnd.picsel":{"source":"iana","extensions":["efif"]},"application/vnd.pmi.widget":{"source":"iana","extensions":["wg"]},"application/vnd.poc.group-advertisement+xml":{"source":"iana","compressible":true},"application/vnd.pocketlearn":{"source":"iana","extensions":["plf"]},"application/vnd.powerbuilder6":{"source":"iana","extensions":["pbd"]},"application/vnd.powerbuilder6-s":{"source":"iana"},"application/vnd.powerbuilder7":{"source":"iana"},"application/vnd.powerbuilder7-s":{"source":"iana"},"application/vnd.powerbuilder75":{"source":"iana"},"application/vnd.powerbuilder75-s":{"source":"iana"},"application/vnd.preminet":{"source":"iana"},"application/vnd.previewsystems.box":{"source":"iana","extensions":["box"]},"application/vnd.proteus.magazine":{"source":"iana","extensions":["mgz"]},"application/vnd.psfs":{"source":"iana"},"application/vnd.publishare-delta-tree":{"source":"iana","extensions":["qps"]},"application/vnd.pvi.ptid1":{"source":"iana","extensions":["ptid"]},"application/vnd.pwg-multiplexed":{"source":"iana"},"application/vnd.pwg-xhtml-print+xml":{"source":"iana","compressible":true},"application/vnd.qualcomm.brew-app-res":{"source":"iana"},"application/vnd.quarantainenet":{"source":"iana"},"application/vnd.quark.quarkxpress":{"source":"iana","extensions":["qxd","qxt","qwd","qwt","qxl","qxb"]},"application/vnd.quobject-quoxdocument":{"source":"iana"},"application/vnd.radisys.moml+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-audit+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-audit-conf+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-audit-conn+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-audit-dialog+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-audit-stream+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-conf+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-base+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-fax-detect+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-fax-sendrecv+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-group+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-speech+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-transform+xml":{"source":"iana","compressible":true},"application/vnd.rainstor.data":{"source":"iana"},"application/vnd.rapid":{"source":"iana"},"application/vnd.rar":{"source":"iana","extensions":["rar"]},"application/vnd.realvnc.bed":{"source":"iana","extensions":["bed"]},"application/vnd.recordare.musicxml":{"source":"iana","extensions":["mxl"]},"application/vnd.recordare.musicxml+xml":{"source":"iana","compressible":true,"extensions":["musicxml"]},"application/vnd.renlearn.rlprint":{"source":"iana"},"application/vnd.resilient.logic":{"source":"iana"},"application/vnd.restful+json":{"source":"iana","compressible":true},"application/vnd.rig.cryptonote":{"source":"iana","extensions":["cryptonote"]},"application/vnd.rim.cod":{"source":"apache","extensions":["cod"]},"application/vnd.rn-realmedia":{"source":"apache","extensions":["rm"]},"application/vnd.rn-realmedia-vbr":{"source":"apache","extensions":["rmvb"]},"application/vnd.route66.link66+xml":{"source":"iana","compressible":true,"extensions":["link66"]},"application/vnd.rs-274x":{"source":"iana"},"application/vnd.ruckus.download":{"source":"iana"},"application/vnd.s3sms":{"source":"iana"},"application/vnd.sailingtracker.track":{"source":"iana","extensions":["st"]},"application/vnd.sar":{"source":"iana"},"application/vnd.sbm.cid":{"source":"iana"},"application/vnd.sbm.mid2":{"source":"iana"},"application/vnd.scribus":{"source":"iana"},"application/vnd.sealed.3df":{"source":"iana"},"application/vnd.sealed.csf":{"source":"iana"},"application/vnd.sealed.doc":{"source":"iana"},"application/vnd.sealed.eml":{"source":"iana"},"application/vnd.sealed.mht":{"source":"iana"},"application/vnd.sealed.net":{"source":"iana"},"application/vnd.sealed.ppt":{"source":"iana"},"application/vnd.sealed.tiff":{"source":"iana"},"application/vnd.sealed.xls":{"source":"iana"},"application/vnd.sealedmedia.softseal.html":{"source":"iana"},"application/vnd.sealedmedia.softseal.pdf":{"source":"iana"},"application/vnd.seemail":{"source":"iana","extensions":["see"]},"application/vnd.seis+json":{"source":"iana","compressible":true},"application/vnd.sema":{"source":"iana","extensions":["sema"]},"application/vnd.semd":{"source":"iana","extensions":["semd"]},"application/vnd.semf":{"source":"iana","extensions":["semf"]},"application/vnd.shade-save-file":{"source":"iana"},"application/vnd.shana.informed.formdata":{"source":"iana","extensions":["ifm"]},"application/vnd.shana.informed.formtemplate":{"source":"iana","extensions":["itp"]},"application/vnd.shana.informed.interchange":{"source":"iana","extensions":["iif"]},"application/vnd.shana.informed.package":{"source":"iana","extensions":["ipk"]},"application/vnd.shootproof+json":{"source":"iana","compressible":true},"application/vnd.shopkick+json":{"source":"iana","compressible":true},"application/vnd.shp":{"source":"iana"},"application/vnd.shx":{"source":"iana"},"application/vnd.sigrok.session":{"source":"iana"},"application/vnd.simtech-mindmapper":{"source":"iana","extensions":["twd","twds"]},"application/vnd.siren+json":{"source":"iana","compressible":true},"application/vnd.smaf":{"source":"iana","extensions":["mmf"]},"application/vnd.smart.notebook":{"source":"iana"},"application/vnd.smart.teacher":{"source":"iana","extensions":["teacher"]},"application/vnd.snesdev-page-table":{"source":"iana"},"application/vnd.software602.filler.form+xml":{"source":"iana","compressible":true,"extensions":["fo"]},"application/vnd.software602.filler.form-xml-zip":{"source":"iana"},"application/vnd.solent.sdkm+xml":{"source":"iana","compressible":true,"extensions":["sdkm","sdkd"]},"application/vnd.spotfire.dxp":{"source":"iana","extensions":["dxp"]},"application/vnd.spotfire.sfs":{"source":"iana","extensions":["sfs"]},"application/vnd.sqlite3":{"source":"iana"},"application/vnd.sss-cod":{"source":"iana"},"application/vnd.sss-dtf":{"source":"iana"},"application/vnd.sss-ntf":{"source":"iana"},"application/vnd.stardivision.calc":{"source":"apache","extensions":["sdc"]},"application/vnd.stardivision.draw":{"source":"apache","extensions":["sda"]},"application/vnd.stardivision.impress":{"source":"apache","extensions":["sdd"]},"application/vnd.stardivision.math":{"source":"apache","extensions":["smf"]},"application/vnd.stardivision.writer":{"source":"apache","extensions":["sdw","vor"]},"application/vnd.stardivision.writer-global":{"source":"apache","extensions":["sgl"]},"application/vnd.stepmania.package":{"source":"iana","extensions":["smzip"]},"application/vnd.stepmania.stepchart":{"source":"iana","extensions":["sm"]},"application/vnd.street-stream":{"source":"iana"},"application/vnd.sun.wadl+xml":{"source":"iana","compressible":true,"extensions":["wadl"]},"application/vnd.sun.xml.calc":{"source":"apache","extensions":["sxc"]},"application/vnd.sun.xml.calc.template":{"source":"apache","extensions":["stc"]},"application/vnd.sun.xml.draw":{"source":"apache","extensions":["sxd"]},"application/vnd.sun.xml.draw.template":{"source":"apache","extensions":["std"]},"application/vnd.sun.xml.impress":{"source":"apache","extensions":["sxi"]},"application/vnd.sun.xml.impress.template":{"source":"apache","extensions":["sti"]},"application/vnd.sun.xml.math":{"source":"apache","extensions":["sxm"]},"application/vnd.sun.xml.writer":{"source":"apache","extensions":["sxw"]},"application/vnd.sun.xml.writer.global":{"source":"apache","extensions":["sxg"]},"application/vnd.sun.xml.writer.template":{"source":"apache","extensions":["stw"]},"application/vnd.sus-calendar":{"source":"iana","extensions":["sus","susp"]},"application/vnd.svd":{"source":"iana","extensions":["svd"]},"application/vnd.swiftview-ics":{"source":"iana"},"application/vnd.sycle+xml":{"source":"iana","compressible":true},"application/vnd.syft+json":{"source":"iana","compressible":true},"application/vnd.symbian.install":{"source":"apache","extensions":["sis","sisx"]},"application/vnd.syncml+xml":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["xsm"]},"application/vnd.syncml.dm+wbxml":{"source":"iana","charset":"UTF-8","extensions":["bdm"]},"application/vnd.syncml.dm+xml":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["xdm"]},"application/vnd.syncml.dm.notification":{"source":"iana"},"application/vnd.syncml.dmddf+wbxml":{"source":"iana"},"application/vnd.syncml.dmddf+xml":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["ddf"]},"application/vnd.syncml.dmtnds+wbxml":{"source":"iana"},"application/vnd.syncml.dmtnds+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/vnd.syncml.ds.notification":{"source":"iana"},"application/vnd.tableschema+json":{"source":"iana","compressible":true},"application/vnd.tao.intent-module-archive":{"source":"iana","extensions":["tao"]},"application/vnd.tcpdump.pcap":{"source":"iana","extensions":["pcap","cap","dmp"]},"application/vnd.think-cell.ppttc+json":{"source":"iana","compressible":true},"application/vnd.tmd.mediaflex.api+xml":{"source":"iana","compressible":true},"application/vnd.tml":{"source":"iana"},"application/vnd.tmobile-livetv":{"source":"iana","extensions":["tmo"]},"application/vnd.tri.onesource":{"source":"iana"},"application/vnd.trid.tpt":{"source":"iana","extensions":["tpt"]},"application/vnd.triscape.mxs":{"source":"iana","extensions":["mxs"]},"application/vnd.trueapp":{"source":"iana","extensions":["tra"]},"application/vnd.truedoc":{"source":"iana"},"application/vnd.ubisoft.webplayer":{"source":"iana"},"application/vnd.ufdl":{"source":"iana","extensions":["ufd","ufdl"]},"application/vnd.uiq.theme":{"source":"iana","extensions":["utz"]},"application/vnd.umajin":{"source":"iana","extensions":["umj"]},"application/vnd.unity":{"source":"iana","extensions":["unityweb"]},"application/vnd.uoml+xml":{"source":"iana","compressible":true,"extensions":["uoml"]},"application/vnd.uplanet.alert":{"source":"iana"},"application/vnd.uplanet.alert-wbxml":{"source":"iana"},"application/vnd.uplanet.bearer-choice":{"source":"iana"},"application/vnd.uplanet.bearer-choice-wbxml":{"source":"iana"},"application/vnd.uplanet.cacheop":{"source":"iana"},"application/vnd.uplanet.cacheop-wbxml":{"source":"iana"},"application/vnd.uplanet.channel":{"source":"iana"},"application/vnd.uplanet.channel-wbxml":{"source":"iana"},"application/vnd.uplanet.list":{"source":"iana"},"application/vnd.uplanet.list-wbxml":{"source":"iana"},"application/vnd.uplanet.listcmd":{"source":"iana"},"application/vnd.uplanet.listcmd-wbxml":{"source":"iana"},"application/vnd.uplanet.signal":{"source":"iana"},"application/vnd.uri-map":{"source":"iana"},"application/vnd.valve.source.material":{"source":"iana"},"application/vnd.vcx":{"source":"iana","extensions":["vcx"]},"application/vnd.vd-study":{"source":"iana"},"application/vnd.vectorworks":{"source":"iana"},"application/vnd.vel+json":{"source":"iana","compressible":true},"application/vnd.verimatrix.vcas":{"source":"iana"},"application/vnd.veritone.aion+json":{"source":"iana","compressible":true},"application/vnd.veryant.thin":{"source":"iana"},"application/vnd.ves.encrypted":{"source":"iana"},"application/vnd.vidsoft.vidconference":{"source":"iana"},"application/vnd.visio":{"source":"iana","extensions":["vsd","vst","vss","vsw"]},"application/vnd.visionary":{"source":"iana","extensions":["vis"]},"application/vnd.vividence.scriptfile":{"source":"iana"},"application/vnd.vsf":{"source":"iana","extensions":["vsf"]},"application/vnd.wap.sic":{"source":"iana"},"application/vnd.wap.slc":{"source":"iana"},"application/vnd.wap.wbxml":{"source":"iana","charset":"UTF-8","extensions":["wbxml"]},"application/vnd.wap.wmlc":{"source":"iana","extensions":["wmlc"]},"application/vnd.wap.wmlscriptc":{"source":"iana","extensions":["wmlsc"]},"application/vnd.webturbo":{"source":"iana","extensions":["wtb"]},"application/vnd.wfa.dpp":{"source":"iana"},"application/vnd.wfa.p2p":{"source":"iana"},"application/vnd.wfa.wsc":{"source":"iana"},"application/vnd.windows.devicepairing":{"source":"iana"},"application/vnd.wmc":{"source":"iana"},"application/vnd.wmf.bootstrap":{"source":"iana"},"application/vnd.wolfram.mathematica":{"source":"iana"},"application/vnd.wolfram.mathematica.package":{"source":"iana"},"application/vnd.wolfram.player":{"source":"iana","extensions":["nbp"]},"application/vnd.wordperfect":{"source":"iana","extensions":["wpd"]},"application/vnd.wqd":{"source":"iana","extensions":["wqd"]},"application/vnd.wrq-hp3000-labelled":{"source":"iana"},"application/vnd.wt.stf":{"source":"iana","extensions":["stf"]},"application/vnd.wv.csp+wbxml":{"source":"iana"},"application/vnd.wv.csp+xml":{"source":"iana","compressible":true},"application/vnd.wv.ssp+xml":{"source":"iana","compressible":true},"application/vnd.xacml+json":{"source":"iana","compressible":true},"application/vnd.xara":{"source":"iana","extensions":["xar"]},"application/vnd.xfdl":{"source":"iana","extensions":["xfdl"]},"application/vnd.xfdl.webform":{"source":"iana"},"application/vnd.xmi+xml":{"source":"iana","compressible":true},"application/vnd.xmpie.cpkg":{"source":"iana"},"application/vnd.xmpie.dpkg":{"source":"iana"},"application/vnd.xmpie.plan":{"source":"iana"},"application/vnd.xmpie.ppkg":{"source":"iana"},"application/vnd.xmpie.xlim":{"source":"iana"},"application/vnd.yamaha.hv-dic":{"source":"iana","extensions":["hvd"]},"application/vnd.yamaha.hv-script":{"source":"iana","extensions":["hvs"]},"application/vnd.yamaha.hv-voice":{"source":"iana","extensions":["hvp"]},"application/vnd.yamaha.openscoreformat":{"source":"iana","extensions":["osf"]},"application/vnd.yamaha.openscoreformat.osfpvg+xml":{"source":"iana","compressible":true,"extensions":["osfpvg"]},"application/vnd.yamaha.remote-setup":{"source":"iana"},"application/vnd.yamaha.smaf-audio":{"source":"iana","extensions":["saf"]},"application/vnd.yamaha.smaf-phrase":{"source":"iana","extensions":["spf"]},"application/vnd.yamaha.through-ngn":{"source":"iana"},"application/vnd.yamaha.tunnel-udpencap":{"source":"iana"},"application/vnd.yaoweme":{"source":"iana"},"application/vnd.yellowriver-custom-menu":{"source":"iana","extensions":["cmp"]},"application/vnd.youtube.yt":{"source":"iana"},"application/vnd.zul":{"source":"iana","extensions":["zir","zirz"]},"application/vnd.zzazz.deck+xml":{"source":"iana","compressible":true,"extensions":["zaz"]},"application/voicexml+xml":{"source":"iana","compressible":true,"extensions":["vxml"]},"application/voucher-cms+json":{"source":"iana","compressible":true},"application/vq-rtcpxr":{"source":"iana"},"application/wasm":{"source":"iana","compressible":true,"extensions":["wasm"]},"application/watcherinfo+xml":{"source":"iana","compressible":true,"extensions":["wif"]},"application/webpush-options+json":{"source":"iana","compressible":true},"application/whoispp-query":{"source":"iana"},"application/whoispp-response":{"source":"iana"},"application/widget":{"source":"iana","extensions":["wgt"]},"application/winhlp":{"source":"apache","extensions":["hlp"]},"application/wita":{"source":"iana"},"application/wordperfect5.1":{"source":"iana"},"application/wsdl+xml":{"source":"iana","compressible":true,"extensions":["wsdl"]},"application/wspolicy+xml":{"source":"iana","compressible":true,"extensions":["wspolicy"]},"application/x-7z-compressed":{"source":"apache","compressible":false,"extensions":["7z"]},"application/x-abiword":{"source":"apache","extensions":["abw"]},"application/x-ace-compressed":{"source":"apache","extensions":["ace"]},"application/x-amf":{"source":"apache"},"application/x-apple-diskimage":{"source":"apache","extensions":["dmg"]},"application/x-arj":{"compressible":false,"extensions":["arj"]},"application/x-authorware-bin":{"source":"apache","extensions":["aab","x32","u32","vox"]},"application/x-authorware-map":{"source":"apache","extensions":["aam"]},"application/x-authorware-seg":{"source":"apache","extensions":["aas"]},"application/x-bcpio":{"source":"apache","extensions":["bcpio"]},"application/x-bdoc":{"compressible":false,"extensions":["bdoc"]},"application/x-bittorrent":{"source":"apache","extensions":["torrent"]},"application/x-blorb":{"source":"apache","extensions":["blb","blorb"]},"application/x-bzip":{"source":"apache","compressible":false,"extensions":["bz"]},"application/x-bzip2":{"source":"apache","compressible":false,"extensions":["bz2","boz"]},"application/x-cbr":{"source":"apache","extensions":["cbr","cba","cbt","cbz","cb7"]},"application/x-cdlink":{"source":"apache","extensions":["vcd"]},"application/x-cfs-compressed":{"source":"apache","extensions":["cfs"]},"application/x-chat":{"source":"apache","extensions":["chat"]},"application/x-chess-pgn":{"source":"apache","extensions":["pgn"]},"application/x-chrome-extension":{"extensions":["crx"]},"application/x-cocoa":{"source":"nginx","extensions":["cco"]},"application/x-compress":{"source":"apache"},"application/x-conference":{"source":"apache","extensions":["nsc"]},"application/x-cpio":{"source":"apache","extensions":["cpio"]},"application/x-csh":{"source":"apache","extensions":["csh"]},"application/x-deb":{"compressible":false},"application/x-debian-package":{"source":"apache","extensions":["deb","udeb"]},"application/x-dgc-compressed":{"source":"apache","extensions":["dgc"]},"application/x-director":{"source":"apache","extensions":["dir","dcr","dxr","cst","cct","cxt","w3d","fgd","swa"]},"application/x-doom":{"source":"apache","extensions":["wad"]},"application/x-dtbncx+xml":{"source":"apache","compressible":true,"extensions":["ncx"]},"application/x-dtbook+xml":{"source":"apache","compressible":true,"extensions":["dtb"]},"application/x-dtbresource+xml":{"source":"apache","compressible":true,"extensions":["res"]},"application/x-dvi":{"source":"apache","compressible":false,"extensions":["dvi"]},"application/x-envoy":{"source":"apache","extensions":["evy"]},"application/x-eva":{"source":"apache","extensions":["eva"]},"application/x-font-bdf":{"source":"apache","extensions":["bdf"]},"application/x-font-dos":{"source":"apache"},"application/x-font-framemaker":{"source":"apache"},"application/x-font-ghostscript":{"source":"apache","extensions":["gsf"]},"application/x-font-libgrx":{"source":"apache"},"application/x-font-linux-psf":{"source":"apache","extensions":["psf"]},"application/x-font-pcf":{"source":"apache","extensions":["pcf"]},"application/x-font-snf":{"source":"apache","extensions":["snf"]},"application/x-font-speedo":{"source":"apache"},"application/x-font-sunos-news":{"source":"apache"},"application/x-font-type1":{"source":"apache","extensions":["pfa","pfb","pfm","afm"]},"application/x-font-vfont":{"source":"apache"},"application/x-freearc":{"source":"apache","extensions":["arc"]},"application/x-futuresplash":{"source":"apache","extensions":["spl"]},"application/x-gca-compressed":{"source":"apache","extensions":["gca"]},"application/x-glulx":{"source":"apache","extensions":["ulx"]},"application/x-gnumeric":{"source":"apache","extensions":["gnumeric"]},"application/x-gramps-xml":{"source":"apache","extensions":["gramps"]},"application/x-gtar":{"source":"apache","extensions":["gtar"]},"application/x-gzip":{"source":"apache"},"application/x-hdf":{"source":"apache","extensions":["hdf"]},"application/x-httpd-php":{"compressible":true,"extensions":["php"]},"application/x-install-instructions":{"source":"apache","extensions":["install"]},"application/x-iso9660-image":{"source":"apache","extensions":["iso"]},"application/x-iwork-keynote-sffkey":{"extensions":["key"]},"application/x-iwork-numbers-sffnumbers":{"extensions":["numbers"]},"application/x-iwork-pages-sffpages":{"extensions":["pages"]},"application/x-java-archive-diff":{"source":"nginx","extensions":["jardiff"]},"application/x-java-jnlp-file":{"source":"apache","compressible":false,"extensions":["jnlp"]},"application/x-javascript":{"compressible":true},"application/x-keepass2":{"extensions":["kdbx"]},"application/x-latex":{"source":"apache","compressible":false,"extensions":["latex"]},"application/x-lua-bytecode":{"extensions":["luac"]},"application/x-lzh-compressed":{"source":"apache","extensions":["lzh","lha"]},"application/x-makeself":{"source":"nginx","extensions":["run"]},"application/x-mie":{"source":"apache","extensions":["mie"]},"application/x-mobipocket-ebook":{"source":"apache","extensions":["prc","mobi"]},"application/x-mpegurl":{"compressible":false},"application/x-ms-application":{"source":"apache","extensions":["application"]},"application/x-ms-shortcut":{"source":"apache","extensions":["lnk"]},"application/x-ms-wmd":{"source":"apache","extensions":["wmd"]},"application/x-ms-wmz":{"source":"apache","extensions":["wmz"]},"application/x-ms-xbap":{"source":"apache","extensions":["xbap"]},"application/x-msaccess":{"source":"apache","extensions":["mdb"]},"application/x-msbinder":{"source":"apache","extensions":["obd"]},"application/x-mscardfile":{"source":"apache","extensions":["crd"]},"application/x-msclip":{"source":"apache","extensions":["clp"]},"application/x-msdos-program":{"extensions":["exe"]},"application/x-msdownload":{"source":"apache","extensions":["exe","dll","com","bat","msi"]},"application/x-msmediaview":{"source":"apache","extensions":["mvb","m13","m14"]},"application/x-msmetafile":{"source":"apache","extensions":["wmf","wmz","emf","emz"]},"application/x-msmoney":{"source":"apache","extensions":["mny"]},"application/x-mspublisher":{"source":"apache","extensions":["pub"]},"application/x-msschedule":{"source":"apache","extensions":["scd"]},"application/x-msterminal":{"source":"apache","extensions":["trm"]},"application/x-mswrite":{"source":"apache","extensions":["wri"]},"application/x-netcdf":{"source":"apache","extensions":["nc","cdf"]},"application/x-ns-proxy-autoconfig":{"compressible":true,"extensions":["pac"]},"application/x-nzb":{"source":"apache","extensions":["nzb"]},"application/x-perl":{"source":"nginx","extensions":["pl","pm"]},"application/x-pilot":{"source":"nginx","extensions":["prc","pdb"]},"application/x-pkcs12":{"source":"apache","compressible":false,"extensions":["p12","pfx"]},"application/x-pkcs7-certificates":{"source":"apache","extensions":["p7b","spc"]},"application/x-pkcs7-certreqresp":{"source":"apache","extensions":["p7r"]},"application/x-pki-message":{"source":"iana"},"application/x-rar-compressed":{"source":"apache","compressible":false,"extensions":["rar"]},"application/x-redhat-package-manager":{"source":"nginx","extensions":["rpm"]},"application/x-research-info-systems":{"source":"apache","extensions":["ris"]},"application/x-sea":{"source":"nginx","extensions":["sea"]},"application/x-sh":{"source":"apache","compressible":true,"extensions":["sh"]},"application/x-shar":{"source":"apache","extensions":["shar"]},"application/x-shockwave-flash":{"source":"apache","compressible":false,"extensions":["swf"]},"application/x-silverlight-app":{"source":"apache","extensions":["xap"]},"application/x-sql":{"source":"apache","extensions":["sql"]},"application/x-stuffit":{"source":"apache","compressible":false,"extensions":["sit"]},"application/x-stuffitx":{"source":"apache","extensions":["sitx"]},"application/x-subrip":{"source":"apache","extensions":["srt"]},"application/x-sv4cpio":{"source":"apache","extensions":["sv4cpio"]},"application/x-sv4crc":{"source":"apache","extensions":["sv4crc"]},"application/x-t3vm-image":{"source":"apache","extensions":["t3"]},"application/x-tads":{"source":"apache","extensions":["gam"]},"application/x-tar":{"source":"apache","compressible":true,"extensions":["tar"]},"application/x-tcl":{"source":"apache","extensions":["tcl","tk"]},"application/x-tex":{"source":"apache","extensions":["tex"]},"application/x-tex-tfm":{"source":"apache","extensions":["tfm"]},"application/x-texinfo":{"source":"apache","extensions":["texinfo","texi"]},"application/x-tgif":{"source":"apache","extensions":["obj"]},"application/x-ustar":{"source":"apache","extensions":["ustar"]},"application/x-virtualbox-hdd":{"compressible":true,"extensions":["hdd"]},"application/x-virtualbox-ova":{"compressible":true,"extensions":["ova"]},"application/x-virtualbox-ovf":{"compressible":true,"extensions":["ovf"]},"application/x-virtualbox-vbox":{"compressible":true,"extensions":["vbox"]},"application/x-virtualbox-vbox-extpack":{"compressible":false,"extensions":["vbox-extpack"]},"application/x-virtualbox-vdi":{"compressible":true,"extensions":["vdi"]},"application/x-virtualbox-vhd":{"compressible":true,"extensions":["vhd"]},"application/x-virtualbox-vmdk":{"compressible":true,"extensions":["vmdk"]},"application/x-wais-source":{"source":"apache","extensions":["src"]},"application/x-web-app-manifest+json":{"compressible":true,"extensions":["webapp"]},"application/x-www-form-urlencoded":{"source":"iana","compressible":true},"application/x-x509-ca-cert":{"source":"iana","extensions":["der","crt","pem"]},"application/x-x509-ca-ra-cert":{"source":"iana"},"application/x-x509-next-ca-cert":{"source":"iana"},"application/x-xfig":{"source":"apache","extensions":["fig"]},"application/x-xliff+xml":{"source":"apache","compressible":true,"extensions":["xlf"]},"application/x-xpinstall":{"source":"apache","compressible":false,"extensions":["xpi"]},"application/x-xz":{"source":"apache","extensions":["xz"]},"application/x-zmachine":{"source":"apache","extensions":["z1","z2","z3","z4","z5","z6","z7","z8"]},"application/x400-bp":{"source":"iana"},"application/xacml+xml":{"source":"iana","compressible":true},"application/xaml+xml":{"source":"apache","compressible":true,"extensions":["xaml"]},"application/xcap-att+xml":{"source":"iana","compressible":true,"extensions":["xav"]},"application/xcap-caps+xml":{"source":"iana","compressible":true,"extensions":["xca"]},"application/xcap-diff+xml":{"source":"iana","compressible":true,"extensions":["xdf"]},"application/xcap-el+xml":{"source":"iana","compressible":true,"extensions":["xel"]},"application/xcap-error+xml":{"source":"iana","compressible":true},"application/xcap-ns+xml":{"source":"iana","compressible":true,"extensions":["xns"]},"application/xcon-conference-info+xml":{"source":"iana","compressible":true},"application/xcon-conference-info-diff+xml":{"source":"iana","compressible":true},"application/xenc+xml":{"source":"iana","compressible":true,"extensions":["xenc"]},"application/xhtml+xml":{"source":"iana","compressible":true,"extensions":["xhtml","xht"]},"application/xhtml-voice+xml":{"source":"apache","compressible":true},"application/xliff+xml":{"source":"iana","compressible":true,"extensions":["xlf"]},"application/xml":{"source":"iana","compressible":true,"extensions":["xml","xsl","xsd","rng"]},"application/xml-dtd":{"source":"iana","compressible":true,"extensions":["dtd"]},"application/xml-external-parsed-entity":{"source":"iana"},"application/xml-patch+xml":{"source":"iana","compressible":true},"application/xmpp+xml":{"source":"iana","compressible":true},"application/xop+xml":{"source":"iana","compressible":true,"extensions":["xop"]},"application/xproc+xml":{"source":"apache","compressible":true,"extensions":["xpl"]},"application/xslt+xml":{"source":"iana","compressible":true,"extensions":["xsl","xslt"]},"application/xspf+xml":{"source":"apache","compressible":true,"extensions":["xspf"]},"application/xv+xml":{"source":"iana","compressible":true,"extensions":["mxml","xhvml","xvml","xvm"]},"application/yang":{"source":"iana","extensions":["yang"]},"application/yang-data+json":{"source":"iana","compressible":true},"application/yang-data+xml":{"source":"iana","compressible":true},"application/yang-patch+json":{"source":"iana","compressible":true},"application/yang-patch+xml":{"source":"iana","compressible":true},"application/yin+xml":{"source":"iana","compressible":true,"extensions":["yin"]},"application/zip":{"source":"iana","compressible":false,"extensions":["zip"]},"application/zlib":{"source":"iana"},"application/zstd":{"source":"iana"},"audio/1d-interleaved-parityfec":{"source":"iana"},"audio/32kadpcm":{"source":"iana"},"audio/3gpp":{"source":"iana","compressible":false,"extensions":["3gpp"]},"audio/3gpp2":{"source":"iana"},"audio/aac":{"source":"iana"},"audio/ac3":{"source":"iana"},"audio/adpcm":{"source":"apache","extensions":["adp"]},"audio/amr":{"source":"iana","extensions":["amr"]},"audio/amr-wb":{"source":"iana"},"audio/amr-wb+":{"source":"iana"},"audio/aptx":{"source":"iana"},"audio/asc":{"source":"iana"},"audio/atrac-advanced-lossless":{"source":"iana"},"audio/atrac-x":{"source":"iana"},"audio/atrac3":{"source":"iana"},"audio/basic":{"source":"iana","compressible":false,"extensions":["au","snd"]},"audio/bv16":{"source":"iana"},"audio/bv32":{"source":"iana"},"audio/clearmode":{"source":"iana"},"audio/cn":{"source":"iana"},"audio/dat12":{"source":"iana"},"audio/dls":{"source":"iana"},"audio/dsr-es201108":{"source":"iana"},"audio/dsr-es202050":{"source":"iana"},"audio/dsr-es202211":{"source":"iana"},"audio/dsr-es202212":{"source":"iana"},"audio/dv":{"source":"iana"},"audio/dvi4":{"source":"iana"},"audio/eac3":{"source":"iana"},"audio/encaprtp":{"source":"iana"},"audio/evrc":{"source":"iana"},"audio/evrc-qcp":{"source":"iana"},"audio/evrc0":{"source":"iana"},"audio/evrc1":{"source":"iana"},"audio/evrcb":{"source":"iana"},"audio/evrcb0":{"source":"iana"},"audio/evrcb1":{"source":"iana"},"audio/evrcnw":{"source":"iana"},"audio/evrcnw0":{"source":"iana"},"audio/evrcnw1":{"source":"iana"},"audio/evrcwb":{"source":"iana"},"audio/evrcwb0":{"source":"iana"},"audio/evrcwb1":{"source":"iana"},"audio/evs":{"source":"iana"},"audio/flexfec":{"source":"iana"},"audio/fwdred":{"source":"iana"},"audio/g711-0":{"source":"iana"},"audio/g719":{"source":"iana"},"audio/g722":{"source":"iana"},"audio/g7221":{"source":"iana"},"audio/g723":{"source":"iana"},"audio/g726-16":{"source":"iana"},"audio/g726-24":{"source":"iana"},"audio/g726-32":{"source":"iana"},"audio/g726-40":{"source":"iana"},"audio/g728":{"source":"iana"},"audio/g729":{"source":"iana"},"audio/g7291":{"source":"iana"},"audio/g729d":{"source":"iana"},"audio/g729e":{"source":"iana"},"audio/gsm":{"source":"iana"},"audio/gsm-efr":{"source":"iana"},"audio/gsm-hr-08":{"source":"iana"},"audio/ilbc":{"source":"iana"},"audio/ip-mr_v2.5":{"source":"iana"},"audio/isac":{"source":"apache"},"audio/l16":{"source":"iana"},"audio/l20":{"source":"iana"},"audio/l24":{"source":"iana","compressible":false},"audio/l8":{"source":"iana"},"audio/lpc":{"source":"iana"},"audio/melp":{"source":"iana"},"audio/melp1200":{"source":"iana"},"audio/melp2400":{"source":"iana"},"audio/melp600":{"source":"iana"},"audio/mhas":{"source":"iana"},"audio/midi":{"source":"apache","extensions":["mid","midi","kar","rmi"]},"audio/mobile-xmf":{"source":"iana","extensions":["mxmf"]},"audio/mp3":{"compressible":false,"extensions":["mp3"]},"audio/mp4":{"source":"iana","compressible":false,"extensions":["m4a","mp4a"]},"audio/mp4a-latm":{"source":"iana"},"audio/mpa":{"source":"iana"},"audio/mpa-robust":{"source":"iana"},"audio/mpeg":{"source":"iana","compressible":false,"extensions":["mpga","mp2","mp2a","mp3","m2a","m3a"]},"audio/mpeg4-generic":{"source":"iana"},"audio/musepack":{"source":"apache"},"audio/ogg":{"source":"iana","compressible":false,"extensions":["oga","ogg","spx","opus"]},"audio/opus":{"source":"iana"},"audio/parityfec":{"source":"iana"},"audio/pcma":{"source":"iana"},"audio/pcma-wb":{"source":"iana"},"audio/pcmu":{"source":"iana"},"audio/pcmu-wb":{"source":"iana"},"audio/prs.sid":{"source":"iana"},"audio/qcelp":{"source":"iana"},"audio/raptorfec":{"source":"iana"},"audio/red":{"source":"iana"},"audio/rtp-enc-aescm128":{"source":"iana"},"audio/rtp-midi":{"source":"iana"},"audio/rtploopback":{"source":"iana"},"audio/rtx":{"source":"iana"},"audio/s3m":{"source":"apache","extensions":["s3m"]},"audio/scip":{"source":"iana"},"audio/silk":{"source":"apache","extensions":["sil"]},"audio/smv":{"source":"iana"},"audio/smv-qcp":{"source":"iana"},"audio/smv0":{"source":"iana"},"audio/sofa":{"source":"iana"},"audio/sp-midi":{"source":"iana"},"audio/speex":{"source":"iana"},"audio/t140c":{"source":"iana"},"audio/t38":{"source":"iana"},"audio/telephone-event":{"source":"iana"},"audio/tetra_acelp":{"source":"iana"},"audio/tetra_acelp_bb":{"source":"iana"},"audio/tone":{"source":"iana"},"audio/tsvcis":{"source":"iana"},"audio/uemclip":{"source":"iana"},"audio/ulpfec":{"source":"iana"},"audio/usac":{"source":"iana"},"audio/vdvi":{"source":"iana"},"audio/vmr-wb":{"source":"iana"},"audio/vnd.3gpp.iufp":{"source":"iana"},"audio/vnd.4sb":{"source":"iana"},"audio/vnd.audiokoz":{"source":"iana"},"audio/vnd.celp":{"source":"iana"},"audio/vnd.cisco.nse":{"source":"iana"},"audio/vnd.cmles.radio-events":{"source":"iana"},"audio/vnd.cns.anp1":{"source":"iana"},"audio/vnd.cns.inf1":{"source":"iana"},"audio/vnd.dece.audio":{"source":"iana","extensions":["uva","uvva"]},"audio/vnd.digital-winds":{"source":"iana","extensions":["eol"]},"audio/vnd.dlna.adts":{"source":"iana"},"audio/vnd.dolby.heaac.1":{"source":"iana"},"audio/vnd.dolby.heaac.2":{"source":"iana"},"audio/vnd.dolby.mlp":{"source":"iana"},"audio/vnd.dolby.mps":{"source":"iana"},"audio/vnd.dolby.pl2":{"source":"iana"},"audio/vnd.dolby.pl2x":{"source":"iana"},"audio/vnd.dolby.pl2z":{"source":"iana"},"audio/vnd.dolby.pulse.1":{"source":"iana"},"audio/vnd.dra":{"source":"iana","extensions":["dra"]},"audio/vnd.dts":{"source":"iana","extensions":["dts"]},"audio/vnd.dts.hd":{"source":"iana","extensions":["dtshd"]},"audio/vnd.dts.uhd":{"source":"iana"},"audio/vnd.dvb.file":{"source":"iana"},"audio/vnd.everad.plj":{"source":"iana"},"audio/vnd.hns.audio":{"source":"iana"},"audio/vnd.lucent.voice":{"source":"iana","extensions":["lvp"]},"audio/vnd.ms-playready.media.pya":{"source":"iana","extensions":["pya"]},"audio/vnd.nokia.mobile-xmf":{"source":"iana"},"audio/vnd.nortel.vbk":{"source":"iana"},"audio/vnd.nuera.ecelp4800":{"source":"iana","extensions":["ecelp4800"]},"audio/vnd.nuera.ecelp7470":{"source":"iana","extensions":["ecelp7470"]},"audio/vnd.nuera.ecelp9600":{"source":"iana","extensions":["ecelp9600"]},"audio/vnd.octel.sbc":{"source":"iana"},"audio/vnd.presonus.multitrack":{"source":"iana"},"audio/vnd.qcelp":{"source":"iana"},"audio/vnd.rhetorex.32kadpcm":{"source":"iana"},"audio/vnd.rip":{"source":"iana","extensions":["rip"]},"audio/vnd.rn-realaudio":{"compressible":false},"audio/vnd.sealedmedia.softseal.mpeg":{"source":"iana"},"audio/vnd.vmx.cvsd":{"source":"iana"},"audio/vnd.wave":{"compressible":false},"audio/vorbis":{"source":"iana","compressible":false},"audio/vorbis-config":{"source":"iana"},"audio/wav":{"compressible":false,"extensions":["wav"]},"audio/wave":{"compressible":false,"extensions":["wav"]},"audio/webm":{"source":"apache","compressible":false,"extensions":["weba"]},"audio/x-aac":{"source":"apache","compressible":false,"extensions":["aac"]},"audio/x-aiff":{"source":"apache","extensions":["aif","aiff","aifc"]},"audio/x-caf":{"source":"apache","compressible":false,"extensions":["caf"]},"audio/x-flac":{"source":"apache","extensions":["flac"]},"audio/x-m4a":{"source":"nginx","extensions":["m4a"]},"audio/x-matroska":{"source":"apache","extensions":["mka"]},"audio/x-mpegurl":{"source":"apache","extensions":["m3u"]},"audio/x-ms-wax":{"source":"apache","extensions":["wax"]},"audio/x-ms-wma":{"source":"apache","extensions":["wma"]},"audio/x-pn-realaudio":{"source":"apache","extensions":["ram","ra"]},"audio/x-pn-realaudio-plugin":{"source":"apache","extensions":["rmp"]},"audio/x-realaudio":{"source":"nginx","extensions":["ra"]},"audio/x-tta":{"source":"apache"},"audio/x-wav":{"source":"apache","extensions":["wav"]},"audio/xm":{"source":"apache","extensions":["xm"]},"chemical/x-cdx":{"source":"apache","extensions":["cdx"]},"chemical/x-cif":{"source":"apache","extensions":["cif"]},"chemical/x-cmdf":{"source":"apache","extensions":["cmdf"]},"chemical/x-cml":{"source":"apache","extensions":["cml"]},"chemical/x-csml":{"source":"apache","extensions":["csml"]},"chemical/x-pdb":{"source":"apache"},"chemical/x-xyz":{"source":"apache","extensions":["xyz"]},"font/collection":{"source":"iana","extensions":["ttc"]},"font/otf":{"source":"iana","compressible":true,"extensions":["otf"]},"font/sfnt":{"source":"iana"},"font/ttf":{"source":"iana","compressible":true,"extensions":["ttf"]},"font/woff":{"source":"iana","extensions":["woff"]},"font/woff2":{"source":"iana","extensions":["woff2"]},"image/aces":{"source":"iana","extensions":["exr"]},"image/apng":{"compressible":false,"extensions":["apng"]},"image/avci":{"source":"iana","extensions":["avci"]},"image/avcs":{"source":"iana","extensions":["avcs"]},"image/avif":{"source":"iana","compressible":false,"extensions":["avif"]},"image/bmp":{"source":"iana","compressible":true,"extensions":["bmp"]},"image/cgm":{"source":"iana","extensions":["cgm"]},"image/dicom-rle":{"source":"iana","extensions":["drle"]},"image/emf":{"source":"iana","extensions":["emf"]},"image/fits":{"source":"iana","extensions":["fits"]},"image/g3fax":{"source":"iana","extensions":["g3"]},"image/gif":{"source":"iana","compressible":false,"extensions":["gif"]},"image/heic":{"source":"iana","extensions":["heic"]},"image/heic-sequence":{"source":"iana","extensions":["heics"]},"image/heif":{"source":"iana","extensions":["heif"]},"image/heif-sequence":{"source":"iana","extensions":["heifs"]},"image/hej2k":{"source":"iana","extensions":["hej2"]},"image/hsj2":{"source":"iana","extensions":["hsj2"]},"image/ief":{"source":"iana","extensions":["ief"]},"image/jls":{"source":"iana","extensions":["jls"]},"image/jp2":{"source":"iana","compressible":false,"extensions":["jp2","jpg2"]},"image/jpeg":{"source":"iana","compressible":false,"extensions":["jpeg","jpg","jpe"]},"image/jph":{"source":"iana","extensions":["jph"]},"image/jphc":{"source":"iana","extensions":["jhc"]},"image/jpm":{"source":"iana","compressible":false,"extensions":["jpm"]},"image/jpx":{"source":"iana","compressible":false,"extensions":["jpx","jpf"]},"image/jxr":{"source":"iana","extensions":["jxr"]},"image/jxra":{"source":"iana","extensions":["jxra"]},"image/jxrs":{"source":"iana","extensions":["jxrs"]},"image/jxs":{"source":"iana","extensions":["jxs"]},"image/jxsc":{"source":"iana","extensions":["jxsc"]},"image/jxsi":{"source":"iana","extensions":["jxsi"]},"image/jxss":{"source":"iana","extensions":["jxss"]},"image/ktx":{"source":"iana","extensions":["ktx"]},"image/ktx2":{"source":"iana","extensions":["ktx2"]},"image/naplps":{"source":"iana"},"image/pjpeg":{"compressible":false},"image/png":{"source":"iana","compressible":false,"extensions":["png"]},"image/prs.btif":{"source":"iana","extensions":["btif"]},"image/prs.pti":{"source":"iana","extensions":["pti"]},"image/pwg-raster":{"source":"iana"},"image/sgi":{"source":"apache","extensions":["sgi"]},"image/svg+xml":{"source":"iana","compressible":true,"extensions":["svg","svgz"]},"image/t38":{"source":"iana","extensions":["t38"]},"image/tiff":{"source":"iana","compressible":false,"extensions":["tif","tiff"]},"image/tiff-fx":{"source":"iana","extensions":["tfx"]},"image/vnd.adobe.photoshop":{"source":"iana","compressible":true,"extensions":["psd"]},"image/vnd.airzip.accelerator.azv":{"source":"iana","extensions":["azv"]},"image/vnd.cns.inf2":{"source":"iana"},"image/vnd.dece.graphic":{"source":"iana","extensions":["uvi","uvvi","uvg","uvvg"]},"image/vnd.djvu":{"source":"iana","extensions":["djvu","djv"]},"image/vnd.dvb.subtitle":{"source":"iana","extensions":["sub"]},"image/vnd.dwg":{"source":"iana","extensions":["dwg"]},"image/vnd.dxf":{"source":"iana","extensions":["dxf"]},"image/vnd.fastbidsheet":{"source":"iana","extensions":["fbs"]},"image/vnd.fpx":{"source":"iana","extensions":["fpx"]},"image/vnd.fst":{"source":"iana","extensions":["fst"]},"image/vnd.fujixerox.edmics-mmr":{"source":"iana","extensions":["mmr"]},"image/vnd.fujixerox.edmics-rlc":{"source":"iana","extensions":["rlc"]},"image/vnd.globalgraphics.pgb":{"source":"iana"},"image/vnd.microsoft.icon":{"source":"iana","compressible":true,"extensions":["ico"]},"image/vnd.mix":{"source":"iana"},"image/vnd.mozilla.apng":{"source":"iana"},"image/vnd.ms-dds":{"compressible":true,"extensions":["dds"]},"image/vnd.ms-modi":{"source":"iana","extensions":["mdi"]},"image/vnd.ms-photo":{"source":"apache","extensions":["wdp"]},"image/vnd.net-fpx":{"source":"iana","extensions":["npx"]},"image/vnd.pco.b16":{"source":"iana","extensions":["b16"]},"image/vnd.radiance":{"source":"iana"},"image/vnd.sealed.png":{"source":"iana"},"image/vnd.sealedmedia.softseal.gif":{"source":"iana"},"image/vnd.sealedmedia.softseal.jpg":{"source":"iana"},"image/vnd.svf":{"source":"iana"},"image/vnd.tencent.tap":{"source":"iana","extensions":["tap"]},"image/vnd.valve.source.texture":{"source":"iana","extensions":["vtf"]},"image/vnd.wap.wbmp":{"source":"iana","extensions":["wbmp"]},"image/vnd.xiff":{"source":"iana","extensions":["xif"]},"image/vnd.zbrush.pcx":{"source":"iana","extensions":["pcx"]},"image/webp":{"source":"apache","extensions":["webp"]},"image/wmf":{"source":"iana","extensions":["wmf"]},"image/x-3ds":{"source":"apache","extensions":["3ds"]},"image/x-cmu-raster":{"source":"apache","extensions":["ras"]},"image/x-cmx":{"source":"apache","extensions":["cmx"]},"image/x-freehand":{"source":"apache","extensions":["fh","fhc","fh4","fh5","fh7"]},"image/x-icon":{"source":"apache","compressible":true,"extensions":["ico"]},"image/x-jng":{"source":"nginx","extensions":["jng"]},"image/x-mrsid-image":{"source":"apache","extensions":["sid"]},"image/x-ms-bmp":{"source":"nginx","compressible":true,"extensions":["bmp"]},"image/x-pcx":{"source":"apache","extensions":["pcx"]},"image/x-pict":{"source":"apache","extensions":["pic","pct"]},"image/x-portable-anymap":{"source":"apache","extensions":["pnm"]},"image/x-portable-bitmap":{"source":"apache","extensions":["pbm"]},"image/x-portable-graymap":{"source":"apache","extensions":["pgm"]},"image/x-portable-pixmap":{"source":"apache","extensions":["ppm"]},"image/x-rgb":{"source":"apache","extensions":["rgb"]},"image/x-tga":{"source":"apache","extensions":["tga"]},"image/x-xbitmap":{"source":"apache","extensions":["xbm"]},"image/x-xcf":{"compressible":false},"image/x-xpixmap":{"source":"apache","extensions":["xpm"]},"image/x-xwindowdump":{"source":"apache","extensions":["xwd"]},"message/cpim":{"source":"iana"},"message/delivery-status":{"source":"iana"},"message/disposition-notification":{"source":"iana","extensions":["disposition-notification"]},"message/external-body":{"source":"iana"},"message/feedback-report":{"source":"iana"},"message/global":{"source":"iana","extensions":["u8msg"]},"message/global-delivery-status":{"source":"iana","extensions":["u8dsn"]},"message/global-disposition-notification":{"source":"iana","extensions":["u8mdn"]},"message/global-headers":{"source":"iana","extensions":["u8hdr"]},"message/http":{"source":"iana","compressible":false},"message/imdn+xml":{"source":"iana","compressible":true},"message/news":{"source":"iana"},"message/partial":{"source":"iana","compressible":false},"message/rfc822":{"source":"iana","compressible":true,"extensions":["eml","mime"]},"message/s-http":{"source":"iana"},"message/sip":{"source":"iana"},"message/sipfrag":{"source":"iana"},"message/tracking-status":{"source":"iana"},"message/vnd.si.simp":{"source":"iana"},"message/vnd.wfa.wsc":{"source":"iana","extensions":["wsc"]},"model/3mf":{"source":"iana","extensions":["3mf"]},"model/e57":{"source":"iana"},"model/gltf+json":{"source":"iana","compressible":true,"extensions":["gltf"]},"model/gltf-binary":{"source":"iana","compressible":true,"extensions":["glb"]},"model/iges":{"source":"iana","compressible":false,"extensions":["igs","iges"]},"model/mesh":{"source":"iana","compressible":false,"extensions":["msh","mesh","silo"]},"model/mtl":{"source":"iana","extensions":["mtl"]},"model/obj":{"source":"iana","extensions":["obj"]},"model/step":{"source":"iana"},"model/step+xml":{"source":"iana","compressible":true,"extensions":["stpx"]},"model/step+zip":{"source":"iana","compressible":false,"extensions":["stpz"]},"model/step-xml+zip":{"source":"iana","compressible":false,"extensions":["stpxz"]},"model/stl":{"source":"iana","extensions":["stl"]},"model/vnd.collada+xml":{"source":"iana","compressible":true,"extensions":["dae"]},"model/vnd.dwf":{"source":"iana","extensions":["dwf"]},"model/vnd.flatland.3dml":{"source":"iana"},"model/vnd.gdl":{"source":"iana","extensions":["gdl"]},"model/vnd.gs-gdl":{"source":"apache"},"model/vnd.gs.gdl":{"source":"iana"},"model/vnd.gtw":{"source":"iana","extensions":["gtw"]},"model/vnd.moml+xml":{"source":"iana","compressible":true},"model/vnd.mts":{"source":"iana","extensions":["mts"]},"model/vnd.opengex":{"source":"iana","extensions":["ogex"]},"model/vnd.parasolid.transmit.binary":{"source":"iana","extensions":["x_b"]},"model/vnd.parasolid.transmit.text":{"source":"iana","extensions":["x_t"]},"model/vnd.pytha.pyox":{"source":"iana"},"model/vnd.rosette.annotated-data-model":{"source":"iana"},"model/vnd.sap.vds":{"source":"iana","extensions":["vds"]},"model/vnd.usdz+zip":{"source":"iana","compressible":false,"extensions":["usdz"]},"model/vnd.valve.source.compiled-map":{"source":"iana","extensions":["bsp"]},"model/vnd.vtu":{"source":"iana","extensions":["vtu"]},"model/vrml":{"source":"iana","compressible":false,"extensions":["wrl","vrml"]},"model/x3d+binary":{"source":"apache","compressible":false,"extensions":["x3db","x3dbz"]},"model/x3d+fastinfoset":{"source":"iana","extensions":["x3db"]},"model/x3d+vrml":{"source":"apache","compressible":false,"extensions":["x3dv","x3dvz"]},"model/x3d+xml":{"source":"iana","compressible":true,"extensions":["x3d","x3dz"]},"model/x3d-vrml":{"source":"iana","extensions":["x3dv"]},"multipart/alternative":{"source":"iana","compressible":false},"multipart/appledouble":{"source":"iana"},"multipart/byteranges":{"source":"iana"},"multipart/digest":{"source":"iana"},"multipart/encrypted":{"source":"iana","compressible":false},"multipart/form-data":{"source":"iana","compressible":false},"multipart/header-set":{"source":"iana"},"multipart/mixed":{"source":"iana"},"multipart/multilingual":{"source":"iana"},"multipart/parallel":{"source":"iana"},"multipart/related":{"source":"iana","compressible":false},"multipart/report":{"source":"iana"},"multipart/signed":{"source":"iana","compressible":false},"multipart/vnd.bint.med-plus":{"source":"iana"},"multipart/voice-message":{"source":"iana"},"multipart/x-mixed-replace":{"source":"iana"},"text/1d-interleaved-parityfec":{"source":"iana"},"text/cache-manifest":{"source":"iana","compressible":true,"extensions":["appcache","manifest"]},"text/calendar":{"source":"iana","extensions":["ics","ifb"]},"text/calender":{"compressible":true},"text/cmd":{"compressible":true},"text/coffeescript":{"extensions":["coffee","litcoffee"]},"text/cql":{"source":"iana"},"text/cql-expression":{"source":"iana"},"text/cql-identifier":{"source":"iana"},"text/css":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["css"]},"text/csv":{"source":"iana","compressible":true,"extensions":["csv"]},"text/csv-schema":{"source":"iana"},"text/directory":{"source":"iana"},"text/dns":{"source":"iana"},"text/ecmascript":{"source":"iana"},"text/encaprtp":{"source":"iana"},"text/enriched":{"source":"iana"},"text/fhirpath":{"source":"iana"},"text/flexfec":{"source":"iana"},"text/fwdred":{"source":"iana"},"text/gff3":{"source":"iana"},"text/grammar-ref-list":{"source":"iana"},"text/html":{"source":"iana","compressible":true,"extensions":["html","htm","shtml"]},"text/jade":{"extensions":["jade"]},"text/javascript":{"source":"iana","compressible":true},"text/jcr-cnd":{"source":"iana"},"text/jsx":{"compressible":true,"extensions":["jsx"]},"text/less":{"compressible":true,"extensions":["less"]},"text/markdown":{"source":"iana","compressible":true,"extensions":["markdown","md"]},"text/mathml":{"source":"nginx","extensions":["mml"]},"text/mdx":{"compressible":true,"extensions":["mdx"]},"text/mizar":{"source":"iana"},"text/n3":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["n3"]},"text/parameters":{"source":"iana","charset":"UTF-8"},"text/parityfec":{"source":"iana"},"text/plain":{"source":"iana","compressible":true,"extensions":["txt","text","conf","def","list","log","in","ini"]},"text/provenance-notation":{"source":"iana","charset":"UTF-8"},"text/prs.fallenstein.rst":{"source":"iana"},"text/prs.lines.tag":{"source":"iana","extensions":["dsc"]},"text/prs.prop.logic":{"source":"iana"},"text/raptorfec":{"source":"iana"},"text/red":{"source":"iana"},"text/rfc822-headers":{"source":"iana"},"text/richtext":{"source":"iana","compressible":true,"extensions":["rtx"]},"text/rtf":{"source":"iana","compressible":true,"extensions":["rtf"]},"text/rtp-enc-aescm128":{"source":"iana"},"text/rtploopback":{"source":"iana"},"text/rtx":{"source":"iana"},"text/sgml":{"source":"iana","extensions":["sgml","sgm"]},"text/shaclc":{"source":"iana"},"text/shex":{"source":"iana","extensions":["shex"]},"text/slim":{"extensions":["slim","slm"]},"text/spdx":{"source":"iana","extensions":["spdx"]},"text/strings":{"source":"iana"},"text/stylus":{"extensions":["stylus","styl"]},"text/t140":{"source":"iana"},"text/tab-separated-values":{"source":"iana","compressible":true,"extensions":["tsv"]},"text/troff":{"source":"iana","extensions":["t","tr","roff","man","me","ms"]},"text/turtle":{"source":"iana","charset":"UTF-8","extensions":["ttl"]},"text/ulpfec":{"source":"iana"},"text/uri-list":{"source":"iana","compressible":true,"extensions":["uri","uris","urls"]},"text/vcard":{"source":"iana","compressible":true,"extensions":["vcard"]},"text/vnd.a":{"source":"iana"},"text/vnd.abc":{"source":"iana"},"text/vnd.ascii-art":{"source":"iana"},"text/vnd.curl":{"source":"iana","extensions":["curl"]},"text/vnd.curl.dcurl":{"source":"apache","extensions":["dcurl"]},"text/vnd.curl.mcurl":{"source":"apache","extensions":["mcurl"]},"text/vnd.curl.scurl":{"source":"apache","extensions":["scurl"]},"text/vnd.debian.copyright":{"source":"iana","charset":"UTF-8"},"text/vnd.dmclientscript":{"source":"iana"},"text/vnd.dvb.subtitle":{"source":"iana","extensions":["sub"]},"text/vnd.esmertec.theme-descriptor":{"source":"iana","charset":"UTF-8"},"text/vnd.familysearch.gedcom":{"source":"iana","extensions":["ged"]},"text/vnd.ficlab.flt":{"source":"iana"},"text/vnd.fly":{"source":"iana","extensions":["fly"]},"text/vnd.fmi.flexstor":{"source":"iana","extensions":["flx"]},"text/vnd.gml":{"source":"iana"},"text/vnd.graphviz":{"source":"iana","extensions":["gv"]},"text/vnd.hans":{"source":"iana"},"text/vnd.hgl":{"source":"iana"},"text/vnd.in3d.3dml":{"source":"iana","extensions":["3dml"]},"text/vnd.in3d.spot":{"source":"iana","extensions":["spot"]},"text/vnd.iptc.newsml":{"source":"iana"},"text/vnd.iptc.nitf":{"source":"iana"},"text/vnd.latex-z":{"source":"iana"},"text/vnd.motorola.reflex":{"source":"iana"},"text/vnd.ms-mediapackage":{"source":"iana"},"text/vnd.net2phone.commcenter.command":{"source":"iana"},"text/vnd.radisys.msml-basic-layout":{"source":"iana"},"text/vnd.senx.warpscript":{"source":"iana"},"text/vnd.si.uricatalogue":{"source":"iana"},"text/vnd.sosi":{"source":"iana"},"text/vnd.sun.j2me.app-descriptor":{"source":"iana","charset":"UTF-8","extensions":["jad"]},"text/vnd.trolltech.linguist":{"source":"iana","charset":"UTF-8"},"text/vnd.wap.si":{"source":"iana"},"text/vnd.wap.sl":{"source":"iana"},"text/vnd.wap.wml":{"source":"iana","extensions":["wml"]},"text/vnd.wap.wmlscript":{"source":"iana","extensions":["wmls"]},"text/vtt":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["vtt"]},"text/x-asm":{"source":"apache","extensions":["s","asm"]},"text/x-c":{"source":"apache","extensions":["c","cc","cxx","cpp","h","hh","dic"]},"text/x-component":{"source":"nginx","extensions":["htc"]},"text/x-fortran":{"source":"apache","extensions":["f","for","f77","f90"]},"text/x-gwt-rpc":{"compressible":true},"text/x-handlebars-template":{"extensions":["hbs"]},"text/x-java-source":{"source":"apache","extensions":["java"]},"text/x-jquery-tmpl":{"compressible":true},"text/x-lua":{"extensions":["lua"]},"text/x-markdown":{"compressible":true,"extensions":["mkd"]},"text/x-nfo":{"source":"apache","extensions":["nfo"]},"text/x-opml":{"source":"apache","extensions":["opml"]},"text/x-org":{"compressible":true,"extensions":["org"]},"text/x-pascal":{"source":"apache","extensions":["p","pas"]},"text/x-processing":{"compressible":true,"extensions":["pde"]},"text/x-sass":{"extensions":["sass"]},"text/x-scss":{"extensions":["scss"]},"text/x-setext":{"source":"apache","extensions":["etx"]},"text/x-sfv":{"source":"apache","extensions":["sfv"]},"text/x-suse-ymp":{"compressible":true,"extensions":["ymp"]},"text/x-uuencode":{"source":"apache","extensions":["uu"]},"text/x-vcalendar":{"source":"apache","extensions":["vcs"]},"text/x-vcard":{"source":"apache","extensions":["vcf"]},"text/xml":{"source":"iana","compressible":true,"extensions":["xml"]},"text/xml-external-parsed-entity":{"source":"iana"},"text/yaml":{"compressible":true,"extensions":["yaml","yml"]},"video/1d-interleaved-parityfec":{"source":"iana"},"video/3gpp":{"source":"iana","extensions":["3gp","3gpp"]},"video/3gpp-tt":{"source":"iana"},"video/3gpp2":{"source":"iana","extensions":["3g2"]},"video/av1":{"source":"iana"},"video/bmpeg":{"source":"iana"},"video/bt656":{"source":"iana"},"video/celb":{"source":"iana"},"video/dv":{"source":"iana"},"video/encaprtp":{"source":"iana"},"video/ffv1":{"source":"iana"},"video/flexfec":{"source":"iana"},"video/h261":{"source":"iana","extensions":["h261"]},"video/h263":{"source":"iana","extensions":["h263"]},"video/h263-1998":{"source":"iana"},"video/h263-2000":{"source":"iana"},"video/h264":{"source":"iana","extensions":["h264"]},"video/h264-rcdo":{"source":"iana"},"video/h264-svc":{"source":"iana"},"video/h265":{"source":"iana"},"video/iso.segment":{"source":"iana","extensions":["m4s"]},"video/jpeg":{"source":"iana","extensions":["jpgv"]},"video/jpeg2000":{"source":"iana"},"video/jpm":{"source":"apache","extensions":["jpm","jpgm"]},"video/jxsv":{"source":"iana"},"video/mj2":{"source":"iana","extensions":["mj2","mjp2"]},"video/mp1s":{"source":"iana"},"video/mp2p":{"source":"iana"},"video/mp2t":{"source":"iana","extensions":["ts"]},"video/mp4":{"source":"iana","compressible":false,"extensions":["mp4","mp4v","mpg4"]},"video/mp4v-es":{"source":"iana"},"video/mpeg":{"source":"iana","compressible":false,"extensions":["mpeg","mpg","mpe","m1v","m2v"]},"video/mpeg4-generic":{"source":"iana"},"video/mpv":{"source":"iana"},"video/nv":{"source":"iana"},"video/ogg":{"source":"iana","compressible":false,"extensions":["ogv"]},"video/parityfec":{"source":"iana"},"video/pointer":{"source":"iana"},"video/quicktime":{"source":"iana","compressible":false,"extensions":["qt","mov"]},"video/raptorfec":{"source":"iana"},"video/raw":{"source":"iana"},"video/rtp-enc-aescm128":{"source":"iana"},"video/rtploopback":{"source":"iana"},"video/rtx":{"source":"iana"},"video/scip":{"source":"iana"},"video/smpte291":{"source":"iana"},"video/smpte292m":{"source":"iana"},"video/ulpfec":{"source":"iana"},"video/vc1":{"source":"iana"},"video/vc2":{"source":"iana"},"video/vnd.cctv":{"source":"iana"},"video/vnd.dece.hd":{"source":"iana","extensions":["uvh","uvvh"]},"video/vnd.dece.mobile":{"source":"iana","extensions":["uvm","uvvm"]},"video/vnd.dece.mp4":{"source":"iana"},"video/vnd.dece.pd":{"source":"iana","extensions":["uvp","uvvp"]},"video/vnd.dece.sd":{"source":"iana","extensions":["uvs","uvvs"]},"video/vnd.dece.video":{"source":"iana","extensions":["uvv","uvvv"]},"video/vnd.directv.mpeg":{"source":"iana"},"video/vnd.directv.mpeg-tts":{"source":"iana"},"video/vnd.dlna.mpeg-tts":{"source":"iana"},"video/vnd.dvb.file":{"source":"iana","extensions":["dvb"]},"video/vnd.fvt":{"source":"iana","extensions":["fvt"]},"video/vnd.hns.video":{"source":"iana"},"video/vnd.iptvforum.1dparityfec-1010":{"source":"iana"},"video/vnd.iptvforum.1dparityfec-2005":{"source":"iana"},"video/vnd.iptvforum.2dparityfec-1010":{"source":"iana"},"video/vnd.iptvforum.2dparityfec-2005":{"source":"iana"},"video/vnd.iptvforum.ttsavc":{"source":"iana"},"video/vnd.iptvforum.ttsmpeg2":{"source":"iana"},"video/vnd.motorola.video":{"source":"iana"},"video/vnd.motorola.videop":{"source":"iana"},"video/vnd.mpegurl":{"source":"iana","extensions":["mxu","m4u"]},"video/vnd.ms-playready.media.pyv":{"source":"iana","extensions":["pyv"]},"video/vnd.nokia.interleaved-multimedia":{"source":"iana"},"video/vnd.nokia.mp4vr":{"source":"iana"},"video/vnd.nokia.videovoip":{"source":"iana"},"video/vnd.objectvideo":{"source":"iana"},"video/vnd.radgamettools.bink":{"source":"iana"},"video/vnd.radgamettools.smacker":{"source":"iana"},"video/vnd.sealed.mpeg1":{"source":"iana"},"video/vnd.sealed.mpeg4":{"source":"iana"},"video/vnd.sealed.swf":{"source":"iana"},"video/vnd.sealedmedia.softseal.mov":{"source":"iana"},"video/vnd.uvvu.mp4":{"source":"iana","extensions":["uvu","uvvu"]},"video/vnd.vivo":{"source":"iana","extensions":["viv"]},"video/vnd.youtube.yt":{"source":"iana"},"video/vp8":{"source":"iana"},"video/vp9":{"source":"iana"},"video/webm":{"source":"apache","compressible":false,"extensions":["webm"]},"video/x-f4v":{"source":"apache","extensions":["f4v"]},"video/x-fli":{"source":"apache","extensions":["fli"]},"video/x-flv":{"source":"apache","compressible":false,"extensions":["flv"]},"video/x-m4v":{"source":"apache","extensions":["m4v"]},"video/x-matroska":{"source":"apache","compressible":false,"extensions":["mkv","mk3d","mks"]},"video/x-mng":{"source":"apache","extensions":["mng"]},"video/x-ms-asf":{"source":"apache","extensions":["asf","asx"]},"video/x-ms-vob":{"source":"apache","extensions":["vob"]},"video/x-ms-wm":{"source":"apache","extensions":["wm"]},"video/x-ms-wmv":{"source":"apache","compressible":false,"extensions":["wmv"]},"video/x-ms-wmx":{"source":"apache","extensions":["wmx"]},"video/x-ms-wvx":{"source":"apache","extensions":["wvx"]},"video/x-msvideo":{"source":"apache","extensions":["avi"]},"video/x-sgi-movie":{"source":"apache","extensions":["movie"]},"video/x-smv":{"source":"apache","extensions":["smv"]},"x-conference/x-cooltalk":{"source":"apache","extensions":["ice"]},"x-shader/x-fragment":{"compressible":true},"x-shader/x-vertex":{"compressible":true}}')
      }
    },
    t = {};

  function n(i) {
    var o = t[i];
    if (void 0 !== o) return o.exports;
    var r = t[i] = {
      id: i,
      loaded: !1,
      exports: {}
    };
    return e[i].call(r.exports, r, r.exports, n), r.loaded = !0, r.exports
  }
  n.n = e => {
    var t = e && e.__esModule ? () => e.default : () => e;
    return n.d(t, {
      a: t
    }), t
  }, n.d = (e, t) => {
    for (var i in t) n.o(t, i) && !n.o(e, i) && Object.defineProperty(e, i, {
      enumerable: !0,
      get: t[i]
    })
  }, n.hmd = e => ((e = Object.create(e)).children || (e.children = []), Object.defineProperty(e, "exports", {
    enumerable: !0,
    set: () => {
      throw new Error("ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: " + e.id)
    }
  }), e), n.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t), n.r = e => {
    "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
      value: "Module"
    }), Object.defineProperty(e, "__esModule", {
      value: !0
    })
  }, n.p = "";
  var i = {};
  (() => {
    "use strict";
    n.r(i), n.d(i, {
      default: () => qr
    });
    var e = n(7424),
      t = n.n(e),
      o = n(861),
      r = n.n(o),
      a = n(215),
      s = n.n(a),
      c = n(7156),
      p = n.n(c),
      u = n(6690),
      l = n.n(u),
      d = n(9728),
      f = n.n(d),
      m = n(6115),
      h = n.n(m),
      v = n(1588),
      g = n.n(v),
      x = n(1655),
      b = n.n(x),
      y = n(4993),
      w = n.n(y),
      _ = n(3808),
      E = n.n(_),
      S = n(8416),
      O = n.n(S),
      T = n(4687),
      C = n.n(T);
    const I = require("worker_threads");
    n(404), n(2957), n(7330);
    var N = n(8762);
    n(9284);
    const P = N;
    var k = n(5055),
      D = n.n(k);
    const A = {
      FAN_MODE: Object.freeze({
        SMART_MODE: "1",
        RPM_FIX_MODE: "0"
      }),
      mapPercentage2Rpm: function(e, t, n) {
        if (!t) return "0";
        if (e < 0 || e > 100) return "0";
        if (e < n.fixRpmMinDuty) return String(0);
        if (0 === t.filter((function(e) {
            return Number(e.rpm) > 0
          })).length) return String(0);
        var i = (n.fixRpmMax - n.fixRpmMin) / n.rpmStep,
          o = i < 1 ? 1 : (100 - n.fixRpmMinDuty) / i;
        return String(n.fixRpmMin + Math.ceil((e - n.fixRpmMinDuty) / o) * n.rpmStep)
      },
      defaultRpmMappingTable: Array.from({
        length: 11
      }).map((function(e, t) {
        return {
          id: String(t),
          rpm: "0"
        }
      }))
    };
    var j = n(8698),
      R = n.n(j);

    function L(e, t) {
      return function() {
        return e.apply(t, arguments)
      }
    }
    const {
      toString: F
    } = Object.prototype, {
      getPrototypeOf: M
    } = Object, U = (B = Object.create(null), e => {
      const t = F.call(e);
      return B[t] || (B[t] = t.slice(8, -1).toLowerCase())
    });
    var B;
    const z = e => (e = e.toLowerCase(), t => U(t) === e),
      q = e => t => typeof t === e,
      {
        isArray: V
      } = Array,
      G = q("undefined"),
      H = z("ArrayBuffer"),
      W = q("string"),
      K = q("function"),
      $ = q("number"),
      Y = e => null !== e && "object" == typeof e,
      X = e => {
        if ("object" !== U(e)) return !1;
        const t = M(e);
        return !(null !== t && t !== Object.prototype && null !== Object.getPrototypeOf(t) || Symbol.toStringTag in e || Symbol.iterator in e)
      },
      J = z("Date"),
      Q = z("File"),
      Z = z("Blob"),
      ee = z("FileList"),
      te = z("URLSearchParams");

    function ne(e, t, {
      allOwnKeys: n = !1
    } = {}) {
      if (null == e) return;
      let i, o;
      if ("object" != typeof e && (e = [e]), V(e))
        for (i = 0, o = e.length; i < o; i++) t.call(null, e[i], i, e);
      else {
        const o = n ? Object.getOwnPropertyNames(e) : Object.keys(e),
          r = o.length;
        let a;
        for (i = 0; i < r; i++) a = o[i], t.call(null, e[a], a, e)
      }
    }

    function ie(e, t) {
      t = t.toLowerCase();
      const n = Object.keys(e);
      let i, o = n.length;
      for (; o-- > 0;)
        if (i = n[o], t === i.toLowerCase()) return i;
      return null
    }
    const oe = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : "undefined" != typeof globalThis ? globalThis : global,
      re = e => !G(e) && e !== oe,
      ae = (se = "undefined" != typeof Uint8Array && M(Uint8Array), e => se && e instanceof se);
    var se;
    const ce = z("HTMLFormElement"),
      pe = (({
        hasOwnProperty: e
      }) => (t, n) => e.call(t, n))(Object.prototype),
      ue = z("RegExp"),
      le = (e, t) => {
        const n = Object.getOwnPropertyDescriptors(e),
          i = {};
        ne(n, ((n, o) => {
          !1 !== t(n, o, e) && (i[o] = n)
        })), Object.defineProperties(e, i)
      },
      de = "abcdefghijklmnopqrstuvwxyz",
      fe = "0123456789",
      me = {
        DIGIT: fe,
        ALPHA: de,
        ALPHA_DIGIT: de + de.toUpperCase() + fe
      },
      he = {
        isArray: V,
        isArrayBuffer: H,
        isBuffer: function(e) {
          return null !== e && !G(e) && null !== e.constructor && !G(e.constructor) && K(e.constructor.isBuffer) && e.constructor.isBuffer(e)
        },
        isFormData: e => {
          const t = "[object FormData]";
          return e && ("function" == typeof FormData && e instanceof FormData || F.call(e) === t || K(e.toString) && e.toString() === t)
        },
        isArrayBufferView: function(e) {
          let t;
          return t = "undefined" != typeof ArrayBuffer && ArrayBuffer.isView ? ArrayBuffer.isView(e) : e && e.buffer && H(e.buffer), t
        },
        isString: W,
        isNumber: $,
        isBoolean: e => !0 === e || !1 === e,
        isObject: Y,
        isPlainObject: X,
        isUndefined: G,
        isDate: J,
        isFile: Q,
        isBlob: Z,
        isRegExp: ue,
        isFunction: K,
        isStream: e => Y(e) && K(e.pipe),
        isURLSearchParams: te,
        isTypedArray: ae,
        isFileList: ee,
        forEach: ne,
        merge: function e() {
          const {
            caseless: t
          } = re(this) && this || {}, n = {}, i = (i, o) => {
            const r = t && ie(n, o) || o;
            X(n[r]) && X(i) ? n[r] = e(n[r], i) : X(i) ? n[r] = e({}, i) : V(i) ? n[r] = i.slice() : n[r] = i
          };
          for (let e = 0, t = arguments.length; e < t; e++) arguments[e] && ne(arguments[e], i);
          return n
        },
        extend: (e, t, n, {
          allOwnKeys: i
        } = {}) => (ne(t, ((t, i) => {
          n && K(t) ? e[i] = L(t, n) : e[i] = t
        }), {
          allOwnKeys: i
        }), e),
        trim: e => e.trim ? e.trim() : e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, ""),
        stripBOM: e => (65279 === e.charCodeAt(0) && (e = e.slice(1)), e),
        inherits: (e, t, n, i) => {
          e.prototype = Object.create(t.prototype, i), e.prototype.constructor = e, Object.defineProperty(e, "super", {
            value: t.prototype
          }), n && Object.assign(e.prototype, n)
        },
        toFlatObject: (e, t, n, i) => {
          let o, r, a;
          const s = {};
          if (t = t || {}, null == e) return t;
          do {
            for (o = Object.getOwnPropertyNames(e), r = o.length; r-- > 0;) a = o[r], i && !i(a, e, t) || s[a] || (t[a] = e[a], s[a] = !0);
            e = !1 !== n && M(e)
          } while (e && (!n || n(e, t)) && e !== Object.prototype);
          return t
        },
        kindOf: U,
        kindOfTest: z,
        endsWith: (e, t, n) => {
          e = String(e), (void 0 === n || n > e.length) && (n = e.length), n -= t.length;
          const i = e.indexOf(t, n);
          return -1 !== i && i === n
        },
        toArray: e => {
          if (!e) return null;
          if (V(e)) return e;
          let t = e.length;
          if (!$(t)) return null;
          const n = new Array(t);
          for (; t-- > 0;) n[t] = e[t];
          return n
        },
        forEachEntry: (e, t) => {
          const n = (e && e[Symbol.iterator]).call(e);
          let i;
          for (;
            (i = n.next()) && !i.done;) {
            const n = i.value;
            t.call(e, n[0], n[1])
          }
        },
        matchAll: (e, t) => {
          let n;
          const i = [];
          for (; null !== (n = e.exec(t));) i.push(n);
          return i
        },
        isHTMLForm: ce,
        hasOwnProperty: pe,
        hasOwnProp: pe,
        reduceDescriptors: le,
        freezeMethods: e => {
          le(e, ((t, n) => {
            if (K(e) && -1 !== ["arguments", "caller", "callee"].indexOf(n)) return !1;
            const i = e[n];
            K(i) && (t.enumerable = !1, "writable" in t ? t.writable = !1 : t.set || (t.set = () => {
              throw Error("Can not rewrite read-only method '" + n + "'")
            }))
          }))
        },
        toObjectSet: (e, t) => {
          const n = {},
            i = e => {
              e.forEach((e => {
                n[e] = !0
              }))
            };
          return V(e) ? i(e) : i(String(e).split(t)), n
        },
        toCamelCase: e => e.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, (function(e, t, n) {
          return t.toUpperCase() + n
        })),
        noop: () => {},
        toFiniteNumber: (e, t) => (e = +e, Number.isFinite(e) ? e : t),
        findKey: ie,
        global: oe,
        isContextDefined: re,
        ALPHABET: me,
        generateString: (e = 16, t = me.ALPHA_DIGIT) => {
          let n = "";
          const {
            length: i
          } = t;
          for (; e--;) n += t[Math.random() * i | 0];
          return n
        },
        isSpecCompliantForm: function(e) {
          return !!(e && K(e.append) && "FormData" === e[Symbol.toStringTag] && e[Symbol.iterator])
        },
        toJSONObject: e => {
          const t = new Array(10),
            n = (e, i) => {
              if (Y(e)) {
                if (t.indexOf(e) >= 0) return;
                if (!("toJSON" in e)) {
                  t[i] = e;
                  const o = V(e) ? [] : {};
                  return ne(e, ((e, t) => {
                    const r = n(e, i + 1);
                    !G(r) && (o[t] = r)
                  })), t[i] = void 0, o
                }
              }
              return e
            };
          return n(e, 0)
        }
      };

    function ve(e, t, n, i, o) {
      Error.call(this), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = (new Error).stack, this.message = e, this.name = "AxiosError", t && (this.code = t), n && (this.config = n), i && (this.request = i), o && (this.response = o)
    }
    he.inherits(ve, Error, {
      toJSON: function() {
        return {
          message: this.message,
          name: this.name,
          description: this.description,
          number: this.number,
          fileName: this.fileName,
          lineNumber: this.lineNumber,
          columnNumber: this.columnNumber,
          stack: this.stack,
          config: he.toJSONObject(this.config),
          code: this.code,
          status: this.response && this.response.status ? this.response.status : null
        }
      }
    });
    const ge = ve.prototype,
      xe = {};
    ["ERR_BAD_OPTION_VALUE", "ERR_BAD_OPTION", "ECONNABORTED", "ETIMEDOUT", "ERR_NETWORK", "ERR_FR_TOO_MANY_REDIRECTS", "ERR_DEPRECATED", "ERR_BAD_RESPONSE", "ERR_BAD_REQUEST", "ERR_CANCELED", "ERR_NOT_SUPPORT", "ERR_INVALID_URL"].forEach((e => {
      xe[e] = {
        value: e
      }
    })), Object.defineProperties(ve, xe), Object.defineProperty(ge, "isAxiosError", {
      value: !0
    }), ve.from = (e, t, n, i, o, r) => {
      const a = Object.create(ge);
      return he.toFlatObject(e, a, (function(e) {
        return e !== Error.prototype
      }), (e => "isAxiosError" !== e)), ve.call(a, e.message, t, n, i, o), a.cause = e, a.name = e.name, r && Object.assign(a, r), a
    };
    const be = ve,
      ye = n(6882);

    function we(e) {
      return he.isPlainObject(e) || he.isArray(e)
    }

    function _e(e) {
      return he.endsWith(e, "[]") ? e.slice(0, -2) : e
    }

    function Ee(e, t, n) {
      return e ? e.concat(t).map((function(e, t) {
        return e = _e(e), !n && t ? "[" + e + "]" : e
      })).join(n ? "." : "") : t
    }
    const Se = he.toFlatObject(he, {}, null, (function(e) {
        return /^is[A-Z]/.test(e)
      })),
      Oe = function(e, t, n) {
        if (!he.isObject(e)) throw new TypeError("target must be an object");
        t = t || new(ye || FormData);
        const i = (n = he.toFlatObject(n, {
            metaTokens: !0,
            dots: !1,
            indexes: !1
          }, !1, (function(e, t) {
            return !he.isUndefined(t[e])
          }))).metaTokens,
          o = n.visitor || p,
          r = n.dots,
          a = n.indexes,
          s = (n.Blob || "undefined" != typeof Blob && Blob) && he.isSpecCompliantForm(t);
        if (!he.isFunction(o)) throw new TypeError("visitor must be a function");

        function c(e) {
          if (null === e) return "";
          if (he.isDate(e)) return e.toISOString();
          if (!s && he.isBlob(e)) throw new be("Blob is not supported. Use a Buffer instead.");
          return he.isArrayBuffer(e) || he.isTypedArray(e) ? s && "function" == typeof Blob ? new Blob([e]) : Buffer.from(e) : e
        }

        function p(e, n, o) {
          let s = e;
          if (e && !o && "object" == typeof e)
            if (he.endsWith(n, "{}")) n = i ? n : n.slice(0, -2), e = JSON.stringify(e);
            else if (he.isArray(e) && function(e) {
              return he.isArray(e) && !e.some(we)
            }(e) || (he.isFileList(e) || he.endsWith(n, "[]")) && (s = he.toArray(e))) return n = _e(n), s.forEach((function(e, i) {
            !he.isUndefined(e) && null !== e && t.append(!0 === a ? Ee([n], i, r) : null === a ? n : n + "[]", c(e))
          })), !1;
          return !!we(e) || (t.append(Ee(o, n, r), c(e)), !1)
        }
        const u = [],
          l = Object.assign(Se, {
            defaultVisitor: p,
            convertValue: c,
            isVisitable: we
          });
        if (!he.isObject(e)) throw new TypeError("data must be an object");
        return function e(n, i) {
          if (!he.isUndefined(n)) {
            if (-1 !== u.indexOf(n)) throw Error("Circular reference detected in " + i.join("."));
            u.push(n), he.forEach(n, (function(n, r) {
              !0 === (!(he.isUndefined(n) || null === n) && o.call(t, n, he.isString(r) ? r.trim() : r, i, l)) && e(n, i ? i.concat(r) : [r])
            })), u.pop()
          }
        }(e), t
      };

    function Te(e) {
      const t = {
        "!": "%21",
        "'": "%27",
        "(": "%28",
        ")": "%29",
        "~": "%7E",
        "%20": "+",
        "%00": "\0"
      };
      return encodeURIComponent(e).replace(/[!'()~]|%20|%00/g, (function(e) {
        return t[e]
      }))
    }

    function Ce(e, t) {
      this._pairs = [], e && Oe(e, this, t)
    }
    const Ie = Ce.prototype;
    Ie.append = function(e, t) {
      this._pairs.push([e, t])
    }, Ie.toString = function(e) {
      const t = e ? function(t) {
        return e.call(this, t, Te)
      } : Te;
      return this._pairs.map((function(e) {
        return t(e[0]) + "=" + t(e[1])
      }), "").join("&")
    };
    const Ne = Ce;

    function Pe(e) {
      return encodeURIComponent(e).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]")
    }

    function ke(e, t, n) {
      if (!t) return e;
      const i = n && n.encode || Pe,
        o = n && n.serialize;
      let r;
      if (r = o ? o(t, n) : he.isURLSearchParams(t) ? t.toString() : new Ne(t, n).toString(i), r) {
        const t = e.indexOf("#"); - 1 !== t && (e = e.slice(0, t)), e += (-1 === e.indexOf("?") ? "?" : "&") + r
      }
      return e
    }
    const De = class {
        constructor() {
          this.handlers = []
        }
        use(e, t, n) {
          return this.handlers.push({
            fulfilled: e,
            rejected: t,
            synchronous: !!n && n.synchronous,
            runWhen: n ? n.runWhen : null
          }), this.handlers.length - 1
        }
        eject(e) {
          this.handlers[e] && (this.handlers[e] = null)
        }
        clear() {
          this.handlers && (this.handlers = [])
        }
        forEach(e) {
          he.forEach(this.handlers, (function(t) {
            null !== t && e(t)
          }))
        }
      },
      Ae = {
        silentJSONParsing: !0,
        forcedJSONParsing: !0,
        clarifyTimeoutError: !1
      },
      je = {
        isNode: !0,
        classes: {
          URLSearchParams: n(7310).URLSearchParams,
          FormData: ye,
          Blob: "undefined" != typeof Blob && Blob || null
        },
        protocols: ["http", "https", "file", "data"]
      },
      Re = function(e) {
        function t(e, n, i, o) {
          let r = e[o++];
          const a = Number.isFinite(+r),
            s = o >= e.length;
          return r = !r && he.isArray(i) ? i.length : r, s ? (he.hasOwnProp(i, r) ? i[r] = [i[r], n] : i[r] = n, !a) : (i[r] && he.isObject(i[r]) || (i[r] = []), t(e, n, i[r], o) && he.isArray(i[r]) && (i[r] = function(e) {
            const t = {},
              n = Object.keys(e);
            let i;
            const o = n.length;
            let r;
            for (i = 0; i < o; i++) r = n[i], t[r] = e[r];
            return t
          }(i[r])), !a)
        }
        if (he.isFormData(e) && he.isFunction(e.entries)) {
          const n = {};
          return he.forEachEntry(e, ((e, i) => {
            t(function(e) {
              return he.matchAll(/\w+|\[(\w*)]/g, e).map((e => "[]" === e[0] ? "" : e[1] || e[0]))
            }(e), i, n, 0)
          })), n
        }
        return null
      },
      Le = {
        "Content-Type": void 0
      },
      Fe = {
        transitional: Ae,
        adapter: ["xhr", "http"],
        transformRequest: [function(e, t) {
          const n = t.getContentType() || "",
            i = n.indexOf("application/json") > -1,
            o = he.isObject(e);
          if (o && he.isHTMLForm(e) && (e = new FormData(e)), he.isFormData(e)) return i && i ? JSON.stringify(Re(e)) : e;
          if (he.isArrayBuffer(e) || he.isBuffer(e) || he.isStream(e) || he.isFile(e) || he.isBlob(e)) return e;
          if (he.isArrayBufferView(e)) return e.buffer;
          if (he.isURLSearchParams(e)) return t.setContentType("application/x-www-form-urlencoded;charset=utf-8", !1), e.toString();
          let r;
          if (o) {
            if (n.indexOf("application/x-www-form-urlencoded") > -1) return function(e, t) {
              return Oe(e, new je.classes.URLSearchParams, Object.assign({
                visitor: function(e, t, n, i) {
                  return je.isNode && he.isBuffer(e) ? (this.append(t, e.toString("base64")), !1) : i.defaultVisitor.apply(this, arguments)
                }
              }, t))
            }(e, this.formSerializer).toString();
            if ((r = he.isFileList(e)) || n.indexOf("multipart/form-data") > -1) {
              const t = this.env && this.env.FormData;
              return Oe(r ? {
                "files[]": e
              } : e, t && new t, this.formSerializer)
            }
          }
          return o || i ? (t.setContentType("application/json", !1), function(e, t, n) {
            if (he.isString(e)) try {
              return (0, JSON.parse)(e), he.trim(e)
            } catch (e) {
              if ("SyntaxError" !== e.name) throw e
            }
            return (0, JSON.stringify)(e)
          }(e)) : e
        }],
        transformResponse: [function(e) {
          const t = this.transitional || Fe.transitional,
            n = t && t.forcedJSONParsing,
            i = "json" === this.responseType;
          if (e && he.isString(e) && (n && !this.responseType || i)) {
            const n = !(t && t.silentJSONParsing) && i;
            try {
              return JSON.parse(e)
            } catch (e) {
              if (n) {
                if ("SyntaxError" === e.name) throw be.from(e, be.ERR_BAD_RESPONSE, this, null, this.response);
                throw e
              }
            }
          }
          return e
        }],
        timeout: 0,
        xsrfCookieName: "XSRF-TOKEN",
        xsrfHeaderName: "X-XSRF-TOKEN",
        maxContentLength: -1,
        maxBodyLength: -1,
        env: {
          FormData: je.classes.FormData,
          Blob: je.classes.Blob
        },
        validateStatus: function(e) {
          return e >= 200 && e < 300
        },
        headers: {
          common: {
            Accept: "application/json, text/plain, */*"
          }
        }
      };
    he.forEach(["delete", "get", "head"], (function(e) {
      Fe.headers[e] = {}
    })), he.forEach(["post", "put", "patch"], (function(e) {
      Fe.headers[e] = he.merge(Le)
    }));
    const Me = Fe,
      Ue = he.toObjectSet(["age", "authorization", "content-length", "content-type", "etag", "expires", "from", "host", "if-modified-since", "if-unmodified-since", "last-modified", "location", "max-forwards", "proxy-authorization", "referer", "retry-after", "user-agent"]),
      Be = Symbol("internals");

    function ze(e) {
      return e && String(e).trim().toLowerCase()
    }

    function qe(e) {
      return !1 === e || null == e ? e : he.isArray(e) ? e.map(qe) : String(e)
    }

    function Ve(e, t, n, i, o) {
      return he.isFunction(i) ? i.call(this, t, n) : (o && (t = n), he.isString(t) ? he.isString(i) ? -1 !== t.indexOf(i) : he.isRegExp(i) ? i.test(t) : void 0 : void 0)
    }
    class Ge {
      constructor(e) {
        e && this.set(e)
      }
      set(e, t, n) {
        const i = this;

        function o(e, t, n) {
          const o = ze(t);
          if (!o) throw new Error("header name must be a non-empty string");
          const r = he.findKey(i, o);
          (!r || void 0 === i[r] || !0 === n || void 0 === n && !1 !== i[r]) && (i[r || t] = qe(e))
        }
        const r = (e, t) => he.forEach(e, ((e, n) => o(e, n, t)));
        return he.isPlainObject(e) || e instanceof this.constructor ? r(e, t) : he.isString(e) && (e = e.trim()) && !/^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(e.trim()) ? r((e => {
          const t = {};
          let n, i, o;
          return e && e.split("\n").forEach((function(e) {
            o = e.indexOf(":"), n = e.substring(0, o).trim().toLowerCase(), i = e.substring(o + 1).trim(), !n || t[n] && Ue[n] || ("set-cookie" === n ? t[n] ? t[n].push(i) : t[n] = [i] : t[n] = t[n] ? t[n] + ", " + i : i)
          })), t
        })(e), t) : null != e && o(t, e, n), this
      }
      get(e, t) {
        if (e = ze(e)) {
          const n = he.findKey(this, e);
          if (n) {
            const e = this[n];
            if (!t) return e;
            if (!0 === t) return function(e) {
              const t = Object.create(null),
                n = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
              let i;
              for (; i = n.exec(e);) t[i[1]] = i[2];
              return t
            }(e);
            if (he.isFunction(t)) return t.call(this, e, n);
            if (he.isRegExp(t)) return t.exec(e);
            throw new TypeError("parser must be boolean|regexp|function")
          }
        }
      }
      has(e, t) {
        if (e = ze(e)) {
          const n = he.findKey(this, e);
          return !(!n || void 0 === this[n] || t && !Ve(0, this[n], n, t))
        }
        return !1
      }
      delete(e, t) {
        const n = this;
        let i = !1;

        function o(e) {
          if (e = ze(e)) {
            const o = he.findKey(n, e);
            !o || t && !Ve(0, n[o], o, t) || (delete n[o], i = !0)
          }
        }
        return he.isArray(e) ? e.forEach(o) : o(e), i
      }
      clear(e) {
        const t = Object.keys(this);
        let n = t.length,
          i = !1;
        for (; n--;) {
          const o = t[n];
          e && !Ve(0, this[o], o, e, !0) || (delete this[o], i = !0)
        }
        return i
      }
      normalize(e) {
        const t = this,
          n = {};
        return he.forEach(this, ((i, o) => {
          const r = he.findKey(n, o);
          if (r) return t[r] = qe(i), void delete t[o];
          const a = e ? function(e) {
            return e.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, ((e, t, n) => t.toUpperCase() + n))
          }(o) : String(o).trim();
          a !== o && delete t[o], t[a] = qe(i), n[a] = !0
        })), this
      }
      concat(...e) {
        return this.constructor.concat(this, ...e)
      }
      toJSON(e) {
        const t = Object.create(null);
        return he.forEach(this, ((n, i) => {
          null != n && !1 !== n && (t[i] = e && he.isArray(n) ? n.join(", ") : n)
        })), t
      } [Symbol.iterator]() {
        return Object.entries(this.toJSON())[Symbol.iterator]()
      }
      toString() {
        return Object.entries(this.toJSON()).map((([e, t]) => e + ": " + t)).join("\n")
      }
      get[Symbol.toStringTag]() {
        return "AxiosHeaders"
      }
      static from(e) {
        return e instanceof this ? e : new this(e)
      }
      static concat(e, ...t) {
        const n = new this(e);
        return t.forEach((e => n.set(e))), n
      }
      static accessor(e) {
        const t = (this[Be] = this[Be] = {
            accessors: {}
          }).accessors,
          n = this.prototype;

        function i(e) {
          const i = ze(e);
          t[i] || (function(e, t) {
            const n = he.toCamelCase(" " + t);
            ["get", "set", "has"].forEach((i => {
              Object.defineProperty(e, i + n, {
                value: function(e, n, o) {
                  return this[i].call(this, t, e, n, o)
                },
                configurable: !0
              })
            }))
          }(n, e), t[i] = !0)
        }
        return he.isArray(e) ? e.forEach(i) : i(e), this
      }
    }
    Ge.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]), he.freezeMethods(Ge.prototype), he.freezeMethods(Ge);
    const He = Ge;

    function We(e, t) {
      const n = this || Me,
        i = t || n,
        o = He.from(i.headers);
      let r = i.data;
      return he.forEach(e, (function(e) {
        r = e.call(n, r, o.normalize(), t ? t.status : void 0)
      })), o.normalize(), r
    }

    function Ke(e) {
      return !(!e || !e.__CANCEL__)
    }

    function $e(e, t, n) {
      be.call(this, null == e ? "canceled" : e, be.ERR_CANCELED, t, n), this.name = "CanceledError"
    }
    he.inherits($e, be, {
      __CANCEL__: !0
    });
    const Ye = $e;

    function Xe(e, t, n) {
      const i = n.config.validateStatus;
      n.status && i && !i(n.status) ? t(new be("Request failed with status code " + n.status, [be.ERR_BAD_REQUEST, be.ERR_BAD_RESPONSE][Math.floor(n.status / 100) - 4], n.config, n.request, n)) : e(n)
    }

    function Je(e, t) {
      return e && ! function(e) {
        return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(e)
      }(t) ? function(e, t) {
        return t ? e.replace(/\/+$/, "") + "/" + t.replace(/^\/+/, "") : e
      }(e, t) : t
    }
    var Qe = n(1394),
      Ze = n(3685),
      et = n(5687),
      tt = n(3837),
      nt = n(938),
      it = n(9796);
    const ot = "1.3.5";

    function rt(e) {
      const t = /^([-+\w]{1,25})(:?\/\/|:)/.exec(e);
      return t && t[1] || ""
    }
    const at = /^(?:([^;]+);)?(?:[^;]+;)?(base64|),([\s\S]*)$/;
    var st = n(2781);
    const ct = function(e, t) {
        e = e || 10;
        const n = new Array(e),
          i = new Array(e);
        let o, r = 0,
          a = 0;
        return t = void 0 !== t ? t : 1e3,
          function(s) {
            const c = Date.now(),
              p = i[a];
            o || (o = c), n[r] = s, i[r] = c;
            let u = a,
              l = 0;
            for (; u !== r;) l += n[u++], u %= e;
            if (r = (r + 1) % e, r === a && (a = (a + 1) % e), c - o < t) return;
            const d = p && c - p;
            return d ? Math.round(1e3 * l / d) : void 0
          }
      },
      pt = Symbol("internals");
    class ut extends st.Transform {
      constructor(e) {
        super({
          readableHighWaterMark: (e = he.toFlatObject(e, {
            maxRate: 0,
            chunkSize: 65536,
            minChunkSize: 100,
            timeWindow: 500,
            ticksRate: 2,
            samplesCount: 15
          }, null, ((e, t) => !he.isUndefined(t[e])))).chunkSize
        });
        const t = this,
          n = this[pt] = {
            length: e.length,
            timeWindow: e.timeWindow,
            ticksRate: e.ticksRate,
            chunkSize: e.chunkSize,
            maxRate: e.maxRate,
            minChunkSize: e.minChunkSize,
            bytesSeen: 0,
            isCaptured: !1,
            notifiedBytesLoaded: 0,
            ts: Date.now(),
            bytes: 0,
            onReadCallback: null
          },
          i = ct(n.ticksRate * e.samplesCount, n.timeWindow);
        this.on("newListener", (e => {
          "progress" === e && (n.isCaptured || (n.isCaptured = !0))
        }));
        let o = 0;
        n.updateProgress = function(e, t) {
          let n = 0;
          const i = 1e3 / t;
          let o = null;
          return function(t, r) {
            const a = Date.now();
            if (t || a - n > i) return o && (clearTimeout(o), o = null), n = a, e.apply(null, r);
            o || (o = setTimeout((() => (o = null, n = Date.now(), e.apply(null, r))), i - (a - n)))
          }
        }((function() {
          const e = n.length,
            r = n.bytesSeen,
            a = r - o;
          if (!a || t.destroyed) return;
          const s = i(a);
          o = r, process.nextTick((() => {
            t.emit("progress", {
              loaded: r,
              total: e,
              progress: e ? r / e : void 0,
              bytes: a,
              rate: s || void 0,
              estimated: s && e && r <= e ? (e - r) / s : void 0
            })
          }))
        }), n.ticksRate);
        const r = () => {
          n.updateProgress(!0)
        };
        this.once("end", r), this.once("error", r)
      }
      _read(e) {
        const t = this[pt];
        return t.onReadCallback && t.onReadCallback(), super._read(e)
      }
      _transform(e, t, n) {
        const i = this,
          o = this[pt],
          r = o.maxRate,
          a = this.readableHighWaterMark,
          s = o.timeWindow,
          c = r / (1e3 / s),
          p = !1 !== o.minChunkSize ? Math.max(o.minChunkSize, .01 * c) : 0,
          u = (e, t) => {
            const n = Buffer.byteLength(e);
            let u, l = null,
              d = a,
              f = 0;
            if (r) {
              const e = Date.now();
              (!o.ts || (f = e - o.ts) >= s) && (o.ts = e, u = c - o.bytes, o.bytes = u < 0 ? -u : 0, f = 0), u = c - o.bytes
            }
            if (r) {
              if (u <= 0) return setTimeout((() => {
                t(null, e)
              }), s - f);
              u < d && (d = u)
            }
            d && n > d && n - d > p && (l = e.subarray(d), e = e.subarray(0, d)),
              function(e, t) {
                const n = Buffer.byteLength(e);
                o.bytesSeen += n, o.bytes += n, o.isCaptured && o.updateProgress(), i.push(e) ? process.nextTick(t) : o.onReadCallback = () => {
                  o.onReadCallback = null, process.nextTick(t)
                }
              }(e, l ? () => {
                process.nextTick(t, null, l)
              } : t)
          };
        u(e, (function e(t, i) {
          if (t) return n(t);
          i ? u(i, e) : n(null)
        }))
      }
      setLength(e) {
        return this[pt].length = +e, this
      }
    }
    const lt = ut;
    var dt = n(2361);
    const {
      asyncIterator: ft
    } = Symbol, mt = async function*(e) {
      e.stream ? yield* e.stream(): e.arrayBuffer ? yield await e.arrayBuffer(): e[ft] ? yield* e[ft](): yield e
    }, ht = he.ALPHABET.ALPHA_DIGIT + "-_", vt = new tt.TextEncoder, gt = "\r\n", xt = vt.encode(gt);
    class bt {
      constructor(e, t) {
        const {
          escapeName: n
        } = this.constructor, i = he.isString(t);
        let o = `Content-Disposition: form-data; name="${n(e)}"${!i&&t.name?`; filename="${n(t.name)}"`:""}${gt}`;
        i ? t = vt.encode(String(t).replace(/\r?\n|\r\n?/g, gt)) : o += `Content-Type: ${t.type||"application/octet-stream"}${gt}`, this.headers = vt.encode(o + gt), this.contentLength = i ? t.byteLength : t.size, this.size = this.headers.byteLength + this.contentLength + 2, this.name = e, this.value = t
      }
      async * encode() {
        yield this.headers;
        const {
          value: e
        } = this;
        he.isTypedArray(e) ? yield e: yield* mt(e), yield xt
      }
      static escapeName(e) {
        return String(e).replace(/[\r\n"]/g, (e => ({
          "\r": "%0D",
          "\n": "%0A",
          '"': "%22"
        } [e])))
      }
    }
    class yt extends st.Transform {
      __transform(e, t, n) {
        this.push(e), n()
      }
      _transform(e, t, n) {
        if (0 !== e.length && (this._transform = this.__transform, 120 !== e[0])) {
          const e = Buffer.alloc(2);
          e[0] = 120, e[1] = 156, this.push(e, t)
        }
        this.__transform(e, t, n)
      }
    }
    const wt = yt,
      _t = {
        flush: it.constants.Z_SYNC_FLUSH,
        finishFlush: it.constants.Z_SYNC_FLUSH
      },
      Et = {
        flush: it.constants.BROTLI_OPERATION_FLUSH,
        finishFlush: it.constants.BROTLI_OPERATION_FLUSH
      },
      St = he.isFunction(it.createBrotliDecompress),
      {
        http: Ot,
        https: Tt
      } = nt,
      Ct = /https:?/,
      It = je.protocols.map((e => e + ":"));

    function Nt(e) {
      e.beforeRedirects.proxy && e.beforeRedirects.proxy(e), e.beforeRedirects.config && e.beforeRedirects.config(e)
    }

    function Pt(e, t, n) {
      let i = t;
      if (!i && !1 !== i) {
        const e = (0, Qe.j)(n);
        e && (i = new URL(e))
      }
      if (i) {
        if (i.username && (i.auth = (i.username || "") + ":" + (i.password || "")), i.auth) {
          (i.auth.username || i.auth.password) && (i.auth = (i.auth.username || "") + ":" + (i.auth.password || ""));
          const t = Buffer.from(i.auth, "utf8").toString("base64");
          e.headers["Proxy-Authorization"] = "Basic " + t
        }
        e.headers.host = e.hostname + (e.port ? ":" + e.port : "");
        const t = i.hostname || i.host;
        e.hostname = t, e.host = t, e.port = i.port, e.path = n, i.protocol && (e.protocol = i.protocol.includes(":") ? i.protocol : `${i.protocol}:`)
      }
      e.beforeRedirects.proxy = function(e) {
        Pt(e, t, e.href)
      }
    }
    const kt = "undefined" != typeof process && "process" === he.kindOf(process) && function(e) {
        return t = async function(t, n, i) {
          let {
            data: o
          } = e;
          const {
            responseType: r,
            responseEncoding: a
          } = e, s = e.method.toUpperCase();
          let c, p, u = !1;
          const l = new dt,
            d = () => {
              e.cancelToken && e.cancelToken.unsubscribe(f), e.signal && e.signal.removeEventListener("abort", f), l.removeAllListeners()
            };

          function f(t) {
            l.emit("abort", !t || t.type ? new Ye(null, e, p) : t)
          }
          i(((e, t) => {
            c = !0, t && (u = !0, d())
          })), l.once("abort", n), (e.cancelToken || e.signal) && (e.cancelToken && e.cancelToken.subscribe(f), e.signal && (e.signal.aborted ? f() : e.signal.addEventListener("abort", f)));
          const m = Je(e.baseURL, e.url),
            h = new URL(m, "http://localhost"),
            v = h.protocol || It[0];
          if ("data:" === v) {
            let i;
            if ("GET" !== s) return Xe(t, n, {
              status: 405,
              statusText: "method not allowed",
              headers: {},
              config: e
            });
            try {
              i = function(e, t, n) {
                const i = n && n.Blob || je.classes.Blob,
                  o = rt(e);
                if (void 0 === t && i && (t = !0), "data" === o) {
                  e = o.length ? e.slice(o.length + 1) : e;
                  const n = at.exec(e);
                  if (!n) throw new be("Invalid URL", be.ERR_INVALID_URL);
                  const r = n[1],
                    a = n[2],
                    s = n[3],
                    c = Buffer.from(decodeURIComponent(s), a ? "base64" : "utf8");
                  if (t) {
                    if (!i) throw new be("Blob is not supported", be.ERR_NOT_SUPPORT);
                    return new i([c], {
                      type: r
                    })
                  }
                  return c
                }
                throw new be("Unsupported protocol " + o, be.ERR_NOT_SUPPORT)
              }(e.url, "blob" === r, {
                Blob: e.env && e.env.Blob
              })
            } catch (t) {
              throw be.from(t, be.ERR_BAD_REQUEST, e)
            }
            return "text" === r ? (i = i.toString(a), a && "utf8" !== a || (i = he.stripBOM(i))) : "stream" === r && (i = st.Readable.from(i)), Xe(t, n, {
              data: i,
              status: 200,
              statusText: "OK",
              headers: new He,
              config: e
            })
          }
          if (-1 === It.indexOf(v)) return n(new be("Unsupported protocol " + v, be.ERR_BAD_REQUEST, e));
          const g = He.from(e.headers).normalize();
          g.set("User-Agent", "axios/" + ot, !1);
          const x = e.onDownloadProgress,
            b = e.onUploadProgress,
            y = e.maxRate;
          let w, _;
          if (he.isSpecCompliantForm(o)) {
            const e = g.getContentType(/boundary=([-_\w\d]{10,70})/i);
            o = ((e, t, n) => {
              const {
                tag: i = "form-data-boundary",
                size: o = 25,
                boundary: r = i + "-" + he.generateString(o, ht)
              } = n || {};
              if (!he.isFormData(e)) throw TypeError("FormData instance required");
              if (r.length < 1 || r.length > 70) throw Error("boundary must be 10-70 characters long");
              const a = vt.encode("--" + r + gt),
                s = vt.encode("--" + r + "--" + gt + gt);
              let c = s.byteLength;
              const p = Array.from(e.entries()).map((([e, t]) => {
                const n = new bt(e, t);
                return c += n.size, n
              }));
              c += a.byteLength * p.length, c = he.toFiniteNumber(c);
              const u = {
                "Content-Type": `multipart/form-data; boundary=${r}`
              };
              return Number.isFinite(c) && (u["Content-Length"] = c), t && t(u), st.Readable.from(async function*() {
                for (const e of p) yield a, yield* e.encode();
                yield s
              }())
            })(o, (e => {
              g.set(e)
            }), {
              tag: `axios-${ot}-boundary`,
              boundary: e && e[1] || void 0
            })
          } else if (he.isFormData(o) && he.isFunction(o.getHeaders)) {
            if (g.set(o.getHeaders()), !g.hasContentLength()) try {
              const e = await tt.promisify(o.getLength).call(o);
              Number.isFinite(e) && e >= 0 && g.setContentLength(e)
            } catch (e) {}
          } else if (he.isBlob(o)) o.size && g.setContentType(o.type || "application/octet-stream"), g.setContentLength(o.size || 0), o = st.Readable.from(mt(o));
          else if (o && !he.isStream(o)) {
            if (Buffer.isBuffer(o));
            else if (he.isArrayBuffer(o)) o = Buffer.from(new Uint8Array(o));
            else {
              if (!he.isString(o)) return n(new be("Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream", be.ERR_BAD_REQUEST, e));
              o = Buffer.from(o, "utf-8")
            }
            if (g.setContentLength(o.length, !1), e.maxBodyLength > -1 && o.length > e.maxBodyLength) return n(new be("Request body larger than maxBodyLength limit", be.ERR_BAD_REQUEST, e))
          }
          const E = he.toFiniteNumber(g.getContentLength());
          let S, O;
          he.isArray(y) ? (w = y[0], _ = y[1]) : w = _ = y, o && (b || w) && (he.isStream(o) || (o = st.Readable.from(o, {
            objectMode: !1
          })), o = st.pipeline([o, new lt({
            length: E,
            maxRate: he.toFiniteNumber(w)
          })], he.noop), b && o.on("progress", (e => {
            b(Object.assign(e, {
              upload: !0
            }))
          }))), e.auth && (S = (e.auth.username || "") + ":" + (e.auth.password || "")), !S && h.username && (S = h.username + ":" + h.password), S && g.delete("authorization");
          try {
            O = ke(h.pathname + h.search, e.params, e.paramsSerializer).replace(/^\?/, "")
          } catch (t) {
            const i = new Error(t.message);
            return i.config = e, i.url = e.url, i.exists = !0, n(i)
          }
          g.set("Accept-Encoding", "gzip, compress, deflate" + (St ? ", br" : ""), !1);
          const T = {
            path: O,
            method: s,
            headers: g.toJSON(),
            agents: {
              http: e.httpAgent,
              https: e.httpsAgent
            },
            auth: S,
            protocol: v,
            beforeRedirect: Nt,
            beforeRedirects: {}
          };
          let C;
          e.socketPath ? T.socketPath = e.socketPath : (T.hostname = h.hostname, T.port = h.port, Pt(T, e.proxy, v + "//" + h.hostname + (h.port ? ":" + h.port : "") + T.path));
          const I = Ct.test(T.protocol);
          if (T.agent = I ? e.httpsAgent : e.httpAgent, e.transport ? C = e.transport : 0 === e.maxRedirects ? C = I ? et : Ze : (e.maxRedirects && (T.maxRedirects = e.maxRedirects), e.beforeRedirect && (T.beforeRedirects.config = e.beforeRedirect), C = I ? Tt : Ot), e.maxBodyLength > -1 ? T.maxBodyLength = e.maxBodyLength : T.maxBodyLength = 1 / 0, e.insecureHTTPParser && (T.insecureHTTPParser = e.insecureHTTPParser), p = C.request(T, (function(i) {
              if (p.destroyed) return;
              const o = [i],
                c = +i.headers["content-length"];
              if (x) {
                const e = new lt({
                  length: he.toFiniteNumber(c),
                  maxRate: he.toFiniteNumber(_)
                });
                x && e.on("progress", (e => {
                  x(Object.assign(e, {
                    download: !0
                  }))
                })), o.push(e)
              }
              let f = i;
              const m = i.req || p;
              if (!1 !== e.decompress && i.headers["content-encoding"]) switch ("HEAD" !== s && 204 !== i.statusCode || delete i.headers["content-encoding"], i.headers["content-encoding"]) {
                case "gzip":
                case "x-gzip":
                case "compress":
                case "x-compress":
                  o.push(it.createUnzip(_t)), delete i.headers["content-encoding"];
                  break;
                case "deflate":
                  o.push(new wt), o.push(it.createUnzip(_t)), delete i.headers["content-encoding"];
                  break;
                case "br":
                  St && (o.push(it.createBrotliDecompress(Et)), delete i.headers["content-encoding"])
              }
              f = o.length > 1 ? st.pipeline(o, he.noop) : o[0];
              const h = st.finished(f, (() => {
                  h(), d()
                })),
                v = {
                  status: i.statusCode,
                  statusText: i.statusMessage,
                  headers: new He(i.headers),
                  config: e,
                  request: m
                };
              if ("stream" === r) v.data = f, Xe(t, n, v);
              else {
                const i = [];
                let o = 0;
                f.on("data", (function(t) {
                  i.push(t), o += t.length, e.maxContentLength > -1 && o > e.maxContentLength && (u = !0, f.destroy(), n(new be("maxContentLength size of " + e.maxContentLength + " exceeded", be.ERR_BAD_RESPONSE, e, m)))
                })), f.on("aborted", (function() {
                  if (u) return;
                  const t = new be("maxContentLength size of " + e.maxContentLength + " exceeded", be.ERR_BAD_RESPONSE, e, m);
                  f.destroy(t), n(t)
                })), f.on("error", (function(t) {
                  p.destroyed || n(be.from(t, null, e, m))
                })), f.on("end", (function() {
                  try {
                    let e = 1 === i.length ? i[0] : Buffer.concat(i);
                    "arraybuffer" !== r && (e = e.toString(a), a && "utf8" !== a || (e = he.stripBOM(e))), v.data = e
                  } catch (t) {
                    n(be.from(t, null, e, v.request, v))
                  }
                  Xe(t, n, v)
                }))
              }
              l.once("abort", (e => {
                f.destroyed || (f.emit("error", e), f.destroy())
              }))
            })), l.once("abort", (e => {
              n(e), p.destroy(e)
            })), p.on("error", (function(t) {
              n(be.from(t, null, e, p))
            })), p.on("socket", (function(e) {
              e.setKeepAlive(!0, 6e4)
            })), e.timeout) {
            const t = parseInt(e.timeout, 10);
            if (isNaN(t)) return void n(new be("error trying to parse `config.timeout` to int", be.ERR_BAD_OPTION_VALUE, e, p));
            p.setTimeout(t, (function() {
              if (c) return;
              let t = e.timeout ? "timeout of " + e.timeout + "ms exceeded" : "timeout exceeded";
              const i = e.transitional || Ae;
              e.timeoutErrorMessage && (t = e.timeoutErrorMessage), n(new be(t, i.clarifyTimeoutError ? be.ETIMEDOUT : be.ECONNABORTED, e, p)), f()
            }))
          }
          if (he.isStream(o)) {
            let t = !1,
              n = !1;
            o.on("end", (() => {
              t = !0
            })), o.once("error", (e => {
              n = !0, p.destroy(e)
            })), o.on("close", (() => {
              t || n || f(new Ye("Request stream has been aborted", e, p))
            })), o.pipe(p)
          } else p.end(o)
        }, new Promise(((e, n) => {
          let i, o;
          const r = (e, t) => {
              o || (o = !0, i && i(e, t))
            },
            a = e => {
              r(e, !0), n(e)
            };
          t((t => {
            r(t), e(t)
          }), a, (e => i = e)).catch(a)
        }));
        var t
      },
      Dt = je.isStandardBrowserEnv ? {
        write: function(e, t, n, i, o, r) {
          const a = [];
          a.push(e + "=" + encodeURIComponent(t)), he.isNumber(n) && a.push("expires=" + new Date(n).toGMTString()), he.isString(i) && a.push("path=" + i), he.isString(o) && a.push("domain=" + o), !0 === r && a.push("secure"), document.cookie = a.join("; ")
        },
        read: function(e) {
          const t = document.cookie.match(new RegExp("(^|;\\s*)(" + e + ")=([^;]*)"));
          return t ? decodeURIComponent(t[3]) : null
        },
        remove: function(e) {
          this.write(e, "", Date.now() - 864e5)
        }
      } : {
        write: function() {},
        read: function() {
          return null
        },
        remove: function() {}
      },
      At = je.isStandardBrowserEnv ? function() {
        const e = /(msie|trident)/i.test(navigator.userAgent),
          t = document.createElement("a");
        let n;

        function i(n) {
          let i = n;
          return e && (t.setAttribute("href", i), i = t.href), t.setAttribute("href", i), {
            href: t.href,
            protocol: t.protocol ? t.protocol.replace(/:$/, "") : "",
            host: t.host,
            search: t.search ? t.search.replace(/^\?/, "") : "",
            hash: t.hash ? t.hash.replace(/^#/, "") : "",
            hostname: t.hostname,
            port: t.port,
            pathname: "/" === t.pathname.charAt(0) ? t.pathname : "/" + t.pathname
          }
        }
        return n = i(globalThis.location.href),
          function(e) {
            const t = he.isString(e) ? i(e) : e;
            return t.protocol === n.protocol && t.host === n.host
          }
      }() : function() {
        return !0
      };

    function jt(e, t) {
      let n = 0;
      const i = ct(50, 250);
      return o => {
        const r = o.loaded,
          a = o.lengthComputable ? o.total : void 0,
          s = r - n,
          c = i(s);
        n = r;
        const p = {
          loaded: r,
          total: a,
          progress: a ? r / a : void 0,
          bytes: s,
          rate: c || void 0,
          estimated: c && a && r <= a ? (a - r) / c : void 0,
          event: o
        };
        p[t ? "download" : "upload"] = !0, e(p)
      }
    }
    const Rt = {
      http: kt,
      xhr: "undefined" != typeof XMLHttpRequest && function(e) {
        return new Promise((function(t, n) {
          let i = e.data;
          const o = He.from(e.headers).normalize(),
            r = e.responseType;
          let a;

          function s() {
            e.cancelToken && e.cancelToken.unsubscribe(a), e.signal && e.signal.removeEventListener("abort", a)
          }
          he.isFormData(i) && (je.isStandardBrowserEnv || je.isStandardBrowserWebWorkerEnv) && o.setContentType(!1);
          let c = new XMLHttpRequest;
          if (e.auth) {
            const t = e.auth.username || "",
              n = e.auth.password ? unescape(encodeURIComponent(e.auth.password)) : "";
            o.set("Authorization", "Basic " + btoa(t + ":" + n))
          }
          const p = Je(e.baseURL, e.url);

          function u() {
            if (!c) return;
            const i = He.from("getAllResponseHeaders" in c && c.getAllResponseHeaders());
            Xe((function(e) {
              t(e), s()
            }), (function(e) {
              n(e), s()
            }), {
              data: r && "text" !== r && "json" !== r ? c.response : c.responseText,
              status: c.status,
              statusText: c.statusText,
              headers: i,
              config: e,
              request: c
            }), c = null
          }
          if (c.open(e.method.toUpperCase(), ke(p, e.params, e.paramsSerializer), !0), c.timeout = e.timeout, "onloadend" in c ? c.onloadend = u : c.onreadystatechange = function() {
              c && 4 === c.readyState && (0 !== c.status || c.responseURL && 0 === c.responseURL.indexOf("file:")) && setTimeout(u)
            }, c.onabort = function() {
              c && (n(new be("Request aborted", be.ECONNABORTED, e, c)), c = null)
            }, c.onerror = function() {
              n(new be("Network Error", be.ERR_NETWORK, e, c)), c = null
            }, c.ontimeout = function() {
              let t = e.timeout ? "timeout of " + e.timeout + "ms exceeded" : "timeout exceeded";
              const i = e.transitional || Ae;
              e.timeoutErrorMessage && (t = e.timeoutErrorMessage), n(new be(t, i.clarifyTimeoutError ? be.ETIMEDOUT : be.ECONNABORTED, e, c)), c = null
            }, je.isStandardBrowserEnv) {
            const t = (e.withCredentials || At(p)) && e.xsrfCookieName && Dt.read(e.xsrfCookieName);
            t && o.set(e.xsrfHeaderName, t)
          }
          void 0 === i && o.setContentType(null), "setRequestHeader" in c && he.forEach(o.toJSON(), (function(e, t) {
            c.setRequestHeader(t, e)
          })), he.isUndefined(e.withCredentials) || (c.withCredentials = !!e.withCredentials), r && "json" !== r && (c.responseType = e.responseType), "function" == typeof e.onDownloadProgress && c.addEventListener("progress", jt(e.onDownloadProgress, !0)), "function" == typeof e.onUploadProgress && c.upload && c.upload.addEventListener("progress", jt(e.onUploadProgress)), (e.cancelToken || e.signal) && (a = t => {
            c && (n(!t || t.type ? new Ye(null, e, c) : t), c.abort(), c = null)
          }, e.cancelToken && e.cancelToken.subscribe(a), e.signal && (e.signal.aborted ? a() : e.signal.addEventListener("abort", a)));
          const l = rt(p);
          l && -1 === je.protocols.indexOf(l) ? n(new be("Unsupported protocol " + l + ":", be.ERR_BAD_REQUEST, e)) : c.send(i || null)
        }))
      }
    };
    he.forEach(Rt, ((e, t) => {
      if (e) {
        try {
          Object.defineProperty(e, "name", {
            value: t
          })
        } catch (e) {}
        Object.defineProperty(e, "adapterName", {
          value: t
        })
      }
    }));

    function Lt(e) {
      if (e.cancelToken && e.cancelToken.throwIfRequested(), e.signal && e.signal.aborted) throw new Ye(null, e)
    }

    function Ft(e) {
      return Lt(e), e.headers = He.from(e.headers), e.data = We.call(e, e.transformRequest), -1 !== ["post", "put", "patch"].indexOf(e.method) && e.headers.setContentType("application/x-www-form-urlencoded", !1), (e => {
        e = he.isArray(e) ? e : [e];
        const {
          length: t
        } = e;
        let n, i;
        for (let o = 0; o < t && (n = e[o], !(i = he.isString(n) ? Rt[n.toLowerCase()] : n)); o++);
        if (!i) {
          if (!1 === i) throw new be(`Adapter ${n} is not supported by the environment`, "ERR_NOT_SUPPORT");
          throw new Error(he.hasOwnProp(Rt, n) ? `Adapter '${n}' is not available in the build` : `Unknown adapter '${n}'`)
        }
        if (!he.isFunction(i)) throw new TypeError("adapter is not a function");
        return i
      })(e.adapter || Me.adapter)(e).then((function(t) {
        return Lt(e), t.data = We.call(e, e.transformResponse, t), t.headers = He.from(t.headers), t
      }), (function(t) {
        return Ke(t) || (Lt(e), t && t.response && (t.response.data = We.call(e, e.transformResponse, t.response), t.response.headers = He.from(t.response.headers))), Promise.reject(t)
      }))
    }
    const Mt = e => e instanceof He ? e.toJSON() : e;

    function Ut(e, t) {
      t = t || {};
      const n = {};

      function i(e, t, n) {
        return he.isPlainObject(e) && he.isPlainObject(t) ? he.merge.call({
          caseless: n
        }, e, t) : he.isPlainObject(t) ? he.merge({}, t) : he.isArray(t) ? t.slice() : t
      }

      function o(e, t, n) {
        return he.isUndefined(t) ? he.isUndefined(e) ? void 0 : i(void 0, e, n) : i(e, t, n)
      }

      function r(e, t) {
        if (!he.isUndefined(t)) return i(void 0, t)
      }

      function a(e, t) {
        return he.isUndefined(t) ? he.isUndefined(e) ? void 0 : i(void 0, e) : i(void 0, t)
      }

      function s(n, o, r) {
        return r in t ? i(n, o) : r in e ? i(void 0, n) : void 0
      }
      const c = {
        url: r,
        method: r,
        data: r,
        baseURL: a,
        transformRequest: a,
        transformResponse: a,
        paramsSerializer: a,
        timeout: a,
        timeoutMessage: a,
        withCredentials: a,
        adapter: a,
        responseType: a,
        xsrfCookieName: a,
        xsrfHeaderName: a,
        onUploadProgress: a,
        onDownloadProgress: a,
        decompress: a,
        maxContentLength: a,
        maxBodyLength: a,
        beforeRedirect: a,
        transport: a,
        httpAgent: a,
        httpsAgent: a,
        cancelToken: a,
        socketPath: a,
        responseEncoding: a,
        validateStatus: s,
        headers: (e, t) => o(Mt(e), Mt(t), !0)
      };
      return he.forEach(Object.keys(e).concat(Object.keys(t)), (function(i) {
        const r = c[i] || o,
          a = r(e[i], t[i], i);
        he.isUndefined(a) && r !== s || (n[i] = a)
      })), n
    }
    const Bt = {};
    ["object", "boolean", "number", "function", "string", "symbol"].forEach(((e, t) => {
      Bt[e] = function(n) {
        return typeof n === e || "a" + (t < 1 ? "n " : " ") + e
      }
    }));
    const zt = {};
    Bt.transitional = function(e, t, n) {
      function i(e, t) {
        return "[Axios v1.3.5] Transitional option '" + e + "'" + t + (n ? ". " + n : "")
      }
      return (n, o, r) => {
        if (!1 === e) throw new be(i(o, " has been removed" + (t ? " in " + t : "")), be.ERR_DEPRECATED);
        return t && !zt[o] && (zt[o] = !0, console.warn(i(o, " has been deprecated since v" + t + " and will be removed in the near future"))), !e || e(n, o, r)
      }
    };
    const qt = {
        assertOptions: function(e, t, n) {
          if ("object" != typeof e) throw new be("options must be an object", be.ERR_BAD_OPTION_VALUE);
          const i = Object.keys(e);
          let o = i.length;
          for (; o-- > 0;) {
            const r = i[o],
              a = t[r];
            if (a) {
              const t = e[r],
                n = void 0 === t || a(t, r, e);
              if (!0 !== n) throw new be("option " + r + " must be " + n, be.ERR_BAD_OPTION_VALUE)
            } else if (!0 !== n) throw new be("Unknown option " + r, be.ERR_BAD_OPTION)
          }
        },
        validators: Bt
      },
      Vt = qt.validators;
    class Gt {
      constructor(e) {
        this.defaults = e, this.interceptors = {
          request: new De,
          response: new De
        }
      }
      request(e, t) {
        "string" == typeof e ? (t = t || {}).url = e : t = e || {}, t = Ut(this.defaults, t);
        const {
          transitional: n,
          paramsSerializer: i,
          headers: o
        } = t;
        let r;
        void 0 !== n && qt.assertOptions(n, {
          silentJSONParsing: Vt.transitional(Vt.boolean),
          forcedJSONParsing: Vt.transitional(Vt.boolean),
          clarifyTimeoutError: Vt.transitional(Vt.boolean)
        }, !1), null != i && (he.isFunction(i) ? t.paramsSerializer = {
          serialize: i
        } : qt.assertOptions(i, {
          encode: Vt.function,
          serialize: Vt.function
        }, !0)), t.method = (t.method || this.defaults.method || "get").toLowerCase(), r = o && he.merge(o.common, o[t.method]), r && he.forEach(["delete", "get", "head", "post", "put", "patch", "common"], (e => {
          delete o[e]
        })), t.headers = He.concat(r, o);
        const a = [];
        let s = !0;
        this.interceptors.request.forEach((function(e) {
          "function" == typeof e.runWhen && !1 === e.runWhen(t) || (s = s && e.synchronous, a.unshift(e.fulfilled, e.rejected))
        }));
        const c = [];
        let p;
        this.interceptors.response.forEach((function(e) {
          c.push(e.fulfilled, e.rejected)
        }));
        let u, l = 0;
        if (!s) {
          const e = [Ft.bind(this), void 0];
          for (e.unshift.apply(e, a), e.push.apply(e, c), u = e.length, p = Promise.resolve(t); l < u;) p = p.then(e[l++], e[l++]);
          return p
        }
        u = a.length;
        let d = t;
        for (l = 0; l < u;) {
          const e = a[l++],
            t = a[l++];
          try {
            d = e(d)
          } catch (e) {
            t.call(this, e);
            break
          }
        }
        try {
          p = Ft.call(this, d)
        } catch (e) {
          return Promise.reject(e)
        }
        for (l = 0, u = c.length; l < u;) p = p.then(c[l++], c[l++]);
        return p
      }
      getUri(e) {
        return ke(Je((e = Ut(this.defaults, e)).baseURL, e.url), e.params, e.paramsSerializer)
      }
    }
    he.forEach(["delete", "get", "head", "options"], (function(e) {
      Gt.prototype[e] = function(t, n) {
        return this.request(Ut(n || {}, {
          method: e,
          url: t,
          data: (n || {}).data
        }))
      }
    })), he.forEach(["post", "put", "patch"], (function(e) {
      function t(t) {
        return function(n, i, o) {
          return this.request(Ut(o || {}, {
            method: e,
            headers: t ? {
              "Content-Type": "multipart/form-data"
            } : {},
            url: n,
            data: i
          }))
        }
      }
      Gt.prototype[e] = t(), Gt.prototype[e + "Form"] = t(!0)
    }));
    const Ht = Gt;
    class Wt {
      constructor(e) {
        if ("function" != typeof e) throw new TypeError("executor must be a function.");
        let t;
        this.promise = new Promise((function(e) {
          t = e
        }));
        const n = this;
        this.promise.then((e => {
          if (!n._listeners) return;
          let t = n._listeners.length;
          for (; t-- > 0;) n._listeners[t](e);
          n._listeners = null
        })), this.promise.then = e => {
          let t;
          const i = new Promise((e => {
            n.subscribe(e), t = e
          })).then(e);
          return i.cancel = function() {
            n.unsubscribe(t)
          }, i
        }, e((function(e, i, o) {
          n.reason || (n.reason = new Ye(e, i, o), t(n.reason))
        }))
      }
      throwIfRequested() {
        if (this.reason) throw this.reason
      }
      subscribe(e) {
        this.reason ? e(this.reason) : this._listeners ? this._listeners.push(e) : this._listeners = [e]
      }
      unsubscribe(e) {
        if (!this._listeners) return;
        const t = this._listeners.indexOf(e); - 1 !== t && this._listeners.splice(t, 1)
      }
      static source() {
        let e;
        const t = new Wt((function(t) {
          e = t
        }));
        return {
          token: t,
          cancel: e
        }
      }
    }
    const Kt = Wt,
      $t = {
        Continue: 100,
        SwitchingProtocols: 101,
        Processing: 102,
        EarlyHints: 103,
        Ok: 200,
        Created: 201,
        Accepted: 202,
        NonAuthoritativeInformation: 203,
        NoContent: 204,
        ResetContent: 205,
        PartialContent: 206,
        MultiStatus: 207,
        AlreadyReported: 208,
        ImUsed: 226,
        MultipleChoices: 300,
        MovedPermanently: 301,
        Found: 302,
        SeeOther: 303,
        NotModified: 304,
        UseProxy: 305,
        Unused: 306,
        TemporaryRedirect: 307,
        PermanentRedirect: 308,
        BadRequest: 400,
        Unauthorized: 401,
        PaymentRequired: 402,
        Forbidden: 403,
        NotFound: 404,
        MethodNotAllowed: 405,
        NotAcceptable: 406,
        ProxyAuthenticationRequired: 407,
        RequestTimeout: 408,
        Conflict: 409,
        Gone: 410,
        LengthRequired: 411,
        PreconditionFailed: 412,
        PayloadTooLarge: 413,
        UriTooLong: 414,
        UnsupportedMediaType: 415,
        RangeNotSatisfiable: 416,
        ExpectationFailed: 417,
        ImATeapot: 418,
        MisdirectedRequest: 421,
        UnprocessableEntity: 422,
        Locked: 423,
        FailedDependency: 424,
        TooEarly: 425,
        UpgradeRequired: 426,
        PreconditionRequired: 428,
        TooManyRequests: 429,
        RequestHeaderFieldsTooLarge: 431,
        UnavailableForLegalReasons: 451,
        InternalServerError: 500,
        NotImplemented: 501,
        BadGateway: 502,
        ServiceUnavailable: 503,
        GatewayTimeout: 504,
        HttpVersionNotSupported: 505,
        VariantAlsoNegotiates: 506,
        InsufficientStorage: 507,
        LoopDetected: 508,
        NotExtended: 510,
        NetworkAuthenticationRequired: 511
      };
    Object.entries($t).forEach((([e, t]) => {
      $t[t] = e
    }));
    const Yt = $t,
      Xt = function e(t) {
        const n = new Ht(t),
          i = L(Ht.prototype.request, n);
        return he.extend(i, Ht.prototype, n, {
          allOwnKeys: !0
        }), he.extend(i, n, null, {
          allOwnKeys: !0
        }), i.create = function(n) {
          return e(Ut(t, n))
        }, i
      }(Me);
    Xt.Axios = Ht, Xt.CanceledError = Ye, Xt.CancelToken = Kt, Xt.isCancel = Ke, Xt.VERSION = ot, Xt.toFormData = Oe, Xt.AxiosError = be, Xt.Cancel = Xt.CanceledError, Xt.all = function(e) {
      return Promise.all(e)
    }, Xt.spread = function(e) {
      return function(t) {
        return e.apply(null, t)
      }
    }, Xt.isAxiosError = function(e) {
      return he.isObject(e) && !0 === e.isAxiosError
    }, Xt.mergeConfig = Ut, Xt.AxiosHeaders = He, Xt.formToJSON = e => Re(he.isHTMLForm(e) ? new FormData(e) : e), Xt.HttpStatusCode = Yt, Xt.default = Xt;
    const Jt = Xt;

    function Qt(e, t) {
      var n = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var i = Object.getOwnPropertySymbols(e);
        t && (i = i.filter((function(t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable
        }))), n.push.apply(n, i)
      }
      return n
    }

    function Zt(e) {
      for (var t = 1; t < arguments.length; t++) {
        var n = null != arguments[t] ? arguments[t] : {};
        t % 2 ? Qt(Object(n), !0).forEach((function(t) {
          O()(e, t, n[t])
        })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Qt(Object(n)).forEach((function(t) {
          Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
        }))
      }
      return e
    }

    function en(e, t) {
      (null == t || t > e.length) && (t = e.length);
      for (var n = 0, i = new Array(t); n < t; n++) i[n] = e[n];
      return i
    }
    var tn = function() {
      function e() {
        l()(this, e)
      }
      return f()(e, null, [{
        key: "clone",
        value: function(t) {
          if (null === t || "object" !== R()(t)) return t;
          var n = new t.constructor;
          if (t instanceof Set) {
            var i, o = function(e, t) {
              var n = "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
              if (!n) {
                if (Array.isArray(e) || (n = function(e, t) {
                    if (e) {
                      if ("string" == typeof e) return en(e, t);
                      var n = Object.prototype.toString.call(e).slice(8, -1);
                      return "Object" === n && e.constructor && (n = e.constructor.name), "Map" === n || "Set" === n ? Array.from(e) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? en(e, t) : void 0
                    }
                  }(e)) || t && e && "number" == typeof e.length) {
                  n && (e = n);
                  var i = 0,
                    o = function() {};
                  return {
                    s: o,
                    n: function() {
                      return i >= e.length ? {
                        done: !0
                      } : {
                        done: !1,
                        value: e[i++]
                      }
                    },
                    e: function(e) {
                      throw e
                    },
                    f: o
                  }
                }
                throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
              }
              var r, a = !0,
                s = !1;
              return {
                s: function() {
                  n = n.call(e)
                },
                n: function() {
                  var e = n.next();
                  return a = e.done, e
                },
                e: function(e) {
                  s = !0, r = e
                },
                f: function() {
                  try {
                    a || null == n.return || n.return()
                  } finally {
                    if (s) throw r
                  }
                }
              }
            }(t.keys());
            try {
              for (o.s(); !(i = o.n()).done;) {
                var r = i.value;
                n.add(r)
              }
            } catch (e) {
              o.e(e)
            } finally {
              o.f()
            }
          } else Object.keys(t).forEach((function(i) {
            n[i] = e.clone(t[i])
          }));
          return n
        }
      }, {
        key: "isEquivalent",
        value: function(t, n) {
          if ("object" === R()(t) && "object" === R()(n) && null !== t && null !== n) {
            if (Array.isArray(t) && Array.isArray(n)) {
              if (t.length !== n.length) return !1;
              for (var i = 0; i < t.length; i += 1)
                if (!e.isEquivalent(t[i], n[i])) return !1
            }
            var o = Object.getOwnPropertyNames(t),
              r = Object.getOwnPropertyNames(n);
            if (o.length !== r.length) return !1;
            for (var a = 0; a < o.length; a += 1) {
              var s = o[a];
              if ("key" !== s)
                if ("object" === R()(t[s])) {
                  if (!e.isEquivalent(t[s], n[s])) return !1
                } else if ("div" === t.type) {
                if (!e.isEquivalent(t[s], n[s])) return !1
              } else if (t[s] !== n[s]) return !1
            }
            for (var c = 0; c < r.length; c += 1) {
              var p = r[c];
              if ("key" !== p)
                if ("object" === R()(n[p])) {
                  if (!e.isEquivalent(t[p], n[p])) return !1
                } else if ("div" === t.type) {
                if (!e.isEquivalent(t[p], n[p])) return !1
              } else if (t[p] !== n[p]) return !1
            }
          } else if (t !== n) return !1;
          return !0
        }
      }, {
        key: "isStringNumber",
        value: function(e) {
          return /^\d+$/.test(e)
        }
      }, {
        key: "isErrorCode",
        value: function(e) {
          return /^[A-Z]{1}-\d{4,5}$/.test(e)
        }
      }, {
        key: "isJSON",
        value: function(e) {
          try {
            return "object" === R()(e) ? e : "string" == typeof e && JSON.parse(e)
          } catch (e) {
            return !1
          }
        }
      }, {
        key: "generateUUID",
        value: function() {
          var e = Date.now();
          return "undefined" != typeof performance && "function" == typeof performance.now && (e += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (function(t) {
            var n = (e + 16 * Math.random()) % 16 | 0;
            return e = Math.floor(e / 16), ("x" === t ? n : n ? 3 : 8).toString(16)
          }))
        }
      }, {
        key: "getEncodedFormData",
        value: function(t) {
          var n = new FormData,
            i = new Blob([e.encodeStr2UTF16(t)], {
              encoding: "UTF-16",
              type: "text/plain;charset=UTF-16"
            });
          return n.append("file", i, "1.xml"), n
        }
      }, {
        key: "encodeStr2UTF16",
        value: function(e) {
          for (var t = new ArrayBuffer(2 * e.length), n = new Uint16Array(t), i = 0, o = e.length; i < o; i += 1) n[i] = e.charCodeAt(i);
          return n
        }
      }, {
        key: "decodeUTF162Str",
        value: function(e) {
          for (var t = [], n = 0; n < e.length; n += 2) t.push(e.charCodeAt(n) | e.charCodeAt(n + 1) << 8);
          return String.fromCharCode.apply(String, t)
        }
      }, {
        key: "parseXML",
        value: function(e) {
          var t = null;
          if (globalThis.DOMParser) try {
            t = (new DOMParser).parseFromString(e, "text/xml")
          } catch (e) {
            t = null
          } else if (globalThis.ActiveXObject) try {
            (t = new(0, globalThis.ActiveXObject)("Microsoft.XMLDOM")).async = !1, t.loadXML(e)
          } catch (e) {
            t = null
          }
          return t
        }
      }, {
        key: "rgbToHex",
        value: function(e, t, n) {
          return "#".concat(((1 << 24) + (e << 16) + (t << 8) + parseInt(n, 10)).toString(16).slice(1))
        }
      }, {
        key: "keyboardGetKeyNumberByRowCol",
        value: function(e, t) {
          "string" == typeof e && (e = parseInt(e, 10)), "string" == typeof t && (t = parseInt(t, 10));
          var n = e.toString(16);
          n.length < 2 && (n = "0".concat(n));
          var i = t.toString(16);
          i.length < 2 && (i = "0".concat(i));
          var o = "".concat(i).concat(n);
          return parseInt(o, 16)
        }
      }, {
        key: "keyboardGetKeyNumber",
        value: function(e, t, n, i) {
          if (void 0 !== n && void 0 !== i && Array.isArray(t) && n >= 0 && n < t.length && Array.isArray(t[n]) && i >= 0 && i < t[n].length && e === t[n][i]) return this.keyboardGetKeyNumberByRowCol(n, i);
          for (var o = "", r = "", a = 0; a < t.length; a += 1) {
            var s = t[a].indexOf(e);
            if (-1 !== s) {
              (o = a.toString(16)).length < 2 && (o = "0".concat(o)), (r = s.toString(16)).length < 2 && (r = "0".concat(r));
              break
            }
          }
          var c = "".concat(r).concat(o);
          return parseInt(c, 16)
        }
      }, {
        key: "keyboardGetKeyName",
        value: function(e, t) {
          var n = Number(e).toString(16);
          n.length < 2 ? n = "000".concat(n) : n.length < 3 ? n = "00".concat(n) : n.length < 4 && (n = "0".concat(n));
          var i = parseInt(n.substr("0", "2"), 16);
          return t[parseInt(n.substr("2", "2"), 16)][i]
        }
      }, {
        key: "keyboardGetMappingKey",
        value: function(e, t, n, i) {
          var o = i.layout,
            r = null;
          return o.find((function(i) {
            return !!(r = i.find((function(i) {
              return !!(n && i.col === e && i.row === t && i.altKey === n || i.col === e && i.row === t)
            })))
          })), r
        }
      }, {
        key: "checkBrowser",
        value: function() {
          var e;
          if (null !== (e = globalThis) && void 0 !== e && e.navigator) {
            var t = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor),
              n = /Edge/.test(navigator.userAgent),
              i = !!document.documentMode,
              o = "undefined" != typeof InstallTrigger,
              r = /constructor/i.test(globalThis.HTMLElement) || "[object SafariRemoteNotification]" === (!globalThis.safari || "undefined" != typeof safari && globalThis.safari.pushNotification).toString(),
              a = !!globalThis.opr && !!globalThis.opr.addons || !!globalThis.opera || navigator.userAgent.indexOf(" OPR/") >= 0;
            return {
              isOpera: a,
              isFirefox: o,
              isSafari: r,
              isIE: i,
              isEdge: n,
              isChrome: t,
              isBlink: (t || a) && !!globalThis.CSS
            }
          }
          return {
            isOpera: !1,
            isFirefox: !1,
            isSafari: !1,
            isIE: !1,
            isEdge: !1,
            isChrome: !0,
            isBlink: !1
          }
        }
      }, {
        key: "classNames",
        value: function(e, t) {
          var n = e || "";
          return t && Object.keys(t).forEach((function(e) {
            t[e] && (n += n ? " ".concat(e) : "".concat(e))
          })), n
        }
      }]), e
    }();
    O()(tn, "toObject", (function(e) {
      for (var t = {}, n = 0; n < e.length; n += 1) t[n + 1] = e[n];
      return t
    })), O()(tn, "xmlParser", (function(e) {
      return new Promise((function(t, n) {
        (0, k.parseString)(e, {
          explicitArray: !1
        }, (function(e, i) {
          i && i.root ? t(i.root) : i ? t(i) : n()
        }))
      }))
    })), O()(tn, "composeURL", (function(e, n, i) {
      var o = e,
        r = "";
      try {
        var a = Object.entries(n).filter((function(e) {
          var n = t()(e, 2),
            i = (n[0], n[1]);
          return Boolean(i)
        }));
        return a.forEach((function(e, n) {
          var i = t()(e, 2),
            o = i[0],
            s = i[1];
          s && (n === a.length - 1 ? r += "".concat(o, "=").concat(s) : r += "".concat(o, "=").concat(s, "&"))
        })), r && (o += i ? "&".concat(r) : "?".concat(r)), o
      } catch (t) {
        return e
      }
    })), O()(tn, "loadLanguage", (function(e) {
      return new Promise((function(t) {
        Promise.resolve().then((function() {
          return n(8616)("./".concat(e, ".xml"))
        })).then((function(e) {
          return tn.sendRequest(e, null, {
            method: "get",
            isResponseDataEncoded: !1
          })
        })).then((function(e) {
          return t(e)
        })).catch((function() {
          return t({})
        }))
      }))
    })), O()(tn, "sendRequest", (function(e, t) {
      var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
      return new Promise((function(i, o) {
        var r, a = n.params,
          s = n.contentFormat,
          c = void 0 === s ? "xml" : s,
          p = n.responseFormat,
          u = void 0 === p ? "xml" : p,
          l = n.method,
          d = void 0 === l ? "post" : l,
          f = n.retry,
          m = void 0 === f || f,
          h = n.retryTimes,
          v = void 0 === h ? 2 : h,
          g = n.retryCallback,
          x = n.timeout,
          b = void 0 === x ? 1e4 : x,
          y = n.isArrayBuffer,
          w = n.isResponseDataEncoded,
          _ = void 0 === w || w,
          E = n.encodeFormData,
          S = void 0 === E || E,
          O = Zt({
            headers: {
              Accept: "*/*",
              "Access-Control-Allow-Origin": "*"
            },
            timeout: b
          }, a && {
            params: a
          }),
          T = null,
          C = 0;
        y && (O.responseType = "arraybuffer"), t && ("xml" === c ? T = new(D().Builder)({
            cdata: !0,
            xmldec: {
              encoding: "UTF-8",
              standalone: !0
            }
          }).buildObject(t) : "json" === c && (T = t)), r = S && T ? tn.getEncodedFormData(T) : T,
          function t() {
            return C && O.params && (O.params.retry = C), Jt(Zt(Zt({
              method: d,
              url: e
            }, r && {
              data: r
            }), O)).then((function(e) {
              if (200 === e.status || 204 === e.status) {
                var t = e.data,
                  n = tn.checkBrowser();
                "" !== t ? "xml" === u ? (y ? t = (t = String.fromCharCode.apply(null, new Uint16Array(t))).replace(/\n/g, "").replace(/\x00/g, "") : n.isIE || n.isEdge || !_ || (t = (t = (t = tn.decodeUTF162Str(t)).replace(/\n|\t/g, "")).replace('</count key="0">', "</count>")), t ? tn.xmlParser(t).then((function(e) {
                  i(e)
                })).catch((function(e) {
                  o(e)
                })) : i()) : (y && (t = (t = String.fromCharCode.apply(null, new Uint16Array(t))).replace(/\n/g, "").replace(/\x00/g, "")), i(t)) : i()
              }
            })).catch((function(e) {
              var n;
              m && C < v ? (C += 1, g ? g(null == e || null === (n = e.response) || void 0 === n ? void 0 : n.data, (function(n) {
                n ? globalThis.setTimeout((function() {
                  t()
                }), 1e3) : o(e)
              })) : globalThis.setTimeout((function() {
                t()
              }), 1e3)) : o(e)
            }))
          }()
      }))
    }));
    const nn = tn,
      on = {
        SOCKET_EVENT: Object.freeze({
          HOTKEY_PROFILE_CHANGED: "10001",
          FACTORY_RESET: "10002",
          ALERTPAGE_INIT_STATUS_CHANGED: "10101",
          GET_INIT_STATUS: "10102",
          RETURN_INIT_STATUS: "10103",
          INIT_RELOAD: "10104",
          AURA_UNSYNC: "10105",
          ALERT_START: "10106",
          RELOAD_ALERT: "10107",
          BACKGROUND_PROCESSING: "10108",
          SEND_POWER_EVENT: "10200",
          GET_POWER_EVENT: "10201",
          DISPLAY_TRAY_ICON: "10202",
          DEVICE_MIC_VOLUME_CHANGED: "10203",
          WEBSOCKET_TARGET_NOT_FOUND: "20000",
          DEVICE_PLUGGED: "30001",
          DEVICE_UNPLUGGED: "30002"
        })
      };
    var rn = Object.freeze({
        CRITICAL: 1,
        ERROR: 2,
        WARNING: 3,
        INFORMATION: 4,
        DEBUG: 5,
        VERBOSE: 6
      }),
      an = "logHelper",
      sn = function() {
        function e() {
          l()(this, e)
        }
        return f()(e, null, [{
          key: "connect",
          value: function(e, t) {
            var n = this,
              i = t.deviceType,
              o = t.modelNumber,
              r = t.dongleSN;
            try {
              if (null !== this.logServer) return;
              if (!e || void 0 === i || void 0 === o) return;
              this.deviceType = i;
              var a = new WebSocket(nn.composeURL("".concat(e, "?role=devicePageLogger&deviceType=").concat(i, "&pid=").concat(o), {
                dongleSN: r
              }, !0));
              this.i(an, "logServer connect start."), a.onopen = function() {
                n.i(an, "logServer connect successful."), Promise.resolve().then((function() {
                  return a.send(JSON.stringify({
                    command: "writeLog",
                    deviceType: n.deviceType,
                    level: 4,
                    log: "***** [websocket] Connected *****"
                  }))
                })).then((function() {
                  var e = n.logTempStorage.reduce((function(e, t) {
                    return e.push(Promise.resolve().then((function() {
                      a.send(JSON.stringify(t))
                    }))), e
                  }), []);
                  return Promise.all(e).then((function() {
                    n.logTempStorage = [], n.logServer = a
                  }))
                }))
              }, a.onclose = function() {
                n.logServer = null, n.w(an, "logServer connect fail"), globalThis.setTimeout((function() {
                  n.connect(e, {
                    deviceType: i,
                    modelNumber: o
                  })
                }), 1e3)
              }, a.onerror = function() {
                a.close()
              }
            } catch (e) {}
          }
        }, {
          key: "setLogLevel",
          value: function(e) {
            e < this.logLevel.verbose ? e = this.logLevel.verbose : e > this.logLevel.error && (e = this.logLevel.error), this.currentLogLevel = e
          }
        }, {
          key: "v",
          value: function(e, t) {
            var n = "[V][".concat(e, "] ").concat(t);
            console.debug(n), this.currentLogLevel <= this.logLevel.verbose && this.saveLog(n, rn.VERBOSE)
          }
        }, {
          key: "d",
          value: function(e, t) {
            var n = "[D][".concat(e, "] ").concat(t);
            console.log(n), this.currentLogLevel <= this.logLevel.debug && this.saveLog(n, rn.DEBUG)
          }
        }, {
          key: "i",
          value: function(e, t) {
            var n = "[I][".concat(e, "] ").concat(t);
            console.info(n), this.currentLogLevel <= this.logLevel.info && this.saveLog(n, rn.INFORMATION)
          }
        }, {
          key: "w",
          value: function(e, t) {
            var n = "[W][".concat(e, "] ").concat(t);
            console.warn(n), this.currentLogLevel <= this.logLevel.warn && this.saveLog(n, rn.WARNING)
          }
        }, {
          key: "e",
          value: function(e, t) {
            var n = "[E][".concat(e, "] ").concat(t);
            console.error(n), this.currentLogLevel <= this.logLevel.error && this.saveLog(n, rn.ERROR)
          }
        }, {
          key: "send",
          value: function(e, t) {
            var n = {
              command: "writeLog",
              deviceType: this.deviceType,
              level: t,
              log: e
            };
            null !== this.logServer && 1 === this.logServer.readyState ? this.logServer.send(JSON.stringify(n)) : this.logTempStorage.push(n)
          }
        }, {
          key: "saveLog",
          value: function(e, t) {
            if (e.length < 450) this.send(e, t);
            else
              for (var n = 0; n < e.length;) {
                var i = n,
                  o = n + 450,
                  r = e.lastIndexOf("\n", o);
                r > i && (o = r);
                var a = e.substring(i, o);
                this.send(a, t), n = o
              }
          }
        }]), e
      }();
    O()(sn, "logServer", null), O()(sn, "logLevel", Object.freeze({
      verbose: 0,
      debug: 1,
      info: 2,
      warn: 3,
      error: 4
    })), O()(sn, "deviceType", null), O()(sn, "currentLogLevel", 0), O()(sn, "logTempStorage", []);
    const cn = sn;

    function pn(e, t) {
      var n = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var i = Object.getOwnPropertySymbols(e);
        t && (i = i.filter((function(t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable
        }))), n.push.apply(n, i)
      }
      return n
    }

    function un(e) {
      for (var t = 1; t < arguments.length; t++) {
        var n = null != arguments[t] ? arguments[t] : {};
        t % 2 ? pn(Object(n), !0).forEach((function(t) {
          O()(e, t, n[t])
        })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : pn(Object(n)).forEach((function(t) {
          Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
        }))
      }
      return e
    }
    var ln = n(1505).Z.settings,
      dn = ln.libUrl,
      fn = ln.ws,
      mn = ln.alertSocketServer,
      hn = "[Device Service]";
    globalThis.globalVariable = {
      currentApp: "Device Service"
    };
    var vn = {
        xmlParser: function(e) {
          return new Promise((function(t, n) {
            (0, k.parseString)(e, {
              explicitArray: !1
            }, (function(e, i) {
              i && i.root ? t(i.root) : n()
            }))
          }))
        },
        combineContent: function(e, t) {
          if (t) {
            var n = {
              xml: un({}, t)
            };
            return Object.keys(null == e ? void 0 : e.xml).forEach((function(t) {
              n.xml[t] = null == e ? void 0 : e.xml[t]
            })), n
          }
          return e
        },
        readSettings: function(e) {
          return new Promise((function(t) {
            var n = "".concat(dn, "/file/").concat(e);
            return nn.sendRequest(n, null, {
              method: "get",
              responseFormat: "json"
            }).then((function(e) {
              vn.logger.info(hn, "successful.");
              var n = nn.isJSON(e);
              n || (n = JSON.parse(decodeURIComponent(atob(e)))), t(n)
            })).catch((function(e) {
              var n, i, o = (null !== (n = null == e || null === (i = e.response) || void 0 === i ? void 0 : i.data) && void 0 !== n ? n : {}).errorCode;
              vn.logger.error(hn, "error: ".concat(o)), t()
            }))
          }))
        },
        logger: {
          overwrite: function() {
            var e = {
              1: "system",
              2: "error",
              3: "warn",
              4: "info",
              5: "debug"
            };
            cn.send = function(t, n) {
              var i, o;
              I.threadId && I.parentPort ? I.parentPort.postMessage({
                cmd: "log",
                type: e[n],
                data: t
              }) : null !== (i = process) && void 0 !== i && i.parentPort ? process.parentPort.postMessage({
                cmd: "log",
                type: e[n],
                data: t
              }) : null !== (o = process) && void 0 !== o && o.send && process.send({
                cmd: "log",
                type: e[n],
                data: t
              })
            }
          },
          log: function(e, t) {
            var n, i;
            I.threadId && I.parentPort ? I.parentPort.postMessage({
              cmd: "log",
              type: e,
              data: t.join(" ")
            }) : null !== (n = process) && void 0 !== n && n.parentPort ? process.parentPort.postMessage({
              cmd: "log",
              type: e,
              data: t.join(" ")
            }) : null !== (i = process) && void 0 !== i && i.send && process.send({
              cmd: "log",
              type: e,
              data: t.join(" ")
            })
          },
          info: function() {
            for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
            return vn.logger.log("info", t)
          },
          warn: function() {
            for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
            return vn.logger.log("warn", t)
          },
          error: function() {
            for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
            return vn.logger.log("error", t)
          },
          debug: function() {
            for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
            return vn.logger.log("debug", t)
          },
          system: function() {
            for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
            return vn.logger.log("system", t)
          }
        },
        btoa: function(e) {
          return Buffer.from(e, "binary").toString("base64")
        },
        atob: function(e) {
          return Buffer.from(e, "base64").toString("binary")
        },
        defineGlobalParams: function() {
          globalThis.setTimeout = setTimeout, globalThis.atob = vn.atob, globalThis.btoa = vn.btoa
        }
      },
      gn = function() {
        function e(t) {
          var n = this;
          l()(this, e), O()(this, "returnProfileList", (function(e) {
            var t = n.getState().settings.deviceSN;
            return Promise.resolve().then((function() {
              return vn.readSettings("config".concat(t ? "_".concat(t) : "", ".xml"))
            })).then((function(t) {
              var i = n.getState().settings.deviceType,
                o = t.selectedProfile,
                r = t.currProfile || o,
                a = t.profileList,
                s = t.swProfileList;
              n.sendSocketServer({
                xml: {
                  command: "GetDeviceProfileList",
                  device_type: i,
                  profile: r.name,
                  profile_list: {
                    ec_name: a ? a.map((function(e) {
                      return e.name
                    })) : [],
                    sw_name: s ? s.map((function(e) {
                      return e.name
                    })) : []
                  },
                  result: !0
                }
              }, e)
            })).catch((function() {
              n.sendSocketServer({
                xml: {
                  command: "GetDeviceProfileList",
                  result: !1
                }
              }, e)
            })).finally((function() {
              vn.logger.info(hn, "GetDeviceProfileList finished.")
            }))
          })), O()(this, "returnCurrentProfile", (function(e) {
            var t = n.getState().settings.deviceSN;
            return Promise.resolve().then((function() {
              return vn.readSettings("config".concat(t ? "_".concat(t) : "", ".xml"))
            })).then((function(t) {
              var i, o = null !== (i = null == t ? void 0 : t.currProfile) && void 0 !== i ? i : "";
              n.sendSocketServer({
                xml: {
                  command: "GetDeviceProfile",
                  profile: "".concat(o.name)
                }
              }, e)
            })).catch((function() {
              n.sendSocketServer({
                xml: {
                  command: "GetDeviceProfile",
                  result: !1
                }
              }, e)
            })).finally((function() {
              vn.logger.info(hn, "GetDeviceProfile finished.")
            }))
          })), O()(this, "returnDeviceDescription", (function(e) {
            n.sendSocketServer({
              xml: {
                command: "GetDeviceDescription",
                result: !1
              }
            }, e)
          })), O()(this, "returnHasNewFeature", (function(e) {
            var t = n.getState().settings.deviceSN;
            return Promise.resolve().then((function() {
              return vn.readSettings("config".concat(t ? "_".concat(t) : "", ".xml"))
            })).then((function(t) {
              var i = t.hasEverSyncAllProfile;
              n.sendSocketServer({
                xml: {
                  command: "IsNewDevice",
                  result: !i
                }
              }, e)
            })).catch((function() {
              n.sendSocketServer({
                xml: {
                  command: "IsNewDevice",
                  result: !1
                }
              }, e)
            })).finally((function() {
              vn.logger.info(hn, "IsNewDevice finished.")
            }))
          })), O()(this, "setInitializeStatus", (function(e, t, i) {
            var o, r, a, s = n.getState(),
              c = s.common,
              p = s.settings,
              u = (null !== (o = null == c ? void 0 : c.constantData) && void 0 !== o ? o : {}).SOCKET_EVENT,
              l = p.modelNumber,
              d = p.deviceType,
              f = p.dongleSN,
              m = p.deviceSN;
            n.initializing = e, void 0 !== t && (n.initializeSuccessfully = t), n.initializeErrorCode = void 0 === i ? null : (a = (null == i ? void 0 : i.message) || (null == i || null === (r = i.payload) || void 0 === r ? void 0 : r.errorCode) || i, /^[A-Z]{1}-\d{4,5}$/.test(a) ? a : "-1"), e || n.broadcastEvent({
              target: un({
                role: "devicePage",
                deviceType: d,
                pid: l
              }, f && {
                dongleSN: f
              }),
              msg: un({
                cmd: u.ALERTPAGE_INIT_STATUS_CHANGED,
                initializing: e,
                result: n.initializeSuccessfully,
                isDeviceAlive: n.defaultAliveStatus,
                errorCode: n.initializeErrorCode
              }, m && {
                deviceSN: m
              })
            })
          }));
          var i = t.actions,
            o = t.props;
          this.actions = i, this.props = o, this.promisePool = [], this.store = null, this.getState = null, this.dispatch = function() {}, this.nodeServer = null, this.socketServer = null, this.initializing = !1, this.initializeSuccessfully = !1, this.initializeErrorCode = null, this.defaultAliveStatus = !0, this.defaultAuraStatus = !1, vn.defineGlobalParams(), vn.logger.overwrite(), this.setStore(), this.setInitializeStatus(!0), this.init()
        }
        return f()(e, [{
          key: "init",
          value: function() {
            var e = this,
              t = ln.modelNumber,
              n = ln.caps,
              i = ln.defaultSettings,
              o = this.actions.setConfig,
              r = {
                deviceType: n.deviceType,
                modelNumber: t,
                caps: n,
                defaultSettings: i,
                constantData: un(un({}, A), {}, {
                  SOCKET_EVENT: un({}, on.SOCKET_EVENT)
                })
              };
            return Promise.resolve().then((function() {
              return e.dispatch(o(r))
            })).then((function() {
              return e.connectFramwork()
            })).then((function() {
              return e.connectSocketServer()
            })).then((function() {
              var t, n = e.getState(),
                i = n.common,
                o = n.settings,
                r = o.modelNumber,
                a = o.deviceType,
                s = o.dongleSN,
                c = (null !== (t = null == i ? void 0 : i.constantData) && void 0 !== t ? t : {}).SOCKET_EVENT;
              return vn.logger.info(hn, "device service init start: ".concat(r, ".")), e.broadcastEvent({
                target: un({
                  role: "devicePage",
                  deviceType: a,
                  pid: r
                }, s && {
                  dongleSN: s
                }),
                msg: {
                  cmd: c.ALERT_START
                }
              })
            })).then((function() {
              return e.initialize()
            })).then((function() {
              return e.setInitializeStatus(!1, !0)
            })).catch((function(t) {
              return e.setInitializeStatus(!1, !1, t)
            })).finally((function() {
              e.initFinally(), vn.logger.info(hn, "device service init finished: ".concat(t, "."))
            }))
          }
        }, {
          key: "sendSocketServer",
          value: function(e, t) {
            var n = e ? vn.combineContent(e, t) : t,
              i = new(D().Builder)({
                headless: !0
              }).buildObject(n);
            return !(!this.socketServer || 1 !== this.socketServer.readyState || (this.socketServer.send(i), 0))
          }
        }, {
          key: "broadcastEvent",
          value: function(e) {
            var t = this;
            return new Promise((function(n, i) {
              try {
                var o = {
                  command: "broadcastEvent",
                  target: e.target,
                  msg: e.msg
                };
                vn.logger.info("[Device Service Broadcast]", JSON.stringify(o, null, 4)), t.nodeServer && 1 === t.nodeServer.readyState && t.nodeServer.send(JSON.stringify(o)), n()
              } catch (e) {
                i()
              }
            }))
          }
        }, {
          key: "dispatchResolve",
          value: function(e) {
            var t = e.cmd,
              n = e.payload,
              i = e.fn,
              o = e.errorCode,
              r = this.promisePool.find((function(e) {
                return e.cmd === t
              }));
            if (r) {
              var a = r.resolve,
                s = r.reject;
              i && i(), o ? s(o) : a(n), this.promisePool = this.promisePool.filter((function(e) {
                return e !== r
              }))
            }
          }
        }, {
          key: "getAuraSyncStatus",
          value: function(e) {
            var t = this,
              n = this.getState().settings.dongleSN;
            return new Promise((function(i) {
              var o = nn.generateUUID();
              t.promisePool.push({
                sessionKey: o,
                cmd: "GetAuraSyncState",
                resolve: i
              }), t.sendSocketServer({
                xml: un({
                  command: "GetAuraSyncState",
                  device: e
                }, n && {
                  dongleSN: n
                })
              }) ? (vn.logger.info(hn, "getAuraSyncStatus start."), setTimeout((function() {
                t.dispatchResolve({
                  cmd: "GetAuraSyncState",
                  fn: function() {
                    vn.logger.warn(hn, "getAuraSyncStatus timeout.")
                  }
                })
              }), 6e4)) : i(!1)
            }))
          }
        }, {
          key: "notifyDeviceProfileChange",
          value: function(e, t, n) {
            var i = this,
              o = this.getState().settings.dongleSN;
            return new Promise((function(r) {
              i.sendSocketServer({
                xml: un(un({
                  command: "DeviceProfileChange",
                  device: t
                }, o && {
                  dongleSN: o
                }), {}, {
                  device_type: n,
                  profile: e.name
                })
              }), r()
            }))
          }
        }, {
          key: "connectFramwork",
          value: function() {
            var e = this,
              t = this.props,
              n = t.dongleSN,
              i = t.deviceSN,
              o = this.getState().settings,
              r = o.modelNumber,
              a = o.deviceType;
            return new Promise((function(t) {
              e.nodeServer ? t() : (e.nodeServer = new P(nn.composeURL("".concat(fn, "?role=deviceService&deviceType=").concat(a, "&pid=").concat(r), {
                dongleSN: n,
                deviceSN: i
              }, !0)), e.nodeServer.onmessage = function(t) {
                var n = nn.isJSON(t.data);
                if (n) e.handleFrameworkEvent(n);
                else {
                  var i, r = e.getState().common,
                    a = ((null !== (i = null == r ? void 0 : r.constantData) && void 0 !== i ? i : {}).SOCKET_EVENT, o.modelNumber, decodeURI(t.data));
                  vn.xmlParser(a).then((function(t) {
                    var n = t.device_type.device;
                    n.$.key, n.cmd, e.handleSDKEvent(t)
                  }))
                }
              }, e.nodeServer.onopen = function() {
                t()
              }, e.nodeServer.onerror = function(e) {
                var t;
                vn.logger.error(hn, "".concat(r, " Framework connection error. ").concat(null == e || null === (t = e.error) || void 0 === t ? void 0 : t.code))
              }, e.nodeServer.onclose = function() {
                vn.logger.warn(hn, "".concat(r, " Framework connection close."))
              })
            }))
          }
        }, {
          key: "connectSocketServer",
          value: function() {
            var e = this,
              t = this.getState().settings.modelNumber,
              n = this.props,
              i = n.dongleSN,
              o = n.deviceSN;
            return new Promise((function(n) {
              e.socketServer ? n() : (e.socketServer = new P(mn), e.socketServer.onmessage = function(t) {
                var n = JSON.parse(t.data),
                  i = n.command,
                  o = JSON.stringify(n, null, 2);
                switch (vn.logger.debug(hn, "command: ".concat(i, ", data:\n").concat(o)), i) {
                  case "GetDeviceProfileList":
                    e.returnProfileList(n);
                    break;
                  case "GetDeviceProfile":
                    e.returnCurrentProfile(n);
                    break;
                  case "GetDeviceDescription":
                    e.returnDeviceDescription(n);
                    break;
                  case "IsNewDevice":
                    e.returnHasNewFeature(n);
                    break;
                  default:
                    e.handleSocketServerEvent(n)
                }
              }, e.socketServer.onopen = function() {
                e.sendSocketServer({
                  xml: un(un({
                    command: "ConnectionOpen",
                    device: t
                  }, i && {
                    dongleSN: i
                  }), o && {
                    deviceSN: o
                  })
                }), n()
              }, e.socketServer.onerror = function(e) {
                var i;
                vn.logger.error(hn, "".concat(t, " socket server connection error. ").concat(null == e || null === (i = e.error) || void 0 === i ? void 0 : i.code)), n()
              }, e.socketServer.onclose = function() {
                vn.logger.error(hn, "".concat(t, " socket server connection close.")), n()
              })
            }))
          }
        }, {
          key: "setStore",
          value: function() {
            this.dispatch = this.store.dispatch, this.getState = this.store.getState
          }
        }, {
          key: "initFinally",
          value: function() {
            var e = this.getState().settings,
              t = e.modelNumber,
              n = e.dongleSN;
            this.sendSocketServer({
              xml: un(un({
                command: "pid",
                device: t
              }, n && {
                dongleSN: n
              }), {}, {
                result: this.initializeSuccessfully
              })
            })
          }
        }, {
          key: "initialize",
          value: function() {}
        }, {
          key: "handleFrameworkEvent",
          value: function(e) {
            var t = this,
              n = this.getState(),
              i = n.common,
              o = n.settings,
              r = i.constantData.SOCKET_EVENT,
              a = o.deviceType,
              s = o.modelNumber,
              c = o.dongleSN,
              u = o.deviceSN;
            switch (e.cmd) {
              case r.GET_INIT_STATUS:
                if (!this.initializing) return this.broadcastEvent({
                  target: un({
                    role: "devicePage",
                    deviceType: a,
                    pid: s
                  }, c && {
                    dongleSN: c
                  }),
                  msg: un({
                    cmd: r.RETURN_INIT_STATUS,
                    initializing: this.initializing,
                    result: this.initializeSuccessfully,
                    isDeviceAlive: this.defaultAliveStatus,
                    errorCode: this.initializeErrorCode
                  }, u && {
                    deviceSN: u
                  })
                });
                break;
              case r.RELOAD_ALERT:
                p()(C().mark((function e() {
                  return C().wrap((function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        return t.setInitializeStatus(!0), e.next = 3, t.init();
                      case 3:
                        vn.logger.info(hn, "re-init finished.");
                      case 4:
                      case "end":
                        return e.stop()
                    }
                  }), e)
                })))();
                break;
              default:
                this.handleFrameworkEventByType(e)
            }
          }
        }, {
          key: "handleSDKEvent",
          value: function(e) {}
        }, {
          key: "handleSocketServerEvent",
          value: function(e) {}
        }]), e
      }();

    function xn(e, t) {
      var n = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var i = Object.getOwnPropertySymbols(e);
        t && (i = i.filter((function(t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable
        }))), n.push.apply(n, i)
      }
      return n
    }

    function bn(e) {
      for (var t = 1; t < arguments.length; t++) {
        var n = null != arguments[t] ? arguments[t] : {};
        t % 2 ? xn(Object(n), !0).forEach((function(t) {
          O()(e, t, n[t])
        })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : xn(Object(n)).forEach((function(t) {
          Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
        }))
      }
      return e
    }

    function yn(e, t) {
      (null == t || t > e.length) && (t = e.length);
      for (var n = 0, i = new Array(t); n < t; n++) i[n] = e[n];
      return i
    }
    var wn = function() {
      function e() {
        l()(this, e)
      }
      return f()(e, null, [{
        key: "clone",
        value: function(t) {
          if (null === t || "object" !== R()(t)) return t;
          var n = new t.constructor;
          if (t instanceof Set) {
            var i, o = function(e, t) {
              var n = "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
              if (!n) {
                if (Array.isArray(e) || (n = function(e, t) {
                    if (e) {
                      if ("string" == typeof e) return yn(e, t);
                      var n = Object.prototype.toString.call(e).slice(8, -1);
                      return "Object" === n && e.constructor && (n = e.constructor.name), "Map" === n || "Set" === n ? Array.from(e) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? yn(e, t) : void 0
                    }
                  }(e)) || t && e && "number" == typeof e.length) {
                  n && (e = n);
                  var i = 0,
                    o = function() {};
                  return {
                    s: o,
                    n: function() {
                      return i >= e.length ? {
                        done: !0
                      } : {
                        done: !1,
                        value: e[i++]
                      }
                    },
                    e: function(e) {
                      throw e
                    },
                    f: o
                  }
                }
                throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
              }
              var r, a = !0,
                s = !1;
              return {
                s: function() {
                  n = n.call(e)
                },
                n: function() {
                  var e = n.next();
                  return a = e.done, e
                },
                e: function(e) {
                  s = !0, r = e
                },
                f: function() {
                  try {
                    a || null == n.return || n.return()
                  } finally {
                    if (s) throw r
                  }
                }
              }
            }(t.keys());
            try {
              for (o.s(); !(i = o.n()).done;) {
                var r = i.value;
                n.add(r)
              }
            } catch (e) {
              o.e(e)
            } finally {
              o.f()
            }
          } else Object.keys(t).forEach((function(i) {
            n[i] = e.clone(t[i])
          }));
          return n
        }
      }, {
        key: "isEquivalent",
        value: function(t, n) {
          if ("object" === R()(t) && "object" === R()(n) && null !== t && null !== n) {
            if (Array.isArray(t) && Array.isArray(n)) {
              if (t.length !== n.length) return !1;
              for (var i = 0; i < t.length; i += 1)
                if (!e.isEquivalent(t[i], n[i])) return !1
            }
            var o = Object.getOwnPropertyNames(t),
              r = Object.getOwnPropertyNames(n);
            if (o.length !== r.length) return !1;
            for (var a = 0; a < o.length; a += 1) {
              var s = o[a];
              if ("key" !== s)
                if ("object" === R()(t[s])) {
                  if (!e.isEquivalent(t[s], n[s])) return !1
                } else if ("div" === t.type) {
                if (!e.isEquivalent(t[s], n[s])) return !1
              } else if (t[s] !== n[s]) return !1
            }
            for (var c = 0; c < r.length; c += 1) {
              var p = r[c];
              if ("key" !== p)
                if ("object" === R()(n[p])) {
                  if (!e.isEquivalent(t[p], n[p])) return !1
                } else if ("div" === t.type) {
                if (!e.isEquivalent(t[p], n[p])) return !1
              } else if (t[p] !== n[p]) return !1
            }
          } else if (t !== n) return !1;
          return !0
        }
      }, {
        key: "isStringNumber",
        value: function(e) {
          return /^\d+$/.test(e)
        }
      }, {
        key: "isJSON",
        value: function(e) {
          try {
            return JSON.parse(e)
          } catch (e) {
            return !1
          }
        }
      }, {
        key: "generateUUID",
        value: function() {
          var e = Date.now();
          return "undefined" != typeof performance && "function" == typeof performance.now && (e += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (function(t) {
            var n = (e + 16 * Math.random()) % 16 | 0;
            return e = Math.floor(e / 16), ("x" === t ? n : n ? 3 : 8).toString(16)
          }))
        }
      }, {
        key: "getEncodedFormData",
        value: function(t) {
          var n = new FormData,
            i = new Blob([e.encodeStr2UTF16(t)], {
              encoding: "UTF-16",
              type: "text/plain;charset=UTF-16"
            });
          return n.append("file", i, "1.xml"), n
        }
      }, {
        key: "encodeStr2UTF16",
        value: function(e) {
          for (var t = new ArrayBuffer(2 * e.length), n = new Uint16Array(t), i = 0, o = e.length; i < o; i += 1) n[i] = e.charCodeAt(i);
          return n
        }
      }, {
        key: "decodeUTF162Str",
        value: function(e) {
          for (var t = [], n = 0; n < e.length; n += 2) t.push(e.charCodeAt(n) | e.charCodeAt(n + 1) << 8);
          return String.fromCharCode.apply(String, t)
        }
      }, {
        key: "parseXML",
        value: function(e) {
          var t = null;
          if (globalThis.DOMParser) try {
            t = (new DOMParser).parseFromString(e, "text/xml")
          } catch (e) {
            t = null
          } else if (globalThis.ActiveXObject) try {
            (t = new(0, globalThis.ActiveXObject)("Microsoft.XMLDOM")).async = !1, t.loadXML(e)
          } catch (e) {
            t = null
          }
          return t
        }
      }, {
        key: "rgbToHex",
        value: function(e, t, n) {
          return "#".concat(((1 << 24) + (e << 16) + (t << 8) + parseInt(n, 10)).toString(16).slice(1))
        }
      }, {
        key: "checkBrowser",
        value: function() {
          var e;
          if (null !== (e = globalThis) && void 0 !== e && e.navigator) {
            var t = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor),
              n = /Edge/.test(navigator.userAgent),
              i = !!document.documentMode,
              o = "undefined" != typeof InstallTrigger,
              r = /constructor/i.test(globalThis.HTMLElement) || "[object SafariRemoteNotification]" === (!globalThis.safari || "undefined" != typeof safari && globalThis.safari.pushNotification).toString(),
              a = !!globalThis.opr && !!globalThis.opr.addons || !!globalThis.opera || navigator.userAgent.indexOf(" OPR/") >= 0;
            return {
              isOpera: a,
              isFirefox: o,
              isSafari: r,
              isIE: i,
              isEdge: n,
              isChrome: t,
              isBlink: (t || a) && !!globalThis.CSS
            }
          }
          return {
            isOpera: !1,
            isFirefox: !1,
            isSafari: !1,
            isIE: !1,
            isEdge: !1,
            isChrome: !0,
            isBlink: !1
          }
        }
      }, {
        key: "setTimeout",
        value: function(e) {
          function t(t, n) {
            return e.apply(this, arguments)
          }
          return t.toString = function() {
            return e.toString()
          }, t
        }((function(e, t) {
          var n;
          null !== (n = globalThis) && void 0 !== n && n.navigator ? globalThis.setTimeout(e, t) : setTimeout(e, t)
        }))
      }]), e
    }();
    O()(wn, "toObject", (function(e) {
      for (var t = {}, n = 0; n < e.length; n += 1) t[n + 1] = e[n];
      return t
    })), O()(wn, "xmlParser", (function(e) {
      return new Promise((function(t, n) {
        (0, k.parseString)(e, {
          explicitArray: !1
        }, (function(e, i) {
          i && i.root ? t(i.root) : i ? t(i) : n()
        }))
      }))
    })), O()(wn, "sendRequest", (function(e, t) {
      var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
      return new Promise((function(i, o) {
        var r, a = n.params,
          s = n.contentFormat,
          c = void 0 === s ? "xml" : s,
          p = n.responseFormat,
          u = void 0 === p ? "xml" : p,
          l = n.method,
          d = void 0 === l ? "post" : l,
          f = n.retry,
          m = void 0 === f || f,
          h = n.retryTimes,
          v = void 0 === h ? 2 : h,
          g = n.retryCallback,
          x = n.timeout,
          b = void 0 === x ? 1e4 : x,
          y = n.isArrayBuffer,
          w = n.isResponseDataEncoded,
          _ = void 0 === w || w,
          E = n.encodeFormData,
          S = void 0 === E || E,
          O = bn({
            headers: {
              Accept: "*/*",
              "Access-Control-Allow-Origin": "*"
            },
            timeout: b
          }, a && {
            params: a
          }),
          T = null,
          C = 0;
        y && (O.responseType = "arraybuffer"), t && ("xml" === c ? T = new(D().Builder)({
            cdata: !0,
            xmldec: {
              encoding: "UTF-8",
              standalone: !0
            }
          }).buildObject(t) : "json" === c && (T = t)), r = S && T ? wn.getEncodedFormData(T) : T,
          function t() {
            return C && O.params && (O.params.retry = C), Jt(bn(bn({
              method: d,
              url: e
            }, r && {
              data: r
            }), O)).then((function(e) {
              if (200 === e.status || 204 === e.status) {
                var t = e.data,
                  n = wn.checkBrowser();
                "" !== t ? "xml" === u ? (y ? t = (t = String.fromCharCode.apply(null, new Uint16Array(t))).replace(/\n/g, "").replace(/\x00/g, "") : n.isIE || n.isEdge || !_ || (t = (t = (t = wn.decodeUTF162Str(t)).replace(/\n|\t/g, "")).replace('</count key="0">', "</count>")), t ? wn.xmlParser(t).then((function(e) {
                  i(e)
                })).catch((function(e) {
                  o(e)
                })) : i()) : (y && (t = (t = String.fromCharCode.apply(null, new Uint16Array(t))).replace(/\n/g, "").replace(/\x00/g, "")), i(t)) : i()
              }
            })).catch((function(e) {
              var n, i, r, a = (null !== (n = null == e || null === (i = e.response) || void 0 === i ? void 0 : i.data) && void 0 !== n ? n : {}).errorCode;
              m && C < v ? (C += 1, g ? g(null == e || null === (r = e.response) || void 0 === r ? void 0 : r.data, (function(e) {
                e ? wn.setTimeout((function() {
                  t()
                }), 1e3) : o(a)
              })) : wn.setTimeout((function() {
                t()
              }), 1e3)) : o(a)
            }))
          }()
      }))
    })), O()(wn, "parseError", (function(e) {
      var t, n = (null == e ? void 0 : e.message) || (null == e || null === (t = e.response) || void 0 === t ? void 0 : t.errorCode) || e;
      return cn.e("error", "error message: ".concat(n)), /^[A-Z]{1}-\d{4,5}$/.test(n) ? n : "-1"
    }));
    const _n = wn;
    var En = Object.freeze({
      UNKNOWN: "-1",
      SDK_DEVICE_NOT_FOUND: "S-1000",
      SDK_PROCESS_CRASHED: "S-1001",
      SDK_PROCESS_REBUILD: "S-1002",
      SDK_RETURN_FAILED: "S-1003",
      SDK_DEVICE_NOTALIVE: "S-1004",
      SDK_CONFIG_NOT_FOUND: "S-1005",
      SDK_DEVICE_NOTSERVICES: "S-1006",
      FOREIGN_LIB_NOT_FOUND: "S-1007",
      SDK_INIT_ING: "S-1008",
      SDK_INIT_FAILED: "S-1009",
      SDK_FILE_NOT_FOUND: "S-1010",
      SDK_UNVERIFIED: "S-1011",
      CAPS_NOT_FOUND: "F-1010",
      FILE_NOT_FOUND: "F-1011",
      WRITE_FILE_FAILED: "F-1012",
      FOLDER_NOT_DEFINED: "F-1013",
      PLUGIN_FORMAT_ERROR: "F-1016",
      BROWSER_NOT_FOUND: "F-1017",
      DATA_FORMAT_ERROR: "F-1020",
      REQUEST_QUEUE_TIMEOUT: "F-1030",
      REQUEST_PROCESS_TIMEOUT: "F-1031",
      REQUEST_FUNCTION_NOT_SUPPORT: "F-1032",
      REQUEST_QUEUE_REACH_MAX: "F-1033",
      EXECUTE_RETURN_IGNORE: "F-1040",
      EXECUTE_RETURN_FAILED: "F-1041",
      SHARP_RETURN_FAILED: "F-1100",
      SHARP_BAD_DATA_FORMAT: "F-1101",
      SHARP_BAD_ROTATE_ANGLE: "F-1102",
      SHARP_BAD_CROP_AREA: "F-1103",
      SHARP_BAD_RESIZE_VALUE: "F-1104",
      GET_SYSTEM_FONTS_FAIL: "F-1110",
      LIB_UNKNOWN: "F-1200",
      LIB_GET_SYSTEM_FONTS_FAIL: "F-1201",
      LIB_LANGUAGE_FAIL: "F-1202",
      LIB_ACCESS_REGISTRY_FAIL: "F-1203",
      LIB_GET_DEVICE_FAIL: "F-1204",
      LIB_OPEN_APP_FAIL: "F-1025",
      BOOT_LOADER_MODE: "P-9000",
      MB_NOT_SUPPORTED: "P-9001",
      FAN_LIST_EMPTY: "P-9002",
      SDK_FW_UPDATING: "P-9003",
      SDK_DEVICE_IN_DEMO_MODE: "P-9004",
      DEVICE_SERVICE_NOT_FOUND: "H-2004",
      INIT_WAIT_TIMEOUT: "H-2005",
      INIT_FAILED: "H-2006",
      DEVICE_NOT_FOUND: "H-2007",
      AURA_SYNC_FAILED: "H-3001",
      AURA_UNSYNC_FAILED: "H-3002",
      AURA_RESCAN_FAILED: "H-3003",
      RLS_RESCAN_FAILED: "H-3004",
      INTERNAL_ERROR: "H-4000",
      ICAFE_MODE: "H-4001",
      AURA_SYNC: "H-4002",
      DEVICE_NOT_ALIVE: "H-4003",
      WEBAPP: "H-4004",
      IS_BOOTLOADER_MODE: "H-4005",
      GET_AURA_FAILED: "H-5001",
      GET_SHORTCUT_FAILED: "H-5002",
      GET_ISAPPEXIST: "H-5003",
      GET_MATRIX_FAILED: "H-5004",
      MATRIX_SYNC_FAILED: "H-5005",
      MATRIX_UNSYNC_FAILED: "H-5006",
      LAUNCH_APP_URI_FAILED: "H-5007"
    });

    function Sn(e, t) {
      var n = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var i = Object.getOwnPropertySymbols(e);
        t && (i = i.filter((function(t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable
        }))), n.push.apply(n, i)
      }
      return n
    }

    function On(e) {
      for (var t = 1; t < arguments.length; t++) {
        var n = null != arguments[t] ? arguments[t] : {};
        t % 2 ? Sn(Object(n), !0).forEach((function(t) {
          O()(e, t, n[t])
        })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Sn(Object(n)).forEach((function(t) {
          Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
        }))
      }
      return e
    }
    var Tn = A.mapPercentage2Rpm,
      Cn = {
        isMBSupport: !1,
        isEnableAllFunc: !0,
        isAICoolingSupport: !1,
        isPLCsupport: !1,
        isAICooling: !1,
        isAICoolingII: !1,
        isAsusHydranode: !1,
        selectedFanID: null,
        defaultModeID: null,
        temperature: null,
        isTemperatureSingleSelect: !1,
        isTuning: !1,
        isDidTuning: !1,
        isExtremeQuiet: !1,
        isFanAutoStop: !1,
        tuningPercentage: "0",
        isDontShow: !1,
        fanList: [],
        settingList: [],
        currentRpmPoint: {
          x: 0,
          y: 0
        },
        aiCoolingPoint: null,
        presetList: [],
        profileList: [],
        AICoolingIIProcess: !1,
        ai2EnableFanList: []
      };
    var In = function(e) {
        return {
          type: "UPDATE_FAN_CONOTROL",
          data: e
        }
      },
      Nn = function() {
        return {
          type: "UPDATE_FAN_TEMPERATURE",
          data: arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null,
          source: arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null
        }
      },
      Pn = n(1505).Z.settings.libUrl,
      kn = function(e, t) {
        return new Promise((function(n, i) {
          cn.i("saveFile", "fileName: ".concat(e, ".")), _n.sendRequest("".concat(Pn, "/file"), {
            fileName: e,
            data: btoa(encodeURIComponent(t))
          }, {
            method: "post",
            contentFormat: "json",
            encodeFormData: !1
          }).then((function() {
            cn.i("saveFile", "successful."), n()
          })).catch((function(e) {
            cn.e("saveFile", "fail"), i(_n.parseError(e))
          }))
        }))
      },
      Dn = function() {
        return function() {
          var e = p()(C().mark((function e(t, n) {
            var i, o, r, a, s, c, p, u, l, d, f;
            return C().wrap((function(e) {
              for (;;) switch (e.prev = e.next) {
                case 0:
                  return i = n(), o = i.fanControl, r = i.settings, a = r.selectedProfile, s = r.capsFunctionList, c = o.settingList, p = o.defaultModeID, u = o.isEnableAllFunc, l = o.isDontShow, d = "fp_".concat(a.id, "_config.xml"), f = {}, s.hasFanControl && (f.fanControl = {
                    settingList: c,
                    defaultModeID: p,
                    isEnableAllFunc: u,
                    isDontShow: l
                  }), cn.i("saveFWProfileConfig", "notify."), e.abrupt("return", kn(d, JSON.stringify(f)));
                case 8:
                case "end":
                  return e.stop()
              }
            }), e)
          })));
          return function(t, n) {
            return e.apply(this, arguments)
          }
        }()
      };

    function An(e, t) {
      var n = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var i = Object.getOwnPropertySymbols(e);
        t && (i = i.filter((function(t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable
        }))), n.push.apply(n, i)
      }
      return n
    }

    function jn(e) {
      for (var t = 1; t < arguments.length; t++) {
        var n = null != arguments[t] ? arguments[t] : {};
        t % 2 ? An(Object(n), !0).forEach((function(t) {
          O()(e, t, n[t])
        })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : An(Object(n)).forEach((function(t) {
          Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
        }))
      }
      return e
    }
    var Rn = {
      deviceType: null,
      caps: null,
      capsFunctionList: null,
      defaultSettings: null,
      constantData: null,
      modelName: null,
      displayName: "FAN XPERT 4",
      isBackgroundInitializing: !1,
      isBackgroundInitSuccessfully: !0,
      fwVersion: "1.00.00",
      sid: "0",
      profileList: [{
        id: "1",
        name: "Profile 1",
        disable: !1
      }, {
        id: "2",
        name: "Profile 2",
        disable: !1
      }, {
        id: "3",
        name: "Profile 3",
        disable: !1
      }],
      swProfileList: [],
      selectedProfile: {
        id: "1",
        name: "Profile 1",
        disable: !1
      },
      hasEverSyncAllProfile: !1
    };
    var Ln = function(e) {
        return {
          type: "UPDATE_DATA",
          data: e
        }
      },
      Fn = function(e) {
        return {
          type: "SET_CONFIG",
          data: e
        }
      },
      Mn = n(1505).Z,
      Un = ["id", "name", "type", "isAICoolingFan", "isAICoolingIIFan", "isPLCFan", "isWaterFan", "isqfantuningsupport"];

    function Bn(e, t) {
      var n = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var i = Object.getOwnPropertySymbols(e);
        t && (i = i.filter((function(t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable
        }))), n.push.apply(n, i)
      }
      return n
    }

    function zn(e) {
      for (var t = 1; t < arguments.length; t++) {
        var n = null != arguments[t] ? arguments[t] : {};
        t % 2 ? Bn(Object(n), !0).forEach((function(t) {
          O()(e, t, n[t])
        })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Bn(Object(n)).forEach((function(t) {
          Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
        }))
      }
      return e
    }
    var qn = A.defaultRpmMappingTable,
      Vn = Mn.settings.caps.fanControl.skipPumpName,
      Gn = function(e, t) {
        return 0 === e.length ? [] : e.map((function(e, n) {
          var i = Number(e.x) > 100 ? 100 : Number(e.x),
            o = 100 - 100 * (255 - (Number(e.y) > 255 ? 255 : Number(e.y))) / 255;
          return o < t && (o = t), {
            index: n,
            temperature: String(i),
            percentage: String(Math.floor(o))
          }
        }))
      },
      Hn = function(e, t) {
        return function(n) {
          var i, o, a = e.fanCaps,
            c = e.fansProfile,
            p = null != t ? t : {},
            u = p.ignoreAICoolingII,
            l = void 0 !== u && u,
            d = p.ignoreUpdateCurve,
            f = void 0 !== d && d,
            m = p.ignoreTempUpdate,
            h = void 0 !== m && m,
            v = p.updateTarget,
            g = void 0 === v ? null : v;
          cn.i("composeFanControl", "notify.");
          try {
            return n((i = a, o = c, function(e, t) {
              var n = "composeFanList";
              cn.i(n, "composeFanList start.");
              try {
                var r, a, c = t().fanControl.selectedFanID,
                  p = i.fanList,
                  u = i.fancount,
                  l = i.isAICoolingSupport,
                  d = i.isPLCsupport,
                  f = i.isAICoolingIISupport,
                  m = i.isAICooling,
                  h = i.isAICoolingII,
                  v = void 0 !== h && h,
                  g = i.isPLC,
                  x = i.isFanChanged,
                  b = i.isNeedCalibration,
                  y = i.isryujin3plugin,
                  w = i.isrpmmodesupport,
                  _ = void 0 === w ? "0" : w,
                  E = [],
                  S = !x && !b;
                p && u > 0 && p.forEach((function(e) {
                  var t, n, i, r = e.id,
                    a = e.name,
                    c = e.type,
                    p = (e.isAICoolingFan, e.isAICoolingIIFan),
                    u = e.isPLCFan,
                    l = e.isWaterFan,
                    d = e.isqfantuningsupport,
                    f = void 0 === d ? "1" : d,
                    h = s()(e, Un),
                    v = o.find((function(e) {
                      return e.id === r
                    })),
                    g = v.rpmTable,
                    x = void 0 === g ? qn : g,
                    b = v.stepUnitSupported,
                    y = v.eqModeInfo,
                    w = v.minRpm,
                    O = v.minRpmDuty,
                    T = v.minPower,
                    C = v.minPowerDuty,
                    I = v.spinUpMax,
                    N = v.spinDownMax,
                    P = v.waterCooler,
                    k = v.isAutoFanStopVisable,
                    D = v.isEQmodeVisable,
                    A = v.isEQMode,
                    j = v.rpmstep,
                    R = v.minnonstoprpm,
                    L = v.mindutycyle,
                    F = v.uncontrollabledutycyle;
                  if (l) E.push(zn({
                    id: r,
                    fanName: a,
                    isDisable: !1,
                    isWaterFan: l,
                    waterCooler: P
                  }, h));
                  else {
                    var M = $n(a),
                      U = "1" !== f || M,
                      B = !(!S || U) && "0" === c,
                      z = x.length > 0 && 0 === Number(x[0].rpm),
                      q = x.map((function(e) {
                        return {
                          percentage: String(10 * Number(e.id)),
                          rpm: e.rpm
                        }
                      })),
                      V = A ? function() {
                        for (var e = 10 * Math.ceil(Number(x[x.length - 1].rpm) / 100), t = [], n = 1; n < 11; n += 1) t.push(e * n);
                        return {
                          yUnit: "rpm",
                          yTicks: t
                        }
                      }() : void 0,
                      G = 0 === Number(j) ? 1 : Number(j),
                      H = Math.ceil(Number(q[q.length - 1].rpm) / G) * G,
                      W = Number(R) * G,
                      K = z ? Number(L) : 0,
                      $ = Math.ceil(Number(F) * (100 / 255));
                    E.push(zn(zn({
                      id: r,
                      type: c,
                      fanName: a,
                      caps: {
                        canFanStop: x.length > 0 && 0 === Number(x[0].rpm),
                        isDisableInfo: U,
                        rpmMappingTable: q,
                        yAxis: V,
                        minDuty: K,
                        isCPUfan: "CPU Fan" === a,
                        maxRPM: null !== (t = null === (n = x[x.length - 1]) || void 0 === n ? void 0 : n.rpm) && void 0 !== t ? t : "0",
                        minRPM: 0,
                        maxRpmTxt: "".concat(null === (i = x[x.length - 1]) || void 0 === i ? void 0 : i.rpm, " (RPM)"),
                        minRpmTxt: z ? "".concat(w, " RPM (").concat(O, "%)") : "".concat(w, " (RPM)"),
                        powerLimitTxt: z ? "".concat(T, " RPM (").concat(C, "%)") : null,
                        controlRangeTxt: "".concat(A ? C : O, "% ~ 100%"),
                        rpmStep: G,
                        fixRpmMax: H,
                        fixRpmMin: W,
                        fixRpmMinDuty: z ? Math.floor(100 / (H / G) * Number(R)) : 0,
                        uncontrolableDuty: $
                      }
                    }, h), {}, {
                      stepUnitSupported: b,
                      isAICoolingFan: m && !U,
                      isAICoolingIIFan: p,
                      waterCooler: P,
                      isPLCFan: u,
                      isDisable: B,
                      eqModeInfo: y,
                      enableSelectTemp: h.multiSource.isSupport,
                      spinUpRange: {
                        maxVal: 0,
                        minVal: Number(I) > 0 ? Number(I) : 4,
                        step: 1
                      },
                      spinDownRange: {
                        maxVal: 0,
                        minVal: Number(N) > 0 ? Number(I) : 4,
                        step: 1
                      },
                      isDisableRpmMode: U || !S || "1" === _,
                      isWaterFan: l,
                      isAutoFanStopSupport: k,
                      isEQModeSupported: D
                    }))
                  }
                })), e(In({
                  selectedFanID: null === c ? null !== (r = null === (a = E.find((function(e) {
                    return !1 === e.isDisable
                  }))) || void 0 === a ? void 0 : a.id) && void 0 !== r ? r : null : c,
                  fanList: E,
                  isAICoolingSupport: l,
                  isAICoolingIISupport: f,
                  isPLCsupport: d,
                  isAICooling: m,
                  isAICoolingII: v,
                  isAsusHydranode: g,
                  isDidTuning: S,
                  isRyuJin3Detect: "1" === y
                }))
              } catch (e) {
                throw cn.e(n, "composeFanList fail", e), e
              }
            })), n(function(e, t) {
              return function(n, i) {
                var o = "composeSettingList";
                try {
                  var a = t.ignoreUpdateCurve,
                    s = void 0 !== a && a,
                    c = t.ignoreAICoolingII,
                    p = void 0 !== c && c,
                    u = t.updateTarget,
                    l = void 0 === u ? null : u,
                    d = i().fanControl,
                    f = d.settingList,
                    m = d.fanList,
                    h = d.isAICoolingII,
                    v = l ? _n.clone(f) : [];
                  cn.i(o, "notify, updateTarget: ".concat(l || "all fan", ".")), e && e.forEach((function(e) {
                    var t;
                    if (null === l || e.id === l) {
                      var n = m.find((function(t) {
                        return t.id === e.id
                      }));
                      if (n && !n.isWaterFan) {
                        var i = null != e ? e : {},
                          o = i.id,
                          a = i.curveData,
                          c = i.ai2Curve,
                          u = i.dutyDiff,
                          d = void 0 === u ? 0 : u,
                          g = i.mode,
                          x = i.spinUp,
                          b = i.spinDown,
                          y = i.isEQMode,
                          w = i.isAutoFanStop,
                          _ = i.temperatureSource,
                          E = i.getlastrpm,
                          S = !1,
                          O = null === (t = f.find((function(e) {
                            return e.id === o
                          }))) || void 0 === t ? void 0 : t.settings,
                          T = n.multiSource,
                          C = n.caps,
                          I = n.isAICoolingIIFan,
                          N = _.reduce((function(e, t) {
                            var n = T.sourceArray.find((function(e) {
                              return e.value === t
                            }));
                            return void 0 === n && (n = T.sourceArray.find((function(e) {
                              return !e.disable
                            }))), "CPU" === n.name && (S = !0), n && !n.disable ? [].concat(r()(e), [n.id]) : r()(e)
                          }), []),
                          P = {
                            id: o,
                            mode: g,
                            settings: null,
                            isEQMode: y,
                            isAutoFanStop: w,
                            temperatureSources: N,
                            hasCPUSource: S
                          };
                        if (s) P.settings = O;
                        else {
                          var k = {
                              mode: "0",
                              rpmPercentage: null,
                              rpm: null
                            },
                            D = {
                              mode: "1",
                              spinUpLevel: x,
                              spinDownLevel: b,
                              nodes: [],
                              aiCoolingNodes: [],
                              dutyDiff: d
                            };
                          if ("1" === g) {
                            var A = Wn({
                                curveData: a,
                                ai2Curve: c,
                                caps: C,
                                isCalcAICoolingII: h && I && c.length > 0 && !p
                              }),
                              j = A.nodes,
                              R = A.aiCoolingNodes;
                            D.nodes = j, D.aiCoolingNodes = R
                          } else {
                            var L = Kn(Number(E), C);
                            k.rpmPercentage = L
                          }
                          P.settings = [k, D]
                        }
                        if (l) {
                          var F = v.findIndex((function(e) {
                            return e.id === l
                          }));
                          "-1" !== F ? v[F] = P : v.push(P)
                        } else v.push(P)
                      }
                    }
                  })), n(In({
                    settingList: v
                  }))
                } catch (e) {
                  throw cn.e(o, "composeSettingList fail", e), e
                }
              }
            }(c, {
              ignoreAICoolingII: l,
              ignoreUpdateCurve: f,
              updateTarget: g
            })), h || n(Nn()), void cn.i("composeFanControl", "success.")
          } catch (e) {
            throw cn.e("composeFanControl", "fail."), _n.parseError(e)
          }
        }
      },
      Wn = function(e) {
        var t = e.curveData,
          n = e.ai2Curve,
          i = void 0 === n ? [] : n,
          o = e.caps,
          r = [],
          a = [];
        return e.isCalcAICoolingII ? (r = Gn(i, o.minDuty), a = Gn(t, o.minDuty)) : r = Gn(t, o.minDuty), {
          nodes: r,
          aiCoolingNodes: a
        }
      },
      Kn = function(e, t) {
        var n = 0;
        if (e >= t.fixRpmMax) n = 100;
        else if (e < t.fixRpmMin) n = t.fixRpmMinDuty;
        else {
          var i = (t.fixRpmMax - t.fixRpmMin) / t.rpmStep,
            o = (100 - t.fixRpmMinDuty) / i;
          n = t.fixRpmMinDuty + Math.ceil((e - t.fixRpmMin) / t.rpmStep) * o
        }
        return n
      },
      $n = function(e) {
        var t = !1;
        return Vn.every((function(n) {
          return !String(e).toLocaleLowerCase().includes(n.toLocaleLowerCase()) || (t = !0, !1)
        })), t
      },
      Yn = n(1505).Z,
      Xn = ["Load_FanXProfile"];

    function Jn(e, t) {
      var n = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var i = Object.getOwnPropertySymbols(e);
        t && (i = i.filter((function(t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable
        }))), n.push.apply(n, i)
      }
      return n
    }

    function Qn(e) {
      for (var t = 1; t < arguments.length; t++) {
        var n = null != arguments[t] ? arguments[t] : {};
        t % 2 ? Jn(Object(n), !0).forEach((function(t) {
          O()(e, t, n[t])
        })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Jn(Object(n)).forEach((function(t) {
          Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
        }))
      }
      return e
    }
    var Zn = Yn.settings,
      ei = Zn.dataCollectUrl,
      ti = (Zn.deviceRole, ["full", "turbo", "standard", "silent", "custom"]),
      ni = ["RPM Fix Mode", "Smart Mode"],
      ii = "DataCollect",
      oi = Object.freeze({
        BIMONTHLY_STATISTICS: "602",
        CURRENT_STATE: "603"
      }),
      ri = Object.freeze({
        DeviceType: "50",
        VIDPID: "None",
        TimeData: "5",
        DataTable: "2"
      }),
      ai = Object.freeze({
        data: {
          Load_FanXProfile: 0,
          FanXpert_Switch: "1",
          AICooling_Switch: "-1",
          HYDRANODE_Switch: "-1",
          FanX_PresetMode: "standard",
          FanX_Fan_Mode: "Smart Mode",
          ExtremeQuiet_Switch: "0",
          AutoFanStop_Switch: "0",
          Fan_Count: 0
        },
        getCurrent: function() {
          return this.data
        },
        setCurrent: function(e) {
          var t = this;
          Object.keys(e).forEach((function(n) {
            var i = e[n];
            void 0 !== t.data[n] && (t.data[n] = i)
          }))
        },
        setCurrentDefault: function() {
          this.data = {
            Load_FanXProfile: 0,
            FanXpert_Switch: "1",
            AICooling_Switch: "-1",
            HYDRANODE_Switch: "-1",
            FanX_PresetMode: "standard",
            FanX_Fan_Mode: "Smart Mode",
            ExtremeQuiet_Switch: "0",
            AutoFanStop_Switch: "0",
            Fan_Count: 0
          }
        },
        countLoadProfile: function() {
          this.data.Load_FanXProfile += 1
        }
      }),
      si = function() {
        var e = p()(C().mark((function e() {
          var t, n, i, o, r, a;
          return C().wrap((function(e) {
            for (;;) switch (e.prev = e.next) {
              case 0:
                return e.prev = 0, cn.i(ii, "[restoreData] notify."), e.next = 4, _n.sendRequest(ei, null, {
                  method: "get",
                  responseFormat: "json"
                });
              case 4:
                return i = e.sent, null !== (t = i[oi.BIMONTHLY_STATISTICS]) && void 0 !== t && t.Device.Json && (o = JSON.parse(i[oi.BIMONTHLY_STATISTICS].Device.Json), r = o.Load_FanXProfile, cn.i(ii, "[restoreData] ".concat(oi.BIMONTHLY_STATISTICS, " data: ").concat(i[oi.BIMONTHLY_STATISTICS].Device.Json)), ai.setCurrent({
                  Load_FanXProfile: r
                })), null !== (n = i[oi.CURRENT_STATE]) && void 0 !== n && n.Device.Json && (a = JSON.parse(i[oi.CURRENT_STATE].Device.Json), cn.i(ii, "[restoreData] ".concat(oi.CURRENT_STATE, " data: ").concat(i[oi.CURRENT_STATE].Device.Json)), ai.setCurrent(a)), cn.i(ii, "[restoreData] success"), e.abrupt("return", "{}" === JSON.stringify(i));
              case 11:
                throw e.prev = 11, e.t0 = e.catch(0), cn.e(ii, "[restoreData] fail"), _n.parseError(e.t0);
              case 15:
              case "end":
                return e.stop()
            }
          }), e, null, [
            [0, 11]
          ])
        })));
        return function() {
          return e.apply(this, arguments)
        }
      }(),
      ci = function() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null;
        return function() {
          var t = p()(C().mark((function t(n) {
            var i, o, r, a, c, p;
            return C().wrap((function(t) {
              for (;;) switch (t.prev = t.next) {
                case 0:
                  return t.prev = 0, cn.i(ii, "[sendData] notify."), i = n(ui()), o = ai.getCurrent(), r = o.Load_FanXProfile, a = s()(o, Xn), c = Qn(Qn({}, (null === e || e === oi.BIMONTHLY_STATISTICS) && O()({}, oi.BIMONTHLY_STATISTICS, {
                    Device: Qn(Qn({}, ri), {}, {
                      ModelName: i,
                      Freq: oi.BIMONTHLY_STATISTICS,
                      Json: JSON.stringify({
                        Load_FanXProfile: r
                      })
                    })
                  })), (null === e || e === oi.CURRENT_STATE) && O()({}, oi.CURRENT_STATE, {
                    Device: Qn(Qn({}, ri), {}, {
                      ModelName: i,
                      Freq: oi.CURRENT_STATE,
                      Json: JSON.stringify(Qn({}, a))
                    })
                  })), t.next = 7, _n.sendRequest(ei, c, {
                    method: "put",
                    contentFormat: "json",
                    encodeFormData: !1,
                    responseFormat: "json"
                  });
                case 7:
                  return p = t.sent, cn.i(ii, "[SendData] success, data: ".concat(JSON.stringify(c))), t.abrupt("return", p);
                case 12:
                  throw t.prev = 12, t.t0 = t.catch(0), cn.e(ii, "[sendData] fail"), _n.parseError(t.t0);
                case 16:
                case "end":
                  return t.stop()
              }
            }), t, null, [
              [0, 12]
            ])
          })));
          return function(e) {
            return t.apply(this, arguments)
          }
        }()
      },
      pi = function e() {
        return function(t, n) {
          if (t((function(e, t) {
              return t().fanControl.isDidTuning
            }))) return cn.i(ii, "[initDataCollection] notify."), Promise.resolve().then((function() {
            return si()
          })).then((function() {
            var e, i = n().fanControl,
              o = i.fanList,
              r = i.settingList,
              a = i.isPLCsupport,
              s = i.isAsusHydranode,
              c = i.isAICoolingSupport,
              p = i.isAICooling,
              u = i.isAICoolingIISupport,
              l = i.isAICoolingII,
              d = t((function(e, t) {
                var n, i = t().fanControl,
                  o = i.fanList,
                  r = i.settingList,
                  a = o.filter((function(e) {
                    return !e.isWaterFan
                  })),
                  s = null !== (n = a.find((function(e) {
                    var t;
                    return null === (t = e.caps) || void 0 === t ? void 0 : t.isCPUfan
                  }))) && void 0 !== n ? n : a[0],
                  c = r.find((function(e) {
                    return e.id === s.id
                  }));
                return {
                  fan: s,
                  setting: c
                }
              })),
              f = d.fan,
              m = d.setting;
            return f.isDisable || ai.setCurrent({
              FanX_Fan_Mode: ni[Number(m.mode)]
            }), ai.setCurrent({
              HYDRANODE_Switch: a ? s ? "1" : "0" : "-1",
              AICooling_Switch: c || u ? c ? p ? "1" : "0" : u ? l ? "1" : "0" : "-1" : "-1",
              ExtremeQuiet_Switch: r.some((function(e) {
                return e.isEQMode
              })) ? "1" : "0",
              AutoFanStop_Switch: r.some((function(e) {
                return e.isAutoFanStop
              })) ? "1" : "0",
              Fan_Count: null === (e = o.filter((function(e) {
                return !e.isDisable
              }))) || void 0 === e ? void 0 : e.length
            }), t(ci())
          })).catch(p()(C().mark((function n() {
            return C().wrap((function(n) {
              for (;;) switch (n.prev = n.next) {
                case 0:
                  return n.next = 2, _n.sendRequest(ei, null, {
                    method: "delete",
                    responseFormat: "json"
                  });
                case 2:
                  return n.next = 4, n.sent;
                case 4:
                  t(e());
                case 5:
                case "end":
                  return n.stop()
              }
            }), n)
          }))))
        }
      },
      ui = function() {
        return function(e, t) {
          return t().settings.modelName
        }
      };
    var li = n(1505).Z,
      di = ["isSDKFuncEnable", "isMotherSupported"],
      fi = li.settings,
      mi = fi.url,
      hi = fi.version,
      vi = (fi.deviceType, fi.modelNumber, function(e) {
        return function(t, n) {
          var i = e.isActivated,
            o = e.selectedProfile,
            r = e.modelName,
            a = n().settings.profileList,
            s = a[0];
          o && (s = a.find((function(e) {
            return e.id === o
          }))), t(Ln({
            isActivated: i,
            isDeviceAlive: !0,
            selectedProfile: s,
            modelName: r
          }))
        }
      }),
      gi = function() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        return function(t, n) {
          return new Promise((function(i) {
            var o = n(),
              r = o.settings,
              a = o.fanControl,
              s = r.modelNumber,
              c = r.caps.hasDefaultProfile,
              p = {};
            Promise.resolve().then((function() {
              var n = e.currProfile,
                i = e.profileList,
                o = e.fanControl,
                r = e.isFirstLoginDone;
              p.modelNumber = s;
              var u = n;
              if (void 0 !== r && t(Ln({
                  isFirstLoginDone: !0
                })), c & i && i.forEach((function(e) {
                  "0" === e.id && (e.default = !0)
                })), n && "object" === R()(n) && (t(Ln({
                  selectedProfile: u
                })), p.hasProfile = !0), o) {
                var l = o.profileList,
                  d = o.defaultModeID,
                  f = o.isEnableAllFunc,
                  m = o.isDontShow,
                  h = a.isRyuJin3Detect,
                  v = {};
                void 0 !== l && (v.profileList = l), void 0 !== d && (v.defaultModeID = d), void 0 !== m && (v.isDontShow = !!h && m), void 0 !== f && (v.isEnableAllFunc = f), t(In(v)), p.hasFanControl = !0
              }
            })).then((function() {
              return i(p)
            })).catch((function(e) {
              cn.e("syncConfigSetting", "fail, ".concat(_n.parseError(e), ".")), i()
            }))
          }))
        }
      },
      xi = function() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        return function(t) {
          return new Promise(function() {
            var n = p()(C().mark((function n(i) {
              var o, r;
              return C().wrap((function(n) {
                for (;;) switch (n.prev = n.next) {
                  case 0:
                    if (o = e.globalSettings, r = e.profileSettings, !o) {
                      n.next = 4;
                      break
                    }
                    return n.next = 4, t(gi(o));
                  case 4:
                    if (!r) {
                      n.next = 7;
                      break
                    }
                    return n.next = 7, t(gi(r));
                  case 7:
                    i({
                      hasGlobalSettings: !!o,
                      hasProfileSettings: !!r
                    });
                  case 8:
                  case "end":
                    return n.stop()
                }
              }), n)
            })));
            return function(e) {
              return n.apply(this, arguments)
            }
          }())
        }
      },
      bi = function(e) {
        return function() {
          var t = p()(C().mark((function t(n) {
            var i, o, r, a, c, p, u;
            return C().wrap((function(t) {
              for (;;) switch (t.prev = t.next) {
                case 0:
                  return i = "initialLoadingAlertPage", o = "".concat(mi, "/initialize/alertPage"), t.prev = 2, cn.i(i, "send initialize alertPage to server."), t.next = 6, _n.sendRequest(o, {
                    isQuickInit: e
                  }, {
                    method: "get",
                    timeout: 12e4,
                    responseFormat: "json"
                  });
                case 6:
                  if (r = t.sent, a = r.isSDKFuncEnable, c = void 0 === a || a, p = r.isMotherSupported, u = s()(r, di), c) {
                    t.next = 14;
                    break
                  }
                  return n(In({
                    isEnableAllFunc: !1
                  })), t.abrupt("return", void 0);
                case 14:
                  return n(In({
                    isMBSupport: p
                  })), n(vi(u)), t.abrupt("return", u);
                case 19:
                  throw t.prev = 19, t.t0 = t.catch(2), cn.e(i, "fail, ".concat(JSON.stringify(t.t0), ".")), _n.parseError(t.t0);
                case 23:
                case "end":
                  return t.stop()
              }
            }), t, null, [
              [2, 19]
            ])
          })));
          return function(e) {
            return t.apply(this, arguments)
          }
        }()
      },
      yi = function(e) {
        return function(t) {
          return new Promise(function() {
            var n = p()(C().mark((function n(i, o) {
              var r;
              return C().wrap((function(n) {
                for (;;) switch (n.prev = n.next) {
                  case 0:
                    r = "initializeAlertPage", cn.i(r, "========== ".concat(hi, " ==========")), cn.i(r, "Start to initialize."), Promise.resolve().then((function() {
                      return t(bi(e))
                    })).then(function() {
                      var e = p()(C().mark((function e(n) {
                        var i, o, r, a, s, c, u;
                        return C().wrap((function(e) {
                          for (;;) switch (e.prev = e.next) {
                            case 0:
                              if (void 0 !== n) {
                                e.next = 2;
                                break
                              }
                              return e.abrupt("return");
                            case 2:
                              return i = n.fanCaps, o = n.fansProfile, r = n.ai2EnableFanList, a = n.hasEverLoadAICoolingII, t(In({
                                ai2EnableFanList: r,
                                hasEverLoadAICoolingII: a
                              })), e.next = 6, t(Hn({
                                fanCaps: i,
                                fansProfile: o
                              }));
                            case 6:
                              return e.next = 8, t(xi(n));
                            case 8:
                              if (s = e.sent, c = s.hasGlobalSettings, u = s.hasProfileSettings, c) {
                                e.next = 14;
                                break
                              }
                              return e.next = 14, t((function(e) {
                                return e(function() {
                                  var e = p()(C().mark((function e(t, n) {
                                    var i, o, r, a, s, c, p, u;
                                    return C().wrap((function(e) {
                                      for (;;) switch (e.prev = e.next) {
                                        case 0:
                                          return i = n(), o = i.settings, r = i.fanControl, a = o.profileList, s = o.swProfileList, c = o.selectedProfile, p = r.profileList, u = {
                                            profileList: a,
                                            swProfileList: s,
                                            currProfile: c,
                                            isFirstLoginDone: !0,
                                            fanControl: {
                                              profileList: p.map((function(e) {
                                                return {
                                                  id: e.id,
                                                  name: e.name,
                                                  type: e.type,
                                                  isAICoolingII: e.isAICoolingII
                                                }
                                              }))
                                            }
                                          }, cn.i("saveGlobalConfig", "notify."), cn.i("saveGlobalConfig", "fan profile list count： ".concat(p.length)), e.abrupt("return", kn("config.xml", JSON.stringify(u)));
                                        case 7:
                                        case "end":
                                          return e.stop()
                                      }
                                    }), e)
                                  })));
                                  return function(t, n) {
                                    return e.apply(this, arguments)
                                  }
                                }())
                              }));
                            case 14:
                              if (u) {
                                e.next = 17;
                                break
                              }
                              return e.next = 17, t(Dn());
                            case 17:
                              t(function() {
                                var e = p()(C().mark((function e(t) {
                                  var n, i, o, r, a, s, c;
                                  return C().wrap((function(e) {
                                    for (;;) switch (e.prev = e.next) {
                                      case 0:
                                        return cn.i(ii, "modifyExistData."), o = t(ui()), e.next = 4, _n.sendRequest(ei, null, {
                                          method: "get",
                                          responseFormat: "json"
                                        });
                                      case 4:
                                        if (r = e.sent, a = {}, void 0 === r[oi.BIMONTHLY_STATISTICS] && null !== (n = r[607]) && void 0 !== n && n.Device.Json && (a[oi.BIMONTHLY_STATISTICS] = {
                                            Device: Qn(Qn({}, ri), {}, {
                                              ModelName: o,
                                              Freq: oi.BIMONTHLY_STATISTICS,
                                              Json: null === (s = r[607]) || void 0 === s ? void 0 : s.Device.Json
                                            })
                                          }), void 0 === r[oi.CURRENT_STATE] && null !== (i = r[608]) && void 0 !== i && i.Device.Json && (a[oi.CURRENT_STATE] = {
                                            Device: Qn(Qn({}, ri), {}, {
                                              ModelName: o,
                                              Freq: oi.CURRENT_STATE,
                                              Json: null === (c = r[608]) || void 0 === c ? void 0 : c.Device.Json
                                            })
                                          }), !(Object.keys(a).length > 0)) {
                                          e.next = 15;
                                          break
                                        }
                                        return a[oi.BIMONTHLY_STATISTICS].Device.ModelName = o, a[oi.CURRENT_STATE].Device.ModelName = o, e.next = 13, _n.sendRequest(ei, a, {
                                          method: "put",
                                          contentFormat: "json",
                                          encodeFormData: !1,
                                          responseFormat: "json"
                                        });
                                      case 13:
                                        e.next = 17;
                                        break;
                                      case 15:
                                        return e.next = 17, t(pi());
                                      case 17:
                                      case "end":
                                        return e.stop()
                                    }
                                  }), e)
                                })));
                                return function(t) {
                                  return e.apply(this, arguments)
                                }
                              }());
                            case 18:
                            case "end":
                              return e.stop()
                          }
                        }), e)
                      })));
                      return function(t) {
                        return e.apply(this, arguments)
                      }
                    }()).then((function() {
                      cn.i(r, "finished."), i()
                    })).catch((function(e) {
                      var t = _n.parseError(e);
                      cn.e(r, "fail, ".concat(JSON.stringify(e), ".")), t === En.MB_NOT_SUPPORTED ? i() : o(_n.parseError(e))
                    }));
                  case 4:
                  case "end":
                    return n.stop()
                }
              }), n)
            })));
            return function(e, t) {
              return n.apply(this, arguments)
            }
          }())
        }
      },
      wi = Object.freeze({
        GET_FAN_TUNING: "7",
        GET_FAN_TEMPERATURE: "16",
        AI_COOLING_II: "21",
        FAN_STATE: "FAN_STATE",
        CHECK_DEVICE_SUPPORT: "20001",
        FAN_MODE: "20002",
        SWITCH_AI2: "20003",
        AI2_STRESS_START: "20004",
        REFRESH_UI: "50101",
        AI2_STATUS_CHANGE: "50102",
        AI2_FINISH: "50103",
        CLEAR_DATA_COLLECTION: "40001"
      });

    function _i(e, t) {
      var n = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var i = Object.getOwnPropertySymbols(e);
        t && (i = i.filter((function(t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable
        }))), n.push.apply(n, i)
      }
      return n
    }

    function Ei(e) {
      for (var t = 1; t < arguments.length; t++) {
        var n = null != arguments[t] ? arguments[t] : {};
        t % 2 ? _i(Object(n), !0).forEach((function(t) {
          O()(e, t, n[t])
        })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : _i(Object(n)).forEach((function(t) {
          Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
        }))
      }
      return e
    }
    var Si = n(1505).Z.settings.url,
      Oi = {
        contentFormat: "json",
        encodeFormData: !1,
        responseFormat: "json",
        retry: !0,
        timeout: 6e4
      },
      Ti = function() {
        var e = p()(C().mark((function e(t) {
          var n, i, o, r, a;
          return C().wrap((function(e) {
            for (;;) switch (e.prev = e.next) {
              case 0:
                return cn.i("request", "send switchAICoolingIIStatus to server."), e.next = 3, _n.sendRequest("".concat(Si, "/aiCoolingII"), {
                  data: {
                    status: t
                  }
                }, Ei({
                  method: "put"
                }, Oi));
              case 3:
                if (n = e.sent, i = n.successful, o = n.ai2EnableFanList, r = n.fanCaps, a = n.fansProfile, i || !t) {
                  e.next = 10;
                  break
                }
                throw new Error("aic2 load fail");
              case 10:
                return e.abrupt("return", {
                  ai2EnableFanList: o,
                  fanCaps: r,
                  fansProfile: a
                });
              case 11:
              case "end":
                return e.stop()
            }
          }), e)
        })));
        return function(t) {
          return e.apply(this, arguments)
        }
      }(),
      Ci = function(e, t) {
        return cn.i("request", "send registerFanEvent to server, method: ".concat(t, ".")), _n.sendRequest("".concat(Si, "/registerEvent/fanState"), {
          targetRoles: "devicePage",
          data: e
        }, Ei({
          method: t
        }, Oi))
      },
      Ii = n(1505).Z.settings,
      Ni = (Ii.alertSocketServer, Ii.ws, new(D().Builder)({
        headless: !0
      }), null),
      Pi = (n(1505).Z.settings.url, function() {
        return function(e, t) {
          var n, i = t(),
            o = i.settings,
            r = i.fanControl,
            a = o.deviceType,
            s = o.modelNumber,
            c = r.isAICoolingII,
            p = r.ai2EnableFanList;
          n = {
            target: {
              role: ["alertPage", "deviceService"],
              deviceType: a,
              pid: s
            },
            msg: {
              cmd: wi.AI2_STATUS_CHANGE,
              isAICoolingII: c,
              ai2EnableFanList: p
            }
          }, new Promise((function(e, t) {
            try {
              var i = {
                command: "broadcastEvent",
                target: n.target,
                msg: n.msg
              };
              cn.i("[Device Page Broadcast]", JSON.stringify(i, null, 4)), Ni.send(JSON.stringify(i)), e()
            } catch (e) {
              t()
            }
          }))
        }
      }),
      ki = A.FAN_MODE,
      Di = A.mapPercentage2Rpm,
      Ai = function(e) {
        return function(t, n) {
          return new Promise((function(i, o) {
            var r = n().fanControl,
              a = r.settingList,
              s = r.fanList,
              c = r.isAICoolingII,
              p = r.ai2EnableFanList,
              u = void 0 === p ? [] : p,
              l = a,
              d = [];
            e && (l = Array.isArray(e) ? a.filter((function(t) {
                var n = t.id;
                return -1 !== e.indexOf(n)
              })) : a.filter((function(t) {
                var n = t.id;
                return e === n
              }))), l.forEach((function(e) {
                var t = e.id,
                  n = e.mode,
                  i = e.settings,
                  o = e.isAutoFanStop,
                  r = e.temperatureSources,
                  a = e.hasCPUSource,
                  p = s.find((function(e) {
                    return e.id === t
                  })),
                  l = p.caps,
                  f = p.multiSource,
                  m = p.isAICoolingIIFan,
                  h = p.isWaterFan,
                  v = p.isDisable;
                if (!h && !v) {
                  var g = i.find((function(e) {
                      return e.mode === ki.SMART_MODE
                    })),
                    x = i.find((function(e) {
                      return e.mode === ki.RPM_FIX_MODE
                    })),
                    b = [];
                  g.nodes.forEach((function(e) {
                    b.push({
                      x: String(Math.round(Number(e.temperature))),
                      y: String(Math.round(255 * Number(e.percentage) / 100))
                    })
                  })), b.length > 0 && b.length < 4 && b.push(b[2]);
                  var y = {
                      settings: {
                        autoFanStop: o,
                        spinUpIndex: g.spinUpLevel,
                        spinDownIndex: g.spinDownLevel,
                        curveData: {
                          points: b
                        },
                        multisource: r.map((function(e) {
                          var t = f.sourceArray.find((function(t) {
                            return t.id === e
                          }));
                          return t.value
                        }))
                      }
                    },
                    w = {
                      fanRPM: x.rpm || Di(x.rpmPercentage, l.rpmMappingTable, l)
                    };
                  a && m && c && cn.i("setFansConfig", "fanID: ".concat(t, " is support aiCooling2.")), d.push({
                    fanID: t,
                    mode: n,
                    isAiCoolingFan: a && m && u.includes(t) && c,
                    smartSettings: y,
                    rpmSettings: w
                  })
                }
              })),
              function(e) {
                return cn.i("request", "send setFansConfig to server."), _n.sendRequest("".concat(Si, "/fansInfo"), {
                  data: {
                    settingList: e
                  }
                }, Ei({
                  method: "put"
                }, Oi))
              }(d).then((function(e) {
                if (e && e.length > 0) {
                  var n = _n.clone(a);
                  e.forEach((function(e) {
                    var t = e.fanID,
                      i = e.newCurve,
                      o = void 0 === i ? [] : i,
                      r = e.dutyDiff,
                      a = void 0 === r ? 0 : r,
                      c = n.find((function(e) {
                        return e.id === t
                      })),
                      p = c.mode,
                      u = c.settings,
                      l = s.find((function(e) {
                        return e.id === t
                      })).caps;
                    if (p === ki.SMART_MODE) {
                      var d = u.find((function(e) {
                        return e.mode === ki.SMART_MODE
                      }));
                      d.aiCoolingNodes = Gn(o, l.minDuty), d.dutyDiff = a
                    }
                  })), t(In({
                    settingList: n
                  }))
                }
                i()
              })).catch((function(e) {
                return o(e)
              }))
          }))
        }
      },
      ji = function(e) {
        return function(t) {
          return new Promise((function(n, i) {
            cn.i("onPresetMode", "notify."), Promise.resolve().then((function() {
              return t = {
                fanMode: e
              }, cn.i("request", "send setFanMode to server."), _n.sendRequest("".concat(Si, "/fanPresetMode"), {
                data: t
              }, Ei({
                method: "put"
              }, Oi));
              var t
            })).then((function(e) {
              if (e) return t(Hn(e, {
                ignoreAICoolingII: !0,
                ignoreTempUpdate: !0
              }))
            })).then((function() {
              if ("0" !== e) return t((function(e, t) {
                var n = t().fanControl,
                  i = n.isAICoolingII,
                  o = n.fanList,
                  r = n.ai2EnableFanList,
                  a = void 0 === r ? [] : r;
                if (i) {
                  var s = o.filter((function(e) {
                    return e.isAICoolingIIFan && a.includes(e.id)
                  })).map((function(e) {
                    return e.id
                  }));
                  if (s.length > 0) return e(Ai(s));
                  cn.i("onPresetMode", "There is None of the fan support aiCooling2.")
                }
              }))
            })).then((function() {
              return t(Ri(!0))
            })).then((function() {
              return t((n = e, function() {
                var e = p()(C().mark((function e(t) {
                  return C().wrap((function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        if (t((function(e, t) {
                            return t().fanControl.isDidTuning
                          }))) {
                          e.next = 2;
                          break
                        }
                        return e.abrupt("return");
                      case 2:
                        return cn.i(ii, "[collectPresetMode] notify."), ai.setCurrent({
                          FanX_PresetMode: ti[Number(n)],
                          FanX_Fan_Mode: ni[1]
                        }), e.next = 6, t(ci(oi.CURRENT_STATE));
                      case 6:
                      case "end":
                        return e.stop()
                    }
                  }), e)
                })));
                return function(t) {
                  return e.apply(this, arguments)
                }
              }()));
              var n
            })).then(function() {
              var e = p()(C().mark((function e(i) {
                return C().wrap((function(e) {
                  for (;;) switch (e.prev = e.next) {
                    case 0:
                      return cn.i("onPresetMode", "success."), e.next = 3, t(Dn());
                    case 3:
                      n(i);
                    case 4:
                    case "end":
                      return e.stop()
                  }
                }), e)
              })));
              return function(t) {
                return e.apply(this, arguments)
              }
            }()).catch((function(e) {
              cn.e("onPresetMode", "failed."), i(_n.parseError(e))
            }))
          }))
        }
      },
      Ri = function(e) {
        return function() {
          var t = p()(C().mark((function t(n, i) {
            var o, r, a, s, c, p, u, l, d, f, m, h, v;
            return C().wrap((function(t) {
              for (;;) switch (t.prev = t.next) {
                case 0:
                  if (t.prev = 0, o = i(), r = o.settings, a = o.fanControl, s = a.settingList, c = a.selectedFanID, 0 !== (p = a.fanList).length) {
                    t.next = 4;
                    break
                  }
                  return t.abrupt("return");
                case 4:
                  if (u = r.caps.fanControl.isSetGetFanInfoEvent, l = p.find((function(e) {
                      return e.id === c
                    })), d = s.find((function(e) {
                      return e.id === c
                    })), u) {
                    t.next = 10;
                    break
                  }
                  return cn.i("subscribeFanStateEvent", "caps isSetGetFanInfoEvent is false"), t.abrupt("return");
                case 10:
                  return cn.i("subscribeFanStateEvent", "notify."), f = l.isWaterFan ? e : e && (null == d ? void 0 : d.mode) === ki.SMART_MODE, m = null, f && (h = [], l.isWaterFan || (h = d.temperatureSources.map((function(e) {
                    return {
                      temperatureID: e
                    }
                  }))), m = {
                    fanID: c,
                    temperatureIDs: h,
                    isWaterFan: l.isWaterFan
                  }), t.next = 16, Ci(m, f ? "put" : "delete");
                case 16:
                  return v = t.sent, f && n(Li(v)), cn.i("subscribeFanStateEvent", "success."), t.abrupt("return", !0);
                case 22:
                  throw t.prev = 22, t.t0 = t.catch(0), cn.e("subscribeFanStateEvent", "failed."), _n.parseError(t.t0);
                case 26:
                case "end":
                  return t.stop()
              }
            }), t, null, [
              [0, 22]
            ])
          })));
          return function(e, n) {
            return t.apply(this, arguments)
          }
        }()
      },
      Li = function(e) {
        return function(t) {
          var n = "updateFanState";
          cn.i(n, "updateFanState start.");
          try {
            var i = e.rpm,
              o = e.temperatureArr,
              r = e.currentPoint,
              a = e.aiCoolingPoint,
              s = e.waterColor;
            s ? (cn.i(n, "is water color"), t(Fi(s))) : (cn.i(n, "currentPoint {x: ".concat(r.x, " ,y: ").concat(r.y, "}")), cn.i(n, "aiCoolingPoint {x: ".concat(a.x, " ,y: ").concat(a.y, "}")), t(Nn(o)), t({
              type: "UPDATE_CURRENT_POINT",
              data: {
                currentPoint: r,
                aiCoolingPoint: a,
                rpm: i
              }
            }), cn.i(n, "updateFanState finish."))
          } catch (e) {
            cn.e(n, "updateFanState fail", e)
          }
        }
      },
      Fi = function(e) {
        return function(t, n) {
          var i = n().fanControl,
            o = i.selectedFanID,
            r = i.fanList,
            a = _n.clone(r);
          a.find((function(e) {
            return e.id === o
          })).waterCooler = e, t(In({
            fanList: a
          }))
        }
      };

    function Mi(e) {
      return Mi = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
        return typeof e
      } : function(e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
      }, Mi(e)
    }

    function Ui(e, t, n) {
      return (t = function(e) {
        var t = function(e, t) {
          if ("object" !== Mi(e) || null === e) return e;
          var n = e[Symbol.toPrimitive];
          if (void 0 !== n) {
            var i = n.call(e, "string");
            if ("object" !== Mi(i)) return i;
            throw new TypeError("@@toPrimitive must return a primitive value.")
          }
          return String(e)
        }(e);
        return "symbol" === Mi(t) ? t : String(t)
      }(t)) in e ? Object.defineProperty(e, t, {
        value: n,
        enumerable: !0,
        configurable: !0,
        writable: !0
      }) : e[t] = n, e
    }

    function Bi(e, t) {
      var n = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var i = Object.getOwnPropertySymbols(e);
        t && (i = i.filter((function(t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable
        }))), n.push.apply(n, i)
      }
      return n
    }

    function zi(e) {
      for (var t = 1; t < arguments.length; t++) {
        var n = null != arguments[t] ? arguments[t] : {};
        t % 2 ? Bi(Object(n), !0).forEach((function(t) {
          Ui(e, t, n[t])
        })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Bi(Object(n)).forEach((function(t) {
          Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
        }))
      }
      return e
    }

    function qi(e) {
      return "Minified Redux error #" + e + "; visit https://redux.js.org/Errors?code=" + e + " for the full message or use the non-minified dev environment for full errors. "
    }
    var Vi = "function" == typeof Symbol && Symbol.observable || "@@observable",
      Gi = function() {
        return Math.random().toString(36).substring(7).split("").join(".")
      },
      Hi = {
        INIT: "@@redux/INIT" + Gi(),
        REPLACE: "@@redux/REPLACE" + Gi(),
        PROBE_UNKNOWN_ACTION: function() {
          return "@@redux/PROBE_UNKNOWN_ACTION" + Gi()
        }
      };

    function Wi(e, t, n) {
      var i;
      if ("function" == typeof t && "function" == typeof n || "function" == typeof n && "function" == typeof arguments[3]) throw new Error(qi(0));
      if ("function" == typeof t && void 0 === n && (n = t, t = void 0), void 0 !== n) {
        if ("function" != typeof n) throw new Error(qi(1));
        return n(Wi)(e, t)
      }
      if ("function" != typeof e) throw new Error(qi(2));
      var o = e,
        r = t,
        a = [],
        s = a,
        c = !1;

      function p() {
        s === a && (s = a.slice())
      }

      function u() {
        if (c) throw new Error(qi(3));
        return r
      }

      function l(e) {
        if ("function" != typeof e) throw new Error(qi(4));
        if (c) throw new Error(qi(5));
        var t = !0;
        return p(), s.push(e),
          function() {
            if (t) {
              if (c) throw new Error(qi(6));
              t = !1, p();
              var n = s.indexOf(e);
              s.splice(n, 1), a = null
            }
          }
      }

      function d(e) {
        if (! function(e) {
            if ("object" != typeof e || null === e) return !1;
            for (var t = e; null !== Object.getPrototypeOf(t);) t = Object.getPrototypeOf(t);
            return Object.getPrototypeOf(e) === t
          }(e)) throw new Error(qi(7));
        if (void 0 === e.type) throw new Error(qi(8));
        if (c) throw new Error(qi(9));
        try {
          c = !0, r = o(r, e)
        } finally {
          c = !1
        }
        for (var t = a = s, n = 0; n < t.length; n++)(0, t[n])();
        return e
      }
      return d({
        type: Hi.INIT
      }), (i = {
        dispatch: d,
        subscribe: l,
        getState: u,
        replaceReducer: function(e) {
          if ("function" != typeof e) throw new Error(qi(10));
          o = e, d({
            type: Hi.REPLACE
          })
        }
      })[Vi] = function() {
        var e, t = l;
        return (e = {
          subscribe: function(e) {
            if ("object" != typeof e || null === e) throw new Error(qi(11));

            function n() {
              e.next && e.next(u())
            }
            return n(), {
              unsubscribe: t(n)
            }
          }
        })[Vi] = function() {
          return this
        }, e
      }, i
    }

    function Ki(e) {
      for (var t = Object.keys(e), n = {}, i = 0; i < t.length; i++) {
        var o = t[i];
        "function" == typeof e[o] && (n[o] = e[o])
      }
      var r, a = Object.keys(n);
      try {
        ! function(e) {
          Object.keys(e).forEach((function(t) {
            var n = e[t];
            if (void 0 === n(void 0, {
                type: Hi.INIT
              })) throw new Error(qi(12));
            if (void 0 === n(void 0, {
                type: Hi.PROBE_UNKNOWN_ACTION()
              })) throw new Error(qi(13))
          }))
        }(n)
      } catch (e) {
        r = e
      }
      return function(e, t) {
        if (void 0 === e && (e = {}), r) throw r;
        for (var i = !1, o = {}, s = 0; s < a.length; s++) {
          var c = a[s],
            p = n[c],
            u = e[c],
            l = p(u, t);
          if (void 0 === l) throw t && t.type, new Error(qi(14));
          o[c] = l, i = i || l !== u
        }
        return (i = i || a.length !== Object.keys(e).length) ? o : e
      }
    }

    function $i() {
      for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
      return 0 === t.length ? function(e) {
        return e
      } : 1 === t.length ? t[0] : t.reduce((function(e, t) {
        return function() {
          return e(t.apply(void 0, arguments))
        }
      }))
    }

    function Yi() {
      for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
      return function(e) {
        return function() {
          var n = e.apply(void 0, arguments),
            i = function() {
              throw new Error(qi(15))
            },
            o = {
              getState: n.getState,
              dispatch: function() {
                return i.apply(void 0, arguments)
              }
            },
            r = t.map((function(e) {
              return e(o)
            }));
          return i = $i.apply(void 0, r)(n.dispatch), zi(zi({}, n), {}, {
            dispatch: i
          })
        }
      }
    }

    function Xi(e) {
      for (var t = arguments.length, n = Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++) n[i - 1] = arguments[i];
      throw Error("[Immer] minified error nr: " + e + (n.length ? " " + n.map((function(e) {
        return "'" + e + "'"
      })).join(",") : "") + ". Find the full error at: https://bit.ly/3cXEKWf")
    }

    function Ji(e) {
      return !!e && !!e[Mo]
    }

    function Qi(e) {
      var t;
      return !!e && (function(e) {
        if (!e || "object" != typeof e) return !1;
        var t = Object.getPrototypeOf(e);
        if (null === t) return !0;
        var n = Object.hasOwnProperty.call(t, "constructor") && t.constructor;
        return n === Object || "function" == typeof n && Function.toString.call(n) === Uo
      }(e) || Array.isArray(e) || !!e[Fo] || !!(null === (t = e.constructor) || void 0 === t ? void 0 : t[Fo]) || oo(e) || ro(e))
    }

    function Zi(e, t, n) {
      void 0 === n && (n = !1), 0 === eo(e) ? (n ? Object.keys : Bo)(e).forEach((function(i) {
        n && "symbol" == typeof i || t(i, e[i], e)
      })) : e.forEach((function(n, i) {
        return t(i, n, e)
      }))
    }

    function eo(e) {
      var t = e[Mo];
      return t ? t.i > 3 ? t.i - 4 : t.i : Array.isArray(e) ? 1 : oo(e) ? 2 : ro(e) ? 3 : 0
    }

    function to(e, t) {
      return 2 === eo(e) ? e.has(t) : Object.prototype.hasOwnProperty.call(e, t)
    }

    function no(e, t, n) {
      var i = eo(e);
      2 === i ? e.set(t, n) : 3 === i ? e.add(n) : e[t] = n
    }

    function io(e, t) {
      return e === t ? 0 !== e || 1 / e == 1 / t : e != e && t != t
    }

    function oo(e) {
      return Ao && e instanceof Map
    }

    function ro(e) {
      return jo && e instanceof Set
    }

    function ao(e) {
      return e.o || e.t
    }

    function so(e) {
      if (Array.isArray(e)) return Array.prototype.slice.call(e);
      var t = zo(e);
      delete t[Mo];
      for (var n = Bo(t), i = 0; i < n.length; i++) {
        var o = n[i],
          r = t[o];
        !1 === r.writable && (r.writable = !0, r.configurable = !0), (r.get || r.set) && (t[o] = {
          configurable: !0,
          writable: !0,
          enumerable: r.enumerable,
          value: e[o]
        })
      }
      return Object.create(Object.getPrototypeOf(e), t)
    }

    function co(e, t) {
      return void 0 === t && (t = !1), uo(e) || Ji(e) || !Qi(e) || (eo(e) > 1 && (e.set = e.add = e.clear = e.delete = po), Object.freeze(e), t && Zi(e, (function(e, t) {
        return co(t, !0)
      }), !0)), e
    }

    function po() {
      Xi(2)
    }

    function uo(e) {
      return null == e || "object" != typeof e || Object.isFrozen(e)
    }

    function lo(e) {
      var t = qo[e];
      return t || Xi(18, e), t
    }

    function fo() {
      return ko
    }

    function mo(e, t) {
      t && (lo("Patches"), e.u = [], e.s = [], e.v = t)
    }

    function ho(e) {
      vo(e), e.p.forEach(xo), e.p = null
    }

    function vo(e) {
      e === ko && (ko = e.l)
    }

    function go(e) {
      return ko = {
        p: [],
        l: ko,
        h: e,
        m: !0,
        _: 0
      }
    }

    function xo(e) {
      var t = e[Mo];
      0 === t.i || 1 === t.i ? t.j() : t.g = !0
    }

    function bo(e, t) {
      t._ = t.p.length;
      var n = t.p[0],
        i = void 0 !== e && e !== n;
      return t.h.O || lo("ES5").S(t, e, i), i ? (n[Mo].P && (ho(t), Xi(4)), Qi(e) && (e = yo(t, e), t.l || _o(t, e)), t.u && lo("Patches").M(n[Mo].t, e, t.u, t.s)) : e = yo(t, n, []), ho(t), t.u && t.v(t.u, t.s), e !== Lo ? e : void 0
    }

    function yo(e, t, n) {
      if (uo(t)) return t;
      var i = t[Mo];
      if (!i) return Zi(t, (function(o, r) {
        return wo(e, i, t, o, r, n)
      }), !0), t;
      if (i.A !== e) return t;
      if (!i.P) return _o(e, i.t, !0), i.t;
      if (!i.I) {
        i.I = !0, i.A._--;
        var o = 4 === i.i || 5 === i.i ? i.o = so(i.k) : i.o,
          r = o,
          a = !1;
        3 === i.i && (r = new Set(o), o.clear(), a = !0), Zi(r, (function(t, r) {
          return wo(e, i, o, t, r, n, a)
        })), _o(e, o, !1), n && e.u && lo("Patches").N(i, n, e.u, e.s)
      }
      return i.o
    }

    function wo(e, t, n, i, o, r, a) {
      if (Ji(o)) {
        var s = yo(e, o, r && t && 3 !== t.i && !to(t.R, i) ? r.concat(i) : void 0);
        if (no(n, i, s), !Ji(s)) return;
        e.m = !1
      } else a && n.add(o);
      if (Qi(o) && !uo(o)) {
        if (!e.h.D && e._ < 1) return;
        yo(e, o), t && t.A.l || _o(e, o)
      }
    }

    function _o(e, t, n) {
      void 0 === n && (n = !1), !e.l && e.h.D && e.m && co(t, n)
    }

    function Eo(e, t) {
      var n = e[Mo];
      return (n ? ao(n) : e)[t]
    }

    function So(e, t) {
      if (t in e)
        for (var n = Object.getPrototypeOf(e); n;) {
          var i = Object.getOwnPropertyDescriptor(n, t);
          if (i) return i;
          n = Object.getPrototypeOf(n)
        }
    }

    function Oo(e) {
      e.P || (e.P = !0, e.l && Oo(e.l))
    }

    function To(e) {
      e.o || (e.o = so(e.t))
    }

    function Co(e, t, n) {
      var i = oo(t) ? lo("MapSet").F(t, n) : ro(t) ? lo("MapSet").T(t, n) : e.O ? function(e, t) {
        var n = Array.isArray(e),
          i = {
            i: n ? 1 : 0,
            A: t ? t.A : fo(),
            P: !1,
            I: !1,
            R: {},
            l: t,
            t: e,
            k: null,
            o: null,
            j: null,
            C: !1
          },
          o = i,
          r = Vo;
        n && (o = [i], r = Go);
        var a = Proxy.revocable(o, r),
          s = a.revoke,
          c = a.proxy;
        return i.k = c, i.j = s, c
      }(t, n) : lo("ES5").J(t, n);
      return (n ? n.A : fo()).p.push(i), i
    }

    function Io(e) {
      return Ji(e) || Xi(22, e),
        function e(t) {
          if (!Qi(t)) return t;
          var n, i = t[Mo],
            o = eo(t);
          if (i) {
            if (!i.P && (i.i < 4 || !lo("ES5").K(i))) return i.t;
            i.I = !0, n = No(t, o), i.I = !1
          } else n = No(t, o);
          return Zi(n, (function(t, o) {
            i && function(e, t) {
              return 2 === eo(e) ? e.get(t) : e[t]
            }(i.t, t) === o || no(n, t, e(o))
          })), 3 === o ? new Set(n) : n
        }(e)
    }

    function No(e, t) {
      switch (t) {
        case 2:
          return new Map(e);
        case 3:
          return Array.from(e)
      }
      return so(e)
    }
    var Po, ko, Do = "undefined" != typeof Symbol && "symbol" == typeof Symbol("x"),
      Ao = "undefined" != typeof Map,
      jo = "undefined" != typeof Set,
      Ro = "undefined" != typeof Proxy && void 0 !== Proxy.revocable && "undefined" != typeof Reflect,
      Lo = Do ? Symbol.for("immer-nothing") : ((Po = {})["immer-nothing"] = !0, Po),
      Fo = Do ? Symbol.for("immer-draftable") : "__$immer_draftable",
      Mo = Do ? Symbol.for("immer-state") : "__$immer_state",
      Uo = ("undefined" != typeof Symbol && Symbol.iterator, "" + Object.prototype.constructor),
      Bo = "undefined" != typeof Reflect && Reflect.ownKeys ? Reflect.ownKeys : void 0 !== Object.getOwnPropertySymbols ? function(e) {
        return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e))
      } : Object.getOwnPropertyNames,
      zo = Object.getOwnPropertyDescriptors || function(e) {
        var t = {};
        return Bo(e).forEach((function(n) {
          t[n] = Object.getOwnPropertyDescriptor(e, n)
        })), t
      },
      qo = {},
      Vo = {
        get: function(e, t) {
          if (t === Mo) return e;
          var n = ao(e);
          if (!to(n, t)) return function(e, t, n) {
            var i, o = So(t, n);
            return o ? "value" in o ? o.value : null === (i = o.get) || void 0 === i ? void 0 : i.call(e.k) : void 0
          }(e, n, t);
          var i = n[t];
          return e.I || !Qi(i) ? i : i === Eo(e.t, t) ? (To(e), e.o[t] = Co(e.A.h, i, e)) : i
        },
        has: function(e, t) {
          return t in ao(e)
        },
        ownKeys: function(e) {
          return Reflect.ownKeys(ao(e))
        },
        set: function(e, t, n) {
          var i = So(ao(e), t);
          if (null == i ? void 0 : i.set) return i.set.call(e.k, n), !0;
          if (!e.P) {
            var o = Eo(ao(e), t),
              r = null == o ? void 0 : o[Mo];
            if (r && r.t === n) return e.o[t] = n, e.R[t] = !1, !0;
            if (io(n, o) && (void 0 !== n || to(e.t, t))) return !0;
            To(e), Oo(e)
          }
          return e.o[t] === n && (void 0 !== n || t in e.o) || Number.isNaN(n) && Number.isNaN(e.o[t]) || (e.o[t] = n, e.R[t] = !0), !0
        },
        deleteProperty: function(e, t) {
          return void 0 !== Eo(e.t, t) || t in e.t ? (e.R[t] = !1, To(e), Oo(e)) : delete e.R[t], e.o && delete e.o[t], !0
        },
        getOwnPropertyDescriptor: function(e, t) {
          var n = ao(e),
            i = Reflect.getOwnPropertyDescriptor(n, t);
          return i ? {
            writable: !0,
            configurable: 1 !== e.i || "length" !== t,
            enumerable: i.enumerable,
            value: n[t]
          } : i
        },
        defineProperty: function() {
          Xi(11)
        },
        getPrototypeOf: function(e) {
          return Object.getPrototypeOf(e.t)
        },
        setPrototypeOf: function() {
          Xi(12)
        }
      },
      Go = {};
    Zi(Vo, (function(e, t) {
      Go[e] = function() {
        return arguments[0] = arguments[0][0], t.apply(this, arguments)
      }
    })), Go.deleteProperty = function(e, t) {
      return Go.set.call(this, e, t, void 0)
    }, Go.set = function(e, t, n) {
      return Vo.set.call(this, e[0], t, n, e[0])
    };
    var Ho = function() {
        function e(e) {
          var t = this;
          this.O = Ro, this.D = !0, this.produce = function(e, n, i) {
            if ("function" == typeof e && "function" != typeof n) {
              var o = n;
              n = e;
              var r = t;
              return function(e) {
                var t = this;
                void 0 === e && (e = o);
                for (var i = arguments.length, a = Array(i > 1 ? i - 1 : 0), s = 1; s < i; s++) a[s - 1] = arguments[s];
                return r.produce(e, (function(e) {
                  var i;
                  return (i = n).call.apply(i, [t, e].concat(a))
                }))
              }
            }
            var a;
            if ("function" != typeof n && Xi(6), void 0 !== i && "function" != typeof i && Xi(7), Qi(e)) {
              var s = go(t),
                c = Co(t, e, void 0),
                p = !0;
              try {
                a = n(c), p = !1
              } finally {
                p ? ho(s) : vo(s)
              }
              return "undefined" != typeof Promise && a instanceof Promise ? a.then((function(e) {
                return mo(s, i), bo(e, s)
              }), (function(e) {
                throw ho(s), e
              })) : (mo(s, i), bo(a, s))
            }
            if (!e || "object" != typeof e) {
              if (void 0 === (a = n(e)) && (a = e), a === Lo && (a = void 0), t.D && co(a, !0), i) {
                var u = [],
                  l = [];
                lo("Patches").M(e, a, u, l), i(u, l)
              }
              return a
            }
            Xi(21, e)
          }, this.produceWithPatches = function(e, n) {
            if ("function" == typeof e) return function(n) {
              for (var i = arguments.length, o = Array(i > 1 ? i - 1 : 0), r = 1; r < i; r++) o[r - 1] = arguments[r];
              return t.produceWithPatches(n, (function(t) {
                return e.apply(void 0, [t].concat(o))
              }))
            };
            var i, o, r = t.produce(e, n, (function(e, t) {
              i = e, o = t
            }));
            return "undefined" != typeof Promise && r instanceof Promise ? r.then((function(e) {
              return [e, i, o]
            })) : [r, i, o]
          }, "boolean" == typeof(null == e ? void 0 : e.useProxies) && this.setUseProxies(e.useProxies), "boolean" == typeof(null == e ? void 0 : e.autoFreeze) && this.setAutoFreeze(e.autoFreeze)
        }
        var t = e.prototype;
        return t.createDraft = function(e) {
          Qi(e) || Xi(8), Ji(e) && (e = Io(e));
          var t = go(this),
            n = Co(this, e, void 0);
          return n[Mo].C = !0, vo(t), n
        }, t.finishDraft = function(e, t) {
          var n = (e && e[Mo]).A;
          return mo(n, t), bo(void 0, n)
        }, t.setAutoFreeze = function(e) {
          this.D = e
        }, t.setUseProxies = function(e) {
          e && !Ro && Xi(20), this.O = e
        }, t.applyPatches = function(e, t) {
          var n;
          for (n = t.length - 1; n >= 0; n--) {
            var i = t[n];
            if (0 === i.path.length && "replace" === i.op) {
              e = i.value;
              break
            }
          }
          n > -1 && (t = t.slice(n + 1));
          var o = lo("Patches").$;
          return Ji(e) ? o(e, t) : this.produce(e, (function(e) {
            return o(e, t)
          }))
        }, e
      }(),
      Wo = new Ho;

    function Ko(e) {
      return function(t) {
        var n = t.dispatch,
          i = t.getState;
        return function(t) {
          return function(o) {
            return "function" == typeof o ? o(n, i, e) : t(o)
          }
        }
      }
    }
    Wo.produce, Wo.produceWithPatches.bind(Wo), Wo.setAutoFreeze.bind(Wo), Wo.setUseProxies.bind(Wo), Wo.applyPatches.bind(Wo), Wo.createDraft.bind(Wo), Wo.finishDraft.bind(Wo);
    var $o = Ko();
    $o.withExtraArgument = Ko;
    const Yo = $o;
    var Xo, Jo = (Xo = function(e, t) {
        return Xo = Object.setPrototypeOf || {
          __proto__: []
        }
        instanceof Array && function(e, t) {
          e.__proto__ = t
        } || function(e, t) {
          for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
        }, Xo(e, t)
      }, function(e, t) {
        if ("function" != typeof t && null !== t) throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");

        function n() {
          this.constructor = e
        }
        Xo(e, t), e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n)
      }),
      Qo = function(e, t) {
        for (var n = 0, i = t.length, o = e.length; n < i; n++, o++) e[o] = t[n];
        return e
      },
      Zo = Object.defineProperty,
      er = Object.defineProperties,
      tr = Object.getOwnPropertyDescriptors,
      nr = Object.getOwnPropertySymbols,
      ir = Object.prototype.hasOwnProperty,
      or = Object.prototype.propertyIsEnumerable,
      rr = function(e, t, n) {
        return t in e ? Zo(e, t, {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: n
        }) : e[t] = n
      },
      ar = function(e, t) {
        for (var n in t || (t = {})) ir.call(t, n) && rr(e, n, t[n]);
        if (nr)
          for (var i = 0, o = nr(t); i < o.length; i++) n = o[i], or.call(t, n) && rr(e, n, t[n]);
        return e
      },
      sr = function(e, t) {
        return er(e, tr(t))
      },
      cr = "undefined" != typeof globalThis && globalThis.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? globalThis.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : function() {
        if (0 !== arguments.length) return "object" == typeof arguments[0] ? $i : $i.apply(null, arguments)
      };
    "undefined" != typeof globalThis && globalThis.__REDUX_DEVTOOLS_EXTENSION__ && globalThis.__REDUX_DEVTOOLS_EXTENSION__;
    var pr = function(e) {
      function t() {
        for (var n = [], i = 0; i < arguments.length; i++) n[i] = arguments[i];
        var o = e.apply(this, n) || this;
        return Object.setPrototypeOf(o, t.prototype), o
      }
      return Jo(t, e), Object.defineProperty(t, Symbol.species, {
        get: function() {
          return t
        },
        enumerable: !1,
        configurable: !0
      }), t.prototype.concat = function() {
        for (var t = [], n = 0; n < arguments.length; n++) t[n] = arguments[n];
        return e.prototype.concat.apply(this, t)
      }, t.prototype.prepend = function() {
        for (var e = [], n = 0; n < arguments.length; n++) e[n] = arguments[n];
        return 1 === e.length && Array.isArray(e[0]) ? new(t.bind.apply(t, Qo([void 0], e[0].concat(this)))) : new(t.bind.apply(t, Qo([void 0], e.concat(this))))
      }, t
    }(Array);

    function ur(e, t) {
      function n() {
        for (var n = [], i = 0; i < arguments.length; i++) n[i] = arguments[i];
        if (t) {
          var o = t.apply(void 0, n);
          if (!o) throw new Error("prepareAction did not return an object");
          return ar(ar({
            type: e,
            payload: o.payload
          }, "meta" in o && {
            meta: o.meta
          }), "error" in o && {
            error: o.error
          })
        }
        return {
          type: e,
          payload: n[0]
        }
      }
      return n.toString = function() {
        return "" + e
      }, n.type = e, n.match = function(t) {
        return t.type === e
      }, n
    }
    var lr = ["name", "message", "stack", "code"],
      dr = function(e, t) {
        this.payload = e, this.meta = t
      },
      fr = function(e, t) {
        this.payload = e, this.meta = t
      },
      mr = function(e) {
        if ("object" == typeof e && null !== e) {
          for (var t = {}, n = 0, i = lr; n < i.length; n++) {
            var o = i[n];
            "string" == typeof e[o] && (t[o] = e[o])
          }
          return t
        }
        return {
          message: String(e)
        }
      };

    function hr(e) {
      if (e.meta && e.meta.rejectedWithValue) throw e.payload;
      if (e.error) throw e.error;
      return e.payload
    }! function() {
      function e(e, t, n) {
        var i = ur(e + "/fulfilled", (function(e, t, n, i) {
            return {
              payload: e,
              meta: sr(ar({}, i || {}), {
                arg: n,
                requestId: t,
                requestStatus: "fulfilled"
              })
            }
          })),
          o = ur(e + "/pending", (function(e, t, n) {
            return {
              payload: void 0,
              meta: sr(ar({}, n || {}), {
                arg: t,
                requestId: e,
                requestStatus: "pending"
              })
            }
          })),
          r = ur(e + "/rejected", (function(e, t, i, o, r) {
            return {
              payload: o,
              error: (n && n.serializeError || mr)(e || "Rejected"),
              meta: sr(ar({}, r || {}), {
                arg: i,
                requestId: t,
                rejectedWithValue: !!o,
                requestStatus: "rejected",
                aborted: "AbortError" === (null == e ? void 0 : e.name),
                condition: "ConditionError" === (null == e ? void 0 : e.name)
              })
            }
          })),
          a = "undefined" != typeof AbortController ? AbortController : function() {
            function e() {
              this.signal = {
                aborted: !1,
                addEventListener: function() {},
                dispatchEvent: function() {
                  return !1
                },
                onabort: function() {},
                removeEventListener: function() {},
                reason: void 0,
                throwIfAborted: function() {}
              }
            }
            return e.prototype.abort = function() {}, e
          }();
        return Object.assign((function(e) {
          return function(s, c, p) {
            var u, l = (null == n ? void 0 : n.idGenerator) ? n.idGenerator(e) : function(e) {
                void 0 === e && (e = 21);
                for (var t = "", n = e; n--;) t += "ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW" [64 * Math.random() | 0];
                return t
              }(),
              d = new a;

            function f(e) {
              u = e, d.abort()
            }
            var m = function() {
              return a = this, m = null, h = function() {
                var a, m, h, v, g, x;
                return function(e, t) {
                  var n, i, o, r, a = {
                    label: 0,
                    sent: function() {
                      if (1 & o[0]) throw o[1];
                      return o[1]
                    },
                    trys: [],
                    ops: []
                  };
                  return r = {
                    next: s(0),
                    throw: s(1),
                    return: s(2)
                  }, "function" == typeof Symbol && (r[Symbol.iterator] = function() {
                    return this
                  }), r;

                  function s(r) {
                    return function(s) {
                      return function(r) {
                        if (n) throw new TypeError("Generator is already executing.");
                        for (; a;) try {
                          if (n = 1, i && (o = 2 & r[0] ? i.return : r[0] ? i.throw || ((o = i.return) && o.call(i), 0) : i.next) && !(o = o.call(i, r[1])).done) return o;
                          switch (i = 0, o && (r = [2 & r[0], o.value]), r[0]) {
                            case 0:
                            case 1:
                              o = r;
                              break;
                            case 4:
                              return a.label++, {
                                value: r[1],
                                done: !1
                              };
                            case 5:
                              a.label++, i = r[1], r = [0];
                              continue;
                            case 7:
                              r = a.ops.pop(), a.trys.pop();
                              continue;
                            default:
                              if (!((o = (o = a.trys).length > 0 && o[o.length - 1]) || 6 !== r[0] && 2 !== r[0])) {
                                a = 0;
                                continue
                              }
                              if (3 === r[0] && (!o || r[1] > o[0] && r[1] < o[3])) {
                                a.label = r[1];
                                break
                              }
                              if (6 === r[0] && a.label < o[1]) {
                                a.label = o[1], o = r;
                                break
                              }
                              if (o && a.label < o[2]) {
                                a.label = o[2], a.ops.push(r);
                                break
                              }
                              o[2] && a.ops.pop(), a.trys.pop();
                              continue
                          }
                          r = t.call(e, a)
                        } catch (e) {
                          r = [6, e], i = 0
                        } finally {
                          n = o = 0
                        }
                        if (5 & r[0]) throw r[1];
                        return {
                          value: r[0] ? r[1] : void 0,
                          done: !0
                        }
                      }([r, s])
                    }
                  }
                }(this, (function(b) {
                  switch (b.label) {
                    case 0:
                      return b.trys.push([0, 4, , 5]), null === (y = v = null == (a = null == n ? void 0 : n.condition) ? void 0 : a.call(n, e, {
                        getState: c,
                        extra: p
                      })) || "object" != typeof y || "function" != typeof y.then ? [3, 2] : [4, v];
                    case 1:
                      v = b.sent(), b.label = 2;
                    case 2:
                      if (!1 === v || d.signal.aborted) throw {
                        name: "ConditionError",
                        message: "Aborted due to condition callback returning false."
                      };
                      return g = new Promise((function(e, t) {
                        return d.signal.addEventListener("abort", (function() {
                          return t({
                            name: "AbortError",
                            message: u || "Aborted"
                          })
                        }))
                      })), s(o(l, e, null == (m = null == n ? void 0 : n.getPendingMeta) ? void 0 : m.call(n, {
                        requestId: l,
                        arg: e
                      }, {
                        getState: c,
                        extra: p
                      }))), [4, Promise.race([g, Promise.resolve(t(e, {
                        dispatch: s,
                        getState: c,
                        extra: p,
                        requestId: l,
                        signal: d.signal,
                        abort: f,
                        rejectWithValue: function(e, t) {
                          return new dr(e, t)
                        },
                        fulfillWithValue: function(e, t) {
                          return new fr(e, t)
                        }
                      })).then((function(t) {
                        if (t instanceof dr) throw t;
                        return t instanceof fr ? i(t.payload, l, e, t.meta) : i(t, l, e)
                      }))])];
                    case 3:
                      return h = b.sent(), [3, 5];
                    case 4:
                      return x = b.sent(), h = x instanceof dr ? r(null, l, e, x.payload, x.meta) : r(x, l, e), [3, 5];
                    case 5:
                      return n && !n.dispatchConditionRejection && r.match(h) && h.meta.condition || s(h), [2, h]
                  }
                  var y
                }))
              }, new Promise((function(e, t) {
                var n = function(e) {
                    try {
                      o(h.next(e))
                    } catch (e) {
                      t(e)
                    }
                  },
                  i = function(e) {
                    try {
                      o(h.throw(e))
                    } catch (e) {
                      t(e)
                    }
                  },
                  o = function(t) {
                    return t.done ? e(t.value) : Promise.resolve(t.value).then(n, i)
                  };
                o((h = h.apply(a, m)).next())
              }));
              var a, m, h
            }();
            return Object.assign(m, {
              abort: f,
              requestId: l,
              arg: e,
              unwrap: function() {
                return m.then(hr)
              }
            })
          }
        }), {
          pending: o,
          rejected: r,
          fulfilled: i,
          typePrefix: e
        })
      }
      e.withTypes = function() {
        return e
      }
    }(), Object.assign;
    var vr = "listenerMiddleware";
    ur(vr + "/add"), ur(vr + "/removeAll"), ur(vr + "/remove"), "function" == typeof queueMicrotask && queueMicrotask.bind("undefined" != typeof globalThis ? globalThis : "undefined" != typeof global ? global : globalThis);

    function gr(e, t) {
      var n = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var i = Object.getOwnPropertySymbols(e);
        t && (i = i.filter((function(t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable
        }))), n.push.apply(n, i)
      }
      return n
    }

    function xr(e) {
      for (var t = 1; t < arguments.length; t++) {
        var n = null != arguments[t] ? arguments[t] : {};
        t % 2 ? gr(Object(n), !0).forEach((function(t) {
          O()(e, t, n[t])
        })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : gr(Object(n)).forEach((function(t) {
          Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
        }))
      }
      return e
    }
    "undefined" != typeof globalThis && globalThis.requestAnimationFrame && globalThis.requestAnimationFrame,
      function() {
        function e(e, t) {
          var n = o[e];
          return n ? n.enumerable = t : o[e] = n = {
            configurable: !0,
            enumerable: t,
            get: function() {
              var t = this[Mo];
              return Vo.get(t, e)
            },
            set: function(t) {
              var n = this[Mo];
              Vo.set(n, e, t)
            }
          }, n
        }

        function t(e) {
          for (var t = e.length - 1; t >= 0; t--) {
            var o = e[t][Mo];
            if (!o.P) switch (o.i) {
              case 5:
                i(o) && Oo(o);
                break;
              case 4:
                n(o) && Oo(o)
            }
          }
        }

        function n(e) {
          for (var t = e.t, n = e.k, i = Bo(n), o = i.length - 1; o >= 0; o--) {
            var r = i[o];
            if (r !== Mo) {
              var a = t[r];
              if (void 0 === a && !to(t, r)) return !0;
              var s = n[r],
                c = s && s[Mo];
              if (c ? c.t !== a : !io(s, a)) return !0
            }
          }
          var p = !!t[Mo];
          return i.length !== Bo(t).length + (p ? 0 : 1)
        }

        function i(e) {
          var t = e.k;
          if (t.length !== e.t.length) return !0;
          var n = Object.getOwnPropertyDescriptor(t, t.length - 1);
          if (n && !n.get) return !0;
          for (var i = 0; i < t.length; i++)
            if (!t.hasOwnProperty(i)) return !0;
          return !1
        }
        var o = {};
        ! function(e, t) {
          qo[e] || (qo[e] = t)
        }("ES5", {
          J: function(t, n) {
            var i = Array.isArray(t),
              o = function(t, n) {
                if (t) {
                  for (var i = Array(n.length), o = 0; o < n.length; o++) Object.defineProperty(i, "" + o, e(o, !0));
                  return i
                }
                var r = zo(n);
                delete r[Mo];
                for (var a = Bo(r), s = 0; s < a.length; s++) {
                  var c = a[s];
                  r[c] = e(c, t || !!r[c].enumerable)
                }
                return Object.create(Object.getPrototypeOf(n), r)
              }(i, t),
              r = {
                i: i ? 5 : 4,
                A: n ? n.A : fo(),
                P: !1,
                I: !1,
                R: {},
                l: n,
                t,
                k: o,
                o: null,
                g: !1,
                C: !1
              };
            return Object.defineProperty(o, Mo, {
              value: r,
              writable: !0
            }), o
          },
          S: function(e, n, o) {
            o ? Ji(n) && n[Mo].A === e && t(e.p) : (e.u && function e(t) {
              if (t && "object" == typeof t) {
                var n = t[Mo];
                if (n) {
                  var o = n.t,
                    r = n.k,
                    a = n.R,
                    s = n.i;
                  if (4 === s) Zi(r, (function(t) {
                    t !== Mo && (void 0 !== o[t] || to(o, t) ? a[t] || e(r[t]) : (a[t] = !0, Oo(n)))
                  })), Zi(o, (function(e) {
                    void 0 !== r[e] || to(r, e) || (a[e] = !1, Oo(n))
                  }));
                  else if (5 === s) {
                    if (i(n) && (Oo(n), a.length = !0), r.length < o.length)
                      for (var c = r.length; c < o.length; c++) a[c] = !1;
                    else
                      for (var p = o.length; p < r.length; p++) a[p] = !0;
                    for (var u = Math.min(r.length, o.length), l = 0; l < u; l++) r.hasOwnProperty(l) || (a[l] = !0), void 0 === a[l] && e(r[l])
                  }
                }
              }
            }(e.p[0]), t(e.p))
          },
          K: function(e) {
            return 4 === e.i ? n(e) : i(e)
          }
        })
      }();
    var br = {
      currentLanguage: "English",
      mappingTable: null,
      langText: function() {
        return ""
      }
    };

    function yr(e, t) {
      var n = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var i = Object.getOwnPropertySymbols(e);
        t && (i = i.filter((function(t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable
        }))), n.push.apply(n, i)
      }
      return n
    }

    function wr(e) {
      for (var t = 1; t < arguments.length; t++) {
        var n = null != arguments[t] ? arguments[t] : {};
        t % 2 ? yr(Object(n), !0).forEach((function(t) {
          O()(e, t, n[t])
        })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : yr(Object(n)).forEach((function(t) {
          Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
        }))
      }
      return e
    }
    var _r = {
      currentPage: null,
      toastMessage: null,
      dialog: null,
      maskGroup: {
        loadCompleted: !1,
        loading: {
          status: !1,
          content: "",
          timestamp: ""
        },
        initializing: {
          status: !1,
          content: "",
          timestamp: ""
        }
      }
    };

    function Er(e, t) {
      var n = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var i = Object.getOwnPropertySymbols(e);
        t && (i = i.filter((function(t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable
        }))), n.push.apply(n, i)
      }
      return n
    }

    function Sr(e) {
      for (var t = 1; t < arguments.length; t++) {
        var n = null != arguments[t] ? arguments[t] : {};
        t % 2 ? Er(Object(n), !0).forEach((function(t) {
          O()(e, t, n[t])
        })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Er(Object(n)).forEach((function(t) {
          Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
        }))
      }
      return e
    }
    var Or = {
        constantData: null
      },
      Tr = function(e) {
        var t, n = function(e) {
            return function(e) {
              void 0 === e && (e = {});
              var t = e.thunk,
                n = void 0 === t || t,
                i = (e.immutableCheck, e.serializableCheck, new pr);
              return n && (function(e) {
                return "boolean" == typeof e
              }(n) ? i.push(Yo) : i.push(Yo.withExtraArgument(n.extraArgument))), i
            }(e)
          },
          i = e || {},
          o = i.reducer,
          r = void 0 === o ? void 0 : o,
          a = i.middleware,
          s = void 0 === a ? n() : a,
          c = i.devTools,
          p = void 0 === c || c,
          u = i.preloadedState,
          l = void 0 === u ? void 0 : u,
          d = i.enhancers,
          f = void 0 === d ? void 0 : d;
        if ("function" == typeof r) t = r;
        else {
          if (! function(e) {
              if ("object" != typeof e || null === e) return !1;
              var t = Object.getPrototypeOf(e);
              if (null === t) return !0;
              for (var n = t; null !== Object.getPrototypeOf(n);) n = Object.getPrototypeOf(n);
              return t === n
            }(r)) throw new Error('"reducer" is a required argument, and must be a function or an object of functions that can be passed to combineReducers');
          t = Ki(r)
        }
        var m = s;
        "function" == typeof m && (m = m(n));
        var h = Yi.apply(void 0, m),
          v = $i;
        p && (v = cr(ar({
          trace: !1
        }, "object" == typeof p && p)));
        var g = [h];
        return Array.isArray(f) ? g = Qo([h], f) : "function" == typeof f && (g = f(g)), Wi(t, l, v.apply(void 0, g))
      }({
        reducer: Ki({
          language: function() {
            var e, t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : br,
              n = arguments.length > 1 ? arguments[1] : void 0;
            switch (n.type) {
              case "SET_LANGUAGE":
                var i = n.data,
                  o = (e = i, function(t) {
                    return e[t] ? Array.isArray(e[t]) ? e[t][0] : e[t] : t
                  });
                return globalThis.langText = o, xr(xr({}, t), {
                  mappingTable: i,
                  langText: o
                });
              case "CHANGE_LANGUAGE":
                return xr(xr({}, t), {
                  currentLanguage: n.data
                });
              default:
                return t
            }
          },
          globalProps: function() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : _r,
              t = arguments.length > 1 ? arguments[1] : void 0;
            switch (t.type) {
              case "SET_APP_MASK":
                var n = t.data,
                  i = n.type,
                  o = n.loadCompleted,
                  r = n.maskData;
                return wr(wr({}, e), {}, {
                  maskGroup: wr(wr({}, e.maskGroup), {}, {
                    loadCompleted: o
                  }, O()({}, i, wr(wr({}, e.maskGroup[i]), r)))
                });
              case "SET_TOAST_MESSAGE":
                return wr(wr({}, e), {}, {
                  toastMessage: t.data && {
                    guid: _n.generateUUID(),
                    msg: t.data
                  }
                });
              case "SET_CURRENT_PAGE":
                return wr(wr({}, e), {}, {
                  currentPage: t.data
                });
              case "UPDATE_APP_DIALOG":
                return wr(wr({}, e), {
                  dialog: t.data ? wr({}, t.data) : null
                });
              default:
                return e
            }
          },
          settings: function() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : Rn,
              t = arguments.length > 1 ? arguments[1] : void 0;
            switch (t.type) {
              case "SET_CONFIG":
                var n = t.data,
                  i = n.deviceType,
                  o = n.caps,
                  r = n.modelNumber,
                  a = n.capsFunctionList,
                  s = n.defaultSettings,
                  c = n.constantData;
                return jn(jn({}, e), {
                  deviceType: i,
                  modelNumber: r,
                  caps: o,
                  capsFunctionList: a,
                  defaultSettings: s,
                  constantData: c
                });
              case "SET_CAPS_FUNCTIONLIST":
                var p = t.data.capsFunctionList;
                return jn(jn({}, e), {}, {
                  capsFunctionList: p
                });
              case "SET_DISPLAY_NAME":
                return jn(jn({}, e), {}, {
                  displayName: t.data
                });
              case "UPDATE_DATA":
                var u = t.data,
                  l = u.displayName,
                  d = u.modelName,
                  f = u.selectedProfile,
                  m = u.fwVersion,
                  h = u.isActivated,
                  v = u.isDeviceAlive,
                  g = u.isFirstLoginDone,
                  x = {};
                return void 0 !== h && (x.isActivated = h), void 0 !== d && (x.modelName = d), e.displayName || (x.displayName = l), void 0 !== v && (x.isDeviceAlive = v), void 0 !== g && (x.isFirstLoginDone = g), f && (x.selectedProfile = f), m && (x.fwVersion = m), jn(jn({}, e), x);
              case "UPDATE_ALERTPAGE_INIT_STATUS":
                return jn(jn({}, e), {}, {
                  isBackgroundInitializing: t.status,
                  isBackgroundInitSuccessfully: t.result
                });
              default:
                return e
            }
          },
          common: function() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : Or,
              t = arguments.length > 1 ? arguments[1] : void 0;
            if ("SET_CONFIG" === t.type) {
              var n = t.data.constantData;
              return Sr(Sr({}, e), {
                constantData: n
              })
            }
            return e
          },
          fanControl: function() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : Cn,
              t = arguments.length > 1 ? arguments[1] : void 0;
            switch (t.type) {
              case "UPDATE_FAN_CONOTROL":
              case "UPDATE_TUNING":
                return On(On({}, e), t.data);
              case "UPDATE_HYDRANODE":
                return On(On({}, e), {}, {
                  isAsusHydranode: t.data
                });
              case "UPDATE_FAN_TEMPERATURE":
                var n = t.data,
                  i = e.fanList,
                  o = e.selectedFanID,
                  r = i.find((function(e) {
                    return e.id === o
                  })),
                  a = null;
                return r && (a = r.multiSource.sourceArray.map((function(e) {
                  var t = e.id,
                    i = e.name,
                    o = e.value,
                    r = e.isDisable,
                    a = null;
                  return null !== n && n.length > 0 && (a = n.find((function(e) {
                    var n = e.temperatureID;
                    return t === n
                  }))), {
                    id: t,
                    value: o,
                    source: i,
                    temperature: Number(a ? a.temperature : 0),
                    disable: r
                  }
                }))), On(On({}, e), {}, {
                  temperature: a,
                  isTemperatureSingleSelect: !!r && 1 === r.multiSource.maxCount
                });
              case "UPDATE_AICOOLING_II":
                var s = t.data,
                  c = s.processing,
                  p = s.isAICoolingII;
                return On(On({}, e), {}, {
                  isAICoolingII: p,
                  AICoolingIIProcess: c
                });
              case "UPDATE_CURRENT_POINT":
                var u = t.data,
                  l = u.currentPoint,
                  d = u.aiCoolingPoint,
                  f = u.rpm,
                  m = void 0 === f ? 0 : f,
                  h = {
                    currentRpmPoint: null,
                    aiCoolingPoint: null
                  },
                  v = null,
                  g = null,
                  x = !1,
                  b = !1;
                if ("-1" !== l.x && "-1" !== l.y && (x = !0, h.currentRpmPoint = {
                    x: String(Math.floor(Number(l.x))),
                    y: String(Math.floor(100 * Number(l.y) / 255))
                  }), "-1" !== d.x && "-1" !== d.y && (b = !0, h.aiCoolingPoint = {
                    x: String(Math.floor(Number(d.x))),
                    y: String(Math.floor(100 * Number(d.y) / 255))
                  }, x || (h.currentRpmPoint = On({}, h.aiCoolingPoint))), b && x) {
                  var y = e.fanList,
                    w = e.selectedFanID,
                    _ = y.find((function(e) {
                      return e.id === w
                    })).caps;
                  v = 0 === _.rpmMappingTable.filter((function(e) {
                    return Number(e.rpm) > 0
                  })).length ? "-1" : Tn(Number(h.currentRpmPoint.y), _.rpmMappingTable, _), g = m
                } else v = m, g = m;
                return On(On(On({}, e), h), {}, {
                  currentRpm: v,
                  aiCoolingRpm: g
                });
              default:
                return e
            }
          }
        }),
        middleware: function(e) {
          return e({
            serializableCheck: !1
          })
        }
      });
    const Cr = Tr;
    var Ir = n(1505).Z,
      Nr = ["cmd", "receiver"],
      Pr = ["$"];

    function kr(e, t) {
      var n = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var i = Object.getOwnPropertySymbols(e);
        t && (i = i.filter((function(t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable
        }))), n.push.apply(n, i)
      }
      return n
    }

    function Dr(e) {
      for (var t = 1; t < arguments.length; t++) {
        var n = null != arguments[t] ? arguments[t] : {};
        t % 2 ? kr(Object(n), !0).forEach((function(t) {
          O()(e, t, n[t])
        })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : kr(Object(n)).forEach((function(t) {
          Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
        }))
      }
      return e
    }
    var Ar = Ir.settings,
      jr = vn.logger,
      Rr = "dashboard",
      Lr = "[Device Service]",
      Fr = function(e) {
        b()(c, e);
        var t, n, i, o, a = (i = c, o = function() {
          if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
          if (Reflect.construct.sham) return !1;
          if ("function" == typeof Proxy) return !0;
          try {
            return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function() {}))), !0
          } catch (e) {
            return !1
          }
        }(), function() {
          var e, t = E()(i);
          if (o) {
            var n = E()(this).constructor;
            e = Reflect.construct(t, arguments, n)
          } else e = t.apply(this, arguments);
          return w()(this, e)
        });

        function c(e) {
          var t;
          return l()(this, c), t = a.call(this, {
            props: e,
            actions: {
              setConfig: Fn
            }
          }), O()(h()(t), "returnHasNewFeature", (function(e) {
            t.sendSocketServer({
              xml: {
                command: "IsNewDevice",
                result: !1
              }
            }, e)
          })), t.pendingQueue = [], t.processPool = [], t.initialize = t.initialize.bind(h()(t)), t.initFinally = t.initFinally.bind(h()(t)), t
        }
        return f()(c, [{
          key: "setStore",
          value: function() {
            this.store = Cr, g()(E()(c.prototype), "setStore", this).call(this)
          }
        }, {
          key: "setCapsFunctionList",
          value: (n = p()(C().mark((function e() {
            var t = this;
            return C().wrap((function(e) {
              for (;;) switch (e.prev = e.next) {
                case 0:
                  return e.abrupt("return", new Promise(function() {
                    var e = p()(C().mark((function e(n) {
                      var i;
                      return C().wrap((function(e) {
                        for (;;) switch (e.prev = e.next) {
                          case 0:
                            return i = Ar.caps.capsFunctionList, e.next = 3, t.dispatch({
                              type: "SET_CAPS_FUNCTIONLIST",
                              data: {
                                capsFunctionList: i
                              }
                            });
                          case 3:
                            n();
                          case 4:
                          case "end":
                            return e.stop()
                        }
                      }), e)
                    })));
                    return function(t) {
                      return e.apply(this, arguments)
                    }
                  }()));
                case 1:
                case "end":
                  return e.stop()
              }
            }), e)
          }))), function() {
            return n.apply(this, arguments)
          })
        }, {
          key: "initialize",
          value: function() {
            var e = this;
            return new Promise(function() {
              var t = p()(C().mark((function t(n, i) {
                var o, r, a, s, c, p, u;
                return C().wrap((function(t) {
                  for (;;) switch (t.prev = t.next) {
                    case 0:
                      return t.prev = 0, o = e.props.init, r = e.getState(), a = r.common, s = a.constantData, c = Ar.deviceType, p = Ar.modelNumber, u = s.SOCKET_EVENT, t.next = 8, e.setCapsFunctionList();
                    case 8:
                      return t.next = 10, e.broadcastEvent({
                        target: {
                          role: "devicePage",
                          deviceType: c,
                          pid: p
                        },
                        msg: {
                          cmd: u.ALERT_START
                        }
                      });
                    case 10:
                      return t.next = 12, e.dispatch(yi("s3" === o));
                    case 12:
                      n(), t.next = 18;
                      break;
                    case 15:
                      t.prev = 15, t.t0 = t.catch(0), i(t.t0);
                    case 18:
                    case "end":
                      return t.stop()
                  }
                }), t, null, [
                  [0, 15]
                ])
              })));
              return function(e, n) {
                return t.apply(this, arguments)
              }
            }())
          }
        }, {
          key: "returnDeviceSupport",
          value: function() {
            var e = this.getState().fanControl;
            return jr.info(Lr, "return device status."), Dr({
              result: this.initializeSuccessfully
            }, this.initializeSuccessfully && {
              isAICoolingIISupport: e.isAICoolingIISupport || !1,
              isAICoolingII: e.isAICoolingII || !1,
              hasEverLoadAICoolingII: e.hasEverLoadAICoolingII || !1
            })
          }
        }, {
          key: "onPresetMode",
          value: function(e) {
            var t = this;
            return jr.info(Lr, "switch fan mode to mode ".concat(e, ".")), Promise.resolve().then((function() {
              return t.dispatch(ji(e))
            })).then((function() {
              return jr.info(Lr, "switch fan mode to mode ".concat(e, " successful.")), t.refreshDevicePageUI("0" === e), {
                result: !0
              }
            })).catch((function() {
              return jr.error(Lr, "switch fan mode to mode ".concat(e, " fail.")), {
                result: !1
              }
            }))
          }
        }, {
          key: "switchAICooling2",
          value: function(e) {
            var t = this,
              n = this.getState().fanControl;
            jr.info(Lr, "switch ai cooling2 ".concat(e ? "on" : "off", "."));
            var i = null;
            return e === n.isAICoolingII ? i = "ai cooling II status is not change." : n.hasEverLoadAICoolingII || (i = "ai cooling II is never load before."), i ? (jr.error(Lr, i), {
              result: !1
            }) : Promise.resolve().then((function() {
              return t.dispatch(function(e) {
                var t = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
                return function() {
                  var n = p()(C().mark((function n(i, o) {
                    var r, a, s, c, u, l, d, f;
                    return C().wrap((function(n) {
                      for (;;) switch (n.prev = n.next) {
                        case 0:
                          if (r = o().fanControl, a = r.hasEverLoadAICoolingII, s = r.fanList, cn.i("onAICoolingII", "notify."), n.prev = 2, i(In({
                              isAICoolingII: e
                            })), a || !e) {
                            n.next = 7;
                            break
                          }
                          throw cn.w("onAICoolingII", "never load ai coolingII before."), new Error("never load aic2 before");
                        case 7:
                          return n.next = 9, Ti(e);
                        case 9:
                          return c = n.sent, u = c.ai2EnableFanList, l = c.fanCaps, d = c.fansProfile, n.next = 15, i(In({
                            ai2EnableFanList: u
                          }));
                        case 15:
                          return n.next = 17, i(Hn({
                            fanCaps: l,
                            fansProfile: d
                          }, {
                            ignoreAICoolingII: !0
                          }));
                        case 17:
                          if (!e) {
                            n.next = 25;
                            break
                          }
                          if (!((f = s.filter((function(e) {
                              return e.isAICoolingIIFan && u.includes(e.id)
                            })).map((function(e) {
                              return e.id
                            }))).length > 0)) {
                            n.next = 24;
                            break
                          }
                          return n.next = 22, i(Ai(f));
                        case 22:
                          n.next = 25;
                          break;
                        case 24:
                          cn.i("onAICoolingII", "There is None of the fan support aiCooling2.");
                        case 25:
                          return cn.i("onAICoolingII", "success."), t && i(Pi()), n.next = 29, i(function() {
                            var e = p()(C().mark((function e(t, n) {
                              var i, o, r, a, s, c;
                              return C().wrap((function(e) {
                                for (;;) switch (e.prev = e.next) {
                                  case 0:
                                    if (t((function(e, t) {
                                        return t().fanControl.isDidTuning
                                      }))) {
                                      e.next = 2;
                                      break
                                    }
                                    return e.abrupt("return");
                                  case 2:
                                    return cn.i(ii, "[collectAICooling] notify."), i = n(), o = i.fanControl, r = o.isAICoolingSupport, a = o.isAICooling, s = o.isAICoolingIISupport, c = o.isAICoolingII, ai.setCurrent({
                                      AICooling_Switch: r || s ? r ? a ? "1" : "0" : s ? c ? "1" : "0" : "-1" : "-1"
                                    }), e.abrupt("return", t(ci(oi.CURRENT_STATE)));
                                  case 6:
                                  case "end":
                                    return e.stop()
                                }
                              }), e)
                            })));
                            return function(t, n) {
                              return e.apply(this, arguments)
                            }
                          }());
                        case 29:
                          return n.next = 31, i(Dn());
                        case 31:
                          return n.abrupt("return", !0);
                        case 34:
                          throw n.prev = 34, n.t0 = n.catch(2), i(In({
                            isAICoolingII: !e
                          })), cn.e("onAICoolingII", "fail."), _n.parseError(n.t0);
                        case 39:
                        case "end":
                          return n.stop()
                      }
                    }), n, null, [
                      [2, 34]
                    ])
                  })));
                  return function(e, t) {
                    return n.apply(this, arguments)
                  }
                }()
              }(e, !1))
            })).then((function() {
              return jr.info(Lr, "switch ai cooling2 successful."), t.refreshDevicePageUI(), {
                result: !0
              }
            })).catch((function() {
              return jr.error(Lr, "switch ai cooling2 fail."), {
                result: !1
              }
            }))
          }
        }, {
          key: "handleSocketServerEvent",
          value: function(e) {
            var t = this;
            "DeviceOut" === e.command && Promise.resolve().then((function() {
              return t.dispatch(Ri(!1))
            }))
          }
        }, {
          key: "handleFrameworkEventByType",
          value: function(e) {
            var t = e.cmd,
              n = e.receiver,
              i = void 0 === n ? null : n,
              o = s()(e, Nr);
            jr.debug(Lr, "command: ".concat(t, ", data:\n").concat(JSON.stringify(e, null, 2)));
            var r = i || {
              role: Rr
            };
            switch (t) {
              case wi.CHECK_DEVICE_SUPPORT:
                jr.info(Lr, "check device support."), this.transferRequest({
                  cmd: wi.CHECK_DEVICE_SUPPORT,
                  callback: this.returnDeviceSupport,
                  receiver: r
                });
                break;
              case wi.FAN_MODE:
                var a = o.mode;
                jr.info(Lr, "set fan mode."), a ? this.transferRequest({
                  cmd: wi.FAN_MODE,
                  callback: this.onPresetMode,
                  args: [a],
                  receiver: r
                }) : (jr.error(Lr, "msg format error."), this.broadcast(wi.FAN_MODE, {
                  result: !1
                }, r));
                break;
              case wi.SWITCH_AI2:
                var c = o.status;
                jr.info(Lr, "switch AICooling 2."), this.transferRequest({
                  cmd: wi.SWITCH_AI2,
                  callback: this.switchAICooling2,
                  args: [c],
                  receiver: r
                });
                break;
              case wi.AI2_STATUS_CHANGE:
                var p = o.isAICoolingII,
                  u = o.ai2EnableFanList;
                this.dispatch(In({
                  isAICoolingII: p,
                  ai2EnableFanList: u
                }));
                break;
              case wi.AI2_STRESS_START:
                this.dispatch(In({
                  AICoolingIIProcess: !0
                }))
            }
          }
        }, {
          key: "handleSDKEvent",
          value: function(e) {
            var t = this,
              n = this.getState(),
              i = n.settings,
              o = n.fanControl.isMBSupport,
              r = i.deviceType,
              a = i.modelNumber,
              c = e.device_type,
              p = c.$.key,
              u = c.device.$.key;
            if (p !== r && u !== a) return !1;
            if (jr.info(Lr, JSON.stringify(e, null, 4)), o) {
              var l = e.device_type.device.function,
                d = l.$.key,
                f = s()(l, Pr);
              if (d === wi.AI_COOLING_II && "1" === f.complete) return Promise.resolve().then((function() {
                return t.dispatch(In({
                  hasEverLoadAICoolingII: !0,
                  AICoolingIIProcess: !1
                }))
              })).then((function() {
                return t.broadcastEvent({
                  target: {
                    role: "devicePage",
                    deviceType: r,
                    pid: a
                  },
                  msg: {
                    cmd: wi.AI2_FINISH
                  }
                })
              }))
            } else jr.info(Lr, "".concat(a, " Motherboard is Not Support."))
          }
        }, {
          key: "initFinally",
          value: function() {
            var e = this.getState().settings.modelNumber;
            this.sendSocketServer({
              xml: {
                command: "pid",
                device: e,
                result: this.initializeSuccessfully
              }
            }), this.broadcast(wi.CHECK_DEVICE_SUPPORT, this.returnDeviceSupport(), [{
              role: Rr
            }, {
              role: "deviceService",
              deviceType: "2"
            }])
          }
        }, {
          key: "transferRequest",
          value: (t = p()(C().mark((function e(t) {
            var n, i, o, a, s, c, p, u, l = this;
            return C().wrap((function(e) {
              for (;;) switch (e.prev = e.next) {
                case 0:
                  if (n = t.cmd, i = t.callback, o = t.args, a = void 0 === o ? [] : o, s = t.receiver, c = this.getState(), p = c.settings.modelNumber, u = c.fanControl.isMBSupport, !this.initializing) {
                    e.next = 5;
                    break
                  }
                  return jr.info(Lr, "".concat(p, " DeviceService is initializing.")), e.abrupt("return");
                case 5:
                  if (u) {
                    e.next = 8;
                    break
                  }
                  return jr.info(Lr, "".concat(p, " Motherboard is Not Support.")), e.abrupt("return");
                case 8:
                  if (-1 === this.processPool.findIndex((function(e) {
                      return e.cmd === n
                    }))) {
                    e.next = 13;
                    break
                  }
                  return this.pendingQueue = this.pendingQueue.filter((function(e) {
                    return e.cmd !== n
                  })), this.pendingQueue.push(t), e.abrupt("return");
                case 13:
                  "function" == typeof i && (this.processPool.push({
                    cmd: n
                  }), Promise.resolve().then((function() {
                    return i.call.apply(i, [l].concat(r()(a)))
                  })).then((function(e) {
                    return l.broadcast(n, e, s)
                  })).finally((function() {
                    l.processPool = l.processPool.filter((function(e) {
                      return e.cmd !== n
                    }));
                    var e = null;
                    l.pendingQueue = l.pendingQueue.filter((function(t) {
                      return t.cmd === n && (e = t), t.cmd !== n
                    })), e && l.transferRequest(e)
                  })));
                case 14:
                case "end":
                  return e.stop()
              }
            }), e, this)
          }))), function(e) {
            return t.apply(this, arguments)
          })
        }, {
          key: "broadcast",
          value: function(e, t, n) {
            var i = this,
              o = this.getState().settings.deviceType,
              r = n;
            Array.isArray(n) || (r = [n]), r.forEach((function(n) {
              jr.info(Lr, "send msg to ".concat(JSON.stringify(n), ".")), i.broadcastEvent({
                target: n,
                msg: Dr({
                  cmd: e,
                  deviceType: o
                }, t)
              })
            }))
          }
        }, {
          key: "refreshDevicePageUI",
          value: function(e) {
            var t = this.getState().settings,
              n = t.deviceType,
              i = t.modelNumber;
            this.broadcastEvent({
              target: {
                role: "devicePage",
                deviceType: n,
                pid: i
              },
              msg: {
                cmd: wi.REFRESH_UI,
                ignoreAICooling2: e
              }
            })
          }
        }]), c
      }(gn);
    const Mr = function(e) {
      return new Fr(e)
    };
    var Ur, Br = n(1505).Z.settings,
      zr = {};
    null !== (Ur = process) && void 0 !== Ur && Ur.execArgv && (zr = process.argv.reduce((function(e, n) {
      var i = n.split("="),
        o = t()(i, 2),
        r = o[0],
        a = o[1];
      return e[r] = a, e
    }), {}));
    try {
      Mr(zr)
    } catch (e) {
      process.send({
        cmd: "log",
        type: "error",
        data: "device service crash, error: ".concat(JSON.stringify(e))
      })
    }
    const qr = {
      service: Mr,
      configSettings: Br
    }
  })(), module.exports = i
})();