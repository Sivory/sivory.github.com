var GameData = function() {
	this.zombieConfig = [{
		hp: 30,
		name: '白领僵尸',
		walkAnimation: assets('zombieWalk001'),
		walkAnimationDuration: 2000,
		attackAnimation: assets('zombieAttack001'),
		attackAnimationDuration: 1000,
		birthAnimation: assets('zombieBirth001'),
		birthAnimationDuration: 2000,
		deadAnimation: assets('zombieDead001'),
		deadAnimationDuration: 1000,
		animationOriginPoint: {
			x: 311,
			y: 528
		},
		attackDelay: 2000
	}, {
		hp: 40,
		name: '工人僵尸',
		walkAnimation: assets('zombieWalk002'),
		walkAnimationDuration: 2000,
		attackAnimation: assets('zombieAttack002'),
		attackAnimationDuration: 1000,
		birthAnimation: assets('zombieBirth002'),
		birthAnimationDuration: 2000,
		deadAnimation: assets('zombieDead002'),
		deadAnimationDuration: 1000,
		animationOriginPoint: {
			x: 300,
			y: 490
		},
		attackDelay: 2000
	}, {
		hp: 200,
		name: '剧毒僵尸',
		walkAnimation: assets('zombieWalk003'),
		walkAnimationDuration: 2000,
		attackAnimation: assets('zombieAttack003'),
		attackAnimationDuration: 1000,
		birthAnimation: assets('zombieBirth003'),
		birthAnimationDuration: 1000,
		deadAnimation: assets('zombieDead003'),
		deadAnimationDuration: 1000,
		animationOriginPoint: {
			x: 296,
			y: 548
		},
		attackDelay: 2000
	}, {
		hp: 50,
		name: '快递僵尸',
		walkAnimation: assets('zombieWalk004'),
		walkAnimationDuration: 2000,
		attackAnimation: assets('zombieAttack004'),
		attackAnimationDuration: 1000,
		birthAnimation: assets('zombieBirth004'),
		birthAnimationDuration: 1000,
		deadAnimation: assets('zombieDead004'),
		deadAnimationDuration: 1000,
		animationOriginPoint: {
			x: 321,
			y: 562
		},
		attackDelay: 2000
	}, {
		hp: 100,
		name: '军人僵尸',
		walkAnimation: assets('zombieWalk005'),
		walkAnimationDuration: 2000,
		attackAnimation: assets('zombieAttack005'),
		attackAnimationDuration: 1000,
		birthAnimation: assets('zombieBirth005'),
		birthAnimationDuration: 1000,
		deadAnimation: assets('zombieDead005'),
		deadAnimationDuration: 1000,
		animationOriginPoint: {
			x: 315,
			y: 533
		},
		attackDelay: 2000
	}];

	this.gunConfig = [{
		animation: assets('gunAnimation001'),
		fireX: 116,
		fireY: 115,
		damage: 10,
		oneShoot: true,
		shootDelay: 500,
		shakeDistance: 20,
		fireDuration: 300
	}, {
		animation: assets('gunAnimation002'),
		fireX: 140,
		fireY: 90,
		damage: 20,
		oneShoot: true,
		shootDelay: 500,
		shakeDistance: 30,
		fireDuration: 300
	}, {
		animation: assets('gunAnimation003'),
		fireX: 192,
		fireY: 335,
		damage: 5,
		oneShoot: false,
		shootDelay: 100,
		shakeDistance: 40,
		fireDuration: 100
	}];
};

exports = GameData;