'use strict';

describe('Formations E2E Tests:', function() {
	describe('Test Formations page', function() {
		it('Should not include new Formations', function() {
			browser.get('http://localhost:3000/#!/formations');
			expect(element.all(by.repeater('formation in formations')).count()).toEqual(0);
		});
	});
});
