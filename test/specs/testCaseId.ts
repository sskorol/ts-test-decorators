import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { clean, runMocha } from '../utils';

@suite
class TestCaseIdSuite {
  before() {
    clean();
  }

  @test
  shouldCallTestCaseIdOnReporter() {
    return runMocha(['testCaseId']).then(results => {
      const result = results[0];

      expect(result('ns2\\:test-suite > name').text()).to.be.equal('TestCaseIdSuite');
      expect(
        result('test-case > name')
          .eq(0)
          .text()
      ).to.be.equal('shouldCallTestCaseIdOnReporter');
      expect(
        result('test-case label[name="testId"]')
          .eq(0)
          .attr('value')
      ).to.be.equal('2');
    });
  }
}
