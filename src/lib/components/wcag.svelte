<script>
	import { onMount } from 'svelte';

	const STORAGE_KEY = 'preference:wcag';

	const defaults = {
		zoom: 100,
		textSpacing: 'default',
		lineHeight: 'default',
		focus: 'default',
		targetSize: 'default',
		links: true,
		reducedMotion: false,
		highContrast: false
	};

	const options = {
		textSpacing: {
			default: {
				letter: null,
				word: null
			},
			increased: {
				letter: '0.06em',
				word: '0.12em'
			},
			large: {
				letter: '0.12em',
				word: '0.16em'
			}
		},

		lineHeight: {
			default: null,
			increased: '1.75',
			large: '2'
		},

		focus: {
			default: null,
			strong: '4px',
			stronger: '5px'
		},

		targetSize: {
			default: null,
			large: '32px',
			larger: '44px'
		}
	};

	let preferences = $state({ ...defaults });
	let zoom = $state(defaults.zoom);


	onMount(() => {
		try {
			const saved = localStorage.getItem(STORAGE_KEY);

			if (saved) {
				preferences = {
					...defaults,
					...JSON.parse(saved)
				};
			}
		} catch {
			preferences = { ...defaults };
		}

		zoom = Number(preferences.zoom);

		apply();
	});


	function update(key, value) {
		preferences = {
			...preferences,
			[key]: value
		};

		save();
		apply();
	}


	function save() {
		localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify(preferences)
		);
	}


	function css(name, value) {
		const root = document.documentElement;

		if (
			value === null ||
			value === undefined ||
			value === false
		) {
			root.style.removeProperty(name);
			return;
		}

		root.style.setProperty(name, value);
	}


	function apply() {
		const spacing =
			options.textSpacing[preferences.textSpacing] ??
			options.textSpacing.default;


		/* Zoom */

		css(
			'--wcag-zoom',
			preferences.zoom === 100
				? null
				: preferences.zoom / 100
		);

		css(
			'--wcag-font-size',
			preferences.zoom === 100
				? null
				: `${preferences.zoom}%`
		);


		/* Text spacing */

		css(
			'--wcag-letter-spacing',
			spacing.letter
		);

		css(
			'--wcag-word-spacing',
			spacing.word
		);


		/* Line height */

		css(
			'--wcag-line-height',
			options.lineHeight[preferences.lineHeight]
		);


		/* Focus */

		css(
			'--wcag-focus-width',
			preferences.highContrast
				? '4px'
				: options.focus[preferences.focus]
		);


		/* Target size */

		css(
			'--wcag-target-size',
			options.targetSize[preferences.targetSize]
		);


		/* Links */

		css(
			'--wcag-link-decoration',
			preferences.links
				? 'underline'
				: null
		);


		/* Reduced motion */

		css(
			'--wcag-animation-duration',
			preferences.reducedMotion
				? '0.01ms'
				: null
		);

		css(
			'--wcag-transition-duration',
			preferences.reducedMotion
				? '0.01ms'
				: null
		);

		css(
			'--wcag-animation-iterations',
			preferences.reducedMotion
				? '1'
				: null
		);

		css(
			'--wcag-scroll-behavior',
			preferences.reducedMotion
				? 'auto'
				: null
		);
	}


	function updateZoom(value) {
		const nextZoom = Math.min(
			200,
			Math.max(
				75,
				Number(value)
			)
		);

		zoom = nextZoom;

		update('zoom', nextZoom);
	}


	function changeZoom(amount) {
		updateZoom(
			zoom + amount
		);
	}


	function reset() {
		preferences = { ...defaults };
		zoom = defaults.zoom;

		localStorage.removeItem(STORAGE_KEY);

		const properties = [
			'--wcag-zoom',
			'--wcag-font-size',
			'--wcag-letter-spacing',
			'--wcag-word-spacing',
			'--wcag-line-height',
			'--wcag-focus-width',
			'--wcag-target-size',
			'--wcag-link-decoration',
			'--wcag-animation-duration',
			'--wcag-transition-duration',
			'--wcag-animation-iterations',
			'--wcag-scroll-behavior'
		];

		for (const property of properties) {
			document.documentElement.style.removeProperty(
				property
			);
		}
	}
</script>


