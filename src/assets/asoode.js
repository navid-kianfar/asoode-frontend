(function(window, document){
  const baseUrl = '/';
  const default_lang = 'lang=en';
  const url = window.location.href.toLowerCase();
  const allowed = /lang=fa|lang=en|lang=ar/;
  const lang = (url.match(allowed) || document.cookie.match(allowed) || [default_lang])[0].match(/fa|en|ar/)[0];
  const rtl = (lang === 'fa' || lang === 'ar');
  const dir = rtl ? 'rtl' : 'ltr';
  const html = document.getElementsByTagName('html')[0];
  const base = document.getElementsByTagName('base')[0];
  document.body.setAttribute('dir', dir);
  document.body.setAttribute('class', `dir-${dir} lang-${lang}`);
  base.setAttribute('href', baseUrl);
  html.setAttribute('lang', lang);
  html.setAttribute('dir', dir);
  document.cookie = "lang=" + lang;
})(window, document);
