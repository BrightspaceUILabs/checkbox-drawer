import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/expand-collapse/expand-collapse-content.js';
import '@brightspace-ui/core/components/inputs/input-checkbox.js';
import '@brightspace-ui/core/components/inputs/input-checkbox-spacer.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';

class CheckboxDrawer extends LitElement {

	static get properties() {
		return {
			ariaLabel: { type: String, attribute: 'aria-label' },
			checked: { type: Boolean },
			description: { type: String },
			label: { type: String }
		};
	}

	static get styles() {
		return css`
			:host {
				display: block;
			}

			:host([hidden]) {
				display: none;
			}

			.d2l-input-checkbox, .d2l-input-checkbox-spacer {
				margin-bottom: 0;
			}

			.d2l-input-checkbox-description {
				color: var(--d2l-color-tungsten);
				font-size: 0.7rem;
			}

			.d2l-checkbox-content-margin {
				margin-top: 18px;
			}
		`;
	}

	constructor() {
		super();
		this.checked = false;
	}

	render() {
		return html`
			<d2l-input-checkbox aria-label="${ifDefined(this.ariaLabel)}" @change="${this._onCheckboxChange}" .checked="${this.checked}" class="d2l-input-checkbox"> ${this.label} </d2l-input-checkbox>
			<d2l-input-checkbox-spacer class="d2l-input-checkbox-spacer">
				<div class="d2l-input-checkbox-description"> ${this.description} </div>
			</d2l-input-checkbox-spacer>
			<d2l-input-checkbox-spacer class="d2l-input-checkbox-spacer">
				<d2l-expand-collapse-content aria-live="polite" @d2l-expand-collapse-content-expand="${this._onExpandCollapseContentExpand}" @d2l-expand-collapse-content-collapse="${this._onExpandCollapseContentCollapse}" .expanded="${this.checked}">
					<div class="d2l-checkbox-content-margin"></div>
					<slot></slot>
				</d2l-expand-collapse-content>
			</d2l-input-checkbox-spacer>
		`;
	}

	_onCheckboxChange(e) {
		this.checked = e.target.checked;
		this.dispatchEvent(new CustomEvent(
			'd2l-checkbox-drawer-checked-change',
			{ bubbles: true, composed: false, detail: { checked: this.checked } }
		));
	}

	async _onExpandCollapseContentCollapse(e) {
		this.dispatchEvent(new CustomEvent(
			'd2l-checkbox-drawer-collapse',
			{ bubbles: true, composed: false, detail: e.detail }
		));

		const content = this.shadowRoot.querySelector('d2l-expand-collapse-content');
		content.ariaBusy = 'true';
		await e.detail.collapseComplete;
		content.ariaBusy = 'false';
	}

	async _onExpandCollapseContentExpand(e) {
		this.dispatchEvent(new CustomEvent(
			'd2l-checkbox-drawer-expand',
			{ bubbles: true, composed: false, detail: e.detail }
		));

		const content = this.shadowRoot.querySelector('d2l-expand-collapse-content');
		content.ariaBusy = 'true';
		await e.detail.expandComplete;
		content.ariaBusy = 'false';
	}
}
customElements.define('d2l-labs-checkbox-drawer', CheckboxDrawer);