<div class="wrapper" aria-labelledby="wcag-title">

	<!-- Header -->

	<header>
		<div>
			<h2 id="wcag-title">
				Accessibility
			</h2>

			<p>
				Adjust the page to suit you.
			</p>
		</div>

		<button
			class="reset"
			type="button"
			onclick={reset}
		>
			Reset
		</button>
	</header>


	<!-- Zoom -->

	<section class="panel zoom-panel">
		<div class="title">
			<strong>Zoom</strong>
			<output>{zoom}%</output>
		</div>

		<div class="range">
			<input
				type="range"
				min="75"
				max="200"
				step="25"
				list="wcag-zoom-values"
				bind:value={zoom}
				aria-label="Page zoom"
				onchange={(event) =>
					updateZoom(
						event.currentTarget.value
					)}
			/>

			<datalist id="wcag-zoom-values">
				<option value="75" label="75%"></option>
				<option value="100" label="100%"></option>
				<option value="125" label="125%"></option>
				<option value="150" label="150%"></option>
				<option value="175" label="175%"></option>
				<option value="200" label="200%"></option>
			</datalist>
		</div>

		<div class="zoom-actions">
			<button
				type="button"
				onclick={() => changeZoom(-25)}
				disabled={zoom <= 75}
			>
				<b aria-hidden="true">−</b>

				<span>
					Zoom out
				</span>
			</button>

			<button
				type="button"
				onclick={() => changeZoom(25)}
				disabled={zoom >= 200}
			>
				<span>
					Zoom in
				</span>

				<b aria-hidden="true">+</b>
			</button>
		</div>
	</section>


	<!-- Text -->

	<section class="panel">
		<h3>Text</h3>

		<div class="setting">
			<label for="wcag-spacing">
				<strong>
					Text spacing
				</strong>

				<small>
					Space between letters and words
				</small>
			</label>

			<select
				id="wcag-spacing"
				value={preferences.textSpacing}
				onchange={(event) =>
					update(
						'textSpacing',
						event.currentTarget.value
					)}
			>
				<option value="default">
					Default
				</option>

				<option value="increased">
					Increased
				</option>

				<option value="large">
					Large
				</option>
			</select>
		</div>

		<div class="setting">
			<label for="wcag-line-height">
				<strong>
					Line spacing
				</strong>

				<small>
					Space between lines of text
				</small>
			</label>

			<select
				id="wcag-line-height"
				value={preferences.lineHeight}
				onchange={(event) =>
					update(
						'lineHeight',
						event.currentTarget.value
					)}
			>
				<option value="default">
					Default
				</option>

				<option value="increased">
					Increased
				</option>

				<option value="large">
					Large
				</option>
			</select>
		</div>
	</section>


	<!-- Navigation -->

	<section class="panel">
		<h3>Navigation</h3>

		<div class="setting">
			<label for="wcag-focus">
				<strong>
					Focus visibility
				</strong>

				<small>
					Keyboard selection outline
				</small>
			</label>

			<select
				id="wcag-focus"
				value={preferences.focus}
				onchange={(event) =>
					update(
						'focus',
						event.currentTarget.value
					)}
			>
				<option value="default">
					Default
				</option>

				<option value="strong">
					Strong
				</option>

				<option value="stronger">
					Extra strong
				</option>
			</select>
		</div>

		<div class="setting">
			<label for="wcag-target">
				<strong>
					Control size
				</strong>

				<small>
					Buttons and other controls
				</small>
			</label>

			<select
				id="wcag-target"
				value={preferences.targetSize}
				onchange={(event) =>
					update(
						'targetSize',
						event.currentTarget.value
					)}
			>
				<option value="default">
					Default
				</option>

				<option value="large">
					Large
				</option>

				<option value="larger">
					Extra large
				</option>
			</select>
		</div>

		<label class="toggle">
			<span>
				<strong>
					Underline links
				</strong>

				<small>
					Make links easier to identify
				</small>
			</span>

			<input
				type="checkbox"
				checked={preferences.links}
				onchange={(event) =>
					update(
						'links',
						event.currentTarget.checked
					)}
			/>
		</label>
	</section>


	<!-- Visual -->

	<section class="panel">
		<h3>Visual</h3>

		<label class="toggle">
			<span>
				<strong>
					Reduce motion
				</strong>

				<small>
					Limit animations and transitions
				</small>
			</span>

			<input
				type="checkbox"
				checked={preferences.reducedMotion}
				onchange={(event) =>
					update(
						'reducedMotion',
						event.currentTarget.checked
					)}
			/>
		</label>

		<label class="toggle">
			<span>
				<strong>
					Higher contrast
				</strong>

				<small>
					Make controls easier to see
				</small>
			</span>

			<input
				type="checkbox"
				checked={preferences.highContrast}
				onchange={(event) =>
					update(
						'highContrast',
						event.currentTarget.checked
					)}
			/>
		</label>
	</section>

</div>


