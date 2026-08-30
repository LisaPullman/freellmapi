#!/usr/bin/env python3
"""Mobile + desktop audit for the foxai personal site (site/index.html).

Checks per viewport: active <picture> source, horizontal overflow elements,
console errors; saves full-page screenshots to /tmp.
Usage: /usr/bin/python3 site_audit.py
"""
import json
from playwright.sync_api import sync_playwright

URL = 'file:///Users/foxai/Desktop/freellmapi/personal/site/index.html'

CONFIGS = [
    # label, width, height, dpr, is_mobile
    ('m320', 320, 568, 2, True),    # iPhone SE 1st gen — narrowest common
    ('m375', 375, 812, 2, True),    # iPhone 13/14
    ('m430', 430, 932, 2, True),    # large Android / iPhone Pro Max
    ('d1440', 1440, 900, 1, False), # desktop regression
]

def run():
    results = {}
    with sync_playwright() as p:
        browser = p.chromium.launch(channel='chrome', headless=True)
        for label, w, h, dpr, mobile in CONFIGS:
            ctx = browser.new_context(
                viewport={'width': w, 'height': h},
                device_scale_factor=dpr,
                is_mobile=mobile, has_touch=mobile,
            )
            page = ctx.new_page()
            console, errors = [], []
            page.on('console', lambda m: console.append(f'{m.type}: {m.text}'))
            page.on('pageerror', lambda e: errors.append(str(e)))

            page.goto(URL)
            try:
                page.wait_for_load_state('networkidle', timeout=15000)
            except Exception:
                pass

            # force reveal animations in, so layout is fully materialized
            page.evaluate("document.querySelectorAll('.reveal').forEach(e=>e.classList.add('in'))")
            page.wait_for_timeout(800)

            info = page.evaluate("""() => {
                const img = document.querySelector('.board-frame img');
                const heroImg = document.querySelector('.hero-card img');
                const de = document.documentElement;
                return {
                    boardSrc: img ? img.currentSrc.split('/').pop() : null,
                    boardNatural: img ? img.naturalWidth + 'x' + img.naturalHeight : null,
                    heroSrc: heroImg ? heroImg.naturalWidth + 'x' + heroImg.naturalHeight : null,
                    docW: de.scrollWidth, clientW: de.clientWidth,
                    fontLoaded: document.fonts.status,
                };
            }""")

            overflow = page.evaluate("""() => {
                const vw = document.documentElement.clientWidth;
                const bad = [];
                document.querySelectorAll('body *').forEach(el => {
                    const r = el.getBoundingClientRect();
                    const cs = getComputedStyle(el);
                    if (cs.position === 'fixed') return;
                    if (r.width > 1 && (r.right > vw + 1 || r.left < -1)) {
                        const cls = (typeof el.className === 'string' ? el.className : '').trim().slice(0, 50);
                        bad.push(`${el.tagName.toLowerCase()}.${cls} L${Math.round(r.left)} R${Math.round(r.right)} (vw ${vw})`);
                    }
                });
                return bad.slice(0, 15);
            }""")

            page.screenshot(path=f'/tmp/site-{label}.png', full_page=True)
            results[label] = {
                'info': info, 'h_overflow': overflow,
                'console': console[:10], 'pageerrors': errors,
            }
            ctx.close()
        browser.close()
    print(json.dumps(results, ensure_ascii=False, indent=1))

run()
