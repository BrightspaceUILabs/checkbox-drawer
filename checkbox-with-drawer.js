import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/inputs/input-checkbox.js';
import '@brightspace-ui/core/components/inputs/input-checkbox-spacer.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { styleMap } from 'lit-html/directives/style-map.js';

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const states = {
	PRECOLLAPSING: 'precollapsing', // setting up the styles so the collapse transition will run
	COLLAPSING: 'collapsing', // in the process of collapsing
	COLLAPSED: 'collapsed', // fully collapsed
	PREEXPANDING: 'preexpanding', // setting up the styles so the expand transition will run
	EXPANDING: 'expanding', // in the process of expanding
	EXPANDED: 'expanded', // fully expanded
};

const opacities = {
	HIDDEN: '0',
	VISIBLE: '1'
}

const transforms = {
	OUT_OF_VIEW: 'translateY(-0.9rem)',
	ORIGIN: 'translateY(0%)'
}

const heights = {
	NONE: '0'
}

class CheckboxWithDrawer extends LitElement {

	static get properties() {
		return {
			checked: { type: Boolean},
			description: { type: String},
			label: { type: String},
			_opacity: { type: String },
			_transform: { type: String },
			_height: { type: String },
			_state: { type: String }
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

			.d2l-checkbox-with-drawer-container {
				margin-bottom: 18px;
			}

			.d2l-input-checkbox, .d2l-input-checkbox-spacer {
				margin-bottom: 0;
			}

			.d2l-input-checkbox-description {
				color: var(--d2l-color-tungsten);
				font-size: 0.7rem;
			}

			.checkbox-content-margin {
				margin-top: 18px
			}

			.d2l-expand-collapse-content {
				display: none;
				overflow: hidden;
				transition: all 400ms cubic-bezier(0, 0.7, 0.5, 1);
			}

			.d2l-expand-collapse-content:not([data-state="collapsed"]) {
				display: block;
			}

			.d2l-expand-collapse-content[data-state="expanded"] {
				overflow: visible;
			}

			/* prevent margin collapse on slotted children */
			.d2l-expand-collapse-content-inner::before,
			.d2l-expand-collapse-content-inner::after {
				content: ' ';
				display: table;
			}
		`;
	}

	constructor() {
		super();
		this.checked = false;
		this._opacity = opacities.HIDDEN;
		this._transform = transforms.OUT_OF_VIEW;
		this._height = heights.NONE;
		this._isFirstUpdate = true;
		this._state = states.COLLAPSED;
	}

	firstUpdated() {
		const checkbox = this.shadowRoot.querySelector('.d2l-input-checkbox');
		// pass initial checked value down to the checkbox
		checkbox.checked = this.checked;
		checkbox.addEventListener('change', (e) => {
			this.checked = checkbox.checked;
			this.dispatchEvent(new CustomEvent(
				'd2l-checkbox-with-drawer-change-checked',
				{ bubbles: true, composed: false }
			))
		});
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		if (changedProperties.has('checked')) {
			this._drawerChanged(this.checked, this.isFirstUpdate);
			this._isFirstUpdate = false;
		}
	}

	async _drawerChanged(checked, isFirstUpdate) {
		if (checked) {
			if (!isFirstUpdate) {
				this.dispatchEvent(new CustomEvent(
					'd2l-checkbox-with-drawer-expand',
					{ bubbles: true, composed: false }
				));
			}
			if (reduceMotion || isFirstUpdate) {
				this._state = states.EXPANDED;
				this._opacity = opacities.VISIBLE;
				this._transform = transforms.ORIGIN;
				this._height = 'auto';
			} else {
				this._state = states.PREEXPANDING;
				await this.updateComplete;
				if (this._state === states.PREEXPANDING) {
					const content = this.shadowRoot.querySelector('.d2l-expand-collapse-content-inner');
					this._state = states.EXPANDING;
					this._opacity = opacities.VISIBLE;
					this._transform = transforms.ORIGIN;
					this._height = `${content.scrollHeight}px`;
				}
			}
		} else {
			if (!isFirstUpdate) {
				this.dispatchEvent(new CustomEvent(
					'd2l-checkbox-with-drawer-collapse',
					{ bubbles: true, composed: false }
				));
			}
			if (reduceMotion || isFirstUpdate) {
				this._state = states.COLLAPSED;
				this._opacity = opacities.HIDDEN;
				this._transform = transforms.OUT_OF_VIEW;
				this._height = heights.NONE;
			} else {
				this._state = states.PRECOLLAPSING;
				await this.updateComplete;
				if (this._state === states.PRECOLLAPSING) {
					this._state = states.COLLAPSING;
					this._opacity = opacities.HIDDEN;
					this._transform = transforms.OUT_OF_VIEW;
					this._height = heights.NONE;
				}
			}
		}
	}

	render() {
		const styles = {
			opacity: this._opacity,
			transform: this._transform,
			height: this._height
		};
		return html`
			<div class="d2l-checkbox-with-drawer-container">
				<d2l-input-checkbox class="d2l-input-checkbox">${this.label}</d2l-input-checkbox>
				<d2l-input-checkbox-spacer class="d2l-input-checkbox-spacer">
					<div class="d2l-input-checkbox-description">${this.description}</div>
				</d2l-input-checkbox-spacer>
				<d2l-input-checkbox-spacer class="d2l-input-checkbox-spacer">
					<div class="d2l-expand-collapse-content" data-state="${this._state}" @transitionend=${this._onTransitionEnd} style=${styleMap(styles)}>
						<div class="d2l-expand-collapse-content-inner">
							<div class="checkbox-content-margin"></div>
							<slot></slot>
						</div>
					</div>
				</d2l-input-checkbox-spacer>
			</div>
		`;
	}

	_onTransitionEnd() {
		if (this._state === states.EXPANDING) {
			this._state = states.EXPANDED;
		} if (this._state === states.COLLAPSING) {
			this._state = states.COLLAPSED;
		}
	}
}
customElements.define('d2l-labs-checkbox-with-drawer', CheckboxWithDrawer);
