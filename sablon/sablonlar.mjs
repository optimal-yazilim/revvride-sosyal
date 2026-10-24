/*
 * Görsel şablonları: her kare bir şablon adı ve alanlarıyla tarif edilir (icerik/taslaklar/*.json),
 * burada HTML'e çevrilir, ciz.mjs başsız Chrome'da JPEG'e çizer.
 *
 * Tasarım dili tipografi ve uygulamanın gerçek ekranlarıdır: süs simgesi, kategori etiketi ve kare sayacı
 * yoktur (Instagram kendi sayacını gösterir).
 *
 * Yazı kutuları data-sigdir taşır: yazı sığmazsa başlık küçültülür; yine sığmazsa çizim hata verir.
 * Alan sınırları ALANLAR'da; AJANS.md şablonları örnekleriyle anlatır.
 */

export const ORANGE = '#FF3600';
const INK = '#18181b';

/** Alanlar ve en fazla karakter sayıları (doğrulamada kullanılır). */
export const ALANLAR = {
  kapak: { zorunlu: ['baslik'], sinir: { baslik: 44, metin: 140 }, secenek: { zemin: ['koyu', 'turuncu', 'acik'] } },
  ipucu: { zorunlu: ['baslik', 'metin'], sinir: { no: 3, baslik: 50, metin: 220, not: 110 } },
  kapanis: { zorunlu: ['baslik'], sinir: { baslik: 44, metin: 170 }, secenek: { zemin: ['turuncu', 'koyu'] } },
  izgara: { zorunlu: ['baslik', 'ogeler'], sinir: { baslik: 44 }, secenek: { zemin: ['turuncu', 'acik'] } },
  liste: { zorunlu: ['ogeler'], sinir: {} },
  alinti: { zorunlu: ['baslik', 'alinti', 'ekran'], sinir: { baslik: 32, kart_etiketi: 22, alinti: 70, metin: 110 }, secenek: { zemin: ['acik', 'turuncu', 'koyu'] } },
  soru: { zorunlu: ['baslik'], sinir: { baslik: 60, metin: 120, rozet: 24 }, secenek: { zemin: ['koyu', 'turuncu', 'acik'] } },
  hikaye: { zorunlu: ['baslik'], sinir: { baslik: 50, metin: 150 }, secenek: { zemin: ['turuncu', 'koyu'] } },
};

/** Zemin seçilmezse kullanılan; zemini olmayan şablonların sabit tonu. */
const VARSAYILAN_ZEMIN = { kapak: 'koyu', ipucu: 'acik', kapanis: 'turuncu', izgara: 'acik', liste: 'acik', alinti: 'acik', soru: 'koyu', hikaye: 'turuncu' };

/** Karenin zemin tonu: acik, turuncu ya da koyu (profil ızgarasının renk sırası için). */
export const zeminTonu = (k) => (ALANLAR[k.sablon]?.secenek?.zemin && k.zemin) || VARSAYILAN_ZEMIN[k.sablon];

const BG = {
  turuncu: `radial-gradient(130% 80% at 15% 0%, #ff6b2c 0%, #ff3600 48%, #c22c00 100%)`,
  koyu: `radial-gradient(120% 70% at 85% 100%, #3a1205 0%, #141416 55%, #0b0b0d 100%)`,
  acik: `linear-gradient(170deg, #fff7f2 0%, #ffe9dd 100%)`,
};
const koyuMu = (z) => z !== 'acik';
const kac = (s = '') => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

const road = (w, h, color = '#fff', opacity = 1) => {
  const d = `M${-0.1 * w} ${0.7 * h} C ${0.25 * w} ${0.55 * h}, ${0.35 * w} ${0.95 * h}, ${0.65 * w} ${0.82 * h} S ${1.05 * w} ${0.6 * h}, ${1.15 * w} ${0.66 * h}`;
  return `<svg style="position:absolute;inset:0;width:100%;height:100%;opacity:${opacity}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
  <path d="${d}" stroke="${color}" stroke-width="${0.06 * w}" fill="none" opacity="0.07"/>
  <path d="${d}" stroke="${color}" stroke-width="${0.007 * w}" stroke-dasharray="${0.035 * w} ${0.035 * w}" fill="none" opacity="0.35"/></svg>`;
};

