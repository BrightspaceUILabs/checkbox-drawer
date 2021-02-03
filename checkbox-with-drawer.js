import '@brightspace-ui/core/components/inputs/input-checkbox.js';
import '@brightspace-ui/core/components/inputs/input-checkbox-spacer.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { styleMap } from 'lit-html/directives/style-map.js';


const states = {
	// PRECOLLAPSING: 'precollapsing', // setting up the styles so the collapse transition will run
	COLLAPSING: 'collapsing', // in the process of collapsing
	COLLAPSED: 'collapsed', // fully collapsed
	// PREEXPANDING: 'preexpanding', // setting up the styles so the expand transition will run
	// EXPANDING: 'expanding', // in the process of expanding
	EXPANDED: 'expanded', // fully expanded
};

class CheckboxWithDrawer extends LitElement {

	static get properties() {
		return {
			checked: { type: Boolean },
			_opacity: { type: String },
			_transform: { type: String },
			_state: { type: String }
		};
	}

	static get styles() {
		return css`
			:host {
				display: inline-block;
			}

			:host([hidden]) {
				display: none;
			}

			.d2l-input-checkbox {
				margin-bottom: 0;
			}

			.d2l-input-checkbox-description {
				font-size: 0.7em;
			}

			.d2l-expand-collapse-content-fade {
				overflow: hidden;
				position: absolute;
				transition: all 500ms cubic-bezier(0, 0.7, 0.5, 1);
			}

			.d2l-expand-collapse-content-fade:not([data-state="collapsed"]) {
				position: static;
			}

			.d2l-expand-collapse-content-fade[data-state="expanded"] {
				overflow: visible;
			}
		`;
	}

	constructor() {
		super();
		this.checked = false;
		this._opacity = '0';
		this._transform = 'translateY(-10px)';
		this._isFirstUpdate = true;
		this._state = states.COLLAPSED;
	}

	firstUpdated() {
		const checkbox = this.shadowRoot.querySelector('.d2l-input-checkbox');
		checkbox.addEventListener('change', (e) => {
			this.checked = checkbox.checked;
		});
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		if (changedProperties.has('checked')) {
			if (this.checked) {
				this._state = states.EXPANDED;
				this._opacity = '1';
				this._transform = 'translateY(0%)';
			} else {
				if (this._isFirstUpdate) {
					this._state = states.COLLAPSED;
				} else {
					this._state = states.COLLAPSING;
					this._opacity = '0';
					this._transform = 'translateY(-10px)';
				}
			}
			this._isFirstUpdate = false;
		}
	}

	render() {
		const styles = {
			opacity: this._opacity,
			transform: this._transform
		};
		return html`
			<d2l-input-checkbox class="d2l-input-checkbox">Label for checkbox</d2l-input-checkbox>
			<d2l-input-checkbox-spacer>
				<div class="d2l-input-checkbox-description">Additional content can go here and will
				line up nicely with the edge of the checkbox.</div>
			</d2l-input-checkbox-spacer>
			<d2l-input-checkbox-spacer>
				<div class="d2l-expand-collapse-content-fade" data-state="${this._state}" @transitionend=${this._onTransitionEnd} style=${styleMap(styles)}>
					<slot></slot>
				</div>
			</d2l-input-checkbox-spacer>
		`;
	}

	_onTransitionEnd() {
		if (this._state == states.COLLAPSING) {
			this._state = states.COLLAPSED;
		}
	}
}
customElements.define('d2l-labs-checkbox-with-drawer', CheckboxWithDrawer);
