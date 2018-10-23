import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { clean, runMocha } from '../utils';

@suite
class SeveritySuite {
  before() {
    clean();
  }

  @test
  shouldCallSeverityOnReporter() {
    return runMocha(['severity']).then(results => {
      const result = results[0];

      expect(result('ns2\\:test-suite > name').text()).to.be.equal('SeveritySuite');
      expect(
        result('test-case > name')
          .eq(0)
          .text()
      ).to.be.equal('shouldCallSeverityOnReporter');
      expect(
        result('test-case label[name="severity"]')
          .eq(0)
          .attr('value')
      ).to.be.equal('blocker');
    });
  }
}
