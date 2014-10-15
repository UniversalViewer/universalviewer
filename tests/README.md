You need to run the 'serve' grunt task before running karma.

To generate scenario stubs empty the steps.js file, then run:

`cucumber-js tests/features`

todo: is there a way to avoid manually emptying steps.js?

Don't forget to replace 'this.Given' with 'scenario.Given'.