/** Sığmayan başlığı adım adım küçültür; çizim sonrası taşma denetimi ciz.mjs'de. */
const SIGDIR = `<script>
  document.fonts.ready.then(() => {
    for (const kutu of document.querySelectorAll('[data-sigdir]')) {
      const h = kutu.querySelector('h1');
      if (!h) continue;
      let boy = parseFloat(getComputedStyle(h).fontSize);
      const en_az = boy * 0.62;
      while ((kutu.scrollHeight > kutu.clientHeight + 1 || kutu.scrollWidth > kutu.clientWidth + 1) && boy > en_az) {
        boy -= 3;
        h.style.fontSize = boy + 'px';
      }
    }
    document.body.dataset.hazir = '1';
  });
</script>`;

function page(w, h, bg, body) {
  return `<!doctype html><html lang="tr"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700;800;900&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box} html,body{margin:0;width:${w}px;height:${h}px;overflow:hidden}
  body{position:relative;font-family:Inter,'Segoe UI',sans-serif;background:${bg};color:#fff;-webkit-font-smoothing:antialiased}
  h1{margin:0;font-weight:900;letter-spacing:-0.035em;line-height:1.02;text-wrap:balance}
  p{margin:0;font-weight:500;line-height:1.32;text-wrap:pretty}
  .abs{position:absolute} .col{display:flex;flex-direction:column}
  [data-sigdir]{overflow:hidden}
  .phone{position:absolute;padding:14px;background:#0b0b0d;border-radius:64px;box-shadow:0 40px 90px rgba(40,8,0,.5), inset 0 0 0 3px #2a2a2e}
  .phone img{display:block;width:100%;border-radius:50px}
  .pill{display:inline-flex;align-items:center;gap:14px;border-radius:999px;font-weight:700;white-space:nowrap}
  .card{background:#fff;color:${INK};box-shadow:0 18px 40px rgba(60,10,0,.22)}
</style></head><body>${body}${SIGDIR}</body></html>`;
}

/**
 * Bir kareyi HTML'e çevirir.
 * ctx: { i, n (karenin sırası/sayısı), kaydirmali (bool), rozet (mağaza yazısı), ekran(ad)→url, logo(beyaz|turuncu)→url }
 */
