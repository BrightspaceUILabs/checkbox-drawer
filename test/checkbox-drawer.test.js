import '../checkbox-drawer.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

const uncheckedFixture = html`<d2l-labs-checkbox-drawer label="Label"></d2l-labs-checkbox-drawer>`;
const checkedFixture = html`<d2l-labs-checkbox-drawer label="Label" checked></d2l-labs-checkbox-drawer>`;
const ariaFixture = html`<d2l-labs-checkbox-drawer aria-label="ARIA Label"></d2l-labs-checkbox-drawer>`;

function getInputCheckbox(elem) {
	return elem.shadowRoot.querySelector('d2l-input-checkbox');
}

function getExpandCollapseContent(elem) {
	return elem.shadowRoot.querySelector('d2l-expand-collapse-content');
}

describe('CheckboxDrawer', () => {

	describe('accessibility', () => {
		it('should pass all aXe tests', async() => {
			const el = await fixture(uncheckedFixture);
			await expect(el).to.be.accessible();
		});
	});

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-labs-checkbox-drawer');
		});
	});

	describe('default property values for checkbox drawer with label', () => {

		let elem;
		beforeEach(async() => {
			elem = await fixture(uncheckedFixture);
		});

		['ariaLabel', 'description'].forEach((name) => {
			it(`should not have "${name}" property`, () => {
				expect(elem.hasAttribute(elem[name])).to.be.false;
			});
		});

		it('should default "checked" property to "false"', () => {
			expect(elem.checked).to.be.false;
		});
	});

	describe('default property values for checkbox drawer initially checked', () => {

		let elem;
		beforeEach(async() => {
			elem = await fixture(checkedFixture);
		});

		['ariaLabel', 'description'].forEach((name) => {
			it(`should not have "${name}" property`, () => {
				expect(elem.hasAttribute(elem[name])).to.be.false;
			});
		});

		it('should default "checked" property to "true"', () => {
			expect(elem.checked).to.be.true;
		});
	});

	describe('default property values for checkbox drawer with aria-label', () => {

		let elem;
		beforeEach(async() => {
			elem = await fixture(ariaFixture);
		});

		it('should default "checked" property to "false"', () => {
			expect(elem.checked).to.be.false;
		});

		['description', 'label'].forEach((name) => {
			it(`should not have "${name}" property`, () => {
				expect(elem.hasAttribute(elem[name])).to.be.false;
			});
		});
	});

	describe('events', () => {

		it('should fire "d2l-checkbox-drawer-checked-change" event when unchecked input element is clicked', async() => {
			const elem = await fixture(uncheckedFixture);
			setTimeout(() => getInputCheckbox(elem).simulateClick());
			const { target } = await oneEvent(elem, 'd2l-checkbox-drawer-checked-change');
			expect(target).to.equal(elem);
		});

		it('should reflect that a previously unchecked input is now checked', async() => {
			const elem = await fixture(uncheckedFixture);
			setTimeout(() => getInputCheckbox(elem).simulateClick());
			const { target } = await oneEvent(elem, 'd2l-checkbox-drawer-checked-change');
			expect(target.checked).to.equal(true);
		});

		it('should fire "d2l-checkbox-drawer-expand" event when unchecked input element is clicked', async() => {
			const elem = await fixture(uncheckedFixture);
			setTimeout(() => getInputCheckbox(elem).simulateClick());
			const e = await new Promise(resolve => {
				elem.addEventListener('d2l-checkbox-drawer-expand', (e) => resolve(e), { once: true });
			});
			await e.detail.expandComplete;
		});

		it('should fire "d2l-checkbox-drawer-checked-change" event when checked input element is clicked', async() => {
			const elem = await fixture(checkedFixture);
			setTimeout(() => getInputCheckbox(elem).simulateClick());
			const { target } = await oneEvent(elem, 'd2l-checkbox-drawer-checked-change');
			expect(target).to.equal(elem);
		});

		it('should reflect that a previously checked input is now unchecked', async() => {
			const elem = await fixture(checkedFixture);
			setTimeout(() => getInputCheckbox(elem).simulateClick());
			const { target } = await oneEvent(elem, 'd2l-checkbox-drawer-checked-change');
			expect(target.checked).to.equal(false);
		});

		it('should fire "d2l-checkbox-drawer-collapse" event when checked input element is clicked', async() => {
			const elem = await fixture(checkedFixture);
			setTimeout(() => getInputCheckbox(elem).simulateClick());
			const e = await new Promise(resolve => {
				elem.addEventListener('d2l-checkbox-drawer-collapse', (e) => resolve(e), { once: true });
			});
			await e.detail.collapseComplete;
		});

		describe('property binding', () => {

			let elem;
			beforeEach(async() => {
				elem = await fixture(uncheckedFixture);
			});

			it('should bind "checked" attribute to input-checkbox "checked"', async() => {
				elem.setAttribute('checked', 'checked');
				await elem.updateComplete;
				expect(getInputCheckbox(elem).checked).to.be.true;
			});

			it('should bind "checked" property to input-checkbox "checked"', async() => {
				elem.checked = true;
				await elem.updateComplete;
				expect(getInputCheckbox(elem).checked).to.be.true;
			});

			it('should continue to bind "checked" to input-checkbox "checked" after interaction', async() => {
				const checkbox = getInputCheckbox(elem);
				checkbox.simulateClick();
				await elem.updateComplete;
				expect(checkbox.checked).to.be.true;
				expect(elem.checked).to.be.true;
				elem.checked = false;
				await elem.updateComplete;
				expect(checkbox.checked).to.be.false;
			});

			it('should bind "checked" attribute to expand-collapse "expanded"', async() => {
				elem.setAttribute('checked', 'checked');
				await elem.updateComplete;
				expect(getExpandCollapseContent(elem).expanded).to.be.true;
			});

			it('should bind "checked" property to expand-collapse "expanded"', async() => {
				elem.checked = true;
				await elem.updateComplete;
				expect(getExpandCollapseContent(elem).expanded).to.be.true;
			});

			it('should continue to bind "checked" to expand-collapse "expanded" after interaction', async() => {
				const checkbox = getInputCheckbox(elem);
				const expandCollapse = getExpandCollapseContent(elem);
				checkbox.simulateClick();
				await elem.updateComplete;
				expect(expandCollapse.expanded).to.be.true;
				expect(elem.checked).to.be.true;
				elem.checked = false;
				await elem.updateComplete;
				expect(expandCollapse.expanded).to.be.false;
			});
		});
	});
});
