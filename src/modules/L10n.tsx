import LocalizedStrings, { LocalizedStringsMethods } from 'react-localization';
import translationKo from '../locales/ko.json';
// import translationJa from '../locales/ja.json';
// import translationEn from '../locales/en.json';
import React, { Fragment } from 'react';


class L10n {
  	localization: LocalizedStringsMethods;
	langs: any = {};
	initFlag: boolean = false;

	constructor() {
		this.localization = new LocalizedStrings({"init": "init"});
	}

	setLocalization(langCode: string, langResourceUrl: string) {
		var xhr = new XMLHttpRequest();
		xhr.open("GET", langResourceUrl, false);
		xhr.send();

		if(xhr.status === 200){
			const json = JSON.parse(xhr.responseText);
			this.localization = new LocalizedStrings({
				// [langCode]: json
				[langCode]: translationKo // 로컬 개발 시
			})
		}
	}

	initLangWithResource(lang: string, langResourceUrl: string) {
		const langCode = this.getLangCode(lang);
		this.setLocalization(langCode!!, langResourceUrl);
		this.setLang(langCode!!);
		this.initFlag = true;
	}

	getLangCode(lang: string) {
			return lang.split("-")[0]; // lang에 국가 코드가 포함되어있다면 분리하여 언어코드만 사용한다. ("ko-KR" => "ko")
	}

	getLangCode2() {
		const lang = this.localization.getLanguage()
		return this.getLangCode(lang)
	}

	setLang(lang: string) {
		this.localization.setLanguage(lang);
	}

  	get(key: string) {
		if(this.localization.getLanguage() == "init") return "";

		return this.localization.getString(key);
	}

	getLine(key: string) {
		if(this.get(key) == undefined) return;

		return this.get(key).split("<br/>").map((line, index) => {
			return (
				<Fragment key={index}>
					{index ? <br /> : ""}{line}
				</Fragment>
			)
		});
	}
}

export default new L10n()