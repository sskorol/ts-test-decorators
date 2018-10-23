import { suite, test } from 'mocha-typescript';
import { User } from '../../model/user';

@suite
class StepSuite {
  @test
  shouldCallStepOnReporter() {
    new User('Sergey', 'Korol').toString();
  }
}
