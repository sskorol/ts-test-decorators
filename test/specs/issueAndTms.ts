import { Status } from 'allure2-js-commons';
import { expect } from 'chai';
import { suite } from 'mocha-typescript';
import { cleanResults, findLinks, findTest, runTests, whenResultsAppeared } from '../utils';

@suite
class IssueAndTmsSuite {
  before() {
    cleanResults();
    runTests('issueAndTms');
  }

  @test
  shouldHaveIssueAndTmsLinks() {
    const testName = 'shouldAssignDecoratedIssueAndTms';
    return whenResultsAppeared().then(results => {
      expect(findTest('IssueAndTms')).not.eq(undefined);

      const links = findLinks(testName);
      expect(links).length(2);
      expect(findTest(testName).status).eq(Status.PASSED);

      expect(links.map(link => link.name)).contains('4', '5');
      expect(links.map(link => link.url)).contains('http://localhost/4', 'http://localhost/5');
      expect(links.map(link => link.type)).contains('issue', 'tms');
    });
  }
}
