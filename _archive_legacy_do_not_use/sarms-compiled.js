"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
// React hooks from CDN
var _React = React,
  useState = _React.useState,
  useEffect = _React.useEffect,
  useCallback = _React.useCallback,
  useRef = _React.useRef;

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
var COLORS = {
  navy: "#0B1437",
  navyLight: "#112060",
  indigo: "#1B3A8F",
  blue: "#2563EB",
  blueLight: "#3B82F6",
  gold: "#F59E0B",
  goldLight: "#FCD34D",
  emerald: "#10B981",
  rose: "#F43F5E",
  slate: "#64748B",
  slateLight: "#94A3B8",
  surface: "#0F172A",
  surfaceCard: "#1E293B",
  surfaceBorder: "#334155",
  textPrimary: "#F1F5F9",
  textSecondary: "#94A3B8",
  textMuted: "#64748B"
};

// ─── INITIAL STATE (used only before data loads from server) ──────────────────
var INITIAL_STATE = {
  institution: {
    name: "My School",
    address: "",
    principal: "",
    principalComment: "",
    logo: null,
    signature: null
  },
  sessions: ["2024/2025"],
  currentSession: "2024/2025",
  terms: ["First Term", "Second Term", "Third Term"],
  currentTerm: "First Term",
  gradingSystem: [{
    min: 70,
    max: 100,
    grade: "A",
    remark: "Excellent"
  }, {
    min: 60,
    max: 69,
    grade: "B",
    remark: "Very Good"
  }, {
    min: 50,
    max: 59,
    grade: "C",
    remark: "Good"
  }, {
    min: 40,
    max: 49,
    grade: "D",
    remark: "Fair"
  }, {
    min: 0,
    max: 39,
    grade: "F",
    remark: "Fail"
  }],
  classes: [],
  subjects: [],
  // Only the admin account — all others added through the app
  users: [{
    id: "admin_1",
    role: "admin",
    name: "Administrator",
    email: "admin@school.com",
    password: "admin@2024",
    avatar: null
  }],
  scores: [],
  announcements: [],
  auditTrail: [],
  resultPublished: false,
  pinCodes: [],
  assignments: [],
  characterReports: {},
  characterTraits: ["Punctuality", "Neatness", "Attentiveness", "Cooperation", "Honesty", "Respect", "Diligence"],
  payments: [],
  paymentTypes: ["School Fees", "Exam Fees", "Development Levy", "Uniform", "Books", "PTA Levy", "Others"],
  attendance: [],
  // [{id, teacherId, date, timeIn, timeOut, status, classId, note, recordedBy}]
  // API sync flags
  _loaded: false,
  _apiError: null
};

// ─── DB: PHP/MySQL BRIDGE ─────────────────────────────────────────────────────
// All data is read from / written to MySQL via the PHP API files.
// This runs silently in the background on every state change.
var DB = function () {
  // Works on both:
  // - Vite dev server (localhost:5173) with proxy → calls /api/db.php → proxied to XAMPP
  // - XAMPP production (localhost/sarms) → calls /sarms/api/db.php directly
  var BASE = function () {
    var _window$location = window.location,
      origin = _window$location.origin,
      port = _window$location.port;
    // On Vite dev server (port 5173), proxy handles /api/ → XAMPP
    if (port === '5173' || port === '3000') {
      return '/api/db.php';
    }
    // On XAMPP (port 80), detect the subfolder from the URL
    var segments = window.location.pathname.split('/').filter(Boolean);
    var folder = segments.length > 0 ? '/' + segments[0] : '';
    return origin + folder + '/api/db.php';
  }();
  function req(_x) {
    return _req.apply(this, arguments);
  }
  function _req() {
    _req = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(action) {
      var method,
        body,
        url,
        opts,
        res,
        txt,
        _args2 = arguments;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.n) {
          case 0:
            method = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : "GET";
            body = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : null;
            url = "".concat(BASE, "?action=").concat(action);
            opts = {
              method: method,
              headers: {
                "Content-Type": "application/json"
              }
            };
            if (body) opts.body = JSON.stringify(body);
            _context2.n = 1;
            return fetch(url, opts);
          case 1:
            res = _context2.v;
            if (res.ok) {
              _context2.n = 3;
              break;
            }
            _context2.n = 2;
            return res.text();
          case 2:
            txt = _context2.v;
            throw new Error("API ".concat(action, " failed (").concat(res.status, "): ").concat(txt.slice(0, 120)));
          case 3:
            return _context2.a(2, res.json());
        }
      }, _callee2);
    }));
    return _req.apply(this, arguments);
  }
  return {
    // Load ALL app state from MySQL on startup
    loadAll: function loadAll() {
      return req("load_all");
    },
    // Save whichever slices were updated (called automatically by updateState)
    saveSlices: function () {
      var _saveSlices = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(updates, fullState) {
        var jobs;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              jobs = [];
              if (updates.institution) jobs.push(req("save_institution", "POST", {
                data: fullState.institution
              }));
              if (updates.users) jobs.push(req("save_users", "POST", {
                data: fullState.users
              }));
              if (updates.classes) jobs.push(req("save_classes", "POST", {
                data: fullState.classes
              }));
              if (updates.subjects) jobs.push(req("save_subjects", "POST", {
                data: fullState.subjects
              }));
              if (updates.scores) jobs.push(req("save_scores", "POST", {
                data: fullState.scores
              }));
              if (updates.announcements) jobs.push(req("save_announcements", "POST", {
                data: fullState.announcements
              }));
              if (updates.assignments) jobs.push(req("save_assignments", "POST", {
                data: fullState.assignments
              }));
              if (updates.pinCodes) jobs.push(req("save_pins", "POST", {
                data: fullState.pinCodes
              }));
              if (updates.auditTrail) jobs.push(req("save_audit", "POST", {
                data: fullState.auditTrail
              }));
              if (updates.gradingSystem) jobs.push(req("save_grading", "POST", {
                data: fullState.gradingSystem
              }));
              if (updates.characterReports) jobs.push(req("save_character", "POST", {
                data: fullState.characterReports
              }));
              if (updates.payments) jobs.push(req("save_payments", "POST", {
                data: fullState.payments
              }));
              if (updates.paymentTypes) jobs.push(req("save_payment_types", "POST", {
                data: fullState.paymentTypes
              }));
              if (updates.attendance) jobs.push(req("save_attendance", "POST", {
                data: fullState.attendance
              }));
              if (updates.sessions !== undefined || updates.currentSession !== undefined || updates.currentTerm !== undefined || updates.resultPublished !== undefined) {
                jobs.push(req("save_settings", "POST", {
                  data: {
                    sessions: fullState.sessions,
                    currentSession: fullState.currentSession,
                    currentTerm: fullState.currentTerm,
                    resultPublished: fullState.resultPublished
                  }
                }));
              }
              _context.n = 1;
              return Promise.all(jobs);
            case 1:
              return _context.a(2);
          }
        }, _callee);
      }));
      function saveSlices(_x2, _x3) {
        return _saveSlices.apply(this, arguments);
      }
      return saveSlices;
    }()
  };
}();

// ─── UTILITIES ────────────────────────────────────────────────────────────────
function getGrade(total, gradingSystem) {
  var _iterator = _createForOfIteratorHelper(gradingSystem),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var g = _step.value;
      if (total >= g.min && total <= g.max) return g;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return {
    grade: "F",
    remark: "Fail"
  };
}
function computeStudentResults(studentId, scores, gradingSystem) {
  var studentScores = scores.filter(function (s) {
    return s.studentId === studentId;
  });
  return studentScores.map(function (s) {
    var total = (s.ca || 0) + (s.exam || 0);
    var gradeInfo = getGrade(total, gradingSystem);
    return _objectSpread(_objectSpread({}, s), {}, {
      total: total,
      grade: gradeInfo.grade,
      remark: gradeInfo.remark
    });
  });
}
function rankStudents(students, scores, classId, session, term, gradingSystem) {
  var ranked = students.map(function (st) {
    var stScores = scores.filter(function (s) {
      return s.studentId === st.id && s.classId === classId && s.session === session && s.term === term;
    });
    var totalScore = stScores.reduce(function (acc, s) {
      return acc + (s.ca || 0) + (s.exam || 0);
    }, 0);
    var avg = stScores.length > 0 ? (totalScore / stScores.length).toFixed(1) : 0;
    return _objectSpread(_objectSpread({}, st), {}, {
      totalScore: totalScore,
      avg: avg,
      subjectCount: stScores.length
    });
  });
  ranked.sort(function (a, b) {
    return b.totalScore - a.totalScore;
  });

  // handle ties
  var rank = 1;
  for (var i = 0; i < ranked.length; i++) {
    if (i > 0 && ranked[i].totalScore === ranked[i - 1].totalScore) {
      ranked[i].position = ranked[i - 1].position;
    } else {
      ranked[i].position = rank;
    }
    rank++;
  }
  return ranked;
}
function generateId() {
  return Math.random().toString(36).substr(2, 9);
}
function generatePinCode() {
  var chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  var code = "GFA-";
  for (var i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}
function ordinal(n) {
  var s = ["th", "st", "nd", "rd"],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// ─── ICONS ────────────────────────────────────────────────────────────────────
var Icon = function Icon(_ref) {
  var name = _ref.name,
    _ref$size = _ref.size,
    size = _ref$size === void 0 ? 18 : _ref$size,
    _ref$color = _ref.color,
    color = _ref$color === void 0 ? "currentColor" : _ref$color;
  var icons = _defineProperty(_defineProperty(_defineProperty({
    dashboard: /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: color,
      strokeWidth: "2"
    }, /*#__PURE__*/React.createElement("rect", {
      x: "3",
      y: "3",
      width: "7",
      height: "7",
      rx: "1"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "14",
      y: "3",
      width: "7",
      height: "7",
      rx: "1"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "3",
      y: "14",
      width: "7",
      height: "7",
      rx: "1"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "14",
      y: "14",
      width: "7",
      height: "7",
      rx: "1"
    })),
    users: /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: color,
      strokeWidth: "2"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "9",
      cy: "7",
      r: "4"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M23 21v-2a4 4 0 0 0-3-3.87"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M16 3.13a4 4 0 0 1 0 7.75"
    })),
    book: /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: color,
      strokeWidth: "2"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
    })),
    chart: /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: color,
      strokeWidth: "2"
    }, /*#__PURE__*/React.createElement("line", {
      x1: "18",
      y1: "20",
      x2: "18",
      y2: "10"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "20",
      x2: "12",
      y2: "4"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "6",
      y1: "20",
      x2: "6",
      y2: "14"
    })),
    bell: /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: color,
      strokeWidth: "2"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M13.73 21a2 2 0 0 1-3.46 0"
    })),
    settings: /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: color,
      strokeWidth: "2"
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "3"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
    })),
    logout: /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: color,
      strokeWidth: "2"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
    }), /*#__PURE__*/React.createElement("polyline", {
      points: "16 17 21 12 16 7"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "21",
      y1: "12",
      x2: "9",
      y2: "12"
    })),
    plus: /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: color,
      strokeWidth: "2"
    }, /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "5",
      x2: "12",
      y2: "19"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "5",
      y1: "12",
      x2: "19",
      y2: "12"
    })),
    edit: /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: color,
      strokeWidth: "2"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
    })),
    trash: /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: color,
      strokeWidth: "2"
    }, /*#__PURE__*/React.createElement("polyline", {
      points: "3 6 5 6 21 6"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
    })),
    download: /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: color,
      strokeWidth: "2"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
    }), /*#__PURE__*/React.createElement("polyline", {
      points: "7 10 12 15 17 10"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "15",
      x2: "12",
      y2: "3"
    })),
    star: /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: color,
      stroke: color,
      strokeWidth: "1"
    }, /*#__PURE__*/React.createElement("polygon", {
      points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
    })),
    lock: /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: color,
      strokeWidth: "2"
    }, /*#__PURE__*/React.createElement("rect", {
      x: "3",
      y: "11",
      width: "18",
      height: "11",
      rx: "2",
      ry: "2"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M7 11V7a5 5 0 0 1 10 0v4"
    })),
    ai: /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: color,
      strokeWidth: "2"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M12 2a10 10 0 1 0 10 10"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 6v6l4 2"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "19",
      cy: "5",
      r: "3",
      fill: color
    })),
    search: /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: color,
      strokeWidth: "2"
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "11",
      cy: "11",
      r: "8"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "21",
      y1: "21",
      x2: "16.65",
      y2: "16.65"
    })),
    pin: /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: color,
      strokeWidth: "2"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "10",
      r: "3"
    })),
    school: /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: color,
      strokeWidth: "2"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
    }), /*#__PURE__*/React.createElement("polyline", {
      points: "9 22 9 12 15 12 15 22"
    })),
    check: /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: color,
      strokeWidth: "2"
    }, /*#__PURE__*/React.createElement("polyline", {
      points: "20 6 9 17 4 12"
    })),
    upload: /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: color,
      strokeWidth: "2"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
    }), /*#__PURE__*/React.createElement("polyline", {
      points: "17 8 12 3 7 8"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "3",
      x2: "12",
      y2: "15"
    })),
    chevronRight: /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: color,
      strokeWidth: "2"
    }, /*#__PURE__*/React.createElement("polyline", {
      points: "9 18 15 12 9 6"
    })),
    eye: /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: color,
      strokeWidth: "2"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "3"
    })),
    trophy: /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: color,
      strokeWidth: "2"
    }, /*#__PURE__*/React.createElement("polyline", {
      points: "8 21 12 17 16 21"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "17",
      x2: "12",
      y2: "11"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M7 4H17v7a5 5 0 0 1-10 0V4z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M7 4a4 4 0 0 0-4 4v1h4"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M17 4a4 4 0 0 1 4 4v1h-4"
    })),
    audit: /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: color,
      strokeWidth: "2"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
    }), /*#__PURE__*/React.createElement("polyline", {
      points: "14 2 14 8 20 8"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "16",
      y1: "13",
      x2: "8",
      y2: "13"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "16",
      y1: "17",
      x2: "8",
      y2: "17"
    }), /*#__PURE__*/React.createElement("polyline", {
      points: "10 9 9 9 8 9"
    })),
    promote: /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: color,
      strokeWidth: "2"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M18 15l-6-6-6 6"
    })),
    money: /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: color,
      strokeWidth: "2"
    }, /*#__PURE__*/React.createElement("rect", {
      x: "2",
      y: "6",
      width: "20",
      height: "12",
      rx: "2"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "3"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M6 12h.01M18 12h.01"
    }))
  }, "check", /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: "2"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 11l3 3L22 4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"
  }))), "menu", /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: "2"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "12",
    x2: "21",
    y2: "12"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "6",
    x2: "21",
    y2: "6"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "18",
    x2: "21",
    y2: "18"
  }))), "close", /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: "2"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18"
  })));
  return icons[name] || null;
};

// ─── STYLES ───────────────────────────────────────────────────────────────────
var injectStyles = function injectStyles() {
  return "\n  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');\n\n  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }\n  \n  :root {\n    --navy: #0B1437;\n    --navy-l: #112060;\n    --indigo: #1B3A8F;\n    --blue: #2563EB;\n    --blue-l: #3B82F6;\n    --gold: #F59E0B;\n    --gold-l: #FCD34D;\n    --emerald: #10B981;\n    --rose: #F43F5E;\n    --surface: #0F172A;\n    --card: #1E293B;\n    --border: #334155;\n    --t1: #F1F5F9;\n    --t2: #94A3B8;\n    --t3: #64748B;\n    --font-display: 'Syne', sans-serif;\n    --font-body: 'DM Sans', sans-serif;\n    --r-sm: 8px;\n    --r-md: 12px;\n    --r-lg: 16px;\n    --r-xl: 24px;\n    --shadow: 0 4px 24px rgba(0,0,0,0.3);\n    --shadow-glow: 0 0 32px rgba(37,99,235,0.2);\n  }\n\n  html, body, #root { height: 100%; background: var(--surface); color: var(--t1); }\n  body { font-family: var(--font-body); font-size: 14px; line-height: 1.6; }\n  \n  ::-webkit-scrollbar { width: 6px; height: 6px; }\n  ::-webkit-scrollbar-track { background: var(--card); }\n  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }\n  ::-webkit-scrollbar-thumb:hover { background: var(--t3); }\n\n  .sarms-app { display: flex; height: 100vh; overflow: hidden; }\n\n  /* SIDEBAR */\n  .sidebar {\n    width: 260px; min-width: 260px;\n    background: linear-gradient(180deg, var(--navy) 0%, var(--surface) 100%);\n    border-right: 1px solid var(--border);\n    display: flex; flex-direction: column;\n    transition: all 0.3s; position: relative; z-index: 10;\n    overflow-y: auto;\n  }\n  .sidebar.collapsed { width: 72px; min-width: 72px; }\n  .sidebar-logo {\n    display: flex; align-items: center; gap: 12px;\n    padding: 24px 20px 20px;\n    border-bottom: 1px solid rgba(255,255,255,0.06);\n  }\n  .sidebar-logo-icon {\n    width: 40px; height: 40px; border-radius: 10px;\n    background: linear-gradient(135deg, var(--blue), var(--indigo));\n    display: flex; align-items: center; justify-content: center;\n    flex-shrink: 0; box-shadow: var(--shadow-glow);\n  }\n  .sidebar-logo-text { font-family: var(--font-display); font-size: 16px; font-weight: 700; line-height: 1.2; }\n  .sidebar-logo-sub { font-size: 11px; color: var(--t3); font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; }\n  .sidebar-section { padding: 16px 12px 8px; }\n  .sidebar-section-label {\n    font-size: 10px; font-weight: 600; letter-spacing: 0.1em;\n    text-transform: uppercase; color: var(--t3); padding: 0 8px 8px;\n  }\n  .nav-item {\n    display: flex; align-items: center; gap: 12px;\n    padding: 10px 12px; border-radius: var(--r-sm);\n    cursor: pointer; transition: all 0.2s;\n    color: var(--t2); font-weight: 500; font-size: 14px;\n    margin-bottom: 2px;\n  }\n  .nav-item:hover { background: rgba(255,255,255,0.06); color: var(--t1); }\n  .nav-item.active {\n    background: linear-gradient(135deg, rgba(37,99,235,0.25), rgba(27,58,143,0.15));\n    color: var(--blue-l);\n    border: 1px solid rgba(37,99,235,0.2);\n    box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);\n  }\n  .nav-item .nav-icon { width: 20px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }\n  .nav-item .nav-badge {\n    margin-left: auto; background: var(--gold); color: #000;\n    font-size: 10px; font-weight: 700; padding: 2px 6px;\n    border-radius: 10px; min-width: 20px; text-align: center;\n  }\n  .sidebar-footer { margin-top: auto; padding: 16px 12px; border-top: 1px solid var(--border); }\n\n  /* MAIN CONTENT */\n  .main-content { flex: 1; display: flex; flex-direction: column; overflow: hidden; }\n  .topbar {\n    height: 64px; display: flex; align-items: center;\n    padding: 0 24px; gap: 16px;\n    background: rgba(15,23,42,0.8); backdrop-filter: blur(12px);\n    border-bottom: 1px solid var(--border);\n    position: sticky; top: 0; z-index: 5;\n  }\n  .topbar-title { font-family: var(--font-display); font-size: 20px; font-weight: 700; flex: 1; }\n  .topbar-badge {\n    background: linear-gradient(135deg, var(--blue), var(--indigo));\n    color: white; font-size: 11px; font-weight: 600;\n    padding: 4px 10px; border-radius: 20px; letter-spacing: 0.03em;\n  }\n  .avatar {\n    width: 36px; height: 36px; border-radius: 50%;\n    background: linear-gradient(135deg, var(--gold), var(--blue));\n    display: flex; align-items: center; justify-content: center;\n    font-family: var(--font-display); font-weight: 700; font-size: 14px;\n    cursor: pointer;\n  }\n  .page-content { flex: 1; overflow-y: auto; padding: 24px; }\n\n  /* CARDS */\n  .card {\n    background: var(--card); border: 1px solid var(--border);\n    border-radius: var(--r-lg); padding: 24px;\n    box-shadow: var(--shadow);\n  }\n  .card-sm { padding: 16px; border-radius: var(--r-md); }\n  .stat-card {\n    background: var(--card); border: 1px solid var(--border);\n    border-radius: var(--r-lg); padding: 20px;\n    position: relative; overflow: hidden;\n    transition: transform 0.2s, box-shadow 0.2s;\n  }\n  .stat-card:hover { transform: translateY(-2px); box-shadow: var(--shadow), var(--shadow-glow); }\n  .stat-card-glow {\n    position: absolute; top: -20px; right: -20px;\n    width: 80px; height: 80px; border-radius: 50%;\n    opacity: 0.15; filter: blur(20px);\n  }\n  .stat-card-icon {\n    width: 44px; height: 44px; border-radius: var(--r-sm);\n    display: flex; align-items: center; justify-content: center;\n    margin-bottom: 16px;\n  }\n  .stat-card-value {\n    font-family: var(--font-display); font-size: 32px; font-weight: 800;\n    line-height: 1; margin-bottom: 4px;\n  }\n  .stat-card-label { font-size: 13px; color: var(--t2); font-weight: 500; }\n\n  /* STATS GRID */\n  .stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }\n\n  /* TABLE */\n  .table-wrapper { overflow-x: auto; }\n  table { width: 100%; border-collapse: collapse; }\n  th {\n    text-align: left; padding: 12px 16px;\n    font-size: 11px; font-weight: 700; letter-spacing: 0.08em;\n    text-transform: uppercase; color: var(--t3);\n    border-bottom: 1px solid var(--border);\n    background: rgba(0,0,0,0.2);\n  }\n  td { padding: 12px 16px; border-bottom: 1px solid rgba(51,65,85,0.5); font-size: 14px; }\n  tr:last-child td { border-bottom: none; }\n  tr:hover td { background: rgba(255,255,255,0.02); }\n\n  /* FORMS */\n  .form-group { margin-bottom: 16px; }\n  .form-label { display: block; font-size: 12px; font-weight: 600; color: var(--t2); margin-bottom: 6px; letter-spacing: 0.04em; text-transform: uppercase; }\n  .form-input {\n    width: 100%; padding: 10px 14px;\n    background: rgba(0,0,0,0.3); border: 1px solid var(--border);\n    border-radius: var(--r-sm); color: var(--t1); font-family: var(--font-body); font-size: 14px;\n    transition: border-color 0.2s, box-shadow 0.2s;\n    outline: none;\n  }\n  .form-input:focus { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(37,99,235,0.15); }\n  .form-input::placeholder { color: var(--t3); }\n  select.form-input { cursor: pointer; }\n  option { background: var(--card); }\n  textarea.form-input { resize: vertical; min-height: 80px; }\n\n  /* BUTTONS */\n  .btn {\n    display: inline-flex; align-items: center; gap: 8px;\n    padding: 10px 18px; border-radius: var(--r-sm);\n    font-family: var(--font-body); font-size: 14px; font-weight: 600;\n    cursor: pointer; border: none; transition: all 0.2s;\n    text-decoration: none; white-space: nowrap;\n  }\n  .btn-primary {\n    background: linear-gradient(135deg, var(--blue), var(--indigo));\n    color: white; box-shadow: 0 4px 12px rgba(37,99,235,0.3);\n  }\n  .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(37,99,235,0.4); }\n  .btn-secondary { background: var(--card); color: var(--t1); border: 1px solid var(--border); }\n  .btn-secondary:hover { background: rgba(255,255,255,0.08); }\n  .btn-danger { background: rgba(244,63,94,0.15); color: var(--rose); border: 1px solid rgba(244,63,94,0.3); }\n  .btn-danger:hover { background: rgba(244,63,94,0.25); }\n  .btn-success { background: rgba(16,185,129,0.15); color: var(--emerald); border: 1px solid rgba(16,185,129,0.3); }\n  .btn-success:hover { background: rgba(16,185,129,0.25); }\n  .btn-gold { background: linear-gradient(135deg, var(--gold), #D97706); color: #000; font-weight: 700; }\n  .btn-sm { padding: 6px 12px; font-size: 12px; }\n  .btn-icon { padding: 8px; }\n  .btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; }\n\n  /* BADGES */\n  .badge {\n    display: inline-flex; align-items: center; gap: 4px;\n    padding: 3px 8px; border-radius: 20px;\n    font-size: 11px; font-weight: 600;\n  }\n  .badge-blue { background: rgba(37,99,235,0.2); color: var(--blue-l); }\n  .badge-green { background: rgba(16,185,129,0.2); color: var(--emerald); }\n  .badge-red { background: rgba(244,63,94,0.2); color: var(--rose); }\n  .badge-gold { background: rgba(245,158,11,0.2); color: var(--gold); }\n  .badge-gray { background: rgba(100,116,139,0.2); color: var(--t2); }\n\n  /* GRADE BADGE */\n  .grade-A { background: rgba(16,185,129,0.2); color: #10B981; font-weight: 700; padding: 2px 8px; border-radius: 4px; }\n  .grade-B { background: rgba(37,99,235,0.2); color: #60A5FA; font-weight: 700; padding: 2px 8px; border-radius: 4px; }\n  .grade-C { background: rgba(245,158,11,0.2); color: #FCD34D; font-weight: 700; padding: 2px 8px; border-radius: 4px; }\n  .grade-D { background: rgba(249,115,22,0.2); color: #FB923C; font-weight: 700; padding: 2px 8px; border-radius: 4px; }\n  .grade-F { background: rgba(244,63,94,0.2); color: #F43F5E; font-weight: 700; padding: 2px 8px; border-radius: 4px; }\n\n  /* MODAL */\n  .modal-overlay {\n    position: fixed; inset: 0; background: rgba(0,0,0,0.7);\n    backdrop-filter: blur(4px); z-index: 100;\n    display: flex; align-items: center; justify-content: center;\n    padding: 16px;\n    animation: fadeIn 0.15s ease;\n  }\n  .modal {\n    background: var(--card); border: 1px solid var(--border);\n    border-radius: var(--r-xl); padding: 28px;\n    width: 100%; max-width: 560px; max-height: 90vh;\n    overflow-y: auto; box-shadow: 0 25px 50px rgba(0,0,0,0.5);\n    animation: slideUp 0.2s ease;\n  }\n  .modal-lg { max-width: 800px; }\n  .modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }\n  .modal-title { font-family: var(--font-display); font-size: 20px; font-weight: 700; }\n  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }\n  @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }\n\n  /* LOGIN PAGE */\n  .login-page {\n    min-height: 100vh; display: flex; align-items: center; justify-content: center;\n    background: radial-gradient(ellipse at 20% 20%, rgba(27,58,143,0.3) 0%, transparent 60%),\n                radial-gradient(ellipse at 80% 80%, rgba(37,99,235,0.2) 0%, transparent 60%),\n                var(--surface);\n    padding: 24px;\n  }\n  .login-card {\n    background: var(--card); border: 1px solid var(--border);\n    border-radius: var(--r-xl); padding: 40px;\n    width: 100%; max-width: 420px;\n    box-shadow: var(--shadow), var(--shadow-glow);\n  }\n  .login-logo {\n    width: 56px; height: 56px; border-radius: 14px;\n    background: linear-gradient(135deg, var(--blue), var(--indigo));\n    display: flex; align-items: center; justify-content: center;\n    margin: 0 auto 20px; box-shadow: var(--shadow-glow);\n  }\n  .login-title { font-family: var(--font-display); font-size: 24px; font-weight: 800; text-align: center; margin-bottom: 4px; }\n  .login-sub { font-size: 13px; color: var(--t2); text-align: center; margin-bottom: 28px; }\n\n  /* PROGRESS BAR */\n  .progress { height: 6px; background: var(--border); border-radius: 3px; overflow: hidden; }\n  .progress-fill { height: 100%; border-radius: 3px; transition: width 0.5s ease; }\n\n  /* AI INSIGHT */\n  .ai-insight {\n    background: linear-gradient(135deg, rgba(37,99,235,0.1), rgba(27,58,143,0.05));\n    border: 1px solid rgba(37,99,235,0.2);\n    border-radius: var(--r-md); padding: 16px;\n    display: flex; gap: 12px; align-items: flex-start;\n  }\n  .ai-insight-icon {\n    width: 32px; height: 32px; border-radius: 8px;\n    background: linear-gradient(135deg, var(--blue), var(--indigo));\n    display: flex; align-items: center; justify-content: center;\n    flex-shrink: 0;\n  }\n\n  /* ANNOUNCEMENT */\n  .announcement-card {\n    background: var(--card); border: 1px solid var(--border);\n    border-radius: var(--r-md); padding: 16px; margin-bottom: 12px;\n    border-left: 3px solid var(--blue);\n    transition: transform 0.2s;\n  }\n  .announcement-card:hover { transform: translateX(4px); }\n  .announcement-card.admin-ann { border-left-color: var(--gold); }\n\n  /* GRID */\n  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }\n  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }\n\n  /* SECTION HEADER */\n  .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }\n  .section-title { font-family: var(--font-display); font-size: 18px; font-weight: 700; }\n  .section-sub { font-size: 13px; color: var(--t2); margin-top: 2px; }\n\n  /* RESULT PDF VIEW */\n  .result-sheet {\n    background: white; color: #1a1a2e; padding: 32px;\n    border-radius: var(--r-md); font-family: 'Georgia', serif;\n    max-width: 700px; margin: 0 auto;\n  }\n  .result-school-header { text-align: center; border-bottom: 2px solid #1B3A8F; padding-bottom: 16px; margin-bottom: 20px; }\n  .result-school-name { font-size: 22px; font-weight: 700; color: #1B3A8F; }\n  .result-school-addr { font-size: 12px; color: #666; margin-top: 4px; }\n  .result-title { font-size: 14px; font-weight: 700; text-align: center; margin: 12px 0; color: #1B3A8F; text-transform: uppercase; letter-spacing: 0.1em; }\n  .result-student-info { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 16px; font-size: 13px; }\n  .result-info-item { display: flex; gap: 8px; }\n  .result-info-label { font-weight: 700; color: #333; min-width: 80px; }\n  .result-table { width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 16px; }\n  .result-table th { background: #1B3A8F; color: white; padding: 8px; text-align: center; font-size: 11px; }\n  .result-table td { padding: 7px 8px; border: 1px solid #ccc; text-align: center; }\n  .result-table tr:nth-child(even) td { background: #f0f4ff; }\n  .result-footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 20px; padding-top: 16px; border-top: 1px solid #ccc; }\n  .result-signature { text-align: center; }\n  .result-sig-line { border-top: 1px solid #333; margin-top: 40px; padding-top: 4px; font-size: 11px; }\n\n  /* TAB */\n  .tabs { display: flex; gap: 4px; padding: 4px; background: rgba(0,0,0,0.3); border-radius: var(--r-sm); margin-bottom: 20px; }\n  .tab {\n    flex: 1; padding: 8px 16px; border-radius: 6px;\n    font-size: 13px; font-weight: 600; cursor: pointer;\n    text-align: center; transition: all 0.2s; color: var(--t2);\n  }\n  .tab.active { background: var(--blue); color: white; }\n  .tab:hover:not(.active) { background: rgba(255,255,255,0.06); color: var(--t1); }\n\n  /* SEARCH BAR */\n  .search-bar {\n    display: flex; align-items: center; gap: 10px;\n    background: rgba(0,0,0,0.3); border: 1px solid var(--border);\n    border-radius: var(--r-sm); padding: 8px 14px;\n  }\n  .search-bar input { background: none; border: none; outline: none; color: var(--t1); font-family: var(--font-body); font-size: 14px; flex: 1; }\n  .search-bar input::placeholder { color: var(--t3); }\n\n  /* RESPONSIVE */\n  @media (max-width: 768px) {\n    .sidebar { position: fixed; left: -260px; top: 0; bottom: 0; }\n    .sidebar.mobile-open { left: 0; box-shadow: 10px 0 40px rgba(0,0,0,0.5); }\n    .stats-grid { grid-template-columns: 1fr 1fr; }\n    .grid-2, .grid-3 { grid-template-columns: 1fr; }\n    .page-content { padding: 16px; }\n    .topbar { padding: 0 16px; }\n  }\n\n  /* BROADSHEET */\n  .broadsheet-table { font-size: 12px; }\n  .broadsheet-table th, .broadsheet-table td { padding: 8px 10px; }\n  .position-badge {\n    display: inline-flex; align-items: center; justify-content: center;\n    width: 28px; height: 28px; border-radius: 50%; font-weight: 700; font-size: 12px;\n  }\n  .pos-1 { background: linear-gradient(135deg, var(--gold), #D97706); color: #000; }\n  .pos-2 { background: linear-gradient(135deg, #94A3B8, #64748B); color: #fff; }\n  .pos-3 { background: linear-gradient(135deg, #B45309, #92400E); color: #fff; }\n  .pos-other { background: var(--border); color: var(--t2); }\n\n  /* SPINNER */\n  .spinner {\n    width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.2);\n    border-top-color: white; border-radius: 50%;\n    animation: spin 0.6s linear infinite;\n  }\n  @keyframes spin { to { transform: rotate(360deg); } }\n\n  /* INPUT RANGE */\n  input[type=range] { accent-color: var(--blue); }\n\n  /* SCORE INPUT */\n  .score-input {\n    width: 70px; padding: 6px 10px;\n    background: rgba(0,0,0,0.3); border: 1px solid var(--border);\n    border-radius: 6px; color: var(--t1); font-size: 14px;\n    text-align: center; outline: none;\n    transition: border-color 0.2s;\n  }\n  .score-input:focus { border-color: var(--blue); }\n\n  /* NOTIFICATION DOT */\n  .notif-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--rose); flex-shrink: 0; }\n\n  /* DIVIDER */\n  .divider { height: 1px; background: var(--border); margin: 20px 0; }\n\n  /* EMPTY STATE */\n  .empty-state { text-align: center; padding: 48px 24px; color: var(--t3); }\n  .empty-state-icon { font-size: 48px; margin-bottom: 12px; }\n  .empty-state-text { font-size: 16px; margin-bottom: 8px; color: var(--t2); font-weight: 500; }\n\n  /* TOOLTIP */\n  .tooltip-wrap { position: relative; display: inline-flex; }\n  .tooltip-wrap:hover .tooltip { opacity: 1; transform: translateY(-4px); }\n  .tooltip {\n    position: absolute; bottom: calc(100% + 6px); left: 50%;\n    transform: translateX(-50%) translateY(0); opacity: 0;\n    background: #1a1a2e; border: 1px solid var(--border);\n    border-radius: 6px; padding: 5px 10px; font-size: 12px;\n    white-space: nowrap; pointer-events: none;\n    transition: all 0.15s; z-index: 20;\n  }\n\n  /* ANALYSIS BAR */\n  .analysis-bar { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }\n  .analysis-bar-label { font-size: 13px; color: var(--t2); min-width: 100px; }\n  .analysis-bar-track { flex: 1; height: 8px; background: var(--border); border-radius: 4px; overflow: hidden; }\n  .analysis-bar-fill { height: 100%; border-radius: 4px; transition: width 1s ease; }\n  .analysis-bar-value { font-size: 13px; font-weight: 600; min-width: 40px; text-align: right; }\n\n  /* ANNOUNCEMENT COMPOSE */\n  .compose-area { background: rgba(0,0,0,0.2); border-radius: var(--r-md); padding: 16px; margin-top: 16px; }\n\n  /* SCORE TABLE SPECIFIC */\n  .score-row td { padding: 8px 12px; }\n\n  /* HIGHLIGHT ROW */\n  .highlight-row td { background: rgba(37,99,235,0.08) !important; }\n\n  /* TERM SELECTOR */\n  .term-selector {\n    display: flex; gap: 8px; flex-wrap: wrap;\n  }\n  .term-chip {\n    padding: 6px 16px; border-radius: 20px; cursor: pointer;\n    font-size: 13px; font-weight: 600; transition: all 0.2s;\n    border: 1px solid var(--border); color: var(--t2);\n  }\n  .term-chip.active { background: var(--blue); color: white; border-color: var(--blue); }\n  .term-chip:hover:not(.active) { border-color: var(--blue-l); color: var(--blue-l); }\n\n  /* PAGE ANIMATIONS */\n  .page-enter { animation: pageEnter 0.25s ease; }\n  @keyframes pageEnter { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: translateX(0); } }\n";
};

// ─── APP COMPONENT ────────────────────────────────────────────────────────────
function SARMS() {
  var _NavItems$flatMap$fin;
  // ── State: starts empty, loads from PHP/MySQL on mount ──────
  var _useState = useState(INITIAL_STATE),
    _useState2 = _slicedToArray(_useState, 2),
    state = _useState2[0],
    setState = _useState2[1];
  var _useState3 = useState(true),
    _useState4 = _slicedToArray(_useState3, 2),
    appLoading = _useState4[0],
    setAppLoading = _useState4[1];
  var _useState5 = useState(null),
    _useState6 = _slicedToArray(_useState5, 2),
    appError = _useState6[0],
    setAppError = _useState6[1];
  var _useState7 = useState(null),
    _useState8 = _slicedToArray(_useState7, 2),
    currentUser = _useState8[0],
    setCurrentUser = _useState8[1];
  var _useState9 = useState("dashboard"),
    _useState0 = _slicedToArray(_useState9, 2),
    activePage = _useState0[0],
    setActivePage = _useState0[1];
  var _useState1 = useState(false),
    _useState10 = _slicedToArray(_useState1, 2),
    sidebarCollapsed = _useState10[0],
    setSidebarCollapsed = _useState10[1];
  var _useState11 = useState(false),
    _useState12 = _slicedToArray(_useState11, 2),
    mobileSidebarOpen = _useState12[0],
    setMobileSidebarOpen = _useState12[1];
  var _useState13 = useState(null),
    _useState14 = _slicedToArray(_useState13, 2),
    modal = _useState14[0],
    setModal = _useState14[1];
  var _useState15 = useState(null),
    _useState16 = _slicedToArray(_useState15, 2),
    notification = _useState16[0],
    setNotification = _useState16[1];
  var styleRef = useRef(null);

  // ── Inject CSS once ──────────────────────────────────────────
  useEffect(function () {
    if (!styleRef.current) {
      var style = document.createElement("style");
      style.textContent = injectStyles();
      document.head.appendChild(style);
      styleRef.current = style;
    }
    return function () {
      if (styleRef.current) {
        document.head.removeChild(styleRef.current);
        styleRef.current = null;
      }
    };
  }, []);

  // ── Load ALL data from PHP/MySQL on startup ──────────────────
  useEffect(function () {
    loadAllData();
  }, []);
  var loadAllData = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
      var data, _t;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.p = _context3.n) {
          case 0:
            setAppLoading(true);
            setAppError(null);
            _context3.p = 1;
            _context3.n = 2;
            return DB.loadAll();
          case 2:
            data = _context3.v;
            setState(function (prev) {
              return _objectSpread(_objectSpread(_objectSpread({}, prev), data), {}, {
                _loaded: true
              });
            });
            _context3.n = 4;
            break;
          case 3:
            _context3.p = 3;
            _t = _context3.v;
            setAppError(_t.message);
          case 4:
            _context3.p = 4;
            setAppLoading(false);
            return _context3.f(4);
          case 5:
            return _context3.a(2);
        }
      }, _callee3, null, [[1, 3, 4, 5]]);
    }));
    return function loadAllData() {
      return _ref2.apply(this, arguments);
    };
  }();

  // ── showNotification must be declared BEFORE any early returns ──
  // React Rules of Hooks: all hooks must be called in the same order every render
  var showNotification = useCallback(function (msg) {
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "success";
    setNotification({
      msg: msg,
      type: type
    });
    setTimeout(function () {
      return setNotification(null);
    }, 3000);
  }, []);

  // ── Show loading screen while fetching from MySQL ────────────
  if (appLoading) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        background: "#0F172A"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 72,
        height: 72,
        borderRadius: 18,
        background: "linear-gradient(135deg,#2563EB,#1B3A8F)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 36,
        boxShadow: "0 0 32px rgba(37,99,235,0.4)"
      }
    }, "\uD83C\uDFEB"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-display,sans-serif)",
        fontSize: 24,
        fontWeight: 800,
        color: "#F1F5F9"
      }
    }, "SARMS"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: "#64748B"
      }
    }, "Connecting to database..."), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 200,
        height: 4,
        background: "#1E293B",
        borderRadius: 2,
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: "100%",
        background: "linear-gradient(90deg,#2563EB,#3B82F6)",
        borderRadius: 2,
        animation: "sarms-load 1.5s ease-in-out infinite"
      }
    })), /*#__PURE__*/React.createElement("style", null, "@keyframes sarms-load{0%{width:0%;margin-left:0%}50%{width:60%;margin-left:20%}100%{width:0%;margin-left:100%}}"));
  }

  // ── Show error if DB connection fails ────────────────────────
  if (appError) {
    // Work out what URL the app is trying to reach
    var tryUrl = function () {
      try {
        var loc = window.location;
        var parts = loc.pathname.split('/');
        var idx = parts.findIndex(function (p) {
          return p === 'sarms';
        });
        if (idx >= 0) {
          return loc.origin + parts.slice(0, idx + 1).join('/') + '/api/db.php?action=ping';
        }
        return loc.origin + '/sarms/api/db.php?action=ping';
      } catch (e) {
        return 'http://localhost/sarms/api/db.php?action=ping';
      }
    }();
    return /*#__PURE__*/React.createElement("div", {
      style: {
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0F172A",
        padding: 24
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: "rgba(244,63,94,0.1)",
        border: "1px solid rgba(244,63,94,0.3)",
        borderRadius: 16,
        padding: "32px 40px",
        maxWidth: 560,
        textAlign: "center"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 40,
        marginBottom: 12
      }
    }, "\u26A0\uFE0F"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 800,
        fontSize: 20,
        color: "#F43F5E",
        marginBottom: 16
      }
    }, "Database Connection Failed"), /*#__PURE__*/React.createElement("div", {
      style: {
        color: "#94A3B8",
        fontSize: 13,
        lineHeight: 1.9,
        marginBottom: 16,
        textAlign: "left"
      }
    }, /*#__PURE__*/React.createElement("strong", {
      style: {
        color: "#F1F5F9"
      }
    }, "Check these one by one:"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", {
      style: {
        color: "#F1F5F9"
      }
    }, "1."), " XAMPP Control Panel \u2192 both ", /*#__PURE__*/React.createElement("strong", null, "Apache"), " and ", /*#__PURE__*/React.createElement("strong", null, "MySQL"), " must be green (Running)", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", {
      style: {
        color: "#F1F5F9"
      }
    }, "2."), " Address bar must show ", /*#__PURE__*/React.createElement("code", {
      style: {
        background: "#1E293B",
        padding: "2px 6px",
        borderRadius: 4,
        color: "#38BDF8"
      }
    }, "http://localhost/sarms"), " \u2014 not a file path like ", /*#__PURE__*/React.createElement("code", {
      style: {
        background: "#1E293B",
        padding: "2px 6px",
        borderRadius: 4,
        color: "#f87171"
      }
    }, "C:\\xampp\\..."), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", {
      style: {
        color: "#F1F5F9"
      }
    }, "3."), " phpMyAdmin \u2192 database ", /*#__PURE__*/React.createElement("code", {
      style: {
        background: "#1E293B",
        padding: "2px 6px",
        borderRadius: 4,
        color: "#38BDF8"
      }
    }, "sarms_db"), " must exist (import the SQL file if not)", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", {
      style: {
        color: "#F1F5F9"
      }
    }, "4."), " The file ", /*#__PURE__*/React.createElement("code", {
      style: {
        background: "#1E293B",
        padding: "2px 6px",
        borderRadius: 4,
        color: "#38BDF8"
      }
    }, "api\\db.php"), " must be inside your sarms folder", /*#__PURE__*/React.createElement("br", null)), /*#__PURE__*/React.createElement("div", {
      style: {
        background: "#1E293B",
        borderRadius: 8,
        padding: "12px 16px",
        marginBottom: 16,
        textAlign: "left"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: "#64748B",
        marginBottom: 6,
        textTransform: "uppercase",
        letterSpacing: "0.06em"
      }
    }, "Test the PHP file directly \u2014 open this in your browser:"), /*#__PURE__*/React.createElement("a", {
      href: tryUrl,
      target: "_blank",
      rel: "noreferrer",
      style: {
        color: "#38BDF8",
        fontSize: 13,
        wordBreak: "break-all"
      }
    }, tryUrl), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: "#64748B",
        marginTop: 6
      }
    }, "You should see: ", /*#__PURE__*/React.createElement("code", {
      style: {
        color: "#6ee7b7"
      }
    }, '{"ok":true,"php":"8.x","db":"sarms_db"}'), /*#__PURE__*/React.createElement("br", null), "If you see a 404 page \u2192 ", /*#__PURE__*/React.createElement("strong", {
      style: {
        color: "#fca5a5"
      }
    }, "db.php is not in the right folder"))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: "#64748B",
        marginBottom: 16
      }
    }, "Error detail: ", appError), /*#__PURE__*/React.createElement("button", {
      onClick: loadAllData,
      style: {
        padding: "10px 28px",
        background: "linear-gradient(135deg,#2563EB,#1B3A8F)",
        color: "white",
        border: "none",
        borderRadius: 8,
        cursor: "pointer",
        fontWeight: 700,
        fontSize: 14
      }
    }, "\uD83D\uDD04 Retry Connection")));
  }
  var login = function login(email, password) {
    var user = state.users.find(function (u) {
      return u.email === email && u.password === password;
    });
    if (user) {
      setCurrentUser(user);
      setActivePage("dashboard");
      showNotification("Welcome back, ".concat(user.name.split(" ")[0], "!"));
      return true;
    }
    return false;
  };
  var logout = function logout() {
    setCurrentUser(null);
    setActivePage("dashboard");
  };

  // updateState: updates React state AND persists the relevant slice to MySQL
  var updateState = function updateState(updates) {
    setState(function (prev) {
      var next = _objectSpread(_objectSpread({}, prev), updates);
      // Fire-and-forget save to DB (errors shown as notifications)
      DB.saveSlices(updates, next)["catch"](function (err) {
        console.warn("DB save error:", err);
        showNotification("Auto-save failed: " + err.message, "error");
      });
      return next;
    });
  };

  // Updates both the users list AND the live currentUser session
  var updateCurrentUser = function updateCurrentUser(updates) {
    var updated = _objectSpread(_objectSpread({}, currentUser), updates);
    setCurrentUser(updated);
    setState(function (prev) {
      var next = _objectSpread(_objectSpread({}, prev), {}, {
        users: prev.users.map(function (u) {
          return u.id === currentUser.id ? updated : u;
        })
      });
      DB.saveSlices({
        users: next.users
      }, next)["catch"](function (err) {
        console.warn("DB save error:", err);
      });
      return next;
    });
  };
  if (!currentUser) {
    return /*#__PURE__*/React.createElement(LoginPage, {
      onLogin: login,
      state: state,
      updateState: updateState
    });
  }
  var NavItems = getNavItems(currentUser.role);
  return /*#__PURE__*/React.createElement("div", {
    className: "sarms-app"
  }, mobileSidebarOpen && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.5)",
      zIndex: 9
    },
    onClick: function onClick() {
      return setMobileSidebarOpen(false);
    }
  }), /*#__PURE__*/React.createElement("aside", {
    className: "sidebar ".concat(sidebarCollapsed ? "collapsed" : "", " ").concat(mobileSidebarOpen ? "mobile-open" : "")
  }, /*#__PURE__*/React.createElement("div", {
    className: "sidebar-logo"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sidebar-logo-icon"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "school",
    color: "white",
    size: 22
  })), !sidebarCollapsed && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "sidebar-logo-text"
  }, state.institution.name.split(" ")[0]), /*#__PURE__*/React.createElement("div", {
    className: "sidebar-logo-sub"
  }, "SARMS v2.0"))), NavItems.map(function (section) {
    return /*#__PURE__*/React.createElement("div", {
      className: "sidebar-section",
      key: section.section
    }, !sidebarCollapsed && /*#__PURE__*/React.createElement("div", {
      className: "sidebar-section-label"
    }, section.section), section.items.map(function (item) {
      return /*#__PURE__*/React.createElement("div", {
        key: item.key,
        className: "nav-item ".concat(activePage === item.key ? "active" : ""),
        onClick: function onClick() {
          setActivePage(item.key);
          setMobileSidebarOpen(false);
        }
      }, /*#__PURE__*/React.createElement("span", {
        className: "nav-icon"
      }, /*#__PURE__*/React.createElement(Icon, {
        name: item.icon,
        size: 18,
        color: activePage === item.key ? COLORS.blueLight : COLORS.slateLight
      })), !sidebarCollapsed && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", null, item.label), item.badge && /*#__PURE__*/React.createElement("span", {
        className: "nav-badge"
      }, item.badge)));
    }));
  }), /*#__PURE__*/React.createElement("div", {
    className: "sidebar-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nav-item",
    onClick: logout,
    style: {
      color: COLORS.rose
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "nav-icon"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "logout",
    size: 18,
    color: COLORS.rose
  })), !sidebarCollapsed && /*#__PURE__*/React.createElement("span", null, "Logout")))), /*#__PURE__*/React.createElement("div", {
    className: "main-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "topbar"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-icon",
    onClick: function onClick() {
      if (window.innerWidth <= 768) {
        setMobileSidebarOpen(!mobileSidebarOpen);
      } else {
        setSidebarCollapsed(!sidebarCollapsed);
      }
    },
    style: {
      marginRight: 4
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "menu",
    size: 16
  })), /*#__PURE__*/React.createElement("div", {
    className: "topbar-title"
  }, ((_NavItems$flatMap$fin = NavItems.flatMap(function (s) {
    return s.items;
  }).find(function (i) {
    return i.key === activePage;
  })) === null || _NavItems$flatMap$fin === void 0 ? void 0 : _NavItems$flatMap$fin.label) || "Dashboard"), /*#__PURE__*/React.createElement("div", {
    className: "topbar-badge"
  }, currentUser.role.toUpperCase()), currentUser.role === "admin" || currentUser.role === "teacher" ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("select", {
    style: {
      background: "rgba(0,0,0,0.3)",
      border: "1px solid var(--border)",
      borderRadius: 6,
      color: "var(--t1)",
      fontSize: 12,
      padding: "4px 8px",
      cursor: "pointer",
      outline: "none",
      fontWeight: 600
    },
    value: state.currentSession,
    onChange: function onChange(e) {
      if (e.target.value === "__add__") {
        setActivePage("institution");
      } else {
        updateState({
          currentSession: e.target.value
        });
      }
    }
  }, state.sessions.map(function (s) {
    return /*#__PURE__*/React.createElement("option", {
      key: s,
      value: s
    }, s);
  }), currentUser.role === "admin" && /*#__PURE__*/React.createElement("option", {
    value: "__add__"
  }, "\uFF0B Add Session\u2026")), /*#__PURE__*/React.createElement("select", {
    style: {
      background: "rgba(0,0,0,0.3)",
      border: "1px solid var(--border)",
      borderRadius: 6,
      color: "var(--t1)",
      fontSize: 12,
      padding: "4px 8px",
      cursor: "pointer",
      outline: "none",
      fontWeight: 600
    },
    value: state.currentTerm,
    onChange: function onChange(e) {
      return updateState({
        currentTerm: e.target.value
      });
    }
  }, state.terms.map(function (t) {
    return /*#__PURE__*/React.createElement("option", {
      key: t
    }, t);
  }))) : /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: COLORS.textSecondary,
      marginLeft: 8
    }
  }, state.currentTerm, " \xB7 ", state.currentSession), /*#__PURE__*/React.createElement("div", {
    className: "avatar",
    onClick: function onClick() {
      return setActivePage("profile");
    },
    title: "My Profile",
    style: {
      cursor: "pointer",
      position: "relative"
    }
  }, currentUser.avatar ? /*#__PURE__*/React.createElement("img", {
    src: currentUser.avatar,
    alt: currentUser.name,
    style: {
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      objectFit: "cover"
    }
  }) : currentUser.name.split(" ").map(function (n) {
    return n[0];
  }).join("").slice(0, 2))), notification && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      top: 80,
      right: 24,
      background: notification.type === "error" ? COLORS.rose : COLORS.emerald,
      color: "white",
      padding: "12px 20px",
      borderRadius: 10,
      fontWeight: 600,
      fontSize: 14,
      zIndex: 200,
      boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
      animation: "slideUp 0.2s ease"
    }
  }, notification.msg), /*#__PURE__*/React.createElement("div", {
    className: "page-content page-enter"
  }, /*#__PURE__*/React.createElement(PageRouter, {
    activePage: activePage,
    state: state,
    updateState: updateState,
    updateCurrentUser: updateCurrentUser,
    currentUser: currentUser,
    modal: modal,
    setModal: setModal,
    showNotification: showNotification
  }))));
}
function getNavItems(role) {
  if (role === "admin") {
    return [{
      section: "Overview",
      items: [{
        key: "dashboard",
        label: "Dashboard",
        icon: "dashboard"
      }, {
        key: "analytics",
        label: "Analytics",
        icon: "chart"
      }, {
        key: "announcements",
        label: "Announcements",
        icon: "bell"
      }]
    }, {
      section: "Management",
      items: [{
        key: "students",
        label: "Students",
        icon: "users"
      }, {
        key: "teachers",
        label: "Teachers",
        icon: "users"
      }, {
        key: "classes",
        label: "Classes & Subjects",
        icon: "book"
      }]
    }, {
      section: "Finance",
      items: [{
        key: "payments",
        label: "Payments",
        icon: "money"
      }]
    }, {
      section: "Results",
      items: [{
        key: "broadsheet",
        label: "Broadsheet",
        icon: "chart"
      }, {
        key: "pinmanager",
        label: "PIN Manager",
        icon: "pin"
      }, {
        key: "audittrail",
        label: "Audit Trail",
        icon: "audit"
      }]
    }, {
      section: "Settings",
      items: [{
        key: "institution",
        label: "Institution",
        icon: "school"
      }, {
        key: "grading",
        label: "Grading System",
        icon: "star"
      }, {
        key: "profile",
        label: "My Profile",
        icon: "settings"
      }]
    }];
  }
  if (role === "teacher") {
    return [{
      section: "Overview",
      items: [{
        key: "dashboard",
        label: "Dashboard",
        icon: "dashboard"
      }, {
        key: "announcements",
        label: "Announcements",
        icon: "bell"
      }, {
        key: "attendance",
        label: "My Attendance",
        icon: "check"
      }]
    }, {
      section: "Scores",
      items: [{
        key: "scoreentry",
        label: "Score Entry",
        icon: "edit"
      }, {
        key: "broadsheet",
        label: "Class Broadsheet",
        icon: "chart"
      }]
    }, {
      section: "Assignments",
      items: [{
        key: "assignments",
        label: "Assignments",
        icon: "book"
      }]
    }];
  }
  if (role === "principal") {
    return [{
      section: "Overview",
      items: [{
        key: "dashboard",
        label: "Dashboard",
        icon: "dashboard"
      }, {
        key: "attendance",
        label: "Staff Attendance",
        icon: "check"
      }, {
        key: "analytics",
        label: "Analytics",
        icon: "chart"
      }, {
        key: "broadsheet",
        label: "Broadsheet",
        icon: "book"
      }, {
        key: "announcements",
        label: "Announcements",
        icon: "bell"
      }]
    }, {
      section: "Administration",
      items: [{
        key: "students",
        label: "Students",
        icon: "users"
      }, {
        key: "teachers",
        label: "Staff",
        icon: "teacher"
      }, {
        key: "audittrail",
        label: "Audit Trail",
        icon: "audit"
      }]
    }, {
      section: "Account",
      items: [{
        key: "profile",
        label: "My Profile",
        icon: "settings"
      }]
    }];
  }
  if (role === "bursar") {
    return [{
      section: "Finance",
      items: [{
        key: "dashboard",
        label: "Dashboard",
        icon: "dashboard"
      }, {
        key: "payments",
        label: "Payments",
        icon: "money"
      }, {
        key: "announcements",
        label: "Announcements",
        icon: "bell"
      }]
    }, {
      section: "Account",
      items: [{
        key: "profile",
        label: "My Profile",
        icon: "settings"
      }]
    }];
  }
  if (role === "student") {
    return [{
      section: "My Portal",
      items: [{
        key: "dashboard",
        label: "Dashboard",
        icon: "dashboard"
      }, {
        key: "announcements",
        label: "Announcements",
        icon: "bell"
      }, {
        key: "assignments",
        label: "Assignments",
        icon: "upload"
      }]
    }];
  }
  if (role === "parent") {
    return [{
      section: "Portal",
      items: [{
        key: "dashboard",
        label: "Dashboard",
        icon: "dashboard"
      }, {
        key: "announcements",
        label: "Announcements",
        icon: "bell"
      }, {
        key: "assignments",
        label: "Assignments",
        icon: "upload"
      }]
    }];
  }
  return [];
}

// ─── PAGE ROUTER ──────────────────────────────────────────────────────────────
function PageRouter(_ref3) {
  var activePage = _ref3.activePage,
    state = _ref3.state,
    updateState = _ref3.updateState,
    updateCurrentUser = _ref3.updateCurrentUser,
    currentUser = _ref3.currentUser,
    modal = _ref3.modal,
    setModal = _ref3.setModal,
    showNotification = _ref3.showNotification;
  var props = {
    state: state,
    updateState: updateState,
    updateCurrentUser: updateCurrentUser,
    currentUser: currentUser,
    modal: modal,
    setModal: setModal,
    showNotification: showNotification
  };
  var isRestricted = ["student", "parent"].includes(currentUser.role);
  var isBursar = currentUser.role === "bursar";
  var isPrincipal = currentUser.role === "principal";
  var pages = {
    dashboard: /*#__PURE__*/React.createElement(DashboardPage, props),
    analytics: isBursar ? /*#__PURE__*/React.createElement(DashboardPage, props) : /*#__PURE__*/React.createElement(AnalyticsPage, props),
    announcements: /*#__PURE__*/React.createElement(AnnouncementsPage, props),
    attendance: /*#__PURE__*/React.createElement(AttendancePage, props),
    students: isBursar ? /*#__PURE__*/React.createElement(DashboardPage, props) : /*#__PURE__*/React.createElement(StudentsPage, props),
    teachers: isBursar ? /*#__PURE__*/React.createElement(DashboardPage, props) : /*#__PURE__*/React.createElement(TeachersPage, props),
    classes: isBursar || isPrincipal ? /*#__PURE__*/React.createElement(DashboardPage, props) : /*#__PURE__*/React.createElement(ClassesPage, props),
    broadsheet: isRestricted || isBursar ? /*#__PURE__*/React.createElement(DashboardPage, props) : /*#__PURE__*/React.createElement(BroadsheetPage, props),
    myresult: isRestricted || isBursar ? /*#__PURE__*/React.createElement(DashboardPage, props) : /*#__PURE__*/React.createElement(MyResultPage, props),
    payments: /*#__PURE__*/React.createElement(PaymentsPage, props),
    pinmanager: isBursar || isPrincipal ? /*#__PURE__*/React.createElement(DashboardPage, props) : /*#__PURE__*/React.createElement(PINManagerPage, props),
    audittrail: isBursar ? /*#__PURE__*/React.createElement(DashboardPage, props) : /*#__PURE__*/React.createElement(AuditTrailPage, props),
    institution: isBursar || isPrincipal ? /*#__PURE__*/React.createElement(DashboardPage, props) : /*#__PURE__*/React.createElement(InstitutionPage, props),
    grading: isBursar || isPrincipal ? /*#__PURE__*/React.createElement(DashboardPage, props) : /*#__PURE__*/React.createElement(GradingPage, props),
    scoreentry: isBursar ? /*#__PURE__*/React.createElement(DashboardPage, props) : /*#__PURE__*/React.createElement(ScoreEntryPage, props),
    assignments: isBursar ? /*#__PURE__*/React.createElement(DashboardPage, props) : /*#__PURE__*/React.createElement(AssignmentsPage, props),
    profile: /*#__PURE__*/React.createElement(ProfilePage, props)
  };
  return pages[activePage] || /*#__PURE__*/React.createElement(DashboardPage, props);
}

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
function LoginPage(_ref4) {
  var onLogin = _ref4.onLogin,
    state = _ref4.state,
    updateState = _ref4.updateState;
  var _useState17 = useState(""),
    _useState18 = _slicedToArray(_useState17, 2),
    email = _useState18[0],
    setEmail = _useState18[1];
  var _useState19 = useState(""),
    _useState20 = _slicedToArray(_useState19, 2),
    password = _useState20[0],
    setPassword = _useState20[1];
  var _useState21 = useState(""),
    _useState22 = _slicedToArray(_useState21, 2),
    error = _useState22[0],
    setError = _useState22[1];
  var _useState23 = useState(false),
    _useState24 = _slicedToArray(_useState23, 2),
    loading = _useState24[0],
    setLoading = _useState24[1];
  var _useState25 = useState("login"),
    _useState26 = _slicedToArray(_useState25, 2),
    mode = _useState26[0],
    setMode = _useState26[1]; // login | checker

  // Result checker state — 4 steps: class → student → term → PIN
  var _useState27 = useState(""),
    _useState28 = _slicedToArray(_useState27, 2),
    checkerClass = _useState28[0],
    setCheckerClass = _useState28[1];
  var _useState29 = useState(""),
    _useState30 = _slicedToArray(_useState29, 2),
    checkerStudentId = _useState30[0],
    setCheckerStudentId = _useState30[1];
  var _useState31 = useState(""),
    _useState32 = _slicedToArray(_useState31, 2),
    checkerTerm = _useState32[0],
    setCheckerTerm = _useState32[1];
  var _useState33 = useState(""),
    _useState34 = _slicedToArray(_useState33, 2),
    checkerPin = _useState34[0],
    setCheckerPin = _useState34[1];
  var _useState35 = useState(null),
    _useState36 = _slicedToArray(_useState35, 2),
    checkerResult = _useState36[0],
    setCheckerResult = _useState36[1];
  var handleLogin = /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(e) {
      var ok;
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.n) {
          case 0:
            e === null || e === void 0 || e.preventDefault();
            setLoading(true);
            setError("");
            _context4.n = 1;
            return new Promise(function (r) {
              return setTimeout(r, 600);
            });
          case 1:
            ok = onLogin(email, password);
            if (!ok) setError("Invalid email or password.");
            setLoading(false);
          case 2:
            return _context4.a(2);
        }
      }, _callee4);
    }));
    return function handleLogin(_x4) {
      return _ref5.apply(this, arguments);
    };
  }();
  var handleChecker = function handleChecker() {
    setError("");
    if (!checkerClass) {
      setError("Please select a class.");
      return;
    }
    if (!checkerStudentId) {
      setError("Please select your registration number.");
      return;
    }
    if (!checkerTerm) {
      setError("Please select a term.");
      return;
    }
    if (!checkerPin) {
      setError("Please enter your result PIN.");
      return;
    }
    var student = state.users.find(function (u) {
      return u.role === "student" && u.id === checkerStudentId && u.classId === checkerClass;
    });
    if (!student) {
      setError("Student not found.");
      return;
    }

    // PIN validation — pool system
    var pinEntry = (state.pinCodes || []).find(function (p) {
      return p.code === checkerPin.trim().toUpperCase();
    });
    if (!pinEntry) {
      setError("Invalid PIN. Please enter a valid result PIN code.");
      return;
    }
    if (pinEntry.claimedBy && pinEntry.claimedBy !== student.id) {
      setError("This PIN belongs to another student.");
      return;
    }
    if (pinEntry.usedCount >= 3) {
      setError("This PIN has been used 3 times and is exhausted. Contact your school admin for a new PIN.");
      return;
    }

    // Consume one use — claim and increment
    var newPinCodes = (state.pinCodes || []).map(function (p) {
      return p.code === pinEntry.code ? _objectSpread(_objectSpread({}, p), {}, {
        claimedBy: student.id,
        usedCount: p.usedCount + 1
      }) : p;
    });
    updateState({
      pinCodes: newPinCodes
    });
    var usesLeft = 3 - (pinEntry.usedCount + 1);
    setCheckerResult({
      classId: checkerClass,
      term: checkerTerm,
      student: student,
      usesLeft: usesLeft
    });
  };
  if (checkerResult) {
    return /*#__PURE__*/React.createElement(ResultCheckerView, {
      result: checkerResult,
      state: state,
      onBack: function onBack() {
        setCheckerResult(null);
        setCheckerClass("");
        setCheckerStudentId("");
        setCheckerTerm("");
        setCheckerPin("");
        setError("");
      }
    });
  }

  // Students in the selected class (for the reg-number dropdown)
  var studentsInClass = state.users.filter(function (u) {
    return u.role === "student" && u.classId === checkerClass;
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "login-page"
  }, /*#__PURE__*/React.createElement("div", {
    className: "login-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "login-logo"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "school",
    color: "white",
    size: 28
  })), /*#__PURE__*/React.createElement("div", {
    className: "login-title"
  }, state.institution.name), /*#__PURE__*/React.createElement("div", {
    className: "login-sub"
  }, "School Academic Record Management System"), /*#__PURE__*/React.createElement("div", {
    className: "tabs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tab ".concat(mode === "login" ? "active" : ""),
    onClick: function onClick() {
      setMode("login");
      setError("");
    }
  }, "Staff / Student Login"), /*#__PURE__*/React.createElement("div", {
    className: "tab ".concat(mode === "checker" ? "active" : ""),
    onClick: function onClick() {
      setMode("checker");
      setError("");
    }
  }, "Result Checker")), mode === "login" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Email Address"), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    type: "email",
    placeholder: "your@email.com",
    value: email,
    onChange: function onChange(e) {
      return setEmail(e.target.value);
    },
    onKeyDown: function onKeyDown(e) {
      return e.key === "Enter" && handleLogin();
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Password"), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    type: "password",
    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
    value: password,
    onChange: function onChange(e) {
      return setPassword(e.target.value);
    },
    onKeyDown: function onKeyDown(e) {
      return e.key === "Enter" && handleLogin();
    }
  })), error && /*#__PURE__*/React.createElement("div", {
    style: {
      color: COLORS.rose,
      fontSize: 13,
      marginBottom: 12,
      padding: "8px 12px",
      background: "rgba(244,63,94,0.1)",
      borderRadius: 8
    }
  }, error), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    style: {
      width: "100%",
      justifyContent: "center"
    },
    onClick: handleLogin,
    disabled: loading
  }, loading ? /*#__PURE__*/React.createElement("div", {
    className: "spinner"
  }) : "Sign In")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: COLORS.textSecondary,
      marginBottom: 16,
      textAlign: "center"
    }
  }, "Select your class, registration number and term to view your result"), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "\u2460 Class"), /*#__PURE__*/React.createElement("select", {
    className: "form-input",
    value: checkerClass,
    onChange: function onChange(e) {
      setCheckerClass(e.target.value);
      setCheckerStudentId("");
      setError("");
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "\u2014 Select your class \u2014"), state.classes.map(function (c) {
    return /*#__PURE__*/React.createElement("option", {
      key: c.id,
      value: c.id
    }, c.name);
  }))), checkerClass && /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "\u2461 Registration Number"), studentsInClass.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: COLORS.textMuted,
      padding: "10px 14px",
      background: "rgba(0,0,0,0.2)",
      borderRadius: 8
    }
  }, "No students found in this class.") : /*#__PURE__*/React.createElement("select", {
    className: "form-input",
    value: checkerStudentId,
    onChange: function onChange(e) {
      setCheckerStudentId(e.target.value);
      setError("");
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "\u2014 Select your reg number \u2014"), studentsInClass.map(function (s) {
    return /*#__PURE__*/React.createElement("option", {
      key: s.id,
      value: s.id
    }, s.studentId, " \u2014 ", s.name);
  })), checkerStudentId && function (_state$classes$find) {
    var sel = state.users.find(function (u) {
      return u.id === checkerStudentId;
    });
    return sel ? /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 8,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 12px",
        background: "rgba(37,99,235,0.1)",
        borderRadius: 8,
        border: "1px solid rgba(37,99,235,0.2)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 36,
        height: 36,
        borderRadius: "50%",
        overflow: "hidden",
        background: sel.avatar ? "transparent" : "linear-gradient(135deg,var(--blue),var(--indigo))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 13,
        fontWeight: 700,
        flexShrink: 0
      }
    }, sel.avatar ? /*#__PURE__*/React.createElement("img", {
      src: sel.avatar,
      alt: "",
      style: {
        width: "100%",
        height: "100%",
        objectFit: "cover"
      }
    }) : sel.name.split(" ").map(function (n) {
      return n[0];
    }).join("").slice(0, 2)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 700,
        fontSize: 14
      }
    }, sel.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: COLORS.textSecondary
      }
    }, sel.studentId, " \xB7 ", (_state$classes$find = state.classes.find(function (c) {
      return c.id === sel.classId;
    })) === null || _state$classes$find === void 0 ? void 0 : _state$classes$find.name))) : null;
  }()), checkerStudentId && /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "\u2462 Term"), /*#__PURE__*/React.createElement("select", {
    className: "form-input",
    value: checkerTerm,
    onChange: function onChange(e) {
      setCheckerTerm(e.target.value);
      setError("");
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "\u2014 Select term \u2014"), (state.terms || ["First Term", "Second Term", "Third Term"]).map(function (t) {
    return /*#__PURE__*/React.createElement("option", {
      key: t,
      value: t
    }, t);
  }))), checkerTerm && /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "\u2463 Result PIN"), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    placeholder: "e.g. GFA-X7K2M",
    value: checkerPin,
    onChange: function onChange(e) {
      setCheckerPin(e.target.value.toUpperCase());
      setError("");
    },
    onKeyDown: function onKeyDown(e) {
      return e.key === "Enter" && handleChecker();
    },
    style: {
      letterSpacing: "0.12em",
      fontWeight: 700,
      fontSize: 15
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: COLORS.textMuted,
      marginTop: 5
    }
  }, "\uD83D\uDD11 Each PIN can be used 3 times. Contact your school admin if you need a PIN.")), error && /*#__PURE__*/React.createElement("div", {
    style: {
      color: COLORS.rose,
      fontSize: 13,
      marginBottom: 12,
      padding: "8px 12px",
      background: "rgba(244,63,94,0.1)",
      borderRadius: 8
    }
  }, error), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    style: {
      width: "100%",
      justifyContent: "center"
    },
    disabled: !checkerClass || !checkerStudentId || !checkerTerm || !checkerPin,
    onClick: handleChecker
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 16
  }), " Check My Result"))));
}

// ─── RESULT CHECKER VIEW ──────────────────────────────────────────────────────
function ResultCheckerView(_ref6) {
  var result = _ref6.result,
    state = _ref6.state,
    onBack = _ref6.onBack;
  var classId = result.classId,
    term = result.term,
    student = result.student,
    usesLeft = result.usesLeft;
  var cls = state.classes.find(function (c) {
    return c.id === classId;
  });
  var scores = state.scores.filter(function (s) {
    return s.studentId === student.id && s.term === term && s.session === state.currentSession;
  });
  var classStudents = state.users.filter(function (u) {
    return u.role === "student" && u.classId === classId;
  });
  var ranked = rankStudents(classStudents, state.scores.filter(function (s) {
    return s.term === term && s.session === state.currentSession;
  }), classId, state.currentSession, term, state.gradingSystem);
  var myRank = ranked.find(function (r) {
    return r.id === student.id;
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "login-page",
    style: {
      flexDirection: "column",
      gap: 16,
      padding: "24px 16px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      flexWrap: "wrap",
      maxWidth: 740,
      margin: "0 auto",
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary",
    onClick: onBack
  }, "\u2190 Check Another Result"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "6px 14px",
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 600,
      background: usesLeft === 0 ? "rgba(244,63,94,0.1)" : usesLeft === 1 ? "rgba(245,158,11,0.1)" : "rgba(16,185,129,0.1)",
      border: "1px solid ".concat(usesLeft === 0 ? "rgba(244,63,94,0.3)" : usesLeft === 1 ? "rgba(245,158,11,0.3)" : "rgba(16,185,129,0.3)"),
      color: usesLeft === 0 ? COLORS.rose : usesLeft === 1 ? COLORS.gold : COLORS.emerald
    }
  }, "\uD83D\uDD11 ", usesLeft === 0 ? "PIN exhausted — contact admin for a new PIN" : "".concat(usesLeft, " PIN use").concat(usesLeft !== 1 ? "s" : "", " remaining"))), scores.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 740,
      margin: "0 auto",
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      textAlign: "center",
      padding: "40px 24px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 48,
      marginBottom: 12
    }
  }, "\uD83D\uDCCB"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 18,
      marginBottom: 8
    }
  }, "No Result Available"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: COLORS.textSecondary,
      fontSize: 14
    }
  }, "No scores have been entered for ", /*#__PURE__*/React.createElement("strong", null, student.name), " in ", /*#__PURE__*/React.createElement("strong", null, term), " yet. Please check back later or contact your school admin."))) : /*#__PURE__*/React.createElement(ResultSheet, {
    student: student,
    scores: scores,
    term: term,
    state: state,
    cls: cls,
    forcedRank: myRank,
    totalStudents: classStudents.length
  }));
}

// ─── RESULT SHEET ─────────────────────────────────────────────────────────────
function ResultSheet(_ref7) {
  var student = _ref7.student,
    scores = _ref7.scores,
    term = _ref7.term,
    state = _ref7.state,
    cls = _ref7.cls,
    isAnnual = _ref7.isAnnual,
    forcedRank = _ref7.forcedRank,
    forcedTotal = _ref7.totalStudents;
  var TRAITS = state.characterTraits || ["Punctuality", "Neatness", "Attentiveness", "Cooperation", "Honesty", "Respect", "Diligence"];
  var RATINGS = ["Excellent", "Very Good", "Good", "Fair", "Poor"];

  // Load saved character report for this student/session/term
  var charKey = "".concat(student.id, "_").concat(state.currentSession, "_").concat(term);
  var charReports = state.characterReports || {};
  var charData = charReports[charKey] || {};

  // Use pre-computed rank if passed (from ResultCheckerView), otherwise compute here
  var rankedStudents = !forcedRank && cls ? rankStudents(state.users.filter(function (u) {
    return u.role === "student" && u.classId === student.classId;
  }), state.scores, student.classId, state.currentSession, term, state.gradingSystem) : [];
  var myRank = forcedRank || rankedStudents.find(function (r) {
    return r.id === student.id;
  });
  var totalStudents = forcedTotal || rankedStudents.length;
  var grandTotal = isAnnual ? scores.reduce(function (a, s) {
    return a + (s.annualAvg || 0);
  }, 0) : scores.reduce(function (a, s) {
    return a + (s.ca || 0) + (s.exam || 0);
  }, 0);
  var grandAvg = scores.length > 0 ? (grandTotal / scores.length).toFixed(1) : 0;
  var grandGrade = getGrade(Number(grandAvg), state.gradingSystem);
  var ratingColor = function ratingColor(r) {
    if (r === "Excellent") return "#10B981";
    if (r === "Very Good") return "#3B82F6";
    if (r === "Good") return "#F59E0B";
    if (r === "Fair") return "#F97316";
    return "#F43F5E";
  };
  var printHtml = function printHtml() {
    var subRows = scores.map(function (s) {
      var sub = state.subjects.find(function (sb) {
        return sb.id === s.subjectId;
      });
      if (isAnnual) {
        var _gi = getGrade(s.annualAvg, state.gradingSystem);
        var parts = (s.comment || "").split("|").map(function (p) {
          var _p$trim$split$;
          return (_p$trim$split$ = p.trim().split(":")[1]) === null || _p$trim$split$ === void 0 ? void 0 : _p$trim$split$.trim();
        });
        return "<tr>\n          <td style=\"text-align:left;font-weight:600\">".concat(sub === null || sub === void 0 ? void 0 : sub.name, "</td>\n          <td>").concat(parts[0] || "—", "</td><td>").concat(parts[1] || "—", "</td><td>").concat(parts[2] || "—", "</td>\n          <td style=\"font-weight:800;color:#1B3A8F\">").concat(s.annualAvg, "</td>\n          <td style=\"font-weight:800;color:#1B3A8F\">").concat(_gi.grade, "</td><td>").concat(_gi.remark, "</td>\n        </tr>");
      }
      var tot = (s.ca || 0) + (s.exam || 0);
      var gi = getGrade(tot, state.gradingSystem);
      return "<tr>\n        <td style=\"text-align:left;font-weight:600\">".concat(sub === null || sub === void 0 ? void 0 : sub.name, "</td>\n        <td>").concat(s.ca, "</td><td>").concat(s.exam, "</td>\n        <td style=\"font-weight:800;color:#1B3A8F\">").concat(tot, "</td>\n        <td style=\"font-weight:800;color:#1B3A8F\">").concat(gi.grade, "</td>\n        <td>").concat(gi.remark, "</td><td style=\"font-size:11px;color:#555\">").concat(s.comment || "", "</td>\n      </tr>");
    }).join("");
    var traitRows = TRAITS.map(function (t) {
      var rating = charData[t] || "—";
      var col = charData[t] ? ratingColor(charData[t]) : "#999";
      return "<tr><td style=\"text-align:left\">".concat(t, "</td><td style=\"font-weight:700;color:").concat(col, "\">").concat(rating, "</td></tr>");
    }).join("");
    var html = "<!DOCTYPE html><html><head><meta charset=\"utf-8\"/>\n<title>Result \u2014 ".concat(student.name, "</title>\n<style>\n  *{margin:0;padding:0;box-sizing:border-box}\n  body{font-family:'Georgia',serif;background:#f5f7ff;padding:28px;color:#1a1a2e}\n  .page{background:white;max-width:740px;margin:0 auto;border-radius:12px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.15)}\n  .header{background:linear-gradient(135deg,#1B3A8F,#2563EB);color:white;padding:24px 28px;display:flex;align-items:center;gap:20px}\n  .logo{width:64px;height:64px;border-radius:50%;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;font-size:32px;flex-shrink:0;overflow:hidden}\n  .logo img{width:100%;height:100%;object-fit:cover}\n  .school-name{font-size:22px;font-weight:800;letter-spacing:0.02em}\n  .school-addr{font-size:12px;opacity:0.8;margin-top:4px}\n  .result-banner{background:linear-gradient(90deg,#F59E0B,#D97706);color:#000;text-align:center;padding:8px;font-size:13px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase}\n  .body{padding:24px 28px}\n  .student-row{display:flex;gap:20px;margin-bottom:20px;align-items:flex-start}\n  .passport{width:90px;height:110px;border:3px solid #1B3A8F;border-radius:6px;overflow:hidden;background:#e8eaf6;display:flex;align-items:center;justify-content:center;font-size:40px;flex-shrink:0}\n  .passport img{width:100%;height:100%;object-fit:cover}\n  .info-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px 20px;flex:1}\n  .info-item{display:flex;gap:6px;font-size:13px}\n  .info-label{font-weight:700;color:#333;min-width:80px}\n  .section-title{font-size:13px;font-weight:800;color:#1B3A8F;text-transform:uppercase;letter-spacing:0.1em;border-bottom:2px solid #1B3A8F;padding-bottom:4px;margin:18px 0 10px}\n  table{width:100%;border-collapse:collapse;font-size:12px}\n  th{background:#1B3A8F;color:white;padding:7px 8px;font-size:11px;text-align:center}\n  th:first-child{text-align:left}\n  td{padding:6px 8px;border:1px solid #dce3f5;text-align:center}\n  td:first-child{text-align:left}\n  tr:nth-child(even) td{background:#f0f4ff}\n  tfoot td{background:#e8edf8;font-weight:700}\n  .char-table{width:auto;min-width:280px}\n  .summary-box{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:14px 0}\n  .summary-item{background:#f0f4ff;border:1px solid #c7d4f5;border-radius:8px;padding:10px;text-align:center}\n  .summary-val{font-size:22px;font-weight:800;color:#1B3A8F}\n  .summary-lbl{font-size:10px;color:#666;text-transform:uppercase;letter-spacing:0.06em;margin-top:2px}\n  .footer-row{display:flex;justify-content:space-between;align-items:flex-end;margin-top:24px;padding-top:16px;border-top:2px solid #1B3A8F}\n  .sig-block{text-align:center}\n  .sig-img{height:50px;max-width:120px;object-fit:contain;display:block;margin:0 auto 4px}\n  .sig-line{border-top:1px solid #333;padding-top:4px;font-size:11px;color:#444}\n  .principal-comment{background:#f0f4ff;border-left:4px solid #1B3A8F;padding:10px 14px;border-radius:0 8px 8px 0;font-style:italic;font-size:13px;color:#333;margin-top:14px}\n  .stamp{border:3px double #1B3A8F;border-radius:50%;width:80px;height:80px;display:flex;align-items:center;justify-content:center;color:#1B3A8F;font-size:9px;font-weight:700;text-align:center;padding:8px;line-height:1.3}\n  @media print{body{background:white;padding:0}.page{box-shadow:none;border-radius:0}}\n</style></head><body>\n<div class=\"page\">\n  <div class=\"header\">\n    <div class=\"logo\">").concat(state.institution.logo ? "<img src=\"".concat(state.institution.logo, "\" alt=\"logo\"/>") : "🏫", "</div>\n    <div>\n      <div class=\"school-name\">").concat(state.institution.name, "</div>\n      <div class=\"school-addr\">").concat(state.institution.address, "</div>\n    </div>\n  </div>\n  <div class=\"result-banner\">\uD83D\uDCCB ").concat(term, " Academic Result Report \xB7 ").concat(state.currentSession, "</div>\n  <div class=\"body\">\n    <div class=\"student-row\">\n      <div class=\"passport\">").concat(student.avatar ? "<img src=\"".concat(student.avatar, "\" alt=\"").concat(student.name, "\"/>") : "👤", "</div>\n      <div class=\"info-grid\">\n        <div class=\"info-item\"><span class=\"info-label\">Full Name:</span><strong>").concat(student.name, "</strong></div>\n        <div class=\"info-item\"><span class=\"info-label\">Class:</span>").concat(cls === null || cls === void 0 ? void 0 : cls.name, "</div>\n        <div class=\"info-item\"><span class=\"info-label\">Student ID:</span>").concat(student.studentId, "</div>\n        <div class=\"info-item\"><span class=\"info-label\">Position:</span><strong>").concat(myRank ? "".concat(ordinal(myRank.position), " of ").concat(totalStudents) : "N/A", "</strong></div>\n        <div class=\"info-item\"><span class=\"info-label\">Session:</span>").concat(state.currentSession, "</div>\n        <div class=\"info-item\"><span class=\"info-label\">Term:</span>").concat(term, "</div>\n      </div>\n    </div>\n\n    <div class=\"summary-box\">\n      <div class=\"summary-item\"><div class=\"summary-val\">").concat(scores.length, "</div><div class=\"summary-lbl\">Subjects</div></div>\n      <div class=\"summary-item\"><div class=\"summary-val\" style=\"color:#1B3A8F\">").concat(typeof grandTotal === 'number' ? grandTotal.toFixed(1) : grandTotal, "</div><div class=\"summary-lbl\">Total Score</div></div>\n      <div class=\"summary-item\"><div class=\"summary-val\">").concat(grandAvg, "</div><div class=\"summary-lbl\">Average</div></div>\n      <div class=\"summary-item\"><div class=\"summary-val\" style=\"color:").concat(grandGrade.grade === 'A' ? '#10B981' : grandGrade.grade === 'F' ? '#F43F5E' : '#1B3A8F', "\">").concat(grandGrade.grade, "</div><div class=\"summary-lbl\">Overall Grade</div></div>\n    </div>\n\n    <div class=\"section-title\">\uD83D\uDCDA Academic Performance</div>\n    <table>\n      <thead><tr>\n        <th>Subject</th>\n        ").concat(isAnnual ? "<th>1st Term</th><th>2nd Term</th><th>3rd Term</th><th>Annual Avg</th>" : "<th>CA (40)</th><th>Exam (60)</th><th>Total (100)</th>", "\n        <th>Grade</th><th>Remark</th>").concat(!isAnnual ? "<th>Teacher's Comment</th>" : "", "\n      </tr></thead>\n      <tbody>").concat(subRows, "</tbody>\n      <tfoot><tr>\n        <td colspan=\"").concat(isAnnual ? 4 : 3, "\" style=\"text-align:right\">Grand Total / Average:</td>\n        <td>").concat(typeof grandTotal === 'number' ? grandTotal.toFixed(1) : grandTotal, " / ").concat(grandAvg, "</td>\n        <td style=\"color:#1B3A8F\">").concat(grandGrade.grade, "</td>\n        <td>").concat(grandGrade.remark, "</td>").concat(!isAnnual ? "<td></td>" : "", "\n      </tr></tfoot>\n    </table>\n\n    <div style=\"display:flex;gap:24px;margin-top:4px;align-items:flex-start\">\n      <div style=\"flex:1\">\n        <div class=\"section-title\">\uD83C\uDF1F Character & Moral Assessment</div>\n        <table class=\"char-table\">\n          <thead><tr><th style=\"text-align:left\">Trait</th><th>Rating</th></tr></thead>\n          <tbody>").concat(traitRows, "</tbody>\n        </table>\n      </div>\n      <div style=\"flex:1\">\n        <div class=\"section-title\">\uD83D\uDCDD Teacher's Remark</div>\n        <div style=\"font-size:13px;color:#333;font-style:italic;line-height:1.6;background:#f9f9ff;padding:10px 14px;border-radius:8px;border:1px solid #dce3f5\">\n          ").concat(charData._teacherRemark || (Number(grandAvg) >= 70 ? "Outstanding academic performance. This student demonstrates excellent dedication and hard work. Keep it up!" : Number(grandAvg) >= 50 ? "Good performance this term. With more focus and consistency, even greater heights can be achieved." : "Improvement is needed in several areas. We encourage this student to put in more effort and seek help where needed."), "\n        </div>\n      </div>\n    </div>\n\n    ").concat(state.institution.principalComment ? "\n    <div class=\"principal-comment\">\n      <strong>Principal's Note:</strong> ".concat(state.institution.principalComment, "\n    </div>") : "", "\n\n    <div class=\"footer-row\">\n      <div class=\"sig-block\">\n        <div style=\"height:50px;display:flex;align-items:flex-end;justify-content:center;margin-bottom:4px\">\n          <div style=\"width:100px;border-bottom:1px solid #333\"></div>\n        </div>\n        <div class=\"sig-line\">Class Teacher</div>\n      </div>\n      <div class=\"stamp\">\n        <div>").concat(state.institution.name.split(" ").map(function (w) {
      return w[0];
    }).join("").slice(0, 4), "<br/>OFFICIAL<br/>STAMP</div>\n      </div>\n      <div class=\"sig-block\">\n        ").concat(state.institution.signature ? "<img class=\"sig-img\" src=\"".concat(state.institution.signature, "\" alt=\"Principal Signature\"/>") : "<div style=\"height:50px;display:flex;align-items:flex-end;justify-content:center;margin-bottom:4px\"><div style=\"width:120px;border-bottom:1px solid #333\"></div></div>", "\n        <div class=\"sig-line\">").concat(state.institution.principal, "<br/><span style=\"color:#888\">Principal</span></div>\n      </div>\n    </div>\n\n    <div style=\"text-align:center;font-size:10px;color:#aaa;margin-top:16px;border-top:1px solid #eee;padding-top:10px\">\n      This result is computer-generated by SARMS \xB7 ").concat(state.institution.name, " \xB7 ").concat(new Date().toLocaleDateString(), "\n      \xB7 Any alteration renders this document invalid\n    </div>\n  </div>\n</div>\n<script>window.onload=()=>window.print()</script>\n</body></html>");
    var blob = new Blob([html], {
      type: "text/html"
    });
    var url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    setTimeout(function () {
      return URL.revokeObjectURL(url);
    }, 10000);
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      marginBottom: 20,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: printHtml
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "download",
    size: 16
  }), " Download / Print PDF")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "white",
      borderRadius: 16,
      overflow: "hidden",
      boxShadow: "0 8px 40px rgba(0,0,0,0.25)",
      maxWidth: 740,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "linear-gradient(135deg,#1B3A8F,#2563EB)",
      color: "white",
      padding: "24px 28px",
      display: "flex",
      alignItems: "center",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 64,
      height: 64,
      borderRadius: "50%",
      background: "rgba(255,255,255,0.2)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 32,
      flexShrink: 0,
      overflow: "hidden"
    }
  }, state.institution.logo ? /*#__PURE__*/React.createElement("img", {
    src: state.institution.logo,
    alt: "logo",
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }) : "🏫"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 20,
      fontWeight: 800
    }
  }, state.institution.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      opacity: 0.8,
      marginTop: 3
    }
  }, state.institution.address))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "linear-gradient(90deg,#F59E0B,#D97706)",
      color: "#000",
      textAlign: "center",
      padding: "7px",
      fontSize: 12,
      fontWeight: 800,
      letterSpacing: "0.1em",
      textTransform: "uppercase"
    }
  }, "\uD83D\uDCCB ", term, " Academic Result Report \xB7 ", state.currentSession), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "24px 28px",
      color: "#1a1a2e"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 20,
      marginBottom: 20,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 90,
      height: 110,
      border: "3px solid #1B3A8F",
      borderRadius: 6,
      overflow: "hidden",
      background: "#e8eaf6",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0
    }
  }, student.avatar ? /*#__PURE__*/React.createElement("img", {
    src: student.avatar,
    alt: student.name,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 40
    }
  }, "\uD83D\uDC64")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "6px 20px",
      flex: 1
    }
  }, [["Full Name", student.name], ["Class", cls === null || cls === void 0 ? void 0 : cls.name], ["Student ID", student.studentId], ["Position", myRank ? "".concat(ordinal(myRank.position), " of ").concat(totalStudents) : "N/A"], ["Session", state.currentSession], ["Term", term]].map(function (_ref8) {
    var _ref9 = _slicedToArray(_ref8, 2),
      l = _ref9[0],
      v = _ref9[1];
    return /*#__PURE__*/React.createElement("div", {
      key: l,
      style: {
        display: "flex",
        gap: 6,
        fontSize: 13
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 700,
        color: "#333",
        minWidth: 80
      }
    }, l, ":"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: l === "Full Name" || l === "Position" ? 700 : 400
      }
    }, v));
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: 10,
      marginBottom: 20
    }
  }, [{
    label: "Subjects",
    val: scores.length,
    color: "#1B3A8F"
  }, {
    label: "Total",
    val: typeof grandTotal === "number" ? grandTotal.toFixed(1) : grandTotal,
    color: "#1B3A8F"
  }, {
    label: "Average",
    val: grandAvg,
    color: "#D97706"
  }, {
    label: "Grade",
    val: grandGrade.grade,
    color: grandGrade.grade === "A" ? "#10B981" : grandGrade.grade === "F" ? "#F43F5E" : "#1B3A8F"
  }].map(function (s) {
    return /*#__PURE__*/React.createElement("div", {
      key: s.label,
      style: {
        background: "#f0f4ff",
        border: "1px solid #c7d4f5",
        borderRadius: 8,
        padding: "10px",
        textAlign: "center"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 22,
        fontWeight: 800,
        color: s.color
      }
    }, s.val), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: "#666",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        marginTop: 2
      }
    }, s.label));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 800,
      color: "#1B3A8F",
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      borderBottom: "2px solid #1B3A8F",
      paddingBottom: 4,
      marginBottom: 10
    }
  }, "\uD83D\uDCDA Academic Performance"), /*#__PURE__*/React.createElement("table", {
    style: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: 12,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: {
      background: "#1B3A8F",
      color: "white",
      padding: "7px 8px",
      textAlign: "left"
    }
  }, "Subject"), isAnnual ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("th", {
    style: {
      background: "#1B3A8F",
      color: "white",
      padding: "7px 8px"
    }
  }, "1st"), /*#__PURE__*/React.createElement("th", {
    style: {
      background: "#1B3A8F",
      color: "white",
      padding: "7px 8px"
    }
  }, "2nd"), /*#__PURE__*/React.createElement("th", {
    style: {
      background: "#1B3A8F",
      color: "white",
      padding: "7px 8px"
    }
  }, "3rd"), /*#__PURE__*/React.createElement("th", {
    style: {
      background: "#1B3A8F",
      color: "white",
      padding: "7px 8px"
    }
  }, "Annual")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("th", {
    style: {
      background: "#1B3A8F",
      color: "white",
      padding: "7px 8px"
    }
  }, "CA(40)"), /*#__PURE__*/React.createElement("th", {
    style: {
      background: "#1B3A8F",
      color: "white",
      padding: "7px 8px"
    }
  }, "Exam(60)"), /*#__PURE__*/React.createElement("th", {
    style: {
      background: "#1B3A8F",
      color: "white",
      padding: "7px 8px"
    }
  }, "Total")), /*#__PURE__*/React.createElement("th", {
    style: {
      background: "#1B3A8F",
      color: "white",
      padding: "7px 8px"
    }
  }, "Grade"), /*#__PURE__*/React.createElement("th", {
    style: {
      background: "#1B3A8F",
      color: "white",
      padding: "7px 8px"
    }
  }, "Remark"), !isAnnual && /*#__PURE__*/React.createElement("th", {
    style: {
      background: "#1B3A8F",
      color: "white",
      padding: "7px 8px",
      textAlign: "left"
    }
  }, "Comment"))), /*#__PURE__*/React.createElement("tbody", null, scores.map(function (s, idx) {
    var sub = state.subjects.find(function (sb) {
      return sb.id === s.subjectId;
    });
    if (isAnnual) {
      var _gi2 = getGrade(s.annualAvg, state.gradingSystem);
      var parts = (s.comment || "").split("|").map(function (p) {
        var _p$trim$split$2;
        return (_p$trim$split$2 = p.trim().split(":")[1]) === null || _p$trim$split$2 === void 0 ? void 0 : _p$trim$split$2.trim();
      });
      return /*#__PURE__*/React.createElement("tr", {
        key: s.id || idx,
        style: {
          background: idx % 2 === 1 ? "#f0f4ff" : "white"
        }
      }, /*#__PURE__*/React.createElement("td", {
        style: {
          padding: "6px 8px",
          fontWeight: 600,
          border: "1px solid #dce3f5"
        }
      }, sub === null || sub === void 0 ? void 0 : sub.name), parts.map(function (p, i) {
        return /*#__PURE__*/React.createElement("td", {
          key: i,
          style: {
            padding: "6px 8px",
            border: "1px solid #dce3f5",
            textAlign: "center"
          }
        }, p || "—");
      }), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: "6px 8px",
          fontWeight: 800,
          color: "#1B3A8F",
          border: "1px solid #dce3f5",
          textAlign: "center"
        }
      }, s.annualAvg), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: "6px 8px",
          fontWeight: 800,
          color: "#1B3A8F",
          border: "1px solid #dce3f5",
          textAlign: "center"
        }
      }, _gi2.grade), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: "6px 8px",
          border: "1px solid #dce3f5",
          textAlign: "center"
        }
      }, _gi2.remark));
    }
    var tot = (s.ca || 0) + (s.exam || 0);
    var gi = getGrade(tot, state.gradingSystem);
    return /*#__PURE__*/React.createElement("tr", {
      key: s.id || idx,
      style: {
        background: idx % 2 === 1 ? "#f0f4ff" : "white"
      }
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        padding: "6px 8px",
        fontWeight: 600,
        border: "1px solid #dce3f5"
      }
    }, sub === null || sub === void 0 ? void 0 : sub.name), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: "6px 8px",
        border: "1px solid #dce3f5",
        textAlign: "center"
      }
    }, s.ca), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: "6px 8px",
        border: "1px solid #dce3f5",
        textAlign: "center"
      }
    }, s.exam), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: "6px 8px",
        fontWeight: 800,
        color: "#1B3A8F",
        border: "1px solid #dce3f5",
        textAlign: "center"
      }
    }, tot), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: "6px 8px",
        fontWeight: 800,
        color: "#1B3A8F",
        border: "1px solid #dce3f5",
        textAlign: "center"
      }
    }, gi.grade), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: "6px 8px",
        border: "1px solid #dce3f5",
        textAlign: "center"
      }
    }, gi.remark), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: "6px 8px",
        border: "1px solid #dce3f5",
        fontSize: 11,
        color: "#555"
      }
    }, s.comment));
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 20,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 800,
      color: "#1B3A8F",
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      borderBottom: "2px solid #1B3A8F",
      paddingBottom: 4,
      marginBottom: 10
    }
  }, "\uD83C\uDF1F Character & Moral"), /*#__PURE__*/React.createElement("table", {
    style: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: 12
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: {
      background: "#1B3A8F",
      color: "white",
      padding: "6px 8px",
      textAlign: "left"
    }
  }, "Trait"), /*#__PURE__*/React.createElement("th", {
    style: {
      background: "#1B3A8F",
      color: "white",
      padding: "6px 8px"
    }
  }, "Rating"))), /*#__PURE__*/React.createElement("tbody", null, TRAITS.map(function (t, i) {
    return /*#__PURE__*/React.createElement("tr", {
      key: t,
      style: {
        background: i % 2 === 1 ? "#f0f4ff" : "white"
      }
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        padding: "5px 8px",
        border: "1px solid #dce3f5"
      }
    }, t), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: "5px 8px",
        border: "1px solid #dce3f5",
        textAlign: "center",
        fontWeight: 700,
        color: charData[t] ? ratingColor(charData[t]) : "#999"
      }
    }, charData[t] || "—"));
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 800,
      color: "#1B3A8F",
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      borderBottom: "2px solid #1B3A8F",
      paddingBottom: 4,
      marginBottom: 10
    }
  }, "\uD83D\uDCDD Remarks"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#f9f9ff",
      border: "1px solid #dce3f5",
      borderRadius: 8,
      padding: "12px 14px",
      fontSize: 13,
      fontStyle: "italic",
      color: "#333",
      lineHeight: 1.7,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Teacher:"), " ", charData._teacherRemark || (Number(grandAvg) >= 70 ? "Outstanding performance. Keep it up!" : Number(grandAvg) >= 50 ? "Good performance. Room for improvement." : "More effort needed. We believe in you!")), state.institution.principalComment && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#f0f4ff",
      borderLeft: "4px solid #1B3A8F",
      borderRadius: "0 8px 8px 0",
      padding: "10px 14px",
      fontSize: 13,
      fontStyle: "italic",
      color: "#333",
      lineHeight: 1.6
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Principal:"), " ", state.institution.principalComment))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end",
      marginTop: 20,
      paddingTop: 16,
      borderTop: "2px solid #1B3A8F"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 100,
      borderBottom: "1px solid #333",
      marginBottom: 4,
      height: 44
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "#444"
    }
  }, "Class Teacher")), /*#__PURE__*/React.createElement("div", {
    style: {
      border: "3px double #1B3A8F",
      borderRadius: "50%",
      width: 72,
      height: 72,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#1B3A8F",
      fontSize: 9,
      fontWeight: 700,
      textAlign: "center",
      lineHeight: 1.3
    }
  }, state.institution.name.split(" ").map(function (w) {
    return w[0];
  }).join("").slice(0, 4), /*#__PURE__*/React.createElement("br", null), "OFFICIAL"), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center"
    }
  }, state.institution.signature ? /*#__PURE__*/React.createElement("img", {
    src: state.institution.signature,
    alt: "Signature",
    style: {
      height: 44,
      maxWidth: 120,
      objectFit: "contain",
      display: "block",
      marginBottom: 4
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      width: 120,
      borderBottom: "1px solid #333",
      marginBottom: 4,
      height: 44
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "#444"
    }
  }, state.institution.principal), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: "#888"
    }
  }, "Principal"))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      fontSize: 10,
      color: "#aaa",
      marginTop: 14,
      paddingTop: 10,
      borderTop: "1px solid #eee"
    }
  }, "SARMS \xB7 ", state.institution.name, " \xB7 Generated ", new Date().toLocaleDateString(), " \xB7 Any alteration renders this document invalid"))));
}

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────
function DashboardPage(_ref0) {
  var _studentUser$name;
  var state = _ref0.state,
    currentUser = _ref0.currentUser,
    updateState = _ref0.updateState,
    showNotification = _ref0.showNotification;
  var students = state.users.filter(function (u) {
    return u.role === "student";
  });
  var teachers = state.users.filter(function (u) {
    return u.role === "teacher";
  });
  var announcements = state.announcements.filter(function (a) {
    return a.targetClass === "all" || currentUser.classId && a.targetClass === currentUser.classId || currentUser.role === "admin" || currentUser.role === "teacher" || currentUser.role === "bursar";
  }).slice(0, 4);

  // ── BURSAR DASHBOARD ─────────────────────────────────────────
  if (currentUser.role === "bursar") {
    var _state$institution;
    var payments = state.payments || [];
    var formatMoney = function formatMoney(n) {
      return "₦" + Number(n).toLocaleString("en-NG", {
        minimumFractionDigits: 2
      });
    };
    var totalConf = payments.filter(function (p) {
      return p.status === "Confirmed";
    }).reduce(function (s, p) {
      return s + Number(p.amount);
    }, 0);
    var totalPend = payments.filter(function (p) {
      return p.status === "Pending";
    }).reduce(function (s, p) {
      return s + Number(p.amount);
    }, 0);
    var todayStr = new Date().toDateString();
    var todayPayments = payments.filter(function (p) {
      return new Date(p.createdAt).toDateString() === todayStr;
    });
    var todayTotal = todayPayments.filter(function (p) {
      return p.status === "Confirmed";
    }).reduce(function (s, p) {
      return s + Number(p.amount);
    }, 0);
    var pending = payments.filter(function (p) {
      return p.status === "Pending";
    });
    var recentConf = payments.filter(function (p) {
      return p.status === "Confirmed";
    }).sort(function (a, b) {
      return new Date(b.confirmedAt) - new Date(a.confirmedAt);
    }).slice(0, 5);
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "card",
      style: {
        background: "linear-gradient(135deg,rgba(37,99,235,0.2),rgba(16,185,129,0.1))",
        border: "1px solid rgba(37,99,235,0.25)",
        marginBottom: 24,
        display: "flex",
        alignItems: "center",
        gap: 20
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 60,
        height: 60,
        borderRadius: "50%",
        flexShrink: 0,
        background: currentUser.avatar ? "transparent" : "linear-gradient(135deg,var(--emerald),var(--blue))",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-display)",
        fontWeight: 800,
        fontSize: 22,
        border: "3px solid rgba(16,185,129,0.4)"
      }
    }, currentUser.avatar ? /*#__PURE__*/React.createElement("img", {
      src: currentUser.avatar,
      alt: "",
      style: {
        width: "100%",
        height: "100%",
        objectFit: "cover"
      }
    }) : currentUser.name.split(" ").map(function (n) {
      return n[0];
    }).join("").slice(0, 2)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 800,
        fontSize: 20
      }
    }, "Welcome, ", currentUser.name.split(" ")[0], " \uD83D\uDC4B"), /*#__PURE__*/React.createElement("div", {
      style: {
        color: COLORS.textSecondary,
        marginTop: 4,
        fontSize: 13
      }
    }, "Bursar \xB7 ", (_state$institution = state.institution) === null || _state$institution === void 0 ? void 0 : _state$institution.name, " \xB7 ", state.currentSession, " \u2014 ", state.currentTerm))), /*#__PURE__*/React.createElement("div", {
      className: "stats-grid",
      style: {
        marginBottom: 24
      }
    }, [{
      label: "Total Collected",
      value: formatMoney(totalConf),
      color: COLORS.emerald,
      icon: "💰",
      sub: "".concat(payments.filter(function (p) {
        return p.status === "Confirmed";
      }).length, " payments")
    }, {
      label: "Pending Amount",
      value: formatMoney(totalPend),
      color: COLORS.gold,
      icon: "⏳",
      sub: "".concat(pending.length, " awaiting confirmation")
    }, {
      label: "Collected Today",
      value: formatMoney(todayTotal),
      color: COLORS.blue,
      icon: "📅",
      sub: "".concat(todayPayments.length, " payments today")
    }, {
      label: "Total Students",
      value: students.length,
      color: COLORS.blueLight,
      icon: "👥",
      sub: "enrolled students"
    }].map(function (s) {
      return /*#__PURE__*/React.createElement("div", {
        className: "stat-card",
        key: s.label
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 28,
          marginBottom: 4
        }
      }, s.icon), /*#__PURE__*/React.createElement("div", {
        className: "stat-card-value",
        style: {
          color: s.color,
          fontSize: 20
        }
      }, s.value), /*#__PURE__*/React.createElement("div", {
        className: "stat-card-label"
      }, s.label), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 11,
          color: COLORS.textMuted,
          marginTop: 2
        }
      }, s.sub));
    })), /*#__PURE__*/React.createElement("div", {
      className: "grid-2"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card"
    }, /*#__PURE__*/React.createElement("div", {
      className: "section-title",
      style: {
        marginBottom: 12
      }
    }, "\u23F3 Awaiting Confirmation (", pending.length, ")"), pending.length === 0 ? /*#__PURE__*/React.createElement("div", {
      className: "empty-state",
      style: {
        padding: 20
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "empty-state-icon"
    }, "\u2705"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: COLORS.textMuted
      }
    }, "All payments confirmed")) : pending.slice(0, 5).map(function (p) {
      var st = state.users.find(function (u) {
        return u.id === p.studentId;
      });
      var cls = state.classes.find(function (c) {
        return c.id === (st === null || st === void 0 ? void 0 : st.classId);
      });
      return /*#__PURE__*/React.createElement("div", {
        key: p.id,
        style: {
          padding: "10px 14px",
          marginBottom: 8,
          borderRadius: 10,
          background: "rgba(245,158,11,0.08)",
          border: "1px solid rgba(245,158,11,0.2)",
          display: "flex",
          alignItems: "center",
          gap: 12
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontWeight: 700,
          fontSize: 14
        }
      }, st === null || st === void 0 ? void 0 : st.name), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 12,
          color: COLORS.textSecondary
        }
      }, p.paymentType, " \xB7 ", cls === null || cls === void 0 ? void 0 : cls.name, " \xB7 ", p.method)), /*#__PURE__*/React.createElement("div", {
        style: {
          fontWeight: 800,
          color: COLORS.gold,
          fontSize: 15
        }
      }, formatMoney(p.amount)));
    }), pending.length > 5 && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: COLORS.textMuted,
        textAlign: "center",
        marginTop: 8
      }
    }, "+", pending.length - 5, " more \u2014 go to Payments to confirm all")), /*#__PURE__*/React.createElement("div", {
      className: "card"
    }, /*#__PURE__*/React.createElement("div", {
      className: "section-title",
      style: {
        marginBottom: 12
      }
    }, "\u2705 Recently Confirmed"), recentConf.length === 0 ? /*#__PURE__*/React.createElement("div", {
      className: "empty-state",
      style: {
        padding: 20
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "empty-state-icon"
    }, "\uD83D\uDCB3"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: COLORS.textMuted
      }
    }, "No confirmed payments yet")) : recentConf.map(function (p) {
      var st = state.users.find(function (u) {
        return u.id === p.studentId;
      });
      return /*#__PURE__*/React.createElement("div", {
        key: p.id,
        style: {
          padding: "10px 14px",
          marginBottom: 8,
          borderRadius: 10,
          background: "rgba(16,185,129,0.08)",
          border: "1px solid rgba(16,185,129,0.15)",
          display: "flex",
          alignItems: "center",
          gap: 12
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontWeight: 700,
          fontSize: 14
        }
      }, st === null || st === void 0 ? void 0 : st.name), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 12,
          color: COLORS.textSecondary
        }
      }, p.paymentType, " \xB7 ", p.receiptNo), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 11,
          color: COLORS.textMuted
        }
      }, new Date(p.confirmedAt).toLocaleDateString("en-NG"))), /*#__PURE__*/React.createElement("div", {
        style: {
          fontWeight: 800,
          color: COLORS.emerald,
          fontSize: 15
        }
      }, formatMoney(p.amount)));
    }))), announcements.length > 0 && /*#__PURE__*/React.createElement("div", {
      className: "card",
      style: {
        marginTop: 20
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "section-title",
      style: {
        marginBottom: 12
      }
    }, "School Announcements"), announcements.map(function (a) {
      return /*#__PURE__*/React.createElement("div", {
        key: a.id,
        className: "announcement-card"
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontWeight: 600,
          fontSize: 14
        }
      }, a.title), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 12,
          color: COLORS.textSecondary,
          marginTop: 4
        }
      }, a.content.slice(0, 90)), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 11,
          color: COLORS.textMuted,
          marginTop: 4
        }
      }, a.author, " \xB7 ", a.date));
    })));
  }
  if (currentUser.role === "principal") {
    var _state$institution2;
    var today = new Date().toISOString().split("T")[0];
    var todayAtt = (state.attendance || []).filter(function (a) {
      return a.date === today;
    });
    var _teachers = state.users.filter(function (u) {
      return u.role === "teacher";
    });
    var presentToday = todayAtt.filter(function (a) {
      return a.status === "Present";
    }).length;
    var absentToday = todayAtt.filter(function (a) {
      return a.status === "Absent";
    }).length;
    var lateToday = todayAtt.filter(function (a) {
      return a.status === "Late";
    }).length;
    var unmarked = _teachers.length - todayAtt.length;

    // Weekly attendance summary (last 7 days)
    var last7 = Array.from({
      length: 7
    }, function (_, i) {
      var d = new Date();
      d.setDate(d.getDate() - (6 - i));
      var ds = d.toISOString().split("T")[0];
      var dayAtt = (state.attendance || []).filter(function (a) {
        return a.date === ds;
      });
      return {
        date: ds,
        label: d.toLocaleDateString("en-NG", {
          weekday: "short"
        }),
        present: dayAtt.filter(function (a) {
          return a.status === "Present";
        }).length,
        absent: dayAtt.filter(function (a) {
          return a.status === "Absent";
        }).length,
        late: dayAtt.filter(function (a) {
          return a.status === "Late";
        }).length,
        total: _teachers.length
      };
    });

    // Recently absent teachers
    var recentAbsent = (state.attendance || []).filter(function (a) {
      return a.status === "Absent";
    }).sort(function (a, b) {
      return b.date.localeCompare(a.date);
    }).slice(0, 5);
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "card",
      style: {
        background: "linear-gradient(135deg,rgba(139,92,246,0.2),rgba(37,99,235,0.15))",
        border: "1px solid rgba(139,92,246,0.3)",
        marginBottom: 24,
        display: "flex",
        alignItems: "center",
        gap: 20
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 60,
        height: 60,
        borderRadius: "50%",
        flexShrink: 0,
        background: currentUser.avatar ? "transparent" : "linear-gradient(135deg,#7c3aed,#2563EB)",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-display)",
        fontWeight: 800,
        fontSize: 22,
        border: "3px solid rgba(139,92,246,0.4)"
      }
    }, currentUser.avatar ? /*#__PURE__*/React.createElement("img", {
      src: currentUser.avatar,
      alt: "",
      style: {
        width: "100%",
        height: "100%",
        objectFit: "cover"
      }
    }) : currentUser.name.split(" ").map(function (n) {
      return n[0];
    }).join("").slice(0, 2)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 800,
        fontSize: 20
      }
    }, "Welcome, ", currentUser.name.split(" ")[0], " \uD83D\uDC4B"), /*#__PURE__*/React.createElement("div", {
      style: {
        color: COLORS.textSecondary,
        marginTop: 4,
        fontSize: 13
      }
    }, "Principal \xB7 ", (_state$institution2 = state.institution) === null || _state$institution2 === void 0 ? void 0 : _state$institution2.name, " \xB7 ", new Date().toLocaleDateString("en-NG", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    })))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 16,
        marginBottom: 12
      }
    }, "\uD83D\uDCCB Today's Staff Attendance \u2014 ", new Date().toLocaleDateString("en-NG", {
      day: "numeric",
      month: "long"
    })), /*#__PURE__*/React.createElement("div", {
      className: "stats-grid",
      style: {
        marginBottom: 24
      }
    }, [{
      label: "Present",
      value: presentToday,
      color: COLORS.emerald,
      icon: "✅",
      sub: "of ".concat(_teachers.length, " teachers")
    }, {
      label: "Absent",
      value: absentToday,
      color: COLORS.rose,
      icon: "❌",
      sub: "not in school"
    }, {
      label: "Late",
      value: lateToday,
      color: COLORS.gold,
      icon: "⏰",
      sub: "arrived late"
    }, {
      label: "Not Marked",
      value: unmarked,
      color: COLORS.textMuted,
      icon: "❓",
      sub: "awaiting check-in"
    }].map(function (s) {
      return /*#__PURE__*/React.createElement("div", {
        className: "stat-card",
        key: s.label
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 28,
          marginBottom: 4
        }
      }, s.icon), /*#__PURE__*/React.createElement("div", {
        className: "stat-card-value",
        style: {
          color: s.color,
          fontSize: 24
        }
      }, s.value), /*#__PURE__*/React.createElement("div", {
        className: "stat-card-label"
      }, s.label), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 11,
          color: COLORS.textMuted,
          marginTop: 2
        }
      }, s.sub));
    })), /*#__PURE__*/React.createElement("div", {
      className: "grid-2"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card"
    }, /*#__PURE__*/React.createElement("div", {
      className: "section-title",
      style: {
        marginBottom: 16
      }
    }, "\uD83D\uDCCA 7-Day Attendance Trend"), last7.map(function (day) {
      var pct = day.total > 0 ? Math.round(day.present / day.total * 100) : 0;
      return /*#__PURE__*/React.createElement("div", {
        key: day.date,
        style: {
          marginBottom: 14
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 4,
          fontSize: 13
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: 600
        }
      }, day.label, " ", /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 11,
          color: COLORS.textMuted
        }
      }, day.date)), /*#__PURE__*/React.createElement("span", {
        style: {
          display: "flex",
          gap: 10,
          fontSize: 12
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          color: COLORS.emerald
        }
      }, "\u2705", day.present), /*#__PURE__*/React.createElement("span", {
        style: {
          color: COLORS.rose
        }
      }, "\u274C", day.absent), /*#__PURE__*/React.createElement("span", {
        style: {
          color: COLORS.gold
        }
      }, "\u23F0", day.late), /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: 700,
          color: pct >= 80 ? COLORS.emerald : pct >= 60 ? COLORS.gold : COLORS.rose
        }
      }, pct, "%"))), /*#__PURE__*/React.createElement("div", {
        style: {
          height: 8,
          background: "var(--border)",
          borderRadius: 4,
          overflow: "hidden"
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          height: "100%",
          width: "".concat(pct, "%"),
          background: "linear-gradient(90deg,".concat(pct >= 80 ? "var(--emerald)" : pct >= 60 ? "var(--gold)" : "var(--rose)", ",").concat(pct >= 80 ? "#059669" : pct >= 60 ? "#d97706" : "#e11d48", ")"),
          borderRadius: 4,
          transition: "width 0.5s"
        }
      })));
    })), /*#__PURE__*/React.createElement("div", {
      className: "card"
    }, /*#__PURE__*/React.createElement("div", {
      className: "section-title",
      style: {
        marginBottom: 12
      }
    }, "\uD83D\uDC68\u200D\uD83C\uDFEB Teacher Status \u2014 Today"), _teachers.length === 0 ? /*#__PURE__*/React.createElement("div", {
      className: "empty-state",
      style: {
        padding: 20
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "empty-state-icon"
    }, "\uD83D\uDC65"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: COLORS.textMuted
      }
    }, "No teachers added yet")) : _teachers.map(function (t) {
      var rec = todayAtt.find(function (a) {
        return a.teacherId === t.id;
      });
      var statusColor = !rec ? COLORS.textMuted : rec.status === "Present" ? COLORS.emerald : rec.status === "Late" ? COLORS.gold : COLORS.rose;
      var statusIcon = !rec ? "❓" : rec.status === "Present" ? "✅" : rec.status === "Late" ? "⏰" : "❌";
      return /*#__PURE__*/React.createElement("div", {
        key: t.id,
        style: {
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "8px 0",
          borderBottom: "1px solid var(--border)"
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: 32,
          height: 32,
          borderRadius: "50%",
          flexShrink: 0,
          background: t.avatar ? "transparent" : "linear-gradient(135deg,var(--blue),var(--indigo))",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          fontWeight: 700
        }
      }, t.avatar ? /*#__PURE__*/React.createElement("img", {
        src: t.avatar,
        alt: "",
        style: {
          width: "100%",
          height: "100%",
          objectFit: "cover"
        }
      }) : t.name.split(" ").map(function (n) {
        return n[0];
      }).join("").slice(0, 2)), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontWeight: 600,
          fontSize: 13
        }
      }, t.name), rec && /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 11,
          color: COLORS.textMuted
        }
      }, "In: ", rec.timeIn || "—", " ", rec.timeOut ? "\xB7 Out: ".concat(rec.timeOut) : "")), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 14,
          fontWeight: 700,
          color: statusColor
        }
      }, statusIcon, " ", (rec === null || rec === void 0 ? void 0 : rec.status) || "Not Marked"));
    }))), recentAbsent.length > 0 && /*#__PURE__*/React.createElement("div", {
      className: "card",
      style: {
        marginTop: 20
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "section-title",
      style: {
        marginBottom: 12
      }
    }, "\u26A0\uFE0F Recent Absences"), /*#__PURE__*/React.createElement("div", {
      className: "table-wrapper"
    }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Teacher"), /*#__PURE__*/React.createElement("th", null, "Date"), /*#__PURE__*/React.createElement("th", null, "Note"), /*#__PURE__*/React.createElement("th", null, "Recorded By"))), /*#__PURE__*/React.createElement("tbody", null, recentAbsent.map(function (a) {
      var t = state.users.find(function (u) {
        return u.id === a.teacherId;
      });
      return /*#__PURE__*/React.createElement("tr", {
        key: a.id
      }, /*#__PURE__*/React.createElement("td", {
        style: {
          fontWeight: 600
        }
      }, (t === null || t === void 0 ? void 0 : t.name) || "—"), /*#__PURE__*/React.createElement("td", {
        style: {
          fontSize: 12,
          color: COLORS.textSecondary
        }
      }, a.date), /*#__PURE__*/React.createElement("td", {
        style: {
          fontSize: 12,
          color: COLORS.textMuted
        }
      }, a.note || "—"), /*#__PURE__*/React.createElement("td", {
        style: {
          fontSize: 12,
          color: COLORS.textMuted
        }
      }, a.recordedByName));
    }))))));
  }
  if (currentUser.role === "admin") {
    var statData = [{
      label: "Total Students",
      value: students.length,
      icon: "users",
      color: COLORS.blue,
      bg: "rgba(37,99,235,0.15)"
    }, {
      label: "Total Teachers",
      value: teachers.length,
      icon: "users",
      color: COLORS.gold,
      bg: "rgba(245,158,11,0.15)"
    }, {
      label: "Classes",
      value: state.classes.length,
      icon: "book",
      color: COLORS.emerald,
      bg: "rgba(16,185,129,0.15)"
    }, {
      label: "Subjects",
      value: state.subjects.length,
      icon: "star",
      color: COLORS.rose,
      bg: "rgba(244,63,94,0.15)"
    }];
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", _defineProperty({
      style: {
        marginBottom: 24
      },
      className: "card"
    }, "style", {
      background: "linear-gradient(135deg, rgba(27,58,143,0.5), rgba(37,99,235,0.3))",
      border: "1px solid rgba(37,99,235,0.3)",
      marginBottom: 24,
      padding: "24px 32px",
      display: "flex",
      alignItems: "center",
      gap: 20
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-display)",
        fontSize: 22,
        fontWeight: 800
      }
    }, "Welcome back, Admin \uD83D\uDC4B"), /*#__PURE__*/React.createElement("div", {
      style: {
        color: COLORS.textSecondary,
        marginTop: 4
      }
    }, state.currentTerm, " \xB7 ", state.currentSession, " \xB7", " ", state.institution.name)), /*#__PURE__*/React.createElement("div", {
      style: {
        marginLeft: "auto",
        display: "flex",
        gap: 8
      }
    }, !state.resultPublished ? /*#__PURE__*/React.createElement("button", {
      className: "btn btn-gold",
      onClick: function onClick() {
        updateState({
          resultPublished: true
        });
        showNotification("Results published successfully!");
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 16
    }), " Publish Results") : /*#__PURE__*/React.createElement("span", {
      className: "badge badge-green",
      style: {
        padding: "8px 14px",
        fontSize: 13
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 14
    }), " Results Published"))), /*#__PURE__*/React.createElement("div", {
      className: "stats-grid"
    }, statData.map(function (s) {
      return /*#__PURE__*/React.createElement("div", {
        className: "stat-card",
        key: s.label
      }, /*#__PURE__*/React.createElement("div", {
        className: "stat-card-glow",
        style: {
          background: s.color
        }
      }), /*#__PURE__*/React.createElement("div", {
        className: "stat-card-icon",
        style: {
          background: s.bg,
          color: s.color
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: s.icon,
        size: 22,
        color: s.color
      })), /*#__PURE__*/React.createElement("div", {
        className: "stat-card-value",
        style: {
          color: s.color
        }
      }, s.value), /*#__PURE__*/React.createElement("div", {
        className: "stat-card-label"
      }, s.label));
    })), /*#__PURE__*/React.createElement("div", {
      className: "grid-2"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card"
    }, /*#__PURE__*/React.createElement("div", {
      className: "section-header"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "section-title"
    }, "Recent Announcements")), /*#__PURE__*/React.createElement("span", {
      className: "badge badge-blue"
    }, announcements.length, " new")), announcements.map(function (a) {
      return /*#__PURE__*/React.createElement("div", {
        key: a.id,
        className: "announcement-card ".concat(a.role === "admin" ? "admin-ann" : "")
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontWeight: 600,
          marginBottom: 4
        }
      }, a.title), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 13,
          color: COLORS.textSecondary,
          marginBottom: 6
        }
      }, a.content.slice(0, 80), "..."), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 11,
          color: COLORS.textMuted
        }
      }, a.author, " \xB7 ", a.date));
    })), /*#__PURE__*/React.createElement("div", {
      className: "card"
    }, /*#__PURE__*/React.createElement("div", {
      className: "section-header"
    }, /*#__PURE__*/React.createElement("div", {
      className: "section-title"
    }, "Quick Actions")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 10
      }
    }, [{
      label: "Add New Student",
      icon: "plus",
      color: COLORS.blue,
      action: function action() {}
    }, {
      label: "Add New Teacher",
      icon: "plus",
      color: COLORS.emerald,
      action: function action() {}
    }, {
      label: "Generate PIN Codes",
      icon: "pin",
      color: COLORS.gold,
      action: function action() {}
    }, {
      label: "View Broadsheet",
      icon: "chart",
      color: COLORS.rose,
      action: function action() {}
    }].map(function (q) {
      return /*#__PURE__*/React.createElement("button", {
        key: q.label,
        className: "btn btn-secondary",
        style: {
          justifyContent: "flex-start"
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: q.icon,
        size: 16,
        color: q.color
      }), q.label);
    })), /*#__PURE__*/React.createElement("div", {
      className: "divider"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: COLORS.textMuted,
        marginBottom: 8
      }
    }, "Audit Trail (Recent)"), state.auditTrail.slice(0, 2).map(function (a) {
      return /*#__PURE__*/React.createElement("div", {
        key: a.id,
        style: {
          fontSize: 13,
          padding: "8px 0",
          borderBottom: "1px solid var(--border)"
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: 600
        }
      }, a.userName), " ", /*#__PURE__*/React.createElement("span", {
        style: {
          color: COLORS.textSecondary
        }
      }, a.action, ": ", a.details));
    }))));
  }
  if (currentUser.role === "teacher") {
    var myClasses = state.classes.filter(function (c) {
      return (currentUser.classes || []).includes(c.id);
    });
    var myStudents = students.filter(function (s) {
      return (currentUser.classes || []).includes(s.classId);
    });
    var myScores = state.scores.filter(function (s) {
      return s.enteredBy === currentUser.id;
    });
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "card",
      style: {
        background: "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(27,58,143,0.2))",
        border: "1px solid rgba(16,185,129,0.3)",
        marginBottom: 24
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-display)",
        fontSize: 20,
        fontWeight: 800
      }
    }, "Welcome, ", currentUser.name, " \uD83D\uDC4B"), /*#__PURE__*/React.createElement("div", {
      style: {
        color: COLORS.textSecondary,
        marginTop: 4
      }
    }, myClasses.map(function (c) {
      return c.name;
    }).join(", "), " \xB7", " ", (currentUser.subjects || []).length, " Subjects")), /*#__PURE__*/React.createElement("div", {
      className: "stats-grid"
    }, [{
      label: "My Classes",
      value: myClasses.length,
      color: COLORS.blue
    }, {
      label: "My Students",
      value: myStudents.length,
      color: COLORS.emerald
    }, {
      label: "Scores Entered",
      value: myScores.length,
      color: COLORS.gold
    }].map(function (s) {
      return /*#__PURE__*/React.createElement("div", {
        className: "stat-card",
        key: s.label
      }, /*#__PURE__*/React.createElement("div", {
        className: "stat-card-value",
        style: {
          color: s.color,
          fontSize: 28
        }
      }, s.value), /*#__PURE__*/React.createElement("div", {
        className: "stat-card-label"
      }, s.label));
    })), /*#__PURE__*/React.createElement("div", {
      className: "card"
    }, /*#__PURE__*/React.createElement("div", {
      className: "section-title",
      style: {
        marginBottom: 16
      }
    }, "Recent Announcements"), announcements.slice(0, 3).map(function (a) {
      return /*#__PURE__*/React.createElement("div", {
        key: a.id,
        className: "announcement-card"
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontWeight: 600
        }
      }, a.title), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 13,
          color: COLORS.textSecondary
        }
      }, a.content.slice(0, 100)));
    })));
  }

  // Student / Parent dashboard
  var studentUser = currentUser.role === "parent" ? state.users.find(function (u) {
    return u.id === currentUser.childId;
  }) : currentUser;
  var cls = state.classes.find(function (c) {
    return c.id === (studentUser === null || studentUser === void 0 ? void 0 : studentUser.classId);
  });
  var recentAssignments = (state.assignments || []).filter(function (a) {
    return a.classId === (studentUser === null || studentUser === void 0 ? void 0 : studentUser.classId);
  }).slice(0, 3);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      background: "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(37,99,235,0.15))",
      border: "1px solid rgba(245,158,11,0.2)",
      marginBottom: 24,
      display: "flex",
      alignItems: "center",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 64,
      height: 64,
      borderRadius: "50%",
      flexShrink: 0,
      border: "3px solid rgba(245,158,11,0.4)",
      overflow: "hidden",
      background: studentUser !== null && studentUser !== void 0 && studentUser.avatar ? "transparent" : "linear-gradient(135deg, var(--gold), var(--blue))",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 22
    }
  }, studentUser !== null && studentUser !== void 0 && studentUser.avatar ? /*#__PURE__*/React.createElement("img", {
    src: studentUser.avatar,
    alt: studentUser.name,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }) : (studentUser === null || studentUser === void 0 || (_studentUser$name = studentUser.name) === null || _studentUser$name === void 0 ? void 0 : _studentUser$name.split(" ").map(function (n) {
    return n[0];
  }).join("").slice(0, 2)) || "?"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 20,
      fontWeight: 800
    }
  }, currentUser.role === "parent" ? "Welcome, ".concat(currentUser.name.split(" ")[0], " \uD83D\uDC4B") : "Welcome, ".concat(currentUser.name.split(" ")[0], " \uD83D\uDC4B")), /*#__PURE__*/React.createElement("div", {
    style: {
      color: COLORS.textSecondary,
      marginTop: 4
    }
  }, currentUser.role === "parent" ? "Viewing portal for ".concat(studentUser === null || studentUser === void 0 ? void 0 : studentUser.name, " \xB7 ").concat(cls === null || cls === void 0 ? void 0 : cls.name) : "".concat(cls === null || cls === void 0 ? void 0 : cls.name, " \xB7 ID: ").concat(studentUser === null || studentUser === void 0 ? void 0 : studentUser.studentId)))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "linear-gradient(135deg, rgba(37,99,235,0.15), rgba(27,58,143,0.1))",
      border: "1px solid rgba(37,99,235,0.25)",
      borderRadius: 14,
      padding: "20px 24px",
      display: "flex",
      alignItems: "center",
      gap: 20,
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 52,
      height: 52,
      borderRadius: "50%",
      flexShrink: 0,
      background: "linear-gradient(135deg, var(--blue), var(--indigo))",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 0 24px rgba(37,99,235,0.3)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "book",
    size: 24,
    color: "white"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 15,
      marginBottom: 4
    }
  }, "View Your Academic Results"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: COLORS.textSecondary,
      lineHeight: 1.6
    }
  }, "Use the ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: COLORS.textPrimary
    }
  }, "Result Checker"), " on the login page \u2014 select your class and term to view and download your result sheet.")), /*#__PURE__*/React.createElement("div", {
    style: {
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "badge badge-green",
    style: {
      fontSize: 12,
      padding: "6px 14px"
    }
  }, "\uD83D\uDCCB Open Access"))), /*#__PURE__*/React.createElement("div", {
    className: "grid-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-title",
    style: {
      marginBottom: 12
    }
  }, "School Announcements"), announcements.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "empty-state",
    style: {
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty-state-icon"
  }, "\uD83D\uDCE2"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: COLORS.textMuted
    }
  }, "No announcements yet")) : announcements.map(function (a) {
    return /*#__PURE__*/React.createElement("div", {
      key: a.id,
      className: "announcement-card"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 600,
        fontSize: 14
      }
    }, a.title), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 4
      }
    }, a.content.slice(0, 90)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: COLORS.textMuted,
        marginTop: 6
      }
    }, a.author, " \xB7 ", a.date));
  })), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-title",
    style: {
      marginBottom: 12
    }
  }, "Recent Assignments"), recentAssignments.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "empty-state",
    style: {
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty-state-icon"
  }, "\uD83D\uDCDA"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: COLORS.textMuted
    }
  }, "No assignments yet")) : recentAssignments.map(function (a) {
    var sub = state.subjects.find(function (s) {
      return s.id === a.subjectId;
    });
    var isOverdue = new Date(a.dueDate) < new Date();
    var submitted = (a.submissions || []).some(function (s) {
      return s.studentId === (studentUser === null || studentUser === void 0 ? void 0 : studentUser.id);
    });
    return /*#__PURE__*/React.createElement("div", {
      key: a.id,
      style: {
        padding: "12px 14px",
        marginBottom: 10,
        borderRadius: 10,
        background: "rgba(0,0,0,0.2)",
        border: "1px solid var(--border)",
        borderLeft: "3px solid ".concat(submitted ? COLORS.emerald : isOverdue ? COLORS.rose : COLORS.blue)
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 600,
        fontSize: 14
      }
    }, a.title), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 6,
        marginTop: 6,
        flexWrap: "wrap"
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "badge badge-blue",
      style: {
        fontSize: 11
      }
    }, sub === null || sub === void 0 ? void 0 : sub.name), /*#__PURE__*/React.createElement("span", {
      className: "badge ".concat(isOverdue ? "badge-red" : "badge-green"),
      style: {
        fontSize: 11
      }
    }, "Due: ", new Date(a.dueDate).toLocaleDateString()), submitted && /*#__PURE__*/React.createElement("span", {
      className: "badge badge-green",
      style: {
        fontSize: 11
      }
    }, "\u2705 Submitted")));
  }))));
}

// ─── ANALYTICS PAGE ───────────────────────────────────────────────────────────
function AnalyticsPage(_ref1) {
  var state = _ref1.state,
    currentUser = _ref1.currentUser,
    showNotification = _ref1.showNotification;
  var _useState37 = useState(""),
    _useState38 = _slicedToArray(_useState37, 2),
    aiInsight = _useState38[0],
    setAiInsight = _useState38[1];
  var _useState39 = useState(false),
    _useState40 = _slicedToArray(_useState39, 2),
    loadingAI = _useState40[0],
    setLoadingAI = _useState40[1];
  var students = state.users.filter(function (u) {
    return u.role === "student";
  });
  var classPerformance = state.classes.map(function (cls) {
    var clsStudents = students.filter(function (s) {
      return s.classId === cls.id;
    });
    var clsScores = state.scores.filter(function (s) {
      return s.classId === cls.id && s.session === state.currentSession && s.term === state.currentTerm;
    });
    var avg = clsScores.length > 0 ? clsScores.reduce(function (a, s) {
      return a + (s.ca || 0) + (s.exam || 0);
    }, 0) / clsScores.length : 0;
    return _objectSpread(_objectSpread({}, cls), {}, {
      avg: avg.toFixed(1),
      studentCount: clsStudents.length
    });
  });
  var subjectPerformance = state.subjects.map(function (sub) {
    var subScores = state.scores.filter(function (s) {
      return s.subjectId === sub.id && s.session === state.currentSession && s.term === state.currentTerm;
    });
    var pass = subScores.filter(function (s) {
      return (s.ca || 0) + (s.exam || 0) >= 40;
    }).length;
    var total = subScores.length;
    var passRate = total > 0 ? Math.round(pass / total * 100) : 0;
    var avg = total > 0 ? (subScores.reduce(function (a, s) {
      return a + (s.ca || 0) + (s.exam || 0);
    }, 0) / total).toFixed(1) : 0;
    return _objectSpread(_objectSpread({}, sub), {}, {
      passRate: passRate,
      avg: avg,
      total: total
    });
  });
  var topStudents = students.map(function (st) {
    var sc = state.scores.filter(function (s) {
      return s.studentId === st.id && s.session === state.currentSession && s.term === state.currentTerm;
    });
    var total = sc.reduce(function (a, s) {
      return a + (s.ca || 0) + (s.exam || 0);
    }, 0);
    var avg = sc.length > 0 ? (total / sc.length).toFixed(1) : 0;
    var cls = state.classes.find(function (c) {
      return c.id === st.classId;
    });
    return _objectSpread(_objectSpread({}, st), {}, {
      total: total,
      avg: avg,
      cls: cls
    });
  }).sort(function (a, b) {
    return b.total - a.total;
  }).slice(0, 5);
  var getAIInsights = /*#__PURE__*/function () {
    var _ref10 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
      var _data$content, context, resp, data, _t2;
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.p = _context5.n) {
          case 0:
            setLoadingAI(true);
            _context5.p = 1;
            context = {
              classes: classPerformance,
              subjects: subjectPerformance,
              topStudents: topStudents.map(function (s) {
                var _s$cls;
                return {
                  name: s.name,
                  avg: s.avg,
                  "class": (_s$cls = s.cls) === null || _s$cls === void 0 ? void 0 : _s$cls.name
                };
              }),
              totalStudents: students.length
            };
            _context5.n = 2;
            return fetch("https://api.anthropic.com/v1/messages", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                model: "claude-sonnet-4-20250514",
                max_tokens: 600,
                messages: [{
                  role: "user",
                  content: "You are an academic analytics AI for ".concat(state.institution.name, ". Analyze this data and provide 3-4 specific, actionable insights in plain text (no markdown, just clear sentences). Focus on performance gaps, strengths, and recommendations. Data: ").concat(JSON.stringify(context))
                }]
              })
            });
          case 2:
            resp = _context5.v;
            _context5.n = 3;
            return resp.json();
          case 3:
            data = _context5.v;
            setAiInsight(((_data$content = data.content) === null || _data$content === void 0 || (_data$content = _data$content[0]) === null || _data$content === void 0 ? void 0 : _data$content.text) || "Could not generate insights at this time.");
            _context5.n = 5;
            break;
          case 4:
            _context5.p = 4;
            _t2 = _context5.v;
            setAiInsight("AI insights unavailable. Ensure API key is configured in the environment.");
          case 5:
            setLoadingAI(false);
          case 6:
            return _context5.a(2);
        }
      }, _callee5, null, [[1, 4]]);
    }));
    return function getAIInsights() {
      return _ref10.apply(this, arguments);
    };
  }();
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "grid-2",
    style: {
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-title",
    style: {
      marginBottom: 16
    }
  }, "Class Performance Overview"), classPerformance.map(function (cls) {
    return /*#__PURE__*/React.createElement("div", {
      key: cls.id,
      className: "analysis-bar"
    }, /*#__PURE__*/React.createElement("span", {
      className: "analysis-bar-label",
      style: {
        fontSize: 12,
        minWidth: 60
      }
    }, cls.name), /*#__PURE__*/React.createElement("div", {
      className: "analysis-bar-track"
    }, /*#__PURE__*/React.createElement("div", {
      className: "analysis-bar-fill",
      style: {
        width: "".concat(Math.min(cls.avg, 100), "%"),
        background: "linear-gradient(90deg, ".concat(COLORS.blue, ", ").concat(COLORS.indigo, ")")
      }
    })), /*#__PURE__*/React.createElement("span", {
      className: "analysis-bar-value",
      style: {
        color: COLORS.blueLight
      }
    }, cls.avg));
  })), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-title",
    style: {
      marginBottom: 16
    }
  }, "Top 5 Students"), topStudents.map(function (s, i) {
    var _s$cls2;
    return /*#__PURE__*/React.createElement("div", {
      key: s.id,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "8px 0",
        borderBottom: i < 4 ? "1px solid var(--border)" : "none"
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "position-badge ".concat(i === 0 ? "pos-1" : i === 1 ? "pos-2" : i === 2 ? "pos-3" : "pos-other")
    }, i + 1), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 600,
        fontSize: 14
      }
    }, s.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: COLORS.textSecondary
      }
    }, (_s$cls2 = s.cls) === null || _s$cls2 === void 0 ? void 0 : _s$cls2.name)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        color: COLORS.gold
      }
    }, s.avg));
  }))), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-title"
  }, "Subject Pass/Fail Rates")), /*#__PURE__*/React.createElement("div", {
    className: "table-wrapper"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Subject"), /*#__PURE__*/React.createElement("th", null, "Code"), /*#__PURE__*/React.createElement("th", null, "Students Scored"), /*#__PURE__*/React.createElement("th", null, "Avg Score"), /*#__PURE__*/React.createElement("th", null, "Pass Rate"), /*#__PURE__*/React.createElement("th", null, "Status"))), /*#__PURE__*/React.createElement("tbody", null, subjectPerformance.map(function (s) {
    return /*#__PURE__*/React.createElement("tr", {
      key: s.id
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        fontWeight: 500
      }
    }, s.name), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
      className: "badge badge-blue"
    }, s.code)), /*#__PURE__*/React.createElement("td", null, s.total), /*#__PURE__*/React.createElement("td", null, s.avg), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 80,
        height: 6,
        background: "var(--border)",
        borderRadius: 3
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: "".concat(s.passRate, "%"),
        height: "100%",
        background: s.passRate >= 70 ? COLORS.emerald : s.passRate >= 50 ? COLORS.gold : COLORS.rose,
        borderRadius: 3
      }
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 600
      }
    }, s.passRate, "%"))), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
      className: s.passRate >= 70 ? "badge badge-green" : s.passRate >= 50 ? "badge badge-gold" : "badge badge-red"
    }, s.passRate >= 70 ? "Good" : s.passRate >= 50 ? "Average" : "Needs Attention")));
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-header"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "section-title"
  }, "\uD83E\uDD16 AI-Powered Performance Insights"), /*#__PURE__*/React.createElement("div", {
    className: "section-sub"
  }, "Powered by Claude AI")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: getAIInsights,
    disabled: loadingAI
  }, loadingAI ? /*#__PURE__*/React.createElement("div", {
    className: "spinner"
  }) : /*#__PURE__*/React.createElement(Icon, {
    name: "ai",
    size: 16
  }), loadingAI ? "Analyzing..." : "Generate Insights")), aiInsight && /*#__PURE__*/React.createElement("div", {
    className: "ai-insight"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ai-insight-icon"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "ai",
    size: 18,
    color: "white"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      lineHeight: 1.7,
      color: COLORS.textPrimary
    }
  }, aiInsight)), !aiInsight && !loadingAI && /*#__PURE__*/React.createElement("div", {
    className: "empty-state"
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty-state-icon"
  }, "\uD83E\uDD16"), /*#__PURE__*/React.createElement("div", {
    className: "empty-state-text"
  }, "Click \"Generate Insights\" to get AI analysis"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13
    }
  }, "Identifies patterns, strengths, and areas for improvement"))));
}

// ─── ANNOUNCEMENTS PAGE ───────────────────────────────────────────────────────
function AnnouncementsPage(_ref11) {
  var state = _ref11.state,
    updateState = _ref11.updateState,
    currentUser = _ref11.currentUser,
    showNotification = _ref11.showNotification;
  var _useState41 = useState(false),
    _useState42 = _slicedToArray(_useState41, 2),
    showForm = _useState42[0],
    setShowForm = _useState42[1];
  var _useState43 = useState({
      title: "",
      content: "",
      targetClass: "all"
    }),
    _useState44 = _slicedToArray(_useState43, 2),
    form = _useState44[0],
    setForm = _useState44[1];
  var canPost = currentUser.role === "admin" || currentUser.role === "teacher";
  var visibleAnn = state.announcements.filter(function (a) {
    if (currentUser.role === "admin") return true;
    if (currentUser.role === "teacher") return true;
    if (a.targetClass === "all") return true;
    if (currentUser.classId && a.targetClass === currentUser.classId) return true;
    return false;
  });
  var postAnnouncement = function postAnnouncement() {
    if (!form.title || !form.content) {
      showNotification("Please fill all fields", "error");
      return;
    }
    var newAnn = _objectSpread(_objectSpread({
      id: generateId()
    }, form), {}, {
      author: currentUser.name,
      date: new Date().toISOString().split("T")[0],
      role: currentUser.role
    });
    updateState({
      announcements: [newAnn].concat(_toConsumableArray(state.announcements))
    });
    setForm({
      title: "",
      content: "",
      targetClass: "all"
    });
    setShowForm(false);
    showNotification("Announcement posted!");
  };
  var deleteAnn = function deleteAnn(id) {
    updateState({
      announcements: state.announcements.filter(function (a) {
        return a.id !== id;
      })
    });
    showNotification("Announcement deleted.");
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "section-header"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "section-title"
  }, "Announcements"), /*#__PURE__*/React.createElement("div", {
    className: "section-sub"
  }, visibleAnn.length, " announcements")), canPost && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: function onClick() {
      return setShowForm(!showForm);
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 16
  }), showForm ? "Cancel" : "New Announcement")), showForm && /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-title",
    style: {
      marginBottom: 16
    }
  }, "New Announcement"), /*#__PURE__*/React.createElement("div", {
    className: "grid-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Title"), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    value: form.title,
    onChange: function onChange(e) {
      return setForm(_objectSpread(_objectSpread({}, form), {}, {
        title: e.target.value
      }));
    },
    placeholder: "Announcement title"
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Target Audience"), /*#__PURE__*/React.createElement("select", {
    className: "form-input",
    value: form.targetClass,
    onChange: function onChange(e) {
      return setForm(_objectSpread(_objectSpread({}, form), {}, {
        targetClass: e.target.value
      }));
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: "all"
  }, "Entire School"), state.classes.map(function (c) {
    return /*#__PURE__*/React.createElement("option", {
      key: c.id,
      value: c.id
    }, c.name);
  })))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Message"), /*#__PURE__*/React.createElement("textarea", {
    className: "form-input",
    rows: 4,
    value: form.content,
    onChange: function onChange(e) {
      return setForm(_objectSpread(_objectSpread({}, form), {}, {
        content: e.target.value
      }));
    },
    placeholder: "Write your announcement..."
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: postAnnouncement
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "bell",
    size: 16
  }), " Post Announcement")), visibleAnn.map(function (a) {
    var _state$classes$find2;
    return /*#__PURE__*/React.createElement("div", {
      key: a.id,
      className: "announcement-card ".concat(a.role === "admin" ? "admin-ann" : ""),
      style: {
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "flex-start",
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 700,
        fontSize: 16,
        marginBottom: 6
      }
    }, a.title), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        color: COLORS.textSecondary,
        lineHeight: 1.6
      }
    }, a.content), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 10,
        display: "flex",
        gap: 8,
        alignItems: "center"
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "badge badge-blue"
    }, a.author), /*#__PURE__*/React.createElement("span", {
      className: "badge badge-gray"
    }, a.date), /*#__PURE__*/React.createElement("span", {
      className: "badge badge-gold"
    }, a.targetClass === "all" ? "All School" : ((_state$classes$find2 = state.classes.find(function (c) {
      return c.id === a.targetClass;
    })) === null || _state$classes$find2 === void 0 ? void 0 : _state$classes$find2.name) || a.targetClass))), (currentUser.role === "admin" || a.author === currentUser.name) && /*#__PURE__*/React.createElement("button", {
      className: "btn btn-danger btn-sm btn-icon",
      onClick: function onClick() {
        return deleteAnn(a.id);
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "trash",
      size: 14
    }))));
  }), visibleAnn.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "empty-state card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty-state-icon"
  }, "\uD83D\uDCE2"), /*#__PURE__*/React.createElement("div", {
    className: "empty-state-text"
  }, "No announcements yet")));
}

// ─── STUDENTS PAGE ────────────────────────────────────────────────────────────
function StudentsPage(_ref12) {
  var state = _ref12.state,
    updateState = _ref12.updateState,
    currentUser = _ref12.currentUser,
    showNotification = _ref12.showNotification;
  var _useState45 = useState(""),
    _useState46 = _slicedToArray(_useState45, 2),
    search = _useState46[0],
    setSearch = _useState46[1];
  var _useState47 = useState(""),
    _useState48 = _slicedToArray(_useState47, 2),
    filterClass = _useState48[0],
    setFilterClass = _useState48[1];
  var _useState49 = useState(null),
    _useState50 = _slicedToArray(_useState49, 2),
    modal = _useState50[0],
    setModal = _useState50[1];
  var _useState51 = useState({
      name: "",
      email: "",
      studentId: "",
      classId: "",
      password: "student123",
      avatar: null
    }),
    _useState52 = _slicedToArray(_useState51, 2),
    form = _useState52[0],
    setForm = _useState52[1];
  var fileInputRef = useRef(null);
  var bulkImportRef = useRef(null);

  // Bulk import state
  var _useState53 = useState([]),
    _useState54 = _slicedToArray(_useState53, 2),
    bulkRows = _useState54[0],
    setBulkRows = _useState54[1];
  var _useState55 = useState([]),
    _useState56 = _slicedToArray(_useState55, 2),
    bulkErrors = _useState56[0],
    setBulkErrors = _useState56[1];
  var _useState57 = useState(false),
    _useState58 = _slicedToArray(_useState57, 2),
    bulkDone = _useState58[0],
    setBulkDone = _useState58[1];
  var _useState59 = useState(false),
    _useState60 = _slicedToArray(_useState59, 2),
    showBulk = _useState60[0],
    setShowBulk = _useState60[1];
  var students = state.users.filter(function (u) {
    return u.role === "student";
  }).filter(function (u) {
    var _u$studentId;
    return (!search || u.name.toLowerCase().includes(search.toLowerCase()) || ((_u$studentId = u.studentId) === null || _u$studentId === void 0 ? void 0 : _u$studentId.includes(search))) && (!filterClass || u.classId === filterClass);
  });
  var handleAvatarChange = function handleAvatarChange(e) {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function (ev) {
      return setForm(function (prev) {
        return _objectSpread(_objectSpread({}, prev), {}, {
          avatar: ev.target.result
        });
      });
    };
    reader.readAsDataURL(file);
  };

  // ── Bulk Import Logic ─────────────────────────────────────
  var parseBulkCSV = function parseBulkCSV(text) {
    var allLines = text.trim().split(/\r?\n/);
    var lines = allLines.filter(function (l) {
      return l.trim() && !l.trim().startsWith("#");
    });
    if (lines.length < 2) return {
      rows: [],
      errors: ["File is empty or has no data rows."]
    };
    var headers = lines[0].replace(/^\uFEFF/, "").split(",").map(function (h) {
      return h.trim().replace(/^"|"$/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
    });
    var errors = [];
    var colIdx = {
      name: headers.findIndex(function (h) {
        return ["name", "fullname", "studentname", "student"].includes(h);
      }),
      studentId: headers.findIndex(function (h) {
        return ["regno", "regnum", "studentid", "id", "reg", "admno"].includes(h);
      }),
      "class": headers.findIndex(function (h) {
        return ["class", "classname", "className", "form", "grade"].includes(h);
      }),
      email: headers.findIndex(function (h) {
        return ["email", "emailaddress", "mail"].includes(h);
      }),
      password: headers.findIndex(function (h) {
        return ["password", "pass", "pwd"].includes(h);
      })
    };
    if (colIdx.name === -1) {
      errors.push("Required column 'Name' not found. Make sure your CSV has a Name column.");
      return {
        rows: [],
        errors: errors
      };
    }
    if (colIdx["class"] === -1) errors.push("No 'Class' column found — students will have no class assigned.");
    var existingEmails = new Set(state.users.map(function (u) {
      return u.email.toLowerCase();
    }));
    var existingIds = new Set(state.users.filter(function (u) {
      return u.role === "student";
    }).map(function (u) {
      return (u.studentId || "").toLowerCase();
    }));
    var rows = [];
    var _loop = function _loop() {
        var line = lines[i].trim();
        if (!line) return 0; // continue

        // Parse quoted CSV fields
        var cols = [];
        var cur = "",
          inQuote = false;
        for (var ci = 0; ci < line.length; ci++) {
          var ch = line[ci];
          if (ch === '"') {
            inQuote = !inQuote;
          } else if (ch === "," && !inQuote) {
            cols.push(cur.trim());
            cur = "";
          } else {
            cur += ch;
          }
        }
        cols.push(cur.trim());
        var rawName = (colIdx.name >= 0 ? cols[colIdx.name] : "").replace(/^"|"$/g, "").trim();
        var rawStudentId = (colIdx.studentId >= 0 ? cols[colIdx.studentId] : "").replace(/^"|"$/g, "").trim();
        var rawClass = (colIdx["class"] >= 0 ? cols[colIdx["class"]] : "").replace(/^"|"$/g, "").trim();
        var rawEmail = (colIdx.email >= 0 ? cols[colIdx.email] : "").replace(/^"|"$/g, "").trim();
        var rawPassword = (colIdx.password >= 0 ? cols[colIdx.password] : "").replace(/^"|"$/g, "").trim();
        if (!rawName) return 0; // continue

        // Match class by name (case-insensitive partial match)
        var matchedClass = rawClass ? state.classes.find(function (c) {
          return c.name.toLowerCase() === rawClass.toLowerCase() || c.name.toLowerCase().includes(rawClass.toLowerCase()) || rawClass.toLowerCase().includes(c.name.toLowerCase());
        }) : null;

        // Generate email if not provided
        var genEmail = rawEmail || "".concat(rawName.toLowerCase().replace(/\s+/g, ".").replace(/[^a-z0-9.]/g, "")).concat(Math.floor(Math.random() * 900) + 100, "@student.school");

        // Check for duplicates
        var dupEmail = existingEmails.has(genEmail.toLowerCase());
        var dupId = rawStudentId && existingIds.has(rawStudentId.toLowerCase());
        rows.push({
          rowNum: i + 1,
          name: rawName,
          studentId: rawStudentId,
          classRaw: rawClass,
          classId: (matchedClass === null || matchedClass === void 0 ? void 0 : matchedClass.id) || null,
          className: (matchedClass === null || matchedClass === void 0 ? void 0 : matchedClass.name) || (rawClass ? "\"".concat(rawClass, "\" not found") : "No class"),
          email: genEmail,
          password: rawPassword || "student123",
          dupEmail: dupEmail,
          dupId: dupId,
          valid: !!rawName && !dupEmail && !dupId,
          classFound: !!matchedClass || !rawClass
        });
      },
      _ret;
    for (var i = 1; i < lines.length; i++) {
      _ret = _loop();
      if (_ret === 0) continue;
    }
    var invalid = rows.filter(function (r) {
      return !r.valid;
    }).length;
    var noClass = rows.filter(function (r) {
      return function (rawClass) {
        return !r.classFound;
      };
    }).length;
    if (invalid > 0) errors.push("".concat(invalid, " row(s) have issues (duplicate email or ID) and will be skipped."));
    return {
      rows: rows,
      errors: errors
    };
  };
  var processBulkFile = function processBulkFile(file) {
    if (!file) return;
    setBulkRows([]);
    setBulkErrors([]);
    setBulkDone(false);
    var reader = new FileReader();
    reader.onload = function (ev) {
      var _parseBulkCSV = parseBulkCSV(ev.target.result),
        rows = _parseBulkCSV.rows,
        errors = _parseBulkCSV.errors;
      setBulkRows(rows);
      setBulkErrors(errors);
    };
    reader.onerror = function () {
      return setBulkErrors(["Could not read file. Please try again."]);
    };
    reader.readAsText(file);
  };
  var confirmBulkImport = function confirmBulkImport() {
    var valid = bulkRows.filter(function (r) {
      return r.valid;
    });
    if (valid.length === 0) {
      showNotification("No valid students to import.", "error");
      return;
    }
    var newUsers = _toConsumableArray(state.users);
    var newAudit = _toConsumableArray(state.auditTrail);
    valid.forEach(function (row) {
      newUsers.push({
        id: generateId(),
        role: "student",
        name: row.name,
        email: row.email,
        password: row.password,
        studentId: row.studentId || "STD".concat(String(newUsers.filter(function (u) {
          return u.role === "student";
        }).length + 1).padStart(3, "0")),
        classId: row.classId || null,
        avatar: null
      });
    });
    newAudit.unshift({
      id: generateId(),
      userId: currentUser.id,
      userName: currentUser.name,
      action: "Bulk Student Import",
      details: "Imported ".concat(valid.length, " students via CSV"),
      timestamp: new Date().toISOString()
    });
    updateState({
      users: newUsers,
      auditTrail: newAudit
    });
    setBulkDone(true);
    setBulkRows([]);
    showNotification("\u2705 ".concat(valid.length, " students imported successfully!"));
  };
  var downloadStudentTemplate = function downloadStudentTemplate() {
    var csv = ["Name,RegNo,Class,Email,Password", "Chioma Eze,STD001,JSS 1,chioma@school.com,student123", "Emeka Obi,STD002,JSS 1,emeka@school.com,student123", "Fatima Bello,STD003,SSS 1,fatima@school.com,student123"].join("\r\n");
    var blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;"
    });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "sarms-students-template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification("Template downloaded! Fill it in Excel and upload.");
  };
  var saveStudent = function saveStudent() {
    if (!form.name || !form.email || !form.studentId || !form.classId) {
      showNotification("Fill all required fields", "error");
      return;
    }
    if (modal === "add") {
      var newStudent = _objectSpread({
        id: generateId(),
        role: "student",
        pin: "PIN".concat(Date.now().toString().slice(-3)),
        pinUsed: 0
      }, form);
      updateState({
        users: [].concat(_toConsumableArray(state.users), [newStudent]),
        pinCodes: [].concat(_toConsumableArray(state.pinCodes), [{
          code: newStudent.pin,
          studentId: newStudent.id,
          usedCount: 0
        }]),
        auditTrail: [{
          id: generateId(),
          userId: currentUser.id,
          userName: currentUser.name,
          action: "Student Added",
          details: "Added ".concat(form.name, " (").concat(form.studentId, ")"),
          timestamp: new Date().toISOString()
        }].concat(_toConsumableArray(state.auditTrail))
      });
      showNotification("Student added successfully!");
    } else if ((modal === null || modal === void 0 ? void 0 : modal.type) === "edit") {
      updateState({
        users: state.users.map(function (u) {
          return u.id === modal.id ? _objectSpread(_objectSpread({}, u), form) : u;
        })
      });
      showNotification("Student updated!");
    }
    setModal(null);
    setForm({
      name: "",
      email: "",
      studentId: "",
      classId: "",
      password: "student123",
      avatar: null
    });
  };
  var deleteStudent = function deleteStudent(id) {
    updateState({
      users: state.users.filter(function (u) {
        return u.id !== id;
      })
    });
    showNotification("Student removed.");
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "section-header"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "section-title"
  }, "Students"), /*#__PURE__*/React.createElement("div", {
    className: "section-sub"
  }, students.length, " students found")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary",
    onClick: function onClick() {
      setShowBulk(!showBulk);
      setBulkRows([]);
      setBulkErrors([]);
      setBulkDone(false);
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "upload",
    size: 16
  }), " Bulk Import"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: function onClick() {
      return setModal("add");
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 16
  }), " Add Student"))), showBulk && /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      marginBottom: 20,
      border: "1px solid rgba(37,99,235,0.3)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 16,
      color: COLORS.blueLight
    }
  }, "\uD83D\uDCC2 Bulk Student Import"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-sm",
    onClick: function onClick() {
      setShowBulk(false);
      setBulkRows([]);
      setBulkErrors([]);
      setBulkDone(false);
    }
  }, "\u2715 Close")), !bulkRows.length && !bulkDone && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: COLORS.textSecondary,
      lineHeight: 1.7,
      marginBottom: 12
    }
  }, "Import many students at once from a CSV file (Excel or Google Sheets). The CSV must have at minimum a ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: COLORS.textPrimary
    }
  }, "Name"), " column. Optional columns: ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: COLORS.textPrimary
    }
  }, "RegNo, Class, Email, Password"), "."), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px 14px",
      background: "rgba(0,0,0,0.2)",
      borderRadius: 8,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: COLORS.textMuted,
      marginBottom: 6,
      textTransform: "uppercase",
      letterSpacing: "0.06em"
    }
  }, "Expected CSV Format"), /*#__PURE__*/React.createElement("code", {
    style: {
      fontSize: 12,
      color: COLORS.blueLight,
      lineHeight: 1.9
    }
  }, "Name,RegNo,Class,Email,Password", /*#__PURE__*/React.createElement("br", null), "Chioma Eze,STD001,JSS 1,chioma@school.com,student123", /*#__PURE__*/React.createElement("br", null), "Emeka Obi,STD002,JSS 1,,")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-sm",
    onClick: downloadStudentTemplate
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "download",
    size: 14
  }), " Download Template")), /*#__PURE__*/React.createElement("div", {
    style: {
      border: "2px dashed ".concat(COLORS.blue),
      borderRadius: 12,
      padding: "28px 20px",
      textAlign: "center",
      cursor: "pointer",
      background: "rgba(37,99,235,0.05)"
    },
    onClick: function onClick() {
      var _bulkImportRef$curren;
      return (_bulkImportRef$curren = bulkImportRef.current) === null || _bulkImportRef$curren === void 0 ? void 0 : _bulkImportRef$curren.click();
    },
    onDragOver: function onDragOver(e) {
      return e.preventDefault();
    },
    onDrop: function onDrop(e) {
      var _e$dataTransfer$files;
      e.preventDefault();
      processBulkFile((_e$dataTransfer$files = e.dataTransfer.files) === null || _e$dataTransfer$files === void 0 ? void 0 : _e$dataTransfer$files[0]);
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 36,
      marginBottom: 8
    }
  }, "\uD83D\uDCC2"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      marginBottom: 4
    }
  }, "Click to upload or drag & drop"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: COLORS.textSecondary
    }
  }, "CSV files only (.csv)"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "btn btn-primary btn-sm"
  }, "Browse File"))), /*#__PURE__*/React.createElement("input", {
    type: "file",
    ref: bulkImportRef,
    accept: ".csv,text/csv",
    style: {
      display: "none"
    },
    onChange: function onChange(e) {
      var _e$target$files;
      processBulkFile((_e$target$files = e.target.files) === null || _e$target$files === void 0 ? void 0 : _e$target$files[0]);
      setTimeout(function () {
        if (bulkImportRef.current) bulkImportRef.current.value = "";
      }, 100);
    }
  })), bulkErrors.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14,
      padding: "10px 14px",
      background: "rgba(245,158,11,0.08)",
      border: "1px solid rgba(245,158,11,0.3)",
      borderRadius: 8
    }
  }, bulkErrors.map(function (e, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        fontSize: 13,
        color: COLORS.gold
      }
    }, "\u26A0\uFE0F ", e);
  })), bulkRows.length > 0 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "section-header",
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 14
    }
  }, "Preview \u2014 ", bulkRows.filter(function (r) {
    return r.valid;
  }).length, " of ", bulkRows.length, " students ready to import"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: COLORS.textSecondary,
      marginTop: 2
    }
  }, "Only \u2705 Valid rows will be imported. \u274C rows are skipped.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-sm",
    onClick: function onClick() {
      setBulkRows([]);
      setBulkErrors([]);
    }
  }, "\u2190 Upload Different File"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: confirmBulkImport,
    disabled: bulkRows.filter(function (r) {
      return r.valid;
    }).length === 0
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 16
  }), " Import ", bulkRows.filter(function (r) {
    return r.valid;
  }).length, " Students"))), /*#__PURE__*/React.createElement("div", {
    className: "table-wrapper"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", null, "Name"), /*#__PURE__*/React.createElement("th", null, "Reg No"), /*#__PURE__*/React.createElement("th", null, "Class"), /*#__PURE__*/React.createElement("th", null, "Email"), /*#__PURE__*/React.createElement("th", null, "Password"), /*#__PURE__*/React.createElement("th", null, "Issue"))), /*#__PURE__*/React.createElement("tbody", null, bulkRows.map(function (row, i) {
    return /*#__PURE__*/React.createElement("tr", {
      key: i,
      style: {
        opacity: row.valid ? 1 : 0.55
      }
    }, /*#__PURE__*/React.createElement("td", null, row.valid ? /*#__PURE__*/React.createElement("span", {
      className: "badge badge-green",
      style: {
        fontSize: 11
      }
    }, "\u2705 Valid") : /*#__PURE__*/React.createElement("span", {
      className: "badge badge-red",
      style: {
        fontSize: 11
      }
    }, "\u274C Skip")), /*#__PURE__*/React.createElement("td", {
      style: {
        fontWeight: 600
      }
    }, row.name), /*#__PURE__*/React.createElement("td", {
      style: {
        fontFamily: "monospace",
        fontSize: 12
      }
    }, row.studentId || /*#__PURE__*/React.createElement("span", {
      style: {
        color: COLORS.textMuted
      }
    }, "auto")), /*#__PURE__*/React.createElement("td", null, row.classId ? /*#__PURE__*/React.createElement("span", {
      className: "badge badge-blue",
      style: {
        fontSize: 11
      }
    }, row.className) : /*#__PURE__*/React.createElement("span", {
      style: {
        color: row.classRaw ? COLORS.rose : COLORS.textMuted,
        fontSize: 12
      }
    }, row.classRaw ? "\"".concat(row.classRaw, "\" not found") : "None")), /*#__PURE__*/React.createElement("td", {
      style: {
        fontSize: 12,
        color: COLORS.textSecondary
      }
    }, row.email), /*#__PURE__*/React.createElement("td", {
      style: {
        fontSize: 12,
        color: COLORS.textMuted
      }
    }, row.password), /*#__PURE__*/React.createElement("td", {
      style: {
        fontSize: 12,
        color: COLORS.rose
      }
    }, row.dupEmail && "Email already exists. ", row.dupId && "Reg No already exists. ", !row.dupEmail && !row.dupId && row.valid && "—"));
  }))))), bulkDone && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "28px 20px",
      border: "1px solid rgba(16,185,129,0.3)",
      background: "rgba(16,185,129,0.08)",
      borderRadius: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 40,
      marginBottom: 8
    }
  }, "\u2705"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 18,
      color: COLORS.emerald,
      marginBottom: 6
    }
  }, "Import Successful!"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: COLORS.textSecondary,
      marginBottom: 14
    }
  }, "Students have been added. You can now assign them to classes and enter their scores."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    onClick: function onClick() {
      setBulkDone(false);
      setShowBulk(false);
    }
  }, "Done"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-sm",
    onClick: function onClick() {
      setBulkDone(false);
      setBulkRows([]);
      setBulkErrors([]);
    }
  }, "Import More")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      marginBottom: 16,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "search-bar",
    style: {
      flex: 1,
      minWidth: 200
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 16,
    color: COLORS.textMuted
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Search by name or ID...",
    value: search,
    onChange: function onChange(e) {
      return setSearch(e.target.value);
    }
  })), /*#__PURE__*/React.createElement("select", {
    className: "form-input",
    style: {
      width: 160
    },
    value: filterClass,
    onChange: function onChange(e) {
      return setFilterClass(e.target.value);
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "All Classes"), state.classes.map(function (c) {
    return /*#__PURE__*/React.createElement("option", {
      key: c.id,
      value: c.id
    }, c.name);
  }))), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "table-wrapper"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Photo"), /*#__PURE__*/React.createElement("th", null, "Student ID"), /*#__PURE__*/React.createElement("th", null, "Name"), /*#__PURE__*/React.createElement("th", null, "Class"), /*#__PURE__*/React.createElement("th", null, "Email"), /*#__PURE__*/React.createElement("th", null, "PIN"), /*#__PURE__*/React.createElement("th", null, "PIN Used"), /*#__PURE__*/React.createElement("th", null, "Actions"))), /*#__PURE__*/React.createElement("tbody", null, students.map(function (s) {
    var cls = state.classes.find(function (c) {
      return c.id === s.classId;
    });
    var pinRec = state.pinCodes.find(function (p) {
      return p.studentId === s.id;
    });
    return /*#__PURE__*/React.createElement("tr", {
      key: s.id
    }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 36,
        height: 36,
        borderRadius: "50%",
        background: s.avatar ? "transparent" : "linear-gradient(135deg, var(--blue), var(--indigo))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        flexShrink: 0,
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 13
      }
    }, s.avatar ? /*#__PURE__*/React.createElement("img", {
      src: s.avatar,
      alt: s.name,
      style: {
        width: "100%",
        height: "100%",
        objectFit: "cover"
      }
    }) : s.name.split(" ").map(function (n) {
      return n[0];
    }).join("").slice(0, 2))), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
      className: "badge badge-blue"
    }, s.studentId)), /*#__PURE__*/React.createElement("td", {
      style: {
        fontWeight: 500
      }
    }, s.name), /*#__PURE__*/React.createElement("td", null, (cls === null || cls === void 0 ? void 0 : cls.name) || "—"), /*#__PURE__*/React.createElement("td", {
      style: {
        color: COLORS.textSecondary
      }
    }, s.email), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
      className: "badge badge-gold"
    }, s.pin)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 2
      }
    }, [0, 1, 2].map(function (i) {
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: i < ((pinRec === null || pinRec === void 0 ? void 0 : pinRec.usedCount) || 0) ? COLORS.rose : COLORS.border
        }
      });
    }))), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-secondary btn-sm btn-icon",
      onClick: function onClick() {
        setForm({
          name: s.name,
          email: s.email,
          studentId: s.studentId,
          classId: s.classId,
          password: s.password,
          avatar: s.avatar || null
        });
        setModal({
          type: "edit",
          id: s.id
        });
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "edit",
      size: 14
    })), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-danger btn-sm btn-icon",
      onClick: function onClick() {
        return deleteStudent(s.id);
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "trash",
      size: 14
    })))));
  }))), students.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "empty-state"
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty-state-icon"
  }, "\uD83D\uDC65"), /*#__PURE__*/React.createElement("div", {
    className: "empty-state-text"
  }, "No students found")))), (modal === "add" || (modal === null || modal === void 0 ? void 0 : modal.type) === "edit") && /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay",
    onClick: function onClick() {
      return setModal(null);
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal",
    onClick: function onClick(e) {
      return e.stopPropagation();
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-title"
  }, modal === "add" ? "Add New Student" : "Edit Student"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-sm btn-icon",
    onClick: function onClick() {
      return setModal(null);
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "close",
    size: 16
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 16,
      marginBottom: 20,
      padding: "16px",
      background: "rgba(0,0,0,0.2)",
      borderRadius: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 72,
      height: 72,
      borderRadius: "50%",
      background: form.avatar ? "transparent" : "linear-gradient(135deg, var(--blue), var(--indigo))",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      flexShrink: 0,
      border: "2px solid var(--border)",
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 22
    }
  }, form.avatar ? /*#__PURE__*/React.createElement("img", {
    src: form.avatar,
    alt: "Preview",
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }) : form.name ? form.name.split(" ").map(function (n) {
    return n[0];
  }).join("").slice(0, 2) : "?"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      marginBottom: 4
    }
  }, "Profile Photo"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: COLORS.textSecondary,
      marginBottom: 8
    }
  }, "Upload a passport-style photo (JPG, PNG)"), /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: "image/*",
    ref: fileInputRef,
    style: {
      display: "none"
    },
    onChange: handleAvatarChange
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-sm",
    onClick: function onClick() {
      var _fileInputRef$current;
      return (_fileInputRef$current = fileInputRef.current) === null || _fileInputRef$current === void 0 ? void 0 : _fileInputRef$current.click();
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "upload",
    size: 14
  }), " Upload Photo"), form.avatar && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-danger btn-sm",
    onClick: function onClick() {
      return setForm(function (p) {
        return _objectSpread(_objectSpread({}, p), {}, {
          avatar: null
        });
      });
    }
  }, "Remove")))), /*#__PURE__*/React.createElement("div", {
    className: "grid-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Full Name *"), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    value: form.name,
    onChange: function onChange(e) {
      return setForm(_objectSpread(_objectSpread({}, form), {}, {
        name: e.target.value
      }));
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Student ID *"), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    value: form.studentId,
    onChange: function onChange(e) {
      return setForm(_objectSpread(_objectSpread({}, form), {}, {
        studentId: e.target.value
      }));
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Email *"), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    type: "email",
    value: form.email,
    onChange: function onChange(e) {
      return setForm(_objectSpread(_objectSpread({}, form), {}, {
        email: e.target.value
      }));
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Class *"), /*#__PURE__*/React.createElement("select", {
    className: "form-input",
    value: form.classId,
    onChange: function onChange(e) {
      return setForm(_objectSpread(_objectSpread({}, form), {}, {
        classId: e.target.value
      }));
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "\u2014 Select \u2014"), state.classes.map(function (c) {
    return /*#__PURE__*/React.createElement("option", {
      key: c.id,
      value: c.id
    }, c.name);
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      justifyContent: "flex-end",
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary",
    onClick: function onClick() {
      return setModal(null);
    }
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: saveStudent
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 16
  }), " ", modal === "add" ? "Add Student" : "Save Changes")))));
}

// ─── TEACHERS PAGE ────────────────────────────────────────────────────────────
function TeachersPage(_ref13) {
  var state = _ref13.state,
    updateState = _ref13.updateState,
    currentUser = _ref13.currentUser,
    showNotification = _ref13.showNotification;
  var _useState61 = useState("teachers"),
    _useState62 = _slicedToArray(_useState61, 2),
    tab = _useState62[0],
    setTab = _useState62[1];
  var _useState63 = useState(null),
    _useState64 = _slicedToArray(_useState63, 2),
    modal = _useState64[0],
    setModal = _useState64[1];
  var _useState65 = useState({
      name: "",
      email: "",
      subjects: [],
      classes: [],
      password: "teacher123"
    }),
    _useState66 = _slicedToArray(_useState65, 2),
    form = _useState66[0],
    setForm = _useState66[1];
  var _useState67 = useState(null),
    _useState68 = _slicedToArray(_useState67, 2),
    bursarModal = _useState68[0],
    setBursarModal = _useState68[1];
  var _useState69 = useState({
      name: "",
      email: "",
      password: "bursar123"
    }),
    _useState70 = _slicedToArray(_useState69, 2),
    bursarForm = _useState70[0],
    setBursarForm = _useState70[1];
  var teachers = state.users.filter(function (u) {
    return u.role === "teacher";
  });
  var bursars = state.users.filter(function (u) {
    return u.role === "bursar";
  });
  var saveTeacher = function saveTeacher() {
    if (!form.name || !form.email) {
      showNotification("Fill required fields", "error");
      return;
    }
    if (modal === "add") {
      updateState({
        users: [].concat(_toConsumableArray(state.users), [_objectSpread({
          id: generateId(),
          role: "teacher"
        }, form)])
      });
      showNotification("Teacher added!");
    } else if ((modal === null || modal === void 0 ? void 0 : modal.type) === "edit") {
      updateState({
        users: state.users.map(function (u) {
          return u.id === modal.id ? _objectSpread(_objectSpread({}, u), form) : u;
        })
      });
      showNotification("Teacher updated!");
    }
    setModal(null);
    setForm({
      name: "",
      email: "",
      subjects: [],
      classes: [],
      password: "teacher123"
    });
  };
  var saveBursar = function saveBursar() {
    var role = bursarModal === "add-principal" || (bursarModal === null || bursarModal === void 0 ? void 0 : bursarModal.type) === "edit-principal" ? "principal" : "bursar";
    if (!bursarForm.name || !bursarForm.email) {
      showNotification("Fill name and email", "error");
      return;
    }
    var exists = state.users.find(function (u) {
      return u.email.toLowerCase() === bursarForm.email.toLowerCase();
    });
    if (exists && (bursarModal === "add" || bursarModal === "add-principal")) {
      showNotification("Email already exists", "error");
      return;
    }
    if (bursarModal === "add" || bursarModal === "add-principal") {
      updateState({
        users: [].concat(_toConsumableArray(state.users), [_objectSpread({
          id: generateId(),
          role: role,
          avatar: null
        }, bursarForm)])
      });
      showNotification("".concat(role.charAt(0).toUpperCase() + role.slice(1), " account created!"));
    } else {
      updateState({
        users: state.users.map(function (u) {
          return u.id === (bursarModal === null || bursarModal === void 0 ? void 0 : bursarModal.id) ? _objectSpread(_objectSpread({}, u), bursarForm) : u;
        })
      });
      showNotification("Account updated!");
    }
    setBursarModal(null);
    setBursarForm({
      name: "",
      email: "",
      password: "bursar123"
    });
  };
  var deleteUser = function deleteUser(id, role) {
    if (!window.confirm("Delete this ".concat(role, "? This cannot be undone."))) return;
    updateState({
      users: state.users.filter(function (u) {
        return u.id !== id;
      })
    });
    showNotification("".concat(role.charAt(0).toUpperCase() + role.slice(1), " deleted."));
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "section-header"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "section-title"
  }, "Staff Management"), /*#__PURE__*/React.createElement("div", {
    className: "section-sub"
  }, teachers.length, " teachers \xB7 ", bursars.length, " bursars")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: function onClick() {
      return tab === "bursars" ? setBursarModal("add") : tab === "principals" ? setBursarModal("add-principal") : setModal("add");
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 16
  }), " Add ", tab === "bursars" ? "Bursar" : tab === "principals" ? "Principal" : "Teacher")), /*#__PURE__*/React.createElement("div", {
    className: "tabs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tab ".concat(tab === "teachers" ? "active" : ""),
    onClick: function onClick() {
      return setTab("teachers");
    }
  }, "\uD83D\uDC68\u200D\uD83C\uDFEB Teachers (", teachers.length, ")"), /*#__PURE__*/React.createElement("div", {
    className: "tab ".concat(tab === "bursars" ? "active" : ""),
    onClick: function onClick() {
      return setTab("bursars");
    }
  }, "\uD83D\uDCB3 Bursars (", bursars.length, ")"), /*#__PURE__*/React.createElement("div", {
    className: "tab ".concat(tab === "principals" ? "active" : ""),
    onClick: function onClick() {
      return setTab("principals");
    }
  }, "\uD83C\uDF93 Principals (", state.users.filter(function (u) {
    return u.role === "principal";
  }).length, ")")), tab === "teachers" && /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "table-wrapper"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Name"), /*#__PURE__*/React.createElement("th", null, "Email"), /*#__PURE__*/React.createElement("th", null, "Subjects"), /*#__PURE__*/React.createElement("th", null, "Classes"), /*#__PURE__*/React.createElement("th", null, "Actions"))), /*#__PURE__*/React.createElement("tbody", null, teachers.map(function (t) {
    return /*#__PURE__*/React.createElement("tr", {
      key: t.id
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        fontWeight: 500
      }
    }, t.name), /*#__PURE__*/React.createElement("td", {
      style: {
        color: COLORS.textSecondary
      }
    }, t.email), /*#__PURE__*/React.createElement("td", null, (t.subjects || []).map(function (sid) {
      var sub = state.subjects.find(function (s) {
        return s.id === sid;
      });
      return sub ? /*#__PURE__*/React.createElement("span", {
        key: sid,
        className: "badge badge-blue",
        style: {
          marginRight: 4
        }
      }, sub.code) : null;
    })), /*#__PURE__*/React.createElement("td", null, (t.classes || []).map(function (cid) {
      var cls = state.classes.find(function (c) {
        return c.id === cid;
      });
      return cls ? /*#__PURE__*/React.createElement("span", {
        key: cid,
        className: "badge badge-green",
        style: {
          marginRight: 4
        }
      }, cls.name) : null;
    })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-secondary btn-sm btn-icon",
      onClick: function onClick() {
        setForm({
          name: t.name,
          email: t.email,
          subjects: t.subjects || [],
          classes: t.classes || [],
          password: t.password
        });
        setModal({
          type: "edit",
          id: t.id
        });
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "edit",
      size: 14
    })), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-danger btn-sm btn-icon",
      onClick: function onClick() {
        return updateState({
          users: state.users.filter(function (u) {
            return u.id !== t.id;
          })
        });
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "trash",
      size: 14
    })))));
  }))))), (modal === "add" || (modal === null || modal === void 0 ? void 0 : modal.type) === "edit") && /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay",
    onClick: function onClick() {
      return setModal(null);
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal",
    onClick: function onClick(e) {
      return e.stopPropagation();
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-title"
  }, modal === "add" ? "Add Teacher" : "Edit Teacher"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-sm btn-icon",
    onClick: function onClick() {
      return setModal(null);
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "close",
    size: 16
  }))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Full Name"), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    value: form.name,
    onChange: function onChange(e) {
      return setForm(_objectSpread(_objectSpread({}, form), {}, {
        name: e.target.value
      }));
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Email"), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    type: "email",
    value: form.email,
    onChange: function onChange(e) {
      return setForm(_objectSpread(_objectSpread({}, form), {}, {
        email: e.target.value
      }));
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Subjects (hold Ctrl for multi-select)"), /*#__PURE__*/React.createElement("select", {
    className: "form-input",
    multiple: true,
    size: 4,
    value: form.subjects,
    onChange: function onChange(e) {
      return setForm(_objectSpread(_objectSpread({}, form), {}, {
        subjects: Array.from(e.target.selectedOptions).map(function (o) {
          return o.value;
        })
      }));
    }
  }, state.subjects.map(function (s) {
    return /*#__PURE__*/React.createElement("option", {
      key: s.id,
      value: s.id
    }, s.name);
  }))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Classes"), /*#__PURE__*/React.createElement("select", {
    className: "form-input",
    multiple: true,
    size: 4,
    value: form.classes,
    onChange: function onChange(e) {
      return setForm(_objectSpread(_objectSpread({}, form), {}, {
        classes: Array.from(e.target.selectedOptions).map(function (o) {
          return o.value;
        })
      }));
    }
  }, state.classes.map(function (c) {
    return /*#__PURE__*/React.createElement("option", {
      key: c.id,
      value: c.id
    }, c.name);
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      justifyContent: "flex-end"
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary",
    onClick: function onClick() {
      return setModal(null);
    }
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: saveTeacher
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 16
  }), " Save")))), tab === "bursars" && /*#__PURE__*/React.createElement("div", null, bursars.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty-state"
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty-state-icon"
  }, "\uD83D\uDCB3"), /*#__PURE__*/React.createElement("div", {
    className: "empty-state-text"
  }, "No bursar accounts yet"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: COLORS.textSecondary,
      marginBottom: 12
    }
  }, "Create a bursar account so the school bursar can log in and manage payments independently."), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    onClick: function onClick() {
      return setBursarModal("add");
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 14
  }), " Create Bursar Account"))) : /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "table-wrapper"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Name"), /*#__PURE__*/React.createElement("th", null, "Email"), /*#__PURE__*/React.createElement("th", null, "Password"), /*#__PURE__*/React.createElement("th", null, "Actions"))), /*#__PURE__*/React.createElement("tbody", null, bursars.map(function (b) {
    return /*#__PURE__*/React.createElement("tr", {
      key: b.id
    }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 34,
        height: 34,
        borderRadius: "50%",
        flexShrink: 0,
        background: "linear-gradient(135deg,var(--emerald),var(--blue))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 13,
        fontWeight: 700
      }
    }, b.name.split(" ").map(function (n) {
      return n[0];
    }).join("").slice(0, 2)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 600
      }
    }, b.name), /*#__PURE__*/React.createElement("span", {
      className: "badge badge-green",
      style: {
        fontSize: 10
      }
    }, "Bursar")))), /*#__PURE__*/React.createElement("td", {
      style: {
        fontSize: 13
      }
    }, b.email), /*#__PURE__*/React.createElement("td", {
      style: {
        fontFamily: "monospace",
        fontSize: 12,
        color: COLORS.textMuted
      }
    }, b.password), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-secondary btn-sm",
      onClick: function onClick() {
        setBursarForm({
          name: b.name,
          email: b.email,
          password: b.password
        });
        setBursarModal({
          type: "edit",
          id: b.id
        });
      }
    }, "Edit"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-danger btn-sm",
      onClick: function onClick() {
        return deleteUser(b.id, "bursar");
      }
    }, "Delete"))));
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      marginTop: 16,
      background: "rgba(37,99,235,0.06)",
      border: "1px solid rgba(37,99,235,0.2)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      marginBottom: 8,
      color: COLORS.blueLight
    }
  }, "\uD83D\uDCA1 About Bursar Accounts"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: COLORS.textSecondary,
      lineHeight: 1.7
    }
  }, "A bursar logs in with their own email and password. They have access to:", /*#__PURE__*/React.createElement("br", null), "\u2705 Payment Dashboard \u2014 view all collections", /*#__PURE__*/React.createElement("br", null), "\u2705 Record new student payments", /*#__PURE__*/React.createElement("br", null), "\u2705 Confirm payments and print receipts", /*#__PURE__*/React.createElement("br", null), "\u274C Cannot access scores, results, or settings"))), tab === "principals" && /*#__PURE__*/React.createElement("div", null, state.users.filter(function (u) {
    return u.role === "principal";
  }).length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty-state"
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty-state-icon"
  }, "\uD83C\uDF93"), /*#__PURE__*/React.createElement("div", {
    className: "empty-state-text"
  }, "No principal account yet"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: COLORS.textSecondary,
      marginBottom: 12,
      textAlign: "center"
    }
  }, "Create a principal account so the principal can monitor staff attendance and view school analytics."), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    onClick: function onClick() {
      return setBursarModal("add-principal");
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 14
  }), " Create Principal Account"))) : /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "table-wrapper"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Name"), /*#__PURE__*/React.createElement("th", null, "Email"), /*#__PURE__*/React.createElement("th", null, "Password"), /*#__PURE__*/React.createElement("th", null, "Actions"))), /*#__PURE__*/React.createElement("tbody", null, state.users.filter(function (u) {
    return u.role === "principal";
  }).map(function (p) {
    return /*#__PURE__*/React.createElement("tr", {
      key: p.id
    }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 34,
        height: 34,
        borderRadius: "50%",
        flexShrink: 0,
        background: "linear-gradient(135deg,#7c3aed,#2563EB)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 13,
        fontWeight: 700,
        color: "white"
      }
    }, p.name.split(" ").map(function (n) {
      return n[0];
    }).join("").slice(0, 2)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 600
      }
    }, p.name), /*#__PURE__*/React.createElement("span", {
      className: "badge",
      style: {
        fontSize: 10,
        background: "rgba(139,92,246,0.2)",
        color: "#a78bfa",
        border: "1px solid rgba(139,92,246,0.3)"
      }
    }, "Principal")))), /*#__PURE__*/React.createElement("td", {
      style: {
        fontSize: 13
      }
    }, p.email), /*#__PURE__*/React.createElement("td", {
      style: {
        fontFamily: "monospace",
        fontSize: 12,
        color: COLORS.textMuted
      }
    }, p.password), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-secondary btn-sm",
      onClick: function onClick() {
        setBursarForm({
          name: p.name,
          email: p.email,
          password: p.password
        });
        setBursarModal({
          type: "edit-principal",
          id: p.id
        });
      }
    }, "Edit"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-danger btn-sm",
      onClick: function onClick() {
        return deleteUser(p.id, "principal");
      }
    }, "Delete"))));
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      marginTop: 16,
      background: "rgba(139,92,246,0.06)",
      border: "1px solid rgba(139,92,246,0.2)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      marginBottom: 8,
      color: "#a78bfa"
    }
  }, "\uD83C\uDF93 About Principal Account"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: COLORS.textSecondary,
      lineHeight: 1.7
    }
  }, "The principal has their own login and can:", /*#__PURE__*/React.createElement("br", null), "\u2705 Monitor daily staff attendance \u2014 mark Present, Late, Absent", /*#__PURE__*/React.createElement("br", null), "\u2705 View 7-day attendance trend dashboard", /*#__PURE__*/React.createElement("br", null), "\u2705 View staff attendance report with percentages", /*#__PURE__*/React.createElement("br", null), "\u2705 View school analytics and broadsheet", /*#__PURE__*/React.createElement("br", null), "\u2705 View student and teacher lists", /*#__PURE__*/React.createElement("br", null), "\u2705 Post announcements", /*#__PURE__*/React.createElement("br", null), "\u274C Cannot edit scores, manage payments, or change system settings"))), bursarModal && /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay",
    onClick: function onClick() {
      return setBursarModal(null);
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal",
    onClick: function onClick(e) {
      return e.stopPropagation();
    },
    style: {
      maxWidth: 440
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-title"
  }, bursarModal === "add" || (bursarModal === null || bursarModal === void 0 ? void 0 : bursarModal.type) === "edit" ? "Bursar Account" : "Principal Account", " — ", bursarModal === "add" || bursarModal === "add-principal" ? "Create" : "Edit"), /*#__PURE__*/React.createElement("button", {
    className: "modal-close",
    onClick: function onClick() {
      return setBursarModal(null);
    }
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    className: "modal-body"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px 14px",
      background: "rgba(37,99,235,0.08)",
      border: "1px solid rgba(37,99,235,0.2)",
      borderRadius: 8,
      fontSize: 12,
      color: COLORS.blueLight,
      marginBottom: 16
    }
  }, "\uD83D\uDD11 The bursar uses this email and password to log in at the school portal login page."), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Full Name *"), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    placeholder: "e.g. Mrs. Adaeze Okafor",
    value: bursarForm.name,
    onChange: function onChange(e) {
      return setBursarForm(_objectSpread(_objectSpread({}, bursarForm), {}, {
        name: e.target.value
      }));
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Email Address *"), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    type: "email",
    placeholder: "bursar@school.com",
    value: bursarForm.email,
    onChange: function onChange(e) {
      return setBursarForm(_objectSpread(_objectSpread({}, bursarForm), {}, {
        email: e.target.value
      }));
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Password"), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    placeholder: "Minimum 6 characters",
    value: bursarForm.password,
    onChange: function onChange(e) {
      return setBursarForm(_objectSpread(_objectSpread({}, bursarForm), {}, {
        password: e.target.value
      }));
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "modal-footer"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary",
    onClick: function onClick() {
      return setBursarModal(null);
    }
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: saveBursar
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 16
  }), " ", bursarModal === "add" ? "Create Account" : "Save Changes")))));
}

// ─── CLASSES PAGE ─────────────────────────────────────────────────────────────
function ClassesPage(_ref14) {
  var state = _ref14.state,
    updateState = _ref14.updateState,
    currentUser = _ref14.currentUser,
    showNotification = _ref14.showNotification;
  var _useState71 = useState("classes"),
    _useState72 = _slicedToArray(_useState71, 2),
    activeTab = _useState72[0],
    setActiveTab = _useState72[1];
  var _useState73 = useState(null),
    _useState74 = _slicedToArray(_useState73, 2),
    modal = _useState74[0],
    setModal = _useState74[1];
  var _useState75 = useState({
      name: "",
      level: "Junior"
    }),
    _useState76 = _slicedToArray(_useState75, 2),
    form = _useState76[0],
    setForm = _useState76[1];
  var _useState77 = useState({
      name: "",
      code: ""
    }),
    _useState78 = _slicedToArray(_useState77, 2),
    subForm = _useState78[0],
    setSubForm = _useState78[1];
  var saveClass = function saveClass() {
    if (!form.name) return;
    if (modal === "addClass") {
      updateState({
        classes: [].concat(_toConsumableArray(state.classes), [_objectSpread({
          id: generateId()
        }, form)])
      });
    } else if ((modal === null || modal === void 0 ? void 0 : modal.type) === "editClass") {
      updateState({
        classes: state.classes.map(function (c) {
          return c.id === modal.id ? _objectSpread(_objectSpread({}, c), form) : c;
        })
      });
    }
    setModal(null);
    showNotification("Saved!");
  };
  var saveSubject = function saveSubject() {
    if (!subForm.name || !subForm.code) return;
    if (modal === "addSub") {
      updateState({
        subjects: [].concat(_toConsumableArray(state.subjects), [_objectSpread({
          id: generateId()
        }, subForm)])
      });
    } else if ((modal === null || modal === void 0 ? void 0 : modal.type) === "editSub") {
      updateState({
        subjects: state.subjects.map(function (s) {
          return s.id === modal.id ? _objectSpread(_objectSpread({}, s), subForm) : s;
        })
      });
    }
    setModal(null);
    showNotification("Saved!");
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "tabs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tab ".concat(activeTab === "classes" ? "active" : ""),
    onClick: function onClick() {
      return setActiveTab("classes");
    }
  }, "Classes (", state.classes.length, ")"), /*#__PURE__*/React.createElement("div", {
    className: "tab ".concat(activeTab === "subjects" ? "active" : ""),
    onClick: function onClick() {
      return setActiveTab("subjects");
    }
  }, "Subjects (", state.subjects.length, ")")), activeTab === "classes" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "section-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-title"
  }, "Class Management"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: function onClick() {
      setForm({
        name: "",
        level: "Junior"
      });
      setModal("addClass");
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 16
  }), " Add Class")), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "table-wrapper"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Class Name"), /*#__PURE__*/React.createElement("th", null, "Level"), /*#__PURE__*/React.createElement("th", null, "Students"), /*#__PURE__*/React.createElement("th", null, "Actions"))), /*#__PURE__*/React.createElement("tbody", null, state.classes.map(function (c) {
    var count = state.users.filter(function (u) {
      return u.role === "student" && u.classId === c.id;
    }).length;
    return /*#__PURE__*/React.createElement("tr", {
      key: c.id
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        fontWeight: 600
      }
    }, c.name), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
      className: "badge ".concat(c.level === "Senior" ? "badge-gold" : "badge-blue")
    }, c.level)), /*#__PURE__*/React.createElement("td", null, count), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-secondary btn-sm btn-icon",
      onClick: function onClick() {
        setForm({
          name: c.name,
          level: c.level
        });
        setModal({
          type: "editClass",
          id: c.id
        });
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "edit",
      size: 14
    })), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-danger btn-sm btn-icon",
      onClick: function onClick() {
        return updateState({
          classes: state.classes.filter(function (x) {
            return x.id !== c.id;
          })
        });
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "trash",
      size: 14
    })))));
  })))))), activeTab === "subjects" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "section-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-title"
  }, "Subject Management"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: function onClick() {
      setSubForm({
        name: "",
        code: ""
      });
      setModal("addSub");
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 16
  }), " Add Subject")), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "table-wrapper"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Subject Name"), /*#__PURE__*/React.createElement("th", null, "Code"), /*#__PURE__*/React.createElement("th", null, "Actions"))), /*#__PURE__*/React.createElement("tbody", null, state.subjects.map(function (s) {
    return /*#__PURE__*/React.createElement("tr", {
      key: s.id
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        fontWeight: 500
      }
    }, s.name), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
      className: "badge badge-blue"
    }, s.code)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-secondary btn-sm btn-icon",
      onClick: function onClick() {
        setSubForm({
          name: s.name,
          code: s.code
        });
        setModal({
          type: "editSub",
          id: s.id
        });
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "edit",
      size: 14
    })), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-danger btn-sm btn-icon",
      onClick: function onClick() {
        return updateState({
          subjects: state.subjects.filter(function (x) {
            return x.id !== s.id;
          })
        });
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "trash",
      size: 14
    })))));
  })))))), (modal === "addClass" || (modal === null || modal === void 0 ? void 0 : modal.type) === "editClass") && /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay",
    onClick: function onClick() {
      return setModal(null);
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal",
    style: {
      maxWidth: 400
    },
    onClick: function onClick(e) {
      return e.stopPropagation();
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-title"
  }, modal === "addClass" ? "Add Class" : "Edit Class"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-sm btn-icon",
    onClick: function onClick() {
      return setModal(null);
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "close",
    size: 16
  }))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Class Name"), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    value: form.name,
    onChange: function onChange(e) {
      return setForm(_objectSpread(_objectSpread({}, form), {}, {
        name: e.target.value
      }));
    },
    placeholder: "e.g. JSS 3"
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Level"), /*#__PURE__*/React.createElement("select", {
    className: "form-input",
    value: form.level,
    onChange: function onChange(e) {
      return setForm(_objectSpread(_objectSpread({}, form), {}, {
        level: e.target.value
      }));
    }
  }, /*#__PURE__*/React.createElement("option", null, "Junior"), /*#__PURE__*/React.createElement("option", null, "Senior"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      justifyContent: "flex-end"
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary",
    onClick: function onClick() {
      return setModal(null);
    }
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: saveClass
  }, "Save")))), (modal === "addSub" || (modal === null || modal === void 0 ? void 0 : modal.type) === "editSub") && /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay",
    onClick: function onClick() {
      return setModal(null);
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal",
    style: {
      maxWidth: 400
    },
    onClick: function onClick(e) {
      return e.stopPropagation();
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-title"
  }, modal === "addSub" ? "Add Subject" : "Edit Subject"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-sm btn-icon",
    onClick: function onClick() {
      return setModal(null);
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "close",
    size: 16
  }))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Subject Name"), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    value: subForm.name,
    onChange: function onChange(e) {
      return setSubForm(_objectSpread(_objectSpread({}, subForm), {}, {
        name: e.target.value
      }));
    },
    placeholder: "e.g. Mathematics"
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Code"), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    value: subForm.code,
    onChange: function onChange(e) {
      return setSubForm(_objectSpread(_objectSpread({}, subForm), {}, {
        code: e.target.value
      }));
    },
    placeholder: "e.g. MTH"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      justifyContent: "flex-end"
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary",
    onClick: function onClick() {
      return setModal(null);
    }
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: saveSubject
  }, "Save")))));
}

// ─── SCORE ENTRY PAGE ─────────────────────────────────────────────────────────
function ScoreEntryPage(_ref15) {
  var _currentUser$classes, _currentUser$subjects, _currentUser$classes2, _currentUser$subjects2, _state$classes$find4, _state$subjects$find3, _state$classes$find5;
  var state = _ref15.state,
    updateState = _ref15.updateState,
    currentUser = _ref15.currentUser,
    showNotification = _ref15.showNotification;
  var _useState79 = useState("scores"),
    _useState80 = _slicedToArray(_useState79, 2),
    activeTab = _useState80[0],
    setActiveTab = _useState80[1];
  var _useState81 = useState(((_currentUser$classes = currentUser.classes) === null || _currentUser$classes === void 0 ? void 0 : _currentUser$classes[0]) || ""),
    _useState82 = _slicedToArray(_useState81, 2),
    selectedClass = _useState82[0],
    setSelectedClass = _useState82[1];
  var _useState83 = useState(((_currentUser$subjects = currentUser.subjects) === null || _currentUser$subjects === void 0 ? void 0 : _currentUser$subjects[0]) || ""),
    _useState84 = _slicedToArray(_useState83, 2),
    selectedSubject = _useState84[0],
    setSelectedSubject = _useState84[1];
  var _useState85 = useState(state.currentTerm),
    _useState86 = _slicedToArray(_useState85, 2),
    selectedTerm = _useState86[0],
    setSelectedTerm = _useState86[1];
  var _useState87 = useState({}),
    _useState88 = _slicedToArray(_useState87, 2),
    localScores = _useState88[0],
    setLocalScores = _useState88[1];
  var _useState89 = useState({}),
    _useState90 = _slicedToArray(_useState89, 2),
    comments = _useState90[0],
    setComments = _useState90[1];
  var _useState91 = useState(null),
    _useState92 = _slicedToArray(_useState91, 2),
    aiLoading = _useState92[0],
    setAiLoading = _useState92[1];
  var _useState93 = useState({}),
    _useState94 = _slicedToArray(_useState93, 2),
    charLocal = _useState94[0],
    setCharLocal = _useState94[1];

  // CSV Import state
  var _useState95 = useState(((_currentUser$classes2 = currentUser.classes) === null || _currentUser$classes2 === void 0 ? void 0 : _currentUser$classes2[0]) || ""),
    _useState96 = _slicedToArray(_useState95, 2),
    importClass = _useState96[0],
    setImportClass = _useState96[1];
  var _useState97 = useState(((_currentUser$subjects2 = currentUser.subjects) === null || _currentUser$subjects2 === void 0 ? void 0 : _currentUser$subjects2[0]) || ""),
    _useState98 = _slicedToArray(_useState97, 2),
    importSubject = _useState98[0],
    setImportSubject = _useState98[1];
  var _useState99 = useState(state.currentTerm),
    _useState100 = _slicedToArray(_useState99, 2),
    importTerm = _useState100[0],
    setImportTerm = _useState100[1];
  var _useState101 = useState([]),
    _useState102 = _slicedToArray(_useState101, 2),
    importRows = _useState102[0],
    setImportRows = _useState102[1]; // parsed preview rows
  var _useState103 = useState([]),
    _useState104 = _slicedToArray(_useState103, 2),
    importErrors = _useState104[0],
    setImportErrors = _useState104[1];
  var _useState105 = useState(false),
    _useState106 = _slicedToArray(_useState105, 2),
    importDone = _useState106[0],
    setImportDone = _useState106[1];
  var fileInputRef = useRef(null);
  var TRAITS = state.characterTraits || ["Punctuality", "Neatness", "Attentiveness", "Cooperation", "Honesty", "Respect", "Diligence"];
  var RATINGS = ["Excellent", "Very Good", "Good", "Fair", "Poor"];
  var myClasses = state.classes.filter(function (c) {
    return (currentUser.classes || []).includes(c.id);
  });
  var mySubjects = state.subjects.filter(function (s) {
    return (currentUser.subjects || []).includes(s.id);
  });
  var classStudents = state.users.filter(function (u) {
    return u.role === "student" && u.classId === selectedClass;
  });
  var getExistingScore = function getExistingScore(studentId) {
    return state.scores.find(function (s) {
      return s.studentId === studentId && s.subjectId === selectedSubject && s.classId === selectedClass && s.session === state.currentSession && s.term === selectedTerm;
    });
  };
  useEffect(function () {
    var newLocal = {};
    var newComments = {};
    classStudents.forEach(function (st) {
      var existing = getExistingScore(st.id);
      newLocal[st.id] = existing ? {
        ca: existing.ca,
        exam: existing.exam
      } : {
        ca: "",
        exam: ""
      };
      newComments[st.id] = (existing === null || existing === void 0 ? void 0 : existing.comment) || "";
    });
    setLocalScores(newLocal);
    setComments(newComments);
  }, [selectedClass, selectedSubject, selectedTerm]);
  useEffect(function () {
    var charReports = state.characterReports || {};
    var loaded = {};
    classStudents.forEach(function (st) {
      var key = "".concat(st.id, "_").concat(state.currentSession, "_").concat(selectedTerm);
      loaded[st.id] = charReports[key] || {};
    });
    setCharLocal(loaded);
  }, [selectedClass, selectedTerm]);
  var saveScores = function saveScores() {
    var newScores = _toConsumableArray(state.scores);
    var newAudit = _toConsumableArray(state.auditTrail);
    classStudents.forEach(function (st) {
      var _state$subjects$find;
      var score = localScores[st.id];
      if (!score || score.ca === "" && score.exam === "") return;
      var existing = newScores.findIndex(function (s) {
        return s.studentId === st.id && s.subjectId === selectedSubject && s.classId === selectedClass && s.session === state.currentSession && s.term === selectedTerm;
      });
      var scoreObj = {
        id: existing >= 0 ? newScores[existing].id : generateId(),
        studentId: st.id,
        subjectId: selectedSubject,
        classId: selectedClass,
        session: state.currentSession,
        term: selectedTerm,
        ca: Number(score.ca) || 0,
        exam: Number(score.exam) || 0,
        comment: comments[st.id] || "",
        locked: false,
        enteredBy: currentUser.id
      };
      if (existing >= 0) newScores[existing] = scoreObj;else newScores.push(scoreObj);
      newAudit.unshift({
        id: generateId(),
        userId: currentUser.id,
        userName: currentUser.name,
        action: "Score Entry",
        details: "Entered scores for ".concat(st.name, " \u2014 ").concat((_state$subjects$find = state.subjects.find(function (s) {
          return s.id === selectedSubject;
        })) === null || _state$subjects$find === void 0 ? void 0 : _state$subjects$find.name),
        timestamp: new Date().toISOString()
      });
    });
    updateState({
      scores: newScores,
      auditTrail: newAudit
    });
    showNotification("Scores saved successfully!");
  };
  var saveCharacterReports = function saveCharacterReports() {
    var existing = state.characterReports || {};
    var updated = _objectSpread({}, existing);
    classStudents.forEach(function (st) {
      var key = "".concat(st.id, "_").concat(state.currentSession, "_").concat(selectedTerm);
      updated[key] = charLocal[st.id] || {};
    });
    updateState({
      characterReports: updated
    });
    showNotification("Character reports saved!");
  };
  var getAIComment = /*#__PURE__*/function () {
    var _ref16 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(student) {
      var score, ca, exam, total, sub, resp, data, _t3;
      return _regenerator().w(function (_context6) {
        while (1) switch (_context6.p = _context6.n) {
          case 0:
            setAiLoading(student.id);
            score = localScores[student.id];
            ca = Number(score === null || score === void 0 ? void 0 : score.ca) || 0;
            exam = Number(score === null || score === void 0 ? void 0 : score.exam) || 0;
            total = ca + exam;
            sub = state.subjects.find(function (s) {
              return s.id === selectedSubject;
            });
            _context6.p = 1;
            _context6.n = 2;
            return fetch("https://api.anthropic.com/v1/messages", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                model: "claude-sonnet-4-20250514",
                max_tokens: 100,
                messages: [{
                  role: "user",
                  content: "Write a brief (1-2 sentence) teacher comment for a student who scored ".concat(ca, "/40 in CA and ").concat(exam, "/60 in exam (total: ").concat(total, "/100) in ").concat(sub === null || sub === void 0 ? void 0 : sub.name, ". Be encouraging, specific, and professional. No quotation marks.")
                }]
              })
            });
          case 2:
            resp = _context6.v;
            _context6.n = 3;
            return resp.json();
          case 3:
            data = _context6.v;
            setComments(function (prev) {
              var _data$content2;
              return _objectSpread(_objectSpread({}, prev), {}, _defineProperty({}, student.id, ((_data$content2 = data.content) === null || _data$content2 === void 0 || (_data$content2 = _data$content2[0]) === null || _data$content2 === void 0 ? void 0 : _data$content2.text) || ""));
            });
            _context6.n = 5;
            break;
          case 4:
            _context6.p = 4;
            _t3 = _context6.v;
            showNotification("AI comment generation failed", "error");
          case 5:
            setAiLoading(null);
          case 6:
            return _context6.a(2);
        }
      }, _callee6, null, [[1, 4]]);
    }));
    return function getAIComment(_x5) {
      return _ref16.apply(this, arguments);
    };
  }();
  var getAICharacterRemark = /*#__PURE__*/function () {
    var _ref17 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(student) {
      var traits, traitSummary, resp, data, _t4;
      return _regenerator().w(function (_context7) {
        while (1) switch (_context7.p = _context7.n) {
          case 0:
            setAiLoading("char_".concat(student.id));
            traits = charLocal[student.id] || {};
            traitSummary = TRAITS.map(function (t) {
              return "".concat(t, ": ").concat(traits[t] || "unrated");
            }).join(", ");
            _context7.p = 1;
            _context7.n = 2;
            return fetch("https://api.anthropic.com/v1/messages", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                model: "claude-sonnet-4-20250514",
                max_tokens: 120,
                messages: [{
                  role: "user",
                  content: "Write a brief (2 sentences max) character remark for a student with these trait ratings: ".concat(traitSummary, ". Be warm, professional, and encouraging. No quotation marks.")
                }]
              })
            });
          case 2:
            resp = _context7.v;
            _context7.n = 3;
            return resp.json();
          case 3:
            data = _context7.v;
            setCharLocal(function (prev) {
              var _data$content3;
              return _objectSpread(_objectSpread({}, prev), {}, _defineProperty({}, student.id, _objectSpread(_objectSpread({}, prev[student.id]), {}, {
                _teacherRemark: ((_data$content3 = data.content) === null || _data$content3 === void 0 || (_data$content3 = _data$content3[0]) === null || _data$content3 === void 0 ? void 0 : _data$content3.text) || ""
              })));
            });
            _context7.n = 5;
            break;
          case 4:
            _context7.p = 4;
            _t4 = _context7.v;
            showNotification("AI remark generation failed", "error");
          case 5:
            setAiLoading(null);
          case 6:
            return _context7.a(2);
        }
      }, _callee7, null, [[1, 4]]);
    }));
    return function getAICharacterRemark(_x6) {
      return _ref17.apply(this, arguments);
    };
  }();

  // ── CSV / Excel Import ──────────────────────────────────────
  var parseCSV = function parseCSV(text) {
    // Split into lines, skip blank lines and comment lines starting with #
    var allLines = text.trim().split(/\r?\n/);
    var lines = allLines.filter(function (l) {
      return l.trim() && !l.trim().startsWith("#");
    });
    if (lines.length < 2) return {
      rows: [],
      errors: ["File is empty or has no data rows after skipping comment lines."]
    };

    // Parse header — remove BOM, quotes, trim, lowercase, strip non-alphanumeric
    var headers = lines[0].replace(/^\uFEFF/, "") // remove BOM (Excel adds this)
    .split(",").map(function (h) {
      return h.trim().replace(/^"|"$/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
    });
    var errors = [];
    var rows = [];

    // Flexible column matching
    var colIdx = {
      regNo: headers.findIndex(function (h) {
        return ["regno", "regnum", "studentid", "id", "reg", "registrationnumber", "admno", "admissionno"].includes(h);
      }),
      name: headers.findIndex(function (h) {
        return ["name", "studentname", "fullname", "student"].includes(h);
      }),
      ca: headers.findIndex(function (h) {
        return ["ca", "continuousassessment", "assessment", "test", "ca40", "firstca"].includes(h);
      }),
      exam: headers.findIndex(function (h) {
        return ["exam", "examination", "examscore", "score", "exam60", "examscore"].includes(h);
      }),
      comment: headers.findIndex(function (h) {
        return ["comment", "remark", "remarks", "note", "notes", "teachercomment"].includes(h);
      })
    };
    if (colIdx.regNo === -1 && colIdx.name === -1) {
      errors.push("Cannot find a student identifier. Make sure your CSV has a column named 'RegNo' or 'Name'.");
      return {
        rows: rows,
        errors: errors
      };
    }
    if (colIdx.ca === -1) errors.push("No 'CA' column found — CA scores will be 0. Add a column named 'CA'.");
    if (colIdx.exam === -1) errors.push("No 'Exam' column found — Exam scores will be 0. Add a column named 'Exam'.");
    var importStudents = state.users.filter(function (u) {
      return u.role === "student" && u.classId === importClass;
    });
    var _loop2 = function _loop2() {
        var line = lines[i].trim();
        if (!line) return 0; // continue

        // Handle quoted fields with commas inside them
        var cols = [];
        var cur = "",
          inQuote = false;
        for (var ci = 0; ci < line.length; ci++) {
          var ch = line[ci];
          if (ch === '"') {
            inQuote = !inQuote;
          } else if (ch === "," && !inQuote) {
            cols.push(cur.trim());
            cur = "";
          } else {
            cur += ch;
          }
        }
        cols.push(cur.trim());
        var rawReg = (colIdx.regNo >= 0 ? cols[colIdx.regNo] : "").replace(/^"|"$/g, "").trim();
        var rawName = (colIdx.name >= 0 ? cols[colIdx.name] : "").replace(/^"|"$/g, "").trim();
        var rawCA = (colIdx.ca >= 0 ? cols[colIdx.ca] : "0").replace(/^"|"$/g, "").trim();
        var rawExam = (colIdx.exam >= 0 ? cols[colIdx.exam] : "0").replace(/^"|"$/g, "").trim();
        var rawComment = (colIdx.comment >= 0 ? cols[colIdx.comment] : "").replace(/^"|"$/g, "").trim();

        // Skip rows where both reg and name are empty
        if (!rawReg && !rawName) return 0; // continue
        var ca = Math.min(40, Math.max(0, parseFloat(rawCA) || 0));
        var exam = Math.min(60, Math.max(0, parseFloat(rawExam) || 0));

        // Match student — reg number first (exact), then name (flexible)
        var matched = null;
        if (rawReg) {
          matched = importStudents.find(function (s) {
            return (s.studentId || "").toLowerCase().trim() === rawReg.toLowerCase();
          });
        }
        if (!matched && rawName) {
          var searchName = rawName.toLowerCase();
          matched = importStudents.find(function (s) {
            var sName = s.name.toLowerCase();
            return sName === searchName || sName.includes(searchName) || searchName.includes(sName) || sName.split(" ")[0] === searchName.split(" ")[0]; // first name match
          });
        }
        rows.push({
          rowNum: i + 1,
          rawReg: rawReg,
          rawName: rawName,
          ca: ca,
          exam: exam,
          comment: rawComment,
          student: matched || null,
          matched: !!matched
        });
      },
      _ret2;
    for (var i = 1; i < lines.length; i++) {
      _ret2 = _loop2();
      if (_ret2 === 0) continue;
    }
    var unmatched = rows.filter(function (r) {
      return !r.matched;
    }).length;
    if (unmatched > 0) errors.push("".concat(unmatched, " row(s) could not be matched to a student in this class \u2014 they will be skipped."));
    return {
      rows: rows,
      errors: errors
    };
  };
  var processFile = function processFile(file) {
    if (!file) return;
    setImportDone(false);
    setImportRows([]);
    setImportErrors([]);
    if (!importClass || !importSubject) {
      setImportErrors(["Please select a Class and Subject first before uploading."]);
      return;
    }
    var reader = new FileReader();
    reader.onload = function (ev) {
      var _parseCSV = parseCSV(ev.target.result),
        rows = _parseCSV.rows,
        errors = _parseCSV.errors;
      setImportRows(rows);
      setImportErrors(errors);
    };
    reader.onerror = function () {
      return setImportErrors(["Could not read the file. Please try again."]);
    };
    reader.readAsText(file);
  };
  var handleFileUpload = function handleFileUpload(e) {
    var _e$target$files2;
    var file = (_e$target$files2 = e.target.files) === null || _e$target$files2 === void 0 ? void 0 : _e$target$files2[0];
    processFile(file);
    // Reset so same file can be re-selected
    setTimeout(function () {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }, 100);
  };
  var confirmImport = function confirmImport() {
    var _state$subjects$find2, _state$classes$find3;
    var matched = importRows.filter(function (r) {
      return r.matched;
    });
    if (matched.length === 0) {
      showNotification("No valid rows to import.", "error");
      return;
    }
    var newScores = _toConsumableArray(state.scores);
    var newAudit = _toConsumableArray(state.auditTrail);
    matched.forEach(function (_ref18) {
      var student = _ref18.student,
        ca = _ref18.ca,
        exam = _ref18.exam,
        comment = _ref18.comment;
      var existing = newScores.findIndex(function (s) {
        return s.studentId === student.id && s.subjectId === importSubject && s.classId === importClass && s.session === state.currentSession && s.term === importTerm;
      });
      var scoreObj = {
        id: existing >= 0 ? newScores[existing].id : generateId(),
        studentId: student.id,
        subjectId: importSubject,
        classId: importClass,
        session: state.currentSession,
        term: importTerm,
        ca: ca,
        exam: exam,
        comment: comment,
        locked: false,
        enteredBy: currentUser.id
      };
      if (existing >= 0) newScores[existing] = scoreObj;else newScores.push(scoreObj);
    });
    newAudit.unshift({
      id: generateId(),
      userId: currentUser.id,
      userName: currentUser.name,
      action: "CSV Import",
      details: "Imported ".concat(matched.length, " scores for ").concat((_state$subjects$find2 = state.subjects.find(function (s) {
        return s.id === importSubject;
      })) === null || _state$subjects$find2 === void 0 ? void 0 : _state$subjects$find2.name, " \u2014 ").concat((_state$classes$find3 = state.classes.find(function (c) {
        return c.id === importClass;
      })) === null || _state$classes$find3 === void 0 ? void 0 : _state$classes$find3.name, " \u2014 ").concat(importTerm),
      timestamp: new Date().toISOString()
    });
    updateState({
      scores: newScores,
      auditTrail: newAudit
    });
    setImportDone(true);
    setImportRows([]);
    showNotification("\u2705 ".concat(matched.length, " scores imported successfully!"));
  };
  var downloadTemplate = function downloadTemplate() {
    var importStudents = state.users.filter(function (u) {
      return u.role === "student" && u.classId === importClass;
    });
    var sub = state.subjects.find(function (s) {
      return s.id === importSubject;
    });
    var cls = state.classes.find(function (c) {
      return c.id === importClass;
    });

    // Header row — must match exactly what parseCSV expects
    var headerRow = "RegNo,Name,CA,Exam,Comment";

    // One row per student — pre-filled reg no and name, scores left blank (0)
    var dataRows = importStudents.length > 0 ? importStudents.map(function (s) {
      return "".concat(s.studentId || "", ",").concat(s.name, ",0,0,");
    }) : ["STD001,Sample Student,0,0,", "STD002,Another Student,0,0,"];
    var csv = [headerRow].concat(_toConsumableArray(dataRows)).join("\r\n");
    var blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;"
    });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "scores-".concat((cls === null || cls === void 0 ? void 0 : cls.name) || "class", "-").concat((sub === null || sub === void 0 ? void 0 : sub.name) || "subject", "-").concat(importTerm, ".csv").replace(/\s+/g, "-").replace(/[^a-zA-Z0-9\-_.]/g, "");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification("Template downloaded! Open in Excel, fill scores, save as CSV.");
  };
  var isLocked = state.resultPublished;
  var SelectorBar = function SelectorBar() {
    return /*#__PURE__*/React.createElement("div", {
      className: "card",
      style: {
        marginBottom: 20
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "grid-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "form-group",
      style: {
        margin: 0
      }
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "Class"), /*#__PURE__*/React.createElement("select", {
      className: "form-input",
      value: selectedClass,
      onChange: function onChange(e) {
        return setSelectedClass(e.target.value);
      },
      disabled: isLocked
    }, /*#__PURE__*/React.createElement("option", {
      value: ""
    }, "\u2014 Select Class \u2014"), myClasses.map(function (c) {
      return /*#__PURE__*/React.createElement("option", {
        key: c.id,
        value: c.id
      }, c.name);
    }))), activeTab === "scores" && /*#__PURE__*/React.createElement("div", {
      className: "form-group",
      style: {
        margin: 0
      }
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "Subject"), /*#__PURE__*/React.createElement("select", {
      className: "form-input",
      value: selectedSubject,
      onChange: function onChange(e) {
        return setSelectedSubject(e.target.value);
      },
      disabled: isLocked
    }, /*#__PURE__*/React.createElement("option", {
      value: ""
    }, "\u2014 Select Subject \u2014"), mySubjects.map(function (s) {
      return /*#__PURE__*/React.createElement("option", {
        key: s.id,
        value: s.id
      }, s.name);
    }))), /*#__PURE__*/React.createElement("div", {
      className: "form-group",
      style: {
        margin: 0
      }
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "Term"), /*#__PURE__*/React.createElement("select", {
      className: "form-input",
      value: selectedTerm,
      onChange: function onChange(e) {
        return setSelectedTerm(e.target.value);
      },
      disabled: isLocked
    }, state.terms.map(function (t) {
      return /*#__PURE__*/React.createElement("option", {
        key: t
      }, t);
    })))));
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "section-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-title"
  }, "Score Entry"), isLocked && /*#__PURE__*/React.createElement("span", {
    className: "badge badge-red"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "lock",
    size: 12
  }), " Results Locked")), /*#__PURE__*/React.createElement("div", {
    className: "tabs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tab ".concat(activeTab === "scores" ? "active" : ""),
    onClick: function onClick() {
      return setActiveTab("scores");
    }
  }, "\uD83D\uDCCA Academic Scores"), /*#__PURE__*/React.createElement("div", {
    className: "tab ".concat(activeTab === "import" ? "active" : ""),
    onClick: function onClick() {
      return setActiveTab("import");
    }
  }, "\uD83D\uDCC2 Import CSV"), /*#__PURE__*/React.createElement("div", {
    className: "tab ".concat(activeTab === "character" ? "active" : ""),
    onClick: function onClick() {
      return setActiveTab("character");
    }
  }, "\uD83C\uDF1F Character & Moral")), activeTab === "import" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 15,
      color: COLORS.blueLight,
      marginBottom: 16
    }
  }, "Import Settings"), /*#__PURE__*/React.createElement("div", {
    className: "grid-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group",
    style: {
      margin: 0
    }
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Class"), /*#__PURE__*/React.createElement("select", {
    className: "form-input",
    value: importClass,
    onChange: function onChange(e) {
      setImportClass(e.target.value);
      setImportRows([]);
      setImportErrors([]);
      setImportDone(false);
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "\u2014 Select Class \u2014"), myClasses.map(function (c) {
    return /*#__PURE__*/React.createElement("option", {
      key: c.id,
      value: c.id
    }, c.name);
  }))), /*#__PURE__*/React.createElement("div", {
    className: "form-group",
    style: {
      margin: 0
    }
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Subject"), /*#__PURE__*/React.createElement("select", {
    className: "form-input",
    value: importSubject,
    onChange: function onChange(e) {
      setImportSubject(e.target.value);
      setImportRows([]);
      setImportErrors([]);
      setImportDone(false);
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "\u2014 Select Subject \u2014"), mySubjects.map(function (s) {
    return /*#__PURE__*/React.createElement("option", {
      key: s.id,
      value: s.id
    }, s.name);
  }))), /*#__PURE__*/React.createElement("div", {
    className: "form-group",
    style: {
      margin: 0
    }
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Term"), /*#__PURE__*/React.createElement("select", {
    className: "form-input",
    value: importTerm,
    onChange: function onChange(e) {
      return setImportTerm(e.target.value);
    }
  }, state.terms.map(function (t) {
    return /*#__PURE__*/React.createElement("option", {
      key: t
    }, t);
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 15,
      color: COLORS.blueLight,
      marginBottom: 16
    }
  }, "How to Import Scores"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, [{
    step: "1",
    title: "Download Template",
    desc: "Click the button below to download a pre-filled CSV with your students' names and reg numbers already in it. Open it in Excel or Google Sheets."
  }, {
    step: "2",
    title: "Fill in Scores",
    desc: "Enter each student's CA score (max 40) and Exam score (max 60) in the CA and Exam columns. Optionally add a comment. Save the file as CSV."
  }, {
    step: "3",
    title: "Upload & Preview",
    desc: "Upload the filled CSV file. The app will show you a preview of all scores before saving — you can verify everything looks correct."
  }, {
    step: "4",
    title: "Confirm Import",
    desc: "Click 'Confirm Import' to save all scores to the database at once."
  }].map(function (_ref19) {
    var step = _ref19.step,
      title = _ref19.title,
      desc = _ref19.desc;
    return /*#__PURE__*/React.createElement("div", {
      key: step,
      style: {
        display: "flex",
        gap: 14,
        alignItems: "flex-start"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 28,
        height: 28,
        borderRadius: "50%",
        flexShrink: 0,
        background: "linear-gradient(135deg,var(--blue),var(--indigo))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 800,
        fontSize: 13
      }
    }, step), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 700,
        fontSize: 14,
        marginBottom: 2
      }
    }, title), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: COLORS.textSecondary,
        lineHeight: 1.5
      }
    }, desc)));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20,
      display: "flex",
      gap: 10,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary",
    onClick: downloadTemplate,
    disabled: !importClass || !importSubject
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "download",
    size: 16
  }), " Download Template CSV"), (!importClass || !importSubject) && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: COLORS.textMuted,
      display: "flex",
      alignItems: "center"
    }
  }, "\u2190 Select class and subject first"))), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 15,
      color: COLORS.blueLight,
      marginBottom: 16
    }
  }, "Upload CSV File"), /*#__PURE__*/React.createElement("div", {
    style: {
      border: "2px dashed ".concat(COLORS.blue),
      borderRadius: 12,
      padding: "32px 24px",
      textAlign: "center",
      cursor: "pointer",
      background: "rgba(37,99,235,0.05)",
      transition: "all 0.2s"
    },
    onClick: function onClick() {
      var _fileInputRef$current2;
      return (_fileInputRef$current2 = fileInputRef.current) === null || _fileInputRef$current2 === void 0 ? void 0 : _fileInputRef$current2.click();
    },
    onDragOver: function onDragOver(e) {
      return e.preventDefault();
    },
    onDrop: function onDrop(e) {
      var _e$dataTransfer$files2;
      e.preventDefault();
      var file = (_e$dataTransfer$files2 = e.dataTransfer.files) === null || _e$dataTransfer$files2 === void 0 ? void 0 : _e$dataTransfer$files2[0];
      if (file) processFile(file);
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 40,
      marginBottom: 8
    }
  }, "\uD83D\uDCC2"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 15,
      marginBottom: 4
    }
  }, "Click to upload or drag & drop"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: COLORS.textSecondary
    }
  }, "Supports CSV files (.csv) \u2014 exported from Excel or Google Sheets"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "btn btn-primary btn-sm"
  }, "Browse File"))), /*#__PURE__*/React.createElement("input", {
    type: "file",
    ref: fileInputRef,
    accept: ".csv,text/csv",
    style: {
      display: "none"
    },
    onChange: handleFileUpload
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      padding: "12px 16px",
      background: "rgba(0,0,0,0.2)",
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: COLORS.textMuted,
      marginBottom: 6,
      textTransform: "uppercase",
      letterSpacing: "0.06em"
    }
  }, "Expected CSV Format"), /*#__PURE__*/React.createElement("code", {
    style: {
      fontSize: 12,
      color: COLORS.blueLight,
      lineHeight: 1.8
    }
  }, "RegNo,Name,CA,Exam,Comment", /*#__PURE__*/React.createElement("br", null), "STD001,Chioma Eze,35,55,Excellent performance", /*#__PURE__*/React.createElement("br", null), "STD002,Emeka Obi,28,48,Keep improving"))), importErrors.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      marginBottom: 20,
      border: "1px solid rgba(245,158,11,0.3)",
      background: "rgba(245,158,11,0.08)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      color: COLORS.gold,
      marginBottom: 8
    }
  }, "\u26A0\uFE0F Warnings"), importErrors.map(function (e, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        fontSize: 13,
        color: COLORS.gold,
        marginBottom: 4
      }
    }, "\u2022 ", e);
  })), importRows.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-header",
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 15,
      color: COLORS.blueLight
    }
  }, "Preview \u2014 ", importRows.filter(function (r) {
    return r.matched;
  }).length, " of ", importRows.length, " rows matched"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: COLORS.textSecondary,
      marginTop: 2
    }
  }, "Review before confirming. Only matched rows (\u2705) will be imported.")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: confirmImport,
    disabled: isLocked || importRows.filter(function (r) {
      return r.matched;
    }).length === 0
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 16
  }), " Confirm Import")), /*#__PURE__*/React.createElement("div", {
    className: "table-wrapper"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", null, "Reg No"), /*#__PURE__*/React.createElement("th", null, "Name in File"), /*#__PURE__*/React.createElement("th", null, "Matched Student"), /*#__PURE__*/React.createElement("th", null, "CA"), /*#__PURE__*/React.createElement("th", null, "Exam"), /*#__PURE__*/React.createElement("th", null, "Total"), /*#__PURE__*/React.createElement("th", null, "Comment"))), /*#__PURE__*/React.createElement("tbody", null, importRows.map(function (row, i) {
    return /*#__PURE__*/React.createElement("tr", {
      key: i,
      style: {
        opacity: row.matched ? 1 : 0.5
      }
    }, /*#__PURE__*/React.createElement("td", null, row.matched ? /*#__PURE__*/React.createElement("span", {
      className: "badge badge-green",
      style: {
        fontSize: 11
      }
    }, "\u2705 Matched") : /*#__PURE__*/React.createElement("span", {
      className: "badge badge-red",
      style: {
        fontSize: 11
      }
    }, "\u274C Not Found")), /*#__PURE__*/React.createElement("td", {
      style: {
        fontFamily: "monospace",
        fontSize: 12
      }
    }, row.rawReg || "—"), /*#__PURE__*/React.createElement("td", null, row.rawName || "—"), /*#__PURE__*/React.createElement("td", {
      style: {
        fontWeight: row.matched ? 600 : 400
      }
    }, row.student ? row.student.name : /*#__PURE__*/React.createElement("span", {
      style: {
        color: COLORS.rose
      }
    }, "No match")), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
      style: {
        color: row.ca > 40 ? COLORS.rose : COLORS.textPrimary
      }
    }, row.ca)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
      style: {
        color: row.exam > 60 ? COLORS.rose : COLORS.textPrimary
      }
    }, row.exam)), /*#__PURE__*/React.createElement("td", {
      style: {
        fontWeight: 700,
        color: row.ca + row.exam >= 70 ? COLORS.emerald : row.ca + row.exam >= 50 ? COLORS.gold : COLORS.rose
      }
    }, row.ca + row.exam), /*#__PURE__*/React.createElement("td", {
      style: {
        fontSize: 12,
        color: COLORS.textSecondary,
        maxWidth: 180,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }, row.comment || "—"));
  }))))), importDone && /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      textAlign: "center",
      padding: "32px 24px",
      border: "1px solid rgba(16,185,129,0.3)",
      background: "rgba(16,185,129,0.08)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 48,
      marginBottom: 8
    }
  }, "\u2705"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 18,
      color: COLORS.emerald,
      marginBottom: 8
    }
  }, "Import Successful!"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: COLORS.textSecondary,
      marginBottom: 16
    }
  }, "All scores have been saved. You can view them in the Academic Scores tab or the Broadsheet."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    onClick: function onClick() {
      setActiveTab("scores");
      setSelectedClass(importClass);
      setSelectedSubject(importSubject);
      setSelectedTerm(importTerm);
    }
  }, "View Scores"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-sm",
    onClick: function onClick() {
      setImportDone(false);
      setImportRows([]);
      setImportErrors([]);
    }
  }, "Import Another")))), activeTab !== "import" && /*#__PURE__*/React.createElement(SelectorBar, null), activeTab === "scores" && (selectedClass && selectedSubject ? /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-header",
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "section-title"
  }, (_state$classes$find4 = state.classes.find(function (c) {
    return c.id === selectedClass;
  })) === null || _state$classes$find4 === void 0 ? void 0 : _state$classes$find4.name, " \xB7 ", (_state$subjects$find3 = state.subjects.find(function (s) {
    return s.id === selectedSubject;
  })) === null || _state$subjects$find3 === void 0 ? void 0 : _state$subjects$find3.name), /*#__PURE__*/React.createElement("div", {
    className: "section-sub"
  }, classStudents.length, " students \xB7 ", selectedTerm)), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: saveScores,
    disabled: isLocked
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 16
  }), " Save All Scores")), /*#__PURE__*/React.createElement("div", {
    className: "table-wrapper"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Photo"), /*#__PURE__*/React.createElement("th", null, "Student Name"), /*#__PURE__*/React.createElement("th", null, "CA (Max 40)"), /*#__PURE__*/React.createElement("th", null, "Exam (Max 60)"), /*#__PURE__*/React.createElement("th", null, "Total"), /*#__PURE__*/React.createElement("th", null, "Grade"), /*#__PURE__*/React.createElement("th", null, "Teacher's Comment"), /*#__PURE__*/React.createElement("th", null, "AI \u2728"))), /*#__PURE__*/React.createElement("tbody", null, classStudents.map(function (st) {
    var score = localScores[st.id] || {
      ca: "",
      exam: ""
    };
    var ca = Number(score.ca) || 0;
    var exam = Number(score.exam) || 0;
    var total = ca + exam;
    var gi = getGrade(total, state.gradingSystem);
    return /*#__PURE__*/React.createElement("tr", {
      key: st.id,
      className: "score-row"
    }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 32,
        height: 32,
        borderRadius: "50%",
        overflow: "hidden",
        background: st.avatar ? "transparent" : "linear-gradient(135deg,var(--blue),var(--indigo))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 11,
        fontWeight: 700
      }
    }, st.avatar ? /*#__PURE__*/React.createElement("img", {
      src: st.avatar,
      style: {
        width: "100%",
        height: "100%",
        objectFit: "cover"
      }
    }) : st.name.split(" ").map(function (n) {
      return n[0];
    }).join("").slice(0, 2))), /*#__PURE__*/React.createElement("td", {
      style: {
        fontWeight: 500
      }
    }, st.name), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("input", {
      type: "number",
      min: 0,
      max: 40,
      className: "score-input",
      value: score.ca,
      disabled: isLocked,
      onChange: function onChange(e) {
        return setLocalScores(function (p) {
          return _objectSpread(_objectSpread({}, p), {}, _defineProperty({}, st.id, _objectSpread(_objectSpread({}, p[st.id]), {}, {
            ca: e.target.value
          })));
        });
      }
    })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("input", {
      type: "number",
      min: 0,
      max: 60,
      className: "score-input",
      value: score.exam,
      disabled: isLocked,
      onChange: function onChange(e) {
        return setLocalScores(function (p) {
          return _objectSpread(_objectSpread({}, p), {}, _defineProperty({}, st.id, _objectSpread(_objectSpread({}, p[st.id]), {}, {
            exam: e.target.value
          })));
        });
      }
    })), /*#__PURE__*/React.createElement("td", {
      style: {
        fontWeight: 700,
        color: total >= 50 ? COLORS.emerald : COLORS.rose
      }
    }, total), /*#__PURE__*/React.createElement("td", null, total > 0 && /*#__PURE__*/React.createElement("span", {
      className: "grade-".concat(gi.grade)
    }, gi.grade)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("input", {
      className: "form-input",
      style: {
        minWidth: 180,
        padding: "6px 10px"
      },
      value: comments[st.id] || "",
      disabled: isLocked,
      onChange: function onChange(e) {
        return setComments(function (p) {
          return _objectSpread(_objectSpread({}, p), {}, _defineProperty({}, st.id, e.target.value));
        });
      },
      placeholder: "Teacher comment..."
    })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-secondary btn-sm",
      onClick: function onClick() {
        return getAIComment(st);
      },
      disabled: isLocked || aiLoading === st.id || !score.ca && !score.exam,
      title: "Generate AI comment"
    }, aiLoading === st.id ? /*#__PURE__*/React.createElement("div", {
      className: "spinner",
      style: {
        width: 14,
        height: 14
      }
    }) : /*#__PURE__*/React.createElement(Icon, {
      name: "ai",
      size: 14
    }))));
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      padding: "10px 14px",
      background: "rgba(37,99,235,0.08)",
      borderRadius: 8,
      fontSize: 13,
      color: COLORS.textSecondary
    }
  }, "\uD83D\uDCA1 CA max = 40 pts \xB7 Exam max = 60 pts \xB7 Total = 100. Click \u2728 for AI-generated teacher comments.")) : /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty-state"
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty-state-icon"
  }, "\uD83D\uDCDD"), /*#__PURE__*/React.createElement("div", {
    className: "empty-state-text"
  }, "Select a class and subject to begin score entry")))), activeTab === "character" && (selectedClass ? /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-header",
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "section-title"
  }, (_state$classes$find5 = state.classes.find(function (c) {
    return c.id === selectedClass;
  })) === null || _state$classes$find5 === void 0 ? void 0 : _state$classes$find5.name, " \xB7 Character Report"), /*#__PURE__*/React.createElement("div", {
    className: "section-sub"
  }, classStudents.length, " students \xB7 ", selectedTerm)), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: saveCharacterReports,
    disabled: isLocked
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 16
  }), " Save Reports")), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: "auto"
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      minWidth: 900
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: {
      minWidth: 140
    }
  }, "Student"), TRAITS.map(function (t) {
    return /*#__PURE__*/React.createElement("th", {
      key: t,
      style: {
        minWidth: 110
      }
    }, t);
  }), /*#__PURE__*/React.createElement("th", {
    style: {
      minWidth: 220
    }
  }, "Teacher's Remark"), /*#__PURE__*/React.createElement("th", null, "AI \u2728"))), /*#__PURE__*/React.createElement("tbody", null, classStudents.map(function (st) {
    var data = charLocal[st.id] || {};
    return /*#__PURE__*/React.createElement("tr", {
      key: st.id
    }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 30,
        height: 30,
        borderRadius: "50%",
        overflow: "hidden",
        background: st.avatar ? "transparent" : "linear-gradient(135deg,var(--blue),var(--indigo))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 11,
        fontWeight: 700,
        flexShrink: 0
      }
    }, st.avatar ? /*#__PURE__*/React.createElement("img", {
      src: st.avatar,
      style: {
        width: "100%",
        height: "100%",
        objectFit: "cover"
      }
    }) : st.name.split(" ").map(function (n) {
      return n[0];
    }).join("").slice(0, 2)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 500,
        fontSize: 13
      }
    }, st.name))), TRAITS.map(function (t) {
      return /*#__PURE__*/React.createElement("td", {
        key: t
      }, /*#__PURE__*/React.createElement("select", {
        className: "form-input",
        style: {
          padding: "5px 8px",
          fontSize: 12,
          minWidth: 100
        },
        value: data[t] || "",
        disabled: isLocked,
        onChange: function onChange(e) {
          return setCharLocal(function (p) {
            return _objectSpread(_objectSpread({}, p), {}, _defineProperty({}, st.id, _objectSpread(_objectSpread({}, p[st.id]), {}, _defineProperty({}, t, e.target.value))));
          });
        }
      }, /*#__PURE__*/React.createElement("option", {
        value: ""
      }, "\u2014 Rate \u2014"), RATINGS.map(function (r) {
        return /*#__PURE__*/React.createElement("option", {
          key: r,
          value: r
        }, r);
      })));
    }), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("input", {
      className: "form-input",
      style: {
        minWidth: 200,
        padding: "5px 8px",
        fontSize: 12
      },
      value: data._teacherRemark || "",
      disabled: isLocked,
      placeholder: "Teacher's character remark...",
      onChange: function onChange(e) {
        return setCharLocal(function (p) {
          return _objectSpread(_objectSpread({}, p), {}, _defineProperty({}, st.id, _objectSpread(_objectSpread({}, p[st.id]), {}, {
            _teacherRemark: e.target.value
          })));
        });
      }
    })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-secondary btn-sm",
      onClick: function onClick() {
        return getAICharacterRemark(st);
      },
      disabled: isLocked || aiLoading === "char_".concat(st.id),
      title: "AI-generate character remark"
    }, aiLoading === "char_".concat(st.id) ? /*#__PURE__*/React.createElement("div", {
      className: "spinner",
      style: {
        width: 14,
        height: 14
      }
    }) : /*#__PURE__*/React.createElement(Icon, {
      name: "ai",
      size: 14
    }))));
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      padding: "10px 14px",
      background: "rgba(245,158,11,0.08)",
      borderRadius: 8,
      fontSize: 13,
      color: COLORS.textSecondary
    }
  }, "\uD83C\uDF1F Rate each student on ", TRAITS.length, " character traits. These ratings appear on the student's result sheet. Click \u2728 for AI-generated remarks based on the ratings.")) : /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty-state"
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty-state-icon"
  }, "\uD83C\uDF1F"), /*#__PURE__*/React.createElement("div", {
    className: "empty-state-text"
  }, "Select a class to begin character assessment")))));
}

// ─── BROADSHEET PAGE ──────────────────────────────────────────────────────────
function BroadsheetPage(_ref20) {
  var _currentUser$classes3, _state$classes$, _state$classes$find6;
  var state = _ref20.state,
    currentUser = _ref20.currentUser,
    showNotification = _ref20.showNotification;
  var _useState107 = useState(currentUser.role === "teacher" ? ((_currentUser$classes3 = currentUser.classes) === null || _currentUser$classes3 === void 0 ? void 0 : _currentUser$classes3[0]) || "" : ((_state$classes$ = state.classes[0]) === null || _state$classes$ === void 0 ? void 0 : _state$classes$.id) || ""),
    _useState108 = _slicedToArray(_useState107, 2),
    selectedClass = _useState108[0],
    setSelectedClass = _useState108[1];
  var _useState109 = useState("First Term"),
    _useState110 = _slicedToArray(_useState109, 2),
    selectedTerm = _useState110[0],
    setSelectedTerm = _useState110[1];
  var _useState111 = useState("term"),
    _useState112 = _slicedToArray(_useState111, 2),
    viewMode = _useState112[0],
    setViewMode = _useState112[1]; // term | annual

  var availableClasses = currentUser.role === "teacher" ? state.classes.filter(function (c) {
    return (currentUser.classes || []).includes(c.id);
  }) : state.classes;
  var classStudents = state.users.filter(function (u) {
    return u.role === "student" && u.classId === selectedClass;
  });
  var subjectsTaken = _toConsumableArray(new Set(state.scores.filter(function (s) {
    return s.classId === selectedClass;
  }).map(function (s) {
    return s.subjectId;
  })));
  var ranked = rankStudents(classStudents, state.scores.filter(function (s) {
    return s.term === selectedTerm;
  }), selectedClass, state.currentSession, selectedTerm, state.gradingSystem);
  var TERM_LIST = ["First Term", "Second Term", "Third Term"];
  var isAnnual = selectedTerm === "Annual";

  // For Annual: per subject, sum each term's (ca+exam) then divide by number of terms that have a score
  var getAnnualSubjectScore = function getAnnualSubjectScore(studentId, subjectId) {
    var termScores = TERM_LIST.map(function (term) {
      return state.scores.find(function (s) {
        return s.studentId === studentId && s.subjectId === subjectId && s.classId === selectedClass && s.session === state.currentSession && s.term === term;
      });
    }).filter(Boolean);
    if (termScores.length === 0) return {
      avg: 0,
      count: 0,
      termScores: []
    };
    var sum = termScores.reduce(function (a, s) {
      return a + (s.ca || 0) + (s.exam || 0);
    }, 0);
    return {
      avg: Math.round(sum / 3 * 10) / 10,
      count: termScores.length,
      termScores: termScores
    };
  };

  // For Annual ranking: use the average of all subjects' annual averages
  var annualRanked = isAnnual ? function () {
    var withTotals = classStudents.map(function (st) {
      var subAvgs = subjectsTaken.map(function (sid) {
        return getAnnualSubjectScore(st.id, sid).avg;
      });
      var totalScore = subAvgs.reduce(function (a, v) {
        return a + v;
      }, 0);
      var avg = subjectsTaken.length > 0 ? (totalScore / subjectsTaken.length).toFixed(1) : 0;
      return _objectSpread(_objectSpread({}, st), {}, {
        totalScore: totalScore,
        avg: avg
      });
    });
    withTotals.sort(function (a, b) {
      return b.totalScore - a.totalScore;
    });
    var rank = 1;
    for (var i = 0; i < withTotals.length; i++) {
      if (i > 0 && withTotals[i].totalScore === withTotals[i - 1].totalScore) {
        withTotals[i].position = withTotals[i - 1].position;
      } else {
        withTotals[i].position = rank;
      }
      rank++;
    }
    return withTotals;
  }() : ranked;
  var displayRanked = isAnnual ? annualRanked : ranked;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "section-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-title"
  }, "Broadsheet"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "download",
    size: 16
  }), " Export PDF"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "download",
    size: 16
  }), " Export Excel"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      marginBottom: 20,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("select", {
    className: "form-input",
    style: {
      width: 160
    },
    value: selectedClass,
    onChange: function onChange(e) {
      return setSelectedClass(e.target.value);
    }
  }, availableClasses.map(function (c) {
    return /*#__PURE__*/React.createElement("option", {
      key: c.id,
      value: c.id
    }, c.name);
  })), /*#__PURE__*/React.createElement("div", {
    className: "term-selector"
  }, ["First Term", "Second Term", "Third Term", "Annual"].map(function (t) {
    return /*#__PURE__*/React.createElement("div", {
      key: t,
      className: "term-chip ".concat(selectedTerm === t ? "active" : ""),
      onClick: function onClick() {
        return setSelectedTerm(t);
      }
    }, t);
  }))), isAnnual && /*#__PURE__*/React.createElement("div", {
    className: "ai-insight",
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ai-insight-icon"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chart",
    size: 18,
    color: "white"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: COLORS.textSecondary
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: COLORS.textPrimary
    }
  }, "Annual Result:"), " Each subject score = (1st Term + 2nd Term + 3rd Term) \xF7 3. Positions are ranked by cumulative annual average.")), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12,
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "badge badge-blue"
  }, (_state$classes$find6 = state.classes.find(function (c) {
    return c.id === selectedClass;
  })) === null || _state$classes$find6 === void 0 ? void 0 : _state$classes$find6.name), /*#__PURE__*/React.createElement("span", {
    className: "badge badge-gold"
  }, selectedTerm), /*#__PURE__*/React.createElement("span", {
    className: "badge badge-gray"
  }, state.currentSession), /*#__PURE__*/React.createElement("span", {
    className: "badge badge-green"
  }, classStudents.length, " Students")), /*#__PURE__*/React.createElement("div", {
    className: "table-wrapper"
  }, /*#__PURE__*/React.createElement("table", {
    className: "broadsheet-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Pos"), /*#__PURE__*/React.createElement("th", null, "Photo"), /*#__PURE__*/React.createElement("th", null, "Name"), subjectsTaken.map(function (sid) {
    var sub = state.subjects.find(function (s) {
      return s.id === sid;
    });
    return /*#__PURE__*/React.createElement("th", {
      key: sid
    }, sub === null || sub === void 0 ? void 0 : sub.code, isAnnual ? /*#__PURE__*/React.createElement("span", {
      style: {
        display: "block",
        fontSize: 9,
        fontWeight: 400,
        opacity: 0.7
      }
    }, "\xF73") : "");
  }), /*#__PURE__*/React.createElement("th", null, "Total"), /*#__PURE__*/React.createElement("th", null, "Avg"), /*#__PURE__*/React.createElement("th", null, "Grade"))), /*#__PURE__*/React.createElement("tbody", null, displayRanked.map(function (st) {
    // Per-subject scores for display
    var subDisplayScores = isAnnual ? subjectsTaken.map(function (sid) {
      var _getAnnualSubjectScor = getAnnualSubjectScore(st.id, sid),
        avg = _getAnnualSubjectScor.avg,
        count = _getAnnualSubjectScor.count;
      return {
        score: avg,
        hasData: count > 0
      };
    }) : subjectsTaken.map(function (sid) {
      var s = state.scores.find(function (x) {
        return x.studentId === st.id && x.subjectId === sid && x.classId === selectedClass && x.session === state.currentSession && x.term === selectedTerm;
      });
      var tot = s ? (s.ca || 0) + (s.exam || 0) : 0;
      return {
        score: tot,
        hasData: !!s
      };
    });
    var totalScore = isAnnual ? st.totalScore : subDisplayScores.reduce(function (a, v) {
      return a + v.score;
    }, 0);
    var avg = isAnnual ? st.avg : subjectsTaken.length > 0 ? (totalScore / subjectsTaken.length).toFixed(1) : 0;
    var overallGrade = getGrade(Number(avg), state.gradingSystem);
    return /*#__PURE__*/React.createElement("tr", {
      key: st.id
    }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
      className: "position-badge ".concat(st.position === 1 ? "pos-1" : st.position === 2 ? "pos-2" : st.position === 3 ? "pos-3" : "pos-other")
    }, st.position)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 30,
        height: 30,
        borderRadius: "50%",
        overflow: "hidden",
        background: st.avatar ? "transparent" : "linear-gradient(135deg, var(--blue), var(--indigo))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 11,
        fontWeight: 700
      }
    }, st.avatar ? /*#__PURE__*/React.createElement("img", {
      src: st.avatar,
      alt: st.name,
      style: {
        width: "100%",
        height: "100%",
        objectFit: "cover"
      }
    }) : st.name.split(" ").map(function (n) {
      return n[0];
    }).join("").slice(0, 2))), /*#__PURE__*/React.createElement("td", {
      style: {
        fontWeight: 500,
        whiteSpace: "nowrap"
      }
    }, st.name), subDisplayScores.map(function (_ref21, i) {
      var score = _ref21.score,
        hasData = _ref21.hasData;
      var gi = getGrade(score, state.gradingSystem);
      return /*#__PURE__*/React.createElement("td", {
        key: i,
        style: {
          textAlign: "center"
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: 600
        }
      }, hasData ? score : "—"), hasData && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
        className: "grade-".concat(gi.grade),
        style: {
          fontSize: 10
        }
      }, gi.grade)));
    }), /*#__PURE__*/React.createElement("td", {
      style: {
        fontWeight: 700,
        color: COLORS.gold
      }
    }, totalScore), /*#__PURE__*/React.createElement("td", {
      style: {
        fontWeight: 600
      }
    }, avg), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
      className: "grade-".concat(overallGrade.grade)
    }, overallGrade.grade)));
  }))), displayRanked.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "empty-state"
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty-state-icon"
  }, "\uD83D\uDCCA"), /*#__PURE__*/React.createElement("div", {
    className: "empty-state-text"
  }, "No scores recorded for this selection")))));
}

// ─── MY RESULT PAGE ───────────────────────────────────────────────────────────
function MyResultPage(_ref22) {
  var _studentUser$name2;
  var state = _ref22.state,
    currentUser = _ref22.currentUser,
    updateState = _ref22.updateState;
  var _useState113 = useState(state.currentTerm),
    _useState114 = _slicedToArray(_useState113, 2),
    selectedTerm = _useState114[0],
    setSelectedTerm = _useState114[1];
  var _useState115 = useState(false),
    _useState116 = _slicedToArray(_useState115, 2),
    showPrint = _useState116[0],
    setShowPrint = _useState116[1];
  var TERM_LIST = ["First Term", "Second Term", "Third Term"];
  var isAnnual = selectedTerm === "Annual";
  var studentUser = currentUser.role === "parent" ? state.users.find(function (u) {
    return u.id === currentUser.childId;
  }) : currentUser;
  var cls = state.classes.find(function (c) {
    return c.id === (studentUser === null || studentUser === void 0 ? void 0 : studentUser.classId);
  });

  // Regular term scores
  var termScores = state.scores.filter(function (s) {
    return s.studentId === (studentUser === null || studentUser === void 0 ? void 0 : studentUser.id) && s.session === state.currentSession && s.term === selectedTerm;
  });

  // Annual: get unique subjects this student has scores for, then compute per-subject average across 3 terms
  var allStudentScores = state.scores.filter(function (s) {
    return s.studentId === (studentUser === null || studentUser === void 0 ? void 0 : studentUser.id) && s.session === state.currentSession;
  });
  var uniqueSubjectIds = _toConsumableArray(new Set(allStudentScores.map(function (s) {
    return s.subjectId;
  })));
  var annualSubjectRows = uniqueSubjectIds.map(function (sid) {
    var t1 = allStudentScores.find(function (s) {
      return s.subjectId === sid && s.term === "First Term";
    });
    var t2 = allStudentScores.find(function (s) {
      return s.subjectId === sid && s.term === "Second Term";
    });
    var t3 = allStudentScores.find(function (s) {
      return s.subjectId === sid && s.term === "Third Term";
    });
    var scores = [t1, t2, t3].filter(Boolean);
    var sum = scores.reduce(function (a, s) {
      return a + (s.ca || 0) + (s.exam || 0);
    }, 0);
    var annualAvg = scores.length > 0 ? Math.round(sum / 3 * 10) / 10 : 0;
    return {
      subjectId: sid,
      t1: t1 ? (t1.ca || 0) + (t1.exam || 0) : null,
      t2: t2 ? (t2.ca || 0) + (t2.exam || 0) : null,
      t3: t3 ? (t3.ca || 0) + (t3.exam || 0) : null,
      annualAvg: annualAvg,
      hasData: scores.length > 0
    };
  });
  var scores = isAnnual ? [] : termScores;

  // Ranking
  var rankedStudents = cls ? function () {
    var classStudents = state.users.filter(function (u) {
      return u.role === "student" && u.classId === (studentUser === null || studentUser === void 0 ? void 0 : studentUser.classId);
    });
    if (isAnnual) {
      var withTotals = classStudents.map(function (st) {
        var stSubIds = _toConsumableArray(new Set(state.scores.filter(function (s) {
          return s.studentId === st.id && s.session === state.currentSession;
        }).map(function (s) {
          return s.subjectId;
        })));
        var subAvgs = stSubIds.map(function (sid) {
          var stScores = TERM_LIST.map(function (term) {
            return state.scores.find(function (s) {
              return s.studentId === st.id && s.subjectId === sid && s.session === state.currentSession && s.term === term;
            });
          }).filter(Boolean);
          var sum = stScores.reduce(function (a, s) {
            return a + (s.ca || 0) + (s.exam || 0);
          }, 0);
          return stScores.length > 0 ? sum / 3 : 0;
        });
        var totalScore = subAvgs.reduce(function (a, v) {
          return a + v;
        }, 0);
        return _objectSpread(_objectSpread({}, st), {}, {
          totalScore: totalScore
        });
      });
      withTotals.sort(function (a, b) {
        return b.totalScore - a.totalScore;
      });
      var rank = 1;
      for (var i = 0; i < withTotals.length; i++) {
        withTotals[i].position = i > 0 && withTotals[i].totalScore === withTotals[i - 1].totalScore ? withTotals[i - 1].position : rank;
        rank++;
      }
      return withTotals;
    }
    return rankStudents(classStudents, state.scores.filter(function (s) {
      return s.term === selectedTerm;
    }), studentUser === null || studentUser === void 0 ? void 0 : studentUser.classId, state.currentSession, selectedTerm, state.gradingSystem);
  }() : [];
  var myRank = rankedStudents.find(function (r) {
    return r.id === (studentUser === null || studentUser === void 0 ? void 0 : studentUser.id);
  });

  // Stats
  var totalScore = isAnnual ? annualSubjectRows.reduce(function (a, r) {
    return a + r.annualAvg;
  }, 0) : scores.reduce(function (a, s) {
    return a + (s.ca || 0) + (s.exam || 0);
  }, 0);
  var subjectCount = isAnnual ? annualSubjectRows.filter(function (r) {
    return r.hasData;
  }).length : scores.length;
  var avg = subjectCount > 0 ? (totalScore / subjectCount).toFixed(1) : 0;
  if (showPrint) {
    var printScores = isAnnual ? annualSubjectRows.filter(function (r) {
      return r.hasData;
    }).map(function (r) {
      var _r$t, _r$t2, _r$t3;
      return {
        id: r.subjectId,
        studentId: studentUser === null || studentUser === void 0 ? void 0 : studentUser.id,
        subjectId: r.subjectId,
        ca: "—",
        exam: "—",
        annualAvg: r.annualAvg,
        isAnnual: true,
        comment: "1st: ".concat((_r$t = r.t1) !== null && _r$t !== void 0 ? _r$t : "—", " | 2nd: ").concat((_r$t2 = r.t2) !== null && _r$t2 !== void 0 ? _r$t2 : "—", " | 3rd: ").concat((_r$t3 = r.t3) !== null && _r$t3 !== void 0 ? _r$t3 : "—")
      };
    }) : scores;
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-secondary",
      style: {
        marginBottom: 16
      },
      onClick: function onClick() {
        return setShowPrint(false);
      }
    }, "\u2190 Back to Results"), /*#__PURE__*/React.createElement(ResultSheet, {
      student: studentUser,
      scores: printScores,
      term: selectedTerm,
      state: state,
      cls: cls,
      isAnnual: isAnnual
    }));
  }
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      background: "linear-gradient(135deg, rgba(37,99,235,0.12), rgba(16,185,129,0.08))",
      border: "1px solid rgba(37,99,235,0.2)",
      marginBottom: 20,
      display: "flex",
      alignItems: "center",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 72,
      height: 72,
      borderRadius: "50%",
      flexShrink: 0,
      border: "3px solid rgba(37,99,235,0.4)",
      overflow: "hidden",
      background: studentUser !== null && studentUser !== void 0 && studentUser.avatar ? "transparent" : "linear-gradient(135deg, var(--blue), var(--indigo))",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 24
    }
  }, studentUser !== null && studentUser !== void 0 && studentUser.avatar ? /*#__PURE__*/React.createElement("img", {
    src: studentUser.avatar,
    alt: studentUser === null || studentUser === void 0 ? void 0 : studentUser.name,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }) : (studentUser === null || studentUser === void 0 || (_studentUser$name2 = studentUser.name) === null || _studentUser$name2 === void 0 ? void 0 : _studentUser$name2.split(" ").map(function (n) {
    return n[0];
  }).join("").slice(0, 2)) || "?"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 18,
      fontWeight: 800
    }
  }, currentUser.role === "parent" ? "".concat(studentUser === null || studentUser === void 0 ? void 0 : studentUser.name, "'s Results") : "My Results"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: COLORS.textSecondary,
      marginTop: 2
    }
  }, cls === null || cls === void 0 ? void 0 : cls.name, " \xB7 ID: ", studentUser === null || studentUser === void 0 ? void 0 : studentUser.studentId, " \xB7 ", state.currentSession)), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: function onClick() {
      return setShowPrint(true);
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "download",
    size: 16
  }), " View / Download PDF")), /*#__PURE__*/React.createElement("div", {
    className: "term-selector",
    style: {
      marginBottom: 20
    }
  }, [].concat(_toConsumableArray(state.terms), ["Annual"]).map(function (t) {
    return /*#__PURE__*/React.createElement("div", {
      key: t,
      className: "term-chip ".concat(selectedTerm === t ? "active" : ""),
      onClick: function onClick() {
        return setSelectedTerm(t);
      }
    }, t);
  })), /*#__PURE__*/React.createElement("div", {
    className: "stats-grid",
    style: {
      marginBottom: 24
    }
  }, [{
    label: isAnnual ? "Annual Total" : "Total Score",
    value: isAnnual ? totalScore.toFixed(1) : totalScore,
    color: COLORS.blue
  }, {
    label: "Average",
    value: avg,
    color: COLORS.gold
  }, {
    label: "Position",
    value: myRank ? ordinal(myRank.position) : "—",
    color: COLORS.emerald
  }, {
    label: "Subjects",
    value: subjectCount,
    color: COLORS.rose
  }].map(function (s) {
    return /*#__PURE__*/React.createElement("div", {
      className: "stat-card",
      key: s.label
    }, /*#__PURE__*/React.createElement("div", {
      className: "stat-card-value",
      style: {
        color: s.color,
        fontSize: 28
      }
    }, s.value), /*#__PURE__*/React.createElement("div", {
      className: "stat-card-label"
    }, s.label));
  })), isAnnual && /*#__PURE__*/React.createElement("div", {
    className: "ai-insight",
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ai-insight-icon"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chart",
    size: 18,
    color: "white"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: COLORS.textSecondary
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: COLORS.textPrimary
    }
  }, "Annual Score Formula:"), " Each subject's annual score = (1st Term + 2nd Term + 3rd Term) \xF7 3. Missing terms count as 0.")), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-title",
    style: {
      marginBottom: 16
    }
  }, isAnnual ? "Annual Subject Scores" : "Subject Scores \u2014 ".concat(selectedTerm)), isAnnual ? annualSubjectRows.filter(function (r) {
    return r.hasData;
  }).length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "empty-state"
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty-state-icon"
  }, "\uD83D\uDCDA"), /*#__PURE__*/React.createElement("div", {
    className: "empty-state-text"
  }, "No annual results available yet")) : /*#__PURE__*/React.createElement("div", {
    className: "table-wrapper"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Subject"), /*#__PURE__*/React.createElement("th", null, "1st Term"), /*#__PURE__*/React.createElement("th", null, "2nd Term"), /*#__PURE__*/React.createElement("th", null, "3rd Term"), /*#__PURE__*/React.createElement("th", null, "Annual Avg \xF73"), /*#__PURE__*/React.createElement("th", null, "Grade"), /*#__PURE__*/React.createElement("th", null, "Remark"))), /*#__PURE__*/React.createElement("tbody", null, annualSubjectRows.filter(function (r) {
    return r.hasData;
  }).map(function (r) {
    var sub = state.subjects.find(function (sb) {
      return sb.id === r.subjectId;
    });
    var gi = getGrade(r.annualAvg, state.gradingSystem);
    return /*#__PURE__*/React.createElement("tr", {
      key: r.subjectId
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        fontWeight: 500
      }
    }, sub === null || sub === void 0 ? void 0 : sub.name), /*#__PURE__*/React.createElement("td", {
      style: {
        textAlign: "center",
        color: r.t1 !== null ? COLORS.textPrimary : COLORS.textMuted
      }
    }, r.t1 !== null ? r.t1 : /*#__PURE__*/React.createElement("span", {
      style: {
        color: COLORS.textMuted
      }
    }, "\u2014")), /*#__PURE__*/React.createElement("td", {
      style: {
        textAlign: "center",
        color: r.t2 !== null ? COLORS.textPrimary : COLORS.textMuted
      }
    }, r.t2 !== null ? r.t2 : /*#__PURE__*/React.createElement("span", {
      style: {
        color: COLORS.textMuted
      }
    }, "\u2014")), /*#__PURE__*/React.createElement("td", {
      style: {
        textAlign: "center",
        color: r.t3 !== null ? COLORS.textPrimary : COLORS.textMuted
      }
    }, r.t3 !== null ? r.t3 : /*#__PURE__*/React.createElement("span", {
      style: {
        color: COLORS.textMuted
      }
    }, "\u2014")), /*#__PURE__*/React.createElement("td", {
      style: {
        fontWeight: 700,
        fontSize: 16,
        textAlign: "center",
        color: COLORS.gold
      }
    }, r.annualAvg), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
      className: "grade-".concat(gi.grade)
    }, gi.grade)), /*#__PURE__*/React.createElement("td", {
      style: {
        color: gi.grade === "A" ? COLORS.emerald : gi.grade === "F" ? COLORS.rose : COLORS.textSecondary
      }
    }, gi.remark));
  })))) : scores.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "empty-state"
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty-state-icon"
  }, "\uD83D\uDCDA"), /*#__PURE__*/React.createElement("div", {
    className: "empty-state-text"
  }, "No results for this term yet")) : /*#__PURE__*/React.createElement("div", {
    className: "table-wrapper"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Subject"), /*#__PURE__*/React.createElement("th", null, "CA (40)"), /*#__PURE__*/React.createElement("th", null, "Exam (60)"), /*#__PURE__*/React.createElement("th", null, "Total"), /*#__PURE__*/React.createElement("th", null, "Grade"), /*#__PURE__*/React.createElement("th", null, "Remark"), /*#__PURE__*/React.createElement("th", null, "Comment"))), /*#__PURE__*/React.createElement("tbody", null, scores.map(function (s) {
    var sub = state.subjects.find(function (sb) {
      return sb.id === s.subjectId;
    });
    var tot = (s.ca || 0) + (s.exam || 0);
    var gi = getGrade(tot, state.gradingSystem);
    return /*#__PURE__*/React.createElement("tr", {
      key: s.id
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        fontWeight: 500
      }
    }, sub === null || sub === void 0 ? void 0 : sub.name), /*#__PURE__*/React.createElement("td", null, s.ca), /*#__PURE__*/React.createElement("td", null, s.exam), /*#__PURE__*/React.createElement("td", {
      style: {
        fontWeight: 700
      }
    }, tot), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
      className: "grade-".concat(gi.grade)
    }, gi.grade)), /*#__PURE__*/React.createElement("td", {
      style: {
        color: gi.grade === "A" ? COLORS.emerald : gi.grade === "F" ? COLORS.rose : COLORS.textSecondary
      }
    }, gi.remark), /*#__PURE__*/React.createElement("td", {
      style: {
        color: COLORS.textSecondary,
        fontSize: 13
      }
    }, s.comment));
  }))))));
}

// ─── PIN MANAGER PAGE ─────────────────────────────────────────────────────────
function PINManagerPage(_ref23) {
  var state = _ref23.state,
    updateState = _ref23.updateState,
    showNotification = _ref23.showNotification;
  var _useState117 = useState(10),
    _useState118 = _slicedToArray(_useState117, 2),
    genCount = _useState118[0],
    setGenCount = _useState118[1];
  var generatePoolPINs = function generatePoolPINs() {
    var existing = new Set(state.pinCodes.map(function (p) {
      return p.code;
    }));
    var newPins = [];
    var attempts = 0;
    while (newPins.length < genCount && attempts < 500) {
      var code = generatePinCode();
      if (!existing.has(code)) {
        existing.add(code);
        newPins.push({
          code: code,
          claimedBy: null,
          usedCount: 0
        });
      }
      attempts++;
    }
    updateState({
      pinCodes: [].concat(_toConsumableArray(state.pinCodes), newPins)
    });
    showNotification("".concat(newPins.length, " new PINs added to the pool!"));
  };
  var resetPIN = function resetPIN(code) {
    updateState({
      pinCodes: state.pinCodes.map(function (p) {
        return p.code === code ? _objectSpread(_objectSpread({}, p), {}, {
          claimedBy: null,
          usedCount: 0
        }) : p;
      })
    });
    showNotification("PIN reset.");
  };
  var deletePIN = function deletePIN(code) {
    updateState({
      pinCodes: state.pinCodes.filter(function (p) {
        return p.code !== code;
      })
    });
    showNotification("PIN deleted.");
  };
  var downloadPINs = function downloadPINs() {
    var availPins = state.pinCodes.filter(function (p) {
      return p.usedCount < 3;
    });
    var institutionName = state.institution.name;
    var html = "<!DOCTYPE html>\n<html>\n<head>\n<meta charset=\"utf-8\"/>\n<title>".concat(institutionName, " \u2014 Result Checker PINs</title>\n<style>\n  * { margin:0; padding:0; box-sizing:border-box; }\n  body { font-family: 'Georgia', serif; background: #f0f4ff; padding: 24px; }\n  .header { text-align:center; margin-bottom:28px; }\n  .school-name { font-size:26px; font-weight:700; color:#1B3A8F; }\n  .sub { font-size:13px; color:#555; margin-top:6px; }\n  .watermark { font-size:11px; color:#999; margin-top:4px; }\n  .grid { display:grid; grid-template-columns: repeat(3,1fr); gap:14px; }\n  .pin-card {\n    background:white; border:2px solid #1B3A8F; border-radius:12px;\n    padding:16px 12px; text-align:center;\n    box-shadow: 0 2px 8px rgba(27,58,143,0.12);\n  }\n  .pin-label { font-size:11px; color:#666; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:8px; }\n  .pin-code { font-size:22px; font-weight:800; color:#1B3A8F; letter-spacing:0.12em; font-family:monospace; }\n  .pin-school { font-size:10px; color:#999; margin-top:6px; }\n  .pin-uses { font-size:11px; color:#10B981; margin-top:4px; font-weight:600; }\n  .status-claimed { border-color:#F59E0B; }\n  .status-claimed .pin-code { color:#D97706; }\n  .status-exhausted { border-color:#F43F5E; opacity:0.6; }\n  .footer { text-align:center; margin-top:28px; font-size:11px; color:#999; }\n  @media print { body { background:white; padding:0; } }\n</style>\n</head>\n<body>\n<div class=\"header\">\n  <div class=\"school-name\">\uD83C\uDFEB ").concat(institutionName, "</div>\n  <div class=\"sub\">Result Checker PIN Codes \u2014 ").concat(state.currentSession, "</div>\n  <div class=\"watermark\">Generated: ").concat(new Date().toLocaleDateString(), " \xB7 Total PINs: ").concat(availPins.length, " active</div>\n</div>\n<div class=\"grid\">\n").concat(state.pinCodes.map(function (p) {
      var cls = p.claimedBy ? state.users.find(function (u) {
        return u.id === p.claimedBy;
      }) : null;
      var statusClass = p.usedCount >= 3 ? 'status-exhausted' : p.claimedBy ? 'status-claimed' : '';
      var remaining = 3 - p.usedCount;
      return "  <div class=\"pin-card ".concat(statusClass, "\">\n    <div class=\"pin-label\">Result Checker PIN</div>\n    <div class=\"pin-code\">").concat(p.code, "</div>\n    <div class=\"pin-school\">").concat(institutionName, "</div>\n    <div class=\"pin-uses\">").concat(p.usedCount >= 3 ? '❌ Exhausted' : p.claimedBy ? "\u2705 Claimed \xB7 ".concat(remaining, " use").concat(remaining !== 1 ? 's' : '', " left") : "\uD83D\uDFE2 Available \xB7 3 uses", "</div>\n    ").concat(cls ? "<div style=\"font-size:10px;color:#888;margin-top:3px\">by ".concat(cls.name, "</div>") : '', "\n  </div>");
    }).join('\n'), "\n</div>\n<div class=\"footer\">SARMS \xB7 ").concat(institutionName, " \xB7 Confidential \u2014 Do not share PIN codes publicly</div>\n</body></html>");
    var blob = new Blob([html], {
      type: "text/html"
    });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "PIN_Codes_".concat(state.currentSession.replace("/", "-"), ".html");
    a.click();
    URL.revokeObjectURL(url);
    showNotification("PINs downloaded! Open the HTML file and print to PDF.");
  };
  var pool = state.pinCodes;
  var available = pool.filter(function (p) {
    return !p.claimedBy && p.usedCount === 0;
  }).length;
  var claimed = pool.filter(function (p) {
    return p.claimedBy && p.usedCount < 3;
  }).length;
  var exhausted = pool.filter(function (p) {
    return p.usedCount >= 3;
  }).length;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "section-header"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "section-title"
  }, "PIN Manager"), /*#__PURE__*/React.createElement("div", {
    className: "section-sub"
  }, "Pool-based \xB7 PINs are not pre-assigned \u2014 first user claims it \xB7 Max 3 uses each")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary",
    onClick: downloadPINs
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "download",
    size: 16
  }), " Download PINs"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-gold",
    onClick: generatePoolPINs
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 16
  }), " Generate ", genCount, " PINs"))), /*#__PURE__*/React.createElement("div", {
    className: "stats-grid",
    style: {
      marginBottom: 20
    }
  }, [{
    label: "Total PINs",
    value: pool.length,
    color: COLORS.blue
  }, {
    label: "Available",
    value: available,
    color: COLORS.emerald
  }, {
    label: "Claimed (Active)",
    value: claimed,
    color: COLORS.gold
  }, {
    label: "Exhausted",
    value: exhausted,
    color: COLORS.rose
  }].map(function (s) {
    return /*#__PURE__*/React.createElement("div", {
      className: "stat-card",
      key: s.label
    }, /*#__PURE__*/React.createElement("div", {
      className: "stat-card-value",
      style: {
        color: s.color,
        fontSize: 28
      }
    }, s.value), /*#__PURE__*/React.createElement("div", {
      className: "stat-card-label"
    }, s.label));
  })), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      marginBottom: 12
    }
  }, "Generate New PINs"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      alignItems: "center",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: COLORS.textSecondary
    }
  }, "Quantity:"), [5, 10, 20, 50, 100].map(function (n) {
    return /*#__PURE__*/React.createElement("button", {
      key: n,
      className: "btn btn-sm ".concat(genCount === n ? "btn-primary" : "btn-secondary"),
      onClick: function onClick() {
        return setGenCount(n);
      }
    }, n);
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-gold",
    onClick: generatePoolPINs
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "pin",
    size: 16
  }), " Generate ", genCount, " PINs")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: COLORS.textMuted,
      marginTop: 10
    }
  }, "PINs are generated randomly. They are NOT assigned to any student. The first student who uses a PIN claims it \u2014 that PIN can then only be used by the same student up to 3 times total.")), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "table-wrapper"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "PIN Code"), /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", null, "Claimed By"), /*#__PURE__*/React.createElement("th", null, "Uses"), /*#__PURE__*/React.createElement("th", null, "Remaining"), /*#__PURE__*/React.createElement("th", null, "Actions"))), /*#__PURE__*/React.createElement("tbody", null, pool.map(function (p) {
    var claimer = p.claimedBy ? state.users.find(function (u) {
      return u.id === p.claimedBy;
    }) : null;
    var remaining = 3 - p.usedCount;
    var isExhausted = p.usedCount >= 3;
    var isClaimed = !!p.claimedBy;
    return /*#__PURE__*/React.createElement("tr", {
      key: p.code
    }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("code", {
      style: {
        background: isExhausted ? "rgba(244,63,94,0.1)" : isClaimed ? "rgba(245,158,11,0.1)" : "rgba(16,185,129,0.1)",
        color: isExhausted ? COLORS.rose : isClaimed ? COLORS.gold : COLORS.emerald,
        padding: "3px 10px",
        borderRadius: 6,
        fontSize: 14,
        fontWeight: 800,
        letterSpacing: "0.1em"
      }
    }, p.code)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
      className: isExhausted ? "badge badge-red" : isClaimed ? "badge badge-gold" : "badge badge-green"
    }, isExhausted ? "Exhausted" : isClaimed ? "Claimed" : "Available")), /*#__PURE__*/React.createElement("td", {
      style: {
        color: COLORS.textSecondary
      }
    }, claimer ? claimer.name : /*#__PURE__*/React.createElement("span", {
      style: {
        color: COLORS.textMuted,
        fontStyle: "italic"
      }
    }, "Unclaimed")), /*#__PURE__*/React.createElement("td", {
      style: {
        textAlign: "center"
      }
    }, p.usedCount, "/3"), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 3
      }
    }, [0, 1, 2].map(function (i) {
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: i < remaining ? COLORS.emerald : COLORS.border
        }
      });
    }))), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-success btn-sm",
      onClick: function onClick() {
        return resetPIN(p.code);
      },
      title: "Reset PIN"
    }, "Reset"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-danger btn-sm btn-icon",
      onClick: function onClick() {
        return deletePIN(p.code);
      },
      title: "Delete PIN"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "trash",
      size: 13
    })))));
  }))), pool.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "empty-state"
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty-state-icon"
  }, "\uD83D\uDD11"), /*#__PURE__*/React.createElement("div", {
    className: "empty-state-text"
  }, "No PINs in pool yet. Generate some above.")))));
}

// ─── AUDIT TRAIL PAGE ─────────────────────────────────────────────────────────
function AuditTrailPage(_ref24) {
  var state = _ref24.state;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "section-header"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "section-title"
  }, "Audit Trail"), /*#__PURE__*/React.createElement("div", {
    className: "section-sub"
  }, state.auditTrail.length, " events recorded"))), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "table-wrapper"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Timestamp"), /*#__PURE__*/React.createElement("th", null, "User"), /*#__PURE__*/React.createElement("th", null, "Action"), /*#__PURE__*/React.createElement("th", null, "Details"))), /*#__PURE__*/React.createElement("tbody", null, state.auditTrail.map(function (a) {
    return /*#__PURE__*/React.createElement("tr", {
      key: a.id
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        color: COLORS.textSecondary,
        fontSize: 12,
        whiteSpace: "nowrap"
      }
    }, new Date(a.timestamp).toLocaleString()), /*#__PURE__*/React.createElement("td", {
      style: {
        fontWeight: 500
      }
    }, a.userName), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
      className: "badge badge-blue"
    }, a.action)), /*#__PURE__*/React.createElement("td", {
      style: {
        color: COLORS.textSecondary
      }
    }, a.details));
  }))), state.auditTrail.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "empty-state"
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty-state-icon"
  }, "\uD83D\uDCCB"), /*#__PURE__*/React.createElement("div", {
    className: "empty-state-text"
  }, "No audit records yet")))));
}

// ─── INSTITUTION PAGE ─────────────────────────────────────────────────────────
function InstitutionPage(_ref25) {
  var state = _ref25.state,
    updateState = _ref25.updateState,
    showNotification = _ref25.showNotification;
  var _useState119 = useState(_objectSpread({}, state.institution)),
    _useState120 = _slicedToArray(_useState119, 2),
    form = _useState120[0],
    setForm = _useState120[1];
  var _useState121 = useState(""),
    _useState122 = _slicedToArray(_useState121, 2),
    newSession = _useState122[0],
    setNewSession = _useState122[1];
  var _useState123 = useState(""),
    _useState124 = _slicedToArray(_useState123, 2),
    sessionError = _useState124[0],
    setSessionError = _useState124[1];
  var sigRef = useRef(null);
  var logoRef = useRef(null);
  var handleImageUpload = function handleImageUpload(field, file) {
    var reader = new FileReader();
    reader.onload = function (e) {
      return setForm(function (prev) {
        return _objectSpread(_objectSpread({}, prev), {}, _defineProperty({}, field, e.target.result));
      });
    };
    reader.readAsDataURL(file);
  };

  // Validate format: YYYY/YYYY where second year = first + 1
  var validateSession = function validateSession(val) {
    var trimmed = val.trim();
    var match = trimmed.match(/^(\d{4})\/(\d{4})$/);
    if (!match) return "Format must be YYYY/YYYY (e.g. 2030/2031)";
    var y1 = parseInt(match[1]),
      y2 = parseInt(match[2]);
    if (y2 !== y1 + 1) return "Second year must be ".concat(y1 + 1);
    if (state.sessions.includes(trimmed)) return "Session already exists";
    return "";
  };
  var addSession = function addSession() {
    var err = validateSession(newSession);
    if (err) {
      setSessionError(err);
      return;
    }
    var trimmed = newSession.trim();
    var updated = [].concat(_toConsumableArray(state.sessions), [trimmed]).sort();
    updateState({
      sessions: updated,
      currentSession: trimmed
    });
    setNewSession("");
    setSessionError("");
    showNotification("Session ".concat(trimmed, " added and set as active!"));
  };
  var removeSession = function removeSession(s) {
    if (state.sessions.length === 1) {
      showNotification("Cannot remove the only session.", "error");
      return;
    }
    var updated = state.sessions.filter(function (x) {
      return x !== s;
    });
    var newCurrent = s === state.currentSession ? updated[updated.length - 1] : state.currentSession;
    updateState({
      sessions: updated,
      currentSession: newCurrent
    });
    showNotification("Session ".concat(s, " removed."));
  };
  var setActiveSession = function setActiveSession(s) {
    updateState({
      currentSession: s
    });
    showNotification("Active session set to ".concat(s));
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "section-title",
    style: {
      marginBottom: 20
    }
  }, "Institution Settings"), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 15,
      marginBottom: 16,
      color: COLORS.blueLight
    }
  }, "School Information"), /*#__PURE__*/React.createElement("div", {
    className: "grid-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "School Name"), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    value: form.name,
    onChange: function onChange(e) {
      return setForm(_objectSpread(_objectSpread({}, form), {}, {
        name: e.target.value
      }));
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Principal / Head Teacher"), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    value: form.principal,
    onChange: function onChange(e) {
      return setForm(_objectSpread(_objectSpread({}, form), {}, {
        principal: e.target.value
      }));
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Address"), /*#__PURE__*/React.createElement("textarea", {
    className: "form-input",
    rows: 2,
    value: form.address,
    onChange: function onChange(e) {
      return setForm(_objectSpread(_objectSpread({}, form), {}, {
        address: e.target.value
      }));
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Current Term"), /*#__PURE__*/React.createElement("select", {
    className: "form-input",
    style: {
      maxWidth: 220
    },
    value: state.currentTerm,
    onChange: function onChange(e) {
      return updateState({
        currentTerm: e.target.value
      });
    }
  }, state.terms.map(function (t) {
    return /*#__PURE__*/React.createElement("option", {
      key: t
    }, t);
  }))), /*#__PURE__*/React.createElement("div", {
    className: "grid-2",
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "School Logo"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 64,
      height: 64,
      borderRadius: 10,
      border: "2px dashed var(--border)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      background: "rgba(0,0,0,0.2)",
      flexShrink: 0
    }
  }, form.logo ? /*#__PURE__*/React.createElement("img", {
    src: form.logo,
    alt: "Logo",
    style: {
      width: "100%",
      height: "100%",
      objectFit: "contain"
    }
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 28
    }
  }, "\uD83C\uDFEB")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: "image/*",
    ref: logoRef,
    style: {
      display: "none"
    },
    onChange: function onChange(e) {
      return e.target.files[0] && handleImageUpload("logo", e.target.files[0]);
    }
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-sm",
    onClick: function onClick() {
      var _logoRef$current;
      return (_logoRef$current = logoRef.current) === null || _logoRef$current === void 0 ? void 0 : _logoRef$current.click();
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "upload",
    size: 14
  }), " Upload Logo"), form.logo && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-danger btn-sm",
    style: {
      marginTop: 6
    },
    onClick: function onClick() {
      return setForm(function (p) {
        return _objectSpread(_objectSpread({}, p), {}, {
          logo: null
        });
      });
    }
  }, "Remove")))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Principal's Signature"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 120,
      height: 56,
      borderRadius: 8,
      border: "2px dashed var(--border)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      background: "rgba(0,0,0,0.2)",
      flexShrink: 0
    }
  }, form.signature ? /*#__PURE__*/React.createElement("img", {
    src: form.signature,
    alt: "Signature",
    style: {
      width: "100%",
      height: "100%",
      objectFit: "contain"
    }
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: COLORS.textMuted,
      padding: "0 8px",
      textAlign: "center"
    }
  }, "No signature yet")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: "image/*",
    ref: sigRef,
    style: {
      display: "none"
    },
    onChange: function onChange(e) {
      return e.target.files[0] && handleImageUpload("signature", e.target.files[0]);
    }
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-sm",
    onClick: function onClick() {
      var _sigRef$current;
      return (_sigRef$current = sigRef.current) === null || _sigRef$current === void 0 ? void 0 : _sigRef$current.click();
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "upload",
    size: 14
  }), " Upload Signature"), form.signature && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-danger btn-sm",
    style: {
      marginTop: 6
    },
    onClick: function onClick() {
      return setForm(function (p) {
        return _objectSpread(_objectSpread({}, p), {}, {
          signature: null
        });
      });
    }
  }, "Remove"))))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Principal's Standard Comment (appears on result sheets)"), /*#__PURE__*/React.createElement("textarea", {
    className: "form-input",
    rows: 3,
    placeholder: "e.g. Diligence and hard work are keys to success. Keep striving for excellence!",
    value: form.principalComment || "",
    onChange: function onChange(e) {
      return setForm(_objectSpread(_objectSpread({}, form), {}, {
        principalComment: e.target.value
      }));
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: function onClick() {
      updateState({
        institution: form
      });
      showNotification("Institution settings saved!");
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 16
  }), " Save Changes"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-danger",
    onClick: /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8() {
      var _t5;
      return _regenerator().w(function (_context8) {
        while (1) switch (_context8.p = _context8.n) {
          case 0:
            if (!window.confirm("⚠️ This will erase ALL data (students, scores, settings) and reset to factory defaults. This cannot be undone.\n\nAre you sure?")) {
              _context8.n = 5;
              break;
            }
            _context8.p = 1;
            _context8.n = 2;
            return fetch("api/db.php?action=reset_all", {
              method: "POST"
            });
          case 2:
            _context8.n = 4;
            break;
          case 3:
            _context8.p = 3;
            _t5 = _context8.v;
          case 4:
            window.location.reload();
          case 5:
            return _context8.a(2);
        }
      }, _callee8, null, [[1, 3]]);
    }))
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "trash",
    size: 16
  }), " Reset All Data"))), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 15,
      marginBottom: 4,
      color: COLORS.blueLight
    }
  }, "Academic Sessions"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: COLORS.textSecondary,
      marginBottom: 16
    }
  }, "Add, remove, or switch the active academic session. The active session controls all score entries and result views."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      alignItems: "flex-start",
      marginBottom: 20,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 200
    }
  }, /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    placeholder: "e.g. 2030/2031",
    value: newSession,
    onChange: function onChange(e) {
      setNewSession(e.target.value);
      setSessionError("");
    },
    onKeyDown: function onKeyDown(e) {
      return e.key === "Enter" && addSession();
    },
    style: {
      borderColor: sessionError ? COLORS.rose : undefined
    }
  }), sessionError && /*#__PURE__*/React.createElement("div", {
    style: {
      color: COLORS.rose,
      fontSize: 12,
      marginTop: 5
    }
  }, sessionError), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: COLORS.textMuted,
      marginTop: 4
    }
  }, "Format: YYYY/YYYY \u2014 e.g. 2030/2031")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: addSession
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 16
  }), " Add Session")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, _toConsumableArray(state.sessions).sort().map(function (s) {
    var isActive = s === state.currentSession;
    return /*#__PURE__*/React.createElement("div", {
      key: s,
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px",
        borderRadius: 10,
        background: isActive ? "linear-gradient(135deg, rgba(37,99,235,0.18), rgba(27,58,143,0.12))" : "rgba(0,0,0,0.2)",
        border: isActive ? "1px solid rgba(37,99,235,0.35)" : "1px solid var(--border)",
        transition: "all 0.2s"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 10,
        height: 10,
        borderRadius: "50%",
        flexShrink: 0,
        background: isActive ? COLORS.emerald : COLORS.border,
        boxShadow: isActive ? "0 0 8px ".concat(COLORS.emerald) : "none"
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 15,
        color: isActive ? COLORS.textPrimary : COLORS.textSecondary
      }
    }, s), isActive && /*#__PURE__*/React.createElement("span", {
      className: "badge badge-green",
      style: {
        fontSize: 11
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 11
    }), " Active")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 8
      }
    }, !isActive && /*#__PURE__*/React.createElement("button", {
      className: "btn btn-success btn-sm",
      onClick: function onClick() {
        return setActiveSession(s);
      }
    }, "Set Active"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-danger btn-sm btn-icon",
      onClick: function onClick() {
        return removeSession(s);
      },
      disabled: isActive,
      title: isActive ? "Cannot delete the active session" : "Delete ".concat(s)
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "trash",
      size: 14
    }))));
  }))), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-title",
    style: {
      marginBottom: 16
    }
  }, "Promotion Management"), /*#__PURE__*/React.createElement("div", {
    className: "ai-insight"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ai-insight-icon"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "promote",
    size: 18,
    color: "white"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      marginBottom: 4
    }
  }, "Auto-Promote Students"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: COLORS.textSecondary
    }
  }, "Move all students to their next class level at the end of the academic session."), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-gold",
    style: {
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "promote",
    size: 16
  }), " Run Auto-Promotion")))));
}

// ─── GRADING PAGE ─────────────────────────────────────────────────────────────
function GradingPage(_ref27) {
  var state = _ref27.state,
    updateState = _ref27.updateState,
    showNotification = _ref27.showNotification;
  var _useState125 = useState(_toConsumableArray(state.gradingSystem)),
    _useState126 = _slicedToArray(_useState125, 2),
    grading = _useState126[0],
    setGrading = _useState126[1];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "section-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-title"
  }, "Grading System"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: function onClick() {
      updateState({
        gradingSystem: grading
      });
      showNotification("Grading system updated!");
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 16
  }), " Save")), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Grade"), /*#__PURE__*/React.createElement("th", null, "Min Score"), /*#__PURE__*/React.createElement("th", null, "Max Score"), /*#__PURE__*/React.createElement("th", null, "Remark"))), /*#__PURE__*/React.createElement("tbody", null, grading.map(function (g, i) {
    return /*#__PURE__*/React.createElement("tr", {
      key: i
    }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
      className: "grade-".concat(g.grade)
    }, g.grade)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("input", {
      type: "number",
      className: "score-input",
      value: g.min,
      onChange: function onChange(e) {
        return setGrading(grading.map(function (x, j) {
          return j === i ? _objectSpread(_objectSpread({}, x), {}, {
            min: Number(e.target.value)
          }) : x;
        }));
      }
    })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("input", {
      type: "number",
      className: "score-input",
      value: g.max,
      onChange: function onChange(e) {
        return setGrading(grading.map(function (x, j) {
          return j === i ? _objectSpread(_objectSpread({}, x), {}, {
            max: Number(e.target.value)
          }) : x;
        }));
      }
    })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("input", {
      className: "form-input",
      style: {
        width: 150
      },
      value: g.remark,
      onChange: function onChange(e) {
        return setGrading(grading.map(function (x, j) {
          return j === i ? _objectSpread(_objectSpread({}, x), {}, {
            remark: e.target.value
          }) : x;
        }));
      }
    })));
  })))));
}

// ─── ASSIGNMENTS PAGE ──────────────────────────────────────────────────────────
function AssignmentsPage(_ref28) {
  var state = _ref28.state,
    updateState = _ref28.updateState,
    currentUser = _ref28.currentUser,
    showNotification = _ref28.showNotification;
  var _useState127 = useState(currentUser.role === "teacher" ? "post" : "mine"),
    _useState128 = _slicedToArray(_useState127, 2),
    tab = _useState128[0],
    setTab = _useState128[1];
  var _useState129 = useState({
      title: "",
      description: "",
      classId: "",
      subjectId: "",
      dueDate: "",
      file: null,
      fileName: ""
    }),
    _useState130 = _slicedToArray(_useState129, 2),
    form = _useState130[0],
    setForm = _useState130[1];
  var _useState131 = useState({}),
    _useState132 = _slicedToArray(_useState131, 2),
    submissionText = _useState132[0],
    setSubmissionText = _useState132[1];
  var _useState133 = useState({}),
    _useState134 = _slicedToArray(_useState133, 2),
    submissionFile = _useState134[0],
    setSubmissionFile = _useState134[1];
  var fileRef = useRef(null);
  var subFileRef = useRef(null);
  var isTeacher = currentUser.role === "teacher";
  var isStudent = currentUser.role === "student";
  var isParent = currentUser.role === "parent";
  var studentUser = isParent ? state.users.find(function (u) {
    return u.id === currentUser.childId;
  }) : currentUser;
  var assignments = state.assignments || [];

  // Teacher: classes/subjects they teach
  var myClasses = isTeacher ? state.classes.filter(function (c) {
    return (currentUser.classes || []).includes(c.id);
  }) : state.classes;
  var mySubjects = isTeacher ? state.subjects.filter(function (s) {
    return (currentUser.subjects || []).includes(s.id);
  }) : state.subjects;

  // Student/Parent: assignments for their class
  var myAssignments = assignments.filter(function (a) {
    return a.classId === (studentUser === null || studentUser === void 0 ? void 0 : studentUser.classId);
  });

  // Teacher: assignments they posted
  var postedAssignments = assignments.filter(function (a) {
    return a.teacherId === currentUser.id;
  });
  var handleFileChange = function handleFileChange(e) {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function (ev) {
      return setForm(function (p) {
        return _objectSpread(_objectSpread({}, p), {}, {
          file: ev.target.result,
          fileName: file.name
        });
      });
    };
    reader.readAsDataURL(file);
  };
  var handleSubFileChange = function handleSubFileChange(e, assignmentId) {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function (ev) {
      return setSubmissionFile(function (p) {
        return _objectSpread(_objectSpread({}, p), {}, _defineProperty({}, assignmentId, {
          data: ev.target.result,
          name: file.name
        }));
      });
    };
    reader.readAsDataURL(file);
  };
  var postAssignment = function postAssignment() {
    if (!form.title || !form.classId || !form.subjectId || !form.dueDate) {
      showNotification("Please fill all required fields", "error");
      return;
    }
    var newA = {
      id: generateId(),
      title: form.title,
      description: form.description,
      classId: form.classId,
      subjectId: form.subjectId,
      dueDate: form.dueDate,
      file: form.file,
      fileName: form.fileName,
      teacherId: currentUser.id,
      teacherName: currentUser.name,
      postedAt: new Date().toISOString(),
      submissions: []
    };
    updateState({
      assignments: [newA].concat(_toConsumableArray(state.assignments || []))
    });
    setForm({
      title: "",
      description: "",
      classId: "",
      subjectId: "",
      dueDate: "",
      file: null,
      fileName: ""
    });
    showNotification("Assignment posted successfully!");
    setTab("posted");
  };
  var submitAssignment = function submitAssignment(assignmentId) {
    var text = submissionText[assignmentId] || "";
    var fileSub = submissionFile[assignmentId];
    if (!text && !fileSub) {
      showNotification("Add a response or upload a file", "error");
      return;
    }
    var submission = {
      studentId: studentUser.id,
      studentName: studentUser.name,
      text: text,
      file: (fileSub === null || fileSub === void 0 ? void 0 : fileSub.data) || null,
      fileName: (fileSub === null || fileSub === void 0 ? void 0 : fileSub.name) || null,
      submittedAt: new Date().toISOString()
    };
    var updated = (state.assignments || []).map(function (a) {
      return a.id === assignmentId ? _objectSpread(_objectSpread({}, a), {}, {
        submissions: [].concat(_toConsumableArray((a.submissions || []).filter(function (s) {
          return s.studentId !== studentUser.id;
        })), [submission])
      }) : a;
    });
    updateState({
      assignments: updated
    });
    setSubmissionText(function (p) {
      return _objectSpread(_objectSpread({}, p), {}, _defineProperty({}, assignmentId, ""));
    });
    setSubmissionFile(function (p) {
      var n = _objectSpread({}, p);
      delete n[assignmentId];
      return n;
    });
    showNotification("Assignment submitted!");
  };
  var deleteAssignment = function deleteAssignment(id) {
    updateState({
      assignments: (state.assignments || []).filter(function (a) {
        return a.id !== id;
      })
    });
    showNotification("Assignment deleted.");
  };
  var AssignmentCard = function AssignmentCard(_ref29) {
    var a = _ref29.a,
      showSubmissions = _ref29.showSubmissions;
    var cls = state.classes.find(function (c) {
      return c.id === a.classId;
    });
    var sub = state.subjects.find(function (s) {
      return s.id === a.subjectId;
    });
    var mySubmission = (a.submissions || []).find(function (s) {
      return s.studentId === (studentUser === null || studentUser === void 0 ? void 0 : studentUser.id);
    });
    var isOverdue = new Date(a.dueDate) < new Date();
    var subFileInputId = "subfile-".concat(a.id);
    return /*#__PURE__*/React.createElement("div", {
      className: "card",
      style: {
        marginBottom: 16,
        borderLeft: "4px solid ".concat(isOverdue ? COLORS.rose : COLORS.blue)
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 16
      }
    }, a.title), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 8,
        marginTop: 6,
        flexWrap: "wrap"
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "badge badge-blue"
    }, cls === null || cls === void 0 ? void 0 : cls.name), /*#__PURE__*/React.createElement("span", {
      className: "badge badge-gold"
    }, sub === null || sub === void 0 ? void 0 : sub.name), /*#__PURE__*/React.createElement("span", {
      className: "badge ".concat(isOverdue ? "badge-red" : "badge-green")
    }, "Due: ", new Date(a.dueDate).toLocaleDateString()), /*#__PURE__*/React.createElement("span", {
      className: "badge badge-gray"
    }, "By ", a.teacherName))), isTeacher && a.teacherId === currentUser.id && /*#__PURE__*/React.createElement("button", {
      className: "btn btn-danger btn-sm btn-icon",
      onClick: function onClick() {
        return deleteAssignment(a.id);
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "trash",
      size: 14
    }))), a.description && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        color: COLORS.textSecondary,
        lineHeight: 1.6,
        marginBottom: 12
      }
    }, a.description), a.file && /*#__PURE__*/React.createElement("a", {
      href: a.file,
      download: a.fileName,
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        color: COLORS.blueLight,
        fontSize: 13,
        fontWeight: 600,
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "download",
      size: 14
    }), " ", a.fileName || "Download Attachment"), showSubmissions && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 12,
        borderTop: "1px solid var(--border)",
        paddingTop: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 600,
        marginBottom: 8,
        fontSize: 13
      }
    }, "Submissions (", (a.submissions || []).length, ")"), (a.submissions || []).length === 0 ? /*#__PURE__*/React.createElement("div", {
      style: {
        color: COLORS.textMuted,
        fontSize: 13
      }
    }, "No submissions yet.") : (a.submissions || []).map(function (s) {
      return /*#__PURE__*/React.createElement("div", {
        key: s.studentId,
        style: {
          padding: "8px 12px",
          background: "rgba(16,185,129,0.08)",
          borderRadius: 8,
          marginBottom: 6,
          border: "1px solid rgba(16,185,129,0.2)"
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontWeight: 600,
          fontSize: 13
        }
      }, s.studentName), s.text && /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 13,
          color: COLORS.textSecondary,
          marginTop: 4
        }
      }, s.text), s.file && /*#__PURE__*/React.createElement("a", {
        href: s.file,
        download: s.fileName,
        style: {
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          color: COLORS.blueLight,
          fontSize: 12,
          marginTop: 4
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "download",
        size: 12
      }), " ", s.fileName), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 11,
          color: COLORS.textMuted,
          marginTop: 4
        }
      }, "Submitted: ", new Date(s.submittedAt).toLocaleString()));
    })), (isStudent || isParent) && !mySubmission && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 12,
        borderTop: "1px solid var(--border)",
        paddingTop: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 600,
        fontSize: 13,
        marginBottom: 8
      }
    }, "Submit Your Work"), /*#__PURE__*/React.createElement("textarea", {
      className: "form-input",
      rows: 3,
      placeholder: "Type your answer or response here...",
      value: submissionText[a.id] || "",
      onChange: function onChange(e) {
        return setSubmissionText(function (p) {
          return _objectSpread(_objectSpread({}, p), {}, _defineProperty({}, a.id, e.target.value));
        });
      },
      style: {
        marginBottom: 8
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 8,
        alignItems: "center",
        flexWrap: "wrap"
      }
    }, /*#__PURE__*/React.createElement("input", {
      type: "file",
      id: subFileInputId,
      style: {
        display: "none"
      },
      onChange: function onChange(e) {
        return handleSubFileChange(e, a.id);
      }
    }), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-secondary btn-sm",
      onClick: function onClick() {
        var _document$getElementB;
        return (_document$getElementB = document.getElementById(subFileInputId)) === null || _document$getElementB === void 0 ? void 0 : _document$getElementB.click();
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "upload",
      size: 14
    }), " Attach File"), submissionFile[a.id] && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: COLORS.emerald
      }
    }, "\uD83D\uDCCE ", submissionFile[a.id].name), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary btn-sm",
      onClick: function onClick() {
        return submitAssignment(a.id);
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 14
    }), " Submit"))), (isStudent || isParent) && mySubmission && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 12,
        padding: "10px 14px",
        background: "rgba(16,185,129,0.1)",
        borderRadius: 8,
        border: "1px solid rgba(16,185,129,0.25)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 600,
        color: COLORS.emerald,
        fontSize: 13
      }
    }, "\u2705 Submitted"), mySubmission.text && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: COLORS.textSecondary,
        marginTop: 4
      }
    }, mySubmission.text.slice(0, 100), "\u2026"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: COLORS.textMuted,
        marginTop: 4
      }
    }, new Date(mySubmission.submittedAt).toLocaleString())));
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "section-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-title"
  }, "Assignments"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: COLORS.textSecondary
    }
  }, isTeacher ? "Post take-home assignments for your classes" : "View and submit your assignments")), isTeacher && /*#__PURE__*/React.createElement("div", {
    className: "tabs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tab ".concat(tab === "post" ? "active" : ""),
    onClick: function onClick() {
      return setTab("post");
    }
  }, "Post Assignment"), /*#__PURE__*/React.createElement("div", {
    className: "tab ".concat(tab === "posted" ? "active" : ""),
    onClick: function onClick() {
      return setTab("posted");
    }
  }, "My Posted (", postedAssignments.length, ")")), isTeacher && tab === "post" && /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 16,
      marginBottom: 16
    }
  }, "New Assignment"), /*#__PURE__*/React.createElement("div", {
    className: "grid-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Title *"), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    value: form.title,
    onChange: function onChange(e) {
      return setForm(_objectSpread(_objectSpread({}, form), {}, {
        title: e.target.value
      }));
    },
    placeholder: "e.g. Mathematics Take-Home Exercise 3"
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Due Date *"), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    type: "date",
    value: form.dueDate,
    onChange: function onChange(e) {
      return setForm(_objectSpread(_objectSpread({}, form), {}, {
        dueDate: e.target.value
      }));
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Class *"), /*#__PURE__*/React.createElement("select", {
    className: "form-input",
    value: form.classId,
    onChange: function onChange(e) {
      return setForm(_objectSpread(_objectSpread({}, form), {}, {
        classId: e.target.value
      }));
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "\u2014 Select Class \u2014"), myClasses.map(function (c) {
    return /*#__PURE__*/React.createElement("option", {
      key: c.id,
      value: c.id
    }, c.name);
  }))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Subject *"), /*#__PURE__*/React.createElement("select", {
    className: "form-input",
    value: form.subjectId,
    onChange: function onChange(e) {
      return setForm(_objectSpread(_objectSpread({}, form), {}, {
        subjectId: e.target.value
      }));
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "\u2014 Select Subject \u2014"), mySubjects.map(function (s) {
    return /*#__PURE__*/React.createElement("option", {
      key: s.id,
      value: s.id
    }, s.name);
  })))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Instructions / Description"), /*#__PURE__*/React.createElement("textarea", {
    className: "form-input",
    rows: 4,
    value: form.description,
    onChange: function onChange(e) {
      return setForm(_objectSpread(_objectSpread({}, form), {}, {
        description: e.target.value
      }));
    },
    placeholder: "Describe the assignment, questions, or instructions for students..."
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Attachment (optional \u2014 PDF, Word, image)"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "file",
    ref: fileRef,
    style: {
      display: "none"
    },
    onChange: handleFileChange
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary",
    onClick: function onClick() {
      var _fileRef$current;
      return (_fileRef$current = fileRef.current) === null || _fileRef$current === void 0 ? void 0 : _fileRef$current.click();
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "upload",
    size: 16
  }), " Upload File"), form.fileName && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: COLORS.emerald
    }
  }, "\uD83D\uDCCE ", form.fileName), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-danger btn-sm btn-icon",
    onClick: function onClick() {
      return setForm(function (p) {
        return _objectSpread(_objectSpread({}, p), {}, {
          file: null,
          fileName: ""
        });
      });
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "close",
    size: 12
  }))))), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: postAssignment
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 16
  }), " Post Assignment")), isTeacher && tab === "posted" && /*#__PURE__*/React.createElement("div", null, postedAssignments.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty-state"
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty-state-icon"
  }, "\uD83D\uDCDD"), /*#__PURE__*/React.createElement("div", {
    className: "empty-state-text"
  }, "No assignments posted yet"))) : postedAssignments.map(function (a) {
    return /*#__PURE__*/React.createElement(AssignmentCard, {
      key: a.id,
      a: a,
      showSubmissions: true
    });
  })), (isStudent || isParent) && /*#__PURE__*/React.createElement("div", null, myAssignments.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty-state"
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty-state-icon"
  }, "\uD83D\uDCDA"), /*#__PURE__*/React.createElement("div", {
    className: "empty-state-text"
  }, "No assignments posted for your class yet"))) : myAssignments.map(function (a) {
    return /*#__PURE__*/React.createElement(AssignmentCard, {
      key: a.id,
      a: a,
      showSubmissions: false
    });
  })));
}
// ─── PROFILE PAGE ─────────────────────────────────────────────────────────────
function ProfilePage(_ref30) {
  var state = _ref30.state,
    updateState = _ref30.updateState,
    updateCurrentUser = _ref30.updateCurrentUser,
    currentUser = _ref30.currentUser,
    showNotification = _ref30.showNotification;
  var _useState135 = useState({
      name: currentUser.name,
      email: currentUser.email,
      avatar: currentUser.avatar || null
    }),
    _useState136 = _slicedToArray(_useState135, 2),
    form = _useState136[0],
    setForm = _useState136[1];
  var _useState137 = useState({
      current: "",
      newPw: "",
      confirm: ""
    }),
    _useState138 = _slicedToArray(_useState137, 2),
    pwForm = _useState138[0],
    setPwForm = _useState138[1];
  var _useState139 = useState(""),
    _useState140 = _slicedToArray(_useState139, 2),
    pwError = _useState140[0],
    setPwError = _useState140[1];
  var _useState141 = useState(""),
    _useState142 = _slicedToArray(_useState141, 2),
    pwSuccess = _useState142[0],
    setPwSuccess = _useState142[1];
  var avatarRef = useRef(null);
  var handleAvatarChange = function handleAvatarChange(e) {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function (ev) {
      return setForm(function (p) {
        return _objectSpread(_objectSpread({}, p), {}, {
          avatar: ev.target.result
        });
      });
    };
    reader.readAsDataURL(file);
  };
  var saveProfile = function saveProfile() {
    if (!form.name || !form.email) {
      showNotification("Name and email are required.", "error");
      return;
    }
    updateCurrentUser({
      name: form.name,
      email: form.email,
      avatar: form.avatar
    });
    showNotification("Profile updated successfully!");
  };
  var changePassword = function changePassword() {
    setPwError("");
    setPwSuccess("");
    if (!pwForm.current) {
      setPwError("Enter your current password.");
      return;
    }
    if (currentUser.password !== pwForm.current) {
      setPwError("Current password is incorrect.");
      return;
    }
    if (pwForm.newPw.length < 6) {
      setPwError("New password must be at least 6 characters.");
      return;
    }
    if (pwForm.newPw !== pwForm.confirm) {
      setPwError("New passwords do not match.");
      return;
    }
    updateCurrentUser({
      password: pwForm.newPw
    });
    setPwForm({
      current: "",
      newPw: "",
      confirm: ""
    });
    setPwSuccess("Password changed successfully!");
    showNotification("Password updated!");
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "section-title",
    style: {
      marginBottom: 20
    }
  }, "My Profile"), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 15,
      color: COLORS.blueLight,
      marginBottom: 20
    }
  }, "Account Information"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 24,
      marginBottom: 24,
      padding: 20,
      background: "rgba(0,0,0,0.2)",
      borderRadius: 12,
      border: "1px solid var(--border)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 96,
      height: 96,
      borderRadius: "50%",
      flexShrink: 0,
      border: "3px solid rgba(37,99,235,0.4)",
      overflow: "hidden",
      background: form.avatar ? "transparent" : "linear-gradient(135deg,var(--blue),var(--indigo))",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "var(--font-display)",
      fontWeight: 800,
      fontSize: 28,
      boxShadow: "0 4px 20px rgba(37,99,235,0.25)"
    }
  }, form.avatar ? /*#__PURE__*/React.createElement("img", {
    src: form.avatar,
    alt: "Profile",
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }) : form.name.split(" ").map(function (n) {
    return n[0];
  }).join("").slice(0, 2)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 18,
      marginBottom: 4
    }
  }, currentUser.name), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "badge ".concat(currentUser.role === "admin" ? "badge-gold" : "badge-blue"),
    style: {
      fontSize: 12,
      padding: "4px 12px"
    }
  }, currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: "image/*",
    ref: avatarRef,
    style: {
      display: "none"
    },
    onChange: handleAvatarChange
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    onClick: function onClick() {
      var _avatarRef$current;
      return (_avatarRef$current = avatarRef.current) === null || _avatarRef$current === void 0 ? void 0 : _avatarRef$current.click();
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "upload",
    size: 14
  }), " Change Photo"), form.avatar && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-danger btn-sm",
    onClick: function onClick() {
      return setForm(function (p) {
        return _objectSpread(_objectSpread({}, p), {}, {
          avatar: null
        });
      });
    }
  }, "Remove")))), /*#__PURE__*/React.createElement("div", {
    className: "grid-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Full Name"), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    value: form.name,
    onChange: function onChange(e) {
      return setForm(_objectSpread(_objectSpread({}, form), {}, {
        name: e.target.value
      }));
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Email Address"), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    type: "email",
    value: form.email,
    onChange: function onChange(e) {
      return setForm(_objectSpread(_objectSpread({}, form), {}, {
        email: e.target.value
      }));
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Role"), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    value: currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1),
    disabled: true,
    style: {
      opacity: 0.5
    }
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: saveProfile
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 16
  }), " Save Profile")), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 15,
      color: COLORS.blueLight,
      marginBottom: 20
    }
  }, "Change Password"), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 420
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Current Password"), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    type: "password",
    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
    value: pwForm.current,
    onChange: function onChange(e) {
      setPwForm(_objectSpread(_objectSpread({}, pwForm), {}, {
        current: e.target.value
      }));
      setPwError("");
      setPwSuccess("");
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "New Password"), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    type: "password",
    placeholder: "Minimum 6 characters",
    value: pwForm.newPw,
    onChange: function onChange(e) {
      setPwForm(_objectSpread(_objectSpread({}, pwForm), {}, {
        newPw: e.target.value
      }));
      setPwError("");
      setPwSuccess("");
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Confirm New Password"), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    type: "password",
    placeholder: "Re-enter new password",
    value: pwForm.confirm,
    onChange: function onChange(e) {
      setPwForm(_objectSpread(_objectSpread({}, pwForm), {}, {
        confirm: e.target.value
      }));
      setPwError("");
      setPwSuccess("");
    }
  })), pwForm.newPw && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: COLORS.textMuted,
      marginBottom: 4
    }
  }, "Password strength"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4
    }
  }, [1, 2, 3, 4].map(function (lvl) {
    var strength = pwForm.newPw.length >= 12 && /[A-Z]/.test(pwForm.newPw) && /[0-9]/.test(pwForm.newPw) && /[^a-zA-Z0-9]/.test(pwForm.newPw) ? 4 : pwForm.newPw.length >= 8 && (/[A-Z]/.test(pwForm.newPw) || /[0-9]/.test(pwForm.newPw)) ? 3 : pwForm.newPw.length >= 6 ? 2 : 1;
    return /*#__PURE__*/React.createElement("div", {
      key: lvl,
      style: {
        flex: 1,
        height: 5,
        borderRadius: 3,
        background: lvl <= strength ? strength >= 4 ? COLORS.emerald : strength >= 3 ? COLORS.blueLight : strength >= 2 ? COLORS.gold : COLORS.rose : "var(--border)",
        transition: "background 0.3s"
      }
    });
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: COLORS.textMuted,
      marginTop: 3
    }
  }, pwForm.newPw.length < 6 ? "Too short" : pwForm.newPw.length < 8 ? "Weak" : /[A-Z]/.test(pwForm.newPw) && /[0-9]/.test(pwForm.newPw) ? "Strong" : "Medium")), pwError && /*#__PURE__*/React.createElement("div", {
    style: {
      color: COLORS.rose,
      fontSize: 13,
      marginBottom: 12,
      padding: "8px 12px",
      background: "rgba(244,63,94,0.1)",
      borderRadius: 8
    }
  }, pwError), pwSuccess && /*#__PURE__*/React.createElement("div", {
    style: {
      color: COLORS.emerald,
      fontSize: 13,
      marginBottom: 12,
      padding: "8px 12px",
      background: "rgba(16,185,129,0.1)",
      borderRadius: 8,
      fontWeight: 600
    }
  }, "\u2705 ", pwSuccess), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: changePassword
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "lock",
    size: 16
  }), " Update Password"))));
}

// ─── PAYMENTS PAGE ────────────────────────────────────────────────────────────
function PaymentsPage(_ref31) {
  var state = _ref31.state,
    updateState = _ref31.updateState,
    currentUser = _ref31.currentUser,
    showNotification = _ref31.showNotification;
  var _useState143 = useState("payments"),
    _useState144 = _slicedToArray(_useState143, 2),
    tab = _useState144[0],
    setTab = _useState144[1];
  var _useState145 = useState(""),
    _useState146 = _slicedToArray(_useState145, 2),
    search = _useState146[0],
    setSearch = _useState146[1];
  var _useState147 = useState(""),
    _useState148 = _slicedToArray(_useState147, 2),
    filterClass = _useState148[0],
    setFilterClass = _useState148[1];
  var _useState149 = useState(""),
    _useState150 = _slicedToArray(_useState149, 2),
    filterType = _useState150[0],
    setFilterType = _useState150[1];
  var _useState151 = useState(""),
    _useState152 = _slicedToArray(_useState151, 2),
    filterStatus = _useState152[0],
    setFilterStatus = _useState152[1];
  var _useState153 = useState(null),
    _useState154 = _slicedToArray(_useState153, 2),
    modal = _useState154[0],
    setModal = _useState154[1]; // "add" | "confirm" | "receipt"
  var _useState155 = useState(null),
    _useState156 = _slicedToArray(_useState155, 2),
    selected = _useState156[0],
    setSelected = _useState156[1];
  var _useState157 = useState({
      studentId: "",
      amount: "",
      paymentType: "School Fees",
      description: "",
      session: state.currentSession,
      term: state.currentTerm,
      method: "Cash"
    }),
    _useState158 = _slicedToArray(_useState157, 2),
    form = _useState158[0],
    setForm = _useState158[1];
  var _useState159 = useState(""),
    _useState160 = _slicedToArray(_useState159, 2),
    newType = _useState160[0],
    setNewType = _useState160[1];
  var payments = state.payments || [];
  var paymentTypes = state.paymentTypes || ["School Fees", "Exam Fees", "Development Levy", "Uniform", "Books", "PTA Levy", "Others"];
  var students = state.users.filter(function (u) {
    return u.role === "student";
  });
  var filtered = payments.filter(function (p) {
    var _p$receiptNo;
    var st = state.users.find(function (u) {
      return u.id === p.studentId;
    });
    var matchSearch = !search || ((st === null || st === void 0 ? void 0 : st.name) || "").toLowerCase().includes(search.toLowerCase()) || ((st === null || st === void 0 ? void 0 : st.studentId) || "").toLowerCase().includes(search.toLowerCase()) || ((_p$receiptNo = p.receiptNo) === null || _p$receiptNo === void 0 ? void 0 : _p$receiptNo.toLowerCase().includes(search.toLowerCase()));
    var matchClass = !filterClass || (st === null || st === void 0 ? void 0 : st.classId) === filterClass;
    var matchType = !filterType || p.paymentType === filterType;
    var matchStatus = !filterStatus || p.status === filterStatus;
    return matchSearch && matchClass && matchType && matchStatus;
  });

  // Summary stats
  var totalCollected = payments.filter(function (p) {
    return p.status === "Confirmed";
  }).reduce(function (s, p) {
    return s + Number(p.amount);
  }, 0);
  var totalPending = payments.filter(function (p) {
    return p.status === "Pending";
  }).reduce(function (s, p) {
    return s + Number(p.amount);
  }, 0);
  var totalCount = payments.length;
  var confirmedCount = payments.filter(function (p) {
    return p.status === "Confirmed";
  }).length;
  var formatMoney = function formatMoney(n) {
    return "₦" + Number(n).toLocaleString("en-NG", {
      minimumFractionDigits: 2
    });
  };
  var generateReceiptNo = function generateReceiptNo() {
    var d = new Date();
    return "RCT-".concat(d.getFullYear()).concat(String(d.getMonth() + 1).padStart(2, "0")).concat(String(d.getDate()).padStart(2, "0"), "-").concat(Math.random().toString(36).substring(2, 6).toUpperCase());
  };
  var addPayment = function addPayment() {
    if (!form.studentId || !form.amount || !form.paymentType) {
      showNotification("Please fill Student, Amount and Payment Type.", "error");
      return;
    }
    var payment = {
      id: generateId(),
      receiptNo: generateReceiptNo(),
      studentId: form.studentId,
      amount: Number(form.amount),
      paymentType: form.paymentType,
      description: form.description,
      session: form.session,
      term: form.term,
      method: form.method,
      status: "Pending",
      recordedBy: currentUser.id,
      recordedByName: currentUser.name,
      createdAt: new Date().toISOString(),
      confirmedAt: null,
      confirmedBy: null,
      confirmedByName: null
    };
    var newAudit = [{
      id: generateId(),
      userId: currentUser.id,
      userName: currentUser.name,
      action: "Payment Recorded",
      details: "Recorded ".concat(formatMoney(form.amount), " ").concat(form.paymentType, " for student"),
      timestamp: new Date().toISOString()
    }].concat(_toConsumableArray(state.auditTrail || []));
    updateState({
      payments: [].concat(_toConsumableArray(payments), [payment]),
      auditTrail: newAudit
    });
    setModal(null);
    setForm({
      studentId: "",
      amount: "",
      paymentType: "School Fees",
      description: "",
      session: state.currentSession,
      term: state.currentTerm,
      method: "Cash"
    });
    showNotification("Payment recorded! Awaiting confirmation.");
  };
  var confirmPayment = function confirmPayment(payment) {
    var updated = payments.map(function (p) {
      return p.id === payment.id ? _objectSpread(_objectSpread({}, p), {}, {
        status: "Confirmed",
        confirmedAt: new Date().toISOString(),
        confirmedBy: currentUser.id,
        confirmedByName: currentUser.name
      }) : p;
    });
    var newAudit = [{
      id: generateId(),
      userId: currentUser.id,
      userName: currentUser.name,
      action: "Payment Confirmed",
      details: "Confirmed ".concat(formatMoney(payment.amount), " ").concat(payment.paymentType, " \u2014 ").concat(payment.receiptNo),
      timestamp: new Date().toISOString()
    }].concat(_toConsumableArray(state.auditTrail || []));
    updateState({
      payments: updated,
      auditTrail: newAudit
    });
    showNotification("Payment confirmed! Receipt is ready to print.");
    setModal(null);
  };
  var voidPayment = function voidPayment(payment) {
    if (!window.confirm("Void this payment? This cannot be undone.")) return;
    var updated = payments.map(function (p) {
      return p.id === payment.id ? _objectSpread(_objectSpread({}, p), {}, {
        status: "Voided"
      }) : p;
    });
    updateState({
      payments: updated
    });
    showNotification("Payment voided.");
  };
  var printReceipt = function printReceipt(payment) {
    var student = state.users.find(function (u) {
      return u.id === payment.studentId;
    });
    var cls = state.classes.find(function (c) {
      return c.id === (student === null || student === void 0 ? void 0 : student.classId);
    });
    var inst = state.institution;
    var win = window.open("", "_blank", "width=800,height=600");
    win.document.write("\n<!DOCTYPE html><html><head>\n<title>Payment Receipt \u2014 ".concat(payment.receiptNo, "</title>\n<style>\n  *{margin:0;padding:0;box-sizing:border-box}\n  body{font-family:'Segoe UI',Arial,sans-serif;background:#fff;color:#1a1a2e;padding:0}\n  .receipt{max-width:600px;margin:0 auto;padding:32px;border:1px solid #ddd}\n  .header{text-align:center;margin-bottom:24px;padding-bottom:16px;border-bottom:3px double #1a1a2e}\n  .logo-row{display:flex;align-items:center;justify-content:center;gap:16px;margin-bottom:8px}\n  .logo-img{width:70px;height:70px;object-fit:contain}\n  .school-name{font-size:22px;font-weight:800;color:#1a1a2e}\n  .school-addr{font-size:12px;color:#666;margin-top:2px}\n  .receipt-title{font-size:13px;font-weight:700;color:#2563EB;text-transform:uppercase;letter-spacing:2px;margin-top:8px}\n  .receipt-no{font-size:11px;color:#666;margin-top:4px}\n  .status-badge{display:inline-block;padding:4px 14px;border-radius:20px;font-size:11px;font-weight:700;\n    background:").concat(payment.status === "Confirmed" ? "#d1fae5" : "#fef3c7", ";\n    color:").concat(payment.status === "Confirmed" ? "#065f46" : "#92400e", ";\n    border:1px solid ").concat(payment.status === "Confirmed" ? "#6ee7b7" : "#fcd34d", ";\n    margin-top:6px}\n  .section{margin-bottom:18px}\n  .section-title{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;\n    color:#2563EB;margin-bottom:8px;padding-bottom:4px;border-bottom:1px solid #e5e7eb}\n  .row{display:flex;justify-content:space-between;padding:5px 0;font-size:13px;border-bottom:1px dotted #f0f0f0}\n  .row:last-child{border-bottom:none}\n  .label{color:#666;flex:1}\n  .value{font-weight:600;text-align:right;flex:1}\n  .amount-box{background:linear-gradient(135deg,#1e3a8a,#2563EB);color:white;border-radius:10px;\n    padding:16px 20px;text-align:center;margin:16px 0}\n  .amount-label{font-size:11px;text-transform:uppercase;letter-spacing:1px;opacity:0.8}\n  .amount-value{font-size:28px;font-weight:900;margin-top:4px}\n  .amount-words{font-size:11px;opacity:0.8;margin-top:4px;font-style:italic}\n  .footer{margin-top:24px;padding-top:16px;border-top:2px solid #1a1a2e;display:flex;justify-content:space-between;align-items:flex-end}\n  .sig-box{text-align:center;min-width:180px}\n  .sig-line{border-top:1px solid #1a1a2e;margin-top:40px;padding-top:4px;font-size:11px;color:#666}\n  .watermark{text-align:center;font-size:11px;color:#9ca3af;margin-top:16px}\n  @media print{body{padding:0}button{display:none!important}.receipt{border:none}}\n</style>\n</head><body>\n<div class=\"receipt\">\n  <div class=\"header\">\n    <div class=\"logo-row\">\n      ").concat(inst.logo ? "<img class=\"logo-img\" src=\"".concat(inst.logo, "\" alt=\"Logo\"/>") : "<div style=\"width:70px;height:70px;border-radius:50%;background:linear-gradient(135deg,#1e3a8a,#2563EB);display:flex;align-items:center;justify-content:center;font-size:32px\">\uD83C\uDFEB</div>", "\n      <div>\n        <div class=\"school-name\">").concat(inst.name, "</div>\n        <div class=\"school-addr\">").concat(inst.address || "", "</div>\n      </div>\n    </div>\n    <div class=\"receipt-title\">Official Payment Receipt</div>\n    <div class=\"receipt-no\">Receipt No: <strong>").concat(payment.receiptNo, "</strong></div>\n    <div><span class=\"status-badge\">").concat(payment.status === "Confirmed" ? "✅ CONFIRMED & PAID" : "⏳ PENDING CONFIRMATION", "</span></div>\n  </div>\n\n  <div class=\"section\">\n    <div class=\"section-title\">Student Information</div>\n    <div class=\"row\"><span class=\"label\">Full Name</span><span class=\"value\">").concat((student === null || student === void 0 ? void 0 : student.name) || "—", "</span></div>\n    <div class=\"row\"><span class=\"label\">Registration No.</span><span class=\"value\">").concat((student === null || student === void 0 ? void 0 : student.studentId) || "—", "</span></div>\n    <div class=\"row\"><span class=\"label\">Class</span><span class=\"value\">").concat((cls === null || cls === void 0 ? void 0 : cls.name) || "—", "</span></div>\n    <div class=\"row\"><span class=\"label\">Session</span><span class=\"value\">").concat(payment.session, "</span></div>\n    <div class=\"row\"><span class=\"label\">Term</span><span class=\"value\">").concat(payment.term, "</span></div>\n  </div>\n\n  <div class=\"section\">\n    <div class=\"section-title\">Payment Details</div>\n    <div class=\"row\"><span class=\"label\">Payment Type</span><span class=\"value\">").concat(payment.paymentType, "</span></div>\n    <div class=\"row\"><span class=\"label\">Payment Method</span><span class=\"value\">").concat(payment.method, "</span></div>\n    <div class=\"row\"><span class=\"label\">Description</span><span class=\"value\">").concat(payment.description || "—", "</span></div>\n    <div class=\"row\"><span class=\"label\">Date Recorded</span><span class=\"value\">").concat(new Date(payment.createdAt).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }), "</span></div>\n    ").concat(payment.confirmedAt ? "<div class=\"row\"><span class=\"label\">Date Confirmed</span><span class=\"value\">".concat(new Date(payment.confirmedAt).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }), "</span></div>") : "", "\n    <div class=\"row\"><span class=\"label\">Recorded By</span><span class=\"value\">").concat(payment.recordedByName, "</span></div>\n    ").concat(payment.confirmedByName ? "<div class=\"row\"><span class=\"label\">Confirmed By</span><span class=\"value\">".concat(payment.confirmedByName, "</span></div>") : "", "\n  </div>\n\n  <div class=\"amount-box\">\n    <div class=\"amount-label\">Amount Paid</div>\n    <div class=\"amount-value\">").concat(formatMoney(payment.amount), "</div>\n  </div>\n\n  <div class=\"footer\">\n    <div class=\"sig-box\">\n      ").concat(inst.signature ? "<img src=\"".concat(inst.signature, "\" style=\"height:50px;object-fit:contain\"/>") : "<div style='height:50px'></div>", "\n      <div class=\"sig-line\">Bursar / Cashier Signature</div>\n    </div>\n    <div style=\"text-align:right\">\n      <div style=\"font-size:11px;color:#666\">Confirmed by:</div>\n      <div style=\"font-weight:700;font-size:13px\">").concat(payment.confirmedByName || "Pending", "</div>\n      <div style=\"font-size:11px;color:#666;margin-top:12px\">School Stamp</div>\n      <div style=\"width:80px;height:80px;border:2px dashed #ccc;border-radius:50%;margin:4px 0 0 auto;display:flex;align-items:center;justify-content:center;font-size:10px;color:#ccc\">STAMP</div>\n    </div>\n  </div>\n\n  <div class=\"watermark\">\n    This receipt was generated by SARMS \u2014 ").concat(inst.name, " \xB7 ").concat(new Date().toLocaleString("en-NG"), "\n    <br/>This is an official payment receipt. Keep it safe for your records.\n  </div>\n</div>\n<script>window.print(); window.onafterprint = function(){ window.close(); };</script>\n</body></html>"));
    win.document.close();
  };
  var totalByType = paymentTypes.map(function (type) {
    return {
      type: type,
      total: payments.filter(function (p) {
        return p.paymentType === type && p.status === "Confirmed";
      }).reduce(function (s, p) {
        return s + Number(p.amount);
      }, 0),
      count: payments.filter(function (p) {
        return p.paymentType === type;
      }).length
    };
  }).filter(function (t) {
    return t.count > 0;
  });
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "section-header"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "section-title"
  }, "Payment Management"), /*#__PURE__*/React.createElement("div", {
    className: "section-sub"
  }, "Track, confirm and print receipts")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: function onClick() {
      return setModal("add");
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 16
  }), " Record Payment")), /*#__PURE__*/React.createElement("div", {
    className: "stats-grid",
    style: {
      marginBottom: 24
    }
  }, [{
    label: "Total Collected",
    value: formatMoney(totalCollected),
    color: COLORS.emerald,
    sub: "".concat(confirmedCount, " confirmed")
  }, {
    label: "Pending Amount",
    value: formatMoney(totalPending),
    color: COLORS.gold,
    sub: "".concat(totalCount - confirmedCount, " pending")
  }, {
    label: "Total Payments",
    value: totalCount,
    color: COLORS.blue,
    sub: "all records"
  }, {
    label: "Confirmed",
    value: confirmedCount,
    color: COLORS.emerald,
    sub: "".concat(totalCount > 0 ? Math.round(confirmedCount / totalCount * 100) : 0, "% confirmed")
  }].map(function (s) {
    return /*#__PURE__*/React.createElement("div", {
      className: "stat-card",
      key: s.label
    }, /*#__PURE__*/React.createElement("div", {
      className: "stat-card-value",
      style: {
        color: s.color,
        fontSize: 22
      }
    }, s.value), /*#__PURE__*/React.createElement("div", {
      className: "stat-card-label"
    }, s.label), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: COLORS.textMuted,
        marginTop: 2
      }
    }, s.sub));
  })), /*#__PURE__*/React.createElement("div", {
    className: "tabs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tab ".concat(tab === "payments" ? "active" : ""),
    onClick: function onClick() {
      return setTab("payments");
    }
  }, "\uD83D\uDCB3 All Payments"), /*#__PURE__*/React.createElement("div", {
    className: "tab ".concat(tab === "summary" ? "active" : ""),
    onClick: function onClick() {
      return setTab("summary");
    }
  }, "\uD83D\uDCCA Summary by Type"), /*#__PURE__*/React.createElement("div", {
    className: "tab ".concat(tab === "settings" ? "active" : ""),
    onClick: function onClick() {
      return setTab("settings");
    }
  }, "\u2699\uFE0F Payment Types")), tab === "payments" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      marginBottom: 16,
      padding: "14px 18px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      flexWrap: "wrap",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "search-bar",
    style: {
      flex: 1,
      minWidth: 200
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 15,
    color: COLORS.textMuted
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Search by name, reg no, receipt...",
    value: search,
    onChange: function onChange(e) {
      return setSearch(e.target.value);
    }
  })), /*#__PURE__*/React.createElement("select", {
    className: "form-input",
    style: {
      width: "auto",
      minWidth: 140
    },
    value: filterClass,
    onChange: function onChange(e) {
      return setFilterClass(e.target.value);
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "All Classes"), state.classes.map(function (c) {
    return /*#__PURE__*/React.createElement("option", {
      key: c.id,
      value: c.id
    }, c.name);
  })), /*#__PURE__*/React.createElement("select", {
    className: "form-input",
    style: {
      width: "auto",
      minWidth: 140
    },
    value: filterType,
    onChange: function onChange(e) {
      return setFilterType(e.target.value);
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "All Types"), paymentTypes.map(function (t) {
    return /*#__PURE__*/React.createElement("option", {
      key: t
    }, t);
  })), /*#__PURE__*/React.createElement("select", {
    className: "form-input",
    style: {
      width: "auto",
      minWidth: 130
    },
    value: filterStatus,
    onChange: function onChange(e) {
      return setFilterStatus(e.target.value);
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "All Status"), /*#__PURE__*/React.createElement("option", {
    value: "Pending"
  }, "Pending"), /*#__PURE__*/React.createElement("option", {
    value: "Confirmed"
  }, "Confirmed"), /*#__PURE__*/React.createElement("option", {
    value: "Voided"
  }, "Voided")))), filtered.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty-state"
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty-state-icon"
  }, "\uD83D\uDCB3"), /*#__PURE__*/React.createElement("div", {
    className: "empty-state-text"
  }, "No payments found"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    onClick: function onClick() {
      return setModal("add");
    }
  }, "Record First Payment"))) : /*#__PURE__*/React.createElement("div", {
    className: "table-wrapper"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Receipt No."), /*#__PURE__*/React.createElement("th", null, "Student"), /*#__PURE__*/React.createElement("th", null, "Class"), /*#__PURE__*/React.createElement("th", null, "Payment Type"), /*#__PURE__*/React.createElement("th", null, "Amount"), /*#__PURE__*/React.createElement("th", null, "Method"), /*#__PURE__*/React.createElement("th", null, "Session/Term"), /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", null, "Actions"))), /*#__PURE__*/React.createElement("tbody", null, filtered.sort(function (a, b) {
    return new Date(b.createdAt) - new Date(a.createdAt);
  }).map(function (p) {
    var st = state.users.find(function (u) {
      return u.id === p.studentId;
    });
    var cls = state.classes.find(function (c) {
      return c.id === (st === null || st === void 0 ? void 0 : st.classId);
    });
    return /*#__PURE__*/React.createElement("tr", {
      key: p.id
    }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "monospace",
        fontSize: 11,
        color: COLORS.blueLight,
        fontWeight: 700
      }
    }, p.receiptNo), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: COLORS.textMuted
      }
    }, new Date(p.createdAt).toLocaleDateString("en-NG"))), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 600
      }
    }, (st === null || st === void 0 ? void 0 : st.name) || "Unknown"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: COLORS.textSecondary
      }
    }, st === null || st === void 0 ? void 0 : st.studentId)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
      className: "badge badge-blue",
      style: {
        fontSize: 11
      }
    }, (cls === null || cls === void 0 ? void 0 : cls.name) || "—")), /*#__PURE__*/React.createElement("td", {
      style: {
        fontSize: 13
      }
    }, p.paymentType), /*#__PURE__*/React.createElement("td", {
      style: {
        fontWeight: 700,
        color: COLORS.emerald,
        fontSize: 14
      }
    }, formatMoney(p.amount)), /*#__PURE__*/React.createElement("td", {
      style: {
        fontSize: 12,
        color: COLORS.textSecondary
      }
    }, p.method), /*#__PURE__*/React.createElement("td", {
      style: {
        fontSize: 11,
        color: COLORS.textMuted
      }
    }, p.session, /*#__PURE__*/React.createElement("br", null), p.term), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
      className: "badge ".concat(p.status === "Confirmed" ? "badge-green" : p.status === "Voided" ? "badge-red" : "badge-gold"),
      style: {
        fontSize: 11
      }
    }, p.status === "Confirmed" ? "✅ Confirmed" : p.status === "Voided" ? "❌ Voided" : "⏳ Pending")), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 6
      }
    }, p.status === "Confirmed" && /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary btn-sm",
      onClick: function onClick() {
        return printReceipt(p);
      },
      title: "Print Receipt"
    }, "\uD83D\uDDA8\uFE0F Print"), p.status === "Pending" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary btn-sm",
      onClick: function onClick() {
        setSelected(p);
        setModal("confirm");
      },
      title: "Confirm Payment"
    }, "\u2705 Confirm"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-danger btn-sm",
      onClick: function onClick() {
        return voidPayment(p);
      },
      title: "Void Payment"
    }, "\u274C")))));
  }))))), tab === "summary" && /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 15,
      color: COLORS.blueLight,
      marginBottom: 16
    }
  }, "Collection Summary by Payment Type"), totalByType.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "empty-state"
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty-state-icon"
  }, "\uD83D\uDCCA"), /*#__PURE__*/React.createElement("div", {
    className: "empty-state-text"
  }, "No payments recorded yet")) : /*#__PURE__*/React.createElement("div", null, totalByType.map(function (_ref32) {
    var type = _ref32.type,
      total = _ref32.total,
      count = _ref32.count;
    var pct = totalCollected > 0 ? Math.round(total / totalCollected * 100) : 0;
    return /*#__PURE__*/React.createElement("div", {
      key: type,
      style: {
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 600,
        fontSize: 14
      }
    }, type), /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 700,
        color: COLORS.emerald
      }
    }, formatMoney(total))), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 8,
        background: "var(--border)",
        borderRadius: 4,
        overflow: "hidden",
        marginBottom: 4
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: "100%",
        width: "".concat(pct, "%"),
        background: "linear-gradient(90deg,var(--blue),var(--indigo))",
        borderRadius: 4
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: COLORS.textMuted
      }
    }, count, " payment", count !== 1 ? "s" : "", " \xB7 ", pct, "% of total"));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "2px solid var(--border)",
      paddingTop: 16,
      marginTop: 8,
      display: "flex",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700
    }
  }, "Total Collected"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      fontSize: 18,
      color: COLORS.emerald
    }
  }, formatMoney(totalCollected))))), tab === "settings" && /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 15,
      color: COLORS.blueLight,
      marginBottom: 16
    }
  }, "Payment Types"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    placeholder: "New payment type name...",
    value: newType,
    onChange: function onChange(e) {
      return setNewType(e.target.value);
    },
    onKeyDown: function onKeyDown(e) {
      if (e.key === "Enter" && newType.trim()) {
        if (!paymentTypes.includes(newType.trim())) {
          updateState({
            paymentTypes: [].concat(_toConsumableArray(paymentTypes), [newType.trim()])
          });
          showNotification("Payment type added!");
        }
        setNewType("");
      }
    }
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: function onClick() {
      if (!newType.trim()) return;
      if (!paymentTypes.includes(newType.trim())) {
        updateState({
          paymentTypes: [].concat(_toConsumableArray(paymentTypes), [newType.trim()])
        });
        showNotification("Payment type added!");
      }
      setNewType("");
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 16
  }), " Add")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 8
    }
  }, paymentTypes.map(function (t) {
    return /*#__PURE__*/React.createElement("div", {
      key: t,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 12px",
        background: "rgba(37,99,235,0.1)",
        border: "1px solid rgba(37,99,235,0.2)",
        borderRadius: 20
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 600
      }
    }, t), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        if (window.confirm("Remove \"".concat(t, "\" payment type?"))) {
          updateState({
            paymentTypes: paymentTypes.filter(function (x) {
              return x !== t;
            })
          });
        }
      },
      style: {
        background: "none",
        border: "none",
        color: COLORS.rose,
        cursor: "pointer",
        fontSize: 14,
        lineHeight: 1,
        padding: 0
      }
    }, "\xD7"));
  }))), modal === "add" && /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay",
    onClick: function onClick() {
      return setModal(null);
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal",
    onClick: function onClick(e) {
      return e.stopPropagation();
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-title"
  }, "Record New Payment"), /*#__PURE__*/React.createElement("button", {
    className: "modal-close",
    onClick: function onClick() {
      return setModal(null);
    }
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    className: "modal-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Student *"), /*#__PURE__*/React.createElement("select", {
    className: "form-input",
    value: form.studentId,
    onChange: function onChange(e) {
      return setForm(_objectSpread(_objectSpread({}, form), {}, {
        studentId: e.target.value
      }));
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "\u2014 Select Student \u2014"), state.classes.map(function (cls) {
    return /*#__PURE__*/React.createElement("optgroup", {
      key: cls.id,
      label: cls.name
    }, students.filter(function (s) {
      return s.classId === cls.id;
    }).map(function (s) {
      return /*#__PURE__*/React.createElement("option", {
        key: s.id,
        value: s.id
      }, s.name, " (", s.studentId, ")");
    }));
  }))), /*#__PURE__*/React.createElement("div", {
    className: "grid-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Payment Type *"), /*#__PURE__*/React.createElement("select", {
    className: "form-input",
    value: form.paymentType,
    onChange: function onChange(e) {
      return setForm(_objectSpread(_objectSpread({}, form), {}, {
        paymentType: e.target.value
      }));
    }
  }, paymentTypes.map(function (t) {
    return /*#__PURE__*/React.createElement("option", {
      key: t
    }, t);
  }))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Amount (\u20A6) *"), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    type: "number",
    placeholder: "e.g. 50000",
    value: form.amount,
    onChange: function onChange(e) {
      return setForm(_objectSpread(_objectSpread({}, form), {}, {
        amount: e.target.value
      }));
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "grid-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Payment Method"), /*#__PURE__*/React.createElement("select", {
    className: "form-input",
    value: form.method,
    onChange: function onChange(e) {
      return setForm(_objectSpread(_objectSpread({}, form), {}, {
        method: e.target.value
      }));
    }
  }, ["Cash", "Bank Transfer", "POS", "Cheque", "Online"].map(function (m) {
    return /*#__PURE__*/React.createElement("option", {
      key: m
    }, m);
  }))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Term"), /*#__PURE__*/React.createElement("select", {
    className: "form-input",
    value: form.term,
    onChange: function onChange(e) {
      return setForm(_objectSpread(_objectSpread({}, form), {}, {
        term: e.target.value
      }));
    }
  }, state.terms.map(function (t) {
    return /*#__PURE__*/React.createElement("option", {
      key: t
    }, t);
  })))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Description / Note"), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    placeholder: "Optional note...",
    value: form.description,
    onChange: function onChange(e) {
      return setForm(_objectSpread(_objectSpread({}, form), {}, {
        description: e.target.value
      }));
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px 14px",
      background: "rgba(245,158,11,0.08)",
      border: "1px solid rgba(245,158,11,0.2)",
      borderRadius: 8,
      fontSize: 12,
      color: COLORS.gold
    }
  }, "\u26A0\uFE0F Payment will be recorded as ", /*#__PURE__*/React.createElement("strong", null, "Pending"), " until the bursar confirms the actual cash/transfer receipt.")), /*#__PURE__*/React.createElement("div", {
    className: "modal-footer"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary",
    onClick: function onClick() {
      return setModal(null);
    }
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: addPayment
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 16
  }), " Record Payment")))), modal === "confirm" && selected && function () {
    var st = state.users.find(function (u) {
      return u.id === selected.studentId;
    });
    var cls = state.classes.find(function (c) {
      return c.id === (st === null || st === void 0 ? void 0 : st.classId);
    });
    return /*#__PURE__*/React.createElement("div", {
      className: "modal-overlay",
      onClick: function onClick() {
        return setModal(null);
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "modal",
      onClick: function onClick(e) {
        return e.stopPropagation();
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "modal-header"
    }, /*#__PURE__*/React.createElement("div", {
      className: "modal-title"
    }, "Confirm Payment"), /*#__PURE__*/React.createElement("button", {
      className: "modal-close",
      onClick: function onClick() {
        return setModal(null);
      }
    }, "\xD7")), /*#__PURE__*/React.createElement("div", {
      className: "modal-body"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "center",
        marginBottom: 20
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 48,
        marginBottom: 8
      }
    }, "\uD83D\uDCB3"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 800,
        fontSize: 20,
        marginBottom: 4
      }
    }, formatMoney(selected.amount)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: COLORS.textSecondary
      }
    }, selected.paymentType)), /*#__PURE__*/React.createElement("div", {
      style: {
        background: "rgba(0,0,0,0.2)",
        borderRadius: 10,
        padding: "14px 18px",
        marginBottom: 16
      }
    }, [["Student", (st === null || st === void 0 ? void 0 : st.name) || "—"], ["Reg No.", (st === null || st === void 0 ? void 0 : st.studentId) || "—"], ["Class", (cls === null || cls === void 0 ? void 0 : cls.name) || "—"], ["Method", selected.method], ["Receipt No.", selected.receiptNo], ["Session", selected.session], ["Term", selected.term]].map(function (_ref33) {
      var _ref34 = _slicedToArray(_ref33, 2),
        l = _ref34[0],
        v = _ref34[1];
      return /*#__PURE__*/React.createElement("div", {
        key: l,
        style: {
          display: "flex",
          justifyContent: "space-between",
          padding: "5px 0",
          borderBottom: "1px dotted rgba(255,255,255,0.05)",
          fontSize: 13
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          color: COLORS.textSecondary
        }
      }, l), /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: 600
        }
      }, v));
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "12px 16px",
        background: "rgba(16,185,129,0.08)",
        border: "1px solid rgba(16,185,129,0.2)",
        borderRadius: 8,
        fontSize: 13,
        color: COLORS.emerald
      }
    }, "\u2705 By confirming, you certify that this payment has been physically received by the school. A receipt will be generated and ready to print immediately.")), /*#__PURE__*/React.createElement("div", {
      className: "modal-footer"
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-secondary",
      onClick: function onClick() {
        return setModal(null);
      }
    }, "Cancel"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary",
      onClick: function onClick() {
        confirmPayment(selected);
        setTimeout(function () {
          return printReceipt(_objectSpread(_objectSpread({}, selected), {}, {
            status: "Confirmed",
            confirmedAt: new Date().toISOString(),
            confirmedByName: currentUser.name
          }));
        }, 500);
      }
    }, "\u2705 Confirm & Print Receipt"))));
  }());
}

// ─── ATTENDANCE PAGE ──────────────────────────────────────────────────────────
function AttendancePage(_ref35) {
  var state = _ref35.state,
    updateState = _ref35.updateState,
    currentUser = _ref35.currentUser,
    showNotification = _ref35.showNotification;
  var today = new Date().toISOString().split("T")[0];
  var _useState161 = useState(today),
    _useState162 = _slicedToArray(_useState161, 2),
    date = _useState162[0],
    setDate = _useState162[1];
  var _useState163 = useState(""),
    _useState164 = _slicedToArray(_useState163, 2),
    search = _useState164[0],
    setSearch = _useState164[1];
  var _useState165 = useState(""),
    _useState166 = _slicedToArray(_useState165, 2),
    filterStatus = _useState166[0],
    setFilterStatus = _useState166[1];
  var _useState167 = useState("mark"),
    _useState168 = _slicedToArray(_useState167, 2),
    tab = _useState168[0],
    setTab = _useState168[1];
  var _useState169 = useState({}),
    _useState170 = _slicedToArray(_useState169, 2),
    editTimes = _useState170[0],
    setEditTimes = _useState170[1]; // {teacherId: {timeIn, timeOut, note}}

  var teachers = state.users.filter(function (u) {
    return u.role === "teacher";
  });
  var isPrincipal = ["principal", "admin"].includes(currentUser.role);
  var isTeacher = currentUser.role === "teacher";
  var visibleTeachers = isTeacher ? teachers.filter(function (t) {
    return t.id === currentUser.id;
  }) : teachers.filter(function (t) {
    return !search || t.name.toLowerCase().includes(search.toLowerCase());
  });
  var dateRecords = (state.attendance || []).filter(function (a) {
    return a.date === date;
  });
  var getRecord = function getRecord(teacherId) {
    return dateRecords.find(function (a) {
      return a.teacherId === teacherId;
    });
  };
  var markAttendance = function markAttendance(teacherId, status) {
    var overrides = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var teacher = state.users.find(function (u) {
      return u.id === teacherId;
    });
    var existing = (state.attendance || []).findIndex(function (a) {
      return a.teacherId === teacherId && a.date === date;
    });
    var prev = existing >= 0 ? state.attendance[existing] : {};
    var localEdit = editTimes[teacherId] || {};
    var record = {
      id: prev.id || generateId(),
      teacherId: teacherId,
      date: date,
      status: status,
      timeIn: overrides.timeIn !== undefined ? overrides.timeIn : localEdit.timeIn || prev.timeIn || (status !== "Absent" ? new Date().toTimeString().slice(0, 5) : ""),
      timeOut: overrides.timeOut !== undefined ? overrides.timeOut : localEdit.timeOut || prev.timeOut || "",
      note: overrides.note !== undefined ? overrides.note : localEdit.note || prev.note || "",
      recordedBy: currentUser.id,
      recordedByName: currentUser.name,
      updatedAt: new Date().toISOString()
    };
    var newAtt = _toConsumableArray(state.attendance || []);
    if (existing >= 0) newAtt[existing] = record;else newAtt.push(record);
    var newAudit = [{
      id: generateId(),
      userId: currentUser.id,
      userName: currentUser.name,
      action: "Attendance Marked",
      details: "".concat(teacher === null || teacher === void 0 ? void 0 : teacher.name, " marked ").concat(status, " for ").concat(date),
      timestamp: new Date().toISOString()
    }].concat(_toConsumableArray(state.auditTrail || []));
    updateState({
      attendance: newAtt,
      auditTrail: newAudit
    });
    showNotification("".concat(teacher === null || teacher === void 0 ? void 0 : teacher.name, " marked as ").concat(status));
  };
  var updateLocalEdit = function updateLocalEdit(teacherId, field, value) {
    setEditTimes(function (prev) {
      return _objectSpread(_objectSpread({}, prev), {}, _defineProperty({}, teacherId, _objectSpread(_objectSpread({}, prev[teacherId] || {}), {}, _defineProperty({}, field, value))));
    });
  };
  var saveTimeEdit = function saveTimeEdit(teacherId) {
    var rec = getRecord(teacherId);
    if (!rec) return;
    var local = editTimes[teacherId] || {};
    markAttendance(teacherId, rec.status, {
      timeIn: local.timeIn !== undefined ? local.timeIn : rec.timeIn,
      timeOut: local.timeOut !== undefined ? local.timeOut : rec.timeOut,
      note: local.note !== undefined ? local.note : rec.note
    });
  };
  var markAllPresent = function markAllPresent() {
    var newAtt = _toConsumableArray(state.attendance || []);
    var now = new Date().toTimeString().slice(0, 5);
    var newAuditItems = [];
    teachers.forEach(function (t) {
      var existing = newAtt.findIndex(function (a) {
        return a.teacherId === t.id && a.date === date;
      });
      var record = {
        id: existing >= 0 ? newAtt[existing].id : generateId(),
        teacherId: t.id,
        date: date,
        status: "Present",
        timeIn: now,
        timeOut: "",
        note: "",
        recordedBy: currentUser.id,
        recordedByName: currentUser.name,
        updatedAt: new Date().toISOString()
      };
      if (existing >= 0) newAtt[existing] = record;else newAtt.push(record);
      newAuditItems.push({
        id: generateId(),
        userId: currentUser.id,
        userName: currentUser.name,
        action: "Attendance Marked",
        details: "".concat(t.name, " marked Present for ").concat(date),
        timestamp: new Date().toISOString()
      });
    });
    updateState({
      attendance: newAtt,
      auditTrail: [].concat(newAuditItems, _toConsumableArray(state.auditTrail || []))
    });
    showNotification("All ".concat(teachers.length, " teachers marked Present!"));
  };
  var history = (state.attendance || []).filter(function (a) {
    return isTeacher ? a.teacherId === currentUser.id : true;
  }).filter(function (a) {
    return !filterStatus || a.status === filterStatus;
  }).sort(function (a, b) {
    return b.date.localeCompare(a.date);
  }).slice(0, 100);
  var report = teachers.map(function (t) {
    var recs = (state.attendance || []).filter(function (a) {
      return a.teacherId === t.id;
    });
    return {
      teacher: t,
      total: recs.length,
      present: recs.filter(function (a) {
        return a.status === "Present";
      }).length,
      absent: recs.filter(function (a) {
        return a.status === "Absent";
      }).length,
      late: recs.filter(function (a) {
        return a.status === "Late";
      }).length,
      rate: recs.length > 0 ? Math.round(recs.filter(function (a) {
        return a.status !== "Absent";
      }).length / recs.length * 100) : 0
    };
  });
  var last7 = Array.from({
    length: 7
  }, function (_, i) {
    var d = new Date();
    d.setDate(d.getDate() - (6 - i));
    var ds = d.toISOString().split("T")[0];
    var dayAtt = (state.attendance || []).filter(function (a) {
      return a.date === ds;
    });
    return {
      date: ds,
      label: d.toLocaleDateString("en-NG", {
        weekday: "short"
      }),
      present: dayAtt.filter(function (a) {
        return a.status === "Present";
      }).length,
      absent: dayAtt.filter(function (a) {
        return a.status === "Absent";
      }).length,
      late: dayAtt.filter(function (a) {
        return a.status === "Late";
      }).length,
      total: teachers.length
    };
  });
  var StatusBtn = function StatusBtn(_ref36) {
    var teacherId = _ref36.teacherId,
      status = _ref36.status,
      current = _ref36.current,
      color = _ref36.color,
      icon = _ref36.icon;
    return /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return markAttendance(teacherId, status);
      },
      style: {
        padding: "5px 14px",
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 700,
        cursor: "pointer",
        border: "2px solid ".concat(current === status ? color : "var(--border)"),
        background: current === status ? "".concat(color, "33") : "transparent",
        color: current === status ? color : COLORS.textMuted,
        transition: "all 0.15s"
      }
    }, icon, " ", status);
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "section-header"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "section-title"
  }, isTeacher ? "My Attendance" : "Staff Attendance"), /*#__PURE__*/React.createElement("div", {
    className: "section-sub"
  }, isTeacher ? "Your attendance history" : "".concat(teachers.length, " teachers \xB7 Daily tracking"))), isPrincipal && tab === "mark" && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: markAllPresent
  }, "\u2705 Mark All Present")), /*#__PURE__*/React.createElement("div", {
    className: "tabs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tab ".concat(tab === "mark" ? "active" : ""),
    onClick: function onClick() {
      return setTab("mark");
    }
  }, "\uD83D\uDCCB Mark Attendance"), /*#__PURE__*/React.createElement("div", {
    className: "tab ".concat(tab === "history" ? "active" : ""),
    onClick: function onClick() {
      return setTab("history");
    }
  }, "\uD83D\uDCC5 History"), isPrincipal && /*#__PURE__*/React.createElement("div", {
    className: "tab ".concat(tab === "report" ? "active" : ""),
    onClick: function onClick() {
      return setTab("report");
    }
  }, "\uD83D\uDCCA Report")), tab === "mark" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      marginBottom: 16,
      padding: "14px 18px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      flexWrap: "wrap",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "form-label",
    style: {
      marginBottom: 4
    }
  }, "Date"), /*#__PURE__*/React.createElement("input", {
    type: "date",
    className: "form-input",
    value: date,
    max: today,
    onChange: function onChange(e) {
      setDate(e.target.value);
      setEditTimes({});
    },
    style: {
      maxWidth: 200
    }
  })), isPrincipal && /*#__PURE__*/React.createElement("div", {
    className: "search-bar",
    style: {
      flex: 1,
      minWidth: 200
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 15,
    color: COLORS.textMuted
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Search teacher...",
    value: search,
    onChange: function onChange(e) {
      return setSearch(e.target.value);
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 14,
      fontSize: 12,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: COLORS.emerald,
      fontWeight: 600
    }
  }, "\u2705 ", dateRecords.filter(function (a) {
    return a.status === "Present";
  }).length, " Present"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: COLORS.rose,
      fontWeight: 600
    }
  }, "\u274C ", dateRecords.filter(function (a) {
    return a.status === "Absent";
  }).length, " Absent"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: COLORS.gold,
      fontWeight: 600
    }
  }, "\u23F0 ", dateRecords.filter(function (a) {
    return a.status === "Late";
  }).length, " Late"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: COLORS.textMuted
    }
  }, "\u2753 ", Math.max(0, teachers.length - dateRecords.length), " Unmarked")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, visibleTeachers.map(function (t) {
    var rec = getRecord(t.id);
    var localEdit = editTimes[t.id] || {};
    var timeIn = localEdit.timeIn !== undefined ? localEdit.timeIn : (rec === null || rec === void 0 ? void 0 : rec.timeIn) || "";
    var timeOut = localEdit.timeOut !== undefined ? localEdit.timeOut : (rec === null || rec === void 0 ? void 0 : rec.timeOut) || "";
    var note = localEdit.note !== undefined ? localEdit.note : (rec === null || rec === void 0 ? void 0 : rec.note) || "";
    var borderColor = !rec ? "var(--border)" : rec.status === "Present" ? "rgba(16,185,129,0.35)" : rec.status === "Late" ? "rgba(245,158,11,0.35)" : "rgba(244,63,94,0.35)";
    return /*#__PURE__*/React.createElement("div", {
      key: t.id,
      className: "card",
      style: {
        border: "1px solid ".concat(borderColor),
        padding: "16px 20px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 14,
        flexWrap: "wrap"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 44,
        height: 44,
        borderRadius: "50%",
        flexShrink: 0,
        background: t.avatar ? "transparent" : "linear-gradient(135deg,var(--blue),var(--indigo))",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 15,
        fontWeight: 700
      }
    }, t.avatar ? /*#__PURE__*/React.createElement("img", {
      src: t.avatar,
      alt: "",
      style: {
        width: "100%",
        height: "100%",
        objectFit: "cover"
      }
    }) : t.name.split(" ").map(function (n) {
      return n[0];
    }).join("").slice(0, 2)), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 700,
        fontSize: 15
      }
    }, t.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 2
      }
    }, (t.subjects || []).map(function (sid) {
      var _state$subjects$find4;
      return (_state$subjects$find4 = state.subjects.find(function (s) {
        return s.id === sid;
      })) === null || _state$subjects$find4 === void 0 ? void 0 : _state$subjects$find4.code;
    }).filter(Boolean).join(" · ") || "No subjects assigned")), isPrincipal ? /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 6,
        flexWrap: "wrap"
      }
    }, /*#__PURE__*/React.createElement(StatusBtn, {
      teacherId: t.id,
      status: "Present",
      current: rec === null || rec === void 0 ? void 0 : rec.status,
      color: COLORS.emerald,
      icon: "\u2705"
    }), /*#__PURE__*/React.createElement(StatusBtn, {
      teacherId: t.id,
      status: "Late",
      current: rec === null || rec === void 0 ? void 0 : rec.status,
      color: COLORS.gold,
      icon: "\u23F0"
    }), /*#__PURE__*/React.createElement(StatusBtn, {
      teacherId: t.id,
      status: "Absent",
      current: rec === null || rec === void 0 ? void 0 : rec.status,
      color: COLORS.rose,
      icon: "\u274C"
    })) : /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "6px 16px",
        borderRadius: 20,
        fontSize: 13,
        fontWeight: 700,
        color: !rec ? COLORS.textMuted : rec.status === "Present" ? COLORS.emerald : rec.status === "Late" ? COLORS.gold : COLORS.rose,
        background: !rec ? "rgba(0,0,0,0.1)" : rec.status === "Present" ? "rgba(16,185,129,0.1)" : rec.status === "Late" ? "rgba(245,158,11,0.1)" : "rgba(244,63,94,0.1)"
      }
    }, !rec ? "❓ Not Marked" : rec.status === "Present" ? "✅ Present" : rec.status === "Late" ? "⏰ Late" : "❌ Absent")), rec && isPrincipal && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 12,
        paddingTop: 12,
        borderTop: "1px solid var(--border)",
        display: "flex",
        gap: 12,
        flexWrap: "wrap",
        alignItems: "flex-end"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "form-group",
      style: {
        margin: 0,
        minWidth: 120
      }
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label",
      style: {
        fontSize: 11
      }
    }, "Time In"), /*#__PURE__*/React.createElement("input", {
      type: "time",
      className: "form-input",
      value: timeIn,
      onChange: function onChange(e) {
        return updateLocalEdit(t.id, "timeIn", e.target.value);
      },
      onBlur: function onBlur() {
        return saveTimeEdit(t.id);
      },
      style: {
        padding: "4px 8px",
        fontSize: 12
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: "form-group",
      style: {
        margin: 0,
        minWidth: 120
      }
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label",
      style: {
        fontSize: 11
      }
    }, "Time Out"), /*#__PURE__*/React.createElement("input", {
      type: "time",
      className: "form-input",
      value: timeOut,
      onChange: function onChange(e) {
        return updateLocalEdit(t.id, "timeOut", e.target.value);
      },
      onBlur: function onBlur() {
        return saveTimeEdit(t.id);
      },
      style: {
        padding: "4px 8px",
        fontSize: 12
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: "form-group",
      style: {
        margin: 0,
        flex: 2,
        minWidth: 160
      }
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label",
      style: {
        fontSize: 11
      }
    }, "Note"), /*#__PURE__*/React.createElement("input", {
      className: "form-input",
      placeholder: "Optional note...",
      value: note,
      onChange: function onChange(e) {
        return updateLocalEdit(t.id, "note", e.target.value);
      },
      onBlur: function onBlur() {
        return saveTimeEdit(t.id);
      },
      style: {
        padding: "4px 8px",
        fontSize: 12
      }
    }))), rec && isTeacher && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 10,
        fontSize: 13,
        color: COLORS.textSecondary,
        paddingTop: 10,
        borderTop: "1px solid var(--border)"
      }
    }, rec.timeIn && /*#__PURE__*/React.createElement("span", null, "Time In: ", /*#__PURE__*/React.createElement("strong", null, rec.timeIn)), rec.timeOut && /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 16
      }
    }, "Time Out: ", /*#__PURE__*/React.createElement("strong", null, rec.timeOut)), rec.note && /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 16
      }
    }, "Note: ", rec.note), /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 16,
        fontSize: 11,
        color: COLORS.textMuted
      }
    }, "Recorded by ", rec.recordedByName)));
  }), visibleTeachers.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty-state"
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty-state-icon"
  }, "\uD83D\uDC65"), /*#__PURE__*/React.createElement("div", {
    className: "empty-state-text"
  }, "No teachers found"))))), tab === "history" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      marginBottom: 16,
      padding: "12px 16px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      flexWrap: "wrap",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("select", {
    className: "form-input",
    style: {
      width: "auto",
      minWidth: 140
    },
    value: filterStatus,
    onChange: function onChange(e) {
      return setFilterStatus(e.target.value);
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "All Status"), /*#__PURE__*/React.createElement("option", {
    value: "Present"
  }, "\u2705 Present"), /*#__PURE__*/React.createElement("option", {
    value: "Late"
  }, "\u23F0 Late"), /*#__PURE__*/React.createElement("option", {
    value: "Absent"
  }, "\u274C Absent")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: COLORS.textMuted
    }
  }, history.length, " records"))), history.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty-state"
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty-state-icon"
  }, "\uD83D\uDCC5"), /*#__PURE__*/React.createElement("div", {
    className: "empty-state-text"
  }, "No attendance records yet"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: COLORS.textMuted
    }
  }, "Start by marking attendance in the Mark tab"))) : /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--card)",
      borderRadius: 14,
      border: "1px solid var(--border)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "table-wrapper"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, isPrincipal && /*#__PURE__*/React.createElement("th", null, "Teacher"), /*#__PURE__*/React.createElement("th", null, "Date"), /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", null, "Time In"), /*#__PURE__*/React.createElement("th", null, "Time Out"), /*#__PURE__*/React.createElement("th", null, "Note"), /*#__PURE__*/React.createElement("th", null, "Recorded By"))), /*#__PURE__*/React.createElement("tbody", null, history.map(function (a) {
    var t = state.users.find(function (u) {
      return u.id === a.teacherId;
    });
    return /*#__PURE__*/React.createElement("tr", {
      key: a.id
    }, isPrincipal && /*#__PURE__*/React.createElement("td", {
      style: {
        fontWeight: 600
      }
    }, (t === null || t === void 0 ? void 0 : t.name) || "—"), /*#__PURE__*/React.createElement("td", {
      style: {
        fontSize: 12,
        fontFamily: "monospace"
      }
    }, a.date), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
      className: "badge ".concat(a.status === "Present" ? "badge-green" : a.status === "Late" ? "badge-gold" : "badge-red"),
      style: {
        fontSize: 11
      }
    }, a.status === "Present" ? "✅ Present" : a.status === "Late" ? "⏰ Late" : "❌ Absent")), /*#__PURE__*/React.createElement("td", {
      style: {
        fontSize: 12,
        color: COLORS.textSecondary
      }
    }, a.timeIn || "—"), /*#__PURE__*/React.createElement("td", {
      style: {
        fontSize: 12,
        color: COLORS.textSecondary
      }
    }, a.timeOut || "—"), /*#__PURE__*/React.createElement("td", {
      style: {
        fontSize: 12,
        color: COLORS.textMuted,
        maxWidth: 160
      }
    }, a.note || "—"), /*#__PURE__*/React.createElement("td", {
      style: {
        fontSize: 11,
        color: COLORS.textMuted
      }
    }, a.recordedByName));
  })))))), tab === "report" && isPrincipal && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-title",
    style: {
      marginBottom: 16
    }
  }, "\uD83D\uDCCA 7-Day Attendance Trend"), last7.map(function (day) {
    var pct = day.total > 0 ? Math.round(day.present / day.total * 100) : 0;
    var barColor = pct >= 80 ? COLORS.emerald : pct >= 60 ? COLORS.gold : COLORS.rose;
    return /*#__PURE__*/React.createElement("div", {
      key: day.date,
      style: {
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 5,
        fontSize: 13
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 600
      }
    }, day.label, " ", /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: COLORS.textMuted
      }
    }, day.date)), /*#__PURE__*/React.createElement("span", {
      style: {
        display: "flex",
        gap: 12,
        fontSize: 12
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: COLORS.emerald
      }
    }, "\u2705 ", day.present), /*#__PURE__*/React.createElement("span", {
      style: {
        color: COLORS.rose
      }
    }, "\u274C ", day.absent), /*#__PURE__*/React.createElement("span", {
      style: {
        color: COLORS.gold
      }
    }, "\u23F0 ", day.late), /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 800,
        color: barColor
      }
    }, pct, "%"))), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 10,
        background: "var(--border)",
        borderRadius: 5,
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: "100%",
        width: "".concat(pct, "%"),
        background: barColor,
        borderRadius: 5,
        transition: "width 0.5s"
      }
    })));
  })), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-title",
    style: {
      marginBottom: 16
    }
  }, "\uD83D\uDC68\u200D\uD83C\uDFEB Teacher Attendance Summary"), report.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "empty-state"
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty-state-icon"
  }, "\uD83D\uDCCA"), /*#__PURE__*/React.createElement("div", {
    className: "empty-state-text"
  }, "No data yet \u2014 start marking attendance")) : /*#__PURE__*/React.createElement("div", {
    className: "table-wrapper"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Teacher"), /*#__PURE__*/React.createElement("th", null, "Days Recorded"), /*#__PURE__*/React.createElement("th", null, "Present"), /*#__PURE__*/React.createElement("th", null, "Late"), /*#__PURE__*/React.createElement("th", null, "Absent"), /*#__PURE__*/React.createElement("th", null, "Attendance Rate"))), /*#__PURE__*/React.createElement("tbody", null, report.sort(function (a, b) {
    return b.rate - a.rate;
  }).map(function (r) {
    return /*#__PURE__*/React.createElement("tr", {
      key: r.teacher.id
    }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 30,
        height: 30,
        borderRadius: "50%",
        flexShrink: 0,
        background: r.teacher.avatar ? "transparent" : "linear-gradient(135deg,var(--blue),var(--indigo))",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 11,
        fontWeight: 700
      }
    }, r.teacher.avatar ? /*#__PURE__*/React.createElement("img", {
      src: r.teacher.avatar,
      alt: "",
      style: {
        width: "100%",
        height: "100%",
        objectFit: "cover"
      }
    }) : r.teacher.name.split(" ").map(function (n) {
      return n[0];
    }).join("").slice(0, 2)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 600
      }
    }, r.teacher.name))), /*#__PURE__*/React.createElement("td", {
      style: {
        textAlign: "center",
        color: COLORS.textSecondary
      }
    }, r.total), /*#__PURE__*/React.createElement("td", {
      style: {
        textAlign: "center",
        color: COLORS.emerald,
        fontWeight: 700
      }
    }, r.present), /*#__PURE__*/React.createElement("td", {
      style: {
        textAlign: "center",
        color: COLORS.gold,
        fontWeight: 700
      }
    }, r.late), /*#__PURE__*/React.createElement("td", {
      style: {
        textAlign: "center",
        color: COLORS.rose,
        fontWeight: 700
      }
    }, r.absent), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        height: 8,
        background: "var(--border)",
        borderRadius: 4,
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: "100%",
        width: "".concat(r.rate, "%"),
        borderRadius: 4,
        background: r.rate >= 80 ? COLORS.emerald : r.rate >= 60 ? COLORS.gold : COLORS.rose
      }
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 700,
        fontSize: 13,
        minWidth: 36,
        color: r.rate >= 80 ? COLORS.emerald : r.rate >= 60 ? COLORS.gold : COLORS.rose
      }
    }, r.rate, "%"))));
  })))))));
}

// ─── MOUNT ────────────────────────────────────────────────────
var _root = ReactDOM.createRoot(document.getElementById('root'));
_root.render(React.createElement(SARMS));
