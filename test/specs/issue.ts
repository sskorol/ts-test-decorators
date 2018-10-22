import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { clean, runMocha } from '../utils';

@suite
class IssueSuite {
  before() {
    clean();
  }

  @test
  shouldCallIssueOnReporter() {
    return runMocha(['issue']).then(results => {
      const result = results[0];

      expect(result('ns2\\:test-suite > name').text()).to.be.equal('IssueSuite');
      expect(
        result('test-case > name')
          .eq(0)
          .text()
      ).to.be.equal('shouldCallIssueOnReporter');
      expect(
        result('test-case label[name="issue"]')
          .eq(0)
          .attr('value')
      ).to.be.equal('1');
    });
  }
}
