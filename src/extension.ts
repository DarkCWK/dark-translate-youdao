import { createHash } from "crypto";
import { post } from "./HttpUtil";

import * as vscode from "vscode";
import { Translator } from "dark-translate-api";

export function activate(context: vscode.ExtensionContext) {
    return {
        async translate(text, option) {
            // TODO: 对语言进行支持

            let ua = "Opera/9.80 (Windows NT 6.1; U; en) Presto/2.8.131 Version/11.11";

            let i = text;

            let lts = Date.now().toString();

            let salt = lts + Math.floor(10 * Math.random());

            let signMd5 = createHash("md5");
            let sign = signMd5.update("fanyideskweb" + i + salt + "Ygy_4c=r#e#4EX^NUGUc5").digest("hex");

            let bvMd5 = createHash("md5");
            let bv = bvMd5.update(ua.substring(ua.indexOf("/") + 1)).digest("hex");

            let body = [
                `i=${i}`,
                `from=auto`,
                `to=auto`,
                `smartresult=dict`,
                `client=fanyideskweb`,
                `salt=${salt}`,
                `sign=${sign}`,
                `lts=${lts}`,
                `bv=${bv}`,
                `doctype=json`,
                `version=2.1`,
                `keyfrom=fanyi.web`,
                `action=FY_BY_REALTlME`,
            ].join("&");

            let headers = {
                "User-Agent": ua,
                Referer: "https://fanyi.youdao.com/",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                Cookie: "OUTFOX_SEARCH_USER_ID=-1432640551@10.110.96.154; OUTFOX_SEARCH_USER_ID_NCOO=1848060309.009117; SESSION_FROM_COOKIE=unknown; ___rl__test__cookies=1662464966342",
            };

            let resultBuffer = await post(
                "http://fanyi.youdao.com/translate_o?smartresult=dict&smartresult=rule",
                body,
                headers
            );

            let result = JSON.parse(resultBuffer.toString("utf-8"));

            if (result.errorCode != 0) return;

            return result.translateResult
                .map((translateRowResult: any) =>
                    translateRowResult.map((translateResult: any) => translateResult.tgt).join("")
                )
                .join("\n");
        },

        getLinkMarkdown() {
            return "有道";
        },
    } as Translator;
}

export function deactivate() {}
