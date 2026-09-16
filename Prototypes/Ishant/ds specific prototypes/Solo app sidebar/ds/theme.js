/* Shared theme entry point for specimens and adopting screens. */
(()=>{
 const base=new URL('.',document.currentScript.src);
 const requested=new URLSearchParams(location.search).get('theme');
 const theme=requested==='dark'?'dark':'light';
 document.documentElement.dataset.theme=theme;
 document.documentElement.style.backgroundColor='var(--titan-surface-base)';
 const tokens=document.createElement('link');tokens.rel='stylesheet';tokens.href=new URL('tokens.css',base).href;document.head.append(tokens);
 const link=document.createElement('link');link.rel='stylesheet';link.href=new URL('themes/'+theme+'.css',base).href;
 document.head.append(link);
})();
