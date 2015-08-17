'use strict';

describe('Agents E2E Tests:', function() {
	describe('Test Agents page', function() {
		it('Should not include new Agents', function() {
			browser.get('http://localhost:3000/#!/agents');
			expect(element.all(by.repeater('agent in agents')).count()).toEqual(0);
		});
	});
});
