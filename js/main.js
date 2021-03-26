const mySwiper = new Swiper('.swiper-container', {
	loop: true,

	// Navigation arrows
	navigation: {
		nextEl: '.slider-button-next',
		prevEl: '.slider-button-prev',
	},
});

// cart

const buttonCart = document.querySelector('.button-cart'),
	modalCart = document.getElementById('modal-cart');

const openModal = () => {
		modalCart.classList.add('show');
	},
	closeModal = () => {
		modalCart.classList.remove('show');
		document.body.removeEventListener('keydown', closeModal);
	};

buttonCart.addEventListener('click', openModal);

modalCart.addEventListener('click', e => {
	const target = e.target;

	if (target === modalCart || target.classList.contains('modal-close')) {
		closeModal();
	}
});

document.body.addEventListener('keydown', e => {
	if (e.code === 'Escape') {
		closeModal();
	}
});

// scroll smoth

const scrollLink = document.querySelectorAll('a.scroll-link');

const scrolling = (event, elem) => {
	event.preventDefault();
	const w = window.pageYOffset,
		hash = elem.href.replace(/[^#]*(.*)/, '$1');

	const t = document.querySelector(hash).getBoundingClientRect().top;

	let start = null;

	const step = time => {
		if (start === null) {
			start = time;
		}

		const progress = time - start,
			r = (t < 0 ? Math.max(w - progress / 0.3, w + t) : Math.min(w + progress / 0.3, w + t));
		window.scrollTo(0, r);
		if (r !== w + t) {
			requestAnimationFrame(step);
		} else {
			location.hash = hash;
		}
	};

	requestAnimationFrame(step);
};

scrollLink.forEach(item => {
	item.addEventListener('click', e => {
		scrolling(e, item);
	})
});