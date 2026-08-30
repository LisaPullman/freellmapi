#!/usr/bin/env python3
"""Geometry probe: how key blocks actually lay out at 320/375."""
import json
from playwright.sync_api import sync_playwright

URL = 'file:///Users/foxai/Desktop/freellmapi/personal/site/index.html'

PROBE = """() => {
  const box = s => { const el = document.querySelector(s); if (!el) return null;
    const r = el.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)]; };
  const btns = [...document.querySelectorAll('.hero .btn')].map(b => {
    const r = b.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.width), Math.round(r.height)];
  });
  // how many lines does svc-index occupy?
  const idx = [...document.querySelectorAll('.svc-index a')].map(a => Math.round(a.getBoundingClientRect().top));
  const card = box('.hero-card');
  const cardImg = document.querySelector('.hero-card img');
  return {
    heroBtns: btns,
    svcIndexTops: idx,
    heroCard: card, heroCardW: cardImg ? Math.round(cardImg.getBoundingClientRect().width) : null,
    svcPadding: getComputedStyle(document.querySelector('.svc')).padding,
    sectionPad: getComputedStyle(document.querySelector('#services')).padding,
    contactPad: getComputedStyle(document.querySelector('#contact')).padding,
    heroPad: getComputedStyle(document.querySelector('.hero')).padding,
    boardImg: box('.board-frame img'),
    bigMail: box('.big-mail'),
  };
}"""

with sync_playwright() as p:
    browser = p.chromium.launch(channel='chrome', headless=True)
    out = {}
    for w in (320, 375, 430):
        ctx = browser.new_context(viewport={'width': w, 'height': 812},
                                  device_scale_factor=2, is_mobile=True, has_touch=True)
        pg = ctx.new_page()
        pg.goto(URL)
        try:
            pg.wait_for_load_state('networkidle', timeout=12000)
        except Exception:
            pass
        out[w] = pg.evaluate(PROBE)
        ctx.close()
    browser.close()
print(json.dumps(out, ensure_ascii=False, indent=1))
