
/*! jQuery v1.10.2 | (c) 2005, 2013 jQuery Foundation, Inc. | jquery.org/license*/
(function (e, t) {
    var n, r, i = typeof t, o = e.location, a = e.document, s = a.documentElement, l = e.jQuery, u = e.$, c = {}, p = [], f = "1.10.2", d = p.concat, h = p.push, g = p.slice, m = p.indexOf, y = c.toString, v = c.hasOwnProperty, b = f.trim, x = function (e, t) { return new x.fn.init(e, t, r) }, w = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source, T = /\S+/g, C = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, N = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/, k = /^<(\w+)\s*\/?>(?:<\/\1>|)$/, E = /^[\],:{}\s]*$/, S = /(?:^|:|,)(?:\s*\[)+/g, A = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g, j = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g, D = /^-ms-/, L = /-([\da-z])/gi, H = function (e, t) { return t.toUpperCase() }, q = function (e) { (a.addEventListener || "load" === e.type || "complete" === a.readyState) && (_(), x.ready()) }, _ = function () { a.addEventListener ? (a.removeEventListener("DOMContentLoaded", q, !1), e.removeEventListener("load", q, !1)) : (a.detachEvent("onreadystatechange", q), e.detachEvent("onload", q)) }; x.fn = x.prototype = { jquery: f, constructor: x, init: function (e, n, r) { var i, o; if (!e) return this; if ("string" == typeof e) { if (i = "<" === e.charAt(0) && ">" === e.charAt(e.length - 1) && e.length >= 3 ? [null, e, null] : N.exec(e), !i || !i[1] && n) return !n || n.jquery ? (n || r).find(e) : this.constructor(n).find(e); if (i[1]) { if (n = n instanceof x ? n[0] : n, x.merge(this, x.parseHTML(i[1], n && n.nodeType ? n.ownerDocument || n : a, !0)), k.test(i[1]) && x.isPlainObject(n)) for (i in n) x.isFunction(this[i]) ? this[i](n[i]) : this.attr(i, n[i]); return this } if (o = a.getElementById(i[2]), o && o.parentNode) { if (o.id !== i[2]) return r.find(e); this.length = 1, this[0] = o } return this.context = a, this.selector = e, this } return e.nodeType ? (this.context = this[0] = e, this.length = 1, this) : x.isFunction(e) ? r.ready(e) : (e.selector !== t && (this.selector = e.selector, this.context = e.context), x.makeArray(e, this)) }, selector: "", length: 0, toArray: function () { return g.call(this) }, get: function (e) { return null == e ? this.toArray() : 0 > e ? this[this.length + e] : this[e] }, pushStack: function (e) { var t = x.merge(this.constructor(), e); return t.prevObject = this, t.context = this.context, t }, each: function (e, t) { return x.each(this, e, t) }, ready: function (e) { return x.ready.promise().done(e), this }, slice: function () { return this.pushStack(g.apply(this, arguments)) }, first: function () { return this.eq(0) }, last: function () { return this.eq(-1) }, eq: function (e) { var t = this.length, n = +e + (0 > e ? t : 0); return this.pushStack(n >= 0 && t > n ? [this[n]] : []) }, map: function (e) { return this.pushStack(x.map(this, function (t, n) { return e.call(t, n, t) })) }, end: function () { return this.prevObject || this.constructor(null) }, push: h, sort: [].sort, splice: [].splice }, x.fn.init.prototype = x.fn, x.extend = x.fn.extend = function () { var e, n, r, i, o, a, s = arguments[0] || {}, l = 1, u = arguments.length, c = !1; for ("boolean" == typeof s && (c = s, s = arguments[1] || {}, l = 2), "object" == typeof s || x.isFunction(s) || (s = {}), u === l && (s = this, --l) ; u > l; l++) if (null != (o = arguments[l])) for (i in o) e = s[i], r = o[i], s !== r && (c && r && (x.isPlainObject(r) || (n = x.isArray(r))) ? (n ? (n = !1, a = e && x.isArray(e) ? e : []) : a = e && x.isPlainObject(e) ? e : {}, s[i] = x.extend(c, a, r)) : r !== t && (s[i] = r)); return s }, x.extend({ expando: "jQuery" + (f + Math.random()).replace(/\D/g, ""), noConflict: function (t) { return e.$ === x && (e.$ = u), t && e.jQuery === x && (e.jQuery = l), x }, isReady: !1, readyWait: 1, holdReady: function (e) { e ? x.readyWait++ : x.ready(!0) }, ready: function (e) { if (e === !0 ? !--x.readyWait : !x.isReady) { if (!a.body) return setTimeout(x.ready); x.isReady = !0, e !== !0 && --x.readyWait > 0 || (n.resolveWith(a, [x]), x.fn.trigger && x(a).trigger("ready").off("ready")) } }, isFunction: function (e) { return "function" === x.type(e) }, isArray: Array.isArray || function (e) { return "array" === x.type(e) }, isWindow: function (e) { return null != e && e == e.window }, isNumeric: function (e) { return !isNaN(parseFloat(e)) && isFinite(e) }, type: function (e) { return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? c[y.call(e)] || "object" : typeof e }, isPlainObject: function (e) { var n; if (!e || "object" !== x.type(e) || e.nodeType || x.isWindow(e)) return !1; try { if (e.constructor && !v.call(e, "constructor") && !v.call(e.constructor.prototype, "isPrototypeOf")) return !1 } catch (r) { return !1 } if (x.support.ownLast) for (n in e) return v.call(e, n); for (n in e); return n === t || v.call(e, n) }, isEmptyObject: function (e) { var t; for (t in e) return !1; return !0 }, error: function (e) { throw Error(e) }, parseHTML: function (e, t, n) { if (!e || "string" != typeof e) return null; "boolean" == typeof t && (n = t, t = !1), t = t || a; var r = k.exec(e), i = !n && []; return r ? [t.createElement(r[1])] : (r = x.buildFragment([e], t, i), i && x(i).remove(), x.merge([], r.childNodes)) }, parseJSON: function (n) { return e.JSON && e.JSON.parse ? e.JSON.parse(n) : null === n ? n : "string" == typeof n && (n = x.trim(n), n && E.test(n.replace(A, "@").replace(j, "]").replace(S, ""))) ? Function("return " + n)() : (x.error("Invalid JSON: " + n), t) }, parseXML: function (n) { var r, i; if (!n || "string" != typeof n) return null; try { e.DOMParser ? (i = new DOMParser, r = i.parseFromString(n, "text/xml")) : (r = new ActiveXObject("Microsoft.XMLDOM"), r.async = "false", r.loadXML(n)) } catch (o) { r = t } return r && r.documentElement && !r.getElementsByTagName("parsererror").length || x.error("Invalid XML: " + n), r }, noop: function () { }, globalEval: function (t) { t && x.trim(t) && (e.execScript || function (t) { e.eval.call(e, t) })(t) }, camelCase: function (e) { return e.replace(D, "ms-").replace(L, H) }, nodeName: function (e, t) { return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase() }, each: function (e, t, n) { var r, i = 0, o = e.length, a = M(e); if (n) { if (a) { for (; o > i; i++) if (r = t.apply(e[i], n), r === !1) break } else for (i in e) if (r = t.apply(e[i], n), r === !1) break } else if (a) { for (; o > i; i++) if (r = t.call(e[i], i, e[i]), r === !1) break } else for (i in e) if (r = t.call(e[i], i, e[i]), r === !1) break; return e }, trim: b && !b.call("\ufeff\u00a0") ? function (e) { return null == e ? "" : b.call(e) } : function (e) { return null == e ? "" : (e + "").replace(C, "") }, makeArray: function (e, t) { var n = t || []; return null != e && (M(Object(e)) ? x.merge(n, "string" == typeof e ? [e] : e) : h.call(n, e)), n }, inArray: function (e, t, n) { var r; if (t) { if (m) return m.call(t, e, n); for (r = t.length, n = n ? 0 > n ? Math.max(0, r + n) : n : 0; r > n; n++) if (n in t && t[n] === e) return n } return -1 }, merge: function (e, n) { var r = n.length, i = e.length, o = 0; if ("number" == typeof r) for (; r > o; o++) e[i++] = n[o]; else while (n[o] !== t) e[i++] = n[o++]; return e.length = i, e }, grep: function (e, t, n) { var r, i = [], o = 0, a = e.length; for (n = !!n; a > o; o++) r = !!t(e[o], o), n !== r && i.push(e[o]); return i }, map: function (e, t, n) { var r, i = 0, o = e.length, a = M(e), s = []; if (a) for (; o > i; i++) r = t(e[i], i, n), null != r && (s[s.length] = r); else for (i in e) r = t(e[i], i, n), null != r && (s[s.length] = r); return d.apply([], s) }, guid: 1, proxy: function (e, n) { var r, i, o; return "string" == typeof n && (o = e[n], n = e, e = o), x.isFunction(e) ? (r = g.call(arguments, 2), i = function () { return e.apply(n || this, r.concat(g.call(arguments))) }, i.guid = e.guid = e.guid || x.guid++, i) : t }, access: function (e, n, r, i, o, a, s) { var l = 0, u = e.length, c = null == r; if ("object" === x.type(r)) { o = !0; for (l in r) x.access(e, n, l, r[l], !0, a, s) } else if (i !== t && (o = !0, x.isFunction(i) || (s = !0), c && (s ? (n.call(e, i), n = null) : (c = n, n = function (e, t, n) { return c.call(x(e), n) })), n)) for (; u > l; l++) n(e[l], r, s ? i : i.call(e[l], l, n(e[l], r))); return o ? e : c ? n.call(e) : u ? n(e[0], r) : a }, now: function () { return (new Date).getTime() }, swap: function (e, t, n, r) { var i, o, a = {}; for (o in t) a[o] = e.style[o], e.style[o] = t[o]; i = n.apply(e, r || []); for (o in t) e.style[o] = a[o]; return i } }), x.ready.promise = function (t) { if (!n) if (n = x.Deferred(), "complete" === a.readyState) setTimeout(x.ready); else if (a.addEventListener) a.addEventListener("DOMContentLoaded", q, !1), e.addEventListener("load", q, !1); else { a.attachEvent("onreadystatechange", q), e.attachEvent("onload", q); var r = !1; try { r = null == e.frameElement && a.documentElement } catch (i) { } r && r.doScroll && function o() { if (!x.isReady) { try { r.doScroll("left") } catch (e) { return setTimeout(o, 50) } _(), x.ready() } }() } return n.promise(t) }, x.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (e, t) { c["[object " + t + "]"] = t.toLowerCase() }); function M(e) { var t = e.length, n = x.type(e); return x.isWindow(e) ? !1 : 1 === e.nodeType && t ? !0 : "array" === n || "function" !== n && (0 === t || "number" == typeof t && t > 0 && t - 1 in e) } r = x(a), function (e, t) { var n, r, i, o, a, s, l, u, c, p, f, d, h, g, m, y, v, b = "sizzle" + -new Date, w = e.document, T = 0, C = 0, N = st(), k = st(), E = st(), S = !1, A = function (e, t) { return e === t ? (S = !0, 0) : 0 }, j = typeof t, D = 1 << 31, L = {}.hasOwnProperty, H = [], q = H.pop, _ = H.push, M = H.push, O = H.slice, F = H.indexOf || function (e) { var t = 0, n = this.length; for (; n > t; t++) if (this[t] === e) return t; return -1 }, B = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", P = "[\\x20\\t\\r\\n\\f]", R = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+", W = R.replace("w", "w#"), $ = "\\[" + P + "*(" + R + ")" + P + "*(?:([*^$|!~]?=)" + P + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + W + ")|)|)" + P + "*\\]", I = ":(" + R + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + $.replace(3, 8) + ")*)|.*)\\)|)", z = RegExp("^" + P + "+|((?:^|[^\\\\])(?:\\\\.)*)" + P + "+$", "g"), X = RegExp("^" + P + "*," + P + "*"), U = RegExp("^" + P + "*([>+~]|" + P + ")" + P + "*"), V = RegExp(P + "*[+~]"), Y = RegExp("=" + P + "*([^\\]'\"]*)" + P + "*\\]", "g"), J = RegExp(I), G = RegExp("^" + W + "$"), Q = { ID: RegExp("^#(" + R + ")"), CLASS: RegExp("^\\.(" + R + ")"), TAG: RegExp("^(" + R.replace("w", "w*") + ")"), ATTR: RegExp("^" + $), PSEUDO: RegExp("^" + I), CHILD: RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + P + "*(even|odd|(([+-]|)(\\d*)n|)" + P + "*(?:([+-]|)" + P + "*(\\d+)|))" + P + "*\\)|)", "i"), bool: RegExp("^(?:" + B + ")$", "i"), needsContext: RegExp("^" + P + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + P + "*((?:-\\d)?\\d*)" + P + "*\\)|)(?=[^-]|$)", "i") }, K = /^[^{]+\{\s*\[native \w/, Z = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, et = /^(?:input|select|textarea|button)$/i, tt = /^h\d$/i, nt = /'|\\/g, rt = RegExp("\\\\([\\da-f]{1,6}" + P + "?|(" + P + ")|.)", "ig"), it = function (e, t, n) { var r = "0x" + t - 65536; return r !== r || n ? t : 0 > r ? String.fromCharCode(r + 65536) : String.fromCharCode(55296 | r >> 10, 56320 | 1023 & r) }; try { M.apply(H = O.call(w.childNodes), w.childNodes), H[w.childNodes.length].nodeType } catch (ot) { M = { apply: H.length ? function (e, t) { _.apply(e, O.call(t)) } : function (e, t) { var n = e.length, r = 0; while (e[n++] = t[r++]); e.length = n - 1 } } } function at(e, t, n, i) { var o, a, s, l, u, c, d, m, y, x; if ((t ? t.ownerDocument || t : w) !== f && p(t), t = t || f, n = n || [], !e || "string" != typeof e) return n; if (1 !== (l = t.nodeType) && 9 !== l) return []; if (h && !i) { if (o = Z.exec(e)) if (s = o[1]) { if (9 === l) { if (a = t.getElementById(s), !a || !a.parentNode) return n; if (a.id === s) return n.push(a), n } else if (t.ownerDocument && (a = t.ownerDocument.getElementById(s)) && v(t, a) && a.id === s) return n.push(a), n } else { if (o[2]) return M.apply(n, t.getElementsByTagName(e)), n; if ((s = o[3]) && r.getElementsByClassName && t.getElementsByClassName) return M.apply(n, t.getElementsByClassName(s)), n } if (r.qsa && (!g || !g.test(e))) { if (m = d = b, y = t, x = 9 === l && e, 1 === l && "object" !== t.nodeName.toLowerCase()) { c = mt(e), (d = t.getAttribute("id")) ? m = d.replace(nt, "\\$&") : t.setAttribute("id", m), m = "[id='" + m + "'] ", u = c.length; while (u--) c[u] = m + yt(c[u]); y = V.test(e) && t.parentNode || t, x = c.join(",") } if (x) try { return M.apply(n, y.querySelectorAll(x)), n } catch (T) { } finally { d || t.removeAttribute("id") } } } return kt(e.replace(z, "$1"), t, n, i) } function st() { var e = []; function t(n, r) { return e.push(n += " ") > o.cacheLength && delete t[e.shift()], t[n] = r } return t } function lt(e) { return e[b] = !0, e } function ut(e) { var t = f.createElement("div"); try { return !!e(t) } catch (n) { return !1 } finally { t.parentNode && t.parentNode.removeChild(t), t = null } } function ct(e, t) { var n = e.split("|"), r = e.length; while (r--) o.attrHandle[n[r]] = t } function pt(e, t) { var n = t && e, r = n && 1 === e.nodeType && 1 === t.nodeType && (~t.sourceIndex || D) - (~e.sourceIndex || D); if (r) return r; if (n) while (n = n.nextSibling) if (n === t) return -1; return e ? 1 : -1 } function ft(e) { return function (t) { var n = t.nodeName.toLowerCase(); return "input" === n && t.type === e } } function dt(e) { return function (t) { var n = t.nodeName.toLowerCase(); return ("input" === n || "button" === n) && t.type === e } } function ht(e) { return lt(function (t) { return t = +t, lt(function (n, r) { var i, o = e([], n.length, t), a = o.length; while (a--) n[i = o[a]] && (n[i] = !(r[i] = n[i])) }) }) } s = at.isXML = function (e) { var t = e && (e.ownerDocument || e).documentElement; return t ? "HTML" !== t.nodeName : !1 }, r = at.support = {}, p = at.setDocument = function (e) { var n = e ? e.ownerDocument || e : w, i = n.defaultView; return n !== f && 9 === n.nodeType && n.documentElement ? (f = n, d = n.documentElement, h = !s(n), i && i.attachEvent && i !== i.top && i.attachEvent("onbeforeunload", function () { p() }), r.attributes = ut(function (e) { return e.className = "i", !e.getAttribute("className") }), r.getElementsByTagName = ut(function (e) { return e.appendChild(n.createComment("")), !e.getElementsByTagName("*").length }), r.getElementsByClassName = ut(function (e) { return e.innerHTML = "<div class='a'></div><div class='a i'></div>", e.firstChild.className = "i", 2 === e.getElementsByClassName("i").length }), r.getById = ut(function (e) { return d.appendChild(e).id = b, !n.getElementsByName || !n.getElementsByName(b).length }), r.getById ? (o.find.ID = function (e, t) { if (typeof t.getElementById !== j && h) { var n = t.getElementById(e); return n && n.parentNode ? [n] : [] } }, o.filter.ID = function (e) { var t = e.replace(rt, it); return function (e) { return e.getAttribute("id") === t } }) : (delete o.find.ID, o.filter.ID = function (e) { var t = e.replace(rt, it); return function (e) { var n = typeof e.getAttributeNode !== j && e.getAttributeNode("id"); return n && n.value === t } }), o.find.TAG = r.getElementsByTagName ? function (e, n) { return typeof n.getElementsByTagName !== j ? n.getElementsByTagName(e) : t } : function (e, t) { var n, r = [], i = 0, o = t.getElementsByTagName(e); if ("*" === e) { while (n = o[i++]) 1 === n.nodeType && r.push(n); return r } return o }, o.find.CLASS = r.getElementsByClassName && function (e, n) { return typeof n.getElementsByClassName !== j && h ? n.getElementsByClassName(e) : t }, m = [], g = [], (r.qsa = K.test(n.querySelectorAll)) && (ut(function (e) { e.innerHTML = "<select><option selected=''></option></select>", e.querySelectorAll("[selected]").length || g.push("\\[" + P + "*(?:value|" + B + ")"), e.querySelectorAll(":checked").length || g.push(":checked") }), ut(function (e) { var t = n.createElement("input"); t.setAttribute("type", "hidden"), e.appendChild(t).setAttribute("t", ""), e.querySelectorAll("[t^='']").length && g.push("[*^$]=" + P + "*(?:''|\"\")"), e.querySelectorAll(":enabled").length || g.push(":enabled", ":disabled"), e.querySelectorAll("*,:x"), g.push(",.*:") })), (r.matchesSelector = K.test(y = d.webkitMatchesSelector || d.mozMatchesSelector || d.oMatchesSelector || d.msMatchesSelector)) && ut(function (e) { r.disconnectedMatch = y.call(e, "div"), y.call(e, "[s!='']:x"), m.push("!=", I) }), g = g.length && RegExp(g.join("|")), m = m.length && RegExp(m.join("|")), v = K.test(d.contains) || d.compareDocumentPosition ? function (e, t) { var n = 9 === e.nodeType ? e.documentElement : e, r = t && t.parentNode; return e === r || !(!r || 1 !== r.nodeType || !(n.contains ? n.contains(r) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(r))) } : function (e, t) { if (t) while (t = t.parentNode) if (t === e) return !0; return !1 }, A = d.compareDocumentPosition ? function (e, t) { if (e === t) return S = !0, 0; var i = t.compareDocumentPosition && e.compareDocumentPosition && e.compareDocumentPosition(t); return i ? 1 & i || !r.sortDetached && t.compareDocumentPosition(e) === i ? e === n || v(w, e) ? -1 : t === n || v(w, t) ? 1 : c ? F.call(c, e) - F.call(c, t) : 0 : 4 & i ? -1 : 1 : e.compareDocumentPosition ? -1 : 1 } : function (e, t) { var r, i = 0, o = e.parentNode, a = t.parentNode, s = [e], l = [t]; if (e === t) return S = !0, 0; if (!o || !a) return e === n ? -1 : t === n ? 1 : o ? -1 : a ? 1 : c ? F.call(c, e) - F.call(c, t) : 0; if (o === a) return pt(e, t); r = e; while (r = r.parentNode) s.unshift(r); r = t; while (r = r.parentNode) l.unshift(r); while (s[i] === l[i]) i++; return i ? pt(s[i], l[i]) : s[i] === w ? -1 : l[i] === w ? 1 : 0 }, n) : f }, at.matches = function (e, t) { return at(e, null, null, t) }, at.matchesSelector = function (e, t) { if ((e.ownerDocument || e) !== f && p(e), t = t.replace(Y, "='$1']"), !(!r.matchesSelector || !h || m && m.test(t) || g && g.test(t))) try { var n = y.call(e, t); if (n || r.disconnectedMatch || e.document && 11 !== e.document.nodeType) return n } catch (i) { } return at(t, f, null, [e]).length > 0 }, at.contains = function (e, t) { return (e.ownerDocument || e) !== f && p(e), v(e, t) }, at.attr = function (e, n) { (e.ownerDocument || e) !== f && p(e); var i = o.attrHandle[n.toLowerCase()], a = i && L.call(o.attrHandle, n.toLowerCase()) ? i(e, n, !h) : t; return a === t ? r.attributes || !h ? e.getAttribute(n) : (a = e.getAttributeNode(n)) && a.specified ? a.value : null : a }, at.error = function (e) { throw Error("Syntax error, unrecognized expression: " + e) }, at.uniqueSort = function (e) { var t, n = [], i = 0, o = 0; if (S = !r.detectDuplicates, c = !r.sortStable && e.slice(0), e.sort(A), S) { while (t = e[o++]) t === e[o] && (i = n.push(o)); while (i--) e.splice(n[i], 1) } return e }, a = at.getText = function (e) { var t, n = "", r = 0, i = e.nodeType; if (i) { if (1 === i || 9 === i || 11 === i) { if ("string" == typeof e.textContent) return e.textContent; for (e = e.firstChild; e; e = e.nextSibling) n += a(e) } else if (3 === i || 4 === i) return e.nodeValue } else for (; t = e[r]; r++) n += a(t); return n }, o = at.selectors = { cacheLength: 50, createPseudo: lt, match: Q, attrHandle: {}, find: {}, relative: { ">": { dir: "parentNode", first: !0 }, " ": { dir: "parentNode" }, "+": { dir: "previousSibling", first: !0 }, "~": { dir: "previousSibling" } }, preFilter: { ATTR: function (e) { return e[1] = e[1].replace(rt, it), e[3] = (e[4] || e[5] || "").replace(rt, it), "~=" === e[2] && (e[3] = " " + e[3] + " "), e.slice(0, 4) }, CHILD: function (e) { return e[1] = e[1].toLowerCase(), "nth" === e[1].slice(0, 3) ? (e[3] || at.error(e[0]), e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])), e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && at.error(e[0]), e }, PSEUDO: function (e) { var n, r = !e[5] && e[2]; return Q.CHILD.test(e[0]) ? null : (e[3] && e[4] !== t ? e[2] = e[4] : r && J.test(r) && (n = mt(r, !0)) && (n = r.indexOf(")", r.length - n) - r.length) && (e[0] = e[0].slice(0, n), e[2] = r.slice(0, n)), e.slice(0, 3)) } }, filter: { TAG: function (e) { var t = e.replace(rt, it).toLowerCase(); return "*" === e ? function () { return !0 } : function (e) { return e.nodeName && e.nodeName.toLowerCase() === t } }, CLASS: function (e) { var t = N[e + " "]; return t || (t = RegExp("(^|" + P + ")" + e + "(" + P + "|$)")) && N(e, function (e) { return t.test("string" == typeof e.className && e.className || typeof e.getAttribute !== j && e.getAttribute("class") || "") }) }, ATTR: function (e, t, n) { return function (r) { var i = at.attr(r, e); return null == i ? "!=" === t : t ? (i += "", "=" === t ? i === n : "!=" === t ? i !== n : "^=" === t ? n && 0 === i.indexOf(n) : "*=" === t ? n && i.indexOf(n) > -1 : "$=" === t ? n && i.slice(-n.length) === n : "~=" === t ? (" " + i + " ").indexOf(n) > -1 : "|=" === t ? i === n || i.slice(0, n.length + 1) === n + "-" : !1) : !0 } }, CHILD: function (e, t, n, r, i) { var o = "nth" !== e.slice(0, 3), a = "last" !== e.slice(-4), s = "of-type" === t; return 1 === r && 0 === i ? function (e) { return !!e.parentNode } : function (t, n, l) { var u, c, p, f, d, h, g = o !== a ? "nextSibling" : "previousSibling", m = t.parentNode, y = s && t.nodeName.toLowerCase(), v = !l && !s; if (m) { if (o) { while (g) { p = t; while (p = p[g]) if (s ? p.nodeName.toLowerCase() === y : 1 === p.nodeType) return !1; h = g = "only" === e && !h && "nextSibling" } return !0 } if (h = [a ? m.firstChild : m.lastChild], a && v) { c = m[b] || (m[b] = {}), u = c[e] || [], d = u[0] === T && u[1], f = u[0] === T && u[2], p = d && m.childNodes[d]; while (p = ++d && p && p[g] || (f = d = 0) || h.pop()) if (1 === p.nodeType && ++f && p === t) { c[e] = [T, d, f]; break } } else if (v && (u = (t[b] || (t[b] = {}))[e]) && u[0] === T) f = u[1]; else while (p = ++d && p && p[g] || (f = d = 0) || h.pop()) if ((s ? p.nodeName.toLowerCase() === y : 1 === p.nodeType) && ++f && (v && ((p[b] || (p[b] = {}))[e] = [T, f]), p === t)) break; return f -= i, f === r || 0 === f % r && f / r >= 0 } } }, PSEUDO: function (e, t) { var n, r = o.pseudos[e] || o.setFilters[e.toLowerCase()] || at.error("unsupported pseudo: " + e); return r[b] ? r(t) : r.length > 1 ? (n = [e, e, "", t], o.setFilters.hasOwnProperty(e.toLowerCase()) ? lt(function (e, n) { var i, o = r(e, t), a = o.length; while (a--) i = F.call(e, o[a]), e[i] = !(n[i] = o[a]) }) : function (e) { return r(e, 0, n) }) : r } }, pseudos: { not: lt(function (e) { var t = [], n = [], r = l(e.replace(z, "$1")); return r[b] ? lt(function (e, t, n, i) { var o, a = r(e, null, i, []), s = e.length; while (s--) (o = a[s]) && (e[s] = !(t[s] = o)) }) : function (e, i, o) { return t[0] = e, r(t, null, o, n), !n.pop() } }), has: lt(function (e) { return function (t) { return at(e, t).length > 0 } }), contains: lt(function (e) { return function (t) { return (t.textContent || t.innerText || a(t)).indexOf(e) > -1 } }), lang: lt(function (e) { return G.test(e || "") || at.error("unsupported lang: " + e), e = e.replace(rt, it).toLowerCase(), function (t) { var n; do if (n = h ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang")) return n = n.toLowerCase(), n === e || 0 === n.indexOf(e + "-"); while ((t = t.parentNode) && 1 === t.nodeType); return !1 } }), target: function (t) { var n = e.location && e.location.hash; return n && n.slice(1) === t.id }, root: function (e) { return e === d }, focus: function (e) { return e === f.activeElement && (!f.hasFocus || f.hasFocus()) && !!(e.type || e.href || ~e.tabIndex) }, enabled: function (e) { return e.disabled === !1 }, disabled: function (e) { return e.disabled === !0 }, checked: function (e) { var t = e.nodeName.toLowerCase(); return "input" === t && !!e.checked || "option" === t && !!e.selected }, selected: function (e) { return e.parentNode && e.parentNode.selectedIndex, e.selected === !0 }, empty: function (e) { for (e = e.firstChild; e; e = e.nextSibling) if (e.nodeName > "@" || 3 === e.nodeType || 4 === e.nodeType) return !1; return !0 }, parent: function (e) { return !o.pseudos.empty(e) }, header: function (e) { return tt.test(e.nodeName) }, input: function (e) { return et.test(e.nodeName) }, button: function (e) { var t = e.nodeName.toLowerCase(); return "input" === t && "button" === e.type || "button" === t }, text: function (e) { var t; return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || t.toLowerCase() === e.type) }, first: ht(function () { return [0] }), last: ht(function (e, t) { return [t - 1] }), eq: ht(function (e, t, n) { return [0 > n ? n + t : n] }), even: ht(function (e, t) { var n = 0; for (; t > n; n += 2) e.push(n); return e }), odd: ht(function (e, t) { var n = 1; for (; t > n; n += 2) e.push(n); return e }), lt: ht(function (e, t, n) { var r = 0 > n ? n + t : n; for (; --r >= 0;) e.push(r); return e }), gt: ht(function (e, t, n) { var r = 0 > n ? n + t : n; for (; t > ++r;) e.push(r); return e }) } }, o.pseudos.nth = o.pseudos.eq; for (n in { radio: !0, checkbox: !0, file: !0, password: !0, image: !0 }) o.pseudos[n] = ft(n); for (n in { submit: !0, reset: !0 }) o.pseudos[n] = dt(n); function gt() { } gt.prototype = o.filters = o.pseudos, o.setFilters = new gt; function mt(e, t) { var n, r, i, a, s, l, u, c = k[e + " "]; if (c) return t ? 0 : c.slice(0); s = e, l = [], u = o.preFilter; while (s) { (!n || (r = X.exec(s))) && (r && (s = s.slice(r[0].length) || s), l.push(i = [])), n = !1, (r = U.exec(s)) && (n = r.shift(), i.push({ value: n, type: r[0].replace(z, " ") }), s = s.slice(n.length)); for (a in o.filter) !(r = Q[a].exec(s)) || u[a] && !(r = u[a](r)) || (n = r.shift(), i.push({ value: n, type: a, matches: r }), s = s.slice(n.length)); if (!n) break } return t ? s.length : s ? at.error(e) : k(e, l).slice(0) } function yt(e) { var t = 0, n = e.length, r = ""; for (; n > t; t++) r += e[t].value; return r } function vt(e, t, n) { var r = t.dir, o = n && "parentNode" === r, a = C++; return t.first ? function (t, n, i) { while (t = t[r]) if (1 === t.nodeType || o) return e(t, n, i) } : function (t, n, s) { var l, u, c, p = T + " " + a; if (s) { while (t = t[r]) if ((1 === t.nodeType || o) && e(t, n, s)) return !0 } else while (t = t[r]) if (1 === t.nodeType || o) if (c = t[b] || (t[b] = {}), (u = c[r]) && u[0] === p) { if ((l = u[1]) === !0 || l === i) return l === !0 } else if (u = c[r] = [p], u[1] = e(t, n, s) || i, u[1] === !0) return !0 } } function bt(e) { return e.length > 1 ? function (t, n, r) { var i = e.length; while (i--) if (!e[i](t, n, r)) return !1; return !0 } : e[0] } function xt(e, t, n, r, i) { var o, a = [], s = 0, l = e.length, u = null != t; for (; l > s; s++) (o = e[s]) && (!n || n(o, r, i)) && (a.push(o), u && t.push(s)); return a } function wt(e, t, n, r, i, o) { return r && !r[b] && (r = wt(r)), i && !i[b] && (i = wt(i, o)), lt(function (o, a, s, l) { var u, c, p, f = [], d = [], h = a.length, g = o || Nt(t || "*", s.nodeType ? [s] : s, []), m = !e || !o && t ? g : xt(g, f, e, s, l), y = n ? i || (o ? e : h || r) ? [] : a : m; if (n && n(m, y, s, l), r) { u = xt(y, d), r(u, [], s, l), c = u.length; while (c--) (p = u[c]) && (y[d[c]] = !(m[d[c]] = p)) } if (o) { if (i || e) { if (i) { u = [], c = y.length; while (c--) (p = y[c]) && u.push(m[c] = p); i(null, y = [], u, l) } c = y.length; while (c--) (p = y[c]) && (u = i ? F.call(o, p) : f[c]) > -1 && (o[u] = !(a[u] = p)) } } else y = xt(y === a ? y.splice(h, y.length) : y), i ? i(null, a, y, l) : M.apply(a, y) }) } function Tt(e) { var t, n, r, i = e.length, a = o.relative[e[0].type], s = a || o.relative[" "], l = a ? 1 : 0, c = vt(function (e) { return e === t }, s, !0), p = vt(function (e) { return F.call(t, e) > -1 }, s, !0), f = [function (e, n, r) { return !a && (r || n !== u) || ((t = n).nodeType ? c(e, n, r) : p(e, n, r)) }]; for (; i > l; l++) if (n = o.relative[e[l].type]) f = [vt(bt(f), n)]; else { if (n = o.filter[e[l].type].apply(null, e[l].matches), n[b]) { for (r = ++l; i > r; r++) if (o.relative[e[r].type]) break; return wt(l > 1 && bt(f), l > 1 && yt(e.slice(0, l - 1).concat({ value: " " === e[l - 2].type ? "*" : "" })).replace(z, "$1"), n, r > l && Tt(e.slice(l, r)), i > r && Tt(e = e.slice(r)), i > r && yt(e)) } f.push(n) } return bt(f) } function Ct(e, t) { var n = 0, r = t.length > 0, a = e.length > 0, s = function (s, l, c, p, d) { var h, g, m, y = [], v = 0, b = "0", x = s && [], w = null != d, C = u, N = s || a && o.find.TAG("*", d && l.parentNode || l), k = T += null == C ? 1 : Math.random() || .1; for (w && (u = l !== f && l, i = n) ; null != (h = N[b]) ; b++) { if (a && h) { g = 0; while (m = e[g++]) if (m(h, l, c)) { p.push(h); break } w && (T = k, i = ++n) } r && ((h = !m && h) && v--, s && x.push(h)) } if (v += b, r && b !== v) { g = 0; while (m = t[g++]) m(x, y, l, c); if (s) { if (v > 0) while (b--) x[b] || y[b] || (y[b] = q.call(p)); y = xt(y) } M.apply(p, y), w && !s && y.length > 0 && v + t.length > 1 && at.uniqueSort(p) } return w && (T = k, u = C), x }; return r ? lt(s) : s } l = at.compile = function (e, t) { var n, r = [], i = [], o = E[e + " "]; if (!o) { t || (t = mt(e)), n = t.length; while (n--) o = Tt(t[n]), o[b] ? r.push(o) : i.push(o); o = E(e, Ct(i, r)) } return o }; function Nt(e, t, n) { var r = 0, i = t.length; for (; i > r; r++) at(e, t[r], n); return n } function kt(e, t, n, i) { var a, s, u, c, p, f = mt(e); if (!i && 1 === f.length) { if (s = f[0] = f[0].slice(0), s.length > 2 && "ID" === (u = s[0]).type && r.getById && 9 === t.nodeType && h && o.relative[s[1].type]) { if (t = (o.find.ID(u.matches[0].replace(rt, it), t) || [])[0], !t) return n; e = e.slice(s.shift().value.length) } a = Q.needsContext.test(e) ? 0 : s.length; while (a--) { if (u = s[a], o.relative[c = u.type]) break; if ((p = o.find[c]) && (i = p(u.matches[0].replace(rt, it), V.test(s[0].type) && t.parentNode || t))) { if (s.splice(a, 1), e = i.length && yt(s), !e) return M.apply(n, i), n; break } } } return l(e, f)(i, t, !h, n, V.test(e)), n } r.sortStable = b.split("").sort(A).join("") === b, r.detectDuplicates = S, p(), r.sortDetached = ut(function (e) { return 1 & e.compareDocumentPosition(f.createElement("div")) }), ut(function (e) { return e.innerHTML = "<a href='#'></a>", "#" === e.firstChild.getAttribute("href") }) || ct("type|href|height|width", function (e, n, r) { return r ? t : e.getAttribute(n, "type" === n.toLowerCase() ? 1 : 2) }), r.attributes && ut(function (e) { return e.innerHTML = "<input/>", e.firstChild.setAttribute("value", ""), "" === e.firstChild.getAttribute("value") }) || ct("value", function (e, n, r) { return r || "input" !== e.nodeName.toLowerCase() ? t : e.defaultValue }), ut(function (e) { return null == e.getAttribute("disabled") }) || ct(B, function (e, n, r) { var i; return r ? t : (i = e.getAttributeNode(n)) && i.specified ? i.value : e[n] === !0 ? n.toLowerCase() : null }), x.find = at, x.expr = at.selectors, x.expr[":"] = x.expr.pseudos, x.unique = at.uniqueSort, x.text = at.getText, x.isXMLDoc = at.isXML, x.contains = at.contains }(e); var O = {}; function F(e) { var t = O[e] = {}; return x.each(e.match(T) || [], function (e, n) { t[n] = !0 }), t } x.Callbacks = function (e) { e = "string" == typeof e ? O[e] || F(e) : x.extend({}, e); var n, r, i, o, a, s, l = [], u = !e.once && [], c = function (t) { for (r = e.memory && t, i = !0, a = s || 0, s = 0, o = l.length, n = !0; l && o > a; a++) if (l[a].apply(t[0], t[1]) === !1 && e.stopOnFalse) { r = !1; break } n = !1, l && (u ? u.length && c(u.shift()) : r ? l = [] : p.disable()) }, p = { add: function () { if (l) { var t = l.length; (function i(t) { x.each(t, function (t, n) { var r = x.type(n); "function" === r ? e.unique && p.has(n) || l.push(n) : n && n.length && "string" !== r && i(n) }) })(arguments), n ? o = l.length : r && (s = t, c(r)) } return this }, remove: function () { return l && x.each(arguments, function (e, t) { var r; while ((r = x.inArray(t, l, r)) > -1) l.splice(r, 1), n && (o >= r && o--, a >= r && a--) }), this }, has: function (e) { return e ? x.inArray(e, l) > -1 : !(!l || !l.length) }, empty: function () { return l = [], o = 0, this }, disable: function () { return l = u = r = t, this }, disabled: function () { return !l }, lock: function () { return u = t, r || p.disable(), this }, locked: function () { return !u }, fireWith: function (e, t) { return !l || i && !u || (t = t || [], t = [e, t.slice ? t.slice() : t], n ? u.push(t) : c(t)), this }, fire: function () { return p.fireWith(this, arguments), this }, fired: function () { return !!i } }; return p }, x.extend({ Deferred: function (e) { var t = [["resolve", "done", x.Callbacks("once memory"), "resolved"], ["reject", "fail", x.Callbacks("once memory"), "rejected"], ["notify", "progress", x.Callbacks("memory")]], n = "pending", r = { state: function () { return n }, always: function () { return i.done(arguments).fail(arguments), this }, then: function () { var e = arguments; return x.Deferred(function (n) { x.each(t, function (t, o) { var a = o[0], s = x.isFunction(e[t]) && e[t]; i[o[1]](function () { var e = s && s.apply(this, arguments); e && x.isFunction(e.promise) ? e.promise().done(n.resolve).fail(n.reject).progress(n.notify) : n[a + "With"](this === r ? n.promise() : this, s ? [e] : arguments) }) }), e = null }).promise() }, promise: function (e) { return null != e ? x.extend(e, r) : r } }, i = {}; return r.pipe = r.then, x.each(t, function (e, o) { var a = o[2], s = o[3]; r[o[1]] = a.add, s && a.add(function () { n = s }, t[1 ^ e][2].disable, t[2][2].lock), i[o[0]] = function () { return i[o[0] + "With"](this === i ? r : this, arguments), this }, i[o[0] + "With"] = a.fireWith }), r.promise(i), e && e.call(i, i), i }, when: function (e) { var t = 0, n = g.call(arguments), r = n.length, i = 1 !== r || e && x.isFunction(e.promise) ? r : 0, o = 1 === i ? e : x.Deferred(), a = function (e, t, n) { return function (r) { t[e] = this, n[e] = arguments.length > 1 ? g.call(arguments) : r, n === s ? o.notifyWith(t, n) : --i || o.resolveWith(t, n) } }, s, l, u; if (r > 1) for (s = Array(r), l = Array(r), u = Array(r) ; r > t; t++) n[t] && x.isFunction(n[t].promise) ? n[t].promise().done(a(t, u, n)).fail(o.reject).progress(a(t, l, s)) : --i; return i || o.resolveWith(u, n), o.promise() } }), x.support = function (t) {
        var n, r, o, s, l, u, c, p, f, d = a.createElement("div"); if (d.setAttribute("className", "t"), d.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", n = d.getElementsByTagName("*") || [], r = d.getElementsByTagName("a")[0], !r || !r.style || !n.length) return t; s = a.createElement("select"), u = s.appendChild(a.createElement("option")), o = d.getElementsByTagName("input")[0], r.style.cssText = "top:1px;float:left;opacity:.5", t.getSetAttribute = "t" !== d.className, t.leadingWhitespace = 3 === d.firstChild.nodeType, t.tbody = !d.getElementsByTagName("tbody").length, t.htmlSerialize = !!d.getElementsByTagName("link").length, t.style = /top/.test(r.getAttribute("style")), t.hrefNormalized = "/a" === r.getAttribute("href"), t.opacity = /^0.5/.test(r.style.opacity), t.cssFloat = !!r.style.cssFloat, t.checkOn = !!o.value, t.optSelected = u.selected, t.enctype = !!a.createElement("form").enctype, t.html5Clone = "<:nav></:nav>" !== a.createElement("nav").cloneNode(!0).outerHTML, t.inlineBlockNeedsLayout = !1, t.shrinkWrapBlocks = !1, t.pixelPosition = !1, t.deleteExpando = !0, t.noCloneEvent = !0, t.reliableMarginRight = !0, t.boxSizingReliable = !0, o.checked = !0, t.noCloneChecked = o.cloneNode(!0).checked, s.disabled = !0, t.optDisabled = !u.disabled; try { delete d.test } catch (h) { t.deleteExpando = !1 } o = a.createElement("input"), o.setAttribute("value", ""), t.input = "" === o.getAttribute("value"), o.value = "t", o.setAttribute("type", "radio"), t.radioValue = "t" === o.value, o.setAttribute("checked", "t"), o.setAttribute("name", "t"), l = a.createDocumentFragment(), l.appendChild(o), t.appendChecked = o.checked, t.checkClone = l.cloneNode(!0).cloneNode(!0).lastChild.checked, d.attachEvent && (d.attachEvent("onclick", function () { t.noCloneEvent = !1 }), d.cloneNode(!0).click()); for (f in { submit: !0, change: !0, focusin: !0 }) d.setAttribute(c = "on" + f, "t"), t[f + "Bubbles"] = c in e || d.attributes[c].expando === !1; d.style.backgroundClip = "content-box", d.cloneNode(!0).style.backgroundClip = "", t.clearCloneStyle = "content-box" === d.style.backgroundClip; for (f in x(t)) break; return t.ownLast = "0" !== f, x(function () { var n, r, o, s = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;", l = a.getElementsByTagName("body")[0]; l && (n = a.createElement("div"), n.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px", l.appendChild(n).appendChild(d), d.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", o = d.getElementsByTagName("td"), o[0].style.cssText = "padding:0;margin:0;border:0;display:none", p = 0 === o[0].offsetHeight, o[0].style.display = "", o[1].style.display = "none", t.reliableHiddenOffsets = p && 0 === o[0].offsetHeight, d.innerHTML = "", d.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;", x.swap(l, null != l.style.zoom ? { zoom: 1 } : {}, function () { t.boxSizing = 4 === d.offsetWidth }), e.getComputedStyle && (t.pixelPosition = "1%" !== (e.getComputedStyle(d, null) || {}).top, t.boxSizingReliable = "4px" === (e.getComputedStyle(d, null) || { width: "4px" }).width, r = d.appendChild(a.createElement("div")), r.style.cssText = d.style.cssText = s, r.style.marginRight = r.style.width = "0", d.style.width = "1px", t.reliableMarginRight = !parseFloat((e.getComputedStyle(r, null) || {}).marginRight)), typeof d.style.zoom !== i && (d.innerHTML = "", d.style.cssText = s + "width:1px;padding:1px;display:inline;zoom:1", t.inlineBlockNeedsLayout = 3 === d.offsetWidth, d.style.display = "block", d.innerHTML = "<div></div>", d.firstChild.style.width = "5px", t.shrinkWrapBlocks = 3 !== d.offsetWidth, t.inlineBlockNeedsLayout && (l.style.zoom = 1)), l.removeChild(n), n = d = o = r = null) }), n = s = l = u = r = o = null, t
    }({}); var B = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/, P = /([A-Z])/g; function R(e, n, r, i) { if (x.acceptData(e)) { var o, a, s = x.expando, l = e.nodeType, u = l ? x.cache : e, c = l ? e[s] : e[s] && s; if (c && u[c] && (i || u[c].data) || r !== t || "string" != typeof n) return c || (c = l ? e[s] = p.pop() || x.guid++ : s), u[c] || (u[c] = l ? {} : { toJSON: x.noop }), ("object" == typeof n || "function" == typeof n) && (i ? u[c] = x.extend(u[c], n) : u[c].data = x.extend(u[c].data, n)), a = u[c], i || (a.data || (a.data = {}), a = a.data), r !== t && (a[x.camelCase(n)] = r), "string" == typeof n ? (o = a[n], null == o && (o = a[x.camelCase(n)])) : o = a, o } } function W(e, t, n) { if (x.acceptData(e)) { var r, i, o = e.nodeType, a = o ? x.cache : e, s = o ? e[x.expando] : x.expando; if (a[s]) { if (t && (r = n ? a[s] : a[s].data)) { x.isArray(t) ? t = t.concat(x.map(t, x.camelCase)) : t in r ? t = [t] : (t = x.camelCase(t), t = t in r ? [t] : t.split(" ")), i = t.length; while (i--) delete r[t[i]]; if (n ? !I(r) : !x.isEmptyObject(r)) return } (n || (delete a[s].data, I(a[s]))) && (o ? x.cleanData([e], !0) : x.support.deleteExpando || a != a.window ? delete a[s] : a[s] = null) } } } x.extend({ cache: {}, noData: { applet: !0, embed: !0, object: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" }, hasData: function (e) { return e = e.nodeType ? x.cache[e[x.expando]] : e[x.expando], !!e && !I(e) }, data: function (e, t, n) { return R(e, t, n) }, removeData: function (e, t) { return W(e, t) }, _data: function (e, t, n) { return R(e, t, n, !0) }, _removeData: function (e, t) { return W(e, t, !0) }, acceptData: function (e) { if (e.nodeType && 1 !== e.nodeType && 9 !== e.nodeType) return !1; var t = e.nodeName && x.noData[e.nodeName.toLowerCase()]; return !t || t !== !0 && e.getAttribute("classid") === t } }), x.fn.extend({ data: function (e, n) { var r, i, o = null, a = 0, s = this[0]; if (e === t) { if (this.length && (o = x.data(s), 1 === s.nodeType && !x._data(s, "parsedAttrs"))) { for (r = s.attributes; r.length > a; a++) i = r[a].name, 0 === i.indexOf("data-") && (i = x.camelCase(i.slice(5)), $(s, i, o[i])); x._data(s, "parsedAttrs", !0) } return o } return "object" == typeof e ? this.each(function () { x.data(this, e) }) : arguments.length > 1 ? this.each(function () { x.data(this, e, n) }) : s ? $(s, e, x.data(s, e)) : null }, removeData: function (e) { return this.each(function () { x.removeData(this, e) }) } }); function $(e, n, r) { if (r === t && 1 === e.nodeType) { var i = "data-" + n.replace(P, "-$1").toLowerCase(); if (r = e.getAttribute(i), "string" == typeof r) { try { r = "true" === r ? !0 : "false" === r ? !1 : "null" === r ? null : +r + "" === r ? +r : B.test(r) ? x.parseJSON(r) : r } catch (o) { } x.data(e, n, r) } else r = t } return r } function I(e) { var t; for (t in e) if (("data" !== t || !x.isEmptyObject(e[t])) && "toJSON" !== t) return !1; return !0 } x.extend({ queue: function (e, n, r) { var i; return e ? (n = (n || "fx") + "queue", i = x._data(e, n), r && (!i || x.isArray(r) ? i = x._data(e, n, x.makeArray(r)) : i.push(r)), i || []) : t }, dequeue: function (e, t) { t = t || "fx"; var n = x.queue(e, t), r = n.length, i = n.shift(), o = x._queueHooks(e, t), a = function () { x.dequeue(e, t) }; "inprogress" === i && (i = n.shift(), r--), i && ("fx" === t && n.unshift("inprogress"), delete o.stop, i.call(e, a, o)), !r && o && o.empty.fire() }, _queueHooks: function (e, t) { var n = t + "queueHooks"; return x._data(e, n) || x._data(e, n, { empty: x.Callbacks("once memory").add(function () { x._removeData(e, t + "queue"), x._removeData(e, n) }) }) } }), x.fn.extend({ queue: function (e, n) { var r = 2; return "string" != typeof e && (n = e, e = "fx", r--), r > arguments.length ? x.queue(this[0], e) : n === t ? this : this.each(function () { var t = x.queue(this, e, n); x._queueHooks(this, e), "fx" === e && "inprogress" !== t[0] && x.dequeue(this, e) }) }, dequeue: function (e) { return this.each(function () { x.dequeue(this, e) }) }, delay: function (e, t) { return e = x.fx ? x.fx.speeds[e] || e : e, t = t || "fx", this.queue(t, function (t, n) { var r = setTimeout(t, e); n.stop = function () { clearTimeout(r) } }) }, clearQueue: function (e) { return this.queue(e || "fx", []) }, promise: function (e, n) { var r, i = 1, o = x.Deferred(), a = this, s = this.length, l = function () { --i || o.resolveWith(a, [a]) }; "string" != typeof e && (n = e, e = t), e = e || "fx"; while (s--) r = x._data(a[s], e + "queueHooks"), r && r.empty && (i++, r.empty.add(l)); return l(), o.promise(n) } }); var z, X, U = /[\t\r\n\f]/g, V = /\r/g, Y = /^(?:input|select|textarea|button|object)$/i, J = /^(?:a|area)$/i, G = /^(?:checked|selected)$/i, Q = x.support.getSetAttribute, K = x.support.input; x.fn.extend({ attr: function (e, t) { return x.access(this, x.attr, e, t, arguments.length > 1) }, removeAttr: function (e) { return this.each(function () { x.removeAttr(this, e) }) }, prop: function (e, t) { return x.access(this, x.prop, e, t, arguments.length > 1) }, removeProp: function (e) { return e = x.propFix[e] || e, this.each(function () { try { this[e] = t, delete this[e] } catch (n) { } }) }, addClass: function (e) { var t, n, r, i, o, a = 0, s = this.length, l = "string" == typeof e && e; if (x.isFunction(e)) return this.each(function (t) { x(this).addClass(e.call(this, t, this.className)) }); if (l) for (t = (e || "").match(T) || []; s > a; a++) if (n = this[a], r = 1 === n.nodeType && (n.className ? (" " + n.className + " ").replace(U, " ") : " ")) { o = 0; while (i = t[o++]) 0 > r.indexOf(" " + i + " ") && (r += i + " "); n.className = x.trim(r) } return this }, removeClass: function (e) { var t, n, r, i, o, a = 0, s = this.length, l = 0 === arguments.length || "string" == typeof e && e; if (x.isFunction(e)) return this.each(function (t) { x(this).removeClass(e.call(this, t, this.className)) }); if (l) for (t = (e || "").match(T) || []; s > a; a++) if (n = this[a], r = 1 === n.nodeType && (n.className ? (" " + n.className + " ").replace(U, " ") : "")) { o = 0; while (i = t[o++]) while (r.indexOf(" " + i + " ") >= 0) r = r.replace(" " + i + " ", " "); n.className = e ? x.trim(r) : "" } return this }, toggleClass: function (e, t) { var n = typeof e; return "boolean" == typeof t && "string" === n ? t ? this.addClass(e) : this.removeClass(e) : x.isFunction(e) ? this.each(function (n) { x(this).toggleClass(e.call(this, n, this.className, t), t) }) : this.each(function () { if ("string" === n) { var t, r = 0, o = x(this), a = e.match(T) || []; while (t = a[r++]) o.hasClass(t) ? o.removeClass(t) : o.addClass(t) } else (n === i || "boolean" === n) && (this.className && x._data(this, "__className__", this.className), this.className = this.className || e === !1 ? "" : x._data(this, "__className__") || "") }) }, hasClass: function (e) { var t = " " + e + " ", n = 0, r = this.length; for (; r > n; n++) if (1 === this[n].nodeType && (" " + this[n].className + " ").replace(U, " ").indexOf(t) >= 0) return !0; return !1 }, val: function (e) { var n, r, i, o = this[0]; { if (arguments.length) return i = x.isFunction(e), this.each(function (n) { var o; 1 === this.nodeType && (o = i ? e.call(this, n, x(this).val()) : e, null == o ? o = "" : "number" == typeof o ? o += "" : x.isArray(o) && (o = x.map(o, function (e) { return null == e ? "" : e + "" })), r = x.valHooks[this.type] || x.valHooks[this.nodeName.toLowerCase()], r && "set" in r && r.set(this, o, "value") !== t || (this.value = o)) }); if (o) return r = x.valHooks[o.type] || x.valHooks[o.nodeName.toLowerCase()], r && "get" in r && (n = r.get(o, "value")) !== t ? n : (n = o.value, "string" == typeof n ? n.replace(V, "") : null == n ? "" : n) } } }), x.extend({ valHooks: { option: { get: function (e) { var t = x.find.attr(e, "value"); return null != t ? t : e.text } }, select: { get: function (e) { var t, n, r = e.options, i = e.selectedIndex, o = "select-one" === e.type || 0 > i, a = o ? null : [], s = o ? i + 1 : r.length, l = 0 > i ? s : o ? i : 0; for (; s > l; l++) if (n = r[l], !(!n.selected && l !== i || (x.support.optDisabled ? n.disabled : null !== n.getAttribute("disabled")) || n.parentNode.disabled && x.nodeName(n.parentNode, "optgroup"))) { if (t = x(n).val(), o) return t; a.push(t) } return a }, set: function (e, t) { var n, r, i = e.options, o = x.makeArray(t), a = i.length; while (a--) r = i[a], (r.selected = x.inArray(x(r).val(), o) >= 0) && (n = !0); return n || (e.selectedIndex = -1), o } } }, attr: function (e, n, r) { var o, a, s = e.nodeType; if (e && 3 !== s && 8 !== s && 2 !== s) return typeof e.getAttribute === i ? x.prop(e, n, r) : (1 === s && x.isXMLDoc(e) || (n = n.toLowerCase(), o = x.attrHooks[n] || (x.expr.match.bool.test(n) ? X : z)), r === t ? o && "get" in o && null !== (a = o.get(e, n)) ? a : (a = x.find.attr(e, n), null == a ? t : a) : null !== r ? o && "set" in o && (a = o.set(e, r, n)) !== t ? a : (e.setAttribute(n, r + ""), r) : (x.removeAttr(e, n), t)) }, removeAttr: function (e, t) { var n, r, i = 0, o = t && t.match(T); if (o && 1 === e.nodeType) while (n = o[i++]) r = x.propFix[n] || n, x.expr.match.bool.test(n) ? K && Q || !G.test(n) ? e[r] = !1 : e[x.camelCase("default-" + n)] = e[r] = !1 : x.attr(e, n, ""), e.removeAttribute(Q ? n : r) }, attrHooks: { type: { set: function (e, t) { if (!x.support.radioValue && "radio" === t && x.nodeName(e, "input")) { var n = e.value; return e.setAttribute("type", t), n && (e.value = n), t } } } }, propFix: { "for": "htmlFor", "class": "className" }, prop: function (e, n, r) { var i, o, a, s = e.nodeType; if (e && 3 !== s && 8 !== s && 2 !== s) return a = 1 !== s || !x.isXMLDoc(e), a && (n = x.propFix[n] || n, o = x.propHooks[n]), r !== t ? o && "set" in o && (i = o.set(e, r, n)) !== t ? i : e[n] = r : o && "get" in o && null !== (i = o.get(e, n)) ? i : e[n] }, propHooks: { tabIndex: { get: function (e) { var t = x.find.attr(e, "tabindex"); return t ? parseInt(t, 10) : Y.test(e.nodeName) || J.test(e.nodeName) && e.href ? 0 : -1 } } } }), X = { set: function (e, t, n) { return t === !1 ? x.removeAttr(e, n) : K && Q || !G.test(n) ? e.setAttribute(!Q && x.propFix[n] || n, n) : e[x.camelCase("default-" + n)] = e[n] = !0, n } }, x.each(x.expr.match.bool.source.match(/\w+/g), function (e, n) { var r = x.expr.attrHandle[n] || x.find.attr; x.expr.attrHandle[n] = K && Q || !G.test(n) ? function (e, n, i) { var o = x.expr.attrHandle[n], a = i ? t : (x.expr.attrHandle[n] = t) != r(e, n, i) ? n.toLowerCase() : null; return x.expr.attrHandle[n] = o, a } : function (e, n, r) { return r ? t : e[x.camelCase("default-" + n)] ? n.toLowerCase() : null } }), K && Q || (x.attrHooks.value = { set: function (e, n, r) { return x.nodeName(e, "input") ? (e.defaultValue = n, t) : z && z.set(e, n, r) } }), Q || (z = { set: function (e, n, r) { var i = e.getAttributeNode(r); return i || e.setAttributeNode(i = e.ownerDocument.createAttribute(r)), i.value = n += "", "value" === r || n === e.getAttribute(r) ? n : t } }, x.expr.attrHandle.id = x.expr.attrHandle.name = x.expr.attrHandle.coords = function (e, n, r) { var i; return r ? t : (i = e.getAttributeNode(n)) && "" !== i.value ? i.value : null }, x.valHooks.button = { get: function (e, n) { var r = e.getAttributeNode(n); return r && r.specified ? r.value : t }, set: z.set }, x.attrHooks.contenteditable = { set: function (e, t, n) { z.set(e, "" === t ? !1 : t, n) } }, x.each(["width", "height"], function (e, n) { x.attrHooks[n] = { set: function (e, r) { return "" === r ? (e.setAttribute(n, "auto"), r) : t } } })), x.support.hrefNormalized || x.each(["href", "src"], function (e, t) { x.propHooks[t] = { get: function (e) { return e.getAttribute(t, 4) } } }), x.support.style || (x.attrHooks.style = { get: function (e) { return e.style.cssText || t }, set: function (e, t) { return e.style.cssText = t + "" } }), x.support.optSelected || (x.propHooks.selected = { get: function (e) { var t = e.parentNode; return t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex), null } }), x.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function () { x.propFix[this.toLowerCase()] = this }), x.support.enctype || (x.propFix.enctype = "encoding"), x.each(["radio", "checkbox"], function () { x.valHooks[this] = { set: function (e, n) { return x.isArray(n) ? e.checked = x.inArray(x(e).val(), n) >= 0 : t } }, x.support.checkOn || (x.valHooks[this].get = function (e) { return null === e.getAttribute("value") ? "on" : e.value }) }); var Z = /^(?:input|select|textarea)$/i, et = /^key/, tt = /^(?:mouse|contextmenu)|click/, nt = /^(?:focusinfocus|focusoutblur)$/, rt = /^([^.]*)(?:\.(.+)|)$/; function it() { return !0 } function ot() { return !1 } function at() { try { return a.activeElement } catch (e) { } } x.event = { global: {}, add: function (e, n, r, o, a) { var s, l, u, c, p, f, d, h, g, m, y, v = x._data(e); if (v) { r.handler && (c = r, r = c.handler, a = c.selector), r.guid || (r.guid = x.guid++), (l = v.events) || (l = v.events = {}), (f = v.handle) || (f = v.handle = function (e) { return typeof x === i || e && x.event.triggered === e.type ? t : x.event.dispatch.apply(f.elem, arguments) }, f.elem = e), n = (n || "").match(T) || [""], u = n.length; while (u--) s = rt.exec(n[u]) || [], g = y = s[1], m = (s[2] || "").split(".").sort(), g && (p = x.event.special[g] || {}, g = (a ? p.delegateType : p.bindType) || g, p = x.event.special[g] || {}, d = x.extend({ type: g, origType: y, data: o, handler: r, guid: r.guid, selector: a, needsContext: a && x.expr.match.needsContext.test(a), namespace: m.join(".") }, c), (h = l[g]) || (h = l[g] = [], h.delegateCount = 0, p.setup && p.setup.call(e, o, m, f) !== !1 || (e.addEventListener ? e.addEventListener(g, f, !1) : e.attachEvent && e.attachEvent("on" + g, f))), p.add && (p.add.call(e, d), d.handler.guid || (d.handler.guid = r.guid)), a ? h.splice(h.delegateCount++, 0, d) : h.push(d), x.event.global[g] = !0); e = null } }, remove: function (e, t, n, r, i) { var o, a, s, l, u, c, p, f, d, h, g, m = x.hasData(e) && x._data(e); if (m && (c = m.events)) { t = (t || "").match(T) || [""], u = t.length; while (u--) if (s = rt.exec(t[u]) || [], d = g = s[1], h = (s[2] || "").split(".").sort(), d) { p = x.event.special[d] || {}, d = (r ? p.delegateType : p.bindType) || d, f = c[d] || [], s = s[2] && RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)"), l = o = f.length; while (o--) a = f[o], !i && g !== a.origType || n && n.guid !== a.guid || s && !s.test(a.namespace) || r && r !== a.selector && ("**" !== r || !a.selector) || (f.splice(o, 1), a.selector && f.delegateCount--, p.remove && p.remove.call(e, a)); l && !f.length && (p.teardown && p.teardown.call(e, h, m.handle) !== !1 || x.removeEvent(e, d, m.handle), delete c[d]) } else for (d in c) x.event.remove(e, d + t[u], n, r, !0); x.isEmptyObject(c) && (delete m.handle, x._removeData(e, "events")) } }, trigger: function (n, r, i, o) { var s, l, u, c, p, f, d, h = [i || a], g = v.call(n, "type") ? n.type : n, m = v.call(n, "namespace") ? n.namespace.split(".") : []; if (u = f = i = i || a, 3 !== i.nodeType && 8 !== i.nodeType && !nt.test(g + x.event.triggered) && (g.indexOf(".") >= 0 && (m = g.split("."), g = m.shift(), m.sort()), l = 0 > g.indexOf(":") && "on" + g, n = n[x.expando] ? n : new x.Event(g, "object" == typeof n && n), n.isTrigger = o ? 2 : 3, n.namespace = m.join("."), n.namespace_re = n.namespace ? RegExp("(^|\\.)" + m.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, n.result = t, n.target || (n.target = i), r = null == r ? [n] : x.makeArray(r, [n]), p = x.event.special[g] || {}, o || !p.trigger || p.trigger.apply(i, r) !== !1)) { if (!o && !p.noBubble && !x.isWindow(i)) { for (c = p.delegateType || g, nt.test(c + g) || (u = u.parentNode) ; u; u = u.parentNode) h.push(u), f = u; f === (i.ownerDocument || a) && h.push(f.defaultView || f.parentWindow || e) } d = 0; while ((u = h[d++]) && !n.isPropagationStopped()) n.type = d > 1 ? c : p.bindType || g, s = (x._data(u, "events") || {})[n.type] && x._data(u, "handle"), s && s.apply(u, r), s = l && u[l], s && x.acceptData(u) && s.apply && s.apply(u, r) === !1 && n.preventDefault(); if (n.type = g, !o && !n.isDefaultPrevented() && (!p._default || p._default.apply(h.pop(), r) === !1) && x.acceptData(i) && l && i[g] && !x.isWindow(i)) { f = i[l], f && (i[l] = null), x.event.triggered = g; try { i[g]() } catch (y) { } x.event.triggered = t, f && (i[l] = f) } return n.result } }, dispatch: function (e) { e = x.event.fix(e); var n, r, i, o, a, s = [], l = g.call(arguments), u = (x._data(this, "events") || {})[e.type] || [], c = x.event.special[e.type] || {}; if (l[0] = e, e.delegateTarget = this, !c.preDispatch || c.preDispatch.call(this, e) !== !1) { s = x.event.handlers.call(this, e, u), n = 0; while ((o = s[n++]) && !e.isPropagationStopped()) { e.currentTarget = o.elem, a = 0; while ((i = o.handlers[a++]) && !e.isImmediatePropagationStopped()) (!e.namespace_re || e.namespace_re.test(i.namespace)) && (e.handleObj = i, e.data = i.data, r = ((x.event.special[i.origType] || {}).handle || i.handler).apply(o.elem, l), r !== t && (e.result = r) === !1 && (e.preventDefault(), e.stopPropagation())) } return c.postDispatch && c.postDispatch.call(this, e), e.result } }, handlers: function (e, n) { var r, i, o, a, s = [], l = n.delegateCount, u = e.target; if (l && u.nodeType && (!e.button || "click" !== e.type)) for (; u != this; u = u.parentNode || this) if (1 === u.nodeType && (u.disabled !== !0 || "click" !== e.type)) { for (o = [], a = 0; l > a; a++) i = n[a], r = i.selector + " ", o[r] === t && (o[r] = i.needsContext ? x(r, this).index(u) >= 0 : x.find(r, this, null, [u]).length), o[r] && o.push(i); o.length && s.push({ elem: u, handlers: o }) } return n.length > l && s.push({ elem: this, handlers: n.slice(l) }), s }, fix: function (e) { if (e[x.expando]) return e; var t, n, r, i = e.type, o = e, s = this.fixHooks[i]; s || (this.fixHooks[i] = s = tt.test(i) ? this.mouseHooks : et.test(i) ? this.keyHooks : {}), r = s.props ? this.props.concat(s.props) : this.props, e = new x.Event(o), t = r.length; while (t--) n = r[t], e[n] = o[n]; return e.target || (e.target = o.srcElement || a), 3 === e.target.nodeType && (e.target = e.target.parentNode), e.metaKey = !!e.metaKey, s.filter ? s.filter(e, o) : e }, props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "), fixHooks: {}, keyHooks: { props: "char charCode key keyCode".split(" "), filter: function (e, t) { return null == e.which && (e.which = null != t.charCode ? t.charCode : t.keyCode), e } }, mouseHooks: { props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "), filter: function (e, n) { var r, i, o, s = n.button, l = n.fromElement; return null == e.pageX && null != n.clientX && (i = e.target.ownerDocument || a, o = i.documentElement, r = i.body, e.pageX = n.clientX + (o && o.scrollLeft || r && r.scrollLeft || 0) - (o && o.clientLeft || r && r.clientLeft || 0), e.pageY = n.clientY + (o && o.scrollTop || r && r.scrollTop || 0) - (o && o.clientTop || r && r.clientTop || 0)), !e.relatedTarget && l && (e.relatedTarget = l === e.target ? n.toElement : l), e.which || s === t || (e.which = 1 & s ? 1 : 2 & s ? 3 : 4 & s ? 2 : 0), e } }, special: { load: { noBubble: !0 }, focus: { trigger: function () { if (this !== at() && this.focus) try { return this.focus(), !1 } catch (e) { } }, delegateType: "focusin" }, blur: { trigger: function () { return this === at() && this.blur ? (this.blur(), !1) : t }, delegateType: "focusout" }, click: { trigger: function () { return x.nodeName(this, "input") && "checkbox" === this.type && this.click ? (this.click(), !1) : t }, _default: function (e) { return x.nodeName(e.target, "a") } }, beforeunload: { postDispatch: function (e) { e.result !== t && (e.originalEvent.returnValue = e.result) } } }, simulate: function (e, t, n, r) { var i = x.extend(new x.Event, n, { type: e, isSimulated: !0, originalEvent: {} }); r ? x.event.trigger(i, null, t) : x.event.dispatch.call(t, i), i.isDefaultPrevented() && n.preventDefault() } }, x.removeEvent = a.removeEventListener ? function (e, t, n) { e.removeEventListener && e.removeEventListener(t, n, !1) } : function (e, t, n) { var r = "on" + t; e.detachEvent && (typeof e[r] === i && (e[r] = null), e.detachEvent(r, n)) }, x.Event = function (e, n) { return this instanceof x.Event ? (e && e.type ? (this.originalEvent = e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented || e.returnValue === !1 || e.getPreventDefault && e.getPreventDefault() ? it : ot) : this.type = e, n && x.extend(this, n), this.timeStamp = e && e.timeStamp || x.now(), this[x.expando] = !0, t) : new x.Event(e, n) }, x.Event.prototype = { isDefaultPrevented: ot, isPropagationStopped: ot, isImmediatePropagationStopped: ot, preventDefault: function () { var e = this.originalEvent; this.isDefaultPrevented = it, e && (e.preventDefault ? e.preventDefault() : e.returnValue = !1) }, stopPropagation: function () { var e = this.originalEvent; this.isPropagationStopped = it, e && (e.stopPropagation && e.stopPropagation(), e.cancelBubble = !0) }, stopImmediatePropagation: function () { this.isImmediatePropagationStopped = it, this.stopPropagation() } }, x.each({ mouseenter: "mouseover", mouseleave: "mouseout" }, function (e, t) { x.event.special[e] = { delegateType: t, bindType: t, handle: function (e) { var n, r = this, i = e.relatedTarget, o = e.handleObj; return (!i || i !== r && !x.contains(r, i)) && (e.type = o.origType, n = o.handler.apply(this, arguments), e.type = t), n } } }), x.support.submitBubbles || (x.event.special.submit = { setup: function () { return x.nodeName(this, "form") ? !1 : (x.event.add(this, "click._submit keypress._submit", function (e) { var n = e.target, r = x.nodeName(n, "input") || x.nodeName(n, "button") ? n.form : t; r && !x._data(r, "submitBubbles") && (x.event.add(r, "submit._submit", function (e) { e._submit_bubble = !0 }), x._data(r, "submitBubbles", !0)) }), t) }, postDispatch: function (e) { e._submit_bubble && (delete e._submit_bubble, this.parentNode && !e.isTrigger && x.event.simulate("submit", this.parentNode, e, !0)) }, teardown: function () { return x.nodeName(this, "form") ? !1 : (x.event.remove(this, "._submit"), t) } }), x.support.changeBubbles || (x.event.special.change = { setup: function () { return Z.test(this.nodeName) ? (("checkbox" === this.type || "radio" === this.type) && (x.event.add(this, "propertychange._change", function (e) { "checked" === e.originalEvent.propertyName && (this._just_changed = !0) }), x.event.add(this, "click._change", function (e) { this._just_changed && !e.isTrigger && (this._just_changed = !1), x.event.simulate("change", this, e, !0) })), !1) : (x.event.add(this, "beforeactivate._change", function (e) { var t = e.target; Z.test(t.nodeName) && !x._data(t, "changeBubbles") && (x.event.add(t, "change._change", function (e) { !this.parentNode || e.isSimulated || e.isTrigger || x.event.simulate("change", this.parentNode, e, !0) }), x._data(t, "changeBubbles", !0)) }), t) }, handle: function (e) { var n = e.target; return this !== n || e.isSimulated || e.isTrigger || "radio" !== n.type && "checkbox" !== n.type ? e.handleObj.handler.apply(this, arguments) : t }, teardown: function () { return x.event.remove(this, "._change"), !Z.test(this.nodeName) } }), x.support.focusinBubbles || x.each({ focus: "focusin", blur: "focusout" }, function (e, t) { var n = 0, r = function (e) { x.event.simulate(t, e.target, x.event.fix(e), !0) }; x.event.special[t] = { setup: function () { 0 === n++ && a.addEventListener(e, r, !0) }, teardown: function () { 0 === --n && a.removeEventListener(e, r, !0) } } }), x.fn.extend({ on: function (e, n, r, i, o) { var a, s; if ("object" == typeof e) { "string" != typeof n && (r = r || n, n = t); for (a in e) this.on(a, n, r, e[a], o); return this } if (null == r && null == i ? (i = n, r = n = t) : null == i && ("string" == typeof n ? (i = r, r = t) : (i = r, r = n, n = t)), i === !1) i = ot; else if (!i) return this; return 1 === o && (s = i, i = function (e) { return x().off(e), s.apply(this, arguments) }, i.guid = s.guid || (s.guid = x.guid++)), this.each(function () { x.event.add(this, e, i, r, n) }) }, one: function (e, t, n, r) { return this.on(e, t, n, r, 1) }, off: function (e, n, r) { var i, o; if (e && e.preventDefault && e.handleObj) return i = e.handleObj, x(e.delegateTarget).off(i.namespace ? i.origType + "." + i.namespace : i.origType, i.selector, i.handler), this; if ("object" == typeof e) { for (o in e) this.off(o, n, e[o]); return this } return (n === !1 || "function" == typeof n) && (r = n, n = t), r === !1 && (r = ot), this.each(function () { x.event.remove(this, e, r, n) }) }, trigger: function (e, t) { return this.each(function () { x.event.trigger(e, t, this) }) }, triggerHandler: function (e, n) { var r = this[0]; return r ? x.event.trigger(e, n, r, !0) : t } }); var st = /^.[^:#\[\.,]*$/, lt = /^(?:parents|prev(?:Until|All))/, ut = x.expr.match.needsContext, ct = { children: !0, contents: !0, next: !0, prev: !0 }; x.fn.extend({ find: function (e) { var t, n = [], r = this, i = r.length; if ("string" != typeof e) return this.pushStack(x(e).filter(function () { for (t = 0; i > t; t++) if (x.contains(r[t], this)) return !0 })); for (t = 0; i > t; t++) x.find(e, r[t], n); return n = this.pushStack(i > 1 ? x.unique(n) : n), n.selector = this.selector ? this.selector + " " + e : e, n }, has: function (e) { var t, n = x(e, this), r = n.length; return this.filter(function () { for (t = 0; r > t; t++) if (x.contains(this, n[t])) return !0 }) }, not: function (e) { return this.pushStack(ft(this, e || [], !0)) }, filter: function (e) { return this.pushStack(ft(this, e || [], !1)) }, is: function (e) { return !!ft(this, "string" == typeof e && ut.test(e) ? x(e) : e || [], !1).length }, closest: function (e, t) { var n, r = 0, i = this.length, o = [], a = ut.test(e) || "string" != typeof e ? x(e, t || this.context) : 0; for (; i > r; r++) for (n = this[r]; n && n !== t; n = n.parentNode) if (11 > n.nodeType && (a ? a.index(n) > -1 : 1 === n.nodeType && x.find.matchesSelector(n, e))) { n = o.push(n); break } return this.pushStack(o.length > 1 ? x.unique(o) : o) }, index: function (e) { return e ? "string" == typeof e ? x.inArray(this[0], x(e)) : x.inArray(e.jquery ? e[0] : e, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1 }, add: function (e, t) { var n = "string" == typeof e ? x(e, t) : x.makeArray(e && e.nodeType ? [e] : e), r = x.merge(this.get(), n); return this.pushStack(x.unique(r)) }, addBack: function (e) { return this.add(null == e ? this.prevObject : this.prevObject.filter(e)) } }); function pt(e, t) { do e = e[t]; while (e && 1 !== e.nodeType); return e } x.each({ parent: function (e) { var t = e.parentNode; return t && 11 !== t.nodeType ? t : null }, parents: function (e) { return x.dir(e, "parentNode") }, parentsUntil: function (e, t, n) { return x.dir(e, "parentNode", n) }, next: function (e) { return pt(e, "nextSibling") }, prev: function (e) { return pt(e, "previousSibling") }, nextAll: function (e) { return x.dir(e, "nextSibling") }, prevAll: function (e) { return x.dir(e, "previousSibling") }, nextUntil: function (e, t, n) { return x.dir(e, "nextSibling", n) }, prevUntil: function (e, t, n) { return x.dir(e, "previousSibling", n) }, siblings: function (e) { return x.sibling((e.parentNode || {}).firstChild, e) }, children: function (e) { return x.sibling(e.firstChild) }, contents: function (e) { return x.nodeName(e, "iframe") ? e.contentDocument || e.contentWindow.document : x.merge([], e.childNodes) } }, function (e, t) { x.fn[e] = function (n, r) { var i = x.map(this, t, n); return "Until" !== e.slice(-5) && (r = n), r && "string" == typeof r && (i = x.filter(r, i)), this.length > 1 && (ct[e] || (i = x.unique(i)), lt.test(e) && (i = i.reverse())), this.pushStack(i) } }), x.extend({ filter: function (e, t, n) { var r = t[0]; return n && (e = ":not(" + e + ")"), 1 === t.length && 1 === r.nodeType ? x.find.matchesSelector(r, e) ? [r] : [] : x.find.matches(e, x.grep(t, function (e) { return 1 === e.nodeType })) }, dir: function (e, n, r) { var i = [], o = e[n]; while (o && 9 !== o.nodeType && (r === t || 1 !== o.nodeType || !x(o).is(r))) 1 === o.nodeType && i.push(o), o = o[n]; return i }, sibling: function (e, t) { var n = []; for (; e; e = e.nextSibling) 1 === e.nodeType && e !== t && n.push(e); return n } }); function ft(e, t, n) { if (x.isFunction(t)) return x.grep(e, function (e, r) { return !!t.call(e, r, e) !== n }); if (t.nodeType) return x.grep(e, function (e) { return e === t !== n }); if ("string" == typeof t) { if (st.test(t)) return x.filter(t, e, n); t = x.filter(t, e) } return x.grep(e, function (e) { return x.inArray(e, t) >= 0 !== n }) } function dt(e) { var t = ht.split("|"), n = e.createDocumentFragment(); if (n.createElement) while (t.length) n.createElement(t.pop()); return n } var ht = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video", gt = / jQuery\d+="(?:null|\d+)"/g, mt = RegExp("<(?:" + ht + ")[\\s/>]", "i"), yt = /^\s+/, vt = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, bt = /<([\w:]+)/, xt = /<tbody/i, wt = /<|&#?\w+;/, Tt = /<(?:script|style|link)/i, Ct = /^(?:checkbox|radio)$/i, Nt = /checked\s*(?:[^=]|=\s*.checked.)/i, kt = /^$|\/(?:java|ecma)script/i, Et = /^true\/(.*)/, St = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g, At = { option: [1, "<select multiple='multiple'>", "</select>"], legend: [1, "<fieldset>", "</fieldset>"], area: [1, "<map>", "</map>"], param: [1, "<object>", "</object>"], thead: [1, "<table>", "</table>"], tr: [2, "<table><tbody>", "</tbody></table>"], col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"], td: [3, "<table><tbody><tr>", "</tr></tbody></table>"], _default: x.support.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"] }, jt = dt(a), Dt = jt.appendChild(a.createElement("div")); At.optgroup = At.option, At.tbody = At.tfoot = At.colgroup = At.caption = At.thead, At.th = At.td, x.fn.extend({ text: function (e) { return x.access(this, function (e) { return e === t ? x.text(this) : this.empty().append((this[0] && this[0].ownerDocument || a).createTextNode(e)) }, null, e, arguments.length) }, append: function () { return this.domManip(arguments, function (e) { if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) { var t = Lt(this, e); t.appendChild(e) } }) }, prepend: function () { return this.domManip(arguments, function (e) { if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) { var t = Lt(this, e); t.insertBefore(e, t.firstChild) } }) }, before: function () { return this.domManip(arguments, function (e) { this.parentNode && this.parentNode.insertBefore(e, this) }) }, after: function () { return this.domManip(arguments, function (e) { this.parentNode && this.parentNode.insertBefore(e, this.nextSibling) }) }, remove: function (e, t) { var n, r = e ? x.filter(e, this) : this, i = 0; for (; null != (n = r[i]) ; i++) t || 1 !== n.nodeType || x.cleanData(Ft(n)), n.parentNode && (t && x.contains(n.ownerDocument, n) && _t(Ft(n, "script")), n.parentNode.removeChild(n)); return this }, empty: function () { var e, t = 0; for (; null != (e = this[t]) ; t++) { 1 === e.nodeType && x.cleanData(Ft(e, !1)); while (e.firstChild) e.removeChild(e.firstChild); e.options && x.nodeName(e, "select") && (e.options.length = 0) } return this }, clone: function (e, t) { return e = null == e ? !1 : e, t = null == t ? e : t, this.map(function () { return x.clone(this, e, t) }) }, html: function (e) { return x.access(this, function (e) { var n = this[0] || {}, r = 0, i = this.length; if (e === t) return 1 === n.nodeType ? n.innerHTML.replace(gt, "") : t; if (!("string" != typeof e || Tt.test(e) || !x.support.htmlSerialize && mt.test(e) || !x.support.leadingWhitespace && yt.test(e) || At[(bt.exec(e) || ["", ""])[1].toLowerCase()])) { e = e.replace(vt, "<$1></$2>"); try { for (; i > r; r++) n = this[r] || {}, 1 === n.nodeType && (x.cleanData(Ft(n, !1)), n.innerHTML = e); n = 0 } catch (o) { } } n && this.empty().append(e) }, null, e, arguments.length) }, replaceWith: function () { var e = x.map(this, function (e) { return [e.nextSibling, e.parentNode] }), t = 0; return this.domManip(arguments, function (n) { var r = e[t++], i = e[t++]; i && (r && r.parentNode !== i && (r = this.nextSibling), x(this).remove(), i.insertBefore(n, r)) }, !0), t ? this : this.remove() }, detach: function (e) { return this.remove(e, !0) }, domManip: function (e, t, n) { e = d.apply([], e); var r, i, o, a, s, l, u = 0, c = this.length, p = this, f = c - 1, h = e[0], g = x.isFunction(h); if (g || !(1 >= c || "string" != typeof h || x.support.checkClone) && Nt.test(h)) return this.each(function (r) { var i = p.eq(r); g && (e[0] = h.call(this, r, i.html())), i.domManip(e, t, n) }); if (c && (l = x.buildFragment(e, this[0].ownerDocument, !1, !n && this), r = l.firstChild, 1 === l.childNodes.length && (l = r), r)) { for (a = x.map(Ft(l, "script"), Ht), o = a.length; c > u; u++) i = l, u !== f && (i = x.clone(i, !0, !0), o && x.merge(a, Ft(i, "script"))), t.call(this[u], i, u); if (o) for (s = a[a.length - 1].ownerDocument, x.map(a, qt), u = 0; o > u; u++) i = a[u], kt.test(i.type || "") && !x._data(i, "globalEval") && x.contains(s, i) && (i.src ? x._evalUrl(i.src) : x.globalEval((i.text || i.textContent || i.innerHTML || "").replace(St, ""))); l = r = null } return this } }); function Lt(e, t) { return x.nodeName(e, "table") && x.nodeName(1 === t.nodeType ? t : t.firstChild, "tr") ? e.getElementsByTagName("tbody")[0] || e.appendChild(e.ownerDocument.createElement("tbody")) : e } function Ht(e) { return e.type = (null !== x.find.attr(e, "type")) + "/" + e.type, e } function qt(e) { var t = Et.exec(e.type); return t ? e.type = t[1] : e.removeAttribute("type"), e } function _t(e, t) { var n, r = 0; for (; null != (n = e[r]) ; r++) x._data(n, "globalEval", !t || x._data(t[r], "globalEval")) } function Mt(e, t) { if (1 === t.nodeType && x.hasData(e)) { var n, r, i, o = x._data(e), a = x._data(t, o), s = o.events; if (s) { delete a.handle, a.events = {}; for (n in s) for (r = 0, i = s[n].length; i > r; r++) x.event.add(t, n, s[n][r]) } a.data && (a.data = x.extend({}, a.data)) } } function Ot(e, t) { var n, r, i; if (1 === t.nodeType) { if (n = t.nodeName.toLowerCase(), !x.support.noCloneEvent && t[x.expando]) { i = x._data(t); for (r in i.events) x.removeEvent(t, r, i.handle); t.removeAttribute(x.expando) } "script" === n && t.text !== e.text ? (Ht(t).text = e.text, qt(t)) : "object" === n ? (t.parentNode && (t.outerHTML = e.outerHTML), x.support.html5Clone && e.innerHTML && !x.trim(t.innerHTML) && (t.innerHTML = e.innerHTML)) : "input" === n && Ct.test(e.type) ? (t.defaultChecked = t.checked = e.checked, t.value !== e.value && (t.value = e.value)) : "option" === n ? t.defaultSelected = t.selected = e.defaultSelected : ("input" === n || "textarea" === n) && (t.defaultValue = e.defaultValue) } } x.each({ appendTo: "append", prependTo: "prepend", insertBefore: "before", insertAfter: "after", replaceAll: "replaceWith" }, function (e, t) { x.fn[e] = function (e) { var n, r = 0, i = [], o = x(e), a = o.length - 1; for (; a >= r; r++) n = r === a ? this : this.clone(!0), x(o[r])[t](n), h.apply(i, n.get()); return this.pushStack(i) } }); function Ft(e, n) { var r, o, a = 0, s = typeof e.getElementsByTagName !== i ? e.getElementsByTagName(n || "*") : typeof e.querySelectorAll !== i ? e.querySelectorAll(n || "*") : t; if (!s) for (s = [], r = e.childNodes || e; null != (o = r[a]) ; a++) !n || x.nodeName(o, n) ? s.push(o) : x.merge(s, Ft(o, n)); return n === t || n && x.nodeName(e, n) ? x.merge([e], s) : s } function Bt(e) { Ct.test(e.type) && (e.defaultChecked = e.checked) } x.extend({
        clone: function (e, t, n) { var r, i, o, a, s, l = x.contains(e.ownerDocument, e); if (x.support.html5Clone || x.isXMLDoc(e) || !mt.test("<" + e.nodeName + ">") ? o = e.cloneNode(!0) : (Dt.innerHTML = e.outerHTML, Dt.removeChild(o = Dt.firstChild)), !(x.support.noCloneEvent && x.support.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || x.isXMLDoc(e))) for (r = Ft(o), s = Ft(e), a = 0; null != (i = s[a]) ; ++a) r[a] && Ot(i, r[a]); if (t) if (n) for (s = s || Ft(e), r = r || Ft(o), a = 0; null != (i = s[a]) ; a++) Mt(i, r[a]); else Mt(e, o); return r = Ft(o, "script"), r.length > 0 && _t(r, !l && Ft(e, "script")), r = s = i = null, o }, buildFragment: function (e, t, n, r) { var i, o, a, s, l, u, c, p = e.length, f = dt(t), d = [], h = 0; for (; p > h; h++) if (o = e[h], o || 0 === o) if ("object" === x.type(o)) x.merge(d, o.nodeType ? [o] : o); else if (wt.test(o)) { s = s || f.appendChild(t.createElement("div")), l = (bt.exec(o) || ["", ""])[1].toLowerCase(), c = At[l] || At._default, s.innerHTML = c[1] + o.replace(vt, "<$1></$2>") + c[2], i = c[0]; while (i--) s = s.lastChild; if (!x.support.leadingWhitespace && yt.test(o) && d.push(t.createTextNode(yt.exec(o)[0])), !x.support.tbody) { o = "table" !== l || xt.test(o) ? "<table>" !== c[1] || xt.test(o) ? 0 : s : s.firstChild, i = o && o.childNodes.length; while (i--) x.nodeName(u = o.childNodes[i], "tbody") && !u.childNodes.length && o.removeChild(u) } x.merge(d, s.childNodes), s.textContent = ""; while (s.firstChild) s.removeChild(s.firstChild); s = f.lastChild } else d.push(t.createTextNode(o)); s && f.removeChild(s), x.support.appendChecked || x.grep(Ft(d, "input"), Bt), h = 0; while (o = d[h++]) if ((!r || -1 === x.inArray(o, r)) && (a = x.contains(o.ownerDocument, o), s = Ft(f.appendChild(o), "script"), a && _t(s), n)) { i = 0; while (o = s[i++]) kt.test(o.type || "") && n.push(o) } return s = null, f }, cleanData: function (e, t) {
            var n, r, o, a, s = 0, l = x.expando, u = x.cache, c = x.support.deleteExpando, f = x.event.special; for (; null != (n = e[s]) ; s++) if ((t || x.acceptData(n)) && (o = n[l], a = o && u[o])) {
                if (a.events) for (r in a.events) f[r] ? x.event.remove(n, r) : x.removeEvent(n, r, a.handle);
                u[o] && (delete u[o], c ? delete n[l] : typeof n.removeAttribute !== i ? n.removeAttribute(l) : n[l] = null, p.push(o))
            }
        }, _evalUrl: function (e) { return x.ajax({ url: e, type: "GET", dataType: "script", async: !1, global: !1, "throws": !0 }) }
    }), x.fn.extend({ wrapAll: function (e) { if (x.isFunction(e)) return this.each(function (t) { x(this).wrapAll(e.call(this, t)) }); if (this[0]) { var t = x(e, this[0].ownerDocument).eq(0).clone(!0); this[0].parentNode && t.insertBefore(this[0]), t.map(function () { var e = this; while (e.firstChild && 1 === e.firstChild.nodeType) e = e.firstChild; return e }).append(this) } return this }, wrapInner: function (e) { return x.isFunction(e) ? this.each(function (t) { x(this).wrapInner(e.call(this, t)) }) : this.each(function () { var t = x(this), n = t.contents(); n.length ? n.wrapAll(e) : t.append(e) }) }, wrap: function (e) { var t = x.isFunction(e); return this.each(function (n) { x(this).wrapAll(t ? e.call(this, n) : e) }) }, unwrap: function () { return this.parent().each(function () { x.nodeName(this, "body") || x(this).replaceWith(this.childNodes) }).end() } }); var Pt, Rt, Wt, $t = /alpha\([^)]*\)/i, It = /opacity\s*=\s*([^)]*)/, zt = /^(top|right|bottom|left)$/, Xt = /^(none|table(?!-c[ea]).+)/, Ut = /^margin/, Vt = RegExp("^(" + w + ")(.*)$", "i"), Yt = RegExp("^(" + w + ")(?!px)[a-z%]+$", "i"), Jt = RegExp("^([+-])=(" + w + ")", "i"), Gt = { BODY: "block" }, Qt = { position: "absolute", visibility: "hidden", display: "block" }, Kt = { letterSpacing: 0, fontWeight: 400 }, Zt = ["Top", "Right", "Bottom", "Left"], en = ["Webkit", "O", "Moz", "ms"]; function tn(e, t) { if (t in e) return t; var n = t.charAt(0).toUpperCase() + t.slice(1), r = t, i = en.length; while (i--) if (t = en[i] + n, t in e) return t; return r } function nn(e, t) { return e = t || e, "none" === x.css(e, "display") || !x.contains(e.ownerDocument, e) } function rn(e, t) { var n, r, i, o = [], a = 0, s = e.length; for (; s > a; a++) r = e[a], r.style && (o[a] = x._data(r, "olddisplay"), n = r.style.display, t ? (o[a] || "none" !== n || (r.style.display = ""), "" === r.style.display && nn(r) && (o[a] = x._data(r, "olddisplay", ln(r.nodeName)))) : o[a] || (i = nn(r), (n && "none" !== n || !i) && x._data(r, "olddisplay", i ? n : x.css(r, "display")))); for (a = 0; s > a; a++) r = e[a], r.style && (t && "none" !== r.style.display && "" !== r.style.display || (r.style.display = t ? o[a] || "" : "none")); return e } x.fn.extend({ css: function (e, n) { return x.access(this, function (e, n, r) { var i, o, a = {}, s = 0; if (x.isArray(n)) { for (o = Rt(e), i = n.length; i > s; s++) a[n[s]] = x.css(e, n[s], !1, o); return a } return r !== t ? x.style(e, n, r) : x.css(e, n) }, e, n, arguments.length > 1) }, show: function () { return rn(this, !0) }, hide: function () { return rn(this) }, toggle: function (e) { return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each(function () { nn(this) ? x(this).show() : x(this).hide() }) } }), x.extend({ cssHooks: { opacity: { get: function (e, t) { if (t) { var n = Wt(e, "opacity"); return "" === n ? "1" : n } } } }, cssNumber: { columnCount: !0, fillOpacity: !0, fontWeight: !0, lineHeight: !0, opacity: !0, order: !0, orphans: !0, widows: !0, zIndex: !0, zoom: !0 }, cssProps: { "float": x.support.cssFloat ? "cssFloat" : "styleFloat" }, style: function (e, n, r, i) { if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) { var o, a, s, l = x.camelCase(n), u = e.style; if (n = x.cssProps[l] || (x.cssProps[l] = tn(u, l)), s = x.cssHooks[n] || x.cssHooks[l], r === t) return s && "get" in s && (o = s.get(e, !1, i)) !== t ? o : u[n]; if (a = typeof r, "string" === a && (o = Jt.exec(r)) && (r = (o[1] + 1) * o[2] + parseFloat(x.css(e, n)), a = "number"), !(null == r || "number" === a && isNaN(r) || ("number" !== a || x.cssNumber[l] || (r += "px"), x.support.clearCloneStyle || "" !== r || 0 !== n.indexOf("background") || (u[n] = "inherit"), s && "set" in s && (r = s.set(e, r, i)) === t))) try { u[n] = r } catch (c) { } } }, css: function (e, n, r, i) { var o, a, s, l = x.camelCase(n); return n = x.cssProps[l] || (x.cssProps[l] = tn(e.style, l)), s = x.cssHooks[n] || x.cssHooks[l], s && "get" in s && (a = s.get(e, !0, r)), a === t && (a = Wt(e, n, i)), "normal" === a && n in Kt && (a = Kt[n]), "" === r || r ? (o = parseFloat(a), r === !0 || x.isNumeric(o) ? o || 0 : a) : a } }), e.getComputedStyle ? (Rt = function (t) { return e.getComputedStyle(t, null) }, Wt = function (e, n, r) { var i, o, a, s = r || Rt(e), l = s ? s.getPropertyValue(n) || s[n] : t, u = e.style; return s && ("" !== l || x.contains(e.ownerDocument, e) || (l = x.style(e, n)), Yt.test(l) && Ut.test(n) && (i = u.width, o = u.minWidth, a = u.maxWidth, u.minWidth = u.maxWidth = u.width = l, l = s.width, u.width = i, u.minWidth = o, u.maxWidth = a)), l }) : a.documentElement.currentStyle && (Rt = function (e) { return e.currentStyle }, Wt = function (e, n, r) { var i, o, a, s = r || Rt(e), l = s ? s[n] : t, u = e.style; return null == l && u && u[n] && (l = u[n]), Yt.test(l) && !zt.test(n) && (i = u.left, o = e.runtimeStyle, a = o && o.left, a && (o.left = e.currentStyle.left), u.left = "fontSize" === n ? "1em" : l, l = u.pixelLeft + "px", u.left = i, a && (o.left = a)), "" === l ? "auto" : l }); function on(e, t, n) { var r = Vt.exec(t); return r ? Math.max(0, r[1] - (n || 0)) + (r[2] || "px") : t } function an(e, t, n, r, i) { var o = n === (r ? "border" : "content") ? 4 : "width" === t ? 1 : 0, a = 0; for (; 4 > o; o += 2) "margin" === n && (a += x.css(e, n + Zt[o], !0, i)), r ? ("content" === n && (a -= x.css(e, "padding" + Zt[o], !0, i)), "margin" !== n && (a -= x.css(e, "border" + Zt[o] + "Width", !0, i))) : (a += x.css(e, "padding" + Zt[o], !0, i), "padding" !== n && (a += x.css(e, "border" + Zt[o] + "Width", !0, i))); return a } function sn(e, t, n) { var r = !0, i = "width" === t ? e.offsetWidth : e.offsetHeight, o = Rt(e), a = x.support.boxSizing && "border-box" === x.css(e, "boxSizing", !1, o); if (0 >= i || null == i) { if (i = Wt(e, t, o), (0 > i || null == i) && (i = e.style[t]), Yt.test(i)) return i; r = a && (x.support.boxSizingReliable || i === e.style[t]), i = parseFloat(i) || 0 } return i + an(e, t, n || (a ? "border" : "content"), r, o) + "px" } function ln(e) { var t = a, n = Gt[e]; return n || (n = un(e, t), "none" !== n && n || (Pt = (Pt || x("<iframe frameborder='0' width='0' height='0'/>").css("cssText", "display:block !important")).appendTo(t.documentElement), t = (Pt[0].contentWindow || Pt[0].contentDocument).document, t.write("<!doctype html><html><body>"), t.close(), n = un(e, t), Pt.detach()), Gt[e] = n), n } function un(e, t) { var n = x(t.createElement(e)).appendTo(t.body), r = x.css(n[0], "display"); return n.remove(), r } x.each(["height", "width"], function (e, n) { x.cssHooks[n] = { get: function (e, r, i) { return r ? 0 === e.offsetWidth && Xt.test(x.css(e, "display")) ? x.swap(e, Qt, function () { return sn(e, n, i) }) : sn(e, n, i) : t }, set: function (e, t, r) { var i = r && Rt(e); return on(e, t, r ? an(e, n, r, x.support.boxSizing && "border-box" === x.css(e, "boxSizing", !1, i), i) : 0) } } }), x.support.opacity || (x.cssHooks.opacity = { get: function (e, t) { return It.test((t && e.currentStyle ? e.currentStyle.filter : e.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : t ? "1" : "" }, set: function (e, t) { var n = e.style, r = e.currentStyle, i = x.isNumeric(t) ? "alpha(opacity=" + 100 * t + ")" : "", o = r && r.filter || n.filter || ""; n.zoom = 1, (t >= 1 || "" === t) && "" === x.trim(o.replace($t, "")) && n.removeAttribute && (n.removeAttribute("filter"), "" === t || r && !r.filter) || (n.filter = $t.test(o) ? o.replace($t, i) : o + " " + i) } }), x(function () { x.support.reliableMarginRight || (x.cssHooks.marginRight = { get: function (e, n) { return n ? x.swap(e, { display: "inline-block" }, Wt, [e, "marginRight"]) : t } }), !x.support.pixelPosition && x.fn.position && x.each(["top", "left"], function (e, n) { x.cssHooks[n] = { get: function (e, r) { return r ? (r = Wt(e, n), Yt.test(r) ? x(e).position()[n] + "px" : r) : t } } }) }), x.expr && x.expr.filters && (x.expr.filters.hidden = function (e) { return 0 >= e.offsetWidth && 0 >= e.offsetHeight || !x.support.reliableHiddenOffsets && "none" === (e.style && e.style.display || x.css(e, "display")) }, x.expr.filters.visible = function (e) { return !x.expr.filters.hidden(e) }), x.each({ margin: "", padding: "", border: "Width" }, function (e, t) { x.cssHooks[e + t] = { expand: function (n) { var r = 0, i = {}, o = "string" == typeof n ? n.split(" ") : [n]; for (; 4 > r; r++) i[e + Zt[r] + t] = o[r] || o[r - 2] || o[0]; return i } }, Ut.test(e) || (x.cssHooks[e + t].set = on) }); var cn = /%20/g, pn = /\[\]$/, fn = /\r?\n/g, dn = /^(?:submit|button|image|reset|file)$/i, hn = /^(?:input|select|textarea|keygen)/i; x.fn.extend({ serialize: function () { return x.param(this.serializeArray()) }, serializeArray: function () { return this.map(function () { var e = x.prop(this, "elements"); return e ? x.makeArray(e) : this }).filter(function () { var e = this.type; return this.name && !x(this).is(":disabled") && hn.test(this.nodeName) && !dn.test(e) && (this.checked || !Ct.test(e)) }).map(function (e, t) { var n = x(this).val(); return null == n ? null : x.isArray(n) ? x.map(n, function (e) { return { name: t.name, value: e.replace(fn, "\r\n") } }) : { name: t.name, value: n.replace(fn, "\r\n") } }).get() } }), x.param = function (e, n) { var r, i = [], o = function (e, t) { t = x.isFunction(t) ? t() : null == t ? "" : t, i[i.length] = encodeURIComponent(e) + "=" + encodeURIComponent(t) }; if (n === t && (n = x.ajaxSettings && x.ajaxSettings.traditional), x.isArray(e) || e.jquery && !x.isPlainObject(e)) x.each(e, function () { o(this.name, this.value) }); else for (r in e) gn(r, e[r], n, o); return i.join("&").replace(cn, "+") }; function gn(e, t, n, r) { var i; if (x.isArray(t)) x.each(t, function (t, i) { n || pn.test(e) ? r(e, i) : gn(e + "[" + ("object" == typeof i ? t : "") + "]", i, n, r) }); else if (n || "object" !== x.type(t)) r(e, t); else for (i in t) gn(e + "[" + i + "]", t[i], n, r) } x.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function (e, t) { x.fn[t] = function (e, n) { return arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t) } }), x.fn.extend({ hover: function (e, t) { return this.mouseenter(e).mouseleave(t || e) }, bind: function (e, t, n) { return this.on(e, null, t, n) }, unbind: function (e, t) { return this.off(e, null, t) }, delegate: function (e, t, n, r) { return this.on(t, e, n, r) }, undelegate: function (e, t, n) { return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n) } }); var mn, yn, vn = x.now(), bn = /\?/, xn = /#.*$/, wn = /([?&])_=[^&]*/, Tn = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm, Cn = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, Nn = /^(?:GET|HEAD)$/, kn = /^\/\//, En = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/, Sn = x.fn.load, An = {}, jn = {}, Dn = "*/".concat("*"); try { yn = o.href } catch (Ln) { yn = a.createElement("a"), yn.href = "", yn = yn.href } mn = En.exec(yn.toLowerCase()) || []; function Hn(e) { return function (t, n) { "string" != typeof t && (n = t, t = "*"); var r, i = 0, o = t.toLowerCase().match(T) || []; if (x.isFunction(n)) while (r = o[i++]) "+" === r[0] ? (r = r.slice(1) || "*", (e[r] = e[r] || []).unshift(n)) : (e[r] = e[r] || []).push(n) } } function qn(e, n, r, i) { var o = {}, a = e === jn; function s(l) { var u; return o[l] = !0, x.each(e[l] || [], function (e, l) { var c = l(n, r, i); return "string" != typeof c || a || o[c] ? a ? !(u = c) : t : (n.dataTypes.unshift(c), s(c), !1) }), u } return s(n.dataTypes[0]) || !o["*"] && s("*") } function _n(e, n) { var r, i, o = x.ajaxSettings.flatOptions || {}; for (i in n) n[i] !== t && ((o[i] ? e : r || (r = {}))[i] = n[i]); return r && x.extend(!0, e, r), e } x.fn.load = function (e, n, r) { if ("string" != typeof e && Sn) return Sn.apply(this, arguments); var i, o, a, s = this, l = e.indexOf(" "); return l >= 0 && (i = e.slice(l, e.length), e = e.slice(0, l)), x.isFunction(n) ? (r = n, n = t) : n && "object" == typeof n && (a = "POST"), s.length > 0 && x.ajax({ url: e, type: a, dataType: "html", data: n }).done(function (e) { o = arguments, s.html(i ? x("<div>").append(x.parseHTML(e)).find(i) : e) }).complete(r && function (e, t) { s.each(r, o || [e.responseText, t, e]) }), this }, x.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function (e, t) { x.fn[t] = function (e) { return this.on(t, e) } }), x.extend({ active: 0, lastModified: {}, etag: {}, ajaxSettings: { url: yn, type: "GET", isLocal: Cn.test(mn[1]), global: !0, processData: !0, async: !0, contentType: "application/x-www-form-urlencoded; charset=UTF-8", accepts: { "*": Dn, text: "text/plain", html: "text/html", xml: "application/xml, text/xml", json: "application/json, text/javascript" }, contents: { xml: /xml/, html: /html/, json: /json/ }, responseFields: { xml: "responseXML", text: "responseText", json: "responseJSON" }, converters: { "* text": String, "text html": !0, "text json": x.parseJSON, "text xml": x.parseXML }, flatOptions: { url: !0, context: !0 } }, ajaxSetup: function (e, t) { return t ? _n(_n(e, x.ajaxSettings), t) : _n(x.ajaxSettings, e) }, ajaxPrefilter: Hn(An), ajaxTransport: Hn(jn), ajax: function (e, n) { "object" == typeof e && (n = e, e = t), n = n || {}; var r, i, o, a, s, l, u, c, p = x.ajaxSetup({}, n), f = p.context || p, d = p.context && (f.nodeType || f.jquery) ? x(f) : x.event, h = x.Deferred(), g = x.Callbacks("once memory"), m = p.statusCode || {}, y = {}, v = {}, b = 0, w = "canceled", C = { readyState: 0, getResponseHeader: function (e) { var t; if (2 === b) { if (!c) { c = {}; while (t = Tn.exec(a)) c[t[1].toLowerCase()] = t[2] } t = c[e.toLowerCase()] } return null == t ? null : t }, getAllResponseHeaders: function () { return 2 === b ? a : null }, setRequestHeader: function (e, t) { var n = e.toLowerCase(); return b || (e = v[n] = v[n] || e, y[e] = t), this }, overrideMimeType: function (e) { return b || (p.mimeType = e), this }, statusCode: function (e) { var t; if (e) if (2 > b) for (t in e) m[t] = [m[t], e[t]]; else C.always(e[C.status]); return this }, abort: function (e) { var t = e || w; return u && u.abort(t), k(0, t), this } }; if (h.promise(C).complete = g.add, C.success = C.done, C.error = C.fail, p.url = ((e || p.url || yn) + "").replace(xn, "").replace(kn, mn[1] + "//"), p.type = n.method || n.type || p.method || p.type, p.dataTypes = x.trim(p.dataType || "*").toLowerCase().match(T) || [""], null == p.crossDomain && (r = En.exec(p.url.toLowerCase()), p.crossDomain = !(!r || r[1] === mn[1] && r[2] === mn[2] && (r[3] || ("http:" === r[1] ? "80" : "443")) === (mn[3] || ("http:" === mn[1] ? "80" : "443")))), p.data && p.processData && "string" != typeof p.data && (p.data = x.param(p.data, p.traditional)), qn(An, p, n, C), 2 === b) return C; l = p.global, l && 0 === x.active++ && x.event.trigger("ajaxStart"), p.type = p.type.toUpperCase(), p.hasContent = !Nn.test(p.type), o = p.url, p.hasContent || (p.data && (o = p.url += (bn.test(o) ? "&" : "?") + p.data, delete p.data), p.cache === !1 && (p.url = wn.test(o) ? o.replace(wn, "$1_=" + vn++) : o + (bn.test(o) ? "&" : "?") + "_=" + vn++)), p.ifModified && (x.lastModified[o] && C.setRequestHeader("If-Modified-Since", x.lastModified[o]), x.etag[o] && C.setRequestHeader("If-None-Match", x.etag[o])), (p.data && p.hasContent && p.contentType !== !1 || n.contentType) && C.setRequestHeader("Content-Type", p.contentType), C.setRequestHeader("Accept", p.dataTypes[0] && p.accepts[p.dataTypes[0]] ? p.accepts[p.dataTypes[0]] + ("*" !== p.dataTypes[0] ? ", " + Dn + "; q=0.01" : "") : p.accepts["*"]); for (i in p.headers) C.setRequestHeader(i, p.headers[i]); if (p.beforeSend && (p.beforeSend.call(f, C, p) === !1 || 2 === b)) return C.abort(); w = "abort"; for (i in { success: 1, error: 1, complete: 1 }) C[i](p[i]); if (u = qn(jn, p, n, C)) { C.readyState = 1, l && d.trigger("ajaxSend", [C, p]), p.async && p.timeout > 0 && (s = setTimeout(function () { C.abort("timeout") }, p.timeout)); try { b = 1, u.send(y, k) } catch (N) { if (!(2 > b)) throw N; k(-1, N) } } else k(-1, "No Transport"); function k(e, n, r, i) { var c, y, v, w, T, N = n; 2 !== b && (b = 2, s && clearTimeout(s), u = t, a = i || "", C.readyState = e > 0 ? 4 : 0, c = e >= 200 && 300 > e || 304 === e, r && (w = Mn(p, C, r)), w = On(p, w, C, c), c ? (p.ifModified && (T = C.getResponseHeader("Last-Modified"), T && (x.lastModified[o] = T), T = C.getResponseHeader("etag"), T && (x.etag[o] = T)), 204 === e || "HEAD" === p.type ? N = "nocontent" : 304 === e ? N = "notmodified" : (N = w.state, y = w.data, v = w.error, c = !v)) : (v = N, (e || !N) && (N = "error", 0 > e && (e = 0))), C.status = e, C.statusText = (n || N) + "", c ? h.resolveWith(f, [y, N, C]) : h.rejectWith(f, [C, N, v]), C.statusCode(m), m = t, l && d.trigger(c ? "ajaxSuccess" : "ajaxError", [C, p, c ? y : v]), g.fireWith(f, [C, N]), l && (d.trigger("ajaxComplete", [C, p]), --x.active || x.event.trigger("ajaxStop"))) } return C }, getJSON: function (e, t, n) { return x.get(e, t, n, "json") }, getScript: function (e, n) { return x.get(e, t, n, "script") } }), x.each(["get", "post"], function (e, n) { x[n] = function (e, r, i, o) { return x.isFunction(r) && (o = o || i, i = r, r = t), x.ajax({ url: e, type: n, dataType: o, data: r, success: i }) } }); function Mn(e, n, r) { var i, o, a, s, l = e.contents, u = e.dataTypes; while ("*" === u[0]) u.shift(), o === t && (o = e.mimeType || n.getResponseHeader("Content-Type")); if (o) for (s in l) if (l[s] && l[s].test(o)) { u.unshift(s); break } if (u[0] in r) a = u[0]; else { for (s in r) { if (!u[0] || e.converters[s + " " + u[0]]) { a = s; break } i || (i = s) } a = a || i } return a ? (a !== u[0] && u.unshift(a), r[a]) : t } function On(e, t, n, r) { var i, o, a, s, l, u = {}, c = e.dataTypes.slice(); if (c[1]) for (a in e.converters) u[a.toLowerCase()] = e.converters[a]; o = c.shift(); while (o) if (e.responseFields[o] && (n[e.responseFields[o]] = t), !l && r && e.dataFilter && (t = e.dataFilter(t, e.dataType)), l = o, o = c.shift()) if ("*" === o) o = l; else if ("*" !== l && l !== o) { if (a = u[l + " " + o] || u["* " + o], !a) for (i in u) if (s = i.split(" "), s[1] === o && (a = u[l + " " + s[0]] || u["* " + s[0]])) { a === !0 ? a = u[i] : u[i] !== !0 && (o = s[0], c.unshift(s[1])); break } if (a !== !0) if (a && e["throws"]) t = a(t); else try { t = a(t) } catch (p) { return { state: "parsererror", error: a ? p : "No conversion from " + l + " to " + o } } } return { state: "success", data: t } } x.ajaxSetup({ accepts: { script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript" }, contents: { script: /(?:java|ecma)script/ }, converters: { "text script": function (e) { return x.globalEval(e), e } } }), x.ajaxPrefilter("script", function (e) { e.cache === t && (e.cache = !1), e.crossDomain && (e.type = "GET", e.global = !1) }), x.ajaxTransport("script", function (e) { if (e.crossDomain) { var n, r = a.head || x("head")[0] || a.documentElement; return { send: function (t, i) { n = a.createElement("script"), n.async = !0, e.scriptCharset && (n.charset = e.scriptCharset), n.src = e.url, n.onload = n.onreadystatechange = function (e, t) { (t || !n.readyState || /loaded|complete/.test(n.readyState)) && (n.onload = n.onreadystatechange = null, n.parentNode && n.parentNode.removeChild(n), n = null, t || i(200, "success")) }, r.insertBefore(n, r.firstChild) }, abort: function () { n && n.onload(t, !0) } } } }); var Fn = [], Bn = /(=)\?(?=&|$)|\?\?/; x.ajaxSetup({ jsonp: "callback", jsonpCallback: function () { var e = Fn.pop() || x.expando + "_" + vn++; return this[e] = !0, e } }), x.ajaxPrefilter("json jsonp", function (n, r, i) { var o, a, s, l = n.jsonp !== !1 && (Bn.test(n.url) ? "url" : "string" == typeof n.data && !(n.contentType || "").indexOf("application/x-www-form-urlencoded") && Bn.test(n.data) && "data"); return l || "jsonp" === n.dataTypes[0] ? (o = n.jsonpCallback = x.isFunction(n.jsonpCallback) ? n.jsonpCallback() : n.jsonpCallback, l ? n[l] = n[l].replace(Bn, "$1" + o) : n.jsonp !== !1 && (n.url += (bn.test(n.url) ? "&" : "?") + n.jsonp + "=" + o), n.converters["script json"] = function () { return s || x.error(o + " was not called"), s[0] }, n.dataTypes[0] = "json", a = e[o], e[o] = function () { s = arguments }, i.always(function () { e[o] = a, n[o] && (n.jsonpCallback = r.jsonpCallback, Fn.push(o)), s && x.isFunction(a) && a(s[0]), s = a = t }), "script") : t }); var Pn, Rn, Wn = 0, $n = e.ActiveXObject && function () { var e; for (e in Pn) Pn[e](t, !0) }; function In() { try { return new e.XMLHttpRequest } catch (t) { } } function zn() { try { return new e.ActiveXObject("Microsoft.XMLHTTP") } catch (t) { } } x.ajaxSettings.xhr = e.ActiveXObject ? function () { return !this.isLocal && In() || zn() } : In, Rn = x.ajaxSettings.xhr(), x.support.cors = !!Rn && "withCredentials" in Rn, Rn = x.support.ajax = !!Rn, Rn && x.ajaxTransport(function (n) { if (!n.crossDomain || x.support.cors) { var r; return { send: function (i, o) { var a, s, l = n.xhr(); if (n.username ? l.open(n.type, n.url, n.async, n.username, n.password) : l.open(n.type, n.url, n.async), n.xhrFields) for (s in n.xhrFields) l[s] = n.xhrFields[s]; n.mimeType && l.overrideMimeType && l.overrideMimeType(n.mimeType), n.crossDomain || i["X-Requested-With"] || (i["X-Requested-With"] = "XMLHttpRequest"); try { for (s in i) l.setRequestHeader(s, i[s]) } catch (u) { } l.send(n.hasContent && n.data || null), r = function (e, i) { var s, u, c, p; try { if (r && (i || 4 === l.readyState)) if (r = t, a && (l.onreadystatechange = x.noop, $n && delete Pn[a]), i) 4 !== l.readyState && l.abort(); else { p = {}, s = l.status, u = l.getAllResponseHeaders(), "string" == typeof l.responseText && (p.text = l.responseText); try { c = l.statusText } catch (f) { c = "" } s || !n.isLocal || n.crossDomain ? 1223 === s && (s = 204) : s = p.text ? 200 : 404 } } catch (d) { i || o(-1, d) } p && o(s, c, p, u) }, n.async ? 4 === l.readyState ? setTimeout(r) : (a = ++Wn, $n && (Pn || (Pn = {}, x(e).unload($n)), Pn[a] = r), l.onreadystatechange = r) : r() }, abort: function () { r && r(t, !0) } } } }); var Xn, Un, Vn = /^(?:toggle|show|hide)$/, Yn = RegExp("^(?:([+-])=|)(" + w + ")([a-z%]*)$", "i"), Jn = /queueHooks$/, Gn = [nr], Qn = { "*": [function (e, t) { var n = this.createTween(e, t), r = n.cur(), i = Yn.exec(t), o = i && i[3] || (x.cssNumber[e] ? "" : "px"), a = (x.cssNumber[e] || "px" !== o && +r) && Yn.exec(x.css(n.elem, e)), s = 1, l = 20; if (a && a[3] !== o) { o = o || a[3], i = i || [], a = +r || 1; do s = s || ".5", a /= s, x.style(n.elem, e, a + o); while (s !== (s = n.cur() / r) && 1 !== s && --l) } return i && (a = n.start = +a || +r || 0, n.unit = o, n.end = i[1] ? a + (i[1] + 1) * i[2] : +i[2]), n }] }; function Kn() { return setTimeout(function () { Xn = t }), Xn = x.now() } function Zn(e, t, n) { var r, i = (Qn[t] || []).concat(Qn["*"]), o = 0, a = i.length; for (; a > o; o++) if (r = i[o].call(n, t, e)) return r } function er(e, t, n) { var r, i, o = 0, a = Gn.length, s = x.Deferred().always(function () { delete l.elem }), l = function () { if (i) return !1; var t = Xn || Kn(), n = Math.max(0, u.startTime + u.duration - t), r = n / u.duration || 0, o = 1 - r, a = 0, l = u.tweens.length; for (; l > a; a++) u.tweens[a].run(o); return s.notifyWith(e, [u, o, n]), 1 > o && l ? n : (s.resolveWith(e, [u]), !1) }, u = s.promise({ elem: e, props: x.extend({}, t), opts: x.extend(!0, { specialEasing: {} }, n), originalProperties: t, originalOptions: n, startTime: Xn || Kn(), duration: n.duration, tweens: [], createTween: function (t, n) { var r = x.Tween(e, u.opts, t, n, u.opts.specialEasing[t] || u.opts.easing); return u.tweens.push(r), r }, stop: function (t) { var n = 0, r = t ? u.tweens.length : 0; if (i) return this; for (i = !0; r > n; n++) u.tweens[n].run(1); return t ? s.resolveWith(e, [u, t]) : s.rejectWith(e, [u, t]), this } }), c = u.props; for (tr(c, u.opts.specialEasing) ; a > o; o++) if (r = Gn[o].call(u, e, c, u.opts)) return r; return x.map(c, Zn, u), x.isFunction(u.opts.start) && u.opts.start.call(e, u), x.fx.timer(x.extend(l, { elem: e, anim: u, queue: u.opts.queue })), u.progress(u.opts.progress).done(u.opts.done, u.opts.complete).fail(u.opts.fail).always(u.opts.always) } function tr(e, t) { var n, r, i, o, a; for (n in e) if (r = x.camelCase(n), i = t[r], o = e[n], x.isArray(o) && (i = o[1], o = e[n] = o[0]), n !== r && (e[r] = o, delete e[n]), a = x.cssHooks[r], a && "expand" in a) { o = a.expand(o), delete e[r]; for (n in o) n in e || (e[n] = o[n], t[n] = i) } else t[r] = i } x.Animation = x.extend(er, { tweener: function (e, t) { x.isFunction(e) ? (t = e, e = ["*"]) : e = e.split(" "); var n, r = 0, i = e.length; for (; i > r; r++) n = e[r], Qn[n] = Qn[n] || [], Qn[n].unshift(t) }, prefilter: function (e, t) { t ? Gn.unshift(e) : Gn.push(e) } }); function nr(e, t, n) { var r, i, o, a, s, l, u = this, c = {}, p = e.style, f = e.nodeType && nn(e), d = x._data(e, "fxshow"); n.queue || (s = x._queueHooks(e, "fx"), null == s.unqueued && (s.unqueued = 0, l = s.empty.fire, s.empty.fire = function () { s.unqueued || l() }), s.unqueued++, u.always(function () { u.always(function () { s.unqueued--, x.queue(e, "fx").length || s.empty.fire() }) })), 1 === e.nodeType && ("height" in t || "width" in t) && (n.overflow = [p.overflow, p.overflowX, p.overflowY], "inline" === x.css(e, "display") && "none" === x.css(e, "float") && (x.support.inlineBlockNeedsLayout && "inline" !== ln(e.nodeName) ? p.zoom = 1 : p.display = "inline-block")), n.overflow && (p.overflow = "hidden", x.support.shrinkWrapBlocks || u.always(function () { p.overflow = n.overflow[0], p.overflowX = n.overflow[1], p.overflowY = n.overflow[2] })); for (r in t) if (i = t[r], Vn.exec(i)) { if (delete t[r], o = o || "toggle" === i, i === (f ? "hide" : "show")) continue; c[r] = d && d[r] || x.style(e, r) } if (!x.isEmptyObject(c)) { d ? "hidden" in d && (f = d.hidden) : d = x._data(e, "fxshow", {}), o && (d.hidden = !f), f ? x(e).show() : u.done(function () { x(e).hide() }), u.done(function () { var t; x._removeData(e, "fxshow"); for (t in c) x.style(e, t, c[t]) }); for (r in c) a = Zn(f ? d[r] : 0, r, u), r in d || (d[r] = a.start, f && (a.end = a.start, a.start = "width" === r || "height" === r ? 1 : 0)) } } function rr(e, t, n, r, i) { return new rr.prototype.init(e, t, n, r, i) } x.Tween = rr, rr.prototype = { constructor: rr, init: function (e, t, n, r, i, o) { this.elem = e, this.prop = n, this.easing = i || "swing", this.options = t, this.start = this.now = this.cur(), this.end = r, this.unit = o || (x.cssNumber[n] ? "" : "px") }, cur: function () { var e = rr.propHooks[this.prop]; return e && e.get ? e.get(this) : rr.propHooks._default.get(this) }, run: function (e) { var t, n = rr.propHooks[this.prop]; return this.pos = t = this.options.duration ? x.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : e, this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), n && n.set ? n.set(this) : rr.propHooks._default.set(this), this } }, rr.prototype.init.prototype = rr.prototype, rr.propHooks = { _default: { get: function (e) { var t; return null == e.elem[e.prop] || e.elem.style && null != e.elem.style[e.prop] ? (t = x.css(e.elem, e.prop, ""), t && "auto" !== t ? t : 0) : e.elem[e.prop] }, set: function (e) { x.fx.step[e.prop] ? x.fx.step[e.prop](e) : e.elem.style && (null != e.elem.style[x.cssProps[e.prop]] || x.cssHooks[e.prop]) ? x.style(e.elem, e.prop, e.now + e.unit) : e.elem[e.prop] = e.now } } }, rr.propHooks.scrollTop = rr.propHooks.scrollLeft = { set: function (e) { e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now) } }, x.each(["toggle", "show", "hide"], function (e, t) { var n = x.fn[t]; x.fn[t] = function (e, r, i) { return null == e || "boolean" == typeof e ? n.apply(this, arguments) : this.animate(ir(t, !0), e, r, i) } }), x.fn.extend({ fadeTo: function (e, t, n, r) { return this.filter(nn).css("opacity", 0).show().end().animate({ opacity: t }, e, n, r) }, animate: function (e, t, n, r) { var i = x.isEmptyObject(e), o = x.speed(t, n, r), a = function () { var t = er(this, x.extend({}, e), o); (i || x._data(this, "finish")) && t.stop(!0) }; return a.finish = a, i || o.queue === !1 ? this.each(a) : this.queue(o.queue, a) }, stop: function (e, n, r) { var i = function (e) { var t = e.stop; delete e.stop, t(r) }; return "string" != typeof e && (r = n, n = e, e = t), n && e !== !1 && this.queue(e || "fx", []), this.each(function () { var t = !0, n = null != e && e + "queueHooks", o = x.timers, a = x._data(this); if (n) a[n] && a[n].stop && i(a[n]); else for (n in a) a[n] && a[n].stop && Jn.test(n) && i(a[n]); for (n = o.length; n--;) o[n].elem !== this || null != e && o[n].queue !== e || (o[n].anim.stop(r), t = !1, o.splice(n, 1)); (t || !r) && x.dequeue(this, e) }) }, finish: function (e) { return e !== !1 && (e = e || "fx"), this.each(function () { var t, n = x._data(this), r = n[e + "queue"], i = n[e + "queueHooks"], o = x.timers, a = r ? r.length : 0; for (n.finish = !0, x.queue(this, e, []), i && i.stop && i.stop.call(this, !0), t = o.length; t--;) o[t].elem === this && o[t].queue === e && (o[t].anim.stop(!0), o.splice(t, 1)); for (t = 0; a > t; t++) r[t] && r[t].finish && r[t].finish.call(this); delete n.finish }) } }); function ir(e, t) { var n, r = { height: e }, i = 0; for (t = t ? 1 : 0; 4 > i; i += 2 - t) n = Zt[i], r["margin" + n] = r["padding" + n] = e; return t && (r.opacity = r.width = e), r } x.each({ slideDown: ir("show"), slideUp: ir("hide"), slideToggle: ir("toggle"), fadeIn: { opacity: "show" }, fadeOut: { opacity: "hide" }, fadeToggle: { opacity: "toggle" } }, function (e, t) { x.fn[e] = function (e, n, r) { return this.animate(t, e, n, r) } }), x.speed = function (e, t, n) { var r = e && "object" == typeof e ? x.extend({}, e) : { complete: n || !n && t || x.isFunction(e) && e, duration: e, easing: n && t || t && !x.isFunction(t) && t }; return r.duration = x.fx.off ? 0 : "number" == typeof r.duration ? r.duration : r.duration in x.fx.speeds ? x.fx.speeds[r.duration] : x.fx.speeds._default, (null == r.queue || r.queue === !0) && (r.queue = "fx"), r.old = r.complete, r.complete = function () { x.isFunction(r.old) && r.old.call(this), r.queue && x.dequeue(this, r.queue) }, r }, x.easing = { linear: function (e) { return e }, swing: function (e) { return .5 - Math.cos(e * Math.PI) / 2 } }, x.timers = [], x.fx = rr.prototype.init, x.fx.tick = function () { var e, n = x.timers, r = 0; for (Xn = x.now() ; n.length > r; r++) e = n[r], e() || n[r] !== e || n.splice(r--, 1); n.length || x.fx.stop(), Xn = t }, x.fx.timer = function (e) { e() && x.timers.push(e) && x.fx.start() }, x.fx.interval = 13, x.fx.start = function () { Un || (Un = setInterval(x.fx.tick, x.fx.interval)) }, x.fx.stop = function () { clearInterval(Un), Un = null }, x.fx.speeds = { slow: 600, fast: 200, _default: 400 }, x.fx.step = {}, x.expr && x.expr.filters && (x.expr.filters.animated = function (e) { return x.grep(x.timers, function (t) { return e === t.elem }).length }), x.fn.offset = function (e) { if (arguments.length) return e === t ? this : this.each(function (t) { x.offset.setOffset(this, e, t) }); var n, r, o = { top: 0, left: 0 }, a = this[0], s = a && a.ownerDocument; if (s) return n = s.documentElement, x.contains(n, a) ? (typeof a.getBoundingClientRect !== i && (o = a.getBoundingClientRect()), r = or(s), { top: o.top + (r.pageYOffset || n.scrollTop) - (n.clientTop || 0), left: o.left + (r.pageXOffset || n.scrollLeft) - (n.clientLeft || 0) }) : o }, x.offset = { setOffset: function (e, t, n) { var r = x.css(e, "position"); "static" === r && (e.style.position = "relative"); var i = x(e), o = i.offset(), a = x.css(e, "top"), s = x.css(e, "left"), l = ("absolute" === r || "fixed" === r) && x.inArray("auto", [a, s]) > -1, u = {}, c = {}, p, f; l ? (c = i.position(), p = c.top, f = c.left) : (p = parseFloat(a) || 0, f = parseFloat(s) || 0), x.isFunction(t) && (t = t.call(e, n, o)), null != t.top && (u.top = t.top - o.top + p), null != t.left && (u.left = t.left - o.left + f), "using" in t ? t.using.call(e, u) : i.css(u) } }, x.fn.extend({ position: function () { if (this[0]) { var e, t, n = { top: 0, left: 0 }, r = this[0]; return "fixed" === x.css(r, "position") ? t = r.getBoundingClientRect() : (e = this.offsetParent(), t = this.offset(), x.nodeName(e[0], "html") || (n = e.offset()), n.top += x.css(e[0], "borderTopWidth", !0), n.left += x.css(e[0], "borderLeftWidth", !0)), { top: t.top - n.top - x.css(r, "marginTop", !0), left: t.left - n.left - x.css(r, "marginLeft", !0) } } }, offsetParent: function () { return this.map(function () { var e = this.offsetParent || s; while (e && !x.nodeName(e, "html") && "static" === x.css(e, "position")) e = e.offsetParent; return e || s }) } }), x.each({ scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function (e, n) { var r = /Y/.test(n); x.fn[e] = function (i) { return x.access(this, function (e, i, o) { var a = or(e); return o === t ? a ? n in a ? a[n] : a.document.documentElement[i] : e[i] : (a ? a.scrollTo(r ? x(a).scrollLeft() : o, r ? o : x(a).scrollTop()) : e[i] = o, t) }, e, i, arguments.length, null) } }); function or(e) { return x.isWindow(e) ? e : 9 === e.nodeType ? e.defaultView || e.parentWindow : !1 } x.each({ Height: "height", Width: "width" }, function (e, n) { x.each({ padding: "inner" + e, content: n, "": "outer" + e }, function (r, i) { x.fn[i] = function (i, o) { var a = arguments.length && (r || "boolean" != typeof i), s = r || (i === !0 || o === !0 ? "margin" : "border"); return x.access(this, function (n, r, i) { var o; return x.isWindow(n) ? n.document.documentElement["client" + e] : 9 === n.nodeType ? (o = n.documentElement, Math.max(n.body["scroll" + e], o["scroll" + e], n.body["offset" + e], o["offset" + e], o["client" + e])) : i === t ? x.css(n, r, s) : x.style(n, r, i, s) }, n, a ? i : t, a, null) } }) }), x.fn.size = function () { return this.length }, x.fn.andSelf = x.fn.addBack, "object" == typeof module && module && "object" == typeof module.exports ? module.exports = x : (e.jQuery = e.$ = x, "function" == typeof define && define.amd && define("jquery", [], function () { return x }))
})(window);

(function ($) {

    $.fn.targetBlank = function () {
        return this.each(function () {
            $(this).find('a').prop('target', '_blank');
        });
    }

    $.fn.swapClass = function (removeClass, addClass) {
        return this.each(function () {
            $(this).removeClass(removeClass).addClass(addClass);
        });
    };

    $.fn.ellipsisFill = function (text) {

        return this.each(function () {

            var $self = $(this);

            $self.empty();

            $self.spanElem = $('<span title="' + text + '"></span>');
            $self.append($self.spanElem);

            $self.css('overflow', 'hidden');
            $self.spanElem.css('white-space', 'nowrap');

            $self.spanElem.html(text);

            // get the width of the span.
            // if it's wider than the container, remove a word until it's not.
            if ($self.spanElem.width() > $self.width()) {
                var lastText;

                while ($self.spanElem.width() > $self.width()) {
                    var t = $self.spanElem.html();

                    t = t.substring(0, t.lastIndexOf(' ')) + '&hellip;';

                    if (t == lastText) break;

                    $self.spanElem.html(t);

                    lastText = t;
                }
            }
        });
    };

    $.fn.ellipsisFixed = function (chars, buttonText) {

        return this.each(function () {

            var $self = $(this);

            var text = $self.text();

            $self.empty();

            var $span = $('<span></span>');

            var $ellipsis = $('<a href="#" title="more" class="ellipsis"></a>');

            if (buttonText) {
                $ellipsis.html(buttonText);
            } else {
                $ellipsis.html('&hellip;');
            }

            $ellipsis.click(function (e) {
                e.preventDefault();

                var $this = $(this);

                $span.html(text);

                $this.remove();
            });

            if (text.length > chars) {
                var trimmedText = text.substr(0, chars);
                trimmedText = trimmedText.substr(0, Math.min(trimmedText.length, trimmedText.lastIndexOf(" ")));

                $span.html(trimmedText + "&nbsp;");

                $span.append($ellipsis);
            } else {
                $span.html(text);
            }

            $self.append($span);
        });

    };

    $.fn.toggleExpandText = function (chars) {

        return this.each(function () {

            var $self = $(this);

            var expandedText = $self.text();

            if (chars > expandedText.length) return;

            var expanded = false;

            var collapsedText = expandedText.substr(0, chars);
            collapsedText = collapsedText.substr(0, Math.min(collapsedText.length, collapsedText.lastIndexOf(" ")));

            $self.toggle = function() {
                $self.empty();

                var $toggleButton = $('<a href="#" class="toggle"></a>');

                if (expanded) {
                    $self.html(expandedText + "&nbsp;");
                    $toggleButton.text("less");
                } else {
                    $self.html(collapsedText + "&nbsp;");
                    $toggleButton.text("more");
                }

                $toggleButton.one('click', function(e) {
                    e.preventDefault();

                    $self.toggle();
                });

                expanded = !expanded;

                $self.append($toggleButton);
            };

            $self.toggle();
        });

    };

    $.fn.ellipsis = function (chars) {

        return this.each(function () {

            var $self = $(this);

            var text = $self.text();

            if (text.length > chars) {
                var trimmedText = text.substr(0, chars);
                trimmedText = trimmedText.substr(0, Math.min(trimmedText.length, trimmedText.lastIndexOf(" ")))

                $self.empty().html(trimmedText + "&hellip;");
            }
        });

    };

    $.fn.horizontalMargins = function () {
        var $self = $(this);
        return parseInt($self.css('marginLeft')) + parseInt($self.css('marginRight'));
    };

    $.fn.verticalMargins = function () {
        var $self = $(this);
        return parseInt($self.css('marginTop')) + parseInt($self.css('marginBottom'));
    };

    $.fn.horizontalPadding = function () {
        var $self = $(this);
        return parseInt($self.css('paddingLeft')) + parseInt($self.css('paddingRight'));
    };

    $.fn.verticalPadding = function () {
        var $self = $(this);
        return parseInt($self.css('paddingTop')) + parseInt($self.css('paddingBottom'));
    };

    // useful if stretching to fit a parent element's inner height.
    // borders/margins/padding are included in final height, so no overspill.
//    $.fn.actualHeight = function (height) {
//
//        return this.each(function () {
//
//            var $self = $(this);
//
//            $self.height(height);
//
//            height -= $self.outerHeight(true) - $self.height();
//
//            $self.height(height);
//        });
//    };
//
//    $.fn.actualWidth = function (width) {
//
//        return this.each(function () {
//
//            var $self = $(this);
//
//            $self.width(width);
//
//            width -= $self.outerWidth(true) - $self.width();
//
//            $self.width(width);
//        });
//    };

})(jQuery);

(function ($) {
    var on = $.fn.on, timer;
    $.fn.on = function () {
        var args = Array.apply(null, arguments);
        var last = args[args.length - 1];

        if (isNaN(last) || (last === 1 && args.pop())) return on.apply(this, args);

        var delay = args.pop();
        var fn = args.pop();

        args.push(function () {
            var self = this, params = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () {
                fn.apply(self, params);
            }, delay);
        });

        return on.apply(this, args);
    };
})(jQuery);

/*!
 * jQuery Cookie Plugin
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2011, Klaus Hartl
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/GPL-2.0
 */
(function($) {
    $.cookie = function(key, value, options) {

        // key and at least value given, set cookie...
        if (arguments.length > 1 && (!/Object/.test(Object.prototype.toString.call(value)) || value === null || value === undefined)) {
            options = $.extend({}, options);

            if (value === null || value === undefined) {
                options.expires = -1;
            }

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }

            value = String(value);

            return (document.cookie = [
                encodeURIComponent(key), '=', options.raw ? value : encodeURIComponent(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path    ? '; path=' + options.path : '',
                options.domain  ? '; domain=' + options.domain : '',
                options.secure  ? '; secure' : ''
            ].join(''));
        }

        // key and possibly options given, get cookie...
        options = value || {};
        var decode = options.raw ? function(s) { return s; } : decodeURIComponent;

        var pairs = document.cookie.split('; ');
        for (var i = 0, pair; pair = pairs[i] && pairs[i].split('='); i++) {
            if (decode(pair[0]) === key) return decode(pair[1] || ''); // IE saves cookies with empty string as "c; ", e.g. without "=" as opposed to EOMB, thus pair[1] may be undefined
        }
        return null;
    };
})(jQuery);

(function($){
    $.mlp = {x:0,y:0}; // Mouse Last Position
    function documentHandler(){
        var $current = this === document ? $(this) : $(this).contents();
        $current.mousemove(function(e){jQuery.mlp = {x:e.pageX,y:e.pageY}});
        $current.find("iframe").load(documentHandler);
    }
    $(documentHandler);
    $.fn.ismouseover = function(overThis) {
        var result = false;
        this.eq(0).each(function() {
            var $current = $(this).is("iframe") ? $(this).contents().find("body") : $(this);
            var offset = $current.offset();
            result =    offset.left<=$.mlp.x && offset.left + $current.outerWidth() > $.mlp.x &&
            offset.top<=$.mlp.y && offset.top + $current.outerHeight() > $.mlp.y;
        });
        return result;
    };
})(jQuery);
define("plugins", ["jquery"], function(){});

//     Underscore.js 1.6.0
//     http://underscorejs.org
//     (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.
(function(){var n=this,t=n._,r={},e=Array.prototype,u=Object.prototype,i=Function.prototype,a=e.push,o=e.slice,c=e.concat,l=u.toString,f=u.hasOwnProperty,s=e.forEach,p=e.map,h=e.reduce,v=e.reduceRight,g=e.filter,d=e.every,m=e.some,y=e.indexOf,b=e.lastIndexOf,x=Array.isArray,w=Object.keys,_=i.bind,j=function(n){return n instanceof j?n:this instanceof j?void(this._wrapped=n):new j(n)};"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=j),exports._=j):n._=j,j.VERSION="1.6.0";var A=j.each=j.forEach=function(n,t,e){if(null==n)return n;if(s&&n.forEach===s)n.forEach(t,e);else if(n.length===+n.length){for(var u=0,i=n.length;i>u;u++)if(t.call(e,n[u],u,n)===r)return}else for(var a=j.keys(n),u=0,i=a.length;i>u;u++)if(t.call(e,n[a[u]],a[u],n)===r)return;return n};j.map=j.collect=function(n,t,r){var e=[];return null==n?e:p&&n.map===p?n.map(t,r):(A(n,function(n,u,i){e.push(t.call(r,n,u,i))}),e)};var O="Reduce of empty array with no initial value";j.reduce=j.foldl=j.inject=function(n,t,r,e){var u=arguments.length>2;if(null==n&&(n=[]),h&&n.reduce===h)return e&&(t=j.bind(t,e)),u?n.reduce(t,r):n.reduce(t);if(A(n,function(n,i,a){u?r=t.call(e,r,n,i,a):(r=n,u=!0)}),!u)throw new TypeError(O);return r},j.reduceRight=j.foldr=function(n,t,r,e){var u=arguments.length>2;if(null==n&&(n=[]),v&&n.reduceRight===v)return e&&(t=j.bind(t,e)),u?n.reduceRight(t,r):n.reduceRight(t);var i=n.length;if(i!==+i){var a=j.keys(n);i=a.length}if(A(n,function(o,c,l){c=a?a[--i]:--i,u?r=t.call(e,r,n[c],c,l):(r=n[c],u=!0)}),!u)throw new TypeError(O);return r},j.find=j.detect=function(n,t,r){var e;return k(n,function(n,u,i){return t.call(r,n,u,i)?(e=n,!0):void 0}),e},j.filter=j.select=function(n,t,r){var e=[];return null==n?e:g&&n.filter===g?n.filter(t,r):(A(n,function(n,u,i){t.call(r,n,u,i)&&e.push(n)}),e)},j.reject=function(n,t,r){return j.filter(n,function(n,e,u){return!t.call(r,n,e,u)},r)},j.every=j.all=function(n,t,e){t||(t=j.identity);var u=!0;return null==n?u:d&&n.every===d?n.every(t,e):(A(n,function(n,i,a){return(u=u&&t.call(e,n,i,a))?void 0:r}),!!u)};var k=j.some=j.any=function(n,t,e){t||(t=j.identity);var u=!1;return null==n?u:m&&n.some===m?n.some(t,e):(A(n,function(n,i,a){return u||(u=t.call(e,n,i,a))?r:void 0}),!!u)};j.contains=j.include=function(n,t){return null==n?!1:y&&n.indexOf===y?n.indexOf(t)!=-1:k(n,function(n){return n===t})},j.invoke=function(n,t){var r=o.call(arguments,2),e=j.isFunction(t);return j.map(n,function(n){return(e?t:n[t]).apply(n,r)})},j.pluck=function(n,t){return j.map(n,j.property(t))},j.where=function(n,t){return j.filter(n,j.matches(t))},j.findWhere=function(n,t){return j.find(n,j.matches(t))},j.max=function(n,t,r){if(!t&&j.isArray(n)&&n[0]===+n[0]&&n.length<65535)return Math.max.apply(Math,n);var e=-1/0,u=-1/0;return A(n,function(n,i,a){var o=t?t.call(r,n,i,a):n;o>u&&(e=n,u=o)}),e},j.min=function(n,t,r){if(!t&&j.isArray(n)&&n[0]===+n[0]&&n.length<65535)return Math.min.apply(Math,n);var e=1/0,u=1/0;return A(n,function(n,i,a){var o=t?t.call(r,n,i,a):n;u>o&&(e=n,u=o)}),e},j.shuffle=function(n){var t,r=0,e=[];return A(n,function(n){t=j.random(r++),e[r-1]=e[t],e[t]=n}),e},j.sample=function(n,t,r){return null==t||r?(n.length!==+n.length&&(n=j.values(n)),n[j.random(n.length-1)]):j.shuffle(n).slice(0,Math.max(0,t))};var E=function(n){return null==n?j.identity:j.isFunction(n)?n:j.property(n)};j.sortBy=function(n,t,r){return t=E(t),j.pluck(j.map(n,function(n,e,u){return{value:n,index:e,criteria:t.call(r,n,e,u)}}).sort(function(n,t){var r=n.criteria,e=t.criteria;if(r!==e){if(r>e||r===void 0)return 1;if(e>r||e===void 0)return-1}return n.index-t.index}),"value")};var F=function(n){return function(t,r,e){var u={};return r=E(r),A(t,function(i,a){var o=r.call(e,i,a,t);n(u,o,i)}),u}};j.groupBy=F(function(n,t,r){j.has(n,t)?n[t].push(r):n[t]=[r]}),j.indexBy=F(function(n,t,r){n[t]=r}),j.countBy=F(function(n,t){j.has(n,t)?n[t]++:n[t]=1}),j.sortedIndex=function(n,t,r,e){r=E(r);for(var u=r.call(e,t),i=0,a=n.length;a>i;){var o=i+a>>>1;r.call(e,n[o])<u?i=o+1:a=o}return i},j.toArray=function(n){return n?j.isArray(n)?o.call(n):n.length===+n.length?j.map(n,j.identity):j.values(n):[]},j.size=function(n){return null==n?0:n.length===+n.length?n.length:j.keys(n).length},j.first=j.head=j.take=function(n,t,r){return null==n?void 0:null==t||r?n[0]:0>t?[]:o.call(n,0,t)},j.initial=function(n,t,r){return o.call(n,0,n.length-(null==t||r?1:t))},j.last=function(n,t,r){return null==n?void 0:null==t||r?n[n.length-1]:o.call(n,Math.max(n.length-t,0))},j.rest=j.tail=j.drop=function(n,t,r){return o.call(n,null==t||r?1:t)},j.compact=function(n){return j.filter(n,j.identity)};var M=function(n,t,r){return t&&j.every(n,j.isArray)?c.apply(r,n):(A(n,function(n){j.isArray(n)||j.isArguments(n)?t?a.apply(r,n):M(n,t,r):r.push(n)}),r)};j.flatten=function(n,t){return M(n,t,[])},j.without=function(n){return j.difference(n,o.call(arguments,1))},j.partition=function(n,t){var r=[],e=[];return A(n,function(n){(t(n)?r:e).push(n)}),[r,e]},j.uniq=j.unique=function(n,t,r,e){j.isFunction(t)&&(e=r,r=t,t=!1);var u=r?j.map(n,r,e):n,i=[],a=[];return A(u,function(r,e){(t?e&&a[a.length-1]===r:j.contains(a,r))||(a.push(r),i.push(n[e]))}),i},j.union=function(){return j.uniq(j.flatten(arguments,!0))},j.intersection=function(n){var t=o.call(arguments,1);return j.filter(j.uniq(n),function(n){return j.every(t,function(t){return j.contains(t,n)})})},j.difference=function(n){var t=c.apply(e,o.call(arguments,1));return j.filter(n,function(n){return!j.contains(t,n)})},j.zip=function(){for(var n=j.max(j.pluck(arguments,"length").concat(0)),t=new Array(n),r=0;n>r;r++)t[r]=j.pluck(arguments,""+r);return t},j.object=function(n,t){if(null==n)return{};for(var r={},e=0,u=n.length;u>e;e++)t?r[n[e]]=t[e]:r[n[e][0]]=n[e][1];return r},j.indexOf=function(n,t,r){if(null==n)return-1;var e=0,u=n.length;if(r){if("number"!=typeof r)return e=j.sortedIndex(n,t),n[e]===t?e:-1;e=0>r?Math.max(0,u+r):r}if(y&&n.indexOf===y)return n.indexOf(t,r);for(;u>e;e++)if(n[e]===t)return e;return-1},j.lastIndexOf=function(n,t,r){if(null==n)return-1;var e=null!=r;if(b&&n.lastIndexOf===b)return e?n.lastIndexOf(t,r):n.lastIndexOf(t);for(var u=e?r:n.length;u--;)if(n[u]===t)return u;return-1},j.range=function(n,t,r){arguments.length<=1&&(t=n||0,n=0),r=arguments[2]||1;for(var e=Math.max(Math.ceil((t-n)/r),0),u=0,i=new Array(e);e>u;)i[u++]=n,n+=r;return i};var R=function(){};j.bind=function(n,t){var r,e;if(_&&n.bind===_)return _.apply(n,o.call(arguments,1));if(!j.isFunction(n))throw new TypeError;return r=o.call(arguments,2),e=function(){if(!(this instanceof e))return n.apply(t,r.concat(o.call(arguments)));R.prototype=n.prototype;var u=new R;R.prototype=null;var i=n.apply(u,r.concat(o.call(arguments)));return Object(i)===i?i:u}},j.partial=function(n){var t=o.call(arguments,1);return function(){for(var r=0,e=t.slice(),u=0,i=e.length;i>u;u++)e[u]===j&&(e[u]=arguments[r++]);for(;r<arguments.length;)e.push(arguments[r++]);return n.apply(this,e)}},j.bindAll=function(n){var t=o.call(arguments,1);if(0===t.length)throw new Error("bindAll must be passed function names");return A(t,function(t){n[t]=j.bind(n[t],n)}),n},j.memoize=function(n,t){var r={};return t||(t=j.identity),function(){var e=t.apply(this,arguments);return j.has(r,e)?r[e]:r[e]=n.apply(this,arguments)}},j.delay=function(n,t){var r=o.call(arguments,2);return setTimeout(function(){return n.apply(null,r)},t)},j.defer=function(n){return j.delay.apply(j,[n,1].concat(o.call(arguments,1)))},j.throttle=function(n,t,r){var e,u,i,a=null,o=0;r||(r={});var c=function(){o=r.leading===!1?0:j.now(),a=null,i=n.apply(e,u),e=u=null};return function(){var l=j.now();o||r.leading!==!1||(o=l);var f=t-(l-o);return e=this,u=arguments,0>=f?(clearTimeout(a),a=null,o=l,i=n.apply(e,u),e=u=null):a||r.trailing===!1||(a=setTimeout(c,f)),i}},j.debounce=function(n,t,r){var e,u,i,a,o,c=function(){var l=j.now()-a;t>l?e=setTimeout(c,t-l):(e=null,r||(o=n.apply(i,u),i=u=null))};return function(){i=this,u=arguments,a=j.now();var l=r&&!e;return e||(e=setTimeout(c,t)),l&&(o=n.apply(i,u),i=u=null),o}},j.once=function(n){var t,r=!1;return function(){return r?t:(r=!0,t=n.apply(this,arguments),n=null,t)}},j.wrap=function(n,t){return j.partial(t,n)},j.compose=function(){var n=arguments;return function(){for(var t=arguments,r=n.length-1;r>=0;r--)t=[n[r].apply(this,t)];return t[0]}},j.after=function(n,t){return function(){return--n<1?t.apply(this,arguments):void 0}},j.keys=function(n){if(!j.isObject(n))return[];if(w)return w(n);var t=[];for(var r in n)j.has(n,r)&&t.push(r);return t},j.values=function(n){for(var t=j.keys(n),r=t.length,e=new Array(r),u=0;r>u;u++)e[u]=n[t[u]];return e},j.pairs=function(n){for(var t=j.keys(n),r=t.length,e=new Array(r),u=0;r>u;u++)e[u]=[t[u],n[t[u]]];return e},j.invert=function(n){for(var t={},r=j.keys(n),e=0,u=r.length;u>e;e++)t[n[r[e]]]=r[e];return t},j.functions=j.methods=function(n){var t=[];for(var r in n)j.isFunction(n[r])&&t.push(r);return t.sort()},j.extend=function(n){return A(o.call(arguments,1),function(t){if(t)for(var r in t)n[r]=t[r]}),n},j.pick=function(n){var t={},r=c.apply(e,o.call(arguments,1));return A(r,function(r){r in n&&(t[r]=n[r])}),t},j.omit=function(n){var t={},r=c.apply(e,o.call(arguments,1));for(var u in n)j.contains(r,u)||(t[u]=n[u]);return t},j.defaults=function(n){return A(o.call(arguments,1),function(t){if(t)for(var r in t)n[r]===void 0&&(n[r]=t[r])}),n},j.clone=function(n){return j.isObject(n)?j.isArray(n)?n.slice():j.extend({},n):n},j.tap=function(n,t){return t(n),n};var S=function(n,t,r,e){if(n===t)return 0!==n||1/n==1/t;if(null==n||null==t)return n===t;n instanceof j&&(n=n._wrapped),t instanceof j&&(t=t._wrapped);var u=l.call(n);if(u!=l.call(t))return!1;switch(u){case"[object String]":return n==String(t);case"[object Number]":return n!=+n?t!=+t:0==n?1/n==1/t:n==+t;case"[object Date]":case"[object Boolean]":return+n==+t;case"[object RegExp]":return n.source==t.source&&n.global==t.global&&n.multiline==t.multiline&&n.ignoreCase==t.ignoreCase}if("object"!=typeof n||"object"!=typeof t)return!1;for(var i=r.length;i--;)if(r[i]==n)return e[i]==t;var a=n.constructor,o=t.constructor;if(a!==o&&!(j.isFunction(a)&&a instanceof a&&j.isFunction(o)&&o instanceof o)&&"constructor"in n&&"constructor"in t)return!1;r.push(n),e.push(t);var c=0,f=!0;if("[object Array]"==u){if(c=n.length,f=c==t.length)for(;c--&&(f=S(n[c],t[c],r,e)););}else{for(var s in n)if(j.has(n,s)&&(c++,!(f=j.has(t,s)&&S(n[s],t[s],r,e))))break;if(f){for(s in t)if(j.has(t,s)&&!c--)break;f=!c}}return r.pop(),e.pop(),f};j.isEqual=function(n,t){return S(n,t,[],[])},j.isEmpty=function(n){if(null==n)return!0;if(j.isArray(n)||j.isString(n))return 0===n.length;for(var t in n)if(j.has(n,t))return!1;return!0},j.isElement=function(n){return!(!n||1!==n.nodeType)},j.isArray=x||function(n){return"[object Array]"==l.call(n)},j.isObject=function(n){return n===Object(n)},A(["Arguments","Function","String","Number","Date","RegExp"],function(n){j["is"+n]=function(t){return l.call(t)=="[object "+n+"]"}}),j.isArguments(arguments)||(j.isArguments=function(n){return!(!n||!j.has(n,"callee"))}),"function"!=typeof/./&&(j.isFunction=function(n){return"function"==typeof n}),j.isFinite=function(n){return isFinite(n)&&!isNaN(parseFloat(n))},j.isNaN=function(n){return j.isNumber(n)&&n!=+n},j.isBoolean=function(n){return n===!0||n===!1||"[object Boolean]"==l.call(n)},j.isNull=function(n){return null===n},j.isUndefined=function(n){return n===void 0},j.has=function(n,t){return f.call(n,t)},j.noConflict=function(){return n._=t,this},j.identity=function(n){return n},j.constant=function(n){return function(){return n}},j.property=function(n){return function(t){return t[n]}},j.matches=function(n){return function(t){if(t===n)return!0;for(var r in n)if(n[r]!==t[r])return!1;return!0}},j.times=function(n,t,r){for(var e=Array(Math.max(0,n)),u=0;n>u;u++)e[u]=t.call(r,u);return e},j.random=function(n,t){return null==t&&(t=n,n=0),n+Math.floor(Math.random()*(t-n+1))},j.now=Date.now||function(){return(new Date).getTime()};var T={escape:{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;"}};T.unescape=j.invert(T.escape);var I={escape:new RegExp("["+j.keys(T.escape).join("")+"]","g"),unescape:new RegExp("("+j.keys(T.unescape).join("|")+")","g")};j.each(["escape","unescape"],function(n){j[n]=function(t){return null==t?"":(""+t).replace(I[n],function(t){return T[n][t]})}}),j.result=function(n,t){if(null==n)return void 0;var r=n[t];return j.isFunction(r)?r.call(n):r},j.mixin=function(n){A(j.functions(n),function(t){var r=j[t]=n[t];j.prototype[t]=function(){var n=[this._wrapped];return a.apply(n,arguments),z.call(this,r.apply(j,n))}})};var N=0;j.uniqueId=function(n){var t=++N+"";return n?n+t:t},j.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var q=/(.)^/,B={"'":"'","\\":"\\","\r":"r","\n":"n","   ":"t","\u2028":"u2028","\u2029":"u2029"},D=/\\|'|\r|\n|\t|\u2028|\u2029/g;j.template=function(n,t,r){var e;r=j.defaults({},r,j.templateSettings);var u=new RegExp([(r.escape||q).source,(r.interpolate||q).source,(r.evaluate||q).source].join("|")+"|$","g"),i=0,a="__p+='";n.replace(u,function(t,r,e,u,o){return a+=n.slice(i,o).replace(D,function(n){return"\\"+B[n]}),r&&(a+="'+\n((__t=("+r+"))==null?'':_.escape(__t))+\n'"),e&&(a+="'+\n((__t=("+e+"))==null?'':__t)+\n'"),u&&(a+="';\n"+u+"\n__p+='"),i=o+t.length,t}),a+="';\n",r.variable||(a="with(obj||{}){\n"+a+"}\n"),a="var __t,__p='',__j=Array.prototype.join,"+"print=function(){__p+=__j.call(arguments,'');};\n"+a+"return __p;\n";try{e=new Function(r.variable||"obj","_",a)}catch(o){throw o.source=a,o}if(t)return e(t,j);var c=function(n){return e.call(this,n,j)};return c.source="function("+(r.variable||"obj")+"){\n"+a+"}",c},j.chain=function(n){return j(n).chain()};var z=function(n){return this._chain?j(n).chain():n};j.mixin(j),A(["pop","push","reverse","shift","sort","splice","unshift"],function(n){var t=e[n];j.prototype[n]=function(){var r=this._wrapped;return t.apply(r,arguments),"shift"!=n&&"splice"!=n||0!==r.length||delete r[0],z.call(this,r)}}),A(["concat","join","slice"],function(n){var t=e[n];j.prototype[n]=function(){return z.call(this,t.apply(this._wrapped,arguments))}}),j.extend(j.prototype,{chain:function(){return this._chain=!0,this},value:function(){return this._wrapped}}),"function"==typeof define&&define.amd&&define("underscore",[],function(){return j})}).call(this);
/*! Tiny Pub/Sub - v0.7.0 - 2013-01-29
* https://github.com/cowboy/jquery-tiny-pubsub
* Copyright (c) 2013 "Cowboy" Ben Alman; Licensed MIT */
(function (n) { var u = n({}); n.subscribe = function () { u.on.apply(u, arguments) }, n.unsubscribe = function () { u.off.apply(u, arguments) }, n.publish = function () { u.trigger.apply(u, arguments) } })(jQuery);
define("pubsub", ["jquery"], function(){});

(function (n, t, i) {  function it(n, t) { t && t.onError && t.onError(n) === !1 || (this.name = "JsRender Error", this.message = n || "JsRender error") } function o(n, t) { var i; n = n || {}; for (i in t) n[i] = t[i]; return n } function ct(n, t, i) { return (!k.rTag || arguments.length) && (a = n ? n.charAt(0) : a, v = n ? n.charAt(1) : v, f = t ? t.charAt(0) : f, h = t ? t.charAt(1) : h, w = i || w, n = "\\" + a + "(\\" + w + ")?\\" + v, t = "\\" + f + "\\" + h, l = "(?:(?:(\\w+(?=[\\/\\s\\" + f + "]))|(?:(\\w+)?(:)|(>)|!--((?:[^-]|-(?!-))*)--|(\\*)))\\s*((?:[^\\" + f + "]|\\" + f + "(?!\\" + h + "))*?)", k.rTag = l + ")", l = new RegExp(n + l + "(\\/)?|(?:\\/(\\w+)))" + t, "g"), et = new RegExp("<.*>|([^\\\\]|^)[{}]|" + n + ".*" + t)), [a, v, f, h, w] } function ei(n, t) { t || (t = n, n = i); var e, f, o, u, r = this, s = !t || t === "root"; if (n) { if (u = r.type === t ? r : i, !u) if (e = r.views, r._.useKey) { for (f in e) if (u = e[f].get(n, t)) break } else for (f = 0, o = e.length; !u && f < o; f++) u = e[f].get(n, t) } else if (s) while (r.parent.parent) u = r = r.parent; else while (r && !u) u = r.type === t ? r : i, r = r.parent; return u } function lt() { var n = this.get("item"); return n ? n.index : i } function oi(n, t) { var u, f = this, r = t && t[n] || (f.ctx || {})[n]; return r = r === i ? f.getRsc("helpers", n) : r, r && typeof r == "function" && (u = function () { return r.apply(f, arguments) }, o(u, r)), u || r } function si(n, t, u) { var h, f, o, e = +u === u && u, s = t.linkCtx; return e && (u = (e = t.tmpl.bnds[e - 1])(t.data, t, r)), o = u.args[0], (n || e) && (f = s && s.tag || { _: { inline: !s }, tagName: n + ":", flow: !0, _is: "tag" }, f._.bnd = e, s && (s.tag = f, u.ctx = c(u.ctx, s.view.ctx)), f.tagCtx = u, u.view = t, f.ctx = u.ctx || {}, delete u.ctx, t._.tag = f, n = n !== "true" && n, n && ((h = t.getRsc("converters", n)) || p("Unknown converter: {{" + n + ":")) && (f.depends = h.depends, o = h.apply(f, u.args)), o = e && t._.onRender ? t._.onRender(o, t, e) : o, t._.tag = i), o } function hi(n, t) { for (var e = this, u = r[n], f = u && u[t]; f === i && e;) u = e.tmpl[n], f = u && u[t], e = e.parent; return f } function ci(n, t, u, f) { var ft, s, et, nt, k, l, tt, it, h, d, y, ot, v, ut, w = "", g = +f === f && f, a = t.linkCtx || 0, b = t.ctx, st = u || t.tmpl, ht = t._; for (n._is === "tag" && (s = n, n = s.tagName), g && (f = (ot = st.bnds[g - 1])(t.data, t, r)), tt = f.length, s = s || a.tag, l = 0; l < tt; l++) h = f[l], y = h.tmpl, y = h.content = y && st.tmpls[y - 1], u = h.props.tmpl, l || u && s || (v = t.getRsc("tags", n) || p("Unknown tag: {{" + n + "}}")), u = u || (s ? s : v).template || y, u = "" + u === u ? t.getRsc("templates", u) || e(u) : u, o(h, { tmpl: u, render: rt, index: l, view: t, ctx: c(h.ctx, b) }), s || (v._ctr ? (s = new v._ctr, ut = !!s.init, s.attr = s.attr || v.attr || i) : s = { render: v.render }, s._ = { inline: !a }, a && (a.attr = s.attr = a.attr || s.attr, a.tag = s, s.linkCtx = a), (s._.bnd = ot || a) && (s._.arrVws = {}), s.tagName = n, s.parent = k = b && b.tag, s._is = "tag", s._def = v), ht.tag = s, h.tag = s, s.tagCtxs = f, s.flow || (d = h.ctx = h.ctx || {}, et = s.parents = d.parentTags = b && c(d.parentTags, b.parentTags) || {}, k && (et[k.tagName] = k), d.tag = s); for (s.rendering = {}, l = 0; l < tt; l++) h = s.tagCtx = f[l], s.ctx = h.ctx, !l && ut && (s.init(h, a, s.ctx), ut = i), (ft = s.render) && (it = ft.apply(s, h.args)), w += it !== i ? it : h.tmpl ? h.render() : ""; return delete s.rendering, s.tagCtx = s.tagCtxs[0], s.ctx = s.tagCtx.ctx, s._.inline && (nt = s.attr) && nt !== "html" && (w = nt === "text" ? wt.html(w) : ""), g && t._.onRender ? t._.onRender(w, t, g) : w } function b(n, t, r, u, f, e, o, s) { var c, l, a, y = t === "array", v = { key: 0, useKey: y ? 0 : 1, id: "" + fi++, onRender: s, bnds: {} }, h = { data: u, tmpl: f, content: o, views: y ? [] : {}, parent: r, ctx: n, type: t, get: ei, getIndex: lt, getRsc: hi, hlp: oi, _: v, _is: "view" }; return r && (c = r.views, l = r._, l.useKey ? (c[v.key = "_" + l.useKey++] = h, a = l.tag, v.bnd = y && (!a || !!a._.bnd && a)) : c.splice(v.key = h.index = e !== i ? e : c.length, 0, h), h.ctx = n || r.ctx), h } function li(n) { var t, i, r, u, f; for (t in y) if (u = y[t], (f = u.compile) && (i = n[t + "s"])) for (r in i) i[r] = f(r, i[r], n, t, u) } function ai(n, t, i) { var u, r; return typeof t == "function" ? t = { depends: t.depends, render: t } : ((r = t.template) && (t.template = "" + r === r ? e[r] || e(r) : r), t.init !== !1 && (u = t._ctr = function () { }, (u.prototype = t).constructor = u)), i && (t._parentTmpl = i), t } function at(r, u, f, o, s, h) { function v(i) { if ("" + i === i || i.nodeType > 0) { try { a = i.nodeType > 0 ? i : !et.test(i) && t && t(n.document).find(i)[0] } catch (u) { } return a && (i = a.getAttribute(ht), r = r || i, i = e[i], i || (r = r || "_" + ui++, a.setAttribute(ht, r), i = e[r] = at(r, a.innerHTML, f, o, s, h))), i } } var l, a; return u = u || "", l = v(u), h = h || (u.markup ? u : {}), h.tmplName = r, f && (h._parentTmpl = f), !l && u.markup && (l = v(u.markup)) && l.fn && (l.debug !== u.debug || l.allowCode !== u.allowCode) && (l = l.markup), l !== i ? (r && !f && (tt[r] = function () { return u.render.apply(u, arguments) }), l.fn || u.fn ? l.fn && (u = r && r !== l.tmplName ? c(h, l) : l) : (u = vt(l, h), ut(l, u)), li(h), u) : void 0 } function vt(n, t) { var i, f = d.wrapMap || {}, r = o({ markup: n, tmpls: [], links: {}, tags: {}, bnds: [], _is: "template", render: rt }, t); return t.htmlTag || (i = ii.exec(n), r.htmlTag = i ? i[1].toLowerCase() : ""), i = f[r.htmlTag], i && i !== f.div && (r.markup = u.trim(r.markup), r._elCnt = !0), r } function vi(n, t) { function u(e, o, s) { var l, h, a, c; if (e && "" + e !== e && !e.nodeType && !e.markup) { for (a in e) u(a, e[a], o); return r } return o === i && (o = e, e = i), e && "" + e !== e && (s = o, o = e, e = i), c = s ? s[f] = s[f] || {} : u, h = t.compile, (l = k.onBeforeStoreItem) && (h = l(c, e, o, h) || h), e ? o === null ? delete c[e] : c[e] = h ? o = h(e, o, s, n, t) : o : o = h(i, o), h && o && (o._is = n), (l = k.onStoreItem) && l(c, e, o, h), o } var f = n + "s"; r[f] = u, y[n] = t } function rt(n, t, f, o, s, h) { var w, ut, nt, v, tt, it, rt, k, y, ft, d, et, a, l = this, ot = !l.attr || l.attr === "html", g = ""; if (o === !0 && (rt = !0, o = 0), l.tag ? (k = l, l = l.tag, ft = l._, et = l.tagName, a = k.tmpl, t = c(t, l.ctx), y = k.content, k.props.link === !1 && (t = t || {}, t.link = !1), f = f || k.view, n = n === i ? f : n) : a = l.jquery && (l[0] || p('Unknown template: "' + l.selector + '"')) || l, a && (!f && n && n._is === "view" && (f = n), f && (y = y || f.content, h = h || f._.onRender, n === f && (n = f.data, s = !0), t = c(t, f.ctx)), f && f.data !== i || ((t = t || {}).root = n), a.fn || (a = e[a] || e(a)), a)) { if (h = (t && t.link) !== !1 && ot && h, d = h, h === !0 && (d = i, h = f._.onRender), u.isArray(n) && !s) for (v = rt ? f : o !== i && f || b(t, "array", f, n, a, o, y, h), w = 0, ut = n.length; w < ut; w++) nt = n[w], tt = b(t, "item", v, nt, a, (o || 0) + w, y, h), it = a.fn(nt, tt, r), g += v._.onRender ? v._.onRender(it, tt) : it; else v = rt ? f : b(t, et || "data", f, n, a, o, y, h), ft && !l.flow && (v.tag = l), g += a.fn(n, v, r); return d ? d(g, v) : g } return "" } function p(n) { throw new r.sub.Error(n); } function s(n) { p("Syntax error\n" + n) } function ut(n, t, i, r) { function v(t) { t -= f, t && h.push(n.substr(f, t).replace(nt, "\\n")) } function c(t) { t && s('Unmatched or missing tag: "{{/' + t + '}}" in template:\n' + n) } function y(e, l, y, w, b, k, d, g, tt, it, rt, ut) { k && (b = ":", w = "html"), it = it || i; var at, st, ht = l && [], ot = "", et = "", ct = "", lt = !it && !b && !d; y = y || b, v(ut), f = ut + e.length, g ? p && h.push(["*", "\n" + tt.replace(dt, "$1") + "\n"]) : y ? (y === "else" && (ti.test(tt) && s('for "{{else if expr}}" use "{{else expr}}"'), ht = u[6], u[7] = n.substring(u[7], ut), u = o.pop(), h = u[3], lt = !0), tt && (tt = tt.replace(nt, " "), ot = ft(tt, ht, t).replace(ni, function (n, t, i) { return t ? ct += i + "," : et += i + ",", "" })), et = et.slice(0, -1), ot = ot.slice(0, -1), at = et && et.indexOf("noerror:true") + 1 && et || "", a = [y, w || !!r || "", ot, lt && [], 'params:"' + tt + '",props:{' + et + "}" + (ct ? ",ctx:{" + ct.slice(0, -1) + "}" : ""), at, ht || 0], h.push(a), lt && (o.push(u), u = a, u[7] = f)) : rt && (st = u[0], c(rt !== st && st !== "else" && rt), u[7] = n.substring(u[7], ut), u = o.pop()), c(!u && rt), h = u[3] } var a, p = t && t.allowCode, e = [], f = 0, o = [], h = e, u = [, , , e]; return n = n.replace(gt, "\\$&"), c(o[0] && o[0][3].pop()[0]), n.replace(l, y), v(n.length), (f = e[e.length - 1]) && c("" + f !== f && +f[7] === f[7] && f[0]), yt(e, i ? n : t, i) } function yt(n, i, r) { var c, f, e, l, a, y, st, ht, ct, lt, ft, p, o, et, v, tt, w, it, at, b, pt, wt, ot, rt, k, h = 0, u = "", g = "", ut = {}, bt = n.length; for ("" + i === i ? (v = r ? 'data-link="' + i.replace(nt, " ").slice(1, -1) + '"' : i, i = 0) : (v = i.tmplName || "unnamed", i.allowCode && (ut.allowCode = !0), i.debug && (ut.debug = !0), p = i.bnds, et = i.tmpls), c = 0; c < bt; c++) if (f = n[c], "" + f === f) u += '\nret+="' + f + '";'; else if (e = f[0], e === "*") u += "" + f[1]; else { if (l = f[1], a = f[2], it = f[3], y = f[4], g = f[5], at = f[7], (wt = e === "else") || (h = 0, p && (o = f[6]) && (h = p.push(o))), (ot = e === ":") ? (l && (e = l === "html" ? ">" : l + e), g && (rt = "prm" + c, g = "try{var " + rt + "=[" + a + "][0];}catch(e){" + rt + '="";}\n', a = rt)) : (it && (tt = vt(at, ut), tt.tmplName = v + "/" + e, yt(it, tt), et.push(tt)), wt || (w = e, pt = u, u = ""), b = n[c + 1], b = b && b[0] === "else"), y += ",args:[" + a + "]}", ot && o || l && e !== ">") { if (k = new Function("data,view,j,u", " // " + v + " " + h + " " + e + "\n" + g + "return {" + y + ";"), k.paths = o, k._ctxs = e, r) return k; ft = 1 } if (u += ot ? "\n" + (o ? "" : g) + (r ? "return " : "ret+=") + (ft ? (ft = 0, lt = !0, 'c("' + l + '",view,' + (o ? (p[h - 1] = k, h) : "{" + y) + ");") : e === ">" ? (ht = !0, "h(" + a + ");") : (ct = !0, "(v=" + a + ")!=" + (r ? "=" : "") + 'u?v:"";')) : (st = !0, "{tmpl:" + (it ? et.length : "0") + "," + y + ","), w && !b) { if (u = "[" + u.slice(0, -1) + "]", (r || o) && (u = new Function("data,view,j,u", " // " + v + " " + h + " " + w + "\nreturn " + u + ";"), o && ((p[h - 1] = u).paths = o), u._ctxs = e, r)) return u; u = pt + '\nret+=t("' + w + '",view,this,' + (h || u) + ");", o = 0, w = 0 } } u = "// " + v + "\nvar j=j||" + (t ? "jQuery." : "js") + "views" + (ct ? ",v" : "") + (st ? ",t=j._tag" : "") + (lt ? ",c=j._cnvt" : "") + (ht ? ",h=j.converters.html" : "") + (r ? ";\n" : ',ret="";\n') + (d.tryCatch ? "try{\n" : "") + (ut.debug ? "debugger;" : "") + u + (r ? "\n" : "\nreturn ret;\n") + (d.tryCatch ? "\n}catch(e){return j._err(e);}" : ""); try { u = new Function("data,view,j,u", u) } catch (kt) { s("Compiled template code:\n\n" + u, kt) } return i && (i.fn = u), u } function ft(n, t, i) { function b(b, k, d, g, nt, tt, it, rt, et, ot, st, ht, ct, lt, at, vt, yt, pt, wt, kt) { function gt(n, i, r, f, o, s, h) { if (i && (t && (u === "linkTo" && (e = t.to = t.to || [], e.push(nt)), (!u || l) && t.push(nt)), i !== ".")) { var c = (r ? 'view.hlp("' + r + '")' : f ? "view" : "data") + (h ? (o ? "." + o : r ? "" : f ? "" : "." + i) + (s || "") : (h = r ? "" : f ? o || "" : i, "")); return c = c + (h ? "." + h : ""), c.slice(0, 9) === "view.data" ? c.slice(5) : c } return n } var dt; if (tt = tt || "", d = d || k || ht, nt = nt || et, ot = ot || yt || "", it) s(n); else return t && vt && !c && !o && (!u || l || e) && (dt = p[r], kt.length - 2 > wt - dt && (dt = kt.slice(dt, wt + 1), vt = v + ":" + dt + f, vt = w[vt] = w[vt] || ut(a + vt + h, i, !0), vt.paths || ft(dt, vt.paths = [], i), (e || t).push({ _jsvOb: vt }))), c ? (c = !ct, c ? b : '"') : o ? (o = !lt, o ? b : '"') : (d ? (r++, p[r] = wt++, d) : "") + (pt ? r ? "" : u ? (u = l = e = !1, "\b") : "," : rt ? (r && s(n), u = nt, l = g, "\b" + nt + ":") : nt ? nt.split("^").join(".").replace(bt, gt) + (ot ? (y[++r] = !0, nt.charAt(0) !== "." && (p[r] = wt), ot) : tt) : tt ? tt : at ? (y[r--] = !1, at) + (ot ? (y[++r] = !0, ot) : "") : st ? (y[r] || s(n), ",") : k ? "" : (c = ct, o = lt, '"')) } var u, e, l, w = i.links, y = {}, p = { 0: -1 }, r = 0, o = !1, c = !1; return (n + " ").replace(kt, b) } function c(n, t) { return n && n !== t ? t ? o(o({}, t), n) : n : t && o({}, t) } function pt(n) { return st[n] || (st[n] = "&#" + n.charCodeAt(0) + ";") } if ((!t || !t.views) && !n.jsviews) { var u, g, l, et, a = "{", v = "{", f = "}", h = "}", w = "^", bt = /^(?:null|true|false|\d[\d.]*|([\w$]+|\.|~([\w$]+)|#(view|([\w$]+))?)([\w$.^]*?)(?:[.[^]([\w$]+)\]?)?)$/g, kt = /(\()(?=\s*\()|(?:([([])\s*)?(?:(\^?)([#~]?[\w$.^]+)?\s*((\+\+|--)|\+|-|&&|\|\||===|!==|==|!=|<=|>=|[<>%*!:?\/]|(=))\s*|([#~]?[\w$.^]+)([([])?)|(,\s*)|(\(?)\\?(?:(')|("))|(?:\s*(([)\]])(?=\s*\.|\s*\^)|[)\]])([([]?))|(\s+)/g, nt = /[ \t]*(\r\n|\n|\r)/g, dt = /\\(['"])/g, gt = /['"\\]/g, ni = /\x08(~)?([^\x08]+)\x08/g, ti = /^if\s/, ii = /<(\w+)[>\s]/, ot = /[\x00`><"'&]/g, ri = ot, ui = 0, fi = 0, st = { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\x00": "&#0;", "'": "&#39;", '"': "&#34;", "`": "&#96;" }, ht = "data-jsv-tmpl", tt = {}, y = { template: { compile: at }, tag: { compile: ai }, helper: {}, converter: {} }, r = { jsviews: "v1.0.0-beta", render: tt, settings: { delimiters: ct, debugMode: !0, tryCatch: !0 }, sub: { View: b, Error: it, tmplFn: ut, parse: ft, extend: o, error: p, syntaxError: s }, _cnvt: si, _tag: ci, _err: function (n) { return d.debugMode ? "Error: " + (n.message || n) + ". " : "" } }; (it.prototype = new Error).constructor = it, lt.depends = function () { return [this.get("item"), "index"] }; for (g in y) vi(g, y[g]); var e = r.templates, wt = r.converters, pi = r.helpers, yi = r.tags, k = r.sub, d = r.settings; t ? (u = t, u.fn.render = rt) : (u = n.jsviews = {}, u.isArray = Array && Array.isArray || function (n) { return Object.prototype.toString.call(n) === "[object Array]" }), u.render = tt, u.views = r, u.templates = e = r.templates, yi({ "else": function () { }, "if": { render: function (n) { var t = this; return t.rendering.done || !n && (arguments.length || !t.tagCtx.index) ? "" : (t.rendering.done = !0, t.selected = t.tagCtx.index, t.tagCtx.render()) }, onUpdate: function (n, t, i) { for (var r, f, u = 0; (r = this.tagCtxs[u]) && r.args.length; u++) if (r = r.args[0], f = !r != !i[u].args[0], !!r || f) return f; return !1 }, flow: !0 }, "for": { render: function (n) { var t = this, f = t.tagCtx, e = !arguments.length, r = "", o = e || 0; return t.rendering.done || (e ? r = i : n !== i && (r += f.render(n), o += u.isArray(n) ? n.length : 1), (t.rendering.done = o) && (t.selected = f.index)), r }, onArrayChange: function (n, t) { var i, u = this, r = t.change; if (this.tagCtxs[1] && (r === "insert" && n.target.length === t.items.length || r === "remove" && !n.target.length || r === "refresh" && !t.oldItems.length != !n.target.length)) this.refresh(); else for (i in u._.arrVws) i = u._.arrVws[i], i.data === n.target && i._.onArrayChange.apply(i, arguments); n.done = !0 }, flow: !0 }, include: { flow: !0 }, "*": { render: function (n) { return n }, flow: !0 } }), wt({ html: function (n) { return n != i ? String(n).replace(ri, pt) : "" }, attr: function (n) { return n != i ? String(n).replace(ot, pt) : n === null ? null : "" }, url: function (n) { return n != i ? encodeURI(String(n)) : n === null ? null : "" } }), ct() } })(this, this.jQuery), function (n, t, i) {  function v(n) { return h(n) ? new nt(n) : new g(n) } function g(n) { return this._data = n, this } function nt(n) { return this._data = n, this } function c(n) { return h(n) ? [n] : n } function b(n) { if (typeof n != "number") throw "Invalid index."; } function ft(n, t) { n = h(n) ? n : [n]; for (var i, u = t, e = u, s = n.length, r = [], o = 0; o < s; o++) { if (i = n[o], f(i)) { y.apply(r, [r.length, 1].concat(ft(i.call(t, t), t))); continue } else if ("" + i !== i) { t = e = i, e !== u && r.push(u = e); continue } e !== u && r.push(u = e), r.push(i) } return r } function et(n, t) { var r, i; for (r in n) { i = !0; break } i || delete w[t] } function k(n, t) { if (!(n.data && n.data.off)) { var r = t.oldValue, i = n.data; n.type === a ? i.cb.array(n, t) : (i.prop === "*" || i.prop === t.path) && (typeof r === p && d(c(r), i.path, i.cb), typeof (r = t.value) === p && e(c(r), i.path, i.cb), i.cb(n, t)) } } function e() { function ni(i, f, e, o) { var h = ut(n), y = c(n); if (u = 0, b || o) h && (t(y).off(i, k), u && delete u[t.data(n, "obId")]); else { if (s = h && t._data(n)) for (s = s && s.events, s = s && s[e ? a : l], yt = s && s.length; yt--;) if ((tt = s[yt].data) && tt.cb === r) { if (e) return; f === "*" && tt.prop !== f && (t(n).off(i + "." + tt.prop, k), u && delete u[t.data(n, "obId")]) } t(y).on(i, null, e ? { cb: r } : { path: f, prop: v, cb: r }, k); kt && (kt[t.data(n, "obId") || t.data(n, "obId", ht++)] = n) } } function fi(n, t) { n._ob = it(n, lt); var i = lt; return function () { var u = n._ob, f = t.length; typeof u === p && (gt(u, !0), f && d(c(u), t, r, it)), u = n._ob = it(n, i), typeof u === p && (gt(u), f && e(c(u), t, r, it, i)) } } function gt(t, u) { if (r && r.array && h(t)) { var f = n; n = t, ni(a + ".observe.obs" + r._bnd, i, !0, u), n = f } } var vt, nt, v, o, wt, n, b, r, bt, yt, tt, s, it, ti, kt, dt, ri, ui = 1, ii = rt, g = ot.apply([], arguments), st = g.pop(), lt = g[0], pt = "" + lt !== lt ? g.shift() : i, at = g.length; for (lt = pt, f(st) ? r = st : (st === !0 ? b = st : st && (lt = st, ui = 0), st = g[at - 1], (at && st === i || f(st)) && (r = g.pop(), at--)), f(g[at - 1]) && (it = r, r = g.pop(), at--), ii += b ? r ? ".obs" + r._bnd : "" : ".obs" + (bt = r._bnd = r._bnd || ct++), b && at === 0 && pt && t(pt).off(rt, k), b || (kt = w[bt] = w[bt] || {}), dt = 0, vt = 0; vt < at; vt++) { if (o = g[vt], gt(n, b), n = pt, "" + o === o) { if (nt = o.split("^"), nt[1] && (dt = nt[0].split(".").length, o = nt.join("."), dt = o.split(".").length - dt), it && (ti = it(o, pt))) { at += ti.length - 1, y.apply(g, [vt--, 1].concat(ti)); continue } nt = o.split(".") } else ui && !f(o) && (o._jsvOb && (b || (o._cb = ri = fi(o, g.slice(vt + 1)), o._rt = lt, ri._bnd = r._bnd), e(o._rt, g.slice(0, vt), o._cb, it, b), o = o._ob), n = o), pt = o, nt = [pt]; while (n && typeof n == "object" && (v = nt.shift()) !== i) { if ("" + v === v) { if (v === "") continue; if (nt.length < dt + 1 && !n.nodeType) { if (!b && (s = ut(n) && t._data(n))) { for (s = s.events, s = s && s.propertyChange, yt = s && s.length; yt--;) if (tt = s[yt].data, tt && tt.cb === r && (tt.prop === v && tt.path === nt.join(".") || tt.prop === "*")) break; if (yt > -1) { n = n[v]; continue } } if (v === "*") { f(n) ? (wt = n.depends) && e(wt, r, b || lt) : ni(ii, v); break } else !v || f(wt = n[v]) && wt.depends || ni(ii + "." + v, nt.join(".")) } v = v ? n[v] : n } if (f(v)) { (wt = v.depends) && e(n, ft(wt, n), r, it, b || c(lt)); break } n = v } } return gt(n, b), bt && et(kt, bt), { cbId: bt, bnd: kt, leaf: n } } function d() { return [].push.call(arguments, !0), e.apply(this, arguments) } if (!t) throw "requires jQuery or JsRender"; if (!t.observable) { var u, tt, o, r, it = t.event.special, s = t.views ? t.views.sub : {}, y = [].splice, ot = [].concat, h = t.isArray, st = t.expando, p = "object", l = s.propChng = s.propChng || "propertyChange", a = s.arrChng = s.arrChng || "arrayChange", w = s._cbBnds = s._cbBnds || {}, rt = l + ".observe", f = t.isFunction, ht = 1, ct = 1, ut = t.hasData; t.observable = v, v.Object = g, v.Array = nt, v.observe = e, v.unobserve = d, g.prototype = { _data: null, data: function () { return this._data }, observe: function (n, t) { return e(this._data, n, t) }, unobserve: function (n, t) { return d(this._data, n, t) }, setProperty: function (n, t, r) { var u, s, o, f = this, e = f._data; if (n = n || "", e) if (h(n)) for (u = n.length; u--;) s = n[u], f.setProperty(s.name, s.value, r === i || r); else if ("" + n !== n) for (u in n) f.setProperty(u, n[u], t); else if (n.indexOf(st) < 0) { for (o = n.split(".") ; e && o.length > 1;) e = e[o.shift()]; f._setProperty(e, o.join("."), t, r) } return f }, _setProperty: function (n, t, i, r) { var e, o, u = t ? n[t] : n; f(u) && u.set && (o = u, e = u.set === !0 ? u : u.set, u = u.call(n)), (u !== i || r && u != i) && (!(u instanceof Date) || u > i || u < i) && (e ? (e.call(n, i), i = o.call(n)) : n[t] = i, this._trigger(n, { path: t, value: i, oldValue: u })) }, _trigger: function (n, i) { t(n).triggerHandler(l, i) } }, nt.prototype = { _data: null, data: function () { return this._data }, insert: function (n, t) { return b(n), arguments.length > 1 && (t = h(t) ? t : [t], t.length && this._insert(n, t)), this }, _insert: function (n, t) { r = this._data, o = r.length, y.apply(r, [n, 0].concat(t)), this._trigger({ change: "insert", index: n, items: t }) }, remove: function (n, t) { if (b(n), t = t === i || t === null ? 1 : t, t && n > -1) { var r = this._data.slice(n, n + t); t = r.length, t && this._remove(n, t, r) } return this }, _remove: function (n, t, i) { r = this._data, o = r.length, r.splice(n, t), this._trigger({ change: "remove", index: n, items: i }) }, move: function (n, t, r) { if (b(n), b(t), r = r === i || r === null ? 1 : r, r) { var u = this._data.slice(n, n + r); this._move(n, t, r, u) } return this }, _move: function (n, t, i, u) { r = this._data, o = r.length, r.splice(n, i), r.splice.apply(r, [t, 0].concat(u)), this._trigger({ change: "move", oldIndex: n, index: t, items: u }) }, refresh: function (n) { var t = this._data.slice(0); return this._refresh(t, n), this }, _refresh: function (n, t) { r = this._data, o = r.length, y.apply(r, [0, r.length].concat(t)), this._trigger({ change: "refresh", oldItems: n }) }, _trigger: function (n) { var i = r.length, u = t([r]); u.triggerHandler(a, n), i !== o && u.triggerHandler(l, { path: "length", value: i, oldValue: o }) } }, it[l] = it[a] = { remove: function (n) { (n = n.data) && (n.off = 1, n = n.cb) && (u = w[tt = n._bnd]) }, teardown: function () { u && (delete u[t.data(this, "obId")], et(u, tt)) } } } }(this, this.jQuery || this.jsviews), function (n, t, i) {  function bi(n) { var p, w, v, h, f, c, a, l, b, s, k, g, tt, ut, it, rt, u, y = n.target, o = y._jsvBnd; if (o) for (g = o.slice(1).split("&"), tt = g.length; tt--;) (k = e[g[tt]]) && (o = k.to) && (h = k.linkCtx, s = h.view, u = h.tag, b = t(y), it = s.hlp(lt, h.ctx), rt = s.hlp(at, h.ctx), v = bt(y), p = li[v], f = d(v) ? v(y) : p ? b[p]() : b.attr(v), a = o[1], o = o[0], a && (d(a) ? c = a : (c = s.tmpl.converters, c = c && c[a] || r.converters[a])), c && (f = c.call(u, f)), ut = s.linkCtx, s.linkCtx = h, it && (w = it.call(s, n, f) === !1) || u && u.onBeforeChange && (w = u.onBeforeChange(n, f) === !1) || f === i || (u && u.onChange && (f = u.onChange(f)), l = o[0], f !== i && l && (l = l._jsvOb ? l._ob : l, u && (u._.chging = !0), nt(l).setProperty(o[2] || o[1], f), u && delete u._.chging, rt && rt.call(h, n))), s.linkCtx = ut, w && n.stopImmediatePropagation()) } function iu(n, u, f) { var o, w, b, e, tt, s, it, rt, ut, c = this, v = c.data, l = c.elem, a = c.convert, y = "attr", ft = l.parentNode, et = ft, p = t(l), h = c.view, ot = h.ctx, k = h.linkCtx, nt = h.hlp(lt); if (h.linkCtx = c, h.ctx = c.ctx, ft && (!nt || !(u && nt.call(c, n, u) === !1)) && !(u && n.data.prop !== "*" && n.data.prop !== u.path)) { if (u && (c.eventArgs = u), !n || u || c._initVal) { if (delete c._initVal, e = f.call(h.tmpl, v, h, r), o = c.attr || bt(l, !0, a !== i), s = c.tag) { if (s._.chging || u && s.onUpdate && s.onUpdate(n, u, e) === !1 || o === "none") { kt(c, v, l), h.linkCtx = k; return } e = s.tagName.slice(-1) === ":" ? r._cnvt(s.tagName.slice(0, -1), h, e) : r._tag(s, h, h.tmpl, e) } else f._ctxs && (a = a === "" ? "true" : a, e = a ? r._cnvt(a, h, e) : r._tag(f._ctxs, h, h.tmpl, e), s = h._.tag, o = c.attr || o); if (s && (s.parentElem = c.expr || s._elCnt ? l : l.parentNode, it = s._prv, rt = s._nxt, o = s.attr || o, s.refresh = or), d(e) && g(c.expr + ": missing parens"), o === "visible" && (o = "css-display", e = e ? ru(l) : "none"), tt = o.lastIndexOf("css-", 0) === 0 && o.substr(4)) (b = t.style(l, tt) !== e) && t.style(l, tt, e); else if (o !== "link") { if (o === "value") l.type === "checkbox" && (e = e && e !== "false", y = "prop", o = "checked"); else if (o === "radio") if (l.value === "" + e) e = !0, y = "prop", o = "checked"; else { kt(c, v, l), h.linkCtx = k; return } else (o === "selected" || o === "disabled" || o === "multiple" || o === "readlonly") && (e = e && e !== "false" ? o : null); if (w = li[o], w) { if (b = s || p[w]() !== e) if (o === "html") if (s) { if (ut = s._.inline, s.refresh(e), !ut && s._.inline) { h.linkCtx = k; return } } else p.empty(), et = l, h.link(v, et, it, rt, e, s && { tag: s._tgId }); else o !== "text" || l.children[0] ? p[w](e) : l.textContent !== i ? l.textContent = e : l.innerText = e === null ? "" : e } else (b = p[y](o) != e) && p[y](o, e === i && y === "attr" ? null : e) } u && b && (nt = h.hlp(at)) && nt.call(c, n, u) } kt(c, v, l), h.linkCtx = k, h.ctx = ot } } function ki(n, t) { var i = this, r = i.hlp(lt), u = i.hlp(at); if (!r || r.call(n, t) !== !1) { if (t) { var o = t.change, f = t.index, e = t.items; switch (o) { case "insert": i.addViews(f, e); break; case "remove": i.removeViews(f, e.length); break; case "move": i.refresh(); break; case "refresh": i.refresh() } } u && u.call(this, n, t) } } function ru(t) { var i, u, e = n.getComputedStyle, r = (t.currentStyle || e.call(n, t, "")).display; return r !== "none" || (r = yi[u = t.nodeName]) || (i = f.createElement(u), f.body.appendChild(i), r = (e ? e.call(n, i, "") : i.currentStyle).display, yi[u] = r, f.body.removeChild(i)), r } function wt(n) { var f, e, u = n.data, r = n._.bnd; if (!n._.useKey && r) if ((e = n._.bndArr) && (t([e[1]]).off(ct, e[0]), n._.bndArr = i), r !== !!r && r._.inline) u ? r._.arrVws[n._.id] = n : delete r._.arrVws[n._.id]; else if (u) { f = function (t) { t.data && t.data.off || ki.apply(n, arguments) }; t([u]).on(ct, f); n._.bndArr = [f, u] } } function bt(n, t, i) { var u = n.nodeName.toLowerCase(), r = o.merge[u]; return r ? t ? u === "input" && n.type === "radio" ? "radio" : r.to.toAttr : r.from.fromAttr : t ? i ? "text" : "html" : "" } function di(n, r, u, f, e, o, s) { var p, c, v, w, b, l = n.parentElem, h = n._prv, a = n._nxt, y = n._elCnt; if (h && h.parentNode !== l && g("Missing parentNode"), s) { w = n.nodes(), y && h && h !== a && ti(h, a, l, n._.id, "_", !0), n.removeViews(i, i, !0), c = a, y && (h = h ? h.previousSibling : a ? a.previousSibling : l.lastChild), t(w).remove(); for (b in n._.bnds) ot(b) } else { if (r) { if (v = f[r - 1], !v) return !1; h = v._nxt } y ? (c = h, h = c ? c.previousSibling : l.lastChild) : c = h.nextSibling } p = u.render(e, o, n, s || r, n._.useKey && s, !0), n.link(e, l, h, c, p, v) } function it(n, t, r) { var u, f, o; return r ? (o = "^`", f = t._.tag || { _: { inline: !0, bnd: r }, tagCtx: { view: t }, flow: !0 }, u = f._tgId, f.refresh = or, u || (e[u = pi++] = f, f._tgId = "" + u)) : (o = "_`", l[u = t._.id] = t), "#" + u + o + (n === i ? "" : n) + "/" + u + o } function kt(n, r, u) { var o, l, h = n.linkedElem, a = n.convertBack, c = n.tag, f = [], s = n._bndId || "" + pi++, v = n._hdlr; if (delete n._bndId, c && (f = c.depends || f, f = d(f) ? c.depends(c) : f), !n._depends || "" + n._depends != "" + f) { if (n._depends && ei(r, n._depends, v, !0), o = ei(t.isArray(r) ? [r] : r, n.fn.paths || n.fn, f, v, n._ctxCb), o.elem = u, o.linkCtx = n, o._tgId = s, u._jsvBnd = u._jsvBnd || "", u._jsvBnd += "&" + s, h) for (o.to = [[], a], l = h.length; l--;) h[l]._jsvBnd = u._jsvBnd; n._depends = f, n.view._.bnds[s] = s, e[s] = o, (h || a !== i) && er(o, a) } } function gi(n, t, i, r, u, f) { return dt(this, n, t, i, r, u, f) } function dt(n, r, u, e, o, s, c) { if (n && r) { if (r = r.jquery ? r : t(r), !p) { p = f.body; t(p).on(si, bi) } for (var w, g, nt, d, y, b, a, k, tt, ut = it, et = e && e.target === "replace", ft = r.length; ft--;) if (a = r[ft], "" + n === n) y = v(a), k = y.ctx, y.ctx = e, rt(n, a, v(a), u), y.ctx = k; else { if (o = o || v(a), n.markup !== i) o.link === !1 && (e = e || {}, e.link = ut = !1), et && (b = a.parentNode), nt = n.render(u, e, o, i, i, ut), b ? (s = a.previousSibling, c = a.nextSibling, t.cleanData([a], !0), b.removeChild(a), a = b) : (s = c = i, t(a).empty()); else if (n !== !0) break; if (a._dfr && !c) { for (d = h(a._dfr, !0, wi), w = 0, g = d.length; w < g; w++) y = d[w], (y = l[y.id]) && y.data !== i && y.parent.removeViews(y._.key, i, !0); a._dfr = "" } tt = o.data, k = o.ctx, o.data = u, o.ctx = e, o.link(u, a, s, c, nt), o.data = tt, o.ctx = k } } return r } function uu(n, r, u, a, p, w) { function ou(n, t, i, r, u, f, e, o, s, h, l, a) { var v = ""; return b = o || s || "", r = r || i || h || a, r && (fi && (i || a) && !wr[lt] && vr("'<" + lt + "... />' in:\n" + p), bi = ft, lt = dr.shift(), ft = pt[lt], bi && (ct += at, at = "", ft ? ct += "-" : (v = (h || "") + ci + "@" + ct + hi + (l || ""), ct = fu.shift()))), ft ? (f ? at += f : t = h || a || "", b && (t += b, at && (t += " " + c + '="' + at + '"', at = ""))) : t = f ? t + v + u + ci + f + hi + e + b : v || n, b && (dr.unshift(lt), lt = b.slice(1), dr[0] === pr[lt] && g('"' + lt + '" has incorrect parent tag'), (ft = pt[lt]) && !bi && (fu.unshift(ct), ct = ""), bi = ft, ct && ft && (ct += "+")), t } function si(n, t) { var s, a, u, o, f, v, h, c = []; if (n) { for (bt = n.length, n.tokens.charAt(0) === "@" && (t = d.previousSibling, d.parentNode.removeChild(d), d = null), bt = n.length; bt--;) { if (ot = n[bt], u = ot.ch, s = ot.path) for (et = s.length - 1; a = s.charAt(et--) ;) a === "+" ? s.charAt(et) === "-" ? (et--, t = t.previousSibling) : t = t.parentNode : t = t.lastChild; u === "^" ? (b = e[f = ot.id]) && (h = t && (!d || d.parentNode !== t), (!d || h) && (b.parentElem = t), ot.elCnt && (ot.open ? t && (t._dfr = "#" + f + u + (t._dfr || "")) : h && (t._dfr = "/" + f + u + (t._dfr || ""))), c.push([h ? null : d, ot])) : (nt = l[f = ot.id]) && (nt.link || (nt.parentElem = t || d && d.parentNode || r, k(nt, st), nt._.onRender = it, nt._.onArrayChange = ki, wt(nt)), o = nt.parentElem, ot.open ? (nt._elCnt = ot.elCnt, t ? t._dfr = "#" + f + u + (t._dfr || "") : (nt._prv || (o._dfr = ut(o._dfr, "#" + f + u)), nt._prv = d)) : (t && (!d || d.parentNode !== t) ? (t._dfr = "/" + f + u + (t._dfr || ""), nt._nxt = i) : d && (nt._nxt || (o._dfr = ut(o._dfr, "/" + f + u)), nt._nxt = d), ui = nt.linkCtx, (v = cu || nt.ctx && nt.ctx.onAfterCreate) && v.call(ui, nt))) } for (bt = c.length; bt--;) gi.push(c[bt]) } return !n || n.elCnt } function su(n) { var t, i; if (bt = n && n.length) for (et = 0; et < bt; et++) if (ot = n[et], vt.id) vt.id = vt.id !== ot.id && vt.id; else if (i = b = e[ot.id].linkCtx.tag, !b.flow) { if (!sr) { for (t = 1; i = i.parent;) t++; pi = pi || t } (sr || t === pi) && (!hr || b.tagName === hr) && or.push(b) } } function gr() { for (nr = yt ? r.querySelectorAll(tt) : t(tt, r).get(), ti = nr.length, u && (li = yt ? u.querySelectorAll(tt) : t(tt, u).get(), u = li.length ? li[li.length - 1] : u), pi = 0, kt = 0; kt < ti; kt++) if (d = nr[kt], u && !ru) ru = d === u; else if (a && d === a) break; else d.parentNode && eu(h(d, i, or && nu)) && d.getAttribute(y) && gi.push([d]); if (tr(u, ft), tr(a, ft), vt) { dt && dt.resolve(); return } for (ft && ct + at && (d = a, ct && (a ? si(h(ct + "+", !0), a) : si(h(ct, !0), r)), si(h(at, !0), r), a && (ht = a.getAttribute(c), (ti = ht.indexOf(di) + 1) && (ht = ht.slice(ti + di.length - 1)), a.setAttribute(c, at + ht))), ti = gi.length, kt = 0; kt < ti; kt++) d = gi[kt], ni = d[1], d = d[0], ni ? (b = e[ni.id], ui = b.linkCtx, b = ui ? ui.tag : b, ni.open ? (d && (b.parentElem = d.parentNode, b._prv = d), b._elCnt = ni.elCnt, !b || b.onBeforeLink && b.onBeforeLink() === !1 || b._.bound || (b._.bound = !0, nt = b.tagCtx.view, rt(i, b._prv, nt, nt.data || n, ni.id)), b._.linking = !0) : (b._nxt = d, b._.linking && (lr = b.tagCtx, nt = lr.view, b.contents = rr, b.nodes = ur, b.childTags = fr, delete b._.linking, gt(b, lr), b._.bound || (b._.bound = !0, rt(i, b._prv, nt, nt.data || n, ni.id))))) : (nt = v(d), rt(d.getAttribute(y), d, nt, nt.data || n)); dt && dt.resolve() } var ui, b, kt, ti, et, bt, nr, d, nt, ot, ni, li, ai, er, yi, ii, or, sr, hr, lr, pi, vt, tu, ar, iu, ei, lt, oi, wi, ht, ft, bi, ri, at, di, ru, dt, hu = o.noDomLevel0, br = this, uu = br._.id + "_", ct = "", gi = [], dr = [], fu = [], cu = br.hlp(cr), eu = si; if (w && (dt = w.lazyLink && t.Deferred(), w.tmpl ? er = "/" + w._.id + "_" : (vt = w.get, w.tag && (uu = w.tag + "^", w = !0)), w = w === !0), vt && (eu = su, or = vt.tags, sr = vt.deep, hr = vt.name), r = r ? "" + r === r ? t(r)[0] : r.jquery ? r[0] : r : br.parentElem || f.body, lt = r.tagName.toLowerCase(), ft = !!pt[lt], u = u && ir(u, ft), a = a && ir(a, ft) || null, p !== i) { if (wi = f.createElement("div"), oi = wi, di = at = "", ri = r.namespaceURI === "http://www.w3.org/2000/svg" ? "svg" : (ei = yr.exec(p)) && ei[1] || "", hu && ei && ei[2] && g("Unsupported: " + ei[2]), ft) { for (ii = a; ii && !(yi = h(ii)) ;) ii = ii.nextSibling; (ht = yi ? yi.tokens : r._dfr) && (ai = er || "", (w || !er) && (ai += "#" + uu), et = ht.indexOf(ai), et + 1 && (et += ai.length, di = at = ht.slice(0, et), ht = ht.slice(et), yi ? ii.setAttribute(c, ht) : r._dfr = ht)) } for (p = ("" + p).replace(kr, ou), vi.appendChild(wi), ri = s[ri] || s.div, tu = ri[0], oi.innerHTML = ri[1] + p + ri[2]; tu--;) oi = oi.lastChild; for (vi.removeChild(wi), ar = f.createDocumentFragment() ; iu = oi.firstChild;) ar.appendChild(iu); r.insertBefore(ar, a) } return dt ? setTimeout(gr, 0) : gr(), dt && dt.promise() } function rt(n, t, r, f, o) { var y, l, p, h, k, d, a, v, c, s, g; if (o) s = e[o], s = s.linkCtx ? s.linkCtx.tag : s, c = s.linkCtx || { data: f, elem: s._elCnt ? s.parentElem : t, view: r, ctx: r.ctx, attr: "html", fn: s._.bnd, tag: s, _bndId: o }, nr(c, c.fn); else if (n && t) for (y = r.tmpl, n = fu(n, t), w.lastIndex = 0; l = w.exec(n) ;) g = w.lastIndex, p = o ? "html" : l[1], a = l[3], k = l[10], h = i, c = { data: f, elem: s && s._elCnt ? s.parentElem : t, view: r, ctx: r.ctx, attr: p, _initVal: !l[2] }, l[6] && (!p && (h = /:([\w$]*)$/.exec(k)) && (h = h[1], h !== i && (d = -h.length - 1, a = a.slice(0, d - 1) + b, k = k.slice(0, d))), h === null && (h = i), c.convert = l[5] || ""), c.expr = p + a, v = y.links[a], v || (y.links[a] = v = u.tmplFn(ii + a + ri, y, !0, h), u.parse(k, v.paths = [], y)), c.fn = v, p || h === i || (c.convertBack = h), nr(c, v), w.lastIndex = g } function nr(n, t) { function i(i, r) { iu.call(n, i, r, t) } n._ctxCb = eu(n.view), n._hdlr = i, n.tag && n.tag.onArrayChange && (i.array = function (t, i) { n.tag.onArrayChange(t, i) }), i(!0) } function ut(n, t) { var i; return n ? (i = n.indexOf(t), i + 1 ? n.slice(0, i) + n.slice(i + t.length) : n) : "" } function ft(n) { return n && ("" + n === n ? n : n.tagName === "SCRIPT" ? n.type.slice(3) : n.nodeType === 1 && n.getAttribute(c) || "") } function h(n, t, i) { function e(n, t, i, r, e, o) { u.push({ elCnt: f, id: r, ch: e, open: t, close: i, path: o, token: n }) } var f, r, u = []; if (r = t ? n : ft(n)) return u.elCnt = !n.type, f = r.charAt(0) === "@" || !n.type, u.tokens = r, r.replace(i || tu, e), u } function tr(n, t) { n && (n.type === "jsv" ? n.parentNode.removeChild(n) : t && n.getAttribute(y) === "" && n.removeAttribute(y)) } function ir(n, t) { for (var i = n; t && i && i.nodeType !== 1;) i = i.previousSibling; return i && (i.nodeType !== 1 ? (i = f.createElement("SCRIPT"), i.type = "jsv", n.parentNode.insertBefore(i, n)) : ft(i) || i.getAttribute(y) || i.setAttribute(y, "")), i } function fu(n, i) { return n = t.trim(n), n.slice(-1) !== b ? n = ht + ":" + n + (bt(i) ? ":" : "") + b : n } function rr(n, i) { var u, r = t(this.nodes()); return r[0] && (u = n ? r.filter(n) : r, r = i && n ? u.add(r.find(n)) : u), r } function ur(n, t, i) { var r, u = this, f = u._elCnt, o = !t && f, e = []; for (t = t || u._prv, i = i || u._nxt, r = o ? t === u._nxt ? u.parentElem.lastSibling : t : u._.inline === !1 ? t || u.linkCtx.elem.firstChild : t && t.nextSibling; r && (!i || r !== i) ;) (n || f || !ft(r)) && e.push(r), r = r.nextSibling; return e } function fr(n, t) { n !== !!n && (t = n, n = i); var r = this, o = r.link ? r : r.tagCtx.view, u = r._prv, f = r._elCnt, e = []; return u && o.link(i, r.parentElem, f ? u.previousSibling : u, r._nxt, i, { get: { tags: e, deep: n, name: t, id: f && r._tgId } }), e } function gt(n, t) { var f, o, i, h, s, c, l, a, u = n.linkCtx = n.linkCtx || { tag: n, data: t.view.data }; if (n.onAfterLink) n.onAfterLink(t, u); if ((o = u.linkedElem) && (i = o[0])) { if (h = i.type === "radio", f = u.convert, s = f ? d(f) ? f(t.args[0]) : r._cnvt(f, t.view, t) : t.args[0], i !== u.elem) for (a = o.length; a--;) { if (i = o[a], i._jsvLnkdEl = !0, n._.inline) for (i._jsvBnd = u.elem ? u.elem._jsvBnd : n._prv._jsvBnd, c = i._jsvBnd.slice(1).split("&"), l = c.length; l--;) er(e[c[l]], u.convertBack); h && (i.checked = s === i.value) } h || (i.type === "checkbox" ? i.checked = s && s !== "false" : o.val(s)) } } function er(n, t) { var e, u, r, o, f = n.linkCtx, s = f.data, i = f.fn.paths; if (n) { for ((e = i.to) && (i = e), u = i.length; u && "" + (r = i[--u]) !== r;); r ? (r = i[u] = r.split("^").join("."), n.to = r.charAt(0) === "." ? [[o = i[u - 1], r.slice(1)], t] : [f._ctxCb(i[0]) || [s, i[0]], t], e && o && (n.to[0][0] = f._ctxCb(o, s))) : n.to = [[], t] } } function or(n) { var l, a, s, u = this, h = u.parentElem, c = u.tagCtx, f = c.view, e = u._prv, o = u._nxt, p = u._elCnt, v = u._.inline, y = c.props; return u.disposed && g("Removed tag"), n === i && (n = u._.bnd.call(f.tmpl, f.data, f, r), v && (n = r._tag(u, f, f.tmpl, n))), (u.flow || u.render || u.tagCtx.tmpl) && (v ? (a = u.nodes(!0), p && (e && e !== o && ti(e, o, h, u._tgId, "^", !0), e = e ? e.previousSibling : o ? o.previousSibling : h.lastChild), t(a).remove()) : (!u.flow && y.inline && (f._.tag = u, n = it(n, f, !0), f._.tag = i, l = u._.inline = !0), t(h).empty())), !l && u.onBeforeLink && u.onBeforeLink(), s = f.link(f.data, h, e, o, n, u && { tag: u._tgId, lazyLink: y.lazyLink }), !l && (u.onAfterLink || u.onLinkedInit) && (s ? s.then(function () { gt(u, c) }) : gt(u, c)), s || u } function et(n) { for (var e, o, c, r, s, t, u, a = [], v = n.length, f = v; f--;) a.push(n[f]); for (f = v; f--;) if (r = a[f], r.parentNode) { if ((u = r._jsvBnd) && !r._jsvLnkdEl) for (u = u.slice(1).split("&"), r._jsvBnd = "", o = u.length; o--;) ot(u[o]); if (s = h(ft(r) + (r._dfr || ""), !0, dr)) for (e = 0, c = s.length; e < c; e++) t = s[e], t.ch === "_" ? (t = l[t.id]) && t.data !== i && t.parent.removeViews(t._.key, i, !0) : ot(t.id) } } function ot(n) { var s, h, i, f, o, r = e[n]; if (r) { for (s in r.bnd) f = r.bnd[s], o = ".obs" + r.cbId, t.isArray(f) ? t([f]).off(ct + o).off(oi + o) : t(f).off(oi + o), delete r.bnd[s]; h = r.linkCtx, (i = h.tag) && (i.onDispose && i.onDispose(), i._elCnt || (i._prv && i._prv.parentNode.removeChild(i._prv), i._nxt && i._nxt.parentNode.removeChild(i._nxt)), i.disposed = !0), delete h.view._.bnds[n], delete e[n], delete u._cbBnds[r.cbId] } } function ni(n, r) { return arguments.length ? r && (r = r.jquery ? r : t(r), n === !0 ? t.each(r, function () { for (var n; (n = v(this, !0)) && n.parent;) n.parent.removeViews(n._.key, i, !0); et(this.getElementsByTagName("*")) }) : n === i && et(r)) : (p && (t(p).off(si, bi), p = i), n = !0, a.removeViews(), et(f.body.getElementsByTagName("*"))), r } function sr(n, t) { return ni(this, n, t) } function eu(n) { return n = n || t.view(), function (t, i) { var f, u, e = [i]; if (n && t) { if (t._jsvOb) return t._jsvOb.call(n.tmpl, i, n, r); if (t.charAt(0) === "~") return t.slice(0, 4) === "~tag" && (u = n.ctx, t.charAt(4) === "." && (f = t.slice(5).split("."), u = u.tag), f) ? u ? [u, f.join("."), i] : [] : (t = t.slice(1).split("."), (i = n.hlp(t.shift())) && (t.length && e.unshift(t.join(".")), e.unshift(i)), i ? e : []); if (t.charAt(0) === "#") return t === "#data" ? [] : [n, t.replace(br, ""), i] } } } function ou(n) { return n.type === "checkbox" ? n.checked : n.value } function ti(n, t, i, r, u, f) { var y, a, p, s, b, v, o, w = 0, k = n === t; if (n) { for (p = h(n) || [], y = 0, a = p.length; y < a; y++) { if (s = p[y], v = s.id, v === r && s.ch === u) if (f) a = 0; else break; k || (b = s.ch === "_" ? l[v] : e[v].linkCtx.tag, s.open ? b._prv = t : s.close && (b._nxt = t)), w += v.length + 2 } w && n.setAttribute(c, n.getAttribute(c).slice(w)), o = t ? t.getAttribute(c) : i._dfr, (a = o.indexOf("/" + r + u) + 1) && (o = p.tokens.slice(0, w) + o.slice(a + (f ? -1 : r.length + 1))), o && (t ? t.setAttribute(c, o) : i._dfr = o) } else i._dfr = ut(i._dfr, "#" + r + u), f || t || (i._dfr = ut(i._dfr, "/" + r + u)) } if (!t) throw "requires jQuery"; if (!t.views) throw "requires JsRender"; if (!t.observable) throw "requires jquery.observable"; if (!t.link) { var st, p, v, w, ii, ht, b, ri, ui, fi, f = n.document, r = t.views, u = r.sub, o = r.settings, k = u.extend, a = u.View(i, "top"), d = t.isFunction, hr = r.templates, nt = t.observable, ei = nt.observe, c = "data-jsv", y = o.linkAttr || "data-link", oi = o.propChng = o.propChng || "propertyChange", ct = u.arrChng = u.arrChng || "arrayChange", su = u._cbBnds = u._cbBnds || {}, si = "change.jsv", lt = "onBeforeChange", at = "onAfterChange", cr = "onAfterCreate", hi = '"><\/script>', ci = '<script type="jsv', vt = "script,[" + c + "]", tt = vt + ",[" + y + "]", li = { value: "val", input: "val", html: "html", text: "text" }, ai = { from: { fromAttr: "value" }, to: { toAttr: "value" } }, lr = t.cleanData, ar = o.delimiters, g = u.error, vr = u.syntaxError, yr = /<(?!script)(\w+)(?:[^>]*(on\w+)\s*=)?[^>]*>/, vi = f.createDocumentFragment(), yt = f.querySelector, pt = { ol: 1, ul: 1, table: 1, tbody: 1, thead: 1, tfoot: 1, tr: 1, colgroup: 1, dl: 1, select: 1, optgroup: 1 }, pr = { tr: "table" }, s = o.wrapMap = { option: [1, "<select multiple='multiple'>", "<\/select>"], legend: [1, "<fieldset>", "<\/fieldset>"], thead: [1, "<table>", "<\/table>"], tr: [2, "<table><tbody>", "<\/tbody><\/table>"], td: [3, "<table><tbody><tr>", "<\/tr><\/tbody><\/table>"], col: [2, "<table><tbody><\/tbody><colgroup>", "<\/colgroup><\/table>"], area: [1, "<map>", "<\/map>"], svg: [1, "<svg>", "<\/svg>"], div: [1, "x<div>", "<\/div>"] }, wr = { br: 1, img: 1, input: 1, hr: 1, area: 1, base: 1, col: 1, link: 1, meta: 1, command: 1, embed: 1, keygen: 1, param: 1, source: 1, track: 1, wbr: 1 }, yi = {}, l = { 0: a }, e = {}, pi = 1, br = /^#(view\.?)?/, kr = /(^|(\/>)|(<\/\w+>)|>|)(\s*)([#\/]\d+[_^])`(\s*)(<\w+(?=[\s\/>]))?|\s*(?:(<\w+(?=[\s\/>]))|(<\/\w+>)(\s*)|(\/>)\s*)/g, wi = /(#)()(\d+)(_)/g, dr = /(#)()(\d+)([_^])/g, gr = /(?:(#)|(\/))(\d+)(_)/g, nu = /(#)()(\d+)(\^)/g, tu = /(?:(#)|(\/))(\d+)([_^])([-+@\d]+)?/g; s.optgroup = s.option, s.tbody = s.tfoot = s.colgroup = s.caption = s.thead, s.th = s.td, u.onStoreItem = function (n, i, r) { r && n === hr && (r.link = gi, r.unlink = sr, i && (t.link[i] = function () { return gi.apply(r, arguments) }, t.unlink[i] = function () { return sr.apply(r, arguments) })) }, (o.delimiters = function () { var n = ar.apply(r, arguments); return ii = n[0], ht = n[1], b = n[2], ri = n[3], ui = n[4], w = new RegExp("(?:^|\\s*)([\\w-]*)(\\" + ui + ")?(\\" + ht + u.rTag + "\\" + b + ")", "g"), this })(), u.viewInfos = h, st = { addViews: function (n, t, i) { var u, o, r = this, f = t.length, e = r.views; if (!r._.useKey && f && (i = r.tmpl) && (o = e.length + f, di(r, n, i, e, t, r.ctx) !== !1)) for (u = n + f; u < o; u++) nt(e[u]).setProperty("index", u); return r }, removeViews: function (n, r, u) { function o(n) { var h, c, e, o, s, a, r = f[n]; if (r && r.link) { h = r._.id, u || (a = r.nodes()), r.removeViews(i, i, !0), r.data = i, o = r._prv, s = r._nxt, e = r.parentElem, u || (r._elCnt && ti(o, s, e, h, "_"), t(a).remove()), r._elCnt || (o.parentNode && e.removeChild(o), s.parentNode && e.removeChild(s)), wt(r); for (c in r._.bnds) ot(c); delete l[h] } } var e, a, s, h = this, c = !h._.useKey, f = h.views; if (c && (s = f.length), n === i) if (c) { for (e = s; e--;) o(e); h.views = [] } else { for (a in f) o(a); h.views = {} } else if (r === i && (c ? r = 1 : (o(n), delete f[n])), c && r) { for (e = n + r; e-- > n;) o(e); if (f.splice(n, r), s = f.length) while (n < s) nt(f[n]).setProperty("index", n++) } return this }, refresh: function (n) { var t = this, i = t.parent; return i && (di(t, t.index, t.tmpl, i.views, t.data, n, !0), wt(t)), t }, nodes: ur, contents: rr, childTags: fr, link: uu }, o.merge = { input: { from: { fromAttr: ou }, to: { toAttr: "value" } }, textarea: ai, select: ai, optgroup: { from: { fromAttr: "label" }, to: { toAttr: "label" } } }, o.debugMode && (fi = !o.noValidate, n._jsv = { views: l, bindings: e }), k(t, { view: r.view = v = function (n, r, u) { r !== !!r && (u = r, r = i); var e, o, c, v, w, s, b, y, p = 0, k = f.body; if (n && n !== k && a._.useKey > 1 && (n = "" + n === n ? t(n)[0] : n.jquery ? n[0] : n, n)) if (r) { for (y = yt ? n.querySelectorAll(vt) : t(vt, n).get(), s = y.length, c = 0; c < s; c++) for (b = y[c], o = h(b, i, wi), v = 0, w = o.length; v < w; v++) if (e = o[v], (e = l[e.id]) && (e = e && u ? e.get(!0, u) : e, e)) return e } else while (n) { if (o = h(n, i, gr)) for (s = o.length; s--;) if (e = o[s], e.open) { if (p < 1) return e = l[e.id], e && u ? e.get(u) : e || a; p-- } else p++; n = n.previousSibling || n.parentNode } return r ? i : a }, link: r.link = dt, unlink: r.unlink = ni, cleanData: function (n) { n.length && (et(n), lr.call(t, n)) } }), k(t.fn, { link: function (n, t, i, r, u, f) { return dt(n, this, t, i, r, u, f) }, unlink: function (n) { return ni(n, this) }, view: function (n) { return v(this[0], n) } }), k(a, { tmpl: { links: {}, tags: {} } }), k(a, st), a._.onRender = it } }(this, this.jQuery);
//jsviews.js v1.0.0-alpha: http://jsviews.com;
define("jsviews", ["jquery"], function(){});

/*yepnope1.5.x|WTFPL*/
(function(a,b,c){function d(a){return"[object Function]"==o.call(a)}function e(a){return"string"==typeof a}function f(){}function g(a){return!a||"loaded"==a||"complete"==a||"uninitialized"==a}function h(){var a=p.shift();q=1,a?a.t?m(function(){("c"==a.t?B.injectCss:B.injectJs)(a.s,0,a.a,a.x,a.e,1)},0):(a(),h()):q=0}function i(a,c,d,e,f,i,j){function k(b){if(!o&&g(l.readyState)&&(u.r=o=1,!q&&h(),l.onload=l.onreadystatechange=null,b)){"img"!=a&&m(function(){t.removeChild(l)},50);for(var d in y[c])y[c].hasOwnProperty(d)&&y[c][d].onload()}}var j=j||B.errorTimeout,l=b.createElement(a),o=0,r=0,u={t:d,s:c,e:f,a:i,x:j};1===y[c]&&(r=1,y[c]=[]),"object"==a?l.data=c:(l.src=c,l.type=a),l.width=l.height="0",l.onerror=l.onload=l.onreadystatechange=function(){k.call(this,r)},p.splice(e,0,u),"img"!=a&&(r||2===y[c]?(t.insertBefore(l,s?null:n),m(k,j)):y[c].push(l))}function j(a,b,c,d,f){return q=0,b=b||"j",e(a)?i("c"==b?v:u,a,b,this.i++,c,d,f):(p.splice(this.i++,0,a),1==p.length&&h()),this}function k(){var a=B;return a.loader={load:j,i:0},a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName("script")[0],o={}.toString,p=[],q=0,r="MozAppearance"in l.style,s=r&&!!b.createRange().compareNode,t=s?l:n.parentNode,l=a.opera&&"[object Opera]"==o.call(a.opera),l=!!b.attachEvent&&!l,u=r?"object":l?"script":"img",v=l?"script":u,w=Array.isArray||function(a){return"[object Array]"==o.call(a)},x=[],y={},z={timeout:function(a,b){return b.length&&(a.timeout=b[0]),a}},A,B;B=function(a){function b(a){var a=a.split("!"),b=x.length,c=a.pop(),d=a.length,c={url:c,origUrl:c,prefixes:a},e,f,g;for(f=0;f<d;f++)g=a[f].split("="),(e=z[g.shift()])&&(c=e(c,g));for(f=0;f<b;f++)c=x[f](c);return c}function g(a,e,f,g,h){var i=b(a),j=i.autoCallback;i.url.split(".").pop().split("?").shift(),i.bypass||(e&&(e=d(e)?e:e[a]||e[g]||e[a.split("/").pop().split("?")[0]]),i.instead?i.instead(a,e,f,g,h):(y[i.url]?i.noexec=!0:y[i.url]=1,f.load(i.url,i.forceCSS||!i.forceJS&&"css"==i.url.split(".").pop().split("?").shift()?"c":c,i.noexec,i.attrs,i.timeout),(d(e)||d(j))&&f.load(function(){k(),e&&e(i.origUrl,h,g),j&&j(i.origUrl,h,g),y[i.url]=2})))}function h(a,b){function c(a,c){if(a){if(e(a))c||(j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}),g(a,j,b,0,h);else if(Object(a)===a)for(n in m=function(){var b=0,c;for(c in a)a.hasOwnProperty(c)&&b++;return b}(),a)a.hasOwnProperty(n)&&(!c&&!--m&&(d(j)?j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}:j[n]=function(a){return function(){var b=[].slice.call(arguments);a&&a.apply(this,b),l()}}(k[n])),g(a[n],j,b,n,h))}else!c&&l()}var h=!!a.test,i=a.load||a.both,j=a.callback||f,k=j,l=a.complete||f,m,n;c(h?a.yep:a.nope,!!i),i&&c(i)}var i,j,l=this.yepnope.loader;if(e(a))g(a,0,l,0);else if(w(a))for(i=0;i<a.length;i++)j=a[i],e(j)?g(j,0,l,0):w(j)?B(j):Object(j)===j&&h(j,l);else Object(a)===a&&h(a,l)},B.addPrefix=function(a,b){z[a]=b},B.addFilter=function(a){x.push(a)},B.errorTimeout=1e4,null==b.readyState&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",A=function(){b.removeEventListener("DOMContentLoaded",A,0),b.readyState="complete"},0)),a.yepnope=k(),a.yepnope.executeStack=h,a.yepnope.injectJs=function(a,c,d,e,i,j){var k=b.createElement("script"),l,o,e=e||B.errorTimeout;k.src=a;for(o in d)k.setAttribute(o,d[o]);c=j?h:c||f,k.onreadystatechange=k.onload=function(){!l&&g(k.readyState)&&(l=1,c(),k.onload=k.onreadystatechange=null)},m(function(){l||(l=1,c(1))},e),i?k.onload():n.parentNode.insertBefore(k,n)},a.yepnope.injectCss=function(a,c,d,e,g,i){var e=b.createElement("link"),j,c=i?h:c||f;e.href=a,e.rel="stylesheet",e.type="text/css";for(j in d)e.setAttribute(j,d[j]);g||(n.parentNode.insertBefore(e,n),m(c,0))}})(this,document);
define("yepnope", function(){});

( function ( window, doc, undef ) {
  // Takes a preloaded css obj (changes in different browsers) and injects it into the head
  yepnope.injectCss = function( href, cb, attrs, timeout, /* Internal use */ err, internal ) {

    // Create stylesheet link
    var link = document.createElement( "link" ),
        onload = function() {
          if ( ! done ) {
            done = 1;
            link.removeAttribute("id");
            setTimeout( cb, 0 );
          }
        },
        id = "yn" + (+new Date()),
        ref, done, i;

    cb = internal ? yepnope.executeStack : ( cb || function(){} );
    timeout = timeout || yepnope.errorTimeout;
    // Add attributes
    link.href = href;
    link.rel  = "stylesheet";
    link.type = "text/css";
    link.id = id;

    // Add our extra attributes to the link element
    for ( i in attrs ) {
      link.setAttribute( i, attrs[ i ] );
    }


    if ( ! err ) {
      ref = document.getElementsByTagName('base')[0] || document.getElementsByTagName('script')[0];
      ref.parentNode.insertBefore( link, ref );
      link.onload = onload;

      function poll() {
        try {
            var sheets = document.styleSheets;
            for(var j=0, k=sheets.length; j<k; j++) {
                if(sheets[j].ownerNode.id == id) {
                    // this throws an exception, I believe, if not full loaded (was originally just "sheets[j].cssRules;")
                    if (sheets[j].cssRules.length)
                        return onload();
                }
            }
            // if we get here, its not in document.styleSheets (we never saw the ID)
            throw new Error;
        } catch(e) {
            // Keep polling
            setTimeout(poll, 20);
        }
      }
      poll();
    }
  }
})( this, this.document );
define("yepnopecss", ["yepnope"], function(){});

define('utils',["require", "exports"], function(require, exports) {
    String.prototype.format = function () {
        var s = arguments[0];
        for (var i = 0; i < arguments.length - 1; i++) {
            var reg = new RegExp("\\{" + i + "\\}", "gm");
            s = s.replace(reg, arguments[i + 1]);
        }

        return s;
    };

    String.prototype.startsWith = function (str) {
        return this.indexOf(str) == 0;
    };
    String.prototype.endsWith = function (str) {
        return this.indexOf(str, this.length - str.length) !== -1;
    };
    String.prototype.trim = function () {
        return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    };
    String.prototype.ltrim = function () {
        return this.replace(/^\s+/, '');
    };
    String.prototype.rtrim = function () {
        return this.replace(/\s+$/, '');
    };
    String.prototype.fulltrim = function () {
        return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g, ' ');
    };
    String.prototype.toFileName = function () {
        return this.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    };
    String.prototype.contains = function (str) {
        return this.indexOf(str) !== -1;
    };
    String.prototype.utf8_to_b64 = function () {
        return window.btoa(unescape(encodeURIComponent(this)));
    };
    String.prototype.b64_to_utf8 = function () {
        return decodeURIComponent(escape(window.atob(this)));
    };

    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (searchElement, fromIndex) {
            var i = (fromIndex || 0);
            var j = this.length;

            for (i; i < j; i++) {
                if (this[i] === searchElement) {
                    return i;
                }
            }
            return -1;
        };
    }

    if (!Array.prototype.clone) {
        Array.prototype.clone = function () {
            return this.slice(0);
        };
    }

    if (!Array.prototype.last) {
        Array.prototype.last = function () {
            return this[this.length - 1];
        };
    }
    ;

    if (!Array.prototype.contains) {
        Array.prototype.contains = function (val) {
            return this.indexOf(val) !== -1;
        };
    }

    window.BrowserDetect = {
        init: function () {
            this.browser = this.searchString(this.dataBrowser) || "Other";
            this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "Unknown";
        },
        searchString: function (data) {
            for (var i = 0; i < data.length; i++) {
                var dataString = data[i].string;
                this.versionSearchString = data[i].subString;

                if (dataString.indexOf(data[i].subString) != -1) {
                    return data[i].identity;
                }
            }
        },
        searchVersion: function (dataString) {
            var index = dataString.indexOf(this.versionSearchString);
            if (index == -1)
                return;
            return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
        },
        dataBrowser: [
            { string: navigator.userAgent, subString: "Chrome", identity: "Chrome" },
            { string: navigator.userAgent, subString: "MSIE", identity: "Explorer" },
            { string: navigator.userAgent, subString: "Firefox", identity: "Firefox" },
            { string: navigator.userAgent, subString: "Safari", identity: "Safari" },
            { string: navigator.userAgent, subString: "Opera", identity: "Opera" }
        ]
    };

    window.BrowserDetect.init();

    var Size = (function () {
        function Size(width, height) {
            this.width = width;
            this.height = height;
        }
        return Size;
    })();
    exports.Size = Size;

    var Utils = (function () {
        function Utils() {
        }
        Utils.ellipsis = function (text, chars) {
            if (text.length <= chars)
                return text;
            var trimmedText = text.substr(0, chars);
            trimmedText = trimmedText.substr(0, Math.min(trimmedText.length, trimmedText.lastIndexOf(" ")));
            return trimmedText + "&hellip;";
        };

        Utils.numericalInput = function (event) {
            if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || (event.keyCode == 65 && event.ctrlKey === true) || (event.keyCode >= 35 && event.keyCode <= 39)) {
                return true;
            } else {
                if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
                    event.preventDefault();
                    return false;
                }
                return true;
            }
        };

        Utils.getTimeStamp = function () {
            return new Date().getTime();
        };

        Utils.getHashParameter = function (key, doc) {
            if (!doc)
                doc = window.document;
            var regex = new RegExp("#.*[?&]" + key + "=([^&]+)(&|$)");
            var match = regex.exec(doc.location.hash);
            return (match ? decodeURIComponent(match[1].replace(/\+/g, " ")) : null);
        };

        Utils.setHashParameter = function (key, value, doc) {
            if (!doc)
                doc = window.document;

            var kvp = this.updateURIKeyValuePair(doc.location.hash.replace('#?', ''), key, value);

            var newHash = "#?" + kvp;

            var url = doc.URL;

            var index = url.indexOf('#');

            if (index != -1) {
                url = url.substr(0, url.indexOf('#'));
            }

            doc.location.replace(url + newHash);
        };

        Utils.getQuerystringParameter = function (key, doc) {
            if (!doc)
                doc = window.document;
            key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
            var regex = new RegExp("[\\?&]" + key + "=([^&#]*)");
            var match = regex.exec(window.location.search);
            return (match ? decodeURIComponent(match[1].replace(/\+/g, " ")) : null);
        };

        Utils.setQuerystringParameter = function (key, value, doc) {
            if (!doc)
                doc = window.document;

            var kvp = this.updateURIKeyValuePair(doc.location.hash.replace('#?', ''), key, value);

            window.location.search = kvp;
        };

        Utils.updateURIKeyValuePair = function (uriSegment, key, value) {
            key = encodeURIComponent(key);
            value = encodeURIComponent(value);

            var kvp = uriSegment.split('&');

            if (kvp[0] == "")
                kvp.shift();

            var i = kvp.length;
            var x;

            while (i--) {
                x = kvp[i].split('=');

                if (x[0] == key) {
                    x[1] = value;
                    kvp[i] = x.join('=');
                    break;
                }
            }

            if (i < 0) {
                kvp[kvp.length] = [key, value].join('=');
            }

            return kvp.join('&');
        };

        Utils.getScaleFraction = function (minSize, currentSize, scaleFactor, maxScale) {
            var maxSize = minSize * Math.pow(scaleFactor, maxScale);

            var n = currentSize / maxSize;

            var l = (Math.log(n) / Math.log(scaleFactor));

            var f = (maxScale - Math.abs(l)) / maxScale;

            return f;
        };

        Utils.getScaleFromFraction = function (fraction, minSize, scaleFactor, maxScale) {
            var p = maxScale * fraction;
            return minSize * Math.pow(scaleFactor, p);
        };

        Utils.clamp = function (value, min, max) {
            return Math.min(Math.max(value, min), max);
        };

        Utils.roundNumber = function (num, dec) {
            return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
        };

        Utils.normalise = function (num, min, max) {
            return (num - min) / (max - min);
        };

        Utils.fitRect = function (width1, height1, width2, height2) {
            var ratio1 = height1 / width1;
            var ratio2 = height2 / width2;

            var width, height, scale;

            if (ratio1 < ratio2) {
                scale = width2 / width1;
                width = width1 * scale;
                height = height1 * scale;
            }
            if (ratio2 < ratio1) {
                scale = height2 / height1;
                width = width1 * scale;
                height = height1 * scale;
            }

            return new Size(Math.floor(width), Math.floor(height));
        };

        Utils.getBool = function (val, defaultVal) {
            if (typeof (val) === 'undefined') {
                return defaultVal;
            }

            return val;
        };

        Utils.getUrlParts = function (url) {
            var a = document.createElement('a');
            a.href = url;
            return a;
        };

        Utils.convertToRelativeUrl = function (url) {
            var parts = this.getUrlParts(url);
            var relUri = parts.pathname + parts.search;

            if (!relUri.startsWith("/")) {
                relUri = "/" + relUri;
            }

            return relUri;
        };

        Utils.debounce = function (fn, debounceDuration) {
            debounceDuration = debounceDuration || 100;

            return function () {
                if (!fn.debouncing) {
                    var args = Array.prototype.slice.apply(arguments);
                    fn.lastReturnVal = fn.apply(window, args);
                    fn.debouncing = true;
                }
                clearTimeout(fn.debounceTimeout);
                fn.debounceTimeout = setTimeout(function () {
                    fn.debouncing = false;
                }, debounceDuration);

                return fn.lastReturnVal;
            };
        };

        Utils.createElement = function (tagName, id, className) {
            var $elem = $(document.createElement(tagName));

            if (id)
                $elem.attr('id', id);
            if (className)
                $elem.attr('class', className);

            return $elem;
        };

        Utils.createDiv = function (className) {
            return Utils.createElement('div', null, className);
        };

        Utils.loadCss = function (uri) {
            $('head').append($('<link rel="stylesheet" type="text/css" />').attr('href', uri));
        };
        return Utils;
    })();
    exports.Utils = Utils;
});

define('bootstrapper',["require", "exports", "utils"], function(require, exports, utils) {
    var BootStrapper = (function () {
        function BootStrapper(extensions) {
            this.IIIF = false;
            this.extensions = extensions;

            var that = this;

            that.dataBaseUri = utils.Utils.getQuerystringParameter('dbu');
            that.manifestUri = utils.Utils.getQuerystringParameter('du');
            that.configExtensionUri = utils.Utils.getQuerystringParameter('c');

            if (that.dataBaseUri) {
                that.manifestUri = that.dataBaseUri + that.manifestUri;
            }

            jQuery.support.cors = true;

            if (that.configExtensionUri) {
                $.getJSON(that.configExtensionUri, function (configExtension) {
                    that.configExtension = configExtension;
                    that.loadManifest();
                });
            } else {
                that.loadManifest();
            }
        }
        BootStrapper.prototype.loadManifest = function () {
            var that = this;

            var settings = {
                url: that.manifestUri,
                type: 'GET',
                dataType: 'jsonp',
                jsonp: 'callback',
                jsonpCallback: 'manifestCallback'
            };

            $.ajax(settings);

            window.manifestCallback = function (manifest) {
                that.manifest = manifest;

                var isHomeDomain = utils.Utils.getQuerystringParameter('hd') == "true";
                var isReload = utils.Utils.getQuerystringParameter('rl') == "true";
                var sequenceParam = 'si';

                if (that.configExtension && that.configExtension.options && that.configExtension.options.IIIF) {
                    that.IIIF = true;
                }

                if (!that.IIIF)
                    sequenceParam = 'asi';

                if (isHomeDomain && !isReload) {
                    that.sequenceIndex = parseInt(utils.Utils.getHashParameter(sequenceParam, parent.document));
                }

                if (!that.sequenceIndex) {
                    that.sequenceIndex = parseInt(utils.Utils.getQuerystringParameter(sequenceParam)) || 0;
                }

                if (!that.IIIF) {
                    that.sequences = that.manifest.assetSequences;
                } else {
                    that.sequences = that.manifest.sequences;
                }

                if (!that.sequences) {
                    that.notFound();
                }

                that.loadSequence();
            };
        };

        BootStrapper.prototype.loadSequence = function () {
            var that = this;

            if (!that.IIIF) {
                if (!that.sequences[that.sequenceIndex].$ref) {
                    that.sequence = that.sequences[that.sequenceIndex];
                    that.loadDependencies();
                } else {
                    var baseManifestUri = that.manifestUri.substr(0, that.manifestUri.lastIndexOf('/') + 1);
                    var sequenceUri = baseManifestUri + that.sequences[that.sequenceIndex].$ref;

                    $.getJSON(sequenceUri, function (sequenceData) {
                        that.sequence = that.sequences[that.sequenceIndex] = sequenceData;
                        that.loadDependencies();
                    });
                }
            } else {
                if (that.sequences[that.sequenceIndex].canvases) {
                    that.sequence = that.sequences[that.sequenceIndex];
                    that.loadDependencies();
                } else {
                    var baseManifestUri = that.manifestUri.substr(0, that.manifestUri.lastIndexOf('/') + 1);
                    var sequenceUri = String(that.sequences[that.sequenceIndex]['@id']);

                    $.getJSON(sequenceUri, function (sequenceData) {
                        that.sequence = that.sequences[that.sequenceIndex] = sequenceData;
                        that.loadDependencies();
                    });
                }
            }
        };

        BootStrapper.prototype.notFound = function () {
            try  {
                parent.$(parent.document).trigger("onNotFound");
                return;
            } catch (e) {
            }
        };

        BootStrapper.prototype.loadDependencies = function () {
            var that = this;
            var extension;

            if (!that.IIIF) {
                extension = that.extensions[that.sequence.assetType];
            } else {
                extension = that.extensions['seadragon/iiif'];
            }

            var configPath = (window.DEBUG) ? 'extensions/' + extension.name + '/config.js' : 'js/' + extension.name + '-config.js';

            yepnope({
                test: window.btoa && window.atob,
                nope: 'js/base64.min.js',
                complete: function () {
                    $.getJSON(configPath, function (config) {
                        if (that.configExtension) {
                            config.uri = that.configExtensionUri;

                            $.extend(true, config, that.configExtension);
                        }

                        var cssPath = (window.DEBUG) ? 'extensions/' + extension.name + '/css/styles.css' : 'themes/' + config.options.theme + '/css/' + extension.name + '.css';

                        yepnope.injectCss(cssPath, function () {
                            that.createExtension(extension, config);
                        });
                    });
                }
            });
        };

        BootStrapper.prototype.createExtension = function (extension, config) {
            var provider = new extension.provider(config, this.manifest);

            new extension.type(provider);
        };
        return BootStrapper;
    })();

    
    return BootStrapper;
});

/**
 * Copyright (c) 2011-2013 Fabien Cazenave, Mozilla.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */
/*
  Additional modifications for PDF.js project:
    - Disables language initialization on page loading;
    - Removes consoleWarn and consoleLog and use console.log/warn directly.
    - Removes window._ assignment.
*/

/*jshint browser: true, devel: true, globalstrict: true */


document.webL10n = (function(window, document, undefined) {
  var gL10nData = {};
  var gTextData = '';
  var gTextProp = 'textContent';
  var gLanguage = '';
  var gMacros = {};
  var gReadyState = 'loading';


  /**
   * Synchronously loading l10n resources significantly minimizes flickering
   * from displaying the app with non-localized strings and then updating the
   * strings. Although this will block all script execution on this page, we
   * expect that the l10n resources are available locally on flash-storage.
   *
   * As synchronous XHR is generally considered as a bad idea, we're still
   * loading l10n resources asynchronously -- but we keep this in a setting,
   * just in case... and applications using this library should hide their
   * content until the `localized' event happens.
   */

  var gAsyncResourceLoading = true; // read-only


  /**
   * DOM helpers for the so-called "HTML API".
   *
   * These functions are written for modern browsers. For old versions of IE,
   * they're overridden in the 'startup' section at the end of this file.
   */

  function getL10nResourceLinks() {
    return document.querySelectorAll('link[type="application/l10n"]');
  }

  function getL10nDictionary() {
    var script = document.querySelector('script[type="application/l10n"]');
    // TODO: support multiple and external JSON dictionaries
    return script ? JSON.parse(script.innerHTML) : null;
  }

  function getTranslatableChildren(element) {
    return element ? element.querySelectorAll('*[data-l10n-id]') : [];
  }

  function getL10nAttributes(element) {
    if (!element)
      return {};

    var l10nId = element.getAttribute('data-l10n-id');
    var l10nArgs = element.getAttribute('data-l10n-args');
    var args = {};
    if (l10nArgs) {
      try {
        args = JSON.parse(l10nArgs);
      } catch (e) {
        console.warn('could not parse arguments for #' + l10nId);
      }
    }
    return { id: l10nId, args: args };
  }

  function fireL10nReadyEvent(lang) {
    var evtObject = document.createEvent('Event');
    evtObject.initEvent('localized', true, false);
    evtObject.language = lang;
    document.dispatchEvent(evtObject);
  }

  function xhrLoadText(url, onSuccess, onFailure, asynchronous) {
    onSuccess = onSuccess || function _onSuccess(data) {};
    onFailure = onFailure || function _onFailure() {
      console.warn(url + ' not found.');
    };

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, asynchronous);
    if (xhr.overrideMimeType) {
      xhr.overrideMimeType('text/plain; charset=utf-8');
    }
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        if (xhr.status == 200 || xhr.status === 0) {
          onSuccess(xhr.responseText);
        } else {
          onFailure();
        }
      }
    };
    xhr.onerror = onFailure;
    xhr.ontimeout = onFailure;

    // in Firefox OS with the app:// protocol, trying to XHR a non-existing
    // URL will raise an exception here -- hence this ugly try...catch.
    try {
      xhr.send(null);
    } catch (e) {
      onFailure();
    }
  }


  /**
   * l10n resource parser:
   *  - reads (async XHR) the l10n resource matching `lang';
   *  - imports linked resources (synchronously) when specified;
   *  - parses the text data (fills `gL10nData' and `gTextData');
   *  - triggers success/failure callbacks when done.
   *
   * @param {string} href
   *    URL of the l10n resource to parse.
   *
   * @param {string} lang
   *    locale (language) to parse.
   *
   * @param {Function} successCallback
   *    triggered when the l10n resource has been successully parsed.
   *
   * @param {Function} failureCallback
   *    triggered when the an error has occured.
   *
   * @return {void}
   *    uses the following global variables: gL10nData, gTextData, gTextProp.
   */

  function parseResource(href, lang, successCallback, failureCallback) {
    var baseURL = href.replace(/[^\/]*$/, '') || './';

    // handle escaped characters (backslashes) in a string
    function evalString(text) {
      if (text.lastIndexOf('\\') < 0)
        return text;
      return text.replace(/\\\\/g, '\\')
                 .replace(/\\n/g, '\n')
                 .replace(/\\r/g, '\r')
                 .replace(/\\t/g, '\t')
                 .replace(/\\b/g, '\b')
                 .replace(/\\f/g, '\f')
                 .replace(/\\{/g, '{')
                 .replace(/\\}/g, '}')
                 .replace(/\\"/g, '"')
                 .replace(/\\'/g, "'");
    }

    // parse *.properties text data into an l10n dictionary
    function parseProperties(text) {
      var dictionary = [];

      // token expressions
      var reBlank = /^\s*|\s*$/;
      var reComment = /^\s*#|^\s*$/;
      var reSection = /^\s*\[(.*)\]\s*$/;
      var reImport = /^\s*@import\s+url\((.*)\)\s*$/i;
      var reSplit = /^([^=\s]*)\s*=\s*(.+)$/; // TODO: escape EOLs with '\'

      // parse the *.properties file into an associative array
      function parseRawLines(rawText, extendedSyntax) {
        var entries = rawText.replace(reBlank, '').split(/[\r\n]+/);
        var currentLang = '*';
        var genericLang = lang.replace(/-[a-z]+$/i, '');
        var skipLang = false;
        var match = '';

        for (var i = 0; i < entries.length; i++) {
          var line = entries[i];

          // comment or blank line?
          if (reComment.test(line))
            continue;

          // the extended syntax supports [lang] sections and @import rules
          if (extendedSyntax) {
            if (reSection.test(line)) { // section start?
              match = reSection.exec(line);
              currentLang = match[1];
              skipLang = (currentLang !== '*') &&
                  (currentLang !== lang) && (currentLang !== genericLang);
              continue;
            } else if (skipLang) {
              continue;
            }
            if (reImport.test(line)) { // @import rule?
              match = reImport.exec(line);
              loadImport(baseURL + match[1]); // load the resource synchronously
            }
          }

          // key-value pair
          var tmp = line.match(reSplit);
          if (tmp && tmp.length == 3) {
            dictionary[tmp[1]] = evalString(tmp[2]);
          }
        }
      }

      // import another *.properties file
      function loadImport(url) {
        xhrLoadText(url, function(content) {
          parseRawLines(content, false); // don't allow recursive imports
        }, null, false); // load synchronously
      }

      // fill the dictionary
      parseRawLines(text, true);
      return dictionary;
    }

    // load and parse l10n data (warning: global variables are used here)
    xhrLoadText(href, function(response) {
      gTextData += response; // mostly for debug

      // parse *.properties text data into an l10n dictionary
      var data = parseProperties(response);

      // find attribute descriptions, if any
      for (var key in data) {
        var id, prop, index = key.lastIndexOf('.');
        if (index > 0) { // an attribute has been specified
          id = key.substring(0, index);
          prop = key.substr(index + 1);
        } else { // no attribute: assuming text content by default
          id = key;
          prop = gTextProp;
        }
        if (!gL10nData[id]) {
          gL10nData[id] = {};
        }
        gL10nData[id][prop] = data[key];
      }

      // trigger callback
      if (successCallback) {
        successCallback();
      }
    }, failureCallback, gAsyncResourceLoading);
  }

  // load and parse all resources for the specified locale
  function loadLocale(lang, callback) {
    console.log("load locale");
    callback = callback || function _callback() {};

    clear();
    gLanguage = lang;

    // check all <link type="application/l10n" href="..." /> nodes
    // and load the resource files
    var langLinks = getL10nResourceLinks();
    var langCount = langLinks.length;
    if (langCount === 0) {
      // we might have a pre-compiled dictionary instead
      var dict = getL10nDictionary();
      if (dict && dict.locales && dict.default_locale) {
        console.log('using the embedded JSON directory, early way out');
        gL10nData = dict.locales[lang] || dict.locales[dict.default_locale];
        callback();
      } else {
        console.log('no resource to load, early way out');
      }
      // early way out
      fireL10nReadyEvent(lang);
      gReadyState = 'complete';
      return;
    }

    // start the callback when all resources are loaded
    var onResourceLoaded = null;
    var gResourceCount = 0;
    onResourceLoaded = function() {
      gResourceCount++;
      if (gResourceCount >= langCount) {
        callback();
        fireL10nReadyEvent(lang);
        gReadyState = 'complete';
      }
    };

    // load all resource files
    function L10nResourceLink(link) {
      var href = link.href;
      var type = link.type;
      this.load = function(lang, callback) {
        var applied = lang;
        parseResource(href, lang, callback, function() {
          console.warn(href + ' not found.');
          applied = '';
        });
        return applied; // return lang if found, an empty string if not found
      };
    }

    for (var i = 0; i < langCount; i++) {
      var resource = new L10nResourceLink(langLinks[i]);
      var rv = resource.load(lang, onResourceLoaded);
      if (rv != lang) { // lang not found, used default resource instead
        console.warn('"' + lang + '" resource not found');
        gLanguage = '';
      }
    }
  }

  // clear all l10n data
  function clear() {
    gL10nData = {};
    gTextData = '';
    gLanguage = '';
    // TODO: clear all non predefined macros.
    // There's no such macro /yet/ but we're planning to have some...
  }


  /**
   * Get rules for plural forms (shared with JetPack), see:
   * http://unicode.org/repos/cldr-tmp/trunk/diff/supplemental/language_plural_rules.html
   * https://github.com/mozilla/addon-sdk/blob/master/python-lib/plural-rules-generator.p
   *
   * @param {string} lang
   *    locale (language) used.
   *
   * @return {Function}
   *    returns a function that gives the plural form name for a given integer:
   *       var fun = getPluralRules('en');
   *       fun(1)    -> 'one'
   *       fun(0)    -> 'other'
   *       fun(1000) -> 'other'.
   */

  function getPluralRules(lang) {
    var locales2rules = {
      'af': 3,
      'ak': 4,
      'am': 4,
      'ar': 1,
      'asa': 3,
      'az': 0,
      'be': 11,
      'bem': 3,
      'bez': 3,
      'bg': 3,
      'bh': 4,
      'bm': 0,
      'bn': 3,
      'bo': 0,
      'br': 20,
      'brx': 3,
      'bs': 11,
      'ca': 3,
      'cgg': 3,
      'chr': 3,
      'cs': 12,
      'cy': 17,
      'da': 3,
      'de': 3,
      'dv': 3,
      'dz': 0,
      'ee': 3,
      'el': 3,
      'en': 3,
      'eo': 3,
      'es': 3,
      'et': 3,
      'eu': 3,
      'fa': 0,
      'ff': 5,
      'fi': 3,
      'fil': 4,
      'fo': 3,
      'fr': 5,
      'fur': 3,
      'fy': 3,
      'ga': 8,
      'gd': 24,
      'gl': 3,
      'gsw': 3,
      'gu': 3,
      'guw': 4,
      'gv': 23,
      'ha': 3,
      'haw': 3,
      'he': 2,
      'hi': 4,
      'hr': 11,
      'hu': 0,
      'id': 0,
      'ig': 0,
      'ii': 0,
      'is': 3,
      'it': 3,
      'iu': 7,
      'ja': 0,
      'jmc': 3,
      'jv': 0,
      'ka': 0,
      'kab': 5,
      'kaj': 3,
      'kcg': 3,
      'kde': 0,
      'kea': 0,
      'kk': 3,
      'kl': 3,
      'km': 0,
      'kn': 0,
      'ko': 0,
      'ksb': 3,
      'ksh': 21,
      'ku': 3,
      'kw': 7,
      'lag': 18,
      'lb': 3,
      'lg': 3,
      'ln': 4,
      'lo': 0,
      'lt': 10,
      'lv': 6,
      'mas': 3,
      'mg': 4,
      'mk': 16,
      'ml': 3,
      'mn': 3,
      'mo': 9,
      'mr': 3,
      'ms': 0,
      'mt': 15,
      'my': 0,
      'nah': 3,
      'naq': 7,
      'nb': 3,
      'nd': 3,
      'ne': 3,
      'nl': 3,
      'nn': 3,
      'no': 3,
      'nr': 3,
      'nso': 4,
      'ny': 3,
      'nyn': 3,
      'om': 3,
      'or': 3,
      'pa': 3,
      'pap': 3,
      'pl': 13,
      'ps': 3,
      'pt': 3,
      'rm': 3,
      'ro': 9,
      'rof': 3,
      'ru': 11,
      'rwk': 3,
      'sah': 0,
      'saq': 3,
      'se': 7,
      'seh': 3,
      'ses': 0,
      'sg': 0,
      'sh': 11,
      'shi': 19,
      'sk': 12,
      'sl': 14,
      'sma': 7,
      'smi': 7,
      'smj': 7,
      'smn': 7,
      'sms': 7,
      'sn': 3,
      'so': 3,
      'sq': 3,
      'sr': 11,
      'ss': 3,
      'ssy': 3,
      'st': 3,
      'sv': 3,
      'sw': 3,
      'syr': 3,
      'ta': 3,
      'te': 3,
      'teo': 3,
      'th': 0,
      'ti': 4,
      'tig': 3,
      'tk': 3,
      'tl': 4,
      'tn': 3,
      'to': 0,
      'tr': 0,
      'ts': 3,
      'tzm': 22,
      'uk': 11,
      'ur': 3,
      've': 3,
      'vi': 0,
      'vun': 3,
      'wa': 4,
      'wae': 3,
      'wo': 0,
      'xh': 3,
      'xog': 3,
      'yo': 0,
      'zh': 0,
      'zu': 3
    };

    // utility functions for plural rules methods
    function isIn(n, list) {
      return list.indexOf(n) !== -1;
    }
    function isBetween(n, start, end) {
      return start <= n && n <= end;
    }

    // list of all plural rules methods:
    // map an integer to the plural form name to use
    var pluralRules = {
      '0': function(n) {
        return 'other';
      },
      '1': function(n) {
        if ((isBetween((n % 100), 3, 10)))
          return 'few';
        if (n === 0)
          return 'zero';
        if ((isBetween((n % 100), 11, 99)))
          return 'many';
        if (n == 2)
          return 'two';
        if (n == 1)
          return 'one';
        return 'other';
      },
      '2': function(n) {
        if (n !== 0 && (n % 10) === 0)
          return 'many';
        if (n == 2)
          return 'two';
        if (n == 1)
          return 'one';
        return 'other';
      },
      '3': function(n) {
        if (n == 1)
          return 'one';
        return 'other';
      },
      '4': function(n) {
        if ((isBetween(n, 0, 1)))
          return 'one';
        return 'other';
      },
      '5': function(n) {
        if ((isBetween(n, 0, 2)) && n != 2)
          return 'one';
        return 'other';
      },
      '6': function(n) {
        if (n === 0)
          return 'zero';
        if ((n % 10) == 1 && (n % 100) != 11)
          return 'one';
        return 'other';
      },
      '7': function(n) {
        if (n == 2)
          return 'two';
        if (n == 1)
          return 'one';
        return 'other';
      },
      '8': function(n) {
        if ((isBetween(n, 3, 6)))
          return 'few';
        if ((isBetween(n, 7, 10)))
          return 'many';
        if (n == 2)
          return 'two';
        if (n == 1)
          return 'one';
        return 'other';
      },
      '9': function(n) {
        if (n === 0 || n != 1 && (isBetween((n % 100), 1, 19)))
          return 'few';
        if (n == 1)
          return 'one';
        return 'other';
      },
      '10': function(n) {
        if ((isBetween((n % 10), 2, 9)) && !(isBetween((n % 100), 11, 19)))
          return 'few';
        if ((n % 10) == 1 && !(isBetween((n % 100), 11, 19)))
          return 'one';
        return 'other';
      },
      '11': function(n) {
        if ((isBetween((n % 10), 2, 4)) && !(isBetween((n % 100), 12, 14)))
          return 'few';
        if ((n % 10) === 0 ||
            (isBetween((n % 10), 5, 9)) ||
            (isBetween((n % 100), 11, 14)))
          return 'many';
        if ((n % 10) == 1 && (n % 100) != 11)
          return 'one';
        return 'other';
      },
      '12': function(n) {
        if ((isBetween(n, 2, 4)))
          return 'few';
        if (n == 1)
          return 'one';
        return 'other';
      },
      '13': function(n) {
        if ((isBetween((n % 10), 2, 4)) && !(isBetween((n % 100), 12, 14)))
          return 'few';
        if (n != 1 && (isBetween((n % 10), 0, 1)) ||
            (isBetween((n % 10), 5, 9)) ||
            (isBetween((n % 100), 12, 14)))
          return 'many';
        if (n == 1)
          return 'one';
        return 'other';
      },
      '14': function(n) {
        if ((isBetween((n % 100), 3, 4)))
          return 'few';
        if ((n % 100) == 2)
          return 'two';
        if ((n % 100) == 1)
          return 'one';
        return 'other';
      },
      '15': function(n) {
        if (n === 0 || (isBetween((n % 100), 2, 10)))
          return 'few';
        if ((isBetween((n % 100), 11, 19)))
          return 'many';
        if (n == 1)
          return 'one';
        return 'other';
      },
      '16': function(n) {
        if ((n % 10) == 1 && n != 11)
          return 'one';
        return 'other';
      },
      '17': function(n) {
        if (n == 3)
          return 'few';
        if (n === 0)
          return 'zero';
        if (n == 6)
          return 'many';
        if (n == 2)
          return 'two';
        if (n == 1)
          return 'one';
        return 'other';
      },
      '18': function(n) {
        if (n === 0)
          return 'zero';
        if ((isBetween(n, 0, 2)) && n !== 0 && n != 2)
          return 'one';
        return 'other';
      },
      '19': function(n) {
        if ((isBetween(n, 2, 10)))
          return 'few';
        if ((isBetween(n, 0, 1)))
          return 'one';
        return 'other';
      },
      '20': function(n) {
        if ((isBetween((n % 10), 3, 4) || ((n % 10) == 9)) && !(
            isBetween((n % 100), 10, 19) ||
            isBetween((n % 100), 70, 79) ||
            isBetween((n % 100), 90, 99)
            ))
          return 'few';
        if ((n % 1000000) === 0 && n !== 0)
          return 'many';
        if ((n % 10) == 2 && !isIn((n % 100), [12, 72, 92]))
          return 'two';
        if ((n % 10) == 1 && !isIn((n % 100), [11, 71, 91]))
          return 'one';
        return 'other';
      },
      '21': function(n) {
        if (n === 0)
          return 'zero';
        if (n == 1)
          return 'one';
        return 'other';
      },
      '22': function(n) {
        if ((isBetween(n, 0, 1)) || (isBetween(n, 11, 99)))
          return 'one';
        return 'other';
      },
      '23': function(n) {
        if ((isBetween((n % 10), 1, 2)) || (n % 20) === 0)
          return 'one';
        return 'other';
      },
      '24': function(n) {
        if ((isBetween(n, 3, 10) || isBetween(n, 13, 19)))
          return 'few';
        if (isIn(n, [2, 12]))
          return 'two';
        if (isIn(n, [1, 11]))
          return 'one';
        return 'other';
      }
    };

    // return a function that gives the plural form name for a given integer
    var index = locales2rules[lang.replace(/-.*$/, '')];
    if (!(index in pluralRules)) {
      console.warn('plural form unknown for [' + lang + ']');
      return function() { return 'other'; };
    }
    return pluralRules[index];
  }

  // pre-defined 'plural' macro
  gMacros.plural = function(str, param, key, prop) {
    var n = parseFloat(param);
    if (isNaN(n))
      return str;

    // TODO: support other properties (l20n still doesn't...)
    if (prop != gTextProp)
      return str;

    // initialize _pluralRules
    if (!gMacros._pluralRules) {
      gMacros._pluralRules = getPluralRules(gLanguage);
    }
    var index = '[' + gMacros._pluralRules(n) + ']';

    // try to find a [zero|one|two] key if it's defined
    if (n === 0 && (key + '[zero]') in gL10nData) {
      str = gL10nData[key + '[zero]'][prop];
    } else if (n == 1 && (key + '[one]') in gL10nData) {
      str = gL10nData[key + '[one]'][prop];
    } else if (n == 2 && (key + '[two]') in gL10nData) {
      str = gL10nData[key + '[two]'][prop];
    } else if ((key + index) in gL10nData) {
      str = gL10nData[key + index][prop];
    } else if ((key + '[other]') in gL10nData) {
      str = gL10nData[key + '[other]'][prop];
    }

    return str;
  };


  /**
   * l10n dictionary functions
   */

  // fetch an l10n object, warn if not found, apply `args' if possible
  function getL10nData(key, args, fallback) {
    var data = gL10nData[key];
    if (!data) {
      console.warn('#' + key + ' is undefined.');
      if (!fallback) {
        return null;
      }
      data = fallback;
    }

    /** This is where l10n expressions should be processed.
      * The plan is to support C-style expressions from the l20n project;
      * until then, only two kinds of simple expressions are supported:
      *   {[ index ]} and {{ arguments }}.
      */
    var rv = {};
    for (var prop in data) {
      var str = data[prop];
      str = substIndexes(str, args, key, prop);
      str = substArguments(str, args, key);
      rv[prop] = str;
    }
    return rv;
  }

  // replace {[macros]} with their values
  function substIndexes(str, args, key, prop) {
    var reIndex = /\{\[\s*([a-zA-Z]+)\(([a-zA-Z]+)\)\s*\]\}/;
    var reMatch = reIndex.exec(str);
    if (!reMatch || !reMatch.length)
      return str;

    // an index/macro has been found
    // Note: at the moment, only one parameter is supported
    var macroName = reMatch[1];
    var paramName = reMatch[2];
    var param;
    if (args && paramName in args) {
      param = args[paramName];
    } else if (paramName in gL10nData) {
      param = gL10nData[paramName];
    }

    // there's no macro parser yet: it has to be defined in gMacros
    if (macroName in gMacros) {
      var macro = gMacros[macroName];
      str = macro(str, param, key, prop);
    }
    return str;
  }

  // replace {{arguments}} with their values
  function substArguments(str, args, key) {
    var reArgs = /\{\{\s*(.+?)\s*\}\}/;
    var match = reArgs.exec(str);
    while (match) {
      if (!match || match.length < 2)
        return str; // argument key not found

      var arg = match[1];
      var sub = '';
      if (args && arg in args) {
        sub = args[arg];
      } else if (arg in gL10nData) {
        sub = gL10nData[arg][gTextProp];
      } else {
        console.log('argument {{' + arg + '}} for #' + key + ' is undefined.');
        return str;
      }

      str = str.substring(0, match.index) + sub +
            str.substr(match.index + match[0].length);
      match = reArgs.exec(str);
    }
    return str;
  }

  // translate an HTML element
  function translateElement(element) {
    var l10n = getL10nAttributes(element);
    if (!l10n.id)
      return;

    // get the related l10n object
    var data = getL10nData(l10n.id, l10n.args);
    if (!data) {
      console.warn('#' + l10n.id + ' is undefined.');
      return;
    }

    // translate element (TODO: security checks?)
    if (data[gTextProp]) { // XXX
      if (getChildElementCount(element) === 0) {
        element[gTextProp] = data[gTextProp];
      } else {
        // this element has element children: replace the content of the first
        // (non-empty) child textNode and clear other child textNodes
        var children = element.childNodes;
        var found = false;
        for (var i = 0, l = children.length; i < l; i++) {
          if (children[i].nodeType === 3 && /\S/.test(children[i].nodeValue)) {
            if (found) {
              children[i].nodeValue = '';
            } else {
              children[i].nodeValue = data[gTextProp];
              found = true;
            }
          }
        }
        // if no (non-empty) textNode is found, insert a textNode before the
        // first element child.
        if (!found) {
          var textNode = document.createTextNode(data[gTextProp]);
          element.insertBefore(textNode, element.firstChild);
        }
      }
      delete data[gTextProp];
    }

    for (var k in data) {
      element[k] = data[k];
    }
  }

  // webkit browsers don't currently support 'children' on SVG elements...
  function getChildElementCount(element) {
    if (element.children) {
      return element.children.length;
    }
    if (typeof element.childElementCount !== 'undefined') {
      return element.childElementCount;
    }
    var count = 0;
    for (var i = 0; i < element.childNodes.length; i++) {
      count += element.nodeType === 1 ? 1 : 0;
    }
    return count;
  }

  // translate an HTML subtree
  function translateFragment(element) {
    element = element || document.documentElement;

    // check all translatable children (= w/ a `data-l10n-id' attribute)
    var children = getTranslatableChildren(element);
    var elementCount = children.length;
    for (var i = 0; i < elementCount; i++) {
      translateElement(children[i]);
    }

    // translate element itself if necessary
    translateElement(element);
  }

  // cross-browser API (sorry, oldIE doesn't support getters & setters)
  return {
    // get a localized string
    get: function(key, args, fallbackString) {
      var index = key.lastIndexOf('.');
      var prop = gTextProp;
      if (index > 0) { // An attribute has been specified
        prop = key.substr(index + 1);
        key = key.substring(0, index);
      }
      var fallback;
      if (fallbackString) {
        fallback = {};
        fallback[prop] = fallbackString;
      }
      var data = getL10nData(key, args, fallback);
      if (data && prop in data) {
        return data[prop];
      }
      return '{{' + key + '}}';
    },

    // debug
    getData: function() { return gL10nData; },
    getText: function() { return gTextData; },

    // get|set the document language
    getLanguage: function() { return gLanguage; },
    setLanguage: function(lang) {
      loadLocale(lang, translateFragment);
    },

    // get the direction (ltr|rtl) of the current language
    getDirection: function() {
      // http://www.w3.org/International/questions/qa-scripts
      // Arabic, Hebrew, Farsi, Pashto, Urdu
      var rtlList = ['ar', 'he', 'fa', 'ps', 'ur'];
      return (rtlList.indexOf(gLanguage) >= 0) ? 'rtl' : 'ltr';
    },

    // translate an element or document fragment
    translate: translateFragment,

    // this can be used to prevent race conditions
    getReadyState: function() { return gReadyState; },
    ready: function(callback) {
      if (!callback) {
        return;
      } else if (gReadyState == 'complete' || gReadyState == 'interactive') {
        window.setTimeout(callback);
      } else if (document.addEventListener) {
        document.addEventListener('localized', callback);
      } else if (document.attachEvent) {
        document.documentElement.attachEvent('onpropertychange', function(e) {
          if (e.propertyName === 'localized') {
            callback();
          }
        });
      }
    }
  };
}) (window, document);
define("l10n", function(){});

define('modules/coreplayer-shared-module/panel',["require", "exports"], function(require, exports) {
    var Panel = (function () {
        function Panel($element, fitToParentWidth, fitToParentHeight) {
            this.$element = $element;
            this.fitToParentWidth = fitToParentWidth || false;
            this.fitToParentHeight = fitToParentHeight || false;

            this.create();
        }
        Panel.prototype.create = function () {
            var _this = this;
            $.subscribe('onResize', function () {
                _this.resize();
            });
        };

        Panel.prototype.resize = function () {
            var $parent = this.$element.parent();

            if (this.fitToParentWidth) {
                this.$element.width($parent.width());
            }

            if (this.fitToParentHeight) {
                this.$element.height($parent.height());
            }
        };
        return Panel;
    })();
    exports.Panel = Panel;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('modules/coreplayer-shared-module/baseView',["require", "exports", "./panel"], function(require, exports, panel) {
    var BaseView = (function (_super) {
        __extends(BaseView, _super);
        function BaseView($element, fitToParentWidth, fitToParentHeight) {
            _super.call(this, $element, fitToParentWidth, fitToParentHeight);
        }
        BaseView.prototype.create = function () {
            _super.prototype.create.call(this);

            this.extension = window.extension;
            this.provider = this.extension.provider;

            if (this.moduleName) {
                this.config = this.provider.config.modules[this.moduleName];
                if (!this.config)
                    this.config = {};
                this.content = this.config.content || {};
                this.options = this.config.options || {};
            }
        };

        BaseView.prototype.init = function () {
        };

        BaseView.prototype.setConfig = function (moduleName) {
            if (!this.moduleName) {
                this.moduleName = moduleName;
            }
        };

        BaseView.prototype.resize = function () {
            _super.prototype.resize.call(this);
        };
        return BaseView;
    })(panel.Panel);
    exports.BaseView = BaseView;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('modules/coreplayer-shared-module/dialogue',["require", "exports", "./baseExtension", "./shell", "../../utils", "./baseView"], function(require, exports, baseExtension, shell, utils, baseView) {
    var Dialogue = (function (_super) {
        __extends(Dialogue, _super);
        function Dialogue($element) {
            _super.call(this, $element, false, false);
            this.isActive = false;
            this.allowClose = true;
        }
        Dialogue.prototype.create = function () {
            var _this = this;
            _super.prototype.create.call(this);

            $.subscribe(baseExtension.BaseExtension.CLOSE_ACTIVE_DIALOGUE, function () {
                if (_this.isActive) {
                    if (_this.allowClose) {
                        _this.close();
                    }
                }
            });

            $.subscribe(baseExtension.BaseExtension.ESCAPE, function () {
                if (_this.isActive) {
                    if (_this.allowClose) {
                        _this.close();
                    }
                }
            });

            $.subscribe(baseExtension.BaseExtension.RETURN, function (e) {
                _this.returnFunc();
            });

            this.$top = utils.Utils.createDiv('top');
            this.$element.append(this.$top);

            this.$closeButton = utils.Utils.createDiv('close');
            this.$top.append(this.$closeButton);

            this.$middle = utils.Utils.createDiv('middle');
            this.$element.append(this.$middle);

            this.$content = utils.Utils.createDiv('content');
            this.$middle.append(this.$content);

            this.$bottom = utils.Utils.createDiv('bottom');
            this.$element.append(this.$bottom);

            this.$closeButton.on('click', function (e) {
                e.preventDefault();

                _this.close();
            });

            this.returnFunc = this.close;
        };

        Dialogue.prototype.enableClose = function () {
            this.allowClose = true;
            this.$closeButton.show();
        };

        Dialogue.prototype.disableClose = function () {
            this.allowClose = false;
            this.$closeButton.hide();
        };

        Dialogue.prototype.setArrowPosition = function () {
            var paddingLeft = parseInt(this.$element.css("padding-left"));
            var pos = this.extension.mouseX - paddingLeft - 10;
            if (pos < 0)
                pos = 0;
            this.$bottom.css('backgroundPosition', pos + 'px 0px');
        };

        Dialogue.prototype.open = function () {
            this.$element.show();
            this.setArrowPosition();
            this.isActive = true;

            $.publish(shell.Shell.SHOW_OVERLAY);

            this.resize();
        };

        Dialogue.prototype.close = function () {
            if (this.isActive) {
                this.$element.hide();
                this.isActive = false;

                $.publish(shell.Shell.HIDE_OVERLAY);
            }
        };

        Dialogue.prototype.resize = function () {
            _super.prototype.resize.call(this);

            this.$element.css({
                'top': (this.extension.height() / 2) - (this.$element.height() / 2),
                'left': (this.extension.width() / 2) - (this.$element.width() / 2)
            });
        };
        return Dialogue;
    })(baseView.BaseView);
    exports.Dialogue = Dialogue;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('modules/coreplayer-shared-module/genericDialogue',["require", "exports", "./baseExtension", "./dialogue"], function(require, exports, baseExtension, dialogue) {
    var GenericDialogue = (function (_super) {
        __extends(GenericDialogue, _super);
        function GenericDialogue($element) {
            _super.call(this, $element);
        }
        GenericDialogue.prototype.create = function () {
            var _this = this;
            this.setConfig('genericDialogue');

            _super.prototype.create.call(this);

            $.subscribe(GenericDialogue.SHOW_GENERIC_DIALOGUE, function (e, params) {
                _this.showMessage(params);
            });

            $.subscribe(GenericDialogue.HIDE_GENERIC_DIALOGUE, function (e) {
                _this.close();
            });

            this.$message = $('<p></p>');
            this.$content.append(this.$message);

            this.$acceptButton = $('<a href="#" class="btn btn-primary accept"></a>');
            this.$content.append(this.$acceptButton);
            this.$acceptButton.text(this.content.ok);

            this.$acceptButton.on('click', function (e) {
                e.preventDefault();

                _this.accept();
            });

            this.returnFunc = function () {
                if (_this.isActive) {
                    _this.accept();
                }
            };

            this.$element.hide();
        };

        GenericDialogue.prototype.accept = function () {
            $.publish(baseExtension.BaseExtension.CLOSE_ACTIVE_DIALOGUE);

            if (this.acceptCallback)
                this.acceptCallback();
        };

        GenericDialogue.prototype.showMessage = function (params) {
            this.$message.html(params.message);

            if (params.buttonText) {
                this.$acceptButton.text(params.buttonText);
            } else {
                this.$acceptButton.text(this.content.ok);
            }

            this.acceptCallback = params.acceptCallback;

            if (params.allowClose === false) {
                this.disableClose();
            }

            this.open();
        };

        GenericDialogue.prototype.resize = function () {
            _super.prototype.resize.call(this);
        };
        GenericDialogue.SHOW_GENERIC_DIALOGUE = 'onShowGenericDialogue';
        GenericDialogue.HIDE_GENERIC_DIALOGUE = 'onHideGenericDialogue';
        return GenericDialogue;
    })(dialogue.Dialogue);
    exports.GenericDialogue = GenericDialogue;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('modules/coreplayer-shared-module/shell',["require", "exports", "./baseExtension", "./baseView", "./genericDialogue"], function(require, exports, baseExtension, baseView, genericDialogue) {
    var Shell = (function (_super) {
        __extends(Shell, _super);
        function Shell($element) {
            Shell.$element = $element;
            _super.call(this, Shell.$element, true, true);
        }
        Shell.prototype.create = function () {
            _super.prototype.create.call(this);

            $.subscribe(Shell.SHOW_OVERLAY, function () {
                Shell.$overlays.show();
            });

            $.subscribe(Shell.HIDE_OVERLAY, function () {
                Shell.$overlays.hide();
            });

            Shell.$headerPanel = $('<div class="headerPanel"></div>');
            this.$element.append(Shell.$headerPanel);

            Shell.$mainPanel = $('<div class="mainPanel"></div>');
            this.$element.append(Shell.$mainPanel);

            Shell.$centerPanel = $('<div class="centerPanel"></div>');
            Shell.$mainPanel.append(Shell.$centerPanel);

            Shell.$leftPanel = $('<div class="leftPanel"></div>');
            Shell.$mainPanel.append(Shell.$leftPanel);

            Shell.$rightPanel = $('<div class="rightPanel"></div>');
            Shell.$mainPanel.append(Shell.$rightPanel);

            Shell.$footerPanel = $('<div class="footerPanel"></div>');
            Shell.$element.append(Shell.$footerPanel);

            Shell.$overlays = $('<div class="overlays"></div>');
            this.$element.append(Shell.$overlays);

            Shell.$genericDialogue = $('<div class="overlay genericDialogue"></div>');
            Shell.$overlays.append(Shell.$genericDialogue);

            Shell.$overlays.on('click', function (e) {
                if ($(e.target).hasClass('overlays')) {
                    e.preventDefault();
                    $.publish(baseExtension.BaseExtension.CLOSE_ACTIVE_DIALOGUE);
                }
            });

            new genericDialogue.GenericDialogue(Shell.$genericDialogue);
        };

        Shell.prototype.resize = function () {
            _super.prototype.resize.call(this);

            Shell.$overlays.width(this.extension.width());
            Shell.$overlays.height(this.extension.height());

            var mainHeight = this.$element.height() - parseInt(Shell.$mainPanel.css('marginTop')) - Shell.$headerPanel.height() - Shell.$footerPanel.height();

            Shell.$mainPanel.height(mainHeight);
        };
        Shell.SHOW_OVERLAY = 'onShowOverlay';
        Shell.HIDE_OVERLAY = 'onHideOverlay';
        return Shell;
    })(baseView.BaseView);
    exports.Shell = Shell;
});

define('modules/coreplayer-shared-module/baseExtension',["require", "exports", "../../utils", "./shell", "./genericDialogue"], function(require, exports, utils, shell, genericDialogue) {
    var BaseExtension = (function () {
        function BaseExtension(provider) {
            this.isFullScreen = false;
            window.extension = this;

            this.provider = provider;

            this.create();
        }
        BaseExtension.prototype.create = function () {
            var _this = this;
            this.$element = $('#app');

            var $win = $(window);
            this.$element.width($win.width());
            this.$element.height($win.height());

            this.socket = new easyXDM.Socket({
                onMessage: function (message, origin) {
                    message = $.parseJSON(message);
                    _this.handleParentFrameEvent(message);
                }
            });

            this.triggerSocket(BaseExtension.LOAD);

            this.$element.removeClass();
            if (!this.provider.isHomeDomain)
                this.$element.addClass('embedded');
            if (this.provider.isLightbox)
                this.$element.addClass('lightbox');
            this.$element.addClass(this.provider.getSequenceType());

            window.onresize = function () {
                var $win = $(window);
                $('body').height($win.height());

                _this.resize();
            };

            $(document).on('mousemove', function (e) {
                _this.mouseX = e.pageX;
                _this.mouseY = e.pageY;
            });

            this.$element.append('<a href="/" id="top"></a>');

            $.subscribe(BaseExtension.TOGGLE_FULLSCREEN, function () {
                if (!_this.isOverlayActive()) {
                    $('#top').focus();
                    _this.isFullScreen = !_this.isFullScreen;

                    _this.triggerSocket(BaseExtension.TOGGLE_FULLSCREEN, {
                        isFullScreen: _this.isFullScreen,
                        overrideFullScreen: _this.provider.config.options.overrideFullScreen
                    });
                }
            });

            $(document).keyup(function (e) {
                if (e.keyCode === 27)
                    $.publish(BaseExtension.ESCAPE);
                if (e.keyCode === 13)
                    $.publish(BaseExtension.RETURN);
            });

            $.subscribe(BaseExtension.ESCAPE, function () {
                if (_this.isFullScreen) {
                    $.publish(BaseExtension.TOGGLE_FULLSCREEN);
                }
            });

            this.shell = new shell.Shell(this.$element);

            this.canvasIndex = -1;
        };

        BaseExtension.prototype.width = function () {
            return $(window).width();
        };

        BaseExtension.prototype.height = function () {
            return $(window).height();
        };

        BaseExtension.prototype.triggerSocket = function (eventName, eventObject) {
            if (this.socket) {
                this.socket.postMessage(JSON.stringify({ eventName: eventName, eventObject: eventObject }));
            }
        };

        BaseExtension.prototype.redirect = function (uri) {
            this.triggerSocket(BaseExtension.REDIRECT, uri);
        };

        BaseExtension.prototype.refresh = function () {
            this.triggerSocket(BaseExtension.REFRESH, null);
        };

        BaseExtension.prototype.resize = function () {
            $.publish(BaseExtension.RESIZE);
        };

        BaseExtension.prototype.handleParentFrameEvent = function (message) {
            switch (message.eventName) {
                case BaseExtension.TOGGLE_FULLSCREEN:
                    $.publish(BaseExtension.TOGGLE_FULLSCREEN, message.eventObject);
                    break;
            }
        };

        BaseExtension.prototype.getParam = function (key) {
            var value;

            if (this.provider.isDeepLinkingEnabled()) {
                value = utils.Utils.getHashParameter(this.provider.paramMap[key], parent.document);
            }

            if (!value) {
                value = utils.Utils.getQuerystringParameter(this.provider.paramMap[key]);
            }

            return value;
        };

        BaseExtension.prototype.setParam = function (key, value) {
            if (this.provider.isDeepLinkingEnabled()) {
                utils.Utils.setHashParameter(this.provider.paramMap[key], value, parent.document);
            }
        };

        BaseExtension.prototype.viewCanvas = function (canvasIndex, callback) {
            this.provider.canvasIndex = canvasIndex;

            $.publish(BaseExtension.CANVAS_INDEX_CHANGED, [canvasIndex]);

            if (callback)
                callback(canvasIndex);
        };

        BaseExtension.prototype.showDialogue = function (message, acceptCallback, buttonText, allowClose) {
            this.closeActiveDialogue();

            $.publish(genericDialogue.GenericDialogue.SHOW_GENERIC_DIALOGUE, [{
                    message: message,
                    acceptCallback: acceptCallback,
                    buttonText: buttonText,
                    allowClose: allowClose
                }]);
        };

        BaseExtension.prototype.closeActiveDialogue = function () {
            $.publish(BaseExtension.CLOSE_ACTIVE_DIALOGUE);
        };

        BaseExtension.prototype.isOverlayActive = function () {
            return shell.Shell.$overlays.is(':visible');
        };

        BaseExtension.prototype.viewManifest = function (manifest) {
            var seeAlsoUri = this.provider.getManifestSeeAlsoUri(manifest);
            if (seeAlsoUri) {
                window.open(seeAlsoUri, '_blank');
            } else {
                if (this.isFullScreen) {
                    $.publish(BaseExtension.TOGGLE_FULLSCREEN);
                }

                this.triggerSocket(BaseExtension.SEQUENCE_INDEX_CHANGED, manifest.assetSequence);
            }
        };
        BaseExtension.SETTINGS_CHANGED = 'onSettingsChanged';
        BaseExtension.LOAD = 'onLoad';
        BaseExtension.RESIZE = 'onResize';
        BaseExtension.TOGGLE_FULLSCREEN = 'onToggleFullScreen';
        BaseExtension.CANVAS_INDEX_CHANGED = 'onAssetIndexChanged';
        BaseExtension.CLOSE_ACTIVE_DIALOGUE = 'onCloseActiveDialogue';
        BaseExtension.SEQUENCE_INDEX_CHANGED = 'onSequenceIndexChanged';
        BaseExtension.REDIRECT = 'onRedirect';
        BaseExtension.REFRESH = 'onRefresh';
        BaseExtension.RELOAD = 'onReload';
        BaseExtension.ESCAPE = 'onEscape';
        BaseExtension.RETURN = 'onReturn';
        BaseExtension.WINDOW_UNLOAD = 'onWindowUnload';
        BaseExtension.OPEN_MEDIA = 'onOpenMedia';
        BaseExtension.CREATED = 'onCreated';
        BaseExtension.SHOW_MESSAGE = 'onShowMessage';
        BaseExtension.HIDE_MESSAGE = 'onHideMessage';
        return BaseExtension;
    })();
    exports.BaseExtension = BaseExtension;
});

define('modules/coreplayer-shared-module/treeNode',["require", "exports"], function(require, exports) {
    var TreeNode = (function () {
        function TreeNode(label, data) {
            this.label = label;
            this.data = data;
            this.nodes = [];
            if (!data)
                this.data = {};
        }
        TreeNode.prototype.addNode = function (node) {
            this.nodes.push(node);
            node.parentNode = this;
        };
        return TreeNode;
    })();

    
    return TreeNode;
});

define('modules/coreplayer-shared-module/baseProvider',["require", "exports", "../../utils", "./treeNode"], function(require, exports, utils, TreeNode) {
    (function (params) {
        params[params["sequenceIndex"] = 0] = "sequenceIndex";
        params[params["canvasIndex"] = 1] = "canvasIndex";
        params[params["zoom"] = 2] = "zoom";
        params[params["rotation"] = 3] = "rotation";
    })(exports.params || (exports.params = {}));
    var params = exports.params;

    var BaseProvider = (function () {
        function BaseProvider(config, manifest) {
            this.paramMap = ['asi', 'ai', 'z', 'r'];
            this.options = {
                thumbsUriTemplate: "{0}{1}",
                timestampUris: false,
                mediaUriTemplate: "{0}{1}"
            };
            this.config = config;
            this.manifest = manifest;

            this.options.dataBaseUri = utils.Utils.getQuerystringParameter('dbu');

            this.dataUri = utils.Utils.getQuerystringParameter('du');
            this.embedDomain = utils.Utils.getQuerystringParameter('ed');
            this.isHomeDomain = utils.Utils.getQuerystringParameter('hd') === "true";
            this.isOnlyInstance = utils.Utils.getQuerystringParameter('oi') === "true";
            this.embedScriptUri = utils.Utils.getQuerystringParameter('esu');
            this.isReload = utils.Utils.getQuerystringParameter('rl') === "true";
            this.domain = utils.Utils.getQuerystringParameter('d');
            this.isLightbox = utils.Utils.getQuerystringParameter('lb') === "true";

            if (this.isHomeDomain && !this.isReload) {
                this.sequenceIndex = parseInt(utils.Utils.getHashParameter(this.paramMap[0 /* sequenceIndex */], parent.document));
            }

            if (!this.sequenceIndex) {
                this.sequenceIndex = parseInt(utils.Utils.getQuerystringParameter(this.paramMap[0 /* sequenceIndex */])) || 0;
            }

            this.canvasIndex = -1;

            this.load();
        }
        BaseProvider.prototype.load = function () {
            this.sequence = this.manifest.assetSequences[this.sequenceIndex];

            for (var i = 0; i < this.manifest.assetSequences.length; i++) {
                if (this.manifest.assetSequences[i].$ref) {
                    this.manifest.assetSequences[i] = {};
                }
            }

            if (this.manifest.rootStructure) {
                this.parseManifest();
            }

            this.parseStructure();
        };

        BaseProvider.prototype.reload = function (callback) {
            var _this = this;
            var manifestUri = this.dataUri;

            if (this.options.dataBaseUri) {
                manifestUri = this.options.dataBaseUri + this.dataUri;
            }

            manifestUri = this.addTimestamp(manifestUri);

            window.manifestCallback = function (data) {
                _this.manifest = data;

                _this.load();

                callback();
            };

            $.ajax({
                url: manifestUri,
                type: 'GET',
                dataType: 'jsonp',
                jsonp: 'callback',
                jsonpCallback: 'manifestCallback'
            });
        };

        BaseProvider.prototype.getManifestType = function () {
            return this.getRootStructure().sectionType.toLowerCase();
        };

        BaseProvider.prototype.getSequenceType = function () {
            return this.sequence.assetType.replace('/', '-');
        };

        BaseProvider.prototype.getRootStructure = function () {
            return this.sequence.rootSection;
        };

        BaseProvider.prototype.getTitle = function () {
            return this.getRootStructure().title;
        };

        BaseProvider.prototype.getSeeAlso = function () {
            return this.sequence.seeAlso;
        };

        BaseProvider.prototype.isFirstCanvas = function (canvasIndex) {
            if (typeof (canvasIndex) === 'undefined')
                canvasIndex = this.canvasIndex;
            return canvasIndex == 0;
        };

        BaseProvider.prototype.isLastCanvas = function (canvasIndex) {
            if (typeof (canvasIndex) === 'undefined')
                canvasIndex = this.canvasIndex;
            return canvasIndex == this.getTotalCanvases() - 1;
        };

        BaseProvider.prototype.isSeeAlsoEnabled = function () {
            return this.config.options.seeAlsoEnabled !== false;
        };

        BaseProvider.prototype.getCanvasByIndex = function (index) {
            return this.sequence.assets[index];
        };

        BaseProvider.prototype.getCurrentCanvas = function () {
            return this.sequence.assets[this.canvasIndex];
        };

        BaseProvider.prototype.getTotalCanvases = function () {
            return this.sequence.assets.length;
        };

        BaseProvider.prototype.isMultiCanvas = function () {
            return this.sequence.assets.length > 1;
        };

        BaseProvider.prototype.isMultiSequence = function () {
            return this.manifest.assetSequences.length > 1;
        };

        BaseProvider.prototype.isPaged = function () {
            return false;
        };

        BaseProvider.prototype.getMediaUri = function (mediaUri) {
            var baseUri = this.options.mediaBaseUri || "";
            var template = this.options.mediaUriTemplate;
            var uri = String.prototype.format(template, baseUri, mediaUri);

            return uri;
        };

        BaseProvider.prototype.setMediaUri = function (canvas) {
            if (canvas.mediaUri) {
                canvas.mediaUri = this.getMediaUri(canvas.mediaUri);
            } else {
                canvas.mediaUri = this.getMediaUri(canvas.fileUri);
            }
        };

        BaseProvider.prototype.getThumbUri = function (canvas, width, height) {
            return null;
        };

        BaseProvider.prototype.getPagedIndices = function (canvasIndex) {
            if (typeof (canvasIndex) === 'undefined')
                canvasIndex = this.canvasIndex;

            if (this.isFirstCanvas() || this.isLastCanvas()) {
                return [canvasIndex];
            } else if (canvasIndex % 2) {
                return [canvasIndex, canvasIndex + 1];
            } else {
                return [canvasIndex - 1, canvasIndex];
            }
        };

        BaseProvider.prototype.getFirstPageIndex = function () {
            return 0;
        };

        BaseProvider.prototype.getLastPageIndex = function () {
            return this.getTotalCanvases() - 1;
        };

        BaseProvider.prototype.getPrevPageIndex = function (canvasIndex) {
            if (typeof (canvasIndex) === 'undefined')
                canvasIndex = this.canvasIndex;

            var index;

            if (this.isPaged()) {
                var indices = this.getPagedIndices(canvasIndex);
                index = indices[0] - 1;
            } else {
                index = canvasIndex - 1;
            }

            return index;
        };

        BaseProvider.prototype.getNextPageIndex = function (canvasIndex) {
            if (typeof (canvasIndex) === 'undefined')
                canvasIndex = this.canvasIndex;

            var index;

            if (this.isPaged()) {
                var indices = this.getPagedIndices(canvasIndex);
                index = indices.last() + 1;
            } else {
                index = canvasIndex + 1;
            }

            if (index > this.getTotalCanvases() - 1) {
                return -1;
            }

            return index;
        };

        BaseProvider.prototype.getStartCanvasIndex = function () {
            return 0;
        };

        BaseProvider.prototype.parseManifest = function () {
            this.parseManifestation(this.manifest.rootStructure, this.manifest.assetSequences, '');
        };

        BaseProvider.prototype.parseManifestation = function (structure, sequences, path) {
            structure.path = path;

            if (typeof (structure.assetSequence) != 'undefined') {
                var sequence = sequences[structure.assetSequence];

                sequence.index = structure.sequence;
                sequence.structure = structure;
                structure.sequence = sequence;
            }

            if (structure.structures) {
                for (var j = 0; j < structure.structures.length; j++) {
                    this.parseManifestation(structure.structures[j], sequences, path + '/' + j);
                }
            }
        };

        BaseProvider.prototype.parseStructure = function () {
            this.parseStructures(this.getRootStructure(), this.sequence.assets, '');
        };

        BaseProvider.prototype.parseStructures = function (structure, canvases, path) {
            structure.path = path;

            structure.sectionType = this.replaceStructureType(structure.sectionType);

            for (var i = 0; i < structure.assets.length; i++) {
                var index = structure.assets[i];

                var canvas = canvases[index];

                if (!canvas.structures)
                    canvas.structures = [];

                canvas.structures.push(structure);
            }

            if (structure.sections) {
                for (var j = 0; j < structure.sections.length; j++) {
                    this.parseStructures(structure.sections[j], canvases, path + '/' + j);
                }
            }
        };

        BaseProvider.prototype.replaceStructureType = function (structureType) {
            if (this.config.options.sectionMappings && this.config.options.sectionMappings[structureType]) {
                return this.config.options.sectionMappings[structureType];
            }

            return structureType;
        };

        BaseProvider.prototype.getStructureByCanvasIndex = function (index) {
            if (index == -1)
                return null;
            var canvas = this.getCanvasByIndex(index);
            return this.getCanvasStructure(canvas);
        };

        BaseProvider.prototype.getStructureByIndex = function (structure, index) {
            return structure.sections[index];
        };

        BaseProvider.prototype.getCanvasStructure = function (canvas) {
            return canvas.structures.last();
        };

        BaseProvider.prototype.getCanvasOrderLabel = function (canvas) {
            return canvas.orderLabel.trim();
        };

        BaseProvider.prototype.getLastCanvasOrderLabel = function () {
            for (var i = this.sequence.assets.length - 1; i >= 0; i--) {
                var canvas = this.sequence.assets[i];

                var regExp = /\d/;

                if (regExp.test(canvas.orderLabel)) {
                    return canvas.orderLabel;
                }
            }

            return '-';
        };

        BaseProvider.prototype.getStructureIndex = function (path) {
            for (var i = 0; i < this.sequence.assets.length; i++) {
                var canvas = this.sequence.assets[i];
                for (var j = 0; j < canvas.structures.length; j++) {
                    var structure = canvas.structures[j];

                    if (structure.path == path) {
                        return i;
                    }
                }
            }

            return null;
        };

        BaseProvider.prototype.getCanvasIndexByOrderLabel = function (label) {
            var regExp = /(\d*)\D*(\d*)|(\d*)/;
            var match = regExp.exec(label);

            var labelPart1 = match[1];
            var labelPart2 = match[2];

            if (!labelPart1)
                return -1;

            var searchRegExp, regStr;

            if (labelPart2) {
                regStr = "^" + labelPart1 + "\\D*" + labelPart2 + "$";
            } else {
                regStr = "\\D*" + labelPart1 + "\\D*";
            }

            searchRegExp = new RegExp(regStr);

            for (var i = 0; i < this.sequence.assets.length; i++) {
                var canvas = this.sequence.assets[i];

                if (searchRegExp.test(canvas.orderLabel)) {
                    return i;
                }
            }

            return -1;
        };

        BaseProvider.prototype.getManifestSeeAlsoUri = function (manifest) {
            if (manifest.seeAlso && manifest.seeAlso.tag && manifest.seeAlso.data) {
                if (manifest.seeAlso.tag === 'OpenExternal') {
                    return this.getMediaUri(manifest.seeAlso.data);
                }
            }
        };

        BaseProvider.prototype.addTimestamp = function (uri) {
            return uri + "?t=" + utils.Utils.getTimeStamp();
        };

        BaseProvider.prototype.isDeepLinkingEnabled = function () {
            return (this.isHomeDomain && this.isOnlyInstance);
        };

        BaseProvider.prototype.getTree = function () {
            this.treeRoot = new TreeNode('root');
            var rootStructure = this.manifest.rootStructure;

            if (rootStructure) {
                this.parseTreeStructure(this.treeRoot, rootStructure);
            }

            if (!this.sectionsRootNode) {
                this.sectionsRootNode = this.treeRoot;
                this.sectionsRootNode.data = this.sequence.rootSection;
            }

            if (this.sequence.rootSection.sections) {
                for (var i = 0; i < this.sequence.rootSection.sections.length; i++) {
                    var section = this.sequence.rootSection.sections[i];

                    var childNode = new TreeNode();
                    this.sectionsRootNode.addNode(childNode);

                    this.parseTreeSection(childNode, section);
                }
            }

            return this.treeRoot;
        };

        BaseProvider.prototype.parseTreeStructure = function (node, structure) {
            node.label = structure.name || "root";
            node.data = structure;
            node.data.type = "manifest";
            node.data.treeNode = node;

            if (this.sequence.structure == structure) {
                this.sectionsRootNode = node;
                this.sectionsRootNode.selected = true;
                this.sectionsRootNode.expanded = true;
            }

            if (structure.structures) {
                for (var i = 0; i < structure.structures.length; i++) {
                    var childStructure = structure.structures[i];

                    var childNode = new TreeNode();
                    node.addNode(childNode);

                    this.parseTreeStructure(childNode, childStructure);
                }
            }
        };

        BaseProvider.prototype.parseTreeSection = function (node, section) {
            node.label = section.sectionType;
            node.data = section;
            node.data.type = "structure";
            node.data.treeNode = node;

            if (section.sections) {
                for (var i = 0; i < section.sections.length; i++) {
                    var childSection = section.sections[i];

                    var childNode = new TreeNode();
                    node.addNode(childNode);

                    this.parseTreeSection(childNode, childSection);
                }
            }
        };

        BaseProvider.prototype.getThumbs = function () {
            return null;
        };

        BaseProvider.prototype.getDomain = function () {
            var parts = utils.Utils.getUrlParts(this.dataUri);
            return parts.host;
        };

        BaseProvider.prototype.getEmbedDomain = function () {
            return this.embedDomain;
        };

        BaseProvider.prototype.getMetaData = function (callback) {
            callback(null);
        };

        BaseProvider.prototype.defaultToThumbsView = function () {
            var manifestType = this.getManifestType();

            switch (manifestType) {
                case 'monograph':
                    if (!this.isMultiSequence())
                        return true;
                    break;
                case 'archive':
                    return true;
                    break;
                case 'boundmanuscript':
                    return true;
                    break;
                case 'artwork':
                    return true;
            }

            var sequenceType = this.getSequenceType();

            switch (sequenceType) {
                case 'application-pdf':
                    return true;
                    break;
            }

            return false;
        };

        BaseProvider.prototype.getSettings = function () {
            return this.config.options;
        };

        BaseProvider.prototype.updateSettings = function (settings) {
            this.config.options = settings;
        };
        return BaseProvider;
    })();
    exports.BaseProvider = BaseProvider;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('modules/coreplayer-dialogues-module/settingsDialogue',["require", "exports", "../coreplayer-shared-module/dialogue"], function(require, exports, dialogue) {
    var SettingsDialogue = (function (_super) {
        __extends(SettingsDialogue, _super);
        function SettingsDialogue($element) {
            _super.call(this, $element);
        }
        SettingsDialogue.prototype.create = function () {
            var _this = this;
            this.setConfig('settingsDialogue');

            _super.prototype.create.call(this);

            $.subscribe(SettingsDialogue.SHOW_SETTINGS_DIALOGUE, function (e, params) {
                _this.open();
            });

            $.subscribe(SettingsDialogue.HIDE_SETTINGS_DIALOGUE, function (e) {
                _this.close();
            });

            this.$title = $('<h1></h1>');
            this.$content.append(this.$title);

            this.$scroll = $('<div class="scroll"></div>');
            this.$content.append(this.$scroll);

            this.$pagingEnabledCheckbox = $('<input id="pagingEnabled" type="checkbox" />');
            this.$scroll.append(this.$pagingEnabledCheckbox);

            this.$pagingEnabledTitle = $('<label for="pagingEnabled">' + this.content.pagingEnabled + '</label>');
            this.$scroll.append(this.$pagingEnabledTitle);

            this.$title.text(this.content.title);

            var that = this;

            this.$pagingEnabledCheckbox.change(function () {
                var settings = that.getSettings();

                if ($(this).is(":checked")) {
                    settings.pagingEnabled = true;
                } else {
                    settings.pagingEnabled = false;
                }

                that.updateSettings(settings);
            });

            var settings = this.getSettings();

            if (settings.pagingEnabled) {
                this.$pagingEnabledCheckbox.attr("checked", "checked");
            }

            this.$element.hide();
        };

        SettingsDialogue.prototype.getSettings = function () {
            return this.provider.getSettings();
        };

        SettingsDialogue.prototype.updateSettings = function (settings) {
            this.provider.updateSettings(settings);

            $.publish(SettingsDialogue.UPDATE_SETTINGS, [settings]);
        };

        SettingsDialogue.prototype.resize = function () {
            _super.prototype.resize.call(this);
        };
        SettingsDialogue.SHOW_SETTINGS_DIALOGUE = 'onShowSettingsDialogue';
        SettingsDialogue.HIDE_SETTINGS_DIALOGUE = 'onHideSettingsDialogue';
        SettingsDialogue.UPDATE_SETTINGS = 'onUpdateSettings';
        return SettingsDialogue;
    })(dialogue.Dialogue);
    exports.SettingsDialogue = SettingsDialogue;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('modules/coreplayer-shared-module/headerPanel',["require", "exports", "./baseExtension", "./baseView", "../coreplayer-dialogues-module/settingsDialogue"], function(require, exports, baseExtension, baseView, settings) {
    var HeaderPanel = (function (_super) {
        __extends(HeaderPanel, _super);
        function HeaderPanel($element) {
            _super.call(this, $element, false, false);
        }
        HeaderPanel.prototype.create = function () {
            var _this = this;
            this.setConfig('headerPanel');

            _super.prototype.create.call(this);

            $.subscribe(baseExtension.BaseExtension.SHOW_MESSAGE, function (e, message) {
                _this.showMessage(message);
            });

            $.subscribe(baseExtension.BaseExtension.HIDE_MESSAGE, function () {
                _this.hideMessage();
            });

            this.$options = $('<div class="options"></div>');
            this.$element.append(this.$options);

            this.$centerOptions = $('<div class="centerOptions"></div>');
            this.$options.append(this.$centerOptions);

            this.$rightOptions = $('<div class="rightOptions"></div>');
            this.$options.append(this.$rightOptions);

            this.$settingsButton = $('<a class="imageBtn settings"></a>');
            this.$rightOptions.append(this.$settingsButton);

            this.$messageBox = $('<div class="messageBox"> \
                                <div class="text"></div> \
                                <div class="close"></div> \
                              </div>');

            this.$element.append(this.$messageBox);

            this.$messageBox.hide();
            this.$messageBox.find('.close').attr('title', this.content.close);
            this.$messageBox.find('.close').on('click', function (e) {
                e.preventDefault();
                _this.hideMessage();
            });

            this.$settingsButton.click(function (e) {
                e.preventDefault();

                $.publish(settings.SettingsDialogue.SHOW_SETTINGS_DIALOGUE);
            });
        };

        HeaderPanel.prototype.showMessage = function (message) {
            this.message = message;
            this.$messageBox.find('.text').html(message).find('a').attr('target', '_top');
            this.$messageBox.show();
            this.$element.addClass('showMessage');
            this.extension.resize();
        };

        HeaderPanel.prototype.hideMessage = function () {
            this.$element.removeClass('showMessage');
            this.$messageBox.hide();
            this.extension.resize();
        };

        HeaderPanel.prototype.resize = function () {
            _super.prototype.resize.call(this);

            var headerWidth = this.$element.width();
            var center = headerWidth / 2;
            var containerWidth = this.$centerOptions.outerWidth();
            var pos = center - (containerWidth / 2);

            this.$centerOptions.css({
                left: pos
            });

            if (this.$messageBox.is(':visible')) {
                var $text = this.$messageBox.find('.text');

                $text.width(this.$element.width() - this.$messageBox.find('.close').outerWidth(true));
                $text.ellipsisFill(this.message);
            }
        };
        return HeaderPanel;
    })(baseView.BaseView);
    exports.HeaderPanel = HeaderPanel;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('modules/coreplayer-pagingheaderpanel-module/pagingHeaderPanel',["require", "exports", "../coreplayer-shared-module/baseExtension", "../../extensions/coreplayer-seadragon-extension/extension", "../coreplayer-shared-module/headerPanel"], function(require, exports, baseExtension, extension, baseHeader) {
    var PagingHeaderPanel = (function (_super) {
        __extends(PagingHeaderPanel, _super);
        function PagingHeaderPanel($element) {
            _super.call(this, $element);
            this.firstButtonEnabled = false;
            this.lastButtonEnabled = false;
            this.prevButtonEnabled = false;
            this.nextButtonEnabled = false;
        }
        PagingHeaderPanel.prototype.create = function () {
            var _this = this;
            this.setConfig('pagingHeaderPanel');

            _super.prototype.create.call(this);

            $.subscribe(baseExtension.BaseExtension.CANVAS_INDEX_CHANGED, function (e, canvasIndex) {
                _this.canvasIndexChanged(canvasIndex);
            });

            $.subscribe(extension.Extension.SETTINGS_CHANGED, function (e, mode) {
                _this.modeChanged(mode);
            });

            this.$prevOptions = $('<div class="prevOptions"></div>');
            this.$centerOptions.append(this.$prevOptions);

            this.$firstButton = $('<a class="imageBtn first"></a>');
            this.$prevOptions.append(this.$firstButton);

            this.$prevButton = $('<a class="imageBtn prev"></a>');
            this.$prevOptions.append(this.$prevButton);

            this.$modeOptions = $('<div class="mode"></div>');
            this.$centerOptions.append(this.$modeOptions);

            this.$imageModeLabel = $('<label for="image">' + this.content.image + '</label>');
            this.$modeOptions.append(this.$imageModeLabel);
            this.$imageModeOption = $('<input type="radio" id="image" name="mode"></input>');
            this.$modeOptions.append(this.$imageModeOption);

            this.$pageModeLabel = $('<label for="page">' + this.content.page + '</label>');
            this.$modeOptions.append(this.$pageModeLabel);
            this.$pageModeOption = $('<input type="radio" id="page" name="mode"></input>');
            this.$modeOptions.append(this.$pageModeOption);

            this.$search = $('<div class="search"></div>');
            this.$centerOptions.append(this.$search);

            this.$searchText = $('<input class="searchText" maxlength="5" type="text"></input>');
            this.$search.append(this.$searchText);

            this.$total = $('<span class="total"></span>');
            this.$search.append(this.$total);

            this.$searchButton = $('<a class="imageBtn go"></a>');
            this.$search.append(this.$searchButton);

            this.$nextOptions = $('<div class="nextOptions"></div>');
            this.$centerOptions.append(this.$nextOptions);

            this.$nextButton = $('<a class="imageBtn next"></a>');
            this.$nextOptions.append(this.$nextButton);

            this.$lastButton = $('<a class="imageBtn last"></a>');
            this.$nextOptions.append(this.$lastButton);

            if (this.extension.getMode() == extension.Extension.PAGE_MODE) {
                this.$pageModeOption.attr('checked', 'checked');
                this.$pageModeOption.removeAttr('disabled');
                this.$pageModeLabel.removeClass('disabled');
            } else {
                this.$imageModeOption.attr('checked', 'checked');

                this.$pageModeOption.attr('disabled', 'disabled');
                this.$pageModeLabel.addClass('disabled');
            }

            this.setTitles();

            this.setTotal();

            if (this.provider.getTotalCanvases() == 1) {
                this.$centerOptions.hide();
            }

            this.$firstButton.on('click', function (e) {
                e.preventDefault();

                $.publish(PagingHeaderPanel.FIRST);
            });

            this.$prevButton.on('click', function (e) {
                e.preventDefault();

                $.publish(PagingHeaderPanel.PREV);
            });

            this.$nextButton.on('click', function (e) {
                e.preventDefault();

                $.publish(PagingHeaderPanel.NEXT);
            });

            this.$imageModeOption.on('click', function (e) {
                $.publish(PagingHeaderPanel.MODE_CHANGED, [extension.Extension.IMAGE_MODE]);
            });

            this.$pageModeOption.on('click', function (e) {
                $.publish(PagingHeaderPanel.MODE_CHANGED, [extension.Extension.PAGE_MODE]);
            });

            this.$searchText.on('keyup', function (e) {
                if (e.keyCode == 13) {
                    e.preventDefault();
                    _this.$searchText.blur();

                    setTimeout(function () {
                        _this.search();
                    }, 1);
                }
            });

            this.$searchButton.on('click', function (e) {
                e.preventDefault();

                _this.search();
            });

            this.$lastButton.on('click', function (e) {
                e.preventDefault();

                $.publish(PagingHeaderPanel.LAST);
            });

            if (this.options.modeOptionsEnabled === false) {
                this.$modeOptions.hide();
                this.$centerOptions.addClass('modeOptionsDisabled');
            }

            if (this.options.helpEnabled === false) {
                this.$helpButton.hide();
            }
        };

        PagingHeaderPanel.prototype.setTitles = function () {
            var mode;

            if (this.extension.getMode() === extension.Extension.PAGE_MODE) {
                mode = "page";
            } else {
                mode = "image";
            }

            this.$firstButton.prop('title', this.content.first + " " + mode);
            this.$prevButton.prop('title', this.content.previous + " " + mode);
            this.$nextButton.prop('title', this.content.next + " " + mode);
            this.$lastButton.prop('title', this.content.last + " " + mode);
            this.$searchButton.prop('title', this.content.go);
        };

        PagingHeaderPanel.prototype.setTotal = function () {
            var of = this.content.of;

            if (this.extension.getMode() === extension.Extension.PAGE_MODE) {
                this.$total.html(String.prototype.format(of, this.provider.getLastCanvasOrderLabel()));
            } else {
                this.$total.html(String.prototype.format(of, this.provider.getTotalCanvases()));
            }
        };

        PagingHeaderPanel.prototype.setSearchPlaceholder = function (index) {
            var canvas = this.provider.getCanvasByIndex(index);

            if (this.extension.getMode() === extension.Extension.PAGE_MODE) {
                var orderLabel = this.provider.getCanvasOrderLabel(canvas);

                if (orderLabel === "-") {
                    this.$searchText.val("");
                } else {
                    this.$searchText.val(orderLabel);
                }
            } else {
                index++;
                this.$searchText.val(index);
            }
        };

        PagingHeaderPanel.prototype.search = function () {
            var value = this.$searchText.val();

            if (!value) {
                this.extension.showDialogue(this.content.emptyValue);

                return;
            }

            if (this.extension.getMode() === extension.Extension.PAGE_MODE) {
                $.publish(PagingHeaderPanel.PAGE_SEARCH, [value]);
            } else {
                var index = parseInt(this.$searchText.val());

                if (isNaN(index)) {
                    this.extension.showDialogue(this.provider.config.modules.genericDialogue.content.invalidNumber);
                    return;
                }

                var asset = this.provider.getCanvasByIndex(index);

                if (!asset) {
                    this.extension.showDialogue(this.provider.config.modules.genericDialogue.content.pageNotFound);
                    return;
                }

                index--;
                $.publish(PagingHeaderPanel.IMAGE_SEARCH, [index]);
            }
        };

        PagingHeaderPanel.prototype.canvasIndexChanged = function (index) {
            this.setSearchPlaceholder(index);

            if (this.provider.isFirstCanvas()) {
                this.disableFirstButton();
                this.disablePrevButton();
            } else {
                this.enableFirstButton();
                this.enablePrevButton();
            }

            if (this.provider.isLastCanvas()) {
                this.disableLastButton();
                this.disableNextButton();
            } else {
                this.enableLastButton();
                this.enableNextButton();
            }
        };

        PagingHeaderPanel.prototype.disableFirstButton = function () {
            this.firstButtonEnabled = false;
            this.$firstButton.addClass('disabled');
        };

        PagingHeaderPanel.prototype.enableFirstButton = function () {
            this.firstButtonEnabled = true;
            this.$firstButton.removeClass('disabled');
        };

        PagingHeaderPanel.prototype.disableLastButton = function () {
            this.lastButtonEnabled = false;
            this.$lastButton.addClass('disabled');
        };

        PagingHeaderPanel.prototype.enableLastButton = function () {
            this.lastButtonEnabled = true;
            this.$lastButton.removeClass('disabled');
        };

        PagingHeaderPanel.prototype.disablePrevButton = function () {
            this.prevButtonEnabled = false;
            this.$prevButton.addClass('disabled');
        };

        PagingHeaderPanel.prototype.enablePrevButton = function () {
            this.prevButtonEnabled = true;
            this.$prevButton.removeClass('disabled');
        };

        PagingHeaderPanel.prototype.disableNextButton = function () {
            this.nextButtonEnabled = false;
            this.$nextButton.addClass('disabled');
        };

        PagingHeaderPanel.prototype.enableNextButton = function () {
            this.nextButtonEnabled = true;
            this.$nextButton.removeClass('disabled');
        };

        PagingHeaderPanel.prototype.modeChanged = function (mode) {
            this.setSearchPlaceholder(this.provider.canvasIndex);
            this.setTitles();
            this.setTotal();
        };

        PagingHeaderPanel.prototype.resize = function () {
            _super.prototype.resize.call(this);
        };
        PagingHeaderPanel.FIRST = 'header.onFirst';
        PagingHeaderPanel.LAST = 'header.onLast';
        PagingHeaderPanel.PREV = 'header.onPrev';
        PagingHeaderPanel.NEXT = 'header.onNext';
        PagingHeaderPanel.PAGE_SEARCH = 'header.onPageSearch';
        PagingHeaderPanel.IMAGE_SEARCH = 'header.onImageSearch';
        PagingHeaderPanel.MODE_CHANGED = 'header.onModeChanged';
        return PagingHeaderPanel;
    })(baseHeader.HeaderPanel);
    exports.PagingHeaderPanel = PagingHeaderPanel;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('modules/coreplayer-shared-module/baseExpandPanel',["require", "exports", "../../utils", "./baseView"], function(require, exports, utils, baseView) {
    var BaseExpandPanel = (function (_super) {
        __extends(BaseExpandPanel, _super);
        function BaseExpandPanel($element) {
            _super.call(this, $element, false, true);
            this.isExpanded = false;
            this.isFullyExpanded = false;
            this.isUnopened = true;
        }
        BaseExpandPanel.prototype.create = function () {
            var _this = this;
            this.setConfig('shared');

            _super.prototype.create.call(this);

            this.$top = utils.Utils.createDiv('top');
            this.$element.append(this.$top);

            this.$title = utils.Utils.createDiv('title');
            this.$top.append(this.$title);

            this.$expandFullButton = $('<a class="expandFullButton"></a>');
            this.$top.append(this.$expandFullButton);

            this.$collapseButton = utils.Utils.createDiv('collapseButton');
            this.$top.append(this.$collapseButton);

            this.$closed = utils.Utils.createDiv('closed');
            this.$element.append(this.$closed);

            this.$expandButton = $('<a class="expandButton"></a>');
            this.$closed.append(this.$expandButton);

            this.$closedTitle = $('<a class="title"></a>');
            this.$closed.append(this.$closedTitle);

            this.$main = utils.Utils.createDiv('main');
            this.$element.append(this.$main);

            this.$expandButton.on('click', function (e) {
                e.preventDefault();

                _this.toggle();
            });

            this.$expandFullButton.on('click', function (e) {
                e.preventDefault();

                _this.expandFull();
            });

            this.$closedTitle.on('click', function (e) {
                e.preventDefault();

                _this.toggle();
            });

            this.$title.on('click', function (e) {
                e.preventDefault();

                _this.toggle();
            });

            this.$collapseButton.on('click', function (e) {
                e.preventDefault();

                if (_this.isFullyExpanded) {
                    _this.collapseFull();
                } else {
                    _this.toggle();
                }
            });

            this.$top.hide();
            this.$main.hide();
        };

        BaseExpandPanel.prototype.init = function () {
            _super.prototype.init.call(this);
        };

        BaseExpandPanel.prototype.toggle = function () {
            var _this = this;
            if (this.isExpanded) {
                this.$top.hide();
                this.$main.hide();
                this.$closed.show();
            }

            var targetWidth = this.getTargetWidth();
            var targetLeft = this.getTargetLeft();

            this.$element.stop().animate({
                width: targetWidth,
                left: targetLeft
            }, this.options.panelAnimationDuration, function () {
                _this.toggled();
            });
        };

        BaseExpandPanel.prototype.toggled = function () {
            this.toggleStart();

            this.isExpanded = !this.isExpanded;

            if (this.isExpanded) {
                this.$closed.hide();
                this.$top.show();
                this.$main.show();
            }

            this.toggleFinish();

            this.isUnopened = false;
        };

        BaseExpandPanel.prototype.expandFull = function () {
            var _this = this;
            var targetWidth = this.getFullTargetWidth();
            var targetLeft = this.getFullTargetLeft();

            this.expandFullStart();

            this.$element.stop().animate({
                width: targetWidth,
                left: targetLeft
            }, this.options.panelAnimationDuration, function () {
                _this.expandFullFinish();
            });
        };

        BaseExpandPanel.prototype.collapseFull = function () {
            var _this = this;
            var targetWidth = this.getTargetWidth();
            var targetLeft = this.getTargetLeft();

            this.collapseFullStart();

            this.$element.stop().animate({
                width: targetWidth,
                left: targetLeft
            }, this.options.panelAnimationDuration, function () {
                _this.collapseFullFinish();
            });
        };

        BaseExpandPanel.prototype.getTargetWidth = function () {
            return 0;
        };

        BaseExpandPanel.prototype.getTargetLeft = function () {
            return 0;
        };

        BaseExpandPanel.prototype.getFullTargetWidth = function () {
            return 0;
        };

        BaseExpandPanel.prototype.getFullTargetLeft = function () {
            return 0;
        };

        BaseExpandPanel.prototype.toggleStart = function () {
        };

        BaseExpandPanel.prototype.toggleFinish = function () {
        };

        BaseExpandPanel.prototype.expandFullStart = function () {
        };

        BaseExpandPanel.prototype.expandFullFinish = function () {
            this.isFullyExpanded = true;
            this.$expandFullButton.hide();
        };

        BaseExpandPanel.prototype.collapseFullStart = function () {
        };

        BaseExpandPanel.prototype.collapseFullFinish = function () {
            this.isFullyExpanded = false;
            this.$expandFullButton.show();
        };

        BaseExpandPanel.prototype.resize = function () {
            _super.prototype.resize.call(this);

            this.$main.height(this.$element.parent().height() - this.$top.outerHeight(true));
        };
        return BaseExpandPanel;
    })(baseView.BaseView);
    exports.BaseExpandPanel = BaseExpandPanel;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('modules/coreplayer-shared-module/leftPanel',["require", "exports", "./baseExpandPanel"], function(require, exports, baseExpandPanel) {
    var LeftPanel = (function (_super) {
        __extends(LeftPanel, _super);
        function LeftPanel($element) {
            _super.call(this, $element);
        }
        LeftPanel.prototype.create = function () {
            _super.prototype.create.call(this);

            this.$element.width(this.options.panelCollapsedWidth);
        };

        LeftPanel.prototype.init = function () {
            _super.prototype.init.call(this);

            if (this.options.panelOpen && this.provider.isHomeDomain) {
                this.toggle();
            }
        };

        LeftPanel.prototype.getTargetWidth = function () {
            if (this.isFullyExpanded || !this.isExpanded) {
                return this.options.panelExpandedWidth;
            } else {
                return this.options.panelCollapsedWidth;
            }
        };

        LeftPanel.prototype.getFullTargetWidth = function () {
            return this.$element.parent().width();
        };

        LeftPanel.prototype.toggleFinish = function () {
            _super.prototype.toggleFinish.call(this);

            if (this.isExpanded) {
                $.publish(LeftPanel.OPEN_LEFT_PANEL);
            } else {
                $.publish(LeftPanel.CLOSE_LEFT_PANEL);
            }
        };

        LeftPanel.prototype.resize = function () {
            _super.prototype.resize.call(this);

            if (this.isFullyExpanded) {
                this.$element.width(this.$element.parent().width());
            }
        };
        LeftPanel.OPEN_LEFT_PANEL = 'onOpenLeftPanel';
        LeftPanel.CLOSE_LEFT_PANEL = 'onCloseLeftPanel';
        return LeftPanel;
    })(baseExpandPanel.BaseExpandPanel);
    exports.LeftPanel = LeftPanel;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('modules/coreplayer-treeviewleftpanel-module/treeView',["require", "exports", "../coreplayer-shared-module/baseView", "../coreplayer-shared-module/baseExtension"], function(require, exports, baseView, baseExtension) {
    var TreeView = (function (_super) {
        __extends(TreeView, _super);
        function TreeView($element) {
            _super.call(this, $element, true, true);
            this.isOpen = false;
        }
        TreeView.prototype.create = function () {
            var _this = this;
            _super.prototype.create.call(this);

            $.subscribe(baseExtension.BaseExtension.CANVAS_INDEX_CHANGED, function (e, canvasIndex) {
                _this.selectTreeNodeFromCanvasIndex(canvasIndex);
            });

            this.$tree = $('<ul class="tree"></ul>');
            this.$element.append(this.$tree);

            $.templates({
                pageTemplate: '{^{for nodes}}\
                               {^{tree/}}\
                           {{/for}}',
                treeTemplate: '<li>\
                               {^{if nodes && nodes.length}}\
                                   {^{if expanded}}\
                                       <div class="toggle expanded"></div>\
                                   {{else}}\
                                       <div class="toggle"></div>\
                                   {{/if}}\
                               {{else}}\
                                   <div class="spacer"></div>\
                               {{/if}}\
                               {^{if selected}}\
                                   <a href="#" class="selected">{{>label}}</a>\
                               {{else}}\
                                   <a href="#">{{>label}}</a>\
                               {{/if}}\
                           </li>\
                           {^{if expanded}}\
                               <li>\
                                   <ul>\
                                       {^{for nodes}}\
                                           {^{tree/}}\
                                       {{/for}}\
                                   </ul>\
                               </li>\
                           {{/if}}'
            });

            $.views.tags({
                tree: {
                    toggle: function () {
                        $.observable(this.data).setProperty("expanded", !this.data.expanded);
                    },
                    init: function (tagCtx, linkCtx, ctx) {
                        this.data = tagCtx.view.data;
                    },
                    onAfterLink: function () {
                        var self = this;

                        self.contents("li").first().on("click", ".toggle", function () {
                            self.toggle();
                        }).on("click", "a", function (e) {
                            e.preventDefault();

                            if (self.data.nodes.length) {
                                self.toggle();
                            }

                            $.publish(TreeView.NODE_SELECTED, [self.data.data]);
                        });
                    },
                    template: $.templates.treeTemplate
                }
            });
        };

        TreeView.prototype.dataBind = function () {
            if (!this.rootNode)
                return;

            this.$tree.link($.templates.pageTemplate, this.rootNode);
            this.resize();
        };

        TreeView.prototype.selectPath = function (path) {
            if (!this.rootNode)
                return;

            var pathArr = path.split("/");
            if (pathArr.length >= 1)
                pathArr.shift();
            var node = this.getNodeByPath(this.rootNode, pathArr);

            this.selectNode(node);
        };

        TreeView.prototype.selectTreeNodeFromCanvasIndex = function (index) {
            if (index == -1)
                return;

            this.deselectCurrentNode();

            var structure = this.provider.getStructureByCanvasIndex(index);

            if (!structure)
                return;

            if (structure.treeNode)
                this.selectNode(structure.treeNode);
        };

        TreeView.prototype.deselectCurrentNode = function () {
            if (this.selectedNode)
                $.observable(this.selectedNode).setProperty("selected", false);
        };

        TreeView.prototype.selectNode = function (node) {
            if (!this.rootNode)
                return;

            this.selectedNode = node;
            $.observable(this.selectedNode).setProperty("selected", true);

            this.expandParents(this.selectedNode);
        };

        TreeView.prototype.expandParents = function (node) {
            if (!node.parentNode)
                return;

            $.observable(node.parentNode).setProperty("expanded", true);
            this.expandParents(node.parentNode);
        };

        TreeView.prototype.getNodeByPath = function (parentNode, path) {
            if (path.length == 0)
                return parentNode;
            var index = path.shift();
            var node = parentNode.nodes[index];
            return this.getNodeByPath(node, path);
        };

        TreeView.prototype.show = function () {
            this.isOpen = true;
            this.$element.show();
        };

        TreeView.prototype.hide = function () {
            this.isOpen = false;
            this.$element.hide();
        };

        TreeView.prototype.resize = function () {
            _super.prototype.resize.call(this);
        };
        TreeView.NODE_SELECTED = 'treeView.onNodeSelected';
        return TreeView;
    })(baseView.BaseView);
    exports.TreeView = TreeView;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('modules/coreplayer-treeviewleftpanel-module/thumbsView',["require", "exports", "../../utils", "../coreplayer-shared-module/baseExtension", "../../extensions/coreplayer-seadragon-extension/extension", "../coreplayer-shared-module/baseView"], function(require, exports, utils, baseExtension, extension, baseView) {
    var ThumbsView = (function (_super) {
        __extends(ThumbsView, _super);
        function ThumbsView($element) {
            _super.call(this, $element, true, true);
            this.isOpen = false;
        }
        ThumbsView.prototype.create = function () {
            var _this = this;
            this.setConfig('treeViewLeftPanel');

            _super.prototype.create.call(this);

            $.subscribe(baseExtension.BaseExtension.CANVAS_INDEX_CHANGED, function (e, index) {
                _this.selectIndex(parseInt(index));
            });

            $.subscribe(extension.Extension.SETTINGS_CHANGED, function (e, mode) {
                _this.setLabel();
            });

            this.$thumbs = utils.Utils.createDiv('thumbs');
            this.$element.append(this.$thumbs);

            $.templates({
                thumbsTemplate: '<div class="{{:~className()}}" data-src="{{>url}}" data-visible="{{>visible}}">\
                                <div class="wrap" style="height:{{>height + ~extraHeight()}}px"></div>\
                                <span class="index">{{:#index + 1}}</span>\
                                <span class="label">{{>label}}&nbsp;</span>\
                             </div>\
                             {{if ~isOdd(#index + 1)}} \
                                 <div class="separator"></div> \
                             {{/if}}'
            });

            var extraHeight = this.options.thumbsExtraHeight;

            $.views.helpers({
                isOdd: function (num) {
                    return (num % 2 == 0) ? false : true;
                },
                extraHeight: function () {
                    return extraHeight;
                },
                className: function () {
                    if (this.data.url) {
                        return "thumb";
                    }

                    return "thumb placeholder";
                }
            });

            this.$element.on('scroll', function () {
                _this.scrollStop();
            }, 1000);

            this.resize();
        };

        ThumbsView.prototype.dataBind = function () {
            if (!this.thumbs)
                return;
            this.createThumbs();
        };

        ThumbsView.prototype.createThumbs = function () {
            var that = this;

            if (!this.thumbs)
                return;

            this.$thumbs.link($.templates.thumbsTemplate, this.thumbs);

            this.$thumbs.delegate(".thumb", "click", function (e) {
                e.preventDefault();

                var data = $.view(this).data;

                that.lastThumbClickedIndex = data.index;

                $.publish(ThumbsView.THUMB_SELECTED, [data.index]);
            });

            this.selectIndex(this.provider.canvasIndex);

            this.setLabel();

            this.loadThumbs(0);
        };

        ThumbsView.prototype.scrollStop = function () {
            var scrollPos = 1 / ((this.$thumbs.height() - this.$element.height()) / this.$element.scrollTop());

            if (scrollPos > 1)
                scrollPos = 1;

            var thumbRangeMid = Math.floor((this.thumbs.length - 1) * scrollPos);

            this.loadThumbs(thumbRangeMid);
        };

        ThumbsView.prototype.loadThumbs = function (index) {
            if (!this.thumbs || !this.thumbs.length)
                return;

            index = parseInt(index);

            var thumbRangeMid = index;
            var thumbLoadRange = this.options.thumbsLoadRange;

            var thumbRange = {
                start: (thumbRangeMid > thumbLoadRange) ? thumbRangeMid - thumbLoadRange : 0,
                end: (thumbRangeMid < (this.thumbs.length - 1) - thumbLoadRange) ? thumbRangeMid + thumbLoadRange : this.thumbs.length - 1
            };

            var fadeDuration = this.options.thumbsImageFadeInDuration;

            for (var i = thumbRange.start; i <= thumbRange.end; i++) {
                var thumbElem = $(this.$thumbs.find('.thumb')[i]);
                var imgCont = thumbElem.find('.wrap');

                if (!imgCont.hasClass('loading') && !imgCont.hasClass('loaded')) {
                    var visible = thumbElem.attr('data-visible');

                    if (visible !== "false") {
                        imgCont.addClass('loading');
                        var src = thumbElem.attr('data-src');

                        var img = $('<img src="' + src + '" />');

                        $(img).hide().load(function () {
                            $(this).fadeIn(fadeDuration, function () {
                                $(this).parent().swapClass('loading', 'loaded');
                            });
                        });
                        imgCont.append(img);
                    } else {
                        imgCont.addClass('hidden');
                    }
                }
            }
        };

        ThumbsView.prototype.show = function () {
            var _this = this;
            this.isOpen = true;
            this.$element.show();

            setTimeout(function () {
                _this.selectIndex(_this.provider.canvasIndex);
            }, 1);
        };

        ThumbsView.prototype.hide = function () {
            this.isOpen = false;
            this.$element.hide();
        };

        ThumbsView.prototype.isPDF = function () {
            return (this.provider.getSequenceType() === "application-pdf");
        };

        ThumbsView.prototype.setLabel = function () {
            if (this.isPDF()) {
                $(this.$thumbs).find('span.index').hide();
                $(this.$thumbs).find('span.label').hide();
            } else {
                if (this.extension.getMode() == extension.Extension.PAGE_MODE) {
                    $(this.$thumbs).find('span.index').hide();
                    $(this.$thumbs).find('span.label').show();
                } else {
                    $(this.$thumbs).find('span.index').show();
                    $(this.$thumbs).find('span.label').hide();
                }
            }
        };

        ThumbsView.prototype.selectIndex = function (index) {
            var _this = this;
            if (index == -1)
                return;

            if (!this.thumbs || !this.thumbs.length)
                return;

            index = parseInt(index);

            this.$thumbs.find('.thumb').removeClass('selected');

            this.$selectedThumb = $(this.$thumbs.find('.thumb')[index]);

            if (this.provider.isPaged()) {
                var indices = this.provider.getPagedIndices(index);

                _.each(indices, function (index) {
                    $(_this.$thumbs.find('.thumb')[index]).addClass('selected');
                });
            } else {
                this.$selectedThumb.addClass('selected');
            }

            if (this.lastThumbClickedIndex != index) {
                var scrollTop = this.$element.scrollTop() + this.$selectedThumb.position().top - (this.$selectedThumb.height() / 2);
                this.$element.scrollTop(scrollTop);
            }

            this.loadThumbs(index);
        };

        ThumbsView.prototype.resize = function () {
            _super.prototype.resize.call(this);
        };
        ThumbsView.THUMB_SELECTED = 'thumbsView.onThumbSelected';
        return ThumbsView;
    })(baseView.BaseView);
    exports.ThumbsView = ThumbsView;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('modules/coreplayer-treeviewleftpanel-module/galleryView',["require", "exports", "../../utils", "../coreplayer-shared-module/baseExtension", "../../extensions/coreplayer-seadragon-extension/extension", "../coreplayer-shared-module/baseView"], function(require, exports, utils, baseExtension, extension, baseView) {
    var GalleryView = (function (_super) {
        __extends(GalleryView, _super);
        function GalleryView($element) {
            _super.call(this, $element, true, true);
            this.isOpen = false;
        }
        GalleryView.prototype.create = function () {
            var _this = this;
            this.setConfig('treeViewLeftPanel');

            _super.prototype.create.call(this);

            $.subscribe(baseExtension.BaseExtension.CANVAS_INDEX_CHANGED, function (e, index) {
                _this.selectIndex(parseInt(index));
            });

            $.subscribe(extension.Extension.SETTINGS_CHANGED, function () {
                _this.setLabel();
            });

            this.$thumbs = utils.Utils.createDiv('thumbs');
            this.$element.append(this.$thumbs);

            $.templates({
                galleryThumbsTemplate: '<div class="{{:~className()}}" data-src="{{>url}}" data-visible="{{>visible}}">\
                                <div class="wrap" style="height:{{>height + ~extraHeight()}}px"></div>\
                                <span class="index">{{:#index + 1}}</span>\
                                <span class="label">{{>label}}&nbsp;</span>\
                             </div>'
            });

            var extraHeight = this.options.thumbsExtraHeight;

            $.views.helpers({
                isOdd: function (num) {
                    return (num % 2 == 0) ? false : true;
                },
                extraHeight: function () {
                    return extraHeight;
                },
                className: function () {
                    if (this.data.url) {
                        return "thumb";
                    }

                    return "thumb placeholder";
                }
            });

            this.$element.on('scroll', function () {
                _this.loadThumbs();
            }, 1000);

            this.resize();
        };

        GalleryView.prototype.dataBind = function () {
            if (!this.thumbs)
                return;
            this.createThumbs();
        };

        GalleryView.prototype.createThumbs = function () {
            var that = this;

            if (!this.thumbs)
                return;

            this.$thumbs.link($.templates.galleryThumbsTemplate, this.thumbs);

            this.$thumbs.delegate(".thumb", "click", function (e) {
                e.preventDefault();

                var data = $.view(this).data;

                that.lastThumbClickedIndex = data.index;

                $.publish(GalleryView.THUMB_SELECTED, [data.index]);
            });

            this.selectIndex(this.provider.canvasIndex);

            this.setLabel();

            this.loadThumbs();
        };

        GalleryView.prototype.loadThumbs = function () {
            if (!this.thumbs || !this.thumbs.length)
                return;

            var thumbs = this.$thumbs.find('.thumb');
            var scrollTop = this.$element.scrollTop();
            var scrollHeight = this.$element.height();

            for (var i = 0; i < thumbs.length; i++) {
                var $thumb = $(thumbs[i]);
                var thumbTop = $thumb.position().top;
                var thumbBottom = thumbTop + $thumb.height();

                if (thumbBottom >= scrollTop && thumbTop <= scrollTop + scrollHeight) {
                    this.loadThumb($thumb);
                }
            }
        };

        GalleryView.prototype.loadThumb = function ($thumb) {
            var fadeDuration = this.options.thumbsImageFadeInDuration;

            var $wrap = $thumb.find('.wrap');

            var visible = $thumb.attr('data-visible');

            if (visible !== "false") {
                $wrap.addClass('loading');
                var src = $thumb.attr('data-src');
                var img = $('<img src="' + src + '" />');

                $(img).hide().load(function () {
                    $(this).fadeIn(fadeDuration, function () {
                        $(this).parent().swapClass('loading', 'loaded');
                    });
                });
                $wrap.append(img);
            } else {
                $wrap.addClass('hidden');
            }
        };

        GalleryView.prototype.show = function () {
            var _this = this;
            this.isOpen = true;
            this.$element.show();

            setTimeout(function () {
                _this.selectIndex(_this.provider.canvasIndex);
            }, 1);
        };

        GalleryView.prototype.hide = function () {
            this.isOpen = false;
            this.$element.hide();
        };

        GalleryView.prototype.setLabel = function () {
            if (this.extension.getMode() == extension.Extension.PAGE_MODE) {
                $(this.$thumbs).find('span.index').hide();
                $(this.$thumbs).find('span.label').show();
            } else {
                $(this.$thumbs).find('span.index').show();
                $(this.$thumbs).find('span.label').hide();
            }
        };

        GalleryView.prototype.selectIndex = function (index) {
            if (index == -1)
                return;

            if (!this.thumbs || !this.thumbs.length)
                return;

            index = parseInt(index);

            this.$thumbs.find('.thumb').removeClass('selected');

            this.$selectedThumb = $(this.$thumbs.find('.thumb')[index]);

            this.$selectedThumb.addClass('selected');

            if (this.lastThumbClickedIndex != index) {
                var scrollTop = this.$element.scrollTop() + this.$selectedThumb.position().top - (this.$selectedThumb.height() / 2);
                this.$element.scrollTop(scrollTop);
            }

            this.loadThumbs();
        };

        GalleryView.prototype.resize = function () {
            _super.prototype.resize.call(this);

            this.loadThumbs();
        };
        GalleryView.THUMB_SELECTED = 'galleryView.onThumbSelected';
        return GalleryView;
    })(baseView.BaseView);
    exports.GalleryView = GalleryView;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('modules/coreplayer-treeviewleftpanel-module/treeViewLeftPanel',["require", "exports", "../coreplayer-shared-module/leftPanel", "../../utils", "./treeView", "./thumbsView", "./galleryView", "../../extensions/coreplayer-seadragon-extension/extension", "../coreplayer-shared-module/baseExtension"], function(require, exports, baseLeft, utils, tree, thumbs, gallery, extension, baseExtension) {
    var TreeViewLeftPanel = (function (_super) {
        __extends(TreeViewLeftPanel, _super);
        function TreeViewLeftPanel($element) {
            _super.call(this, $element);
        }
        TreeViewLeftPanel.prototype.create = function () {
            var _this = this;
            this.setConfig('treeViewLeftPanel');

            _super.prototype.create.call(this);

            $.subscribe(extension.Extension.RELOAD, function () {
                _this.dataBindThumbsView();
                _this.dataBindGalleryView();
            });

            $.subscribe(gallery.GalleryView.THUMB_SELECTED, function () {
                _this.collapseFull();
            });

            $.subscribe(baseExtension.BaseExtension.CANVAS_INDEX_CHANGED, function (e, index) {
                if (_this.isFullyExpanded) {
                    _this.collapseFull();
                }
            });

            this.$tabs = $('<div class="tabs"></div>');
            this.$main.append(this.$tabs);

            this.$treeButton = $('<a class="tab first">' + this.content.index + '</a>');
            this.$tabs.append(this.$treeButton);

            this.$thumbsButton = $('<a class="tab">' + this.content.thumbnails + '</a>');
            this.$tabs.append(this.$thumbsButton);

            this.$tabsContent = $('<div class="tabsContent"></div>');
            this.$main.append(this.$tabsContent);

            this.$options = $('<div class="options"></div>');
            this.$tabsContent.append(this.$options);

            this.$views = $('<div class="views"></div>');
            this.$tabsContent.append(this.$views);

            this.$treeView = $('<div class="treeView"></div>');
            this.$views.append(this.$treeView);

            this.$thumbsView = $('<div class="thumbsView"></div>');
            this.$views.append(this.$thumbsView);

            this.$galleryView = $('<div class="galleryView"></div>');
            this.$views.append(this.$galleryView);

            this.$treeButton.on('click', function (e) {
                e.preventDefault();

                _this.openTreeView();

                $.publish(TreeViewLeftPanel.OPEN_TREE_VIEW);
            });

            this.$thumbsButton.on('click', function (e) {
                e.preventDefault();

                _this.openThumbsView();

                $.publish(TreeViewLeftPanel.OPEN_THUMBS_VIEW);
            });
        };

        TreeViewLeftPanel.prototype.createTreeView = function () {
            this.treeView = new tree.TreeView(this.$treeView);
            this.dataBindTreeView();
        };

        TreeViewLeftPanel.prototype.dataBindTreeView = function () {
            this.treeView.rootNode = this.provider.getTree();
            this.treeView.dataBind();
        };

        TreeViewLeftPanel.prototype.createThumbsView = function () {
            this.thumbsView = new thumbs.ThumbsView(this.$thumbsView);
            this.dataBindThumbsView();
        };

        TreeViewLeftPanel.prototype.dataBindThumbsView = function () {
            this.thumbsView.thumbs = this.provider.getThumbs();
            this.thumbsView.dataBind();
        };

        TreeViewLeftPanel.prototype.createGalleryView = function () {
            this.galleryView = new gallery.GalleryView(this.$galleryView);
            this.dataBindGalleryView();
        };

        TreeViewLeftPanel.prototype.dataBindGalleryView = function () {
            this.galleryView.thumbs = this.provider.getThumbs();
            this.galleryView.dataBind();
        };

        TreeViewLeftPanel.prototype.toggleFinish = function () {
            _super.prototype.toggleFinish.call(this);

            if (this.isUnopened) {
                var treeEnabled = utils.Utils.getBool(this.config.options.treeEnabled, true);
                var thumbsEnabled = utils.Utils.getBool(this.config.options.thumbsEnabled, true);

                if (!treeEnabled || !thumbsEnabled)
                    this.$tabs.hide();

                if (thumbsEnabled && this.provider.defaultToThumbsView()) {
                    this.openThumbsView();
                } else if (treeEnabled) {
                    this.openTreeView();
                }
            }
        };

        TreeViewLeftPanel.prototype.expandFullStart = function () {
            _super.prototype.expandFullStart.call(this);
            $.publish(TreeViewLeftPanel.EXPAND_FULL_START);
        };

        TreeViewLeftPanel.prototype.expandFullFinish = function () {
            _super.prototype.expandFullFinish.call(this);

            if (this.$thumbsButton.hasClass('on')) {
                this.openThumbsView();
            }

            $.publish(TreeViewLeftPanel.EXPAND_FULL_FINISH);
        };

        TreeViewLeftPanel.prototype.collapseFullStart = function () {
            _super.prototype.collapseFullStart.call(this);

            $.publish(TreeViewLeftPanel.COLLAPSE_FULL_START);
        };

        TreeViewLeftPanel.prototype.collapseFullFinish = function () {
            _super.prototype.collapseFullFinish.call(this);

            if (this.$thumbsButton.hasClass('on')) {
                this.openThumbsView();
            }

            $.publish(TreeViewLeftPanel.COLLAPSE_FULL_FINISH);
        };

        TreeViewLeftPanel.prototype.openTreeView = function () {
            var _this = this;
            if (!this.treeView) {
                this.createTreeView();
            }

            this.$treeButton.addClass('on');
            this.$thumbsButton.removeClass('on');

            this.treeView.show();

            setTimeout(function () {
                var structure = _this.provider.getStructureByCanvasIndex(_this.provider.canvasIndex);
                if (_this.treeView && structure && structure.treeNode)
                    _this.treeView.selectNode(structure.treeNode);
            }, 1);

            if (this.thumbsView)
                this.thumbsView.hide();
            if (this.galleryView)
                this.galleryView.hide();

            this.treeView.resize();
        };

        TreeViewLeftPanel.prototype.openThumbsView = function () {
            if (!this.thumbsView) {
                this.createThumbsView();
            }

            if (this.isFullyExpanded && !this.galleryView) {
                this.createGalleryView();
            }

            this.$treeButton.removeClass('on');
            this.$thumbsButton.addClass('on');

            if (this.treeView)
                this.treeView.hide();

            if (this.isFullyExpanded) {
                this.thumbsView.hide();
                if (this.galleryView)
                    this.galleryView.show();
                if (this.galleryView)
                    this.galleryView.resize();
            } else {
                if (this.galleryView)
                    this.galleryView.hide();
                this.thumbsView.show();
                this.thumbsView.resize();
            }
        };

        TreeViewLeftPanel.prototype.resize = function () {
            _super.prototype.resize.call(this);

            this.$tabsContent.height(this.$main.height() - (this.$tabs.is(':visible') ? this.$tabs.height() : 0) - this.$tabsContent.verticalPadding());
            this.$views.height(this.$tabsContent.height() - this.$options.height());
        };
        TreeViewLeftPanel.OPEN_TREE_VIEW = 'leftPanel.onOpenTreeView';
        TreeViewLeftPanel.OPEN_THUMBS_VIEW = 'leftPanel.onOpenThumbsView';
        TreeViewLeftPanel.EXPAND_FULL_START = 'leftPanel.onExpandFullStart';
        TreeViewLeftPanel.EXPAND_FULL_FINISH = 'leftPanel.onExpandFullFinish';
        TreeViewLeftPanel.COLLAPSE_FULL_START = 'leftPanel.onCollapseFullStart';
        TreeViewLeftPanel.COLLAPSE_FULL_FINISH = 'leftPanel.onCollapseFullFinish';
        return TreeViewLeftPanel;
    })(baseLeft.LeftPanel);
    exports.TreeViewLeftPanel = TreeViewLeftPanel;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('modules/coreplayer-shared-module/centerPanel',["require", "exports", "./shell", "./baseView"], function(require, exports, shell, baseView) {
    var CenterPanel = (function (_super) {
        __extends(CenterPanel, _super);
        function CenterPanel($element) {
            _super.call(this, $element, false, true);
        }
        CenterPanel.prototype.create = function () {
            _super.prototype.create.call(this);

            this.$title = $('<div class="title"></div>');
            this.$element.append(this.$title);

            this.$content = $('<div id="content" class="content"></div>');
            this.$element.append(this.$content);

            if (this.options.titleEnabled === false) {
                this.$title.hide();
            }
        };

        CenterPanel.prototype.resize = function () {
            _super.prototype.resize.call(this);

            this.$element.css({
                'left': shell.Shell.$leftPanel.width(),
                'width': this.$element.parent().width() - shell.Shell.$leftPanel.width() - shell.Shell.$rightPanel.width()
            });

            var titleHeight;

            if (this.options.titleEnabled === false) {
                titleHeight = 0;
            } else {
                titleHeight = this.$title.height();
            }

            this.$content.height(this.$element.height() - titleHeight);
        };
        return CenterPanel;
    })(baseView.BaseView);
    exports.CenterPanel = CenterPanel;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('modules/coreplayer-shared-module/seadragonCenterPanel',["require", "exports", "./baseProvider", "./centerPanel", "../../utils"], function(require, exports, baseProvider, baseCenter, utils) {
    var SeadragonCenterPanel = (function (_super) {
        __extends(SeadragonCenterPanel, _super);
        function SeadragonCenterPanel($element) {
            _super.call(this, $element);
            this.prevButtonEnabled = false;
            this.nextButtonEnabled = false;
        }
        SeadragonCenterPanel.prototype.create = function () {
            var _this = this;
            _super.prototype.create.call(this);

            this.$viewer = $('<div id="viewer"></div>');
            this.$content.append(this.$viewer);

            this.createSeadragonViewer();

            if (this.provider.isMultiCanvas()) {
                this.$prevButton = $('<div class="paging btn prev"></div>');
                this.$prevButton.prop('title', this.content.previous);
                this.viewer.addControl(this.$prevButton[0], { anchor: OpenSeadragon.ControlAnchor.TOP_LEFT });

                this.$nextButton = $('<div class="paging btn next"></div>');
                this.$nextButton.prop('title', this.content.next);
                this.viewer.addControl(this.$nextButton[0], { anchor: OpenSeadragon.ControlAnchor.TOP_RIGHT });

                var that = this;

                this.$prevButton.on('touchstart click', function (e) {
                    e.preventDefault();
                    OpenSeadragon.cancelEvent(e);

                    if (!that.prevButtonEnabled)
                        return;

                    $.publish(SeadragonCenterPanel.PREV);
                });

                this.$nextButton.on('touchstart click', function (e) {
                    e.preventDefault();
                    OpenSeadragon.cancelEvent(e);

                    if (!that.nextButtonEnabled)
                        return;

                    $.publish(SeadragonCenterPanel.NEXT);
                });

                $('.paging.btn.next').on('pointerdown', function () {
                    console.log('hover');
                });
            }
            ;

            this.viewer.addHandler('open', function (viewer) {
                _this.viewerOpen();
                $.publish(SeadragonCenterPanel.SEADRAGON_OPEN, [viewer]);
            });

            this.viewer.addHandler('resize', function (viewer) {
                $.publish(SeadragonCenterPanel.SEADRAGON_RESIZE, [viewer]);
                _this.viewerResize(viewer);
            });

            this.viewer.addHandler('animation-start', function (viewer) {
                $.publish(SeadragonCenterPanel.SEADRAGON_ANIMATION_START, [viewer]);
            });

            this.viewer.addHandler('animation', function (viewer) {
                $.publish(SeadragonCenterPanel.SEADRAGON_ANIMATION, [viewer]);
            });

            this.viewer.addHandler('animation-finish', function (viewer) {
                _this.currentBounds = _this.getBounds();

                $.publish(SeadragonCenterPanel.SEADRAGON_ANIMATION_FINISH, [viewer]);
            });

            $('div[title="Rotate right"]').on('click', function () {
                $.publish(SeadragonCenterPanel.SEADRAGON_ROTATION, [_this.viewer.viewport.getRotation()]);
            });

            this.title = this.extension.provider.getTitle();

            var browser = window.BrowserDetect.browser;

            if (browser == 'Firefox') {
                if (this.provider.isMultiCanvas()) {
                    this.$prevButton.hide();
                    this.$nextButton.hide();
                }
                $('div[title="Rotate right"]').hide();
            }
        };

        SeadragonCenterPanel.prototype.createSeadragonViewer = function () {
        };

        SeadragonCenterPanel.prototype.viewerOpen = function () {
            if (this.provider.isMultiCanvas()) {
                $('.navigator').addClass('extraMargin');

                if (!this.provider.isFirstCanvas()) {
                    this.enablePrevButton();
                } else {
                    this.disablePrevButton();
                }

                if (!this.provider.isLastCanvas()) {
                    this.enableNextButton();
                } else {
                    this.disableNextButton();
                }
            }

            if (!this.currentBounds) {
                var initialRotation = this.extension.getParam(3 /* rotation */);

                if (initialRotation) {
                    this.viewer.viewport.setRotation(parseInt(initialRotation));
                }

                var initialBounds = this.extension.getParam(2 /* zoom */);

                if (initialBounds) {
                    initialBounds = this.deserialiseBounds(initialBounds);
                    this.currentBounds = initialBounds;
                }
            }

            if (this.currentBounds) {
                this.fitToBounds(this.currentBounds);
            }
        };

        SeadragonCenterPanel.prototype.disablePrevButton = function () {
            this.prevButtonEnabled = false;
            this.$prevButton.addClass('disabled');
        };

        SeadragonCenterPanel.prototype.enablePrevButton = function () {
            this.prevButtonEnabled = true;
            this.$prevButton.removeClass('disabled');
        };

        SeadragonCenterPanel.prototype.disableNextButton = function () {
            this.nextButtonEnabled = false;
            this.$nextButton.addClass('disabled');
        };

        SeadragonCenterPanel.prototype.enableNextButton = function () {
            this.nextButtonEnabled = true;
            this.$nextButton.removeClass('disabled');
        };

        SeadragonCenterPanel.prototype.serialiseBounds = function (bounds) {
            return bounds.x + ',' + bounds.y + ',' + bounds.width + ',' + bounds.height;
        };

        SeadragonCenterPanel.prototype.deserialiseBounds = function (bounds) {
            var boundsArr = bounds.split(',');

            return {
                x: Number(boundsArr[0]),
                y: Number(boundsArr[1]),
                width: Number(boundsArr[2]),
                height: Number(boundsArr[3])
            };
        };

        SeadragonCenterPanel.prototype.fitToBounds = function (bounds) {
            var rect = new OpenSeadragon.Rect();
            rect.x = bounds.x;
            rect.y = bounds.y;
            rect.width = bounds.width;
            rect.height = bounds.height;

            this.viewer.viewport.fitBounds(rect, true);
        };

        SeadragonCenterPanel.prototype.getBounds = function () {
            if (!this.viewer.viewport)
                return null;

            var bounds = this.viewer.viewport.getBounds(true);

            return {
                x: utils.Utils.roundNumber(bounds.x, 4),
                y: utils.Utils.roundNumber(bounds.y, 4),
                width: utils.Utils.roundNumber(bounds.width, 4),
                height: utils.Utils.roundNumber(bounds.height, 4)
            };
        };

        SeadragonCenterPanel.prototype.viewerResize = function (viewer) {
            if (!viewer.viewport)
                return;

            var center = viewer.viewport.getCenter(true);
            if (!center)
                return;

            setTimeout(function () {
                viewer.viewport.panTo(center, true);
            }, 1);
        };

        SeadragonCenterPanel.prototype.resize = function () {
            _super.prototype.resize.call(this);

            this.$title.ellipsisFill(this.title);

            this.$viewer.height(this.$content.height());

            if (this.provider.isMultiCanvas()) {
                this.$prevButton.css('top', (this.$content.height() - this.$prevButton.height()) / 2);
                this.$nextButton.css('top', (this.$content.height() - this.$nextButton.height()) / 2);
            }
        };
        SeadragonCenterPanel.SEADRAGON_OPEN = 'center.onOpen';
        SeadragonCenterPanel.SEADRAGON_RESIZE = 'center.onResize';
        SeadragonCenterPanel.SEADRAGON_ANIMATION_START = 'center.onAnimationStart';
        SeadragonCenterPanel.SEADRAGON_ANIMATION = 'center.onAnimation';
        SeadragonCenterPanel.SEADRAGON_ANIMATION_FINISH = 'center.onAnimationfinish';
        SeadragonCenterPanel.SEADRAGON_ROTATION = 'center.onRotation';
        SeadragonCenterPanel.PREV = 'center.onPrev';
        SeadragonCenterPanel.NEXT = 'center.onNext';
        return SeadragonCenterPanel;
    })(baseCenter.CenterPanel);
    exports.SeadragonCenterPanel = SeadragonCenterPanel;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('modules/coreplayer-seadragoncenterpanel-module/seadragonCenterPanel',["require", "exports", "../coreplayer-shared-module/baseExtension", "../coreplayer-shared-module/seadragonCenterPanel"], function(require, exports, baseExtension, baseCenter) {
    var SeadragonCenterPanel = (function (_super) {
        __extends(SeadragonCenterPanel, _super);
        function SeadragonCenterPanel($element) {
            _super.call(this, $element);
        }
        SeadragonCenterPanel.prototype.create = function () {
            var _this = this;
            this.setConfig('seadragonCenterPanel');

            _super.prototype.create.call(this);

            $.subscribe(baseExtension.BaseExtension.OPEN_MEDIA, function (e, uri) {
                _this.loadTileSources();
            });

            this.$element.on('mousemove', function (e) {
                _this.viewer.showControls();
            });

            this.$element.on('mouseout', function (e) {
                _this.viewer.hideControls();
            });

            this.$element.on('mousemove', function (e) {
                if (_this.$element.ismouseover()) {
                    _this.viewer.hideControls();
                }
            }, this.config.options.controlsFadeAfterInactive);
        };

        SeadragonCenterPanel.prototype.createSeadragonViewer = function () {
            var prefixUrl = (window.DEBUG) ? 'modules/coreplayer-seadragoncenterpanel-module/img/' : 'themes/' + this.provider.config.options.theme + '/img/coreplayer-seadragoncenterpanel-module/';

            this.viewer = OpenSeadragon({
                id: "viewer",
                autoHideControls: true,
                showNavigationControl: true,
                showNavigator: true,
                showRotationControl: true,
                showHomeControl: false,
                showFullPageControl: false,
                defaultZoomLevel: this.config.options.defaultZoomLevel || 0,
                controlsFadeDelay: this.config.options.controlsFadeDelay,
                controlsFadeLength: this.config.options.controlsFadeLength,
                navigatorPosition: 'BOTTOM_RIGHT',
                prefixUrl: prefixUrl,
                navImages: {
                    zoomIn: {
                        REST: 'zoom_in.png',
                        GROUP: 'zoom_in.png',
                        HOVER: 'zoom_in.png',
                        DOWN: 'zoom_in.png'
                    },
                    zoomOut: {
                        REST: 'zoom_out.png',
                        GROUP: 'zoom_out.png',
                        HOVER: 'zoom_out.png',
                        DOWN: 'zoom_out.png'
                    },
                    rotateright: {
                        REST: 'rotate_right.png',
                        GROUP: 'rotate_right.png',
                        HOVER: 'rotate_right.png',
                        DOWN: 'rotate_right.png'
                    },
                    rotateleft: {
                        REST: 'pixel.gif',
                        GROUP: 'pixel.gif',
                        HOVER: 'pixel.gif',
                        DOWN: 'pixel.gif'
                    },
                    next: {
                        REST: 'pixel.gif',
                        GROUP: 'pixel.gif',
                        HOVER: 'pixel.gif',
                        DOWN: 'pixel.gif'
                    },
                    previous: {
                        REST: 'pixel.gif',
                        GROUP: 'pixel.gif',
                        HOVER: 'pixel.gif',
                        DOWN: 'pixel.gif'
                    }
                }
            });
        };

        SeadragonCenterPanel.prototype.loadTileSources = function () {
            var tileSources = this.provider.getTileSources();

            var that = this;

            if (tileSources.length > 1) {
                that.viewer.addHandler('open', function openHandler() {
                    that.viewer.removeHandler('open', openHandler);

                    tileSources[1].x = that.viewer.world.getItemAt(0).getWorldBounds().x + that.viewer.world.getItemAt(0).getWorldBounds().width + that.config.options.pageGap;

                    that.viewer.addTiledImage(tileSources[1]);
                });
            }

            if (tileSources[0].tileSource) {
                that.viewer.open(tileSources[0]);
            } else {
                that.extension.showDialogue(that.config.content.imageUnavailable);
            }

            if (tileSources.length != that.lastTilesNum) {
                that.viewer.addHandler('open', function openHandler() {
                    that.viewer.removeHandler('open', openHandler);
                    that.viewer.viewport.fitBounds(new OpenSeadragon.Rect(0, 0, tileSources.length, that.viewer.world.getItemAt(0).normHeight));
                });
            }

            that.lastTilesNum = tileSources.length;
        };
        return SeadragonCenterPanel;
    })(baseCenter.SeadragonCenterPanel);
    exports.SeadragonCenterPanel = SeadragonCenterPanel;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('modules/coreplayer-shared-module/rightPanel',["require", "exports", "./baseExpandPanel"], function(require, exports, baseExpandPanel) {
    var RightPanel = (function (_super) {
        __extends(RightPanel, _super);
        function RightPanel($element) {
            _super.call(this, $element);
        }
        RightPanel.prototype.create = function () {
            _super.prototype.create.call(this);

            this.$element.width(this.options.panelCollapsedWidth);
        };

        RightPanel.prototype.init = function () {
            _super.prototype.init.call(this);

            if (this.options.panelOpen && this.provider.isHomeDomain) {
                this.toggle();
            }
        };

        RightPanel.prototype.getTargetWidth = function () {
            return this.isExpanded ? this.options.panelCollapsedWidth : this.options.panelExpandedWidth;
        };

        RightPanel.prototype.getTargetLeft = function () {
            return this.isExpanded ? this.$element.parent().width() - this.options.panelCollapsedWidth : this.$element.parent().width() - this.options.panelExpandedWidth;
        };

        RightPanel.prototype.toggleFinish = function () {
            _super.prototype.toggleFinish.call(this);

            if (this.isExpanded) {
                $.publish(RightPanel.OPEN_RIGHT_PANEL);
            } else {
                $.publish(RightPanel.CLOSE_RIGHT_PANEL);
            }
        };

        RightPanel.prototype.resize = function () {
            _super.prototype.resize.call(this);

            this.$element.css({
                'left': this.$element.parent().width() - this.$element.outerWidth()
            });
        };
        RightPanel.OPEN_RIGHT_PANEL = 'onOpenRightPanel';
        RightPanel.CLOSE_RIGHT_PANEL = 'onCloseRightPanel';
        return RightPanel;
    })(baseExpandPanel.BaseExpandPanel);
    exports.RightPanel = RightPanel;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('modules/coreplayer-moreinforightpanel-module/moreInfoRightPanel',["require", "exports", "../coreplayer-shared-module/rightPanel"], function(require, exports, baseRight) {
    var MoreInfoRightPanel = (function (_super) {
        __extends(MoreInfoRightPanel, _super);
        function MoreInfoRightPanel($element) {
            _super.call(this, $element);
        }
        MoreInfoRightPanel.prototype.create = function () {
            this.setConfig('moreInfoRightPanel');

            _super.prototype.create.call(this);

            this.moreInfoItemTemplate = $('<div class="item">\
                                           <div class="header"></div>\
                                           <div class="text"></div>\
                                       </div>');

            this.$items = $('<div class="items"></div>');
            this.$main.append(this.$items);
        };

        MoreInfoRightPanel.prototype.toggleFinish = function () {
            _super.prototype.toggleFinish.call(this);

            if (this.isUnopened) {
                this.getInfo();
            }
        };

        MoreInfoRightPanel.prototype.getInfo = function () {
            var _this = this;
            this.$main.addClass('loading');

            this.provider.getMetaData(function (data) {
                _this.displayInfo(data);
            });
        };

        MoreInfoRightPanel.prototype.displayInfo = function (data) {
            var _this = this;
            this.$main.removeClass('loading');

            if (!data) {
                this.$main.append(this.content.holdingText);
                return;
            }

            _.each(data, function (item) {
                _this.$items.append(_this.buildItem(item, 130));
            });
        };

        MoreInfoRightPanel.prototype.buildItem = function (item, trimChars) {
            var $elem = this.moreInfoItemTemplate.clone();
            var $header = $elem.find('.header');
            var $text = $elem.find('.text');

            item = _.values(item);

            var name = item[0];
            var value = item[1];

            value = value.replace('\n', '<br>');

            $header.text(name);
            $text.text(value);

            return $elem;
        };

        MoreInfoRightPanel.prototype.resize = function () {
            _super.prototype.resize.call(this);
        };
        return MoreInfoRightPanel;
    })(baseRight.RightPanel);
    exports.MoreInfoRightPanel = MoreInfoRightPanel;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('modules/coreplayer-shared-module/footerPanel',["require", "exports", "../../utils", "./baseExtension", "./baseView"], function(require, exports, utils, baseExtension, baseView) {
    var FooterPanel = (function (_super) {
        __extends(FooterPanel, _super);
        function FooterPanel($element) {
            _super.call(this, $element);
        }
        FooterPanel.prototype.create = function () {
            var _this = this;
            this.setConfig('footerPanel');

            _super.prototype.create.call(this);

            $.subscribe(baseExtension.BaseExtension.TOGGLE_FULLSCREEN, function () {
                _this.toggleFullScreen();
            });

            this.$options = $('<div class="options"></div>');
            this.$element.append(this.$options);

            this.$embedButton = $('<a href="#" class="imageBtn embed" title="' + this.content.embed + '"></a>');
            this.$options.append(this.$embedButton);

            this.$fullScreenBtn = $('<a href="#" class="imageBtn fullScreen" title="' + this.content.fullScreen + '"></a>');
            this.$options.append(this.$fullScreenBtn);

            this.$embedButton.on('click', function (e) {
                e.preventDefault();

                $.publish(FooterPanel.EMBED);
            });

            this.$fullScreenBtn.on('click', function (e) {
                e.preventDefault();
                $.publish(baseExtension.BaseExtension.TOGGLE_FULLSCREEN);
            });

            if (!utils.Utils.getBool(this.options.embedEnabled, true)) {
                this.$embedButton.hide();
            }

            if (this.provider.isLightbox) {
                this.$fullScreenBtn.addClass('lightbox');
            }

            if (utils.Utils.getBool(this.options.minimiseButtons, false)) {
                this.$options.addClass('minimiseButtons');
            }
        };

        FooterPanel.prototype.toggleFullScreen = function () {
            if (this.extension.isFullScreen) {
                this.$fullScreenBtn.swapClass('fullScreen', 'normal');
                this.$fullScreenBtn.attr('title', this.content.exitFullScreen);
            } else {
                this.$fullScreenBtn.swapClass('normal', 'fullScreen');
                this.$fullScreenBtn.attr('title', this.content.fullScreen);
            }
        };

        FooterPanel.prototype.resize = function () {
            _super.prototype.resize.call(this);
        };
        FooterPanel.EMBED = 'footer.onEmbed';
        return FooterPanel;
    })(baseView.BaseView);
    exports.FooterPanel = FooterPanel;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('modules/coreplayer-dialogues-module/helpDialogue',["require", "exports", "../coreplayer-shared-module/dialogue"], function(require, exports, dialogue) {
    var HelpDialogue = (function (_super) {
        __extends(HelpDialogue, _super);
        function HelpDialogue($element) {
            _super.call(this, $element);
        }
        HelpDialogue.prototype.create = function () {
            var _this = this;
            this.setConfig('helpDialogue');

            _super.prototype.create.call(this);

            $.subscribe(HelpDialogue.SHOW_HELP_DIALOGUE, function (e, params) {
                _this.open();
            });

            $.subscribe(HelpDialogue.HIDE_HELP_DIALOGUE, function (e) {
                _this.close();
            });

            this.$title = $('<h1></h1>');
            this.$content.append(this.$title);

            this.$scroll = $('<div class="scroll"></div>');
            this.$content.append(this.$scroll);

            this.$message = $('<p></p>');
            this.$scroll.append(this.$message);

            this.$title.text(this.content.title);
            this.$message.html(this.content.text);

            this.$message.targetBlank();

            this.$element.hide();
        };

        HelpDialogue.prototype.resize = function () {
            _super.prototype.resize.call(this);
        };
        HelpDialogue.SHOW_HELP_DIALOGUE = 'onShowHelpDialogue';
        HelpDialogue.HIDE_HELP_DIALOGUE = 'onHideHelpDialogue';
        return HelpDialogue;
    })(dialogue.Dialogue);
    exports.HelpDialogue = HelpDialogue;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('modules/coreplayer-dialogues-module/embedDialogue',["require", "exports", "../../utils", "../coreplayer-shared-module/dialogue"], function(require, exports, utils, dialogue) {
    var EmbedDialogue = (function (_super) {
        __extends(EmbedDialogue, _super);
        function EmbedDialogue($element) {
            _super.call(this, $element);
        }
        EmbedDialogue.prototype.create = function () {
            var _this = this;
            this.setConfig('embedDialogue');

            _super.prototype.create.call(this);

            var that = this;

            $.subscribe(EmbedDialogue.SHOW_EMBED_DIALOGUE, function (e, params) {
                _this.open();
                _this.formatCode();
            });

            $.subscribe(EmbedDialogue.HIDE_EMBED_DIALOGUE, function (e) {
                _this.close();
            });

            this.smallWidth = 560;
            this.smallHeight = 420;

            this.mediumWidth = 640;
            this.mediumHeight = 480;

            this.largeWidth = 800;
            this.largeHeight = 600;

            this.currentWidth = this.smallWidth;
            this.currentHeight = this.smallHeight;

            this.$title = $('<h1>' + this.content.title + '</h1>');
            this.$content.append(this.$title);

            this.$intro = $('<p>' + this.content.instructions + '</p>');
            this.$content.append(this.$intro);

            this.$code = $('<textarea class="code"></textarea>');
            this.$content.append(this.$code);

            this.$sizes = $('<div class="sizes"></div>');
            this.$content.append(this.$sizes);

            this.$smallSize = $('<div class="size small"></div>');
            this.$sizes.append(this.$smallSize);
            this.$smallSize.append('<p>' + this.smallWidth + ' x ' + this.smallHeight + '</p>');
            this.$smallSize.append('<div class="box"></div>');

            this.$mediumSize = $('<div class="size medium"></div>');
            this.$sizes.append(this.$mediumSize);
            this.$mediumSize.append('<p>' + this.mediumWidth + ' x ' + this.mediumHeight + '</p>');
            this.$mediumSize.append('<div class="box"></div>');

            this.$largeSize = $('<div class="size large"></div>');
            this.$sizes.append(this.$largeSize);
            this.$largeSize.append('<p>' + this.largeWidth + ' x ' + this.largeHeight + '</p>');
            this.$largeSize.append('<div class="box"></div>');

            this.$customSize = $('<div class="size custom"></div>');
            this.$sizes.append(this.$customSize);
            this.$customSize.append('<p>Custom size</p>');
            this.$customSizeWrap = $('<div class="wrap"></div>');
            this.$customSize.append(this.$customSizeWrap);
            this.$customSizeWidthWrap = $('<div class="width"></div>');
            this.$customSizeWrap.append(this.$customSizeWidthWrap);
            this.$customSizeWidthWrap.append('<label for="width">Width</label>');
            this.$customWidth = $('<input id="width" type="text" maxlength="5"></input>');
            this.$customSizeWidthWrap.append(this.$customWidth);
            this.$customSizeWidthWrap.append('<span>px</span>');
            this.$customSizeHeightWrap = $('<div class="height"></div>');
            this.$customSizeWrap.append(this.$customSizeHeightWrap);
            this.$customSizeHeightWrap.append('<label for="height">Height</label>');
            this.$customHeight = $('<input id="height" type="text" maxlength="5"></input>');
            this.$customSizeHeightWrap.append(this.$customHeight);
            this.$customSizeHeightWrap.append('<span>px</span>');

            this.$code.focus(function () {
                $(this).select();
            });

            this.$code.mouseup(function (e) {
                e.preventDefault();
            });

            this.$smallSize.click(function (e) {
                e.preventDefault();

                _this.currentWidth = _this.smallWidth;
                _this.currentHeight = _this.smallHeight;

                _this.formatCode();
            });

            this.$mediumSize.click(function (e) {
                e.preventDefault();

                _this.currentWidth = _this.mediumWidth;
                _this.currentHeight = _this.mediumHeight;

                _this.formatCode();
            });

            this.$largeSize.click(function (e) {
                e.preventDefault();

                _this.currentWidth = _this.largeWidth;
                _this.currentHeight = _this.largeHeight;

                _this.formatCode();
            });

            this.$smallSize.addClass('selected');

            this.$sizes.find('.size').click(function (e) {
                e.preventDefault();

                that.$sizes.find('.size').removeClass('selected');
                $(this).addClass('selected');
            });

            this.$customWidth.keydown(function (event) {
                utils.Utils.numericalInput(event);
            });

            this.$customWidth.keyup(function (event) {
                _this.getCustomSize();
            });

            this.$customHeight.keydown(function (event) {
                utils.Utils.numericalInput(event);
            });

            this.$customHeight.keyup(function (event) {
                _this.getCustomSize();
            });

            this.formatCode();

            this.$element.hide();
        };

        EmbedDialogue.prototype.getCustomSize = function () {
            this.currentWidth = this.$customWidth.val();
            this.currentHeight = this.$customHeight.val();

            this.formatCode();
        };

        EmbedDialogue.prototype.formatCode = function () {
        };

        EmbedDialogue.prototype.resize = function () {
            this.$element.css({
                'top': this.extension.height() - this.$element.outerHeight(true)
            });
        };
        EmbedDialogue.SHOW_EMBED_DIALOGUE = 'onShowEmbedDialogue';
        EmbedDialogue.HIDE_EMBED_DIALOGUE = 'onHideEmbedDialogue';
        return EmbedDialogue;
    })(dialogue.Dialogue);
    exports.EmbedDialogue = EmbedDialogue;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('extensions/coreplayer-seadragon-extension/embedDialogue',["require", "exports", "../../modules/coreplayer-dialogues-module/embedDialogue", "../../modules/coreplayer-shared-module/seadragonCenterPanel"], function(require, exports, embed, baseCenter) {
    var EmbedDialogue = (function (_super) {
        __extends(EmbedDialogue, _super);
        function EmbedDialogue($element) {
            var _this = this;
            _super.call(this, $element);

            $.subscribe(baseCenter.SeadragonCenterPanel.SEADRAGON_OPEN, function (viewer) {
                _this.formatCode();
            });

            $.subscribe(baseCenter.SeadragonCenterPanel.SEADRAGON_ANIMATION_FINISH, function (viewer) {
                _this.formatCode();
            });
        }
        EmbedDialogue.prototype.create = function () {
            this.setConfig('embedDialogue');

            _super.prototype.create.call(this);
        };

        EmbedDialogue.prototype.formatCode = function () {
            var zoom = this.extension.getViewerBounds();
            var rotation = this.extension.getViewerRotation();

            this.code = this.provider.getEmbedScript(this.provider.canvasIndex, zoom, this.currentWidth, this.currentHeight, rotation, this.options.embedTemplate);

            this.$code.val(this.code);
        };

        EmbedDialogue.prototype.resize = function () {
            _super.prototype.resize.call(this);
        };
        return EmbedDialogue;
    })(embed.EmbedDialogue);
    exports.EmbedDialogue = EmbedDialogue;
});

define('extensions/coreplayer-seadragon-extension/dependencies',[],function() {
    return {
        'openseadragon': './js/openseadragon'
    };

    var Dependencies = (function () {
        function Dependencies() {
        }
        return Dependencies;
    })();
    exports.Dependencies = Dependencies;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('extensions/coreplayer-seadragon-extension/extension',["require", "exports", "../../modules/coreplayer-shared-module/baseExtension", "../../utils", "../../modules/coreplayer-shared-module/baseProvider", "../../modules/coreplayer-shared-module/shell", "../../modules/coreplayer-pagingheaderpanel-module/pagingHeaderPanel", "../../modules/coreplayer-shared-module/leftPanel", "../../modules/coreplayer-treeviewleftpanel-module/treeViewLeftPanel", "../../modules/coreplayer-treeviewleftpanel-module/thumbsView", "../../modules/coreplayer-treeviewleftpanel-module/galleryView", "../../modules/coreplayer-treeviewleftpanel-module/treeView", "../../modules/coreplayer-shared-module/seadragonCenterPanel", "../../modules/coreplayer-seadragoncenterpanel-module/seadragonCenterPanel", "../../modules/coreplayer-shared-module/rightPanel", "../../modules/coreplayer-moreinforightpanel-module/moreInfoRightPanel", "../../modules/coreplayer-shared-module/footerPanel", "../../modules/coreplayer-dialogues-module/helpDialogue", "../../extensions/coreplayer-seadragon-extension/embedDialogue", "../../modules/coreplayer-dialogues-module/settingsDialogue", "../../coreplayer-seadragon-extension-dependencies"], function(require, exports, baseExtension, utils, baseProvider, shell, header, baseLeft, left, thumbsView, galleryView, treeView, baseCenter, center, baseRight, right, footer, help, embed, settingsDialogue, dependencies) {
    var Extension = (function (_super) {
        __extends(Extension, _super);
        function Extension(provider) {
            _super.call(this, provider);
            this.currentRotation = 0;
        }
        Extension.prototype.create = function (overrideDependencies) {
            var _this = this;
            _super.prototype.create.call(this);

            var that = this;

            $.subscribe(header.PagingHeaderPanel.FIRST, function (e) {
                _this.viewPage(_this.provider.getFirstPageIndex());
            });

            $.subscribe(header.PagingHeaderPanel.LAST, function (e) {
                _this.viewPage(_this.provider.getLastPageIndex());
            });

            $.subscribe(header.PagingHeaderPanel.PREV, function (e) {
                _this.viewPage(_this.provider.getPrevPageIndex());
            });

            $.subscribe(header.PagingHeaderPanel.NEXT, function (e) {
                _this.viewPage(_this.provider.getNextPageIndex());
            });

            $.subscribe(header.PagingHeaderPanel.MODE_CHANGED, function (e, mode) {
                Extension.mode = mode;
                $.publish(Extension.SETTINGS_CHANGED, [mode]);
            });

            $.subscribe(header.PagingHeaderPanel.PAGE_SEARCH, function (e, value) {
                _this.viewLabel(value);
            });

            $.subscribe(header.PagingHeaderPanel.IMAGE_SEARCH, function (e, index) {
                _this.viewPage(index);
            });

            $.subscribe(settingsDialogue.SettingsDialogue.UPDATE_SETTINGS, function (e) {
                _this.provider.reload(function () {
                    $.publish(baseExtension.BaseExtension.RELOAD);
                    _this.viewPage(_this.provider.canvasIndex, true);
                });
            });

            $.subscribe(treeView.TreeView.NODE_SELECTED, function (e, data) {
                _this.treeNodeSelected(data);
            });

            $.subscribe(thumbsView.ThumbsView.THUMB_SELECTED, function (e, index) {
                _this.viewPage(index);
            });

            $.subscribe(galleryView.GalleryView.THUMB_SELECTED, function (e, index) {
                _this.viewPage(index);
            });

            $.subscribe(baseLeft.LeftPanel.OPEN_LEFT_PANEL, function (e) {
                _this.resize();
            });

            $.subscribe(baseLeft.LeftPanel.CLOSE_LEFT_PANEL, function (e) {
                _this.resize();
            });

            $.subscribe(baseRight.RightPanel.OPEN_RIGHT_PANEL, function (e) {
                _this.resize();
            });

            $.subscribe(baseRight.RightPanel.CLOSE_RIGHT_PANEL, function (e) {
                _this.resize();
            });

            $.subscribe(left.TreeViewLeftPanel.EXPAND_FULL_START, function (e) {
                shell.Shell.$centerPanel.hide();
                shell.Shell.$rightPanel.hide();
            });

            $.subscribe(left.TreeViewLeftPanel.COLLAPSE_FULL_FINISH, function (e) {
                shell.Shell.$centerPanel.show();
                shell.Shell.$rightPanel.show();
                _this.resize();
            });

            $.subscribe(baseCenter.SeadragonCenterPanel.SEADRAGON_ANIMATION_FINISH, function (e, viewer) {
                _this.setParam(2 /* zoom */, _this.centerPanel.serialiseBounds(_this.centerPanel.currentBounds));
            });

            $.subscribe(baseCenter.SeadragonCenterPanel.SEADRAGON_ROTATION, function (e, rotation) {
                _this.currentRotation = rotation;
                _this.setParam(3 /* rotation */, rotation);
            });

            $.subscribe(baseCenter.SeadragonCenterPanel.PREV, function (e) {
                _this.viewPage(_this.provider.getPrevPageIndex());
            });

            $.subscribe(baseCenter.SeadragonCenterPanel.NEXT, function (e) {
                _this.viewPage(_this.provider.getNextPageIndex());
            });

            $.subscribe(footer.FooterPanel.EMBED, function (e) {
                $.publish(embed.EmbedDialogue.SHOW_EMBED_DIALOGUE);
            });

            var deps = overrideDependencies || dependencies;
            require(_.values(deps), function () {
                that.createModules();

                that.setParams();

                var canvasIndex;

                if (!that.provider.isReload) {
                    canvasIndex = parseInt(that.getParam(1 /* canvasIndex */)) || that.provider.getStartCanvasIndex();
                }

                that.viewPage(canvasIndex || that.provider.getStartCanvasIndex());

                $.publish(baseExtension.BaseExtension.RESIZE);

                $.publish(Extension.CREATED);
            });
        };

        Extension.prototype.createModules = function () {
            this.headerPanel = new header.PagingHeaderPanel(shell.Shell.$headerPanel);

            if (this.isLeftPanelEnabled()) {
                this.leftPanel = new left.TreeViewLeftPanel(shell.Shell.$leftPanel);
            }

            this.centerPanel = new center.SeadragonCenterPanel(shell.Shell.$centerPanel);

            if (this.isRightPanelEnabled()) {
                this.rightPanel = new right.MoreInfoRightPanel(shell.Shell.$rightPanel);
            }

            this.footerPanel = new footer.FooterPanel(shell.Shell.$footerPanel);

            this.$helpDialogue = utils.Utils.createDiv('overlay help');
            shell.Shell.$overlays.append(this.$helpDialogue);
            this.helpDialogue = new help.HelpDialogue(this.$helpDialogue);

            this.$embedDialogue = utils.Utils.createDiv('overlay embed');
            shell.Shell.$overlays.append(this.$embedDialogue);
            this.embedDialogue = new embed.EmbedDialogue(this.$embedDialogue);

            this.$settingsDialogue = utils.Utils.createDiv('overlay settings');
            shell.Shell.$overlays.append(this.$settingsDialogue);
            this.settingsDialogue = new settingsDialogue.SettingsDialogue(this.$settingsDialogue);

            if (this.isLeftPanelEnabled()) {
                this.leftPanel.init();
            }

            if (this.isRightPanelEnabled()) {
                this.rightPanel.init();
            }
        };

        Extension.prototype.setParams = function () {
            if (!this.provider.isHomeDomain)
                return;

            this.setParam(0 /* sequenceIndex */, this.provider.sequenceIndex);
        };

        Extension.prototype.isLeftPanelEnabled = function () {
            return utils.Utils.getBool(this.provider.config.options.leftPanelEnabled, true) && this.provider.isMultiCanvas();
        };

        Extension.prototype.isRightPanelEnabled = function () {
            return utils.Utils.getBool(this.provider.config.options.rightPanelEnabled, true);
        };

        Extension.prototype.viewPage = function (canvasIndex, isReload) {
            var _this = this;
            if (canvasIndex == -1)
                return;

            if (this.provider.isPaged() && !isReload) {
                var indices = this.provider.getPagedIndices(canvasIndex);

                if (indices.contains(this.provider.canvasIndex)) {
                    this.viewCanvas(canvasIndex, function () {
                        _this.setParam(1 /* canvasIndex */, canvasIndex);
                    });

                    return;
                }
            }

            this.viewCanvas(canvasIndex, function () {
                var canvas = _this.provider.getCanvasByIndex(canvasIndex);
                var uri = _this.provider.getImageUri(canvas);
                $.publish(Extension.OPEN_MEDIA, [uri]);
                _this.setParam(1 /* canvasIndex */, canvasIndex);
            });
        };

        Extension.prototype.getMode = function () {
            if (Extension.mode)
                return Extension.mode;

            switch (this.provider.getManifestType()) {
                case 'monograph':
                    return Extension.PAGE_MODE;
                    break;
                case 'archive', 'boundmanuscript':
                    return Extension.IMAGE_MODE;
                    break;
                default:
                    return Extension.IMAGE_MODE;
            }
        };

        Extension.prototype.getViewerBounds = function () {
            if (!this.centerPanel)
                return;

            var bounds = this.centerPanel.getBounds();

            if (bounds)
                return this.centerPanel.serialiseBounds(bounds);

            return "";
        };

        Extension.prototype.getViewerRotation = function () {
            if (!this.centerPanel)
                return;

            return this.currentRotation;
        };

        Extension.prototype.viewStructure = function (path) {
            var index = this.provider.getStructureIndex(path);

            this.viewPage(index);
        };

        Extension.prototype.viewLabel = function (label) {
            if (!label) {
                this.showDialogue(this.provider.config.modules.genericDialogue.content.emptyValue);
                return;
            }

            var index = this.provider.getCanvasIndexByOrderLabel(label);

            if (index != -1) {
                this.viewPage(index);
            } else {
                this.showDialogue(this.provider.config.modules.genericDialogue.content.pageNotFound);
            }
        };

        Extension.prototype.treeNodeSelected = function (data) {
            if (!data.type)
                return;

            if (data.type == 'manifest') {
                this.viewManifest(data);
            } else {
                this.viewStructure(data.path);
            }
        };
        Extension.PAGE_MODE = "pageMode";
        Extension.IMAGE_MODE = "imageMode";
        return Extension;
    })(baseExtension.BaseExtension);
    exports.Extension = Extension;
});

define('modules/coreplayer-shared-module/thumb',["require", "exports"], function(require, exports) {
    var Thumb = (function () {
        function Thumb(index, url, label, height, visible) {
            this.index = index;
            this.url = url;
            this.label = label;
            this.height = height;
            this.visible = visible;
        }
        return Thumb;
    })();
    
    return Thumb;
});

define('modules/coreplayer-shared-module/baseIIIFProvider',["require", "exports", "../../utils", "./treeNode", "./thumb"], function(require, exports, utils, TreeNode, Thumb) {
    (function (params) {
        params[params["sequenceIndex"] = 0] = "sequenceIndex";
        params[params["canvasIndex"] = 1] = "canvasIndex";
        params[params["zoom"] = 2] = "zoom";
        params[params["rotation"] = 3] = "rotation";
    })(exports.params || (exports.params = {}));
    var params = exports.params;

    var BaseProvider = (function () {
        function BaseProvider(config, manifest) {
            this.paramMap = ['si', 'ci', 'z', 'r'];
            this.options = {
                thumbsUriTemplate: "{0}{1}",
                timestampUris: false,
                mediaUriTemplate: "{0}{1}"
            };
            this.config = config;
            this.manifest = manifest;

            this.options.dataBaseUri = utils.Utils.getQuerystringParameter('dbu');

            this.dataUri = utils.Utils.getQuerystringParameter('du');
            this.embedDomain = utils.Utils.getQuerystringParameter('ed');
            this.isHomeDomain = utils.Utils.getQuerystringParameter('hd') === "true";
            this.isOnlyInstance = utils.Utils.getQuerystringParameter('oi') === "true";
            this.embedScriptUri = utils.Utils.getQuerystringParameter('esu');
            this.isReload = utils.Utils.getQuerystringParameter('rl') === "true";
            this.domain = utils.Utils.getQuerystringParameter('d');
            this.isLightbox = utils.Utils.getQuerystringParameter('lb') === "true";

            if (this.isHomeDomain && !this.isReload) {
                this.sequenceIndex = parseInt(utils.Utils.getHashParameter(this.paramMap[0 /* sequenceIndex */], parent.document));
            }

            if (!this.sequenceIndex) {
                this.sequenceIndex = parseInt(utils.Utils.getQuerystringParameter(this.paramMap[0 /* sequenceIndex */])) || 0;
            }

            this.load();
        }
        BaseProvider.prototype.load = function () {
            this.sequence = this.manifest.sequences[this.sequenceIndex];

            for (var i = 0; i < this.manifest.sequences.length; i++) {
                if (!this.manifest.sequences[i].canvases) {
                    this.manifest.sequences[i] = {};
                }
            }

            this.parseManifest();

            this.parseStructure();
        };

        BaseProvider.prototype.reload = function (callback) {
            var _this = this;
            var manifestUri = this.dataUri;

            if (this.options.dataBaseUri) {
                manifestUri = this.options.dataBaseUri + this.dataUri;
            }

            manifestUri = this.addTimestamp(manifestUri);

            window.manifestCallback = function (data) {
                _this.manifest = data;

                _this.load();

                callback();
            };

            $.ajax({
                url: manifestUri,
                type: 'GET',
                dataType: 'jsonp',
                jsonp: 'callback',
                jsonpCallback: 'manifestCallback'
            });
        };

        BaseProvider.prototype.getManifestType = function () {
            return 'monograph';
        };

        BaseProvider.prototype.getSequenceType = function () {
            return 'seadragon-iiif';
        };

        BaseProvider.prototype.getTitle = function () {
            return this.manifest.label;
        };

        BaseProvider.prototype.getSeeAlso = function () {
            return this.manifest.seeAlso;
        };

        BaseProvider.prototype.getCanvasOrderLabel = function (canvas) {
            return canvas.label;
        };

        BaseProvider.prototype.getLastCanvasOrderLabel = function () {
            for (var i = this.sequence.canvases.length - 1; i >= 0; i--) {
                var canvas = this.sequence.canvases[i];

                var regExp = /\d/;

                if (regExp.test(canvas.label)) {
                    return canvas.label;
                }
            }

            return '-';
        };

        BaseProvider.prototype.isFirstCanvas = function (canvasIndex) {
            if (typeof (canvasIndex) === 'undefined')
                canvasIndex = this.canvasIndex;
            return canvasIndex == 0;
        };

        BaseProvider.prototype.isLastCanvas = function (canvasIndex) {
            if (typeof (canvasIndex) === 'undefined')
                canvasIndex = this.canvasIndex;
            return canvasIndex == this.getTotalCanvases() - 1;
        };

        BaseProvider.prototype.isSeeAlsoEnabled = function () {
            return this.config.options.seeAlsoEnabled !== false;
        };

        BaseProvider.prototype.getCanvasByIndex = function (index) {
            return this.sequence.canvases[index];
        };

        BaseProvider.prototype.getStructureByCanvasIndex = function (index) {
            if (index == -1)
                return null;
            var canvas = this.getCanvasByIndex(index);
            return this.getCanvasStructure(canvas);
        };

        BaseProvider.prototype.getCanvasStructure = function (canvas) {
            if (canvas.structures) {
                return canvas.structures.last();
            }

            return null;
        };

        BaseProvider.prototype.getCurrentCanvas = function () {
            return this.sequence.canvases[this.canvasIndex];
        };

        BaseProvider.prototype.getTotalCanvases = function () {
            return this.sequence.canvases.length;
        };

        BaseProvider.prototype.isMultiCanvas = function () {
            return this.sequence.canvases.length > 1;
        };

        BaseProvider.prototype.isMultiSequence = function () {
            return this.manifest.sequences.length > 1;
        };

        BaseProvider.prototype.isPaged = function () {
            return this.sequence.viewingHint && (this.sequence.viewingHint == "paged") && this.getSettings().pagingEnabled;
        };

        BaseProvider.prototype.getMediaUri = function (mediaUri) {
            var baseUri = this.options.mediaBaseUri || "";
            var template = this.options.mediaUriTemplate;
            var uri = String.prototype.format(template, baseUri, mediaUri);

            return uri;
        };

        BaseProvider.prototype.setMediaUri = function (canvas) {
        };

        BaseProvider.prototype.getPagedIndices = function (canvasIndex) {
            if (typeof (canvasIndex) === 'undefined')
                canvasIndex = this.canvasIndex;

            if (this.isFirstCanvas(canvasIndex) || this.isLastCanvas(canvasIndex)) {
                return [canvasIndex];
            } else if (canvasIndex % 2) {
                return [canvasIndex, canvasIndex + 1];
            } else {
                return [canvasIndex - 1, canvasIndex];
            }
        };

        BaseProvider.prototype.getFirstPageIndex = function () {
            return 0;
        };

        BaseProvider.prototype.getLastPageIndex = function () {
            return this.getTotalCanvases() - 1;
        };

        BaseProvider.prototype.getPrevPageIndex = function (canvasIndex) {
            if (typeof (canvasIndex) === 'undefined')
                canvasIndex = this.canvasIndex;

            var index;

            if (this.isPaged()) {
                var indices = this.getPagedIndices(canvasIndex);
                index = indices[0] - 1;
            } else {
                index = canvasIndex - 1;
            }

            return index;
        };

        BaseProvider.prototype.getNextPageIndex = function (canvasIndex) {
            if (typeof (canvasIndex) === 'undefined')
                canvasIndex = this.canvasIndex;

            var index;

            if (this.isPaged()) {
                var indices = this.getPagedIndices(canvasIndex);
                index = indices.last() + 1;
            } else {
                index = canvasIndex + 1;
            }

            if (index > this.getTotalCanvases() - 1) {
                return -1;
            }

            return index;
        };

        BaseProvider.prototype.getStartCanvasIndex = function () {
            if (this.sequence.startCanvas) {
                for (var i = 0; i < this.sequence.canvases.length; i++) {
                    var canvas = this.sequence.canvases[i];

                    if (canvas["@id"] == this.sequence.startCanvas)
                        return i;
                }
            }

            return 0;
        };

        BaseProvider.prototype.addTimestamp = function (uri) {
            return uri + "?t=" + utils.Utils.getTimeStamp();
        };

        BaseProvider.prototype.isDeepLinkingEnabled = function () {
            return (this.isHomeDomain && this.isOnlyInstance);
        };

        BaseProvider.prototype.getThumbUri = function (canvas, width, height) {
            var uri;

            if (canvas.resources) {
                uri = canvas.resources[0].resource.service['@id'];
            } else if (canvas.images && canvas.images[0].resource.service) {
                uri = canvas.images[0].resource.service['@id'];
            } else {
                return "";
            }

            var tile = 'full/' + width + ',' + height + '/0/default.jpg';

            if (uri.endsWith('/')) {
                uri += tile;
            } else {
                uri += '/' + tile;
            }

            return uri;
        };

        BaseProvider.prototype.getThumbs = function () {
            var thumbs = new Array();

            for (var i = 0; i < this.getTotalCanvases(); i++) {
                var canvas = this.sequence.canvases[i];

                var heightRatio = canvas.height / canvas.width;

                var width = this.config.modules["treeViewLeftPanel"].options.thumbWidth;
                var height = this.config.modules["treeViewLeftPanel"].options.thumbHeight;

                if (heightRatio) {
                    height = Math.floor(width * heightRatio);
                }

                var uri = this.getThumbUri(canvas, width, height);

                thumbs.push(new Thumb(i, uri, canvas.label, height, true));
            }

            return thumbs;
        };

        BaseProvider.prototype.parseManifest = function () {
        };

        BaseProvider.prototype.getRootStructure = function () {
            return this.rootStructure;
        };

        BaseProvider.prototype.parseStructure = function () {
            this.rootStructure = {
                path: "",
                structures: []
            };

            if (!this.manifest.structures)
                return;

            for (var i = 0; i < this.manifest.structures.length; i++) {
                var structure = this.manifest.structures[i];
                this.rootStructure.structures.push(structure);
                structure.path = "/" + i;

                for (var j = 0; j < structure.canvases.length; j++) {
                    var canvas = this.getCanvasById(structure.canvases[j]);

                    if (!canvas) {
                        structure.canvases[j] = null;
                        continue;
                    }

                    if (!canvas.structures)
                        canvas.structures = [];
                    canvas.structures.push(structure);

                    structure.canvases[j] = canvas;
                }
            }
        };

        BaseProvider.prototype.getStructureIndex = function (path) {
            for (var i = 0; i < this.sequence.canvases.length; i++) {
                var canvas = this.sequence.canvases[i];

                if (!canvas.structures)
                    continue;

                for (var j = 0; j < canvas.structures.length; j++) {
                    var structure = canvas.structures[j];

                    if (structure.path == path) {
                        return i;
                    }
                }
            }

            return null;
        };

        BaseProvider.prototype.getCanvasById = function (id) {
            for (var i = 0; i < this.sequence.canvases.length; i++) {
                var c = this.sequence.canvases[i];

                if (c['@id'] === id) {
                    return c;
                }
            }

            return null;
        };

        BaseProvider.prototype.getStructureByIndex = function (structure, index) {
            return structure.structures[index];
        };

        BaseProvider.prototype.getCanvasIndexByOrderLabel = function (label) {
            var regExp = /(\d*)\D*(\d*)|(\d*)/;
            var match = regExp.exec(label);

            var labelPart1 = match[1];
            var labelPart2 = match[2];

            if (!labelPart1)
                return -1;

            var searchRegExp, regStr;

            if (labelPart2) {
                regStr = "^" + labelPart1 + "\\D*" + labelPart2 + "$";
            } else {
                regStr = "\\D*" + labelPart1 + "\\D*";
            }

            searchRegExp = new RegExp(regStr);

            for (var i = 0; i < this.sequence.canvases.length; i++) {
                var canvas = this.sequence.canvases[i];

                if (searchRegExp.test(canvas.label)) {
                    return i;
                }
            }

            return -1;
        };

        BaseProvider.prototype.getManifestSeeAlsoUri = function (manifest) {
            return null;
        };

        BaseProvider.prototype.getTree = function () {
            var rootStructure = this.getRootStructure();

            this.treeRoot = new TreeNode('root');
            this.treeRoot.label = "root";
            this.treeRoot.data = rootStructure;
            this.treeRoot.data.type = "manifest";
            rootStructure.treeNode = this.treeRoot;

            for (var i = 0; i < rootStructure.structures.length; i++) {
                var structure = rootStructure.structures[i];

                var node = new TreeNode();
                this.treeRoot.addNode(node);

                node.label = structure.label;
                node.data = structure;
                node.data.type = "structure";
                structure.treeNode = node;
            }

            return this.treeRoot;
        };

        BaseProvider.prototype.getDomain = function () {
            var parts = utils.Utils.getUrlParts(this.dataUri);
            return parts.host;
        };

        BaseProvider.prototype.getEmbedDomain = function () {
            return this.embedDomain;
        };

        BaseProvider.prototype.getMetaData = function (callback) {
            callback(this.manifest.metadata);
        };

        BaseProvider.prototype.defaultToThumbsView = function () {
            var manifestType = this.getManifestType();

            switch (manifestType) {
                case 'monograph':
                    if (!this.isMultiSequence())
                        return true;
                    break;
                case 'archive':
                    return true;
                    break;
                case 'boundmanuscript':
                    return true;
                    break;
                case 'artwork':
                    return true;
            }

            var sequenceType = this.getSequenceType();

            switch (sequenceType) {
                case 'application-pdf':
                    return true;
                    break;
            }

            return false;
        };

        BaseProvider.prototype.getSettings = function () {
            return this.config.options;
        };

        BaseProvider.prototype.updateSettings = function (settings) {
            this.config.options = settings;
        };
        return BaseProvider;
    })();
    exports.BaseProvider = BaseProvider;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('extensions/coreplayer-seadragon-extension/iiifProvider',["require", "exports", "../../modules/coreplayer-shared-module/baseIIIFProvider"], function(require, exports, baseProvider) {
    var Provider = (function (_super) {
        __extends(Provider, _super);
        function Provider(config, manifest) {
            _super.call(this, config, manifest);

            this.config.options = $.extend(true, this.options, {
                imageUriTemplate: "{0}{1}"
            }, config.options);
        }
        Provider.prototype.getImageUri = function (canvas, imageBaseUri, imageUriTemplate) {
            var baseUri = imageBaseUri ? imageBaseUri : this.options.imageBaseUri || this.options.dataBaseUri || "";
            var template = imageUriTemplate ? imageUriTemplate : this.options.imageUriTemplate;

            var iiifUri;

            if (canvas.resources) {
                iiifUri = canvas.resources[0].resource.service['@id'];
            } else if (canvas.images && canvas.images[0].resource.service) {
                iiifUri = canvas.images[0].resource.service['@id'];
            } else {
                return null;
            }

            if (!iiifUri) {
                console.warn('no service endpoint available');
            } else if (iiifUri.endsWith('/')) {
                iiifUri += 'info.js';
            } else {
                iiifUri += '/info.js';
            }

            var uri = String.prototype.format(template, baseUri, iiifUri);

            return uri;
        };

        Provider.prototype.getEmbedScript = function (canvasIndex, zoom, width, height, rotation, embedTemplate) {
            var esu = this.options.embedScriptUri || this.embedScriptUri;

            var template = this.options.embedTemplate || embedTemplate;

            var configUri = this.config.uri || '';

            var script = String.prototype.format(template, this.dataUri, this.sequenceIndex, canvasIndex, zoom, rotation, configUri, width, height, esu);

            return script;
        };

        Provider.prototype.getTileSources = function () {
            var _this = this;
            if (!this.isPaged()) {
                return [{
                        tileSource: this.getImageUri(this.getCurrentCanvas())
                    }];
            } else {
                if (this.isFirstCanvas() || this.isLastCanvas()) {
                    return [{
                            tileSource: this.getImageUri(this.getCurrentCanvas())
                        }];
                } else {
                    var indices = this.getPagedIndices();

                    var tileSources = [];

                    _.each(indices, function (index) {
                        tileSources.push({
                            tileSource: _this.getImageUri(_this.getCanvasByIndex(index))
                        });
                    });

                    return tileSources;
                }
            }
        };
        return Provider;
    })(baseProvider.BaseProvider);
    exports.Provider = Provider;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('extensions/coreplayer-seadragon-extension/provider',["require", "exports", "../../modules/coreplayer-shared-module/baseProvider"], function(require, exports, baseProvider) {
    var Provider = (function (_super) {
        __extends(Provider, _super);
        function Provider(config, manifest) {
            _super.call(this, config, manifest);

            this.config.options = $.extend(true, this.options, {
                dziUriTemplate: "{0}{1}"
            }, config.options);
        }
        Provider.prototype.getImageUri = function (asset, dziBaseUri, dziUriTemplate) {
            var baseUri = dziBaseUri ? dziBaseUri : this.options.dziBaseUri || this.options.dataBaseUri || "";
            var template = dziUriTemplate ? dziUriTemplate : this.options.dziUriTemplate;
            var uri = String.prototype.format(template, baseUri, asset.dziUri);

            return uri;
        };

        Provider.prototype.getEmbedScript = function (assetIndex, zoom, width, height, rotation, embedTemplate) {
            var esu = this.options.embedScriptUri || this.embedScriptUri;

            var template = this.options.embedTemplate || embedTemplate;

            var configUri = this.config.uri || '';

            var script = String.prototype.format(template, this.dataUri, this.sequenceIndex, assetIndex, zoom, rotation, configUri, width, height, esu);

            return script;
        };

        Provider.prototype.getTileSources = function () {
            return null;
        };
        return Provider;
    })(baseProvider.BaseProvider);
    exports.Provider = Provider;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('modules/coreplayer-mediaelementcenterpanel-module/mediaelementCenterPanel',["require", "exports", "../coreplayer-shared-module/baseExtension", "../../extensions/coreplayer-mediaelement-extension/extension", "../coreplayer-shared-module/centerPanel", "../../utils"], function(require, exports, baseExtension, extension, baseCenter, utils) {
    var MediaElementCenterPanel = (function (_super) {
        __extends(MediaElementCenterPanel, _super);
        function MediaElementCenterPanel($element) {
            _super.call(this, $element);
        }
        MediaElementCenterPanel.prototype.create = function () {
            this.setConfig('mediaelementCenterPanel');

            _super.prototype.create.call(this);

            var that = this;

            if (this.provider.getSequenceType().contains('video')) {
                $.subscribe(baseExtension.BaseExtension.TOGGLE_FULLSCREEN, function (e) {
                    if (that.extension.isFullScreen) {
                        that.$container.css('backgroundColor', '#000');
                        that.player.enterFullScreen(false);
                    } else {
                        that.$container.css('backgroundColor', 'transparent');
                        that.player.exitFullScreen(false);
                    }
                });
            }

            $.subscribe(extension.Extension.OPEN_MEDIA, function (e, canvas) {
                that.viewMedia(canvas);
            });

            this.$container = $('<div class="container"></div>');
            this.$content.append(this.$container);

            this.title = this.extension.provider.getTitle();
        };

        MediaElementCenterPanel.prototype.viewMedia = function (canvas) {
            var that = this;

            this.$container.empty();

            this.mediaHeight = 576;
            this.mediaWidth = 720;

            this.$container.height(this.mediaHeight);
            this.$container.width(this.mediaWidth);

            var id = utils.Utils.getTimeStamp();

            var poster = this.provider.getPosterImageUri();

            var type = this.provider.getSequenceType();

            if (type.contains('video')) {
                if (!canvas.sources) {
                    this.media = this.$container.append('<video id="' + id + '" type="video/mp4" src="' + canvas.mediaUri + '" class="mejs-wellcome" controls="controls" preload="none" poster="' + poster + '"></video>');
                } else {
                    this.media = this.$container.append('<video id="' + id + '" type="video/mp4" class="mejs-wellcome" controls="controls" preload="none" poster="' + poster + '"></video>');
                }

                this.player = new MediaElementPlayer("#" + id, {
                    type: ['video/mp4', 'video/webm', 'video/flv'],
                    plugins: ['flash'],
                    alwaysShowControls: false,
                    autosizeProgress: false,
                    success: function (media) {
                        media.addEventListener('canplay', function (e) {
                            that.resize();
                        });

                        media.addEventListener('play', function (e) {
                            $.publish(extension.Extension.MEDIA_PLAYED, [Math.floor(that.player.media.currentTime)]);
                        });

                        media.addEventListener('pause', function (e) {
                            if (Math.floor(that.player.media.currentTime) != Math.floor(that.player.media.duration)) {
                                $.publish(extension.Extension.MEDIA_PAUSED, [Math.floor(that.player.media.currentTime)]);
                            }
                        });

                        media.addEventListener('ended', function (e) {
                            $.publish(extension.Extension.MEDIA_ENDED, [Math.floor(that.player.media.duration)]);
                        });

                        if (canvas.sources && canvas.sources.length) {
                            media.setSrc(canvas.sources);
                        }

                        try  {
                            media.load();
                        } catch (e) {
                        }
                    }
                });
            } else if (type.contains('audio')) {
                this.media = this.$container.append('<audio id="' + id + '" type="audio/mp3" src="' + canvas.mediaUri + '" class="mejs-wellcome" controls="controls" preload="none" poster="' + poster + '"></audio>');

                this.player = new MediaElementPlayer("#" + id, {
                    plugins: ['flash'],
                    alwaysShowControls: false,
                    autosizeProgress: false,
                    defaultVideoWidth: that.mediaWidth,
                    defaultVideoHeight: that.mediaHeight,
                    success: function (media) {
                        media.addEventListener('canplay', function (e) {
                            that.resize();
                        });

                        media.addEventListener('play', function (e) {
                            $.publish(extension.Extension.MEDIA_PLAYED, [Math.floor(that.player.media.currentTime)]);
                        });

                        media.addEventListener('pause', function (e) {
                            if (Math.floor(that.player.media.currentTime) != Math.floor(that.player.media.duration)) {
                                $.publish(extension.Extension.MEDIA_PAUSED, [Math.floor(that.player.media.currentTime)]);
                            }
                        });

                        media.addEventListener('ended', function (e) {
                            $.publish(extension.Extension.MEDIA_ENDED, [Math.floor(that.player.media.duration)]);
                        });

                        try  {
                            media.load();
                        } catch (e) {
                        }
                    }
                });
            }

            this.resize();
        };

        MediaElementCenterPanel.prototype.getPlayer = function () {
            return this.player;
        };

        MediaElementCenterPanel.prototype.resize = function () {
            _super.prototype.resize.call(this);

            if (window.BrowserDetect.browser == 'Firefox' && window.BrowserDetect.version < 13) {
                this.$container.width(this.mediaWidth);
                this.$container.height(this.mediaHeight);
            } else {
                var size = utils.Utils.fitRect(this.mediaWidth, this.mediaHeight, this.$content.width(), this.$content.height());

                this.$container.height(size.height);
                this.$container.width(size.width);
            }

            if (this.player && !this.extension.isFullScreen) {
                this.player.resize();
            }

            var left = Math.floor((this.$content.width() - this.$container.width()) / 2);
            var top = Math.floor((this.$content.height() - this.$container.height()) / 2);

            this.$container.css({
                'left': left,
                'top': top
            });

            this.$title.ellipsisFill(this.title);
        };
        return MediaElementCenterPanel;
    })(baseCenter.CenterPanel);
    exports.MediaElementCenterPanel = MediaElementCenterPanel;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('extensions/coreplayer-mediaelement-extension/embedDialogue',["require", "exports", "../../modules/coreplayer-dialogues-module/embedDialogue"], function(require, exports, embed) {
    var EmbedDialogue = (function (_super) {
        __extends(EmbedDialogue, _super);
        function EmbedDialogue() {
            _super.apply(this, arguments);
        }
        EmbedDialogue.prototype.create = function () {
            this.setConfig('embedDialogue');

            _super.prototype.create.call(this);
        };

        EmbedDialogue.prototype.formatCode = function () {
            this.code = this.provider.getEmbedScript(this.currentWidth, this.currentHeight, this.options.embedTemplate);

            this.$code.val(this.code);
        };

        EmbedDialogue.prototype.resize = function () {
            _super.prototype.resize.call(this);
        };
        return EmbedDialogue;
    })(embed.EmbedDialogue);
    exports.EmbedDialogue = EmbedDialogue;
});

define('extensions/coreplayer-mediaelement-extension/dependencies',[],function() {
    return {
        'mediaelement': './js/mediaelement-and-player'
    };

    var Dependencies = (function () {
        function Dependencies() {
        }
        return Dependencies;
    })();
    exports.Dependencies = Dependencies;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('extensions/coreplayer-mediaelement-extension/extension',["require", "exports", "../../modules/coreplayer-shared-module/baseExtension", "../../utils", "../../modules/coreplayer-shared-module/baseProvider", "../../modules/coreplayer-shared-module/shell", "../../modules/coreplayer-shared-module/headerPanel", "../../modules/coreplayer-shared-module/leftPanel", "../../modules/coreplayer-treeviewleftpanel-module/treeViewLeftPanel", "../../modules/coreplayer-treeviewleftpanel-module/treeView", "../../modules/coreplayer-mediaelementcenterpanel-module/mediaelementCenterPanel", "../../modules/coreplayer-shared-module/rightPanel", "../../modules/coreplayer-moreinforightpanel-module/moreInfoRightPanel", "../../modules/coreplayer-shared-module/footerPanel", "../../modules/coreplayer-dialogues-module/helpDialogue", "./embedDialogue", "../../coreplayer-mediaelement-extension-dependencies"], function(require, exports, baseExtension, utils, baseProvider, shell, header, baseLeft, left, treeView, center, baseRight, right, footer, help, embed, dependencies) {
    var Extension = (function (_super) {
        __extends(Extension, _super);
        function Extension(provider) {
            _super.call(this, provider);
        }
        Extension.prototype.create = function () {
            var _this = this;
            _super.prototype.create.call(this);

            var that = this;

            $(window).bind('enterfullscreen', function () {
                $.publish(baseExtension.BaseExtension.TOGGLE_FULLSCREEN);
            });

            $(window).bind('exitfullscreen', function () {
                $.publish(baseExtension.BaseExtension.TOGGLE_FULLSCREEN);
            });

            $.subscribe(treeView.TreeView.NODE_SELECTED, function (e, data) {
                _this.viewManifest(data);
            });

            $.subscribe(footer.FooterPanel.EMBED, function (e) {
                $.publish(embed.EmbedDialogue.SHOW_EMBED_DIALOGUE);
            });

            $.subscribe(baseLeft.LeftPanel.OPEN_LEFT_PANEL, function (e) {
                _this.resize();
            });

            $.subscribe(baseLeft.LeftPanel.CLOSE_LEFT_PANEL, function (e) {
                _this.resize();
            });

            $.subscribe(baseRight.RightPanel.OPEN_RIGHT_PANEL, function (e) {
                _this.resize();
            });

            $.subscribe(baseRight.RightPanel.CLOSE_RIGHT_PANEL, function (e) {
                _this.resize();
            });

            require(_.values(dependencies), function () {
                that.createModules();

                that.setParams();

                $.publish(baseExtension.BaseExtension.RESIZE);

                that.viewMedia();

                $.publish(Extension.CREATED);
            });
        };

        Extension.prototype.createModules = function () {
            this.headerPanel = new header.HeaderPanel(shell.Shell.$headerPanel);

            if (this.isLeftPanelEnabled()) {
                this.leftPanel = new left.TreeViewLeftPanel(shell.Shell.$leftPanel);
            }

            this.centerPanel = new center.MediaElementCenterPanel(shell.Shell.$centerPanel);
            this.rightPanel = new right.MoreInfoRightPanel(shell.Shell.$rightPanel);
            this.footerPanel = new footer.FooterPanel(shell.Shell.$footerPanel);

            this.$helpDialogue = utils.Utils.createDiv('overlay help');
            shell.Shell.$overlays.append(this.$helpDialogue);
            this.helpDialogue = new help.HelpDialogue(this.$helpDialogue);

            this.$embedDialogue = utils.Utils.createDiv('overlay embed');
            shell.Shell.$overlays.append(this.$embedDialogue);
            this.embedDialogue = new embed.EmbedDialogue(this.$embedDialogue);

            if (this.isLeftPanelEnabled()) {
                this.leftPanel.init();
            }
        };

        Extension.prototype.setParams = function () {
            if (!this.provider.isHomeDomain)
                return;

            this.setParam(0 /* sequenceIndex */, this.provider.sequenceIndex);
        };

        Extension.prototype.isLeftPanelEnabled = function () {
            return utils.Utils.getBool(this.provider.config.options.leftPanelEnabled, true) && this.provider.isMultiSequence();
        };

        Extension.prototype.viewMedia = function () {
            var _this = this;
            var canvas = this.provider.getCanvasByIndex(0);

            this.viewCanvas(0, function () {
                _this.provider.setMediaUri(canvas);

                $.publish(Extension.OPEN_MEDIA, [canvas]);

                _this.setParam(1 /* canvasIndex */, 0);
            });
        };
        Extension.OPEN_MEDIA = 'onMediaOpened';
        Extension.MEDIA_PLAYED = 'onMediaPlayed';
        Extension.MEDIA_PAUSED = 'onMediaPaused';
        Extension.MEDIA_ENDED = 'onMediaEnded';
        return Extension;
    })(baseExtension.BaseExtension);
    exports.Extension = Extension;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('extensions/coreplayer-mediaelement-extension/provider',["require", "exports", "../../modules/coreplayer-shared-module/baseProvider"], function(require, exports, baseProvider) {
    var Provider = (function (_super) {
        __extends(Provider, _super);
        function Provider(config, manifest) {
            _super.call(this, config, manifest);

            this.config.options = $.extend(true, this.options, {}, config.options);
        }
        Provider.prototype.getEmbedScript = function (width, height, embedTemplate) {
            var esu = this.options.embedScriptUri || this.embedScriptUri;

            var template = this.options.embedTemplate || embedTemplate;

            var configUri = this.config.uri || '';

            var script = String.prototype.format(template, this.dataUri, this.sequenceIndex, configUri, width, height, esu);

            return script;
        };

        Provider.prototype.getPosterImageUri = function () {
            var baseUri = this.options.mediaBaseUri || "";
            var template = this.options.mediaUriTemplate;
            var uri = String.prototype.format(template, baseUri, this.sequence.extensions.posterImage);

            return uri;
        };
        return Provider;
    })(baseProvider.BaseProvider);
    exports.Provider = Provider;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('modules/coreplayer-pdfcenterpanel-module/pdfCenterPanel',["require", "exports", "../../extensions/coreplayer-pdf-extension/extension", "../coreplayer-shared-module/centerPanel"], function(require, exports, extension, baseCenter) {
    var PDFCenterPanel = (function (_super) {
        __extends(PDFCenterPanel, _super);
        function PDFCenterPanel($element) {
            _super.call(this, $element);
        }
        PDFCenterPanel.prototype.create = function () {
            var _this = this;
            this.setConfig('pdfCenterPanel');

            _super.prototype.create.call(this);

            $.subscribe(extension.Extension.OPEN_MEDIA, function (e, canvas) {
                _this.viewMedia(canvas);
            });
        };

        PDFCenterPanel.prototype.viewMedia = function (canvas) {
            var _this = this;
            var browser = window.BrowserDetect.browser;
            var version = window.BrowserDetect.version;

            if (browser == 'Explorer' && version < 10) {
                var myPDF = new PDFObject({
                    url: canvas.mediaUri,
                    id: "PDF"
                }).embed('content');
            } else {
                var viewerPath;

                if (window.DEBUG) {
                    viewerPath = 'modules/coreplayer-pdfcenterpanel-module/html/viewer.html';
                } else {
                    viewerPath = 'html/coreplayer-pdfcenterpanel-module/viewer.html';
                }

                this.$content.load(viewerPath, function () {
                    if (window.DEBUG) {
                        PDFJS.workerSrc = 'extensions/coreplayer-pdf-extension/js/pdf.worker.min.js';
                    } else {
                        PDFJS.workerSrc = 'js/pdf.worker.min.js';
                    }

                    PDFJS.DEFAULT_URL = canvas.mediaUri;

                    window.webViewerLoad();

                    _this.resize();
                });
            }
        };

        PDFCenterPanel.prototype.resize = function () {
            _super.prototype.resize.call(this);
        };
        return PDFCenterPanel;
    })(baseCenter.CenterPanel);
    exports.PDFCenterPanel = PDFCenterPanel;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('extensions/coreplayer-pdf-extension/embedDialogue',["require", "exports", "../../modules/coreplayer-dialogues-module/embedDialogue"], function(require, exports, embed) {
    var EmbedDialogue = (function (_super) {
        __extends(EmbedDialogue, _super);
        function EmbedDialogue() {
            _super.apply(this, arguments);
        }
        EmbedDialogue.prototype.create = function () {
            this.setConfig('embedDialogue');

            _super.prototype.create.call(this);
        };

        EmbedDialogue.prototype.formatCode = function () {
            this.code = this.provider.getEmbedScript(this.currentWidth, this.currentHeight, this.options.embedTemplate);

            this.$code.val(this.code);
        };

        EmbedDialogue.prototype.resize = function () {
            _super.prototype.resize.call(this);
        };
        return EmbedDialogue;
    })(embed.EmbedDialogue);
    exports.EmbedDialogue = EmbedDialogue;
});

define('extensions/coreplayer-pdf-extension/dependencies',[],function() {
    var paths = {
        'pdf': './js/pdf_combined',
        'pdfobject': './js/pdfobject'
    };

    return paths;

    var Dependencies = (function () {
        function Dependencies() {
        }
        return Dependencies;
    })();
    exports.Dependencies = Dependencies;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('extensions/coreplayer-pdf-extension/extension',["require", "exports", "../../modules/coreplayer-shared-module/baseExtension", "../../utils", "../../modules/coreplayer-shared-module/baseProvider", "../../modules/coreplayer-shared-module/shell", "../../modules/coreplayer-shared-module/headerPanel", "../../modules/coreplayer-shared-module/leftPanel", "../../modules/coreplayer-treeviewleftpanel-module/treeViewLeftPanel", "../../modules/coreplayer-pdfcenterpanel-module/pdfCenterPanel", "../../modules/coreplayer-shared-module/rightPanel", "../../modules/coreplayer-moreinforightpanel-module/moreInfoRightPanel", "../../modules/coreplayer-shared-module/footerPanel", "../../modules/coreplayer-dialogues-module/helpDialogue", "./embedDialogue", "../../modules/coreplayer-treeviewleftpanel-module/thumbsView", "../../coreplayer-pdf-extension-dependencies"], function(require, exports, baseExtension, utils, baseProvider, shell, header, baseLeft, left, center, baseRight, right, footer, help, embed, thumbsView, dependencies) {
    var Extension = (function (_super) {
        __extends(Extension, _super);
        function Extension(provider) {
            _super.call(this, provider);
        }
        Extension.prototype.create = function () {
            var _this = this;
            _super.prototype.create.call(this);

            var that = this;

            $.subscribe(thumbsView.ThumbsView.THUMB_SELECTED, function (e, index) {
                window.open(that.provider.getPDFUri());
            });

            $.subscribe(footer.FooterPanel.EMBED, function (e) {
                $.publish(embed.EmbedDialogue.SHOW_EMBED_DIALOGUE);
            });

            $.subscribe(shell.Shell.SHOW_OVERLAY, function (e, params) {
                if (_this.IsOldIE()) {
                    _this.centerPanel.$element.hide();
                }
            });

            $.subscribe(shell.Shell.HIDE_OVERLAY, function (e, params) {
                if (_this.IsOldIE()) {
                    _this.centerPanel.$element.show();
                }
            });

            $.subscribe(baseLeft.LeftPanel.OPEN_LEFT_PANEL, function (e) {
                _this.resize();
            });

            $.subscribe(baseLeft.LeftPanel.CLOSE_LEFT_PANEL, function (e) {
                _this.resize();
            });

            $.subscribe(baseRight.RightPanel.OPEN_RIGHT_PANEL, function (e) {
                _this.resize();
            });

            $.subscribe(baseRight.RightPanel.CLOSE_RIGHT_PANEL, function (e) {
                _this.resize();
            });

            require(_.values(dependencies), function () {
                that.createModules();

                $.publish(baseExtension.BaseExtension.RESIZE);

                that.viewMedia();

                $.publish(Extension.CREATED);
            });
        };

        Extension.prototype.IsOldIE = function () {
            var browser = window.BrowserDetect.browser;
            var version = window.BrowserDetect.version;

            if (browser == 'Explorer' && version <= 9)
                return true;
            return false;
        };

        Extension.prototype.createModules = function () {
            this.headerPanel = new header.HeaderPanel(shell.Shell.$headerPanel);

            if (this.isLeftPanelEnabled()) {
                this.leftPanel = new left.TreeViewLeftPanel(shell.Shell.$leftPanel);
            }

            this.centerPanel = new center.PDFCenterPanel(shell.Shell.$centerPanel);

            if (this.isRightPanelEnabled()) {
                this.rightPanel = new right.MoreInfoRightPanel(shell.Shell.$rightPanel);
            }

            this.footerPanel = new footer.FooterPanel(shell.Shell.$footerPanel);

            this.$helpDialogue = utils.Utils.createDiv('overlay help');
            shell.Shell.$overlays.append(this.$helpDialogue);
            this.helpDialogue = new help.HelpDialogue(this.$helpDialogue);

            this.$embedDialogue = utils.Utils.createDiv('overlay embed');
            shell.Shell.$overlays.append(this.$embedDialogue);
            this.embedDialogue = new embed.EmbedDialogue(this.$embedDialogue);

            if (this.isLeftPanelEnabled()) {
                this.leftPanel.init();
            }
        };

        Extension.prototype.isLeftPanelEnabled = function () {
            return utils.Utils.getBool(this.provider.config.options.leftPanelEnabled, true);
        };

        Extension.prototype.isRightPanelEnabled = function () {
            return utils.Utils.getBool(this.provider.config.options.rightPanelEnabled, true);
        };

        Extension.prototype.viewMedia = function () {
            var _this = this;
            var canvas = this.provider.getCanvasByIndex(0);

            this.viewCanvas(0, function () {
                _this.provider.setMediaUri(canvas);

                $.publish(Extension.OPEN_MEDIA, [canvas]);

                _this.setParam(1 /* canvasIndex */, 0);
            });
        };
        return Extension;
    })(baseExtension.BaseExtension);
    exports.Extension = Extension;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('extensions/coreplayer-pdf-extension/provider',["require", "exports", "../../modules/coreplayer-shared-module/baseProvider"], function(require, exports, baseProvider) {
    var Provider = (function (_super) {
        __extends(Provider, _super);
        function Provider(config, manifest) {
            _super.call(this, config, manifest);

            this.config.options = $.extend(true, this.options, {}, config.options);
        }
        Provider.prototype.getPDFUri = function () {
            var canvas = this.getCanvasByIndex(0);
            return canvas.mediaUri;
        };

        Provider.prototype.getEmbedScript = function (width, height, embedTemplate) {
            var esu = this.options.embedScriptUri || this.embedScriptUri;

            var template = this.options.embedTemplate || embedTemplate;

            var configUri = this.config.uri || '';

            var script = String.prototype.format(template, this.dataUri, this.sequenceIndex, configUri, width, height, esu);

            return script;
        };
        return Provider;
    })(baseProvider.BaseProvider);
    exports.Provider = Provider;
});

require.config({
    paths: {
        'jquery': 'js/jquery-1.10.2.min',
        'plugins': 'js/jquery.plugins',
        'underscore': 'js/underscore-min',
        'pubsub': 'js/pubsub',
        'jsviews': 'js/jsviews.min',
        'yepnope': 'js/yepnope.1.5.4-min',
        'yepnopecss': 'js/yepnope.css',
        'l10n': 'js/l10n'
    },
    shim: {
        jquery: {
            exports: '$'
        },
        plugins: {
            deps: ['jquery']
        },
        underscore: {
            exports: '_'
        },
        pubsub: {
            deps: ['jquery']
        },
        jsviews: {
            deps: ['jquery']
        },
        yepnopecss: {
            deps: ['yepnope']
        }
    }
});

require([
    'jquery',
    'plugins',
    'underscore',
    'pubsub',
    'jsviews',
    'yepnope',
    'yepnopecss',
    'bootstrapper',
    'l10n',
    'extensions/coreplayer-seadragon-extension/extension',
    'extensions/coreplayer-seadragon-extension/iiifProvider',
    'extensions/coreplayer-seadragon-extension/provider',
    'extensions/coreplayer-mediaelement-extension/extension',
    'extensions/coreplayer-mediaelement-extension/provider',
    'extensions/coreplayer-pdf-extension/extension',
    'extensions/coreplayer-pdf-extension/provider'
], function ($, plugins, _, pubsub, jsviews, yepnope, yepnopecss, bootstrapper, l10n, seadragonExtension, seadragonIIIFProvider, seadragonProvider, mediaelementExtension, mediaelementProvider, pdfExtension, pdfProvider) {
    

    var extensions = {};

    extensions['seadragon/dzi'] = {
        type: seadragonExtension.Extension,
        provider: seadragonProvider.Provider,
        name: 'coreplayer-seadragon-extension'
    };

    extensions['seadragon/iiif'] = {
        type: seadragonExtension.Extension,
        provider: seadragonIIIFProvider.Provider,
        name: 'coreplayer-seadragon-extension'
    };

    extensions['video/mp4'] = {
        type: mediaelementExtension.Extension,
        provider: mediaelementProvider.Provider,
        name: 'coreplayer-mediaelement-extension'
    };

    extensions['video/multiple-sources'] = {
        type: mediaelementExtension.Extension,
        provider: mediaelementProvider.Provider,
        name: 'coreplayer-mediaelement-extension'
    };

    extensions['audio/mp3'] = {
        type: mediaelementExtension.Extension,
        provider: mediaelementProvider.Provider,
        name: 'coreplayer-mediaelement-extension'
    };

    extensions['application/pdf'] = {
        type: pdfExtension.Extension,
        provider: pdfProvider.Provider,
        name: 'coreplayer-pdf-extension'
    };

    new bootstrapper(extensions);
});

define("app", function(){});
