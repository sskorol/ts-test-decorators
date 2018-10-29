import { suite, test } from 'mocha-typescript';
import { tag } from '../../../index';

@suite
class Tag {
  @tag('regression')
  @test
  shouldAssignDecoratedTag() {}
}
