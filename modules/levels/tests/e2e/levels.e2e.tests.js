'use strict';

describe('Levels E2E Tests:', function() {
	describe('Test Levels page', function() {
		it('Should not include new Levels', function() {
			browser.get('http://localhost:3000/#!/levels');
			expect(element.all(by.repeater('level in levels')).count()).toEqual(0);
		});
	});
});
