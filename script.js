/* ===== CONFIGURACIÓN: completen solo este bloque ===== */
const CONFIG = {
  facebook: "",         // https://www.facebook.com/su-fanpage
  instagram: "",        // https://www.instagram.com/su-cuenta
  whatsapp: "",         // solo números con código de país. Ej: 51999999999
  email: "",            // correo del negocio
  mailchimpAction: "",  // valor de action="..." del formulario incrustado de Mailchimp
  mailchimpLink: "",    // (opcional) enlace al formulario alojado de Mailchimp
  // Sus 2 videos. En "url" pueden poner: enlace de YouTube, enlace de Google Drive,
  // enlace de inserción de Powtoon, o la ruta de un archivo .mp4 (ej: "videos/video1.mp4")
  videos: [
    { titulo: "Video promocional 1", url: "videos/Prom1.mp4" },
    { titulo: "Video promocional 2", url: "videos/Prom2.mp4" }
  ],
  cuponVigencia: "31/12/2026"
};
/* ===================================================== */
const $ = s => document.querySelector(s), $$ = s => document.querySelectorAll(s);
document.addEventListener('DOMContentLoaded', () => {
  const C = CONFIG;
  // enlaces de contacto: se ocultan si no hay dato
  const wa = C.whatsapp ? 'https://wa.me/' + C.whatsapp.replace(/\D/g, '') : '';
  const links = { facebook: C.facebook, instagram: C.instagram, whatsapp: wa, email: C.email ? 'mailto:' + C.email : '' };
  $$('[data-link]').forEach(a => links[a.dataset.link] ? a.href = links[a.dataset.link] : a.classList.add('hide'));
  // videos
  const embed = u => {
    let m;
    if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(u)) return '<video controls playsinline preload="metadata" src="' + u + '"></video>';
    if ((m = u.match(/(?:youtu\.be\/|v=|shorts\/)([\w-]{11})/))) u = 'https://www.youtube.com/embed/' + m[1];
    else if ((m = u.match(/drive\.google\.com\/file\/d\/([\w-]+)/))) u = 'https://drive.google.com/file/d/' + m[1] + '/preview';
    return '<iframe src="' + u + '" title="Video de Blushé Cosmetics" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>';
  };
  $('#videoGrid').innerHTML = C.videos.map(v => '<figure class="rv"><div class="video">' +
    (v.url ? embed(v.url) : '<div class="vph">&#127916;<p>Próximamente</p></div>') +
    '</div><figcaption>' + v.titulo + '</figcaption></figure>').join('');
  // mailchimp
  const f = $('#subForm');
  if (C.mailchimpAction) f.action = C.mailchimpAction;
  else if (C.mailchimpLink) { f.classList.add('hide'); const l = $('#subLink'); l.href = C.mailchimpLink; l.classList.remove('hide'); }
  else f.addEventListener('submit', e => { e.preventDefault(); alert('Gracias. Pronto activaremos las suscripciones.'); });
  // formulario de consulta (abre correo o WhatsApp con el mensaje)
  $('#contactForm').addEventListener('submit', e => {
    e.preventDefault();
    const d = new FormData(e.target), txt = `Hola Blushé Cosmetics, soy ${d.get('nombre')}. ${d.get('tema')}: ${d.get('mensaje')}`;
    if (C.whatsapp) window.open('https://wa.me/' + C.whatsapp.replace(/\D/g, '') + '?text=' + encodeURIComponent(txt), '_blank');
    else if (C.email) location.href = 'mailto:' + C.email + '?subject=' + encodeURIComponent(d.get('tema')) + '&body=' + encodeURIComponent(txt);
    else alert('Gracias por tu consulta. Pronto activaremos este canal.');
  });
  // cupón
  $('#vig').textContent = C.cuponVigencia; $('#year').textContent = new Date().getFullYear();
  $('#copy').onclick = function () {
    const ok = () => { this.textContent = '¡Código copiado!'; setTimeout(() => this.textContent = 'Copiar código', 2000); };
    navigator.clipboard ? navigator.clipboard.writeText('BLUSHE10').then(ok, () => { }) : 0;
  };
  // menú móvil
  $('#burger').onclick = () => $('#links').classList.toggle('open');
  $$('#links a').forEach(a => a.onclick = () => $('#links').classList.remove('open'));
  // imágenes que aún no existen: se muestra un fondo rosado con ícono
  $$('.ph img').forEach(img => {
    const miss = () => img.parentElement.classList.add('noimg');
    img.addEventListener('error', miss); if (img.complete && !img.naturalWidth) miss();
  });
  // animación al hacer scroll
  const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && (e.target.classList.add('in'), io.unobserve(e.target))), { threshold: .12 });
  $$('.rv').forEach(el => io.observe(el));
});
