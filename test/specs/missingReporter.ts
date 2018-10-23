import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { clean, runMocha } from '../utils';

@suite
class MissingReporterSuite {
  before() {
    clean();
  }

  @test
  shouldNotApplyDecorators() {
    return runMocha(['missingReporter'], './test/fixtures/wdio.conf/wdio.conf.with.missing.reporter.js').then(
      results => {
        const result = results[0];

        expect(result('ns2\\:test-suite > name').text()).to.be.equal('MissingReporterSuite');
        expect(
          result('test-case > name')
            .eq(0)
            .text()
        ).to.be.equal('shouldNotApplyDecorators');
        expect(
          result('test-case label[name="feature"]')
            .eq(0)
            .attr('value')
        ).to.be.equal(undefined);
        expect(
          result('test-case label[name="story"]')
            .eq(0)
            .attr('value')
        ).to.be.equal(undefined);
        expect(
          result('test-case label[name="testId"]')
            .eq(0)
            .attr('value')
        ).to.be.equal(undefined);
        expect(
          result('test-case label[name="issue"]')
            .eq(0)
            .attr('value')
        ).to.be.equal(undefined);
        expect(
          result('test-case label[name="severity"]')
            .eq(0)
            .attr('value')
        ).to.be.equal(undefined);
      }
    );
  }
}
