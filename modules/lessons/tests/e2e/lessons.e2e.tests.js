'use strict';

describe('Lessons E2E Tests:', function() {
	describe('Test Lessons page', function() {
		it('Should not include new Lessons', function() {
			browser.get('http://localhost:3000/#!/lessons');
			expect(element.all(by.repeater('lesson in lessons')).count()).toEqual(0);
		});
	});
});
