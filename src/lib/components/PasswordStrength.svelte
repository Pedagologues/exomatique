<script>
	export let password;
	import checkPasswordStrength from 'check-password-strength';

	$: strength = checkPasswordStrength.passwordStrength(password);
</script>

<div id="color-indicators">
	<span class:valid={strength.id >= 0}></span>
	<span class:valid={strength.id >= 1}></span>
	<span class:valid={strength.id >= 2}></span>
	<span class:valid={strength.id >= 3}></span>
</div>
<ul>
	<li class:valid={strength.contains.includes('lowercase')}>Lowercase</li>
	<li class:valid={strength.contains.includes('uppercase')}>Uppercase</li>
	<li class:valid={strength.contains.includes('number')}>Number</li>
	<li class:valid={strength.contains.includes('symbol')}>Symbol</li>
</ul>

<style>
	#color-indicators {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		column-gap: 0.2rem;
	}
	#color-indicators span {
		height: 5px;
	}
	span.valid:nth-child(1) {
		background-color: red;
	}
	span.valid:nth-child(2) {
		background-color: orange;
	}
	span.valid:nth-child(3) {
		background-color: yellow;
	}
	span.valid:nth-child(4) {
		background-color: green;
	}

	li.valid {
		color: green;
	}
</style>
