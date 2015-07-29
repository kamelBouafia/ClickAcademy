'use strict';

describe('Candidates E2E Tests:', function() {
	describe('Test Candidates page', function() {
		it('Should not include new Candidates', function() {
			browser.get('http://localhost:3000/#!/candidates');
			expect(element.all(by.repeater('candidate in candidates')).count()).toEqual(0);
		});
	});
});
