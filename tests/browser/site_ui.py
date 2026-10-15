"""Browser regressions; run against an already running local website.

ACCT_WEB_BASE_URL defaults to http://localhost:3000. Set
PLAYWRIGHT_CHROMIUM_EXECUTABLE when using an existing Chromium installation.
Requires Python Playwright; it does not install browsers or packages.
"""
import os
import re
import unittest
from playwright.sync_api import sync_playwright, expect

BASE = os.environ.get('ACCT_WEB_BASE_URL', 'http://localhost:3000').rstrip('/')

class SiteUI(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.playwright = sync_playwright().start()
        executable = os.environ.get('PLAYWRIGHT_CHROMIUM_EXECUTABLE')
        cls.browser = cls.playwright.chromium.launch(headless=True, **({'executable_path': executable} if executable else {}))

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.playwright.stop()

    def setUp(self):
        self.context = self.browser.new_context(viewport={'width': 1440, 'height': 1000}, permissions=['clipboard-read', 'clipboard-write'])
        self.page = self.context.new_page()
        self.errors = []
        self.page.on('pageerror', lambda error: self.errors.append(str(error)))
        self.page.set_default_timeout(5000)
        self.page.set_default_navigation_timeout(30000)

    def tearDown(self):
        errors = list(self.errors)
        self.context.close()
        self.assertEqual(errors, [], 'Uncaught browser errors')

    def home(self):
        self.page.goto(BASE, wait_until='networkidle')

    def scroll(self, target):
        self.page.evaluate('target => window.__acctLenis ? window.__acctLenis.scrollTo(target, {immediate:true}) : window.scrollTo(0,target)', target)
        self.page.wait_for_timeout(450)

    def test_previous_releases_are_hidden_until_requested(self):
        self.page.goto(BASE + '/releases', wait_until='networkidle')
        latest = self.page.locator('.release-entry').first
        expect(latest.locator('.disclosure-trigger').first).to_have_attribute('aria-expanded', 'true')
        group = self.page.locator('.previous-releases')
        expect(group).to_have_count(1)
        expect(group.locator('.release-entry').first).not_to_be_visible()
        group.locator('.disclosure-trigger').first.click()
        expect(group.locator('.release-entry').first).to_be_visible()
        older = group.locator('.release-entry').first
        older.locator('.disclosure-trigger').first.click()
        expect(older.locator('.release-body')).to_be_visible()
        group.locator('.disclosure-trigger').first.click()
        expect(older).not_to_be_visible()

    def test_keyboard_menu_cycles_and_escape_restores_focus(self):
        self.page.set_viewport_size({'width': 390, 'height': 844})
        self.page.goto(BASE + '/docs', wait_until='networkidle')
        trigger = self.page.get_by_role('button', name='Menu', exact=True)
        trigger.focus()
        self.page.keyboard.press('ArrowDown')
        expect(self.page.get_by_role('menu')).to_be_visible()
        items = self.page.get_by_role('menuitem')
        expect(items.first).to_be_focused()
        self.page.keyboard.press('ArrowDown')
        expect(items.nth(1)).to_be_focused()
        self.page.keyboard.press('End')
        expect(items.last).to_be_focused()
        self.page.keyboard.press('ArrowDown')
        expect(items.first).to_be_focused()
        self.page.keyboard.press('Escape')
        expect(trigger).to_be_focused()
        expect(trigger).to_have_attribute('aria-expanded', 'false')
        self.page.keyboard.press('ArrowUp')
        expect(self.page.get_by_role('menuitem').last).to_be_focused()

    def test_shift_tab_closes_the_menu_without_trapping_focus(self):
        self.page.set_viewport_size({'width': 390, 'height': 844})
        self.page.goto(BASE + '/docs', wait_until='networkidle')
        self.page.get_by_role('button', name='Menu', exact=True).focus()
        self.page.keyboard.press('ArrowDown')
        expect(self.page.get_by_role('menuitem').first).to_be_focused()
        self.page.keyboard.press('Shift+Tab')
        expect(self.page.get_by_role('button', name='Menu', exact=True)).to_have_attribute('aria-expanded', 'false')
        expect(self.page.locator('.pill-context a')).to_be_focused()

    def test_open_menu_survives_section_changes_and_dismisses_outside(self):
        self.home()
        self.scroll(self.page.locator('#planes').evaluate('el => el.offsetTop'))
        self.page.get_by_role('button', name='Menu', exact=True).click()
        labels = self.page.get_by_role('menuitem').all_text_contents()
        self.scroll(self.page.locator('#faq').evaluate('el => el.offsetTop'))
        expect(self.page.get_by_role('menu')).to_be_visible()
        self.assertEqual(labels, self.page.get_by_role('menuitem').all_text_contents())
        self.page.locator('#faq h2').click()
        expect(self.page.get_by_role('menu')).not_to_be_visible()

    def test_pill_compresses_without_flickering_at_the_boundary(self):
        self.home()
        pill = self.page.locator('.pill-shell')
        wide = pill.bounding_box()['width']
        threshold = self.page.locator('#hero').evaluate('el => el.getBoundingClientRect().bottom + scrollY - Math.min(innerHeight * .4,320)')
        self.scroll(threshold + 50)
        compact = pill.bounding_box()['width']
        self.assertLess(compact, wide)
        for position in [threshold - 8, threshold + 8, threshold - 8]:
            self.scroll(position)
            self.assertLess(pill.bounding_box()['width'], wide)
        self.scroll(threshold - 50)
        self.assertAlmostEqual(pill.bounding_box()['width'], wide, delta=2)
        print('PILL_WIDTHS', wide, compact)

    def test_git_tool_tabs_change_the_example_with_arrow_keys(self):
        self.home()
        tab = self.page.get_by_role('tab', name='Git identity', exact=True)
        tab.focus()
        self.page.keyboard.press('ArrowDown')
        expect(self.page.get_by_role('tab', name='HTTPS and SSH')).to_be_focused()
        expect(self.page.get_by_role('tabpanel', name='HTTPS and SSH')).to_contain_text('git push origin main')
        self.page.keyboard.press('End')
        expect(self.page.get_by_role('tabpanel', name='GitHub CLI')).to_contain_text('acct exec gh pr list')

    def test_setup_steps_copy_selected_shell_commands(self):
        self.home()
        self.page.get_by_role('tab', name='Connect your shell').click()
        self.page.get_by_role('button', name='fish', exact=True).click()
        expect(self.page.get_by_role('tabpanel', name='Connect your shell')).to_contain_text('acct hook fish | source')
        self.page.get_by_role('button', name='Copy setup commands').click()
        self.assertEqual(self.page.evaluate('navigator.clipboard.readText()'), 'acct hook fish | source\nacct status')
        self.page.get_by_role('tab', name='Install the CLI').click()
        self.page.get_by_role('button', name='Copy setup commands').click()
        self.assertEqual(self.page.evaluate('navigator.clipboard.readText()'), 'npm install -g acct-sh')

    def test_folder_preview_install_copy_and_live_package_data(self):
        self.home()
        expect(self.page.get_by_role('region', name='Works with all of your coding agents')).to_be_visible()
        expect(self.page.locator('#hero').get_by_role('link', name=re.compile(r'^[\d,]+\+ downloads$'))).to_be_visible(timeout=20000)
        print('LIVE_DOWNLOADS', self.page.locator('.hero-downloads').inner_text())
        self.page.get_by_role('button', name='Select Personal folder').click()
        expect(self.page.locator('.profile-name')).to_have_text('personal')
        expect(self.page.locator('.preview-terminal')).to_contain_text('~/Personal/blog')
        self.page.get_by_role('button', name='Select Downloads folder').click()
        expect(self.page.locator('.identity-status')).to_have_text('No profile inherited')
        self.page.get_by_role('button', name='Copy npm install command').click()
        self.assertEqual(self.page.evaluate('navigator.clipboard.readText()'), 'npm install -g acct-sh')
        for slogan in ['FOR YOUR WORK.', 'ONE PROFILE.', 'One less thing to remember', 'Open source. Yours to inspect.']:
            self.assertNotIn(slogan, self.page.locator('body').inner_text())

    def test_release_bullets_keep_continuations_and_items_beyond_six(self):
        self.page.goto(BASE + '/releases', wait_until='networkidle')
        latest = self.page.locator('.release-entry').first
        changed = latest.locator('.release-section').filter(has=self.page.get_by_role('heading', name='Changed', exact=True))
        self.assertGreater(changed.locator('li').count(), 6)
        expect(changed.locator('li').filter(has_text='Hooks install globally')).to_contain_text('their own local core.hooksPath')

    def test_layout_does_not_overflow_on_desktop_tablet_or_mobile(self):
        self.home()
        for width, height in [(1440,1000),(1024,768),(820,1180),(768,1024),(390,844),(320,740)]:
            self.page.set_viewport_size({'width':width,'height':height})
            self.page.wait_for_timeout(200)
            self.assertTrue(self.page.evaluate('document.documentElement.scrollWidth <= innerWidth'), f'Overflow at {width}')
            expect(self.page.locator('.pill-install')).to_be_visible()
            self.page.get_by_role('tab', name='Connect your shell').click()
            self.page.get_by_role('button', name='PowerShell', exact=True).click()
            self.assertTrue(self.page.evaluate('document.documentElement.scrollWidth <= innerWidth'), f'PowerShell overflow at {width}')
            print('RESPONSIVE', width)

    def test_reduced_motion_uses_static_hero_and_working_navigation(self):
        self.page.emulate_media(reduced_motion='reduce')
        self.home()
        self.assertEqual(self.page.locator('#hero canvas').count(), 0)
        position = self.page.locator('.pill-install').evaluate('link => { link.click(); return document.getElementById("install").getBoundingClientRect().top; }')
        self.assertAlmostEqual(position, 96, delta=3)
        expect(self.page.locator('.pill-context')).to_contain_text('Setup')

    def test_downloads_are_under_the_title_on_desktop_and_mobile(self):
        self.home()
        for width in [1440, 390, 320]:
            self.page.set_viewport_size({'width':width,'height':1000})
            downloads = self.page.locator('#hero').get_by_role('link', name=re.compile(r'^[\d,]+\+ downloads$'))
            expect(downloads).to_be_visible()
            title = self.page.locator('#hero h1').bounding_box()
            subtitle = self.page.locator('#hero h2').bounding_box()
            count = downloads.bounding_box()
            self.assertGreaterEqual(count['y'], title['y'] + title['height'])
            self.assertLessEqual(count['y'] + count['height'], subtitle['y'])
            self.assertAlmostEqual(count['x'], title['x'], delta=1)
        expect(self.page.get_by_role('region', name='Package information')).to_have_count(0)
        expect(self.page.locator('.release-entry')).to_have_count(0)

    def test_releases_and_privacy_share_the_docs_layout_and_section_navigation(self):
        self.page.goto(BASE + '/docs', wait_until='networkidle')
        docs_x = self.page.locator('h1').bounding_box()['x']
        self.page.goto(BASE + '/releases', wait_until='networkidle')
        expect(self.page.get_by_role('heading', name='Release notes', exact=True)).to_be_visible()
        self.assertAlmostEqual(self.page.locator('h1').bounding_box()['x'], docs_x, delta=2)
        toc = self.page.get_by_role('navigation', name='On this page')
        toc.get_by_role('link', name='Previous Releases', exact=True).click()
        expect(self.page.locator('.previous-releases .release-entry').first).to_be_visible()
        expect(self.page).to_have_url(re.compile('#previous-releases$'))
        self.page.goto(BASE + '/privacy', wait_until='networkidle')
        self.assertAlmostEqual(self.page.locator('h1').bounding_box()['x'], docs_x, delta=2)
        self.page.get_by_role('navigation', name='On this page').get_by_role('link', name='Information we collect', exact=True).click()
        self.page.wait_for_function('() => Math.abs(document.getElementById("information-we-collect").getBoundingClientRect().top - 100) < 3')
        expect(self.page).to_have_url(re.compile('#information-we-collect$'))
        expect(self.page.locator('#information-we-collect')).to_be_focused()
        for route in ['/docs', '/releases', '/privacy']:
            for width in [390, 320]:
                self.page.set_viewport_size({'width': width, 'height': 844})
                self.page.goto(BASE + route, wait_until='load')
                expect(self.page.locator('h1')).to_be_visible()
                self.page.evaluate('() => document.fonts.ready.then(() => true)')
                self.assertTrue(self.page.evaluate('document.documentElement.scrollWidth <= innerWidth'), f'Overflow on {route} at {width}')

    def test_navigation_links_to_the_dedicated_release_page(self):
        self.home()
        self.page.get_by_role('navigation', name='Primary').get_by_role('link', name='Releases', exact=True).click()
        expect(self.page).to_have_url(BASE + '/releases')
        expect(self.page.get_by_role('heading', name='Release notes', exact=True)).to_be_visible()
        expect(self.page.locator('.pill-context')).to_contain_text('Releases')

    def test_faq_closes_with_an_intermediate_height_and_keyboard_toggle(self):
        self.home()
        item = self.page.locator('#faq .faq-item').first
        trigger = item.get_by_role('button')
        trigger.click()
        expect(item.get_by_role('region')).to_be_visible()
        self.page.wait_for_timeout(350)
        full = item.bounding_box()['height']
        closed = trigger.bounding_box()['height']
        trigger.focus()
        self.page.keyboard.press('Space')
        self.page.wait_for_function('({full,closed}) => { const h = document.querySelector("#faq .faq-item").getBoundingClientRect().height; return h > closed + 1 && h < full - 1; }', arg={'full':full,'closed':closed}, timeout=1000)
        expect(trigger).to_have_attribute('aria-expanded', 'false')
        expect(item.locator('.disclosure-content')).not_to_be_visible()

    def test_previous_releases_close_with_motion_and_respect_reduced_motion(self):
        self.page.goto(BASE + '/releases', wait_until='networkidle')
        group = self.page.locator('.previous-releases')
        trigger = group.locator('.disclosure-trigger').first
        trigger.click()
        self.page.wait_for_timeout(350)
        full = group.bounding_box()['height']
        closed = trigger.bounding_box()['height']
        trigger.click()
        self.page.wait_for_function('({full,closed}) => { const h = document.querySelector(".previous-releases").getBoundingClientRect().height; return h > closed + 1 && h < full - 1; }', arg={'full':full,'closed':closed}, timeout=1000)
        expect(group.locator('.disclosure-content').first).not_to_be_visible()
        self.page.emulate_media(reduced_motion='reduce')
        trigger.click()
        expect(group.locator('.release-entry').first).to_be_visible()
        trigger.click()
        expect(group.locator('.disclosure-content').first).not_to_be_visible()

    def test_agent_logos_keep_original_colors_and_hover_feedback(self):
        self.home()
        marks = self.page.locator('.agent-mark')
        self.assertGreater(marks.count(), 0)
        filters = marks.evaluate_all('items => items.map(item => getComputedStyle(item).filter)')
        self.assertTrue(all('grayscale' not in value for value in filters), filters)
        colored = self.page.locator('.agent-mark').filter(has=self.page.locator('img[src="/brands/deepseek.svg"]')).first
        before = colored.evaluate('el => Number(getComputedStyle(el).opacity)')
        colored.hover(force=True)
        self.page.wait_for_timeout(250)
        self.assertGreater(colored.evaluate('el => Number(getComputedStyle(el).opacity)'), before)
        self.assertTrue(all('grayscale' not in value for value in self.page.locator('.agent-mark img').evaluate_all('items=>items.map(item=>getComputedStyle(item).filter)')))

    def test_docs_search_markdown_and_privacy(self):
        self.page.goto(BASE + '/docs', wait_until='networkidle')
        search = self.page.get_by_role('searchbox', name='Search commands')
        search.fill('rebind')
        expect(self.page.get_by_role('heading', name='acct rebind', exact=True)).to_be_visible()
        search.fill('not-a-command-zz')
        expect(self.page.get_by_role('status')).to_contain_text('No commands match')
        search.fill('--repo')
        expect(self.page.locator('.command-card')).to_have_count(1)
        expect(self.page.locator('.command-card')).to_contain_text('global v3 chaining hooks')
        response = self.page.request.get(BASE + '/docs.md')
        self.assertEqual(response.status, 200)
        self.assertIn('acct rebind <old> <new>', response.text())
        self.assertIn('acct install [--repo]', response.text())
        self.page.goto(BASE + '/privacy', wait_until='networkidle')
        heading = self.page.get_by_role('heading', name='Privacy policy', exact=True)
        expect(heading).to_be_visible()
        self.assertGreater(heading.bounding_box()['y'], self.page.get_by_role('banner').bounding_box()['height'])

if __name__ == '__main__':
    unittest.main(verbosity=2)
