(function(window, document){
  const baseUrl = '/'; // window.location.pathname.toLowerCase();
  const default_lang = 'fa';
  const allowed = /\/fa\/|\/en\/|\/ar\//;
  const url = window.location.href.toLowerCase();
  const lang = (url.match(allowed) || [default_lang])[0];
  const rtl = (lang === 'fa' || lang === 'ar');
  const dir = rtl ? 'rtl' : 'ltr';
  const html = document.getElementsByTagName('html')[0];
  const base = document.getElementsByTagName('base')[0];
  base.setAttribute('href', baseUrl);
  html.setAttribute('lang', lang);
  html.setAttribute('dir', dir);
  document.cookie = "culture=" + lang;
})(window, document);
