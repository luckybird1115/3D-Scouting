const canvas = document.querySelector( '#canvas' );
const container = document.querySelector( '#container' );

const leftItem = {
	optionSetting: document.querySelector( '#optionSetting' ),
	animations: document.querySelector( '#animations' )
};
const button = {
	settingBtn: document.querySelector( '#settingBtn' ),
	animationBtn: document.querySelector( '#animationBtn' )
};

const masthead = document.querySelector( '.masthead' );
const footer = document.querySelector( '.page__footer' );

const loading = {
	bar: document.querySelector( '#loading-bar' ),
	overlay: document.querySelector( '#loading-overlay' ),
	revealOnLoad: document.querySelectorAll( '.reveal-on-load' ),
	hideOnLoad: document.querySelectorAll( '.hide-on-load' ),
	progress: document.querySelector( '#progress' ),
};

const skinSelecters = {
	skin_general: document.querySelector( '#skin_general' ),
	skin_white: document.querySelector( '#skin_white' ),
	skin_black: document.querySelector( '#skin_black' ),
};
const clothSelecters = {
	cloth_yellow: document.querySelector( '#cloth_yellow' ),
	cloth_red: document.querySelector( '#cloth_red' ),
	cloth_green: document.querySelector( '#cloth_green' ),
};
const weightChange = document.querySelector( '#weightChange' );
const tallerChange = document.querySelector( '#tallerChange' );

const animSelecters = {
	idle_low 	 : document.querySelector( '#idle_low' ),
	clapping_low : document.querySelector( '#clapping_low' ),
	catchball_low: document.querySelector( '#catchball_low' ),
	defeat_low 	 : document.querySelector( '#defeat_low' ),
	defeat2_low	 : document.querySelector( '#defeat2_low' ),
	jump_low	 : document.querySelector( '#jump_low' ),
	kick_low 	 : document.querySelector( '#kick_low' ),
	run_low 	 : document.querySelector( '#run_low' ),
	runback_low	 : document.querySelector( '#runback_low' ),
	runfront_low : document.querySelector( '#runfront_low' ),
	runleft_low	 : document.querySelector( '#runleft_low' ),
	runright_low : document.querySelector( '#runright_low' ),
	shove_low 	 : document.querySelector( '#shove_low' ),
	snap_low 	 : document.querySelector( '#snap_low' ),
	tackle_low 	 : document.querySelector( '#tackle_low' ),
	throw_low 	 : document.querySelector( '#throw_low' ),
	touchdown_low: document.querySelector( '#touchdown_low' ),
	victory_low	 : document.querySelector( '#victory_low' ),
	victory2_low : document.querySelector( '#victory2_low' ),
	victory3_low : document.querySelector( '#victory3_low' ),
	warmup_low 	 : document.querySelector( '#warmup_low' ),
};

export default class HTMLControl {
	static setInitialState() {}
	static setOnLoadStartState() {
		loading.bar.classList.remove( 'hide' );
	}
	static setOnLoadEndState() {
		loading.overlay.classList.add( 'hide' );
		for ( let i = 0; i < loading.hideOnLoad.length; i++ ) {
			loading.hideOnLoad[ i ].classList.add( 'hide' );
		}
		for ( let i = 0; i < loading.revealOnLoad.length; i++ ) {
			loading.revealOnLoad[ i ].classList.remove( 'hide' );
		}
	}
}

HTMLControl.canvas = canvas;
HTMLControl.container = container;
HTMLControl.leftItem = leftItem;
HTMLControl.button = button;
HTMLControl.masthead = masthead;
HTMLControl.footer = footer;
HTMLControl.loading = loading;
HTMLControl.animSelecters = animSelecters;
HTMLControl.skinSelecters = skinSelecters;
HTMLControl.clothSelecters = clothSelecters;
HTMLControl.weightChange = weightChange;
HTMLControl.tallerChange = tallerChange;
