import { suite, test } from 'mocha-typescript';
import { step } from '../../../index';

@suite
class Step {
  @test
  shouldAddDecoratedSteps() {
    this.step1();
    this.step2();
    this.step3();
    this.step5().step1();
  }

  @step('Execute step 1')
  step1() {}

  @step('Execute step 2')
  step2() {
    this.step3();
  }

  @step('Execute step 3')
  step3() {
    this.step4();
  }

  @step('Execute step 4')
  step4() {}

  @step('Execute step 5')
  step5() {
    return this.step6();
  }

  @step('Execute step 6')
  step6() {
    return this;
  }
}
