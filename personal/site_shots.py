#!/usr/bin/env python3
"""Section-by-section mobile screenshots + board image load diagnosis."""
import json
from playwright.sync_api import sync_playwright

URL = 'file:///Users/foxai/Desktop/freellmapi/personal/site/index.html'

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(channel='chrome', headless=True)
        ctx = browser.new_context(viewport={'width': 375, 'height': 812},
                                  device_scale_factor=2, is_mobile=True, has_touch=True)
        page = ctx.new_page()
        req_failed = []
        page.on('requestfailed', lambda r: req_failed.append(f'{r.url.split("/")[-1]} :: {r.failure}'))
        page.goto(URL)
        try:
            page.wait_for_load_state('networkidle', timeout=15000)
        except Exception:
            pass
        page.evaluate("document.querySelectorAll('.reveal').forEach(e=>e.classList.add('in'))")

        sections = ['#top', '#services', '#process', '#board', '#contact']
        for i, sel in enumerate(sections):
            page.eval_on_selector(sel, 'el => el.scrollIntoView()')
            page.wait_for_timeout(1200)
            page.screenshot(path=f'/tmp/m375-{i}-{sel[1:]}.png')

        # board image diagnosis after scroll
        diag = page.evaluate("""async () => {
            const img = document.querySelector('.board-frame img');
            const t0 = Date.now();
            while (!img.complete && Date.now() - t0 < 8000) {
                await new Promise(r => setTimeout(r, 200));
            }
            const src = document.querySelector('.board-frame source');
            return {
                currentSrc: img.currentSrc,
                complete: img.complete, natural: img.naturalWidth + 'x' + img.naturalHeight,
                sourceMatches: src ? window.matchMedia(src.media).matches : null,
                sourceSrcset: src ? src.srcset : null,
            };
        }""")
        # nav geometry at 320px
        ctx2 = browser.new_context(viewport={'width': 320, 'height': 568},
                                   device_scale_factor=2, is_mobile=True, has_touch=True)
        p2 = ctx2.new_page()
        p2.goto(URL)
        try:
            p2.wait_for_load_state('networkidle', timeout=15000)
        except Exception:
            pass
        nav = p2.evaluate("""() => {
            const g = s => { const el = document.querySelector(s); if (!el) return null;
                const r = el.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.right)]; };
            return { lockup: g('.nav-in .lockup'), cta: g('.nav-cta'), linksShown: getComputedStyle(document.querySelector('.nav-links')).display };
        }""")
        p2.screenshot(path='/tmp/m320-nav.png')
        print(json.dumps({'diag': diag, 'nav320': nav, 'req_failed': req_failed}, ensure_ascii=False, indent=1))
        browser.close()

run()
