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

// goods

const more = document.querySelector('.more'),
	navigationLink = document.querySelectorAll('.navigation-link'),
	longGoodsList = document.querySelector('.long-goods-list'),
	sectionTitle = document.querySelectorAll('.section-title')[1],
	cardOne = document.querySelector('.card-1'),
	cardTwo = document.querySelector('.card-2');

const getGoods = async () => {
		const result = await fetch('db/db.json');

		if (!result.ok) {
			throw console.error(`Ошибка ${res.status}!`);
		}

		return await result.json();
	},
	createCard = ({
		id,
		label,
		img,
		name,
		description,
		price
	}) => {
		const card = document.createElement('div');

		card.className = 'col-lg-3 col-sm-6';

		card.id = id;

		card.innerHTML = `
			<div class="goods-card">
				${label ? `<span class="label">${label}</span>` : ''}
				<img src="db/${img}" alt="image: ${name}" class="goods-image">
				<h3 class="goods-title">${name}</h3>
				<p class="goods-description">${description}</p>
				<button class="button goods-card-btn add-to-cart" data-id="${id}">
					<span class="button-price">$${price}</span>
				</button>
			</div>`;

		return card;
	},
	renderCards = data => {
		longGoodsList.textContent = '';

		const cards = data.map(createCard);

		longGoodsList.append(...cards);

		document.body.classList.add('show-goods');
	},
	filterCards = (field, value) => {
		getGoods()
			.then(data => data.filter(good => good[field] === value))
			.then(renderCards);
	};

more.addEventListener('click', e => {
	e.preventDefault();

	scrolling(e, more);

	getGoods().then(renderCards);
});

navigationLink.forEach(link => link.addEventListener('click', e => {
	e.preventDefault();

	if (link.textContent === 'All') {
		sectionTitle.textContent = 'All goods'
		getGoods().then(renderCards);
	} else {
		sectionTitle.textContent = link.textContent;
		filterCards(link.dataset.field, link.textContent);
	}
}));

cardOne.addEventListener('click', e => {
	if (e.target.closest('.button')) {
		sectionTitle.textContent = 'Clothing';
		filterCards('category', 'Clothing');
	}
})
cardTwo.addEventListener('click', e => {
	if (e.target.closest('.button')) {
		sectionTitle.textContent = 'Accessories';
		filterCards('category', 'Accessories');
	}
})