var hcaptcha = (function () {
  "use strict";
  function e(e) {
    var t = this.constructor;
    return this.then(
      function (n) {
        return t.resolve(e()).then(function () {
          return n;
        });
      },
      function (n) {
        return t.resolve(e()).then(function () {
          return t.reject(n);
        });
      }
    );
  }
  var t = setTimeout;
  function n() {}
  function i(e) {
    if (!(this instanceof i))
      throw new TypeError("Promises must be constructed via new");
    if ("function" != typeof e) throw new TypeError("not a function");
    (this._state = 0),
      (this._handled = !1),
      (this._value = undefined),
      (this._deferreds = []),
      c(e, this);
  }
  function o(e, t) {
    for (; 3 === e._state; ) e = e._value;
    0 !== e._state
      ? ((e._handled = !0),
        i._immediateFn(function () {
          var n = 1 === e._state ? t.onFulfilled : t.onRejected;
          if (null !== n) {
            var i;
            try {
              i = n(e._value);
            } catch (o) {
              return void a(t.promise, o);
            }
            r(t.promise, i);
          } else (1 === e._state ? r : a)(t.promise, e._value);
        }))
      : e._deferreds.push(t);
  }
  function r(e, t) {
    try {
      if (t === e)
        throw new TypeError("A promise cannot be resolved with itself.");
      if (t && ("object" == typeof t || "function" == typeof t)) {
        var n = t.then;
        if (t instanceof i) return (e._state = 3), (e._value = t), void s(e);
        if ("function" == typeof n)
          return void c(
            ((o = n),
            (r = t),
            function () {
              o.apply(r, arguments);
            }),
            e
          );
      }
      (e._state = 1), (e._value = t), s(e);
    } catch (h) {
      a(e, h);
    }
    var o, r;
  }
  function a(e, t) {
    (e._state = 2), (e._value = t), s(e);
  }
  function s(e) {
    2 === e._state &&
      0 === e._deferreds.length &&
      i._immediateFn(function () {
        e._handled || i._unhandledRejectionFn(e._value);
      });
    for (var t = 0, n = e._deferreds.length; t < n; t++) o(e, e._deferreds[t]);
    e._deferreds = null;
  }
  function h(e, t, n) {
    (this.onFulfilled = "function" == typeof e ? e : null),
      (this.onRejected = "function" == typeof t ? t : null),
      (this.promise = n);
  }
  function c(e, t) {
    var n = !1;
    try {
      e(
        function (e) {
          n || ((n = !0), r(t, e));
        },
        function (e) {
          n || ((n = !0), a(t, e));
        }
      );
    } catch (i) {
      if (n) return;
      (n = !0), a(t, i);
    }
  }
  (i.prototype["catch"] = function (e) {
    return this.then(null, e);
  }),
    (i.prototype.then = function (e, t) {
      var i = new this.constructor(n);
      return o(this, new h(e, t, i)), i;
    }),
    (i.prototype["finally"] = e),
    (i.all = function (e) {
      return new i(function (t, n) {
        if (!e || "undefined" == typeof e.length)
          throw new TypeError("Promise.all accepts an array");
        var i = Array.prototype.slice.call(e);
        if (0 === i.length) return t([]);
        var o = i.length;
        function r(e, a) {
          try {
            if (a && ("object" == typeof a || "function" == typeof a)) {
              var s = a.then;
              if ("function" == typeof s)
                return void s.call(
                  a,
                  function (t) {
                    r(e, t);
                  },
                  n
                );
            }
            (i[e] = a), 0 == --o && t(i);
          } catch (h) {
            n(h);
          }
        }
        for (var a = 0; a < i.length; a++) r(a, i[a]);
      });
    }),
    (i.resolve = function (e) {
      return e && "object" == typeof e && e.constructor === i
        ? e
        : new i(function (t) {
            t(e);
          });
    }),
    (i.reject = function (e) {
      return new i(function (t, n) {
        n(e);
      });
    }),
    (i.race = function (e) {
      return new i(function (t, n) {
        for (var i = 0, o = e.length; i < o; i++) e[i].then(t, n);
      });
    }),
    (i._immediateFn =
      ("function" == typeof setImmediate &&
        function (e) {
          setImmediate(e);
        }) ||
      function (e) {
        t(e, 0);
      }),
    (i._unhandledRejectionFn = function (e) {
      "undefined" != typeof console &&
        console &&
        console.warn("Possible Unhandled Promise Rejection:", e);
    });
  var l,
    d = (function () {
      if ("undefined" != typeof self) return self;
      if ("undefined" != typeof window) return window;
      if ("undefined" != typeof global) return global;
      throw new Error("unable to locate global object");
    })();
  "Promise" in d
    ? d.Promise.prototype["finally"] || (d.Promise.prototype["finally"] = e)
    : (d.Promise = i),
    Array.prototype.indexOf ||
      (Array.prototype.indexOf = (function (e) {
        return function (t, n) {
          if (null === this || this === undefined)
            throw TypeError(
              "Array.prototype.indexOf called on null or undefined"
            );
          var i = e(this),
            o = i.length >>> 0,
            r = Math.min(0 | n, o);
          if (r < 0) r = Math.max(0, o + r);
          else if (r >= o) return -1;
          if (void 0 === t) {
            for (; r !== o; ++r) if (void 0 === i[r] && r in i) return r;
          } else if (t != t) {
            for (; r !== o; ++r) if (i[r] != i[r]) return r;
          } else for (; r !== o; ++r) if (i[r] === t) return r;
          return -1;
        };
      })(Object)),
    Array.isArray ||
      (Array.isArray = function (e) {
        return "[object Array]" === Object.prototype.toString.call(e);
      }),
    document.getElementsByClassName ||
      (window.Element.prototype.getElementsByClassName =
        document.constructor.prototype.getElementsByClassName =
          function (e) {
            if (document.querySelectorAll)
              return document.querySelectorAll("." + e);
            for (
              var t = document.getElementsByTagName("*"),
                n = new RegExp("(^|\\s)" + e + "(\\s|$)"),
                i = [],
                o = 0;
              o < t.length;
              o++
            )
              n.test(t[o].className) && i.push(t[o]);
            return i;
          }),
    String.prototype.startsWith ||
      (String.prototype.startsWith = function (e, t) {
        return this.substr(!t || t < 0 ? 0 : +t, e.length) === e;
      }),
    String.prototype.endsWith ||
      (String.prototype.endsWith = function (e, t) {
        return (
          (t === undefined || t > this.length) && (t = this.length),
          this.substring(t - e.length, t) === e
        );
      });
  try {
    if (
      Object.defineProperty &&
      Object.getOwnPropertyDescriptor &&
      Object.getOwnPropertyDescriptor(Element.prototype, "textContent") &&
      !Object.getOwnPropertyDescriptor(Element.prototype, "textContent").get
    ) {
      var u = Object.getOwnPropertyDescriptor(Element.prototype, "innerText");
      Object.defineProperty(Element.prototype, "textContent", {
        get: function () {
          return u.get.call(this);
        },
        set: function (e) {
          u.set.call(this, e);
        },
      });
    }
  } catch (ft) {}
  Function.prototype.bind ||
    (Function.prototype.bind = function (e) {
      if ("function" != typeof this)
        throw new TypeError("Function.prototype.bind: Item Can Not Be Bound.");
      var t = Array.prototype.slice.call(arguments, 1),
        n = this,
        i = function () {},
        o = function () {
          return n.apply(
            this instanceof i ? this : e,
            t.concat(Array.prototype.slice.call(arguments))
          );
        };
      return (
        this.prototype && (i.prototype = this.prototype),
        (o.prototype = new i()),
        o
      );
    }),
    "function" != typeof Object.create &&
      (Object.create = function (e, t) {
        function n() {}
        if (((n.prototype = e), "object" == typeof t))
          for (var i in t) t.hasOwnProperty(i) && (n[i] = t[i]);
        return new n();
      }),
    Date.now ||
      (Date.now = function () {
        return new Date().getTime();
      }),
    window.console || (window.console = {});
  for (
    var p,
      f,
      m = ["error", "info", "log", "show", "table", "trace", "warn"],
      g = function (e) {},
      y = m.length;
    --y > -1;

  )
    (l = m[y]), window.console[l] || (window.console[l] = g);
  if (window.atob)
    try {
      window.atob(" ");
    } catch (mt) {
      window.atob =
        ((p = window.atob),
        ((f = function (e) {
          return p(String(e).replace(/[\t\n\f\r ]+/g, ""));
        }).original = p),
        f);
    }
  else {
    var v = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
      w =
        /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;
    window.atob = function (e) {
      if (((e = String(e).replace(/[\t\n\f\r ]+/g, "")), !w.test(e)))
        throw new TypeError(
          "Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded."
        );
      var t, n, i;
      e += "==".slice(2 - (3 & e.length));
      for (var o = "", r = 0; r < e.length; )
        (t =
          (v.indexOf(e.charAt(r++)) << 18) |
          (v.indexOf(e.charAt(r++)) << 12) |
          ((n = v.indexOf(e.charAt(r++))) << 6) |
          (i = v.indexOf(e.charAt(r++)))),
          (o +=
            64 === n
              ? String.fromCharCode((t >> 16) & 255)
              : 64 === i
              ? String.fromCharCode((t >> 16) & 255, (t >> 8) & 255)
              : String.fromCharCode((t >> 16) & 255, (t >> 8) & 255, 255 & t));
      return o;
    };
  }
  Event.prototype.preventDefault ||
    (Event.prototype.preventDefault = function () {
      this.returnValue = !1;
    }),
    Event.prototype.stopPropagation ||
      (Event.prototype.stopPropagation = function () {
        this.cancelBubble = !0;
      });
  var b = [],
    _ = [],
    x = {
      add: function (e) {
        b.push(e);
      },
      remove: function (e) {
        for (var t = !1, n = b.length; --n > -1 && !1 === t; )
          b[n].id === e.id && ((t = b[n]), b.splice(n, 1));
        return t;
      },
      each: function (e) {
        for (var t = -1; ++t < b.length; ) e(b[t]);
      },
      isValidId: function (e) {
        for (var t = !1, n = -1; ++n < b.length && !1 === t; )
          b[n].id === e && (t = !0);
        return t;
      },
      getByIndex: function (e) {
        for (var t = !1, n = -1; ++n < b.length && !1 === t; )
          n === e && (t = b[n]);
        return t;
      },
      getById: function (e) {
        for (var t = !1, n = -1; ++n < b.length && !1 === t; )
          b[n].id === e && (t = b[n]);
        return t;
      },
      getCaptchaIdList: function () {
        var e = [];
        return (
          x.each(function (t) {
            e.push(t.id);
          }),
          e
        );
      },
      pushSession: function (e, t) {
        _.push([e, t]), _.length > 10 && _.splice(0, _.length - 10);
      },
      getSession: function () {
        return _;
      },
    };
  function C() {
    var e = this;
    (this._bottom = 0),
      (this._top = 0),
      (this.storage = {}),
      (this.add = function (t) {
        return (e.storage[e._top] = t), e._top++, t;
      }),
      (this.remove = function () {
        if (!e.empty()) {
          var t = e._bottom,
            n = e.storage[t];
          return (e.storage[t] = null), e._bottom++, n;
        }
      }),
      (this.empty = function () {
        return e._top === e._bottom;
      }),
      (this.size = function () {
        return e._top - e._bottom;
      });
  }
  var k = {
      queue: C,
      depth: function gt(e, t, n) {
        if ("object" == typeof e && e[t] && e[t].length > 0)
          for (var i = e[t].length; --i > -1; ) gt(e[t][i], t, n);
        e !== undefined && n(e);
      },
      breathe: function (e, t, n) {
        var i = new C(),
          o = null;
        for (i.add(e), o = i.remove(); o; ) {
          for (var r = 0; r < o[t].length; r++) i.add(o[t][r]);
          n(o), (o = i.remove());
        }
      },
    },
    E = [
      {
        family: "UC Browser",
        patterns: ["(UC? ?Browser|UCWEB|U3)[ /]?(\\d+)\\.(\\d+)\\.(\\d+)"],
      },
      {
        family: "Opera",
        name_replace: "Opera Mobile",
        patterns: [
          "(Opera)/.+Opera Mobi.+Version/(\\d+)\\.(\\d+)",
          "(Opera)/(\\d+)\\.(\\d+).+Opera Mobi",
          "Opera Mobi.+(Opera)(?:/|\\s+)(\\d+)\\.(\\d+)",
          "Opera Mobi",
          "(?:Mobile Safari).*(OPR)/(\\d+)\\.(\\d+)\\.(\\d+)",
        ],
      },
      {
        family: "Opera",
        name_replace: "Opera Mini",
        patterns: [
          "(Opera Mini)(?:/att|)/?(\\d+|)(?:\\.(\\d+)|)(?:\\.(\\d+)|)",
          "(OPiOS)/(\\d+).(\\d+).(\\d+)",
        ],
      },
      {
        family: "Opera",
        name_replace: "Opera Neon",
        patterns: ["Chrome/.+( MMS)/(\\d+).(\\d+).(\\d+)"],
      },
      {
        name_replace: "Opera",
        patterns: [
          "(Opera)/9.80.*Version/(\\d+)\\.(\\d+)(?:\\.(\\d+)|)",
          "(?:Chrome).*(OPR)/(\\d+)\\.(\\d+)\\.(\\d+)",
        ],
      },
      {
        family: "Firefox",
        name_replace: "Firefox Mobile",
        patterns: [
          "(Fennec)/(\\d+)\\.(\\d+)\\.?([ab]?\\d+[a-z]*)",
          "(Fennec)/(\\d+)\\.(\\d+)(pre)",
          "(Fennec)/(\\d+)\\.(\\d+)",
          "(?:Mobile|Tablet);.*(Firefox)/(\\d+)\\.(\\d+)",
          "(FxiOS)/(\\d+)\\.(\\d+)(\\.(\\d+)|)(\\.(\\d+)|)",
        ],
      },
      {
        name_replace: "Coc Coc",
        patterns: ["(coc_coc_browser)/(\\d+)\\.(\\d+)(?:\\.(\\d+)|)"],
      },
      {
        family: "QQ",
        name_replace: "QQ Mini",
        patterns: ["(MQQBrowser/Mini)(?:(\\d+)(?:\\.(\\d+)|)(?:\\.(\\d+)|)|)"],
      },
      {
        family: "QQ",
        name_replace: "QQ Mobile",
        patterns: ["(MQQBrowser)(?:/(\\d+)(?:\\.(\\d+)|)(?:\\.(\\d+)|)|)"],
      },
      {
        name_replace: "QQ",
        patterns: [
          "(QQBrowser)(?:/(\\d+)(?:\\.(\\d+)\\.(\\d+)(?:\\.(\\d+)|)|)|)",
        ],
      },
      {
        family: "Edge",
        name: "Edge Mobile",
        patterns: [
          "Windows Phone .*(Edge)/(\\d+)\\.(\\d+)",
          "(EdgiOS|EdgA)/(\\d+)\\.(\\d+).(\\d+).(\\d+)",
        ],
      },
      { name_replace: "Edge", patterns: ["(Edge|Edg)/(\\d+)(?:\\.(\\d+)|)"] },
      { patterns: ["(Puffin)/(\\d+)\\.(\\d+)(?:\\.(\\d+)|)"] },
      {
        family: "Chrome",
        name_replace: "Chrome Mobile",
        patterns: [
          "Version/.+(Chrome)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)",
          "; wv\\).+(Chrome)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)",
          "(CriOS)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)",
          "(CrMo)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)",
          "(Chrome)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+) Mobile(?:[ /]|$)",
          " Mobile .*(Chrome)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)",
        ],
      },
      {
        family: "Yandex",
        name_replace: "Yandex Mobile",
        patterns: ["(YaBrowser)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+).*Mobile"],
      },
      {
        name_replace: "Yandex",
        patterns: ["(YaBrowser)/(\\d+)\\.(\\d+)\\.(\\d+)"],
      },
      {
        patterns: [
          "(Vivaldi)/(\\d+)\\.(\\d+)",
          "(Vivaldi)/(\\d+)\\.(\\d+)\\.(\\d+)",
        ],
      },
      {
        name_replace: "Brave",
        patterns: ["(brave)/(\\d+)\\.(\\d+)\\.(\\d+) Chrome"],
      },
      {
        family: "Chrome",
        patterns: [
          "(Chromium|Chrome)/(\\d+)\\.(\\d+)(?:\\.(\\d+)|)(?:\\.(\\d+)|)",
        ],
      },
      {
        name_replace: "Internet Explorer Mobile",
        patterns: ["(IEMobile)[ /](\\d+)\\.(\\d+)"],
      },
      {
        family: "Safari",
        name_replace: "Safari Mobile",
        patterns: [
          "(iPod|iPhone|iPad).+Version/(d+).(d+)(?:.(d+)|).*[ +]Safari",
          "(iPod|iPod touch|iPhone|iPad);.*CPU.*OS[ +](\\d+)_(\\d+)(?:_(\\d+)|).* AppleNews\\/\\d+\\.\\d+\\.\\d+?",
          "(iPod|iPhone|iPad).+Version/(\\d+)\\.(\\d+)(?:\\.(\\d+)|)",
          "(iPod|iPod touch|iPhone|iPad);.*CPU.*OS[ +](\\d+)_(\\d+)(?:_(\\d+)|).*Mobile.*[ +]Safari",
          "(iPod|iPod touch|iPhone|iPad);.*CPU.*OS[ +](\\d+)_(\\d+)(?:_(\\d+)|).*Mobile",
          "(iPod|iPod touch|iPhone|iPad).* Safari",
          "(iPod|iPod touch|iPhone|iPad)",
        ],
      },
      {
        name_replace: "Safari",
        patterns: ["(Version)/(\\d+)\\.(\\d+)(?:\\.(\\d+)|).*Safari/"],
      },
      {
        name_replace: "Internet Explorer",
        patterns: ["(Trident)/(7|8).(0)"],
        major_replace: "11",
      },
      {
        name_replace: "Internet Explorer",
        patterns: ["(Trident)/(6)\\.(0)"],
        major_replace: "10",
      },
      {
        name_replace: "Internet Explorer",
        patterns: ["(Trident)/(5)\\.(0)"],
        major_replace: "9",
      },
      {
        name_replace: "Internet Explorer",
        patterns: ["(Trident)/(4)\\.(0)"],
        major_replace: "8",
      },
      {
        family: "Firefox",
        patterns: [
          "(Firefox)/(\\d+)\\.(\\d+)\\.(\\d+)",
          "(Firefox)/(\\d+)\\.(\\d+)(pre|[ab]\\d+[a-z]*|)",
        ],
      },
    ],
    S = [
      {
        family: "Windows",
        name_replace: "Windows Phone",
        patterns: [
          "(Windows Phone) (?:OS[ /])?(\\d+)\\.(\\d+)",
          "^UCWEB.*; (wds) (\\d+)\\.(d+)(?:\\.(\\d+)|);",
          "^UCWEB.*; (wds) (\\d+)\\.(\\d+)(?:\\.(\\d+)|);",
        ],
      },
      {
        family: "Windows",
        name_replace: "Windows Mobile",
        patterns: ["(Windows ?Mobile)"],
      },
      {
        name_replace: "Android",
        patterns: [
          "(Android)[ \\-/](\\d+)(?:\\.(\\d+)|)(?:[.\\-]([a-z0-9]+)|)",
          "(Android) (d+);",
          "^UCWEB.*; (Adr) (\\d+)\\.(\\d+)(?:[.\\-]([a-z0-9]+)|);",
          "^(JUC).*; ?U; ?(?:Android|)(\\d+)\\.(\\d+)(?:[\\.\\-]([a-z0-9]+)|)",
          "(android)\\s(?:mobile\\/)(\\d+)(?:\\.(\\d+)(?:\\.(\\d+)|)|)",
          "(Silk-Accelerated=[a-z]{4,5})",
          "Puffin/[\\d\\.]+AT",
          "Puffin/[\\d\\.]+AP",
        ],
      },
      {
        name_replace: "Chrome OS",
        patterns: [
          "(x86_64|aarch64)\\ (\\d+)\\.(\\d+)\\.(\\d+).*Chrome.*(?:CitrixChromeApp)$",
          "(CrOS) [a-z0-9_]+ (\\d+)\\.(\\d+)(?:\\.(\\d+)|)",
        ],
      },
      {
        name_replace: "Windows",
        patterns: ["(Windows 10)", "(Windows NT 6\\.4)", "(Windows NT 10\\.0)"],
        major_replace: "10",
      },
      {
        name_replace: "Windows",
        patterns: ["(Windows NT 6\\.3; ARM;)", "(Windows NT 6.3)"],
        major_replace: "8",
        minor_replace: "1",
      },
      {
        name_replace: "Windows",
        patterns: ["(Windows NT 6\\.2)"],
        major_replace: "8",
      },
      {
        name_replace: "Windows",
        patterns: ["(Windows NT 6\\.1)"],
        major_replace: "7",
      },
      {
        name_replace: "Windows",
        patterns: ["(Windows NT 6\\.0)"],
        major_replace: "Vista",
      },
      {
        name_replace: "Windows",
        patterns: ["(Windows (?:NT 5\\.2|NT 5\\.1))"],
        major_replace: "XP",
      },
      {
        name_replace: "Mac OS X",
        patterns: [
          "((?:Mac[ +]?|; )OS[ +]X)[\\s+/](?:(\\d+)[_.](\\d+)(?:[_.](\\d+)|)|Mach-O)",
          "\\w+\\s+Mac OS X\\s+\\w+\\s+(\\d+).(\\d+).(\\d+).*",
          "(?:PPC|Intel) (Mac OS X)",
        ],
      },
      {
        name_replace: "Mac OS X",
        patterns: [" (Dar)(win)/(10).(d+).*((?:i386|x86_64))"],
        major_replace: "10",
        minor_replace: "6",
      },
      {
        name_replace: "Mac OS X",
        patterns: [" (Dar)(win)/(11).(\\d+).*\\((?:i386|x86_64)\\)"],
        major_replace: "10",
        minor_replace: "7",
      },
      {
        name_replace: "Mac OS X",
        patterns: [" (Dar)(win)/(12).(\\d+).*\\((?:i386|x86_64)\\)"],
        major_replace: "10",
        minor_replace: "8",
      },
      {
        name_replace: "Mac OS X",
        patterns: [" (Dar)(win)/(13).(\\d+).*\\((?:i386|x86_64)\\)"],
        major_replace: "10",
        minor_replace: "9",
      },
      {
        name_replace: "iOS",
        patterns: [
          "^UCWEB.*; (iPad|iPh|iPd) OS (\\d+)_(\\d+)(?:_(\\d+)|);",
          "(CPU[ +]OS|iPhone[ +]OS|CPU[ +]iPhone|CPU IPhone OS)[ +]+(\\d+)[_\\.](\\d+)(?:[_\\.](\\d+)|)",
          "(iPhone|iPad|iPod); Opera",
          "(iPhone|iPad|iPod).*Mac OS X.*Version/(\\d+)\\.(\\d+)",
          "\\b(iOS[ /]|iOS; |iPhone(?:/| v|[ _]OS[/,]|; | OS : |\\d,\\d/|\\d,\\d; )|iPad/)(\\d{1,2})[_\\.](\\d{1,2})(?:[_\\.](\\d+)|)",
          "\\((iOS);",
          "(iPod|iPhone|iPad)",
          "Puffin/[\\d\\.]+IT",
          "Puffin/[\\d\\.]+IP",
        ],
      },
      {
        family: "Chrome",
        name_replace: "Chromecast",
        patterns: [
          "(CrKey -)(?:[ /](\\d+)\\.(\\d+)(?:\\.(\\d+)|)|)",
          "(CrKey[ +]armv7l)(?:[ /](\\d+)\\.(\\d+)(?:\\.(\\d+)|)|)",
          "(CrKey)(?:[/](\\d+)\\.(\\d+)(?:\\.(\\d+)|)|)",
        ],
      },
      { name_replace: "Debian", patterns: ["([Dd]ebian)"] },
      {
        family: "Linux",
        name_replace: "Linux",
        patterns: ["(Linux Mint)(?:/(\\d+)|)"],
      },
      {
        family: "Linux",
        patterns: [
          "(Ubuntu|Kubuntu|Arch Linux|CentOS|Slackware|Gentoo|openSUSE|SUSE|Red Hat|Fedora|PCLinuxOS|Mageia|(?:Free|Open|Net|\\b)BSD)",
          "(Mandriva)(?: Linux|)/(?:[\\d.-]+m[a-z]{2}(\\d+).(\\d)|)",
          "(Linux)(?:[ /](\\d+)\\.(\\d+)(?:\\.(\\d+)|)|)",
          "\\(linux-gnu\\)",
        ],
      },
      {
        family: "BlackBerry",
        name_replace: "BlackBerry OS",
        patterns: [
          "(BB10);.+Version/(\\d+)\\.(\\d+)\\.(\\d+)",
          "(Black[Bb]erry)[0-9a-z]+/(\\d+)\\.(\\d+)\\.(\\d+)(?:\\.(\\d+)|)",
          "(Black[Bb]erry).+Version/(\\d+)\\.(\\d+)\\.(\\d+)(?:\\.(\\d+)|)",
          "(Black[Bb]erry)",
        ],
      },
      {
        patterns: [
          "(Fedora|Red Hat|PCLinuxOS|Puppy|Ubuntu|Kindle|Bada|Sailfish|Lubuntu|BackTrack|Slackware|(?:Free|Open|Net|\\b)BSD)[/ ](\\d+)\\.(\\d+)(?:\\.(\\d+)|)(?:\\.(\\d+)|)",
        ],
      },
    ],
    O = navigator.userAgent,
    I = {
      getAgent: function () {
        return O;
      },
      getBrowser: function (e) {
        return B(e || O, E);
      },
      getOS: function (e) {
        return B(e || O, S);
      },
    };
  function P(e, t) {
    try {
      var n = new RegExp(t).exec(e);
      return n
        ? {
            name: n[1] || "Other",
            major: n[2] || "0",
            minor: n[3] || "0",
            patch: n[4] || "0",
          }
        : null;
    } catch (mt) {
      return null;
    }
  }
  function B(e, t) {
    for (var n = null, i = null, o = -1, r = !1; ++o < t.length && !r; ) {
      n = t[o];
      for (var a = -1; ++a < n.patterns.length && !r; )
        r = null !== (i = P(e, n.patterns[a]));
    }
    return r
      ? ((i.family = n.family || n.name_replace || i.name),
        n.name_replace && (i.name = n.name_replace),
        n.major_replace && (i.major = n.major_replace),
        n.minor_replace && (i.minor = n.minor_replace),
        n.patch_replace && (i.minor = n.patch_replace),
        i)
      : { family: "Other", name: "Other", major: "0", minor: "0", patch: "0" };
  }
  function T() {
    var e = this,
      t = I.getBrowser(),
      n = I.getAgent();
    (this.agent = n.toLowerCase()),
      (this.language =
        window.navigator.userLanguage || window.navigator.language),
      (this.isCSS1 = "CSS1Compat" === (document.compatMode || "")),
      (this.width = function () {
        return window.innerWidth && window.document.documentElement.clientWidth
          ? Math.min(window.innerWidth, document.documentElement.clientWidth)
          : window.innerWidth ||
              window.document.documentElement.clientWidth ||
              document.body.clientWidth;
      }),
      (this.height = function () {
        return (
          window.innerHeight ||
          window.document.documentElement.clientHeight ||
          document.body.clientHeight
        );
      }),
      (this.scrollX = function () {
        return window.pageXOffset !== undefined
          ? window.pageXOffset
          : e.isCSS1
          ? document.documentElement.scrollLeft
          : document.body.scrollLeft;
      }),
      (this.scrollY = function () {
        return window.pageYOffset !== undefined
          ? window.pageYOffset
          : e.isCSS1
          ? document.documentElement.scrollTop
          : document.body.scrollTop;
      }),
      (this.type =
        "Edge" === t.family
          ? "edge"
          : "Internet Explorer" === t.family
          ? "ie"
          : "Chrome" === t.family
          ? "chrome"
          : "Safari" === t.family
          ? "safari"
          : "Firefox" === t.family
          ? "firefox"
          : t.family.toLowerCase()),
      (this.version = 1 * (t.major + "." + t.minor) || 0),
      (this.hasPostMessage = !!window.postMessage);
  }
  (T.prototype.hasEvent = function (e, t) {
    return "on" + e in (t || document.createElement("div"));
  }),
    (T.prototype.getScreenDimensions = function () {
      var e = {};
      for (var t in window.screen) e[t] = window.screen[t];
      return delete e.orientation, e;
    }),
    (T.prototype.interrogateNavigator = function () {
      var e = {};
      for (var t in window.navigator)
        try {
          e[t] = window.navigator[t];
        } catch (ft) {}
      if (
        (delete e.plugins,
        delete e.mimeTypes,
        (e.plugins = []),
        window.navigator.plugins)
      )
        for (var n = 0; n < window.navigator.plugins.length; n++)
          e.plugins[n] = window.navigator.plugins[n].filename;
      return e;
    }),
    (T.prototype.supportsCanvas = function () {
      var e = document.createElement("canvas");
      return !(!e.getContext || !e.getContext("2d"));
    }),
    (T.prototype.supportsWebAssembly = function () {
      try {
        if (
          "object" == typeof WebAssembly &&
          "function" == typeof WebAssembly.instantiate
        ) {
          var e = new WebAssembly.Module(
            Uint8Array.of(0, 97, 115, 109, 1, 0, 0, 0)
          );
          if (e instanceof WebAssembly.Module)
            return new WebAssembly.Instance(e) instanceof WebAssembly.Instance;
        }
      } catch (mt) {
        return !1;
      }
    });
  var M = {
      Browser: new T(),
      System: new (function () {
        var e,
          t,
          n = I.getOS(),
          i = I.getAgent();
        (this.mobile =
          ((e = !!(
            "ontouchstart" in window ||
            navigator.maxTouchPoints > 0 ||
            navigator.msMaxTouchPoints > 0
          )),
          (t = !1),
          n &&
            (t =
              [
                "iOS",
                "Windows Phone",
                "Windows Mobile",
                "Android",
                "BlackBerry OS",
              ].indexOf(n.name) >= 0),
          e && t)),
          (this.dpr = function () {
            return window.devicePixelRatio || 1;
          }),
          this.mobile &&
            n &&
            "Windows" === n.family &&
            i.indexOf("touch") < 0 &&
            (this.mobile = !1),
          (this.os =
            "iOS" === n.family
              ? "ios"
              : "Android" === n.family
              ? "android"
              : "Mac OS X" === n.family
              ? "mac"
              : "Windows" === n.family
              ? "windows"
              : "Linux" === n.family
              ? "linux"
              : n.family.toLowerCase()),
          (this.version = (function () {
            if (!n) return "unknown";
            var e = n.major;
            return (
              n.minor && (e += "." + n.minor),
              n.patch && (e += "." + n.patch),
              e
            );
          })());
      })(),
    },
    A = {
      host: null,
      file: null,
      sitekey: null,
      pingdom:
        "safari" === M.Browser.type &&
        "windows" !== M.System.os &&
        "mac" !== M.System.os &&
        "ios" !== M.System.os &&
        "android" !== M.System.os,
      assetDomain: "https://assets.hcaptcha.com",
      assetUrl: "https://assets.hcaptcha.com/captcha/v1/523a6ff/static",
      width: null,
      height: null,
      mobile: null,
    },
    $ = {
      tplinks: "on",
      language: null,
      reportapi: "https://accounts.hcaptcha.com",
      endpoint: "https://hcaptcha.com",
      endpointOverride: null,
      size: "normal",
      theme: "light",
      assethost: null,
      imghost: null,
      recaptchacompat: "true",
    },
    L =
      "Please <a style='color:inherit;text-decoration:underline; font: inherit' target='_blank' href='https://www.whatismybrowser.com/guides/how-to-update-your-browser/auto'>upgrade your browser</a> to complete this captcha.";
  function j(e, t) {
    (e.style.width = "304px"),
      (e.style.height = "78px"),
      (e.style.backgroundColor = "#f9e5e5"),
      (e.style.position = "relative"),
      (e.innerHTML = "");
    var n = document.createElement("div");
    (n.style.width = "284px"),
      (n.style.position = "absolute"),
      (n.style.top = "12px"),
      (n.style.left = "10px"),
      (n.style.fontFamily = "arial, sans-serif"),
      (n.style.color = "#7c0a06"),
      (n.style.fontSize = "14px"),
      (n.style.fontWeight = "normal"),
      (n.style.lineHeight = "18px"),
      (n.innerHTML = t || L),
      e.appendChild(n);
  }
  var D = !0;
  function R(e) {
    var t = { message: e.name + ": " + e.message };
    e.stack && (t.stack_trace = { trace: e.stack }),
      W("report error", "internal", "debug", t),
      z("internal error", "error", A.file);
  }
  function z(e, t, n) {
    D && window.Raven && Raven.captureMessage(e, { level: t, logger: n });
  }
  function W(e, t, n, i) {
    D &&
      window.Raven &&
      Raven.captureBreadcrumb({ message: e, category: t, level: n, data: i });
  }
  function N() {
    try {
      (function (e) {
        var t = [].slice.call(arguments, 1);
        "string" == typeof e
          ? window[e]
            ? "function" == typeof window[e]
              ? window[e].apply(null, t)
              : console.log(
                  "[hCaptcha] Callback '" + e + "' is not a function."
                )
            : console.log("[hCaptcha] Callback '" + e + "' is not defined.")
          : "function" == typeof e
          ? e.apply(null, t)
          : console.log("[hcaptcha] Invalid callback '" + e + "'.");
      }.apply(null, arguments));
    } catch (ft) {
      console.error("[hCaptcha] There was an error in your callback."),
        console.error(ft);
    }
  }
  function U(e, t) {
    var n,
      i = "attempts" in (t = t || {}) ? t.attempts : 1,
      o = t.delay || 0,
      r = t.onFail;
    return (
      (n = function (t, n, a) {
        e().then(t, function (e) {
          var t = i-- > 0;
          r && (t = !1 !== r(e) && t), t ? setTimeout(a, o) : n(e);
        });
      }),
      new Promise(function (e, t) {
        n(e, t, function i() {
          n(e, t, i);
        });
      })
    );
  }
  var F = {
      eventName: function (e) {
        var t = e;
        return (
          "down" === e ||
          "up" === e ||
          "move" === e ||
          "over" === e ||
          "out" === e
            ? (t =
                !M.System.mobile || ("down" !== e && "up" !== e && "move" !== e)
                  ? "mouse" + e
                  : "down" === e
                  ? "touchstart"
                  : "up" === e
                  ? "touchend"
                  : "touchmove")
            : "enter" === e && (t = "keydown"),
          t
        );
      },
      actionName: function (e) {
        var t = e;
        return (
          "touchstart" === t || "mousedown" === t
            ? (t = "down")
            : "touchmove" === t || "mousemove" === t
            ? (t = "move")
            : "touchend" === t || "mouseup" === t
            ? (t = "up")
            : "mouseover" === t
            ? (t = "over")
            : "mouseout" === t && (t = "out"),
          t
        );
      },
      eventCallback: function (e, t, n) {
        var i = F.actionName(e);
        return function (o) {
          if (
            ((o = o || window.event),
            "down" === i ||
              "move" === i ||
              "up" === i ||
              "over" === i ||
              "out" === i ||
              "click" === i)
          ) {
            var r = F.eventCoords(o),
              a = n.getBoundingClientRect();
            (o.windowX = r.x),
              (o.windowY = r.y),
              (o.elementX = o.windowX - (a.x || a.left)),
              (o.elementY = o.windowY - (a.y || a.top));
          }
          (o.keyNum = o.which || o.keyCode || 0),
            ("enter" === e && 13 !== o.keyNum && 32 !== o.keyNum) ||
              ((o.action = i), (o.targetElement = n), t(o));
        };
      },
      eventCoords: function (e) {
        var t = { x: 0, y: 0 };
        if (e.windowsPointer) return e;
        if (!e) return t;
        if (e.touches || e.changedTouches) {
          var n = (
            e.touches && e.touches.length >= 1 ? e.touches : e.changedTouches
          )[0];
          (t.x = n.pageX || n.clientX), (t.y = n.pageY || n.clientY);
        } else (t.x = e.pageX || e.clientX), (t.y = e.pageY || e.clientY);
        return t;
      },
    },
    q = ["Webkit", "Moz", "ms"],
    H = document.createElement("div").style,
    X = {};
  function Y(e) {
    var t = X[e];
    return (
      t ||
      (e in H
        ? e
        : (X[e] =
            (function (e) {
              for (var t = e[0].toUpperCase() + e.slice(1), n = q.length; n--; )
                if ((e = q[n] + t) in H) return e;
            })(e) || e))
    );
  }
  function J(e, t, n) {
    if (
      ((this.dom = null),
      (this._clss = []),
      (this._nodes = []),
      (this._listeners = []),
      (this._frag = null),
      "object" == typeof e)
    ) {
      this.dom = e;
      var i = [],
        o = [];
      e.className && (o = e.className.split(" "));
      for (var r = 0; r < o.length; r++)
        "" !== o[r] && " " !== o[r] && i.push(o[r]);
      this._clss = i;
    } else
      (n !== undefined && null !== n) || (n = !0),
        (e === undefined ||
          ("string" == typeof e &&
            (e.indexOf("#") >= 0 || e.indexOf(".") >= 0))) &&
          (e && (t = e), (e = "div")),
        (this.dom = document.createElement(e)),
        t &&
          (t.indexOf("#") >= 0
            ? (this.dom.id = t.split("#")[1])
            : (t.indexOf(".") >= 0 && (t = t.split(".")[1]),
              this.addClass.call(this, t)));
    !0 === n &&
      ((this._frag = document.createDocumentFragment()),
      this._frag.appendChild(this.dom));
  }
  (J.prototype.createElement = function (e, t) {
    var n = new J(e, t, !1);
    return this.appendElement.call(this, n), this._nodes.push(n), n;
  }),
    (J.prototype.appendElement = function (e) {
      if (e === undefined)
        return R({
          name: "DomElement Add Child",
          message: "Child Element is undefined",
        });
      var t;
      t =
        e._frag !== undefined && null !== e._frag
          ? e._frag
          : e.dom !== undefined
          ? e.dom
          : e;
      try {
        e instanceof J && (e._parent = this), this.dom.appendChild(t);
      } catch (mt) {
        R({ name: "DomElement Add Child", message: "Failed to append child." });
      }
      return this;
    }),
    (J.prototype.removeElement = function (e) {
      try {
        var t = e;
        if (e.dom) {
          t = t.dom;
          for (var n = e._nodes.length; --n > -1; )
            e.dom.removeChild(e._nodes[n].dom || e._nodes[n]),
              e._nodes.splice(n, 1);
        } else
          for (var i = this._nodes.length; --i > -1; )
            this._nodes[i] === t && this._nodes.splice(i, 1);
        t.parentNode === this.dom && this.dom.removeChild(t);
      } catch (mt) {
        R({
          name: "DomElement Remove Child",
          message: "Failed to remove child.",
        });
      }
    }),
    (J.prototype.addClass = function (e) {
      return (
        !1 === this.hasClass.call(this, e) &&
          (this._clss.push(e), (this.dom.className = this._clss.join(" "))),
        this
      );
    }),
    (J.prototype.hasClass = function (e) {
      for (
        var t = this.dom.className.indexOf(e) >= 0, n = this._clss.length;
        n-- && !t;

      )
        t = this._clss[n] === e;
      return t;
    }),
    (J.prototype.removeClass = function (e) {
      for (var t = this._clss.length; --t > -1; )
        this._clss[t] === e && this._clss.splice(t, 1);
      return (this.dom.className = this._clss.join(" ")), this;
    }),
    (J.prototype.text = function (e) {
      if (this && this.dom) {
        if (!e) return this.dom.textContent;
        for (
          var t, n, i, o, r = /&(.*?);/g, a = /<[a-z][\s\S]*>/i;
          null !== (t = r.exec(e));

        ) {
          !1 === a.test(t[0])
            ? ((i = t[0]),
              (o = void 0),
              ((o = document.createElement("div")).innerHTML = i),
              (n = o.textContent),
              (e = e.replace(new RegExp(t[0], "g"), n)))
            : (e = e.replace(t[0], ""));
        }
        return (this.dom.textContent = e), this;
      }
    }),
    (J.prototype.content = J.prototype.text),
    (J.prototype.css = function (e) {
      var t;
      for (var n in e) {
        t = e[n];
        try {
          if (
            ("opacity" !== n &&
              "zIndex" !== n &&
              "fontWeight" !== n &&
              isFinite(t) &&
              parseFloat(t) === t &&
              (t += "px"),
            "ie" === M.Browser.type &&
              8 === M.Browser.version &&
              "opacity" === n)
          )
            this.dom.style.filter = "alpha(opacity=" + 100 * t + ")";
          else {
            var i = Y(n);
            this.dom.style[i] = t;
          }
        } catch (ft) {}
      }
      return this;
    }),
    (J.prototype.backgroundImage = function (e, t, n, i) {
      var o = t !== undefined && n !== undefined,
        r = { "-ms-high-contrast-adjust": "none" };
      if (("object" == typeof t && (i = t), i === undefined && (i = {}), o)) {
        var a = e.width / e.height,
          s = t,
          h = s / a;
        i.cover && h < n && (s = (h = n) * a),
          i.contain && h > n && (s = (h = n) * a),
          (r.width = s),
          (r.height = h),
          i.center &&
            ((r.marginLeft = -s / 2),
            (r.marginTop = -h / 2),
            (r.position = "absolute"),
            (r.left = "50%"),
            (r.top = "50%")),
          (i.left || i.right) && ((r.left = i.left || 0), (r.top = i.top || 0));
      }
      "ie" === M.Browser.type && 8 === M.Browser.version
        ? (r.filter =
            "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" +
            e.src +
            "',sizingMethod='scale')")
        : ((r.background = "url(" + e.src + ")"),
          (r.backgroundPosition = "50% 50%"),
          (r.backgroundRepeat = "no-repeat"),
          (r.backgroundSize = o
            ? s + "px " + h + "px"
            : i.cover
            ? "cover"
            : i.contain
            ? "contain"
            : "100%")),
        this.css.call(this, r);
    }),
    (J.prototype.setAttribute = function (e, t) {
      var n;
      if ("object" == typeof e)
        for (var i in e) (n = e[i]), this.dom.setAttribute(i, n);
      else this.dom.setAttribute(e, t);
    }),
    (J.prototype.removeAttribute = function (e, t) {
      var n;
      if ("object" == typeof e)
        for (var i in e) (n = e[i]), this.dom.removeAttribute(i, n);
      else this.dom.removeAttribute(e, t);
    }),
    (J.prototype.addEventListener = function (e, t, n) {
      var i = {
        event: F.eventName(e),
        handler: F.eventCallback(e, t, this.dom),
        callback: t,
      };
      this._listeners.push(i),
        this.dom.addEventListener
          ? this.dom.addEventListener(i.event, i.handler, n)
          : this.dom.attachEvent("on" + i.event, i.handler);
    }),
    (J.prototype.removeEventListener = function (e, t, n) {
      for (var i, o = this._listeners.length; --o > -1; )
        (i = this._listeners[o]).event === e &&
          i.callback === t &&
          (this._listeners.splice(o, 1),
          this.dom.removeEventListener
            ? this.dom.removeEventListener(i.event, i.handler, n)
            : this.dom.detachEvent("on" + i.event, i.handler));
    }),
    (J.prototype.focus = function () {
      this.dom.focus();
    }),
    (J.prototype.blur = function () {
      this.dom.blur();
    }),
    (J.prototype.html = function (e) {
      return e && (this.dom.innerHTML = e), this.dom.innerHTML;
    }),
    (J.prototype.__destroy = function () {
      for (var e, t = this._listeners.length; --t > -1; )
        (e = this._listeners[t]),
          this._listeners.splice(t, 1),
          this.dom.removeEventListener
            ? this.dom.removeEventListener(e.event, e.handler)
            : this.dom.detachEvent("on" + e.event, e.handler);
      return (
        (this.dom = null),
        (this._clss = []),
        (this._nodes = []),
        (this._listeners = []),
        (this._frag = null),
        (e = null),
        null
      );
    });
  var V = {
    self: function (e, t) {
      var n = {},
        i = Array.prototype.slice.call(arguments, 2);
      for (var o in (t.apply(e, i), e)) n[o] = e[o];
    },
    proto: function (e, t) {
      (e.prototype = Object.create(t.prototype)), (e.prototype.constructor = e);
    },
  };
  function Q(e, t) {
    V.self(this, J, t || "div", e), (this.children = []), (this._events = []);
  }
  V.proto(Q, J),
    (Q.prototype.initComponent = function (e, t, n) {
      var i = new e(t);
      return (
        (i._parent = this),
        this.children.push(i),
        i.dom &&
          (n !== undefined
            ? n.appendElement && n.appendElement(i)
            : this.appendElement(i)),
        i
      );
    }),
    (Q.prototype.destroy = function () {
      var e = this;
      try {
        k.depth(this, "children", function (t) {
          if (e !== t)
            for (var n = e.children.length; --n > -1; )
              e.children[n] === t && e.children.splice(n, 1);
          t._destroy && t._destroy(), (t = null);
        });
      } catch (mt) {
        throw new Error("Trouble destroying nodes: " + mt);
      }
      return null;
    }),
    (Q.prototype._destroy = function () {
      try {
        this.onDestroy && this.onDestroy(),
          this._parent.removeElement && this._parent.removeElement(this);
        for (var e = this._events.length; --e > -1; ) this._events.splice(e, 1);
        (this.children = null),
          (this._destroy = null),
          (this._events = null),
          (this.destroy = null),
          (this.emit = null),
          (this.on = null),
          (this.off = null),
          (this.initComponent = null);
      } catch (mt) {
        R({ name: "DomComponent", message: "Failed to destroy." });
      }
    }),
    (Q.prototype.on = function (e, t) {
      for (var n = this._events.length, i = !1; --n > -1 && !1 === i; )
        this._events[n].event === e && (i = this._events[n]);
      !1 === i && ((i = { event: e, listeners: [] }), this._events.push(i)),
        i.listeners.push(t);
    }),
    (Q.prototype.off = function (e, t) {
      for (var n = this._events.length; --n > -1; )
        if (this._events[n].event === e) {
          for (var i = this._events[n].listeners.length; --i > -1; )
            this._events[n].listeners[i] === t &&
              this._events[n].listeners.splice(i, 1);
          0 === this._events[n].listeners.length && this._events.splice(n, 1);
        }
    }),
    (Q.prototype.emit = function (e) {
      for (
        var t = Array.prototype.slice.call(arguments, 1),
          n = this._events.length;
        --n > -1 && this._events;

      )
        if (this._events[n].event === e)
          for (var i = this._events[n].listeners.length; --i > -1; )
            this._events[n].listeners[i].apply(this, t);
    });
  var K = {
      af: "Afrikaans",
      sq: "Albanian",
      am: "Amharic",
      ar: "Arabic",
      hy: "Armenian",
      az: "Azerbaijani",
      eu: "Basque",
      be: "Belarusian",
      bn: "Bengali",
      bg: "Bulgarian",
      bs: "Bosnian",
      my: "Burmese",
      ca: "Catalan",
      ceb: "Cebuano",
      zh: "Chinese",
      "zh-CN": "Chinese Simplified",
      "zh-TW": "Chinese Traditional",
      co: "Corsican",
      hr: "Croatian",
      cs: "Czech",
      da: "Danish",
      nl: "Dutch",
      en: "English",
      eo: "Esperanto",
      et: "Estonian",
      fa: "Persian",
      fi: "Finnish",
      fr: "French",
      fy: "Frisian",
      gd: "Gaelic",
      gl: "Galacian",
      ka: "Georgian",
      de: "German",
      el: "Greek",
      gu: "Gujurati",
      ht: "Haitian",
      ha: "Hausa",
      haw: "Hawaiian",
      he: "Hebrew",
      hi: "Hindi",
      hmn: "Hmong",
      hu: "Hungarian",
      is: "Icelandic",
      ig: "Igbo",
      id: "Indonesian",
      ga: "Irish",
      it: "Italian",
      ja: "Japanese",
      jw: "Javanese",
      kn: "Kannada",
      kk: "Kazakh",
      km: "Khmer",
      rw: "Kinyarwanda",
      ky: "Kirghiz",
      ko: "Korean",
      ku: "Kurdish",
      lo: "Lao",
      la: "Latin",
      lv: "Latvian",
      lt: "Lithuanian",
      lb: "Luxembourgish",
      mk: "Macedonian",
      mg: "Malagasy",
      ms: "Malay",
      ml: "Malayalam",
      mt: "Maltese",
      mi: "Maori",
      mr: "Marathi",
      mn: "Mongolian",
      ne: "Nepali",
      no: "Norwegian",
      ny: "Nyanja",
      or: "Oriya",
      pl: "Polish",
      pt: "Portuguese",
      ps: "Pashto",
      pa: "Punjabi",
      ro: "Romanian",
      ru: "Russian",
      sm: "Samoan",
      sn: "Shona",
      sd: "Sindhi",
      si: "Singhalese",
      sr: "Serbian",
      sk: "Slovak",
      sl: "Slovenian",
      so: "Somani",
      st: "Southern Sotho",
      es: "Spanish",
      su: "Sundanese",
      sw: "Swahili",
      sv: "Swedish",
      tl: "Tagalog",
      tg: "Tajik",
      ta: "Tamil",
      tt: "Tatar",
      te: "Teluga",
      th: "Thai",
      tr: "Turkish",
      tk: "Turkmen",
      ug: "Uyghur",
      uk: "Ukrainian",
      ur: "Urdu",
      uz: "Uzbek",
      vi: "Vietnamese",
      cy: "Welsh",
      xh: "Xhosa",
      yi: "Yiddish",
      yo: "Yoruba",
      zu: "Zulu",
    },
    G = {
      zh: { "I am human": "我是人" },
      ar: { "I am human": "أنا الإنسان" },
      af: { "I am human": "Ek is menslike" },
      am: { "I am human": "እኔ ሰው ነኝ" },
      hy: { "I am human": "Ես մարդ եմ" },
      az: { "I am human": "Mən insanam" },
      eu: { "I am human": "Gizakia naiz" },
      bn: { "I am human": "আমি মানব নই" },
      bg: { "I am human": "Аз съм човек" },
      ca: { "I am human": "Sóc humà" },
      hr: { "I am human": "Ja sam čovjek" },
      cs: { "I am human": "Jsem člověk" },
      da: { "I am human": "Jeg er et menneske" },
      nl: { "I am human": "Ik ben een mens" },
      et: { "I am human": "Ma olen inimeste" },
      fi: { "I am human": "Olen ihminen" },
      fr: { "I am human": "Je suis humain" },
      gl: { "I am human": "Eu son humano" },
      ka: { "I am human": "მე ვარ ადამიანი" },
      de: { "I am human": "Ich bin ein Mensch" },
      el: { "I am human": "Είμαι άνθρωπος" },
      gu: { "I am human": "હું માનવ છું" },
      iw: { "I am human": ". אני אנושי" },
      hi: { "I am human": "मैं मानव हूं" },
      hu: { "I am human": "Nem vagyok robot" },
      is: { "I am human": "Ég er manneskja" },
      id: { "I am human": "Aku manusia" },
      it: { "I am human": "Sono un essere umano" },
      ja: { "I am human": "私は人間です" },
      kn: { "I am human": "ನಾನು ಮಾನವನು" },
      ko: { "I am human": "사람입니다" },
      lo: { "I am human": "ຂ້ອຍເປັນມະນຸດ" },
      lv: { "I am human": "Es esmu cilvēks" },
      lt: { "I am human": "Aš esu žmogaus" },
      ms: { "I am human": "Saya manusia" },
      ml: { "I am human": "ഞാൻ മനുഷ്യനാണ്" },
      mr: { "I am human": "मी मानवी आहे" },
      mn: { "I am human": "Би бол хүн" },
      no: { "I am human": "Jeg er menneskelig" },
      fa: { "I am human": "من انسانی هستم" },
      pl: { "I am human": "Jestem człowiekiem" },
      pt: { "I am human": "Sou humano" },
      ro: { "I am human": "Eu sunt om" },
      ru: { "I am human": "Я человек" },
      sr: { "I am human": "Ja sam ljudski" },
      si: { "I am human": "මම මිනිස්සු" },
      sk: { "I am human": "Ja som človek" },
      sl: { "I am human": "Jaz sem človeški" },
      es: { "I am human": "Soy humano" },
      sw: { "I am human": "Mimi ni binadamu" },
      sv: { "I am human": "Jag är människa" },
      ta: { "I am human": "நான் மனித" },
      te: { "I am human": "నేను మనిషిని" },
      th: { "I am human": "ผมมนุษย์" },
      tr: { "I am human": "Ben bir insanım" },
      uk: { "I am human": "Я людини" },
      ur: { "I am human": "میں انسان ہوں" },
      vi: { "I am human": "Tôi là con người" },
      zu: { "I am human": "Ngingumuntu" },
    },
    Z = null,
    ee = {
      translate: function (e) {
        var t = ee.getBestTrans(G);
        return (t && t[e]) || e;
      },
      getBestTrans: function (e) {
        var t = ee.getLocale();
        return t in e
          ? e[t]
          : ee.getShortLocale(t) in e
          ? e[ee.getShortLocale(t)]
          : "en" in e
          ? e.en
          : null;
      },
      getLocale: function () {
        var e = Z || window.navigator.userLanguage || window.navigator.language,
          t = ee.getShortLocale(e);
        return (
          "in" === t && (e = "id"),
          "iw" === t && (e = "he"),
          "nb" === t && (e = "no"),
          "ji" === t && (e = "yi"),
          "zh-CN" === e && (e = "zh"),
          "jv" === t && (e = "jw"),
          K[e] ? e : K[t] ? t : "en"
        );
      },
      setLocale: function (e) {
        Z = e;
      },
      getShortLocale: function (e) {
        return e.indexOf("-") >= 0 ? e.substring(0, e.indexOf("-")) : e;
      },
      isShortLocale: function (e) {
        return 2 === e.length || 3 === e.length;
      },
      addTable: function (e, t) {
        if ((t || (t = Object.create(null)), G[e])) {
          var n = G[e];
          for (var i in t) n[i] = t[i];
        } else G[e] = t;
        return G[e];
      },
      getTable: function (e) {
        return G[e];
      },
      addTables: function (e) {
        for (var t in e) ee.addTable(t, e[t]);
        return G;
      },
      getTables: function () {
        return G;
      },
    },
    te = {
      touchstart: "ts",
      touchend: "te",
      touchmove: "tm",
      touchcancel: "tc",
    },
    ne = { mousedown: "md", mouseup: "mu", mousemove: "mm" },
    ie = { keydown: "kd", keyup: "ku" },
    oe = { devicemotion: "dm" },
    re = function (e, t) {
      var n = ne[e],
        i = null;
      return function (e) {
        (i = (function (e) {
          return [e.windowX, e.windowY, Date.now()];
        })(e)),
          t(n, i);
      };
    },
    ae = function (e, t) {
      var n = te[e],
        i = null;
      return function (e) {
        (i = (function (e) {
          for (
            var t,
              n =
                e.touches && e.touches.length >= 1
                  ? e.touches
                  : e.changedTouches,
              i = [],
              o = 0;
            o < n.length;
            o++
          )
            (t = F.eventCoords(n[o])), i.push([n[o].identifier, t.x, t.y]);
          return i.push(Date.now()), i;
        })(e)),
          t(n, i);
      };
    },
    se = function (e, t) {
      var n = ie[e],
        i = null;
      return function (e) {
        (i = (function (e) {
          return [e.keyNum, Date.now()];
        })(e)),
          t(n, i);
      };
    },
    he = function (e, t) {
      var n = oe[e],
        i = null,
        o = [];
      return function (e) {
        null !==
          (i = (function (e, t) {
            (e.acceleration === undefined ||
              (e.acceleration && e.acceleration.x === undefined)) &&
              (e.acceleration = { x: 0, y: 0, z: 0 });
            (e.rotationRate === undefined ||
              (e.rotationRate && e.rotationRate.alpha === undefined)) &&
              (e.rotationRate = { alpha: 0, beta: 0, gamma: 0 });
            var n = [
                e.acceleration.x,
                e.acceleration.y,
                e.acceleration.z,
                e.rotationRate.alpha,
                e.rotationRate.beta,
                e.rotationRate.gamma,
                Date.now(),
              ],
              i = [];
            if (0 === t.length) (t = n), (i = n);
            else {
              for (var o, r = 0, a = 0; a < 6; a++)
                (o = t[a] - n[a]), i.push(n[a]), (r += Math.abs(o));
              if ((i.push(Date.now()), (t = n), r <= 0)) return null;
            }
            return { motion: i, prevmotion: t };
          })(e, o)) && ((o = i.prevmotion), (i = i.motion), t(n, i));
      };
    };
  function ce(e, t) {
    (this._period = e),
      (this._interval = t),
      (this._date = []),
      (this._data = []),
      (this._prevTimestamp = 0),
      (this._meanPeriod = 0),
      (this._meanCounter = 0);
  }
  (ce.prototype.getMeanPeriod = function () {
    return this._meanPeriod;
  }),
    (ce.prototype.getData = function () {
      return this._cleanStaleData(), this._data;
    }),
    (ce.prototype.getSize = function () {
      return this._cleanStaleData(), this._data.length;
    }),
    (ce.prototype.getCapacity = function () {
      return 0 === this._period
        ? this._interval
        : Math.ceil(this._interval / this._period);
    }),
    (ce.prototype.push = function (e, t) {
      this._cleanStaleData();
      var n = 0 === this._date.length;
      if (
        (e - (this._date[this._date.length - 1] || 0) >= this._period &&
          (this._date.push(e), this._data.push(t)),
        !n)
      ) {
        var i = e - this._prevTimestamp;
        (this._meanPeriod =
          (this._meanPeriod * this._meanCounter + i) / (this._meanCounter + 1)),
          this._meanCounter++;
      }
      this._prevTimestamp = e;
    }),
    (ce.prototype._cleanStaleData = function () {
      for (var e = Date.now(), t = this._date.length - 1; t >= 0; t--) {
        if (e - this._date[t] >= this._interval) {
          this._date.splice(0, t + 1), this._data.splice(0, t + 1);
          break;
        }
      }
    });
  function le() {
    (this._manifest = {}),
      (this.state = {
        timeBuffers: {},
        loadTime: Date.now(),
        recording: !1,
        initRecord: !1,
        record: { mouse: !0, touch: !0, keys: !1, motion: !0 },
      }),
      (this._recordEvent = this._recordEvent.bind(this));
  }
  (le.prototype.record = function (e, t, n, i) {
    if (
      ((this._manifest.st = Date.now()),
      (this.state.record.mouse = e === undefined ? this.state.record.mouse : e),
      (this.state.record.touch = n === undefined ? this.state.record.touch : n),
      (this.state.record.keys = t === undefined ? this.state.record.keys : t),
      (this.state.record.motion =
        i === undefined ? this.state.record.motion : i),
      !1 === this.state.initRecord)
    ) {
      var o = new J(document.body);
      this.state.record.mouse &&
        (o.addEventListener("mousedown", re("mousedown", this._recordEvent)),
        o.addEventListener("mousemove", re("mousemove", this._recordEvent)),
        o.addEventListener("mouseup", re("mouseup", this._recordEvent))),
        !0 === this.state.record.keys &&
          (o.addEventListener("keyup", se("keyup", this._recordEvent)),
          o.addEventListener("keydown", se("keydown", this._recordEvent))),
        this.state.record.touch &&
          !0 === M.Browser.hasEvent("touchstart", document.body) &&
          (o.addEventListener(
            "touchstart",
            ae("touchstart", this._recordEvent)
          ),
          o.addEventListener("touchmove", ae("touchmove", this._recordEvent)),
          o.addEventListener("touchend", ae("touchend", this._recordEvent))),
        this.state.record.motion &&
          !0 === M.Browser.hasEvent("devicemotion", window) &&
          o.addEventListener(
            "devicemotion",
            he("devicemotion", this._recordEvent)
          ),
        (this.state.initRecord = !0);
    }
    this.state.recording = !0;
  }),
    (le.prototype.stop = function () {
      this.state.recording = !1;
    }),
    (le.prototype.time = function () {
      return this.state.loadTime;
    }),
    (le.prototype.getData = function () {
      for (var e in this.state.timeBuffers)
        (this._manifest[e] = this.state.timeBuffers[e].getData()),
          (this._manifest[e + "-mp"] =
            this.state.timeBuffers[e].getMeanPeriod());
      return this._manifest;
    }),
    (le.prototype.setData = function (e, t) {
      this._manifest[e] = t;
    }),
    (le.prototype.resetData = function () {
      (this._manifest = {}), (this.state.timeBuffers = {});
    }),
    (le.prototype.circBuffPush = function (e, t) {
      this._recordEvent(e, t);
    }),
    (le.prototype._recordEvent = function (e, t) {
      if (!1 !== this.state.recording)
        try {
          var n = t[t.length - 1];
          this.state.timeBuffers[e] ||
            (this.state.timeBuffers[e] = new ce(16, 15e3)),
            this.state.timeBuffers[e].push(n, t);
        } catch (mt) {
          z("Event recording error: " + JSON.stringify(mt), "error", "motion");
        }
    });
  var de = new le(),
    ue = [],
    pe = !1,
    fe = !1;
  function me() {
    ("interactive" !== document.readyState &&
      "loaded" !== document.readyState &&
      "complete" !== document.readyState) ||
      ge();
  }
  function ge() {
    if (!1 === fe) {
      for (var e = 0; e < ue.length; e++) ue[e].fn.apply(null, ue[e].args);
      ue = [];
    }
    (fe = !0),
      document.removeEventListener
        ? (document.removeEventListener("DOMContentLoaded", ge),
          window.removeEventListener("load", ge))
        : (document.detachEvent("onreadystatechange", me),
          window.detachEvent("onload", ge));
  }
  new J(document);
  var ye = new J(window);
  function ve(e, t) {
    var n;
    if (
      ("object" != typeof e || t || ((t = e), (e = null)),
      !(n = e ? x.getById(e) : x.getByIndex(0)))
    )
      throw e
        ? Error("[hCaptcha] invalid captcha id: " + e)
        : Error("[hCaptcha] no captchas exist.");
    de.setData("exec", !0), n.onReady(n.initChallenge, t);
  }
  function we(e, t) {
    var n = e instanceof HTMLIFrameElement;
    try {
      n
        ? e.parentNode && e.contentWindow.postMessage(JSON.stringify(t), "*")
        : e.postMessage(JSON.stringify(t), "*");
    } catch (ft) {
      z(ft.message, "error", "messaging");
    }
  }
  function be(e, t) {
    (this.target = e),
      (this.id = t),
      (this.messages = []),
      (this.incoming = []),
      (this.waiting = []);
  }
  function _e(e, t) {
    var n = this,
      i = {},
      o = new Promise(function (e, t) {
        (i.resolve = e), (i.reject = t);
      }),
      r = { source: "hcaptcha", label: e, id: n.id, promise: null, lookup: t };
    return (
      o
        .then(function (e) {
          (r.promise = "resolve"),
            null !== e && (r.contents = e),
            we(n.target, r);
        })
        ["catch"](function (e) {
          (r.promise = "reject"), null !== e && (r.error = e), we(n.target, r);
        }),
      i
    );
  }
  (be.prototype.setID = function (e) {
    this.id = e;
  }),
    (be.prototype.contact = function (e, t) {
      if (!this.id)
        throw new Error(
          "Chat requires unique id to communicate between windows"
        );
      var n = this,
        i = Date.now().toString(36),
        o = {
          source: "hcaptcha",
          label: e,
          id: this.id,
          promise: "create",
          lookup: i,
        };
      if (t) {
        if ("object" != typeof t) throw new Error("Message must be an object.");
        o.contents = t;
      }
      return new Promise(function (t, r) {
        n.waiting.push({ label: e, reject: r, resolve: t, lookup: i }),
          we(n.target, o);
      });
    }),
    (be.prototype.listen = function (e, t) {
      if (!this.id)
        throw new Error(
          "Chat requires unique id to communicate between windows"
        );
      for (var n = this.messages.length, i = !1; --n > -1 && !1 === i; )
        this.messages[n].label === e && (i = this.messages[n]);
      !1 === i && ((i = { label: e, listeners: [] }), this.messages.push(i)),
        i.listeners.push(t);
    }),
    (be.prototype.answer = function (e, t) {
      if (!this.id)
        throw new Error(
          "Chat requires unique id to communicate between windows"
        );
      for (var n = this.incoming.length, i = !1; --n > -1 && !1 === i; )
        this.incoming[n].label === e && (i = this.incoming[n]);
      !1 === i && ((i = { label: e, listeners: [] }), this.incoming.push(i)),
        i.listeners.push(t);
    }),
    (be.prototype.send = function (e, t) {
      if (!this.id)
        throw new Error(
          "Chat requires unique id to communicate between windows"
        );
      var n = { source: "hcaptcha", label: e, id: this.id };
      if (t) {
        if ("object" != typeof t) throw new Error("Message must be an object.");
        n.contents = t;
      }
      we(this.target, n);
    }),
    (be.prototype.check = function (e, t) {
      for (
        var n = [].concat.apply(
            [],
            [this.messages, this.incoming, this.waiting]
          ),
          i = [],
          o = -1;
        ++o < n.length;

      )
        if (n[o].label === e) {
          if (t && n[o].lookup && t !== n[o].lookup) continue;
          i.push(n[o]);
        }
      return i;
    }),
    (be.prototype.respond = function (e) {
      for (
        var t,
          n,
          i = -1,
          o = 0,
          r = [].concat.apply([], [this.messages, this.incoming, this.waiting]);
        ++i < r.length;

      )
        if (r[i].label === e.label) {
          if (e.lookup && r[i].lookup && e.lookup !== r[i].lookup) continue;
          var a = [];
          if (
            ((t = r[i]),
            e.error && a.push(e.error),
            e.contents && a.push(e.contents),
            e.promise && "create" !== e.promise)
          ) {
            t[e.promise].apply(t[e.promise], a);
            for (var s = this.waiting.length, h = !1; --s > -1 && !1 === h; )
              this.waiting[s].label === t.label &&
                this.waiting[s].lookup === t.lookup &&
                ((h = !0), this.waiting.splice(s, 1));
            continue;
          }
          for (o = 0; o < t.listeners.length; o++) {
            if (((n = t.listeners[o]), "create" === e.promise)) {
              var c = _e.call(this, t.label, e.lookup);
              a.push(c);
            }
            n.apply(n, a);
          }
        }
      r = null;
    }),
    (be.prototype.destroy = function () {
      return (
        (this.messages = null),
        (this.incoming = null),
        (this.waiting = null),
        null
      );
    });
  var xe = {
    chats: [],
    isSupported: function () {
      return !!window.postMessage;
    },
    createChat: function (e, t) {
      var n = new be(e, t);
      return xe.chats.push(n), n;
    },
    addChat: function (e) {
      xe.chats.push(e);
    },
    removeChat: function (e) {
      for (var t = !1, n = xe.chats.length; --n > -1 && !1 === t; )
        e.id === xe.chats[n].id &&
          e.target === xe.chats[n].target &&
          ((t = xe.chats[n]), xe.chats.splice(n, 1));
      return t;
    },
    handle: function (e) {
      var t = e.data;
      if ("string" == typeof t)
        try {
          if (!(t.indexOf("hcaptcha") >= 0)) return;
          t = JSON.parse(t);
          for (var n, i = xe.chats, o = -1; ++o < i.length; )
            (n = i[o]).id === t.id && n.respond(t);
        } catch (ft) {
          W("postMessage handler error", "postMessage", "debug", {
            event: e,
            error: ft,
          });
        }
    },
  };
  window.addEventListener
    ? window.addEventListener("message", xe.handle)
    : window.attachEvent("onmessage", xe.handle);
  var Ce = {
      getCookie: function (e) {
        var t = document.cookie.replace(/ /g, "").split(";");
        try {
          for (var n = "", i = t.length; i-- && !n; )
            t[i].indexOf(e) >= 0 && (n = t[i]);
          return n;
        } catch (mt) {
          return "";
        }
      },
      hasCookie: function (e) {
        return !!Ce.getCookie(e);
      },
      supportsAPI: function () {
        try {
          return (
            "hasStorageAccess" in document && "requestStorageAccess" in document
          );
        } catch (mt) {
          return !1;
        }
      },
      hasAccess: function () {
        return new Promise(function (e) {
          document
            .hasStorageAccess()
            .then(function () {
              e(!0);
            })
            ["catch"](function () {
              e(!1);
            });
        });
      },
      requestAccess: function () {
        try {
          return document.requestStorageAccess();
        } catch (mt) {
          return Promise.resolve();
        }
      },
    },
    ke = function (e) {
      for (
        var t,
          n,
          i,
          o = {},
          r = e ? (e.indexOf("&") >= 0 ? e.split("&") : [e]) : [],
          a = 0;
        a < r.length;
        a++
      )
        r[a].indexOf("=") >= 0 &&
          ((t = r[a].split("=")),
          (n = decodeURIComponent(t[0])),
          ("false" !== (i = decodeURIComponent(t[1])) && "true" !== i) ||
            (i = "true" === i),
          (o[n] = i));
      return o;
    },
    Ee = function (e) {
      var t = [];
      for (var n in e)
        t.push([encodeURIComponent(n), encodeURIComponent(e[n])].join("="));
      return t.join("&");
    };
  function Se(e, t) {
    (this.id = e),
      (this.width = null),
      (this.height = null),
      (this.mobile = !1),
      (this.ready = !1),
      (this.listeners = []),
      (this.config = t),
      (this._visible = !1),
      (this._selected = !1),
      (this.$iframe = new J("iframe")),
      (this._host = A.host || window.location.hostname);
    var n = A.assetUrl;
    $.assethost && (n = $.assethost + A.assetUrl.replace(A.assetDomain, "")),
      (this.$iframe.dom.src =
        n +
        "/hcaptcha-challenge.html#id=" +
        this.id +
        "&host=" +
        this._host +
        (t ? "&" + Ee(this.config) : "")),
      (this.$iframe.dom.title = "Main content of the hCaptcha challenge"),
      (this.$iframe.dom.frameBorder = 0),
      (this.$iframe.dom.scrolling = "no"),
      this.setupParentContainer(t),
      this._hasCustomContainer
        ? (this._hideIframe(), this._parent.appendChild(this.$iframe.dom))
        : ((this.$container = new J("div")),
          (this.$wrapper = this.$container.createElement("div")),
          (this.$overlay = this.$container.createElement("div")),
          (this.$arrow = this.$container.createElement("div")),
          (this.$arrow.fg = this.$arrow.createElement("div")),
          (this.$arrow.bg = this.$arrow.createElement("div")),
          this.style.call(this),
          this.$wrapper.appendElement(this.$iframe),
          this._parent.appendChild(this.$container.dom),
          this.$container.setAttribute("aria-hidden", !0)),
      (this.chat = xe.createChat(this.$iframe.dom, e));
  }
  function Oe(e, t, n) {
    (this.id = t),
      (this.response = null),
      (this.location = { tick: null, offset: null, bounding: null }),
      (this.config = n),
      (this._ticked = !0),
      (this.$container = e instanceof J ? e : new J(e)),
      (this._host = A.host || window.location.hostname),
      (this.$iframe = new J("iframe"));
    var i = A.assetUrl;
    $.assethost && (i = $.assethost + A.assetUrl.replace(A.assetDomain, "")),
      (this.$iframe.dom.src =
        i +
        "/hcaptcha-checkbox.html#id=" +
        this.id +
        "&host=" +
        this._host +
        (n ? "&" + Ee(this.config) : "")),
      (this.$iframe.dom.title =
        "widget containing checkbox for hCaptcha security challenge"),
      (this.$iframe.dom.tabIndex = this.config.tabindex || 0),
      (this.$iframe.dom.frameBorder = "0"),
      (this.$iframe.dom.scrolling = "no"),
      this.config.size &&
        "invisible" == this.config.size &&
        this.$iframe.setAttribute("aria-hidden", "true"),
      this.$iframe.setAttribute("data-hcaptcha-widget-id", t),
      this.$iframe.setAttribute("data-hcaptcha-response", ""),
      this.$container.appendElement(this.$iframe),
      "off" !== $.recaptchacompat &&
        ((this.$textArea0 = this.$container.createElement(
          "textarea",
          "#g-recaptcha-response-" + t
        )),
        (this.$textArea0.dom.name = "g-recaptcha-response"),
        this.$textArea0.css({ display: "none" })),
      (this.$textArea1 = this.$container.createElement(
        "textarea",
        "#h-captcha-response-" + t
      )),
      (this.$textArea1.dom.name = "h-captcha-response"),
      this.$textArea1.css({ display: "none" }),
      (this.chat = xe.createChat(this.$iframe.dom, t)),
      (this.clearLoading = this.clearLoading.bind(this));
  }
  function Ie(e, t, n) {
    if (!n.sitekey)
      throw new Pe(
        "Missing sitekey",
        "https://hcaptcha.com/docs/configuration#jsapi"
      );
    (this.id = t),
      (this.visible = !1),
      (this.overflow = { override: !1, cssUsed: !0, value: null, scroll: 0 }),
      (this.onError = null),
      (this.onPass = null),
      (this.onExpire = null),
      (this.onChalExpire = null),
      (this.onOpen = null),
      (this.onClose = null),
      (this._ready = !1),
      (this._listeners = []),
      (this.config = n),
      (this._state = {
        escaped: !1,
        passed: !1,
        expiredChallenge: !1,
        expiredResponse: !1,
      }),
      (this._responseTimer = null),
      (this.challenge = new Se(t, n)),
      (this.checkbox = new Oe(e, t, n)),
      (this.initChallenge = this.initChallenge.bind(this)),
      (this.closeChallenge = this.closeChallenge.bind(this)),
      (this.displayChallenge = this.displayChallenge.bind(this));
  }
  function Pe(e, t) {
    var n = "[hCaptcha] " + e;
    t && (n += " - " + t),
      (this.message =
        "hCaptcha has failed to initialize. Please see the developer tools console for more information."),
      (this.reason = n);
  }
  function Be() {
    V.self(this, J, "canvas");
    var e = this;
    (this.element = this.dom),
      (this.ctx = this.element.getContext("2d")),
      (this.scale = 1),
      (this.dpr = window.devicePixelRatio || 1),
      (this.clearColor = "#fff"),
      (this.ctx.roundedRect = function (t, n, i, o, r) {
        var a = i > 0 ? r : -r,
          s = o > 0 ? r : -r;
        e.ctx.beginPath(),
          e.ctx.moveTo(t + a, n),
          e.ctx.lineTo(t + i - a, n),
          e.ctx.quadraticCurveTo(t + i, n, t + i, n + s),
          e.ctx.lineTo(t + i, n + o - s),
          e.ctx.quadraticCurveTo(t + i, n + o, t + i - a, n + o),
          e.ctx.lineTo(t + a, n + o),
          e.ctx.quadraticCurveTo(t, n + o, t, n + o - s),
          e.ctx.lineTo(t, n + s),
          e.ctx.quadraticCurveTo(t, n, t + a, n),
          e.ctx.closePath();
      });
  }
  function Te(e) {
    (e = e || {}),
      (this.x = e.x || 0),
      (this.y = e.y || 0),
      (this.rotate = this.rotate.bind(this)),
      (this.getDistance = this.getDistance.bind(this)),
      (this.radius = 0),
      (this.tolerance = 0),
      (this.fill = !1),
      (this.stroke = !1),
      (this.fillColor = "#fff"),
      (this.strokeColor = "#fff"),
      (this.strokeWidth = 1);
  }
  function Me(e, t, n) {
    V.self(this, Te, e),
      (this.handleIn = new Te(t)),
      (this.handleOut = new Te(n)),
      (this.prev = null),
      (this.next = null),
      (this.index = 0);
  }
  (Se.prototype.setupParentContainer = function (e) {
    var t,
      n = e["challenge-container"];
    n && (t = "string" == typeof n ? document.getElementById(n) : n),
      t
        ? ((this._hasCustomContainer = !0), (this._parent = t))
        : ((this._hasCustomContainer = !1), (this._parent = document.body));
  }),
    (Se.prototype._hideIframe = function () {
      var e = {};
      "ie" !== M.Browser.type ||
      ("ie" === M.Browser.type && 8 !== M.Browser.version)
        ? ((e.opacity = 0), (e.visibility = "hidden"))
        : (e.display = "none"),
        this.$iframe.setAttribute("aria-hidden", !0),
        this.$iframe.css(e);
    }),
    (Se.prototype._showIframe = function () {
      var e = {};
      "ie" !== M.Browser.type ||
      ("ie" === M.Browser.type && 8 !== M.Browser.version)
        ? ((e.opacity = 1), (e.visibility = "visible"))
        : (e.display = "block"),
        this.$iframe.removeAttribute("aria-hidden"),
        this.$iframe.css(e);
    }),
    (Se.prototype.style = function () {
      if (this._hasCustomContainer)
        this.$iframe.css({
          border: 0,
          position: "relative",
          backgroundColor: "#fff",
        });
      else {
        var e = {
          backgroundColor: "#fff",
          border: "1px solid rgb(208, 208, 208)",
          boxShadow: "rgba(0, 0, 0, 0.1) 0px 0px 4px",
          borderRadius: 4,
          left: -1e4,
          top: -1e4,
          zIndex: -9999999999999,
          position: "absolute",
        };
        "ie" !== M.Browser.type ||
        ("ie" === M.Browser.type && 8 !== M.Browser.version)
          ? ((e.transition = "opacity 0.15s ease-out"),
            (e.opacity = 0),
            (e.visibility = "hidden"))
          : (e.display = "none"),
          this.$container.css(e),
          this.$wrapper.css({ position: "relative" }),
          this.$overlay.css({
            width: "100%",
            height: "100%",
            position: "fixed",
            pointerEvents: "none",
            top: 0,
            left: 0,
            zIndex: 0,
            backgroundColor: "#fff",
            opacity: 0.05,
          }),
          this.$arrow.css({
            borderWidth: 11,
            position: "absolute",
            pointerEvents: "none",
            marginTop: -11,
            zIndex: 1,
            right: "100%",
          }),
          this.$arrow.fg.css({
            borderWidth: 10,
            borderStyle: "solid",
            borderColor:
              "transparent rgb(255, 255, 255) transparent transparent",
            position: "relative",
            top: 10,
            zIndex: 1,
          }),
          this.$arrow.bg.css({
            borderWidth: 11,
            borderStyle: "solid",
            borderColor:
              "transparent rgb(208, 208, 208) transparent transparent",
            position: "relative",
            top: -11,
            zIndex: 0,
          }),
          this.$iframe.css({ border: 0, zIndex: 2e9, position: "relative" });
      }
    }),
    (Se.prototype.setup = function (e) {
      return this.chat.send("create-challenge", e);
    }),
    (Se.prototype.sendProof = function (e) {
      return this.chat.contact("solve-proof", e);
    }),
    (Se.prototype.sendTranslation = function (e) {
      var t = { locale: e, table: ee.getTable(e) || {} };
      this.chat && this.chat.send("challenge-translate", t);
    }),
    (Se.prototype.isVisible = function () {
      return this._visible;
    }),
    (Se.prototype.getDimensions = function (e, t) {
      return this._visible
        ? this.chat.contact("resize-challenge", { width: e, height: t })
        : Promise.resolve(null);
    }),
    (Se.prototype.show = function () {
      if (!0 !== this._visible)
        if (((this._visible = !0), this._hasCustomContainer))
          this._showIframe();
        else {
          var e = { zIndex: 9999999999999 };
          "ie" !== M.Browser.type ||
          ("ie" === M.Browser.type && 8 !== M.Browser.version)
            ? ((e.opacity = 1), (e.visibility = "visible"))
            : (e.display = "block"),
            this.$container.css(e),
            this.$container.removeAttribute("aria-hidden"),
            this.$overlay.css({ pointerEvents: "auto", cursor: "pointer" }),
            this.$iframe.dom.focus();
        }
    }),
    (Se.prototype.close = function () {
      if (((this._visible = !1), this._hasCustomContainer))
        return this._hideIframe(), void this.chat.send("close-challenge");
      var e = { left: -1e4, top: -1e4, zIndex: -9999999999999 };
      "ie" !== M.Browser.type ||
      ("ie" === M.Browser.type && 8 !== M.Browser.version)
        ? ((e.opacity = 0), (e.visibility = "hidden"))
        : (e.display = "none"),
        this.$container.css(e),
        this._hasCustomContainer ||
          this.$overlay.css({ pointerEvents: "none", cursor: "default" }),
        this.chat.send("close-challenge"),
        this.$container.setAttribute("aria-hidden", !0);
    }),
    (Se.prototype.size = function (e, t, n) {
      (this.width = e),
        (this.height = t),
        (this.mobile = n),
        this.$iframe.css({ width: e, height: t }),
        this._hasCustomContainer ||
          (this.$wrapper.css({ width: e, height: t }),
          n
            ? this.$overlay.css({ opacity: 0.5 })
            : this.$overlay.css({ opacity: 0.05 }));
    }),
    (Se.prototype.position = function (e) {
      if (!this._hasCustomContainer && e) {
        var t = window.document.documentElement,
          n = M.Browser.scrollY(),
          i = M.Browser.width(),
          o = M.Browser.height(),
          r =
            this.mobile ||
            "invisible" === this.config.size ||
            e.offset.left + e.tick.x <= e.tick.width / 2,
          a = Math.round(e.bounding.top) + n !== e.offset.top,
          s = this.height > t.clientHeight,
          h = r ? (i - this.width) / 2 : e.bounding.left + e.tick.right + 10;
        (h + this.width + 10 > i || h < 0) &&
          ((h = (i - this.width) / 2), (r = !0));
        var c =
            (t.scrollHeight < t.clientHeight
              ? t.clientHeight
              : t.scrollHeight) -
            this.height -
            10,
          l = r
            ? (o - this.height) / 2 + n
            : e.bounding.top + e.tick.y + n - this.height / 2;
        a && l < n && (l = n + 10),
          a && l + this.height >= n + o && (l = n + o - (this.height + 10)),
          (l = Math.max(Math.min(l, c), 10));
        var d = e.bounding.top + e.tick.y + n - l - 10,
          u = this.height - 10 - 30;
        return (
          (d = Math.max(Math.min(d, u), 10)),
          this.$container.css({ left: h, top: l }),
          this.$arrow.fg.css({ display: r ? "none" : "block" }),
          this.$arrow.bg.css({ display: r ? "none" : "block" }),
          this.$arrow.css({ top: d }),
          (this.top = l),
          this.$container.dom.getBoundingClientRect(),
          s
        );
      }
    }),
    (Se.prototype.destroy = function () {
      this._visible && this.close.call(this),
        this._hasCustomContainer
          ? this._parent.removeChild(this.$iframe.dom)
          : (this._parent.removeChild(this.$container.dom),
            (this.$container = this.$container.__destroy())),
        (this.$iframe = this.$iframe.__destroy()),
        xe.removeChat(this.chat),
        (this.chat = this.chat.destroy());
    }),
    (Se.prototype.setReady = function (e) {
      if (((this.ready = e), this.ready))
        for (var t, n = this.listeners.length; --n > -1; )
          (t = this.listeners[n]), this.listeners.splice(n, 1), t();
    }),
    (Se.prototype.onReady = function (e) {
      var t = Array.prototype.slice.call(arguments, 1),
        n = function () {
          e.apply(null, t);
        };
      this.ready ? n() : this.listeners.push(n);
    }),
    (Se.prototype.onOverlayClick = function (e) {
      this._hasCustomContainer || this.$overlay.addEventListener("click", e);
    }),
    (Se.prototype.setEndpoint = function (e) {
      this.chat && this.chat.send("challenge-update", { endpoint: e });
    }),
    (Se.prototype.setData = function (e) {
      this.chat && this.chat.send("challenge-data", e);
    }),
    (Oe.prototype.setResponse = function (e) {
      (this.response = e),
        this.$iframe.dom.setAttribute("data-hcaptcha-response", e),
        "off" !== $.recaptchacompat && (this.$textArea0.dom.value = e),
        (this.$textArea1.dom.value = e);
    }),
    (Oe.prototype.style = function () {
      switch (this.config.size) {
        case "compact":
          this.$iframe.css({ width: 164, height: 144 });
          break;
        case "invisible":
          this.$iframe.css({ display: "none" });
          break;
        default:
          this.$iframe.css({ width: 303, height: 78, overflow: "hidden" });
      }
    }),
    (Oe.prototype.reset = function () {
      (this._ticked = !1), this.chat && this.chat.send("checkbox-reset");
    }),
    (Oe.prototype.clearLoading = function () {
      this.chat && this.chat.send("checkbox-clear");
    }),
    (Oe.prototype.sendTranslation = function (e) {
      var t = { locale: e, table: ee.getTable(e) || {} };
      this.chat && this.chat.send("checkbox-translate", t);
    }),
    (Oe.prototype.status = function (e, t) {
      this.chat &&
        this.chat.send("checkbox-status", {
          text: e || null,
          a11yOnly: t || !1,
        });
    }),
    (Oe.prototype.tick = function () {
      (this._ticked = !0), this.chat && this.chat.send("checkbox-tick");
    }),
    (Oe.prototype.getTickLocation = function () {
      return this.chat.contact("checkbox-location");
    }),
    (Oe.prototype.getOffset = function () {
      var e = this.$iframe.dom;
      e.offsetParent || (e = e.parentElement);
      for (var t = 0, n = 0; e; )
        (t += e.offsetLeft), (n += e.offsetTop), (e = e.offsetParent);
      return { top: n, left: t };
    }),
    (Oe.prototype.getBounding = function () {
      return this.$iframe.dom.getBoundingClientRect();
    }),
    (Oe.prototype.destroy = function () {
      this._ticked && this.reset(),
        this.$container.removeElement(this.$iframe),
        this.$container.removeElement(this.$textArea1),
        "off" !== $.recaptchacompat &&
          (this.$container.removeElement(this.$textArea0),
          (this.$textArea0 = this.$textArea0.__destroy())),
        (this.$textArea1 = this.$textArea1.__destroy()),
        (this.$container = this.$container.__destroy()),
        (this.$iframe = this.$iframe.__destroy()),
        xe.removeChat(this.chat),
        (this.chat = this.chat.destroy());
    }),
    (Ie.prototype._resetTimer = function () {
      null !== this._responseTimer &&
        (clearTimeout(this._responseTimer), (this._responseTimer = null));
    }),
    (Ie.prototype.initChallenge = function (e) {
      e || (e = {});
      var t = e.manifest || null,
        n = e.charity || null,
        i = e.link || null,
        o = e.action || "",
        r = e.rqdata || null,
        a = M.Browser.width(),
        s = M.Browser.height();
      this._resetTimer(),
        t || ((t = Object.create(null)).st = Date.now()),
        (t.v = 1),
        (t.topLevel = de.getData()),
        (t.session = x.getSession()),
        (t.widgetList = x.getCaptchaIdList()),
        (t.widgetId = this.id),
        (t.href = window.location.href),
        (t.prev = JSON.parse(JSON.stringify(this._state))),
        this._resetState(),
        this.checkbox.setResponse(""),
        this.challenge.setup({
          manifest: t,
          width: a,
          height: s,
          charity: n,
          link: i,
          action: o,
          rqdata: r,
        });
    }),
    (Ie.prototype.displayChallenge = function (e) {
      var t = this;
      this.visible = !0;
      var n = this.checkbox,
        i = this.challenge,
        o = M.Browser.height();
      if (!("ie" === M.Browser.type && 8 === M.Browser.version)) {
        var r = window
          .getComputedStyle(document.body)
          .getPropertyValue("overflow-y");
        (this.overflow.override = "hidden" === r),
          this.overflow.override &&
            ((this.overflow.cssUsed =
              "" === document.body.style.overflow &&
              "" === document.body.style.overflowY),
            this.overflow.cssUsed ||
              (this.overflow.value = "" === r ? "auto" : r),
            (this.overflow.scroll = M.Browser.scrollY()),
            (document.body.style.overflowY = "auto"));
      }
      return new Promise(function (t) {
        n.status(),
          n.getTickLocation().then(function (r) {
            (i.size(e.width, e.height, e.mobile),
            i.show(),
            n.clearLoading(),
            (n.location.bounding = n.getBounding()),
            (n.location.tick = r),
            (n.location.offset = n.getOffset()),
            i.position(n.location)) &&
              ((
                window.document.scrollingElement ||
                document.getElementsByTagName("html")[0]
              ).scrollTop = Math.abs(i.height - o) + i.top);
            t();
          });
      }).then(function () {
        t.onOpen && N(t.onOpen);
      });
    }),
    (Ie.prototype.resize = function (e, t, n) {
      var i = this,
        o = this.checkbox,
        r = this.challenge;
      r.getDimensions(e, t)
        .then(function (e) {
          e && r.size(e.width, e.height, e.mobile),
            (o.location.bounding = o.getBounding()),
            (o.location.offset = o.getOffset()),
            (M.System.mobile && !n) || r.position(o.location);
        })
        ["catch"](function (e) {
          i.closeChallenge.call(i, {
            event: "challenge-error",
            message: "Captcha resize caused error.",
            error: e,
          });
        });
    }),
    (Ie.prototype.position = function () {
      var e = this.checkbox,
        t = this.challenge;
      M.System.mobile ||
        ((e.location.bounding = e.getBounding()), t.position(e.location));
    }),
    (Ie.prototype.reset = function () {
      this.checkbox.reset(),
        this.checkbox.setResponse(""),
        this._resetTimer(),
        this._resetState();
    }),
    (Ie.prototype._resetState = function () {
      for (var e in this._state) this._state[e] = !1;
    }),
    (Ie.prototype.closeChallenge = function (e) {
      this.visible = !1;
      var t = this,
        n = this.checkbox,
        i = this.challenge;
      this.overflow.override &&
        (((
          window.document.scrollingElement ||
          document.getElementsByTagName("html")[0]
        ).scrollTop = this.overflow.scroll),
        (this.overflow.override = !1),
        (this.overflow.scroll = 0),
        (document.body.style.overflowY = this.overflow.cssUsed
          ? null
          : this.overflow.value));
      var o = e.response || "";
      switch ((n.setResponse(o), i.close(), n.$iframe.dom.focus(), e.event)) {
        case "challenge-escaped":
          (this._state.escaped = !0), n.reset(), t.onClose && N(t.onClose);
          break;
        case "challenge-expired":
          (this._state.expiredChallenge = !0),
            n.reset(),
            n.status("hCaptcha window closed due to timeout.", !0),
            t.onChalExpire && N(t.onChalExpire);
          break;
        case "challenge-error":
        case "bundle-error":
        case "network-error":
          n.reset(),
            "network-error" === e.event && n.status(e.message),
            this.onError && N(this.onError, e.message || "");
          break;
        case "challenge-passed":
          (this._state.passed = !0),
            n.tick(),
            this.onPass && N(this.onPass, o),
            "number" == typeof e.expiration &&
              (t._resetTimer(),
              (t._responseTimer = setTimeout(function () {
                try {
                  n.reset(),
                    n.setResponse(""),
                    n.status(
                      "hCaptcha security token has expired. Please complete the challenge again.",
                      !0
                    );
                } catch (mt) {
                  z(
                    "Checkbox not present or could not destroy on expiration: " +
                      mt.message,
                    "error",
                    "global"
                  );
                }
                t.onExpire && N(t.onExpire),
                  (t._responseTimer = null),
                  (t._state.expiredResponse = !0);
              }, 1e3 * e.expiration)));
      }
    }),
    (Ie.prototype.updateTranslation = function (e) {
      var t = this.checkbox,
        n = this.challenge;
      t.sendTranslation(e), n.sendTranslation(e);
    }),
    (Ie.prototype.isReady = function () {
      return this._ready;
    }),
    (Ie.prototype.setReady = function (e) {
      if (((this._ready = e), this._ready))
        for (var t, n = this._listeners.length; --n > -1; )
          (t = this._listeners[n]), this._listeners.splice(n, 1), t();
    }),
    (Ie.prototype.onReady = function (e) {
      var t = Array.prototype.slice.call(arguments, 1),
        n = function () {
          e.apply(null, t);
        };
      this._ready ? n() : this._listeners.push(n);
    }),
    (Ie.prototype.destroy = function () {
      (this._resetTimer(), this.overflow.override) &&
        (((
          window.document.scrollingElement ||
          document.getElementsByTagName("html")[0]
        ).scrollTop = this.overflow.scroll),
        (this.overflow.override = !1),
        (this.overflow.scroll = 0),
        (document.body.style.overflowY = this.overflow.cssUsed
          ? null
          : this.overflow.value));
      this.challenge.destroy(),
        this.checkbox.destroy(),
        (this.challenge = null),
        (this.checkbox = null);
    }),
    V.proto(Be, J),
    (Be.prototype.dimensions = function (e, t) {
      this.css({ width: e, height: t }),
        (this.element.width = Math.round(e / this.scale) * this.dpr),
        (this.element.height = Math.round(t / this.scale) * this.dpr),
        this.ctx.scale(this.dpr, this.dpr),
        (this.width = Math.round(e / this.scale)),
        (this.height = Math.round(t / this.scale));
    }),
    (Be.prototype.clear = function () {
      this.ctx &&
        this.ctx.clearRect(0, 0, this.element.width, this.element.height);
    }),
    (Be.prototype.draw = function () {
      this.ctx &&
        ((this.ctx.fillStyle = this.clearColor),
        this.ctx.fillRect(0, 0, this.element.width, this.element.height));
    }),
    (Be.prototype._destroy = function () {
      this.__destroy(),
        (this.element = null),
        (this.ctx = null),
        (this.width = null),
        (this.height = null);
    }),
    (Te.prototype.rotate = function (e, t) {
      var n = (function (e) {
          return e * (Math.PI / 180);
        })(t),
        i = Math.sin(n),
        o = Math.cos(n),
        r = this.x - e.x,
        a = this.y - e.y;
      (this.x = r * o - a * i + e.x), (this.y = r * i + a * o + e.y);
    }),
    (Te.prototype.getDistance = function (e) {
      return Math.sqrt(Math.pow(this.x - e.x, 2) + Math.pow(this.y - e.y, 2));
    }),
    (Te.prototype.getAngle = function (e) {
      var t = e.x - this.x,
        n = e.y - this.y,
        i = (180 * Math.atan2(n, t)) / Math.PI;
      return i < 0 && (i += 360), i;
    }),
    (Te.prototype.hitTest = function (e) {
      return this.radius + this.tolerance >= this.getDistance(e);
    }),
    (Te.prototype.restrict = function (e, t, n, i) {
      if ("x" !== e && "y" !== e)
        throw new Error("Point.restrict requires a value: x or y");
      return (
        t + this[e] < n
          ? (t = this[e] - n)
          : t + this[e] > i && (t = i - this[e]),
        this[e] + t
      );
    }),
    (Te.prototype.draw = function (e) {
      e.ctx.beginPath(),
        e.ctx.arc(this.x, this.y, this.radius / e.scale, 0, 2 * Math.PI, !1),
        this.fill && ((e.ctx.fillStyle = this.fillColor), e.ctx.fill()),
        this.stroke &&
          ((e.ctx.strokeStyle = this.strokeColor),
          (e.ctx.lineWidth = this.strokeWidth / e.scale),
          e.ctx.stroke());
    }),
    V.proto(Me, Te),
    (Me.prototype.set = function (e, t, n) {
      (this.x = e.x || this.x),
        (this.y = e.y || this.y),
        t === undefined
          ? ((this.handleIn.x = this.x), (this.handleIn.y = this.y))
          : ((this.handleIn.x = t.x), (this.handleIn.y = t.y)),
        n === undefined
          ? ((this.handleOut.x = this.x), (this.handleOut.y = this.y))
          : ((this.handleOut.x = n.x), (this.handleOut.y = n.y));
    }),
    (Me.prototype.clone = function () {
      var e = { x: this.x, y: this.y },
        t = { x: this.handleIn.x, y: this.handleIn.y },
        n = { x: this.handleOut.x, y: this.handleOut.y },
        i = new Me();
      return (
        t.x === n.x && t.y === n.y ? i.set(e) : i.set(e, t, n),
        (i.index = this.index),
        (i.prev = this.prev),
        (i.next = this.next),
        (i.radius = this.radius),
        (i.tolerance = this.tolerance),
        (i.fill = this.fill),
        (i.stroke = this.stroke),
        (i.fillColor = this.fillColor),
        (i.strokeColor = this.strokeColor),
        (i.strokeWidth = this.strokeWidth),
        i
      );
    }),
    (Me.prototype.move = function (e, t) {
      (this.x += e),
        (this.y += t),
        (this.handleIn.x += e),
        (this.handleIn.y += t),
        (this.handleOut.x += e),
        (this.handleOut.y += t);
    }),
    (Me.prototype.render = function (e) {
      this.handleIn.x !== this.x &&
        this.handleIn.y !== this.y &&
        this.handleIn.draw(e),
        this.handleOut.x !== this.x &&
          this.handleOut.y !== this.y &&
          this.handleOut.draw(e),
        this.draw(e);
    });
  var Ae = {
    getType: function (e) {
      return e.toLowerCase().match(/\.(?:jpg|gif|png|jpeg|svg)$/g)
        ? "image"
        : e.toLowerCase().match(/\.(?:js)$/g)
        ? "script"
        : "file";
    },
    getLocation: function (e) {
      if ($.assethost && e.indexOf(A.assetDomain) >= 0)
        return $.assethost + e.replace(A.assetDomain, "");
      if ($.imghost && e.indexOf("imgs") >= 0) {
        var t =
          e.indexOf(".ai") >= 0 ? e.indexOf(".ai") + 3 : e.indexOf(".com") + 4;
        return $.imghost + e.substr(t, e.length);
      }
      return e;
    },
  };
  function $e(e, t) {
    var n = e,
      i = n.substr(n.lastIndexOf(".") + 1, n.length);
    t || (t = {}),
      t.fallback &&
        "svg" === i &&
        "ie" === M.Browser.type &&
        M.Browser.version <= 11 &&
        (n = e.substr(0, e.indexOf(i)) + t.fallback),
      t.prefix && (n = t.prefix + "/" + e),
      (this.attribs = { crossOrigin: t.crossOrigin || null }),
      (this.id = n),
      (this.src = Ae.getLocation(n)),
      (this.ext = i),
      (this.width = 0),
      (this.height = 0),
      (this.aspect = 0),
      (this.loaded = !1),
      (this.error = !1),
      (this.element = null),
      (this.cb = { load: [], error: [] });
  }
  function Le(e, t, n) {
    for (var i = e[t], o = i.length, r = null; --o > -1; )
      (r = i[o]), i.splice(o, 1), r(n);
    "error" === t ? (e.load = []) : (e.error = []);
  }
  function je(e, t) {
    var n = e;
    t || (t = {}),
      t.prefix && (n = t.prefix + "/" + e),
      (this.attribs = {
        defer: t.defer || null,
        async: t.async || null,
        crossOrigin: t.crossOrigin || null,
      }),
      (this.id = n),
      (this.src = Ae.getLocation(n)),
      (this.loaded = !1),
      (this.error = !1),
      (this.element = null),
      (this.cb = { load: [], error: [] });
  }
  function De(e, t, n) {
    for (var i = e[t], o = i.length, r = null; --o > -1; )
      (r = i[o]), i.splice(o, 1), r(n);
    "error" === t ? (e.load = []) : (e.error = []);
  }
  function Re(e) {
    if (null === e) return "";
    var t = [];
    return (
      (function n(e, t) {
        var i, o;
        if ("object" == typeof e)
          for (o in e)
            !0 === ze((i = e[o])) ? n(i, t) : (t[t.length] = We(o, i));
        else if (!0 === Array.isArray(e))
          for (var r = 0; r < e.length; r++)
            !0 === ze((i = e[r])) ? n(e, t) : (t[t.length] = We(o, i));
        else t[t.length] = We(e);
      })(e, t),
      t.join("&")
    );
  }
  function ze(e) {
    return !0 === Array.isArray(e) || "object" == typeof e;
  }
  function We(e, t) {
    return (
      encodeURIComponent(e) + "=" + encodeURIComponent(null === t ? "" : t)
    );
  }
  ($e.prototype.load = function () {
    var e = this,
      t = this.attribs,
      n = this.src,
      i = this.id;
    return new Promise(function (o, r) {
      var a = new Image();
      (e.element = a),
        t.crossOrigin && (a.crossOrigin = t.crossOrigin),
        (a.onerror = function (t) {
          (e.error = !0), (a.onload = a.onerror = null);
          var n = (t && t.message ? t.message : "Loading Error") + ": " + i;
          Le(e.cb, "error", n), r(n);
        }),
        (a.onload = function () {
          e.loaded ||
            ((e.width = a.width),
            (e.height = a.height),
            (e.aspect = a.width / a.height),
            (e.loaded = !0),
            (a.onload = a.onerror = null),
            Le(e.cb, "load", e),
            o(e));
        }),
        (a.src = n),
        a.complete && a.onload();
    });
  }),
    ($e.prototype.onload = function (e) {
      this.error || (this.loaded ? e(this) : this.cb.load.push(e));
    }),
    ($e.prototype.onerror = function (e) {
      (this.loaded && !this.error) ||
        (this.error ? e(this) : this.cb.error.push(e));
    }),
    (je.prototype.load = function () {
      var e = this,
        t = this.attribs,
        n = this.src,
        i = this.id;
      return new Promise(function (o, r) {
        var a = document.createElement("script");
        (e.element = a),
          (a.onerror = function (t) {
            (e.error = !0),
              (a.onload = a.onreadystatechange = a.onerror = null);
            var n = (t.message || "Loading Error") + ": " + i;
            De(e.cb, "error", n), r(n);
          }),
          (a.onload = a.onreadystatechange =
            function () {
              this.loaded ||
                (a.readyState &&
                  "loaded" !== a.readyState &&
                  "complete" !== a.readyState) ||
                ((e.loaded = !0),
                (a.onload = a.onreadystatechange = a.onerror = null),
                document.body.removeChild(a),
                De(e.cb, "load", e),
                o(e));
            }),
          (a.type = "text/javascript"),
          (a.src = n),
          t.crossOrigin && (a.crossorigin = t.crossOrigin),
          t.async && (a.async = !0),
          t.defer && (a.defer = !0),
          document.body.appendChild(a),
          a.complete && a.onload();
      });
    }),
    (je.prototype.onload = function (e) {
      this.error || (this.loaded ? e(this) : this.cb.load.push(e));
    }),
    (je.prototype.onerror = function (e) {
      (this.loaded && !this.error) ||
        (this.error ? e(this) : this.cb.error.push(e));
    });
  var Ne = {
      400: "Rate limited or network error. Please retry.",
      429: "Your computer or network has sent too many requests.",
      500: "Cannot contact hCaptcha. Check your connection and try again.",
    },
    Ue = {
      getText: function (e) {
        try {
          return ee.translate(Ne[e]);
        } catch (mt) {
          return !1;
        }
      },
    },
    Fe =
      "undefined" != typeof XDomainRequest &&
      "withCredentials" in XMLHttpRequest.prototype == !1;
  function qe(e, t, n) {
    n = n || {};
    var i = {
      url: t,
      method: e.toUpperCase(),
      responseType: n.responseType || "string",
      dataType: n.dataType || null,
      withCredentials: n.withCredentials || !1,
      headers: n.headers || null,
      data: n.data || null,
    };
    return (
      (i.legacy = i.withCredentials && Fe),
      i.data &&
        ("json" === i.dataType &&
          "object" == typeof i.data &&
          (i.data = JSON.stringify(i.data)),
        "query" === i.dataType && (i.data = Re(i.data))),
      n.retry
        ? U(function () {
            return He(i);
          }, n.retry)
        : He(i)
    );
  }
  function He(e) {
    var t = e.legacy ? new XDomainRequest() : new XMLHttpRequest();
    return new Promise(function (n, i) {
      var o,
        r = function (o) {
          return function (r) {
            var a = t.response || t.responseText,
              s = t.statusText || "",
              h = t.status,
              c = t.readyState;
            if (4 === c || e.legacy) {
              if ("error" === o || (h >= 400 && h <= 511))
                return void i({
                  event: "network-error",
                  endpoint: e.url,
                  state: c,
                  status: h,
                  message: Ue.getText(h || 400) || s,
                });
              "json" === e.responseType && a && (a = JSON.parse(a)),
                n({ state: c, status: h, body: a, message: s });
            }
          };
        };
      if (
        ((t.onload = r("complete")),
        (t.onerror = t.ontimeout = r("error")),
        t.open(e.method, e.url),
        !e.legacy) &&
        ((t.withCredentials = e.withCredentials), e.headers)
      )
        for (var a in e.headers) (o = e.headers[a]), t.setRequestHeader(a, o);
      setTimeout(function () {
        t.send(e.data);
      }, 0);
    });
  }
  var Xe = function (e, t) {
    if (
      ("object" == typeof e && t === undefined && (e = (t = e).url), null === e)
    )
      throw new Error("Url missing");
    return qe("GET", e, t);
  };
  function Ye(e, t) {
    var n = e;
    t || (t = {}),
      t.prefix && (n = t.prefix + "/" + e),
      (this.id = n),
      (this.src = Ae.getLocation(n)),
      (this.loaded = !1),
      (this.error = !1),
      (this.cb = { load: [], error: [] }),
      (this.data = null);
  }
  function Je(e, t, n) {
    for (var i = e[t], o = i.length, r = null; --o > -1; )
      (r = i[o]), i.splice(o, 1), r(n);
    "error" === t ? (e.load = []) : (e.error = []);
  }
  (Ye.prototype.load = function () {
    var e = this,
      t = this.src,
      n = this.id;
    return new Promise(function (i, o) {
      var r = {};
      t.indexOf("json") >= 0 && (r.responseType = "json"),
        Xe(t, r)
          .then(function (t) {
            (e.loaded = !0), (e.data = t.body), Je(e.cb, "load", e), i(e);
          })
          ["catch"](function (t) {
            e.error = !0;
            var i = (t && t.message ? t.message : "Loading Error") + ": " + n;
            Je(e.cb, "error", i), o(i);
          });
    });
  }),
    (Ye.prototype.onload = function (e) {
      this.error || (this.loaded ? e(this) : this.cb.load.push(e));
    }),
    (Ye.prototype.onerror = function (e) {
      (this.loaded && !this.error) ||
        (this.error ? e(this) : this.cb.error.push(e));
    });
  var Ve = [],
    Qe = {
      add: function (e, t) {
        var n = Ae.getType(e);
        return Qe[n] ? Qe[n](e, t) : Promise.resolve(null);
      },
      batch: function (e, t) {
        for (var n = [], i = -1; ++i < e.length; ) {
          var o = e[i];
          n.push(Qe.add(o, t));
        }
        return Promise.all(n)["finally"](function () {
          n = [];
        });
      },
      image: function (e, t) {
        var n = new $e(e, t);
        return Ve.push(n), n.load();
      },
      script: function (e, t) {
        var n = new je(e, t);
        return Ve.push(n), n.load();
      },
      file: function (e, t) {
        var n = new Ye(e, t);
        return Ve.push(n), n.load();
      },
      retrieve: function (e) {
        return new Promise(function (t, n) {
          for (var i = Ve.length, o = !1, r = null; --i > -1 && !o; )
            o = (r = Ve[i]).id.indexOf(e) >= 0 && r;
          if (!o) return t(null);
          r.onload(t), r.onerror(n);
        });
      },
    };
  function Ke(e) {
    if ("en" === e) return Promise.resolve();
    var t = e + ".json";
    return new Promise(function (n, i) {
      Qe.retrieve(t)
        .then(function (n) {
          return (
            n ||
            Qe.file(t, {
              prefix:
                "https://assets.hcaptcha.com/captcha/v1/523a6ff/static/i18n",
            }).then(function (t) {
              return ee.addTable(e, t.data), t;
            })
          );
        })
        .then(function (e) {
          n(e.data);
        })
        ["catch"](function (e) {
          i(e);
        });
    });
  }
  var Ge = 0,
    Ze = [
      "tplinks",
      "sitekey",
      "theme",
      "size",
      "tabindex",
      "challenge-container",
    ],
    et =
      "Your browser is missing or has disabled Cross-Window Messaging. Please <a style='color:inherit;text-decoration:underline; font: inherit' target='_blank' href='https://www.whatismybrowser.com/guides/how-to-update-your-browser/auto'>upgrade your browser</a> or enable it for hCaptcha.com",
    tt =
      "Your browser plugins or privacy policies are blocking the hCaptcha service. Please disable them for hCaptcha.com";
  var nt = {
    render: function (e, t) {
      if (
        ("string" == typeof e && (e = document.getElementById(e)),
        e && 1 === e.nodeType)
      )
        if (
          (function (e) {
            if (!(e && "challenge-container" in e)) return !0;
            var t = e["challenge-container"];
            return (
              "string" == typeof t && (t = document.getElementById(t)),
              !!t && 1 === t.nodeType
            );
          })(t)
        ) {
          if (!1 !== xe.isSupported()) {
            for (
              var n, i, o = e.getElementsByTagName("iframe"), r = -1;
              ++r < o.length && !n;

            )
              (i = o[r].getAttribute("data-hcaptcha-widget-id")) && (n = !0);
            if (n)
              return (
                console.error(
                  "Only one captcha is permitted per parent container."
                ),
                i
              );
            var a = (function (e, t) {
                for (
                  var n = [
                      "tplinks",
                      "sitekey",
                      "theme",
                      "type",
                      "size",
                      "tabindex",
                      "callback",
                      "expired-callback",
                      "chalexpired-callback",
                      "error-callback",
                      "open-callback",
                      "close-callback",
                      "endpoint",
                      "challenge-container",
                    ],
                    i = {},
                    o = 0;
                  o < n.length;
                  o++
                ) {
                  var r = n[o],
                    a = t && t[r];
                  a || (a = e.getAttribute("data-" + r)), a && (i[r] = a);
                }
                return i;
              })(e, t),
              s = Ge++ + Math.random().toString(36).substr(2),
              h = {
                sentry: D,
                reportapi: $.reportapi,
                recaptchacompat: $.recaptchacompat,
              };
            $.endpointOverride && (h.endpoint = $.endpointOverride),
              null !== $.language && (h.hl = ee.getLocale()),
              $.assethost && (h.assethost = $.assethost),
              $.imghost && (h.imghost = $.imghost),
              $.tplinks && (h.tplinks = $.tplinks);
            for (var c = 0; c < Ze.length; c++) {
              var l = Ze[c];
              l in a && (h[l] = a[l]);
            }
            if (
              e instanceof HTMLButtonElement ||
              e instanceof HTMLInputElement
            ) {
              var d = new J("div", ".h-captcha");
              d.css({ display: "none" });
              for (var u = null, p = 0; p < e.attributes.length; p++)
                (u = e.attributes[p]).name.startsWith("data-") &&
                  d.setAttribute(u.name, u.value);
              var f =
                e.tagName.toLowerCase() +
                "[data-hcaptcha-widget-id='" +
                s +
                "']";
              e.setAttribute("data-hcaptcha-widget-id", s),
                d.setAttribute("data-hcaptcha-source-id", f),
                e.parentNode.insertBefore(d.dom, e),
                (e.onclick = function (e) {
                  return e.preventDefault(), ve(s);
                }),
                (e = d),
                (h.size = "invisible");
            }
            try {
              var m = new Ie(e, s, h);
              m.challenge.style(), m.checkbox.style();
            } catch (ft) {
              var g = tt;
              return (
                ft instanceof Pe &&
                  ((g = ft.message), console.error(ft.reason)),
                void j(e, g)
              );
            }
            return (
              a.callback && (m.onPass = a.callback),
              a["expired-callback"] && (m.onExpire = a["expired-callback"]),
              a["chalexpired-callback"] &&
                (m.onChalExpire = a["chalexpired-callback"]),
              a["open-callback"] && (m.onOpen = a["open-callback"]),
              a["close-callback"] && (m.onClose = a["close-callback"]),
              a["error-callback"] && (m.onError = a["error-callback"]),
              de.setData("inv", "invisible" === h.size),
              m.checkbox.chat.listen("checkbox-selected", function (e) {
                de.setData("exec", !1), m.onReady(m.initChallenge, e);
              }),
              m.checkbox.chat.listen("checkbox-loaded", function (e) {
                (m.checkbox.location.bounding = m.checkbox.getBounding()),
                  (m.checkbox.location.tick = e),
                  (m.checkbox.location.offset = m.checkbox.getOffset());
                var t = ee.getLocale();
                m.checkbox.sendTranslation(t);
              }),
              m.checkbox.chat.listen("checkbox-setup", function (e) {
                m.challenge.onReady(function () {
                  !$.endpointOverride &&
                    e.endpoint &&
                    m.challenge.setEndpoint(e.endpoint),
                    e.c
                      ? m.challenge.sendProof(e.c).then(function () {
                          m.setReady(!0);
                        })
                      : m.setReady(!0);
                });
              }),
              m.challenge.chat.listen("challenge-loaded", function () {
                m.challenge.setReady(!0);
                var e = ee.getLocale();
                m.challenge.sendTranslation(e);
              }),
              m.challenge.chat.answer("challenge-ready", function (e, t) {
                m.displayChallenge(e).then(t.resolve);
              }),
              m.challenge.chat.listen("challenge-resize", function () {
                var e = M.Browser.width(),
                  t = M.Browser.height();
                m.resize(e, t);
              }),
              m.challenge.chat.listen("challenge-closed", m.closeChallenge),
              m.challenge.chat.answer("get-url", function (e) {
                e.resolve(window.location.href);
              }),
              m.challenge.chat.answer("check-api", function (e) {
                e.resolve(de.getData());
              }),
              m.challenge.chat.listen("challenge-key", function (e) {
                x.pushSession(e.key, m.id);
              }),
              m.challenge.onOverlayClick(function () {
                m.closeChallenge({ event: "challenge-escaped" });
              }),
              m.challenge.chat.listen("challenge-language", function (e) {
                var t = e.locale;
                ee.setLocale(t),
                  Ke(t)
                    .then(function (e) {
                      x.each(function (e) {
                        if (e)
                          try {
                            e.updateTranslation(t);
                          } catch (ft) {
                            z(
                              "Failed to update text translation: " +
                                JSON.stringify(ft),
                              "error",
                              "translation"
                            );
                          }
                      });
                    })
                    ["catch"](function (e) {
                      z("Language failed to load: " + t, "error", "api");
                    });
              }),
              m.challenge.chat.answer("get-ac", function (e) {
                e.resolve(Ce.hasCookie("hc_accessibility"));
              }),
              x.add(m),
              s
            );
          }
          j(e, et);
        } else
          console.log(
            "[hCaptcha] render: invalid challenge container '" +
              t["challenge-container"] +
              "'."
          );
      else console.log("[hCaptcha] render: invalid container '" + e + "'.");
    },
    reset: function (e) {
      var t;
      if (e) {
        if (!(t = x.getById(e)))
          throw Error("[hCaptcha] invalid captcha id: " + e);
        t.reset();
      } else {
        if (!(t = x.getByIndex(0)))
          throw Error("[hCaptcha] no captchas exist.");
        t.reset();
      }
    },
    remove: function (e) {
      var t = e ? x.getById(e) : x.getByIndex(0);
      if (!t)
        throw e
          ? Error("[hCaptcha] invalid captcha id: " + e)
          : Error("[hCaptcha] no captchas exist.");
      x.remove(t), t.destroy(), (t = null);
    },
    execute: ve,
    getResponse: function (e) {
      var t, n;
      if (
        ((n = e ? x.getById(e) : x.getByIndex(0)) &&
          (t = n.checkbox.response || ""),
        void 0 !== t)
      )
        return t;
      throw e
        ? new Error("[hCaptcha] invalid captcha id: " + e)
        : new Error("[hCaptcha] no captchas exist.");
    },
    getRespKey: function (e) {
      var t = "",
        n = null;
      n = e ? x.getById(e) : x.getByIndex(0);
      try {
        for (var i = x.getSession(), o = i.length, r = !1; --o > -1 && !r; )
          (r = i[o][1] === n.id) && (t = i[o][0]);
      } catch (a) {
        t = "";
      }
      return t;
    },
    close: function (e) {
      var t = !1;
      if (!(t = e ? x.getById(e) : x.getByIndex(0)))
        throw e
          ? Error("[hCaptcha] invalid captcha id: " + e)
          : Error("[hCaptcha] no captchas exist.");
      t.closeChallenge({ event: "challenge-escaped" });
    },
    setData: function (e, t) {
      if (
        ("object" != typeof e || t || ((t = e), (e = null)),
        !t || "object" != typeof t)
      )
        throw Error("[hCaptcha] invalid data supplied");
      var n = !1;
      if (!(n = e ? x.getById(e) : x.getByIndex(0)))
        throw e
          ? Error("[hCaptcha] invalid captcha id: " + e)
          : Error("[hCaptcha] no captchas exist.");
      var i = n.challenge.setData.bind(n.challenge);
      n.onReady(i, t);
    },
    nodes: x,
  };
  A.file = "hcaptcha";
  var it = document.currentScript,
    ot = !1,
    rt = !1,
    at = "on",
    st = M.Browser.width() / M.Browser.height(),
    ht = window.hcaptcha || !1;
  function ct() {
    var e = M.Browser.width(),
      t = M.Browser.height(),
      n = M.System.mobile && st !== e / t;
    (st = e / t),
      ut(),
      nt.nodes.each(function (i) {
        i.visible && i.resize(e, t, n);
      });
  }
  function lt(e) {
    e.preventDefault && e.preventDefault(),
      dt(),
      nt.nodes.each(function (e) {
        e.visible && e.position();
      });
  }
  function dt() {
    de.circBuffPush("xy", [
      M.Browser.scrollX(),
      M.Browser.scrollY(),
      document.documentElement.clientWidth / window.innerWidth,
      Date.now(),
    ]);
  }
  function ut() {
    de.circBuffPush("wn", [
      M.Browser.width(),
      M.Browser.height(),
      M.System.dpr(),
      Date.now(),
    ]);
  }
  !(function (e) {
    var t = Array.prototype.slice.call(arguments, 1);
    !0 !== fe &&
    "interactive" !== document.readyState &&
    "loaded" !== document.readyState &&
    "complete" !== document.readyState
      ? (ue.push({ fn: e, args: t }),
        !1 === pe &&
          (document.addEventListener
            ? (document.addEventListener("DOMContentLoaded", ge),
              window.addEventListener("load", ge))
            : (document.attachEvent("onreadystatechange", me),
              window.attachEvent("onload", ge)),
          (pe = !0)))
      : setTimeout(function () {
          e(t);
        }, 1);
  })(function () {
    ht ||
      (!(function () {
        var e;
        e = it ? [it] : document.getElementsByTagName("script");
        var t = -1,
          n = !1,
          i = null,
          o = null;
        for (; ++t < e.length && !1 === n; )
          e[t] &&
            e[t].src &&
            ((i = e[t].src.split("?")),
            (o = i[0]),
            /\/(hcaptcha|1\/api)\.js$/.test(o) && (n = e[t]));
        if (!1 === n) return;
        var r = ke(i[1]);
        (ot = r.onload || !1),
          (rt = r.render || !1),
          "off" === r.tplinks && (at = "off");
        ($.tplinks = at),
          ($.language = r.hl || null),
          r.endpoint && ($.endpointOverride = r.endpoint);
        ($.reportapi = r.reportapi || $.reportapi),
          ($.assethost = r.assethost || null),
          ($.imghost = r.imghost || null),
          ($.recaptchacompat = r.recaptchacompat || $.recaptchacompat),
          (A.host = r.host || window.location.hostname),
          $.language
            ? ee.setLocale($.language)
            : ee.setLocale(
                window.navigator.userLanguage || window.navigator.language
              );
        (a = r.sentry === undefined || r.sentry),
          (D = a),
          "off" === $.recaptchacompat
            ? console.log("recaptchacompat disabled")
            : (window.grecaptcha = pt);
        var a;
      })(),
      (function () {
        var e = ee.getLocale();
        if (e.indexOf("en") >= 0) return;
        Ke(e)
          .then(function (t) {
            nt.nodes.each(function (t) {
              if (t)
                try {
                  t.updateTranslation(e);
                } catch (ft) {
                  z(
                    "Failed to update text translation: " + JSON.stringify(ft),
                    "error",
                    "translation"
                  );
                }
            });
          })
          ["catch"](function (t) {
            z("Language failed to load: " + e, "error", "api");
          });
      })(),
      !1 === rt || "onload" === rt
        ? (function (e) {
            for (
              var t = document.getElementsByClassName("h-captcha"),
                n = [],
                i = 0;
              i < t.length;
              i++
            )
              n.push(t[i]);
            var o = [];
            if ("off" !== $.recaptchacompat)
              for (
                var r = document.getElementsByClassName("g-recaptcha"), a = 0;
                a < r.length;
                a++
              )
                o.push(r[a]);
            for (var s = [].concat(n, o), h = 0; h < s.length; h++) e(s[h]);
          })(nt.render)
        : "explicit" !== rt &&
          console.log(
            "hcaptcha: invalid render parameter '" +
              rt +
              "', using 'explicit' instead."
          ),
      ot &&
        setTimeout(function () {
          N(ot);
        }, 1),
      (function () {
        try {
          de.record(),
            de.setData("sc", M.Browser.getScreenDimensions()),
            de.setData("nv", M.Browser.interrogateNavigator()),
            de.setData("dr", document.referrer),
            ut(),
            dt();
        } catch (ft) {}
      })(),
      ye.addEventListener("resize", ct),
      ye.addEventListener("scroll", lt));
  });
  var pt = {
    render: nt.render,
    remove: nt.remove,
    execute: nt.execute,
    reset: nt.reset,
    close: nt.close,
    setData: nt.setData,
    getResponse: nt.getResponse,
    getRespKey: nt.getRespKey,
  };
  return pt;
})();
