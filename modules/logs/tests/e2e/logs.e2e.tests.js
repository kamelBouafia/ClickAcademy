'use strict';

describe('Logs E2E Tests:', function() {
	describe('Test Logs page', function() {
		it('Should not include new Logs', function() {
			browser.get('http://localhost:3000/#!/logs');
			expect(element.all(by.repeater('log in logs')).count()).toEqual(0);
		});
	});
});
