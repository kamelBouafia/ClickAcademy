'use strict';

describe('Professors E2E Tests:', function() {
	describe('Test Professors page', function() {
		it('Should not include new Professors', function() {
			browser.get('http://localhost:3000/#!/professors');
			expect(element.all(by.repeater('professor in professors')).count()).toEqual(0);
		});
	});
});
