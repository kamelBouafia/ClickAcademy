'use strict';

describe('Students E2E Tests:', function() {
	describe('Test Students page', function() {
		it('Should not include new Students', function() {
			browser.get('http://localhost:3000/#!/students');
			expect(element.all(by.repeater('student in students')).count()).toEqual(0);
		});
	});
});
