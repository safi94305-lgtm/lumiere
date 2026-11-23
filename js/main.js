/* ==========================================================
   Lumière — main script (jQuery)
   Handles: shared header/footer, theme, cart, wishlist,
   hero slider, shop filters, product page, newsletter.
   ========================================================== */
(function ($) {
  'use strict';

  var DATA = window.LUM;
  var P = DATA.products;
  var params = new URLSearchParams(location.search);
  var FREE_SHIP = 50, SHIP_FEE = 4.99;

  /* ---------- helpers ---------- */
  var ICONS = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
    heart: '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z"/>',
    bag: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    truck: '<path d="M1 3h15v13H1zM16 8h4l3 3v5h-7z"/><circle cx="5.5" cy="18.5" r="2"/><circle cx="18.5" cy="18.5" r="2"/>',
    ret: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
    headset: '<path d="M3 14v-2a9 9 0 0 1 18 0v2"/><path d="M21 15a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2zM3 15a2 2 0 0 0 2 2h1v-6H5a2 2 0 0 0-2 2z"/>',
    left: '<path d="m15 18-6-6 6-6"/>', right: '<path d="m9 18 6-6-6-6"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>', menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>', minus: '<path d="M5 12h14"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>', check: '<path d="m5 12 5 5L20 7"/>',
    filter: '<path d="M3 5h18M6 12h12M10 19h4"/>',
    insta: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6"/>',
    fb: '<path d="M15 3h-2a4 4 0 0 0-4 4v3H6v4h3v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h2z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'
  };
  function icon(n, s, cls) {
    return '<svg class="' + (cls || '') + '" width="' + (s || 20) + '" height="' + (s || 20) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[n] + '</svg>';
  }
  function money(n) { return '$' + n.toFixed(2); }
  function byId(id) { return P.filter(function (p) { return p.id === +id; })[0]; }
  function store(key, val) {
    try { if (val === undefined) return JSON.parse(localStorage.getItem(key)); localStorage.setItem(key, JSON.stringify(val)); } catch (e) { return null; }
  }
  function media(src, alt, cls) {
    return '<span class="media ' + (cls || '') + '"><img src="' + src + '" alt="' + alt + '" loading="lazy" data-src="' + src + '"></span>';
  }
  function stars(r) { return '<span class="stars" style="--r:' + r + '" role="img" aria-label="Rated ' + r + ' out of 5"></span>'; }
  function imgOf(p) { return 'images/products/' + p.id + '.jpg'; }

  /* Missing-image handling: show a dashed placeholder with the expected file path */
  function markMissing(img) {
    var $m = $(img).closest('.media');
    $m.addClass('is-missing').attr('data-ph', $(img).attr('data-src') || $(img).attr('src') || 'image');
  }
  document.addEventListener('error', function (e) { if (e.target.tagName === 'IMG') markMissing(e.target); }, true);
  function checkImages() {
    $('img').each(function () { if (this.complete && this.naturalWidth === 0) markMissing(this); });
  }

  /* ---------- theme ---------- */
  function setTheme(t, persist) {
    document.documentElement.setAttribute('data-theme', t);
    if (persist) store('lum_theme', t);
    $('.theme-btn').attr('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }

  /* ---------- cart & wishlist state ---------- */
  var cart = store('lum_cart') || [];
  var wish = store('lum_wish') || [];
  function saveCart() { store('lum_cart', cart); renderCart(); }
  function toast(msg) {
    var $t = $('<div class="toast" role="status">' + icon('check', 18) + '<span></span></div>');
    $t.find('span').text(msg);
    $('.toasts').append($t);
    setTimeout(function () { $t.fadeOut(250, function () { $t.remove(); }); }, 2400);
  }
  function addToCart(id, qty, open) {
    var line = cart.filter(function (l) { return l.id === id; })[0];
    if (line) line.qty += qty; else cart.push({ id: id, qty: qty });
    saveCart();
    toast('Added to your bag');
    if (open) openCart();
  }
  function toggleWish(id) {
    var i = wish.indexOf(id);
    if (i > -1) { wish.splice(i, 1); toast('Removed from wishlist'); } else { wish.push(id); toast('Saved to wishlist'); }
    store('lum_wish', wish);
    $('.wish[data-id="' + id + '"], .wish-btn[data-id="' + id + '"]').toggleClass('is-on', i === -1);
    $('.wish-count').text(wish.length).attr('data-n', wish.length);
  }
  function totals() {
    var sub = 0, n = 0;
    cart.forEach(function (l) { var p = byId(l.id); if (p) { sub += p.price * l.qty; n += l.qty; } });
    var ship = sub === 0 || sub >= FREE_SHIP ? 0 : SHIP_FEE;
    return { sub: sub, n: n, ship: ship, total: sub + ship };
  }
  function renderCart() {
    var t = totals(), $b = $('.drawer-body').empty();
    $('.cart-count').text(t.n).attr('data-n', t.n);
    $('.drawer-head small').text(t.n + (t.n === 1 ? ' item' : ' items'));
    if (!cart.length) {
      $b.html('<div class="drawer-empty"><h3>Your bag is empty</h3><p>Add something you love and it will show up here.</p><a class="btn" href="shop.html?cat=all">Start shopping</a></div>');
      $('.drawer-foot, .ship-bar').hide();
      return;
    }
    $('.drawer-foot, .ship-bar').show();
    cart.forEach(function (l) {
      var p = byId(l.id); if (!p) return;
      $b.append(
        '<div class="line" data-id="' + p.id + '">' + media(imgOf(p), p.title) +
        '<div><small>' + p.brand + '</small><a href="product.html?id=' + p.id + '">' + p.title + '</a>' +
        '<div class="qty"><button data-act="dec" aria-label="Decrease quantity">' + icon('minus', 14) + '</button><span>' + l.qty + '</span><button data-act="inc" aria-label="Increase quantity">' + icon('plus', 14) + '</button></div></div>' +
        '<div class="line-side"><button data-act="rm" aria-label="Remove ' + p.title + '">' + icon('trash', 17) + '</button><span>' + money(p.price * l.qty) + '</span></div></div>'
      );
    });
    var left = Math.max(0, FREE_SHIP - t.sub);
    $('.ship-bar span').html(left > 0 ? 'Add <b>' + money(left) + '</b> more for free shipping' : 'You have unlocked <b>free shipping</b>');
    $('.ship-bar i b').css('width', Math.min(100, t.sub / FREE_SHIP * 100) + '%');
    $('#sumSub').text(money(t.sub));
    $('#sumShip').html(t.ship ? money(t.ship) : '<span class="free">Free</span>');
    $('#sumTotal').text(money(t.total));
    checkImages();
  }
  function openCart() { $('.drawer, .overlay').addClass('is-on'); $('body').css('overflow', 'hidden'); }
  function closeAll() { $('.drawer, .overlay').removeClass('is-on'); $('.filters').removeClass('is-on'); $('body').css('overflow', ''); }

  /* ---------- shared chrome ---------- */
  function buildChrome() {
    var page = $('body').data('page'), cat = params.get('cat') || 'all';
    var nav = [
      ['Home', 'index.html', page === 'home'],
      ['Shop', 'shop.html?cat=all', page === 'shop' && cat === 'all' && !params.get('q')],
      ['Beauty', 'shop.html?cat=beauty', page === 'shop' && /^(beauty|skincare|makeup)$/.test(cat)],
      ['Fashion', 'shop.html?cat=fashion', page === 'shop' && cat === 'fashion'],
      ['Electronics', 'shop.html?cat=electronics', page === 'shop' && cat === 'electronics'],
      ['Home & Living', 'shop.html?cat=home', page === 'shop' && cat === 'home'],
      ['Offers', 'shop.html?cat=offers', page === 'shop' && cat === 'offers']
    ].map(function (n) { return '<a href="' + n[1] + '"' + (n[2] ? ' class="is-active" aria-current="page"' : '') + '>' + n[0].replace('&', '&amp;') + '</a>'; }).join('');

    var header =
      '<div class="topbar">Free shipping on orders over $' + FREE_SHIP + ' &nbsp;|&nbsp; Easy returns within 14 days</div>' +
      '<header class="site-header"><div class="container">' +
      '<div class="header-row">' +
      '<div><button class="icon-btn burger" aria-label="Open menu" aria-expanded="false">' + icon('menu') + '</button>' +
      '<a class="logo" href="index.html" aria-label="Lumière home"><b>Lumière</b><small>Beauty · Fashion · Lifestyle</small></a></div>' +
      '<form class="search" role="search" action="shop.html"><input type="hidden" name="cat" value="all"><label class="sr-only" for="q">Search</label>' +
      '<input id="q" name="q" type="search" placeholder="Search for your favorite products..." autocomplete="off" value="' + $('<i>').text(params.get('q') || '').html() + '">' +
      '<button type="submit" aria-label="Search">' + icon('search', 18) + '</button></form>' +
      '<div class="actions">' +
      '<button class="icon-btn theme-btn" aria-label="Switch theme">' + icon('moon', 20, 'i-moon') + icon('sun', 20, 'i-sun') + '</button>' +
      '<button class="icon-btn account-btn" aria-label="Account">' + icon('user') + '</button>' +
      '<a class="icon-btn" href="shop.html?cat=wishlist" aria-label="Wishlist">' + icon('heart') + '<span class="count wish-count" data-n="' + wish.length + '">' + wish.length + '</span></a>' +
      '<button class="icon-btn cart-btn" aria-label="Open bag">' + icon('bag') + '<span class="count cart-count" data-n="0">0</span></button>' +
      '</div></div>' +
      '<nav class="main-nav" aria-label="Main">' + nav + '</nav></div></header>';

    var f = function (items) { return '<ul>' + items.map(function (i) { return '<li><a href="' + (i[1] || '#') + '">' + i[0] + '</a></li>'; }).join('') + '</ul>'; };
    var footer =
      '<footer class="site-footer"><div class="container"><div class="footer-grid">' +
      '<div class="footer-about"><a class="logo" href="index.html"><b>Lumière</b><small>Beauty · Fashion · Lifestyle</small></a>' +
      '<p>Beauty, fashion and everyday essentials, chosen with care and delivered to your door.</p>' +
      '<div class="socials"><a href="#" aria-label="Instagram">' + icon('insta', 18) + '</a><a href="#" aria-label="Facebook">' + icon('fb', 18) + '</a><a href="#" aria-label="Email">' + icon('mail', 18) + '</a></div></div>' +
      '<div><h3>Quick links</h3>' + f([['Home', 'index.html'], ['Shop', 'shop.html?cat=all'], ['About us'], ['Contact']]) + '</div>' +
      '<div><h3>Customer service</h3>' + f([['FAQs'], ['Shipping & returns'], ['Terms & conditions'], ['Privacy policy']]) + '</div>' +
      '<div><h3>My account</h3>' + f([['Login / Register'], ['Wishlist', 'shop.html?cat=wishlist'], ['Order tracking'], ['Bag']]) + '</div>' +
      '</div><div class="footer-bottom"><span>© ' + new Date().getFullYear() + ' Lumière. All rights reserved.</span>' +
      '<div class="pay" aria-label="Accepted payments"><span>Visa</span><span>Mastercard</span><span>Amex</span><span>PayPal</span></div></div></div></footer>';

    var drawer =
      '<div class="overlay"></div>' +
      '<aside class="drawer" aria-label="Shopping bag"><div class="drawer-head"><div><h2>Your bag</h2><small>0 items</small></div>' +
      '<button class="icon-btn close-drawer" aria-label="Close bag">' + icon('x') + '</button></div>' +
      '<div class="ship-bar"><span></span><i><b></b></i></div><div class="drawer-body"></div>' +
      '<div class="drawer-foot"><div class="sum"><span>Subtotal</span><span id="sumSub"></span></div>' +
      '<div class="sum"><span>Shipping</span><span id="sumShip"></span></div>' +
      '<div class="sum total"><span>Total</span><span id="sumTotal"></span></div>' +
      '<button class="btn btn-block checkout">Proceed to checkout</button>' +
      '<button class="link-btn close-drawer">Continue shopping</button></div></aside>' +
      '<div class="toasts" aria-live="polite"></div>' +
      '<button class="to-top" aria-label="Back to top">' + icon('arrow', 18) + '</button>';

    $('body').prepend(header).append(footer, drawer);
  }

  function bindChrome() {
    $(document)
      .on('click', '.theme-btn', function () { setTheme($('html').attr('data-theme') === 'dark' ? 'light' : 'dark', true); })
      .on('click', '.account-btn', function () { toast('Sign-in is not connected yet'); })
      .on('click', '.checkout', function () { toast('Checkout is not connected yet'); })
      .on('click', '.cart-btn', openCart)
      .on('click', '.overlay, .close-drawer', closeAll)
      .on('keydown', function (e) { if (e.key === 'Escape') closeAll(); })
      .on('click', '.burger', function () {
        var open = $('.main-nav').toggleClass('is-open').hasClass('is-open');
        $(this).attr('aria-expanded', open);
      })
      .on('click', '.to-top', function () { $('html, body').animate({ scrollTop: 0 }, 400); })
      .on('click', '.drawer-body [data-act]', function () {
        var id = +$(this).closest('.line').data('id'), act = $(this).data('act');
        var l = cart.filter(function (x) { return x.id === id; })[0];
        if (act === 'inc') l.qty++;
        if (act === 'dec') l.qty = Math.max(1, l.qty - 1);
        if (act === 'rm') cart = cart.filter(function (x) { return x.id !== id; });
        saveCart();
      })
      .on('click', '.wish, .wish-btn', function (e) { e.preventDefault(); toggleWish(+$(this).data('id')); })
      .on('click', '.quick-add', function (e) { e.preventDefault(); addToCart(+$(this).data('id'), 1, true); });

    $(window).on('scroll', function () {
      var y = $(this).scrollTop();
      $('.site-header').toggleClass('is-stuck', y > 8);
      $('.to-top').toggleClass('is-on', y > 700);
    }).trigger('scroll');
  }

  /* ---------- product card ---------- */
  function discount(p) { return p.old ? Math.round((1 - p.price / p.old) * 100) : 0; }
  function card(p) {
    var badge = p.badge ? '<span class="badge">' + p.badge + '</span>' : discount(p) ? '<span class="badge">-' + discount(p) + '%</span>' : p.isNew ? '<span class="badge is-new">New</span>' : '';
    var on = wish.indexOf(p.id) > -1 ? ' is-on' : '';
    return '<article class="card"><div class="card-media"><a href="product.html?id=' + p.id + '" tabindex="-1" aria-hidden="true">' + media(imgOf(p), p.brand + ' ' + p.title) + '</a>' + badge +
      '<button class="wish' + on + '" data-id="' + p.id + '" aria-label="Save to wishlist">' + icon('heart', 18) + '</button>' +
      '<button class="quick-add" data-id="' + p.id + '">' + icon('bag', 16) + 'Add to bag</button></div>' +
      '<div class="card-body"><span class="brand">' + p.brand + '</span><a class="name" href="product.html?id=' + p.id + '">' + p.title + '</a>' +
      '<span class="rate">' + stars(p.rating) + ' (' + p.reviews + ')</span>' +
      '<div class="price">' + money(p.price) + (p.old ? '<s>' + money(p.old) + '</s>' : '') + '</div></div></article>';
  }

  /* ---------- HOME ---------- */
  function initHome() {
    // hero
    var $s = $('.hero-slide'), n = $s.length, i = 0, timer;
    var $dots = $('.hero-dots');
    $s.each(function (k) { $dots.append('<button aria-label="Go to slide ' + (k + 1) + '"></button>'); });
    function go(k) {
      i = (k + n) % n;
      $s.removeClass('is-active').attr('aria-hidden', 'true').eq(i).addClass('is-active').removeAttr('aria-hidden');
      $dots.children().removeClass('is-active').removeAttr('aria-current').eq(i).addClass('is-active').attr('aria-current', 'true');
    }
    function play() {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      clearInterval(timer); timer = setInterval(function () { go(i + 1); }, 6500);
    }
    $('.hero-nav.next').on('click', function () { go(i + 1); play(); });
    $('.hero-nav.prev').on('click', function () { go(i - 1); play(); });
    $dots.on('click', 'button', function () { go($(this).index()); play(); });
    $('.hero').on('mouseenter focusin', function () { clearInterval(timer); }).on('mouseleave focusout', play);
    go(0); play();

    // best sellers
    var tabs = ['all', 'skincare', 'makeup', 'fashion', 'electronics'];
    var $rail = $('#bestRail'), $tabs = $('#bestTabs');
    tabs.forEach(function (t, k) { $tabs.append('<button class="' + (k ? '' : 'is-active') + '" data-t="' + t + '">' + (t === 'all' ? 'All' : DATA.cats[t].title) + '</button>'); });
    function renderBest(t) {
      var list = P.filter(function (p) { return p.best && (t === 'all' || p.cat === t); });
      $rail.html(list.map(card).join('')).scrollLeft(0);
      checkImages();
    }
    $tabs.on('click', 'button', function () { $(this).addClass('is-active').siblings().removeClass('is-active'); renderBest($(this).data('t')); });
    $('.carousel-ctrl button').on('click', function () {
      var dir = $(this).hasClass('next') ? 1 : -1;
      $rail.animate({ scrollLeft: $rail.scrollLeft() + dir * ($rail.width() * .8) }, 350);
    });
    renderBest('all');

    // newsletter
    $('#nlForm').on('submit', function (e) {
      e.preventDefault();
      var v = $.trim($(this).find('input').val()), $m = $('.nl-msg');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { $m.text('Enter a valid email address, for example name@mail.com.'); return; }
      $m.text('Thanks, you are subscribed.'); this.reset(); toast('Subscribed to the newsletter');
    });
  }

  /* ---------- SHOP ---------- */
  function initShop() {
    var catKey = DATA.cats[params.get('cat')] ? params.get('cat') : 'all';
    var q = $.trim(params.get('q') || '').toLowerCase();
    var PAGE = 12, st = { subs: [], brands: [], max: 0, rating: 0, sort: 'popular', page: 1 };

    function inCat(p) {
      if (q) return (p.brand + ' ' + p.title + ' ' + p.cat + ' ' + p.sub).toLowerCase().indexOf(q) > -1;
      switch (catKey) {
        case 'all': return true;
        case 'beauty': return p.cat === 'skincare' || p.cat === 'makeup';
        case 'offers': return !!p.old;
        case 'wishlist': return wish.indexOf(p.id) > -1;
        default: return p.cat === catKey;
      }
    }
    var base = P.filter(inCat);
    var maxPrice = Math.max(10, Math.ceil(Math.max.apply(null, base.map(function (p) { return p.price; }).concat([0])) / 10) * 10);
    st.max = maxPrice;

    // banner + breadcrumb
    var info = DATA.cats[catKey];
    var title = q ? 'Results for “' + $('<i>').text(q).html() + '”' : info.title;
    $('#bannerTitle').html(title);
    $('#bannerTag').text(q ? base.length + ' matching products' : info.tagline);
    $('#crumbCur').html(title);
    $('#bannerImg').attr({ src: 'images/banner-' + catKey + '.jpg', 'data-src': 'images/banner-' + catKey + '.jpg', alt: '' });
    document.title = (q ? 'Search' : info.title) + ' — Lumière';

    // filter UI
    function uniq(key) {
      var m = {}; base.forEach(function (p) { m[p[key]] = (m[p[key]] || 0) + 1; });
      return Object.keys(m).sort().map(function (k) { return [k, m[k]]; });
    }
    function checks(list, name) {
      return list.map(function (x) { return '<li><label class="check"><input type="checkbox" name="' + name + '" value="' + x[0] + '"><span>' + x[0] + '</span><em>' + x[1] + '</em></label></li>'; }).join('');
    }
    $('#fSubs').html(checks(uniq('sub'), 'subs'));
    $('#fBrands').html(checks(uniq('brand'), 'brands'));
    $('#fPrice').attr({ max: maxPrice, value: maxPrice }).val(maxPrice);
    $('#priceMax').text('$' + maxPrice);
    if (!$('#fSubs li').length) $('#fSubs').closest('.fgroup').hide();

    function filtered() {
      var list = base.filter(function (p) {
        return (!st.subs.length || st.subs.indexOf(p.sub) > -1) && (!st.brands.length || st.brands.indexOf(p.brand) > -1) && p.price <= st.max && p.rating >= st.rating;
      });
      var sorts = {
        popular: function (a, b) { return b.reviews - a.reviews; },
        low: function (a, b) { return a.price - b.price; },
        high: function (a, b) { return b.price - a.price; },
        rating: function (a, b) { return b.rating - a.rating || b.reviews - a.reviews; },
        newest: function (a, b) { return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0) || b.id - a.id; }
      };
      return list.sort(sorts[st.sort]);
    }
    function render() {
      var list = filtered(), pages = Math.max(1, Math.ceil(list.length / PAGE));
      st.page = Math.min(st.page, pages);
      var from = (st.page - 1) * PAGE, slice = list.slice(from, from + PAGE);
      $('#count').text(list.length ? 'Showing ' + (from + 1) + '–' + (from + slice.length) + ' of ' + list.length + ' products' : 'No products found');
      $('#grid').html(slice.length ? slice.map(card).join('') :
        '<div class="empty"><h3>Nothing matches these filters</h3><p>Try a wider price range or remove a brand.</p><button class="btn btn-sm" id="resetBtn">Clear filters</button></div>');
      var h = '';
      if (pages > 1) {
        h += '<button data-p="' + (st.page - 1) + '"' + (st.page === 1 ? ' disabled' : '') + ' aria-label="Previous page">' + icon('left', 16) + '</button>';
        for (var k = 1; k <= pages; k++) h += '<button data-p="' + k + '" class="' + (k === st.page ? 'is-active' : '') + '">' + k + '</button>';
        h += '<button data-p="' + (st.page + 1) + '"' + (st.page === pages ? ' disabled' : '') + ' aria-label="Next page">' + icon('right', 16) + '</button>';
      }
      $('#pager').html(h);
      $('.check').each(function () { $(this).toggleClass('is-on', $(this).find('input').prop('checked')); });
      checkImages();
    }
    function reset() {
      st.subs = []; st.brands = []; st.max = maxPrice; st.rating = 0; st.page = 1;
      $('.filters input[type=checkbox]').prop('checked', false);
      $('#fPrice').val(maxPrice); $('#priceMax').text('$' + maxPrice);
      $('input[name=rating][value=0]').prop('checked', true);
      render();
    }
    $('.filters').on('change', 'input[name=subs], input[name=brands]', function () {
      st[this.name] = $('input[name=' + this.name + ']:checked').map(function () { return this.value; }).get(); st.page = 1; render();
    });
    $('input[name=rating]').on('change', function () { st.rating = +this.value; st.page = 1; render(); });
    $('#fPrice').on('input', function () { st.max = +this.value; $('#priceMax').text('$' + this.value); st.page = 1; render(); });
    $('#sort').on('change', function () { st.sort = this.value; render(); });
    $('#clearBtn').on('click', reset);
    $(document).on('click', '#resetBtn', reset);
    $('#pager').on('click', 'button:not(:disabled)', function () {
      st.page = +$(this).data('p'); render(); $('html, body').animate({ scrollTop: $('.shop').offset().top - 150 }, 300);
    });
    $('.filter-toggle').on('click', function () { $('.filters, .overlay').addClass('is-on'); });
    $('.filters-close').on('click', closeAll);
    render();
  }

  /* ---------- PRODUCT ---------- */
  function initProduct() {
    var p = byId(params.get('id') || 1) || P[0], qty = 1;
    var cat = DATA.cats[p.cat].title;
    document.title = p.brand + ' ' + p.title + ' — Lumière';
    $('#crumbCat').attr('href', 'shop.html?cat=' + p.cat).text(cat);
    $('#crumbCur').text(p.brand + ' ' + p.title);

    var imgs = [imgOf(p), 'images/products/' + p.id + '-2.jpg', 'images/products/' + p.id + '-3.jpg'];
    $('#thumbs').html(imgs.map(function (s, k) {
      return '<button class="' + (k ? '' : 'is-active') + '" data-src="' + s + '" aria-label="Show image ' + (k + 1) + '">' + media(s, '') + '</button>';
    }).join(''));
    $('#mainImg').html('<img src="' + imgs[0] + '" alt="' + p.brand + ' ' + p.title + '" data-src="' + imgs[0] + '">');
    $('#thumbs').on('click', 'button', function () {
      var s = $(this).data('src');
      $(this).addClass('is-active').siblings().removeClass('is-active');
      $('#mainImg').removeClass('is-missing').find('img').attr({ src: s, 'data-src': s });
    });

    var skin = p.cat === 'skincare';
    $('#pBrand').text(p.brand).attr('href', 'shop.html?cat=all&q=' + encodeURIComponent(p.brand));
    $('#pTitle').text(p.title);
    $('#pRate').html(stars(p.rating) + '<span>' + p.rating.toFixed(1) + ' (' + p.reviews + ' reviews)</span>');
    $('#pPrice').html('<b>' + money(p.price) + '</b>' + (p.old ? '<s>' + money(p.old) + '</s><span class="off">' + discount(p) + '% off</span>' : ''));
    $('#pDesc').text(p.brand + ' ' + p.title + ' is a customer favourite in ' + cat.toLowerCase() + '. Designed for daily use, with a quality finish and reliable results.');
    var feats = skin ? ['Fragrance free', 'Non-comedogenic', 'Dermatologist tested'] : ['Free returns within 14 days', 'Authentic product, guaranteed', 'Ships in 1–2 business days'];
    $('#pFeats').html(feats.map(function (f) { return '<li>' + icon('check', 18) + f + '</li>'; }).join(''));
    $('#pMeta').html('<span><b>Category:</b> ' + p.sub + '</span><span><b>Brand:</b> ' + p.brand + '</span><span><b>SKU:</b> LUM-' + (1000 + p.id) + '</span>');
    $('.wish-btn').attr('data-id', p.id).toggleClass('is-on', wish.indexOf(p.id) > -1);
    $('#tabDesc').html('<p>' + p.brand + ' ' + p.title + ' fits easily into your routine. Replace this text with the full product description, usage notes and care instructions.</p><p>Every Lumière order includes free shipping over $' + FREE_SHIP + ' and returns within 14 days.</p>');
    $('#tabIng').html('<p>' + (skin ? 'Replace with the full ingredient list (INCI) for this product.' : 'Replace with materials, size and specification details for this product.') + '</p>');
    $('#tabIng').attr('data-label', skin ? 'Ingredients' : 'Details');
    $('[data-tab=tabIng]').text(skin ? 'Ingredients' : 'Details');
    $('[data-tab=tabRev]').text('Reviews (' + p.reviews + ')');
    var rv = [['Sara M.', 5, 'Exactly as described and it arrived quickly. I already reordered.'], ['Layla K.', 4, 'Good quality for the price. Packaging was careful and tidy.'], ['Noor A.', 5, 'Easy to use every day. Would recommend to friends.']];
    $('#tabRev').html(rv.map(function (r) { return '<div class="review"><b>' + r[0] + '</b><span>Verified buyer</span>' + stars(r[1]) + '<p>' + r[2] + '</p></div>'; }).join(''));

    $('.buy .qty').on('click', 'button', function () {
      qty = Math.max(1, qty + ($(this).data('act') === 'inc' ? 1 : -1)); $('.buy .qty span').text(qty);
    });
    $('#addBtn').on('click', function () { addToCart(p.id, qty, true); });
    $('.tab-list').on('click', 'button', function () {
      var t = $(this).data('tab');
      $(this).addClass('is-active').siblings().removeClass('is-active');
      $('.tab-panel').removeClass('is-active').filter('#' + t).addClass('is-active');
    });

    var rel = P.filter(function (x) { return x.cat === p.cat && x.id !== p.id; }).slice(0, 4);
    if (rel.length < 4) rel = rel.concat(P.filter(function (x) { return x.cat !== p.cat && x.best; }).slice(0, 4 - rel.length));
    $('#related').html(rel.map(card).join(''));
  }

  /* ---------- boot ---------- */
  $(function () {
    buildChrome();
    setTheme(document.documentElement.getAttribute('data-theme') || 'light');
    bindChrome();
    renderCart();
    var page = $('body').data('page');
    if (page === 'home') initHome();
    if (page === 'shop') initShop();
    if (page === 'product') initProduct();
    checkImages();
  });
})(jQuery);
