(() => {
  "use strict";
  var e = {
      770: (e, t) => {
        Object.defineProperty(t, "__esModule", {
          value: !0
        }), t.default = {
          functionNumber: {
            GET_CAPBILITY: "0",
            GET_PROFILE: "1",
            GET_FREESPACESIZE: "26",
            GET_FW_VERSION: "5",
            GET_CPU_TEMP: "15",
            GET_FANPUMPRPM: "30",
            GET_AURASYNCMODESTATUS: "35",
            GET_SENSORVALUE: "36",
            GET_ROTATED: "8",
            SET_PROFILE: "2",
            SET_POWER_S0: "7",
            SET_POWER_S5: "21",
            SET_ROTATION: "9",
            SET_BOOT_IMAGE: "10",
            SET_STANDBYMODE: "24",
            SET_PROGRESSNOTIFICATION: "31",
            SET_FANTUNING: "32",
            SET_CONTROLMODE: "33",
            SET_MATRIX_S0S5MODE: "34",
            SET_BRIGHTNESS: "37",
            MEDIA_DELETE: "29",
            MEDIA_TRANSFER: "27",
            DELETE_IMAGEFILE: "14",
            COPY_FILE: "28",
            ROTATE_RESIZE_GIF: "25",
            RESTORE_PROFILE: "3",
            ISPOWER_S0: "6",
            ISPOWER_S5: "20"
          },
          DISPLAY_PLAYER: {
            MUTLTI_HW: "multi_hw_monitor_player",
            MUTLTI_MEDIA: "multi_media_player",
            WARNING: "warning_player"
          }
        }
      },
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
          errorCodePlugin: {
            IMAGE_SIZE_EXCEED_LIMIT: "P-1105"
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
          legacyFileFormat: ["1", "2", "4", "7"]
        }
      },
      200: function(e, t, n) {
        var o = this && this.__assign || function() {
            return o = Object.assign || function(e) {
              for (var t, n = 1, o = arguments.length; n < o; n++)
                for (var r in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
              return e
            }, o.apply(this, arguments)
          },
          r = this && this.__importDefault || function(e) {
            return e && e.__esModule ? e : {
              default: e
            }
          };
        Object.defineProperty(t, "__esModule", {
          value: !0
        });
        var i = r(n(17)),
          s = r(n(79)),
          a = r(n(770)),
          c = r(n(596)),
          u = r(n(147)),
          l = n(21),
          d = utility.atob,
          f = utility.readFile,
          p = utility.parseJSON2XML,
          y = utility.parseXML2JSON,
          g = utility.parseErrorCode,
          v = a.default.functionNumber,
          m = s.default.peripheralDevice,
          h = s.default.deviceNameMapping[m.AIO] || m.AIO,
          _ = {},
          M = null,
          P = function(e, t) {
            return function() {
              var n = this;
              return new Promise((function(o, r) {
                var i, s = "getConfig",
                  a = e.deviceType,
                  c = e.modelNumber,
                  u = c ? n.getDeviceFolderName(c) : null,
                  l = null !== (i = null == u ? void 0 : u.configPath) && void 0 !== i ? i : "";
                l ? (logMessage.info("[".concat(h, "]"), "deviceFolder => ".concat(l))(a), Promise.resolve().then((function() {
                  return f("".concat(l, "\\").concat(t), {
                    deviceType: a,
                    isLegacyFormat: !1
                  })
                })).then((function(e) {
                  var t = decodeURIComponent(d(e));
                  return JSON.parse(t)
                })).then((function(e) {
                  e ? (logMessage.info("[".concat(h, "] [").concat(s, "]"), "config is exist.")(a), o({
                    status: 200,
                    payload: e
                  })) : (logMessage.info("[".concat(h, "] [").concat(s, "]"), "config is empty.")(a), o({
                    status: 200
                  }))
                })).catch((function() {
                  logMessage.info("[".concat(h, "] [").concat(s, "]"), "fail.")(a), o({
                    status: 200
                  })
                }))) : (logMessage.error("[".concat(h, "]"), "fail. deviceFolder => ".concat(l))(a), r({
                  status: 500,
                  payload: {
                    errorCode: statusCode.FOLDER_NOT_DEFINED
                  }
                }))
              }))
            }
          },
          T = function(e) {
            return function() {
              return new Promise((function(t, n) {
                var r = e.deviceType,
                  s = e.modelNumber,
                  a = i.default.resolve("".concat(pathMapping.proj, "\\view\\").concat(s, "\\resources\\src\\_ref\\caps.json"));
                logMessage.info("[".concat(h, "]"), "getCaps.")(r), Promise.resolve().then((function() {
                  return f(a, {
                    deviceType: r,
                    isLegacyFormat: !1
                  })
                })).then((function(e) {
                  var n = {},
                    i = {};
                  e && (i = JSON.parse(e)).functionList.forEach((function(e) {
                    switch (e.id) {
                      case "Oled":
                        n.hasOled = !0;
                        break;
                      case "Lcd":
                        n.hasLcd = !0;
                        break;
                      case "Lighting":
                        n.hasLighting = !0;
                        break;
                      case "FanControl":
                        n.hasFanControl = !0;
                        break;
                      case "Matrix":
                        n.hasMatrix = !0;
                        break;
                      case "FirmwareUpdate":
                        n.hasFirmwareUpdate = !0
                    }
                  })), logMessage.info("[".concat(h, "]"), "getCaps successful.")(r), t({
                    status: 200,
                    payload: o(o({}, i), {
                      capsFunctions: n
                    })
                  })
                })).catch((function() {
                  logMessage.error("[".concat(h, "]"), "getCaps fail.")(r), n({
                    status: 500,
                    payload: {
                      errorCode: statusCode.CAPS_NOT_FOUND
                    }
                  })
                }))
              }))
            }
          },
          I = function(e) {
            return function() {
              var t = this;
              return new Promise((function(n, o) {
                var r = e.deviceType,
                  i = e.modelNumber,
                  s = e.sessionKey,
                  a = {
                    root: {
                      device_type: {
                        $: {
                          key: m.AIO
                        },
                        device: {
                          $: {
                            key: i
                          },
                          function: {
                            $: {
                              key: v.GET_FW_VERSION
                            }
                          }
                        }
                      }
                    }
                  },
                  c = p(a);
                Promise.resolve().then((function() {
                  var e = "".concat(s);
                  return logMessage.info("[".concat(h, "]"), "getDeviceInfo.")(r), t.send({
                    method: "post",
                    deviceType: r,
                    sessionKey: e,
                    xml: c
                  })
                })).then((function(e) {
                  logMessage.info("[".concat(h, "]"), "getDeviceInfo successful.")(r), n({
                    status: 200,
                    payload: e.payload.replace(/\n/g, "").replace(/\x00/g, "")
                  })
                })).catch((function(e) {
                  logMessage.error("[".concat(h, "]"), "getDeviceInfo fail.")(r), o({
                    status: 500,
                    payload: {
                      errorCode: g(e)
                    }
                  })
                }))
              }))
            }
          },
          b = function(e) {
            return function() {
              var t = this;
              return new Promise((function(n, o) {
                var r = e.deviceType,
                  i = e.modelNumber,
                  s = void 0 === i ? "0" : i,
                  a = e.sessionKey,
                  c = {
                    root: {
                      device_type: {
                        $: {
                          key: m.AIO
                        },
                        device: {
                          $: {
                            key: s
                          },
                          function: {
                            $: {
                              key: v.GET_CAPBILITY
                            }
                          }
                        }
                      }
                    }
                  },
                  u = p(c);
                Promise.resolve().then((function() {
                  var e = "".concat(a);
                  return logMessage.info("[".concat(h, "]"), "getCapability start.")(r), t.send({
                    method: "post",
                    deviceType: r,
                    sessionKey: e,
                    xml: u
                  })
                })).then((function(e) {
                  return y(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(h, "]"), "getCapability success.")(r), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  logMessage.error("[".concat(h, "]"), "getCapability fail.")(r), o({
                    status: 500,
                    payload: {
                      errorCode: g(e)
                    }
                  })
                }))
              }))
            }
          },
          w = function(e, t) {
            var n = "getExternalImage";
            return new Promise((function(o) {
              var r, i = e.deviceType,
                s = "".concat(pathMapping.proj, "\\view\\externalFiles\\").concat(t),
                a = [];
              if (logMessage.info("[".concat(h, "] [").concat(n, "]"), "matrixFilePath => ".concat(s))(i), u.default.existsSync(s)) {
                for (var c = 0, l = u.default.readdirSync(s); c < l.length; c++) {
                  var d = l[c];
                  if (u.default.existsSync("".concat(s, "/").concat(d, "/").concat(d, ".gif"))) {
                    var f = u.default.statSync("".concat(s, "/").concat(d, "/").concat(d, ".gif")).mtime;
                    a.push({
                      fileName: d,
                      birthTime: Number(f)
                    })
                  }
                }
                logMessage.info("[".concat(h, "] [").concat(n, "]"), "matrix custom image list => ".concat(JSON.stringify(a, null, 2)))(i)
              } else logMessage.info("[".concat(h, "] [").concat(n, "]"), "matrix custom image path is not exist")(i);
              var p = (null === (r = null == a ? void 0 : a.sort((function(e, t) {
                return t.birthTime - e.birthTime
              }))) || void 0 === r ? void 0 : r.map((function(e) {
                return {
                  fileName: e.fileName
                }
              }))) || a;
              logMessage.info("[".concat(h, "] [").concat(n, "]"), "sort success images => ".concat(JSON.stringify(p, null, 2)))(i), o({
                status: 200,
                payload: p
              })
            }))
          },
          O = function(e) {
            return function() {
              var t = this;
              return new Promise((function(n, o) {
                var r = e.deviceType,
                  i = e.modelNumber,
                  s = void 0 === i ? "-1" : i,
                  a = e.sessionKey,
                  c = {
                    root: {
                      device_type: {
                        $: {
                          key: m.AIO
                        },
                        device: {
                          $: {
                            key: s
                          },
                          function: {
                            $: {
                              key: v.ISPOWER_S0
                            }
                          }
                        }
                      }
                    }
                  },
                  u = p(c);
                Promise.resolve().then((function() {
                  var e = "".concat(a);
                  return logMessage.info("[".concat(h, "]"), "isPowerOnS0.")(r), t.send({
                    method: "post",
                    deviceType: r,
                    sessionKey: e,
                    xml: u
                  })
                })).then((function(e) {
                  logMessage.info("[".concat(h, "]"), "isPowerOnS0 successful.")(r), n({
                    status: 200,
                    payload: e.payload
                  })
                })).catch((function(e) {
                  logMessage.error("[".concat(h, "]"), "isPowerOnS0 fail. errorMsg: ".concat(e))(r), o({
                    status: 500,
                    payload: {
                      errorCode: g(e)
                    }
                  })
                }))
              }))
            }
          };
        t.default = {
          initialData: _,
          query: function(e) {
            return function() {
              var t = this;
              return new Promise((function(n, o) {
                var r = e.deviceType;
                return Promise.resolve().then((function() {
                  return t.dispatch(b(e))
                })).then((function(e) {
                  e && (M = null == e ? void 0 : e.payload)
                })).then((function() {
                  logMessage.info("[".concat(h, "]"), "query successful.")(r), n({
                    status: 200
                  })
                })).catch((function(e) {
                  logMessage.error("[".concat(h, "]"), "query fail.")(r), o({
                    status: 500,
                    payload: {
                      errorCode: g(e)
                    }
                  })
                }))
              }))
            }
          },
          isPowerOnS0: O,
          initialize: function(e) {
            return function() {
              var t = this;
              return new Promise((function(n, r) {
                var i = e.deviceType,
                  s = e.modelNumber,
                  a = void 0 === s ? "" : s,
                  u = null;
                logMessage.info("[".concat(h, "]"), "initializeDevicePage.")(i), Promise.resolve().then((function() {
                  return t.dispatch(T(e))
                })).then((function(e) {
                  u = e ? e.payload : null, _[a] = o(o({}, _[a]), {
                    caps: u
                  })
                })).then((function() {
                  return t.dispatch(P(e, "config.xml"))
                })).then((function(e) {
                  var t = e.payload;
                  if (t) {
                    var n = t.currProfile;
                    _[a] = o(o(o({}, _[a]), n && {
                      selectedProfile: n.id
                    }), {
                      globalSettings: o({}, t)
                    })
                  }
                })).then((function() {
                  return t.dispatch(P(e, "fp_1_config.xml"))
                })).then((function(e) {
                  var t = (e || {}).payload;
                  t && (_[a] = o(o({}, _[a]), {
                    profileSettings: t
                  }))
                })).then((function() {
                  var n = u.capsFunctions;
                  if (null == n ? void 0 : n.hasLighting) return t.dispatch(P(e, "fp_1_previousLighting.xml"))
                })).then((function(e) {
                  var t = (e || {}).payload;
                  t && (_[a] = o(o({}, _[a]), {
                    previousLighting: o({}, t)
                  }))
                })).then((function() {
                  var t = u.matrix;
                  if (null == t ? void 0 : t.targetExternalFile) return w(e, null == t ? void 0 : t.targetExternalFile)
                })).then((function(e) {
                  var t = (e || {}).payload;
                  t && (_[a] = o(o({}, _[a]), {
                    matrixCustomImage: t
                  }))
                })).then((function() {
                  var n = (u.deviceProps || {}).needPowerS0Status;
                  if (void 0 === n || n) return t.dispatch(O(e))
                })).then((function(e) {
                  var t = (e || {}).payload;
                  t && (_[a] = o(o({}, _[a]), {
                    powerS0: t.replace(/\n/g, "").replace(/\x00/g, "")
                  }))
                })).then((function() {
                  var n = (u || {}).display;
                  if (null == n ? void 0 : n.hasRotate) return t.dispatch(c.default.getRotateAngle(e))
                })).then((function(e) {
                  e && (_[a] = o(o({}, _[a]), {
                    rotation: null == e ? void 0 : e.payload
                  }))
                })).then((function() {
                  logMessage.info("[".concat(h, "]"), "initializeDevicePage successful.")(i), n({
                    status: 200,
                    payload: _[a]
                  })
                })).catch((function(e) {
                  var t;
                  logMessage.error("[".concat(h, "]"), "initializeDevicePage fail. error => ".concat((null == e ? void 0 : e.message) || (null === (t = null == e ? void 0 : e.payload) || void 0 === t ? void 0 : t.errorCode) || e))(i), r({
                    status: 500,
                    payload: o({
                      errorCode: g(e)
                    }, _[a])
                  })
                }))
              }))
            }
          },
          initializeAlertPage: function(e) {
            return function() {
              var t = this;
              return new Promise((function(n, r) {
                var i = e.deviceType,
                  s = e.modelNumber,
                  a = void 0 === s ? "" : s,
                  c = null;
                logMessage.info("[".concat(h, "]"), "initializeAlertPage.")(i), Promise.resolve().then((function() {
                  return t.dispatch(T(e))
                })).then((function(e) {
                  c = e ? e.payload : null, _[a] = o(o({}, _[a]), {
                    caps: c
                  })
                })).then((function() {
                  return t.dispatch(P(e, "config.xml"))
                })).then((function(e) {
                  var t = e.payload;
                  if (t) {
                    var n = t.currProfile;
                    _[a] = o(o(o({}, _[a]), n && {
                      selectedProfile: n.id
                    }), {
                      globalSettings: o({}, t)
                    })
                  }
                })).then((function() {
                  return t.dispatch(b(e))
                })).then((function(e) {
                  e && (_[a] = o(o({}, _[a]), {
                    capabilityData: null == e ? void 0 : e.payload
                  }))
                })).then((function() {
                  return t.dispatch(I(e))
                })).then((function(e) {
                  var t = (e || {}).payload;
                  t && (_[a] = o(o({}, _[a]), {
                    fwVersion: t
                  }))
                })).then((function() {
                  var n = (c.deviceProps || {}).needPowerS0Status;
                  if (void 0 === n || n) return t.dispatch(O(e))
                })).then((function(e) {
                  var t = (e || {}).payload;
                  t && (_[a] = o(o({}, _[a]), {
                    powerS0: t.replace(/\n/g, "").replace(/\x00/g, "")
                  }))
                })).then((function() {
                  return t.dispatch(P(e, "fp_1_config.xml"))
                })).then((function(e) {
                  var t = (e || {}).payload;
                  t && (_[a] = o(o({}, _[a]), {
                    profileSettings: t
                  }))
                })).then((function() {
                  var n = c.capsFunctions;
                  if (null == n ? void 0 : n.hasLighting) return t.dispatch(P(e, "fp_1_previousLighting.xml"))
                })).then((function(e) {
                  var t = (e || {}).payload;
                  t && (_[a] = o(o({}, _[a]), {
                    previousLighting: o({}, t)
                  }))
                })).then((function() {
                  logMessage.info("[".concat(h, "]"), "initializeAlertPage successful.")(i), n({
                    status: 200,
                    payload: _[a]
                  })
                })).catch((function(e) {
                  var t;
                  logMessage.error("[".concat(h, "]"), "initializeAlertPage fail. error => ".concat((null === (t = null == e ? void 0 : e.payload) || void 0 === t ? void 0 : t.errorCode) || (null == e ? void 0 : e.message) || e))(i), r({
                    status: 500,
                    payload: {
                      errorCode: g(e)
                    }
                  })
                }))
              }))
            }
          },
          getCapability: b,
          getCapabilityData: function(e) {
            return function() {
              return new Promise((function(t) {
                var n = e.deviceType;
                t({
                  status: 200,
                  payload: M
                }), logMessage.info("[".concat(h, "]"), "getCapabilityData successful.")(n)
              }))
            }
          },
          getDeviceInfo: I,
          getProfile: function(e, t) {
            return function() {
              var t = this;
              return new Promise((function(n, r) {
                var i = e.profileID,
                  s = e.profile,
                  a = e.deviceType,
                  c = s,
                  u = {};
                Promise.resolve().then((function() {
                  return t.dispatch(P(e, "config.xml"))
                })).then((function(n) {
                  var r = (n || {}).payload,
                    s = null;
                  if (r) {
                    var a = r.profileList,
                      l = r.swProfileList,
                      d = r.projectedProfile;
                    a && a.length && (c = a.find((function(e) {
                      return e.id === i
                    }))), !c && l && l.length && (c = l.find((function(e) {
                      return e.id === i
                    }))), s = d
                  }
                  return u = o(o(o({}, u), c), {
                    projectedProfile: s
                  }), t.dispatch(P(e, "fp_1_config.xml"))
                })).then((function(e) {
                  var t = (e || {}).payload;
                  t && (u = o(o({}, u), {
                    profileSettings: o({}, t)
                  }))
                })).then((function() {
                  Promise.resolve().then((function() {
                    if (c) return t.dispatch(P(e, "fp_1_previousLighting.xml"))
                  })).then((function(e) {
                    var t = (e || {}).payload;
                    t && (u = o(o({}, u), {
                      previousLighting: o({}, t)
                    })), n({
                      status: 200,
                      payload: u
                    })
                  })).catch((function() {
                    n({
                      status: 200,
                      payload: u
                    })
                  }))
                })).then((function() {
                  n({
                    status: 200,
                    payload: u
                  })
                })).catch((function(e) {
                  logMessage.error("[".concat(h, "]"), "getProfile fail.")(a), r({
                    status: 500,
                    payload: {
                      errorCode: g(e)
                    }
                  })
                }))
              }))
            }
          },
          getLastProfile: function(e) {
            return function() {
              var t = this;
              return new Promise((function(n, o) {
                var r = e.deviceType,
                  i = e.modelNumber,
                  s = void 0 === i ? "0" : i,
                  a = e.sessionKey,
                  c = {
                    root: {
                      device_type: {
                        $: {
                          key: m.AIO
                        },
                        device: {
                          $: {
                            key: s
                          },
                          function: {
                            $: {
                              key: v.GET_PROFILE
                            }
                          }
                        }
                      }
                    }
                  },
                  u = p(c);
                Promise.resolve().then((function() {
                  var e = "".concat(a);
                  return logMessage.info("[".concat(h, "]"), "getLastProfile.")(r), t.send({
                    method: "post",
                    deviceType: r,
                    sessionKey: e,
                    xml: u
                  })
                })).then((function(e) {
                  logMessage.info("[".concat(h, "]"), "getLastProfile successful.")(r), n({
                    status: 200,
                    payload: e.payload
                  })
                })).catch((function(e) {
                  logMessage.error("[".concat(h, "]"), "getLastProfile fail.")(r), o({
                    status: 500,
                    payload: {
                      errorCode: g(e)
                    }
                  })
                }))
              }))
            }
          },
          getExternalImage: w,
          restoreProfile: function(e) {
            return function() {
              var t = this;
              return new Promise((function(n, o) {
                var r = e.deviceType,
                  i = e.modelNumber,
                  s = void 0 === i ? "-1" : i,
                  a = e.sessionKey,
                  c = {
                    root: {
                      device_type: {
                        $: {
                          key: m.AIO
                        },
                        device: {
                          $: {
                            key: s
                          },
                          function: {
                            $: {
                              key: v.RESTORE_PROFILE
                            }
                          }
                        }
                      }
                    }
                  },
                  u = p(c);
                Promise.resolve().then((function() {
                  var e = "".concat(a);
                  return logMessage.info("[".concat(h, "]"), "restoreProfile.")(r), t.send({
                    method: "post",
                    deviceType: r,
                    sessionKey: e,
                    xml: u
                  })
                })).then((function(e) {
                  logMessage.info("[".concat(h, "]"), "restoreProfile successful.")(r), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  logMessage.error("[".concat(h, "]"), "restoreProfile fail.")(r), o({
                    status: 500,
                    payload: {
                      errorCode: g(e)
                    }
                  })
                }))
              }))
            }
          },
          deleteExternalImage: function(e) {
            var t = "deleteExternalImage";
            return new Promise((function(n) {
              var o = e.deviceType,
                r = e.settings,
                i = r.targetPath,
                s = r.fileName,
                a = "".concat(pathMapping.proj, "\\view\\externalFiles\\").concat(i, "\\").concat(s);
              return Promise.resolve().then((function() {
                logMessage.info("[".concat(h, "] [").concat(t, "]"), "Delete Folder: ".concat(a, "."))(o), u.default.existsSync(a) && u.default.rmdirSync(a, {
                  recursive: !0
                })
              })).then((function() {
                return w(e, i)
              })).then((function(e) {
                logMessage.info("[".concat(h, "] [").concat(t, "]"), "Delete Folder: ".concat(a, ". successful."))(o);
                var r = (e || {}).payload;
                n(r ? {
                  status: 200,
                  payload: r
                } : {
                  status: 200
                })
              }))
            }))
          },
          sharpImage: function(e) {
            return function() {
              return new Promise((function(t, n) {
                var r = e.settings,
                  i = e.deviceType,
                  s = r.cropArea,
                  a = r.resize,
                  c = r.rotateAngle,
                  u = r.output,
                  d = r.layoutVertical,
                  f = JSON.parse(s),
                  p = JSON.parse(a),
                  y = JSON.parse(d),
                  v = (0, l.v4)(),
                  m = r.files[0].originalname.split(".").pop();
                return utility.sharpImage(o(o({
                  input: r.files[0].buffer
                }, !y && {
                  output: "".concat(pathMapping.proj, "\\view\\").concat(u, "\\").concat(v, ".").concat(m)
                }), {
                  rotateAngle: JSON.parse(c),
                  cropArea: {
                    left: f.left,
                    top: f.top,
                    width: f.width,
                    height: f.height
                  },
                  resize: {
                    width: y ? p.height : p.width,
                    height: y ? p.width : p.height
                  }
                }), i).then((function(e) {
                  return y ? utility.sharpImage({
                    input: e.imageBuffer,
                    output: "".concat(pathMapping.proj, "\\view\\").concat(u, "\\").concat(v, ".").concat(m),
                    rotateAngle: 90
                  }, i) : e
                })).then((function(e) {
                  logMessage.info("[".concat(h, "]"), "sharpImage successful.")(i);
                  var n = (null == e ? void 0 : e.outputInfo).size;
                  t({
                    status: 200,
                    payload: {
                      fileName: v,
                      ext: m,
                      size: n
                    }
                  })
                })).catch((function(e) {
                  var t;
                  logMessage.error("[".concat(h, "]"), "sharpImage fail error => ".concat((null == e ? void 0 : e.message) || (null === (t = null == e ? void 0 : e.payload) || void 0 === t ? void 0 : t.errorCode) || e))(i), n({
                    status: 500,
                    payload: {
                      errorCode: g(e)
                    }
                  })
                }))
              }))
            }
          },
          mediaTransfer: function(e, t) {
            return function() {
              var n = this;
              return new Promise((function(o, r) {
                var i = e.deviceType,
                  s = e.modelNumber,
                  a = void 0 === s ? "-1" : s,
                  c = e.sessionKey,
                  u = t.filePath,
                  l = t.mediaIndex,
                  d = u.split("\\").pop().split("/").pop().split("."),
                  f = {
                    root: {
                      device_type: {
                        $: {
                          key: m.AIO
                        },
                        device: {
                          $: {
                            key: a
                          },
                          function: {
                            $: {
                              key: v.MEDIA_TRANSFER
                            },
                            settings: {
                              media_transfer: {
                                path: "".concat(pathMapping.proj, "\\view\\").concat(u),
                                type: function() {
                                  switch (d[d.length - 1]) {
                                    case "gif":
                                      return "1";
                                    case "jpg":
                                      return "0";
                                    case "avi":
                                      return "2";
                                    default:
                                      return "3"
                                  }
                                }(),
                                index: l
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  y = p(f);
                Promise.resolve().then((function() {
                  var e = "".concat(c);
                  return logMessage.info("[".concat(h, "]"), "mediaTransfer start.")(i), n.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: y
                  })
                })).then((function() {
                  logMessage.info("[".concat(h, "]"), "mediaTransfer successful.")(i), o({
                    status: 200
                  })
                })).catch((function(e) {
                  logMessage.error("[".concat(h, "]"), "mediaTransfer fail.")(i), r({
                    status: 500,
                    payload: {
                      errorCode: g(e),
                      filePath: u
                    }
                  })
                }))
              }))
            }
          },
          readVideo: function(e) {
            return function() {
              return new Promise((function(t, n) {
                var o = null != e ? e : {},
                  r = o.deviceType,
                  s = o.sessionKey,
                  a = o.settings,
                  c = o.response,
                  u = (a || {}).id,
                  l = Buffer.from(u, "base64").toString("utf-8"),
                  d = decodeURIComponent(l);
                if (i.default.isAbsolute(d)) return Promise.resolve().then((function() {
                  return f(d, {
                    deviceType: r,
                    isLegacyFormat: !1,
                    isString: !1
                  })
                })).then((function(e) {
                  c.contentType("video/mp4"), t({
                    sessionKey: s,
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  n({
                    sessionKey: s,
                    status: 500,
                    payload: {
                      errorCode: e
                    }
                  })
                }));
                logMessage.error("[Server]", "video is not absolute path.")(r), n({
                  sessionKey: s,
                  status: 500,
                  payload: {
                    errorCode: errorCode.DATA_FORMAT_ERROR
                  }
                })
              }))
            }
          },
          setBrightness: function(e) {
            return function() {
              var t = this;
              return new Promise((function(n, o) {
                var r, i, s = e.deviceType,
                  a = e.modelNumber,
                  c = void 0 === a ? "-1" : a,
                  u = e.sessionKey,
                  l = e.settings || {},
                  d = l.powerS0,
                  f = l.brightness,
                  y = {
                    root: {
                      device_type: {
                        $: {
                          key: m.AIO
                        },
                        device: {
                          $: {
                            key: c
                          },
                          function: {
                            $: {
                              key: v.SET_BRIGHTNESS
                            },
                            settings: {
                              brightness: {
                                s0: d ? null !== (r = null == f ? void 0 : f.s0) && void 0 !== r ? r : f : "1",
                                s5: d ? null !== (i = null == f ? void 0 : f.s5) && void 0 !== i ? i : f : "1"
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  _ = p(y);
                Promise.resolve().then((function() {
                  var e = "".concat(u);
                  return logMessage.info("[".concat(h, "]"), "setBrightness.")(s), t.send({
                    method: "post",
                    deviceType: s,
                    sessionKey: e,
                    xml: _
                  })
                })).then((function(e) {
                  logMessage.info("[".concat(h, "]"), "setBrightness successful.")(s), n({
                    status: 200,
                    payload: e.payload
                  })
                })).catch((function(e) {
                  logMessage.error("[".concat(h, "]"), "setBrightness fail. errorMsg: ".concat(e))(s), o({
                    status: 500,
                    payload: {
                      errorCode: g(e)
                    }
                  })
                }))
              }))
            }
          },
          setProgressNotification: function(e) {
            return function() {
              var t = this;
              return new Promise((function(n, o) {
                var r = e.deviceType,
                  i = e.modelNumber,
                  s = void 0 === i ? "-1" : i,
                  a = e.sessionKey,
                  c = {
                    root: {
                      device_type: {
                        $: {
                          key: m.AIO
                        },
                        device: {
                          $: {
                            key: s
                          },
                          function: {
                            $: {
                              key: v.SET_PROGRESSNOTIFICATION
                            }
                          }
                        }
                      }
                    }
                  },
                  u = p(c);
                Promise.resolve().then((function() {
                  var e = "".concat(a);
                  return logMessage.info("[".concat(h, "]"), "setProgressNotification.")(r), t.send({
                    method: "post",
                    deviceType: r,
                    sessionKey: e,
                    xml: u
                  })
                })).then((function() {
                  logMessage.info("[".concat(h, "]"), "setProgressNotification successful.")(r), n({
                    status: 200
                  })
                })).catch((function(e) {
                  logMessage.error("[".concat(h, "]"), "setProgressNotification fail.")(r), o({
                    status: 500,
                    payload: {
                      errorCode: g(e)
                    }
                  })
                }))
              }))
            }
          },
          setControlMode: function(e) {
            return function() {
              var t = this;
              return new Promise((function(n, o) {
                var r = "setControlMode",
                  i = e.deviceType,
                  s = e.modelNumber,
                  a = e.sessionKey,
                  c = e.settings.mode,
                  u = {
                    root: {
                      device_type: {
                        $: {
                          key: m.AIO
                        },
                        device: {
                          $: {
                            key: s
                          },
                          function: {
                            $: {
                              key: v.SET_CONTROLMODE
                            },
                            settings: {
                              control_mode: c
                            }
                          }
                        }
                      }
                    }
                  },
                  l = p(u);
                Promise.resolve().then((function() {
                  var e = "".concat(a);
                  return logMessage.info("[".concat(h, "]"), "".concat(r, "."))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: l
                  })
                })).then((function() {
                  logMessage.info("[".concat(h, "]"), "".concat(r, " successful."))(i), n({
                    status: 200
                  })
                })).catch((function(e) {
                  o({
                    status: 500,
                    payload: {
                      errorCode: g(e)
                    }
                  })
                }))
              }))
            }
          }
        }
      },
      596: function(e, t, n) {
        var o = this && this.__assign || function() {
            return o = Object.assign || function(e) {
              for (var t, n = 1, o = arguments.length; n < o; n++)
                for (var r in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
              return e
            }, o.apply(this, arguments)
          },
          r = this && this.__awaiter || function(e, t, n, o) {
            return new(n || (n = Promise))((function(r, i) {
              function s(e) {
                try {
                  c(o.next(e))
                } catch (e) {
                  i(e)
                }
              }

              function a(e) {
                try {
                  c(o.throw(e))
                } catch (e) {
                  i(e)
                }
              }

              function c(e) {
                var t;
                e.done ? r(e.value) : (t = e.value, t instanceof n ? t : new n((function(e) {
                  e(t)
                }))).then(s, a)
              }
              c((o = o.apply(e, t || [])).next())
            }))
          },
          i = this && this.__generator || function(e, t) {
            var n, o, r, i, s = {
              label: 0,
              sent: function() {
                if (1 & r[0]) throw r[1];
                return r[1]
              },
              trys: [],
              ops: []
            };
            return i = {
              next: a(0),
              throw: a(1),
              return: a(2)
            }, "function" == typeof Symbol && (i[Symbol.iterator] = function() {
              return this
            }), i;

            function a(a) {
              return function(c) {
                return function(a) {
                  if (n) throw new TypeError("Generator is already executing.");
                  for (; i && (i = 0, a[0] && (s = 0)), s;) try {
                    if (n = 1, o && (r = 2 & a[0] ? o.return : a[0] ? o.throw || ((r = o.return) && r.call(o), 0) : o.next) && !(r = r.call(o, a[1])).done) return r;
                    switch (o = 0, r && (a = [2 & a[0], r.value]), a[0]) {
                      case 0:
                      case 1:
                        r = a;
                        break;
                      case 4:
                        return s.label++, {
                          value: a[1],
                          done: !1
                        };
                      case 5:
                        s.label++, o = a[1], a = [0];
                        continue;
                      case 7:
                        a = s.ops.pop(), s.trys.pop();
                        continue;
                      default:
                        if (!((r = (r = s.trys).length > 0 && r[r.length - 1]) || 6 !== a[0] && 2 !== a[0])) {
                          s = 0;
                          continue
                        }
                        if (3 === a[0] && (!r || a[1] > r[0] && a[1] < r[3])) {
                          s.label = a[1];
                          break
                        }
                        if (6 === a[0] && s.label < r[1]) {
                          s.label = r[1], r = a;
                          break
                        }
                        if (r && s.label < r[2]) {
                          s.label = r[2], s.ops.push(a);
                          break
                        }
                        r[2] && s.ops.pop(), s.trys.pop();
                        continue
                    }
                    a = t.call(e, s)
                  } catch (e) {
                    a = [6, e], o = 0
                  } finally {
                    n = r = 0
                  }
                  if (5 & a[0]) throw a[1];
                  return {
                    value: a[0] ? a[1] : void 0,
                    done: !0
                  }
                }([a, c])
              }
            }
          },
          s = this && this.__spreadArray || function(e, t, n) {
            if (n || 2 === arguments.length)
              for (var o, r = 0, i = t.length; r < i; r++) !o && r in t || (o || (o = Array.prototype.slice.call(t, 0, r)), o[r] = t[r]);
            return e.concat(o || Array.prototype.slice.call(t))
          },
          a = this && this.__importDefault || function(e) {
            return e && e.__esModule ? e : {
              default: e
            }
          };
        Object.defineProperty(t, "__esModule", {
          value: !0
        });
        var c = a(n(79)),
          u = a(n(770)),
          l = a(n(147)),
          d = n(21),
          f = a(n(200)),
          p = n(687),
          y = utility.parseJSON2XML,
          g = utility.parseErrorCode,
          v = c.default.peripheralDevice,
          m = c.default.deviceNameMapping,
          h = u.default.functionNumber,
          _ = u.default.DISPLAY_PLAYER,
          M = m[v.AIO] || v.AIO,
          P = function(e) {
            if (!e) return null;
            var t = e.split(".");
            if (t.length > 1) {
              var n = t.pop();
              if (n)
                for (var o = n.split("?")[0], r = 0, i = ["gif", "jpg", "avi", "mp4"]; r < i.length; r++) {
                  var s = i[r];
                  if (o.includes(s)) return s
                }
            }
            return null
          },
          T = function(e) {
            return function() {
              var t = this;
              return new Promise((function(n, o) {
                var r = e.deviceType,
                  i = e.modelNumber,
                  s = void 0 === i ? "-1" : i,
                  a = e.sessionKey,
                  c = e.settings,
                  u = c.layoutVertical,
                  l = c.degrees,
                  d = u ? 2 : 0;
                l && (d = 4 * l);
                var f = {
                    root: {
                      device_type: {
                        $: {
                          key: v.AIO
                        },
                        device: {
                          $: {
                            key: s
                          },
                          function: {
                            $: {
                              key: h.SET_ROTATION
                            },
                            settings: {
                              rotation: d,
                              saving: 1
                            }
                          }
                        }
                      }
                    }
                  },
                  p = y(f);
                Promise.resolve().then((function() {
                  var e = "".concat(a);
                  return logMessage.info("[".concat(M, "]"), "setRotation.")(r), t.send({
                    method: "post",
                    deviceType: r,
                    sessionKey: e,
                    xml: p
                  })
                })).then((function() {
                  logMessage.info("[".concat(M, "]"), "setRotation successful.")(r), n({
                    status: 200
                  })
                })).catch((function(e) {
                  logMessage.error("[".concat(M, "]"), "setRotation fail. errorMsg: ".concat(e))(r), o({
                    status: 500,
                    payload: {
                      errorCode: g(e)
                    }
                  })
                }))
              }))
            }
          },
          I = function(e, t) {
            return function() {
              var n = this;
              return new Promise((function(o, r) {
                var i = e.deviceType,
                  s = e.modelNumber,
                  a = void 0 === s ? "-1" : s,
                  c = e.sessionKey,
                  u = {
                    root: {
                      device_type: {
                        $: {
                          key: v.AIO
                        },
                        device: {
                          $: {
                            key: a
                          },
                          function: {
                            $: {
                              key: h.GET_FREESPACESIZE
                            }
                          }
                        }
                      }
                    }
                  },
                  l = y(u);
                Promise.resolve().then((function() {
                  var e = "".concat(c);
                  return logMessage.info("[".concat(M, "]"), "checkFreeSpaceSize.")(i), n.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: l
                  })
                })).then((function(e) {
                  var n = (null != e ? e : {}).payload;
                  logMessage.info("[".concat(M, "]"), "image size => ".concat(parseFloat(t)))(i), logMessage.info("[".concat(M, "]"), "free space size => ".concat(parseFloat(n)))(i), parseFloat(t) <= parseFloat(n) ? (logMessage.info("[".concat(M, "]"), "image pass!")(i), o({
                    status: 200
                  })) : (logMessage.error("[".concat(M, "]"), "image size exceed the maximum limit ...")(i), r({
                    status: 500,
                    payload: {
                      errorCode: statusCode.IMAGE_SIZE_EXCEED_LIMIT
                    }
                  })), logMessage.info("[".concat(M, "]"), "checkFreeSpaceSize successful.")(i)
                })).catch((function(e) {
                  logMessage.error("[".concat(M, "]"), "checkFreeSpaceSize fail.")(i), r({
                    status: 500,
                    payload: {
                      errorCode: g(e)
                    }
                  })
                }))
              }))
            }
          },
          b = function(e, t) {
            return function() {
              var n = this;
              return new Promise((function(r, i) {
                var s = e.deviceType,
                  a = e.modelNumber,
                  c = void 0 === a ? "-1" : a,
                  u = e.sessionKey,
                  l = t.cropInfo,
                  d = t.srcPath,
                  p = t.dstPath,
                  m = (((f.default.initialData[c] || {}).caps || {}).deviceProps || {}).croppingImageFPSlimit,
                  _ = l.cropWidth,
                  T = l.cropHeight,
                  I = l.x,
                  b = l.y,
                  w = l.rotate,
                  O = l.originImgWidth,
                  S = l.originImgHeight,
                  A = l.resize_width,
                  E = l.resize_height,
                  k = {
                    root: {
                      device_type: {
                        $: {
                          key: v.AIO
                        },
                        device: {
                          $: {
                            key: c
                          },
                          function: {
                            $: {
                              key: h.ROTATE_RESIZE_GIF
                            },
                            settings: {
                              rotate_resize: o({
                                src_path: d,
                                dst_path: p,
                                img_width: O,
                                img_height: S,
                                rotate: (360 - Number(w)) / 90 % 4,
                                x_position: I,
                                y_position: b,
                                crop_width: _,
                                crop_height: T,
                                resize_width: A,
                                resize_height: E
                              }, m && "mp4" === P(d) ? {
                                fps_limit: m
                              } : {})
                            }
                          }
                        }
                      }
                    }
                  },
                  x = y(k);
                Promise.resolve().then((function() {
                  var e = "".concat(u);
                  return logMessage.info("[".concat(M, "]"), "getCroppedImage.")(s), n.send({
                    method: "post",
                    deviceType: s,
                    sessionKey: e,
                    xml: x
                  })
                })).then((function(e) {
                  logMessage.info("[".concat(M, "]"), "getCroppedImage successful.")(s);
                  var t = e.payload.replace(/\n/g, "").replace(/\x00/g, "");
                  if ("-1" === t) return i({
                    status: 500,
                    payload: {
                      errorCode: g(e.payload)
                    }
                  });
                  r({
                    status: 200,
                    payload: t
                  })
                })).catch((function(e) {
                  logMessage.error("[".concat(M, "]"), "getCroppedImage fail.errorMsg: ".concat(e))(s), i({
                    status: 500,
                    payload: {
                      errorCode: g(e)
                    }
                  })
                }))
              }))
            }
          },
          w = function(e, t) {
            return function() {
              return new Promise((function(n) {
                var o = e.deviceType;
                try {
                  logMessage.info("[".concat(M, "]"), "ready to delete file: ".concat(t))(o), l.default.existsSync("".concat(pathMapping.proj, "\\view\\").concat(t)) ? (logMessage.info("[".concat(M, "]"), "file exist, delete start.")(o), l.default.lstatSync("".concat(pathMapping.proj, "\\view\\").concat(t)).isDirectory() ? l.default.rmSync("".concat(pathMapping.proj, "\\view\\").concat(t), {
                    recursive: !0
                  }) : l.default.unlink("".concat(pathMapping.proj, "\\view\\").concat(t), (function(e) {
                    e && logMessage.info("[".concat(M, "]"), "err: ".concat(e))(o), logMessage.info("[".concat(M, "]"), "file deleted successfully")(o)
                  }))) : logMessage.info("[".concat(M, "]"), "The file path does not exist, skipping")(o)
                } catch (e) {
                  logMessage.info("[".concat(M, "]"), "error during deletion: ".concat(e))(o)
                }
                n()
              }))
            }
          };
        t.default = {
          getRotateAngle: function(e) {
            return function() {
              var t = this;
              return new Promise((function(n, o) {
                var r = e.deviceType,
                  i = e.modelNumber,
                  s = void 0 === i ? "-1" : i,
                  a = e.sessionKey,
                  c = {
                    root: {
                      device_type: {
                        $: {
                          key: v.AIO
                        },
                        device: {
                          $: {
                            key: s
                          },
                          function: {
                            $: {
                              key: h.GET_ROTATED
                            }
                          }
                        }
                      }
                    }
                  },
                  u = y(c);
                Promise.resolve().then((function() {
                  var e = "".concat(a);
                  return logMessage.info("[".concat(M, "]"), "getRotateAngle.")(r), t.send({
                    method: "post",
                    deviceType: r,
                    sessionKey: e,
                    xml: u
                  })
                })).then((function(e) {
                  logMessage.info("[".concat(M, "]"), "getRotateAngle successful.")(r);
                  var t = Number(e.payload.replace(/\n/g, "").replace(/\x00/g, "")) || 0;
                  switch (t) {
                    case 0:
                      t = 0;
                      break;
                    case 1:
                      t = 180;
                      break;
                    case 2:
                      t = 90;
                      break;
                    case 3:
                      t = 270;
                      break;
                    default:
                      t /= 4
                  }
                  n({
                    status: 200,
                    payload: t
                  })
                })).catch((function(e) {
                  logMessage.error("[".concat(M, "]"), "getRotateAngle fail. errorMsg: ".concat(e))(r), o({
                    status: 500,
                    payload: {
                      errorCode: g(e)
                    }
                  })
                }))
              }))
            }
          },
          setPower: function(e) {
            return function() {
              var t = this;
              return new Promise((function(n, o) {
                var r = e.deviceType,
                  i = e.modelNumber,
                  s = void 0 === i ? "-1" : i,
                  a = e.sessionKey,
                  c = e.settings.status,
                  u = {
                    root: {
                      device_type: {
                        $: {
                          key: v.AIO
                        },
                        device: {
                          $: {
                            key: s
                          },
                          function: {
                            $: {
                              key: h.SET_POWER_S0
                            },
                            settings: {
                              power: c ? 0 : 1,
                              saving: 1
                            }
                          }
                        }
                      }
                    }
                  },
                  l = y(u);
                Promise.resolve().then((function() {
                  var e = "".concat(a);
                  return logMessage.info("[".concat(M, "]"), "setPower.")(r), t.send({
                    method: "post",
                    deviceType: r,
                    sessionKey: e,
                    xml: l
                  })
                })).then((function() {
                  logMessage.info("[".concat(M, "]"), "setPower successful.")(r), n({
                    status: 200
                  })
                })).catch((function(e) {
                  logMessage.error("[".concat(M, "]"), "setPower fail.")(r), o({
                    status: 500,
                    payload: {
                      errorCode: g(e)
                    }
                  })
                }))
              }))
            }
          },
          setRotation: T,
          setPlayer: function(e) {
            return function() {
              var t = this;
              return new Promise((function(n, r) {
                var i = e.deviceType,
                  a = e.modelNumber,
                  c = e.sessionKey,
                  u = e.settings,
                  l = u.hardware,
                  d = u.media,
                  p = u.banner,
                  m = u.layoutVertical;
                return Promise.resolve().then((function() {
                  if (void 0 !== m) return t.dispatch(T({
                    deviceType: i,
                    modelNumber: a,
                    sessionKey: c,
                    settings: {
                      layoutVertical: m
                    }
                  }))
                })).then((function() {
                  return l ? t.dispatch(function(e) {
                    return function() {
                      var t = this;
                      return new Promise((function(n, o) {
                        var r, i, a, c, u, l, d = "multiHWPlayer",
                          f = e.deviceType,
                          p = e.modelNumber,
                          m = void 0 === p ? "-1" : p,
                          P = e.sessionKey,
                          T = e.settings,
                          I = T.hardware,
                          b = T.playDevice,
                          w = I.backgroundColor,
                          O = I.textColor,
                          S = I.theme,
                          A = I.duration,
                          E = I.slideShow,
                          k = {
                            root: {
                              device_type: {
                                $: {
                                  key: v.AIO
                                },
                                device: {
                                  $: {
                                    key: m
                                  },
                                  function: {
                                    $: {
                                      key: h.SET_PROFILE
                                    },
                                    profiles: {
                                      profile4: {
                                        main: {
                                          single: {
                                            player: {
                                              $: {
                                                key: _.MUTLTI_HW
                                              },
                                              setting: {
                                                play_device: b,
                                                duration: "".concat(A, "000"),
                                                theme: (r = w.r, i = w.g, a = w.b, c = O.r, u = O.g, l = O.b, {
                                                  index: S,
                                                  background: {
                                                    red: r,
                                                    green: i,
                                                    blue: a
                                                  },
                                                  text: {
                                                    red: c,
                                                    green: u,
                                                    blue: l
                                                  }
                                                }),
                                                group: s([], E.map((function(e, t) {
                                                  var n = e.map((function(e, t) {
                                                    return {
                                                      $: {
                                                        key: t
                                                      },
                                                      id: e.key,
                                                      name: e.name,
                                                      default_name: e.default_name,
                                                      type: e.type
                                                    }
                                                  }));
                                                  return {
                                                    $: {
                                                      key: t
                                                    },
                                                    sensor: s([], n, !0)
                                                  }
                                                })), !0)
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          },
                          x = y(k);
                        Promise.resolve().then((function() {
                          var e = "".concat(P);
                          return logMessage.info("[".concat(M, "]"), "".concat(d, " send ..."))(f), t.send({
                            method: "post",
                            deviceType: f,
                            sessionKey: e,
                            xml: x
                          })
                        })).then((function() {
                          logMessage.info("[".concat(M, "]"), "".concat(d, " successful."))(f), n({
                            status: 200
                          })
                        })).catch((function(e) {
                          logMessage.error("[".concat(M, "]"), "".concat(d, " fail."))(f), o({
                            status: 500,
                            payload: {
                              errorCode: g(e)
                            }
                          })
                        }))
                      }))
                    }
                  }(e)) : d ? t.dispatch(function(e) {
                    return function() {
                      var t = this;
                      return new Promise((function(n, r) {
                        var i = e.deviceType,
                          a = e.modelNumber,
                          c = void 0 === a ? "-1" : a,
                          u = e.sessionKey,
                          l = e.settings,
                          d = l.media,
                          p = l.playDevice,
                          m = (f.default.initialData[c].caps.deviceProps || {}).devicePlayRequireAVI,
                          P = void 0 !== m && m,
                          T = d.slideShow,
                          I = d.maxRow,
                          b = d.duration,
                          w = d.clock24,
                          O = {
                            root: {
                              device_type: {
                                $: {
                                  key: v.AIO
                                },
                                device: {
                                  $: {
                                    key: c
                                  },
                                  function: {
                                    $: {
                                      key: h.SET_PROFILE
                                    },
                                    profiles: {
                                      profile4: {
                                        main: {
                                          single: {
                                            player: {
                                              $: {
                                                key: _.MUTLTI_MEDIA
                                              },
                                              setting: {
                                                play_device: p,
                                                display_time: "".concat(b, "000"),
                                                group: s([], T.map((function(e, t) {
                                                  var n = e.type,
                                                    r = e.index_format,
                                                    i = e.category,
                                                    a = e.ext,
                                                    c = e.timeMode,
                                                    u = e.SDKTimeStyleIndex,
                                                    l = e.SDK_type,
                                                    d = e.font,
                                                    f = e.fontColor,
                                                    p = e.fontSize,
                                                    y = e.align,
                                                    g = e.applyToDeviceText,
                                                    v = e.info,
                                                    m = e.hardwareFontTitle,
                                                    h = e.hardwareFontValue,
                                                    _ = e.hardwareFontColorTitle,
                                                    M = e.hardwareFontColorValue,
                                                    T = {};
                                                  switch (n) {
                                                    default:
                                                      return null;
                                                    case "custom":
                                                      var b = "gif" === a ? "1" : "0";
                                                      "gif" === a || "mp4" === a ? (b = "1", P && (b = "2")) : b = "0", "1" === i ? b = "4" : "3" === i && (b = "5"), T = {
                                                        $: {
                                                          key: t
                                                        },
                                                        type: b,
                                                        source: "0",
                                                        index_format: r
                                                      };
                                                      break;
                                                    case "preload":
                                                      var O = "2";
                                                      "1" === i ? O = "4" : "3" === i && (O = "5"), l && (O = l), T = {
                                                        $: {
                                                          key: t
                                                        },
                                                        type: O,
                                                        source: "1",
                                                        index_format: r
                                                      };
                                                      break;
                                                    case "time":
                                                      var S = "1",
                                                        A = w ? "0" : "1";
                                                      c && u && (S = u, A = c), T = {
                                                        $: {
                                                          key: t
                                                        },
                                                        type: "3",
                                                        source: S,
                                                        index_format: A
                                                      }
                                                  }
                                                  if ("1" === i && "time" !== n && (T = o(o({
                                                      $: {
                                                        key: t
                                                      }
                                                    }, T), {
                                                      font: d,
                                                      size: p,
                                                      alignments: y,
                                                      color: {
                                                        red: f.r,
                                                        green: f.g,
                                                        blue: f.b
                                                      },
                                                      text_list: o({}, function(e) {
                                                        for (var t = {}, n = e.split("\n"), o = 0; o < I; o++) t["text_string".concat(o + 1)] = n[o] ? n[o] : "";
                                                        return t
                                                      }(g))
                                                    })), "3" === i && _ && M && v) {
                                                    var E, k = _.r,
                                                      x = _.g,
                                                      $ = _.b,
                                                      N = M.r,
                                                      C = M.g,
                                                      K = M.b,
                                                      D = {
                                                        AVI: "1",
                                                        JPG: "0"
                                                      };
                                                    E = "custom" === n && "jpg" === a ? D.JPG : D.AVI, T = o(o({}, T), {
                                                      bg_type: E,
                                                      text_settings: {
                                                        title: {
                                                          font: m,
                                                          color: {
                                                            red: k,
                                                            green: x,
                                                            blue: $
                                                          }
                                                        },
                                                        value: {
                                                          font: h,
                                                          color: {
                                                            red: N,
                                                            green: C,
                                                            blue: K
                                                          }
                                                        }
                                                      },
                                                      sensor_list: {
                                                        sensor: s([], v.map((function(e, t) {
                                                          return {
                                                            $: {
                                                              key: t
                                                            },
                                                            id: e.key,
                                                            name: e.name,
                                                            default_name: e.default_name,
                                                            type: e.type
                                                          }
                                                        })), !0)
                                                      }
                                                    })
                                                  }
                                                  return T
                                                })), !0)
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          },
                          S = y(O);
                        Promise.resolve().then((function() {
                          var e = "".concat(u);
                          return logMessage.info("[".concat(M, "]"), "multiMediaPlayer.")(i), t.send({
                            method: "post",
                            deviceType: i,
                            sessionKey: e,
                            xml: S
                          })
                        })).then((function() {
                          logMessage.info("[".concat(M, "]"), "multiMediaPlayer successful.")(i), n({
                            status: 200
                          })
                        })).catch((function(e) {
                          logMessage.error("[".concat(M, "]"), "multiMediaPlayer fail.")(i), r({
                            status: 500,
                            payload: {
                              errorCode: g(e)
                            }
                          })
                        }))
                      }))
                    }
                  }(e)) : p ? t.dispatch(function(e) {
                    return function() {
                      var t = this;
                      return new Promise((function(n, r) {
                        var i = e.deviceType,
                          s = e.modelNumber,
                          a = void 0 === s ? "-1" : s,
                          c = e.sessionKey,
                          u = e.settings,
                          l = u.banner,
                          d = u.playDevice,
                          f = l.text,
                          p = l.maxRow,
                          m = l.imageID,
                          _ = {
                            root: {
                              device_type: {
                                $: {
                                  key: v.AIO
                                },
                                device: {
                                  $: {
                                    key: a
                                  },
                                  function: {
                                    $: {
                                      key: h.SET_PROFILE
                                    },
                                    profiles: {
                                      profile4: {
                                        main: {
                                          single: {
                                            player: {
                                              $: {
                                                key: "text_player"
                                              },
                                              setting: {
                                                play_device: d,
                                                play_mode: "2",
                                                text_list: o({
                                                  text_jpg: m
                                                }, function() {
                                                  for (var e = {}, t = f.split("\n"), n = 0; n < p; n++) e["text_string".concat(n + 1)] = t[n] ? t[n] : "";
                                                  return e
                                                }())
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          },
                          P = y(_);
                        Promise.resolve().then((function() {
                          var e = "".concat(c);
                          return logMessage.info("[".concat(M, "]"), "textPlayer.")(i), t.send({
                            method: "post",
                            deviceType: i,
                            sessionKey: e,
                            xml: P
                          })
                        })).then((function() {
                          logMessage.info("[".concat(M, "]"), "textPlayer successful.")(i), n({
                            status: 200
                          })
                        })).catch((function(e) {
                          logMessage.error("[".concat(M, "]"), "textPlayer fail. errorMsg: ".concat(e))(i), r({
                            status: 500,
                            payload: {
                              errorCode: g(e)
                            }
                          })
                        }))
                      }))
                    }
                  }(e)) : void 0
                })).then((function() {
                  logMessage.info("[".concat(M, "]"), "setPlayer finish.")(i), n({
                    status: 200
                  })
                })).catch((function(e) {
                  logMessage.error("[".concat(M, "]"), "setPlayer fail.")(i), r({
                    status: 500,
                    payload: {
                      errorCode: g(e)
                    }
                  })
                }))
              }))
            }
          },
          checkFreeSpaceSize: I,
          cropImage: function(e) {
            return function() {
              var t = this;
              return new Promise((function(n, s) {
                var a, c, u, y = e.deviceType,
                  v = e.modelNumber,
                  m = void 0 === v ? "-1" : v,
                  h = e.settings,
                  _ = ((((f.default || {}).initialData[m] || {}).caps || {}).deviceProps || {}).devicePlayRequireAVI,
                  T = void 0 !== _ && _,
                  O = null != h ? h : {},
                  S = O.mediaIndex,
                  A = O.output,
                  E = O.cropArea,
                  k = O.rotateAngle,
                  x = O.originImageInfo,
                  $ = O.input,
                  N = O.resize,
                  C = JSON.parse(E),
                  K = JSON.parse(x),
                  D = "".concat(pathMapping.proj, "\\view\\").concat(A),
                  R = (0, d.v4)();
                return logMessage.info("[".concat(M, "]"), "input: ".concat($))(y), Promise.resolve().then((function() {
                  l.default.existsSync(D) || l.default.mkdirSync(D, {
                    recursive: !0
                  })
                })).then((function() {
                  return new Promise((function(e, t) {
                    var n;
                    if (n = $, new RegExp("^(https?:\\/\\/)?((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-zA-Z\\d%_.~+]*)*(\\?[;&a-zA-Z\\d%_.~+=-]*)?(\\#[-a-zA-Z\\d_]*)?$", "i").test(n)) {
                      var o = l.default.createWriteStream("".concat(D, "\\").concat(R, ".gif"));
                      p.get($, (function(n) {
                        if (200 !== n.statusCode) return t(new Error("Failed to get '".concat($, "' (").concat(n.statusCode, ")")));
                        n.pipe(o), o.on("finish", (function() {
                          P($) ? c = "".concat(R, ".").concat(P($)) : t(new Error("getExt fail")), e()
                        }))
                      })).on("error", (function(e) {
                        t(e)
                      })), o.on("error", (function() {
                        t(statusCode.WRITE_FILE_FAILED)
                      }))
                    } else l.default.copyFile($, "".concat(D, "\\").concat(R, ".").concat(P($)), (function(n) {
                      if (logMessage.info("[".concat(M, "]"), "Copy Image File: ".concat(R))(y), !n) return c = "".concat(R, ".").concat(P($)), e();
                      t(statusCode.WRITE_FILE_FAILED)
                    }));
                    logMessage.info("[".concat(M, "]"), "".concat(D, "\\").concat(R, ".gif"))(y)
                  }))
                })).then((function() {
                  return r(t, void 0, void 0, (function() {
                    var t, n, r, s, l, d, f, p, g, v, m;
                    return i(this, (function(i) {
                      switch (i.label) {
                        case 0:
                          return logMessage.info("[".concat(M, "]"), "device play require avi: ".concat(T))(y), logMessage.info("[".concat(M, "]"), "ready to crop image file: ".concat(c))(y), logMessage.info("[".concat(M, "]"), "ext: ".concat(P(c)))(y), !T || "gif" !== P($) && "mp4" !== P($) ? [3, 2] : (n = (t = null != C ? C : {}).width, r = t.height, s = t.left, l = t.top, d = null !== (m = JSON.parse(N)) && void 0 !== m ? m : {}, f = d.width, p = d.height, g = {
                            srcPath: "".concat(D, "\\").concat(c),
                            dstPath: "".concat(D, "\\").concat(R, ".avi"),
                            cropInfo: o(o({
                              originImgWidth: K.width,
                              originImgHeight: K.height,
                              rotate: k,
                              cropWidth: n,
                              cropHeight: r,
                              x: s,
                              y: l
                            }, f && {
                              resize_width: f
                            }), p && {
                              resize_height: p
                            })
                          }, [4, this.dispatch(b(e, g))]);
                        case 1:
                          if (200 !== (null == (v = i.sent()) ? void 0 : v.status)) throw logMessage.error("[".concat(M, "]"), "getCroppedImage fail.")(y), new Error("getCroppedImage fail.");
                          a = "".concat(R, ".avi"), u = null == v ? void 0 : v.payload, i.label = 2;
                        case 2:
                          return [2]
                      }
                    }))
                  }))
                })).then((function() {
                  return r(t, void 0, void 0, (function() {
                    var t, n, r, s, l, d, f, p, g;
                    return i(this, (function(i) {
                      switch (i.label) {
                        case 0:
                          return void 0 !== a ? [3, 2] : (t = C.width, n = C.height, r = C.left, s = C.top, l = JSON.parse(N), d = l.width, f = l.height, p = {
                            srcPath: "".concat(D, "\\").concat(c),
                            dstPath: "".concat(D, "\\").concat(c),
                            cropInfo: o(o({
                              originImgWidth: K.width,
                              originImgHeight: K.height,
                              rotate: k,
                              cropWidth: t,
                              cropHeight: n,
                              x: r,
                              y: s
                            }, d && {
                              resize_width: d
                            }), f && {
                              resize_height: f
                            })
                          }, [4, this.dispatch(b(e, p))]);
                        case 1:
                          if (200 !== (null == (g = i.sent()) ? void 0 : g.status)) throw logMessage.error("[".concat(M, "]"), "getCroppedImage fail.")(y), new Error("getCroppedImage fail.");
                          a = c, u = null == g ? void 0 : g.payload, i.label = 2;
                        case 2:
                          return [2]
                      }
                    }))
                  }))
                })).then((function() {
                  return t.dispatch(I(e, u))
                })).then((function() {
                  return logMessage.info("[".concat(M, "]"), "ready to media transfer file: ".concat(a))(y), t.dispatch(f.default.mediaTransfer(e, {
                    filePath: "".concat(A, "\\").concat(a),
                    mediaIndex: S
                  }))
                })).then((function() {
                  logMessage.info("[".concat(M, "]"), "cropImage finish.")(y), n({
                    status: 200,
                    payload: {
                      fileName: R,
                      ext: P(c)
                    }
                  })
                })).catch((function(n) {
                  logMessage.error("[".concat(M, "]"), "cropImage fail.")(y), t.dispatch(w(e, "".concat(A, "\\").concat(R, ".").concat(P($)))), s({
                    status: 500,
                    payload: {
                      errorCode: g(n)
                    }
                  })
                })).finally((function() {
                  l.default.existsSync("".concat(pathMapping.proj, "\\view\\").concat(A, "\\").concat(R, ".avi")) && t.dispatch(w(e, "".concat(A, "\\").concat(R, ".avi")))
                }))
              }))
            }
          },
          deleteImage: function(e) {
            return function() {
              var t = this;
              return new Promise((function(n, o) {
                var r, i = e.deviceType,
                  s = e.settings,
                  a = s.ext,
                  c = s.mediaIndex,
                  u = s.saveImageFilePath,
                  l = s.fileName,
                  d = "";
                return l ? (d = "".concat(u, "\\").concat(l, ".").concat(a), r = {
                  ext: a,
                  mediaIndex: c
                }) : d = "".concat(u), Promise.resolve().then((function() {
                  return t.dispatch(function(e, t) {
                    return function() {
                      var n = this;
                      return new Promise((function(o, r) {
                        var i, s = e.deviceType,
                          a = e.modelNumber,
                          c = void 0 === a ? "-1" : a,
                          u = e.sessionKey,
                          l = (f.default.initialData[c].caps.deviceProps || {}).devicePlayRequireAVI,
                          d = void 0 !== l && l;
                        i = t ? {
                          type: "jpg" === t.ext ? "0" : d ? "2" : "1",
                          mediaIndex: t.mediaIndex
                        } : {
                          type: "99",
                          mediaIndex: "99"
                        };
                        var p = {
                            root: {
                              device_type: {
                                $: {
                                  key: v.AIO
                                },
                                device: {
                                  $: {
                                    key: c
                                  },
                                  function: {
                                    $: {
                                      key: h.MEDIA_DELETE
                                    },
                                    settings: {
                                      media_delete: {
                                        type: i.type,
                                        index: i.mediaIndex
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          },
                          m = y(p);
                        Promise.resolve().then((function() {
                          var e = "".concat(u);
                          return logMessage.info("[".concat(M, "]"), "mediaDelete.")(s), n.send({
                            method: "post",
                            deviceType: s,
                            sessionKey: e,
                            xml: m
                          })
                        })).then((function() {
                          logMessage.info("[".concat(M, "]"), "mediaDelete successful.")(s), o({
                            status: 200
                          })
                        })).catch((function(e) {
                          logMessage.error("[".concat(M, "]"), "mediaDelete fail.")(s), r({
                            status: 500,
                            payload: {
                              errorCode: g(e)
                            }
                          })
                        }))
                      }))
                    }
                  }(e, r))
                })).then((function() {
                  return t.dispatch(w(e, d))
                })).then((function() {
                  logMessage.info("[".concat(M, "]"), "deleteImage finish.")(i), n({
                    status: 200
                  })
                })).catch((function(e) {
                  logMessage.error("[".concat(M, "]"), "deleteImage fail.")(i), o({
                    status: 500,
                    payload: {
                      errorCode: g(e)
                    }
                  })
                }))
              }))
            }
          },
          applyStandbymode: function(e) {
            return function() {
              var t = this;
              return new Promise((function(n, o) {
                var r = e.deviceType,
                  i = (e.settings || {}).brightness;
                return Promise.resolve().then((function() {
                  return t.dispatch(function(e) {
                    return function() {
                      var t = this;
                      return new Promise((function(n, o) {
                        var r, i = e.deviceType,
                          s = e.modelNumber,
                          a = void 0 === s ? "-1" : s,
                          c = e.sessionKey,
                          u = e.settings,
                          l = (f.default.initialData[a].caps.deviceProps || {}).devicePlayRequireAVI,
                          d = void 0 !== l && l,
                          p = u.imageInfo,
                          m = p.type,
                          _ = p.index_format,
                          P = p.ext,
                          T = p.source,
                          I = {
                            root: {
                              device_type: {
                                $: {
                                  key: v.AIO
                                },
                                device: {
                                  $: {
                                    key: a
                                  },
                                  function: {
                                    $: {
                                      key: h.SET_BOOT_IMAGE
                                    },
                                    settings: {
                                      boot_image: (r = function() {
                                        switch (m) {
                                          case "custom":
                                            var e = "17";
                                            return "gif" !== P && "mp4" !== P || (e = "16", d && (e = "20")), {
                                              mode: e,
                                              source: "1"
                                            };
                                          case "preload":
                                            return e = "20", "jpg" === P && (e = "17"), {
                                              mode: e,
                                              source: "0"
                                            };
                                          case "time":
                                            return {
                                              mode: "8", source: T
                                            };
                                          default:
                                            throw new Error("type => ".concat(m))
                                        }
                                      }, {
                                        mode: r().mode,
                                        source: r().source,
                                        index: _
                                      })
                                    }
                                  }
                                }
                              }
                            }
                          },
                          b = y(I);
                        Promise.resolve().then((function() {
                          var e = "".concat(c);
                          return logMessage.info("[".concat(M, "]"), "standbyModeBootsAnimation.")(i), t.send({
                            method: "post",
                            deviceType: i,
                            sessionKey: e,
                            xml: b
                          })
                        })).then((function() {
                          logMessage.info("[".concat(M, "]"), "standbyModeBootsAnimation successful.")(i), n({
                            status: 200
                          })
                        })).catch((function(e) {
                          logMessage.error("[".concat(M, "]"), "standbyModeBootsAnimation fail.")(i), o({
                            status: 500,
                            payload: {
                              errorCode: g(e)
                            }
                          })
                        }))
                      }))
                    }
                  }(e))
                })).then((function() {
                  return t.dispatch(function(e) {
                    return function() {
                      var t = this;
                      return new Promise((function(n, o) {
                        var r, i = e.deviceType,
                          s = e.modelNumber,
                          a = void 0 === s ? "-1" : s,
                          c = e.sessionKey,
                          u = e.settings,
                          l = u.standbymodeStatus,
                          d = u.brightness,
                          f = l ? "1" : "0",
                          p = "1" === f ? null !== (r = null == d ? void 0 : d.s5) && void 0 !== r ? r : d : "0",
                          m = {
                            root: {
                              device_type: {
                                $: {
                                  key: v.AIO
                                },
                                device: {
                                  $: {
                                    key: a
                                  },
                                  function: {
                                    $: {
                                      key: h.SET_STANDBYMODE
                                    },
                                    settings: {
                                      standby: {
                                        enable: f,
                                        brightness: p
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          },
                          _ = y(m);
                        Promise.resolve().then((function() {
                          var e = "".concat(c);
                          return logMessage.info("[".concat(M, "]"), "standbyModeBrightness.")(i), t.send({
                            method: "post",
                            deviceType: i,
                            sessionKey: e,
                            xml: _
                          })
                        })).then((function() {
                          logMessage.info("[".concat(M, "]"), "standbyModeBrightness successful.")(i), n({
                            status: 200
                          })
                        })).catch((function(e) {
                          logMessage.error("[".concat(M, "]"), "standbyModeBrightness fail.")(i), o({
                            status: 500,
                            payload: {
                              errorCode: g(e)
                            }
                          })
                        }))
                      }))
                    }
                  }(e))
                })).then((function() {
                  if ("object" == typeof i) return t.dispatch(f.default.setBrightness(e))
                })).then((function() {
                  return t.dispatch(function(e) {
                    return function() {
                      var t = this;
                      return new Promise((function(n, o) {
                        var r = e.deviceType,
                          i = e.modelNumber,
                          s = void 0 === i ? "-1" : i,
                          a = e.sessionKey,
                          c = e.settings,
                          u = c.warringStatus,
                          l = c.temperature,
                          d = c.playDevice,
                          f = {
                            root: {
                              device_type: {
                                $: {
                                  key: v.AIO
                                },
                                device: {
                                  $: {
                                    key: s
                                  },
                                  function: {
                                    $: {
                                      key: h.SET_PROFILE
                                    },
                                    profiles: {
                                      profile5: {
                                        main: {
                                          single: {
                                            player: {
                                              $: {
                                                key: _.WARNING
                                              },
                                              setting: {
                                                play_device: d,
                                                enable: u ? "1" : "0",
                                                wait_time: "3000",
                                                threshold: l
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          },
                          p = y(f);
                        Promise.resolve().then((function() {
                          var e = "".concat(a);
                          return logMessage.info("[".concat(M, "]"), "standbyModeTemperature.")(r), t.send({
                            method: "post",
                            deviceType: r,
                            sessionKey: e,
                            xml: p
                          })
                        })).then((function() {
                          logMessage.info("[".concat(M, "]"), "standbyModeTemperature successful.")(r), n({
                            status: 200
                          })
                        })).catch((function(e) {
                          logMessage.error("[".concat(M, "]"), "onDeleteFile fail.")(r), o({
                            status: 500,
                            payload: {
                              errorCode: g(e)
                            }
                          })
                        }))
                      }))
                    }
                  }(e))
                })).then((function() {
                  logMessage.info("[".concat(M, "]"), "applyStandbymode finish.")(r), n({
                    status: 200
                  })
                })).catch((function(e) {
                  logMessage.error("[".concat(M, "]"), "applyStandbymode fail.")(r), o({
                    status: 500,
                    payload: {
                      errorCode: g(e)
                    }
                  })
                }))
              }))
            }
          }
        }
      },
      797: function(e, t, n) {
        var o = this && this.__assign || function() {
            return o = Object.assign || function(e) {
              for (var t, n = 1, o = arguments.length; n < o; n++)
                for (var r in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
              return e
            }, o.apply(this, arguments)
          },
          r = this && this.__importDefault || function(e) {
            return e && e.__esModule ? e : {
              default: e
            }
          };
        Object.defineProperty(t, "__esModule", {
          value: !0
        });
        var i = r(n(79)),
          s = r(n(770)),
          a = utility.parseJSON2XML,
          c = utility.parseXML2JSON,
          u = utility.parseErrorCode,
          l = i.default.peripheralDevice,
          d = i.default.deviceNameMapping,
          f = s.default.functionNumber,
          p = d[l.AIO] || l.AIO,
          y = r(n(200)),
          g = function(e) {
            return function() {
              var t = this;
              return new Promise((function(n, o) {
                var r = e.deviceType,
                  i = e.modelNumber,
                  s = e.sessionKey,
                  c = {
                    root: {
                      device_type: {
                        $: {
                          key: l.AIO
                        },
                        device: {
                          $: {
                            key: i
                          },
                          function: {
                            $: {
                              key: f.GET_CPU_TEMP
                            }
                          }
                        }
                      }
                    }
                  },
                  d = a(c);
                Promise.resolve().then((function() {
                  var e = "".concat(s);
                  return logMessage.info("[".concat(p, "]"), "getCpuTemp.")(r), t.send({
                    method: "post",
                    deviceType: r,
                    sessionKey: e,
                    xml: d
                  })
                })).then((function(e) {
                  logMessage.info("[".concat(p, "]"), "getCpuTemp successful.")(r), n({
                    status: 200,
                    payload: null == e ? void 0 : e.payload
                  })
                })).catch((function(e) {
                  o({
                    status: 500,
                    payload: {
                      errorCode: u(e)
                    }
                  })
                }))
              }))
            }
          },
          v = function(e) {
            return function() {
              var t = this;
              return new Promise((function(n, o) {
                var r, i = e.deviceType,
                  s = e.modelNumber,
                  d = void 0 === s ? "-1" : s,
                  g = e.sessionKey,
                  v = (null !== (r = (null !== y.default && void 0 !== y.default ? y.default : {}).initialData[d]) && void 0 !== r ? r : {}).caps,
                  m = (null != v ? v : {}).deviceProps.SDK_getFanRPM,
                  h = void 0 === m ? "63" : m,
                  _ = {
                    root: {
                      device_type: {
                        $: {
                          key: l.AIO
                        },
                        device: {
                          $: {
                            key: d
                          },
                          function: {
                            $: {
                              key: f.GET_FANPUMPRPM
                            },
                            settings: {
                              rpm_data: {
                                type: h
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  M = a(_);
                Promise.resolve().then((function() {
                  var e = "".concat(g);
                  return logMessage.info("[".concat(p, "]"), "getFanPumpRPM.")(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: M
                  })
                })).then((function(e) {
                  return c(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(p, "]"), "getFanPumpRPM successful.")(i), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  o({
                    status: 500,
                    payload: {
                      errorCode: u(e)
                    }
                  })
                }))
              }))
            }
          };
        t.default = {
          getCpuTemp: g,
          getFanPumpRPM: v,
          getInfo: function(e) {
            return function() {
              var t = this;
              return new Promise((function(n, o) {
                var r = e.deviceType,
                  i = {
                    temp: "",
                    rpm: []
                  };
                Promise.resolve().then((function() {
                  return t.dispatch(g(e))
                })).then((function(e) {
                  var t = e.payload.replace(/\n/g, "").replace(/\x00/g, "");
                  i.temp = t
                })).then((function() {
                  return t.dispatch(v(e))
                })).then((function(e) {
                  var t;
                  i.rpm = null === (t = null == e ? void 0 : e.payload) || void 0 === t ? void 0 : t.rpm
                })).then((function() {
                  logMessage.info("[".concat(p, "]"), "getInfo successful.")(r), n({
                    status: 200,
                    payload: i
                  })
                })).catch((function(e) {
                  o({
                    status: 500,
                    payload: {
                      errorCode: u(e)
                    }
                  })
                }))
              }))
            }
          },
          setFanSettings: function(e) {
            return function() {
              var t = this;
              return new Promise((function(n, r) {
                var i, s = e.deviceType,
                  c = e.modelNumber,
                  d = e.sessionKey,
                  y = e.settings,
                  g = y.fanSettings,
                  v = y.pumpSettings,
                  m = {
                    playDevice: y.playDevice || function() {
                      switch (c) {
                        case "6279":
                        case "6318":
                          return "AIO_PANEL";
                        case "6752":
                        case "6536":
                          return "AIO2_PANEL";
                        default:
                          return "AIO_LED"
                      }
                    }(),
                    fanList: (i = {}, g && (i.fan = g), v && (i.pump = v), i)
                  },
                  h = {
                    root: {
                      device_type: {
                        $: {
                          key: l.AIO
                        },
                        device: {
                          $: {
                            key: c
                          },
                          function: {
                            $: {
                              key: f.SET_PROFILE
                            },
                            profiles: {
                              profile3: {
                                main: {
                                  single: {
                                    player: {
                                      $: {
                                        key: "fan_player"
                                      },
                                      setting: {
                                        play_device: m.playDevice,
                                        wait_time: "3000",
                                        fan_list: o({}, m.fanList)
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  _ = a(h);
                Promise.resolve().then((function() {
                  var e = "".concat(d);
                  return logMessage.info("[".concat(p, "]"), "setFanSettings.")(s), t.send({
                    method: "post",
                    deviceType: s,
                    sessionKey: e,
                    xml: _
                  })
                })).then((function() {
                  logMessage.info("[".concat(p, "]"), "setFanSettings successful.")(s), n({
                    status: 200
                  })
                })).catch((function(e) {
                  r({
                    status: 500,
                    payload: {
                      errorCode: u(e)
                    }
                  })
                }))
              }))
            }
          },
          fanTuning: function(e) {
            return function() {
              var t = this;
              return new Promise((function(n, o) {
                var r = e.deviceType,
                  i = e.modelNumber,
                  s = e.sessionKey,
                  d = e.settings.isOpen,
                  y = {
                    root: {
                      device_type: {
                        $: {
                          key: l.AIO
                        },
                        device: {
                          $: {
                            key: i
                          },
                          function: {
                            $: {
                              key: f.SET_FANTUNING
                            },
                            settings: {
                              fan_tuning: d ? "1" : "0"
                            }
                          }
                        }
                      }
                    }
                  },
                  g = a(y);
                Promise.resolve().then((function() {
                  var e = "".concat(s);
                  return logMessage.info("[".concat(p, "]"), "fanTuning.")(r), t.send({
                    method: "post",
                    deviceType: r,
                    sessionKey: e,
                    xml: g
                  })
                })).then((function(e) {
                  return c(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(p, "]"), "fanTuning successful.")(r), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  o({
                    status: 500,
                    payload: {
                      errorCode: u(e)
                    }
                  })
                }))
              }))
            }
          }
        }
      },
      607: function(e, t, n) {
        var o = this && this.__assign || function() {
            return o = Object.assign || function(e) {
              for (var t, n = 1, o = arguments.length; n < o; n++)
                for (var r in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
              return e
            }, o.apply(this, arguments)
          },
          r = this && this.__importDefault || function(e) {
            return e && e.__esModule ? e : {
              default: e
            }
          };
        Object.defineProperty(t, "__esModule", {
          value: !0
        });
        var i = r(n(873)),
          s = r(n(79)),
          a = global,
          c = s.default.peripheralDevice,
          u = s.default.errorCodePlugin,
          l = a.statusCode,
          d = a.errorCode;
        a.statusCode = o(o(o({}, d), l), u), t.default = {
          router: i.default,
          deviceType: c.AIO,
          shouldPreload: !0
        }
      },
      498: function(e, t, n) {
        var o = this && this.__assign || function() {
            return o = Object.assign || function(e) {
              for (var t, n = 1, o = arguments.length; n < o; n++)
                for (var r in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
              return e
            }, o.apply(this, arguments)
          },
          r = this && this.__spreadArray || function(e, t, n) {
            if (n || 2 === arguments.length)
              for (var o, r = 0, i = t.length; r < i; r++) !o && r in t || (o || (o = Array.prototype.slice.call(t, 0, r)), o[r] = t[r]);
            return e.concat(o || Array.prototype.slice.call(t))
          },
          i = this && this.__importDefault || function(e) {
            return e && e.__esModule ? e : {
              default: e
            }
          };
        Object.defineProperty(t, "__esModule", {
          value: !0
        });
        var s = i(n(79)),
          a = i(n(770)),
          c = utility.parseJSON2XML,
          u = utility.parseXML2JSON,
          l = utility.parseErrorCode,
          d = s.default.peripheralDevice,
          f = s.default.deviceNameMapping,
          p = a.default.functionNumber,
          y = f[d.AIO] || d.AIO;
        t.default = {
          onApplyHardwareMonitor: function(e) {
            return function() {
              var t = this;
              return new Promise((function(n, o) {
                var i, s, a, u, f, g, v, m, h = e.deviceType,
                  _ = e.modelNumber,
                  M = void 0 === _ ? "-1" : _,
                  P = e.sessionKey,
                  T = e.settings,
                  I = T.customColors,
                  b = T.themes,
                  w = T.seconds,
                  O = T.slideShow,
                  S = {
                    root: {
                      device_type: {
                        $: {
                          key: d.AIO
                        },
                        device: {
                          $: {
                            key: M
                          },
                          function: {
                            $: {
                              key: p.SET_PROFILE
                            },
                            profiles: {
                              profile4: {
                                main: {
                                  single: {
                                    player: {
                                      $: {
                                        key: "multi_hw_monitor_player"
                                      },
                                      setting: {
                                        play_device: "AIO2_PANEL",
                                        duration: w.selected.replace("s", "000"),
                                        theme: (i = I.background, s = I.text, a = i.r, u = i.g, f = i.b, g = s.r, v = s.g, m = s.b, {
                                          index: b.selected,
                                          background: {
                                            red: a,
                                            green: u,
                                            blue: f
                                          },
                                          text: {
                                            red: g,
                                            green: v,
                                            blue: m
                                          }
                                        }),
                                        group: r([], O.map((function(e, t) {
                                          var n = e.infoGroup.map((function(e, t) {
                                            var n = e.left,
                                              o = e.right,
                                              r = n.data.find((function(e) {
                                                return e.active
                                              })),
                                              i = o.data.find((function(e) {
                                                return e.active
                                              }));
                                            return {
                                              $: {
                                                key: t
                                              },
                                              id: i.key,
                                              name: i.name,
                                              default_name: i.default_name,
                                              type: r.type
                                            }
                                          }));
                                          return {
                                            $: {
                                              key: t
                                            },
                                            sensor: r([], n, !0)
                                          }
                                        })), !0)
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  A = c(S);
                Promise.resolve().then((function() {
                  var e = "".concat(P);
                  return logMessage.info("[".concat(y, "]"), "onApplyHardwareMonitor.")(h), t.send({
                    method: "post",
                    deviceType: h,
                    sessionKey: e,
                    xml: A
                  })
                })).then((function() {
                  logMessage.info("[".concat(y, "]"), "onApplyHardwareMonitor successful.")(h), n({
                    status: 200
                  })
                })).catch((function(e) {
                  logMessage.error("[".concat(y, "]"), "onApplyHardwareMonitor fail. errorMsg: ".concat(e))(h), o({
                    status: 500,
                    payload: {
                      errorCode: l(e)
                    }
                  })
                }))
              }))
            }
          },
          onApplyImageOrAnimation: function(e) {
            return function() {
              var t = this;
              return new Promise((function(n, o) {
                var i, s = e.deviceType,
                  a = e.modelNumber,
                  u = void 0 === a ? "-1" : a,
                  f = e.sessionKey,
                  g = e.settings.slideShow,
                  v = {
                    root: {
                      device_type: {
                        $: {
                          key: d.AIO
                        },
                        device: {
                          $: {
                            key: u
                          },
                          function: {
                            $: {
                              key: p.SET_PROFILE
                            },
                            profiles: {
                              profile4: {
                                main: {
                                  single: {
                                    player: {
                                      $: {
                                        key: "multi_media_player"
                                      },
                                      setting: {
                                        play_device: "AIO2_PANEL",
                                        group: r([], (i = g.map((function(e, t) {
                                          var n = e.data,
                                            o = n.index_format,
                                            r = n.type;
                                          return {
                                            $: {
                                              key: t
                                            },
                                            type: function() {
                                              switch (r) {
                                                case "custom":
                                                  return "gif" === n.name.split(".")[n.name.split(".").length - 1] ? "1" : "0";
                                                case "preload":
                                                  return "2";
                                                case "time":
                                                  return "3";
                                                default:
                                                  return null
                                              }
                                            }(),
                                            source: "custom" === r ? "0" : "1",
                                            index_format: Number(o)
                                          }
                                        })), i), !0)
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  m = c(v);
                Promise.resolve().then((function() {
                  var e = "".concat(f);
                  return logMessage.info("[".concat(y, "]"), "onApplyImageOrAnimation.")(s), t.send({
                    method: "post",
                    deviceType: s,
                    sessionKey: e,
                    xml: m
                  })
                })).then((function() {
                  logMessage.info("[".concat(y, "]"), "onApplyImageOrAnimation successful.")(s), n({
                    status: 200
                  })
                })).catch((function(e) {
                  logMessage.error("[".concat(y, "]"), "onApplyImageOrAnimation fail. errorMsg: ".concat(e))(s), o({
                    status: 500,
                    payload: {
                      errorCode: l(e)
                    }
                  })
                }))
              }))
            }
          },
          onApplyCustomBanner: function(e) {
            return function() {
              var t = this;
              return new Promise((function(n, r) {
                var i, s = e.deviceType,
                  a = e.modelNumber,
                  u = void 0 === a ? "-1" : a,
                  f = e.sessionKey,
                  g = e.settings,
                  v = g.currentText,
                  m = g.backgroundImages.find((function(e) {
                    return e.active
                  })).sendType,
                  h = v.split("\n"),
                  _ = {
                    root: {
                      device_type: {
                        $: {
                          key: d.AIO
                        },
                        device: {
                          $: {
                            key: u
                          },
                          function: {
                            $: {
                              key: p.SET_PROFILE
                            },
                            profiles: {
                              profile4: {
                                main: {
                                  single: {
                                    player: {
                                      $: {
                                        key: "text_player"
                                      },
                                      setting: {
                                        play_device: "AIO2_PANEL",
                                        play_mode: "2",
                                        text_list: o({
                                          text_jpg: m
                                        }, (i = {}, i.text_string1 = h[0] || "", i.text_string2 = h[1] || "", i.text_string3 = h[2] || "", i.text_string4 = h[3] || "", i.text_string5 = h[4] || "", i.text_string6 = h[5] || "", i))
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  M = c(_);
                Promise.resolve().then((function() {
                  var e = "".concat(f);
                  return logMessage.info("[".concat(y, "]"), "onApplyCustomBanner.")(s), t.send({
                    method: "post",
                    deviceType: s,
                    sessionKey: e,
                    xml: M
                  })
                })).then((function() {
                  logMessage.info("[".concat(y, "]"), "onApplyCustomBanner successful.")(s), n({
                    status: 200
                  })
                })).catch((function(e) {
                  logMessage.error("[".concat(y, "]"), "onApplyCustomBanner fail. errorMsg: ".concat(e))(s), r({
                    status: 500,
                    payload: {
                      errorCode: l(e)
                    }
                  })
                }))
              }))
            }
          },
          isPowerOnS0: function(e) {
            return function() {
              var t = this;
              return new Promise((function(n, o) {
                var r = e.deviceType,
                  i = e.modelNumber,
                  s = void 0 === i ? "-1" : i,
                  a = e.sessionKey,
                  u = {
                    root: {
                      device_type: {
                        $: {
                          key: d.AIO
                        },
                        device: {
                          $: {
                            key: s
                          },
                          function: {
                            $: {
                              key: p.ISPOWER_S0
                            }
                          }
                        }
                      }
                    }
                  },
                  f = c(u);
                Promise.resolve().then((function() {
                  var e = "".concat(a);
                  return logMessage.info("[".concat(y, "]"), "isPowerOnS0.")(r), t.send({
                    method: "post",
                    deviceType: r,
                    sessionKey: e,
                    xml: f
                  })
                })).then((function(e) {
                  logMessage.info("[".concat(y, "]"), "isPowerOnS0 successful.")(r), n({
                    status: 200,
                    payload: e.payload
                  })
                })).catch((function(e) {
                  logMessage.error("[".concat(y, "]"), "isPowerOnS0 fail. errorMsg: ".concat(e))(r), o({
                    status: 500,
                    payload: {
                      errorCode: l(e)
                    }
                  })
                }))
              }))
            }
          },
          getCapbility: function(e) {
            return function() {
              var t = this;
              return new Promise((function(n, o) {
                var r = e.deviceType,
                  i = e.modelNumber,
                  s = void 0 === i ? "-1" : i,
                  a = e.sessionKey,
                  f = {
                    root: {
                      device_type: {
                        $: {
                          key: d.AIO
                        },
                        device: {
                          $: {
                            key: s
                          },
                          function: {
                            $: {
                              key: p.GET_CAPBILITY
                            }
                          }
                        }
                      }
                    }
                  },
                  g = c(f);
                Promise.resolve().then((function() {
                  var e = "".concat(a);
                  return logMessage.info("[".concat(y, "]"), "getCapbility.")(r), t.send({
                    method: "post",
                    deviceType: r,
                    sessionKey: e,
                    xml: g
                  })
                })).then((function(e) {
                  return u(e.payload)
                })).then((function(e) {
                  logMessage.info("[".concat(y, "]"), "getCapbility successful.")(r), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  logMessage.error("[".concat(y, "]"), "getCapbility fail. errorMsg: ".concat(e))(r), o({
                    status: 500,
                    payload: {
                      errorCode: l(e)
                    }
                  })
                }))
              }))
            }
          },
          setPowerS0: function(e) {
            return function() {
              var t = this;
              return new Promise((function(n, o) {
                var r = e.deviceType,
                  i = e.modelNumber,
                  s = void 0 === i ? "-1" : i,
                  a = e.sessionKey,
                  u = e.settings.powerS0,
                  f = {
                    root: {
                      device_type: {
                        $: {
                          key: d.AIO
                        },
                        device: {
                          $: {
                            key: s
                          },
                          function: {
                            $: {
                              key: p.SET_POWER_S0
                            },
                            settings: {
                              power: u ? 0 : 1,
                              saving: 1
                            }
                          }
                        }
                      }
                    }
                  },
                  g = c(f);
                Promise.resolve().then((function() {
                  var e = "".concat(a);
                  return logMessage.info("[".concat(y, "]"), "setPowerS0.")(r), t.send({
                    method: "post",
                    deviceType: r,
                    sessionKey: e,
                    xml: g
                  })
                })).then((function() {
                  logMessage.info("[".concat(y, "]"), "setPowerS0 successful.")(r), n({
                    status: 200
                  })
                })).catch((function(e) {
                  logMessage.error("[".concat(y, "]"), "setPowerS0 fail. errorMsg: ".concat(e))(r), o({
                    status: 500,
                    payload: {
                      errorCode: l(e)
                    }
                  })
                }))
              }))
            }
          },
          setRotation: function(e) {
            return function() {
              var t = this;
              return new Promise((function(n, o) {
                var r = e.deviceType,
                  i = e.modelNumber,
                  s = void 0 === i ? "-1" : i,
                  a = e.sessionKey,
                  u = e.settings.layoutVertical,
                  f = {
                    root: {
                      device_type: {
                        $: {
                          key: d.AIO
                        },
                        device: {
                          $: {
                            key: s
                          },
                          function: {
                            $: {
                              key: p.SET_ROTATION
                            },
                            settings: {
                              rotation: u ? 2 : 0,
                              saving: 1
                            }
                          }
                        }
                      }
                    }
                  },
                  g = c(f);
                Promise.resolve().then((function() {
                  var e = "".concat(a);
                  return logMessage.info("[".concat(y, "]"), "setRotation.")(r), t.send({
                    method: "post",
                    deviceType: r,
                    sessionKey: e,
                    xml: g
                  })
                })).then((function() {
                  logMessage.info("[".concat(y, "]"), "setRotation successful.")(r), n({
                    status: 200
                  })
                })).catch((function(e) {
                  logMessage.error("[".concat(y, "]"), "setRotation fail. errorMsg: ".concat(e))(r), o({
                    status: 500,
                    payload: {
                      errorCode: l(e)
                    }
                  })
                }))
              }))
            }
          },
          standbyModeBootsAnimation: function(e) {
            return function() {
              var t = this;
              return new Promise((function(n, o) {
                var r, i, s, a = e.deviceType,
                  u = e.modelNumber,
                  f = void 0 === u ? "-1" : u,
                  g = e.sessionKey,
                  v = e.settings.selectedPreloadImageName,
                  m = {
                    root: {
                      device_type: {
                        $: {
                          key: d.AIO
                        },
                        device: {
                          $: {
                            key: f
                          },
                          function: {
                            $: {
                              key: p.SET_BOOT_IMAGE
                            },
                            settings: {
                              boot_image: (r = v.type, i = v.index_format, s = v.name, {
                                mode: function() {
                                  switch (r) {
                                    case "preload":
                                      return "20";
                                    case "custom":
                                      return "gif" === s.split(".")[s.split(".").length - 1] ? "16" : "17";
                                    default:
                                      return null
                                  }
                                }(),
                                source: function() {
                                  switch (r) {
                                    case "preload":
                                      return "0";
                                    case "custom":
                                      return "1";
                                    default:
                                      return null
                                  }
                                }(),
                                index: i
                              })
                            }
                          }
                        }
                      }
                    }
                  },
                  h = c(m);
                Promise.resolve().then((function() {
                  var e = "".concat(g);
                  return logMessage.info("[".concat(y, "]"), "standbyModeBootsAnimation.")(a), t.send({
                    method: "post",
                    deviceType: a,
                    sessionKey: e,
                    xml: h
                  })
                })).then((function() {
                  logMessage.info("[".concat(y, "]"), "standbyModeBootsAnimation successful.")(a), n({
                    status: 200
                  })
                })).catch((function(e) {
                  logMessage.error("[".concat(y, "]"), "standbyModeBootsAnimation fail. errorMsg: ".concat(e))(a), o({
                    status: 500,
                    payload: {
                      errorCode: l(e)
                    }
                  })
                }))
              }))
            }
          },
          standbyModeBrightness: function(e) {
            return function() {
              var t = this;
              return new Promise((function(n, o) {
                var r = e.deviceType,
                  i = e.modelNumber,
                  s = void 0 === i ? "-1" : i,
                  a = e.sessionKey,
                  u = e.settings,
                  f = u.powerS0,
                  g = u.standbymodeSettings,
                  v = g.brightness,
                  m = g.standbyMode,
                  h = !!f && m,
                  _ = {
                    root: {
                      device_type: {
                        $: {
                          key: d.AIO
                        },
                        device: {
                          $: {
                            key: s
                          },
                          function: {
                            $: {
                              key: p.SET_STANDBYMODE
                            },
                            settings: {
                              standby: {
                                enable: h ? "1" : "0",
                                brightness: v
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  M = c(_);
                Promise.resolve().then((function() {
                  var e = "".concat(a);
                  return logMessage.info("[".concat(y, "]"), "standbyModeBrightness.")(r), t.send({
                    method: "post",
                    deviceType: r,
                    sessionKey: e,
                    xml: M
                  })
                })).then((function() {
                  logMessage.info("[".concat(y, "]"), "standbyModeBrightness successful.")(r), n({
                    status: 200
                  })
                })).catch((function(e) {
                  logMessage.error("[".concat(y, "]"), "standbyModeBrightness fail. errorMsg: ".concat(e))(r), o({
                    status: 500,
                    payload: {
                      errorCode: l(e)
                    }
                  })
                }))
              }))
            }
          },
          standbyModeTemperature: function(e) {
            return function() {
              var t = this;
              return new Promise((function(n, o) {
                var r = e.deviceType,
                  i = e.modelNumber,
                  s = void 0 === i ? "-1" : i,
                  a = e.sessionKey,
                  u = e.settings,
                  f = u.powerS0,
                  g = u.standbymodeSettings,
                  v = g.warring,
                  m = g.temperature,
                  h = !!f && v,
                  _ = {
                    root: {
                      device_type: {
                        $: {
                          key: d.AIO
                        },
                        device: {
                          $: {
                            key: s
                          },
                          function: {
                            $: {
                              key: p.SET_PROFILE
                            },
                            profiles: {
                              profile5: {
                                main: {
                                  single: {
                                    player: {
                                      $: {
                                        key: "warning_player"
                                      },
                                      setting: {
                                        play_device: "AIO2_PANEL",
                                        enable: h ? "1" : "0",
                                        wait_time: "3000",
                                        threshold: m
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  M = c(_);
                Promise.resolve().then((function() {
                  var e = "".concat(a);
                  return logMessage.info("[".concat(y, "]"), "standbyModeTemperature.")(r), t.send({
                    method: "post",
                    deviceType: r,
                    sessionKey: e,
                    xml: M
                  })
                })).then((function() {
                  logMessage.info("[".concat(y, "]"), "standbyModeTemperature successful.")(r), n({
                    status: 200
                  })
                })).catch((function(e) {
                  logMessage.error("[".concat(y, "]"), "onDeleteFile fail. errorMsg: ".concat(e))(r), o({
                    status: 500,
                    payload: {
                      errorCode: l(e)
                    }
                  })
                }))
              }))
            }
          },
          onDeleteFile: function(e) {
            return function() {
              var t = this;
              return new Promise((function(n, o) {
                var r = e.deviceType,
                  i = e.modelNumber,
                  s = void 0 === i ? "-1" : i,
                  a = e.sessionKey,
                  u = e.settings.filePath,
                  f = {
                    root: {
                      device_type: {
                        $: {
                          key: d.AIO
                        },
                        device: {
                          $: {
                            key: s
                          },
                          function: {
                            $: {
                              key: p.DELETE_IMAGEFILE
                            },
                            settings: {
                              file_path: u
                            }
                          }
                        }
                      }
                    }
                  },
                  g = c(f);
                Promise.resolve().then((function() {
                  var e = "".concat(a);
                  return logMessage.info("[".concat(y, "]"), "onDeleteFile.")(r), t.send({
                    method: "post",
                    deviceType: r,
                    sessionKey: e,
                    xml: g
                  })
                })).then((function() {
                  logMessage.info("[".concat(y, "]"), "onDeleteFile successful.")(r), n({
                    status: 200
                  })
                })).catch((function(e) {
                  logMessage.error("[".concat(y, "]"), "onDeleteFile fail. errorMsg: ".concat(e))(r), o({
                    status: 500,
                    payload: {
                      errorCode: l(e)
                    }
                  })
                }))
              }))
            }
          },
          mediaDelete: function(e) {
            return function() {
              var t = this;
              return new Promise((function(n, o) {
                var r = e.deviceType,
                  i = e.modelNumber,
                  s = void 0 === i ? "-1" : i,
                  a = e.sessionKey,
                  u = e.settings.mediaInfo,
                  f = function() {
                    if (u) {
                      var e = u.index;
                      return {
                        type: "jpg" === u.ext ? "0" : "1",
                        index: e
                      }
                    }
                    return {
                      type: "99",
                      index: "99"
                    }
                  },
                  g = {
                    root: {
                      device_type: {
                        $: {
                          key: d.AIO
                        },
                        device: {
                          $: {
                            key: s
                          },
                          function: {
                            $: {
                              key: p.MEDIA_DELETE
                            },
                            settings: {
                              media_delete: {
                                type: f().type,
                                index: f().index
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  v = c(g);
                Promise.resolve().then((function() {
                  var e = "".concat(a);
                  return logMessage.info("[".concat(y, "]"), "mediaDelete.")(r), t.send({
                    method: "post",
                    deviceType: r,
                    sessionKey: e,
                    xml: v
                  })
                })).then((function() {
                  logMessage.info("[".concat(y, "]"), "mediaDelete successful.")(r), n({
                    status: 200
                  })
                })).catch((function(e) {
                  logMessage.error("[".concat(y, "]"), "mediaDelete fail. errorMsg: ".concat(e))(r), o({
                    status: 500,
                    payload: {
                      errorCode: l(e)
                    }
                  })
                }))
              }))
            }
          },
          copyFile: function(e) {
            return function() {
              var t = this;
              return new Promise((function(n, o) {
                var r = e.deviceType,
                  i = e.modelNumber,
                  s = void 0 === i ? "-1" : i,
                  a = e.sessionKey,
                  u = e.settings,
                  f = u.originImagePath,
                  g = u.dstImagePath,
                  v = {
                    root: {
                      device_type: {
                        $: {
                          key: d.AIO
                        },
                        device: {
                          $: {
                            key: s
                          },
                          function: {
                            $: {
                              key: p.COPY_FILE
                            },
                            settings: {
                              copy_file: {
                                src: f,
                                dst: "".concat(pathMapping.proj, "\\view\\externalFiles\\aio\\origin\\").concat(function(e) {
                                  var t, n;
                                  return null !== (n = null === (t = e.split("\\").pop()) || void 0 === t ? void 0 : t.split("/").pop()) && void 0 !== n ? n : ""
                                }(g))
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  m = c(v);
                Promise.resolve().then((function() {
                  var e = "".concat(a);
                  return logMessage.info("[".concat(y, "]"), "copyFile.")(r), t.send({
                    method: "post",
                    deviceType: r,
                    sessionKey: e,
                    xml: m
                  })
                })).then((function() {
                  logMessage.info("[".concat(y, "]"), "copyFile successful.")(r), n({
                    status: 200
                  })
                })).catch((function(e) {
                  logMessage.error("[".concat(y, "]"), "copyFile fail. errorMsg: ".concat(e))(r), o({
                    status: 500,
                    payload: {
                      errorCode: l(e)
                    }
                  })
                }))
              }))
            }
          },
          getFreeSpaceSize: function(e) {
            return function() {
              var t = this;
              return new Promise((function(n, o) {
                var r = e.deviceType,
                  i = e.modelNumber,
                  s = void 0 === i ? "-1" : i,
                  a = e.sessionKey,
                  u = {
                    root: {
                      device_type: {
                        $: {
                          key: d.AIO
                        },
                        device: {
                          $: {
                            key: s
                          },
                          function: {
                            $: {
                              key: p.GET_FREESPACESIZE
                            }
                          }
                        }
                      }
                    }
                  },
                  f = c(u);
                Promise.resolve().then((function() {
                  var e = "".concat(a);
                  return logMessage.info("[".concat(y, "]"), "getFreeSpaceSize.")(r), t.send({
                    method: "post",
                    deviceType: r,
                    sessionKey: e,
                    xml: f
                  })
                })).then((function(e) {
                  logMessage.info("[".concat(y, "]"), "getFreeSpaceSize successful.")(r), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  logMessage.error("[".concat(y, "]"), "getFreeSpaceSize fail. errorMsg: ".concat(e))(r), o({
                    status: 500,
                    payload: {
                      errorCode: l(e)
                    }
                  })
                }))
              }))
            }
          },
          getCroppedImage: function(e) {
            return function() {
              var t = this;
              return new Promise((function(n, o) {
                var r = e.deviceType,
                  i = e.modelNumber,
                  s = void 0 === i ? "-1" : i,
                  a = e.sessionKey,
                  u = e.settings,
                  f = u.cropInfo,
                  g = u.srcPath,
                  v = u.dstPath,
                  m = f.cropWidth,
                  h = f.cropHeight,
                  _ = f.x,
                  M = f.y,
                  P = f.rotate,
                  T = f.originImgWidth,
                  I = f.originImgHeight,
                  b = {
                    root: {
                      device_type: {
                        $: {
                          key: d.AIO
                        },
                        device: {
                          $: {
                            key: s
                          },
                          function: {
                            $: {
                              key: p.ROTATE_RESIZE_GIF
                            },
                            settings: {
                              rotate_resize: {
                                src_path: g,
                                dst_path: v,
                                img_width: T,
                                img_height: I,
                                rotate: P,
                                x_position: _,
                                y_position: M,
                                crop_width: m,
                                crop_height: h
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  w = c(b);
                Promise.resolve().then((function() {
                  var e = "".concat(a);
                  return logMessage.info("[".concat(y, "]"), "getCroppedImage.")(r), t.send({
                    method: "post",
                    deviceType: r,
                    sessionKey: e,
                    xml: w
                  })
                })).then((function(e) {
                  logMessage.info("[".concat(y, "]"), "getCroppedImage successful.")(r), n({
                    status: 200,
                    payload: e
                  })
                })).catch((function(e) {
                  logMessage.error("[".concat(y, "]"), "getCroppedImage fail. errorMsg: ".concat(e))(r), o({
                    status: 500,
                    payload: {
                      errorCode: l(e)
                    }
                  })
                }))
              }))
            }
          },
          mediaTransfer: function(e) {
            return function() {
              var t = this;
              return new Promise((function(n, o) {
                var r = e.deviceType,
                  i = e.modelNumber,
                  s = void 0 === i ? "-1" : i,
                  a = e.sessionKey,
                  u = e.settings,
                  f = u.imageFileName,
                  g = u.mediaIndex,
                  v = function(e) {
                    var t = e.split("\\").pop().split("/").pop(),
                      n = t.substring(0, t.lastIndexOf(".")),
                      o = t.split(".");
                    return {
                      name: n,
                      ext: o[o.length - 1]
                    }
                  },
                  m = v(f).name,
                  h = v(f).ext,
                  _ = {
                    root: {
                      device_type: {
                        $: {
                          key: d.AIO
                        },
                        device: {
                          $: {
                            key: s
                          },
                          function: {
                            $: {
                              key: p.MEDIA_TRANSFER
                            },
                            settings: {
                              media_transfer: {
                                path: "".concat(pathMapping.proj, "\\view\\externalFiles\\aio\\origin\\").concat(m, ".").concat(h),
                                type: "gif" === h ? "1" : "0",
                                index: g
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  M = c(_);
                Promise.resolve().then((function() {
                  var e = "".concat(a);
                  return logMessage.info("[".concat(y, "]"), "mediaTransfer.")(r), t.send({
                    method: "post",
                    deviceType: r,
                    sessionKey: e,
                    xml: M
                  })
                })).then((function() {
                  logMessage.info("[".concat(y, "]"), "mediaTransfer successful.")(r), n({
                    status: 200
                  })
                })).catch((function(e) {
                  logMessage.error("[".concat(y, "]"), "mediaTransfer fail. errorMsg: ".concat(e))(r), o({
                    status: 500,
                    payload: {
                      errorCode: l(e)
                    }
                  })
                }))
              }))
            }
          }
        }
      },
      509: function(e, t, n) {
        var o = this && this.__assign || function() {
            return o = Object.assign || function(e) {
              for (var t, n = 1, o = arguments.length; n < o; n++)
                for (var r in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
              return e
            }, o.apply(this, arguments)
          },
          r = this && this.__spreadArray || function(e, t, n) {
            if (n || 2 === arguments.length)
              for (var o, r = 0, i = t.length; r < i; r++) !o && r in t || (o || (o = Array.prototype.slice.call(t, 0, r)), o[r] = t[r]);
            return e.concat(o || Array.prototype.slice.call(t))
          },
          i = this && this.__importDefault || function(e) {
            return e && e.__esModule ? e : {
              default: e
            }
          };
        Object.defineProperty(t, "__esModule", {
          value: !0
        });
        var s = i(n(79)),
          a = i(n(770)),
          c = utility.parseJSON2XML,
          u = utility.parseErrorCode,
          l = utility.parseXML2JSON,
          d = s.default.peripheralDevice,
          f = s.default.deviceNameMapping,
          p = a.default.functionNumber,
          y = f[d.AIO] || d.AIO,
          g = function(e) {
            switch (e) {
              case "6279":
              case "6318":
                return "AIO_PANEL";
              default:
                return "AIO_LED"
            }
          };
        t.default = {
          setLightingOff: function(e) {
            return function() {
              var t = this;
              return new Promise((function(n, o) {
                var r = e.deviceType,
                  i = e.modelNumber,
                  s = e.sessionKey,
                  a = e.settings.playDevice,
                  l = "setLightingOff",
                  f = {
                    playDevice: a || g(i)
                  },
                  v = {
                    root: {
                      device_type: {
                        $: {
                          key: d.AIO
                        },
                        device: {
                          $: {
                            key: i
                          },
                          function: {
                            $: {
                              key: p.SET_PROFILE
                            },
                            profiles: {
                              profile2: {
                                main: {
                                  single: {
                                    player: {
                                      $: {
                                        key: "led_player"
                                      },
                                      setting: {
                                        play_device: f.playDevice,
                                        play_mode: "2",
                                        led_list: {
                                          led_effect: "0",
                                          led_colorr: "0",
                                          led_colorg: "0",
                                          led_colorb: "0",
                                          led_dir: "0",
                                          led_speed: "2"
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  m = c(v);
                Promise.resolve().then((function() {
                  var e = "".concat(s);
                  return logMessage.info("[".concat(y, "]"), "[".concat(l, "]."))(r), t.send({
                    method: "post",
                    deviceType: r,
                    sessionKey: e,
                    xml: m
                  })
                })).then((function() {
                  logMessage.info("[".concat(y, "]"), "[".concat(l, "] successful."))(r), n({
                    status: 200
                  })
                })).catch((function(e) {
                  o({
                    status: 500,
                    payload: {
                      errorCode: u(e)
                    }
                  })
                }))
              }))
            }
          },
          setLightingEffect: function(e) {
            return function() {
              var t = this;
              return new Promise((function(n, o) {
                var r, i = e.deviceType,
                  s = e.modelNumber,
                  a = e.sessionKey,
                  l = e.settings,
                  f = l.effectSetting,
                  v = l.playDevice,
                  m = "setLightingEffect",
                  h = {
                    playDevice: v || g(s),
                    effectID: f.effectID,
                    color: (r = f.pattern.singleColor[0], {
                      r: r.r,
                      g: r.g,
                      b: r.b
                    }),
                    direction: f.direction ? "1" : "0",
                    speed: f.speed
                  },
                  _ = {
                    root: {
                      device_type: {
                        $: {
                          key: d.AIO
                        },
                        device: {
                          $: {
                            key: s
                          },
                          function: {
                            $: {
                              key: p.SET_PROFILE
                            },
                            profiles: {
                              profile2: {
                                main: {
                                  single: {
                                    player: {
                                      $: {
                                        key: "led_player"
                                      },
                                      setting: {
                                        play_device: h.playDevice,
                                        play_mode: "2",
                                        led_list: {
                                          led_effect: h.effectID,
                                          led_colorr: h.color.r,
                                          led_colorg: h.color.g,
                                          led_colorb: h.color.b,
                                          led_dir: h.direction,
                                          led_speed: h.speed
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  M = c(_);
                Promise.resolve().then((function() {
                  var e = "".concat(a);
                  return logMessage.info("[".concat(y, "]"), "[".concat(m, "]."))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: M
                  })
                })).then((function() {
                  logMessage.info("[".concat(y, "]"), "[".concat(m, "] successful."))(i), n({
                    status: 200
                  })
                })).catch((function(e) {
                  o({
                    status: 500,
                    payload: {
                      errorCode: u(e)
                    }
                  })
                }))
              }))
            }
          },
          setLightingHardwarePower: function(e) {
            return function() {
              var t = this,
                n = "setLigtingHardwarePower";
              return new Promise((function(o, r) {
                var i = e.deviceType,
                  s = e.modelNumber,
                  a = void 0 === s ? "-1" : s,
                  l = e.sessionKey,
                  f = e.settings.status,
                  g = {
                    root: {
                      device_type: {
                        $: {
                          key: d.AIO
                        },
                        device: {
                          $: {
                            key: a
                          },
                          function: {
                            $: {
                              key: p.SET_POWER_S0
                            },
                            settings: {
                              power: f ? 0 : 1,
                              saving: 1
                            }
                          }
                        }
                      }
                    }
                  },
                  v = c(g);
                Promise.resolve().then((function() {
                  var e = "".concat(l);
                  return logMessage.info("[".concat(y, "]"), "".concat(n, " send."))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: v
                  })
                })).then((function() {
                  logMessage.info("[".concat(y, "]"), "".concat(n, " successful."))(i), o({
                    status: 200
                  })
                })).catch((function(e) {
                  logMessage.error("[".concat(y, "]"), "".concat(n, " fail."))(i), r({
                    status: 500,
                    payload: {
                      errorCode: u(e)
                    }
                  })
                }))
              }))
            }
          },
          getLightingHardwareSensor: function(e) {
            return function() {
              var t = this,
                n = "getLightingHardwareSensor";
              return new Promise((function(i, s) {
                var a = e.deviceType,
                  f = e.modelNumber,
                  g = e.sessionKey,
                  v = e.settings.data,
                  m = {
                    root: {
                      device_type: {
                        $: {
                          key: d.AIO
                        },
                        device: {
                          $: {
                            key: f
                          },
                          function: {
                            $: {
                              key: p.GET_SENSORVALUE
                            },
                            settings: {
                              get_sensor_data: {
                                sensor: r([], v.map((function(e, t) {
                                  return {
                                    $: {
                                      key: t
                                    },
                                    id: null == e ? void 0 : e.id,
                                    default_name: null == e ? void 0 : e.default_name,
                                    type: null == e ? void 0 : e.type
                                  }
                                })), !0)
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  h = c(m);
                Promise.resolve().then((function() {
                  var e = "".concat(g);
                  return logMessage.info("[".concat(y, "]"), "[".concat(n, "]."))(a), t.send({
                    method: "post",
                    deviceType: a,
                    sessionKey: e,
                    xml: h
                  })
                })).then((function(e) {
                  return l(null == e ? void 0 : e.payload)
                })).then((function(e) {
                  var t = [];
                  v.forEach((function(n) {
                    var r, i = null === (r = null == e ? void 0 : e.sensor) || void 0 === r ? void 0 : r.find((function(e) {
                      return (null == n ? void 0 : n.id) === (null == e ? void 0 : e.id)
                    }));
                    i && t.push(o(o({}, n), {
                      value: null == i ? void 0 : i.value
                    }))
                  })), logMessage.info("[".concat(y, "]"), "[".concat(n, "] successful."))(a), i({
                    status: 200,
                    payload: t
                  })
                })).catch((function(e) {
                  s({
                    status: 500,
                    payload: {
                      errorCode: u(e)
                    }
                  })
                }))
              }))
            }
          },
          setLightingHardwarePlayer: function(e) {
            return function() {
              var t = this,
                n = "setLightingHardwarePlayer";
              return new Promise((function(o, r) {
                var i = e.deviceType,
                  s = e.modelNumber,
                  a = e.sessionKey,
                  l = e.settings,
                  f = l.playDevice,
                  g = l.player,
                  v = l.id,
                  m = l.default_name,
                  h = l.type,
                  _ = {
                    root: {
                      device_type: {
                        $: {
                          key: d.AIO
                        },
                        device: {
                          $: {
                            key: s
                          },
                          function: {
                            $: {
                              key: p.SET_PROFILE
                            },
                            profiles: {
                              profile7: {
                                main: {
                                  single: {
                                    player: {
                                      $: {
                                        key: g
                                      },
                                      setting: {
                                        play_device: f,
                                        sensor: {
                                          id: v,
                                          default_name: m,
                                          type: h
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  M = c(_);
                Promise.resolve().then((function() {
                  var e = "".concat(a);
                  return logMessage.info("[".concat(y, "]"), "[".concat(n, "]."))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: M
                  })
                })).then((function() {
                  logMessage.info("[".concat(y, "]"), "[".concat(n, "] successful."))(i), o({
                    status: 200
                  })
                })).catch((function(e) {
                  r({
                    status: 500,
                    payload: {
                      errorCode: u(e)
                    }
                  })
                }))
              }))
            }
          },
          setPlayer2LightingEffect: function(e) {
            return function() {
              var t = this;
              return new Promise((function(n, r) {
                var i = e.deviceType,
                  s = e.modelNumber,
                  a = e.sessionKey,
                  l = e.settings,
                  f = l.effectSetting,
                  g = l.playDevice,
                  v = l.player,
                  m = "setPlayer2LightingEffect",
                  h = f.pattern,
                  _ = f.colorType,
                  M = f.effectID,
                  P = f.speed,
                  T = f.range,
                  I = f.brightness,
                  b = f.direction,
                  w = {
                    color: function() {
                      if ("0" === M) return {
                        color_num: 0
                      };
                      switch (_) {
                        case "Single":
                          var e = h.singleColor[0];
                          return {
                            color_num: 1, color: {
                              $: {
                                key: 0
                              },
                              r: e.r,
                              g: e.g,
                              b: e.b
                            }
                          };
                        case "Double":
                          return {
                            color_num: 2, color: h.colors.map((function(e, t) {
                              return {
                                $: {
                                  key: t
                                },
                                r: e.r,
                                g: e.g,
                                b: e.b
                              }
                            }))
                          };
                        default:
                          return {
                            color_num: 0
                          }
                      }
                    }()
                  },
                  O = {
                    root: {
                      device_type: {
                        $: {
                          key: d.AIO
                        },
                        device: {
                          $: {
                            key: s
                          },
                          function: {
                            $: {
                              key: p.SET_PROFILE
                            },
                            profiles: {
                              profile2: {
                                main: {
                                  single: {
                                    player: {
                                      $: {
                                        key: v
                                      },
                                      setting: o({
                                        play_device: g,
                                        led_effect: o(o({
                                          id: M
                                        }, w.color), {
                                          brightness: "0" === M ? "0" : I || "0",
                                          speed: "0" === M ? "0" : P || "0",
                                          direction: "0" === M ? "0" : b || "0"
                                        })
                                      }, "0" !== M && T && {
                                        sensor: {
                                          id: T.id,
                                          default_name: T.default_name,
                                          temp: {
                                            low: T.position[0],
                                            high: T.position[1]
                                          }
                                        }
                                      })
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  S = c(O);
                Promise.resolve().then((function() {
                  var e = "".concat(a);
                  return logMessage.info("[".concat(y, "]"), "[".concat(m, "]."))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: S
                  })
                })).then((function() {
                  logMessage.info("[".concat(y, "]"), "[".concat(m, "] successful."))(i), n({
                    status: 200
                  })
                })).catch((function(e) {
                  r({
                    status: 500,
                    payload: {
                      errorCode: u(e)
                    }
                  })
                }))
              }))
            }
          }
        }
      },
      799: function(e, t, n) {
        var o = this && this.__spreadArray || function(e, t, n) {
            if (n || 2 === arguments.length)
              for (var o, r = 0, i = t.length; r < i; r++) !o && r in t || (o || (o = Array.prototype.slice.call(t, 0, r)), o[r] = t[r]);
            return e.concat(o || Array.prototype.slice.call(t))
          },
          r = this && this.__importDefault || function(e) {
            return e && e.__esModule ? e : {
              default: e
            }
          };
        Object.defineProperty(t, "__esModule", {
          value: !0
        });
        var i = r(n(79)),
          s = r(n(17)),
          a = r(n(770)),
          c = r(n(200)),
          u = utility.parseJSON2XML,
          l = utility.parseErrorCode,
          d = i.default.peripheralDevice,
          f = i.default.deviceNameMapping,
          p = a.default.functionNumber,
          y = f[d.AIO] || d.AIO;
        t.default = {
          getAuraSyncModeStatus: function(e) {
            return function() {
              var t = this;
              return new Promise((function(n, o) {
                var r = "getAuraSyncModeStatus",
                  i = e.deviceType,
                  s = e.modelNumber,
                  a = e.sessionKey,
                  c = {
                    root: {
                      device_type: {
                        $: {
                          key: d.AIO
                        },
                        device: {
                          $: {
                            key: s
                          },
                          function: {
                            $: {
                              key: p.GET_AURASYNCMODESTATUS
                            }
                          }
                        }
                      }
                    }
                  },
                  f = u(c);
                Promise.resolve().then((function() {
                  var e = "".concat(a);
                  return logMessage.info("[".concat(y, "]"), "".concat(r, "."))(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: f
                  })
                })).then((function(e) {
                  logMessage.info("[".concat(y, "]"), "".concat(r, " successful."))(i);
                  var t = e.payload.replace(/\n/g, "").replace(/\x00/g, "");
                  n({
                    status: 200,
                    payload: t
                  })
                })).catch((function(e) {
                  o({
                    status: 500,
                    payload: {
                      errorCode: l(e)
                    }
                  })
                }))
              }))
            }
          },
          setMatrixHardware: function(e) {
            return function() {
              var t = this;
              return new Promise((function(n, r) {
                var i = "setMatrixHardware",
                  a = e.deviceType,
                  c = e.modelNumber,
                  f = e.sessionKey,
                  g = e.settings,
                  v = g.hardwareInfoData,
                  m = g.duration,
                  h = v.map((function(e, t) {
                    var n = e.id,
                      o = e.default_name,
                      r = e.name,
                      i = e.type,
                      a = e.titleImgPath,
                      c = e.bgImgPath;
                    return {
                      $: {
                        key: t
                      },
                      id: n,
                      default_name: o,
                      name: r,
                      type: i,
                      title_img_path: s.default.resolve(process.execPath, "../view", a),
                      bg_img_path: s.default.resolve(process.execPath, "../view", c)
                    }
                  })),
                  _ = {
                    root: {
                      device_type: {
                        $: {
                          key: d.AIO
                        },
                        device: {
                          $: {
                            key: c
                          },
                          function: {
                            $: {
                              key: p.SET_PROFILE
                            },
                            profiles: {
                              profile6: {
                                main: {
                                  single: {
                                    player: {
                                      $: {
                                        key: "matrix_hw_monitor_player"
                                      },
                                      setting: {
                                        play_device: "AIO_MATRIX",
                                        duration: 1e3 * m,
                                        sensor_list: {
                                          sensor: o([], h, !0)
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  M = u(_);
                Promise.resolve().then((function() {
                  var e = "".concat(f);
                  return logMessage.info("[".concat(y, "]"), "".concat(i, "."))(a), t.send({
                    method: "post",
                    deviceType: a,
                    sessionKey: e,
                    xml: M
                  })
                })).then((function() {
                  logMessage.info("[".concat(y, "]"), "".concat(i, " successful."))(a), n({
                    status: 200
                  })
                })).catch((function(e) {
                  r({
                    status: 500,
                    payload: {
                      errorCode: l(e)
                    }
                  })
                }))
              }))
            }
          },
          applyBootS0S5Mode: function(e) {
            return function() {
              var t = this;
              return new Promise((function(n, o) {
                var r = e.deviceType,
                  i = e.settings;
                return Promise.resolve().then((function() {
                  var n = i.filePath,
                    o = i.mediaIndex;
                  if (n) return t.dispatch(c.default.mediaTransfer(e, {
                    filePath: n,
                    mediaIndex: o
                  }))
                })).then((function() {
                  var n = i.status,
                    o = i.animeId,
                    r = i.filePath,
                    s = i.mediaIndex;
                  return t.dispatch(function(e, t) {
                    return function() {
                      var n = this;
                      return new Promise((function(o, r) {
                        var i = "setMatrixS0S5Mode",
                          s = e.deviceType,
                          a = e.modelNumber,
                          c = e.sessionKey,
                          f = t.status,
                          g = t.animeId,
                          v = t.filePath,
                          m = t.mediaIndex,
                          h = {
                            root: {
                              device_type: {
                                $: {
                                  key: d.AIO
                                },
                                device: {
                                  $: {
                                    key: a
                                  },
                                  function: {
                                    $: {
                                      key: p.SET_MATRIX_S0S5MODE
                                    },
                                    settings: {
                                      matrixs0s5mode: {
                                        s0_mode: f ? "1" : "0",
                                        s0_src_type: v ? "1" : "0",
                                        s0_file_id: v ? m : g,
                                        s5_mode: f ? "1" : "0",
                                        s5_src_type: v ? "1" : "0",
                                        s5_file_id: v ? m : g
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          },
                          _ = u(h);
                        Promise.resolve().then((function() {
                          var e = "".concat(c);
                          return logMessage.info("[".concat(y, "]"), "".concat(i, "."))(s), n.send({
                            method: "post",
                            deviceType: s,
                            sessionKey: e,
                            xml: _
                          })
                        })).then((function() {
                          logMessage.info("[".concat(y, "]"), "".concat(i, " successful."))(s), o({
                            status: 200
                          })
                        })).catch((function(e) {
                          r({
                            status: 500,
                            payload: {
                              errorCode: l(e)
                            }
                          })
                        }))
                      }))
                    }
                  }(e, {
                    status: n,
                    animeId: o,
                    filePath: r,
                    mediaIndex: s
                  }))
                })).then((function() {
                  logMessage.info("[".concat(y, "]"), "applyLEDMode finish.")(r), n({
                    status: 200
                  })
                })).catch((function(e) {
                  logMessage.error("[".concat(y, "]"), "applyLEDMode fail.")(r), o({
                    status: 500,
                    payload: {
                      errorCode: l(e)
                    }
                  })
                }))
              }))
            }
          },
          applyLEDMode: function(e) {
            return function() {
              var t = this;
              return new Promise((function(n, o) {
                var r = e.deviceType,
                  i = e.settings;
                return Promise.resolve().then((function() {
                  var n = i.filePath,
                    o = i.mediaIndex;
                  if (n) return t.dispatch(c.default.mediaTransfer(e, {
                    filePath: n,
                    mediaIndex: o || "0"
                  }))
                })).then((function() {
                  return t.dispatch(function(e, t) {
                    return function() {
                      var n = this;
                      return new Promise((function(o, r) {
                        var i = "setMatrixLEDMode",
                          s = e.deviceType,
                          a = e.modelNumber,
                          c = e.sessionKey,
                          f = t.status,
                          g = t.animeId,
                          v = t.filePath,
                          m = t.playDevice,
                          h = void 0 === m ? "AIO_MATRIX" : m,
                          _ = {
                            root: {
                              device_type: {
                                $: {
                                  key: d.AIO
                                },
                                device: {
                                  $: {
                                    key: a
                                  },
                                  function: {
                                    $: {
                                      key: p.SET_PROFILE
                                    },
                                    profiles: {
                                      profile6: {
                                        main: {
                                          single: {
                                            player: {
                                              $: {
                                                key: "matrix_gif_player"
                                              },
                                              setting: {
                                                play_device: h,
                                                type: f ? "1" : "0",
                                                source: v ? "1" : "0",
                                                index: v ? "0" : g
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          },
                          M = u(_);
                        Promise.resolve().then((function() {
                          var e = "".concat(c);
                          return logMessage.info("[".concat(y, "]"), "".concat(i, "."))(s), n.send({
                            method: "post",
                            deviceType: s,
                            sessionKey: e,
                            xml: M
                          })
                        })).then((function() {
                          logMessage.info("[".concat(y, "]"), "".concat(i, " successful."))(s), o({
                            status: 200
                          })
                        })).catch((function(e) {
                          r({
                            status: 500,
                            payload: {
                              errorCode: l(e)
                            }
                          })
                        }))
                      }))
                    }
                  }(e, i))
                })).then((function() {
                  logMessage.info("[".concat(y, "]"), "applyLEDMode finish.")(r), n({
                    status: 200
                  })
                })).catch((function(e) {
                  logMessage.error("[".concat(y, "]"), "applyLEDMode fail.")(r), o({
                    status: 500,
                    payload: {
                      errorCode: l(e)
                    }
                  })
                }))
              }))
            }
          }
        }
      },
      283: function(e, t, n) {
        var o = this && this.__assign || function() {
            return o = Object.assign || function(e) {
              for (var t, n = 1, o = arguments.length; n < o; n++)
                for (var r in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
              return e
            }, o.apply(this, arguments)
          },
          r = this && this.__spreadArray || function(e, t, n) {
            if (n || 2 === arguments.length)
              for (var o, r = 0, i = t.length; r < i; r++) !o && r in t || (o || (o = Array.prototype.slice.call(t, 0, r)), o[r] = t[r]);
            return e.concat(o || Array.prototype.slice.call(t))
          },
          i = this && this.__importDefault || function(e) {
            return e && e.__esModule ? e : {
              default: e
            }
          };
        Object.defineProperty(t, "__esModule", {
          value: !0
        });
        var s = i(n(147)),
          a = i(n(770)),
          c = i(n(79)),
          u = utility.parseJSON2XML,
          l = utility.parseXML2JSON,
          d = utility.parseErrorCode,
          f = a.default.functionNumber,
          p = a.default.DISPLAY_PLAYER,
          y = c.default.peripheralDevice,
          g = c.default.deviceNameMapping[y.AIO] || y.AIO,
          v = function(e) {
            return function() {
              var t = this;
              return new Promise((function(n, o) {
                var r = e.deviceType,
                  i = e.modelNumber,
                  s = void 0 === i ? "-1" : i,
                  a = e.sessionKey,
                  c = e.settings.powerS5,
                  l = {
                    root: {
                      device_type: {
                        $: {
                          key: y.AIO
                        },
                        device: {
                          $: {
                            key: s
                          },
                          function: {
                            $: {
                              key: f.SET_POWER_S5
                            },
                            settings: {
                              power: c ? 0 : 1,
                              saving: 1
                            }
                          }
                        }
                      }
                    }
                  },
                  p = u(l);
                Promise.resolve().then((function() {
                  var e = "".concat(a);
                  return logMessage.info("[".concat(g, "]"), "setPowerS5.")(r), t.send({
                    method: "post",
                    deviceType: r,
                    sessionKey: e,
                    xml: p
                  })
                })).then((function() {
                  logMessage.info("[".concat(g, "]"), "setPowerS5 successful.")(r), n({
                    status: 200
                  })
                })).catch((function(e) {
                  logMessage.error("[".concat(g, "]"), "setPowerS5 fail.")(r), o({
                    status: 500,
                    payload: {
                      errorCode: d(e)
                    }
                  })
                }))
              }))
            }
          };
        t.default = function(e, t) {
          return function() {
            var n = t.method,
              i = t.params,
              a = (null != i ? i : {}).id,
              c = n.toLowerCase(),
              m = this.dispatch;
            switch (a) {
              case "init":
                if ("get" === c) return m(function(e) {
                  return function() {
                    var t = this;
                    return new Promise((function(n, o) {
                      var r = e.deviceType,
                        i = e.sessionKey,
                        s = u({
                          root: {
                            device_type: {
                              $: {
                                key: "5"
                              },
                              device: {
                                $: {
                                  key: "0"
                                },
                                function: {
                                  $: {
                                    key: "0"
                                  }
                                }
                              }
                            }
                          }
                        });
                      Promise.resolve().then((function() {
                        var e = "".concat(i);
                        return logMessage.info("init.")(r), t.send({
                          method: "post",
                          deviceType: r,
                          sessionKey: e,
                          xml: s
                        })
                      })).then((function(e) {
                        return l(null == e ? void 0 : e.payload)
                      })).then((function(e) {
                        logMessage.info("init successful.")(r), n({
                          status: 200,
                          payload: e
                        })
                      })).catch((function(e) {
                        logMessage.error("init fail.")(r), o({
                          status: 500,
                          payload: {
                            errorCode: d(e)
                          }
                        })
                      }))
                    }))
                  }
                }(e));
              case "restore":
                if ("get" === c) return m(function(e) {
                  return function() {
                    var t = this;
                    return new Promise((function(n, o) {
                      var r = e.deviceType,
                        i = e.modelNumber,
                        s = void 0 === i ? "-1" : i,
                        a = e.sessionKey,
                        c = {
                          root: {
                            device_type: {
                              $: {
                                key: y.AIO
                              },
                              device: {
                                $: {
                                  key: s
                                },
                                function: {
                                  $: {
                                    key: f.RESTORE_PROFILE
                                  }
                                }
                              }
                            }
                          }
                        },
                        p = u(c);
                      Promise.resolve().then((function() {
                        var e = "".concat(a);
                        return logMessage.info("[".concat(g, "]"), "restoreProfile.")(r), t.send({
                          method: "post",
                          deviceType: r,
                          sessionKey: e,
                          xml: p
                        })
                      })).then((function(e) {
                        return l(null == e ? void 0 : e.payload)
                      })).then((function(e) {
                        logMessage.info("[".concat(g, "]"), "restoreProfile successful.")(r), n({
                          status: 200,
                          payload: e
                        })
                      })).catch((function(e) {
                        logMessage.error("[".concat(g, "]"), "restoreProfile fail.")(r), o({
                          status: 500,
                          payload: {
                            errorCode: d(e)
                          }
                        })
                      }))
                    }))
                  }
                }(e));
              case "last":
                if ("get" === c) return m(function(e) {
                  return function() {
                    var t = this;
                    return new Promise((function(n, o) {
                      var r = e.deviceType,
                        i = e.modelNumber,
                        s = void 0 === i ? "0" : i,
                        a = e.sessionKey,
                        c = {
                          root: {
                            device_type: {
                              $: {
                                key: y.AIO
                              },
                              device: {
                                $: {
                                  key: s
                                },
                                function: {
                                  $: {
                                    key: f.GET_PROFILE
                                  }
                                }
                              }
                            }
                          }
                        },
                        l = u(c);
                      Promise.resolve().then((function() {
                        var e = "".concat(a);
                        return logMessage.info("[".concat(g, "]"), "getLastProfile.")(r), t.send({
                          method: "post",
                          deviceType: r,
                          sessionKey: e,
                          xml: l
                        })
                      })).then((function(e) {
                        logMessage.info("[".concat(g, "]"), "getLastProfile successful.")(r), n({
                          status: 200,
                          payload: null == e ? void 0 : e.payload
                        })
                      })).catch((function(e) {
                        logMessage.error("[".concat(g, "]"), "getLastProfile fail.")(r), o({
                          status: 500,
                          payload: {
                            errorCode: d(e)
                          }
                        })
                      }))
                    }))
                  }
                }(e));
              case "powerS0":
                if ("get" === c) return m(function(e) {
                  return function() {
                    var t = this;
                    return new Promise((function(n, o) {
                      var r = e.deviceType,
                        i = e.modelNumber,
                        s = void 0 === i ? "-1" : i,
                        a = e.sessionKey,
                        c = {
                          root: {
                            device_type: {
                              $: {
                                key: y.AIO
                              },
                              device: {
                                $: {
                                  key: s
                                },
                                function: {
                                  $: {
                                    key: f.ISPOWER_S0
                                  }
                                }
                              }
                            }
                          }
                        },
                        l = u(c);
                      Promise.resolve().then((function() {
                        var e = "".concat(a);
                        return logMessage.info("[".concat(g, "]"), "isPowerOnS0.")(r), t.send({
                          method: "post",
                          deviceType: r,
                          sessionKey: e,
                          xml: l
                        })
                      })).then((function(e) {
                        var t = (e || {}).payload;
                        logMessage.info("[".concat(g, "]"), "isPowerOnS0 successful.")(r), n({
                          status: 200,
                          payload: t.replace(/\n/g, "").replace(/\x00/g, "")
                        })
                      })).catch((function(e) {
                        logMessage.error("[".concat(g, "]"), "isPowerOnS0 fail. errorMsg: ".concat(e))(r), o({
                          status: 500,
                          payload: {
                            errorCode: d(e)
                          }
                        })
                      }))
                    }))
                  }
                }(e));
                if ("put" === c) return m(function(e) {
                  return function() {
                    var t = this;
                    return new Promise((function(n, o) {
                      var r = e.deviceType,
                        i = e.modelNumber,
                        s = void 0 === i ? "-1" : i,
                        a = e.sessionKey,
                        c = e.settings.powerS0,
                        l = {
                          root: {
                            device_type: {
                              $: {
                                key: y.AIO
                              },
                              device: {
                                $: {
                                  key: s
                                },
                                function: {
                                  $: {
                                    key: f.SET_POWER_S0
                                  },
                                  settings: {
                                    power: c ? 0 : 1,
                                    saving: 1
                                  }
                                }
                              }
                            }
                          }
                        },
                        p = u(l);
                      Promise.resolve().then((function() {
                        var e = "".concat(a);
                        return logMessage.info("[".concat(g, "]"), "setPowerS0.")(r), t.send({
                          method: "post",
                          deviceType: r,
                          sessionKey: e,
                          xml: p
                        })
                      })).then((function() {
                        logMessage.info("[".concat(g, "]"), "setPowerS0 successful.")(r), n({
                          status: 200
                        })
                      })).catch((function(e) {
                        logMessage.error("[".concat(g, "]"), "setPowerS0 fail.")(r), o({
                          status: 500,
                          payload: {
                            errorCode: d(e)
                          }
                        })
                      }))
                    }))
                  }
                }(e));
              case "powerS5":
                if ("get" === c) return m(function(e) {
                  return function() {
                    var t = this;
                    return new Promise((function(n, o) {
                      var r = e.deviceType,
                        i = e.modelNumber,
                        s = void 0 === i ? "-1" : i,
                        a = e.sessionKey,
                        c = {
                          root: {
                            device_type: {
                              $: {
                                key: y.AIO
                              },
                              device: {
                                $: {
                                  key: s
                                },
                                function: {
                                  $: {
                                    key: f.ISPOWER_S5
                                  }
                                }
                              }
                            }
                          }
                        },
                        l = u(c);
                      Promise.resolve().then((function() {
                        var e = "".concat(a);
                        return logMessage.info("[".concat(g, "]"), "isPowerOnS5.")(r), t.send({
                          method: "post",
                          deviceType: r,
                          sessionKey: e,
                          xml: l
                        })
                      })).then((function(e) {
                        var t = (e || {}).payload;
                        logMessage.info("[".concat(g, "]"), "isPowerOnS5 successful.")(r), n({
                          status: 200,
                          payload: t.replace(/\n/g, "").replace(/\x00/g, "")
                        })
                      })).catch((function(e) {
                        logMessage.error("[".concat(g, "]"), "isPowerOnS5 fail. errorMsg: ".concat(e))(r), o({
                          status: 500,
                          payload: {
                            errorCode: d(e)
                          }
                        })
                      }))
                    }))
                  }
                }(e));
                if ("put" === c) return m(v(e));
              case "fw":
                if ("get" === c) return m(function(e) {
                  return function() {
                    var t = this;
                    return new Promise((function(n, o) {
                      var r = e.deviceType,
                        i = e.modelNumber,
                        s = e.sessionKey,
                        a = {
                          root: {
                            device_type: {
                              $: {
                                key: y.AIO
                              },
                              device: {
                                $: {
                                  key: i
                                },
                                function: {
                                  $: {
                                    key: f.GET_FW_VERSION
                                  }
                                }
                              }
                            }
                          }
                        },
                        c = u(a);
                      Promise.resolve().then((function() {
                        var e = "".concat(s);
                        return logMessage.info("[".concat(g, "]"), "getFWversion.")(r), t.send({
                          method: "post",
                          deviceType: r,
                          sessionKey: e,
                          xml: c
                        })
                      })).then((function(e) {
                        logMessage.info("[".concat(g, "]"), "getFWversion successful.")(r), n({
                          status: 200,
                          payload: null == e ? void 0 : e.payload.replace(/\n/g, "").replace(/\x00/g, "")
                        })
                      })).catch((function(e) {
                        logMessage.error("[".concat(g, "]"), "getFWversion fail.")(r), o({
                          status: 500,
                          payload: {
                            errorCode: d(e)
                          }
                        })
                      }))
                    }))
                  }
                }(e));
              case "lcd":
                switch (c) {
                  case "put":
                    var h = (I = t.body.data).playDevice,
                      _ = I.standbymode,
                      M = I.media,
                      P = {
                        deviceType: e.deviceType,
                        sessionKey: e.sessionKey,
                        modelNumber: e.modelNumber
                      },
                      T = function(e) {
                        return o(o({}, P), {
                          settings: o(o({}, e), {
                            playDevice: h
                          })
                        })
                      };
                    if ("standbymode" in I) return m(function(e) {
                      return function() {
                        var t = this;
                        return new Promise((function(n, o) {
                          var r = e.deviceType,
                            i = (e.settings || {}).powerS5;
                          return Promise.resolve().then((function() {
                            return t.dispatch(function(e) {
                              return function() {
                                var t = this;
                                return new Promise((function(n, o) {
                                  var r, i, s = e.deviceType,
                                    a = e.modelNumber,
                                    c = void 0 === a ? "-1" : a,
                                    l = e.sessionKey,
                                    p = e.settings || {},
                                    v = p.powerS0,
                                    m = p.powerS5,
                                    h = p.brightness,
                                    _ = {
                                      root: {
                                        device_type: {
                                          $: {
                                            key: y.AIO
                                          },
                                          device: {
                                            $: {
                                              key: c
                                            },
                                            function: {
                                              $: {
                                                key: f.SET_BRIGHTNESS
                                              },
                                              settings: {
                                                brightness: {
                                                  s0: v ? null !== (r = null == h ? void 0 : h.s0) && void 0 !== r ? r : h : "1",
                                                  s5: m ? null !== (i = null == h ? void 0 : h.s5) && void 0 !== i ? i : h : "1"
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    },
                                    M = u(_);
                                  Promise.resolve().then((function() {
                                    var e = "".concat(l);
                                    return logMessage.info("[".concat(g, "]"), "setBrightness.")(s), t.send({
                                      method: "post",
                                      deviceType: s,
                                      sessionKey: e,
                                      xml: M
                                    })
                                  })).then((function(e) {
                                    logMessage.info("[".concat(g, "]"), "setBrightness successful.")(s), n({
                                      status: 200,
                                      payload: null == e ? void 0 : e.payload
                                    })
                                  })).catch((function(e) {
                                    logMessage.error("[".concat(g, "]"), "setBrightness fail. errorMsg: ".concat(e))(s), o({
                                      status: 500,
                                      payload: {
                                        errorCode: d(e)
                                      }
                                    })
                                  }))
                                }))
                              }
                            }(e))
                          })).then((function() {
                            return t.dispatch(v(e))
                          })).then((function() {
                            if (i) return t.dispatch(function(e) {
                              return function() {
                                var t = this;
                                return new Promise((function(n, o) {
                                  var r, i = e.deviceType,
                                    s = e.modelNumber,
                                    a = void 0 === s ? "-1" : s,
                                    c = e.sessionKey,
                                    l = e.settings.imageInfo,
                                    p = l.type,
                                    v = l.index_format,
                                    m = l.ext,
                                    h = l.source,
                                    _ = {
                                      root: {
                                        device_type: {
                                          $: {
                                            key: y.AIO
                                          },
                                          device: {
                                            $: {
                                              key: a
                                            },
                                            function: {
                                              $: {
                                                key: f.SET_BOOT_IMAGE
                                              },
                                              settings: {
                                                boot_image: (r = function() {
                                                  switch (p) {
                                                    case "custom":
                                                      var e = "17";
                                                      return "gif" !== m && "mp4" !== m || (e = "16"), {
                                                        mode: e,
                                                        source: "1"
                                                      };
                                                    case "preload":
                                                      return e = "20", "jpg" === m && (e = "17"), {
                                                        mode: e,
                                                        source: "0"
                                                      };
                                                    case "time":
                                                      return {
                                                        mode: "8", source: h
                                                      };
                                                    default:
                                                      throw new Error("type => ".concat(p))
                                                  }
                                                }, {
                                                  mode: r().mode,
                                                  source: r().source,
                                                  index: v
                                                })
                                              }
                                            }
                                          }
                                        }
                                      }
                                    },
                                    M = u(_);
                                  Promise.resolve().then((function() {
                                    var e = "".concat(c);
                                    return logMessage.info("[".concat(g, "]"), "standbyModeBootsAnimation.")(i), t.send({
                                      method: "post",
                                      deviceType: i,
                                      sessionKey: e,
                                      xml: M
                                    })
                                  })).then((function() {
                                    logMessage.info("[".concat(g, "]"), "standbyModeBootsAnimation successful.")(i), n({
                                      status: 200
                                    })
                                  })).catch((function(e) {
                                    logMessage.error("[".concat(g, "]"), "standbyModeBootsAnimation fail.")(i), o({
                                      status: 500,
                                      payload: {
                                        errorCode: d(e)
                                      }
                                    })
                                  }))
                                }))
                              }
                            }(e))
                          })).then((function() {
                            return t.dispatch(function(e) {
                              return function() {
                                var t = this;
                                return new Promise((function(n, o) {
                                  var r = e.deviceType,
                                    i = e.modelNumber,
                                    s = void 0 === i ? "-1" : i,
                                    a = e.sessionKey,
                                    c = e.settings,
                                    l = c.warringStatus,
                                    v = c.temperature,
                                    m = c.playDevice,
                                    h = {
                                      root: {
                                        device_type: {
                                          $: {
                                            key: y.AIO
                                          },
                                          device: {
                                            $: {
                                              key: s
                                            },
                                            function: {
                                              $: {
                                                key: f.SET_PROFILE
                                              },
                                              profiles: {
                                                profile5: {
                                                  main: {
                                                    single: {
                                                      player: {
                                                        $: {
                                                          key: p.WARNING
                                                        },
                                                        setting: {
                                                          play_device: m,
                                                          enable: l ? "1" : "0",
                                                          wait_time: "3000",
                                                          threshold: v
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    },
                                    _ = u(h);
                                  Promise.resolve().then((function() {
                                    var e = "".concat(a);
                                    return logMessage.info("[".concat(g, "]"), "standbyModeTemperature.")(r), t.send({
                                      method: "post",
                                      deviceType: r,
                                      sessionKey: e,
                                      xml: _
                                    })
                                  })).then((function() {
                                    logMessage.info("[".concat(g, "]"), "standbyModeTemperature successful.")(r), n({
                                      status: 200
                                    })
                                  })).catch((function(e) {
                                    logMessage.error("[".concat(g, "]"), "onDeleteFile fail.")(r), o({
                                      status: 500,
                                      payload: {
                                        errorCode: d(e)
                                      }
                                    })
                                  }))
                                }))
                              }
                            }(e))
                          })).then((function() {
                            logMessage.info("[".concat(g, "]"), "applyStandbymode finish.")(r), n({
                              status: 200
                            })
                          })).catch((function(e) {
                            logMessage.error("[".concat(g, "]"), "applyStandbymode fail.")(r), o({
                              status: 500,
                              payload: {
                                errorCode: d(e)
                              }
                            })
                          }))
                        }))
                      }
                    }(T(o({}, _))));
                    if ("media" in I) return m(function(e) {
                      return function() {
                        var t = this;
                        return new Promise((function(n, i) {
                          var s = e.deviceType,
                            a = e.modelNumber,
                            c = void 0 === a ? "-1" : a,
                            l = e.sessionKey,
                            v = e.settings,
                            m = v.media,
                            h = v.playDevice,
                            _ = m.slideShow,
                            M = m.duration,
                            P = m.clock24,
                            T = {
                              root: {
                                device_type: {
                                  $: {
                                    key: y.AIO
                                  },
                                  device: {
                                    $: {
                                      key: c
                                    },
                                    function: {
                                      $: {
                                        key: f.SET_PROFILE
                                      },
                                      profiles: {
                                        profile4: {
                                          main: {
                                            single: {
                                              player: {
                                                $: {
                                                  key: p.MUTLTI_MEDIA
                                                },
                                                setting: {
                                                  play_device: h,
                                                  display_time: "".concat(M, "000"),
                                                  group: r([], _.map((function(e, t) {
                                                    var n = e.type,
                                                      i = e.index_format,
                                                      s = e.category,
                                                      a = e.ext,
                                                      c = e.preloadFileType,
                                                      u = e.timeMode,
                                                      l = e.SDKTimeStyleIndex,
                                                      d = e.info,
                                                      f = e.hardwareFontTitle,
                                                      p = e.hardwareFontValue,
                                                      y = e.hardwareFontColorTitle,
                                                      g = e.hardwareFontColorValue,
                                                      v = {};
                                                    switch (s) {
                                                      default:
                                                        return null;
                                                      case "0":
                                                        var m = {
                                                            JPG: "0",
                                                            dynamicAnim: "2"
                                                          },
                                                          h = "gif" === c ? m.dynamicAnim : m.JPG;
                                                        "custom" === n && (h = m.JPG, "gif" !== a && "mp4" !== a || (h = m.dynamicAnim)), v = {
                                                          $: {
                                                            key: t
                                                          },
                                                          type: h,
                                                          source: "preload" === n ? "1" : "0",
                                                          index_format: i
                                                        };
                                                        break;
                                                      case "3":
                                                        if (v = {
                                                            $: {
                                                              key: t
                                                            },
                                                            type: "5",
                                                            source: "preload" === n ? "1" : "0",
                                                            index_format: i
                                                          }, y && g && d) {
                                                          var _, M = y.r,
                                                            T = y.g,
                                                            I = y.b,
                                                            b = g.r,
                                                            w = g.g,
                                                            O = g.b;
                                                          m = {
                                                            AVI: "1",
                                                            JPG: "0"
                                                          }, _ = "custom" === n && "jpg" === a ? m.JPG : m.AVI, v = o(o({}, v), {
                                                            bg_type: _,
                                                            text_settings: {
                                                              title: {
                                                                font: f,
                                                                color: {
                                                                  red: M,
                                                                  green: T,
                                                                  blue: I
                                                                }
                                                              },
                                                              value: {
                                                                font: p,
                                                                color: {
                                                                  red: b,
                                                                  green: w,
                                                                  blue: O
                                                                }
                                                              }
                                                            },
                                                            sensor_list: {
                                                              sensor: r([], d.map((function(e, t) {
                                                                return {
                                                                  $: {
                                                                    key: t
                                                                  },
                                                                  id: e.key,
                                                                  name: e.name,
                                                                  default_name: e.default_name,
                                                                  type: e.type
                                                                }
                                                              })), !0)
                                                            }
                                                          })
                                                        }
                                                        break;
                                                      case "2":
                                                        var S = "1",
                                                          A = P ? "0" : "1";
                                                        u && l && (S = l, A = u), v = {
                                                          $: {
                                                            key: t
                                                          },
                                                          type: "3",
                                                          source: S,
                                                          index_format: A
                                                        }
                                                    }
                                                    return v
                                                  })), !0)
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            },
                            I = u(T);
                          Promise.resolve().then((function() {
                            var e = "".concat(l);
                            return logMessage.info("[".concat(g, "]"), "multiMediaPlayer.")(s), t.send({
                              method: "post",
                              deviceType: s,
                              sessionKey: e,
                              xml: I
                            })
                          })).then((function() {
                            logMessage.info("[".concat(g, "]"), "multiMediaPlayer successful.")(s), n({
                              status: 200
                            })
                          })).catch((function(e) {
                            logMessage.error("[".concat(g, "]"), "multiMediaPlayer fail.")(s), i({
                              status: 500,
                              payload: {
                                errorCode: d(e)
                              }
                            })
                          }))
                        }))
                      }
                    }(T({
                      media: M
                    })));
                  case "delete":
                    var I = t.body.data;
                    return m(function(e) {
                      return function() {
                        var t = this;
                        return new Promise((function(n, o) {
                          var r, i = e.deviceType,
                            a = e.settings,
                            c = a.ext,
                            l = a.mediaIndex,
                            p = a.saveImageFilePath,
                            v = a.fileName,
                            m = "";
                          return v ? (m = "".concat(p, "\\").concat(v, ".").concat(c), r = {
                            ext: c,
                            mediaIndex: l
                          }) : m = "".concat(p), Promise.resolve().then((function() {
                            return t.dispatch(function(e, t) {
                              return function() {
                                var n = this;
                                return new Promise((function(o, r) {
                                  var i, s = e.deviceType,
                                    a = e.modelNumber,
                                    c = void 0 === a ? "-1" : a,
                                    l = e.sessionKey,
                                    p = e.settings.devicePlayRequireAVI,
                                    v = void 0 !== p && p;
                                  i = t ? {
                                    type: "jpg" === t.ext ? "0" : v ? "2" : "1",
                                    mediaIndex: t.mediaIndex
                                  } : {
                                    type: "99",
                                    mediaIndex: "99"
                                  };
                                  var m = {
                                      root: {
                                        device_type: {
                                          $: {
                                            key: y.AIO
                                          },
                                          device: {
                                            $: {
                                              key: c
                                            },
                                            function: {
                                              $: {
                                                key: f.MEDIA_DELETE
                                              },
                                              settings: {
                                                media_delete: {
                                                  type: null == i ? void 0 : i.type,
                                                  index: null == i ? void 0 : i.mediaIndex
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    },
                                    h = u(m);
                                  Promise.resolve().then((function() {
                                    var e = "".concat(l);
                                    return logMessage.info("[".concat(g, "]"), "mediaDelete.")(s), n.send({
                                      method: "post",
                                      deviceType: s,
                                      sessionKey: e,
                                      xml: h
                                    })
                                  })).then((function() {
                                    logMessage.info("[".concat(g, "]"), "mediaDelete successful.")(s), o({
                                      status: 200
                                    })
                                  })).catch((function(e) {
                                    logMessage.error("[".concat(g, "]"), "mediaDelete fail.")(s), r({
                                      status: 500,
                                      payload: {
                                        errorCode: d(e)
                                      }
                                    })
                                  }))
                                }))
                              }
                            }(e, r))
                          })).then((function() {
                            return t.dispatch(function(e, t) {
                              return function() {
                                return new Promise((function(n) {
                                  var o = e.deviceType;
                                  try {
                                    logMessage.info("[".concat(g, "]"), "ready to delete file: ".concat(t))(o), s.default.existsSync("".concat(pathMapping.proj, "\\view\\").concat(t)) ? (logMessage.info("[".concat(g, "]"), "file exist, delete start.")(o), s.default.lstatSync("".concat(pathMapping.proj, "\\view\\").concat(t)).isDirectory() ? s.default.rmSync("".concat(pathMapping.proj, "\\view\\").concat(t), {
                                      recursive: !0
                                    }) : s.default.unlink("".concat(pathMapping.proj, "\\view\\").concat(t), (function(e) {
                                      e && logMessage.info("[".concat(g, "]"), "err: ".concat(e))(o), logMessage.info("[".concat(g, "]"), "file deleted successfully")(o)
                                    }))) : logMessage.info("[".concat(g, "]"), "The file path does not exist, skipping")(o)
                                  } catch (e) {
                                    logMessage.info("[".concat(g, "]"), "error during deletion: ".concat(e))(o)
                                  }
                                  n()
                                }))
                              }
                            }(e, m))
                          })).then((function() {
                            logMessage.info("[".concat(g, "]"), "deleteImage finish.")(i), n({
                              status: 200
                            })
                          })).catch((function(e) {
                            logMessage.error("[".concat(g, "]"), "deleteImage fail.")(i), o({
                              status: 500,
                              payload: {
                                errorCode: d(e)
                              }
                            })
                          }))
                        }))
                      }
                    }(o(o({}, e), {
                      settings: I
                    })))
                }
            }
          }
        }
      },
      480: function(e, t, n) {
        var o = this && this.__assign || function() {
            return o = Object.assign || function(e) {
              for (var t, n = 1, o = arguments.length; n < o; n++)
                for (var r in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
              return e
            }, o.apply(this, arguments)
          },
          r = this && this.__spreadArray || function(e, t, n) {
            if (n || 2 === arguments.length)
              for (var o, r = 0, i = t.length; r < i; r++) !o && r in t || (o || (o = Array.prototype.slice.call(t, 0, r)), o[r] = t[r]);
            return e.concat(o || Array.prototype.slice.call(t))
          },
          i = this && this.__importDefault || function(e) {
            return e && e.__esModule ? e : {
              default: e
            }
          };
        Object.defineProperty(t, "__esModule", {
          value: !0
        });
        var s = i(n(79)),
          a = i(n(770)),
          c = utility.parseJSON2XML,
          u = utility.parseErrorCode,
          l = s.default.peripheralDevice,
          d = s.default.deviceNameMapping,
          f = a.default.functionNumber,
          p = d[l.AIO] || l.AIO;
        t.default = {
          setPowerS0: function(e) {
            return function() {
              var t = this;
              return new Promise((function(n, o) {
                var r = e.deviceType,
                  i = e.modelNumber,
                  s = e.sessionKey,
                  a = e.settings.status,
                  d = {
                    root: {
                      device_type: {
                        $: {
                          key: l.AIO
                        },
                        device: {
                          $: {
                            key: i
                          },
                          function: {
                            $: {
                              key: f.SET_POWER_S0
                            },
                            settings: {
                              power: a ? 0 : 1,
                              saving: 1
                            }
                          }
                        }
                      }
                    }
                  },
                  y = c(d);
                Promise.resolve().then((function() {
                  var e = "".concat(s);
                  return logMessage.info("[".concat(p, "]"), "setPowerS0.")(r), t.send({
                    method: "post",
                    deviceType: r,
                    sessionKey: e,
                    xml: y
                  })
                })).then((function() {
                  logMessage.info("[".concat(p, "]"), "setPowerS0 successful.")(r), n({
                    status: 200
                  })
                })).catch((function(e) {
                  o({
                    status: 500,
                    payload: {
                      errorCode: u(e)
                    }
                  })
                }))
              }))
            }
          },
          setHardwareMonitor: function(e) {
            return function() {
              var t = this;
              return new Promise((function(n, o) {
                var i = e.deviceType,
                  s = e.modelNumber,
                  a = e.sessionKey,
                  d = e.settings.hardwareMonitorData,
                  y = {
                    root: {
                      device_type: {
                        $: {
                          key: l.AIO
                        },
                        device: {
                          $: {
                            key: s
                          },
                          function: {
                            $: {
                              key: f.SET_PROFILE
                            },
                            profiles: {
                              profile1: {
                                main: {
                                  single: {
                                    player: {
                                      $: {
                                        key: "hw_monitor_player"
                                      },
                                      setting: {
                                        play_device: "AIO_PANEL",
                                        play_mode: "2",
                                        sensor_list: {
                                          sensor: r([], d, !0)
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  g = c(y);
                Promise.resolve().then((function() {
                  var e = "".concat(a);
                  return logMessage.info("[".concat(p, "]"), "setHardwareMonitor.")(i), t.send({
                    method: "post",
                    deviceType: i,
                    sessionKey: e,
                    xml: g
                  })
                })).then((function() {
                  logMessage.info("[".concat(p, "]"), "setHardwareMonitor successful.")(i), n({
                    status: 200
                  })
                })).catch((function(e) {
                  o({
                    status: 500,
                    payload: {
                      errorCode: u(e)
                    }
                  })
                }))
              }))
            }
          },
          setImageOrAnimation: function(e) {
            return function() {
              var t = this;
              return new Promise((function(n, o) {
                var r, i, s = e.deviceType,
                  a = e.modelNumber,
                  d = e.sessionKey,
                  y = e.settings,
                  g = y.imageType,
                  v = y.imageParam,
                  m = {
                    player: "JPG" === g ? "jpg_player" : "gif_player",
                    playSource: "NaN" != parseFloat(v).toString() ? "1" : "0",
                    list: "JPG" === g ? "jpg_list" : "play_list",
                    file: "JPG" === g ? "jpg_file" : "gif_file"
                  },
                  h = {
                    root: {
                      device_type: {
                        $: {
                          key: l.AIO
                        },
                        device: {
                          $: {
                            key: a
                          },
                          function: {
                            $: {
                              key: f.SET_PROFILE
                            },
                            profiles: {
                              profile1: {
                                main: {
                                  single: {
                                    player: {
                                      $: {
                                        key: m.player
                                      },
                                      setting: (r = {
                                        play_device: "AIO_PANEL",
                                        play_source: m.playSource,
                                        play_mode: "2"
                                      }, r[m.list] = (i = {}, i[m.file] = v, i), r)
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  _ = c(h);
                Promise.resolve().then((function() {
                  var e = "".concat(d);
                  return logMessage.info("[".concat(p, "]"), "setImageOrAnimation.")(s), t.send({
                    method: "post",
                    deviceType: s,
                    sessionKey: e,
                    xml: _
                  })
                })).then((function() {
                  logMessage.info("[".concat(p, "]"), "setImageOrAnimation successful.")(s), n({
                    status: 200
                  })
                })).catch((function(e) {
                  o({
                    status: 500,
                    payload: {
                      errorCode: u(e)
                    }
                  })
                }))
              }))
            }
          },
          setCustomBanner: function(e) {
            return function() {
              var t = this;
              return new Promise((function(n, r) {
                var i, s, a = e.deviceType,
                  d = e.modelNumber,
                  y = e.sessionKey,
                  g = e.settings,
                  v = g.text,
                  m = g.imagePath,
                  h = (i = v.split("\n"), (s = {}).text_string1 = i[0], s.text_string2 = i[1], s.text_string3 = i[2], s.text_string4 = i[3], s),
                  _ = {
                    root: {
                      device_type: {
                        $: {
                          key: l.AIO
                        },
                        device: {
                          $: {
                            key: d
                          },
                          function: {
                            $: {
                              key: f.SET_PROFILE
                            },
                            profiles: {
                              profile1: {
                                main: {
                                  single: {
                                    player: {
                                      $: {
                                        key: "text_player"
                                      },
                                      setting: {
                                        play_device: "AIO_PANEL",
                                        play_mode: "2",
                                        text_list: o({
                                          text_jpg: m
                                        }, h)
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  M = c(_);
                Promise.resolve().then((function() {
                  var e = "".concat(y);
                  return logMessage.info("[".concat(p, "]"), "setCustomBanner.")(a), t.send({
                    method: "post",
                    deviceType: a,
                    sessionKey: e,
                    xml: M
                  })
                })).then((function() {
                  logMessage.info("[".concat(p, "]"), "setCustomBanner successful.")(a), n({
                    status: 200
                  })
                })).catch((function(e) {
                  r({
                    status: 500,
                    payload: {
                      errorCode: u(e)
                    }
                  })
                }))
              }))
            }
          },
          setBootImage: function(e) {
            return function() {
              var t = this;
              return new Promise((function(n, o) {
                var r = e.deviceType,
                  i = e.modelNumber,
                  s = e.sessionKey,
                  a = e.settings,
                  d = a.imageType,
                  y = a.imageParam,
                  g = "NaN" != parseFloat(y).toString(),
                  v = {
                    mode: "JPG" === d ? "17" : "16",
                    source: g ? "0" : "1",
                    index: g ? y : "1"
                  },
                  m = {
                    root: {
                      device_type: {
                        $: {
                          key: l.AIO
                        },
                        device: {
                          $: {
                            key: i
                          },
                          function: {
                            $: {
                              key: f.SET_BOOT_IMAGE
                            },
                            settings: {
                              boot_image: {
                                mode: v.mode,
                                source: v.source,
                                index: v.index
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  h = c(m);
                Promise.resolve().then((function() {
                  var e = "".concat(s);
                  return logMessage.info("[".concat(p, "]"), "setBootImage.")(r), t.send({
                    method: "post",
                    deviceType: r,
                    sessionKey: e,
                    xml: h
                  })
                })).then((function() {
                  logMessage.info("[".concat(p, "]"), "setBootImage successful.")(r), n({
                    status: 200
                  })
                })).catch((function(e) {
                  o({
                    status: 500,
                    payload: {
                      errorCode: u(e)
                    }
                  })
                }))
              }))
            }
          },
          setRotation: function(e) {
            return function() {
              var t = this;
              return new Promise((function(n, o) {
                var r = e.deviceType,
                  i = e.modelNumber,
                  s = e.sessionKey,
                  a = e.settings.rotationCode,
                  d = {
                    root: {
                      device_type: {
                        $: {
                          key: l.AIO
                        },
                        device: {
                          $: {
                            key: i
                          },
                          function: {
                            $: {
                              key: f.SET_ROTATION
                            },
                            settings: {
                              rotation: a,
                              saving: "1"
                            }
                          }
                        }
                      }
                    }
                  },
                  y = c(d);
                Promise.resolve().then((function() {
                  var e = "".concat(s);
                  return logMessage.info("[".concat(p, "]"), "setRotation.")(r), t.send({
                    method: "post",
                    deviceType: r,
                    sessionKey: e,
                    xml: y
                  })
                })).then((function() {
                  logMessage.info("[".concat(p, "]"), "setRotation successful.")(r), n({
                    status: 200
                  })
                })).catch((function(e) {
                  o({
                    status: 500,
                    payload: {
                      errorCode: u(e)
                    }
                  })
                }))
              }))
            }
          }
        }
      },
      873: function(e, t, n) {
        var o, r = this && this.__extends || (o = function(e, t) {
            return o = Object.setPrototypeOf || {
              __proto__: []
            }
            instanceof Array && function(e, t) {
              e.__proto__ = t
            } || function(e, t) {
              for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
            }, o(e, t)
          }, function(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");

            function n() {
              this.constructor = e
            }
            o(e, t), e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n)
          }),
          i = this && this.__assign || function() {
            return i = Object.assign || function(e) {
              for (var t, n = 1, o = arguments.length; n < o; n++)
                for (var r in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
              return e
            }, i.apply(this, arguments)
          },
          s = this && this.__importDefault || function(e) {
            return e && e.__esModule ? e : {
              default: e
            }
          };
        Object.defineProperty(t, "__esModule", {
          value: !0
        });
        var a = s(n(147)),
          c = s(n(200)),
          u = s(n(79)),
          l = s(n(498)),
          d = s(n(480)),
          f = s(n(596)),
          p = s(n(797)),
          y = s(n(509)),
          g = s(n(799)),
          v = s(n(283)),
          m = u.default.peripheralDevice,
          h = u.default.deviceNameMapping[m.AIO] || m.AIO,
          _ = function(e) {
            function t(t) {
              var n = e.call(this, t) || this;
              return n.setURL([{
                method: "put",
                url: "/type/:deviceType/model/:modelNumber/oled/imageOrAnimation",
                timeout: 6e5
              }, {
                method: "put",
                url: "/type/:deviceType/model/:modelNumber/lcd/getCroppedImage",
                timeout: 12e4
              }, {
                method: "put",
                url: "/type/:deviceType/model/:modelNumber/lcd/mediaTransfer",
                timeout: 6e5
              }, {
                method: "put",
                url: "/type/:deviceType/model/:modelNumber/fanControl/fanTuning",
                timeout: 6e5
              }, {
                method: "put",
                url: "/type/:deviceType/model/:modelNumber/displayImage",
                timeout: 999999999999,
                hasFormData: !0
              }, {
                method: "put",
                url: "/api/:version/type/:deviceType/model/:modelNumber/fanControl/fanTuning",
                timeout: 6e5
              }, {
                method: "put",
                url: "/api/:version/type/:deviceType/model/:modelNumber/displayImage",
                timeout: 999999999999,
                hasFormData: !0
              }, {
                method: "get",
                url: "/api/:version/type/:deviceType/model/:modelNumber/video/id",
                timeout: 6e4
              }, {
                method: "get",
                url: "/type/:deviceType/model/:modelNumber/:resource/:id?",
                timeout: 6e4
              }, {
                method: "put",
                url: "/type/:deviceType/model/:modelNumber/:resource/:id?",
                timeout: 6e4
              }, {
                method: "post",
                url: "/type/:deviceType/model/:modelNumber/:resource/:id?",
                timeout: 6e4
              }, {
                method: "delete",
                url: "/type/:deviceType/model/:modelNumber/:resource/:id?",
                timeout: 3e4
              }, {
                method: "put",
                url: "/api/:version/type/:deviceType/model/:modelNumber/:resource/:id?",
                timeout: 6e4
              }, {
                method: "post",
                url: "/api/:version/type/:deviceType/model/:modelNumber/:resource/:id?",
                timeout: 6e4
              }, {
                method: "get",
                url: "/api/:version/type/:deviceType/model/:modelNumber/mb/id",
                timeout: 6e4
              }, {
                method: "post",
                url: "/api/:version/type/:deviceType/model/:modelNumber/mb/id",
                timeout: 6e4
              }, {
                method: "put",
                url: "/api/:version/type/:deviceType/model/:modelNumber/mb/id",
                timeout: 6e4
              }, {
                method: "delete",
                url: "/api/:version/type/:deviceType/model/:modelNumber/mb/id",
                timeout: 3e4
              }]), n
            }
            return r(t, e), t.prototype.preload = function(e) {
              return (0, this.processManager.dispatch)(c.default.query(e))
            }, t.prototype.initSDK = function(e) {
              return (0, this.processManager.dispatch)(c.default.query(e))
            }, t.prototype.transferRequest = function(e) {
              var t = this,
                n = this.state,
                o = n.deviceType,
                r = n.processingPool,
                s = e.sessionKey,
                c = e.request,
                u = e.resolve;
              if (c) {
                var l = c.method,
                  d = c.params,
                  f = d.resource,
                  p = d.id;
                if (logMessage.info("[".concat(h, "]"), "[".concat(l, "]"), "".concat(f, "."))(o), "image" === f) {
                  logMessage.info("[".concat(h, "]"), "resource is image")(o);
                  var y = a.default.readFileSync(decodeURIComponent(atob(p)));
                  return void(null == u || u.status(200).send(y))
                }
              }
              r.push(i(i({}, e), {
                timestamp: (new Date).getTime()
              })), Promise.resolve().then((function() {
                return t.routingResource(e)
              })).then((function(e) {
                var n = e || {},
                  o = n.status,
                  r = void 0 === o ? 500 : o,
                  i = n.payload;
                t.dispatchResolve(s, r, i)
              })).catch((function(e) {
                var n = e || {},
                  o = n.status,
                  r = void 0 === o ? 404 : o,
                  i = n.payload;
                t.dispatchResolve(s, r, i)
              }))
            }, t.prototype.getLcd = function(e, t, n) {
              var o = this.state.deviceType,
                r = this.processManager.dispatch,
                i = {
                  deviceType: o,
                  sessionKey: e,
                  modelNumber: t
                };
              return Promise.resolve().then((function() {
                switch (n) {
                  case "getFreeSpaceSize":
                    return r(l.default.getFreeSpaceSize(i));
                  case "isPowerOnS0":
                    return r(l.default.isPowerOnS0(i))
                }
              }))
            }, t.prototype.getFanControl = function(e, t, n) {
              var o = this.state.deviceType,
                r = this.processManager.dispatch,
                i = {
                  deviceType: o,
                  sessionKey: e,
                  modelNumber: t
                };
              return Promise.resolve().then((function() {
                switch (n) {
                  case "getCpuTemp":
                    return r(p.default.getCpuTemp(i));
                  case "getFanPumpRPM":
                    return r(p.default.getFanPumpRPM(i));
                  default:
                    return r(p.default.getInfo(i))
                }
              }))
            }, t.prototype.setLcd = function(e, t, n, o) {
              var r = this.state.deviceType,
                i = this.processManager.dispatch,
                s = {
                  deviceType: r,
                  sessionKey: e,
                  modelNumber: t,
                  settings: o
                };
              return Promise.resolve().then((function() {
                switch (n) {
                  case "onDeleteFile":
                    return i(l.default.onDeleteFile(s));
                  case "setPowerS0":
                    return i(l.default.setPowerS0(s));
                  case "setRotation":
                    return i(l.default.setRotation(s));
                  case "copyFile":
                    return i(l.default.copyFile(s));
                  case "mediaDelete":
                    return i(l.default.mediaDelete(s));
                  case "standbyModeBootsAnimation":
                    return i(l.default.standbyModeBootsAnimation(s));
                  case "standbyModeBrightness":
                    return i(l.default.standbyModeBrightness(s));
                  case "standbyModeTemperature":
                    return i(l.default.standbyModeTemperature(s));
                  case "onApplyHardwareMonitor":
                    return i(l.default.onApplyHardwareMonitor(s));
                  case "onApplyImageOrAnimation":
                    return i(l.default.onApplyImageOrAnimation(s));
                  case "onApplyCustomBanner":
                    return i(l.default.onApplyCustomBanner(s))
                }
              }))
            }, t.prototype.setOled = function(e, t, n, o) {
              var r = this.state.deviceType,
                i = this.processManager.dispatch,
                s = {
                  deviceType: r,
                  sessionKey: e,
                  modelNumber: t,
                  settings: o
                };
              return Promise.resolve().then((function() {
                switch (n) {
                  case "powerS0":
                    return i(d.default.setPowerS0(s));
                  case "hardwareMonitor":
                    return i(d.default.setHardwareMonitor(s));
                  case "imageOrAnimation":
                    return i(d.default.setImageOrAnimation(s));
                  case "customBanner":
                    return i(d.default.setCustomBanner(s));
                  case "bootImage":
                    return i(d.default.setBootImage(s));
                  case "rotation":
                    return i(d.default.setRotation(s))
                }
              }))
            }, t.prototype.setLighting = function(e, t, n, o) {
              var r = this.state.deviceType,
                i = this.processManager.dispatch,
                s = {
                  deviceType: r,
                  sessionKey: e,
                  modelNumber: t,
                  settings: o
                };
              return Promise.resolve().then((function() {
                return i("setLightingEffect" === n ? y.default.setLightingEffect(s) : y.default.setLightingOff(s))
              }))
            }, t.prototype.setMatrix = function(e, t, n, o) {
              var r = this.state.deviceType,
                i = this.processManager.dispatch,
                s = {
                  deviceType: r,
                  sessionKey: e,
                  modelNumber: t,
                  settings: o
                };
              return Promise.resolve().then((function() {
                switch (n) {
                  case "controlMode":
                    return i(c.default.setControlMode(s));
                  case "S0S5Mode":
                    return i(g.default.applyBootS0S5Mode(s));
                  case "ledMode":
                    return i(g.default.applyLEDMode(s));
                  case "hardware":
                    return i(g.default.setMatrixHardware(s))
                }
              }))
            }, t.prototype.getMatrix = function(e, t, n) {
              var o = this.state.deviceType,
                r = this.processManager.dispatch,
                i = {
                  deviceType: o,
                  sessionKey: e,
                  modelNumber: t
                };
              return Promise.resolve().then((function() {
                if ("auraSyncStatus" === n) return r(g.default.getAuraSyncModeStatus(i))
              }))
            }, t.prototype.setFanControl = function(e, t, n, o) {
              var r = this.state.deviceType,
                i = this.processManager.dispatch,
                s = {
                  deviceType: r,
                  sessionKey: e,
                  modelNumber: t,
                  settings: o
                };
              return Promise.resolve().then((function() {
                if ("setFanSettings" === n) return i(p.default.setFanSettings(s))
              }))
            }, t.prototype.getProfile = function(e, t, n) {
              var o = this.state.deviceType,
                r = this.processManager.dispatch;
              return Promise.resolve().then((function() {
                return r(c.default.getProfile({
                  deviceType: o,
                  sessionKey: e,
                  modelNumber: t,
                  profileID: n
                }))
              }))
            }, t.prototype.getLastProfile = function(e, t) {
              var n = {
                deviceType: this.state.deviceType,
                sessionKey: e,
                modelNumber: t
              };
              return (0, this.processManager.dispatch)(c.default.getLastProfile(n))
            }, t.prototype.routingResource = function(e) {
              var t = e.sessionKey,
                n = e.request,
                o = e.resolve,
                r = this.state.deviceType;
              if (!n) return {
                status: 404
              };
              var s = n,
                a = s.method,
                u = s.params,
                g = s.baseUrl,
                m = s.body,
                h = s.files,
                _ = null != u ? u : {},
                M = _.modelNumber,
                P = _.resource,
                T = _.id,
                I = this.processManager.dispatch,
                b = a.toLowerCase(),
                w = m.data,
                O = {
                  deviceType: r,
                  sessionKey: t,
                  modelNumber: M,
                  settings: w
                };
              if (g.includes("mb")) return I((0, v.default)(O, n));
              if (g.includes("/oled/imageOrAnimation")) return I(d.default.setImageOrAnimation(O));
              if (g.includes("getCroppedImage")) return I(l.default.getCroppedImage(O));
              if (g.includes("mediaTransfer") && "put" === b && -1 !== g.indexOf("lcd")) return I(l.default.mediaTransfer(O));
              if (g.includes("fanTuning")) return I(p.default.fanTuning(O));
              if (g.includes("displayImage") && "put" === b) return I(f.default.cropImage({
                deviceType: r,
                sessionKey: t,
                modelNumber: M,
                settings: i(i({}, m), {
                  files: h
                })
              }));
              if (g.includes("video") && "get" === b) return I(c.default.readVideo({
                deviceType: r,
                sessionKey: t,
                modelNumber: M,
                response: o,
                settings: {
                  id: T
                }
              }));
              switch (P) {
                case "powerStatus":
                  if ("get" === b) return I(c.default.isPowerOnS0(O));
                case "initialize":
                  if ("get" === b) return "alertPage" === T ? this.initializeAlertPage(t, M) : this.initialize(t, M);
                case "capability":
                  if ("get" === b) return I("data" === T ? c.default.getCapabilityData(O) : c.default.getCapability(O));
                case "currentMode":
                  if ("put" === b) return I(c.default.setControlMode(O));
                case "deviceInfo":
                  if ("get" === b) return this.getDeviceInfo(t, M);
                case "restore":
                  if ("get" === b) return this.restoreProfile(t, M);
                case "lcd":
                  switch (b) {
                    case "put":
                      var S = n.body.data;
                      return this.setLcd(t, M, T, S);
                    case "get":
                      return this.getLcd(t, M, T)
                  }
                  break;
                case "oled":
                  if ("put" === b) {
                    var A = n.body.data;
                    return this.setOled(t, M, T, A)
                  }
                  break;
                case "lighting":
                  if ("hardware" === T) {
                    var E = n.body.data,
                      k = E.hardwareData,
                      x = E.power,
                      $ = E.selectedHardware,
                      N = E.player,
                      C = E.playDevice,
                      K = {
                        deviceType: r,
                        sessionKey: t,
                        modelNumber: M
                      };
                    switch (b) {
                      case "post":
                        if (k) return I(y.default.getLightingHardwareSensor(i(i({}, K), {
                          settings: {
                            data: k
                          }
                        })));
                      case "put":
                        if (x) return I(y.default.setLightingHardwarePower(i(i({}, K), {
                          settings: i({}, x)
                        })));
                        if ($) return I(y.default.setLightingHardwarePlayer(i(i({}, K), {
                          settings: i({
                            player: N,
                            playDevice: C
                          }, $)
                        })))
                    }
                  } else if ("put" === b) return "led_player2" === (N = w.player) ? I(y.default.setPlayer2LightingEffect(O)) : this.setLighting(t, M, T, w);
                case "matrix":
                  switch (b) {
                    case "get":
                      return this.getMatrix(t, M, T);
                    case "put":
                      var D = n.body.data;
                      return this.setMatrix(t, M, T, D)
                  }
                case "fanControl":
                  switch (b) {
                    case "put":
                      var R = n.body.data;
                      return this.setFanControl(t, M, T, R);
                    case "get":
                      return this.getFanControl(t, M, T)
                  }
                  break;
                case "profile":
                  if ("get" === b) return "last" === T ? this.getLastProfile(t, M) : this.getProfile(t, M, T);
                case "externalFiles":
                  if ("post" === b) return c.default.getExternalImage(O, null == w ? void 0 : w.targetPath);
                  if ("delete" === b) return c.default.deleteExternalImage(O);
                case "display":
                  switch (b) {
                    case "put":
                      var F = n.body.data,
                        L = (x = F.power, F.playDevice),
                        B = F.standbymode,
                        j = F.hardware,
                        G = F.media,
                        z = F.banner,
                        W = F.degrees,
                        H = F.brightness,
                        U = {
                          deviceType: r,
                          sessionKey: t,
                          modelNumber: M
                        },
                        J = function(e) {
                          return i(i({}, U), {
                            settings: i(i({}, e), {
                              playDevice: L
                            })
                          })
                        };
                      if ("power" in F) return I(f.default.setPower(J(i({}, x))));
                      if ("brightness" in F) return I(c.default.setBrightness(J(i({}, H))));
                      if ("standbymode" in F) return I(f.default.applyStandbymode(J(i({}, B))));
                      if ("hardware" in F) return I(f.default.setPlayer(J({
                        hardware: j,
                        layoutVertical: null == j ? void 0 : j.layoutVertical
                      })));
                      if ("media" in F) return I(f.default.setPlayer(J({
                        media: G,
                        layoutVertical: null == G ? void 0 : G.layoutVertical
                      })));
                      if ("banner" in F) return I(f.default.setPlayer(J({
                        banner: z,
                        layoutVertical: null == z ? void 0 : z.layoutVertical
                      })));
                      if ("degrees" in F) return I(f.default.setRotation(J({
                        degrees: W
                      })));
                    case "delete":
                      return I(f.default.deleteImage(O))
                  }
                  break;
                default:
                  return "post" === b || "put" === b ? this.bypassRequest(t, n) : {
                    status: 404
                  }
              }
            }, t.prototype.initialize = function(e, t) {
              var n = this.state.deviceType,
                o = this.processManager.dispatch;
              return Promise.resolve().then((function() {
                return o(c.default.initialize({
                  deviceType: n,
                  sessionKey: e,
                  modelNumber: t
                }))
              }))
            }, t.prototype.initializeAlertPage = function(e, t) {
              var n = this.state.deviceType,
                o = this.processManager.dispatch;
              return Promise.resolve().then((function() {
                return o(c.default.initializeAlertPage({
                  deviceType: n,
                  sessionKey: e,
                  modelNumber: t
                }))
              }))
            }, t.prototype.getDeviceInfo = function(e, t) {
              var n = this.state.deviceType,
                o = this.processManager.dispatch;
              return Promise.resolve().then((function() {
                return o(c.default.getDeviceInfo({
                  deviceType: n,
                  sessionKey: e,
                  modelNumber: t
                }))
              }))
            }, t.prototype.restoreProfile = function(e, t) {
              var n = this.state.deviceType,
                o = this.processManager.dispatch;
              return Promise.resolve().then((function() {
                return o(c.default.restoreProfile({
                  deviceType: n,
                  sessionKey: e,
                  modelNumber: t
                }))
              }))
            }, t.prototype.bypassRequest = function(e, t) {
              var n = this,
                o = this.state.deviceType,
                r = t,
                i = r.method,
                s = r.files,
                a = r.body,
                c = i.toLowerCase(),
                u = "";
              if ("post" === c) {
                var l = Buffer.alloc(0);
                s && Object.values(s).forEach((function(e) {
                  l = Buffer.concat([l, e.buffer])
                })), l = Buffer.concat([l, Buffer.alloc(1)]), u = Buffer.from(l).toString("utf16le")
              }
              return "put" === c && (u = a.data), Promise.resolve().then((function() {
                return n.processManager.send({
                  method: "post",
                  deviceType: o,
                  sessionKey: e,
                  xml: u
                })
              }))
            }, t
          }(BaseRouter);
        t.default = function(e) {
          return new _({
            processManager: e,
            deviceType: m.AIO,
            maxQueue: 3,
            timeout: 6e5
          })
        }
      },
      21: (e, t, n) => {
        n.r(t), n.d(t, {
          NIL: () => T,
          parse: () => m,
          stringify: () => d,
          v1: () => v,
          v3: () => _,
          v4: () => M,
          v5: () => P,
          validate: () => u,
          version: () => I
        });
        const o = require("crypto");
        var r = n.n(o);
        const i = new Uint8Array(256);
        let s = i.length;

        function a() {
          return s > i.length - 16 && (r().randomFillSync(i), s = 0), i.slice(s, s += 16)
        }
        const c = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i,
          u = function(e) {
            return "string" == typeof e && c.test(e)
          },
          l = [];
        for (let e = 0; e < 256; ++e) l.push((e + 256).toString(16).substr(1));
        const d = function(e, t = 0) {
          const n = (l[e[t + 0]] + l[e[t + 1]] + l[e[t + 2]] + l[e[t + 3]] + "-" + l[e[t + 4]] + l[e[t + 5]] + "-" + l[e[t + 6]] + l[e[t + 7]] + "-" + l[e[t + 8]] + l[e[t + 9]] + "-" + l[e[t + 10]] + l[e[t + 11]] + l[e[t + 12]] + l[e[t + 13]] + l[e[t + 14]] + l[e[t + 15]]).toLowerCase();
          if (!u(n)) throw TypeError("Stringified UUID is invalid");
          return n
        };
        let f, p, y = 0,
          g = 0;
        const v = function(e, t, n) {
            let o = t && n || 0;
            const r = t || new Array(16);
            let i = (e = e || {}).node || f,
              s = void 0 !== e.clockseq ? e.clockseq : p;
            if (null == i || null == s) {
              const t = e.random || (e.rng || a)();
              null == i && (i = f = [1 | t[0], t[1], t[2], t[3], t[4], t[5]]), null == s && (s = p = 16383 & (t[6] << 8 | t[7]))
            }
            let c = void 0 !== e.msecs ? e.msecs : Date.now(),
              u = void 0 !== e.nsecs ? e.nsecs : g + 1;
            const l = c - y + (u - g) / 1e4;
            if (l < 0 && void 0 === e.clockseq && (s = s + 1 & 16383), (l < 0 || c > y) && void 0 === e.nsecs && (u = 0), u >= 1e4) throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
            y = c, g = u, p = s, c += 122192928e5;
            const v = (1e4 * (268435455 & c) + u) % 4294967296;
            r[o++] = v >>> 24 & 255, r[o++] = v >>> 16 & 255, r[o++] = v >>> 8 & 255, r[o++] = 255 & v;
            const m = c / 4294967296 * 1e4 & 268435455;
            r[o++] = m >>> 8 & 255, r[o++] = 255 & m, r[o++] = m >>> 24 & 15 | 16, r[o++] = m >>> 16 & 255, r[o++] = s >>> 8 | 128, r[o++] = 255 & s;
            for (let e = 0; e < 6; ++e) r[o + e] = i[e];
            return t || d(r)
          },
          m = function(e) {
            if (!u(e)) throw TypeError("Invalid UUID");
            let t;
            const n = new Uint8Array(16);
            return n[0] = (t = parseInt(e.slice(0, 8), 16)) >>> 24, n[1] = t >>> 16 & 255, n[2] = t >>> 8 & 255, n[3] = 255 & t, n[4] = (t = parseInt(e.slice(9, 13), 16)) >>> 8, n[5] = 255 & t, n[6] = (t = parseInt(e.slice(14, 18), 16)) >>> 8, n[7] = 255 & t, n[8] = (t = parseInt(e.slice(19, 23), 16)) >>> 8, n[9] = 255 & t, n[10] = (t = parseInt(e.slice(24, 36), 16)) / 1099511627776 & 255, n[11] = t / 4294967296 & 255, n[12] = t >>> 24 & 255, n[13] = t >>> 16 & 255, n[14] = t >>> 8 & 255, n[15] = 255 & t, n
          };

        function h(e, t, n) {
          function o(e, o, r, i) {
            if ("string" == typeof e && (e = function(e) {
                e = unescape(encodeURIComponent(e));
                const t = [];
                for (let n = 0; n < e.length; ++n) t.push(e.charCodeAt(n));
                return t
              }(e)), "string" == typeof o && (o = m(o)), 16 !== o.length) throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");
            let s = new Uint8Array(16 + e.length);
            if (s.set(o), s.set(e, o.length), s = n(s), s[6] = 15 & s[6] | t, s[8] = 63 & s[8] | 128, r) {
              i = i || 0;
              for (let e = 0; e < 16; ++e) r[i + e] = s[e];
              return r
            }
            return d(s)
          }
          try {
            o.name = e
          } catch (e) {}
          return o.DNS = "6ba7b810-9dad-11d1-80b4-00c04fd430c8", o.URL = "6ba7b811-9dad-11d1-80b4-00c04fd430c8", o
        }
        const _ = h("v3", 48, (function(e) {
            return Array.isArray(e) ? e = Buffer.from(e) : "string" == typeof e && (e = Buffer.from(e, "utf8")), r().createHash("md5").update(e).digest()
          })),
          M = function(e, t, n) {
            const o = (e = e || {}).random || (e.rng || a)();
            if (o[6] = 15 & o[6] | 64, o[8] = 63 & o[8] | 128, t) {
              n = n || 0;
              for (let e = 0; e < 16; ++e) t[n + e] = o[e];
              return t
            }
            return d(o)
          },
          P = h("v5", 80, (function(e) {
            return Array.isArray(e) ? e = Buffer.from(e) : "string" == typeof e && (e = Buffer.from(e, "utf8")), r().createHash("sha1").update(e).digest()
          })),
          T = "00000000-0000-0000-0000-000000000000",
          I = function(e) {
            if (!u(e)) throw TypeError("Invalid UUID");
            return parseInt(e.substr(14, 1), 16)
          }
      },
      147: e => {
        e.exports = require("fs")
      },
      687: e => {
        e.exports = require("https")
      },
      17: e => {
        e.exports = require("path")
      }
    },
    t = {};

  function n(o) {
    var r = t[o];
    if (void 0 !== r) return r.exports;
    var i = t[o] = {
      exports: {}
    };
    return e[o].call(i.exports, i, i.exports, n), i.exports
  }
  n.n = e => {
    var t = e && e.__esModule ? () => e.default : () => e;
    return n.d(t, {
      a: t
    }), t
  }, n.d = (e, t) => {
    for (var o in t) n.o(t, o) && !n.o(e, o) && Object.defineProperty(e, o, {
      enumerable: !0,
      get: t[o]
    })
  }, n.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t), n.r = e => {
    "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
      value: "Module"
    }), Object.defineProperty(e, "__esModule", {
      value: !0
    })
  };
  var o = n(607);
  module.exports = o
})();