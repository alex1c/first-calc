export const YANDEX_METRIKA_COUNTER_ID = 48325316
export const YANDEX_WEBMASTER_VERIFICATION = 'f30c8f5646bc778c'
export const GOOGLE_SITE_VERIFICATION = 'rB_ti1z-IpbQfE0HD2zpdqvV9gFwjOy167-U9BUwX7E'

export function getYandexMetrikaBootstrap(): string {
	return `
(function(m,e,t,r,i,k,a){
	m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
	m[i].l=1*new Date();
	for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}
	k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
})(window,document,'script','https://mc.yandex.ru/metrika/tag.js','ym');

ym(${YANDEX_METRIKA_COUNTER_ID}, 'init', {
	webvisor: true,
	clickmap: true,
	referrer: document.referrer,
	url: location.href,
	accurateTrackBounce: true,
	trackLinks: true,
	defer: true
});
ym(${YANDEX_METRIKA_COUNTER_ID}, 'hit', location.href, {
	title: document.title,
	referer: document.referrer
});
`.trim()
}