<style lang="scss">
	.wrapper {
    padding: 1em;

		--panel: #202124;
		--control: #292a2d;
		--control-hover: #303134;
		--border: #3c4043;
		--text: #f1f3f4;
		--muted: #9aa0a6;
		--accent: #4fc3f7;

		inline-size: min(100%, 31rem);

		color: var(--text);

		font-family:
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			sans-serif;
	}


	/* Cards */

	:is(header, .panel) {
		border: 1px solid var(--border);
		border-radius: 0.9rem;

		background: var(--panel);

		box-shadow:
			0 2px 8px rgb(0 0 0 / 18%);
	}


	/* Header */

	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;

		margin-block-end: 0.75rem;
		padding: 1rem;

		div {
			display: grid;
			gap: 0.15rem;
		}

		:is(h2, p) {
			margin: 0;
		}

		h2 {
			color: var(--text);

			font-size: 1.05rem;
			font-weight: 600;
			line-height: 1.25;
		}

		p {
			color: var(--muted);

			font-size: 0.78rem;
			line-height: 1.4;
		}
	}


	/* Panels */

	.panel {
		margin-block-end: 0.75rem;
		padding: 1rem;

		h3 {
			margin: 0 0 0.7rem;

			color: var(--muted);

			font-size: 0.72rem;
			font-weight: 600;

			letter-spacing: 0.06em;
			text-transform: uppercase;
		}
	}


	/* Settings */

	:is(.setting, .toggle) {
		display: grid;
		grid-template-columns:
			minmax(0, 1fr)
			auto;

		align-items: center;
		gap: 1rem;

		min-block-size: 3.6rem;
	}

	:is(.setting, .toggle)
		+ :is(.setting, .toggle) {

		border-block-start:
			1px solid
			color-mix(
				in srgb,
				var(--border) 60%,
				transparent
			);
	}

	:is(
		.setting label,
		.toggle > span
	) {
		display: grid;
		gap: 0.12rem;

		min-inline-size: 0;
	}

	:is(.setting, .toggle) strong {
		font-size: 0.92rem;
		font-weight: 500;
	}

	:is(.setting, .toggle) small {
		color: var(--muted);
		font-size: 0.75rem;
	}


	/* Select */

	select {
		min-inline-size: 8.5rem;
		block-size: 2.35rem;

		padding-inline:
			0.75rem
			2rem;

		border:
			1px solid
			var(--border);

		border-radius: 0.5rem;

		background: var(--control);
		color: var(--text);

		font: inherit;
		font-size: 0.82rem;

		cursor: pointer;

		&:hover {
			background:
				var(--control-hover);
		}
	}


	/* Zoom */

	.zoom-panel {
		.title {
			display: flex;
			align-items: baseline;
			gap: 0.35rem;

			margin-block-end: 0.75rem;

			strong {
				font-size: 1rem;
			}

			output {
				color: var(--muted);
				font-size: 0.9rem;
			}
		}
	}


	/* Range */

	.range {
		display: grid;
		gap: 0.3rem;

		inline-size: 100%;

		input[type='range'] {
			inline-size: 100%;
			margin: 0;

			accent-color: var(--accent);

			cursor: pointer;
		}

		datalist {
			display: flex;
			justify-content: space-between;

			inline-size: 100%;
		}
	}


	/* Zoom actions */

	.zoom-actions {
		display: flex;
		justify-content: space-between;

		margin-block-start: 0.6rem;

		button {
			display: flex;
			align-items: center;
			gap: 0.4rem;

			padding: 0.25rem;

			border: 0;

			background: transparent;
			color: var(--muted);

			font: inherit;
			font-size: 0.78rem;

			cursor: pointer;

			&:hover:not(:disabled) {
				color: var(--text);
			}

			&:disabled {
				opacity: 0.35;
				cursor: default;
			}

			b {
				display: grid;
				place-items: center;

				inline-size: 1.15rem;
				block-size: 1.15rem;

				border:
					1px solid
					currentColor;

				border-radius: 50%;

				font-size: 0.9rem;
				font-weight: 400;
				line-height: 1;
			}
		}
	}


	/* Toggle */

	.toggle {
		cursor: pointer;

		input {
			appearance: none;

			position: relative;

			inline-size: 2.35rem;
			block-size: 1.3rem;

			margin: 0;

			border:
				1px solid
				var(--border);

			border-radius: 100vw;

			background: var(--control);

			cursor: pointer;

			transition:
				background 120ms ease,
				border-color 120ms ease;

			&::before {
				content: '';

				position: absolute;
				inset-block-start: 50%;
				inset-inline-start: 0.17rem;

				inline-size: 0.85rem;
				block-size: 0.85rem;

				border-radius: 50%;

				background: var(--muted);

				transform:
					translateY(-50%);

				transition:
					transform 120ms ease,
					background 120ms ease;
			}

			&:checked {
				border-color: var(--accent);

				background:
					color-mix(
						in srgb,
						var(--accent) 35%,
						var(--control)
					);

				&::before {
					background: var(--accent);

					transform:
						translate(
							1rem,
							-50%
						);
				}
			}
		}
	}


	/* Reset */

	.reset {
		flex: 0 0 auto;

		block-size: 2.25rem;

		padding-inline: 0.8rem;

		border:
			1px solid
			var(--border);

		border-radius: 0.5rem;

		background: var(--control);
		color: var(--text);

		font: inherit;
		font-size: 0.8rem;

		cursor: pointer;

		&:hover {
			background:
				var(--control-hover);
		}
	}


	/* Mobile */

	@media (max-width: 30rem) {
		.setting {
			grid-template-columns: 1fr;

			padding-block: 0.7rem;

			select {
				inline-size: 100%;
			}
		}
	}
</style>