export function kareHtml(k, ctx) {
  const W = 1080;
  const H = 1350;
  const z = zeminTonu(k);
  const yazi = koyuMu(z) ? '#fff' : INK;
  const logo = (stil) => `<img class="abs" src="${ctx.logo(koyuMu(z) ? 'beyaz' : 'turuncu')}" style="${stil}">`;
  const telefon = (ad, o) =>
    `<div class="phone" style="${o.left !== undefined ? `left:${o.left}px;` : ''}${o.right !== undefined ? `right:${o.right}px;` : ''}top:${o.top}px;width:${o.width}px;transform:rotate(${o.rotate ?? 0}deg)"><img src="${ctx.ekran(ad)}"></div>`;
  const rozet = (renk, zemin, boy = 28) => `<div><span class="pill" style="padding:20px 28px;background:${zemin};color:${renk};font-size:${boy}px">${kac(ctx.rozet)}</span></div>`;

  switch (k.sablon) {
    case 'kapak': {
      const genis = k.ekran ? 560 : 900;
      return page(W, H, BG[z], `${road(W, H, z === 'turuncu' ? '#fff' : ORANGE, z === 'acik' ? 0.9 : 1)}
        <div class="abs col" data-sigdir style="left:80px;top:96px;width:${genis}px;bottom:200px;gap:34px">
          <h1 style="font-size:${k.ekran ? 104 : 136}px;color:${yazi}">${kac(k.baslik)}</h1>
          ${k.metin ? `<p style="font-size:38px;color:${koyuMu(z) ? 'rgba(255,255,255,.9)' : '#3f3f46'}">${kac(k.metin)}</p>` : ''}
        </div>
        ${k.ekran ? telefon(k.ekran, { right: -60, top: 360, width: 440, rotate: 6 }) : ''}
        ${ctx.kaydirmali && ctx.i === 1 ? `<div class="abs pill" style="left:80px;bottom:76px;padding:20px 32px;font-size:30px;background:${koyuMu(z) ? '#fff' : ORANGE};color:${koyuMu(z) ? ORANGE : '#fff'}">Kaydır →</div>` : logo('left:80px;bottom:72px;width:190px')}`);
    }
    case 'ipucu':
      return page(W, H, BG.acik, `${road(W, H, ORANGE, 0.55)}
        <div class="abs col" data-sigdir style="left:80px;right:80px;top:150px;bottom:170px;justify-content:center;gap:40px">
          ${k.no ? `<div style="font-weight:900;font-size:190px;line-height:.8;letter-spacing:-0.05em;color:${ORANGE}">${kac(k.no)}</div>` : ''}
          <h1 style="font-size:${k.baslik.length > 30 ? 86 : 100}px;color:${INK}">${kac(k.baslik)}</h1>
          <p style="font-size:${k.not ? 42 : 46}px;color:#3f3f46">${kac(k.metin)}</p>
          ${k.not ? `<p style="font-size:34px;color:${ORANGE};font-weight:700">${kac(k.not)}</p>` : ''}
        </div>
        ${logo('left:80px;bottom:72px;width:170px')}`);
    case 'kapanis': {
      const genis = k.ekran ? 560 : 920;
      return page(W, H, BG[z], `${road(W, H, z === 'koyu' ? ORANGE : '#fff', z === 'koyu' ? 0.8 : 1)}
        <div class="abs col" data-sigdir style="left:80px;top:170px;width:${genis}px;bottom:170px;gap:36px">
          <h1 style="font-size:${k.ekran ? (k.baslik.length > 26 ? 88 : 100) : 124}px">${kac(k.baslik)}</h1>
          ${k.metin ? `<p style="font-size:${k.ekran ? 38 : 46}px;opacity:.92">${kac(k.metin)}</p>` : ''}
          ${k.rozet === false ? '' : rozet(ORANGE, '#fff', k.ekran ? 26 : 32)}
        </div>
        ${k.ekran ? telefon(k.ekran, { right: -50, top: 300, width: 430, rotate: 5 }) : ''}
        ${logo('left:80px;bottom:72px;width:200px')}`);
    }
    case 'izgara': {
      const sutun = k.ogeler.length <= 6 ? 2 : 3;
      return page(W, H, BG[z], `${road(W, H, z === 'acik' ? ORANGE : '#fff', z === 'acik' ? 0.5 : 1)}
        <div class="abs col" data-sigdir style="left:80px;right:80px;top:100px;bottom:90px;gap:48px">
          <h1 style="font-size:${sutun === 2 ? 104 : 84}px;color:${yazi}">${kac(k.baslik)}</h1>
          <div style="display:grid;grid-template-columns:repeat(${sutun},1fr);gap:${sutun === 2 ? 28 : 22}px">
            ${k.ogeler.map((o) => `<div class="card" style="border-radius:40px;min-height:${sutun === 2 ? 190 : 150}px;padding:${sutun === 2 ? '40px 36px' : '30px 20px'};display:flex;align-items:center;justify-content:${sutun === 2 ? 'flex-start' : 'center'};box-shadow:0 12px 30px rgba(194,44,0,.12)">
              <span style="font-weight:800;font-size:${sutun === 2 ? 42 : 32}px;line-height:1.1;text-align:${sutun === 2 ? 'left' : 'center'}">${kac(o.etiket)}</span></div>`).join('')}
          </div>
        </div>`);
    }
    case 'liste': {
      const bas = k.numara_baslangic ?? null;
      return page(W, H, BG.acik, `${road(W, H, ORANGE, 0.5)}
        <div class="abs col" data-sigdir style="left:80px;right:80px;top:150px;bottom:100px;justify-content:center;gap:${k.ogeler.length > 3 ? 30 : 40}px">
          ${k.ogeler.map((o, j) => `<div class="card col" style="border-radius:40px;padding:36px 44px;gap:12px;box-shadow:0 12px 30px rgba(194,44,0,.12)">
            <div style="font-weight:900;font-size:46px;letter-spacing:-0.02em">${bas !== null ? `<span style="color:${ORANGE}">${bas + j}.</span> ` : ''}${kac(o.baslik)}</div>
            <div style="font-weight:500;font-size:32px;line-height:1.3;color:#52525b">${kac(o.metin)}</div></div>`).join('')}
        </div>`);
    }
    case 'alinti':
      return page(W, H, BG[z], `${road(W, H, z === 'turuncu' ? '#fff' : ORANGE, 0.9)}
        <div class="abs" data-sigdir style="left:80px;right:80px;top:100px;height:300px"><h1 style="font-size:120px;color:${yazi}">${kac(k.baslik)}</h1></div>
        ${telefon(k.ekran, { right: -40, top: 400, width: 440, rotate: -4 })}
        <div class="abs card" data-sigdir style="left:60px;top:470px;width:570px;max-height:420px;border-radius:44px;padding:40px 42px;box-shadow:0 30px 70px rgba(60,10,0,.25);transform:rotate(-3deg)">
          <div style="color:${ORANGE};font-weight:800;font-size:26px;letter-spacing:.08em">${kac(k.kart_etiketi ?? 'KASKTA DUYDUĞUN')}</div>
          <div style="margin-top:18px;font-weight:800;font-size:${k.alinti.length > 45 ? 46 : 54}px;line-height:1.1;letter-spacing:-0.02em">“${kac(k.alinti)}”</div>
        </div>
        ${k.metin ? `<div class="abs" data-sigdir style="left:80px;width:540px;top:950px;height:230px"><p style="font-size:34px;font-weight:600;color:${yazi}">${kac(k.metin)}</p></div>` : ''}
        ${logo('left:80px;bottom:72px;width:190px')}`);
    case 'soru':
      return page(W, H, BG[z], `${road(W, H, z === 'turuncu' ? '#fff' : ORANGE, z === 'acik' ? 0.6 : 1)}
        ${logo('left:80px;top:90px;width:220px')}
        <div class="abs col" data-sigdir style="left:80px;right:80px;top:280px;bottom:220px;gap:40px">
          <h1 style="font-size:124px;color:${yazi}">${kac(k.baslik)}</h1>
          ${k.metin ? `<p style="font-size:40px;margin-right:120px;color:${koyuMu(z) ? 'rgba(255,255,255,.9)' : '#3f3f46'}">${kac(k.metin)}</p>` : ''}
        </div>
        <div class="abs pill" style="left:80px;bottom:110px;padding:24px 36px;background:${z === 'turuncu' ? '#fff' : ORANGE};color:${z === 'turuncu' ? ORANGE : '#fff'};font-size:34px">${kac(k.rozet ?? 'Yorumlara yaz ↓')}</div>`);
    case 'hikaye':
      return page(1080, 1920, BG[z], `${road(1080, 1920, z === 'koyu' ? ORANGE : '#fff', z === 'koyu' ? 0.8 : 1)}
        <div class="abs col" data-sigdir style="left:80px;right:80px;top:250px;height:${k.maddeler ? 1250 : 950}px;justify-content:center;gap:44px">
          <h1 style="font-size:${k.baslik.length > 26 ? 120 : 140}px">${kac(k.baslik)}</h1>
          ${k.metin ? `<p style="font-size:50px;opacity:.92">${kac(k.metin)}</p>` : ''}
          ${k.maddeler ? `<div class="col" style="gap:20px;margin-top:10px">${k.maddeler.map((t, j) => `<div class="card" style="border-radius:32px;padding:28px 34px;display:flex;align-items:baseline;gap:24px;font-weight:800;font-size:42px">
            <span style="color:${ORANGE};font-weight:900">${j + 1}.</span>${kac(t)}</div>`).join('')}</div>` : ''}
        </div>
        <img class="abs" src="${ctx.logo('beyaz')}" style="left:50%;transform:translateX(-50%);bottom:270px;width:220px">`);
    default:
      throw new Error(`bilinmeyen şablon: ${k.sablon}`);
  }
}

/** Şablonun çıktı boyutu. */
export const boyut = (sablon) => (sablon === 'hikaye' ? [1080, 1920] : [1080, 1350]);
