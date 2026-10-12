import { a as e, i as t, o as n, s as r, t as i } from "./core-X2R0i3pJ.js";
import { homedir as a } from "os";
import { join as o } from "path";
import { Readable as s } from "stream";
import { text as c } from "stream/consumers";
import { mkdir as l, readFile as u, rename as d, stat as f, writeFile as p } from "fs/promises";
//#region node_modules/.pnpm/typia@15.1.0_ttsc@0.31.3/node_modules/typia/lib/TypeGuardError.mjs
var m = class extends Error {
	constructor(e) {
		super(e.message || `Error on ${e.method}(): invalid type${e.path ? ` on ${e.path}` : ""}, expect to be ${e.expected}`);
		let t = new.target.prototype;
		Object.setPrototypeOf ? Object.setPrototypeOf(this, t) : this.__proto__ = t, this.name = "TypeGuardError", this.method = e.method, this.path = e.path, this.expected = e.expected, this.value = e.value, (e.description || e.value === void 0) && (this.description = e.description ?? [
			"The value at this path is `undefined`.",
			"",
			`Please fill the \`${e.expected}\` typed value next time.`
		].join("\n"));
	}
}, h = (e, t, n) => {
	if (e === !0) throw typeof n == "function" ? n(t) : new m(t);
	return !1;
};
//#endregion
//#region src/utilities.ts
async function g(e, t, n = 10) {
	let r = await fetch(e, t);
	if ([
		429,
		500,
		503
	].includes(r.status)) return await g(e, t, n - 1);
	if (!r.ok) throw Error(`${r.status} ${r.statusText}`);
	return await r.json();
}
async function _(e, t = []) {
	let n = new s(), i = new s(), a = await r(e, t, { listeners: {
		stdout(e) {
			n.push(e);
		},
		stderr(e) {
			i.push(e);
		}
	} });
	return n.push(null), i.push(null), {
		stdout: await c(n),
		stderr: await c(i),
		code: a
	};
}
//#endregion
//#region src/pre_run.ts
async function v() {
	let i = [n, t];
	if (e) {
		(await u("/proc/cpuinfo", "utf-8")).includes("avx2") && i.push("baseline");
		let e = await f("/etc/alpine-release", { throwIfNoEntry: !1 }), { stdout: t } = await r("which", ["ldd", "-s"]) === 0 ? await _("ldd", ["--version"]) : { stdout: "" };
		(e?.isFile() || t.includes("musl")) && i.push("musl");
	}
	return i.join("-");
}
async function y() {
	let { version: e, metadata: { package: t } } = (() => {
		let e = (e, n, r = !0) => (typeof e.version == "string" || h(r, {
			method: "typia.assert",
			path: n + ".version",
			expected: "string",
			value: e.version
		}, a)) && ((typeof e.metadata == "object" && e.metadata !== null || h(r, {
			method: "typia.assert",
			path: n + ".metadata",
			expected: "{ package: string; }",
			value: e.metadata
		}, a)) && t(e.metadata, n + ".metadata", r) || h(r, {
			method: "typia.assert",
			path: n + ".metadata",
			expected: "{ package: string; }",
			value: e.metadata
		}, a)), t = (e, t, n = !0) => typeof e.package == "string" || h(n, {
			method: "typia.assert",
			path: t + "[\"package\"]",
			expected: "string",
			value: e.package
		}, a), n = (e) => typeof e.version == "string" && typeof e.metadata == "object" && e.metadata !== null && r(e.metadata), r = (e) => typeof e.package == "string", i = (e) => typeof e == "object" && !!e && n(e), a;
		return (t, n) => (!1 === i(t) && (a = n, ((t, n, r = !0) => (typeof t == "object" && !!t || h(!0, {
			method: "typia.assert",
			path: n + "",
			expected: "{ version: string; metadata: { package: string; }; }",
			value: t
		}, a)) && e(t, n + "", !0) || h(!0, {
			method: "typia.assert",
			path: n + "",
			expected: "{ version: string; metadata: { package: string; }; }",
			value: t
		}, a))(t, "$input", !0)), t);
	})()(await g("https://opencode.ai/update/api/latest/cli/npm")), n = `${t}-${await v()}`;
	console.log(`Installing ${n} (${e})`);
	let { dist: { tarball: r } } = (() => {
		let e = (e, n, r = !0) => (typeof e.dist == "object" && e.dist !== null || h(r, {
			method: "typia.assert",
			path: n + ".dist",
			expected: "{ tarball: string; }",
			value: e.dist
		}, a)) && t(e.dist, n + ".dist", r) || h(r, {
			method: "typia.assert",
			path: n + ".dist",
			expected: "{ tarball: string; }",
			value: e.dist
		}, a), t = (e, t, n = !0) => typeof e.tarball == "string" || h(n, {
			method: "typia.assert",
			path: t + ".tarball",
			expected: "string",
			value: e.tarball
		}, a), n = (e) => typeof e.dist == "object" && e.dist !== null && r(e.dist), r = (e) => typeof e.tarball == "string", i = (e) => typeof e == "object" && !!e && n(e), a;
		return (t, n) => (!1 === i(t) && (a = n, ((t, n, r = !0) => (typeof t == "object" && !!t || h(!0, {
			method: "typia.assert",
			path: n + "",
			expected: "{ dist: { tarball: string; }; }",
			value: t
		}, a)) && e(t, n + "", !0) || h(!0, {
			method: "typia.assert",
			path: n + "",
			expected: "{ dist: { tarball: string; }; }",
			value: t
		}, a))(t, "$input", !0)), t);
	})()(await g(`https://registry.npmjs.org/${n}/${e}`)), s = r.split("/").pop() ?? `cli-${await v()}-${e}.tgz`, c = `/tmp/opencode-${Date.now()}`;
	console.log(r);
	let u = await fetch(r);
	if (!u.ok) throw Error(`Failed to fetch tarball: ${u.status} ${u.statusText}`);
	let f = await u.arrayBuffer();
	await l(c, { recursive: !0 }), await p(o(c, s), Buffer.from(f));
	let m = await _("tar", [
		"axf",
		o(c, s),
		"package/bin/opencode"
	]);
	if (m.code !== 0) throw Error(`Failed to extract tarball: ${m.stderr}`);
	await l(o(a(), ".opencode"), { recursive: !0 }), await d(o(c, "package/bin"), o(a(), ".opencode")), i(o(a(), ".opencode", "bin")), console.log(`Opencode installed at ${o(a(), ".opencode", "bin")}`);
}
y();
//#endregion
export {};
