(() => {
  "use strict";
  var e = {
      79: (e, t) => {
        Object.defineProperty(t, "__esModule", {
          value: !0
        });
        t.default = {
          defs: {
            SOFTWARE_PROFILE: "SOFTWARE_PROFILE",
            FIRMWARE_PROFILE: "FIRMWARE_PROFILE"
          },
          ports: {
            http: "1042",
            https: "1043"
          },
          commandCode: {
            WEBSOCKET_TARGET_NOT_FOUND: "20000"
          },
          peripheralDevice: {
            MOUSE: "1",
            KEYBOARD: "2",
            HEADSET: "4",
            AIO: "5",
            MOUSEPAD: "7",
            MBLED: "8",
            FANCARD: "15"
          },
          deviceNameMapping: {
            0: "Main",
            1: "Mouse",
            2: "Keyboard",
            3: "Accessory",
            4: "Headset",
            5: "AIO",
            7: "Mousepad",
            8: "MBLED",
            9: "SensorBox",
            15: "FanCard"
          },
          legacyFileFormat: ["1", "2", "4", "7", "8"]
        }
      },
      363: (e, t) => {
        Object.defineProperty(t, "__esModule", {
          value: !0
        });
        var o = Object.freeze({
          SETLEDCOUNT: "13"
        });
        t.default = {
          commandCode: {
            POWER_INFO: "20101"
          },
          functionNumber: {
            MB_QUERY: "1",
            MB_QUERYFAST: "6",
            SHUTDOWNEFFECT: "3",
            SHUTDOWNEFFECT_CUSTOMIZED: "4",
            ADDRESSABLE_HEADERS: "2",
            ADDRESSABLE_RESCAN_HEADERMODE: "30",
            RGBHEADER_CALIBRATION: "2",
            AIMIC_INPUT_QUERY: "21",
            AIMIC_INPUT_MUTENOISE: "22",
            AIMIC_INPUT_AUDIODEVICE: "23",
            AIMIC_INPUT_NRLEVEL: "25",
            AIMIC_OUTPUT_QUERY: "26",
            AIMIC_OUTPUT_MUTENOISE: "27",
            AIMIC_OUTPUT_AUDIODEVICE: "28",
            AIMIC_OUTPUT_NRLEVEL: "29",
            DISK_QUERY: "50",
            HYDRANODE_DYNAMICINFO: "40",
            HYDRANODE_LIGHTING: "41",
            HYDRANODE_RESETFANINDEX: "42",
            HYDRANODE_USINGTIME: "43",
            MATRIX_CUSTOM_ANIMATION: "60",
            MATRIX_MODE: "61",
            MATRIX_SAVE: "62",
            MATRIX_AURASYNCMODE: "63",
            POLYMO_SHUTDOWN_EFFECT: "71",
            POLYMO_SHUTDOWN_EFFECT_CUSTOMIZED: "72",
            POLYMO_LIGHTING_EFFECT: "73",
            SONICSTUDIO: "81",
            WIFIANTENNA_QUICKCHECK: "91",
            WIFIANTENNA_DIRECTIONFINDER: "92",
            WIFIANTENNA_RESET: "93",
            WIFIANTENNA_TRAFFICMONITOR: "94",
            WIFIANTENNA_TRAFFICMONITOR_OPTIMIZATION: "95",
            WIFIANTENNA_TRAFFICMONITOR_LOGIN: "96",
            WIFIANTENNA_TRAFFICMONITOR_LOCATIONON: "97",
            WIFIANTENNA_SMARTNOTIFY: "98",
            WIFIANTENNA_MLO: "99",
            WIFIANTENNA_QUERYLOCATION: "100",
            POWERSAVING_QUERY: "111",
            POWERSAVING_AIOC: "112",
            POWERSAVING_POWERSAVING: "113",
            POWERSAVING_POWERSAVINGITEMS: "114",
            POWERSAVING_CPUWATT: "115",
            POWERSAVING_SETTINGS: "116",
            PROFILE: "1",
            EFFECT: "2",
            SYNC: "3",
            SWITCH_BUTTON: "4",
            FRAME: "5",
            POWER_STATUS: "6",
            SW_MODE: "8",
            LOAD_DATA: "10",
            WRITE_FILE: "11",
            DELETE_FILE: "12",
            AUTO_RESPONSE_EVENT: "13"
          },
          dataNumber: {
            QUERY: "1",
            DEVICE_INFO: "1",
            EFFECT_INFO: "2",
            FRAME_INFO: "3",
            POWER_INFO: "4",
            READ_FILE: "5",
            PROFILE_INFO: "6"
          },
          profileFunction: {
            CHANGE_TO_PROFILE: "0",
            DEFAULT: "1",
            SAVE_TO_PROFILE: "2"
          },
          deviceMode: {
            NORMAL: "0",
            BOOTLOADER: "1"
          },
          effect: {
            STATIC: "0",
            BREATHING: "1",
            COLOR_CYCLE: "2",
            RAINBOW: "3",
            WAVE: "4",
            COMET: "5",
            GLOWING_YOYO: "6",
            CROSS: "7",
            STARRY_NIGHT: "8",
            OFF: "240"
          },
          rgbheaderNumber: {
            SETCOLOR: "11",
            CALIBRATION: "12"
          },
          addressableNumber: o,
          sonicStudioNumber: {
            QUERY_DEVICE: "1",
            QUERY_PRESET: "2",
            QUERY_PRESET_DETAIL: "3",
            GET_RENDER_ONOFF: "10",
            SET_RENDER_ONOFF: "101",
            SET_VOICECLARITY: "102",
            SET_SMARTVOLUME: "103",
            SET_TREBLE: "104",
            SET_BASS: "105",
            SET_SURROUND: "106",
            SET_REVEB: "107",
            SET_PLAYBACK_EQ: "108",
            SET_PRESET_RESET: "109",
            GET_CAPTURE_ONOFF: "11",
            SET_CAPTURE_ONOFF: "110",
            SET_NOISE_REDUCTION: "111",
            SET_VOLUMESTABILIZER: "112",
            SET_RECORD_EQ: "113",
            GET_GLOBALENABLE: "4",
            SET_GLOBALENABLE: "114",
            GET_MUTE: "5",
            SET_MUTE: "115",
            GET_SYSTEMVOLUME: "6",
            SET_SYSTEMVOLUME: "116",
            GET_DIRECTMONITOR: "7",
            SET_DIRECTMONITOR: "117",
            GET_APPROUTING_ONOFF: "8",
            SET_APPROUTING_ONOFF: "118",
            QUERY_APPS: "9",
            SET_APPROUTING_DEVICE: "119",
            START_METER_DATA: "997",
            STOP_METER_DATA: "998",
            GET_ALLOW_PROCESSING: "12",
            SET_ALLOW_PROCESSING: "120",
            SET_DEFAULT_DEVICE: "121"
          },
          sonicStudioDeviceType: {
            PLYABACK_DEVICE: "0",
            RECORD_DEVICE: "1",
            ALL_DEVICE: "2"
          }
        }
      },
      737: function(e, t, o) {
        var n = this && this.__spreadArray || function(e, t, o) {
            if (o || 2 === arguments.length)
              for (var n, s = 0, i = t.length; s < i; s++) !n && s in t || (n || (n = Array.prototype.slice.call(t, 0, s)), n[s] = t[s]);
            return e.concat(n || Array.prototype.slice.call(t))
          },
          s = this && this.__importDefault || function(e) {
            return e && e.__esModule ? e : {
              default: e
            }
          };
        Object.defineProperty(t, "__esModule", {
          value: !0
        });
        var i = s(o(79)),
          r = s(o(363)),
          c = i.default.peripheralDevice,
          a = i.default.deviceNameMapping,
          u = r.default.functionNumber,
          d = r.default.addressableNumber,
          l = a[c.MBLED] || c.MBLED,
          f = utility.parseJSON2XML,
          y = utility.parseXML2JSON,
          p = utility.parseErrorCode;
        t.default = {
          setLEDCount: function(e) {
            return function() {
              var t = this,
                o = "setLEDCount";
              return new Promise((function(s, i) {
                var r = e.deviceType,
                  a = e.sessionKey,
                  v = e.modelNumber,
                  h = e.settings.addrObjStripList,
                  m = {
                    root: {
                      device_type: {
                        $: {
                          key: c.MBLED
                        },
                        device: {
                          $: {
                            key: v
                          },
                          function: {
                            $: {
                              key: u.ADDRESSABLE_HEADERS
                            },
                            profiles: {
                              version: "1.2",
                              funcid: d.SETLEDCOUNT,
                              addressable_strip_using: {
                                _: "1",
                                addressable_strip_led_count: n([], h, !0)
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  g = f(m);
                Promise.resolve().then((function() {
                  var e = "".concat(a);
                  return logMessage.info("[".concat(l, "]"), "".concat(o))(r), t.send({
                    method: "post",
                    deviceType: r,
                    sessionKey: e,
                    xml: g
                  })
                })).then((function(e) {
                  return y(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(l, "]"), "".concat(o, " successful."))(r), s({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  i({
                    status: 500,
                    payload: {
                      errorCode: p(e)
                    }
                  })
                }))
              }))
            }
          },
          setRescanHeaderMode: function(e) {
            return function() {
              var t = this,
                o = "setRescanHeaderMode";
              return new Promise((function(s, i) {
                var r = e.deviceType,
                  a = e.sessionKey,
                  d = e.modelNumber,
                  v = e.settings,
                  h = v.channelcount,
                  m = v.addrBlockList,
                  g = {
                    root: {
                      device_type: {
                        $: {
                          key: c.MBLED
                        },
                        device: {
                          $: {
                            key: d
                          },
                          function: {
                            $: {
                              key: u.ADDRESSABLE_RESCAN_HEADERMODE
                            },
                            channelcount: h,
                            channel: n([], m, !0)
                          }
                        }
                      }
                    }
                  },
                  E = f(g);
                Promise.resolve().then((function() {
                  var e = "".concat(a);
                  return logMessage.info("[".concat(l, "]"), "".concat(o))(r), t.send({
                    method: "post",
                    deviceType: r,
                    sessionKey: e,
                    xml: E
                  })
                })).then((function(e) {
                  return y(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(l, "]"), "".concat(o, " successful."))(r), s({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  i({
                    status: 500,
                    payload: {
                      errorCode: p(e)
                    }
                  })
                }))
              }))
            }
          }
        }
      },
      801: function(e, t, o) {
        var n = this && this.__assign || function() {
            return n = Object.assign || function(e) {
              for (var t, o = 1, n = arguments.length; o < n; o++)
                for (var s in t = arguments[o]) Object.prototype.hasOwnProperty.call(t, s) && (e[s] = t[s]);
              return e
            }, n.apply(this, arguments)
          },
          s = this && this.__importDefault || function(e) {
            return e && e.__esModule ? e : {
              default: e
            }
          };
        Object.defineProperty(t, "__esModule", {
          value: !0
        });
        var i = s(o(79)),
          r = s(o(363)),
          c = i.default.peripheralDevice,
          a = i.default.deviceNameMapping,
          u = r.default.functionNumber,
          d = a[c.MBLED] || c.MBLED,
          l = utility.parseJSON2XML,
          f = utility.parseXML2JSON,
          y = utility.parseErrorCode,
          p = function(e) {
            return function() {
              var t = this,
                o = "getInputQuery";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  r = e.sessionKey,
                  a = e.modelNumber,
                  p = {
                    root: {
                      device_type: {
                        $: {
                          key: c.MBLED
                        },
                        device: {
                          $: {
                            key: a
                          },
                          function: {
                            $: {
                              key: u.AIMIC_INPUT_QUERY
                            }
                          }
                        }
                      }
                    }
                  },
                  v = l(p);
                Promise.resolve().then((function() {
                  var e = "".concat(r);
                  return logMessage.info("[".concat(d, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: v
                  })
                })).then((function(e) {
                  return f(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(d, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: y(e)
                    }
                  })
                }))
              }))
            }
          },
          v = function(e) {
            return function() {
              var t = this,
                o = "getOutputQuery";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  r = e.sessionKey,
                  a = e.modelNumber,
                  p = {
                    root: {
                      device_type: {
                        $: {
                          key: c.MBLED
                        },
                        device: {
                          $: {
                            key: a
                          },
                          function: {
                            $: {
                              key: u.AIMIC_OUTPUT_QUERY
                            }
                          }
                        }
                      }
                    }
                  },
                  v = l(p);
                Promise.resolve().then((function() {
                  var e = "".concat(r);
                  return logMessage.info("[".concat(d, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: v
                  })
                })).then((function(e) {
                  return f(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(d, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: y(e)
                    }
                  })
                }))
              }))
            }
          };
        t.default = {
          getAiMicQuery: function(e) {
            return function() {
              var t = this;
              return new Promise((function(o, s) {
                var i = e.deviceType,
                  r = {};
                Promise.resolve().then((function() {
                  return t.dispatch(p(e))
                })).then((function(e) {
                  r = {
                    inputData: n({}, null == e ? void 0 : e.payload)
                  }
                })).then((function() {
                  return t.dispatch(v(e))
                })).then((function(e) {
                  r = n(n({}, r), {
                    outputData: n({}, null == e ? void 0 : e.payload)
                  })
                })).then((function() {
                  logMessage.info("[".concat(d, "]"), "".concat("getAiMicQuery", " successful."))(i), o({
                    status: 200,
                    payload: r
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: y(e)
                    }
                  })
                }))
              }))
            }
          },
          getInputQuery: p,
          getOutputQuery: v,
          setDefault: function(e) {
            return function() {
              var t = this,
                o = "setDefault";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  r = e.sessionKey,
                  a = e.modelNumber,
                  p = e.settings.mute_noise,
                  v = {
                    root: {
                      device_type: {
                        $: {
                          key: c.MBLED
                        },
                        device: {
                          $: {
                            key: a
                          },
                          function: {
                            $: {
                              key: u.AIMIC_INPUT_MUTENOISE
                            },
                            setting: {
                              mute_noise: p
                            }
                          }
                        }
                      }
                    }
                  },
                  h = l(v);
                Promise.resolve().then((function() {
                  var e = "".concat(r);
                  return logMessage.info("[".concat(d, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: h
                  })
                })).then((function(e) {
                  return f(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(d, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: y(e)
                    }
                  })
                }))
              }))
            }
          },
          setMuteNoise: function(e) {
            return function() {
              var t = this,
                o = "setMuteNoise";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  r = e.sessionKey,
                  a = e.modelNumber,
                  p = e.settings,
                  v = p.audioWay,
                  h = p.mute_noise,
                  m = u.AIMIC_INPUT_MUTENOISE;
                "output" === v && (m = u.AIMIC_OUTPUT_MUTENOISE);
                var g = {
                    root: {
                      device_type: {
                        $: {
                          key: c.MBLED
                        },
                        device: {
                          $: {
                            key: a
                          },
                          function: {
                            $: {
                              key: m
                            },
                            setting: {
                              mute_noise: h
                            }
                          }
                        }
                      }
                    }
                  },
                  E = l(g);
                Promise.resolve().then((function() {
                  var e = "".concat(r);
                  return logMessage.info("[".concat(d, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: E
                  })
                })).then((function(e) {
                  return f(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(d, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: y(e)
                    }
                  })
                }))
              }))
            }
          },
          setAiMicDevice: function(e) {
            return function() {
              var t = this,
                o = "setAiMicDevice";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  r = e.sessionKey,
                  a = e.modelNumber,
                  p = e.settings,
                  v = p.audioWay,
                  h = p.device_id,
                  m = u.AIMIC_INPUT_AUDIODEVICE;
                "output" === v && (m = u.AIMIC_OUTPUT_AUDIODEVICE);
                var g = {
                    root: {
                      device_type: {
                        $: {
                          key: c.MBLED
                        },
                        device: {
                          $: {
                            key: a
                          },
                          function: {
                            $: {
                              key: m
                            },
                            setting: {
                              device_id: h
                            }
                          }
                        }
                      }
                    }
                  },
                  E = l(g);
                Promise.resolve().then((function() {
                  var e = "".concat(r);
                  return logMessage.info("[".concat(d, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: E
                  })
                })).then((function(e) {
                  return f(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(d, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: y(e)
                    }
                  })
                }))
              }))
            }
          },
          setAiMicNRLevel: function(e) {
            return function() {
              var t = this,
                o = "setAiMicNRLevel";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  r = e.sessionKey,
                  a = e.modelNumber,
                  p = e.settings,
                  v = p.audioWay,
                  h = p.nr_level,
                  m = u.AIMIC_INPUT_NRLEVEL;
                "output" === v && (m = u.AIMIC_OUTPUT_NRLEVEL);
                var g = {
                    root: {
                      device_type: {
                        $: {
                          key: c.MBLED
                        },
                        device: {
                          $: {
                            key: a
                          },
                          function: {
                            $: {
                              key: m
                            },
                            setting: {
                              $: {
                                key: "0"
                              },
                              nr_level: h
                            }
                          }
                        }
                      }
                    }
                  },
                  E = l(g);
                Promise.resolve().then((function() {
                  var e = "".concat(r);
                  return logMessage.info("[".concat(d, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: E
                  })
                })).then((function(e) {
                  return f(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(d, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: y(e)
                    }
                  })
                }))
              }))
            }
          }
        }
      },
      200: function(e, t, o) {
        var n = this && this.__assign || function() {
            return n = Object.assign || function(e) {
              for (var t, o = 1, n = arguments.length; o < n; o++)
                for (var s in t = arguments[o]) Object.prototype.hasOwnProperty.call(t, s) && (e[s] = t[s]);
              return e
            }, n.apply(this, arguments)
          },
          s = this && this.__awaiter || function(e, t, o, n) {
            return new(o || (o = Promise))((function(s, i) {
              function r(e) {
                try {
                  a(n.next(e))
                } catch (e) {
                  i(e)
                }
              }

              function c(e) {
                try {
                  a(n.throw(e))
                } catch (e) {
                  i(e)
                }
              }

              function a(e) {
                var t;
                e.done ? s(e.value) : (t = e.value, t instanceof o ? t : new o((function(e) {
                  e(t)
                }))).then(r, c)
              }
              a((n = n.apply(e, t || [])).next())
            }))
          },
          i = this && this.__generator || function(e, t) {
            var o, n, s, i, r = {
              label: 0,
              sent: function() {
                if (1 & s[0]) throw s[1];
                return s[1]
              },
              trys: [],
              ops: []
            };
            return i = {
              next: c(0),
              throw: c(1),
              return: c(2)
            }, "function" == typeof Symbol && (i[Symbol.iterator] = function() {
              return this
            }), i;

            function c(c) {
              return function(a) {
                return function(c) {
                  if (o) throw new TypeError("Generator is already executing.");
                  for (; i && (i = 0, c[0] && (r = 0)), r;) try {
                    if (o = 1, n && (s = 2 & c[0] ? n.return : c[0] ? n.throw || ((s = n.return) && s.call(n), 0) : n.next) && !(s = s.call(n, c[1])).done) return s;
                    switch (n = 0, s && (c = [2 & c[0], s.value]), c[0]) {
                      case 0:
                      case 1:
                        s = c;
                        break;
                      case 4:
                        return r.label++, {
                          value: c[1],
                          done: !1
                        };
                      case 5:
                        r.label++, n = c[1], c = [0];
                        continue;
                      case 7:
                        c = r.ops.pop(), r.trys.pop();
                        continue;
                      default:
                        if (!((s = (s = r.trys).length > 0 && s[s.length - 1]) || 6 !== c[0] && 2 !== c[0])) {
                          r = 0;
                          continue
                        }
                        if (3 === c[0] && (!s || c[1] > s[0] && c[1] < s[3])) {
                          r.label = c[1];
                          break
                        }
                        if (6 === c[0] && r.label < s[1]) {
                          r.label = s[1], s = c;
                          break
                        }
                        if (s && r.label < s[2]) {
                          r.label = s[2], r.ops.push(c);
                          break
                        }
                        s[2] && r.ops.pop(), r.trys.pop();
                        continue
                    }
                    c = t.call(e, r)
                  } catch (e) {
                    c = [6, e], n = 0
                  } finally {
                    o = s = 0
                  }
                  if (5 & c[0]) throw c[1];
                  return {
                    value: c[0] ? c[1] : void 0,
                    done: !0
                  }
                }([c, a])
              }
            }
          },
          r = this && this.__importDefault || function(e) {
            return e && e.__esModule ? e : {
              default: e
            }
          };
        Object.defineProperty(t, "__esModule", {
          value: !0
        });
        var c = r(o(17)),
          a = r(o(79)),
          u = r(o(363)),
          d = r(o(209)),
          l = r(o(147)),
          f = a.default.peripheralDevice,
          y = a.default.deviceNameMapping,
          p = u.default.functionNumber,
          v = y[f.MBLED] || f.MBLED,
          h = utility.readFile,
          m = utility.parseJSON2XML,
          g = utility.parseXML2JSON,
          E = utility.parseErrorCode,
          _ = {},
          T = function(e) {
            return function() {
              var t = this,
                o = "query";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  r = e.sessionKey,
                  c = e.modelNumber,
                  a = {
                    root: {
                      device_type: {
                        $: {
                          key: f.MBLED
                        },
                        device: {
                          $: {
                            key: c
                          },
                          function: {
                            $: {
                              key: p.MB_QUERY
                            }
                          }
                        }
                      }
                    }
                  },
                  u = m(a);
                Promise.resolve().then((function() {
                  var e = "".concat(r);
                  return logMessage.info("[".concat(v, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: u
                  })
                })).then((function(e) {
                  return g(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(v, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: E(e)
                    }
                  })
                }))
              }))
            }
          },
          M = function(e) {
            return function() {
              var t = this,
                o = "queryFast";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  r = e.sessionKey,
                  c = e.modelNumber,
                  a = {
                    root: {
                      device_type: {
                        $: {
                          key: f.MBLED
                        },
                        device: {
                          $: {
                            key: c
                          },
                          function: {
                            $: {
                              key: p.MB_QUERYFAST
                            }
                          }
                        }
                      }
                    }
                  },
                  u = m(a);
                Promise.resolve().then((function() {
                  var e = "".concat(r);
                  return logMessage.info("[".concat(v, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: u
                  })
                })).then((function(e) {
                  return g(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(v, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: E(e)
                    }
                  })
                }))
              }))
            }
          },
          N = function(e, t) {
            return function() {
              var o = this;
              return new Promise((function(n, s) {
                var i, r = "getConfig",
                  c = e.deviceType,
                  a = e.modelNumber,
                  u = a ? o.getDeviceFolderName(a) : null,
                  d = null !== (i = null == u ? void 0 : u.configPath) && void 0 !== i ? i : "";
                d ? Promise.resolve().then((function() {
                  return h("".concat(d, "\\").concat(t), {
                    deviceType: c,
                    isLegacyFormat: !1
                  })
                })).then((function(e) {
                  var t = null;
                  if (e.includes('<?xml version="1.0" encoding="UTF-8"')) return new Promise((function(o, n) {
                    Promise.resolve().then((function() {
                      return g(e)
                    })).then((function(e) {
                      try {
                        t = e.device_type.device.function.file_data, t = decodeURIComponent(atob(t)), t = JSON.parse(t), o(t)
                      } catch (e) {
                        n(errorCode.DATA_FORMAT_ERROR)
                      }
                    })).catch((function() {
                      return n(errorCode.DATA_FORMAT_ERROR)
                    }))
                  }));
                  var o = decodeURIComponent(atob(e));
                  return JSON.parse(o)
                })).then((function(e) {
                  e ? (logMessage.info("[".concat(v, "] [").concat(r, "]"), "config is exist.")(c), n({
                    status: 200,
                    payload: e
                  })) : (logMessage.info("[".concat(v, "] [").concat(r, "]"), "config is empty.")(c), n({
                    status: 200
                  }))
                })).catch((function() {
                  logMessage.info("[".concat(v, "] [").concat(r, "]"), "fail.")(c), n({
                    status: 200
                  })
                })) : (logMessage.info("[".concat(v, "]"), "deviceFolder is not exist.")(c), s({
                  status: 500,
                  payload: {
                    errorCode: statusCode.FOLDER_NOT_DEFINED
                  }
                }))
              }))
            }
          },
          P = function(e) {
            return function() {
              return new Promise((function(t, o) {
                var s = e.deviceType,
                  i = e.modelNumber,
                  r = c.default.resolve("".concat(pathMapping.proj, "\\view\\").concat(i, "\\resources\\src\\_ref\\caps.json"));
                Promise.resolve().then((function() {
                  return h(r, {
                    deviceType: s,
                    isLegacyFormat: !1
                  })
                })).then((function(e) {
                  var o = {},
                    s = {};
                  e && (s = JSON.parse(e)).functionList.forEach((function(e) {
                    switch (e.id) {
                      case "Oled":
                        o.hasOled = !0;
                        break;
                      case "Lighting":
                        o.hasLighting = !0;
                        break;
                      case "PolymoShutdown":
                        o.hasPolymoShutdown = !0;
                        break;
                      case "AddressableHeaders":
                        o.hasAddressableHeaders = !0;
                        break;
                      case "RGBHeaders":
                        o.hasRGBHeaders = !0;
                        break;
                      case "AIMic":
                        o.hasAIMic = !0;
                        break;
                      case "Hydranode":
                        o.hasHydranode = !0;
                        break;
                      case "Matrix":
                        o.hasAniMeMatrix = !0;
                        break;
                      case "PolymoLighting":
                        o.hasPolymoLighting = !0;
                        break;
                      case "SonicStudio":
                        o.hasSonicStudio = !0
                    }
                  })), t({
                    status: 200,
                    payload: n(n({}, s), {
                      capsFunctions: o
                    })
                  })
                })).catch((function() {
                  o({
                    status: 500,
                    payload: {
                      errorCode: statusCode.CAPS_NOT_FOUND
                    }
                  })
                }))
              }))
            }
          },
          O = function(e, t) {
            return function() {
              var t = this;
              return new Promise((function(o, r) {
                var c = {};
                Promise.resolve().then((function() {
                  return t.dispatch(N(e, "config.xml"))
                })).then((function(e) {
                  var t = e.payload;
                  if (t) {
                    var o = t.currProfile;
                    c = n(n(n({}, c), o && {
                      selectedProfile: o.id
                    }), {
                      globalSettings: n({}, t)
                    })
                  }
                })).then((function() {
                  return t.dispatch(N(e, "fp_1_config.xml"))
                })).then((function(e) {
                  var t = (e || {}).payload;
                  t && (c = n(n({}, c), {
                    profileSettings: n({}, t)
                  }))
                })).then((function() {
                  return s(t, void 0, void 0, (function() {
                    var t = this;
                    return i(this, (function(s) {
                      switch (s.label) {
                        case 0:
                          return [4, Promise.resolve().then((function() {
                            return t.dispatch(N(e, "fp_1_previousLighting.xml"))
                          })).then((function(e) {
                            var t = (e || {}).payload;
                            t && (c = n(n({}, c), {
                              previousLighting: n({}, t)
                            })), o({
                              status: 200,
                              payload: c
                            })
                          })).catch((function() {
                            o({
                              status: 200,
                              payload: c
                            })
                          }))];
                        case 1:
                          return s.sent(), [2]
                      }
                    }))
                  }))
                })).then((function() {
                  o({
                    status: 200,
                    payload: c
                  })
                })).catch((function() {
                  r({
                    status: 500,
                    payload: {
                      errorCode: statusCode.FILE_NOT_FOUND
                    }
                  })
                }))
              }))
            }
          },
          D = function(e, t) {
            return function() {
              return new Promise((function(o) {
                var n = e.deviceType,
                  s = "".concat(pathMapping.proj, "\\view\\externalFiles\\").concat(t),
                  i = [];
                if (logMessage.info("[".concat(v, "]"), "matrixFilePath => ".concat(s))(n), l.default.existsSync(s)) {
                  for (var r = 0, c = l.default.readdirSync(s); r < c.length; r++) {
                    var a = c[r];
                    i.push({
                      fileName: a
                    })
                  }
                  logMessage.info("[".concat(v, "]"), "matrix custom image list => ".concat(JSON.stringify(i, null, 2)))(n)
                } else logMessage.info("[".concat(v, "]"), "matrix custom image path is not exist")(n);
                o({
                  status: 200,
                  payload: i
                })
              }))
            }
          };
        t.default = {
          query: T,
          queryFast: M,
          getDeviceInfo: function(e) {
            return function() {
              var t = this;
              return new Promise((function(o, n) {
                var s = e.deviceType,
                  i = e.modelNumber,
                  r = e.sessionKey,
                  c = {
                    root: {
                      device_type: {
                        $: {
                          key: f.AIO
                        },
                        device: {
                          $: {
                            key: i
                          },
                          function: {
                            $: {
                              key: p.GET_FW_VERSION
                            }
                          }
                        }
                      }
                    }
                  },
                  a = m(c);
                Promise.resolve().then((function() {
                  var e = "".concat(r);
                  return logMessage.info("[".concat(v, "]"), "getDeviceInfo.")(s), t.send({
                    method: "post",
                    deviceType: s,
                    sessionKey: e,
                    xml: a
                  })
                })).then((function(e) {
                  logMessage.info("[".concat(v, "]"), "getDeviceInfo successful.")(s), o({
                    status: 200,
                    payload: e.payload.replace(/\n/g, "").replace(/\x00/g, "")
                  })
                })).catch((function(e) {
                  n({
                    status: 500,
                    payload: {
                      errorCode: E(e)
                    }
                  })
                }))
              }))
            }
          },
          initialize: function(e, t) {
            return function() {
              var o = this;
              return new Promise((function(s, i) {
                var r = e.deviceType,
                  c = e.sessionKey,
                  a = null,
                  u = n({}, _);
                logMessage.info("[".concat(v, "]"), "initializeDevicePage.")(r), Promise.resolve().then((function() {
                  return o.dispatch(P(e))
                })).then((function(e) {
                  a = e ? e.payload : null
                })).then((function() {
                  return o.dispatch(M({
                    deviceType: r,
                    sessionKey: c,
                    modelNumber: t
                  }))
                })).then((function(e) {
                  var t = (e || {}).payload;
                  t && (u = n(n({}, u), {
                    mbQueryData: t
                  }))
                })).then((function() {
                  return o.dispatch(O(n({}, e)))
                })).then((function(e) {
                  var t = (e || {}).payload;
                  t && (u = n(n({}, u), {
                    profileData: t
                  }))
                })).then((function() {
                  var t = a.matrix;
                  if (null == t ? void 0 : t.targetExternalFile) return o.dispatch(D(e, null == t ? void 0 : t.targetExternalFile))
                })).then((function(e) {
                  var t = (e || {}).payload;
                  t && (u = n(n({}, u), {
                    matrixCustomImage: t
                  }))
                })).then((function() {
                  logMessage.info("[".concat(v, "]"), "initializeDevicePage success.")(r), s({
                    status: 200,
                    payload: u
                  })
                })).catch((function(e) {
                  var t;
                  i({
                    status: 500,
                    payload: n({
                      errorCode: (null == e ? void 0 : e.message) || (null === (t = null == e ? void 0 : e.payload) || void 0 === t ? void 0 : t.errorCode) || e || errorCode.SDK_RETURN_FAILED
                    }, u)
                  })
                }))
              }))
            }
          },
          initializeAlertPage: function(e) {
            return function() {
              var t = this,
                o = "initializeAlertPage";
              return new Promise((function(s, i) {
                var r = e.deviceType,
                  c = {
                    isActivated: !1
                  };
                logMessage.info("[".concat(v, "]"), "".concat(o, " successful."))(r), Promise.resolve().then((function() {
                  return t.dispatch(T(e))
                })).then((function(e) {
                  var t = (e || {}).payload;
                  t && (c = n(n({}, c), {
                    mbQueryData: t
                  }))
                })).then((function() {
                  return t.dispatch(d.default.getDiskInfo(e))
                })).then((function(e) {
                  e && (_.diskInfoData = null == e ? void 0 : e.payload)
                })).then((function() {
                  logMessage.info("[".concat(v, "]"), "".concat(o, " successful."))(r), s({
                    status: 200,
                    payload: c
                  })
                })).catch((function(e) {
                  var t;
                  i({
                    status: 500,
                    payload: n({
                      errorCode: (null == e ? void 0 : e.message) || (null === (t = null == e ? void 0 : e.payload) || void 0 === t ? void 0 : t.errorCode) || e || errorCode.SDK_RETURN_FAILED
                    }, c)
                  })
                }))
              }))
            }
          },
          getProfile: O,
          getCaps: P,
          getConfig: N,
          getExternalImage: D,
          deleteExternalImage: function(e) {
            return function() {
              var t = this;
              return new Promise((function(o) {
                var n = e.deviceType,
                  s = e.settings,
                  i = s.targetPath,
                  r = s.fileName,
                  c = "".concat(pathMapping.proj, "\\view\\externalFiles\\").concat(i, "\\").concat(r);
                return Promise.resolve().then((function() {
                  logMessage.info("[".concat(v, "]"), "Delete Folder: ".concat(c, "."))(n), l.default.existsSync(c) && l.default.rmdirSync(c, {
                    recursive: !0
                  })
                })).then((function() {
                  return t.dispatch(D(e, i))
                })).then((function(e) {
                  logMessage.info("[".concat(v, "]"), "Delete Folder: ".concat(c, ". successful."))(n), o({
                    status: 200,
                    payload: null == e ? void 0 : e.payload
                  })
                }))
              }))
            }
          }
        }
      },
      209: function(e, t, o) {
        var n = this && this.__importDefault || function(e) {
          return e && e.__esModule ? e : {
            default: e
          }
        };
        Object.defineProperty(t, "__esModule", {
          value: !0
        });
        var s = n(o(79)),
          i = n(o(363)),
          r = s.default.peripheralDevice,
          c = s.default.deviceNameMapping,
          a = i.default.functionNumber,
          u = c[r.MBLED] || r.MBLED,
          d = utility.parseJSON2XML,
          l = utility.parseXML2JSON,
          f = utility.parseErrorCode;
        t.default = {
          getDiskInfo: function(e) {
            return function() {
              var t = this,
                o = "getDiskInfo";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  c = e.sessionKey,
                  y = e.modelNumber,
                  p = {
                    root: {
                      device_type: {
                        $: {
                          key: r.MBLED
                        },
                        device: {
                          $: {
                            key: y
                          },
                          function: {
                            $: {
                              key: a.DISK_QUERY
                            }
                          }
                        }
                      }
                    }
                  },
                  v = d(p);
                Promise.resolve().then((function() {
                  var e = "".concat(c);
                  return logMessage.info("[".concat(u, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: v
                  })
                })).then((function(e) {
                  return l(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(u, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: f(e)
                    }
                  })
                }))
              }))
            }
          }
        }
      },
      854: function(e, t, o) {
        var n = this && this.__importDefault || function(e) {
          return e && e.__esModule ? e : {
            default: e
          }
        };
        Object.defineProperty(t, "__esModule", {
          value: !0
        });
        var s = n(o(79)),
          i = n(o(363)),
          r = s.default.peripheralDevice,
          c = s.default.deviceNameMapping,
          a = i.default.functionNumber,
          u = c[r.MBLED] || r.MBLED,
          d = utility.parseJSON2XML,
          l = utility.parseXML2JSON,
          f = utility.parseErrorCode;
        t.default = {
          getDynamicInfo: function(e) {
            return function() {
              var t = this,
                o = "getDynamicInfo";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  c = e.sessionKey,
                  y = e.modelNumber,
                  p = e.settings.key,
                  v = {
                    root: {
                      device_type: {
                        $: {
                          key: r.MBLED
                        },
                        device: {
                          $: {
                            key: y
                          },
                          function: {
                            $: {
                              key: a.HYDRANODE_DYNAMICINFO
                            },
                            fan: {
                              $: {
                                key: p
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  h = d(v);
                Promise.resolve().then((function() {
                  var e = "".concat(c);
                  return logMessage.info("[".concat(u, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: h
                  })
                })).then((function(e) {
                  return l(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(u, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: f(e)
                    }
                  })
                }))
              }))
            }
          },
          getUsingTime: function(e) {
            return function() {
              var t = this,
                o = "getUsingTime";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  c = e.sessionKey,
                  y = e.modelNumber,
                  p = e.settings.key,
                  v = {
                    root: {
                      device_type: {
                        $: {
                          key: r.MBLED
                        },
                        device: {
                          $: {
                            key: y
                          },
                          function: {
                            $: {
                              key: a.HYDRANODE_USINGTIME
                            },
                            fan: {
                              $: {
                                key: p
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  h = d(v);
                Promise.resolve().then((function() {
                  var e = "".concat(c);
                  return logMessage.info("[".concat(u, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: h
                  })
                })).then((function(e) {
                  return l(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(u, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: f(e)
                    }
                  })
                }))
              }))
            }
          },
          setLightingEffect: function(e) {
            return function() {
              var t = this,
                o = "setLightingEffect";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  c = e.sessionKey,
                  y = e.modelNumber,
                  p = e.settings,
                  v = p.synced,
                  h = p.key,
                  m = p.playMode,
                  g = p.ledColorR,
                  E = p.ledColorG,
                  _ = p.ledColorB,
                  T = p.ledSpeed,
                  M = p.ledDirection,
                  N = {
                    root: {
                      device_type: {
                        $: {
                          key: r.MBLED
                        },
                        device: {
                          $: {
                            key: y
                          },
                          function: {
                            $: {
                              key: a.HYDRANODE_LIGHTING
                            },
                            is_synced: v,
                            fan: {
                              $: {
                                key: h
                              },
                              play_mode: m,
                              led_item: {
                                led_colorr: g,
                                led_colorg: E,
                                led_colorb: _,
                                led_speed: T,
                                led_direction: M
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  P = d(N);
                Promise.resolve().then((function() {
                  var e = "".concat(c);
                  return logMessage.info("[".concat(u, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: P
                  })
                })).then((function(e) {
                  return l(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(u, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: f(e)
                    }
                  })
                }))
              }))
            }
          },
          setResetFan: function(e) {
            return function() {
              var t = this,
                o = "setResetFan";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  c = e.sessionKey,
                  y = e.modelNumber,
                  p = {
                    root: {
                      device_type: {
                        $: {
                          key: r.MBLED
                        },
                        device: {
                          $: {
                            key: y
                          },
                          function: {
                            $: {
                              key: a.HYDRANODE_RESETFANINDEX
                            }
                          }
                        }
                      }
                    }
                  },
                  v = d(p);
                Promise.resolve().then((function() {
                  var e = "".concat(c);
                  return logMessage.info("[".concat(u, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: v
                  })
                })).then((function(e) {
                  return l(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(u, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: f(e)
                    }
                  })
                }))
              }))
            }
          }
        }
      },
      607: function(e, t, o) {
        var n = this && this.__assign || function() {
            return n = Object.assign || function(e) {
              for (var t, o = 1, n = arguments.length; o < n; o++)
                for (var s in t = arguments[o]) Object.prototype.hasOwnProperty.call(t, s) && (e[s] = t[s]);
              return e
            }, n.apply(this, arguments)
          },
          s = this && this.__importDefault || function(e) {
            return e && e.__esModule ? e : {
              default: e
            }
          };
        Object.defineProperty(t, "__esModule", {
          value: !0
        });
        var i = s(o(873)),
          r = s(o(79)),
          c = global,
          a = r.default.peripheralDevice,
          u = c.statusCode,
          d = c.errorCode;
        c.statusCode = n(n({}, d), u), t.default = {
          router: i.default,
          deviceType: a.MBLED,
          shouldPreload: !0
        }
      },
      509: function(e, t, o) {
        var n = this && this.__importDefault || function(e) {
          return e && e.__esModule ? e : {
            default: e
          }
        };
        Object.defineProperty(t, "__esModule", {
          value: !0
        });
        var s = n(o(79)),
          i = n(o(363)),
          r = s.default.peripheralDevice,
          c = s.default.deviceNameMapping,
          a = i.default.functionNumber,
          u = c[r.MBLED] || r.MBLED,
          d = utility.parseJSON2XML,
          l = utility.parseXML2JSON,
          f = utility.parseErrorCode,
          y = function(e, t) {
            for (var o = [], n = function(e) {
                var n = {
                  $: {
                    key: e.toString()
                  },
                  led_colorr: "0",
                  led_colorg: "0",
                  led_colorb: "0",
                  led_speed: "0",
                  led_direction: "0"
                };
                t.forEach((function(t) {
                  e === Number(t.areaKey) && (n = {
                    $: {
                      key: t.areaKey
                    },
                    led_colorr: t.pattern.singleColor[0].r,
                    led_colorg: t.pattern.singleColor[0].g,
                    led_colorb: t.pattern.singleColor[0].b,
                    led_speed: t.speed,
                    led_direction: t.direction
                  })
                })), o.push(n)
              }, s = 0; s < e; s += 1) n(s);
            return o
          };
        t.default = {
          setLightingOff: function(e, t) {
            return function() {
              var t = this,
                o = "setLightingOff";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  c = e.sessionKey,
                  y = e.modelNumber,
                  p = e.settings,
                  v = p.playMode,
                  h = p.ledColorR,
                  m = p.ledColorG,
                  g = p.ledColorB,
                  E = p.ledSpeed,
                  _ = p.ledDirection,
                  T = {
                    root: {
                      device_type: {
                        $: {
                          key: r.MBLED
                        },
                        device: {
                          $: {
                            key: y
                          },
                          function: {
                            $: {
                              key: a.SHUTDOWNEFFECT
                            },
                            profiles: {
                              setting: {
                                play_mode: v,
                                iscolorsynced: "0",
                                singlecolor: "1",
                                led_item: {
                                  led_colorr: h,
                                  led_colorg: m,
                                  led_colorb: g,
                                  led_speed: E,
                                  led_direction: _
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  M = d(T);
                Promise.resolve().then((function() {
                  var e = "".concat(c);
                  return logMessage.info("[".concat(u, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: M
                  })
                })).then((function(e) {
                  return l(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(u, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: f(e)
                    }
                  })
                }))
              }))
            }
          },
          setLightingEffect: function(e, t) {
            return function() {
              var t = this,
                o = "setLightingEffect";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  c = e.sessionKey,
                  y = e.modelNumber,
                  p = e.settings,
                  v = p.playMode,
                  h = p.ledColorR,
                  m = p.ledColorG,
                  g = p.ledColorB,
                  E = p.ledSpeed,
                  _ = p.ledDirection,
                  T = {
                    root: {
                      device_type: {
                        $: {
                          key: r.MBLED
                        },
                        device: {
                          $: {
                            key: y
                          },
                          function: {
                            $: {
                              key: a.SHUTDOWNEFFECT
                            },
                            profiles: {
                              setting: {
                                play_mode: v,
                                iscolorsynced: "0",
                                singlecolor: "1",
                                led_item: {
                                  led_colorr: h,
                                  led_colorg: m,
                                  led_colorb: g,
                                  led_speed: E,
                                  led_direction: _
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  M = d(T);
                Promise.resolve().then((function() {
                  var e = "".concat(c);
                  return logMessage.info("[".concat(u, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: M
                  })
                })).then((function(e) {
                  return l(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(u, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: f(e)
                    }
                  })
                }))
              }))
            }
          },
          setRegionEffect: function(e) {
            return function() {
              var t = this,
                o = "setRegionEffect";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  c = e.sessionKey,
                  p = e.modelNumber,
                  v = e.settings,
                  h = v.ledCount,
                  m = v.playMode,
                  g = v.ledList,
                  E = {
                    root: {
                      device_type: {
                        $: {
                          key: r.MBLED
                        },
                        device: {
                          $: {
                            key: p
                          },
                          function: {
                            $: {
                              key: a.SHUTDOWNEFFECT_CUSTOMIZED
                            },
                            profiles: {
                              setting: {
                                ledcount: h,
                                play_mode: m,
                                iscolorsynced: "0",
                                singlecolor: "1",
                                led: y(h, g)
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  _ = d(E);
                Promise.resolve().then((function() {
                  var e = "".concat(c);
                  return logMessage.info("[".concat(u, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: _
                  })
                })).then((function(e) {
                  return l(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(u, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: f(e)
                    }
                  })
                }))
              }))
            }
          }
        }
      },
      799: function(e, t, o) {
        var n = this && this.__importDefault || function(e) {
          return e && e.__esModule ? e : {
            default: e
          }
        };
        Object.defineProperty(t, "__esModule", {
          value: !0
        });
        var s = n(o(79)),
          i = n(o(363)),
          r = s.default.peripheralDevice,
          c = s.default.deviceNameMapping,
          a = i.default.functionNumber,
          u = c[r.MBLED] || r.MBLED,
          d = utility.parseJSON2XML,
          l = utility.parseXML2JSON,
          f = utility.parseErrorCode;
        t.default = {
          setSwitchMatrix: function(e) {
            return function() {
              var t = this,
                o = "setSwitchMatrix";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  c = e.sessionKey,
                  y = e.modelNumber,
                  p = e.settings,
                  v = p.mode,
                  h = p.source_type,
                  m = p.ec_fileid,
                  g = {
                    root: {
                      device_type: {
                        $: {
                          key: r.MBLED
                        },
                        device: {
                          $: {
                            key: y
                          },
                          function: {
                            $: {
                              key: a.MATRIX_MODE
                            },
                            matrix: {
                              $: {
                                key: "0"
                              },
                              mode: v,
                              source_type: h,
                              ec_fileid: m
                            }
                          }
                        }
                      }
                    }
                  },
                  E = d(g);
                Promise.resolve().then((function() {
                  var e = "".concat(c);
                  return logMessage.info("[".concat(u, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: E
                  })
                })).then((function(e) {
                  return l(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(u, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: f(e)
                    }
                  })
                }))
              }))
            }
          },
          setMatrixSave: function(e) {
            return function() {
              var t = this,
                o = "setMatrixSave";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  c = e.sessionKey,
                  y = e.modelNumber,
                  p = e.settings,
                  v = p.s0_mode,
                  h = p.s0_source_type,
                  m = p.s0_ec_fileid,
                  g = p.s5_mode,
                  E = p.s5_source_type,
                  _ = p.s5_ec_fileid,
                  T = {
                    root: {
                      device_type: {
                        $: {
                          key: r.MBLED
                        },
                        device: {
                          $: {
                            key: y
                          },
                          function: {
                            $: {
                              key: a.MATRIX_SAVE
                            },
                            matrix: {
                              $: {
                                key: "0"
                              },
                              s0_mode: v,
                              s0_source_type: h,
                              s0_ec_fileid: m,
                              s5_mode: g,
                              s5_source_type: E,
                              s5_ec_fileid: _
                            }
                          }
                        }
                      }
                    }
                  },
                  M = d(T);
                Promise.resolve().then((function() {
                  var e = "".concat(c);
                  return logMessage.info("[".concat(u, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: M
                  })
                })).then((function(e) {
                  return l(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(u, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: f(e)
                    }
                  })
                }))
              }))
            }
          },
          setAuraSyncMode: function(e) {
            return function() {
              var t = this,
                o = "setAuraSyncMode";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  c = e.sessionKey,
                  y = e.modelNumber,
                  p = e.settings.aurasyncmode,
                  v = {
                    root: {
                      device_type: {
                        $: {
                          key: r.MBLED
                        },
                        device: {
                          $: {
                            key: y
                          },
                          function: {
                            $: {
                              key: a.MATRIX_AURASYNCMODE
                            },
                            matrix: {
                              $: {
                                key: "0"
                              },
                              aurasyncmode: p
                            }
                          }
                        }
                      }
                    }
                  },
                  h = d(v);
                Promise.resolve().then((function() {
                  var e = "".concat(c);
                  return logMessage.info("[".concat(u, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: h
                  })
                })).then((function(e) {
                  return l(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(u, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: f(e)
                    }
                  })
                }))
              }))
            }
          },
          setCustomEffect: function(e) {
            return function() {
              var t = this,
                o = "setCustomEffect";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  c = e.sessionKey,
                  y = e.modelNumber,
                  p = e.settings,
                  v = p.sw_fileid,
                  h = p.ec_fileid,
                  m = {
                    root: {
                      device_type: {
                        $: {
                          key: r.MBLED
                        },
                        device: {
                          $: {
                            key: y
                          },
                          function: {
                            $: {
                              key: a.MATRIX_CUSTOM_ANIMATION
                            },
                            matrix: {
                              $: {
                                key: "0"
                              },
                              sw_fileid: v,
                              ec_fileid: h
                            }
                          }
                        }
                      }
                    }
                  },
                  g = d(m);
                Promise.resolve().then((function() {
                  var e = "".concat(c);
                  return logMessage.info("[".concat(u, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: g
                  })
                })).then((function(e) {
                  return l(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(u, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: f(e)
                    }
                  })
                }))
              }))
            }
          }
        }
      },
      341: function(e, t, o) {
        var n = this && this.__importDefault || function(e) {
          return e && e.__esModule ? e : {
            default: e
          }
        };
        Object.defineProperty(t, "__esModule", {
          value: !0
        });
        var s = n(o(79)),
          i = n(o(363)),
          r = s.default.peripheralDevice,
          c = s.default.deviceNameMapping,
          a = i.default.functionNumber,
          u = c[r.MBLED] || r.MBLED,
          d = utility.parseJSON2XML,
          l = utility.parseXML2JSON,
          f = utility.parseErrorCode,
          y = function(e, t) {
            for (var o = [], n = function(e) {
                var n = {
                  $: {
                    key: e.toString()
                  },
                  led_colorr: "0",
                  led_colorg: "0",
                  led_colorb: "0",
                  led_speed: "0",
                  led_direction: "0"
                };
                t.forEach((function(t) {
                  e === Number(t.areaKey) && (n = {
                    $: {
                      key: t.areaKey
                    },
                    led_colorr: t.pattern.singleColor[0].r,
                    led_colorg: t.pattern.singleColor[0].g,
                    led_colorb: t.pattern.singleColor[0].b,
                    led_speed: t.speed,
                    led_direction: t.direction
                  })
                })), o.push(n)
              }, s = 0; s < e; s += 1) n(s);
            return o
          };
        t.default = {
          setPolymoShutdownOff: function(e) {
            return function() {
              var t = this,
                o = "setPolymoShutdownOff";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  c = e.sessionKey,
                  y = e.modelNumber,
                  p = e.settings,
                  v = p.playMode,
                  h = p.ledColorR,
                  m = p.ledColorG,
                  g = p.ledColorB,
                  E = p.ledSpeed,
                  _ = p.ledDirection,
                  T = {
                    root: {
                      device_type: {
                        $: {
                          key: r.MBLED
                        },
                        device: {
                          $: {
                            key: y
                          },
                          function: {
                            $: {
                              key: a.POLYMO_SHUTDOWN_EFFECT
                            },
                            profiles: {
                              setting: {
                                play_mode: v,
                                iscolorsynced: "0",
                                singlecolor: "1",
                                led_item: {
                                  led_colorr: h,
                                  led_colorg: m,
                                  led_colorb: g,
                                  led_speed: E,
                                  led_direction: _
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  M = d(T);
                Promise.resolve().then((function() {
                  var e = "".concat(c);
                  return logMessage.info("[".concat(u, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: M
                  })
                })).then((function(e) {
                  return l(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(u, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: f(e)
                    }
                  })
                }))
              }))
            }
          },
          setPolymoShutdownBIOSOff: function(e) {
            return function() {
              var t = this,
                o = "setPolymoShutdownBIOSOff";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  c = e.sessionKey,
                  y = e.modelNumber,
                  p = e.settings,
                  v = p.playMode,
                  h = p.ledColorR,
                  m = p.ledColorG,
                  g = p.ledColorB,
                  E = p.ledSpeed,
                  _ = p.ledDirection,
                  T = {
                    root: {
                      device_type: {
                        $: {
                          key: r.MBLED
                        },
                        device: {
                          $: {
                            key: y
                          },
                          function: {
                            $: {
                              key: a.SHUTDOWNEFFECT
                            },
                            profiles: {
                              setting: {
                                play_mode: v,
                                iscolorsynced: "0",
                                singlecolor: "1",
                                led_item: {
                                  led_colorr: h,
                                  led_colorg: m,
                                  led_colorb: g,
                                  led_speed: E,
                                  led_direction: _
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  M = d(T);
                Promise.resolve().then((function() {
                  var e = "".concat(c);
                  return logMessage.info("[".concat(u, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: M
                  })
                })).then((function(e) {
                  return l(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(u, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: f(e)
                    }
                  })
                }))
              }))
            }
          },
          setPolymoShutdownEffect: function(e) {
            return function() {
              var t = this,
                o = "setPolymoShutdownEffect";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  c = e.sessionKey,
                  y = e.modelNumber,
                  p = e.settings,
                  v = p.playMode,
                  h = p.ledColorR,
                  m = p.ledColorG,
                  g = p.ledColorB,
                  E = p.ledSpeed,
                  _ = p.ledDirection,
                  T = {
                    root: {
                      device_type: {
                        $: {
                          key: r.MBLED
                        },
                        device: {
                          $: {
                            key: y
                          },
                          function: {
                            $: {
                              key: a.POLYMO_SHUTDOWN_EFFECT
                            },
                            profiles: {
                              setting: {
                                play_mode: v,
                                iscolorsynced: "0",
                                singlecolor: "1",
                                led_item: {
                                  led_colorr: h,
                                  led_colorg: m,
                                  led_colorb: g,
                                  led_speed: E,
                                  led_direction: _
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  M = d(T);
                Promise.resolve().then((function() {
                  var e = "".concat(c);
                  return logMessage.info("[".concat(u, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: M
                  })
                })).then((function(e) {
                  return l(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(u, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: f(e)
                    }
                  })
                }))
              }))
            }
          },
          setPolymoShutdownRegionEffect: function(e) {
            return function() {
              var t = this,
                o = "setPolymoShutdownRegionEffect";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  c = e.sessionKey,
                  p = e.modelNumber,
                  v = e.settings,
                  h = v.ledCount,
                  m = v.playMode,
                  g = v.ledList,
                  E = {
                    root: {
                      device_type: {
                        $: {
                          key: r.MBLED
                        },
                        device: {
                          $: {
                            key: p
                          },
                          function: {
                            $: {
                              key: a.POLYMO_SHUTDOWN_EFFECT_CUSTOMIZED
                            },
                            profiles: {
                              setting: {
                                ledcount: h,
                                play_mode: m,
                                iscolorsynced: "0",
                                singlecolor: "1",
                                led: y(h, g)
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  _ = d(E);
                Promise.resolve().then((function() {
                  var e = "".concat(c);
                  return logMessage.info("[".concat(u, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: _
                  })
                })).then((function(e) {
                  return l(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(u, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: f(e)
                    }
                  })
                }))
              }))
            }
          },
          setPolymoLightingOff: function(e) {
            return function() {
              var t = this,
                o = "setPolymoLightingOff";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  c = e.sessionKey,
                  y = e.modelNumber,
                  p = e.settings,
                  v = p.playMode,
                  h = p.ledColorR,
                  m = p.ledColorG,
                  g = p.ledColorB,
                  E = p.ledSpeed,
                  _ = p.ledDirection,
                  T = {
                    root: {
                      device_type: {
                        $: {
                          key: r.MBLED
                        },
                        device: {
                          $: {
                            key: y
                          },
                          function: {
                            $: {
                              key: a.POLYMO_LIGHTING_EFFECT
                            },
                            profiles: {
                              setting: {
                                play_mode: v,
                                iscolorsynced: "0",
                                singlecolor: "1",
                                led_item: {
                                  led_colorr: h,
                                  led_colorg: m,
                                  led_colorb: g,
                                  led_speed: E,
                                  led_direction: _
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  M = d(T);
                Promise.resolve().then((function() {
                  var e = "".concat(c);
                  return logMessage.info("[".concat(u, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: M
                  })
                })).then((function(e) {
                  return l(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(u, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: f(e)
                    }
                  })
                }))
              }))
            }
          },
          setPolymoLightingEffect: function(e) {
            return function() {
              var t = this,
                o = "setPolymoLightingEffect";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  c = e.sessionKey,
                  y = e.modelNumber,
                  p = e.settings,
                  v = p.playMode,
                  h = p.ledColorR,
                  m = p.ledColorG,
                  g = p.ledColorB,
                  E = p.ledSpeed,
                  _ = p.ledDirection,
                  T = {
                    root: {
                      device_type: {
                        $: {
                          key: r.MBLED
                        },
                        device: {
                          $: {
                            key: y
                          },
                          function: {
                            $: {
                              key: a.POLYMO_LIGHTING_EFFECT
                            },
                            profiles: {
                              setting: {
                                play_mode: v,
                                iscolorsynced: "0",
                                singlecolor: "1",
                                led_item: {
                                  led_colorr: h,
                                  led_colorg: m,
                                  led_colorb: g,
                                  led_speed: E,
                                  led_direction: _
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  M = d(T);
                Promise.resolve().then((function() {
                  var e = "".concat(c);
                  return logMessage.info("[".concat(u, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: M
                  })
                })).then((function(e) {
                  return l(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(u, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: f(e)
                    }
                  })
                }))
              }))
            }
          },
          setPolymoLightingRegionEffect: function(e) {
            return function() {
              var t = this,
                o = "setPolymoLightingRegionEffect";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  c = e.sessionKey,
                  p = e.modelNumber,
                  v = e.settings,
                  h = v.ledCount,
                  m = v.playMode,
                  g = v.ledList,
                  E = {
                    root: {
                      device_type: {
                        $: {
                          key: r.MBLED
                        },
                        device: {
                          $: {
                            key: p
                          },
                          function: {
                            $: {
                              key: a.POLYMO_SHUTDOWN_EFFECT_CUSTOMIZED
                            },
                            profiles: {
                              setting: {
                                ledcount: h,
                                play_mode: m,
                                iscolorsynced: "0",
                                singlecolor: "1",
                                led: y(h, g)
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  _ = d(E);
                Promise.resolve().then((function() {
                  var e = "".concat(c);
                  return logMessage.info("[".concat(u, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: _
                  })
                })).then((function(e) {
                  return l(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(u, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: f(e)
                    }
                  })
                }))
              }))
            }
          }
        }
      },
      32: function(e, t, o) {
        var n = this && this.__importDefault || function(e) {
          return e && e.__esModule ? e : {
            default: e
          }
        };
        Object.defineProperty(t, "__esModule", {
          value: !0
        });
        var s = n(o(79)),
          i = n(o(363)),
          r = s.default.peripheralDevice,
          c = s.default.deviceNameMapping,
          a = i.default.functionNumber,
          u = c[r.MBLED] || r.MBLED,
          d = utility.parseJSON2XML,
          l = utility.parseXML2JSON,
          f = utility.parseErrorCode;
        t.default = {
          getPowerSavingQuery: function(e) {
            return function() {
              var t = this,
                o = "getPowerSavingQuery";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  c = e.sessionKey,
                  y = e.modelNumber,
                  p = {
                    root: {
                      device_type: {
                        $: {
                          key: r.MBLED
                        },
                        device: {
                          $: {
                            key: y
                          },
                          function: {
                            $: {
                              key: a.POWERSAVING_QUERY
                            }
                          }
                        }
                      }
                    }
                  },
                  v = d(p);
                Promise.resolve().then((function() {
                  var e = "".concat(c);
                  return logMessage.info("[".concat(u, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: v
                  })
                })).then((function(e) {
                  return l(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(u, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: f(e)
                    }
                  })
                }))
              }))
            }
          },
          setAioc: function(e) {
            return function() {
              var t = this,
                o = "setAioc";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  c = e.sessionKey,
                  y = e.modelNumber,
                  p = e.settings.status,
                  v = {
                    root: {
                      device_type: {
                        $: {
                          key: r.MBLED
                        },
                        device: {
                          $: {
                            key: y
                          },
                          function: {
                            $: {
                              key: a.POWERSAVING_AIOC
                            },
                            aioverclocking: {
                              status: p
                            }
                          }
                        }
                      }
                    }
                  },
                  h = d(v);
                Promise.resolve().then((function() {
                  var e = "".concat(c);
                  return logMessage.info("[".concat(u, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: h
                  })
                })).then((function(e) {
                  return l(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(u, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: f(e)
                    }
                  })
                }))
              }))
            }
          },
          setPowersaving: function(e) {
            return function() {
              var t = this,
                o = "setPowersaving";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  c = e.sessionKey,
                  y = e.modelNumber,
                  p = e.settings.status,
                  v = {
                    root: {
                      device_type: {
                        $: {
                          key: r.MBLED
                        },
                        device: {
                          $: {
                            key: y
                          },
                          function: {
                            $: {
                              key: a.POWERSAVING_POWERSAVING
                            },
                            powersaving: {
                              status: p
                            }
                          }
                        }
                      }
                    }
                  },
                  h = d(v);
                Promise.resolve().then((function() {
                  var e = "".concat(c);
                  return logMessage.info("[".concat(u, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: h
                  })
                })).then((function(e) {
                  return l(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(u, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: f(e)
                    }
                  })
                }))
              }))
            }
          },
          setPowersavingItems: function(e) {
            return function() {
              var t = this,
                o = "setPowersavingItems";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  c = e.sessionKey,
                  y = e.modelNumber,
                  p = e.settings,
                  v = p.cpupptStatus,
                  h = p.offoledStatus,
                  m = p.effectdarkStatus,
                  g = p.fanStatus,
                  E = p.powerschemeStatus,
                  _ = {
                    root: {
                      device_type: {
                        $: {
                          key: r.MBLED
                        },
                        device: {
                          $: {
                            key: y
                          },
                          function: {
                            $: {
                              key: a.POWERSAVING_POWERSAVINGITEMS
                            },
                            cpuppt: {
                              status: v
                            },
                            offoled: {
                              status: h
                            },
                            effectdark: {
                              status: m
                            },
                            fan: {
                              status: g
                            },
                            powerscheme: {
                              status: E
                            }
                          }
                        }
                      }
                    }
                  },
                  T = d(_);
                Promise.resolve().then((function() {
                  var e = "".concat(c);
                  return logMessage.info("[".concat(u, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: T
                  })
                })).then((function(e) {
                  return l(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(u, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: f(e)
                    }
                  })
                }))
              }))
            }
          },
          setCpuwatt: function(e) {
            return function() {
              var t = this,
                o = "setCpuwatt";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  c = e.sessionKey,
                  y = e.modelNumber,
                  p = e.settings.status,
                  v = {
                    root: {
                      device_type: {
                        $: {
                          key: r.MBLED
                        },
                        device: {
                          $: {
                            key: y
                          },
                          function: {
                            $: {
                              key: a.POWERSAVING_CPUWATT
                            },
                            cpuwatt: {
                              status: p
                            }
                          }
                        }
                      }
                    }
                  },
                  h = d(v);
                Promise.resolve().then((function() {
                  var e = "".concat(c);
                  return logMessage.info("[".concat(u, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: h
                  })
                })).then((function(e) {
                  return l(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(u, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: f(e)
                    }
                  })
                }))
              }))
            }
          },
          setSettings: function(e) {
            return function() {
              var t = this,
                o = "setSettings";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  c = e.sessionKey,
                  y = e.modelNumber,
                  p = {
                    root: {
                      device_type: {
                        $: {
                          key: r.MBLED
                        },
                        device: {
                          $: {
                            key: y
                          },
                          function: {
                            $: {
                              key: a.POWERSAVING_SETTINGS
                            }
                          }
                        }
                      }
                    }
                  },
                  v = d(p);
                Promise.resolve().then((function() {
                  var e = "".concat(c);
                  return logMessage.info("[".concat(u, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: v
                  })
                })).then((function(e) {
                  return l(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(u, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: f(e)
                    }
                  })
                }))
              }))
            }
          }
        }
      },
      232: function(e, t, o) {
        var n = this && this.__importDefault || function(e) {
          return e && e.__esModule ? e : {
            default: e
          }
        };
        Object.defineProperty(t, "__esModule", {
          value: !0
        });
        var s = n(o(79)),
          i = n(o(363)),
          r = s.default.peripheralDevice,
          c = s.default.deviceNameMapping,
          a = i.default.functionNumber,
          u = i.default.rgbheaderNumber,
          d = c[r.MBLED] || r.MBLED,
          l = utility.parseJSON2XML,
          f = utility.parseXML2JSON,
          y = utility.parseErrorCode;
        t.default = {
          setColor: function(e) {
            return function() {
              var t = this,
                o = "setColor";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  c = e.sessionKey,
                  p = e.modelNumber,
                  v = e.settings,
                  h = v.key,
                  m = v.color,
                  g = v.hue,
                  E = v.saturation,
                  _ = v.lightness,
                  T = {
                    root: {
                      device_type: {
                        $: {
                          key: r.MBLED
                        },
                        device: {
                          $: {
                            key: p
                          },
                          function: {
                            $: {
                              key: a.RGBHEADER_CALIBRATION
                            },
                            profiles: {
                              version: "1.2",
                              funcid: u.SETCOLOR,
                              device: {
                                $: {
                                  key: "Mainboard"
                                },
                                mode: {
                                  $: {
                                    key: "1"
                                  },
                                  led: {
                                    $: {
                                      key: h
                                    },
                                    color: m,
                                    hue: g,
                                    saturation: E,
                                    lightness: _
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  M = l(T);
                Promise.resolve().then((function() {
                  var e = "".concat(c);
                  return logMessage.info("[".concat(d, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: M
                  })
                })).then((function(e) {
                  return f(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(d, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: y(e)
                    }
                  })
                }))
              }))
            }
          },
          setCalibration: function(e) {
            return function() {
              var t = this,
                o = "setCalibration";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  c = e.sessionKey,
                  p = e.modelNumber,
                  v = e.settings,
                  h = v.key,
                  m = v.calibrationKey,
                  g = {
                    root: {
                      device_type: {
                        $: {
                          key: r.MBLED
                        },
                        device: {
                          $: {
                            key: p
                          },
                          function: {
                            $: {
                              key: a.RGBHEADER_CALIBRATION
                            },
                            profiles: {
                              version: "1.2",
                              funcid: u.CALIBRATION,
                              device: {
                                $: {
                                  key: "Mainboard"
                                },
                                led: {
                                  $: {
                                    key: h
                                  },
                                  _: m
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  E = l(g);
                Promise.resolve().then((function() {
                  var e = "".concat(c);
                  return logMessage.info("[".concat(d, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: E
                  })
                })).then((function(e) {
                  return f(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(d, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: y(e)
                    }
                  })
                }))
              }))
            }
          }
        }
      },
      873: function(e, t, o) {
        var n, s = this && this.__extends || (n = function(e, t) {
            return n = Object.setPrototypeOf || {
              __proto__: []
            }
            instanceof Array && function(e, t) {
              e.__proto__ = t
            } || function(e, t) {
              for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o])
            }, n(e, t)
          }, function(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");

            function o() {
              this.constructor = e
            }
            n(e, t), e.prototype = null === t ? Object.create(t) : (o.prototype = t.prototype, new o)
          }),
          i = this && this.__assign || function() {
            return i = Object.assign || function(e) {
              for (var t, o = 1, n = arguments.length; o < n; o++)
                for (var s in t = arguments[o]) Object.prototype.hasOwnProperty.call(t, s) && (e[s] = t[s]);
              return e
            }, i.apply(this, arguments)
          },
          r = this && this.__importDefault || function(e) {
            return e && e.__esModule ? e : {
              default: e
            }
          };
        Object.defineProperty(t, "__esModule", {
          value: !0
        });
        var c = r(o(200)),
          a = r(o(509)),
          u = r(o(341)),
          d = r(o(737)),
          l = r(o(232)),
          f = r(o(801)),
          y = r(o(854)),
          p = r(o(799)),
          v = r(o(612)),
          h = r(o(604)),
          m = r(o(32)),
          g = r(o(79)),
          E = (utility.readINI, g.default.peripheralDevice),
          _ = g.default.deviceNameMapping[E.MBLED] || E.MBLED,
          T = function(e) {
            function t(t) {
              var o = e.call(this, t) || this;
              return o.setURL([{
                method: "get",
                url: "/api/:version/type/:deviceType/model/:modelNumber/sonicStudio/:resource/:id?",
                timeout: 6e4
              }, {
                method: "put",
                url: "/api/:version/type/:deviceType/model/:modelNumber/sonicStudio/:resource/:id?",
                timeout: 3e4
              }, {
                method: "get",
                url: "/api/:version/type/:deviceType/model/:modelNumber/:resource/:id?",
                timeout: 3e4
              }, {
                method: "put",
                url: "/api/:version/type/:deviceType/model/:modelNumber/:resource/:id?",
                timeout: 3e4
              }, {
                method: "post",
                url: "/api/:version/type/:deviceType/model/:modelNumber/:resource?",
                timeout: 3e4
              }, {
                method: "patch",
                url: "/api/:version/type/:deviceType/model/:modelNumber/:resource/:id?",
                timeout: 3e4
              }, {
                method: "delete",
                url: "/api/:version/type/:deviceType/model/:modelNumber/:resource/:id?",
                timeout: 3e4
              }]), o
            }
            return s(t, e), t.prototype.initSDK = function(e) {
              return (0, this.processManager.dispatch)(c.default.initializeAlertPage(e))
            }, t.prototype.transferRequest = function(e) {
              var t = this,
                o = this.state,
                n = o.deviceType,
                s = o.processingPool,
                r = e.sessionKey,
                c = e.request;
              if (c) {
                var a = c.method,
                  u = c.params.resource;
                logMessage.info("[".concat(_, "]"), "[".concat(a, "]"), "".concat(u, "."))(n)
              }
              s.push(i(i({}, e), {
                timestamp: (new Date).getTime()
              })), Promise.resolve().then((function() {
                return t.routingResource(e)
              })).then((function(e) {
                var o = e || {},
                  n = o.status,
                  s = void 0 === n ? 500 : n,
                  i = o.payload;
                t.dispatchResolve(r, s, i)
              })).catch((function(e) {
                var o = e || {},
                  n = o.status,
                  s = void 0 === n ? 404 : n,
                  i = o.payload;
                t.dispatchResolve(r, s, i)
              }))
            }, t.prototype.routingResource = function(e) {
              var t = e.sessionKey,
                o = e.request,
                n = this.state.deviceType;
              if (!o) return {
                status: 404
              };
              var s = o.method,
                i = o.params,
                r = o.body,
                a = o.baseUrl,
                u = i.modelNumber,
                d = i.resource,
                l = i.id,
                f = this.processManager.dispatch,
                y = s.toLowerCase(),
                p = r.data;
              if (-1 !== a.indexOf("sonicStudio")) {
                var v = o.params,
                  h = v.modelNumber,
                  m = v.resource,
                  g = v.id;
                switch (y) {
                  case "get":
                    return this.getSonicStudio(t, h, m, g);
                  case "put":
                    var E = o.body.data;
                    return this.setSonicStudio(t, h, m, E)
                }
              }
              switch (d) {
                case "initialize":
                  if ("get" === y) return "alertPage" === l ? this.initializeAlertPage(t, u) : this.initialize(t, u, l);
                case "query":
                  if ("get" === y) return this.query(t, u);
                case "queryFast":
                  if ("get" === y) return this.queryFast(t, u);
                case "profile":
                  if ("get" === y) return this.getProfile(t, u, l);
                case "lighting":
                  if ("put" === y) {
                    var _ = o.body.data;
                    return this.setLighting(t, u, l, _)
                  }
                  break;
                case "polymo":
                  if ("put" === y) {
                    var T = o.body.data;
                    return this.setPolymo(t, u, l, T)
                  }
                  break;
                case "addressableHeader":
                  if ("put" === y) {
                    var M = o.body.data;
                    return this.setAddressableHeader(t, u, l, M)
                  }
                  break;
                case "rgbHeader":
                  if ("put" === y) {
                    var N = o.body.data;
                    return this.setRGBHeader(t, u, l, N)
                  }
                  break;
                case "aiMic":
                  switch (y) {
                    case "get":
                      return this.getAiMic(t, u);
                    case "put":
                      var P = o.body.data;
                      return this.setAiMic(t, u, l, P)
                  }
                  break;
                case "hydranode":
                  if ("put" === y) {
                    var O = o.body.data;
                    return this.setHydranode(t, u, l, O)
                  }
                  break;
                case "matrix":
                  if ("put" === y) {
                    var D = o.body.data;
                    return this.setMatrix(t, u, l, D)
                  }
                  break;
                case "wifiAntenna":
                  switch (y) {
                    case "get":
                      return this.getWifiAntenna(t, u);
                    case "put":
                      var S = o.body.data;
                      return this.setWifiAntenna(t, u, l, S)
                  }
                  break;
                case "powersaving":
                  switch (y) {
                    case "get":
                      return this.getPowerSaving(t, u);
                    case "put":
                      var I = o.body.data;
                      return this.setPowerSaving(t, u, l, I)
                  }
                  break;
                case "externalFiles":
                  switch (y) {
                    case "delete":
                      return f(c.default.deleteExternalImage({
                        deviceType: n,
                        sessionKey: t,
                        modelNumber: u,
                        settings: p
                      }));
                    case "get":
                      var C = decodeURIComponent(atob(l));
                      return f(c.default.getExternalImage({
                        deviceType: n,
                        sessionKey: t,
                        modelNumber: u
                      }, C))
                  }
                  break;
                default:
                  return "post" === y ? this.bypassRequest(t, o) : {
                    status: 404
                  }
              }
            }, t.prototype.initialize = function(e, t, o) {
              var n = this.state.deviceType,
                s = this.processManager.dispatch,
                i = {
                  deviceType: n,
                  sessionKey: e,
                  modelNumber: t,
                  id: o
                };
              return Promise.resolve().then((function() {
                return s(c.default.initialize(i, o))
              }))
            }, t.prototype.initializeAlertPage = function(e, t) {
              var o = this.state.deviceType,
                n = this.processManager.dispatch,
                s = {
                  deviceType: o,
                  sessionKey: e,
                  modelNumber: t
                };
              return Promise.resolve().then((function() {
                return n(c.default.initializeAlertPage(s))
              }))
            }, t.prototype.query = function(e, t) {
              var o = this.state.deviceType,
                n = this.processManager.dispatch;
              return Promise.resolve().then((function() {
                return n(c.default.query({
                  deviceType: o,
                  sessionKey: e,
                  modelNumber: t
                }))
              }))
            }, t.prototype.queryFast = function(e, t) {
              var o = this.state.deviceType,
                n = this.processManager.dispatch;
              return Promise.resolve().then((function() {
                return n(c.default.queryFast({
                  deviceType: o,
                  sessionKey: e,
                  modelNumber: t
                }))
              }))
            }, t.prototype.getProfile = function(e, t, o) {
              var n = this.state.deviceType,
                s = this.processManager.dispatch;
              return Promise.resolve().then((function() {
                return s(c.default.getProfile({
                  deviceType: n,
                  sessionKey: e,
                  modelNumber: t,
                  profileID: o
                }))
              }))
            }, t.prototype.setLighting = function(e, t, o, n) {
              var s = this.state.deviceType,
                i = this.processManager.dispatch,
                r = {
                  deviceType: s,
                  sessionKey: e,
                  modelNumber: t,
                  settings: n
                };
              return Promise.resolve().then((function() {
                switch (o) {
                  case "setLightingOff":
                    return i(a.default.setLightingOff(r));
                  case "setLightingEffect":
                    return i(a.default.setLightingEffect(r));
                  case "setRegionEffect":
                    return i(a.default.setRegionEffect(r))
                }
              }))
            }, t.prototype.setPolymo = function(e, t, o, n) {
              var s = this.state.deviceType,
                i = this.processManager.dispatch,
                r = {
                  deviceType: s,
                  sessionKey: e,
                  modelNumber: t,
                  settings: n
                };
              return Promise.resolve().then((function() {
                switch (o) {
                  case "polymoShutdownOff":
                    return i(u.default.setPolymoShutdownOff(r));
                  case "polymoShutdownBIOSOff":
                    return i(u.default.setPolymoShutdownBIOSOff(r));
                  case "polymoShutdownEffect":
                    return i(u.default.setPolymoShutdownEffect(r));
                  case "polymoShutdownRegionEffect":
                    return i(u.default.setPolymoShutdownRegionEffect(r));
                  case "polymoLightingOff":
                    return i(u.default.setPolymoLightingOff(r));
                  case "polymoLightingEffect":
                    return i(u.default.setPolymoLightingEffect(r));
                  case "polymoLightingRegionEffect":
                    return i(u.default.setPolymoLightingRegionEffect(r))
                }
              }))
            }, t.prototype.setAddressableHeader = function(e, t, o, n) {
              var s = this.state.deviceType,
                i = this.processManager.dispatch,
                r = {
                  deviceType: s,
                  sessionKey: e,
                  modelNumber: t,
                  settings: n
                };
              return Promise.resolve().then((function() {
                switch (o) {
                  case "setLEDCount":
                    return i(d.default.setLEDCount(r));
                  case "setRescanHeaderMode":
                    return i(d.default.setRescanHeaderMode(r))
                }
              }))
            }, t.prototype.setRGBHeader = function(e, t, o, n) {
              var s = this.state.deviceType,
                i = this.processManager.dispatch,
                r = {
                  deviceType: s,
                  sessionKey: e,
                  modelNumber: t,
                  settings: n
                };
              return Promise.resolve().then((function() {
                switch (o) {
                  case "setColor":
                    return i(l.default.setColor(r));
                  case "setCalibration":
                    return i(l.default.setCalibration(r))
                }
              }))
            }, t.prototype.getAiMic = function(e, t) {
              var o = this.state.deviceType,
                n = this.processManager.dispatch,
                s = {
                  deviceType: o,
                  sessionKey: e,
                  modelNumber: t
                };
              return Promise.resolve().then((function() {
                return n(f.default.getAiMicQuery(s))
              }))
            }, t.prototype.setAiMic = function(e, t, o, n) {
              var s = this.state.deviceType,
                i = this.processManager.dispatch,
                r = {
                  deviceType: s,
                  sessionKey: e,
                  modelNumber: t,
                  settings: n
                };
              return Promise.resolve().then((function() {
                switch (o) {
                  case "setDefault":
                    return i(f.default.setDefault(r));
                  case "setMuteNoise":
                    return i(f.default.setMuteNoise(r));
                  case "setAiMicDevice":
                    return i(f.default.setAiMicDevice(r));
                  case "setAiMicNRLevel":
                    return i(f.default.setAiMicNRLevel(r))
                }
              }))
            }, t.prototype.setHydranode = function(e, t, o, n) {
              var s = this.state.deviceType,
                i = this.processManager.dispatch,
                r = {
                  deviceType: s,
                  sessionKey: e,
                  modelNumber: t,
                  settings: n
                };
              return Promise.resolve().then((function() {
                switch (o) {
                  case "getDynamicInfo":
                    return i(y.default.getDynamicInfo(r));
                  case "getUsingTime":
                    return i(y.default.getUsingTime(r));
                  case "setLightingEffect":
                    return i(y.default.setLightingEffect(r));
                  case "setResetFan":
                    return i(y.default.setResetFan(r))
                }
              }))
            }, t.prototype.setMatrix = function(e, t, o, n) {
              var s = this.state.deviceType,
                i = this.processManager.dispatch,
                r = {
                  deviceType: s,
                  sessionKey: e,
                  modelNumber: t,
                  settings: n
                };
              return Promise.resolve().then((function() {
                switch (o) {
                  case "setSwitchMatrix":
                    return i(p.default.setSwitchMatrix(r));
                  case "setMatrixSave":
                    return i(p.default.setMatrixSave(r));
                  case "setAuraSyncMode":
                    return i(p.default.setAuraSyncMode(r));
                  case "setCustomEffect":
                    return i(p.default.setCustomEffect(r))
                }
              }))
            }, t.prototype.getWifiAntenna = function(e, t) {
              var o = this.state.deviceType,
                n = this.processManager.dispatch,
                s = {
                  deviceType: o,
                  sessionKey: e,
                  modelNumber: t
                };
              return Promise.resolve().then((function() {
                return n(v.default.getLocation(s))
              }))
            }, t.prototype.setWifiAntenna = function(e, t, o, n) {
              var s = this.state.deviceType,
                i = this.processManager.dispatch,
                r = {
                  deviceType: s,
                  sessionKey: e,
                  modelNumber: t,
                  settings: n
                };
              return Promise.resolve().then((function() {
                switch (o) {
                  case "quickCheck":
                    return i(v.default.setQuickCheck(r));
                  case "directionFinder":
                    return i(v.default.setDirectionFinder(r));
                  case "reset":
                    return i(v.default.setReset(r));
                  case "trafficMonitor":
                    return i(v.default.setTrafficMonitor(r));
                  case "trafficMonitorOptimization":
                    return i(v.default.setTrafficMonitorOptimization(r));
                  case "trafficMonitorLogin":
                    return i(v.default.setTrafficMonitorLogin(r));
                  case "trafficLocationOn":
                    return i(v.default.setTrafficLocationOn(r));
                  case "smartNotify":
                    return i(v.default.setSmartNotify(r));
                  case "mlo":
                    return i(v.default.setMLO(r))
                }
              }))
            }, t.prototype.getSonicStudio = function(e, t, o, n) {
              var s = this.state.deviceType,
                i = this.processManager.dispatch,
                r = {
                  deviceType: s,
                  sessionKey: e,
                  modelNumber: t,
                  settings: n
                };
              switch (o) {
                case "devices":
                  return i(h.default.query(r));
                case "globalEnable":
                  return i(h.default.getGlobalEnable(r));
                case "systemVolume":
                  return i(h.default.getSystemVolume(r));
                case "directMonitor":
                  return i(h.default.getDirectMonitor(r));
                case "mute":
                  return i(h.default.getMute(r));
                case "appRoutingPower":
                  return i(h.default.getAppRoutingPower(r));
                case "apps":
                  return i(h.default.queryApps(r))
              }
            }, t.prototype.setSonicStudio = function(e, t, o, n) {
              var s = this.state.deviceType,
                i = this.processManager.dispatch,
                r = {
                  deviceType: s,
                  sessionKey: e,
                  modelNumber: t,
                  settings: n
                };
              switch (o) {
                case "presetList":
                  return i(h.default.getPresetList(r));
                case "presetDetail":
                  return i(h.default.getPresetDetail(r));
                case "defaultDevice":
                  return i(h.default.setDefaultDevice(r));
                case "renderEffectPower":
                  return i(h.default.setRenderEffectPower(r));
                case "voiceClarity":
                  return i(h.default.setVoiceClarity(r));
                case "smartVolume":
                  return i(h.default.setSmartVolume(r));
                case "treble":
                  return i(h.default.setTreble(r));
                case "bass":
                  return i(h.default.setBass(r));
                case "surround":
                  return i(h.default.setSurround(r));
                case "reverb":
                  return i(h.default.setReverb(r));
                case "playbackEQ":
                  return i(h.default.setPlaybackEQ(r));
                case "presetReset":
                  return i(h.default.setPresetReset(r));
                case "captureEffectPower":
                  return i(h.default.setCaptureEffectPower(r));
                case "noiseReduction":
                  return i(h.default.setNoiseReduction(r));
                case "volumeStabilizer":
                  return i(h.default.setVolumeStabilizer(r));
                case "recordEQ":
                  return i(h.default.setRecordEQ(r));
                case "globalEnable":
                  return i(h.default.setGlobalEnable(r));
                case "mute":
                  return i(h.default.setMute(r));
                case "systemVolume":
                  return i(h.default.setSystemVolume(r));
                case "directMonitor":
                  return i(h.default.setDirectMonitor(r));
                case "startRecordMeterData":
                  return i(h.default.startRecordMeterData(r));
                case "stopRecordMeterData":
                  return i(h.default.stopRecordMeterData(r));
                case "appRoutingPower":
                  return i(h.default.setAppRoutingPower(r));
                case "appRoutingDevice":
                  return i(h.default.setAppRoutingDevice(r));
                case "allowProcessing":
                  return i(h.default.setAllowProcessing(r))
              }
            }, t.prototype.getPowerSaving = function(e, t) {
              var o = this.state.deviceType,
                n = this.processManager.dispatch,
                s = {
                  deviceType: o,
                  sessionKey: e,
                  modelNumber: t
                };
              return Promise.resolve().then((function() {
                return n(m.default.getPowerSavingQuery(s))
              }))
            }, t.prototype.setPowerSaving = function(e, t, o, n) {
              var s = this.state.deviceType,
                i = this.processManager.dispatch,
                r = {
                  deviceType: s,
                  sessionKey: e,
                  modelNumber: t,
                  settings: n
                };
              return Promise.resolve().then((function() {
                switch (o) {
                  case "aioc":
                    return i(m.default.setAioc(r));
                  case "powersaving":
                    return i(m.default.setPowersaving(r));
                  case "powersavingItems":
                    return i(m.default.setPowersavingItems(r));
                  case "cpuwatt":
                    return i(m.default.setCpuwatt(r));
                  case "settings":
                    return i(m.default.setSettings(r))
                }
              }))
            }, t.prototype.bypassRequest = function(e, t) {
              var o = this,
                n = this.state.deviceType,
                s = t,
                i = s.method,
                r = s.files,
                c = i.toLowerCase(),
                a = "";
              if ("post" === c && r) {
                var u = Buffer.alloc(0);
                Object.values(r).forEach((function(e) {
                  u = Buffer.concat([u, e.buffer])
                })), u = Buffer.concat([u, Buffer.alloc(1)]), a = Buffer.from(u).toString("utf16le")
              }
              return Promise.resolve().then((function() {
                return o.processManager.send({
                  method: c,
                  deviceType: n,
                  sessionKey: e,
                  xml: a
                })
              }))
            }, t
          }(BaseRouter);
        t.default = function(e) {
          return new T({
            processManager: e,
            deviceType: E.MBLED,
            maxQueue: 3,
            timeout: 6e5
          })
        }
      },
      604: function(e, t, o) {
        var n = this && this.__assign || function() {
            return n = Object.assign || function(e) {
              for (var t, o = 1, n = arguments.length; o < n; o++)
                for (var s in t = arguments[o]) Object.prototype.hasOwnProperty.call(t, s) && (e[s] = t[s]);
              return e
            }, n.apply(this, arguments)
          },
          s = this && this.__spreadArray || function(e, t, o) {
            if (o || 2 === arguments.length)
              for (var n, s = 0, i = t.length; s < i; s++) !n && s in t || (n || (n = Array.prototype.slice.call(t, 0, s)), n[s] = t[s]);
            return e.concat(n || Array.prototype.slice.call(t))
          },
          i = this && this.__importDefault || function(e) {
            return e && e.__esModule ? e : {
              default: e
            }
          };
        Object.defineProperty(t, "__esModule", {
          value: !0
        });
        var r = i(o(79)),
          c = i(o(363)),
          a = r.default.peripheralDevice,
          u = r.default.deviceNameMapping,
          d = c.default.functionNumber,
          l = c.default.sonicStudioNumber,
          f = c.default.sonicStudioDeviceType,
          y = f.PLYABACK_DEVICE,
          p = f.RECORD_DEVICE,
          v = f.ALL_DEVICE,
          h = u[a.MBLED] || a.MBLED,
          m = utility.parseJSON2XML,
          g = utility.parseXML2JSON,
          E = utility.parseErrorCode,
          _ = function(e) {
            var t, o, n = null;
            return null !== (o = null === (t = null == (n = Array.isArray(e) ? e.find((function(e) {
              return "1" === e.isdefault
            })) || e[0] : e) ? void 0 : n.$) || void 0 === t ? void 0 : t.key) && void 0 !== o ? o : null
          },
          T = function(e) {
            return function() {
              var t = this,
                o = "getPresetList";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  r = e.sessionKey,
                  c = e.modelNumber,
                  u = e.settings,
                  f = u.devicetype,
                  y = u.device,
                  p = {
                    root: {
                      device_type: {
                        $: {
                          key: a.MBLED
                        },
                        device: {
                          $: {
                            key: c
                          },
                          function: {
                            $: {
                              key: d.SONICSTUDIO
                            },
                            ssfunc: {
                              $: {
                                key: l.QUERY_PRESET
                              },
                              devicetype: f,
                              device: y
                            }
                          }
                        }
                      }
                    }
                  },
                  v = m(p);
                Promise.resolve().then((function() {
                  var e = "".concat(r);
                  return logMessage.info("[".concat(h, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: v
                  })
                })).then((function(e) {
                  return g(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(h, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: E(e)
                    }
                  })
                }))
              }))
            }
          },
          M = function(e) {
            return function() {
              var t = this,
                o = "getPresetDetail";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  r = e.sessionKey,
                  c = e.modelNumber,
                  u = e.settings,
                  f = u.devicetype,
                  y = u.device,
                  p = u.preset,
                  v = {
                    root: {
                      device_type: {
                        $: {
                          key: a.MBLED
                        },
                        device: {
                          $: {
                            key: c
                          },
                          function: {
                            $: {
                              key: d.SONICSTUDIO
                            },
                            ssfunc: {
                              $: {
                                key: l.QUERY_PRESET_DETAIL
                              },
                              devicetype: f,
                              device: y,
                              preset: p
                            }
                          }
                        }
                      }
                    }
                  },
                  _ = m(v);
                Promise.resolve().then((function() {
                  var e = "".concat(r);
                  return logMessage.info("[".concat(h, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: _
                  })
                })).then((function(e) {
                  return g(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(h, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: E(e)
                    }
                  })
                }))
              }))
            }
          },
          N = function(e, t) {
            return function() {
              var o = this,
                n = "getDeviceInfo",
                i = t.renderdevicelist,
                r = t.capturedevicelist,
                c = [{
                  $: {
                    key: l.GET_GLOBALENABLE
                  }
                }, {
                  $: {
                    key: l.QUERY_APPS
                  },
                  devicetype: y
                }];
              return i && c.push({
                $: {
                  key: l.GET_MUTE
                },
                devicetype: y
              }, {
                $: {
                  key: l.GET_SYSTEMVOLUME
                }
              }, {
                $: {
                  key: l.GET_APPROUTING_ONOFF
                },
                devicetype: y
              }), r && c.push({
                $: {
                  key: l.GET_MUTE
                },
                devicetype: p
              }, {
                $: {
                  key: l.GET_DIRECTMONITOR
                }
              }, {
                $: {
                  key: l.GET_APPROUTING_ONOFF
                },
                devicetype: p
              }), new Promise((function(t, i) {
                var r = e.deviceType,
                  u = e.sessionKey,
                  l = e.modelNumber,
                  f = {
                    root: {
                      device_type: {
                        $: {
                          key: a.MBLED
                        },
                        device: {
                          $: {
                            key: l
                          },
                          function: {
                            $: {
                              key: d.SONICSTUDIO
                            },
                            ssfunc: s([], c, !0)
                          }
                        }
                      }
                    }
                  },
                  y = m(f);
                Promise.resolve().then((function() {
                  var e = "".concat(u);
                  return logMessage.info("[".concat(h, "]"), "".concat(n))(r), o.send({
                    method: "post",
                    deviceType: r,
                    sessionKey: e,
                    xml: y
                  })
                })).then((function(e) {
                  return g(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(h, "]"), "".concat(n, " successful."))(r), t({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  i({
                    status: 500,
                    payload: {
                      errorCode: E(e)
                    }
                  })
                }))
              }))
            }
          },
          P = function(e) {
            return function() {
              var t = this,
                o = "getRenderEffectPower";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  r = e.sessionKey,
                  c = e.modelNumber,
                  u = e.settings.device,
                  f = {
                    root: {
                      device_type: {
                        $: {
                          key: a.MBLED
                        },
                        device: {
                          $: {
                            key: c
                          },
                          function: {
                            $: {
                              key: d.SONICSTUDIO
                            },
                            ssfunc: {
                              $: {
                                key: l.GET_RENDER_ONOFF
                              },
                              device: u
                            }
                          }
                        }
                      }
                    }
                  },
                  y = m(f);
                Promise.resolve().then((function() {
                  var e = "".concat(r);
                  return logMessage.info("[".concat(h, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: y
                  })
                })).then((function(e) {
                  return g(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(h, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: E(e)
                    }
                  })
                }))
              }))
            }
          },
          O = function(e) {
            return function() {
              var t = this,
                o = "getCaptureEffectPower";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  r = e.sessionKey,
                  c = e.modelNumber,
                  u = e.settings.device,
                  f = {
                    root: {
                      device_type: {
                        $: {
                          key: a.MBLED
                        },
                        device: {
                          $: {
                            key: c
                          },
                          function: {
                            $: {
                              key: d.SONICSTUDIO
                            },
                            ssfunc: {
                              $: {
                                key: l.GET_CAPTURE_ONOFF
                              },
                              device: u
                            }
                          }
                        }
                      }
                    }
                  },
                  y = m(f);
                Promise.resolve().then((function() {
                  var e = "".concat(r);
                  return logMessage.info("[".concat(h, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: y
                  })
                })).then((function(e) {
                  return g(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(h, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: E(e)
                    }
                  })
                }))
              }))
            }
          },
          D = function(e) {
            return function() {
              var t = this,
                o = "getAllowProcessing";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  r = e.sessionKey,
                  c = e.modelNumber,
                  u = e.settings,
                  f = u.devicetype,
                  y = u.device,
                  p = {
                    root: {
                      device_type: {
                        $: {
                          key: a.MBLED
                        },
                        device: {
                          $: {
                            key: c
                          },
                          function: {
                            $: {
                              key: d.SONICSTUDIO
                            },
                            ssfunc: {
                              $: {
                                key: l.GET_ALLOW_PROCESSING
                              },
                              devicetype: f,
                              device: y
                            }
                          }
                        }
                      }
                    }
                  },
                  v = m(p);
                Promise.resolve().then((function() {
                  var e = "".concat(r);
                  return logMessage.info("[".concat(h, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: v
                  })
                })).then((function(e) {
                  return g(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(h, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: E(e)
                    }
                  })
                }))
              }))
            }
          };
        t.default = {
          query: function(e) {
            return function() {
              var t = this,
                o = "query";
              return new Promise((function(s, i) {
                var r = e.deviceType,
                  c = e.sessionKey,
                  u = e.modelNumber,
                  f = e.settings,
                  S = {},
                  I = {
                    deviceType: r,
                    sessionKey: c,
                    modelNumber: u,
                    settings: {
                      renderDefaultEndPoint: "",
                      captureDefaultEndPoint: ""
                    }
                  };
                logMessage.info("[".concat(h, "]"), "".concat(o, " start."))(r), Promise.resolve().then((function() {
                  return Promise.resolve().then((function() {
                    return t.dispatch(function(e) {
                      return function() {
                        var t = this,
                          o = "queryDevice";
                        return new Promise((function(n, s) {
                          var i = e.deviceType,
                            r = e.sessionKey,
                            c = e.modelNumber,
                            u = {
                              root: {
                                device_type: {
                                  $: {
                                    key: a.MBLED
                                  },
                                  device: {
                                    $: {
                                      key: c
                                    },
                                    function: {
                                      $: {
                                        key: d.SONICSTUDIO
                                      },
                                      ssfunc: {
                                        $: {
                                          key: l.QUERY_DEVICE
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            },
                            f = m(u);
                          Promise.resolve().then((function() {
                            var e = "".concat(r);
                            return logMessage.info("[".concat(h, "]"), "".concat(o))(i), t.send({
                              method: "post",
                              deviceType: i,
                              sessionKey: e,
                              xml: f
                            })
                          })).then((function(e) {
                            return g(e.payload)
                          })).then((function(e) {
                            logMessage.info("[".concat(h, "]"), "".concat(o, " successful."))(i), n({
                              status: 200,
                              payload: e
                            })
                          })).catch((function(e) {
                            s({
                              status: 500,
                              payload: {
                                errorCode: E(e)
                              }
                            })
                          }))
                        }))
                      }
                    }(e))
                  })).then((function(e) {
                    var t, o = (e || {}).payload;
                    if (o) {
                      var i = null !== (t = null == o ? void 0 : o.profiles) && void 0 !== t ? t : {},
                        r = i.sonicstudiosupport,
                        c = i.boninstall,
                        a = i.ssfunc;
                      if ("1" === r && "1" === c) {
                        var u = a.renderdevicelist,
                          d = a.capturedevicelist;
                        u && (I.settings.renderDefaultEndPoint = _(u.device)), d && (I.settings.captureDefaultEndPoint = _(d.device)), S = n(n({}, S), {
                          queryData: o
                        })
                      } else S = n(n({}, S), {
                        queryData: o
                      }), s({
                        status: 200,
                        payload: n({}, S)
                      })
                    }
                  }))
                })).then((function() {
                  var e, o, s, i = (null !== (s = null === (o = null === (e = null == S ? void 0 : S.queryData) || void 0 === e ? void 0 : e.profiles) || void 0 === o ? void 0 : o.ssfunc) && void 0 !== s ? s : {}).renderdevicelist;
                  if ((f === v || f === y) && i) return Promise.resolve().then((function() {
                    return t.dispatch(function(e) {
                      return function() {
                        var t = this,
                          o = "getPlaybackInfo";
                        return new Promise((function(s, i) {
                          var r = e.deviceType,
                            c = e.sessionKey,
                            a = e.modelNumber,
                            u = e.settings.renderDefaultEndPoint,
                            d = {
                              deviceType: r,
                              sessionKey: c,
                              modelNumber: a,
                              settings: {
                                devicetype: y,
                                device: u,
                                preset: ""
                              }
                            },
                            l = {};
                          logMessage.info("[".concat(h, "]"), "".concat(o, " start."))(r), Promise.resolve().then((function() {
                            return u ? t.dispatch(T(d)) : Promise.resolve()
                          })).then((function(e) {
                            var o, s, i, r = (e || {}).payload,
                              c = (null !== (i = null === (s = null === (o = null == r ? void 0 : r.profiles) || void 0 === o ? void 0 : o.ssfunc) || void 0 === s ? void 0 : s.device) && void 0 !== i ? i : {}).preset;
                            return l = n(n({}, l), {
                              presetList: c
                            }), d.settings.preset = _(c), c ? t.dispatch(M(d)) : Promise.resolve()
                          })).then((function(e) {
                            var o, s, i, r = (e || {}).payload,
                              c = (null !== (i = null === (s = null === (o = null == r ? void 0 : r.profiles) || void 0 === o ? void 0 : o.ssfunc) || void 0 === s ? void 0 : s.device) && void 0 !== i ? i : {}).preset;
                            return l = n(n({}, l), {
                              presetDetail: c
                            }), t.dispatch(P(d))
                          })).then((function(e) {
                            var o, s, i, r, c = (e || {}).payload,
                              a = (null !== (r = null === (i = null === (s = null === (o = null == c ? void 0 : c.profiles) || void 0 === o ? void 0 : o.ssfunc) || void 0 === s ? void 0 : s.device) || void 0 === i ? void 0 : i.renderonoff) && void 0 !== r ? r : {}).onoff;
                            return l = n(n({}, l), {
                              effectPower: a
                            }), t.dispatch(D(d))
                          })).then((function(e) {
                            var t, o, s, i, r = (e || {}).payload,
                              c = (null !== (i = null === (s = null === (o = null === (t = null == r ? void 0 : r.profiles) || void 0 === t ? void 0 : t.ssfunc) || void 0 === o ? void 0 : o.device) || void 0 === s ? void 0 : s.allowprocessingonoff) && void 0 !== i ? i : {}).onoff;
                            l = n(n({}, l), {
                              allowProcessing: c
                            })
                          })).then((function() {
                            logMessage.info("[".concat(h, "]"), "".concat(o, " successful."))(r), s({
                              status: 200,
                              payload: l
                            })
                          })).catch((function(e) {
                            var t;
                            i({
                              status: 500,
                              payload: n({
                                errorCode: (null == e ? void 0 : e.message) || (null === (t = null == e ? void 0 : e.payload) || void 0 === t ? void 0 : t.errorCode) || e || errorCode.SDK_RETURN_FAILED
                              }, l)
                            })
                          }))
                        }))
                      }
                    }(I))
                  })).then((function(e) {
                    var t = (e || {}).payload,
                      o = t.presetDetail,
                      s = t.presetList,
                      i = t.effectPower,
                      r = t.allowProcessing;
                    S = n(n({}, S), {
                      renderPresetList: s,
                      renderPresetDetail: o,
                      renderEffectPower: i,
                      renderAllowProcessing: r
                    })
                  }))
                })).then((function() {
                  var e, o, s, i = (null !== (s = null === (o = null === (e = null == S ? void 0 : S.queryData) || void 0 === e ? void 0 : e.profiles) || void 0 === o ? void 0 : o.ssfunc) && void 0 !== s ? s : {}).capturedevicelist;
                  if ((f === v || f === p) && i) return Promise.resolve().then((function() {
                    return t.dispatch(function(e) {
                      return function() {
                        var t = this,
                          o = "getRecordInfo";
                        return new Promise((function(s, i) {
                          var r = e.deviceType,
                            c = e.sessionKey,
                            a = e.modelNumber,
                            u = e.settings.captureDefaultEndPoint,
                            d = {
                              deviceType: r,
                              sessionKey: c,
                              modelNumber: a,
                              settings: {
                                devicetype: p,
                                device: u,
                                preset: {}
                              }
                            },
                            l = {};
                          logMessage.info("[".concat(h, "]"), "".concat(o, " start."))(r), Promise.resolve().then((function() {
                            return u ? t.dispatch(T(d)) : Promise.resolve()
                          })).then((function(e) {
                            var o, s, i, r = (e || {}).payload,
                              c = (null !== (i = null === (s = null === (o = null == r ? void 0 : r.profiles) || void 0 === o ? void 0 : o.ssfunc) || void 0 === s ? void 0 : s.device) && void 0 !== i ? i : {}).preset;
                            return d.settings.preset = _(c), l = n(n({}, l), {
                              presetList: c
                            }), c ? t.dispatch(M(d)) : Promise.resolve()
                          })).then((function(e) {
                            var o, s, i, r = (e || {}).payload,
                              c = (null !== (i = null === (s = null === (o = null == r ? void 0 : r.profiles) || void 0 === o ? void 0 : o.ssfunc) || void 0 === s ? void 0 : s.device) && void 0 !== i ? i : {}).preset;
                            return l = n(n({}, l), {
                              presetDetail: c
                            }), t.dispatch(O(d))
                          })).then((function(e) {
                            var o, s, i, r, c = (e || {}).payload,
                              a = (null !== (r = null === (i = null === (s = null === (o = null == c ? void 0 : c.profiles) || void 0 === o ? void 0 : o.ssfunc) || void 0 === s ? void 0 : s.device) || void 0 === i ? void 0 : i.captureonoff) && void 0 !== r ? r : {}).onoff;
                            return l = n(n({}, l), {
                              effectPower: a
                            }), t.dispatch(D(d))
                          })).then((function(e) {
                            var t, o, s, i, r = (e || {}).payload,
                              c = (null !== (i = null === (s = null === (o = null === (t = null == r ? void 0 : r.profiles) || void 0 === t ? void 0 : t.ssfunc) || void 0 === o ? void 0 : o.device) || void 0 === s ? void 0 : s.allowprocessingonoff) && void 0 !== i ? i : {}).onoff;
                            l = n(n({}, l), {
                              allowProcessing: c
                            })
                          })).then((function() {
                            logMessage.info("[".concat(h, "]"), "".concat(o, " successful."))(r), s({
                              status: 200,
                              payload: l
                            })
                          })).catch((function(e) {
                            var t;
                            i({
                              status: 500,
                              payload: n({
                                errorCode: (null == e ? void 0 : e.message) || (null === (t = null == e ? void 0 : e.payload) || void 0 === t ? void 0 : t.errorCode) || e || errorCode.SDK_RETURN_FAILED
                              }, l)
                            })
                          }))
                        }))
                      }
                    }(I))
                  })).then((function(e) {
                    var t = (e || {}).payload,
                      o = t.presetDetail,
                      s = t.presetList,
                      i = t.effectPower,
                      r = t.allowProcessing;
                    S = n(n({}, S), {
                      capturePresetList: s,
                      capturePresetDetail: o,
                      captureEffectPower: i,
                      captureAllowProcessing: r
                    })
                  }))
                })).then((function() {
                  var e, o, s, i = null !== (s = null === (o = null === (e = null == S ? void 0 : S.queryData) || void 0 === e ? void 0 : e.profiles) || void 0 === o ? void 0 : o.ssfunc) && void 0 !== s ? s : {},
                    r = {
                      renderdevicelist: i.renderdevicelist,
                      capturedevicelist: i.capturedevicelist
                    };
                  return Promise.resolve().then((function() {
                    return t.dispatch(N(I, r))
                  })).then((function(e) {
                    var t = (e || {}).payload;
                    S = n(n({}, S), {
                      deviceInfo: t
                    })
                  }))
                })).then((function() {
                  logMessage.info("[".concat(h, "]"), "".concat(o, " successful."))(r), s({
                    status: 200,
                    payload: S
                  })
                })).catch((function(e) {
                  var t;
                  i({
                    status: 500,
                    payload: n({
                      errorCode: (null == e ? void 0 : e.message) || (null === (t = null == e ? void 0 : e.payload) || void 0 === t ? void 0 : t.errorCode) || e || errorCode.SDK_RETURN_FAILED
                    }, S)
                  })
                }))
              }))
            }
          },
          getPresetList: T,
          getPresetDetail: M,
          getGlobalEnable: function(e) {
            return function() {
              var t = this,
                o = "getGlobalEnable";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  r = e.sessionKey,
                  c = e.modelNumber,
                  u = {
                    root: {
                      device_type: {
                        $: {
                          key: a.MBLED
                        },
                        device: {
                          $: {
                            key: c
                          },
                          function: {
                            $: {
                              key: d.SONICSTUDIO
                            },
                            ssfunc: {
                              $: {
                                key: l.GET_GLOBALENABLE
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  f = m(u);
                Promise.resolve().then((function() {
                  var e = "".concat(r);
                  return logMessage.info("[".concat(h, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: f
                  })
                })).then((function(e) {
                  return g(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(h, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: E(e)
                    }
                  })
                }))
              }))
            }
          },
          setGlobalEnable: function(e) {
            return function() {
              var t = this,
                o = "setGlobalEnable";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  r = e.sessionKey,
                  c = e.modelNumber,
                  u = e.settings.onoff,
                  f = {
                    root: {
                      device_type: {
                        $: {
                          key: a.MBLED
                        },
                        device: {
                          $: {
                            key: c
                          },
                          function: {
                            $: {
                              key: d.SONICSTUDIO
                            },
                            ssfunc: {
                              $: {
                                key: l.SET_GLOBALENABLE
                              },
                              onoff: u
                            }
                          }
                        }
                      }
                    }
                  },
                  y = m(f);
                Promise.resolve().then((function() {
                  var e = "".concat(r);
                  return logMessage.info("[".concat(h, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: y
                  })
                })).then((function(e) {
                  return g(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(h, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: E(e)
                    }
                  })
                }))
              }))
            }
          },
          setDefaultDevice: function(e) {
            return function() {
              var t = this,
                o = "setDefaultDevice";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  r = e.sessionKey,
                  c = e.modelNumber,
                  u = e.settings,
                  f = u.devicetype,
                  y = u.device,
                  p = {
                    root: {
                      device_type: {
                        $: {
                          key: a.MBLED
                        },
                        device: {
                          $: {
                            key: c
                          },
                          function: {
                            $: {
                              key: d.SONICSTUDIO
                            },
                            ssfunc: [{
                              $: {
                                key: l.SET_DEFAULT_DEVICE
                              },
                              devicetype: f,
                              device: y
                            }]
                          }
                        }
                      }
                    }
                  },
                  v = m(p);
                Promise.resolve().then((function() {
                  var e = "".concat(r);
                  return logMessage.info("[".concat(h, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: v
                  })
                })).then((function(e) {
                  return g(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(h, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: E(e)
                    }
                  })
                }))
              }))
            }
          },
          getDeviceInfo: N,
          getMute: function(e) {
            return function() {
              var t = this,
                o = "getMute";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  r = e.sessionKey,
                  c = e.modelNumber,
                  u = e.settings,
                  f = {
                    root: {
                      device_type: {
                        $: {
                          key: a.MBLED
                        },
                        device: {
                          $: {
                            key: c
                          },
                          function: {
                            $: {
                              key: d.SONICSTUDIO
                            },
                            ssfunc: {
                              $: {
                                key: l.GET_MUTE
                              },
                              devicetype: u
                            }
                          }
                        }
                      }
                    }
                  },
                  y = m(f);
                Promise.resolve().then((function() {
                  var e = "".concat(r);
                  return logMessage.info("[".concat(h, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: y
                  })
                })).then((function(e) {
                  return g(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(h, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: E(e)
                    }
                  })
                }))
              }))
            }
          },
          setMute: function(e) {
            return function() {
              var t = this,
                o = "setMute";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  r = e.sessionKey,
                  c = e.modelNumber,
                  u = e.settings,
                  f = u.devicetype,
                  y = u.onoff,
                  p = {
                    root: {
                      device_type: {
                        $: {
                          key: a.MBLED
                        },
                        device: {
                          $: {
                            key: c
                          },
                          function: {
                            $: {
                              key: d.SONICSTUDIO
                            },
                            ssfunc: {
                              $: {
                                key: l.SET_MUTE
                              },
                              devicetype: f,
                              onoff: y
                            }
                          }
                        }
                      }
                    }
                  },
                  v = m(p);
                Promise.resolve().then((function() {
                  var e = "".concat(r);
                  return logMessage.info("[".concat(h, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: v
                  })
                })).then((function(e) {
                  return g(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(h, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: E(e)
                    }
                  })
                }))
              }))
            }
          },
          getSystemVolume: function(e) {
            return function() {
              var t = this,
                o = "getSystemVolume";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  r = e.sessionKey,
                  c = e.modelNumber,
                  u = {
                    root: {
                      device_type: {
                        $: {
                          key: a.MBLED
                        },
                        device: {
                          $: {
                            key: c
                          },
                          function: {
                            $: {
                              key: d.SONICSTUDIO
                            },
                            ssfunc: {
                              $: {
                                key: l.GET_SYSTEMVOLUME
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  f = m(u);
                Promise.resolve().then((function() {
                  var e = "".concat(r);
                  return logMessage.info("[".concat(h, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: f
                  })
                })).then((function(e) {
                  return g(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(h, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: E(e)
                    }
                  })
                }))
              }))
            }
          },
          setSystemVolume: function(e) {
            return function() {
              var t = this,
                o = "setSystemVolume";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  r = e.sessionKey,
                  c = e.modelNumber,
                  u = e.settings.value,
                  f = {
                    root: {
                      device_type: {
                        $: {
                          key: a.MBLED
                        },
                        device: {
                          $: {
                            key: c
                          },
                          function: {
                            $: {
                              key: d.SONICSTUDIO
                            },
                            ssfunc: {
                              $: {
                                key: l.SET_SYSTEMVOLUME
                              },
                              value: u
                            }
                          }
                        }
                      }
                    }
                  },
                  y = m(f);
                Promise.resolve().then((function() {
                  var e = "".concat(r);
                  return logMessage.info("[".concat(h, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: y
                  })
                })).then((function(e) {
                  return g(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(h, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: E(e)
                    }
                  })
                }))
              }))
            }
          },
          getDirectMonitor: function(e) {
            return function() {
              var t = this,
                o = "getDirectMonitor";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  r = e.sessionKey,
                  c = e.modelNumber,
                  u = {
                    root: {
                      device_type: {
                        $: {
                          key: a.MBLED
                        },
                        device: {
                          $: {
                            key: c
                          },
                          function: {
                            $: {
                              key: d.SONICSTUDIO
                            },
                            ssfunc: {
                              $: {
                                key: l.GET_DIRECTMONITOR
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  f = m(u);
                Promise.resolve().then((function() {
                  var e = "".concat(r);
                  return logMessage.info("[".concat(h, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: f
                  })
                })).then((function(e) {
                  return g(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(h, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: E(e)
                    }
                  })
                }))
              }))
            }
          },
          setDirectMonitor: function(e) {
            return function() {
              var t = this,
                o = "setDirectMonitor";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  r = e.sessionKey,
                  c = e.modelNumber,
                  u = e.settings,
                  f = u.devicetype,
                  y = u.device,
                  p = u.allowProcessing,
                  v = u.directMonitor,
                  _ = {
                    root: {
                      device_type: {
                        $: {
                          key: a.MBLED
                        },
                        device: {
                          $: {
                            key: c
                          },
                          function: {
                            $: {
                              key: d.SONICSTUDIO
                            },
                            ssfunc: [{
                              $: {
                                key: l.SET_ALLOW_PROCESSING
                              },
                              devicetype: f,
                              device: y,
                              onoff: p
                            }, {
                              $: {
                                key: l.SET_DIRECTMONITOR
                              },
                              onoff: v
                            }]
                          }
                        }
                      }
                    }
                  },
                  T = m(_);
                Promise.resolve().then((function() {
                  var e = "".concat(r);
                  return logMessage.info("[".concat(h, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: T
                  })
                })).then((function(e) {
                  return g(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(h, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: E(e)
                    }
                  })
                }))
              }))
            }
          },
          startRecordMeterData: function(e) {
            return function() {
              var t = this,
                o = "startRecordMeterData";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  r = e.sessionKey,
                  c = e.modelNumber,
                  u = {
                    root: {
                      device_type: {
                        $: {
                          key: a.MBLED
                        },
                        device: {
                          $: {
                            key: c
                          },
                          function: {
                            $: {
                              key: d.SONICSTUDIO
                            },
                            ssfunc: {
                              $: {
                                key: l.START_METER_DATA
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  f = m(u);
                Promise.resolve().then((function() {
                  var e = "".concat(r);
                  return logMessage.info("[".concat(h, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: f
                  })
                })).then((function(e) {
                  return g(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(h, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: E(e)
                    }
                  })
                }))
              }))
            }
          },
          stopRecordMeterData: function(e) {
            return function() {
              var t = this,
                o = "stopRecordMeterData";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  r = e.sessionKey,
                  c = e.modelNumber,
                  u = {
                    root: {
                      device_type: {
                        $: {
                          key: a.MBLED
                        },
                        device: {
                          $: {
                            key: c
                          },
                          function: {
                            $: {
                              key: d.SONICSTUDIO
                            },
                            ssfunc: {
                              $: {
                                key: l.STOP_METER_DATA
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  f = m(u);
                Promise.resolve().then((function() {
                  var e = "".concat(r);
                  return logMessage.info("[".concat(h, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: f
                  })
                })).then((function(e) {
                  return g(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(h, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: E(e)
                    }
                  })
                }))
              }))
            }
          },
          setRenderEffectPower: function(e) {
            return function() {
              var t = this,
                o = "setRenderEffectPower";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  r = e.sessionKey,
                  c = e.modelNumber,
                  u = e.settings,
                  f = u.devicetype,
                  y = u.device,
                  p = u.allowProcessing,
                  v = u.onoff,
                  _ = {
                    root: {
                      device_type: {
                        $: {
                          key: a.MBLED
                        },
                        device: {
                          $: {
                            key: c
                          },
                          function: {
                            $: {
                              key: d.SONICSTUDIO
                            },
                            ssfunc: [{
                              $: {
                                key: l.SET_ALLOW_PROCESSING
                              },
                              devicetype: f,
                              device: y,
                              onoff: p
                            }, {
                              $: {
                                key: l.SET_RENDER_ONOFF
                              },
                              device: y,
                              onoff: v
                            }]
                          }
                        }
                      }
                    }
                  },
                  T = m(_);
                Promise.resolve().then((function() {
                  var e = "".concat(r);
                  return logMessage.info("[".concat(h, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: T
                  })
                })).then((function(e) {
                  return g(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(h, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: E(e)
                    }
                  })
                }))
              }))
            }
          },
          setVoiceClarity: function(e) {
            return function() {
              var t = this,
                o = "setVoiceClarity";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  r = e.sessionKey,
                  c = e.modelNumber,
                  u = e.settings,
                  f = u.device,
                  y = u.onoff,
                  p = u.value,
                  v = {
                    root: {
                      device_type: {
                        $: {
                          key: a.MBLED
                        },
                        device: {
                          $: {
                            key: c
                          },
                          function: {
                            $: {
                              key: d.SONICSTUDIO
                            },
                            ssfunc: {
                              $: {
                                key: l.SET_VOICECLARITY
                              },
                              device: f,
                              onoff: y,
                              value: p
                            }
                          }
                        }
                      }
                    }
                  },
                  _ = m(v);
                Promise.resolve().then((function() {
                  var e = "".concat(r);
                  return logMessage.info("[".concat(h, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: _
                  })
                })).then((function(e) {
                  return g(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(h, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: E(e)
                    }
                  })
                }))
              }))
            }
          },
          setSmartVolume: function(e) {
            return function() {
              var t = this,
                o = "setSmartVolume";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  r = e.sessionKey,
                  c = e.modelNumber,
                  u = e.settings,
                  f = u.device,
                  y = u.onoff,
                  p = u.value,
                  v = {
                    root: {
                      device_type: {
                        $: {
                          key: a.MBLED
                        },
                        device: {
                          $: {
                            key: c
                          },
                          function: {
                            $: {
                              key: d.SONICSTUDIO
                            },
                            ssfunc: {
                              $: {
                                key: l.SET_SMARTVOLUME
                              },
                              device: f,
                              onoff: y,
                              value: p
                            }
                          }
                        }
                      }
                    }
                  },
                  _ = m(v);
                Promise.resolve().then((function() {
                  var e = "".concat(r);
                  return logMessage.info("[".concat(h, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: _
                  })
                })).then((function(e) {
                  return g(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(h, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: E(e)
                    }
                  })
                }))
              }))
            }
          },
          setTreble: function(e) {
            return function() {
              var t = this,
                o = "setTreble";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  r = e.sessionKey,
                  c = e.modelNumber,
                  u = e.settings,
                  f = u.device,
                  y = u.onoff,
                  p = u.value,
                  v = {
                    root: {
                      device_type: {
                        $: {
                          key: a.MBLED
                        },
                        device: {
                          $: {
                            key: c
                          },
                          function: {
                            $: {
                              key: d.SONICSTUDIO
                            },
                            ssfunc: {
                              $: {
                                key: l.SET_TREBLE
                              },
                              device: f,
                              onoff: y,
                              value: p
                            }
                          }
                        }
                      }
                    }
                  },
                  _ = m(v);
                Promise.resolve().then((function() {
                  var e = "".concat(r);
                  return logMessage.info("[".concat(h, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: _
                  })
                })).then((function(e) {
                  return g(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(h, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: E(e)
                    }
                  })
                }))
              }))
            }
          },
          setBass: function(e) {
            return function() {
              var t = this,
                o = "setBass";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  r = e.sessionKey,
                  c = e.modelNumber,
                  u = e.settings,
                  f = u.device,
                  y = u.onoff,
                  p = u.value,
                  v = {
                    root: {
                      device_type: {
                        $: {
                          key: a.MBLED
                        },
                        device: {
                          $: {
                            key: c
                          },
                          function: {
                            $: {
                              key: d.SONICSTUDIO
                            },
                            ssfunc: {
                              $: {
                                key: l.SET_BASS
                              },
                              device: f,
                              onoff: y,
                              value: p
                            }
                          }
                        }
                      }
                    }
                  },
                  _ = m(v);
                Promise.resolve().then((function() {
                  var e = "".concat(r);
                  return logMessage.info("[".concat(h, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: _
                  })
                })).then((function(e) {
                  return g(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(h, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: E(e)
                    }
                  })
                }))
              }))
            }
          },
          setSurround: function(e) {
            return function() {
              var t = this,
                o = "setSurround";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  r = e.sessionKey,
                  c = e.modelNumber,
                  u = e.settings,
                  f = u.device,
                  y = u.onoff,
                  p = {
                    root: {
                      device_type: {
                        $: {
                          key: a.MBLED
                        },
                        device: {
                          $: {
                            key: c
                          },
                          function: {
                            $: {
                              key: d.SONICSTUDIO
                            },
                            ssfunc: {
                              $: {
                                key: l.SET_SURROUND
                              },
                              device: f,
                              onoff: y
                            }
                          }
                        }
                      }
                    }
                  },
                  v = m(p);
                Promise.resolve().then((function() {
                  var e = "".concat(r);
                  return logMessage.info("[".concat(h, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: v
                  })
                })).then((function(e) {
                  return g(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(h, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: E(e)
                    }
                  })
                }))
              }))
            }
          },
          setReverb: function(e) {
            return function() {
              var t = this,
                o = "setReverb";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  r = e.sessionKey,
                  c = e.modelNumber,
                  u = e.settings,
                  f = u.device,
                  y = u.onoff,
                  p = u.value,
                  v = u.selected,
                  _ = {
                    root: {
                      device_type: {
                        $: {
                          key: a.MBLED
                        },
                        device: {
                          $: {
                            key: c
                          },
                          function: {
                            $: {
                              key: d.SONICSTUDIO
                            },
                            ssfunc: {
                              $: {
                                key: l.SET_REVEB
                              },
                              device: f,
                              selected: v,
                              onoff: y,
                              value: p
                            }
                          }
                        }
                      }
                    }
                  },
                  T = m(_);
                Promise.resolve().then((function() {
                  var e = "".concat(r);
                  return logMessage.info("[".concat(h, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: T
                  })
                })).then((function(e) {
                  return g(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(h, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: E(e)
                    }
                  })
                }))
              }))
            }
          },
          setPlaybackEQ: function(e) {
            return function() {
              var t = this,
                o = "setPlaybackEQ";
              return new Promise((function(s, i) {
                var r = e.deviceType,
                  c = e.sessionKey,
                  u = e.modelNumber,
                  f = e.settings,
                  y = {
                    root: {
                      device_type: {
                        $: {
                          key: a.MBLED
                        },
                        device: {
                          $: {
                            key: u
                          },
                          function: {
                            $: {
                              key: d.SONICSTUDIO
                            },
                            ssfunc: n({
                              $: {
                                key: l.SET_PLAYBACK_EQ
                              }
                            }, f)
                          }
                        }
                      }
                    }
                  },
                  p = m(y);
                Promise.resolve().then((function() {
                  var e = "".concat(c);
                  return logMessage.info("[".concat(h, "]"), "".concat(o))(r), t.send({
                    method: "post",
                    deviceType: r,
                    sessionKey: e,
                    xml: p
                  })
                })).then((function(e) {
                  return g(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(h, "]"), "".concat(o, " successful."))(r), s({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  i({
                    status: 500,
                    payload: {
                      errorCode: E(e)
                    }
                  })
                }))
              }))
            }
          },
          setPresetReset: function(e) {
            return function() {
              var t = this,
                o = "setPresetReset";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  r = e.sessionKey,
                  c = e.modelNumber,
                  u = e.settings,
                  f = u.devicetype,
                  y = u.device,
                  p = u.preset,
                  v = {
                    root: {
                      device_type: {
                        $: {
                          key: a.MBLED
                        },
                        device: {
                          $: {
                            key: c
                          },
                          function: {
                            $: {
                              key: d.SONICSTUDIO
                            },
                            ssfunc: {
                              $: {
                                key: l.SET_PRESET_RESET
                              },
                              devicetype: f,
                              device: y,
                              preset: p
                            }
                          }
                        }
                      }
                    }
                  },
                  _ = m(v);
                Promise.resolve().then((function() {
                  var e = "".concat(r);
                  return logMessage.info("[".concat(h, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: _
                  })
                })).then((function(e) {
                  return g(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(h, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: E(e)
                    }
                  })
                }))
              }))
            }
          },
          setCaptureEffectPower: function(e) {
            return function() {
              var t = this,
                o = "setcaptureEffectPower";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  r = e.sessionKey,
                  c = e.modelNumber,
                  u = e.settings,
                  f = u.devicetype,
                  y = u.device,
                  p = u.allowProcessing,
                  v = u.onoff,
                  _ = {
                    root: {
                      device_type: {
                        $: {
                          key: a.MBLED
                        },
                        device: {
                          $: {
                            key: c
                          },
                          function: {
                            $: {
                              key: d.SONICSTUDIO
                            },
                            ssfunc: [{
                              $: {
                                key: l.SET_ALLOW_PROCESSING
                              },
                              devicetype: f,
                              device: y,
                              onoff: p
                            }, {
                              $: {
                                key: l.SET_CAPTURE_ONOFF
                              },
                              device: y,
                              onoff: v
                            }]
                          }
                        }
                      }
                    }
                  },
                  T = m(_);
                Promise.resolve().then((function() {
                  var e = "".concat(r);
                  return logMessage.info("[".concat(h, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: T
                  })
                })).then((function(e) {
                  return g(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(h, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: E(e)
                    }
                  })
                }))
              }))
            }
          },
          setNoiseReduction: function(e) {
            return function() {
              var t = this,
                o = "setNoiseReduction";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  r = e.sessionKey,
                  c = e.modelNumber,
                  u = e.settings,
                  f = u.device,
                  y = u.onoff,
                  p = u.value,
                  v = {
                    root: {
                      device_type: {
                        $: {
                          key: a.MBLED
                        },
                        device: {
                          $: {
                            key: c
                          },
                          function: {
                            $: {
                              key: d.SONICSTUDIO
                            },
                            ssfunc: {
                              $: {
                                key: l.SET_NOISE_REDUCTION
                              },
                              device: f,
                              onoff: y,
                              value: p
                            }
                          }
                        }
                      }
                    }
                  },
                  _ = m(v);
                Promise.resolve().then((function() {
                  var e = "".concat(r);
                  return logMessage.info("[".concat(h, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: _
                  })
                })).then((function(e) {
                  return g(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(h, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: E(e)
                    }
                  })
                }))
              }))
            }
          },
          setVolumeStabilizer: function(e) {
            return function() {
              var t = this,
                o = "setVolumeStabilizer";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  r = e.sessionKey,
                  c = e.modelNumber,
                  u = e.settings,
                  f = u.device,
                  y = u.onoff,
                  p = u.value,
                  v = {
                    root: {
                      device_type: {
                        $: {
                          key: a.MBLED
                        },
                        device: {
                          $: {
                            key: c
                          },
                          function: {
                            $: {
                              key: d.SONICSTUDIO
                            },
                            ssfunc: {
                              $: {
                                key: l.SET_VOLUMESTABILIZER
                              },
                              device: f,
                              onoff: y,
                              value: p
                            }
                          }
                        }
                      }
                    }
                  },
                  _ = m(v);
                Promise.resolve().then((function() {
                  var e = "".concat(r);
                  return logMessage.info("[".concat(h, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: _
                  })
                })).then((function(e) {
                  return g(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(h, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: E(e)
                    }
                  })
                }))
              }))
            }
          },
          setRecordEQ: function(e) {
            return function() {
              var t = this,
                o = "setRecordEQ";
              return new Promise((function(s, i) {
                var r = e.deviceType,
                  c = e.sessionKey,
                  u = e.modelNumber,
                  f = e.settings,
                  y = {
                    root: {
                      device_type: {
                        $: {
                          key: a.MBLED
                        },
                        device: {
                          $: {
                            key: u
                          },
                          function: {
                            $: {
                              key: d.SONICSTUDIO
                            },
                            ssfunc: n({
                              $: {
                                key: l.SET_RECORD_EQ
                              }
                            }, f)
                          }
                        }
                      }
                    }
                  },
                  p = m(y);
                Promise.resolve().then((function() {
                  var e = "".concat(c);
                  return logMessage.info("[".concat(h, "]"), "".concat(o))(r), t.send({
                    method: "post",
                    deviceType: r,
                    sessionKey: e,
                    xml: p
                  })
                })).then((function(e) {
                  return g(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(h, "]"), "".concat(o, " successful."))(r), s({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  i({
                    status: 500,
                    payload: {
                      errorCode: E(e)
                    }
                  })
                }))
              }))
            }
          },
          getAppRoutingPower: function(e) {
            return function() {
              var t = this,
                o = "getAppRoutingPower";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  r = e.sessionKey,
                  c = e.modelNumber,
                  u = e.settings,
                  f = {
                    root: {
                      device_type: {
                        $: {
                          key: a.MBLED
                        },
                        device: {
                          $: {
                            key: c
                          },
                          function: {
                            $: {
                              key: d.SONICSTUDIO
                            },
                            ssfunc: {
                              $: {
                                key: l.GET_APPROUTING_ONOFF
                              },
                              devicetype: u
                            }
                          }
                        }
                      }
                    }
                  },
                  y = m(f);
                Promise.resolve().then((function() {
                  var e = "".concat(r);
                  return logMessage.info("[".concat(h, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: y
                  })
                })).then((function(e) {
                  return g(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(h, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: E(e)
                    }
                  })
                }))
              }))
            }
          },
          setAppRoutingPower: function(e) {
            return function() {
              var t = this,
                o = "setAppRoutingPower";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  r = e.sessionKey,
                  c = e.modelNumber,
                  u = e.settings,
                  f = u.devicetype,
                  y = u.onoff,
                  p = {
                    root: {
                      device_type: {
                        $: {
                          key: a.MBLED
                        },
                        device: {
                          $: {
                            key: c
                          },
                          function: {
                            $: {
                              key: d.SONICSTUDIO
                            },
                            ssfunc: {
                              $: {
                                key: l.SET_APPROUTING_ONOFF
                              },
                              devicetype: f,
                              onoff: y
                            }
                          }
                        }
                      }
                    }
                  },
                  v = m(p);
                Promise.resolve().then((function() {
                  var e = "".concat(r);
                  return logMessage.info("[".concat(h, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: v
                  })
                })).then((function(e) {
                  return g(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(h, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: E(e)
                    }
                  })
                }))
              }))
            }
          },
          queryApps: function(e) {
            return function() {
              var t = this,
                o = "queryApps";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  r = e.sessionKey,
                  c = e.modelNumber,
                  u = e.settings,
                  f = {
                    root: {
                      device_type: {
                        $: {
                          key: a.MBLED
                        },
                        device: {
                          $: {
                            key: c
                          },
                          function: {
                            $: {
                              key: d.SONICSTUDIO
                            },
                            ssfunc: {
                              $: {
                                key: l.QUERY_APPS
                              },
                              devicetype: u
                            }
                          }
                        }
                      }
                    }
                  },
                  y = m(f);
                Promise.resolve().then((function() {
                  var e = "".concat(r);
                  return logMessage.info("[".concat(h, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: y
                  })
                })).then((function(e) {
                  return g(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(h, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: E(e)
                    }
                  })
                }))
              }))
            }
          },
          setAppRoutingDevice: function(e) {
            return function() {
              var t = this,
                o = "setAppRoutingDevice";
              return new Promise((function(n, i) {
                var r = e.deviceType,
                  c = e.sessionKey,
                  u = e.modelNumber,
                  f = e.settings.appList.map((function(e) {
                    return {
                      $: {
                        key: l.SET_APPROUTING_DEVICE
                      },
                      action: e.action,
                      devicetype: e.devicetype,
                      app: e.appEndPoint,
                      device: e.deviceEndPoint
                    }
                  })),
                  y = {
                    root: {
                      device_type: {
                        $: {
                          key: a.MBLED
                        },
                        device: {
                          $: {
                            key: u
                          },
                          function: {
                            $: {
                              key: d.SONICSTUDIO
                            },
                            ssfunc: s([], f, !0)
                          }
                        }
                      }
                    }
                  },
                  p = m(y);
                Promise.resolve().then((function() {
                  var e = "".concat(c);
                  return logMessage.info("[".concat(h, "]"), "".concat(o))(r), t.send({
                    method: "post",
                    deviceType: r,
                    sessionKey: e,
                    xml: p
                  })
                })).then((function(e) {
                  return g(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(h, "]"), "".concat(o, " successful."))(r), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  i({
                    status: 500,
                    payload: {
                      errorCode: E(e)
                    }
                  })
                }))
              }))
            }
          },
          getAllowProcessing: D,
          setAllowProcessing: function(e) {
            return function() {
              var t = this,
                o = "setAllowProcessing";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  r = e.sessionKey,
                  c = e.modelNumber,
                  u = e.settings,
                  f = u.devicetype,
                  y = u.device,
                  p = u.onoff,
                  v = {
                    root: {
                      device_type: {
                        $: {
                          key: a.MBLED
                        },
                        device: {
                          $: {
                            key: c
                          },
                          function: {
                            $: {
                              key: d.SONICSTUDIO
                            },
                            ssfunc: {
                              $: {
                                key: l.SET_ALLOW_PROCESSING
                              },
                              devicetype: f,
                              device: y,
                              onoff: p
                            }
                          }
                        }
                      }
                    }
                  },
                  _ = m(v);
                Promise.resolve().then((function() {
                  var e = "".concat(r);
                  return logMessage.info("[".concat(h, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: _
                  })
                })).then((function(e) {
                  return g(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(h, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: E(e)
                    }
                  })
                }))
              }))
            }
          }
        }
      },
      612: function(e, t, o) {
        var n = this && this.__importDefault || function(e) {
          return e && e.__esModule ? e : {
            default: e
          }
        };
        Object.defineProperty(t, "__esModule", {
          value: !0
        });
        var s = n(o(79)),
          i = n(o(363)),
          r = s.default.peripheralDevice,
          c = s.default.deviceNameMapping,
          a = i.default.functionNumber,
          u = c[r.MBLED] || r.MBLED,
          d = utility.parseJSON2XML,
          l = utility.parseXML2JSON;
        t.default = {
          getLocation: function(e) {
            return function() {
              var t = this,
                o = "getLocation";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  c = e.sessionKey,
                  f = e.modelNumber,
                  y = {
                    root: {
                      device_type: {
                        $: {
                          key: r.MBLED
                        },
                        device: {
                          $: {
                            key: f
                          },
                          function: {
                            $: {
                              key: a.WIFIANTENNA_QUERYLOCATION
                            }
                          }
                        }
                      }
                    }
                  },
                  p = d(y);
                Promise.resolve().then((function() {
                  var e = "".concat(c);
                  return logMessage.info("[".concat(u, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: p
                  })
                })).then((function(e) {
                  return l(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(u, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  var t;
                  s({
                    status: 500,
                    payload: {
                      errorCode: (null == e ? void 0 : e.message) || (null === (t = null == e ? void 0 : e.payload) || void 0 === t ? void 0 : t.errorCode) || e || errorCode.SDK_RETURN_FAILED
                    }
                  })
                }))
              }))
            }
          },
          setQuickCheck: function(e) {
            return function() {
              var t = this,
                o = "setQuickCheck";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  c = e.sessionKey,
                  f = e.modelNumber,
                  y = {
                    root: {
                      device_type: {
                        $: {
                          key: r.MBLED
                        },
                        device: {
                          $: {
                            key: f
                          },
                          function: {
                            $: {
                              key: a.WIFIANTENNA_QUICKCHECK
                            }
                          }
                        }
                      }
                    }
                  },
                  p = d(y);
                Promise.resolve().then((function() {
                  var e = "".concat(c);
                  return logMessage.info("[".concat(u, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: p
                  })
                })).then((function(e) {
                  return l(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(u, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  var t;
                  s({
                    status: 500,
                    payload: {
                      errorCode: (null == e ? void 0 : e.message) || (null === (t = null == e ? void 0 : e.payload) || void 0 === t ? void 0 : t.errorCode) || e || errorCode.SDK_RETURN_FAILED
                    }
                  })
                }))
              }))
            }
          },
          setDirectionFinder: function(e) {
            return function() {
              var t = this,
                o = "setDirectionFinder";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  c = e.sessionKey,
                  f = e.modelNumber,
                  y = e.settings.direction,
                  p = {
                    root: {
                      device_type: {
                        $: {
                          key: r.MBLED
                        },
                        device: {
                          $: {
                            key: f
                          },
                          function: {
                            $: {
                              key: a.WIFIANTENNA_DIRECTIONFINDER
                            },
                            direction: y
                          }
                        }
                      }
                    }
                  },
                  v = d(p);
                Promise.resolve().then((function() {
                  var e = "".concat(c);
                  return logMessage.info("[".concat(u, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: v
                  })
                })).then((function(e) {
                  return l(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(u, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  var t;
                  s({
                    status: 500,
                    payload: {
                      errorCode: (null == e ? void 0 : e.message) || (null === (t = null == e ? void 0 : e.payload) || void 0 === t ? void 0 : t.errorCode) || e || errorCode.SDK_RETURN_FAILED
                    }
                  })
                }))
              }))
            }
          },
          setReset: function(e) {
            return function() {
              var t = this,
                o = "setReset";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  c = e.sessionKey,
                  f = e.modelNumber,
                  y = {
                    root: {
                      device_type: {
                        $: {
                          key: r.MBLED
                        },
                        device: {
                          $: {
                            key: f
                          },
                          function: {
                            $: {
                              key: a.WIFIANTENNA_RESET
                            }
                          }
                        }
                      }
                    }
                  },
                  p = d(y);
                Promise.resolve().then((function() {
                  var e = "".concat(c);
                  return logMessage.info("[".concat(u, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: p
                  })
                })).then((function(e) {
                  return l(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(u, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  var t;
                  s({
                    status: 500,
                    payload: {
                      errorCode: (null == e ? void 0 : e.message) || (null === (t = null == e ? void 0 : e.payload) || void 0 === t ? void 0 : t.errorCode) || e || errorCode.SDK_RETURN_FAILED
                    }
                  })
                }))
              }))
            }
          },
          setTrafficMonitor: function(e) {
            return function() {
              var t = this,
                o = "setTrafficMonitor";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  c = e.sessionKey,
                  f = e.modelNumber,
                  y = {
                    root: {
                      device_type: {
                        $: {
                          key: r.MBLED
                        },
                        device: {
                          $: {
                            key: f
                          },
                          function: {
                            $: {
                              key: a.WIFIANTENNA_TRAFFICMONITOR
                            }
                          }
                        }
                      }
                    }
                  },
                  p = d(y);
                Promise.resolve().then((function() {
                  var e = "".concat(c);
                  return logMessage.info("[".concat(u, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: p
                  })
                })).then((function(e) {
                  return l(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(u, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  var t;
                  s({
                    status: 500,
                    payload: {
                      errorCode: (null == e ? void 0 : e.message) || (null === (t = null == e ? void 0 : e.payload) || void 0 === t ? void 0 : t.errorCode) || e || errorCode.SDK_RETURN_FAILED
                    }
                  })
                }))
              }))
            }
          },
          setTrafficMonitorOptimization: function(e) {
            return function() {
              var t = this,
                o = "setTrafficMonitorOptimization";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  c = e.sessionKey,
                  f = e.modelNumber,
                  y = {
                    root: {
                      device_type: {
                        $: {
                          key: r.MBLED
                        },
                        device: {
                          $: {
                            key: f
                          },
                          function: {
                            $: {
                              key: a.WIFIANTENNA_TRAFFICMONITOR_OPTIMIZATION
                            }
                          }
                        }
                      }
                    }
                  },
                  p = d(y);
                Promise.resolve().then((function() {
                  var e = "".concat(c);
                  return logMessage.info("[".concat(u, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: p
                  })
                })).then((function(e) {
                  return l(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(u, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  var t;
                  s({
                    status: 500,
                    payload: {
                      errorCode: (null == e ? void 0 : e.message) || (null === (t = null == e ? void 0 : e.payload) || void 0 === t ? void 0 : t.errorCode) || e || errorCode.SDK_RETURN_FAILED
                    }
                  })
                }))
              }))
            }
          },
          setTrafficMonitorLogin: function(e) {
            return function() {
              var t = this,
                o = "setTrafficMonitorLogin";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  c = e.sessionKey,
                  f = e.modelNumber,
                  y = e.settings,
                  p = y.account,
                  v = y.password,
                  h = {
                    root: {
                      device_type: {
                        $: {
                          key: r.MBLED
                        },
                        device: {
                          $: {
                            key: f
                          },
                          function: {
                            $: {
                              key: a.WIFIANTENNA_TRAFFICMONITOR_LOGIN
                            },
                            account: p,
                            password: v
                          }
                        }
                      }
                    }
                  },
                  m = d(h);
                Promise.resolve().then((function() {
                  var e = "".concat(c);
                  return logMessage.info("[".concat(u, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: m
                  }, {
                    noLog: !0
                  })
                })).then((function(e) {
                  return l(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(u, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  var t;
                  s({
                    status: 500,
                    payload: {
                      errorCode: (null == e ? void 0 : e.message) || (null === (t = null == e ? void 0 : e.payload) || void 0 === t ? void 0 : t.errorCode) || e || errorCode.SDK_RETURN_FAILED
                    }
                  })
                }))
              }))
            }
          },
          setTrafficLocationOn: function(e) {
            return function() {
              var t = this,
                o = "setTrafficLocationOn";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  c = e.sessionKey,
                  f = e.modelNumber,
                  y = e.settings.locationon,
                  p = {
                    root: {
                      device_type: {
                        $: {
                          key: r.MBLED
                        },
                        device: {
                          $: {
                            key: f
                          },
                          function: {
                            $: {
                              key: a.WIFIANTENNA_TRAFFICMONITOR_LOCATIONON
                            },
                            locationon: y
                          }
                        }
                      }
                    }
                  },
                  v = d(p);
                Promise.resolve().then((function() {
                  var e = "".concat(c);
                  return logMessage.info("[".concat(u, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: v
                  })
                })).then((function(e) {
                  return l(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(u, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  var t;
                  s({
                    status: 500,
                    payload: {
                      errorCode: (null == e ? void 0 : e.message) || (null === (t = null == e ? void 0 : e.payload) || void 0 === t ? void 0 : t.errorCode) || e || errorCode.SDK_RETURN_FAILED
                    }
                  })
                }))
              }))
            }
          },
          setSmartNotify: function(e) {
            return function() {
              var t = this,
                o = "setSmartNotify";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  c = e.sessionKey,
                  f = e.modelNumber,
                  y = e.settings.enable,
                  p = {
                    root: {
                      device_type: {
                        $: {
                          key: r.MBLED
                        },
                        device: {
                          $: {
                            key: f
                          },
                          function: {
                            $: {
                              key: a.WIFIANTENNA_SMARTNOTIFY
                            },
                            enable: y
                          }
                        }
                      }
                    }
                  },
                  v = d(p);
                Promise.resolve().then((function() {
                  var e = "".concat(c);
                  return logMessage.info("[".concat(u, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: v
                  })
                })).then((function(e) {
                  return l(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(u, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  var t;
                  s({
                    status: 500,
                    payload: {
                      errorCode: (null == e ? void 0 : e.message) || (null === (t = null == e ? void 0 : e.payload) || void 0 === t ? void 0 : t.errorCode) || e || errorCode.SDK_RETURN_FAILED
                    }
                  })
                }))
              }))
            }
          },
          setMLO: function(e) {
            return function() {
              var t = this,
                o = "setMLO";
              return new Promise((function(n, s) {
                var i = e.deviceType,
                  c = e.sessionKey,
                  f = e.modelNumber,
                  y = {
                    root: {
                      device_type: {
                        $: {
                          key: r.MBLED
                        },
                        device: {
                          $: {
                            key: f
                          },
                          function: {
                            $: {
                              key: a.WIFIANTENNA_MLO
                            }
                          }
                        }
                      }
                    }
                  },
                  p = d(y);
                Promise.resolve().then((function() {
                  var e = "".concat(c);
                  return logMessage.info("[".concat(u, "]"), "".concat(o))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: p
                  })
                })).then((function(e) {
                  return l(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(u, "]"), "".concat(o, " successful."))(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  var t;
                  s({
                    status: 500,
                    payload: {
                      errorCode: (null == e ? void 0 : e.message) || (null === (t = null == e ? void 0 : e.payload) || void 0 === t ? void 0 : t.errorCode) || e || errorCode.SDK_RETURN_FAILED
                    }
                  })
                }))
              }))
            }
          }
        }
      },
      147: e => {
        e.exports = require("fs")
      },
      17: e => {
        e.exports = require("path")
      }
    },
    t = {},
    o = function o(n) {
      var s = t[n];
      if (void 0 !== s) return s.exports;
      var i = t[n] = {
        exports: {}
      };
      return e[n].call(i.exports, i, i.exports, o), i.exports
    }(607);
  module.exports = o
})();