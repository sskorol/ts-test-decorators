import { suite, test } from 'mocha-typescript';
import { severity, SeverityLevel } from '../../../index';

@suite
class SeveritySuite {
  @severity(SeverityLevel.Blocker)
  @test
  shouldCallSeverityOnReporter() {}
}
